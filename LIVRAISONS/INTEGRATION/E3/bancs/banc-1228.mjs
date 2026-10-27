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
// 49 : (13 · 49) « Créer ce chapitre » (le JSON collé, aucun chapitre de ce titre) → le titre du JSON tel quel au hub, sans « (proposition) ».
// usage : MJPC_HUB=AUDITS/INTEGRATION-DEROULE/hub node banc-1228.mjs <assemble/index.html> [sortie.txt]
//   MJPC_TAILLES (défaut les quatre), MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres (1707 × 743 et 1920 × 1080). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1228.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..', '..');
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
/* MJPC_CAS=29,41 : ne jouer que ces cas (39, 41 — avec 40 et 43 —, 43, 46, 29, 30, R, 42, 51, 50, 49, 33) */
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
const ouvrirAtelier = async (q, titre) => { await q.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(q, 1200); await sansVoiles(q); await clicTexte(q, 'button,[onclick]', "atOnglet('chapitres')"); await p(q, 900);
  if (titre) { const ok = await q.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && Array.from(e.querySelectorAll('button,[onclick]')).some(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || ''))); const e = c[c.length - 1]; if (!e) return false; const b = Array.from(e.querySelectorAll('button,[onclick]')).find(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || '')); b.click(); return true; }, titre); if (!ok) return false; }
  else if (!(await clicTexte(q, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(q, 'button,[onclick]', 'Modifier');
  await p(q, 1800); await sansVoiles(q); await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(q, 1500); return q.evaluate(() => !!(window.S && S.atelier)); };
const dev = async (pg, n) => { for (let i = 0; i < n; i++) { await pg.click('#bdev').catch(() => {}); await p(pg, 120); } };
const lire = (pg) => pg.evaluate(() => { const mur = document.getElementById('mur'); if (!mur) return null; const c = mur.querySelector('.corpsd') || mur; const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0');
  return { page: ((mur.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), act: ((mur.querySelector('.act') || {}).textContent || '').trim().slice(0, 60), lignes: els.map(l => l.getAttribute('data-p') || l.textContent.trim().slice(0, 24)), di: window.S ? S.di : null, nDev: window.S ? S.nDev : null }; });
const pareil = (a, b) => !!a && !!b && a.page === b.page && a.act === b.act && JSON.stringify(a.lignes) === JSON.stringify(b.lignes);
const dD = d => d ? `${d.act || '?'} · ${d.lignes.length} lignes · page « ${d.page} »` : 'absente';
const vis = (pg, sel) => pg.evaluate(s => Array.from(document.querySelectorAll(s)).some(e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 1 && r.height > 1 && c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0; }), sel);
const texteVisible = (pg, re) => pg.evaluate(src => { const re = new RegExp(src); const W = innerWidth, H = innerHeight; return Array.from(document.querySelectorAll('body *')).filter(e => e.children.length < 4 && re.test((e.innerText || '').replace(/\s+/g, ' '))).find(e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < H && c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity > 0; }) ? true : false; }, re.source);
/* clore par la séquence « Fin de l'heure » (§12.29 : plus de barre ni de garde à franchir ; « Aller au cahier » n'est plus le chemin) */
const clore = async (pg, quand) => { await pg.clock.setFixedTime(new Date(quand)); await p(pg, 2500);
  if (!(await vis(pg, '.pp-tete'))) { await pg.click('#bfin').catch(() => {}); await p(pg, 900); }
  for (let n = 1; n <= 7; n++) { const t = await pg.evaluate(() => (document.querySelector('.pp-tete') || {}).innerText || ''); if (/étape 7 sur 7/.test(t)) break; const b = await pg.$('#f-suivante:not([disabled])'); if (!b) break; await b.click().catch(() => {}); await p(pg, 700); }
  /* à l'étape 7, quand des décisions ont été prises, la séquence demande d'abord « Garder ces décisions » ; sinon « ■ Clore l'heure » de l'entête */
  if (!(await vis(pg, '#f-clore'))) { await clicTexte(pg, '#fin button, .pp button', 'Garder ces décisions'); await p(pg, 900); }
  if (!(await vis(pg, '#f-clore'))) { await pg.click('#dr-clore').catch(() => {}); await p(pg, 1200); }   /* « ■ Clore l'heure » de l'entête fait paraître « Clore l'heure » dans la séquence (mesuré, sonde du retour 61) */
  if (await vis(pg, '#f-clore')) { await pg.locator('#f-clore:visible').first().click().catch(() => {}); } await p(pg, 1200);
  if (await pg.$('#gclore-oui:visible')) { await pg.click('#gclore-oui'); await p(pg, 1500); } await p(pg, 1500); return pg.evaluate(() => !!(window.S && S.close)); };
/* replier la séquence et revenir au cours : « Plus tard » (§12.29), « Reprendre le cours » avant */
const revenirCours = async q => (await clicTexte(q, '.pp-tete button', 'Plus tard')) || (await clicTexte(q, 'button', 'Reprendre le cours')) || (await clicTexte(q, 'button', 'Retour au cours'));
const finEtape = pg => pg.evaluate(() => { const t = (document.querySelector('.pp-tete') || {}).innerText || ''; const m = /étape (\d) sur 7/.exec(t); return m ? +m[1] : 0; });
const allerEtape = async (pg, n) => { if (!(await vis(pg, '.pp-tete'))) { await pg.click('#bfin').catch(() => {}); await p(pg, 900); } for (let k = 0; k < 7; k++) { const e = await finEtape(pg); if (e >= n || !e) break; const b = await pg.$('#f-suivante:not([disabled])'); if (!b) break; await b.click().catch(() => {}); await p(pg, 700); } return finEtape(pg); };
const liste2 = pg => pg.evaluate(() => { const l = document.querySelector('.pp-liste'); const t = l ? l.innerText.replace(/\s+/g, ' ') : ''; const m = /2 · [^|✔○]*?(?=\s[✔○]\s3 ·|\s[✔○] 3 ·|$)/.exec(t); return { l2: m ? m[0].trim() : t.slice(0, 160), tout: t }; });
const capt = async (pg, W, H, nom) => { if (CAPT && (W === 1707 || W === 1920)) await pg.screenshot({ path: path.join(CAPT, W + 'x' + H + '-' + nom + '-' + SUFF + '.png') }).catch(() => {}); };

/* le « ? » : un bouton visible dont le texte est « ? » ; le volet : un panneau qui paraît à droite, toute la hauteur */
const aideBouton = pg => pg.evaluate(() => { const W = innerWidth, H = innerHeight; const b = Array.from(document.querySelectorAll('button, [role=button], a')).filter(e => (e.innerText || e.textContent || '').trim() === '?').find(e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 4 && r.height > 4 && r.right > 0 && r.left < W && r.bottom > 0 && r.top < H && c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity > 0; });
  if (!b) return null; const r = b.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), libre: !!(top && (top === b || b.contains(top))), dessus: top && !(top === b || b.contains(top)) ? top.tagName.toLowerCase() + (top.id ? '#' + top.id : '') : '' }; });
const volet = pg => pg.evaluate(() => { const W = document.documentElement.clientWidth, H = innerHeight; const v = Array.from(document.querySelectorAll('body *')).find(e => { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) return false; if (c.position !== 'fixed' && c.position !== 'absolute') return false; const r = e.getBoundingClientRect(); return r.right >= W - 2 && r.top <= 2 && r.height >= H - 2 && r.width >= 200 && r.width <= W * 0.6 && /\S/.test(e.innerText || ''); }); return v ? { larg: Math.round(v.getBoundingClientRect().width), texte: (v.innerText || '').replace(/\s+/g, ' ').trim() } : null; });

/* les blocs du fichier : chaque ligne non vide, le gras et la numérotation retirés (le volet les met en forme), le reste mot pour mot */
const norm = t => String(t).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const BLOCS = fs.existsSync(AIDE) ? (() => { const o = {}; let cle = null; fs.readFileSync(AIDE, 'utf8').split('\n').forEach(l => { const m = /^### (\S+) — (.*?)(?: \(fil-\d\))?$/.exec(l); if (m) { cle = m[1]; o[cle] = [norm(m[2])]; return; } if (/^MEMO\s*$/.test(l)) { cle = null; return; } if (/^(---|#|\*Conscience|\*\*Pour E1)/.test(l)) { if (/^---/.test(l)) cle = null; return; } if (cle && l.trim()) o[cle].push(norm(l.replace(/^\s*\d+\.\s+/, ''))); }); return o; })() : null;
const CLES = { 'edt-semaine': 'edt-semaine', 'edt-mois': 'edt-mois', 'edt-annee': 'edt-annee', 'edt-calendrier': 'edt-heures-perdues', 'edt-case': 'edt-case', 'accueil-niveaux': 'accueil', 'page-du-niveau': 'niveau', 'panneau-dashboard': 'panneau-tableau-de-bord', 'panneau-classes': 'panneau-classes', 'panneau-eleves': 'panneau-eleves-codes', 'panneau-profil-test': 'panneau-profil-test', 'panneau-archi': 'panneau-architecture', 'panneau-archives': 'panneau-archives', 'panneau-corbeille': 'panneau-corbeille', 'panneau-annonces': 'panneau-annonces', 'panneau-brevet': 'panneau-dates', 'panneau-taxo': 'panneau-taxonomie', 'panneau-edt': 'panneau-emploi-du-temps', 'panneau-config': 'panneau-configuration', 'panneau-presence': 'panneau-presence', 'atelier-accueil': 'atelier-accueil', 'atelier-mes-chapitres': 'atelier-mes-chapitres', 'chapitre-structure': 'chapitre-structure', 'chapitre-atelier': 'chapitre-atelier', 'chapitre-pilotage': 'chapitre-pilotage', 'chapitre-relecture': 'chapitre-relecture', 'heure-lancee': 'classe-heure', 'fin-de-l-heure': 'classe-fin', 'apres-clore': 'classe-close' };
/* ouvrir le volet par le « ? », lire son texte, le refermer (Échap) */
const lireVolet = async (pg, b) => { try { await pg.mouse.click(b.x + b.w / 2, b.y + 5); await p(pg, 500); const v = await volet(pg); await pg.keyboard.press('Escape'); await p(pg, 300); return v ? v.texte : null; } catch (e) { return null; } };

/* L' : ce que cache un élément donné (le bandeau, le volet) — tout texte de la page sondé en trois points, la page défilée de haut en bas */
const marquer = (pg, quoi) => pg.evaluate(q => { document.querySelectorAll('[data-e3-couvre]').forEach(e => e.removeAttribute('data-e3-couvre')); const W = document.documentElement.clientWidth, H = innerHeight; const v = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 1 && r.height > 1 && c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0; };
  let el = null; if (q === 'bandeau') { const t = Array.from(document.querySelectorAll('body *')).filter(x => /Heure en cours avec les /.test(x.innerText || '') && v(x)); el = t.reverse().find(x => { let a = x; while (a && a !== document.body) { const c = getComputedStyle(a).position; if (c === 'fixed' || c === 'sticky') return true; a = a.parentElement; } return false; }) || t[0] || null; if (el) { let a = el; while (a.parentElement && a.parentElement !== document.body && (/Heure en cours avec les /.test(a.parentElement.innerText || ''))) a = a.parentElement; el = a; } }
  else el = Array.from(document.querySelectorAll('body *')).find(e => { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || (c.position !== 'fixed' && c.position !== 'absolute')) return false; const r = e.getBoundingClientRect(); return r.right >= W - 2 && r.top <= 2 && r.height >= H - 2 && r.width >= 200 && r.width <= W * 0.6; }) || null;
  if (el) el.setAttribute('data-e3-couvre', '1'); return !!el; }, quoi);
const cache = pg => pg.evaluate(() => { const W = innerWidth, H = innerHeight; const C = document.querySelector('[data-e3-couvre]'); if (!C) return null; const ko = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode() && ko.length < 5) { const t = tw.currentNode; const txt = t.textContent.replace(/\s+/g, ' ').trim(); if (!txt) continue; const el = t.parentElement; if (!el || C.contains(el) || el.closest('script,style,noscript,.level-bg-num,[aria-hidden="true"]')) continue; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const rg = document.createRange(); rg.selectNodeContents(t); for (const r of Array.from(rg.getClientRects())) { if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue; let hit = false; for (const fx of [0.15, 0.5, 0.85]) { const x = r.left + r.width * fx, y = r.top + r.height / 2; if (x < 0 || x >= W || y < 0 || y >= H) continue; const top = document.elementFromPoint(x, y); if (top && C.contains(top) && !top.contains(el)) { hit = true; break; } } if (hit) { ko.push('« ' + txt.slice(0, 30) + ' »'); break; } } }
  return ko; });
/* les flottants (fixes, moins de la moitié de la largeur) ne se chevauchent pas entre eux ni avec le bandeau */
const chevauche = pg => pg.evaluate(() => { const W = innerWidth, H = innerHeight; const v = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < H && c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0; };
  const fl = Array.from(document.querySelectorAll('body *')).filter(e => getComputedStyle(e).position === 'fixed' && v(e) && (e.getBoundingClientRect().width < W * 0.5 || e.hasAttribute('data-e3-couvre'))); const tops = fl.filter(e => !fl.some(o => o !== e && o.contains(e)));
  const nom = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + ((e.innerText || '').trim() ? ' « ' + (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 20) + ' »' : ''); const ko = [];
  for (let i = 0; i < tops.length; i++) for (let j = i + 1; j < tops.length; j++) { const a = tops[i].getBoundingClientRect(), b = tops[j].getBoundingClientRect(); const x = Math.min(a.right, b.right) - Math.max(a.left, b.left), y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (x > 2 && y > 2) ko.push(nom(tops[i]) + ' / ' + nom(tops[j])); }
  return ko; });
const balayer = async (pg, haut) => { const ko = []; const h = haut ? 1 : await pg.evaluate(() => document.scrollingElement.scrollHeight).catch(() => 0); for (let y = 0; y < Math.max(h, 1) && ko.length < 5; y += 400) { await pg.evaluate(v => window.scrollTo(0, v), y); await p(pg, 120); const k = await cache(pg); if (k === null) return null; k.forEach(x => { if (ko.indexOf(x) < 0) ko.push(x); }); } await pg.evaluate(() => window.scrollTo(0, 0)); return ko; };

dire('E3 · banc §12.28 par le geste (les cinq dettes) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + MD5 + (fs.existsSync(AIDE) ? '' : ' · AIDE-PAR-ECRAN.md absent : le « mot pour mot » de 13 · 43 attend'));

for (const [W, H] of TAILLES) { const T = W + '×' + H; dire(''); dire('══ ' + T + ' ══');

  /* ── 13 · 39 : en mode test, publier pour « 3 DYLAN Bob » → l'emploi du temps montre ses heures ; dépublier → elles partent ; rien au hub ── */
  if (fait('39')) { const o = await ouvrirCtx(W, H); const pg = o.pg;
    try { await entrerProf(pg); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} }); await pg.evaluate(() => { if (!m8TestOn()) m8BasculerModeTest(); }); await p(pg, 600);
      const e0 = await pg.evaluate(() => window.__ECR.length);
      const casesDylan = () => pg.evaluate(() => new Promise(r => { try { edtOuvrir(); } catch (e) {} setTimeout(() => { try { edtVue('semaine'); } catch (e) {} setTimeout(() => { const cs = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => /DYLAN/.test(e.innerText)).map(e => e.innerText.replace(/\s+/g, ' ')); try { edtFermer(); } catch (e) {} r(cs); }, 700); }, 1500); }));
      const niv = async () => { await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 700); if (!(await pg.evaluate(() => { const e = document.getElementById('page-level'); return !!(e && e.classList.contains('active')); }))) { await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 1500); } };
      const pub = async () => { await niv(); const ok = await pg.evaluate(() => { const e = Array.from(document.querySelectorAll('#page-level [onclick*="togglePublishChapterCls"]')).find(x => /DYLAN/.test(x.getAttribute('onclick')) && x.offsetParent); if (!e) return false; e.click(); return true; }); await p(pg, 1500); await pg.evaluate(() => { try { goHome(); } catch (e) {} }); await p(pg, 500); return ok; };
      const avant = await casesDylan();
      const c1 = await pub(); const apres = await casesDylan(); await capt(pg, W, H, '39-mode-test-publie-edt');
      const seances = x => x.filter(t => !/aucune séance prête/.test(t) && /heure \d/.test(t)).length;
      verif('39', c1, T + ' · en mode test, « 3 DYLAN BOB » se publie depuis la page du niveau (le geste existe)');
      verif('39', seances(avant) === 0 && seances(apres) > 0, T + ' · 13 · 39 · après la publication, l’emploi du temps montre les heures de « 3 DYLAN Bob » avec leur séance', 'avant ' + seances(avant) + ' / après ' + seances(apres) + ' cases avec séance (' + apres.slice(0, 2).join(' | ').slice(0, 160) + ')');
      const c2 = await pub(); const apres2 = await casesDylan();
      verif('39', c2 && seances(apres2) === 0, T + ' · 13 · 39 · dépublié, elles partent', seances(apres2) + ' cases avec séance');
      const ecr = await pg.evaluate(n => window.__ECR.slice(n), e0); const pres = ecr.filter(x => / \/presence\//.test(x)), donnees = ecr.filter(x => !/ \/presence\//.test(x));
      verif('39', !donnees.length, T + ' · 13 · 39 · mode test : aucune écriture au hub', donnees.slice(0, 4).join(', '));
      if (pres.length) info('39', T + ' · en mode test, la présence du prof s’écrit au hub (' + pres.length + ' × ' + pres[0] + ', le battement de connexion) — dit à la conscience : K15-test la compte-t-il ?');
    } catch (e) { verif('39', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('39', !o.errs.length, T + ' · 0 erreur JS', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 13 · 40, 13 · 41, 13 · 43 (écrans de l'heure) : l'heure lancée par la case ; deux onglets ── */
  if (fait('41')) { const o = await ouvrirCtx(W, H); const pg = o.pg; let pb = null;
    try { await entrerProf(pg);
      /* 13 · 43 d'abord, sur les écrans du prof avant l'heure (l'EDT est ouvert à l'arrivée) */
      const aides = []; const passe = async (nom, geste) => { await geste(); await p(pg, 700); await sansVoiles(pg); const b = await aideBouton(pg); aides.push({ nom, b, texte: b ? await lireVolet(pg, b) : null }); };
      await passe('edt-semaine', async () => { if (!(await edtOuvert(pg))) await pg.evaluate(() => edtOuvrir()); });
      for (const v of ['mois', 'annee', 'calendrier']) await passe('edt-' + v, () => pg.evaluate(x => edtVue(x), v));
      await pg.evaluate(() => edtVue('semaine')); await p(pg, 500);
      await passe('edt-case', () => pg.evaluate(() => { const c = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).find(e => e.offsetParent && /Charles/.test(e.innerText)); if (c) c.click(); }));
      await pg.keyboard.press('Escape'); await p(pg, 300); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} });
      await passe('accueil-niveaux', async () => {});
      await passe('page-du-niveau', async () => { await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 600); await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 1200); });
      await pg.evaluate(() => { try { goHome(); } catch (e) {} });
      await pg.evaluate(() => openProfPanel()); await p(pg, 800); await sansVoiles(pg);
      for (const s of ['dashboard', 'classes', 'eleves', 'profil-test', 'archi', 'archives', 'corbeille', 'annonces', 'brevet', 'taxo', 'edt', 'config', 'presence']) await passe('panneau-' + s, () => pg.evaluate(id => { try { showProfSection(id); } catch (e) {} }, s));
      await passe('atelier-accueil', () => pg.evaluate(() => atelierOuvrir()));
      await passe('atelier-mes-chapitres', () => clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"));
      await passe('chapitre-structure', async () => { if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(pg, 1500); });
      for (const v of ['atelier', 'pilotage', 'relecture']) { const la = await pg.evaluate(x => { const b = document.querySelector('.at-onglet[data-vue="' + x + '"]'); return !!(b && b.offsetParent); }, v);   /* §12.33 : « Pilotage » et « Relecture » sortent de l'Atelier */
        if (la) await passe('chapitre-' + v, () => pg.evaluate(x => { const b = document.querySelector('.at-onglet[data-vue="' + x + '"]'); if (b) b.click(); }, v)); else info('43', T + ' · l’onglet « ' + v + ' » n’est plus dans l’Atelier (§12.33)'); }
      /* l'Atelier ne lance plus : dans la répétition (« ▶ Jouer en avance ») — pas de « Lancer avec », la ligne de la répétition */
      await entrerRepetition(pg);
      const lanceur = await pg.evaluate(() => Array.from(document.querySelectorAll('[data-lancer="1"], #dr-lancer')).filter(e => e.offsetParent && /Lancer/.test(e.innerText || '')).map(e => e.innerText.trim().slice(0, 60)));
      verif('41', !lanceur.length, T + ' · 13 · 41 · l’Atelier ne lance plus (aucun « ▶ Lancer avec … » dans son Pilotage)', lanceur.join(' | '));
      verif('41', await texteVisible(pg, /Répétition : rien n.est écrit\. Une heure avec une classe se lance depuis l.emploi du temps\./), T + ' · 13 · 41 · la ligne de la répétition est là');
      await pg.evaluate(() => { try { atelierFermer(); } catch (e) {} try { closeProfPanel(); } catch (e) {} }); await p(pg, 900);
      /* la vue élève : aucun « ? » */
      await pg.evaluate(() => { try { basculerVue(); } catch (e) {} }); await p(pg, 1000); const bEl = await aideBouton(pg); await pg.evaluate(() => { try { basculerVue(); } catch (e) {} }); await p(pg, 1000);
      /* l'heure lancée par la case */
      const lance = await lancerParLaCase(pg); verif('41', lance, T + ' · l’heure se lance par la case de l’emploi du temps (« ▶ Ouvrir le pilotage et lancer »)');
      await dev(pg, 3); await p(pg, 300); await capt(pg, W, H, '41-la-classe-en-cours');
      const ecr = await pg.evaluate(() => { const v = e => e && e.offsetParent !== null && e.getBoundingClientRect().width > 0; return { onglets: Array.from(document.querySelectorAll('.at-onglet')).filter(v).map(e => e.innerText.trim()), sorties: Array.from(document.querySelectorAll('button, a, [onclick]')).filter(v).filter(e => /Fermer l.atelier|✕ Fermer|Mes chapitres/.test(e.innerText || '')).map(e => e.innerText.trim().slice(0, 30)), nouvel: !!Array.from(document.querySelectorAll('button, a')).find(e => v(e) && /Le site dans un nouvel onglet/.test(e.innerText || '')) }; });
      verif('41', !ecr.onglets.some(x => /Structure|Atelier/.test(x)), T + ' · 13 · 41 · la classe en cours : ni Structure, ni Atelier', ecr.onglets.join(' · '));
      verif('41', !ecr.sorties.length, T + ' · 13 · 41 · aucune sortie tant que l’heure n’est pas close', ecr.sorties.join(' | '));
      verif('41', ecr.nouvel, T + ' · 13 · 41 · « ↗ Le site dans un nouvel onglet » est là');
      if (ecr.nouvel) { let pop = null; try { [pop] = await Promise.all([pg.context().waitForEvent('page', { timeout: 5000 }), pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button, a')).find(e => e.offsetParent && /Le site dans un nouvel onglet/.test(e.innerText || '')); b.click(); })]); await pop.waitForLoadState(); await p(pop, 2500); } catch (e) { pop = null; }
        const pe = pop ? await pop.evaluate(() => ({ mur: !!(document.getElementById('mur') && document.getElementById('mur').getBoundingClientRect().height > 0), lancee: !!(window.S && S.lancee) })) : null;
        verif('41', pop && !pe.mur && !pe.lancee, T + ' · 13 · 41 · « ↗ » ouvre un onglet du site qui n’est pas l’écran de l’heure', pe ? JSON.stringify(pe) : 'pas d’onglet'); if (pop) await pop.close().catch(() => {}); }
      /* 13 · 43 sur l'heure lancée */
      { const b = await aideBouton(pg); aides.push({ nom: 'heure-lancee', b, texte: b ? await lireVolet(pg, b) : null }); }
      /* 13 · 40 : « Fin de l'heure », la liste */
      await pg.click('#bfin').catch(() => {}); await p(pg, 1000); { const b = await aideBouton(pg); aides.push({ nom: 'fin-de-l-heure', b, texte: b ? await lireVolet(pg, b) : null }); }
      let L2 = await liste2(pg); await capt(pg, W, H, '40-fin-de-l-heure-liste');
      verif('40', /2 · ce qui n.a pas été fait — \d+ activités : dis ce que chacune devient|2 · ce qui n.a pas été fait — 1 activité : dis ce qu.elle devient/.test(L2.l2), T + ' · 13 · 40 · la liste : « 2 · ce qui n’a pas été fait — N activités : dis ce que chacune devient »', '« ' + L2.l2 + ' »');
      const nAct = +((/— (\d+) activités?/.exec(L2.l2) || [])[1] || (/\((\d+) à décider\)/.exec(L2.l2) || [])[1] || 0);
      await allerEtape(pg, 2);
      verif('40', await texteVisible(pg, /À l.heure suivante \(si tu ne choisis rien\)/), T + ' · 13 · 40 · le choix par défaut se lit « À l’heure suivante (si tu ne choisis rien) »');
      const choisir = k => pg.evaluate(k => { const bs = Array.from(document.querySelectorAll('#fin button, .pp button')).filter(b => b.offsetParent && /^Non fait$/.test(b.innerText.trim())); bs.slice(0, k).forEach(b => b.click()); return bs.length; }, k);
      const nCartes = await choisir(3); await p(pg, 800); L2 = await liste2(pg);
      verif('40', nAct > 3 && new RegExp('encore ' + (nAct - 3) + ' activités? : dis ce que chacune devient|encore 1 activité : dis ce qu.elle devient').test(L2.l2), T + ' · 13 · 40 · trois choix → « encore ' + (nAct - 3) + ' »', '« ' + L2.l2 + ' » (' + nCartes + ' cartes)');
      await choisir(99); await p(pg, 800); L2 = await liste2(pg);
      verif('40', /— tout est décidé/.test(L2.l2), T + ' · 13 · 40 · tout choisi → « tout est décidé »', '« ' + L2.l2 + ' »');
      verif('40', !(await pg.evaluate(() => /à décider/.test((document.getElementById('dr-zone') || document.body).innerText))), T + ' · 13 · 40 · plus aucun « à décider » dans le pilote');
      /* revenir au cours, puis Fin de l'heure à l'étape 2 ouverte : l'état à retrouver */
      await revenirCours(pg); await p(pg, 600); await dev(pg, 1); const dAv = await lire(pg); const chronoAv = await pg.evaluate(() => (document.getElementById('chrono') || document.querySelector('.chrono') || {}).textContent || '');
      await allerEtape(pg, 2); const etAv = await finEtape(pg);
      /* 13 · 41 (c) : la garde beforeunload posée pendant l'heure */
      const posee = await pg.evaluate(() => { const ev = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(ev); return ev.defaultPrevented || (ev.returnValue !== undefined && ev.returnValue !== true && ev.returnValue !== ''); });
      verif('41', posee, T + ' · 13 · 41 · la garde beforeunload est posée pendant l’heure (preventDefault / returnValue)');
      /* (d) deux onglets d'un même navigateur */
      pb = await pg.context().newPage(); await pb.clock.setFixedTime(HORLOGE); await entrerProf(pb); await pb.evaluate(() => { try { edtFermer(); } catch (e) {} }); await p(pb, 2500);
      const bandeau = q => q.evaluate(() => { const v = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 1 && r.height > 1 && c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0; }; const e = Array.from(document.querySelectorAll('body *')).find(x => x.children.length < 8 && /Heure en cours avec les /.test(x.innerText || '') && /Reprendre/.test(x.innerText || '') && v(x)); return e ? { texte: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 90), plusTard: /Plus tard/.test(e.innerText) } : null; });
      verif('41', !(await bandeau(pb)), T + ' · 13 · 41 · tant que l’onglet de l’heure vit, l’autre onglet ne montre rien');
      const t0 = Date.now(); pg.__beforeunload = 0; await pg.close({ runBeforeUnload: true }).catch(() => {}); let bd = null, dt = 0; for (let i = 0; i < 40 && !bd; i++) { await p(pb, 100); bd = await bandeau(pb); dt = Date.now() - t0; }
      verif('41', (pg.__beforeunload || 0) > 0, T + ' · 13 · 41 · fermer l’onglet de l’heure lève la garde du navigateur', 'boîtes beforeunload : ' + (pg.__beforeunload || 0));
      verif('41', !!bd && dt <= 1000, T + ' · 13 · 41 · le bandeau « Heure en cours avec les … — Reprendre » paraît dans l’autre onglet en moins d’une seconde', bd ? '« ' + bd.texte + ' » en ' + dt + ' ms' : 'absent après ' + dt + ' ms');
      if (bd) { verif('41', !bd.plusTard && /Heure en cours avec les 3E Charles de Gaulle/.test(bd.texte), T + ' · 13 · 41 · le bandeau nomme la classe, un seul bouton (« Plus tard » tombé)', '« ' + bd.texte + ' »'); await capt(pb, W, H, '41-bandeau-reprendre');
        /* L' bandeau montré : il ne cache rien, sur l'accueil, la page du niveau, l'emploi du temps */
        const kb = []; for (const [nom, g] of [['accueil', async () => {}], ['page du niveau', async () => { await pb.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pb, 500); await pb.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pb, 1200); }], ['emploi du temps', async () => { await pb.evaluate(() => { try { goHome(); } catch (e) {} try { edtOuvrir(); } catch (e) {} }); await p(pb, 1500); }]]) { await g(); if (!(await marquer(pb, 'bandeau'))) { kb.push(nom + ' : le bandeau n’y est plus'); continue; } const k = await balayer(pb, true); if (k && k.length) kb.push(nom + ' : ' + k.slice(0, 3).join(', ')); const ch = await chevauche(pb); if (ch.length) kb.push(nom + ' : flottants l’un sur l’autre — ' + ch.slice(0, 2).join(' ; ')); }
        verif('L', !kb.length, T + ' · L′ · le bandeau montré ne cache rien, page en haut (c’est une barre : ce qui défile dessous revient en haut), et ne pousse aucun bouton fixe sur un autre (accueil, page du niveau, emploi du temps)', kb.join(' ; ')); await pb.evaluate(() => { try { edtFermer(); } catch (e) {} try { goHome(); } catch (e) {} }); await p(pb, 1500);
        verif('41', !!(await bandeau(pb)), T + ' · 13 · 41 (d) · le bandeau est toujours là après l’accueil, la page du niveau et l’emploi du temps (« sur tous les écrans »)'); }
      /* « Reprendre » → l'endroit exact */
      if (bd) { await pb.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /^Reprendre$/.test(b.innerText.trim())) || Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Reprendre/.test(b.innerText)); if (b) b.click(); }); await p(pb, 4000); await sansVoiles(pb); await pb.keyboard.press('Escape').catch(() => {}); await p(pb, 300); if (CAPT) await pb.screenshot({ path: path.join(CAPT, W + 'x' + H + '-41-apres-reprendre-' + SUFF + '.png') }).catch(() => {});
        const etAp = await finEtape(pb); verif('41', etAp === etAv, T + ' · 13 · 41 · « Reprendre » rouvre « Fin de l’heure » à son étape', 'avant ' + etAv + ', après ' + etAp);
        await revenirCours(pb); await p(pb, 800); const dAp = await lire(pb); const chronoAp = await pb.evaluate(() => (document.getElementById('chrono') || document.querySelector('.chrono') || {}).textContent || '');
        verif('41', pareil(dAv, dAp), T + ' · 13 · 41 · « Reprendre » → la même diapo, la même page, les mêmes lignes dévoilées', dD(dAv) + ' → ' + dD(dAp));
        const mmss = t => { const m = /(\d+):(\d\d)/.exec(t || ''); return m ? (+m[1]) * 60 + (+m[2]) : -1; };
        verif('41', mmss(chronoAp) >= 0 && mmss(chronoAp) >= mmss(chronoAv), T + ' · 13 · 41 · le chrono continue (jamais moins qu’à la fermeture de l’onglet : pas de remise à zéro)', '« ' + chronoAv.slice(0, 5) + ' » à la fermeture → « ' + chronoAp.slice(0, 5) + ' » à la reprise');
        /* après « Clore » : la garde retirée, aucun bandeau, « ✕ Fermer » → l'emploi du temps */
        const close = await clore(pb, '2026-09-14T09:47:30+02:00'); verif('41', close, T + ' · l’heure se clôt');
        const retiree = await pb.evaluate(() => { const ev = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(ev); return !(ev.defaultPrevented || (ev.returnValue !== undefined && ev.returnValue !== true && ev.returnValue !== '')); });
        verif('41', retiree, T + ' · 13 · 41 · après « Clore », la garde beforeunload est retirée');
        await capt(pb, W, H, '41-apres-clore'); { const b = await aideBouton(pb); aides.push({ nom: 'apres-clore', b, texte: b ? await lireVolet(pb, b) : null }); }
        const pc = await pb.context().newPage(); await pc.clock.setFixedTime(new Date('2026-09-14T09:48:00+02:00')); await entrerProf(pc); await pc.evaluate(() => { try { edtFermer(); } catch (e) {} }); await p(pc, 6000);
        verif('41', !(await bandeau(pc)), T + ' · 13 · 41 · après « Clore », aucun bandeau'); await pc.close().catch(() => {});
        const fermer = await pb.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /✕ Fermer$|^✕ Fermer/.test(b.innerText.trim()) && !/atelier/i.test(b.innerText)); if (!b) return false; b.click(); return true; }); await p(pb, 1500);
        verif('41', fermer && await edtOuvert(pb), T + ' · 13 · 41 · après « Clore », « ✕ Fermer » ramène à l’emploi du temps'); }
      /* 13 · 43 : le bilan du « ? » sur tous ces écrans */
      const sans = aides.filter(a => !a.b).map(a => a.nom); verif('43', !sans.length, T + ' · 13 · 43 · un « ? » sur chaque écran du prof (' + aides.length + ' écrans)', sans.length ? 'absent : ' + sans.slice(0, 8).join(', ') + (sans.length > 8 ? '…' : '') : '');
      const av = aides.filter(a => a.b); const ref = av[0] && av[0].b; const ailleurs = av.filter(a => Math.abs(a.b.x - ref.x) > 2 || Math.abs(a.b.y - ref.y) > 2).map(a => a.nom + ' (' + a.b.x + ',' + a.b.y + ')');
      if (av.length) verif('43', !ailleurs.length, T + ' · 13 · 43 · au même endroit partout', ref ? 'référence ' + ref.x + ',' + ref.y + (ailleurs.length ? ' ; ailleurs : ' + ailleurs.slice(0, 5).join(', ') : '') : '');
      const dessous = av.filter(a => !a.b.libre).map(a => a.nom + ' sous ' + a.b.dessus); if (av.length) verif('43', !dessous.length, T + ' · 13 · 43 · rien par-dessus le « ? »', dessous.slice(0, 4).join(', '));
      verif('43', !bEl, T + ' · 13 · 43 · aucun « ? » dans la vue élève');
      /* le texte du volet, mot pour mot (MANDATS/CINQ-DETTES/AIDE-PAR-ECRAN.md) */
      if (BLOCS) { const manq = [], sansCle = []; aides.filter(a => a.b).forEach(a => { const cle = CLES[a.nom]; /* contrôle n°63 (b) : après « Clore », le « ? » montre classe-close, quel que soit l'onglet */ const bl = cle && BLOCS[cle]; if (!bl) { sansCle.push(a.nom); return; } const t = norm(a.texte || ''); const absentes = bl.filter(l => t.indexOf(l) < 0); const filAbs = (BLOCS.fil || []).filter(l => t.indexOf(l) < 0); if (absentes.length || filAbs.length) manq.push(a.nom + ' (' + cle + ') : ' + (absentes.concat(filAbs.map(x => '[fil] ' + x))[0] || '').slice(0, 110) + (absentes.length + filAbs.length ? ' / volet : « ' + norm(a.texte || '').slice(0, 160) + ' »' : '') + (absentes.length + filAbs.length > 1 ? ' … +' + (absentes.length + filAbs.length - 1) : '')); });
        if (aides.some(a => a.b)) verif('43', !manq.length, T + ' · 13 · 43 · le volet de chaque écran montre son texte mot pour mot, et le fil', manq.slice(0, 4).join(' ; '));
        if (sansCle.length) info('43', T + ' · écrans sans clé dans le fichier : ' + sansCle.join(', ')); }
    } catch (e) { verif('41', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (40, 41, 43)', o.errs.slice(0, 3).join(' ; ')); if (o.boites.length) info('Z', T + ' · boîtes : ' + o.boites.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 13 · 43 : le volet (clic, touche, Échap, champ) et la fenêtre du tableau ; L' : volet ouvert ── */
  if (fait('43')) { const o = await ouvrirCtx(W, H); const pg = o.pg;
    try { await entrerProf(pg); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} }); await p(pg, 500);
      const b = await aideBouton(pg);
      if (b) { await pg.mouse.click(b.x + b.w / 2, b.y + 5); await p(pg, 600); const v1 = await volet(pg); verif('43', !!v1, T + ' · 13 · 43 · le clic sur « ? » ouvre le volet à droite, toute la hauteur', v1 ? v1.larg + ' px · « ' + v1.texte.slice(0, 60) + ' »' : 'pas de volet');
        await capt(pg, W, H, '43-volet-aide-accueil');
        /* L' volet ouvert : il ne cache rien (la page lui laisse sa place), sur l'accueil, la page du niveau, l'emploi du temps — le volet suit l'écran */
        if (v1) { const kv = []; for (const [nom, g] of [['accueil', async () => {}], ['page du niveau', async () => { await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 500); await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 1200); }], ['emploi du temps', async () => { await pg.evaluate(() => { try { goHome(); } catch (e) {} try { edtOuvrir(); } catch (e) {} }); await p(pg, 1500); }]]) { await g(); if (!(await marquer(pg, 'volet'))) { kv.push(nom + ' : le volet n’y est plus'); continue; } const k = await balayer(pg); if (k && k.length) kv.push(nom + ' : ' + k.slice(0, 3).join(', ')); const ch = await chevauche(pg); if (ch.length) kv.push(nom + ' : flottants l’un sur l’autre — ' + ch.slice(0, 2).join(' ; ')); }
          verif('L', !kv.length, T + ' · L′ · le volet d’aide ouvert ne cache rien (accueil, page du niveau, emploi du temps, défilés)', kv.join(' ; ')); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} try { goHome(); } catch (e) {} }); await p(pg, 600); if (!(await volet(pg))) { const b2 = await aideBouton(pg); if (b2) { await pg.mouse.click(b2.x + b2.w / 2, b2.y + 5); await p(pg, 500); } } }
        await pg.keyboard.press('Escape'); await p(pg, 400); verif('43', !(await volet(pg)), T + ' · 13 · 43 · Échap le ferme');
        await pg.keyboard.type('?'); await p(pg, 500); const v2 = await volet(pg); verif('43', !!v2, T + ' · 13 · 43 · la touche « ? » l’ouvre');
        await pg.keyboard.type('?'); await p(pg, 400); verif('43', !(await volet(pg)), T + ' · 13 · 43 · la touche « ? » le ferme');
        const champ = await pg.evaluate(() => { const i = Array.from(document.querySelectorAll('input[type=text], input[type=search], input:not([type]), textarea')).find(e => e.offsetParent); if (!i) return false; i.value = ''; i.focus(); return true; });
        if (champ) { await pg.keyboard.type('?'); await p(pg, 400); const val = await pg.evaluate(() => document.activeElement && document.activeElement.value); verif('43', /\?/.test(val || '') && !(await volet(pg)), T + ' · 13 · 43 · dans un champ, « ? » s’écrit (le volet ne s’ouvre pas)', '« ' + val + ' »'); }
      } else verif('43', false, T + ' · 13 · 43 · le « ? » est sur l’accueil du prof');
      /* la fenêtre du tableau : aucun « ? » */
      const lance = await lancerParLaCase(pg); if (lance) { let fen = null; try { [fen] = await Promise.all([pg.waitForEvent('popup', { timeout: 6000 }), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await p(fen, 2500); } catch (e) { fen = null; }
        if (fen) { verif('43', !(await aideBouton(fen)), T + ' · 13 · 43 · aucun « ? » dans la fenêtre du tableau'); await fen.keyboard.type('?'); await p(fen, 400); verif('43', !(await volet(fen)), T + ' · 13 · 43 · la touche « ? » ne fait rien dans la fenêtre du tableau'); await fen.close().catch(() => {}); } }
    } catch (e) { verif('43', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (43)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 46 (§12.28 (8) ; réglée par §12.29 (2)) : plus de garde « Aller au cahier » ; un seul compte de ce qui reste, celui de l'étape 2 ── */
  if (fait('46')) { const o = await ouvrirCtx(W, H); const pg = o.pg;
    try { await entrerProf(pg); const lance = await lancerParLaCase(pg); verif('46', lance, T + ' · l’heure se lance par la case (séance aux diapos sans numéro d’activité — toutes celles du faux hub)');
      await dev(pg, 3); await p(pg, 400);
      /* le compte de l'étape 2 d'abord (la séquence ouverte puis repliée), puis la diapo de fin */
      await pg.click('#bfin').catch(() => {}); await p(pg, 1200); const L = await liste2(pg); await revenirCours(pg); await p(pg, 800);
      const iFin = await pg.evaluate(() => { try { const E = seance().ecrans; for (let i = E.length - 1; i >= 0; i--) if (E[i] && E[i].role === 'fin' && ordreHeure(S.heure).includes(i)) return i; for (let i = E.length - 1; i >= 0; i--) if (E[i] && E[i].role === 'fin') return i; } catch (e) {} return -1; });
      const vg = iFin >= 0 && await pg.evaluate(i => { const v = document.querySelector('.vig[data-i="' + i + '"]'); if (!v) return false; v.click(); return true; }, iFin); await p(pg, 1200);
      const g = await pg.evaluate(() => { const e = document.getElementById('garde-cahier'); return e && e.classList.contains('on') && e.getBoundingClientRect().height > 0 ? e.innerText.replace(/\s+/g, ' ').trim() : null; });
      await capt(pg, W, H, '46-vers-la-diapo-de-fin');
      verif('46', vg && g == null, T + ' · 13 · 46 / §12.29 (2) · plus de garde « Aller au cahier » (aller à la diapo de fin n’ouvre plus de garde)', vg ? (g ? '« ' + g.slice(0, 110) + ' »' : '') : 'pas de vignette de fin (' + iFin + ')');
      const tx = await pg.evaluate(() => document.body.innerText); verif('46', !/Aucune activité restante prévue pour cette heure|tu es à l.heure\. Tout a été fait/.test(tx), T + ' · 13 · 46 · nulle part « Aucune activité restante… tu es à l’heure » pendant qu’il reste des activités');
      const nE = /— rien/.test(L.l2) ? 0 : +((/— (?:encore )?(\d+) activités?/.exec(L.l2) || [])[1] || -1);
      verif('46', nE > 0, T + ' · 13 · 46 · le seul compte, celui de l’étape 2', '« ' + L.l2.slice(0, 90) + ' »');
    } catch (e) { verif('46', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (46)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 29 (§12.29, S1-S5, les images T200) : la répétition, l'entête, T-5, « ❄ Préparer le cahier », « Montrer le cahier à la classe », « Retour au cours », « Plus tard », la case d'une heure en cours ── */
  if (fait('29')) { const o = await ouvrirCtx(W, H); const pg = o.pg;
    const boutons = (q, sel) => q.evaluate(s => Array.from(document.querySelectorAll(s)).filter(b => b.offsetParent && b.getBoundingClientRect().width > 0).map(b => (b.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean), sel);
    const forme = q => q.evaluate(() => { const r = sel => { const e = document.querySelector(sel); if (!e || !e.offsetParent) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; }; return { volet: r('#volet'), mur: r('#mur'), notes: r('#notesd') }; });
    const memeForme = (a, b) => ['volet', 'mur', 'notes'].every(k => !a[k] || (b[k] && a[k].every((v, i) => Math.abs(v - b[k][i]) <= 2)));
    try { await pg.clock.setFixedTime(new Date('2026-09-14T08:50:00+02:00')); await entrerProf(pg); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} });
      /* S5 — la répétition dans l'Atelier */
      await pg.evaluate(() => atelierOuvrir()); await p(pg, 1200); await sansVoiles(pg); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900); if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(pg, 1800); await sansVoiles(pg);
      await entrerRepetition(pg); await capt(pg, W, H, '29-4-la-repetition');
      const rep = await pg.evaluate(() => { const v = e => e && e.offsetParent !== null && e.getBoundingClientRect().width > 0; const t = Array.from(document.querySelectorAll('button')).filter(v).map(b => b.innerText.trim()); const part = Array.from(document.querySelectorAll('#dr-zone *')).filter(e => v(e) && e.children.length < 3 && /^Participation/i.test((e.innerText || '').trim())).length; return { fin: t.some(x => /Fin de l.heure/.test(x)), clore: t.some(x => /Clore l.heure/.test(x)), qui: v(document.getElementById('bqui')) || t.some(x => /^👥/.test(x)), part, tableau: t.some(x => /Ouvrir le tableau/.test(x)), ligne: /Répétition : rien n.est écrit\. Une heure avec une classe se lance depuis l.emploi du temps\./.test(document.body.innerText) }; });
      verif('29', !rep.fin && !rep.clore && !rep.qui && !rep.part, T + ' · S5 · la répétition : ni « Fin de l’heure », ni « ■ Clore l’heure », ni 👥, ni « Participation »', JSON.stringify(rep));
      verif('29', rep.ligne && rep.tableau, T + ' · S5 · la ligne de la répétition, et « 🖥 Ouvrir le tableau » reste', JSON.stringify({ ligne: rep.ligne, tableau: rep.tableau }));
      await pg.evaluate(() => { try { atelierFermer(); } catch (e) {} try { closeProfPanel(); } catch (e) {} }); await p(pg, 900);
      /* S4 — l'entête de l'heure lancée par la case */
      await pg.clock.setFixedTime(new Date('2026-09-14T08:58:00+02:00')); const lance = await lancerParLaCase(pg); verif('29', lance, T + ' · l’heure se lance par la case');
      await dev(pg, 3); await p(pg, 400); await capt(pg, W, H, '29-3-l-heure-lancee');
      const tete = await boutons(pg, '#dr-zone .haut button, #dr-zone .haut [onclick]');
      verif('29', tete.some(x => /🖥 Ouvrir le tableau/.test(x)) && tete.some(x => /⧉ Ce que voit la classe/.test(x)) && !tete.some(x => /Écran 2|^⧉ Tableau$/.test(x)), T + ' · S4 · l’entête : « 🖥 Ouvrir le tableau », « ⧉ Ce que voit la classe »', tete.join(' | ').slice(0, 200));
      verif('29', tete.some(x => /Fin de l.heure/.test(x)) && tete.some(x => /Clore l.heure/.test(x)), T + ' · S2 · « Fin de l’heure » et « ■ Clore l’heure » restent dans l’entête');
      /* S1 — T-5 : une seule chose s'ouvre, le palier en tête */
      await pg.clock.setFixedTime(new Date('2026-09-14T09:42:20+02:00')); await p(pg, 3500); await capt(pg, W, H, '29-1-T-5');
      const t5 = await pg.evaluate(() => { const v = e => e && e.offsetParent !== null && e.getBoundingClientRect().height > 0; return { barre: v(document.getElementById('al-boite')) || v(document.getElementById('al-ligne')), tete: ((document.querySelector('.pp-tete') || {}).innerText || '').replace(/\s+/g, ' ').trim(), seq: v(document.querySelector('.pp-tete')) }; });
      verif('29', !t5.barre, T + ' · S1 · à T-5, la barre du bas ne s’ouvre pas');
      verif('29', t5.seq && /^T-5 — le cahier de textes dans 5 minutes · Fin de l.heure — étape \d sur 7/.test(t5.tete), T + ' · S1 · la séquence ouverte, le palier en tête', '« ' + t5.tete.slice(0, 120) + ' »');
      const b1 = await boutons(pg, '.pp-tete button'); verif('29', b1.length <= 2 && b1.some(x => /❄ Préparer le cahier/.test(x)) && b1.some(x => /^Plus tard$/.test(x)), T + ' · S2 · la tête : « ❄ Préparer le cahier » et « Plus tard »', b1.join(' | '));
      /* S2 / S3 — préparer : l'écran garde sa forme */
      const f0 = await forme(pg); await clicTexte(pg, '.pp-tete button', 'Préparer le cahier'); await p(pg, 2200); await capt(pg, W, H, '29-2-preparer-le-cahier');
      const f1 = await forme(pg); verif('29', memeForme(f0, f1), T + ' · S3 · en préparation, la colonne des diapos, la diapo et les notes gardent leur place et leur taille', JSON.stringify(f0) + ' → ' + JSON.stringify(f1));
      const b2 = await boutons(pg, '.pp-tete button'); verif('29', b2.length <= 2 && b2.some(x => /Montrer le cahier à la classe/.test(x)) && b2.some(x => /^Retour au cours$/.test(x)), T + ' · S2 · en préparation : « Montrer le cahier à la classe » et « Retour au cours »', b2.join(' | '));
      await clicTexte(pg, '.pp-tete button', 'Retour au cours'); await p(pg, 1500); const f2 = await forme(pg); const b3 = await boutons(pg, '.pp-tete button');
      const prep = await pg.evaluate(() => !!(window.S && S.preparation));
      verif('29', memeForme(f0, f2) && !prep && (!b3.length || b3.some(x => /❄ Préparer le cahier/.test(x))), T + ' · S2 · « Retour au cours » : la préparation se ferme, l’écran d’avant (la séquence repliée, ou sa tête « ❄ Préparer le cahier » / « Plus tard »)', (b3.join(' | ') || 'séquence repliée') + ' ; préparation ' + prep);
      if (!(await vis(pg, '.pp-tete'))) { await pg.click('#bfin').catch(() => {}); await p(pg, 1000); }
      await clicTexte(pg, '.pp-tete button', 'Préparer le cahier'); await p(pg, 2000); await clicTexte(pg, '.pp-tete button', 'Montrer le cahier à la classe'); await p(pg, 2000);
      const mo = await pg.evaluate(() => { try { const E = seance().ecrans; const e = E[S.di]; const o = ordreHeure(S.heure); return { di: S.di, role: e && e.role, gel: !!S.gel, finDansLHeure: o.filter(k => E[k] && E[k].role === 'fin'), finsDeLaSeance: E.map((x, k) => x && x.role === 'fin' ? k : -1).filter(k => k >= 0), heure: S.heure }; } catch (x) { return { err: x.message }; } });
      verif('29', mo && mo.role === 'fin' && !mo.gel, T + ' · S2 · « Montrer le cahier à la classe » : la classe passe sur la diapo du cahier de textes, le tableau n’est pas gelé', JSON.stringify(mo));
      await clicTexte(pg, '.pp-tete button', 'Retour au cours'); await p(pg, 1200);
      if (!(await vis(pg, '.pp-tete'))) { await pg.click('#bfin').catch(() => {}); await p(pg, 1000); }
      await clicTexte(pg, '.pp-tete button', 'Plus tard'); await p(pg, 1200); verif('29', !(await vis(pg, '.pp-tete')) && await pg.evaluate(() => !!(S.lancee && !S.close)), T + ' · S2 · « Plus tard » : la séquence se replie, la classe continue');
      /* contrôle n°64 : « Plus tard » puis le palier suivant rouvre la séquence (T-3 à 09:44:20) */
      await pg.clock.setFixedTime(new Date('2026-09-14T09:44:20+02:00')); await p(pg, 3500); const t3 = await pg.evaluate(() => { const e = document.querySelector('.pp-tete'); return e && e.offsetParent ? (e.innerText || '').replace(/\s+/g, ' ').trim() : null; });
      verif('29', !!t3 && /^T-3/.test(t3), T + ' · S1 · après « Plus tard », le palier suivant (T-3) rouvre la séquence, le palier en tête', t3 ? '« ' + t3.slice(0, 100) + ' »' : 'séquence fermée');
      const ch = await chevauche(pg); verif('29', !ch.length, T + ' · L · rien de flottant l’un sur l’autre dans l’écran de la classe', ch.join(' ; '));
      /* S4 — la case d'une heure en cours */
      const ou = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button, a')).find(e => e.offsetParent && /Le site dans un nouvel onglet/.test(e.innerText || '')); return !!b; });
      const pc = await pg.context().newPage(); await pc.clock.setFixedTime(new Date('2026-09-14T09:45:00+02:00'));   /* la même heure que l'onglet de l'heure (09:44:20) ou après : un onglet ne vit pas avant l'autre */ await entrerProf(pc); if (!(await edtOuvert(pc))) { await pc.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pc, 1800); }
      /* la case relue toutes les 500 ms jusqu'à 8 s après l'arrivée sur l'emploi du temps : ce qu'elle dit d'abord, et quand elle dit « ▶ Reprendre l'heure » */
      const t0c = Date.now(); let bc = [], dtc = -1, premier = null;
      for (let k = 0; k < 16; k++) { await pc.evaluate(() => { const cs = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => e.offsetParent && /Charles/.test(e.innerText)); const c = cs.find(e => /2026-09-14/.test(e.getAttribute('onclick') || '')) || cs.find(e => /heure 1\//.test(e.innerText)) || cs[0]; if (c) c.click(); }); await p(pc, 400);
        bc = await boutons(pc, 'button'); if (premier == null) premier = bc.filter(x => /Reprendre|lancer/.test(x)).join(' | '); if (bc.some(x => /▶ Reprendre l.heure/.test(x))) { dtc = Date.now() - t0c; break; } await pc.keyboard.press('Escape'); await p(pc, 300); }
      await capt(pc, W, H, '29-5-la-case-d-une-heure-en-cours');
      verif('29', dtc >= 0 && dtc <= 3000 && !bc.some(x => /Reprendre le cours/.test(x)), T + ' · S4 · la case d’une heure en cours : « ▶ Reprendre l’heure » (en moins de 3 s après l’arrivée sur l’emploi du temps)', (dtc >= 0 ? 'en ' + dtc + ' ms' : 'jamais en 8 s') + ' ; d’abord : « ' + premier + ' »'); await pc.close().catch(() => {});
    } catch (e) { verif('29', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (29)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 30 (§12.30) : la phrase de l'activité en cours, sous la tête de la séquence, aux paliers ── */
  if (fait('30')) { const o = await ouvrirCtx(W, H); const pg = o.pg;
    /* la ligne : un élément de la séquence (hors de .pp-tete) dont le texte commence par « L'activité en cours : » ; la référence mot pour mot : la phrase d'alerteTexte (la ③) tant qu'elle existe */
    const ligne = () => pg.evaluate(() => { const v = e => e && e.offsetParent !== null && e.getBoundingClientRect().height > 0; const c = Array.from(document.querySelectorAll('#fin *, #prep *, .pp *')).filter(e => v(e) && /^L.activité en cours :/.test((e.innerText || '').trim()) && !Array.from(e.children).some(k => /^L.activité en cours :/.test((k.innerText || '').trim()))); const e = c[0] || null;
      let ref = null; try { if (typeof alerteTexte === 'function') { const d = document.createElement('div'); d.innerHTML = alerteTexte(); const sp = d.querySelector('span'); ref = sp ? sp.textContent.replace(/\s+/g, ' ').trim() : null; if (ref) { const m = /^L.activité en cours : .*?, (dans les temps|il te reste peu de temps|tu dépasses · \+\d+ min|terminée|faite à l.oral)\./.exec(ref); ref = m ? m[0] : ref; } /* la phrase seule : celle qui la suivait dans la barre attend le mot de Paul (§12.30 (3)) */ } } catch (x) {}
      if (!ref) ref = "L'activité en cours : Diapo 1 — Analyse d'images : la routine, dans les temps.";   /* alerteTexte tombée (E2, poussée 43) : la phrase que la ③ disait dans ce même geste, relevée sur l'assemblé de la production (retour 65) */
      const r = e ? e.getBoundingClientRect() : null; const t = document.querySelector('.pp-tete'); const tr = t ? t.getBoundingClientRect() : null;
      return e ? { texte: e.innerText.replace(/\s+/g, ' ').trim(), ref, sous: !!(tr && r.top >= tr.bottom - 2), entiere: r.right <= innerWidth && e.scrollWidth <= e.clientWidth + 1 } : { texte: null, ref }; });
    const RE = /^L.activité en cours : (Activité|Diapo) \d+ — .+, (dans les temps|il te reste peu de temps|tu dépasses · \+\d+ min|terminée|faite à l.oral)\.$/;
    try { await pg.clock.setFixedTime(new Date('2026-09-14T09:41:00+02:00')); await entrerProf(pg); const lance = await lancerParLaCase(pg); verif('30', lance, T + ' · l’heure se lance par la case (09:41)');
      await dev(pg, 2); await p(pg, 400);
      await pg.clock.setFixedTime(new Date('2026-09-14T09:42:20+02:00')); await p(pg, 3500); await capt(pg, W, H, '30-1-T-5-la-phrase');
      const l1 = await ligne();
      verif('30', !!l1.texte && RE.test(l1.texte) && (!l1.ref || l1.texte.replace(/’/g, "'") === l1.ref.replace(/’/g, "'")), T + ' · à T-5, la phrase de l’activité en cours, mot pour mot', '« ' + (l1.texte || 'absente') + ' »' + (l1.ref ? ' ; la ③ : « ' + l1.ref + ' »' : ''));
      verif('30', !!l1.texte && l1.sous && l1.entiere, T + ' · sous la tête de la séquence, entière', JSON.stringify({ sous: l1.sous, entiere: l1.entiere }));
      /* le focus d'un champ de l'étape 1, et la séquence pas redessinée, quand la minute passe et que l'état change */
      const champ = await pg.evaluate(() => { const f = Array.from(document.querySelectorAll('#fin input, #fin select, #fin textarea')).find(e => e.offsetParent && !e.disabled); if (!f) return null; f.focus(); const s = document.querySelector('#fin .pp-tete') || document.querySelector('.pp-tete'); if (s) s.setAttribute('data-e3-tete', '1'); const z = document.getElementById('fin'); if (z) z.setAttribute('data-e3-fin', '1'); return f.tagName + (f.id ? '#' + f.id : ''); });
      await pg.clock.setFixedTime(new Date('2026-09-14T09:46:30+02:00')); await p(pg, 3500); await capt(pg, W, H, '30-2-tu-depasses');
      const l2 = await ligne(); const apres = await pg.evaluate(() => ({ actif: document.activeElement ? document.activeElement.tagName + (document.activeElement.id ? '#' + document.activeElement.id : '') : null, tete: !!document.querySelector('[data-e3-tete]'), fin: !!document.querySelector('[data-e3-fin]') }));
      verif('30', !!l2.texte && /tu dépasses · \+\d+ min\.$/.test(l2.texte) && l2.texte !== l1.texte, T + ' · l’heure avance au-delà du prévu : « tu dépasses · +n min »', '« ' + (l1.texte || '') + ' » → « ' + (l2.texte || 'absente') + ' »');
      verif('30', apres.fin, T + ' · la séquence n’est pas redessinée (la ligne et la tête changent, pas la séquence)', JSON.stringify(apres));
      if (champ) verif('30', apres.actif === champ, T + ' · le champ de l’étape 1 garde son focus', champ + ' → ' + apres.actif); else info('30', T + ' · pas de champ visible à l’étape 1 pour mesurer le focus');
      /* en préparation aussi (§12.30 (1)) : « ❄ Préparer le cahier » → la phrase reste, celle de la diapo gelée ; puis « Retour au cours » */
      const prep = await clicTexte(pg, 'button', 'Préparer le cahier'); await p(pg, 2500); const lp = await ligne(); await capt(pg, W, H, '30-3-en-preparation');
      verif('30', prep && !!lp.texte && RE.test(lp.texte) && lp.sous, T + ' · en préparation (« ❄ Préparer le cahier »), la phrase reste sous la tête', JSON.stringify({ bouton: prep, texte: lp.texte, sous: lp.sous }));
      if (prep) { await clicTexte(pg, 'button', 'Retour au cours'); await p(pg, 1200); }
      /* après « Clore l'heure » : rien */
      const close = await clore(pg, '2026-09-14T09:48:00+02:00'); const l3 = await ligne(); verif('30', close && !l3.texte, T + ' · après « Clore l’heure », plus de phrase', l3.texte || '');
      /* en répétition : rien */
      const pr = await pg.context().newPage(); await pr.clock.setFixedTime(new Date('2026-09-14T09:42:20+02:00')); await entrerProf(pr); await pr.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(pr, 1200); await sansVoiles(pr);
      await clicTexte(pr, 'button,[onclick]', "atOnglet('chapitres')"); await p(pr, 900); if (!(await clicTexte(pr, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pr, 'button,[onclick]', 'Modifier'); await p(pr, 1800); await sansVoiles(pr);
      await entrerRepetition(pr); await dev(pr, 2); await p(pr, 3000);
      const rep = await pr.evaluate(() => /L.activité en cours :/.test(document.body.innerText)); verif('30', !rep, T + ' · en répétition, pas de phrase'); await pr.close().catch(() => {});
    } catch (e) { verif('30', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (30)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── R (contrôle n°62) : une répétition jouée dans un autre onglet ne touche pas la fenêtre du tableau de la classe ── */
  if (fait('R')) { const o = await ouvrirCtx(W, H); const pg = o.pg;
    try { await entrerProf(pg); const lance = await lancerParLaCase(pg); verif('R', lance, T + ' · l’heure se lance par la case');
      let fen = null; try { [fen] = await Promise.all([pg.waitForEvent('popup', { timeout: 6000 }), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await p(fen, 2000); } catch (e) { fen = null; }
      await dev(pg, 3); await p(pg, 1200);
      const murT = q => q.evaluate(() => { const m = document.getElementById('mur2') || document.querySelector('.mur.tableau'); if (!m) return null; const c = m.querySelector('.corpsd') || m; const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0'); return { page: ((m.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), act: ((m.querySelector('.act') || {}).textContent || '').trim().slice(0, 60), lignes: els.map(l => l.getAttribute('data-p') || l.textContent.trim().slice(0, 24)) }; });
      const t0 = fen ? await murT(fen) : null; verif('R', !!t0 && t0.lignes.length > 0, T + ' · la fenêtre du tableau montre la diapo de l’heure', dD(t0));
      let pn = null; const nouvel = await pg.evaluate(() => !!Array.from(document.querySelectorAll('button, a')).find(e => e.offsetParent && /Le site dans un nouvel onglet/.test(e.innerText || '')));
      if (nouvel) { try { [pn] = await Promise.all([pg.context().waitForEvent('page', { timeout: 5000 }), pg.evaluate(() => { Array.from(document.querySelectorAll('button, a')).find(e => e.offsetParent && /Le site dans un nouvel onglet/.test(e.innerText || '')).click(); })]); await pn.waitForLoadState(); await p(pn, 2500); await sansVoiles(pn); } catch (e) { pn = null; } }
      verif('R', !!pn, T + ' · « ↗ Le site dans un nouvel onglet » ouvre le second onglet');
      if (pn && fen) { await pn.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(pn, 1200); await sansVoiles(pn); await clicTexte(pn, 'button,[onclick]', "atOnglet('chapitres')"); await p(pn, 900); if (!(await clicTexte(pn, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pn, 'button,[onclick]', 'Modifier'); await p(pn, 1800); await sansVoiles(pn);
        await pn.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(pn, 1500);
        const joue = await pn.evaluate(() => { const b = document.getElementById('at-jouer'); if (!b || !b.offsetParent) return false; b.click(); return true; }); await p(pn, 1500); verif('R', joue, T + ' · dans le second onglet, « ▶ Jouer en avance » (la répétition)');
        await dev(pn, 10); await p(pn, 2500); const t1 = await murT(fen);
        verif('R', JSON.stringify(t0) === JSON.stringify(t1), T + ' · ▶ × 10 en répétition dans le second onglet : la fenêtre du tableau de la classe ne change pas', dD(t0) + ' → ' + dD(t1));
        await pn.click('#rep-stop').catch(() => {}); await p(pn, 2500); const t2 = await murT(fen);
        verif('R', JSON.stringify(t0) === JSON.stringify(t2), T + ' · « ■ Arrêter » : toujours pareil', dD(t0) + ' → ' + dD(t2)); }
    } catch (e) { verif('R', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (R)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 13 · 42 : une seule activité jouée en fin de créneau → « Cette heure, on a fait » ── */
  if (fait('42')) { const o = await ouvrirCtx(W, H); const pg = o.pg;
    try { await pg.clock.setFixedTime(new Date('2026-09-14T09:44:00+02:00')); await entrerProf(pg); const lance = await lancerParLaCase(pg); verif('42', lance, T + ' · l’heure se lance par la case à 09:44 (fin du créneau 08:57-09:52)');
      await dev(pg, 3); await pg.clock.setFixedTime(new Date('2026-09-14T09:46:00+02:00')); await p(pg, 1500);
      await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="relecture"]') || Array.from(document.querySelectorAll('button')).find(x => x.offsetParent && /^Relecture$/.test(x.innerText.trim())); if (b) b.click(); }); await p(pg, 2500);
      const r = await pg.evaluate(() => { const z = document.querySelector('#dr-zone .recit, .recit'); if (!z) return null; const ps = Array.from(z.querySelectorAll('p, .ligne, div')).map(e => (e.innerText || '').trim()).filter(t => /on a (commencé|fait|continué)/.test(t)); return { premier: ps[0] || '', tout: z.innerText.replace(/\s+/g, ' ').slice(0, 300) }; });
      await capt(pg, W, H, '42-recit-une-activite');
      verif('42', r && /^Cette heure, on a fait/.test(r.premier), T + ' · 13 · 42 · une seule activité en fin de créneau : le récit commence par « Cette heure, on a fait »', r ? '« ' + r.premier.slice(0, 90) + ' »' : 'pas de récit');
      verif('42', r && !/^Enfin/.test(r.premier), T + ' · 13 · 42 · jamais « Enfin » en tête du récit', r ? '« ' + r.premier.slice(0, 60) + ' »' : '');
      /* 13 · 41 (b) : le retour du navigateur ne quitte pas l'heure (mesuré ici, en dernier : avant le chantier il quitte la page et casserait la suite) */
      await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]') || Array.from(document.querySelectorAll('button')).find(x => x.offsetParent && /^Pilotage$/.test(x.innerText.trim())); if (b) b.click(); }); await p(pg, 1200);
      const d0 = await lire(pg); await pg.goBack().catch(() => {}); await p(pg, 1500); const d1 = await lire(pg);
      verif('41', await pg.evaluate(() => !!(window.S && S.lancee && !S.close)).catch(() => false) && pareil(d0, d1), T + ' · 13 · 41 · le retour du navigateur ne quitte pas l’heure', dD(d0) + ' → ' + dD(d1));
    } catch (e) { verif('42', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (42)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }
  /* ── 13 · 51 : une classe créée par le site, à clé simplifiée — l'emploi du temps, la case, la fenêtre de la case, l'heure lancée (3e, 4e) ── */
  if (fait('51')) for (const C of [{ niv: '3e', lib: '3ème', nom: '3 DYLAN Bob', cle: '3_dylan_bob', quand: '2026-11-03T10:10:00+01:00', iso: '2026-11-03', cr: '10:07-11:02', fin: '2026-11-03T10:58:00+01:00', apres: '2026-11-03T11:10:00+01:00' }, { niv: '4e', lib: '4ème', nom: '4 HUGO', cle: '4_hugo', quand: '2026-11-03T13:03:00+01:00', iso: '2026-11-03', cr: '13:00-13:55', fin: '2026-11-03T13:51:00+01:00', apres: '2026-11-03T14:05:00+01:00' }]) {
    const st = hubStore(); delete st.classes['3 DYLAN Bob']; ((st.site.edt.grille['2026-2027'] || {}).creneaux || []).forEach(x => { if (x.classe === C.nom) x.classeMjpc = ''; });
    if (C.niv === '4e') { st.site['4e'] = JSON.parse(JSON.stringify(st.site['3e'])); (st.site['4e'].chapitres || []).forEach(ch => { if (ch) delete ch.published; }); }
    const ELV = ['DURAND Alice', 'BERNARD Emma', 'PETIT Thomas', 'ROBERT Chloé']; const k = '51 ' + C.niv;
    const o = await ouvrirCtx(W, H, st); const pg = o.pg;
    try { await pg.clock.setFixedTime(new Date(C.quand)); await entrerProf(pg); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} }); await sansVoiles(pg);
      verif(k, !(await pg.evaluate(() => m8TestOn())), T + ' · hors mode test (le chemin de Paul)');
      /* 1 · la classe naît de l'import de sa liste (le tableau collé) → « nouvelle classe » → la fenêtre « Nouvelle classe » (nom, niveau, année) */
      await pg.evaluate(() => { openProfPanel(); showProfSection('eleves'); }); await p(pg, 2500); await sansVoiles(pg);
      await pg.evaluate(t => { const dt = new DataTransfer(); dt.setData('text/plain', t); document.body.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true })); }, 'Classe : ' + C.nom + '\n' + ELV.join('\n')); await p(pg, 1200);
      const pt = await pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const v = document.getElementById(i); if (v) v.remove(); }); const b = document.getElementById('eli-valider'); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, t: b.innerText.trim() }; });
      if (pt) { await pg.mouse.click(pt.x, pt.y); await p(pg, 900); }
      const mo = await pg.evaluate(() => ({ v: document.getElementById('class-modal').classList.contains('visible'), nom: document.getElementById('class-modal-nom').value, niv: document.getElementById('class-modal-niveau').value }));
      if (mo.v) { if (!(await pg.inputValue('#class-modal-annee'))) await pg.fill('#class-modal-annee', '2026-2027'); if (mo.niv !== C.niv) await pg.selectOption('#class-modal-niveau', C.niv); await pg.click('#class-modal button.primary'); await p(pg, 2500); }
      const cl = await pg.evaluate(c => window.__hubLire('/classes/' + c), C.cle);
      verif(k, !!pt && mo.v && mo.nom === C.nom, T + ' · l’import de la liste propose « nouvelle classe » et ouvre « Nouvelle classe » au nom lu', JSON.stringify({ bouton: pt && pt.t.slice(0, 50), modale: mo }));
      verif(k, cl && cl.nom === C.nom && cl.niveau === C.niv && Array.isArray(cl.eleves) && cl.eleves.length === 4, T + ' · la classe est rangée sous sa clé simplifiée « ' + C.cle + ' », nom « ' + C.nom + ' », 4 élèves', JSON.stringify(cl && { nom: cl.nom, niveau: cl.niveau, eleves: (cl.eleves || []).length }));
      /* 2 · reliée par le menu « 🔗 Classes de la grille et classes du site » */
      await pg.evaluate(() => { try { showProfSection('edt'); } catch (e) {} }); await p(pg, 2500);
      const sel = await pg.evaluate(nom => { const s = Array.from(document.querySelectorAll('.edt-ap')).find(d => ((d.querySelector('span') || {}).textContent || '').trim() === nom);   /* le nom de la grille, pas une option d'une autre ligne */ if (!s) return null; const m = s.querySelector('select'); if (!m) return null; const op = Array.from(m.options).find(x => x.value === nom) || Array.from(m.options).find(x => x.textContent.trim() === nom); if (!op) return { opts: Array.from(m.options).map(x => x.value + '=' + x.textContent.trim()).slice(0, 12) }; m.value = op.value; m.dispatchEvent(new Event('change', { bubbles: true })); return { val: op.value }; }, C.nom); await p(pg, 2500);
      const relie = await pg.evaluate(nom => ((window.__hubLire('/site/edt/grille/2026-2027/creneaux') || []).filter(c => c && c.classe === nom).map(c => c.classeMjpc)), C.nom);
      verif(k, sel && sel.val && relie.length && relie.every(x => x === sel.val), T + ' · le menu relie les cases de « ' + C.nom + ' » à la classe du site', JSON.stringify({ menu: sel, cases: relie }));
      await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} try { goHome(); } catch (e) {} }); await p(pg, 800);
      /* 3 · le chapitre publié pour elle, page du niveau, hors mode test */
      for (let n = 0; n < 2; n++) { await pg.evaluate(c => openLevel(c.niv, c.lib, 'var(--' + c.niv + ')'), C); await p(pg, 2500); if (await pg.evaluate(() => document.getElementById('page-level').classList.contains('active'))) break; }
      await sansVoiles(pg);
      const pub = await pg.evaluate(cle => { const el = Array.from(document.querySelectorAll('#page-level [onclick*="togglePublishChapterCls"]')).find(x => x.getAttribute('onclick').indexOf("'" + cle + "'") >= 0 && x.offsetParent); if (!el) return Array.from(document.querySelectorAll('#page-level [onclick*="togglePublishChapterCls"]')).map(x => x.getAttribute('onclick').replace('event.stopPropagation();', '')).slice(0, 6); el.click(); return true; }, C.cle); await p(pg, 2500);
      const publie = await pg.evaluate(c => { const ch = window.__hubLire('/site/' + c.niv + '/chapitres/0') || {}; return ch.published || null; }, C);
      verif(k, pub === true && publie && JSON.stringify(publie).indexOf(C.cle) >= 0, T + ' · le chapitre se publie pour « ' + C.nom + ' » depuis la page du niveau', JSON.stringify({ pastille: pub, hub: publie }));
      await pg.evaluate(() => { try { goHome(); } catch (e) {} }); await p(pg, 600);
      /* 3 bis · la page tableau sans cours (mon écran) : « Classe attendue : <nom> » — le niveau du prochain créneau lu par la clé (dr_tabCle) */
      { const tb = await o.ctx.newPage(); await tb.clock.setFixedTime(new Date(C.quand));
        /* le même hub que le pilote : une page file:// neuve voit parfois un localStorage vide (mesuré : 3 fois sur 16, `localStorage` sans aucune clé) — on le lui donne */
        const hubNow = await pg.evaluate(() => localStorage.getItem('__E3HUB28')); await tb.addInitScript(v => { try { if (v && !localStorage.getItem('__E3HUB28')) localStorage.setItem('__E3HUB28', v); } catch (e) {} try { if (v) window.__HUB = JSON.parse(localStorage.getItem('__E3HUB28') || v); } catch (e) {} }, hubNow); await tb.goto(URL0 + '?vue=tableau&n=' + C.niv, { waitUntil: 'load' }); await p(tb, 4000);
        const att = await tb.evaluate(() => { const e = document.getElementById('ses-tab-c'); return e && e.style.display !== 'none' ? e.textContent.trim() : ''; });
        if (CAPT && (W === 1707 || W === 1920)) await tb.screenshot({ path: path.join(CAPT, W + 'x' + H + '-51-' + C.niv + '-tableau-attente-' + SUFF + '.png') }).catch(() => {});
        const dbg = att.indexOf('Classe attendue : ' + C.nom) === 0 ? '' : ' · ' + JSON.stringify(await tb.evaluate(cle => { const cl = window.__hubLire('/classes') || {}; const g = window.__hubLire('/site/edt/grille/2026-2027'); let r = null; try { r = dr_tabCaseDuMoment(g, window.__hubLire('/site/edt/calendrier/2026-2027'), cl, new Date(), (location.search.match(/[?&]n=([^&]+)/) || [])[1]); } catch (e) { r = String(e); } let ls = null; try { ls = { n: (localStorage.getItem('__E3HUB28') || '').length, cles: Object.keys(localStorage).slice(0, 8), aLS: !!((JSON.parse(localStorage.getItem('__E3HUB28') || '{}').classes || {})[cle]), aMem: !!((window.__HUB || {}).classes || {})[cle] }; } catch (e) { ls = String(e); } return { ls, a: !!cl[cle], maint: new Date().toString().slice(0, 24), r }; }, C.cle)) + ' · le pilote : ' + JSON.stringify(await pg.evaluate(cle => ({ a: !!(window.__hubLire('/classes') || {})[cle], ecr: window.__ECR.filter(x => /classes|\/site\/edt\/grille/.test(x)).slice(-6), taille: (localStorage.getItem('__E3HUB28') || '').length }), C.cle));
        verif(k, att.indexOf('Classe attendue : ' + C.nom) === 0, T + ' · 13 · 51 · la page tableau sans cours dit « Classe attendue : ' + C.nom + ' »', '« ' + att + ' »' + dbg); await tb.close(); }
      /* 4 · l'emploi du temps, semaine du 2/11 : la case, la carte */
      await pg.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pg, 1800); await pg.evaluate(() => { try { edtVue('semaine'); } catch (e) {} }); await p(pg, 1500); await sansVoiles(pg);
      const r = await pg.evaluate(nom => { const re = new RegExp('^\\s*' + nom.replace(/ /g, '\\s+'), 'i'); return { cases: Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => e.offsetParent && re.test(e.innerText)).map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 110)), cartes: Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCarteClic"]')).filter(e => e.offsetParent).map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 80)) }; }, C.nom);
      r.cases = r.cases.filter(t => !/fil « langue »/.test(t));   /* une case du fil « langue » attend un chapitre de langue : le faux hub n'en a pas */
      const avecSeance = r.cases.filter(t => /heure \d+\s*\/\s*\d+/.test(t) && !/aucune séance prête/.test(t));
      await capt(pg, W, H, '51-' + C.niv + '-emploi-du-temps');
      const sansSeance = r.cases.filter(t => /aucune séance prête|non encore importée|aucun chapitre/.test(t));   /* une case passée et pas jouée (« passée · pas jouée ») dit vrai : elle ne compte ni pour ni contre */
      verif(k, avecSeance.length > 0 && sansSeance.length === 0, T + ' · 13 · 51 · semaine du 2/11 : chaque case de « ' + C.nom + ' » montre sa séance (« heure n/N »)', avecSeance.length + ' avec séance, ' + sansSeance.length + ' sans, sur ' + r.cases.length + ' · ' + (sansSeance[0] || r.cases[0] || ''));
      verif(k, r.cartes.some(t => t.indexOf(C.nom) >= 0 && /Poésie|peinture/i.test(t)), T + ' · 13 · 51 · la carte montre le chapitre publié', r.cartes.slice(0, 3).join(' | ') || 'aucune carte');
      /* 5 · la case de l'heure en cours → « ▶ Ouvrir le pilotage et lancer » : l'heure a ses élèves */
      const caseDe = () => pg.evaluate(c => { const z = document.querySelector('#edt-ecran .edt-case[data-iso="' + c.iso + '"][data-creneau="' + c.cr + '"]'); const e = z && Array.from(z.querySelectorAll('.edt-clic')).find(x => x.innerText.indexOf(c.nom) >= 0); if (!e) return false; e.click(); return true; }, C);
      const fenetre = () => pg.evaluate(() => { const m = document.getElementById('edt-modale'); return m && m.getBoundingClientRect().height > 0 ? m.innerText.replace(/\s+/g, ' ') : ''; });
      const ouv = await caseDe(); await p(pg, 1500); const fen0 = await fenetre();
      const lb = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Ouvrir le pilotage et lancer/.test(b.innerText)); if (!b) return false; b.click(); return true; }); await p(pg, 3500); await sansVoiles(pg); await pg.keyboard.press('Escape'); await p(pg, 400);
      const h = await pg.evaluate(() => ({ lancee: !!(window.S && S.lancee), eleves: (typeof ELEVES !== 'undefined' && Array.isArray(ELEVES)) ? ELEVES.slice() : null }));
      const visibles = []; for (const n of ELV) if (await texteVisible(pg, new RegExp(n.split(' ')[1] + '|' + n.split(' ')[0]))) visibles.push(n);
      await capt(pg, W, H, '51-' + C.niv + '-l-heure-lancee');
      verif(k, ouv && lb && h.lancee, T + ' · l’heure se lance par la case de « ' + C.nom + ' » (' + C.cr + ')', JSON.stringify({ case: ouv, bouton: lb, lancee: h.lancee, fenetre: fen0.slice(0, 120) }));
      verif(k, h.eleves && ELV.every(n => h.eleves.indexOf(n) >= 0), T + ' · 13 · 51 · l’heure lancée a ses élèves (la participation)', JSON.stringify(h.eleves));
      info(k, T + ' · élèves visibles à l’écran de l’heure : ' + visibles.length + '/4');
      /* 6 · l'heure jouée puis close → la fenêtre de sa case montre les élèves de la classe (les absents) */
      if (h.lancee) { await dev(pg, 2); const cl2 = await clore(pg, C.fin);
        await pg.clock.setFixedTime(new Date(C.apres)); await p(pg, 1500);   /* le créneau fini : la case est celle d'une heure jouée */
        await pg.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pg, 1800); await pg.evaluate(() => { try { edtVue('semaine'); } catch (e) {} }); await p(pg, 1200); await sansVoiles(pg);
        const ouv2 = await caseDe(); await p(pg, 1500); const fen = await fenetre(); await capt(pg, W, H, '51-' + C.niv + '-la-case');
        const vusFen = ELV.filter(n => fen.indexOf(n) >= 0 || fen.indexOf(n.split(' ')[1] + ' ' + n.split(' ')[0]) >= 0);
        if (vusFen.length !== 4) info(k, T + ' · ce que le hub garde de l’heure jouée : ' + JSON.stringify(await pg.evaluate(c => { const ch = window.__hubLire('/site/' + c.niv + '/chapitres/0/seances') || []; const o = {}; (Array.isArray(ch) ? ch : Object.values(ch)).forEach((se, i) => { const d = (se || {}).deroule_joue || {}; Object.keys(d).forEach(sl => { o[i + '/' + sl] = { classe: d[sl].classe, heures: Object.keys(d[sl].heures || {}) }; }); }); return o; }, C)).slice(0, 500));
        verif(k, cl2 && ouv2 && vusFen.length === 4, T + ' · 13 · 51 · l’heure jouée, la fenêtre de sa case montre ses élèves', vusFen.length + '/4 · close ' + cl2 + ' · « ' + fen.slice(0, 160) + ' »'); }
      else verif(k, false, T + ' · 13 · 51 · la fenêtre de la case avec ses élèves : pas atteinte (l’heure ne s’est pas lancée)');
    } catch (e) { verif(k, false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif(k, !o.errs.length, T + ' · 0 erreur JS', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 13 · 50 puis 13 · 49 : « 📚 Nouveau chapitre » sans la clé ; « Créer ce chapitre » garde le titre du JSON ── */
  if (fait('50') || fait('49')) { const st = hubStore(); const o = await ouvrirCtx(W, H, st); const pg = o.pg;
    try { await entrerProf(pg); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} }); await sansVoiles(pg);
      await pg.evaluate(() => { atelierOuvrir(); }); await p(pg, 1000); await sansVoiles(pg);
      const cle0 = await pg.evaluate(() => !!(window.SECU && SECU.valide));
      const porte = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.at-porte-ch')).find(x => x.offsetParent !== null); if (!b) return null; b.click(); return b.innerText.replace(/\s+/g, ' ').trim().slice(0, 40); }); await p(pg, 1500);
      const ecran = await pg.evaluate(() => ({ titre: ((document.querySelector('.at-ia-titre') || {}).textContent || '').trim(), coller: !!(document.getElementById('ch-coller') && document.getElementById('ch-coller').offsetParent), cle: /Clé requise/.test(document.body.innerText) }));
      if (fait('50')) { await capt(pg, W, H, '50-nouveau-chapitre');
        verif('50', !cle0 && porte && /Construire un chapitre/.test(ecran.titre) && ecran.coller && !ecran.cle, T + ' · 13 · 50 · sans la clé, « ' + (porte || '?') + ' » ouvre « Construire un chapitre avec une IA », sans « Clé requise »', JSON.stringify(Object.assign({ cle: cle0 }, ecran))); }
      if (fait('49')) {
        if (!ecran.coller) verif('49', false, T + ' · 13 · 49 · l’écran « Nouveau chapitre » ne s’ouvre pas (la clé : 13 · 50) — « Créer ce chapitre » pas atteint');
        else { const { chapitreTest } = await import(path.join(RACINE, 'LIVRAISONS', 'INTEGRATION', 'E1', 'bancs', 'import-3e.mjs')); const j = chapitreTest(st); const TIT = 'Le chapitre neuf du banc E3';
          j.chapitre.title = TIT; j.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => { e.blocs = (e.blocs || []).filter(b => b.t !== 'fiche'); }));   /* le chapitre du faux hub a une fiche sans feuille : le site la refuse (1.7) */
          await pg.fill('#ch-coller', JSON.stringify(j)); await p(pg, 400);
          await clicTexte(pg, 'button', 'Vérifier'); await p(pg, 1500);
          const msg = await pg.evaluate(() => ((document.getElementById('ch-msg') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 120));
          const cree = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Créer ce chapitre/.test(b.innerText)); if (!b) return false; b.click(); return true; }); await p(pg, 1500);
          await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && m.getBoundingClientRect().height > 0 && Array.from(m.querySelectorAll('button')).find(x => /Créer/.test(x.textContent)); if (b) { window.__E3MOD = m.innerText.replace(/\s+/g, ' ').slice(0, 200); b.click(); } });   /* la confirmation (fixe : offsetParent nul) */ await p(pg, 2500);
          const tit = await pg.evaluate(() => { const c = window.__hubLire('/site/3e/chapitres'); return (Array.isArray(c) ? c : Object.values(c || {})).filter(Boolean).map(x => x.title || ''); });
          await capt(pg, W, H, '49-chapitre-cree');
          const conf = await pg.evaluate(() => window.__E3MOD || ''); verif('49', cree && !/proposition/.test(conf) && tit.indexOf(TIT) >= 0 && !tit.some(x => x.indexOf(TIT + ' (proposition)') === 0), T + ' · 13 · 49 · « Créer ce chapitre » : le titre du JSON tel quel au hub', JSON.stringify({ verifier: msg, bouton: cree, confirmation: await pg.evaluate(() => window.__E3MOD || null), titres: tit.filter(x => x.indexOf(TIT) === 0), tous: tit.length, boites: o.boites.slice(-2), apres: (await pg.evaluate(() => ((document.getElementById('ch-msg') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 160))), ecr: (await pg.evaluate(() => window.__ECR.filter(x => /chapitres/.test(x)).slice(-3))) })); } }
    } catch (e) { verif('49', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (49-50)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 33 (§12.33) : l'Atelier ne garde que ce qui sert à préparer ── */
  if (fait('33')) {
    /* A60 · la poignée entre la diapo et « Notes pour cette diapo » : dans l'écran, prise sans viser — 100 %, 90 %, 110 % */
    for (const z of [1, 0.9, 1.1]) { const o = await ouvrirCtx(W, H, null, z); const pg = o.pg; const Z = T + ' · zoom ' + Math.round(z * 100) + ' %';
      try { await entrerProf(pg); const ok = await ouvrirAtelier(pg);
        const po = await pg.evaluate(() => { const e = document.getElementById('poignee-mur') || Array.from(document.querySelectorAll('body *')).find(x => /row-resize/.test(getComputedStyle(x).cursor) && x.getBoundingClientRect().width > 50); if (!e) return null; const r = e.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const t = cy >= 0 && cy < innerHeight ? document.elementFromPoint(cx, cy) : null; const n = document.querySelector('.notes'); return { haut: Math.round(r.top), bas: Math.round(r.bottom), H: innerHeight, cx: Math.round(cx), cy: Math.round(cy), prise: !!(t && (t === e || e.contains(t))), notes: n ? Math.round(n.getBoundingClientRect().top) : null }; });
        if (z === 1) await capt(pg, W, H, '33-1-la-poignee');
        verif('33', ok && po && po.haut >= 0 && po.bas <= po.H && po.prise, Z + ' · 13 · 55 · la poignée diapo / notes est dans l’écran et se prend sans viser', JSON.stringify(po));
        if (z === 1 && po && po.prise) { const m0 = await pg.evaluate(() => Math.round((document.getElementById('mur') || document.body).getBoundingClientRect().height)); await pg.mouse.move(po.cx, po.cy); await pg.mouse.down(); await pg.mouse.move(po.cx, po.cy - 60, { steps: 6 }); await pg.mouse.up(); await p(pg, 500);
          const m1 = await pg.evaluate(() => Math.round((document.getElementById('mur') || document.body).getBoundingClientRect().height)); const po2 = await pg.evaluate(() => { const r = document.getElementById('poignee-mur').getBoundingClientRect(); return { haut: Math.round(r.top), bas: Math.round(r.bottom), H: innerHeight }; });
          verif('33', m1 < m0 && po2.bas <= po2.H, Z + ' · la poignée tirée de 60 px vers le haut : la diapo cède sa hauteur aux notes, la poignée reste dans l’écran', m0 + ' → ' + m1 + ' px · ' + JSON.stringify(po2)); }
      } catch (e) { verif('33', false, Z + ' · la poignée : le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
      verif('Z', !o.errs.length, Z + ' · 0 erreur JS (33, la poignée)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

    /* A61, A63, A62 · les onglets, la répétition, « 📝 Notes », les marques préparées */
    { const o = await ouvrirCtx(W, H); const pg = o.pg;
      try { await entrerProf(pg); const ok = await ouvrirAtelier(pg);
        const ong = await pg.evaluate(() => Array.from(document.querySelectorAll('.at-onglet')).filter(b => b.offsetParent).map(b => b.getAttribute('data-vue')));
        const notesB = await pg.evaluate(() => { const b = document.getElementById('bnotes') || Array.from(document.querySelectorAll('button')).find(x => /📝/.test(x.innerText || '')); return !!(b && b.offsetParent && b.getBoundingClientRect().width > 0); });
        await capt(pg, W, H, '33-2-l-atelier');
        verif('33', ok && ong.indexOf('structure') >= 0 && ong.indexOf('atelier') >= 0 && ong.indexOf('pilotage') < 0 && ong.indexOf('relecture') < 0, T + ' · l’Atelier : « Structure » et « Atelier », ni « Pilotage » ni « Relecture »', JSON.stringify(ong));
        verif('33', !notesB, T + ' · pas de « 📝 Notes » dans l’Atelier (les notes au fil de l’eau sont de l’heure)');
        /* les marques : trois gestes de la barre, chacun avec son infobulle */
        const barre = await pg.evaluate(() => { const v = b => b.offsetParent && b.getBoundingClientRect().width > 0; const B = Array.from(document.querySelectorAll('button')).filter(v); const f = re => { const b = B.find(x => re.test((x.innerText || '') + ' ' + (x.title || ''))); return b ? { id: b.id, t: (b.innerText || '').trim().slice(0, 20), titre: (b.title || '').slice(0, 80) } : null; }; return { surl: f(/surlign/i), coul: f(/couleur du texte/i), ecr: f(/À écrire/) }; });
        verif('33', barre.surl && barre.coul && barre.ecr && barre.surl.titre && barre.coul.titre && barre.ecr.titre, T + ' · dans la barre de l’Atelier : surligner, couleur du texte, « ✍ À écrire », chacun avec son infobulle', JSON.stringify(barre));
        let marques = null;
        if (barre.surl && barre.coul && barre.ecr) {
          /* sélectionner un mot d'une étape de la diapo, puis le geste */
          const choisir = n => pg.evaluate(k => { const L = Array.from(document.querySelectorAll('#mur li[data-p]')).filter(l => l.getBoundingClientRect().height > 0 && /\S{4,}/.test(l.textContent)); const li = L[k]; if (!li) return null; const tw = document.createTreeWalker(li, NodeFilter.SHOW_TEXT); let t = null; while (tw.nextNode()) { if (/\S{4,}/.test(tw.currentNode.textContent)) { t = tw.currentNode; break; } } if (!t) return null; const ms = t.textContent.match(/[A-Za-zÀ-ÿ’']{5,}/g) || []; const mot = ms.sort((a, b) => b.length - a.length)[0]; if (!mot) return null; const m = { index: t.textContent.indexOf(mot), 0: mot };   /* le mot le plus long de l'élément : deux éléments ne le partagent pas (« Étape » ouvre chacun) */ const r = document.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length); const s = getSelection(); s.removeAllRanges(); s.addRange(r); return { p: li.getAttribute('data-p'), mot: m[0] }; }, n);
          const geste = async (b, couleur) => { await pg.evaluate(id => { const x = document.getElementById(id) || Array.from(document.querySelectorAll('button')).find(y => y.offsetParent && y.id === id); if (x) x.click(); }, b.id); await p(pg, 500);
            if (couleur) await pg.evaluate(() => { const m = Array.from(document.querySelectorAll('[data-coul], .p8-coul, [data-c]')).find(x => x.offsetParent && x.tagName === 'BUTTON'); if (m) m.click(); }); await p(pg, 600); };
          const s1 = await choisir(0); await geste(barre.surl, true); const s2 = await choisir(1); await geste(barre.coul, true);
          const s3 = await pg.evaluate(() => { const L = Array.from(document.querySelectorAll('#mur li[data-p]')).filter(l => l.getBoundingClientRect().height > 0); const li = L[2] || L[L.length - 1]; if (!li) return null; const tw = document.createTreeWalker(li, NodeFilter.SHOW_TEXT); tw.nextNode(); const t = tw.currentNode; const r = document.createRange(); if (t && t.nodeType === 3) { r.setStart(t, Math.min(3, t.length)); r.collapse(true); } else { r.selectNodeContents(li); r.collapse(true); } const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); return li.getAttribute('data-p'); });   /* le curseur dans l'élément (l'infobulle : « place le curseur dans un élément ») */ await p(pg, 400); await geste(barre.ecr, false);
          await p(pg, 2500); await capt(pg, W, H, '33-3-les-marques-posees');
          const lireMarques = q => q.evaluate(() => { const z = document.getElementById('mur2') || document.getElementById('mur'); if (!z) return null; return { surl: Array.from(z.querySelectorAll('mark')).filter(x => x.getBoundingClientRect().width > 0).map(x => x.textContent.trim()).slice(0, 3), coul: Array.from(z.querySelectorAll('span[data-coul], span[style*="color"]')).filter(x => x.getBoundingClientRect().width > 0 && x.closest('li')).map(x => x.textContent.trim()).slice(0, 3), ecr: Array.from(z.querySelectorAll('li')).filter(l => /ecri/.test(l.className) || /✍/.test(l.textContent)).map(l => l.getAttribute('data-p')).slice(0, 3) }; });
          const m0 = await lireMarques(pg);
          verif('33', m0 && m0.surl.indexOf(s1 && s1.mot) >= 0 && m0.coul.indexOf(s2 && s2.mot) >= 0 && m0.ecr.indexOf(s3) >= 0, T + ' · posées dans l’Atelier : « ' + (s1 && s1.mot) + ' » surligné, « ' + (s2 && s2.mot) + ' » en couleur, l’élément ' + s3 + ' « à écrire »', JSON.stringify(m0));
          /* rechargement : elles sont dans la trame */
          await pg.reload({ waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg); await ouvrirAtelier(pg);
          const m1 = await lireMarques(pg);
          verif('33', m1 && m1.surl.indexOf(s1 && s1.mot) >= 0 && m1.coul.indexOf(s2 && s2.mot) >= 0 && m1.ecr.indexOf(s3) >= 0, T + ' · après rechargement, les trois marques sont revues dans l’Atelier', JSON.stringify(m1));
          /* la répétition et le tableau : la classe les verrait dès la diapo projetée */
          const rep = await entrerRepetition(pg); await dev(pg, 4); await p(pg, 800);
          let fen = null; try { [fen] = await Promise.all([pg.waitForEvent('popup', { timeout: 6000 }), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await p(fen, 2500); } catch (e) { fen = null; }
          const m2 = fen ? await lireMarques(fen) : null; if (fen) { await fen.screenshot({ path: CAPT && (W === 1707 || W === 1920) ? path.join(CAPT, W + 'x' + H + '-33-4-les-marques-au-tableau-' + SUFF + '.png') : undefined }).catch(() => {}); }
          marques = { rep, m2 };
          verif('33', rep && m2 && m2.surl.indexOf(s1 && s1.mot) >= 0 && m2.coul.indexOf(s2 && s2.mot) >= 0, T + ' · en répétition, le tableau montre le surlignage et la couleur préparés', JSON.stringify(marques));
          if (fen) await fen.close().catch(() => {});
        }
        /* A61 · la répétition par le seul bouton : « ▶ Jouer en avance » */
        if (!marques) { const r = await entrerRepetition(pg); verif('33', r && await pg.evaluate(() => !!document.getElementById('at-jouer')), T + ' · « ▶ Jouer en avance — répétition » entre en répétition'); }
      } catch (e) { verif('33', false, T + ' · l’Atelier : le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
      verif('Z', !o.errs.length, T + ' · 0 erreur JS (33, l’Atelier)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

    /* A64 · un chapitre importé avec des notes du présentateur sur trois diapos et le bilan → chaque note dans le cadre de sa diapo */
    { const st = hubStore(); const o = await ouvrirCtx(W, H, st); const pg = o.pg;
      try { await entrerProf(pg); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} }); await sansVoiles(pg);
        const { chapitreTest } = await import(path.join(RACINE, 'LIVRAISONS', 'INTEGRATION', 'E1', 'bancs', 'import-3e.mjs')); const j = chapitreTest(st); const TIT = 'Poésie et peinture — avec les notes du présentateur';
        j.chapitre.title = TIT; j.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => { e.blocs = (e.blocs || []).filter(b => b.t !== 'fiche'); }));
        const E0 = j.chapitre.seances[0].deroule.ecrans; const ib = E0.findIndex(e => e.role || e.notes);
        const NOTES = { 0: '<p>Lumière éteinte, les cinq tableaux défilent <b>sans un mot</b> : cinq minutes de silence complet.</p><ul><li>Delacroix d’abord</li><li>Friedrich en dernier</li></ul>', 6: '<p>Noter au tableau <i>chaque</i> hypothèse, même fausse ; ne trancher qu’à la question-synthèse.</p>', 13: '<p>Les trois mots se recopient <b>dans la partie cours</b> du cahier, pas au brouillon.</p>' };
        Object.keys(NOTES).forEach(k => { E0[+k].notes = NOTES[k]; });
        const REPERES = { 0: 'sans un mot', 6: 'même fausse', 13: 'dans la partie cours' }; if (ib >= 0) REPERES[ib] = ((E0[ib].notes || '').replace(/<[^>]+>/g, ' ').match(/[A-Za-zÀ-ÿ’' ]{12,}/) || [''])[0].trim().slice(0, 20);
        await pg.evaluate(() => { atelierOuvrir(); }); await p(pg, 1000); await sansVoiles(pg);
        await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.at-porte-ch')).find(x => x.offsetParent !== null); if (b) b.click(); }); await p(pg, 1500);
        await pg.fill('#ch-coller', JSON.stringify(j)); await p(pg, 400); await clicTexte(pg, 'button', 'Vérifier'); await p(pg, 1500);
        const msg = await pg.evaluate(() => ((document.getElementById('ch-msg') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 200));
        const cree = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Créer ce chapitre/.test(b.innerText)); if (!b) return false; b.click(); return true; }); await p(pg, 1500);
        await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && m.getBoundingClientRect().height > 0 && Array.from(m.querySelectorAll('button')).find(x => /Créer/.test(x.textContent)); if (b) b.click(); }); await p(pg, 2500);
        verif('33', cree, T + ' · 13 · 33 (5) · le chapitre aux notes sur trois diapos et le bilan est accepté', '« ' + msg + ' »');
        if (cree) { const ok = await ouvrirAtelier(pg, TIT); const vu = {};
          for (const k of Object.keys(REPERES)) { { const di = await pg.evaluate(a => { try { return seance().ecrans.findIndex(e => e && e.act === a); } catch (e) { return -1; } }, E0[+k].act);   /* l'Atelier intercale ses diapos (la fin d'heure) : la diapo se retrouve par son titre, pas par son rang dans le JSON */
              const sel = '#volet [data-at-di="' + di + '"]'; await pg.evaluate(q => { const v = document.querySelector(q); if (v) v.scrollIntoView({ block: 'center' }); }, sel); await pg.click(sel, { timeout: 4000 }).catch(() => pg.evaluate(q => { const v = document.querySelector(q); if (v) v.click(); }, sel)); }   /* la vignette de la diapo dans le volet de l'Atelier, cliquée à la souris (le focus quitte les notes) */ await p(pg, 900);
            vu[k] = await pg.evaluate(() => { const n = document.getElementById('notesd') || document.querySelector('.notes'); return (window.S ? 'di ' + S.di + ' · ' : '') + (n ? n.innerText.replace(/\s+/g, ' ').trim().slice(0, 160) : ''); });
            if (+k === 0) await capt(pg, W, H, '33-5-les-notes-importees'); }
          const bons = Object.keys(REPERES).filter(k => vu[k].indexOf(REPERES[k]) >= 0);
          if (bons.length !== Object.keys(REPERES).length) info('33', T + ' · ce que le hub garde des notes : ' + JSON.stringify(await pg.evaluate(t => { const c = window.__hubLire('/site/3e/chapitres') || []; const ch = (Array.isArray(c) ? c : Object.values(c)).find(x => x && x.title === t); if (!ch) return 'chapitre introuvable'; const se = (ch.seances || [])[0] || {}; const d = se.deroule || {}; const E = d.ecrans || []; return { notes: Object.keys(d.notes || {}).map(k => k + '=' + String(JSON.stringify(d.notes[k])).slice(0, 40)), eids: [0, 6, 13, 16].map(i => (E[i] || {}).eid), brutes: [0, 6, 13, 16].map(i => !!(E[i] || {}).notes) }; }, TIT)).slice(0, 700));
          verif('33', ok && bons.length === Object.keys(REPERES).length, T + ' · 13 · 33 (5) · chaque note dans le cadre de sa diapo (diapos ' + Object.keys(REPERES).join(', ') + ')', bons.length + '/' + Object.keys(REPERES).length + ' · ' + JSON.stringify(vu).slice(0, 300)); }
      } catch (e) { verif('33', false, T + ' · l’import des notes : le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
      verif('Z', !o.errs.length, T + ' · 0 erreur JS (33, les notes)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }
  }

}
await nav.close();
dire(''); dire('BILAN banc-1228 : ' + (nb - echecs) + '/' + nb + ' vérifications' + (echecs ? ' — ' + echecs + ' ÉCHEC(S) · ROUGE' : ' · VERT'));
if (SORTIE) { fs.mkdirSync(path.dirname(path.resolve(SORTIE)), { recursive: true }); fs.writeFileSync(SORTIE, R.join('\n') + '\n'); }
process.exit(echecs ? 1 : 0);
