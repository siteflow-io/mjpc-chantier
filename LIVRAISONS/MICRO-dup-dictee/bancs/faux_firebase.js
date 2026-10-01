/* FAUX FIREBASE (banc ELEVE-1 ④) — remplace le SDK Firebase 8 de la page : la base est un arbre EN MÉMOIRE, semé par le banc
   (données ZZTEST). Rien ne sort du navigateur ; chaque écriture est comptée dans window.__ECRITURES. */
(function(){
  var T=window.__HUB_INITIAL?JSON.parse(JSON.stringify(window.__HUB_INITIAL)):{};var W=window.__ECRITURES=[];var L=[];var n0=0;
  function parts(p){return String(p==null?'':p).split('/').filter(Boolean);}
  function clone(v){return v==null?null:JSON.parse(JSON.stringify(v));}
  function get(p){var n=T,ps=parts(p);for(var i=0;i<ps.length;i++){if(n==null||typeof n!=='object')return null;n=n[ps[i]];}return n===undefined?null:clone(n);}
  function put(p,v){var ps=parts(p);if(!ps.length){T=(v&&typeof v==='object')?clone(v):{};return;}var n=T;for(var i=0;i<ps.length-1;i++){if(n[ps[i]]==null||typeof n[ps[i]]!=='object')n[ps[i]]={};n=n[ps[i]];}
    if(v===null||v===undefined)delete n[ps[ps.length-1]];else n[ps[ps.length-1]]=clone(v);}
  function snap(p){var v=get(p);return {val:function(){return clone(v);},exists:function(){return v!==null;},key:parts(p).pop()||null,
    forEach:function(cb){if(v&&typeof v==='object')Object.keys(v).some(function(k){return cb(snap(parts(p).concat([k]).join('/')))===true;});},
    child:function(c){return snap(parts(p).concat(parts(c)).join('/'));},hasChild:function(c){return snap(parts(p).concat(parts(c)).join('/')).exists();},
    numChildren:function(){return v&&typeof v==='object'?Object.keys(v).length:0;}};}
  function notifier(p){var b=parts(p).join('/');L.slice().forEach(function(l){var a=l.p;if(a===b||b.indexOf(a+'/')===0||a.indexOf(b+'/')===0||a===''||b==='')setTimeout(function(){if(L.indexOf(l)>=0)l.cb(snap(l.p));},0);});}
  function ref(p){p=parts(p).join('/');var r={key:parts(p).pop()||null,
    child:function(c){return ref(p+'/'+c);},
    on:function(ev,cb){if(ev!=='value')return cb;var l={p:p,cb:cb};L.push(l);setTimeout(function(){if(L.indexOf(l)>=0)cb(snap(p));},0);return cb;},
    off:function(ev,cb){L=L.filter(function(l){return !(l.p===p&&(!cb||l.cb===cb));});},
    once:function(ev,cb){var s=snap(p);if(typeof cb==='function')setTimeout(function(){cb(s);},0);return Promise.resolve(s);},
    set:function(v,cb){W.push(['set',p]);put(p,v);notifier(p);if(typeof cb==='function')setTimeout(function(){cb(null);},0);return Promise.resolve();},
    update:function(o,cb){W.push(['update',p,Object.keys(o||{})]);Object.keys(o||{}).forEach(function(k){put(p+'/'+k,o[k]);});notifier(p);if(typeof cb==='function')setTimeout(function(){cb(null);},0);return Promise.resolve();},
    remove:function(cb){W.push(['remove',p]);put(p,null);notifier(p);if(typeof cb==='function')setTimeout(function(){cb(null);},0);return Promise.resolve();},
    push:function(v){var k='-zz'+Date.now().toString(36)+(n0++);var c=ref(p+'/'+k);if(v!==undefined)c.set(v);return c;},
    transaction:function(fn,cb){var cur=get(p),nv=fn(cur);if(nv!==undefined){W.push(['transaction',p]);put(p,nv);notifier(p);}var s=snap(p);if(typeof cb==='function')setTimeout(function(){cb(null,nv!==undefined,s);},0);return Promise.resolve({committed:nv!==undefined,snapshot:s});},
    orderByChild:function(){return r;},orderByKey:function(){return r;},equalTo:function(){return r;},limitToLast:function(){return r;},limitToFirst:function(){return r;},startAt:function(){return r;},endAt:function(){return r;}
  };return r;}
  var db={ref:ref,goOffline:function(){},goOnline:function(){}};
  window.firebase={apps:[],initializeApp:function(){window.firebase.apps.push({});return {database:function(){return db;}};},database:function(){return db;},app:function(){return {database:function(){return db;}};}};
  window.firebase.database.ServerValue={TIMESTAMP:{'.sv':'timestamp'}};
  window.__LIRE=function(p){return get(p);};
})();
