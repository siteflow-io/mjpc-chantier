// C16 610 · NUIT A (MANDATS/DEROULE-01-11/NUIT-04-11/A-RELIRE-UNE-AUTRE-CLASSE.md) : mesureR compte A1-A6 (verif) ; le reste tel quel.
// C16 602 · MESURE-RELECTURE (MANDAT-MESURE-RELECTURE.md) : le harnais de MESURE-FRANKLIN/sonde-franklin.mjs, partie R ajoutée (etatR, mesureR, relireDylan), le reste tel quel.
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
  const ec = (eid, act, actId, dur, blocs, role) => { const e = { eid, act, dur, blocs, comp: [actId ? 'n-' + actId : 'c4-lire-02'], rev: 0, vues: 0 };   /* MESURE-RELECTURE : une notion par activité */ if (actId) e.actId = actId; if (role) e.role = role; N.push(e); return e; };
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
const AJOUT = st => { st.taxonomie = { domaines: [{ id: 'd-lire', prof: 'Lire', familles: [{ id: 'f-lire', prof: 'Comprendre', notions: [['c4-lire-02', 'Notion du bilan'], ['n-act1', 'Notion de A1 (analyse d’images)'], ['n-act2', 'Notion de A2 (les hypothèses)'], ['n-act3', 'Notion de A3']].map(([id, prof]) => ({ id, prof })) }] }] };   /* MESURE-RELECTURE : la taxonomie (absente du faux hub) */ const c = { nom: FR, niveau: '3e', archivee: false, eleves: MIXTE ? LISTE.slice(0, 20) : LISTE.slice() }; if (MIXTE) LISTE.slice(20).forEach((n, k) => { const [nom, pre] = n.split(' '); c['el' + k] = { nom, prenom: pre }; }); st.classes[FR] = c; st.site['3e'].chapitres[0].published = Object.assign({}, st.site['3e'].chapitres[0].published, { '3e_franklin_aretha': true });
  const g = st.site.edt.grille['2026-2027']; g.creneaux = (g.creneaux || []).filter(c => !(c && c.classe === '3 FRANKLIN Aretha' && c.jour === 'lundi')); g.creneaux.forEach(c => { if (c && c.classe === '3 FRANKLIN Aretha') c.classeMjpc = FR; }); };
const R_F = ['Le peintre montre que la nature est plus forte que l’homme.', 'On voit la mer en colère, les hommes ont peur.', 'Le tableau parle du rêve et de la solitude.', 'Le lac est calme, le peintre aime la nature sauvage.'];
const taper = async (pg, ini, txt) => { /* le texte d'abord (comme la sonde du lot 2a), puis les initiales dans la case de la même ligne, Entrée — l'ordre « initiales, Tab, texte » perdait la première lettre et tout allait dans la case des initiales (passe 3) */ const D = await pg.$$('#mur .rep .dit[contenteditable]'); const x = D.pop(); if (!x) return false; await x.click(); await p(250); await pg.keyboard.type(txt, { delay: 12 }); await p(300); await pg.keyboard.press('Enter'); await p(900); const ok = await pg.evaluate(t => { const r = Array.from(document.querySelectorAll('#mur .rep')).find(z => ((z.querySelector('.dit') || {}).textContent || '').trim() === t); if (!r) return false; const i = r.querySelector('.ini'); if (!i) return false; i.focus(); const sel = getSelection(); sel.selectAllChildren(i); sel.collapseToEnd(); return true; }, txt); if (!ok) return 'pas de ligne'; await pg.keyboard.type(ini, { delay: 60 }); await p(300); await pg.keyboard.press('Enter'); await p(800); return true; };
const repsIci = pg => pg.evaluate(() => { try { const d = etatDiapo(); const R = []; const w = v => { if (Array.isArray(v)) v.forEach(w); else if (v && typeof v === 'object' && ('r' in v || 'i' in v)) R.push({ i: v.i, eleve: v.eleve, r: String(v.r || '').slice(0, 30) }); else if (v && typeof v === 'object') Object.values(v).forEach(w); }; w(d.reps); return R; } catch (e) { return 'ERREUR ' + e.message; } });
const partNoms = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#part [data-e]')).map(x => x.dataset.e));
const chercherHub = (txt) => { const out = []; const w = (n, ch) => { if (n && typeof n === 'object') Object.keys(n).forEach(k => w(n[k], ch + '/' + k)); else if (typeof n === 'string' && n.indexOf(txt.slice(0, 30)) >= 0) out.push(ch); }; w(HUBN, ''); return out; };
/* ══ R · MESURE-RELECTURE (MANDAT-MESURE-RELECTURE §1) — après l'heure close des Franklin, le pilotage reste sur les Franklin ; la Relecture des Franklin
   (« Relire » de la fin d'heure), puis, par le calendrier, la case passée des 3 DYLAN (CLASSE TEST) et « Relire cette heure ». Lu dans la page, compté. ══ */
const etatR = pg => pg.evaluate(LF => { const q = s => ((document.querySelector(s) || {}).innerText || '').replace(/\s+/g, ' ').trim(); const sel = document.getElementById('dr-rel-classe');
  const noms = (typeof ELEVES !== 'undefined' ? ELEVES : []); const cl = (typeof classesData !== 'undefined' && DR_RECIT_CLASSE && classesData[DR_RECIT_CLASSE]) || null; const nCl = cl ? ((typeof extractEleves === 'function' ? extractEleves(cl) : cl.eleves) || []).length : null;
  const dec = Object.keys(S.decisions || {}).map(k => ({ k, h: (S.decisions[k] || {}).heure, defaut: !!(S.decisions[k] || {}).defaut, choix: (S.decisions[k] || {}).choix }));
  let acts = []; try { acts = (dr_recitActivites() || []).map(a => ({ id: a.id, n: a.diapos.length, h1: a.diapos.filter(i => dr_dansHeureJouee(i, 1)).length })); } catch (e) { acts = String(e); }
  let fin = []; try { const E = seance().ecrans; fin = (dr_activites()[String(S.si)] || []).map(a => { const ds = diaposAct(a).filter(i => E[i] && E[i].role !== 'fin' && !retiree(E[i])); return { a: 'A' + a.num, comp: ds.reduce((t, i) => t + (E[i].comp || []).length, 0), d: ds.map(i => (finie(E[i], i) ? 'F' : '-') + elements(E[i]).length + '/' + (vuMax[K(i)] || 0) + (J.some(x => x.type === 'diapo' && x.di === i) ? 'j' : '')).join(' ') }; }); } catch (e) { fin = String(e); }
  return { titre: q('#rel-titre'), sous: q('#rel-sous'), sel: sel ? { n: sel.options.length, opts: Array.from(sel.options).map(o => o.text), choisi: sel.value, grise: sel.disabled } : null, recitClasse: DR_RECIT_CLASSE, memClasse: DR_MEM.classeSlug, cours: (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) ? AT_DR_COURS.classeSlug : null,
    eleves: { n: noms.length, franklin: noms.filter(n => LF.includes(n)).length }, nClasseRelue: nCl, closesJ: JSON.stringify(S.closes), closesCles: Object.keys(S.closes || {}), heure: S.heure, lancee: !!S.lancee, close: !!S.close,
    heuresCours: Object.keys(S.heuresCours || {}), travailHeure: Object.keys(S.travailHeure || {}), echeanceHeure: JSON.stringify(S.echeanceHeure || null), dec, acts, fin, trav: Object.keys(notionsTravaillees()), oral: Object.keys(S.notionsOral || {}), faiteOral: Object.keys(S.faiteOral || {}), vuMaxN: Object.keys(vuMax).length,
    corr: document.querySelectorAll('#rel .dr-a-corriger[data-j]').length, J: J.length, Jrep: J.filter(x => x.type === 'reponse').length, Jdiapo: J.filter(x => x.type === 'diapo').length, Jdev: J.filter(x => x.type === 'devoile').length }; }, LISTE);
const faceR = async (pg, f) => { await pg.evaluate(f => { const b = document.querySelector('#ecran-relecture [data-f="' + f + '"]') || document.querySelector('[data-f="' + f + '"]'); if (b) b.click(); }, f); await p(2200); };
const mesureR = async (pg, tag) => { await faceR(pg, 'recit'); const e = await etatR(pg); const dyl = DYL.test(e.recitClasse || ''); let qui = null; /* la classe relue est celle des Dylan (CLASSE TEST) */
  dire('  [R1] ' + tag + ' · entête « ' + e.titre + ' » · classe relue (DR_RECIT_CLASSE) « ' + e.recitClasse + ' » · classe du pilotage (AT_DR_COURS) « ' + e.cours + ' », ELEVES de « ' + e.memClasse + ' » : ' + e.eleves.n + ' noms dont ' + e.eleves.franklin + ' Franklin · la classe relue a ' + e.nClasseRelue + ' élèves');
  await faceR(pg, 'passe'); const ep = await etatR(pg); const sansEl = await pg.evaluate(() => J.filter(x => x.type === 'reponse' && !x.eleve).length);
  dire('  [R1] ' + tag + ' · le menu des classes : ' + JSON.stringify(e.sel) + ' · « Ce qui s’est passé » : réponses sans élève au journal ' + sansEl + ', liens « à corriger » ' + ep.corr);
  if (ep.corr) { await pg.evaluate(() => { const b = document.querySelector('#rel .dr-a-corriger[data-j]'); if (b) b.click(); }); await p(900);
    const c = await pg.evaluate(LF => { const s = document.getElementById('dr-corr-sel'); const o = s ? Array.from(s.options).map(x => x.value) : []; return { h4: ((document.querySelector('#dr-corr-pop h4') || {}).innerText || '').slice(0, 90), n: o.length, franklin: o.filter(n => LF.includes(n)).length }; }, LISTE);
    dire('  [R1] ' + tag + ' · « Qui a répondu » (' + c.h4 + ') : ' + c.n + ' élèves proposés, dont ' + c.franklin + ' des Franklin, ' + (c.n - c.franklin) + ' autres'); qui = c;
    await pg.evaluate(() => { const b = document.getElementById('dr-corr-x'); if (b) b.click(); }); await p(400); }
  await faceR(pg, 'chapitre'); const c2 = await etatR(pg); const txt = anon(await pg.evaluate(() => ((document.getElementById('rel') || {}).innerText || ''))); 
  dire('  [R2] ' + tag + ' · « Le chapitre » : sous-titre « ' + c2.sous + ' » · S.closes = ' + c2.closesJ + ' (clés ' + JSON.stringify(c2.closesCles) + ') · S.heure ' + c2.heure + ', lancée ' + c2.lancee + ', close ' + c2.close + ' · heuresCours ' + JSON.stringify(c2.heuresCours) + ' · travailHeure ' + JSON.stringify(c2.travailHeure) + ' · echeanceHeure ' + c2.echeanceHeure);
  (txt.match(/Heure \d+ — [^\n]{0,170}/g) || []).forEach(l => dire('  [R2] ' + tag + ' · ligne : « ' + l + ' »'));
  dire('  [R2] ' + tag + ' · décisions (S.decisions) : ' + c2.dec.length + ' · heure 1 sans « defaut » : ' + c2.dec.filter(x => x.h === 1 && !x.defaut).length + ' · ' + JSON.stringify(c2.dec.map(x => x.k.slice(0, 22) + ':' + x.h + ':' + x.choix + (x.defaut ? ':defaut' : ''))));
  dire('  [R2] ' + tag + ' · activités (dr_recitActivites) : ' + (Array.isArray(c2.acts) ? c2.acts.length + ' · dans l’heure 1 (dr_dansHeureJouee) : ' + c2.acts.filter(a => a.h1).length + ' · ' + JSON.stringify(c2.acts) : c2.acts));
  const nt = (txt.match(/non travaillée/g) || []).length, tr = (txt.match(/(?<!non )travaillée(?! [hp])/g) || []).length;
  dire('  [R3] ' + tag + ' · notions : « non travaillée » ' + nt + ' fois · état « travaillée » ' + ((txt.match(/\btravaillée — /g) || []).length) + ' · notionsTravaillees() : ' + c2.trav.length + ' ' + JSON.stringify(c2.trav) + ' · S.notionsOral ' + c2.oral.length + ' · S.faiteOral ' + c2.faiteOral.length + ' · vuMax : ' + c2.vuMaxN + ' clés · journal ' + c2.J + ' (diapo ' + c2.Jdiapo + ', devoile ' + c2.Jdev + ', reponse ' + c2.Jrep + ')');
  dire('  [R3] ' + tag + ' · par activité (F = finie ; lignes de la diapo / vuMax ; j = montrée au journal) : ' + JSON.stringify(c2.fin));
  /* nuit A (C16 610) : compté */ { const lh = txt.match(/Heure \d+ — [^\n]{0,170}/g) || []; const nonVues = Array.isArray(c2.fin) ? c2.fin.reduce((t, a) => t + a.d.split(' ').filter(x => /^F/.test(x) && !/j$/.test(x)).length, 0) : -1;
    if (dyl) verif('A1', !!qui && qui.n === e.nClasseRelue && qui.franklin === 0, tag + ' · « Qui a répondu » : les élèves de la classe relue seulement', qui ? qui.n + ' proposés, ' + qui.franklin + ' Franklin, la classe relue en a ' + e.nClasseRelue : 'pas de lien « à corriger »');
    verif('A2', !e.sel && !c2.sel, tag + ' · pas de menu des classes', JSON.stringify(e.sel));
    verif('A3', !lh.some(l => /^Heure 0 /.test(l)) && /^1 heure\(s\) close\(s\)/.test(c2.sous), tag + ' · « Le chapitre » : 1 heure close, pas d’« Heure 0 »', c2.sous + ' · ' + lh.filter(l => /^Heure 0 /.test(l)).length + ' ligne(s) « Heure 0 »');
    verif('A4', lh.some(l => /^Heure 1 — parti[^:]*: 1 activité sur 2 n'a pas tenu/.test(l)), tag + ' · « 1 activité sur 2 n’a pas tenu »', JSON.stringify(lh.filter(l => /parti/.test(l))));
    verif('A5', /franklin/i.test(e.cours || '') && e.eleves.n === 25 && e.eleves.franklin === 25, tag + ' · le pilotage reste sur les Franklin (AT_DR_COURS, ELEVES)', e.cours + ' · ELEVES ' + e.eleves.n + ' dont ' + e.eleves.franklin + ' Franklin');
    if (dyl) verif('A6', nonVues === 0, tag + ' · aucune diapo comptée finie sans avoir été montrée à la classe relue', nonVues + ' diapo(s) · vuMax ' + c2.vuMaxN + ' clés'); }
  fs.writeFileSync(path.join(OUT, 'chapitre-' + tag.replace(/[^A-Za-z]+/g, '-').slice(0, 30) + '.txt'), txt + '\n');
  return c2; };
const commeFirebase = (n, ch, out) => { if (!n || typeof n !== 'object') return n; if (Array.isArray(n)) return n.map((x, i) => commeFirebase(x, ch + '/' + i, out)); const ks = Object.keys(n); ks.forEach(k => { n[k] = commeFirebase(n[k], ch + '/' + k, out); });
  if (ks.length && ks.every(k => /^(0|[1-9]\d*)$/.test(k))) { const mx = Math.max(...ks.map(Number)); if (mx < 2 * ks.length) { const a = []; for (let i = 0; i <= mx; i++) a.push(n[i] === undefined ? null : n[i]); out.push(ch + ' ' + JSON.stringify(ks)); return a; } } return n; };
const relireDylan = async pg => { if (process.env.MJPC_FIREBASE === '1') { const b = lireH0(SE('0') + '/deroule_joue/CLASSE TEST'); const out = []; if (b && b.etat) b.etat = commeFirebase(b.etat, 'etat', out); dire('  [R2] l’état des Dylan au faux hub rendu comme Firebase le rend (objets à clés entières → tableaux) : ' + out.length + ' · ' + JSON.stringify(out.filter(x => /closes|Heure|heuresCours/.test(x)))); }
  const c = await caseDe(pg, '2026-09-14', '15:07-16:02', DYL); dire('  [R1] le calendrier, la case des Dylan (lundi 14/09) : ouverte ' + c.ok + ' · boutons ' + JSON.stringify(c.btns));
  const l = await clicTexte(pg, '#edt-modale button', 'Relire cette heure'); await p(6000); await garde(pg); dire('  [R1] « Relire cette heure » cliqué : ' + l);
  await mesureR(pg, 'Dylan par le calendrier, pilotage Franklin');
  const sel = await pg.evaluate(() => { const s = document.getElementById('dr-rel-classe'); if (!s || s.disabled) return null; const o = Array.from(s.options).find(x => x.value !== s.value); if (!o) return null; s.value = o.value; s.dispatchEvent(new Event('change')); return o.text; });
  await p(4000); dire('  [R1] le menu des classes changé vers « ' + sel + ' »'); if (sel) await mesureR(pg, 'apres le menu des classes'); };

const partieF = async () => {
  hubAvec(AJOUT); let o, pg;
  if (process.env.MJPC_SANS_DYLAN !== '1') {   /* la veille : les 3 DYLAN jouent la séance 1 (une réponse), « Reporter », close */
    o = await ouvrir({ h: '15:08', jour: '2026-09-14' }); pg = o.pg; const l = await lancerIci(pg, '2026-09-14', '15:07-16:02', DYL); await jouerJusqua(pg, 'aud-g1-hyp'); if (/^0 \//.test((await ici_(pg)).compte)) { await pg.keyboard.press('ArrowRight'); await p(500); }
    const tD = await taper(pg, 'QQ', 'Pour les Dylan : la nature est immense.'); await allerT5(pg); await clic(pg, '#f-suivante'); await clic(pg, '#f-tous'); await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(2000);
    dire('  [F0] la veille, CLASSE TEST (3 DYLAN) lancée ' + JSON.stringify(l.l) + ', une réponse ' + tD + ', close ' + JSON.stringify(cl.close) + ' · ' + paquets().join(' | ')); finir('F9', o, 'F0'); await o.ctx.close(); }
  o = await ouvrir({ h: '15:08', jour: '2026-09-15' }); pg = o.pg; const P = await projeter(pg, '2026-09-14', 7); const fc = P.find(x => FRA.test(x.classe) && x.iso === '2026-09-15');
  dire('  [F] mardi 15/09 15:08, la case des Franklin : ' + dirCase(fc) + ' · semaine : ' + semaine(P, FRA).join(' ‖ '));
  const L = await lancerIci(pg, fc.iso, fc.cr, FRA); dire('  [F] la modale : « ' + L.c.t.replace(/\s+/g, ' ').slice(0, 200) + ' » · lancée ' + L.l);
  const fen = await ouvrirTableau(o);
  /* ── 1 et 2 : la liste chargée par la page ── */
  const pgL = await pg.evaluate(() => ({ slug: DR_MEM.classeSlug, n: ELEVES.length, noms: ELEVES.slice(), ini: ELEVES.map(n => INI[n]), vu1: dr_iniVu(INI[ELEVES[1]]), vu2: dr_iniVu(INI[ELEVES[2]]), ex: dr_iniExact('MB'), ex2: dr_iniExact('MB2'), seul: dr_iniSeul('MB'), cand: dr_candidats('MB') }));
  dire('  [F2] la page : classe « ' + pgL.slug + ' », ' + pgL.n + ' élèves sur ' + LISTE.length + ' · manquent : ' + JSON.stringify(LISTE.filter(n => !pgL.noms.includes(n)).map(rang)));
  dire('  [F1] initiales : élève 2 → ' + pgL.ini[1] + ', élève 3 → ' + pgL.ini[2] + ' · à l’écran (dr_iniVu) : « ' + pgL.vu1 + ' » / « ' + pgL.vu2 + ' » · dr_iniExact(MB) = ' + pgL.ex + ', dr_iniExact(MB2) = ' + pgL.ex2 + ', dr_iniSeul(MB) = ' + pgL.seul + ', dr_candidats(MB) = ' + JSON.stringify(pgL.cand));
  const pa0 = await partNoms(pg); dire('  [F2] la participation (#part) : ' + pa0.length + ' élèves montrés sur ' + LISTE.length + ' · manquent : ' + JSON.stringify(LISTE.filter(n => !pa0.includes(n) && !pa0.includes(pgL.ini[LISTE.indexOf(n)])).map(rang)) + ' · forme des entrées : ' + (pa0[0] && LISTE.includes(pa0[0]) ? 'le nom' : 'autre'));
  /* ── la séance 1 : « Groupe 1 : l'hypothèse », deux réponses « MB » ; « Groupe 2 : l'hypothèse », « MB » et « ZA » ── */
  const v1 = await jouerJusqua(pg, 'aud-g1-hyp'); if (/^0 \//.test((await ici_(pg)).compte)) { await pg.keyboard.press('ArrowRight'); await p(500); }
  const a = await taper(pg, 'MB', R_F[0]), b = await taper(pg, 'MB', R_F[1]); const r1 = await repsIci(pg);
  dire('  [F1] « Groupe 1 : l’hypothèse » (' + v1.length + ' diapos parcourues) · deux réponses tapées « MB » (' + a + ', ' + b + ') · la page les range : ' + JSON.stringify(Array.isArray(r1) ? r1.map(r => ({ i: r.i, eleve: rang(r.eleve), r: r.r })) : r1));
  await pg.click('#vif').catch(() => {}); await p(200); await pg.keyboard.type('MB', { delay: 60 }); await p(900);
  const sug = await pg.evaluate(() => ({ sug: ((document.getElementById('vif-sug') || {}).innerText || '').replace(/\s+/g, ' ').trim(), fiche: !!(document.getElementById('ppop') || { classList: { contains: () => false } }).classList.contains('on'), cands: (S.vifCands || []).slice() }));
  dire('  [F1] le VIF, « MB » tapé : la suggestion « ' + sug.sug.slice(0, 200) + ' » · fiche ouverte ' + sug.fiche + ' · candidats ' + JSON.stringify(sug.cands));
  await pg.keyboard.press('Control+A'); await pg.keyboard.press('Backspace'); await p(300); await pg.keyboard.press('Escape'); await p(400);
  const v2 = await jouerJusqua(pg, 'aud-g2-hyp'); if (/^0 \//.test((await ici_(pg)).compte)) { await pg.keyboard.press('ArrowRight'); await p(500); }
  const c = await taper(pg, 'MB', R_F[2]), d = await taper(pg, 'ZA', R_F[3]); const r2 = await repsIci(pg);
  dire('  [F1] « Groupe 2 : l’hypothèse » · « MB » et « ZA » (' + c + ', ' + d + ') · rangées : ' + JSON.stringify(Array.isArray(r2) ? r2.map(r => ({ i: r.i, eleve: rang(r.eleve), r: r.r })) : r2));
  if (fen) { const tt = await fen.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ')); dire('  [F1] le tableau (la fenêtre projetée) : « MB » ' + (tt.match(/\bMB\w*/g) || []).length + ' fois, « MB2 » ' + (tt.match(/\bMB2\b/g) || []).length + ' fois · « ' + tt.slice(0, 260) + ' »'); }
  /* ── 2 : un absent (élève 6), la participation recomptée ── */
  const abs = await pg.evaluate(n => { const el = Array.from(document.querySelectorAll('#part [data-e]')).find(x => x.dataset.e === n); if (!el) return false; const q = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: q.left + 2, clientY: q.top + 2 })); const it = document.querySelector('#menu [data-a="absent"]'); if (!it) return false; it.click(); return true; }, LISTE[5]); await p(1500);
  const pa1 = await partNoms(pg); const ca1 = await pg.evaluate(() => ({ cand: dr_candidats('J').length, E: ELEVES.length }));
  dire('  [F2] élève 6 noté absent (' + abs + ') : la participation montre ' + pa1.length + ' élèves · manquent ' + JSON.stringify(LISTE.filter(n => !pa1.includes(n)).map(rang)) + ' · ELEVES ' + ca1.E);
  /* ── la fin d'heure, close ; 3 : le récit ── */
  await allerT5(pg); await clic(pg, '#f-suivante'); await clic(pg, '#f-tous'); await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(2500);
  dire('  [F] close ' + JSON.stringify(cl.close) + ' · au hub : ' + paquets().join(' | '));
  dire('  [F0/F3] la réponse des Dylan au hub : ' + JSON.stringify(chercherHub('Pour les Dylan : la nature est immense.').map(x => x.replace(/\/heures\/[^/]+/, '/heures/<clé>')).slice(0, 4))); R_F.forEach((t, k) => dire('  [F1/F3] la réponse ' + (k + 1) + ' au hub : ' + JSON.stringify(chercherHub(t).map(x => x.replace(/\/heures\/[^/]+/, '/heures/<clé>')).slice(0, 4))));
  const H = (() => { const out = []; sk0(HUBN).forEach(k => { const dj = djDe(k); Object.keys(dj).forEach(sl => { if (!/FRANKLIN/i.test(sl + (dj[sl] || {}).classe)) return; Object.keys((dj[sl] || {}).heures || {}).forEach(h => out.push({ seance: ORDRE(k), sl, h, v: dj[sl].heures[h] })); }); }); return out; })();
  H.forEach(x => { const s = JSON.stringify(x.v); dire('  [F1] l’heure des Franklin au hub (séance ' + x.seance + ', « ' + x.h + ' ») : élève 2 cité ' + (s.split(LISTE[1]).length - 1) + ' fois, élève 3 cité ' + (s.split(LISTE[2]).length - 1) + ' fois ; « MB2 » ' + (s.split('"MB2"').length - 1) + ' fois'); });
  if (process.env.MJPC_DUMP) fs.writeFileSync(process.env.MJPC_DUMP, JSON.stringify(sk0(HUBN).map(k => ({ k, ordre: ORDRE(k), dj: djDe(k) })), null, 1));
  const F = await lireFaces(pg);
  await mesureR(pg, 'Franklin, sa propre heure'); await relireDylan(pg);
  R_F.forEach((t, k) => dire('  [F3] la réponse ' + (k + 1) + ' : dans le récit ' + (F.recit.indexOf(t.slice(0, 30)) >= 0) + ', le texte pour École Directe ' + (F.ed.indexOf(t.slice(0, 30)) >= 0) + ', le Papier ' + (F.papier.indexOf(t.slice(0, 30)) >= 0)));
  dire('  [F3] le récit : ' + nbPhrases(F.recit) + ' phrases · « Dylan » ' + /Dylan/.test(F.recit) + ' · élève 2 (prénom) ' + (F.recit.split('Mathéo').length - 1) + ' fois, élève 3 ' + (F.recit.split('Maëlle').length - 1) + ' fois · prénoms de la liste cités : ' + LISTE.filter(n => F.recit.indexOf(n.split(' ')[1]) >= 0).length);
  fs.writeFileSync(path.join(OUT, 'recit-franklin' + (MIXTE ? '-mixte' : '') + '.txt'), F.recit + '\n\n=== Papier ===\n' + F.papier + '\n\n=== ED ===\n' + F.ed + '\n');
  finir('F9', o, 'F'); await o.ctx.close(); };

dire(''); dire('══ MESURE FRANKLIN · ' + NOMF + ' · md5 ' + md5(FICHIER) + (MIXTE ? ' · liste MIXTE' : '') + ' ══');
for (const [k, f] of [['F', partieF]]) { if (!joue(k)) continue; dire(''); dire('— partie ' + k); try { await f(); } catch (e) { verif(k + '!', false, 'la partie ' + k + ' a levé', String(e.stack || e).slice(0, 400)); } }
dire(''); dire('--- fin : ' + nb + ' vérifications, ' + echecs + ' échec(s)');
fs.writeFileSync(path.join(OUT, 'sonde-relecture-' + NOMF + (MIXTE ? '-mixte' : '') + '.txt'), anon(R.join('\n')) + '\n');
await nav.close(); process.exit(0);
