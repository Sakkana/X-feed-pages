import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {BASE,record,e,markdown,github,reportHref} from './render.mjs';
const ROOT=path.resolve(import.meta.dirname,'..');
const OUT=path.join(ROOT,'_site');
const ASSET_VERSION=crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,'assets/filters.js'))).update(fs.readFileSync(path.join(ROOT,'assets/style.css'))).digest('hex').slice(0,12);
const metadata=fs.existsSync(path.join(ROOT,'metadata.json'))?JSON.parse(fs.readFileSync(path.join(ROOT,'metadata.json'),'utf8')):{};
const records=[];
for(const dir of fs.readdirSync(ROOT,{withFileTypes:true})){
  if(!dir.isDirectory()||!/^\d{4}-\d{2}-\d{2}$/.test(dir.name))continue;
  for(const name of fs.readdirSync(path.join(ROOT,dir.name))){
    if(!/^\d{2}-\d{2}-\d{2}(?:-【[^】/]+】-[^/]+|_[^/]+)\.md$/.test(name))continue;
    const p=dir.name+'/'+name, md=fs.readFileSync(path.join(ROOT,p),'utf8');
    const b=Buffer.from(md);const sha=crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
    records.push(record({...metadata[p],path:p,sha,markdown:md}));
  }
}
records.sort((a,b)=>b.path.localeCompare(a.path));
if(!records.length)throw new Error('No dated research Markdown found');
const dates=[...new Set(records.map(r=>r.date))];
const themes=[...new Set(records.flatMap(r=>[r.type,...r.tags]))].sort((a,b)=>a.localeCompare(b,'zh'));
const types=[...new Set(records.map(r=>r.type))];
const homepage=BASE;
function badges(r){return '<span class="topic" data-type="'+e(r.type)+'">'+e(r.type)+'</span>'+r.tags.filter(t=>t!==r.type).map(t=>'<span class="tag">'+e(t)+'</span>').join('');}
function layout(title,body,script=false){return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="小🐟 defi 研究 feed 流"><meta name="theme-color" content="#050b08"><meta name="referrer" content="strict-origin-when-cross-origin"><title>${script?'小🐟 defi 研究 feed 流':e(title)+' · 小🐟 defi 研究 feed 流'}</title><link rel="icon" href="${BASE}assets/favicon.svg?v=${ASSET_VERSION}" type="image/svg+xml"><link rel="stylesheet" href="${BASE}assets/style.css?v=${ASSET_VERSION}">${script?`<script defer src="${BASE}assets/filters.js?v=${ASSET_VERSION}"></script>`:''}</head><body class="${script?'archive-page':'article-page'}"><div class="ambient" aria-hidden="true"><div class="ambient-orb"></div><div class="ambient-grid"></div></div><a class="skip" href="#main">跳转到正文</a><header><div class="top"><a class="brand" href="${homepage}" aria-label="小🐟 defi 研究 feed 流"><span class="brand-mark" aria-hidden="true"><span></span></span><span class="brand-name">小🐟 defi <span>研究 feed 流</span></span></a><a class="repo-link" href="https://github.com/Sakkana/X-feed-pages">GitHub <span aria-hidden="true">↗</span></a></div></header><div class="workspace"><main class="main" id="main">${body}</main></div><footer class="foot"><span>北京时间 · UTC+8</span></footer></body></html>`;}
let body=`<div class="page-heading"><h1>小🐟 defi 研究 feed 流</h1><span class="total"><strong id="result-count">${records.length}</strong> 篇</span></div><form class="filters" role="search"><div class="select-field"><label class="sr-only" for="date-filter">研究日期</label><select id="date-filter" name="date"><option value="">全部日期</option>${dates.map(d=>`<option value="${d}">${d}</option>`).join('')}</select></div><div class="select-field"><label class="sr-only" for="type-filter">主题 / 标签</label><select id="type-filter" name="type"><option value="">全部主题</option>${themes.map(t=>`<option value="${e(t)}">${e(t)}</option>`).join('')}</select></div><div class="search-field"><span aria-hidden="true">⌕</span><label class="sr-only" for="query-filter">搜索标题 / 摘要</label><input id="query-filter" name="q" type="search" placeholder="搜索记录" autocomplete="off"></div><button type="reset" hidden>重置</button></form><nav class="filter-topics" aria-label="快捷主题筛选"><a href="${BASE}" data-theme="">全部</a>${['DeFi','DEX','套利','山寨币估值','RWA','账号运营'].filter(t=>themes.includes(t)).map(t=>`<a data-theme="${e(t)}" href="${BASE}?type=${encodeURIComponent(t)}">${e(t)}</a>`).join('')}</nav><p id="filter-status" class="sr-only" role="status" aria-live="polite"></p><noscript><p class="notice">启用 JavaScript 后可筛选记录。</p></noscript><div id="empty-state" class="empty" hidden><span aria-hidden="true">⌕</span><p>没有找到相关记录</p><a href="${BASE}">查看全部</a></div>`;
for(const d of dates){const group=records.filter(r=>r.date===d);body+=`<section data-day="${d}" aria-label="${d} 的报告"><div class="date-row"><h2>${d}</h2><span class="day-count">${group.length} 篇</span></div>`;for(const r of group){body+=`<div class="entry" data-path="${e(r.path)}" data-date="${r.date}" data-themes="${e(JSON.stringify([r.type,...r.tags]))}" data-search="${e([r.title,r.summary,r.type,...r.tags].join(' ').toLowerCase())}"><div class="stamp"><time datetime="${r.date}T${r.time}+08:00">${r.time}</time></div><a class="report-card" href="${reportHref(r.path)}"><div class="card-content"><div class="card-top">${badges(r)}</div><h3 class="card-title">${e(r.title)}</h3></div><span class="card-arrow" aria-hidden="true">↗</span></a></div>`;}body+='</section>';}
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});fs.cpSync(path.join(ROOT,'assets'),path.join(OUT,'assets'),{recursive:true});
fs.writeFileSync(path.join(OUT,'index.html'),layout('小🐟 defi 研究 feed 流',body,true));
for(const [idx,r] of records.entries()){
  const content=`<a class="back" href="${BASE}?date=${r.date}">← 返回 ${r.date} 的记录</a><article class="article-shell"><div class="card-top">${badges(r)}</div><h1 class="article-title">${e(r.title)}</h1><div class="article-meta"><span>${r.date} · ${r.time} · 北京时间</span><a href="${e(github(r.path))}" target="_blank" rel="noopener noreferrer">GitHub 原文 ↗</a><a href="${BASE+r.path.split('/').map(encodeURIComponent).join('/')}">Markdown 原文</a></div><p class="article-observation">核验 · ${e(r.observation)}</p><div class="prose">${markdown(r.markdown,r.path)}</div><p class="article-note">研究记录，不构成投资建议。</p></article><nav class="article-footer" aria-label="相邻记录">${records[idx+1]?`<a href="${reportHref(records[idx+1].path)}">← 更早：${e(records[idx+1].title)}</a>`:'<span></span>'}${records[idx-1]?`<a href="${reportHref(records[idx-1].path)}">更新：${e(records[idx-1].title)} →</a>`:''}</nav>`;
  const dest=path.join(OUT,r.path.replace(/\.md$/,'.html'));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,layout(r.title,content));fs.copyFileSync(path.join(ROOT,r.path),path.join(OUT,r.path));
}
const index={schemaVersion:1,timezone:'Asia/Shanghai',repository:'Sakkana/X-feed-pages',recordCount:records.length,records:records.map(({markdown,...r})=>({...r,url:reportHref(r.path),github:github(r.path)}))};
fs.writeFileSync(path.join(OUT,'reports.json'),JSON.stringify(index,null,2)+'\n');
fs.writeFileSync(path.join(ROOT,'reports.json'),JSON.stringify(index,null,2)+'\n');
const table=records.map(r=>`| ${r.date} ${r.time} | ${r.type} | [${r.title}](${r.path.split('/').map(encodeURIComponent).join('/')}) |`).join('\n');
fs.writeFileSync(path.join(ROOT,'README.md'),`# defi 研究记录\n\n[打开研究主页](https://sakkana.github.io/X-feed-pages/) · [机器可读索引](reports.json)\n\n按北京时间倒序归档。主页支持日期、主题（含 DeFi、DEX）和关键词筛选，文章保留完整来源、观察时点与风险说明。\n\n研究记录不构成投资建议，历史收益、报价与判断不代表当前情况。\n\n## 研究目录\n\n| 报告时间（北京时间） | 主题 | 报告 |\n| --- | --- | --- |\n${table}\n\n## 更新与发布\n\n1. 将审核过、可以公开的报告加入日期目录。新命名格式为 \`YYYY-MM-DD/HH-MM-SS-【类型】-summary.md\`，现有下划线文件名保持不变\n2. 正文保留原始观察时间、来源链接、成本假设和风险提示。文件名时间为报告发送时间，不替代数据观察时间；历史拆分沿用原报告时间，并另注明拆分整理时间\n3. 资料研究与账号运营分别成文；账号运营使用独立主类型和标签 \`账号运营\`，不要混入资料研究正文或研究标签\n4. 可在 \`metadata.json\` 以完整路径为键补充 \`type\`、\`tags\`、\`summary\`、\`observation\`；文件名中的类型优先\n5. 本地运行 \`node scripts/build.mjs\` 和 \`node scripts/test.mjs\`。生成的 README 和 reports.json 可一并提交\n6. 提交到 main 后，GitHub Actions 自动重新扫描公开 Markdown、生成静态页面并部署 GitHub Pages。线上 reports.json 始终由构建生成\n\n仅日期目录中符合上述新旧格式的 Markdown 会进入网页。站点不需要后端、访问令牌或私有仓库读取权限。\n\n页面源码：\`scripts/\` 与 \`assets/\`；生成目录：\`_site/\`（不提交）。\n`);
fs.writeFileSync(path.join(OUT,'404.html'),layout('没有找到这条记录',`<h1>没有找到这条记录</h1><p>链接可能已变更，请从时间线重新打开。</p><a class="back" href="${BASE}">返回研究时间线</a>`));
fs.writeFileSync(path.join(OUT,'.nojekyll'),'');
console.log(`Built ${records.length} reports (${dates.length} days) into _site`);
