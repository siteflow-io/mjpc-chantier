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

/* ══ K · le paquet sans `classe` (la forme lue au vrai hub) ══ */
const paquetCharles = avec => st => { const k = sk0(st)[0]; const se = st.site['3e'].chapitres[0].seances[k]; const E = se.deroule.ecrans.filter(e => e && e.eid);
  const t0 = Date.parse('2026-09-14T12:08:53+02:00'), t1 = Date.parse('2026-09-14T14:42:50+02:00');
  const H = { classe: '3E Charles de Gaulle', clos: true, heure: 1, sur: 1, debutReel: t0, finReel: t1, lanceA: '12:08', creneau: '08:00-08:55', activites: E.slice(0, 9).map((e, i) => ({ eid: e.eid, titre: e.act, reel: 1, rang: i + 1 })) };
  const b = { heures: { '2026-09-14_08h00-08h55_3E_Charles_de_Gaulle': H }, etat: { maj: t1 }, journal: [{ t: t0, type: 'lancement', h: 1, heure: 1 }], ecrans: E.slice(0, 3), scene: { maj: t1, di: 2 } };
  if (avec) b.classe = '3E Charles de Gaulle'; se.deroule_joue = { '3E Charles de Gaulle': b }; };
const partieK = async () => {
  const F = [['production 8.81.1', FICHIER], ['8.80.0', V8800], ['8.78.2', V8782]].filter(x => x[1] && fs.existsSync(x[1]));
  for (const [nom, f] of F) for (const avec of [false, true]) {
    hubAvec(paquetCharles(avec)); dire('  [K] ' + nom + ' (md5 ' + md5(f).slice(0, 8) + ') · le paquet de la séance 1 ' + (avec ? 'AVEC' : 'SANS') + ' `classe` : ' + paquets().join(' | '));
    const o = await ouvrir({ fichier: f, h: '08:00', jour: '2026-09-15' }); const P = await projeter(o.pg); const d = premiere(P, DYL), c = premiere(P, CHA);
    dire('  [K]   la prochaine case de CLASSE TEST (rien joué) : ' + dirCase(d)); dire('  [K]   la prochaine case de 3E Charles de Gaulle : ' + dirCase(c));
    const ca = await cartes(o.pg); dire('  [K]   les cartes des classes : ' + ca.join(' ‖ '));
    const m = await caseDe(o.pg, '2026-09-15', '10:07-11:02', DYL); await capt(o.pg, 'K-' + nom.split(' ')[0] + '-' + (avec ? 'avec' : 'sans') + '-case-classe-test'); dire('  [K]   la case de CLASSE TEST, mardi 10:07 : « ' + m.t.slice(0, 160) + ' »');
    verif('K' + (avec ? '2' : '1'), seanceDe(d) === (avec ? 1 : 2), nom + ' : un paquet ' + (avec ? 'AVEC' : 'SANS') + ' `classe` sur la séance 1 → la case de CLASSE TEST (qui n’a rien joué) propose la séance ' + (avec ? '1' : '2') + ' (mesuré : séance ' + seanceDe(d) + ')', dirCase(d));
    if (!avec && nom.startsWith('production')) { await fermerEdt(o.pg); const L = await lancerIci(o.pg, '2026-09-15', '10:07-11:02', DYL); const E = await eidsDe(o.pg); const plan = E.find(e => /parcours/i.test(e.act || '') || e.role === 'plan');
      dire('  [K]   CLASSE TEST lance sa case (séance ' + seanceDe(d) + ') : ' + E.slice(0, 6).map(e => '« ' + e.act + ' »' + (e.role ? ' [' + e.role + ']' : '')).join(' → '));
      const term = await o.pg.evaluate(() => { try { const ch = chapitresData['3e'][AT.edChap.chnum]; return Object.keys(ch.seances).sort((a, b) => (+ch.seances[a].ordre) - (+ch.seances[b].ordre)).map(k => 'S' + ch.seances[k].ordre + ':' + (dr_ouvTerminee(ch.seances[k], { nom: 'CLASSE TEST', slug: 'CLASSE TEST' }) ? 'finie' : '—') + '/' + dr_ouvHeuresJouees(ch.seances[k], { nom: 'CLASSE TEST', slug: 'CLASSE TEST' }) + 'h'); } catch (e) { return ['ERREUR ' + e.message]; } });
      dire('  [K]   « Le parcours du chapitre » et le bilan des compétences, pour CLASSE TEST, lus par leurs fonctions (dr_ouvTerminee / dr_ouvHeuresJouees) : ' + term.join(' '));
      if (plan) { await allerA(o.pg, plan.eid); await p(800); const t = await texteDe(o.pg, '#mur'); await capt(o.pg, 'K-production-sans-parcours-classe-test'); dire('  [K]   la diapo « ' + plan.act + ' » au pilote : « ' + lisible(t).slice(0, 500) + ' »'); }
      const re = E.find(e => e.role === 'reactivation'); if (re) { await allerA(o.pg, re.eid); await p(800); dire('  [K]   la réactivation au pilote : « ' + lisible(await texteDe(o.pg, '#mur')).slice(0, 300) + ' »'); } else dire('  [K]   pas de diapo de réactivation dans cette heure');
    }
    finir('K9', o, nom + ' ' + (avec ? 'avec' : 'sans')); await o.ctx.close(); } };

/* ══ M · le mode test quitté pendant l'heure ; la page rechargée pendant un essai ══ */
const partieM = async () => {
  const F = [['production 8.81.1', FICHIER], ['8.78.2', V8782], ['8.79.0', V879], ['8.80.0', V8800]].filter(x => x[1] && fs.existsSync(x[1]) && (!process.env.MJPC_SEUL || process.env.MJPC_SEUL.split(',').includes(x[0].split(' ')[0])));
  for (const [nom, f] of F) {
    hubAvec(); const o = await ouvrir({ fichier: f, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; const a = await pilule(pg); const e0 = ECR.length;
    dire('  [M] ' + nom + ' · mode test : ' + a.geste + ' → m8TestOn() = ' + a.test); const L = await lancerIci(pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg, 'aud-a1-consigne'); await p(3000);
    const w1 = ecritsDepuis(e0).filter(x => !/tableau_test/.test(x)); dire('  [M]   essai lancé (' + L.l + '), 7 diapos : écritures au hub hors de /site/tableau_test : ' + (w1.length ? w1.join(', ') : 'aucune'));
    const b = await pilule(pg); const e1 = ECR.length; dire('  [M]   PENDANT l’heure, le mode test quitté : ' + b.geste + ' → m8TestOn() = ' + b.test);
    await jouerJusqua(pg, 'aud-g1-hyp'); await p(20000); const w2 = ecritsDepuis(e1).filter(x => !/tableau_test/.test(x));
    dire('  [M]   ensuite, 3 diapos et 20 s : ' + w2.length + ' chemins écrits au vrai hub : ' + w2.join(', ')); const cl = await finSansDecider(pg); await p(2500); const w3 = ecritsDepuis(e1).filter(x => !/tableau_test/.test(x));
    dire('  [M]   clôture (' + JSON.stringify(cl).slice(0, 160) + ') · au total ' + w3.length + ' chemins hors /site/tableau_test depuis la sortie du mode test'); dire('  [M]   le faux hub (le « vrai ») porte : ' + (paquets().join(' | ') || 'aucun paquet'));
    const P = await projeter(pg); const d = premiere(P, DYL); dire('  [M]   puis la prochaine case de CLASSE TEST : ' + dirCase(d) + ' · de 3E Charles de Gaulle : ' + dirCase(premiere(P, CHA)));
    const pq = djDe(sk0(HUBN)[0]); const sl = Object.keys(pq)[0];
    verif('M1', !!sl && !(pq[sl] || {}).classe, nom + ' : un essai lancé en mode test, puis le mode test quitté pendant l’heure → le paquet de la classe est écrit au vrai hub SANS `classe` (mesuré : ' + (sl ? Object.keys(pq[sl]).sort().join(', ') : 'aucun paquet') + ')', paquets());
    await capt(pg, 'M-' + nom.split(' ')[0] + '-apres'); finir('M9', o, nom + ' pastille'); await o.ctx.close();
    /* la page rechargée pendant un essai */
    hubAvec(); const o2 = await ouvrir({ fichier: f, h: '09:00', jour: '2026-09-14' }); const pg2 = o2.pg; await pilule(pg2); await lancerIci(pg2, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg2, 'aud-a1-consigne'); await p(2000);
    const e2 = ECR.length; await pg2.reload({ waitUntil: 'load' }).catch(() => {}); await p(2500); await profPrep(pg2, false); await p(1500);
    const apres = await pg2.evaluate(() => ({ test: typeof m8TestOn === 'function' ? m8TestOn() : null, rep: (() => { const b = document.getElementById('ses-reprise-oui'); return !!(b && b.offsetParent !== null); })(), repT: ((document.getElementById('ses-reprise-txt') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 200) }));
    await p(12000); const w4 = ecritsDepuis(e2).filter(x => !/tableau_test/.test(x));
    dire('  [M]   ' + nom + ' · un essai en mode test, page RECHARGÉE : m8TestOn() après = ' + apres.test + ' · la reprise proposée : ' + apres.rep + (apres.repT ? ' (« ' + apres.repT + ' »)' : '') + ' · écritures hors /site/tableau_test en 12 s : ' + (w4.join(', ') || 'aucune'));
    if (apres.rep) { const e3 = ECR.length; await pg2.click('#ses-reprise-oui').catch(() => {}); await p(8000); const w5 = ecritsDepuis(e3).filter(x => !/tableau_test/.test(x)); dire('  [M]   « Reprendre » cliqué : m8TestOn() = ' + await pg2.evaluate(() => m8TestOn()) + ' · écritures hors /site/tableau_test en 8 s : ' + (w5.join(', ') || 'aucune') + ' · paquets : ' + (paquets().join(' | ') || 'aucun')); }
    finir('M9', o2, nom + ' rechargée'); await o2.ctx.close(); } };

/* ══ D · les 3 DYLAN à la séance 2 : les situations du mandat ══ */
const D_RES = [];
const situation = (k, quoi, d, attendu1) => { const s = seanceDe(d); D_RES.push([k, quoi, s]); dire('  [D] ' + k + ' · ' + quoi + ' → la case : ' + dirCase(d) + ' ⇒ ' + (s === 2 ? 'SÉANCE 2 : REPRODUIT' : s === 1 ? 'séance 1 : ne reproduit pas' : 'séance ' + s)); };
const partieD = async () => {
  /* D1 une heure de la classe close sans report (presque rien joué) */
  { hubAvec(); const o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); await lancerIci(o.pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(o.pg, 'aud-a1-analyse'); const cl = await finSansDecider(o.pg); await p(1500);
    dire('  [D] D1 clôture : ' + JSON.stringify(cl).slice(0, 200) + ' · ' + paquets().join(' | ')); const P = await projeter(o.pg); situation('D1', '3E Charles de Gaulle : une heure lancée, 6 diapos (l’ouverture et « Analyse d’images »), close sans rien décider (« Clore quand même »)', premiere(P, CHA)); finir('D9', o, 'D1'); await o.ctx.close(); }
  /* D2 une case « prévue » plus tôt, pas jouée : la veille ; le même jour ; la grille restée ouverte */
  { hubAvec(); const o = await ouvrir({ h: '14:00', jour: '2026-09-15' }); const P = await projeter(o.pg); dire('  [D] D2 la semaine de 3E Charles de Gaulle, mardi 14:00 : ' + semaine(P, CHA).join(' ‖ ')); situation('D2a', '3E Charles de Gaulle : la case de la veille (lundi 08:57) passée sans être jouée', P.find(x => CHA.test(x.classe) && x.iso === '2026-09-15' && x.nature === 'prevu')); finir('D9', o, 'D2a'); await o.ctx.close(); }
  { hubAvec(); const o0 = await ouvrir({ h: '07:00', jour: '2026-09-14' }); const P0 = await projeter(o0.pg); await o0.ctx.close(); const parJour = {}; P0.filter(x => DYL.test(x.classe) && x.nature === 'prevu' && !x.ajoutee).forEach(x => { (parJour[x.iso] = parJour[x.iso] || []).push(x); }); const j = Object.keys(parJour).sort().find(k => parJour[k].length >= 2 && !/langue/.test(JSON.stringify(parJour[k])));
    dire('  [D] D2 CLASSE TEST, jours à deux cases (4 semaines) : ' + Object.keys(parJour).filter(k => parJour[k].length >= 2).map(k => k + ' ' + parJour[k].map(x => x.cr).join(' + ')).join(' ; '));
    if (j) { const [c1, c2] = parJour[j]; const fin1 = c1.cr.split('-')[1]; const hApres = String(+fin1.slice(0, 2) + 0).padStart(2, '0') + ':' + String(Math.min(59, +fin1.slice(3) + 10)).padStart(2, '0');
      hubAvec(); const o = await ouvrir({ h: hApres, jour: j }); const P = await projeter(o.pg, '2026-09-14'); dire('  [D] D2b ' + j + ' à ' + hApres + ' : ' + P.filter(x => DYL.test(x.classe) && x.iso === j).map(dirCase).join(' ‖ ')); situation('D2b', 'CLASSE TEST : la case du matin (' + c1.cr + ') passée sans être jouée, le même jour', P.find(x => DYL.test(x.classe) && x.iso === j && x.cr === c2.cr)); finir('D9', o, 'D2b'); await o.ctx.close();
      /* la grille ouverte AVANT la fin de la première case, laissée ouverte : ce qu'elle dit de la seconde après l'heure */
      const hAvant = c1.cr.split('-')[0]; hubAvec(); const o2 = await ouvrir({ h: hAvant, jour: j }); await o2.pg.evaluate(() => edtOuvrir()); await p(2600); const lire = () => o2.pg.evaluate(([jj, cr]) => { const x = Array.from(document.querySelectorAll('.edt-clic')).find(e => (e.getAttribute('onclick') || '').indexOf(jj + '|' + cr) >= 0 && /CLASSE TEST/.test(e.innerText || '')); return x ? (x.innerText || '').replace(/\s+/g, ' ').trim() : null; }, [j, c2.cr]);
      const av = await lire(); await o2.pg.clock.fastForward('02:30:00').catch(() => {}); await p(2500); const ap = await lire(); const heureIci = await o2.pg.evaluate(() => new Date().toTimeString().slice(0, 5));
      const sn = await o2.pg.evaluate(([jj, cr]) => { const k = Object.keys(EDT_VUE.cellules || {}).find(k => k.indexOf(jj + '|' + cr) === 0 && /CLASSE TEST/.test(k)); const c = k && EDT_VUE.cellules[k]; return c ? { titre: c.titre, snum: c.snum, nature: c.nature } : null; }, [j, c2.cr]);
      await capt(o2.pg, 'D2c-grille-restee-ouverte'); dire('  [D] D2c la grille ouverte à ' + hAvant + ' et laissée ouverte jusqu’à ' + heureIci + ' : la case ' + c2.cr + ' disait « ' + av + ' », elle dit « ' + ap + ' » · la cellule que lit « ▶ Ouvrir le pilotage et lancer » (EDT_VUE.cellules) : ' + JSON.stringify(sn) + (sn && sn.snum != null ? ' = séance ' + ORDRE(sn.snum) : ''));
      D_RES.push(['D2c', 'grille laissée ouverte', sn && sn.snum != null ? ORDRE(sn.snum) : null]); finir('D9', o2, 'D2c'); await o2.ctx.close(); } else dire('  [D] D2b : aucun jour à deux cases pour CLASSE TEST dans les 4 semaines — pas mesuré'); }
  /* D3 une séance réservée à certaines classes */
  { hubAvec(st => { const k = sk0(st)[0]; st.site['3e'].chapitres[0].seances[k].classes = ['3E Charles de Gaulle']; }); const o = await ouvrir({ h: '08:00', jour: '2026-09-15' }); const P = await projeter(o.pg); situation('D3', 'la séance 1 réservée à 3E Charles de Gaulle (« Pour » de l’Atelier, le champ `classes`) : CLASSE TEST', premiere(P, DYL)); finir('D9', o, 'D3'); await o.ctx.close(); }
  /* D4 l'heure reportée d'une autre classe, écrite par le site */
  { hubAvec(); const o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); await lancerIci(o.pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(o.pg, 'aud-g1-hyp'); await o.pg.keyboard.press('ArrowRight'); await p(500); const cl = await finReporter(o.pg); await p(1500);
    dire('  [D] D4 3E Charles de Gaulle joue la séance 1 et reporte (le site écrit) : ' + paquets().join(' | ')); const P = await projeter(o.pg); situation('D4', 'l’heure reportée d’une autre classe (3E Charles de Gaulle, paquet écrit par le site) : CLASSE TEST', premiere(P, DYL)); finir('D9', o, 'D4'); await o.ctx.close(); }
  /* D5 une heure lancée puis « Annuler cette heure » */
  { hubAvec(); const o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); const e0 = ECR.length; await lancerIci(o.pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(o.pg, 'aud-a1-consigne'); await p(2500); const avant = paquets();
    const vis = await o.pg.isVisible('#dr-annul').catch(() => false); if (vis) await o.pg.click('#dr-annul'); else await o.pg.evaluate(() => dr_annulDemander()); await p(800); await o.pg.click('#gannul-oui').catch(() => {}); await p(4000);
    dire('  [D] D5 « Annuler cette heure » (' + (vis ? 'le bouton' : 'dr_annulDemander()') + ') : avant ' + (avant.join(' | ') || 'aucun paquet') + ' · après ' + (paquets().join(' | ') || 'aucun paquet') + ' · écrit pendant : ' + ecritsDepuis(e0).length + ' chemins');
    const P = await projeter(o.pg); situation('D5', '3E Charles de Gaulle : une heure lancée (7 diapos) puis « Annuler cette heure »', premiere(P, CHA)); finir('D9', o, 'D5'); await o.ctx.close(); }
  /* D6 une heure lancée en mode test, close ; et une répétition */
  { hubAvec(); const o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); await pilule(o.pg); const e0 = ECR.length; await lancerIci(o.pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(o.pg, 'aud-g1-hyp'); await finSansDecider(o.pg); await p(1500);
    dire('  [D] D6 en mode test, close : écrit au hub hors /site/tableau_test : ' + (ecritsDepuis(e0).filter(x => !/tableau_test/.test(x)).join(', ') || 'rien') + ' · ' + (paquets().join(' | ') || 'aucun paquet'));
    await o.ctx.close(); const o2 = await ouvrir({ h: '14:00', jour: '2026-09-14' }); const P = await projeter(o2.pg); situation('D6', '3E Charles de Gaulle : une heure jouée et close en mode test (vue d’un autre appareil, hors mode test)', premiere(P, CHA)); finir('D9', o2, 'D6'); await o2.ctx.close(); }
  { hubAvec(); const o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); const e0 = ECR.length; await caseDe(o.pg, '2026-09-14', '08:57-09:52', CHA); await clicTexte(o.pg, '#edt-modale button', 'Préparer'); await p(4000);
    const r = await o.pg.evaluate(() => { const b = document.getElementById('at-jouer'); if (b && b.offsetParent !== null) { b.click(); return 'le bouton de l’Atelier (#at-jouer)'; } if (typeof lancerRepetition === 'function') { lancerRepetition(); return 'lancerRepetition()'; } return null; }); await p(2500);
    for (let k = 0; k < 8; k++) { await o.pg.keyboard.press('ArrowRight'); await p(350); } const rep = await o.pg.evaluate(() => !!S.repetition); await o.pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(x => x.offsetParent !== null && /Arrêter/.test(x.innerText || '')); if (b) b.click(); }); await p(1500);
    dire('  [D] D6b une répétition de la séance 1 (' + r + ', S.repetition = ' + rep + '), 8 diapos, arrêtée : écrit au hub : ' + (ecritsDepuis(e0).join(', ') || 'rien') + ' · ' + (paquets().join(' | ') || 'aucun paquet'));
    const P = await projeter(o.pg); situation('D6b', '3E Charles de Gaulle : une répétition de la séance 1', premiere(P, CHA)); finir('D9', o, 'D6b'); await o.ctx.close(); }
  /* D7 l'appel coché avant l'heure */
  { hubAvec(); const o = await ouvrir({ h: '08:30', jour: '2026-09-14' }); const e0 = ECR.length; await caseDe(o.pg, '2026-09-14', '08:57-09:52', CHA); await p(1500); const n = await o.pg.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-appel .edt-el')).filter(x => !x.disabled); if (b[0]) { b[0].click(); return b.length; } return 0; }); await p(2000);
    dire('  [D] D7 l’appel de la case du lundi, avant l’heure : ' + n + ' boutons, 1 cliqué · écrit : ' + (ecritsDepuis(e0).join(', ') || 'rien') + ' · ' + (paquets().join(' | ') || 'aucun paquet')); await fermerEdt(o.pg);
    const P = await projeter(o.pg); dire('  [D] D7 à 08:30 : ' + dirCase(P.find(x => CHA.test(x.classe) && x.iso === '2026-09-14'))); await o.ctx.close();
    const o2 = await ouvrir({ h: '10:30', jour: '2026-09-14' }); const P2 = await projeter(o2.pg); dire('  [D] D7 à 10:30, l’heure jamais lancée : ' + semaine(P2, CHA).slice(0, 3).join(' ‖ ')); situation('D7', '3E Charles de Gaulle : l’appel coché avant l’heure, puis l’heure jamais lancée', premiere(P2, CHA)); finir('D9', o2, 'D7'); await o2.ctx.close(); }
  dire('  [D] LE COMPTE : ' + D_RES.filter(x => x[2] === 2).length + ' situations sur ' + D_RES.length + ' font proposer la séance 2 : ' + D_RES.map(x => x[0] + '=' + x[2]).join(' ')); };

/* ══ C · rattraper une heure ══ */
const partieC = async () => {
  hubAvec(); const o = await ouvrir({ h: '14:00', jour: '2026-09-17' }); const pg = o.pg; const P = await projeter(pg);
  dire('  [C] jeudi 17/09 14:00, la semaine de 3E Charles de Gaulle : ' + semaine(P, CHA).join(' ‖ '));
  const m = await caseDe(pg, '2026-09-14', '08:57-09:52', CHA); await capt(pg, 'C1-case-passee'); dire('  [C] C1 la case du lundi (passée, pas jouée) : « ' + m.t.slice(0, 400) + ' »'); dire('  [C] C1 ses boutons : ' + JSON.stringify(m.btns));
  const opts = await pg.evaluate(() => Array.from(document.querySelectorAll('#edt-ou option')).filter(x => x.value).map(x => ({ v: x.value, l: x.textContent })));
  const auj = '2026-09-17'; dire('  [C] C1 « Déplacer cette heure, ou en ajouter une… » : ' + opts.length + ' créneaux ; les 6 premiers : ' + opts.slice(0, 6).map(x => x.l).join(' | ') + ' · dont ' + opts.filter(x => x.v.slice(0, 10) < auj).length + ' avant aujourd’hui, ' + opts.filter(x => x.v.slice(0, 10) === auj).length + ' aujourd’hui');
  verif('C1', !m.btns.some(b => /lancer|Rattraper|Reprendre/i.test(b)), 'la case « passée · pas jouée » ne propose aucun lancement (ni « Ouvrir le pilotage et lancer », ni « Rattraper »)', m.btns);
  /* C2 « ajouter une heure » aujourd'hui, sur un créneau libre après maintenant, depuis la case passée */
  const libre = opts.find(x => /\|\+$/.test(x.v) && x.v.slice(0, 10) === auj && x.v.split('|')[1] > '14:00') || opts.find(x => /\|\+$/.test(x.v) && x.v.slice(0, 10) >= auj);
  let ajout = null; if (libre) { const e0 = ECR.length; await pg.selectOption('#edt-ou', libre.v).catch(() => {}); await p(2500); ajout = libre.v.split('|'); dire('  [C] C2 « ' + libre.l + ' » choisi : écrit ' + ecritsDepuis(e0).join(', ')); }
  await fermerEdt(pg); const P1 = await projeter(pg); dire('  [C] C2 la semaine après : ' + semaine(P1, CHA).join(' ‖ '));
  const cible = ajout ? P1.find(x => CHA.test(x.classe) && x.iso === ajout[0] && x.cr === ajout[1]) : premiere(P1, CHA); dire('  [C] C2 la case où lancer : ' + dirCase(cible));
  /* l'appel avant l'heure : un absent (pour lire la phrase aux absents) */
  await caseDe(pg, cible.iso, cible.cr, CHA); await p(1200); await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-appel .edt-el')).filter(x => !x.disabled)[0]; if (b) b.click(); }); await p(1500); await fermerEdt(pg);
  const e1 = ECR.length; const L = await lancerIci(pg, cible.iso, cible.cr, CHA); const vus = await jouerJusqua(pg, 'aud-g1-hyp'); const ap = await ici_(pg); if (/0 \//.test(ap.compte)) { await pg.keyboard.press('ArrowRight'); await p(500); } const nr = await repondre(pg); await p(1200);
  const cles = Object.keys(((djDe(sk0(HUBN)[0])['3E Charles de Gaulle'] || {}).heures) || {}); dire('  [C] C2 l’heure lancée (' + L.l + ') : la clé de l’heure au hub : ' + cles.join(', ') + ' · la date rangée : celle du jour du lancement (_drCleHeureDe, Date.now()), le créneau : celui de la case');
  /* les horaires que la fin d'heure écrit, étape par étape */
  await allerT5(pg); const H5 = []; for (let n = 1; n <= 7; n++) { await ouvrirEtape(pg, n); if (n === 2) { await clic(pg, '#f-tous'); } const t = lisible(await texteDe(pg, '#fin')); horaires(t).forEach(x => H5.push('étape ' + n + ' : ' + x)); }
  await capt(pg, 'C3-fin-heure'); const cl = await clore(pg); await p(2500); dire('  [C] C3 la fin d’heure : ' + H5.length + ' phrases avec une heure ou un jour :'); H5.forEach(x => dire('        ' + x));
  /* la Relecture : chaque face */
  await pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(pg);
  const faces = await pg.evaluate(() => Array.from(document.querySelectorAll('#ecran-relecture [data-f]')).filter(b => b.offsetParent !== null).map(b => ({ f: b.dataset.f, h: b.dataset.h || '', l: (b.innerText || '').trim() })));
  dire('  [C] C3 la Relecture : ' + faces.length + ' faces : ' + faces.map(x => x.l).join(' | ')); let nH = 0;
  for (const fa of faces) { await pg.evaluate(([f, h]) => { const b = Array.from(document.querySelectorAll('#ecran-relecture [data-f="' + f + '"]')).find(x => (x.dataset.h || '') === h); if (b) b.click(); }, [fa.f, fa.h]); await p(1800); await capt(pg, 'C3-relecture-' + fa.f + fa.h);
    const t = lisible(await pg.evaluate(() => { const z = document.getElementById('ecran-relecture'); return z ? z.innerText : ''; })); const hs = horaires(t); nH += hs.length; dire('  [C] C3   « ' + fa.l + ' » : ' + hs.length + ' phrases avec une heure ou un jour'); hs.forEach(x => dire('        ' + x)); }
  const copie = lisible(await pg.evaluate(() => { try { const r = document.querySelector('#ecran-relecture .recit, #rel .recit, #rel'); return r ? dr_recitTexteDe(dr_recitContenuED(r)) : ''; } catch (e) { return 'ERREUR ' + e.message; } }));
  dire('  [C] C3 le texte copié pour École Directe (dr_recitContenuED, ce que « Copier » met dans le presse-papiers) : ' + horaires(copie).length + ' phrases avec une heure ou un jour'); horaires(copie).forEach(x => dire('        ' + x));
  await pg.keyboard.press('Escape').catch(() => {}); await p(600);
  /* C4 la suite : la case suivante, et l'heure de la suite */
  const P2 = await projeter(pg); dire('  [C] C4 après la clôture (avec report) : ' + semaine(P2, CHA, '2026-09-26').join(' ‖ '));
  const su = P2.find(x => CHA.test(x.classe) && x.nature === 'prevu'); const ca = P2.find(x => CHA.test(x.classe) && x.iso === '2026-09-14'); dire('  [C] C4 la case passée du lundi reste : ' + dirCase(ca) + ' · la prochaine : ' + dirCase(su));
  finir('C9', o, 'C'); k15('C9', e1, 'C (l’heure jouée)'); await o.ctx.close();
  if (su) { const o2 = await ouvrir({ h: su.cr.slice(0, 5), jour: su.iso }); await lancerIci(o2.pg, su.iso, su.cr, CHA); const ord = await o2.pg.evaluate(() => { const E = seance().ecrans; return ordreHeure(S.heure).map(i => E[i].act); }); const re = await o2.pg.evaluate(() => { const E = seance().ecrans; const r = E.find(e => e.role === 'reactivation' && +e.heure === S.heure); return r ? JSON.stringify(r.blocs).slice(0, 500) : null; });
    dire('  [C] C4 l’heure de la suite, lancée le ' + su.iso + ' : ' + ord.join(' → ')); dire('  [C] C4 sa réactivation : ' + lisible(re)); horaires(re).forEach(x => dire('        (réactivation) ' + x)); finir('C9', o2, 'C4'); await o2.ctx.close(); } };

/* ══ P · une séance pas finie ══ */
const partieP = async () => {
  /* P1 l'heure pas close : l'onglet fermé au milieu */
  hubAvec(); let o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); await lancerIci(o.pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(o.pg, 'aud-g1-img'); await p(2500); const la = await ecran_(o.pg); await o.ctx.close();
  dire('  [P] P1 lundi 09:00, l’heure lancée, jouée jusqu’à « ' + (la && la.act) + ' », puis l’onglet fermé sans clore · ' + paquets().join(' | '));
  o = await ouvrir({ h: '09:20', jour: '2026-09-14' }); let P = await projeter(o.pg); dire('  [P] P1 lundi 09:20 (rouvert) : ' + semaine(P, CHA).slice(0, 3).join(' ‖ '));
  const m = await caseDe(o.pg, '2026-09-14', '08:57-09:52', CHA); dire('  [P] P1 la case du lundi : « ' + m.t.slice(0, 260) + ' » · boutons ' + JSON.stringify(m.btns));
  situation('P1', '3E Charles de Gaulle : l’heure de la séance 1 lancée, PAS close (onglet fermé) — la case d’après', premiere(P, CHA));
  const rp = await clicTexte(o.pg, '#edt-modale button', 'Reprendre l’heure'); await p(6000); await o.pg.keyboard.press('Escape').catch(() => {}); await p(600); const ici2 = await ecran_(o.pg); await capt(o.pg, 'P1-reprise');
  dire('  [P] P1 « ▶ Reprendre l’heure » (' + rp + ') : l’heure reprend sur « ' + (ici2 && ici2.act) + ' » (on s’était arrêté sur « ' + (la && la.act) + ' »)');
  verif('P1', ici2 && la && ici2.eid === la.eid, '« Reprendre l’heure » reprend sur la diapo où l’on s’était arrêté', [la, ici2]); finir('P9', o, 'P1'); await o.ctx.close();
  o = await ouvrir({ h: '14:00', jour: '2026-09-15' }); P = await projeter(o.pg); dire('  [P] P1 le lendemain, mardi 14:00, l’heure toujours pas close : ' + semaine(P, CHA).slice(0, 3).join(' ‖ '));
  { const m2 = await caseDe(o.pg, '2026-09-14', '08:57-09:52', CHA); const r2 = await clicTexte(o.pg, '#edt-modale button', 'Reprendre l’heure'); await p(6000); await o.pg.keyboard.press('Escape').catch(() => {}); await p(500); const i3 = await ecran_(o.pg); await o.pg.keyboard.press('ArrowRight'); await p(4000);
    dire('  [P] P1 le lendemain, « ▶ Reprendre l’heure » sur la case du lundi (' + r2 + ') : reprend sur « ' + (i3 && i3.act) + ' » ; une diapo de plus · les heures au hub : ' + paquets().join(' | ')); P = await projeter(o.pg); dire('  [P] P1 puis : ' + semaine(P, CHA).slice(0, 3).join(' ‖ ')); }
  finir('P9', o, 'P1 lendemain'); await o.ctx.close();
  /* P2 l'heure close sans rien décider (« Clore quand même ») */
  hubAvec(); o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); await lancerIci(o.pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(o.pg, 'aud-g1-hyp'); await o.pg.keyboard.press('ArrowRight'); await p(500);
  await allerT5(o.pg); await clic(o.pg, '#f-suivante'); const A = await lignesFin(o.pg); await ouvrirEtape(o.pg, 7); const cl = await clore(o.pg); await p(2000);
  dire('  [P] P2 étape 2 : ' + A.lignes.length + ' diapos non faites, laissées sans décision · la garde : « ' + lisible(cl.garde).slice(0, 300) + ' » · ' + paquets().join(' | '));
  P = await projeter(o.pg); dire('  [P] P2 après : ' + semaine(P, CHA).slice(0, 3).join(' ‖ ')); situation('P2', '3E Charles de Gaulle : séance 1 jouée jusqu’à « Groupe 1 : l’hypothèse », 9 diapos non faites SANS décision, close (« Clore quand même »)', premiere(P, CHA)); finir('P9', o, 'P2'); await o.ctx.close(); };

/* ══ A · une autre séance que celle proposée (la 4 à la place de la 1) ══ */
const partieA = async () => {
  hubAvec(st => { sk0(st).slice(0, 3).forEach(k => { st.site['3e'].chapitres[0].seances[k].classes = ['CLASSE TEST']; }); });
  let o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); let P = await projeter(o.pg); dire('  [A] les séances 1 à 3 réservées à CLASSE TEST (« Pour », le champ `classes`) : 3E Charles de Gaulle : ' + semaine(P, CHA).slice(0, 3).join(' ‖ '));
  const L = await lancerIci(o.pg, '2026-09-14', '08:57-09:52', CHA); const tit = await o.pg.evaluate(() => (seance().title || seance().titre || '')); const vus = await jouerJusqua(o.pg, null); const cl = await finSansDecider(o.pg); await p(2000);
  dire('  [A] lundi : la case lance « ' + tit + ' », ' + vus.length + ' diapos jouées, close · ' + paquets().join(' | ')); await o.ctx.close();
  /* Paul rend les séances 1 à 3 à toutes les classes */
  sk0(HUBN).slice(0, 3).forEach(k => posH(SE(k) + '/classes', null));
  o = await ouvrir({ h: '14:00', jour: '2026-09-15' }); P = await projeter(o.pg); dire('  [A] la réservation retirée ; mardi 14:00 : ' + semaine(P, CHA).join(' ‖ '));
  const lu = P.find(x => CHA.test(x.classe) && x.iso === '2026-09-14'); const ma = premiere(P, CHA); dire('  [A] la case du lundi : ' + dirCase(lu) + ' · la prochaine : ' + dirCase(ma));
  const file = P.filter(x => CHA.test(x.classe) && x.nature === 'prevu').map(x => 'S' + seanceDe(x) + ' h' + x.heure + '/' + x.sur); dire('  [A] la file (4 semaines) : ' + file.join(' · '));
  const ca = await cartes(o.pg); dire('  [A] les cartes : ' + ca.join(' ‖ '));
  const term = await o.pg.evaluate(() => { try { const ch = (EDT_CHAP['3e'] || [])[0]; return edtListe(ch.seances).sort((a, b) => (+a.ordre) - (+b.ordre)).map(s => 'S' + s.ordre + ' ' + (edtSeanceEtat(s, '3E Charles de Gaulle').finie ? 'finie' : (edtHeuresJouees(s, '3E Charles de Gaulle') ? 'commencée' : '—'))); } catch (e) { return ['ERREUR ' + e.message]; } });
  dire('  [A] edtSeanceEtat, séance par séance (ce que lisent la file, la case, « Le parcours du chapitre ») : ' + term.join(' · '));
  const Ls = await lancerIci(o.pg, ma.iso, ma.cr, CHA); const E = await eidsDe(o.pg); dire('  [A] mardi : la case lance la séance ' + seanceDe(ma) + ' : ' + E.slice(0, 6).map(e => '« ' + e.act + ' »').join(' → '));
  const plan = E.find(e => /parcours/i.test(e.act || '')); if (plan) { await allerA(o.pg, plan.eid); await p(900); await capt(o.pg, 'A-parcours'); dire('  [A] « ' + plan.act + ' » au pilote : « ' + lisible(await texteDe(o.pg, '#mur')).slice(0, 600) + ' »');
    const marques = await o.pg.evaluate(() => Array.from(document.querySelectorAll('#mur [class*="fait"], #mur [class*="joue"], #mur .faite')).map(x => x.className + ' : ' + (x.innerText || '').replace(/\s+/g, ' ').slice(0, 60))); dire('  [A] ses marques « faite » : ' + JSON.stringify(marques).slice(0, 500)); }
  const re = E.find(e => e.role === 'reactivation'); dire('  [A] la réactivation de mardi : ' + (re ? lisible(JSON.stringify((await o.pg.evaluate(id => (seance().ecrans.find(e => e.eid === id) || {}).blocs, re.eid)) || [])).slice(0, 400) : 'aucune diapo de réactivation'));
  const tous = lisible(await o.pg.evaluate(() => document.body.innerText)); const mots = (tous.match(/[^.]{0,60}\b(non faite|pas faite|non jouée|pas jouée|sautée|manquée)\b[^.]{0,40}/gi) || []); dire('  [A] à l’écran du pilote, les mots « non faite / pas faite / non jouée / pas jouée / sautée / manquée » : ' + mots.length + (mots.length ? ' : ' + mots.slice(0, 4).join(' | ') : ''));
  finir('A9', o, 'A'); await o.ctx.close();
  o = await ouvrir({ h: '14:00', jour: '2026-09-15' }); await o.pg.evaluate(() => edtOuvrir()); await p(2500); const sem = lisible(await texteDe(o.pg, '#edt-ecran')); const m2 = (sem.match(/[^.]{0,60}\b(non faite|pas faite|non jouée|pas jouée|sautée|manquée)\b[^.]{0,40}/gi) || []); dire('  [A] dans la semaine de l’emploi du temps : ' + m2.length + ' fois ces mots' + (m2.length ? ' : ' + m2.slice(0, 4).join(' | ') : '')); await capt(o.pg, 'A-semaine');
  await fermerEdt(o.pg); await ouvrirAtelier(o.pg).catch(() => {}); await o.pg.evaluate(() => { try { atOnglet('chapitres'); } catch (e) {} }); await p(2000); await capt(o.pg, 'A-mes-chapitres'); const mc = lisible(await texteDe(o.pg, '#at-zone') || await o.pg.evaluate(() => document.body.innerText)); const m3 = (mc.match(/[^.]{0,60}\b(jouée|non faite|pas faite|non jouée|pas jouée|finie|faite)\b[^.]{0,40}/gi) || []);
  dire('  [A] « Mes chapitres » : ' + m3.length + ' mentions de jouée / faite / finie' + (m3.length ? ' : ' + m3.slice(0, 5).join(' | ') : '')); finir('A9', o, 'A mes chapitres'); await o.ctx.close(); };

/* ══ N · la numérotation ══ */
const partieN = async () => {
  hubAvec(st => { const k = sk0(st)[0]; const d = st.site['3e'].chapitres[0].seances[k].deroule; d.activites.forEach(a => { a.num = a.num + 2; }); });
  let o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); await lancerIci(o.pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(o.pg, 'aud-g1-hyp'); await o.pg.keyboard.press('ArrowRight'); await p(500); await repondre(o.pg); await p(800);
  await allerT5(o.pg); await clic(o.pg, '#f-suivante'); const A = await lignesFin(o.pg); dire('  [N] activités numérotées 3 et 4 (comme une numérotation du chapitre) · la fin d’heure, étape 2 : ' + A.lignes.slice(0, 3).map(l => '« ' + l.t.slice(0, 80) + ' »').join(' | '));
  await clic(o.pg, '#f-tous'); await ouvrirEtape(o.pg, 7); await clore(o.pg); await p(2000);
  await o.pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(o.pg); const rec = lisible(await o.pg.evaluate(() => { const z = document.getElementById('ecran-relecture'); return z ? z.innerText : ''; }));
  const nums = t => (t.match(/(Activité|activité|A)\s?\d\b[^.;|]{0,40}/g) || []).slice(0, 8); dire('  [N] la Relecture (le récit), avant la renumérotation : ' + JSON.stringify(nums(rec)));
  const sk = sk0(HUBN)[0]; const C = SE(sk) + '/deroule_joue/3E Charles de Gaulle'; const cop = lireH(C) || {}; const H = Object.values(cop.heures || {})[0] || {};
  dire('  [N] au hub, ce que l’heure range : decisionsParActivite ' + JSON.stringify(Object.keys(H.decisionsParActivite || {})) + ' (par identité) · decisionsParEcran ' + Object.keys(H.decisionsParEcran || {}).length + ' (par eid) · parActivite ' + JSON.stringify(Object.keys(H.parActivite || {})).slice(0, 120) + ' · les textes rangés qui portent un numéro : ' + JSON.stringify((JSON.stringify(cop).match(/Activit[ée] \d[^"\\]{0,30}/g) || []).slice(0, 6)));
  await o.ctx.close();
  /* la renumérotation : chaque séance repart à 1 (ici : 3, 4 → 1, 2), dans la trame ET dans la copie de la classe, comme le ferait le lien de l'Atelier */
  const acts = lireH(SE(sk) + '/deroule/activites') || []; (Array.isArray(acts) ? acts : Object.values(acts)).forEach((a, i) => { posH(SE(sk) + '/deroule/activites/' + i + '/num', a.num - 2); });
  dire('  [N] renuméroté au hub (trame) : ' + JSON.stringify((lireH(SE(sk) + '/deroule/activites') || []).map(a => a.id + '=' + a.num)) + ' · la copie de la classe a-t-elle ses propres activités ? ' + JSON.stringify(Object.keys(cop).sort()));
  o = await ouvrir({ h: '15:00', jour: '2026-09-15' }); const c2 = await caseDe(o.pg, '2026-09-15', '15:07-16:02', CHA); dire('  [N] après : la case du mardi : « ' + c2.t.slice(0, 200) + ' »'); await fermerEdt(o.pg);
  const L = await lancerIci(o.pg, '2026-09-15', '15:07-16:02', CHA); const re = await o.pg.evaluate(() => { const E = seance().ecrans; const r = E.find(e => e.role === 'reactivation' && +e.heure === S.heure); return r ? JSON.stringify(r.blocs) : null; });
  dire('  [N] après : la réactivation de la suite (« La dernière fois », « À reprendre ») : ' + JSON.stringify(nums(lisible(re))));
  const vol = await o.pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di], #volet .vig')).map(x => (x.innerText || '').replace(/\s+/g, ' ').trim()).filter(t => /\bA\d|activité \d/i.test(t)).slice(0, 4)); dire('  [N] après : le volet du pilote : ' + JSON.stringify(vol));
  await allerT5(o.pg); await clic(o.pg, '#f-suivante'); const A2 = await lignesFin(o.pg); dire('  [N] après : la fin d’heure de la suite, étape 2 : ' + A2.lignes.slice(0, 3).map(l => '« ' + l.t.slice(0, 80) + ' »').join(' | ')); await o.pg.keyboard.press('Escape').catch(() => {}); await o.ctx.close();
  o = await ouvrir({ h: '17:00', jour: '2026-09-15' }); await caseDe(o.pg, '2026-09-14', '08:57-09:52', CHA); await clicTexte(o.pg, '#edt-modale button', 'Relire cette heure'); await p(4000); await garde(o.pg);
  const rec2 = lisible(await o.pg.evaluate(() => { const z = document.getElementById('ecran-relecture'); return z ? z.innerText : ''; })); dire('  [N] après : la Relecture de l’heure du lundi : ' + JSON.stringify(nums(rec2))); finir('N9', o, 'N'); await o.ctx.close(); };

/* ══ E · D2c, la suite : la grille ouverte avant la fin de la case du matin, laissée ouverte ; la case de l'après-midi cliquée, puis lancée ══ */
const partieE = async () => { const j = '2026-09-22', c1 = '10:07-11:02', c2 = '16:04-16:59';
  hubAvec(); const o = await ouvrir({ h: '10:07', jour: j }); const pg = o.pg; await pg.evaluate(() => edtOuvrir()); await p(2600);
  const lire = () => pg.evaluate(([jj, cr]) => { const x = Array.from(document.querySelectorAll('.edt-clic')).find(e => (e.getAttribute('onclick') || '').indexOf(jj + '|' + cr) >= 0 && /CLASSE TEST/.test(e.innerText || '')); return x ? (x.innerText || '').replace(/\s+/g, ' ').trim() : null; }, [j, c2]);
  const av = await lire(); await pg.clock.fastForward('02:30:00').catch(() => {}); await p(2500); const ap = await lire(); const hIci = await pg.evaluate(() => new Date().toTimeString().slice(0, 5));
  const sn = await pg.evaluate(([jj, cr]) => { const k = Object.keys(EDT_VUE.cellules || {}).find(k => k.indexOf(jj + '|' + cr) === 0 && (EDT_VUE.cellules[k].classeMjpc === 'CLASSE TEST')); const c = k && EDT_VUE.cellules[k]; return c ? { nature: c.nature, titre: c.titre, snum: c.snum, heure: c.heure, sur: c.sur } : null; }, [j, c2]);
  dire('  [E] la grille ouverte le ' + j + ' à 10:07 (la case du matin en cours), laissée ouverte jusqu’à ' + hIci + ' : la case ' + c2 + ' disait « ' + av + ' », elle dit « ' + ap + ' » · sa cellule : ' + JSON.stringify(sn) + (sn && sn.snum != null ? ' = séance ' + ORDRE(sn.snum) : ''));
  const ok = await pg.evaluate(([jj, cr]) => { const x = Array.from(document.querySelectorAll('.edt-clic')).find(e => (e.getAttribute('onclick') || '').indexOf(jj + '|' + cr) >= 0 && /CLASSE TEST/.test(e.innerText || '')); if (!x) return false; x.click(); return true; }, [j, c2]); await p(1200);
  const t = lisible(await texteDe(pg, '#edt-modale')); await capt(pg, 'E-grille-restee-ouverte-case'); dire('  [E] la case cliquée (sans rouvrir la grille) : « ' + t.slice(0, 160) + ' »');
  const l = await clicTexte(pg, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await p(4500); const ouv = await pg.evaluate(() => { const b = document.getElementById('o-lancer'); return !!(b && b.offsetParent !== null); }); if (ouv) { await pg.click('#o-lancer').catch(() => {}); await p(3500); }
  const tit = await pg.evaluate(() => { try { return { t: seance().title || seance().titre, snum: ATVUES.snum }; } catch (e) { return null; } }); await capt(pg, 'E-lance');
  dire('  [E] « ▶ Ouvrir le pilotage et lancer » (' + l + ') : la séance lancée : ' + JSON.stringify(tit) + (tit && tit.snum != null ? ' = séance ' + ORDRE(tit.snum) : ''));
  situation('D2c', 'CLASSE TEST : la grille ouverte pendant la case du matin et laissée ouverte, la case de l’après-midi cliquée et lancée (la séance lancée)', tit && tit.snum != null ? { iso: j, cr: c2, nature: 'lancée', titre: tit.t, snum: tit.snum } : null);
  await o.pg.keyboard.press('Escape').catch(() => {}); const o2 = await ouvrir({ h: '12:40', jour: j }); const P = await projeter(o2.pg); dire('  [E] la même case, grille rouverte à 12:40 (sans le lancement ci-dessus, un autre appareil) : ' + dirCase(P.find(x => DYL.test(x.classe) && x.iso === j && x.cr === c2)));
  finir('E9', o, 'E'); finir('E9', o2, 'E bis'); await o.ctx.close(); await o2.ctx.close(); };

/* ══ G · le geste complet : pendant l'essai, « 🛠 Panneau prof », puis la pastille « Mode test actif » ══ */
const partieG = async () => {
  const F = [['production 8.81.1', FICHIER], ['8.78.2', V8782], ['8.79.0', V879], ['8.80.0', V8800]].filter(x => x[1] && fs.existsSync(x[1]) && (!process.env.MJPC_SEUL || process.env.MJPC_SEUL.split(',').includes(x[0].split(' ')[0])));
  for (const [nom, f] of F) { hubAvec(); const o = await ouvrir({ fichier: f, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; const a = await pilule(pg); await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await p(500);
    await lancerIci(pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg, 'aud-a1-consigne'); await p(1500); const e1 = ECR.length;
    const vb = await pg.isVisible('#tprof-btn').catch(() => false); if (vb) await pg.click('#tprof-btn').catch(() => {}); await p(1200); await capt(pg, 'G-' + nom.split(' ')[0] + '-panneau-pendant-heure');
    const pill = await pg.evaluate(() => { const b = document.getElementById('tprof-testpill'); if (!b) return null; const r = b.getBoundingClientRect(); return { visible: b.offsetParent !== null && r.width > 0, texte: (b.innerText || '').replace(/\s+/g, ' ').trim(), bulle: b.title || '' }; });
    if (pill && pill.visible) await pg.click('#tprof-testpill').catch(() => {}); await p(1200); const t = await pg.evaluate(() => m8TestOn()); const dial = o.boites.slice();
    await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await p(600); await pg.keyboard.press('ArrowRight'); await p(400); await pg.keyboard.press('ArrowRight'); await p(15000);
    const w = ecritsDepuis(e1).filter(x => !/tableau_test/.test(x));
    dire('  [G] ' + nom + ' · pendant l’essai : « 🛠 Panneau prof » visible ' + vb + ' ; la pastille : ' + JSON.stringify(pill) + ' ; cliquée → m8TestOn() = ' + t + ' ; une boîte ou un avertissement : ' + (dial.join(' ; ') || 'aucun') + ' · 2 diapos, 15 s : ' + w.length + ' chemins au « vrai » hub : ' + w.join(', '));
    dire('  [G]   le paquet : ' + (paquets().join(' | ') || 'aucun'));
    verif('G1', pill && pill.visible && t === false && w.some(x => /deroule_joue/.test(x)), nom + ' : pendant un essai, le Panneau prof s’ouvre, la pastille se clique, le mode test s’éteint sans un mot, et l’heure écrit au vrai deroule_joue', { vb, pill, t, w: w.slice(0, 4) });
    finir('G9', o, nom); await o.ctx.close(); } };

/* ══ Q · le texte que « Copier pour École Directe » met dans le presse-papiers : une heure jouée DANS son créneau (lundi 09:00), close ══ */
const partieQ = async () => { hubAvec(); const o = await ouvrir({ h: '09:00', jour: '2026-09-14' }); const pg = o.pg;
  await caseDe(pg, '2026-09-14', '08:57-09:52', CHA); await p(1000); await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-appel .edt-el')).filter(x => !x.disabled)[0]; if (b) b.click(); }); await p(1200); await fermerEdt(pg);
  await lancerIci(pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg, 'aud-g1-hyp'); const ap = await ici_(pg); if (/0 \//.test(ap.compte)) { await pg.keyboard.press('ArrowRight'); await p(500); } await repondre(pg); await p(800); await finReporter(pg); await p(2500);
  await pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(pg); await pg.evaluate(() => { const b = document.querySelector('#ecran-relecture [data-f="recit"]'); if (b) b.click(); }); await p(1800);
  const ed = await pg.evaluate(() => { try { const rec0 = document.querySelector('#rel .recit') || document.querySelector('.recit'); const tete = document.querySelector('#rel .dr-recit-tete'); const qb = document.querySelector('#rel .dr-recit-queue .bilan'); const html0 = (tete ? tete.innerHTML : '') + dr_recitContenuED(rec0) + (qb ? qb.outerHTML : ''); return dr_recitTexteDe(html0); } catch (e) { return 'ERREUR ' + e.message; } });
  const t = lisible(ed); await capt(pg, 'Q-relecture-recit'); const hs = horaires(t); dire('  [Q] une heure jouée dans son créneau (lundi 08:57, lancée à 09:00), 3 réponses, 9 diapos reportées, close · le texte de « Copier pour École Directe » : ' + t.length + ' signes, ' + hs.length + ' phrases avec une heure ou un jour :'); hs.forEach(x => dire('        ' + x));
  const abs = lisible(await pg.evaluate(() => { const z = Array.from(document.querySelectorAll('#ecran-relecture *')).find(x => /LE MOT POUR CHAQUE ABSENT/i.test(x.innerText || '') && x.children.length < 30); return z ? z.innerText : ''; })); dire('  [Q] le mot aux absents : ' + horaires(abs).join(' | '));
  finir('Q9', o, 'Q'); await o.ctx.close(); };

/* ══ R · le rattrapage d'une classe ordinaire (CLASSE TEST : l'horloge du pilote est la vraie — `dr_horlogeCase` ne recale que la classe d'essai) ══ */
const partieR = async () => { hubAvec(); const auj = '2026-09-17'; const o = await ouvrir({ h: '14:00', jour: auj }); const pg = o.pg; const P = await projeter(o.pg);
  dire('  [R] jeudi 17/09 14:00, la semaine de CLASSE TEST : ' + semaine(P, DYL).join(' ‖ '));
  const pas = P.find(x => DYL.test(x.classe) && x.nature === 'passee'); const m = await caseDe(pg, pas.iso, pas.cr, DYL); dire('  [R] la case passée ' + pas.iso + ' ' + pas.cr + ' : boutons ' + JSON.stringify(m.btns));
  const opts = await pg.evaluate(() => Array.from(document.querySelectorAll('#edt-ou option')).filter(x => x.value).map(x => ({ v: x.value, l: x.textContent })));
  const libre = opts.find(x => /\|\+$/.test(x.v) && x.v.slice(0, 10) === auj && x.v.split('|')[1] > '14:00'); if (!libre) { dire('  [R] aucun créneau libre aujourd’hui après 14:00'); await o.ctx.close(); return; }
  await pg.selectOption('#edt-ou', libre.v).catch(() => {}); await p(2500); const aj = libre.v.split('|'); await fermerEdt(pg); dire('  [R] « ' + libre.l + ' » choisi depuis la case passée');
  await caseDe(pg, aj[0], aj[1], DYL); await p(1000); await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-appel .edt-el')).filter(x => !x.disabled)[0]; if (b) b.click(); }); await p(1200); await fermerEdt(pg);
  const e1 = ECR.length; const L = await lancerIci(pg, aj[0], aj[1], DYL); const h0 = await pg.evaluate(() => new Date().toTimeString().slice(0, 5)); await jouerJusqua(pg, 'aud-g1-hyp'); const ap = await ici_(pg); if (/0 \//.test(ap.compte)) { await pg.keyboard.press('ArrowRight'); await p(500); } await repondre(pg); await p(800);
  const sl = Object.keys(djDe(sk0(HUBN)[0]))[0]; dire('  [R] lancée à ' + h0 + ' (montre du navigateur), la case de ' + aj[1] + ' : la clé au hub : ' + Object.keys(((djDe(sk0(HUBN)[0])[sl] || {}).heures) || {}).join(', '));
  await allerT5(pg); const H5 = []; for (let n = 1; n <= 7; n++) { await ouvrirEtape(pg, n); if (n === 2) await clic(pg, '#f-tous'); const tt = lisible(await pg.evaluate(() => { const z = document.querySelector('#fin .pp-corps, #fin .pp-sec, #fin'); return z ? z.innerText : ''; })); horaires(tt).forEach(x => H5.push('étape ' + n + ' : ' + x)); }
  await clore(pg); await p(2500); dire('  [R] la fin d’heure : ' + [...new Set(H5)].length + ' phrases avec une heure ou un jour :'); [...new Set(H5)].slice(0, 8).forEach(x => dire('        ' + x));
  await pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(pg);
  const faces = await pg.evaluate(() => Array.from(document.querySelectorAll('#ecran-relecture [data-f]')).filter(b => b.offsetParent !== null).map(b => ({ f: b.dataset.f, h: b.dataset.h || '', l: (b.innerText || '').trim() })));
  for (const fa of faces) { await pg.evaluate(([f, h]) => { const b = Array.from(document.querySelectorAll('#ecran-relecture [data-f="' + f + '"]')).find(x => (x.dataset.h || '') === h); if (b) b.click(); }, [fa.f, fa.h]); await p(1800); await capt(pg, 'R-relecture-' + fa.f + fa.h);
    const t = lisible(await pg.evaluate(() => { const z = document.getElementById('ecran-relecture'); return z ? z.innerText : ''; })); const hs = horaires(t); dire('  [R]   « ' + fa.l + ' » : ' + hs.length + ' phrases avec une heure ou un jour'); hs.slice(0, 14).forEach(x => dire('        ' + x)); }
  await pg.evaluate(() => { const b = document.querySelector('#ecran-relecture [data-f="recit"]'); if (b) b.click(); }); await p(1800);
  const ed = lisible(await pg.evaluate(() => { try { const rec0 = document.querySelector('#rel .recit') || document.querySelector('.recit'); const tete = document.querySelector('#rel .dr-recit-tete'); const qb = document.querySelector('#rel .dr-recit-queue .bilan'); return dr_recitTexteDe((tete ? tete.innerHTML : '') + dr_recitContenuED(rec0) + (qb ? qb.outerHTML : '')); } catch (e) { return 'ERREUR ' + e.message; } }));
  dire('  [R] le texte de « Copier pour École Directe » (récit) : ' + horaires(ed).length + ' phrases avec une heure ou un jour :'); horaires(ed).forEach(x => dire('        ' + x));
  await pg.keyboard.press('Escape').catch(() => {}); const P2 = await projeter(pg); dire('  [R] après : ' + semaine(P2, DYL, '2026-09-26').slice(0, 8).join(' ‖ '));
  finir('R9', o, 'R'); k15('R9', e1, 'R'); await o.ctx.close(); };

/* ══ H · le geste complet, par l'écran : pendant l'essai, « ✕ Fermer l'atelier » (il « ramène au panneau prof »), puis la pastille ══ */
const partieH = async () => {
  const F = [['production 8.81.1', FICHIER], ['8.78.2', V8782], ['8.79.0', V879], ['8.80.0', V8800]].filter(x => x[1] && fs.existsSync(x[1]) && (!process.env.MJPC_SEUL || process.env.MJPC_SEUL.split(',').includes(x[0].split(' ')[0])));
  for (const [nom, f] of F) { hubAvec(); const o = await ouvrir({ fichier: f, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; await pilule(pg); await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await p(500);
    await lancerIci(pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg, 'aud-a1-consigne'); await p(1500); const e1 = ECR.length;
    const fe = await clicTexte(pg, 'button', 'Fermer l’atelier'); await p(2000); const vb = await pg.isVisible('#tprof-btn').catch(() => false); const vp0 = await pg.isVisible('#tprof-testpill').catch(() => false);
    if (!vp0 && vb) { await pg.click('#tprof-btn').catch(() => {}); await p(1200); } const vp = await pg.isVisible('#tprof-testpill').catch(() => false); await capt(pg, 'H-' + nom.split(' ')[0] + '-panneau-pendant-essai');
    const lanceeAvant = await pg.evaluate(() => ({ lancee: !!S.lancee, close: !!S.close }));
    if (vp) await pg.click('#tprof-testpill').catch(() => {}); await p(1000); const t = await pg.evaluate(() => m8TestOn()); await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await p(20000);
    const w = ecritsDepuis(e1).filter(x => !/tableau_test/.test(x)); const lanceeApres = await pg.evaluate(() => ({ lancee: !!S.lancee, close: !!S.close }));
    dire('  [H] ' + nom + ' · pendant l’essai : « ✕ Fermer l’atelier » ' + fe + ' ; « 🛠 Panneau prof » visible ' + vb + ' ; la pastille visible ' + vp + ' ; cliquée → m8TestOn() = ' + t + ' ; l’heure : avant ' + JSON.stringify(lanceeAvant) + ', 20 s après ' + JSON.stringify(lanceeApres) + ' · ' + w.length + ' chemins au « vrai » hub : ' + w.join(', '));
    dire('  [H]   le paquet : ' + (paquets().join(' | ') || 'aucun') + ' · boîtes : ' + (o.boites.join(' ; ') || 'aucune'));
    const P = await projeter(pg); dire('  [H]   la case du lundi : ' + dirCase(P.find(x => CHA.test(x.classe) && x.iso === '2026-09-14')) + ' · CLASSE TEST : ' + dirCase(premiere(P, DYL)));
    finir('H9', o, nom); await o.ctx.close(); } };

/* ══ J · pendant l'essai, « ↗ Le site dans un nouvel onglet » : le mode test de l'onglet neuf, ce qu'il propose, ce qu'il écrit ══ */
const partieJ = async () => {
  const F = [['production 8.81.1', FICHIER], ['8.78.2', V8782], ['8.79.0', V879], ['8.80.0', V8800]].filter(x => x[1] && fs.existsSync(x[1]) && (!process.env.MJPC_SEUL || process.env.MJPC_SEUL.split(',').includes(x[0].split(' ')[0])));
  for (const [nom, f] of F) { hubAvec(); const o = await ouvrir({ fichier: f, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; await pilule(pg); await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await p(500);
    await lancerIci(pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg, 'aud-a1-consigne'); await p(1500); const e1 = ECR.length;
    const [nv] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), clicTexte(pg, 'button,a', 'Le site dans un nouvel onglet')]); if (!nv) { dire('  [J] ' + nom + ' : « ↗ Le site dans un nouvel onglet » n’a pas ouvert d’onglet'); finir('J9', o, nom); await o.ctx.close(); continue; }
    await nv.waitForLoadState('load').catch(() => {}); await p(5000); const u = nv.url().replace(/^file:\/\/[^?]*/, '…');
    const etat = await nv.evaluate(() => ({ test: typeof m8TestOn === 'function' ? m8TestOn() : null, rep: (() => { const b = document.getElementById('ses-reprise-oui'); return !!(b && b.offsetParent !== null); })(), repT: ((document.getElementById('ses-reprise-txt') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 200), pill: !!document.getElementById('tprof-btn') && document.getElementById('tprof-btn').offsetParent !== null })).catch(e => ({ err: e.message }));
    await capt(nv, 'J-' + nom.split(' ')[0] + '-nouvel-onglet'); dire('  [J] ' + nom + ' · « ↗ Le site dans un nouvel onglet » (' + u + ') : ' + JSON.stringify(etat));
    let w = []; if (etat.rep) { await nv.click('#ses-reprise-oui').catch(() => {}); await p(8000); const t2 = await nv.evaluate(() => m8TestOn()); for (let k = 0; k < 2; k++) { await nv.keyboard.press('ArrowRight'); await p(500); } await p(15000); w = ecritsDepuis(e1).filter(x => !/tableau_test/.test(x)); dire('  [J]   « Reprendre » dans l’onglet neuf : m8TestOn() = ' + t2 + ' · 2 diapos, 15 s : ' + w.length + ' chemins au « vrai » hub : ' + w.join(', ')); }
    else { await p(10000); w = ecritsDepuis(e1).filter(x => !/tableau_test/.test(x)); dire('  [J]   aucune reprise proposée ; en 10 s : ' + w.length + ' chemins au « vrai » hub' + (w.length ? ' : ' + w.join(', ') : '')); }
    dire('  [J]   le paquet : ' + (paquets().join(' | ') || 'aucun')); finir('J9', o, nom); await o.ctx.close(); } };

dire(''); dire('══ AUDIT GLOBAL II · ' + NOMF + ' · md5 ' + md5(FICHIER) + ' ══');
for (const [k, f] of [['K', partieK], ['M', partieM], ['D', partieD], ['E', partieE], ['G', partieG], ['H', partieH], ['J', partieJ], ['Q', partieQ], ['R', partieR], ['C', partieC], ['P', partieP], ['A', partieA], ['N', partieN]]) { if (!joue(k)) continue; dire(''); dire('— partie ' + k + ' · ' + new Date().toISOString().slice(11, 16) + ' UTC'); try { await f(); } catch (e) { verif(k, false, 'la partie ' + k + ' a levé', String(e && e.stack || e).slice(0, 600)); } }
dire(''); dire('--- fin : ' + nb + ' vérifications, ' + echecs + ' échec(s)');
fs.writeFileSync(path.join(OUT, 'sonde-II-' + NOMF + '-' + PARTIES.join('') + '.txt'), anon(R.join('\n')) + '\n');
await nav.close(); process.exit(0);
