// C16 571 · LA PREUVE DU GEL (MANDAT-RECIT-GEL §4) — la sonde des initiales (c5825f9cd) reprise telle quelle ; ajouts marqués « RG » : les comptes base → après (journal, doublons, récit, « Ce qui s'est passé », Papier, participation), la relecture par un autre fichier (MJPC_RELIRE) et les écritures au hub pendant la Relecture.
// C16 554 · MESURE DES INITIALES (MANDAT-MESURE-INITIALES.md) — le harnais de MESURE-FRANKLIN/sonde-franklin.mjs (f42fc52e9), lignes 1-252 reprises telles quelles ; la partie I est celle de la mesure. Rien n’est changé au site.
// C16 536 · MESURE DES FRANKLIN (MANDAT-MESURE-FRANKLIN.md) — le harnais de LOT2A/sonde-lot2a.mjs (lignes 1-229, reprises telles quelles) ; la partie F est celle de la mesure. Rien n'est changé au site.
// C16 · LOT 2a (« ▶ Rattraper cette heure ») — le harnais de AUDIT-GLOBAL/sonde-II.mjs (audit/global-II, c09d56602), lignes 1-229 reprises telles quelles ; la partie L est celle du lot.
// L'AUDIT GLOBAL, PARTIE II (C16, MANDAT-AUDIT-GLOBAL §3) — le harnais de FIN-HEURE/sonde-fin-heure.mjs (fcb5004fd), repris tel quel ; à l'origine : LA SONDE DE LA FIN D'HEURE (MANDATS/DEROULE-01-11/MANDAT-FIN-HEURE.md, ㊲ ㊳) — par le geste, sous le faux hub RANGÉ COMME LE VRAI, qui REFUSE (HTTP 400) les
// clés interdites et qui POUSSE son flux (EventSource) : le harnais de APPEL/sonde-appel.mjs (12de01f62), lui-même celui de SESSION-PARTOUT, repris tel quel ;
// la trame de Paul reconstruite par l'audit de la fin d'heure (AUDIT-FIN-HEURE/sonde-audit.mjs, e7803f7, `trameDePaul`). Aucune écriture ni lecture du vrai hub.
// Aucun nom d'élève dans ce qui sort. usage : MJPC_ANCIEN=<un assemblé d'avant> MJPC_PARTIES=F,G,S,P,D,R,T node sonde-fin-heure.mjs <dossier>/index.html <sortie>
// (le nom du dossier du fichier nomme les captures ; MJPC_CAPT, MJPC_MEDIAS comme la sonde de l'appel).
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
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + anonF(typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 1400) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'K,M,D,C,P,A,N').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
dire('C16 · audit global, partie II (les séances dans l’emploi du temps) · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400), avec son flux (EventSource) · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

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
/* les valeurs du serveur, comme le vrai hub les résout (REST : `{".sv": "timestamp"}` devient l'heure du serveur) — repris de APPEL/sonde-appel.mjs */
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
const ouvrir = async ({ qui = 'pilote', fichier = FICHIER, W = 1536, H = 864, q = '?n=3e', test = false, prof = true, h = '09:00', jour = '2026-09-14', tel = false }) => {
  const ctx = await nav.newContext(Object.assign({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }, tel ? { isMobile: true, hasTouch: true } : {}));
  await ctx.exposeBinding('__hubEcoute', (src, id, ch) => { ABOS.push({ pg: src.page, id, ch: ch.replace(/\/+$/, '') }); return JSON.stringify(lireH(ch)); }); await ctx.addInitScript(fauxFlux); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); if (u.indexOf('api.qrserver.com') >= 0) return r.fulfill({ body: qrSvg(new URL(u).searchParams.get('data') || ''), contentType: 'image/svg+xml' }); const f = imageDe(u); if (f) return r.fulfill({ path: f, contentType: typeDe(f) }); return r.abort(); });
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  /* l'horloge : le 14/09, 09:00 au lancement de la sonde, puis elle AVANCE, la même pour tous les appareils (une horloge figée faisait de l'heure des scènes un compteur
     que deux pilotes faisaient monter chacun de leur côté — un artefact que la classe ne vit jamais) ; MJPC_HORLOGE=figee : l'ancienne */
  const t09 = new Date(jour + 'T' + h + ':00+02:00').getTime();
  const pg = await ctx.newPage(); if (process.env.MJPC_HORLOGE === 'figee') await pg.clock.setFixedTime(new Date(t09)); else await pg.clock.install({ time: new Date(t09 + (Date.now() - T0REEL)) });   /* les montres de tous les appareils avancent ensemble, à l'heure, comme des appareils réglés sur l'heure du réseau */
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

const ANCIEN = process.env.MJPC_ANCIEN ? path.resolve(process.env.MJPC_ANCIEN) : null;
const PERMIS = [/^\/site\/3e\/chapitres\/\d+\/seances\/\d+\/deroule(_joue)?(\/|$)/, /^\/site\/cours_actif$/, /^\/site\/edt\//, /^\/corbeille\//, /^\/classes\//];   /* AUDITS/INTEGRATION-DEROULE/parcours.mjs, K15 */
const GR = [['Le Radeau de la Méduse', 'tableau-1-gericault-radeau.webp', 'Le Radeau de la Méduse, Théodore Géricault, 1819'], ['Le lac', 'tableau-2-bierstadt-lac.webp', 'Le lac, Albert Bierstadt, 1863'], ['Pêcheurs en mer', 'tableau-3-turner-pecheurs.webp', 'Pêcheurs en mer, William Turner, 1796'], ['Cathédrale gothique au bord de l’eau', 'tableau-4-schinkel-ville.webp', 'Cathédrale gothique au bord de l’eau, Karl Friedrich Schinkel, 1813'], ['Le Voyageur contemplant une mer de nuages', 'tableau-5-friedrich-voyageur.webp', 'Le Voyageur contemplant une mer de nuages, Caspar David Friedrich, vers 1818']];
/* la trame de Paul (l'audit, `trameDePaul`) ; `variante` : 'act3' ajoute une activité 3 (deux diapos) avant « Le bilan » ; 'deux' pose la frontière d'heure de Paul
   (« Groupe 3 » et la suite à l'heure 2 : une séance de deux heures) */
const trame = variante => (E, st) => { const k = sk0(st)[0]; const d = st.site['3e'].chapitres[0].seances[k].deroule; const N = [];
  const ec = (eid, act, actId, dur, blocs, role) => { const e = { eid, act, dur, blocs, comp: ['c4-lire-02'], rev: 0, vues: 0 }; if (actId) e.actId = actId; if (role) e.role = role; N.push(e); return e; };
  ec('aud-a1-analyse', 'Analyse d’images', 'act1', 5, [{ t: 'consigne', id: 'baud1', pic: '•', txt: 'Observe, discute, fais une hypothèse sur le Romantisme.', etapes: ['J’observe le tableau de mon groupe en silence.', 'Je discute en groupe de ce que je vois.', 'Au brouillon : ce que je vois, ce que je ressens, ce que je me demande.', 'Je fais une hypothèse sur ce que peut être le Romantisme.'], vues: 0 }]);
  ec('aud-a1-consigne', 'Consigne pour le passage à l’oral', 'act1', 3, [{ t: 'consigne', id: 'baud2', pic: '🗣️', txt: 'Chaque groupe présente son tableau puis son hypothèse.', etapes: ['Un élève montre le tableau et dit ce qu’on y voit.', 'Un autre élève lit l’hypothèse du groupe.', 'La classe écrit l’hypothèse au tableau.'], vues: 0 }]);
  GR.forEach(([t, f, leg], g) => { ec('aud-g' + (g + 1) + '-img', 'Groupe ' + (g + 1) + ' : ' + t, 'act2', 3, [{ t: 'image', id: 'baudi' + g, devoilerTout: true, legende: leg, ref: 'https://siteflow-io.github.io/mjpc-medias/poesie-peinture-xixe/' + f, src: '', support: true, vues: 0 }]);
    ec('aud-g' + (g + 1) + '-hyp', 'Groupe ' + (g + 1) + ' : l’hypothèse', 'act2', 3, [{ t: 'question', id: 'baudq' + g, q: 'Quelle hypothèse le groupe ' + (g + 1) + ' tire-t-il de son tableau ?', reps: [], vues: 0 }]); });
  if (variante === 'act3') { ec('fh-a3-consigne', 'Le Romantisme en une phrase', 'act3', 3, [{ t: 'consigne', id: 'bfh31', pic: '✍️', txt: 'Écris, seul, ta définition du Romantisme en une phrase.', etapes: ['Je relis les cinq hypothèses au tableau.', 'J’écris une phrase qui commence par « Le Romantisme, c’est… ».'], vues: 0 }]);
    ec('fh-a3-lecture', 'Nos définitions', 'act3', 3, [{ t: 'question', id: 'bfh32', q: 'Quelle définition retiens-tu, et pourquoi ?', reps: [], vues: 0 }]); }
  ec('aud-bilan', 'Le bilan', null, 5, [{ t: 'question', id: 'baudb', q: 'Qu’est-ce que le Romantisme, d’après nos cinq hypothèses ?', reps: [], vues: 0 }], 'bilan');
  if (variante === 'deux') { let deux = false; N.forEach(e => { if (e.eid === 'aud-g3-img') deux = true; e.heure = deux ? 2 : 1; }); }
  E.length = 0; N.forEach(e => E.push(e));
  d.activites = [{ id: 'act1', num: 1, titre: 'Analyse d’images', diapos: ['aud-a1-analyse', 'aud-a1-consigne'] }, { id: 'act2', num: 2, titre: 'Mise en commun', diapos: N.filter(e => e.actId === 'act2').map(e => e.eid) }].concat(variante === 'act3' ? [{ id: 'act3', num: 3, titre: 'Le Romantisme en une phrase', diapos: ['fh-a3-consigne', 'fh-a3-lecture'] }] : []); };
const REPS = ['La nature est immense et l’homme est tout petit.', 'Le peintre veut faire ressentir la peur.', 'Les naufragés espèrent encore voir un bateau.'];
const INI = ['EA', 'GA', 'EB'];
const NOMS = (() => { const st = store(); const el = []; const aj = v => { if (v == null) return; if (typeof v === 'string') el.push(v); else if (typeof v === 'object') Object.values(v).forEach(aj); }; Object.values(st.classes || {}).forEach(c => aj(c && c.eleves)); return [...new Set(el.join(' ').split(/\s+/).filter(x => x.length >= 3))].sort((a, b) => b.length - a.length); })();
const anon = t => { let x = String(t); NOMS.forEach(n => { x = x.split(n).join('«nom»'); }); return x.replace(/«nom»(\s+«nom»)+/g, '«nom»').replace(/«nom»/g, 'un élève'); };
anonF = anon;   /* tout ce qui sort, à l'écran comme au fichier */
const NOMF = path.basename(path.dirname(FICHIER)) + (process.env.MJPC_TAG ? '-' + process.env.MJPC_TAG : '');   /* MJPC_TAG : deux passes de la même partie (deux versions d'avant) gardent chacune leurs captures et leur sortie */
const CHEMINS0 = () => ECR.length;
const k15 = (k, depuis, quoi) => { const L = ECR.slice(depuis); const hors = L.filter(x => !x.refus && !PERMIS.some(r => r.test(x.c))); const ref = L.filter(x => x.refus);
  verif(k, !ref.length, quoi + ' : aucune écriture refusée par le hub (HTTP 400) — ' + L.length + ' écritures', ref.slice(0, 4).map(x => x.m + ' ' + x.c));
  verif(k, !hors.length, quoi + ' : aucune écriture hors des chemins permis (K15)', [...new Set(hors.map(x => x.m + ' ' + x.c))].slice(0, 6)); };
const k15test = (k, depuis, quoi) => { const L = ECR.slice(depuis); const hors = L.filter(x => !/^\/site\/tableau_test(\/|$)/.test(x.c)); verif(k, !hors.length, quoi + ' : mode test, aucune écriture hors de /site/tableau_test (K15-test) — ' + L.length + ' écritures', [...new Set(hors.map(x => x.m + ' ' + x.c))].slice(0, 6)); };
const lignesFin = pg => pg.evaluate(() => { const z = document.querySelector('#fin'); if (!z) return null; const b = document.getElementById('f-tous'); const r = b ? b.getBoundingClientRect() : null;
  return { n: S.finSection, quoi: ((z.querySelector('.pp-quoi') || {}).innerText || '').replace(/\s+/g, ' ').trim(),
    tous: b ? { t: (b.innerText || '').replace(/\s+/g, ' ').trim(), titre: b.title, grise: b.disabled, haut: Math.round(r.top), bas: Math.round(r.bottom), gauche: Math.round(r.left), fenetre: innerHeight, visible: r.top >= 0 && r.bottom <= innerHeight && r.width > 0 } : null,
    lignes: Array.from(z.querySelectorAll('.dr-fl')).map(l => ({ cle: l.dataset.cle, kind: l.dataset.kind, n: +l.dataset.n, t: ((l.querySelector('.dr-fl-t') || l).innerText || '').replace(/\s+/g, ' ').trim(), choix: Array.from(l.querySelectorAll('.dec button')).map(b => (b.innerText || '').trim() + (b.classList.contains('on') ? ' [posé]' : '')) })),
    cartes: z.querySelectorAll('.carte').length, liste: Array.from(z.querySelectorAll('.pp-liste [data-sec]')).map(l => (l.innerText || '').replace(/\s+/g, ' ').trim()) }; });
const finies = pg => pg.evaluate(() => seance().ecrans.map((e, i) => ({ eid: e.eid, act: e.act, finie: !!finie(e, i), dansHeure: ordreHeure(S.heure).includes(i) })));
const clic = async (pg, sel) => { const ok = await pg.evaluate(s => { const b = document.querySelector(s); if (!b || b.disabled || b.offsetParent === null) return false; b.click(); return true; }, sel); await p(900); return ok; };
const caseEdt = async (pg, jour, heure) => { await pg.evaluate(() => edtOuvrir()); await p(2400); const ok = await pg.evaluate(([j, h]) => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j + (h ? '|' + h : '')) >= 0); if (!x) return false; x.click(); return true; }, [jour, heure || null]); await p(1000);
  return { ok, t: anon((await texteDe(pg, '#edt-modale')) || ''), btns: await pg.evaluate(() => Array.from(document.querySelectorAll('#edt-modale button')).filter(b => b.offsetParent !== null).map(b => (b.innerText || '').replace(/\s+/g, ' ').trim())) }; };
/* la case de la semaine (la grille) : ses lignes et, pour chacune, si elle est coupée à l'écran (scrollWidth > clientWidth : « … ») */
const caseSemaine = async (pg, jour) => { await pg.evaluate(() => edtOuvrir()); await p(2400); const r = await pg.evaluate(j => { const x = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')).find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return null;
  return Array.from(x.querySelectorAll('.edt-b > *')).map(l => ({ t: (l.innerText || '').trim(), coupee: l.scrollWidth > l.clientWidth + 1 })); }, jour); return r; };
const fermerEdt = async pg => { await pg.evaluate(() => { try { edtModaleFermer(); } catch (e) {} try { edtFermer(); } catch (e) {} }); await p(700); };
/* la projection de l'emploi du temps (la fonction du site), lue dans la page : quatre semaines à partir du lundi 14/09, toutes les classes */
const projection = async (pg, jours = 28) => { await pg.evaluate(() => edtOuvrir()); await p(2600); const P = await pg.evaluate(n => { const c = edtProjeter('2026-09-14', n); return Object.keys(c).sort().map(k => { const x = c[k]; return { k, nature: x.nature, titre: x.titre || '', heure: x.heure || null, sur: x.sur || null, suite: !!x.suite, snum: x.snum || null, classe: x.classeMjpc || x.classe || '' }; }); }, jours); await fermerEdt(pg); return P; };
const semaineCharles = P => P.filter(x => /Charles/.test(x.classe) && x.k < '2026-09-19').map(x => x.k.slice(0, 16) + ' ' + (x.nature === 'prevu' ? x.titre + ' · h' + x.heure + (x.suite ? ' · suite' : '/' + x.sur) : x.nature + (x.titre ? ' · ' + x.titre : '')));
const heureHub = () => { const C = '/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule_joue'; const cj = lireH(C) || {}; const sl = Object.keys(cj)[0]; const H = ((cj[sl] || {}).heures) || {}; return Object.keys(H).sort().map(k => ({ k, h: H[k] })); };
const titreDe = eid => { const E = (lireH('/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule') || {}).ecrans || []; const L = Array.isArray(E) ? E : Object.values(E); return (L.find(e => e && e.eid === eid) || {}).act || eid; };
const decisionsDe = H => { const dpe = H.decisionsParEcran || {}; return Object.keys(dpe).map(k => ({ eid: k, titre: titreDe(k), choix: (dpe[k] || {}).choix, heure: (dpe[k] || {}).heure })); };
/* jouer : flèche droite jusqu'à l'eid voulu (tout dévoilé en chemin) ; `devoiler` : dévoile aussi la diapo d'arrivée */
const jouerJusqua = async (pg, eid) => { await pg.click('#numero').catch(() => {}); const vus = []; for (let k = 0; k < 80; k++) { const s2 = await ici_(pg); const x = (await eidsDe(pg)).find(e => e.eid === s2.eid) || {}; if (!vus.length || vus[vus.length - 1] !== (x.act || x.role)) vus.push(x.act || x.role); if (x.eid === eid || x.role === 'fin') break; await pg.keyboard.press('ArrowRight'); await p(330); await garde(pg); } return vus; };
const repondre = async pg => { let n = 0; for (const r of REPS) { const dit = await pg.$('#mur .rep:last-of-type .dit[contenteditable]') || (await pg.$$('#mur .rep .dit[contenteditable]')).pop(); if (!dit) break; await dit.click(); await p(250); await pg.keyboard.type(r, { delay: 12 }); await p(250); await pg.keyboard.press('Enter'); await p(600); n++; }
  await pg.keyboard.press('Escape').catch(() => {}); await p(300); for (const x of INI) { const v = await pg.$('#vif'); if (!v) break; await v.click(); await p(200); await pg.keyboard.type(x, { delay: 30 }); await p(250); await pg.keyboard.press('Enter'); await p(600); } return n; };
const allerT5 = async pg => { await pg.evaluate(() => { const b = document.getElementById('dr-t5'); if (b) b.click(); }); await p(2500); if (!(await pg.evaluate(() => !!document.querySelector('#fin .pp-tete')))) { await pg.evaluate(() => { const b = document.getElementById('bfin'); if (b) b.click(); }); await p(1500); } };
const ouvrirEtape = async (pg, n) => { await pg.evaluate(k => { const l = document.querySelector('#fin .pp-liste [data-sec="' + k + '"]'); if (l) l.click(); }, n); await p(900); };
const clore = async pg => { await pg.evaluate(() => { const b = document.getElementById('dr-clore'); if (b) b.click(); }); await p(900); await pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }); await p(800);
  const g = await pg.evaluate(() => { const g = document.getElementById('garde-clore'); return g && g.classList.contains('on') ? (g.innerText || '').replace(/\s+/g, ' ').trim() : null; }); if (g) { await pg.evaluate(() => document.getElementById('gclore-oui').click()); await p(2500); await garde(pg); } return { garde: g, close: await pg.evaluate(() => !!S.close) }; };
const lancerCase = async (pg, jour, heure) => { const c = await caseEdt(pg, jour, heure); const l = await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3800); return { c, l }; };
const neuf = (variante) => { HUBN = ranger(store(null, trame(variante))) || {}; ECR = []; REFUSES.length = 0; };
const ERRS = [];
const finir = (k, o, quoi) => { const e = o.errs.concat(o.boites); ERRS.push(...e); sansErreur(k, e, quoi); };

/* ═══════════════════ L'AUDIT GLOBAL, PARTIE II (MANDATS/DEROULE-01-11/MANDAT-AUDIT-GLOBAL.md §3) — par le geste, au faux hub ═══════════════════
   Rien n'est changé au site : la sonde ouvre le fichier, fait les gestes de Paul, lit ce que le site montre et ce qu'il écrit au faux hub.
   Le faux hub : celui de la fin d'heure (la trame de Paul en séance 1), où la classe « 3 DYLAN Bob » de la grille est appariée à « CLASSE TEST »
   (3e, chapitre publié pour elle) : la seconde classe de 3e, celle qui n'a rien joué. Parties (MJPC_PARTIES) :
   K  le paquet sans `classe` (la forme lue au vrai hub par la conscience) : la case d'une autre classe ; production, 8.80.0, 8.78.2
   M  le mode test quitté pendant l'heure (la pastille), et la page rechargée pendant un essai : ce qui part au vrai `deroule_joue`
   D  les 3 DYLAN à la séance 2 : chaque situation du mandat, comptée
   C  rattraper une heure : la case « passée · pas jouée », ce que l'existant sait faire, les horaires écrits (récit, Relecture, cahier)
   P  une séance pas finie : l'heure pas close (onglet fermé), l'heure close sans décision ; « Reprendre l'heure »
   A  une autre séance que celle proposée : la séance 4 jouée à la place de la 1 (par la réservation « Pour ») — ce que devient la 1
   N  la numérotation : une heure jouée avec des activités numérotées 3 et 4, puis renumérotées 1 et 2 — ce que chaque lecteur montre */
const V8800 = process.env.MJPC_V8800 || null, V8782 = process.env.MJPC_V8782 || null, V879 = process.env.MJPC_V879 || null;
const SE = k => '/site/3e/chapitres/0/seances/' + k;
const ORDRE = k => (((((HUBN.site || {})['3e'] || {}).chapitres || {})[0] || {}).seances || {})[k] ? +HUBN.site['3e'].chapitres[0].seances[k].ordre : null;
const djDe = k => lireH(SE(k) + '/deroule_joue') || {};
const paquets = () => { const out = []; sk0(HUBN).forEach(k => { const d = djDe(k); Object.keys(d).forEach(sl => { const b = d[sl] || {}; out.push('séance ' + ORDRE(k) + ' · paquet « ' + sl + ' » {' + Object.keys(b).sort().join(', ') + '}' + (b.classe ? ' classe « ' + b.classe + ' »' : ' SANS classe') + ' · heures : ' + Object.keys(b.heures || {}).map(h => h + (b.heures[h].clos ? ' (close' : ' (pas close') + ', ' + ((b.heures[h].activites || []).length) + ' diapos, ' + Object.keys(b.heures[h].decisionsParEcran || {}).length + ' décisions)').join(' ; ')); }); }); return out; };
const PAIRE = st => { const g = st.site.edt.grille['2026-2027']; (g.creneaux || []).forEach(c => { if (c && c.classe === '3 DYLAN Bob') c.classeMjpc = 'CLASSE TEST'; }); };
const hubAvec = (...fs) => { const st = store(null, trame(null)); PAIRE(st); fs.forEach(f => { if (f) f(st); }); HUBN = ranger(st) || {}; ECR = []; REFUSES.length = 0; };
const DYL = /CLASSE TEST/, CHA = /Charles/;
const projeter = async (pg, debut = '2026-09-14', jours = 28) => { await pg.evaluate(() => edtOuvrir()); await p(2600);
  const P = await pg.evaluate(([d, n]) => { const c = edtProjeter(d, n); return Object.keys(c).sort().map(k => { const x = c[k]; return { k, iso: x.iso, cr: x.creneau, nature: x.nature, titre: x.titre || '', heure: x.heure || null, sur: x.sur || null, suite: !!x.suite, snum: x.snum || null, classe: x.classeMjpc || x.classe || '', clos: !!x.clos, act: x.activites, rep: x.reportees, pasFinie: !!x.pasFinie, epingle: !!x.epingle, ajoutee: !!x.ajoutee }; }); }, [debut, jours]);
  await fermerEdt(pg); return P; };
const dirCase = x => x ? (x.iso + ' ' + x.cr + ' · ' + x.nature + (x.titre ? ' « ' + x.titre.slice(0, 48) + ' »' + (x.snum != null ? ' (séance ' + ORDRE(x.snum) + ')' : '') : '') + (x.heure ? ' h' + x.heure + (x.suite ? ' suite' : '/' + x.sur) : '') + (x.nature === 'jouee' ? ' — ' + x.act + ' diapos, ' + (x.clos ? 'close' : 'pas close') + (x.rep ? ', ' + x.rep + ' reportées' : '') + (x.pasFinie ? ', séance pas finie' : '') : '') + (x.ajoutee ? ' · ajoutée' : '') + (x.epingle ? ' · épinglée' : '')) : '— (aucune)';
const premiere = (P, re) => P.find(x => re.test(x.classe) && x.nature === 'prevu') || null;
const semaine = (P, re, fin = '2026-09-19') => P.filter(x => re.test(x.classe) && x.iso < fin).map(dirCase);
const seanceDe = x => x && x.snum != null ? ORDRE(x.snum) : null;
const caseDe = async (pg, iso, cr, re) => { await pg.evaluate(() => edtOuvrir()); await p(2400);
  const ok = await pg.evaluate(([j, h, rs]) => { const re = new RegExp(rs); const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && re.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j + (h ? '|' + h : '')) >= 0); if (!x) return false; x.click(); return true; }, [iso, cr || null, re.source]); await p(1100);
  return { ok, t: anon((await texteDe(pg, '#edt-modale')) || '').replace(/(un élève\s*)+/g, 'un élève '), btns: await pg.evaluate(() => Array.from(document.querySelectorAll('#edt-modale button')).filter(b => b.offsetParent !== null && !b.classList.contains('edt-el')).map(b => (b.innerText || '').replace(/\s+/g, ' ').trim())) }; };
const lancerIci = async (pg, iso, cr, re) => { const c = await caseDe(pg, iso, cr, re); const l = await clicTexte(pg, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await p(4000);
  const ouv = await pg.evaluate(() => { const b = document.getElementById('o-lancer'); return !!(b && b.offsetParent !== null && !b.disabled); }); if (ouv) { await pg.click('#o-lancer').catch(() => {}); await p(3500); }
  await pg.keyboard.press('Escape').catch(() => {}); await p(500); return { c, l, ouv }; };
const cartes = async pg => { await pg.evaluate(() => edtOuvrir()); await p(2400); const t = await pg.evaluate(() => Array.from(document.querySelectorAll('.edt-carte')).map(x => (x.innerText || '').replace(/\s+/g, ' ').trim())); await fermerEdt(pg); return t; };
const ecritsDepuis = (e0, re) => [...new Set(ECR.slice(e0).filter(x => !x.refus && (!re || re.test(x.c))).map(x => x.m + ' ' + x.c.replace(/\/heures\/[^/]+/, '/heures/<clé>').replace(/\/(appel|presence)\/.*$/, '/$1/…')))];
const HOR = /\b([01]?\d|2[0-3])\s?(h|:)\s?[0-5]\d\b|\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b|\b\d{1,2}\s(septembre|octobre|novembre)\b/gi;
const horaires = t => { const out = []; String(t || '').split(/(?<=[.!?:»])\s+|\n/).forEach(ph => { const m = ph.match(HOR); if (m) out.push(ph.trim().slice(0, 220) + '   ⟵ ' + [...new Set(m)].join(', ')); }); return out; };
const ecran_ = pg => pg.evaluate(() => { try { const e = seance().ecrans[S.di]; return { di: S.di, eid: e.eid, act: e.act, role: e.role || '' }; } catch (x) { return null; } });
const pilule = async pg => { const v = await pg.isVisible('#tprof-testpill').catch(() => false); if (v) await pg.click('#tprof-testpill').catch(() => {}); else await pg.evaluate(() => m8BasculerModeTest()); await p(900); return { geste: v ? 'clic sur la pastille « mode test » (#tprof-testpill)' : 'm8BasculerModeTest() (la pastille n’est pas visible à cet écran)', test: await pg.evaluate(() => m8TestOn()) }; };
const finSansDecider = async pg => { await allerT5(pg); await ouvrirEtape(pg, 7); return clore(pg); };
const finReporter = async pg => { await allerT5(pg); await clic(pg, '#f-suivante'); await clic(pg, '#f-tous'); await ouvrirEtape(pg, 7); return clore(pg); };
const lisible = t => anon(String(t || '')).replace(/\s+/g, ' ').trim();

/* repris de LOT2A/sonde-lot2a.mjs, lignes 233-235 et 238-242, tels quels */
const HORH = /\b([01]?\d|2[0-3])\s?(h|:)\s?[0-5]\d\b/g;   /* un horaire : 14 h 03, 14:03 — la date (« lundi 14 septembre ») n'en est pas un */
const phrasesH = t => { const out = []; String(t || '').split(/(?<=[.!?:»])\s+|\n/).forEach(ph => { const m = ph.match(HORH); if (m) out.push(ph.trim().slice(0, 160) + '   ⟵ ' + [...new Set(m)].join(', ')); }); return out; };
const nbPhrases = t => String(t || '').split(/(?<=[.!?:»])\s+|\n/).filter(x => x.trim()).length;
/* RG : les comptes, dans la page du pilote (l'heure jouée la dernière) */
const compterRG = async (pg, TXX) => pg.evaluate(TXX => { try { const hs = heuresJouees(); const h = hs[hs.length - 1]; const JR = J.filter(x => x && x.type === 'reponse' && dr_dansLH(x, h) && !x.supprimee); const cles = JR.map(x => x.si + '|' + x.di + '|' + x.bi + '|' + x.ri); const dbl = cles.length - new Set(cles).size;
  const enD = []; Object.keys(parDiapo).forEach(k => Object.keys(parDiapo[k].reps || {}).forEach(bi => (parDiapo[k].reps[bi] || []).forEach(r => { if (r && r.heure === h && String(r.r || '').trim()) enD.push(r.r); })));
  const fin = (S.closes || {})[h] || now(); const d = document.createElement('div'); d.innerHTML = passeHtml(fin, h); const tp = d.textContent; const puces = Array.from(d.querySelectorAll('.puce b')).map(b => +b.textContent || 0);
  const r2 = document.createElement('div'); r2.innerHTML = recitHtml(fin, h); const tr = r2.textContent;
  const nomme = src => { let n = 0; JR.concat(typeof dr_repsDiapos === 'function' ? dr_repsDiapos(h) : []).forEach(x => { if (!x.eleve || !TXX.some(t => String(x.txt || '').indexOf(t.slice(0, 14)) === 0)) return; const ph = src.split(/(?<=[.!?»;])\s+/).find(z => z.indexOf(String(x.txt).slice(0, 14)) >= 0) || ''; if (ph.indexOf(prenomUnique(x.eleve)) >= 0) n++; }); return n; };   /* RG : la phrase de la réponse porte le prénom de l'élève de sa ligne (compté dans la page, avant toute anonymisation) */
  return { h, nommesRecit: nomme(tr), nommesPasse: nomme(tp), journal: JR.length, doubles: dbl, dansLesDiapos: enD.length, recit: TXX.filter(t => tr.indexOf(t.slice(0, 14)) >= 0).length, passe: TXX.filter(t => tp.indexOf(t.slice(0, 14)) >= 0).length, participation: { eleves: puces.length, total: puces.reduce((a, b) => a + b, 0) }, paroleRep: J.filter(x => x && x.type === 'parole' && dr_dansLH(x, h) && /^rep/.test(String(x.m))).length }; } catch (e) { return { erreur: e.message }; } }, TXX);
const dansFace = (txt, TXX) => TXX.filter(t => String(txt || '').indexOf(t.slice(0, 14)) >= 0).length;
const lireFaces = async pg => { await pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(pg); const out = {};
  for (const f of ['recit', 'papier']) { await pg.evaluate(f => { const b = document.querySelector('#ecran-relecture [data-f="' + f + '"]'); if (b) b.click(); }, f); await p(1800); out[f] = lisible(await pg.evaluate(() => { const z = document.getElementById('rel') || document.getElementById('ecran-relecture'); return z ? z.innerText : ''; })); if (f === 'papier') out.papier = lisible(await pg.evaluate(() => { const z = document.querySelector('#rel .dr-papier') || document.getElementById('rel'); return z ? z.innerText : ''; })); await capt(pg, 'L-' + f); }
  await pg.evaluate(() => { const b = document.querySelector('#ecran-relecture [data-f="recit"]'); if (b) b.click(); }); await p(1800);
  out.ed = lisible(await pg.evaluate(() => { try { const rec0 = document.querySelector('#rel .recit') || document.querySelector('.recit'); const tete = document.querySelector('#rel .dr-recit-tete'); const qb = document.querySelector('#rel .dr-recit-queue .bilan'); return dr_recitTexteDe((tete ? tete.innerHTML : '') + dr_recitContenuED(rec0) + (qb ? qb.outerHTML : '')); } catch (e) { return 'ERREUR ' + e.message; } }));
  out.mot = (out.recit.match(/le mot pour chaque absent.*$/i) || [''])[0]; await pg.keyboard.press('Escape').catch(() => {}); return out; };

/* ══ F · LES FRANKLIN (MANDAT-MESURE-FRANKLIN §1) — une classe inventée de 25 élèves (aucun vrai nom), deux aux initiales MB ; la séance 1 jouée la veille par les
   3 DYLAN (appariés à CLASSE TEST, comme la sonde du lot 2a), puis l'heure ordinaire des Franklin dans sa case (mardi 15/09, 15:07) ══ */
const FR = '3E FRANKLIN Aretha';
const LISTE = ['ARVANEL Zoé', 'BRUMIER Mathéo', 'BLANCHOUX Maëlle', 'CORVADEC Lina', 'DUSSAREL Noé', 'ESTOURNEL Jade', 'FAVRIGNOT Hugo', 'GALVANDE Inès', 'HERBILLON Tom', 'ISNARDOT Léa', 'JOUVANCE Adam', 'KERMADEC Rose', 'LORMEAU Sacha',
  'MARVEJOL Chloé', 'NOIRCLERC Enzo', 'OLLIVANT Nina', 'PRADELOUP Yanis', 'QUINTARD Lou', 'ROUVELLAC Timéo', 'SABLONNET Emma', 'TREVANEC Louis', 'URBAILLE Ambre', 'VERNOUILLET Gabin', 'WALDRINE Alice', 'ZEPHIRAN Victor'];
const rang = n => { const i = LISTE.indexOf(n); return n == null ? 'personne' : i < 0 ? 'hors liste' : 'élève ' + (i + 1) + (i === 1 ? ' (MB n°1)' : i === 2 ? ' (MB n°2)' : ''); };
const FRA = /FRANKLIN/;
const MIXTE = process.env.MJPC_MIXTE === '1';   /* la liste rangée de deux façons : 20 en liste `eleves`, 5 en clés {nom, prenom} à côté */
const AJOUT = st => { const c = { nom: FR, niveau: '3e', archivee: false, eleves: MIXTE ? LISTE.slice(0, 20) : LISTE.slice() }; if (MIXTE) LISTE.slice(20).forEach((n, k) => { const [nom, pre] = n.split(' '); c['el' + k] = { nom, prenom: pre }; }); st.classes[FR] = c; st.site['3e'].chapitres[0].published = Object.assign({}, st.site['3e'].chapitres[0].published, { '3e_franklin_aretha': true });
  const g = st.site.edt.grille['2026-2027']; g.creneaux = (g.creneaux || []).filter(c => !(c && c.classe === '3 FRANKLIN Aretha' && c.jour === 'lundi')); g.creneaux.forEach(c => { if (c && c.classe === '3 FRANKLIN Aretha') c.classeMjpc = FR; }); };
const R_F = ['Le peintre montre que la nature est plus forte que l’homme.', 'On voit la mer en colère, les hommes ont peur.', 'Le tableau parle du rêve et de la solitude.', 'Le lac est calme, le peintre aime la nature sauvage.'];
const repsIci = pg => pg.evaluate(() => { try { const d = etatDiapo(); const R = []; const w = v => { if (Array.isArray(v)) v.forEach(w); else if (v && typeof v === 'object' && ('r' in v || 'i' in v)) R.push({ i: v.i, eleve: v.eleve, r: String(v.r || '').slice(0, 30) }); else if (v && typeof v === 'object') Object.values(v).forEach(w); }; w(d.reps); return R; } catch (e) { return 'ERREUR ' + e.message; } });
const partNoms = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#part [data-e]')).map(x => x.dataset.e));
const chercherHub = (txt) => { const out = []; const w = (n, ch) => { if (n && typeof n === 'object') Object.keys(n).forEach(k => w(n[k], ch + '/' + k)); else if (typeof n === 'string' && n.indexOf(txt.slice(0, 30)) >= 0) out.push(ch); }; w(HUBN, ''); return out; };

/* ══ I · LA CASE DES INITIALES, L'ORDRE DE RECONNAISSANCE, LE DÉVOILEMENT, LE GEL, L'HEURE CLOSE (MANDAT-MESURE-INITIALES §1) — la classe inventée des Franklin
   (25 élèves + 2 au nom de famille en deux mots), sa vraie heure du mardi 15/09 15:08 (pas une répétition), le tableau distant `?vue=tableau` ouvert à côté.
   Toutes les frappes une touche à la fois, à vitesse humaine (HUM ms + la lecture de l'état, soit 150 à 200 ms entre deux touches). ══ */
LISTE.push('LE GALLOIS Bastien', 'DE VILLEMOR Anaïs');
const HUM = 130;
const etatI = async (o, T) => { const a = await o.pg.evaluate(() => { const ae = document.activeElement; const foc = ae ? (ae.id ? '#' + ae.id : '') + (typeof ae.className === 'string' && ae.className.trim() ? '.' + ae.className.trim().split(/\s+/).join('.') : '') + (ae.dataset && ae.dataset.p ? '[' + ae.dataset.p + ']' : '') + ' <' + ae.tagName.toLowerCase() + '>' + (ae.getAttribute && ae.getAttribute('placeholder') ? ' « ' + ae.getAttribute('placeholder').slice(0, 40) + ' »' : '') : null;
    let lig = null; try { const d = etatDiapo(); lig = []; Object.keys(d.reps || {}).forEach(bi => (d.reps[bi] || []).forEach((r, ri) => lig.push({ bi, ri, i: r.i, eleve: r.eleve, r: r.r, v: !!r.validee }))); } catch (e) { lig = []; }
    const dom = Array.from(document.querySelectorAll('#mur .rep')).map(x => ({ ini: (x.querySelector('.ini') || {}).textContent || '', dit: (x.querySelector('.dit') || {}).textContent || '', libre: x.classList.contains('libre') }));
    const vert = Array.from(document.querySelectorAll('#part span.dr-ok')).map(x => x.dataset.e);
    let jr = []; try { jr = J.filter(x => x.type === 'reponse').map(x => ({ di: x.di, eleve: x.eleve, ini: x.ini, txt: String(x.txt || '') })); } catch (e) {}
    let compte = ''; try { compte = (document.getElementById('compte') || {}).textContent || ''; } catch (e) {}
    const act = ((document.querySelector('[data-p="-1.act"]') || {}).textContent || ''); return { foc, lig, dom, vert, jr, gel: !!S.gel, di: S.di, compte, act }; });
  a.tb = T ? await T.pg.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ')).catch(() => '') : ''; a.t = Date.now(); return a; };
const auTableau = (tb, txt) => { let k = 0; while (k < txt.length && tb.indexOf(txt.slice(0, k + 1)) >= 0) k++; return k; };   /* combien de lettres de la réponse le tableau montre */
const quiAuTableau = (tb, n) => { if (!n) return '—'; const [pre] = n.split(' ').slice(-1); const nom = n.split(' ').slice(0, -1).join(' '); return 'prénom ' + (tb.indexOf(pre) >= 0) + ', nom ' + (tb.indexOf(nom) >= 0); };
const ligneDe = (e, txt) => (e.lig || []).find(r => r.r && txt && r.r.indexOf(txt.slice(0, 6)) === 0) || (e.lig || []).slice(-1)[0] || {};
const resume = (k, e, txt, n, t0) => { const l = ligneDe(e, txt); const iniDom = (e.dom.find(x => x.dit && txt && x.dit.indexOf(txt.slice(0, 3)) === 0) || e.dom.find(x => x.libre) || e.dom.slice(-1)[0] || {}).ini;
  return k + ' (+' + (e.t - t0) + ' ms) · curseur ' + e.foc + ' · case des initiales « ' + iniDom + ' » · la ligne : élève ' + rang(l.eleve) + ', i « ' + (l.i || '') + ' », r « ' + String(l.r || '').slice(0, 30) + ' »' + (l.v ? ' validée' : '') + ' · vert ' + (n ? e.vert.includes(n) : '—') + ' · tableau : ' + auTableau(e.tb, txt || '§§') + '/' + (txt || '').length + ' lettres, ' + quiAuTableau(e.tb, n) + ' · journal « reponse » ' + e.jr.length + (e.gel ? ' · GEL' : '') + ' · ' + e.compte + ' · titre de l’activité « ' + String(e.act || '').slice(0, 34) + ' »'; };
/* une réponse « comme Paul » : clic dans la case des initiales de la ligne libre, les initiales lettre à lettre, [Entrée|Tab|rien], la réponse lettre à lettre, Entrée */
const ligneLibre = async pg => { const xs = await pg.$$('#mur .rep .ini[contenteditable]'); const x = xs.pop(); if (!x) return false; await x.click(); await p(250); return true; };
const jouerLigne = async (o, T, tag, ini, txt, n, opts = {}) => { const { sep = 'Enter', parLettre = true, valider = true } = opts; const pg = o.pg; const tr = []; const t0 = Date.now();
  if (!(await ligneLibre(pg))) { dire('  [' + tag + '] pas de ligne libre'); return null; }
  tr.push(resume('clic', await etatI(o, T), txt, n, t0));
  for (const ch of ini) { await pg.keyboard.type(ch); await p(HUM); tr.push(resume('« ' + ch + ' »', await etatI(o, T), txt, n, t0)); }
  if (sep) { await pg.keyboard.press(sep); await p(HUM); tr.push(resume(sep, await etatI(o, T), txt, n, t0)); }
  if (opts.clicDit) { const ds = await pg.$$('#mur .rep .dit[contenteditable]'); const d = ds[ds.length - 1]; if (d) { await d.click(); await p(HUM); tr.push(resume('clic dans la case de la réponse', await etatI(o, T), txt, n, t0)); } }
  let i = 0; for (const ch of txt) { await pg.keyboard.type(ch); await p(HUM); i++; if (parLettre || i <= 2 || i === txt.length) tr.push(resume('lettre ' + i + ' « ' + ch + ' »', await etatI(o, T), txt, n, t0)); }
  await p(500); tr.push(resume('+500 ms sans frapper', await etatI(o, T), txt, n, t0));
  if (valider) { await pg.keyboard.press('Enter'); await p(HUM); tr.push(resume('Entrée (valider)', await etatI(o, T), txt, n, t0)); await p(900); tr.push(resume('+900 ms', await etatI(o, T), txt, n, t0)); }
  /* les transitions seulement (une ligne quand quelque chose change) */
  let av = ''; tr.forEach(l => { const cle = l.replace(/^[^·]*· /, '').replace(/\(\+\d+ ms\)/, '').replace(/r « [^»]*»/, '').replace(/tableau : \d+\//, 'tableau : #/'); if (cle !== av || /Entrée|Tab|clic|500|900/.test(l)) dire('  [' + tag + '] ' + l); av = cle; });
  return tr; };
const viderLibre = pg => pg.evaluate(() => { const R = Array.from(document.querySelectorAll('#mur .rep')); const z = R[R.length - 1]; if (!z) return; const i = z.querySelector('.ini'); const d = z.querySelector('.dit'); [i, d].forEach(x => { if (x) { x.textContent = ''; x.dispatchEvent(new Event('input', { bubbles: true })); } }); });
const repondu = n => n;
const partieI = async () => {
  hubAvec(AJOUT);
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false, h: '15:08', jour: '2026-09-15' }); await p(1000);
  const o = await ouvrir({ h: '15:08', jour: '2026-09-15' }); const pg = o.pg;
  const P = await projeter(pg, '2026-09-14', 7); const fc = P.find(x => FRA.test(x.classe) && x.iso === '2026-09-15');
  dire('  [I] mardi 15/09 15:08, la case des Franklin : ' + dirCase(fc)); const L = await lancerIci(pg, fc.iso, fc.cr, FRA); dire('  [I] lancée ' + L.l + ' · répétition ' + await pg.evaluate(() => !!S.repetition) + ' · le tableau distant : « ' + (await T.pg.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 120))) + ' »');
  const I2 = await pg.evaluate(L2 => ({ ini: L2.map(n => INI[n]), ex: ['BL', 'BLG', 'BG', 'AD', 'ADV', 'AV'].map(t => t + '→' + dr_iniExact(t)), n: ELEVES.length }), [LISTE[25], LISTE[26]]);
  dire('  [I1] la page charge ' + I2.n + ' élèves · noms en deux mots : élève 26 → « ' + I2.ini[0] + ' », élève 27 → « ' + I2.ini[1] + ' » · dr_iniExact : ' + I2.ex.join(', '));
  const v1 = await jouerJusqua(pg, 'aud-g1-hyp'); const c1 = (await ici_(pg)).compte; dire('  [I] « Groupe 1 : l’hypothèse » atteinte (' + v1.length + ' diapos) · compte « ' + c1 + ' » (la question n’est pas dévoilée à la main)');
  /* A · l'ordre de Paul : « za » en minuscules, Entrée, la réponse, Entrée — élève 1 (ZA) */
  dire('  — A · initiales « za » (minuscules), Entrée, la réponse, Entrée'); const RA = 'La mer est plus forte.'; await jouerLigne(o, T, 'I2-A', 'za', RA, LISTE[0]);
  /* le geste « dévoiler » (la flèche, le curseur hors du champ) */
  await pg.click('#numero').catch(() => {}); await p(HUM); const eD0 = await etatI(o, T); await pg.keyboard.press('ArrowRight'); await p(900); const eD = await etatI(o, T);
  dire('  [I3] le geste « dévoiler » (clic sur le numéro, flèche →) : avant ' + resume('', eD0, RA, LISTE[0], eD0.t) + ' ‖ après ' + resume('', eD, RA, LISTE[0], eD0.t));
  await viderLibre(pg); await p(500);
  dire('  — A2 · la même chose, la question dévoilée : « za », Entrée, la réponse, Entrée'); await jouerLigne(o, T, 'I2-A2', 'za', RA, LISTE[0]);
  /* B · Tab au lieu d'Entrée — élève 4 (LC) ; puis où va Tab quand le curseur est là où Entrée l'a laissé */
  dire('  — B · initiales « lc », Tab, la réponse, Entrée'); const RB = 'Les hommes ont peur.'; await jouerLigne(o, T, 'I2-B', 'lc', RB, LISTE[3], { sep: 'Tab', parLettre: false });
  const eT0 = await etatI(o, T); await pg.keyboard.press('Tab'); await p(HUM); const eT = await etatI(o, T); dire('  [I2-B] après Entrée, le curseur : ' + eT0.foc + ' · Tab de là : ' + eT.foc); await pg.keyboard.press('Shift+Tab'); await p(300);
  /* C · les initiales puis la réponse sans Entrée — élève 5 (ND) */
  dire('  — C · initiales « nd » puis la réponse sans Entrée'); const RC = 'Le ciel est noir.'; await jouerLigne(o, T, 'I2-C', 'nd', RC, LISTE[4], { sep: null, parLettre: false, valider: false });
  const eC = await etatI(o, T); const lC = eC.dom.slice(-1)[0] || { ini: '', dit: '' }; dire('  [I2-C] la ligne libre : case des initiales « ' + lC.ini + ' » (' + lC.ini.length + ' signes), case de la réponse « ' + lC.dit + ' »');
  await viderLibre(pg); await p(400);
  /* D · ce que la case accepte : des chiffres, une phrase ; Entrée */
  for (const s of ['ab3', '12', 'une phrase']) { await ligneLibre(pg); for (const ch of s) { await pg.keyboard.type(ch); await p(HUM); } await pg.keyboard.press('Enter'); await p(HUM); const e = await etatI(o, T); const l = (e.dom.slice(-1)[0] || {}); const d = await pg.evaluate(() => { try { const d = etatDiapo(); const L = []; Object.values(d.reps || {}).forEach(x => x.forEach(r => L.push(r))); const r = L[L.length - 1] || {}; return { i: r.i, eleve: r.eleve }; } catch (e) { return null; } }); dire('  [I1-D] « ' + s + ' » puis Entrée : la case montre « ' + l.ini + ' », la ligne garde i « ' + (d && d.i) + ' », élève ' + rang(d && d.eleve) + ' · curseur ' + e.foc); await viderLibre(pg); await p(300); }
  /* E · les deux noms de famille en deux mots : leurs initiales calculées, tapées en minuscules */
  for (const [k, n] of [[25, LISTE[25]], [26, LISTE[26]]]) { const ini = String(I2.ini[k - 25] || '').toLowerCase(); if (!ini) continue; await jouerLigne(o, T, 'I1-E' + (k + 1), ini, 'Le radeau dérive.', n, { parLettre: false }); }
  /* G · changer l'élève d'une réponse validée pendant l'heure : la ligne A (ZA) devient LC */
  const xa = await pg.evaluateHandle(t => Array.from(document.querySelectorAll('#mur .rep')).find(r => ((r.querySelector('.dit') || {}).textContent || '').indexOf(t) === 0)?.querySelector('.ini'), RA);
  if (xa && (await xa.evaluate(x => !!x))) { await xa.click(); await p(200); await pg.keyboard.press('End'); for (let k = 0; k < 2; k++) { await pg.keyboard.press('Backspace'); await p(HUM); } for (const ch of 'lc') { await pg.keyboard.type(ch); await p(HUM); } await pg.keyboard.press('Enter'); await p(900); const eG = await etatI(o, T); const lg = ligneDe(eG, RA); const jg = eG.jr.find(x => x.txt.indexOf(RA.slice(0, 8)) === 0) || {}; dire('  [I5-G] la réponse A, ses initiales changées en « lc » puis Entrée : la ligne → élève ' + rang(lg.eleve) + ' ; le journal « reponse » de A → élève ' + rang(jg.eleve) + ', ini « ' + jg.ini + ' »'); }
  else dire('  [I5-G] la ligne A introuvable');
  /* 4 · le gel : geler, passer à « Groupe 2 : l'hypothèse », deux réponses, dégeler (« ici ») */
  const j0 = (await etatI(o, T)).jr.length; await pg.click('#bgel'); await p(900); const eg0 = await etatI(o, T); dire('  [I4] gel (#bgel) : S.gel ' + eg0.gel + ' · journal « reponse » ' + j0 + ' · le tableau : « ' + eg0.tb.slice(0, 100) + ' »');
  const v2 = await jouerJusqua(pg, 'aud-g2-hyp'); dire('  [I4] « Groupe 2 : l’hypothèse » au pilotage (' + v2.length + ' diapos), compte « ' + (await ici_(pg)).compte + ' »');
  const R4 = [['vz', 'Le lac est calme.', LISTE[24]], ['je', 'Le peintre aime la nature.', LISTE[5]]]; for (const [ini, t, n] of R4) await jouerLigne(o, T, 'I4-gel', ini, t, n, { parLettre: false });
  const eg1 = await etatI(o, T); await pg.click('#bgel'); await p(700); const g2 = await pg.evaluate(() => { const g = document.getElementById('garde2'); return g && g.classList.contains('on') ? (g.innerText || '').replace(/\s+/g, ' ').trim() : null; }); if (g2) { await pg.click('#garde2-ici'); } await p(1800); const eg2 = await etatI(o, T);
  dire('  [I4] dégel : la garde « ' + (g2 || 'aucune') + ' » → « dégeler ici » · avant : ' + R4.map(([, t, n]) => auTableau(eg1.tb, t) + '/' + t.length + ' lettres au tableau').join(', ') + ' · après : ' + R4.map(([, t, n]) => auTableau(eg2.tb, t) + '/' + t.length + ' lettres au tableau, ' + quiAuTableau(eg2.tb, n)).join(' ; ') + ' · journal « reponse » ' + eg1.jr.length + ' → ' + eg2.jr.length + ' · S.gel ' + eg2.gel);
  await p(1500); const eg3 = await etatI(o, T); dire('  [I4] +1,5 s : journal « reponse » ' + eg3.jr.length + ' · ' + JSON.stringify(eg3.jr.map(x => ({ di: x.di, eleve: rang(x.eleve), ini: x.ini, txt: x.txt.slice(0, 14) }))));
  /* la fin d'heure, close ; le récit */
  await allerT5(pg); await clic(pg, '#f-suivante'); await clic(pg, '#f-tous'); await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(2500); dire('  [I] close ' + JSON.stringify(cl.close) + ' · ' + paquets().join(' | '));
  const TX = [[RA, LISTE[0], LISTE[3]], [RB, LISTE[3]], ['Le radeau dérive.', LISTE[25]], ...R4.map(([, t, n]) => [t, n])];
  const Hh = (() => { const out = []; sk0(HUBN).forEach(k => { const dj = djDe(k); Object.keys(dj).forEach(sl => { if (!/FRANKLIN/i.test(sl + (dj[sl] || {}).classe)) return; Object.keys((dj[sl] || {}).heures || {}).forEach(h => out.push(dj[sl].heures[h])); }); }); return out; })();
  Hh.forEach(v => { const s = JSON.stringify(v); dire('  [I4] l’heure au hub : « reponse » au journal ' + (s.match(/"type":"reponse"/g) || []).length + ' · ' + TX.map(([t]) => '« ' + t.slice(0, 12) + '… » ' + (s.split(t.slice(0, 14)).length - 1) + ' fois').join(', ')); });
  const F = await lireFaces(pg); const ph = t => (F.recit.split(/(?<=[.!?])\s+/).find(x => x.indexOf(t.slice(0, 14)) >= 0) || '');
  TX.forEach(([t, n, n2]) => { const x = ph(t); dire('  [I4/I5] le récit, « ' + t.slice(0, 20) + '… » : présent ' + (F.recit.indexOf(t.slice(0, 14)) >= 0) + ' · élèves nommés dans sa phrase : ' + JSON.stringify(LISTE.filter(m => x.indexOf(m.split(' ').slice(-1)[0]) >= 0).map(rang)) + ' (attendu ' + rang(n2 || n) + ')' + ' · Papier ' + (F.papier.indexOf(t.slice(0, 14)) >= 0)); });
  fs.writeFileSync(path.join(OUT, 'recit-initiales.txt'), F.recit + '\n\n=== Papier ===\n' + F.papier + '\n');
  /* 5 · l'heure close : la même case, le même jour ; puis le lendemain */
  const m1 = await caseDe(pg, fc.iso, fc.cr, FRA); dire('  [I5] la case, close, même jour : « ' + m1.t.replace(/\s+/g, ' ').slice(0, 260) + ' » · boutons ' + JSON.stringify(m1.btns));
  const lz = await clicTexte(pg, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await p(2500); const msg = await pg.evaluate(() => { const t = (document.body.innerText || '').replace(/\s+/g, ' '); const i = t.indexOf('ne se rouvre pas'); return i >= 0 ? t.slice(Math.max(0, i - 120), i + 40) : null; }); dire('  [I5] « Ouvrir le pilotage et lancer » cliqué ' + lz + ' · « ne se rouvre pas » à l’écran : ' + JSON.stringify(msg) + ' · S.close ' + await pg.evaluate(() => !!S.close));
  finir('I9', o, 'I'); await o.ctx.close(); await T.ctx.close();
  const o2 = await ouvrir({ h: '09:10', jour: '2026-09-16' }); const P2 = await projeter(o2.pg, '2026-09-14', 7); const fc2 = P2.find(x => FRA.test(x.classe) && x.iso === '2026-09-15');
  const m2 = await caseDe(o2.pg, fc2.iso, fc2.cr, FRA); dire('  [I5] le lendemain, la case du 15/09 : ' + dirCase(fc2) + ' · « ' + m2.t.replace(/\s+/g, ' ').slice(0, 200) + ' » · boutons ' + JSON.stringify(m2.btns));
  const rl = await clicTexte(o2.pg, '#edt-modale button', 'Relire cette heure'); await p(3500); await garde(o2.pg);
  const RL = await o2.pg.evaluate(t => { const z = document.getElementById('ecran-relecture') || document.body; const ed = z.querySelectorAll('[contenteditable="true"], input:not([type=hidden]), select, textarea'); const b = Array.from(z.querySelectorAll('button')).filter(x => x.offsetParent !== null).map(x => (x.innerText || x.title || '').replace(/\s+/g, ' ').trim().slice(0, 40)); const el = Array.from(z.querySelectorAll('*')).filter(x => x.children.length === 0 && (x.textContent || '').indexOf(t) >= 0)[0]; let menu = null; if (el) { const q = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: q.left + 2, clientY: q.top + 2 })); const m = Array.from(document.querySelectorAll('#menu.on [data-a], .menu.on [data-a]')); menu = m.map(x => (x.innerText || '').trim().slice(0, 40)); } return { ouverte: !!document.getElementById('ecran-relecture'), ed: ed.length, edQuoi: Array.from(ed).slice(0, 6).map(x => x.tagName.toLowerCase() + (x.title ? ' « ' + x.title.slice(0, 50) + ' »' : '')), b, trouve: !!el, menu, dbl: el ? (el.closest('[ondblclick],[data-eleve],[data-e]') || {}).outerHTML?.slice(0, 120) || null : null }; }, RB.slice(0, 14));
  dire('  [I5] « Relire cette heure » (' + rl + ') : relecture ouverte ' + RL.ouverte + ' · champs modifiables ' + RL.ed + ' ' + JSON.stringify(RL.edQuoi) + ' · la réponse B trouvée ' + RL.trouve + ' · clic droit dessus, menu ' + JSON.stringify(RL.menu) + ' · boutons ' + JSON.stringify(RL.b.slice(0, 24)));
  finir('I9', o2, 'I lendemain'); await o2.ctx.close(); };


/* ══ J · la passe 2 : (a) qui pose le curseur dans le titre de l'activité à Entrée (un témoin `focusin` avec la pile d'appel, lignes de l'assemblé) ;
   (b) la façon qui enregistre : initiales, puis un CLIC dans la case de la réponse, la réponse, Entrée — le vert, le tableau distant, le journal, lettre à lettre ;
   (c) le gel avec deux réponses enregistrées ; (d) changer l'élève d'une réponse pendant l'heure ; (e) l'heure close, la Relecture ══ */
const partieJ = async () => {
  hubAvec(AJOUT);
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false, h: '15:08', jour: '2026-09-15' }); await p(1000);
  const o = await ouvrir({ h: '15:08', jour: '2026-09-15' }); const pg = o.pg;
  const P = await projeter(pg, '2026-09-14', 7); const fc = P.find(x => FRA.test(x.classe) && x.iso === '2026-09-15'); const L = await lancerIci(pg, fc.iso, fc.cr, FRA); dire('  [J] lancée ' + L.l + ' · répétition ' + await pg.evaluate(() => !!S.repetition));
  await jouerJusqua(pg, 'aud-g1-hyp'); dire('  [J] « Groupe 1 : l’hypothèse » · compte « ' + (await ici_(pg)).compte + ' »');
  await pg.evaluate(() => { window.__foc = []; document.addEventListener('focusin', e => { const t = e.target; window.__foc.push(((t.dataset && t.dataset.p) || (typeof t.className === 'string' ? t.className : '') || t.tagName) + ' ← ' + (new Error().stack || '').split('\n').slice(2, 7).map(x => x.trim().replace(/^at /, '').replace(/\(?file:\/\/\/[^)]*?:(\d+):\d+\)?/, 'l.$1')).join(' | ')); }, true);
    window.__kd = []; window.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Tab') window.__kd.push(e.key + ' sur ' + ((e.target.dataset && e.target.dataset.p) || e.target.tagName) + ', défaut empêché ' + e.defaultPrevented); }, false); });
  await ligneLibre(pg); for (const ch of 'za') { await pg.keyboard.type(ch); await p(HUM); } await pg.keyboard.press('Enter'); await p(HUM);
  const diag = await pg.evaluate(() => ({ foc: window.__foc.slice(), kd: window.__kd.slice(), ae: (document.activeElement.dataset || {}).p }));
  dire('  [J2-a] « za », Entrée : le curseur finit sur [' + diag.ae + '] · Entrée vue par la fenêtre : ' + JSON.stringify(diag.kd) + ' · les prises de focus, dans l’ordre :'); diag.foc.forEach(x => dire('      ' + x.slice(0, 420)));
  /* (b) la façon qui enregistre : la ligne A, le curseur remis dans la case de la réponse par un clic */
  const ds = await pg.$$('#mur .rep .dit[contenteditable]'); const t0 = Date.now(); await ds[ds.length - 1].click(); await p(HUM); const RA = 'La mer est plus forte.'; const tr = [resume('clic dans la case de la réponse', await etatI(o, T), RA, LISTE[0], t0)];
  let i = 0; for (const ch of RA) { await pg.keyboard.type(ch); await p(HUM); i++; tr.push(resume('lettre ' + i + ' « ' + ch + ' »', await etatI(o, T), RA, LISTE[0], t0)); }
  await p(500); tr.push(resume('+500 ms', await etatI(o, T), RA, LISTE[0], t0)); await pg.keyboard.press('Enter'); await p(HUM); tr.push(resume('Entrée (valider)', await etatI(o, T), RA, LISTE[0], t0)); await p(900); tr.push(resume('+900 ms', await etatI(o, T), RA, LISTE[0], t0));
  let av = ''; tr.forEach(l => { const cle = l.replace(/^[^·]*· /, '').replace(/r « [^»]*»/, '').replace(/tableau : \d+\//, '#/').replace(/case des initiales « [^»]*»/, ''); if (cle !== av || /Entrée|clic|500|900|lettre [123] /.test(l)) dire('  [J2-b] ' + l); av = cle; });
  await pg.click('#numero').catch(() => {}); await p(HUM); await pg.keyboard.press('ArrowRight'); await p(900); dire('  [J3] le geste « dévoiler » ensuite (numéro, flèche →) : ' + resume('', await etatI(o, T), RA, LISTE[0], Date.now()));
  dire('  — J2-c · « lc », Entrée, clic dans la case de la réponse, la réponse, Entrée'); const RB = 'Les hommes ont peur.'; await jouerLigne(o, T, 'J2-c', 'lc', RB, LISTE[3], { parLettre: false, clicDit: true });
  dire('  — J2-d · « bl » puis « gl » (élève 26, nom en deux mots), Entrée, clic, la réponse, Entrée'); await jouerLigne(o, T, 'J1-bl', 'bl', 'Le radeau dérive.', LISTE[25], { parLettre: false, clicDit: true });
  /* (d) changer l'élève d'une réponse validée : la ligne A (ZA) devient LC (le mauvais MB, comme Paul) */
  const xa = await pg.evaluateHandle(t => { const r = Array.from(document.querySelectorAll('#mur .rep')).find(r => ((r.querySelector('.dit') || {}).textContent || '').indexOf(t) === 0); return r ? r.querySelector('.ini') : null; }, RA);
  if (await xa.evaluate(x => !!x)) { await xa.click(); await p(200); await pg.keyboard.press('End'); for (let k = 0; k < 2; k++) { await pg.keyboard.press('Backspace'); await p(HUM); } for (const ch of 'lc') { await pg.keyboard.type(ch); await p(HUM); } await pg.keyboard.press('Enter'); await p(900); const eG = await etatI(o, T); const lg = ligneDe(eG, RA); const jg = eG.jr.find(x => x.txt.indexOf(RA.slice(0, 8)) === 0) || {}; dire('  [J5-d] la réponse A, ses initiales changées « za » → « lc », Entrée : la ligne → élève ' + rang(lg.eleve) + ' ; le journal « reponse » de A → élève ' + rang(jg.eleve) + ', ini « ' + jg.ini + ' » · titre « ' + eG.act + ' »'); }
  else dire('  [J5-d] la ligne A introuvable');
  /* (c) le gel */
  const e0 = await etatI(o, T); await pg.click('#bgel'); await p(900); dire('  [J4] gel : S.gel ' + (await etatI(o, T)).gel + ' · journal « reponse » ' + e0.jr.length);
  await jouerJusqua(pg, 'aud-g2-hyp'); dire('  [J4] « Groupe 2 : l’hypothèse » au pilotage, compte « ' + (await ici_(pg)).compte + ' »');
  const R4 = [['vz', 'Le lac est calme.', LISTE[24]], ['je', 'Le peintre aime la nature.', LISTE[5]]]; for (const [ini, t, n] of R4) await jouerLigne(o, T, 'J4-gel', ini, t, n, { parLettre: false, clicDit: true });
  const eg1 = await etatI(o, T); await pg.click('#bgel'); await p(700); const g2 = await pg.evaluate(() => { const g = document.getElementById('garde2'); return g && g.classList.contains('on') ? (g.innerText || '').replace(/\s+/g, ' ').trim() : null; }); if (g2) await pg.click('#garde2-ici'); await p(1800); const eg2 = await etatI(o, T);
  dire('  [J4] dégel (« ' + (g2 || 'aucune garde') + ' » → « Dégeler ici ») · avant : ' + R4.map(([, t]) => auTableau(eg1.tb, t) + '/' + t.length).join(', ') + ' lettres au tableau · après : ' + R4.map(([, t, n]) => auTableau(eg2.tb, t) + '/' + t.length + ' lettres, ' + quiAuTableau(eg2.tb, n)).join(' ; ') + ' · journal « reponse » ' + eg1.jr.length + ' → ' + eg2.jr.length);
  await p(1500); const eg3 = await etatI(o, T); dire('  [J4] +1,5 s : journal « reponse » ' + eg3.jr.length + ' · ' + JSON.stringify(eg3.jr.map(x => ({ di: x.di, eleve: rang(x.eleve), ini: x.ini, txt: x.txt.slice(0, 16) }))) + ' · les réponses dans les diapos : ' + await pg.evaluate(() => { let n = 0; try { Object.values(parDiapo).forEach(d => Object.values(d.reps || {}).forEach(l => l.forEach(r => { if (r && r.r) n++; }))); } catch (e) { return 'ERR'; } return n; }));
  await allerT5(pg); await clic(pg, '#f-suivante'); await clic(pg, '#f-tous'); await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(2500); dire('  [J] close ' + JSON.stringify(cl.close));
  const TX = [[RA, LISTE[3]], [RB, LISTE[3]], ['Le radeau dérive.', LISTE[25]], ...R4.map(([, t, n]) => [t, n])];
  sk0(HUBN).forEach(k => { const dj = djDe(k); Object.keys(dj).forEach(sl => { if (!/FRANKLIN/i.test(sl)) return; Object.keys((dj[sl] || {}).heures || {}).forEach(h => { const s = JSON.stringify(dj[sl].heures[h]); dire('  [J4] l’heure au hub : « reponse » au journal ' + (s.match(/"type":"reponse"/g) || []).length + ' · ' + TX.map(([t]) => '« ' + t.slice(0, 12) + '… » ' + (s.split(t.slice(0, 14)).length - 1) + ' fois').join(', ')); }); }); });
  { const C = await compterRG(pg, TX.map(([t]) => t)); dire('  [RG-J] après la clôture, sur ' + TX.length + ' réponses tapées : ' + JSON.stringify(C)); }
  const F = await lireFaces(pg); const ph = t => (F.recit.split(/(?<=[.!?»])\s+/).find(x => x.indexOf(t.slice(0, 14)) >= 0) || '');
  dire('  [RG-J] les faces de la Relecture (pilote) : récit ' + dansFace(F.recit, TX.map(([t]) => t)) + '/' + TX.length + ' · Papier ' + dansFace(F.papier, TX.map(([t]) => t)) + '/' + TX.length);
  TX.forEach(([t, n]) => { const x = ph(t); dire('  [J4/J5] le récit, « ' + t.slice(0, 20) + '… » : présent ' + (F.recit.indexOf(t.slice(0, 14)) >= 0) + ' · élèves nommés dans sa phrase : ' + JSON.stringify(LISTE.filter(m => x.indexOf(m.split(' ').slice(-1)[0]) >= 0).map(rang)) + ' (élève de la ligne : ' + rang(n) + ') · Papier ' + (F.papier.indexOf(t.slice(0, 14)) >= 0)); });
  fs.writeFileSync(path.join(OUT, 'recit-initiales.txt'), anon(F.recit) + '\n\n=== Papier ===\n' + anon(F.papier) + '\n');
  finir('J9', o, 'J'); await o.ctx.close(); await T.ctx.close();
  const RELIRE = process.env.MJPC_RELIRE ? path.resolve(process.env.MJPC_RELIRE) : FICHIER; dire('  [RG-J5] relue avec ' + (RELIRE === FICHIER ? 'le même fichier' : 'un autre fichier, md5 ' + md5(RELIRE)));
  const o2 = await ouvrir({ h: '09:10', jour: '2026-09-16', fichier: RELIRE }); await projeter(o2.pg, '2026-09-14', 7); const m2 = await caseDe(o2.pg, fc.iso, fc.cr, FRA); await p(1500); const ecr0 = ECR.length; dire('  [J5] le lendemain, la case du 15/09 : boutons ' + JSON.stringify(m2.btns));
  const rl = await clicTexte(o2.pg, '#edt-modale button', 'Relire cette heure'); await p(3500); await garde(o2.pg); const TXJ = TX.map(([t]) => t);
  for (const f of ['recit', 'passe', 'papier']) { await o2.pg.evaluate(f => { const b = Array.from(document.querySelectorAll('#ecran-relecture [data-f]')).find(x => x.dataset.f === f); if (b) b.click(); }, f); await p(1500); const tx = await o2.pg.evaluate(() => { const z = document.getElementById('rel') || document.getElementById('ecran-relecture'); const t = z ? z.innerText : ''; const pu = z ? Array.from(z.querySelectorAll('.puce b')).map(b => +b.textContent || 0) : []; return { t, pu }; }); dire('  [RG-J5] Relecture du lendemain, face « ' + f + ' » : ' + dansFace(tx.t, TXJ) + '/' + TXJ.length + ' réponses' + (f === 'passe' ? ' · participation ' + tx.pu.length + ' élèves, ' + tx.pu.reduce((a, b) => a + b, 0) + ' en tout' : '')); }
  { const E2 = ECR.slice(ecr0).filter(e => !e.refus); dire('  [RG-J5] écritures au hub depuis « Relire cette heure » : ' + E2.length + ' ' + JSON.stringify(E2.slice(0, 6).map(e => e.m + ' ' + String(e.c).replace(/.*\/(deroule|etat|heures|session|presence)/, '…/$1').slice(0, 90)))); }
  for (const f of ['recit', 'passe']) { await o2.pg.evaluate(f => { const b = Array.from(document.querySelectorAll('#ecran-relecture [data-f]')).find(x => x.dataset.f.indexOf(f) === 0); if (b) b.click(); }, f); await p(1500);
    const RL = await o2.pg.evaluate(t => { const z = document.getElementById('ecran-relecture') || document.body; const ed = Array.from(z.querySelectorAll('[contenteditable="true"], input:not([type=hidden]), select, textarea')).filter(x => x.offsetParent !== null); const el = Array.from(z.querySelectorAll('*')).filter(x => (x.textContent || '').indexOf(t) >= 0).pop(); let menu = null; if (el) { const q = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: q.left + 2, clientY: q.top + 2 })); menu = Array.from(document.querySelectorAll('[data-a]')).filter(x => x.offsetParent !== null).map(x => (x.innerText || '').trim().slice(0, 40)); } return { ed: ed.map(x => x.tagName.toLowerCase() + (x.title ? ' « ' + x.title.slice(0, 50) + ' »' : '')), trouve: !!el, menu, onglets: Array.from(z.querySelectorAll('[data-f]')).map(x => x.dataset.f) }; }, RB.slice(0, 14));
    dire('  [J5] Relecture (' + rl + '), onglet « ' + f + ' » : champs modifiables ' + JSON.stringify(RL.ed) + ' · la réponse B trouvée ' + RL.trouve + ' · clic droit dessus : menu ' + JSON.stringify(RL.menu) + ' · onglets ' + JSON.stringify(RL.onglets)); }
  finir('J9', o2, 'J lendemain'); await o2.ctx.close(); };


/* ══ K · la passe 3 : changer l'élève d'une réponse validée pendant l'heure (ZA → LC), ce que gardent la ligne, le journal, le récit ; la Relecture, clic droit sur la réponse ; les initiales au tableau distant ══ */
const partieK = async () => {
  hubAvec(AJOUT);
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false, h: '15:08', jour: '2026-09-15' }); await p(1000);
  const o = await ouvrir({ h: '15:08', jour: '2026-09-15' }); const pg = o.pg;
  const P = await projeter(pg, '2026-09-14', 7); const fc = P.find(x => FRA.test(x.classe) && x.iso === '2026-09-15'); await lancerIci(pg, fc.iso, fc.cr, FRA); await jouerJusqua(pg, 'aud-g1-hyp');
  const RA = 'La mer est plus forte.'; await jouerLigne(o, T, 'K', 'za', RA, LISTE[0], { parLettre: false, clicDit: true });
  const eA = await etatI(o, T); dire('  [K3] au tableau distant, la réponse A finie : ' + auTableau(eA.tb, RA) + '/' + RA.length + ' lettres · « ZA » ' + (eA.tb.match(/\bZA\b/g) || []).length + ' fois · ' + quiAuTableau(eA.tb, LISTE[0]));
  const xa = await pg.evaluateHandle(t => { const r = Array.from(document.querySelectorAll('#mur .rep')).find(r => ((r.querySelector('.dit') || {}).textContent || '').indexOf(t) === 0); return r ? r.querySelector('.ini') : null; }, RA);
  if (await xa.evaluate(x => !!x)) { await xa.click(); await p(200); await pg.keyboard.press('End'); for (let k = 0; k < 2; k++) { await pg.keyboard.press('Backspace'); await p(HUM); } for (const ch of 'lc') { await pg.keyboard.type(ch); await p(HUM); } await pg.keyboard.press('Enter'); await p(900); const eG = await etatI(o, T); const lg = ligneDe(eG, RA); const jg = eG.jr.find(x => x.txt.indexOf(RA.slice(0, 8)) === 0) || {}; dire('  [K5] la réponse A validée, ses initiales changées « ZA » → « lc », Entrée : la ligne → élève ' + rang(lg.eleve) + ', i « ' + lg.i + ' » ; le journal « reponse » de A → élève ' + rang(jg.eleve) + ', ini « ' + jg.ini + ' » · « reponse-eleve » ou autre trace au journal : ' + JSON.stringify(await pg.evaluate(() => J.slice(-6).map(x => x.type))) + ' · le vert : élève 1 ' + eG.vert.includes(LISTE[0]) + ', élève 4 ' + eG.vert.includes(LISTE[3])); }
  else dire('  [K5] la ligne A introuvable');
  await allerT5(pg); await clic(pg, '#f-suivante'); await clic(pg, '#f-tous'); await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(2500);
  { const C = await compterRG(pg, [RA]); const q = await pg.evaluate(RA => { const x = J.filter(y => y && y.type === 'reponse' && String(y.txt || '').indexOf(RA.slice(0, 14)) === 0); return { lignes: x.length, eleves: x.map(y => y.eleve), paroles: J.filter(y => y && y.type === 'parole' && /^rep/.test(String(y.m))).map(y => y.nom) }; }, RA); dire('  [RG-K] la réponse A au journal : ' + q.lignes + ' entrée(s), élève ' + JSON.stringify(q.eleves.map(rang)) + ' · paroles « réponse » : ' + JSON.stringify(q.paroles.map(rang)) + ' · ' + JSON.stringify(C)); }
  const F = await lireFaces(pg); const x = (F.recit.split(/(?<=[.!?»])\s+/).find(z => z.indexOf(RA.slice(0, 14)) >= 0) || ''); dire('  [K5] close ' + JSON.stringify(cl.close) + ' · le récit, la réponse A : présente ' + (F.recit.indexOf(RA.slice(0, 14)) >= 0) + ' · élèves nommés dans sa phrase : ' + JSON.stringify(LISTE.filter(m => x.indexOf(m.split(' ').slice(-1)[0]) >= 0).map(rang)));
  finir('K9', o, 'K'); await o.ctx.close(); await T.ctx.close();
  const o2 = await ouvrir({ h: '09:10', jour: '2026-09-16' }); await projeter(o2.pg, '2026-09-14', 7); await caseDe(o2.pg, fc.iso, fc.cr, FRA); const rl = await clicTexte(o2.pg, '#edt-modale button', 'Relire cette heure'); await p(3500); await garde(o2.pg);
  for (const f of ['recit', 'passe', 'papier']) { await o2.pg.evaluate(f => { const b = Array.from(document.querySelectorAll('#ecran-relecture [data-f]')).find(x => x.dataset.f === f); if (b) b.click(); }, f); await p(1500);
    const RL = await o2.pg.evaluate(t => { const z = document.getElementById('ecran-relecture') || document.body; const ed = Array.from(z.querySelectorAll('[contenteditable="true"], input:not([type=hidden]), select, textarea')).filter(x => x.offsetParent !== null); const el = Array.from(z.querySelectorAll('*')).filter(x => x.offsetParent !== null && (x.textContent || '').indexOf(t) >= 0).pop(); let menu = null, cliquable = null; if (el) { cliquable = !!(el.closest('[onclick],[data-a],button,a,[contenteditable="true"]')); const q = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: q.left + 2, clientY: q.top + 2 })); menu = Array.from(document.querySelectorAll('[data-a]')).filter(x => x.offsetParent !== null).map(x => (x.innerText || '').trim().slice(0, 40)); } return { ed: ed.length, trouve: !!el, cliquable, menu }; }, RA.slice(0, 14));
    dire('  [K5] Relecture (' + rl + '), onglet « ' + f + ' » : champs modifiables ' + RL.ed + ' · la réponse A trouvée ' + RL.trouve + ', dans un élément cliquable ' + RL.cliquable + ' · clic droit dessus : éléments de menu visibles ' + JSON.stringify(RL.menu)); }
  finir('K9', o2, 'K lendemain'); await o2.ctx.close(); };

dire(''); dire('══ MESURE INITIALES · ' + NOMF + ' · md5 ' + md5(FICHIER) + ' ══');
for (const [k, f] of [['I', partieI], ['J', partieJ], ['K', partieK]]) { if (!joue(k)) continue; dire(''); dire('— partie ' + k); try { await f(); } catch (e) { verif(k + '!', false, 'la partie ' + k + ' a levé', String(e.stack || e).slice(0, 400)); } }
dire(''); dire('--- fin : ' + nb + ' vérifications, ' + echecs + ' échec(s)');
fs.writeFileSync(path.join(OUT, 'sonde-initiales-' + NOMF + '.txt'), anon(R.join('\n')) + '\n');
await nav.close(); process.exit(0);
