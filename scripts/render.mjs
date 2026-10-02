export const BASE='/X-feed-pages/';
const legacy = {
  '11-10-37': {type:'DeFi',tags:['借贷','Pendle'],summary:'即时年化不等于短期净收益。核对金库配置、奖励期限与参与成本，保留观察。',observation:'2026-10-02 11:05–11:09 北京时间'},
  '12-09-51': {type:'套利',tags:['DEX','MEV','HawkFi'],summary:'拆开 MEV Boost 机制与论文中的 1.69 bp 指标，尚未验证用户可执行的净盈利。',observation:'2026-10-02 12:04–12:08 北京时间'},
  '12-37-16': {type:'山寨币估值',tags:['DEX','DeFi','CAKE','SKY'],summary:'首轮比较价值回流、供给与催化剂；当时保留 CAKE、SKY 继续研究。后续已有补充核验。',observation:'2026-10-02 12:21–12:34 北京时间'},
  '12-50-16': {type:'山寨币估值',tags:['DeFi','DEX','SKY','CAKE','ENA'],summary:'补齐长窗口证据后，SKY 降为价值捕获观察，CAKE 仍待补证，ENA 可售数量未确认。',observation:'2026-10-02 12:39–12:49 北京时间'},
  '13-12-29': {type:'DeFi',tags:['RWA','收益分层','ONyc'],summary:'ONyc 优先／劣后层的收益来自不同风险承担。高 APY 不能替代费用、退出和本金风险核验。',observation:'2026-10-02 13:05–13:10 北京时间'}
};
const e = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function parseFrontmatter(md) {
  const match=String(md).match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if(!match)return {content:md,signal:undefined};
  const signal=match[1].match(/^signal_strength\s*:\s*(.*?)\s*$/m)?.[1]?.replace(/^(["'])(.*)\1$/,'$2');
  return {content:md.slice(match[0].length),signal};
}
function normalizeSignal(value) {
  return ({strong:'strong',medium:'medium',weak:'weak','强':'strong','中':'medium','弱':'weak'})[String(value??'').trim().toLowerCase()];
}
function signalBadge(r) {
  const value=normalizeSignal(r.signal_strength);
  if(!value||['账号运营','合约安全'].includes(r.type))return '';
  const label={strong:'强信号',medium:'中信号',weak:'弱信号'}[value];
  return '<span class="signal-badge" data-strength="'+value+'" title="按报告观察时点评级">'+label+'</span>';
}
function record(r) {
  const m=r.path.match(/^(\d{4}-\d{2}-\d{2})\/(\d{2}-\d{2}-\d{2})(?:-【([^】]+)】-([^/]+)|_([^/]+))\.md$/);
  if(!m) throw new Error('Unsupported report path');
  const old=m[1]==='2026-10-02'&&m[5]?legacy[m[2]]||{}:{};
  const {content,signal}=parseFrontmatter(r.markdown);
  const header=content.match(/^#\s+(.+)$/m)?.[1];
  const declaredType=content.match(/^(?:- )?(?:主类型|类型)[：:]\s*(.+)$/m)?.[1].trim();
  const tagLine=content.match(/^(?:- )?标签[：:]\s*(.+)$/m)?.[1];
  const declaredTags=tagLine?.split(/[、,，]/).map(t=>t.trim()).filter(Boolean);
  const tags=[...new Set(r.tags||declaredTags||old.tags||[])];
  const type=m[3]||r.type||declaredType||old.type||'研究';
  const declaredSignal=content.match(/^(?:[-*] )?(?:信号等级|信号|signal_strength)[：:]\s*([^\n|｜]+)/m)?.[1];
  const signalStrength=['账号运营','合约安全'].includes(type)?undefined:normalizeSignal(r.signal_strength??signal??declaredSignal);
  return {...r,signal_strength:signalStrength,date:m[1],time:m[2].replaceAll('-',':'),title:header||m[4]||m[5],type,tags,summary:r.summary||old.summary||extractSummary(content),observation:r.observation||old.observation||extractObservation(content)};
}
function extractSummary(md) {
  const paras=md.split(/\n\s*\n/).map(x=>x.trim()).filter(x=>x&&!/^(#|\||-|报告发送时间|研究时间|观察时间|数据观察|实际核验|主题|类型|标签|信号等级|信号|评级依据|signal_strength)/.test(x));
  return (paras[0]||'阅读原文与来源核验').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*`_]/g,'').slice(0,150);
}
function extractObservation(md) {return md.split('\n').find(x=>/^(?:- )?(?:数据观察窗口|实际观察窗口|实际核验窗口|观察时间|研究时间|研究截止|数据窗口)[：:]/.test(x))?.replace(/^- /,'')||'观察时间见原文';}
function github(path){return 'https://github.com/Sakkana/X-feed-pages/blob/main/'+path.split('/').map(encodeURIComponent).join('/');}
function reportHref(path){return BASE+path.split('/').map(encodeURIComponent).join('/').replace(/\.md$/,'.html');}
function safeHref(url,path) {
  const raw=url.trim().replace(/&amp;/g,'&');
  if(/^https?:\/\//i.test(raw))return raw;
  if(/^\.\.\/README\.md/.test(raw))return BASE+'?date='+path.slice(0,10);
  if(/\.md(?:#.*)?$/.test(raw)){try{const p=new URL(raw,'https://local/'+path);return reportHref(decodeURIComponent(p.pathname.slice(1)))+p.hash;}catch{}}
  if(raw.startsWith('#'))return raw;
  return '';
}
function inline(raw,path){
  const tokens=[];const stash=x=>{tokens.push(x);return '\u0000'+(tokens.length-1)+'\u0000';};
  raw=String(raw).replace(/`([^`]+)`/g,(_,t)=>stash('<code>'+e(t)+'</code>'));
  raw=raw.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(_,t,u)=>{const href=safeHref(u,path);return stash(href?'<a href="'+e(href)+'"'+(/^https?:/.test(href)?' target="_blank" rel="noopener noreferrer"':'')+'>'+e(t)+'</a>':e(t));});
  raw=raw.replace(/https?:\/\/[^\s<>\u0000]+/g,u=>{const suffix=u.match(/[。，；）]+$/)?.[0]||'';u=u.slice(0,u.length-suffix.length);return stash('<a href="'+e(u)+'" target="_blank" rel="noopener noreferrer">'+e(u)+'</a>')+suffix;});
  raw=e(raw).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
  return raw.replace(/\u0000(\d+)\u0000/g,(_,i)=>tokens[+i]);
}
function markdown(md,path){
  const lines=parseFrontmatter(md).content.replace(/\r/g,'').split('\n');let out='',i=0;
  while(i<lines.length){let line=lines[i];if(!line.trim()){i++;continue;}
    if(i===0&&/^# /.test(line)){i++;continue;}
    if(/^```/.test(line)){let code=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))code.push(lines[i++]);i++;out+='<pre><code>'+e(code.join('\n'))+'</code></pre>';continue;}
    if(/^\|/.test(line)&&/^\|?\s*:?-+/.test(lines[i+1]||'')){
      const cells=s=>s.trim().replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(x=>x.trim());
      out+='<div class="table-scroll" tabindex="0" role="region" aria-label="数据表格"><table><thead><tr>'+cells(line).map(c=>'<th>'+inline(c,path)+'</th>').join('')+'</tr></thead><tbody>';i+=2;
      while(i<lines.length&&/^\|/.test(lines[i]))out+='<tr>'+cells(lines[i++]).map(c=>'<td>'+inline(c,path)+'</td>').join('')+'</tr>';
      out+='</tbody></table></div>';continue;
    }
    if(/^#{1,6}\s/.test(line)){let h=line.match(/^(#{1,6})\s+(.+)$/);let level=Math.max(h[1].length,2);out+='<h'+level+' id="'+e(h[2].toLowerCase().replace(/[^\p{L}\p{N} _-]/gu,'').replace(/ /g,'-'))+'">'+inline(h[2],path)+'</h'+level+'>';i++;continue;}
    if(/^\s*[-*]\s+/.test(line)||/^\s*\d+\.\s+/.test(line)){
      const ordered=/^\s*\d+\./.test(line),re=ordered?/^\s*\d+\.\s+/:/^\s*[-*]\s+/;const tag=ordered?'ol':'ul';out+='<'+tag+'>';
      while(i<lines.length&&re.test(lines[i]))out+='<li>'+inline(lines[i++].replace(re,''),path)+'</li>';
      out+='</'+tag+'>';continue;
    }
    if(/^---+$/.test(line.trim())){out+='<hr>';i++;continue;}
    if(/^>/.test(line)){let p=[];while(i<lines.length&&/^>/.test(lines[i]))p.push(lines[i++].replace(/^>\s?/,''));out+='<blockquote>'+inline(p.join(' '),path)+'</blockquote>';continue;}
    let p=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^(#{1,6}\s|\||[-*]\s|\d+\.\s|```|>)/.test(lines[i]))p.push(lines[i++]);out+='<p>'+inline(p.join('\n'),path).replace(/ {2}\n/g,'<br>')+'</p>';
  }return out;
}

export { record,e,inline,markdown,github,reportHref,safeHref,signalBadge,normalizeSignal,parseFrontmatter };
