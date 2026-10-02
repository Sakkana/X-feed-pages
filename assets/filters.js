(() => {
  const form=document.querySelector('.filters');
  if(!form)return;
  const date=document.querySelector('#date-filter'),type=document.querySelector('#type-filter'),query=document.querySelector('#query-filter');
  const entries=[...document.querySelectorAll('.entry')];
  const apply=()=>{
    const p=new URLSearchParams(location.search),d=p.get('date')||'',t=p.get('type')||'',q=(p.get('q')||'').trim();
    date.value=d;type.value=t;query.value=q;
    let count=0;
    for(const entry of entries){entry.hidden=!!((d&&entry.dataset.date!==d)||(t&&!JSON.parse(entry.dataset.themes).includes(t))||(q&&!entry.dataset.search.includes(q.toLowerCase())));if(!entry.hidden)count++;}
    for(const section of document.querySelectorAll('[data-day]')){const n=[...section.querySelectorAll('.entry')].filter(x=>!x.hidden).length;section.hidden=!n;section.querySelector('.day-count').textContent=n+' 篇';}
    document.querySelector('#result-count').textContent=count;
    document.querySelector('#empty-state').hidden=!!count;
    document.querySelector('#filter-status').textContent=(d||t||q)?['筛选结果',d,t,q&&'“'+q+'”',count+' 篇'].filter(Boolean).join(' · '):'';
    for(const a of document.querySelectorAll('[data-theme]')){const selected=a.dataset.theme===t;a.classList.toggle('selected',selected);if(selected)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');}
  };
  const update=(p)=>{const search=p.toString();const target=location.pathname+(search?'?'+search:'');if(location.pathname+location.search!==target)history.pushState(null,'',target);apply();};
  const submit=()=>{clearTimeout(timer);const p=new URLSearchParams();if(date.value)p.set('date',date.value);if(type.value)p.set('type',type.value);if(query.value.trim())p.set('q',query.value.trim());update(p);};
  form.addEventListener('submit',ev=>{ev.preventDefault();submit();});
  date.addEventListener('change',submit);type.addEventListener('change',submit);
  let timer;query.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(submit,220);});
  form.addEventListener('reset',ev=>{ev.preventDefault();clearTimeout(timer);update(new URLSearchParams());});
  for(const a of document.querySelectorAll('[data-theme]'))a.addEventListener('click',ev=>{if(ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;ev.preventDefault();const p=new URLSearchParams(location.search);if(a.dataset.theme)p.set('type',a.dataset.theme);else p.delete('type');update(p);});
  window.addEventListener('popstate',()=>{clearTimeout(timer);apply();});apply();
})();
