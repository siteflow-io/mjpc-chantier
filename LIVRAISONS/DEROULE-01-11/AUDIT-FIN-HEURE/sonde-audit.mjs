// LA SONDE DE L'AUDIT DE LA FIN D'HEURE (MANDATS/DEROULE-01-11/MANDAT-AUDIT-FIN-HEURE.md) — par le geste, sous le faux hub des sondes (sa partie haute :
// CORRECTIFS/sonde-correctifs.mjs, branche deroule/correctifs, 3d3b6e3). Mesurer seulement. usage : node sonde-audit.mjs <dossier>/index.html <sortie>
// (le nom du dossier du fichier, « prod » ou « corr », nomme les captures). MJPC_MEDIAS, MJPC_CAPT comme la sonde des correctifs. Aucune écriture au vrai hub.
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
dire('C16 · audit de la fin d’heure · faux hub rangé comme le vrai · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

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

/* ═══════════════════ L'AUDIT DE LA FIN D'HEURE (MANDATS/DEROULE-01-11/MANDAT-AUDIT-FIN-HEURE.md) — mesurer seulement ═══════════════════
   La séance 1 du faux hub est retouchée pour avoir la trame de celle de Paul (lue par la conscience au vrai hub, 14:15) : activité 1 « Analyse d'images »
   (« Analyse d'images », « Consigne pour le passage à l'oral ») ; activité 2 « Mise en commun » (pour chaque groupe 1 à 5 : son tableau, puis « l'hypothèse »,
   un bloc question) ; « Le bilan » (sans activité, rôle bilan) ; la fin d'heure posée par le site. 43 minutes prévues : une seule heure (`sur` 1). */
const GR = [['Le Radeau de la Méduse', 'tableau-1-gericault-radeau.webp', 'Le Radeau de la Méduse, Théodore Géricault, 1819'], ['Le lac', 'tableau-2-bierstadt-lac.webp', 'Le lac, Albert Bierstadt, 1863'], ['Pêcheurs en mer', 'tableau-3-turner-pecheurs.webp', 'Pêcheurs en mer, William Turner, 1796'], ['Cathédrale gothique au bord de l’eau', 'tableau-4-schinkel-ville.webp', 'Cathédrale gothique au bord de l’eau, Karl Friedrich Schinkel, 1813'], ['Le Voyageur contemplant une mer de nuages', 'tableau-5-friedrich-voyageur.webp', 'Le Voyageur contemplant une mer de nuages, Caspar David Friedrich, vers 1818']];
const trameDePaul = (E, st) => { const k = sk0(st)[0]; const d = st.site['3e'].chapitres[0].seances[k].deroule; const N = [];
  const ec = (eid, act, actId, dur, blocs, role) => { const e = { eid, act, dur, blocs, comp: ['c4-lire-02'], rev: 0, vues: 0 }; if (actId) e.actId = actId; if (role) e.role = role; N.push(e); return e; };
  ec('aud-a1-analyse', 'Analyse d’images', 'act1', 5, [{ t: 'consigne', id: 'baud1', pic: '•', txt: 'Observe, discute, fais une hypothèse sur le Romantisme.', etapes: ['J’observe le tableau de mon groupe en silence.', 'Je discute en groupe de ce que je vois.', 'Au brouillon : ce que je vois, ce que je ressens, ce que je me demande.', 'Je fais une hypothèse sur ce que peut être le Romantisme.'], vues: 0 }]);
  ec('aud-a1-consigne', 'Consigne pour le passage à l’oral', 'act1', 3, [{ t: 'consigne', id: 'baud2', pic: '🗣️', txt: 'Chaque groupe présente son tableau puis son hypothèse.', etapes: ['Un élève montre le tableau et dit ce qu’on y voit.', 'Un autre élève lit l’hypothèse du groupe.', 'La classe écrit l’hypothèse au tableau.'], vues: 0 }]);
  GR.forEach(([t, f, leg], g) => { ec('aud-g' + (g + 1) + '-img', 'Groupe ' + (g + 1) + ' : ' + t, 'act2', 3, [{ t: 'image', id: 'baudi' + g, devoilerTout: true, legende: leg, ref: 'https://siteflow-io.github.io/mjpc-medias/poesie-peinture-xixe/' + f, src: '', support: true, vues: 0 }]);
    ec('aud-g' + (g + 1) + '-hyp', 'Groupe ' + (g + 1) + ' : l’hypothèse', 'act2', 3, [{ t: 'question', id: 'baudq' + g, q: 'Quelle hypothèse le groupe ' + (g + 1) + ' tire-t-il de son tableau ?', reps: [], vues: 0 }]); });
  ec('aud-bilan', 'Le bilan', null, 5, [{ t: 'question', id: 'baudb', q: 'Qu’est-ce que le Romantisme, d’après nos cinq hypothèses ?', reps: [], vues: 0 }], 'bilan');
  E.length = 0; N.forEach(e => E.push(e));
  d.activites = [{ id: 'act1', num: 1, titre: 'Analyse d’images', diapos: ['aud-a1-analyse', 'aud-a1-consigne'] }, { id: 'act2', num: 2, titre: 'Mise en commun', diapos: N.filter(e => e.actId === 'act2').map(e => e.eid) }]; };
const REPS = ['La nature est immense et l’homme est tout petit.', 'Le peintre veut faire ressentir la peur.', 'Les naufragés espèrent encore voir un bateau.'];
const DEVOILER = process.env.MJPC_DEVOILER !== '0';   /* MJPC_DEVOILER=0 : les 3 réponses écrites sans dévoiler la question d'abord */
const NOM = path.basename(path.dirname(FICHIER)) + (DEVOILER ? '' : '-sansdevoiler');   /* prod | corr */
const INI = ['EA', 'GA', 'EB'];   /* trois initiales de la classe test (les pastilles) */
const NOMS = (() => { const st = store(); const el = (st.classes['3E Charles de Gaulle'] || {}).eleves || []; return [...new Set(el.join(' ').split(/\s+/).filter(x => x.length >= 3))].sort((a, b) => b.length - a.length); })();
const anon = t => { let x = String(t); NOMS.forEach(n => { x = x.split(n).join('«nom»'); }); return x.replace(/«nom»(\s+«nom»)+/g, '«nom»').replace(/«nom»/g, 'un élève'); };
const lireRelecture = async (pg, nom, tag) => { const recit = (await texteDe(pg, '#ecran-relecture')) || ''; await capt(pg, nom + '-' + tag + '-recit'); const ok = await pg.evaluate(() => { const b = document.querySelector('#ecran-relecture [data-f="passe"]'); if (!b) return false; b.click(); return true; }); await p(1500); const passe = (await texteDe(pg, '#ecran-relecture')) || ''; await capt(pg, nom + '-' + tag + '-passe');
  const ex = (t, re, n) => { const m = re.exec(t); return m ? t.slice(Math.max(0, m.index - 80), m.index + n) : '—'; };
  return { recit, passe, ok, presents: ex(recit, /présents/, 120), finRecit: ex(recit, /Mise en commun/, 700), prochaine: ex(recit + ' ‖ ' + passe, /prochaine séance|reporté/i, 300), appel: ex(passe, /L'appel|L’appel/, 220), manque: ex(passe, /Ce qui manquait/, 600) }; };
const vis = pg => pg.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' '));
const mots = (t, re) => (t.match(re) || []).length;
const etatFin = pg => pg.evaluate(() => { const z = document.querySelector('#fin'); const q = s => ((z && z.querySelector(s)) || {}).innerText || '';
  return { n: S.finSection, tete: q('.pp-tete').replace(/\s+/g, ' ').trim(), quoi: q('.pp-quoi').replace(/\s+/g, ' ').trim(), corps: q('.sec.ouverte').replace(/\s+/g, ' ').trim().slice(0, 1600),
    btns: z ? Array.from(z.querySelectorAll('button')).filter(b => b.offsetParent !== null).map(b => (b.disabled ? '[grisé] ' : '') + (b.innerText || '').replace(/\s+/g, ' ').trim()) : [],
    cartes: z ? Array.from(z.querySelectorAll('.carte')).map(c => ({ tete: (c.querySelector('div') || c).innerText.replace(/\s+/g, ' ').trim(), minis: Array.from(c.querySelectorAll('.mini')).map(m => (m.title || '').replace(/ — un clic agrandit$/, '')), choix: Array.from(c.querySelectorAll('.dec button')).map(b => (b.innerText || '').trim() + (b.classList.contains('on') ? ' [posé]' : '')) })) : [],
    liste: z ? Array.from(z.querySelectorAll('.pp-liste [data-sec]')).map(l => (l.innerText || '').replace(/\s+/g, ' ').trim()) : [] }; });
const clic = async (pg, sel) => { const ok = await pg.evaluate(s => { const b = document.querySelector(s); if (!b || b.disabled || b.offsetParent === null) return false; b.click(); return true; }, sel); await p(900); return ok; };
const finies = pg => pg.evaluate(() => seance().ecrans.map((e, i) => ({ act: e.act, role: e.role || '', act_: e.actId || '', vu: vuMax[K(i)] || 0, n: elements(e).length, finie: !!finie(e, i), dansHeure: ordreHeure(S.heure).includes(i) })));
const caseEdt = async (pg, jour) => { await pg.evaluate(() => edtOuvrir()); await p(2200); const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return false; x.click(); return true; }, jour); await p(1000);
  return { ok, t: ((await texteDe(pg, '#edt-modale')) || ''), btns: await pg.evaluate(() => Array.from(document.querySelectorAll('#edt-modale button')).filter(b => b.offsetParent !== null).map(b => (b.innerText || '').replace(/\s+/g, ' ').trim())) }; };
const casesCharles = pg => pg.evaluate(() => Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')).map(e => ({ oc: (e.getAttribute('onclick') || '').slice(0, 160), t: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160) })));
const fermerEdt = async pg => { await pg.evaluate(() => { try { edtModaleFermer(); } catch (e) {} try { edtFermer(); } catch (e) {} }); await p(700); };
const heureHub = () => { const C = '/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule_joue'; const cj = lireH(C) || {}; const sl = Object.keys(cj)[0]; const H = ((cj[sl] || {}).heures) || {}; const k = Object.keys(H)[0]; return { chemin: C + '/' + sl + '/heures/' + k, h: H[k] || null, etat: (cj[sl] || {}).etat || null }; };
const titreDe = eid => { const E = (lireH('/site/3e/chapitres/0/seances/' + sk0(HUBN)[0] + '/deroule') || {}).ecrans || []; const L = Array.isArray(E) ? E : Object.values(E); return (L.find(e => e && e.eid === eid) || {}).act || eid; };
const S_ = {};   /* le résumé, pour le rapport */
const jouerHeure = async (fichier, nom) => { HUBN = ranger(store(null, trameDePaul)) || {}; ECR = []; REFUSES.length = 0; const R0 = { nom }; let clics = 0;
  const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const pg = o.pg;
  /* ── §2.1 : le geste de Paul — la case de l'emploi du temps, puis ce qui s'ouvre jusqu'à la première diapo ── */
  const c0 = await caseEdt(pg, '2026-09-14'); await capt(pg, nom + '-1a-case-edt-avant'); R0.caseAvant = c0;
  dire('  [' + nom + '] 1a · la case du lundi 14/09 (avant de lancer) : ' + c0.t.slice(0, 500)); dire('  [' + nom + '] 1a · boutons : ' + c0.btns.join(' │ ') + ' · « absent » ' + mots(c0.t, /absent/gi) + ' fois, « appel » ' + mots(c0.t, /appel/gi) + ' fois');
  const lance = await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await capt(pg, nom + '-1b-apres-lancer');
  const t1 = await vis(pg); R0.apresLancer = t1; const ouv = await pg.evaluate(() => { const x = document.getElementById('ecran-fin'); return x ? { cl: x.className, t: (x.innerText || '').replace(/\s+/g, ' ').slice(0, 900) } : null; });
  dire('  [' + nom + '] 1b · lancé : ' + lance + ' · l’écran qui s’ouvre (#ecran-fin ' + (ouv ? ouv.cl : '—') + ') : « ' + (ouv ? ouv.t.slice(0, 600) : '') + ' » · à l’écran, « appel » ' + mots(t1, /appel/gi) + ' fois, « absent » ' + mots(t1, /absent/gi) + ' fois');
  await pg.keyboard.press('Escape'); await p(600); await capt(pg, nom + '-1c-premiere-diapo'); const d0 = await ici_(pg); const L = await eidsDe(pg); dire('  [' + nom + '] 1c · après Échap : diapo « ' + ((L.find(e => e.eid === d0.eid) || {}).act || d0.eid) + ' » · ' + d0.numero);
  const ordre = await pg.evaluate(() => ordreHeure(S.heure).map(i => seance().ecrans[i].act || seance().ecrans[i].role)); dire('  [' + nom + '] 1c · l’ordre de l’heure : ' + ordre.join(' → '));
  const part = await pg.evaluate(() => { const x = document.getElementById('part'); return x ? { n: x.querySelectorAll('[data-e]').length, titre: (x.closest('[title]') || x).getAttribute('title') || '', t: (x.innerText || '').replace(/\s+/g, ' ').slice(0, 120) } : null; }); dire('  [' + nom + '] 1d · la participation (#part) : ' + JSON.stringify(part));
  /* pendant l'heure : la case de l'EDT de cette heure */
  const c1 = await caseEdt(pg, '2026-09-14'); await capt(pg, nom + '-1e-case-edt-pendant'); dire('  [' + nom + '] 1e · la case pendant l’heure : ' + c1.t.slice(0, 400) + ' · boutons : ' + c1.btns.slice(0, 6).join(' │ ')); await fermerEdt(pg); await pg.keyboard.press('Escape').catch(() => {}); await p(500);
  /* ── §2.2 : jouer l'heure comme Paul ce matin ── */
  await pg.click('#numero').catch(() => {}); const vus = [];
  for (let k = 0; k < 60; k++) { const s2 = await ici_(pg); const x = (await eidsDe(pg)).find(e => e.eid === s2.eid) || {}; if (!vus.length || vus[vus.length - 1] !== (x.act || x.role)) vus.push(x.act || x.role); if (x.eid === 'aud-g1-hyp') break; await pg.keyboard.press('ArrowRight'); await p(350); await garde(pg); }
  dire('  [' + nom + '] 2a · les diapos jouées (→ au clavier, tout dévoilé) : ' + vus.join(' → '));
  const ap = await ici_(pg); await capt(pg, nom + '-2b-hypothese-arrivee'); dire('  [' + nom + '] 2b · sur « Groupe 1 : l’hypothèse » : ' + ap.compte);
  if (DEVOILER && /0 \//.test(ap.compte)) { await pg.keyboard.press('ArrowRight'); await p(500); }
  let ecrit = 0; for (const r of REPS) { const dit = await pg.$('#mur .rep:last-of-type .dit[contenteditable]') || (await pg.$$('#mur .rep .dit[contenteditable]')).pop(); if (!dit) break; await dit.click(); await p(250); await pg.keyboard.type(r, { delay: 15 }); await p(300); await pg.keyboard.press('Enter'); await p(700); ecrit++; }
  /* les trois élèves qui ont répondu, notés à la participation (le champ « initiales — puis 1/2/3, note, Entrée ») */
  await pg.keyboard.press('Escape').catch(() => {}); await p(300); let paroles = 0; for (const x of INI) { const v = await pg.$('#vif'); if (!v) break; await v.click(); await p(200); await pg.keyboard.type(x, { delay: 40 }); await p(300); await pg.keyboard.press('Enter'); await p(700); paroles++; }
  const nParts = await pg.evaluate(() => (S.parts || []).length); dire('  [' + nom + '] 2c · la participation : ' + paroles + ' élèves notés au champ des initiales · S.parts : ' + nParts + ' · « ' + ((await texteDe(pg, '#presents')) || '') + ' »');
  await p(1200); const ap2 = await ici_(pg); await capt(pg, nom + '-2c-hypothese-3-reponses'); dire('  [' + nom + '] 2c · 3 réponses d’élèves écrites : ' + ecrit + ' · compteur : ' + ap2.compte);
  const F0 = await finies(pg); R0.finies = F0; dire('  [' + nom + '] 2d · ce que le site compte « finie » (finie()) avant la fin d’heure : ' + F0.filter(x => x.dansHeure).map(x => '« ' + x.act + ' » ' + (x.finie ? 'FINIE' : 'pas finie') + ' (vu ' + x.vu + '/' + x.n + ')').join(' · '));
  /* ── la fin de l'heure : « ⏩ aller à 5 minutes de la fin » ── */
  const t5 = await pg.evaluate(() => { const b = document.getElementById('dr-t5'); return b ? { vis: b.offsetParent !== null, t: b.textContent } : null; }); dire('  [' + nom + '] 2e · le bouton #dr-t5 : ' + JSON.stringify(t5));
  await pg.evaluate(() => { const b = document.getElementById('dr-t5'); if (b) b.click(); }); await p(2500);
  if (!(await pg.evaluate(() => !!document.querySelector('#fin .pp-tete')))) { await pg.evaluate(() => { const b = document.getElementById('bfin'); if (b) b.click(); }); await p(1500); dire('  [' + nom + '] 2e · la séquence ne s’est pas ouverte seule : « Fin de l’heure » (#bfin)'); }
  const ET = []; for (let n = 1; n <= 7; n++) { let e = await etatFin(pg); if (e.n !== n) { dire('  [' + nom + '] étape attendue ' + n + ', ouverte ' + e.n); }
    await capt(pg, nom + '-3-etape-' + n); const g = { n, avant: e, clics: [] };
    if (n === 2) { g.ou = await pg.evaluate(() => { const b = document.querySelector('#fin .carte .dec button[data-c="reporter"]'); const d = document.getElementById('droite'); if (!b) return null; const r = b.getBoundingClientRect(); const m = document.querySelectorAll('#fin .carte .mini'); return { haut: Math.round(r.top), fenetre: innerHeight, visible: r.top >= 0 && r.bottom <= innerHeight, defile: d ? d.scrollHeight - d.clientHeight : null, minis: m.length, hautMini: m[0] ? Math.round(m[0].getBoundingClientRect().height) : null }; });
      dire('  [' + nom + '] 3 · étape 2 : « Reporter à la séance suivante » à ' + JSON.stringify(g.ou)); for (const c of e.cartes) { const id = await pg.evaluate(t => { const c = Array.from(document.querySelectorAll('#fin .carte')).find(x => (x.querySelector('div') || x).innerText.replace(/\s+/g, ' ').trim() === t); if (!c) return null; const b = c.querySelector('.dec button[data-c="reporter"]'); if (!b) return 'pas de « Reporter »'; b.click(); return c.dataset.act; }, c.tete); await p(1000); g.clics.push('« Reporter à la séance suivante » sur ' + id); clics++; }
      g.apres = await etatFin(pg); await capt(pg, nom + '-3-etape-2-reporte'); }
    if (n === 3) { if (await clic(pg, '#f-rien')) { g.clics.push('« Rien d’autre pour la prochaine fois »'); clics++; } }
    if (n === 4) { if (await clic(pg, '#f-relu')) { g.clics.push('« relu »'); clics++; } else g.clics.push('(« relu » grisé)'); }
    if (n < 7) { e = await etatFin(pg); if (e.n === n) { if (await clic(pg, '#f-suivante')) { g.clics.push('« suivante »'); clics++; } } else g.clics.push('(passée seule à l’étape ' + e.n + ')'); }
    if (n === 7) { if (await clic(pg, '#f-clore')) { g.clics.push('« Clore l’heure »'); clics++; } await p(800); const gc = await pg.evaluate(() => { const g = document.getElementById('garde-clore'); return g && g.classList.contains('on') ? (g.innerText || '').replace(/\s+/g, ' ').trim() : null; }); g.garde = gc; await capt(pg, nom + '-3-etape-7-garde');
      if (gc) { await pg.evaluate(() => document.getElementById('gclore-oui').click()); g.clics.push('« ' + (await pg.evaluate(() => (document.getElementById('gclore-oui') || {}).textContent || 'gclore-oui')) + ' »'); clics++; await p(2500); await garde(pg); } }
    ET.push(g); }
  R0.etapes = ET; R0.clicsFin = clics; R0.close = await pg.evaluate(() => !!S.close);
  ET.forEach(g => { dire('  [' + nom + '] 3 · étape ' + g.n + ' — tête « ' + g.avant.tete.slice(0, 160) + ' »'); dire('        ce qu’elle demande : « ' + g.avant.quoi.slice(0, 300) + ' »'); dire('        ce qu’elle montre : « ' + g.avant.corps.slice(0, 700) + ' »');
    dire('        boutons (' + g.avant.btns.length + ') : ' + g.avant.btns.join(' │ ').slice(0, 900)); if (g.avant.cartes.length) g.avant.cartes.forEach(c => dire('        CARTE « ' + c.tete + ' » · minis : ' + c.minis.join(' / ') + ' · choix : ' + c.choix.join(' │ ')));
    if (g.n === 2) { dire('        liste des 7 (avant) : ' + g.avant.liste.join(' ‖ ')); if (g.apres) { dire('        après « Reporter » : ' + g.apres.cartes.map(c => c.tete + ' · ' + c.choix.filter(x => /posé/.test(x)).join(',')).join(' ‖ ')); dire('        liste des 7 (après) : ' + g.apres.liste.join(' ‖ ')); } }
    dire('        clics : ' + (g.clics.join(', ') || 'aucun') + (g.garde ? ' · la garde : « ' + g.garde.slice(0, 500) + ' »' : '')); });
  dire('  [' + nom + '] 3 · clôture : S.close = ' + R0.close + ' · clics de la fin d’heure (dès l’ouverture de la séquence) : ' + clics);
  /* ── §2.3 / §2.4 : ce qui est au hub, la Relecture, l'EDT ── */
  const hh = heureHub(); const H = hh.h || {}; R0.hub = H;
  const dpe = Object.keys(H.decisionsParEcran || {}); const dpa = Object.keys(H.decisionsParActivite || {});
  dire('  [' + nom + '] 4a · au hub, ' + hh.chemin.replace(/deroule_joue\/[^/]+/, 'deroule_joue/<classe>') + ' : clos ' + !!H.clos + ' · sur ' + H.sur + ' · activites (' + (H.activites || []).length + ') : ' + (H.activites || []).map(a => a.act + ' reel ' + a.reel).join(' ; '));
  dire('        decisionsParActivite : ' + dpa.map(k => k + ' → ' + (H.decisionsParActivite[k] || {}).choix).join(' ; ') + ' · decisionsParEcran (' + dpe.length + ') : ' + dpe.map(k => '« ' + titreDe(k) + ' » ' + (H.decisionsParEcran[k] || {}).choix).join(' ; '));
  dire('        appel ' + JSON.stringify(H.appel || {}).length + ' signes (' + Object.keys(H.appel || {}).length + ' élève(s)) · absents ' + JSON.stringify(H.absents || null) + ' · « Le bilan » a une décision : ' + dpe.includes('aud-bilan'));
  await pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(pg);
  const RL1 = await lireRelecture(pg, nom, '4b-relecture-apres-cloture'); const rel1 = RL1.recit; R0.rel1 = RL1; dire('  [' + nom + '] 4b · Relecture, le récit : « …' + RL1.presents + '… » · fin de « Mise en commun » : « ' + RL1.finRecit + ' » · « prochaine séance / reporté » : « ' + RL1.prochaine + ' » · onglet « Ce qui s’est passé » (' + RL1.ok + ') : l’appel « ' + RL1.appel + ' » · « ' + RL1.manque + ' »');
  const extr = (t, re, n = 260) => { const m = re.exec(t); return m ? t.slice(Math.max(0, m.index - 60), m.index + n) : '—'; };
  dire('  [' + nom + '] 4b · la Relecture après la clôture (' + rel1.length + ' signes) : présents « ' + extr(rel1, /présents/) + ' » · l’appel « ' + extr(rel1, /L'appel|L’appel/, 120) + ' » · reporté « ' + extr(rel1, /prochaine séance|report/i, 300) + ' »');
  /* l'EDT : la case du lundi (close), l'appel après coup (2 absents), la Relecture */
  await pg.keyboard.press('Escape').catch(() => {}); await p(500);
  const c2 = await caseEdt(pg, '2026-09-14'); await capt(pg, nom + '-5a-case-edt-apres-cloture'); R0.caseApres = c2; dire('  [' + nom + '] 5a · la case du lundi après la clôture : ' + c2.t.slice(0, 600) + ' · boutons (' + c2.btns.length + ')');
  let nAbs = 0; for (let k = 0; k < 2; k++) { const ok = await pg.evaluate(k => { const b = document.querySelectorAll('#edt-modale .edt-el')[k]; if (!b) return false; b.click(); return true; }, k); await p(1400); if (ok) nAbs++; }
  const c3t = (await texteDe(pg, '#edt-modale')) || ''; await capt(pg, nom + '-5b-case-edt-2-absents'); dire('  [' + nom + '] 5b · 2 clics sur 2 élèves : ' + nAbs + ' · « ' + extr(c3t, /Absents de cette heure/, 60) + ' » · au hub, absents : ' + JSON.stringify((heureHub().h || {}).absents || null).replace(/"[^"]+"/g, '«un élève»'));
  const rl = await pg.evaluate(() => { const b = document.querySelector('#edt-modale [data-relire]'); if (!b) return false; b.click(); return true; }); await p(3500); await garde(pg);
  const RL2 = await lireRelecture(pg, nom, '5c-relecture-apres-appel-edt'); const rel2 = RL2.recit + ' ' + RL2.passe; R0.rel2 = RL2; dire('  [' + nom + '] 5c · Relecture après l’appel par la case : le récit « …' + RL2.presents + '… » · l’appel « ' + RL2.appel + ' »');
  dire('  [' + nom + '] 5c · « Relire cette heure » : ' + rl + ' · la Relecture (' + rel2.length + ' signes) : présents « ' + extr(rel2, /présents/) + ' » · l’appel « ' + extr(rel2, /L'appel|L’appel/, 120) + ' » · « absent » ' + mots(rel2, /absent/gi) + ' fois');
  await pg.keyboard.press('Escape').catch(() => {}); await p(500); await fermerEdt(pg);
  /* la prochaine case de la classe */
  await pg.evaluate(() => edtOuvrir()); await p(2200); const cs = await casesCharles(pg); dire('  [' + nom + '] 6a · les cases de la classe test, semaine du 14/09 : ' + cs.map(c => c.t + ' {' + (c.oc.match(/20\d\d-\d\d-\d\d[^'"]*/) || [''])[0].slice(0, 40) + '}').join(' ‖ '));
  await capt(pg, nom + '-6a-edt-semaine'); const suiv = cs.map(c => (c.oc.match(/(20\d\d-\d\d-\d\d)/) || [])[1]).filter(j => j && j > '2026-09-14').sort()[0]; R0.suivante = suiv;
  const c4 = suiv ? await caseEdt(pg, suiv) : { t: '', btns: [] }; await capt(pg, nom + '-6b-case-suivante'); R0.caseSuiv = c4; dire('  [' + nom + '] 6b · la case suivante (' + suiv + ') : ' + c4.t.slice(0, 500) + ' · boutons : ' + c4.btns.join(' │ '));
  const errs1 = o.errs.concat(o.boites); await o.ctx.close();
  /* lancer cette heure-là, à son heure */
  if (suiv) { const crn = (c4.t.match(/(\d\d:\d\d)-(\d\d:\d\d)/) || [])[1] || '15:07'; const hm = crn.split(':').map(Number); const h2 = String(hm[0]).padStart(2, '0') + ':' + String(hm[1] + 3).padStart(2, '0');
    const o2 = await ouvrir({ fichier, h: h2, jour: suiv }); const c5 = await caseEdt(o2.pg, suiv); const l2 = await clicTexte(o2.pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await capt(o2.pg, nom + '-6c-heure-suivante-lancee');
    const ouv2 = await o2.pg.evaluate(() => { const x = document.getElementById('ecran-fin'); return x ? (x.innerText || '').replace(/\s+/g, ' ').slice(0, 900) : ''; }); const lh = await clicTexte(o2.pg, 'button', 'Lancer l'); await p(3000); if (!lh) { await o2.pg.keyboard.press('Escape'); await p(600); } dire('  [' + nom + '] 6c · « Lancer l’heure 1 » cliqué sur l’écran d’ouverture : ' + lh); await capt(o2.pg, nom + '-6d-heure-suivante-premiere-diapo');
    const inf = await o2.pg.evaluate(() => { let t = ''; try { t = seance().titre || ''; } catch (e) {} const E = seance().ecrans; return { si: S.si, heure: S.heure, titre: t, ordre: ordreHeure(S.heure).map(i => E[i].act || E[i].role), react: (E.find(e => e.role === 'reactivation') || {}).blocs }; });
    const d1 = await ici_(o2.pg); R0.heure2 = { lance: l2, inf, ouv2 };
    dire('  [' + nom + '] 6c · lancée à ' + suiv + ' ' + h2 + ' : ' + l2 + ' · séance (S.si) ' + inf.si + ' · l’écran d’ouverture : « ' + ouv2.slice(0, 400) + ' »');
    dire('  [' + nom + '] 6d · l’ordre de cette heure : ' + inf.ordre.join(' → ') + ' · la première diapo : ' + d1.numero + ' · la réactivation : ' + JSON.stringify(inf.react || null).slice(0, 600));
    dire('  [' + nom + '] 6d · les diapos reportées (« Groupe 2 : l’hypothèse »…) dans cette heure : ' + inf.ordre.filter(x => /^Groupe/.test(x)).length);
    errs1.push(...o2.errs, ...o2.boites); await o2.ctx.close(); }
  R0.errs = errs1; dire('  [' + nom + '] erreurs JS / boîtes : ' + (errs1.join(' ; ') || 'aucune')); S_[nom] = R0; return R0; };

/* §2.4, l'inverse : l'appel fait pendant l'heure (clic droit sur une pastille), puis la Relecture */
const appelPendant = async (fichier, nom) => { HUBN = ranger(store(null, trameDePaul)) || {}; ECR = []; REFUSES.length = 0; const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; await lancerClasse(o);
  const pas = await pg.$('#part [data-e]'); let menu = null, ok = false; if (pas) { await pas.click({ button: 'right' }); await p(700); menu = await pg.evaluate(() => { const m = document.getElementById('menu'); return m && m.classList.contains('on') ? Array.from(m.querySelectorAll('[data-a]')).map(b => (b.innerText || '').replace(/\s+/g, ' ').trim().replace(/—.*$/, '— un élève')) : null; }); await capt(pg, nom + '-7a-clic-droit-pastille'); ok = await pg.evaluate(() => { const b = document.querySelector('#menu [data-a="absent"]'); if (!b) return false; b.click(); return true; }); await p(1200); }
  const nb = await pg.evaluate(() => Object.keys(S.appel || {}).filter(e => (S.appel[e] || []).length).length); const pres = (await texteDe(pg, '#presents')) || '';
  dire('  [' + nom + '] 7a · clic droit sur une pastille : menu ' + JSON.stringify(menu) + ' · « Absent » cliqué : ' + ok + ' · S.appel : ' + nb + ' élève(s) · le compteur « ' + pres + ' »');
  await pg.click('#numero').catch(() => {}); for (let k = 0; k < 4; k++) { await pg.keyboard.press('ArrowRight'); await p(350); await garde(pg); }
  await pg.evaluate(() => document.getElementById('dr-clore').click()).catch(() => {}); await p(900); await pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }); await p(700);
  await pg.evaluate(() => { const g = document.getElementById('garde-clore'); if (g && g.classList.contains('on')) document.getElementById('gclore-oui').click(); }); await p(2500); await garde(pg);
  await pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(pg);
  const RL3 = await lireRelecture(pg, nom, '7b-relecture-appel-pendant'); const rel = RL3.recit + ' ' + RL3.passe; const H = heureHub().h || {}; dire('  [' + nom + '] 7b · Relecture (appel au clic droit) : le récit « …' + RL3.presents + '… » · l’appel « ' + RL3.appel + ' »');
  const extr = (t, re, n = 260) => { const m = re.exec(t); return m ? t.slice(Math.max(0, m.index - 60), m.index + n) : '—'; };
  dire('  [' + nom + '] 7b · clos ' + !!H.clos + ' · au hub, appel : ' + Object.keys(H.appel || {}).length + ' élève(s), absents : ' + JSON.stringify(H.absents || null) + ' · la Relecture : présents « ' + extr(rel, /présents/) + ' » · l’appel « ' + extr(rel, /L'appel|L’appel/, 160).replace(/[A-ZÉ][a-zé]+ — absent/g, 'un élève — absent') + ' » · « absent » ' + mots(rel, /absent/gi) + ' fois');
  dire('  [' + nom + '] 7b · erreurs : ' + (o.errs.concat(o.boites).join(' ; ') || 'aucune')); S_[nom + '-pendant'] = { rel, H: { appel: Object.keys(H.appel || {}).length } }; await o.ctx.close(); };

dire(''); dire('══ AUDIT DE LA FIN D’HEURE · ' + NOM + ' · md5 ' + md5(FICHIER) + ' ══');
await jouerHeure(FICHIER, NOM); dire(''); await appelPendant(FICHIER, NOM);
fs.writeFileSync(path.join(OUT, 'audit-' + NOM + '.txt'), anon(R.join('\n')) + '\n'); fs.writeFileSync(path.join(OUT, 'audit-' + NOM + '.json'), anon(JSON.stringify(S_, null, 1)));
await nav.close(); process.exit(0);
