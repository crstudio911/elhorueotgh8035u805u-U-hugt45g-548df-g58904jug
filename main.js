(function(){
var API='https://coolai-api.uuuuouuuuuuouuu.workers.dev',TK='coolai_admin_t',THK='coolai_admin_theme';
var $=function(i){return document.getElementById(i)},main,cur='stats';
document.documentElement.setAttribute('data-theme',localStorage.getItem(THK)||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
var TITLES={stats:'نظرة عامة',users:'المستخدمين',invoices:'الفواتير',offers:'أكواد الخصم',data:'كل البيانات',settings:'الإعدادات وشخصية Cool'};
function h(t,a,k){var e=document.createElement(t);a=a||{};Object.keys(a).forEach(function(n){var v=a[n];if(v===null||v===undefined)return;if(n==='class')e.className=v;else if(n==='text')e.textContent=v;else if(n.slice(0,2)==='on')e[n]=v;else e.setAttribute(n,v)});(k||[]).forEach(function(c){if(c!==null&&c!==undefined)e.appendChild(typeof c==='object'?c:document.createTextNode(String(c)))});return e}
function btn(t,f,c){return h('button',{class:'btn sm '+(c||''),type:'button',text:t,onclick:f})}
function toast(m,bad){var t=h('div',{class:'toast'+(bad?' bad':''),text:m});$('toasts').appendChild(t);setTimeout(function(){t.remove()},3200)}
function out(){sessionStorage.removeItem(TK);$('app').hidden=true;$('login').hidden=false}
function call(act,body){
return fetch(API+'/api/admin/'+act,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+(sessionStorage.getItem(TK)||'')},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){j.status=r.status;if(r.status===401){out();j.error='انتهت الجلسة'}return j})}).catch(function(){return{error:'تعذر الاتصال بالخادم',status:0}})}
function ask(title,fields,ok){
return new Promise(function(res){
var d=$('dlg'),f=$('dlgf'),ins={};f.textContent='';f.appendChild(h('h3',{text:title}));
fields.forEach(function(x){var i=x.area?h('textarea',{rows:x.rows||4}):h('input',{type:x.type||'text'});if(x.value!==undefined)i.value=x.value;if(x.ph)i.placeholder=x.ph;ins[x.k]=i;f.appendChild(h('label',{class:'fl'},[x.label,i]))});
f.appendChild(h('div',{class:'row end'},[h('button',{class:'btn',type:'button',text:'إلغاء',onclick:function(){d.close();res(null)}}),h('button',{class:'btn primary',type:'submit',text:ok||'حفظ'})]));
f.onsubmit=function(e){e.preventDefault();var o={};Object.keys(ins).forEach(function(k){o[k]=ins[k].value});d.close();res(o)};
d.oncancel=function(){res(null)};d.showModal()})}
function save(name,text,type){var a=h('a',{href:URL.createObjectURL(new Blob([text],{type:type||'text/plain'})),download:name});document.body.appendChild(a);a.click();a.remove()}
function csv(hd,rows){var q=function(x){x=String(x);if(/^[=+\-@]/.test(x))x="'"+x;return /[",\n\r]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x};return '\ufeff'+[hd].concat(rows).map(function(r){return r.map(q).join(',')}).join('\r\n')}
function tbl(heads,rows){var t=h('table',{},[h('thead',{},[h('tr',{},heads.map(function(x){return h('th',{text:x})}))]),h('tbody',{},rows.map(function(r){return h('tr',{},r.map(function(c){return h('td',{},[c])}))}))]);return h('div',{class:'tw'},[t])}
function pager(total,size,pg,fn){var n=Math.max(1,Math.ceil(total/size));return h('div',{class:'row pager'},[h('button',{class:'btn sm',text:'السابق',disabled:pg<=1?'':undefined,onclick:function(){fn(pg-1)}}),h('span',{text:pg+' / '+n+' ('+total+')'}),h('button',{class:'btn sm',text:'التالي',disabled:pg>=n?'':undefined,onclick:function(){fn(pg+1)}})])}
function skel(box){box.textContent='';box.appendChild(h('div',{class:'skel'}))}
function debounce(inp,fn){inp.oninput=function(){clearTimeout(inp.t);inp.t=setTimeout(fn,350)}}
function badge(s){return h('span',{class:'badge '+s,text:({pending:'قيد المراجعة',paid:'مدفوعة',rejected:'مرفوضة',ok:'نشط',bad:'موقوف'})[s]||s})}
var V={};
V.stats=function(){
var box=h('div');main.appendChild(box);skel(box);
call('aStats').then(function(r){
box.textContent='';if(r.error)return box.appendChild(h('p',{class:'err',text:r.error}));
var items=[['المستخدمين',r.users],['إجمالي الكوينز',r.coins],['إجمالي الكريديت',r.credits],['موقوفين',r.banned],['فواتير قيد المراجعة',r.pending],['فواتير مدفوعة',r.paid],['الإيراد (جنيه)',r.revenue],['المنشورات',r.posts],['رسائل المجتمع',r.messages],['جلسات نشطة',r.sessions]];
box.appendChild(h('div',{class:'grid'},items.map(function(x){return h('div',{class:'card stat'},[h('b',{text:String(x[1])}),h('span',{text:x[0]})])})));
box.appendChild(h('div',{class:'row'},[h('button',{class:'btn primary',text:'تحميل نسخة احتياطية كاملة',onclick:backup})]))})};
function backup(){call('aBackup').then(function(r){if(r.error)return toast(r.error,1);save('coolai-backup-'+Date.now()+'.json',JSON.stringify(r,null,1),'application/json');toast('تم تحميل النسخة')})}
V.users=function(){
var q='',pg=1,sr=h('input',{placeholder:'بحث بالاسم أو البريد أو الكود'}),box=h('div');
main.appendChild(h('div',{class:'bar'},[sr,h('button',{class:'btn',text:'تحديث',onclick:function(){load()}})]));main.appendChild(box);
debounce(sr,function(){q=sr.value;pg=1;load()});
function adj(uid,k){ask(k==='coins'?'تعديل الكوينز':'تعديل الكريديت',[{k:'n',label:'الرقم (موجب للإضافة وسالب للخصم)',type:'number',value:'0'}]).then(function(o){if(!o)return;var n=Math.floor(+o.n);if(!n)return;var b={userId:uid};b[k]=n;call('aUserAdj',b).then(function(r){if(r.error)toast(r.error,1);else{toast('تم');load()}})})}
function ban(uid,v){call('aBan',{userId:uid,banned:v}).then(function(r){if(r.error)toast(r.error,1);else{toast('تم');load()}})}
function del(uid){if(!confirm('حذف المستخدم نهائياً؟'))return;call('aDelUser',{userId:uid}).then(function(r){if(r.error)toast(r.error,1);else{toast('تم الحذف');load()}})}
function load(){skel(box);call('aRead',{sheet:'users',q:q,page:pg,size:30,rev:true}).then(function(r){
box.textContent='';if(r.error)return box.appendChild(h('p',{class:'err',text:r.error}));
var ix=function(n){return r.header.indexOf(n)};
var rows=r.rows.map(function(x){var g=function(n){return ix(n)<0?'':x.v[ix(n)]},uid=g('userId'),bn=g('banned')==='1';
return[g('name'),g('email'),g('coins'),g('credits'),g('inviteCode'),g('createdAt'),badge(bn?'bad':'ok'),h('div',{class:'acts'},[btn('كوينز',function(){adj(uid,'coins')}),btn('كريديت',function(){adj(uid,'credits')}),btn(bn?'فك الحظر':'حظر',function(){ban(uid,!bn)}),btn('حذف',function(){del(uid)},'danger')])]});
box.appendChild(tbl(['الاسم','البريد','كوينز','كريديت','كود الدعوة','الانضمام','الحالة','إجراءات'],rows));
box.appendChild(pager(r.total,30,pg,function(p){pg=p;load()}))})}
load()};
V.invoices=function(){
var st='',pg=1,sel=h('select',{},[['','الكل'],['pending','قيد المراجعة'],['paid','مدفوعة'],['rejected','مرفوضة']].map(function(o){return h('option',{value:o[0],text:o[1]})})),box=h('div');
main.appendChild(h('div',{class:'bar'},[sel,h('button',{class:'btn',text:'تحديث',onclick:function(){load()}})]));main.appendChild(box);
sel.onchange=function(){st=sel.value;pg=1;load()};
function setS(id,s){call('aInv',{invoiceId:id,status:s}).then(function(r){if(r.error)return toast(r.error,1);toast(s==='paid'?(r.credited?'تمت إضافة الكوينز للعميل':'الكوينز مضافة قبل كده'):'تم');load()})}
function load(){skel(box);call('aRead',{sheet:'invoices',q:st,page:pg,size:30,rev:true}).then(function(r){
box.textContent='';if(r.error)return box.appendChild(h('p',{class:'err',text:r.error}));
var ix=function(n){return r.header.indexOf(n)};
var rows=r.rows.map(function(x){var g=function(n){return ix(n)<0?'':x.v[ix(n)]},id=g('invoiceId'),s=String(g('status')).trim().toLowerCase();
return[id,g('name'),g('email'),g('coins'),g('code')||'-',g('discount'),g('total'),badge(s),g('createdAt'),g('credited')?'تمت':'-',h('div',{class:'acts'},[btn('تأكيد الدفع',function(){setS(id,'paid')}),btn('رفض',function(){setS(id,'rejected')},'danger'),btn('قيد المراجعة',function(){setS(id,'pending')})])]});
box.appendChild(tbl(['رقم الفاتورة','الاسم','البريد','كوينز','الكود','الخصم','الإجمالي','الحالة','التاريخ','الإضافة','إجراءات'],rows));
box.appendChild(pager(r.total,30,pg,function(p){pg=p;load()}))})}
load()};
V.offers=function(){
var box=h('div');
main.appendChild(h('div',{class:'bar'},[h('button',{class:'btn primary',text:'كود جديد',onclick:add})]));main.appendChild(box);
function add(){ask('كود خصم جديد',[{k:'c',label:'الكود'},{k:'o',label:'قيمة الخصم بالجنيه',type:'number',value:'10'}]).then(function(o){if(!o||!o.c.trim())return;call('aAdd',{sheet:'offcode',values:[o.c.trim().toUpperCase(),Math.max(0,+o.o||0)]}).then(function(r){if(r.error)toast(r.error,1);else{toast('تمت الإضافة');load()}})})}
function load(){skel(box);call('aRead',{sheet:'offcode',all:true}).then(function(r){
box.textContent='';if(r.error)return box.appendChild(h('p',{class:'err',text:r.error}));
var rows=r.rows.map(function(x){return[x.v[0],x.v[1]+' جنيه',h('div',{class:'acts'},[btn('تعديل',function(){ask('تعديل الخصم',[{k:'o',label:'القيمة بالجنيه',type:'number',value:x.v[1]}]).then(function(o){if(!o)return;call('aSet',{sheet:'offcode',row:x.r,col:2,value:String(Math.max(0,+o.o||0))}).then(function(){toast('تم');load()})})}),btn('حذف',function(){if(!confirm('حذف الكود؟'))return;call('aDel',{sheet:'offcode',row:x.r}).then(function(){toast('تم');load()})},'danger')])]});
box.appendChild(tbl(['الكود','الخصم','إجراءات'],rows))})}
load()};
V.data=function(){
var sh='users',pg=1,q='',hd=[],box=h('div'),sel=h('select'),sr=h('input',{placeholder:'بحث داخل الورقة'});
main.appendChild(h('div',{class:'bar'},[sel,sr,h('button',{class:'btn',text:'إضافة صف',onclick:addRow}),h('button',{class:'btn',text:'CSV',onclick:function(){exp('csv')}}),h('button',{class:'btn',text:'JSON',onclick:function(){exp('json')}}),h('button',{class:'btn danger',text:'مسح الورقة',onclick:clr})]));
main.appendChild(box);
sel.onchange=function(){sh=sel.value;pg=1;load()};debounce(sr,function(){q=sr.value;pg=1;load()});
call('aSheets').then(function(r){if(r.error)return toast(r.error,1);(r.sheets||[]).forEach(function(s){sel.appendChild(h('option',{value:s.name,text:s.name+' ('+s.rows+')'}))});sh=sel.value||'users';load()});
function exp(k){call('aRead',{sheet:sh,all:true}).then(function(r){if(r.error)return toast(r.error,1);if(k==='csv')save(sh+'.csv',csv(r.header,r.rows.map(function(x){return x.v})),'text/csv');else save(sh+'.json',JSON.stringify(r.rows.map(function(x){var o={};r.header.forEach(function(c,i){o[c]=x.v[i]});return o}),null,1),'application/json')})}
function addRow(){if(!hd.length)return;ask('إضافة صف في '+sh,hd.map(function(c){return{k:c,label:c}})).then(function(o){if(!o)return;call('aAdd',{sheet:sh,values:hd.map(function(c){return o[c]})}).then(function(r){if(r.error)toast(r.error,1);else{toast('تمت الإضافة');load()}})})}
function clr(){ask('مسح كل صفوف '+sh,[{k:'n',label:'اكتب اسم الورقة للتأكيد: '+sh}],'مسح').then(function(o){if(!o||o.n!==sh)return;call('aClear',{sheet:sh}).then(function(r){if(r.error)toast(r.error,1);else{toast('تم المسح');load()}})})}
function load(){skel(box);call('aRead',{sheet:sh,q:q,page:pg,size:50}).then(function(r){
box.textContent='';if(r.error)return box.appendChild(h('p',{class:'err',text:r.error}));
hd=r.header;
var rows=r.rows.map(function(x){var cells=x.v.map(function(v,c){var td=h('span',{text:v});td.dataset.r=x.r;td.dataset.c=c;return td});return cells.concat([btn('حذف',function(){if(!confirm('حذف الصف؟'))return;call('aDel',{sheet:sh,row:x.r}).then(function(rr){if(rr.error)toast(rr.error,1);else{toast('تم الحذف');load()}})},'danger')])});
var t=tbl(hd.concat(['']),rows);
t.querySelectorAll('td').forEach(function(td){var sp=td.firstChild;if(!sp||!sp.dataset||sp.dataset.r===undefined)return;td.className='ed';td.ondblclick=function(){if(td.querySelector('input'))return;var old=sp.textContent,i=h('input',{class:'ce',value:old}),done=false;td.textContent='';td.appendChild(i);i.focus();i.select();
function fin(s){if(done)return;done=true;var v=i.value;td.textContent='';td.appendChild(sp);if(s&&v!==old){call('aSet',{sheet:sh,row:+sp.dataset.r,col:+sp.dataset.c+1,value:v}).then(function(rr){if(rr.error)toast(rr.error,1);else{sp.textContent=v;toast('تم الحفظ')}})}}
i.onkeydown=function(e){if(e.key==='Enter')fin(true);if(e.key==='Escape')fin(false)};i.onblur=function(){fin(true)}}});
box.appendChild(t);box.appendChild(pager(r.total,50,pg,function(p){pg=p;load()}));
box.appendChild(h('p',{class:'fl',text:'اضغط مرتين على أي خانة لتعديلها، Enter للحفظ.'}))})}};
var FIELDS=[['coin_price','سعر الكوين بالجنيه','number'],['min_coins','أقل عدد كوينز للشراء','number'],['max_coins','أقصى عدد كوينز للشراء','number'],['image_cost','تكلفة رسم صورة (كريديت، 1 إلى 10)','number'],['free_credits','الكريديت المجاني (للحساب الجديد وكل تجديد)','number'],['free_hours','ساعات تجديد الكريديت المجاني','number'],['invite_new','مكافأة الصديق الجديد بكود الدعوة','number'],['invite_owner','مكافأة صاحب كود الدعوة','number']];
V.settings=function(){
var box=h('div');main.appendChild(box);skel(box);
call('cfg').then(function(r){
box.textContent='';if(r.error)return box.appendChild(h('p',{class:'err',text:r.error}));
var S=r.settings||{},D=r.def||{},ins={};
var pa=h('textarea',{rows:14});pa.value=S.persona||D.persona||'';ins.persona=pa;
box.appendChild(h('div',{class:'card sec'},[h('h3',{text:'شخصية Cool'}),h('label',{class:'fl'},['تعليمات النظام (بتحدد الشخصية والأسلوب والهوية)',pa]),h('button',{class:'btn',type:'button',text:'استرجاع الافتراضي',onclick:function(){pa.value=D.persona||''}})]));
var g=h('div',{class:'two'});
FIELDS.forEach(function(f){var i=h('input',{type:f[2]});i.value=S[f[0]]!==undefined&&S[f[0]]!==''?S[f[0]]:(D[f[0]]===undefined?'':D[f[0]]);ins[f[0]]=i;g.appendChild(h('label',{class:'fl'},[f[1],i]))});
var mt=h('input',{type:'checkbox'});mt.checked=S.maintenance==='1';
var mm=h('input');mm.value=S.maintenance_msg||'';ins.maintenance_msg=mm;
var cm=h('textarea',{rows:3}),im=h('textarea',{rows:3});cm.value=S.chat_models||D.chat_models||'';im.value=S.image_models||D.image_models||'';ins.chat_models=cm;ins.image_models=im;
box.appendChild(h('div',{class:'card sec'},[h('h3',{text:'الأسعار والمكافآت'}),g]));
box.appendChild(h('div',{class:'card sec'},[h('h3',{text:'الموديلات (مفصولة بفاصلة، بالترتيب)'}),h('label',{class:'fl'},['موديلات الشات',cm]),h('label',{class:'fl'},['موديلات الصور',im])]));
box.appendChild(h('div',{class:'card sec'},[h('h3',{text:'وضع الصيانة'}),h('label',{class:'fl'},[mt,'تفعيل الصيانة (يوقف الشات ورسم الصور)']),h('label',{class:'fl'},['رسالة الصيانة',mm])]));
box.appendChild(h('div',{class:'row'},[h('button',{class:'btn primary',type:'button',text:'حفظ كل الإعدادات',onclick:function(){
var v={maintenance:mt.checked?'1':''};
Object.keys(ins).forEach(function(k){var x=ins[k].value.trim();v[k]=(k==='persona'&&x===(D.persona||'').trim())?'':x});
call('aSettings',{values:v}).then(function(rr){rr.error?toast(rr.error,1):toast('تم الحفظ وهيتطبق خلال ثواني')})}})]));
var ik=h('input',{type:'password',autocomplete:'off',placeholder:'مفتاح imgBB الجديد'});
box.appendChild(h('div',{class:'card sec'},[h('h3',{text:'مفتاح imgBB (للكتابة فقط)'}),ik,h('div',{class:'row end'},[h('button',{class:'btn',type:'button',text:'حفظ المفتاح',onclick:function(){if(ik.value.trim().length<10)return toast('مفتاح غير صالح',1);call('aImgKey',{key:ik.value}).then(function(rr){rr.error?toast(rr.error,1):(toast('تم حفظ المفتاح'),ik.value='')})}})])]));
var au=h('input',{autocomplete:'off',placeholder:'اسم مستخدم جديد (4 أحرف على الأقل)'}),ap=h('input',{type:'password',autocomplete:'new-password',placeholder:'كلمة سر جديدة (8 أحرف على الأقل)'});
box.appendChild(h('div',{class:'card sec'},[h('h3',{text:'بيانات دخول اللوحة'}),au,ap,h('div',{class:'row end'},[h('button',{class:'btn',type:'button',text:'تغيير',onclick:function(){if(au.value.trim().length<4||ap.value.length<8)return toast('البيانات قصيرة',1);call('aCreds',{user:au.value,pass:ap.value}).then(function(rr){if(rr.error)return toast(rr.error,1);toast('تم التغيير، سجل الدخول من جديد');setTimeout(out,1200)})}})])]))})};
function show(n){
cur=n;main=$('main');main.textContent='';$('ttl').textContent=TITLES[n];
document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('on',b.dataset.v===n)});
V[n]()}
function boot(){
$('login').hidden=true;$('app').hidden=false;
var nav=$('nav');nav.textContent='';
Object.keys(TITLES).forEach(function(k){var b=h('button',{text:TITLES[k],type:'button',onclick:function(){show(k)}});b.dataset.v=k;nav.appendChild(b)});
show(cur)}
$('th').onclick=function(){var t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',t);localStorage.setItem(THK,t)};
$('lo').onclick=out;
$('lf').onsubmit=function(e){
e.preventDefault();$('le').textContent='';$('lb').disabled=true;
fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:$('lu').value,pass:$('lp').value})}).then(function(r){return r.json().catch(function(){return{}})}).then(function(j){
$('lb').disabled=false;
if(!j.token)return $('le').textContent=j.error||'تعذر الدخول';
sessionStorage.setItem(TK,j.token);$('lp').value='';boot()}).catch(function(){$('lb').disabled=false;$('le').textContent='تعذر الاتصال بالخادم'})};
if(sessionStorage.getItem(TK))boot();
})();
