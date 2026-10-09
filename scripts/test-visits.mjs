import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {initializeVisits, VISIT_BASE, VISIT_ENDPOINT, VISIT_READ_ENDPOINT, VISIT_MARKER} from '../assets/visits.mjs';
const html = fs.readFileSync(new URL('../_site/index.html', import.meta.url), 'utf8');
const windows = [];
function setup({url = 'https://sakkana.github.io/X-feed-pages/?q=private-search', storage, locks} = {}) {
  const dom = new JSDOM(html, {url}); windows.push(dom.window);
  if (storage) Object.defineProperty(dom.window, 'localStorage', {value: storage});
  if (locks) Object.defineProperty(dom.window.navigator, 'locks', {value: locks});
  return {doc: dom.window.document, win: dom.window, el: dom.window.document.getElementById('site-visits')};
}
function memoryStorage() {
  const map = new Map();
  return {getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key), map};
}
function mockService(value = 7) {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push(url);
    assert.ok([VISIT_ENDPOINT, VISIT_READ_ENDPOINT].includes(url));
    assert.ok(!url.includes('private-search'));
    assert.equal(options.credentials, 'omit'); assert.equal(options.referrerPolicy, 'no-referrer');
    assert.equal(options.cache, 'no-store'); assert.equal(options.mode, 'cors'); assert.ok(options.signal);
    if (url === VISIT_ENDPOINT) value++;
    return {ok: true, json: async () => ({value})};
  };
  return {calls, fetcher};
}
assert.equal(VISIT_BASE, 912);
assert.equal(VISIT_ENDPOINT, 'https://abacus.jasoncameron.dev/hit/sakkana.github.io/x-feed-pages-pv-20261009-9f30bd');
const storage = memoryStorage(), api = mockService();
const first = setup({storage});
const pending = initializeVisits(first.doc, first.win, api.fetcher);
assert.equal(initializeVisits(first.doc, first.win, api.fetcher), pending);
assert.equal(await pending, true);
assert.equal(first.el.textContent, '920'); // Previous 7 hits remain, then one new browser.
assert.equal(storage.getItem(VISIT_MARKER), '1');
assert.deepEqual([...storage.map], [[VISIT_MARKER, '1']]); // No identity or lasting probe.
assert.match(first.el.title, /人工初始基数 912/); assert.match(first.el.title, /升级前/);
assert.match(first.el.title, /同一浏览器仅计一次/); assert.match(first.el.title, /非独立人数/);
assert.equal(first.doc.cookie, ''); assert.equal(first.win.sessionStorage.length, 0);
await initializeVisits(first.doc, first.win, api.fetcher);
first.win.history.pushState(null, '', '?type=DEX');
await initializeVisits(first.doc, first.win, api.fetcher);
assert.equal(api.calls.length, 1);
for (let i=0;i<2;i++) {
  const revisit = setup({storage});
  assert.equal(await initializeVisits(revisit.doc, revisit.win, api.fetcher), true);
  assert.equal(revisit.el.textContent, '920');
  assert.equal(api.calls.at(-1), VISIT_READ_ENDPOINT);
}
assert.equal(api.calls.filter(url => url === VISIT_ENDPOINT).length, 1);
// Independent/newly cleared browser storage is explicitly a new approximate visitor.
const other = setup({storage: memoryStorage()});
await initializeVisits(other.doc, other.win, api.fetcher);
assert.equal(other.el.textContent, '921');
// First hit records success only after both a successful response and validated data.
for (const value of [-1, 1.5, '2', null, Number.MAX_SAFE_INTEGER, undefined]) {
  const s = memoryStorage(), x = setup({storage:s});
  assert.equal(await initializeVisits(x.doc, x.win, async () => ({ok:true,json:async()=>({value})})), false);
  assert.equal(s.getItem(VISIT_MARKER), null); assert.equal(x.el.textContent, '—');
}
for (const bad of [async()=>{throw Error('offline');},async()=>({ok:false}),async()=>({ok:true,json:async()=>{throw Error('bad JSON');}})]) {
  const s=memoryStorage(),x=setup({storage:s}); let calls=0;
  const fetcher=(...args)=>{calls++;return bad(...args);};
  assert.equal(await initializeVisits(x.doc,x.win,fetcher),false);
  await initializeVisits(x.doc,x.win,fetcher);
  assert.equal(calls,1);assert.equal(s.getItem(VISIT_MARKER),null);assert.equal(x.el.textContent,'—');
}
const slowStore=memoryStorage(),slow=setup({storage:slowStore});let signal;
assert.equal(await initializeVisits(slow.doc,slow.win,(_url,options)=>{signal=options.signal;return new Promise(()=>{});},5),false);
assert.equal(signal.aborted,true);assert.equal(slowStore.getItem(VISIT_MARKER),null);
// A failed visit may be attempted on a later page load, never in the same document.
const recovered=setup({storage:slowStore}),recoveryAPI=mockService();
assert.equal(await initializeVisits(recovered.doc,recovered.win,recoveryAPI.fetcher),true);
assert.equal(slowStore.getItem(VISIT_MARKER),'1');
// Blocked reads OR writes must only read the existing global total.
for (const denied of [
  {getItem(){throw Error('denied');}},
  {getItem(){return null;},setItem(){throw Error('quota');}},
]) {
  const x=setup({storage:denied}),service=mockService();
  assert.equal(await initializeVisits(x.doc,x.win,service.fetcher),true);
  assert.deepEqual(service.calls,[VISIT_READ_ENDPOINT]);assert.equal(x.el.textContent,'919');
}
const missing=setup(),readOnlyAPI=mockService();
Object.defineProperty(missing.win,'localStorage',{get(){throw Error('disabled');}});
assert.equal(await initializeVisits(missing.doc,missing.win,readOnlyAPI.fetcher),true);
assert.deepEqual(readOnlyAPI.calls,[VISIT_READ_ENDPOINT]);
// Web Locks mock: each callback gets exclusive access to shared browser storage.
let tail=Promise.resolve();
const locks={request(_name,_options,callback){const run=tail.then(()=>callback());tail=run.catch(()=>{});return run;}};
const shared=memoryStorage(),concurrentAPI=mockService(),a=setup({storage:shared,locks}),b=setup({storage:shared,locks});
assert.deepEqual(await Promise.all([initializeVisits(a.doc,a.win,concurrentAPI.fetcher),initializeVisits(b.doc,b.win,concurrentAPI.fetcher)]),[true,true]);
assert.deepEqual(concurrentAPI.calls,[VISIT_ENDPOINT,VISIT_READ_ENDPOINT]);
assert.equal(a.el.textContent,b.el.textContent);
// Lock wait timeout and rejected permission degrade to read-only, not a hit.
for(const locks of [
  {request(_name,{signal}){return new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('lock timeout')),{once:true}));}},
  {request(){return Promise.reject(Error('lock denied'));}},
]) {
  const x=setup({storage:memoryStorage(),locks}),service=mockService();
  assert.equal(await initializeVisits(x.doc,x.win,service.fetcher,5),true);
  assert.deepEqual(service.calls,[VISIT_READ_ENDPOINT]);
}
// A failed hit after acquiring the lock must NOT trigger a fallback request.
const lockedFailure=setup({storage:memoryStorage(),locks});let failCalls=0;
assert.equal(await initializeVisits(lockedFailure.doc,lockedFailure.win,async()=>{failCalls++;throw Error('network');}),false);
assert.equal(failCalls,1);
// No lock support still handles ordinary return visits; concurrent first visits are best effort.
assert.match(first.el.title,/并发去重为尽力处理/);
for(const url of ['http://localhost:8080/X-feed-pages/','https://example.com/X-feed-pages/','https://sakkana.github.io/other/']) {
 const x=setup({url});assert.equal(await initializeVisits(x.doc,x.win,()=>{throw Error('must not request');}),false);
}
assert.equal(first.doc.querySelectorAll('#site-visits').length,1);
assert.equal(first.doc.querySelectorAll('.world-clock').length,8);
assert.match(first.doc.querySelector('.site-credit').textContent,/920 visited\|Powered by OpenAI DOTS｜Github/);
assert.equal(first.doc.querySelector('.site-credit a').href,'https://github.com/Sakkana/X-feed-pages');
assert.match(first.doc.querySelector('[data-brand="saily"] .invite-origin').textContent,/归属地：🇺🇸/);
windows.forEach(win=>win.close());
console.log('PASS: browser-deduplicated counter, retained baseline/history, first/return/reload, concurrent tabs, lock timeout, failed hits, denied storage, privacy and footer preservation (mock API only).');
