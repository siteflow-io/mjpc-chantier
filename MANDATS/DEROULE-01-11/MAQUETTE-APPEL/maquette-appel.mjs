// LA MAQUETTE DE L'APPEL AU LANCEMENT (C16 222, ㊱) — le fichier en ligne + MANDATS/DEROULE-01-11/MAQUETTE-APPEL/injection.html, sous le faux hub des sondes
// (la partie haute de AUDIT-FIN-HEURE/sonde-audit.mjs). usage : MJPC_RACINE=<un arbre du sas qui porte DIAPOS-OUVERTURE/hub-ouverture.mjs> node maquette-appel.mjs <maquette.html> <sortie>
// MJPC_MEDIAS, MJPC_CAPT comme les sondes. Aucune écriture au vrai hub. Captures : appel-1a… (jamais poussées).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = process.env.MJPC_RACINE || path.resolve(ici, '..', '..', '..');
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
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.stack || e.message).slice(0, 700))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
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
const NOMM = 'appel';
const presents = pg => pg.evaluate(() => { const x = document.getElementById('presents'); return x ? (x.innerText || '').replace(/\s+/g, ' ').trim() : ''; });
const clore = async pg => { await pg.evaluate(() => { const b = document.getElementById('dr-clore'); if (b) b.click(); }).catch(() => {}); await p(900); await pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }); await p(700);
  await pg.evaluate(() => { const g = document.getElementById('garde-clore'); if (g && g.classList.contains('on')) document.getElementById('gclore-oui').click(); }); await p(2500); await garde(pg); };
const extr = (t, re, n = 260) => { const m = re.exec(t); return m ? t.slice(Math.max(0, m.index - 60), m.index + n) : '—'; };
/* 1 · l'appel au lancement */
const auLancement = async fichier => { HUBN = ranger(store(null, trameDePaul)) || {}; ECR = []; REFUSES.length = 0;
  const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const pg = o.pg;
  const c0 = await caseEdt(pg, '2026-09-14'); await capt(pg, NOMM + '-1a-case-appel'); dire('  1a · la case du lundi (avant de lancer) : ' + anon(c0.t).slice(0, 500));
  verif('1', /L’appel — absents \(0 sur \d+\)/.test(c0.t), 'la case d’une heure à venir s’ouvre sur l’appel', extr(c0.t, /L’appel/, 120));
  let n = 0; for (let k = 0; k < 2; k++) { const ok = await pg.evaluate(k => { const b = document.querySelectorAll('#maq-appel .edt-el')[k]; if (!b) return false; b.click(); return true; }, k); await p(700); if (ok) n++; }
  const c1 = (await texteDe(pg, '#edt-modale')) || ''; await capt(pg, NOMM + '-1b-case-2-absents');
  verif('1', /absents \(2 sur \d+\)/.test(c1) && /appel fait : 2 absents/.test(c1), 'deux clics : 2 absents, le bouton dit « appel fait : 2 absents »', anon(extr(c1, /L’appel/, 60)) + ' · ' + extr(c1, /appel fait/, 40));
  const l = await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape'); await p(1500); await capt(pg, NOMM + '-1c-premiere-diapo');
  const pr = await presents(pg); const nb = await pg.evaluate(() => Object.keys(S.appel || {}).filter(e => (S.appel[e] || []).some(x => x.type === 'absent')).length);
  verif('1', l && nb === 2, 'l’heure lancée porte les 2 absents dès la première diapo', '« ' + pr + ' » · S.appel : ' + nb);
  await clore(pg); await pg.evaluate(() => { const b = document.getElementById('dr-clos-relire'); if (b) b.click(); }).catch(() => {}); await p(3500); await garde(pg);
  const RL = await lireRelecture(pg, NOMM, '1d-relecture'); const rel = RL.recit + ' ' + RL.passe;
  verif('1', mots(rel, /absent/gi) >= 2 && !/tous présents/.test(rel), 'la Relecture dit les 2 absents', anon('présents « ' + extr(rel, /présents/, 80) + ' » · l’appel « ' + extr(rel, /L'appel|L’appel/, 160) + ' »'));
  sansErreur('1', o.errs.concat(o.boites), 'l’appel au lancement'); await o.ctx.close(); };
/* 2 · l'appel fait après coup, dans la case d'une heure close */
const apresCoup = async fichier => { HUBN = ranger(store(null, trameDePaul)) || {}; ECR = []; REFUSES.length = 0;
  const o = await ouvrir({ fichier, h: '09:00', jour: '2026-09-14' }); const pg = o.pg; await lancerClasse(o); await pg.click('#numero').catch(() => {});
  for (let k = 0; k < 4; k++) { await pg.keyboard.press('ArrowRight'); await p(350); await garde(pg); }
  await clore(pg); await pg.keyboard.press('Escape').catch(() => {}); await p(500);
  await caseEdt(pg, '2026-09-14'); let n = 0; for (let k = 0; k < 2; k++) { const ok = await pg.evaluate(k => { const b = document.querySelectorAll('#edt-modale .edt-el')[k]; if (!b) return false; b.click(); return true; }, k); await p(1400); if (ok) n++; }
  await capt(pg, NOMM + '-2a-case-close-2-absents');
  await pg.evaluate(() => { const b = document.querySelector('#edt-modale [data-relire]'); if (b) b.click(); }); await p(3500); await garde(pg);
  const RL = await lireRelecture(pg, NOMM, '2b-relecture-apres-coup'); const rel = RL.recit + ' ' + RL.passe;
  verif('2', n === 2 && mots(rel, /absent/gi) >= 2 && !/tous présents/.test(rel), 'l’appel fait après coup (2 absents dans la case) corrige la Relecture', anon('présents « ' + extr(rel, /présents/, 80) + ' » · l’appel « ' + extr(rel, /L'appel|L’appel/, 160) + ' »'));
  sansErreur('2', o.errs.concat(o.boites), 'l’appel après coup'); await o.ctx.close(); };
dire(''); dire('══ LA MAQUETTE DE L’APPEL · md5 ' + md5(FICHIER) + ' ══');
await auLancement(FICHIER); dire(''); await apresCoup(FICHIER);
dire(''); dire(nb + ' vérifications, ' + echecs + ' échec(s)');
fs.writeFileSync(path.join(OUT, 'maquette-appel.txt'), anon(R.join('\n')) + '\n');
await nav.close(); process.exit(0);
