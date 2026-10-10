import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {initializeTabs,copyText,initializeCopy} from '../assets/home.mjs';
const ROOT=path.resolve(import.meta.dirname,'..');
function element(extra={}) { const handlers={};return {hidden:false,tabIndex:0,value:'',dataset:{},style:{},attrs:{},handlers,focused:false,removed:false,classes:new Set(),addEventListener(k,v){handlers[k]=v;},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},focus(){this.focused=true;},select(){this.selected=true;},setSelectionRange(a,b){this.range=[a,b];},remove(){this.removed=true;},classList:{add(){},remove(){}},...extra};}
const feed=element({dataset:{view:'feed'},attrs:{'aria-controls':'panel-feed'}}),invites=element({dataset:{view:'invites'},attrs:{'aria-controls':'panel-invites'}});
const panels={'panel-feed':element(),'panel-invites':element()};let pushes=0;
const win={location:{pathname:'/X-feed-pages/',search:'?type=DEX'},history:{pushState(a,b,url){pushes++;win.location.search=url.includes('?')?'?'+url.split('?')[1]:'';}},events:{},addEventListener(k,v){this.events[k]=v;}};
const doc={querySelectorAll(){return[feed,invites];},getElementById:id=>panels[id]};
initializeTabs(doc,win);assert.equal(feed.attrs['aria-selected'],'true');assert.equal(panels['panel-invites'].hidden,true);
invites.handlers.click();assert.equal(invites.attrs['aria-selected'],'true');assert.match(win.location.search,/type=DEX/);assert.match(win.location.search,/view=invites/);assert.equal(panels['panel-feed'].hidden,true);
invites.handlers.click();assert.equal(pushes,1);
invites.handlers.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(feed.focused,true);assert.equal(feed.tabIndex,0);assert.equal(invites.tabIndex,-1);assert.ok(!win.location.search.includes('view='));assert.equal(panels['panel-feed'].hidden,false);
feed.handlers.keydown({key:'End',preventDefault(){}});assert.equal(invites.focused,true);win.location.search='?q=test';win.events.popstate();assert.equal(feed.attrs['aria-selected'],'true');
let written;assert.equal(await copyText('SAKANA',{writeText:async t=>written=t},{}),true);assert.equal(written,'SAKANA');
let input;const active=element();const copyDoc={activeElement:active,createElement(){input=element();return input;},body:{appendChild(){}},execCommand:()=>true};
const full='https://www.bybitglobal.com/invite?ref=2RG3AY6&medium=referral&utm_campaign=evergreen';
assert.equal(await copyText(full,{writeText:async()=>{throw Error('denied');}},copyDoc),true);assert.equal(input.value,full);assert.equal(input.selected,true);assert.deepEqual(input.range,[0,full.length]);assert.equal(input.removed,true);assert.equal(active.focused,true);
copyDoc.execCommand=()=>false;assert.equal(await copyText(full,undefined,copyDoc),false);
const toast=element(),fallback=element(),manual=element(),close=element();const copyButton=element({dataset:{copy:full,label:'Bybit 注册链接'}});
const copyElements={'copy-status':toast,'copy-fallback':fallback,'manual-copy':manual,'copy-close':close};
const eventDoc={...copyDoc,getElementById:id=>copyElements[id],querySelectorAll:()=>[copyButton]};initializeCopy(eventDoc,{clipboard:{writeText:async()=>{throw Error('denied');}}},{clearTimeout(){},setTimeout(){return 1;}});
await copyButton.handlers.click();assert.equal(fallback.hidden,false);assert.equal(manual.value,full);assert.equal(manual.selected,true);assert.match(toast.textContent,/手动复制/);close.handlers.click();assert.equal(fallback.hidden,true);
const refs=JSON.parse(fs.readFileSync(path.join(ROOT,'referrals.json'),'utf8'));assert.equal(refs.length,19);assert.deepEqual([...new Set(refs.map(x=>x.section))],['CEX','U卡','虚拟银行','多币种转账工具','DEX/Wallet','海外 eSIM']);
const expected={saily:['LUDOVI4453','https://saily.onelink.me/5Txv/LUDOVI4453'],safepal:['315291','https://www.safepal.com/bank/register?referral=315291'],'okx-wallet':['SAKANAA','https://web3.okx.com/join/SAKANAA'],debot:['318149','https://inv.debot.ai/r/318149?lang=zh'],gmgn:['POqpdyzD','https://gmgn.ai/r/POqpdyzD'],'binance-wallet':['SAKANA','https://web3.binance.com/referral?ref=SAKANA'],binance:['SAKANA','https://www.bsmkweb.cc/register?ref=SAKANA'],okx:['7NB7U5LH','https://www.mitnpkwxvfr.net/join/7NB7U5LH'],bitget:['SAKANA','https://partner.bitget.cafe/bg/33yurucb'],bybit:['2RG3AY6',full],lbank:['657HV','https://www.lbank.info/ref/657HV'],gate:['VFLBAVOOAW','https://www.gatesites.cc/zh/signup/VFLBAVOOAW?ref_type=103'],krak:['@Sakana_btc','https://krak.app/@Sakana_btc'],'bybit-card':['2RG3AY6','https://www.bybit.com/cards/?ref=2RG3AY6&source=applet_invite'],'lbank-card':['657HV','https://www.lbank.com/ref/657HV'],'gate-card':['VFLBAVOOAW','https://app.bxjddjt.com/card/redirect?key=invite&invite_code=VFLBAVOOAW'],maya:['@sakanaaa','https://official.maya.ph/be7m/gmsb47rr'],neverless:['Sakana1','https://neverless.com/referral?code=Sakana1'],moneygram:['RAFV3SEHGCT3','https://www.moneygram.com/RAF/RAFV3SEHGCT3?utm_source=referral_program&utm_medium=owned&utm_campaign=usa_phl_20_discount']};
const html=fs.readFileSync(path.join(ROOT,'_site/index.html'),'utf8');for(const item of refs){assert.deepEqual([item.code,item.url],expected[item.id]);assert.ok(html.includes('data-brand="'+item.id+'"'));assert.ok(html.includes('data-copy="'+item.url.replaceAll('&','&amp;')+'"'));assert.ok(html.includes('href="'+item.url.replaceAll('&','&amp;')+'" target="_blank" rel="noopener noreferrer"'));const svg=fs.readFileSync(path.join(ROOT,item.logo),'utf8');assert.match(svg,/<svg/);assert.ok(!/<script|\sonload\s*=|\sonerror\s*=/i.test(svg));assert.ok(!/(?:href|xlink:href)=["']https?:/i.test(svg));}
assert.equal((html.match(/class="copy-hint">点击复制<\/span>/g)||[]).length,19);assert.equal((html.match(/class="copy-hint copy-link-button"[^>]*>点击复制链接<\/button>/g)||[]).length,19);for(const item of refs){assert.ok(html.includes('>'+item.name+' 注册链接</a>'));assert.ok(!html.includes('<span class="copy-value">'+item.url.replaceAll('&','&amp;')+'</span>'));}assert.match(html,/绑定小🐟的邀请码享受返佣优惠和现金奖励，具体以平台政策为准。/);assert.ok(!html.includes('用户提供的邀请链接'));assert.ok(html.includes('<span class="brand-name">小🐟 <span>defi 研究 feed 流</span></span>'));
const index=JSON.parse(fs.readFileSync(path.join(ROOT,'_site/reports.json'),'utf8'));const readme=fs.readFileSync(path.join(ROOT,'README.md'),'utf8');assert.ok(readme.startsWith('# 小🐟 defi 研究 feed 流'));for(const r of index.records)assert.ok(readme.includes(r.path.split('/').map(encodeURIComponent).join('/')));assert.ok(readme.includes('## 2026-10-02'));assert.match(readme,/<!-- REPORT_INDEX_START -->/);assert.match(readme,/## 更新与发布/);
console.log('PASS: keyboard tabs, retained filters, repeated clicks, Back state, exact 19 codes/URLs, clipboard success/fallback/failure, local static logos and complete README index');

assert.match(html, /id="panel-feed"[^>]*><div class="feed-summary"><span class="total"><strong id="result-count"/);
assert.ok(!/<button[^>]+id="tab-feed"[^>]*>[^<]*<span/.test(html));

const fieldDate=element(),fieldType=element(),fieldQuery=element(),resultCount=element(),emptyState=element(),filterStatus=element(),reset=element();
const form=element({querySelector:()=>reset});let pending;const filterEntries=[element({dataset:{date:'2026-10-02',themes:'["DEX"]',search:'test'},classList:{remove(){},add(){},toggle(){}},style:{setProperty(){}}})];
const state={search:'?view=invites',pathname:'/X-feed-pages/'};
const filterContext={URLSearchParams,location:state,history:{pushState(a,b,url){state.search=url.includes('?')?'?'+url.split('?')[1]:'';}},document:{querySelector:s=>({'.filters':form,'#date-filter':fieldDate,'#type-filter':fieldType,'#query-filter':fieldQuery,'#result-count':resultCount,'#empty-state':emptyState,'#filter-status':filterStatus}[s]),querySelectorAll:s=>s==='.entry'?filterEntries:[]},window:{matchMedia:()=>({matches:true}),addEventListener(){}},requestAnimationFrame:f=>f(),setTimeout:f=>{pending=f;return 1;},clearTimeout(){}};
vm.runInNewContext(fs.readFileSync(path.join(ROOT,'assets/filters.js'),'utf8'),filterContext);fieldQuery.value='test';fieldQuery.handlers.input();pending();assert.match(state.search,/view=invites/);assert.match(state.search,/q=test/);assert.equal(resultCount.textContent,1);
console.log('PASS: pending feed search preserves invitation tab URL state');

const {CITIES,formatClock,initializeWorldClocks}=await import('../assets/clocks.mjs');
assert.deepEqual(CITIES.map(c=>c[0]),['北京时间','香港时间','新加坡时间','吉隆坡时间','东京时间','华盛顿时间','伦敦时间','迪拜时间']);
const winter=new Date('2026-01-15T12:34:56Z'),summer=new Date('2026-07-15T12:34:56Z');
assert.equal(formatClock('华盛顿时间','America/New_York',winter),'华盛顿时间 07:34:56（UTC-5）');
assert.equal(formatClock('华盛顿时间','America/New_York',summer),'华盛顿时间 08:34:56（UTC-4）');
assert.equal(formatClock('伦敦时间','Europe/London',winter),'伦敦时间 12:34:56（UTC+0）');
assert.equal(formatClock('伦敦时间','Europe/London',summer),'伦敦时间 13:34:56（UTC+1）');
assert.equal(formatClock('北京时间','Asia/Shanghai',new Date('2026-10-01T16:00:00Z')),'北京时间 00:00:00（UTC+8）');
assert.equal(formatClock('东京时间','Asia/Tokyo',winter),'东京时间 21:34:56（UTC+9）');
assert.equal(formatClock('迪拜时间','Asia/Dubai',summer),'迪拜时间 16:34:56（UTC+4）');
for(const [label,zone] of CITIES.slice(0,4))assert.equal(formatClock(label,zone,winter),label+' 20:34:56（UTC+8）');
assert.equal(formatClock('华盛顿时间','America/New_York',new Date('2026-03-08T06:59:59Z')),'华盛顿时间 01:59:59（UTC-5）');
assert.equal(formatClock('华盛顿时间','America/New_York',new Date('2026-03-08T07:00:00Z')),'华盛顿时间 03:00:00（UTC-4）');
assert.equal(formatClock('伦敦时间','Europe/London',new Date('2026-10-25T00:59:59Z')),'伦敦时间 01:59:59（UTC+1）');
assert.equal(formatClock('伦敦时间','Europe/London',new Date('2026-10-25T01:00:00Z')),'伦敦时间 01:00:00（UTC+0）');
const clockNodes=CITIES.map(([clockLabel,clockZone])=>element({dataset:{clockLabel,clockZone}}));let clockNow=new Date('2026-10-02T12:00:00.125Z'),nextTick,delay,schedules=0;
const clockDoc={hidden:false,events:{},querySelectorAll:()=>clockNodes,addEventListener(k,v){this.events[k]=v;},removeEventListener(k){delete this.events[k];}};
const clockWin={events:{},clearTimeout(){},setTimeout(fn,ms){nextTick=fn;delay=ms;schedules++;return schedules;},addEventListener(k,v){this.events[k]=v;},removeEventListener(k){delete this.events[k];}};
const stopClocks=initializeWorldClocks(clockDoc,clockWin,()=>clockNow);assert.equal(delay,875);assert.match(clockNodes[0].textContent,/20:00:00/);
clockNow=new Date('2026-10-02T12:00:01.000Z');nextTick();assert.match(clockNodes[0].textContent,/20:00:01/);assert.equal(delay,1000);
clockDoc.hidden=true;const beforeHidden=schedules;clockDoc.events.visibilitychange();assert.equal(schedules,beforeHidden);
clockNow=new Date('2026-10-02T15:42:33.600Z');clockDoc.hidden=false;clockDoc.events.visibilitychange();assert.match(clockNodes[0].textContent,/23:42:33/);assert.equal(delay,400);
clockNow=new Date('2026-10-02T16:00:00.010Z');clockWin.events.pageshow();assert.match(clockNodes[0].textContent,/00:00:00/);assert.equal(delay,990);stopClocks();assert.equal(Object.keys(clockDoc.events).length,0);assert.equal(Object.keys(clockWin.events).length,0);
assert.equal((html.match(/data-clock-zone=/g)||[]).length,8);assert.match(html,/<footer class="foot"><div class="world-clocks"/);assert.match(html,/assets\/clocks\.mjs\?v=/);
for(const report of index.records){const article=fs.readFileSync(path.join(ROOT,'_site',report.path.replace(/\.md$/,'.html')),'utf8');assert.equal((article.match(/data-clock-zone=/g)||[]).length,8);assert.match(article,/assets\/clocks\.mjs\?v=/);}
console.log('PASS: eight ordered clocks, winter/summer/DST transitions, h23 midnight, second ticks, hidden-tab resume, pageshow resync and all article footers');

assert.equal((html.match(/class="copy-value registration-link"/g)||[]).length,19);assert.equal((html.match(/data-copy=/g)||[]).length,38);
for(const button of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g))assert.ok(!/<a\b/.test(button[1]));
console.log('PASS: 19 genuine external registration links and 19 separate link-copy buttons; no nested interactive controls');

// SafePal uses the same compact card and exact copy targets as the existing U-card entries.
const safePal = refs.find(item => item.id === 'safepal');
assert.equal(safePal.section, 'U卡');
assert.equal(safePal.name, 'Safepal Fiat24 card');
assert.equal(refs.find(item => item.id === 'krak').name, 'krak card');
assert.match(fs.readFileSync(path.join(ROOT, safePal.logo), 'utf8'), /fill="#4A21EF"/);
const {JSDOM} = await import('jsdom');
const safePalDoc = new JSDOM(html).window.document;
const safePalCard = safePalDoc.querySelector('[data-brand="safepal"]');
assert.equal(safePalCard.closest('.invite-section').querySelector('h2').textContent, 'U卡');
assert.equal(safePalCard.querySelector('.registration-link').textContent, 'Safepal Fiat24 card 注册链接');
assert.equal(safePalCard.querySelector('.registration-link').href, safePal.url);
assert.equal(safePalCard.querySelector('.code-copy').dataset.copy, safePal.code);
assert.equal(safePalCard.querySelector('.copy-link-button').dataset.copy, safePal.url);
let safePalCopied = '';
initializeCopy(safePalDoc, {clipboard: {writeText: async text => {safePalCopied = text;}}}, {clearTimeout(){}, setTimeout(){return 1;}});
safePalCard.querySelector('.code-copy').click();
await new Promise(resolve => setImmediate(resolve));
assert.equal(safePalCopied, '315291');
safePalCard.querySelector('.copy-link-button').click();
await new Promise(resolve => setImmediate(resolve));
assert.equal(safePalCopied, 'https://www.safepal.com/bank/register?referral=315291');
assert.ok(!safePalCard.textContent.includes('perfect'));
console.log('PASS: SafePal U-card placement, label, independent link/code copy controls and exact clipboard values');

// Saily follows the existing invitation copy UX in its own overseas eSIM section.
const saily = refs.find(item => item.id === 'saily');
assert.equal(saily.section, '海外 eSIM');
assert.equal(saily.name, 'Saily');
const sailyCard = safePalDoc.querySelector('[data-brand="saily"]');
assert.equal(sailyCard.closest('.invite-section').querySelector('h2').textContent, '海外 eSIM');
assert.equal(sailyCard.querySelector('.registration-link').textContent, 'Saily 注册链接');
assert.equal(sailyCard.querySelector('.registration-link').href, saily.url);
assert.equal(sailyCard.querySelector('.code-copy').dataset.copy, saily.code);
assert.equal(sailyCard.querySelector('.copy-link-button').dataset.copy, saily.url);
sailyCard.querySelector('.code-copy').click();
await new Promise(resolve => setImmediate(resolve));
assert.equal(safePalCopied, 'LUDOVI4453');
sailyCard.querySelector('.copy-link-button').click();
await new Promise(resolve => setImmediate(resolve));
assert.equal(safePalCopied, 'https://saily.onelink.me/5Txv/LUDOVI4453');
console.log('PASS: Saily overseas eSIM category, exact code/link, labels, and both clipboard values');
