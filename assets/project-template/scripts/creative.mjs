import fs from 'node:fs';
import {draftCreative,inspectCreative,creativeMarkdown} from '../shared/creative.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
try{
 const mode=process.argv[2],raw=read('project-contract.json');
 if(mode==='plan'){
  if(fs.existsSync('creative-plan.json')||fs.existsSync('docs/creative-plan.md'))throw Error('Creative draft or reading copy already exists; existing work was preserved. Edit creative-plan.json, then check:creative refreshes the reading copy in qa/.');
  const plan=draftCreative(raw);fs.mkdirSync('docs',{recursive:true});
  fs.writeFileSync('creative-plan.json',JSON.stringify(plan,null,2)+'\n',{flag:'wx'});
  fs.writeFileSync('docs/creative-plan.md',creativeMarkdown(plan,raw),{flag:'wx'});
  console.log('Created creative-plan.json and docs/creative-plan.md. Complete the narrative and shot fields before checking.');
 }else if(mode==='check'){
  const plan=fs.existsSync('creative-plan.json')?read('creative-plan.json'):null;
  const manifest=fs.existsSync('script-manifest.json')?read('script-manifest.json'):null;
  const report=inspectCreative(plan,raw,manifest);fs.mkdirSync('qa',{recursive:true});
  fs.writeFileSync('qa/creative-report.json',JSON.stringify(report,null,2)+'\n');
  if(plan)fs.writeFileSync('qa/creative-plan.md',creativeMarkdown(plan,raw));
  console.log(JSON.stringify(report));if(!report.passed)process.exitCode=1;
 }else throw Error('Use plan:shots or check:creative');
}catch(e){console.error(e.message);process.exitCode=1}
