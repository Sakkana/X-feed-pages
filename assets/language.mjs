const STORAGE = 'x-feed-language';
const LANGUAGES = new Set(['zh-CN', 'zh-Hant', 'en']);
const EXCLUDE = 'script,style,pre,code,[translate="no"],.notranslate,.language-menu,.world-clocks,#copy-status';
const ATTRIBUTES = ['placeholder', 'title', 'aria-label'];
const LABELS = {'zh-CN': '🇨🇳 简体中文', 'zh-Hant': '🇨🇳 繁體中文', en: '🇺🇸 English'};
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const dictionary = value => value && typeof value === 'object' && !Array.isArray(value);

// Translated prose may change text, but never links, markup, code, or protected names.
function sameMarkup(doc, original, translated) {
  const source = doc.createElement('template'), target = doc.createElement('template');
  source.innerHTML = original; target.innerHTML = translated;
  const signature = root => [...root.children].map(node => [
    node.tagName,
    [...node.attributes].map(attribute => [attribute.name, attribute.value]).sort(),
    node.matches('pre,code,[translate="no"],.notranslate') ? node.innerHTML : signature(node),
  ]);
  return JSON.stringify(signature(source.content)) === JSON.stringify(signature(target.content));
}

export function initializeLanguage(doc = document, win = window, load = () => import('./vendor/opencc-cn2t.mjs'), options = {}) {
  const menu = doc.getElementById('language-menu');
  if (!menu) return;
  const current = menu.querySelector('.language-current'), status = doc.getElementById('language-status');
  // Take these snapshots before the first Traditional Chinese conversion.
  const blocks = [...doc.querySelectorAll('[data-en-id]')].map(node => ({node, id: node.dataset.enId, source: node.innerHTML}));
  const attributes = [...doc.querySelectorAll('[data-en-attr]')].map(node => ({
    id: node.dataset.enAttr,
    values: Object.fromEntries(ATTRIBUTES.filter(name => node.hasAttribute(name)).map(name => [name, node.getAttribute(name)])),
  }));
  const dateMenus = [...doc.querySelectorAll('.date-menu summary')].map(node => ({
    node, source: node.getAttribute('aria-label'), date: node.closest('[data-day]')?.dataset.day || node.querySelector('h2')?.textContent || '',
  }));
  const sourceHash = doc.querySelector('meta[name="english-source-hash"]')?.content;
  const packPath = doc.querySelector('meta[name="english-pack"]')?.content;
  const records = new WeakMap(), attributeRecords = new WeakMap();
  let mode = 'zh-CN', converter, loading, englishLoading, englishPack, observer, queued = false, request = 0, stopped = false;
  let copyRecord = {source: '', output: ''};
  const setStatus = text => { if (status) status.textContent = text; };
  const remember = node => {
    let item = records.get(node);
    if (!item || node.nodeValue !== item.output) {
      item = {source: node.nodeValue, output: node.nodeValue}; records.set(node, item);
    }
    return item;
  };
  const observe = () => { if (!stopped) observer?.observe(doc.body, {subtree: true, childList: true, characterData: true}); };
  const renderCopy = () => {
    const toast = doc.getElementById('copy-status');
    if (!toast) return;
    if (toast.textContent !== copyRecord.output) copyRecord = {source: toast.textContent, output: toast.textContent};
    let text = copyRecord.source;
    if (mode === 'zh-Hant') text = converter(text);
    if (mode === 'en') {
      if (text === '自动复制不可用，请手动复制') text = 'Automatic copying is unavailable. Please copy manually.';
      else if (/^已复制\s*/.test(text)) text = text.replace(/^已复制\s*/, 'Copied ').replace(/邀请码/g, 'referral code').replace(/注册链接/g, 'registration link').trim();
    }
    copyRecord.output = text;
    if (toast.textContent !== text) toast.textContent = text;
  };
  const renderChinese = () => {
    const walker = doc.createTreeWalker(doc.body, win.NodeFilter.SHOW_TEXT);
    let node;
    const renderNode = node => {
      const item = remember(node); item.output = mode === 'zh-Hant' ? converter(item.source) : item.source;
      if (node.nodeValue !== item.output) node.nodeValue = item.output;
    };
    while ((node = walker.nextNode())) {
      if (!node.parentElement || node.parentElement.closest(EXCLUDE) || !node.nodeValue.trim()) continue;
      renderNode(node);
    }
    const title = doc.querySelector('title');
    if (title?.firstChild) renderNode(title.firstChild);
    for (const element of doc.querySelectorAll('[placeholder],[title],[aria-label]')) {
      if (element.closest(EXCLUDE)) continue;
      let values = attributeRecords.get(element);
      if (!values) { values = {}; attributeRecords.set(element, values); }
      for (const name of ATTRIBUTES) {
        if (!element.hasAttribute(name)) continue;
        const value = element.getAttribute(name);
        if (!values[name] || value !== values[name].output) values[name] = {source: value, output: value};
        const record = values[name]; record.output = mode === 'zh-Hant' ? converter(record.source) : record.source;
        if (value !== record.output) element.setAttribute(name, record.output);
      }
    }
    if (converter) for (const entry of doc.querySelectorAll('.entry')) entry.dataset.searchTraditional = converter(entry.dataset.search || '').toLowerCase();
  };
  const renderDynamic = () => {
    observer?.disconnect();
    if (mode !== 'en') renderChinese();
    renderCopy(); observe();
  };
  const restoreBlocks = () => {
    for (const {node, source} of blocks) if (node.innerHTML !== source) node.innerHTML = source;
    for (const record of attributes) {
      for (const node of doc.querySelectorAll('[data-en-attr]')) if (node.dataset.enAttr === record.id) {
        for (const [name, value] of Object.entries(record.values)) node.setAttribute(name, value);
      }
    }
  };
  const validatePack = pack => {
    if (!dictionary(pack) || pack.schemaVersion !== 1 || !sourceHash || pack.sourceHash !== sourceHash ||
        !dictionary(pack.blocks) || !dictionary(pack.attributes) || !dictionary(pack.search)) throw new Error('Stale or invalid English pack');
    for (const {id, source} of blocks) {
      if (!own(pack.blocks, id) || typeof pack.blocks[id] !== 'string' || !sameMarkup(doc, source, pack.blocks[id])) throw new Error('Incomplete or unsafe English block');
    }
    for (const {id, values} of attributes) {
      if (!own(pack.attributes, id) || !dictionary(pack.attributes[id])) throw new Error('Missing English attributes');
      for (const [name, value] of Object.entries(values)) if (/[\u3400-\u9fff]/.test(value) && typeof pack.attributes[id][name] !== 'string') throw new Error('Missing English attribute');
      if (Object.entries(pack.attributes[id]).some(([name, value]) => !ATTRIBUTES.includes(name) || !own(values, name) || typeof value !== 'string')) throw new Error('Unexpected English attribute');
    }
    for (const entry of doc.querySelectorAll('.entry')) {
      const key = entry.dataset.path || entry.dataset.reportPath;
      if (!key || !own(pack.search, key) || typeof pack.search[key] !== 'string') throw new Error('Missing English search text');
    }
    return pack;
  };
  const loadEnglish = async () => {
    if (englishPack) return englishPack;
    if (!englishLoading) {
      englishLoading = (async () => {
        if (!packPath || !sourceHash) throw new Error('English is not built for this page');
        const url = new win.URL(packPath, win.location.href);
        if (url.origin !== win.location.origin || !['https:', 'http:'].includes(url.protocol)) throw new Error('English pack must be same-origin');
        const fetchPack = options.fetch || win.fetch?.bind(win);
        if (!fetchPack) throw new Error('Fetch unavailable');
        const response = await fetchPack(url.href, {credentials: 'same-origin', redirect: 'error', cache: 'no-cache'});
        if (!response.ok) throw new Error('English pack unavailable');
        englishPack = validatePack(await response.json());
        return englishPack;
      })();
    }
    try { return await englishLoading; }
    catch (error) { englishLoading = undefined; throw error; }
  };
  const applyMode = next => {
    observer?.disconnect();
    // Restore Chinese first so no translated text becomes a future source snapshot.
    mode = 'zh-CN'; restoreBlocks(); renderChinese(); renderCopy();
    mode = next; doc.documentElement.lang = mode;
    if (mode === 'en') {
      for (const {node, id} of blocks) node.innerHTML = englishPack.blocks[id];
      for (const node of doc.querySelectorAll('[data-en-attr]')) {
        for (const [name, value] of Object.entries(englishPack.attributes[node.dataset.enAttr])) node.setAttribute(name, value);
      }
      for (const entry of doc.querySelectorAll('.entry')) entry.dataset.searchEnglish = englishPack.search[entry.dataset.path || entry.dataset.reportPath].toLowerCase();
    } else renderChinese();
    renderCopy();
    if (current) current.textContent = LABELS[mode];
    menu.querySelector('summary')?.setAttribute('aria-label', mode === 'en' ? 'Select language' : mode === 'zh-Hant' ? '選擇語言' : '选择语言');
    menu.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-current', String(button.dataset.language === mode)));
    for (const {node, source, date} of dateMenus) {
      if (source !== null) node.setAttribute('aria-label', mode === 'en' ? `Choose research date, current ${date}` : mode === 'zh-Hant' ? converter(source) : source);
    }
    setStatus(mode === 'en' ? 'Machine-translated from Chinese. Check the Chinese original before acting.' : '');
    // Filters and clocks re-render against the committed language without changing the URL.
    doc.dispatchEvent(new win.CustomEvent('language-changed', {detail: mode}));
    if (mode === 'zh-Hant') renderChinese();
    observe();
  };
  const setMode = async next => {
    if (stopped || !LANGUAGES.has(next)) return false;
    const turn = ++request; menu.open = false;
    // Keep the requested preference even if this page has no English pack yet.
    try { win.localStorage.setItem(STORAGE, next); } catch {}
    if (next === 'en') {
      setStatus('正在加载英文版本… Loading English…');
      try { await loadEnglish(); }
      catch {
        if (turn === request && !stopped) setStatus('英文版本暂不可用，继续显示中文。English unavailable; showing Chinese.');
        return false;
      }
    }
    if (next === 'zh-Hant' && !converter) {
      setStatus(mode === 'en' ? 'Loading Traditional Chinese…' : '正在加载繁体转换…');
      try { loading ??= load(); const OpenCC = await loading; converter = OpenCC.Converter({from: 'cn', to: 't'}); }
      catch { loading = undefined; if (turn === request && !stopped) setStatus(mode === 'en' ? 'Traditional Chinese is unavailable. Please retry.' : '繁体转换暂不可用，请重试'); return false; }
    }
    if (turn !== request || stopped) return false;
    applyMode(next); return true;
  };
  const buttonHandlers = [...menu.querySelectorAll('[data-language]')].map(button => {
    const listener = () => { void setMode(button.dataset.language); };
    button.addEventListener('click', listener); return [button, listener];
  });
  const closeOutside = event => { if (!menu.contains(event.target)) menu.open = false; };
  const escape = event => { if (event.key === 'Escape') { menu.open = false; menu.querySelector('summary')?.focus(); } };
  doc.addEventListener('click', closeOutside); menu.addEventListener('keydown', escape);
  observer = new win.MutationObserver(changes => {
    if (mode === 'zh-CN' || queued || changes.every(change => (change.target.nodeType === 1 ? change.target : change.target.parentElement)?.closest('.world-clocks,.language-menu,#language-status'))) return;
    queued = true;
    win.queueMicrotask(() => { queued = false; if (!stopped) renderDynamic(); });
  });
  observe();
  let saved; try { saved = win.localStorage.getItem(STORAGE); } catch {}
  const ready = LANGUAGES.has(saved) && saved !== 'zh-CN' ? setMode(saved) : Promise.resolve(true);
  return {setMode, ready, get mode() { return mode; }, stop() {
    stopped = true; ++request; observer.disconnect();
    for (const [button, listener] of buttonHandlers) button.removeEventListener('click', listener);
    doc.removeEventListener('click', closeOutside); menu.removeEventListener('keydown', escape);
  }};
}
if (typeof document !== 'undefined') initializeLanguage();
