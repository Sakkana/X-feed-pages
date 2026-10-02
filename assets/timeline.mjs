export function initializeTimeline(doc=document,win=window) {
  const panel=doc.getElementById('panel-feed');
  if(!panel)return;
  const menus=[...panel.querySelectorAll('.date-menu')];
  const closeAll=()=>menus.forEach(menu=>menu.open=false);
  const refresh=()=>{
    const available=new Set([...panel.querySelectorAll('.entry')].filter(e=>e.dataset.matches==='true').map(e=>e.dataset.date));
    panel.querySelectorAll('[data-jump-date]').forEach(button=>button.hidden=!available.has(button.dataset.jumpDate));
    closeAll();
  };
  const click=event=>{
    const button=event.target.closest('[data-jump-date]');
    if(button&&panel.contains(button)){
      closeAll();
      doc.dispatchEvent(new win.CustomEvent('timeline-jump',{detail:button.dataset.jumpDate}));
    }else{
      menus.forEach(menu=>{if(!menu.contains(event.target))menu.open=false;});
    }
  };
  const keydown=event=>{
    const menu=event.target.closest('.date-menu');
    if(event.key==='Escape'&&menu){menu.open=false;menu.querySelector('summary').focus();}
  };
  doc.addEventListener('click',click);panel.addEventListener('keydown',keydown);
  doc.addEventListener('feed-updated',refresh);doc.addEventListener('home-view-changed',refresh);win.addEventListener('pageshow',refresh);
  refresh();
  return {stop(){doc.removeEventListener('click',click);panel.removeEventListener('keydown',keydown);doc.removeEventListener('feed-updated',refresh);doc.removeEventListener('home-view-changed',refresh);win.removeEventListener('pageshow',refresh);}};
}
if(typeof document!=='undefined')initializeTimeline();
