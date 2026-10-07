/* Simulacre Firebase 8.x pour le banc — base en mémoire, AUCUN accès réseau.
   Fidélité recherchée :
   - stockage en objets (les tableaux deviennent des objets à clés entières, sans null) ;
   - relecture selon la règle du SDK 8.10.1 : clés entières et max < 2*nb -> tableau à trous ;
   - un événement 'value' n'est émis que si la valeur à l'écoute a CHANGÉ ;
   - les écritures locales émettent leurs événements de façon synchrone (comme le SDK). */
(function(){
  // Le vrai hub garde ses données d'un chargement à l'autre : le faux aussi (sessionStorage de l'onglet)
  var _garde=null; try{ _garde=sessionStorage.getItem('__FAKE_DB_GARDE__'); }catch(e){}
  var DB = _garde ? JSON.parse(_garde) : (normalize(window.__FAKE_DB__ || {}) || {});
  var LOG = window.__FB_LOG__ = [];
  var listeners = [];   // {path, cb, last}

  function isObj(v){ return v !== null && typeof v === 'object'; }
  function normalize(v){
    if (v === undefined || v === null) return null;
    if (Array.isArray(v)) {
      var o = {}; var n = 0;
      for (var i = 0; i < v.length; i++) { var c = normalize(v[i]); if (c !== null) { o[String(i)] = c; n++; } }
      return n ? o : null;
    }
    if (isObj(v)) {
      var r = {}; var m = 0;
      Object.keys(v).forEach(function(k){ var c = normalize(v[k]); if (c !== null) { r[k] = c; m++; } });
      return m ? r : null;
    }
    if (typeof v === 'function') return null;
    if (typeof v === 'number' && !isFinite(v)) return null;
    return v;
  }
  function toVal(v){               /* règle ChildrenNode.val() du SDK 8.10.1 */
    if (!isObj(v)) return v;
    var r = {}, i = 0, o = 0, allInt = true;
    Object.keys(v).forEach(function(k){
      r[k] = toVal(v[k]); i++;
      if (allInt && /^(0|[1-9]\d*)$/.test(k)) o = Math.max(o, Number(k)); else allInt = false;
    });
    if (allInt && o < 2 * i) { var t = []; for (var e in r) t[e] = r[e]; return t; }
    return r;
  }
  function parts(p){ p = String(p || '').replace(/^\/+|\/+$/g, ''); return p ? p.split('/') : []; }
  function getRaw(p){
    var ps = parts(p), n = DB;
    for (var i = 0; i < ps.length; i++) { if (!isObj(n)) return null; n = n[ps[i]]; if (n === undefined) return null; }
    return n === undefined ? null : n;
  }
  function setRaw(p, v){
    var ps = parts(p); v = normalize(v);
    if (!ps.length) { DB = v || {}; return; }
    var chain = [DB], n = DB;
    for (var i = 0; i < ps.length - 1; i++) {
      if (!isObj(n[ps[i]])) { if (v === null) return; n[ps[i]] = {}; }
      n = n[ps[i]]; chain.push(n);
    }
    var last = ps[ps.length - 1];
    if (v === null) delete n[last]; else n[last] = v;
    for (var j = chain.length - 1; j > 0; j--) {          /* élague les parents vides */
      if (Object.keys(chain[j]).length === 0) delete chain[j - 1][ps[j - 1]]; else break;
    }
  }
  function snap(path){
    var raw = getRaw(path); var ps = parts(path);
    return {
      key: ps.length ? ps[ps.length - 1] : null,
      val: function(){ var c = raw === null ? null : JSON.parse(JSON.stringify(raw)); return toVal(c); },
      exists: function(){ return raw !== null; }
    };
  }
  function sig(path){ return JSON.stringify(getRaw(path)); }
  function garder(){ try{ sessionStorage.setItem('__FAKE_DB_GARDE__', JSON.stringify(DB)); }catch(e){} }
  function emit(){ garder();
    listeners.slice().forEach(function(l){
      var s = sig(l.path);
      if (s !== l.last) { l.last = s; try { l.cb(snap(l.path)); } catch (e) { console.error('[fakefb] écouteur', l.path, e); } }
    });
  }
  function write(op, path, value){
    LOG.push({op: op, path: '/' + parts(path).join('/'), value: value === undefined ? null : JSON.parse(JSON.stringify(value === undefined ? null : value)), t: Date.now()});
    /* [banc à deux navigateurs — règle de Paul du 04/10] si le banc a branché un relais, chaque écriture part vers l'autre navigateur, comme Firebase */
    if (window.__RELAIS__ && !window.__DISTANT__) { try { window.__RELAIS__(op, '/' + parts(path).join('/'), JSON.stringify(value === undefined ? null : value)); } catch (e) {} }
  }
  function Ref(path){ this._p = parts(path).join('/'); var ps = parts(path); this.key = ps.length ? ps[ps.length - 1] : null; }
  Object.defineProperty(Ref.prototype, 'parent', { get: function(){ var ps = parts(this._p); return ps.length ? new Ref(ps.slice(0, -1).join('/')) : null; } });
  Ref.prototype.child = function(c){ return new Ref(this._p + '/' + c); };
  Ref.prototype.toString = function(){ return 'fake://' + this._p; };
  Ref.prototype.on = function(ev, cb, err){
    var l = {path: this._p, cb: cb, last: undefined};
    listeners.push(l);
    setTimeout(function(){ if (listeners.indexOf(l) >= 0 && l.last === undefined) { l.last = sig(l.path); try { cb(snap(l.path)); } catch (e) { console.error('[fakefb] on', e); } } }, 0);
    return cb;
  };
  Ref.prototype.off = function(ev, cb){
    var p = this._p;
    listeners = listeners.filter(function(l){ return !(l.path === p && (!cb || l.cb === cb)); });
  };
  Ref.prototype.once = function(ev, cb, err){
    var p = this._p;
    return new Promise(function(res){ setTimeout(function(){ var s = snap(p); if (cb) { try { cb(s); } catch (e) { console.error('[fakefb] once', e); } } res(s); }, 0); });
  };
  function done(cb){ if (typeof cb === 'function') setTimeout(function(){ cb(null); }, 0); return Promise.resolve(); }
  Ref.prototype.set = function(v, cb){ write('set', this._p, v); setRaw(this._p, v); emit(); return done(cb); };
  Ref.prototype.remove = function(cb){ write('remove', this._p, null); setRaw(this._p, null); emit(); return done(cb); };
  Ref.prototype.update = function(obj, cb){
    var base = this._p; write('update', base, obj);
    Object.keys(obj || {}).forEach(function(k){ setRaw(base + '/' + k, obj[k]); });
    emit(); return done(cb);
  };
  Ref.prototype.transaction = function(fn, onComplete){
    var cur = toVal(getRaw(this._p) === null ? null : JSON.parse(JSON.stringify(getRaw(this._p))));
    var res = fn(cur);
    var p = this._p;
    if (res === undefined) { var s0 = snap(p); if (onComplete) setTimeout(function(){ onComplete(null, false, s0); }, 0); return Promise.resolve({committed: false, snapshot: s0}); }
    write('transaction', p, res); setRaw(p, res); emit();
    var s1 = snap(p); if (onComplete) setTimeout(function(){ onComplete(null, true, s1); }, 0);
    return Promise.resolve({committed: true, snapshot: s1});
  };
  var database = { ref: function(p){ return new Ref(p || ''); } };
  /* l'écriture reçue de l'autre navigateur : appliquée ici, sans repartir */
  window.__appliquerDistant = function(op, path, json){ window.__DISTANT__ = true; try { var v = JSON.parse(json), r = database.ref(path);
      if (op === 'remove') r.remove(); else if (op === 'update') r.update(v); else r.set(v); } finally { window.__DISTANT__ = false; } };
  window.firebase = {
    apps: [],
    initializeApp: function(cfg){ window.firebase.apps.push(cfg); return {}; },
    database: function(){ return database; }
  };
  /* Les lectures REST du hub sont servies par la même base ; toute écriture REST est refusée et consignée. */
  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function(url, opts){
    var u = String(url && url.url || url);
    if (/firebasedatabase\.app/.test(u)) {
      var method = (opts && opts.method || 'GET').toUpperCase();
      var path = u.replace(/^https?:\/\/[^/]+/, '').replace(/\.json(\?.*)?$/, '');
      if (method !== 'GET' && window.__REST_LOCAL__) {   /* [L15.1b-1d] sur demande du banc : l'écriture REST est appliquée au faux hub (elle ne quitte jamais la page) */
        var corps = null; try { corps = opts && opts.body ? JSON.parse(opts.body) : null; } catch (e) {}
        var r = database.ref(decodeURIComponent(path).replace(/^\//, ''));
        var pr = method === 'PUT' ? r.set(corps) : method === 'PATCH' ? r.update(corps || {}) : method === 'DELETE' ? r.remove() : Promise.resolve();
        return Promise.resolve(pr).then(function(){ return new Response(JSON.stringify(corps), {status: 200, headers: {'Content-Type': 'application/json'}}); });
      }
      if (method !== 'GET') { LOG.push({op: 'REST-' + method, path: path, value: null, t: Date.now(), refused: true}); return Promise.resolve(new Response('{"error":"banc"}', {status: 403})); }
      var raw = getRaw(decodeURIComponent(path));
      return Promise.resolve(new Response(JSON.stringify(raw === null ? null : toVal(JSON.parse(JSON.stringify(raw)))), {status: 200, headers: {'Content-Type': 'application/json'}}));
    }
    return realFetch ? realFetch(url, opts) : Promise.reject(new Error('fetch indisponible'));
  };
  window.__FAKE_DB_GET__ = function(p){ var r = getRaw(p); return r === null ? null : toVal(JSON.parse(JSON.stringify(r))); };
  window.__FAKE_DB_SET__ = function(p, v){ setRaw(p, v); emit(); };
})();
