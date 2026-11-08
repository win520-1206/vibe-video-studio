"""Shared PCM analysis. Cache only matching signal, settings and implementation."""
from pathlib import Path
import hashlib
import json
import os
import sys
import tempfile
import numpy as np
from audio_features import analyze
from music_structure import analyze as structure
from music_workflow import enrich_analysis

MODULES = ('music_pipeline.py', 'audio_features.py', 'rhythm_features.py',
           'music_structure.py', 'music_workflow.py')

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def implementation_hashes():
    return {name: digest(Path(__file__).with_name(name)) for name in MODULES}

def _encoded(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False,
                      allow_nan=False, separators=(',', ':')).encode('utf8')

def analyze_pcm(path, fps, *, source=None, duration=None, cache_dir=None):
    """Return independent features/analysis; no listening notes or timeline binding.

    A decoded WAV hash includes sample rate, gain, crop and PCM encoding. Different
    decodes intentionally do not share entries. The optional duration is the
    project's exact timeline duration rather than a new clock.
    """
    if not np.isfinite(fps) or fps <= 0:
        raise ValueError('Analysis fps must be positive and finite')
    if duration is not None and (not np.isfinite(duration) or duration <= 0):
        raise ValueError('Analysis duration must be positive and finite')
    signature = {'schema': 1, 'pcmSha256': digest(path), 'fps': fps,
                 'source': source, 'duration': duration,
                 'implementation': implementation_hashes(),
                 'runtime': {'python': sys.version.split()[0], 'numpy': np.__version__}}
    key = hashlib.sha256(_encoded(signature)).hexdigest()
    cached = Path(cache_dir) / (key + '.json') if cache_dir else None
    if cached and cached.exists():
        try:
            entry = json.loads(cached.read_text(encoding='utf8'))
            payload = entry['payload']
            if (entry['signature'] == signature and
                    entry['payloadSha256'] == hashlib.sha256(_encoded(payload)).hexdigest()):
                return payload['features'], payload['analysis']
        except (OSError, ValueError, KeyError, TypeError):
            pass  # Corrupt or partial caches never become analysis evidence.
    features = analyze(path, fps)
    if source is not None:
        features['source'] = source
    if duration is not None:
        features['duration'] = duration
        features['frames'] = round(duration * fps)
        for name in features['bands']:
            features['bands'][name] = features['bands'][name][:features['frames']]
        features['rms'] = features['rms'][:features['frames']]
    analysis = enrich_analysis(features, structure(features))
    if cached:
        payload = {'features': features, 'analysis': analysis}
        entry = {'signature': signature, 'payload': payload,
                 'payloadSha256': hashlib.sha256(_encoded(payload)).hexdigest()}
        cached.parent.mkdir(parents=True, exist_ok=True)
        temp = None
        try:
            with tempfile.NamedTemporaryFile(mode='wb', dir=cached.parent,
                                             prefix='.analysis-', delete=False) as stream:
                temp = Path(stream.name)
                # Preserve payload insertion order so cold/warm JSON exports are
                # byte-identical; integrity hashes still use canonical encoding.
                stream.write(json.dumps(entry, ensure_ascii=False, allow_nan=False,
                                        separators=(',', ':')).encode('utf8'))
            os.replace(temp, cached)
        finally:
            if temp and temp.exists():
                temp.unlink()
    return features, analysis
