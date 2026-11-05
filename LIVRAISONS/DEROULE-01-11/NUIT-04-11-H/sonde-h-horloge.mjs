// L'AUDIT GLOBAL, PARTIE I (MANDATS/DEROULE-01-11/MANDAT-AUDIT-GLOBAL.md §2) — les sessions en direct : mesurer, compter, montrer. Rien n'est changé au site.
// Le harnais : celui de SESSION-PARTOUT/sonde-session.mjs (le faux hub rangé comme le vrai, qui refuse les clés interdites, et qui pousse son flux), avec la montre
// du navigateur (MJPC_HORLOGE=date de FRAPPE-TABLEAU : seule la date est décalée, les minuteries restent celles du navigateur), une montre décalée par appareil si
// demandé (`decal`), un réseau lent par appareil (RETARD), une page gelée (l'ordinateur en veille : `Page.setWebLifecycleState` « frozen » du protocole de Chrome).
// usage : node sonde-audit-I.mjs <index.html> [dossier-de-sortie]   (MJPC_PARTIES=Q1,Q1D,Q3,Q2,Q2D,Q4 ; MJPC_CAPT=<dossier des captures> ; MJPC_PYQR ; MJPC_MEDIAS)
//  Q1 les télescopages deux à deux (deux appareils, puis un même appareil) et trois ; Q1D un appareil qui disparaît (onglet fermé, veille) ;
//  Q2 le minuteur (répétition, mode test, vraie heure : 0 s, 1 min, 5 min, Pause, Reprendre ; le recouvrement ; l'allure) ; Q2D le minuteur, montres décalées ;
//  Q3 la participation (répétition, mode test, vraie heure ; des initiales hors de la liste) ; Q4 le lancement sur un réseau très lent (3 s par lecture).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-audit-I.mjs <index.html> [dossier]'); process.exit(2); }
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
dire('C16 · audit global, partie I · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · ' + path.basename(path.dirname(FICHIER)) + '/' + path.basename(FICHIER) + ' md5 ' + md5(FICHIER) + ' · parties ' + PARTIES.join(' '));

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
  const ctx = await nav.newContext(Object.assign({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }, tel ? { isMobile: true, hasTouch: true } : {}));
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
const minuteur = async (k) => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; const nom = k + (TEL_DECAL || TAB_DECAL ? '·montres-décalées' : ''); const out = { partie: 'Q2', nom, k, telDecal: TEL_DECAL, tabDecal: TAB_DECAL };
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false, decal: TAB_DECAL }); await p(600);
  const a = await ouvrir({ qui: 'ordinateur', test: estTest(k) }); await demarrer(a, k, 'meme'); await garde(a.pg);
  /* la fenêtre du tableau (sur l'ordinateur) */
  let F = null; if (await a.pg.isVisible('#bvideoproj').catch(() => false)) { const [fen] = await Promise.all([a.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), a.pg.click('#bvideoproj')]); if (fen) { await fen.setViewportSize({ width: 1280, height: 720 }); F = fen; } await p(1500); await a.pg.bringToFront(); }
  /* une diapo pleine de texte, tout dévoilé : la plus longue de l'heure */
  const di = await a.pg.evaluate(() => { try { const E = seance().ecrans; let best = null, bl = -1; ordreHeure(S.heure).forEach(i => { const l = JSON.stringify(E[i].blocs || []).length; if (l > bl && E[i].role !== 'fin') { bl = l; best = E[i].eid; } }); return best; } catch (e) { return null; } });
  if (di) await allerA(a.pg, di); for (let i = 0; i < 12; i++) { await gesteClic(a.pg); await p(250); const c = await a.pg.evaluate(() => (document.getElementById('compte') || {}).textContent || ''); if (/^(\d+) \/ \1 dévoilés|rien à dévoiler/.test(c)) break; } await p(1200);
  const tl = await telecommandeOuvrir(a); out.telecommande = !!tl; await p(1500);
  /* le panneau du minuteur au pilote (⏱) */
  await a.pg.evaluate(() => { const b = document.getElementById('bchrono'); if (b) b.click(); }); await p(700);
  const pan = await rectDe(a.pg, '#dr-minut-p'), mur = await rectDe(a.pg, '#mur'), barre = await rectDe(a.pg, '#bchrono');
  const txtMur = await rectsTexte(a.pg, '#mur'); out.panneau = { panneau: pan, diapo: mur, recouvreDiapo: pan && mur ? inter(pan, mur) : null, lignesCouvertes: pan ? txtMur.filter(r => inter(r, pan) > 0).length : null, lignes: txtMur.length, bouton: barre };
  await capt(a.pg, 'Q2-' + nom + '-1-pilote-panneau');
  /* le panneau refermé (⏱ de nouveau) ; ces deux clics au pilote lui ont donné la main : à la télécommande, « Reprendre avec la télécommande », puis « Départ » (qui coche « au tableau », l. 23630) */
  await a.pg.evaluate(() => { const b = document.getElementById('bchrono'); if (b) b.click(); }); await p(700);
  if (tl) { const avant = await tl.pg.evaluate(() => Array.from(document.querySelectorAll('#tc-bas button[data-a="m-go"]')).map(b => b.disabled)).catch(() => null); const ok = await tl.pg.locator('#tc-bas button[data-a="main"]').first().tap({ timeout: 2000 }).then(() => true).catch(() => false); await p(1800);
    out.mainTc = { goGriseAvant: avant, reprendre: ok, goGriseApres: await tl.pg.evaluate(() => Array.from(document.querySelectorAll('#tc-bas button[data-a="m-go"]')).map(b => b.disabled)).catch(() => null), pilote: await a.pg.evaluate(() => ((document.getElementById('dr-ses-main') || {}).textContent || '')).catch(() => null) }; }
  const lire = async () => { const [pi, tc, ta, fe, piR, tcR, taR] = await Promise.all([
    a.pg.evaluate(() => (document.getElementById('dr-minut-aff') || {}).textContent || '').catch(() => null), tl ? tl.pg.evaluate(() => ((document.querySelector('#tc-bas .minut .t') || {}).textContent || '')).catch(() => null) : null,
    T.pg.evaluate(() => { const m = document.getElementById('dr-tab-minut'); return m && m.style.display !== 'none' ? m.textContent : ''; }).catch(() => null), F ? F.evaluate(() => { const m = document.getElementById('dr-tab-minut'); return m && m.style.display !== 'none' ? m.textContent : ''; }).catch(() => null) : null,
    a.pg.evaluate(() => { const m = DR_CL.minut; return m ? dr_minutReste(m) : null; }).catch(() => null), tl ? tl.pg.evaluate(() => { const m = DR_CL.minut; return m ? dr_minutReste(m) : null; }).catch(() => null) : null,
    T.pg.evaluate(() => typeof dr_tabMinutReste === 'function' ? dr_tabMinutReste() : null).catch(() => null)]);
    return { pilote: pi, telecommande: tc, tableauDistant: ta, fenetre: fe, ms: { pilote: piR == null ? null : Math.round(piR), telecommande: tcR == null ? null : Math.round(tcR), tableauDistant: taR == null ? null : Math.round(taR) } }; };
  const tap = async x => { if (tl) { const ok = await tl.pg.locator('#tc-bas button[data-a="' + x + '"]').first().tap({ timeout: 1500 }).then(() => true).catch(() => false); (out.taps = out.taps || []).push(x + (ok ? '' : ' (PAS TAPÉ : ' + await tl.pg.evaluate(a => { const b = document.querySelector('#tc-bas button[data-a="' + a + '"]'); return b ? (b.disabled ? 'grisé — ' + b.title : 'là') : 'absent'; }, x).catch(() => '?') + ')')); } else await a.pg.evaluate(a => { const id = { 'm-go': 'dr-minut-go', 'm-pause': 'dr-minut-pause' }[a]; const b = document.getElementById(id); if (b) b.click(); }, x).catch(() => {}); };
  const M = []; const t0 = Date.now(); await tap('m-go'); await p(1500); M.push(Object.assign({ quand: '0 s (1,5 s après Départ)' }, await lire()));
  await capt(T.pg, 'Q2-' + nom + '-2-tableau-distant'); if (F) await capt(F, 'Q2-' + nom + '-2-fenetre-tableau'); await capt(a.pg, 'Q2-' + nom + '-2-pilote'); if (tl) await capt(tl.pg, 'Q2-' + nom + '-2-telecommande');
  /* le minuteur au tableau et le texte : les rectangles qui se recouvrent (le distant, la fenêtre) ; « Ce que voit la classe » */
  const recouvre = async (pg) => { const m = await rectDe(pg, '#dr-tab-minut'); const L = await rectsTexte(pg, '#mur2'); return { minuteur: m, lignes: L.length, lignesCouvertes: m ? L.filter(r => inter(r, m) > 0).map(r => r.t) : null, aire: m ? L.reduce((s, r) => s + inter(r, m), 0) : null }; };
  out.recouvrement = { distant: await recouvre(T.pg), fenetre: F ? await recouvre(F) : null };
  out.vueMini = await a.pg.evaluate(() => { const v = document.getElementById('vue-mini'); if (!v) return null; const t = (v.innerText || ''); const m = v.querySelector('#dr-tab-minut, .dr-tab-minut, .dr-minut, [class*=minut]'); return { aUnMinuteur: !!m, chiffres: /\d\d:\d\d/.test(t), titre: ((v.previousElementSibling || {}).textContent || '').trim().slice(0, 60) }; }).catch(() => null);
  const vmTitre = await a.pg.evaluate(() => { const x = Array.from(document.querySelectorAll('#droite *')).find(e => /Ce que voit la classe|Le tableau, en ce moment/i.test(e.textContent || '') && e.children.length === 0); return x ? x.textContent.trim() : null; }).catch(() => null); out.vueMiniTitre = vmTitre;
  out.allure = { tableau: await styleDe(T.pg, '#dr-tab-minut'), piloteChiffre: await styleDe(a.pg, '#dr-minut-aff'), piloteBouton: await styleDe(a.pg, '#dr-minut-go'), siteTitreTableau: await styleDe(T.pg, '#mur2 .titre, #mur2 h1, #mur2 h2, #mur2 .t') , siteCorps: await styleDe(T.pg, 'body') };
  if (CAPT) { const m = await rectDe(T.pg, '#dr-tab-minut'); if (m) await T.pg.screenshot({ path: path.join(CAPT, 'Q2-' + nom + '-3-tableau-minuteur-gros-plan.png'), clip: { x: Math.max(0, m.x - 60), y: Math.max(0, m.y - 30), width: Math.min(1280, m.w + 120), height: m.h + 60 } }).catch(() => {}); }
  if (process.env.MJPC_COURT) { await p(20000); M.push(Object.assign({ quand: '20 s' }, await lire())); }
  else { await p(Math.max(0, 60000 - (Date.now() - t0))); M.push(Object.assign({ quand: '1 min' }, await lire())); await p(Math.max(0, 300000 - (Date.now() - t0) - 2000)); M.push(Object.assign({ quand: '5 min moins 2 s' }, await lire())); }
  await tap('m-pause'); await p(1500); M.push(Object.assign({ quand: 'Pause + 1,5 s' }, await lire())); await p(8000); M.push(Object.assign({ quand: 'Pause + 9,5 s' }, await lire()));
  await tap('m-pause'); await p(1500); M.push(Object.assign({ quand: 'Reprendre + 1,5 s' }, await lire())); await p(10000); M.push(Object.assign({ quand: 'Reprendre + 11,5 s' }, await lire()));

  /* (mandat H) la fin : quatre « − » à la télécommande (il reste ~25 s), puis toutes les 250 ms le chiffre de chaque appareil jusqu'à 00:00 partout ; l'instant où chacun passe à 00:00 ; les « fin » au journal */
  for (let i = 0; i < 4; i++) { await tap('m-moins'); await p(400); } await p(1200); M.push(Object.assign({ quand: '4 × − + 2,8 s' }, await lire()));
  const FIN = { pilote: null, telecommande: null, tableauDistant: null, fenetre: null }; const tf = Date.now(); let ecartMax = 0, lu = 0;
  while (Date.now() - tf < 45000) { const v = await lire(); lu++; const S2 = ['pilote', 'telecommande', 'tableauDistant', 'fenetre'].map(k => [k, secDe(v[k])]).filter(x => x[1] != null);
    if (S2.length > 1) { const xs = S2.map(x => x[1]); ecartMax = Math.max(ecartMax, Math.max(...xs) - Math.min(...xs)); }
    S2.forEach(([k, s]) => { if (s === 0 && FIN[k] == null) FIN[k] = Date.now() - tf; }); if (Object.keys(FIN).every(k => FIN[k] != null || v[k] == null || v[k] === '')) { if (Object.values(FIN).some(x => x != null)) break; } await p(250); }
  out.fin = { instants: FIN, ecartMaxSec: ecartMax, lectures: lu, finsAuJournal: await a.pg.evaluate(() => J.filter(x => x.type === 'minuteur' && ((x.action || (x.d || {}).action) === 'fin')).length).catch(() => null) };
  dire('   (H) la fin : 00:00 vu à (ms) ' + JSON.stringify(FIN) + ' · plus grand écart des chiffres affichés pendant la course : ' + ecartMax + ' s (' + lu + ' lectures) · « fin » au journal du pilote : ' + out.fin.finsAuJournal);
  out.mesures = M; await capt(T.pg, 'Q2-' + nom + '-4-tableau-fin'); if (tl) await capt(tl.pg, 'Q2-' + nom + '-4-telecommande-fin');
  garderJ(out);
  dire('\n— Q2 · le minuteur, ' + NOMK[k] + (TEL_DECAL || TAB_DECAL ? ' (montre du téléphone ' + (TEL_DECAL / 1000) + ' s, du tableau distant ' + (TAB_DECAL / 1000) + ' s)' : '') + ' —');
  dire('   le panneau au pilote : ' + JSON.stringify(out.panneau)); dire('   la main à la télécommande : ' + JSON.stringify(out.mainTc) + ' · les appuis : ' + JSON.stringify(out.taps)); dire('   au tableau, le minuteur et le texte : ' + JSON.stringify(out.recouvrement)); dire('   « Ce que voit la classe » : ' + JSON.stringify(out.vueMini) + ' titre « ' + vmTitre + ' »'); dire('   l’allure : ' + JSON.stringify(out.allure));
  M.forEach(x => dire('   ' + x.quand + ' : pilote ' + x.pilote + ' · télécommande ' + x.telecommande + ' · tableau distant ' + x.tableauDistant + ' · fenêtre ' + x.fenetre + ' — reste (ms) ' + JSON.stringify(x.ms)));
  for (const d of [tl, a, T]) if (d) await d.ctx.close().catch(() => {}); };

/* ═══ Q4 · le lancement sur un réseau très lent (chaque lecture de l'ordinateur 3 s plus tard) ═══ */
const lent = async (variante) => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; RETARD = null; const out = { partie: 'Q4', variante, vues: [] };
  const a = await ouvrir({ qui: 'ordinateur' });
  if (!(await clicTexte(a.pg, 'button', 'edtOuvrir()'))) await a.pg.evaluate(() => edtOuvrir()); await p(1500);
  await a.pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0); if (x) x.click(); }); await p(900);
  RETARD = { qui: 'ordinateur', ms: 3000 }; const n0 = ECR.length; const t0 = Date.now();
  await clicTexte(a.pg, 'button', 'Ouvrir le pilotage et lancer');
  const vu = async () => a.pg.evaluate(() => { const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return r.width > 0 && r.height > 0 && c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0.05; };
    const ov = Array.from(document.querySelectorAll('body > *')).filter(vis).map(e => (e.id || e.className || e.tagName).toString().slice(0, 40)).slice(0, 12);
    const lanc = Array.from(document.querySelectorAll('button')).filter(b => vis(b) && /Ouvrir le pilotage et lancer/.test(b.innerText || '')); const mod = document.getElementById('at-modale');
    const att = Array.from(document.querySelectorAll('[class*=charge],[class*=attente],[class*=spin],[id*=charge],[aria-busy=true]')).filter(vis).map(e => (e.innerText || e.className || '').toString().replace(/\s+/g, ' ').slice(0, 60));
    return { edt: vis(document.getElementById('edt-ecran')), pilotage: vis(document.getElementById('pilotage')), lancee: typeof S === 'object' && !!S.lancee, boutonLancer: lanc.length, boutonGrise: lanc.some(b => b.disabled), curseur: getComputedStyle(document.body).cursor, attente: att.slice(0, 3), modale: mod ? (mod.innerText || '').replace(/\s+/g, ' ').slice(0, 120) : null, titre: ((document.getElementById('numero') || {}).textContent || '').replace(/\s+/g, ' ').slice(0, 60), dessus: ov }; }).catch(e => ({ err: String(e).slice(0, 80) }));
  let second = null;
  for (const t of [500, 1000, 2000, 3000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 20000, 25000, 30000, 36000]) { await p(Math.max(0, t - (Date.now() - t0))); const v = await vu(); v.t = t; out.vues.push(v); if ([1000, 4000, 8000, 12000, 16000, 36000].includes(t)) await capt(a.pg, 'Q4-' + variante + '-' + String(t / 1000).padStart(2, '0') + 's');
    /* les autres gestes possibles pendant l'attente : rouvrir l'emploi du temps et relancer (3 s) ; « ▶ Dévoiler » sur le pilote « aucune heure lancée » (16 s) ; « ✕ Fermer l'atelier » sur l'écran noir (8 s) */
    if (variante === 'rouvrir' && t === 3000 && !second) { second = { t: Date.now() - t0 }; second.edt = await clicTexte(a.pg, 'button,[onclick]', 'edtOuvrir()'); if (!second.edt) second.edtPanneau = await a.pg.evaluate(() => { const x = Array.from(document.querySelectorAll('[data-section="edt"]')).find(e => e.offsetParent !== null); if (!x) return false; x.click(); return true; }).catch(() => false); await capt(a.pg, 'Q4-rouvrir-edt'); for (let k = 0; k < 60; k++) { second.case = await a.pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0); if (!x) return false; x.click(); return true; }); if (second.case) break; await p(250); } second.tCase = Date.now() - t0; await p(600); second.relance = await clicTexte(a.pg, 'button', 'Ouvrir le pilotage et lancer'); second.tRelance = Date.now() - t0; await capt(a.pg, 'Q4-rouvrir-relance'); }
    if (variante === 'devoiler' && t === 16000 && !second) { second = { t: Date.now() - t0, clics: [] }; for (let k = 0; k < 3; k++) { second.clics.push(await gesteClic(a.pg)); await p(500); } second.compte = await a.pg.evaluate(() => (document.getElementById('compte') || {}).textContent || '').catch(() => null); second.lancee = await a.pg.evaluate(() => !!S.lancee).catch(() => null); await capt(a.pg, 'Q4-devoiler-apres-3-clics'); }
    if (variante === 'fermer' && t === 8000 && !second) { second = { t: Date.now() - t0 }; second.clique = await clicTexte(a.pg, 'button', 'Fermer l’atelier'); await p(500); await capt(a.pg, 'Q4-fermer-apres'); }
    if (variante === 'second-clic' && t === 3000 && !second) { const ok = await clicTexte(a.pg, 'button', 'Ouvrir le pilotage et lancer'); second = { t: Date.now() - t0, clique: ok }; if (!ok) { /* le bouton n'est plus là : le second clic va sur la case de l'emploi du temps, si elle est encore à l'écran */ const c2 = await a.pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0); if (!x) return false; x.click(); return true; }); second.case = c2; await p(600); if (c2) second.puisLancer = await clicTexte(a.pg, 'button', 'Ouvrir le pilotage et lancer'); } } }
  RETARD = null; await p(3000);
  const E = ECR.slice(n0); const cnt = re => E.filter(x => !x.refus && x.m !== 'GET' && re.test(x.c)).length;
  out.second = second; out.ecritures = { cours_actif: E.filter(x => /^\/site\/cours_actif$/.test(x.c)).map(x => x.bd ? 'pose' : 'retire'), heures: [...new Set(E.filter(x => /\/deroule_joue\/[^/]+\/heures\/[^/]+/.test(x.c)).map(x => x.c.replace(/^.*\/heures\/([^/]+).*$/, '$1')))], lancement: await a.pg.evaluate(() => J.filter(x => x.type === 'lancement').length).catch(() => null), journalEcrit: cnt(/\/journal/), etatEcrit: cnt(/\/etat$/), total: E.filter(x => x.m !== 'GET').length };
  out.fin = await a.pg.evaluate(() => ({ lancee: !!S.lancee, compte: (document.getElementById('compte') || {}).textContent || '', cle: (() => { try { return seance().ecrans[S.di].eid + '#' + etatDiapo().nDev; } catch (e) { return null; } })(), entete: ((document.querySelector('#pilotage .haut') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 120), atelierOuvert: !!document.querySelector('#atelier-ecran.at-actif') })).catch(e => String(e));
  out.erreurs = a.errs.concat(a.boites).slice(0, 5);
  garderJ(out); dire('\n— Q4 · réseau très lent, ' + variante + ' —'); out.vues.forEach(v => dire('   ' + (v.t / 1000) + ' s : ' + JSON.stringify(v)));
  dire('   le geste pendant l’attente : ' + JSON.stringify(second) + ' · à la fin : ' + JSON.stringify(out.fin) + ' · au hub : ' + JSON.stringify(out.ecritures) + ' · erreurs : ' + JSON.stringify(out.erreurs));
  await a.ctx.close().catch(() => {}); };


/* ═══ Q2R · le minuteur au tableau, diapo par diapo (toutes les diapos de l'heure 1, tout dévoilé), à deux crans du texte ; « ⧉ Ce que voit la classe » cliqué ═══ */
const recouvrementTout = async () => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; const out = { partie: 'Q2R', diapos: [] };
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(600);
  const a = await ouvrir({ qui: 'ordinateur' }); await demarrer(a, 'R', 'meme'); await garde(a.pg);
  let F = null; if (await a.pg.isVisible('#bvideoproj').catch(() => false)) { const [fen] = await Promise.all([a.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), a.pg.click('#bvideoproj')]); if (fen) { await fen.setViewportSize({ width: 1280, height: 720 }); F = fen; } await p(1500); await a.pg.bringToFront(); }
  /* le minuteur au tableau : ⏱, « au tableau » coché (il paraît immobile, 05:00), puis Départ */
  await a.pg.evaluate(() => { const b = document.getElementById('bchrono'); if (b) b.click(); }); await p(500); await a.pg.click('#dr-minut-tab').catch(() => {}); await p(300); await a.pg.click('#dr-minut-go').catch(() => {}); await p(500); await a.pg.evaluate(() => { const b = document.getElementById('bchrono'); if (b) b.click(); }); await p(500);
  /* « ⧉ Ce que voit la classe » */
  await a.pg.click('#btableau').catch(() => {}); await p(1200);
  out.vueMini = await a.pg.evaluate(() => { const v = document.getElementById('vue-mini'); const t = (v && v.innerText) || ''; return { titre: ((document.getElementById('vue-titre') || {}).textContent || '').trim(), minuteurDedans: !!(v && v.querySelector('#dr-tab-minut, .dr-tab-minut')), chiffresMMSS: /\b\d\d:\d\d\b/.test(t), minuteurPilote: ((document.getElementById('dr-minut-aff') || {}).textContent || '') }; }).catch(e => String(e));
  await capt(a.pg, 'Q2R-ce-que-voit-la-classe'); await capt(T.pg, 'Q2R-tableau-meme-moment');
  const L = await a.pg.evaluate(() => { try { return ordreHeure(1).map(i => seance().ecrans[i].eid); } catch (e) { return []; } });
  for (const cran of [1, 4]) { await a.pg.evaluate(c => { const r = document.getElementById('taille'); if (r) { r.value = c; r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); } }, cran).catch(() => {}); await p(800);
    for (const eid of L) { if (!(await allerA(a.pg, eid))) continue; for (let i = 0; i < 14; i++) { const c = await a.pg.evaluate(() => (document.getElementById('compte') || {}).textContent || ''); if (/^(\d+) \/ \1 dévoilés|rien à dévoiler|vidéo|préparation/.test(c)) break; if (!(await gesteClic(a.pg))) break; await p(250); } await p(1300);
      const mT = await rectDe(T.pg, '#dr-tab-minut'); const LT = await rectsTexte(T.pg, '#mur2'); const mF = F ? await rectDe(F, '#dr-tab-minut') : null; const LF = F ? await rectsTexte(F, '#mur2') : [];
      const cT = mT ? LT.filter(r => inter(r, mT) > 0) : []; const cF = mF ? LF.filter(r => inter(r, mF) > 0) : [];
      const d = { cran, eid, distant: { lignes: LT.length, couvertes: cT.length, aire: mT ? cT.reduce((s2, r) => s2 + inter(r, mT), 0) : null, mots: cT.map(r => r.t).slice(0, 4) }, fenetre: { lignes: LF.length, couvertes: cF.length, aire: mF ? cF.reduce((s2, r) => s2 + inter(r, mF), 0) : null } };
      out.diapos.push(d); if (cT.length || cF.length) { await capt(T.pg, 'Q2R-recouvre-cran' + cran + '-' + eid); } } }
  garderJ(out); const n = out.diapos.length; const nT = out.diapos.filter(d => d.distant.couvertes).length; const nF = out.diapos.filter(d => d.fenetre.couvertes).length;
  dire('\n— Q2R · le minuteur au tableau, diapo par diapo (heure 1, tout dévoilé, crans 1 et 4) — « Ce que voit la classe » : ' + JSON.stringify(out.vueMini));
  dire('   ' + n + ' diapos·crans mesurés ; le minuteur couvre du texte au tableau distant : ' + nT + ' ; dans la fenêtre du tableau : ' + nF);
  out.diapos.filter(d => d.distant.couvertes || d.fenetre.couvertes).forEach(d => dire('   cran ' + d.cran + ' · ' + d.eid + ' : distant ' + d.distant.couvertes + ' ligne(s), ' + d.distant.aire + ' px² ' + JSON.stringify(d.distant.mots) + ' · fenêtre ' + d.fenetre.couvertes + ' ligne(s), ' + d.fenetre.aire + ' px²'));
  for (const x of [a, T]) await x.ctx.close().catch(() => {}); };
/* ═══ le déroulé ═══ */
const DEFAUT = 'H+H;H+T;H+R;H+RT;T+H;T+T;T+R;T+RT;R+H;R+T;R+R;R+RT;RT+H;RT+T;RT+R;RT+RT;H+H/autre;T+T/autre;R+R/autre;RT+RT/autre;H+R/meme;R+H/meme;H+T/meme;T+H/meme;R+T/meme;T+R/meme;H+R+T;T+RT+R;R+T+H;H+R/tc;T+RT/tc;R+T/tc';
const LISTE = String(process.env.MJPC_COMBOS || DEFAUT).split(';').filter(Boolean);
if (joue('Q1')) { const C1 = LISTE.length ? LISTE.map(s => { const [ab, opt] = s.split('/'); const [A, B, C] = ab.split('+'); return { A, B, C: C || null, varB: /autre/.test(opt || '') ? 'autre' : 'meme', meme: /meme/.test(opt || ''), tc: /tc/.test(opt || '') }; }) : [];
  for (const c of C1) { try { await combo(c); } catch (e) { dire('   (la combinaison ' + JSON.stringify(c) + ' a échoué : ' + String(e.message).slice(0, 160) + ')'); } } }
if (joue('Q1D')) for (const s of String(process.env.MJPC_DISP || 'H·ferme,T·ferme,R·ferme,RT·ferme,H·veille').split(',')) { const [k, c] = s.split('·'); try { await disparition(k, c); } catch (e) { dire('   (Q1D ' + s + ' a échoué : ' + String(e.message).slice(0, 160) + ')'); } }
if (joue('Q3')) for (const k of String(process.env.MJPC_Q3 || 'R,T,H').split(',')) { try { await participation(k); } catch (e) { dire('   (Q3 ' + k + ' a échoué : ' + String(e.message).slice(0, 160) + ')'); } }
if (joue('Q2')) for (const k of String(process.env.MJPC_Q2 || 'R,T,H').split(',')) { try { await minuteur(k); } catch (e) { dire('   (Q2 ' + k + ' a échoué : ' + String(e.message).slice(0, 160) + ')'); } }
if (joue('Q2R')) { try { await recouvrementTout(); } catch (e) { dire('   (Q2R a échoué : ' + String(e.message).slice(0, 160) + ')'); } }
if (joue('Q2D')) { TEL_DECAL = +(process.env.MJPC_TEL_DECAL || 3000); TAB_DECAL = +(process.env.MJPC_TAB_DECAL || -2000); for (const k of String(process.env.MJPC_Q2D || 'R').split(',')) { try { await minuteur(k); } catch (e) { dire('   (Q2D ' + k + ' a échoué : ' + String(e.message).slice(0, 160) + ')'); } } TEL_DECAL = 0; TAB_DECAL = 0; }
if (joue('Q4')) for (const v of String(process.env.MJPC_Q4 || 'un-clic,second-clic').split(',')) { try { await lent(v); } catch (e) { dire('   (Q4 ' + v + ' a échoué : ' + String(e.message).slice(0, 160) + ')'); } }
await nav.close();
fs.writeFileSync(path.join(OUT, 'sonde-audit-I-' + (process.env.MJPC_NOM || 'v') + '.txt'), R.join('\n') + '\n');
process.exit(0);
