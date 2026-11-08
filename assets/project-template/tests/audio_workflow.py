import unittest,sys,json,tempfile
from pathlib import Path
import numpy as np
tools=Path(__file__).resolve().parents[1]/'tools';sys.path.insert(0,str(tools if (tools/'music_workflow.py').exists() else Path(__file__).resolve().parents[3]/'scripts'))
from music_workflow import enrich_analysis,markdown_report
from analyze_track import build

class WorkflowTests(unittest.TestCase):
 def features(self,rms):return {'fps':20,'duration':len(rms)/20,'rms':list(rms),'bands':{'bass':list(rms),'body':list(rms),'air':list(rms)}}
 def analysis(self):return {'tempo':{'candidates':[]},'attackCandidates':[{'id':'a','atSeconds':5,'strength':2,'dominantBand':'low'}],'impactCandidates':[],'climaxCandidates':[]}
 def test_detects_entry_and_followthrough_from_evidence(self):
  f=self.features(np.r_[np.ones(100)*.03,np.ones(120)*.4]);a=enrich_analysis(f,self.analysis());self.assertTrue(any(abs(v['atSeconds']-5)<.5 and v['kind']=='entry_candidate' for v in a['sectionTransitions']));self.assertTrue(a['visualPhrases']);self.assertGreater(a['visualPhrases'][0]['followThroughRange'][1],5);self.assertIn('进入候选',markdown_report(a,'synthetic.wav'))
 def test_silence_and_steady_tone_do_not_invent_climax(self):
  for value in [0,.2]:
   a=enrich_analysis(self.features(np.ones(240)*value),self.analysis());self.assertEqual(a['sectionTransitions'],[]);self.assertEqual(a['visualPhrases'],[])
 def test_candidate_times_move_with_input_instead_of_fixed_seventeen(self):
  f=self.features(np.r_[np.ones(140)*.02,np.ones(160)*.4]);a=self.analysis();a['attackCandidates'][0]['atSeconds']=7;a=enrich_analysis(f,a);self.assertTrue(any(abs(v['atSeconds']-7)<.5 for v in a['sectionTransitions']));self.assertEqual(a['visualPhrases'][0]['atSeconds'],7)
 def test_nonempty_review_directory_is_preserved(self):
  with tempfile.TemporaryDirectory(prefix='.workflow-test-',dir=Path.cwd()) as d:
   assert Path(d).resolve().parent==Path.cwd().resolve();p=Path(d);(p/'source.wav').write_bytes(b'test');out=p/'out';out.mkdir();(out/'review.html').write_text('authored',encoding='utf8')
   with self.assertRaisesRegex(ValueError,'preserved'):build(p/'source.wav',out,'not-used')
   self.assertEqual((out/'review.html').read_text(encoding='utf8'),'authored')
if __name__=='__main__':unittest.main()
