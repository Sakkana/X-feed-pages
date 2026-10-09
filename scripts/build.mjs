import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {BASE,record,e,markdown,github,reportHref,signalBadge} from './render.mjs';
import {CITIES} from '../assets/clocks.mjs';
const ROOT=path.resolve(import.meta.dirname,'..');
const OUT=path.join(ROOT,'_site');
const ASSET_VERSION=crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,'assets/filters.js'))).update(fs.readFileSync(path.join(ROOT,'assets/style.css'))).update(fs.readFileSync(path.join(ROOT,'assets/home.mjs'))).update(fs.readFileSync(path.join(ROOT,'assets/clocks.mjs'))).update(fs.readFileSync(path.join(ROOT,'assets/language.mjs'))).update(fs.readFileSync(path.join(ROOT,'assets/timeline.mjs'))).digest('hex').slice(0,12);
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
const languageMenu=`<details class="language-menu notranslate" id="language-menu" translate="no"><summary aria-label="选择语言"><span class="language-current">🇨🇳 简体中文</span><span aria-hidden="true">⌄</span></summary><div class="language-options"><button type="button" data-language="zh-CN" aria-current="true">🇨🇳 简体中文</button><button type="button" data-language="zh-Hant" aria-current="false">🇨🇳 繁體中文</button></div></details>`;

const referrals=JSON.parse(fs.readFileSync(path.join(ROOT,'referrals.json'),'utf8'));

function badges(r){return '<span class="topic" data-type="'+e(r.type)+'">'+e(r.type)+'</span>'+r.tags.filter(t=>t!==r.type).map(t=>'<span class="tag">'+e(t)+'</span>').join('');}
function layout(title,body,script=false){return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="小🐟 defi 研究 feed 流"><meta name="theme-color" content="#050b08"><meta name="referrer" content="strict-origin-when-cross-origin"><title>${script?'小🐟 defi 研究 feed 流':e(title)+' · 小🐟 defi 研究 feed 流'}</title><link rel="icon" href="${BASE}assets/favicon.svg?v=${ASSET_VERSION}" type="image/svg+xml"><link rel="stylesheet" href="${BASE}assets/style.css?v=${ASSET_VERSION}"><script type="module" src="${BASE}assets/clocks.mjs?v=${ASSET_VERSION}"></script><script type="module" src="${BASE}assets/language.mjs?v=${ASSET_VERSION}"></script>${script?`<script defer src="${BASE}assets/filters.js?v=${ASSET_VERSION}"></script><script type="module" src="${BASE}assets/home.mjs?v=${ASSET_VERSION}"></script><script type="module" src="${BASE}assets/timeline.mjs?v=${ASSET_VERSION}"></script>`:''}</head><body class="${script?'archive-page':'article-page'}"><div class="ambient" aria-hidden="true"><div class="ambient-orb"></div><div class="ambient-grid"></div></div><a class="skip" href="#main">跳转到正文</a><header><div class="top"><a class="brand" translate="no" href="${homepage}" aria-label="小🐟 defi 研究 feed 流"><span class="brand-mark" aria-hidden="true"><span></span></span><span class="brand-name">小🐟 <span>defi 研究 feed 流</span></span></a>${languageMenu}</div></header><p id="language-status" class="language-status" role="status" aria-live="polite" translate="no"></p><div class="workspace"><main class="main" id="main">${body}</main></div><footer class="foot"><div class="world-clocks" aria-label="世界时间">${CITIES.map(([label,zone])=>`<time class="world-clock" data-clock-zone="${zone}" data-clock-label="${label}">${label} --:--:--</time>`).join('')}</div><div class="site-credit" translate="no"><span>Powered by OpenAI DOTS</span><span aria-hidden="true">｜</span><a href="https://github.com/Sakkana/X-feed-pages" target="_blank" rel="noopener noreferrer">Github</a></div></footer></body></html>`;}
let body=`<h1 class="sr-only">小🐟 defi 研究 feed 流</h1><div class="home-tabs" role="tablist" aria-label="主页内容"><button type="button" role="tab" id="tab-feed" data-view="feed" aria-controls="panel-feed" aria-selected="true" tabindex="0">feed 流</button><button type="button" role="tab" id="tab-invites" data-view="invites" aria-controls="panel-invites" aria-selected="false" tabindex="-1">邀请码</button></div><section id="panel-feed" class="tab-panel" role="tabpanel" aria-labelledby="tab-feed" tabindex="0"><div class="feed-summary"><span class="total"><strong id="result-count">${records.length}</strong> 篇</span></div><form class="filters" role="search"><div class="select-field"><label class="sr-only" for="date-filter">研究日期</label><select id="date-filter" name="date"><option value="">全部日期</option>${dates.map(d=>`<option value="${d}">${d}</option>`).join('')}</select></div><div class="select-field"><label class="sr-only" for="type-filter">主题 / 标签</label><select id="type-filter" name="type"><option value="">全部主题</option>${themes.map(t=>`<option value="${e(t)}">${e(t)}</option>`).join('')}</select></div><div class="search-field"><span aria-hidden="true">⌕</span><label class="sr-only" for="query-filter">搜索标题 / 摘要</label><input id="query-filter" name="q" type="search" placeholder="搜索记录" autocomplete="off"></div><button type="reset" hidden>重置</button></form><nav class="filter-topics" aria-label="快捷主题筛选"><a href="${BASE}" data-theme="">全部</a>${['DeFi','DEX','套利','山寨币估值','RWA','账号运营'].filter(t=>themes.includes(t)).map(t=>`<a data-theme="${e(t)}" href="${BASE}?type=${encodeURIComponent(t)}">${e(t)}</a>`).join('')}</nav><p id="filter-status" class="sr-only" role="status" aria-live="polite"></p><noscript><style>.entry[hidden]{display:grid!important}</style><p class="notice">启用 JavaScript 后可筛选记录。</p></noscript><div id="empty-state" class="empty" hidden><span aria-hidden="true">⌕</span><p>没有找到相关记录</p><a href="${BASE}">查看全部</a></div>`;

for(const d of dates){const group=records.filter(r=>r.date===d);body+=`<section data-day="${d}" id="day-${d}" aria-label="${d} 的报告"><div class="date-row"><details class="date-menu" translate="no"><summary aria-label="选择研究日期，当前 ${d}"><h2>${d}</h2><span class="date-chevron" aria-hidden="true">⌄</span></summary><div class="timeline-options">${dates.map(date=>`<button type="button" data-jump-date="${date}"${date===d?' aria-current="date"':''}>${date}</button>`).join('')}</div></details><span class="day-count">${group.length} 篇</span></div>`;for(const r of group){body+=`<div class="entry"${records.indexOf(r)>=20?' hidden':''} data-path="${e(r.path)}" data-date="${r.date}" data-themes="${e(JSON.stringify([r.type,...r.tags]))}" data-search="${e([r.title,r.summary,r.type,...r.tags].join(' ').toLowerCase())}"><div class="stamp"><time datetime="${r.date}T${r.time}+08:00">${r.time}</time></div><a class="report-card" href="${reportHref(r.path)}"><div class="card-content"><div class="card-top">${badges(r)}</div><h3 class="card-title">${e(r.title)}</h3></div><span class="card-aside"><span class="card-arrow" aria-hidden="true">↗</span>${signalBadge(r)}</span></a></div>`;}body+='</section>';}
body+='<div class="load-more-wrap"><button type="button" id="load-more" class="load-more" hidden><span aria-hidden="true">⌄</span><span>展开更多</span></button></div></section><section id="panel-invites" class="tab-panel invites-panel" role="tabpanel" aria-labelledby="tab-invites" tabindex="0" hidden><p class="invite-note">绑定小🐟的邀请码享受返佣优惠和现金奖励，具体以平台政策为准。</p>';
for(const [category,slug] of [['CEX','cex'],['U卡','ucard'],['虚拟银行','banks'],['多币种转账工具','transfers'],['DEX/Wallet','dex-wallet'],['海外 eSIM','esim']]){
  body+=`<section class="invite-section" aria-labelledby="section-${slug}"><h2 id="section-${slug}">${category}</h2><div class="invite-grid">`;
  for(const item of referrals.filter(r=>r.section===category)){
    body+=`<article class="invite-card" data-brand="${e(item.id)}"><div class="brand-logo"><img src="${BASE+item.logo}?v=${ASSET_VERSION}" alt="${e(item.name)} logo" width="60" height="60" loading="lazy"></div><div class="invite-details"><h3 translate="no"${item.id==='saily'?' class="invite-title-with-origin"':''}>${e(item.name)}${item.id==='saily'?'<span class="invite-origin">归属地：🇺🇸</span>':''}</h3><button type="button" class="copy-button code-copy" data-copy="${e(item.code)}" data-label="${e(item.name)} 邀请码" aria-label="复制 ${e(item.name)} 邀请码 ${e(item.code)}"><span class="copy-kind">邀请码</span><span class="copy-value" translate="no">${e(item.code)}</span><span class="copy-hint">点击复制</span></button><div class="copy-button url-copy"><a class="copy-value registration-link" href="${e(item.url)}" target="_blank" rel="noopener noreferrer">${e(item.name)} 注册链接</a><button type="button" class="copy-hint copy-link-button" data-copy="${e(item.url)}" data-label="${e(item.name)} 注册链接" aria-label="复制 ${e(item.name)} 完整注册链接">点击复制链接</button></div></div></article>`;
  }
  body+='</div></section>';
}
body+='</section><div id="copy-status" class="copy-toast" role="status" aria-live="polite" aria-atomic="true"></div><section id="copy-fallback" class="copy-fallback" aria-labelledby="manual-copy-label" hidden><label id="manual-copy-label" for="manual-copy">请手动复制以下内容</label><textarea id="manual-copy" readonly rows="3"></textarea><button id="copy-close" type="button">关闭</button></section><noscript><style>#panel-invites[hidden]{display:block!important}.home-tabs{display:none}.copy-button{cursor:text}</style><p class="notice">复制按钮需要 JavaScript；也可手动选择文本。</p></noscript>';
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});fs.cpSync(path.join(ROOT,'assets'),path.join(OUT,'assets'),{recursive:true});
fs.mkdirSync(path.join(OUT,'assets/vendor'),{recursive:true});
fs.copyFileSync(path.join(ROOT,'node_modules/opencc-js/dist/esm/cn2t.js'),path.join(OUT,'assets/vendor/opencc-cn2t.mjs'));
for(const name of ['LICENSE','THIRD_PARTY_LICENSES.md'])fs.copyFileSync(path.join(ROOT,'node_modules/opencc-js',name),path.join(OUT,'assets/vendor','opencc-'+name));
fs.copyFileSync(path.join(ROOT,'node_modules/opencc-js/LICENSES/Apache-2.0.txt'),path.join(OUT,'assets/vendor/Apache-2.0.txt'));
fs.writeFileSync(path.join(OUT,'index.html'),layout('小🐟 defi 研究 feed 流',body,true));
for(const [idx,r] of records.entries()){
  const content=`<a class="back" href="${BASE}?date=${r.date}">← 返回 ${r.date} 的记录</a><article class="article-shell"><div class="card-top">${badges(r)}</div><h1 class="article-title">${e(r.title)}</h1><div class="article-meta"><span>${r.date} · ${r.time} · 北京时间</span><a href="${e(github(r.path))}" target="_blank" rel="noopener noreferrer">GitHub 原文 ↗</a><a href="${BASE+r.path.split('/').map(encodeURIComponent).join('/')}">Markdown 原文</a></div><p class="article-observation">核验 · ${e(r.observation)}</p><div class="prose">${markdown(r.markdown,r.path)}</div></article><nav class="article-footer" aria-label="相邻记录">${records[idx+1]?`<a href="${reportHref(records[idx+1].path)}">← 更早：${e(records[idx+1].title)}</a>`:'<span></span>'}${records[idx-1]?`<a href="${reportHref(records[idx-1].path)}">更新：${e(records[idx-1].title)} →</a>`:''}</nav>`;
  const dest=path.join(OUT,r.path.replace(/\.md$/,'.html'));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,layout(r.title,content));fs.copyFileSync(path.join(ROOT,r.path),path.join(OUT,r.path));
}
const index={schemaVersion:1,timezone:'Asia/Shanghai',repository:'Sakkana/X-feed-pages',recordCount:records.length,records:records.map(({markdown,...r})=>({...r,url:reportHref(r.path),github:github(r.path)}))};
fs.writeFileSync(path.join(OUT,'reports.json'),JSON.stringify(index,null,2)+'\n');
fs.writeFileSync(path.join(ROOT,'reports.json'),JSON.stringify(index,null,2)+'\n');
const readmeFile=path.join(ROOT,'README.md');
const start='<!-- REPORT_INDEX_START -->',end='<!-- REPORT_INDEX_END -->';
const lines=['## 研究目录','',start,'',...dates.flatMap(date=>['## '+date,'',...records.filter(r=>r.date===date).map(r=>`- ${r.time} · ${r.type} · [${r.title.replaceAll('[','\\[').replaceAll(']','\\]')}](${r.path.split('/').map(encodeURIComponent).join('/')})`),'']),end];
const reportIndex=lines.join('\n');
let readme=fs.readFileSync(readmeFile,'utf8');
readme=readme.replace(/^# (?:X-feed 研究记录|defi 研究记录|小🐟 defi 研究 feed 流)$/m,'# 小🐟 defi 研究 feed 流');
if(readme.includes(start)&&readme.includes(end)){
  const section=reportIndex.slice(reportIndex.indexOf(start));
  readme=readme.slice(0,readme.indexOf(start))+section+readme.slice(readme.indexOf(end)+end.length);
}else if(readme.includes('## 研究目录')&&readme.includes('## 更新与发布')){
  readme=readme.slice(0,readme.indexOf('## 研究目录'))+reportIndex+'\n\n'+readme.slice(readme.indexOf('## 更新与发布'));
}else{
  readme=readme.trimEnd()+'\n\n'+reportIndex+'\n';
}
fs.writeFileSync(readmeFile,readme);
fs.writeFileSync(path.join(OUT,'404.html'),layout('没有找到这条记录',`<h1>没有找到这条记录</h1><p>链接可能已变更，请从时间线重新打开。</p><a class="back" href="${BASE}">返回研究时间线</a>`));
fs.writeFileSync(path.join(OUT,'.nojekyll'),'');
console.log(`Built ${records.length} reports (${dates.length} days) into _site`);
