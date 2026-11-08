import json
import sys
import tempfile
import unittest
import wave
from pathlib import Path
from unittest.mock import patch
import numpy as np

tools = Path(__file__).resolve().parents[1] / 'tools'
sys.path.insert(0, str(tools if (tools / 'music_pipeline.py').exists()
                       else Path(__file__).resolve().parents[3] / 'scripts'))
import music_pipeline as pipeline

class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='.pipeline-test-', dir=Path.cwd())
        self.root = Path(self.temp.name)
        self.addCleanup(self.temp.cleanup)
        self.wav = self.root / 'signal.wav'
        self.write_signal(0.2)
        self.cache = self.root / 'cache'

    def write_signal(self, gain):
        rate = 8000
        t = np.arange(rate * 3) / rate
        samples = gain * np.sin(2 * np.pi * 180 * t) * (0.1 + (t % 0.5 < 0.05))
        with wave.open(str(self.wav), 'wb') as stream:
            stream.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
            stream.writeframes((samples * 32767).astype('<i2').tobytes())

    def test_cache_reuses_matching_evidence_and_returns_independent_data(self):
        original = pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache)
        with patch.object(pipeline, 'analyze', side_effect=AssertionError('unexpected recompute')):
            result = pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache)
            self.assertEqual(original, result)
            self.assertEqual(json.dumps(original), json.dumps(result))
            result[1]['listeningStatus'] = 'confirmed'
            self.assertEqual(pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache)[1]['listeningStatus'], 'not_reviewed')

    def test_signal_fps_and_implementation_changes_invalidate_cache(self):
        pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache)
        with patch.object(pipeline, 'analyze', wraps=pipeline.analyze) as calculate:
            pipeline.analyze_pcm(self.wav, 24, cache_dir=self.cache)
            self.write_signal(0.4)
            pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache)
            with patch.object(pipeline, 'implementation_hashes', return_value={'changed': 'implementation'}):
                pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache)
            self.assertEqual(calculate.call_count, 3)

    def test_corrupt_payload_or_file_is_recomputed(self):
        original = pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache)
        file = next(self.cache.glob('*.json'))
        entry = json.loads(file.read_text(encoding='utf8'))
        entry['payload']['analysis']['listeningStatus'] = 'confirmed'
        file.write_text(json.dumps(entry), encoding='utf8')
        self.assertEqual(original, pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache))
        file.write_text('{broken', encoding='utf8')
        self.assertEqual(original, pipeline.analyze_pcm(self.wav, 30, cache_dir=self.cache))

    def test_invalid_settings_fail_before_calculation(self):
        for fps in [0, -1, float('nan')]:
            with self.assertRaises(ValueError):
                pipeline.analyze_pcm(self.wav, fps)

if __name__ == '__main__':
    unittest.main()
