// LA SONDE DES DERNIÈRES DETTES (MANDATS/DEROULE-01-11/MANDAT-DERNIERES-DETTES.md §5.1, une partie par point de §3) — par le geste. Le modèle :
// QUATRE-DETTES/sonde-dettes.mjs (le faux hub vit dans la sonde, tous les navigateurs le partagent : le pilote, sa fenêtre du tableau, le tableau distant
// `?vue=tableau`, l'Atelier). Aucune écriture ni lecture du vrai hub : chaque adresse Firebase est servie par la sonde, tout le reste est coupé.
// usage : node sonde-fin.mjs <assemble/index.html> [dossier-de-sortie]
//   MJPC_PARTIES (défaut C,F,H,L,V,J,N : les parties qui doivent être VERT) · MJPC_AVANT=<assemblé d'avant> : les comparaisons avant / après (F, H) ·
//   MJPC_MEDIAS=<dossier> : les vraies images du chapitre de 3e (jamais poussées) · MJPC_CONSTRUIT=<dossier> : le hub construit de la conscience (le chapitre
//   de 4e, Le Horla ; jamais poussé) et MJPC_MEDIAS_4E=<dossier> ses images · MJPC_CAPT=<dossier> : les captures (jamais poussées) · MJPC_TAILLES ·
//   MJPC_ANCIENNE=<la 8.77.1-⑩> : la partie F rejouée aussi sur elle (l'avant compté, « F-avant ») · MJPC_D_FOIS (défaut 10).
//  C · (⑮, §3.1) le tableau en pages ne bouge pas d'une page à l'autre : les cinq œuvres avec « Ce que j'en retiens », les douze vers de « Demain, dès
//      l'aube » ; aux trois tailles, en classe (pilote, fenêtre du tableau, tableau distant ; Maj + → de page en page), en répétition, dans l'Atelier : sur
//      chaque page, l'en-tête au même endroit et à la même hauteur, les mêmes bords gauche et droit de chaque case (±1 px) ; la dernière page commence en
//      haut comme les autres ; chaque rangée une fois ; aucune case coupée ; la police à la loi.
//  D · (⑯, §3.2) hors défaut : le temps entre la flèche et le premier mouvement du point, au tableau et au pilote, relevé image par image
//      (requestAnimationFrame dans la page) — MJPC_D_FOIS fois (défaut 10) à chaque passage ; avec MJPC_AVANT, l'assemblé d'avant aussi.
//  F · (⑫, §3.3) les éléments que le fil a poussés de la marge : la vidéo, le document, la fiche ouverte en page, la légende des surligneurs, les alertes de
//      forme — aux trois tailles du pilote et au tableau en 1280 × 720 ; au pilote, à la fenêtre du tableau, au tableau distant, dans l'Atelier : aucun ne
//      déborde à droite, aucun ne passe sous le fil, rien n'est coupé.
//  H · (⑬, §3.4) l'image pleine au tableau en 1280 × 720 (les cinq images de l'heure 1, 3e) et sur le chapitre de 4e du hub construit (Le Horla) : aucune
//      image coupée, aucune sous le fil ; une image qui tenait garde sa taille ; les repères aux mêmes points (avec MJPC_AVANT).
//  L · (⑭, §3.5) une rangée de tableau seule plus haute qu'une page (une strophe entière dans une case, à 26 pt), aux trois tailles : ce que voit Paul au
//      pilote, la classe au tableau ; ce qui est coupé, en pixels et en lignes ; ce que l'Atelier signale à la préparation (« hors du cadre ») et où. Le
//      comportement ne change pas (seule sur sa page, ancrée en haut) : la partie vérifie ce comportement tranché et écrit les chiffres.
//  V · (⑰, §3.6) le témoin « déroulé intègre » au faux hub ordinaire et au faux hub rangé comme le vrai (« intègre » quand rien n'est perdu), l'écriture de la
//      copie refusée (« à vérifier ») ; avec MJPC_FIREBASE=<dossier où firebase@8.10.1 est installé>, la copie passée par le code de Firebase lui-même.
//  J · (⑱, §3.7) en jeu (classe en mode test, une vraie heure au faux hub, répétition), dix crans de molette et dix flèches de la colonne : ni diapo ni page ne
//      changent, au pilote, à la fenêtre du tableau, au tableau distant ; → dévoile toujours ; dans l'Atelier, un cran = une diapo (inchangé).
//  N · (⑲, §3.8) l'Atelier, aux deux faux hubs : une diapo neuve écrite trois fois sans faux conflit ; deux navigateurs sur la même diapo : le conflit paraît.
// Aucune erreur JS, aucune boîte système, dans chaque cas. Code 1 si un échec.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-fin.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + (typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 1400) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'C,F,H,L,V,J,N').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;   /* les vraies images du chapitre (un dossier local, jamais poussé) ; sinon l'image du canon */
const MEDIAS4 = process.env.MJPC_MEDIAS_4E && fs.existsSync(process.env.MJPC_MEDIAS_4E) ? process.env.MJPC_MEDIAS_4E : null;
const CONSTRUIT = process.env.MJPC_CONSTRUIT && fs.existsSync(process.env.MJPC_CONSTRUIT) ? process.env.MJPC_CONSTRUIT : null;
const AVANT = process.env.MJPC_AVANT && fs.existsSync(process.env.MJPC_AVANT) ? path.resolve(process.env.MJPC_AVANT) : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
dire('C16 · sonde des dernières dettes · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (AVANT ? ' · avant md5 ' + md5(AVANT) : '') + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon') + (CONSTRUIT ? ' · hub construit : un dossier local' : ''));

/* ── la séance 1 du faux hub (comme sonde-dettes.mjs) : dans l'heure 1, « Tableau 2 » devient un schéma « tableau » ── */
const sk0 = st => { const S0 = st.site['3e'].chapitres[0].seances; return Object.keys(S0).filter(k => S0[k] && S0[k].type !== 'sommaire').sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); };
const store = (src = null, retouche = null) => { const st = storeOuverture(RACINE, { champs: true }); const ch = st.site['3e'].chapitres[0];
  const E = ch.seances[sk0(st)[0]].deroule.ecrans; const t2 = E.find(e => e && e.act === 'Tableau 2');
  if (t2 && src) { t2.act = 'Les cinq tableaux'; t2.blocs = [{ t: 'schema', forme: 'tableau', id: 'bsonde-tab', titre: 'Les cinq tableaux', src }]; }
  if (retouche) retouche(E, st); return st; };
/* le hub construit de la conscience (3e « Poésie et peinture », 4e Le Horla) : lu tel quel, jamais modifié, jamais poussé */
const storeConstruit = () => { const J = f => JSON.parse(fs.readFileSync(path.join(CONSTRUIT, f), 'utf8')); const ex = f => fs.existsSync(path.join(CONSTRUIT, f));
  return { classes: J('classes.json'), taxonomie: ex('taxonomie.json') ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), '4e': ex('site_4e.json') ? J('site_4e.json') : null, config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } }; };

/* ── le faux hub partagé (Node) : chaque navigateur y lit et y écrit ── */
let HUBN = null; let ECR = []; let VRAI = false; let REFUS = null;   /* VRAI : le faux hub range comme le vrai (partie V) ; REFUS : une adresse dont l'écriture est refusée (401) */
/* le faux hub rangé comme le vrai (la règle de QUATRE-DETTES/sonde-dettes.mjs, citée là ; et — la voie (b), 02/11 07:12, mesuré sur le code de Firebase 8.10.1 — les
   clés d'un objet relues triées) : une valeur nulle, une liste ou un objet vides ne sont pas rangés (leur parent devenu vide non plus) ; une liste est rangée en
   objet aux clés « 0 », « 1 »… et relue en liste quand ses clés sont des entiers dont plus de la moitié de 0 au plus grand sont là */
const ranger = v => { if (v === null || v === undefined) return undefined; if (typeof v === 'number' && !isFinite(v)) return undefined; if (typeof v !== 'object') return v;
  const o = {}; (Array.isArray(v) ? v.map((x, i) => [String(i), x]) : Object.entries(v)).forEach(([k, x]) => { const r = ranger(x); if (r !== undefined) o[k] = r; }); return Object.keys(o).length ? o : undefined; };
const relire = v => { if (v === null || v === undefined || typeof v !== 'object') return v; const K = Object.keys(v).sort(); const o = {}; K.forEach(k => { o[k] = relire(v[k]); });
  if (K.length && K.every(k => /^(0|[1-9]\d*)$/.test(k))) { const max = Math.max(...K.map(Number)); if (K.length * 2 > max + 1) { const a = new Array(max + 1).fill(null); K.forEach(k => { a[+k] = o[k]; }); return a; } } return o; };
/* C16 (les correctifs, ㉘) : rangé comme le vrai, le faux hub REFUSE aussi, comme le vrai, toute clé qui porte . # $ [ ] / (ou vide, ou un caractère de contrôle), à chaque
   niveau du corps écrit, en PUT et en PATCH (les clés de tête d'un PATCH sont des chemins), et tout morceau d'adresse qui en porte : HTTP 400, rien n'est rangé
   (le modèle : CORRECTIFS/sonde-correctifs.mjs). Chaque refus est compté dans `REFUSES` et dit à la fin. */
const REFUSES = []; const CLE_KO = /[.#$\[\]\/\u0000-\u001F\u007F]/;
const cleFautive = (v, ch) => { if (v && typeof v === 'object') for (const k of Object.keys(v)) { if (k === '' || CLE_KO.test(k)) return ch + '/' + k; const r = cleFautive(v[k], ch + '/' + k); if (r) return r; } return null; };
const refusDe = (m, c, bd) => { if (c.split('/').filter(Boolean).some(x => /[.#$\[\]\u0000-\u001F\u007F]/.test(x))) return 'adresse « ' + c + ' »';
  if (m === 'PATCH' && bd && typeof bd === 'object') { for (const k of Object.keys(bd)) { if (k.split('/').some(x => /[.#$\[\]\u0000-\u001F\u007F]/.test(x))) return 'clé de tête « ' + k + ' »'; const r = cleFautive(bd[k], c + '/' + k); if (r) return r; } return null; } return cleFautive(bd, c); };
const lireH0 = c => { const q = c.split('/').filter(Boolean); let n = HUBN; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
const lireH = c => { const n = lireH0(c); return VRAI ? (n == null ? null : relire(n)) : n; };
const posH = (c, v) => { const q = c.split('/').filter(Boolean); if (VRAI) v = ranger(v); if (v === undefined) v = null; let n = HUBN; const pile = [n]; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) { if (v === null) return; n[q[k]] = {}; } n = n[q[k]]; pile.push(n); }
  if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v;
  if (VRAI && v === null) for (let k = q.length - 2; k >= 0; k--) { if (pile[k + 1] && typeof pile[k + 1] === 'object' && !Object.keys(pile[k + 1]).length) delete pile[k][q[k]]; else break; } };
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') return JSON.stringify(lireH(c)); let bd = null; try { bd = JSON.parse(corps || 'null'); } catch (e) {}
  if (REFUS && REFUS.test(c)) { ECR.push({ qui, m, c, t: Date.now(), refus: true, bd }); return '§401§{"error":"Permission denied"}'; } if (VRAI) { const ko = refusDe(m, c, bd); if (ko) { REFUSES.push({ qui, m, c, ko }); ECR.push({ qui, m, c, t: Date.now(), refus: true }); return '§400§' + JSON.stringify({ error: 'Invalid data; ' + ko }); } } ECR.push({ qui, m, c, t: Date.now(), bd });
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => /^§401§/.test(t) ? new Response(t.slice(5), { status: 401 }) : new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const imageDe = u => { const m = /mjpc-medias\/(.*\/)?([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (!m) return null; for (const d of [MEDIAS, MEDIAS4].filter(Boolean)) { const f = path.join(d, m[2]); if (fs.existsSync(f)) return f; } return IMG_OUV[m[2]] || IMG_DEFAUT; };
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
  if (prof) { await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }); await p(300);
    await pg.click('#tprof-btn'); await p(600); if (test) await pg.evaluate(() => { window.M8_TEST = true; }); }
  return { ctx, pg, errs, boites, qui }; };
const capt = async (pg, nom) => { if (CAPT && pg) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const lancerClasse = async (o, jour = '2026-09-14', classe = /Charles/i) => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'edtOuvrir()'))) await pg.evaluate(() => edtOuvrir()); await p(1500);
  const ok = await pg.evaluate(({ j, c }) => { const re = new RegExp(c, 'i'); const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && re.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return false; x.click(); return true; }, { j: jour, c: classe.source }); await p(800);
  const l = ok && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape'); await p(400); return !!l; };
const ouvrirTableau = async (o, W = 1280, H = 720) => { if (!(await o.pg.isVisible('#bvideoproj').catch(() => false))) return null; const [fen] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), o.pg.click('#bvideoproj')]); await p(1500); if (fen) await fen.setViewportSize({ width: W, height: H }); await o.pg.bringToFront(); return fen; };
const ouvrirAtelier = async o => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'atelierOuvrir()'))) await pg.evaluate(() => atelierOuvrir()); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(3000); };
const ici_ = pg => pg.evaluate(() => { const c = document.getElementById('compte'); let eid = null; try { eid = seance().ecrans[S.di].eid; } catch (e) {} return { eid, di: typeof S !== 'undefined' ? S.di : null, compte: c ? c.textContent.trim() : '', numero: ((document.getElementById('numero') || {}).textContent || '').replace(/\s+/g, ' ').trim() }; });
const eidsDe = pg => pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid, role: e.role || '', act: e.act, heure: e.heure, types: (e.blocs || []).map(b => b && b.t) })); } catch (e) { return []; } });
const lignesX = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ di: +d.dataset.atDi, eid: d.dataset.eid, t: ((d.querySelector('.t') || d).textContent || '').replace(/\s+/g, ' ').trim() })));
/* aller à une diapo par sa vignette (la garde : « Y aller devant la classe ») */
const allerA = async (pg, eid) => { const L = await eidsDe(pg); const x = L.find(e => e.eid === eid); if (!x) return false; const v = await pg.$('#volet .vig[data-i="' + x.i + '"]'); if (!v) return false;
  await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); if (await pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) { await pg.click('#garde-devant'); await p(900); }
  for (let k = 0; k < 20 && (await ici_(pg)).eid !== eid; k++) await p(200); return (await ici_(pg)).eid === eid; };
const toutDevoiler = async (pg, eid) => { await pg.click('#numero').catch(() => {}); for (let k = 0; k < 20 && (await ici_(pg)).eid !== eid; k++) await p(200); for (let k = 0; k < 14; k++) { const s2 = await ici_(pg); if (s2.eid !== eid || /^(\d+) \/ \1 dévoilés|rien à dévoiler|vidéo/.test(s2.compte)) break; await pg.keyboard.press('ArrowRight'); await p(300); } await p(900); };
const sansErreur = (k, errs, quoi) => verif(k, !errs.length, quoi + ' : aucune erreur JS, aucune boîte système', errs.join(' ; '));
const VUES = [['a', 'au pilote'], ['b', 'à la fenêtre du tableau'], ['c', 'au tableau distant']];

/* ═══ C · (⑮) le tableau en pages ne bouge pas d'une page à l'autre ═══ */
const RETIENS = 'Tableau | Peintre | Ce qu’on voit | Ce que j’en retiens\n'   /* l'exemple des quatre dettes (sonde-dettes.mjs, partie P) */
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
/* ce que la page montre du tableau : l'en-tête (sa place dans la diapo), le bord gauche et droit de chaque case de l'en-tête, la place du tableau dans son
   dessin, les rangées montrées, les cases coupées, la police */
const geoTab = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; const t = m.querySelector('table.p8-grille'); if (!t) return null; const z = t.closest('.p8-dessin'); const M = m.getBoundingClientRect(), Z = z.getBoundingClientRect(), T = t.getBoundingClientRect();
  const q = v => Math.round(v * 10) / 10; const dedans = (r, R) => r.left >= R.left - 0.5 && r.right <= R.right + 0.5 && r.top >= R.top - 0.5 && r.bottom <= R.bottom + 0.5; const vis = x => x.getClientRects().length > 0 && getComputedStyle(x).display !== 'none';
  const hd = t.querySelector('tr:not([data-pg])'); const H = hd.getBoundingClientRect(); const ths = Array.from(hd.children).map(c => { const r = c.getBoundingClientRect(); return [q(r.left - M.left), q(r.right - M.left)]; });
  const rs = Array.from(t.querySelectorAll('tr[data-pg]')).filter(vis); const cases = Array.from(t.querySelectorAll('th, td')).filter(c => vis(c.parentElement) && getComputedStyle(c.parentElement).visibility !== 'hidden');
  const coupees = cases.filter(c => { const r = c.getBoundingClientRect(); return !dedans(r, Z) || !dedans(r, M) || c.scrollWidth > c.clientWidth + 1; }).map(c => c.textContent.slice(0, 25));
  const tds = rs.length ? Array.from(rs[0].children).map(c => { const r = c.getBoundingClientRect(); return [q(r.left - M.left), q(r.right - M.left)]; }) : [];
  return { murW: q(M.width), murH: q(M.height), entete: [q(H.left - M.left), q(H.top - M.top), q(H.width), q(H.height)], cols: ths, colsRangee: tds, dansDessin: q(T.top - Z.top), basLibre: q(Z.bottom - T.bottom), tab: [q(T.left - M.left), q(T.top - M.top), q(T.width), q(T.height)],
    rangees: rs.map(r => +r.dataset.pg), coupees, page: ((m.querySelector('.mur .page') || m.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), fs: getComputedStyle(t.querySelector('td')).fontSize, fsT: getComputedStyle(t.querySelector('th')).fontSize }; }, sel).catch(() => null) : null;
const jouerC = async (fichier, src, W, H, nom, mode) => { HUBN = store(src); ECR = []; const n = src.split('\n').length - 1; const R = { pages: [], errs: [] };
  let T = null; if (mode === 'classe') { T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W, H, prof: false }); await p(1200); }
  const o = await ouvrir({ fichier, W, H }); let fen = null;
  if (mode === 'atelier') { await ouvrirAtelier(o); const l2 = await lignesX(o.pg); const y = l2.find(e => /Les cinq tableaux/.test(e.t)); if (y) { await (await o.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(1200); } }
  else if (mode === 'repetition') { await ouvrirAtelier(o); const l2 = await lignesX(o.pg); const y = l2.find(e => /Les cinq tableaux/.test(e.t)); if (y) { await (await o.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(900); } await o.pg.click('#at-jouer').catch(() => {}); await p(2500); fen = await ouvrirTableau(o, W, H); await o.pg.click('#numero').catch(() => {}); await p(1200); }
  else { await lancerClasse(o); fen = await ouvrirTableau(o, W, H); const v = await o.pg.$('#volet .vig:has(table.p8-grille)'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); if (await o.pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) { await o.pg.click('#garde-devant'); await p(900); } } await o.pg.click('#numero').catch(() => {}); await p(1200); }
  const memes = async (pg, sel, a) => { let g = null; for (let n = 0; n < 30; n++) { g = await geoTab(pg, sel); if (g && a && JSON.stringify(g.rangees) === JSON.stringify(a.rangees)) return g; await p(200); } return g; };   /* le tableau suit : on lui laisse jusqu'à 6 s pour montrer la même page (machine chargée) */
  for (let k = 0; k < 8; k++) { const a = await geoTab(o.pg, '#mur'), b = fen ? await memes(fen, '#mur2', a) : null, c = T ? await memes(T.pg, 'body', a) : null;
    if (process.env.MJPC_DIAG) dire('      diag ' + JSON.stringify(await o.pg.evaluate(() => { const h = s => { const e = document.querySelector(s); return e ? [e.offsetHeight, e.offsetWidth, getComputedStyle(e).display] : null; }; return { mur: h('#mur'), cadre: h('#murcadre'), scene: h('.scene'), titre: h('.titre'), outils: h('#dr-zone .outils'), alerte: h('#alerte-video'), notes: h('#notes, .notes, #p8-notes'), hO: S._hOutils, tc: S._tailleClasse }; })));
    R.pages.push({ a, b, c }); const base = 'C-' + nom + '-' + W + 'x' + H + '-' + mode + '-page' + (k + 1); await capt(o.pg, base + '-pilote'); if (fen) await capt(fen, base + '-tableau'); if (T) await capt(T.pg, base + '-distant');
    const m = /page (\d+) \/ (\d+)/.exec((a || {}).page || ''); if (!m || +m[1] >= +m[2]) break; await o.pg.keyboard.press('Shift+ArrowRight'); await p(1500); }
  R.n = n; R.errs.push(...o.errs, ...o.boites); if (T) R.errs.push(...T.errs, ...T.boites); await o.ctx.close(); if (T) await T.ctx.close(); return R; };
const pareil = (u, v, tol = 1) => Array.isArray(u) && Array.isArray(v) && u.length === v.length && u.every((x, i) => Array.isArray(x) ? pareil(x, v[i], tol) : Math.abs(x - v[i]) <= tol);
const verifC = (k, R, quoi, vues) => { const P = R.pages; const toutes = P.map(x => (x.a || {}).rangees || []); const vu = [].concat(...toutes);
  verif(k, P.length > 1 && vu.length === R.n && new Set(vu).size === R.n && vu.every((v, i) => v === i + 1), quoi + ' : ' + P.length + ' pages, chaque rangée une fois et dans l’ordre (' + toutes.map(t => '[' + t.join(',') + ']').join(' ') + ')', toutes);
  for (const [u, nomV] of vues) { const G = P.map(x => x[u]); if (!G.every(Boolean)) { verif(k, false, quoi + ' · ' + nomV + ' : le tableau sur chaque page', G.map(g => !!g)); continue; } const g0 = G[0];
    verif(k, G.every(g => pareil(g.entete, g0.entete) && pareil(g.cols, g0.cols) && pareil(g.colsRangee, g0.cols) && Math.abs(g.tab[0] - g0.tab[0]) <= 1 && Math.abs(g.tab[2] - g0.tab[2]) <= 1),
      quoi + ' · ' + nomV + ' : l’en-tête au même endroit et à la même hauteur, les mêmes bords gauche et droit de chaque case, sur chaque page (±1 px ; les cases des rangées sous celles de l’en-tête)', G.map(g => ({ page: g.page, entete: g.entete, cols: g.cols.map(c => c.join('-')).join(' '), rangee: g.colsRangee.map(c => c.join('-')).join(' '), diapo: [g.murW, g.murH] })));
    verif(k, G.every(g => Math.abs(g.dansDessin - g0.dansDessin) <= 1 && g.dansDessin <= 1), quoi + ' · ' + nomV + ' : chaque page commence en haut du dessin, la dernière comme les autres (pas recentrée)', G.map(g => g.page + ' : ' + g.dansDessin + ' px sous le haut du dessin, ' + g.basLibre + ' px libres en bas'));
    verif(k, G.every((g, i) => !g.coupees.length && JSON.stringify(g.rangees) === JSON.stringify(P[i].a.rangees)), quoi + ' · ' + nomV + ' : aucune case coupée, les mêmes rangées qu’au pilote', G.map(g => [g.page, g.rangees.join(','), g.coupees.length])); }
  const loi = (px, h, pt) => Math.abs(parseFloat(px) - h * 0.056 * pt / 32) < 0.06;
  verif(k, P.every(x => x.a && loi(x.a.fs, x.a.murH, 26) && loi(x.a.fsT, x.a.murH, 32)), quoi + ' : la police ne rapetisse pas — 26 pt les cases, 32 pt l’en-tête, à la hauteur de la diapo (' + P.map(x => x.a ? x.a.fs + '/' + x.a.fsT + ' pour ' + x.a.murH + ' px' : '?').join(' ; ') + ')');
  verif(k, !R.errs.length, quoi + ' : aucune erreur JS, aucune boîte système', R.errs.join(' ; ')); return P; };
if (joue('C')) { dire(''); dire('══ C · (⑮) le tableau en pages ne bouge pas d’une page à l’autre (les cinq œuvres avec « Ce que j’en retiens », les douze vers de « Demain, dès l’aube ») ══');
  for (const [W, H] of TAILLES) { const T = W + '×' + H;
    for (const [nom, src] of [['retiens', RETIENS], ['douze', DOUZE]]) { const Rr = await jouerC(FICHIER, src, W, H, nom, 'classe'); verifC('C', Rr, T + ' · en classe · ' + nom, VUES); } }
  for (const [nom, src] of [['retiens', RETIENS], ['douze', DOUZE]]) { const Rr = await jouerC(FICHIER, src, 1536, 864, nom, 'repetition'); verifC('C', Rr, '1536×864 · en répétition · ' + nom, VUES.slice(0, 2)); }
  for (const [nom, src] of [['retiens', RETIENS], ['douze', DOUZE]]) { const Rr = await jouerC(FICHIER, src, 1536, 864, nom, 'atelier'); verifC('C', Rr, '1536×864 · dans l’Atelier · ' + nom, VUES.slice(0, 1)); } }

/* ═══ D · (⑯) le temps entre la flèche et le premier mouvement du point, relevé image par image (hors défaut : une mesure de temps, seule sur la machine) ═══
   La séance de sonde-fil.mjs (le tableau aux cases courtes dans l'heure 1, la question sur le Turner, les hypothèses en deux pages). Trois passages, à 1536 × 864,
   en classe, mode test : (1) celui de l'étape 11 (la 2e diapo de l'heure vers la 3e : les compétences du chapitre → le parcours) ; (2) la diapo d'avant → le
   tableau des cinq œuvres ; (3) le tableau → la diapo suivante (sans tableau). Dans la page : l'heure de la flèche (`keydown`, au pilote) ; à chaque image
   (`requestAnimationFrame`), la hauteur du point, au pilote et à la fenêtre du tableau, pendant 1,5 s ; les heures sur une même horloge (`performance.timeOrigin`). */
const storeFil = () => store(null, E => { const par = t => E.find(e => e && e.act === t);
  const t2 = par('Tableau 2'); t2.act = 'Les cinq tableaux'; t2.blocs = [{ t: 'schema', forme: 'tableau', id: 'bsonde-tab', titre: 'Les cinq tableaux', src: 'Tableau | Peintre | Ce qu’on voit\nLe Radeau de la Méduse | Géricault | des naufragés\nLe lac | Bierstadt | des montagnes immenses\nPêcheurs en mer | Turner | une tempête la nuit\nLa ville au bord de l’eau | Schinkel | une cathédrale\nLe Voyageur | Friedrich | un homme de dos' }];
  const t3 = par('Tableau 3'); t3.act = 'Le tableau de Turner'; t3.blocs = [{ t: 'question', id: 'bsonde-q', q: 'Dans le tableau de Turner, qu’est-ce qui montre que l’homme est petit face à la nature ?', reps: [{ i: '', r: 'La barque est minuscule sous les vagues et le ciel noir : la tempête décide, pas les pêcheurs.', refo: false }] }]; });
const releve = (pg, sel) => pg.evaluate(sel => { const m = document.querySelector(sel); window.__GL = []; const t0 = performance.now(); const f = () => { const fl = m && m.querySelector(':scope > .dr-fil'); const i = fl && fl.querySelector('i'); if (i) window.__GL.push([performance.timeOrigin + performance.now(), i.getBoundingClientRect().top - m.getBoundingClientRect().top]); if (performance.now() - t0 < 1500) requestAnimationFrame(f); }; requestAnimationFrame(f); }, sel);
const PROFIL = ['devoiler', 'aller', 'allerSuivante', 'dr_auMur', 'dr_versMur', 'miniatures', 'p85hPages', 'etatComplet', 'dr_voletApres', 'rendre', 'volet', 'vueDroite', 'p8RendreNotes', 'ouOnEnEst', 'participation', 'brancherAtelier', 'brancherDocs', 'atSomSuivreCourant', 'dr_imagesAbsentes', 'pousser', 'dimensionner', 'paginer', 'p8Poser', 'dr_tabAncrer', 'journal', 'dr_sauve', 'dr_tout', 'brancherMenus', 'brancherAjout', 'temoin', 'alerteVideo', 'dr_suivreHauteurs', 'dr_derouleDe', 'dr_copieAuto', 'dr_etatAuto', 'dr_traceAuto', 'dr_sauveMaintenant'];
const profiler = pg => pg.evaluate(noms => { window.__PR = {}; noms.forEach(n => { const f = window[n]; if (typeof f !== 'function' || f.__pr) return; const g = function () { const t0 = performance.now(); try { return f.apply(this, arguments); } finally { const d = performance.now() - t0; const x = window.__PR[n] || (window.__PR[n] = [0, 0, null, null]); x[0] += d; x[1]++; const a = performance.timeOrigin + t0; if (x[2] == null) x[2] = a; x[3] = a + d; } }; g.__pr = true; try { window[n] = g; } catch (e) {} }); }, PROFIL);
const glisse = async (o, fen) => { if (process.env.MJPC_PROFIL) { await profiler(o.pg); if (fen) await profiler(fen); await o.pg.evaluate(() => { window.__PR = {}; }); if (fen) await fen.evaluate(() => { window.__PR = {}; }); }
  await o.pg.evaluate(() => { window.__KD = null; document.addEventListener('keydown', e => { if (e.key === 'ArrowRight' && window.__KD == null) window.__KD = performance.timeOrigin + e.timeStamp; }, { capture: true, once: true }); });
  await releve(fen, '#mur2'); await releve(o.pg, '#mur'); await o.pg.keyboard.press('ArrowRight'); await p(1700);
  const kd = await o.pg.evaluate(() => window.__KD); const lire = L => { const a = L[0][1], z = L[L.length - 1][1]; const prem = L.find(x => Math.abs(x[1] - a) > 0.01); const entre = L.filter(x => Math.min(a, z) + 1 < x[1] && x[1] < Math.max(a, z) - 1);
    const arr = L.find(x => Math.abs(x[1] - z) < 0.01); return { depart: Math.round(a * 10) / 10, arrivee: Math.round(z * 10) / 10, images: L.length, premier: prem ? Math.round(prem[0] - kd) : null, entre: entre.length, fin: arr ? Math.round(arr[0] - kd) : null, a90: (L.filter(x => x[0] - kd <= 90).pop() || [0, a])[1] }; };
  if (process.env.MJPC_PROFIL) { const r2 = x => Object.entries(x || {}).filter(([, v]) => v[0] >= 2).sort((a, b) => a[1][2] - b[1][2]).map(([k, v]) => k + ' ' + Math.round(v[0]) + ' ms ×' + v[1] + ' [' + Math.round(v[2] - kd) + '→' + Math.round(v[3] - kd) + ']').join(', '); dire('        profil pilote : ' + r2(await o.pg.evaluate(() => window.__PR))); if (fen) dire('        profil tableau : ' + r2(await fen.evaluate(() => window.__PR))); }
  return { t: lire(await fen.evaluate(() => window.__GL)), p: lire(await o.pg.evaluate(() => window.__GL)) }; };
const jouerD = async (fichier, fois) => { HUBN = storeFil(); ECR = []; const o = await ouvrir({ fichier, test: true }); await lancerClasse(o); const fen = await ouvrirTableau(o, 1536, 864);
  const L = await eidsDe(o.pg); const h1 = L.filter(e => e.heure === 1 || e.heure == null); const iT = L.findIndex(e => e.act === 'Les cinq tableaux');
  const ordre = await o.pg.evaluate(() => ordreHeure(S.heure)); const passages = [['l’étape 11 (2e → 3e diapo de l’heure : ' + L[ordre[1]].act + ' → ' + L[ordre[2]].act + ')', L[ordre[1]].eid], ['la diapo d’avant → le tableau des cinq œuvres (' + L[ordre[ordre.indexOf(iT) - 1]].act + ' → ' + L[iT].act + ')', L[ordre[ordre.indexOf(iT) - 1]].eid], ['le tableau → la diapo suivante, sans tableau (' + L[iT].act + ' → ' + L[ordre[ordre.indexOf(iT) + 1]].act + ')', L[iT].eid]];
  const out = []; for (const [nom, eid] of passages) { const r = []; for (let k = 0; k < fois; k++) { await allerA(o.pg, eid); await toutDevoiler(o.pg, eid); await p(1200); const s = await ici_(o.pg); if (s.eid !== eid) { k--; continue; } r.push(await glisse(o, fen)); } out.push({ nom, r }); }
  const errs = o.errs.concat(o.boites); await o.ctx.close(); return { out, errs }; };
const stat = a => { const v = a.filter(x => x != null).sort((x, y) => x - y); if (!v.length) return '—'; return 'min ' + v[0] + ' · médiane ' + v[Math.floor(v.length / 2)] + ' · max ' + v[v.length - 1] + ' ms (' + v.join(', ') + ')'; };
if (joue('D')) { const fois = +(process.env.MJPC_D_FOIS || 10); dire(''); dire('══ D · (⑯) 1536×864 · le temps entre la flèche et le premier mouvement du point, image par image, ' + fois + ' fois par passage ══');
  for (const [nomF, f] of [['ce fichier', FICHIER]].concat(AVANT ? [['l’assemblé d’avant', AVANT]] : [])) { const r = await jouerD(f, fois); dire('  ── ' + nomF + ' (md5 ' + md5(f) + ')');
    for (const x of r.out) { dire('    ' + x.nom + ' :'); dire('      au tableau — premier mouvement : ' + stat(x.r.map(y => y.t.premier)) + ' ; arrivée : ' + stat(x.r.map(y => y.t.fin)) + ' ; images entre départ et arrivée : ' + x.r.map(y => y.t.entre).join(', ') + ' ; à 90 ms : ' + x.r.map(y => Math.round((y.t.a90 - y.t.depart) * 10) / 10 + ' px').join(', ') + ' (de ' + (x.r[0] || { t: {} }).t.depart + ' à ' + (x.r[0] || { t: {} }).t.arrivee + ')');
      dire('      au pilote  — premier mouvement : ' + stat(x.r.map(y => y.p.premier)) + ' ; arrivée : ' + stat(x.r.map(y => y.p.fin))); }
    verif('D', r.out.every(x => x.r.length === fois && x.r.every(y => y.t.premier != null && y.t.entre >= 1)), nomF + ' · le point glisse à chaque passage (au moins une position entre le départ et l’arrivée, au tableau)'); sansErreur('D', r.errs, nomF); } }

/* ═══ F · (⑫) les éléments que le fil a poussés de la marge, mesurés par le geste ═══
   Les exemples (aucun des deux hubs ne porte de vidéo ni de légende de surligneurs : la NOTE dit d'où vient chacun) — dans l'heure 1 de la séance 1 du faux hub :
   « Tableau 3 » devient la vidéo du Radeau de la Méduse (celle du banc d'import d'E1, `E1/bancs/import-3e.mjs` : 3 min 05, deux repères) ; « Tableau 4 » la fiche
   « La compréhension de texte » du hub construit (MJPC_CONSTRUIT ; sans lui, la fiche « Le registre lyrique » du faux hub), ouverte en page (« Ouvrir la fiche ») ;
   « Les hypothèses de la classe » porte la légende des surligneurs de l'heure (jaune : ce qu'on voit, vert : ce que le peintre veut faire ressentir) ;
   « Tableau 5 » porte deux objets que le déroulé ne lit pas (un QCM et une dictée, deux applications du site : « QCM : les figures de style », « Dictée : « Le
   port » », le titre d'une feuille du chapitre) : les deux alertes de forme « Objet non lisible », l'une sous l'autre (une fiche sans texte ni lien ne donne pas
   d'alerte : le déroulé lui prête son titre — essayé) ;
   le document « Les cinq tableaux à analyser » (Drive, dans les documents de la séance 1 des deux hubs), projeté par « ⋯ → Documents de la séance… → Projeter au
   tableau ». Pour chaque élément : chaque boîte et chaque bout de texte qu'il contient, contre le bord droit de la diapo, la marge du fil (le bord droit du point)
   et chaque cadre qui le coupe (overflow). */
const ficheConstruit = () => { if (!CONSTRUIT) return null; try { const s3 = JSON.parse(fs.readFileSync(path.join(CONSTRUIT, 'site_3e.json'), 'utf8')); const c = Array.isArray(s3.chapitres) ? s3.chapitres[0] : Object.values(s3.chapitres)[0];
  const S0 = c.seances; const ks = Object.keys(S0).filter(k => S0[k]).sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); for (const k of ks) for (const e of ((S0[k].deroule || {}).ecrans || [])) for (const b of ((e || {}).blocs || [])) if (b && b.t === 'fiche') return JSON.parse(JSON.stringify(b)); } catch (e) {} return null; };
const storeF = () => store(null, (E, st) => { const par = t => E.find(e => e && e.act === t);
  const v = par('Tableau 3'); v.act = 'Le Radeau de la Méduse, filmé'; v.blocs = [{ t: 'video', txt: 'Le Radeau de la Méduse', fichier: 'radeau.mp4', duree: 185, reperes: [{ t: 0, l: 'l’ouverture' }, { t: 80, l: 'le monologue' }] }];
  let fi = ficheConstruit(); if (!fi) { const s2 = st.site['3e'].chapitres[0].seances; for (const k of Object.keys(s2)) for (const e of ((s2[k] && s2[k].deroule || {}).ecrans || [])) for (const b of ((e || {}).blocs || [])) if (!fi && b && b.t === 'fiche') fi = JSON.parse(JSON.stringify(b)); }
  const f4 = par('Tableau 4'); f4.act = 'La fiche de la séance'; f4.blocs = [{ t: 'consigne', el: ['Lis la fiche avec moi, puis recopie l’essentiel dans ton cahier.'] }, fi];
  const h = par('Les hypothèses de la classe'); h.legende = { jaune: 'ce qu’on voit dans le tableau', vert: 'ce que le peintre veut nous faire ressentir' };
  const f5 = par('Tableau 5'); f5.act = 'Le QCM des figures de style'; f5.blocs = [{ t: 'consigne', el: ['Fais le QCM sur ta tablette, puis on corrige ensemble.'] }, { t: 'qcm', txt: 'QCM : les figures de style' }, { t: 'dictee', txt: 'Dictée : « Le port »' }]; });
const bords = (pg, sel, cible) => pg ? pg.evaluate(({ sel, cible }) => { const m = sel === 'body' ? (document.querySelector('.mur.tableau') || document.querySelector('.mur') || document.body) : document.querySelector(sel); if (!m) return null; const M = m.getBoundingClientRect(); const fil = m.querySelector(':scope > .dr-fil');
  const F = fil ? Math.max(fil.getBoundingClientRect().right, fil.querySelector('i').getBoundingClientRect().right) : M.left; const FY = fil ? fil.getBoundingClientRect() : null;
  const vis = el => { for (let x = el; x && x !== m.parentElement; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return true; };
  const xs = Array.from(m.querySelectorAll(cible)).filter(x => x.getClientRects().length && vis(x)); if (!xs.length) return { n: 0, pb: [] };
  const clipDe = el => { let a = { left: M.left, right: M.right, top: M.top, bottom: M.bottom }; for (let x = el.parentElement; x && x !== m; x = x.parentElement) { const s = getComputedStyle(x); if (s.overflowX !== 'visible' || s.overflowY !== 'visible') { const b = x.getBoundingClientRect(); a = { left: Math.max(a.left, b.left), right: Math.min(a.right, b.right), top: Math.max(a.top, b.top), bottom: Math.min(a.bottom, b.bottom) }; } } return a; };
  const pb = []; let n = 0; const q = v => Math.round(v * 10) / 10;
  const tester = (r, el, quoi) => { if (!r.width || !r.height) return; n++; const c = clipDe(el);
    if (r.right > M.right + 1) pb.push(quoi + ' : déborde à droite de ' + q(r.right - M.right) + ' px');
    if (fil && r.left < F - 0.5 && r.bottom > FY.top && r.top < FY.bottom) pb.push(quoi + ' : sous le fil (' + q(F - r.left) + ' px)');
    if (r.right > c.right + 1 || r.left < c.left - 1 || r.bottom > c.bottom + 1 || r.top < c.top - 1) pb.push(quoi + ' : coupé (' + [q(c.left - r.left), q(r.right - c.right), q(c.top - r.top), q(r.bottom - c.bottom)].map(v => Math.max(0, v)).join('/') + ' px g/d/h/b)'); };
  const boites = [];
  xs.forEach(x => { const fond = x.matches('.doc'); const R0 = x.getBoundingClientRect(); boites.push([q(R0.left - M.left), q(R0.right - M.left), q(R0.top - M.top), q(R0.bottom - M.top)]); if (!fond) tester(R0, x, x.className.split(' ')[0]);
    x.querySelectorAll('*').forEach(el => { if (!vis(el) || !el.getClientRects().length) return; const s = getComputedStyle(el); const fondEl = !/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor) || ['Top', 'Right', 'Bottom', 'Left'].some(c => parseFloat(s['border' + c + 'Width']) > 0); if (fondEl || /^(IMG|SVG|VIDEO|IFRAME|CANVAS|BUTTON)$/i.test(el.tagName)) tester(el.getBoundingClientRect(), el, el.tagName.toLowerCase() + '.' + String(el.className && el.className.baseVal != null ? el.className.baseVal : el.className).split(' ')[0]); if (s.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1) pb.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + ' : son contenu dépasse sa boîte de ' + (el.scrollWidth - el.clientWidth) + ' px'); });
    const tw = document.createTreeWalker(x, NodeFilter.SHOW_TEXT); let t; while ((t = tw.nextNode())) { if (!t.nodeValue.trim() || !vis(t.parentElement)) continue; const rg = document.createRange(); rg.selectNodeContents(t); Array.from(rg.getClientRects()).forEach(r => tester(r, t.parentElement, 'le texte « ' + t.nodeValue.trim().slice(0, 28) + ' »')); } });
  return { n, pb: Array.from(new Set(pb)).slice(0, 8), boites, fil: q(F - M.left), W: q(M.width) }; }, { sel, cible }).catch(e => ({ n: 0, pb: ['mesure impossible : ' + String(e.message).slice(0, 80)] })) : null;
const ELEMENTS = [['la vidéo', '.video', 'Le Radeau de la Méduse, filmé'], ['la fiche ouverte en page', '.f-tab', 'La fiche de la séance'], ['la légende des surligneurs', '.legsur', 'Les hypothèses de la classe'], ['les alertes de forme', '.alertes-diapo', 'Le QCM des figures de style'], ['le document', '.doc', 'Les hypothèses de la classe']];
const projeterDoc = async (pg, titre) => { await pg.click('#bplus').catch(() => {}); await p(400); await pg.evaluate(() => { const b = document.querySelector('#menuplus [data-a="docs"]'); if (b) b.click(); }); await p(800);
  const ok = await pg.evaluate(t => { const b = Array.from(document.querySelectorAll('#fdocs-l [data-doc]')).find(x => (x.closest('.dr-c') || x.parentElement).textContent.indexOf(t) >= 0); if (!b) return false; b.click(); return true; }, titre); await p(1500);
  await pg.evaluate(() => { const x = document.getElementById('fdocs-x'); if (x) x.click(); }); await p(300); return ok; };
const jouerF = async (fichier, Wp, Hp, Wt, Ht, nom) => { HUBN = storeF(); ECR = []; const out = {}; const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: Wt, H: Ht, prof: false }); await p(1200);
  const o = await ouvrir({ fichier, W: Wp, H: Hp, test: true }); await lancerClasse(o); const fen = await ouvrirTableau(o, Wt, Ht); const L = await eidsDe(o.pg);
  for (const [quoi, cible, act] of ELEMENTS.filter(e => e[1] !== '.video')) { const x = L.find(e => e.act === act); if (!x) { out[quoi] = { absent: true }; continue; } const al = await allerA(o.pg, x.eid); if (process.env.MJPC_DIAG) dire('      diag ' + quoi + ' allerA ' + al + ' ' + JSON.stringify(await ici_(o.pg))); await toutDevoiler(o.pg, x.eid); if (process.env.MJPC_DIAG) dire('      diag ' + quoi + ' dévoilé ' + JSON.stringify(await ici_(o.pg)));
    if (cible === '.f-tab') { await o.pg.evaluate(() => { const b = document.querySelector('#mur .dr-fiche-ouvrir'); if (b) b.click(); }); await p(1500); }
    if (cible === '.doc') out[quoi + ' (projeté)'] = await projeterDoc(o.pg, 'Les cinq tableaux');
    await p(900); out[quoi] = { a: await bords(o.pg, '#mur', cible), b: await bords(fen, '#mur2', cible), c: await bords(T.pg, 'body', cible) };
    const base = 'F-' + nom + '-' + Wp + 'x' + Hp + '-tableau-' + Wt + 'x' + Ht + '-' + cible.replace(/\W/g, ''); await capt(o.pg, base + '-pilote'); if (fen) await capt(fen, base + '-tableau'); await capt(T.pg, base + '-distant');
    if (cible === '.f-tab') { await o.pg.evaluate(() => { const b = document.querySelector('#mur .dr-fiche-fermer'); if (b) b.click(); }); await p(900); }
    if (cible === '.doc') { await o.pg.evaluate(() => { const b = document.querySelector('#mur [data-docx]'); if (b) b.click(); }); await p(900); } }
  const errs = o.errs.concat(o.boites, T.errs, T.boites); await o.ctx.close(); await T.ctx.close();
  /* l'Atelier (à la taille du pilote) : la vidéo, la légende, les alertes (la fiche ne s'ouvre pas en page dans l'Atelier, le document ne s'y projette pas) */
  const o2 = await ouvrir({ fichier, W: Wp, H: Hp }); await ouvrirAtelier(o2); const l2 = await lignesX(o2.pg);
  for (const [quoi, cible, act] of ELEMENTS.filter(e => !/f-tab|\.doc/.test(e[1]))) { const y = l2.find(e => e.t.indexOf(act) >= 0); out[quoi] = out[quoi] || {}; if (!y) { out[quoi].at = null; continue; } await (await o2.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(1100); out[quoi].at = await bords(o2.pg, '#mur', cible); await capt(o2.pg, 'F-' + nom + '-' + Wp + 'x' + Hp + '-atelier-' + cible.replace(/\W/g, '')); }
  errs.push(...o2.errs, ...o2.boites); await o2.ctx.close();
  /* la vidéo : en classe, sans la clé USB sur l'appareil qui projette, elle est passée d'elle-même au bout de 1,5 s (« le passage automatique du cadrage »,
     alerteVideo) — elle se mesure donc en répétition (« Jouer en avance — répétition » depuis l'Atelier : la même diapo, au pilote et à la fenêtre du tableau) */
  { const T2 = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: Wt, H: Ht, prof: false }); await p(1000); const o3 = await ouvrir({ fichier, W: Wp, H: Hp }); await ouvrirAtelier(o3); const l3 = await lignesX(o3.pg); const y = l3.find(e => e.t.indexOf('Le Radeau de la Méduse, filmé') >= 0);
    if (y) { await (await o3.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(900); await o3.pg.click('#at-jouer').catch(() => {}); await p(2500); const fen3 = await ouvrirTableau(o3, Wt, Ht); await o3.pg.click('#numero').catch(() => {}); await p(1200);
      const ici3 = await ici_(o3.pg); out['la vidéo'] = Object.assign(out['la vidéo'] || {}, { a: await bords(o3.pg, '#mur', '.video'), b: await bords(fen3, '#mur2', '.video'), sur: ici3.numero + ' · ' + ici3.compte });
      const base = 'F-' + nom + '-' + Wp + 'x' + Hp + '-tableau-' + Wt + 'x' + Ht + '-video-repetition'; await capt(o3.pg, base + '-pilote'); if (fen3) await capt(fen3, base + '-tableau'); }
    errs.push(...o3.errs, ...o3.boites, ...T2.errs, ...T2.boites); await o3.ctx.close(); await T2.ctx.close(); }
  return { out, errs }; };
const resumeF = x => x ? (x.n ? x.n + ' boîtes' + (x.pb.length ? ', ' + x.pb.length + ' défaut(s) : ' + x.pb.join(' ; ') : ', 0 défaut') : 'absent') : '—';
if (joue('F')) { dire(''); dire('══ F · (⑫) la vidéo, le document, la fiche ouverte en page, la légende des surligneurs, les alertes de forme : rien ne déborde, rien sous le fil, rien de coupé ══');
  const ANC = process.env.MJPC_ANCIENNE && fs.existsSync(process.env.MJPC_ANCIENNE) ? path.resolve(process.env.MJPC_ANCIENNE) : null; const comparer = !!ANC;
  const CONF = [[1366, 768, 1366, 768], [1536, 864, 1536, 864], [1920, 1080, 1920, 1080], [1366, 768, 1280, 720]].filter(c => !process.env.MJPC_F_CONF || process.env.MJPC_F_CONF.split(',').includes(c.join('x')));
  for (const [fNom, f] of [['ce fichier', FICHIER]].concat(comparer && ANC ? [['la 8.77.1-⑩', ANC]] : [])) { const k = f === FICHIER ? 'F' : 'F-avant';
    for (const [Wp, Hp, Wt, Ht] of CONF) { const T = 'pilote ' + Wp + '×' + Hp + ' · tableau ' + Wt + '×' + Ht; const r = await jouerF(f, Wp, Hp, Wt, Ht, f === FICHIER ? 'apres' : 'avant');
      for (const [quoi, cible] of ELEMENTS) { const x = r.out[quoi] || {}; const vues = (cible === '.video' ? [['au pilote (en répétition)', x.a], ['à la fenêtre du tableau (en répétition)', x.b]] : [['au pilote', x.a], ['à la fenêtre du tableau', x.b], ['au tableau distant', x.c]]).concat(x.at !== undefined ? [['dans l’Atelier', x.at]] : []);
        const attendus = vues.filter(([v]) => !(cible === '.alertes-diapo' && /tableau/.test(v)));   /* les alertes de forme ne se montrent qu'au pilote et dans l'Atelier */
        verif(k, attendus.every(([, y]) => y && y.n > 0 && !y.pb.length) && (cible !== '.doc' || r.out[quoi + ' (projeté)']), fNom + ' · ' + T + ' · ' + quoi + ' : ' + attendus.map(([v, y]) => v + ' ' + resumeF(y)).join(' │ '), attendus.map(([v, y]) => v + ' ' + JSON.stringify(y && y.boites) + ' fil ' + (y && y.fil))); }
      sansErreur(k, r.errs, fNom + ' · ' + T); } } }

/* ═══ H · (⑬) l'image pleine au tableau en 1280 × 720, et le chapitre de 4e du hub construit ═══ */
const imgMesure = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; const M = m.getBoundingClientRect(); const fil = m.querySelector('.dr-fil'); const F = fil ? Math.max(fil.getBoundingClientRect().right, fil.querySelector('i').getBoundingClientRect().right) : null;
  return Array.from(m.querySelectorAll('.img-sup')).filter(x => x.getClientRects().length).map(x => { const q = v => Math.round(v * 10) / 10; const im = x.querySelector(':scope > img'); let r = (im || x).getBoundingClientRect();
    if (im && im.naturalWidth && /contain|scale-down/.test(getComputedStyle(im).objectFit)) { const B = im.getBoundingClientRect(); const k = Math.min(B.width / im.naturalWidth, B.height / im.naturalHeight); const w = im.naturalWidth * k, h = im.naturalHeight * k; r = { left: B.left + (B.width - w) / 2, right: B.left + (B.width + w) / 2, top: B.top + (B.height - h) / 2, bottom: B.top + (B.height + h) / 2, width: w, height: h }; }
    const lg = x.parentElement && x.parentElement.querySelector('.img-lg'); const L = lg ? lg.getBoundingClientRect() : null;
    return { W: q(M.width), g: q(r.left - M.left), d: q(r.right - M.left), h: q(r.top - M.top), b: q(r.bottom - M.top), coupe: q(Math.max(0, r.right - M.right) + Math.max(0, M.left - r.left) + Math.max(0, r.bottom - M.bottom) + Math.max(0, M.top - r.top)), sousFil: F != null ? r.left < F - 0.5 : false, lgCoupe: L ? q(Math.max(0, L.right - M.right)) : 0,
      mk: Array.from(x.querySelectorAll('.mk')).map(k => { const R = k.getBoundingClientRect(); return [q(((R.left + R.width / 2) - r.left) / r.width * 100), q(((R.top + R.height / 2) - r.top) / r.height * 100)]; }) }; }); }, sel).catch(() => null) : null;
const jouerH = async (fichier, Wp, Hp, Wt, Ht, nom) => { HUBN = storeOuverture(RACINE, { champs: true }); ECR = []; const out = []; const T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: Wt, H: Ht, prof: false }); await p(1200);
  const o = await ouvrir({ fichier, W: Wp, H: Hp, test: true }); await lancerClasse(o); const fen = await ouvrirTableau(o, Wt, Ht);
  const L = (await eidsDe(o.pg)).filter(y => y.types.includes('image'));
  for (const x of L) { await allerA(o.pg, x.eid); await toutDevoiler(o.pg, x.eid);
    for (const q of [[o.pg, '#mur'], [fen, '#mur2'], [T.pg, 'body']]) if (q[0]) await q[0].waitForFunction(sel => { const m = document.querySelector(sel); const l = m ? Array.from(m.querySelectorAll('.img-sup > img')) : []; return l.length > 0 && l.every(i => i.complete && i.naturalWidth > 0); }, q[1], { timeout: 8000 }).catch(() => {}); await p(600);
    out.push({ act: x.act, a: await imgMesure(o.pg, '#mur'), b: await imgMesure(fen, '#mur2'), c: await imgMesure(T.pg, 'body') }); const base = 'H-' + nom + '-tableau-' + Wt + 'x' + Ht + '-' + x.act.replace(/\W+/g, ''); if (fen) await capt(fen, base + '-tableau'); await capt(T.pg, base + '-distant'); await capt(o.pg, base + '-pilote'); }
  const errs = o.errs.concat(o.boites, T.errs, T.boites); await o.ctx.close(); await T.ctx.close(); return { out, errs }; };
if (joue('H')) { dire(''); dire('══ H · (⑬) l’image pleine au tableau en 1280 × 720 (les cinq images de l’heure 1) ; le chapitre de 4e du hub construit (Le Horla) ══');
  if (!process.env.MJPC_H_HORLA_SEUL) { const r = await jouerH(FICHIER, 1366, 768, 1280, 720, 'apres'); const a = AVANT ? await jouerH(AVANT, 1366, 768, 1280, 720, 'avant') : null;
  const ligne = x => x.act + ' : tableau ' + JSON.stringify((x.b || []).map(i => [i.g, i.d, i.coupe])) + ' · distant ' + JSON.stringify((x.c || []).map(i => [i.g, i.d, i.coupe])) + ' · pilote ' + JSON.stringify((x.a || []).map(i => [i.g, i.d, i.coupe]));
  if (a) dire('      H · avant (l’assemblé d’avant) : ' + a.out.map(ligne).join(' ; ')); dire('      H · après : ' + r.out.map(ligne).join(' ; '));
  const tous = [].concat(...r.out.map(x => [].concat(x.a || [], x.b || [], x.c || [])));
  verif('H', r.out.length >= 5 && r.out.every(x => (x.b || []).length && (x.c || []).length && (x.a || []).length) && tous.every(i => i.coupe <= 1 && !i.sousFil && i.lgCoupe <= 1), 'tableau 1280×720 (pilote 1366×768) · les ' + r.out.length + ' images pleines : aucune coupée, aucune sous le fil (l’étiquette non plus) — à la fenêtre du tableau, au tableau distant, au pilote', r.out.map(ligne));
  if (a) { const cAv = a.out.map(x => x.act + ' ' + JSON.stringify((x.b || []).map(i => i.coupe))); const memes = r.out.every((x, k) => { const y = a.out[k]; if (!y) return false; return ['a', 'b', 'c'].every(u => (x[u] || []).every((i, n) => { const j = (y[u] || [])[n]; if (!j) return false; const tailleOk = j.coupe ? true : Math.abs((i.d - i.g) / i.W - (j.d - j.g) / j.W) * Math.max(i.W, j.W) <= 1.5;   /* la taille dans la diapo (au pilote, la diapo d'avant n'avait pas toujours sa taille : le titre mesuré trop tôt, ⑮) */ return tailleOk && JSON.stringify(i.mk) === JSON.stringify(j.mk); })); });
    verif('H', memes, 'tableau 1280×720 · une image qui tenait garde sa taille ; les repères restent sur les mêmes points de l’image (avant / après)', { avantCoupees: cAv }); }
  sansErreur('H', r.errs, 'tableau 1280×720'); }
  /* le chapitre de 4e du hub construit : chaque diapo de chaque séance, dans l'Atelier (la colonne, un clic par ligne) — les images pleines qu'il porte */
  if (CONSTRUIT) { HUBN = storeConstruit(); ECR = []; const o = await ouvrir({ q: '?n=4e', W: 1536, H: 864 }); await ouvrirAtelier(o);
    const seances = await o.pg.evaluate(() => Array.from(document.querySelectorAll('.ed2-sce[data-seance]')).map(d => d.dataset.seance)); let vues = 0, imgs = 0, blocsImg = 0; const titre = await o.pg.evaluate(() => { try { return dr_chapitreTitre(); } catch (e) { return ''; } });
    for (const k of (seances.length ? seances : [null])) { if (k != null) { await o.pg.evaluate(c => { const d = document.querySelector('.ed2-sce[data-seance="' + c + '"]'); if (d) { d.scrollIntoView({ block: 'center' }); d.click(); } }, k); await p(1500); }
      const L2 = await lignesX(o.pg); for (const l of L2) { const t = await o.pg.$('#volet [data-eid="' + l.eid + '"] .t'); if (!t) continue; await t.scrollIntoViewIfNeeded().catch(() => {}); if (!(await t.click({ timeout: 2000 }).then(() => true).catch(() => false))) continue; await p(250); vues++; const n = await o.pg.evaluate(() => ({ i: document.querySelectorAll('#mur .img-sup').length, b: (seance().ecrans[S.di].blocs || []).filter(b => b && b.t === 'image').length })); imgs += n.i; blocsImg += n.b; } }
    const total0 = await o.pg.evaluate(() => { try { const E = [].concat(...dr_seances().map(s => (s && s.ecrans) || [])); return { n: E.length, img: E.reduce((t, e) => t + ((e && e.blocs) || []).filter(b => b && b.t === 'image').length, 0) }; } catch (e) { return { n: null, img: null }; } }); const total = total0.n + ' (dont ' + total0.img + ' bloc(s) image en tout)';
    await capt(o.pg, 'H-horla-atelier'); dire('      H · le chapitre de 4e du hub construit (« ' + String(titre).slice(0, 60) + ' ») : ' + seances.length + ' séances, ' + vues + ' diapos ouvertes une à une dans l’Atelier (sur ' + total + ' que portent ses séances) : ' + imgs + ' image(s) pleine(s) montrée(s), ' + blocsImg + ' bloc(s) image');
    verif('H', vues > 20 && total0.img === 0 === (imgs === 0) && !o.errs.length && !o.boites.length, 'le chapitre de 4e (Le Horla) : ' + vues + ' diapos ouvertes une à une, ' + imgs + ' image pleine (' + (imgs ? 'mesurées ci-dessus' : 'il n’en porte aucune : rien à couper') + ') ; aucune erreur JS', o.errs.concat(o.boites).join(' ; '));
    await o.ctx.close(); } else dire('      H · le hub construit n’est pas donné (MJPC_CONSTRUIT) : le chapitre de 4e n’est pas joué'); }

/* ═══ L · (⑭) une rangée de tableau seule plus haute qu'une page ═══ */
const ALBATROS = 'Le poème | Ce que j’y repère\n'   /* « L'Albatros » (Baudelaire, 1861), en entier dans une case : la citation longue ; la séance 2 du chapitre de 3e lit ce poème */
  + 'Souvent, pour s’amuser, les hommes d’équipage / Prennent des albatros, vastes oiseaux des mers, / Qui suivent, indolents compagnons de voyage, / Le navire glissant sur les gouffres amers. // À peine les ont-ils déposés sur les planches, / Que ces rois de l’azur, maladroits et honteux, / Laissent piteusement leurs grandes ailes blanches / Comme des avirons traîner à côté d’eux. // Ce voyageur ailé, comme il est gauche et veule ! / Lui, naguère si beau, qu’il est comique et laid ! / L’un agace son bec avec un brûle-gueule, / L’autre mime, en boitant, l’infirme qui volait ! // Le Poète est semblable au prince des nuées / Qui hante la tempête et se rit de l’archer ; / Exilé sur le sol au milieu des huées, / Ses ailes de géant l’empêchent de marcher. | la comparaison filée : l’albatros, c’est le poète\n'
  + 'Les hommes d’équipage | la foule qui se moque du poète';
const STROPHE = 'Strophe | Le texte | Ce que j’y repère\n'   /* une strophe entière dans une case (la strophe 1, puis la 4) */
  + '1 | Souvent, pour s’amuser, les hommes d’équipage / Prennent des albatros, vastes oiseaux des mers, / Qui suivent, indolents compagnons de voyage, / Le navire glissant sur les gouffres amers. | les hommes capturent l’oiseau pour s’amuser\n'
  + '4 | Le Poète est semblable au prince des nuées / Qui hante la tempête et se rit de l’archer ; / Exilé sur le sol au milieu des huées, / Ses ailes de géant l’empêchent de marcher. | la comparaison : le poète est comme l’albatros';
const haute = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; const t = m.querySelector('table.p8-grille'); if (!t) return null; const z = t.closest('.p8-dessin'); const M = m.getBoundingClientRect(), Z = z.getBoundingClientRect(); const q = v => Math.round(v * 10) / 10;
  let clip = { top: Math.max(Z.top, M.top), bottom: Math.min(Z.bottom, M.bottom) }; for (let x = z; x && x !== m; x = x.parentElement) { const s = getComputedStyle(x); if (s.overflowY !== 'visible') { const b = x.getBoundingClientRect(); clip = { top: Math.max(clip.top, b.top), bottom: Math.min(clip.bottom, b.bottom) }; } } clip.bottom = Math.min(clip.bottom, M.bottom);
  const rs = Array.from(t.querySelectorAll('tr[data-pg]')).filter(r => r.getClientRects().length && getComputedStyle(r).display !== 'none'); const out = rs.map(r => { const R = r.getBoundingClientRect(); let lignes = 0, cachees = 0;
    r.querySelectorAll('td').forEach(td => { const rg = document.createRange(); rg.selectNodeContents(td); const L = Array.from(new Set(Array.from(rg.getClientRects()).map(x => Math.round(x.top) + ':' + Math.round(x.bottom)))).map(s => s.split(':').map(Number)); const tops = Array.from(new Set(L.map(x => x[0]))); lignes = Math.max(lignes, tops.length); cachees = Math.max(cachees, Array.from(new Set(L.filter(x => x[1] > clip.bottom + 1).map(x => x[0]))).length); });
    return { rang: +r.dataset.pg, haut: q(R.height), coupe: q(Math.max(0, R.bottom - clip.bottom)), lignes, cachees }; });
  return { page: ((m.querySelector('.mur .page') || m.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), dessin: q(clip.bottom - clip.top), ancre: t.classList.contains('p8-ancre'), hautDuTableau: q(t.getBoundingClientRect().top - Z.top), rangees: out, fs: getComputedStyle(t.querySelector('td')).fontSize, murH: q(M.height) }; }, sel).catch(() => null) : null;
const jouerL = async (src, W, H, nom) => { HUBN = store(src); ECR = []; const R = { pages: [] }; const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W, H, prof: false }); await p(1200);
  const o = await ouvrir({ W, H }); await lancerClasse(o); const fen = await ouvrirTableau(o, W, H); const v = await o.pg.$('#volet .vig:has(table.p8-grille)'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); if (await o.pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) { await o.pg.click('#garde-devant'); await p(900); } } await o.pg.click('#numero').catch(() => {}); await p(1200);
  for (let k = 0; k < 6; k++) { const a = await haute(o.pg, '#mur'), b = await haute(fen, '#mur2'), c = await haute(T.pg, 'body'); R.pages.push({ a, b, c }); const base = 'L-' + nom + '-' + W + 'x' + H + '-page' + (k + 1); await capt(o.pg, base + '-pilote'); if (fen) await capt(fen, base + '-tableau'); await capt(T.pg, base + '-distant');
    const m = /page (\d+) \/ (\d+)/.exec((a || {}).page || ''); if (!m || +m[1] >= +m[2]) break; await o.pg.keyboard.press('Shift+ArrowRight'); await p(1500); }
  R.errs = o.errs.concat(o.boites, T.errs, T.boites); await o.ctx.close(); await T.ctx.close();
  /* l'Atelier : la diapo, et « À régler » */
  const o2 = await ouvrir({ W, H }); await ouvrirAtelier(o2); const l2 = await lignesX(o2.pg); const y = l2.find(e => /Les cinq tableaux/.test(e.t)); if (y) { await (await o2.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(1500); }
  R.atelier = await haute(o2.pg, '#mur'); await capt(o2.pg, 'L-' + nom + '-' + W + 'x' + H + '-atelier'); await o2.pg.click('#at-regler').catch(() => {}); await p(1500);
  R.regler = await o2.pg.evaluate(() => { const L = Array.from(document.querySelectorAll('body *')).filter(x => x.offsetParent !== null && /hors du cadre visible/.test(x.textContent || '') && !Array.from(x.children).some(c => /hors du cadre visible/.test(c.textContent || ''))); return L.map(x => (x.closest('[class]') ? '' : '') + (x.parentElement ? (x.parentElement.innerText || '') : x.innerText || '').replace(/\s+/g, ' ').slice(0, 400)); }); await capt(o2.pg, 'L-' + nom + '-' + W + 'x' + H + '-atelier-a-regler');
  R.errs.push(...o2.errs, ...o2.boites); await o2.ctx.close(); return R; };
if (joue('L')) { dire(''); dire('══ L · (⑭) une rangée de tableau seule plus haute qu’une page (la citation longue : « L’Albatros » en entier dans une case ; la strophe entière) — mesurée, le comportement inchangé ══');
  for (const [W, H] of TAILLES) { const T = W + '×' + H;
    for (const [nom, src] of [['albatros', ALBATROS], ['strophe', STROPHE]]) { const R = await jouerL(src, W, H, nom); const P = R.pages;
      const txt = (g, v) => g ? v + ' ' + g.page + ' : ' + g.rangees.map(r => 'rangée ' + r.rang + ' ' + r.haut + ' px pour un dessin de ' + g.dessin + ' px, ' + r.lignes + ' lignes' + (r.coupe ? ', coupée de ' + r.coupe + ' px (' + r.cachees + ' ligne(s) sous le bord)' : ', entière')).join(' ; ') + (g.ancre ? ' · ancrée en haut' : '') : v + ' —';
      P.forEach(x => { dire('      L · ' + T + ' · ' + nom + ' · ' + [txt(x.a, 'pilote'), txt(x.b, 'tableau'), txt(x.c, 'distant')].join(' │ ')); });
      dire('      L · ' + T + ' · ' + nom + ' · Atelier : ' + txt(R.atelier, 'la diapo') + ' │ « À régler » : ' + (R.regler.length ? R.regler.join(' ‖ ') : 'rien sur « hors du cadre »'));
      const trop = P.filter(x => x.a && x.a.rangees.some(r => r.coupe > 0));
      verif('L', P.every(x => x.a && x.a.rangees.every(r => r.coupe <= 0 || (x.a.rangees.length === 1 && x.a.ancre))) && P.every(x => !x.b || x.b.rangees.every(r => r.coupe <= 0 || (x.b.rangees.length === 1 && x.b.ancre))), T + ' · ' + nom + ' : une rangée plus haute que la page est seule sur sa page, ancrée en haut (le comportement tranché aux quatre dettes) — ' + (trop.length ? trop.length + ' page(s) ainsi' : 'aucune rangée plus haute que la page'), P.map(x => x.a && [x.a.page, x.a.rangees.map(r => r.rang + ':' + r.haut + '/' + x.a.dessin)]));
      verif('L', !R.errs.length, T + ' · ' + nom + ' : aucune erreur JS, aucune boîte système', R.errs.join(' ; ')); } } }

/* ═══ V · (⑰, §3.6) le témoin « déroulé intègre » dit vrai : au faux hub ordinaire et au faux hub rangé comme le vrai, « ● déroulé intègre » quand rien n'est
   perdu ; l'écriture de la copie de la classe refusée par le hub (401, dès le lancement) : « ● déroulé à vérifier ». Hors mode test (la copie part au hub),
   1536 × 864, l'heure 1 de la séance 1 : ▶ jusqu'à la première activité, deux lignes dévoilées. (Ce que la classe écrit dans une diapo va à l'état de l'heure,
   pas à la copie : mesuré, aucune nouvelle écriture de la copie ; la copie repart quand la séance elle-même change.) Avec MJPC_FIREBASE=<dossier où firebase@8.10.1 est installé> : la copie que la nouvelle version a écrite, passée par le code de
   Firebase lui-même (hors réseau : `set` puis `once('value')`), relue, et les deux empreintes comparées (l'ancienne façon, la nouvelle). ═══ */
const temoin = pg => pg.evaluate(() => { const t = document.getElementById('dr-integre'); return t ? { texte: t.textContent.trim(), titre: (t.title || '').slice(0, 160) } : null; });
const jouerV = async (fichier, vrai, refus) => { VRAI = vrai; REFUS = refus ? /\/deroule_joue\/[^/]+\/ecrans$/ : null; HUBN = vrai ? (ranger(store()) || {}) : store(); ECR = []; const o = await ouvrir({ fichier });
  const l1 = await lancerClasse(o); await o.pg.click('#numero'); await p(300); const R0 = ['presentation-chapitre', 'competences-chapitre', 'plan', 'presentation-seance', 'problematique', 'competences-bilan']; let n = 0;
  while (n++ < 60) { const s2 = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s2.eid) || {}).role; if (!R0.includes(role)) break; await o.pg.keyboard.press('ArrowRight'); await p(350); }
  await o.pg.keyboard.press('ArrowRight'); await p(500); await o.pg.keyboard.press('ArrowRight'); await p(6000); const t1 = await temoin(o.pg); await capt(o.pg, 'V-' + (vrai ? 'vrai' : 'ordinaire') + (refus ? '-refus' : '') + '-temoin');
  const L0 = ECR.filter(x => /\/deroule_joue\/[^/]+\/ecrans$/.test(x.c)); const nE = L0.length, nR = L0.filter(x => x.refus).length; const ecrit = (L0.filter(x => !x.refus).pop() || {}).bd || null;
  const errs = o.errs.concat(o.boites); await o.ctx.close(); VRAI = false; REFUS = null; return { l1, t1, nE, nR, ecrit, errs }; };
if (joue('V')) { dire(''); dire('══ V · (⑰) 1536×864 · hors mode test · le témoin « déroulé intègre » au faux hub ordinaire, au faux hub rangé comme le vrai, et une écriture refusée ══');
  let copie = null;
  for (const vrai of (process.env.MJPC_V_HUBS === 'ordinaire' ? [false] : [false, true])) { const nomH = vrai ? 'le faux hub rangé comme le vrai' : 'le faux hub ordinaire';
    const r = await jouerV(FICHIER, vrai, false); if (vrai) copie = r.ecrit;
    verif('V', r.l1 && r.nE >= 1 && !r.nR && r.t1 && r.t1.texte === '● déroulé intègre', nomH + ' : l’heure lancée, ▶ jusqu’à la première activité, deux lignes dévoilées, rien de perdu (' + r.nE + ' écriture(s) de la copie, acceptée(s)) — le témoin : « ' + (r.t1 && r.t1.texte) + ' »', r.t1);
    sansErreur('V', r.errs, nomH);
    const q = await jouerV(FICHIER, vrai, true);
    verif('V', q.l1 && q.nR >= 1 && q.t1 && q.t1.texte === '● déroulé à vérifier', nomH + ' : le hub refuse l’écriture de la copie de la classe (' + q.nR + ' refus, 401) — le témoin : « ' + (q.t1 && q.t1.texte) + ' »', q.t1);
    sansErreur('V', q.errs, nomH + ', l’écriture refusée'); }
  const FB = process.env.MJPC_FIREBASE && fs.existsSync(path.join(process.env.MJPC_FIREBASE, 'node_modules', 'firebase')) ? process.env.MJPC_FIREBASE : null;
  if (FB && copie) { const rq = createRequire(path.join(FB, 'x.js')); const firebase = rq('firebase/app'); rq('firebase/database');
    const app = firebase.initializeApp({ databaseURL: 'https://sonde-c16-hors-reseau.firebaseio.com', apiKey: 'hors-reseau', projectId: 'sonde-c16' }, 'sonde-c16'); const db = app.database(); db.goOffline();
    const ref = db.ref('site/3e/chapitres/0/seances/0/deroule_joue/sonde/ecrans'); ref.set(copie).catch(() => {}); const relu = await new Promise(res => ref.once('value', s => res(s.val())));
    /* les deux façons de faire l'empreinte, prises telles quelles dans le fichier sondé (dr-classe.js) */
    const src = fs.readFileSync(FICHIER, 'utf8'); const pris = n => { const i = src.indexOf('\nfunction ' + n + '('); if (i < 0) return ''; const j = src.indexOf('\nfunction ', i + 1); return src.slice(i, j < 0 ? i + 4000 : j); };
    const code = ['dr_empreinte', 'dr_commeLeHub', 'dr_empreinteHub'].map(pris); const ok3 = code.every(Boolean);
    const F = ok3 ? new Function(code.join('\n') + '\n; return { dr_empreinte, dr_commeLeHub: typeof dr_commeLeHub === "function" ? dr_commeLeHub : null, dr_empreinteHub };')() : null;
    const ordre = JSON.stringify(Object.keys(copie[0] || {})) + ' → ' + JSON.stringify(Object.keys((relu || [])[0] || relu && relu['0'] || {}));
    const nCles = (copie || []).filter((e, i) => e && relu && (relu[i] || relu[String(i)]) && JSON.stringify(Object.keys(e)) !== JSON.stringify(Object.keys(relu[i] || relu[String(i)]))).length;
    dire('      V · le code de Firebase 8.10.1 (hors réseau) : la copie écrite (' + (copie || []).length + ' diapos) relue — l’ordre des clés de la 1re diapo ' + ordre + ' ; ' + nCles + ' diapo(s) dont les clés reviennent dans un autre ordre');
    verif('V', F && F.dr_empreinte(copie) !== F.dr_empreinte(relu) && F.dr_empreinteHub(copie) === F.dr_empreinteHub(relu), 'le code de Firebase 8.10.1 : l’ancienne empreinte de la copie écrite et de la copie relue diffèrent (' + (F && F.dr_empreinte(copie)) + ' / ' + (F && F.dr_empreinte(relu)) + ') ; rangées comme le hub, elles sont égales (' + (F && F.dr_empreinteHub(copie)) + ' / ' + (F && F.dr_empreinteHub(relu)) + ')', ok3 ? '' : 'fonctions introuvables dans le fichier sondé');
    try { await app.delete(); } catch (e) {} }
  else if (!FB) dire('      V · MJPC_FIREBASE n’est pas donné : le passage par le code de Firebase n’est pas joué'); }

/* ═══ J · (⑱, §3.7) en jeu, la molette et les flèches de la colonne ne changent ni de diapo ni de page ═══
   Le tableau des cinq œuvres avec « Ce que j'en retiens » (3 pages) dans l'heure 1 : la diapo de départ, à sa page 1. En classe (mode test, puis une vraie heure
   au faux hub), la fenêtre du tableau et le tableau distant ouverts ; en répétition, la fenêtre du tableau : dix crans de molette sur la vue centrale (un toutes
   les 300 ms), puis un clic dans la colonne (son en-tête) et dix flèches (↓ cinq fois, ↑ cinq fois) — la diapo et la page au pilote, à la fenêtre du tableau,
   au tableau distant, avant et après ; puis → : il dévoile, comme avant. Dans l'Atelier : un cran = une diapo, une flèche de la colonne = une diapo (inchangé). */
const vueJ = async (pg, sel) => pg ? pg.evaluate(sel => { const m = sel === 'body' ? (document.querySelector('.mur.tableau') || document.querySelector('.mur')) : document.querySelector(sel); if (!m) return null; const a = m.querySelector('.act'); const pgT = m.querySelector('.page');
  let di = null; try { if (sel === '#mur') di = S.di; } catch (e) {} return { di, act: a ? a.textContent.trim().slice(0, 40) : '', page: pgT ? pgT.textContent.replace(/[‹›]/g, '').trim() : '' }; }, sel).catch(() => null) : null;
const egalJ = (a, b) => !!a && !!b && a.act === b.act && a.page === b.page && a.di === b.di;
const gesteJ = async (o, fen, T) => { const pg = o.pg; const av = { a: await vueJ(pg, '#mur'), b: await vueJ(fen, '#mur2'), c: T ? await vueJ(T.pg, 'body') : null };
  const bb = await (await pg.$('#murcadre')).boundingBox(); await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); for (let k = 0; k < 10; k++) { await pg.mouse.wheel(0, 120); await p(300); }
  await p(900); const garde1 = await pg.evaluate(() => !!(document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))); if (garde1) { await pg.click('#garde-devant').catch(() => {}); await p(900); }
  const mol = { a: await vueJ(pg, '#mur'), b: await vueJ(fen, '#mur2'), c: T ? await vueJ(T.pg, 'body') : null };
  const h5 = await pg.$('#volet h5'); if (h5) { await h5.click(); await p(300); } for (let k = 0; k < 10; k++) { await pg.keyboard.press(k < 5 ? 'ArrowDown' : 'ArrowUp'); await p(300); }
  await p(900); const garde2 = await pg.evaluate(() => !!(document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))); if (garde2) { await pg.click('#garde-devant').catch(() => {}); await p(900); }
  const fl = { a: await vueJ(pg, '#mur'), b: await vueJ(fen, '#mur2'), c: T ? await vueJ(T.pg, 'body') : null };
  const c0 = (await ici_(pg)).compte; await pg.keyboard.press('ArrowRight'); await p(900); const c1 = (await ici_(pg)).compte; const apresD = await vueJ(pg, '#mur');
  return { av, mol, fl, garde1, garde2, c0, c1, apresD }; };
const jouerJ = async (fichier, mode) => { HUBN = store(RETIENS); ECR = []; let T = null; if (mode !== 'repetition') { T = await ouvrir({ fichier, qui: 'tableau', q: '?vue=tableau', W: 1536, H: 864, prof: false }); await p(1200); }
  const o = await ouvrir({ fichier, test: mode === 'test' }); let fen = null;
  if (mode === 'repetition') { await ouvrirAtelier(o); const l2 = await lignesX(o.pg); const y = l2.find(e => /Les cinq tableaux/.test(e.t)); if (y) { await (await o.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(900); } await o.pg.click('#at-jouer').catch(() => {}); await p(2500); fen = await ouvrirTableau(o, 1536, 864); }
  else { await lancerClasse(o); fen = await ouvrirTableau(o, 1536, 864); const v = await o.pg.$('#volet .vig:has(table.p8-grille)'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); if (await o.pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) { await o.pg.click('#garde-devant'); await p(900); } } }
  await o.pg.click('#numero').catch(() => {}); await p(1500); const r = await gesteJ(o, fen, T); await capt(o.pg, 'J-' + mode + '-pilote'); if (fen) await capt(fen, 'J-' + mode + '-tableau');
  r.errs = o.errs.concat(o.boites, T ? T.errs.concat(T.boites) : []); await o.ctx.close(); if (T) await T.ctx.close(); return r; };
const txtJ = x => x ? (x.a ? 'pilote « ' + x.a.act + ' » ' + x.a.page : '') + (x.b ? ' │ tableau « ' + x.b.act + ' » ' + x.b.page : '') + (x.c ? ' │ distant « ' + x.c.act + ' » ' + x.c.page : '') : '—';
if (joue('J')) { dire(''); dire('══ J · (⑱) 1536×864 · en jeu, la molette et les flèches de la colonne ne changent ni de diapo ni de page ══');
  for (const [mode, nomM] of [['test', 'en classe, mode test'], ['classe', 'en classe, une vraie heure (faux hub)'], ['repetition', 'en répétition']]) { const r = await jouerJ(FICHIER, mode);
    dire('      J · ' + nomM + ' · avant : ' + txtJ(r.av) + ' ; après dix crans : ' + txtJ(r.mol) + (r.garde1 ? ' (la garde s’est ouverte)' : '') + ' ; après dix flèches de la colonne : ' + txtJ(r.fl) + (r.garde2 ? ' (la garde s’est ouverte)' : ''));
    const memes = x => egalJ(x.a, r.av.a) && (!r.av.b || egalJ(x.b, r.av.b)) && (!r.av.c || egalJ(x.c, r.av.c));
    verif('J', r.av.a && r.av.a.page && memes(r.mol) && !r.garde1, nomM + ' : dix crans de molette — la même diapo, la même page, au pilote' + (r.av.b ? ', à la fenêtre du tableau' : '') + (r.av.c ? ', au tableau distant' : '') + ' ; aucune garde', { avant: txtJ(r.av), apres: txtJ(r.mol) });
    verif('J', memes(r.fl) && !r.garde2, nomM + ' : un clic dans la colonne, dix flèches (↓ ×5, ↑ ×5) — la même diapo, la même page partout ; aucune garde', { avant: txtJ(r.av), apres: txtJ(r.fl) });
    verif('J', r.apresD && (r.c1 !== r.c0 || r.apresD.page !== r.fl.a.page || r.apresD.act !== r.fl.a.act), nomM + ' : → avance toujours (le fil : il dévoile, ou passe à la page suivante, ou à la diapo suivante quand tout est montré) — « ' + r.c0 + ' », ' + r.fl.a.page + ' → « ' + r.c1 + ' », ' + (r.apresD || {}).page + (r.apresD && r.apresD.act !== r.fl.a.act ? ', « ' + r.apresD.act + ' »' : ''));
    sansErreur('J', r.errs, nomM); }
  /* l'Atelier : inchangé */
  HUBN = store(RETIENS); ECR = []; const o = await ouvrir({}); await ouvrirAtelier(o); const L2 = await lignesX(o.pg); const y = L2.find(e => /^Tableau 1\b/.test(e.t)) || L2[6];
  await (await o.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(900); const d0 = await o.pg.evaluate(() => S.di); const bb = await (await o.pg.$('#murcadre')).boundingBox(); await o.pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await o.pg.mouse.wheel(0, 120); await p(900); const d1 = await o.pg.evaluate(() => S.di);
  await (await o.pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(600); await o.pg.keyboard.press('ArrowDown'); await p(700); const d2 = await o.pg.evaluate(() => S.di); const Ls = L2.map(l => l.di); const suiv = Ls[Ls.indexOf(d0) + 1];
  verif('J', d1 === suiv && d2 === suiv, 'dans l’Atelier (inchangé) : un cran de molette = la diapo suivante de la colonne ; ↓ après un clic dans la colonne = la diapo suivante', { depart: d0, molette: d1, fleche: d2, attendu: suiv });
  sansErreur('J', o.errs.concat(o.boites), 'l’Atelier'); await o.ctx.close(); }

/* ═══ N · (⑲, §3.8) le faux conflit de l'Atelier sur une diapo neuve ═══
   Au faux hub ordinaire et au faux hub rangé comme le vrai, dans l'Atelier : « Insérer une diapo après » sur « Tableau 1 » (clic droit), « + bloc » → consigne,
   « Lis le poème à voix basse », puis « , puis relis-le », puis « en entier » (chaque fois un clic ailleurs, puis 6 à 7 s : l'enregistrement et la relecture du hub,
   toutes les 3 s) : aucun message « modifiée sur un autre appareil », la dernière écriture au hub. Puis deux navigateurs dans l'Atelier, la même diapo (« Tableau
   1 »), chacun écrit dans sa consigne au même moment : le conflit paraît (l'un des deux). Sur la nouvelle version seulement (la 8.77.1-⑩ a le même faux
   conflit, préexistant : la conscience l'a mesuré). */
const conflitN = pg => pg.evaluate(() => { const z = document.getElementById('dr-conflit'); return z ? (z.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 220) : ''; });
const ecrireN = async (pg, re, txt) => { const v = await pg.evaluate(src => { const re = new RegExp(src); const el = Array.from(document.querySelectorAll('#mur [contenteditable]')).find(x => re.test(x.innerText || '')); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.right - 6, y: r.top + Math.min(r.height / 2, 14) }; }, re);
  if (!v) return false; await pg.mouse.click(v.x, v.y); await p(400); await pg.keyboard.press('End'); await pg.keyboard.type(txt); await p(200); await pg.mouse.click(5, 300); return true; };
const jouerN = async (fichier, vrai) => { VRAI = vrai; HUBN = vrai ? (ranger(store()) || {}) : store(); ECR = []; const o = await ouvrir({ fichier }); await ouvrirAtelier(o); const pg = o.pg;
  const L = await lignesX(pg); const t1 = (L.find(l => /^Tableau 1\b/.test(l.t)) || {}).eid;
  await pg.evaluate(s => { const d = document.querySelector(s); if (d) d.scrollIntoView({ block: 'center' }); }, '#volet [data-eid="' + t1 + '"]'); await p(250);
  await pg.click('#volet [data-eid="' + t1 + '"] .t', { button: 'right' }); await p(500); const ins = await pg.evaluate(() => { const b = document.querySelector('#menu.on [data-a="inserer"]'); if (!b || b.disabled) return false; b.click(); return true; }); await p(900);
  await pg.click('#at-bloc'); await p(600); const ch = await pg.evaluate(() => { const c = document.querySelector('.choix-obj .dr-c[data-t="consigne"]:not(.off)'); if (!c) return false; c.click(); return true; }); await p(800);
  await pg.keyboard.type('Lis le poème à voix basse'); await p(200); await pg.mouse.click(5, 300); await p(6000); const c1 = await conflitN(pg);
  await ecrireN(pg, 'Lis le poème', ', puis relis-le'); await p(7000); const c2 = await conflitN(pg);
  await ecrireN(pg, 'Lis le poème', ' en entier'); await p(7000); const c3 = await conflitN(pg); await capt(pg, 'N-' + (vrai ? 'vrai' : 'ordinaire') + '-diapo-neuve');
  const H = JSON.stringify(HUBN || {}); const auHub = [H.indexOf('Lis le poème à voix basse') >= 0, H.indexOf('puis relis-le') >= 0, H.indexOf('relis-le en entier') >= 0];
  const errs = o.errs.concat(o.boites); await o.ctx.close(); VRAI = false; return { ins, ch, c: [c1, c2, c3], auHub, errs }; };
const jouerN2 = async (fichier, vrai) => { VRAI = vrai; HUBN = vrai ? (ranger(store()) || {}) : store(); ECR = []; const A = await ouvrir({ fichier }), B = await ouvrir({ fichier }); await ouvrirAtelier(A); await ouvrirAtelier(B);
  for (const o of [A, B]) { const L = await lignesX(o.pg); const t1 = (L.find(l => /^Tableau 1\b/.test(l.t)) || {}).eid; await o.pg.evaluate(s => { const d = document.querySelector(s); if (d) d.scrollIntoView({ block: 'center' }); }, '#volet [data-eid="' + t1 + '"]'); await (await o.pg.$('#volet [data-eid="' + t1 + '"] .t')).click(); await p(900); }
  const premiere = pg => pg.evaluate(() => { const el = document.querySelector('#mur .corpsd [contenteditable]'); return el ? (el.innerText || '').slice(0, 20) : null; });
  const debut = await premiere(A.pg); const re = debut ? debut.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 12) : '.';
  await Promise.all([ecrireN(A.pg, re, ' (version de la salle 12)'), ecrireN(B.pg, re, ' (version de la maison)')]); await p(9000);
  const cA = await conflitN(A.pg), cB = await conflitN(B.pg); await capt(A.pg, 'N2-' + (vrai ? 'vrai' : 'ordinaire') + '-A'); await capt(B.pg, 'N2-' + (vrai ? 'vrai' : 'ordinaire') + '-B');
  const errs = A.errs.concat(A.boites, B.errs, B.boites); await A.ctx.close(); await B.ctx.close(); VRAI = false; return { cA, cB, debut, errs }; };
if (joue('N')) { dire(''); dire('══ N · (⑲) 1536×864 · l’Atelier : une diapo neuve écrite trois fois (aucun faux conflit), deux navigateurs sur la même diapo (le conflit paraît) ══');
  for (const vrai of [false, true]) { const nomH = vrai ? 'le faux hub rangé comme le vrai' : 'le faux hub ordinaire'; const r = await jouerN(FICHIER, vrai);
    verif('N', r.ins && r.ch && r.c.every(x => !x) && r.auHub.every(Boolean), nomH + ' : une diapo insérée, une consigne écrite trois fois — aucun message « modifiée sur un autre appareil » ; au hub, chaque écriture ' + JSON.stringify(r.auHub), { messages: r.c });
    sansErreur('N', r.errs, nomH + ', la diapo neuve');
    const q = await jouerN2(FICHIER, vrai);
    verif('N', /modifiée sur un autre appareil/.test(q.cA + q.cB), nomH + ' : deux navigateurs écrivent dans la même diapo au même moment — le conflit paraît (« ' + (q.cA || q.cB).slice(0, 90) + ' »)', { A: q.cA, B: q.cB, ligne: q.debut });
    sansErreur('N', q.errs, nomH + ', deux navigateurs'); } }

if (true) { dire(''); verif('㉘', !REFUSES.length, 'le faux hub rangé comme le vrai (qui refuse les clés interdites) : ' + REFUSES.length + ' écriture(s) refusée(s) sur toute la sonde', REFUSES.slice(0, 6).map(x => x.m + ' ' + x.c + ' (' + x.ko + ')')); }   /* C16 (les correctifs, ㉘) */
dire(''); dire('— fin : ' + nb + ' vérifications, ' + echecs + ' échec(s) · ' + (echecs ? 'ROUGE' : 'VERT'));
fs.writeFileSync(path.join(OUT, 'sonde-fin.txt'), R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
