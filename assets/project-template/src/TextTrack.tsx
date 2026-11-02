import React from 'react';
import {cuesFor,cueWindow,textLayout} from '../shared/presentation.mjs';
import {sceneState} from '../shared/scene-state.mjs';
// Opt-in effects, positioned against the authored scene; no alternating preset.
export function TextTrack({ctx,state}:any){return <>{cuesFor(ctx.scene,ctx.fps).filter((q:any)=>ctx.time>=q.start&&ctx.time<q.end).map((q:any)=>{
 const win=cueWindow(q,ctx.fps),anchor=q.placement==='anchor'&&q.role!=='label'?sceneState(ctx,Math.max(q.start,Math.min(ctx.time,win.readStart))):state;
 const box=textLayout(q,ctx,state,anchor);if(box.opacity<.001)return null;
 const active=!q.eventId||ctx.time>=(ctx.event(q.eventId)?.atSeconds??Infinity);
 const terms=(q.emphasis??[]).filter((v:any)=>typeof v==='string'&&v.length);const pieces=[];let i=0;
 while(i<q.text.length){const term=terms.find((v:string)=>q.text.startsWith(v,i));if(term){pieces.push(<span key={i} style={{fontWeight:600,color:active?ctx.style.warm:ctx.style.text}}>{term}</span>);i+=term.length}else{pieces.push(q.text[i]);i++}}
 return <div key={q.id} style={{position:'absolute',left:box.x,top:box.y,width:box.width,fontSize:box.fontSize,textAlign:box.align as any,lineHeight:1.35,opacity:box.opacity,transform:`scale(${box.scale})`,transformOrigin:'left top',clipPath:box.clip?`inset(0 ${box.clip}% 0 0)`:undefined,pointerEvents:'none'}}><span data-label={q.id} data-role={q.role??'main'} data-phase={box.phase} data-anchor={q.anchor?.id??''} data-overlap={q.overlapGroup??''} style={{display:'inline-block',maxWidth:'100%',whiteSpace:'pre-wrap'}}>{pieces}</span></div>
 })}</>}
