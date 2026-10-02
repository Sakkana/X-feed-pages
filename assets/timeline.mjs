export function dominantDate(areas,current) {
  const total=areas.reduce((n,x)=>n+x.area,0);
  const candidate=areas.reduce((best,x)=>x.area>best.area?x:best,{date:current,area:0});
  const existing=areas.find(x=>x.date===current)?.area||0;
  if(!candidate.area)return current;
  return !existing||(candidate.area/total>=.55&&candidate.area>existing*1.25)?candidate.date:current;
}
export function initializeTimeline(doc=document,win=window) {
  const bar=doc.getElementById('timeline-date'),panel=doc.getElementById('panel-feed');
  if(!bar||!panel)return;
  const label=bar.querySelector('.timeline-current'),menu=bar.querySelector('details');let active='',frame;
  const update=()=>{
    frame=undefined;
    const sections=[...doc.querySelectorAll('[data-day]')].filter(x=>!x.hidden);
    const first=sections[0];
    bar.hidden=panel.hidden||!first||first.querySelector('.date-row').getBoundingClientRect().bottom>12||sections.at(-1).getBoundingClientRect().bottom<64;
    if(bar.hidden){menu.open=false;return;}
    const areas=sections.map(section=>({date:section.dataset.day,area:[...section.querySelectorAll('.entry')].filter(x=>!x.hidden).reduce((sum,entry)=>{const r=entry.getBoundingClientRect();return sum+Math.max(0,Math.min(r.bottom,win.innerHeight)-Math.max(r.top,64));},0)}));
    active=dominantDate(areas,active||first.dataset.day);label.textContent=active;
  };
  const schedule=()=>{if(frame===undefined)frame=win.requestAnimationFrame(update);};
  const refresh=()=>{
    const available=new Set([...doc.querySelectorAll('.entry')].filter(e=>e.dataset.matches==='true').map(e=>e.dataset.date));
    bar.querySelectorAll('[data-jump-date]').forEach(b=>b.hidden=!available.has(b.dataset.jumpDate));
    menu.open=false;schedule();
  };
  bar.querySelectorAll('[data-jump-date]').forEach(button=>button.addEventListener('click',()=>{
    menu.open=false;doc.dispatchEvent(new win.CustomEvent('timeline-jump',{detail:button.dataset.jumpDate}));
  }));
  doc.addEventListener('click',event=>{if(!bar.contains(event.target))menu.open=false;});
  menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
  win.addEventListener('scroll',schedule,{passive:true});win.addEventListener('resize',schedule);
  doc.addEventListener('feed-updated',refresh);doc.addEventListener('home-view-changed',refresh);win.addEventListener('pageshow',refresh);
  refresh();
  return {update,stop(){win.removeEventListener('scroll',schedule);win.removeEventListener('resize',schedule);doc.removeEventListener('feed-updated',refresh);doc.removeEventListener('home-view-changed',refresh);win.removeEventListener('pageshow',refresh);}};
}
if(typeof document!=='undefined')initializeTimeline();
