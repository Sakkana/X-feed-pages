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
  assert.ok(html.includes(r.date+' '+r.time));assert.ok(!html.includes('class="article-note"'));
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
assert.ok(!home.includes('class="article-note"'));
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

// Signal grades are explicit historical metadata, never inferred from yield claims.
const {signalBadge,normalizeSignal,parseFrontmatter}=await import('./render.mjs');
const signalPath='2026-10-03/09-05-01-【DeFi】-信号测试.md';
for(const [value,expected] of [['strong','strong'],['medium','medium'],['weak','weak'],['强','strong'],['中','medium'],['弱','weak']]){
 assert.equal(normalizeSignal(value),expected);
 const body=record({path:signalPath,markdown:'# 标题\n\n信号等级：'+value+'\n评级依据：截至原观察时间，测试依据。\n\n实际结论'});
 assert.equal(body.signal_strength,expected);assert.equal(body.summary,'实际结论');assert.match(signalBadge(body),new RegExp('data-strength="'+expected+'"'));
 assert.match(signalBadge(body),new RegExp('>'+({strong:'强',medium:'中',weak:'弱'}[expected])+'</span>$'));
 const front=record({path:signalPath,markdown:'---\nsignal_strength: "'+value+'"\n---\n# 标题\n\n结论'});assert.equal(front.signal_strength,expected);assert.equal(front.title,'标题');
 assert.ok(!markdown(front.markdown,signalPath).includes('signal_strength'));
}
assert.equal(record({path:signalPath,markdown:'# 标题\n\n信号：弱｜评级依据：原时点\n\n结论'}).signal_strength,'weak');
assert.equal(record({path:signalPath,markdown:'# 标题\n\nAPY 999%'}).signal_strength,undefined);
assert.equal(record({path:signalPath,markdown:'# 标题\n\n信号等级：unknown'}).signal_strength,undefined);
assert.equal(record({path:signalPath,signal_strength:'medium',markdown:'# 标题\n\n信号等级：弱'}).signal_strength,'medium');
for(const type of ['账号运营','合约安全'])assert.equal(record({path:'2026-10-03/09-05-01-【'+type+'】-不评级.md',signal_strength:'strong',markdown:'# 标题\n\n信号等级：强'}).signal_strength,undefined);
assert.equal(signalBadge({signal_strength:'invalid'}),'');assert.equal(signalBadge({}),'');
const reviewedTimes=new Set(['11:10:37','12:09:51','12:37:16','12:50:16','13:12:29','14:07:20','15:10:02','16:07:32','17:09:19','18:14:06','19:13:12','19:40:58','21:22:35','22:39:26','23:19:29']);
const approvedSignals=index.records.filter(r=>r.date==='2026-10-02'&&reviewedTimes.has(r.time)&&!['账号运营','合约安全'].includes(r.type));assert.equal(approvedSignals.length,15);assert.ok(approvedSignals.every(r=>r.signal_strength==='weak'));
const rated=index.records.filter(r=>r.signal_strength);assert.equal((home.match(/class="signal-badge"/g)||[]).length,rated.length);for(const strength of ['strong','medium','weak'])assert.equal((home.match(new RegExp('data-strength="'+strength+'"','g'))||[]).length,rated.filter(r=>r.signal_strength===strength).length);
for(const r of approvedSignals){assert.match(fs.readFileSync(path.join(ROOT,r.path),'utf8'),/信号等级：弱\n评级依据：截至原观察时间，/);}
for(const r of index.records.filter(r=>['账号运营','合约安全'].includes(r.type)))assert.equal(r.signal_strength,undefined);
assert.ok(home.includes('title="按报告观察时点评级"'));
console.log('PASS: explicit frontmatter/body signal grades, unknown/non-opportunity suppression, 15 approved historical weak badges and optional index fields');
