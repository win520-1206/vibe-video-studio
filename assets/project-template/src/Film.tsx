import React,{useLayoutEffect,useState,useRef} from 'react';
import {AbsoluteFill,Audio,OffthreadVideo,Img,Sequence,staticFile,useCurrentFrame,delayRender,continueRender,cancelRender} from 'remotion';
import {atFrame} from '../shared/project.mjs';
import {sceneViews} from './scenes';
import {TextTrack} from './TextTrack';
import {sceneState,motionProbe} from '../shared/scene-state.mjs';
export function Film({project,episode}:any){
 const frame=useCurrentFrame(),[ready]=useState(()=>delayRender('Load music features and fonts')),[features,setFeatures]=useState<any>(null),root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{let live=true;(async()=>{try{if(project.fontFile){const face=new FontFace('ProjectFont',`url(${staticFile(project.fontFile)})`);await face.load();document.fonts.add(face)}await document.fonts.ready;const r=await fetch(staticFile(`generated/${episode.id}-features.json`));if(!r.ok)throw Error('Run npm run analyze:music before rendering');const data=await r.json();if(data.fps!==project.video.fps||data.frames!==episode.durationInFrames)throw Error('Music features do not match composition');if(live){setFeatures(data);continueRender(ready)}}catch(e){cancelRender(e as Error)}})();return()=>{live=false}},[project,episode,ready]);
 const ctx=atFrame(project,episode,frame,features),s=ctx.scene;
 const state=sceneState(ctx),View=sceneViews[s.renderer];
 if(s.kind!=='blender'&&!View)throw Error(`Missing visual implementation: ${s.renderer}`);
 useLayoutEffect(()=>{if(!features)return;const rect=root.current!.getBoundingClientRect();const boxes=Array.from(root.current!.querySelectorAll<HTMLElement>('[data-label]')).map(el=>{const r=el.getBoundingClientRect();const scale=project.video.width/rect.width;return {id:el.dataset.label,role:el.dataset.role,phase:el.dataset.phase,overlapGroup:el.dataset.overlap,anchor:el.dataset.anchor,text:el.textContent,x:(r.x-rect.x)*scale,y:(r.y-rect.y)*scale,w:r.width*scale,h:r.height*scale,overflow:el.scrollWidth>el.clientWidth+1}});
  console.log('VIBE_QA:'+JSON.stringify({episode:episode.id,frame,scene:s.id,boxes,model:{seed:ctx.seed,steps:s.model?.steps,samples:s.model?.samples},renderer:s.renderer??'blender',musicCues:(episode.musicDirection?.bindings??[]).map((b:any)=>({eventId:b.eventId,...ctx.accent(b.eventId)})),motion:state?motionProbe(state):null,protectedRegions:state?.protectedRegions}));
 },[frame,features,project,episode,s,ctx.seed]);
 const m=s.media,mediaFrame=m?m.sourceStartFrame+frame-Math.round(s.start*ctx.fps):0;
 return <AbsoluteFill ref={root} style={{background:project.style.background,color:project.style.text,fontFamily:project.fontFile?'ProjectFont':project.style.fontFamily}}>
  {s.kind==='blender'?m.type==='video'?<Sequence from={Math.round(s.start*ctx.fps)} durationInFrames={Math.round((s.end-s.start)*ctx.fps)}><OffthreadVideo src={staticFile(m.file)} startFrom={m.sourceStartFrame} muted style={{width:'100%',height:'100%',objectFit:'contain'}}/></Sequence>:<Img src={staticFile(m.pattern.replace('{frame}',String(mediaFrame).padStart(m.padding??6,'0')))} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:<View ctx={ctx} state={state}/>}
  <TextTrack ctx={ctx} state={state}/>
  {episode.audio.required!==false&&<Audio src={staticFile(`generated/${episode.id}-mix.wav`)}/>}
 </AbsoluteFill>;
}
