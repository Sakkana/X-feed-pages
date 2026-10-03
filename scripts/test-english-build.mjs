import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {initializeLanguage} from '../assets/language.mjs';
const ROOT=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'.translation/source.json'),'utf8'));
let pages=0;
for(const [rel,page] of Object.entries(manifest.pages)){
 const dom=new JSDOM(fs.readFileSync(path.join(ROOT,'_site',rel),'utf8'),{url:'https://sakkana.github.io/X-feed-pages/'+rel});
 const doc=dom.window.document;
 const pack=JSON.parse(fs.readFileSync(path.join(ROOT,'_site/i18n/en',rel+'.json'),'utf8'));
 assert.equal(pack.sourceHash,page.sourceHash);
 const nodes=[...doc.querySelectorAll('[data-en-id]')],source=nodes.map(n=>n.innerHTML);
 const code=[...doc.querySelectorAll('pre,code')].map(n=>n.innerHTML);
 const copies=[...doc.querySelectorAll('[data-copy]')].map(n=>n.dataset.copy);
 const hrefs=[...doc.querySelectorAll('[href]')].map(n=>n.getAttribute('href'));
 const lang=initializeLanguage(doc,dom.window,undefined,{fetch:async()=>({ok:true,json:async()=>pack})});
 assert.equal(await lang.setMode('en'),true,`English failed: ${rel}`);assert.equal(doc.documentElement.lang,'en');
 assert.deepEqual([...doc.querySelectorAll('[href]')].map(n=>n.getAttribute('href')),hrefs);
 // Prose code and literal copy values must not be changed by translation.
 assert.deepEqual([...doc.querySelectorAll('pre,code')].map(n=>n.innerHTML),code);
 assert.deepEqual([...doc.querySelectorAll('[data-copy]')].map(n=>n.dataset.copy),copies);
 const englishText=nodes.map(n=>{const copy=n.cloneNode(true);copy.querySelectorAll('code,pre,[translate="no"]').forEach(e=>e.remove());return copy.textContent;}).join('\n');
 assert.ok(!/[\u3400-\u9fff]/.test(englishText.replace(/小/g,'')),`Untranslated text: ${rel}`);
 await lang.setMode('zh-CN');assert.deepEqual(nodes.map(n=>n.innerHTML),source,`Chinese source restoration failed: ${rel}`);
 lang.stop();dom.window.close();pages++;
}
console.log(`PASS: ${pages} complete source-bound English packs, valid structure, exact links/code and Chinese restoration`);
