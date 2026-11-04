// LES CINQ PROPOSITIONS DU MINUTEUR, EN CAPTURES CONSTRUITES (MANDATS/DEROULE-01-11/MANDAT-CAPTURES-MINUTEUR.md, C16 649). Aucune ligne du site ne change :
// chaque proposition est construite dans la page de la capture seulement (addStyleTag, evaluate). Le harnais (faux hub, montre, gestes) est repris de
// AUDIT-GLOBAL/sonde-audit-I.mjs (branche audit/global-I), seule l'échelle des captures change (deviceScaleFactor 2).
// usage : node captures-minuteur.mjs <index.html 8.84.0-⑰> [dossier-des-images]
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node captures-minuteur.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; const dire = s => { R.push(s); console.log(s); }; const J = []; const garderJ = o => { J.push(o); fs.appendFileSync(path.join(OUT, 'audit-I.jsonl'), JSON.stringify(o) + '\n'); };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'Q1,Q1D,Q3,Q2,Q4').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');

/* ── le faux hub : la séance 1 du chapitre de 3e ; les cases « 3 DYLAN Bob » de la grille rattachées à « CLASSE TEST » (une seconde classe de 3e, pour « autre classe ») ── */
const store = () => { const st = storeOuverture(RACINE, { champs: true });
  try { (st.site.edt.grille['2026-2027'].creneaux || []).forEach(c => { if (c && /^3 DYLAN/i.test(String(c.classe || ''))) c.classeMjpc = 'CLASSE TEST'; }); } catch (e) {}
  return st; };

let HUBN = null; let ECR = []; const REFUSES = [];
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
/* RETARD : les lectures d'un appareil rendues `ms` plus tard (le réseau très lent de C16 303 : 3 s par lecture) ; les écritures aussi si `ecr` */
let RETARD = null;
const hubRepondre = async (qui, m, c, corps) => { if (RETARD && RETARD.qui === qui && (m === 'GET' || RETARD.ecr)) await p(RETARD.ms);
  if (m === 'GET') return JSON.stringify(lireH(c)); let bd = null; try { bd = resoudreSv(JSON.parse(corps || 'null')); } catch (e) {}
  const ko = refusDe(m, c, bd); if (ko) { REFUSES.push({ qui, m, c, ko, t: Date.now() }); ECR.push({ qui, m, c, t: Date.now(), refus: true }); return '§400§' + JSON.stringify({ error: 'Invalid data; couldn\'t parse key beginning at ' + ko }); }
  ECR.push({ qui, m, c, t: Date.now(), bd }); setTimeout(() => pousserFlux(c), 0);
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => /^§400§/.test(t) ? new Response(t.slice(5), { status: 400 }) : new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const imageDe = u => { const m = /mjpc-medias\/(.*\/)?([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (!m) return null; if (MEDIAS) { const f = path.join(MEDIAS, m[2]); if (fs.existsSync(f)) return f; } return IMG_OUV[m[2]] || IMG_DEFAUT; };
const typeDe = f => /\.webp$/i.test(f) ? 'image/webp' : /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ABOS = []; const T0REEL = Date.now(); const NOMS = new Map();   /* la page → le nom de l'appareil (deux onglets d'un même appareil se distinguent) */
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
/* la montre du navigateur (FRAPPE-TABLEAU, MJPC_HORLOGE=date) : seule `Date` est décalée — au 14/09 09:00 au lancement de la sonde, elle avance ; `decal` en plus pour un appareil dont la montre diffère */
const fauxDate = off => { const RD = Date; function FD(...a) { if (!(this instanceof FD)) return new RD(RD.now() + off).toString(); return a.length ? new RD(...a) : new RD(RD.now() + off); }
  FD.prototype = RD.prototype; FD.now = () => RD.now() + off; FD.parse = RD.parse; FD.UTC = RD.UTC; try { Object.defineProperty(FD, 'name', { value: 'Date' }); } catch (e) {} window.Date = FD; };
const T09 = new Date('2026-09-14T09:00:00+02:00').getTime();
const nouveauCtx = async ({ qui, W, H, tel = false, decal = 0 }) => {
  const ctx = await nav.newContext(Object.assign({ viewport: { width: W, height: H }, deviceScaleFactor: 2, timezoneId: 'Europe/Paris' }, tel ? { isMobile: true, hasTouch: true } : {}));
  await ctx.exposeBinding('__hubEcoute', (src, id, ch) => { ABOS.push({ pg: src.page, id, ch: ch.replace(/\/+$/, '') }); return JSON.stringify(lireH(ch)); }); await ctx.addInitScript(fauxFlux);
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); if (u.indexOf('api.qrserver.com') >= 0) return r.fulfill({ body: qrSvg(new URL(u).searchParams.get('data') || ''), contentType: 'image/svg+xml' }); const f = imageDe(u); if (f) return r.fulfill({ path: f, contentType: typeDe(f) }); return r.abort(); });
  await ctx.exposeBinding('__hubN', (src, m, c, corps) => hubRepondre(NOMS.get(src.page) || qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  await ctx.addInitScript(fauxDate, T09 - T0REEL + decal);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  return ctx; };
const pageDans = async (ctx, { qui, q = '?n=3e', test = false, prof = true, sansAttente = false }) => { const errs = [], boites = []; const pg = await ctx.newPage(); NOMS.set(pg, qui);
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); });
  pg.on('popup', w => NOMS.set(w, qui + '·fenêtre'));
  if (!sansAttente) { await pg.goto('file://' + FICHIER + q, { waitUntil: 'load' }); await p(1800); if (prof) await profPrep(pg, test); }
  return { ctx, pg, errs, boites, qui }; };
const ouvrir = async ({ qui = 'pilote', W = 1536, H = 864, q = '?n=3e', test = false, prof = true, tel = false, decal = 0, sansAttente = false }) => { const ctx = await nouveauCtx({ qui, W, H, tel, decal }); return pageDans(ctx, { qui, q, test, prof, sansAttente }); };
const profPrep = async (pg, test) => { await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }); await p(300);
  await pg.click('#tprof-btn').catch(() => {}); await p(600); if (test) await pg.evaluate(() => { window.M8_TEST = true; try { sessionStorage.setItem('mjpc_m8_test', '1'); } catch (e) {} }); };
const capt = async (pg, nom) => { if (CAPT && pg && !pg.isClosed()) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const garde = async pg => { if (await pg.evaluate(() => !!(document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))).catch(() => false)) { await pg.click('#garde-devant').catch(() => {}); await p(900); } };
/* ▶ par la souris, seulement s'il est à l'écran (forcer le clic d'un ▶ caché lève une erreur que Paul ne peut pas produire : registre, C16 303) */
const gesteClic = async pg => { if (!(await pg.isVisible('#bdev').catch(() => false))) return false; return pg.locator('#bdev').click({ timeout: 1500 }).then(() => true).catch(() => false); };
const cleDe = pg => pg.evaluate(() => { try { const m = S.mur; if (!m) return null; let eid = m.eid; try { if (!eid) eid = seance().ecrans[m.di].eid; } catch (e) {} return eid + '#' + (m.nDev || 0); } catch (e) { return null; } }).catch(() => null);
const modaleDe = pg => pg.evaluate(() => { const m = document.getElementById('at-modale'); if (!m) return null; return { texte: ((m.querySelector('.at-modale-m') || m).innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300), boutons: Array.from(m.querySelectorAll('button[data-i]')).map(b => (b.innerText || '').trim()) }; }).catch(() => null);
const bandeauDe = pg => pg.evaluate(() => { const b = document.getElementById('ses-reprise'); if (!b) return null; const r = b.getBoundingClientRect(); return r.height > 0 && getComputedStyle(b).display !== 'none' ? (b.innerText || '').replace(/\s+/g, ' ').trim() : null; }).catch(() => null);
const tabEtat = T => T.pg.evaluate(() => { const a = document.getElementById('ses-tab-att'); const m = (typeof DR_TAB === 'object' && DR_TAB.montre) || null; const c = (typeof SES === 'object' && SES.ctx) || null;
  return { attente: !!(a && a.style.display !== 'none'), cle: m ? m.eid + '#' + (m.nDev || 0) : null, origine: m ? m.origine || null : null, ctx: c ? ((c.repetition ? (c.test ? 'tableau_test' : 'repetition') : 'cours_actif') + ' · ' + (c.classeNom || c.classeSlug || '') + ' · séance ' + c.seance + (c.quoi ? ' · ' + c.quoi : '')) : null,
    ligne: ((document.getElementById('ses-tab-c') || {}).textContent || '').trim(), perdu: ((document.getElementById('ses-tab-perdu') || {}).textContent || '').trim() }; }).catch(e => ({ err: String(e).slice(0, 80) }));
const devEtat = d => d.pg.isClosed() ? { ferme: true } : d.pg.evaluate(() => { const t = id => ((document.getElementById(id) || {}).textContent || '').replace(/\s+/g, ' ').trim();
  let cle = null; try { const m = S.mur; if (m) cle = (m.eid || seance().ecrans[m.di].eid) + '#' + (m.nDev || 0); } catch (e) {}
  return { sesId: (typeof SES === 'object' && SES) ? SES.id : null, lancee: !!S.lancee && !S.close, rep: !!S.repetition, test: typeof m8TestOn === 'function' && m8TestOn(), ici: DR_SES.ici ? DR_SES.ici.sorte + ' ' + DR_SES.ici.base : null,
    main: DR_SES.ici ? (DR_SES.main === DR_SES.id ? 'moi' : (DR_SES.main ? 'autre' : '—')) : null, temoin: t('dr-session'), repTab: t('rep-tab'), mainTxt: t('dr-ses-main'), cle,
    classe: t('hclasse'), entete: ((document.querySelector('#pilotage .haut') || {}).innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160) }; }).catch(e => ({ err: String(e).slice(0, 80) }));
/* les chemins écrits au hub par chaque appareil (les nonces et les clés de copie ramenés à leur forme) */
const chemins = () => { const o = {}; ECR.forEach(x => { const k = x.qui; const c = x.c.replace(/\/telecommande\/[^/]+/, '/telecommande/<nonce>').replace(/\/chapitres\/\d+\/seances\/(\d+)\/deroule_joue\/([^/]+)/, '/…/seances/$1/deroule_joue/$2').replace(/\/(journal|etat|ecrans|heures)\/.*$/, '/$1/…');
  (o[k] = o[k] || {})[x.m + ' ' + c] = ((o[k] || {})[x.m + ' ' + c] || 0) + 1; }); return o; };

/* ── les gestes ── */
const edtCase = async (pg, jour, re) => { if (!(await clicTexte(pg, 'button', 'edtOuvrir()'))) await pg.evaluate(() => edtOuvrir()); await p(1500);
  return pg.evaluate(([j, rs]) => { const rx = new RegExp(rs, 'i'); const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && rx.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return null; const t = (x.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120); x.click(); return t; }, [jour, re]); };
/* lancer une heure par la case de l'emploi du temps : « Ouvrir le pilotage et lancer » (ou « Reprendre le cours ») ; si une modale paraît (« Une heure joue déjà… »), elle est rendue telle quelle */
const lancerCase = async (d, jour = '2026-09-14', re = 'Charles') => { const pg = d.pg; const cas = await edtCase(pg, jour, re); await p(800);
  const modalCase = await pg.evaluate(() => { const m = document.querySelector('.edt-modale, #edt-modale, .edt-mod'); return m ? (m.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 240) : null; }).catch(() => null);
  let quoi = null; if (cas && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer')) quoi = 'Ouvrir le pilotage et lancer'; else if (cas && await clicTexte(pg, 'button', 'Reprendre le cours')) quoi = 'Reprendre le cours'; else if (cas && await clicTexte(pg, 'button', 'Reprendre l’heure')) quoi = 'Reprendre l’heure';
  let dialogue = null; for (let k = 0; k < 20 && !dialogue; k++) { await p(200); dialogue = await modaleDe(pg); }
  if (!dialogue) { await p(2000); await pg.keyboard.press('Escape').catch(() => {}); await p(400); await garde(pg); }
  return { cas, modalCase, quoi, dialogue }; };
const ouvrirAtelier = async d => { const pg = d.pg; if (!(await clicTexte(pg, 'button', 'atelierOuvrir()'))) await pg.evaluate(() => atelierOuvrir()); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(2500); };
/* la répétition : l'Atelier, la séance (la colonne : `atSomAllerEcran`, ce qu'appelle le clic sur une diapo de la séance), l'onglet « Pilotage » */
const repeter = async (d, snum = null) => { await ouvrirAtelier(d); if (snum != null) { await d.pg.evaluate(s => { try { atSomAllerEcran(0, s); } catch (e) {} }, String(snum)); await p(1800); }
  await d.pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); let dialogue = null; for (let k = 0; k < 20 && !dialogue; k++) { await p(200); dialogue = await modaleDe(d.pg); } if (!dialogue) await p(2200);
  return { rep: await d.pg.evaluate(() => !!S.repetition).catch(() => null), seance: await d.pg.evaluate(() => ATVUES.snum).catch(() => null), dialogue }; };
const arreter = async d => { await d.pg.evaluate(() => { const b = document.getElementById('rep-stop'); if (b) b.click(); }).catch(() => {}); await p(2500); };
const clore = async d => { const pg = d.pg; await pg.evaluate(() => { const b = document.getElementById('dr-clore'); if (b) b.click(); }).catch(() => {}); await p(900); await pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }).catch(() => {}); await p(600);
  await pg.evaluate(() => { const g = document.getElementById('garde-clore'); if (g && g.classList.contains('on')) document.getElementById('gclore-oui').click(); }).catch(() => {}); await p(2500); await garde(pg); };
const fin = async (d, k) => (k === 'R' || k === 'RT') ? arreter(d) : clore(d);
const demarrer = async (d, k, v) => (k === 'H' || k === 'T') ? lancerCase(d, '2026-09-14', v === 'autre' ? 'DYLAN|CLASSE TEST' : 'Charles') : repeter(d, v === 'autre' ? '1' : null);
const estTest = k => k === 'T' || k === 'RT';
const NOMK = { H: 'vraie heure', T: 'essai en mode test', R: 'répétition', RT: 'répétition en mode test' };
/* qui le tableau distant suit : l'appareil dont la scène porte l'identité (SES.id) */
const quiSuit = (te, devs) => { if (!te || te.attente) return 'l’horloge (attente)'; const d = devs.find(x => x.id && x.id === te.origine); return (d ? d.nom : '?') + ' (' + te.ctx + ')'; };
const ids = async devs => { for (const d of devs) { if (!d.o.pg.isClosed()) d.id = await d.o.pg.evaluate(() => (typeof SES === 'object' && SES) ? SES.id : null).catch(() => null); } };

/* ═══ Q1 · les télescopages : A lance, puis B (un autre appareil, ou un autre onglet du même appareil), puis éventuellement C ═══ */
const combo = async ({ A, B, C = null, varB = 'meme', varC = 'meme', meme = false, tc = false }) => {
  HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0;
  const nom = A + '+' + B + (C ? '+' + C : '') + (varB === 'autre' ? '·autre' : '') + (meme ? '·même-appareil' : '') + (tc ? '·télécommande' : '');
  const out = { nom, A, B, C, varB, meme, etapes: [] }; const et = async (quoi, extra = {}) => { await ids(devs); const te = await tabEtat(T); const o = { quoi, tableau: te, suit: quiSuit(te, devs) }; for (const d of devs) o[d.nom] = await devEtat(d.o); Object.assign(o, extra); out.etapes.push(o); return o; };
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(600);
  const a = await ouvrir({ qui: 'A', test: estTest(A) }); const devs = [{ nom: 'A', o: a }];
  const rA = await demarrer(a, A, 'meme'); await garde(a.pg); for (let k = 0; k < 2; k++) { await gesteClic(a.pg); await p(350); } await p(1500);
  await et('A lance (' + NOMK[A] + ')', { lancement: rA });
  let tl = null; if (tc) { tl = await telecommandeOuvrir(a); if (tl) devs.push({ nom: 'télécommande de A', o: tl }); await p(1500); await et('A montre le QR, le téléphone devient sa télécommande'); }
  const b = meme ? await pageDans(a.ctx, { qui: 'B', test: estTest(B) }) : await ouvrir({ qui: 'B', test: estTest(B), W: 1366, H: 768 }); devs.push({ nom: 'B', o: b });
  const bdB = await bandeauDe(b.pg); await p(1200); const bdB2 = await bandeauDe(b.pg);
  const rB = await demarrer(b, B, varB); await p(800); await garde(b.pg);
  let choix = null; if (rB.dialogue) { await capt(b.pg, 'Q1-' + nom + '-B-dialogue'); choix = { boutons: rB.dialogue.boutons };
    /* le second bouton est « Lancer celle-ci quand même » (dr_sesDemander) : on le clique, puis on regarde ce qui s'est passé */
    await b.pg.evaluate(() => { const x = document.querySelector('#at-modale button[data-i="1"]'); if (x) x.click(); }).catch(() => {}); await p(3500); choix.apres = await modaleDe(b.pg); await garde(b.pg); }
  for (let k = 0; k < 2; k++) { await gesteClic(b.pg); await p(350); } await p(1500);
  await et('B ' + (meme ? '(autre onglet du même appareil) ' : '') + 'lance (' + NOMK[B] + (varB === 'autre' ? (B === 'R' || B === 'RT' ? ', autre séance' : ', autre classe') : ', même séance, même classe') + ') puis deux ▶', { bandeauB: bdB || bdB2, lancement: rB, choix });
  await capt(T.pg, 'Q1-' + nom + '-1-tableau-apres-B'); await capt(b.pg, 'Q1-' + nom + '-1-B');
  for (let k = 0; k < 2; k++) { await gesteClic(a.pg); await p(350); } await p(1500); await et('deux ▶ chez A');
  if (tl) { for (let k = 0; k < 2; k++) { await tl.pg.evaluate(() => { const x = document.querySelector('#tc-bas button[data-a="suiv"]'); if (x) x.click(); }).catch(() => {}); await p(500); } await p(1200); await et('deux ▶ à la télécommande de A', { tcHaut: await tl.pg.evaluate(() => ((document.getElementById('tc-haut') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 160)).catch(() => null) }); await capt(tl.pg, 'Q1-' + nom + '-telecommande'); }
  let c = null; if (C) { c = await ouvrir({ qui: 'C', test: estTest(C), W: 1366, H: 768 }); devs.push({ nom: 'C', o: c }); const rC = await demarrer(c, C, varC); await garde(c.pg);
    let ch = null; if (rC.dialogue) { ch = { boutons: rC.dialogue.boutons }; await c.pg.evaluate(() => { const x = document.querySelector('#at-modale button[data-i="1"]'); if (x) x.click(); }).catch(() => {}); await p(3500); }
    for (let k = 0; k < 2; k++) { await gesteClic(c.pg); await p(350); } await p(1500); await et('C lance (' + NOMK[C] + ') puis deux ▶', { lancement: rC, choix: ch }); await capt(T.pg, 'Q1-' + nom + '-2-tableau-apres-C'); }
  const kB = (await devEtat(b)).rep ? (estTest(B) ? 'RT' : 'R') : ((await devEtat(b)).lancee ? B : null);
  if (kB) { await fin(b, kB); await p(3500); await et('B s’arrête (' + ((kB === 'R' || kB === 'RT') ? '« ■ Arrêter »' : '« Clore l’heure »') + ')'); await capt(T.pg, 'Q1-' + nom + '-3-tableau-B-arrete'); }
  for (let k = 0; k < 2; k++) { await gesteClic(a.pg); await p(350); } await p(1500); await et('deux ▶ chez A, après l’arrêt de B');
  if (c) { const sC = await devEtat(c); const kC = sC.rep ? 'R' : (sC.lancee ? 'H' : null); if (kC) { await fin(c, kC); await p(3500); await et('C s’arrête'); } }
  await fin(a, A); await p(4000); const fa = await et('A s’arrête (' + ((A === 'R' || A === 'RT') ? '« ■ Arrêter »' : '« Clore l’heure »') + ')'); await capt(T.pg, 'Q1-' + nom + '-4-tableau-fin');
  out.hub = chemins(); out.refus = REFUSES.length; out.erreurs = [].concat(a.errs, a.boites, b.errs, b.boites, c ? c.errs : [], T.errs).slice(0, 6);
  out.pointeurs = { cours_actif: !!lireH('/site/cours_actif'), repetition: !!lireH('/site/repetition/pointeur'), tableau_test: !!lireH('/site/tableau_test/pointeur') };
  garderJ({ partie: 'Q1', ...out });
  const ligne = e => '« ' + e.quoi + ' » → tableau : ' + e.suit + (e.tableau && e.tableau.cle ? ' [' + e.tableau.cle + ']' : '');
  dire('\n— Q1 · ' + nom + ' —'); out.etapes.forEach(e => dire('   ' + ligne(e)));
  { const eb = out.etapes.find(x => /^B .*lance/.test(x.quoi)); dire('   B : bandeau à l’ouverture « ' + ((eb && eb.bandeauB) || '—') + ' » · ' + (rB.dialogue ? 'la modale « ' + rB.dialogue.texte + ' » · boutons ' + JSON.stringify(rB.dialogue.boutons) + ' · après un clic sur le 2e : ' + JSON.stringify(choix && choix.apres) : 'pas de modale') + ' · B ensuite : ' + JSON.stringify(eb && eb.B)); dire('   A ensuite : ' + JSON.stringify(eb && eb.A)); }
  dire('   pointeurs restés au hub à la fin : ' + JSON.stringify(out.pointeurs) + ' · écritures refusées : ' + out.refus + ' · erreurs : ' + out.erreurs.length);
  for (const d of [tl, c, b]) if (d && d.ctx !== a.ctx) await d.ctx.close().catch(() => {}); await a.ctx.close().catch(() => {}); await T.ctx.close().catch(() => {});
};
/* la télécommande de A : « 📱 » puis l'adresse du QR ouverte au téléphone */
const telecommandeOuvrir = async (o) => { const vb = await o.pg.waitForSelector('#dr-tc-btn', { state: 'visible', timeout: 4000 }).then(() => true).catch(() => false); if (!vb) return null;
  await o.pg.click('#dr-tc-btn').catch(() => {}); await p(900); const url = await o.pg.evaluate(() => { const i = document.getElementById('dr-tc-qr-img'); return i ? new URL(i.src).searchParams.get('data') : null; }).catch(() => null); if (!url) return null;
  const tl = await ouvrir({ qui: 'téléphone', W: 390, H: 844, tel: true, prof: false, q: '?' + url.split('?')[1], decal: TEL_DECAL }); for (let k = 0; k < 60; k++) { const h = await tl.pg.evaluate(() => { const x = document.getElementById('tc-haut'); return x && x.style.display !== 'none' ? x.innerText : ''; }).catch(() => ''); if (/Diapo|Hors/.test(h)) break; await p(250); } return tl; };
let TEL_DECAL = 0, TAB_DECAL = 0;

/* ═══ Q1D · un appareil qui disparaît : l'onglet fermé, ou la page gelée (l'ordinateur en veille) ═══ */
const disparition = async (k, comment) => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; const nom = k + '·' + comment; const out = { nom, k, comment, etapes: [] };
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(600);
  const a = await ouvrir({ qui: 'A', test: estTest(k) }); const devs = [{ nom: 'A', o: a }]; const et = async (quoi, extra = {}) => { await ids(devs); const te = await tabEtat(T); const o = { quoi, tableau: te, suit: quiSuit(te, devs), t: Date.now() }; for (const d of devs) o[d.nom] = await devEtat(d.o); Object.assign(o, extra); out.etapes.push(o); return o; };
  await demarrer(a, k, 'meme'); await garde(a.pg); for (let i = 0; i < 2; i++) { await gesteClic(a.pg); await p(350); } await p(1500); await et('A joue (' + NOMK[k] + ')');
  const ptrDe = () => k === 'H' ? '/site/cours_actif' : k === 'R' ? '/site/repetition/pointeur' : '/site/tableau_test/pointeur';
  let cdp = null;
  if (comment === 'ferme') { await a.ctx.close(); await p(6000); await et('l’onglet de A fermé, 6 s après', { pointeur: lireH(ptrDe()) ? 'au hub' : 'retiré' }); await p(24000); await et('30 s après', { pointeur: lireH(ptrDe()) ? 'au hub' : 'retiré' }); }
  else { cdp = await a.ctx.newCDPSession(a.pg); await cdp.send('Page.setWebLifecycleState', { state: 'frozen' }); await p(20000); await et('A gelé (veille), 20 s après', { pointeur: lireH(ptrDe()) ? 'au hub' : 'retiré' }); }
  await capt(T.pg, 'Q1D-' + nom + '-1-tableau');
  /* un autre appareil arrive : ce qu'il voit, puis il lance une répétition (ou, si A répétait, une vraie heure) */
  const b = await ouvrir({ qui: 'B', W: 1366, H: 768 }); devs.push({ nom: 'B', o: b }); await p(2500); const bd = await bandeauDe(b.pg);
  const kB = (k === 'R' || k === 'RT') ? 'H' : 'R'; const rB = await demarrer(b, kB, 'meme'); await garde(b.pg); for (let i = 0; i < 2; i++) { await gesteClic(b.pg); await p(350); } await p(1500);
  await et('B ouvre le site (bandeau : « ' + (bd || '—') + ' ») puis lance (' + NOMK[kB] + ') et deux ▶', { bandeauB: bd, lancement: rB }); await capt(b.pg, 'Q1D-' + nom + '-2-B'); await capt(T.pg, 'Q1D-' + nom + '-2-tableau');
  await fin(b, kB); await p(3500); await et('B s’arrête');
  if (cdp) { await cdp.send('Page.setWebLifecycleState', { state: 'active' }).catch(() => {}); await p(3000); for (let i = 0; i < 2; i++) { await gesteClic(a.pg); await p(350); } await p(1500); await et('A se réveille, deux ▶'); }
  /* le pointeur vieilli de 4 h 01 (le seuil `frais` du code, 4 × 3600 × 1000 ms) : ce que fait le tableau distant */
  const c = lireH(ptrDe()); if (c && c.ts) { posH(ptrDe() + '/ts', c.ts - 4 * 3600 * 1000 - 60000); pousserFlux(ptrDe()); await p(7000); await et('le pointeur de A vieilli de 4 h 01 (au hub)', { pointeur: 'vieilli' }); await capt(T.pg, 'Q1D-' + nom + '-3-tableau-4h'); }
  else await et('pas de pointeur de A au hub à vieillir');
  out.hub = chemins(); garderJ({ partie: 'Q1D', ...out });
  dire('\n— Q1D · ' + nom + ' —'); out.etapes.forEach(e => dire('   « ' + e.quoi + ' » → tableau : ' + e.suit + (e.tableau && e.tableau.cle ? ' [' + e.tableau.cle + ']' : '') + (e.pointeur ? ' · pointeur ' + e.pointeur : '') + (e.B && !e.B.ferme && e.B.repTab ? ' · B : « ' + e.B.repTab + ' »' : '')));
  if (rB.dialogue) dire('   la modale chez B : « ' + rB.dialogue.texte + ' » · boutons ' + JSON.stringify(rB.dialogue.boutons));
  await b.ctx.close().catch(() => {}); await a.ctx.close().catch(() => {}); await T.ctx.close().catch(() => {}); };

/* ═══ Q3 · la participation ═══ */
const QB = 'emt9v3yqo6pvd5';
const deQuiListe = (L, E) => L.length === E.length && L.every((x, i) => x === E[i]);
const allerA = async (pg, eid) => { const L = await pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid })); } catch (e) { return []; } }); const x = L.find(e => e.eid === eid); if (!x) return false; const v = await pg.$('#volet .vig[data-i="' + x.i + '"]'); if (!v) return false;
  await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(600); await garde(pg); for (let k = 0; k < 20; k++) { const e = await pg.evaluate(() => { try { return seance().ecrans[S.di].eid; } catch (e) { return null; } }); if (e === eid) return true; await p(200); } return false; };
const participation = async (k) => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0;
  const cls = lireH('/classes'); const listes = {}; Object.keys(cls).forEach(n => { const e = cls[n] && cls[n].eleves; if (Array.isArray(e)) listes[n] = e; });
  const kk = k === 'Rc' ? 'R' : k; const a = await ouvrir({ qui: 'A', test: estTest(kk) }); await demarrer(a, kk, 'meme'); let choixClasse = null;
  if (k === 'Rc') { /* la répétition « pour » une autre classe : le nom de la classe dans l'en-tête se clique (dr_hclasseMenu), puis l'autre classe */ await a.pg.click('#hclasse').catch(() => {}); await p(600);
    choixClasse = await a.pg.evaluate(() => Array.from(document.querySelectorAll('#dr-classes-choix [data-cl]')).map(b => b.dataset.cl)).catch(() => null);
    await a.pg.evaluate(() => { const b = document.querySelector('#dr-classes-choix [data-cl="CLASSE TEST"]'); if (b) b.click(); }).catch(() => {}); await p(1500); }
  await garde(a.pg); await p(1500);
  const lst = await a.pg.evaluate(() => ({ n: ELEVES.length, eleves: ELEVES.slice(), presents: ((document.getElementById('presents') || {}).textContent || '').trim(), classe: ((document.getElementById('hclasse') || {}).textContent || '').trim(), source: (() => { try { return dr_classe().slug; } catch (e) { return null; } })(), rep: !!S.repetition, test: m8TestOn(), INI: Object.assign({}, INI) }));
  const deQui = Object.keys(listes).filter(n => listes[n].length === lst.n && listes[n].every((x, i) => x === lst.eleves[i]));
  /* les initiales des élèves des autres classes du faux hub (de vraies listes de classe), passées à la fonction que la touche Entrée appelle (`dr_candidats`) : combien iraient à un élève de la liste montrée */
  const autres = {}; for (const n of Object.keys(listes)) { if (deQuiListe(listes[n], lst.eleves)) continue; autres[n] = await a.pg.evaluate(L => { const ini = n => { const m = n.trim().split(/\s+/); const pre = m.length > 1 ? m.slice(1).join(' ') : m[0]; const fam = m.length > 1 ? m[0] : ''; return ((pre[0] || '') + (fam[0] || pre[1] || '')).toUpperCase(); };
    const r = L.filter(x => typeof x === 'string').map(n => dr_candidats(ini(n))); return { eleves: r.length, attribues: r.filter(x => x.length).length }; }, listes[n]).catch(e => String(e)); }
  const aQB = await allerA(a.pg, QB);
  /* les cas d'initiales, calculés sur la liste montrée : (a) celles d'un élève de la liste ; (b) leur anagramme (si elle n'est celle de personne) ; (c) le début d'un prénom de la liste ; (d) des initiales de personne */
  const INI = lst.INI; const tous = Object.values(INI).map(x => String(x).replace(/\d+$/, '')); const prenoms = await a.pg.evaluate(() => Object.assign({}, PRENOMS));
  const tri = s => s.split('').sort().join(''); const plat = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  /* chaque cas sur un élève différent (les verts se distinguent) : l'exact sur le 3e de la liste, l'anagramme sur un autre */
  const exact = tous.filter(x => x.length === 2)[2] || tous[0]; const ana = tous.filter(x => x !== exact && x.replace(/\d+$/, '') !== exact).map(x => x.split('').reverse().join('')).find(x => x[0] !== x[1] && !tous.includes(x) && !Object.values(prenoms).some(pp => plat(pp).indexOf(x.toLowerCase()) === 0));
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; let pref = null; for (const x of Object.values(prenoms)) { const c2 = plat(x).slice(0, 2).toUpperCase(); if (/^[A-Z]{2}$/.test(c2) && !tous.some(y => y === c2 || tri(y) === tri(c2) || y.indexOf(c2) === 0)) { pref = c2; break; } }
  let rien = null; for (const x of AZ) { for (const y of AZ) { const c2 = x + y; if (!tous.some(z => z === c2 || tri(z) === tri(c2) || z.indexOf(c2) === 0) && !Object.values(prenoms).some(pp => plat(pp).indexOf(c2.toLowerCase()) === 0)) { rien = c2; break; } } if (rien) break; }
  const CAS = [['a', 'les initiales d’un élève de la liste', exact], ['b', 'l’anagramme d’initiales de la liste (celles de personne)', ana], ['c', 'le début d’un prénom de la liste (initiales de personne)', pref], ['d', 'des initiales de personne, début d’aucun prénom', rien]].filter(x => x[2]);
  const res = [];
  for (const [id, quoi, ini] of CAS) for (const valider of ['Entrée', 'clic dans la réponse']) {
    const lignes = await a.pg.$$('#mur .rep[data-r] .ini'); const nl = lignes.length; const champ = lignes[nl - 1]; if (!champ) { res.push({ id, valider, erreur: 'pas de ligne de réponse' }); continue; }
    const verts0 = await a.pg.evaluate(() => Array.from(document.querySelectorAll('#part span[data-ini].dr-ok')).map(s => s.dataset.ini));
    await champ.click(); await p(150); await a.pg.keyboard.type(ini, { delay: 60 }); await p(200);
    if (valider === 'Entrée') await a.pg.keyboard.press('Enter'); else { const dit = await a.pg.$$('#mur .rep[data-r] .dit'); await dit[dit.length - 1].click(); }
    await p(250); await a.pg.keyboard.type('Une réponse d’élève ' + id, { delay: 15 }); await p(150); await a.pg.keyboard.press('Enter'); await p(900);
    const v = await a.pg.evaluate(() => { const d = parDiapo['0|emt9v3yqo6pvd5'] || Object.values(parDiapo).find(x => x && x.reps); let der = null; try { Object.values(d.reps || {}).forEach(l => (l || []).forEach(r => { if (r && r.r && /Une réponse d’élève/.test(r.r)) der = r; })); } catch (e) {}
      const verts = Array.from(document.querySelectorAll('#part span[data-ini].dr-ok')).map(s => s.dataset.ini); return { r: der ? { i: der.i, eleve: der.eleve } : null, verts, presents: ((document.getElementById('presents') || {}).textContent || '').trim() }; });
    const rang = v.r && v.r.eleve ? lst.eleves.indexOf(v.r.eleve) + 1 : 0;
    const neufs = v.verts.filter(x => !verts0.includes(x)).map(x => { const n = Object.keys(INI).find(m => INI[m] === x); return 'ÉLÈVE ' + (lst.eleves.indexOf(n) + 1) + ' (' + String(x).replace(/\d+$/, '') + ')'; });
    res.push({ id, quoi, tape: ini, valider, gardeCommeInitiales: v.r && v.r.i, attribueA: rang ? 'ÉLÈVE ' + rang + ' de la liste' : 'personne', vertsNeufs: neufs, verts: v.verts.length, presents: v.presents });
  }
  await capt(a.pg, 'Q3-' + k + '-pilote');
  const out = { partie: 'Q3', k, eleves: lst.n, presents: lst.presents, classeEntete: lst.classe, classeDeLaListe: deQui, source: lst.source, rep: lst.rep, test: lst.test, questionBilan: aQB, cas: res, autresClasses: autres, choixClasse };
  garderJ(out); dire('\n— Q3 · ' + (NOMK[k] || 'répétition, la classe choisie dans l’en-tête : CLASSE TEST (menu : ' + JSON.stringify(choixClasse) + ')') + ' — la liste : ' + lst.n + ' élèves (« ' + lst.presents + ' »), celle de ' + JSON.stringify(deQui) + ' ; en-tête « ' + lst.classe + ' »');
  dire('   les élèves des autres classes du faux hub, leurs initiales passées à `dr_candidats` (ce que fait Entrée) : ' + JSON.stringify(autres));
  res.forEach(x => dire('   (' + x.id + ') ' + x.quoi + ' « ' + x.tape + ' », ' + x.valider + ' : gardée comme « ' + x.gardeCommeInitiales + ' », attribuée à ' + x.attribueA + ' ; passe(nt) au vert : ' + (x.vertsNeufs.join(', ') || 'aucune') + ' ; pastilles vertes : ' + x.verts + ' ; « ' + x.presents + ' »'));
  await a.ctx.close().catch(() => {}); };

/* ═══ Q2 · le minuteur ═══ */
const rectsTexte = (pg, sel) => pg.evaluate(s => { const m = document.querySelector(s); if (!m) return []; const out = []; const w = document.createTreeWalker(m, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || el.offsetParent === null) continue; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue; const rg = document.createRange(); rg.selectNodeContents(n); Array.from(rg.getClientRects()).forEach(r => { if (r.width > 1 && r.height > 1) out.push({ x: r.left, y: r.top, w: r.width, h: r.height, t: n.textContent.trim().slice(0, 20) }); }); } return out; }, sel).catch(() => []);
const rectDe = (pg, sel) => pg.evaluate(s => { const m = document.querySelector(s); if (!m) return null; const r = m.getBoundingClientRect(); const cs = getComputedStyle(m); if (cs.display === 'none' || r.width === 0) return null; return { x: r.left, y: r.top, w: r.width, h: r.height }; }, sel).catch(() => null);
const inter = (a, b) => { const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); return w > 0 && h > 0 ? Math.round(w * h) : 0; };
const styleDe = (pg, sel) => pg.evaluate(s => { const m = document.querySelector(s); if (!m) return null; const c = getComputedStyle(m); return { police: c.fontFamily.slice(0, 60), taille: c.fontSize, graisse: c.fontWeight, couleur: c.color, fond: c.backgroundColor, coins: c.borderRadius, bord: c.border.slice(0, 40), ombre: c.boxShadow.slice(0, 40), marge: c.padding }; }, sel).catch(() => null);
const secDe = t => { const m = /(\d+):(\d\d)/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };

/* ═══ la scène : une vraie heure (la case du 14/09, pas une répétition), la diapo « Chaque groupe présente son tableau et son hypothèse… » (une des 7 de l'audit I §2.5), tout dévoilé, le minuteur au tableau, il reste 4:32 ═══ */
const IMG = process.env.MJPC_IMG || ici; fs.mkdirSync(IMG, { recursive: true });
const W = 1920, H = 1080;
HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0;
const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W, H, prof: false }); await p(600);
const a = await ouvrir({ qui: 'ordinateur', W, H }); const lc = await demarrer(a, 'H', 'meme'); await garde(a.pg);
dire('lancement : ' + JSON.stringify({ quoi: lc.quoi, dialogue: lc.dialogue && lc.dialogue.texte, rep: await a.pg.evaluate(() => !!S.repetition) }));
const cible = await a.pg.evaluate(() => { try { const E = seance().ecrans; const L = ordreHeure(S.heure); const x = L.find(i => /hypoth[eè]se/i.test(JSON.stringify(E[i].blocs || [])) && /groupe pr[eé]sente/i.test(JSON.stringify(E[i].blocs || []))); return x == null ? null : E[x].eid; } catch (e) { return 'err ' + e.message; } });
dire('diapo visée : ' + cible + ' · allée : ' + (cible ? await allerA(a.pg, cible) : false));
for (let i = 0; i < 14; i++) { const c = await a.pg.evaluate(() => (document.getElementById('compte') || {}).textContent || ''); if (/^(\d+) \/ \1 dévoilés|rien à dévoiler/.test(c)) break; if (!(await gesteClic(a.pg))) break; await p(250); }
await p(1200);
/* le minuteur : ⏱, « au tableau » coché, Départ (5:00) ; puis le reste recalé à 4:32 avant chaque paire (dans la page seulement), pour que les douze images montrent le même instant */
await a.pg.evaluate(() => { const b = document.getElementById('bchrono'); if (b) b.click(); }); await p(500); await a.pg.click('#dr-minut-tab').catch(() => {}); await p(300); await a.pg.click('#dr-minut-go').catch(() => {}); await p(600);
const a432 = async () => { await a.pg.evaluate(() => { const m = DR_CL.minut; if (m && m.etat === 'court') { m.fin = Date.now() + 272250; dr_minuteurEnvoyer(); dr_minuteurAfficher(); } }); await p(650); };
const panneauOuvert = () => a.pg.evaluate(() => { const q = document.getElementById('dr-minut-p'); return !!(q && q.style.display !== 'none'); });
const rects = (pg, sels) => pg.evaluate(L => L.map(s => { const m = document.querySelector(s); if (!m) return [s, null]; const r = m.getBoundingClientRect(); return [s, getComputedStyle(m).display === 'none' ? 'caché' : [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]]; }), sels);
const couvert = async (pg, sel) => { const m = await rectDe(pg, sel); const L = await rectsTexte(pg, '#mur2'); return m ? L.filter(r => inter(r, m) > 0).map(r => r.t) : null; };
/* chaque image prise quand l'écran montre 04:32 (lu juste avant la prise) */
const lu = { tableau: () => T.pg.evaluate(() => (document.getElementById('dr-tab-minut') || {}).textContent), pilote: () => a.pg.evaluate(() => (document.getElementById('dr-minut-aff') || {}).textContent) };
const prendre = async (pg, nom, k) => { let t = null; for (let i = 0; i < 4; i++) { await a432(); t = await lu[k](); if (t === '04:32') break; } await pg.screenshot({ path: path.join(IMG, nom + '-' + k + '.png') }); return t; };
const prise = async (nom) => { const lt = await prendre(T.pg, nom, 'tableau'), lp = await prendre(a.pg, nom, 'pilote'); dire(nom + ' · lu juste avant la prise : tableau ' + lt + ', pilote ' + lp);
  dire(nom + ' · relu après la prise : pilote ' + JSON.stringify(await a.pg.evaluate(() => (document.getElementById('dr-minut-aff') || {}).textContent)) + ' · tableau ' + JSON.stringify(await T.pg.evaluate(() => (document.getElementById('dr-tab-minut') || {}).textContent))); };
if (process.env.MJPC_EXPLORE) {
  dire('pilote : ' + JSON.stringify(await a.pg.evaluate(() => { const o = []; const pil = document.getElementById('pilotage') || document.body; Array.from(pil.querySelectorAll('*')).filter(e => e.children.length && e.offsetParent !== null).slice(0, 400).forEach(e => { const r = e.getBoundingClientRect(); if (r.width > 250 && r.height > 30 && (e.id || e.className)) o.push((e.id ? '#' + e.id : '.' + String(e.className).split(' ')[0]) + ' ' + [r.left, r.top, r.width, r.height].map(Math.round).join(',')); }); return o.slice(0, 40); })));
  dire('entête : ' + JSON.stringify(await a.pg.evaluate(() => { const hh = document.querySelector('#pilotage .haut'); if (!hh) return null; return Array.from(hh.querySelectorAll('button')).filter(b => b.offsetParent !== null).map(b => (b.id || '') + '«' + (b.innerText || '').trim().slice(0, 14) + '»' + Math.round(b.getBoundingClientRect().left) + ',' + Math.round(b.getBoundingClientRect().top)); })));
  dire('autour : ' + JSON.stringify(await rects(a.pg, ['#pilotage', '#pilotage .haut', '#mur', '#bchrono', '#dr-minut', '#dr-minut-p', '#volet', '#vue-mini', '#btableau', '.rapides', '#dr-zone'])));
  dire('tableau : ' + JSON.stringify(await rects(T.pg, ['#mur2', '#dr-tab-minut'])) + ' · couvert ' + JSON.stringify(await couvert(T.pg, '#dr-tab-minut')));
  dire('mur2 : ' + JSON.stringify(await T.pg.evaluate(() => Array.from(document.querySelectorAll('#mur2 *')).filter(e => e.offsetParent !== null && (e.innerText || '').trim()).slice(0, 14).map(e => { const r = e.getBoundingClientRect(); return e.tagName + '.' + String(e.className).split(' ')[0] + ' ' + [r.left, r.top, r.width, r.height].map(Math.round).join(',') + ' «' + (e.innerText || '').trim().slice(0, 30) + '»'; }))));
  dire('couleurs : ' + JSON.stringify(await a.pg.evaluate(() => { const c = s => { const m = document.querySelector(s); if (!m) return null; const k = getComputedStyle(m); return [k.color, k.backgroundColor, k.fontFamily.slice(0, 30)]; }; return { haut: c('#pilotage .haut'), body: c('body'), rouge: c('.btn.rouge') || c('.btn.danger') || c('#dr-clore') }; })));
}
const P = String(process.env.MJPC_P || 'P0').split(',');
if (P.includes('P0')) { if (!(await panneauOuvert())) await a.pg.evaluate(() => dr_minuteurPanneau(true)); await prise('P0'); dire('P0 · couvert au tableau : ' + JSON.stringify(await couvert(T.pg, '#dr-tab-minut'))); }
/* ═══ les cinq propositions : construites dans la page de la capture seulement (le style et les éléments ajoutés portent la classe « cap-… ») ═══
   Les couleurs sont celles du site : or #e4b45c sur brun #3a2c14 (le bouton « Départ », .btn.or), Garamond (« EB Garamond » de l'entête). */
const OR = '#e4b45c', BRUN = '#3a2c14';
/* au tableau : effacer la proposition d'avant, cacher le minuteur d'aujourd'hui, poser le style de la nouvelle ; les chiffres recopiés du minuteur réel toutes les 200 ms */
const tabPoser = (css, html) => T.pg.evaluate(([css, html, OR, BRUN]) => { document.querySelectorAll('.cap-el,#cap-style').forEach(e => e.remove()); clearInterval(window.__capT);
  const st = document.createElement('style'); st.id = 'cap-style'; st.textContent = '#ses-tab #dr-tab-minut{display:none!important}' + css; document.head.appendChild(st);
  const z = document.getElementById('ses-tab'); const d = document.createElement('div'); d.innerHTML = html; Array.from(d.children).forEach(e => { e.classList.add('cap-el'); z.appendChild(e); });
  const maj = () => { const t = ((document.getElementById('dr-tab-minut') || {}).textContent || '').trim(); const m = /(\d+):(\d\d)/.exec(t); const s = m ? +m[1] * 60 + +m[2] : 0;
    const dur = (typeof DR_TAB === 'object' && DR_TAB.minut && DR_TAB.minut.d) ? DR_TAB.minut.d / 1000 : 300; const f = Math.max(0, Math.min(1, s / dur));
    document.querySelectorAll('.cap-chif').forEach(e => { if (e.textContent !== t) e.textContent = t; });
    document.querySelectorAll('.cap-rempli').forEach(e => { e.style.width = (f * 100) + '%'; });
    document.querySelectorAll('.cap-anneau').forEach(e => { const L = 2 * Math.PI * 64; e.setAttribute('stroke-dasharray', (f * L) + ' ' + L); }); };
  maj(); window.__capT = setInterval(maj, 200); }, [css, html, OR, BRUN]);
/* les mesures au tableau : la diapo (sa place), le texte que la proposition couvre, le texte qui déborde de la diapo */
const tabMesure = async (nom) => { const m = await T.pg.evaluate(() => { const r = document.getElementById('mur2').getBoundingClientRect(); const mm = document.querySelector('.cap-min');
    const L = []; const w = document.createTreeWalker(document.getElementById('mur2'), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement || n.parentElement.offsetParent === null) continue; const rg = document.createRange(); rg.selectNodeContents(n); Array.from(rg.getClientRects()).forEach(q => { if (q.width > 1 && q.height > 1) L.push({ x: q.left, y: q.top, w: q.width, h: q.height, t: n.textContent.trim().slice(0, 24) }); }); }
    const b = mm ? mm.getBoundingClientRect() : null; const inter = (a, c) => Math.min(a.x + a.w, c.left + c.width) - Math.max(a.x, c.left) > 0 && Math.min(a.y + a.h, c.top + c.height) - Math.max(a.y, c.top) > 0;
    return { diapo: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], minuteur: b ? [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)] : null,
      couvert: b ? L.filter(q => inter(q, b)).map(q => q.t) : null, deborde: L.filter(q => q.y + q.h > r.bottom + 1 || q.x + q.w > r.right + 1).map(q => q.t).slice(0, 3) }; });
  dire(nom + ' · tableau : ' + JSON.stringify(m)); return m; };
/* au pilote : le ⏱ et ses chiffres dans l'entête, parmi les boutons ; le panneau en rangée sous ces boutons (la seconde ligne de l'entête, libre à droite de « Enregistré ») */
const piloteEntete = () => a.pg.evaluate(([OR, BRUN]) => { document.querySelectorAll('.cap-el,#cap-style-p').forEach(e => e.remove()); clearInterval(window.__capP);
  const t5 = document.getElementById('dr-t5'); const b = document.createElement('button'); b.className = 'btn cap-el'; b.id = 'cap-bchrono'; b.innerHTML = '⏱ <b class="cap-chifp"></b>'; t5.parentNode.insertBefore(b, t5);
  const st = document.createElement('style'); st.id = 'cap-style-p'; st.textContent = '#bchrono,#dr-minut-aff{display:none!important}#cap-bchrono{color:' + OR + ';border-color:' + OR + ';background:' + BRUN + '}#cap-bchrono b{font-weight:700}'; document.head.appendChild(st);
  const r = b.getBoundingClientRect(); const pn = document.getElementById('dr-minut-p'); pn.style.display = '';
  st.textContent += '#dr-minut-p{position:fixed!important;top:' + Math.round(r.bottom + 4) + 'px!important;left:' + Math.round(r.left) + 'px!important;box-shadow:none!important}';
  const maj = () => { const x = (document.getElementById('dr-minut-aff') || {}).textContent || ''; b.querySelector('b').textContent = x; }; maj(); window.__capP = setInterval(maj, 200); }, [OR, BRUN]);
/* au pilote : le panneau dans la colonne de droite, en tête (une carte comme « Diapo suivante ») */
const piloteColonne = () => a.pg.evaluate(([OR, BRUN]) => { document.querySelectorAll('.cap-el,#cap-style-p').forEach(e => e.remove()); clearInterval(window.__capP);
  const dr = document.getElementById('droite'); const sv = dr.querySelector('.suivante'); const c = document.createElement('div'); c.className = (sv ? sv.className + ' ' : '') + 'cap-el'; c.id = 'cap-carte';
  const h = sv && sv.firstElementChild ? sv.firstElementChild.cloneNode(false) : document.createElement('div'); h.textContent = 'Minuteur'; c.appendChild(h);
  const g = document.createElement('div'); g.className = 'cap-chifp'; c.appendChild(g); const pn = document.getElementById('dr-minut-p'); c.appendChild(pn); dr.insertBefore(c, dr.firstChild); pn.style.display = '';
  const st = document.createElement('style'); st.id = 'cap-style-p'; st.textContent = '#bchrono,#dr-minut-aff{display:none!important}#cap-carte{height:auto!important}#cap-carte .cap-chifp{font:700 44px "EB Garamond",Georgia,serif;color:' + OR + ';text-align:center;line-height:1.1;margin:4px 0}'
    + '#cap-carte #dr-minut-p{position:static!important;display:flex!important;flex-wrap:wrap;gap:6px;justify-content:center;box-shadow:none!important;background:transparent!important;border:0!important;padding:0!important;width:auto!important}'; document.head.appendChild(st);
  const maj = () => { g.textContent = (document.getElementById('dr-minut-aff') || {}).textContent || ''; }; maj(); window.__capP = setInterval(maj, 200); }, [OR, BRUN]);
const piloteMesure = async (nom) => { const m = await a.pg.evaluate(() => { const q = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
    const p = q('#dr-minut-p'), mur = q('#mur'), dr = document.getElementById('droite'); const inter = (a, b) => a && b && Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 0 && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 0;
    const hh = document.querySelector('#pilotage .haut'); return { panneau: p && [p.x, p.y, p.w, p.h].map(Math.round), surLaDiapo: inter(p, mur), diapo: mur && [mur.x, mur.y, mur.w, mur.h].map(Math.round),
      enteteDeborde: hh ? hh.scrollWidth > hh.clientWidth + 1 : null, colonneDeborde: dr ? Math.max(0, dr.scrollHeight - dr.clientHeight) : null }; });
  dire(nom + ' · pilote : ' + JSON.stringify(m)); return m; };

const ACT = await T.pg.evaluate(() => { const e = document.querySelector('#mur2 .act'); if (!e) return null; const r = e.getBoundingClientRect(); return { y: r.top, h: r.height, d: r.right }; });
if (P.includes('P1')) { await tabPoser('#ses-tab #mur2{inset:64px 0 0 0!important;margin:0 auto!important;width:calc((100vh - 64px) * 16 / 9)!important}'
    + '#ses-tab .cap-bande{position:absolute;left:0;right:0;top:0;height:64px;background:' + BRUN + ';border-bottom:1px solid ' + OR + ';display:flex;align-items:center;justify-content:flex-end;padding:0 28px;box-sizing:border-box;z-index:20}'
    + '#ses-tab .cap-bande .cap-chif{font:700 48px "EB Garamond",Georgia,serif;color:' + OR + ';letter-spacing:.04em;line-height:1}',
    '<div class="cap-bande cap-min"><span class="cap-chif"></span></div>'); await piloteEntete(); await prise('P1'); await tabMesure('P1'); await piloteMesure('P1'); }
if (P.includes('P3')) { await tabPoser('#ses-tab #mur2{inset:0 0 44px 0!important;margin:0 auto!important;width:calc((100vh - 44px) * 16 / 9)!important}'
    + '#ses-tab .cap-barre{position:absolute;left:0;right:0;bottom:0;height:44px;background:' + BRUN + ';display:flex;align-items:center;gap:18px;padding:0 24px;box-sizing:border-box;z-index:20}'
    + '#ses-tab .cap-piste{flex:1;height:12px;border-radius:6px;background:rgba(228,180,92,.18);overflow:hidden}#ses-tab .cap-rempli{height:100%;background:' + OR + ';border-radius:6px}'
    + '#ses-tab .cap-barre .cap-chif{font:700 34px "EB Garamond",Georgia,serif;color:' + OR + ';line-height:1}',
    '<div class="cap-barre cap-min"><div class="cap-piste"><div class="cap-rempli"></div></div><span class="cap-chif"></span></div>'); await piloteEntete(); await prise('P3'); await tabMesure('P3'); await piloteMesure('P3'); }
if (P.includes('P4')) { /* le coin libre : le premier des quatre coins (160 × 160, à 24 px du bord de la diapo) où aucune ligne de texte n'est posée */
  const coin = await T.pg.evaluate(() => { const r = document.getElementById('mur2').getBoundingClientRect(); const L = []; const w = document.createTreeWalker(document.getElementById('mur2'), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement || n.parentElement.offsetParent === null) continue; const rg = document.createRange(); rg.selectNodeContents(n); Array.from(rg.getClientRects()).forEach(q => L.push(q)); }
    const S2 = 160, M = 24; const C = { 'en bas à droite': [r.right - M - S2, r.bottom - M - S2], 'en haut à droite': [r.right - M - S2, r.top + M], 'en bas à gauche': [r.left + M, r.bottom - M - S2], 'en haut à gauche': [r.left + M, r.top + M] };
    for (const k of Object.keys(C)) { const [x, y] = C[k]; if (!L.some(q => Math.min(q.right, x + S2) - Math.max(q.left, x) > 0 && Math.min(q.bottom, y + S2) - Math.max(q.top, y) > 0)) return { k, x, y }; } return null; });
  dire('P4 · le coin libre : ' + JSON.stringify(coin));
  if (coin) await tabPoser('#ses-tab .cap-pastille{position:absolute;left:' + coin.x + 'px;top:' + coin.y + 'px;width:160px;height:160px;z-index:20}#ses-tab .cap-pastille svg{position:absolute;inset:0}'
      + '#ses-tab .cap-pastille .cap-chif{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 40px "EB Garamond",Georgia,serif;color:' + OR + '}',
      '<div class="cap-pastille cap-min"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="76" fill="' + BRUN + '"/><circle cx="80" cy="80" r="64" fill="none" stroke="rgba(228,180,92,.2)" stroke-width="10"/><circle class="cap-anneau" cx="80" cy="80" r="64" fill="none" stroke="' + OR + '" stroke-width="10" stroke-linecap="round" transform="rotate(-90 80 80)"/></svg><span class="cap-chif"></span></div>');
  await piloteEntete(); await prise('P4'); await tabMesure('P4'); await piloteMesure('P4'); }
if (P.includes('P5') && ACT) { await tabPoser('#ses-tab .cap-titre{position:absolute;right:38px;top:' + Math.round(ACT.y) + 'px;height:' + Math.round(ACT.h) + 'px;padding:0 16px;border-radius:' + Math.round(ACT.h / 2) + 'px;background:' + BRUN + ';display:flex;align-items:center;z-index:20}'
    + '#ses-tab .cap-titre .cap-chif{font:700 ' + Math.round(ACT.h * .72) + 'px "EB Garamond",Georgia,serif;color:' + OR + ';letter-spacing:.04em;line-height:1}',
    '<div class="cap-titre cap-min"><span class="cap-chif"></span></div>'); await piloteEntete(); await prise('P5'); await tabMesure('P5'); await piloteMesure('P5'); }
if (P.includes('P2')) { await tabPoser('#ses-tab #mur2{inset:0 180px 0 0!important;margin:auto 0!important;width:calc(100vw - 180px)!important}'
    + '#ses-tab .cap-colonne{position:absolute;right:0;top:0;bottom:0;width:180px;background:' + BRUN + ';border-left:1px solid ' + OR + ';display:flex;align-items:flex-start;justify-content:center;padding-top:40px;box-sizing:border-box;z-index:20}'
    + '#ses-tab .cap-colonne .cap-chif{font:700 52px "EB Garamond",Georgia,serif;color:' + OR + ';line-height:1}',
    '<div class="cap-colonne cap-min"><span class="cap-chif"></span></div>'); await piloteColonne(); await prise('P2'); await tabMesure('P2'); await piloteMesure('P2'); }
/* ═══ C16 656 (Paul, 04/11 16:54) — P4B : au tableau, P4 ; au pilote, le bouton chrono reste sous la diapo ; son réglage s'ouvre sous la diapo, au-dessus des notes,
   avec un zoom ; la pastille est aussi sur la diapo du pilote, au même endroit qu'au tableau : Paul la glisse, elle glisse au tableau (montré à l'arrêt ici) ═══ */
if (P.includes('P4B')) {
  const coin = await T.pg.evaluate(() => { const r = document.getElementById('mur2').getBoundingClientRect(); const L = []; const w = document.createTreeWalker(document.getElementById('mur2'), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement || n.parentElement.offsetParent === null) continue; const rg = document.createRange(); rg.selectNodeContents(n); Array.from(rg.getClientRects()).forEach(q => L.push(q)); }
    const S2 = 160, M = 24; const C = { 'en bas à droite': [r.right - M - S2, r.bottom - M - S2], 'en haut à droite': [r.right - M - S2, r.top + M], 'en bas à gauche': [r.left + M, r.bottom - M - S2], 'en haut à gauche': [r.left + M, r.top + M] };
    for (const k of Object.keys(C)) { const [x, y] = C[k]; if (!L.some(q => Math.min(q.right, x + S2) - Math.max(q.left, x) > 0 && Math.min(q.bottom, y + S2) - Math.max(q.top, y) > 0)) return { k, x, y, fx: (x - r.left) / r.width, fy: (y - r.top) / r.height, fs: S2 / r.width }; } return null; });
  dire('P4B · le coin libre : ' + JSON.stringify(coin));
  const PAST = (cls) => '<div class="' + cls + ' cap-min"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="76" fill="' + BRUN + '"/><circle cx="80" cy="80" r="64" fill="none" stroke="rgba(228,180,92,.2)" stroke-width="10"/><circle class="cap-anneau" cx="80" cy="80" r="64" fill="none" stroke="' + OR + '" stroke-width="10" stroke-linecap="round" transform="rotate(-90 80 80)"/></svg><span class="cap-chif"></span></div>';
  if (coin) await tabPoser('#ses-tab .cap-pastille{position:absolute;left:' + coin.x + 'px;top:' + coin.y + 'px;width:160px;height:160px;z-index:20}#ses-tab .cap-pastille svg{position:absolute;inset:0}'
      + '#ses-tab .cap-pastille .cap-chif{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 40px "EB Garamond",Georgia,serif;color:' + OR + '}', PAST('cap-pastille'));
  const mp = await a.pg.evaluate(([OR, BRUN, coin, html]) => { document.querySelectorAll('.cap-el,#cap-style-p').forEach(e => e.remove()); clearInterval(window.__capP);
    const mur = document.getElementById('mur').getBoundingClientRect(); const bc = document.getElementById('bchrono'); const barre = bc ? bc.parentElement.getBoundingClientRect() : null;
    const notes = document.querySelector('#pilotage .notes') || document.querySelector('.notes'); const pn = document.getElementById('dr-minut-p'); pn.style.display = '';
    const z = document.createElement('label'); z.className = 'cap-el cap-zoom'; z.innerHTML = 'zoom <input type="range" min="60" max="200" value="100">'; pn.appendChild(z);
    const st = document.createElement('style'); st.id = 'cap-style-p'; const H2 = 46; const top = Math.round((barre ? barre.bottom : mur.bottom) + 6);
    st.textContent = '#dr-minut-p{position:fixed!important;left:' + Math.round(mur.left) + 'px!important;top:' + top + 'px!important;width:' + Math.round(mur.width) + 'px!important;height:' + H2 + 'px!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;gap:12px!important;padding:0 14px!important;box-shadow:none!important;transform:none!important;bottom:auto!important;right:auto!important;z-index:30}'
      + '#dr-minut-p .cap-zoom{display:flex;align-items:center;gap:8px;margin-left:auto;color:' + OR + ';font:15px "EB Garamond",Georgia,serif}#dr-minut-p .cap-zoom input{width:140px;accent-color:' + OR + '}'
      + (notes ? '#pilotage .notes{margin-top:' + (H2 + 10) + 'px!important}' : '')
      + '.cap-pp{position:fixed!important;display:block!important;z-index:2147483000!important;cursor:grab}.cap-pp svg{position:absolute;inset:0}.cap-pp .cap-chif{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:' + OR + ';font-weight:700;font-family:"EB Garamond",Georgia,serif}';
    document.head.appendChild(st);
    let pp = null; if (coin) { const d = document.createElement('div'); d.innerHTML = html; pp = d.firstElementChild; pp.classList.add('cap-el', 'cap-pp'); const s = coin.fs * mur.width; pp.style.left = (mur.left + coin.fx * mur.width) + 'px'; pp.style.top = (mur.top + coin.fy * mur.height) + 'px'; pp.style.width = s + 'px'; pp.style.height = s + 'px'; pp.querySelector('.cap-chif').style.fontSize = Math.round(s / 4) + 'px'; document.body.appendChild(pp); }
    const maj = () => { const t = ((document.getElementById('dr-minut-aff') || {}).textContent || '').trim(); const m = /(\d+):(\d\d)/.exec(t); const sec = m ? +m[1] * 60 + +m[2] : 0; const f = Math.max(0, Math.min(1, sec / 300));
      document.querySelectorAll('.cap-pp .cap-chif').forEach(e => { if (e.textContent !== t) e.textContent = t; }); document.querySelectorAll('.cap-pp .cap-anneau').forEach(e => { const L = 2 * Math.PI * 64; e.setAttribute('stroke-dasharray', (f * L) + ' ' + L); }); };
    maj(); window.__capP = setInterval(maj, 200);
    const r = pn.getBoundingClientRect(), nb = notes ? notes.getBoundingClientRect() : null; return { panneau: [r.left, r.top, r.width, r.height].map(Math.round), surLaDiapo: r.top < mur.bottom - 1, notesDessous: nb ? nb.top >= r.bottom : null, barre: barre ? Math.round(barre.bottom) : null, pastillePilote: pp ? [pp.style.left, pp.style.top, pp.style.width] : null }; }, [OR, BRUN, coin, PAST('cap-pastille')]);
  dire('P4B · pilote : ' + JSON.stringify(mp));
  dire('P4B · pastille au pilote, juste avant la prise : ' + JSON.stringify(await a.pg.evaluate(() => { const e = document.querySelector('.cap-pp'); if (!e) return null; const r = e.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { r: [r.left, r.top, r.width, r.height].map(Math.round), dessus: h ? (h.id || h.className || h.tagName) : null }; })));
  await prise('P4B'); await tabMesure('P4B'); }
/* ═══ C16 669 (Paul, 04/11 18:45-18:46, sa vidéo) — P6 : un rectangle allongé (l'anneau qui se vide, le décompte à côté), redimensionnable par ses poignées ;
   les couleurs par crans depuis la valeur donnée (vert plus de la moitié, jaune jusqu'au quart, orange jusqu'au dixième, rouge le dernier dixième) ;
   au pilote, sous la diapo, au-dessus des notes : le réglage comme la vidéo (chaque chiffre avec + et −, ▶, ■), « au tableau » en interrupteur, le zoom ═══ */
if (P.includes('P6')) {
  const CW = 420, CH = 140;
  const coin = await T.pg.evaluate(([CW, CH]) => { const r = document.getElementById('mur2').getBoundingClientRect(); const L = []; const w = document.createTreeWalker(document.getElementById('mur2'), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement || n.parentElement.offsetParent === null) continue; const rg = document.createRange(); rg.selectNodeContents(n); Array.from(rg.getClientRects()).forEach(q => L.push(q)); }
    const M = 24; const C = { 'en bas à droite': [r.right - M - CW, r.bottom - M - CH], 'en haut à droite': [r.right - M - CW, r.top + M], 'en bas à gauche': [r.left + M, r.bottom - M - CH], 'en haut à gauche': [r.left + M, r.top + M] };
    for (const k of Object.keys(C)) { const [x, y] = C[k]; if (!L.some(q => Math.min(q.right, x + CW) - Math.max(q.left, x) > 0 && Math.min(q.bottom, y + CH) - Math.max(q.top, y) > 0)) return { k, x, y, fx: (x - r.left) / r.width, fy: (y - r.top) / r.height, fw: CW / r.width, fh: CH / r.height }; } return null; }, [CW, CH]);
  dire('P6 · le coin libre : ' + JSON.stringify(coin));
  const CARTE = (cls) => '<div class="' + cls + ' cap-min"><svg class="cap-svg" viewBox="0 0 160 160"><circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="14"/><circle class="cap-anneau" cx="80" cy="80" r="64" fill="none" stroke="#4f9d5d" stroke-width="14" stroke-linecap="round" transform="rotate(-90 80 80)"/></svg><span class="cap-chif"></span></div>';
  const CSSC = (sel, fs) => sel + '{position:absolute;display:flex;align-items:center;justify-content:center;gap:14px;padding:0 18px;box-sizing:border-box;background:' + BRUN + ';border:1px solid rgba(228,180,92,.55);border-radius:18px;z-index:20}'
    + sel + ' .cap-svg{width:var(--r,108px);height:var(--r,108px);flex:0 0 auto;position:static}' + sel + ' .cap-chif{position:static;font:700 ' + fs + 'px "EB Garamond",Georgia,serif;color:' + OR + ';letter-spacing:.03em;line-height:1;white-space:nowrap}';
  const coul = 'f => f > 0.5 ? "#4f9d5d" : f > 0.25 ? "#e0b83a" : f > 0.1 ? "#e07b2e" : "#e8484c"';
  if (coin) await tabPoser(CSSC('#ses-tab .cap-carte', 76) + '#ses-tab .cap-carte{left:' + coin.x + 'px;top:' + coin.y + 'px;width:' + CW + 'px;height:' + CH + 'px}', CARTE('cap-carte'));
  await T.pg.evaluate((coulSrc) => { const coul = eval(coulSrc); const maj = () => { const t = ((document.getElementById('dr-tab-minut') || {}).textContent || '').trim(); const m = /(\d+):(\d\d)/.exec(t); const s = m ? +m[1] * 60 + +m[2] : 0; const f = Math.max(0, Math.min(1, s / 300)); document.querySelectorAll('.cap-carte .cap-anneau').forEach(e => { const L = 2 * Math.PI * 64; e.setAttribute('stroke-dasharray', (f * L) + ' ' + L); e.setAttribute('stroke', coul(f)); }); }; maj(); setInterval(maj, 200); }, coul);
  const mp = await a.pg.evaluate(([OR, BRUN, coin, html, cssc, coulSrc]) => { const coul = eval(coulSrc); document.querySelectorAll('.cap-el,#cap-style-p').forEach(e => e.remove()); clearInterval(window.__capP);
    const mur = document.getElementById('mur').getBoundingClientRect(); const bc = document.getElementById('bchrono'); const barre = bc ? bc.parentElement.getBoundingClientRect() : null;
    const notes = document.querySelector('#pilotage .notes') || document.querySelector('.notes'); const pn0 = document.getElementById('dr-minut-p'); if (pn0) pn0.style.display = 'none';
    const H2 = 90; const top = Math.round((barre ? barre.bottom : mur.bottom) + 6);
    const r = document.createElement('div'); r.className = 'cap-el cap-regl'; r.id = 'cap-regl';
    const chiffre = (c, k) => '<span class="cap-dig"><button class="cap-pm" title="Ajouter une ' + k + '">+</button><b>' + c + '</b><button class="cap-pm" title="Retirer une ' + k + '">−</button></span>';
    r.innerHTML = '<svg class="cap-svg" viewBox="0 0 160 160"><circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="14"/><circle class="cap-anneau" cx="80" cy="80" r="64" fill="none" stroke="#4f9d5d" stroke-width="14" stroke-linecap="round" transform="rotate(-90 80 80)"/></svg>'
      + '<span class="cap-digs">' + chiffre('0', 'dizaine de minutes') + chiffre('5', 'minute') + '<b class="cap-dp">:</b>' + chiffre('0', 'dizaine de secondes') + chiffre('0', 'seconde') + '</span>'
      + '<button class="cap-go" title="Lancer le chrono (au tableau si « au tableau » est allumé) ; un second clic le met en pause">⏸</button><button class="cap-stop" title="Arrêter le chrono : il disparaît du tableau">■</button>'
      + '<label class="cap-tog" title="Le chrono paraît au tableau (allumé) ou seulement chez toi (éteint)"><span class="cap-sw"><i></i></span>au tableau</label>'
      + '<label class="cap-zoom" title="La taille du chrono, au tableau et sur ta diapo ensemble">zoom <input type="range" min="60" max="200" value="100"></label>';
    document.body.appendChild(r);
    const st = document.createElement('style'); st.id = 'cap-style-p';
    st.textContent = '#cap-regl{position:fixed;left:' + Math.round(mur.left) + 'px;top:' + top + 'px;width:' + Math.round(mur.width) + 'px;height:' + H2 + 'px;box-sizing:border-box;display:flex;align-items:center;gap:22px;padding:0 22px;background:#211a12;border:1px solid rgba(228,180,92,.45);border-radius:14px;z-index:2147482000;font-family:"EB Garamond",Georgia,serif}'
      + '#cap-regl .cap-svg{height:66px;width:66px}#cap-regl .cap-digs{display:flex;align-items:center;gap:4px}#cap-regl .cap-dig{display:flex;flex-direction:column;align-items:center;line-height:1}'
      + '#cap-regl .cap-dig b,#cap-regl .cap-dp{font:700 40px "EB Garamond",Georgia,serif;color:' + OR + ';width:26px;text-align:center}#cap-regl .cap-dp{width:14px}'
      + '#cap-regl .cap-pm{background:none;border:0;color:#cdbf9f;font:600 17px Georgia,serif;cursor:pointer;padding:0 5px;line-height:1}'
      + '#cap-regl .cap-go,#cap-regl .cap-stop{width:46px;height:46px;border-radius:50%;font-size:22px;cursor:pointer}#cap-regl .cap-go{background:' + OR + ';color:' + BRUN + ';border:0}#cap-regl .cap-stop{background:none;color:' + OR + ';border:2px solid ' + OR + '}'
      + '#cap-regl .cap-tog{display:flex;align-items:center;gap:12px;color:' + OR + ';font-size:22px;cursor:pointer}#cap-regl .cap-sw{position:relative;width:66px;height:36px;border-radius:18px;background:' + OR + ';display:inline-block}#cap-regl .cap-sw i{position:absolute;right:4px;top:4px;width:28px;height:28px;border-radius:50%;background:' + BRUN + '}'
      + '#cap-regl .cap-zoom{display:flex;align-items:center;gap:8px;margin-left:auto;color:' + OR + ';font-size:18px}#cap-regl .cap-zoom input{width:140px;accent-color:' + OR + '}'
      + (notes ? '#pilotage .notes{margin-top:' + (H2 + 12) + 'px!important}' : '')
      + cssc + '.cap-pp{position:fixed!important;z-index:2147483000!important;cursor:move;outline:2px solid #8ab4ff;outline-offset:3px}'
      + '.cap-pp .cap-poi{position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid #6b7cff;z-index:2}';
    document.head.appendChild(st);
    let pp = null; if (coin) { const d = document.createElement('div'); d.innerHTML = html; pp = d.firstElementChild; pp.classList.add('cap-el', 'cap-pp'); const w = coin.fw * mur.width, h = coin.fh * mur.height; Object.assign(pp.style, { left: (mur.left + coin.fx * mur.width) + 'px', top: (mur.top + coin.fy * mur.height) + 'px', width: w + 'px', height: h + 'px' }); pp.querySelector('.cap-chif').style.fontSize = Math.round(h * 0.52) + 'px'; pp.style.setProperty('--r', Math.round(h * 0.76) + 'px'); pp.style.gap = Math.round(h * 0.1) + 'px'; pp.style.padding = '0 ' + Math.round(h * 0.13) + 'px';
      [['-9px', '-9px', 'nwse-resize'], ['calc(100% - 5px)', '-9px', 'nesw-resize'], ['-9px', 'calc(100% - 5px)', 'nesw-resize'], ['calc(100% - 5px)', 'calc(100% - 5px)', 'nwse-resize']].forEach(([l, tp, cu]) => { const k = document.createElement('i'); k.className = 'cap-poi'; k.title = 'Tire pour agrandir ou réduire le chrono, au tableau aussi'; Object.assign(k.style, { left: l, top: tp, cursor: cu }); pp.appendChild(k); });
      pp.title = 'Glisse le chrono : il se déplace au tableau aussi'; document.body.appendChild(pp); }
    const maj = () => { const t = ((document.getElementById('dr-minut-aff') || {}).textContent || '').trim(); const m = /(\d+):(\d\d)/.exec(t); const sec = m ? +m[1] * 60 + +m[2] : 0; const f = Math.max(0, Math.min(1, sec / 300));
      document.querySelectorAll('.cap-pp .cap-chif').forEach(e => { if (e.textContent !== t) e.textContent = t; }); document.querySelectorAll('.cap-pp .cap-anneau,#cap-regl .cap-anneau').forEach(e => { const L = 2 * Math.PI * 64; e.setAttribute('stroke-dasharray', (f * L) + ' ' + L); e.setAttribute('stroke', coul(f)); }); };
    maj(); window.__capP = setInterval(maj, 200);
    const rr = r.getBoundingClientRect(), nb = notes ? notes.getBoundingClientRect() : null; return { reglage: [rr.left, rr.top, rr.width, rr.height].map(Math.round), surLaDiapo: rr.top < mur.bottom - 1, notesDessous: nb ? nb.top >= rr.bottom : null, cartePilote: pp ? [pp.style.left, pp.style.top, pp.style.width, pp.style.height] : null }; }, [OR, BRUN, coin, CARTE('cap-carte'), CSSC('.cap-pp', 40), coul]);
  dire('P6 · pilote : ' + JSON.stringify(mp));
  await prise('P6'); await tabMesure('P6'); }
/* ═══ la fin ═══ */
dire('requêtes refusées par le faux hub : ' + REFUSES.length);
await nav.close(); fs.writeFileSync(path.join(OUT, 'captures-minuteur.txt'), R.join('\n') + '\n'); process.exit(0);
