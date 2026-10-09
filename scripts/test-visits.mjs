import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {initializeVisits, VISIT_BASE, VISIT_ENDPOINT} from '../assets/visits.mjs';
const html = fs.readFileSync(new URL('../_site/index.html', import.meta.url), 'utf8');
function setup(url = 'https://sakkana.github.io/X-feed-pages/?q=private-search') {
  const dom = new JSDOM(html, {url});
  return {doc: dom.window.document, win: dom.window, el: dom.window.document.getElementById('site-visits')};
}
assert.equal(VISIT_BASE, 912);
const state = setup();
let calls = 0;
const fetched = async (url, options) => {
  calls++;
  assert.equal(url, VISIT_ENDPOINT);
  assert.ok(!url.includes('private-search'));
  assert.equal(options.credentials, 'omit');
  assert.equal(options.referrerPolicy, 'no-referrer');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.mode, 'cors');
  assert.ok(options.signal);
  return {ok: true, json: async () => ({value: 1})};
};
const first = initializeVisits(state.doc, state.win, fetched);
assert.equal(initializeVisits(state.doc, state.win, fetched), first);
assert.equal(await first, true);
assert.equal(state.el.textContent, '913');
assert.match(state.el.getAttribute('aria-label'), /人工初始基数 912/);
assert.match(state.el.title, /非独立人数/);
assert.equal(calls, 1);
await initializeVisits(state.doc, state.win, fetched);
state.win.history.pushState(null, '', '?type=DEX');
await initializeVisits(state.doc, state.win, fetched);
assert.equal(calls, 1);
assert.equal(state.doc.cookie, '');
assert.equal(state.win.localStorage.length, 0);
assert.equal(state.win.sessionStorage.length, 0);
const fresh = setup();
await initializeVisits(fresh.doc, fresh.win, async () => ({ok: true, json: async () => ({value: 2})}));
assert.equal(fresh.el.textContent, '914'); // A fresh document counts again.
for (const value of [-1, 1.5, '2', null, Number.MAX_SAFE_INTEGER, undefined]) {
  const x = setup();
  assert.equal(await initializeVisits(x.doc, x.win, async () => ({ok: true, json: async () => ({value})})), false);
  assert.equal(x.el.textContent, '—');
  assert.match(x.el.title, /暂不可用/);
  x.win.close();
}
for (const fetcher of [async () => {throw Error('offline');}, async () => ({ok: false}), async () => ({ok: true, json: async () => {throw Error('invalid JSON');}})]) {
  const x = setup(); let count = 0;
  assert.equal(await initializeVisits(x.doc, x.win, (...args) => {count++; return fetcher(...args);}), false);
  await initializeVisits(x.doc, x.win, fetcher);
  assert.equal(count, 1);
  assert.equal(x.el.textContent, '—');
  x.win.close();
}
const slow = setup(); let signal;
assert.equal(await initializeVisits(slow.doc, slow.win, (_url, options) => {signal = options.signal; return new Promise(() => {});}, 5), false);
assert.equal(signal.aborted, true);
assert.equal(slow.el.textContent, '—');
for (const url of ['http://localhost:8080/X-feed-pages/', 'https://example.com/X-feed-pages/', 'https://sakkana.github.io/other/']) {
  const x = setup(url);
  assert.equal(await initializeVisits(x.doc, x.win, () => {throw Error('must not request');}), false);
  assert.match(x.el.title, /仅在正式站点/);
  x.win.close();
}
assert.equal(state.doc.querySelectorAll('#site-visits').length, 1);
assert.equal(state.doc.querySelectorAll('.world-clock').length, 8);
assert.match(state.doc.querySelector('.site-credit').textContent, /913 visited\|Powered by OpenAI DOTS｜Github/);
assert.equal(state.doc.querySelector('.site-credit a').href, 'https://github.com/Sakkana/X-feed-pages');
assert.match(state.doc.querySelector('[data-brand="saily"] .invite-origin').textContent, /归属地：🇺🇸/);
const source = fs.readFileSync(new URL('../assets/visits.mjs', import.meta.url), 'utf8');
assert.ok(!/localStorage|sessionStorage|document\.cookie|navigator\.|fingerprint/i.test(source));
assert.match(fs.readFileSync(new URL('../assets/style.css', import.meta.url), 'utf8'), /\.site-credit\{flex-wrap:wrap/);
state.win.close(); fresh.win.close(); slow.win.close();
console.log('Visit counter tests passed (mock requests only; no live increments).');
