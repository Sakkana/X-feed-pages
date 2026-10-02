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
const operationsSample=record({path:'2026-10-02/11-10-37-【账号运营】-内容研究.md',markdown:'# 内容研究\n\n- 数据观察窗口：2026-10-02 11:05–11:09\n- 主类型：账号运营\n- 标签：账号运营、短演示\n\n案例'});
assert.equal(operationsSample.type,'账号运营');
assert.deepEqual(operationsSample.tags,['账号运营','短演示']);
assert.ok(!operationsSample.summary.includes('即时年化'));
assert.match(operationsSample.observation,/11:05–11:09/);
assert.deepEqual(record({path:'2026-10-02/11-10-37-【账号运营】-无标签.md',markdown:'# 无标签'}).tags,[]);
assert.equal(record({path:'2026-10-04/09-00-00_兼容旧文件名.md',markdown:'# 标题\n\n- 主类型：账号运营\n- 标签：账号运营、比较表'}).type,'账号运营');
assert.match(record({path:'2026-10-04/09-00-00-【DeFi】-新观察.md',markdown:'# 标题\n\n- 实际观察窗口：2026-10-04 08:55–08:58'}).observation,/08:55–08:58/);
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
  assert.equal(Buffer.compare(raw,fs.readFileSync(path.join(OUT,r.path))),0);
  assert.equal(crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${raw.length}\0`),raw])).digest('hex'),r.sha);
  const html=fs.readFileSync(path.join(OUT,r.path.replace(/\.md$/,'.html')),'utf8');
  assert.ok(html.includes(r.date+' '+r.time));assert.ok(html.includes('不构成投资建议'));
  const originalUrls=[...raw.toString().matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(m=>m[1]);
  for(const url of originalUrls)assert.ok(html.includes(url.replaceAll('&','&amp;')),`Missing original source: ${url}`);
  const sourceTables=(raw.toString().match(/^\|\s*[:-]+/gm)||[]).length;tables+=sourceTables;
  assert.equal((html.match(/<table>/g)||[]).length,sourceTables);
}
function check(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory()){check(file);continue;}if(!file.endsWith('.html'))continue;const html=fs.readFileSync(file,'utf8');assert.ok(!/Bearer\s+|github_pat_|ghp_|token=/.test(html));for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const target=m[1].replaceAll('&amp;','&');if(!target.startsWith(BASE))continue;const decoded=decodeURIComponent(target.slice(BASE.length).split(/[?#]/)[0])||'index.html';assert.ok(fs.existsSync(path.join(OUT,decoded)),`Broken internal link in ${file}: ${target}`);links++;}}}
check(OUT);
console.log(`PASS: ${index.records.length} reports, ${tables} Markdown tables, ${links} internal links; source URL preservation, byte-identical raw files, filename parsing and safe HTML`);
const home=fs.readFileSync(path.join(OUT,'index.html'),'utf8');
const splitPaths=new Set([
  '2026-10-02/11-10-37-【账号运营】-短演示结构与来源呈现.md',
  '2026-10-02/12-09-51-【账号运营】-研究长帖的问题拆分与证据边界.md',
  '2026-10-02/13-12-29-【账号运营】-可更新比较表与指标口径.md',
  '2026-10-02/14-07-20-【账号运营】-主帖风险提示与系列内容结构.md'
]);
const splitOperations=index.records.filter(r=>splitPaths.has(r.path));
assert.equal(splitOperations.length,4);
assert.ok(home.includes('<option value="账号运营">账号运营</option>'));
assert.ok(home.includes('data-theme="账号运营"'));
for(const r of splitOperations){
  assert.ok(r.tags.includes('账号运营'));
  const raw=fs.readFileSync(path.join(ROOT,r.path),'utf8');
  assert.match(raw,/原报告发送时间：2026-10-02/);
  assert.match(raw,/拆分整理时间：.*仅拆分原报告，未重新核验/);
  const html=fs.readFileSync(path.join(OUT,r.path.replace(/\.md$/,'.html')),'utf8');
  assert.ok(html.includes('data-type="账号运营">账号运营</span>'));
}
for(const r of index.records.filter(r=>r.type!=='账号运营')){
  assert.ok(!r.tags.some(t=>['账号运营','账号增长'].includes(t)),`Account tag leaked into research: ${r.path}`);
  const raw=fs.readFileSync(path.join(ROOT,r.path),'utf8');
  assert.ok(!/^## .*?(?:X 内容案例|养号：|账号增长：)/m.test(raw),`Account section leaked into research: ${r.path}`);
}
console.log('PASS: four historical account-operation splits, exact category/filter badges, preserved timestamps, no legacy tag leakage');
assert.ok(!home.includes('从线索到证据'));
assert.ok(!home.includes('不构成投资建议'));
assert.ok(!home.includes('class="summary"'));
assert.ok(!home.includes('<aside'));
assert.match(home,/for="date-filter"/);
assert.match(home,/for="query-filter"/);
const css=fs.readFileSync(path.join(ROOT,'assets/style.css'),'utf8');
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(css,/animation:none!important;transition:none!important/);
const js=fs.readFileSync(path.join(ROOT,'assets/filters.js'),'utf8');
assert.match(js,/matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
assert.match(js,/if\(!reduced\)requestAnimationFrame/);
console.log('PASS: concise homepage, explicit accessible labels and reduced-motion guards');
assert.ok(home.includes('<title>小🐟 defi 研究 feed 流</title>'));
assert.ok(home.includes('<h1 class="sr-only">小🐟 defi 研究 feed 流</h1>'));
assert.ok(home.includes('aria-label="小🐟 defi 研究 feed 流"'));
assert.ok(home.includes('class="ambient" aria-hidden="true"'));
assert.ok(!home.includes('JSON 索引'));
assert.ok(fs.existsSync(path.join(OUT,'assets/aurora.svg')));
for(const r of index.records){
  const page=fs.readFileSync(path.join(OUT,r.path.replace(/\.md$/,'.html')),'utf8');
  assert.ok(page.includes(' · 小🐟 defi 研究 feed 流</title>'));
  assert.ok(!page.includes('JSON 索引'));
}
console.log('PASS: exact defi identity, decorative background, hidden JSON navigation, all report categories preserved');

assert.ok(fs.existsSync(path.join(OUT,'assets/circuit.svg')));
assert.match(css,/color-scheme:dark/);
assert.match(css,/scan-sweep/);
assert.ok(home.includes('content="#050b08"'));
console.log('PASS: dark charcoal and green theme with reduced-motion scan guard');

assert.ok(home.includes('<span class="brand-name">小🐟 <span>defi 研究 feed 流</span></span>'));
