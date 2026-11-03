// LA SONDE DU QR DE LA TÉLÉCOMMANDE (ajout de la conscience au MANDAT-FRAPPE-RETARD-ZOOM, Paul 03/11 07:37 : « Le QR code ne semble pas bien tenir ... 5 fois sur 6 j'ai ça »,
// capture : « Ce QR code n'est plus valable ») — par le geste, sous le faux hub RANGÉ COMME LE VRAI, qui REFUSE (HTTP 400) les clés interdites et qui POUSSE son flux :
// le harnais de APPEL/sonde-appel.mjs (lignes 18-231), plus une panne du réseau (une lecture qui échoue, comme `fetch` hors réseau).
// Aucune écriture ni lecture du vrai hub. Aucun nom d'élève dans ce qui sort.
// usage : node sonde-qr.mjs <assemble/index.html> [dossier-de-sortie]
//   MJPC_PARTIES=H,T (vraie heure, mode test) ; MJPC_CAS=normal,lent,lent-ferme,rouvert,second,onglet,montre5,montre15,montre20,rate,coupe ; MJPC_N=20 (scans par cas)
//   Un scan : le pilote montre le QR (📱), un téléphone (390 × 844, tactile, un onglet neuf) ouvre l'adresse du QR ; compté « pilote » quand la télécommande est sur la
//   séance (« Diapo n sur N »), « plus valable », « réseau » (le téléphone dit que le réseau ne répond pas) ou ce qu'il dit d'autre, au bout de 20 s.
//   lent : le téléphone en 4G — la page (3 Mo) arrive 6 s après le scan, chaque lecture du téléphone 300 ms plus tard (MJPC_LENT_MS) ; lent-ferme : la même chose, et la fenêtre
//   du QR fermée par ✕ 2 s après le scan (pendant que la page arrive) ; rouvert : la fenêtre fermée par ✕ puis rouverte (un QR neuf), le neuf scanné ;
//   second : le même QR scanné de nouveau, après le premier scan (la fenêtre s'est fermée) ; onglet : le même onglet du téléphone sert à chaque scan ;
//   montreN : la montre de l'ordinateur en retard de N minutes sur celle du téléphone ; rate : la première lecture du téléphone échoue (réseau) ;
//   coupe : le réseau du téléphone ne répond plus pendant 8 s après le scan, puis revient.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-qr.mjs <index.html> [dossier]'); process.exit(2); }
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
dire('C16 · sonde du QR de la télécommande · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400), avec son flux (EventSource) · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

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


/* ═══ LE QR ═══ */
let PANNE = null;   /* { qui, re, n, jusqua } : les lectures (GET) de cet appareil à ce chemin échouent comme hors réseau — n fois, ou jusqu'à une heure (Node) */
const hubRepondre0 = hubRepondre;
const hubRepondreP = async (qui, m, c, corps) => { if (PANNE && PANNE.qui === qui && PANNE.re.test(c) && (PANNE.jusqua ? Date.now() < PANNE.jusqua : PANNE.n > 0)) { if (!PANNE.jusqua) PANNE.n--; PANNE.vu = (PANNE.vu || 0) + 1; return '§ERR§'; } return hubRepondre0(qui, m, c, corps); };
const fauxFetchP = () => { const f0 = window.fetch; window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => { if (t === '§ERR§') throw new TypeError('Failed to fetch'); return /^§400§/.test(t) ? new Response(t.slice(5), { status: 400 }) : new Response(t, { status: 200 }); }); } return f0.apply(this, arguments); }; };
/* le téléphone : un contexte par cas (sa montre), un onglet neuf par scan (ou le même onglet, cas « onglet ») */
const telephone = async decal => { const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, timezoneId: 'Europe/Paris' });
  await ctx.exposeBinding('__hubEcoute', (src, id, ch) => { ABOS.push({ pg: src.page, id, ch: ch.replace(/\/+$/, '') }); return JSON.stringify(lireH(ch)); }); await ctx.addInitScript(fauxFlux); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); const f = imageDe(u); if (f) return r.fulfill({ path: f, contentType: typeDe(f) }); return r.abort(); });
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondreP('telephone', m, c, corps)); await ctx.addInitScript(fauxFetch); await ctx.addInitScript(fauxFetchP);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  const t09 = new Date(JOUR + 'T09:00:00+02:00').getTime(); await ctx.clock.install({ time: new Date(t09 + (Date.now() - T0REEL) + (decal || 0)) });
  return { ctx, errs, boites }; };
const issue = pg => pg.evaluate(() => { const h = document.getElementById('tc-haut'); if (h && h.style.display !== 'none' && /Diapo|Hors/.test(h.innerText)) return 'pilote';
  const a = document.getElementById('tc-accueil'); const t = a && a.style.display !== 'none' ? (a.innerText || '').replace(/\s+/g, ' ').trim() : '';
  if (/plus valable/.test(t)) return 'plus valable'; if (/réseau/i.test(t)) return 'réseau : ' + t.slice(0, 120); return t ? 'autre : ' + t.slice(0, 120) : 'attente'; }).catch(() => 'page fermée');
const qrMontrer = async o => { await o.pg.evaluate(() => { const x = document.getElementById('dr-tc-qr'); if (x) dr_tcQrFermer(true); }).catch(() => {}); await o.pg.waitForSelector('#dr-tc-btn', { state: 'visible', timeout: 5000 }).catch(() => {}); await o.pg.click('#dr-tc-btn').catch(() => {}); await p(300);
  return o.pg.evaluate(() => { const i = document.getElementById('dr-tc-qr-img'); return i ? new URL(i.src).searchParams.get('data') : null; }).catch(() => null); };
const qrFerme = o => o.pg.click('#dr-tc-qr-x').then(() => true).catch(() => false);
const scanner = async (tel, url, { nav0 = 0, onglet = null, pendant = null, max = 20000 } = {}) => { const q = '?' + url.split('?')[1]; const pg = onglet || await tel.ctx.newPage(); const t0 = Date.now();
  const go = (async () => { if (nav0) await p(nav0); await pg.goto('file://' + FICHIER_TEL + q, { waitUntil: 'load' }).catch(() => {}); })(); if (pendant) await pendant(); await go;
  let r = 'attente', reseau = null; while (Date.now() - t0 < max) { r = await issue(pg); if (/^réseau/.test(r) && !reseau) { reseau = r; if (CAPT_RESEAU) await capt(pg, CAPT_RESEAU); } if (r === 'pilote' || r === 'plus valable') break; await p(250); }
  const ms = Date.now() - t0; return { r, ms, pg, reseau }; };
let CAPT_RESEAU = null;   /* le premier « réseau » dit au téléphone, capturé */
const pqr = async (fichier, mode, cas, N) => { const test = mode === 'T'; reset(); PANNE = null; const k = mode + '·' + cas;
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); await gesteClic(o.pg); await p(400);
  if (!lance) { verif(k, false, 'l’heure lancée'); await o.ctx.close(); return; }
  const decal = /^montre(\d+)$/.test(cas) ? +cas.slice(6) * 60000 : 0; const tel = await telephone(decal); const comptes = {}; let dits = 0; let onglet = null; let urlSecond = null; const temps = [];
  for (let i = 0; i < N; i++) {
    let url = null, opt = {};
    if (cas === 'second') { if (!urlSecond) { urlSecond = await qrMontrer(o); const r0 = await scanner(tel, urlSecond); await r0.pg.close().catch(() => {}); if (r0.r !== 'pilote') dire('      (le premier scan du QR : ' + r0.r + ')'); await p(600); } url = urlSecond; }
    else if (cas === 'rouvert') { await qrMontrer(o); await qrFerme(o); await p(400); url = await qrMontrer(o); }
    else url = await qrMontrer(o);
    if (!url) { comptes['pas de QR'] = (comptes['pas de QR'] || 0) + 1; continue; }
    if (cas === 'lent' || cas === 'lent-ferme') { RETARD = { qui: 'telephone', re: /./, ms: +(process.env.MJPC_LENT_MS || 300) }; opt.nav0 = 6000; }
    if (cas === 'lent-ferme') opt.pendant = async () => { await p(2000); await qrFerme(o); };
    if (cas === 'rate') PANNE = { qui: 'telephone', re: /\/telecommande\//, n: 1 };
    if (cas === 'coupe') opt.pendant = async () => { PANNE = { qui: 'telephone', re: /./, jusqua: Date.now() + 8000 }; };
    if (cas === 'onglet') { onglet = onglet || await tel.ctx.newPage(); opt.onglet = onglet; }
    CAPT_RESEAU = (cas === 'coupe' || cas === 'rate') && !dits ? 'qr-' + NOMV + '-' + mode + '-' + cas + '-le-telephone-dit-le-reseau' : null;
    const s = await scanner(tel, url, opt); RETARD = null; const vu = PANNE && PANNE.vu; PANNE = null;
    comptes[s.r] = (comptes[s.r] || 0) + 1; temps.push(s.ms); if (s.reseau) { dits++; if (dits === 1) dire('      (le téléphone, pendant la panne : « ' + s.reseau.replace(/^réseau : /, '') + ' »)'); }
    if (i === 0 || s.r !== 'pilote') { await capt(s.pg, 'qr-' + NOMV + '-' + mode + '-' + cas + '-' + (i + 1) + '-telephone'); if (s.r !== 'pilote') await capt(o.pg, 'qr-' + NOMV + '-' + mode + '-' + cas + '-' + (i + 1) + '-ordinateur'); }
    if (cas === 'coupe' && i === 0) dire('      (la coupure : ' + (vu || 0) + ' lecture(s) du téléphone échouée(s))');
    if (!opt.onglet) await s.pg.close().catch(() => {}); else await s.pg.goto('about:blank').catch(() => {});
    await o.pg.evaluate(() => { const x = document.getElementById('dr-tc-qr'); if (x) dr_tcQrFermer(true); }).catch(() => {});
    await p(300);
  }
  temps.sort((a, b) => a - b);
  if (cas === 'rate') dire('      (« le réseau ne répond pas » vu au téléphone pendant le nouvel essai : ' + dits + ' / ' + N + ' — il ne dure que 0,7 s)');
  if (cas === 'coupe') verif(k, dits === N, 'pendant la panne, le téléphone dit en clair que le réseau ne répond pas (' + dits + ' / ' + N + '), jamais « plus valable »', dits);
  dire('      ' + k + ' : ' + Object.keys(comptes).map(x => x + ' ' + comptes[x]).join(' · ') + ' sur ' + N + ' — du scan à la télécommande sur la séance : médiane ' + temps[Math.floor(temps.length / 2)] + ' ms, le plus long ' + temps[temps.length - 1] + ' ms');
  verif(k, (comptes.pilote || 0) === N, 'chaque scan ouvre la télécommande sur la séance (' + (comptes.pilote || 0) + ' / ' + N + ')', comptes);
  sansErreur(k, [].concat(o.errs, o.boites, tel.errs, tel.boites), 'l’ordinateur et le téléphone'); verifEcritures(k, test);
  await tel.ctx.close().catch(() => {}); await o.ctx.close().catch(() => {}); };
const NOMV = process.env.MJPC_NOM || 'v';
const FICHIER_TEL = process.env.MJPC_TEL && fs.existsSync(process.env.MJPC_TEL) ? path.resolve(process.env.MJPC_TEL) : FICHIER;
const CAS = String(process.env.MJPC_CAS || 'normal,lent,lent-ferme,rouvert,second,onglet,montre5,montre15,montre20,rate,coupe').split(',').map(x => x.trim());
const NQ = +(process.env.MJPC_N || 20);
for (const m of String(process.env.MJPC_PARTIES || 'H,T').split(',')) { dire('\n— ' + m + ' · le QR de la télécommande (' + (m === 'T' ? 'mode test' : 'vraie heure') + '), ' + NQ + ' scans par cas —'); for (const c of CAS) await pqr(FICHIER, m, c, NQ); }
dire('\n' + nb + ' vérifications, ' + echecs + ' échec(s)');
fs.writeFileSync(path.join(OUT, 'sonde-qr-' + NOMV + '.txt'), R.join('\n') + '\n');
await nav.close();
process.exit(echecs ? 1 : 0);
