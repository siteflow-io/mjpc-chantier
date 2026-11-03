// LA SONDE DES CORRECTIFS (MANDATS/DEROULE-01-11/MANDAT-CORRECTIFS.md §5.1) — par le geste, sous le faux hub RANGÉ COMME LE VRAI, qui REFUSE (HTTP 400)
// toute clé qui porte . # $ [ ] / (ou vide, ou un caractère de contrôle), à chaque niveau du corps écrit, en PUT et en PATCH (les clés de tête d'un PATCH
// sont des chemins : leurs morceaux sont vérifiés), et tout morceau d'adresse qui en porte. Le modèle : DERNIERES-DETTES/sonde-fin.mjs (le faux hub vit dans
// la sonde, tous les navigateurs le partagent : le pilote, sa fenêtre du tableau, le tableau distant `?vue=tableau`, l'Atelier). Aucune écriture ni lecture
// du vrai hub : chaque adresse Firebase est servie par la sonde, tout le reste est coupé.
// usage : node sonde-correctifs.mjs <assemble/index.html> [dossier-de-sortie]
//   MJPC_PARTIES (défaut A,B,C,J,R,L) · MJPC_MEDIAS=<dossier> : les vraies images du chapitre (jamais poussées) · MJPC_CAPT=<dossier> : les captures
//   (jamais poussées) · MJPC_TAILLES (défaut 1366x768,1536x864,1920x1080, partie L).
//  A · (㉘) une vraie heure lancée par la case de l'emploi du temps (3E Charles de Gaulle, 14/09, la séance 1 du chapitre « Poésie et peinture au XIXe
//      siècle »), la fenêtre du tableau et le tableau distant ouverts : Paul corrige en direct, au pilote, la question d'un bloc question, puis une consigne,
//      puis un titre ; après chacune, la correction lue au pilote, à la fenêtre du tableau, au tableau distant, dans « Le tableau, en ce moment » ; aucune
//      écriture refusée (comptées), le témoin « ● session » sans « coupée », pas de bandeau d'enregistrements perdus ; F5 puis « Reprendre » : la correction
//      là ; « Clore l'heure », « Relire l'heure » : la Relecture et le récit la disent. Le même en mode test (l'image du tableau, `/site/tableau_test`).
//      Et une scène écrite avant (ses clés jamais échappées) se relit telle quelle au tableau distant.
//  B · (㉙) dans l'Atelier, un clic dans la question d'un bloc question, la frappe : le texte enregistré est exactement ce que Paul a tapé (aucun mot de la
//      barre du bloc) ; une diapo déjà salie (écrite au faux hub avec les mots de la barre) : « À régler » le dit (ce qui est en trop, où).
//  C · (㉛) le récit d'une première séance jouée (présentation du chapitre, problématique, …) : la problématique une fois, « question » ne la désigne pas ;
//      la problématique retirée de la séance : « et sa problématique : « … » » ; la feuille sommaire, l'Atelier, l'aide « ? » : « problématique ».
//  J · (㉜) en classe (vraie heure, mode test) et en répétition, le tableau des cinq œuvres avec « Ce que j'en retiens » (3 pages, « tout ensemble ») :
//      → → → montre la page 2, la page 3, puis la diapo suivante ; ← ← revient à la page 3 puis à la 2 ; au pilote, à la fenêtre du tableau, au tableau
//      distant ; avec dévoilement (un à un), l'ordre de dévoilement reste maître.
//  R · (㉝) « À régler » : le tableau en pages (il tient en pages) : rien ; une carte qui ne tient pas : « Couper le schéma » ; un tableau avec une vraie case
//      coupée : la ligne dit la page, la rangée, la case et le geste.
//  L · (⑭) « L'Albatros » en entier dans une case, aux trois tailles, au pilote, à la fenêtre du tableau, au tableau distant, dans l'Atelier : chaque ligne du
//      poème vue une fois, entière, sur une page ; aucune ligne coupée en deux ; l'en-tête à la même place sur chaque page ; « À régler » ne la signale pas.
// Aucune erreur JS, aucune boîte système, dans chaque cas. Code 1 si un échec.
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
const PARTIES = String(process.env.MJPC_PARTIES || 'A,B,C,J,R,L,K').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
dire('C16 · sonde des correctifs · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400) · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

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
  ECR.push({ qui, m, c, t: Date.now(), bd });
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => /^§400§/.test(t) ? new Response(t.slice(5), { status: 400 }) : new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const imageDe = u => { const m = /mjpc-medias\/(.*\/)?([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (!m) return null; if (MEDIAS) { const f = path.join(MEDIAS, m[2]); if (fs.existsSync(f)) return f; } return IMG_OUV[m[2]] || IMG_DEFAUT; };
const typeDe = f => /\.webp$/i.test(f) ? 'image/webp' : /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async ({ qui = 'pilote', fichier = FICHIER, W = 1536, H = 864, q = '?n=3e', test = false, prof = true, h = '09:00', jour = '2026-09-14' }) => {
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
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

const lignesSur = (t, re) => t.split(/(?=Schéma « |Tableau « |Diapo « |Diapo trop pleine|Des mots de l’écran)/).filter(x => re.test(x) && !/sans numéro d’activité|sans numéro d'activité/.test(x)).map(x => x.slice(0, 420));
/* ═══ A · (㉘) la correction en direct, refusée par le vrai hub ═══ */
const QB = 'emt9v3yqo6pvd5', AN = 'emt9v3yqoecf9d';   /* « Question-bilan » (un bloc question) ; « Analyse d'images : la routine » (une consigne) */
const CORR = [
  { n: 'la question du bloc question « Question-bilan »', eid: QB, sel: 'p.q[data-p$=".t"]', ajout: ' Pensez au Romantisme.', voir: 'Pensez au Romantisme.' },
  { n: 'la consigne d’« Analyse d’images : la routine »', eid: AN, sel: '.bloc [data-p="0.t"]', ajout: ' (par groupes de trois)', voir: '(par groupes de trois)' },
  { n: 'le titre de « Question-bilan »', eid: QB, sel: '[data-p="-1.act"]', ajout: ' du lundi', voir: 'Question-bilan du lundi' } ];
const jouerA = async (fichier, mode) => { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; const test = mode === 'test'; const out = { corr: [], errs: [] };
  const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1200);
  const o = await ouvrir({ fichier, test }); out.lance = await lancerClasse(o); const fen = await ouvrirTableau(o);
  if (((await texteDe(o.pg, '#vue-titre')) || '') !== 'Le tableau, en ce moment') { await o.pg.click('#btableau').catch(() => {}); await p(600); }   /* « Le tableau, en ce moment », à droite */
  for (const c of CORR) { const r = { n: c.n };
    r.aller = await allerA(o.pg, c.eid); await toutDevoiler(o.pg, c.eid); const k0 = REFUSES.length;
    r.ecrit = await corriger(o.pg, c.sel, c.ajout); await p(2600);
    r.pilote = (await texteDe(o.pg, '#mur')) || ''; r.fen = (await texteDe(fen, '#mur2')) || '';
    r.distant = (await attendre(async () => { const t = await texteDe(T.pg, 'body'); return t && t.toLowerCase().indexOf(c.voir.toLowerCase()) >= 0 ? t : null; }, 6000)) || (await texteDe(T.pg, 'body')) || '';
    r.vueTitre = (await texteDe(o.pg, '#vue-titre')) || ''; r.moment = (/en ce moment/i.test(r.vueTitre) ? (await texteDe(o.pg, '#vue-mini')) : '') || ''; r.refus = REFUSES.slice(k0).map(x => x.m + ' ' + x.c + ' (' + x.ko + ')'); r.temoins = await temoins(o.pg);
    await capt(o.pg, 'A-' + mode + '-' + out.corr.length + '-pilote'); if (fen) await capt(fen, 'A-' + mode + '-' + out.corr.length + '-tableau'); await capt(T.pg, 'A-' + mode + '-' + out.corr.length + '-distant');
    const a_ = x => x.toLowerCase().indexOf(c.voir.toLowerCase()) >= 0;   /* le titre s'affiche en capitales (text-transform) */
    r.vu = { pilote: a_(r.pilote), fen: a_(r.fen), distant: a_(r.distant), moment: a_(r.moment) }; out.corr.push(r); }
  out.refusTous = REFUSES.map(x => x.m + ' ' + x.c + ' (' + x.ko + ')'); out.temoins = await temoins(o.pg);
  if (!test) {   /* F5 puis « Reprendre » ; puis « Clore l'heure » et « Relire l'heure » */
    await o.pg.reload({ waitUntil: 'load', timeout: 20000 }).catch(() => {}); await p(1800); await profPrep(o.pg, false); out.repris = await reprendre(o); await p(1200);
    out.apresF5 = {}; for (const c of CORR) { await allerA(o.pg, c.eid); await p(900); const t = (await texteDe(o.pg, '#mur')) || ''; out.apresF5[c.voir] = t.toLowerCase().indexOf(c.voir.toLowerCase()) >= 0; }
    await capt(o.pg, 'A-' + mode + '-apres-F5');
    const k1 = REFUSES.length; await o.pg.evaluate(() => document.getElementById('dr-clore').click()).catch(() => {}); await p(900);
    await o.pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }); await p(600);
    await o.pg.evaluate(() => { const g = document.getElementById('garde-clore'); if (g && g.classList.contains('on')) document.getElementById('gclore-oui').click(); }); await p(2500); await garde(o.pg);
    out.close = await o.pg.evaluate(() => !!(S.lancee && S.close)); await o.pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(o.pg);
    out.relecture = (await texteDe(o.pg, '#ecran-relecture')) || ''; await capt(o.pg, 'A-' + mode + '-relecture');
    out.refusCloture = REFUSES.slice(k1).map(x => x.m + ' ' + x.c + ' (' + x.ko + ')');
    const C = lireH('/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule_joue') || {}; const k = Object.keys(C)[0]; out.etatHub = JSON.stringify(((C[k] || {}).etat || {}).S || {}).slice(0, 4000);
    out.recitHub = JSON.stringify((C[k] || {}).recit || {}).slice(0, 2000); }
  out.errs = o.errs.concat(o.boites, T.errs, T.boites); await o.ctx.close(); await T.ctx.close(); return out; };
if (joue('A')) { dire(''); dire('══ A · (㉘) 1536×864 · la correction en direct : la question d’un bloc question, une consigne, un titre — au faux hub qui refuse les clés interdites ══');
  for (const [mode, nomM] of [['classe', 'une vraie heure (faux hub)'], ['test', 'en mode test (l’image du tableau, /site/tableau_test)']]) { const r = await jouerA(FICHIER, mode);
    verif('A', r.lance, nomM + ' : l’heure se lance par la case de l’emploi du temps (« ▶ Ouvrir le pilotage et lancer »)');
    for (const c of r.corr) {
      dire('      A · ' + nomM + ' · ' + c.n + ' : pilote « …' + (c.pilote.slice(Math.max(0, c.pilote.indexOf(CORR.find(x => x.n === c.n).voir) - 60), c.pilote.indexOf(CORR.find(x => x.n === c.n).voir) + 40)) + '… » · témoin « ' + c.temoins.session + ' » · à droite « ' + c.vueTitre + ' » : « ' + (c.moment || '').slice(0, 80) + ' »' + (c.refus.length ? ' · refus : ' + c.refus.join(' ; ') : ''));
      verif('A', c.aller && c.ecrit, nomM + ' · ' + c.n + ' : Paul clique dans le texte, au pilote, et écrit');
      verif('A', c.vu.pilote && c.vu.fen && c.vu.distant && c.vu.moment, nomM + ' · ' + c.n + ' : la correction au pilote, à la fenêtre du tableau, au tableau distant, dans « Le tableau, en ce moment »', c.vu);
      verif('A', !c.refus.length, nomM + ' · ' + c.n + ' : aucune écriture refusée par le hub (' + c.refus.length + ')', c.refus.slice(0, 4));
      verif('A', !c.temoins.sessionKo && /^● session$/.test(c.temoins.session || '') && !c.temoins.bandeau, nomM + ' · ' + c.n + ' : le témoin « ● session » (pas « coupée »), aucun bandeau d’enregistrements perdus', c.temoins); }
    verif('A', !r.refusTous.length, nomM + ' : sur tout le parcours, ' + r.refusTous.length + ' écriture(s) refusée(s) par le hub', r.refusTous.slice(0, 6));
    if (mode === 'classe') { const iq = r.relecture.indexOf('Question-bilan'); dire('      A · la Relecture (' + r.relecture.length + ' signes) : « …' + r.relecture.slice(Math.max(0, r.relecture.indexOf('on a posé la question') - 40), r.relecture.indexOf('on a posé la question') + 200) + '… »');
      verif('A', r.repris && Object.values(r.apresF5).every(Boolean), nomM + ' : F5 puis « Reprendre » — les trois corrections toujours là, au pilote', r.apresF5);
      verif('A', r.close && r.relecture.indexOf('Pensez au Romantisme') >= 0 && r.relecture.indexOf('ÉLÉMENT') < 0, nomM + ' : « Clore l’heure », « Relire l’heure » : la Relecture (le récit) dit la question corrigée', r.relecture.slice(0, 600));
      verif('A', /Pensez au Romantisme\./.test(r.etatHub) && /par groupes de trois/.test(r.etatHub) && /Question-bilan du lundi/.test(r.etatHub), nomM + ' : au hub, l’état de l’heure garde les trois corrections (la copie de la classe)', r.etatHub.slice(0, 300));
      verif('A', !r.refusCloture.length, nomM + ' : la clôture, aucune écriture refusée', r.refusCloture); }
    sansErreur('A', r.errs, nomM); }
  /* une scène écrite avant le correctif (ses clés jamais échappées : un faux hub qui les aurait gardées) se relit telle quelle au tableau distant */
  HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; { const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1200); const o = await ouvrir({}); await lancerClasse(o); await allerA(o.pg, QB); await toutDevoiler(o.pg, QB); await p(1500);
    const C = '/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule_joue/'; const slug = Object.keys(lireH(C) || {})[0]; const sc = lireH(C + slug + '/scene');
    const brut = sc ? JSON.parse(JSON.stringify(sc)) : null; if (brut) { brut.textes = Object.assign({}, brut.textes || {}); delete brut.textes['0%2et']; brut.textes['0.t'] = 'Une scène d’avant, relue telle quelle.'; brut.ts = Date.now() + 1000; const n = HUBN.site['3e'].chapitres[0].seances[sk0(HUBN)[0]].deroule_joue[slug]; n.scene = brut; }
    const vu = await attendre(async () => { const t = await texteDe(T.pg, 'body'); return t && t.indexOf('Une scène d’avant, relue telle quelle.') >= 0 ? t : null; }, 6000);
    verif('A', !!brut && !!vu, 'une scène écrite avant (la clé « 0.t » jamais échappée, posée telle quelle au hub) : le tableau distant la lit telle quelle');
    sansErreur('A', o.errs.concat(o.boites, T.errs, T.boites), 'la scène d’avant'); await o.ctx.close(); await T.ctx.close(); } }


/* ═══ B · (㉙) aucun mot de l'interface n'entre dans un texte de Paul ═══ */
const BARRE = 'BLOC 1 · QUESTION · 1 ÉLÉMENT▲▼+ étape✕';
const trameQB = () => { const k = sk0(HUBN)[0]; const E = (lireH('/site/3e/chapitres/0/seances/' + k + '/deroule') || {}).ecrans || []; const L = Array.isArray(E) ? E : Object.values(E); const e = L.find(x => x && x.eid === QB) || {}; const b = (e.blocs || [])[0] || {}; return String(b.txt != null ? b.txt : (b.q || '')); };
const allerAtelier = async (pg, re) => { const L = await lignesX(pg); const y = L.find(e => re.test(e.t)); if (!y) return false; await (await pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(1200); return true; };
const aRegler = async pg => { await pg.click('#at-regler').catch(() => {}); await p(1800); const t = await pg.evaluate(() => { const z = Array.from(document.querySelectorAll('.choix-obj, #at-regler-liste, .at-regler, [id*="regler"]')).filter(x => x.offsetParent !== null).map(x => x.innerText || '').join(' ‖ '); return z.replace(/\s+/g, ' '); }); await pg.keyboard.press('Escape').catch(() => {}); await p(300); return t; };
if (joue('B')) { dire(''); dire('══ B · (㉙) 1536×864 · l’Atelier : la question d’un bloc question écrite au clavier ; une diapo déjà salie dans « À régler » ══');
  HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; { const o = await ouvrir({}); await ouvrirAtelier(o); const pg = o.pg; const ok = await allerAtelier(pg, /Question-bilan$/); const avant = trameQB();
    const q = await pg.$('#mur p.q[data-p$=".t"]'); let tape = false; if (q) { await q.click(); await p(500); await pg.keyboard.press('End'); await pg.keyboard.type(' Et vous ?', { delay: 25 }); await p(3500); tape = true; }
    const barreDans = await pg.evaluate(() => { const q = document.querySelector('#mur p.q[data-p$=".t"]'); return !!(q && q.querySelector('.bloc-barre')); }); const barreVue = await pg.evaluate(() => !!document.querySelector('#mur .bloc-barre'));
    await pg.keyboard.press('Escape').catch(() => {}); await pg.mouse.click(5, 5).catch(() => {}); await p(2500); const apres = trameQB(); const ecran = (await texteDe(pg, '#mur')) || ''; await capt(pg, 'B-atelier-question');
    dire('      B · avant « ' + avant + ' » · après, au hub : « ' + apres + ' »');
    verif('B', ok && tape, 'dans l’Atelier, « Question-bilan » : un clic dans sa question, la fin du texte, la frappe « Et vous ? »');
    verif('B', !barreDans && barreVue, 'la barre du bloc paraît (au-dessus du bloc) mais jamais DANS le texte de la question', { dansLaQuestion: barreDans, barreVue });
    verif('B', apres === avant + ' Et vous ?', 'le texte enregistré au hub est exactement ce que Paul a tapé (aucun mot de la barre)', { attendu: avant + ' Et vous ?', lu: apres });
    verif('B', ecran.indexOf('ÉLÉMENT▲▼') < 0 && ecran.indexOf(avant + ' Et vous ?') >= 0, 'la diapo de l’Atelier montre la question telle qu’écrite', ecran.slice(0, 200));
    sansErreur('B', o.errs.concat(o.boites), 'l’Atelier, la frappe'); await o.ctx.close(); }
  /* une diapo déjà salie au hub (écrite avant le correctif) : « À régler » le dit */
  HUBN = ranger(store(null, E => { const e = E.find(x => x && x.eid === QB); if (e) { const b = e.blocs[0]; if (b.q != null) b.q = b.q + ' ' + BARRE; else b.txt = (b.txt || '') + ' ' + BARRE; } })) || {}; ECR = []; REFUSES.length = 0;
  { const o = await ouvrir({}); await ouvrirAtelier(o); const pg = o.pg; await allerAtelier(pg, /Question-bilan/); const t = await aRegler(pg); await capt(pg, 'B-a-regler-salie'); const lu = trameQB();
    dire('      B · « À régler » : ' + (lignesSur(t, /mots de l’écran/).join(' ‖ ') || 'rien sur les mots de l’écran').slice(0, 500));
    verif('B', /Des mots de l’écran sont entrés dans la question : « BLOC 1 · QUESTION · 1 ÉLÉMENT▲▼\+ étape✕ »/.test(t) && /Question-bilan/.test(t), '« À régler » dit ce qui est en trop (« BLOC 1 · QUESTION · 1 ÉLÉMENT▲▼+ étape✕ ») et où (« Question-bilan », la question)', t.slice(0, 300));
    verif('B', lu.indexOf(BARRE) >= 0, 'le texte sali n’est pas réparé en silence (au hub, il garde ces mots : Paul les efface lui-même)', lu);
    sansErreur('B', o.errs.concat(o.boites), 'l’Atelier, la diapo salie'); await o.ctx.close(); } }

/* ═══ C · (㉛) la problématique se dit une fois, sous ce nom ═══ */
const PROB = 'Du sonnet au poème en prose : comment les poètes et les peintres du XIXe siècle héritent-ils des règles classiques, et comment s’en libèrent-ils ?';
const recitDe = async (retouche, nom) => { HUBN = ranger(store(null, retouche)) || {}; ECR = []; REFUSES.length = 0; const o = await ouvrir({}); await lancerClasse(o); await o.pg.click('#numero').catch(() => {});
  const vus = []; for (let k = 0; k < 40; k++) { const s2 = await ici_(o.pg); const L = await eidsDe(o.pg); const x = L.find(e => e.eid === s2.eid) || {}; vus.push(x.role || x.act); if (x.act === 'Tableau 1') break; await o.pg.keyboard.press('ArrowRight'); await p(350); }
  await p(1200); await o.pg.evaluate(() => document.getElementById('dr-clore').click()).catch(() => {}); await p(900); await o.pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }); await p(600);
  await o.pg.evaluate(() => { const g = document.getElementById('garde-clore'); if (g && g.classList.contains('on')) document.getElementById('gclore-oui').click(); }); await p(2500); await garde(o.pg);
  await o.pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(o.pg);
  const t = (await texteDe(o.pg, '#ecran-relecture')) || ''; await capt(o.pg, 'C-' + nom + '-relecture'); const errs = o.errs.concat(o.boites); await o.ctx.close(); return { t, vus: [...new Set(vus)], errs }; };
const compte = (t, x) => t.split(x).length - 1;
if (joue('C')) { dire(''); dire('══ C · (㉛) 1536×864 · le récit d’une première séance : la problématique une fois, sous ce nom ══');
  const r1 = await recitDe(null, 'avec'); const P = PROB.replace(/\s*\?$/, ' ?'); const i1 = r1.t.indexOf('on a ouvert le chapitre');
  dire('      C · diapos jouées : ' + r1.vus.join(', ')); dire('      C · le récit : « ' + r1.t.slice(Math.max(0, i1 - 20), i1 + 520) + ' »');
  verif('C', r1.vus.includes('presentation-chapitre') && r1.vus.includes('problematique'), 'la première séance jouée : la présentation du chapitre, puis « Notre problématique »', r1.vus);
  verif('C', compte(r1.t, 'comment les poètes et les peintres du XIXe siècle') === 1 && /on a lu notre problématique : « Du sonnet au poème en prose/.test(r1.t), 'le récit dit la problématique une fois (« on a lu notre problématique : « … » »)', { fois: compte(r1.t, 'comment les poètes et les peintres du XIXe siècle') });
  verif('C', /on a ouvert le chapitre (<b>)?[^,.]*Poésie et peinture/.test(r1.t) && !/et sa (question|problématique)/.test(r1.t) && !/sa question|notre question|la question du chapitre/i.test(r1.t), 'la présentation ne dit que le chapitre ; « question » ne désigne jamais la problématique', r1.t.slice(Math.max(0, i1), i1 + 200));
  sansErreur('C', r1.errs, 'la séance avec sa problématique');
  const r2 = await recitDe(E => { }, 'retiree-prep');   /* témoin : rien de retiré */
  const r3 = await (async () => { const st0 = store(); const k = sk0(st0)[0]; return recitDe((E, st) => { const d = st.site['3e'].chapitres[0].seances[k].deroule; d.retraits = ['problematique']; }, 'retiree'); })();
  const i3 = r3.t.indexOf('on a ouvert le chapitre'); dire('      C · la problématique retirée · diapos jouées : ' + r3.vus.join(', ') + ' · le récit : « ' + r3.t.slice(Math.max(0, i3), i3 + 400) + ' »');
  verif('C', !r3.vus.includes('problematique') && /on a ouvert le chapitre (<b>)?[^,]*Poésie et peinture[^,]*, et sa problématique : « Du sonnet au poème en prose/.test(r3.t) && compte(r3.t, 'comment les poètes et les peintres du XIXe siècle') === 1, 'la problématique retirée de la séance : la présentation dit « et sa problématique : « … » », une fois', r3.t.slice(Math.max(0, i3), i3 + 300));
  sansErreur('C', r3.errs.concat(r2.errs), 'la séance sans sa problématique'); }

/* ═══ J · (㉜) en jeu, → ne quitte jamais une diapo dont une page n'a pas été montrée ═══ */
const RETIENS = 'Tableau | Peintre | Ce qu’on voit | Ce que j’en retiens\n'
  + 'Le Radeau de la Méduse (1819) | Théodore Géricault | des naufragés perdus sur une mer immense | Le peintre montre l’homme écrasé par la nature. La mer prend toute la place.\n'
  + 'Le lac (1863) | Albert Bierstadt | des montagnes immenses dans une lumière dorée | La nature est plus grande que tout : l’homme y paraît minuscule.\n'
  + 'Pêcheurs en mer (1796) | William Turner | une barque prise dans la tempête, la nuit | La lumière de la lune et la tempête disent la peur des pêcheurs.\n'
  + 'Cathédrale gothique au bord de l’eau (1813) | Karl Friedrich Schinkel | une cathédrale au soleil couchant | Le peintre mêle le rêve et le passé : la cathédrale paraît sortir d’un songe.\n'
  + 'Le Voyageur contemplant une mer de nuages (1818) | Caspar David Friedrich | un homme seul, de dos, face aux nuages | Le voyageur nous tourne le dos : nous regardons avec lui, et nous ressentons ce qu’il ressent.';
const vueJ = async (pg, sel) => pg ? pg.evaluate(sel => { const m = sel === 'body' ? (document.querySelector('.mur.tableau') || document.querySelector('.mur')) : document.querySelector(sel); if (!m) return null; const a = m.querySelector('.act'); const pgT = m.querySelector('.page');
  return { act: a ? a.textContent.trim().slice(0, 40) : '', page: pgT ? pgT.textContent.replace(/[‹›]/g, '').trim() : '' }; }, sel).catch(() => null) : null;
const jouerJ = async (mode, unAUn) => { HUBN = ranger(store(RETIENS, unAUn ? (E => { const t = E.find(e => e && e.act === 'Les cinq tableaux'); if (t) t.blocs[0].devoilerTout = false; }) : null)) || {}; ECR = []; REFUSES.length = 0;
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1536, H: 864, prof: false }); await p(1200); const o = await ouvrir({ test: mode === 'test' }); let fen = null;
  if (mode === 'repetition') { await ouvrirAtelier(o); await allerAtelier(o.pg, /Les cinq tableaux/); await o.pg.click('#at-jouer').catch(() => {}); await p(2500); fen = await ouvrirTableau(o, 1536, 864); }
  else { await lancerClasse(o); fen = await ouvrirTableau(o, 1536, 864); const v = await o.pg.$('#volet .vig:has(table.p8-grille)'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); await garde(o.pg); } }
  await o.pg.click('#numero').catch(() => {}); await p(1500);
  const lire = async () => { await p(1600); return { a: await vueJ(o.pg, '#mur'), b: await vueJ(fen, '#mur2'), c: await vueJ(T.pg, 'body'), compte: (await ici_(o.pg)).compte }; };
  const suite = [await lire()]; const touches = unAUn ? Array(9).fill('ArrowRight') : ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft', 'ArrowLeft'];
  for (const k of touches) { await o.pg.keyboard.press(k); await garde(o.pg); suite.push(Object.assign({ k }, await lire())); if (unAUn && suite[suite.length - 1].a && !/cinq tableaux/i.test(suite[suite.length - 1].a.act)) break; }
  await capt(o.pg, 'J-' + mode + (unAUn ? '-unaun' : '') + '-pilote'); const errs = o.errs.concat(o.boites, T.errs, T.boites); await o.ctx.close(); await T.ctx.close(); return { suite, errs }; };
const ligneJ = x => (x.k ? (x.k === 'ArrowRight' ? '→ ' : '← ') : 'départ ') + (x.a ? '« ' + x.a.act + ' » ' + x.a.page : '—') + ' │ tableau ' + (x.b ? x.b.page || '« ' + x.b.act + ' »' : '—') + ' │ distant ' + (x.c ? x.c.page || '« ' + x.c.act + ' »' : '—') + ' · ' + x.compte;
const memePage = x => !!x.a && !!x.b && !!x.c && x.a.page === x.b.page && x.a.page === x.c.page && x.a.act === x.b.act && x.a.act === x.c.act;
if (joue('J')) { dire(''); dire('══ J · (㉜) 1536×864 · le tableau des cinq œuvres avec « Ce que j’en retiens » (3 pages) : → et ← en jeu ══');
  for (const [mode, nomM] of [['classe', 'en classe, une vraie heure (faux hub)'], ['test', 'en classe, mode test'], ['repetition', 'en répétition']]) { const r = await jouerJ(mode, false); const S0 = r.suite;
    S0.forEach(x => dire('      J · ' + nomM + ' · ' + ligneJ(x)));
    const pg = i => (S0[i] && S0[i].a) ? S0[i].a.page : ''; const act = i => (S0[i] && S0[i].a) ? S0[i].a.act : '';
    verif('J', /page 1 \/ 3/.test(pg(0)) && /page 2 \/ 3/.test(pg(1)) && /page 3 \/ 3/.test(pg(2)) && /cinq tableaux/i.test(act(2)) && !/cinq tableaux/i.test(act(3)), nomM + ' : → → → montre la page 2, la page 3, puis la diapo suivante (« ' + act(3) + ' »)', S0.slice(0, 4).map(x => x.a));
    verif('J', /cinq tableaux/i.test(act(4)) && /page 3 \/ 3/.test(pg(4)) && /page 2 \/ 3/.test(pg(5)), nomM + ' : ← ← revient au tableau, à sa page 3, puis à la page 2', S0.slice(4).map(x => x.a));
    verif('J', S0.every(memePage), nomM + ' : à chaque geste, la même diapo et la même page au pilote, à la fenêtre du tableau et au tableau distant', S0.filter(x => !memePage(x)).map(ligneJ));
    sansErreur('J', r.errs, nomM); }
  /* avec dévoilement (un à un) : l'ordre de dévoilement reste maître */
  { const r = await jouerJ('classe', true); const S0 = r.suite; S0.forEach(x => dire('      J · un à un · ' + ligneJ(x)));
    const pages = S0.filter(x => x.a && /cinq tableaux/i.test(x.a.act)).map(x => +((/page (\d+)/.exec(x.a.page) || [])[1] || 1)); const fin = S0[S0.length - 1];
    verif('J', pages.every((v, i) => !i || v >= pages[i - 1]) && pages.includes(3) && S0.slice(0, -1).every(x => /dévoilé|dévoilés/.test(x.compte) || /cinq tableaux/i.test(x.a.act)) && fin.a && !/cinq tableaux/i.test(fin.a.act) && pages[pages.length - 1] === 3, 'un à un : chaque → dévoile la rangée suivante, la page suit la rangée (' + pages.join(' → ') + '), puis la diapo suivante — l’ordre de dévoilement inchangé', S0.map(x => (x.a || {}).page + ' ' + x.compte));
    verif('J', S0.every(memePage), 'un à un : le pilote, la fenêtre du tableau et le tableau distant ensemble', S0.filter(x => !memePage(x)).map(ligneJ)); sansErreur('J', r.errs, 'un à un'); } }

/* ═══ R · (㉝) « À régler » ne se trompe ni de défaut ni de geste ═══ */
const CARTE = 'Le Romantisme : la nature, l’émotion, le rêve, la liberté, le moi, la mélancolie, l’infini\n'   /* une carte trop chargée pour tenir lisible (huit familles longues) */
  + 'Les peintres : Théodore Géricault, Caspar David Friedrich, William Turner, Eugène Delacroix, John Constable\n'
  + 'Les poètes : Victor Hugo, Alphonse de Lamartine, Alfred de Musset, Alfred de Vigny, Gérard de Nerval\n'
  + 'Les thèmes : la nature sauvage, la nuit, la tempête, les ruines, la solitude, la mort, l’exil\n'
  + 'Les formes : le sonnet libéré, le vers libre, le poème en prose, la ballade, l’ode, l’élégie\n'
  + 'Les héritages : Baudelaire, Rimbaud, Verlaine, Mallarmé, Lautréamont, Corbière, Laforgue\n'
  + 'Les lieux : la mer, la montagne, la forêt, le lac, le désert, les ruines gothiques, le cimetière\n'
  + 'Les sentiments : le spleen, l’idéal, l’angoisse, l’enthousiasme, la nostalgie, le sublime';
const COUPE = 'Tableau | Peintre | Pour aller plus loin\n'   /* une vraie case coupée : une adresse sans espace, plus large que sa colonne */
  + 'Le Radeau de la Méduse | Géricault | https://fr.wikipedia.org/wiki/Le_Radeau_de_La_M%C3%A9duse_(Th%C3%A9odore_G%C3%A9ricault)\n'
  + 'Le Voyageur contemplant une mer de nuages | Friedrich | le musée de Hambourg';
const reglerDe = async (src, forme) => { HUBN = ranger(store(src, null, forme)) || {}; ECR = []; REFUSES.length = 0; const o = await ouvrir({}); await ouvrirAtelier(o); await allerAtelier(o.pg, /Les cinq tableaux/); await p(800); const t = await aRegler(o.pg); await capt(o.pg, 'R-' + forme + '-a-regler'); const errs = o.errs.concat(o.boites); await o.ctx.close(); return { t, errs }; };
if (joue('R')) { dire(''); dire('══ R · (㉝) 1536×864 · « À régler » dans l’Atelier : un tableau en pages, une carte qui ne tient pas, un tableau avec une vraie case coupée ══');
  const a = await reglerDe(RETIENS, 'tableau'); const la = lignesSur(a.t, /cinq tableaux|Les cinq/); dire('      R · le tableau en pages : ' + (la.length ? la.join(' ‖ ') : 'rien sur « Les cinq tableaux »'));
  verif('R', !la.length, 'le tableau des cinq œuvres (il passe en pages, → les tourne) : « À régler » n’en dit rien, et ne conseille pas « Couper le schéma »', la);
  sansErreur('R', a.errs, 'le tableau en pages');
  const b = await reglerDe(CARTE, 'carte'); const lb = lignesSur(b.t, /Les cinq tableaux/); dire('      R · la carte : ' + (lb.length ? lb.join(' ‖ ') : '—'));
  verif('R', lb.some(x => /ne tient pas lisible/.test(x) && /clic droit sur une famille → Couper le schéma ici/.test(x)), 'une carte qui ne tient pas : « Couper le schéma » (clic droit sur une famille), le geste d’une carte', lb);
  sansErreur('R', b.errs, 'la carte');
  const c = await reglerDe(COUPE, 'tableau'); const lc = lignesSur(c.t, /Les cinq tableaux/); dire('      R · le tableau à la case coupée : ' + (lc.length ? lc.join(' ‖ ') : '—'));
  verif('R', lc.some(x => /hors du cadre|coupée/.test(x) && /page 1 sur 1/.test(x) && /rangée 1,/.test(x) && /case « Pour aller plus loin »/.test(x) && /raccourcis|écris moins/.test(x)) && !lc.some(x => /Couper le schéma|famille/.test(x)), 'un tableau avec une vraie case coupée : la ligne dit lequel (un texte hors du cadre), où (page 1 sur 1, rangée 1, case « Pour aller plus loin ») et le geste (raccourcir dans la source) — jamais « Couper le schéma »', lc);
  sansErreur('R', c.errs, 'le tableau à la case coupée'); }

/* ═══ L · (⑭) une rangée plus haute qu'une page ne cache rien à la classe ═══ */
const ALBATROS = 'Le poème | Ce que j’y repère\n'
  + 'Souvent, pour s’amuser, les hommes d’équipage / Prennent des albatros, vastes oiseaux des mers, / Qui suivent, indolents compagnons de voyage, / Le navire glissant sur les gouffres amers. // À peine les ont-ils déposés sur les planches, / Que ces rois de l’azur, maladroits et honteux, / Laissent piteusement leurs grandes ailes blanches / Comme des avirons traîner à côté d’eux. // Ce voyageur ailé, comme il est gauche et veule ! / Lui, naguère si beau, qu’il est comique et laid ! / L’un agace son bec avec un brûle-gueule, / L’autre mime, en boitant, l’infirme qui volait ! // Le Poète est semblable au prince des nuées / Qui hante la tempête et se rit de l’archer ; / Exilé sur le sol au milieu des huées, / Ses ailes de géant l’empêchent de marcher. | la comparaison filée : l’albatros, c’est le poète\n'
  + 'Les hommes d’équipage | la foule qui se moque du poète';
/* ce que la page montre de la case du poème : chaque ligne de son texte (par sa place dans le texte), vue entière, coupée ou cachée ; l'en-tête */
const lignesCase = (pg, sel) => pg ? pg.evaluate(sel => { const m = sel === 'body' ? (document.querySelector('.mur.tableau') || document.querySelector('.mur')) : document.querySelector(sel); if (!m) return null; const t = m.querySelector('table.p8-grille'); if (!t) return null; const z = t.closest('.p8-dessin'); const M = m.getBoundingClientRect(), Z = z.getBoundingClientRect();
  let clip = { top: Math.max(Z.top, M.top), bottom: Math.min(Z.bottom, M.bottom) }; for (let x = z; x && x !== m; x = x.parentElement) { const s = getComputedStyle(x); if (s.overflowY !== 'visible') { const b = x.getBoundingClientRect(); clip = { top: Math.max(clip.top, b.top), bottom: Math.min(clip.bottom, b.bottom) }; } }
  const hd = t.querySelector('tr:not([data-pg])'); const H = hd.getBoundingClientRect(); const q = v => Math.round(v * 10) / 10; const page = ((m.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim();
  const tr = Array.from(t.querySelectorAll('tr[data-pg]')).find(r => r.dataset.pg === '1' && r.getClientRects().length && getComputedStyle(r).display !== 'none'); if (!tr) return { page, entete: [q(H.left - M.left), q(H.top - M.top), q(H.width)], vue: false };
  const td = tr.children[0]; const out = td.querySelector(':scope > .p8-tr-out'); const inn = out ? out.querySelector('.p8-tr-in') : null; const C = (out || td).getBoundingClientRect(); const bas = Math.min(clip.bottom, C.bottom), haut = Math.max(clip.top, C.top);
  const cs = getComputedStyle(td); const base = inn ? inn.getBoundingClientRect().top : td.getBoundingClientRect().top + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth);
  const rg = document.createRange(); rg.selectNodeContents(inn || td); const L = {}; Array.from(rg.getClientRects()).forEach(r => { if (r.width <= 1) return; const k = Math.round(r.top - base); const x = L[k] || (L[k] = { t: r.top, b: r.bottom }); x.b = Math.max(x.b, r.bottom); });
  const ks = Object.keys(L).map(Number).sort((a, b) => a - b); const lh = ks.length > 1 ? (ks[ks.length - 1] - ks[0]) / (ks.length - 1) : 1;
  const vues = [], coupees = [], cachees = []; ks.forEach(k => { const x = L[k]; const n = Math.round((k - ks[0]) / lh); if (x.t >= haut - 0.5 && x.b <= bas + 0.5) vues.push(n); else if (x.b <= haut + 0.5 || x.t >= bas - 0.5) cachees.push(n); else coupees.push(n); });
  return { page, entete: [q(H.left - M.left), q(H.top - M.top), q(H.width)], vue: true, total: ks.length, vues, coupees, cachees, fs: getComputedStyle(td).fontSize }; }, sel).catch(() => null) : null;
const jouerL = async (W, H) => { HUBN = ranger(store(ALBATROS)) || {}; ECR = []; REFUSES.length = 0; const R0 = { pages: [] }; const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W, H, prof: false }); await p(1200);
  const o = await ouvrir({ W, H }); await lancerClasse(o); const fen = await ouvrirTableau(o, W, H); const v = await o.pg.$('#volet .vig:has(table.p8-grille)'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); await garde(o.pg); } await o.pg.click('#numero').catch(() => {}); await p(1500);
  for (let k = 0; k < 8; k++) { await p(900); const a = await lignesCase(o.pg, '#mur'); const t0 = Date.now(); const b = (await attendre(async () => { const x = await lignesCase(fen, '#mur2'); return x && a && x.page === a.page ? x : null; }, 6000)) || await lignesCase(fen, '#mur2'); const c = (await attendre(async () => { const x = await lignesCase(T.pg, 'body'); return x && a && x.page === a.page ? x : null; }, 6000)) || await lignesCase(T.pg, 'body'); dire('      L · attente du tableau distant, page ' + (a && a.page) + ' : ' + (Date.now() - t0) + ' ms'); R0.pages.push({ a, b, c }); const base = 'L-' + W + 'x' + H + '-page' + (k + 1); await capt(o.pg, base + '-pilote'); if (fen) await capt(fen, base + '-tableau'); await capt(T.pg, base + '-distant');
    const m = /page (\d+) \/ (\d+)/.exec((a || {}).page || ''); if (!m || +m[1] >= +m[2]) break; await o.pg.keyboard.press('ArrowRight'); await garde(o.pg); }
  R0.errs = o.errs.concat(o.boites, T.errs, T.boites); R0.refus = REFUSES.map(x => x.c + ' (' + x.ko + ')'); await o.ctx.close(); await T.ctx.close();
  const o2 = await ouvrir({ W, H }); await ouvrirAtelier(o2); await allerAtelier(o2.pg, /Les cinq tableaux/); R0.atelier = [];
  for (let k = 0; k < 8; k++) { await p(700); const a = await lignesCase(o2.pg, '#mur'); R0.atelier.push(a); await capt(o2.pg, 'L-' + W + 'x' + H + '-atelier-page' + (k + 1)); const m = /page (\d+) \/ (\d+)/.exec((a || {}).page || ''); if (!m || +m[1] >= +m[2]) break; await o2.pg.keyboard.press('Shift+ArrowRight'); await p(400); if (k === 0 && (await lignesCase(o2.pg, '#mur') || {}).page === a.page) { const pg2 = await o2.pg.$('#mur .page [data-p="1"]'); if (pg2) await pg2.click(); } }
  R0.regler = await aRegler(o2.pg); R0.errs.push(...o2.errs, ...o2.boites); await o2.ctx.close(); return R0; };
const bilanL = (P, cle) => { const G = P.map(x => x[cle] || x).filter(g => g && g.vue !== undefined); const vus = {}; let coupees = 0, total = 0; G.forEach(g => { if (!g.vue) return; total = Math.max(total, g.total); coupees += g.coupees.length; g.vues.forEach(n => { vus[n] = (vus[n] || 0) + 1; }); });
  const entetes = G.map(g => g.entete); const memeEntete = entetes.every(e => e && Math.abs(e[0] - entetes[0][0]) <= 1 && Math.abs(e[1] - entetes[0][1]) <= 1 && Math.abs(e[2] - entetes[0][2]) <= 1);
  return { total, uneFois: Object.keys(vus).length, deuxFois: Object.values(vus).filter(n => n > 1).length, coupees, memeEntete, pages: G.map(g => g.page + ' : ' + (g.vue ? 'lignes ' + (g.vues.length ? Math.min(...g.vues) + 1 + '–' + (Math.max(...g.vues) + 1) : '—') + (g.coupees.length ? ', ' + g.coupees.length + ' coupée(s)' : '') + (g.cachees.length ? ', ' + g.cachees.length + ' cachée(s)' : '') : 'l’autre rangée')), fs: [...new Set(G.filter(g => g.fs).map(g => g.fs))] }; };
if (joue('L')) { dire(''); dire('══ L · (⑭) « L’Albatros » en entier dans une case : chaque ligne du poème vue une fois, entière, sur une page ══');
  for (const [W, H] of TAILLES) { const T0 = W + '×' + H; const R0 = await jouerL(W, H);
    for (const [cle, nom] of [['a', 'au pilote'], ['b', 'à la fenêtre du tableau'], ['c', 'au tableau distant'], ['atelier', 'dans l’Atelier']]) { const P = cle === 'atelier' ? R0.atelier : R0.pages; const B = bilanL(P, cle === 'atelier' ? null : cle);
      dire('      L · ' + T0 + ' · ' + nom + ' : ' + B.pages.join(' │ ') + ' · police ' + B.fs.join(', '));
      verif('L', B.total > 0 && B.uneFois === B.total && !B.deuxFois && !B.coupees, T0 + ' · ' + nom + ' : chaque ligne du poème vue une fois, entière, sur une page (' + B.uneFois + ' sur ' + B.total + ') ; aucune ligne coupée en deux (' + B.coupees + ')', B);
      verif('L', B.memeEntete && B.fs.length <= 1, T0 + ' · ' + nom + ' : l’en-tête à la même place sur chaque page ; la police ne change pas (' + B.fs.join(', ') + ')', P.map(x => ((cle === 'atelier' ? x : x[cle]) || {}).entete)); }
    const lr = lignesSur(R0.regler, /Les cinq tableaux/); verif('L', !lr.length, T0 + ' : « À régler » ne signale plus la rangée du poème (rien n’est perdu)', lr);
    verif('L', !R0.refus.length, T0 + ' : aucune écriture refusée par le hub (la scène porte les tranches de la rangée)', R0.refus.slice(0, 3));
    sansErreur('L', R0.errs, T0); } }

/* ═══ K · (㉟, point 9) la frappe des réponses des élèves suit les doigts de Paul ═══
   En classe (une vraie heure), sur le bloc question « Question-bilan », Paul écrit au pilote trois réponses d'élèves (une quinzaine de mots chacune, 80 ms
   entre deux touches), chacune validée par Entrée (Tab passe des initiales à la réponse). À chaque touche : l'heure de la touche (`keydown`) et l'image où sa
   lettre paraît (requestAnimationFrame : la longueur des réponses écrites), au pilote, à la fenêtre du tableau et au tableau distant, sur une même horloge.
   Avec MJPC_PROFIL=1 : ce que les touches déclenchent au pilote (le temps de chaque fonction, cumulé). */
const PHRASES = ['Les cinq tableaux montrent une nature immense et un homme tout petit devant elle.', 'Le peintre veut nous faire ressentir la peur et l’émotion plutôt que suivre des règles.', 'On voit la tempête, la nuit, les montagnes : la nature est plus forte que l’homme.'];
const PROFIL_K = ['dr_tout', 'rendre', 'volet', 'vueDroite', 'p8RendreNotes', 'ouOnEnEst', 'participation', 'pousser', 'dr_versMur', 'dr_sceneAuto', 'journal', 'dr_etatAuto', 'dr_journalAuto', 'mjpcSignalerIssue', 'mjpcRendreBandeau', 'dr_recitAuto', 'miniatures', 'dr_suivreHauteurs', 'brancherAjout', 'brancherMenus', 'etatComplet', 'paginer', 'dimensionner', 'temoin', 'alerteVideo', 'dr_tabAncrer', 'p8Poser', 'mjpcEcrireRest', 'dr_ecrire', 'dr_frappeReponse'];
/* à chaque image, les réponses écrites (leurs textes), gardées seulement quand elles changent : la lettre n est vue quand une réponse porte exactement le début tapé jusqu'à elle (jamais par un compte de lettres : la réponse préparée paraît au tableau après la participation) */
const sondeFrappe = (pg, sel) => pg.evaluate(sel => { window.__F = []; window.__Fon = true; let der = ''; const lire = () => { const m = sel === 'body' ? document.body : document.querySelector(sel); if (!m) return []; return Array.from(m.querySelectorAll('.rep .dit')).map(x => (x.textContent || '').replace(/\u00a0/g, ' ')); };   /* C16 (㉟, l'exécutant de la frappe) : une espace tapée en fin de texte est d'abord une espace insécable (le navigateur la remplace par une espace ordinaire à la lettre suivante) — comparée telle quelle, chaque espace n'était « vue » qu'à la touche suivante (≈ 100 ms) : 42 espaces sur 244 touches */
  const f = () => { const L = lire(); const k = JSON.stringify(L); if (k !== der) { der = k; window.__F.push([performance.timeOrigin + performance.now(), L]); } if (window.__Fon) requestAnimationFrame(f); }; requestAnimationFrame(f); }, sel);
const jouerK = async (fichier, refuser) => { REFUSER = refuser; HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1200);
  const o = await ouvrir({ fichier }); await lancerClasse(o); const fen = await ouvrirTableau(o); await allerA(o.pg, QB); await toutDevoiler(o.pg, QB); await p(1500);
  await corriger(o.pg, 'p.q[data-p$=".t"]', ' Pensez au Romantisme.'); await p(2500);   /* comme ce matin : Paul a d'abord corrigé la question en direct (sur la base, la scène est alors refusée à chaque envoi, ㉘) */
  if (process.env.MJPC_PROFIL) await o.pg.evaluate(noms => { window.__PR = {}; noms.forEach(n => { const f = window[n]; if (typeof f !== 'function' || f.__pr) return; const g = function () { const t0 = performance.now(); try { return f.apply(this, arguments); } finally { const d = performance.now() - t0; const x = window.__PR[n] || (window.__PR[n] = [0, 0, 0]); x[0] += d; x[1]++; x[2] = Math.max(x[2], d); } }; g.__pr = true; try { window[n] = g; } catch (e) {} }); }, PROFIL_K);
  /* MJPC_TRACE=1 : la ligne de temps des fonctions, au pilote et à la fenêtre du tableau (le même fil d'exécution) — pour chaque lettre lente, ce qui tournait */
  const TRACE = ['dr_tout', 'rendre', 'volet', 'miniatures', 'vueDroite', 'participation', 'pousser', 'dr_frappeReponse', 'brancherAjout', 'ouOnEnEst', 'p85hPages', 'dr_rendreMur', 'dr_tabRecevoir', 'appliquerPages', 'p8Poser', 'dr_tabAncrer', 'paginer', 'dr_etatAuto', 'dr_recitAuto', 'temoin', 'alerteVideo', 'dr_suivreHauteurs', 'dr_tabVeiller', 'dr_ttEmettre', 'dr_sceneAuto', 'journal', 'dr_sesVeiller', 'dr_sesEnvoyerMaintenant', 'dr_sesPhoto', 'dr_sesCopie', 'dr_sesSig', 'dr_sesEmettreScene', 'dr_sesScene', 'dr_sesRecu', 'dr_etatHeure', 'dr_journalHub', 'dr_tcBouton', 'tick', 'dr_minuteurBoucle', 'aideSuivre', 'dr_sauve', 'dr_copieAuto', 'participation']   /* C16 (㉟, l'exécutant de la frappe) : la session de ㉞ aussi (elle tourne toutes les 400 ms) */;
  const tracer = pg => pg.evaluate(noms => { window.__TL = []; noms.forEach(n => { const f = window[n]; if (typeof f !== 'function' || f.__tr) return; const g = function () { const t0 = performance.now(); try { return f.apply(this, arguments); } finally { const t1 = performance.now(); if (t1 - t0 >= 2) window.__TL.push([n, performance.timeOrigin + t0, performance.timeOrigin + t1]); } }; g.__tr = true; try { window[n] = g; } catch (e) {} }); }, TRACE);
  if (process.env.MJPC_TRACE) { await tracer(o.pg); if (fen) await tracer(fen); }
  await o.pg.evaluate(() => { window.__KD = []; document.addEventListener('keydown', e => { if (e.key.length === 1) window.__KD.push(performance.timeOrigin + e.timeStamp); }, true); });
  await sondeFrappe(o.pg, '#mur'); if (fen) await sondeFrappe(fen, '#mur2'); await sondeFrappe(T.pg, 'body');
  const L0 = await o.pg.evaluate(() => Array.from(document.querySelectorAll('#mur .rep .dit')).reduce((t, x) => t + (x.textContent || '').length, 0));
  let ok = true; for (let k = 0; k < PHRASES.length; k++) { const dit = await o.pg.$('#mur .rep:last-of-type .dit[contenteditable]') || (await o.pg.$$('#mur .rep .dit[contenteditable]')).pop(); if (!dit) { ok = false; break; }
    await dit.click(); await p(250); await o.pg.keyboard.type(PHRASES[k], { delay: 80 }); await p(400); await o.pg.keyboard.press('Enter'); await p(900); }
  await p(3500); for (const x of [o.pg, fen, T.pg]) if (x) await x.evaluate(() => { window.__Fon = false; });
  const kd = await o.pg.evaluate(() => window.__KD); const attendus = []; PHRASES.forEach(ph => { for (let j = 1; j <= ph.length; j++) attendus.push(ph.slice(0, j)); });
  const lat = F => kd.map((t, i) => { const pre = attendus[i]; if (pre == null) return null; let v = null; for (let q = 0; q < F.length; q++) { if (F[q][0] < t) continue; if (F[q][1].some(x => x === pre || (x.startsWith(pre) && PHRASES.some(ph => ph.startsWith(x))))) { v = F[q]; break; } } return v ? Math.round(v[0] - t) : null; });
  const out = { ok, n: kd.length, pilote: lat(await o.pg.evaluate(() => window.__F)), fen: fen ? lat(await fen.evaluate(() => window.__F)) : [], distant: lat(await T.pg.evaluate(() => window.__F)) };
  out.textes = { pilote: await o.pg.evaluate(() => Array.from(document.querySelectorAll('#mur .rep .dit')).map(x => x.textContent)), fen: fen ? await fen.evaluate(() => Array.from(document.querySelectorAll('#mur2 .rep .dit')).map(x => x.textContent)) : [], distant: await T.pg.evaluate(() => Array.from(document.querySelectorAll('.rep .dit')).map(x => x.textContent)) };
  if (process.env.MJPC_PROFIL) out.profil = await o.pg.evaluate(() => window.__PR);
  if (process.env.MJPC_TRACE) { const TLp = await o.pg.evaluate(() => window.__TL || []), TLf = fen ? await fen.evaluate(() => window.__TL || []) : []; out.trace = [];
    kd.forEach((t, i) => { const lp = out.pilote[i], lf = out.fen[i]; if (!((lp != null && lp > 100) || (lf != null && lf > 100))) return; const fin = t + Math.max(lp || 0, lf || 0);
      const dans = (L, qui) => L.filter(x => x[2] > t - 5 && x[1] < fin).map(x => qui + ' ' + x[0] + ' ' + Math.round(x[1] - t) + '→' + Math.round(x[2] - t)).join(', ');
      out.trace.push('lettre ' + (i + 1) + ' « ' + (attendus[i] || '').slice(-12) + ' » : pilote ' + lp + ' ms, fenêtre ' + lf + ' ms — ' + [dans(TLp, 'P'), dans(TLf, 'F')].filter(Boolean).join(' | ')); }); }
  out.refus = REFUSES.length; out.bandeau = await temoins(o.pg); const C = '/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule_joue'; const cj = lireH(C) || {}; const k1 = Object.keys(cj)[0]; out.auHub = JSON.stringify(((cj[k1] || {}).etat || {}).parDiapo || {});
  await capt(o.pg, 'K-' + (refuser ? 'refus' : 'sans') + '-pilote'); out.errs = o.errs.concat(o.boites, T.errs, T.boites); await o.ctx.close(); await T.ctx.close(); REFUSER = true; return out; };
const statK = a => { const v = a.filter(x => x != null).sort((x, y) => x - y); if (!v.length) return { med: null, max: null, n: 0, txt: '—' }; const med = v[Math.floor(v.length / 2)]; return { med, max: v[v.length - 1], n: v.length, perdues: a.length - v.length, txt: 'médiane ' + med + ' ms · max ' + v[v.length - 1] + ' ms · ' + v.filter(x => x > 100).length + ' au-delà de 100 ms · ' + (a.length - v.length) + ' jamais vue(s) (sur ' + a.length + ')' }; };
if (joue('K')) { dire(''); dire('══ K · (㉟) 1536×864 · en classe, trois réponses d’élèves écrites au pilote (80 ms entre deux touches) : le délai de chaque lettre ══');
  for (const refuser of String(process.env.MJPC_K_MODES || 'refus,sans').split(',').map(x => x.trim() === 'refus')) {   /* MJPC_K_MODES=refus : le seul faux hub qui refuse, comme le vrai (C16, la frappe : trois passages avant 09:15) */ const nomR = refuser ? 'faux hub qui refuse les clés interdites' : 'faux hub rangé comme le vrai, sans refus'; const r = await jouerK(FICHIER, refuser);
    const sp = statK(r.pilote), sf = statK(r.fen), sd = statK(r.distant);
    dire('      K · ' + nomR + ' · ' + r.n + ' touches · pilote : ' + sp.txt + ' │ fenêtre du tableau : ' + sf.txt + ' │ tableau distant : ' + sd.txt + ' · envois refusés : ' + r.refus + (r.bandeau.bandeau ? ' · bandeau « ' + r.bandeau.bandeauT.slice(0, 80) + ' »' : ''));
    if (r.trace) r.trace.slice(0, 40).forEach(x => dire('        ' + x));
    if (r.profil) dire('        profil pilote (cumul sur les ' + r.n + ' touches) : ' + Object.entries(r.profil).sort((a, b) => b[1][0] - a[1][0]).filter(x => x[1][0] >= 5).map(([k, v]) => k + ' ' + Math.round(v[0]) + ' ms ×' + v[1] + ' (max ' + Math.round(v[2]) + ')').join(', '));
    verif('K', r.ok && r.n >= 200, nomR + ' : les trois réponses tapées (' + r.n + ' touches)');
    verif('K', sp.med != null && sp.med <= 50 && sp.max <= 100 && !sp.perdues, nomR + ' : au pilote, chaque lettre paraît à l’image suivante — ' + sp.txt);
    verif('K', sf.med != null && sf.med <= 100 && sf.max < 350 && !sf.perdues, nomR + ' : à la fenêtre du tableau, la règle de 7 (médiane au plus 100 ms, chaque lettre sous 350 ms) — ' + sf.txt);
    const tous = x => PHRASES.every(ph => (x || []).some(t => String(t).trim() === ph));
    verif('K', tous(r.textes.pilote) && tous(r.textes.fen) && tous(r.textes.distant) && PHRASES.every(ph => r.auHub.indexOf(ph.replace(/’/g, '’')) >= 0), nomR + ' : rien n’est perdu — les trois réponses entières au pilote, à la fenêtre du tableau, au tableau distant, au hub (l’état de l’heure)', { pilote: r.textes.pilote, distant: r.textes.distant });
    verif('K', !r.refus, nomR + ' : aucun envoi refusé (' + r.refus + ')');
    sansErreur('K', r.errs, nomR); } }
fs.writeFileSync(path.join(OUT, 'sonde-correctifs.txt'), R.join('\n') + '\n');
dire(''); dire('--- fin : ' + nb + ' vérification(s), ' + echecs + ' échec(s) · ' + (echecs ? 'ROUGE' : 'VERT'));
fs.writeFileSync(path.join(OUT, 'sonde-correctifs.txt'), R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
