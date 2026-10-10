export function initializeTabs(doc = document, win = window) {
  const tabs = [...doc.querySelectorAll('[role="tab"][data-view]')];
  if (!tabs.length) return;
  const apply = (view) => {
    const selected = tabs.some(tab => tab.dataset.view === view) ? view : 'feed';
    tabs.forEach(tab => {
      const active = tab.dataset.view === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      doc.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    doc.dispatchEvent?.(new win.CustomEvent('home-view-changed'));
  };
  const current = () => new URLSearchParams(win.location.search).get('view');
  const select = (view, focus = false) => {
    const params = new URLSearchParams(win.location.search);
    if (view !== 'feed' && tabs.some(tab => tab.dataset.view === view)) params.set('view', view); else params.delete('view');
    const target = win.location.pathname + (params.size ? '?' + params.toString() : '');
    if (target !== win.location.pathname + win.location.search) win.history.pushState(null, '', target);
    apply(view);
    if (focus) tabs.find(tab => tab.dataset.view === view)?.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.view));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      select(tabs[target].dataset.view, true);
    });
  });
  win.addEventListener('popstate', () => apply(current()));
  apply(current());
}

export async function copyText(text, clipboard, doc) {
  try {
    if (clipboard?.writeText) {
      await clipboard.writeText(text);
      return true;
    }
  } catch { /* Try the user-gesture compatible fallback. */ }
  const active = doc.activeElement;
  const input = doc.createElement('textarea');
  input.value = text;
  input.readOnly = true;
  input.tabIndex = -1;
  input.setAttribute('aria-hidden', 'true');
  input.style.cssText = 'position:fixed;top:0;left:-9999px;width:1px;height:1px;opacity:0';
  doc.body.appendChild(input);
  let success = false;
  try {
    input.focus({ preventScroll: true });
    input.select();
    input.setSelectionRange(0, text.length);
    success = Boolean(doc.execCommand?.('copy'));
  } catch { success = false; }
  finally {
    input.remove();
    active?.focus?.({ preventScroll: true });
  }
  return success;
}

export function initializeCopy(doc = document, nav = navigator, win = window) {
  const toast = doc.getElementById('copy-status');
  const fallback = doc.getElementById('copy-fallback');
  const manual = doc.getElementById('manual-copy');
  if (!toast || !fallback || !manual) return;
  let timer, sequence = 0, previous;
  const notify = text => {
    win.clearTimeout(timer);
    toast.textContent = text;
    toast.classList.add('shown');
    timer = win.setTimeout(() => toast.classList.remove('shown'), 2600);
  };
  const close = () => {
    fallback.hidden = true;
    previous?.focus?.({ preventScroll: true });
  };
  doc.getElementById('copy-close').addEventListener('click', close);
  fallback.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  });
  doc.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const request = ++sequence;
      const value = button.dataset.copy;
      previous = button;
      fallback.hidden = true;
      const success = await copyText(value, nav.clipboard, doc);
      if (request !== sequence) return;
      if (success) {
        notify('已复制 ' + button.dataset.label);
      } else {
        manual.value = value;
        fallback.hidden = false;
        manual.focus({ preventScroll: true });
        manual.select();
        notify('自动复制不可用，请手动复制');
      }
    });
  });
}

if (typeof document !== 'undefined') {
  initializeTabs();
  initializeCopy();
}
