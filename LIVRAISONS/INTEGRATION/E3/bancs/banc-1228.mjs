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
const ouvrirCtx = async (W, H) => { const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort()); await ctx.addInitScript(fauxHub, hubStore());
  ctx.on('page', q => { q.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); q.on('dialog', d => { if (d.type() === 'beforeunload') { q.__beforeunload = (q.__beforeunload || 0) + 1; d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(HORLOGE); return { ctx, pg, errs, boites }; };
const entrerProf = async pg => { await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg); };
const edtOuvert = pg => pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0); });
/* lancer par la case de l'emploi du temps (la case des De Gaulle « heure 1/3 ») : « ▶ Ouvrir le pilotage et lancer » */
const lancerParLaCase = async pg => { if (!(await edtOuvert(pg))) { await pg.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pg, 1800); } await pg.evaluate(() => { try { edtVue('semaine'); } catch (e) {} }); await p(pg, 600);
  const ok = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => e.offsetParent && /Charles/.test(e.innerText)); const c = cs.find(e => /heure 1\//.test(e.innerText)) || cs[0]; if (!c) return false; c.click(); return true; }); await p(pg, 900);
  const l = ok && await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Ouvrir le pilotage et lancer/.test(b.innerText)); if (!b) return false; b.click(); return true; }); await p(pg, 3500); await sansVoiles(pg); await pg.keyboard.press('Escape'); await p(pg, 400);
  return !!l && await pg.evaluate(() => !!(window.S && S.lancee)); };
const dev = async (pg, n) => { for (let i = 0; i < n; i++) { await pg.click('#bdev').catch(() => {}); await p(pg, 120); } };
const lire = (pg) => pg.evaluate(() => { const mur = document.getElementById('mur'); if (!mur) return null; const c = mur.querySelector('.corpsd') || mur; const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0');
  return { page: ((mur.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), act: ((mur.querySelector('.act') || {}).textContent || '').trim().slice(0, 60), lignes: els.map(l => l.getAttribute('data-p') || l.textContent.trim().slice(0, 24)), di: window.S ? S.di : null, nDev: window.S ? S.nDev : null }; });
const pareil = (a, b) => !!a && !!b && a.page === b.page && a.act === b.act && JSON.stringify(a.lignes) === JSON.stringify(b.lignes);
const dD = d => d ? `${d.act || '?'} · ${d.lignes.length} lignes · page « ${d.page} »` : 'absente';
const vis = (pg, sel) => pg.evaluate(s => Array.from(document.querySelectorAll(s)).some(e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 1 && r.height > 1 && c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0; }), sel);
const texteVisible = (pg, re) => pg.evaluate(src => { const re = new RegExp(src); const W = innerWidth, H = innerHeight; return Array.from(document.querySelectorAll('body *')).filter(e => e.children.length < 4 && re.test((e.innerText || '').replace(/\s+/g, ' '))).find(e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < H && c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity > 0; }) ? true : false; }, re.source);
const clore = async (pg, quand) => { await pg.clock.setFixedTime(new Date(quand)); await p(pg, 2500); if (await pg.$('#al-aller:visible')) { await pg.click('#al-aller').catch(() => {}); await p(pg, 1500); } if (await pg.$('#garde-cahier.on')) { const ya = pg.locator('#garde-cahier.on :is(button,[onclick])', { hasText: /Y aller/ }).first(); if (await ya.count()) { await ya.click().catch(() => {}); await p(pg, 1200); } }
  if (!(await vis(pg, '.pp-tete'))) { await pg.click('#bfin').catch(() => {}); await p(pg, 900); }
  for (let n = 1; n <= 7; n++) { const t = await pg.evaluate(() => (document.querySelector('.pp-tete') || {}).innerText || ''); if (/étape 7 sur 7/.test(t)) break; const b = await pg.$('#f-suivante:not([disabled])'); if (!b) break; await b.click().catch(() => {}); await p(pg, 700); }
  await pg.locator('#f-clore:visible').first().click().catch(() => {}); await p(pg, 1200); if (await pg.$('#gclore-oui:visible')) { await pg.click('#gclore-oui'); await p(pg, 1500); } await p(pg, 1500); return pg.evaluate(() => !!(window.S && S.close)); };
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
const BLOCS = fs.existsSync(AIDE) ? (() => { const o = {}; let cle = null; fs.readFileSync(AIDE, 'utf8').split('\n').forEach(l => { const m = /^### (\S+) — (.*?)(?: \(fil-\d\))?$/.exec(l); if (m) { cle = m[1]; o[cle] = [norm(m[2])]; return; } if (/^(---|#|\*Conscience|\*\*Pour E1)/.test(l)) { if (/^---/.test(l)) cle = null; return; } if (cle && l.trim()) o[cle].push(norm(l.replace(/^\s*\d+\.\s+/, ''))); }); return o; })() : null;
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
  { const o = await ouvrirCtx(W, H); const pg = o.pg;
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
  { const o = await ouvrirCtx(W, H); const pg = o.pg; let pb = null;
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
      for (const v of ['atelier', 'pilotage', 'relecture']) await passe('chapitre-' + v, () => pg.evaluate(x => { const b = document.querySelector('.at-onglet[data-vue="' + x + '"]'); if (b) b.click(); }, v));
      /* l'Atelier ne lance plus : sur l'onglet Pilotage (répétition) — pas de « Lancer avec », la ligne de la répétition */
      await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(pg, 1500);
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
  { const o = await ouvrirCtx(W, H); const pg = o.pg;
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
  { const o = await ouvrirCtx(W, H); const pg = o.pg;
    try { await entrerProf(pg); const lance = await lancerParLaCase(pg); verif('46', lance, T + ' · l’heure se lance par la case (séance aux diapos sans numéro d’activité — toutes celles du faux hub)');
      await dev(pg, 3); await p(pg, 400);
      const iFin = await pg.evaluate(() => { try { const E = seance().ecrans; for (let i = E.length - 1; i >= 0; i--) if (E[i] && E[i].role === 'fin' && ordreHeure(S.heure).includes(i)) return i; for (let i = E.length - 1; i >= 0; i--) if (E[i] && E[i].role === 'fin') return i; } catch (e) {} return -1; });
      const vg = iFin >= 0 && await pg.evaluate(i => { const v = document.querySelector('.vig[data-i="' + i + '"]'); if (!v) return false; v.click(); return true; }, iFin); await p(pg, 1200);
      const g = await pg.evaluate(() => { const e = document.getElementById('garde-cahier'); return e && e.classList.contains('on') && e.getBoundingClientRect().height > 0 ? e.innerText.replace(/\s+/g, ' ').trim() : null; });
      await capt(pg, W, H, '46-vers-la-diapo-de-fin');
      verif('46', vg && g == null, T + ' · 13 · 46 / §12.29 (2) · plus de garde « Aller au cahier » (aller à la diapo de fin n’ouvre plus de garde)', vg ? (g ? '« ' + g.slice(0, 110) + ' »' : '') : 'pas de vignette de fin (' + iFin + ')');
      const tx = await pg.evaluate(() => document.body.innerText); verif('46', !/Aucune activité restante prévue pour cette heure|tu es à l.heure\. Tout a été fait/.test(tx), T + ' · 13 · 46 · nulle part « Aucune activité restante… tu es à l’heure » pendant qu’il reste des activités');
      if (!(await vis(pg, '.pp-liste'))) { await pg.click('#bfin').catch(() => {}); await p(pg, 1200); } const L = await liste2(pg); const nE = /— rien/.test(L.l2) ? 0 : +((/— (?:encore )?(\d+) activités?/.exec(L.l2) || [])[1] || -1);
      verif('46', nE > 0, T + ' · 13 · 46 · le seul compte, celui de l’étape 2', '« ' + L.l2.slice(0, 90) + ' »');
    } catch (e) { verif('46', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (46)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── 29 (§12.29, S1-S5, les images T200) : la répétition, l'entête, T-5, « ❄ Préparer le cahier », « Montrer le cahier à la classe », « Retour au cours », « Plus tard », la case d'une heure en cours ── */
  { const o = await ouvrirCtx(W, H); const pg = o.pg;
    const boutons = (q, sel) => q.evaluate(s => Array.from(document.querySelectorAll(s)).filter(b => b.offsetParent && b.getBoundingClientRect().width > 0).map(b => (b.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean), sel);
    const forme = q => q.evaluate(() => { const r = sel => { const e = document.querySelector(sel); if (!e || !e.offsetParent) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; }; return { volet: r('#volet'), mur: r('#mur'), notes: r('#notesd') }; });
    const memeForme = (a, b) => ['volet', 'mur', 'notes'].every(k => !a[k] || (b[k] && a[k].every((v, i) => Math.abs(v - b[k][i]) <= 2)));
    try { await pg.clock.setFixedTime(new Date('2026-09-14T08:50:00+02:00')); await entrerProf(pg); await pg.evaluate(() => { try { edtFermer(); } catch (e) {} });
      /* S5 — la répétition dans l'Atelier */
      await pg.evaluate(() => atelierOuvrir()); await p(pg, 1200); await sansVoiles(pg); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900); if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(pg, 1800); await sansVoiles(pg);
      await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(pg, 1800); await capt(pg, W, H, '29-4-la-repetition');
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
      verif('29', memeForme(f0, f2) && b3.some(x => /❄ Préparer le cahier/.test(x)), T + ' · S2 · « Retour au cours » : l’écran d’avant, la tête « ❄ Préparer le cahier » / « Plus tard »', b3.join(' | '));
      await clicTexte(pg, '.pp-tete button', 'Préparer le cahier'); await p(pg, 2000); await clicTexte(pg, '.pp-tete button', 'Montrer le cahier à la classe'); await p(pg, 2000);
      const mo = await pg.evaluate(() => { try { const e = seance().ecrans[S.di]; return { role: e && e.role, gel: !!S.gel }; } catch (x) { return null; } });
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
      const pc = await pg.context().newPage(); await pc.clock.setFixedTime(new Date('2026-09-14T09:43:00+02:00')); await entrerProf(pc); if (!(await edtOuvert(pc))) { await pc.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pc, 1800); }
      await pc.evaluate(() => { const cs = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => e.offsetParent && /Charles/.test(e.innerText)); const c = cs.find(e => /2026-09-14/.test(e.getAttribute('onclick') || '')) || cs.find(e => /heure 1\//.test(e.innerText)) || cs[0]; if (c) c.click(); }); await p(pc, 1000); await capt(pc, W, H, '29-5-la-case-d-une-heure-en-cours');
      const bc = await boutons(pc, 'button'); verif('29', bc.some(x => /▶ Reprendre l.heure/.test(x)) && !bc.some(x => /Reprendre le cours/.test(x)), T + ' · S4 · la case d’une heure en cours : « ▶ Reprendre l’heure »', bc.filter(x => /Reprendre|lancer|Préparer/.test(x)).join(' | ')); await pc.close().catch(() => {});
    } catch (e) { verif('29', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('Z', !o.errs.length, T + ' · 0 erreur JS (29)', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* ── R (contrôle n°62) : une répétition jouée dans un autre onglet ne touche pas la fenêtre du tableau de la classe ── */
  { const o = await ouvrirCtx(W, H); const pg = o.pg;
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
  { const o = await ouvrirCtx(W, H); const pg = o.pg;
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
}
await nav.close();
dire(''); dire('BILAN banc-1228 : ' + (nb - echecs) + '/' + nb + ' vérifications' + (echecs ? ' — ' + echecs + ' ÉCHEC(S) · ROUGE' : ' · VERT'));
if (SORTIE) { fs.mkdirSync(path.dirname(path.resolve(SORTIE)), { recursive: true }); fs.writeFileSync(SORTIE, R.join('\n') + '\n'); }
process.exit(echecs ? 1 : 0);
