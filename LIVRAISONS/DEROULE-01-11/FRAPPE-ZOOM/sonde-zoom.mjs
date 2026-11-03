// LA SONDE DU ZOOM DE LA TÉLÉCOMMANDE (MANDATS/DEROULE-01-11/MANDAT-FRAPPE-RETARD-ZOOM.md §1.2, §3.1, §4.1) — par le geste, sous le faux hub RANGÉ COMME LE VRAI,
// qui REFUSE (HTTP 400) les clés interdites et qui POUSSE son flux (EventSource) : le harnais de APPEL/sonde-appel.mjs, repris tel quel (lignes 18-231).
// Aucune écriture ni lecture du vrai hub. Aucun nom d'élève dans ce qui sort.
// usage : node sonde-zoom.mjs <assemble/index.html> [dossier-de-sortie]
//   MJPC_PARTIES=H,T,A ; MJPC_ANCIEN=<un assemblé d'avant, la 8.80.0-⑬> (partie A) ; MJPC_CAPT ; MJPC_MEDIAS ; MJPC_PYQR ; MJPC_NOM
//  H  vraie heure : le pilote sur un ordinateur (1536 × 864), la fenêtre du tableau (1280 × 720), le tableau distant (1280 × 720), la télécommande sur un
//     téléphone (390 × 844, tactile). A+ puis A− au téléphone : le curseur « texte au tableau » du pilote (sa valeur, son étiquette), la fenêtre du tableau et le
//     tableau distant (la taille reçue, la police dessinée), chacun en moins de 0,5 s ; le curseur bougé au pilote (à la souris) : le téléphone montre le même
//     cran ; les deux bornes, grisées, leur raison écrite à l'écran
//  T  la même chose en mode test
//  A  le pilote resté sur une version d'avant (MJPC_ANCIEN), le téléphone et le tableau distant sur celle-ci : ce qui bouge, ce qui ne bouge pas (mesuré, dit)
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-zoom.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; let anonF = s => s; const dire = s => { s = anonF(String(s)); R.push(s); console.log(s); };   /* aucun nom d'élève dans ce qui sort : « ÉLÈVE n » (son rang dans la liste de la classe) */
let MESURE = false, mnb = 0, mrouges = 0;   /* MESURE : ce qui suit est mesuré et dit, sans compter (« mesure vert / mesure ROUGE ») — ZT et la mesure de la main (㉞ : la main jugée aux montres) */
const verif = (k, ok, quoi, det) => { if (MESURE) { mnb++; if (!ok) mrouges++; } else { nb++; if (!ok) echecs++; } dire((MESURE ? (ok ? '  mesure vert   ' : '  mesure ROUGE  ') : ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + anonF(typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 1400) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'M,P1H,P1T,P2H,P2T,P3H,P3T,P4,Q,QT,X,XT,Z,ZT').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
dire('C16 · sonde du zoom de la télécommande · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400), avec son flux (EventSource) · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

/* ── la séance 1 du faux hub (comme sonde-fin.mjs) : dans l'heure 1, « Tableau 2 » devient un schéma (un tableau, une carte) si demandé ── */
const sk0 = st => { const S0 = st.site['3e'].chapitres[0].seances; return Object.keys(S0).filter(k => S0[k] && S0[k].type !== 'sommaire').sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); };
const store = (src = null, retouche = null, forme = 'tableau') => { const st = storeOuverture(RACINE, { champs: true }); const ch = st.site['3e'].chapitres[0];
  const E = ch.seances[sk0(st)[0]].deroule.ecrans; const t2 = E.find(e => e && e.act === 'Tableau 2');
  if (t2 && src) { t2.act = 'Les cinq tableaux'; t2.blocs = [{ t: 'schema', forme, id: 'bsonde-tab', titre: 'Les cinq tableaux', src }]; }
  if (retouche) retouche(E, st); return st; };

/* ── le faux hub partagé (Node), RANGÉ COMME LE VRAI (la règle de QUATRE-DETTES/sonde-dettes.mjs et de DERNIERES-DETTES/sonde-fin.mjs : une valeur nulle,
   une liste ou un objet vides ne sont pas rangés ; une liste est rangée en objet aux clés « 0 », « 1 »… et relue en liste selon la règle de Firebase ; les
   clés d'un objet relues triées) ET QUI REFUSE LES CLÉS INTERDITES, COMME LE VRAI (documentation de Firebase Realtime Database, « Structure your data » :
   « keys … cannot contain ., $, #, [, ], /, or ASCII control characters 0-31 or 127 » ; le SDK 8.10.1 refuse aussi la clé vide — `INVALID_KEY_REGEX_`) :
   HTTP 400 et rien n'est rangé. ── */
let HUBN = null; let ECR = []; const REFUSES = []; let REFUSER = true;   /* REFUSER = false : rangé comme le vrai, sans le refus des clés (la partie K, « sans ») */
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
/* RETARD : une lecture d'un appareil, à un chemin, rendue telle qu'elle était au moment de la demande mais `ms` plus tard (un réseau lent) — la partie M, défaut 6 */
let RETARD = null;
/* les valeurs du serveur, comme le vrai hub les résout (REST : `{".sv": "timestamp"}` devient l'heure du serveur à l'écriture) — l'heure du hub, ici celle de la sonde */
const resoudreSv = v => { if (v && typeof v === 'object' && !Array.isArray(v)) { const K = Object.keys(v); if (K.length === 1 && K[0] === '.sv' && v['.sv'] === 'timestamp') return Date.now(); const o = {}; K.forEach(k => { o[k] = resoudreSv(v[k]); }); return o; } if (Array.isArray(v)) return v.map(resoudreSv); return v; };
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') { const v = JSON.stringify(lireH(c)); if (RETARD && RETARD.qui === qui && RETARD.re.test(c)) { RETARD.n = (RETARD.n || 0) + 1; await p(RETARD.ms); } return v; } let bd = null; try { bd = resoudreSv(JSON.parse(corps || 'null')); } catch (e) {}
  const ko = REFUSER ? refusDe(m, c, bd) : null; if (ko) { REFUSES.push({ qui, m, c, ko, t: Date.now() }); ECR.push({ qui, m, c, t: Date.now(), refus: true }); return '§400§' + JSON.stringify({ error: 'Invalid data; couldn\'t parse key beginning at ' + ko + '. Keys must not contain \'/\', \'.\', \'#\', \'$\', \'[\', or \']\'' }); }
  ECR.push({ qui, m, c, t: Date.now(), bd }); setTimeout(() => pousserFlux(c), 0);
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => /^§400§/.test(t) ? new Response(t.slice(5), { status: 400 }) : new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const imageDe = u => { const m = /mjpc-medias\/(.*\/)?([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (!m) return null; if (MEDIAS) { const f = path.join(MEDIAS, m[2]); if (fs.existsSync(f)) return f; } return IMG_OUV[m[2]] || IMG_DEFAUT; };
const typeDe = f => /\.webp$/i.test(f) ? 'image/webp' : /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
/* LE FLUX DU FAUX HUB : le flux REST de Firebase (`EventSource`, événements « put ») — chaque abonné reçoit la valeur de son chemin dès
   qu'une écriture touche ce chemin (au-dessus, dessous ou dessus), comme le vrai hub la pousse. */
const ABOS = []; const T0REEL = Date.now();
/* l'image du QR (api.qrserver.com est coupé, comme tout le réseau) : dessinée par `qrcode` (Python) — MJPC_PYQR = le dossier de la bibliothèque ; sans elle, une image d'attente */
const QR_PY = 'import sys\nsys.path.insert(0, sys.argv[1])\nimport qrcode, qrcode.image.svg\nsys.stdout.write(qrcode.make(sys.argv[2], image_factory=qrcode.image.svg.SvgPathFillImage, box_size=10, border=2).to_string(encoding="unicode"))\n';
const qrSvg = d => { try { if (process.env.MJPC_PYQR && fs.existsSync(process.env.MJPC_PYQR)) { const { execFileSync } = req('child_process'); return execFileSync('python3', ['-I', '-c', QR_PY, process.env.MJPC_PYQR, d]).toString(); } } catch (e) {}
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff"/><text x="50" y="55" font-size="14" text-anchor="middle">QR</text></svg>'; };
const pousserFlux = c => { const cc = c.replace(/\/+$/, ''); ABOS.forEach(a => { if (!(cc === a.ch || cc.startsWith(a.ch + '/') || a.ch.startsWith(cc + '/'))) return; if (a.pg.isClosed()) return;
  a.pg.evaluate(([id, d]) => { try { window.__esPousser && window.__esPousser(id, d); } catch (e) {} }, [a.id, JSON.stringify(lireH(a.ch))]).catch(() => {}); }); };
const fauxFlux = () => { const ES = {}; let n = 0;
  window.__esPousser = (id, d) => { const e = ES[id]; if (!e || e.ferme) return; const ev = { data: JSON.stringify({ path: '/', data: JSON.parse(d) }) }; (e.l.put || []).forEach(f => { try { f(ev); } catch (x) {} }); };
  window.EventSource = function (u) { const id = 'es' + (++n); const self = this; this.l = {}; this.ferme = false; ES[id] = this; const s2 = String(u);
    this.addEventListener = (t, f) => { (self.l[t] = self.l[t] || []).push(f); }; this.close = () => { self.ferme = true; }; this.onerror = null;
    if (s2.indexOf('firebasedatabase.app') < 0) { setTimeout(() => { if (self.onerror) self.onerror({}); }, 0); return; }
    const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''));
    window.__hubEcoute(id, c).then(d => setTimeout(() => window.__esPousser(id, d), 0)); }; };
const ouvrir = async ({ qui = 'pilote', fichier = FICHIER, W = 1536, H = 864, q = '?n=3e', test = false, prof = true, h = '09:00', jour = '2026-09-14', tel = false, decal = 0 }) => {   /* decal : la montre de cet appareil, en avance (+) ou en retard (−), en ms */
  const ctx = await nav.newContext(Object.assign({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }, tel ? { isMobile: true, hasTouch: true } : {}));
  await ctx.exposeBinding('__hubEcoute', (src, id, ch) => { ABOS.push({ pg: src.page, id, ch: ch.replace(/\/+$/, '') }); return JSON.stringify(lireH(ch)); }); await ctx.addInitScript(fauxFlux); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); if (u.indexOf('api.qrserver.com') >= 0) return r.fulfill({ body: qrSvg(new URL(u).searchParams.get('data') || ''), contentType: 'image/svg+xml' }); const f = imageDe(u); if (f) return r.fulfill({ path: f, contentType: typeDe(f) }); return r.abort(); });
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  /* l'horloge : le 14/09, 09:00 au lancement de la sonde, puis elle AVANCE, la même pour tous les appareils (une horloge figée faisait de l'heure des scènes un compteur
     que deux pilotes faisaient monter chacun de leur côté — un artefact que la classe ne vit jamais) ; MJPC_HORLOGE=figee : l'ancienne */
  const t09 = new Date(jour + 'T' + h + ':00+02:00').getTime();
  const pg = await ctx.newPage(); if (process.env.MJPC_HORLOGE === 'figee') await pg.clock.setFixedTime(new Date(t09)); else await pg.clock.install({ time: new Date(t09 + (Date.now() - T0REEL) + decal) });   /* les montres de tous les appareils avancent ensemble, à l'heure, comme des appareils réglés sur l'heure du réseau */
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
const reprendre = async o => { const pg = o.pg; const b = await pg.waitForSelector('#ses-reprise-oui', { state: 'visible', timeout: 9000 }).then(() => pg.click('#ses-reprise-oui')).then(() => true).catch(() => false);
  if (!b) return false; await p(3500); await pg.keyboard.press('Escape'); await p(400); return true; };
const ouvrirTableau = async (o, W = 1280, H = 720) => { if (!(await o.pg.isVisible('#bvideoproj').catch(() => false))) return null; const [fen] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), o.pg.click('#bvideoproj')]); await p(1500); if (fen) await fen.setViewportSize({ width: W, height: H }); await o.pg.bringToFront(); return fen; };
const ouvrirAtelier = async o => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'atelierOuvrir()'))) await pg.evaluate(() => atelierOuvrir()); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(3000); };
const ici_ = pg => pg.evaluate(() => { const c = document.getElementById('compte'); let eid = null; try { eid = seance().ecrans[S.di].eid; } catch (e) {} return { eid, di: typeof S !== 'undefined' ? S.di : null, compte: c ? c.textContent.trim() : '', numero: ((document.getElementById('numero') || {}).textContent || '').replace(/\s+/g, ' ').trim() }; });
const eidsDe = pg => pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid, role: e.role || '', act: e.act, heure: e.heure, types: (e.blocs || []).map(b => b && b.t) })); } catch (e) { return []; } });
const lignesX = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ di: +d.dataset.atDi, eid: d.dataset.eid, t: ((d.querySelector('.t') || d).textContent || '').replace(/\s+/g, ' ').trim() })));
const garde = async pg => { if (await pg.evaluate(() => !!(document.getElementById('garde') && document.getElementById('garde').classList.contains('on')))) { await pg.click('#garde-devant').catch(() => {}); await p(900); } };
const allerA = async (pg, eid) => { const L = await eidsDe(pg); const x = L.find(e => e.eid === eid); if (!x) return false; const v = await pg.$('#volet .vig[data-i="' + x.i + '"]'); if (!v) return false;
  await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); await garde(pg);
  for (let k = 0; k < 20 && (await ici_(pg)).eid !== eid; k++) await p(200); return (await ici_(pg)).eid === eid; };
const toutDevoiler = async (pg, eid) => { await pg.click('#numero').catch(() => {}); for (let k = 0; k < 14; k++) { const s2 = await ici_(pg); if (process.env.MJPC_DEBUG) console.log('      (débogage) toutDevoiler ' + k + ' ' + JSON.stringify(s2) + ' main ' + await pg.evaluate(() => DR_SES.main === DR_SES.id).catch(() => '?')); if (s2.eid !== eid || /^(\d+) \/ \1 dévoilés|rien à dévoiler|vidéo/.test(s2.compte)) break; await pg.keyboard.press('ArrowRight'); await p(300); } await p(900); };
const sansErreur = (k, errs, quoi) => verif(k, !errs.length, quoi + ' : aucune erreur JS, aucune boîte système', errs.join(' ; '));
const texteDe = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); return m ? (m.innerText || '').replace(/\s+/g, ' ').trim() : null; }, sel).catch(() => null) : Promise.resolve(null);
const temoins = pg => pg.evaluate(() => { const s = document.getElementById('dr-session'); const b = document.getElementById('mjpc-echecs-bandeau');
  return { session: s ? s.textContent.trim() : null, sessionKo: !!(s && s.classList.contains('dr-session-ko')), bandeau: !!(b && b.style.display !== 'none' && b.classList.contains('mjpc-bandeau-echec')), bandeauT: b ? (b.innerText || '').replace(/\s+/g, ' ').slice(0, 160) : '' }; });
/* écrire en direct dans un texte de la diapo du pilote : un clic, la fin du texte, la frappe, Échap */
const corriger = async (pg, sel, ajout) => { const x = await pg.$('#mur ' + sel); if (!x) return false; await x.click(); await p(300); await pg.keyboard.press('Control+End'); await pg.keyboard.type(ajout, { delay: 20 }); await p(300); await pg.keyboard.press('Escape'); await p(400); return true; };
/* attendre qu'une condition tienne (jusqu'à `ms`) */
const attendre = async (f, ms = 6000) => { const t0 = Date.now(); let v = null; while (Date.now() - t0 < ms) { v = await f(); if (v) return v; await p(300); } return v; };

/* ═══ le parcours ═══ */
const QB = 'emt9v3yqo6pvd5';
/* relancer la même séance par la case de l'emploi du temps : « Ouvrir le pilotage et lancer », ou « Reprendre le cours » quand la case sait l'heure en cours */
const relancerClasse = async (o, jour = '2026-09-14') => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'edtOuvrir()'))) await pg.evaluate(() => edtOuvrir()); await p(1500);
  const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return false; x.click(); return true; }, jour); await p(800);
  let quoi = null; if (ok && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer')) quoi = 'Ouvrir le pilotage et lancer'; else if (ok && await clicTexte(pg, 'button', 'Reprendre le cours')) quoi = 'Reprendre le cours';
  if (!quoi) { await pg.keyboard.press('Escape').catch(() => {}); await p(300); const b = await pg.waitForSelector('#ses-reprise-oui', { state: 'visible', timeout: 4000 }).then(() => pg.click('#ses-reprise-oui')).then(() => true).catch(() => false); if (b) quoi = 'bandeau « Reprendre » (la case ne proposait rien)'; }
  await p(3500); await pg.keyboard.press('Escape'); await p(400); return quoi; };   /* « Question-bilan » (un bloc question) de la séance 1 du faux hub */
const cleDe = pg => pg.evaluate(() => { try { const m = S.mur; if (!m) return null; let eid = m.eid; try { if (!eid) eid = seance().ecrans[m.di].eid; } catch (e) {} return eid + '#' + (m.nDev || 0) + '#' + (m.page || 0); } catch (e) { return null; } }).catch(() => null);
const tabDe = pg => pg.evaluate(() => { const a = document.getElementById('ses-tab-att'); const m = (typeof DR_TAB === 'object' && DR_TAB.montre) || null; return { attente: !!(a && a.style.display !== 'none'), cle: m ? m.eid + '#' + (m.nDev || 0) + '#' + (m.page || 0) : null, vide: !((document.getElementById('mur2') || {}).innerHTML || '').trim() }; }).catch(() => null);
const geste = async pg => { const ok = await pg.locator('#bdev').tap({ timeout: 1500 }).then(() => true).catch(() => false); if (!ok) await pg.evaluate(() => document.getElementById('bdev').click()).catch(() => {}); };
const gesteClic = async pg => { const ok = await pg.locator('#bdev').click({ timeout: 1500 }).then(() => true).catch(() => false); if (!ok) await pg.evaluate(() => document.getElementById('bdev').click()).catch(() => {}); };
const suivre = async (source, autres, ms = 3000) => { const t0 = Date.now(); await p(30); const cible = await cleDe(source); const r = {};
  while (Date.now() - t0 < ms) { for (const [nom, pg, tab] of autres) { if (r[nom] != null) continue; const k = tab ? ((await tabDe(pg)) || {}).cle : await cleDe(pg); if (k && k === cible) r[nom] = Date.now() - t0; } if (autres.every(([n]) => r[n] != null)) break; await p(25); }
  return { cible, r }; };
const bandeauDe = pg => pg.evaluate(() => { const b = document.getElementById('ses-reprise'); if (!b) return null; const r = b.getBoundingClientRect(); return r.height > 0 && getComputedStyle(b).display !== 'none' ? (b.innerText || '').replace(/\s+/g, ' ').trim() : null; }).catch(() => null);
const attendreBandeau = async (pg, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const b = await bandeauDe(pg); if (b) return { t: Date.now() - t0, b }; await p(100); } return { t: null, b: null }; };
const clore = async pg => { await pg.evaluate(() => { const b = document.getElementById('dr-clore'); if (b) b.click(); }).catch(() => {}); await p(900); await pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }).catch(() => {}); await p(600);
  await pg.evaluate(() => { const g = document.getElementById('garde-clore'); if (g && g.classList.contains('on')) document.getElementById('gclore-oui').click(); }).catch(() => {}); await p(2500); await garde(pg); };


/* ═══════════════════ L'APPEL (MANDATS/DEROULE-01-11/MANDAT-APPEL.md §4) ═══════════════════ */
const JOUR = '2026-09-14';
const V879 = process.env.MJPC_V879 && fs.existsSync(process.env.MJPC_V879) ? path.resolve(process.env.MJPC_V879) : null;   /* la 8.79.0-⑫ (cf7bb57, md5 3cd597e8…) : une heure jouée avant cette version (partie P4) */
const LISTE = (() => { const st = store(); return (((st.classes || {})['3E Charles de Gaulle'] || {}).eleves || []).slice().sort((a, b) => String(a).localeCompare(String(b), 'fr')); })();
const echR = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
{ const plein = LISTE.map((n, i) => [n, i]).sort((a, b) => b[0].length - a[0].length);
  const mots = [...new Set(LISTE.join(' ').split(/[\s'’-]+/).filter(x => x.length >= 3))].sort((a, b) => b.length - a.length);
  const slug = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');   /* la forme des listes au hub (edtSlugEleve) */
  const slugs = LISTE.map((n, i) => [slug(n), i]).filter(x => x[0]).sort((a, b) => b[0].length - a[0].length);
  anonF = t => { let x = String(t); plein.forEach(([n, i]) => { x = x.split(n).join('ÉLÈVE ' + (i + 1)); }); slugs.forEach(([s, i]) => { x = x.split(s).join('élève-' + (i + 1)); });
    mots.forEach(m => { x = x.replace(new RegExp('(^|[^\\p{L}])' + echR(m) + '(?![\\p{L}])', 'giu'), '$1un élève'); [slug(m)].filter(s => s.length >= 3).forEach(s => { x = x.replace(new RegExp('(^|[^a-z0-9])' + echR(s) + '(?![a-z0-9])', 'g'), '$1élève'); }); }); return x; }; }
const [A, B, C, D, E] = [1, 4, 7, 10, 13].map(i => LISTE[i]);
const PERMIS = [/^\/site\/3e\/chapitres\/\d+\/seances\/\d+\/deroule(_joue)?(\/|$)/, /^\/site\/cours_actif$/, /^\/site\/edt\//, /^\/corbeille\//, /^\/classes\//];   /* K15 (AUDITS/INTEGRATION-DEROULE/parcours.mjs) ; /site/edt/appel/… y est */
const PERMIS_34 = [/^\/site\/telecommande\/[A-Za-z0-9_-]+(\/scan)?$/, /^\/site\/repetition\/vif$/];   /* les chemins neufs déclarés par ㉞ (SESSION-PARTOUT/NOTE.md §2.12) */
const ecrituresHors = test => ECR.filter(x => !x.refus && x.qui !== 'tableau' && (test ? !/^\/site\/tableau_test(\/|$)/.test(x.c) : !(PERMIS.some(r => r.test(x.c)) || PERMIS_34.some(r => r.test(x.c)))));
const verifEcritures = (k, test) => { const h = ecrituresHors(test); verif(k, !h.length, test ? 'mode test : aucune écriture au hub hors de /site/tableau_test (' + h.length + ' hors)' : 'aucune écriture hors des chemins permis — K15, plus ceux de ㉞ et /site/edt/appel/… (' + h.length + ' hors, ' + ECR.filter(x => !x.refus).length + ' écritures)', h.slice(0, 5).map(x => x.qui + ' ' + x.m + ' ' + x.c));
  verif(k, !REFUSES.length, 'aucune écriture refusée par le faux hub (' + REFUSES.length + ')', REFUSES.slice(0, 3)); };
const extr = (t, re, n = 260) => { t = anonF(t || ''); const m = re.exec(t); return m ? t.slice(Math.max(0, m.index - 60), m.index + n) : '—'; };
const court = (t, n) => anonF(String(t == null ? '' : t)).slice(0, n);   /* rendre anonyme d'abord, couper ensuite (un nom coupé échappait) */
const quand = async (f, ms = 2000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await f()) return Date.now() - t0; await p(40); } return (await f()) ? Date.now() - t0 : null; };
const ms = x => x == null ? '∞' : x + ' ms';
/* la case du lundi 14/09 (3E Charles de Gaulle) */
const caseOuvrir = async pg => { await pg.evaluate(() => { try { edtModaleFermer(); } catch (e) {} }).catch(() => {});
  const vue = await pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0); }).catch(() => false);
  if (!vue) { if (!(await clicTexte(pg, 'button', 'edtOuvrir()'))) await pg.evaluate(() => edtOuvrir()).catch(() => {}); await p(2200); }
  const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return false; x.click(); return true; }, JOUR).catch(() => false); await p(1000); return ok; };
const caseEtat = pg => pg.evaluate(() => { const m = document.getElementById('edt-modale'); if (!m || !(m.getBoundingClientRect().height > 0)) return null; const t = (m.innerText || '').replace(/\s+/g, ' ').trim();
  const lab = t.match(/(L’appel — absents|Absents de cette heure) \((\d+) sur (\d+)\)/) || [];
  return { t, lab: lab[0] || null, n: lab[2] != null ? +lab[2] : null, abs: Array.from(m.querySelectorAll('.edt-el.edt-el-abs')).map(b => b.textContent.trim()).sort(), els: m.querySelectorAll('.edt-el').length,
    btn: Array.from(m.querySelectorAll('button')).filter(b => b.offsetParent !== null).map(b => (b.innerText || '').replace(/\s+/g, ' ').trim()) }; }).catch(() => null);
const caseClic = async (pg, nom) => { const l = pg.locator('#edt-modale .edt-el').filter({ hasText: new RegExp('^\\s*' + echR(nom) + '\\s*$') }); return l.first().click({ timeout: 2000 }).then(() => true).catch(() => false); };
/* le pilote */
const absentAu = (pg, nom) => pg.evaluate(n => { try { return !!absentA(n); } catch (e) { return null; } }, nom).catch(() => null);
const nbAbsents = pg => pg.evaluate(() => { try { return ELEVES.filter(e => absentA(e)).length; } catch (e) { return null; } }).catch(() => null);
const presentsDe = pg => texteDe(pg, '#presents');
const clicDroit = async (pg, nom, quoi = 'absent') => { const sel = '#part [data-e="' + String(nom).replace(/"/g, '\\"') + '"]';
  let ok = await pg.click(sel, { button: 'right', timeout: 2500 }).then(() => true).catch(() => false);
  if (!ok) ok = await pg.evaluate(s => { const el = document.querySelector(s); if (!el) return false; const r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.left + 3, clientY: r.top + 3 })); return true; }, sel).catch(() => false);
  if (!ok) return false; await p(300);
  const ok2 = await pg.click('#menu [data-a="' + quoi + '"]', { timeout: 1500 }).then(() => true).catch(() => false); await p(250); return ok2; };
const participation = async (pg, nom) => { const ini = await pg.evaluate(n => { try { return iniDe(n); } catch (e) { return null; } }, nom).catch(() => null); if (!ini) return false;
  const ok = await pg.click('#part span[data-ini="' + ini + '"]', { timeout: 2000 }).then(() => true).catch(() => false); if (!ok) return false; await p(400);
  const ok2 = await pg.click('#ppop button.m[data-pose]', { timeout: 1500 }).then(() => true).catch(() => false); await p(300); await pg.keyboard.press('Escape').catch(() => {}); await p(300); return ok2; };
/* la télécommande */
const ouvrirTelecommande = async (o, fichier, test, decal = 0, qui = 'telephone') => { await o.pg.waitForSelector('#dr-tc-btn', { state: 'visible', timeout: 5000 }).catch(() => {}); await o.pg.click('#dr-tc-btn').catch(() => {}); await p(800);
  const url = await o.pg.evaluate(() => { const i = document.getElementById('dr-tc-qr-img'); return i ? new URL(i.src).searchParams.get('data') : null; }).catch(() => null); if (!url) return null;
  const tl = await ouvrir({ fichier, qui, W: 390, H: 844, tel: true, prof: false, test: false, q: '?' + url.split('?')[1], decal });
  for (let k = 0; k < 100; k++) { if (await tl.pg.evaluate(() => { const x = document.getElementById('tc-haut'); return !!(x && x.style.display !== 'none' && /Diapo|Hors/.test(x.innerText)); }).catch(() => false)) break; await p(150); }
  return tl; };
const tcSel = nom => '#tc-bas button[data-a="abs"][data-e="' + String(nom).replace(/"/g, '\\"') + '"]';
const tcTap = async (tl, sel) => { const ok = await tl.pg.locator(sel).first().tap({ timeout: 1500 }).then(() => true).catch(() => false); if (!ok) await tl.pg.evaluate(s => { const b = document.querySelector(s); if (b) b.click(); }, sel).catch(() => {}); return ok; };
const tcAppelOuvrir = async tl => { if (await tl.pg.$('#tc-bas button[data-a="abs"]')) return true; if (!(await tl.pg.$('#tc-bas button[data-a="appel"]'))) return false; await tcTap(tl, '#tc-bas button[data-a="appel"]'); await p(500); return !!(await tl.pg.$('#tc-bas button[data-a="abs"]')); };
/* le hub : l'heure de la classe (son chemin, son paquet) ; l'appel d'avant l'heure */
const derniers = par => { const out = {}; if (!par || typeof par !== 'object') return out; Object.keys(par).forEach(s => { const d = par[s]; if (!d || typeof d !== 'object') return; Object.keys(d).forEach(dev => { const x = d[dev]; if (!x || typeof x !== 'object') return; const t = +x.t || 0; if (!out[s] || t > out[s].t || (t === out[s].t && dev > out[s].dev)) out[s] = { a: +x.a ? 1 : 0, t, dev }; }); }); return out; };
const listeDe = H => { if (!H) return []; const l = Array.isArray(H.absents) ? H.absents.slice() : []; const d = derniers(H.absentsPar); Object.keys(d).forEach(k => { const i = l.indexOf(k); if (d[k].a) { if (i < 0) l.push(k); } else if (i >= 0) l.splice(i, 1); }); return [...new Set(l)].sort(); };
const heureHub = () => { const C = '/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule_joue'; const cj = lireH(C) || {}; const sl = Object.keys(cj)[0]; const H = ((cj[sl] || {}).heures) || {}; const k = Object.keys(H)[0]; return { chemin: k ? C + '/' + sl + '/heures/' + k : null, C: sl ? C + '/' + sl : null, h: k ? H[k] : null }; };
const avantHub = () => { const a = lireH('/site/edt/appel'); const l = []; const tour = (v, ch) => { if (v && typeof v === 'object' && v.absentsPar) { const x = listeDe({ absentsPar: v.absentsPar }); if (x.length) l.push({ ch, v: x }); return; } if (v && typeof v === 'object') Object.keys(v).forEach(k => tour(v[k], ch + '/' + k)); }; tour(a, '/site/edt/appel'); return l; };
const slugDe = (pg, nom) => pg.evaluate(n => edtSlugEleve(n), nom).catch(() => null);
/* le tableau : rien de l'appel (aucun nom de la classe, ni « absent », ni « appel », ni « présents ») */
/* ce qui se voit à l'écran du tableau (le texte affiché ; les infobulles ne se voient pas au vidéoprojecteur) */
const tableauPropre = async pg => { if (!pg) return null; const t = await pg.evaluate(() => (document.body.innerText || '')).catch(() => ''); let n = 0; const vus = [];
  LISTE.forEach(nom => { if (t.indexOf(nom) >= 0) { n++; vus.push(nom); } }); const re = /absent|l’appel|l'appel|présents/gi; let m; while ((m = re.exec(t))) { n++; vus.push('« ' + t.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' ') + ' »'); } return { n, vus: vus.slice(0, 5) }; };
const lireRelecture = async (pg, nom) => { const recit = (await texteDe(pg, '#ecran-relecture')) || ''; await capt(pg, nom + '-recit');
  if (await pg.evaluate(() => { const x = Array.from(document.querySelectorAll('#ecran-relecture h3')).find(h => /mot pour chaque absent/i.test(h.innerText || '')); if (!x) return false; x.scrollIntoView({ block: 'start' }); return true; }).catch(() => false)) { await p(300); await capt(pg, nom + '-recit-le-mot'); }
  const ok = await pg.evaluate(() => { const b = document.querySelector('#ecran-relecture [data-f="passe"]'); if (!b) return false; b.click(); return true; }).catch(() => false); await p(1500);
  const passe = (await texteDe(pg, '#ecran-relecture')) || ''; await capt(pg, nom + '-passe'); return { recit, passe, ok }; };
const relireDepuisLaCase = async pg => { const ok = await pg.evaluate(() => { const b = document.querySelector('#edt-modale [data-relire]'); if (!b) return false; b.click(); return true; }).catch(() => false); await p(4000); await garde(pg); return ok; };
const appelDe = passe => { const i = passe.search(/L.appel\b/i); if (i < 0) return ''; const j = passe.search(/Notes au fil/i);  return passe.slice(i, j > i ? j : i + 600); };
const reset = () => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; RETARD = null; };


/* ═══ LE ZOOM (§4.1) ═══ */
const ANCIEN = process.env.MJPC_ANCIEN && fs.existsSync(process.env.MJPC_ANCIEN) ? path.resolve(process.env.MJPC_ANCIEN) : null;
const pilZ = pg => pg.evaluate(() => { const r = document.getElementById('taille'); return { t: +S.taille, v: r ? +r.value : null, l: ((document.getElementById('taille-l') || {}).textContent || '').trim() }; }).catch(() => null);
const tabZ = pg => pg ? pg.evaluate(() => { const m = (typeof DR_TAB === 'object' && DR_TAB.montre) || null; const mur = document.getElementById('mur2'); let px = null;
  if (mur) { const x = mur.querySelector('.corps') || Array.from(mur.querySelectorAll('li, p')).find(y => y.getBoundingClientRect().height > 0 && (y.textContent || '').trim()); px = x ? Math.round(parseFloat(getComputedStyle(x).fontSize) * 100) / 100 : null; }   /* la police du corps de la diapo (`rendre` : policePx, le cran) */
  return { t: m ? m.taille : null, px }; }).catch(() => null) : Promise.resolve(null);
const tcZ = tl => tl.pg.evaluate(() => { const r = document.querySelector('#tc-bas .rang.taille'); if (!r) return null; const b = s => r.querySelector('button[data-a="' + s + '"]');
  const vu = x => { if (!x) return ''; const s = getComputedStyle(x); return s.display === 'none' || s.visibility === 'hidden' || !(x.getBoundingClientRect().height > 0) ? '' : (x.innerText || '').replace(/\s+/g, ' ').trim(); };
  const bt = x => x && { dis: x.disabled, op: getComputedStyle(x).opacity, title: x.title };
  return { l: ((r.querySelector('.tl') || {}).textContent || '').trim(), ecrit: vu(r.parentNode && r.parentNode.querySelector('.tl-raison')) || vu(r), moins: bt(b('t-moins')), plus: bt(b('t-plus')), t: +S.taille }; }).catch(() => null);
const fmt = (z, f, d, c) => 'pilote ' + (z ? 'S.taille ' + z.t + ', curseur ' + z.v + ', « ' + z.l + ' »' : '—') + ' · fenêtre ' + (f ? f.t + ' (' + f.px + ' px)' : '—') + ' · distant ' + (d ? d.t + ' (' + d.px + ' px)' : '—') + ' · téléphone « ' + (c ? c.l : '—') + ' »';
/* depuis l'appui, sur une même horloge (comme la partie K de CORRECTIFS/sonde-correctifs.mjs) : chaque page note à chaque image (requestAnimationFrame) ce qu'elle
   montre — le pilote sa taille et son curseur, la fenêtre et le distant la taille reçue, le téléphone sa taille et l'étiquette de son cran ; l'appui (ou le clic)
   est noté par la page où il a lieu (pointerdown). Le temps d'un appareil = la première image qui montre le cran, moins l'appui. */
const VUES = { pil: () => { const r = document.getElementById('taille'); return S.taille + '|' + (r ? r.value : '') + '|' + ((document.getElementById('taille-l') || {}).textContent || '').trim(); },
  tab: () => { const m = (typeof DR_TAB === 'object' && DR_TAB.montre) || null; return String(m ? m.taille : ''); },
  tc: () => { const r = document.querySelector('#tc-bas .rang.taille .tl'); return S.taille + '|' + (r ? r.textContent.trim() : ''); } };
const armer = (pg, k) => pg ? pg.evaluate(src => { window.__Z = []; window.__Zon = true; window.__Zap = []; const lire = eval('(' + src + ')'); let der = null;
  if (!window.__ZapOn) { window.__ZapOn = true; document.addEventListener('pointerdown', e => { (window.__Zap = window.__Zap || []).push(performance.timeOrigin + e.timeStamp); }, true); }
  const f = () => { let v = null; try { v = lire(); } catch (e) {} if (v !== der) { der = v; window.__Z.push([performance.timeOrigin + performance.now(), v]); } if (window.__Zon) requestAnimationFrame(f); }; requestAnimationFrame(f); }, VUES[k].toString()).catch(() => {}) : null;
const releve = pg => pg ? pg.evaluate(() => { window.__Zon = false; return { z: window.__Z || [], ap: window.__Zap || [] }; }).catch(() => ({ z: [], ap: [] })) : { z: [], ap: [] };
const PROF_N = ['dr_tout', 'volet', 'miniatures', 'p85hPages', 'rendre', 'dr_sesAppliquer', 'dr_sesEnvoyerMaintenant', 'dr_tcMaj', 'participation', 'vueDroite', 'ouOnEnEst', 'p8RendreNotes', 'pousser', 'dr_tabDefauts', 'alertesForme', 'dr_rendreMur'];
const profArmer = pg => pg && process.env.MJPC_PROFIL ? pg.evaluate(noms => { window.__PR = {}; noms.forEach(n => { const f = window[n]; if (typeof f !== 'function') return; if (!f.__pr) { const g = function () { const t0 = performance.now(); try { return f.apply(this, arguments); } finally { const d = performance.now() - t0; const x = window.__PR[n] = window.__PR[n] || [0, 0, 0]; x[0] += d; x[1]++; x[2] = Math.max(x[2], d); } }; g.__pr = true; window[n] = g; } }); }, PROF_N).catch(() => {}) : null;
const profLire = (pg, nom) => pg && process.env.MJPC_PROFIL ? pg.evaluate(() => window.__PR || {}).then(o => dire('         (profil) ' + nom + ' : ' + Object.keys(o).sort((a, b) => o[b][0] - o[a][0]).map(k => k + ' ' + Math.round(o[k][0]) + ' ms/' + o[k][1] + ' (max ' + Math.round(o[k][2]) + ')').join(' · '))).catch(() => {}) : null;
const suivreZ = async (o, F, T, tl, geste, cible) => { await Promise.all([armer(o.pg, 'pil'), armer(F, 'tab'), armer(T.pg, 'tab'), armer(tl.pg, 'tc'), profArmer(o.pg), profArmer(tl.pg), profArmer(F)]); await p(150);
  const tn = Date.now(); await geste(); await p(1800); await profLire(o.pg, 'pilote'); await profLire(F, 'fenêtre'); await profLire(tl.pg, 'téléphone');
  const [P, Fe, D, C] = await Promise.all([releve(o.pg), releve(F), releve(T.pg), releve(tl.pg)]);
  const ap = [].concat(P.ap, C.ap).filter(x => x).sort((a, b) => b - a)[0] || null;   /* l'appui du geste : le dernier pointerdown (téléphone ou pilote) */
  const prem = (L, ok) => { const x = L.z.find(([t, v]) => ap != null && t >= ap - 5 && ok(String(v))); return x && ap != null ? Math.max(0, Math.round(x[0] - ap)) : null; };
  return { pilT: prem(P, v => v.split('|')[0] === String(cible)), pilV: prem(P, v => v.split('|')[1] === String(cible) && v.split('|')[2].split(' → ')[0] === CRANS_L[cible]),
    fen: prem(Fe, v => v === String(cible)), dist: prem(D, v => v === String(cible)), tc: prem(C, v => v.split('|')[0] === String(cible) && v.split('|')[1].split(' · ')[0] === CRANS_L[cible]), noeud: Date.now() - tn }; };
const tapZ = async (tl, a) => { const t0 = Date.now(); await tcTap(tl, '#tc-bas button[data-a="' + a + '"]'); return Date.now() - t0; };
/* le curseur du pilote à la souris, sur le cran voulu (un clic sur la piste, là où est le cran) */
const curseurA = async (pg, v) => { const b = await pg.locator('#taille').boundingBox().catch(() => null); if (!b) return false; const pouce = 16; const x = b.x + pouce / 2 + v * (b.width - pouce) / 4; await pg.mouse.click(x, b.y + b.height / 2); return true; };
const pz = async (fichier, mode) => { const test = mode === 'T'; const ancien = mode === 'A'; reset(); MESURE = ancien; const pre = 'zoom-' + NOMV + '-' + mode + '-';   /* A : une mesure (dite, pas comptée) — le code d'une version d'avant ne se corrige pas ici */
  const filP = ancien ? ANCIEN : fichier;
  dire('\n— ' + mode + ' · le zoom de la télécommande (' + (test ? 'mode test' : 'vraie heure') + (ancien ? ', le pilote sur une version d’avant : ' + md5(filP).slice(0, 8) : '') + ') —');
  const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(800);
  const o = await ouvrir({ fichier: filP, test, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); await gesteClic(o.pg); await p(400);
  const va = await allerA(o.pg, DIAPO_Z); await toutDevoiler(o.pg, DIAPO_Z);   /* une diapo de texte (« Analyse d'images : la routine », une consigne) : sa police suit le cran — la présentation du chapitre a ses tailles à elle */
  const F = await ouvrirTableau(o); await p(600);
  const tl = await ouvrirTelecommande(o, fichier, test); verif(mode, lance && va && !!tl && !!F, 'l’heure lancée, sur une diapo de texte toute dévoilée ; la fenêtre du tableau ouverte ; la télécommande (QR) sur la séance', { lance, va, tl: !!tl, F: !!F });
  if (!tl || !F) { for (const x of [tl, T, o]) if (x) await x.ctx.close().catch(() => {}); return; }
  await p(1200);
  const z0 = await pilZ(o.pg), f0 = await tabZ(F), d0 = await tabZ(T.pg), c0 = await tcZ(tl);
  dire('      au départ : ' + fmt(z0, f0, d0, c0));
  await capt(tl.pg, pre + '0-telephone'); await capt(o.pg, pre + '0-pilote'); await capt(F, pre + '0-fenetre-du-tableau'); await capt(T.pg, pre + '0-tableau-distant');
  const t0 = z0 ? z0.t : 1;
  /* A+ au téléphone */
  let tp = 0; const r1 = await suivreZ(o, F, T, tl, async () => { tp = await tapZ(tl, 't-plus'); }, t0 + 1);
  const z1 = await pilZ(o.pg), f1 = await tabZ(F), d1 = await tabZ(T.pg), c1 = await tcZ(tl);
  dire('      A+ au téléphone (l’appui ' + tp + ' ms) : ' + fmt(z1, f1, d1, c1)); dire('         depuis l’appui : pilote S.taille ' + ms(r1.pilT) + ', curseur ' + ms(r1.pilV) + ', fenêtre ' + ms(r1.fen) + ', distant ' + ms(r1.dist) + ', téléphone ' + ms(r1.tc));
  await capt(tl.pg, pre + '1-telephone-A-plus'); await capt(o.pg, pre + '1-pilote-A-plus'); await capt(F, pre + '1-fenetre-du-tableau-A-plus'); await capt(T.pg, pre + '1-tableau-distant-A-plus');
  const ok1 = [r1.pilT, r1.pilV, r1.fen, r1.dist, r1.tc].every(x => x != null && x <= 500) && f1 && f0 && f1.px > f0.px && d1 && d0 && d1.px > d0.px;
  verif(mode, ok1, 'A+ au téléphone : le curseur « texte au tableau » du pilote d’un cran plus haut (sa valeur et son étiquette), la fenêtre du tableau et le tableau distant plus grands, le téléphone dit le même cran — chacun en moins de 0,5 s', r1);
  /* A− au téléphone */
  let tq = 0; const r2 = await suivreZ(o, F, T, tl, async () => { tq = await tapZ(tl, 't-moins'); }, t0);
  const z2 = await pilZ(o.pg), f2 = await tabZ(F), d2 = await tabZ(T.pg), c2 = await tcZ(tl);
  dire('      A− au téléphone (l’appui ' + tq + ' ms) : ' + fmt(z2, f2, d2, c2)); dire('         depuis l’appui : pilote S.taille ' + ms(r2.pilT) + ', curseur ' + ms(r2.pilV) + ', fenêtre ' + ms(r2.fen) + ', distant ' + ms(r2.dist) + ', téléphone ' + ms(r2.tc));
  await capt(tl.pg, pre + '2-telephone-A-moins'); await capt(o.pg, pre + '2-pilote-A-moins'); await capt(F, pre + '2-fenetre-du-tableau-A-moins'); await capt(T.pg, pre + '2-tableau-distant-A-moins');
  const ok2 = [r2.pilT, r2.pilV, r2.fen, r2.dist, r2.tc].every(x => x != null && x <= 500) && f2 && f1 && f2.px < f1.px && d2 && d1 && d2.px < d1.px;
  verif(mode, ok2, 'A− au téléphone : le curseur d’un cran plus bas, la fenêtre et le distant plus petits, le téléphone dit le même cran — chacun en moins de 0,5 s', r2);
  if (ancien) { await fin(mode, test, o, F, T, tl); return; }
  /* le curseur bougé au pilote, à la souris : le téléphone montre le même cran (et le pilote reprend la main : A− A+ grisés au téléphone, leur raison) */
  const v3 = Math.min(4, t0 + 2); const TR = process.env.MJPC_TRACE ? await traceDebut(tl) : null; const tc0 = Date.now(); const r3 = await suivreZ(o, F, T, tl, () => curseurA(o.pg, v3), v3);
  if (TR) await traceFin(tl, TR, tc0);
  const z3 = await pilZ(o.pg), c3 = await tcZ(tl);
  dire('      le curseur du pilote à la souris sur le cran ' + v3 + ' : ' + fmt(z3, await tabZ(F), await tabZ(T.pg), c3)); dire('         depuis le clic : pilote ' + ms(r3.pilT) + ', fenêtre ' + ms(r3.fen) + ', distant ' + ms(r3.dist) + ', téléphone ' + ms(r3.tc));
  await capt(tl.pg, pre + '3-telephone-curseur-du-pilote'); await capt(o.pg, pre + '3-pilote-curseur');
  verif(mode, r3.fen != null && r3.fen <= 500 && r3.dist != null && r3.dist <= 1000 && r3.tc != null && r3.tc <= 1000, 'le curseur bougé au pilote : la fenêtre du tableau montre le cran en moins de 0,5 s ; le distant et le téléphone, le même cran en moins d’1 s (ce délai, un geste du pilote vers les autres appareils, est celui de ⑯ : mesuré, dit)', r3);
  /* les bornes : la télécommande reprend la main, puis A− jusqu'au plus petit, A+ jusqu'au plus grand */
  await tcTap(tl, '#tc-bas button[data-a="main"]'); await p(900);
  for (let k = 0; k < 5; k++) { const c = await tcZ(tl); if (!c || c.moins.dis) break; await tapZ(tl, 't-moins'); await p(450); }
  await p(400); const zb0 = await pilZ(o.pg), cb0 = await tcZ(tl); await capt(tl.pg, pre + '4-telephone-le-plus-petit'); await capt(o.pg, pre + '4-pilote-le-plus-petit');
  dire('      le plus petit : ' + fmt(zb0, await tabZ(F), await tabZ(T.pg), cb0) + ' · A− ' + (cb0 && cb0.moins.dis ? 'grisé' : 'PAS grisé') + ', écrit à l’écran : « ' + (cb0 ? cb0.ecrit : '—') + ' »');
  const tav0 = zb0 && zb0.t; await tapZ(tl, 't-moins'); await p(600); const zb0b = await pilZ(o.pg);
  verif(mode, !!(zb0 && zb0.t === 0 && zb0.v === 0 && cb0 && cb0.moins.dis && !cb0.plus.dis && /plus petit/.test(cb0.ecrit) && zb0b && zb0b.t === tav0), 'le plus petit cran : A− grisé, sa raison écrite à l’écran du téléphone ; un appui n’y fait rien', cb0 && { ecrit: cb0.ecrit, moins: cb0.moins });
  for (let k = 0; k < 5; k++) { const c = await tcZ(tl); if (!c || c.plus.dis) break; await tapZ(tl, 't-plus'); await p(450); }
  await p(400); const zb4 = await pilZ(o.pg), cb4 = await tcZ(tl); await capt(tl.pg, pre + '5-telephone-le-plus-grand'); await capt(o.pg, pre + '5-pilote-le-plus-grand'); await capt(F, pre + '5-fenetre-du-tableau-le-plus-grand'); await capt(T.pg, pre + '5-tableau-distant-le-plus-grand');
  dire('      le plus grand : ' + fmt(zb4, await tabZ(F), await tabZ(T.pg), cb4) + ' · A+ ' + (cb4 && cb4.plus.dis ? 'grisé' : 'PAS grisé') + ', écrit à l’écran : « ' + (cb4 ? cb4.ecrit : '—') + ' »');
  const tav4 = zb4 && zb4.t; await tapZ(tl, 't-plus'); await p(600); const zb4b = await pilZ(o.pg);
  verif(mode, !!(zb4 && zb4.t === 4 && zb4.v === 4 && cb4 && cb4.plus.dis && !cb4.moins.dis && /plus grand/.test(cb4.ecrit) && zb4b && zb4b.t === tav4), 'le plus grand cran : A+ grisé, sa raison écrite à l’écran du téléphone ; un appui n’y fait rien', cb4 && { ecrit: cb4.ecrit, plus: cb4.plus });
  /* qui a la main : l'ordinateur la prend par un geste ; A− A+ grisés, la raison ; un appui n'y fait rien */
  await gesteClic(o.pg); let g = null; for (let i = 0; i < 30; i++) { const c = await tcZ(tl); if (c && c.moins.dis && c.plus.dis && /désactivée/.test(c.moins.title)) { g = c; break; } await p(100); }
  const tav = await pilZ(o.pg); await tapZ(tl, 't-moins'); await p(900); const tap = await pilZ(o.pg); await capt(tl.pg, pre + '6-telephone-sans-la-main');
  verif(mode, !!g && tav && tap && tav.t === tap.t, 'qui a la main : l’ordinateur la reprend, A− A+ grisés au téléphone, un appui n’y fait rien', { g: !!g, avant: tav && tav.t, apres: tap && tap.t });
  await fin(mode, test, o, F, T, tl); };
const fin = async (mode, test, o, F, T, tl) => { verifEcritures(mode, test); sansErreur(mode, [].concat(o.errs, o.boites, tl.errs, tl.boites, T.errs, T.boites), 'le pilote, la fenêtre du tableau, la télécommande, le tableau distant');
  verif(mode, !REFUSES.length, 'aucune écriture refusée par le faux hub (' + REFUSES.length + ')', REFUSES.slice(0, 3));
  for (const x of [tl, T, o]) await x.ctx.close().catch(() => {}); };
/* MJPC_TRACE=1 : la ligne de temps du curseur bougé au pilote — l'état vivant écrit au hub par le pilote, reçu, posé et redit par le téléphone (heures de Node) */
const traceDebut = async tl => { const off = (await tl.pg.evaluate(() => Date.now())) - Date.now(); await tl.pg.evaluate(() => { window.__tr = []; const w = (n, f) => { const g = window[n]; if (typeof g !== 'function') return; window[n] = function () { window.__tr.push([n + ' début', Date.now()]); const r = g.apply(this, arguments); window.__tr.push([n + ' fin', Date.now()]); return r; }; };
  ['dr_sesRecu', 'dr_sesAppliquer', 'dr_sesPoserAutour', 'dr_tcMaj', 'dr_tout'].forEach(n => w(n)); }); return { off, k0: ECR.length }; };
const traceFin = async (tl, TR, tc0) => { const t = await tl.pg.evaluate(() => window.__tr || []).catch(() => []);
  dire('         (trace) au hub : ' + ECR.slice(TR.k0).filter(x => /\/vif$|\/scene$/.test(x.c)).map(x => x.qui + ' ' + x.c.split('/').slice(-1)[0] + ' +' + (x.t - tc0)).join(' · '));
  dire('         (trace) au téléphone : ' + t.map(([n, x]) => n + ' +' + (x - TR.off - tc0)).join(' · ').slice(0, 1500)); };
const CRANS_L = ['26 pt', '32 pt', '38 pt', '44 pt', '52 pt']; const DIAPO_Z = 'emt9v3yqoecf9d';

const NOMV = process.env.MJPC_NOM || 'v';
const PZ = String(process.env.MJPC_PARTIES || 'H,T').split(',').map(x => x.trim());
for (const m of ['H', 'T', 'A']) if (PZ.includes(m)) { if (m === 'A' && !ANCIEN) { dire('— A : MJPC_ANCIEN manquant, pas jouée'); continue; } await pz(FICHIER, m); }
dire('\n' + nb + ' vérifications, ' + echecs + ' échec(s)' + (mnb ? ' · mesures ' + mnb + ', ROUGES ' + mrouges : ''));
fs.writeFileSync(path.join(OUT, 'sonde-zoom-' + NOMV + '.txt'), R.join('\n') + '\n');
await nav.close();
process.exit(echecs ? 1 : 0);
