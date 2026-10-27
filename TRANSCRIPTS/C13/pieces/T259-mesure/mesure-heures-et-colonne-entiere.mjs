// E3 · LE BANC §12.28 PAR LE GESTE — « les cinq dettes » 13 · 39 à 13 · 43 (contrat §12.28 (6), relance du 26/10 18:46).
// 39 : en mode test, publier un chapitre pour une classe appariée → l'emploi du temps montre ses heures ; dépublier → elles partent ;
//      aucune écriture au hub (une classe « 3 DYLAN Bob » appariée à ses six cases, dans le magasin du banc seulement : mission 0, M1).
// 40 : « Fin de l'heure », la liste : « 2 · ce qui n'a pas été fait — N activités : dis ce que chacune devient », « encore N », « tout est décidé »,
//      plus aucun « à décider » ; la carte dit « À l'heure suivante (si tu ne choisis rien) ».
// 41 : l'heure lancée par la case de l'emploi du temps se joue dans « la classe en cours » (ni Structure, ni Atelier, ni Mes chapitres ; aucune
//      sortie ; « ↗ Le site dans un nouvel onglet » ; le retour du navigateur sans effet) ; la garde beforeunload posée pendant l'heure, retirée
//      après « Clore » ; deux onglets d'un même navigateur : rien tant que l'onglet de l'heure vit, le bandeau « Heure en cours avec les … —
//      Reprendre » en moins d'une seconde quand il se ferme ; « Reprendre » → la même diapo, la même page, les mêmes lignes, le chrono
//      continu, « Fin de l'heure » à son étape ; après « Clore », aucun bandeau ; l'Atelier ne lance plus (la ligne de la répétition).
// 42 : le récit d'une seule activité jouée en fin de créneau commence par « Cette heure, on a fait », jamais par « Enfin ».
// 43 : un « ? » au même endroit sur chaque écran du prof, rien dessous ; clic / touche « ? » ouvrent le volet (à droite, toute la hauteur),
//      Échap le ferme ; dans un champ « ? » s'écrit ; rien dans la fenêtre du tableau ni dans la vue élève ; le texte mot pour mot quand
//      MANDATS/CINQ-DETTES/AIDE-PAR-ECRAN.md existe.
// R : (contrôle n°62) heure lancée, la fenêtre du tableau ouverte ; « ↗ » → l'Atelier → « ▶ Jouer en avance » → ▶ × 10 → le tableau de la classe ne change pas ; « ■ Arrêter » → pareil.
// L' : les recouvrements, bandeau montré et volet d'aide ouvert (la garde L de banc-1227, la même sonde).
// 30 : (§12.30) la phrase de l'activité en cours sous la tête de la séquence, aux paliers ; « tu dépasses · +n min » en place ; rien après « Clore », rien en répétition.
// 51 : (§12.31, 13 · 51) une classe CRÉÉE PAR LE SITE (clé simplifiée « 3_dylan_bob », « 4_hugo » ; nom avec espaces et majuscules) : l'import de sa liste
//      (panneau prof, Élèves & codes, le tableau collé → « nouvelle classe »), reliée par le menu de l'emploi du temps, le chapitre publié pour elle
//      depuis la page du niveau → semaine du 2/11 : sa case montre la séance (« heure n/N »), la carte le chapitre, la fenêtre de la case ses élèves ;
//      l'heure lancée par la case → ses élèves dans l'heure ; 3e et 4e.
// 50 : (13 · 50) sans la clé de chiffrement, « 📚 Nouveau chapitre » ouvre « Construire un chapitre avec une IA », sans « Clé requise ».
// 33 : (§12.33) l'Atelier : la poignée diapo / notes dans l'écran (quatre tailles, zooms 90 % et 110 %), prise sans viser ; « Structure » et « Atelier »
//      seulement ; la répétition par « ▶ Jouer en avance » ; pas de « 📝 Notes » ; surligner, couleur, « ✍ À écrire » posés dans l'Atelier → revus après
//      rechargement, vus au tableau en répétition ; un chapitre importé avec des notes sur trois diapos et le bilan → chaque note dans le cadre de sa diapo.
// 32 : (§12.32, R7) la Rédaction depuis le site : « ✏️ Rédactions » au menu des outils → redaction.html?mode=prof (&test=1 en mode test) ; la modale LIER
//      propose le sujet du faux hub (/redactions/<id interne>/config : la lettre de la Grande Guerre) et rattache l'item {kind: 'redaction', ref} sans écrire
//      dans /redactions ; l'onglet « ✏️ Rédaction » liste le sujet et l'ouvre (…&id=<ref>, &classe= si connue, &test=1 en mode test) ; l'élève : rien de neuf.
// 34 : (§12.34) l'œuvre entière et sa marque au même endroit de l'œuvre (Atelier, pilote, tableau) ; « L'Albatros » numéroté vers par vers (« Le Poète est
//      semblable » = 13) ; la notion de la séance 1 reprise en séance 2 n'est plus « travaillée nulle part » ; un double d'un titre dont « (proposition) » existe
//      → « (proposition 2) » ; « […] » reste une coupure dans un texte à trous ; une dictée manuscrite se lie et s'ouvre (élève, professeur) ; l'import
//      refuse le bilan trop long avec les mots du prompt, accepte le bon, et « Vérifier » dit la diapo de plus d'une page.
// 63 : (mesure 13 · 63, seulement si MJPC_CAS le nomme) le bilan au tableau : question de 57 signes, 5 / 4 / 3 mots-clés de 30 à 45 signes, la consigne à
//      3 étapes → combien de pages au tableau (répétition, « ▶ Jouer en avance » puis la fenêtre du tableau, tout dévoilé), « Diapo trop pleine » dans l'Atelier.
// 49 : (13 · 49) « Créer ce chapitre » (le JSON collé, aucun chapitre de ce titre) → le titre du JSON tel quel au hub, sans « (proposition) ».
// usage : MJPC_HUB=AUDITS/INTEGRATION-DEROULE/hub node banc-1228.mjs <assemble/index.html> [sortie.txt]
//   MJPC_TAILLES (défaut les quatre), MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres (1707 × 743 et 1920 × 1080). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1228.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = '/tmp/claude-0/-home-claude/fbedd388-7b0c-5f43-87ab-077e6ae1db43/scratchpad/wt-int';
const HUB = path.resolve(process.env.MJPC_HUB || path.join(RACINE, 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1707x743,1920x1080').split(',').map(t => t.split('x').map(Number));
const CAPT = process.env.MJPC_CAPT || null; const SUFF = process.env.MJPC_CAPT_SUFFIXE || 'apres'; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const AIDE = path.join(RACINE, 'MANDATS', 'CINQ-DETTES', 'AIDE-PAR-ECRAN.md');
const URL0 = 'file://' + FICHIER; const MD5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const HORLOGE = new Date('2026-09-14T09:00:00+02:00');
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && detail !== '' ? ' — ' + detail : '')); return !!ok; };
const info = (k, quoi) => dire('  info   ' + k + ' · ' + quoi);
const p = (pg, ms) => pg.waitForTimeout(ms);
/* MJPC_CAS=29,41 : ne jouer que ces cas (39, 41 — avec 40 et 43 —, 43, 46, 29, 30, R, 42, 51, 50, 49, 33, 32, 34 ; 63 seulement s'il est nommé) */
const SEUL = process.env.MJPC_CAS ? process.env.MJPC_CAS.split(',') : null; const fait = k => !SEUL || SEUL.includes(k);

/* ── le faux hub (celui de banc-1227), plus la classe « 3 DYLAN Bob » appariée à ses six cases (mission 0, M1) ── */
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {}
  if (!st.classes['3 DYLAN Bob']) { st.classes['3 DYLAN Bob'] = { nom: '3 DYLAN Bob', niveau: '3e', archivee: false, eleves: JSON.parse(JSON.stringify((st.classes['CLASSE TEST'] || {}).eleves || [])) };
    ((st.site.edt.grille['2026-2027'] || {}).creneaux || []).forEach(x => { if (x.classe === '3 DYLAN Bob' && !x.classeMjpc) x.classeMjpc = '3 DYLAN Bob'; }); }
  return st; };
const fauxHub = s => { let sv = null; try { sv = localStorage.getItem('__E3HUB28'); } catch (e) {} window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = []; const garder = () => { try { localStorage.setItem('__E3HUB28', JSON.stringify(window.__HUB)); } catch (e) {} };
  /* le hub vit dans localStorage : deux onglets d'un même navigateur (un même contexte) lisent le même hub, comme le vrai */
  const lire = c => { try { const sv2 = localStorage.getItem('__E3HUB28'); if (sv2) window.__HUB = JSON.parse(sv2); } catch (e) {} const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { try { const sv2 = localStorage.getItem('__E3HUB28'); if (sv2) window.__HUB = JSON.parse(sv2); } catch (e) {} const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; garder(); };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrirCtx = async (W, H, st, zoom) => { const z = zoom || 1; const ctx = await nav.newContext({ viewport: { width: Math.round(W / z), height: Math.round(H / z) }, deviceScaleFactor: z, timezoneId: 'Europe/Paris' });   /* zoom du navigateur z : la page voit W/z × H/z pixels CSS (comme Ctrl + / Ctrl -) */ const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort()); await ctx.addInitScript(fauxHub, st || hubStore());
  ctx.on('page', q => { q.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); q.on('dialog', d => { if (d.type() === 'beforeunload') { q.__beforeunload = (q.__beforeunload || 0) + 1; d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(HORLOGE);
  /* un second onglet lit le même hub : une page file:// neuve voit parfois un localStorage vide (3 fois sur 16 mesurées) — on lui donne le hub du premier à sa création */
  const np = ctx.newPage.bind(ctx); ctx.newPage = async () => { const q = await np(); const v = await pg.evaluate(() => localStorage.getItem('__E3HUB28')).catch(() => null); if (v) await q.addInitScript(x => { try { if (!localStorage.getItem('__E3HUB28')) localStorage.setItem('__E3HUB28', x); } catch (e) {} }, v); return q; };
  return { ctx, pg, errs, boites }; };
const entrerProf = async pg => { await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg); };
const edtOuvert = pg => pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0); });
/* lancer par la case de l'emploi du temps (la case des De Gaulle « heure 1/3 ») : « ▶ Ouvrir le pilotage et lancer » */
const lancerParLaCase = async pg => { if (!(await edtOuvert(pg))) { await pg.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pg, 1800); } await pg.evaluate(() => { try { edtVue('semaine'); } catch (e) {} }); await p(pg, 600);
  const ok = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => e.offsetParent && /Charles/.test(e.innerText)); const c = cs.find(e => /heure 1\//.test(e.innerText)) || cs[0]; if (!c) return false; c.click(); return true; }); await p(pg, 900);
  const l = ok && await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Ouvrir le pilotage et lancer/.test(b.innerText)); if (!b) return false; b.click(); return true; }); await p(pg, 3500); await sansVoiles(pg); await pg.keyboard.press('Escape'); await p(pg, 400);
  return !!l && await pg.evaluate(() => !!(window.S && S.lancee)); };
/* la répétition : depuis l'Atelier, « ▶ Jouer en avance » (§12.33 : la seule entrée) ; l'onglet « Pilotage » de l'Atelier, s'il existe encore (la ⑤) */
const entrerRepetition = async q => { await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(q, 1200);
  const j = await q.evaluate(() => { const b = document.getElementById('at-jouer'); if (!b || !b.offsetParent) return false; b.click(); return true; }); if (!j) await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(q, 1800); return q.evaluate(() => !!(window.S && S.repetition)); };
/* ouvrir le chapitre (le premier, ou celui dont le titre est donné) dans l'Atelier */
const ouvrirAtelier = async (q, titre) => { await q.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(q, 1200); await sansVoiles(q); if (await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await q.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(q, 900); await clicTexte(q, 'button', '← Mes chapitres'); await p(q, 900); }   /* l'Atelier rouvre le dernier chapitre : revenir à la liste */ await clicTexte(q, 'button,[onclick]', "atOnglet('chapitres')"); await p(q, 900);
  if (titre) { const ok = await q.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && Array.from(e.querySelectorAll('button,[onclick]')).some(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || ''))); const e = c[c.length - 1]; if (!e) return false; const b = Array.from(e.querySelectorAll('button,[onclick]')).find(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || '')); b.click(); return true; }, titre); if (!ok) return false; }
  else if (!(await clicTexte(q, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(q, 'button,[onclick]', 'Modifier');
  await p(q, 1800); await sansVoiles(q); await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(q, 1500); return q.evaluate(() => !!(window.S && S.atelier)); };
const OUT = SORTIE || '.';
const etat = pg => pg.evaluate(() => { const r = {}; try { r.si = S.si; r.di = S.di; } catch (e) {} r.mur = ((document.querySelector('#numero') || {}).innerText || '').slice(0, 60); const col = document.getElementById('at-arbre'); r.depliees = Array.from(col.querySelectorAll('.ed2-sce')).filter(x => /▾/.test(x.innerText)).map(x => x.innerText.replace(/[▾▸]/g, '').trim().slice(0, 28)); r.ecrans = Array.from(col.querySelectorAll('.dr-d')).filter(x => x.offsetParent).length; r.haut = (col.querySelector('.ed2-som') || col).scrollHeight; r.scroll = (col.querySelector('.ed2-som') || col).scrollTop; return r; });
const { ctx, pg, errs } = await ouvrirCtx(1707, 743);
await entrerProf(pg); await ouvrirAtelier(pg); await p(pg, 1500);
const G = []; const geste = async (nom, f) => { const av = await etat(pg); await f(); await p(pg, 1300); const ap = await etat(pg); const d = {}; Object.keys(ap).forEach(k => { if (JSON.stringify(ap[k]) !== JSON.stringify(av[k])) d[k] = [av[k], ap[k]]; }); G.push({ nom, change: d }); };
const boite = (sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).find(x => x.offsetParent && (!t || (x.innerText || '').indexOf(t) >= 0)); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, { s: sel, t: txt });
await geste('clic sur le titre de la séance ouverte', async () => { const b = await boite('#at-arbre .ed2-sce', 'Poésie et peinture'); await p(pg, 200); const c = await boite('#at-arbre .ed2-sce', 'Poésie et peinture'); await pg.mouse.click(c.x + 120, c.y + c.h / 2); });
await geste('clic sur « +7 »', async () => { await boite('#at-arbre .fr .plus'); await p(pg, 200); const c = await boite('#at-arbre .fr .plus'); await pg.mouse.click(c.x + c.w / 2, c.y + c.h / 2); });
await geste('clic sur la moitié droite de la ligne d’heure (« 52 + 5 = 57 min »)', async () => { const c = await pg.evaluate(() => { const f = document.querySelector('#at-arbre .at-chap .fr'); f.scrollIntoView({ block: 'center' }); const r = f.getBoundingClientRect(); return { x: r.x + r.width * 0.75, y: r.y + 6 }; }); await pg.mouse.click(c.x, c.y); });
// les heures prévues de chaque diapo de la séance ouverte (lues dans le titre du centre)
const H = []; const n = await pg.evaluate(() => document.querySelectorAll('#at-arbre .dr-d').length);
for (let i = 0; i < n; i++) { await pg.evaluate(k => { const e = document.querySelectorAll('#at-arbre .dr-d')[k]; e.scrollIntoView({ block: 'center' }); e.click(); }, i); await p(pg, 700); const t = await pg.evaluate(() => (document.querySelector('#numero') || {}).innerText || ''); const m = /(\d\d) h (\d\d) → (\d\d) h (\d\d)/.exec(t); const hh = /heure (\d)/.exec(t); H.push({ i, heure: hh && hh[1], de: m && m[1] + ':' + m[2], a: m && m[3] + ':' + m[4] }); }
G.push({ nom: 'heures prévues', H });
await pg.evaluate(() => { const e = document.querySelectorAll('#at-arbre .dr-d')[0]; e.click(); }); await p(pg, 1000);
await pg.evaluate(() => { const s = document.querySelector('#at-arbre .ed2-som') || document.getElementById('at-arbre'); s.scrollTop = 0; }); await p(pg, 300);
// la colonne entière d'aujourd'hui
await pg.setViewportSize({ width: 1707, height: 2900 }); await p(pg, 1500);
let r = await pg.evaluate(() => { const c = document.getElementById('at-arbre').getBoundingClientRect(); return { x: c.x, y: c.y, w: c.width, h: c.height, sh: (document.querySelector('#at-arbre .ed2-som') || document.getElementById('at-arbre')).scrollHeight }; });
await pg.screenshot({ path: OUT + '/colonne-entiere-aujourdhui.png', clip: { x: r.x, y: r.y, width: r.w, height: Math.min(r.h, r.sh + 30) } }); G.push({ nom: 'colonne entière aujourd’hui', r });
await pg.setViewportSize({ width: 1707, height: 743 }); await p(pg, 1500);
// la colonne proposée, écrite dans la page réelle (rien d'enregistré)
const maquette = (HP) => { const col = document.getElementById('at-arbre'); const h3 = col.querySelector('.ed2-som h3'); if (h3) h3.textContent = 'Poésie et peinture au XIXe siècle (proposition)';
  const pr = col.querySelector('.ed2-prog'); if (pr && !pr.dataset.m) { pr.dataset.m = 1; pr.innerHTML = pr.innerHTML + ' <span style="text-decoration:underline;cursor:pointer">→ Structure</span>'; }
  col.querySelectorAll('.ed2-it, .ed2-inserer, .at-chap .sea, .at-chap .aide').forEach(e => e.remove()); col.querySelectorAll('.at-chap .sea2:not(.dr-react)').forEach(e => e.remove());
  const rr = col.querySelector('[data-dr-react]'); if (rr && !rr.dataset.m) { rr.dataset.m = 1; rr.innerHTML = rr.innerHTML.replace('Ouvrir chaque heure par la réactivation', 'Chaque heure s’ouvre par la réactivation'); }
  const debut = {}; HP.forEach(x => { if (x.heure && !debut[x.heure]) debut[x.heure] = x.de; });
  const plus55 = t => { const [h, m] = t.split(':').map(Number); const z = h * 60 + m + 55; return String(Math.floor(z / 60)).padStart(2, '0') + ' h ' + String(z % 60).padStart(2, '0'); };
  col.querySelectorAll('.at-chap .fr').forEach((f, k) => { if (f.dataset.m) return; f.dataset.m = 1; const sp = f.querySelectorAll(':scope > span'); const g = sp[0], d = sp[1]; const mh = /H(\d)/.exec(g.innerText); const n = mh ? mh[1] : String(k + 1); const de = debut[n]; const md = /(\d+) \+ (\d+) = (\d+) min/.exec(d.innerText); const pl = d.querySelector('.plus'); const ok = /✔/.test(d.innerText);
    g.innerHTML = 'H' + n + ' · lun. 14 sept. · ' + (de ? de.replace(':', ' h ') + ' → ' + plus55(de) : ''); d.innerHTML = (md ? md[3] + ' min prévues pour 50' : '') + ' ' + (pl ? pl.outerHTML : (ok ? '✔' : '')); });
  const lignes = col.querySelectorAll('.dr-d'); lignes.forEach((l, i) => { if (l.dataset.m) return; l.dataset.m = 1; const nn = l.querySelector('.dr-n'); if (nn && HP[i] && HP[i].de) { nn.textContent = HP[i].de.replace(':', ' h '); nn.style.minWidth = '42px'; nn.style.fontSize = '11px'; nn.style.textAlign = 'left'; } l.title = 'Clic : ouvre cette diapo · clic droit : dupliquer, insérer, déplacer, envoyer vers une autre séance, supprimer'; }); };
await pg.evaluate(maquette, H); await p(pg, 400);
await pg.screenshot({ path: OUT + '/1707-propose.png' });
const sh = await pg.evaluate(() => (document.querySelector('#at-arbre .ed2-som') || document.getElementById('at-arbre')).scrollHeight); G.push({ nom: 'hauteur proposée (743)', sh });
await pg.setViewportSize({ width: 1707, height: 2900 }); await p(pg, 1500); await pg.evaluate(maquette, H); await p(pg, 400);
r = await pg.evaluate(() => { const c = document.getElementById('at-arbre').getBoundingClientRect(); return { x: c.x, y: c.y, w: c.width, h: c.height, sh: (document.querySelector('#at-arbre .ed2-som') || document.getElementById('at-arbre')).scrollHeight }; });
await pg.screenshot({ path: OUT + '/colonne-entiere-proposee.png', clip: { x: r.x, y: r.y, width: r.w, height: Math.min(r.h, r.sh + 30) } }); G.push({ nom: 'colonne entière proposée', r });
fs.writeFileSync(OUT + '/gestes3.json', JSON.stringify(G, null, 1)); console.log(JSON.stringify(G, null, 1)); console.log('erreurs', JSON.stringify(errs));
await nav.close();
