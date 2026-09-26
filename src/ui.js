/* ================================================================
   Receipt Keeper 1.7 — pastel UI layer (matches the Figma file
   "04 · Receipt Keeper — Wireframes & UI", section B).
   Function declarations here replace the older wireframe versions
   declared above (same scope, the last declaration wins).
   ================================================================ */

/* ---------- icons ---------- */
Object.assign(P,{
  bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  cup:'<path d="M6 8h11v5a5 5 0 01-5 5h-1a5 5 0 01-5-5z"/><path d="M17 10h1.5a2.5 2.5 0 010 5H17"/><path d="M9 3v2M13 3v2"/>',
  cart:'<path d="M3 4h2l2 11h11l2-8H6.5"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
  bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  plane:'<path d="M3 12l18-8-5 17-4-7z"/><path d="M12 14l4-4"/>',
  pulse:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  wrench:'<path d="M14.5 6.5a4 4 0 00-5 5L4 17l3 3 5.5-5.5a4 4 0 005-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".8"/><circle cx="4.5" cy="12" r=".8"/><circle cx="4.5" cy="18" r=".8"/>',
  folder:'<path d="M3 7.5A2.5 2.5 0 015.5 5H9l2 2.2h7.5A2.5 2.5 0 0121 9.7v7.8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5z"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.6 1.6 1.6.6-1.6.6L19 20.4l-.6-1.6-1.6-.6 1.6-.6z"/>',
  shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  alert:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.3"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.3"/>',
  archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>',
  restore:'<path d="M4 12a8 8 0 108-8 8 8 0 00-6.2 3"/><path d="M4 4v4h4"/>',
  sms:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/>',
  filter:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  camoff:'<path d="M4 8h4l2-3h4l2 3h4v11H4z"/><circle cx="12" cy="13" r="3.5"/><path d="M3 3l18 18"/>',
  edit:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M13 20h7"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>'
});
var CC={Shopping:['#F9D9C4','#C0602E','bag'],Dining:['#F6D5EC','#A23B8A','cup'],Groceries:['#E3EDC4','#5B6B1E','cart'],Utilities:['#D4E6F5','#2F6690','bolt'],
  Travel:['#CDEBDD','#2E7D5B','plane'],Health:['#E2DDF7','#5B4BB7','pulse'],Services:['#FCEFB4','#8A6D00','wrench'],Rent:['#F3E0D2','#8C5A3D','home'],Other:['#EFEADF','#575A61','receipt']};
Object.keys(CC).forEach(function(c){CAT_COLOR[c]=CC[c][1];});
var FCOL=[['#FCEFB4','#8A6D00'],['#CDEBDD','#2E7D5B'],['#F9D9C4','#C0602E'],['#D4E6F5','#2F6690'],['#F6D5EC','#A23B8A'],['#E2DDF7','#5B4BB7']];
function cc(c){return CC[c]||CC.Other;}
function catVars(c){var x=cc(c);return '--cb:'+x[0]+';--cf:'+x[1];}
function catIco(c,cls){return '<span class="catIco '+(cls||'')+'" style="'+catVars(c)+'">'+ic(cc(c)[2])+'</span>';}
function fcol(f){var i=typeof f.color==='number'?f.color:(function(s){var h=0;for(var k=0;k<s.length;k++)h=(h*31+s.charCodeAt(k))|0;return Math.abs(h);})(String(f.id))%FCOL.length;return FCOL[i%FCOL.length];}
function rupees(v){return '₹'+num(Math.round(v));}
function sumOf(L){return L.reduce(function(a,b){return a+(Number(b.amount)||0);},0);}
function reduced(){return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);}
S.prefs=S.prefs||{defView:'list',boost:true};S.recent=S.recent||[];

META.onboard=['Onboarding','Three value screens, then a permission screen that says why each permission is needed.'];
META.backup=['Backup & restore','Bills live only on the phone, so the backup file is the safety net. Restoring skips bills already in the Vault.'];
META.keys=['Bill reading','OCR.space reads bills by default; an optional Claude key reads messy or handwritten bills more accurately.'];

/* ---------- shared pieces ---------- */
function bigTop(t,right){return '<div class="bigTop"><h1>'+esc(t)+'</h1>'+(right||'')+'</div>';}
function viewTog(){return '<div class="viewTog" role="group" aria-label="View"><button data-act="seg" data-a="cal" class="'+(S.view==='cal'?'on':'')+'" aria-label="Calendar view" aria-pressed="'+(S.view==='cal')+'">'+ic('cal')+'</button><button data-act="seg" data-a="list" class="'+(S.view!=='cal'?'on':'')+'" aria-label="List view" aria-pressed="'+(S.view!=='cal')+'">'+ic('list')+'</button></div>';}
function offlineBar(){return navigator.onLine===false?'<div class="offBar">'+ic('info')+'<span>You’re offline — bills still save, reading waits</span></div>':'';}
function searchRow(dis){return '<div class="searchRow'+(dis?' dis':'')+'"><button class="searchPill" data-act="goSearch"'+(dis?' disabled':'')+'>'+ic('search')+'<span>Search by date, item, amount</span></button><button class="sqBtn y" data-act="goSearch" aria-label="Search"'+(dis?' disabled':'')+'>'+ic('search')+'</button></div>';}
function top(title,o){o=o||{};
  var right=o.right!==undefined?o.right:'<span class="topSp"></span>';
  if(!o.back)return '<div class="scr-top"><h3>'+esc(title)+'</h3>'+right+'</div>';
  return '<div class="scr-top"><button class="iconBtn" data-act="'+(o.backAct||'back')+'" aria-label="'+(o.backIc==='x'?'Close':'Back')+'">'+ic(o.backIc||'back')+'</button>'+
    '<h3 class="'+(o.center?'ctr':'')+'">'+esc(title)+'</h3>'+right+'</div>';}
function rowHtml(b,sub,snip){
  var on=S.selMode&&S.sel.has(b.id),need=b.amount==null;
  var h='<button class="billRow'+(S.selMode?' selectable':'')+(on?' selected':'')+'" data-act="open" data-id="'+esc(b.id)+'"><span class="selDot" aria-hidden="true">'+ic('check')+'</span>'+
    '<span class="icoWrap">'+catIco(b.category)+(need?'<i class="needDot" aria-label="Needs details"></i>':'')+'</span>'+
    '<div class="billMeta"><b>'+esc(displayName(b))+'</b><span>'+esc(need?'Needs details · '+rel(b.date):sub)+'</span></div><div class="billAmt">'+esc(money(b))+'</div></button>';
  if(snip)h+='<div class="ocrSnippet">'+snip+'</div>';
  return h;}
function exportBar(list,scope,label){
  var cur=list.every(function(b){return b.currency===list[0].currency;}),tot=sumOf(list);
  return '<div class="exportBar"><span>'+(label||(list.length+' bill'+(list.length>1?'s':'')))+(cur?' · '+esc(sym(list[0].currency))+num(Math.round(tot)):'')+'</span>'+
    '<button class="linkBtn" data-act="exportPdf" data-a="'+scope+'">'+ic('download')+'PDF</button></div>';}
function emptyBlock(o){return '<div class="emptyBlk">'+(o.art||'<div class="emptyIco" style="--cb:'+(o.cb||'#F6D5EC')+';--cf:'+(o.cf||'#A23B8A')+'">'+ic(o.ic||'search')+'</div>')+
  '<h2>'+o.t+'</h2><p>'+o.p+'</p>'+(o.b1||'')+(o.b2||'')+'</div>';}

/* ---------- Vault (list / calendar / first run) ---------- */
function zeroScreen(){return vaultScreen();}
function vaultScreen(){
  var n=S.bills.length,h=offlineBar()+bigTop('My Vault',viewTog());
  if(!n){
    return h+'<div class="scr-body">'+searchRow(true)+'<div class="zeroWrap">'+
      '<div class="ghostStack"><div class="gCard g3"><i style="background:#F6D5EC"></i><em></em><u></u></div><div class="gCard g2"><i style="background:#E3EDC4"></i><em></em><u></u></div><div class="gCard g1"><i style="background:#F9D9C4"></i><em></em><u></u></div><span class="gPlus">'+ic('plus')+'</span></div>'+
      '<h2>No bills yet</h2><p>Scan a paper bill or import a photo — we crop it, read it and file it for you.</p>'+
      '<button class="btnYellow" data-act="goCamera">Scan your first bill</button>'+
      '<button class="linkBtn strong" data-act="fab">Import photo or PDF</button>'+
      '<button class="linkBtn" data-act="loadSamples">or explore with sample bills</button></div>'+
      '<div class="fabTip">Or tap + anytime</div></div>';
  }
  return h+'<div class="scr-body">'+searchRow()+(S.view==='cal'?calView():listView())+'</div>';
}
function listView(){
  var chips=['All','This month'];CATS.forEach(function(c){if(S.bills.some(function(b){return b.category===c;}))chips.push(c);});
  if(chips.indexOf(S.chip)<0)S.chip='All';
  var h='<div class="chipRow">'+chips.map(function(c){return '<button class="chip'+(S.chip===c?' active':'')+'" data-act="chip" data-a="'+esc(c)+'">'+esc(catLabel(c))+(c==='All'?'<i class="cnt">'+S.bills.length+'</i>':'')+'</button>';}).join('')+'</div>';
  var list=sortedBills().filter(chipFilter);
  if(!list.length)return h+emptyBlock({ic:'filter',cb:'#FCEFB4',cf:'#8A6D00',t:'Nothing here yet',p:'No bills match this filter.',b1:'<button class="btnSecondary" data-act="chip" data-a="All">Show all bills</button>'});
  return h+exportBar(list,'vault')+'<div class="cards">'+list.map(function(b){return rowHtml(b,catLabel(b.category)+' · '+rel(b.date));}).join('')+'</div>';
}
function calView(){
  var y=S.month.y,m=S.month.m,first=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate(),prevDim=new Date(y,m,0).getDate(),t=today(),key=y+'-'+pad(m+1);
  var by={};S.bills.forEach(function(b){(by[b.date]=by[b.date]||[]).push(b);});
  if(!S.openDay||S.openDay.slice(0,7)!==key){var ds0=Object.keys(by).filter(function(d){return d.slice(0,7)===key;}).sort();S.openDay=t.slice(0,7)===key?t:(ds0.length?ds0[ds0.length-1]:key+'-01');}
  var h='<div class="calCard"><div class="calHead"><button class="iconBtn" data-act="mnav" data-a="-1" aria-label="Previous month">'+ic('left')+'</button><b>'+MONL[m]+' '+y+'</b><button class="iconBtn" data-act="mnav" data-a="1" aria-label="Next month">'+ic('right')+'</button></div>';
  h+='<div class="calGrid">'+['MON','TUE','WED','THU','FRI','SAT','SUN'].map(function(d){return '<div class="calDow">'+d+'</div>';}).join('');
  for(var i=0;i<first;i++)h+='<div class="calDay out"><span>'+(prevDim-first+1+i)+'</span></div>';
  for(var d=1;d<=dim;d++){var ds=key+'-'+pad(d),L=by[ds]||[];
    var dots=L.slice(0,3).map(function(b){return '<i style="background:'+cc(b.category)[1]+'"></i>';}).join('');
    h+='<button class="calDay'+(ds===S.openDay?' sel':'')+(ds===t?' today':'')+(L.length?' has':'')+'" data-act="day" data-a="'+ds+'" aria-label="'+d+' '+MONL[m]+(L.length?', '+L.length+' bills':'')+'"><span>'+d+'</span><em>'+dots+'</em></button>';}
  var tail=(7-((first+dim)%7))%7;for(i=1;i<=tail;i++)h+='<div class="calDay out"><span>'+i+'</span></div>';
  h+='</div><div class="calLegend"><span><i class="l1"></i>Bills saved</span><span><i class="l2"></i>Selected date</span></div></div>';
  var L2=by[S.openDay]||[],od=pd(S.openDay);
  h+='<div class="dayHead"><b>'+od.getDate()+' '+MONL[od.getMonth()]+'</b><span>'+L2.length+' BILL'+(L2.length===1?'':'S')+(L2.length?' · '+rupees(sumOf(L2)):'')+'</span></div>';
  h+=L2.length?'<div class="cards">'+L2.map(function(b){return rowHtml(b,catLabel(b.category)+' · '+fmtDate(b.date));}).join('')+'</div>':'<div class="emptyNote">No bills on this day. Tap a date with dots.</div>';
  return h;
}

/* ---------- Search ---------- */
function searchScreen(){
  var s=S.search;
  var catO='<option value="">Category</option>'+CATS.map(function(c){return '<option value="'+c+'"'+(s.cat===c?' selected':'')+'>'+esc(catLabel(c))+'</option>';}).join('');
  var rO=[['','Date'],['month','This month'],['30','Last 30 days'],['year','This year']].map(function(r){return '<option value="'+r[0]+'"'+(s.range===r[0]?' selected':'')+'>'+r[1]+'</option>';}).join('');
  var fO='<option value="">Folder</option>'+S.folders.map(function(f){return '<option value="'+esc(f.id)+'"'+(s.folder===f.id?' selected':'')+'>'+esc(f.name)+'</option>';}).join('');
  return '<div class="searchTop"><button class="iconBtn" data-act="back" aria-label="Back">'+ic('back')+'</button><div class="searchBox focus">'+ic('search')+
    '<input id="q" type="search" placeholder=\'Shop, item, amount or "last month"\' value="'+esc(s.q)+'" aria-label="Search bills" autocomplete="off" enterkeyhint="search"></div></div>'+
    '<div class="scr-body"><div class="chipRow selRow"><select class="chip selChip'+(s.cat?' on':'')+'" id="fCat" aria-label="Category">'+catO+'</select>'+
    '<select class="chip selChip'+(s.folder?' on':'')+'" id="fFolder" aria-label="Folder">'+fO+'</select>'+
    '<select class="chip selChip'+(s.range?' on':'')+'" id="fRange" aria-label="Date range">'+rO+'</select></div><div id="results"></div></div>';
}
var _runSearch=runSearch;
runSearch=function(){
  var s=S.search,el=$('#results');if(!el)return;
  var filters=(s.cat?1:0)+(s.folder?1:0)+(s.range?1:0);
  if(!s.q.trim()&&!filters){
    var h='';
    if(S.recent.length)h+='<div class="secLbl">Recent</div><div class="recentRow">'+S.recent.map(function(r){return '<button class="recent" data-act="recentQ" data-a="'+esc(r)+'">'+ic('clock')+esc(r)+'</button>';}).join('')+'</div>';
    var L=sortedBills().slice(0,6);
    if(!S.bills.length){el.innerHTML=h+emptyBlock({ic:'search',t:'Nothing to search yet',p:'Add a bill with the + button and it shows up here.'});return;}
    el.innerHTML=h+'<div class="secLbl">Latest bills</div><div class="cards">'+L.map(function(b){return rowHtml(b,catLabel(b.category)+' · '+fmtDate(b.date));}).join('')+'</div>'+
      '<div class="tipCard">'+ic('spark')+'<span>Also searches items and amounts inside every bill, and understands “last month”.</span></div>';
    S.lastResults=L;return;}
  _runSearch();
  if(el.querySelector('.billRow')){el.innerHTML=el.innerHTML.replace(/^(<div class="exportBar">[\s\S]*?<\/div>)/,'$1<div class="cards">')+'</div>';return;}
  el.innerHTML=emptyBlock({ic:'search',t:s.q.trim()?'No bills match “'+esc(s.q.trim())+'”':'No bills match',
    p:filters?filters+' filter'+(filters>1?'s are':' is')+' on. Try clearing them, or search by amount, like 320.':'Try a shop name, an item from the bill, or an amount.',
    b1:filters?'<button class="btnPrimary" data-act="clearFilters">Clear filters</button>':'',b2:'<button class="btnSecondary" data-act="searchAll">Search all bills</button>'});
}

/* ---------- Folders & categories ---------- */
function foldersScreen(){
  return offlineBar()+bigTop('Folders','<button class="sqBtn ghost" data-act="account" aria-label="Settings">'+ic('gear')+'</button>')+
    '<div class="scr-body"><div class="searchRow"><div class="searchBox">'+ic('search')+'<input id="fq" type="search" placeholder="Search bills, shops, amounts" value="'+esc(S.fq||'')+'" aria-label="Search folders and bills" autocomplete="off"></div>'+
    '<button class="sqBtn dark" data-act="fqFocus" aria-label="Search">'+ic('filter')+'</button></div><div id="fBody">'+foldersBody()+'</div></div>';}
function catChips(list,sel,act){var cats=CATS.filter(function(c){return list.some(function(b){return b.category===c;});});if(cats.length<2&&!sel)return '';
  return '<div class="chipRow">'+[''].concat(cats).map(function(c){return '<button class="chip'+((sel||'')===c?' active':'')+'" data-act="'+act+'" data-a="'+c+'">'+(c?esc(catLabel(c)):'All<i class="cnt">'+list.length+'</i>')+'</button>';}).join('')+'</div>';}
function folderCardHtml(f,cat){var all=S.bills.filter(function(b){return b.folder===f.id;}),bs=cat?all.filter(function(b){return b.category===cat;}):all,col=fcol(f);
  if(cat&&!bs.length)return '';
  return '<button class="folderCard" data-act="folder" data-id="'+esc(f.id)+'" style="--fb:'+col[0]+';--ff:'+col[1]+'"><span class="fIco">'+ic('folder')+'</span><b>'+esc(f.name)+'</b><span>'+(cat?bs.length+' '+esc(catLabel(cat))+' of '+all.length:bs.length+' bill'+(bs.length===1?'':'s'))+'</span></button>';}
function foldersBody(){
  var q=(S.fq||'').trim().toLowerCase(),cat=S.fcat||'',h=catChips(S.bills,cat,'fcat');
  if(q){
    var fs=S.folders.filter(function(f){return f.name.toLowerCase().indexOf(q)>=0;}),bs=sortedBills().filter(function(b){return (!cat||b.category===cat)&&matchQ(b,q);});
    if(fs.length)h+='<div class="secLbl">Folders</div><div class="folderGrid">'+fs.map(function(f){return folderCardHtml(f,'');}).join('')+'</div>';
    h+='<div class="secLbl">'+bs.length+' bill'+(bs.length===1?'':'s')+'</div><div class="cards">'+bs.map(function(b){return rowHtml(b,catLabel(b.category)+' · '+fmtDate(b.date));}).join('')+'</div>';
    if(!fs.length&&!bs.length)h+=emptyBlock({ic:'search',t:'Nothing matches “'+esc(S.fq)+'”',p:'Try a shop name, an item or an amount.'});
    return h;
  }
  var cats=CATS.filter(function(c){return S.bills.some(function(b){return b.category===c;})&&(!cat||c===cat);});
  if(cats.length)h+='<div class="secHead"><b>Categories</b><span>'+cats.length+'</span></div><div class="catGrid">'+cats.map(function(c){var bs=S.bills.filter(function(b){return b.category===c;});
    return '<button class="catTile" data-act="catOpen" data-a="'+c+'" style="'+catVars(c)+'"><span class="ctIco">'+ic(cc(c)[2])+'</span><b>'+esc(catLabel(c))+'</b><span>'+bs.length+' bill'+(bs.length===1?'':'s')+' · '+rupees(sumOf(bs))+'</span></button>';}).join('')+'</div>';
  else if(!S.bills.length)h+=emptyBlock({ic:'folder',cb:'#FCEFB4',cf:'#8A6D00',t:'Categories appear here',p:'Every bill you save is filed under its category automatically.'});
  var cards=S.folders.map(function(f){return folderCardHtml(f,cat);}).join('');
  h+='<div class="secHead"><b>My folders</b><span>'+S.folders.length+'</span></div><div class="folderGrid">'+cards+'<button class="folderCard newFolder" data-act="newFolderOpen">'+ic('plus')+'<b>New folder</b></button></div>';
  return h;
}
function colFiltered(){var c=S.col||{},q=(c.q||'').trim().toLowerCase();return curColBills().filter(function(b){return (!c.cat||b.category===c.cat)&&(!c.m||b.date.slice(0,7)===c.m)&&(!q||matchQ(b,q));});}
function colListHtml(){var all=curColBills(),list=colFiltered();
  if(!all.length)return '';
  if(!list.length)return emptyBlock({ic:'filter',cb:'#FCEFB4',cf:'#8A6D00',t:'No bills match',p:'Clear the search or pick All.'});
  return exportBar(list,'col')+'<div class="cards">'+list.map(function(b){return rowHtml(b,catLabel(b.category)+' · '+fmtDate(b.date));}).join('')+'</div>';}
function collectionHtml(isCat){var c=S.col||(S.col={q:'',cat:'',m:''});var all=curColBills(),chips='';
  if(isCat){var ms=[];all.forEach(function(b){var k=b.date.slice(0,7);if(ms.indexOf(k)<0)ms.push(k);});ms=ms.slice(0,4);
    if(ms.length>1)chips='<div class="chipRow">'+ms.map(function(k){return '<button class="chip'+(c.m===k?' active':'')+'" data-act="colM" data-a="'+k+'">'+MON[+k.slice(5)-1]+(k.slice(0,4)!==String(new Date().getFullYear())?' '+k.slice(2,4):'')+'</button>';}).join('')+'<button class="chip'+(!c.m?' active':'')+'" data-act="colM" data-a="">All time</button></div>';}
  else chips=catChips(all,c.cat,'colCat');
  return (all.length>4?'<div class="searchBox">'+ic('search')+'<input id="colQ" type="search" placeholder="Search in here" value="'+esc(c.q)+'" aria-label="Search bills" autocomplete="off"></div>':'')+chips+'<div id="colList">'+colListHtml()+'</div>';}
function folderScreen(){
  var f=S.folders.find(function(x){return x.id===S.route.params.id;});
  if(!f)return top('Folder',{back:1})+'<div class="scr-body">'+emptyBlock({ic:'folder',t:'This folder no longer exists',p:'It was deleted. Its bills are still in your Vault.'})+'</div>';
  var all=curColBills(),col=fcol(f),cats={};all.forEach(function(b){cats[b.category]=1;});
  var head='<div class="headCard" style="--hb:'+col[0]+';--hf:'+col[1]+'"><div><div class="hcBig">'+rupees(sumOf(all))+'</div><div class="hcSub">'+all.length+' bill'+(all.length===1?'':'s')+' · '+Object.keys(cats).length+' categor'+(Object.keys(cats).length===1?'y':'ies')+'</div></div>'+
    (all.length?'<button class="pillDark" data-act="exportPdf" data-a="col">'+ic('share')+'Share all</button>':'')+'</div>';
  var body=all.length?collectionHtml(false):emptyBlock({art:'<div class="emptyFolder" style="--hb:'+col[0]+';--hf:'+col[1]+'"><i></i><span>Drop bills here</span></div>',t:'This folder is empty',
    p:'Long-press bills in your Vault and choose Move, or scan straight into this folder.',b1:'<button class="btnPrimary" data-act="moveHere">Move bills here</button>',b2:'<button class="btnSecondary" data-act="scanInto" data-id="'+esc(f.id)+'">Scan into this folder</button>'});
  return top(f.name,{back:1,right:'<button class="iconBtn" data-act="folderMenu" data-id="'+esc(f.id)+'" aria-label="Folder options">'+ic('more')+'</button>'})+'<div class="scr-body">'+head+body+'</div>';
}
function catScreen(){var c=S.route.params.c,all=curColBills(),x=cc(c);
  var head='<div class="headCard" style="--hb:'+x[0]+';--hf:'+x[1]+'"><div><span class="hcIco">'+ic(x[2])+'</span><div class="hcBig">'+rupees(sumOf(colFiltered()))+'</div><div class="hcSub">'+colFiltered().length+' bill'+(colFiltered().length===1?'':'s')+(S.col&&S.col.m?' · '+MONL[+S.col.m.slice(5)-1]:' · all time')+'</div></div>'+
    '<button class="pillDark" data-act="exportPdf" data-a="col">'+ic('download')+'Export PDFs</button></div>';
  return top(catLabel(c),{back:1,right:'<span class="topSp"></span>'})+'<div class="scr-body">'+head+(all.length?collectionHtml(true):emptyBlock({ic:x[2],cb:x[0],cf:x[1],t:'No '+esc(catLabel(c))+' bills',p:'Bills move here when their category is '+esc(catLabel(c))+'.'}))+'</div>';}

/* ---------- Edit details ---------- */
function editScreen(){
  var b=billById(S.route.params.id);if(!b)return top('Edit details',{back:1})+'<div class="scr-body">'+emptyBlock({ic:'alert',t:'This bill was deleted',p:''})+'</div>';
  var f=function(k,lab,ctl){return '<div class="field"><label for="e_'+k+'">'+lab+'</label>'+ctl+'</div>';};
  return top('Edit details',{back:1,right:'<button class="linkBtn" data-act="back">Cancel</button>'})+'<div class="scr-body" style="padding-bottom:120px;">'+
    f('vendor','Shop name','<input class="fieldBox" id="e_vendor" value="'+esc(b.vendor)+'" autocomplete="off">')+
    f('amount','Amount','<div class="fieldBox amtWrap"><span>'+esc(sym(b.currency))+'</span><input id="e_amount" inputmode="decimal" value="'+esc(b.amount==null?'':b.amount)+'" autocomplete="off"></div>')+
    f('date','Date','<input class="fieldBox" id="e_date" type="date" value="'+esc(b.date)+'">')+
    f('type','Bill type','<input class="fieldBox" id="e_type" value="'+esc(b.type||'')+'" list="typeList2" autocomplete="off"><datalist id="typeList2">'+BILL_TYPES.map(function(t){return '<option value="'+t+'">';}).join('')+'</datalist>')+
    '<div class="field"><label>Category</label><input type="hidden" id="e_category" value="'+esc(b.category)+'"><div class="catPick">'+CATS.map(function(c){return '<button type="button" class="cp'+(b.category===c?' on':'')+'" style="'+catVars(c)+'" data-act="eCat" data-a="'+c+'">'+ic(cc(c)[2])+esc(catLabel(c))+'</button>';}).join('')+'</div></div>'+
    f('folder','Folder','<select class="fieldBox" id="e_folder"><option value="">No folder</option>'+S.folders.map(function(x){return '<option value="'+esc(x.id)+'"'+(b.folder===x.id?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select>')+
    f('items','Items','<textarea class="fieldBox" id="e_items" rows="3">'+esc(b.items||'')+'</textarea>')+
    '<div class="tipCard">'+ic('info')+'<span>Saving rebuilds the PDF with the new name and details.</span></div>'+
    '</div><div class="actionBar"><button class="btnPrimary" data-act="editSave" data-id="'+esc(b.id)+'">Save changes</button></div>';
}

/* ---------- Bill detail ---------- */
function billScreen(){
  var b=billById(S.route.params.id);
  if(!b)return top('Bill',{back:1})+'<div class="scr-body">'+emptyBlock({ic:'alert',t:'This bill was deleted',p:'It’s no longer in your Vault.'})+'</div>';
  var fn=folderName(b.folder),when=b.createdAt?new Date(b.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'';
  var img='<button class="billImg'+(S.bigImg?' big':'')+'" data-act="bigImg" aria-label="'+(S.bigImg?'Shrink':'Enlarge')+' bill image">'+(b.img?'<img src="'+b.img+'" alt="Bill from '+esc(b.vendor)+'">':'<span class="noImg">'+ic('receipt')+'<small>No photo · typed or pasted bill</small></span>')+'</button>';
  var qa=[['renameOpen','pen','Rename','#F9D9C4','#C0602E'],['editOpen','tag','Edit','#E3EDC4','#5B6B1E'],['rescan','rescan','Rescan','#D4E6F5','#2F6690'],['moveOpen','move','Move','#F6D5EC','#A23B8A']];
  var row=function(k,v,act){return '<div class="infoRow"><span>'+k+'</span>'+(act?'<button class="linkBtn" data-act="'+act+'">'+v+'</button>':'<b>'+v+'</b>')+'</div>';};
  return top('Bill',{back:1,center:1,right:'<button class="iconBtn" data-act="billMenu" aria-label="Bill options">'+ic('more')+'</button>'})+
   '<div class="scr-body nopad billD">'+img+
   '<div class="bdName">'+esc(displayName(b))+(b.sample?'<span class="sampleTag">sample</span>':'')+'</div>'+(b.title?'<div class="bdVendor">'+esc(b.vendor)+'</div>':'')+
   '<div class="bdAmt'+(b.amount==null?' none':'')+'">'+esc(b.amount==null?'Add amount':money(b))+'</div>'+
   '<button class="bdPill" style="'+catVars(b.category)+'" data-act="catPickOne" aria-label="Change category">'+esc(catLabel(b.category))+' · '+esc(fmtDate(b.date,true))+'</button>'+
   '<div class="quickActs">'+qa.map(function(q){return '<button data-act="'+q[0]+'" data-id="'+esc(b.id)+'" style="--qb:'+q[3]+';--qf:'+q[4]+'">'+ic(q[1])+'<span>'+q[2]+'</span></button>';}).join('')+'</div>'+
   '<div class="infoCard">'+(b.items?row('Items',esc(b.items)):'')+row('Bill type',esc(b.type||'—'))+
     row('Folder',fn?esc(fn)+' · Change':'None · Change','moveOpen')+row('Captured',esc(b.sample?'Sample bill':(b.source||'Added'))+(when?' · '+esc(when):''))+
     row('PDF',b.pdf&&!b.pdfStale?esc(pdfFileName(b)):'Made when you view or share it')+'</div>'+
   (b.text?'<details class="raw"><summary>Text read from the bill</summary><pre>'+esc(b.text)+'</pre></details>':'')+
   '<button class="btnPrimary wide" data-act="viewPdf">View PDF</button>'+
   '<div class="btnRow"><button class="btnSecondary" data-act="sharePdf">Save PDF</button><button class="btnSecondary" data-act="shareApp">Share to app</button></div></div>';
}

/* ---------- Saved ---------- */
function savedScreen(){
  var show=!S.lastBackup||(Date.now()-S.lastBackup>14*864e5),many=/^\d+ bills/.test(S.savedWhere)&&!/^1 bills/.test(S.savedWhere),b=billById(S.lastSavedId);
  if(/^1 bills/.test(S.savedWhere)&&b)S.savedWhere=b.folder?(folderName(b.folder)||catLabel(b.category)):catLabel(b.category);
  var where=many?S.savedWhere.split(' · ')[0]:(S.savedWhere==='Vault'&&b?catLabel(b.category):S.savedWhere);
  var pdfBtn=S.pdfState==='ready'&&b?'<button class="btnPrimary wide" data-act="viewPdf" data-id="'+esc(b.id)+'">View PDF</button>':
    S.pdfState==='failed'?'<div class="svNote">Bill saved. The PDF is made when you open it.</div>':'<button class="btnPrimary wide" disabled>Creating PDF…</button>';
  return '<div class="savedWrap"><div class="svIllu"><div class="svPaper"><i></i><i></i><i></i><em>PDF</em></div><div class="svFolderBack"></div><div class="svFolderFront">'+ic('folder')+'</div><span class="svTick">'+ic('check')+'</span></div>'+
   '<h2>'+(many?'Saved '+esc(where):'Saved to '+esc(where))+'</h2><p class="svFile">'+(many?esc(S.savedWhere.split(' · ')[1]||''):b?esc(pdfFileName(b)):'')+'</p>'+
   (many?'<button class="btnPrimary wide" data-act="tab" data-a="vault">See them in your Vault</button>':pdfBtn)+
   '<button class="btnSecondary wide" data-act="addAnother">+ Add another bill</button>'+
   (S.lastSavedId&&!many?'<button class="linkBtn strong" data-act="open" data-id="'+esc(S.lastSavedId)+'">View bill</button>':'')+
   (show?'<div class="backupCard"><b>'+ic('shield')+'Keep a backup</b><p>Bills live only on this phone. A backup file keeps them safe if you switch phones.</p><div class="bcRow"><button class="btnPrimary sm" data-act="goBackup">Back up now</button><button class="linkBtn" data-act="tab" data-a="vault">Skip</button></div></div>':
     '<button class="linkBtn" data-act="tab" data-a="vault">Done</button>')+'</div>';
}

/* ---------- Settings, backup, bill reading ---------- */
function accountScreen(){
  var n=S.bills.length,tot=sumOf(S.bills),k=window.RK_key,ok=window.RK_ocrKey;
  var eng=k&&k.get()?'Claude · OCR.space as backup':ok?(ok.isDefault()?'OCR.space · built-in key':'OCR.space · your key'):'Claude on your account';
  var last=S.lastBackup?'Last backup · '+rel(ymd(new Date(S.lastBackup))):'Not backed up yet';
  var rowB=function(act,icn,bg,fg,t,s,right){return '<button class="setRow" data-act="'+act+'"><span class="srIco" style="--cb:'+bg+';--cf:'+fg+'">'+ic(icn)+'</span><span class="srTxt"><b>'+t+'</b><small>'+s+'</small></span>'+(right||ic('right','chevR'))+'</button>';};
  return top('Settings',{back:1})+'<div class="scr-body nopad setBody">'+
   '<div class="statRow"><div style="--cb:#E3EDC4;--cf:#5B6B1E"><b>'+n+'</b><span>bill'+(n===1?'':'s')+' saved</span></div><div style="--cb:#F6D5EC;--cf:#A23B8A"><b>'+(tot>=1e5?'₹'+(tot/1e5).toFixed(1)+'L':tot>=1000?'₹'+(tot/1000).toFixed(1)+'k':rupees(tot))+'</b><span>tracked</span></div><div style="--cb:#D4E6F5;--cf:#2F6690"><b>'+S.folders.length+'</b><span>folder'+(S.folders.length===1?'':'s')+'</span></div></div>'+
   '<div class="secLbl">Vault</div><div class="setGroup">'+
     rowB('goBackup','archive','#FCEFB4','#8A6D00','Backup & restore',last)+
     rowB('exportAll','download','#CDEBDD','#2E7D5B','Export all PDFs',n+' bill'+(n===1?'':'s')+' · one PDF, grouped by category')+
     '<div class="setRow"><span class="srIco" style="--cb:#E2DDF7;--cf:#5B4BB7">'+ic('cal')+'</span><span class="srTxt"><b>Default view</b><small>Open your Vault as a list or calendar</small></span>'+
       '<div class="viewTog" role="group" aria-label="Default view"><button data-act="defView" data-a="cal" class="'+(S.prefs.defView==='cal'?'on':'')+'" aria-label="Calendar">'+ic('cal')+'</button><button data-act="defView" data-a="list" class="'+(S.prefs.defView!=='cal'?'on':'')+'" aria-label="List">'+ic('list')+'</button></div></div></div>'+
   '<div class="secLbl">Scanning</div><div class="setGroup">'+
     rowB('goKeys','spark','#D4E6F5','#2F6690','Bill reading',eng)+
     '<div class="setRow"><span class="srIco" style="--cb:#F9D9C4;--cf:#C0602E">'+ic('bolt')+'</span><span class="srTxt"><b>Thermal ink boost</b><small>Darkens faded receipts in every scan</small></span><button class="toggle'+(S.prefs.boost?' on':'')+'" data-act="boostToggle" role="switch" aria-checked="'+S.prefs.boost+'" aria-label="Thermal ink boost"><i></i></button></div></div>'+
   '<div class="secLbl">App</div><div class="setGroup">'+
     (window.RK_openSettings?rowB('openSettings','cam','#EFEADF','#575A61','Permissions','Camera, photos and storage · Android settings'):
       '<div class="setRow"><span class="srIco" style="--cb:#EFEADF;--cf:#575A61">'+ic('lock')+'</span><span class="srTxt"><b>Protect storage</b><small>Ask the browser to keep these bills</small></span><button class="toggle'+(S.persisted?' on':'')+'" data-act="storageToggle" role="switch" aria-checked="'+S.persisted+'" aria-label="Keep storage"><i></i></button></div>')+
     rowB('goOnboard','heart','#F6D5EC','#A23B8A','Show the intro again','The 4 welcome screens')+
     rowB('privacy','shield','#FDE3E1','#9E2B20','Data & privacy','Delete all bills · sample bills')+
   '</div><div class="aboutLine">Receipt Keeper 1.7 · bills stay on this '+(window.RK_NATIVE?'phone':'device')+'</div></div>';
}
function backupScreen(){
  var n=S.bills.length,kb=Math.max(1,Math.round(S.bills.reduce(function(a,b){return a+((b.img||'').length*0.75)+1200;},0)/1024));
  var size=kb>1024?(kb/1024).toFixed(1)+' MB':kb+' KB',ok=S.lastBackup&&(Date.now()-S.lastBackup<14*864e5);
  return top('Backup & restore',{back:1})+'<div class="scr-body nopad setBody">'+
   '<div class="heroCard">'+ic('shield')+'<b>Your bills live only on this '+(window.RK_NATIVE?'phone':'device')+'</b><p>A backup file keeps them safe if you switch or lose your phone.</p></div>'+
   '<div class="infoCard"><div class="icLbl">Last backup</div><div class="icBig">'+(S.lastBackup?rel(ymd(new Date(S.lastBackup)))+' · ':'Never · ')+n+' bill'+(n===1?'':'s')+' · ~'+size+'</div>'+
     (S.lastBackup?'<div class="icSub">receipt-keeper-backup-'+ymd(new Date(S.lastBackup))+'.json</div>':'')+'<span class="statusPill '+(ok?'ok':'warn')+'">'+(ok?'Up to date':'Back up soon')+'</span></div>'+
   '<button class="btnPrimary wide" data-act="exportBackup">Back up now</button><button class="btnSecondary wide" data-act="importBackup">Restore from a backup file</button>'+
   '<div class="tipCard">'+ic('clock')+'<span>'+(window.RK_NATIVE?'Saved to Documents/ReceiptKeeper/Backups. ':'')+'Restoring skips bills already in your Vault, so it’s safe to run twice.</span></div></div>';
}
function keysScreen(){
  var k=window.RK_key,o=window.RK_ocrKey;
  if(!k)return top('Bill reading',{back:1})+'<div class="scr-body nopad setBody"><div class="heroCard blue">'+ic('spark')+'<b>Read by Claude</b><p>In this web version, bills are read by Claude on your account. Nothing to set up.</p></div></div>';
  var od=o.isDefault(),kv=o.get(),mask=kv?kv.slice(0,3)+' •••• •••• '+kv.slice(-3):'';
  return top('Bill reading',{back:1})+'<div class="scr-body nopad setBody">'+
   '<p class="lead">Bills are read as soon as they’re scanned. Add your own free key to read faded or long bills more reliably.</p>'+
   '<div class="keyCard"><div class="kcHead"><span class="srIco" style="--cb:#D4E6F5;--cf:#2F6690">'+ic('spark')+'</span><span class="srTxt"><b>OCR.space key</b><small>Free · reads tables and thermal print</small></span><span class="statusPill ok">'+(od?'Built-in':'Active')+'</span></div>'+
     '<div class="keyMask">'+ic('lock')+'<span>'+esc(mask)+'</span></div>'+
     '<input class="fieldBox" id="ocrKey" type="password" autocomplete="off" placeholder="Paste your own OCR.space key">'+
     '<div class="btnRow"><button class="btnSecondary" data-act="saveOcrKey">'+(od?'Use my key':'Replace key')+'</button>'+(od?'':'<button class="btnDanger" data-act="clearOcrKey">Remove</button>')+'</div></div>'+
   '<div class="keyCard"><div class="kcHead"><span class="srIco" style="--cb:#E2DDF7;--cf:#5B4BB7">'+ic('spark')+'</span><span class="srTxt"><b>Claude key</b><small>Optional · best for messy or handwritten bills</small></span>'+(k.get()?'<span class="statusPill ok">Active</span>':'')+'</div>'+
     '<input class="fieldBox" id="apiKey" type="password" autocomplete="off" placeholder="'+(k.get()?'•••• saved — paste to replace':'Paste your API key (sk-ant-…)')+'">'+
     '<div class="btnRow"><button class="btnPrimary" data-act="saveKey">Save key</button>'+(k.get()?'<button class="btnDanger" data-act="clearKey">Remove</button>':'')+'</div></div>'+
   '<div class="tipCard">'+ic('lock')+'<span>Keys are stored only on this phone. Get a Claude key at console.anthropic.com.</span></div></div>';
}

/* ---------- Onboarding ---------- */
var OB=[
  {t:'Every bill,<br>safe in one vault.',p:'Scan paper receipts, get clean PDFs, and find any bill in seconds — sorted for you.',cta:'Get started'},
  {t:'Point. Scan.<br>Done.',p:'The scanner fires only when a bill is in view, crops it on its own and reads the shop, date and amount.',cta:'Next'},
  {t:'Sorted before<br>you even look.',p:'Every bill lands in the right category and folder. Search by shop, date or amount — or browse by day on the calendar.',cta:'Next'},
  {t:'Two quick permissions',p:'Receipt Keeper works fully offline. Here is exactly what it needs and why.',cta:'Allow & start scanning'}];
function obArt(i){
  if(i===0)return '<div class="obArt a0"><div class="obStack"><div class="obCard c1" style="--cb:#F9D9C4;--cf:#C0602E">'+ic('bag')+'<b>Lifestyle</b><span>₹3,499</span></div><div class="obCard c2" style="--cb:#F6D5EC;--cf:#A23B8A">'+ic('cup')+'<b>Cafe Coffee Day</b><span>₹320</span></div><div class="obCard c3" style="--cb:#E2DDF7;--cf:#5B4BB7">'+ic('pulse')+'<b>Apollo Pharmacy</b><span>₹242</span></div><span class="obTick">'+ic('check')+'</span></div></div>';
  if(i===1)return '<div class="obArt a1"><div class="obPhone"><div class="obPaper"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><b class="cn tl"></b><b class="cn tr"></b><b class="cn bl"></b><b class="cn br"></b><span class="obBeam"></span></div>'+
    '<div class="obChips"><span style="--cb:#F9D9C4">Thermal ink fixed</span><span style="--cb:#E3EDC4">Long receipts</span><span style="--cb:#D4E6F5">4 bills at once</span></div></div>';
  if(i===2)return '<div class="obArt a2"><div class="obTiles">'+[['Shopping','4 bills'],['Dining','9 bills'],['Groceries','6 bills'],['Health','2 bills']].map(function(t,k){return '<div class="obTile" style="'+catVars(t[0])+';animation-delay:'+(k*90)+'ms"><span class="ctIco">'+ic(cc(t[0])[2])+'</span><b>'+catLabel(t[0])+'</b><small>'+t[1]+'</small></div>';}).join('')+'</div>'+
    '<div class="obTog"><span class="viewTog demo"><button tabindex="-1">'+ic('cal')+'</button><button tabindex="-1">'+ic('list')+'</button></span><small>Switch list / calendar anytime</small></div></div>';
  return '<div class="obArt a3"><div class="obHero"><span class="obShield">'+ic('shield')+'</span><span class="obOrb o1" style="--cb:#F9D9C4;--cf:#C0602E">'+ic('cam')+'</span><span class="obOrb o2" style="--cb:#D4E6F5;--cf:#2F6690">'+ic('img')+'</span><span class="obOrb o3" style="--cb:#E2DDF7;--cf:#5B4BB7">'+ic('lock')+'</span></div></div>';
}
function obPerms(){return '<div class="permList">'+[['cam','#F9D9C4','#C0602E','Camera','Only while the scanner is open, to read your bills.'],['img','#D4E6F5','#2F6690','Photos & files','To import bill photos and save PDFs to your phone.'],['lock','#E2DDF7','#5B4BB7','Stays on this phone','No sign-up. Bills are never uploaded to our servers.']]
    .map(function(r,k){return '<div class="permRow" style="animation-delay:'+(160+k*80)+'ms"><span class="srIco" style="--cb:'+r[1]+';--cf:'+r[2]+'">'+ic(r[0])+'</span><span class="srTxt"><b>'+r[3]+'</b><small>'+r[4]+'</small></span></div>';}).join('')+'</div>';}
function onboardScreen(){
  var i=S.route.params.i||0,o=OB[i];
  return '<div class="ob s'+i+'" id="ob">'+
    '<header class="obHead">'+(i>0?'<button class="iconBtn obBack" data-act="obPrev" aria-label="Back">'+ic('back')+'</button>':'<span class="obHeadSp"></span>')+
      '<span class="obStep">'+(i+1)+' of 4</span>'+(i<3?'<button class="obSkip" data-act="obSkip">Skip</button>':'<span class="obHeadSp"></span>')+'</header>'+
    '<main class="obMain">'+obArt(i)+'<div class="obText"><h1>'+o.t+'</h1><p>'+o.p+'</p></div>'+(i===3?obPerms():'')+'</main>'+
    '<footer class="obFoot"><div class="obDots" aria-hidden="true">'+[0,1,2,3].map(function(k){return '<i class="'+(k===i?'on':'')+'"></i>';}).join('')+'</div>'+
      '<button class="btnYellow wide" data-act="obNext">'+o.cta+'</button>'+
      '<div class="obAlt">'+(i===0?'<button class="linkBtn strong" data-act="obRestore">Restore from a backup</button>':i===3?'<button class="linkBtn strong" data-act="obDone">Not now</button>':'')+'</div></footer></div>';
}
function finishOnboard(){S.onboarded=true;DB.setMeta('onboarded',true).catch(function(){});S.hist=[];S.navDir='fade';S.route={name:'vault',params:{}};}

/* ---------- PDF viewer ---------- */
function pdfScreen(){
  var b=billById(S.route.params.id);if(!b)return top('PDF',{back:1})+'<div class="scr-body">'+emptyBlock({ic:'alert',t:'This bill was deleted',p:''})+'</div>';
  return '<div class="pdfTopD"><button class="iconBtn" data-act="back" aria-label="Back">'+ic('back')+'</button><div class="ptTxt"><b>'+esc(pdfFileName(b))+'</b><span id="pdfMeta">Rendering…</span></div></div>'+
    '<div class="scr-body nopad pdfBody"><div class="pdfPages" id="pdfPages"><div class="pdfWait"><i></i>Building your PDF…</div></div></div>'+
    '<div class="pdfBar"><button data-act="sharePdf">'+ic('download')+'<span>Download</span></button><button data-act="shareApp">'+ic('share')+'<span>Share</span></button><button data-act="copyText">'+ic('copy')+'<span>Copy text</span></button></div>';
}
function renderPdfPages(b){
  var host=$('#pdfPages');if(!host)return;
  ensurePdf(b).then(function(pdf){S.pdfSize=pdf.size;return Promise.all([getPdfjs(),readBuf(pdf)]);}).then(function(r){return r[0].getDocument({data:r[1],isEvalSupported:false}).promise;}).then(function(doc){
    if($('#pdfPages')!==host)return;host.innerHTML='';var m=$('#pdfMeta');if(m)m.textContent=doc.numPages+' page'+(doc.numPages>1?'s':'')+' · '+Math.max(1,Math.round((S.pdfSize||0)/1024))+' KB';
    var chain=Promise.resolve();
    for(var i=1;i<=doc.numPages;i++)(function(i){chain=chain.then(function(){return doc.getPage(i).then(function(pg){
      var w=host.clientWidth||280,dpr=Math.min(2.5,window.devicePixelRatio||1),v0=pg.getViewport({scale:1}),v=pg.getViewport({scale:w*dpr/v0.width});
      var c=document.createElement('canvas');c.width=v.width;c.height=v.height;c.setAttribute('aria-label','PDF page '+i);c.className='rise';host.appendChild(c);
      return pg.render({canvasContext:c.getContext('2d'),viewport:v}).promise;});});})(i);
    return chain;
  }).catch(function(){if($('#pdfPages')===host)host.innerHTML='<div class="pdfWait err">Couldn’t show the PDF here. Use Download instead.</div>';var m=$('#pdfMeta');if(m)m.textContent='Preview unavailable';});
}

/* ---------- Scanner additions: tips, camera-off sheet ---------- */
var _scannerScreen=scannerScreen;
scannerScreen=function(){
  var h=_scannerScreen();
  h=h.replace(/<div class="scNoCam"[\s\S]*?<\/div><\/div>/,'<div class="scNoCam" id="scNoCam" hidden><span class="ncIco">'+ic('camoff')+'</span><b id="scNoCamT">Live camera isn’t available</b><span id="scNoCamWhy">Take a photo instead. The scan clean-up still runs.</span>'+
    '<div class="scNoCamBtns"><button class="btnYellow" id="ncMain" data-act="shootFallback">Take photo</button><button class="btnSecondary" data-act="pick" data-a="image">Import a photo instead</button></div></div>');
  return h.replace('<div class="scanBottom">','<div class="scTips" id="scTips" hidden><b>Try this</b><ol><li>Put the bill on a darker surface</li><li>Add light or turn on the flash</li><li>Hold steady and fit all 4 corners</li></ol></div><div class="scanBottom">');
}
var _noCam=noCam;
noCam=function(){
  _noCam();var n=$('#scNoCam');if(!n||n.hidden)return;
  if(SC.err==='NotAllowedError'){$('#scNoCamT').textContent='Camera is off';
    $('#scNoCamWhy').textContent='We only use it while this scanner is open. Turn it on in Settings → Apps → Receipt Keeper → Permissions.';
    var mb=$('#ncMain');if(mb){mb.textContent=window.RK_openSettings?'Open settings':'Try again';mb.dataset.act=window.RK_openSettings?'openSettings':'camRetry';}}
}
var _startScanner=startScanner,_stopScanner=stopScanner;
startScanner=function(){_startScanner();clearInterval(SC.tipT);SC.tipT=setInterval(function(){var t=$('#scTips'),p=$('#scanHint');if(!t){clearInterval(SC.tipT);return;}
  var show=(SC.miss||0)>26&&SC.mode!=='long'&&SC.ok!==false;if(t.hidden===show)t.hidden=!show;if(p)p.classList.toggle('warn',show);if(p)p.classList.toggle('found',!!SC.box);},250);}
stopScanner=function(){clearInterval(SC.tipT);_stopScanner();}

/* ---------- toasts with tone + action ---------- */
function toast(m,o){o=o||{};var t=$('#toast');if(!t)return;
  var tone=o.tone||(/couldn|can’t|can't|isn't|isn’t|doesn|blocked|error|failed|full|rejected|cross over/i.test(m)?'err':/offline|permission|paste|enter a|give the|pick an|should|no bill|limit/i.test(m)?'warn':'ok');
  t.className='toast '+tone;t.innerHTML='<i class="tIco">'+ic(tone==='err'?'alert':tone==='warn'?'info':'check')+'</i><span>'+esc(m)+'</span>'+(o.action?'<button class="tAct">'+esc(o.action.label)+'</button>':'');
  S.toastAct=o.action||null;void t.offsetWidth;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show');S.toastAct=null;},o.ms||(o.action?5000:3000));}

/* ---------- overlays (sheets + dialogs) ---------- */
function renderOverlay(){
  var o=$('#overlay'),h='';
  var fab=$('#fab');if(fab)fab.classList.toggle('open',!!(S.sheet&&S.sheet.t==='picker'));
  if(S.sheet){var s=S.sheet,asDlg=s.t==='rename'||s.t==='renameFolder';
    var en=s.t!==S.lastSheet?' enter':'';S.lastSheet=s.t;
    h+='<button class="backdrop open'+en+'" data-act="sheetClose" aria-label="Close"></button><div class="sheet open'+en+(asDlg?' asDialog':'')+(s.t==='picker'?' picker':'')+'" role="dialog" aria-modal="true">'+(asDlg?'':'<div class="sheetHandle"></div>');
    if(s.t==='picker'){
      h+='<h4>Add a bill</h4><p class="small">Scan paper, or bring in what you already have.</p><div class="pickerGrid">'+
       [['goCamera','','cam','Camera scan','Auto-detects every bill','#F9D9C4','#C0602E'],['pick','image','img','Image','From your gallery','#E3EDC4','#5B6B1E'],['pick','file','file','File / PDF','E-bills and invoices','#F6D5EC','#A23B8A'],['pick','link','sms','Link / SMS','Paste the bill text','#D4E6F5','#2F6690']]
       .map(function(p,k){return '<button class="pickerBtn" data-act="'+p[0]+'" data-a="'+p[1]+'" style="--pb:'+p[5]+';--pf:'+p[6]+';animation-delay:'+(60+k*45)+'ms"><span class="pkIco">'+ic(p[2])+'</span><b>'+p[3]+'</b><small>'+p[4]+'</small></button>';}).join('')+'</div>'+
       '<button class="menuRow plain" data-act="manual">'+ic('edit')+'<span><b>Enter manually</b></span>'+ic('right','chevR')+'</button>';
    }else if(s.t==='link'){
      h+='<h4>Paste a bill</h4><p class="small">An e-bill link’s text, an SMS or a UPI message. We pull out the shop, amount and date.</p>'+
       '<textarea class="pasteBox" id="pasteBox" placeholder="e.g. Rs.320.00 spent at CAFE COFFEE DAY on 23-09-26 via UPI…" aria-label="Bill text">'+esc(s.v||'')+'</textarea>'+(s.err?'<p class="err">'+esc(s.err)+'</p>':'')+
       '<div class="tipCard">'+ic('spark')+'<span>No photo? A clean PDF is made from the text.</span></div>'+
       '<div class="btnRow"><button class="btnSecondary" data-act="sheetClose">Cancel</button><button class="btnPrimary" data-act="readText">Read & review</button></div>';
    }else if(s.t==='catPick'){
      var one=s.one?billById(s.one):null;
      h+='<h4>'+(one?'Category for “'+esc(displayName(one))+'”':'Set category for '+S.sel.size+' bill'+(S.sel.size===1?'':'s'))+'</h4>'+(one?'<p class="small">Future bills from this shop go here too. Past ones stay put.</p>':'')+
       '<div class="catPick big">'+CATS.map(function(c){return '<button class="cp'+(one&&one.category===c?' on':'')+'" style="'+catVars(c)+'" data-act="selCatSet" data-a="'+c+'">'+ic(cc(c)[2])+esc(catLabel(c))+'</button>';}).join('')+'</div>';
    }else if(s.t==='billMenu'){var bm=billById(s.id);
      h+='<div class="menuHead">'+(bm?catIco(bm.category):'')+'<span><b>'+esc(bm?displayName(bm):'Bill')+'</b><small>'+(bm?esc(money(bm)+' · '+catLabel(bm.category)+' · '+fmtDate(bm.date)):'')+'</small></span></div><div class="menuList">'+
        [['renameOpen','pen','Rename file',bm?pdfFileName(bm):'','#F9D9C4','#C0602E'],['editOpen','tag','Edit details','Category, amount, bill type','#E3EDC4','#5B6B1E'],['rescan','rescan','Rescan bill','Replace the photo and PDF','#D4E6F5','#2F6690'],['moveOpen','move','Move to folder',bm&&folderName(bm.folder)?'Currently: '+folderName(bm.folder):'Currently: None','#F6D5EC','#A23B8A'],['sharePdf','share','Share PDF','Save or send the PDF','#E2DDF7','#5B4BB7']].map(function(m){
          return '<button class="menuRow" data-act="'+m[0]+'" data-id="'+esc(s.id)+'"><span class="srIco" style="--cb:'+m[4]+';--cf:'+m[5]+'">'+ic(m[1])+'</span><span><b>'+m[2]+'</b>'+(m[3]?'<small>'+esc(m[3])+'</small>':'')+'</span></button>';}).join('')+'</div>'+
        '<button class="menuRow danger" data-act="delBill" data-id="'+esc(s.id)+'"><span class="srIco" style="--cb:#F8C9C4;--cf:#C0392B">'+ic('trash')+'</span><span><b>Delete bill</b><small>Removes the photo and PDF from this phone</small></span></button>';
    }else if(s.t==='folderMenu'){var fm=S.folders.find(function(x){return x.id===s.id;});
      h+='<h4>'+esc(fm?fm.name:'Folder')+'</h4><div class="menuList">'+
        '<button class="menuRow" data-act="renameFolderOpen" data-id="'+esc(s.id)+'"><span class="srIco" style="--cb:#F9D9C4;--cf:#C0602E">'+ic('pen')+'</span><span><b>Rename folder</b></span></button>'+
        '<button class="menuRow" data-act="exportPdf" data-a="col"><span class="srIco" style="--cb:#E2DDF7;--cf:#5B4BB7">'+ic('share')+'</span><span><b>Export folder as PDF</b><small>All bills, grouped by category</small></span></button></div>'+
        '<button class="menuRow danger" data-act="delFolder" data-id="'+esc(s.id)+'"><span class="srIco" style="--cb:#F8C9C4;--cf:#C0392B">'+ic('trash')+'</span><span><b>Delete folder</b><small>Bills inside stay in your Vault</small></span></button>';
    }else if(asDlg){var isF=s.t==='renameFolder',rb=isF?S.folders.find(function(x){return x.id===s.id;}):billById(s.id);
      h+='<h4>'+(isF?'Rename folder':'Rename file')+'</h4><p class="small">'+(isF?'Bills inside keep their categories.':'This is the name of the PDF when you share it.')+'</p><div class="renameBox"><input id="renameInput" maxlength="60" value="'+esc(rb?(isF?rb.name:displayName(rb)):'')+'" aria-label="New name" autocomplete="off">'+(isF?'':'<span>.pdf</span>')+'</div>'+
        (isF?'':'<p class="small mono" id="renamePrev">'+esc(rb?pdfFileName(rb):'')+'</p>')+
        '<div class="btnRow"><button class="btnSecondary" data-act="sheetClose">Cancel</button><button class="btnPrimary" data-act="renameSave" data-id="'+esc(s.id)+'">Save</button></div>';
    }else if(s.t==='saveIn'){
      var move=s.ctx==='move'||s.ctx==='moveMany',cur=s.ctx==='move'?(billById(S.route.params.id)||{}).folder:null,nm=s.ctx==='move'?displayName(billById(S.route.params.id)||{vendor:'bill'}):'';
      h+='<h4>'+(s.ctx==='moveMany'?'Move '+S.sel.size+' bill'+(S.sel.size===1?'':'s')+' to':move?'Move “'+esc(nm)+'” to':'Save in')+'</h4><p class="small">A bill lives in one folder. Its category stays the same.</p><div class="pickList">';
      if(move)h+='<button class="folderPickRow'+(!cur?' on':'')+'" data-act="saveTo" data-id=""><i class="fpSq" style="background:#EFEADF"></i><span><b>No folder</b><small>Keep in Vault only</small></span><em></em></button>';
      h+=S.folders.map(function(f){var n=S.bills.filter(function(b){return b.folder===f.id;}).length;return '<button class="folderPickRow'+(cur===f.id?' on':'')+'" data-act="saveTo" data-id="'+esc(f.id)+'"><i class="fpSq" style="background:'+fcol(f)[0]+'"></i><span><b>'+esc(f.name)+'</b><small>'+n+' bill'+(n===1?'':'s')+'</small></span><em></em></button>';}).join('')+'</div>';
      h+=s.newOpen?'<div class="newFolderRow"><input id="newFolderInput" placeholder="New folder name" maxlength="40" aria-label="New folder name" autocomplete="off"><button class="btnPrimary" data-act="newFolderCreate">'+(move?'Create & move':'Create & save')+'</button></div>':
        '<button class="dashRow" data-act="newFolderToggle">'+ic('plus')+'New folder</button>';
    }else if(s.t==='privacy'){
      var ns=S.bills.filter(function(b){return b.sample;}).length;
      h+='<h4>Data & privacy</h4><p class="small">Bills, images and folders are stored only '+(window.RK_NATIVE?'on this phone':'in this browser')+'. When you add a bill, its photo or text is sent to '+(window.RK_NATIVE?'OCR.space (or Claude, if you added a key)':'Claude on your account')+' to read the shop, amount, date and items. Nothing else leaves this device.</p>'+
       '<div class="stack"><button class="btnSecondary" data-act="goBackup">Backup & restore</button>'+
       (ns?'<button class="btnSecondary" data-act="removeSamples">Remove '+ns+' sample bills</button>':'<button class="btnSecondary" data-act="addSamples">Add sample bills</button>')+
       '<button class="btnDanger wide" data-act="wipe">Delete all data on this device</button></div>';
    }
    h+='</div>';
  }
  if(!S.sheet)S.lastSheet=null;
  if(S.dialog){var d=S.dialog,t='';var den=d.t!==S.lastDialog?' enter':'';S.lastDialog=d.t;
    var two=function(a,al,b,bl,cls){return '<div class="drow"><button class="diff" data-act="'+a+'"'+(d.id?' data-id="'+esc(d.id)+'"':'')+'>'+al+'</button><button class="'+(cls||'same')+'" data-act="'+b+'"'+(d.id?' data-id="'+esc(d.id)+'"':'')+'>'+bl+'</button></div>';};
    var danger=function(){return '<span class="dIco">'+ic('alert')+'</span>';};
    if(d.t==='dup'){var e=billById(d.id);t='<span class="dIco y">'+ic('copy')+'</span><h4>Possible duplicate</h4><p>This looks like <b>'+esc(e?e.vendor:'a bill')+' — '+esc(e?money(e):'')+'</b>, saved '+esc(e?fmtDate(e.date):'')+'. Same bill, or a different one?</p><div class="drow"><button class="diff" data-act="dupDiff">Different</button><button class="same" data-act="dupSame">Same bill</button></div>';}
    else if(d.t==='nodup')t='<span class="dIco g">'+ic('check')+'</span><h4>No duplicates found</h4><p>Nothing in your Vault matches this shop, amount and date.</p><div class="drow"><button class="same" data-act="dialogClose">OK</button></div>';
    else if(d.t==='discard')t=danger()+'<h4>Discard this bill?</h4><p>Nothing has been saved yet.</p>'+two('dialogClose','Keep editing','discardYes','Discard','dng');
    else if(d.t==='delBill'){var db=billById(d.id);t=danger()+'<h4>Delete this bill?</h4><p>'+(db?esc(displayName(db))+' · '+esc(money(db))+'. ':'')+'The photo and PDF are removed from this phone. You’ll get 5 seconds to undo.</p>'+two('dialogClose','Keep','delBillYes','Delete','dng');}
    else if(d.t==='delFolder')t=danger()+'<h4>Delete this folder?</h4><p>The bills inside stay in your Vault. Only the folder goes.</p>'+two('dialogClose','Keep','delFolderYes','Delete','dng');
    else if(d.t==='delMany')t=danger()+'<h4>Delete '+S.sel.size+' bill'+(S.sel.size===1?'':'s')+'?</h4><p>They and their PDFs are removed from this phone. You’ll get 5 seconds to undo.</p>'+two('dialogClose','Keep','delManyYes','Delete','dng');
    else if(d.t==='wipe')t=danger()+'<h4>Delete everything?</h4><p>All bills, folders and images on this device are erased. Back up first if you may need them.</p>'+two('dialogClose','Cancel','wipeYes','Delete all','dng');
    else if(d.t==='newFolder')t='<h4>New folder</h4><p>For trips, claims or anything you share together.</p><div class="renameBox"><input id="nfName" maxlength="40" placeholder="e.g. Office claims" aria-label="Folder name" autocomplete="off" value="'+esc(d.v||'')+'"></div>'+
      '<div class="secLbl">Colour</div><div class="swatches">'+FCOL.map(function(c,k){return '<button class="sw'+(d.color===k?' on':'')+'" style="background:'+c[0]+'" data-act="nfColor" data-a="'+k+'" aria-label="Colour '+(k+1)+'"></button>';}).join('')+'</div>'+
      '<div class="drow"><button class="diff" data-act="dialogClose">Cancel</button><button class="same" data-act="nfCreate">Create</button></div>';
    h+='<button class="backdrop open'+den+'" style="z-index:10" data-act="dialogClose" aria-label="Close"></button><div class="dialog open'+den+'" role="alertdialog" aria-modal="true">'+t+'</div>';
  }
  if(!S.dialog)S.lastDialog=null;
  o.innerHTML=h;var ri=$('#renameInput');if(ri&&S.sheet&&S.sheet.fresh){S.sheet.fresh=false;setTimeout(function(){ri.focus();ri.select();},60);}
  var f=$('#newFolderInput');if(f&&!ri)f.focus();var pb=$('#pasteBox');if(pb&&!pb.value)pb.focus();var nf=$('#nfName');if(nf&&S.dialog&&S.dialog.fresh){S.dialog.fresh=false;setTimeout(function(){nf.focus();},80);}
}

/* ---------- render ---------- */
function render(){
  var r=S.route,html='',tabs=false,cur=null,dark=false;
  switch(r.name){
    case 'onboard':html=onboardScreen();break;
    case 'zero':case 'vault':html=vaultScreen();tabs=true;cur='vault';break;
    case 'search':html=searchScreen();tabs=true;cur='vault';break;
    case 'folders':html=foldersScreen();tabs=true;cur='folders';break;
    case 'folder':html=folderScreen();tabs=true;cur='folders';break;
    case 'cat':html=catScreen();tabs=true;cur='folders';break;
    case 'edit':html=editScreen();break;
    case 'camera':html=scannerScreen();dark=true;break;
    case 'scanfx':html=fxScreen();dark=true;break;
    case 'confirm':html=confirmScreen();break;
    case 'saved':html=savedScreen();break;
    case 'bill':html=billScreen();break;
    case 'account':html=accountScreen();break;
    case 'backup':html=backupScreen();break;
    case 'keys':html=keysScreen();break;
    case 'pdf':html=pdfScreen();dark=true;break;
    case 'multi':html=multiScreen();break;
    case 'crop':html=cropScreen();dark=true;break;
  }
  var v=$('#view');v.innerHTML=html;v.classList.toggle('hasTabs',tabs);v.classList.toggle('dark',dark);v.dataset.route=r.name;
  var ss=$('#screenStack');if(ss)ss.classList.toggle('darkScr',dark);document.documentElement.classList.toggle('darkUI',dark);if(window.RK_barStyle)window.RK_barStyle(dark);
  var rk=r.name+'|'+JSON.stringify(r.params||{});
  if(rk!==S.lastKey){S.lastKey=rk;var dir=S.navDir||'fade';if(r.name==='onboard')dir=S.navDir||'push';v.classList.remove('nav-push','nav-pop','nav-fade');void v.offsetWidth;v.classList.add('nav-'+dir);stagger(v);}
  S.navDir=null;
  var tb=$('#tabbar'),fb=$('#fab');
  if(tabs!==!tb.hidden){if(tabs){tb.hidden=false;fb.hidden=false;tb.classList.remove('hideAnim');fb.classList.remove('hideAnim');void tb.offsetWidth;tb.classList.add('showAnim');fb.classList.add('showAnim');}else{tb.hidden=true;fb.hidden=true;}}
  document.querySelectorAll('#tabbar button').forEach(function(b){b.classList.toggle('active',b.dataset.tab===cur);b.setAttribute('aria-current',b.dataset.tab===cur?'page':'false');});
  var k=metaKey(),m=META[k]||[k,''];var ct=$('#crumbTitle');if(ct){ct.textContent=S.sheet&&S.sheet.t==='picker'?'Add a bill':m[0];$('#noteText').textContent=m[1];$('#howTo').innerHTML=HOW[k]||'';}
  if(r.name==='camera')startScanner();else if(SC.stream||SC.raf)stopScanner();
  if(r.name==='scanfx')paintFx();
  if(r.name==='crop')paintCrop();
  if(r.name==='search'){runSearch();if(S.searchFocus){S.searchFocus=false;var q=$('#q');if(q)setTimeout(function(){q.focus();},80);}}
  if(r.name==='confirm')syncSave();if(r.name==='pdf')renderPdfPages(billById(r.params.id)||{});
  renderOverlay();
}
function metaKey(){var r=S.route.name;
  if(r==='vault')return !S.bills.length?'zero':(S.view==='cal'?'vault-calendar':'vault');
  return {zero:'zero',search:'search',folders:'folders',folder:'folder-detail',camera:'capture-camera',confirm:'capture-confirm',multi:'capture-confirm',crop:'capture-confirm',scanfx:'capture-camera',saved:'capture-saved',bill:'bill-detail',edit:'bill-detail',cat:'folder-detail',account:'account',pdf:'pdf-view'}[r]||r;}
function stagger(root){var els=root.querySelectorAll('.billRow,.folderCard,.catTile,.field,.setRow,.infoRow,.quickActs button,.statRow>div,.keyCard,.emptyBlk,.calDay.has');for(var i=0;i<els.length&&i<22;i++){els[i].style.animationDelay=(60+i*24)+'ms';els[i].classList.add('rise');}}

/* ---------- actions ---------- */
(function(){
  var _goCamera=A.goCamera,_fab=A.fab,_delBillYes=A.delBillYes,_selCatSet=A.selCatSet,_scanMode=A.scanMode,_sheetClose=A.sheetClose,_open=A.open,_tab=A.tab,_saveTo=A.saveTo;
  A.goCamera=function(d,el){
    var host=$('#screenStack');
    if(el&&host&&!reduced()){var r=el.getBoundingClientRect(),hr=host.getBoundingClientRect(),cx=r.left+r.width/2-hr.left,cy=r.top+r.height/2-hr.top;
      var rv=document.createElement('div');rv.className='reveal';rv.style.setProperty('--cx',cx+'px');rv.style.setProperty('--cy',cy+'px');rv.innerHTML='<span>Opening camera…</span>';host.appendChild(rv);
      void rv.offsetWidth;rv.classList.add('go');
      setTimeout(function(){_goCamera();},330);setTimeout(function(){rv.classList.add('out');},560);setTimeout(function(){rv.remove();},900);return;}
    _goCamera();};
  A.fab=function(){if(S.sheet&&S.sheet.t==='picker'){A.sheetClose();return;}try{navigator.vibrate&&navigator.vibrate(8);}catch(e){}_fab();var f=$('#fab');if(f){f.classList.remove('pulse');void f.offsetWidth;f.classList.add('pulse');}};
  A.sheetClose=function(){var f=$('#fab');if(f)f.classList.remove('open');_sheetClose();};
  A.goSearch=function(){S.searchFocus=true;go('search',{},{dir:'fade'});};
  A.recentQ=function(d){S.search.q=d.a;var q=$('#q');if(q)q.value=d.a;runSearch();};
  A.clearFilters=function(){S.search.cat='';S.search.range='';S.search.folder='';render();};
  A.searchAll=function(){S.search={q:'',cat:'',range:'',folder:''};render();};
  A.open=function(d){if(!S.selMode&&S.route.name==='search'){var q=S.search.q.trim();if(q.length>1){S.recent=[q].concat(S.recent.filter(function(r){return r.toLowerCase()!==q.toLowerCase();})).slice(0,5);DB.setMeta('recent',S.recent).catch(function(){});}}_open(d);};
  A.tab=function(d){if(S.sheet){S.sheet=null;}_tab(d);};
  A.fqFocus=function(){var q=$('#fq');if(q)q.focus();};
  A.colM=function(d){S.col.m=d.a;render();};
  A.day=function(d){S.openDay=d.a;render();};
  A.seg=function(d){S.view=d.a;render();};
  A.moveHere=function(){tab('vault');toast('Long-press a bill, then tap Move.',{tone:'warn'});};
  A.scanInto=function(d,el){S.scanFolder=d.id;A.goCamera(d,el);};
  A.catPickOne=function(){S.sheet={t:'catPick',one:S.route.params.id};renderOverlay();};
  A.selCatSet=function(d){var s=S.sheet;if(s&&s.one){var b=billById(s.one);S.sheet=null;if(!b){renderOverlay();return;}b.category=d.a;b.pdfStale=true;S.rules[rkey(b.vendor)]=d.a;
      persist(function(){return DB.put(b);}).then(saveMeta).then(function(){render();toast('Moved to '+catLabel(d.a)+'. Future bills from '+b.vendor+' go there too.');ensurePdf(b).catch(function(){});});return;}
    _selCatSet(d);};
  A.eCat=function(d){var h=$('#e_category');if(h)h.value=d.a;document.querySelectorAll('#view .catPick .cp').forEach(function(b){b.classList.toggle('on',b.dataset.a===d.a);});};
  A.editSave=function(d){var b=billById(d.id);if(!b)return;var g=function(k){var el=$('#e_'+k);return el?(el.value||'').trim():'';};
    var amt=g('amount').replace(/,/g,''),a=amt===''?null:parseFloat(amt);if(amt!==''&&!isFinite(a)){toast('Amount should be a number, like 1249.50');return;}
    var cat=g('category'),oldCat=b.category;
    Object.assign(b,{vendor:g('vendor')||b.vendor,type:g('type'),amount:a,date:validDate(g('date'))||b.date,category:CATS.indexOf(cat)>=0?cat:b.category,items:g('items'),folder:g('folder')||null,pdfStale:true});
    if(b.category!==oldCat)S.rules[rkey(b.vendor)]=b.category;
    persist(function(){return DB.put(b);}).then(saveMeta).then(function(){back();toast('Changes saved. PDF updated.');ensurePdf(b).then(function(){if(S.route.name==='bill')render();},function(){});});};
  A.delBillYes=function(d){S.dialog=null;var gone=billById(d.id);if(!gone){renderOverlay();return;}
    persist(function(){return DB.del(d.id);}).then(function(ok){if(!ok)return;S.bills=S.bills.filter(function(b){return b.id!==d.id;});back();
      var undone=false,path=gone.pdfPath;
      toast('Bill deleted',{tone:'ok',action:{label:'Undo',fn:function(){undone=true;persist(function(){return DB.put(gone);}).then(function(){S.bills.push(gone);render();toast('Bill restored.');});}}});
      setTimeout(function(){if(!undone&&path&&window.RK_unstore)window.RK_unstore(path);},5600);});};
  A.delManyYes=function(){var L=selBills(),ids=new Set(L.map(function(b){return b.id;}));S.dialog=null;
    persist(function(){return Promise.all(L.map(function(b){return DB.del(b.id);}));}).then(function(){S.bills=S.bills.filter(function(b){return !ids.has(b.id);});exitSel(true);render();
      var undone=false;toast(L.length+' bill'+(L.length===1?'':'s')+' deleted',{tone:'ok',action:{label:'Undo',fn:function(){undone=true;persist(function(){return Promise.all(L.map(function(b){return DB.put(b);}));}).then(function(){L.forEach(function(b){S.bills.push(b);});render();toast('Restored.');});}}});
      setTimeout(function(){if(!undone&&window.RK_unstore)L.forEach(function(b){if(b.pdfPath)window.RK_unstore(b.pdfPath);});},5600);});};
  A.scanMode=function(d){var dr=S.draft;if(dr)dr.modeTouched=true;_scanMode(d);};
  A.newFolderOpen=function(){S.sheet=null;S.dialog={t:'newFolder',color:S.folders.length%FCOL.length,fresh:true};renderOverlay();};
  A.nfColor=function(d){var v=$('#nfName');S.dialog.v=v?v.value:'';S.dialog.color=+d.a;renderOverlay();};
  A.nfCreate=function(){var v=($('#nfName').value||'').trim();if(!v){toast('Give the folder a name.');return;}
    if(S.folders.some(function(f){return f.name.toLowerCase()===v.toLowerCase();})){toast('A folder with that name already exists.');return;}
    var f={id:uid(),name:v,color:S.dialog.color||0};S.folders.push(f);saveMeta();S.dialog=null;render();toast('Folder created.');};
  A.goBackup=function(){S.sheet=null;go('backup');};
  A.goKeys=function(){go('keys');};
  A.exportAll=function(){exportSet(sortedBills(),'All bills');};
  A.defView=function(d){S.prefs.defView=d.a;S.view=d.a;DB.setMeta('prefs',S.prefs).catch(function(){});render();};
  A.boostToggle=function(){S.prefs.boost=!S.prefs.boost;DB.setMeta('prefs',S.prefs).catch(function(){});render();toast(S.prefs.boost?'Thermal ink boost on.':'Boost off. Scans keep their original look.');};
  A.openSettings=function(){if(window.RK_openSettings)window.RK_openSettings().catch(function(){toast('Couldn’t open settings. Open Android Settings → Apps → Receipt Keeper.');});};
  A.camRetry=function(){SC.ok=null;SC.err='';SC.fellBack=false;render();};
  A.goOnboard=function(){S.hist=[];S.route={name:'onboard',params:{i:0}};S.navDir='fade';render();};
  A.obNext=function(){var i=S.route.params.i||0;if(i<3){S.navDir='push';S.route={name:'onboard',params:{i:i+1}};render();return;}
    var ask=window.RK_askCamera?window.RK_askCamera():Promise.resolve(true);
    ask.then(function(ok){finishOnboard();render();if(ok!==false)setTimeout(function(){A.goCamera();},250);else toast('Camera is off. You can still import photos and PDFs.',{tone:'warn'});},function(){finishOnboard();render();});};
  A.obPrev=function(){var i=S.route.params.i||0;if(i>0){S.navDir='pop';S.route={name:'onboard',params:{i:i-1}};render();}};
  A.obSkip=function(){S.navDir='push';S.route={name:'onboard',params:{i:3}};render();};
  A.obDone=function(){finishOnboard();render();};
  A.obRestore=function(){finishOnboard();render();$('#inBackup').click();};
  A.copyText=function(){var b=billById(S.route.params.id);if(!b)return;var t=billText(b);
    try{navigator.clipboard.writeText(t).then(function(){toast('Bill details copied.');},function(){toast('Copy is blocked here. Use Share instead.');});}catch(e){toast('Copy is blocked here. Use Share instead.');}};
  A.clearOcrKey=function(){window.RK_ocrKey.set(null).then(function(){render();toast('Back to the built-in key.');});};
  A.signIn=function(){go('backup');};
  A.saveTo=function(d){var ctx=S.sheet&&S.sheet.ctx;var sh=$('#overlay .sheet');if(sh)sh.querySelectorAll('.folderPickRow').forEach(function(r){r.classList.toggle('on',r.dataset.id===d.id);});
    setTimeout(function(){_saveTo(d);},ctx==='save'?0:160);};
})();
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#toast .tAct');if(b&&S.toastAct){var f=S.toastAct.fn;S.toastAct=null;$('#toast').classList.remove('show');f();}});
window.addEventListener('online',function(){if(/^(vault|folders)$/.test(S.route.name))render();toast('Back online.');});
window.addEventListener('offline',function(){if(/^(vault|folders)$/.test(S.route.name))render();toast('You’re offline — bills still save, reading waits.',{tone:'warn'});});
/* onboarding swipe */
(function(){var sx=null,sy=0;document.addEventListener('touchstart',function(e){if(S.route.name!=='onboard'||S.sheet||S.dialog)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
  document.addEventListener('touchend',function(e){if(sx==null)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)<50||Math.abs(dy)>Math.abs(dx))return;var i=S.route.params.i||0;
    if(dx<0&&i<3)A.obNext();else if(dx>0&&i>0)A.obPrev();},{passive:true});})();
/* boost preference feeds the scan clean-up */
var _regen=regen;
regen=function(d){if(S.prefs&&!S.prefs.boost&&d.mode==='scan'&&!d.modeTouched)d.mode='original';return _regen(d);}
/* bills scanned from inside a folder land in that folder */
var _commit=commit;
commit=function(){if(S.draft&&S.scanFolder&&!S.draft.folder&&!S.draft.replaceId)S.draft.folder=S.scanFolder;S.scanFolder=null;return _commit();}
var _back=window.RK_back;
window.RK_back=function(){if(S.route.name==='onboard'){var i=S.route.params.i||0;if(i>0){A.obPrev();return true;}return false;}return _back();};
var _enter=enter;
enter=function(screen){if(screen==='onboard'){showProto();A.goOnboard();return;}return _enter(screen);}
/* SMS / UPI messages: "spent at CAFE COFFEE DAY on …" names the shop */
var _parseBillText=parseBillText;
parseBillText=function(raw){var r=_parseBillText(raw);
  var m=String(raw||'').match(/(?:spent|paid|debited|purchase|txn|payment)[^\n]*?\b(?:at|to)\s+([A-Za-z][A-Za-z0-9&'.\- ]{2,40}?)(?=\s+(?:on|via|for|ref|upi|using|dated)\b|[.,\n]|$)/i);
  if(m&&r&&r.is_bill!==false){var v=m[1].trim();if(v===v.toUpperCase())v=v.toLowerCase().replace(/\b[a-z]/g,function(c){return c.toUpperCase();});
    r.vendor=v;if(r.confidence)r.confidence.vendor=0.8;
    var rule=S.rules[rkey(v)];if(rule){r.category=rule;if(r.confidence)r.confidence.category=1;}
    else for(var k=0;k<CAT_WORDS.length;k++){if(CAT_WORDS[k][1].test(v)){r.category=CAT_WORDS[k][0];if(r.confidence)r.confidence.category=0.85;break;}}}
  return r;};
