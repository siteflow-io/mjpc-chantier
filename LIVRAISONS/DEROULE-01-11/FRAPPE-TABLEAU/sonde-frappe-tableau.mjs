// LA SONDE DE LA FRAPPE AU TABLEAU (MANDATS/DEROULE-01-11/MANDAT-FRAPPE-TABLEAU.md §2.2, §3.1, §3.3, §4.1) — la partie K de CORRECTIFS/sonde-correctifs.mjs
// (le même geste : trois réponses d'élèves tapées au pilote, 80 ms entre deux touches), avec LE TABLEAU DISTANT COMPTÉ, sous le faux hub RANGÉ COMME LE VRAI, qui
// REFUSE (HTTP 400) les clés interdites et qui POUSSE SON FLUX (le flux REST de Firebase, `EventSource`, « put » à chaque écriture qui touche le chemin écouté :
// le harnais de FRAPPE-ZOOM/sonde-zoom.mjs, repris tel quel). Aucune écriture ni lecture du vrai hub. Aucun nom d'élève dans ce qui sort.
// usage : node sonde-frappe-tableau.mjs <assemble/index.html> [dossier-de-sortie]
//   MJPC_MODES (défaut classe,test) : une vraie heure, puis le mode test (l'image du tableau, `/site/tableau_test`)
//   MJPC_FLUX (défaut 1) : 1 = le faux hub pousse son flux, comme le vrai ; 0 = pas de flux (le tableau distant lit la scène toutes les 0,9 s : la partie K des correctifs)
//   MJPC_HORLOGE (défaut avance) : les montres avancent, la même pour tous ; « figee » = la montre arrêtée de la partie K des correctifs (`clock.setFixedTime`)
//   MJPC_TRACE=1 : pour chaque phrase, l'heure de chaque écriture de la scène au hub, de chaque scène reçue par le tableau distant, et de chaque lettre vue
//   MJPC_CAPT=<dossier> : les captures (jamais poussées) · MJPC_MEDIAS=<dossier> : les vraies images du chapitre (jamais poussées) · MJPC_NOM : le suffixe du fichier de sortie
// À chaque touche : l'heure de la touche (`keydown`) et l'image où sa lettre paraît (requestAnimationFrame : le texte des réponses), au pilote, à la fenêtre du
// tableau et au tableau distant, sur une même horloge (l'heure réelle de la machine). Les critères (§3.1) : au pilote, chaque lettre à l'image suivante (médiane
// au plus 50 ms, aucune au-delà de 100 ms) ; à la fenêtre du tableau ET au tableau distant, la règle de 7 (médiane au plus 100 ms, chaque lettre sous 350 ms) ;
// rien de perdu ; aucun envoi refusé ; aucune erreur JS. Et (§3.3) : ce que la frappe écrit au hub, compté par réponse et par chemin.
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
dire('C16 · sonde de la frappe au tableau · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400)' + (FLUX ? ', avec son flux (EventSource)' : ', SANS flux (le distant lit toutes les 0,9 s)') + ' · montres ' + (HORLOGE === 'date' ? 'du navigateur (seule la date décalée)' : FIGEE ? 'FIGÉES (horloge simulée)' : 'qui avancent (horloge simulée)') + ' · modes ' + MODES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

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
const QB = 'emt9v3yqo6pvd5';   /* « Question-bilan » (un bloc question) */
const PHRASES = ['Les cinq tableaux montrent une nature immense et un homme tout petit devant elle.', 'Le peintre veut nous faire ressentir la peur et l’émotion plutôt que suivre des règles.', 'On voit la tempête, la nuit, les montagnes : la nature est plus forte que l’homme.'];
/* à chaque image, les réponses écrites (leurs textes), gardées seulement quand elles changent (CORRECTIFS/sonde-correctifs.mjs, `sondeFrappe`, tel quel) ; et au tableau
   distant, avec MJPC_TRACE, l'heure de chaque scène reçue (`dr_tabSceneRecue`) */
const sondeFrappe = (pg, sel) => pg.evaluate(sel => { window.__F = []; window.__Fon = true; let der = ''; const lire = () => { const m = sel === 'body' ? document.body : document.querySelector(sel); if (!m) return []; return Array.from(m.querySelectorAll('.rep .dit')).map(x => (x.textContent || '').replace(/ /g, ' ')); };
  const f = () => { const L = lire(); const k = JSON.stringify(L); if (k !== der) { der = k; window.__F.push([performance.timeOrigin + performance.now(), L]); } if (window.__Fon) requestAnimationFrame(f); }; requestAnimationFrame(f);
  /* MJPC_TRACE : au tableau distant, chaque scène reçue (l'heure, son heure à elle, la dernière montrée, le texte qu'elle porte) ; au pilote, chaque scène écrite (l'heure, le texte qu'elle porte) */
  const pref = t => { const s = String(t || '').replace(/\u00a0/g, ' '); let best = 0; (window.__PH || []).forEach(ph => { for (let j = ph.length; j > best; j--) if (s.indexOf(JSON.stringify(ph.slice(0, j)).slice(1, -1)) >= 0) { best = j; break; } }); return best; };
  window.__SR = []; const g = window.dr_tabSceneRecue; if (typeof g === 'function' && !g.__sr) { const h = function (o) { try { window.__SR.push([performance.timeOrigin + performance.now(), o && o.ts, (window.DR_TAB || {}).ts, pref(JSON.stringify(o))]); } catch (e) {} return g.apply(this, arguments); }; h.__sr = true; try { window.dr_tabSceneRecue = h; } catch (e) {} }
  window.__SE = []; const fe = window.fetch; if (!fe.__se) { const fe2 = function (u, o) { try { if (/\/scene\.json/.test(String(u)) && o && o.method === 'PUT') window.__SE.push([performance.timeOrigin + performance.now(), pref(o.body)]); } catch (e) {} return fe.apply(this, arguments); }; fe2.__se = true; window.fetch = fe2; } }, sel);
const quoiDe = c => /\/scene$/.test(c) ? 'scene' : /\/vif$/.test(c) ? 'vif' : /\/etat$/.test(c) ? 'etat' : /\/journal/.test(c) ? 'journal' : /\/recit/.test(c) ? 'recit' : /\/ecrans$/.test(c) ? 'ecrans' : /\/pointeur$/.test(c) ? 'pointeur' : c.split('/').slice(-1)[0];
const jouerK = async (fichier, mode) => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; LECT.length = 0; ABOS.length = 0; const test = mode === 'test';
  const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1200);
  const o = await ouvrir({ fichier, test }); const lance = await lancerClasse(o); const fen = await ouvrirTableau(o); await allerA(o.pg, QB); await toutDevoiler(o.pg, QB); await p(1500);
  await corriger(o.pg, 'p.q[data-p$=".t"]', ' Pensez au Romantisme.'); await p(2500);
  await o.pg.evaluate(() => { window.__KD = []; document.addEventListener('keydown', e => { if (e.key.length === 1) window.__KD.push(performance.timeOrigin + e.timeStamp); }, true); });
  for (const x of [o.pg, fen, T.pg]) if (x) await x.evaluate(ph => { window.__PH = ph; }, PHRASES);
  await sondeFrappe(o.pg, '#mur'); if (fen) await sondeFrappe(fen, '#mur2'); await sondeFrappe(T.pg, 'body');
  /* L'HORLOGE DE CHAQUE PAGE : chaque contexte du navigateur a sa montre réglée par la sonde (`clock`) au moment où il s'ouvre — `performance` compris ; le tableau
     distant s'ouvre ~3 s avant le pilote : sa montre n'est pas celle du pilote. Chaque heure relevée dans une page est ramenée à l'horloge de la sonde (Node) par
     l'écart de cette page, mesuré avant et après la frappe ; MJPC_HORLOGE_BRUTE=1 : sans ce recalage (la partie K des correctifs comparait les montres brutes). */
  const decalDe = async pg => { if (!pg) return 0; let m = null; for (let k = 0; k < 5; k++) { const a = Date.now(); const tp = await pg.evaluate(() => performance.timeOrigin + performance.now()); const b = Date.now(); if (!m || b - a < m.rt) m = { rt: b - a, d: tp - (a + b) / 2 }; } return m.d; };
  const D0 = { p: await decalDe(o.pg), f: await decalDe(fen), t: await decalDe(T.pg) }; const DECAL = D0.p;
  const debuts = []; const ecr0 = ECR.length; let ok = true;
  /* C16 nuit, mandat I : comme Paul en classe (C16 717 : une réponse ne se valide qu'avec son élève), chaque réponse part de la ligne libre : les initiales d'un
     élève DE LA CLASSE pilotée (prises à la classe affichée, distinctes, sans chiffre ; jamais un nom), puis la réponse, puis Entrée. Avant : la frappe directe dans
     la réponse, sans élève — Entrée ne validait pas, les trois phrases tombaient dans la même ligne (une seule réponse entière, 163 lettres jamais vues).
     La mesure des lettres commence, comme avant, à la première lettre de la réponse ; toutes les vérifications restent. */
  const INIS = await o.pg.evaluate(() => ELEVES.filter(n => INI[n] && !/\d/.test(INI[n]) && dr_caseSeul(INI[n], true) === n).map(n => INI[n])).catch(() => []);
  for (let k = 0; k < PHRASES.length; k++) { const ini = await o.pg.$('#mur .rep.libre .ini[contenteditable]'); if (!ini || !INIS.length) { ok = false; break; }
    await ini.click(); await p(200); await o.pg.keyboard.type(INIS[k % INIS.length], { delay: 80 }); await p(300);
    if (await o.pg.evaluate(() => !!(document.activeElement && document.activeElement.classList.contains('ini')))) { await o.pg.keyboard.press('Enter'); await p(250); }   /* des initiales début d'autres : Entrée choisit l'élève, comme Paul */
    const dit = await o.pg.$('#mur .rep.libre .dit[contenteditable]'); if (!dit) { ok = false; break; }
    await dit.click(); await p(250); debuts.push(Date.now()); await o.pg.keyboard.type(PHRASES[k], { delay: 80 }); await p(400); await o.pg.keyboard.press('Enter'); await p(900); }
  await p(3500); for (const x of [o.pg, fen, T.pg]) if (x) await x.evaluate(() => { window.__Fon = false; });
  const D1 = { p: await decalDe(o.pg), f: await decalDe(fen), t: await decalDe(T.pg) }; const BRUT = !!process.env.MJPC_HORLOGE_BRUTE;
  const recale = (F, cle) => BRUT ? F : (F || []).map(x => [x[0] - (D0[cle] + D1[cle]) / 2 + (D0.p + D1.p) / 2, x[1]]);   /* ramenée à la montre du pilote, par l'horloge de la sonde */
  const kd = await o.pg.evaluate(() => window.__KD); const attendus = []; PHRASES.forEach(ph => { for (let j = 1; j <= ph.length; j++) attendus.push(ph.slice(0, j)); });
  const lat = F => kd.map((t, i) => { const pre = attendus[i]; if (pre == null) return null; let v = null; for (let q = 0; q < F.length; q++) { if (F[q][0] < t) continue; if (F[q][1].some(x => x === pre || (x.startsWith(pre) && PHRASES.some(ph => ph.startsWith(x))))) { v = F[q]; break; } } return v ? Math.round(v[0] - t) : null; });
  const Fd = recale(await T.pg.evaluate(() => window.__F), 't'); const out = { ok, lance, test, n: kd.length, pilote: lat(await o.pg.evaluate(() => window.__F)), fen: fen ? lat(recale(await fen.evaluate(() => window.__F), 'f')) : [], distant: lat(Fd) };
  out.montres = 'écart des montres à l’horloge de la sonde, avant / après la frappe : pilote ' + Math.round(D0.p) + ' / ' + Math.round(D1.p) + ' ms · fenêtre du tableau ' + Math.round(D0.f) + ' / ' + Math.round(D1.f) + ' ms · tableau distant ' + Math.round(D0.t) + ' / ' + Math.round(D1.t) + ' ms' + (BRUT ? ' (NON recalées : les montres brutes)' : ' (recalées)');
  out.textes = { pilote: await o.pg.evaluate(() => Array.from(document.querySelectorAll('#mur .rep .dit')).map(x => x.textContent)), fen: fen ? await fen.evaluate(() => Array.from(document.querySelectorAll('#mur2 .rep .dit')).map(x => x.textContent)) : [], distant: await T.pg.evaluate(() => Array.from(document.querySelectorAll('.rep .dit')).map(x => x.textContent)) };
  /* ce que la frappe a écrit au hub (de la première touche à 3,5 s après la dernière Entrée), par chemin ; et par réponse */
  const E2 = ECR.slice(ecr0).filter(x => x.t >= kd[0] - 5 - DECAL); out.ecritures = {}; out.ko = {}; E2.forEach(x => { const q = (x.qui === 'pilote' ? '' : x.qui + ' ') + quoiDe(x.c); out.ecritures[q] = (out.ecritures[q] || 0) + 1; out.ko[q] = (out.ko[q] || 0) + (x.n || 0); }); out.nEcr = E2.length;
  out.octets = E2.reduce((s, x) => s + (x.n || 0), 0);
  if (TRACE) { const SR = await T.pg.evaluate(() => window.__SR), SE = await o.pg.evaluate(() => window.__SE); out.trace = []; let i0 = 0;
    PHRASES.forEach((ph, k) => { const t0 = kd[i0]; i0 += ph.length; const t1 = t0 + ph.length * 80 + 2500;
      const se = SE.filter(x => x[0] >= t0 - 5 && x[0] <= t1); const re = recale(SR.map(x => [x[0], x.slice(1)]), 't').map(x => [x[0]].concat(x[1])).filter(x => x[0] >= t0 - 5 && x[0] <= t1);
      out.trace.push('réponse ' + (k + 1) + ' (' + ph.length + ' touches, ' + (ph.length * 80) + ' ms) · ' + se.length + ' scènes écrites par le pilote (+ms:lettres portées) ' + se.filter((x, j) => j % 8 === 0 || j === se.length - 1).map(x => '+' + Math.round(x[0] - t0) + ':' + x[3 - 2]).join(' ') );
      out.trace.push('      scènes reçues par le distant (+ms : ts reçu / ts montré avant : lettres portées) ' + re.map(x => '+' + Math.round(x[0] - t0) + ' : ' + x[1] + '/' + x[2] + ' : ' + x[3]).join(' │ '));
      const t0N = t0 - DECAL; const ew = LECT.filter(x => x.qui === 'pilote-ecrit' && x.t >= t0N - 5 && x.t <= t0N + ph.length * 80 + 2500), lg = LECT.filter(x => x.qui === 'tableau' && x.t >= t0N - 5 && x.t <= t0N + ph.length * 80 + 2500);
      out.trace.push('      AU FAUX HUB (heure de la sonde) : scènes arrivées (+ms:lettres) ' + ew.filter((x, j) => j % 8 === 0 || j === ew.length - 1).map(x => '+' + Math.round(x.t - t0N) + ':' + x.l).join(' ') + ' · lectures du distant servies (+ms:lettres) ' + lg.map(x => '+' + Math.round(x.t - t0N) + ':' + x.l).join(' ')); }); }
  out.refus = REFUSES.map(x => x.m + ' ' + x.c + ' (' + x.ko + ')'); out.temoins = await temoins(o.pg);
  const C = test ? null : '/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule_joue'; const cj = C ? (lireH(C) || {}) : {}; const k1 = Object.keys(cj)[0];
  out.auHub = test ? JSON.stringify(lireH('/site/tableau_test') || {}) : JSON.stringify(((cj[k1] || {}).etat || {}).parDiapo || {});
  await capt(o.pg, 'K-' + mode + '-pilote'); if (fen) await capt(fen, 'K-' + mode + '-tableau'); await capt(T.pg, 'K-' + mode + '-distant');
  out.errs = o.errs.concat(o.boites, T.errs, T.boites); await o.ctx.close(); await T.ctx.close(); return out; };
const statK = a => { const v = a.filter(x => x != null).sort((x, y) => x - y); if (!v.length) return { med: null, max: null, n: 0, perdues: a.length, txt: '—' }; const med = v[Math.floor(v.length / 2)]; return { med, max: v[v.length - 1], n: v.length, perdues: a.length - v.length, txt: 'médiane ' + med + ' ms · max ' + v[v.length - 1] + ' ms · ' + v.filter(x => x > 100).length + ' au-delà de 100 ms · ' + v.filter(x => x >= 350).length + ' à 350 ms ou plus · ' + (a.length - v.length) + ' jamais vue(s) (sur ' + a.length + ')' }; };
dire(''); dire('══ K · 1536×864 · trois réponses d’élèves écrites au pilote (80 ms entre deux touches) : le délai de chaque lettre au pilote, à la fenêtre du tableau (1280×720) et au tableau distant (1280×720) ══');
for (const mode of MODES) { const nomM = mode === 'test' ? 'mode test' : 'vraie heure'; const r = await jouerK(FICHIER, mode);
  const sp = statK(r.pilote), sf = statK(r.fen), sd = statK(r.distant);
  dire('      K · ' + nomM + ' · ' + r.n + ' touches · pilote : ' + sp.txt + ' │ fenêtre du tableau : ' + sf.txt + ' │ tableau distant : ' + sd.txt);
  dire('      K · ' + nomM + ' · ' + r.montres);
  dire('      K · ' + nomM + ' · écrit au hub pendant la frappe (3 réponses, ' + r.n + ' touches) : ' + r.nEcr + ' écritures (' + Math.round(r.nEcr / 3) + ' par réponse), ' + Math.round(r.octets / 1024) + ' Ko — ' + Object.entries(r.ecritures).map(([k, v]) => k + ' ' + v + ' (' + (r.ko[k] / 1024).toFixed(0) + ' Ko, ' + (r.ko[k] / v / 1024).toFixed(1) + ' Ko chacune)').join(', '));
  if (r.trace) r.trace.forEach(x => dire('        ' + x));
  verif('K', r.lance && r.ok && r.n >= 200, nomM + ' : l’heure lancée, les trois réponses tapées (' + r.n + ' touches)');
  verif('K', sp.med != null && sp.med <= 50 && sp.max <= 100 && !sp.perdues, nomM + ' : au pilote, chaque lettre paraît à l’image suivante — ' + sp.txt);
  verif('K', sf.med != null && sf.med <= 100 && sf.max < 350 && !sf.perdues, nomM + ' : à la fenêtre du tableau, la règle de 7 (médiane au plus 100 ms, chaque lettre sous 350 ms) — ' + sf.txt);
  verif('K', sd.med != null && sd.med <= 100 && sd.max < 350 && !sd.perdues, nomM + ' : au tableau distant, la règle de 7 (médiane au plus 100 ms, chaque lettre sous 350 ms) — ' + sd.txt);
  const tous = x => PHRASES.every(ph => (x || []).some(t => String(t).trim() === ph));
  verif('K', tous(r.textes.pilote) && tous(r.textes.fen) && tous(r.textes.distant) && PHRASES.every(ph => r.auHub.indexOf(ph) >= 0), nomM + ' : rien n’est perdu — les trois réponses entières au pilote, à la fenêtre du tableau, au tableau distant, au hub (' + (r.test ? 'l’image du tableau, /site/tableau_test' : 'l’état de l’heure') + ')', { pilote: r.textes.pilote.length, distant: r.textes.distant.length });
  verif('K', !r.refus.length && !r.temoins.sessionKo, nomM + ' : aucun envoi refusé (' + r.refus.length + '), le témoin « ● session » sans « coupée »', r.refus.slice(0, 4));
  sansErreur('K', r.errs, nomM); }
dire(''); dire('--- fin : ' + nb + ' vérification(s), ' + echecs + ' échec(s) · ' + (echecs ? 'ROUGE' : 'VERT'));
fs.writeFileSync(path.join(OUT, 'sonde-frappe-tableau' + (process.env.MJPC_NOM ? '-' + process.env.MJPC_NOM : '') + '.txt'), R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
