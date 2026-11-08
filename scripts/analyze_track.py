"""Any user soundtrack -> reproducible evidence, report and local listening page."""
from pathlib import Path
import argparse,json,hashlib,shutil,subprocess,os,sys
import numpy as np
from music_pipeline import analyze_pcm,implementation_hashes
from music_workflow import markdown_report

def build(input_file,output,ffmpeg,fps=30,start=0,duration=None):
    input_file=Path(input_file).resolve();output=Path(output).resolve()
    if not input_file.is_file():raise ValueError('Input music not found')
    if output.exists() and (not output.is_dir() or any(output.iterdir())):raise ValueError('Output must be absent or empty; existing review work was preserved')
    if start<0 or duration is not None and duration<=0:raise ValueError('Invalid selected range')
    output.mkdir(parents=True,exist_ok=True)
    args=[ffmpeg,'-v','error','-i',str(input_file),'-ss',str(start)]
    if duration is not None:args+=['-t',str(duration)]
    args+=['-vn','-ac','1','-ar','22050','-c:a','pcm_s16le',str(output/'preview.wav')]
    subprocess.run(args,check=True,capture_output=True)
    features,analysis=analyze_pcm(output/'preview.wav',fps,source=input_file.name)
    if duration is not None and features['duration']<duration-.05:raise ValueError('Source cannot cover selected duration; choose a valid range')
    source_hash=hashlib.sha256(input_file.read_bytes()).hexdigest()
    analysis['source']=input_file.name;analysis['sourceSha256']=source_hash
    analysis['mapping']={'sourceStartSeconds':start,'timelineStartSeconds':0,'playbackRate':1}
    analysis['selectionFingerprint']=hashlib.sha256((source_hash+str(start)+str(features['duration'])+str(fps)).encode()).hexdigest()
    implementation={**implementation_hashes(),**{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__),Path(__file__).with_name('music_review.html')]}}
    def save(name,data):(output/name).write_text(json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)+'\n',encoding='utf8')
    save('features.json',features);save('track-analysis.json',analysis)
    save('beat-map.json',{'sourceSha256':source_hash,'selectionFingerprint':analysis['selectionFingerprint'],'mapping':analysis['mapping'],'tempo':analysis['tempo'],'attacks':analysis.get('attackCandidates',[]),'beatGrid':analysis['beatGrid'],'status':'candidate'})
    save('section-map.json',{'sourceSha256':source_hash,'selectionFingerprint':analysis['selectionFingerprint'],'mapping':analysis['mapping'],**{k:analysis[k] for k in ['sections','sectionTransitions','visualPhrases','impactCandidates','climaxCandidates']}})
    version=subprocess.run([ffmpeg,'-version'],capture_output=True,text=True,check=True).stdout.splitlines()[0]
    save('provenance.json',{'sourceSha256':source_hash,'sourceName':input_file.name,'startSeconds':start,'durationSeconds':features['duration'],'fps':fps,'implementation':implementation,'runtime':{'python':sys.version.split()[0],'numpy':np.__version__,'ffmpeg':version},'listeningStatus':'not_reviewed','command':'python analyze_track.py --input SOURCE --output EMPTY_DIRECTORY --ffmpeg EXECUTABLE [--start SECONDS --duration SECONDS --fps FPS]'})
    (output/'report.md').write_text(markdown_report(analysis,input_file.name),encoding='utf8')
    template=Path(__file__).with_name('music_review.html').read_text(encoding='utf8')
    payload={'analysis':analysis,'rms':features['rms'],'fps':fps}
    (output/'review.html').write_text(template.replace('__DATA__',json.dumps(payload,ensure_ascii=False).replace('<','\\u003c')),encoding='utf8')
    return analysis

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--input',required=True,type=Path);p.add_argument('--output',required=True,type=Path);p.add_argument('--ffmpeg');p.add_argument('--fps',type=float,default=30);p.add_argument('--start',type=float,default=0);p.add_argument('--duration',type=float);a=p.parse_args()
    try:
        executable=a.ffmpeg or os.environ.get('FFMPEG') or shutil.which('ffmpeg')
        if not executable:raise ValueError('Set --ffmpeg or FFMPEG to an existing executable')
        result=build(a.input,a.output,executable,a.fps,a.start,a.duration)
    except (ValueError,OSError,subprocess.CalledProcessError) as e:p.exit(2,f'Music workflow failed: {e}\n')
    print(json.dumps({'duration':result['duration'],'sections':len(result['sections']),'visualPhrases':len(result['visualPhrases']),'report':str(a.output/'report.md'),'review':str(a.output/'review.html'),'status':'candidate'},ensure_ascii=False))
