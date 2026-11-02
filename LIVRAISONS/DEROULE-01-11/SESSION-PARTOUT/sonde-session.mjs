// LA SONDE DE LA SESSION PARTOUT (MANDATS/DEROULE-01-11/MANDAT-SESSION-PARTOUT.md §5) — par le geste, sous le faux hub RANGÉ COMME LE VRAI, qui REFUSE
// (HTTP 400) les clés interdites, et qui POUSSE son flux (le flux REST de Firebase, `EventSource`, « put » à chaque écriture qui touche le chemin écouté).
// Le harnais : la partie haute de CORRECTIFS/sonde-correctifs.mjs (le faux hub, `ouvrir`, `lancerClasse`, `garde`, `texteDe`, `capt`), plus le flux et un
// téléphone (390 × 844, tactile). Aucune écriture ni lecture du vrai hub.
// usage : node sonde-session.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_PARTIES=T,H : T l'essai en mode test, H la vraie heure ; MJPC_CAPT=<dossier>)
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
const PARTIES = String(process.env.MJPC_PARTIES || 'T,H').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
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
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') return JSON.stringify(lireH(c)); let bd = null; try { bd = JSON.parse(corps || 'null'); } catch (e) {}
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
const ABOS = [];
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
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); const f = imageDe(u); if (f) return r.fulfill({ path: f, contentType: typeDe(f) }); return r.abort(); });
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(new Date(jour + 'T' + h + ':00+02:00'));
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
const toutDevoiler = async (pg, eid) => { await pg.click('#numero').catch(() => {}); for (let k = 0; k < 14; k++) { const s2 = await ici_(pg); if (s2.eid !== eid || /^(\d+) \/ \1 dévoilés|rien à dévoiler|vidéo/.test(s2.compte)) break; await pg.keyboard.press('ArrowRight'); await p(300); } await p(900); };
const sansErreur = (k, errs, quoi) => verif(k, !errs.length, quoi + ' : aucune erreur JS, aucune boîte système', errs.join(' ; '));
const texteDe = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); return m ? (m.innerText || '').replace(/\s+/g, ' ').trim() : null; }, sel).catch(() => null) : Promise.resolve(null);
const temoins = pg => pg.evaluate(() => { const s = document.getElementById('dr-session'); const b = document.getElementById('mjpc-echecs-bandeau');
  return { session: s ? s.textContent.trim() : null, sessionKo: !!(s && s.classList.contains('dr-session-ko')), bandeau: !!(b && b.style.display !== 'none' && b.classList.contains('mjpc-bandeau-echec')), bandeauT: b ? (b.innerText || '').replace(/\s+/g, ' ').slice(0, 160) : '' }; });
/* écrire en direct dans un texte de la diapo du pilote : un clic, la fin du texte, la frappe, Échap */
const corriger = async (pg, sel, ajout) => { const x = await pg.$('#mur ' + sel); if (!x) return false; await x.click(); await p(300); await pg.keyboard.press('Control+End'); await pg.keyboard.type(ajout, { delay: 20 }); await p(300); await pg.keyboard.press('Escape'); await p(400); return true; };
/* attendre qu'une condition tienne (jusqu'à `ms`) */
const attendre = async (f, ms = 6000) => { const t0 = Date.now(); let v = null; while (Date.now() - t0 < ms) { v = await f(); if (v) return v; await p(300); } return v; };

/* ═══ le parcours ═══ */
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
    D[parTel ? 'ord' : 'tel'].push(a == null ? '∞' : a); D.tab.push(b == null ? '∞' : b); await p(250); }
  dire('      ' + mode + ' · dix gestes en alternance (téléphone, ordinateur…) — l’autre pilote suit en (ms) : ordinateur ' + D.ord.join(', ') + ' · téléphone ' + D.tel.join(', ') + ' · tableau distant ' + D.tab.join(', '));
  const tous = D.ord.concat(D.tel, D.tab); verif(mode, !manques && tous.every(x => x !== '∞' && x <= 500), 'chaque geste paraît sur l’autre pilote et au tableau distant en ≤ 0,5 s (' + tous.filter(x => x !== '∞' && x <= 500).length + ' / ' + tous.length + ')', { max: Math.max(...tous.map(x => x === '∞' ? 99999 : x)) });
  await capt(tl.pg, pre + '05-telephone-pilote'); await capt(o.pg, pre + '05-ordinateur-suit'); await capt(T.pg, pre + '05-tableau-suit');
  /* deux gestes presque en même temps */
  await Promise.all([geste(tl.pg), gesteClic(o.pg)]); await p(1500);
  const kk = [await cleDe(o.pg), await cleDe(tl.pg), ((await tabDe(T.pg)) || {}).cle];
  dire('      ' + mode + ' · deux gestes presque en même temps : ordinateur ' + kk[0] + ' · téléphone ' + kk[1] + ' · tableau ' + kk[2]);
  verif(mode, kk[0] && kk[0] === kk[1] && kk[1] === kk[2], 'deux gestes presque en même temps : les deux pilotes et le tableau distant d’accord', kk);
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
const NOMV = process.env.MJPC_NOM || 'v';
for (const m of ['T', 'H']) if (joue(m)) await parcours(FICHIER, m, NOMV);
dire('\n' + nb + ' vérifications, ' + echecs + ' échec(s)');
await nav.close();
fs.writeFileSync(path.join(OUT, 'sonde-session-' + NOMV + '.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);
