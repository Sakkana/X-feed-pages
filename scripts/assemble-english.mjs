import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const ROOT=path.resolve(import.meta.dirname,'..'),DIR=path.join(ROOT,'.translation');
const manifest=JSON.parse(fs.readFileSync(path.join(DIR,'source.json'),'utf8'));
const config=JSON.parse(fs.readFileSync(path.join(ROOT,'scripts/translation-config.json'),'utf8'));
const translations={};let version;
for(const file of fs.readdirSync(DIR).filter(f=>/^result-\d+\.json$/.test(f))){
 const result=JSON.parse(fs.readFileSync(path.join(DIR,file),'utf8'));
 assert.equal(result.failed.length,0,'Translation shard has failures');
 version??=result.version;assert.equal(result.version,version,'Mismatched translation versions');
 for(const item of result.results){
  assert.equal(item.source,manifest.inputs[item.id]?.html,'Stale translation source');
  assert.equal(item.version,version,'Stale cached translation');
  translations[item.id]=item.translation;
 }
}
for(const id of Object.keys(manifest.inputs))assert.equal(typeof translations[id],'string',`Missing English block ${id}`);
const parseDom=new JSDOM(),parseNode=parseDom.window.document.createElement('div');
const text=html=>{parseNode.innerHTML=html;return parseNode.textContent;};
for(const [rel,page] of Object.entries(manifest.pages)){
 const pack={schemaVersion:1,sourceHash:page.sourceHash,translationVersion:version,model:config.model+' / '+config.license,blocks:{},attributes:{},search:{}};
 for(const [id,key] of Object.entries(page.blocks))pack.blocks[id]=translations[key];
 for(const [id,attrs] of Object.entries(page.attributes))pack.attributes[id]=Object.fromEntries(Object.entries(attrs).map(([name,key])=>[name,text(translations[key])]));
 for(const [report,ids] of Object.entries(page.search))pack.search[report]=ids.map(id=>text(translations[id])).join(' ');
 const dest=path.join(ROOT,'_site/i18n/en',rel+'.json');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(pack));
}
fs.writeFileSync(path.join(ROOT,'_site/i18n/build-info.json'),JSON.stringify({version,pages:Object.keys(manifest.pages).length,blocks:Object.keys(translations).length,model:config.model,sourceCommit:process.env.GITHUB_SHA||null}));
parseDom.window.close();
console.log(`Assembled complete English packs for ${Object.keys(manifest.pages).length} pages (${Object.keys(translations).length} blocks)`);
