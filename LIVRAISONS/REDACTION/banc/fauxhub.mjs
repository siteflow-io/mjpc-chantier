// Le faux hub du banc RU : jamais le vrai. fetch (REST) et EventSource (l'abonnement) interceptés dans la page ;
// les écritures sont relevées dans window.__ECR ; d'autres pages du même contexte sont prévenues (l'abonnement).
import fs from 'node:fs'; import path from 'node:path';
const ICI = path.dirname(new URL(import.meta.url).pathname);
export function hubDeDepart({ avecDugain = true } = {}) {
  const H = path.join(ICI, '..', '..', '..', 'AUDITS', 'INTEGRATION-DEROULE', 'hub');
  const classes = JSON.parse(fs.readFileSync(path.join(H, 'classes.json'), 'utf8'));
  // une classe à clé simplifiée (13 · 51) : la forme des vraies classes de Paul — élèves du faux hub (De Gaulle), pour le banc seulement
  classes['3_franklin_aretha'] = { nom: '3 FRANKLIN Aretha', niveau: '3e', archivee: false, eleves: classes['3E Charles de Gaulle'].eleves.slice(0, 12) };
  const taxonomie = JSON.parse(fs.readFileSync(path.join(H, 'taxonomie.json'), 'utf8'));
  const hub = { classes, taxonomie, redactions: {} };
  if (avecDugain) hub.redactions.dugain = { config: JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'dugain.json'), 'utf8')) };
  return hub;
}
export const installer = (etat) => {
  // le faux hub vit dans le stockage de la page (même contexte = même hub) : il survit aux navigations, et deux pages le partagent
  let m = null; try { m = localStorage.getItem('__FAUXHUB'); } catch (e) {}
  window.__HUB = m ? JSON.parse(m) : etat; window.__ECR = []; try { window.__ECR = JSON.parse(localStorage.getItem('__FAUXECR') || '[]'); } catch (e) {}
  const garder = () => { try { localStorage.setItem('__FAUXHUB', JSON.stringify(window.__HUB)); localStorage.setItem('__FAUXECR', JSON.stringify(window.__ECR)); } catch (e) {} };
  garder();
  const seg = c => c.split('/').filter(Boolean).map(decodeURIComponent);
  const lire = s => { let n = window.__HUB; for (const k of s) { if (n == null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const poser = (s, v) => { if (!s.length) { window.__HUB = v; return; } let n = window.__HUB; for (const k of s.slice(0, -1)) { if (n[k] == null || typeof n[k] !== 'object') n[k] = {}; n = n[k]; } if (v === null) delete n[s[s.length - 1]]; else n[s[s.length - 1]] = v; };
  window.__FLUX = [];
  const prevenir = (s, v) => { window.__FLUX.forEach(f => { const k = Math.min(f.seg.length, s.length); if (f.seg.slice(0, k).join('/') !== s.slice(0, k).join('/')) return; const rel = s.length >= f.seg.length ? '/' + s.slice(f.seg.length).join('/') : '/'; const data = s.length >= f.seg.length ? v : lire(f.seg); f.emettre('put', { path: rel, data }); }); };
  window.__HUBPOSER = (c, v) => { const s = seg(c); poser(s, JSON.parse(JSON.stringify(v))); garder(); prevenir(s, v); };   // une écriture « d'ailleurs »
  window.fetch = function (u, o) {
    const s2 = String(u); if (s2.indexOf('firebasedatabase.app') < 0) return Promise.reject(new Error('réseau coupé (banc)'));
    const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''); const m = ((o && o.method) || 'GET').toUpperCase(); const s = seg(c);
    if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(s)), { status: 200 }));
    let bd = null; try { bd = o && o.body ? JSON.parse(o.body) : null; } catch (e) {}
    window.__ECR.push(m + ' ' + s.join('/'));
    if (m === 'PUT') poser(s, bd); else if (m === 'DELETE') poser(s, null); else if (m === 'PATCH') Object.keys(bd || {}).forEach(k => poser(s.concat(seg(k)), bd[k]));
    garder(); prevenir(s, m === 'DELETE' ? null : bd);
    return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 }));
  };
  window.EventSource = function (u) { const self = this; const L = {}; this.addEventListener = (t, f) => { (L[t] = L[t] || []).push(f); }; this.close = () => { window.__FLUX = window.__FLUX.filter(x => x !== rec); };
    const c = String(u).split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''); const rec = { seg: seg(c), emettre: (t, d) => (L[t] || []).forEach(f => f({ data: JSON.stringify(d) })) }; window.__FLUX.push(rec);
    setTimeout(() => rec.emettre('put', { path: '/', data: lire(rec.seg) }), 30); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); };
};
export const sessionProf = () => { const s = JSON.stringify({ is_prof: true, display: 'Professeur', ts: Date.now() }); try { sessionStorage.setItem('mjpc_eleve', s); localStorage.setItem('mjpc_eleve', s); } catch (e) {} };
