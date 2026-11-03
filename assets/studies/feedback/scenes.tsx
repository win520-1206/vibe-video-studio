import React from 'react';
export const sceneViews:Record<string,React.ComponentType<any>>={'feedback-carriage':({ctx,state:s}:any)=>{
 const portrait=ctx.height>ctx.width,active=ctx.time>=s.engage,x=s.x*1000;
 const kick=Math.exp(-Math.max(0,ctx.time-s.kick)*4)*(ctx.time>=s.kick?1:0),pulse=(ctx.time*.7)%1;
 const graph=s.trail.map((p:any,i:number)=>`${i?'L':'M'} ${150+p.t/18*700} ${865-p.error*230}`).join(' ');
 return <svg width={ctx.width} height={ctx.height} viewBox="0 0 1000 1000" preserveAspectRatio="none">
 <defs><linearGradient id="rail" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#5f717f"/><stop offset="1" stopColor="#0d1821"/></linearGradient><radialGradient id="lamp"><stop stopColor="#ddb87d" stopOpacity=".16"/><stop offset="1" stopColor="#071019" stopOpacity="0"/></radialGradient><linearGradient id="metal"><stop stopColor="#e7d3b1"/><stop offset=".5" stopColor="#87795f"/><stop offset="1" stopColor="#3b3c39"/></linearGradient><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="#8dd6de"/></marker></defs>
 <ellipse cx="500" cy="510" rx="460" ry="330" fill="url(#lamp)"/>
 <path d="M 130 506 L 160 470 H 870 L 840 506 Z" fill="url(#rail)" stroke="#6b7f8c" strokeWidth=".8"/>
 {Array.from({length:16},(_,i)=><path key={i} d={`M ${160+i*44} 470 l -30 36`} stroke="#2c3e4c" strokeWidth="1"/>)}
 <path d="M 500 350 V 545" stroke="#91dce2" strokeWidth="1.2" strokeDasharray="4 6" opacity=".65"/>
 <text style={{transformBox:'fill-box',transformOrigin:'center',transform:`scaleX(${ctx.height/ctx.width})`}} data-label="target-label" data-role="label" x="500" y="330" fill="#91dce2" fontSize={portrait?23:18} textAnchor="middle">目标</text>
 <ellipse cx={x} cy="505" rx="32" ry="12" fill="#000" opacity=".6"/>
 <path d={`M ${x-24} 428 l 14 -13 h 47 v 52 l -13 15 h -48 Z`} fill="url(#metal)" stroke="#f2d6a4" strokeWidth="1.2"/>
 <path d={`M ${x-24} 428 h 48 v 54 M ${x+24} 428 l 13 -13`} fill="none" stroke="#e0c89c" strokeOpacity=".55"/>
 {active&&<><path d={`M ${x-30} 398 H ${x-30-Math.abs(s.control)*600}`} fill="none" stroke="#91dce2" strokeWidth="2" markerEnd="url(#arrow)"/><path d={`M ${x} 540 V 604 H 500 V 550`} fill="none" stroke="#8eb4c0" strokeWidth="1.3" opacity=".6"/><ellipse cx={x+(500-x)*pulse} cy="604" rx="4" ry="6" fill="#9fe2e6"/><text style={{transformBox:'fill-box',transformOrigin:'center',transform:`scaleX(${ctx.height/ctx.width})`}} data-label="feedback-label" data-role="label" x="500" y="650" textAnchor="middle" fill="#91cbd4" fontSize={portrait?24:18}>测量 → 比较 → 修正</text></>}
 {kick>.02&&<><path d={`M ${x+65} 385 L ${x+65} 450`} stroke="#e4a171" strokeWidth="3" opacity={kick}/><text style={{transformBox:'fill-box',transformOrigin:'center',transform:`scaleX(${ctx.height/ctx.width})`}} data-label="disturbance-label" data-role="label" x={portrait?700:x+60} y="365" fill="#e7ae82" fontSize={portrait?23:18} opacity={kick}>扰动</text></>}
 <path d="M 150 865 H 850" stroke="#435c6b" strokeWidth="1"/>
 <path d={graph} fill="none" stroke="#dfbf83" strokeWidth="2"/>
 <text style={{transformBox:'fill-box',transformOrigin:'center',transform:`scaleX(${ctx.height/ctx.width})`}} data-label="error-label" data-role="label" x="150" y="735" fill="#94a9b4" fontSize={portrait?22:17}>偏差 e</text>
 <text style={{transformBox:'fill-box',transformOrigin:'center',transform:`scaleX(${ctx.height/ctx.width})`}} data-label="error-value" data-role="label" x="850" y="735" textAnchor="end" fill="#e2c99d" fontSize={portrait?25:20}>{s.error.toFixed(3)}</text>
 </svg>;
}};
