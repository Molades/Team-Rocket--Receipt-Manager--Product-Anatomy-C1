(function(){
'use strict';
var CATS=['Groceries','Shopping','Utilities','Travel','Dining','Services','Rent','Health','Other'];
var P={
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 6-5 8-5s6.5 1 8 5"/>',
  back:'<path d="M15 6l-6 6 6 6"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
  cam:'<path d="M4 8h4l2-3h4l2 3h4v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  img:'<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-4 4-2-2-5 5"/>',
  file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  link:'<path d="M9 15l6-6"/><path d="M8 11l-2 2a3.5 3.5 0 004.9 4.9l2-2"/><path d="M16 13l2-2a3.5 3.5 0 00-4.9-4.9l-2 2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', chev:'<path d="M6 9l6 6 6-6"/>',
  left:'<path d="M15 6l-6 6 6 6"/>', right:'<path d="M9 6l6 6-6 6"/>',
  check:'<path d="M5 13l4 4L19 7"/>', search:'<circle cx="10" cy="10" r="6"/><path d="M20 20l-5.5-5.5"/>',
  share:'<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><rect x="4" y="14" width="16" height="6" rx="1"/>',
  home:'<path d="M4 10l8-6 8 6"/><path d="M6 9v10h12V9"/><path d="M10 19v-5h4v5"/>'
};
P.more='<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>';
P.pen='<path d="M4 20l1-4L16 5l3 3L8 19z"/>';P.trash='<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>';P.move='<path d="M3 6h6l2 3h10v9H3z"/><path d="M10 14h6M13 11l3 3-3 3"/>';P.rescan='<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><path d="M7 12h10"/>';P.tag='<path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.5" cy="8.5" r="1.2"/>';
var CAT_LABEL={Dining:'Food & dining'};function catLabel(c){return CAT_LABEL[c]||c;}
var CAT_COLOR={Groceries:'#4F8A5B',Shopping:'#3D5A80',Utilities:'#B8860B',Travel:'#2E7D8C',Dining:'#C0602E',Services:'#7A5C99',Rent:'#8C5A3D',Health:'#B23A48',Other:'#7A7F85'};
function displayName(b){return b.title||b.vendor;}
function ic(n,c,st){return '<svg class="ic '+(c||'')+'"'+(st?' style="'+st+'"':'')+' viewBox="0 0 24 24" aria-hidden="true">'+P[n]+'</svg>';}
function $(s,r){return (r||document).querySelector(s);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function pad(n){return String(n).padStart(2,'0');}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function today(){return ymd(new Date());}
function pd(s){var a=String(s).split('-').map(Number);return new Date(a[0],a[1]-1,a[2]);}
function validDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return '';return ymd(pd(s))===s?s:'';}
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var MONL=['January','February','March','April','May','June','July','August','September','October','November','December'];
function fmtDate(s,full){var d=pd(s);return d.getDate()+' '+MON[d.getMonth()]+((full||d.getFullYear()!==new Date().getFullYear())?' '+d.getFullYear():'');}
function rel(s){var n=Math.round((pd(today())-pd(s))/864e5);if(n===0)return 'Today';if(n===1)return 'Yesterday';if(n>1&&n<7)return n+' days ago';return fmtDate(s);}
var SYM={INR:'₹',USD:'$',EUR:'€',GBP:'£'};
function sym(c){return SYM[c]||((c||'')+' ');}
function num(v){return Number(v).toLocaleString('en-IN',{maximumFractionDigits:2});}
function money(b){return b.amount==null?'—':sym(b.currency)+num(b.amount);}
function uid(){return (window.crypto&&crypto.randomUUID)?crypto.randomUUID():('b'+Date.now().toString(36)+Math.random().toString(36).slice(2,8));}
function rkey(v){return String(v||'').toLowerCase().trim();}

/* ---------------- storage: IndexedDB with in-memory fallback ---------------- */
var DB={db:null,mem:{bills:new Map(),meta:new Map()},
  open:function(){var self=this;return new Promise(function(res){
    try{var r=indexedDB.open('receipt-keeper',1);
      r.onupgradeneeded=function(){r.result.createObjectStore('bills',{keyPath:'id'});r.result.createObjectStore('meta');};
      r.onsuccess=function(){self.db=r.result;res();};r.onerror=function(){res();};r.onblocked=function(){res();};
    }catch(e){res();}});},
  tx:function(store,mode,fn){var self=this;return new Promise(function(res,rej){
    var t=self.db.transaction(store,mode),rq=fn(t.objectStore(store));
    t.oncomplete=function(){res(rq&&rq.result);};t.onerror=function(){rej(t.error);};t.onabort=function(){rej(t.error);};});},
  all:function(){return this.db?this.tx('bills','readonly',function(s){return s.getAll();}):Promise.resolve(Array.from(this.mem.bills.values()));},
  put:function(b){if(!this.db){this.mem.bills.set(b.id,b);return Promise.resolve();}return this.tx('bills','readwrite',function(s){return s.put(b);});},
  del:function(id){if(!this.db){this.mem.bills.delete(id);return Promise.resolve();}return this.tx('bills','readwrite',function(s){return s.delete(id);});},
  getMeta:function(k){if(!this.db)return Promise.resolve(this.mem.meta.get(k));return this.tx('meta','readonly',function(s){return s.get(k);});},
  setMeta:function(k,v){if(!this.db){this.mem.meta.set(k,v);return Promise.resolve();}return this.tx('meta','readwrite',function(s){return s.put(v,k);});},
  clear:function(){if(!this.db){this.mem.bills.clear();this.mem.meta.clear();return Promise.resolve();}
    var self=this;return this.tx('bills','readwrite',function(s){return s.clear();}).then(function(){return self.tx('meta','readwrite',function(s){return s.clear();});});}
};

var S={selMode:false,sel:new Set(),bills:[],folders:[],rules:{},lastBackup:null,seeded:false,persisted:false,
  route:{name:'vault',params:{}},hist:[],view:'list',chip:'All',
  month:{y:new Date().getFullYear(),m:new Date().getMonth()},openDay:null,
  sheet:null,dialog:null,draft:null,queue:[],batchTotal:0,batchDone:0,batchMode:false,camCount:0,lastThumb:null,
  ctl:null,savedWhere:'Vault',search:{q:'',cat:'',range:'',folder:''},bigImg:false};

function persist(fn){return Promise.resolve().then(fn).then(function(){return true;},function(){toast("Couldn't save to this browser. Storage may be full or blocked.");return false;});}
function saveMeta(){return persist(function(){return Promise.all([DB.setMeta('folders',S.folders),DB.setMeta('rules',S.rules),DB.setMeta('lastBackup',S.lastBackup),DB.setMeta('seeded',S.seeded)]);});}
function sortedBills(){return S.bills.slice().sort(function(a,b){return a.date<b.date?1:a.date>b.date?-1:(b.createdAt||0)-(a.createdAt||0);});}
function folderName(id){var f=S.folders.find(function(x){return x.id===id;});return f?f.name:null;}
function billById(id){return S.bills.find(function(b){return b.id===id;});}
var toastT;
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show');},3000);}

/* ---------------- spec notes (from the wireframe) ---------------- */
var META={
  "zero":["Zero state","Account creation is never a gate — capture works immediately, fully offline, anonymous, forever, except cross-device backup."],
  "vault":["Vault — List","Reverse-chronological home list with quick filter chips. List and Calendar are two views of the same tab, not separate tabs."],
  "vault-calendar":["Vault — Calendar","Bills shown as chips/dots on their date. Tapping a day expands inline before drilling into full detail."],
  "search":["Search","Fuzzy free-text + structured filters, combinable. Full-text fallback over raw OCR text (extraction_text) catches anything structured extraction missed."],
  "folders":["Folders — Grid","Manually created, Pinterest-board style. A bill sits in exactly one folder, or none — never duplicated across several."],
  "folder-detail":["Folder Detail","Folders are a display layer, not a retag — a bill's category is untouched by which folder it sits in."],
  "capture-picker":["Add a bill","One entry point, four sources — camera, image, PDF/file, or an expiring retailer link. All feed the same OCR pipeline."],
  "capture-camera":["Camera scan","Auto-crop on scan, then a thermal-friendly clean-up: shadows and yellowed paper are divided out and faded ink is darkened. Batch mode for scanning a pile of paper chits at once."],
  "capture-confirm":["Confirm & Save","High-confidence fields fill silently. Low-confidence fields fill but get a visible flag + an explicit ☐ Looks right — never passively accepted. Extraction failure never blocks the save."],
  "capture-saveIn":["Save in","Picking a folder here saves AND places the bill in one action. Most day-to-day bills skip this and use plain Save."],
  "capture-saved":["Saved","The backup nudge is honest, not a growth-hack banner: losing the phone with no account really does lose everything."],
  "pdf-view":["PDF view","Every saved bill becomes a one-bill A4 PDF: a details header (vendor, bill type, category, amount, date, items, folder) above the enhanced scan. Filenames lead with category and date so exports sort themselves."],
  "bill-detail":["Bill Detail","One shared screen reached from Vault, Search, Folders, and post-Capture. Editing category here applies going forward only — past bills from this vendor are never silently retagged."],
  "account":["Account","Sign-in is optional forever. Re-prompted only at trust-forcing moments — a second device, a saved-bill threshold, or before anything that structurally needs sync."]
};
var HOW={
  "zero":"<b>Try it:</b> tap Scan your first bill to photograph a real bill, or import a screenshot or PDF.",
  "vault":"<b>Try it:</b> filter with the chips, then tap ⤓ PDF to download every bill in that filter as one PDF, grouped by category.",
  "vault-calendar":"<b>Try it:</b> use the arrows to change month and tap a dotted day.",
  "search":"<b>Try it:</b> type a shop, an item from the bill (“kurta”), or an amount. Typos are tolerated.",
  "folders":"<b>Try it:</b> open a folder or create a new one.",
  "folder-detail":"<b>Try it:</b> open a bill and use Change under Folder to move it.",
  "capture-picker":"<b>Try it:</b> every source works. Link takes pasted SMS or page text, since this page can't open other sites.",
  "capture-camera":"<b>Try it:</b> tap the frame or shutter to open your camera. Turn on Batch mode to scan several bills in a row.",
  "capture-confirm":"<b>Try it:</b> switch Original / Scan / B&W to compare the clean-up, toggle Auto-crop or rotate. Claude fills the fields. Anything it isn't sure of is flagged and blocks Save until you tick Looks right or edit it.",
  "capture-saveIn":"<b>Try it:</b> pick a folder, or create one here without leaving the flow.",
  "capture-saved":"<b>Try it:</b> Create account opens backup options; Skip returns to the Vault.",
  "pdf-view":"<b>Try it:</b> scroll the pages, or tap the download icon to save the PDF.",
  "bill-detail":"<b>Try it:</b> View PDF, change the category (the PDF is rebuilt), move folders, or Share as PDF.",
  "account":"<b>Try it:</b> download a backup file, restore one, or open Data & privacy."
};
function metaKey(){var r=S.route.name;
  if(r==='vault')return !S.bills.length?'zero':(S.view==='cal'?'vault-calendar':'vault');
  return {zero:'zero',search:'search',folders:'folders',folder:'folder-detail',camera:'capture-camera',confirm:'capture-confirm',multi:'capture-confirm',crop:'capture-confirm',scanfx:'capture-camera',saved:'capture-saved',bill:'bill-detail',edit:'bill-detail',cat:'folder-detail',account:'account',pdf:'pdf-view'}[r]||r;}

/* ---------------- navigation ---------------- */
function go(name,params,opt){opt=opt||{};exitSel(true);S.navDir=opt.dir||'push';if(!opt.replace)S.hist.push(S.route);S.route={name:name,params:params||{}};S.sheet=null;S.dialog=null;S.bigImg=false;render();}
function back(){if(S.selMode){exitSel();return;}if(S.route.name==='confirm'&&S.draft){A.discard();return;}S.navDir='pop';S.route=S.hist.pop()||{name:'vault',params:{}};S.sheet=null;S.dialog=null;render();}
function tab(n){exitSel(true);S.navDir='fade';S.hist=[];S.route={name:n,params:{}};S.sheet=null;S.dialog=null;render();}

/* ---------------- shared pieces ---------------- */
var ACCOUNT_BTN='<button class="iconBtn" data-act="account" aria-label="Account">'+ic('user')+'</button>';
function top(title,o){o=o||{};
  if(!o.back)return '<div class="scr-top"><h3>'+esc(title)+'</h3>'+(o.right!==undefined?o.right:ACCOUNT_BTN)+'</div>';
  return '<div class="scr-top"><button class="iconBtn" data-act="'+(o.backAct||'back')+'" aria-label="'+(o.backIc==='x'?'Close':'Back')+'">'+ic(o.backIc||'back')+'</button>'+
    '<h3'+(o.center?' style="flex:1;text-align:center;"':'')+'>'+esc(title)+'</h3>'+(o.right!==undefined?o.right:'<div style="width:24px;"></div>')+'</div>';
}
function thumbHtml(b,cls){return b.thumb?'<div class="'+cls+' img" style="background-image:url('+b.thumb+')"></div>':'<div class="'+cls+'"></div>';}
function rowHtml(b,sub,snip){
  var on=S.selMode&&S.sel.has(b.id),h='<button class="billRow'+(S.selMode?' selectable':'')+(on?' selected':'')+'" data-act="open" data-id="'+esc(b.id)+'"><span class="selDot" aria-hidden="true">'+ic('check')+'</span>'+thumbHtml(b,'billThumb')+'<div class="billMeta"><b>'+esc(displayName(b))+'</b><span>'+esc(sub)+(b.pdf?' <i class="pdfTag">PDF</i>':'')+'</span></div><div class="billAmt">'+esc(money(b))+'</div></button>';
  if(snip)h+='<div class="ocrSnippet">'+snip+'</div>';
  return h;
}

/* ---------------- screens ---------------- */
function zeroScreen(){
  return '<div class="zero-body">'+ic('home','stackIc')+
    '<h3>Your bills, all in one place.</h3>'+
    '<p>Paper, screenshots, PDFs, links — capture any bill the moment it lands, however it arrives.</p>'+
    '<button class="btnPrimary" style="padding:11px 20px;" data-act="goCamera">📷 Scan your first bill</button>'+
    '<button class="linkBtn" data-act="fab">or import a file / screenshot</button>'+
    (S.bills.length?'<button class="linkBtn" data-act="tab" data-a="vault">Go to your Vault ('+S.bills.length+')</button>':'<button class="linkBtn" data-act="loadSamples">or explore with sample bills</button>')+
    '<div class="foot">No sign-in required. Ever — except to back up across devices.</div></div>';
}
function chipFilter(b){if(S.chip==='All')return true;if(S.chip==='This month')return b.date.slice(0,7)===today().slice(0,7);return b.category===S.chip;}
function vaultScreen(){
  if(!S.bills.length)return zeroScreen();
  var body='<div class="segment"><button data-act="seg" data-a="list" class="'+(S.view==='list'?'active':'')+'">List</button><button data-act="seg" data-a="cal" class="'+(S.view==='cal'?'active':'')+'">Calendar</button></div>';
  body+=S.view==='list'?listView():calView();
  return top('Vault')+'<div class="scr-body">'+body+'</div>';
}
function listView(){
  var chips=['All','This month'];CATS.forEach(function(c){if(S.bills.some(function(b){return b.category===c;}))chips.push(c);});
  if(chips.indexOf(S.chip)<0)S.chip='All';
  var h='<div class="chipRow">'+chips.map(function(c){return '<button class="chip'+(S.chip===c?' active':'')+'" data-act="chip" data-a="'+esc(c)+'">'+esc(catLabel(c))+'</button>';}).join('')+'</div>';
  var list=sortedBills().filter(chipFilter);
  if(!list.length)return h+'<div class="ocrSnippet" style="margin:14px 0;text-align:center;">No bills match this filter.</div>';
  h+=exportBar(list,'vault');
  return h+list.map(function(b){return rowHtml(b,catLabel(b.category)+' · '+rel(b.date));}).join('');
}
function calView(){
  var y=S.month.y,m=S.month.m,first=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),t=today(),key=y+'-'+pad(m+1);
  var by={};S.bills.forEach(function(b){(by[b.date]=by[b.date]||[]).push(b);});
  var h='<div class="calNav"><button class="iconBtn" data-act="mnav" data-a="-1" aria-label="Previous month">'+ic('left')+'</button><div class="sectionLabel">'+MONL[m]+' '+y+'</div><button class="iconBtn" data-act="mnav" data-a="1" aria-label="Next month">'+ic('right')+'</button></div>';
  h+='<div class="calGrid">'+['S','M','T','W','T','F','S'].map(function(d){return '<div class="calDow">'+d+'</div>';}).join('');
  for(var i=0;i<first;i++)h+='<div class="calDay blank"></div>';
  for(var d=1;d<=dim;d++){
    var ds=key+'-'+pad(d),n=(by[ds]||[]).length,cls='calDay'+(ds===t?' today':'')+(n?' marked':'')+(S.openDay===ds?' open':'');
    h+=n?'<button class="'+cls+'" data-act="day" data-a="'+ds+'" aria-label="'+d+' '+MONL[m]+', '+n+' bills">'+d+'<span class="calDot"></span></button>':'<div class="'+cls+'">'+d+'</div>';
  }
  h+='</div>';
  if(S.openDay&&by[S.openDay]&&S.openDay.slice(0,7)===key){
    var L=by[S.openDay];
    h+='<div class="calExpand open"><div class="sectionLabel">'+MON[pd(S.openDay).getMonth()]+' '+pd(S.openDay).getDate()+' · '+L.length+' bill'+(L.length>1?'s':'')+'</div>'+L.map(function(b){return rowHtml(b,b.category);}).join('')+'</div>';
  }else if(!S.bills.some(function(b){return b.date.slice(0,7)===key;})){
    h+='<div class="ocrSnippet" style="margin:14px 0;text-align:center;">No bills in '+MONL[m]+'.</div>';
  }
  return h;
}
function searchScreen(){
  var s=S.search;
  var catO='<option value="">Category ▾</option>'+CATS.map(function(c){return '<option value="'+c+'"'+(s.cat===c?' selected':'')+'>'+c+' ▾</option>';}).join('');
  var rO=[['','Date range ▾'],['month','This month ▾'],['30','Last 30 days ▾'],['year','This year ▾']].map(function(r){return '<option value="'+r[0]+'"'+(s.range===r[0]?' selected':'')+'>'+r[1]+'</option>';}).join('');
  var fO='<option value="">Folder ▾</option>'+S.folders.map(function(f){return '<option value="'+esc(f.id)+'"'+(s.folder===f.id?' selected':'')+'>'+esc(f.name)+' ▾</option>';}).join('');
  return top('Search')+'<div class="scr-body"><div class="searchBox">'+ic('search')+
    '<input id="q" type="search" placeholder=\'Try "Lifestyle" or "last month"\' value="'+esc(s.q)+'" aria-label="Search bills" autocomplete="off"></div>'+
    '<div class="chipRow"><select class="chip selChip'+(s.cat?' on':'')+'" id="fCat" aria-label="Category">'+catO+'</select>'+
    '<select class="chip selChip'+(s.range?' on':'')+'" id="fRange" aria-label="Date range">'+rO+'</select>'+
    '<select class="chip selChip'+(s.folder?' on':'')+'" id="fFolder" aria-label="Folder">'+fO+'</select></div><div id="results"></div></div>';
}
function lev1(a,b){if(a===b)return true;var la=a.length,lb=b.length;if(Math.abs(la-lb)>1)return false;var i=0,j=0,e=0;
  while(i<la&&j<lb){if(a[i]===b[j]){i++;j++;continue;}if(++e>1)return false;if(la>lb)i++;else if(lb>la)j++;else{i++;j++;}}
  return e+(la-i)+(lb-j)<=1;}
function tokMatch(t,hay,words){if(hay.indexOf(t)>=0)return 2;if(t.length>=4&&words.some(function(w){return lev1(t,w)||(w.length>t.length&&lev1(t,w.slice(0,t.length)));}))return 1;return 0;}
var NOW_WORDS={'last month':-1,'this month':0};
function inRange(b,r){if(!r)return true;var d=pd(b.date),n=new Date();
  if(r==='month')return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth();
  if(r==='lastmonth'){var lm=new Date(n.getFullYear(),n.getMonth()-1,1);return d.getFullYear()===lm.getFullYear()&&d.getMonth()===lm.getMonth();}
  if(r==='year')return d.getFullYear()===n.getFullYear();
  if(r==='30')return (n-d)/864e5<=30&&d<=n;return true;}
function runSearch(){
  var s=S.search,q=s.q.toLowerCase(),impl='';
  if(/\blast month\b/.test(q)){impl='lastmonth';q=q.replace(/\blast month\b/,'');}
  else if(/\bthis month\b/.test(q)){impl='month';q=q.replace(/\bthis month\b/,'');}
  var toks=q.split(/\s+/).filter(Boolean),out=[];
  S.bills.forEach(function(b){
    if(s.cat&&b.category!==s.cat)return;if(s.folder&&b.folder!==s.folder)return;if(!inRange(b,s.range))return;if(impl&&!inRange(b,impl))return;
    var struct=(b.vendor+' '+(b.type||'')+' '+b.category+' '+(b.items||'')+' '+(b.amount==null?'':b.amount)+' '+(folderName(b.folder)||'')).toLowerCase();
    var text=(b.text||'').toLowerCase(),score=0,snip=null,ok=true;
    toks.forEach(function(t){
      var m1=tokMatch(t,struct,struct.split(/[^a-z0-9]+/)),m2=tokMatch(t,text,text.split(/[^a-z0-9]+/));
      if(!m1&&!m2){ok=false;return;}
      score+=m1*2+m2;
      if(m2&&!snip){var i=text.indexOf(t);if(i>=0){var raw=b.text;snip='Found in bill text: "'+esc(raw.slice(Math.max(0,i-26),i))+'<mark>'+esc(raw.slice(i,i+t.length))+'</mark>'+esc(raw.slice(i+t.length,i+t.length+30))+'"…';}}
    });
    if(ok)out.push({b:b,score:score,snip:toks.length?snip:null});
  });
  out.sort(function(a,b){return b.score-a.score||(a.b.date<b.b.date?1:-1);});
  var el=$('#results');if(!el)return;
  if(!S.bills.length){el.innerHTML='<div class="ocrSnippet" style="margin:14px 0;text-align:center;">Nothing to search yet. Add a bill with +.</div>';return;}
  if(!out.length){el.innerHTML='<div class="sectionLabel">0 results</div><div class="ocrSnippet" style="margin:10px 0;">Try fewer words, or clear a filter.</div>';return;}
  S.lastResults=out.map(function(r){return r.b;});
  el.innerHTML=exportBar(S.lastResults,'search',out.length+' result'+(out.length>1?'s':''))+out.map(function(r){return rowHtml(r.b,r.b.category+' · '+fmtDate(r.b.date),r.snip);}).join('');
}
function matchQ(b,q){var hay=(displayName(b)+' '+b.vendor+' '+(b.type||'')+' '+b.category+' '+catLabel(b.category)+' '+(b.items||'')+' '+(b.amount==null?'':b.amount)+' '+fmtDate(b.date,true)+' '+(folderName(b.folder)||'')).toLowerCase();
  return q.split(/\s+/).filter(Boolean).every(function(t){return hay.indexOf(t)>=0;});}
function catChips(list,sel,act){var cats=CATS.filter(function(c){return list.some(function(b){return b.category===c;});});if(cats.length<2&&!sel)return '';
  return '<div class="chipRow">'+[''].concat(cats).map(function(c){return '<button class="chip'+((sel||'')===c?' active':'')+'" data-act="'+act+'" data-a="'+c+'">'+(c?'<i class="cDot" style="background:'+CAT_COLOR[c]+'"></i>'+esc(catLabel(c)):'All')+'</button>';}).join('')+'</div>';}
function folderCardHtml(f,cat){var all=sortedBills().filter(function(b){return b.folder===f.id;}),bs=cat?all.filter(function(b){return b.category===cat;}):all,cov=bs.find(function(b){return b.thumb;});
  if(cat&&!bs.length)return '';
  return '<button class="folderCard" data-act="folder" data-id="'+esc(f.id)+'"><div class="folderCover'+(cov?' img':'')+'"'+(cov?' style="background-image:url('+cov.thumb+')"':'')+'></div><b>'+esc(f.name)+'</b><span>'+(cat?bs.length+' '+esc(catLabel(cat))+' of '+all.length:bs.length+' bill'+(bs.length===1?'':'s'))+'</span></button>';}
function foldersScreen(){
  return top('Folders')+'<div class="scr-body"><div class="searchBox">'+ic('search')+'<input id="fq" type="search" placeholder="Search folders, shops, items, amounts" value="'+esc(S.fq||'')+'" aria-label="Search folders and bills" autocomplete="off"></div><div id="fBody">'+foldersBody()+'</div></div>';
}
function foldersBody(){
  var q=(S.fq||'').trim().toLowerCase(),cat=S.fcat||'',h=catChips(S.bills,cat,'fcat');
  if(q){
    var fs=S.folders.filter(function(f){return f.name.toLowerCase().indexOf(q)>=0;}),bs=sortedBills().filter(function(b){return (!cat||b.category===cat)&&matchQ(b,q);});
    if(fs.length)h+='<div class="sectionLabel">Folders</div><div class="folderGrid">'+fs.map(function(f){return folderCardHtml(f,'');}).join('')+'</div>';
    h+='<div class="sectionLabel">'+bs.length+' bill'+(bs.length===1?'':'s')+'</div>'+bs.map(function(b){return rowHtml(b,catLabel(b.category)+' · '+fmtDate(b.date));}).join('');
    if(!fs.length&&!bs.length)h+='<div class="emptyNote">Nothing matches “'+esc(S.fq)+'”. Try a shop name, an item or an amount.</div>';
    return h;
  }
  var cats=CATS.filter(function(c){return S.bills.some(function(b){return b.category===c;})&&(!cat||c===cat);});
  if(cats.length)h+='<div class="sectionLabel">Categories</div><div class="catGrid">'+cats.map(function(c){var bs=S.bills.filter(function(b){return b.category===c;}),tot=bs.reduce(function(a,b){return a+(Number(b.amount)||0);},0);
    return '<button class="catTile" data-act="catOpen" data-a="'+c+'" style="--cc:'+CAT_COLOR[c]+'"><b>'+esc(catLabel(c))+'</b><span>'+bs.length+' bill'+(bs.length===1?'':'s')+' · ₹'+num(Math.round(tot))+'</span></button>';}).join('')+'</div>';
  var cards=S.folders.map(function(f){return folderCardHtml(f,cat);}).join('');
  h+='<div class="sectionLabel">My folders</div><div class="folderGrid">'+cards+'<button class="folderCard newFolder" data-act="newFolderOpen">'+ic('plus')+'New folder</button></div>';
  if(cat&&!cards)h+='<div class="emptyNote">No folder holds '+esc(catLabel(cat))+' bills yet.</div>';
  return h;
}
function curColBills(){var r=S.route;if(r.name==='folder')return sortedBills().filter(function(b){return b.folder===r.params.id;});if(r.name==='cat')return sortedBills().filter(function(b){return b.category===r.params.c;});return [];}
function colFiltered(){var c=S.col||{},q=(c.q||'').trim().toLowerCase();return curColBills().filter(function(b){return (!c.cat||b.category===c.cat)&&(!q||matchQ(b,q));});}
function colListHtml(){var all=curColBills(),list=colFiltered();
  if(!all.length)return '<div class="emptyNote">Empty. Use Save in ▾ when adding a bill, or Move to folder on any bill.</div>';
  if(!list.length)return '<div class="emptyNote">No bills match. Clear the search or pick All.</div>';
  return exportBar(list,'col')+list.map(function(b){return rowHtml(b,catLabel(b.category)+' · '+fmtDate(b.date));}).join('');}
function collectionHtml(isCat){var c=S.col||(S.col={q:'',cat:''});
  return '<div class="searchBox">'+ic('search')+'<input id="colQ" type="search" placeholder="Search in here" value="'+esc(c.q)+'" aria-label="Search bills" autocomplete="off"></div>'+(isCat?'':catChips(curColBills(),c.cat,'colCat'))+'<div id="colList">'+colListHtml()+'</div>';}
function folderScreen(){
  var f=S.folders.find(function(x){return x.id===S.route.params.id;});
  if(!f)return top('Folder',{back:1,center:1,right:ACCOUNT_BTN})+'<div class="scr-body"><div class="sectionLabel">This folder no longer exists</div></div>';
  return top(f.name,{back:1,center:1,right:'<button class="iconBtn" data-act="folderMenu" data-id="'+esc(f.id)+'" aria-label="Folder options">'+ic('more')+'</button>'})+'<div class="scr-body">'+collectionHtml(false)+'</div>';
}
function catScreen(){var c=S.route.params.c;
  return top(catLabel(c),{back:1,center:1,right:ACCOUNT_BTN})+'<div class="scr-body"><div class="catHead" style="--cc:'+CAT_COLOR[c]+'">'+esc(catLabel(c))+' bills, grouped automatically from what each receipt says. Change a bill’s category to move it.</div>'+collectionHtml(true)+'</div>';}
function editScreen(){
  var b=billById(S.route.params.id);if(!b)return top('Edit details',{back:1})+'<div class="scr-body"><div class="sectionLabel">This bill was deleted</div></div>';
  var f=function(k,lab,ctl){return '<div class="field"><label for="e_'+k+'">'+lab+'</label>'+ctl+'</div>';};
  return top('Edit details',{back:1,center:1})+'<div class="scr-body" style="padding-bottom:110px;">'+
    f('vendor','Vendor','<input class="fieldBox" id="e_vendor" value="'+esc(b.vendor)+'" autocomplete="off">')+
    f('type','Bill type','<input class="fieldBox" id="e_type" value="'+esc(b.type||'')+'" list="typeList2" autocomplete="off"><datalist id="typeList2">'+BILL_TYPES.map(function(t){return '<option value="'+t+'">';}).join('')+'</datalist>')+
    f('amount','Amount','<div class="fieldBox amtWrap"><span>'+esc(sym(b.currency))+'</span><input id="e_amount" inputmode="decimal" value="'+esc(b.amount==null?'':b.amount)+'" autocomplete="off"></div>')+
    f('date','Date','<input class="fieldBox" id="e_date" type="date" value="'+esc(b.date)+'">')+
    f('category','Category','<div><select class="catChip" id="e_category">'+CATS.map(function(c){return '<option value="'+c+'"'+(b.category===c?' selected':'')+'>'+esc(catLabel(c))+'</option>';}).join('')+'</select></div>')+
    f('items','Items','<textarea class="fieldBox" id="e_items" rows="3">'+esc(b.items||'')+'</textarea>')+
    '</div><div class="actionBar"><button class="btnPrimary" data-act="editSave" data-id="'+esc(b.id)+'">Save changes</button></div>';
}
function cameraScreen(){
  var cnt=S.batchMode&&S.camCount?'<div class="batchCount">'+S.camCount+' saved this batch</div>':'';
  return '<div class="scr-top"><button class="iconBtn" data-act="closeCamera" aria-label="Close">'+ic('x')+'</button>'+
    '<h3 style="flex:1;text-align:center;">Camera scan</h3>'+
    '<button class="chip'+(S.batchMode?' on':'')+'" style="font-size:10.5px;" data-act="batch" aria-pressed="'+S.batchMode+'">Batch mode</button></div>'+
    '<button class="viewfinder" data-act="shoot" style="font:inherit;position:relative;">'+cnt+'<div class="camCorner tl"></div><div class="camCorner tr"></div><div class="camCorner bl"></div><div class="camCorner br"></div>'+
    '<span>Position the bill within the frame<br>Tap to open camera</span></button>'+
    '<div class="camControls"><button class="iconBtn" data-act="pick" data-a="image" aria-label="Pick from gallery" style="width:38px;justify-content:center;">'+ic('img')+'</button>'+
    '<button class="shutter" data-act="shoot" aria-label="Take photo"></button>'+
    (S.lastThumb?'<div class="rawThumb img" style="background-image:url('+S.lastThumb+')"></div>':'<div class="rawThumb"></div>')+'</div>';
}
var FLAG_AT=0.8,FIELDS=['vendor','type','amount','date','category','items'];
function isFlagged(f){return isFlaggedD(S.draft,f);}
function isFlaggedD(d,f){if(!d||d.status!=='ready')return false;var v=d.fields[f];if(v===''||v==null)return false;var c=d.conf[f];return typeof c==='number'&&c<FLAG_AT&&!d.confirmed[f];}
function flaggedList(){return FIELDS.filter(isFlagged);}
function flagsOf(d){return FIELDS.filter(function(f){return isFlaggedD(d,f);});}
var BILL_TYPES=['Thermal retail receipt','GST tax invoice','Restaurant bill','Electricity bill','Water bill','Phone / internet bill','Rent receipt','Fuel receipt','Medical bill','Hotel invoice','Travel ticket','UPI payment','Service invoice','Handwritten chit'];
var LABEL={vendor:'Vendor',type:'Bill type',amount:'Amount',date:'Date',category:'Category',items:'Items'};
function field(f,control){var fl=isFlagged(f);
  return '<div class="field'+(fl?' flagged':'')+'" data-field="'+f+'"><div class="flagTag">\u26A0 please check</div><label for="f_'+f+'">'+LABEL[f]+'</label>'+control+
   '</div>';}
function confirmScreen(){
  var d=S.draft;
  if(!d)return top('Confirm & Save',{back:1,backIc:'x'})+'<div class="scr-body"><div class="sectionLabel">Nothing to confirm</div></div>';
  var F=d.fields,batch=S.batchTotal>1?' '+(S.batchDone+1)+'/'+S.batchTotal:'';
  var h='<div class="scr-top"><button class="iconBtn" data-act="discard" aria-label="'+(d.multi?'Back':'Discard')+'">'+ic(d.multi?'back':'x')+'</button><h3>'+(d.multi?'Bill '+(S.multi.indexOf(d)+1)+' of '+S.multi.length:d.replaceId?'Rescan bill':'Confirm &amp; Save'+batch)+'</h3><div style="width:24px;"></div></div>';
  var body;
  if(d.base||d.img){
    body='<button class="scanPrev'+(S.bigScan?' big':'')+'" data-act="scanBig" aria-label="'+(S.bigScan?'Shrink':'Enlarge')+' scan">'+(d.img?'<img src="'+d.img+'" alt="Scanned bill">':'<span>Preparing scan…</span>')+'</button>'+
      (d.base?'<div class="scanCtl"><div class="segment" role="group" aria-label="Scan look">'+[['original','Original'],['scan','Scan'],['bw','B&amp;W']].map(function(m){return '<button data-act="scanMode" data-a="'+m[0]+'" class="'+(d.mode===m[0]?'active':'')+'">'+m[1]+'</button>';}).join('')+'</div>'+
      '<button class="chip'+(d.crop&&!d.quad?' on':'')+'" data-act="scanCrop" aria-pressed="'+!!(d.crop&&!d.quad)+'">Auto-crop</button><button class="chip'+(d.quad?' on':'')+'" data-act="cropOpen">\u2702 Crop</button><button class="chip" data-act="scanRot" aria-label="Rotate">↻</button></div>':'')+
      '<div class="srcBadge" style="margin:-2px 0 12px;">via <span id="srcBadgeText">'+esc(d.src)+'</span>'+(d.engine?' \u00B7 read by '+esc(d.engine):'')+(d.crop&&d.base&&!d.cropped?' · edges not found, full photo kept':'')+' · saved as PDF'+(d.folder?' → '+esc(folderName(d.folder)||'folder'):'')+'</div>';
  }else{
    body='<div class="thumbRow"><div class="rawThumb"></div><div class="srcBadge">via <span id="srcBadgeText">'+esc(d.src)+'</span><br>saved as PDF'+(d.folder?' → '+esc(folderName(d.folder)||'folder'):'')+'</div></div>';
  }
  if(d.status==='reading'){
    body+='<div class="readRow"><span>Reading your bill…</span><button class="linkBtn" data-act="stopRead">Fill in myself</button></div><div class="skel"></div><div class="skel"></div><div class="skel"></div><div class="skel" style="height:56px"></div>';
  }else{
    if(d.status==='failed')body+='<div class="notice">'+esc(d.note)+((d.blob||d.pasted)?' <button class="linkBtn" style="padding:0;font-size:12px;" data-act="retry">Try again</button>':'')+'</div>';
    body+=field('vendor','<input class="fieldBox" id="f_vendor" data-f="vendor" value="'+esc(F.vendor)+'" placeholder="Shop or biller" autocomplete="off">');
    body+=field('type','<input class="fieldBox" id="f_type" data-f="type" value="'+esc(F.type)+'" placeholder="e.g. Thermal receipt, GST invoice" autocomplete="off" list="typeList"><datalist id="typeList">'+BILL_TYPES.map(function(t){return '<option value="'+t+'">';}).join('')+'</datalist>');
    body+=field('amount','<div class="fieldBox amtWrap"><span>'+esc(sym(d.currency))+'</span><input id="f_amount" data-f="amount" inputmode="decimal" value="'+esc(F.amount)+'" placeholder="0" autocomplete="off"></div>');
    body+=field('date','<input class="fieldBox" id="f_date" data-f="date" type="date" value="'+esc(F.date)+'">');
    body+=field('category','<div><select class="catChip" id="f_category" data-f="category">'+CATS.map(function(c){return '<option'+(F.category===c?' selected':'')+'>'+c+'</option>';}).join('')+'</select></div>');
    body+=field('items','<textarea class="fieldBox" id="f_items" data-f="items" rows="2" placeholder="What was bought (optional)">'+esc(F.items)+'</textarea>');
    body+='<label class="allRight" id="allRight" hidden><input type="checkbox" data-act="allRight"'+(d.allOk?' checked':'')+'><span><b id="allRightTxt">All details look right</b><small>Tick after checking the highlighted fields</small></span></label>';
    body+='<button class="ghostBtn" data-act="dupCheck">⚠ Check for duplicates</button>';
  }
  return h+'<div class="scr-body" style="padding-bottom:170px;">'+body+'</div><div class="actionBar"><button class="hintBtn" id="hint" data-act="goAllRight" hidden></button>'+
    '<button class="btnPrimary" id="btnSave" data-act="save">'+(d.multi?'Done':d.replaceId?'Replace scan':'Save')+'</button>'+(d.replaceId||d.multi?'':'<button class="btnSecondary" id="btnSaveIn" data-act="saveIn">Save in ▾</button>')+'</div>';
}
function syncSave(){var d=S.draft,a=$('#btnSave');if(!d||!a)return;var fl=flaggedList(),dis=d.status==='reading'||fl.length>0;
  a.disabled=dis;var si=$('#btnSaveIn');if(si)si.disabled=dis;
  var ar=$('#allRight');if(ar){ar.hidden=!fl.length&&!d.allOk;$('#allRightTxt').textContent=fl.length?'All details look right ('+fl.length+' highlighted)':'All details look right';}
  var hb=$('#hint');if(hb){hb.hidden=!fl.length||d.status==='reading';hb.textContent='Check '+fl.length+' highlighted field'+(fl.length>1?'s':'')+', then tick “All details look right” below ↓';}}
function savedScreen(){
  var show=!S.lastBackup||(Date.now()-S.lastBackup>30*864e5);
  return '<div class="savedWrap"><div class="savedCheck drawn"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg></div><h3 style="margin:0;font-size:17px;">'+(/^\d+ bills/.test(S.savedWhere)?'Saved '+esc(S.savedWhere.split(' \u00B7 ')[0])+'<small class="savedSub">'+esc(S.savedWhere.split(' \u00B7 ')[1]||'')+'</small>':'Saved <span id="savedWhereText">to '+esc(S.savedWhere)+'</span>')+'</h3>'+
   pdfStatusHtml()+
   '<button class="linkBtn" data-act="addAnother">+ Add another bill</button>'+
   (S.lastSavedId?'<button class="linkBtn" data-act="open" data-id="'+esc(S.lastSavedId)+'" style="color:var(--ink-soft)">View bill</button>':'')+
   (show?'<div class="nudge">Your bills are only saved on this phone right now. Back them up so a lost or swapped phone doesn\'t lose them.<div class="nrow"><button class="yes" data-act="account">Create account</button><button class="no" data-act="tab" data-a="vault">Skip</button></div></div>':
     '<button class="btnSecondary" style="padding:9px 18px;" data-act="tab" data-a="vault">Done</button>')+'</div>';
}
function billScreen(){
  var b=billById(S.route.params.id);
  if(!b)return top('Bill',{back:1})+'<div class="scr-body"><div class="sectionLabel">This bill was deleted</div></div>';
  var fn=folderName(b.folder),when=b.createdAt?new Date(b.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'}):'';
  var img=b.img?'<button class="detailImg'+(S.bigImg?' big':'')+'" data-act="bigImg" aria-label="'+(S.bigImg?'Shrink':'Enlarge')+' bill image"><img src="'+b.img+'" alt="Bill from '+esc(b.vendor)+'"></button>':'<div class="detailImg"></div>';
  return top('Bill',{back:1,right:'<button class="iconBtn" data-act="billMenu" aria-label="Bill options">'+ic('more')+'</button>'})+
   '<div class="scr-body nopad">'+img+
   '<div style="font-size:16px;font-weight:700;overflow-wrap:anywhere;">'+esc(displayName(b))+(b.sample?'<span class="sampleTag">sample</span>':'')+'</div>'+(b.title?'<div style="font-size:12px;color:var(--ink-soft);">'+esc(b.vendor)+'</div>':'')+
   '<div style="font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;margin:4px 0 2px;">'+esc(money(b))+'</div>'+
   '<div style="font-size:12px;color:var(--ink-soft);margin-bottom:14px;">'+esc(fmtDate(b.date,true))+(b.type?' · '+esc(b.type):'')+'</div>'+
   '<div class="quickActs">'+[['renameOpen','pen','Rename'],['editOpen','tag','Edit'],['rescan','rescan','Rescan'],['moveOpen','move','Move']].map(function(q){return '<button data-act="'+q[0]+'" data-id="'+esc(b.id)+'">'+ic(q[1])+'<span>'+q[2]+'</span></button>';}).join('')+'</div>'+
   (b.items?'<div class="sectionLabel">Items</div><div class="fieldBox" style="margin-bottom:10px;">'+esc(b.items)+'</div>':'')+
   '<div class="sectionLabel">Category</div><select class="catChip" id="catSel" data-id="'+esc(b.id)+'" aria-label="Category" style="margin-bottom:10px;">'+CATS.map(function(c){return '<option value="'+c+'"'+(b.category===c?' selected':'')+'>'+esc(catLabel(c))+'</option>';}).join('')+'</select>'+
   '<div class="sectionLabel">Folder</div><div class="pillRow" style="margin-bottom:10px;">'+(fn?'<span class="pillDot" style="background:var(--accent);"></span>'+esc(fn):'<span style="color:var(--ink-faint)">None</span>')+'<button class="linkBtn" style="padding:0 0 0 6px;" data-act="moveOpen">Change</button></div>'+
   '<div class="sectionLabel">Provenance</div><div class="mono" style="font-size:11px;color:var(--ink-faint);margin-bottom:12px;">'+(b.sample?'Sample bill':'Captured via '+esc(b.source||'unknown'))+(when?' · '+esc(when):'')+'</div>'+
   (b.text?'<details class="raw"><summary>extraction_text</summary><pre>'+esc(b.text)+'</pre></details>':'')+
   '<div class="sectionLabel">PDF</div><div class="mono" style="font-size:11px;color:var(--ink-faint);margin-bottom:12px;">'+(b.pdf&&!b.pdfStale?esc(pdfFileName(b))+' · '+(b.pdfPages||1)+' page'+((b.pdfPages||1)>1?'s':'')+' · '+Math.max(1,Math.round(b.pdf.size/1024))+' KB':'Created when you view or share it')+'</div>'+
   '<button class="btnPrimary" style="width:100%;margin-bottom:8px;" data-act="viewPdf">View PDF</button>'+
   '<div style="display:flex;gap:8px;"><button class="btnSecondary" style="flex:1;" data-act="sharePdf">Share as PDF</button><button class="btnSecondary" style="flex:1;" data-act="shareApp">Share to app</button></div>'+
   '<button class="dangerLink" data-act="delBill" data-id="'+esc(b.id)+'">Delete bill</button></div>';
}
function accountScreen(){
  var n=S.bills.length,backed=!!S.lastBackup;
  return top('Account',{back:1,backIc:'x'})+'<div class="scr-body nopad">'+
   '<div style="display:flex;align-items:center;gap:12px;padding:8px 0 16px;"><div class="avatarPh"></div><div style="flex:1;">'+
   '<div style="font-size:13.5px;font-weight:600;">Not signed in</div><button class="linkBtn" style="padding:2px 0;" data-act="signIn">Sign in / Create account</button></div></div>'+
   '<div class="sectionLabel">Backup</div>'+
   '<div class="pillRow" style="margin-bottom:3px;"><span class="pillDot'+(backed?' ok':'')+'"></span>'+(backed?'Backup file saved '+esc(fmtDate(ymd(new Date(S.lastBackup)),true)):'Not backed up on this device')+'</div>'+
   '<div class="mono" style="font-size:11px;color:var(--ink-faint);margin-bottom:10px;">'+n+' bill'+(n===1?'':'s')+' stored locally only</div>'+
   '<div style="display:flex;gap:8px;margin-bottom:6px;"><button class="btnSecondary" style="flex:1;font-size:12px;padding:8px;" data-act="exportBackup">Back up now</button><button class="btnSecondary" style="flex:1;font-size:12px;padding:8px;" data-act="importBackup">Restore</button></div>'+
   (window.RK_key?'<div class="sectionLabel">Bill reading</div>'+
     '<div class="pillRow" style="margin-bottom:8px;"><span class="pillDot ok"></span>'+(window.RK_key.get()?'Claude reads bills · OCR.space as backup':'OCR.space reads bills · add a Claude key for sharper results')+'</div>'+
     '<label class="mono" for="ocrKey" style="display:block;font-size:10.5px;color:var(--ink-soft);margin-bottom:4px;">OCR.space key (free)</label>'+
     '<div style="display:flex;gap:8px;margin-bottom:10px;"><input class="fieldBox" id="ocrKey" type="password" autocomplete="off" placeholder="'+(window.RK_ocrKey.isDefault()?'Built-in key in use':'•••• your key saved')+'" style="flex:1;min-width:0;"><button class="btnSecondary" style="padding:8px 12px;font-size:12px;" data-act="saveOcrKey">Save</button></div>'+
     '<label class="mono" for="apiKey" style="display:block;font-size:10.5px;color:var(--ink-soft);margin-bottom:4px;">Anthropic API key (optional)</label>'+
     '<div style="display:flex;gap:8px;margin-bottom:4px;"><input class="fieldBox" id="apiKey" type="password" autocomplete="off" placeholder="'+(window.RK_key.get()?'•••• saved — paste to replace':'sk-ant-…')+'" style="flex:1;min-width:0;"><button class="btnSecondary" style="padding:8px 12px;font-size:12px;" data-act="saveKey">Save</button></div>'+
     '<div class="mono" style="font-size:10.5px;color:var(--ink-faint);margin-bottom:6px;line-height:1.5;">Keys are stored only on this phone. Claude keys: console.anthropic.com.'+(window.RK_key.get()?' <button class="linkBtn" style="padding:0;font-size:10.5px;" data-act="clearKey">Remove Claude key</button>':'')+'</div>':'')+
   '<div class="sectionLabel">Permissions</div>'+
   '<div class="toggleRow">SMS access (for link import)<button class="toggle" data-act="smsToggle" role="switch" aria-checked="false" aria-label="SMS access"><i></i></button></div>'+
   '<div class="toggleRow">Storage<button class="toggle'+(S.persisted?' on':'')+'" data-act="storageToggle" role="switch" aria-checked="'+S.persisted+'" aria-label="Keep storage"><i></i></button></div>'+
   '<div class="sectionLabel">Data</div>'+
   '<button class="toggleRow btn" style="border-bottom:none;" data-act="privacy">Data &amp; privacy'+ic('right')+'</button></div>';
}

/* ---------------- capture pipeline ---------------- */
function newDraft(src){return {id:uid(),src:src,img:null,thumb:null,blob:null,text:'',pasted:'',fields:{vendor:'',type:'',amount:'',date:today(),category:'Other',items:''},conf:{},confirmed:{},currency:'INR',status:'reading',note:'',folder:null,dupChecked:false};}
function loadBitmap(file){if(window.createImageBitmap)return createImageBitmap(file,{imageOrientation:'from-image'}).catch(function(){return viaImg(file);});return viaImg(file);}
function viaImg(file){return new Promise(function(res,rej){var im=new Image();im.onload=function(){res(im);};im.onerror=function(){rej(new Error('decode'));};im.src=URL.createObjectURL(file);});}
function drawTo(src,max){var w=src.width||src.naturalWidth,h=src.height||src.naturalHeight,s=Math.min(1,max/Math.max(w,h));
  var c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*s));c.height=Math.max(1,Math.round(h*s));
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(src,0,0,c.width,c.height);return c;}
function toBlob(c,q){return new Promise(function(res){c.toBlob(res,'image/jpeg',q);});}
function blobUrl(b){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result);};r.onerror=rej;r.readAsDataURL(b);});}
function fromCanvasSource(src){var big=drawTo(src,1600),sm=drawTo(src,120);
  return toBlob(big,0.82).then(function(blob){return blobUrl(blob).then(function(url){return {blob:blob,img:url,thumb:sm.toDataURL('image/jpeg',0.7)};});});}
function lib(k,u){return (window.RK_LIBS&&window.RK_LIBS[k])||u;}
function readBuf(b){return b.arrayBuffer?b.arrayBuffer():new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result);};r.onerror=rej;r.readAsArrayBuffer(b);});}
function mkCtl(){try{return mkCtl();}catch(e){return {signal:undefined,abort:function(){}};}}
function loadScript(u){return new Promise(function(res,rej){var s=document.createElement('script');s.src=u;s.onload=res;s.onerror=function(){rej(new Error('script'));};document.head.appendChild(s);});}
var pdfReady=null;
function getPdfjs(){
  if(!pdfReady)pdfReady=loadScript(lib('pdfWorker','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'))
    .then(function(){return loadScript(lib('pdf','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'));})
    .then(function(){var L=window.pdfjsLib;L.GlobalWorkerOptions.workerSrc=lib('pdfWorker','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');return L;})
    .catch(function(e){pdfReady=null;throw e;});
  return pdfReady;
}
function prepPdf(file){
  return Promise.all([getPdfjs(),readBuf(file)]).then(function(r){
    return r[0].getDocument({data:r[1],isEvalSupported:false}).promise;
  }).then(function(doc){
    return doc.getPage(1).then(function(page){
      var vp=page.getViewport({scale:1}),sc=Math.min(2.2,1600/Math.max(vp.width,vp.height)),v=page.getViewport({scale:sc});
      var c=document.createElement('canvas');c.width=Math.round(v.width);c.height=Math.round(v.height);
      var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
      return page.render({canvasContext:x,viewport:v}).promise.then(function(){
        return page.getTextContent().then(function(tc){return tc.items.map(function(i){return i.str;}).join(' ');},function(){return '';});
      }).then(function(txt){return {canvas:c,pdfText:txt,isPdf:true};});
    });
  });
}
function prepFile(file){
  var isPdf=file.type==='application/pdf'||/\.pdf$/i.test(file.name);
  return isPdf?prepPdf(file):loadBitmap(file).then(function(bmp){return {canvas:drawTo(bmp,2000),pdfText:'',isPdf:false};});
}

/* ---------------- scan enhancement (thermal-friendly) ---------------- */
function rotateCanvas(src,q){if(!q)return src;var c=document.createElement('canvas'),sw=q%2;c.width=sw?src.height:src.width;c.height=sw?src.width:src.height;
  var x=c.getContext('2d');x.translate(c.width/2,c.height/2);x.rotate(q*Math.PI/2);x.drawImage(src,-src.width/2,-src.height/2);return c;}
function grayOf(d,n){var g=new Float32Array(n);for(var i=0,j=0;i<n;i++,j+=4)g[i]=0.299*d[j]+0.587*d[j+1]+0.114*d[j+2];return g;}
function otsu(g){var h=new Array(256).fill(0),n=g.length;for(var i=0;i<n;i++)h[Math.min(255,g[i]|0)]++;var sum=0;for(i=0;i<256;i++)sum+=i*h[i];
  var sB=0,wB=0,best=0,t=128;for(i=0;i<256;i++){wB+=h[i];if(!wB)continue;var wF=n-wB;if(!wF)break;sB+=i*h[i];var mB=sB/wB,mF=(sum-sB)/wF,v=wB*wF*(mB-mF)*(mB-mF);if(v>best){best=v;t=i;}}return t;}
function longestRun(arr,min){var bs=-1,be=-1,s=-1;for(var i=0;i<=arr.length;i++){if(i<arr.length&&arr[i]>=min){if(s<0)s=i;}else if(s>=0){if(i-s>be-bs){bs=s;be=i;}s=-1;}}return bs<0?null:[bs,be];}
function autoBox(src){
  var sm=drawTo(src,320),W=sm.width,H=sm.height,g=grayOf(sm.getContext('2d').getImageData(0,0,W,H).data,W*H),t=otsu(g);
  var rows=new Float32Array(H),x,y;for(y=0;y<H;y++){var c=0;for(x=0;x<W;x++)if(g[y*W+x]>t)c++;rows[y]=c/W;}
  var ry=longestRun(rows,0.3);if(!ry)return null;
  var cols=new Float32Array(W);for(x=0;x<W;x++){var k=0;for(y=ry[0];y<ry[1];y++)if(g[y*W+x]>t)k++;cols[x]=k/(ry[1]-ry[0]);}
  var rx=longestRun(cols,0.3);if(!rx)return null;
  var area=((rx[1]-rx[0])*(ry[1]-ry[0]))/(W*H);if(area<0.12||area>0.96)return null;
  var px=W*0.015,py=H*0.015,s=src.width/W;
  var x0=Math.max(0,rx[0]-px),y0=Math.max(0,ry[0]-py),x1=Math.min(W,rx[1]+px),y1=Math.min(H,ry[1]+py);
  return {x:Math.round(x0*s),y:Math.round(y0*s),w:Math.round((x1-x0)*s),h:Math.round((y1-y0)*s)};
}
/* ---------- bill detection: largest bright paper region → 4 corners → straightened crop ---------- */
function findQuads(src,maxN){
  var sm=drawTo(src,260),W=sm.width,H=sm.height,N=W*H,g=grayOf(sm.getContext('2d').getImageData(0,0,W,H).data,N),t=otsu(g);
  var mask=new Uint8Array(N),i;for(i=0;i<N;i++)mask[i]=g[i]>t?1:0;
  var lab=new Int32Array(N),q=new Int32Array(N),comps=[],cur=0,outS=0,outN=0;
  for(i=0;i<N;i++){if(!mask[i]){outS+=g[i];outN++;continue;}if(lab[i])continue;cur++;var h=0,tl=0,a=0,x0=W,x1=0,y0=H,y1=0;q[tl++]=i;lab[i]=cur;
    while(h<tl){var p=q[h++],px=p%W,py=(p/W)|0;a++;if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py;
      if(px>0&&mask[p-1]&&!lab[p-1]){lab[p-1]=cur;q[tl++]=p-1;}
      if(px<W-1&&mask[p+1]&&!lab[p+1]){lab[p+1]=cur;q[tl++]=p+1;}
      if(p>=W&&mask[p-W]&&!lab[p-W]){lab[p-W]=cur;q[tl++]=p-W;}
      if(p<N-W&&mask[p+W]&&!lab[p+W]){lab[p+W]=cur;q[tl++]=p+W;}}
    if(a>=N*0.025)comps.push({id:cur,a:a,x0:x0,x1:x1,y0:y0,y1:y1});}
  var outMean=outS/Math.max(1,outN),res=[];
  comps.sort(function(p,q2){return q2.a-p.a;});
  for(var ci=0;ci<comps.length&&ci<10&&res.length<(maxN||6);ci++){var C=comps[ci];if(C.a>N*0.93)continue;
    var tl2=null,tr,br,bl,sMin=1e9,sMax=-1e9,dMin=1e9,dMax=-1e9,e={l:0,r:0,t:0,b:0},x,y,pS=0,rowL=[],rowR=[];
    for(y=C.y0;y<=C.y1;y++){rowL[y]=-1;for(x=C.x0;x<=C.x1;x++){if(lab[y*W+x]!==C.id)continue;pS+=g[y*W+x];
      var s1=x+y,d1=x-y;if(s1<sMin){sMin=s1;tl2=[x,y];}if(s1>sMax){sMax=s1;br=[x,y];}if(d1>dMax){dMax=d1;tr=[x,y];}if(d1<dMin){dMin=d1;bl=[x,y];}
      if(x===0)e.l++;if(x===W-1)e.r++;if(y===0)e.t++;if(y===H-1)e.b++;if(rowL[y]<0)rowL[y]=x;rowR[y]=x;}}
    if(((e.l>H*0.3)+(e.r>H*0.3)+(e.t>W*0.3)+(e.b>W*0.3))>=3)continue;       // that's the table, not a bill
    var P=[tl2,tr,br,bl],qa=0;for(i=0;i<4;i++){var A=P[i],B=P[(i+1)%4];qa+=A[0]*B[1]-B[0]*A[1];}qa=Math.abs(qa)/2;
    if(qa<N*0.02||C.a/qa<0.72)continue;
    var side=function(p1,p2){return Math.hypot(p1[0]-p2[0],p1[1]-p2[1]);};
    if(Math.min(side(tl2,tr),side(bl,br))<W*0.06||Math.min(side(tl2,bl),side(tr,br))<H*0.06)continue;
    var inMean=pS/C.a,inkT=inMean-Math.max(18,(inMean-outMean)*0.18),dark=0,span=0;
    for(y=C.y0;y<=C.y1;y++){if(rowL[y]<0)continue;var xa=rowL[y]+Math.round((rowR[y]-rowL[y])*0.06),xb=rowR[y]-Math.round((rowR[y]-rowL[y])*0.06);
      for(x=xa;x<xb;x++){span++;if(g[y*W+x]<inkT)dark++;}}
    var ratio=dark/Math.max(1,span);if(ratio<0.008||ratio>0.5||inMean-outMean<30)continue;
    var cx=(tl2[0]+tr[0]+br[0]+bl[0])/4,cy=(tl2[1]+tr[1]+br[1]+bl[1])/4;
    res.push(P.map(function(pp){return [(pp[0]+(cx-pp[0])*0.02)/W,(pp[1]+(cy-pp[1])*0.02)/H];}));}
  // reading order: top-to-bottom rows, then left-to-right
  res.sort(function(p1,p2){var a1=(p1[0][1]+p1[2][1])/2,a2=(p2[0][1]+p2[2][1])/2,b1=(p1[0][0]+p1[2][0])/2,b2=(p2[0][0]+p2[2][0])/2;return Math.abs(a1-a2)>0.25?a1-a2:b1-b2;});
  return res;
}
function findQuad(src){var r=findQuads(src,1);return r.length?r[0]:null;}
function solveH(src,dst){var A=[],i,j,k;
  for(i=0;i<4;i++){var x=src[i][0],y=src[i][1],X=dst[i][0],Y=dst[i][1];A.push([x,y,1,0,0,0,-x*X,-y*X,X]);A.push([0,0,0,x,y,1,-x*Y,-y*Y,Y]);}
  for(i=0;i<8;i++){var m=i;for(j=i+1;j<8;j++)if(Math.abs(A[j][i])>Math.abs(A[m][i]))m=j;var tmp=A[i];A[i]=A[m];A[m]=tmp;
    for(j=i+1;j<8;j++){var f=A[j][i]/A[i][i];for(k=i;k<9;k++)A[j][k]-=f*A[i][k];}}
  var h=new Array(8);for(i=7;i>=0;i--){var s=A[i][8];for(j=i+1;j<8;j++)s-=A[i][j]*h[j];h[i]=s/A[i][i];}return h;}
function warpQuad(src,qn){
  var SW=src.width,SH=src.height,Q=qn.map(function(p){return [p[0]*SW,p[1]*SH];});
  var L=function(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1]);};
  var w=(L(Q[0],Q[1])+L(Q[3],Q[2]))/2,h=(L(Q[0],Q[3])+L(Q[1],Q[2]))/2,sc=Math.min(1,1500/w,4200/h);w=Math.max(2,Math.round(w*sc));h=Math.max(2,Math.round(h*sc));
  var H8=solveH([[0,0],[w,0],[w,h],[0,h]],Q),sd=src.getContext('2d').getImageData(0,0,SW,SH).data;
  var out=document.createElement('canvas');out.width=w;out.height=h;var oc=out.getContext('2d'),od=oc.createImageData(w,h),o=od.data;
  for(var v=0;v<h;v++){for(var u=0;u<w;u++){
    var z=H8[6]*u+H8[7]*v+1,X=(H8[0]*u+H8[1]*v+H8[2])/z,Y=(H8[3]*u+H8[4]*v+H8[5])/z,x0=X|0,y0=Y|0,fx=X-x0,fy=Y-y0,oi=(v*w+u)*4;
    if(x0<0||y0<0||x0>=SW-1||y0>=SH-1){o[oi]=o[oi+1]=o[oi+2]=255;o[oi+3]=255;continue;}
    var p0=(y0*SW+x0)*4,p1=p0+4,p2=p0+SW*4,p3=p2+4;
    for(var c=0;c<3;c++)o[oi+c]=(sd[p0+c]*(1-fx)+sd[p1+c]*fx)*(1-fy)+(sd[p2+c]*(1-fx)+sd[p3+c]*fx)*fy;
    o[oi+3]=255;}}
  oc.putImageData(od,0,0);return out;
}
function enhance(src,mode,crop){
  var qd=Array.isArray(crop)?crop:(crop?findQuad(src):null),box=(crop&&!qd)?autoBox(src):null,c=document.createElement('canvas');
  if(qd){c=warpQuad(src,qd);}
  else if(box){c.width=box.w;c.height=box.h;c.getContext('2d').drawImage(src,box.x,box.y,box.w,box.h,0,0,box.w,box.h);}else{c.width=src.width;c.height=src.height;c.getContext('2d').drawImage(src,0,0);}
  if(mode==='original')return c;
  var W=c.width,H=c.height,n=W*H,ctx=c.getContext('2d'),id=ctx.getImageData(0,0,W,H),d=id.data,g=grayOf(d,n),i,j;
  // estimate the paper background with a big blur, then divide it out: removes shadows and yellowed thermal paper
  var gc=document.createElement('canvas');gc.width=W;gc.height=H;var gi=gc.getContext('2d').createImageData(W,H);
  for(i=0,j=0;i<n;i++,j+=4){var v=g[i];gi.data[j]=gi.data[j+1]=gi.data[j+2]=v;gi.data[j+3]=255;}
  gc.getContext('2d').putImageData(gi,0,0);
  var sw=Math.max(6,Math.round(W/28)),sh=Math.max(6,Math.round(H/28)),sc=document.createElement('canvas');sc.width=sw;sc.height=sh;
  var sx=sc.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(gc,0,0,sw,sh);
  var bc=document.createElement('canvas');bc.width=W;bc.height=H;var bx=bc.getContext('2d');bx.imageSmoothingQuality='high';bx.filter='blur(2px)';bx.drawImage(sc,0,0,W,H);
  var bg=bx.getImageData(0,0,W,H).data,nrm=new Float32Array(n),hist=new Array(256).fill(0);
  for(i=0,j=0;i<n;i++,j+=4){var r=Math.min(255,g[i]/Math.max(bg[j]*1.02,1)*255);nrm[i]=r;hist[r|0]++;}
  var acc=0,lo=0,hi=255;for(i=0;i<256;i++){acc+=hist[i];if(acc>n*0.01){lo=i;break;}}
  acc=0;for(i=255;i>=0;i--){acc+=hist[i];if(acc>n*0.35){hi=i;break;}}
  if(hi-lo<30){hi=Math.min(255,lo+30);}
  for(i=0,j=0;i<n;i++,j+=4){
    var v2=(nrm[i]-lo)/(hi-lo);v2=v2<0?0:v2>1?1:v2;
    v2=Math.pow(v2,1.8);                       // pull faded thermal grey toward black
    var o=mode==='bw'?(v2<0.55?Math.max(0,(v2-0.35)*1275):255):v2*255;   // soft threshold keeps edges smooth
    if(mode==='bw'&&v2>=0.35&&v2<0.55)o=Math.max(0,Math.min(255,(v2-0.35)*1275));
    d[j]=d[j+1]=d[j+2]=o;d[j+3]=255;
  }
  ctx.putImageData(id,0,0);return c;
}
function regen(d){
  var rb=rotateCanvas(d.base,d.rot),sc0=Math.min(1,1500/rb.width,4200/rb.height),src=document.createElement('canvas');src.width=Math.round(rb.width*sc0);src.height=Math.round(rb.height*sc0);
  var sx=src.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(rb,0,0,src.width,src.height);
  var out=enhance(src,d.mode,d.quad||d.crop);d.w=out.width;d.h=out.height;d.cropped=!!d.quad||(d.crop&&(out.width!==src.width||out.height!==src.height));
  return toBlob(out,0.86).then(function(blob){d.blob=blob;return blobUrl(blob);}).then(function(url){d.img=url;d.thumb=drawTo(out,120).toDataURL('image/jpeg',0.7);S.lastThumb=d.thumb;});
}

var sampleP=null;
function getSample(){if(!sampleP)sampleP=(window.claude&&claude.use?claude.use('sample'):Promise.resolve(null)).catch(function(){return null;});return sampleP;}
function prompt(text,hasImg){
  return 'You extract structured data from a bill or receipt (often Indian: GST invoices, utility bills, restaurant and retail receipts, milkman chits, UPI payment screenshots, retailer SMS). Today is '+today()+'.\n'+
  'Return ONLY a JSON object with exactly these keys:\n'+
  '{"is_bill": boolean, "vendor": string, "bill_type": short document type such as '+JSON.stringify(BILL_TYPES.slice(0,8))+' or similar, "amount": number or null, "currency": ISO code such as "INR", "date": "YYYY-MM-DD" or null, "category": one of '+JSON.stringify(CATS)+', "items": string, "raw_text": string, "confidence": {"vendor":0-1,"bill_type":0-1,"amount":0-1,"date":0-1,"category":0-1,"items":0-1}}\n'+
  'Rules: amount is the final total payable, not a subtotal or tax line. items is the line items on one short line, e.g. "2x Kurta Set — 1749 each". raw_text is all legible text, plain, at most 1500 characters. Use null or "" when a value is not visible; never guess. Give confidence below 0.6 for blurry, cropped, handwritten or ambiguous values. Dates like 03/04/26 are day/month/year.'+
  (hasImg?'\n\nThe bill is in the attached image.':'')+(text?'\n\nBill text:\n'+text.slice(0,20000):'');
}
function applyResult(d,r){
  if(!r||typeof r!=='object'){d.status='failed';d.note="Couldn't read this bill. Fill in the details yourself.";return;}
  if(r.is_bill===false){d.notBill=true;d.status='failed';d.note="This doesn't look like a bill. You can still save it after filling in the details.";return;}
  var F=d.fields,c=r.confidence||{};
  F.vendor=String(r.vendor||'').trim();
  F.amount=(r.amount!=null&&isFinite(+r.amount)&&+r.amount>=0)?String(+r.amount):'';
  var vd=validDate(r.date);F.date=vd||today();
  F.category=CATS.indexOf(r.category)>=0?r.category:'Other';
  F.items=String(r.items||'').trim();
  F.type=String(r.bill_type||'').trim();
  d.currency=/^[A-Z]{3}$/.test(r.currency||'')?r.currency:'INR';
  d.text=String(r.raw_text||'').slice(0,2000)||d.text;
  var n=function(v){v=Number(v);return isFinite(v)?Math.max(0,Math.min(1,v)):0.5;};
  d.conf={vendor:n(c.vendor),type:n(c.bill_type),amount:n(c.amount),date:vd?n(c.date):0.4,category:n(c.category),items:n(c.items)};
  var rule=S.rules[rkey(F.vendor)];if(rule&&CATS.indexOf(rule)>=0){F.category=rule;d.conf.category=1;}
  d.status='ready';
}
function failNote(code){
  if(/^(not_granted|sampling_disabled|not_declared|capability_disabled|capability_removed|unavailable)$/.test(code||''))return 'Automatic reading isn\'t available here. Fill in the details yourself — saving still works.';
  if(code==='no_key')return 'Add your Anthropic API key in Settings → Bill reading to fill these in automatically. You can type them yourself now.';
  if(code==='bad_key')return 'Your API key was rejected. Check it in Settings → Bill reading, or fill in the details yourself.';
  if(code==='bad_ocr_key')return 'OCR.space rejected the key. Check it in Settings \u2192 Bill reading, or fill in the details yourself.';
  if(code==='noimg')return 'This view can\'t send photos for reading. Fill in the details yourself.';
  if(code==='rate_limited')return 'Reading limit reached (OCR.space free plan or Claude). Fill in the details now, or try again later.';
  if(code==='image_rejected')return 'That image couldn\'t be read. Try a clearer photo, or fill in the details.';
  if(code==='invalid_json'||code==='empty_completion'||code==='refused')return 'Couldn\'t read this bill clearly. Fill in the details, or retake the photo.';
  return 'Reading was interrupted. Fill in the details, or try again.';
}
/* ---------------- receipt text parser (used with OCR.space and for pasted text) ---------------- */
var CAT_WORDS=[
  ['Utilities',/electric|bescom|msedcl|tneb|bses|tata power|kwh|units consumed|consumer no|water (bill|board|supply)|gas (bill|agency)|lpg|indane|bharat gas|broadband|postpaid|prepaid|recharge|airtel|jio|vodafone|\bvi\b|bsnl|act fibernet|dth|tata play/i],
  ['Health',/pharma|chemist|medical|medic|hospital|clinic|diagnost|pathlab|\blab\b|apollo|medplus|netmeds|1mg|tablet|syrup|capsule|\bmg\b/i],
  ['Dining',/restaurant|restro|cafe|café|coffee|dhaba|bistro|kitchen|pizza|burger|biryani|bakery|sweets|swiggy|zomato|\bkot\b|table no|dine|food court|\bbar\b|brew|tea stall/i],
  ['Travel',/irctc|railway|\bpnr\b|flight|airline|indigo|air india|boarding|\buber\b|\bola\b|rapido|taxi|cab\b|parking|toll|fastag|petrol|diesel|fuel|\bhpcl\b|\biocl?\b|bharat petroleum|indian oil|resort|\bhotel\b|check.?in|room/i],
  ['Groceries',/grocer|kirana|supermarket|super market|hypermarket|\bmart\b|dmart|d-mart|bigbasket|blinkit|zepto|reliance fresh|more retail|spencer|nature'?s basket|dairy|milk|vegetable|fruits|provision|atta|\brice\b|\bdal\b/i],
  ['Rent',/\brent\b|landlord|tenant|lease|\bhra\b|maintenance charges|society/i],
  ['Services',/repair|service charge|servicing|salon|parlour|spa\b|laundry|dry clean|plumb|electrician|labour|labor|tailor|courier|consult/i],
  ['Shopping',/fashion|apparel|garment|lifestyle|westside|pantaloons|max\b|zudio|trends|fabindia|shoppers stop|electronics|croma|reliance digital|mall|store|kurta|shirt|jeans|saree|footwear|shoes|amazon|flipkart|myntra|ajio/i]
];
function typeFor(t,cat){
  if(/txn id|transaction id|\butr\b|upi ref|paid to|payment successful|money sent/i.test(t)&&!/invoice|gstin|bill no/i.test(t))return 'UPI payment';
  if(/electric|kwh|units consumed/i.test(t))return 'Electricity bill';
  if(/water (bill|board|supply)/i.test(t))return 'Water bill';
  if(/broadband|postpaid|prepaid|recharge|mobile bill/i.test(t))return 'Phone / internet bill';
  if(/petrol|diesel|fuel/i.test(t))return 'Fuel receipt';
  if(cat==='Rent')return 'Rent receipt';
  if(cat==='Health')return 'Medical bill';
  if(cat==='Dining')return 'Restaurant bill';
  if(/\bhotel\b|resort|check.?in/i.test(t))return 'Hotel invoice';
  if(/tax invoice|gstin|gst no/i.test(t))return 'GST tax invoice';
  return 'Retail receipt';
}
var NUM_RE=/(?:rs\.?|inr|₹)?\s*(\d{1,3}(?:,\d{2,3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)(?![\d%])/gi;
function numsIn(line){var out=[],m;NUM_RE.lastIndex=0;while((m=NUM_RE.exec(line))){var v=parseFloat(m[1].replace(/,/g,''));if(isFinite(v))out.push({v:v,dec:/\.\d{2}$/.test(m[1])||/rs|inr|₹/i.test(m[0])});}return out;}
function parseDateText(t){
  var M={jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12},now=new Date(),c=[],m;
  var re1=/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b/g;while((m=re1.exec(t)))c.push([+m[3],+m[2],+m[1]]);
  var re2=/\b(20\d{2})[\/\-.](\d{1,2})[\/\-.](\d{1,2})\b/g;while((m=re2.exec(t)))c.push([+m[1],+m[2],+m[3]]);
  var re3=/\b(\d{1,2})(?:st|nd|rd|th)?[\s\-]*(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*[\s,\-']*(\d{2,4})\b/gi;while((m=re3.exec(t)))c.push([+m[3],M[m[2].toLowerCase()],+m[1]]);
  var re4=/\b(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})\b/gi;while((m=re4.exec(t)))c.push([+m[3],M[m[1].toLowerCase()],+m[2]]);
  for(var i=0;i<c.length;i++){var y=c[i][0];if(y<100)y+=2000;var s=y+'-'+pad(c[i][1])+'-'+pad(c[i][2]);
    if(validDate(s)&&pd(s)<=new Date(now.getTime()+864e5)&&y>=now.getFullYear()-15)return s;}
  return null;
}
function parseBillText(raw){
  var text=String(raw||'').replace(/\r/g,'');
  var lines=text.split('\n').map(function(l){return l.replace(/\t+/g,'  ').replace(/\s{2,}/g,'  ').trim();}).filter(Boolean);
  if(!lines.length)return {is_bill:false};
  var flat=lines.join('\n');
  // amount: grand/net total beats plain total; skip sub-totals, quantities and tax lines
  var best=null,bestRank=-1;
  lines.forEach(function(l,i){
    if(/sub\s*-?\s*total|total\s*(qty|quantity|items?|savings?|discount|tax|gst)|no\.?\s*of\s*items|\bqty\b/i.test(l))return;
    var rank=/grand\s*total|net\s*(payable|amount|amt|total|to pay)|amount\s*(payable|due|paid)|total\s*(payable|due|amount|amt|rs|inr)|bill\s*amount|to\s*pay|you\s*paid|paid\s*amount/i.test(l)?3:/\btotal\b|\bamount\b|\bamt\b|\bnet\b/i.test(l)?2:-1;
    if(rank<0)return;
    var ns=numsIn(l);if(!ns.length&&lines[i+1])ns=numsIn(lines[i+1]);
    ns=ns.filter(function(n){return n.v>0&&n.v<1e7;});if(!ns.length)return;
    var v=ns[ns.length-1].v;
    if(rank>bestRank||(rank===bestRank&&i>best.i)){best={v:v,i:i};bestRank=rank;}
  });
  var amount=null,amtConf=0.4;
  if(best){amount=best.v;amtConf=bestRank===3?0.9:0.82;}
  else{var all=[];lines.forEach(function(l){if(/gstin|phone|ph\b|mob|tel|bill no|invoice no|date|time|\d{1,2}:\d{2}/i.test(l))return;numsIn(l).forEach(function(n){if(n.dec)all.push(n.v);});});
    if(all.length){amount=Math.max.apply(null,all);amtConf=0.5;}}
  // date
  var date=parseDateText(flat);
  // vendor: first name-like line near the top
  var vendor='',vConf=0.5;
  for(var i=0;i<Math.min(6,lines.length);i++){var l=lines[i];
    if(/tax invoice|^invoice|receipt|cash memo|bill of supply|original|duplicate|gstin|gst no|fssai|phone|\bph\s*[:.]|\bmob(ile)?\b|\btel\b|www\.|@|\bdate\b|\btime\b|bill no|welcome|^\W*$/i.test(l))continue;
    var letters=(l.match(/[a-z]/gi)||[]).length;if(letters<3||letters<l.replace(/\s/g,'').length*0.5)continue;
    vendor=l.replace(/\s{2,}.*/,'').replace(/[^\w&'.,\- ]/g,'').trim();
    if(vendor===vendor.toUpperCase()&&vendor.length>3)vendor=vendor.toLowerCase().replace(/\b[a-z]/g,function(c){return c.toUpperCase();});
    vConf=i===0?0.82:0.62;break;}
  // category + bill type
  var cat='Other',cConf=0.3,vt=(vendor+'\n'+flat);
  for(var k=0;k<CAT_WORDS.length;k++){if(CAT_WORDS[k][1].test(vt)){cat=CAT_WORDS[k][0];cConf=CAT_WORDS[k][1].test(vendor)?0.85:0.65;break;}}
  var rule=S.rules[rkey(vendor)];if(rule){cat=rule;cConf=1;}
  // items: priced lines between the header and the total
  var stop=best?best.i:lines.length,items=[];
  for(var j=0;j<stop&&items.length<4;j++){var ln=lines[j];
    if(/total|gst|cgst|sgst|igst|vat|tax|discount|round|change|cash|upi|card|date|bill no|invoice|gstin|phone|mrp|qty|rate|amount|hsn/i.test(ln))continue;
    if(/\bno\b|consum|units|due|account|\bid\b|ref|meter|reading|period|table|guest|order/i.test(ln))continue;
    var nm=ln.replace(/(?:rs\.?|₹)?\s*\d[\d,]*(?:\.\d{1,2})?\s*$/,'').trim();var ns2=numsIn(ln).filter(function(n){return n.dec;});
    if(nm.length>=3&&/[a-z]{3}/i.test(nm)&&ns2.length){items.push(nm.replace(/\s{2,}/g,' ')+' — '+num(ns2[ns2.length-1].v));}}
  var bt=typeFor(flat,cat);
  var billish=amount!=null&&(best||/total|amount|bill|invoice|receipt|gst|cash|paid|qty|\u20B9|rs\.?\s*\d/i.test(flat));
  return {is_bill:!!billish,vendor:vendor,bill_type:bt,amount:amount,currency:/\$|usd/i.test(flat)&&!/₹|rs\.?|inr/i.test(flat)?'USD':'INR',date:date,category:cat,items:items.join(', '),raw_text:lines.join('\n').slice(0,2000),
    confidence:{vendor:vConf,bill_type:bt==='Retail receipt'?0.6:0.82,amount:amount==null?0:amtConf,date:date?0.85:0,category:cConf,items:items.length?0.55:0}};
}

/* ---------------- reading pipeline: Claude when available, else OCR.space / text parser ---------------- */
function isLive(d){return S.draft===d||(!!S.multi&&S.multi.indexOf(d)>=0);}
function claudeRead(d,sample){
  var useImg=!!d.blob&&!(d.pdfText&&d.pdfText.trim().length>40);
  return (useImg?sample.limits().catch(function(){return null;}):Promise.resolve({images:1})).then(function(l){
    if(useImg&&!(l&&l.images))throw {code:'noimg'};
    S.ctl=mkCtl();var o={signal:S.ctl.signal};if(useImg)o.images=d.blob;
    return sample.json(prompt(useImg?'':(d.pdfText||d.pasted),useImg),o).then(function(r){if(isLive(d)){d.engine='Claude';applyResult(d,r);}});
  });
}
function localRead(d){
  var nb=function(e){if(e&&e.code==='empty_completion')d.notBill=true;throw e;};
  var txt=(d.pdfText&&d.pdfText.trim().length>40)?d.pdfText:(d.blob?null:d.pasted);
  if(txt!=null)return Promise.resolve().then(function(){if(isLive(d)){d.engine='text reader';applyResult(d,parseBillText(txt));}});
  if(!window.RK_ocr)return Promise.reject({code:'unavailable'});
  S.ctl=mkCtl();
  return window.RK_ocr(d.blob,{signal:S.ctl.signal}).catch(nb).then(function(t){if(!isLive(d))return;d.engine='OCR.space';if(!d.text)d.text=String(t).slice(0,2000);applyResult(d,parseBillText(t));});
}
function runExtract(d){
  d.status='reading';d.engine='';if(S.route.name==='confirm')render();
  var fail=function(e){if(!isLive(d))return;d.status='failed';d.note=(e&&e.code==='cancelled')?'Stopped. Fill in the details yourself.':failNote(e&&e.code);};
  return getSample().then(function(sample){
    var claudeOk=!!sample&&(!window.RK_key||!!window.RK_key.get());
    var canLocal=!!window.RK_ocr||!(d.blob&&!(d.pdfText&&d.pdfText.trim().length>40));
    if(!claudeOk)return canLocal?localRead(d).catch(fail):fail({code:window.RK_key?'no_key':'unavailable'});
    return claudeRead(d,sample).catch(function(e){
      if(!isLive(d)||(e&&e.code==='cancelled'))return fail(e);
      return canLocal?localRead(d).catch(function(){fail(e);}):fail(e);
    });
  }).catch(fail).then(function(){if(isLive(d)){if(S.route.name==='confirm'&&isLive(d))render();else if(S.route.name==='multi')render();}});
}
function toConfirm(){if(S.route.name==='confirm')render();else go('confirm');}
/* ================= live scanner (camera → edge detection → Lens-style scan) ================= */
var SC={mode:'auto',parts:[],boxes:[],stream:null,raf:0,timer:0,box:null,shown:null,stable:0,auto:true,torch:false,torchOk:false,busy:false,batch:[],ok:null,err:'',t0:0};
function toWidth(c,W){var o=document.createElement('canvas');o.width=W;o.height=Math.max(1,Math.round(c.height*W/c.width));var x=o.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,o.width,o.height);return o;}
function rowsGray(c,w){var sm=toWidth(c,w),h=sm.height,d=sm.getContext('2d').getImageData(0,0,w,h).data,g=new Float32Array(w*h);for(var i=0;i<w*h;i++)g[i]=0.299*d[i*4]+0.587*d[i*4+1]+0.114*d[i*4+2];return {g:g,w:w,h:h};}
function overlapPx(A,B){ // how many pixels of B's top already appear at A's bottom (mean-normalised matching at 200px width)
  var w=200,a=rowsGray(A,w),b=rowsGray(B,w),band=Math.max(12,Math.round(Math.min(b.h,a.h)*0.32)),minL=Math.max(8,Math.round(Math.min(b.h,a.h)*0.08)),best=1e9,by=-1,x,r,x0=8,x1=w-8;
  for(var y=Math.round(a.h*0.04);y<=a.h-minL;y++){var L=Math.min(band,a.h-y),am=0,bm=0;
    for(r=0;r<L;r++)for(x=x0;x<x1;x+=2){am+=a.g[(y+r)*w+x];bm+=b.g[r*w+x];}var n=L*((x1-x0)/2);am/=n;bm/=n;
    var sum=0;for(r=0;r<L;r++){var ra=(y+r)*w,rb=r*w;for(x=x0;x<x1;x+=2)sum+=Math.abs((a.g[ra+x]-am)-(b.g[rb+x]-bm));}
    var sc=sum/n*(1+0.35*(1-L/band));if(sc<best){best=sc;by=y;}}
  return (by>=0&&best<14)?Math.round((a.h-by)*A.width/w):0;}
function stitchParts(cs){var W=1100,im=cs.map(function(c){return toWidth(c,W);}),off=[0];
  for(var i=1;i<im.length;i++)off.push(off[i-1]+im[i-1].height-overlapPx(im[i-1],im[i]));
  var out=document.createElement('canvas');out.width=W;out.height=off[im.length-1]+im[im.length-1].height;var x=out.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,out.height);
  im.forEach(function(c,i){x.drawImage(c,0,off[i]);});return out;}
function nextQueued(){var nx=S.queue.shift();if(nx.c)beginBase(nx.c,nx.src,{fx:false,pre:nx.pre});else beginFile(nx.f,nx.src);}
function attachRescan(d){var o=S.rescanId&&billById(S.rescanId);if(!o)return;d.replaceId=o.id;d.folder=o.folder;d.dupChecked=true;
  d.fields={vendor:o.vendor,type:o.type||'',amount:o.amount==null?'':String(o.amount),date:o.date,category:o.category,items:o.items||''};}
function beginBase(base,src,opt){
  opt=opt||{};var d=newDraft(src);attachRescan(d);d.base=base;d.mode='scan';d.crop=!opt.pre;d.rot=0;S.draft=d;
  if(!opt.fx){toConfirm();return regen(d).then(function(){return runExtract(d);});}
  // Lens-style reveal: runs while the scan is cleaned up and the bill is read
  S.fx={orig:null,scan:null,dots:[],ratio:1.4};S.hist=[{name:'vault',params:{}}];S.route={name:'scanfx',params:{}};render();
  var t0=Date.now(),src2=drawTo(base,1700),orig=enhance(src2,'original',!opt.pre);
  S.fx.orig=orig.toDataURL('image/jpeg',0.8);S.fx.ratio=orig.height/orig.width;paintFx();
  return regen(d).then(function(){
    if(S.draft!==d)return;
    S.fx.scan=d.img;S.fx.dots=lensDots(d);paintFx();
    var readDone=false,minDone=false,finish=function(){
      if(!readDone||!minDone||S.draft!==d||S.route.name!=='scanfx')return;
      if(d.notBill){var l=$('#fxLabel');if(l){l.textContent='No bill found';l.classList.add('bad');}
        var ft=$('.fxFoot');if(ft)ft.textContent='Nothing was saved. Point the camera at a bill and try again.';
        setTimeout(function(){if(S.draft!==d)return;S.draft=null;S.queue=[];S.batchTotal=0;S.hist=[{name:'vault',params:{}}];S.route={name:'camera',params:{}};render();},1600);return;}
      S.route={name:'confirm',params:{}};render();};
    runExtract(d).then(function(){readDone=true;finish();});
    setTimeout(function(){minDone=true;finish();},Math.max(0,2300-(Date.now()-t0)));
    setTimeout(function(){if(!readDone){readDone=true;finish();}},9000);
  });
}
function lensDots(d){ // dots land on the darkest (inked) spots of the scan, like Google Lens
  var c=drawTo(rotateCanvas(d.base,d.rot),160),e=enhance(c,'scan',d.crop),W=e.width,H=e.height,g=e.getContext('2d').getImageData(0,0,W,H).data,pts=[];
  var mx=Math.round(W*0.07),my=Math.round(H*0.05);for(var y=my;y<H-my;y+=3)for(var x=mx;x<W-mx;x+=3){var v=g[(y*W+x)*4];if(v<110)pts.push([x/W,y/H]);}
  for(var i=pts.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=pts[i];pts[i]=pts[j];pts[j]=t;}
  var out=[];for(i=0;i<pts.length&&out.length<46;i++){var p=pts[i];if(out.every(function(q){return Math.abs(q[0]-p[0])+Math.abs(q[1]-p[1])>0.06;}))out.push(p);}
  while(out.length<24)out.push([0.15+Math.random()*0.7,0.1+Math.random()*0.8]);
  return out;
}
function fxScreen(){
  return '<div class="fx" id="fx"><div class="fxTop"><span class="fxPill" id="fxLabel">Scanning…</span></div>'+
    '<div class="fxStageWrap"><div class="fxStage" id="fxStage"></div></div>'+
    '<div class="fxFoot">Cleaning up faded ink and reading the details</div></div>';
}
function paintFx(){
  var st=$('#fxStage');if(!st||!S.fx)return;var f=S.fx;
  var wr=st.parentNode.getBoundingClientRect(),aw=Math.max(80,wr.width-52),ah=Math.max(80,wr.height-16),w=Math.min(aw,ah/f.ratio);st.style.width=Math.round(w)+'px';st.style.height=Math.round(w*f.ratio)+'px';
  st.innerHTML=(f.orig?'<img class="fxOrig" src="'+f.orig+'" alt="">':'')+(f.scan?'<img class="fxScan" src="'+f.scan+'" alt="Cleaned scan">':'')+
    '<div class="fxBeam"></div><div class="fxDots">'+f.dots.map(function(p,i){return '<i style="left:'+(p[0]*100).toFixed(1)+'%;top:'+(p[1]*100).toFixed(1)+'%;animation-delay:'+(120+i*22+Math.round(p[1]*380))+'ms,'+(900+i*22)+'ms"></i>';}).join('')+'</div>';
  if(f.scan)st.classList.add('go');
  setTimeout(function(){var l=$('#fxLabel');if(l)l.textContent='Reading bill…';},1100);
}
function scannerScreen(){
  var n=SC.batch.length,last=n?SC.batch[n-1].thumb:null;
  return '<div class="scanner" id="scanner">'+
    '<video id="scanVideo" playsinline muted autoplay></video><canvas id="scanOverlay"></canvas><div class="scanFlash" id="scanFlash"></div>'+
    '<div class="scanTop"><button class="scBtn" data-act="closeCamera" aria-label="Close scanner">'+ic('x')+'</button>'+
      '<span class="scPill" id="scanHint">Starting camera…</span>'+
      '<button class="scBtn" id="torchBtn" data-act="torch" aria-label="Flash" aria-pressed="'+SC.torch+'"'+(SC.torchOk?'':' hidden')+'><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3L6 13h5l-1 8 7-10h-5z"'+(SC.torch?' fill="currentColor"':'')+'/></svg></button></div>'+
    '<div class="scNoCam" id="scNoCam" hidden><b>Live camera isn’t available here</b><span id="scNoCamWhy">Take a photo instead. The scan clean-up still runs.</span>'+
      '<div class="scNoCamBtns"><button class="btnPrimary" data-act="shootFallback">Take photo</button><button class="btnSecondary" data-act="pick" data-a="image">Choose from gallery</button></div></div>'+
    '<div class="scanBottom">'+
      (SC.mode==='long'&&SC.parts.length?'<div class="scParts">'+SC.parts.map(function(p,i){return '<img src="'+p.thumb+'" alt="Part '+(i+1)+'" style="animation-delay:'+(i?0:0)+'ms">';}).join('')+'</div>':'')+
      '<div class="scModes" role="group" aria-label="Capture mode">'+[['auto','Auto'],['manual','Manual'],['long','Long']].map(function(m){return '<button data-act="scanMode2" data-a="'+m[0]+'" class="'+(SC.mode===m[0]?'on':'')+'">'+m[1]+'</button>';}).join('')+'</div>'+
      '<div class="scRow">'+
        '<button class="scStack'+(n?'':' empty')+'" data-act="'+(n?'scanDone':'pick')+'" data-a="image" aria-label="'+(n?'Review '+n+' scans':'Choose from gallery')+'">'+(last?'<img src="'+last+'" alt=""><b>'+n+'</b>':ic('img'))+'</button>'+
        '<button class="scShutter" data-act="snap" aria-label="Capture"><svg viewBox="0 0 80 80" aria-hidden="true"><circle class="scRing" cx="40" cy="40" r="37"/><circle class="scRingFill" id="scRing" cx="40" cy="40" r="37"/></svg><span></span></button>'+
        (SC.mode==='long'?'<button class="scDone'+(SC.parts.length?'':' ghost')+'" data-act="longFinish"'+(SC.parts.length?'':' disabled')+'>Finish'+(SC.parts.length?' ('+SC.parts.length+')':'')+'</button>':
        '<button class="scDone'+(n?'':' ghost')+'" data-act="'+(n?'scanDone':'scanBatch')+'">'+(n?'Done ('+n+')':(S.batchMode?'Batch \u2713':'Batch'))+'</button>')+
      '</div></div></div>';
}
function scanHint(t){var h=$('#scanHint');if(h&&h.textContent!==t)h.textContent=t;}
function startScanner(){
  var v=$('#scanVideo');if(!v)return;
  if(SC.stream){v.srcObject=SC.stream;v.play().catch(function(){});loopScanner();return;}
  if(SC.ok===false){noCam();return;}
  if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){SC.ok=false;noCam();return;}
  navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:2560},height:{ideal:1440}}}).then(function(s){
    if(S.route.name!=='camera'){s.getTracks().forEach(function(t){t.stop();});return;}
    SC.stream=s;SC.ok=true;var tr=s.getVideoTracks()[0];
    try{var cap=tr.getCapabilities&&tr.getCapabilities();SC.torchOk=!!(cap&&cap.torch);var tb=$('#torchBtn');if(tb)tb.hidden=!SC.torchOk;}catch(e){}
    var v2=$('#scanVideo');if(v2){v2.srcObject=s;v2.play().catch(function(){});}
    loopScanner();
  },function(e){SC.ok=false;SC.err=e&&e.name||'';noCam();});
}
function noCam(){
  var n=$('#scNoCam');if(!n)return;
  // In the Android app, fall straight back to the phone's own camera
  if(window.RK_camera&&SC.err!=='NotAllowedError'&&!SC.fellBack){SC.fellBack=true;A.shootFallback();return;}
  n.hidden=false;scanHint('Take or choose a photo');
  if(SC.err==='NotAllowedError')$('#scNoCamWhy').textContent='Camera permission is off. Allow it in settings, or take a photo instead.';
  drawOverlay(0);
}
function stopScanner(){
  cancelAnimationFrame(SC.raf);clearTimeout(SC.timer);SC.raf=0;
  if(SC.stream){SC.stream.getTracks().forEach(function(t){t.stop();});SC.stream=null;}
  SC.box=null;SC.shown=null;SC.stable=0;SC.torch=false;
}
function detectFrame(v){
  var vw=v.videoWidth,vh=v.videoHeight;if(!vw)return null;
  var c=SC.dc||(SC.dc=document.createElement('canvas')),s=260/Math.max(vw,vh);c.width=Math.round(vw*s);c.height=Math.round(vh*s);
  c.getContext('2d').drawImage(v,0,0,c.width,c.height);
  return findQuads(c,6);
}
function loopScanner(){
  cancelAnimationFrame(SC.raf);clearTimeout(SC.timer);
  var tick=function(){
    var v=$('#scanVideo');if(!v||S.route.name!=='camera')return;
    if(!SC.busy){
      var all=detectFrame(v)||[],nb=all.length?all[0]:null,prev=SC.box,pc=(SC.boxes||[]).length;SC.boxes=all;
      var mv=0;if(nb&&prev)for(var ci=0;ci<4;ci++)mv+=Math.abs(nb[ci][0]-prev[ci][0])+Math.abs(nb[ci][1]-prev[ci][1]);
      if(nb&&prev&&mv<0.06&&all.length===pc)SC.stable++;else SC.stable=0;SC.miss=nb?0:(SC.miss||0)+1;
      SC.box=nb;
      if(!nb&&SC.mode==='long')scanHint(SC.parts.length?'Part '+(SC.parts.length+1)+': move down, keep a little overlap, then tap':'Long receipt: point at the top of it, then tap');
      else if(!nb)scanHint(SC.miss>25?'No bill in view':'Looking for a bill\u2026');
      else if(SC.mode==='long')scanHint(SC.parts.length?'Part '+(SC.parts.length+1)+': move down, keep a little overlap, then tap':'Long receipt: start at the top, then tap');
      else if(all.length>1)scanHint(all.length+' bills found'+(SC.auto?(SC.stable>2?' \u2014 hold steady\u2026':''):' \u2014 tap to scan all'));
      else if(SC.auto)scanHint(SC.stable>2?'Hold steady\u2026':'Bill found');
      else scanHint('Bill found \u2014 tap to capture');
      var need=10,ring=$('#scRing');
      if(ring)ring.style.strokeDashoffset=String(232.5*(1-(SC.auto&&SC.mode!=='long'&&nb?Math.min(1,SC.stable/need):0)));
      if(SC.auto&&SC.mode!=='long'&&nb&&SC.stable>=need){SC.stable=0;snap();}
    }
    SC.timer=setTimeout(tick,110);
  };
  tick();
  var draw=function(t){drawOverlay(t);SC.raf=requestAnimationFrame(draw);};SC.raf=requestAnimationFrame(draw);
}
function drawOverlay(t){
  var cv=$('#scanOverlay'),v=$('#scanVideo');if(!cv)return;
  var W=cv.clientWidth,H=cv.clientHeight,dpr=window.devicePixelRatio||1;
  if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  var x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
  var tg=[],found=false,boxes=SC.boxes||[];
  if(boxes.length&&v&&v.videoWidth){var vw=v.videoWidth,vh=v.videoHeight,s=Math.max(W/vw,H/vh),ox=(W-vw*s)/2,oy=(H-vh*s)/2;
    tg=boxes.map(function(q){return q.map(function(p){return [ox+p[0]*vw*s,oy+p[1]*vh*s];});});found=true;}
  else{var gw=W*0.68,gh=Math.min(H*(SC.mode==='long'?0.66:0.55),gw*(SC.mode==='long'?2.2:1.45)),br=1+0.012*Math.sin((t||0)/450),gx=(W-gw*br)/2,gy=H*0.43-gh*br/2;
    tg=[[[gx,gy],[gx+gw*br,gy],[gx+gw*br,gy+gh*br],[gx,gy+gh*br]]];}
  var sh=SC.shown;if(!sh||!sh.q)sh=SC.shown={q:[],a:0};
  while(sh.q.length<tg.length)sh.q.push((sh.q[0]||tg[sh.q.length]).map(function(p){return p.slice();}));
  sh.q.length=tg.length;
  sh.a+=((found?1:0)-sh.a)*0.15;
  var accent='244,214,85',al=sh.a;
  sh.q.forEach(function(P,qi){for(var i=0;i<4;i++){P[i][0]+=(tg[qi][i][0]-P[i][0])*0.25;P[i][1]+=(tg[qi][i][1]-P[i][1])*0.25;}});
  var poly=function(P){x.beginPath();x.moveTo(P[0][0],P[0][1]);for(var j=1;j<4;j++)x.lineTo(P[j][0],P[j][1]);x.closePath();};
  if(al>0.02){
    x.save();x.fillStyle='rgba(0,0,0,'+(0.45*al)+')';x.beginPath();x.rect(0,0,W,H);
    sh.q.forEach(function(P){x.moveTo(P[0][0],P[0][1]);for(var j=3;j>=1;j--)x.lineTo(P[j][0],P[j][1]);x.closePath();});x.fill('evenodd');x.restore();
    sh.q.forEach(function(P,qi){
      x.fillStyle='rgba('+accent+','+(0.16*al)+')';poly(P);x.fill();
      x.strokeStyle='rgba('+accent+','+(0.95*al)+')';x.lineWidth=2.5;x.lineJoin='round';poly(P);x.stroke();
      var top=Math.min(P[0][1],P[1][1]),bot=Math.max(P[2][1],P[3][1]),pr=(((t||0)+qi*300)%1800)/1800,by=top+(bot-top)*pr,gr=x.createLinearGradient(0,by-40,0,by+6);
      gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(255,255,255,'+(0.3*al)+')');
      x.save();poly(P);x.clip();x.fillStyle=gr;x.fillRect(0,by-40,W,46);x.restore();
      if(sh.q.length>1){var cx=(P[0][0]+P[1][0]+P[2][0]+P[3][0])/4,cy=(P[0][1]+P[1][1]+P[2][1]+P[3][1])/4;
        x.fillStyle='rgba(244,214,85,'+al+')';x.beginPath();x.arc(cx,cy,13,0,7);x.fill();x.fillStyle='rgba(23,23,23,'+al+')';x.font='700 13px -apple-system,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(qi+1),cx,cy+0.5);}
    });
  }
  x.strokeStyle='rgba(255,255,255,'+(0.95-0.2*al)+')';x.lineWidth=4;x.lineCap='round';x.lineJoin='round';
  sh.q.forEach(function(P){for(var i=0;i<4;i++){var c=P[i],n=P[(i+1)%4],pv=P[(i+3)%4],L=Math.min(30,Math.hypot(n[0]-c[0],n[1]-c[1])*0.22,Math.hypot(pv[0]-c[0],pv[1]-c[1])*0.22);
    var u1=[(n[0]-c[0]),(n[1]-c[1])],u2=[(pv[0]-c[0]),(pv[1]-c[1])],l1=Math.hypot(u1[0],u1[1])||1,l2=Math.hypot(u2[0],u2[1])||1;
    x.beginPath();x.moveTo(c[0]+u1[0]/l1*L,c[1]+u1[1]/l1*L);x.lineTo(c[0],c[1]);x.lineTo(c[0]+u2[0]/l2*L,c[1]+u2[1]/l2*L);x.stroke();}});
}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
function snap(){
  var v=$('#scanVideo');if(!v||!v.videoWidth||SC.busy)return;
  if(!SC.box&&SC.mode!=='long'){var sb=$('.scShutter');if(sb){sb.classList.remove('nope');void sb.offsetWidth;sb.classList.add('nope');}scanHint('No bill in view \u2014 point the camera at a bill');return;}
  SC.busy=true;var f=$('#scanFlash');if(f){f.classList.remove('on');void f.offsetWidth;f.classList.add('on');}
  var c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);
  var base=drawTo(c,2600),boxes=(SC.boxes||[]).slice();
  if(SC.mode==='long'){
    var part=boxes.length?warpQuad(base,boxes[0]):base;
    SC.parts.push({c:part,thumb:drawTo(part,90).toDataURL('image/jpeg',0.7)});
    setTimeout(function(){SC.busy=false;if(S.route.name==='camera')render();},380);
    toast('Part '+SC.parts.length+' captured.'+(SC.parts.length>1?' Tap Finish when you reach the end.':' Move down to the next part.'));return;
  }
  if(boxes.length>1&&!S.rescanId){
    var cuts=boxes.map(function(q){return warpQuad(base,q);});
    if(S.batchMode){cuts.forEach(function(cc){SC.batch.push({c:cc,thumb:drawTo(cc,120).toDataURL('image/jpeg',0.7),pre:true});});
      setTimeout(function(){SC.busy=false;if(S.route.name==='camera')render();},420);toast(cuts.length+' bills added. Keep going, or tap Done.');return;}
    setTimeout(function(){SC.busy=false;stopScanner();startMulti(cuts,'Camera scan');},160);return;
  }
  if(S.batchMode&&!S.rescanId){
    SC.batch.push({c:base,thumb:drawTo(enhance(drawTo(base,300),'scan',true),120).toDataURL('image/jpeg',0.7)});
    setTimeout(function(){SC.busy=false;if(S.route.name==='camera'){render();}},420);
    toast('Scan '+SC.batch.length+' added. Keep going, or tap Done.');return;
  }
  setTimeout(function(){SC.busy=false;stopScanner();beginBase(base,'Camera scan',{fx:true});},160);
}

function beginFile(file,src){
  var d=newDraft(src);attachRescan(d);S.draft=d;toConfirm();
  return prepFile(file).then(function(p){
    if(S.draft!==d)return;d.base=p.canvas;d.mode=p.isPdf?'original':'scan';d.crop=!p.isPdf;d.rot=0;S.lastThumb=null;
    d.pdfText=p.pdfText||'';if(d.pdfText)d.text=d.pdfText.slice(0,2000);
    return regen(d).then(function(){return runExtract(d);});
  },function(){if(S.draft!==d)return;d.status='failed';d.note=/pdf/i.test(file.type||file.name)?"Couldn't open that PDF. Fill in the details yourself, or use a screenshot of it.":"Couldn't open that image. Try a JPG, PNG or WebP, or fill in the details.";render();});
}
function startFiles(files,src){
  files=Array.prototype.slice.call(files||[]).filter(function(f){return /^image\//.test(f.type)||f.type==='application/pdf'||/\.(jpe?g|png|webp|gif|heic|pdf)$/i.test(f.name);});
  if(!files.length){toast('Pick an image or PDF file.');return;}
  S.queue=files.slice(1).map(function(f){return {f:f,src:src};});S.batchTotal=files.length;S.batchDone=0;beginFile(files[0],src);
}
function startText(text,src){var d=newDraft(src);d.pasted=text;d.text=text.slice(0,2000);S.queue=[];S.batchTotal=1;S.batchDone=0;S.draft=d;S.sheet=null;toConfirm();runExtract(d);}
function startManual(){var d=newDraft('Manual entry');d.status='manual';S.queue=[];S.batchTotal=1;S.batchDone=0;S.draft=d;toConfirm();}
function readFields(){var d=S.draft;if(!d)return;FIELDS.forEach(function(f){var el=$('#f_'+f);if(el)d.fields[f]=el.value;});}
function findDup(d){
  var v=rkey(d.fields.vendor),a=parseFloat(String(d.fields.amount).replace(/,/g,''));if(!v||!isFinite(a))return null;
  return S.bills.find(function(b){if(b.amount==null||Number(b.amount)!==a)return false;var bv=rkey(b.vendor);
    if(!(bv===v||bv.indexOf(v)>=0||v.indexOf(bv)>=0))return false;return Math.abs(pd(b.date)-pd(d.fields.date||today()))<=3*864e5;})||null;
}
function trySave(folderId){
  var d=S.draft;if(!d)return;readFields();if(folderId!==undefined)d.folder=folderId||null;
  if(!d.dupChecked){var dup=findDup(d);if(dup){S.dialog={t:'dup',id:dup.id};renderOverlay();return;}}
  commit();
}
function cropScreen(){
  return '<div class="cropper"><div class="cropTop"><button class="cropTxt" data-act="cropCancel">Cancel</button><b>Adjust corners</b><button class="cropTxt pri" data-act="cropApply">Apply</button></div>'+
    '<div class="cropStage" id="cropStage"><canvas id="cropImg"></canvas><svg id="cropSvg" aria-hidden="true"></svg>'+
    [0,1,2,3].map(function(i){return '<button class="cH" data-i="'+i+'" aria-label="Corner '+(i+1)+'"></button>';}).join('')+'<canvas id="loupe" class="loupe" width="220" height="220"></canvas></div>'+
    '<div class="cropBar"><button data-act="cropAuto">'+ic('rescan')+'<span>Auto-detect</span></button><button data-act="cropFull">'+ic('img')+'<span>Whole photo</span></button><button data-act="cropRot"><span style="font-size:17px;line-height:17px;">\u21BB</span><span>Rotate</span></button></div>'+
    '<p class="cropHelp">Drag the corners onto the bill\u2019s edges. Hold a corner to zoom in.</p></div>';
}
function paintCrop(){
  var d=S.draft,st=$('#cropStage');if(!d||!d.base||!st)return;
  var src=drawTo(rotateCanvas(d.base,d.rot),1600),r=st.getBoundingClientRect(),pad=22,sc=Math.min((r.width-pad*2)/src.width,(r.height-pad*2)/src.height);
  var w=Math.round(src.width*sc),h=Math.round(src.height*sc),ox=Math.round((r.width-w)/2),oy=Math.round((r.height-h)/2),dpr=window.devicePixelRatio||1;
  var cv=$('#cropImg');cv.width=w*dpr;cv.height=h*dpr;cv.style.cssText='left:'+ox+'px;top:'+oy+'px;width:'+w+'px;height:'+h+'px';
  var cx=cv.getContext('2d');cx.imageSmoothingQuality='high';cx.drawImage(src,0,0,cv.width,cv.height);
  var pts=S.cropPts||(S.cropPts=(d.quad||findQuad(src)||[[0.04,0.04],[0.96,0.04],[0.96,0.96],[0.04,0.96]]).map(function(p){return p.slice();}));
  S.cropGeo={src:src,w:w,h:h,ox:ox,oy:oy};layoutCrop();
}
function layoutCrop(){
  var g=S.cropGeo,P=S.cropPts;if(!g)return;var px=P.map(function(p){return [g.ox+p[0]*g.w,g.oy+p[1]*g.h];});
  document.querySelectorAll('#cropStage .cH').forEach(function(hd,i){hd.style.transform='translate('+(px[i][0]-16)+'px,'+(px[i][1]-16)+'px)';});
  var sv=$('#cropSvg'),st=$('#cropStage').getBoundingClientRect(),poly=px.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' ');
  sv.setAttribute('viewBox','0 0 '+st.width+' '+st.height);
  sv.innerHTML='<path d="M0 0H'+st.width+'V'+st.height+'H0Z M'+px.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' L')+'Z" fill="rgba(0,0,0,.55)" fill-rule="evenodd"/>'+
    '<polygon points="'+poly+'" fill="rgba(244,214,85,.12)" stroke="#F4D655" stroke-width="2" stroke-linejoin="round"/>';
}
function cropValid(P){var a=0;for(var i=0;i<4;i++){var A=P[i],B=P[(i+1)%4];a+=A[0]*B[1]-B[0]*A[1];}if(Math.abs(a)/2<0.02)return false;
  for(i=0;i<4;i++){var p0=P[i],p1=P[(i+1)%4],p2=P[(i+2)%4],cr=(p1[0]-p0[0])*(p2[1]-p1[1])-(p1[1]-p0[1])*(p2[0]-p1[0]);if(cr<=0)return false;}return true;}
function saveAnim(b,done){
  var host=$('#screenStack');if(!host||window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){done();return;}
  var el=document.createElement('div');el.className='svAnim';
  el.innerHTML='<div class="svDoc">'+(b.img?'<img src="'+b.img+'" alt="">':'<div class="svBlank"></div>')+'<span class="svBadge">PDF</span></div>'+
    '<div class="svFolder"><svg viewBox="0 0 64 52" aria-hidden="true"><path class="svBack" d="M4 8a4 4 0 014-4h16l6 6h26a4 4 0 014 4v30a4 4 0 01-4 4H8a4 4 0 01-4-4z"/><path class="svFront" d="M2 20a4 4 0 014-4h52a4 4 0 014 4l-3 24a4 4 0 01-4 4H9a4 4 0 01-4-4z"/></svg><span>'+esc(b.folder?(folderName(b.folder)||b.category):b.category)+'</span></div>'+
    '<div class="svCheck"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></div>';
  host.appendChild(el);
  setTimeout(function(){el.classList.add('out');},1650);
  setTimeout(function(){el.remove();done();},1900);
}
function billFromDraft(d){var F=d.fields,a=parseFloat(String(F.amount).replace(/,/g,''));
  return {id:d.id,vendor:(F.vendor||'').trim()||'Untitled bill',amount:isFinite(a)?a:null,currency:d.currency||'INR',date:validDate(F.date)||today(),
    category:CATS.indexOf(F.category)>=0?F.category:'Other',type:(F.type||'').trim(),items:(F.items||'').trim(),imgW:d.w||null,imgH:d.h||null,scanMode:d.mode||null,text:d.text||'',folder:d.folder||null,source:d.src,createdAt:Date.now(),img:d.img,thumb:d.thumb,conf:d.conf};}
function startMulti(bases,src){
  S.multi=bases.map(function(c){var d=newDraft(src);d.base=c;d.mode='scan';d.crop=false;d.rot=0;d.multi=true;d.include=true;return d;});
  S.multiOk=false;S.draft=null;S.hist=[{name:'vault',params:{}}];S.navDir='fade';S.route={name:'multi',params:{}};render();
  var list=S.multi,chain=Promise.resolve();
  list.forEach(function(d){chain=chain.then(function(){return regen(d);}).then(function(){if(S.route.name==='multi')render();});});
  list.forEach(function(d){chain=chain.then(function(){if(S.multi!==list)return;return runExtract(d);}).then(function(){if(d.notBill)d.include=false;if(S.route.name==='multi')render();});});
}
function multiScreen(){
  var L=S.multi||[],reading=L.some(function(d){return d.status==='reading'||!d.img;}),inc=L.filter(function(d){return d.include;}),fl=inc.reduce(function(n,d){return n+flagsOf(d).length;},0);
  var cats={};inc.forEach(function(d){if(d.status!=='reading')cats[d.fields.category]=(cats[d.fields.category]||0)+1;});
  var h='<div class="scr-top"><button class="iconBtn" data-act="multiDiscard" aria-label="Discard all">'+ic('x')+'</button><h3>'+L.length+' bills found</h3><div style="width:24px;"></div></div>';
  var body='<p class="multiIntro">Each bill was cropped on its own and is being read. Each one is filed under its category when you save.</p><div class="mList">'+L.map(function(d,i){
    var F=d.fields,st=d.status==='reading'||!d.img?'reading':d.notBill?'skip':flagsOf(d).length&&d.include?'check':'ok',cc=CAT_COLOR[F.category]||'#888';
    return '<div class="mCard '+st+(d.include?'':' off')+'" style="--cc:'+cc+'"><button class="mMain" data-act="mOpen" data-i="'+i+'" aria-label="Open bill '+(i+1)+'">'+
      '<span class="mNum">'+(i+1)+'</span>'+(d.thumb?'<img src="'+d.thumb+'" alt="">':'<i class="mImg"></i>')+
      (st==='reading'?'<span class="mInfo"><i class="skl w70"></i><i class="skl w40"></i><small>Reading\u2026</small></span>':
       '<span class="mInfo"><b>'+esc(F.vendor||'Unknown shop')+'</b><span class="mAmt">'+(F.amount!==''?esc(sym(d.currency)+num(F.amount)):'No amount')+(F.type?' \u00B7 '+esc(F.type):'')+'</span>'+
       '<span class="mCat"><i class="cDot" style="background:'+cc+'"></i>'+esc(catLabel(F.category))+(st==='check'?'<em>check '+flagsOf(d).length+'</em>':'')+(st==='skip'?'<em class="bad">not a bill</em>':'')+'</span></span>')+
      '</button><button class="mToggle" data-act="mToggle" data-i="'+i+'" aria-pressed="'+d.include+'" aria-label="'+(d.include?'Leave out':'Include')+' bill '+(i+1)+'">'+(d.include?ic('check'):ic('plus'))+'</button></div>';}).join('')+'</div>';
  body+='<label class="allRight" id="mAllRight"'+(fl||S.multiOk?'':' hidden')+'><input type="checkbox" data-act="multiAllRight"'+(S.multiOk?' checked':'')+'><span><b>All details look right'+(fl?' ('+fl+' highlighted)':'')+'</b><small>Or tap a bill to check and edit it first</small></span></label>';
  var can=!reading&&inc.length&&(!fl||S.multiOk),summary=Object.keys(cats).map(function(c){return cats[c]+' '+catLabel(c);}).join(' \u00B7 ');
  return h+'<div class="scr-body" style="padding-bottom:130px;">'+body+'</div><div class="actionBar">'+(summary?'<div class="mSummary">'+esc(summary)+'</div>':'')+
    '<button class="btnPrimary" data-act="multiSave"'+(can?'':' disabled')+'>'+(reading?'Reading bills\u2026':'Save '+inc.length+' bill'+(inc.length===1?'':'s')+' to their categories')+'</button></div>';
}
function saveAnimMany(bills,done){
  var host=$('#screenStack');if(!host||bills.length<2||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){if(bills.length===1)return saveAnim(bills[0],done);done();return;}
  var cats=[];bills.forEach(function(b){if(cats.indexOf(b.category)<0)cats.push(b.category);});cats=cats.slice(0,4);
  var el=document.createElement('div');el.className='svAnim many';var W=host.clientWidth,H=host.clientHeight,n=Math.min(bills.length,5),dw=Math.min(78,(W-40)/n-8);
  var html='';bills.slice(0,5).forEach(function(b,i){var x=(W-(n*(dw+8)-8))/2+i*(dw+8);html+='<div class="svMini" style="left:'+x+'px;top:'+(H*0.18)+'px;width:'+dw+'px;height:'+(dw*1.35)+'px;animation-delay:'+(i*70)+'ms">'+(b.img?'<img src="'+b.img+'" alt="">':'')+'<span class="svBadge">PDF</span></div>';});
  cats.forEach(function(c,i){var fw=Math.min(84,(W-30)/cats.length-10),x=(W-(cats.length*(fw+10)-10))/2+i*(fw+10);
    html+='<div class="svFolderM" data-c="'+esc(c)+'" style="left:'+x+'px;top:'+(H*0.6)+'px;width:'+fw+'px;--cc:'+CAT_COLOR[c]+'"><svg viewBox="0 0 64 52" aria-hidden="true"><path class="svBack" d="M4 8a4 4 0 014-4h16l6 6h26a4 4 0 014 4v30a4 4 0 01-4 4H8a4 4 0 01-4-4z"/><path class="svFront" d="M2 20a4 4 0 014-4h52a4 4 0 014 4l-3 24a4 4 0 01-4 4H9a4 4 0 01-4-4z"/></svg><span>'+esc(catLabel(c))+'</span></div>';});
  el.innerHTML=html+'<div class="svDone">'+bills.length+' bills filed</div>';host.appendChild(el);
  var minis=el.querySelectorAll('.svMini'),T=550;
  bills.slice(0,5).forEach(function(b,i){setTimeout(function(){var f=el.querySelector('.svFolderM[data-c="'+CSS.escape(b.category)+'"]')||el.querySelector('.svFolderM');if(!f)return;
    var m=minis[i],mr=m.getBoundingClientRect(),fr=f.getBoundingClientRect();m.style.transform='translate('+(fr.left+fr.width/2-(mr.left+mr.width/2))+'px,'+(fr.top+fr.height*0.35-(mr.top+mr.height/2))+'px) scale(.25)';m.style.opacity='0';
    setTimeout(function(){f.classList.remove('got');void f.offsetWidth;f.classList.add('got');},430);},T+i*170);});
  var end=T+Math.min(bills.length,5)*170+700;
  setTimeout(function(){el.classList.add('fin');},end-250);
  setTimeout(function(){el.classList.add('out');},end+500);setTimeout(function(){el.remove();done();},end+750);
}
function commit(){
  var d=S.draft;if(!d)return;var F=d.fields,a=parseFloat(String(F.amount).replace(/,/g,''));
  if(d.replaceId){var o=billById(d.replaceId);if(o){
    Object.assign(o,{vendor:(F.vendor||'').trim()||o.vendor,type:(F.type||'').trim(),amount:isFinite(a)?a:null,date:validDate(F.date)||o.date,category:CATS.indexOf(F.category)>=0?F.category:o.category,items:(F.items||'').trim(),
      img:d.img,thumb:d.thumb,imgW:d.w||null,imgH:d.h||null,scanMode:d.mode||null,text:d.text||o.text,source:d.src,currency:d.currency||o.currency,conf:d.conf,pdfStale:true,sample:false,rescannedAt:Date.now()});
    S.dialog=null;S.sheet=null;S.draft=null;S.rescanId=null;
    persist(function(){return DB.put(o);}).then(function(ok){if(!ok)return;
      saveAnim(o,function(){S.hist=[{name:'vault',params:{}}];S.navDir='fade';S.route={name:'bill',params:{id:o.id}};render();toast('Scan replaced. PDF updated.');});
      ensurePdf(o).then(function(){if(S.route.name==='bill')render();},function(){});});
    return;}}
  var b={id:d.id,vendor:(F.vendor||'').trim()||'Untitled bill',amount:isFinite(a)?a:null,currency:d.currency||'INR',date:validDate(F.date)||today(),
    category:CATS.indexOf(F.category)>=0?F.category:'Other',type:(F.type||'').trim(),items:(F.items||'').trim(),imgW:d.w||null,imgH:d.h||null,scanMode:d.mode||null,text:d.text||'',folder:d.folder||null,source:d.src,createdAt:Date.now(),img:d.img,thumb:d.thumb,conf:d.conf};
  S.dialog=null;S.sheet=null;
  persist(function(){return DB.put(b);}).then(function(ok){
    if(!ok)return;S.bills.push(b);S.lastSavedId=b.id;
    S.savedWhere=b.folder?(folderName(b.folder)||'folder'):'Vault';S.draft=null;S.batchDone++;
    if(S.queue.length){saveAnim(b,function(){toast('Saved. Next: '+(S.batchDone+1)+' of '+S.batchTotal);nextQueued();});}
    else if(false){S.camCount++;S.batchTotal=0;toast('Saved to '+S.savedWhere+'. Scan the next bill.');S.hist=[{name:'vault',params:{}}];S.route={name:'camera',params:{}};render();}
    else{S.batchTotal=0;saveAnim(b,function(){go('saved',{},{replace:true});});}
    S.pdfState='making';ensurePdf(b).then(function(){S.pdfState='ready';},function(){S.pdfState='failed';}).then(function(){if(S.route.name==='saved')render();});
  });
}
function discardNow(){S.rescanId=null;if(S.ctl)try{S.ctl.abort();}catch(e){}S.draft=null;S.queue=[];S.batchTotal=0;S.dialog=null;S.route=S.hist.pop()||{name:'vault',params:{}};render();}

/* ---------------- folders ---------------- */
function createFolder(name){name=(name||'').trim();if(!name){toast('Give the folder a name.');return null;}
  var ex=S.folders.find(function(f){return f.name.toLowerCase()===name.toLowerCase();});if(ex)return ex.id;
  var f={id:uid(),name:name};S.folders.push(f);saveMeta();return f.id;}
function moveMany(fid){var L=selBills();L.forEach(function(b){b.folder=fid||null;b.pdfStale=true;});
  persist(function(){return Promise.all(L.map(function(b){return DB.put(b);}));}).then(function(){exitSel(true);render();renderOverlay();toast(L.length+' bill'+(L.length===1?'':'s')+(fid?' moved to '+folderName(fid):' removed from folders'));});}
function moveBill(id,fid){var b=billById(id);if(!b)return;b.folder=fid||null;b.pdfStale=true;
  persist(function(){return DB.put(b);}).then(function(){S.sheet=null;render();toast(fid?'Moved to '+folderName(fid):'Removed from folder');});}

/* ---------------- sample data (the wireframe's own bills) ---------------- */
function sampleData(){
  function off(n){var d=new Date();d.setDate(d.getDate()-n);return ymd(d);}
  var y=new Date().getFullYear(),G='f_goa',D='f_diwali',H='f_hra';
  var R=[
   ['Ramesh Dairy — Milkman',1240,'Groceries',off(0),'Milk, 31 days × ₹40','RAMESH DAIRY monthly milk 31 days x 40 = 1240'],
   ['Lifestyle',3499,'Shopping',off(1),'2x Kurta Set — ₹1,749 each','LIFESTYLE ITEMS 2x Kurta Set — 1749.00 ea TOTAL 3499.00'],
   ['BESCOM Electricity',2180,'Utilities',off(2),'214 units, monthly cycle','BESCOM consumer 4417 units consumed 214 amount due 2180'],
   ['Suresh Electricals',850,'Services',off(4),'Fan regulator + labour','Regulator 450 labour 400 total 850'],
   ['Cafe Chocolatte',640,'Dining',off(14),'2 cold coffee, 1 brownie','2 cold coffee 1 brownie total 640'],
   ['Westside',2050,'Shopping',y+'-08-03','Cotton Kurta — Size M','WESTSIDE Cotton Kurta — Size M 2050.00'],
   ['Fabindia',4120,'Shopping',y+'-06-19','Kurta, dupatta','FABINDIA handloom kurta 2890 dupatta 1230'],
   ['Fort Aguada Resort, Goa',18600,'Travel',y+'-03-14','2 nights Deluxe Sea View — ₹9,000/night','2 nights Deluxe Sea View 9000/night taxes 600',G],
   ['Goa Airport Parking',120,'Travel',y+'-03-14','4 hours','Parking 4 hrs 120',G],
   ['Souza Lobo Restaurant',2340,'Dining',y+'-03-15','Dinner for four','Seafood platter dinner for four 2340',G],
   ['Baga Beach Shack',1180,'Dining',y+'-03-15','Lunch','Lunch 1180',G],
   ['Panjim Taxi',950,'Travel',y+'-03-16','Airport drop','Airport drop 950',G],
   ['Cafe Chocolatte, Panjim',640,'Dining',y+'-03-16','Breakfast','Breakfast 640',G],
   ['Diwali lights — Chandni market',1450,'Shopping',(y-1)+'-10-28','LED string lights x6','LED string lights x6 1450',D],
   ['Haldiram’s',2200,'Groceries',(y-1)+'-10-30','Sweets gift boxes x4','Sweets gift box x4 2200',D],
   ['House rent — July',18000,'Rent',y+'-07-05','Rent receipt, landlord signed','Received rent 18000 for July',H],
   ['House rent — August',18000,'Rent',y+'-08-05','Rent receipt, landlord signed','Received rent 18000 for August',H]
  ];
  return {folders:[{id:G,name:'Goa Trip',sample:true},{id:D,name:'Diwali Shopping',sample:true},{id:H,name:'HRA Rent Receipts',sample:true}],
    bills:R.map(function(r,i){return {id:'sample_'+i,vendor:r[0],amount:r[1],currency:'INR',category:r[2],date:r[3],items:r[4],text:r[5],folder:r[6]||null,source:'Sample',createdAt:Date.now()-i*1000,img:null,thumb:null,sample:true};})};
}
function loadSamples(){var sd=sampleData();
  return persist(function(){return Promise.all(sd.bills.map(function(b){return DB.put(b);}));}).then(function(ok){if(!ok)return;
    sd.bills.forEach(function(b){if(!billById(b.id))S.bills.push(b);});
    sd.folders.forEach(function(f){if(!S.folders.some(function(x){return x.id===f.id;}))S.folders.push(f);});S.seeded=true;return saveMeta();});}

/* ---------------- downloads: backup, PDF, image ---------------- */
function getDownloads(){return (window.claude&&claude.use?claude.use('downloads'):Promise.resolve(null)).catch(function(){return null;});}
function saveFile(name,data,okMsg){return getDownloads().then(function(dl){if(!dl){toast('Downloads aren\'t available in this view.');return false;}
  return dl.save({filename:name,data:data}).then(function(r){toast(r&&r.path?okMsg.replace(/\.$/,'')+' to '+r.path:okMsg);return true;},function(e){toast(e&&e.code==='declined'?'Cancelled.':e&&e.code==='too_large'?'That file is too large to download.':'Couldn\'t save the file.');return false;});});}
function exportBackup(){
  var data=JSON.stringify({app:'receipt-keeper',version:1,exportedAt:Date.now(),bills:S.bills.map(function(b){var c=Object.assign({},b);delete c.pdf;return c;}),folders:S.folders,rules:S.rules});
  saveFile('receipt-keeper-backup-'+today()+'.json',data,'Backup file saved.').then(function(ok){if(ok){S.lastBackup=Date.now();saveMeta();S.sheet=null;render();}});
}
function importBackup(file){var r=new FileReader();r.onload=function(){try{
  var j=JSON.parse(r.result);if(!j||j.app!=='receipt-keeper'||!Array.isArray(j.bills))throw 0;
  var have={},added=0;S.bills.forEach(function(b){have[b.id]=1;});
  var jobs=j.bills.filter(function(b){return b&&b.id&&!have[b.id];}).map(function(b){S.bills.push(b);added++;return DB.put(b);});
  (j.folders||[]).forEach(function(f){if(f&&f.id&&!S.folders.some(function(x){return x.id===f.id;}))S.folders.push(f);});
  Object.keys(j.rules||{}).forEach(function(k){if(!S.rules[k])S.rules[k]=j.rules[k];});
  Promise.all(jobs).then(saveMeta).then(function(){S.sheet=null;render();toast(added?'Restored '+added+' bill'+(added>1?'s':'')+'.':'Nothing new in that file.');},function(){toast('Couldn\'t save the restored bills.');});
}catch(e){toast('That isn\'t a Receipt Keeper backup file.');}};r.readAsText(file);}
var jspdfP=null;
function getJsPDF(){if(!jspdfP)jspdfP=loadScript(lib('jspdf','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')).then(function(){return window.jspdf.jsPDF;}).catch(function(e){jspdfP=null;throw e;});return jspdfP;}
function pt(v){return String(v==null?'':v).replace(/₹/g,'Rs. ').replace(/[–—]/g,'-').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/×/g,'x').replace(/…/g,'...').replace(/[^\x20-\x7E\xA0-\xFF\n]/g,'');}
function pdfMoney(b){return b.amount==null?'-':(b.currency==='INR'?'Rs. ':pt(sym(b.currency)))+num(b.amount);}
function safeName(v){return pt(v).replace(/[\\\/:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim().slice(0,60)||'bill';}
function pdfFileName(b){return safeName(b.category)+' - '+safeName(displayName(b))+' - '+b.date+'.pdf';}
function imgInfo(b){if(!b.img)return Promise.resolve(null);
  return new Promise(function(res){var im=new Image();im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,dim={w:w,h:h};
    if(h/w>2.6){var sh0=Math.round(w*1.85),ov=Math.round(w*0.04);dim.slices=[];for(var y=0;y<h;y+=sh0-ov){var sh=Math.min(sh0,h-y),c=document.createElement('canvas');c.width=w;c.height=sh;
      c.getContext('2d').drawImage(im,0,y,w,sh,0,0,w,sh);dim.slices.push({url:c.toDataURL('image/jpeg',0.86),w:w,h:sh});if(y+sh>=h)break;}}
    res(dim);};im.onerror=function(){res(null);};im.src=b.img;});}
function imgSize(url){return new Promise(function(res){var im=new Image();im.onload=function(){res({w:im.naturalWidth,h:im.naturalHeight});};im.onerror=function(){res(null);};im.src=url;});}
function drawBill(doc,b,dim,first){
  var W=210,H=297,M=14,CW=W-2*M,y=M;
  if(!first)doc.addPage();
  var startPage=doc.internal.getNumberOfPages();
  doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(120);
  doc.text(pt(('Receipt Keeper  |  '+b.category+(b.type?'  |  '+b.type:'')).toUpperCase()),M,y+3);
  doc.text(pt(fmtDate(b.date,true)),W-M,y+3,{align:'right'});
  y+=11;doc.setTextColor(20);doc.setFont('helvetica','bold');doc.setFontSize(18);
  var vl=doc.splitTextToSize(pt(b.vendor),CW-60);doc.text(vl,M,y+5);
  doc.setFontSize(18);doc.text(pdfMoney(b),W-M,y+5,{align:'right'});
  y+=5+vl.length*7.5;doc.setDrawColor(190);doc.setLineWidth(0.3);doc.line(M,y,W-M,y);y+=6;
  var rows=[['Bill type',b.type||'-'],['Category',b.category],['Amount',pdfMoney(b)+(b.currency&&b.currency!=='INR'?' '+b.currency:'')],['Date',fmtDate(b.date,true)],['Items',b.items||'-'],['Folder',folderName(b.folder)||'None'],
    ['Source',b.sample?'Sample bill':(b.source||'-')],['Saved',b.createdAt?new Date(b.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'}):'-']];
  rows.forEach(function(r){doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(120);doc.text(r[0].toUpperCase(),M,y);
    doc.setFontSize(10.5);doc.setTextColor(20);var l=doc.splitTextToSize(pt(r[1]),CW-34);doc.text(l,M+34,y);y+=Math.max(6,l.length*4.8+1.5);});
  y+=1;doc.line(M,y,W-M,y);y+=6;
  if(b.img&&dim&&dim.slices&&dim.slices.length>1){
    doc.setFontSize(8.5);doc.setTextColor(120);doc.text('Long receipt - shown in full on the next '+dim.slices.length+' pages.',M,y+2);
    dim.slices.forEach(function(sl){doc.addPage();var ih=H-2*M-10,iw=ih*sl.w/sl.h;if(iw>CW){iw=CW;ih=iw*sl.h/sl.w;}var sx0=M+(CW-iw)/2;doc.addImage(sl.url,'JPEG',sx0,M,iw,ih,undefined,'FAST');doc.setDrawColor(210);doc.rect(sx0,M,iw,ih);});
  }else if(b.img&&dim){
    var avail=H-M-10-y,iw=CW,ih=iw*dim.h/dim.w;
    if(ih>avail){ih=avail;iw=ih*dim.w/dim.h;}
    if(iw<60){doc.addPage();y=M;avail=H-2*M-10;ih=avail;iw=ih*dim.w/dim.h;if(iw>CW){iw=CW;ih=iw*dim.h/dim.w;}}
    var x=M+(CW-iw)/2;doc.addImage(b.img,'JPEG',x,y,iw,ih,undefined,'FAST');doc.setDrawColor(210);doc.rect(x,y,iw,ih);
  }else{
    doc.setFontSize(9);doc.setTextColor(140);doc.text(b.sample?'Sample bill - no scan attached.':'No scan attached to this bill.',M,y+2);
    if(b.text){y+=9;doc.setFont('courier','normal');doc.setFontSize(8.5);doc.setTextColor(60);doc.text(doc.splitTextToSize(pt(b.text),CW).slice(0,60),M,y);}
  }
  return startPage;
}
function footers(doc,label){var n=doc.internal.getNumberOfPages();for(var i=1;i<=n;i++){doc.setPage(i);doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(150);
  doc.text(pt(label),14,289);doc.text('Page '+i+' of '+n,196,289,{align:'right'});}}
function makeBillPdf(b){
  return Promise.all([getJsPDF(),imgInfo(b)]).then(function(r){
    var doc=new r[0]({unit:'mm',format:'a4',compress:true});
    doc.setProperties({title:pt(b.vendor+' - '+b.date),subject:pt(b.category+(b.type?' / '+b.type:'')),keywords:pt([b.category,b.type,folderName(b.folder)].filter(Boolean).join(', ')),creator:'Receipt Keeper'});
    drawBill(doc,b,r[1],true);footers(doc,'Receipt Keeper  |  scanned '+(b.scanMode&&b.scanMode!=='original'?'and enhanced for faded thermal print':'copy'));
    return {blob:doc.output('blob'),pages:doc.internal.getNumberOfPages()};
  });
}
function ensurePdf(b){
  if(b.pdf&&!b.pdfStale)return Promise.resolve(b.pdf);
  return makeBillPdf(b).then(function(p){b.pdf=p.blob;b.pdfPages=p.pages;b.pdfStale=false;
    var st=window.RK_store?window.RK_store(b.category,pdfFileName(b),p.blob,b.pdfPath).then(function(path){b.pdfPath=path;},function(){}):Promise.resolve();
    return st.then(function(){return persist(function(){return DB.put(b);});}).then(function(){return b.pdf;});});
}
function pdfStatusHtml(){
  if(S.pdfState==='making')return '<div class="mono" style="font-size:11px;color:var(--ink-soft);">Creating PDF…</div>';
  if(S.pdfState==='ready'){var b=billById(S.lastSavedId);return b?'<button class="btnSecondary" style="padding:8px 16px;font-size:12.5px;" data-act="viewPdf" data-id="'+esc(b.id)+'">View PDF · '+esc(b.category)+'</button>':'';}
  if(S.pdfState==='failed')return '<div class="mono" style="font-size:11px;color:var(--ink-soft);">Bill saved. PDF will be created when you open it.</div>';
  return '';
}
function sharePdf(b){toast('Preparing PDF…');ensurePdf(b).then(function(pdf){return saveFile(pdfFileName(b),pdf,'PDF saved.');},function(){toast('Couldn\'t build the PDF here. Check your connection and try again.');});}
function catOrder(list){return list.slice().sort(function(a,b){return a.category<b.category?-1:a.category>b.category?1:(a.date<b.date?1:a.date>b.date?-1:0);});}
function exportLabel(scope){
  if(scope==='vault')return S.chip==='All'?'All bills':S.chip;
  if(scope==='folder')return 'Folder - '+(folderName(S.route.params.id)||'');
  var s=S.search,p=[];if(s.q)p.push('"'+s.q+'"');if(s.cat)p.push(s.cat);if(s.range)p.push({month:'This month','30':'Last 30 days',year:'This year'}[s.range]);if(s.folder)p.push(folderName(s.folder));
  return 'Search'+(p.length?' - '+p.join(', '):'');
}
function exportBar(list,scope,label){
  var cur=list.every(function(b){return b.currency===list[0].currency;}),tot=list.reduce(function(a,b){return a+(Number(b.amount)||0);},0);
  return '<div class="exportBar"><span>'+(label||(list.length+' bill'+(list.length>1?'s':'')))+(cur?' · '+esc(sym(list[0].currency))+num(Math.round(tot)):'')+'</span>'+
    '<button class="linkBtn" data-act="exportPdf" data-a="'+scope+'">⤓ PDF</button></div>';
}
function exportSet(list,label){
  if(!list.length){toast('Nothing to export.');return;}
  list=catOrder(list);toast('Building PDF of '+list.length+' bill'+(list.length>1?'s':'')+'…');
  getJsPDF().then(function(J){
    return Promise.all(list.map(imgInfo)).then(function(dims){
      var doc=new J({unit:'mm',format:'a4',compress:true}),M=14,y=M;
      doc.setProperties({title:pt('Receipt Keeper - '+label),creator:'Receipt Keeper'});
      doc.setFont('helvetica','bold');doc.setFontSize(20);doc.setTextColor(20);doc.text(pt(label),M,y+8);y+=15;
      doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(110);
      var cur=list.every(function(b){return b.currency===list[0].currency;}),tot=list.reduce(function(a,b){return a+(Number(b.amount)||0);},0);
      doc.text(pt(list.length+' bills'+(cur?'  |  total '+(list[0].currency==='INR'?'Rs. ':sym(list[0].currency))+num(tot):'')+'  |  generated '+fmtDate(today(),true)+'  |  sorted by category, newest first'),M,y);y+=9;
      var cat=null,pages=[];
      list.forEach(function(b){
        if(y>275){doc.addPage();y=M;}
        if(b.category!==cat){cat=b.category;var sub=list.filter(function(x){return x.category===cat;});y+=2;doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(40);
          doc.text(pt(cat.toUpperCase()+'  ('+sub.length+')'),M,y);doc.setDrawColor(200);doc.line(M,y+1.5,196,y+1.5);y+=7;}
        doc.setFont('helvetica','normal');doc.setFontSize(9.5);doc.setTextColor(30);
        doc.text(pt(fmtDate(b.date,true)),M,y);doc.text(pt(b.vendor).slice(0,48),M+26,y);doc.setTextColor(120);doc.text(pt(b.type||'').slice(0,26),M+112,y);doc.setTextColor(30);doc.text(pdfMoney(b),196,y,{align:'right'});y+=5.5;
      });
      list.forEach(function(b,i){var p=drawBill(doc,b,dims[i],false);pages.push(p);});
      try{var parents={};list.forEach(function(b,i){if(!parents[b.category])parents[b.category]=doc.outline.add(null,pt(b.category),{pageNumber:pages[i]});doc.outline.add(parents[b.category],pt(b.vendor+' - '+b.date),{pageNumber:pages[i]});});}catch(e){}
      footers(doc,'Receipt Keeper  |  '+label);
      return saveFile(safeName('Receipt Keeper - '+label)+' - '+today()+'.pdf',doc.output('blob'),'PDF saved.');
    });
  }).catch(function(){toast('Couldn\'t build the PDF here. Check your connection and try again.');});
}
function pdfScreen(){
  var b=billById(S.route.params.id);if(!b)return top('PDF',{back:1})+'<div class="scr-body"><div class="sectionLabel">This bill was deleted</div></div>';
  return top(pdfFileName(b),{back:1,center:1,right:'<button class="iconBtn" data-act="sharePdf" aria-label="Download PDF">'+ic('share')+'</button>'})+
    '<div class="scr-body nopad"><div class="pdfPages" id="pdfPages"><div class="mono" style="font-size:11px;color:var(--ink-soft);padding:20px 0;text-align:center;">Rendering PDF…</div></div></div>';
}
function renderPdfPages(b){
  var host=$('#pdfPages');if(!host)return;
  ensurePdf(b).then(function(pdf){return Promise.all([getPdfjs(),readBuf(pdf)]);}).then(function(r){return r[0].getDocument({data:r[1],isEvalSupported:false}).promise;}).then(function(doc){
    if($('#pdfPages')!==host)return;host.innerHTML='';var chain=Promise.resolve();
    for(var i=1;i<=doc.numPages;i++)(function(i){chain=chain.then(function(){return doc.getPage(i).then(function(pg){
      var w=host.clientWidth||280,dpr=Math.min(2.5,window.devicePixelRatio||1),v0=pg.getViewport({scale:1}),v=pg.getViewport({scale:w*dpr/v0.width});
      var c=document.createElement('canvas');c.width=v.width;c.height=v.height;c.setAttribute('aria-label','PDF page '+i);host.appendChild(c);
      return pg.render({canvasContext:c.getContext('2d'),viewport:v}).promise;});});})(i);
    return chain;
  }).catch(function(){if($('#pdfPages')===host)host.innerHTML='<div class="mono" style="font-size:11px;color:var(--ink-soft);padding:20px 0;text-align:center;">Couldn\'t show the PDF here. Use the download button instead.</div>';});
}
function billText(b){return [displayName(b),b.title?b.vendor:'',b.type,money(b),fmtDate(b.date,true),b.category,b.items,folderName(b.folder)?'Folder: '+folderName(b.folder):''].filter(Boolean).join('\n');}

/* ---------------- overlays ---------------- */
function renderOverlay(){
  var o=$('#overlay'),h='';
  if(S.sheet){var s=S.sheet;
    var en=s.t!==S.lastSheet?' enter':'';S.lastSheet=s.t;
    h+='<button class="backdrop open'+en+'" data-act="sheetClose" aria-label="Close"></button><div class="sheet open'+en+'" role="dialog" aria-modal="true"><div class="sheetHandle"></div>';
    if(s.t==='picker'){
      h+='<h4>Add a bill</h4><div class="pickerGrid">'+
       '<button class="pickerBtn" data-act="goCamera">'+ic('cam')+'Camera scan</button>'+
       '<button class="pickerBtn" data-act="pick" data-a="image">'+ic('img')+'Image</button>'+
       '<button class="pickerBtn" data-act="pick" data-a="file">'+ic('file')+'File</button>'+
       '<button class="pickerBtn" data-act="pick" data-a="link">'+ic('link')+'Link</button></div>'+
       '<div style="display:flex;justify-content:space-between;"><button class="linkBtn" data-act="sheetClose">Cancel</button><button class="linkBtn" data-act="manual">Enter manually</button></div>';
    }else if(s.t==='link'){
      h+='<h4>Import from a link</h4><p class="small">Retailer links expire, so paste the bill now: the SMS or email text, or the text you copy from the bill page. This page can\'t open other websites itself.</p>'+
       '<textarea class="pasteBox" id="pasteBox" placeholder="e.g. Your Lifestyle bill of Rs.3,499 dated 24-Sep…" aria-label="Bill text">'+esc(s.v||'')+'</textarea>'+(s.err?'<p class="err">'+esc(s.err)+'</p>':'')+
       '<div style="display:flex;gap:8px;"><button class="btnSecondary" style="flex:1;" data-act="sheetClose">Cancel</button><button class="btnPrimary" style="flex:1;" data-act="readText">Read bill</button></div>';
    }else if(s.t==='catPick'){
      h+='<h4>Set category for '+S.sel.size+' bill'+(S.sel.size===1?'':'s')+'</h4><div class="menuList">'+CATS.map(function(c){return '<button class="menuRow" data-act="selCatSet" data-a="'+c+'"><i class="cDot" style="background:'+CAT_COLOR[c]+';width:10px;height:10px;"></i><span><b>'+esc(catLabel(c))+'</b></span></button>';}).join('')+'</div>';
    }else if(s.t==='billMenu'){var bm=billById(s.id);
      h+='<h4 class="menuTitle">'+esc(bm?displayName(bm):'Bill')+'</h4><div class="menuList">'+
        [['renameOpen','pen','Rename file',bm?pdfFileName(bm):''],['editOpen','tag','Edit details','Vendor, amount, date, category'],['rescan','rescan','Rescan bill','Replace the photo, keep it in place'],['moveOpen','move','Move to folder',bm&&folderName(bm.folder)?'Now in '+folderName(bm.folder):'Or create a new folder'],['sharePdf','share','Share PDF',''],['delBill','trash','Delete bill','Removes the bill and its PDF']].map(function(m){
          return '<button class="menuRow'+(m[0]==='delBill'?' danger':'')+'" data-act="'+m[0]+'" data-id="'+esc(s.id)+'">'+ic(m[1])+'<span><b>'+m[2]+'</b>'+(m[3]?'<small>'+esc(m[3])+'</small>':'')+'</span></button>';}).join('')+'</div>';
    }else if(s.t==='folderMenu'){var fm=S.folders.find(function(x){return x.id===s.id;});
      h+='<h4 class="menuTitle">'+esc(fm?fm.name:'Folder')+'</h4><div class="menuList">'+
        '<button class="menuRow" data-act="renameFolderOpen" data-id="'+esc(s.id)+'">'+ic('pen')+'<span><b>Rename folder</b></span></button>'+
        '<button class="menuRow" data-act="exportPdf" data-a="col">'+ic('share')+'<span><b>Export folder as PDF</b><small>All bills, grouped by category</small></span></button>'+
        '<button class="menuRow danger" data-act="delFolder" data-id="'+esc(s.id)+'">'+ic('trash')+'<span><b>Delete folder</b><small>Bills inside stay in your Vault</small></span></button></div>';
    }else if(s.t==='rename'||s.t==='renameFolder'){var isF=s.t==='renameFolder',rb=isF?S.folders.find(function(x){return x.id===s.id;}):billById(s.id);
      h+='<h4>'+(isF?'Rename folder':'Rename bill')+'</h4><input class="fieldBox" id="renameInput" maxlength="60" value="'+esc(rb?(isF?rb.name:displayName(rb)):'')+'" aria-label="New name" autocomplete="off">'+
        (isF?'':'<p class="small" style="margin-top:8px;">PDF file: <span class="mono" id="renamePrev">'+esc(rb?pdfFileName(rb):'')+'</span></p>')+
        '<div style="display:flex;gap:8px;margin-top:12px;"><button class="btnSecondary" style="flex:1;" data-act="sheetClose">Cancel</button><button class="btnPrimary" style="flex:1;" data-act="renameSave" data-id="'+esc(s.id)+'">Save</button></div>';
    }else if(s.t==='saveIn'){
      var move=s.ctx==='move'||s.ctx==='moveMany',plain=s.ctx==='plain';
      h+='<h4>'+(plain?'New folder':s.ctx==='moveMany'?'Move '+S.sel.size+' bill'+(S.sel.size===1?'':'s')+' to':move?'Move to':'Save in')+'</h4>';
      if(move)h+='<button class="folderPickRow" data-act="saveTo" data-id="">None<span class="mono" style="font-size:11px;color:var(--ink-faint);">Vault only</span></button>';
      if(!plain)h+=S.folders.map(function(f){var n=S.bills.filter(function(b){return b.folder===f.id;}).length;return '<button class="folderPickRow" data-act="saveTo" data-id="'+esc(f.id)+'">'+esc(f.name)+'<span class="mono" style="font-size:11px;color:var(--ink-faint);">'+n+'</span></button>';}).join('');
      h+='<div class="newFolderRow">'+(s.newOpen||plain?'<input id="newFolderInput" placeholder="New folder name" maxlength="40" aria-label="New folder name" autocomplete="off"><button class="btnPrimary" data-act="newFolderCreate" style="padding:8px 12px;font-size:12px;">'+(plain?'Create':move?'Create &amp; Move':'Create &amp; Save')+'</button>':
        '<button class="linkBtn" data-act="newFolderToggle">+ Create new folder</button>')+'</div>';
    }else if(s.t==='signIn'){
      h+='<h4>Back up across devices</h4><p class="small">Accounts and automatic sync aren\'t switched on in this version. Until they are, a backup file keeps your bills safe: download it now, and restore it on any phone or browser.</p>'+
       '<div class="stack"><button class="btnPrimary" data-act="exportBackup">Download backup file</button><button class="btnSecondary" data-act="importBackup">Restore from backup file</button><button class="linkBtn" data-act="sheetClose">Not now</button></div>';
    }else if(s.t==='privacy'){
      var ns=S.bills.filter(function(b){return b.sample;}).length;
      h+='<h4>Data &amp; privacy</h4><p class="small">Bills, images and folders are stored only '+(window.RK_NATIVE?'on this phone':'in this browser')+'. When you add a bill, its photo or text is sent to '+(window.RK_NATIVE?'Anthropic\'s API with your key':'Claude on your account')+' to read the vendor, amount, date and items. Nothing else leaves this device.</p>'+
       '<div class="stack"><button class="btnSecondary" data-act="exportBackup">Download backup file</button><button class="btnSecondary" data-act="importBackup">Restore from backup file</button>'+
       (ns?'<button class="btnSecondary" data-act="removeSamples">Remove '+ns+' sample bills</button>':'<button class="btnSecondary" data-act="addSamples">Add sample bills</button>')+
       '<button class="btnSecondary" style="color:var(--danger);border-color:var(--danger);" data-act="wipe">Delete all data on this device</button></div>';
    }
    h+='</div>';
  }
  if(!S.sheet)S.lastSheet=null;
  if(S.dialog){var d=S.dialog,t='';var den=d.t!==S.lastDialog?' enter':'';S.lastDialog=d.t;
    if(d.t==='dup'){var e=billById(d.id);t='<h4>Possible duplicate</h4><p>This looks similar to <b>'+esc(e?e.vendor:'a bill')+' — '+esc(e?money(e):'')+'</b>, saved on '+esc(e?MON[pd(e.date).getMonth()]+' '+pd(e.date).getDate():'')+'. Same bill, or different?</p><div class="drow"><button class="same" data-act="dupSame">Same bill</button><button class="diff" data-act="dupDiff">Different</button></div>';}
    else if(d.t==='nodup')t='<h4>No duplicates found</h4><p>Nothing in your Vault matches this vendor, amount and date.</p><div class="drow"><button class="same" data-act="dialogClose">OK</button></div>';
    else if(d.t==='discard')t='<h4>Discard this bill?</h4><p>Nothing has been saved yet.</p><div class="drow"><button class="diff" data-act="dialogClose">Keep editing</button><button class="dng" data-act="discardYes">Discard</button></div>';
    else if(d.t==='delBill')t='<h4>Delete this bill?</h4><p>It is removed from this device. This can\'t be undone.</p><div class="drow"><button class="diff" data-act="dialogClose">Cancel</button><button class="dng" data-act="delBillYes" data-id="'+esc(d.id)+'">Delete</button></div>';
    else if(d.t==='delFolder')t='<h4>Delete this folder?</h4><p>The bills inside stay in your Vault. Only the folder goes.</p><div class="drow"><button class="diff" data-act="dialogClose">Cancel</button><button class="dng" data-act="delFolderYes" data-id="'+esc(d.id)+'">Delete</button></div>';
    else if(d.t==='delMany')t='<h4>Delete '+S.sel.size+' bill'+(S.sel.size===1?'':'s')+'?</h4><p>They and their PDFs are removed from this device. This can\'t be undone.</p><div class="drow"><button class="diff" data-act="dialogClose">Cancel</button><button class="dng" data-act="delManyYes">Delete</button></div>';
    else if(d.t==='wipe')t='<h4>Delete everything?</h4><p>All bills, folders and images on this device are erased. Download a backup first if you may need them.</p><div class="drow"><button class="diff" data-act="dialogClose">Cancel</button><button class="dng" data-act="wipeYes">Delete all</button></div>';
    h+='<button class="backdrop open'+den+'" style="z-index:10" data-act="dialogClose" aria-label="Close"></button><div class="dialog open'+den+'" role="alertdialog" aria-modal="true">'+t+'</div>';
  }
  if(!S.dialog)S.lastDialog=null;
  o.innerHTML=h;var ri=$('#renameInput');if(ri&&S.sheet&&S.sheet.fresh){S.sheet.fresh=false;ri.focus();ri.select();}
  var f=$('#newFolderInput');if(f&&!ri)f.focus();var pb=$('#pasteBox');if(pb&&!pb.value)pb.focus();
}

/* ---------------- render ---------------- */
function enterSel(id){S.selMode=true;S.sel=new Set([id]);try{navigator.vibrate&&navigator.vibrate(12);}catch(e){}
  document.querySelectorAll('#view .billRow').forEach(function(r){r.classList.add('selectable');r.classList.toggle('selected',r.dataset.id===id);});renderSelBar(true);}
function exitSel(quiet){if(!S.selMode)return;S.selMode=false;S.sel=new Set();var bar=$('#selBar');if(bar){bar.classList.add('closing');setTimeout(function(){bar.remove();},200);}
  if(!quiet)document.querySelectorAll('#view .billRow').forEach(function(r){r.classList.remove('selectable','selected');});$('#fab').classList.remove('selHide');}
function toggleSel(id){if(S.sel.has(id))S.sel.delete(id);else S.sel.add(id);var r=document.querySelector('#view .billRow[data-id="'+CSS.escape(id)+'"]');if(r)r.classList.toggle('selected',S.sel.has(id));
  if(!S.sel.size){exitSel();return;}renderSelBar();}
function renderSelBar(fresh){var host=$('#screenStack'),bar=$('#selBar');if(!bar){bar=document.createElement('div');bar.id='selBar';host.appendChild(bar);}
  var n=S.sel.size,visible=document.querySelectorAll('#view .billRow').length;
  bar.innerHTML='<div class="selTop"><button class="iconBtn" data-act="selCancel" aria-label="Cancel selection">'+ic('x')+'</button><b>'+n+' selected</b><button class="linkBtn" data-act="selAll">'+(n>=visible?'Clear':'Select all')+'</button></div>'+
    '<div class="selActs">'+[['selMove','move','Move'],['selCat','tag','Category'],['selPdf','share','PDF'],['selDelete','trash','Delete']].map(function(a){return '<button data-act="'+a[0]+'"'+(a[0]==='selDelete'?' class="danger"':'')+'>'+ic(a[1])+'<span>'+a[2]+'</span></button>';}).join('')+'</div>';
  if(fresh)bar.classList.add('enter');$('#fab').classList.add('selHide');}
function selBills(){return S.bills.filter(function(b){return S.sel.has(b.id);});}
function stagger(root){var els=root.querySelectorAll('.billRow,.folderCard,.catTile,.field,.toggleRow,.quickActs button');for(var i=0;i<els.length&&i<18;i++){els[i].style.animationDelay=(70+i*26)+'ms';els[i].classList.add('rise');}}
function render(){
  var r=S.route,html='',tabs=false,cur=null;
  switch(r.name){
    case 'zero':html=zeroScreen();break;
    case 'vault':html=vaultScreen();tabs=S.bills.length>0;cur='vault';break;
    case 'search':html=searchScreen();tabs=true;cur='search';break;
    case 'folders':html=foldersScreen();tabs=true;cur='folders';break;
    case 'folder':html=folderScreen();tabs=true;cur='folders';break;
    case 'cat':html=catScreen();tabs=true;cur='folders';break;
    case 'edit':html=editScreen();break;
    case 'camera':html=scannerScreen();break;
    case 'scanfx':html=fxScreen();break;
    case 'confirm':html=confirmScreen();break;
    case 'saved':html=savedScreen();break;
    case 'bill':html=billScreen();break;
    case 'account':html=accountScreen();break;
    case 'pdf':html=pdfScreen();break;
    case 'multi':html=multiScreen();break;
    case 'crop':html=cropScreen();break;
  }
  var v=$('#view');v.innerHTML=html;v.classList.toggle('hasTabs',tabs);
  var rk=r.name+'|'+JSON.stringify(r.params||{});
  if(rk!==S.lastKey){S.lastKey=rk;var dir=S.navDir||'fade';v.classList.remove('nav-push','nav-pop','nav-fade');void v.offsetWidth;v.classList.add('nav-'+dir);stagger(v);}
  S.navDir=null;
  $('#tabbar').hidden=!tabs;$('#fab').hidden=!tabs;
  document.querySelectorAll('#tabbar button').forEach(function(b){b.classList.toggle('active',b.dataset.tab===cur);});
  var k=metaKey(),m=META[k]||[k,''];$('#crumbTitle').textContent=S.sheet&&S.sheet.t==='picker'?'Add a bill':m[0];$('#noteText').textContent=m[1];$('#howTo').innerHTML=HOW[k]||'';
  if(r.name==='camera')startScanner();else if(SC.stream||SC.raf)stopScanner();
  if(r.name==='scanfx')paintFx();
  if(r.name==='crop')paintCrop();
  if(r.name==='search')runSearch();if(r.name==='confirm')syncSave();if(r.name==='pdf')renderPdfPages(billById(r.params.id)||{});
  renderOverlay();
}
function setNoteFor(k){var m=META[k];if(m){$('#crumbTitle').textContent=m[0];$('#noteText').textContent=m[1];$('#howTo').innerHTML=HOW[k]||'';}}

/* ---------------- mode switching (Sitemap / Walkthrough) ---------------- */
function showProto(){$('#sitemapView').hidden=true;$('#protoView').hidden=false;$('#modeSitemapBtn').classList.remove('active');$('#modeProtoBtn').classList.add('active');}
function showSitemap(){$('#sitemapView').hidden=false;$('#protoView').hidden=true;$('#modeSitemapBtn').classList.add('active');$('#modeProtoBtn').classList.remove('active');}
function firstBill(){return sortedBills()[0];}
function ensureData(){return S.bills.length?Promise.resolve():loadSamples();}
function enter(screen){
  showProto();S.hist=[];S.sheet=null;S.dialog=null;
  var R=function(n,p){S.route={name:n,params:p||{}};};
  var p=Promise.resolve();
  switch(screen){
    case 'zero':R('zero');break;
    case 'vault':p=ensureData().then(function(){S.view='list';R('vault');});break;
    case 'vault-calendar':p=ensureData().then(function(){S.view='cal';var t=new Date();S.month={y:t.getFullYear(),m:t.getMonth()};R('vault');});break;
    case 'search':R('search');break;
    case 'folders':R('folders');break;
    case 'folder-detail':p=ensureData().then(function(){var f=S.folders[0];if(f){S.hist=[{name:'folders',params:{}}];R('folder',{id:f.id});}else R('folders');});break;
    case 'capture-picker':R(S.bills.length?'vault':'zero');S.sheet={t:'picker'};break;
    case 'capture-camera':S.hist=[{name:'vault',params:{}}];R('camera');break;
    case 'capture-confirm':case 'capture-saveIn':
      S.hist=[{name:'vault',params:{}}];if(!S.draft){var d=newDraft('Manual entry');d.status='manual';S.draft=d;}R('confirm');
      if(screen==='capture-saveIn'){render();S.sheet={t:'saveIn',ctx:'save'};renderOverlay();setNoteFor('capture-saveIn');return;}
      break;
    case 'capture-saved':R('saved');break;
    case 'bill-detail':p=ensureData().then(function(){var b=firstBill();S.hist=[{name:'vault',params:{}}];if(b)R('bill',{id:b.id});else R('vault');});break;
    case 'account':S.hist=[{name:'vault',params:{}}];R('account');break;
    case 'pdf-view':p=ensureData().then(function(){var b=firstBill();S.hist=[{name:'vault',params:{}}];if(b){S.hist.push({name:'bill',params:{id:b.id}});R('pdf',{id:b.id});}else R('vault');});break;
  }
  p.then(function(){render();if(screen==='capture-picker')setNoteFor('capture-picker');});
}

/* ---------------- actions ---------------- */
var A={
  tab:function(d){tab(d.a);},
  open:function(d){if(S.selMode){toggleSel(d.id);return;}go('bill',{id:d.id});},
  folder:function(d){S.col={q:'',cat:''};go('folder',{id:d.id});},
  seg:function(d){S.view=d.a;render();},
  chip:function(d){S.chip=d.a;render();},
  mnav:function(d){var m=S.month.m+Number(d.a),y=S.month.y;if(m<0){m=11;y--;}if(m>11){m=0;y++;}S.month={y:y,m:m};S.openDay=null;render();},
  day:function(d){S.openDay=S.openDay===d.a?null:d.a;render();},
  fab:function(){S.sheet={t:'picker'};renderOverlay();setNoteFor('capture-picker');},
  account:function(){go('account');},
  back:function(){back();},
  selCancel:function(){exitSel();},
  selAll:function(){var rows=document.querySelectorAll('#view .billRow'),all=S.sel.size>=rows.length;rows.forEach(function(r){if(all)S.sel.delete(r.dataset.id);else S.sel.add(r.dataset.id);r.classList.toggle('selected',!all);});if(!S.sel.size)exitSel();else renderSelBar();},
  selMove:function(){S.sheet={t:'saveIn',ctx:'moveMany'};renderOverlay();},
  selCat:function(){S.sheet={t:'catPick'};renderOverlay();},
  selCatSet:function(d){var L=selBills();L.forEach(function(b){b.category=d.a;b.pdfStale=true;});S.sheet=null;
    persist(function(){return Promise.all(L.map(function(b){return DB.put(b);}));}).then(function(){exitSel(true);render();toast(L.length+' bill'+(L.length===1?'':'s')+' moved to '+catLabel(d.a));L.forEach(function(b){ensurePdf(b).catch(function(){});});});},
  selPdf:function(){var L=selBills();exitSel();exportSet(L,'Selected bills ('+L.length+')');},
  selDelete:function(){S.dialog={t:'delMany'};renderOverlay();},
  delManyYes:function(){var L=selBills(),ids=new Set(L.map(function(b){return b.id;}));S.dialog=null;
    L.forEach(function(b){if(b.pdfPath&&window.RK_unstore)window.RK_unstore(b.pdfPath);});
    persist(function(){return Promise.all(L.map(function(b){return DB.del(b.id);}));}).then(function(){S.bills=S.bills.filter(function(b){return !ids.has(b.id);});exitSel(true);render();toast(L.length+' bill'+(L.length===1?'':'s')+' deleted.');});},
  scanMode2:function(d){SC.mode=d.a;SC.auto=d.a==='auto';SC.stable=0;if(d.a!=='long')SC.parts=[];render();},
  longFinish:function(){if(!SC.parts.length)return;var cs=SC.parts.map(function(p){return p.c;});SC.parts=[];stopScanner();
    var st=cs.length>1?stitchParts(cs):cs[0];beginBase(st,'Camera scan (long receipt)',{fx:true,pre:true});},
  mOpen:function(d){var dr=S.multi&&S.multi[+d.i];if(!dr||dr.status==='reading')return;S.draft=dr;go('confirm');},
  mToggle:function(d){var dr=S.multi&&S.multi[+d.i];if(!dr)return;dr.include=!dr.include;render();},
  multiAllRight:function(d,el){S.multiOk=el.checked;(S.multi||[]).forEach(function(dr){FIELDS.forEach(function(f){dr.confirmed[f]=el.checked;});});render();},
  multiDiscard:function(){S.dialog={t:'discard'};S.discardMulti=true;renderOverlay();},
  multiSave:function(){var L=(S.multi||[]).filter(function(d){return d.include&&d.status!=='reading';});if(!L.length)return;
    var bills=L.map(billFromDraft);
    persist(function(){return Promise.all(bills.map(function(b){return DB.put(b);}));}).then(function(ok){if(!ok)return;
      bills.forEach(function(b){S.bills.push(b);});S.multi=null;S.multiOk=false;S.lastSavedId=bills[0].id;
      var cats={};bills.forEach(function(b){cats[b.category]=(cats[b.category]||0)+1;});
      S.savedWhere=bills.length+' bills \u00B7 '+Object.keys(cats).map(function(c){return cats[c]+' '+catLabel(c);}).join(', ');S.pdfState='making';
      saveAnimMany(bills,function(){S.hist=[{name:'vault',params:{}}];S.navDir='fade';S.route={name:'saved',params:{}};render();});
      bills.reduce(function(p,b){return p.then(function(){return ensurePdf(b).catch(function(){});});},Promise.resolve()).then(function(){S.pdfState='ready';if(S.route.name==='saved')render();});});},
  cropOpen:function(){var dr=S.draft;if(!dr||!dr.base)return;readFields();S.cropPts=dr.quad?dr.quad.map(function(p){return p.slice();}):null;S.cropGeo=null;go('crop');},
  cropCancel:function(){S.cropPts=null;back();},
  cropApply:function(){var dr=S.draft;if(!dr)return;if(!cropValid(S.cropPts)){toast('Those corners cross over. Drag them back around the bill.');return;}
    dr.quad=S.cropPts.map(function(p){return p.slice();});dr.crop=true;S.cropPts=null;regen(dr).then(function(){back();toast('Cropped.');});},
  cropAuto:function(){var g=S.cropGeo;if(!g)return;var q=findQuad(g.src);if(!q){toast('No bill edges found. Drag the corners yourself.');return;}S.cropPts=q;layoutCrop();},
  cropFull:function(){S.cropPts=[[0,0],[1,0],[1,1],[0,1]];layoutCrop();},
  cropRot:function(){var dr=S.draft;if(!dr)return;dr.rot=(dr.rot+1)%4;dr.quad=null;S.cropPts=null;paintCrop();},
  sheetClose:function(){var sh=$('#overlay .sheet'),bd=$('#overlay .backdrop');
    if(sh&&!sh.classList.contains('closing')&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){sh.classList.add('closing');if(bd)bd.classList.add('closing');
      setTimeout(function(){S.sheet=null;renderOverlay();setNoteFor(metaKey());},200);}
    else{S.sheet=null;renderOverlay();setNoteFor(metaKey());}},
  dialogCloseAnim:function(){},
  billMenu:function(){S.sheet={t:'billMenu',id:S.route.params.id};renderOverlay();},
  folderMenu:function(d){S.sheet={t:'folderMenu',id:d.id};renderOverlay();},
  renameOpen:function(d){S.sheet={t:'rename',id:d.id||S.route.params.id,fresh:true};renderOverlay();},
  renameFolderOpen:function(d){S.sheet={t:'renameFolder',id:d.id,fresh:true};renderOverlay();},
  renameSave:function(d){var v=($('#renameInput').value||'').trim();if(!v){toast('Enter a name.');return;}
    if(S.sheet&&S.sheet.t==='renameFolder'){var f=S.folders.find(function(x){return x.id===d.id;});if(!f)return;
      if(S.folders.some(function(x){return x.id!==f.id&&x.name.toLowerCase()===v.toLowerCase();})){toast('A folder with that name already exists.');return;}
      f.name=v;S.bills.forEach(function(b){if(b.folder===f.id)b.pdfStale=true;});saveMeta();S.sheet=null;render();toast('Folder renamed.');return;}
    var b=billById(d.id);if(!b)return;b.title=v===b.vendor?'':v;b.pdfStale=true;
    persist(function(){return DB.put(b);}).then(function(){S.sheet=null;render();toast('Renamed to “'+v+'”');ensurePdf(b).then(function(){if(S.route.name==='bill')render();},function(){});});},
  editOpen:function(d){S.sheet=null;go('edit',{id:d.id||S.route.params.id});},
  editSave:function(d){var b=billById(d.id);if(!b)return;var g=function(k){return ($('#e_'+k).value||'').trim();};
    var amt=g('amount').replace(/,/g,''),a=amt===''?null:parseFloat(amt);if(amt!==''&&!isFinite(a)){toast('Amount should be a number, like 1249.50');return;}
    var cat=g('category'),oldCat=b.category;
    Object.assign(b,{vendor:g('vendor')||b.vendor,type:g('type'),amount:a,date:validDate(g('date'))||b.date,category:CATS.indexOf(cat)>=0?cat:b.category,items:g('items'),pdfStale:true});
    if(b.category!==oldCat)S.rules[rkey(b.vendor)]=b.category;
    persist(function(){return DB.put(b);}).then(saveMeta).then(function(){back();toast('Changes saved. PDF updated.');ensurePdf(b).then(function(){if(S.route.name==='bill')render();},function(){});});},
  rescan:function(d){S.rescanId=d.id||S.route.params.id;S.sheet=null;A.goCamera();toast('Scan the bill again. Its folder and name stay the same.');},
  goAllRight:function(){var ar=$('#allRight');if(!ar)return;ar.scrollIntoView({behavior:'smooth',block:'center'});ar.classList.remove('pulse');void ar.offsetWidth;ar.classList.add('pulse');},
  fcat:function(d){S.fcat=d.a;var fb=$('#fBody');if(fb){fb.innerHTML=foldersBody();stagger(fb);}},
  catOpen:function(d){S.col={q:'',cat:''};go('cat',{c:d.a});},
  colCat:function(d){S.col.cat=d.a;document.querySelectorAll('#view [data-act=colCat]').forEach(function(b){b.classList.toggle('active',b.dataset.a===d.a);});var cl=$('#colList');if(cl){cl.innerHTML=colListHtml();stagger(cl);}},
  dialogClose:function(){S.dialog=null;renderOverlay();},
  goCamera:function(){S.sheet=null;SC.batch=[];SC.fellBack=false;if(SC.ok===false&&!window.RK_camera)SC.ok=null;go('camera');},
  closeCamera:function(){stopScanner();SC.batch=[];SC.parts=[];S.rescanId=null;back();},
  snap:function(){if(SC.ok)snap();else A.shootFallback();},
  scanAuto:function(d){SC.auto=d.a==='1';SC.stable=0;document.querySelectorAll('.scModes button').forEach(function(b){b.classList.toggle('on',b.dataset.a===d.a);});},
  scanBatch:function(){S.batchMode=!S.batchMode;var b=$('.scDone');if(b)b.textContent=S.batchMode?'Batch \u2713':'Batch';toast(S.batchMode?'Batch on: capture several bills, then tap Done.':'Batch off.');},
  scanDone:function(){var list=SC.batch.slice();if(!list.length)return;SC.batch=[];stopScanner();
    if(list.length>1){startMulti(list.map(function(b){return b.pre?b.c:(function(){var q=findQuad(b.c);return q?warpQuad(b.c,q):b.c;})();}),'Camera scan');return;}
    beginBase(list[0].c,'Camera scan',{fx:true,pre:list[0].pre});},
  torch:function(){if(!SC.stream)return;SC.torch=!SC.torch;var tr=SC.stream.getVideoTracks()[0];
    tr.applyConstraints({advanced:[{torch:SC.torch}]}).catch(function(){SC.torch=false;});var b=$('#torchBtn');if(b){b.setAttribute('aria-pressed',SC.torch);b.querySelector('path').setAttribute('fill',SC.torch?'currentColor':'none');}},
  shootFallback:function(){if(window.RK_camera){window.RK_camera().then(function(f){if(f)A.scanFile(f);else if(S.route.name==='camera'&&SC.ok!==true)back();},function(e){SC.fellBack=true;var n=$('#scNoCam');if(n)n.hidden=false;if(e&&e.denied)toast('Camera permission is off. Turn it on in Android settings, or choose from the gallery.');});return;}$('#inCam').click();},
  scanFile:function(f){loadBitmap(f).then(function(bmp){stopScanner();beginBase(drawTo(bmp,2200),'Camera scan',{fx:true});},function(){toast('Couldn\'t open that photo.');});},
  batch:function(){S.batchMode=!S.batchMode;S.camCount=0;render();toast(S.batchMode?'Batch mode on: after each save you come straight back here.':'Batch mode off.');},
  shoot:function(){if(window.RK_camera){window.RK_camera().then(function(f){if(f)startFiles([f],'Camera scan');},function(e){if(e&&e.denied)toast('Camera permission is off. Turn it on in Android settings, or use the gallery button.');});return;}$('#inCam').click();},
  pick:function(d){
    if(d.a==='image'){S.sheet=null;renderOverlay();$('#inImg').click();}
    else if(d.a==='file'){S.sheet=null;renderOverlay();$('#inFile').click();}
    else if(d.a==='link'){S.sheet={t:'link'};renderOverlay();}
  },
  manual:function(){S.sheet=null;startManual();},
  readText:function(){var v=($('#pasteBox').value||'').trim();
    if(v.length<8){S.sheet={t:'link',v:v,err:'Paste a bit more of the bill so there is something to read.'};renderOverlay();return;}
    if(/^https?:\/\/\S+$/i.test(v)){S.sheet={t:'link',v:v,err:'That\'s only the link. Open it, copy the bill text from the page, and paste that here.'};renderOverlay();return;}
    startText(v,'Link import');},
  save:function(){var dr=S.draft;if(dr&&dr.multi){readFields();dr.reviewed=true;S.draft=null;S.navDir='pop';S.route=S.hist.pop()||{name:'multi',params:{}};render();return;}trySave();},
  saveIn:function(){readFields();S.sheet={t:'saveIn',ctx:'save'};renderOverlay();setNoteFor('capture-saveIn');},
  moveOpen:function(){S.sheet={t:'saveIn',ctx:'move'};renderOverlay();},
  closeCameraX:function(){},
  newFolderOpen:function(){S.sheet={t:'saveIn',ctx:'plain'};renderOverlay();},
  newFolderToggle:function(){S.sheet.newOpen=true;renderOverlay();},
  saveTo:function(d){var ctx=S.sheet&&S.sheet.ctx;S.sheet=null;if(ctx==='moveMany'){moveMany(d.id);return;}if(ctx==='move')moveBill(S.route.params.id,d.id);else trySave(d.id||null);},
  newFolderCreate:function(){var ctx=S.sheet&&S.sheet.ctx,id=createFolder($('#newFolderInput').value);if(!id)return;
    if(ctx==='moveMany'){S.sheet=null;moveMany(id);return;}
    if(ctx==='save'){S.sheet=null;trySave(id);}else if(ctx==='move')moveBill(S.route.params.id,id);else{S.sheet=null;render();toast('Folder created.');}},
  allRight:function(d,el){var dr=S.draft;if(!dr)return;dr.allOk=el.checked;FIELDS.forEach(function(f){dr.confirmed[f]=el.checked;});
    document.querySelectorAll('#view .field').forEach(function(fe){fe.classList.toggle('flagged',isFlagged(fe.dataset.field));});syncSave();},
  discard:function(){var dr=S.draft;if(dr&&dr.multi){readFields();S.draft=null;S.navDir='pop';S.route=S.hist.pop()||{name:'multi',params:{}};render();return;}if(S.draft){S.dialog={t:'discard'};renderOverlay();}else back();},
  discardYes:function(){if(S.discardMulti){S.discardMulti=false;S.multi=null;S.dialog=null;tab('vault');return;}discardNow();},
  stopRead:function(){var d=S.draft;if(S.ctl)try{S.ctl.abort();}catch(e){}if(d&&d.status==='reading'){d.status='manual';render();}},
  retry:function(){if(S.draft)runExtract(S.draft);},
  dupCheck:function(){readFields();var dup=findDup(S.draft);S.dialog=dup?{t:'dup',id:dup.id,manual:true}:{t:'nodup'};renderOverlay();},
  dupSame:function(){var id=S.dialog.id;S.dialog=null;S.draft=null;S.batchDone++;
    if(S.queue.length){toast('Already in your Vault. Skipped.');nextQueued();}
    else{S.batchTotal=0;toast('Already in your Vault. Not saved again.');go('bill',{id:id},{replace:true});}},
  dupDiff:function(){var man=S.dialog&&S.dialog.manual;if(S.draft)S.draft.dupChecked=true;S.dialog=null;if(man)renderOverlay();else commit();},
  addAnother:function(){tab('vault');S.sheet={t:'picker'};renderOverlay();setNoteFor('capture-picker');},
  loadSamples:function(){loadSamples().then(function(){S.hist=[];S.route={name:'vault',params:{}};render();toast('Sample bills added. Remove them in Settings → Data & privacy.');});},
  addSamples:function(){S.sheet=null;A.loadSamples();},
  removeSamples:function(){var gone=S.bills.filter(function(b){return b.sample;});
    persist(function(){return Promise.all(gone.map(function(b){return DB.del(b.id);}));}).then(function(){
      S.bills=S.bills.filter(function(b){return !b.sample;});
      var sf=S.folders.filter(function(f){return f.sample&&!S.bills.some(function(b){return b.folder===f.id;});}).map(function(f){return f.id;});
      S.folders=S.folders.filter(function(f){return sf.indexOf(f.id)<0;});saveMeta();S.sheet=null;render();toast('Sample bills removed.');});},
  delBill:function(d){S.sheet=null;S.dialog={t:'delBill',id:d.id||S.route.params.id};renderOverlay();},
  delBillYes:function(d){S.dialog=null;var gone=billById(d.id);if(gone&&gone.pdfPath&&window.RK_unstore)window.RK_unstore(gone.pdfPath);persist(function(){return DB.del(d.id);}).then(function(ok){if(!ok)return;S.bills=S.bills.filter(function(b){return b.id!==d.id;});back();toast('Bill deleted.');});},
  delFolder:function(d){S.sheet=null;S.dialog={t:'delFolder',id:d.id};renderOverlay();},
  delFolderYes:function(d){S.dialog=null;var ch=S.bills.filter(function(b){return b.folder===d.id;});ch.forEach(function(b){b.folder=null;});
    persist(function(){return Promise.all(ch.map(function(b){return DB.put(b);}));}).then(function(){S.folders=S.folders.filter(function(f){return f.id!==d.id;});saveMeta();tab('folders');toast('Folder deleted.');});},
  wipe:function(){S.sheet=null;S.dialog={t:'wipe'};renderOverlay();},
  wipeYes:function(){S.dialog=null;persist(function(){return DB.clear();}).then(function(ok){if(!ok)return;S.bills=[];S.folders=[];S.rules={};S.lastBackup=null;S.seeded=true;saveMeta();S.hist=[];S.route={name:'vault',params:{}};render();toast('All data deleted.');});},
  signIn:function(){S.sheet={t:'signIn'};renderOverlay();},
  privacy:function(){S.sheet={t:'privacy'};renderOverlay();},
  exportBackup:function(){exportBackup();},
  importBackup:function(){$('#inBackup').click();},
  smsToggle:function(){toast('Web pages can\'t read your SMS. Use + → Link and paste the SMS text instead.');},
  storageToggle:function(){
    if(S.persisted){toast('Storage protection is on. Your browser keeps these bills unless you clear site data.');return;}
    try{navigator.storage.persist().then(function(g){S.persisted=!!g;render();toast(g?'Storage protection on.':'Your browser didn\'t allow protected storage. Keep a backup file.');});}catch(e){toast('This browser can\'t protect storage. Keep a backup file.');}
  },
  bigImg:function(){S.bigImg=!S.bigImg;render();},
  saveKey:function(){var v=($('#apiKey').value||'').trim();if(!/^sk-/.test(v)){toast('That doesn\'t look like an Anthropic API key (it starts with sk-).');return;}window.RK_key.set(v).then(function(){render();toast('Key saved. New bills will be read automatically.');});},
  saveOcrKey:function(){var v=($('#ocrKey').value||'').trim();if(v.length<8){toast('Paste your OCR.space key first.');return;}window.RK_ocrKey.set(v).then(function(){render();toast('OCR.space key saved.');});},
  clearKey:function(){window.RK_key.set(null).then(function(){render();toast('Key removed.');});},
  sharePdf:function(){var b=billById(S.route.params.id);if(b)sharePdf(b);},
  viewPdf:function(d){var id=d.id||S.route.params.id;if(billById(id))go('pdf',{id:id});},
  exportPdf:function(d){S.sheet=null;if(d.a==='col'){var r0=S.route;exportSet(colFiltered(),(r0.name==='cat'?catLabel(r0.params.c):'Folder - '+(folderName(r0.params.id)||''))+(S.col&&S.col.q?' - "'+S.col.q+'"':''));renderOverlay();return;}
    var list=d.a==='vault'?sortedBills().filter(chipFilter):d.a==='folder'?S.bills.filter(function(b){return b.folder===S.route.params.id;}):(S.lastResults||[]);exportSet(list,exportLabel(d.a));},
  scanMode:function(d){var dr=S.draft;if(!dr||!dr.base)return;readFields();dr.mode=d.a;regen(dr).then(render);},
  scanCrop:function(){var dr=S.draft;if(!dr||!dr.base)return;readFields();if(dr.quad){dr.quad=null;dr.crop=true;}else dr.crop=!dr.crop;regen(dr).then(render);},
  scanRot:function(){var dr=S.draft;if(!dr||!dr.base)return;readFields();dr.quad=null;dr.rot=(dr.rot+1)%4;regen(dr).then(render);},
  scanBig:function(){readFields();S.bigScan=!S.bigScan;render();},
  shareApp:function(){var b=billById(S.route.params.id);if(!b)return;var t=billText(b);
    if(window.RK_share){ensurePdf(b).then(function(pdf){return window.RK_share(pdfFileName(b),pdf,b.vendor+' — '+money(b),t);}).catch(function(){toast('Couldn\'t open the share sheet.');});return;}
    var ok=function(){toast('Bill details copied. Paste into WhatsApp, email or any app.');},no=function(){toast('Copy is blocked here. Use Share as PDF instead.');};
    try{navigator.clipboard.writeText(t).then(ok,no);}catch(e){no();}}
};

(function(){var drag=null;
  document.addEventListener('pointerdown',function(e){var hd=e.target.closest&&e.target.closest('#cropStage .cH');if(!hd||!S.cropGeo)return;e.preventDefault();drag={i:+hd.dataset.i,id:e.pointerId};hd.classList.add('on');try{hd.setPointerCapture(e.pointerId);}catch(x){}moveTo(e);});
  document.addEventListener('pointermove',function(e){if(drag&&e.pointerId===drag.id)moveTo(e);});
  var end=function(e){if(!drag)return;var hd=document.querySelector('#cropStage .cH.on');if(hd)hd.classList.remove('on');var lp=$('#loupe');if(lp)lp.classList.remove('show');drag=null;};
  document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
  function moveTo(e){var g=S.cropGeo,st=$('#cropStage');if(!g||!st)return;var r=st.getBoundingClientRect();
    var nx=Math.max(0,Math.min(1,(e.clientX-r.left-g.ox)/g.w)),ny=Math.max(0,Math.min(1,(e.clientY-r.top-g.oy)/g.h));S.cropPts[drag.i]=[nx,ny];layoutCrop();
    var lp=$('#loupe');if(!lp)return;var lx=e.clientX-r.left,ly=e.clientY-r.top,z=2.6,src=g.src,sx=nx*src.width,sy=ny*src.height,rad=110/z*(src.width/g.w);
    var c=lp.getContext('2d');c.clearRect(0,0,220,220);c.save();c.beginPath();c.arc(110,110,108,0,7);c.clip();c.fillStyle='#000';c.fillRect(0,0,220,220);
    c.drawImage(src,sx-rad,sy-rad,rad*2,rad*2,0,0,220,220);c.strokeStyle='#F4D655';c.lineWidth=2;c.beginPath();c.moveTo(110,92);c.lineTo(110,128);c.moveTo(92,110);c.lineTo(128,110);c.stroke();c.restore();
    lp.style.transform='translate('+(lx-55)+'px,'+Math.max(4,ly-150)+'px) scale(.5)';lp.classList.add('show');}
})();
(function(){var lp=null;
  document.addEventListener('pointerdown',function(e){var r=e.target.closest&&e.target.closest('#view .billRow');if(!r||S.selMode)return;
    lp={x:e.clientX,y:e.clientY,id:r.dataset.id,t:setTimeout(function(){S.lpFired=true;r.classList.add('pressed');enterSel(r.dataset.id);setTimeout(function(){r.classList.remove('pressed');},200);},430)};r.classList.add('holding');});
  var cancel=function(){if(lp){clearTimeout(lp.t);var r=document.querySelector('#view .billRow.holding');if(r)r.classList.remove('holding');lp=null;}};
  document.addEventListener('pointermove',function(e){if(lp&&Math.hypot(e.clientX-lp.x,e.clientY-lp.y)>9)cancel();});
  document.addEventListener('pointerup',cancel);document.addEventListener('pointercancel',cancel);
  document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('#view .billRow'))e.preventDefault();});
})();
document.addEventListener('click',function(e){var t=e.target.closest('[data-act]');if(!t)return;if(S.lpFired&&t.dataset.act==='open'){S.lpFired=false;return;}S.lpFired=false;var h=A[t.dataset.act];if(h)h(t.dataset,t,e);});
document.addEventListener('input',function(e){var t=e.target,d=S.draft;
  if(t.id==='q'){S.search.q=t.value;runSearch();return;}
  if(t.id==='fq'){S.fq=t.value;var fb=$('#fBody');if(fb)fb.innerHTML=foldersBody();return;}
  if(t.id==='colQ'){S.col.q=t.value;var cl=$('#colList');if(cl)cl.innerHTML=colListHtml();return;}
  if(t.id==='renameInput'&&S.sheet&&S.sheet.t==='rename'){var rb=billById(S.sheet.id),rp=$('#renamePrev');if(rb&&rp)rp.textContent=safeName(rb.category)+' - '+safeName(t.value.trim()||rb.vendor)+' - '+rb.date+'.pdf';return;}
  if(t.dataset&&t.dataset.f&&t.type!=='checkbox'&&d){d.fields[t.dataset.f]=t.value;
    if(isFlagged(t.dataset.f)){d.confirmed[t.dataset.f]=true;var f=t.closest('.field');if(f)f.classList.remove('flagged');syncSave();}}
});
document.addEventListener('change',function(e){var t=e.target;
  if(t.id==='fCat'){S.search.cat=t.value;t.classList.toggle('on',!!t.value);runSearch();}
  else if(t.id==='fRange'){S.search.range=t.value;t.classList.toggle('on',!!t.value);runSearch();}
  else if(t.id==='fFolder'){S.search.folder=t.value;t.classList.toggle('on',!!t.value);runSearch();}
  else if(t.id==='f_category'&&S.draft){S.draft.fields.category=t.value;if(isFlagged('category')){S.draft.confirmed.category=true;t.closest('.field').classList.remove('flagged');syncSave();}}
  else if(t.id==='catSel'){var b=billById(t.dataset.id);if(!b)return;b.category=t.value;b.pdfStale=true;S.rules[rkey(b.vendor)]=t.value;
    persist(function(){return DB.put(b);}).then(saveMeta).then(function(){toast('Saved. Future bills from '+b.vendor+' go to '+t.value+'. Past ones are unchanged.');});}
  else if(t.id==='inCam'&&t.files&&t.files.length===1&&/^image\//.test(t.files[0].type)){showProto();A.scanFile(t.files[0]);t.value='';}
  else if(t.id==='inCam'||t.id==='inImg'||t.id==='inFile'){var fs=t.files;if(fs&&fs.length){showProto();startFiles(fs,t.id==='inCam'?'Camera scan':t.id==='inImg'?'Image':'File upload');}t.value='';}
  else if(t.id==='inBackup'){if(t.files&&t.files[0])importBackup(t.files[0]);t.value='';}
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(S.dialog){S.dialog=null;renderOverlay();}else if(S.sheet){A.sheetClose();}}
  if(e.key==='Enter'&&e.target.id==='newFolderInput')A.newFolderCreate();
  if(e.key==='Enter'&&e.target.id==='renameInput')A.renameSave({id:S.sheet&&S.sheet.id});
});
$('#modeSitemapBtn').addEventListener('click',showSitemap);
$('#toSitemap').addEventListener('click',showSitemap);
$('#modeProtoBtn').addEventListener('click',function(){showProto();render();});
$('#startWalk').addEventListener('click',function(){enter('zero');});
$('#backBtn').addEventListener('click',function(){if(S.dialog){S.dialog=null;renderOverlay();}else if(S.sheet){A.sheetClose();}else back();});
document.querySelectorAll('[data-screen]').forEach(function(b){b.addEventListener('click',function(){enter(b.dataset.screen);});});

document.addEventListener('visibilitychange',function(){if(document.hidden){if(SC.stream)stopScanner();}else if(S.route.name==='camera'&&SC.ok!==false){startScanner();}});
window.RK_test={stitchParts:function(c){return stitchParts(c);}};
window.RK_back=function(){
  if(S.selMode){exitSel();return true;}
  if(S.route.name==='crop'){A.cropCancel();return true;}
  if(S.route.name==='multi'){A.multiDiscard();return true;}
  if(S.route.name==='camera'){A.closeCamera();return true;}
  if(S.route.name==='scanfx')return true;
  if(S.dialog){S.dialog=null;renderOverlay();return true;}
  if(S.sheet){A.sheetClose();return true;}
  if(S.route.name==='confirm'&&S.draft){A.discard();return true;}
  if(S.hist.length){back();return true;}
  if(S.route.name!=='vault'){tab('vault');return true;}
  return false;
};
/*@@UI@@*/
/* ---------------- boot ---------------- */
DB.open().then(function(){
  var g=function(k){return DB.getMeta(k).catch(function(){});};
  return Promise.all([DB.all().catch(function(){return [];}),g('folders'),g('rules'),g('lastBackup'),g('seeded'),g('onboarded'),g('recent'),g('prefs')]);
}).then(function(r){
  S.bills=r[0]||[];S.folders=r[1]||[];S.rules=r[2]||{};S.lastBackup=r[3]||null;S.seeded=!!r[4];S.onboarded=!!r[5];S.recent=r[6]||[];
  S.prefs=Object.assign({defView:'list',boost:true},r[7]||{});S.view=S.prefs.defView==='cal'?'cal':'list';
  try{navigator.storage.persisted().then(function(p){S.persisted=!!p;});}catch(e){}
  if(!S.onboarded&&!S.bills.length)S.route={name:'onboard',params:{i:0}};
  return (S.seeded||window.RK_NATIVE)?null:loadSamples();
}).then(function(){if(window.RK_NATIVE){showProto();}render();var sp=document.getElementById('splash');if(sp){sp.classList.add('out');setTimeout(function(){sp.remove();},500);}});
})();
