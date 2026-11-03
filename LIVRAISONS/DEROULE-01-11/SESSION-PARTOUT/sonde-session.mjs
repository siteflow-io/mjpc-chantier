// LA SONDE DE LA SESSION PARTOUT (MANDATS/DEROULE-01-11/MANDAT-SESSION-PARTOUT.md §5) — par le geste, sous le faux hub RANGÉ COMME LE VRAI, qui REFUSE
// (HTTP 400) les clés interdites, et qui POUSSE son flux (le flux REST de Firebase, `EventSource`, « put » à chaque écriture qui touche le chemin écouté).
// Le harnais : la partie haute de CORRECTIFS/sonde-correctifs.mjs (le faux hub, `ouvrir`, `lancerClasse`, `garde`, `texteDe`, `capt`), plus le flux et un
// téléphone (390 × 844, tactile). Aucune écriture ni lecture du vrai hub.
// usage : node sonde-session.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_PARTIES=T,H,QH,QT,R,RT ; MJPC_CAPT=<dossier> ; MJPC_PYQR=<la bibliothèque Python « qrcode »>)
//  T l'essai en mode test, H la vraie heure (le parcours de Paul, plus : un second ordinateur qui écrit une réponse pendant que l'ordinateur dévoile et que le
//  téléphone note une participation ; F5 au téléphone et à l'ordinateur, qui relance la même séance) ; QH, QT la télécommande par le QR (vraie heure, essai) ;
//  R, RT la répétition (hors mode test, en mode test).
//  Le parcours de Paul (㊴, 14:44-14:59) : le tableau distant (1280 × 720) ; l'ordinateur (1536 × 864) lance l'heure par la case de l'emploi du temps
//  (3E Charles de Gaulle, 14/09) et dévoile ; un second ordinateur (1366 × 768) et le téléphone ouvrent le site : le bandeau (≤ 2 s) ; le téléphone
//  « Reprendre » (sur la base : s'il n'y a pas de bandeau, il relance la même séance, comme Paul) — à l'endroit exact ; cinq gestes au téléphone, cinq à
//  l'ordinateur, en alternance : chacun paraît sur l'autre pilote et au tableau distant (≤ 0,5 s, compté) ; deux gestes presque en même temps : les deux
//  pilotes et le tableau d'accord ; l'onglet de l'ordinateur fermé ; deux gestes au téléphone ; « Clore l'heure » au téléphone : le tableau distant
//  revient à l'horloge (en mode test) ; au hub, plus de pointeur ni de scène d'essai (comptés) ; en mode test, aucune écriture hors de /site/tableau_test.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-correctifs.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + (typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 1400) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'T,H,QH,QT,R,RT,A').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
dire('C16 · sonde de la session partout (㉞) · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400), avec son flux (EventSource) · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

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
/* C16 (㊱, 00:45) : les valeurs du serveur, comme le vrai hub les résout (REST : `{".sv": "timestamp"}` devient l'heure du serveur à l'écriture ; sans cela ce faux hub refusait la clé « .sv », que le vrai accepte) — reprise de APPEL/sonde-appel.mjs */
const resoudreSv = v => { if (v && typeof v === 'object' && !Array.isArray(v)) { const K = Object.keys(v); if (K.length === 1 && K[0] === '.sv' && v['.sv'] === 'timestamp') return Date.now(); const o = {}; K.forEach(k => { o[k] = resoudreSv(v[k]); }); return o; } if (Array.isArray(v)) return v.map(resoudreSv); return v; };
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') return JSON.stringify(lireH(c)); let bd = null; try { bd = resoudreSv(JSON.parse(corps || 'null')); } catch (e) {}
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
/* C16 (la frappe au tableau) : MJPC_HORLOGE=date — seule la date des appareils est décalée (le 14/09, 09:00 au lancement de la sonde, elle avance, la même pour tous) ;
   les minuteries, les images (`requestAnimationFrame`) et `performance` restent ceux du navigateur. L'horloge simulée de Playwright (`page.clock`) remplace aussi
   setTimeout, setInterval, requestAnimationFrame et performance, et exécute toutes les minuteries échues d'une page à la suite dans une seule tâche (playwright-core,
   clockSource : `_runTo`) : mesuré, elle donne deux régimes au même code (FRAPPE-TABLEAU/NOTE.md). Sans la variable : inchangé. */
const fauxDate = off => { const RD = Date; function FD(...a) { if (!(this instanceof FD)) return new RD(RD.now() + off).toString(); return a.length ? new RD(...a) : new RD(RD.now() + off); }
  FD.prototype = RD.prototype; FD.now = () => RD.now() + off; FD.parse = RD.parse; FD.UTC = RD.UTC; try { Object.defineProperty(FD, 'name', { value: 'Date' }); } catch (e) {} window.Date = FD; };
const T0DATE = Date.now();
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
  if (process.env.MJPC_HORLOGE === 'date') await ctx.addInitScript(fauxDate, t09 - T0REEL);
  const pg = await ctx.newPage(); if (process.env.MJPC_HORLOGE === 'figee') await pg.clock.setFixedTime(new Date(t09)); else if (process.env.MJPC_HORLOGE !== 'date') await pg.clock.install({ time: new Date(t09 + (Date.now() - T0REEL)) });   /* les montres de tous les appareils avancent ensemble, à l'heure, comme des appareils réglés sur l'heure du réseau */
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

const parcours = async (fichier, mode, nomV) => { const test = mode === 'T'; HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; const pre = 'session-' + nomV + '-' + mode + '-';
  dire('\n— ' + (test ? 'l’essai en mode test' : 'la vraie heure') + ' · ' + nomV + ' —');
  const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(800);
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg);
  verif(mode, lance, 'l’ordinateur lance l’heure par la case de l’emploi du temps');
  for (let k = 0; k < 2; k++) { await gesteClic(o.pg); await p(400); }
  await p(1200); await capt(o.pg, pre + '01-ordinateur-lance'); await capt(T.pg, pre + '01-tableau');
  /* le second ordinateur */
  const o2 = await ouvrir({ fichier, test: false, qui: 'ordinateur2', W: 1366, H: 768 }); const b2 = await attendreBandeau(o2.pg);
  dire('      ' + mode + ' · second ordinateur : bandeau ' + (b2.b ? 'en ' + b2.t + ' ms : « ' + b2.b + ' »' : 'ABSENT (6 s)'));
  verif(mode, b2.b && b2.t <= 2000, 'le second ordinateur (pas en mode test) voit le bandeau en moins de 2 s', b2);
  await capt(o2.pg, pre + '02-second-ordinateur-bandeau'); await o2.ctx.close(); 
  /* le téléphone */
  const tl = await ouvrir({ fichier, test, qui: 'telephone', W: 390, H: 844, tel: true }); const bt = await attendreBandeau(tl.pg);
  dire('      ' + mode + ' · téléphone : bandeau ' + (bt.b ? 'en ' + bt.t + ' ms : « ' + bt.b + ' »' : 'ABSENT (6 s)'));
  verif(mode, bt.b && bt.t <= 2000, 'le téléphone voit le bandeau en moins de 2 s', bt); await capt(tl.pg, pre + '03-telephone-bandeau');
  let voie = 'Reprendre';
  if (bt.b) { await tl.pg.locator('#ses-reprise-oui').tap({ timeout: 3000 }).catch(() => tl.pg.click('#ses-reprise-oui').catch(() => {})); await p(4000); await tl.pg.keyboard.press('Escape').catch(() => {}); await p(400); await garde(tl.pg); }
  else { voie = 'relance de la même séance (pas de bandeau)'; await lancerClasse(tl); await garde(tl.pg); }
  await p(1200); const k0 = await cleDe(o.pg), k1 = await cleDe(tl.pg);
  const etatSes = pg => pg.evaluate(() => { try { return { lancee: !!S.lancee, close: !!S.close, regime: typeof AT_DR_REGIME !== 'undefined' ? AT_DR_REGIME : null, test: m8TestOn(), tt: DR_TT.sig, ici: typeof DR_SES === 'object' && DR_SES.ici ? DR_SES.ici.sig : null, recu: typeof DR_SES === 'object' ? DR_SES.recu : null, di: S.di, mur: !!S.mur }; } catch (e) { return String(e); } }).catch(e => String(e));
  dire('      ' + mode + ' · l’état des pilotes : ordinateur ' + JSON.stringify(await etatSes(o.pg)) + ' · téléphone ' + JSON.stringify(await etatSes(tl.pg)));
  dire('      ' + mode + ' · téléphone, ' + voie + ' : ordinateur ' + k0 + ' · téléphone ' + k1 + ' · tableau ' + ((await tabDe(T.pg)) || {}).cle);
  verif(mode, k0 && k0 === k1, 'le téléphone reprend à l’endroit exact (la diapo, le dévoilement, la page)', { k0, k1 });
  if (process.env.MJPC_STOP) { dire('      erreurs téléphone : ' + tl.errs.concat(tl.boites).join(' ; ') + ' · ordinateur : ' + o.errs.join(' ; ')); dire('      infos téléphone : ' + JSON.stringify(await tl.pg.evaluate(() => Array.from(document.querySelectorAll('.at-info, #at-info, .at-toast, [class*=info]')).filter(x => x.offsetParent !== null).map(x => (x.innerText || '').slice(0, 160)).slice(0, 6)).catch(() => []))); await capt(tl.pg, 'dbg-tel'); await tl.ctx.close(); await T.ctx.close(); await o.ctx.close(); return; }
  await capt(tl.pg, pre + '04-telephone-repris'); await capt(o.pg, pre + '04-ordinateur');
  /* en alternance */
  const D = { tel: [], ord: [], tab: [] }; let manques = 0;
  for (let k = 0; k < 10; k++) { const parTel = k % 2 === 0; const src = parTel ? tl : o; const dst = parTel ? o : tl;
    if (parTel) await geste(tl.pg); else await gesteClic(o.pg);
    const s = await suivre(src.pg, [[parTel ? 'ord' : 'tel', dst.pg, false], ['tab', T.pg, true]]);
    const a = s.r[parTel ? 'ord' : 'tel'], b = s.r.tab; if (a == null || b == null) manques++;
    if (process.env.MJPC_DEBUG && b == null) { const cs = Object.entries(ECR.length ? {} : {}); const sc = (() => { const L = ECR.filter(x => /\/scene$/.test(x.c)).slice(-4); return L.map(x => x.qui + ' ts' + ((x.bd && x.bd.ts) || 0) % 100000 + ' ' + ((x.bd && x.bd.eid) || '') + '#' + ((x.bd && x.bd.nDev) || 0) + ' @' + (x.t % 100000)).join(' | '); })();
      dire('      (débogage) tableau ∞ au geste ' + k + ' : cible ' + s.cible + ' ; dernières scènes écrites : ' + sc + ' ; tableau ' + JSON.stringify(await T.pg.evaluate(() => ({ ts: DR_TAB.ts % 100000, pp: DR_TAB.pilotePresent, m: DR_TAB.montre && (DR_TAB.montre.eid + '#' + DR_TAB.montre.nDev) })).catch(e => String(e))) + ' ; ordinateur ' + JSON.stringify(await o.pg.evaluate(() => ({ main: DR_SES.main === DR_SES.id, dts: (DR_TAB.dernierTs || 0) % 100000 })).catch(e => String(e)))); }
    D[parTel ? 'ord' : 'tel'].push(a == null ? '∞' : a); D.tab.push(b == null ? '∞' : b); await p(250); }
  dire('      ' + mode + ' · dix gestes en alternance (téléphone, ordinateur…) — l’autre pilote suit en (ms) : ordinateur ' + D.ord.join(', ') + ' · téléphone ' + D.tel.join(', ') + ' · tableau distant ' + D.tab.join(', '));
  const tous = D.ord.concat(D.tel, D.tab); verif(mode, !manques && tous.every(x => x !== '∞' && x <= 500), 'chaque geste paraît sur l’autre pilote et au tableau distant en ≤ 0,5 s (' + tous.filter(x => x !== '∞' && x <= 500).length + ' / ' + tous.length + ')', { max: Math.max(...tous.map(x => x === '∞' ? 99999 : x)) });
  await capt(tl.pg, pre + '05-telephone-pilote'); await capt(o.pg, pre + '05-ordinateur-suit'); await capt(T.pg, pre + '05-tableau-suit');
  /* deux gestes presque en même temps */
  await Promise.all([geste(tl.pg), gesteClic(o.pg)]); await p(1500);
  const kk = [await cleDe(o.pg), await cleDe(tl.pg), ((await tabDe(T.pg)) || {}).cle];
  dire('      ' + mode + ' · deux gestes presque en même temps : ordinateur ' + kk[0] + ' · téléphone ' + kk[1] + ' · tableau ' + kk[2]);
  verif(mode, kk[0] && kk[0] === kk[1] && kk[1] === kk[2], 'deux gestes presque en même temps : les deux pilotes et le tableau distant d’accord', kk);
  if (process.env.MJPC_ALT_SEUL) { sansErreur(mode, [].concat(o.errs, o.boites, tl.errs, tl.boites, T.errs, T.boites), 'ordinateur, téléphone, tableau distant'); await tl.ctx.close(); await T.ctx.close(); await o.ctx.close(); return; }   /* la bissection : l'alternance seule */
  /* une réponse tapée sur un second ordinateur pendant que le premier dévoile, et la participation saisie au téléphone pendant ce temps : rien perdu */
  {
    const o3 = await ouvrir({ fichier, test: false, qui: 'ordinateur2', W: 1366, H: 768 }); const b3 = await attendreBandeau(o3.pg);
    if (b3.b) { await o3.pg.click('#ses-reprise-oui').catch(() => {}); await p(4000); await o3.pg.keyboard.press('Escape').catch(() => {}); await p(400); await garde(o3.pg); }
    await garde(o.pg); const aQB = await allerA(o.pg, QB); await toutDevoiler(o.pg, QB); await p(1500);
    const k3 = [await cleDe(o.pg), await cleDe(o3.pg), await cleDe(tl.pg)];
    dire('      ' + mode + ' · un second ordinateur reprend aussi (' + (b3.b ? 'bandeau en ' + b3.t + ' ms' : 'PAS DE BANDEAU') + ') ; l’ordinateur va à « Question-bilan » (' + (aQB ? 'fait' : 'PAS TROUVÉE') + ') : ordinateur ' + k3[0] + ' · second ' + k3[1] + ' · téléphone ' + k3[2]);
    if (process.env.MJPC_DEBUG) dire('      (débogage) le second avant la frappe : ' + JSON.stringify(await o3.pg.evaluate(() => { const a = document.activeElement; return { att: !!DR_SES.attente, occ: dr_sesOccupe(), appui: DR_SES.appui, act: a ? a.tagName + '#' + a.id + '.' + a.className + ' v=' + String(a.value || '').slice(0, 20) : null, main: DR_SES.main === DR_SES.id ? 'moi' : DR_SES.main, rejoint: DR_SES.rejoint, ap: DR_SES.attendrePremier, ici: !!DR_SES.ici }; }).catch(e => String(e))));
    if (process.env.MJPC_DEBUG) for (const pg of [o.pg, o3.pg, tl.pg]) await pg.evaluate(() => { const noms = () => (S.parts || []).map(x => x && x.nom).filter(Boolean); DR_SES.dbgP = [];
      ['dr_sesAppliquer', 'dr_sesPoserAutour', 'dr_sesEnvoyerMaintenant'].forEach(n => { const f = window[n]; window[n] = function (v) { const av = noms(); const r = f.apply(this, arguments); const ap = noms(); const perdus = av.filter(x => !ap.includes(x)); const gagnes = ap.filter(x => !av.includes(x));
        if (perdus.length || gagnes.length || n === 'dr_sesEnvoyerMaintenant' && false) DR_SES.dbgP.push({ n, t: Date.now() % 100000, par: v && v.par, ts: v && v.ts % 100000, base: v && v.base, bConnue: !!(v && v.base && DR_SES.hist.get(v.base)), bP: v && v.base && DR_SES.hist.get(v.base) ? JSON.stringify(DR_SES.hist.get(v.base).S && DR_SES.hist.get(v.base).S.parts || null).length : -1, tP: v && v.S ? (v.S.parts || []).length : -1, perdus, gagnes, main: DR_SES.main === DR_SES.id }); return r; }; });
      const pa = window.partAjoute; if (pa) window.partAjoute = function () { const r = pa.apply(this, arguments); DR_SES.dbgP.push({ n: 'partAjoute', t: Date.now() % 100000, nom: r && r.nom }); return r; };
      const ec = window.dr_sesEcrire; window.dr_sesEcrire = function (ici, sous, v) { if (sous === '/vif') DR_SES.dbgP.push({ n: 'envoi', t: Date.now() % 100000, ts: v.ts % 100000, parts: (v.S && v.S.parts || []).length, main: v.main === DR_SES.id, cede: v.cede, g: (DR_SES.gardeCles || []).join(',') }); return ec.apply(this, arguments); }; }).catch(() => {});
    const ELV = await tl.pg.evaluate(() => { try { return { nom: ELEVES[0], ini: iniDe(ELEVES[0]) }; } catch (e) { return null; } });
    const REP = 'Le Romantisme met en scène la nature contre la règle';
    if (process.env.MJPC_DEBUG) await o3.pg.evaluate(() => { DR_SES.dbgF = []; const d = el => el ? (el.tagName + '.' + String(el.className || '').slice(0, 30) + '[' + (el.getAttribute && el.getAttribute('data-p') || '') + ']' + ' «' + String(el.textContent || '').slice(0, 12) + '» co=' + el.isConnected) : null;
      document.addEventListener('focusout', ev => DR_SES.dbgF.push({ t: Date.now() % 100000, quoi: 'out', de: d(ev.target), vers: d(ev.relatedTarget), main: DR_SES.main === DR_SES.id, att: !!DR_SES.attente, pile: (new Error().stack || '').split('\n').slice(2, 9).map(x => x.trim().slice(3, 60)).join(' | ') }), true);
      document.addEventListener('focusin', ev => DR_SES.dbgF.push({ t: Date.now() % 100000, quoi: 'in', de: d(ev.target), pile: (new Error().stack || '').split('\n').slice(2, 9).map(x => x.trim().slice(3, 60)).join(' | ') }), true);
      const qb = () => { try { return JSON.stringify(((parDiapo['0|emt9v3yqo6pvd5'] || {}).reps) || null).slice(0, 80); } catch (e) { return String(e); } };
      document.addEventListener('input', ev => { if (DR_SES.dbgF.length < 30) DR_SES.dbgF.push({ t: Date.now() % 100000, quoi: 'input', dom: String(ev.target.textContent || '').slice(0, 12), etat: qb() }); }, true);
      setTimeout(() => { if (DR_SES.dbgF.length < 30) DR_SES.dbgF.push({ t: Date.now() % 100000, quoi: 'apres-input', etat: qb() }); }, 900);
      const ap = window.dr_sesAppliquer; window.dr_sesAppliquer = function (v) { const av = qb(); const r = ap.apply(this, arguments); DR_SES.dbgF.push({ t: Date.now() % 100000, quoi: 'appliquer', par: v && v.par, avant: av, apres: qb(), vrep: (() => { try { return JSON.stringify(v.parDiapo['0|emt9v3yqo6pvd5'].reps).slice(0, 60); } catch (e) { return '-'; } })(), act: d(document.activeElement) }); return r; };
      const po = window.dr_sesPoserAutour; window.dr_sesPoserAutour = function (v) { const r = po.apply(this, arguments); DR_SES.dbgF.push({ t: Date.now() % 100000, quoi: 'poser ' + r, act: d(document.activeElement) }); return r; };
      const tt = window.tout; if (tt) window.tout = function () { const a0 = document.activeElement; const r = tt.apply(this, arguments); if (a0 !== document.activeElement) DR_SES.dbgF.push({ t: Date.now() % 100000, quoi: 'tout change le focus', de: d(a0), vers: d(document.activeElement) }); return r; }; }).catch(() => {});
    const dit = await o3.pg.$('#mur .rep.libre .dit'); let tape = false;
    if (dit) { await dit.click(); await p(200);
      await Promise.all([
        o3.pg.keyboard.type(REP, { delay: 45 }).then(() => { tape = true; }),
        (async () => { await p(500); await gesteClic(o.pg); await p(600); await o.pg.keyboard.press('ArrowLeft').catch(() => {}); await p(600); await gesteClic(o.pg); })(),
        (async () => { if (!ELV) return; await p(700); await tl.pg.evaluate(() => { const v = document.getElementById('vif'); if (v) v.focus(); }); await tl.pg.keyboard.type(ELV.ini, { delay: 60 }); await p(500); await tl.pg.keyboard.press('Enter'); await p(300); await tl.pg.evaluate(() => { try { document.activeElement.blur(); } catch (e) {} }); })() ]);
      if (process.env.MJPC_DEBUG) dire('      (débogage) avant la sortie du champ, au second : ' + JSON.stringify(await o3.pg.evaluate(r => ({ rep: JSON.stringify(parDiapo).indexOf(r) >= 0, dom: (document.activeElement && document.activeElement.textContent || '').slice(0, 60), att: !!DR_SES.attente, occ: dr_sesOccupe(), env: DR_SES.envoye ? 1 : 0, socleA: !!DR_SES.socle, b: JSON.stringify(DR_SES.socle && DR_SES.socle.parDiapo).indexOf('Romantisme') >= 0, t: JSON.stringify(DR_SES.attente && DR_SES.attente.parDiapo).indexOf('Romantisme') >= 0, m: JSON.stringify(dr_sesPhoto().parDiapo).indexOf('Romantisme') >= 0, fus: JSON.stringify(dr_sesFus(DR_SES.socle && DR_SES.socle.parDiapo, dr_sesPhoto().parDiapo, DR_SES.attente && DR_SES.attente.parDiapo)).indexOf('Romantisme') >= 0, sigdiff: dr_sesSig(dr_sesPhoto()) !== DR_SES.envoye, kb: Object.keys((DR_SES.socle||{}).parDiapo||{}).join(','), km: Object.keys(dr_sesPhoto().parDiapo||{}).join(','), kt: Object.keys((DR_SES.attente||{}).parDiapo||{}).join(','), qb: JSON.stringify(((DR_SES.socle||{}).parDiapo||{})['0|emt9v3yqo6pvd5']||null).slice(0,300), qt: JSON.stringify(((DR_SES.attente||{}).parDiapo||{})['0|emt9v3yqo6pvd5']||null).slice(0,300) }), REP).catch(e => String(e))));
      await p(300); await o3.pg.evaluate(() => { try { document.activeElement.blur(); } catch (e) {} });
      if (process.env.MJPC_DEBUG) { await p(1500); dire('      (débogage) après la sortie du champ, au second : ' + JSON.stringify(await o3.pg.evaluate(r => ({ rep: JSON.stringify(parDiapo).indexOf(r) >= 0, att: !!DR_SES.attente, cle: S.di, dbg: DR_SES.dbg, qbNow: JSON.stringify(parDiapo['0|emt9v3yqo6pvd5'] || null).slice(0, 200) }), REP).catch(e => String(e)))); } }
    await p(2500);
    /* qui a la main : l'ordinateur qui dévoile prend la main ; le champ du second se ferme tel qu'il est — le texte tapé jusque-là est gardé (les lettres d'après tombent hors du champ) */
    const garde3 = await o3.pg.evaluate(R => { let k = ''; try { Object.values(parDiapo).forEach(d => Object.values((d && d.reps) || {}).forEach(l => (l || []).forEach(x => { if (x && x.r && R.indexOf(x.r) === 0 && x.r.length > k.length) k = x.r; }))); } catch (e) {} return k; }, REP).catch(() => '');
    dire('      ' + mode + ' · le texte gardé au second ordinateur quand l’ordinateur a pris la main : « ' + garde3 + ' »');
    const REPv = garde3 && garde3.length >= 3 ? garde3 : REP;
    const vu = pg => pg.evaluate(([r, nom]) => { try { return { rep: JSON.stringify(parDiapo).indexOf(r) >= 0, part: (S.parts || []).some(x => x && x.nom === nom), cle: (() => { const m = S.mur; return m ? (m.eid || seance().ecrans[m.di].eid) + '#' + (m.nDev || 0) + '#' + (m.page || 0) : null; })() }; } catch (e) { return String(e); } }, [REPv, ELV && ELV.nom]).catch(e => String(e));
    const V = { ordinateur: await vu(o.pg), second: await vu(o3.pg), telephone: await vu(tl.pg) };
    if (process.env.MJPC_DEBUG) dire('      (débogage) focus du second : ' + await o3.pg.evaluate(() => JSON.stringify(DR_SES.dbgF.slice(0, 40))).catch(e => String(e)));
    if (process.env.MJPC_DEBUG) for (const [q, pg] of [['ordinateur', o.pg], ['second', o3.pg], ['telephone', tl.pg]]) dire('      (débogage) ' + q + ' ' + await pg.evaluate(() => DR_SES.id + ' ' + JSON.stringify(DR_SES.dbgP)).catch(e => String(e)));

    dire('      ' + mode + ' · la réponse tapée au second ordinateur (« ' + REP + ' »' + (tape ? '' : ', PAS TAPÉE') + '), l’ordinateur qui dévoile (▶ ← ▶), la participation de ' + (ELV ? ELV.nom + ' (' + ELV.ini + ')' : '?') + ' au téléphone : ' + JSON.stringify(V));
    await capt(o3.pg, pre + '05b-second-ordinateur-reponse'); await capt(o.pg, pre + '05b-ordinateur'); await capt(tl.pg, pre + '05b-telephone');
    verif(mode, dit && tape && garde3.length >= 3 && Object.values(V).every(x => x && x.rep), 'la réponse tapée au second ordinateur pendant que l’ordinateur dévoile : l’ordinateur prend la main, le texte tapé jusque-là (« ' + garde3 + ' ») est chez les trois pilotes, rien de perdu', V);
    verif(mode, ELV && Object.values(V).every(x => x && x.part), 'la participation saisie au téléphone pendant ce temps : chez les trois pilotes', V);
    const sansPage = c => String(c || '').split('#').slice(0, 2).join('#');   /* la page dépend de la taille de l'écran de chaque appareil (DR_SES_VUE) : la diapo et le dévoilement */
    verif(mode, Object.values(V).every(x => x && x.cle && sansPage(x.cle) === sansPage(V.ordinateur.cle)), 'le dévoilement de l’ordinateur : chez les trois pilotes (la diapo, le dévoilement)', V);
    o.errs.push(...o3.errs, ...o3.boites); await o3.ctx.close();
    if (process.env.MJPC_STOP3) { await tl.ctx.close(); await T.ctx.close(); await o.ctx.close(); return; }
    /* qui a la main (Paul, 16:19) : l'ordinateur tape une réponse — chaque lettre au tableau en ≤ 0,5 s ; le téléphone (un pilote entier) note une participation :
       il prend la main ; le champ de l'ordinateur se ferme tel qu'il est, son texte gardé, l'ordinateur dit qu'un autre a la main ; le téléphone dévoile : le
       tableau le suit et ne recule jamais ; un geste à l'ordinateur lui rend la main */
    {
      await garde(o.pg); await allerA(o.pg, QB); await toutDevoiler(o.pg, QB); await p(1200);
      const dits = await o.pg.$$('#mur .rep .dit'); const dit2 = dits.length ? dits[dits.length - 1] : null; const ELV2 = await tl.pg.evaluate(() => { try { return { nom: ELEVES[1], ini: iniDe(ELEVES[1]) }; } catch (e) { return null; } });
      const tabRep = t => T.pg.evaluate(t => { const m = (typeof DR_TAB === 'object' && DR_TAB.montre) || null; return !!(m && JSON.stringify(m.reps || {}).indexOf(t) >= 0); }, t).catch(() => false);
      const L1 = []; let tape = '', recul = 0, ech = 0, avantDev = null, apresDev = null, ferme = null, dit3 = '', dDev = null;
      if (dit2 && ELV2) { await dit2.click(); await p(200); await o.pg.keyboard.press('End').catch(() => {}); await o.pg.keyboard.type(' ');
        for (const c of 'Pensez') { await o.pg.keyboard.type(c); tape += c; const t0 = Date.now(); let ms = null; while (Date.now() - t0 < 1500) { if (await tabRep(tape.trimEnd().slice(-6))) { ms = Date.now() - t0; break; } await p(20); } L1.push(ms == null ? '∞' : ms); await p(120); }
        await tl.pg.evaluate(() => { const v = document.getElementById('vif'); if (v) v.focus(); }); await tl.pg.keyboard.type(ELV2.ini, { delay: 40 }); await p(300); await tl.pg.keyboard.press('Enter'); await p(200); await tl.pg.evaluate(() => { try { document.activeElement.blur(); } catch (e) {} });
        const t1 = Date.now(); while (Date.now() - t1 < 2000) { const x = await o.pg.evaluate(() => ({ ed: !!(document.activeElement && document.activeElement.isContentEditable), m: ((document.getElementById('dr-ses-main') || {}).textContent || '') })).catch(() => ({})); if (!x.ed && x.m) { ferme = Date.now() - t1; dit3 = x.m; break; } await p(40); }
        avantDev = ((await tabDe(T.pg)) || {}).cle; await geste(tl.pg); const r = await suivre(tl.pg, [['tab', T.pg, true]]); dDev = r.r.tab; apresDev = r.cible;
        const t2 = Date.now(); while (Date.now() - t2 < 2500) { const k = ((await tabDe(T.pg)) || {}).cle; if (k && k === avantDev && avantDev !== apresDev) recul++; ech++; await p(50); } }
      await p(800);
      const V2 = { ordinateur: await o.pg.evaluate(([t, n]) => ({ rep: JSON.stringify(parDiapo).indexOf(t) >= 0, part: (S.parts || []).some(x => x && x.nom === n) }), ['Pensez', ELV2 && ELV2.nom]).catch(e => String(e)),
        telephone: await tl.pg.evaluate(([t, n]) => ({ rep: JSON.stringify(parDiapo).indexOf(t) >= 0, part: (S.parts || []).some(x => x && x.nom === n) }), ['Pensez', ELV2 && ELV2.nom]).catch(e => String(e)) };
      const kf = [await cleDe(o.pg), await cleDe(tl.pg), ((await tabDe(T.pg)) || {}).cle];
      dire('      ' + mode + ' · qui a la main : l’ordinateur tape « Pensez », chaque lettre au tableau en ' + L1.join(', ') + ' ms ; le téléphone note ' + (ELV2 && ELV2.ini) + ' : le champ de l’ordinateur ' + (ferme != null ? 'fermé en ' + ferme + ' ms, il dit « ' + dit3 + ' »' : 'PAS FERMÉ') + ' ; le téléphone dévoile (' + avantDev + ' → ' + apresDev + ', au tableau en ' + dDev + ' ms), revenu en arrière ' + recul + ' fois sur ' + ech + ' ; à la fin ' + kf.join(' · ') + ' · ' + JSON.stringify(V2));
      await capt(o.pg, pre + '05c-ordinateur-autre-main'); await capt(T.pg, pre + '05c-tableau');
      verif(mode, dit2 && L1.length === 6 && L1.every(x => x !== '∞' && x <= 500), 'qui a la main : chaque lettre tapée à l’ordinateur paraît au tableau en ≤ 0,5 s', L1);
      verif(mode, ferme != null && /a la main/.test(dit3), 'qui a la main : le téléphone note une participation, il prend la main ; le champ de l’ordinateur se ferme tel qu’il est et l’ordinateur le dit', { ferme, dit3 });
      verif(mode, dDev != null && dDev <= 500 && !recul, 'qui a la main : le dévoilement du téléphone paraît au tableau (≤ 0,5 s) et n’y recule jamais', { dDev, recul });
      verif(mode, kf[0] && kf[0] === kf[1] && kf[1] === kf[2] && Object.values(V2).every(x => x && x.rep && x.part), 'qui a la main : rien de perdu — la réponse tapée, la participation et le dévoilement, chez les deux pilotes et au tableau', { kf, V2 });
    }
    /* F5 sur chaque pilote : le téléphone (« Reprendre »), puis l'ordinateur (il relance la même séance par la case : il la rejoint, aucune deuxième) */
    const ptr0 = test ? lireH('/site/tableau_test/pointeur') : lireH('/site/cours_actif');
    await tl.pg.reload({ waitUntil: 'load' }).catch(() => {}); await p(1800); await profPrep(tl.pg, test); const bf = await attendreBandeau(tl.pg);
    if (bf.b) { await tl.pg.locator('#ses-reprise-oui').tap({ timeout: 3000 }).catch(() => tl.pg.click('#ses-reprise-oui').catch(() => {})); await p(4000); await tl.pg.keyboard.press('Escape').catch(() => {}); await p(400); await garde(tl.pg); }
    await p(1000); const f1 = [await cleDe(o.pg), await cleDe(tl.pg)];
    dire('      ' + mode + ' · F5 au téléphone : bandeau ' + (bf.b ? 'en ' + bf.t + ' ms' : 'ABSENT') + ', « Reprendre » : ordinateur ' + f1[0] + ' · téléphone ' + f1[1]);
    verif(mode, bf.b && f1[0] && f1[0] === f1[1], 'F5 au téléphone : la session reprend, là où elle en est', f1);
    await o.pg.reload({ waitUntil: 'load' }).catch(() => {}); await p(1800); await profPrep(o.pg, test); const quoiR = await relancerClasse(o); await garde(o.pg); await p(1500);
    dire('      ' + mode + ' · F5 à l’ordinateur : la case de l’emploi du temps, « ' + quoiR + ' »');
    const f2 = [await cleDe(o.pg), await cleDe(tl.pg)]; const ptr1 = test ? lireH('/site/tableau_test/pointeur') : lireH('/site/cours_actif');
    dire('      ' + mode + ' · F5 à l’ordinateur, puis la même séance relancée par la case : ordinateur ' + f2[0] + ' · téléphone ' + f2[1] + ' · pointeur ' + (ptr0 && ptr1 && ptr0.ts === ptr1.ts ? 'le même (ts ' + ptr1.ts + ')' : (test ? 'CHANGÉ ' : 'réécrit ') + JSON.stringify([ptr0 && ptr0.ts, ptr1 && ptr1.ts])));
    verif(mode, f2[0] && f2[0] === f2[1], 'F5 à l’ordinateur et la même séance relancée : il rejoint la session, là où elle en est', f2);
    if (test) verif(mode, ptr0 && ptr1 && ptr0.ts === ptr1.ts, 'relancer le même essai ailleurs : aucune deuxième session (le pointeur d’essai inchangé)', [ptr0 && ptr0.ts, ptr1 && ptr1.ts]);
    else verif(mode, ptr1 && ptr0 && ptr1.classeSlug === ptr0.classeSlug && String(ptr1.seance) === String(ptr0.seance), 'relancer la même heure ailleurs : la même heure (le pointeur désigne la même classe et la même séance)', [ptr0, ptr1]);
    for (let k = 0; k < 2; k++) { await geste(tl.pg); const s3 = await suivre(tl.pg, [['ord', o.pg, false], ['tab', T.pg, true]]); dire('      ' + mode + ' · après les F5, un geste au téléphone : ordinateur ' + s3.r.ord + ' ms, tableau ' + s3.r.tab + ' ms'); verif(mode, s3.r.ord != null && s3.r.ord <= 500 && s3.r.tab != null && s3.r.tab <= 500, 'après les F5, l’ordinateur et le tableau suivent le téléphone (≤ 0,5 s)', s3.r); await p(300); }
  }
  /* l'onglet de l'ordinateur fermé, deux gestes au téléphone, clore au téléphone */
  await o.pg.close({ runBeforeUnload: true }).catch(() => {}); await p(800);
  const D2 = []; for (let k = 0; k < 2; k++) { await geste(tl.pg); const s = await suivre(tl.pg, [['tab', T.pg, true]]); D2.push(s.r.tab == null ? '∞' : s.r.tab); await p(300); }
  dire('      ' + mode + ' · l’onglet de l’ordinateur fermé, deux gestes au téléphone : le tableau distant suit en ' + D2.join(', ') + ' ms');
  verif(mode, D2.every(x => x !== '∞' && x <= 500), 'l’onglet de l’ordinateur fermé, le tableau distant suit le téléphone (≤ 0,5 s)', D2);
  const avant = { ptr: lireH('/site/tableau_test/pointeur'), sc: lireH('/site/tableau_test/scene'), ca: lireH('/site/cours_actif') };
  dire('      ' + mode + ' · avant la clôture, au hub : pointeur d’essai ' + (avant.ptr ? 'là' : '—') + ', scène d’essai ' + (avant.sc ? 'là' : '—') + ', cours_actif ' + (avant.ca ? 'là' : '—'));
  await clore(tl.pg); await p(3500);
  const tb = await tabDe(T.pg); const apres = { ptr: lireH('/site/tableau_test/pointeur'), sc: lireH('/site/tableau_test/scene'), vif: lireH('/site/tableau_test/vif'), ca: lireH('/site/cours_actif') };
  dire('      ' + mode + ' · clos au téléphone : tableau distant ' + (tb && tb.attente ? 'à l’horloge' : 'sur « ' + (tb && tb.cle) + ' »') + ' · au hub : pointeur d’essai ' + (apres.ptr ? 'LÀ' : '—') + ', scène d’essai ' + (apres.sc ? 'LÀ' : '—') + ', état vivant d’essai ' + (apres.vif ? 'LÀ' : '—') + ', cours_actif ' + (apres.ca ? 'LÀ' : '—'));
  await capt(tl.pg, pre + '06-telephone-clos'); await capt(T.pg, pre + '06-tableau-apres-cloture');
  if (test) { verif(mode, tb && tb.attente, 'clos au téléphone : le tableau distant revient à l’horloge', tb); verif(mode, !apres.ptr && !apres.sc, 'au hub : plus de pointeur ni de scène d’essai', apres);
    const hors = ECR.filter(x => x.qui !== 'tableau' && !/^\/site\/tableau_test(\/|$)/.test(x.c)); const duTab = ECR.filter(x => x.qui === 'tableau').map(x => x.m + ' ' + x.c); if (duTab.length) dire('      ' + mode + ' · le tableau distant (pas en mode test) a écrit ' + duTab.length + ' fois : ' + [...new Set(duTab)].join(', ') + ' (la clé USB, sa seule écriture, préexistante)'); const chemins = [...new Set(ECR.filter(x => x.qui !== 'tableau').map(x => x.c.replace(/\/telecommande\/[^/]+/, '/telecommande/<nonce>')))];
    dire('      ' + mode + ' · écritures au hub pendant l’essai : ' + ECR.length + ' — chemins : ' + chemins.join(', '));
    verif(mode, !hors.length, 'en mode test, aucune écriture hors des chemins d’essai (' + hors.length + ' hors)', hors.slice(0, 5).map(x => x.m + ' ' + x.c)); }
  else { verif(mode, !apres.ca, 'clos au téléphone : /site/cours_actif retiré', apres.ca); verif(mode, tb && tb.attente, 'clos au téléphone : le tableau distant revient à l’horloge', tb); }
  verif(mode, !REFUSES.length, 'aucune écriture refusée par le faux hub (' + REFUSES.length + ')', REFUSES.slice(0, 3));
  const errs = [].concat(o.errs, o.boites, tl.errs, tl.boites, T.errs, T.boites); sansErreur(mode, errs, 'ordinateur, téléphone, tableau distant');
  await tl.ctx.close(); await T.ctx.close(); await o.ctx.close().catch(() => {});
};
/* ═══ Q · la télécommande par le QR code (§3.6) : l'ordinateur lance l'heure (ou l'essai), « 📱 » montre le QR ; le téléphone ouvre l'adresse du QR (il
   n'est ni connecté ni en mode test : le QR vaut la session) ; la fenêtre du QR se ferme seule ; le téléphone est sur la séance, sans rien choisir ;
   ▶ ◀ ❄ « qui a parlé » le minuteur : l'ordinateur et le tableau distant suivent ; « Clore l'heure » à l'ordinateur : la télécommande le dit ═══ */
const telecommande = async (fichier, mode, nomV) => { const test = mode === 'QT'; HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; const pre = 'session-' + nomV + '-' + mode + '-';
  dire('\n— la télécommande par le QR, ' + (test ? 'l’essai en mode test' : 'la vraie heure') + ' · ' + nomV + ' —');
  const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(800);
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); for (let k = 0; k < 2; k++) { await gesteClic(o.pg); await p(400); }
  verif(mode, lance, 'l’ordinateur lance l’heure');
  const vb = await o.pg.waitForSelector('#dr-tc-btn', { state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
  const bulle = await o.pg.evaluate(() => { const b = document.getElementById('dr-tc-btn'); return b ? b.title : ''; });
  verif(mode, vb && /Télécommande/.test(bulle), '« 📱 » dans la barre des actions rapides, son infobulle pour Paul', bulle.slice(0, 120));
  await o.pg.click('#dr-tc-btn').catch(() => {}); await p(800);
  const url = await o.pg.evaluate(() => { const i = document.getElementById('dr-tc-qr-img'); return i ? new URL(i.src).searchParams.get('data') : null; });
  await capt(o.pg, pre + '01-ordinateur-qr');
  verif(mode, url && /[?&]telecommande=1&qr=/.test(url) && (!test || /&test=1/.test(url)), 'le QR montre l’adresse de la télécommande', url);
  if (!url) { await o.ctx.close(); await T.ctx.close(); return; }
  const t0 = Date.now(); const tl = await ouvrir({ fichier, qui: 'telephone', W: 390, H: 844, tel: true, prof: false, test: false, q: '?' + url.split('?')[1] });
  let ferme = null; for (let k = 0; k < 60; k++) { if (!(await o.pg.$('#dr-tc-qr'))) { ferme = Date.now() - t0; break; } await p(100); }
  dire('      ' + mode + ' · la fenêtre du QR, à l’ordinateur : ' + (ferme != null ? 'fermée seule ' + ferme + ' ms après l’ouverture de l’adresse au téléphone' : 'PAS FERMÉE (6 s)'));
  verif(mode, ferme != null, 'la fenêtre du QR se ferme d’elle-même quand le téléphone l’a scanné', ferme);
  let prete = null; for (let k = 0; k < 100; k++) { const h = await texteDe(tl.pg, '#tc-haut'); const vis = await tl.pg.evaluate(() => { const x = document.getElementById('tc-haut'); return !!(x && x.style.display !== 'none'); }).catch(() => false); if (vis && h && /Diapo/.test(h)) { prete = Date.now() - t0; break; } await p(150); }
  const kk = [await cleDe(o.pg), await cleDe(tl.pg)]; const haut = await texteDe(tl.pg, '#tc-haut');
  dire('      ' + mode + ' · le téléphone, sur la séance sans rien choisir : ' + (prete != null ? 'en ' + prete + ' ms' : 'PAS PRÊT (15 s)') + ' · « ' + haut + ' » · ordinateur ' + kk[0] + ' · téléphone ' + kk[1]);
  verif(mode, prete != null && /Charles de Gaulle/.test(haut || '') && kk[0] && kk[0] === kk[1], 'le téléphone s’ouvre directement sur la séance en cours, en télécommande, là où elle en est', { prete, haut, kk });
  await capt(tl.pg, pre + '02-telecommande');
  const tap = async a => { const ok = await tl.pg.locator('#tc-bas button[data-a="' + a + '"]').first().tap({ timeout: 1500 }).then(() => true).catch(() => false); if (!ok) await tl.pg.evaluate(a => { const b = document.querySelector('#tc-bas button[data-a="' + a + '"]'); if (b) b.click(); }, a); };
  const D = { ord: [], tab: [] };
  if (process.env.MJPC_DEBUG) { const k0 = await cleDe(tl.pg); const t0 = Date.now(); await tap('suiv'); const t1 = Date.now(); let k1 = null; while (Date.now() - t0 < 4000) { k1 = await cleDe(tl.pg); if (k1 !== k0) break; await p(20); } const t2 = Date.now(); const r = await suivre(tl.pg, [['ord', o.pg, false]]); dire('      (débogage) premier ▶ : le tap rend en ' + (t1 - t0) + ' ms, le téléphone change en ' + (t2 - t0) + ' ms, l’ordinateur suit ' + r.r.ord + ' ms après ; écritures après le tap : ' + ECR.filter(x => x.t >= t0).map(x => x.qui + ' ' + x.c.split('/').slice(-1)[0] + ' +' + (x.t - t0)).join(', ') + ' ; téléphone : ' + JSON.stringify(await tl.pg.evaluate(() => ({ att: DR_SES.attendrePremier ? Date.now() - DR_SES.attendrePremier : 0, rej: DR_SES.rejoint, recu: DR_SES.recu, attente: !!DR_SES.attente, occ: dr_sesOccupe(), ae: document.activeElement && (document.activeElement.id || document.activeElement.tagName) })))); }
  const numDe = async () => { const re = /^(Diapo \d+ sur \d+ · heure \d+|Hors de l.heure \d+)/; const tc = ((await texteDe(tl.pg, '#tc-haut .di')) || '').match(re); const pi = ((await texteDe(o.pg, '#numero')) || '').match(re); return [tc && tc[0], pi && pi[0]]; };
  const NUM = [];
  for (const a of ['suiv', 'suiv', 'suiv', 'suiv', 'suiv', 'prec']) { await tap(a); const r = await suivre(tl.pg, [['ord', o.pg, false], ['tab', T.pg, true]]); D.ord.push(r.r.ord == null ? '∞' : r.r.ord); D.tab.push(r.r.tab == null ? '∞' : r.r.tab); let nn = await numDe(); const tn = Date.now(); while (nn[0] !== nn[1] && Date.now() - tn < 500) { await p(40); nn = await numDe(); } NUM.push(nn.concat([Date.now() - tn])); await p(250); }
  dire('      ' + mode + ' · le texte de la télécommande et celui du pilote, à chaque geste : ' + NUM.map(x => x[0] + ' | ' + x[1]).join(' ; '));
  verif(mode, NUM.every(x => x[0] && x[0] === x[1]), 'la télécommande dit exactement ce que dit le pilote (« Diapo n sur N · heure h »), à chaque geste (d’accord en ≤ 0,5 s)', NUM);
  if (process.env.MJPC_DEBUG) dire('      ' + mode + ' · (débogage) les états vivants écrits : ' + ECR.filter(x => /\/vif$/.test(x.c)).map(x => x.qui + ' ' + Math.round(JSON.stringify(x.bd || '').length / 1000) + ' ko' + (x.bd && x.bd.ecrans ? ' +copie' : '') + ' @' + (x.t % 100000)).join(', '));
  dire('      ' + mode + ' · ▶ ×5 puis ◀ à la télécommande — l’ordinateur suit en ' + D.ord.join(', ') + ' ms · le tableau distant en ' + D.tab.join(', ') + ' ms');
  const tous = D.ord.concat(D.tab); verif(mode, tous.every(x => x !== '∞' && x <= 500), '▶ ◀ à la télécommande : l’ordinateur et le tableau distant suivent (≤ 0,5 s ; ' + tous.filter(x => x !== '∞' && x <= 500).length + ' / ' + tous.length + ')', D);
  const attendrePc = async (f, ms = 1500, arg) => { const t1 = Date.now(); while (Date.now() - t1 < ms) { if (await o.pg.evaluate(f, arg).catch(() => false)) return Date.now() - t1; await p(25); } return null; };
  const mainDe = pg => pg.evaluate(() => ({ id: DR_SES.id, main: DR_SES.main, tc: DR_SES.mainTc, geste: DR_SES.geste ? Date.now() - DR_SES.geste : null, recu: DR_SES.recu % 100000, envoi: (DR_SES.envoiTs || 0) % 100000, ici: !!DR_SES.ici, att: DR_SES.attendrePremier, attente: !!DR_SES.attente, occ: dr_sesOccupe(), ae: document.activeElement && (document.activeElement.id || document.activeElement.tagName) })).catch(e => String(e));
  if (process.env.MJPC_DEBUG) dire('      (débogage) avant ❄ : ordinateur ' + JSON.stringify(await mainDe(o.pg)) + ' · téléphone ' + JSON.stringify(await mainDe(tl.pg)));
  await tap('gel'); const g1 = await attendrePc(() => !!S.gel);
  if (process.env.MJPC_DEBUG) { await p(600); dire('      (débogage) après ❄ : ordinateur ' + JSON.stringify(await mainDe(o.pg)) + ' · téléphone ' + JSON.stringify(await mainDe(tl.pg))); } await capt(tl.pg, pre + '03-telecommande-gel'); await tap('gel'); const g2 = await attendrePc(() => !S.gel);
  dire('      ' + mode + ' · ❄ Geler puis Dégeler à la télécommande : l’ordinateur gelé en ' + g1 + ' ms, dégelé en ' + g2 + ' ms');
  verif(mode, g1 != null && g1 <= 500 && g2 != null && g2 <= 500, '❄ Geler / Dégeler à la télécommande : l’ordinateur suit (≤ 0,5 s)', [g1, g2]);
  const ini = await tl.pg.evaluate(() => { const b = document.querySelector('#tc-bas .eleves button[data-ini]'); return b ? { ini: b.dataset.ini, nom: b.title.split(' a parlé')[0] } : null; });
  let q1 = null, q2 = null;
  if (ini) { await tl.pg.locator('#tc-bas .eleves button[data-ini="' + ini.ini + '"]').tap({ timeout: 1500 }).catch(() => {}); q1 = await attendrePc(n => (S.parts || []).some(x => x.nom === n), 1500, ini.nom);
    const on = await tl.pg.evaluate(i => { const b = document.querySelector('#tc-bas .eleves button[data-ini="' + i + '"]'); return !!(b && b.classList.contains('on')); }, ini.ini); await capt(tl.pg, pre + '04-telecommande-qui');
    await tl.pg.locator('#tc-bas .eleves button[data-ini="' + ini.ini + '"]').tap({ timeout: 1500 }).catch(() => {}); q2 = await attendrePc(n => !(S.parts || []).some(x => x.nom === n), 1500, ini.nom);
    dire('      ' + mode + ' · « qui a parlé » : ' + ini.nom + ' (' + ini.ini + ') noté à l’ordinateur en ' + q1 + ' ms (le bouton ' + (on ? 'allumé' : 'PAS allumé') + '), retiré en ' + q2 + ' ms'); }
  verif(mode, ini && q1 != null && q1 <= 500 && q2 != null && q2 <= 500, '« qui a parlé » à la télécommande : noté puis retiré à l’ordinateur (≤ 0,5 s)', [q1, q2]);
  await tap('m-plus'); await p(200); await tap('m-go'); const m1 = await attendrePc(() => !!(DR_CL.minut && DR_CL.minut.etat === 'court' && DR_CL.minut.tableau), 1500);
  let mt = null; for (let k = 0; k < 20; k++) { if (await T.pg.evaluate(() => { const m = document.getElementById('dr-tab-minut'); return !!(m && m.style.display !== 'none' && m.textContent); }).catch(() => false)) { mt = k * 100; break; } await p(100); }
  const mtxt = await texteDe(T.pg, '#dr-tab-minut'); await capt(tl.pg, pre + '05-telecommande-minuteur'); await capt(o.pg, pre + '05-ordinateur-suit'); await capt(T.pg, pre + '05-tableau-suit');
  dire('      ' + mode + ' · le minuteur (+ puis Départ) à la télécommande : il court à l’ordinateur en ' + m1 + ' ms, au tableau distant (« ' + mtxt + ' ») en ~' + mt + ' ms');
  verif(mode, m1 != null && m1 <= 500 && mt != null, 'le minuteur à la télécommande : il court à l’ordinateur et paraît au tableau distant', [m1, mt]);
  await tap('m-stop'); await p(600);
  /* le cas de Paul (16:10, avec « qui a la main », 16:19) : « Je pars me promener dans la salle avec mon téléphone, puis je reviens, j'écris une réponse élève
     sans couper mon téléphone, etc. » — des gestes au téléphone ; à l'ordinateur, il va à la question et tape une réponse : l'ordinateur prend la main, la
     télécommande dit « Télécommande désactivée », ses commandes grisées ; chaque lettre au tableau en ≤ 0,5 s ; sans quitter le champ de l'ordinateur,
     « Reprendre avec la télécommande » : le champ se ferme tel qu'il est, l'ordinateur dit « La télécommande a la main », la réponse entière est au téléphone ;
     de nouveau des gestes au téléphone : l'ordinateur et le tableau suivent ; rien ne recule au tableau */
  {
    const D1 = []; for (let k = 0; k < 2; k++) { await tap('suiv'); const r = await suivre(tl.pg, [['ord', o.pg, false], ['tab', T.pg, true]]); D1.push([r.r.ord, r.r.tab].join('/')); await p(250); }
    await garde(o.pg); await allerA(o.pg, QB); await toutDevoiler(o.pg, QB); await p(1500);
    let nh = await numDe(); const tq = Date.now(); while (nh[0] !== nh[1] && Date.now() - tq < 1500) { await p(50); nh = await numDe(); }
    dire('      ' + mode + ' · à « Question-bilan », la télécommande dit « ' + nh[0] + ' », le pilote « ' + nh[1] + ' »');
    verif(mode, nh[0] && nh[0] === nh[1], 'sur une diapo hors de l’heure, la télécommande dit ce que dit le pilote', nh);
    let desact = null; for (let k = 0; k < 30; k++) { const t = await texteDe(tl.pg, '#tc-bas .desact'); if (t && /Télécommande désactivée/.test(t)) { desact = t; break; } await p(100); }
    const grises = await tl.pg.evaluate(() => Array.from(document.querySelectorAll('#tc-bas button[data-a]')).filter(b => b.dataset.a !== 'main').map(b => b.disabled && /désactivée/.test(b.title)).every(Boolean)).catch(() => false);
    await capt(tl.pg, pre + '05a-telecommande-desactivee');
    const dits = await o.pg.$$('#mur .rep .dit'); const dit = dits.length ? dits[dits.length - 1] : null;
    const tabRep = t => T.pg.evaluate(t => { const m = (typeof DR_TAB === 'object' && DR_TAB.montre) || null; return !!(m && JSON.stringify(m.reps || {}).indexOf(t) >= 0); }, t).catch(() => false);
    const LT = []; let tape = ''; const vus = []; let recul = 0;
    const veille = { fini: false }; const vv = (async () => { while (!veille.fini) { const k = ((await tabDe(T.pg)) || {}).cle; if (k) { if (vus.length && k !== vus[vus.length - 1] && vus.includes(k)) recul++; if (!vus.length || vus[vus.length - 1] !== k) vus.push(k); } await p(40); } })();
    if (dit) { await dit.click(); await p(200);
      for (const c of 'Le paysage romantique') { await o.pg.keyboard.type(c); tape += c; const t0 = Date.now(); let ms = null; while (Date.now() - t0 < 1500) { if (await tabRep(tape.trimEnd().slice(-8))) { ms = Date.now() - t0; break; } await p(20); } LT.push(ms == null ? '∞' : ms); await p(110); } }
    await capt(o.pg, pre + '05b-ordinateur-reponse'); await capt(T.pg, pre + '05b-tableau-reponse');
    /* sans quitter le champ de l'ordinateur : « Reprendre avec la télécommande » */
    await tl.pg.locator('#tc-bas button[data-a="main"]').tap({ timeout: 2000 }).catch(() => tl.pg.evaluate(() => { const b = document.querySelector('#tc-bas button[data-a="main"]'); if (b) b.click(); }));
    let reprise = null, aMain = ''; const t3 = Date.now(); while (Date.now() - t3 < 2500) { const x = await o.pg.evaluate(() => ({ ed: !!(document.activeElement && document.activeElement.isContentEditable), m: ((document.getElementById('dr-ses-main') || {}).textContent || '') })).catch(() => ({})); const ok = await tl.pg.evaluate(t => JSON.stringify(parDiapo).indexOf(t) >= 0 && !document.querySelector('#tc-bas .desact'), 'Le paysage romantique').catch(() => false); if (!x.ed && /La télécommande a la main/.test(x.m) && ok) { reprise = Date.now() - t3; aMain = x.m; break; } await p(40); }
    await capt(o.pg, pre + '05c-ordinateur-telecommande-a-la-main'); await capt(tl.pg, pre + '05c-telecommande-reprise');
    const D2 = []; for (let k = 0; k < 3; k++) { await tap('suiv'); const r = await suivre(tl.pg, [['ord', o.pg, false], ['tab', T.pg, true]]); D2.push([r.r.ord, r.r.tab].join('/')); await p(250); }
    veille.fini = true; await vv;
    const rp = await tl.pg.evaluate(t => JSON.stringify(parDiapo).indexOf(t) >= 0, 'Le paysage romantique').catch(() => false);
    dire('      ' + mode + ' · le cas de Paul : deux gestes au téléphone (ordinateur/tableau, ms : ' + D1.join(' · ') + ') ; l’ordinateur va à la question : la télécommande « ' + desact + ' » (commandes grisées : ' + grises + ') ; il tape « Le paysage romantique » : chaque lettre au tableau en ' + LT.join(', ') + ' ms ; « Reprendre avec la télécommande » sans quitter le champ : ' + (reprise != null ? 'en ' + reprise + ' ms, l’ordinateur dit « ' + aMain + ' », la réponse entière au téléphone' : 'PAS REPRISE') + ' ; trois gestes au téléphone (' + D2.join(' · ') + ') ; le tableau est passé par ' + vus.length + ' états, revenu en arrière ' + recul + ' fois');
    await capt(tl.pg, pre + '05d-telecommande-apres');
    verif(mode, desact && grises, 'qui a la main : l’ordinateur agit, la télécommande dit « Télécommande désactivée : l’ordinateur a repris la main », ses commandes grisées disent pourquoi', { desact, grises });
    verif(mode, dit && LT.length === 21 && LT.every(x => x !== '∞' && x <= 500), 'le cas de Paul : chaque lettre tapée à l’ordinateur paraît au tableau en ≤ 0,5 s (' + LT.filter(x => x !== '∞' && x <= 500).length + ' / 21)', LT);
    verif(mode, reprise != null && rp, '« Reprendre avec la télécommande » : le champ de l’ordinateur se ferme tel qu’il est, « La télécommande a la main », la réponse entière au téléphone — rien de perdu', { reprise, aMain, rp });
    verif(mode, D1.concat(D2).every(x => x.split('/').every(y => y !== '' && +y <= 500)) && !recul, 'le cas de Paul : les gestes au téléphone avant et après, l’ordinateur et le tableau suivent (≤ 0,5 s) ; rien ne recule au tableau', { D1, D2, recul });
  }
  await clore(o.pg); let fin = null; for (let k = 0; k < 30; k++) { const a = await texteDe(tl.pg, '#tc-accueil'); if (/close/.test(a || '')) { fin = k * 100; break; } await p(100); }
  dire('      ' + mode + ' · « Clore l’heure » à l’ordinateur : la télécommande ' + (fin != null ? 'le dit en ' + fin + ' ms (« ' + (await texteDe(tl.pg, '#tc-accueil')) + ' »)' : 'NE LE DIT PAS (3 s)'));
  verif(mode, fin != null, 'l’heure close à l’ordinateur : la télécommande le dit', fin); await capt(tl.pg, pre + '06-telecommande-close');
  if (test) { const hors = ECR.filter(x => x.qui !== 'tableau' && !/^\/site\/tableau_test(\/|$)/.test(x.c)); verif(mode, !hors.length, 'en mode test, aucune écriture hors des chemins d’essai (' + hors.length + ' hors)', hors.slice(0, 5).map(x => x.m + ' ' + x.c)); }
  verif(mode, !REFUSES.length, 'aucune écriture refusée par le faux hub (' + REFUSES.length + ')', REFUSES.slice(0, 3));
  sansErreur(mode, [].concat(o.errs, o.boites, tl.errs, tl.boites, T.errs, T.boites), 'ordinateur, télécommande, tableau distant');
  await tl.ctx.close(); await T.ctx.close(); await o.ctx.close().catch(() => {}); };

/* ═══ R · la répétition (§3.5) : l'ordinateur la joue (l'Atelier, onglet Pilotage) ; le téléphone voit le bandeau, « Reprendre » ; ils se suivent ;
   « ■ Arrêter » à l'ordinateur : le téléphone s'arrête aussi, le tableau distant revient à l'horloge, plus de pointeur (hors mode test et en mode test) ═══ */
const repetition = async (fichier, mode, nomV) => { const test = mode === 'RT'; HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; const pre = 'session-' + nomV + '-' + mode + '-';
  dire('\n— la répétition, ' + (test ? 'en mode test' : 'hors mode test') + ' · ' + nomV + ' —');
  const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(800);
  const o = await ouvrir({ fichier, test, qui: 'ordinateur' }); await ouvrirAtelier(o); await o.pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(3500);
  const rep0 = await o.pg.evaluate(() => !!S.repetition); verif(mode, rep0, 'l’ordinateur joue la répétition (l’Atelier, onglet Pilotage)');
  for (let k = 0; k < 2; k++) { await gesteClic(o.pg); await p(400); } await p(800);
  const tl = await ouvrir({ fichier, test: false, qui: 'telephone', W: 390, H: 844, tel: true }); const bt = await attendreBandeau(tl.pg);
  dire('      ' + mode + ' · téléphone : bandeau ' + (bt.b ? 'en ' + bt.t + ' ms : « ' + bt.b + ' »' : 'ABSENT (6 s)')); await capt(tl.pg, pre + '01-telephone-bandeau');
  verif(mode, bt.b && /Répétition en cours/.test(bt.b) && bt.t <= 2000, 'le téléphone voit « Répétition en cours » en moins de 2 s', bt);
  if (bt.b) { await tl.pg.locator('#ses-reprise-oui').tap({ timeout: 3000 }).catch(() => tl.pg.click('#ses-reprise-oui').catch(() => {})); await p(6000); await garde(tl.pg); }
  const k0 = [await cleDe(o.pg), await cleDe(tl.pg)]; const r1 = await tl.pg.evaluate(() => !!S.repetition).catch(() => false);
  dire('      ' + mode + ' · téléphone, « Reprendre » : en répétition ' + r1 + ' · ordinateur ' + k0[0] + ' · téléphone ' + k0[1]);
  verif(mode, r1 && k0[0] && k0[0] === k0[1], 'le téléphone reprend la répétition là où elle en est', k0); await capt(tl.pg, pre + '02-telephone-repris');
  const D = { tel: [], ord: [], tab: [] };
  const mDe = pg => pg.evaluate(() => ({ id: DR_SES.id, main: DR_SES.main, ici: DR_SES.ici && DR_SES.ici.sig, envoi: (DR_SES.envoiTs || 0) % 1000000, recu: (DR_SES.recu || 0) % 1000000, recuCle: DR_SES.recuCle, att: DR_SES.attendrePremier, rej: DR_SES.rejoint, occ: dr_sesOccupe(), ae: document.activeElement && (document.activeElement.id || document.activeElement.tagName), mur: S.mur && (S.mur.eid || S.mur.di) + '#' + S.mur.nDev })).catch(e => String(e));
  if (process.env.MJPC_DEBUG) dire('      (débogage) avant : ordinateur ' + JSON.stringify(await mDe(o.pg)) + ' · téléphone ' + JSON.stringify(await mDe(tl.pg)));
  for (let k = 0; k < 6; k++) { const parTel = k % 2 === 0; if (parTel) await geste(tl.pg); else await gesteClic(o.pg); if (process.env.MJPC_DEBUG && k < 2) { await p(700); dire('      (débogage) après le geste ' + k + ' : ordinateur ' + JSON.stringify(await mDe(o.pg)) + ' · téléphone ' + JSON.stringify(await mDe(tl.pg))); } const r = await suivre(parTel ? tl.pg : o.pg, [[parTel ? 'ord' : 'tel', parTel ? o.pg : tl.pg, false], ['tab', T.pg, true]]);
    D[parTel ? 'ord' : 'tel'].push(r.r[parTel ? 'ord' : 'tel'] == null ? '∞' : r.r[parTel ? 'ord' : 'tel']); D.tab.push(r.r.tab == null ? '∞' : r.r.tab); await p(250); }
  dire('      ' + mode + ' · six gestes en alternance — ordinateur ' + D.ord.join(', ') + ' · téléphone ' + D.tel.join(', ') + ' · tableau distant ' + D.tab.join(', ') + ' ms');
  const tous = D.ord.concat(D.tel, D.tab); verif(mode, tous.every(x => x !== '∞' && x <= 500), 'en répétition, chaque geste paraît sur l’autre appareil et au tableau distant (≤ 0,5 s ; ' + tous.filter(x => x !== '∞' && x <= 500).length + ' / ' + tous.length + ')', D);
  await capt(o.pg, pre + '03-ordinateur-suit'); await capt(T.pg, pre + '03-tableau-suit');
  await o.pg.evaluate(() => { const b = document.getElementById('rep-stop'); if (b) b.click(); }); await p(3500);
  const r2 = await tl.pg.evaluate(() => !!S.repetition).catch(() => null); const tb = await tabDe(T.pg); const ptr = test ? lireH('/site/tableau_test/pointeur') : lireH('/site/repetition/pointeur');
  dire('      ' + mode + ' · « ■ Arrêter » à l’ordinateur : téléphone en répétition ' + r2 + ' · tableau distant ' + (tb && tb.attente ? 'à l’horloge' : 'sur ' + (tb && tb.cle)) + ' · pointeur ' + (ptr ? 'LÀ' : '—'));
  verif(mode, r2 === false && tb && tb.attente && !ptr, '« ■ Arrêter » sur un appareil : la répétition s’arrête partout, le tableau distant revient à l’horloge, plus de pointeur', { r2, tb, ptr: !!ptr });
  await capt(tl.pg, pre + '04-telephone-arrete'); await capt(T.pg, pre + '04-tableau-horloge');
  if (test) { const hors = ECR.filter(x => x.qui !== 'tableau' && !/^\/site\/tableau_test(\/|$)/.test(x.c)); verif(mode, !hors.length, 'en mode test, aucune écriture hors des chemins d’essai (' + hors.length + ' hors)', hors.slice(0, 5).map(x => x.m + ' ' + x.c)); }
  else { const cl = ECR.filter(x => /\/deroule_joue(\/|$)|^\/site\/cours_actif|^\/presence/.test(x.c)); const ch = [...new Set(ECR.filter(x => x.qui !== 'tableau').map(x => x.c))];
    dire('      ' + mode + ' · écritures au hub pendant la répétition : ' + ECR.length + ' — chemins : ' + ch.slice(0, 12).join(', ') + (ch.length > 12 ? '…' : ''));
    verif(mode, !cl.length, 'en répétition, rien d’écrit pour la classe : aucune écriture dans la copie de la classe, ni cours_actif, ni la présence (' + cl.length + ')', cl.slice(0, 5).map(x => x.m + ' ' + x.c)); }
  verif(mode, !REFUSES.length, 'aucune écriture refusée par le faux hub (' + REFUSES.length + ')', REFUSES.slice(0, 3));
  sansErreur(mode, [].concat(o.errs, o.boites, tl.errs, tl.boites, T.errs, T.boites), 'ordinateur, téléphone, tableau distant');
  await tl.ctx.close(); await T.ctx.close(); await o.ctx.close().catch(() => {}); };

/* ═══ A · le défaut 256 (Paul, 16:59) : une vraie heure ; pendant l'heure, deux absents cochés dans la case de l'emploi du temps (un second ordinateur) ; au pilote,
   le compteur passe à « n sur 27 présents » en moins de 16 s ; on clôt ; « Relire l'heure » : « Ce qui s'est passé » s'affiche sans erreur JS et nomme les deux absents ═══ */
const absents = async (fichier, mode, nomV) => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; const pre = 'session-' + nomV + '-' + mode + '-';
  dire('\n— le défaut 256, les absents de la case · ' + nomV + ' —');
  const o = await ouvrir({ fichier, qui: 'ordinateur' }); const lance = await lancerClasse(o); await garde(o.pg); for (let k = 0; k < 2; k++) { await gesteClic(o.pg); await p(300); }
  verif(mode, lance, 'l’ordinateur lance l’heure');
  const avant = await texteDe(o.pg, '#presents');
  const o2 = await ouvrir({ fichier, qui: 'ordinateur2', W: 1366, H: 768 });
  if (!(await clicTexte(o2.pg, 'button', 'edtOuvrir()'))) await o2.pg.evaluate(() => edtOuvrir()); await p(1500);
  await o2.pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (x) x.click(); }, '2026-09-14'); await p(1200);
  const noms = [];
  for (let k = 0; k < 2; k++) { const b = (await o2.pg.$$('.edt-el:not(.edt-el-abs)'))[k === 0 ? 1 : 4]; if (!b) break; noms.push(((await b.textContent()) || '').trim()); await b.click(); await p(900); }
  await capt(o2.pg, pre + '01-case-absents');
  const t0 = Date.now(); let apres = null; while (Date.now() - t0 < 17000) { const t = await texteDe(o.pg, '#presents'); if (t && /\b27\b/.test(t) && t !== avant) { apres = t; break; } await p(250); }
  const delai = Date.now() - t0;
  dire('      ' + mode + ' · deux absents cochés dans la case (' + noms.join(', ') + ') : le compteur du pilote « ' + avant + ' » → « ' + apres + ' » en ' + delai + ' ms');
  verif(mode, noms.length === 2 && apres && delai <= 16000, 'deux absents cochés dans la case pendant l’heure : au pilote, « n sur 27 présents » en moins de 16 s', { noms, avant, apres, delai });
  await capt(o.pg, pre + '02-pilote-compteur');
  await clore(o.pg); await p(1000);
  const rel = await clicTexte(o.pg, 'button', 'Relire l’heure') || await clicTexte(o.pg, 'button', "Relire l'heure"); await p(4000);
  const ong = await o.pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button.ong[data-f="passe"]')).find(x => x.offsetParent !== null); if (!b) return null; b.click(); return (b.innerText || '').trim(); }).catch(() => null); await p(1500);
  const fait = await o.pg.evaluate(() => { const r = document.getElementById('rel'); return ((r && r.offsetParent !== null ? r.innerText : document.body.innerText) || '').replace(/\s+/g, ' ').slice(0, 3000); }).catch(e => String(e));
  const cite = noms.every(n => { const pr = n.split(/\s+/).slice(-1)[0]; return fait.indexOf(pr) >= 0 || fait.indexOf(n) >= 0; });
  await capt(o.pg, pre + '03-relecture');
  dire('      ' + mode + ' · clos ; « Relire l’heure » ' + (rel ? 'ouvert' : 'PAS TROUVÉ') + ' ; l’onglet « ' + ong + ' » : « …' + (noms.map(n => { const pr = n.split(/\s+/).slice(-1)[0]; const i = fait.indexOf(pr); return i >= 0 ? fait.slice(Math.max(0, i - 40), i + 80) : '(' + pr + ' absent du texte)'; }).join(' … ')) + ' »');
  verif(mode, rel && ong && cite, '« Ce qui s’est passé » s’affiche et nomme les deux absents', { rel, ong, cite, noms });
  verif(mode, !REFUSES.length, 'aucune écriture refusée par le faux hub (' + REFUSES.length + ')', REFUSES.slice(0, 3));
  sansErreur(mode, [].concat(o.errs, o.boites, o2.errs, o2.boites), 'le pilote et le second ordinateur (la Relecture comprise)');
  await o2.ctx.close(); await o.ctx.close(); };

const NOMV = process.env.MJPC_NOM || 'v';
for (const m of ['T', 'H']) if (joue(m)) await parcours(FICHIER, m, NOMV);
for (const m of ['QH', 'QT']) if (joue(m)) await telecommande(FICHIER, m, NOMV);
for (const m of ['R', 'RT']) if (joue(m)) await repetition(FICHIER, m, NOMV);
if (joue('A')) await absents(FICHIER, 'A', NOMV);
dire('\n' + nb + ' vérifications, ' + echecs + ' échec(s)');
await nav.close();
fs.writeFileSync(path.join(OUT, 'sonde-session-' + NOMV + '.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);
