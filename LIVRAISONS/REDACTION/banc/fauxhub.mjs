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
  // deux mémoires, la plus récente gagne (un compteur v) : window.name (synchrone, suit l'onglet d'une page à la suivante — le stockage
  // de Chrome se recopie entre processus avec un temps de retard, une navigation immédiate pouvait relire l'ancien) et localStorage (partagé entre onglets)
  let a = null, b = null; try { const n = JSON.parse(window.name || 'null'); if (n && n.__faux) a = n; } catch (e) {} try { b = JSON.parse(localStorage.getItem('__FAUX') || 'null'); } catch (e) {}
  const m = [a, b].filter(Boolean).sort((x, y) => y.v - x.v)[0];
  window.__HUB = m ? m.hub : etat; window.__ECR = m ? m.ecr : []; window.__FAUXV = m ? m.v : 0;
  const garder = () => { window.__FAUXV++; const p = JSON.stringify({ __faux: 1, v: window.__FAUXV, hub: window.__HUB, ecr: window.__ECR }); try { window.name = p; } catch (e) {} try { localStorage.setItem('__FAUX', p); } catch (e) {} try { if (typeof window.__fauxGarder === 'function') window.__fauxGarder(p).catch(() => {}); } catch (e) {} };   // et une copie côté banc (une page neuve la reçoit avant de démarrer)
  garder();
  const seg = c => c.split('/').filter(Boolean).map(decodeURIComponent);
  const lire = s => { let n = window.__HUB; for (const k of s) { if (n == null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const poser = (s, v) => { if (!s.length) { window.__HUB = v; return; } let n = window.__HUB; for (const k of s.slice(0, -1)) { if (n[k] == null || typeof n[k] !== 'object') n[k] = {}; n = n[k]; } if (v === null) delete n[s[s.length - 1]]; else n[s[s.length - 1]] = v; };
  window.__FLUX = [];
  // le sujet par son nom court (13 · 58 : au hub, il est rangé sous son id interne « sujet_… »)
  window.__SUJ = n => { const r = window.__HUB.redactions || {}; const k = Object.keys(r).find(x => r[x] && r[x].config && (r[x].config.nomCourt === n || r[x].config.idInterne === n)) || n; return r[k]; };
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
  // une autre page du même navigateur a écrit : l'abonnement de celle-ci le reçoit (comme le flux du vrai hub)
  window.addEventListener('storage', e => { if (e.key !== '__FAUX' || !e.newValue) return; const n = JSON.parse(e.newValue); if (n.v <= window.__FAUXV) return; window.__HUB = n.hub; window.__ECR = n.ecr; window.__FAUXV = n.v; try { window.name = e.newValue; } catch (x) {} window.__FLUX.forEach(f => f.emettre('put', { path: '/', data: lire(f.seg) })); });
};
export const sessionProf = () => { const s = JSON.stringify({ is_prof: true, display: 'Professeur', ts: Date.now() }); try { sessionStorage.setItem('mjpc_eleve', s); localStorage.setItem('mjpc_eleve', s); } catch (e) {} };
