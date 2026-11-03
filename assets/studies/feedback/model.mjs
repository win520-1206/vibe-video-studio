// Integrator plant dx/dt=u; P feedback u=-k(x-r), no delay or saturation.
export function response(time,engage=6,kick=11,k=.6){const initial=.31,disturbance=.16;
 const base=time<engage?initial:initial*Math.exp(-k*(time-engage));
 const added=time<kick?0:disturbance*Math.exp(-k*(time-kick));const error=base+added;
 return {error,control:time<engage?0:-k*error,x:.5+error};
}
export function state(ctx){const engage=ctx.event('engage').atSeconds,kick=ctx.event('disturbance').atSeconds,p=response(ctx.time,engage,kick);
 const objects=[{id:'carriage',x:p.x,y:.48,worldX:p.x,worldY:.48},{id:'target',x:.5,y:.48,worldX:.5,worldY:.48}];
 const trail=Array.from({length:Math.floor(ctx.time*30)+1},(_,i)=>{const t=i/30;return {t,...response(t,engage,kick)}});
 return {objects,protectedRegions:[{id:'mechanism',x:.12,y:.37,w:.76,h:.27}],phase:ctx.time<engage?'prepare':ctx.time<17.5?'develop':'hold',expected:ctx.time<engage||ctx.time>=17.5?'hold':'subject',metrics:{error:p.error,control:p.control},engage,kick,...p,trail};
}
