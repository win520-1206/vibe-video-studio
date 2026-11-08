import fs from 'node:fs';
import {inspectMusic} from '../shared/music.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
try{
 const p=read('project-contract.json'),analyses={};
 for(const e of p.episodes)analyses[e.id]=read(`public/generated/${e.id}-music-analysis.json`);
 if(process.argv[2]==='plan'){
  const file='music-direction-draft.json';if(fs.existsSync(file))throw Error('Music draft exists; authored choices were preserved');
  const episodes=p.episodes.map(e=>{const a=analyses[e.id],features=[...(a.impactCandidates??[]),...(a.attackCandidates??[])];return {episodeId:e.id,sectionTransitions:a.sectionTransitions??[],visualPhrases:a.visualPhrases??[],mainImpactOptions:(a.impactCandidates??[]).map(c=>({...c,proposedFrame:Math.round(c.atSeconds*p.video.fps)})),musicDirection:{analysisFingerprint:a.selectionFingerprint,mainEventId:'',bindings:(e.events??[]).map((ev,i)=>{const pool=i===0&&a.impactCandidates?.length?a.impactCandidates:features,closest=pool.length?pool.reduce((best,c)=>Math.abs(c.atSeconds-ev.atSeconds)<Math.abs(best.atSeconds-ev.atSeconds)?c:best):null;return {eventId:ev.id,featureId:closest?.id??'',offsetFrames:0,toleranceFrames:1,reviewStatus:'candidate',action:'',...(i===0?{contrast:{before:'',after:'',channels:[]}}:{})}})}}});
  fs.writeFileSync(file,JSON.stringify({notice:'Edit and copy each musicDirection into its episode. Event atSeconds remains the only timeline; do not overwrite events automatically.',episodes},null,2)+'\n',{flag:'wx'});console.log('Created music-direction-draft.json. Choose attacks/impacts, write visible actions, then deliberately align episode events.');
 }else if(process.argv[2]==='check'){
  const r=inspectMusic(p,analyses);fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/music-report.json',JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r));if(!r.passed)process.exitCode=1;
 }else throw Error('Use plan:music or check:music');
}catch(e){console.error(e.message);process.exitCode=1}
