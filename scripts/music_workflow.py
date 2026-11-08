"""Reproducible section/contrast evidence and topic-independent motion briefs."""
import numpy as np

def enrich_analysis(features,analysis):
    fps=float(features['fps']);duration=float(features['duration']);rms=np.asarray(features['rms'],float)
    if not len(rms):raise ValueError('Empty music features')
    bands={k:np.asarray(features['bands'][k],float) for k in ['bass','body','air']}
    def average(v,a,b):
        lo=max(0,int(a*fps));hi=min(len(v),max(lo+1,int(b*fps)));return float(v[lo:hi].mean()) if hi>lo else 0.
    scale=max(1e-9,float(np.percentile(rms,95)));scores=[]
    for time in np.arange(.8,max(.8,duration-.8),.25):
        before=average(rms,time-.75,time);after=average(rms,time,time+.75)
        spectral=sum(abs(average(v,time,time+.75)-average(v,time-.75,time)) for v in bands.values())/3
        score=abs(after-before)/scale+.25*spectral
        scores.append({'atSeconds':round(float(time),4),'score':score,'beforeRms':before,'afterRms':after,'deltaRms':after-before})
    selected=[]
    if scores and rms.max()>1e-7:
        values=np.array([s['score'] for s in scores]);threshold=float(np.median(values)+2.5*np.median(abs(values-np.median(values))))
        for c in sorted(scores,key=lambda s:s['score'],reverse=True):
            if c['score']<max(.18,threshold):continue
            if all(abs(c['atSeconds']-s['atSeconds'])>=2 for s in selected):selected.append(c)
            if len(selected)>=max(1,int(np.ceil(duration/10))):break
    transitions=[]
    for i,c in enumerate(sorted(selected,key=lambda s:s['atSeconds'])):
        kind='entry_candidate' if c['deltaRms']>scale*.06 else 'withdrawal_candidate' if c['deltaRms']<-scale*.06 else 'texture_change_candidate'
        transitions.append({'id':f'transition-{i+1}',**{k:round(v,6) if isinstance(v,float) else v for k,v in c.items()},'kind':kind,'status':'candidate'})
    bounds=[0]+[c['atSeconds'] for c in transitions]+[duration];sections=[]
    for i,(start,end) in enumerate(zip(bounds,bounds[1:])):
        energy=average(rms,start,end)
        role='quiet' if rms.max()<1e-7 else 'sustained_high' if energy>=np.percentile(rms,65) else 'restrained' if energy<=np.percentile(rms,30) else 'development'
        sections.append({'id':f'section-{i+1}','startSeconds':start,'endSeconds':end,'rms':round(energy,6),'bands':{k:round(average(v,start,end),5) for k,v in bands.items()},'role':role,'status':'candidate'})
    attacks=analysis.get('attackCandidates',[]);phrases=[]
    for c in transitions:
        if c['kind']!='entry_candidate':continue
        nearby=[a for a in attacks if abs(a['atSeconds']-c['atSeconds'])<=.6]
        if not nearby:continue
        attack=max(nearby,key=lambda a:a['strength']);at=attack['atSeconds']
        prior=max([0]+[s['atSeconds'] for s in transitions if s['atSeconds']<at-.8]);following=min([duration]+[s['atSeconds'] for s in transitions if s['atSeconds']>at+1])
        phrases.append({'id':'phrase-'+c['id'],'featureId':attack['id'],'atSeconds':at,'preparationRange':[round(max(prior,at-2),6),at],'followThroughRange':[at,round(min(following,at+4),6)],'evidence':{'transitionId':c['id'],'beforeRms':c['beforeRms'],'afterRms':c['afterRms'],'dominantBand':attack['dominantBand']},'visualBrief':{'prepare':'减少信息竞争，收束本主题主体或运动，保留阅读与观察','impact':'让知识揭示对应主体关系、尺度或观察方式的明确变化','followThrough':'新结构继续按节奏发展，次级动作承接；结果留稳定窗口'},'status':'candidate'})
    analysis.update(duration=duration,workflowVersion=1,sections=sections,sectionTransitions=transitions,visualPhrases=phrases)
    return analysis

def markdown_report(analysis,source_name):
    lines=['# 音乐分析与声画适配报告','',f'输入：{source_name}',f'时长：{analysis["duration"]:.3f}秒。状态：算法候选，尚未审听。','',
      '## 节奏','',f'速度候选：{", ".join(str(c["bpm"]) for c in analysis["tempo"]["candidates"])} BPM。保留半倍/倍速与变速歧义，不自动确认拍号、乐器或小节强拍。','',
      '## 段落与反差','', '| 时间 | 类型 | 前段RMS | 后段RMS |','|---|---|---:|---:|']
    for s in analysis['sectionTransitions']:lines.append(f'| {s["atSeconds"]:.2f}s | {s["kind"]} | {s["beforeRms"]:.4f} | {s["afterRms"]:.4f} |')
    if not analysis['sectionTransitions']:lines.append('| — | 没有足够证据确认显著段落转折 | — | — |')
    lines+=['','## 候选声画动作组','']
    for p in analysis['visualPhrases']:
        lines +=[f'### {p["id"]}，约{p["atSeconds"]:.2f}s',f'- 蓄势参考：{p["preparationRange"]}；{p["visualBrief"]["prepare"]}',f'- 进入候选：{p["featureId"]}；{p["visualBrief"]["impact"]}',f'- 延展参考：{p["followThroughRange"]}；{p["visualBrief"]["followThrough"]}','']
    lines+=['## 接入作品','', '先结合主题、科学顺序、原稿与试听选段。选段后运行项目analyze:music重新分析局部，再plan:music；将本片featureId绑定已有eventId，按fps量化峰值，使用ctx.accent驱动主题动作。不要将整曲ID或原曲秒数直接当成本片时间。',
      '','report和review.html可复查本次证据。持续高能量、局部强起音、段落进入分别处理；平缓曲目可能没有明显冲击，允许采用连续变化。确认候选后仍需渲染峰前、峰值、落定及含声音短片。未实际审听时保持candidate，不能凭算法声明听懂了音乐。']
    return '\n'.join(lines)+'\n'
