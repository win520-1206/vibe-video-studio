import {sceneSpecs} from './scene-registry.mjs';
export function sceneState(ctx,time=ctx.time){
 const frame=Math.round(time*ctx.fps),original=ctx;
 ctx={...ctx,time,frame,localTime:time-ctx.scene.start,signal:name=>original.signal(name,frame)};
 if(ctx.scene.kind==='blender')return {objects:[],protectedRegions:[],phase:'media',expected:'media',metrics:{}};
 const spec=sceneSpecs[ctx.scene.renderer];
 if(!spec)throw Error(`Unregistered subject renderer: ${ctx.scene.renderer}; author its state and view`);
 const state=spec.state(ctx);
 if(!state||!Array.isArray(state.objects)||!Array.isArray(state.protectedRegions))throw Error('Scene state must expose objects and protectedRegions');
 const ids=new Set();for(const o of state.objects){if(!o.id||ids.has(o.id)||!Number.isFinite(o.x)||!Number.isFinite(o.y))throw Error('Invalid or duplicate subject object');ids.add(o.id)}
 return state;
}
export function motionProbe(state){return {phase:state.phase,expected:state.expected,subject:state.objects.map(o=>({id:o.id,x:o.worldX??o.x,y:o.worldY??o.y})),metrics:state.metrics??{}}}
export function inspectMotion(rows){const warnings=[],groups=new Map();
 for(const r of rows)if(r.motion?.phase==='develop'&&r.motion.expected==='subject'){const key=r.episode+'/'+r.scene;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r)}
 for(const [key,rows]of groups){if(rows.length<2)continue;const signatures=new Set(rows.map(r=>JSON.stringify([r.motion.subject,r.motion.metrics])));if(signatures.size===1)warnings.push(`${key}: subject static; camera or decoration is not explanatory motion`)}
 return warnings;
}
