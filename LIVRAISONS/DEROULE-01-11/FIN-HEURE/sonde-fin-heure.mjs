// LA SONDE DE LA FIN D'HEURE (MANDATS/DEROULE-01-11/MANDAT-FIN-HEURE.md, ㊲ ㊳) — par le geste, sous le faux hub RANGÉ COMME LE VRAI, qui REFUSE (HTTP 400) les
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
const PARTIES = String(process.env.MJPC_PARTIES || 'F,G,S,P,D,R,T').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
dire('C16 · sonde de la fin d’heure (㊲ ㊳) · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400), avec son flux (EventSource) · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

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
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') { const v = JSON.stringify(lireH(c)); if (RETARD && RETARD.qui === qui && RETARD.re.test(c)) { RETARD.n = (RETARD.n || 0) + 1; await p(RETARD.ms); } return v; } let bd = null; try { bd = JSON.parse(corps || 'null'); } catch (e) {}
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


/* ═══════════════════ LA SONDE DE LA FIN D'HEURE (MANDATS/DEROULE-01-11/MANDAT-FIN-HEURE.md, ㊲ ㊳) — par le geste ═══════════════════
   Le faux hub de l'audit (rangé comme le vrai, qui refuse les clés interdites), la trame de Paul reconstruite par l'audit (`trameDePaul`), l'horloge figée
   comme l'audit. Les parties (MJPC_PARTIES) :
   F  la fin d'heure (preuves 1, 7 ; 8 la Relecture) puis l'emploi du temps après la clôture (preuve 2) ; + ✎ Préparer avant (§3.9)
   G  une trame avec une activité suivante pas commencée : sa ligne unique (preuve 1)
   S  l'heure de la suite lancée, jouée, close sans report (preuve 3) — enchaînée après F, sur le même hub
   P  l'heure de la forme de celle de Paul, écrite par l'ANCIEN fichier (MJPC_ANCIEN) ; puis le nouveau la lit (preuve 4)
   D  une séance de deux heures : à l'heure 1 le bouton fait glisser à l'heure 2 ; l'emploi du temps inchangé (preuve 5)
   R  rien ne change ailleurs : la projection de l'emploi du temps, quatre semaines, toutes les classes, ancien et nouveau fichier (preuve 6)
   T  la fin d'heure en mode test : aucune écriture hors de /site/tableau_test (preuve 7, K15-test)
   Chaque partie dit ses erreurs JS, ses écritures refusées (HTTP 400) et ses écritures hors des chemins permis (la liste K15 du parcours). */
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
const NOMS = (() => { const st = store(); const el = []; Object.values(st.classes || {}).forEach(c => (c && c.eleves || []).forEach(x => el.push(x))); return [...new Set(el.join(' ').split(/\s+/).filter(x => x.length >= 3))].sort((a, b) => b.length - a.length); })();
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

/* ══ F · la fin d'heure (preuves 1, 7, 8) ; l'emploi du temps après (preuve 2) ; ✎ Préparer avant (§3.9) ══ */
let HUB_F = null;
const partieF = async (fichier, tag) => { neuf(null); const e0 = CHEMINS0();
  /* §3.9 : ✎ Préparer sur la case du mardi, avant tout */
  const o0 = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const P0 = await projection(o0.pg); dire('  [F] la semaine de la classe test AVANT (projection du site) : ' + semaineCharles(P0).join(' ‖ '));
  const cm = await caseEdt(o0.pg, '2026-09-15'); dire('  [F] §3.9 la case du mardi avant : « ' + cm.t.slice(0, 260) + ' »'); const ep = ECR.length; const pr = await o0.pg.evaluate(() => { const b = document.querySelector('#edt-modale button[data-preparer]'); if (!b) return false; b.click(); return true; }); await p(3500); await capt(o0.pg, tag + '-F0-preparer-mardi');
  const ecrPrep = ECR.slice(ep).map(x => x.m + ' ' + x.c); dire('  [F] §3.9 « ✎ Préparer » sur la case du mardi : ' + pr + ' · écritures au hub pendant la préparation : ' + ecrPrep.length + (ecrPrep.length ? ' (' + [...new Set(ecrPrep)].join(', ') + ')' : '')); finir('F', o0, 'Préparer'); await o0.ctx.close();
  /* l'heure */
  const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; const L0 = await lancerCase(pg, '2026-09-14'); await pg.keyboard.press('Escape'); await p(600);
  const vus = await jouerJusqua(pg, 'aud-g1-hyp'); dire('  [F] jouées : ' + vus.join(' → '));
  const ap = await ici_(pg); if (/0 \//.test(ap.compte)) { await pg.keyboard.press('ArrowRight'); await p(500); } const nr = await repondre(pg); await p(900);
  const F0 = await finies(pg); dire('  [F] finie() avant la fin d’heure, dans l’heure : ' + F0.filter(x => x.dansHeure).map(x => '« ' + x.act + ' » ' + (x.finie ? 'finie' : 'PAS finie')).join(' · '));
  await allerT5(pg); const e1 = await lignesFin(pg); await clic(pg, '#f-suivante'); const A = await lignesFin(pg); await capt(pg, tag + '-F1-etape2-avant');
  dire('  [F] étape ' + A.n + ' · la phrase du haut : « ' + A.quoi + ' »'); dire('  [F] le bouton : ' + JSON.stringify(A.tous)); dire('  [F] ' + A.lignes.length + ' lignes (cartes d’avant : ' + A.cartes + ') :'); A.lignes.forEach(l => dire('        [' + l.kind + ' · ' + l.n + '] ' + l.t + ' — ' + l.choix.join(' │ ')));
  dire('  [F] la liste des sept : ' + A.liste.join(' ‖ '));
  const attendu = ['Groupe 2 : Le lac', 'Groupe 2 : l’hypothèse', 'Groupe 3 : Pêcheurs en mer', 'Groupe 3 : l’hypothèse', 'Groupe 4 : Cathédrale gothique au bord de l’eau', 'Groupe 4 : l’hypothèse', 'Groupe 5 : Le Voyageur contemplant une mer de nuages', 'Groupe 5 : l’hypothèse', 'Le bilan'];
  verif('F1', A.lignes.length === 9 && attendu.every((t, i) => A.lignes[i] && A.lignes[i].t.indexOf(t) >= 0 && A.lignes[i].kind === 'diapo'), 'étape 2 : les 8 diapos non faites de l’activité en cours, une par ligne, puis « Le bilan », dans l’ordre', A.lignes.map(l => l.t.slice(0, 50)));
  verif('F1', !A.lignes.some(l => /Fin d.heure|Où en sommes/.test(l.t)), 'ni « Fin d’heure », ni la réactivation');
  verif('F1', A.tous && A.tous.visible && /^Reporter les 9 diapos non faites au début de la prochaine heure de cette classe$/.test(A.tous.t), 'le bouton du haut, visible sans défiler (1536 × 864), dit « Reporter les 9 diapos non faites au début de la prochaine heure de cette classe »', A.tous);
  verif('F1', /9 diapos : dis ce qu.elles deviennent/.test(A.liste.join(' ')), 'la liste des étapes dit « 9 diapos : dis ce qu’elles deviennent »', A.liste[1]);
  verif('F1', /reporter/.test(A.quoi) && /non fait/.test(A.quoi) && !/en réserve/.test(A.quoi), 'la phrase du haut cite les choix réellement proposés (dernière heure : pas « en réserve »)', A.quoi);
  const ec = ECR.length; await clic(pg, '#f-tous'); const B = await lignesFin(pg); await capt(pg, tag + '-F2-etape2-apres-un-clic');
  dire('  [F] après UN clic : le bouton ' + JSON.stringify(B.tous && B.tous.t) + ' · ' + B.lignes.map(l => l.choix.filter(c => /posé/.test(c)).join('')).join(', ') + ' · la liste : ' + B.liste[1]);
  verif('F1', B.lignes.length === 9 && B.lignes.every(l => l.choix.some(c => /^Reporter \[posé\]$/.test(c))), 'un clic : les 9 lignes portent « Reporter »', B.lignes.map(l => l.choix.filter(c => /posé/.test(c)).join('')));
  verif('F1', /tout est décidé/.test(B.liste[1] || ''), 'l’étape 2 se coche : « tout est décidé »', B.liste[1]);
  /* les autres étapes, puis clore */
  for (let n = 3; n <= 6; n++) { await ouvrirEtape(pg, n); if (n === 3) await clic(pg, '#f-rien'); }
  const cl = await clore(pg); dire('  [F] clôture : ' + JSON.stringify(cl).slice(0, 400)); await p(1500);
  const HS = heureHub(); const H = (HS[0] || {}).h || {}; const D = decisionsDe(H);
  dire('  [F] au hub, l’heure : clos ' + !!H.clos + ' · ' + (H.activites || []).length + ' diapos jouées · decisionsParEcran (' + D.length + ') : ' + D.map(x => '« ' + x.titre + ' » ' + x.choix).join(' ; ') + ' · decisionsParActivite : ' + JSON.stringify(Object.keys(H.decisionsParActivite || {}).map(k => k + '→' + H.decisionsParActivite[k].choix)));
  verif('F1', D.length === 9 && D.every(x => x.choix === 'reporter') && D.some(x => x.eid === 'aud-bilan') && attendu.every(t => D.some(x => x.titre === t)), 'au hub : une décision « reporter » par diapo non faite (9), « Le bilan » compris', D.map(x => x.titre + ' ' + x.choix));
  /* la Relecture, « Diapo par diapo » (§3.8) */
  await pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(pg);
  await pg.evaluate(() => { const b = document.querySelector('#ecran-relecture [data-f="passe"]'); if (b) b.click(); }); await p(1500); await capt(pg, tag + '-F3-relecture-diapo-par-diapo');
  const rows = await pg.evaluate(() => Array.from(document.querySelectorAll('#ecran-relecture tr')).map(tr => (tr.innerText || '').replace(/\s+/g, ' ').trim()).filter(t => /reportée/.test(t)));
  dire('  [F] Relecture, « Diapo par diapo » : ' + rows.length + ' lignes disent « reportée » : ' + rows.map(r => r.slice(0, 60)).join(' ‖ '));
  verif('F8', rows.length === 9 && !rows.some(r => /Radeau|Groupe 1 : l’hypothèse/.test(r)), 'la Relecture ne dit « reportée » que pour les 9 diapos qui portent la décision, jamais pour une diapo jouée', rows.map(r => r.slice(0, 50)));
  await pg.keyboard.press('Escape').catch(() => {}); await p(500);
  /* l'emploi du temps après la clôture (preuve 2) */
  const c2 = await caseEdt(pg, '2026-09-14'); await capt(pg, tag + '-F4-case-lundi-close'); dire('  [F] la case du lundi : « ' + c2.t.slice(0, 400) + ' »'); await fermerEdt(pg);
  verif('F2', /Close · 9 diapos jouées · 9 reportées — séance pas finie/.test(c2.t), 'la case close dit « Close · 9 diapos jouées · 9 reportées — séance pas finie »', c2.t.slice(0, 300));
  const g2 = await caseSemaine(pg, '2026-09-14'); await capt(pg, tag + '-F4b-semaine-case-lundi'); await fermerEdt(pg); dire('  [F] la case du lundi dans la semaine : ' + JSON.stringify(g2));
  verif('F2', g2 && g2.some(l => l.t === 'Close · 9 diapos jouées · 9 reportées' && !l.coupee) && g2.some(l => l.t === 'séance pas finie' && !l.coupee), 'dans la semaine aussi, la case le dit, sans rien de coupé : « Close · 9 diapos jouées · 9 reportées », puis « séance pas finie »', g2);
  const P1 = await projection(pg); dire('  [F] la semaine APRÈS : ' + semaineCharles(P1).join(' ‖ ')); await pg.evaluate(() => edtOuvrir()); await p(2400); await capt(pg, tag + '-F5-semaine-apres');
  const c3 = await caseEdt(pg, '2026-09-15'); await capt(pg, tag + '-F6-case-mardi-suite'); dire('  [F] la case du mardi : « ' + c3.t.slice(0, 400) + ' »'); await fermerEdt(pg);
  verif('F2', /heure 2 · suite de la séance/.test(c3.t) && /Poésie et peinture/.test(c3.t), 'la case suivante de la classe propose la suite de la séance 1 (« heure 2 · suite »)', c3.t.slice(0, 300));
  /* le glissé, compté sur quatre semaines : la file des cases « prévu » de la classe test, avant / après */
  const file = P => P.filter(x => /Charles/.test(x.classe) && x.nature === 'prevu').map(x => ({ k: x.k.slice(0, 16), s: x.titre + ' h' + x.heure + (x.suite ? ' suite' : '/' + x.sur) }));
  /* avant : fa[0] = le lundi (séance 1, h1/1), fa[1] = le mardi… ; après : le lundi est joué, fb[0] = le mardi (la suite), fb[j] (j ≥ 1) porte ce que portait fa[j], une case plus tard */
  const fa = file(P0), fb = file(P1); const memesCases = fb.every((x, j) => fa[j + 1] && x.k === fa[j + 1].k); const decal = fb.slice(1).every((x, j) => !fa[j + 1] || x.s === fa[j + 1].s);   /* une file qui s'épuise dans les 4 semaines : la dernière séance passe en « rien de prêt » une case plus tard */ const titresAvant = fa.slice(1).map(x => x.s), titresApres = fb.slice(1).map(x => x.s);
  dire('  [F] la file de la classe test (4 semaines) — avant : ' + fa.length + ' cases « prévu », après : ' + fb.length + ' · la 1re après : ' + (fb[0] || {}).s + ' · les mêmes cases à venir : ' + memesCases + ' · chacune porte, une case plus tard, ce que portait la précédente : ' + decal + ' (' + titresApres.length + ' titres comparés)');
  dire('        avant : ' + fa.slice(0, 6).map(x => x.k + ' ' + x.s).join(' | ')); dire('        après : ' + fb.slice(0, 6).map(x => x.k + ' ' + x.s).join(' | '));
  verif('F2', fb[0] && /suite/.test(fb[0].s) && /Poésie et peinture/.test(fb[0].s) && memesCases && decal && (fb.length === fa.length - 1 || fb.length === fa.length - 2), 'les séances suivantes décalées d’une heure : ' + titresApres.length + ' cases comparées une à une (4 semaines)', fa.slice(0, 4).map(x => x.s).join(' | ') + ' ⇒ ' + fb.slice(0, 5).map(x => x.s).join(' | '));
  finir('F7', o, 'la fin d’heure et l’emploi du temps'); k15('F7', e0, 'partie F'); HUB_F = JSON.parse(JSON.stringify(HUBN)); await o.ctx.close(); };

/* ══ G · une activité suivante pas commencée : une seule ligne (preuve 1) ══ */
const partieG = async (fichier, tag) => { neuf('act3'); const e0 = CHEMINS0(); const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; await lancerCase(pg, '2026-09-14'); await pg.keyboard.press('Escape'); await p(600);
  await jouerJusqua(pg, 'aud-g1-hyp'); await pg.keyboard.press('ArrowRight'); await p(500); await allerT5(pg); await clic(pg, '#f-suivante'); const A = await lignesFin(pg); await capt(pg, tag + '-G1-etape2-activite-suivante');
  dire('  [G] ' + A.lignes.length + ' lignes : ' + A.lignes.map(l => '[' + l.kind + ' · ' + l.n + '] ' + l.t.slice(0, 70)).join(' ‖ ')); dire('  [G] le bouton : ' + JSON.stringify(A.tous));
  const a3 = A.lignes.filter(l => /Le Romantisme en une phrase/.test(l.t));
  verif('G1', a3.length === 1 && a3[0].kind === 'activite' && a3[0].n === 2 && /2 diapos/.test(a3[0].t) && !A.lignes.some(l => /Nos définitions/.test(l.t)), 'l’activité suivante, pas commencée, en une seule ligne (son titre, ses 2 diapos)', a3);
  verif('G1', A.lignes.length === 10 && /Le bilan/.test(A.lignes[9].t) && A.tous && A.tous.visible && /Reporter les 11 diapos non faites/.test(A.tous.t), '8 diapos, 1 activité (2 diapos), « Le bilan » : 10 lignes, le bouton dit 11 diapos, visible', A.tous);
  await clic(pg, '#f-tous'); await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(1500); const H = (heureHub()[0] || {}).h || {}; const D = decisionsDe(H);
  dire('  [G] au hub : decisionsParEcran (' + D.length + ') : ' + D.map(x => '« ' + x.titre + ' » ' + x.choix).join(' ; ') + ' · decisionsParActivite : ' + JSON.stringify(Object.keys(H.decisionsParActivite || {})));
  verif('G1', D.length === 11 && D.every(x => x.choix === 'reporter') && D.some(x => x.eid === 'fh-a3-lecture') && D.some(x => x.eid === 'aud-bilan'), 'au hub : une décision par diapo (11), l’activité 3 diapo par diapo, « Le bilan » compris', D.map(x => x.titre));
  finir('G7', o, 'partie G'); k15('G7', e0, 'partie G'); await o.ctx.close(); };

/* ══ S · l'heure de la suite (preuve 3), sur le hub laissé par F ══ */
const partieS = async (fichier, tag) => { if (!HUB_F) { dire('  [S] pas de hub de F : partie sautée'); return; } HUBN = JSON.parse(JSON.stringify(HUB_F)); ECR = []; REFUSES.length = 0; const e0 = CHEMINS0();
  const o = await ouvrir({ fichier, h: '15:10', jour: '2026-09-15' }); const pg = o.pg; const L = await lancerCase(pg, '2026-09-15'); await capt(pg, tag + '-S1-ouverture-suite');
  const ouv = await pg.evaluate(() => { const x = document.getElementById('ecran-fin'); return x ? (x.innerText || '').replace(/\s+/g, ' ').slice(0, 1500) : ''; }); dire('  [S] la case : « ' + L.c.t.slice(0, 200) + ' » · l’écran d’ouverture : « ' + ouv.slice(0, 900) + ' »');
  verif('S3', /heure 2 · suite de la séance/.test(ouv), 'l’écran d’ouverture dit « heure 2 · suite de la séance »', ouv.slice(0, 200));
  const lh = await pg.evaluate(() => { const b = document.getElementById('o-lancer'); if (!b || b.disabled) return false; b.click(); return true; }); await p(3500); await capt(pg, tag + '-S2-heure-suite-lancee');
  const inf = await pg.evaluate(() => { const E = seance().ecrans; return { heure: S.heure, entete: (document.getElementById('hou') || {}).textContent || '', ordre: ordreHeure(S.heure).map(i => ({ eid: E[i].eid, t: E[i].act, role: E[i].role || '' })), react: (E.find(e => e.role === 'reactivation' && +e.heure === S.heure) || {}).blocs || null }; });
  const ord = inf.ordre.map(x => x.t); dire('  [S] « Lancer l’heure 2 » : ' + lh + ' · l’entête : « ' + inf.entete + ' » · l’ordre (' + ord.length + ') : ' + ord.join(' → ')); dire('  [S] la réactivation : ' + JSON.stringify(inf.react).slice(0, 700));
  const att = ['Où en sommes-nous ?', 'Groupe 2 : Le lac', 'Groupe 2 : l’hypothèse', 'Groupe 3 : Pêcheurs en mer', 'Groupe 3 : l’hypothèse', 'Groupe 4 : Cathédrale gothique au bord de l’eau', 'Groupe 4 : l’hypothèse', 'Groupe 5 : Le Voyageur contemplant une mer de nuages', 'Groupe 5 : l’hypothèse', 'Le bilan', 'Fin d\'heure'];
  verif('S3', JSON.stringify(ord) === JSON.stringify(att), 'l’ordre de la suite : la réactivation, les 8 reportées dans l’ordre du plan, « Le bilan », « Fin d’heure »', ord);
  const rep = (inf.react || []).find(b => b && b.txt === 'À reprendre'); verif('S3', !!rep && (rep.el || []).length >= 1, 'la réactivation a son bloc « À reprendre »', rep);
  /* jouer toute l'heure, puis clore sans report */
  await pg.keyboard.press('Escape').catch(() => {}); await p(400); const vus = await jouerJusqua(pg, null); await p(800); dire('  [S] jouées : ' + vus.join(' → '));
  await allerT5(pg); await clic(pg, '#f-suivante'); const A = await lignesFin(pg); dire('  [S] étape 2 : ' + A.lignes.length + ' lignes · « ' + A.quoi.slice(0, 120) + ' » · la liste : ' + (A.liste[1] || ''));
  await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(1500); const HS = heureHub(); dire('  [S] au hub : ' + HS.length + ' heures · la 2e : clos ' + !!(HS[1] || {}).h.clos + ' · reportées à cette heure : ' + decisionsDe((HS[1] || {}).h || {}).filter(x => x.choix === 'reporter' && +x.heure === 2).length);
  const c1 = await caseEdt(pg, '2026-09-14'); await fermerEdt(pg); const c2 = await caseEdt(pg, '2026-09-15'); await capt(pg, tag + '-S3-case-mardi-close'); await fermerEdt(pg); const P = await projection(pg); const sem = semaineCharles(P);
  dire('  [S] la case du lundi : « ' + c1.t.slice(0, 200) + ' » · la case du mardi : « ' + c2.t.slice(0, 200) + ' »'); dire('  [S] la semaine après : ' + sem.join(' ‖ '));
  const prochaine = P.filter(x => /Charles/.test(x.classe) && x.nature === 'prevu')[0] || {};
  verif('S3', A.lignes.length === 0 && /Close · \d+ diapos jouées\./.test(c2.t) && !/séance pas finie/.test(c1.t + c2.t), 'jouée et close sans report : la case du mardi dit « Close · n diapos jouées » ; plus aucune case ne dit « séance pas finie »', [c1.t.slice(0, 120), c2.t.slice(0, 120)]);
  verif('S3', /Étude de texte accompagnée/.test(prochaine.titre || '') && prochaine.heure === 1 && !prochaine.suite, 'la séance 1 finie : la case suivante dit la séance 2 (« Étude de texte accompagnée », heure 1)', prochaine);
  await pg.evaluate(() => edtOuvrir()); await p(2400); await capt(pg, tag + '-S4-semaine-apres-suite');
  finir('S7', o, 'partie S'); k15('S7', e0, 'partie S'); await o.ctx.close(); };

/* ══ P · l'heure de la forme de celle de Paul, écrite par l'ancien fichier, lue par le nouveau (preuve 4) ══ */
const partieP = async (fichier, tag) => { if (!ANCIEN) { dire('  [P] MJPC_ANCIEN absent : partie sautée'); return; } neuf(null); const e0 = CHEMINS0();
  const o = await ouvrir({ fichier: ANCIEN, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; await lancerCase(pg, '2026-09-14'); await pg.keyboard.press('Escape'); await p(600);
  const vus = await jouerJusqua(pg, 'aud-g1-hyp'); await p(800); dire('  [P] (ancien fichier) jouées : ' + vus.join(' → ') + ' · « Groupe 1 : l’hypothèse » montrée, rien dévoilé');
  await allerT5(pg); await clic(pg, '#f-suivante'); const ok = await pg.evaluate(() => { const b = document.querySelector('#fin .carte .dec button[data-c="reporter"]'); if (!b) return false; b.click(); return true; }); await p(1200); await capt(pg, tag + '-P1-ancien-reporter');
  await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(1500); const H = (heureHub()[0] || {}).h || {}; const D = decisionsDe(H);
  dire('  [P] (ancien fichier) « Reporter à la séance suivante » : ' + ok + ' · clos ' + !!H.clos + ' · decisionsParActivite : ' + JSON.stringify(Object.keys(H.decisionsParActivite || {}).map(k => k + '→' + H.decisionsParActivite[k].choix)) + ' · decisionsParEcran (' + D.length + ') : ' + D.map(x => '« ' + x.titre + ' »').join(' ; ') + ' · « Le bilan » a une décision : ' + D.some(x => x.eid === 'aud-bilan'));
  { const dpe = H.decisionsParEcran || {}; const k0 = Object.keys(dpe)[0]; const dpa = H.decisionsParActivite || {}; dire('  [P] (ancien fichier, md5 ' + md5(ANCIEN) + ') ce qu’il écrit au hub : l’heure porte ' + JSON.stringify(Object.keys(H).sort()) + ' · heure ' + JSON.stringify(H.heure) + ', sur ' + JSON.stringify(H.sur) + ' · une décision de decisionsParEcran porte ' + JSON.stringify(k0 ? Object.keys(dpe[k0]).sort() : []) + ' (heure : ' + JSON.stringify(k0 ? dpe[k0].heure : undefined) + ') · decisionsParActivite.act2 porte ' + JSON.stringify(dpa.act2 ? Object.keys(dpa.act2).sort() : []) + ' · « Le bilan » : ' + (D.some(x => x.eid === 'aud-bilan') ? 'une décision' : 'aucune décision')); }
  verif('P4', D.length === 9 && D.some(x => x.eid === 'aud-g1-hyp') && !D.some(x => x.eid === 'aud-bilan') && (H.decisionsParActivite || {}).act2 && H.decisionsParActivite.act2.choix === 'reporter', 'l’heure du lundi matin, écrite par l’ancien fichier : 9 reportées dont « Groupe 1 : l’hypothèse », « Le bilan » sans décision, decisionsParActivite', D.map(x => x.titre));
  { const e = o.errs.concat(o.boites); const L = ECR.slice(e0); dire('  [P] (ancien fichier, mesuré, pas compté : ce n’est pas ce mandat) erreurs JS / boîtes : ' + (e.join(' ; ') || 'aucune') + ' · écritures ' + L.length + ', refusées ' + L.filter(x => x.refus).length); } await o.ctx.close(); const e1 = CHEMINS0();
  /* le nouveau fichier lit cette heure */
  const o2 = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const c1 = await caseEdt(o2.pg, '2026-09-14'); await capt(o2.pg, tag + '-P2-case-lundi'); await fermerEdt(o2.pg); const c2 = await caseEdt(o2.pg, '2026-09-15'); await capt(o2.pg, tag + '-P3-case-mardi'); await fermerEdt(o2.pg);
  dire('  [P] (nouveau) la case du lundi : « ' + c1.t.slice(0, 200) + ' » · la case du mardi : « ' + c2.t.slice(0, 300) + ' »');
  const g1 = await caseSemaine(o2.pg, '2026-09-14'); await fermerEdt(o2.pg); dire('  [P] (nouveau) la case du lundi dans la semaine : ' + JSON.stringify(g1));
  verif('P4', g1 && g1.some(l => /^Close · \d+ diapos jouées · 9 reportées$/.test(l.t) && !l.coupee) && g1.some(l => l.t === 'séance pas finie' && !l.coupee), 'dans la semaine, la case du lundi dit « … · 9 reportées » puis « séance pas finie », sans rien de coupé', g1);
  verif('P4', /9 reportées — séance pas finie/.test(c1.t) && /heure 2 · suite de la séance : elle commence par les 9 diapos reportées/.test(c2.t), 'le nouveau fichier : la case du lundi dit « 9 reportées — séance pas finie », la suivante propose la suite', [c1.t.slice(0, 160), c2.t.slice(0, 200)]);
  finir('P7', o2, 'partie P, la lecture'); await o2.ctx.close();
  const o3 = await ouvrir({ fichier, h: '15:10', jour: '2026-09-15' }); const pg3 = o3.pg; await lancerCase(pg3, '2026-09-15'); const lh = await pg3.evaluate(() => { const b = document.getElementById('o-lancer'); if (!b || b.disabled) return false; b.click(); return true; }); await p(3500); await capt(pg3, tag + '-P4-suite-lancee');
  const inf = await pg3.evaluate(() => { const E = seance().ecrans; return { ordre: ordreHeure(S.heure).map(i => E[i].act), react: (E.find(e => e.role === 'reactivation' && +e.heure === S.heure) || {}).blocs || null }; });
  dire('  [P] la suite lancée (' + lh + ') : ' + inf.ordre.join(' → ')); dire('  [P] la réactivation : ' + JSON.stringify(inf.react).slice(0, 600));
  const o4 = inf.ordre.filter(t => t !== 'Où en sommes-nous ?' && t !== 'Fin d\'heure');
  verif('P4', o4[0] === 'Groupe 1 : l’hypothèse' && o4[o4.length - 1] === 'Le bilan' && o4.length === 10 && inf.ordre[0] === 'Où en sommes-nous ?' && inf.ordre[inf.ordre.length - 1] === 'Fin d\'heure', 'la suite commence (après la réactivation) par « Groupe 1 : l’hypothèse » et finit par « Le bilan » (puis « Fin d’heure ») : 10 diapos', inf.ordre);
  finir('P7', o3, 'partie P, la suite'); k15('P7', e1, 'partie P (le nouveau fichier)'); await o3.ctx.close(); };

/* ══ D · une séance de deux heures (preuve 5) ══ */
const partieD = async (fichier, tag) => { neuf('deux'); const e0 = CHEMINS0(); const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; const P0 = await projection(pg);
  const c0 = await caseEdt(pg, '2026-09-14'); await fermerEdt(pg); dire('  [D] la case du lundi : « ' + c0.t.slice(0, 160) + ' » · la semaine : ' + semaineCharles(P0).join(' ‖ '));
  await lancerCase(pg, '2026-09-14'); await pg.keyboard.press('Escape'); await p(600); await jouerJusqua(pg, 'aud-g1-hyp'); await pg.keyboard.press('ArrowRight'); await p(500);
  await allerT5(pg); await clic(pg, '#f-suivante'); const A = await lignesFin(pg); await capt(pg, tag + '-D1-heure1-etape2'); dire('  [D] heure 1 sur 2, étape 2 : ' + A.lignes.map(l => '[' + l.kind + '] ' + l.t.slice(0, 50) + ' — ' + l.choix.join('/')).join(' ‖ ') + ' · le bouton : ' + JSON.stringify(A.tous && A.tous.t));
  await clic(pg, '#f-tous'); const B = await lignesFin(pg); dire('  [D] après un clic : ' + B.lignes.map(l => l.choix.filter(c => /posé/.test(c)).join('')).join(', '));
  verif('D5', A.lignes.length === 2 && B.lignes.every(l => l.choix.some(c => /^À l.heure suivante \[posé\]$/.test(c))), 'heure 1 sur 2 : le bouton pose « À l’heure suivante » sur les 2 diapos non faites', B.lignes);
  await ouvrirEtape(pg, 7); await clore(pg); await p(1500); const H = (heureHub()[0] || {}).h || {}; const D = decisionsDe(H); dire('  [D] au hub : ' + D.map(x => '« ' + x.titre + ' » ' + x.choix).join(' ; '));
  const P1 = await projection(pg); const f = P => P.filter(x => /Charles/.test(x.classe) && x.nature === 'prevu').map(x => x.k.slice(0, 16) + ' ' + x.titre + ' h' + x.heure + '/' + x.sur);
  const fa = f(P0).slice(1), fb = f(P1); dire('  [D] la file avant (sans la case jouée) : ' + fa.slice(0, 4).join(' | ') + ' · après : ' + fb.slice(0, 4).join(' | '));
  verif('D5', JSON.stringify(fa) === JSON.stringify(fb), 'l’emploi du temps inchangé : la file de la classe test, 4 semaines, case par case (' + fb.length + ' cases)', [fa.slice(0, 3), fb.slice(0, 3)]);
  finir('D7', o, 'partie D, heure 1'); await o.ctx.close();
  const o2 = await ouvrir({ fichier, h: '15:10', jour: '2026-09-15' }); const pg2 = o2.pg; await lancerCase(pg2, '2026-09-15'); await pg2.evaluate(() => { const b = document.getElementById('o-lancer'); if (!b || b.disabled) return false; b.click(); return true; }); await p(3500); await capt(pg2, tag + '-D2-heure2-lancee');
  const ord = await pg2.evaluate(() => { const E = seance().ecrans; return ordreHeure(S.heure).map(i => E[i].act); }); dire('  [D] l’heure 2 : ' + ord.join(' → '));
  const sans = ord.filter(t => t !== 'Où en sommes-nous ?'); verif('D5', sans[0] === 'Groupe 2 : Le lac' && sans[1] === 'Groupe 2 : l’hypothèse' && sans[2] === 'Groupe 3 : Pêcheurs en mer', 'l’heure 2 commence (après la réactivation) par les 2 diapos glissées, puis la suite du plan', ord.slice(0, 5));
  finir('D7', o2, 'partie D, heure 2'); k15('D7', e0, 'partie D'); await o2.ctx.close(); };

/* ══ R · rien ne change ailleurs (preuve 6) : la projection, ancien et nouveau fichier, sur le même hub ══ */
const partieR = async (fichier, tag) => { if (!ANCIEN) { dire('  [R] MJPC_ANCIEN absent : partie sautée'); return; }
  const comparer = async (quoi) => { const st = JSON.parse(JSON.stringify(HUBN)); const res = {};
    for (const [n, f] of [['ancien', ANCIEN], ['nouveau', fichier]]) { HUBN = JSON.parse(JSON.stringify(st)); const o = await ouvrir({ fichier: f, h: '09:00', jour: '2026-09-14' }); res[n] = await projection(o.pg); finir('R6', o, quoi + ' (' + n + ')'); await o.ctx.close(); }
    HUBN = st; const cle = x => [x.k, x.nature, x.titre, x.heure, x.sur, x.snum].join('|'); const A = res.ancien.map(cle), B = res.nouveau.map(cle); const diff = A.filter((x, i) => x !== B[i]).length + Math.abs(A.length - B.length);
    const classes = [...new Set(res.nouveau.map(x => x.classe))]; dire('  [R] ' + quoi + ' : ' + A.length + ' cases (ancien), ' + B.length + ' (nouveau), ' + classes.length + ' classes, ' + res.nouveau.filter(x => x.titre).length + ' titres · différences : ' + diff);
    verif('R6', diff === 0, quoi + ' : la même projection, case par case (nature, titre, heure n/N, séance), 4 semaines, toutes les classes', A.filter((x, i) => x !== B[i]).slice(0, 3).concat(B.filter((x, i) => x !== A[i]).slice(0, 3))); };
  neuf(null); await comparer('le faux hub neuf');
  /* une heure close SANS report (le nouveau fichier) : toute la trame jouée, close */
  neuf(null); const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; await lancerCase(pg, '2026-09-14'); await pg.keyboard.press('Escape'); await p(600); const vus = await jouerJusqua(pg, null); await p(600);
  await allerT5(pg); await clic(pg, '#f-suivante'); const A = await lignesFin(pg); await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(1500); dire('  [R] une heure jouée en entier (' + vus.length + ' diapos), étape 2 : ' + A.lignes.length + ' lignes, close : ' + cl.close);
  finir('R6', o, 'l’heure sans report'); await o.ctx.close(); await comparer('une heure close sans report');
  dire('  [R] (les mots d’une case jouée changent, voulu §3.8 : « n diapos jouées » au lieu de « n activités » — ce n’est pas la projection)'); };

/* ══ T · la fin d'heure en mode test (preuve 7, K15-test) ══ */
const partieT = async (fichier, tag) => { neuf(null); const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14', test: true }); const pg = o.pg; const e0 = CHEMINS0(); await lancerCase(pg, '2026-09-14'); await pg.keyboard.press('Escape'); await p(600);
  await jouerJusqua(pg, 'aud-g1-hyp'); await pg.keyboard.press('ArrowRight'); await p(500); await allerT5(pg); await clic(pg, '#f-suivante'); const A = await lignesFin(pg); await capt(pg, tag + '-T1-mode-test-etape2');
  await clic(pg, '#f-tous'); const B = await lignesFin(pg); await ouvrirEtape(pg, 7); const cl = await clore(pg); await p(1500);
  dire('  [T] mode test : ' + A.lignes.length + ' lignes, le bouton « ' + (A.tous || {}).t + ' » (haut ' + (A.tous || {}).haut + ') · après un clic : ' + B.lignes.filter(l => l.choix.some(c => /posé/.test(c))).length + ' décidées · clos ' + cl.close);
  verif('T1', A.lignes.length === 9 && A.tous && A.tous.visible && B.lignes.every(l => l.choix.some(c => /^Reporter \[posé\]$/.test(c))), 'mode test : les 9 lignes, le bouton visible, un clic les décide', A.tous);
  k15test('T7', e0, 'partie T'); finir('T7', o, 'partie T'); await o.ctx.close(); };

dire(''); dire('══ LA FIN D’HEURE · ' + NOMF + ' · md5 ' + md5(FICHIER) + (ANCIEN ? ' · ancien ' + md5(ANCIEN) : '') + ' ══');
for (const [k, f] of [['F', partieF], ['G', partieG], ['S', partieS], ['P', partieP], ['D', partieD], ['R', partieR], ['T', partieT]]) { if (!joue(k)) continue; dire(''); dire('— partie ' + k); try { await f(FICHIER, NOMF); } catch (e) { verif(k, false, 'la partie ' + k + ' a levé', String(e && e.stack || e).slice(0, 600)); } }
dire(''); dire('--- fin : ' + nb + ' vérifications, ' + echecs + ' échec(s)' + (echecs ? ' · ROUGE' : ' · VERT'));
fs.writeFileSync(path.join(OUT, 'sonde-fin-heure-' + NOMF + '-' + PARTIES.join('') + '.txt'), anon(R.join('\n')) + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
