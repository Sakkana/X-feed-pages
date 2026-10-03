export const CITIES = [
  ['北京时间', 'Asia/Shanghai'],
  ['香港时间', 'Asia/Hong_Kong'],
  ['新加坡时间', 'Asia/Singapore'],
  ['吉隆坡时间', 'Asia/Kuala_Lumpur'],
  ['东京时间', 'Asia/Tokyo'],
  ['华盛顿时间', 'America/New_York'],
  ['伦敦时间', 'Europe/London'],
  ['迪拜时间', 'Asia/Dubai'],
];
const formatters = new Map();
const TRADITIONAL_LABELS = {'北京时间':'北京時間','香港时间':'香港時間','新加坡时间':'新加坡時間','吉隆坡时间':'吉隆坡時間','东京时间':'東京時間','华盛顿时间':'華盛頓時間','伦敦时间':'倫敦時間','迪拜时间':'迪拜時間'};
const ENGLISH_LABELS = {'北京时间':'Beijing','香港时间':'Hong Kong','新加坡时间':'Singapore','吉隆坡时间':'Kuala Lumpur','东京时间':'Tokyo','华盛顿时间':'Washington, DC','伦敦时间':'London','迪拜时间':'Dubai'};
export function formatClock(label, zone, date, language = 'zh-CN') {
  if (!formatters.has(zone)) formatters.set(zone, new Intl.DateTimeFormat('en-GB', {
    timeZone: zone, hourCycle: 'h23', hour: '2-digit', minute: '2-digit',
    second: '2-digit', timeZoneName: 'shortOffset',
  }));
  const parts = Object.fromEntries(formatters.get(zone).formatToParts(date).map(p => [p.type, p.value]));
  const offset = parts.timeZoneName === 'GMT' ? 'UTC+0' : parts.timeZoneName.replace('GMT', 'UTC').replace('−', '-');
  return language === 'en' ? `${label} ${parts.hour}:${parts.minute}:${parts.second} (${offset})` : `${label} ${parts.hour}:${parts.minute}:${parts.second}（${offset}）`;
}
export function initializeWorldClocks(doc = document, win = window, now = () => new Date()) {
  const clocks = [...doc.querySelectorAll('[data-clock-zone]')];
  if (!clocks.length) return () => {};
  let timer;
  const update = () => {
    win.clearTimeout(timer);
    const instant = now();
    const group = doc.querySelector?.('.world-clocks');
    group?.setAttribute('aria-label', doc.documentElement?.lang === 'en' ? 'World clocks' : doc.documentElement?.lang === 'zh-Hant' ? '世界時間' : '世界时间');
    clocks.forEach(clock => {
      const language = doc.documentElement?.lang || 'zh-CN';
      const labels = language === 'en' ? ENGLISH_LABELS : language === 'zh-Hant' ? TRADITIONAL_LABELS : {};
      const label = labels[clock.dataset.clockLabel] || clock.dataset.clockLabel;
      clock.textContent = formatClock(label, clock.dataset.clockZone, instant, language);
      clock.dateTime = instant.toISOString();
    });
    // Re-read the real clock on every tick and resume; never increment stored seconds.
    if (!doc.hidden) timer = win.setTimeout(update, 1000 - instant.getMilliseconds());
  };
  doc.addEventListener('visibilitychange', update);
  doc.addEventListener('language-changed', update);
  win.addEventListener('pageshow', update);
  update();
  return () => {
    win.clearTimeout(timer);
    doc.removeEventListener('visibilitychange', update);
    doc.removeEventListener('language-changed', update);
    win.removeEventListener('pageshow', update);
  };
}
if (typeof document !== 'undefined') initializeWorldClocks();
