import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {JSDOM} from 'jsdom';
const ROOT=path.resolve(import.meta.dirname,'..'),OUT=path.join(ROOT,'_site');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const CJK=/[\u3400-\u9fff]/;
const EXCLUDE='script,style,pre,code,[translate="no"],.notranslate,.language-menu,.world-clocks,#language-status,#copy-status,#filter-status,.day-count,.feed-summary .total';
const inputs={},pages={};
function add(html){const id=hash(html);inputs[id]={id,html};return id;}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk(OUT).filter(f=>f.endsWith('.html'))){
 const rel=path.relative(OUT,file),dom=new JSDOM(fs.readFileSync(file,'utf8')),doc=dom.window.document;
 const page={blocks:{},attributes:{},search:{}};
 for(const node of doc.querySelectorAll('[placeholder],[aria-label],[title]')){
  if(node.closest(EXCLUDE))continue;
  const attrs={};for(const name of ['placeholder','aria-label','title'])if(CJK.test(node.getAttribute(name)||''))attrs[name]=add(node.getAttribute(name));
  if(Object.keys(attrs).length){const id=hash(JSON.stringify(attrs));node.dataset.enAttr=id;page.attributes[id]=attrs;}
 }
 // Translate complete prose blocks with inline markup protected by the translator.
 for(const node of doc.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td,th,blockquote')){
  if(node.closest(EXCLUDE)||node.closest('[data-en-id]')||!CJK.test(node.textContent)||node.querySelector('button,input,select'))continue;
  const id=add(node.innerHTML);node.dataset.enId=id;page.blocks[id]=id;
 }
 // Remaining small static UI labels never contain functional descendants.
 for(const node of [...doc.querySelectorAll('a,button,span,label,option,summary,title')].reverse()){
  if(node.closest(EXCLUDE)||node.closest('[data-en-id]')||node.querySelector('[data-en-id],button,input,select,a')||!CJK.test(node.textContent))continue;
  const id=add(node.innerHTML);node.dataset.enId=id;page.blocks[id]=id;
 }
 for(const entry of doc.querySelectorAll('.entry'))page.search[entry.dataset.path]=[...entry.querySelectorAll('[data-en-id]')].map(n=>n.dataset.enId);
 const sourceHash=hash(JSON.stringify(page));page.sourceHash=sourceHash;
 const meta=doc.createElement('meta');meta.name='english-pack';meta.content='/X-feed-pages/i18n/en/'+rel+'.json';doc.head.append(meta);
 const check=doc.createElement('meta');check.name='english-source-hash';check.content=sourceHash;doc.head.append(check);
 fs.writeFileSync(file,dom.serialize());pages[rel]=page;dom.window.close();
}
fs.mkdirSync(path.join(ROOT,'.translation'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'.translation/source.json'),JSON.stringify({inputs,pages},null,2));
console.log(`Prepared ${Object.keys(inputs).length} unique blocks across ${Object.keys(pages).length} public pages`);
