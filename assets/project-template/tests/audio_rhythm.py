import unittest,sys,tempfile,wave
from pathlib import Path
import numpy as np
tools=Path(__file__).resolve().parents[1]/'tools'
sys.path.insert(0,str(tools if (tools/'audio_features.py').exists() else Path(__file__).resolve().parents[3]/'scripts'))
from audio_features import analyze
from music_structure import analyze as structure

class AudioTests(unittest.TestCase):
 def make(self,beats,duration=8,sr=22050):
  x=np.zeros(round(duration*sr));rng=np.random.default_rng(41)
  for at,volume in beats:
   n=round(.07*sr);t=np.arange(n)/sr;sample=volume*(np.sin(2*np.pi*85*t)+.2*rng.standard_normal(n))*np.exp(-t*65);i=round(at*sr);x[i:i+n]+=sample[:min(n,len(x)-i)]
  return x*.4,sr
 def features(self,x,sr,fps):
  with tempfile.TemporaryDirectory(prefix='.audio-test-',dir=Path.cwd()) as d:
   assert Path(d).resolve().parent==Path.cwd().resolve()
   p=Path(d)/'test.wav'
   with wave.open(str(p),'wb') as w:w.setparams((1,2,sr,0,'NONE',''));w.writeframes((x*32767).astype('<i2').tobytes())
   return analyze(p,fps)
 def test_silence_no_false_impacts(self):
  d=structure(self.features(np.zeros(22050*2),22050,30));self.assertEqual(d['attackCandidates'],[]);self.assertEqual(d['impactCandidates'],[])
 def test_known_attacks_and_tempo(self):
  times=np.arange(.5,7.6,.5);x,sr=self.make([(t,1) for t in times]);a=self.features(x,sr,24);b=self.features(x,sr,60)
  detected=[v['atSeconds'] for v in a['rhythm']['attacks']]
  self.assertTrue(all(min(abs(v-t) for v in detected)<.04 for t in times))
  self.assertEqual(a['rhythm']['attacks'],b['rhythm']['attacks']);self.assertTrue(any(abs(v['bpm']-120)<3 for v in structure(a)['tempo']['candidates']))
 def test_local_energy_lift_not_just_sustained_loudness(self):
  x,sr=self.make([(t,.15 if t<4 else 1) for t in np.arange(.5,7.6,.5)]);d=structure(self.features(x,sr,30));self.assertTrue(any(v['energyLift']>0 for v in d['impactCandidates']));self.assertGreater(d['analysisRate'],150);self.assertLess(abs(d['impactCandidates'][0]['atSeconds']-4),.05)
if __name__=='__main__':unittest.main()
