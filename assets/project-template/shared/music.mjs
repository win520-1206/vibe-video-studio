const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
export function impactSettings(event){return {prepareSeconds:.8,attackSeconds:.08,decaySeconds:.3,settleSeconds:1,...event.impact}}
export function accentAt(event,time){
 if(!event)throw Error('Unknown music event');
 const s=impactSettings(event),dt=time-event.atSeconds;
 return {phase:dt<-s.prepareSeconds?'before':dt<-s.attackSeconds?'prepare':dt<0?'attack':dt<s.decaySeconds?'impact':dt<s.settleSeconds?'settle':'after',
  anticipation:dt<0?smooth((dt+s.prepareSeconds)/(s.prepareSeconds-s.attackSeconds)):0,
  hit:dt<0?smooth((dt+s.attackSeconds)/s.attackSeconds):dt>=s.settleSeconds?0:Math.exp(-dt/Math.max(.001,s.decaySeconds/3)),
  reveal:smooth(dt/s.settleSeconds),secondsFromEvent:dt};
}
export function inspectMusic(project,analyses){
 const errors=[],warnings=[],bindings=[];
 for(const e of project.episodes??[]){
  const d=e.musicDirection,a=analyses[e.id];
  if(!d){errors.push(`${e.id}: musicDirection missing; run plan:music and fill the episode direction`);continue}
  if(!a){errors.push(`${e.id}: run analyze:music first`);continue}
  if(!a.selectionFingerprint||d.analysisFingerprint!==a.selectionFingerprint)errors.push(`${e.id}: stale music selection/fps fingerprint`);
  const manual=[];
  for(const m of d.manualMarkers??[]){const atSeconds=m.sourceSeconds-(a.mapping?.sourceStartSeconds??0);if(!m.id?.startsWith('manual-')||!Number.isFinite(atSeconds)||atSeconds<0||atSeconds>=e.durationSeconds||!m.note?.trim())errors.push(`${e.id}: invalid manual source marker`);else manual.push({...m,atSeconds})}
  const list=Array.isArray(d.bindings)?d.bindings:[],seen=new Set();
  if(list.filter(b=>b.eventId===d.mainEventId).length!==1)errors.push(`${e.id}: bind the main event exactly once`);
  for(const b of list){
   const ev=(e.events??[]).find(v=>v.id===b.eventId),candidate=[...(a.attackCandidates??[]),...(a.impactCandidates??[]),...manual].find(v=>v.id===b.featureId);
   if(seen.has(b.eventId))errors.push(`${e.id}: duplicate music binding ${b.eventId}`);seen.add(b.eventId);
   if(!ev||!candidate){errors.push(`${e.id}/${b.eventId}: missing event or detected feature`);continue}
   const offset=b.offsetFrames??0,tolerance=b.toleranceFrames??1;
   if(!Number.isInteger(offset)||!Number.isInteger(tolerance)||tolerance<0){errors.push(`${b.eventId}: frame offset/tolerance must be integers`);continue}
   const targetFrame=Math.round(candidate.atSeconds*project.video.fps)+offset,errorFrames=Math.round(ev.atSeconds*project.video.fps)-targetFrame;
   if(Math.abs(errorFrames)>tolerance)errors.push(`${e.id}/${b.eventId}: music peak differs by ${errorFrames} frames`);
   if(!['candidate','confirmed'].includes(b.reviewStatus))errors.push(`${b.eventId}: record candidate or confirmed review status`);
   if(typeof b.action!=='string'||!b.action.trim())errors.push(`${b.eventId}: describe the visible action`);
   const settings=impactSettings(ev);
   if(!Object.values(settings).every(v=>Number.isFinite(v)&&v>0)||settings.prepareSeconds<=settings.attackSeconds||settings.settleSeconds<settings.decaySeconds)errors.push(`${b.eventId}: invalid prepare/attack/decay/settle durations`);
   if(b.eventId===d.mainEventId){
    if(!b.contrast?.before?.trim()||!b.contrast?.after?.trim())errors.push(`${b.eventId}: describe pre-impact and post-impact contrast`);
    const channels=new Set(b.contrast?.channels??[]);if(![...channels].some(c=>['subject','camera','motion','density'].includes(c)))warnings.push(`${b.eventId}: light alone does not establish a strong reveal`);
    if(ev.atSeconds-settings.prepareSeconds<0)warnings.push(`${b.eventId}: little preparation time before main reveal`);
   }
   if(b.reviewStatus==='candidate')warnings.push(`${b.eventId}: candidate alignment, listening not confirmed`);
   bindings.push({episode:e.id,eventId:ev.id,targetFrame,actualFrame:Math.round(ev.atSeconds*project.video.fps),errorFrames,sourceSeconds:(a.mapping?.sourceStartSeconds??0)+ev.atSeconds,reviewStatus:b.reviewStatus});
  }
 }
 return {passed:errors.length===0,errors,warnings,bindings,manualReview:{listening:'not_reviewed',impactQuality:'not_reviewed'}};
}
