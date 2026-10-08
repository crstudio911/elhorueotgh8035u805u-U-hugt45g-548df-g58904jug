(function(){
var API='https://coolai-api.uuuuouuuuuuouuu.workers.dev',TK='coolai_admin_t',THK='coolai_admin_theme';
var $=function(i){return document.getElementById(i)},main,cur='stats';
document.documentElement.setAttribute('data-theme',localStorage.getItem(THK)||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
var TITLES={stats:'نظرة عامة',users:'المستخدمين',posts:'المنشورات',messages:'رسائل المجتمع',invoices:'الفواتير',offers:'أكواد الخصم',data:'كل البيانات',settings:'الإعدادات وشخصية Cool'};
var ICONS={stats:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M17 11a3 3 0 1 0 0-6M21 20c0-2.5-1.8-4.2-4-4.8"/>',posts:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',messages:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',invoices:'<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',offers:'<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',data:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',ban:'<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',check:'<path d="M20 6L9 17l-5-5"/>',cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>'};
function ico(n){var s=h('span',{class:'ic'});s.innerHTML='<svg viewBox="0 0 24 24">'+(ICONS[n]||'')+'</svg>';return s}
function h(t,a,k){var e=document.createElement(t);a=a||{};Object.keys(a).forEach(function(n){var v=a[n];if(v===null||v===undefined)return;if(n==='class')e.className=v;else if(n==='text')e.textContent=v;else if(n.slice(0,2)==='on')e[n]=v;else e.setAttribute(n,v)});(k||[]).forEach(function(c){if(c!==null&&c!==undefined)e.appendChild(typeof c==='object'?c:document.createTextNode(String(c)))});return e}
function btn(t,f,c){return h('button',{class:'btn sm '+(c||''),type:'button',text:t,onclick:f})}
function toast(m,bad){var t=h('div',{class:'toast'+(bad?' bad':''),text:m});$('toasts').appendChild(t);setTimeout(function(){t.remove()},3400)}
var EM={email:'البريد غير صالح',exists:'البريد مستخدم لحساب تاني',name:'الاسم من 2 إلى 40 حرف',num:'الرقم غير صالح',code:'كود الدعوة من 4 إلى 12 حرف أو رقم إنجليزي',codeused:'كود الدعوة مستخدم',avatar:'رابط الصورة لازم يكون من imgBB',none:'غير موجود',pw:'كلمة السر من 8 إلى 128 حرف',server:'خطأ في الخادم',bad:'بيانات غير صالحة'};
function msg(r){return EM[r.error]||r.error||'حصل خطأ'}
function out(){sessionStorage.removeItem(TK);$('app').hidden=true;$('login').hidden=false}
function call(act,body){
return fetch(API+'/api/admin/'+act,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+(sessionStorage.getItem(TK)||'')},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){j.status=r.status;if(r.status===401){out();j.error='انتهت الجلسة'}return j})}).catch(function(){return{error:'تعذر الاتصال بالخادم',status:0}})}
function ask(title,fields,ok){
return new Promise(function(res){
var d=$('dlg'),f=$('dlgf'),ins={};f.textContent='';f.appendChild(h('h3',{text:title}));
fields.forEach(function(x){var i=x.area?h('textarea',{rows:x.rows||4}):h('input',{type:x.type||'text'});if(x.type==='checkbox')i.checked=!!x.value;else if(x.value!==undefined&&x.value!==null)i.value=x.value;if(x.ph)i.placeholder=x.ph;if(x.ltr)i.classList.add('ltr');if(x.hint)i.autocomplete='off';ins[x.k]=i;f.appendChild(h('label',{class:'fl'},[x.label,i]))});
f.appendChild(h('div',{class:'row end'},[h('button',{class:'btn',type:'button',text:'إلغاء',onclick:function(){d.close();res(null)}}),h('button',{class:'btn primary',type:'submit',text:ok||'حفظ'})]));
f.onsubmit=function(e){e.preventDefault();var o={};Object.keys(ins).forEach(function(k){o[k]=ins[k].type==='checkbox'?ins[k].checked:ins[k].value});d.close();res(o)};
d.oncancel=function(){res(null)};d.showModal()})}
function save(name,text,type){var a=h('a',{href:URL.createObjectURL(new Blob([text],{type:type||'text/plain'})),download:name});document.body.appendChild(a);a.click();a.remove()}
function csv(hd,rows){var q=function(x){x=String(x);if(/^[=+\-@]/.test(x))x="'"+x;return /[",\n\r]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x};return '\ufeff'+[hd].concat(rows).map(function(r){return r.map(q).join(',')}).join('\r\n')}
function tm(v){var n=+v;return n?new Date(n).toLocaleString('ar-EG',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit',hour12:true}):String(v||'')}
function tbl(heads,rows){return h('div',{class:'tw'},[h('table',{},[h('thead',{},[h('tr',{},heads.map(function(x){return h('th',{text:x})}))]),h('tbody',{},rows.map(function(r){return h('tr',{},r.map(function(c){return h('td',{},[c])}))}))])])}
function pager(total,size,pg,fn){var n=Math.max(1,Math.ceil(total/size));return h('div',{class:'row pager'},[h('button',{class:'btn sm',text:'السابق',disabled:pg<=1?'':undefined,onclick:function(){fn(pg-1)}}),h('span',{text:pg+' / '+n+' ('+total+')'}),h('button',{class:'btn sm',text:'التالي',disabled:pg>=n?'':undefined,onclick:function(){fn(pg+1)}})])}
function skel(box){box.textContent='';box.appendChild(h('div',{class:'skel'}))}
function debounce(inp,fn){inp.oninput=function(){clearTimeout(inp.t);inp.t=setTimeout(fn,350)}}
function badge(s){return h('span',{class:'badge '+s,text:({pending:'قيد المراجعة',paid:'مدفوعة',rejected:'مرفوضة',ok:'نشط',bad:'موقوف'})[s]||s})}
function fail(box,r){box.textContent='';box.appendChild(h('p',{class:'err',text:msg(r)}))}
var V={};
V.stats=function(){
var box=h('div');main.appendChild(box);skel(box);
call('aStats').then(function(r){
if(r.error)return fail(box,r);
box.textContent='';
var items=[['users','المستخدمين',r.users],['coin','إجمالي الكوينز',r.coins],['bolt','إجمالي الكريديت',r.credits],['ban','موقوفين',r.banned],['clock','فواتير قيد المراجعة',r.pending],['check','فواتير مدفوعة',r.paid],['cash','الإيراد (جنيه)',r.revenue],['posts','المنشورات',r.posts],['messages','رسائل المجتمع',r.messages],['key','جلسات نشطة',r.sessions]];
box.appendChild(h('div',{class:'grid'},items.map(function(x){return h('div',{class:'card stat'},[ico(x[0]),h('div',{},[h('b',{text:String(x[2])}),h('span',{text:x[1]})])])})));
box.appendChild(h('div',{class:'row'},[h('button',{class:'btn primary',text:'تحميل نسخة احتياطية كاملة',onclick:backup})]));
box.appendChild(h('div',{class:'h3',text:'آخر الفواتير قيد المراجعة'}));
var pb=h('div');box.appendChild(pb);
call('aRead',{sheet:'invoices',q:'pending',size:6,rev:true}).then(function(q){
if(q.error||!q.rows.length)return pb.appendChild(h('p',{class:'note',text:q.error?msg(q):'مفيش فواتير قيد المراجعة'}));
var ix=function(n){return q.header.indexOf(n)};
pb.appendChild(tbl(['الفاتورة','الاسم','كوينز','الإجمالي','التاريخ',''],q.rows.map(function(x){var g=function(n){return x.v[ix(n)]};return[g('invoiceId'),g('name'),g('coins'),g('total')+' جنيه',g('createdAt'),btn('تأكيد الدفع',function(){call('aInv',{invoiceId:g('invoiceId'),status:'paid'}).then(function(z){if(z.error)toast(msg(z),1);else{toast(z.credited?'تمت إضافة الكوينز':'مضافة قبل كده');show('stats')}})},'ok')]})))})})};
function backup(){call('aBackup').then(function(r){if(r.error)return toast(msg(r),1);save('coolai-backup-'+Date.now()+'.json',JSON.stringify(r,null,1),'application/json');toast('تم تحميل النسخة')})}
V.users=function(){
var q='',pg=1,sr=h('input',{placeholder:'بحث بالاسم أو البريد أو الكود'}),box=h('div');
main.appendChild(h('div',{class:'bar'},[sr,h('button',{class:'btn',text:'تحديث',onclick:function(){load()}})]));main.appendChild(box);
debounce(sr,function(){q=sr.value;pg=1;load()});
function done(r,m){if(r.error)toast(msg(r),1);else{toast(m||'تم');load()}}
function edit(g){
ask('تعديل المستخدم',[{k:'name',label:'الاسم',value:g('name')},{k:'email',label:'البريد الإلكتروني',value:g('email'),ltr:1},{k:'coins',label:'الكوينز',type:'number',value:g('coins')},{k:'credits',label:'الكريديت',type:'number',value:g('credits')},{k:'inviteCode',label:'كود الدعوة',value:g('inviteCode'),ltr:1},{k:'referredBy',label:'تمت دعوته بكود',value:g('referredBy'),ltr:1},{k:'avatar',label:'رابط الصورة (imgBB)',value:g('avatar'),ltr:1},{k:'pw',label:'كلمة سر جديدة (سيبها فاضية لو مش عايز تغيرها)',type:'password',hint:1,ltr:1},{k:'rn',label:'إلغاء موعد تجديد الكريديت المجاني',type:'checkbox'}]).then(function(o){
if(!o)return;
call('aUserEdit',{userId:g('userId'),password:o.pw,fields:{name:o.name,email:o.email,coins:o.coins,credits:o.credits,inviteCode:o.inviteCode,referredBy:o.referredBy,avatar:o.avatar,resetRenew:o.rn}}).then(function(r){done(r,'تم حفظ التعديلات')})})}
function adj(uid){ask('إضافة أو خصم رصيد',[{k:'c',label:'الكوينز (موجب للإضافة وسالب للخصم)',type:'number',value:'0'},{k:'k',label:'الكريديت (موجب للإضافة وسالب للخصم)',type:'number',value:'0'}]).then(function(o){if(!o)return;var c=Math.floor(+o.c)||0,k=Math.floor(+o.k)||0;if(!c&&!k)return;call('aUserAdj',{userId:uid,coins:c,credits:k}).then(function(r){done(r)})})}
function load(){skel(box);call('aRead',{sheet:'users',q:q,page:pg,size:30,rev:true}).then(function(r){
if(r.error)return fail(box,r);box.textContent='';
var ix=function(n){return r.header.indexOf(n)};
var rows=r.rows.map(function(x){var g=function(n){return ix(n)<0?'':x.v[ix(n)]},uid=g('userId'),bn=g('banned')==='1';
return[g('name'),g('email'),g('coins'),g('credits'),g('inviteCode'),g('createdAt'),badge(bn?'bad':'ok'),h('div',{class:'acts'},[btn('تعديل',function(){edit(g)}),btn('رصيد',function(){adj(uid)}),btn('إنهاء الجلسات',function(){call('aKick',{userId:uid}).then(function(z){done(z,'تم إنهاء جلساته')})}),btn(bn?'فك الحظر':'حظر',function(){call('aBan',{userId:uid,banned:!bn}).then(function(z){done(z)})}),btn('حذف',function(){if(!confirm('حذف المستخدم نهائياً؟'))return;call('aDelUser',{userId:uid}).then(function(z){done(z,'تم الحذف')})},'danger')])]});
box.appendChild(tbl(['الاسم','البريد','كوينز','كريديت','كود الدعوة','الانضمام','الحالة','إجراءات'],rows));
box.appendChild(pager(r.total,30,pg,function(p){pg=p;load()}))})}
load()};
function feed(sheet,cols,labels,clearable){
return function(){
var q='',pg=1,sr=h('input',{placeholder:'بحث'}),box=h('div'),bar=[sr,h('button',{class:'btn',text:'تحديث',onclick:function(){load()}})];
if(clearable)bar.push(h('button',{class:'btn danger',text:'مسح الكل',onclick:function(){if(!confirm('مسح كل الصفوف؟'))return;call('aClear',{sheet:sheet}).then(function(r){if(r.error)toast(msg(r),1);else{toast('تم المسح');load()}})}}));
main.appendChild(h('div',{class:'bar'},bar));main.appendChild(box);debounce(sr,function(){q=sr.value;pg=1;load()});
function load(){skel(box);call('aRead',{sheet:sheet,q:q,page:pg,size:30,rev:true}).then(function(r){
if(r.error)return fail(box,r);box.textContent='';
var ix=function(n){return r.header.indexOf(n)};
var rows=r.rows.map(function(x){var g=function(n){return ix(n)<0?'':x.v[ix(n)]};
var cells=cols.map(function(c){var v=g(c);if(c==='ts')return tm(v);if(c==='image')return v?h('a',{href:v,target:'_blank',rel:'noopener noreferrer',text:'صورة'}):'-';return v});
cells.push(h('div',{class:'acts'},[btn('تعديل النص',function(){ask('تعديل النص',[{k:'t',label:'النص',area:1,rows:6,value:g('text')}]).then(function(o){if(!o)return;call('aSet',{sheet:sheet,row:x.r,col:ix('text')+1,value:o.t}).then(function(z){if(z.error)toast(msg(z),1);else{toast('تم');load()}})})}),btn('حذف',function(){if(!confirm('حذف؟'))return;call('aDel',{sheet:sheet,row:x.r}).then(function(z){if(z.error)toast(msg(z),1);else{toast('تم الحذف');load()}})},'danger')]));return cells});
box.appendChild(tbl(labels.concat(['إجراءات']),rows));box.appendChild(pager(r.total,30,pg,function(p){pg=p;load()}))})}
load()}}
V.posts=feed('posts',['name','text','image','likes','ts'],['الكاتب','النص','الصورة','الإعجابات','الوقت'],false);
V.messages=feed('messages',['name','text','ts'],['الكاتب','الرسالة','الوقت'],true);
V.invoices=function(){
var st='',pg=1,sel=h('select',{},[['','الكل'],['pending','قيد المراجعة'],['paid','مدفوعة'],['rejected','مرفوضة']].map(function(o){return h('option',{value:o[0],text:o[1]})})),box=h('div');
main.appendChild(h('div',{class:'bar'},[sel,h('button',{class:'btn',text:'تحديث',onclick:function(){load()}})]));main.appendChild(box);
sel.onchange=function(){st=sel.value;pg=1;load()};
function setS(id,s){call('aInv',{invoiceId:id,status:s}).then(function(r){if(r.error)return toast(msg(r),1);toast(s==='paid'?(r.credited?'تمت إضافة الكوينز للعميل':'الكوينز مضافة قبل كده'):'تم');load()})}
function load(){skel(box);call('aRead',{sheet:'invoices',q:st,page:pg,size:30,rev:true}).then(function(r){
if(r.error)return fail(box,r);box.textContent='';
var ix=function(n){return r.header.indexOf(n)};
var rows=r.rows.map(function(x){var g=function(n){return ix(n)<0?'':x.v[ix(n)]},id=g('invoiceId'),s=String(g('status')).trim().toLowerCase();
return[id,g('name'),g('email'),g('coins'),g('code')||'-',g('discount'),g('total'),badge(s),g('createdAt'),g('credited')?'تمت':'-',h('div',{class:'acts'},[btn('تأكيد الدفع',function(){setS(id,'paid')},'ok'),btn('رفض',function(){setS(id,'rejected')},'danger'),btn('قيد المراجعة',function(){setS(id,'pending')})])]});
box.appendChild(tbl(['رقم الفاتورة','الاسم','البريد','كوينز','الكود','الخصم','الإجمالي','الحالة','التاريخ','الإضافة','إجراءات'],rows));
box.appendChild(pager(r.total,30,pg,function(p){pg=p;load()}))})}
load()};
V.offers=function(){
var box=h('div');
main.appendChild(h('div',{class:'bar'},[h('button',{class:'btn primary',text:'كود جديد',onclick:add})]));main.appendChild(box);
function add(){ask('كود خصم جديد',[{k:'c',label:'الكود',ltr:1},{k:'o',label:'قيمة الخصم بالجنيه',type:'number',value:'10'}]).then(function(o){if(!o||!o.c.trim())return;call('aAdd',{sheet:'offcode',values:[o.c.trim().toUpperCase(),Math.max(0,+o.o||0)]}).then(function(r){if(r.error)toast(msg(r),1);else{toast('تمت الإضافة');load()}})})}
function load(){skel(box);call('aRead',{sheet:'offcode',all:true}).then(function(r){
if(r.error)return fail(box,r);box.textContent='';
var rows=r.rows.map(function(x){return[x.v[0],x.v[1]+' جنيه',h('div',{class:'acts'},[btn('تعديل',function(){ask('تعديل الخصم',[{k:'o',label:'القيمة بالجنيه',type:'number',value:x.v[1]}]).then(function(o){if(!o)return;call('aSet',{sheet:'offcode',row:x.r,col:2,value:String(Math.max(0,+o.o||0))}).then(function(){toast('تم');load()})})}),btn('حذف',function(){if(!confirm('حذف الكود؟'))return;call('aDel',{sheet:'offcode',row:x.r}).then(function(){toast('تم');load()})},'danger')])]});
box.appendChild(tbl(['الكود','الخصم','إجراءات'],rows))})}
load()};
V.data=function(){
var sh='users',pg=1,q='',hd=[],box=h('div'),sel=h('select'),sr=h('input',{placeholder:'بحث داخل الورقة'});
main.appendChild(h('div',{class:'bar'},[sel,sr,h('button',{class:'btn',text:'إضافة صف',onclick:addRow}),h('button',{class:'btn',text:'CSV',onclick:function(){exp('csv')}}),h('button',{class:'btn',text:'JSON',onclick:function(){exp('json')}}),h('button',{class:'btn danger',text:'مسح الورقة',onclick:clr})]));
main.appendChild(box);
sel.onchange=function(){sh=sel.value;pg=1;load()};debounce(sr,function(){q=sr.value;pg=1;load()});
call('aSheets').then(function(r){if(r.error)return toast(msg(r),1);(r.sheets||[]).forEach(function(s){sel.appendChild(h('option',{value:s.name,text:s.name+' ('+s.rows+')'}))});sh=sel.value||'users';load()});
function exp(k){call('aRead',{sheet:sh,all:true}).then(function(r){if(r.error)return toast(msg(r),1);if(k==='csv')save(sh+'.csv',csv(r.header,r.rows.map(function(x){return x.v})),'text/csv');else save(sh+'.json',JSON.stringify(r.rows.map(function(x){var o={};r.header.forEach(function(c,i){o[c]=x.v[i]});return o}),null,1),'application/json')})}
function addRow(){if(!hd.length)return;ask('إضافة صف في '+sh,hd.map(function(c){return{k:c,label:c}})).then(function(o){if(!o)return;call('aAdd',{sheet:sh,values:hd.map(function(c){return o[c]})}).then(function(r){if(r.error)toast(msg(r),1);else{toast('تمت الإضافة');load()}})})}
function clr(){ask('مسح كل صفوف '+sh,[{k:'n',label:'اكتب اسم الورقة للتأكيد: '+sh,ltr:1}],'مسح').then(function(o){if(!o||o.n!==sh)return;call('aClear',{sheet:sh}).then(function(r){if(r.error)toast(msg(r),1);else{toast('تم المسح');load()}})})}
function load(){skel(box);call('aRead',{sheet:sh,q:q,page:pg,size:50}).then(function(r){
if(r.error)return fail(box,r);box.textContent='';hd=r.header;
var rows=r.rows.map(function(x){var cells=x.v.map(function(v,c){var sp=h('span',{text:v});sp.dataset.r=x.r;sp.dataset.c=c;return sp});return cells.concat([btn('حذف',function(){if(!confirm('حذف الصف؟'))return;call('aDel',{sheet:sh,row:x.r}).then(function(rr){if(rr.error)toast(msg(rr),1);else{toast('تم الحذف');load()}})},'danger')])});
var t=tbl(hd.concat(['']),rows);
t.querySelectorAll('td').forEach(function(td){var sp=td.firstChild;if(!sp||!sp.dataset||sp.dataset.r===undefined)return;td.className='ed';td.title='اضغط مرتين للتعديل';td.ondblclick=function(){if(td.querySelector('input'))return;var old=sp.textContent,i=h('input',{class:'ce',value:old}),dn=false;td.textContent='';td.appendChild(i);i.focus();i.select();
function fin(s){if(dn)return;dn=true;var v=i.value;td.textContent='';td.appendChild(sp);if(s&&v!==old){call('aSet',{sheet:sh,row:+sp.dataset.r,col:+sp.dataset.c+1,value:v}).then(function(rr){if(rr.error)toast(msg(rr),1);else{sp.textContent=v;toast('تم الحفظ')}})}}
i.onkeydown=function(e){if(e.key==='Enter')fin(true);if(e.key==='Escape')fin(false)};i.onblur=function(){fin(true)}}});
box.appendChild(t);box.appendChild(pager(r.total,50,pg,function(p){pg=p;load()}));
box.appendChild(h('p',{class:'note',text:'اضغط مرتين على أي خانة لتعديلها، Enter للحفظ وEsc للإلغاء.'}))})}};
var FIELDS=[['coin_price','سعر الكوين بالجنيه'],['min_coins','أقل عدد كوينز للشراء'],['max_coins','أقصى عدد كوينز للشراء'],['image_cost','تكلفة رسم صورة (كريديت، 1 إلى 10)'],['free_credits','الكريديت المجاني (للحساب الجديد وكل تجديد)'],['free_hours','ساعات تجديد الكريديت المجاني'],['invite_new','مكافأة الصديق الجديد بكود الدعوة'],['invite_owner','مكافأة صاحب كود الدعوة']];
function modelTester(ta,kind,res){
return h('button',{class:'btn sm',type:'button',text:'اختبار الموديلات',onclick:function(){
var list=ta.value.split(',').map(function(x){return x.trim()}).filter(Boolean);
if(!list.length)return;
if(kind==='image'&&!confirm('اختبار الصور بيستهلك جزء بسيط من الحد اليومي. متابعة؟'))return;
res.textContent='';
list.reduce(function(p,m){return p.then(function(){var line=h('div',{text:'... '+m});res.appendChild(line);return call('testmodel',{model:m,kind:kind}).then(function(r){var ok=r.ok===true;line.className=ok?'good':'no';line.textContent=(ok?'يعمل: ':'لا يعمل: ')+m+(r.ms?' ('+r.ms+'ms)':'')+(ok?'':' - '+(r.error||''))})})},Promise.resolve())}})}
V.settings=function(){
var box=h('div');main.appendChild(box);skel(box);
call('cfg').then(function(r){
if(r.error)return fail(box,r);box.textContent='';
var S=r.settings||{},D=r.def||{},ins={},L=h('div'),R=h('div'),cols=h('div',{class:'cols'},[L,R]);
var pa=h('textarea',{rows:16});pa.value=S.persona||D.persona||'';ins.persona=pa;
L.appendChild(h('div',{class:'card sec'},[h('h3',{text:'شخصية Cool'}),h('p',{class:'note',text:'تعليمات النظام: بتحدد الشخصية والهوية والأسلوب. لو سبتها زي الافتراضي بتفضل الشخصية الأصلية.'}),h('label',{class:'fl'},['النص الكامل',pa]),h('button',{class:'btn sm',type:'button',text:'استرجاع الافتراضي',onclick:function(){pa.value=D.persona||''}})]));
var g=h('div',{class:'two'});
FIELDS.forEach(function(f){var i=h('input',{type:'number',min:'0'});i.value=S[f[0]]!==undefined&&S[f[0]]!==''?S[f[0]]:(D[f[0]]===undefined?'':D[f[0]]);ins[f[0]]=i;g.appendChild(h('label',{class:'fl'},[f[1],i]))});
R.appendChild(h('div',{class:'card sec'},[h('h3',{text:'الأسعار والمكافآت'}),g]));
var cm=h('textarea',{rows:3,class:'ltr',dir:'ltr'}),im=h('textarea',{rows:3,class:'ltr',dir:'ltr'}),cr=h('div',{class:'res'}),ir=h('div',{class:'res'});
cm.value=S.chat_models||D.chat_models||'';im.value=S.image_models||D.image_models||'';ins.chat_models=cm;ins.image_models=im;
R.appendChild(h('div',{class:'card sec'},[h('h3',{text:'الموديلات'}),h('p',{class:'note',text:'اكتب اسم الموديل زي ما هو في كتالوج Cloudflare (يبدأ بـ @cf/) وافصل بينهم بفاصلة. الأول هو المستخدم، والباقي احتياطي لو الأول وقع. تقدر تكتب موديل واحد بس. الحد اليومي المجاني (10,000 نيورون) مشترك بين كل الموديلات والفرق إن كل موديل بيستهلك منه بمعدل مختلف.'}),h('a',{class:'btn sm',href:'https://developers.cloudflare.com/workers-ai/models/',target:'_blank',rel:'noopener noreferrer',text:'كتالوج الموديلات'}),h('label',{class:'fl',style:null},['موديلات الشات',cm]),modelTester(cm,'text',cr),cr,h('label',{class:'fl'},['موديلات الصور',im]),modelTester(im,'image',ir),ir]));
var mt=h('input',{type:'checkbox'});mt.checked=S.maintenance==='1';
var mm=h('input');mm.value=S.maintenance_msg||'';ins.maintenance_msg=mm;
L.appendChild(h('div',{class:'card sec'},[h('h3',{text:'وضع الصيانة'}),h('label',{class:'fl'},[mt,'تفعيل الصيانة (يوقف الشات ورسم الصور)']),h('label',{class:'fl'},['رسالة الصيانة',mm])]));
var ik=h('input',{type:'password',autocomplete:'off',class:'ltr',placeholder:'مفتاح imgBB الجديد'});
R.appendChild(h('div',{class:'card sec'},[h('h3',{text:'مفتاح imgBB (للكتابة فقط)'}),ik,h('div',{class:'row end',},[h('button',{class:'btn sm',type:'button',text:'حفظ المفتاح',onclick:function(){if(ik.value.trim().length<10)return toast('مفتاح غير صالح',1);call('aImgKey',{key:ik.value}).then(function(rr){rr.error?toast(msg(rr),1):(toast('تم حفظ المفتاح'),ik.value='')})}})])]));
var au=h('input',{autocomplete:'off',class:'ltr',placeholder:'اسم مستخدم جديد (4 أحرف على الأقل)'}),ap=h('input',{type:'password',autocomplete:'new-password',class:'ltr',placeholder:'كلمة سر جديدة (8 أحرف على الأقل)'});
L.appendChild(h('div',{class:'card sec'},[h('h3',{text:'بيانات دخول اللوحة'}),au,h('div',{class:'row'},[]),ap,h('div',{class:'row end'},[h('button',{class:'btn sm',type:'button',text:'تغيير',onclick:function(){if(au.value.trim().length<4||ap.value.length<8)return toast('البيانات قصيرة',1);call('aCreds',{user:au.value,pass:ap.value}).then(function(rr){if(rr.error)return toast(msg(rr),1);toast('تم التغيير، سجل الدخول من جديد');setTimeout(out,1200)})}})])]));
box.appendChild(cols);
box.appendChild(h('div',{class:'savebar'},[h('button',{class:'btn primary',type:'button',text:'حفظ كل الإعدادات',onclick:function(){
var v={maintenance:mt.checked?'1':''};
Object.keys(ins).forEach(function(k){var x=ins[k].value.trim();v[k]=(k==='persona'&&x===(D.persona||'').trim())?'':x});
call('aSettings',{values:v}).then(function(rr){rr.error?toast(msg(rr),1):toast('تم الحفظ وهيتطبق خلال ثواني')})}})]))})};
function show(n){
cur=n;main=$('main');main.textContent='';$('ttl').textContent=TITLES[n];
document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('on',b.dataset.v===n)});
V[n]()}
function boot(){
$('login').hidden=true;$('app').hidden=false;
var nav=$('nav');nav.textContent='';
Object.keys(TITLES).forEach(function(k){var b=h('button',{type:'button',onclick:function(){show(k)}},[ico(k),h('span',{text:TITLES[k]})]);b.dataset.v=k;nav.appendChild(b)});
show(cur)}
$('th').onclick=function(){var t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',t);localStorage.setItem(THK,t)};
$('lo').onclick=out;
$('lf').onsubmit=function(e){
e.preventDefault();$('le').textContent='';$('lb').disabled=true;
fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:$('lu').value,pass:$('lp').value})}).then(function(r){return r.json().catch(function(){return{}})}).then(function(j){
$('lb').disabled=false;
if(!j.token)return $('le').textContent=j.error||'تعذر الدخول';
sessionStorage.setItem(TK,j.token);$('lp').value='';$('lu').value='';boot()}).catch(function(){$('lb').disabled=false;$('le').textContent='تعذر الاتصال بالخادم'})};
if(sessionStorage.getItem(TK))boot();else{$('app').hidden=true;$('login').hidden=false}
})();
