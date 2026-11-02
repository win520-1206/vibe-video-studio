import React from 'react';
export const sceneViews:Record<string,React.ComponentType<any>>={
 'wave-test':({ctx,state}:any)=><svg width={ctx.width} height={ctx.height} viewBox="0 0 1 1" preserveAspectRatio="none"><path d={state.objects.map((o:any,i:number)=>`${i?'L':'M'} ${o.x} ${o.y}`).join(' ')} fill="none" stroke={ctx.style.cool} strokeWidth=".004"/><path d="M .08 .56 H .92" stroke="#435565" strokeWidth=".001"/></svg>,
 'branch-test':({ctx,state}:any)=><svg width={ctx.width} height={ctx.height} viewBox="0 0 1 1" preserveAspectRatio="none">{state.objects.map((o:any)=><g key={o.id}><path d={`M .14 .56 Q .50 .56 ${o.x} ${o.y}`} fill="none" stroke={ctx.style.warm} strokeWidth=".002"/><ellipse cx={o.x} cy={o.y} rx=".005" ry=".009" fill={ctx.style.text}/></g>)}</svg>
};
