// Original integration diagnostics, not recommended production compositions.
const u=ctx=>Math.max(0,Math.min(1,ctx.localTime/(ctx.scene.end-ctx.scene.start)));
export const sceneSpecs={
 'wave-test':{state(ctx){const t=u(ctx);const objects=Array.from({length:81},(_,i)=>{const x=i/80;const y=.56+.13*Math.sin(x*Math.PI*6-ctx.time*3)*Math.sin(Math.PI*t);return {id:`sample-${i}`,x:.08+x*.84,y}});return {objects,protectedRegions:[],phase:'develop',expected:'subject',metrics:{phase:ctx.time*3}}}},
 'branch-test':{state(ctx){const t=u(ctx);return {objects:Array.from({length:8},(_,i)=>({id:`branch-${i}`,x:.14+.72*t,y:.56+(i-3.5)*.07*t})),protectedRegions:[],phase:'develop',expected:'subject',metrics:{extent:t}}}}
};
