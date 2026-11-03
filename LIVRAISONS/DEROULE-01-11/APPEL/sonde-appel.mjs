// LA SONDE DE L'APPEL (MANDATS/DEROULE-01-11/MANDAT-APPEL.md §1.2 et §4, ㊱) — par le geste, sous le faux hub RANGÉ COMME LE VRAI, qui REFUSE (HTTP 400) les clés
// interdites et qui POUSSE son flux (EventSource) : le harnais de SESSION-PARTOUT/sonde-session.mjs, repris tel quel (plus RETARD : une lecture rendue plus tard).
// Aucune écriture ni lecture du vrai hub. Aucun nom d'élève dans ce qui sort (« ÉLÈVE n » : son rang dans la liste de la classe).
// usage : node sonde-appel.mjs <assemble/index.html> [dossier-de-sortie]
//   MJPC_PARTIES=M,P1H,P1T,P2H,P2T,P3H,P3T,P4,Q,QT,X,XT,Z,ZT ; MJPC_V879=<la 8.79.0-⑫ assemblée, md5 3cd597e8…> (P4) ; MJPC_CAPT ; MJPC_MEDIAS ; MJPC_NOM
//  M  l'existant (mission 0) : un absent au clic droit du pilote est-il dans la case ? un absent coché / défait dans la case arrive-t-il au pilote ? le défaut 6
//     (un absent coché dans la case pendant l'écriture du paquet de l'heure, effacé au hub — la lecture du pilote rendue 1,5 s plus tard, un réseau lent)
//  P1 la case d'une heure à venir : l'appel d'abord ; 2 absents ; un clic défait ; (vraie heure) un rechargement, un second ordinateur, la case sur deux ordinateurs ;
//     lancer : « … sur 27 présents » dès la première diapo ; au hub la liste de l'heure, l'appel d'avant retiré     (H vraie heure, T mode test)
//  P2 pendant l'heure : la télécommande (« Appel »), un second ordinateur (clic droit), la case d'un troisième (vraie heure) ; chacun le dit en moins de 2 s ;
//     qui a la main ; au hub une seule liste ; rien de l'appel au tableau (le tableau distant, la fenêtre du tableau)
//  P3 après coup : une heure close sans appel, deux absents cochés dans la case, la Relecture ; un défait
//  P4 une heure jouée par la 8.79.0-⑫ (lignes « appel » sans élève, absents du pilote et de la case), relue par cette version
//  Q  la télécommande (ajout de la conscience, Paul 22:18-22:22) : la diapo dessinée comme au pilote (les gris comptés), aucun geste dessus ; A+ puis A−
//     au pilote et au tableau en moins de 0,5 s ; grisés quand l'ordinateur a la main     (Q vraie heure, QT mode test)
//  X  deux gestes d'appel croisés à moins de 100 ms (la case avant l'heure, le pilote, la télécommande, un second ordinateur, la case pendant l'heure) :
//     deux élèves, aucun ne se perd ; un même élève, le dernier geste compte ; au hub et sur chaque appareil     (X vraie heure, XT mode test)
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-correctifs.mjs <index.html> [dossier]'); process.exit(2); }
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
dire('C16 · sonde de l’appel (㊱) · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400), avec son flux (EventSource) · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

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
/* C16 367 (le banc à la vraie horloge) : MJPC_HORLOGE=date — seule la date des appareils est décalée (le 14/09, 09:00 au lancement de la sonde, elle avance, la même
   pour tous) ; les minuteries, les images (`requestAnimationFrame`) et `performance` restent ceux du navigateur. L'horloge simulée de Playwright (`page.clock`)
   remplace aussi setTimeout, setInterval, requestAnimationFrame et performance, et exécute toutes les minuteries échues d'une page à la suite dans une seule tâche
   (playwright-core, clockSource : `_runTo`) : mesuré, elle fausse les temps (FRAPPE-TABLEAU/NOTE.md de `deroule/frappe-tableau`, non poussée ; C16 334, 336).
   Sans la variable : inchangé. */
const fauxDate = off => { const RD = Date; function FD(...a) { if (!(this instanceof FD)) return new RD(RD.now() + off).toString(); return a.length ? new RD(...a) : new RD(RD.now() + off); }
  FD.prototype = RD.prototype; FD.now = () => RD.now() + off; FD.parse = RD.parse; FD.UTC = RD.UTC; try { Object.defineProperty(FD, 'name', { value: 'Date' }); } catch (e) {} window.Date = FD; };
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
  if (process.env.MJPC_HORLOGE === 'date') await ctx.addInitScript(fauxDate, t09 - T0REEL + decal);
  const pg = await ctx.newPage(); if (process.env.MJPC_HORLOGE === 'figee') await pg.clock.setFixedTime(new Date(t09)); else if (process.env.MJPC_HORLOGE !== 'date') await pg.clock.install({ time: new Date(t09 + (Date.now() - T0REEL) + decal) });   /* les montres de tous les appareils avancent ensemble, à l'heure, comme des appareils réglés sur l'heure du réseau */
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

/* ═══ M · LA MESURE DE L'EXISTANT (mission 0, §1.2) : vraie heure ; un ordinateur lance ; un second ordinateur ouvre la case de l'heure en cours ═══ */
const mesure = async fichier => { reset(); const k = 'M', pre = 'appel-' + NOMV + '-M-';
  dire('\n— M · l’existant : où se fait l’appel, les deux listes, ce que voient les autres appareils (vraie heure) —');
  const o = await ouvrir({ fichier, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); for (let i = 0; i < 2; i++) { await gesteClic(o.pg); await p(300); }
  verif(k, lance, 'l’ordinateur lance l’heure');
  const o2 = await ouvrir({ fichier, qui: 'ordinateur2', W: 1366, H: 768 }); await caseOuvrir(o2.pg); const c0 = await caseEtat(o2.pg);
  dire('      la case de l’heure en cours (second ordinateur) : « ' + (c0 ? c0.lab : '—') + ' » · ' + (c0 ? c0.els : 0) + ' noms · ' + (c0 ? extr(c0.t, /Heure jouée|Pas encore close/, 120) : ''));
  /* M1 : au pilote, clic droit → Absent ; la liste de la case (au hub, et la case de l'autre ordinateur) */
  const cd = await clicDroit(o.pg, A); const sA = await slugDe(o.pg, A);
  const tHub = await quand(async () => { const h = heureHub().h; return listeDe(h).includes(sA); }, 2500);
  const tCase = await quand(async () => { const c = await caseEtat(o2.pg); return !!(c && c.abs.includes(A)); }, 2500);
  dire('      M1 · au pilote, clic droit → « Absent » (' + (cd ? 'fait' : 'PAS FAIT') + ') : au pilote ' + (await nbAbsents(o.pg)) + ' absent(s), « ' + (await presentsDe(o.pg)) + ' » ; au hub, la liste de l’heure ' + listeDe(heureHub().h).length + ' élève(s) (' + ms(tHub) + ') ; la case du second ordinateur ' + ms(tCase));
  verif(k, cd && tHub != null && tCase != null, 'M1 · un absent marqué au pilote est dans la liste de la case : au hub et dans la case ouverte sur un autre ordinateur, en ≤ 2 s', { tHub, tCase });
  await capt(o2.pg, pre + '1-case-apres-clic-droit');
  /* M2 : dans la case, un absent coché → au pilote */
  await caseClic(o2.pg, B); const tB = await quand(async () => !!(await absentAu(o.pg, B)), 2000);
  let tB16 = tB; if (tB == null) tB16 = await quand(async () => !!(await absentAu(o.pg, B)), 15000);
  dire('      M2 · dans la case, ' + 'un élève coché absent : au pilote ' + (tB != null ? 'en ' + tB + ' ms' : (tB16 != null ? 'après ' + (2000 + tB16) + ' ms (la relecture toutes les 15 s)' : 'jamais (17 s)')) + ' ; « ' + (await presentsDe(o.pg)) + ' »');
  verif(k, tB != null, 'M2 · un absent coché dans la case paraît au pilote en ≤ 2 s', { tB, tB16 });
  /* M3 : dans la case, le même défait → au pilote */
  await caseClic(o2.pg, B); const tB2 = await quand(async () => (await absentAu(o.pg, B)) === false, 2000); let tB2l = tB2; if (tB2 == null) tB2l = await quand(async () => (await absentAu(o.pg, B)) === false, 15000);
  dire('      M3 · dans la case, le même élève défait : au pilote ' + (tB2 != null ? 'en ' + tB2 + ' ms' : (tB2l != null ? 'après ' + (2000 + tB2l) + ' ms' : 'jamais (17 s) : il reste absent')) + ' ; au hub ' + listeDe(heureHub().h).length + ' élève(s)');
  verif(k, tB2 != null, 'M3 · un absent défait dans la case est défait au pilote en ≤ 2 s', { tB2, tB2l });
  /* M4 : le défaut 6 — le paquet de l'heure écrit pendant qu'un absent est coché dans la case (la lecture du pilote rendue 1,5 s plus tard : un réseau lent) */
  const sC = await slugDe(o.pg, C); RETARD = { qui: 'ordinateur', re: /\/heures\/[^/]+\/absents$/, ms: 2500, n: 0 };
  await gesteClic(o.pg); const tl0 = await quand(async () => RETARD.n > 0, 4000);   /* la lecture de H/absents par le pilote est partie (avant d'écrire le paquet) : on coche pendant qu'elle attend */
  await caseClic(o2.pg, C); await p(500); const juste = listeDe(heureHub().h); await p(4500);
  const apres = listeDe(heureHub().h); const nLect = RETARD.n || 0; RETARD = null;
  const ecrH = ECR.filter(x => x.qui === 'ordinateur' && /\/heures\/[^/]+$/.test(x.c)).map(x => x.m);
  dire('      M4 · un geste au pilote ; ' + (tl0 != null ? 'sa lecture de H/absents partie ' + tl0 + ' ms après (le paquet suit)' : 'AUCUNE lecture de H/absents par le pilote en 4 s (le paquet ne la relit pas)') + ' ; pendant ce temps, un élève coché dans la case : au hub 0,5 s après ' + JSON.stringify(juste.includes(sC)) + ' ; 4,5 s après : ' + (apres.includes(sC) ? 'toujours là' : 'EFFACÉ par le paquet') + ' (lectures retardées de H/absents par le pilote : ' + nLect + ' ; écritures du paquet : ' + [...new Set(ecrH)].join('/') + ')');
  verif(k, juste.includes(sC) && apres.includes(sC), 'M4 · défaut 6 : un absent coché dans la case pendant l’écriture du paquet de l’heure reste au hub', { juste: juste.includes(sC), apres: apres.includes(sC) });
  await capt(o.pg, pre + '4-pilote');
  verifEcritures(k, false); sansErreur(k, [].concat(o.errs, o.boites, o2.errs, o2.boites), 'le pilote et le second ordinateur');
  await o2.ctx.close(); await o.ctx.close(); };

/* ═══ P1 · LA CASE D'UNE HEURE À VENIR : L'APPEL D'ABORD (§4.1) ═══ */
const p1 = async (fichier, mode) => { const test = mode === 'P1T'; reset(); const pre = 'appel-' + NOMV + '-' + mode + '-';
  dire('\n— ' + mode + ' · la case d’une heure à venir : l’appel d’abord (' + (test ? 'mode test' : 'vraie heure') + ') —');
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); const pg = o.pg;
  await caseOuvrir(pg); const c0 = await caseEtat(pg); await capt(pg, pre + '1a-case-appel');
  dire('      la case : « ' + (c0 ? court(c0.t, 420) : '—') + ' »');
  verif(mode, !!(c0 && /L’appel — absents \(0 sur 29\)/.test(c0.t) && c0.t.indexOf('L’appel') >= 0 && c0.t.indexOf('L’appel') < c0.t.indexOf('Ouvrir le pilotage')), 'la case d’une heure à venir s’ouvre sur l’appel, avant « Ouvrir le pilotage et lancer »', c0 && extr(c0.t, /L’appel|Absents/, 100));
  for (const nom of [A, B]) { await caseClic(pg, nom); await p(900); }
  const c1 = await caseEtat(pg); await capt(pg, pre + '1b-case-2-absents');
  verif(mode, !!(c1 && c1.n === 2 && c1.abs.length === 2 && c1.btn.some(b => /appel fait : 2 absents/.test(b))), 'deux clics : 2 absents ; le bouton dit « appel fait : 2 absents »', c1 && { lab: c1.lab, btn: c1.btn.find(b => /Ouvrir le pilotage/.test(b)) });
  await caseClic(pg, B); await p(900); const c2 = await caseEtat(pg); await caseClic(pg, B); await p(900); const c3 = await caseEtat(pg);
  verif(mode, !!(c2 && c2.n === 1 && c3 && c3.n === 2), 'un clic défait, un clic remarque', [c2 && c2.lab, c3 && c3.lab]);
  if (!test) {
    const av = avantHub(); dire('      au hub, avant le lancement : ' + (av.length ? av.map(x => x.ch + ' = ' + x.v.length + ' élève(s)').join(' ; ') : 'rien'));
    await pg.reload({ waitUntil: 'load' }).catch(() => {}); await p(1800); await profPrep(pg, false); await caseOuvrir(pg); const c4 = await caseEtat(pg);
    const o2 = await ouvrir({ fichier, qui: 'ordinateur2', W: 1366, H: 768 }); await caseOuvrir(o2.pg); const c5 = await caseEtat(o2.pg); await capt(o2.pg, pre + '1c-second-ordinateur');
    verif(mode, !!(c4 && c4.n === 2 && c5 && c5.n === 2 && JSON.stringify(c4.abs) === JSON.stringify(c1.abs) && JSON.stringify(c5.abs) === JSON.stringify(c1.abs)), 'avant le lancement : l’appel survit à un rechargement, et un second ordinateur le voit', [c4 && c4.lab, c5 && c5.lab]);
    await caseClic(o2.pg, C); const t1 = await quand(async () => { const e = await caseEtat(pg); return !!(e && e.n === 3 && e.abs.includes(C)); });
    await caseClic(o2.pg, C); const t2 = await quand(async () => { const e = await caseEtat(pg); return !!(e && e.n === 2); });
    dire('      la case ouverte sur deux ordinateurs : un élève marqué sur le second paraît sur le premier en ' + ms(t1) + ', son retrait en ' + ms(t2));
    verif(mode, t1 != null && t2 != null, 'avant l’heure, la case ouverte sur deux ordinateurs : un marquage et son retrait paraissent sur l’autre en moins de 2 s, sans recharger', [t1, t2]);
    sansErreur(mode, [].concat(o2.errs, o2.boites), 'le second ordinateur'); await o2.ctx.close();
  }
  const l = await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape').catch(() => {}); await p(1500); await garde(pg);
  const pr = await presentsDe(pg); const nb = await nbAbsents(pg); await capt(pg, pre + '1d-premiere-diapo');
  dire('      lancée : « ' + pr + ' » · ' + nb + ' absent(s) au pilote · ' + ((await texteDe(pg, '#numero')) || '').slice(0, 80));
  verif(mode, !!(l && nb === 2 && /sur 27 présents/i.test(pr || '')), 'lancée : « … sur 27 présents » dès la première diapo, les 2 absents de l’appel', { pr, nb });
  if (!test) { await p(1500); const sl = [await slugDe(pg, A), await slugDe(pg, B)].sort(); const h = heureHub(); const ab = listeDe(h.h); const av = avantHub();
    dire('      au hub : H/absents ' + JSON.stringify(ab.length) + ' élève(s) ; l’appel d’avant l’heure : ' + (av.length ? 'encore là' : 'retiré'));
    verif(mode, JSON.stringify(ab) === JSON.stringify(sl) && !av.length, 'au hub : la liste de l’heure porte les 2 absents ; l’appel d’avant l’heure est retiré', { ab: ab.length, av: av.length }); }
  else { const st = await pg.evaluate(() => { try { return JSON.stringify(M8T.arbre()).length; } catch (e) { return 0; } }).catch(() => 0); dire('      mode test : le magasin de la page porte ' + st + ' caractères ; le hub n’a rien reçu hors /site/tableau_test'); }
  /* « Annuler cette heure » (la conscience, 23:40) : l'appel fait avant l'heure revient dans la case de cette heure */
  const an = await pg.evaluate(() => { const b = document.getElementById('dr-annul'); if (!b || b.offsetParent === null) return false; b.click(); return true; }).catch(() => false); await p(600);
  const an2 = await pg.evaluate(() => { const b = document.getElementById('gannul-oui'); if (!b) return false; b.click(); return true; }).catch(() => false); await p(3500); await pg.keyboard.press('Escape').catch(() => {}); await p(400);
  await pg.evaluate(() => { try { edtFermer(); } catch (e) {} }).catch(() => {}); await p(400); await caseOuvrir(pg); const ca = await caseEtat(pg); await capt(pg, pre + '1e-annulee-appel-revenu');
  const avA = test ? null : avantHub();
  dire('      « Annuler cette heure » (' + (an && an2 ? 'fait' : 'PAS FAIT') + ') : la case « ' + (ca ? ca.lab : '—') + ' »' + (test ? '' : ' ; au hub, l’appel d’avant l’heure : ' + (avA.length ? avA[0].v.length + ' élève(s)' : 'rien')));
  verif(mode, !!(an && an2 && ca && ca.n === 2 && JSON.stringify(ca.abs) === JSON.stringify(c1.abs) && (test || (avA.length === 1 && avA[0].v.length === 2))), '« Annuler cette heure » : l’appel fait avant l’heure revient dans la case (les 2 mêmes absents' + (test ? '' : ', au hub aussi') + ')', { lab: ca && ca.lab });
  verifEcritures(mode, test); sansErreur(mode, [].concat(o.errs, o.boites), 'l’ordinateur'); await o.ctx.close(); };

/* ═══ P2 · PENDANT L'HEURE, PARTOUT (§4.2, §4.5) : l'ordinateur, la télécommande, un second ordinateur (qui reprend l'heure), la case d'un troisième (vraie heure),
   le tableau distant et la fenêtre du tableau ═══ */
const p2 = async (fichier, mode) => { const test = mode === 'P2T'; reset(); const pre = 'appel-' + NOMV + '-' + mode + '-';
  dire('\n— ' + mode + ' · pendant l’heure, sur chaque appareil (' + (test ? 'mode test' : 'vraie heure') + ') —');
  const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(800);
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); for (let i = 0; i < 2; i++) { await gesteClic(o.pg); await p(300); }
  const fen = test ? null : await ouvrirTableau(o);
  const tl = await ouvrirTelecommande(o, fichier, test);
  const o2 = await ouvrir({ fichier, test: false, qui: 'ordinateur2', W: 1366, H: 768 }); const rep = await reprendre(o2);
  const o3 = test ? null : await ouvrir({ fichier, qui: 'ordinateur3', W: 1366, H: 768 }); if (o3) await caseOuvrir(o3.pg);
  verif(mode, lance && !!tl && rep, 'l’heure lancée ; la télécommande (QR) et le second ordinateur (« Reprendre ») sur la séance' + (o3 ? ' ; la case de l’heure ouverte sur un troisième' : ''), { lance, tl: !!tl, rep });
  if (!tl) { await T.ctx.close(); await o.ctx.close(); await o2.ctx.close(); if (o3) await o3.ctx.close(); return; }
  const pilotes = [['ordinateur', o.pg], ['second', o2.pg], ['télécommande', tl.pg]];
  const suivre2 = async (nom, absent) => { const r = {}; await Promise.all(pilotes.map(async ([n, pg]) => { r[n] = await quand(async () => (await absentAu(pg, nom)) === absent, 2000); }).concat(o3 ? [(async () => { r.case = await quand(async () => { const c = await caseEtat(o3.pg); return !!(c && c.abs.includes(nom) === absent); }, 2000); })()] : [])); return r; };
  const tous = r => Object.values(r).every(x => x != null && x <= 2000);
  /* a · la télécommande : « Appel », un élève marqué absent */
  const bt = await tl.pg.evaluate(() => { const b = document.querySelector('#tc-bas button[data-a="appel"]'); return b ? { t: (b.innerText || '').replace(/\s+/g, ' ').trim(), title: b.title } : null; }).catch(() => null);
  const ouvert = await tcAppelOuvrir(tl); const nbNoms = await tl.pg.evaluate(() => document.querySelectorAll('#tc-bas button[data-a="abs"]').length).catch(() => 0); await capt(tl.pg, pre + '2a-telecommande-appel');
  verif(mode, !!(bt && /Appel/.test(bt.t) && bt.title && ouvert && nbNoms === 29), 'la télécommande : le bouton « Appel » (son infobulle) ouvre la liste de la classe, les 29 noms en entier', { bt, nbNoms });
  let trace = null; if (process.env.MJPC_DEBUG) { await tl.pg.evaluate(s => { window.__tr = []; const t0 = performance.now(); const f = () => { const b = document.querySelector(s); window.__tr.push([Math.round(performance.now() - t0), b ? (b.classList.contains('abs') ? 'abs' : '-') : 'x', DR_SES.appui ? 'appui' : '', (typeof absentA === 'function' && absentA(b && b.dataset.e)) ? 'A' : 'p', DR_TC.appel ? 'liste' : 'ferme']); if (performance.now() - t0 < 1500) setTimeout(f, 25); }; f(); }, tcSel(A)).catch(() => {}); }
  if (ouvert) await tcTap(tl, tcSel(A)); const ra = await suivre2(A, true);
  if (process.env.MJPC_DEBUG) { await p(1600); trace = await tl.pg.evaluate(() => window.__tr.filter((x, i, l) => !i || x.slice(1).join() !== l[i - 1].slice(1).join()).map(x => x.join(' ')).join(' | ')).catch(e => String(e)); dire('      (débogage) le bouton de la télécommande après l’appui : ' + trace); }
  const tBtn = await quand(async () => !!(await tl.pg.evaluate(s => { const b = document.querySelector(s); return !!(b && b.classList.contains('abs')); }, tcSel(A)).catch(() => false)), 2000); const etatTc = tBtn != null;   /* le bouton de la télécommande lui-même, compté (≤ 2 s) */
  dire('      a · à la télécommande, un élève marqué absent : l’ordinateur ' + ms(ra.ordinateur) + ', le second ordinateur ' + ms(ra.second) + ', la télécommande ' + ms(ra['télécommande']) + (o3 ? ', la case du troisième ' + ms(ra.case) : '') + ' ; son bouton ' + (etatTc ? 'marqué absent (' + tBtn + ' ms après les appareils)' : 'PAS marqué (2 s)') + ' ; l’ordinateur « ' + (await presentsDe(o.pg)) + ' »');
  verif(mode, ouvert && tous(ra) && etatTc === true && /sur 28 présents/i.test((await presentsDe(o.pg)) || ''), 'a · marqué à la télécommande : chaque appareil le dit en moins de 2 s, le compteur « … sur 28 présents »', ra);
  await capt(o.pg, pre + '2a-ordinateur'); if (o3) await capt(o3.pg, pre + '2a-case');
  /* b · au second ordinateur, clic droit → Absent : il prend la main ; la télécommande est désactivée, son appel grisé dit pourquoi, un appui n'y fait rien */
  const cd = await clicDroit(o2.pg, B); const rb = await suivre2(B, true);
  let desact = null; for (let i = 0; i < 30; i++) { const t = await texteDe(tl.pg, '#tc-bas .desact'); if (t && /Télécommande désactivée/.test(t)) { desact = t; break; } await p(100); }
  if (!(await tl.pg.$('#tc-bas button[data-a="abs"]'))) await tcAppelOuvrir(tl);
  const grises = await tl.pg.evaluate(() => { const l = Array.from(document.querySelectorAll('#tc-bas button[data-a="abs"]')); return l.length > 0 && l.every(b => b.disabled && /désactivée/.test(b.title)); }).catch(() => false);
  await tcTap(tl, tcSel(C)); await p(1200); const cSans = (await absentAu(o.pg, C)) === false && (await absentAu(tl.pg, C)) === false;
  await capt(tl.pg, pre + '2b-telecommande-desactivee'); await capt(o2.pg, pre + '2b-second-ordinateur');
  dire('      b · au second ordinateur, clic droit → « Absent » (' + (cd ? 'fait' : 'PAS FAIT') + ') : l’ordinateur ' + ms(rb.ordinateur) + ', la télécommande ' + ms(rb['télécommande']) + (o3 ? ', la case ' + ms(rb.case) : '') + ' ; la télécommande « ' + desact + ' », l’appel grisé avec sa raison : ' + grises + ' ; un appui grisé ' + (cSans ? 'sans effet' : 'A MARQUÉ un absent'));
  verif(mode, cd && tous(rb), 'b · marqué au clic droit d’un second ordinateur : chaque appareil le dit en moins de 2 s', rb);
  verif(mode, !!desact && grises && cSans, 'b · qui a la main : la télécommande désactivée, chaque nom de l’appel grisé dit pourquoi, un appui n’y fait rien', { desact: !!desact, grises, cSans });
  /* c · un retrait : dans la case d'un troisième ordinateur (vraie heure) ; en mode test, à la télécommande qui reprend la main */
  let rc = null;
  if (o3) { await caseClic(o3.pg, A); rc = await suivre2(A, false); await capt(o3.pg, pre + '2c-case-retrait'); }
  else { await tcTap(tl, '#tc-bas button[data-a="main"]'); await p(600); if (!(await tl.pg.$('#tc-bas button[data-a="abs"]'))) await tcAppelOuvrir(tl); await tcTap(tl, tcSel(A)); rc = await suivre2(A, false); await capt(tl.pg, pre + '2c-telecommande-retrait'); }
  const prc = await presentsDe(o.pg);
  dire('      c · ' + (o3 ? 'dans la case du troisième ordinateur' : 'à la télécommande (« Reprendre avec la télécommande »)') + ', le premier absent retiré : l’ordinateur ' + ms(rc.ordinateur) + ', le second ' + ms(rc.second) + ', la télécommande ' + ms(rc['télécommande']) + (o3 ? ', la case ' + ms(rc.case) : '') + ' ; « ' + prc + ' »');
  verif(mode, tous(rc) && /sur 28 présents/i.test(prc || ''), 'c · retiré ' + (o3 ? 'dans la case' : 'à la télécommande') + ' : chaque appareil le dit en moins de 2 s, le compteur suit', rc);
  await capt(o.pg, pre + '2c-ordinateur');
  if (!test) { await p(2500); const sB = await slugDe(o.pg, B); const ab = listeDe(heureHub().h);
    dire('      d · au hub, la liste de l’heure : ' + ab.length + ' élève(s) (' + (ab.length === 1 && ab[0] === sB ? 'celui du second ordinateur' : 'PAS la bonne') + ') ; ' + ECR.filter(x => /\/heures\/[^/]+$/.test(x.c)).length + ' écritures du paquet');
    verif(mode, ab.length === 1 && ab[0] === sB, 'd · au hub, une seule liste : celle que disent tous les appareils (après les écritures du paquet)', ab.length); }
  /* f · (vraie heure) une saisie en cours chez celui qui a la main n'est jamais touchée : le second ordinateur écrit la réponse d'un élève à « Question-bilan » ;
     pendant qu'il tape, un élève est coché dans la case du troisième ; le champ garde la frappe entière, puis, le champ quitté, chaque appareil le dit */
  if (o3) { await allerA(o2.pg, QB); await toutDevoiler(o2.pg, QB); await p(800); const dits = await o2.pg.$$('#mur .rep .dit'); const dit = dits.length ? dits[dits.length - 1] : null; let rf = null, garde1 = null;
    if (dit) { await dit.click(); await p(250); await o2.pg.keyboard.type('Le paysage ', { delay: 60 }); await caseClic(o3.pg, C); await o2.pg.keyboard.type('romantique', { delay: 60 }); await p(1200);
      garde1 = await o2.pg.evaluate(() => { const a = document.activeElement; return { ed: !!(a && a.isContentEditable), t: a ? (a.innerText || '').trim() : '' }; }).catch(() => null);
      await o2.pg.keyboard.press('Escape'); rf = await suivre2(C, true); }
    await capt(o2.pg, pre + '2f-saisie-gardee');
    dire('      f · le second ordinateur tape une réponse ; pendant la frappe, un élève coché dans la case : le champ ' + (garde1 && garde1.ed ? 'garde le focus' : 'A PERDU le focus') + ', sa frappe « ' + (garde1 ? garde1.t : '—') + ' » ; le champ quitté : l’ordinateur ' + ms(rf && rf.ordinateur) + ', le second ' + ms(rf && rf.second) + ', la télécommande ' + ms(rf && rf['télécommande']));
    verif(mode, !!(dit && garde1 && garde1.ed && /Le paysage romantique/.test(garde1.t) && rf && tous(rf)), 'f · une saisie en cours n’est jamais touchée par un appel fait ailleurs ; le champ quitté, chaque appareil le dit en moins de 2 s', { garde1, rf }); }
  /* e · rien de l'appel au tableau */
  const tp = await tableauPropre(T.pg), fp = await tableauPropre(fen); await capt(T.pg, pre + '2e-tableau-distant'); if (fen) await capt(fen, pre + '2e-fenetre-du-tableau');
  dire('      e · au tableau distant : ' + (tp ? tp.n : '—') + ' occurrence(s) de l’appel' + (fen ? ' ; à la fenêtre du tableau : ' + (fp ? fp.n : '—') : ''));
  verif(mode, !!(tp && tp.n === 0 && (!fen || (fp && fp.n === 0))), 'e · rien de l’appel au tableau (le tableau distant' + (fen ? ', la fenêtre du tableau' : '') + ') : 0 nom, 0 « absent », 0 « présents »', { tp, fp });
  verifEcritures(mode, test); sansErreur(mode, [].concat(o.errs, o.boites, o2.errs, o2.boites, tl.errs, tl.boites, T.errs, T.boites, o3 ? o3.errs.concat(o3.boites) : []), 'tous les appareils');
  for (const x of [tl, o2, o3, T, o]) if (x) await x.ctx.close().catch(() => {}); };

/* ═══ P3 · APRÈS COUP (§4.3) : une heure close sans appel ; deux absents cochés dans la case ; la Relecture ; puis un défait ═══ */
const p3 = async (fichier, mode) => { const test = mode === 'P3T'; reset(); const pre = 'appel-' + NOMV + '-' + mode + '-';
  dire('\n— ' + mode + ' · l’appel fait après coup, dans la case d’une heure close (' + (test ? 'mode test' : 'vraie heure') + ') —');
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); const pg = o.pg; const lance = await lancerClasse(o); await garde(pg);
  for (let i = 0; i < 3; i++) { await gesteClic(pg); await p(350); await garde(pg); }
  await allerA(pg, QB); await toutDevoiler(pg, QB);   /* « Question-bilan » : la question posée et dévoilée (le récit dit alors son bilan, et les présents) */
  const pa = await participation(pg, D); await p(500); await clore(pg); await pg.keyboard.press('Escape').catch(() => {}); await p(600);
  verif(mode, lance && pa, 'une heure lancée, une prise de parole, close sans appel', { lance, pa });
  await caseOuvrir(pg); const c0 = await caseEtat(pg); for (const nom of [A, B]) { await caseClic(pg, nom); await p(1400); } const c1 = await caseEtat(pg); await capt(pg, pre + '3a-case-close-2-absents');
  dire('      la case close : « ' + (c0 ? c0.lab : '—') + ' » → « ' + (c1 ? c1.lab : '—') + ' »');
  const r1 = await relireDepuisLaCase(pg); const RL = await lireRelecture(pg, pre + '3b-relecture'); const rel = RL.recit + ' ‖ ' + RL.passe; const ap = appelDe(RL.passe);
  dire('      la Relecture : « ' + extr(RL.recit, /présents/, 60) + ' » · L’APPEL : « ' + court(ap, 220) + ' » · « ' + extr(RL.recit, /Le mot pour chaque absent/i, 60) + ' »');
  const nA = [A, B].filter(n => ap.indexOf(n.split(/\s+/).slice(-1)[0]) >= 0 || ap.indexOf(n) >= 0).length;
  verif(mode, !!(c1 && c1.n === 2 && r1 && /1 élève sur 27 présents/i.test(RL.recit) && nA === 2 && !/tous présents/i.test(ap)), 'après coup : la Relecture dit « 1 élève sur 27 présents » et nomme les 2 absents à « L’APPEL »', { lab: c1 && c1.lab, presents: extr(RL.recit, /présents/, 40), nA });
  verif(mode, /Le mot pour chaque absent/i.test(RL.recit) && !/enregistré à la clôture/i.test(rel), 'le titre « Le mot pour chaque absent », sans « (enregistré à la clôture) »', extr(RL.recit, /Le mot pour/i, 80));
  await caseOuvrir(pg); await caseClic(pg, B); await p(1400); const c2 = await caseEtat(pg); await relireDepuisLaCase(pg); const RL2 = await lireRelecture(pg, pre + '3c-relecture-un-defait'); const ap2 = appelDe(RL2.passe);
  const nB = ap2.indexOf(B.split(/\s+/).slice(-1)[0]) >= 0;
  dire('      un absent défait dans la case close : « ' + (c2 ? c2.lab : '—') + ' » ; la Relecture « ' + extr(RL2.recit, /présents/, 60) + ' » · L’APPEL « ' + court(ap2, 160) + ' »');
  verif(mode, !!(c2 && c2.n === 1 && /1 élève sur 28 présents/i.test(RL2.recit) && !nB), 'un absent défait après coup : la Relecture le suit (« 1 élève sur 28 présents », il n’est plus à « L’APPEL »)', { lab: c2 && c2.lab, presents: extr(RL2.recit, /présents/, 40), nB });
  if (!test) { const ab = listeDe(heureHub().h); verif(mode, ab.length === 1 && ab[0] === await slugDe(pg, A), 'au hub, la liste de l’heure close : 1 élève', ab.length); }
  verifEcritures(mode, test); sansErreur(mode, [].concat(o.errs, o.boites), 'l’ordinateur (la Relecture comprise)'); await o.ctx.close(); };

/* ═══ P4 · UNE HEURE JOUÉE AVANT CETTE VERSION (§4.4) : jouée par la 8.79.0-⑫ — un absent au clic droit du pilote, deux cochés dans la case pendant l'heure
   (la 8.79 les recopie au pilote toutes les 15 s, avec une ligne de journal « appel » SANS élève), close ; un quatrième coché après coup ; puis cette version ═══ */
const p4 = async fichier => { const k = 'P4'; reset(); const pre = 'appel-' + NOMV + '-P4-';
  dire('\n— P4 · une heure jouée avant cette version (8.79.0-⑫), relue par celle-ci —');
  if (!V879) { verif(k, false, 'la 8.79.0-⑫ (MJPC_V879) est introuvable'); return; }
  const o = await ouvrir({ fichier: V879, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); for (let i = 0; i < 2; i++) { await gesteClic(o.pg); await p(300); }
  await allerA(o.pg, QB); await toutDevoiler(o.pg, QB); const pa = await participation(o.pg, E); const cd = await clicDroit(o.pg, D);
  const o2 = await ouvrir({ fichier: V879, qui: 'ordinateur2', W: 1366, H: 768 }); await caseOuvrir(o2.pg); for (const nom of [A, B]) { await caseClic(o2.pg, nom); await p(1000); }
  const t = await quand(async () => o.pg.evaluate(([a, b]) => [a, b].every(n => ((S.appel || {})[n] || []).some(x => x.type === 'absent')), [A, B]).catch(() => false), 17000); await p(1500);   /* la 8.79 les pose dans l'appel (sans les compter tant que l'horloge de la case n'a pas atteint la montre : le défaut 256) */
  await clore(o.pg); await p(1500); await o2.ctx.close();
  const Cc = heureHub(); const jr = lireH(Cc.C + '/journal') || []; const sansEleve = (Array.isArray(jr) ? jr : Object.values(jr)).filter(x => x && x.type === 'appel' && !x.eleve).length;
  await caseOuvrir(o.pg); await caseClic(o.pg, C); await p(1400); await o.ctx.close();
  dire('      jouée par la 8.79 : ' + (lance ? 'lancée' : 'PAS lancée') + ', une prise de parole ' + pa + ', un absent au clic droit ' + cd + ', deux dans la case (au pilote ' + ms(t) + '), close ; au hub, ' + sansEleve + ' ligne(s) de journal « appel » sans élève ; H/absents ' + ((Cc.h || {}).absents || []).length + ' → ' + (((heureHub().h || {}).absents) || []).length + ' (un coché après coup) ; marque de cette version : ' + !!((heureHub().h || {}).appelUnique));
  verif(k, lance && cd && t != null && sansEleve >= 1, 'l’heure ancienne est au hub : 1 absent du pilote, 2 de la case, des lignes « appel » sans élève, 1 coché après coup', { lance, cd, t, sansEleve });
  const n = await ouvrir({ fichier, qui: 'ordinateur' }); await caseOuvrir(n.pg); const c = await caseEtat(n.pg); await capt(n.pg, pre + '4a-case');
  dire('      cette version, la case : « ' + (c ? c.lab : '—') + ' »');
  verif(k, !!(c && c.n === 4), 'la case de l’heure ancienne réunit les deux listes : les 4 absents (le pilote, la case pendant et après l’heure)', c && c.lab);
  const r = await relireDepuisLaCase(n.pg); const RL = await lireRelecture(n.pg, pre + '4b-relecture'); const ap = appelDe(RL.passe);
  const nom4 = [A, B, C, D].filter(x => ap.indexOf(x.split(/\s+/).slice(-1)[0]) >= 0 || ap.indexOf(x) >= 0).length;
  dire('      la Relecture : « ' + extr(RL.recit, /présents/, 60) + ' » · « ' + extr(RL.passe, /notés dans la case/, 40) + ' » · L’APPEL « ' + court(ap, 260) + ' »');
  verif(k, !!(r && RL.ok && /1 élève sur 25 présents/i.test(RL.recit) && /absents? notés? dans la case/.test(RL.passe) && nom4 === 4), 'la Relecture de l’heure ancienne s’ouvre : « 1 élève sur 25 présents », la ligne ancienne « … notés dans la case », les 4 à « L’APPEL »', { presents: extr(RL.recit, /présents/, 40), nom4 });
  sansErreur(k, [].concat(o.errs, o.boites, o2.errs, o2.boites, n.errs, n.boites), 'la 8.79 puis cette version (la Relecture comprise)');
  verif(k, !REFUSES.length, 'aucune écriture refusée par le faux hub (' + REFUSES.length + ')', REFUSES.slice(0, 3)); await n.ctx.close(); };

/* ═══ Q · LA TÉLÉCOMMANDE : LA DIAPO DU PILOTE ET « TEXTE AU TABLEAU » (ajout de la conscience, Paul 22:18-22:22) : la diapo dessinée comme au pilote (toute la diapo,
   les éléments pas encore dévoilés en gris, toute la largeur du téléphone), aucun geste dessus ; A+ puis A− : un cran du curseur du pilote, au pilote et au tableau
   en moins de 0,5 s ; grisés, avec leur raison, quand l'ordinateur a la main ═══ */
const tcDiapo = pg => pg.evaluate(() => { const box = document.querySelector('#ses-tab.tc-tab'); const cad = box && box.querySelector('#murcadre'); const r = cad ? cad.getBoundingClientRect() : null; const m = cad && cad.querySelector('.mur');
  const vis = x => { const s = getComputedStyle(x); return s.display !== 'none' && s.visibility !== 'hidden' && x.getBoundingClientRect().height > 0; };
  return { pilote: !!(m && m.classList.contains('pilote')), l: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0, vw: innerWidth, gris: m ? Array.from(m.querySelectorAll('.pas')).filter(vis).length : 0,
    opacite: m && m.querySelector('.pas') ? getComputedStyle(m.querySelector('.pas')).opacity : null, tcmur: (() => { const x = document.getElementById('tc-mur'); return !!(x && vis(x)); })(), pe: cad ? getComputedStyle(cad).pointerEvents : null }; }).catch(() => null);
const pilGris = pg => pg.evaluate(() => { const m = document.getElementById('mur'); return m ? Array.from(m.querySelectorAll('.pas')).filter(x => getComputedStyle(x).display !== 'none').length : null; }).catch(() => null);
const tailleDe = pg => pg.evaluate(() => ({ t: +S.taille, l: ((document.getElementById('taille-l') || {}).textContent || '').trim() })).catch(() => null);
const tcTaille = tl => tl.pg.evaluate(() => { const r = document.querySelector('#tc-bas .rang.taille'); if (!r) return null; const b = s => r.querySelector('button[data-a="' + s + '"]'); return { l: ((r.querySelector('.tl') || {}).textContent || '').trim(), moins: b('t-moins') && { dis: b('t-moins').disabled, title: b('t-moins').title }, plus: b('t-plus') && { dis: b('t-plus').disabled, title: b('t-plus').title }, haut: Math.round(r.getBoundingClientRect().top), basDiapo: Math.round(document.querySelector('#ses-tab.tc-tab').getBoundingClientRect().bottom) }; }).catch(() => null);
const tabTaille = T => T.pg.evaluate(() => { const m = (typeof DR_TAB === 'object' && DR_TAB.montre) || null; return m ? m.taille : null; }).catch(() => null);
const pq = async (fichier, mode) => { const test = mode === 'QT'; reset(); const pre = 'appel-' + NOMV + '-' + mode + '-';
  dire('\n— ' + mode + ' · la télécommande : la diapo du pilote, « Texte au tableau » (' + (test ? 'mode test' : 'vraie heure') + ') —');
  const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(800);
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); await gesteClic(o.pg); await p(400);
  const tl = await ouvrirTelecommande(o, fichier, test); verif(mode, lance && !!tl, 'l’heure lancée ; la télécommande (QR) sur la séance', { lance, tl: !!tl });
  if (!tl) { await T.ctx.close(); await o.ctx.close(); return; }
  await p(800); let d = await tcDiapo(tl.pg); const g0 = await pilGris(o.pg); await capt(tl.pg, pre + '1-telecommande-diapo-du-pilote'); await capt(o.pg, pre + '1-ordinateur');
  dire('      la diapo de la télécommande : ' + (d ? (d.pilote ? 'le dessin du pilote' : 'PAS le dessin du pilote') + ', ' + d.l + ' × ' + d.h + ' px sur un écran de ' + d.vw + ' px, ' + d.gris + ' élément(s) en gris (opacité ' + d.opacite + ') — au pilote de l’ordinateur : ' + g0 + ' ; le rendu de la classe ' + (d.tcmur ? 'ENCORE montré' : 'retiré') + ' ; les gestes sur la diapo : ' + d.pe : '—'));
  verif(mode, !!(d && d.pilote && d.l >= d.vw - 1 && d.gris > 0 && d.gris === g0 && !d.tcmur), 'la diapo de la télécommande est dessinée comme au pilote : toute la diapo, les éléments pas encore dévoilés en gris (comptés, comme au pilote), toute la largeur du téléphone', d && { l: d.l, vw: d.vw, gris: d.gris, pilote: g0 });
  await tcTap(tl, '#tc-bas button[data-a="suiv"]'); const tg = await quand(async () => { const x = await tcDiapo(tl.pg); return !!(x && x.gris === d.gris - 1); }, 1500); const d1 = await tcDiapo(tl.pg);
  dire('      ▶ à la télécommande : ' + (d1 ? d1.gris : '—') + ' en gris (' + ms(tg) + ')');
  verif(mode, tg != null, '▶ : un gris de moins sur la diapo de la télécommande', { avant: d.gris, apres: d1 && d1.gris });
  /* aucun geste sur la diapo : un appui au milieu, puis deux appuis rapprochés */
  const av = await o.pg.evaluate(() => JSON.stringify({ n: S.mur && S.mur.nDev, di: S.di, loupe: !!S.loupe })).catch(() => '');
  const bx = await tl.pg.evaluate(() => { const r = document.querySelector('#ses-tab.tc-tab').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }).catch(() => null);
  if (bx) { await tl.pg.touchscreen.tap(bx.x, bx.y).catch(() => {}); await p(150); await tl.pg.touchscreen.tap(bx.x, bx.y).catch(() => {}); await tl.pg.touchscreen.tap(bx.x, bx.y).catch(() => {}); } await p(900);
  const ap = await o.pg.evaluate(() => JSON.stringify({ n: S.mur && S.mur.nDev, di: S.di, loupe: !!S.loupe })).catch(() => ''); const pe = await tl.pg.evaluate(() => !!document.fullscreenElement).catch(() => null);
  dire('      trois appuis sur la diapo de la télécommande : l’ordinateur ' + (av === ap ? 'inchangé' : 'A CHANGÉ (' + av + ' → ' + ap + ')') + ', plein écran ' + pe);
  verif(mode, av === ap && pe === false, 'aucun geste sur la diapo de la télécommande (ni appui, ni loupe, ni plein écran)', { av, ap, pe });
  /* A+ puis A− */
  const t0 = await tailleDe(o.pg); const c0 = await tcTaille(tl);
  verif(mode, !!(c0 && c0.moins && c0.plus && c0.l && c0.l === t0.l && c0.haut >= c0.basDiapo - 1 && c0.haut - c0.basDiapo < 60 && c0.plus.title && c0.moins.title), 'sous la diapo, la ligne « A− · la taille · A+ » : l’étiquette du pilote, chaque bouton son infobulle', { c0, t0 });
  await tcTap(tl, '#tc-bas button[data-a="t-plus"]'); const [tp1, tt1] = await Promise.all([quand(async () => ((await tailleDe(o.pg)) || {}).t === t0.t + 1, 1500), quand(async () => (await tabTaille(T)) === t0.t + 1, 1500)]);   /* comptés ensemble, depuis l'appui */
  await p(300); const t1 = await tailleDe(o.pg); const c1 = await tcTaille(tl); await capt(tl.pg, pre + '2-telecommande-A-plus'); await capt(T.pg, pre + '2-tableau-A-plus'); await capt(o.pg, pre + '2-ordinateur-A-plus');
  await tcTap(tl, '#tc-bas button[data-a="t-moins"]'); const [tp2, tt2] = await Promise.all([quand(async () => ((await tailleDe(o.pg)) || {}).t === t0.t, 1500), quand(async () => (await tabTaille(T)) === t0.t, 1500)]);
  await p(300); const c2 = await tcTaille(tl); await capt(tl.pg, pre + '3-telecommande-A-moins');
  dire('      A+ : le pilote « ' + t0.l + ' » → « ' + (t1 && t1.l) + ' » en ' + ms(tp1) + ', le tableau en ' + ms(tt1) + ', la télécommande dit « ' + (c1 && c1.l) + ' » ; A− : le pilote en ' + ms(tp2) + ', le tableau en ' + ms(tt2) + ', la télécommande « ' + (c2 && c2.l) + ' »');
  verif(mode, tp1 != null && tp1 <= 500 && tt1 != null && tt1 <= 500 && tp2 != null && tp2 <= 500 && tt2 != null && tt2 <= 500 && c1 && t1 && c1.l === t1.l && c2 && c2.l === t0.l, 'A+ puis A− : un cran du curseur du pilote, au pilote et au tableau en moins de 0,5 s ; la télécommande dit la taille', { tp1, tt1, tp2, tt2 });
  /* qui a la main : l'ordinateur la prend par un geste ; A− A+ grisés, leur raison */
  await gesteClic(o.pg); let g = null; for (let i = 0; i < 30; i++) { const c = await tcTaille(tl); if (c && c.moins && c.moins.dis && c.plus.dis && /désactivée/.test(c.moins.title) && /désactivée/.test(c.plus.title)) { g = c; break; } await p(100); }
  const tav = await tailleDe(o.pg); await tcTap(tl, '#tc-bas button[data-a="t-plus"]'); await p(900); const tap = await tailleDe(o.pg); await capt(tl.pg, pre + '4-telecommande-desactivee');
  dire('      l’ordinateur reprend la main : A− A+ ' + (g ? 'grisés (« ' + g.plus.title.slice(0, 70) + '… »)' : 'PAS grisés') + ' ; un appui sur A+ grisé : la taille ' + (tav && tap && tav.t === tap.t ? 'inchangée' : 'A CHANGÉ'));
  verif(mode, !!g && tav && tap && tav.t === tap.t, 'qui a la main : A− et A+ grisés quand l’ordinateur a la main, leur infobulle dit pourquoi, un appui n’y fait rien', { g: !!g });
  verifEcritures(mode, test); sansErreur(mode, [].concat(o.errs, o.boites, tl.errs, tl.boites, T.errs, T.boites), 'l’ordinateur, la télécommande, le tableau distant');
  for (const x of [tl, T, o]) await x.ctx.close().catch(() => {}); };

/* ═══ X · DEUX GESTES D'APPEL CROISÉS, À MOINS DE 100 MS (la conscience, 23:40) : deux élèves différents, aucun ne se perd ; un même élève, le dernier geste compte.
   Partout où l'appel s'écrit : la case avant l'heure (deux ordinateurs ; vraie heure — en mode test, la case d'un autre appareil ne voit pas l'essai, décision 7),
   pendant l'heure : le pilote (clic droit), la télécommande, un second ordinateur (son pilote), la case d'un troisième (vraie heure). Chaque geste part à une heure
   fixée d'avance sur l'horloge commune des appareils ; l'écart réel est mesuré. Compté au hub et sur chaque appareil. ═══ */
const GESTE = ([kind, nom, at]) => new Promise(res => { const tir = () => { const t = Date.now(); let ok = false; try {
    if (kind === 'case') { const b = Array.from(document.querySelectorAll('#edt-modale .edt-el')).find(x => x.textContent.trim() === nom); if (b && !b.disabled) { b.click(); ok = true; } }
    else if (kind === 'tc') { const b = Array.from(document.querySelectorAll('#tc-bas button[data-a="abs"]')).find(x => x.dataset.e === nom); if (b && !b.disabled) { b.click(); ok = true; } }
    else if (kind === 'pilote') { const el = Array.from(document.querySelectorAll('#part [data-e]')).find(x => x.dataset.e === nom); if (el) { const r = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.left + 2, clientY: r.top + 2 }));
      const it = document.querySelector('#menu [data-a="absent"]') || document.querySelector('#menu [data-a="arrive"]'); if (it) { it.click(); ok = true; } } }
  } catch (e) {} res({ t, ok }); }; const go = () => { const r = at - Date.now(); if (r > 30) setTimeout(go, r - 25); else { while (Date.now() < at) {} tir(); } }; go(); });   /* les dernières millisecondes en attente active : l'heure fixée est tenue même sur une page occupée */
const croiser = async (g1, g2, ecart = 40) => { const at = await g1.pg.evaluate(() => Date.now() + 900); const [r1, r2] = await Promise.all([g1.pg.evaluate(GESTE, [g1.k, g1.nom, at]), g2.pg.evaluate(GESTE, [g2.k, g2.nom, at + ecart])]); return { ok: r1.ok && r2.ok, ecart: r2.t - r1.t, dernier: r2.t >= r1.t ? 2 : 1 }; };
const etatCase = async (pg, nom) => { const c = await caseEtat(pg); return c ? c.abs.includes(nom) : null; };
const intentionCase = (pg, nom) => pg.evaluate(n => { try { const b = edtAppelBaseDe(EDT_MOD.cle); const k = edtAppelCleSure(edtSlugEleve(n)); const x = ((EDT_APPEL.mes[b.ch] || {})[k]); return x ? !!x.a : null; } catch (e) { return null; } }, nom).catch(() => null);
const px = async (fichier, mode) => { const test = mode === 'XT'; reset(); const pre = 'appel-' + NOMV + '-' + mode + '-';
  dire('\n— ' + mode + ' · deux gestes d’appel croisés, à moins de 100 ms (' + (test ? 'mode test' : 'vraie heure') + ') —');
  const [, , , G, H2, I, J2, K2, L2, M2] = [0, 1, 2, 16, 19, 22, 25, 27, 3, 6].map(i => LISTE[i]);
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); let o2 = null, o3 = null, tl = null;
  const tous = r => Object.values(r).every(x => x === true);
  if (!test) {   /* 1 · avant l'heure : la case sur deux ordinateurs */
    o2 = await ouvrir({ fichier, qui: 'ordinateur2', W: 1366, H: 768 }); await caseOuvrir(o.pg); await caseOuvrir(o2.pg); await p(800);
    const c1 = await croiser({ pg: o.pg, k: 'case', nom: A }, { pg: o2.pg, k: 'case', nom: B }); await p(2500);
    const r1 = { o: (await etatCase(o.pg, A)) && (await etatCase(o.pg, B)), o2: (await etatCase(o2.pg, A)) && (await etatCase(o2.pg, B)) }; const h1 = (avantHub()[0] || { v: [] }).v; const sAB = [await slugDe(o.pg, A), await slugDe(o.pg, B)];
    dire('      avant l’heure, deux élèves dans deux cases, à ' + c1.ecart + ' ms l’un de l’autre : le premier ordinateur ' + r1.o + ', le second ' + r1.o2 + ' ; au hub ' + h1.length + ' élève(s)');
    verif(mode, c1.ok && Math.abs(c1.ecart) < 100 && tous(r1) && sAB.every(s => h1.includes(s)), 'avant l’heure : deux élèves cochés dans deux cases à moins de 100 ms — aucun ne se perd (les deux cases, le hub)', { ecart: c1.ecart, r1, hub: h1.length });
    const c2 = await croiser({ pg: o.pg, k: 'case', nom: C }, { pg: o2.pg, k: 'case', nom: C }); await p(2500); const voulu = await intentionCase(c2.dernier === 2 ? o2.pg : o.pg, C);
    const r2 = { o: (await etatCase(o.pg, C)) === voulu, o2: (await etatCase(o2.pg, C)) === voulu }; const sC = await slugDe(o.pg, C); const h2 = (avantHub()[0] || { v: [] }).v; const hubC = h2.includes(sC) === voulu;
    await capt(o.pg, pre + '1-avant-premier'); await capt(o2.pg, pre + '1-avant-second');
    dire('      avant l’heure, le même élève dans deux cases, à ' + c2.ecart + ' ms (le dernier : ' + (c2.dernier === 2 ? 'le second' : 'le premier') + ' ordinateur) : le dernier geste voulait « ' + (voulu ? 'absent' : 'présent') + ' » ; les deux cases ' + JSON.stringify(r2) + ', le hub ' + hubC);
    verif(mode, c2.ok && Math.abs(c2.ecart) < 100 && voulu !== null && tous(r2) && hubC, 'avant l’heure : le même élève dans deux cases à moins de 100 ms — le dernier geste compte (les deux cases, le hub)', { ecart: c2.ecart, voulu, r2, hubC });
    await o2.ctx.close(); o2 = null;
  }
  /* 2 · pendant l'heure : l'ordinateur (pilote), la télécommande, un second ordinateur (pilote), la case d'un troisième */
  const lance = await lancerClasse(o); await garde(o.pg); await gesteClic(o.pg); await p(300);
  tl = await ouvrirTelecommande(o, fichier, test); o2 = await ouvrir({ fichier, test: false, qui: 'ordinateur2', W: 1366, H: 768 }); const rep2 = await reprendre(o2);
  if (!test) { o3 = await ouvrir({ fichier, qui: 'ordinateur3', W: 1366, H: 768 }); await caseOuvrir(o3.pg); }
  if (tl) await tcAppelOuvrir(tl); await p(800);
  verif(mode, lance && !!tl && rep2, 'l’heure lancée ; la télécommande et le second ordinateur sur la séance' + (o3 ? ' ; la case ouverte sur un troisième' : ''), { lance, tl: !!tl, rep2 });
  if (!tl) { for (const x of [o3, o2, o]) if (x) await x.ctx.close().catch(() => {}); return; }
  const pilotes = [['ordinateur', o.pg], ['second', o2.pg], ['télécommande', tl.pg]];
  const partout = async (noms, voulu) => { const r = {}; for (const [n, pg] of pilotes) { const v = []; for (const nom of noms) v.push((await absentAu(pg, nom)) === voulu[nom]); r[n] = v.every(Boolean); }
    if (o3) { const c = await caseEtat(o3.pg); r.case = !!c && noms.every(nom => c.abs.includes(nom) === voulu[nom]); }
    if (!test) { const L = listeDe(heureHub().h); const v = []; for (const nom of noms) v.push(L.includes(await slugDe(o.pg, nom)) === voulu[nom]); r.hub = v.every(Boolean); } return r; };
  /* la télécommande d'abord (elle a la main depuis son QR) ; un geste à l'ordinateur la lui prend ensuite */
  const paires = [[{ pg: tl.pg, k: 'tc', nom: H2, qui: 'la télécommande' }, { pg: o.pg, k: 'pilote', nom: G, qui: 'le clic droit de l’ordinateur' }]];
  if (o3) paires.push([{ pg: o3.pg, k: 'case', nom: I, qui: 'la case du troisième' }, { pg: o2.pg, k: 'pilote', nom: J2, qui: 'le clic droit du second ordinateur' }]);
  else paires.push([{ pg: o2.pg, k: 'pilote', nom: I, qui: 'le clic droit du second ordinateur' }, { pg: o.pg, k: 'pilote', nom: J2, qui: 'le clic droit de l’ordinateur' }]);
  for (const [g1, g2] of paires) { const c = await croiser(g1, g2); await p(2500); const r = await partout([g1.nom, g2.nom], { [g1.nom]: true, [g2.nom]: true });
    dire('      pendant l’heure, ' + g1.qui + ' et ' + g2.qui + ', deux élèves à ' + c.ecart + ' ms : ' + JSON.stringify(r));
    verif(mode, c.ok && Math.abs(c.ecart) < 100 && tous(r), 'pendant l’heure : ' + g1.qui + ' et ' + g2.qui + ' sur deux élèves à moins de 100 ms — aucun ne se perd (chaque appareil' + (test ? '' : ', le hub') + ')', { ecart: c.ecart, r }); }
  /* le même élève : le dernier geste compte (sa volonté : ce que son appareil en a fait) ; la télécommande reprend d'abord la main (« Reprendre avec la télécommande ») */
  await tcTap(tl, '#tc-bas button[data-a="main"]'); await p(1200); if (!(await tl.pg.$('#tc-bas button[data-a="abs"]'))) await tcAppelOuvrir(tl); await p(300);
  const memes = o3 ? [[{ pg: tl.pg, k: 'tc', nom: K2, qui: 'la télécommande' }, { pg: o3.pg, k: 'case', nom: K2, qui: 'la case du troisième' }], [{ pg: o.pg, k: 'pilote', nom: L2, qui: 'le clic droit de l’ordinateur' }, { pg: o2.pg, k: 'pilote', nom: L2, qui: 'le clic droit du second ordinateur' }]]
    : [[{ pg: tl.pg, k: 'tc', nom: K2, qui: 'la télécommande' }, { pg: o.pg, k: 'pilote', nom: K2, qui: 'le clic droit de l’ordinateur' }], [{ pg: o.pg, k: 'pilote', nom: L2, qui: 'le clic droit de l’ordinateur' }, { pg: o2.pg, k: 'pilote', nom: L2, qui: 'le clic droit du second ordinateur' }]];
  for (const [g1, g2] of memes) { const c = await croiser(g1, g2); await p(300); const gl = c.dernier === 2 ? g2 : g1; const voulu = gl.k === 'case' ? await intentionCase(gl.pg, gl.nom) : await absentAu(gl.pg, gl.nom); await p(2500);
    const r = await partout([g2.nom], { [g2.nom]: voulu });
    dire('      pendant l’heure, ' + g1.qui + ' puis ' + g2.qui + ', le même élève à ' + c.ecart + ' ms (le dernier : ' + gl.qui + ') : le dernier geste voulait « ' + (voulu ? 'absent' : 'présent') + ' » ; ' + JSON.stringify(r));
    verif(mode, c.ok && Math.abs(c.ecart) < 100 && voulu !== null && tous(r), 'pendant l’heure : ' + g1.qui + ' puis ' + g2.qui + ' sur le même élève à moins de 100 ms — le dernier geste compte (chaque appareil' + (test ? '' : ', le hub') + ')', { ecart: c.ecart, voulu, r }); }
  await capt(o.pg, pre + '2-ordinateur'); await capt(tl.pg, pre + '2-telecommande'); if (o3) await capt(o3.pg, pre + '2-case');
  verifEcritures(mode, test); sansErreur(mode, [].concat(o.errs, o.boites, o2.errs, o2.boites, tl.errs, tl.boites, o3 ? o3.errs.concat(o3.boites) : []), 'tous les appareils');
  for (const x of [tl, o3, o2, o]) if (x) await x.ctx.close().catch(() => {}); };

/* ═══ Z · DES MONTRES D'APPAREILS DÉCALÉES DE 3 MINUTES (la conscience, 00:16 : « un ordinateur de collège a souvent une montre en retard ») : le dernier geste se juge
   à l'heure du hub. Vraie heure : le téléphone en avance de 3 min, la case d'un ordinateur en retard de 3 min ; (1) le téléphone marque, puis l'ordinateur en retard
   démarque ; (2) l'ordinateur en retard marque, puis le téléphone en avance démarque. Mode test : deux télécommandes, l'une en avance, l'autre en retard (la case
   d'un autre appareil ne voit pas l'essai). Compté au hub et sur chaque appareil. ═══ */
const pz = async (fichier, mode) => { const test = mode === 'ZT'; reset(); if (test) MESURE = true; const pre = 'appel-' + NOMV + '-' + mode + '-'; const TROIS = 3 * 60000;
  dire('\n— ' + mode + ' · des montres d’appareils décalées de 3 minutes (' + (test ? 'mode test' : 'vraie heure') + ') —');
  const [N1, N2] = [5, 9].map(i => LISTE[i]);
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); await gesteClic(o.pg); await p(300);
  const av = await ouvrirTelecommande(o, fichier, test, +TROIS, 'telephone'); let re = null, o3 = null;
  if (test) { await o.pg.evaluate(() => { try { dr_tcQrFermer(); } catch (e) {} }).catch(() => {}); re = await ouvrirTelecommande(o, fichier, test, -TROIS, 'telephone2'); }
  else { o3 = await ouvrir({ fichier, qui: 'ordinateur3', W: 1366, H: 768, decal: -TROIS }); await caseOuvrir(o3.pg); }
  const montres = await Promise.all([o.pg, av && av.pg, re && re.pg, o3 && o3.pg].map(pg => pg ? pg.evaluate(() => Date.now()) : null)); const m0 = montres[0];
  dire('      les montres, comparées à l’ordinateur qui lance : le téléphone ' + Math.round((montres[1] - m0) / 1000) + ' s' + (re ? ', le second téléphone ' + Math.round((montres[2] - m0) / 1000) + ' s' : '') + (o3 ? ', l’ordinateur de la case ' + Math.round((montres[3] - m0) / 1000) + ' s' : ''));
  verif(mode, lance && !!av && (test ? !!re : !!o3), 'l’heure lancée ; un appareil en avance de 3 min, un autre en retard de 3 min', { lance });
  if (!av || (test && !re)) { for (const x of [re, av, o3, o]) if (x) await x.ctx.close().catch(() => {}); return; }
  const prendre = async tl => { if (await tl.pg.$('#tc-bas .desact')) { await tcTap(tl, '#tc-bas button[data-a="main"]'); await p(1200); } if (!(await tl.pg.$('#tc-bas button[data-a="abs"]'))) await tcAppelOuvrir(tl); await p(300); };
  const etatMain = pg => pg.evaluate(() => ({ id: DR_SES.id, main: DR_SES.main, mainTs: DR_SES.mainTs, tient: dr_sesJeTiens(), ici: !!DR_SES.ici, desact: !!document.querySelector('#tc-bas .desact'), now: Date.now() })).catch(e => String(e));
  const geste = async (qui, nom) => { if (qui.case) { await caseClic(qui.pg, nom); } else { await prendre(qui); if (process.env.MJPC_DEBUG) dire('      (débogage) avant l’appui : ' + JSON.stringify(await Promise.all(lesPilotes.map(([n, pg]) => etatMain(pg))))); const ok = await tcTap(qui, tcSel(nom)); if (process.env.MJPC_DEBUG) dire('      (débogage) appui ' + ok + ' ; bouton ' + JSON.stringify(await qui.pg.evaluate(s => { const b = document.querySelector(s); return b ? { dis: b.disabled, cl: b.className } : null; }, tcSel(nom)).catch(() => null))); } await p(3000); };
  const lesPilotes = [['ordinateur', o.pg], ['téléphone en avance', av.pg]].concat(re ? [['téléphone en retard', re.pg]] : []);
  const partout = async (nom, voulu) => { const r = {}; for (const [n, pg] of lesPilotes) r[n] = (await absentAu(pg, nom)) === voulu; if (o3) { const c = await caseEtat(o3.pg); r['case (en retard)'] = !!c && c.abs.includes(nom) === voulu; } if (!test) r.hub = listeDe(heureHub().h).includes(await slugDe(o.pg, nom)) === voulu; return r; };
  const tous = r => Object.values(r).every(Boolean);
  const enRetard = test ? re : { pg: o3.pg, case: true }; const nomRetard = test ? 'le téléphone en retard' : 'la case de l’ordinateur en retard';
  /* (1) l'appareil en avance marque, puis l'appareil en retard démarque */
  await geste(av, N1); const r1a = await partout(N1, true); await geste(enRetard, N1); const r1 = await partout(N1, false); await capt(o.pg, pre + '1-ordinateur'); if (o3) await capt(o3.pg, pre + '1-case-en-retard');
  dire('      (1) le téléphone en avance marque un élève : ' + JSON.stringify(r1a) + ' ; puis ' + nomRetard + ' le démarque : ' + JSON.stringify(r1));
  verif(mode, tous(r1a) && tous(r1), 'l’appareil en retard de 3 min démarque après l’appareil en avance : le démarquage compte, partout' + (test ? '' : ' et au hub'), { r1a, r1 });
  /* (2) l'appareil en retard marque, puis l'appareil en avance démarque */
  await geste(enRetard, N2); const r2a = await partout(N2, true); await geste(av, N2); const r2 = await partout(N2, false); await capt(av.pg, pre + '2-telephone-en-avance');
  dire('      (2) ' + nomRetard + ' marque un élève : ' + JSON.stringify(r2a) + ' ; puis le téléphone en avance le démarque : ' + JSON.stringify(r2));
  verif(mode, tous(r2a) && tous(r2), 'l’appareil en avance de 3 min démarque après l’appareil en retard : le démarquage compte, partout' + (test ? '' : ' et au hub'), { r2a, r2 });
  verifEcritures(mode, test); sansErreur(mode, [].concat(o.errs, o.boites, av.errs, av.boites, re ? re.errs.concat(re.boites) : [], o3 ? o3.errs.concat(o3.boites) : []), 'tous les appareils');
  for (const x of [re, av, o3, o]) if (x) await x.ctx.close().catch(() => {}); MESURE = false; };

/* ═══ M · LA MAIN QUAND LES MONTRES DIFFÈRENT — UNE MESURE, SANS RIEN CORRIGER (la conscience, 00:24 ; « ㉞ : la main jugée aux montres », hors de ce mandat).
   Vraie heure, le cas de la classe : (a) la télécommande d'un téléphone en avance de 3 min a la main ; l'ordinateur du pilote, en retard de 3 min, fait un geste
   (« Dévoiler ») : reprend-il la main ? (b) l'inverse : le téléphone en retard, l'ordinateur en avance ; puis « Reprendre avec la télécommande » depuis le téléphone
   en retard. Qui a la main : lu sur chaque appareil (DR_SES.main) et au hub (<session>/vif, main). ═══ */
const pmain = async fichier => { const TROIS = 3 * 60000; MESURE = true; const pre = 'appel-' + NOMV + '-MM-';
  dire('\n— M · mesure, rien ne compte : ㉞ : la main jugée aux montres (vraie heure, montres décalées de 3 min) —');
  const etat = pg => pg.evaluate(() => ({ id: DR_SES.id, main: DR_SES.main, mainTs: +DR_SES.mainTs || 0, now: Date.now(), base: DR_SES.ici ? DR_SES.ici.base : null })).catch(() => null);
  const qui = async (o, tl) => { const a = await etat(o.pg), b = await etat(tl.pg); if (!a || !b) return { erreur: 'état illisible' }; const base = a.base || b.base; const v = base ? lireH(base + '/vif') : null;
    const nomDe = id => !id ? 'personne' : id === a.id ? 'ordinateur' : id === b.id ? 'téléphone' : 'un autre';
    return { ordinateur: nomDe(a.main), telephone: nomDe(b.main), hub: nomDe(v && v.main), 'mainTs − montre de l’ordinateur (s)': Math.round((a.mainTs - a.now) / 1000), 'mainTs au hub − montre de l’ordinateur (s)': v ? Math.round(((+v.mainTs || 0) - a.now) / 1000) : null }; };
  const partout = (e, x) => e.ordinateur === x && e.telephone === x && e.hub === x;
  const cas = async (dO, dT, et, reprendre) => { reset();
    const o = await ouvrir({ fichier, qui: 'ordinateur', decal: dO }); const lance = await lancerClasse(o); await garde(o.pg); await gesteClic(o.pg); await p(300);
    const tl = lance ? await ouvrirTelecommande(o, fichier, false, dT, 'telephone') : null;
    if (!lance || !tl) { verif('M', false, et + ' : l’heure lancée et la télécommande ouverte', { lance, tl: !!tl }); for (const x of [tl, o]) if (x) await x.ctx.close().catch(() => {}); return; }
    const mo = await Promise.all([o.pg, tl.pg].map(pg => pg.evaluate(() => Date.now()))); dire('      ' + et + ' — la montre du téléphone moins celle de l’ordinateur : ' + Math.round((mo[1] - mo[0]) / 1000) + ' s');
    if (await tl.pg.$('#tc-bas .desact')) await tcTap(tl, '#tc-bas button[data-a="main"]'); await p(2500);
    const e0 = await qui(o, tl); verif('M', partout(e0, 'téléphone'), et + ' — le téléphone a pris la main (sur chaque appareil et au hub)', e0);
    await gesteClic(o.pg); await p(3000); const e1 = await qui(o, tl); await capt(o.pg, pre + et.slice(0, 3).replace(/[^a-z]/g, '') + '-ordinateur'); await capt(tl.pg, pre + et.slice(0, 3).replace(/[^a-z]/g, '') + '-telephone');
    verif('M', partout(e1, 'ordinateur'), et + ' — l’ordinateur fait un geste : il reprend la main (sur chaque appareil et au hub)', e1);
    if (reprendre) { const bouton = !!(await tl.pg.$('#tc-bas button[data-a="main"]')); if (bouton) await tcTap(tl, '#tc-bas button[data-a="main"]'); await p(3000); const e2 = await qui(o, tl); await capt(tl.pg, pre + 'reprendre-telephone');
      verif('M', bouton && partout(e2, 'téléphone'), et + ' — « Reprendre avec la télécommande » depuis le téléphone en retard : il a la main (sur chaque appareil et au hub)', Object.assign({ 'bouton présent': bouton }, e2)); }
    sansErreur('M', [].concat(o.errs, o.boites, tl.errs, tl.boites), et);
    for (const x of [tl, o]) if (x) await x.ctx.close().catch(() => {}); };
  await cas(-TROIS, +TROIS, '(a) le téléphone en avance de 3 min, l’ordinateur en retard de 3 min', false);
  await cas(+TROIS, -TROIS, '(b) le téléphone en retard de 3 min, l’ordinateur en avance de 3 min', true);
  MESURE = false; };

const NOMV = process.env.MJPC_NOM || 'v';
if (joue('M')) await mesure(FICHIER);
if (joue('M') || joue('MM')) await pmain(FICHIER);
for (const m of ['P1H', 'P1T']) if (joue(m)) await p1(FICHIER, m);
for (const m of ['P2H', 'P2T']) if (joue(m)) await p2(FICHIER, m);
for (const m of ['P3H', 'P3T']) if (joue(m)) await p3(FICHIER, m);
if (joue('P4')) await p4(FICHIER);
for (const m of ['Q', 'QT']) if (joue(m)) await pq(FICHIER, m);
for (const m of ['X', 'XT']) if (joue(m)) await px(FICHIER, m);
for (const m of ['Z', 'ZT']) if (joue(m)) await pz(FICHIER, m);
dire('\n' + nb + ' vérifications, ' + echecs + ' échec(s)' + (mnb ? ' ; à part, ' + mnb + ' mesure(s) qui ne comptent pas (ZT, la main : ㉞ : la main jugée aux montres), ' + mrouges + ' rouge(s)' : ''));
await nav.close();
fs.writeFileSync(path.join(OUT, 'sonde-appel-' + NOMV + '.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);
