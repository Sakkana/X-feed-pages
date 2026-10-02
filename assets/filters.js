(() => {
  const form=document.querySelector('.filters');
  if(!form)return;
  const date=document.querySelector('#date-filter'),type=document.querySelector('#type-filter'),query=document.querySelector('#query-filter');
  const entries=[...document.querySelectorAll('.entry')];
  const apply=()=>{
    const p=new URLSearchParams(location.search),d=p.get('date')||'',t=p.get('type')||'',q=(p.get('q')||'').trim();
    date.value=d;type.value=t;query.value=q;
    let count=0;const shown=Math.max(20,Math.min(entries.length,parseInt(p.get('shown'),10)||20));
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(const entry of entries){const match=!((d&&entry.dataset.date!==d)||(t&&!JSON.parse(entry.dataset.themes).includes(t))||(q&&![entry.dataset.search,entry.dataset.searchTraditional||''].some(s=>s.includes(q.toLowerCase()))));entry.dataset.matches=String(match);entry.hidden=!match||count>=shown;if(match)count++;entry.classList.remove('reveal');if(!entry.hidden){entry.style.setProperty('--i',String(Math.min(count-1,7)));if(!reduced)requestAnimationFrame(()=>entry.classList.add('reveal'));}}
    for(const section of document.querySelectorAll('[data-day]')){const n=[...section.querySelectorAll('.entry')].filter(x=>!x.hidden).length;section.hidden=!n;section.querySelector('.day-count').textContent=[...section.querySelectorAll('.entry')].filter(x=>x.dataset.matches==='true').length+' 篇';}
    document.querySelector('#result-count').textContent=count;const more=document.querySelector('#load-more');if(more)more.hidden=count<=shown;document.dispatchEvent?.(new CustomEvent('feed-updated'));
    document.querySelector('#empty-state').hidden=!!count;
    form.querySelector('[type=reset]').hidden=!(d||t||q);
    document.querySelector('#filter-status').textContent=(d||t||q)?['筛选结果',d,t,q&&'“'+q+'”',count+' 篇'].filter(Boolean).join(' · '):'';
    for(const a of document.querySelectorAll('[data-theme]')){const selected=a.dataset.theme===t;a.classList.toggle('selected',selected);if(selected)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');}
  };
  const update=(p)=>{const search=p.toString();const target=location.pathname+(search?'?'+search:'');if(location.pathname+location.search!==target)history.pushState(null,'',target);apply();};
  const submit=()=>{clearTimeout(timer);const p=new URLSearchParams(location.search);p.delete('date');p.delete('type');p.delete('q');p.delete('shown');if(date.value)p.set('date',date.value);if(type.value)p.set('type',type.value);if(query.value.trim())p.set('q',query.value.trim());update(p);};
  form.addEventListener('submit',ev=>{ev.preventDefault();submit();});
  date.addEventListener('change',submit);type.addEventListener('change',submit);
  let timer;query.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(submit,220);});
  form.addEventListener('reset',ev=>{ev.preventDefault();clearTimeout(timer);update(new URLSearchParams());});
  for(const a of document.querySelectorAll('[data-theme]'))a.addEventListener('click',ev=>{if(ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;ev.preventDefault();const p=new URLSearchParams(location.search);p.delete('shown');if(a.dataset.theme)p.set('type',a.dataset.theme);else p.delete('type');update(p);});
  document.querySelector('#load-more')?.addEventListener('click',()=>{const p=new URLSearchParams(location.search);p.set('shown',String((parseInt(p.get('shown'),10)||20)+20));update(p);});
  document.addEventListener?.('timeline-jump',ev=>{const matching=entries.filter(e=>e.dataset.matches==='true'),index=matching.findIndex(e=>e.dataset.date===ev.detail);if(index<0)return;const p=new URLSearchParams(location.search);p.set('shown',String(Math.max(parseInt(p.get('shown'),10)||20,Math.ceil((index+1)/20)*20)));update(p);requestAnimationFrame(()=>document.getElementById('day-'+ev.detail)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));});
  window.addEventListener('popstate',()=>{clearTimeout(timer);apply();});apply();
})();
