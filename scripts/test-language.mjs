import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {JSDOM} from 'jsdom';
import * as OpenCC from 'opencc-js';
import {initializeLanguage} from '../assets/language.mjs';
import {initializeCopy, initializeTabs} from '../assets/home.mjs';
import {initializeWorldClocks} from '../assets/clocks.mjs';
const ROOT = path.resolve(import.meta.dirname, '..');
const fixture = `<!doctype html><html lang="zh-CN"><head><title data-en-id="title">研究页面</title><meta name="english-pack" content="/X-feed-pages/i18n/en/index.html.json"><meta name="english-source-hash" content="fixture-hash"></head><body>
<details class="language-menu" id="language-menu"><summary aria-label="选择语言"><span class="language-current">🇨🇳 简体中文</span></summary><button data-language="zh-CN" aria-current="true">简体中文</button><button data-language="zh-Hant">繁體中文</button><button data-language="en">English</button></details><p id="language-status" translate="no"></p>
<div role="tablist"><button id="tab-feed" role="tab" data-view="feed" aria-controls="panel-feed" data-en-id="feed">研究记录</button><button id="tab-invites" role="tab" data-view="invites" aria-controls="panel-invites" data-en-id="invites">邀请码</button></div>
<section id="panel-feed"><div class="feed-summary"><span class="total"><strong id="result-count">2</strong> 篇</span></div>
<form class="filters"><select id="date-filter"><option value="">全部日期</option><option value="2026-10-03">2026-10-03</option></select><select id="type-filter"><option value="">全部主题</option><option value="账号运营" data-en-id="theme">账号运营</option><option value="DEX">DEX</option></select><input id="query-filter" placeholder="搜索记录" title="Search" data-en-attr="query"><button type="reset" data-en-id="reset">重置</button></form><p id="filter-status"></p><p id="empty-state" hidden>没有结果</p>
<section data-day="2026-10-03"><details class="date-menu" translate="no"><summary aria-label="选择研究日期，当前 2026-10-03"><h2>2026-10-03</h2></summary><button data-jump-date="2026-10-03">2026-10-03</button></details><span class="day-count">2 篇</span><div class="entry" data-path="2026-10-03/研究.md" data-date="2026-10-03" data-themes='["账号运营"]' data-search="研究 账号运营"><a class="report-card" href="/X-feed-pages/2026-10-03/研究.html"><h3 class="card-title" data-en-id="card">研究记录</h3></a></div><div class="entry" data-path="2026-10-03/交易.md" data-date="2026-10-03" data-themes='["DEX"]' data-search="交易 DEX"><h3 data-en-id="other">交易记录</h3></div></section><button id="load-more">更多</button></section>
<section id="panel-invites" hidden><p id="inline" data-en-id="inline">原始 <strong>链接</strong> <a href="https://example.com/?ref=SAKANA&amp;q=1" target="_blank" rel="noopener noreferrer" title="注册链接" data-en-attr="link">注册链接</a> <code>代码 ABC123</code> <span translate="no">小🐟</span></p><button data-copy="SAKANA" data-label="Bybit 邀请码" aria-label="复制 Bybit 邀请码 SAKANA" data-en-attr="copy"><span data-en-id="copy-label">邀请码</span><span translate="no">SAKANA</span></button><div id="copy-status"></div><section id="copy-fallback" hidden><label data-en-id="manual">请手动复制以下内容</label><textarea id="manual-copy"></textarea><button id="copy-close" data-en-id="close">关闭</button></section></section>
<div class="world-clocks" aria-label="世界时间"><time data-clock-label="北京时间" data-clock-zone="Asia/Shanghai"></time></div></body></html>`;
const pack = {
  schemaVersion: 1, sourceHash: 'fixture-hash',
  blocks: {title: 'Research page', feed: 'Research feed', invites: 'Referral codes', theme: 'Account operations', reset: 'Reset', card: 'Research notes', other: 'Trading notes', inline: 'Original <strong>link</strong> <a href="https://example.com/?ref=SAKANA&amp;q=1" target="_blank" rel="noopener noreferrer" title="注册链接" data-en-attr="link">Registration link</a> <code>代码 ABC123</code> <span translate="no">小🐟</span>', 'copy-label': 'Referral code', manual: 'Please copy the following text manually', close: 'Close'},
  attributes: {query: {placeholder: 'Search reports'}, link: {title: 'Registration link'}, copy: {'aria-label': 'Copy Bybit referral code SAKANA'}},
  search: {'2026-10-03/研究.md': 'research notes account operations', '2026-10-03/交易.md': 'trading notes dex'},
};
const clonePack = () => JSON.parse(JSON.stringify(pack));
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const contexts = [];
function setup({html = fixture, saved, fetch, path = '/X-feed-pages/?view=invites&type=%E8%B4%A6%E5%8F%B7%E8%BF%90%E8%90%A5', ui = true} = {}) {
  const dom = new JSDOM(html, {url: 'https://example.test' + path, runScripts: 'outside-only', pretendToBeVisual: true});
  const win = dom.window, doc = win.document;
  win.matchMedia = () => ({matches: true});
  if (saved) win.localStorage.setItem('x-feed-language', saved);
  const requests = [];
  const fetchPack = (...args) => { requests.push(args); return fetch ? fetch(...args) : Promise.resolve({ok: true, json: async () => clonePack()}); };
  if (ui) { win.eval(fs.readFileSync(pathJoin('assets/filters.js'), 'utf8')); initializeTabs(doc, win); }
  const language = initializeLanguage(doc, win, async () => OpenCC, {fetch: fetchPack});
  const context = {dom, win, doc, language, requests}; contexts.push(context); return context;
}
function pathJoin(file) { return path.join(ROOT, file); }

const main = setup(), {doc, win, language} = main;
const chineseInline = doc.getElementById('inline').innerHTML;
const originalLink = doc.querySelector('#inline a').href;
const copyButton = doc.querySelector('[data-copy]');
let copied;
initializeCopy(doc, {clipboard: {writeText: async value => {copied = value;}}}, win);
const stopClock = initializeWorldClocks(doc, win, () => new Date('2026-10-03T00:00:00Z'));
assert.equal(main.requests.length, 0, 'English is loaded lazily');
await language.setMode('zh-Hant');
assert.equal(doc.querySelector('.card-title').textContent, '研究記錄');
const locationBefore = win.location.href;
await language.setMode('en');
assert.equal(language.mode, 'en'); assert.equal(doc.documentElement.lang, 'en');
assert.equal(win.location.href, locationBefore); assert.equal(doc.getElementById('type-filter').value, '账号运营');
assert.equal(doc.getElementById('panel-feed').hidden, true); assert.equal(doc.getElementById('panel-invites').hidden, false);
assert.equal(doc.title, 'Research page'); assert.equal(doc.querySelector('.card-title').textContent, 'Research notes');
assert.equal(doc.querySelector('.language-current').textContent, '🇺🇸 English');
assert.match(doc.getElementById('language-status').textContent, /Machine-translated from Chinese/);
assert.equal(doc.querySelector('.date-menu summary').getAttribute('aria-label'), 'Choose research date, current 2026-10-03');
assert.equal(doc.querySelector('.date-menu h2').textContent, '2026-10-03');
assert.equal(doc.getElementById('query-filter').placeholder, 'Search reports');
assert.equal(doc.getElementById('query-filter').title, 'Search');
assert.equal(doc.querySelector('#inline a').title, 'Registration link');
assert.equal(doc.querySelector('#inline a').href, originalLink);
assert.equal(doc.querySelector('code').textContent, '代码 ABC123'); assert.equal(copyButton.dataset.copy, 'SAKANA');
assert.equal(doc.querySelector('.day-count').textContent, '1 report');
assert.equal(doc.querySelector('.total').textContent, '1 report');
assert.match(doc.getElementById('filter-status').textContent, /Filtered results.*Account operations.*1 report/);
assert.equal(doc.querySelector('[data-clock-zone]').textContent, 'Beijing 08:00:00 (UTC+8)');
copyButton.click(); await tick();
assert.equal(copied, 'SAKANA'); assert.equal(doc.getElementById('copy-status').textContent, 'Copied Bybit referral code');
doc.getElementById('copy-status').textContent = '自动复制不可用，请手动复制'; await tick();
assert.match(doc.getElementById('copy-status').textContent, /Automatic copying is unavailable/);
assert.equal(main.requests[0][0], 'https://example.test/X-feed-pages/i18n/en/index.html.json');
assert.equal(main.requests[0][1].redirect, 'error');
// Language changes do not reset in-flight typing or change filter/navigation state.
doc.getElementById('query-filter').value = 'draft input';
await language.setMode('zh-CN');
assert.equal(doc.getElementById('query-filter').value, 'draft input');
assert.equal(doc.getElementById('inline').innerHTML, chineseInline);
assert.equal(doc.getElementById('query-filter').placeholder, '搜索记录');
assert.equal(doc.querySelector('#inline a').title, '注册链接');
assert.equal(doc.title, '研究页面');
assert.equal(doc.querySelector('.date-menu summary').getAttribute('aria-label'), '选择研究日期，当前 2026-10-03');
assert.equal(doc.querySelector('.total').textContent, '1 篇');
assert.equal(doc.getElementById('copy-status').textContent, '自动复制不可用，请手动复制');
for (const next of ['en', 'en', 'zh-Hant', 'en', 'zh-CN', 'zh-Hant', 'zh-CN']) await language.setMode(next);
assert.equal(doc.getElementById('inline').innerHTML, chineseInline);
assert.equal(main.requests.length, 1, 'Successful English packs are reused');
assert.equal(doc.querySelector('#inline a').href, originalLink); assert.equal(copyButton.dataset.copy, 'SAKANA');
doc.getElementById('tab-feed').click(); assert.equal(doc.getElementById('panel-feed').hidden, false);
await language.setMode('en');
doc.querySelector('.filters').dispatchEvent(new win.Event('reset', {cancelable: true}));
assert.equal(doc.querySelector('.day-count').textContent, '2 reports');
doc.getElementById('query-filter').value = 'TRADING';
doc.querySelector('.filters').dispatchEvent(new win.Event('submit', {cancelable: true}));
assert.equal(doc.getElementById('result-count').textContent, '1');
assert.equal(doc.querySelectorAll('.entry:not([hidden])')[0].dataset.path, '2026-10-03/交易.md');
stopClock();

const restored = setup({saved: 'en'}); await restored.language.ready;
assert.equal(restored.language.mode, 'en'); assert.equal(restored.doc.querySelector('.card-title').textContent, 'Research notes');
const article = setup({saved: 'en', path: '/X-feed-pages/2026-10-03/research.html', ui: false}); await article.language.ready;
assert.equal(article.language.mode, 'en'); assert.equal(article.requests[0][0], 'https://example.test/X-feed-pages/i18n/en/index.html.json');
let finish;
const delayed = setup({fetch: () => new Promise(resolve => {finish = resolve;})});
const pending = delayed.language.setMode('en');
assert.equal(delayed.doc.documentElement.lang, 'zh-CN');
await delayed.language.setMode('zh-CN'); finish({ok: true, json: async () => clonePack()});
assert.equal(await pending, false); assert.equal(delayed.language.mode, 'zh-CN'); assert.equal(delayed.doc.getElementById('language-status').textContent, '');
assert.equal(delayed.win.localStorage.getItem('x-feed-language'), 'zh-CN');
let fail;
const delayedFailure = setup({fetch: () => new Promise((resolve, reject) => {fail = reject;})});
const pendingFailure = delayedFailure.language.setMode('en');
await delayedFailure.language.setMode('zh-Hant'); fail(Error('offline')); await pendingFailure;
assert.equal(delayedFailure.language.mode, 'zh-Hant'); assert.equal(delayedFailure.doc.getElementById('language-status').textContent, '');

for (const [label, mutate] of [
  ['stale source', p => {p.sourceHash = 'stale';}],
  ['missing block', p => {delete p.blocks.card;}],
  ['missing attribute', p => {delete p.attributes.query.placeholder;}],
  ['missing search', p => {delete p.search['2026-10-03/研究.md'];}],
  ['changed destination', p => {p.blocks.inline = p.blocks.inline.replace('example.com', 'evil.example');}],
  ['changed code', p => {p.blocks.inline = p.blocks.inline.replace('ABC123', 'CHANGED');}],
  ['new active markup', p => {p.blocks.card += '<img src=x onerror="alert(1)">';}],
  ['unexpected attribute', p => {p.attributes.query.onclick = 'alert(1)';}],
]) {
  const invalid = clonePack(); mutate(invalid);
  const context = setup({fetch: async () => ({ok: true, json: async () => invalid})});
  assert.equal(await context.language.setMode('en'), false, label);
  assert.equal(context.doc.documentElement.lang, 'zh-CN', label);
  assert.equal(context.doc.querySelector('.card-title').textContent, '研究记录', label);
  assert.match(context.doc.getElementById('language-status').textContent, /English unavailable; showing Chinese/, label);
}
let attempts = 0;
const retry = setup({saved: 'en', fetch: async () => {if (!attempts++) throw Error('offline'); return {ok: true, json: async () => clonePack()};}});
await retry.language.ready; assert.equal(retry.language.mode, 'zh-CN'); assert.equal(retry.win.localStorage.getItem('x-feed-language'), 'en');
assert.equal(await retry.language.setMode('en'), true); assert.equal(retry.language.mode, 'en');
const missing = setup({html: fixture.replace(/<meta name="english-pack"[^>]*>/, '')});
assert.equal(await missing.language.setMode('en'), false); assert.equal(missing.requests.length, 0);
const remote = setup({html: fixture.replace('/X-feed-pages/i18n/en/index.html.json', 'https://other.example/english.json')});
assert.equal(await remote.language.setMode('en'), false); assert.equal(remote.requests.length, 0);
const unavailable = setup({fetch: async () => ({ok: false})});
assert.equal(await unavailable.language.setMode('en'), false);
let stoppedFinish;
const stopped = setup({fetch: () => new Promise(resolve => {stoppedFinish = resolve;})});
const stoppedPending = stopped.language.setMode('en'); stopped.language.stop(); stoppedFinish({ok: true, json: async () => clonePack()}); await stoppedPending;
assert.equal(stopped.language.mode, 'zh-CN');
for (const {language, dom} of contexts) { language.stop(); dom.window.close(); }
console.log('PASS: lazy same-origin English, exact repeated Chinese restoration, saved English on navigation, retained filters/drafts/tabs, English search/counts/clocks/copy statuses, preserved handlers/codes/links, canceled/stopped loads, offline retry and atomic stale/incomplete/unsafe-pack fallback');
