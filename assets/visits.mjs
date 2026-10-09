// Public page-view counter. The 912 baseline was supplied by the site owner;
// it is not independently measured historical traffic. Keep this key stable.
export const VISIT_BASE = 912;
export const VISIT_ENDPOINT = 'https://abacus.jasoncameron.dev/hit/sakkana.github.io/x-feed-pages-pv-20261009-9f30bd';
const initialized = new WeakMap();
const description = '累计访问次数（非独立人数）：含人工初始基数 912，加接入后的页面访问次数。';

export function initializeVisits(doc = document, win = window, fetcher = win.fetch?.bind(win), timeoutMs = 5000) {
  if (initialized.has(doc)) return initialized.get(doc);
  const run = async () => {
    const el = doc.getElementById('site-visits');
    if (!el) return false;
    const setState = (value, detail) => {
      el.textContent = value;
      el.title = detail;
      el.setAttribute('aria-label', detail);
    };
    setState('—', description + '正在加载。');
    // Local previews, fork deployments and test pages must not inflate production.
    if (win.location.hostname !== 'sakkana.github.io' || !win.location.pathname.startsWith('/X-feed-pages/') || !fetcher) {
      setState('—', description + '仅在正式站点统计。');
      return false;
    }
    const controller = new AbortController();
    let timer;
    try {
      const response = await Promise.race([
        fetcher(VISIT_ENDPOINT, {
          method: 'GET', credentials: 'omit', referrerPolicy: 'no-referrer',
          cache: 'no-store', mode: 'cors', signal: controller.signal,
        }).then(async response => {
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
      const total = response.value + VISIT_BASE;
      setState(String(total), `${total} 次访问。${description}`);
      return true;
    } catch {
      // No synthetic count, cached baseline, or retry: a timed-out hit may have
      // already reached the server, so retrying could count the same load twice.
      setState('—', description + '计数服务暂不可用。');
      return false;
    } finally {
      win.clearTimeout(timer);
    }
  };
  const pending = run();
  initialized.set(doc, pending);
  return pending;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  if (document.prerendering) {
    document.addEventListener('prerenderingchange', () => initializeVisits(), {once: true});
  } else {
    initializeVisits();
  }
}
