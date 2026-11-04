// C16 · LOT 2c (l’horloge d’une heure rattrapée ; une seule clé pour une heure reprise le lendemain) — le harnais de LOT2A/sonde-lot2a.mjs (bdae9b175), lignes 1-229 reprises telles quelles ; la partie M est celle du lot.
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

/* ══ M · L'HORLOGE (MANDAT-LOT2C §3) — CLASSE TEST (classe ordinaire), sa case passée du lundi 14/09 15:07-16:02 ; une heure ordinaire ; la reprise du lendemain ══ */
const clesDyl = () => { const out = []; sk0(HUBN).forEach(k => { const d = djDe(k); Object.keys(d).forEach(sl => { if (!/CLASSE/i.test(sl) && !/CLASSE TEST/.test((d[sl] || {}).classe || '')) return; Object.keys((d[sl] || {}).heures || {}).forEach(h => out.push(h + (d[sl].heures[h].clos ? ' (close)' : ' (pas close)'))); }); }); return out; };
const rattraper = async (pg, iso, cr) => { const c = await caseDe(pg, iso, cr, DYL); const l = await clicTexte(pg, '#edt-modale button', 'Rattraper cette heure'); await p(4500);
  const ouv = await pg.evaluate(() => { const b = document.getElementById('o-lancer'); return !!(b && b.offsetParent !== null && !b.disabled); }); if (ouv) { await pg.click('#o-lancer').catch(() => {}); await p(3500); }
  await pg.keyboard.press('Escape').catch(() => {}); await p(500); return { c, l, ouv }; };
/* ce que l'horloge fait partir : les paliers (t5, t3, t1, zero) au journal, la séquence de fin ouverte, le chrono, le reste jusqu'au cahier de textes, l'heure affichée, les témoins de la classe test */
const horloge = pg => pg.evaluate(() => { const vis = id => { const x = document.getElementById(id); return !!(x && x.offsetParent !== null && x.style.display !== 'none'); };
  return { lancee: !!S.lancee, r: !!(dr_heureJouee(S.heure) || {}).rattrapee, paliers: J.filter(x => ['t5', 't3', 't1', 'cahier-heure'].includes(x.type) && x.h === S.heure).map(x => x.type), t5: !!S.t5, finOuverte: !!document.querySelector('#fin .pp-tete') && !!(document.getElementById('fin') || {}).offsetParent,
    resteMin: Math.round((heureCahier() - now()) / 60000), heure: (document.getElementById('heure') || {}).textContent, chr: (document.getElementById('chr') || {}).textContent, chrC: (document.getElementById('chr') || {}).className,
    temoinsTest: [vis('dr-hcase') ? 'horloge de la case' : '', vis('dr-t5') ? 'aller à T-5' : ''].filter(Boolean), cle: _drCleHeure() }; });
const mot = x => 'lancée ' + x.lancee + (x.r ? ' (rattrapée)' : '') + ' · paliers partis ' + JSON.stringify(x.paliers) + ' · fin ouverte ' + x.finOuverte + ' · reste jusqu’au cahier ' + x.resteMin + ' min · heure affichée ' + x.heure + ' · chrono ' + x.chr + (x.chrC ? ' (' + x.chrC + ')' : '') + ' · témoins classe test ' + JSON.stringify(x.temoinsTest);
const avancer = async (pg, min) => { await pg.clock.fastForward(min * 60000); await p(2500); };
const partieM = async () => { let o, pg, x; if (!process.env.MJPC_M5SEUL) {   /* MJPC_M5SEUL : les seules reprises M5-M7 (base / après) */
  /* M1 : l'heure rattrapée jouée APRÈS son créneau (jeudi 17/09 17:30, la case du lundi 15:07-16:02) — au lancement, puis à +40 min, puis à +46 min */
  hubAvec(); o = await ouvrir({ h: '17:30', jour: '2026-09-17' }); pg = o.pg; const R1 = await rattraper(pg, '2026-09-14', '15:07-16:02'); await p(3000);
  x = await horloge(pg); dire('  [M1] rattrapée, lancée jeudi 17:30 (case lundi 15:07-16:02) · au lancement : ' + mot(x));
  const m1a = x; await avancer(pg, 40); const m1b = await horloge(pg); dire('  [M1] +40 min : ' + mot(m1b)); await avancer(pg, 6); const m1c = await horloge(pg); dire('  [M1] +46 min : ' + mot(m1c));
  verif('M1a', R1.l && m1a.lancee && m1a.r, 'la case passée : « ▶ Rattraper cette heure » lance l’heure, rattrapée', R1.c.btns);
  verif('M1b', m1a.paliers.length === 0 && !m1a.finOuverte && m1a.resteMin >= 48 && m1a.resteMin <= 50, 'au lancement : aucun palier parti, la fin d’heure fermée, 50 min jusqu’au cahier (l’horloge de sa case)', [m1a.paliers, m1a.finOuverte, m1a.resteMin]);
  verif('M1c', m1b.paliers.length === 0 && m1c.paliers.includes('t5'), 'à +40 min rien ; à +46 min le T-5 part (comme une heure de 55 min commencée au début de son créneau)', [m1b.paliers, m1c.paliers]);
  verif('M1d', m1a.temoinsTest.length === 0, 'aucun témoin de la classe d’essai (« horloge de la case », « aller à 5 minutes de la fin »)', m1a.temoinsTest);
  finir('M9', o, 'M1'); await o.ctx.close();
  /* M2 : la même rattrapée jouée AVANT l'horaire de son créneau (jeudi 10:00) : le reste jusqu'au cahier */
  hubAvec(); o = await ouvrir({ h: '10:00', jour: '2026-09-17' }); pg = o.pg; await rattraper(pg, '2026-09-14', '15:07-16:02'); await p(3000); const m2 = await horloge(pg); dire('  [M2] rattrapée, lancée jeudi 10:00 · au lancement : ' + mot(m2));
  verif('M2a', m2.paliers.length === 0 && m2.resteMin >= 48 && m2.resteMin <= 50, 'lancée avant l’horaire de sa case : 50 min jusqu’au cahier, rien de parti', [m2.paliers, m2.resteMin]);
  finir('M9', o, 'M2'); await o.ctx.close();
  /* M3 : une heure ordinaire dans son créneau (jeudi 17/09 15:08, la case 15:07-16:02) — l'horloge vraie */
  hubAvec(); o = await ouvrir({ h: '15:08', jour: '2026-09-17' }); pg = o.pg; await lancerIci(pg, '2026-09-17', '15:07-16:02', DYL); await p(2000);
  const m3a = await horloge(pg); dire('  [M3] ordinaire, lancée jeudi 15:08 dans son créneau : ' + mot(m3a)); await avancer(pg, 40); const m3b = await horloge(pg); dire('  [M3] +40 min (15:48) : ' + mot(m3b)); await avancer(pg, 6); const m3c = await horloge(pg); dire('  [M3] +46 min (15:54) : ' + mot(m3c));
  verif('M3a', m3a.lancee && !m3a.r && m3a.paliers.length === 0 && m3a.resteMin >= 47 && m3a.resteMin <= 49 && m3b.paliers.length === 0 && m3c.paliers.includes('t5') && m3a.temoinsTest.length === 0, 'l’heure ordinaire : l’horloge vraie (reste 48 min), rien à +40, le T-5 à 15:52 (+46)', [m3a.resteMin, m3b.paliers, m3c.paliers, m3a.heure]);
  /* M4 : la même, laissée pas close (l'onglet fermé), reprise le lendemain (vendredi 18/09 10:00) par « ▶ Reprendre l'heure » */
  await o.ctx.close(); hubAvec(); o = await ouvrir({ h: '15:08', jour: '2026-09-17' }); pg = o.pg; await lancerIci(pg, '2026-09-17', '15:07-16:02', DYL); await jouerJusqua(pg, 'aud-g1-img'); await p(2500); const la = await ecran_(pg); const K0 = clesDyl(); await o.ctx.close();
  dire('  [M4] jeudi 15:08, ordinaire, jouée jusqu’à « ' + (la && la.act) + ' », l’onglet fermé sans clore · les clés : ' + K0.join(', '));
  o = await ouvrir({ h: '10:00', jour: '2026-09-18' }); pg = o.pg; const m = await caseDe(pg, '2026-09-17', '15:07-16:02', DYL); const rp = await clicTexte(pg, '#edt-modale button', 'Reprendre l’heure'); await p(6000); await pg.keyboard.press('Escape').catch(() => {}); await p(600);
  const i2 = await ecran_(pg); const h2 = await horloge(pg).catch(() => null); await pg.keyboard.press('ArrowRight'); await p(4000); const K4 = clesDyl();
  dire('  [M4] vendredi 10:00, la case du jeudi : boutons ' + JSON.stringify(m.btns) + ' · « Reprendre » (' + rp + ') reprend sur « ' + (i2 && i2.act) + ' » · ' + (h2 ? mot(h2) + ' · clé ' + h2.cle : '') + ' · une diapo de plus · les clés : ' + K4.join(', '));
  verif('M4a', rp && i2 && la && i2.eid === la.eid, '« ▶ Reprendre l’heure » le lendemain : la diapo où l’on s’était arrêté', [la, i2]);
  verif('M4b', K4.length === 1 && /^2026-09-17_15h07-16h02_CLASSE_TEST/.test(K4[0]), 'une seule clé au hub, celle de la case (la date et le créneau de l’heure reprise)', K4);
  finir('M9', o, 'M4'); await o.ctx.close(); }
  /* M5-M7 (complément de la conscience, Paul 03/11 12:42 : « il faut reprendre là où je me serai arrêté ») : l'horloge à la reprise, puis le T-5 quand le temps joué atteint la fin moins 5 */
  const reprise = async (k, quoi, lancer, jourR, hR, iso, cr, attendu) => { hubAvec(); o = await ouvrir(lancer.o); pg = o.pg; await lancer.f(pg); await jouerJusqua(pg, 'aud-g1-img'); await p(2500); const av = await horloge(pg); await o.ctx.close();
    o = await ouvrir({ h: hR, jour: jourR }); pg = o.pg; await caseDe(pg, iso, cr, DYL); const rp = await clicTexte(pg, '#edt-modale button', 'Reprendre l’heure'); await p(6000); await pg.keyboard.press('Escape').catch(() => {}); await p(600);
    const h0 = await horloge(pg); dire('  [' + k + '] ' + quoi + ' · avant fermeture : reste ' + av.resteMin + ' min, heure ' + av.heure + ' · à la reprise (' + rp + ') : ' + mot(h0) + ' · clés ' + clesDyl().join(', '));
    let h1 = null, h2 = null; if (h0.resteMin > 7) { await avancer(pg, h0.resteMin - 6); h1 = await horloge(pg); await avancer(pg, 3); h2 = await horloge(pg); dire('  [' + k + '] +' + (h0.resteMin - 6) + ' min : ' + mot(h1) + ' · +' + (h0.resteMin - 3) + ' min : ' + mot(h2)); }
    attendu(av, h0, h1, h2); finir('M9', o, k); await o.ctx.close(); };
  const hm = t => { const m = /^(\d{2}):(\d{2})/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : -1; };
  await reprise('M5', 'ordinaire jouée jeudi 15:08, reprise vendredi 10:00', { o: { h: '15:08', jour: '2026-09-17' }, f: pg => lancerIci(pg, '2026-09-17', '15:07-16:02', DYL) }, '2026-09-18', '10:00', '2026-09-17', '15:07-16:02', (av, h0, h1, h2) => {
    verif('M5a', h0.paliers.length === 0 && !h0.finOuverte && Math.abs(h0.resteMin - av.resteMin) <= 1 && Math.abs(hm(h0.heure) - hm(av.heure)) <= 1, 'reprise le lendemain : rien ne part, l’horloge reprend là où elle s’était arrêtée (le reste et l’heure affichée d’avant la fermeture)', [h0.paliers, h0.finOuverte, av.resteMin, h0.resteMin, av.heure, h0.heure]);
    verif('M5b', h1 && h2 && h1.paliers.length === 0 && h2.paliers.includes('t5'), 'le T-5 part quand le temps joué atteint la fin moins 5 (pas avant)', [h1 && h1.paliers, h2 && h2.paliers]); });
  await reprise('M6', 'rattrapée jeudi 17:30 (case lundi), reprise vendredi 10:00', { o: { h: '17:30', jour: '2026-09-17' }, f: pg => rattraper(pg, '2026-09-14', '15:07-16:02') }, '2026-09-18', '10:00', '2026-09-14', '15:07-16:02', (av, h0, h1, h2) => {
    verif('M6a', h0.paliers.length === 0 && !h0.finOuverte && Math.abs(h0.resteMin - av.resteMin) <= 1 && Math.abs(hm(h0.heure) - hm(av.heure)) <= 1, 'rattrapée reprise le lendemain : rien ne part, l’horloge reprend là où elle s’était arrêtée', [h0.paliers, h0.finOuverte, av.resteMin, h0.resteMin, av.heure, h0.heure]);
    verif('M6b', h1 && h2 && h1.paliers.length === 0 && h2.paliers.includes('t5'), 'le T-5 part quand le temps joué atteint la fin moins 5', [h1 && h1.paliers, h2 && h2.paliers]); });
  await reprise('M7', 'ordinaire jouée jeudi 15:08, reprise le même jour 15:20 dans son créneau', { o: { h: '15:08', jour: '2026-09-17' }, f: pg => lancerIci(pg, '2026-09-17', '15:07-16:02', DYL) }, '2026-09-17', '15:20', '2026-09-17', '15:07-16:02', (av, h0, h1, h2) => {
    verif('M7a', h0.lancee && h0.paliers.length === 0 && !h0.finOuverte && hm(h0.heure) >= hm('15:20') && hm(h0.heure) <= hm('15:24') && Math.abs(hm(h0.heure) + h0.resteMin - hm('15:57')) <= 1, 'reprise le même jour dans son créneau : l’horloge vraie (l’heure affichée + le reste = 15:57, le cahier), rien ne part', [h0.heure, h0.resteMin, h0.paliers]);
    verif('M7b', h1 && h2 && h1.paliers.length === 0 && h2.paliers.includes('t5'), 'le T-5 à 15:52, comme avant', [h1 && h1.paliers, h2 && h2.paliers]); }); };

dire(''); dire('══ LOT 2c · ' + NOMF + ' · md5 ' + md5(FICHIER) + ' ══');
for (const [k, f] of [['M', partieM]]) { if (!joue(k)) continue; dire(''); dire('— partie ' + k); try { await f(); } catch (e) { verif(k + '!', false, 'la partie ' + k + ' a levé', String(e.stack || e).slice(0, 400)); } }
dire(''); dire('--- fin : ' + nb + ' vérifications, ' + echecs + ' échec(s)');
fs.writeFileSync(path.join(OUT, 'sonde-lot2c-' + NOMF + '-' + PARTIES.join('') + '.txt'), anon(R.join('\n')) + '\n');
await nav.close(); process.exit(0);
