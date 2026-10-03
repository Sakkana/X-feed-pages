const STORAGE='x-feed-language';
const EXCLUDE='script,style,pre,code,[translate="no"],.notranslate,.language-menu,.world-clocks';
export function initializeLanguage(doc=document,win=window,load=()=>import('./vendor/opencc-cn2t.mjs')) {
  const menu=doc.getElementById('language-menu');
  if(!menu)return;
  const current=menu.querySelector('.language-current'),status=doc.getElementById('language-status');
  const records=new WeakMap();let mode='zh-CN',converter,loading,observer,queued=false,request=0;
  const remember=(node)=>{let item=records.get(node);if(!item||node.nodeValue!==item.output){item={source:node.nodeValue,output:node.nodeValue};records.set(node,item);}return item;};
  const observe=()=>observer?.observe(doc.body,{subtree:true,childList:true,characterData:true});
  const render=()=>{
    observer?.disconnect();
    const walker=doc.createTreeWalker(doc.body,win.NodeFilter.SHOW_TEXT);let node;
    while((node=walker.nextNode())){
      if(!node.parentElement||node.parentElement.closest(EXCLUDE)||!node.nodeValue.trim())continue;
      const item=remember(node);item.output=mode==='zh-Hant'?converter(item.source):item.source;
      if(node.nodeValue!==item.output)node.nodeValue=item.output;
    }
    for(const input of doc.querySelectorAll('input[placeholder]')){
      input.dataset.originalPlaceholder??=input.placeholder;
      input.placeholder=mode==='zh-Hant'?converter(input.dataset.originalPlaceholder):input.dataset.originalPlaceholder;
    }
    for(const entry of doc.querySelectorAll('.entry'))if(converter)entry.dataset.searchTraditional=converter(entry.dataset.search);
    observe();
  };
  const setMode=async(next)=>{
    if(next!=='zh-CN'&&next!=='zh-Hant')next='zh-CN';
    const turn=++request;menu.open=false;
    if(next==='zh-Hant'&&!converter){
      status.textContent='正在加载繁体转换…';
      try{loading??=load();const OpenCC=await loading;converter=OpenCC.Converter({from:'cn',to:'t'});}
      catch{loading=undefined;if(turn===request)status.textContent='繁体转换暂不可用，请重试';return;}
    }
    if(turn!==request)return;
    mode=next;doc.documentElement.lang=mode;current.textContent=mode==='zh-Hant'?'🇨🇳 繁體中文':'🇨🇳 简体中文';
    try{win.localStorage.setItem(STORAGE,mode);}catch{}
    menu.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.language===mode)));
    status.textContent='';render();doc.dispatchEvent(new win.CustomEvent('language-changed',{detail:mode}));
  };
  menu.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.language)));
  doc.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
  menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
  observer=new win.MutationObserver(changes=>{
    if(mode!=='zh-Hant'||queued||changes.every(c=>c.target.parentElement?.closest('.world-clocks')))return;
    queued=true;win.queueMicrotask(()=>{queued=false;render();});
  });observe();
  let saved;try{saved=win.localStorage.getItem(STORAGE);}catch{}
  if(saved==='zh-Hant')setMode(saved);
  else if(saved&&saved!=='zh-CN')setMode('zh-CN');
  return {setMode,get mode(){return mode;},stop:()=>observer.disconnect()};
}
if(typeof document!=='undefined')initializeLanguage();
