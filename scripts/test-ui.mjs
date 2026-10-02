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
const refs=JSON.parse(fs.readFileSync(path.join(ROOT,'referrals.json'),'utf8'));assert.equal(refs.length,13);assert.deepEqual([...new Set(refs.map(x=>x.section))],['CEX','U卡','虚拟银行','多币种转账工具']);
const expected={binance:['SAKANA','https://www.bsmkweb.cc/register?ref=SAKANA'],okx:['7NB7U5LH','https://www.mitnpkwxvfr.net/join/7NB7U5LH'],bitget:['SAKANA','https://partner.bitget.cafe/bg/33yurucb'],bybit:['2RG3AY6',full],lbank:['657HV','https://www.lbank.info/ref/657HV'],gate:['VFLBAVOOAW','https://www.gatesites.cc/zh/signup/VFLBAVOOAW?ref_type=103'],krak:['@Sakana_btc','https://krak.app/@Sakana_btc'],'bybit-card':['2RG3AY6','https://www.bybit.com/cards/?ref=2RG3AY6&source=applet_invite'],'lbank-card':['657HV','https://www.lbank.com/ref/657HV'],'gate-card':['VFLBAVOOAW','https://app.bxjddjt.com/card/redirect?key=invite&invite_code=VFLBAVOOAW'],maya:['@sakanaaa','https://official.maya.ph/be7m/gmsb47rr'],neverless:['Sakana1','https://neverless.com/referral?code=Sakana1'],moneygram:['RAFV3SEHGCT3','https://www.moneygram.com/RAF/RAFV3SEHGCT3?utm_source=referral_program&utm_medium=owned&utm_campaign=usa_phl_20_discount']};
const html=fs.readFileSync(path.join(ROOT,'_site/index.html'),'utf8');for(const item of refs){assert.deepEqual([item.code,item.url],expected[item.id]);assert.ok(html.includes('data-brand="'+item.id+'"'));assert.ok(html.includes('data-copy="'+item.url.replaceAll('&','&amp;')+'"'));assert.ok(!html.includes('href="'+item.url.replaceAll('&','&amp;')+'"'));const svg=fs.readFileSync(path.join(ROOT,item.logo),'utf8');assert.match(svg,/<svg/);assert.ok(!/<script|\sonload\s*=|\sonerror\s*=/i.test(svg));assert.ok(!/(?:href|xlink:href)=["']https?:/i.test(svg));}
assert.equal((html.match(/class="copy-hint">点击复制/g)||[]).length,26);assert.match(html,/用户提供的邀请链接/);assert.ok(html.includes('<span class="brand-name">小🐟 <span>defi 研究 feed 流</span></span>'));
const index=JSON.parse(fs.readFileSync(path.join(ROOT,'_site/reports.json'),'utf8'));const readme=fs.readFileSync(path.join(ROOT,'README.md'),'utf8');assert.ok(readme.startsWith('# 小🐟 defi 研究 feed 流'));for(const r of index.records)assert.ok(readme.includes(r.path.split('/').map(encodeURIComponent).join('/')));assert.ok(readme.includes('## 2026-10-02'));assert.match(readme,/<!-- REPORT_INDEX_START -->/);assert.match(readme,/## 更新与发布/);
console.log('PASS: keyboard tabs, retained filters, repeated clicks, Back state, exact 13 codes/URLs, clipboard success/fallback/failure, local static logos and complete README index');

assert.match(html, /id="panel-feed"[^>]*><div class="feed-summary"><span class="total"><strong id="result-count"/);
assert.ok(!/<button[^>]+id="tab-feed"[^>]*>[^<]*<span/.test(html));

const fieldDate=element(),fieldType=element(),fieldQuery=element(),resultCount=element(),emptyState=element(),filterStatus=element(),reset=element();
const form=element({querySelector:()=>reset});let pending;const filterEntries=[element({dataset:{date:'2026-10-02',themes:'["DEX"]',search:'test'},classList:{remove(){},add(){},toggle(){}},style:{setProperty(){}}})];
const state={search:'?view=invites',pathname:'/X-feed-pages/'};
const filterContext={URLSearchParams,location:state,history:{pushState(a,b,url){state.search=url.includes('?')?'?'+url.split('?')[1]:'';}},document:{querySelector:s=>({'.filters':form,'#date-filter':fieldDate,'#type-filter':fieldType,'#query-filter':fieldQuery,'#result-count':resultCount,'#empty-state':emptyState,'#filter-status':filterStatus}[s]),querySelectorAll:s=>s==='.entry'?filterEntries:[]},window:{matchMedia:()=>({matches:true}),addEventListener(){}},requestAnimationFrame:f=>f(),setTimeout:f=>{pending=f;return 1;},clearTimeout(){}};
vm.runInNewContext(fs.readFileSync(path.join(ROOT,'assets/filters.js'),'utf8'),filterContext);fieldQuery.value='test';fieldQuery.handlers.input();pending();assert.match(state.search,/view=invites/);assert.match(state.search,/q=test/);assert.equal(resultCount.textContent,1);
console.log('PASS: pending feed search preserves invitation tab URL state');
