import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';
const inputs=JSON.parse(fs.readFileSync('.translation/source.json')).inputs;
const ids=JSON.parse(fs.readFileSync('scripts/madlad-sample-ids.json'));
assert.equal(ids.length,5);
const samples=ids.map((id,index)=>{
 const source=inputs[id]?.html; assert.equal(crypto.createHash('sha256').update(source).digest('hex'),id);
 const document=new JSDOM(`<body>${source}</body>`).window.document;
 // This semantic probe bypasses HTML through an AST sidecar. It does not claim to assemble deployable translated markup.
 // Do not split inline text, mask finance terms or send URLs/code as model instructions.
 assert.equal(document.querySelector('code,pre,script,style'),null,'select a prose-only complete paragraph; never drop code');
 const source_text=document.body.textContent;
 assert.ok(!/https?:\/\/|0x[0-9a-fA-F]{40}/.test(source_text),'literal URL/address requires separate preservation work');
 const ast=[...document.body.querySelectorAll('*')].map(el=>({tag:el.tagName,attributes:[...el.attributes].map(a=>[a.name,a.value]),source_text:el.textContent}));
 return {id,role:index===4?'untuned_holdout':'previous_failure',source_html:source,source_text,ast,markup_reassembly:'not attempted by this semantic-only probe'};
});
fs.mkdirSync('translation-evidence',{recursive:true});
fs.writeFileSync('translation-evidence/madlad-inputs.json',JSON.stringify(samples,null,2));
console.log(`Prepared ${samples.length} complete public paragraphs; no source truncation or financial-word masks`);
