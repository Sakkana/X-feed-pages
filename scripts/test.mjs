import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {record,markdown,safeHref,BASE,reportHref} from './render.mjs';
const ROOT=path.resolve(import.meta.dirname,'..'),OUT=path.join(ROOT,'_site');
const index=JSON.parse(fs.readFileSync(path.join(OUT,'reports.json'),'utf8'));
assert.ok(index.records.length>0);
assert.deepEqual(index.records.map(r=>r.path),index.records.map(r=>r.path).sort((a,b)=>b.localeCompare(a)));
const sample=record({path:'2026-10-03/09-05-01-【DEX】-新研究.md',markdown:'# 报告标题\n\n结论内容'});
assert.equal(sample.type,'DEX');assert.equal(sample.title,'报告标题');assert.equal(sample.time,'09:05:01');
assert.throws(()=>record({path:'../secret.md',markdown:'secret'}));
assert.equal(safeHref('javascript:alert(1)','2026-10-02/report.md'),'');
assert.equal(safeHref('data:text/html,unsafe','2026-10-02/report.md'),'');
assert.equal(safeHref('../README.md#2026-10-02','2026-10-02/report.md'),BASE+'?date=2026-10-02');
assert.ok(!markdown('<script>alert(1)</script>','test').includes('<script>'));
assert.match(markdown('| A | B |\n| --- | --- |\n| 1 | 2 |','test'),/<table>/);
assert.match(markdown('## 二级标题','test'),/<h2 id="二级标题">/);
let links=0,tables=0;
for(const r of index.records){
  const raw=fs.readFileSync(path.join(ROOT,r.path));
  assert.equal(fs.compare?fs.compare(raw,raw):Buffer.compare(raw,fs.readFileSync(path.join(OUT,r.path))),0);
  assert.equal(crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${raw.length}\0`),raw])).digest('hex'),r.sha);
  const html=fs.readFileSync(path.join(OUT,r.path.replace(/\.md$/,'.html')),'utf8');
  assert.ok(html.includes(r.date+' '+r.time));assert.ok(html.includes('不构成投资建议'));
  const originalUrls=[...raw.toString().matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(m=>m[1]);
  for(const url of originalUrls)assert.ok(html.includes(url.replaceAll('&','&amp;')),`Missing original source: ${url}`);
  const sourceTables=(raw.toString().match(/^\|\s*[:-]+/gm)||[]).length;tables+=sourceTables;
  assert.equal((html.match(/<table>/g)||[]).length,sourceTables);
}
function check(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory()){check(file);continue;}if(!file.endsWith('.html'))continue;const html=fs.readFileSync(file,'utf8');assert.ok(!/siwc_|OAI-Sites|private-site|sourceCommit|api\/archive|BUCKET|appgprj_|token=/.test(html));for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const target=m[1].replaceAll('&amp;','&');if(!target.startsWith(BASE))continue;const decoded=decodeURIComponent(target.slice(BASE.length).split(/[?#]/)[0])||'index.html';assert.ok(fs.existsSync(path.join(OUT,decoded)),`Broken internal link in ${file}: ${target}`);links++;}}}
check(OUT);
console.log(`PASS: ${index.records.length} reports, ${tables} Markdown tables, ${links} internal links; source URL preservation, byte-identical raw files, filename parsing and safe HTML`);
