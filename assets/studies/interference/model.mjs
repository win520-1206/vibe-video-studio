export function pulsePair(x,time,meet=8){const speed=.15,width=.17,a=.16;
 const left=speed*(time-meet),right=-left;
 const first=a*Math.exp(-(((x-left)/width)**2)),second=-a*Math.exp(-(((x-right)/width)**2));
 return {first,second,sum:first+second};
}
export function state(ctx){const meet=ctx.event('cancel').atSeconds;
 const points=Array.from({length:241},(_,i)=>{const x=-1.3+2.6*i/240,p=pulsePair(x,ctx.time,meet);return {id:`medium-${i}`,x:.08+.84*i/240,y:.56-p.sum,worldX:x,worldY:p.sum,...p}});
 return {objects:points,protectedRegions:[{id:'medium',x:.06,y:.37,w:.88,h:.37}],phase:ctx.time<17.5?'develop':'hold',expected:ctx.time<17.5?'subject':'hold',metrics:{displacement:points[120].sum},points,meet};
}
