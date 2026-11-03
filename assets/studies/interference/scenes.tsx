import React from 'react';
const smooth=(x:number)=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
export const sceneViews:Record<string,React.ComponentType<any>>={'pulse-interference':({ctx,state}:any)=>{
 const portrait=ctx.height>ctx.width,points=state.points;
 const path=(kind:string)=>points.map((p:any,i:number)=>`${i?'L':'M'} ${p.x*1000} ${(kind==='sum'?p.y:.56-p[kind])*1000}`).join(' ');
 const encounter=Math.exp(-(((ctx.time-state.meet)/.75)**2)),energy=ctx.signal('bass');
 const ghost=.3+.35*encounter,main=path('sum');
 return <svg width={ctx.width} height={ctx.height} viewBox="0 0 1000 1000" preserveAspectRatio="none">
  <defs><radialGradient id="space"><stop stopColor="#183c53" stopOpacity=".45"/><stop offset="1" stopColor="#04090f" stopOpacity="0"/></radialGradient><linearGradient id="sum" x1="0" x2="1"><stop stopColor="#98deec"/><stop offset=".5" stopColor="#f5ead6"/><stop offset="1" stopColor="#e3b376"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="7"/></filter><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#9fdce3" stopOpacity=".18"/><stop offset="1" stopColor="#91c8dd" stopOpacity="0"/></linearGradient></defs>
  <ellipse cx="500" cy="560" rx="520" ry="350" fill="url(#space)"/>
  {Array.from({length:9},(_,i)=><path key={i} d={`M 60 ${400+i*40} H 940`} stroke="#8db6c7" strokeOpacity=".055" strokeWidth="1"/>)}
  <path d="M 60 560 H 940" stroke="#647c8e" strokeOpacity=".3" strokeWidth="1"/>
  <path d={main+' L 920 560 L 80 560 Z'} fill="url(#fill)"/>
  {['first','second'].map((kind,i)=><path key={kind} d={path(kind)} fill="none" stroke={i?'#e3b376':'#91d6e2'} strokeOpacity={ghost} strokeWidth="1.5" strokeDasharray="5 7"/>)}
  <path d={main} fill="none" stroke="#cce4e9" strokeWidth={5+energy*2} opacity=".22" filter="url(#soft)"/>
  <path d={main} fill="none" stroke="url(#sum)" strokeWidth="2.8"/>
  {points.filter((_:any,i:number)=>i%4===0).map((p:any)=><ellipse key={p.id} cx={p.x*1000} cy={p.y*1000} rx={portrait?2.5:1.5} ry="2.3" fill="#e7f1ee" opacity=".7"/>)}
  <ellipse cx="500" cy="560" rx={30+90*encounter} ry={48+130*encounter} fill="none" stroke="#f2d9a4" strokeOpacity={encounter*.6} strokeWidth="1"/>
  {encounter>.12&&<text style={{transformBox:'fill-box',transformOrigin:'center',transform:`scaleX(${ctx.height/ctx.width})`}} data-label="sum-law" data-role="label" x="500" y="790" textAnchor="middle" fontSize={portrait?30:23} fill="#cbdcde">y = y₁ + y₂</text>}
  {ctx.time<3.8&&<text style={{transformBox:'fill-box',transformOrigin:'center',transform:`scaleX(${ctx.height/ctx.width})`}} data-label="boundary" data-role="label" x="500" y="850" textAnchor="middle" fontSize={portrait?22:17} fill="#798d9b" opacity={smooth(ctx.time/.5)}>理想线性介质 · 示意位移</text>}
 </svg>;
}};
