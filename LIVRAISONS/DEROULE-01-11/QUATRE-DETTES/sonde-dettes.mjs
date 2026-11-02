// LA SONDE DES QUATRE DETTES (MANDATS/DEROULE-01-11/MANDAT-QUATRE-DETTES.md §5.1, points 1 à 5 de §3) — par le geste. Le modèle : RETOUR-SUR/sonde-retour.mjs
// (ses parties R, I, T, B, X, G sont reprises telles quelles : le faux hub vit dans la sonde, tous les navigateurs le partagent — la nouvelle version, la
// 8.77.1-⑩ = l'assemblé de fc036e8, le tableau distant `?vue=tableau`).
// usage : node sonde-dettes.mjs <assemble/index.html> [dossier-de-sortie]
//   MJPC_PARTIES (défaut E,Q,P,M,G) · MJPC_HUB=vrai : le faux hub rangé comme le vrai (§3.2 ; avec MJPC_PARTIES=R,I,T,B,X,Z) · MJPC_AVANT=<assemblé d'avant> :
//   les comparaisons avant / après (G, M) · MJPC_MEDIAS=<dossier> : les vraies images du chapitre (jamais poussées) · MJPC_CAPT=<dossier> : les captures
//   (jamais poussées) · MJPC_ANCIENNE=<fichier> : la 8.77.1-⑩ · MJPC_TAILLES (défaut 1366x768,1536x864,1920x1080) · MJPC_PILE=1 : la pile des erreurs JS.
//  E · (§3.1) « À écrire » : la nouvelle version le pose dans l'Atelier sur l'objectif du début de séance ; la 8.77.1-⑩ le voit sur la même ligne dans son
//      Atelier ; la nouvelle lance l'heure ; la 8.77.1-⑩ la reprend (« Reprendre ») : la même ligne, au pilote et à la fenêtre du tableau ; elle la retire et
//      pose « à écrire » sur la ligne suivante ; la nouvelle reprend : exactement ce que la 8.77.1-⑩ a laissé, au pilote, au tableau, au tableau distant.
//  R, I, T, B, X sous MJPC_HUB=vrai (§3.2) ; Z · le témoin : la 8.77.1-⑩ seule commence l'heure et la reprend (ce qu'elle fait elle-même sur ce hub).
//  Q · (§3.3) la taxonomie retardée de 7 s ; « ✎ Préparer » de la case ; le début de séance renommé ; la page quittée avant elle (le rechargement 2 s après,
//      l'onglet fermé 0,4 s après) ; la 8.77.1-⑩ ouvre la séance dans l'Atelier et lance l'heure : rien de vide, rien d'incomplet ; la nouvelle rouvre : le geste.
//  P · (§3.4) le schéma « tableau » plus haut qu'une diapo : les cinq œuvres avec « Ce que j'en retiens », les douze vers de « Demain, dès l'aube » ; aux trois
//      tailles, en classe (pilote, fenêtre du tableau, tableau distant ; Maj + → de page en page ; la molette, en jeu, ne change pas de page — ⑱), en répétition, dans
//      l'Atelier : chaque rangée une fois, l'en-tête sur chaque page, aucune case coupée, la police inchangée.
//  M · (§3.5) l'image pleine et la marge du fil : les cinq images de l'heure 1 (séance 1, 3e), tout dévoilé, au pilote, à la fenêtre du tableau, au tableau
//      distant, dans l'Atelier : aucune coupée, aucune sous le fil ; avant / après : une image qui tenait garde sa taille, les repères aux mêmes points.
//  G · (§3.5 du retour sûr, repris pour §3.4) le tableau des cinq œuvres et le tableau court : identiques avant / après (MJPC_AVANT).
// Aucune erreur JS, aucune boîte système, dans chaque cas. Code 1 si un échec.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto'; import { execSync } from 'child_process';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-dettes.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + (typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 900) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'E,Q,P,M,G').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;   /* les vraies images du chapitre (un dossier local, jamais poussé) ; sinon l'image du canon */
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');

/* la 8.77.1-⑩ : l'assemblé de fc036e8 (la production à APP_VERSION près) */
let ANC = process.env.MJPC_ANCIENNE || null; let ancTiree = false;
if (!ANC) { try { ANC = path.join(OUT, '_ancienne-8.77.1.html'); fs.writeFileSync(ANC, execSync('git -C "' + RACINE + '" show fc036e8:LIVRAISONS/INTEGRATION/assemble/index.html', { maxBuffer: 1e8 })); ancTiree = true; } catch (e) { ANC = null; } }
dire('C16 · sonde des quatre dettes · hub ' + (/^vrai$/i.test(process.env.MJPC_HUB || '') ? 'rangé comme le vrai' : 'ordinaire') + ' · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · nouvelle version md5 ' + md5(FICHIER) + ' · 8.77.1-⑩ md5 ' + (ANC && fs.existsSync(ANC) ? md5(ANC) : '—'));

/* ── la séance 1 du faux hub, réaliste (comme sonde-fil.mjs) : dans l'heure 1, « Tableau 2 » devient le tableau des cinq œuvres ── */
const LONG = 'Tableau | Peintre | Ce qu’on voit\n'   /* une phrase par cellule : le tableau que l'exécutant du fil a mesuré (NOTE du fil §3.3) */
  + 'Le Radeau de la Méduse (1819) | Théodore Géricault | des naufragés perdus sur une mer immense\n'
  + 'Le lac (1863) | Albert Bierstadt | des montagnes immenses dans une lumière dorée\n'
  + 'Pêcheurs en mer (1796) | William Turner | une barque prise dans la tempête, la nuit\n'
  + 'Cathédrale gothique au bord de l’eau (1813) | Karl Friedrich Schinkel | une cathédrale au soleil couchant\n'
  + 'Le Voyageur contemplant une mer de nuages (1818) | Caspar David Friedrich | un homme seul, de dos, face aux nuages';
const COURT = 'Tableau | Peintre | Ce qu’on voit\nLe Radeau de la Méduse | Géricault | des naufragés\nLe lac | Bierstadt | des montagnes immenses\nPêcheurs en mer | Turner | une tempête la nuit\nLa ville au bord de l’eau | Schinkel | une cathédrale\nLe Voyageur | Friedrich | un homme de dos';
const sk0 = st => { const S0 = st.site['3e'].chapitres[0].seances; return Object.keys(S0).filter(k => S0[k] && S0[k].type !== 'sommaire').sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); };
const store = (src = LONG) => { const st = storeOuverture(RACINE, { champs: true }); const ch = st.site['3e'].chapitres[0];
  const E = ch.seances[sk0(st)[0]].deroule.ecrans; const t2 = E.find(e => e && e.act === 'Tableau 2');
  if (t2) { t2.act = 'Les cinq tableaux'; t2.blocs = [{ t: 'schema', forme: 'tableau', id: 'bsonde-tab', titre: 'Les cinq tableaux', src }]; }
  return st; };

/* ── le faux hub partagé (Node) : chaque navigateur y lit et y écrit ; `RETARD` retarde une adresse (la taxonomie) ──
   MJPC_HUB=vrai (§3.2 du mandat des quatre dettes) : le faux hub range ce qu'on lui écrit COMME LE VRAI (Firebase Realtime Database). La règle, d'après la
   documentation publique de Firebase (« Read and Write Data » / « Structure your data », et le billet de l'équipe Firebase « Best Practices: Arrays in Firebase »,
   04/2014 — la page n'a pas pu être relue par WebFetch cette nuit : son adresse n'est pas autorisée dans la session ; règle citée telle que le mandat la donne) :
   « Firebase Realtime Database does not natively support arrays. If you try to store an array, it really gets stored as an "object" with integers as the key
   names. However, […] if all of the keys are integers, and more than half of the keys between 0 and the maximum key in the object have non-empty values, then
   Firebase will render it as an array. » ; une valeur null efface la clé ; un objet ou une liste vides ne sont pas rangés (ils disparaissent, et leur parent
   devenu vide aussi). Rangé : des objets seulement (clés "0", "1"…) ; relu : la règle ci-dessus, à chaque niveau (les trous valent null). */
const VRAI = /^vrai$/i.test(process.env.MJPC_HUB || '');
const ranger = v => { if (v === null || v === undefined) return undefined; if (typeof v === 'number' && !isFinite(v)) return undefined; if (typeof v !== 'object') return v;
  const o = {}; (Array.isArray(v) ? v.map((x, i) => [String(i), x]) : Object.entries(v)).forEach(([k, x]) => { const r = ranger(x); if (r !== undefined) o[k] = r; });
  return Object.keys(o).length ? o : undefined; };
const relire = v => { if (v === null || v === undefined || typeof v !== 'object') return v; const K = Object.keys(v); const o = {}; K.forEach(k => { o[k] = relire(v[k]); });
  if (K.length && K.every(k => /^(0|[1-9]\d*)$/.test(k))) { const max = Math.max(...K.map(Number)); if (K.length * 2 > max + 1) { const a = new Array(max + 1).fill(null); K.forEach(k => { a[+k] = o[k]; }); return a; } }
  return o; };
/* C16 (les correctifs, ㉘) : rangé comme le vrai, le faux hub REFUSE aussi, comme le vrai, toute clé qui porte . # $ [ ] / (ou vide, ou un caractère de contrôle), à chaque
   niveau du corps écrit, en PUT et en PATCH (les clés de tête d'un PATCH sont des chemins), et tout morceau d'adresse qui en porte : HTTP 400, rien n'est rangé
   (le modèle : CORRECTIFS/sonde-correctifs.mjs). Chaque refus est compté dans `REFUSES` et dit à la fin. */
const REFUSES = []; const CLE_KO = /[.#$\[\]\/\u0000-\u001F\u007F]/;
const cleFautive = (v, ch) => { if (v && typeof v === 'object') for (const k of Object.keys(v)) { if (k === '' || CLE_KO.test(k)) return ch + '/' + k; const r = cleFautive(v[k], ch + '/' + k); if (r) return r; } return null; };
const refusDe = (m, c, bd) => { if (c.split('/').filter(Boolean).some(x => /[.#$\[\]\u0000-\u001F\u007F]/.test(x))) return 'adresse « ' + c + ' »';
  if (m === 'PATCH' && bd && typeof bd === 'object') { for (const k of Object.keys(bd)) { if (k.split('/').some(x => /[.#$\[\]\u0000-\u001F\u007F]/.test(x))) return 'clé de tête « ' + k + ' »'; const r = cleFautive(bd[k], c + '/' + k); if (r) return r; } return null; } return cleFautive(bd, c); };
const hubDe = st => VRAI ? (ranger(st) || {}) : st;
let HUBN = null; let ECR = []; const RETARD = {};
const lireH0 = c => { const q = c.split('/').filter(Boolean); let n = HUBN; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
const lireH = c => { const n = lireH0(c); return VRAI ? (n == null ? null : relire(n)) : n; };
const posH = (c, v) => { const q = c.split('/').filter(Boolean); if (VRAI) v = ranger(v); if (v === undefined) v = null;
  let n = HUBN; const pile = [n]; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) { if (v === null) return; n[q[k]] = {}; } n = n[q[k]]; pile.push(n); }
  if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v;
  if (VRAI && v === null) for (let k = q.length - 2; k >= 0; k--) { if (pile[k + 1] && typeof pile[k + 1] === 'object' && !Object.keys(pile[k + 1]).length) delete pile[k][q[k]]; else break; } };
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') { const d = Object.keys(RETARD).find(x => c === x || c.startsWith(x + '/')); if (d) await p(RETARD[d]); return JSON.stringify(lireH(c)); }
  let bd = null; try { bd = JSON.parse(corps || 'null'); } catch (e) {} if (VRAI) { const ko = refusDe(m, c, bd); if (ko) { REFUSES.push({ qui, m, c, ko }); ECR.push({ qui, m, c, t: Date.now(), refus: true }); return '§400§' + JSON.stringify({ error: 'Invalid data; ' + ko }); } } ECR.push({ qui, m, c, t: Date.now(), bd });
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => /^§400§/.test(t) ? new Response(t.slice(5), { status: 400 }) : new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async ({ qui = 'pilote', fichier = FICHIER, W = 1536, H = 864, q = '?n=3e', test = false, prof = true, h = '09:00' }) => {   /* h : l'heure de la montre (le temps passe d'une reprise à l'autre) */
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [], quitter = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); const m = /mjpc-medias\/.*\/([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (m) { const vraie = MEDIAS && fs.existsSync(path.join(MEDIAS, m[1])) ? path.join(MEDIAS, m[1]) : null; return r.fulfill({ path: vraie || IMG_OUV[m[1]] || IMG_DEFAUT, contentType: vraie ? (/\.webp$/i.test(vraie) ? 'image/webp' : /\.png$/i.test(vraie) ? 'image/png' : 'image/jpeg') : 'image/png' }); } return r.abort(); });
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200) + (process.env.MJPC_PILE ? ' @ ' + String(e.stack || '').split('\n').slice(1, 4).join(' | ').slice(0, 400) : ''))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { quitter.push(1); d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });   /* « Quitter le site ? » du navigateur (F5, l'onglet fermé pendant l'heure) : Paul confirme ; compté à part */
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(new Date('2026-09-14T' + h + ':00+02:00'));
  await pg.goto('file://' + fichier + q, { waitUntil: 'load' }); await p(1800);
  if (prof) { await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }); await p(300);
    if (prof !== 'portail') { await pg.click('#tprof-btn'); await p(600); } if (test) await pg.evaluate(() => { window.M8_TEST = true; }); }
  return { ctx, pg, errs, boites, qui, quitter }; };
const capt = async (pg, nom) => { if (CAPT && pg) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansErreur = (k, o, quoi) => verif(k, !o.errs.length && !o.boites.length, quoi + ' : aucune erreur JS, aucune boîte système', o.errs.concat(o.boites).join(' ; '));
/* l'heure de la classe, par la case de l'emploi du temps (le bouton « Emploi du temps », la case, « ▶ Ouvrir le pilotage et lancer ») ; la fenêtre du tableau */
const lancerClasse = async (o, jour = '2026-09-14') => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'edtOuvrir()'))) await pg.evaluate(() => edtOuvrir()); await p(1500);
  const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!c) return false; c.click(); return true; }, jour); await p(800);
  const l = ok && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape'); await p(400); return !!l; };
/* Paul recharge la page : le bandeau « Heure en cours avec les 3E Charles de Gaulle — Reprendre » (sinon la case de l'emploi du temps) */
const reprendre = async o => { const pg = o.pg; const b = await pg.waitForSelector('#ses-reprise-oui', { state: 'visible', timeout: 9000 }).then(() => pg.click('#ses-reprise-oui')).then(() => true).catch(() => false);
  if (!b) return { par: 'case', ok: await lancerClasse(o) }; await p(3500); await pg.keyboard.press('Escape'); await p(400); return { par: 'bandeau', ok: true }; };
const ouvrirTableau = async (o, W = 1280, H = 720) => { if (!(await o.pg.isVisible('#bvideoproj').catch(() => false))) return null; const [fen] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), o.pg.click('#bvideoproj')]); await p(1500); if (fen) await fen.setViewportSize({ width: W, height: H }); await o.pg.bringToFront(); return fen; };
const ouvrirAtelier = async o => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'atelierOuvrir()'))) await pg.evaluate(() => atelierOuvrir()); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(3000); };
/* ce que la page montre */
const ici_ = pg => pg.evaluate(() => { const v = document.querySelector('#volet .vig.cour'); const c = document.getElementById('compte'); const m = document.getElementById('mur'); let eid = null; try { eid = seance().ecrans[S.di].eid; } catch (e) {}
  return { vig: v ? v.dataset.i : null, eid, compte: c ? c.textContent.trim() : '', numero: ((document.getElementById('numero') || {}).textContent || '').replace(/\s+/g, ' ').trim(), garde: !!(document.getElementById('garde') || { classList: { contains: () => false } }).classList.contains('on'),
    texte: m ? (m.innerText || '').replace(/\s+/g, ' ').trim() : '', ouv: m && m.querySelector(':scope > .ouv') ? m.querySelector(':scope > .ouv').className : '', illisible: /Objet non lisible/.test((document.body.innerText || '')) }; });
const murDe = (pg, sel) => pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; const o = m.querySelector('.ouv'); return { texte: (m.innerText || '').replace(/\s+/g, ' ').trim(), ouv: o ? o.className : '', illisible: /Objet non lisible/.test(m.innerText || '') }; }, sel);
const vignettes = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet .vig')).map(v => ({ i: v.dataset.i, pg: v.dataset.pg, t: (v.innerText || '').replace(/\s+/g, ' ').trim() })));
const eidsDe = pg => pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid, role: e.role || '', act: e.act })); } catch (e) { return []; } });
/* aller à une diapo par sa vignette (la garde : « Y aller devant la classe ») */
const allerA = async (pg, eid) => { const L = await eidsDe(pg); const x = L.find(e => e.eid === eid); if (!x) return false; const v = await pg.$('#volet .vig[data-i="' + x.i + '"]'); if (!v) return false;
  await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); if (await pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) { await pg.click('#garde-devant'); await p(900); } return true; };
const copieDe = (sk, slug = null) => { const se = lireH('/site/3e/chapitres/0/seances/' + sk) || {}; const dj = se.deroule_joue || {}; const k = slug || Object.keys(dj)[0]; return k ? Object.assign({ slug: k }, dj[k]) : null; };
const ROLES_OUV = ['presentation-chapitre', 'competences-chapitre', 'plan', 'presentation-seance', 'problematique', 'competences-bilan'];

/* ═══ R · (§3.1) une heure commencée avec la nouvelle version, reprise dans la 8.77.1-⑩, puis de nouveau dans la nouvelle ═══ */
if (joue('R') && ANC) { dire(''); dire('══ R · 1536×864 · hors mode test · la nouvelle version commence l’heure, la 8.77.1-⑩ la reprend, la nouvelle revient ══');
  HUBN = hubDe(store()); ECR = []; const k0 = sk0(HUBN)[0];
  /* R1 · la nouvelle version : le tableau distant attend, l'heure se lance, ▶ jusqu'à la première activité */
  let T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1500);
  let o = await ouvrir({}); verif('R', await lancerClasse(o), 'R1 · la nouvelle version : l’heure se lance par la case de l’emploi du temps (« ▶ Ouvrir le pilotage et lancer »), hors mode test');
  let fen = await ouvrirTableau(o); await o.pg.click('#numero'); await p(300);
  const vus = {}; const tabVus = {}; let n = 0, ecritK = false;
  while (n++ < 60) { const s = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s.eid) || {}).role;
    if (!ROLES_OUV.includes(role)) break;
    vus[role] = { compte: s.compte, ouv: s.ouv, texte: s.texte, eid: s.eid };
    const fini = /^(\d+) \/ \1 dévoilés/.test(s.compte);
    if (fini) { await p(1500); tabVus[role] = await murDe(T.pg, 'body'); const f2 = await murDe(fen, '#mur2'); vus[role].fen = f2;
      if (role === 'plan' && !ecritK) { /* la classe écrit dans le parcours : l'objectif de la séance 1 (un clic sur son texte, la frappe, Échap) */
        const x = await o.pg.$('#mur > .ouv [data-p="0.1"]'); if (x) { await x.click(); await p(300); await o.pg.keyboard.press('Control+End'); await o.pg.keyboard.type(' (à revoir ensemble)', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(800); ecritK = true; }
        vus[role].apres = (await ici_(o.pg)).texte; await o.pg.click('#numero').catch(() => {}); await p(200); }
      await capt(o.pg, 'R1-nouvelle-' + role + '-pilote'); if (fen) await capt(fen, 'R1-nouvelle-' + role + '-tableau'); await capt(T.pg, 'R1-nouvelle-' + role + '-distant'); }
    await o.pg.keyboard.press('ArrowRight'); await p(350); }
  await p(2500); const posN = await ici_(o.pg); await capt(o.pg, 'R1-nouvelle-premiere-activite');
  if (process.env.MJPC_DUMP) { fs.writeFileSync(process.env.MJPC_DUMP, JSON.stringify({ HUBN, ECR })); if (process.env.MJPC_DUMP_FIN) { await nav.close(); process.exit(0); } }
  const rolesVus = Object.keys(vus); const C1 = copieDe(k0); const E1 = (C1 && C1.ecrans) || [];
  verif('R', rolesVus.length >= 5 && rolesVus.every(r => /^ouv /.test(vus[r].ouv)) && !ROLES_OUV.includes(((await eidsDe(o.pg)).find(e => e.eid === posN.eid) || {}).role), 'R1 · ▶ passe les diapos d’ouverture au canon (' + rolesVus.join(', ') + ') jusqu’à la première activité (« ' + posN.numero.slice(0, 60) + ' »)', rolesVus.map(r => r + ' ' + vus[r].compte));
  verif('R', ecritK && /\(à revoir ensemble\)/.test(vus.plan && vus.plan.apres || ''), 'R1 · la classe écrit dans le parcours, en classe (un clic sur l’objectif de la séance 1) : « (à revoir ensemble) » au pilote', (vus.plan || {}).apres ? vus.plan.apres.slice(0, 200) : '');
  verif('R', rolesVus.every(r => vus[r].fen && /^ouv /.test(vus[r].fen.ouv) && !vus[r].fen.illisible) && rolesVus.every(r => tabVus[r] && /\bouv\b/.test(tabVus[r].ouv) && !tabVus[r].illisible), 'R1 · chaque diapo d’ouverture au canon à la fenêtre du tableau ET au tableau distant (la copie relue du hub : le canon)', rolesVus.map(r => r + ' fen:' + (vus[r].fen || {}).ouv + ' distant:' + (tabVus[r] || {}).ouv));
  const ouvAuHub = E1.filter(e => (e.blocs || []).some(b => b && b.t === 'ouverture')).map(e => e.role); const lis = E1.filter(e => ROLES_OUV.includes(e.role) && e.ouvCanon && (e.blocs || [])[0] && e.blocs[0].t === 'texte');
  verif('R', E1.length && !ouvAuHub.length && lis.length >= 5, 'R1 · au hub, la copie de la classe (' + E1.length + ' diapos) : aucun bloc « ouverture » (ce que la 8.77.1-⑩ dit « Objet non lisible ») ; ' + lis.length + ' diapos d’ouverture en un bloc de texte lisible, le canon sous « ouvCanon »', { ouverture: ouvAuHub, lisibles: lis.map(e => e.role + ' ' + e.blocs[0].el.length + ' ligne(s)') });
  const S1 = ((C1 || {}).etat || {}).S || {}; const cp1 = JSON.stringify(S1.copie || {}); verif('R', /à revoir ensemble/.test(cp1) && /ouvEl/.test(cp1), 'R1 · au hub, l’état de l’heure : ce que la classe a écrit dans le parcours, en ligne lisible (« titre — objectif ») et en textes sous « ouvEl »', cp1.slice(0, 400));
  sansErreur('R', o, 'R1 · la nouvelle version'); sansErreur('R', T, 'R1 · le tableau distant'); await o.ctx.close(); await T.ctx.close();
  /* R2 · la 8.77.1-⑩ remise en ligne : Paul recharge et reprend la même heure */
  o = await ouvrir({ fichier: ANC, h: '09:03' }); const rA = await reprendre(o); const lanceA = rA.ok && rA.par === 'bandeau'; await capt(o.pg, 'R2-ancienne-apres-lancer'); fen = await ouvrirTableau(o); await p(1500);
  const posA = await ici_(o.pg); const vigA = await vignettes(o.pg); await capt(o.pg, 'R2-ancienne-reprise'); if (fen) await capt(fen, 'R2-ancienne-reprise-tableau');
  verif('R', lanceA && posA.eid === posN.eid && posA.compte === posN.compte, 'R2 · Paul recharge : la 8.77.1-⑩ reprend l’heure (« Reprendre », le bandeau « Heure en cours ») là où Paul en était : la même diapo, le même compteur', { nouvelle: [posN.eid, posN.compte], ancienne: [posA.eid, posA.compte] });
  verif('R', !posA.illisible && !vigA.some(v => /non lisible/i.test(v.t)), 'R2 · aucune « Objet non lisible » au pilote (la diapo, les ' + vigA.length + ' vignettes)', vigA.filter(v => /non lisible/i.test(v.t)).map(v => v.i));
  const lusA = {}; for (const r of rolesVus) { await allerA(o.pg, vus[r].eid); await p(600); const s = await ici_(o.pg); const f = fen ? await murDe(fen, '#mur2') : null; lusA[r] = { s, f }; await capt(o.pg, 'R2-ancienne-' + r + '-pilote'); if (fen) await capt(fen, 'R2-ancienne-' + r + '-tableau'); }
  const att = { 'presentation-chapitre': /Poésie|poésie/, 'competences-chapitre': / : /, plan: /\(à revoir ensemble\)/, 'presentation-seance': /Observer cinq tableaux/, problematique: /\?/ };
  verif('R', rolesVus.every(r => lusA[r].s.texte && !lusA[r].s.illisible && !lusA[r].s.ouv && (!att[r] || att[r].test(lusA[r].s.texte)) && lusA[r].f && !lusA[r].f.illisible && lusA[r].f.texte.length > 10), 'R2 · les diapos d’ouverture déjà montrées : leurs textes au pilote et à la fenêtre du tableau (en texte, la 8.77.1-⑩ n’a pas le canon), dont ce que la classe a écrit dans le parcours', rolesVus.map(r => r + ' « ' + lusA[r].s.texte.slice(0, 90) + ' » | tableau « ' + ((lusA[r].f || {}).texte || '').slice(0, 50) + ' »'));
  verif('R', rolesVus.every(r => lusA[r].s.compte === vus[r].compte), 'R2 · le compteur de chaque diapo d’ouverture : le même que dans la nouvelle version (ce qui est dévoilé se relit juste)', rolesVus.map(r => r + ' ' + vus[r].compte + ' | ' + lusA[r].s.compte));
  /* la classe écrit dans le parcours de la 8.77.1-⑩ : la ligne de la séance 2 */
  await allerA(o.pg, vus.plan.eid); const l2 = await o.pg.$$('#mur [data-p]'); let ecritA = false; { const cand = await o.pg.$$eval('#mur [data-p]', xs => xs.map(x => x.getAttribute('data-p'))); const h = await o.pg.$('#mur [data-p="0.2"]'); if (h) { await h.click(); await p(300); await o.pg.keyboard.press('Control+End'); await o.pg.keyboard.type(' (avec Friedrich)', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(1200); ecritA = /\(avec Friedrich\)/.test((await ici_(o.pg)).texte); } dire('      R2 · le parcours dans la 8.77.1-⑩ : ses textes ' + JSON.stringify(cand)); }
  verif('R', ecritA, 'R2 · la classe écrit dans le parcours de la 8.77.1-⑩ (la ligne de la séance 3, dont le titre contient « — » : « Interro de cours et analyse logique — les bases (1) ») : « (avec Friedrich) »');
  await allerA(o.pg, posA.eid); await o.pg.click('#numero').catch(() => {}); for (let k = 0; k < 3; k++) { await o.pg.keyboard.press('ArrowRight'); await p(400); } await p(2500); const posA2 = await ici_(o.pg); await capt(o.pg, 'R2-ancienne-continue');
  verif('R', posA2.compte !== posA.compte || posA2.eid !== posA.eid, 'R2 · ▶ continue dans la 8.77.1-⑩', { avant: [posA.eid, posA.compte], apres: [posA2.eid, posA2.compte] });
  const C2 = copieDe(k0); verif('R', (C2.ecrans || []).filter(e => e.ouvCanon).length === lis.length, 'R2 · la 8.77.1-⑩ réécrit la copie au hub en gardant « ouvCanon » (sans le lire)', (C2.ecrans || []).filter(e => e.ouvCanon).map(e => e.role));
  sansErreur('R', o, 'R2 · la 8.77.1-⑩'); await o.ctx.close();
  /* R3 · la nouvelle version revient */
  T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false, h: '09:06' }); await p(1500);
  o = await ouvrir({ h: '09:06' }); const rN = await reprendre(o); const lanceN = rN.ok && rN.par === 'bandeau'; fen = await ouvrirTableau(o); await p(1500); const posN2 = await ici_(o.pg); await capt(o.pg, 'R3-nouvelle-reprise');
  verif('R', lanceN && posN2.eid === posA2.eid && posN2.compte === posA2.compte && !posN2.illisible, 'R3 · la nouvelle version reprend là où la 8.77.1-⑩ en était (la même diapo, le même compteur)', { ancienne: [posA2.eid, posA2.compte], nouvelle: [posN2.eid, posN2.compte] });
  const lusN = {}; for (const r of rolesVus) { await allerA(o.pg, vus[r].eid); await p(1800); lusN[r] = { s: await ici_(o.pg), f: fen ? await murDe(fen, '#mur2') : null, t: await murDe(T.pg, 'body') }; await capt(o.pg, 'R3-nouvelle-' + r + '-pilote'); if (fen) await capt(fen, 'R3-nouvelle-' + r + '-tableau'); await capt(T.pg, 'R3-nouvelle-' + r + '-distant'); }
  verif('R', rolesVus.every(r => lusN[r].s.ouv === vus[r].ouv && lusN[r].f && lusN[r].f.ouv === vus[r].fen.ouv && lusN[r].t && /\bouv\b/.test(lusN[r].t.ouv) && !lusN[r].t.illisible), 'R3 · le canon de chaque diapo d’ouverture au pilote, à la fenêtre du tableau et au tableau distant', rolesVus.map(r => r + ' ' + lusN[r].s.ouv + ' | ' + ((lusN[r].f || {}).ouv) + ' | ' + ((lusN[r].t || {}).ouv)));
  verif('R', rolesVus.every(r => lusN[r].s.compte === vus[r].compte), 'R3 · le compteur de chaque diapo d’ouverture, juste', rolesVus.map(r => r + ' ' + vus[r].compte + ' | ' + lusN[r].s.compte));
  const pl = await (async () => { await allerA(o.pg, vus.plan.eid); await p(800); return o.pg.evaluate(() => ({ s1: ((document.querySelector('#mur > .ouv [data-p="0.1"]') || {}).textContent || ''), s2: ((document.querySelector('#mur > .ouv [data-p="0.5"]') || {}).textContent || ''), t3: ((document.querySelector('#mur > .ouv [data-p="0.4"]') || {}).textContent || ''), t: (document.getElementById('mur').innerText || '').replace(/\s+/g, ' ') })); })();
  const plT = await murDe(T.pg, 'body'); await capt(o.pg, 'R3-nouvelle-parcours-ecrit'); await capt(T.pg, 'R3-nouvelle-parcours-ecrit-distant');
  verif('R', /\(à revoir ensemble\)$/.test(pl.s1.trim()) && /^Réciter les bases du cours.*\(avec Friedrich\)$/.test(pl.s2.trim()) && pl.t3.trim() === 'Interro de cours et analyse logique — les bases (1)' && !/à revoir ensemble \(avec|Friedrich\).*Friedrich/.test(pl.t) && /\(avec Friedrich\)/.test(plT.texte), 'R3 · ce que la classe a écrit, dans les deux versions, à sa place dans le canon : l’objectif de la séance 1 (nouvelle version), celui de la séance 3 (8.77.1-⑩), son titre intact (« … — les bases (1) ») ; au tableau distant aussi', { s1: pl.s1, s3: pl.s2, titre3: pl.t3 });
  await allerA(o.pg, posN2.eid); await o.pg.click('#numero').catch(() => {}); await o.pg.keyboard.press('ArrowRight'); await p(2500); const C3 = copieDe(k0);
  verif('R', !(C3.ecrans || []).some(e => (e.blocs || []).some(b => b && b.t === 'ouverture')) && (C3.ecrans || []).filter(e => e.ouvCanon).length === lis.length, 'R3 · réécrite par la nouvelle version, la copie reste lisible par la 8.77.1-⑩ (aucun bloc « ouverture » au hub)');
  sansErreur('R', o, 'R3 · la nouvelle version'); sansErreur('R', T, 'R3 · le tableau distant'); await o.ctx.close(); await T.ctx.close(); }

/* ═══ I · le sens inverse : une heure commencée dans la 8.77.1-⑩, reprise dans la nouvelle version ═══ */
if (joue('I') && ANC) { dire(''); dire('══ I · 1536×864 · hors mode test · la 8.77.1-⑩ commence l’heure, la nouvelle version la reprend ══');
  HUBN = hubDe(store()); ECR = []; const k0 = sk0(HUBN)[0];
  let o = await ouvrir({ fichier: ANC }); verif('I', await lancerClasse(o), 'I1 · la 8.77.1-⑩ lance l’heure (la case du 14/09)'); let fen = await ouvrirTableau(o); await o.pg.click('#numero'); await p(300);
  const vus = {}; let n = 0; while (n++ < 60) { const s = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s.eid) || {}).role; if (!ROLES_OUV.includes(role)) break; vus[role] = { compte: s.compte, texte: s.texte, eid: s.eid }; await o.pg.keyboard.press('ArrowRight'); await p(350); }
  await p(2500); const posA = await ici_(o.pg); await capt(o.pg, 'I1-ancienne-premiere-activite'); sansErreur('I', o, 'I1 · la 8.77.1-⑩'); await o.ctx.close();
  o = await ouvrir({ h: '09:03' }); const rI = await reprendre(o); const l2 = rI.ok && rI.par === 'bandeau'; fen = await ouvrirTableau(o); await p(1500); const posN = await ici_(o.pg); const vigN = await vignettes(o.pg); await capt(o.pg, 'I2-nouvelle-reprise');
  verif('I', l2 && posN.eid === posA.eid && posN.compte === posA.compte && !posN.illisible && !vigN.some(v => /non lisible/i.test(v.t)), 'I2 · la nouvelle version reprend là où la 8.77.1-⑩ en était (la même diapo, le même compteur), rien d’illisible', { ancienne: [posA.eid, posA.compte], nouvelle: [posN.eid, posN.compte] });
  const lus = {}; for (const r of Object.keys(vus)) { await allerA(o.pg, vus[r].eid); await p(700); lus[r] = { s: await ici_(o.pg), f: fen ? await murDe(fen, '#mur2') : null }; }
  verif('I', Object.keys(vus).length >= 3 && Object.keys(vus).every(r => lus[r].s.compte === vus[r].compte && lus[r].s.texte === vus[r].texte && lus[r].f && !lus[r].f.illisible && lus[r].f.texte.length > 10), 'I2 · les diapos d’ouverture montrées par la 8.77.1-⑩ (' + Object.keys(vus).join(', ') + ') : les mêmes textes et le même compteur au pilote, et leurs textes à la fenêtre du tableau (ce qui a été joué ne change plus)', Object.keys(vus).map(r => r + ' ' + vus[r].compte + '|' + lus[r].s.compte + ' ' + (lus[r].s.texte === vus[r].texte ? '=' : '≠ « ' + lus[r].s.texte.slice(0, 60) + ' »')));
  await allerA(o.pg, posN.eid); await o.pg.click('#numero').catch(() => {}); for (let k = 0; k < 3; k++) { await o.pg.keyboard.press('ArrowRight'); await p(400); } await p(2500); const posN2 = await ici_(o.pg);
  verif('I', posN2.compte !== posN.compte || posN2.eid !== posN.eid, 'I2 · ▶ continue dans la nouvelle version'); sansErreur('I', o, 'I2 · la nouvelle version'); await o.ctx.close();
  o = await ouvrir({ fichier: ANC, h: '09:06' }); const rI3 = await reprendre(o); const l3 = rI3.ok && rI3.par === 'bandeau'; await p(1000); const posA3 = await ici_(o.pg); const vigA = await vignettes(o.pg); await capt(o.pg, 'I3-ancienne-relit');
  verif('I', l3 && posA3.eid === posN2.eid && posA3.compte === posN2.compte && !posA3.illisible && !vigA.some(v => /non lisible/i.test(v.t)), 'I3 · la 8.77.1-⑩ reprend de nouveau : la même diapo, le même compteur, rien d’illisible', { nouvelle: [posN2.eid, posN2.compte], ancienne: [posA3.eid, posA3.compte] });
  sansErreur('I', o, 'I3 · la 8.77.1-⑩'); await o.ctx.close(); }

/* ═══ T · (§3.2) les retraits que la 8.77.1-⑩ ne voit pas ═══ */
const lignesX = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ di: +d.dataset.atDi, eid: d.dataset.eid, t: ((d.querySelector('.t') || d).textContent || '').replace(/\s+/g, ' ').trim() })));
const retirer = async (pg, eid) => { const sel = '#volet [data-eid="' + eid + '"] .t'; if (!(await pg.$(sel))) return false; await pg.evaluate(s2 => { const d = document.querySelector(s2); if (d) d.scrollIntoView({ block: 'center' }); }, sel); await p(300);
  await pg.click(sel, { button: 'right' }); await p(400); await pg.evaluate(() => { const b = document.querySelector('#menu.on [data-a="supprimer"]'); if (b) b.click(); }); await p(700);
  await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && Array.from(m.querySelectorAll('button')).find(x => /^Retirer$/.test(x.textContent.trim())); if (b) b.click(); }); await p(3000); return !(await pg.$(sel)); };
/* la séance k dans l'Atelier (son nom dans la liste des séances, comme sonde-ouverture.mjs) */
const seanceA = async (pg, cle) => { for (let n = 0; n < 4; n++) { const ok = await pg.evaluate(c => String(ATVUES.snum) === c && !!document.querySelector('#volet [data-at-di]'), cle); if (ok) break; await pg.evaluate(c => { const d = document.querySelector('.ed2-sce[data-seance="' + c + '"]'); if (d) { d.scrollIntoView({ block: 'center' }); d.click(); } }, cle); await p(1500); } await p(600); };
const derouleDe = k => lireH('/site/3e/chapitres/0/seances/' + k + '/deroule') || {};
if (joue('T') && ANC) { dire(''); dire('══ T · 1536×864 · les retraits : la nouvelle version retire, la 8.77.1-⑩ fait ses gestes ordinaires dans l’Atelier, la nouvelle relit ══');
  HUBN = hubDe(store()); ECR = []; const k0 = sk0(HUBN)[0]; const eK = 'inv-competences-chapitre-s' + k0, eP = 'inv-plan-s' + k0, eS = 'inv-presentation-seance-s' + k0;
  /* T1 · la nouvelle version retire les compétences du chapitre et le parcours */
  let o = await ouvrir({}); await ouvrirAtelier(o); const r1 = await retirer(o.pg, eK), r2 = await retirer(o.pg, eP); await p(1500); const d1 = derouleDe(k0); await capt(o.pg, 'T1-nouvelle-retire');
  verif('T', r1 && r2 && (d1.retraits || []).includes('competences-chapitre') && (d1.retraits || []).includes('plan') && (d1.retraits || []).includes('canon') && d1.ouvRetraits && (d1.ouvRetraits.r || []).includes('competences-chapitre'), 'T1 · la nouvelle version « Retire » les compétences du chapitre et le parcours : au hub, « retraits » ' + JSON.stringify(d1.retraits) + ' et « ouvRetraits » ' + JSON.stringify(d1.ouvRetraits));
  sansErreur('T', o, 'T1 · la nouvelle version'); await o.ctx.close();
  /* T2 · la 8.77.1-⑩ : Alt + ↓ / Alt + ↑ sur une diapo ordinaire, une frappe dans une diapo */
  o = await ouvrir({ fichier: ANC }); await ouvrirAtelier(o); let L = await lignesX(o.pg); const ord = L.find(l => !/^inv-|^fin-/.test(l.eid));
  await (await o.pg.$('#volet [data-eid="' + ord.eid + '"] .t')).click(); await p(600); await o.pg.keyboard.press('Alt+ArrowDown'); await p(1500); await o.pg.keyboard.press('Alt+ArrowUp'); await p(2000);
  const tx = await o.pg.$('#mur [data-p="0.0"]'); let frappe = false; if (tx) { await tx.click(); await p(300); await o.pg.keyboard.press('Control+End'); await o.pg.keyboard.type(' (en silence)', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(2500); frappe = true; }
  const d2 = derouleDe(k0); const ecA = ECR.filter(e => e.qui === 'pilote' && /\/deroule(\/|$)/.test(e.c)).length; await capt(o.pg, 'T2-ancienne-gestes');
  verif('T', frappe && ecA > 0 && /\(en silence\)/.test(JSON.stringify(d2.ecrans || [])), 'T2 · la 8.77.1-⑩ fait ses gestes ordinaires dans l’Atelier (Alt + ↓, Alt + ↑ sur « ' + ord.t.slice(0, 40) + ' », une frappe « (en silence) ») et réécrit le déroulé (' + ecA + ' écriture(s)) : au hub, « retraits » ' + JSON.stringify(d2.retraits || null) + ', « ouvRetraits » ' + JSON.stringify(d2.ouvRetraits || null));
  sansErreur('T', o, 'T2 · la 8.77.1-⑩'); await o.ctx.close();
  /* T3 · la nouvelle version relit */
  o = await ouvrir({}); await ouvrirAtelier(o); L = await lignesX(o.pg); await capt(o.pg, 'T3-nouvelle-relit');
  verif('T', L.length > 10 && !L.some(l => l.eid === eK) && !L.some(l => l.eid === eP) && L.some(l => l.eid === eS), 'T3 · la nouvelle version relit : les compétences du chapitre et le parcours toujours retirés (le début de séance est là)', L.filter(l => /^inv-/.test(l.eid)).map(l => l.eid));
  sansErreur('T', o, 'T3 · la nouvelle version'); await o.ctx.close();
  /* T4 · la 8.77.1-⑩ retire le parcours et le remet (Ctrl + Z : son seul geste pour remettre une diapo d'ouverture), retire le début de séance ; la nouvelle relit */
  HUBN = hubDe(store()); ECR = [];
  o = await ouvrir({}); await ouvrirAtelier(o); const r4 = await retirer(o.pg, eK); await p(1500); sansErreur('T', o, 'T4 · la nouvelle version retire les compétences du chapitre'); await o.ctx.close();
  o = await ouvrir({ fichier: ANC }); await ouvrirAtelier(o); const r5 = await retirer(o.pg, eP); await o.pg.keyboard.press('Control+z'); await p(2500); L = await lignesX(o.pg); const remis = L.some(l => l.eid === eP); const r6 = await retirer(o.pg, eS); await p(2000);
  const d4 = derouleDe(k0); await capt(o.pg, 'T4-ancienne-remet');
  verif('T', r4 && r5 && remis && r6 && !(d4.retraits || []).includes('plan') && (d4.retraits || []).includes('presentation-seance'), 'T4 · la 8.77.1-⑩ retire le parcours puis le remet (Ctrl + Z), retire le début de séance : au hub, « retraits » ' + JSON.stringify(d4.retraits || null) + ', « ouvRetraits » ' + JSON.stringify(d4.ouvRetraits || null));
  sansErreur('T', o, 'T4 · la 8.77.1-⑩'); await o.ctx.close();
  o = await ouvrir({}); await ouvrirAtelier(o); L = await lignesX(o.pg); await capt(o.pg, 'T5-nouvelle-relit');
  verif('T', !L.some(l => l.eid === eK) && L.some(l => l.eid === eP) && !L.some(l => l.eid === eS), 'T5 · la nouvelle version relit : les compétences du chapitre toujours retirées, le parcours remis, le début de séance retiré (les quatre rôles de la 8.77.1-⑩ se lisent dans « retraits »)', L.filter(l => /^inv-/.test(l.eid)).map(l => l.eid));
  sansErreur('T', o, 'T5 · la nouvelle version'); await o.ctx.close(); }

/* ═══ B · (§3.3) les compétences du chapitre en bilan (la dernière séance) ═══ */
if (joue('B') && ANC) { dire(''); dire('══ B · 1536×864 · les compétences du chapitre en bilan : la nouvelle version écrit, la 8.77.1-⑩ relit, la nouvelle relit ══');
  HUBN = hubDe(store()); ECR = []; const ks = sk0(HUBN); const kD = ks[ks.length - 1]; const eB = 'inv-competences-bilan-s' + kD;
  let o = await ouvrir({}); await ouvrirAtelier(o); await seanceA(o.pg, kD);
  /* la dernière séance, par la liste des séances de l'Atelier */
  let L = await lignesX(o.pg); let vu = L.some(l => l.eid === eB);
  if (!vu) { await o.pg.evaluate(eid => { const d = document.querySelector('#volet [data-eid="' + eid + '"]'); if (d) d.scrollIntoView({ block: 'center' }); }, eB); L = await lignesX(o.pg); vu = L.some(l => l.eid === eB); }
  let tape = false; if (vu) { await (await o.pg.$('#volet [data-eid="' + eB + '"] .t')).click(); await p(900); const cl = await o.pg.$('#mur > .ouv .ouv-cr .ouv-cl[data-p]'); if (cl) { await cl.click(); await o.pg.keyboard.press('Control+End'); await o.pg.keyboard.type(' (bilan : acquis en classe)', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(2500); tape = true; } }
  await capt(o.pg, 'B1-nouvelle-bilan'); const dB = derouleDe(kD); const eH = (dB.ecrans || []).find(e => e && e.eid === eB);
  verif('B', vu && tape && eH && eH.ouvCanon && (eH.blocs || [])[0] && eH.blocs[0].t === 'texte' && /acquis en classe/.test(JSON.stringify(eH.blocs)) && !(eH.blocs || []).some(b => b.t === 'ouverture'), 'B1 · la nouvelle version : Paul écrit dans les compétences du chapitre en bilan (la dernière séance) ; au hub, un bloc de texte lisible avec ses mots, le canon sous « ouvCanon »', eH ? { blocs: (eH.blocs || []).map(b => b.t + ' ' + (b.el || []).length), canon: !!eH.ouvCanon } : 'absente du hub');
  sansErreur('B', o, 'B1 · la nouvelle version'); await o.ctx.close();
  o = await ouvrir({ fichier: ANC }); await ouvrirAtelier(o); await seanceA(o.pg, kD); await o.pg.evaluate(eid => { const d = document.querySelector('#volet [data-eid="' + eid + '"]'); if (d) d.scrollIntoView({ block: 'center' }); }, eB);
  let lu = null; const t = await o.pg.$('#volet [data-eid="' + eB + '"] .t'); if (t) { await t.click(); await p(900); lu = await ici_(o.pg); } await capt(o.pg, 'B2-ancienne-bilan');
  verif('B', lu && /acquis en classe/.test(lu.texte) && !lu.illisible && !lu.ouv, 'B2 · la 8.77.1-⑩ relit : les compétences en bilan en texte lisible, les mots de Paul, rien d’illisible', lu ? lu.texte.slice(0, 200) : 'introuvable');
  sansErreur('B', o, 'B2 · la 8.77.1-⑩'); await o.ctx.close();
  o = await ouvrir({}); await ouvrirAtelier(o); await seanceA(o.pg, kD); await o.pg.evaluate(eid => { const d = document.querySelector('#volet [data-eid="' + eid + '"]'); if (d) d.scrollIntoView({ block: 'center' }); }, eB);
  let ln = null; const t2 = await o.pg.$('#volet [data-eid="' + eB + '"] .t'); if (t2) { await t2.click(); await p(900); ln = await ici_(o.pg); } await capt(o.pg, 'B3-nouvelle-bilan');
  verif('B', ln && /ouv-comp/.test(ln.ouv) && /acquis en classe/.test(ln.texte), 'B3 · la nouvelle version relit : le canon (les compétences en bilan), les mots de Paul', ln ? ln.ouv : 'introuvable');
  sansErreur('B', o, 'B3 · la nouvelle version'); await o.ctx.close(); }

/* ═══ X · (§3.4) la taxonomie retardée au faux hub ═══ */
if (joue('X')) { dire(''); dire('══ X · 1536×864 · la taxonomie retardée : une diapo d’ouverture intacte renommée ne part jamais avec des libellés manquants ══');
  const jouerX = async retard => { HUBN = hubDe(store()); ECR = []; const k0 = sk0(HUBN)[0]; const eS = 'inv-presentation-seance-s' + k0; if (retard) RETARD['/taxonomie'] = retard; else delete RETARD['/taxonomie'];
    const o = await ouvrir({}); const t0 = Date.now();
    /* la case de l'emploi du temps, « ✎ Préparer » : l'Atelier s'ouvre sur la séance sans attendre la taxonomie (la liste des chapitres, elle, l'attend) */
    if (!(await clicTexte(o.pg, 'button', 'edtOuvrir()'))) await o.pg.evaluate(() => edtOuvrir()); await p(1200);
    await o.pg.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')).find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0); if (c) c.click(); }); await p(700);
    await clicTexte(o.pg, 'button', 'Préparer'); await p(1500); await o.pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(1000);
    const d = await o.pg.$('#volet [data-eid="' + eS + '"] .t'); let ren = false, avantTaxo = null;
    if (d) { await d.dblclick(); await p(300); await o.pg.keyboard.press('Control+A'); await o.pg.keyboard.type('S1 : le Romantisme en question', { delay: 5 }); await o.pg.keyboard.press('Enter'); ren = true; avantTaxo = await o.pg.evaluate(() => !(typeof CH !== 'undefined' && CH && CH.taxo)); }
    await p((retard || 0) + 4000); await capt(o.pg, 'X-taxonomie-' + (retard ? 'retardee' : 'a-l-heure'));
    const ecrits = []; ECR.forEach(x => { const bd = x.bd; const l = Array.isArray(bd && bd.ecrans) ? bd.ecrans : (bd && bd.eid ? [bd] : []); l.forEach(e => { if (e && e.eid === eS) ecrits.push({ t: x.t - t0, act: e.act, suit: !!e.suit, blocs: JSON.stringify(e.blocs || null) }); }); });
    const fin = (derouleDe(k0).ecrans || []).find(e => e && e.eid === eS); delete RETARD['/taxonomie'];
    const r = { ren, avantTaxo, ecrits, fin: fin ? { act: fin.act, blocs: JSON.stringify(fin.blocs || null) } : null, errs: o.errs.slice(), boites: o.boites.slice() }; await o.ctx.close(); return r; };
  const ref = await jouerX(0); const lent = await jouerX(7000);
  dire('      X · à l’heure : ' + ref.ecrits.length + ' écriture(s) du début de séance · retardée de 7 s : ' + lent.ecrits.length + ' écriture(s), aux temps ' + lent.ecrits.map(e => Math.round(e.t / 100) / 10 + ' s').join(', '));
  verif('X', ref.ren && ref.fin && /Notions rencontrées : [^"·]+·/.test(ref.fin.blocs) && /travaillées : [^"]+/.test(ref.fin.blocs), 'X1 · la taxonomie à l’heure : le début de séance renommé part au hub avec les textes de l’ancien calcul, complets (la référence)', ref.fin && ref.fin.blocs.slice(0, 300));
  verif('X', lent.ren && lent.avantTaxo === true, 'X2 · la taxonomie retardée de 7 s : Paul renomme le début de séance AVANT qu’elle arrive (« ✎ Préparer » de la case ouvre l’Atelier sans l’attendre)', { avantTaxo: lent.avantTaxo });
  verif('X', lent.ecrits.length >= 1 && lent.ecrits.every(e => e.blocs === ref.fin.blocs || e.blocs === 'null') && lent.fin && lent.fin.blocs === ref.fin.blocs && /^S1 : /.test(lent.fin.act), 'X3 · aucune écriture du début de séance avec des libellés manquants : chacune porte les textes complets de la référence ; le nom que Paul a donné est au hub (rien de perdu)', lent.ecrits.map(e => ({ t: e.t, act: e.act, complet: e.blocs === ref.fin.blocs, blocs: e.blocs.slice(0, 120) })));
  verif('X', !ref.errs.length && !ref.boites.length && !lent.errs.length && !lent.boites.length, 'X · aucune erreur JS, aucune boîte système', ref.errs.concat(ref.boites, lent.errs, lent.boites).join(' ; ')); }

/* ═══ Z · (§3.2, le témoin) la 8.77.1-⑩ seule : elle lance l'heure, ▶ jusqu'à la première activité ; Paul recharge et reprend dans la 8.77.1-⑩ elle-même ═══ */
if (joue('Z') && ANC) { dire(''); dire('══ Z · 1536×864 · le témoin : la 8.77.1-⑩ seule commence l’heure et la reprend (hub ' + (VRAI ? 'rangé comme le vrai' : 'ordinaire') + ') ══');
  HUBN = hubDe(store()); ECR = [];
  let o = await ouvrir({ fichier: ANC }); const l1 = await lancerClasse(o); await o.pg.click('#numero'); await p(300); let n = 0;
  while (n++ < 60) { const s = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s.eid) || {}).role; if (!ROLES_OUV.includes(role)) break; await o.pg.keyboard.press('ArrowRight'); await p(350); }
  await p(2500); const pos = await ici_(o.pg); const e1 = o.errs.concat(o.boites); await o.ctx.close();
  o = await ouvrir({ fichier: ANC, h: '09:03' }); const r = await reprendre(o); await p(1000); const pos2 = await ici_(o.pg); await capt(o.pg, 'Z-ancienne-seule-reprise');
  verif('Z', l1 && r.ok && r.par === 'bandeau' && pos2.eid === pos.eid && pos2.compte === pos.compte && !e1.length && !o.errs.length && !o.boites.length, 'Z · la 8.77.1-⑩ seule reprend sa propre heure : la même diapo, le même compteur, aucune erreur JS', { avant: [pos.eid, pos.compte], apres: [pos2.eid, pos2.compte], erreurs: e1.concat(o.errs, o.boites).slice(0, 3) });
  await o.ctx.close(); }

/* ═══ Q · (§3.3 des quatre dettes) la page quittée avant la taxonomie ═══ */
if (joue('Q') && ANC) { dire(''); dire('══ Q · 1536×864 · la taxonomie retardée de 7 s ; « ✎ Préparer », le début de séance renommé, la page quittée avant elle ; la 8.77.1-⑩ ouvre la séance ; la nouvelle version rouvre ══');
  const jouerQ = async (depart, attente) => { HUBN = hubDe(store()); ECR = []; const k0 = sk0(HUBN)[0]; const eS = 'inv-presentation-seance-s' + k0; RETARD['/taxonomie'] = 7000;
    let o = await ouvrir({});
    if (!(await clicTexte(o.pg, 'button', 'edtOuvrir()'))) await o.pg.evaluate(() => edtOuvrir()); await p(1200);
    await o.pg.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')).find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0); if (c) c.click(); }); await p(700);
    await clicTexte(o.pg, 'button', 'Préparer'); await p(1500); await o.pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(1000);
    const d = await o.pg.$('#volet [data-eid="' + eS + '"] .t'); let ren = false; if (d) { await d.dblclick(); await p(300); await o.pg.keyboard.press('Control+A'); await o.pg.keyboard.type('S1 : le Romantisme en question', { delay: 5 }); await o.pg.keyboard.press('Enter'); ren = true; }
    const avantTaxo = await o.pg.evaluate(() => !(typeof CH !== 'undefined' && CH && CH.taxo)); await p(attente);
    if (depart === 'rechargement') { await o.pg.reload({ waitUntil: 'load' }).catch(() => {}); await p(1500); } else { await o.pg.close({ runBeforeUnload: true }).catch(() => {}); await p(1500); }
    const errsN = o.errs.concat(o.boites); await o.ctx.close(); delete RETARD['/taxonomie'];
    const dd = derouleDe(k0); const auHub = (dd.ecrans || []).find(e => e && e.eid === eS) || null; const att = (dd.ouvAttente || {})[eS] || null;
    /* la 8.77.1-⑩ : l'Atelier, puis l'heure (▶ jusqu'à son début de séance) */
    o = await ouvrir({ fichier: ANC }); await ouvrirAtelier(o); let atA = null; { const t = await o.pg.$('#volet [data-eid="' + eS + '"] .t'); if (t) { await t.click(); await p(900); atA = await ici_(o.pg); } } await capt(o.pg, 'Q-' + depart + '-ancienne-atelier'); const eA = o.errs.concat(o.boites); await o.ctx.close();
    o = await ouvrir({ fichier: ANC }); const lA = await lancerClasse(o); await o.pg.click('#numero').catch(() => {}); let clA = null; for (let n = 0; n < 40; n++) { const s = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s.eid) || {}).role; if (role === 'presentation-seance') { for (let k = 0; k < 8; k++) { const s2 = await ici_(o.pg); if (s2.eid !== s.eid || /^(\d+) \/ \1 dévoilés|rien à dévoiler/.test(s2.compte)) break; await o.pg.keyboard.press('ArrowRight'); await p(300); } await p(500); clA = await ici_(o.pg); break; } if (!ROLES_OUV.includes(role)) break; await o.pg.keyboard.press('ArrowRight'); await p(300); }
    await capt(o.pg, 'Q-' + depart + '-ancienne-classe'); eA.push(...o.errs, ...o.boites); await o.ctx.close();
    /* la nouvelle version rouvre */
    o = await ouvrir({}); await ouvrirAtelier(o); const LN = await lignesX(o.pg); const nom = (LN.find(l => l.eid === eS) || {}).t || null; await capt(o.pg, 'Q-' + depart + '-nouvelle-rouvre'); const eN2 = o.errs.concat(o.boites); await o.ctx.close();
    return { ren, avantTaxo, auHub: auHub ? { act: auHub.act, blocs: JSON.stringify(auHub.blocs || null).slice(0, 160) } : null, att, atA, clA, lA, nom, errs: errsN.concat(eA, eN2) }; };
  const complet = x => !!x && /Notions rencontrées : [^·]+·/.test(x.texte) && /travaillées : \S/.test(x.texte) && !x.illisible;
  for (const [depart, attente] of [['rechargement', 2000], ['fermeture', 400]]) { const r = await jouerQ(depart, attente);
    dire('      Q · ' + depart + ' : au hub, la diapo ' + JSON.stringify(r.auHub) + ' ; à côté ' + JSON.stringify(r.att));
    verif('Q', r.ren && r.avantTaxo, 'Q · ' + depart + ' : Paul renomme le début de séance avant la taxonomie (« ✎ Préparer » de la case), la page part ' + (depart === 'rechargement' ? '2 s après (le rechargement)' : '0,4 s après (l’onglet fermé)') + ', avant elle');
    verif('Q', !r.auHub || (/Notions rencontrées : [^"·]+·/.test(r.auHub.blocs) && /travaillées : [^"]+/.test(r.auHub.blocs)), 'Q · ' + depart + ' : au hub, le début de séance n’est jamais écrit sans ses textes ni avec des textes incomplets', r.auHub);
    verif('Q', complet(r.atA) && complet(r.clA) && r.lA, 'Q · ' + depart + ' : la 8.77.1-⑩ ouvre la séance dans l’Atelier et lance l’heure : son début de séance a ses textes, complets (rien de vide, rien d’incomplet)', { atelier: r.atA ? r.atA.texte.slice(0, 220) : null, classe: r.clA ? r.clA.texte.slice(0, 220) : null });
    verif('Q', r.nom === 'S1 : le Romantisme en question', 'Q · ' + depart + ' : la nouvelle version rouvre : le geste de Paul est là (« S1 : le Romantisme en question »)', { colonne: r.nom, hub: r.auHub ? r.auHub.act : null, aCote: r.att ? r.att.act : null });
    verif('Q', !r.errs.length, 'Q · ' + depart + ' : aucune erreur JS, aucune boîte système', r.errs.join(' ; ')); } }

/* ═══ S · (§3.2, la demande de la conscience à 04:5x) LE MÊME NAVIGATEUR : chaque version seule, dans un seul profil (ce que `dr_heureLocaleLire` garde dans ce
   navigateur) — l'heure lancée, ▶ jusqu'à la première activité, l'état parti au hub ; F5 et « Reprendre » ; puis l'onglet fermé, le site rouvert, « Reprendre » ═══ */
const pageProf = async (o, fichier, h) => { const pg = await o.ctx.newPage(); await pg.clock.setFixedTime(new Date('2026-09-14T' + h + ':00+02:00')); await pg.goto('file://' + fichier + '?n=3e', { waitUntil: 'load' }); await p(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const x = document.getElementById(i); if (x) x.remove(); }); }); await p(300); await pg.click('#tprof-btn').catch(() => {}); await p(600); o.pg = pg; return pg; };
const profPrep = async pg => { await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const x = document.getElementById(i); if (x) x.remove(); }); }); await p(300); await pg.click('#tprof-btn').catch(() => {}); await p(600); };
if (joue('S') && ANC) { dire(''); dire('══ S · 1536×864 · le même navigateur (hub ' + (VRAI ? 'rangé comme le vrai' : 'ordinaire') + ') : F5 puis « Reprendre » ; l’onglet fermé, le site rouvert, « Reprendre » ══');
  for (const [nom, fichier] of [['la 8.77.1-⑩', ANC], ['la nouvelle version', FICHIER]]) { HUBN = hubDe(store()); ECR = [];
    const o = await ouvrir({ fichier }); const l1 = await lancerClasse(o); await o.pg.click('#numero'); await p(300); let n = 0;
    while (n++ < 60) { const s2 = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s2.eid) || {}).role; if (!ROLES_OUV.includes(role)) break; await o.pg.keyboard.press('ArrowRight'); await p(350); }
    await p(5000); const pos = await ici_(o.pg); const loc = await o.pg.evaluate(() => { try { return Object.keys(localStorage).filter(k => /heure|joue|etat|dr/i.test(k)).length; } catch (e) { return -1; } }); const e0 = o.errs.length + o.boites.length;
    /* F5 */ await o.pg.reload({ waitUntil: 'load', timeout: 20000 }).catch(() => {}); await p(1800); await profPrep(o.pg); const r1 = await reprendre(o); await p(1200); const pos1 = await ici_(o.pg); await capt(o.pg, 'S-' + (fichier === ANC ? 'ancienne' : 'nouvelle') + '-F5-reprendre');
    const err1 = o.errs.slice(0).concat(o.boites).slice(e0); const e1 = o.errs.length + o.boites.length;
    verif('S', l1 && r1.ok && r1.par === 'bandeau' && pos1.eid === pos.eid && pos1.compte === pos.compte && pos1.texte.length > 10 && !pos1.illisible && !err1.length, nom + ' · même navigateur · F5 puis « Reprendre » : la même diapo dessinée, le même compteur, aucune erreur JS', { avant: [pos.eid, pos.compte], apres: [pos1.eid, pos1.compte, pos1.texte.slice(0, 50)], par: r1.par, cles_locales: loc, quitterLeSite: o.quitter.length, erreurs: err1.slice(0, 2) });
    /* l'onglet fermé, le site rouvert (le même profil) */ await o.pg.close({ runBeforeUnload: true }).catch(() => {}); await p(1500); await pageProf(o, fichier, '09:04'); const r2 = await reprendre(o); await p(1200); const pos2 = await ici_(o.pg); await capt(o.pg, 'S-' + (fichier === ANC ? 'ancienne' : 'nouvelle') + '-onglet-rouvert-reprendre');
    const err2 = o.errs.concat(o.boites).slice(e1);
    verif('S', r2.ok && r2.par === 'bandeau' && pos2.eid === pos.eid && pos2.compte === pos.compte && pos2.texte.length > 10 && !pos2.illisible && !err2.length, nom + ' · même navigateur · l’onglet fermé, le site rouvert, « Reprendre » : la même diapo dessinée, le même compteur, aucune erreur JS', { avant: [pos.eid, pos.compte], apres: [pos2.eid, pos2.compte, pos2.texte.slice(0, 50)], par: r2.par, erreurs: err2.slice(0, 2) });
    await o.ctx.close(); } }

/* ═══ E · (§3.1 des quatre dettes) « À écrire » dans une diapo d'ouverture, d'une version à l'autre — par le geste ═══ */
const marques = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; return Array.from(m.querySelectorAll('[data-k].aecrire')).map(x => ({ k: x.dataset.k, t: (x.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70) })); }, sel).catch(() => null) : null;
const ligneK = (pg, sel, k) => pg.evaluate(({ sel, k }) => { const x = document.querySelector(sel + ' [data-k="' + k + '"]'); return x ? (x.textContent || '').replace(/\s+/g, ' ').trim() : null; }, { sel, k });
const ks = l => (l || []).map(x => x.k).join(',');
if (joue('E') && ANC) { dire(''); dire('══ E · 1536×864 · « À écrire » dans le début de séance : la nouvelle version le pose, la 8.77.1-⑩ reprend l’heure, le déplace, la nouvelle revient ══');
  HUBN = hubDe(store()); ECR = []; const k0 = sk0(HUBN)[0]; const eS = 'inv-presentation-seance-s' + k0; const bS = 'binv-presentation-seance-s' + k0;
  /* E1 · la nouvelle version, dans l'Atelier : le curseur sur l'objectif de la séance (la ligne 2 du début de séance), « ✍ À écrire » */
  let o = await ouvrir({}); await ouvrirAtelier(o); await (await o.pg.$('#volet [data-eid="' + eS + '"] .t')).click(); await p(900);
  const lg = await o.pg.$('#mur [data-p="0.1"]'); if (lg) { await lg.click(); await p(300); await o.pg.click('#at-ecr'); await p(2500); }
  const mA = await marques(o.pg, '#mur'); const objTxt = await ligneK(o.pg, '#mur', 1); await capt(o.pg, 'E1-nouvelle-atelier-a-ecrire');
  const dE = (derouleDe(k0).ecrans || []).find(e => e && e.eid === eS) || {};
  verif('E', lg && ks(mA) === '1' && (dE.aEcrire || []).includes(bS + '.1'), 'E1 · la nouvelle version, dans l’Atelier : « ✍ À écrire » sur l’objectif de la séance (« ' + String(objTxt).slice(0, 50) + ' ») — marqué au pilote, dans la trame au hub', { pilote: mA, hub: dE.aEcrire || null, blocs: (dE.blocs || []).map(b => b.t + ' ' + (b.el || []).length) });
  sansErreur('E', o, 'E1 · la nouvelle version'); await o.ctx.close();
  /* E2 · la 8.77.1-⑩, dans son Atelier : la même ligne (la trame) */
  o = await ouvrir({ fichier: ANC }); await ouvrirAtelier(o); { const t = await o.pg.$('#volet [data-eid="' + eS + '"] .t'); if (t) { await t.click(); await p(900); } }
  const mAA = await marques(o.pg, '#mur'); await capt(o.pg, 'E2-ancienne-atelier');
  const meme = (t, ref) => !!t && !!ref && (t === ref || ref.indexOf(t.replace(/^Objectif : /, '')) >= 0 || t.indexOf(ref.replace(/^Objectif : /, '').slice(0, 60)) >= 0);
  verif('E', mAA && mAA.length === 1 && meme(mAA[0].t, objTxt), 'E2 · la 8.77.1-⑩, dans son Atelier : la même ligne est à écrire (l’objectif), aucune autre', { ancienne: mAA, attendu: objTxt });
  sansErreur('E', o, 'E2 · la 8.77.1-⑩'); await o.ctx.close();
  /* E3 · la nouvelle version lance l'heure ; ▶ jusqu'à la première activité ; au début de séance : la ligne marquée, au pilote et à la fenêtre du tableau */
  let T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1500);
  o = await ouvrir({}); verif('E', await lancerClasse(o), 'E3 · la nouvelle version lance l’heure (la case du 14/09), hors mode test'); let fen = await ouvrirTableau(o); await o.pg.click('#numero'); await p(300);
  let vuN = null, n = 0; while (n++ < 60) { const s = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s.eid) || {}).role; if (!ROLES_OUV.includes(role)) break;
    if (s.eid === eS && /^(\d+) \/ \1 dévoilés/.test(s.compte) && !vuN) { await p(1200); vuN = { p: await marques(o.pg, '#mur'), f: await marques(fen, '#mur2'), d: await marques(T.pg, 'body') }; await capt(o.pg, 'E3-nouvelle-classe-pilote'); if (fen) await capt(fen, 'E3-nouvelle-classe-tableau'); }
    await o.pg.keyboard.press('ArrowRight'); await p(350); }
  await p(2500);
  verif('E', vuN && ks(vuN.p) === '1' && ks(vuN.f) === '1' && ks(vuN.d) === '1', 'E3 · en classe, le début de séance : l’objectif à écrire au pilote, à la fenêtre du tableau, au tableau distant', vuN);
  sansErreur('E', o, 'E3 · la nouvelle version'); sansErreur('E', T, 'E3 · le tableau distant'); await o.ctx.close(); await T.ctx.close();
  /* E4 · la 8.77.1-⑩ reprend l'heure en pleine heure : la même ligne ; elle la retire et pose « à écrire » ailleurs (✍, puis la ligne) */
  o = await ouvrir({ fichier: ANC, h: '09:03' }); const rA = await reprendre(o); fen = await ouvrirTableau(o); await p(1200); await allerA(o.pg, eS); await p(900);
  const vA = { p: await marques(o.pg, '#mur'), f: await marques(fen, '#mur2') }; const l2 = await ligneK(o.pg, '#mur', 2); await capt(o.pg, 'E4-ancienne-reprise-pilote'); if (fen) await capt(fen, 'E4-ancienne-reprise-tableau');
  verif('E', rA.ok && rA.par === 'bandeau' && vA.p && vA.p.length === 1 && meme(vA.p[0].t, objTxt) && vA.f && vA.f.length === 1 && meme(vA.f[0].t, objTxt), 'E4 · la 8.77.1-⑩ reprend l’heure (« Reprendre ») : au début de séance, la même ligne est à écrire (l’objectif), au pilote et à la fenêtre du tableau', vA);
  await o.pg.click('#becr'); await p(300); const x1 = await o.pg.$('#mur [data-k="1"]'), x2 = await o.pg.$('#mur [data-k="2"]'); if (x1) { await x1.click(); await p(400); } if (x2) { await x2.click(); await p(400); } await o.pg.click('#becr'); await p(2500);
  const vA2 = { p: await marques(o.pg, '#mur'), f: await marques(fen, '#mur2') }; await capt(o.pg, 'E4-ancienne-deplace-pilote'); if (fen) await capt(fen, 'E4-ancienne-deplace-tableau');
  verif('E', ks(vA2.p) === '2' && ks(vA2.f) === '2', 'E4 · la 8.77.1-⑩ retire « à écrire » de l’objectif et le pose sur la ligne suivante (« ' + String(l2).slice(0, 50) + ' ») : au pilote et à la fenêtre du tableau', vA2);
  sansErreur('E', o, 'E4 · la 8.77.1-⑩'); await o.ctx.close();
  /* E5 · la nouvelle version revient : exactement ce que la 8.77.1-⑩ a laissé */
  T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false, h: '09:06' }); await p(1500);
  o = await ouvrir({ h: '09:06' }); const rN = await reprendre(o); fen = await ouvrirTableau(o); await p(1200); await allerA(o.pg, eS); await p(1800);
  const vN = { p: await marques(o.pg, '#mur'), f: await marques(fen, '#mur2'), d: await marques(T.pg, 'body') }; await capt(o.pg, 'E5-nouvelle-revient-pilote'); if (fen) await capt(fen, 'E5-nouvelle-revient-tableau'); await capt(T.pg, 'E5-nouvelle-revient-distant');
  verif('E', rN.ok && rN.par === 'bandeau' && ks(vN.p) === '2' && meme(vN.p[0].t, l2) && ks(vN.f) === '2' && ks(vN.d) === '2', 'E5 · la nouvelle version reprend : exactement ce que la 8.77.1-⑩ a laissé (« ' + String(l2).slice(0, 40) + ' » à écrire, l’objectif non), au pilote, à la fenêtre du tableau, au tableau distant', vN);
  sansErreur('E', o, 'E5 · la nouvelle version'); sansErreur('E', T, 'E5 · le tableau distant'); await o.ctx.close(); await T.ctx.close(); }

/* ═══ P · (§3.4 des quatre dettes) le schéma « tableau » plus haut qu'une diapo passe en pages ═══ */
const RETIENS = 'Tableau | Peintre | Ce qu’on voit | Ce que j’en retiens\n'
  + 'Le Radeau de la Méduse (1819) | Théodore Géricault | des naufragés perdus sur une mer immense | Le peintre montre l’homme écrasé par la nature. La mer prend toute la place.\n'
  + 'Le lac (1863) | Albert Bierstadt | des montagnes immenses dans une lumière dorée | La nature est plus grande que tout : l’homme y paraît minuscule.\n'
  + 'Pêcheurs en mer (1796) | William Turner | une barque prise dans la tempête, la nuit | La lumière de la lune et la tempête disent la peur des pêcheurs.\n'
  + 'Cathédrale gothique au bord de l’eau (1813) | Karl Friedrich Schinkel | une cathédrale au soleil couchant | Le peintre mêle le rêve et le passé : la cathédrale paraît sortir d’un songe.\n'
  + 'Le Voyageur contemplant une mer de nuages (1818) | Caspar David Friedrich | un homme seul, de dos, face aux nuages | Le voyageur nous tourne le dos : nous regardons avec lui, et nous ressentons ce qu’il ressent.';
const DOUZE = 'Vers | Procédé\n'
  + 'Demain, dès l’aube, à l’heure où blanchit la campagne, | le complément de temps en tête\n'
  + 'Je partirai. Vois-tu, je sais que tu m’attends. | le rejet, l’apostrophe\n'
  + 'J’irai par la forêt, j’irai par la montagne. | l’anaphore « j’irai »\n'
  + 'Je ne puis demeurer loin de toi plus longtemps. | la négation\n'
  + 'Je marcherai les yeux fixés sur mes pensées, | la métaphore\n'
  + 'Sans rien voir au dehors, sans entendre aucun bruit, | le parallélisme\n'
  + 'Seul, inconnu, le dos courbé, les mains croisées, | l’énumération\n'
  + 'Triste, et le jour pour moi sera comme la nuit. | la comparaison\n'
  + 'Je ne regarderai ni l’or du soir qui tombe, | la métaphore\n'
  + 'Ni les voiles au loin descendant vers Harfleur, | la négation « ni… ni »\n'
  + 'Et quand j’arriverai, je mettrai sur ta tombe | la chute\n'
  + 'Un bouquet de houx vert et de bruyère en fleur. | le symbole';
const tabPage = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; const t = m.querySelector('table.p8-grille'); if (!t) return null; const z = t.closest('.p8-dessin'); const Z = z.getBoundingClientRect(), M = m.getBoundingClientRect();
  const dedans = (r, R) => r.left >= R.left - 0.5 && r.right <= R.right + 0.5 && r.top >= R.top - 0.5 && r.bottom <= R.bottom + 0.5; const vis = x => x.getClientRects().length > 0 && getComputedStyle(x).display !== 'none';
  const rs = Array.from(t.querySelectorAll('tr[data-pg]')).filter(vis); const cases = Array.from(t.querySelectorAll('th, td')).filter(c => vis(c.parentElement) && getComputedStyle(c.parentElement).visibility !== 'hidden');
  const coupees = cases.filter(c => { const r = c.getBoundingClientRect(); return !dedans(r, Z) || !dedans(r, M) || c.scrollWidth > c.clientWidth + 1; }).map(c => c.textContent.slice(0, 25));
  const pgT = ((m.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim();
  return { murH: m.clientHeight, rangees: rs.map(r => +r.dataset.pg), entete: !!Array.from(t.querySelectorAll('th')).filter(vis).length, coupees, page: pgT, fs: getComputedStyle(t.querySelector('td')).fontSize, fsT: getComputedStyle(t.querySelector('th')).fontSize }; }, sel).catch(() => null) : null;
const jouerP = async (fichier, src, W, H, nom, repet) => { HUBN = hubDe(store(src)); ECR = []; const n = src.split('\n').length - 1; const R = { pages: [], errs: [] };
  let T = null; if (!repet) { T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W, H, prof: false }); await p(1200); }
  const o = await ouvrir({ fichier, W, H }); let fen = null;
  if (repet) { await ouvrirAtelier(o); const l2 = await lignesX(o.pg); const y = l2.find(e => /Les cinq tableaux/.test(e.t)); if (y) { await (await o.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(900); } await o.pg.click('#at-jouer').catch(() => {}); await p(2500); fen = await ouvrirTableau(o, W, H); }
  else { await lancerClasse(o); fen = await ouvrirTableau(o, W, H); const v = await o.pg.$('#volet .vig:has(table.p8-grille)'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); if (await o.pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) { await o.pg.click('#garde-devant'); await p(900); } } }
  await o.pg.click('#numero').catch(() => {}); await p(1200);
  R.eidT = (await ici_(o.pg)).eid; for (let k = 0; k < 8; k++) { const a = await tabPage(o.pg, '#mur'), b = await tabPage(fen, '#mur2'), c = T ? await tabPage(T.pg, 'body') : null; const vg = await tabPage(o.pg, '#volet .vig.cour');
    R.pages.push({ a, b, c, vg }); await capt(o.pg, 'P-' + nom + '-' + W + 'x' + H + '-page' + (k + 1) + '-pilote'); if (fen) await capt(fen, 'P-' + nom + '-' + W + 'x' + H + '-page' + (k + 1) + '-tableau'); if (T) await capt(T.pg, 'P-' + nom + '-' + W + 'x' + H + '-page' + (k + 1) + '-distant');
    const m = /page (\d+) \/ (\d+)/.exec((a || {}).page || ''); if (!m || +m[1] >= +m[2]) break; await o.pg.keyboard.press('Shift+ArrowRight'); await p(1500); }
  /* (C16, les dernières dettes ⑱ : en classe et en répétition, la molette ne change ni de diapo ni de page — Paul, 02/11 07:48) la molette vers le haut ne revient
     pas aux pages : la dernière page reste ; Maj + ← revient à la première */
  if (R.pages.length > 1) { const b0 = await o.pg.$('#murcadre'); const bb = b0 ? await b0.boundingBox() : null; const der = await tabPage(o.pg, '#mur'); if (bb) { await o.pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); for (let k = 0; k < R.pages.length - 1; k++) { await o.pg.mouse.wheel(0, -300); await p(900); } }
    R.moletteReste = JSON.stringify(((await tabPage(o.pg, '#mur')) || {}).rangees) === JSON.stringify((der || {}).rangees) && (await ici_(o.pg)).eid === R.eidT;
    for (let k = 0; k < R.pages.length - 1; k++) { await o.pg.keyboard.press('Shift+ArrowLeft'); await p(900); } R.molette = await tabPage(o.pg, '#mur'); R.moletteEid = (await ici_(o.pg)).eid; }
  R.n = n; R.errs.push(...o.errs, ...o.boites); if (T) R.errs.push(...T.errs, ...T.boites); await o.ctx.close(); if (T) await T.ctx.close(); return R; };
const verifP = (k, R, quoi) => { const P = R.pages; const toutes = P.map(x => (x.a || {}).rangees || []); const vues = [].concat(...toutes);
  const ok1 = P.length > 1 && vues.length === R.n && new Set(vues).size === R.n && vues.every((v, i) => v === i + 1);
  const ok2 = P.every(x => x.a && x.a.entete && !x.a.coupees.length && x.b && x.b.entete && !x.b.coupees.length && JSON.stringify(x.b.rangees) === JSON.stringify(x.a.rangees) && (!x.c || (x.c.entete && !x.c.coupees.length && JSON.stringify(x.c.rangees) === JSON.stringify(x.a.rangees))));
  const loi = (px, h, pt) => Math.abs(parseFloat(px) - h * 0.056 * pt / 32) < 0.06;   /* T1 : 32 pt l'en-tête, 26 pt les cases, à la hauteur de la diapo (qui, au pilote, suit la place que lui laissent les notes) */
  const ok3 = P.every(x => x.a && loi(x.a.fs, x.a.murH, 26) && loi(x.a.fsT, x.a.murH, 32));
  verif(k, ok1, quoi + ' : ' + P.length + ' pages, chaque rangée une fois et dans l’ordre (' + toutes.map(t => '[' + t.join(',') + ']').join(' ') + '), la coupure entre deux rangées', toutes);
  verif(k, ok2, quoi + ' : sur chaque page, l’en-tête en haut, aucune case coupée, au pilote, à la fenêtre du tableau' + (P[0].c ? ', au tableau distant' : '') + ' (les mêmes rangées)', P.map(x => ({ pilote: x.a && [x.a.page, x.a.coupees.length], tableau: x.b && [x.b.rangees.join(','), x.b.coupees.length], distant: x.c && [x.c.rangees.join(','), x.c.coupees.length] })));
  verif(k, ok3 && R.moletteReste && R.molette && (R.molette.rangees || [])[0] === 1, quoi + ' : la police ne rapetisse pas — sur chaque page, 26 pt les cases et 32 pt l’en-tête à la hauteur de la diapo (' + P.map(x => x && x.a ? x.a.fs + '/' + x.a.fsT + ' pour ' + x.a.murH + ' px' : '?').join(' ; ') + ') ; en jeu, la molette ne change pas de page (⑱) ; Maj + ← revient à la page 1', { molette: R.moletteReste, premiere: R.molette && (R.molette.rangees || []).join(','), polices: P.map(x => x.a && [x.a.fs, x.a.fsT, x.a.murH]) });
  verif(k, !R.errs.length, quoi + ' : aucune erreur JS, aucune boîte système', R.errs.join(' ; ')); };
if (joue('P')) { dire(''); dire('══ P · le schéma « tableau » plus haut qu’une diapo : ses rangées passent en pages (les cinq œuvres avec « Ce que j’en retiens », les douze vers de « Demain, dès l’aube ») ══');
  for (const [W, H] of String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number))) { const T = W + '×' + H;
    for (const [nom, src] of [['retiens', RETIENS], ['douze', DOUZE]]) { const R = await jouerP(FICHIER, src, W, H, nom, false); verifP('P', R, T + ' · en classe · ' + nom); } }
  for (const [nom, src] of [['retiens', RETIENS], ['douze', DOUZE]]) { const R = await jouerP(FICHIER, src, 1536, 864, nom + '-repetition', true); const P = R.pages;
    const toutes = P.map(x => (x.a || {}).rangees || []); const vues = [].concat(...toutes);
    verif('P', P.length > 1 && vues.length === R.n && new Set(vues).size === R.n && P.every(x => x.a && x.a.entete && !x.a.coupees.length && (!x.b || (!x.b.coupees.length && JSON.stringify(x.b.rangees) === JSON.stringify(x.a.rangees)))) && !R.errs.length, '1536×864 · en répétition · ' + nom + ' : ' + P.length + ' pages, chaque rangée une fois, l’en-tête, aucune case coupée au pilote et à la fenêtre du tableau, aucune erreur', P.map(x => x.a && [x.a.page, x.a.rangees.join(','), x.a.coupees.length])); }
  /* dans l'Atelier, et sa vignette */
  for (const [nom, src] of [['retiens', RETIENS], ['douze', DOUZE]]) { HUBN = hubDe(store(src)); ECR = []; const o = await ouvrir({}); await ouvrirAtelier(o); const l2 = await lignesX(o.pg); const y = l2.find(e => /Les cinq tableaux/.test(e.t)); if (y) { await (await o.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(1200); }
    const a = await tabPage(o.pg, '#mur'); await capt(o.pg, 'P-' + nom + '-1536x864-atelier'); await o.pg.keyboard.press('Shift+ArrowRight').catch(() => {}); await p(1200); const a2 = await tabPage(o.pg, '#mur'); await capt(o.pg, 'P-' + nom + '-1536x864-atelier-page2');
    const vg = await o.pg.evaluate(() => { const v = document.querySelector('#volet .vig.cour, #volet .dr-d.on'); return v ? (v.innerText || '').slice(0, 40) : null; });
    verif('P', a && /page 1 \/ \d/.test(a.page) && a.entete && !a.coupees.length && a2 && !a2.coupees.length && !o.errs.length && !o.boites.length, '1536×864 · dans l’Atelier · ' + nom + ' : « ' + (a || {}).page + ' », l’en-tête, aucune case coupée ; Maj + → : « ' + (a2 || {}).page + ' »', { p1: a && a.rangees, p2: a2 && a2.rangees, erreurs: o.errs.concat(o.boites) }); await o.ctx.close(); } }

/* ═══ M · (§3.5 des quatre dettes) l'image pleine et la marge du fil : les cinq images de l'heure 1 (séance 1, 3e), tout dévoilé ═══ */
const imgMesure = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; const M = m.getBoundingClientRect(); const fil = m.querySelector('.dr-fil'); const F = fil ? fil.getBoundingClientRect() : null;
  return Array.from(m.querySelectorAll('.img-sup')).filter(x => x.getClientRects().length).map(x => { const q = v => Math.round(v * 10) / 10; const im = x.querySelector(':scope > img'); let r = (im || x).getBoundingClientRect();   /* l'image vue : sa boîte, et dans sa boîte ce que « object-fit » en montre */
    if (im && im.naturalWidth && /contain|scale-down/.test(getComputedStyle(im).objectFit)) { const B = im.getBoundingClientRect(); const k = Math.min(B.width / im.naturalWidth, B.height / im.naturalHeight); const w = im.naturalWidth * k, h = im.naturalHeight * k; r = { left: B.left + (B.width - w) / 2, right: B.left + (B.width + w) / 2, top: B.top + (B.height - h) / 2, bottom: B.top + (B.height + h) / 2, width: w, height: h }; }
    const lg = x.parentElement && x.parentElement.querySelector('.img-lg'); const L = lg ? lg.getBoundingClientRect() : null; const act = m.querySelector('.ecran.plein-img .act'); const A = act ? act.getBoundingClientRect() : null;
    return { g: q(r.left - M.left), d: q(r.right - M.left), h: q(r.top - M.top), b: q(r.bottom - M.top), W: q(M.width), coupe: q(Math.max(0, r.right - M.right) + Math.max(0, M.left - r.left) + Math.max(0, r.bottom - M.bottom) + Math.max(0, M.top - r.top)), sousFil: F ? r.left < F.right - 0.5 : false,
      lgCoupe: L ? q(Math.max(0, L.right - M.right)) : 0, actSousFil: A && F ? A.left < F.right - 0.5 : false, mk: Array.from(x.querySelectorAll('.mk')).map(k => { const R = k.getBoundingClientRect(); return [q(((R.left + R.width / 2) - r.left) / r.width * 100), q(((R.top + R.height / 2) - r.top) / r.height * 100)]; }) }; }); }, sel).catch(() => null) : null;
const jouerM = async (fichier, W, H, nom) => { HUBN = hubDe(storeOuverture(RACINE, { champs: true })); ECR = []; const out = []; const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W, H, prof: false }); await p(1200);
  const o = await ouvrir({ fichier, W, H, test: true }); await lancerClasse(o); const fen = await ouvrirTableau(o, W, H);
  const L = await o.pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid, img: (e.blocs || []).some(b => b && b.t === 'image'), act: e.act })); } catch (e) { return []; } });
  for (const x of L.filter(y => y.img)) { await allerA(o.pg, x.eid); await o.pg.click('#numero').catch(() => {}); for (let k = 0; k < 6; k++) { const s2 = await ici_(o.pg); if (s2.eid !== x.eid || /^(\d+) \/ \1 dévoilés|rien à dévoiler/.test(s2.compte)) break; await o.pg.keyboard.press('ArrowRight'); await p(300); } await p(1500);
    for (const q of [[o.pg, '#mur'], [fen, '#mur2'], [T.pg, 'body']]) if (q[0]) await q[0].waitForFunction(sel => { const m = document.querySelector(sel); const l = m ? Array.from(m.querySelectorAll('.img-sup > img')) : []; return l.length > 0 && l.every(i => i.complete && i.naturalWidth > 0); }, q[1], { timeout: 8000 }).catch(() => {}); await p(600);   /* l'image chargée (sa forme ajuste sa boîte) */
    out.push({ act: x.act, a: await imgMesure(o.pg, '#mur'), b: await imgMesure(fen, '#mur2'), c: await imgMesure(T.pg, 'body') }); await capt(o.pg, 'M-' + nom + '-' + W + 'x' + H + '-' + x.act.replace(/\W+/g, '') + '-pilote'); if (fen) await capt(fen, 'M-' + nom + '-' + W + 'x' + H + '-' + x.act.replace(/\W+/g, '') + '-tableau'); }
  const errs = o.errs.concat(o.boites, T.errs, T.boites); await o.ctx.close(); await T.ctx.close();
  const o2 = await ouvrir({ fichier, W, H }); await ouvrirAtelier(o2); const at = []; for (const x of L.filter(y => y.img)) { const t = await o2.pg.$('#volet [data-eid="' + x.eid + '"] .t'); if (t) { await t.click(); await p(900); await o2.pg.waitForFunction(() => { const l = Array.from(document.querySelectorAll('#mur .img-sup > img')); return l.length > 0 && l.every(i => i.complete && i.naturalWidth > 0); }, null, { timeout: 8000 }).catch(() => {}); await p(400); at.push({ act: x.act, a: await imgMesure(o2.pg, '#mur'), v: await imgMesure(o2.pg, '#volet .vig.cour, #volet .dr-d.on') }); } }
  await capt(o2.pg, 'M-' + nom + '-' + W + 'x' + H + '-atelier'); errs.push(...o2.errs, ...o2.boites); await o2.ctx.close(); return { out, at, errs }; };
if (joue('M')) { dire(''); dire('══ M · l’image pleine et la marge du fil : les cinq images de l’heure 1, au pilote, à la fenêtre du tableau, au tableau distant, dans l’Atelier ══');
  const AVANT = process.env.MJPC_AVANT && fs.existsSync(process.env.MJPC_AVANT) ? process.env.MJPC_AVANT : null;
  for (const [W, H] of String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number))) { const T = W + '×' + H;
    const r = await jouerM(FICHIER, W, H, 'apres'); const tous = [].concat(...r.out.map(x => [].concat(x.a || [], x.b || [], x.c || [])), ...r.at.map(x => [].concat(x.a || [], x.v || [])));   /* une coupure : plus d'un pixel (sous le pixel, l'arrondi de la mise en page) */
    const coup = r.out.map(x => x.act + ' : pilote ' + JSON.stringify((x.a || []).map(i => [i.g, i.d, i.coupe])) + ' tableau ' + JSON.stringify((x.b || []).map(i => [i.g, i.d, i.coupe])) + ' distant ' + JSON.stringify((x.c || []).map(i => [i.g, i.d, i.coupe])));
    verif('M', r.out.length >= 5 && r.out.every(x => x.a && x.a.length && x.b && x.b.length && x.c && x.c.length) && tous.every(i => i.coupe <= 1 && !i.sousFil && i.lgCoupe <= 1 && !i.actSousFil), T + ' · les ' + r.out.length + ' images pleines : aucune coupée, aucune sous le fil (l’étiquette et la légende non plus) — au pilote, à la fenêtre du tableau, au tableau distant, dans l’Atelier', coup);
    if (AVANT) { const a = await jouerM(AVANT, W, H, 'avant'); const cAv = a.out.map(x => x.act + ' ' + JSON.stringify(((x.b || [])[0] || {}).coupe)); dire('      M · avant (' + T + ', la base) : ' + a.out.map(x => x.act + ' tableau ' + JSON.stringify((x.b || []).map(i => [i.g, i.d, i.coupe]))).join(' ; '));
      const memes = r.out.every((x, k) => { const y = a.out[k]; if (!y) return false; return [['a', 'a'], ['b', 'b'], ['c', 'c']].every(([u]) => (x[u] || []).every((i, n) => { const j = (y[u] || [])[n]; if (!j) return false; const tenait = !j.coupe; const tailleOk = tenait ? Math.abs((i.d - i.g) / i.W - (j.d - j.g) / j.W) * Math.max(i.W, j.W) <= 1.5 : true;   /* (C16, les dernières dettes) la taille dans la diapo : au pilote, la diapo d'avant n'avait pas toujours sa taille à l'arrivée (le titre mesuré trop tôt, corrigé au ⑮) */ return tailleOk && JSON.stringify(i.mk) === JSON.stringify(j.mk); })); });
      verif('M', memes, T + ' · une image qui tenait garde sa taille ; les repères restent sur les mêmes points de l’image (avant / après)', { avantCoupees: cAv }); }
    verif('M', !r.errs.length, T + ' · aucune erreur JS, aucune boîte système', r.errs.join(' ; ')); } }

/* ═══ G · (§3.5) le schéma « tableau » aux cellules longues, aux trois tailles ═══ */
const grille = (pg, sel) => pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; const t = m.querySelector('table.p8-grille'); if (!t) return null; const z = t.closest('.p8-dessin'); const M = m.getBoundingClientRect(), Z = z.getBoundingClientRect(), T = t.getBoundingClientRect();
  const dedans = (r, R) => r.left >= R.left - 0.5 && r.right <= R.right + 0.5 && r.top >= R.top - 0.5 && r.bottom <= R.bottom + 0.5;
  const cases = Array.from(t.querySelectorAll('th, td')); const visibles = cases.filter(c => getComputedStyle(c.parentElement).visibility !== 'hidden');
  const coupees = visibles.filter(c => { const r = c.getBoundingClientRect(); return !dedans(r, Z) || c.scrollWidth > c.clientWidth + 1; }).map(c => c.textContent.slice(0, 30));
  const rel = r => [r.left - M.left, r.top - M.top, r.width, r.height].map(x => Math.round(x * 10) / 10);
  const aLaLigne = cases.filter(c => { const rg = document.createRange(); rg.selectNodeContents(c); return new Set(Array.from(rg.getClientRects()).map(r => Math.round(r.top))).size > 1; }).length;
  return { tableau: rel(T), dessin: rel(Z), dansDessin: dedans(T, Z), dansDiapo: dedans(T, M), coupees, n: visibles.length, total: cases.length, fs: getComputedStyle(t.querySelector('td')).fontSize, aLaLigne, murH: Math.round(M.height * 10) / 10 }; }, sel);
/* (C16, les dernières dettes) « identique » se lit dans la diapo : au pilote, la diapo d'avant n'avait pas toujours sa taille à l'arrivée (le titre mesuré trop tôt, corrigé
   au ⑮ : 416 px de haut au lieu de 437 à 1366 × 768) — la place, la taille et la police rapportées à la hauteur de la diapo, à 1,5 px près ; tout le reste égal */
const memeG = (a, b) => { if (!a || !b) return false; const k = a.murH / b.murH; const px = (x, y) => Math.abs(x - y * k) <= 1.5; const L = (u, v) => u.length === v.length && u.every((x, i) => px(x, v[i]));
  return L(a.tableau, b.tableau) && L(a.dessin, b.dessin) && px(parseFloat(a.fs), parseFloat(b.fs)) && a.dansDessin === b.dansDessin && a.dansDiapo === b.dansDiapo && JSON.stringify(a.coupees) === JSON.stringify(b.coupees) && a.n === b.n && a.total === b.total && a.aLaLigne === b.aLaLigne; };
const jouerG = async (fichier, src, W, H, nom) => { HUBN = hubDe(store(src)); ECR = []; const o = await ouvrir({ fichier, W, H, test: true }); await lancerClasse(o); const fen = await ouvrirTableau(o, W, H);
  const L = await eidsDe(o.pg); const x = L.find(e => e.act === 'Les cinq tableaux');
  { const v = await o.pg.$('#volet .vig:has(table.p8-grille)'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); if (await o.pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) { await o.pg.click('#garde-devant'); await p(900); } } }
  await o.pg.click('#numero').catch(() => {});
  for (let k = 0; k < 12; k++) { const s = await ici_(o.pg); if (/^(\d+) \/ \1 dévoilés|rien à dévoiler/.test(s.compte) || s.eid !== (x && x.eid)) break; await o.pg.keyboard.press('ArrowRight'); await p(300); }
  await p(900); const gp = await grille(o.pg, '#mur'), gt = fen ? await grille(fen, '#mur2') : null; const s = await ici_(o.pg); const gv = await grille(o.pg, '#volet .vig:has(table.p8-grille)');
  await capt(o.pg, 'G-' + nom + '-' + W + 'x' + H + '-pilote'); if (fen) await capt(fen, 'G-' + nom + '-' + W + 'x' + H + '-tableau');
  /* dans l'Atelier, la même diapo et sa vignette */
  const r = { gp, gt, gv, compte: s.compte, errs: o.errs.slice(), boites: o.boites.slice() }; await o.ctx.close();
  const o2 = await ouvrir({ fichier, W, H }); await ouvrirAtelier(o2); const l2 = await lignesX(o2.pg); const y = l2.find(e => /Les cinq tableaux/.test(e.t)); if (y) { await (await o2.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(1000); }
  r.ga = await grille(o2.pg, '#mur'); await capt(o2.pg, 'G-' + nom + '-' + W + 'x' + H + '-atelier'); r.errs.push(...o2.errs); r.boites.push(...o2.boites); await o2.ctx.close(); return r; };
if (joue('G')) { dire(''); dire('══ G · le schéma « tableau » : les cinq œuvres aux cellules d’une phrase, aux trois tailles, tout dévoilé ══');
  const AVANT = process.env.MJPC_AVANT && fs.existsSync(process.env.MJPC_AVANT) ? process.env.MJPC_AVANT : null;
  for (const [W, H] of String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number))) { const T = W + '×' + H;
    const g = await jouerG(FICHIER, LONG, W, H, 'long');
    const bon = x => x && x.dansDessin && x.dansDiapo && !x.coupees.length;
    verif('G', /^(\d+) \/ \1 dévoilés|rien à dévoiler/.test(g.compte) && bon(g.gp) && bon(g.gt) && bon(g.ga) && (!g.gv || (g.gv.dansDessin && !g.gv.coupees.length)), T + ' · le tableau des cinq œuvres (une phrase par cellule), tout dévoilé : il tient dans son dessin et dans la diapo, aucune cellule coupée — au pilote, à la fenêtre du tableau, dans l’Atelier, dans sa vignette', { compte: g.compte, pilote: g.gp, tableau: g.gt, atelier: g.ga, vignette: g.gv });
    verif('G', g.gp && g.gp.aLaLigne >= 5 && g.gt && g.gt.aLaLigne >= 5, T + ' · les cellules longues passent à la ligne (' + (g.gp || {}).aLaLigne + ' cellules sur plusieurs lignes au pilote, ' + (g.gt || {}).aLaLigne + ' au tableau) ; la police reste celle de la loi (' + (g.gp || {}).fs + ')');
    verif('G', !g.errs.length && !g.boites.length, T + ' · aucune erreur JS, aucune boîte système', g.errs.concat(g.boites).join(' ; '));
    if (AVANT) { const c1 = await jouerG(AVANT, COURT, W, H, 'court-avant'), c2 = await jouerG(FICHIER, COURT, W, H, 'court-apres');
      verif('G', c1.gp && c2.gp && memeG(c1.gp, c2.gp) && memeG(c1.gt, c2.gt), T + ' · un tableau aux cellules courtes : identique avant / après (sa place, sa taille, sa police, au pilote et au tableau)', { avant: c1.gp, apres: c2.gp }); }
    if (AVANT) { const a = await jouerG(AVANT, LONG, W, H, 'long-avant'); verif('G', a.gp && g.gp && memeG(a.gp, g.gp) && memeG(a.gt, g.gt) && memeG(a.ga, g.ga), T + ' · le tableau des cinq œuvres (il tient) : identique avant / après (sa place, sa taille, sa police, au pilote, au tableau, dans l’Atelier ; aucune page)', { avant: a.gp, apres: g.gp }); } } }

if (VRAI) { dire(''); verif('㉘', !REFUSES.length, 'le faux hub rangé comme le vrai (qui refuse les clés interdites) : ' + REFUSES.length + ' écriture(s) refusée(s) sur toute la sonde', REFUSES.slice(0, 6).map(x => x.m + ' ' + x.c + ' (' + x.ko + ')')); }   /* C16 (les correctifs, ㉘) */
dire(''); dire('— fin : ' + nb + ' vérifications, ' + echecs + ' échec(s) · ' + (echecs ? 'ROUGE' : 'VERT'));
fs.writeFileSync(path.join(OUT, 'sonde-dettes.txt'), R.join('\n') + '\n'); if (ancTiree) try { fs.unlinkSync(ANC); } catch (e) {}
await nav.close(); process.exit(echecs ? 1 : 0);
