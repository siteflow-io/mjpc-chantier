/* Stub minimal du SDK Firebase v8 pour le banc (evaluation-qcm charge la 8.10.1).
   Il ne simule que ce dont le chargement a besoin : initializeApp + database().ref(). */
(function(g){
  function Ref(p){this._p=p;}
  Ref.prototype.child=function(k){return new Ref(this._p+'/'+k);};
  Ref.prototype.once=function(ev,cb){var s={val:function(){return null;},exists:function(){return false;}};
    if(cb)cb(s);return Promise.resolve(s);};
  Ref.prototype.on=function(ev,cb){if(cb)cb({val:function(){return null;},forEach:function(){}});return cb;};
  Ref.prototype.off=function(){};
  Ref.prototype.set=function(v,cb){if(cb)cb(null);return Promise.resolve();};
  Ref.prototype.update=function(v,cb){if(cb)cb(null);return Promise.resolve();};
  Ref.prototype.push=function(v,cb){if(cb)cb(null);return new Ref(this._p+'/_k');};
  Ref.prototype.remove=function(cb){if(cb)cb(null);return Promise.resolve();};
  Ref.prototype.orderByChild=function(){return this;};
  Ref.prototype.equalTo=function(){return this;};
  Ref.prototype.limitToLast=function(){return this;};
  g.firebase={
    initializeApp:function(){return {};},
    apps:[],
    database:function(){return {ref:function(p){return new Ref(p||'');},goOnline:function(){},goOffline:function(){}};}
  };
})(window);
