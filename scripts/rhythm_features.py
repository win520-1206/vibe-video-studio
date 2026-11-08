"""High-resolution spectral attacks. Frequency bands are not instrument labels."""
import numpy as np

def extract(mono,sr):
    hop=max(1,round(sr*.005));rate=sr/hop;n=int(np.ceil(len(mono)/hop))
    nfft=2**int(np.ceil(np.log2(sr*.043)));window=np.hanning(nfft)
    freq=np.fft.rfftfreq(nfft,1/sr);limits={'low':(35,200),'mid':(200,2500),'high':(2500,min(12000,sr/2))}
    masks={k:(freq>=a)&(freq<c) for k,(a,c) in limits.items()};values={k:[] for k in limits};energy=[];previous=np.zeros(nfft//2+1)
    padded=np.pad(mono,(nfft//2,nfft//2+hop))
    for i in range(n):
        spectrum=np.log1p(10*np.abs(np.fft.rfft(padded[i*hop:i*hop+nfft]*window)))
        flux=np.maximum(0,spectrum-previous);previous=spectrum
        for k,mask in masks.items():values[k].append(float(np.mean(flux[mask])) if mask.any() else 0.)
        block=mono[i*hop:min(len(mono),(i+1)*hop)];energy.append(float(np.sqrt(np.mean(block*block))))
    def normalize(v):
        v=np.asarray(v);scale=float(np.percentile(v,98));return v/max(scale,1e-10)
    bands={k:normalize(v) for k,v in values.items()};combined=.45*bands['low']+.3*bands['mid']+.25*bands['high'];energy=np.asarray(energy)
    candidates=[]
    for i in range(1,n-1):
        neighbourhood=combined[max(0,i-round(.15*rate)):min(n,i+round(.15*rate)+1)]
        threshold=float(np.median(neighbourhood))+.35*float(np.std(neighbourhood))
        if combined[i]>.12 and combined[i]>threshold and combined[i]>combined[i-1] and combined[i]>=combined[i+1]:candidates.append(i)
    chosen=[];rise=np.maximum(0,np.diff(energy,prepend=0))
    for i in sorted(candidates,key=lambda i:combined[i],reverse=True):
        lo=max(1,i-round(.03*rate));hi=min(n,i+round(.03*rate)+1)
        refined=lo+int(np.argmax(rise[lo:hi])) if hi>lo and rise[lo:hi].max()>1e-8 else i
        if all(abs(refined-j)>=round(.085*rate) for j in chosen):chosen.append(refined)
    attacks=[]
    for i in sorted(chosen):
        a=max(0,i-round(.03*rate));z=min(n,i+round(.03*rate)+1);strengths={k:float(v[a:z].max()) for k,v in bands.items()}
        attacks.append({'id':f'attack-{i:07d}','atSeconds':round(i/rate,6),'strength':round(float(combined[a:z].max()),5),'dominantBand':max(strengths,key=strengths.get),'bands':{k:round(v,5) for k,v in strengths.items()},'status':'candidate'})
    return {'analysisRate':rate,'hopSamples':hop,'attacks':attacks,'onsetEnvelope':[round(float(v),6) for v in combined],'rms':[round(float(v),7) for v in energy],'limitations':'Approximate attacks, not verified kick/snare/hat, musical downbeats or meter. Review by listening.'}
