// Planning does not import scene registries: it works before rendering is implemented.
export const narrativeFields=['openingQuestion','coreMechanism','insight','emotionalConnection','endingResponse'];
export const shotFields=['action','viewerBefore','viewerAfter','emotionalBeat','transition'];
const text=v=>typeof v==='string'&&v.trim().length>0;
const key=(episode,scene)=>JSON.stringify([episode,scene]);
const requiredEvents=s=>[...new Set([...(s.eventIds??[]),...(s.captions??[]).map(c=>c.eventId),...(s.textCues??[]).map(c=>c.eventId),...(s.annotations??[]).map(c=>c.eventId)].filter(Boolean))];
export function draftCreative(raw){
 if(!Array.isArray(raw.episodes)||!raw.episodes.length||raw.episodes.some(e=>!e.id||!Array.isArray(e.scenes)||!e.scenes.length||e.scenes.some(s=>!s.id)))throw Error('Fill episode and scene IDs before running plan:shots; visual renderers may remain unimplemented');
 return {schemaVersion:1,project:Object.fromEntries(narrativeFields.map(k=>[k,''])),shots:raw.episodes.flatMap(e=>e.scenes.map(s=>({episodeId:e.id,sceneId:s.id,captionIds:(s.captions??[]).map(c=>c.id),eventIds:requiredEvents(s),action:s.action??'',viewerBefore:'',viewerAfter:s.understanding??'',emotionalBeat:'',transition:''})))};
}
export function inspectCreative(plan,raw,manifest){
 const errors=[],warnings=[],add=(ok,msg)=>{if(!ok)errors.push(msg)};
 const manualReview=Object.fromEntries(['scientificAccuracy','emotionalConnection','analogyBoundary','visualClarity','musicFit'].map(k=>[k,'not_reviewed']));
 if(!plan)return {passed:false,errors:['creative-plan.json missing; run npm run plan:shots and complete the draft'],warnings,manualReview};
 add(plan.schemaVersion===1,'Unsupported creative-plan schemaVersion');
 for(const f of narrativeFields)add(text(plan.project?.[f]),`project.${f}: explain the intended experience`);
 const episodes=Array.isArray(raw.episodes)?raw.episodes:[];
 add(episodes.length>0,'Contract has no episodes');
 const scenes=new Map();
 for(const e of episodes)for(const s of e.scenes??[]){const id=key(e.id,s.id);add(!scenes.has(id),`Contract repeats scene ${e.id}/${s.id}`);scenes.set(id,{e,s})}
 const shots=Array.isArray(plan.shots)?plan.shots:[];add(Array.isArray(plan.shots),'shots must be an array');
 const seen=new Set();
 for(const shot of shots){
  if(!shot||typeof shot!=='object'){errors.push('Invalid shot entry');continue}
  const id=key(shot.episodeId,shot.sceneId),label=`${shot.episodeId}/${shot.sceneId}`;
  add(!seen.has(id),`${label}: duplicate creative shot`);seen.add(id);
  const source=scenes.get(id);if(!source){errors.push(`${label}: unknown scene reference`);continue}
  const {e,s}=source;
  for(const f of shotFields)add(text(shot[f]),`${label}.${f}: required`);
  for(const [field,expected] of [['captionIds',(s.captions??[]).map(c=>c.id)],['eventIds',requiredEvents(s)]]){
   const list=shot[field];add(Array.isArray(list),`${label}.${field}: must be an array`);if(!Array.isArray(list))continue;
   add(new Set(list).size===list.length,`${label}.${field}: duplicate reference`);
   for(const item of expected)add(list.includes(item),`${label}: missing ${field} reference ${item}`);
   for(const item of list){
    if(field==='captionIds')add(expected.includes(item),`${label}: unknown caption ${item}`);
    else{const ev=(e.events??[]).find(x=>x.id===item);add(!!ev,`${label}: unknown event ${item}`);if(ev)add(Number.isFinite(ev.atSeconds)&&ev.atSeconds>=s.start&&ev.atSeconds<s.end,`${label}/${item}: event outside scene`)}
   }
  }
  if(shot.action===shot.viewerAfter)warnings.push(`${label}: action and understanding are identical; review whether the picture explains a change`);
 }
 for(const [id,{e,s}]of scenes) add(seen.has(id),`${e.id}/${s.id}: missing creative shot`);
 if(manifest!==undefined)for(const e of episodes){
  const actual=(e.scenes??[]).flatMap(s=>s.captions??[]),approved=manifest?.[e.id];
  add(Array.isArray(approved),`${e.id}: independent script manifest missing`);if(!Array.isArray(approved))continue;
  for(const c of approved)add(actual.some(q=>q.id===c.id&&q.text===c.text),`${e.id}/${c.id}: approved text missing or changed`);
  for(const c of actual)add(approved.some(q=>q.id===c.id&&q.text===c.text),`${e.id}/${c.id}: text not in approved script`);
 }
 return {passed:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)],manualReview};
}
export function creativeMarkdown(plan,raw){
 const lines=['# 创作表：知识、动画与情绪','', '阅读版；时间、原稿与事件以 project-contract.json 和 script-manifest.json 为准。',''];
 for(const f of narrativeFields)lines.push(`- **${f}**：${plan.project?.[f]||'待填写'}`);
 for(const shot of plan.shots??[]){const e=raw.episodes?.find(e=>e.id===shot.episodeId),s=e?.scenes?.find(s=>s.id===shot.sceneId);lines.push('',`## ${shot.episodeId}/${shot.sceneId}`,`配置时间：${s?.start??'?'}–${s?.end??'?'} 秒（只读引用）`);
  for(const f of shotFields)lines.push(`- **${f}**：${shot[f]||'待填写'}`);
  lines.push(`- **captionIds**：${(shot.captionIds??[]).join(', ')}`,`- **eventIds**：${(shot.eventIds??[]).join(', ')}`);
 }
 lines.push('','## 人工复核','科学依据、类比边界、情绪是否自然、无正文能否理解、音乐是否强化顿悟：均需结合实际作品判断，结构检查不自动认可。');
 return lines.join('\n')+'\n';
}
