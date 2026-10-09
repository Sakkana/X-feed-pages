// Preserve the owner-supplied baseline AND all pre-upgrade page views.
// This mixed historical total is not a count of unique people. Keep the API key stable.
export const VISIT_BASE = 912;
export const VISIT_ENDPOINT = 'https://abacus.jasoncameron.dev/hit/sakkana.github.io/x-feed-pages-pv-20261009-9f30bd';
export const VISIT_READ_ENDPOINT = VISIT_ENDPOINT.replace('/hit/', '/get/');
export const VISIT_MARKER = 'x-feed-pages-visited-v1';
const LOCK_NAME = 'x-feed-pages-visit-count';
const initialized = new WeakMap();
const description = '累计计数：含人工初始基数 912 及升级前的访问次数；升级后同一浏览器仅计一次。非独立人数，换设备、无痕或清除记录可能重复；不支持标签页锁时并发去重为尽力处理。';

export function initializeVisits(doc = document, win = window, fetcher = win.fetch?.bind(win), timeoutMs = 5000) {
  if (initialized.has(doc)) return initialized.get(doc);
  const run = async () => {
    const el = doc.getElementById('site-visits');
    if (!el) return false;
    const setState = (value, detail) => {
      el.textContent = value; el.title = detail; el.setAttribute('aria-label', detail);
    };
    setState('—', description + '正在加载。');
    if (win.location.hostname !== 'sakkana.github.io' || !win.location.pathname.startsWith('/X-feed-pages/') || !fetcher) {
      setState('—', description + '仅在正式站点统计。'); return false;
    }
    const request = async (endpoint) => {
      const controller = new AbortController(); let timer;
      try {
        const response = await Promise.race([
          Promise.resolve().then(() => fetcher(endpoint, {
            method: 'GET', credentials: 'omit', referrerPolicy: 'no-referrer',
            cache: 'no-store', mode: 'cors', signal: controller.signal,
          })).then(async response => {
            if (!response.ok) throw new Error('Counter unavailable');
            return response.json();
          }),
          new Promise((_, reject) => { timer = win.setTimeout(() => {
            controller.abort(); reject(new Error('Counter timed out'));
          }, timeoutMs); }),
        ]);
        if (!Number.isSafeInteger(response.value) || response.value < 0 || !Number.isSafeInteger(response.value + VISIT_BASE)) {
          throw new Error('Invalid counter value');
        }
        return response.value + VISIT_BASE;
      } finally { win.clearTimeout(timer); }
    };
    const countOrRead = async (readOnly = false) => {
      let storage, counted = false;
      if (!readOnly) {
        try {
          storage = win.localStorage;
          counted = storage.getItem(VISIT_MARKER) === '1';
          // Check writability BEFORE any hit. This temporary constant carries no
          // identity, and is immediately removed; storage denial means read-only.
          if (!counted) {
            const probe = VISIT_MARKER + '-probe';
            storage.setItem(probe, '1'); storage.removeItem(probe);
          }
        } catch { readOnly = true; }
      }
      const increment = !readOnly && !counted;
      const total = await request(increment ? VISIT_ENDPOINT : VISIT_READ_ENDPOINT);
      let note = readOnly ? '本次仅读取，未新增计数。' : '';
      if (increment) {
        try { storage.setItem(VISIT_MARKER, '1'); }
        catch { note = '浏览器未能保存已计数标记，未来访问可能重复。'; }
      }
      setState(String(total), `${total}。${description}${note}`);
      return true;
    };
    try {
      const locks = win.navigator?.locks;
      if (!locks?.request) return await countOrRead();
      const waitController = new AbortController();
      let entered = false;
      const timer = win.setTimeout(() => waitController.abort(), timeoutMs);
      try {
        // Re-read the marker only after the lock is acquired. Concurrent tabs
        // share one first hit, while each tab can still display a fresh total.
        return await locks.request(LOCK_NAME, {mode: 'exclusive', signal: waitController.signal}, async () => {
          entered = true; win.clearTimeout(timer); return countOrRead();
        });
      } catch (error) {
        // Never retry a failed/uncertain hit. A denied or timed-out lock only
        // permits a read, avoiding a second increment beside another tab.
        if (entered) throw error;
        return await countOrRead(true);
      } finally { win.clearTimeout(timer); }
    } catch {
      // Failed or ambiguous hits do not get a success marker or automatic retry.
      setState('—', description + '计数服务暂不可用。'); return false;
    }
  };
  const pending = run(); initialized.set(doc, pending); return pending;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  if (document.prerendering) document.addEventListener('prerenderingchange', () => initializeVisits(), {once: true});
  else initializeVisits();
}
