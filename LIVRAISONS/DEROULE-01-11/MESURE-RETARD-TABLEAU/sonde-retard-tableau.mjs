// LA SONDE DU RETARD DU TABLEAU (MANDATS/DEROULE-01-11/APRES-8860/O-MESURE-RETARD-DU-TABLEAU.md, ⑯, C16 645) — mesure seulement, aucune ligne du site ne change.
// Le harnais (faux hub rangé comme le vrai, qui refuse les clés interdites et pousse son flux ; pilote ; fenêtre du tableau ; tableau distant `?vue=tableau`) :
// FRAPPE-TABLEAU/sonde-frappe-tableau.mjs (branche banc/nuit), repris tel quel jusqu'au faux hub et aux ouvertures. Une vraie heure (mode classe), montres du navigateur.
// Chaque geste, MJPC_N fois (défaut 10) : l'heure du geste = l'heure du dernier événement réel du pilote (keydown, pointerdown/up, click : `e.timeStamp`) ;
// l'effet = la première modification du DOM (MutationObserver) de la fenêtre du tableau et du tableau distant après le geste, hors du « bruit » vu dans la seconde et
// demie d'avant (mêmes éléments, même genre de modification : le chrono qui décompte, l'anneau) et hors des textes d'heure (« 09:12 », « 04:59 »). L'image suit à la
// trame suivante (≤ 17 ms). Pour « écrire un mot » : l'heure où le mot entier est dans la page. usage : node sonde-retard-tableau.mjs <assemble/index.html> [sorties]
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-frappe-tableau.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; const dire = s => { s = String(s); R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + (typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 1400) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const MODES = String(process.env.MJPC_MODES || 'classe,test').split(',').map(x => x.trim()).filter(Boolean);
const FLUX = process.env.MJPC_FLUX !== '0'; const HORLOGE = process.env.MJPC_HORLOGE || 'date'; const FIGEE = HORLOGE === 'figee'; const TRACE = !!process.env.MJPC_TRACE;
/* LA MONTRE DES APPAREILS. « date » (défaut) : seule la date est décalée au 14/09, 09:00 (la même pour tous, elle avance) ; les minuteries, les images
   (`requestAnimationFrame`) et `performance` restent ceux du navigateur. « avance » et « figee » : l'horloge simulée de Playwright (`page.clock`), qui REMPLACE
   aussi setTimeout, setInterval, requestAnimationFrame et performance (playwright-core, clockSource : `requestAnimationFrame: (callback) => clock.addTimer(...)`,
   `performance: fakePerformance(...)`) et exécute toutes les minuteries échues d'une page à la suite, dans une seule tâche (`_runTo` : `await this._callFirstTimer`
   en boucle) — un navigateur ne fait pas cela. */
const fauxDate = off => { const RD = Date; function FD(...a) { if (!(this instanceof FD)) return new RD(RD.now() + off).toString(); return a.length ? new RD(...a) : new RD(RD.now() + off); }
  FD.prototype = RD.prototype; FD.now = () => RD.now() + off; FD.parse = RD.parse; FD.UTC = RD.UTC; try { Object.defineProperty(FD, 'name', { value: 'Date' }); } catch (e) {} window.Date = FD; };
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');

const sk0 = st => { const S0 = st.site['3e'].chapitres[0].seances; return Object.keys(S0).filter(k => S0[k] && S0[k].type !== 'sommaire').sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); };
const store = () => storeOuverture(RACINE, { champs: true });

/* ── le faux hub partagé (Node), rangé comme le vrai et qui refuse les clés interdites (FRAPPE-ZOOM/sonde-zoom.mjs, tel quel) ── */
let HUBN = null; let ECR = []; const REFUSES = []; const LECT = [];
const CLE_KO = /[.#$\[\]\/\u0000-\u001F\u007F]/;
const cleFautive = (v, ch) => { if (v && typeof v === 'object') for (const k of Object.keys(v)) { if (k === '' || CLE_KO.test(k)) return ch + '/' + k; const r = cleFautive(v[k], ch + '/' + k); if (r) return r; } return null; };
const refusDe = (m, c, bd) => { const segs = c.split('/').filter(Boolean); const s = segs.find(x => /[.#$\[\]\u0000-\u001F\u007F]/.test(x)); if (s) return 'adresse « ' + c + ' »';
  if (m === 'PATCH' && bd && typeof bd === 'object') { for (const k of Object.keys(bd)) { const q = k.split('/'); if (q.some(x => x === '' && q.length > 1) || q.some(x => /[.#$\[\]\u0000-\u001F\u007F]/.test(x))) return 'clé de tête « ' + k + ' »'; const r = cleFautive(bd[k], c + '/' + k); if (r) return r; } return null; }
  return cleFautive(bd, c); };
const ranger = v => { if (v === null || v === undefined) return undefined; if (typeof v === 'number' && !isFinite(v)) return undefined; if (typeof v !== 'object') return v;
  const o = {}; (Array.isArray(v) ? v.map((x, i) => [String(i), x]) : Object.entries(v)).forEach(([k, x]) => { const r = ranger(x); if (r !== undefined) o[k] = r; }); return Object.keys(o).length ? o : undefined; };
const relire = v => { if (v === null || v === undefined || typeof v !== 'object') return v; const K = Object.keys(v).sort(); const o = {}; K.forEach(k => { o[k] = relire(v[k]); });
  if (K.length && K.every(k => /^(0|[1-9]\d*)$/.test(k))) { const max = Math.max(...K.map(Number)); if (K.length * 2 > max + 1) { const a = new Array(max + 1).fill(null); K.forEach(k => { a[+k] = o[k]; }); return a; } } return o; };
const lireH0 = c => { const q = c.split('/').filter(Boolean); let n = HUBN; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
const lireH = c => { const n = lireH0(c); return n == null ? null : relire(n); };
const posH = (c, v) => { const q = c.split('/').filter(Boolean); v = ranger(v); if (v === undefined) v = null; let n = HUBN; const pile = [n]; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) { if (v === null) return; n[q[k]] = {}; } n = n[q[k]]; pile.push(n); }
  if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v;
  if (v === null) for (let k = q.length - 2; k >= 0; k--) { if (pile[k + 1] && typeof pile[k + 1] === 'object' && !Object.keys(pile[k + 1]).length) delete pile[k][q[k]]; else break; } };
const resoudreSv = v => { if (v && typeof v === 'object' && !Array.isArray(v)) { const K = Object.keys(v); if (K.length === 1 && K[0] === '.sv' && v['.sv'] === 'timestamp') return Date.now(); const o = {}; K.forEach(k => { o[k] = resoudreSv(v[k]); }); return o; } if (Array.isArray(v)) return v.map(resoudreSv); return v; };
const prefN = t => { const s2 = String(t || '').replace(/\u00a0/g, ' '); let best = 0; PHRASES.forEach(ph => { for (let j = ph.length; j > best; j--) if (s2.indexOf(JSON.stringify(ph.slice(0, j)).slice(1, -1)) >= 0) { best = j; break; } }); return best; };
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') { const v = JSON.stringify(lireH(c)); if (TRACE && /\/scene$/.test(c)) LECT.push({ qui, c, t: Date.now(), l: prefN(v) }); return v; } if (TRACE && /\/scene$/.test(c)) LECT.push({ qui: qui + '-ecrit', c, t: Date.now(), l: prefN(corps) }); let bd = null; try { bd = resoudreSv(JSON.parse(corps || 'null')); } catch (e) {}
  const ko = refusDe(m, c, bd); if (ko) { REFUSES.push({ qui, m, c, ko, t: Date.now() }); ECR.push({ qui, m, c, t: Date.now(), refus: true }); return '§400§' + JSON.stringify({ error: 'Invalid data; couldn\'t parse key beginning at ' + ko + '. Keys must not contain \'/\', \'.\', \'#\', \'$\', \'[\', or \']\'' }); }
  ECR.push({ qui, m, c, t: Date.now(), n: (corps || '').length }); if (FLUX) setTimeout(() => pousserFlux(c), 0);
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => /^§400§/.test(t) ? new Response(t.slice(5), { status: 400 }) : new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const imageDe = u => { const m = /mjpc-medias\/(.*\/)?([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (!m) return null; if (MEDIAS) { const f = path.join(MEDIAS, m[2]); if (fs.existsSync(f)) return f; } return IMG_OUV[m[2]] || IMG_DEFAUT; };
const typeDe = f => /\.webp$/i.test(f) ? 'image/webp' : /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
/* LE FLUX DU FAUX HUB (FRAPPE-ZOOM/sonde-zoom.mjs, tel quel) : chaque abonné reçoit la valeur de son chemin dès qu'une écriture touche ce chemin */
const ABOS = []; const T0REEL = Date.now();
const pousserFlux = c => { const cc = c.replace(/\/+$/, ''); ABOS.forEach(a => { if (!(cc === a.ch || cc.startsWith(a.ch + '/') || a.ch.startsWith(cc + '/'))) return; if (a.pg.isClosed()) return;
  a.pg.evaluate(([id, d]) => { try { window.__esPousser && window.__esPousser(id, d); } catch (e) {} }, [a.id, JSON.stringify(lireH(a.ch))]).catch(() => {}); }); };
const fauxFlux = () => { const ES = {}; let n = 0;
  window.__esPousser = (id, d) => { const e = ES[id]; if (!e || e.ferme) return; const ev = { data: JSON.stringify({ path: '/', data: JSON.parse(d) }) }; (e.l.put || []).forEach(f => { try { f(ev); } catch (x) {} }); };
  window.EventSource = function (u) { const id = 'es' + (++n); const self = this; this.l = {}; this.ferme = false; ES[id] = this; const s2 = String(u);
    this.addEventListener = (t, f) => { (self.l[t] = self.l[t] || []).push(f); }; this.close = () => { self.ferme = true; }; this.onerror = null;
    if (s2.indexOf('firebasedatabase.app') < 0) { setTimeout(() => { if (self.onerror) self.onerror({}); }, 0); return; }
    const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''));
    window.__hubEcoute(id, c).then(d => setTimeout(() => window.__esPousser(id, d), 0)); }; };
const ouvrir = async ({ qui = 'pilote', fichier = FICHIER, W = 1536, H = 864, q = '?n=3e', test = false, prof = true, h = '09:00', jour = '2026-09-14' }) => {
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  if (FLUX) { await ctx.exposeBinding('__hubEcoute', (src, id, ch) => { ABOS.push({ pg: src.page, id, ch: ch.replace(/\/+$/, '') }); return JSON.stringify(lireH(ch)); }); await ctx.addInitScript(fauxFlux); }
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); const f = imageDe(u); if (f) return r.fulfill({ path: f, contentType: typeDe(f) }); return r.abort(); });
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  const t09 = new Date(jour + 'T' + h + ':00+02:00').getTime();
  if (HORLOGE === 'date') await ctx.addInitScript(fauxDate, t09 - T0REEL);
  const pg = await ctx.newPage(); if (FIGEE) await pg.clock.setFixedTime(new Date(t09)); else if (HORLOGE === 'avance') await pg.clock.install({ time: new Date(t09 + (Date.now() - T0REEL)) });
  await pg.goto('file://' + fichier + q, { waitUntil: 'load' }); await p(1800);
  if (prof) await profPrep(pg, test);
  return { ctx, pg, errs, boites, qui }; };
const profPrep = async (pg, test) => { await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }); await p(300);
  await pg.click('#tprof-btn').catch(() => {}); await p(600); if (test) await pg.evaluate(() => { window.M8_TEST = true; }); };
const capt = async (pg, nom) => { if (CAPT && pg) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const lancerClasse = async (o, jour = '2026-09-14') => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'edtOuvrir()'))) await pg.evaluate(() => edtOuvrir()); await p(1500);
  const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return false; x.click(); return true; }, jour); await p(800);
  const l = ok && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape'); await p(400); return !!l; };
const ouvrirTableau = async (o, W = 1280, H = 720) => { if (!(await o.pg.isVisible('#bvideoproj').catch(() => false))) return null; const [fen] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), o.pg.click('#bvideoproj')]); await p(1500); if (fen) await fen.setViewportSize({ width: W, height: H }); await o.pg.bringToFront(); return fen; };
const ici_ = pg => pg.evaluate(() => { const c = document.getElementById('compte'); let eid = null; try { eid = seance().ecrans[S.di].eid; } catch (e) {} return { eid, di: typeof S !== 'undefined' ? S.di : null, compte: c ? c.textContent.trim() : '' }; });
const eidsDe = pg => pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid })); } catch (e) { return []; } });
const garde = async pg => { if (await pg.evaluate(() => !!(document.getElementById('garde') && document.getElementById('garde').classList.contains('on')))) { await pg.click('#garde-devant').catch(() => {}); await p(900); } };
const allerA = async (pg, eid) => { const L = await eidsDe(pg); const x = L.find(e => e.eid === eid); if (!x) return false; const v = await pg.$('#volet .vig[data-i="' + x.i + '"]'); if (!v) return false;
  await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); await garde(pg);
  for (let k = 0; k < 20 && (await ici_(pg)).eid !== eid; k++) await p(200); return (await ici_(pg)).eid === eid; };
const toutDevoiler = async (pg, eid) => { await pg.click('#numero').catch(() => {}); for (let k = 0; k < 14; k++) { const s2 = await ici_(pg); if (s2.eid !== eid || /^(\d+) \/ \1 dévoilés|rien à dévoiler|vidéo/.test(s2.compte)) break; await pg.keyboard.press('ArrowRight'); await p(300); } await p(900); };
const sansErreur = (k, errs, quoi) => verif(k, !errs.length, quoi + ' : aucune erreur JS, aucune boîte système', errs.join(' ; '));
const temoins = pg => pg.evaluate(() => { const s = document.getElementById('dr-session'); const b = document.getElementById('mjpc-echecs-bandeau');
  return { session: s ? s.textContent.trim() : null, sessionKo: !!(s && s.classList.contains('dr-session-ko')), bandeau: !!(b && b.style.display !== 'none' && b.classList.contains('mjpc-bandeau-echec')) }; });
const corriger = async (pg, sel, ajout) => { const x = await pg.$('#mur ' + sel); if (!x) return false; await x.click(); await p(300); await pg.keyboard.press('Control+End'); await pg.keyboard.type(ajout, { delay: 20 }); await p(300); await pg.keyboard.press('Escape'); await p(400); return true; };

/* ═══ K · la frappe des réponses des élèves, au pilote, à la fenêtre du tableau, au tableau distant ═══ */

/* ═══ O · le retard du tableau après chaque geste du pilote ═══ */
const QB = 'emt9v3yqo6pvd5'; const PHRASES = ['Une réponse de la classe.'];
const N = +(process.env.MJPC_N || 10), ATT = +(process.env.MJPC_ATT || 2200), CALME = +(process.env.MJPC_CALME || 900);
const SORTIE = path.join(OUT, 'sonde-retard-tableau' + (process.env.MJPC_NOM ? '-' + process.env.MJPC_NOM : '') + '.txt');
dire('O · sonde du retard du tableau · faux hub rangé comme le vrai, avec son flux · vraie heure · ' + N + ' fois chaque geste · attente ' + ATT + ' ms · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER));
const observer = pg => pg.evaluate(() => { window.__M = []; window.__W = null; window.__Wc = null;
  const desc = n => { const e = n && (n.nodeType === 1 ? n : n.parentElement); if (!e) return '?'; return e.tagName + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''); };
  new MutationObserver(L => { const t = performance.timeOrigin + performance.now(); const ks = [];
    L.forEach(r => { const e = r.target.nodeType === 1 ? r.target : r.target.parentElement; if (e && /^ses-tab/.test(e.id || '')) return; const tx = ((e && e.textContent) || '').trim(); if (r.type !== 'attributes' && /^\d{1,2}[:h]\d{2}(:\d{2})?$/.test(tx)) return; ks.push(desc(r.target) + '|' + r.type + '|' + (r.attributeName || '')); });
    if (ks.length) window.__M.push([t, Array.from(new Set(ks))]);
    if (window.__Wc && !window.__W && (document.body.textContent || '').indexOf(window.__Wc) >= 0) window.__W = t; }).observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true }); });
const decalDe = async pg => { if (!pg) return 0; let m = null; for (let k = 0; k < 5; k++) { const a = Date.now(); const tp = await pg.evaluate(() => performance.timeOrigin + performance.now()); const b = Date.now(); if (!m || b - a < m.rt) m = { rt: b - a, d: tp - (a + b) / 2 }; } return m.d; };
const RES = {}; const ORDRE = [];
const stat = a => { const v = a.filter(x => x != null).sort((x, y) => x - y); return v.length ? { med: v[Math.floor((v.length - 1) / 2)], max: v[v.length - 1], n: v.length, nv: a.length - v.length } : { med: null, max: null, n: 0, nv: a.length }; };
let o, fen, T, DEC = { f: 0, t: 0 };
/* un geste mesuré : geste() joue le geste au pilote ; mot : le texte attendu au tableau (sinon la première modification hors bruit) */
const mesurer = async (nom, geste, mot) => { await p(CALME); if (!RES[nom]) { RES[nom] = { fen: [], dist: [], cles: { fen: {}, dist: {} } }; ORDRE.push(nom); }
  for (const x of [fen, T.pg]) await x.evaluate(m => { window.__W = null; window.__Wc = m || null; }, mot || null);
  const nEv = await o.pg.evaluate(() => window.__EV.length); let ok = true; try { ok = (await geste()) !== false; } catch (e) { ok = false; dire('      ' + nom + ' : le geste a échoué — ' + String(e.message).slice(0, 160)); }
  const evs = await o.pg.evaluate(n => window.__EV.slice(n), nEv); if (!ok || !evs.length) { RES[nom].fen.push(null); RES[nom].dist.push(null); return; }
  const t0 = evs[evs.length - 1][0], tDeb = evs[0][0]; await p(ATT);
  for (const [cle, x, d] of [['fen', fen, DEC.f], ['dist', T.pg, DEC.t]]) { const r = await x.evaluate(() => ({ M: window.__M.slice(-400), W: window.__W }));
    let lat = null, k0 = '';
    if (mot) lat = r.W != null && r.W - d >= t0 - 5 ? Math.round(r.W - d - t0) : null;
    else { const bruit = new Set(); r.M.forEach(([t, ks]) => { if (t - d >= tDeb - CALME && t - d < tDeb) ks.forEach(k => bruit.add(k)); });
      const e = r.M.find(([t, ks]) => t - d > t0 && ks.some(k => !bruit.has(k))); if (e) { lat = Math.round(e[0] - d - t0); k0 = e[1].filter(k => !bruit.has(k)).slice(0, 2).join(' + '); } }
    RES[nom][cle].push(lat); if (k0) RES[nom].cles[cle][k0] = (RES[nom].cles[cle][k0] || 0) + 1; } };
const ligne = nom => { const r = RES[nom], f = stat(r.fen), d = stat(r.dist); const cl = c => Object.entries(r.cles[c]).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k, v]) => k + ' ×' + v).join(' ; ');
  return nom.padEnd(34) + ' │ fenêtre : médiane ' + f.med + ' ms, plus long ' + f.max + ' ms (' + f.n + ' vus' + (f.nv ? ', ' + f.nv + ' NON VUS' : '') + ') │ distant : médiane ' + d.med + ' ms, plus long ' + d.max + ' ms (' + d.n + ' vus' + (d.nv ? ', ' + d.nv + ' NON VUS' : '') + ')'
    + '\n      détail fenêtre ' + JSON.stringify(r.fen) + ' · distant ' + JSON.stringify(r.dist) + '\n      ce qui change en premier — fenêtre : ' + (cl('fen') || '—') + ' │ distant : ' + (cl('dist') || '—'); };
const ecrireSortie = () => fs.writeFileSync(SORTIE, R.join('\n') + '\n' + ORDRE.map(ligne).join('\n') + '\n');

HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0;
T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1200);
o = await ouvrir({}); const lance = await lancerClasse(o); fen = await ouvrirTableau(o); await p(1500);
dire('      l’heure lancée : ' + lance + ' · fenêtre du tableau ouverte : ' + !!fen);
if (!lance || !fen) { ecrireSortie(); await nav.close(); process.exit(1); }
await o.pg.evaluate(() => { window.__EV = []; ['pointerdown', 'pointerup', 'keydown', 'click'].forEach(ty => document.addEventListener(ty, e => { if (e.isTrusted) window.__EV.push([performance.timeOrigin + e.timeStamp, ty]); }, true)); });
await observer(fen); await observer(T.pg);
{ const dp = await decalDe(o.pg); DEC = { f: (await decalDe(fen)) - dp, t: (await decalDe(T.pg)) - dp }; dire('      écart des montres au pilote : fenêtre ' + Math.round(DEC.f) + ' ms · distant ' + Math.round(DEC.t) + ' ms (recalé)'); }
const pg = () => o.pg; const etat = () => ici_(o.pg);
const GESTES = (process.env.MJPC_GESTES || 'diapo,devoiler,gel,ecrire,surligner,chrono,reponse').split(',');
/* 1 · diapo suivante et précédente (le clic sur la vignette du volet ; PageDown/PageUp, mesurés d'abord, ne changent pas la diapo une fois l'heure lancée : 0 sur 6 ; la garde « Y aller » si elle paraît — l'heure du geste est alors celle du clic « Y aller ») */
if (GESTES.includes('diapo')) for (let i = 0; i < N; i++) {
  await mesurer('diapo suivante (vignette 2 du volet)', async () => { const v = await pg().$('#volet .vig[data-i="1"]'); if (!v) return false; await v.click(); await p(400); await garde(pg()); });
  await mesurer('diapo précédente (vignette 1 du volet)', async () => { const v = await pg().$('#volet .vig[data-i="0"]'); if (!v) return false; await v.click(); await p(400); await garde(pg()); }); ecrireSortie(); }
dire('      ici : ' + JSON.stringify(await etat()));
/* 2 · ▶ dévoiler (#bdev), puis le retrait (#bprec, non mesuré) */
if (GESTES.includes('devoiler')) for (let i = 0; i < N; i++) { await mesurer('▶ dévoiler (#bdev)', async () => { await pg().click('#bdev'); }); await pg().click('#bprec'); await p(300); await garde(pg()); ecrireSortie(); }
dire('      ici : ' + JSON.stringify(await etat()));
/* 4 · écrire un mot au tableau (la ligne à écrire de la diapo) : de la dernière lettre au mot entier au tableau ; Échap ensuite (non mesuré) */
if (GESTES.includes('ecrire') || GESTES.includes('surligner')) { await allerA(pg(), QB); await toutDevoiler(pg(), QB); await p(800); dire('      ici : ' + JSON.stringify(await etat())); }
if (GESTES.includes('ecrire')) for (let i = 0; i < N; i++) { const mot = 'Mot' + 'abcdefghij'[i] + 'tableau';
  await mesurer('écrire un mot (dernière lettre)', async () => { const e = await pg().$('#mur .p8-ecrire'); if (!e) return false; await e.click(); await p(200); await pg().keyboard.press('Control+End'); await pg().keyboard.type(' ' + mot, { delay: 40 }); }, mot);
  if (process.env.MJPC_DBG) dire('      DBG écrire : ' + JSON.stringify(await pg().evaluate(m => ({ ae: document.activeElement && (document.activeElement.className + '/' + document.activeElement.tagName), mur: (document.getElementById('mur').textContent || '').indexOf(m) }), mot)) + ' fen ' + await fen.evaluate(m => document.body.textContent.indexOf(m), mot));
  await pg().keyboard.press('Escape'); await p(300); ecrireSortie(); }
/* 5 · surligner : le dernier mot écrit, sélectionné au clavier, puis « ab » (#bsurl) et le jaune */
if (GESTES.includes('surligner')) for (let i = 0; i < N; i++) {
  await mesurer('surligner (ab → jaune)', async () => { const e = await pg().$('#mur .p8-ecrire'); if (!e) return false; await e.click(); await p(200); await pg().keyboard.press('Control+End'); await pg().keyboard.press('Control+Shift+ArrowLeft'); await p(150);
    await pg().click('#bsurl'); await p(150); await pg().click('#pal-surl .p8-p[data-c="jaune"]'); });
  await pg().keyboard.press('Escape'); await p(300); ecrireSortie(); }
dire('      surlignés au pilote : ' + await pg().evaluate(() => document.querySelectorAll('#mur mark, #mur [style*="background"]').length));
/* 6 · le chrono : « au tableau », ▶ lancer, glisser, redimensionner ; ■ arrêter (non mesuré) */
if (GESTES.includes('chrono')) for (let i = 0; i < N; i++) {
  if (!(await pg().isVisible('#dr-minut-p').catch(() => false))) { await pg().click('#bchrono').catch(() => {}); await p(300); }
  await mesurer('chrono « au tableau »', async () => { await pg().click('#dr-minut-tab'); });
  await mesurer('chrono ▶ lancer', async () => { await pg().click('#dr-minut-go'); });
  const bb = async () => { const b = await pg().$('#dr-minut-pp'); return b ? b.boundingBox() : null; };
  await mesurer('chrono glisser', async () => { const b = await bb(); if (!b) return false; const x = b.x + b.width / 2, y = b.y + b.height / 2; await pg().mouse.move(x, y); await pg().mouse.down(); for (let k = 1; k <= 6; k++) { await pg().mouse.move(x - 10 * k * (i % 2 ? -1 : 1), y + 6 * k * (i % 2 ? -1 : 1)); await p(40); } await pg().mouse.up(); });
  await mesurer('chrono redimensionner', async () => { const h = await pg().$('#dr-minut-pp [data-c="se"]') || await pg().$('#dr-minut-pp [data-c]'); if (!h) return false; const b = await h.boundingBox(); if (!b) return false; const x = b.x + b.width / 2, y = b.y + b.height / 2; await pg().mouse.move(x, y); await pg().mouse.down(); for (let k = 1; k <= 6; k++) { await pg().mouse.move(x + 8 * k * (i % 2 ? -1 : 1), y + 1); await p(40); } await pg().mouse.up(); });
  await pg().click('#dr-minut-stop').catch(() => {}); await p(600); ecrireSortie(); }
/* 7 · (le gel vient en dernier : un gel resté posé figerait le tableau pour la suite) */
/* 7bis · une réponse validée (Entrée), à la question-bilan, avec les initiales d'un élève de la classe (jamais un nom) */
if (GESTES.includes('reponse')) { await allerA(pg(), QB); await toutDevoiler(pg(), QB); await p(1200);
  const INIS = await pg().evaluate(() => ELEVES.filter(n => INI[n] && !/\d/.test(INI[n]) && dr_caseSeul(INI[n], true) === n).map(n => INI[n])).catch(() => []);
  for (let i = 0; i < N; i++) { const ini = await pg().$('#mur .rep.libre .ini[contenteditable]'); if (!ini || !INIS.length) { dire('      réponse : pas de ligne libre ou pas d’initiales'); break; }
    await ini.click(); await p(200); await pg().keyboard.type(INIS[i % INIS.length], { delay: 60 }); await p(300);
    if (await pg().evaluate(() => !!(document.activeElement && document.activeElement.classList.contains('ini')))) { await pg().keyboard.press('Enter'); await p(250); }
    const dit = await pg().$('#mur .rep.libre .dit[contenteditable]'); if (!dit) break; await dit.click(); await p(200); await pg().keyboard.type('Réponse ' + (i + 1) + ' de la classe.', { delay: 40 }); await p(300);
    await mesurer('une réponse validée (Entrée)', async () => { await pg().keyboard.press('Enter'); }); ecrireSortie(); } }
/* 3 · geler et dégeler (#bgel) */
if (GESTES.includes('gel')) for (let i = 0; i < N; i++) { await mesurer('geler (#bgel)', async () => { await pg().click('#bgel'); }); await pg().click('#bdev'); await p(600);
  await mesurer('dégeler (#bgel), après un ▶ gelé', async () => { await pg().click('#bgel'); }); await pg().click('#bprec'); await p(300); await garde(pg()); ecrireSortie(); }
dire(''); dire('— les écritures au hub pendant la sonde : ' + ECR.filter(x => x.qui === 'pilote').length + ' · refusées : ' + REFUSES.length + ' · erreurs JS : ' + (o.errs.concat(T.errs).length) + ' ' + o.errs.concat(T.errs).slice(0, 3).join(' ; '));
dire(''); ORDRE.forEach(n => dire(ligne(n))); ecrireSortie();
await nav.close(); process.exit(0);
