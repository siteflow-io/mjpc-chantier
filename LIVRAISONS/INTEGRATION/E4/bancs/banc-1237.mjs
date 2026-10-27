// E4 · LE BANC §12.37 PAR LE GESTE — la mise en forme des feuilles (contrat §12.37, relance du 27/10 23:12).
// A86 : dans l'éditeur de la feuille (l'Atelier, « Mes feuilles » → « Ouvrir »), les gestes de la diapo — G, S, « ab » et sa palette, « A » et sa palette, la légende
//       de surlignage — mêmes boutons, mêmes couleurs ; sur « Dictée classique : « Le port » » : le sujet souligné, le verbe conjugué en gras, le participe employé
//       comme adjectif en couleur, la légende « Sujet souligné · verbe conjugué en gras » — posés par le geste (sélection dans le champ, puis le bouton), vus à l'aperçu,
//       gardés au rechargement, gardés à l'impression (le média « print » de l'aperçu, fond blanc) ; « Les connecteurs logiques » : une colonne et un cas en couleur.
//       Une feuille sans forme se rend comme avant (le md5 de son rendu, avant et après, est écrit pour la comparaison).
// usage : node banc-1237.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres). Code 1 si un échec.
// Le harnais (faux hub, entrée prof) est celui d'E3 (banc-1228.mjs) ; les deux feuilles sont celles de son cas 37.
// Le harnais (faux hub, entrée prof, ouverture de l'Atelier, répétition) est celui d'E3 (banc-1228.mjs), repris tel quel.
// 49 : (13 · 49) « Créer ce chapitre » (le JSON collé, aucun chapitre de ce titre) → le titre du JSON tel quel au hub, sans « (proposition) ».
// usage : MJPC_HUB=AUDITS/INTEGRATION-DEROULE/hub node banc-1228.mjs <assemble/index.html> [sortie.txt]
//   MJPC_TAILLES (défaut les quatre), MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres (1707 × 743 et 1920 × 1080). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1237.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
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
/* MJPC_CAS=29,41 : ne jouer que ces cas (39, 41 — avec 40 et 43 —, 43, 46, 29, 30, R, 42, 51, 50, 49, 33, 32, 34, 35 ; 63 seulement s'il est nommé) */
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
const dev = async (pg, n) => { for (let i = 0; i < n; i++) { await pg.click('#bdev').catch(() => {}); await p(pg, 120); } };
const OUT = SORTIE || '.'; fs.mkdirSync(OUT, { recursive: true });
const PORT = 'Un port est un séjour charmant pour une âme fatiguée des luttes de la vie. L’ampleur du ciel, l’architecture mobile des nuages, les colorations changeantes de la mer, le scintillement des phares, sont un prisme merveilleusement propre à amuser les yeux sans jamais les lasser.';
const stFeuilles = () => { const st = hubStore(); st.site.atelier = { documents: {
  doc_port_e3: { titre: 'Dictée classique : « Le port »', cases: { titre: true, texte_libre: true }, valeurs: { titre: { texte: 'Dictée classique : « Le port »' } }, contenu: [{ id: 'texte_libre', valeurs: { texte: PORT } }], dates: { dateEdition: '2026-10-20' } },
  doc_connecteurs_e3: { titre: 'Les connecteurs logiques', cases: { titre: true, tableau: true }, valeurs: { titre: { texte: 'Les connecteurs logiques' } }, contenu: [{ id: 'tableau', valeurs: { lignes: 'Rapport | Connecteurs\nAddition | et, de plus, en outre\nCause | car, en effet, puisque\nConséquence | donc, ainsi, c’est pourquoi\nOpposition | mais, pourtant, cependant' } }], dates: { dateEdition: '2026-10-20' } } } }; return st; };
const ouvrirFeuille = async (pg, titre) => { await pg.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1000); await sansVoiles(pg);
  if (await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await pg.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(pg, 800); await clicTexte(pg, 'button', '← Mes chapitres'); await p(pg, 800); }
  await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('[onclick]')).find(x => x.offsetParent && /atOnglet\('feuilles'\)/.test(x.getAttribute('onclick') || '')); if (b) b.click(); }); await p(pg, 1500);
  const ok = await pg.evaluate(t => { const rows = Array.from(document.querySelectorAll('body *')).filter(x => x.offsetParent && (x.innerText || '').indexOf(t) >= 0 && Array.from(x.querySelectorAll('button')).some(b => /^Ouvrir$/.test(b.innerText.trim()))); const r = rows.sort((a, b) => a.innerText.length - b.innerText.length)[0]; if (!r) return false; Array.from(r.querySelectorAll('button')).find(b => /^Ouvrir$/.test(b.innerText.trim())).click(); return true; }, titre); await p(pg, 2500); await sansVoiles(pg); return ok; };
/* la sélection, par le geste : le texte dans le champ de la feuille (à gauche), sélectionné comme à la souris (setSelectionRange après le focus) */
const ouvrirSection = async (pg, mot) => { const cle = await pg.evaluate(m => { const z = Array.from(document.querySelectorAll('#at-zone [data-forme-z]')).find(z => (z.value || '').indexOf(m) >= 0); if (!z || z.offsetParent) return null; const sec = z.closest('.at-sec'); return sec ? sec.getAttribute('data-sec') : null; }, mot); if (cle) { await pg.click('.at-sec[data-sec="' + cle + '"] > .at-sec-t'); await p(pg, 500); } };   /* la section de l'éditeur qui porte le champ s'ouvre d'un clic, comme Paul le fait */
const choisir = async (pg, mot, k) => { await ouvrirSection(pg, mot); return pg.evaluate(({ m, k }) => { const zs = Array.from(document.querySelectorAll('#at-zone textarea, #at-zone input.at-in')).filter(z => z.offsetParent && (z.value || '').indexOf(m) >= 0); const z = zs[0]; if (!z) return false; let i = -1; for (let j = 0; j <= (k || 0); j++) i = z.value.indexOf(m, i + 1); z.focus(); z.setSelectionRange(i, i + m.length); return true; }, { m: mot, k }); };
const bouton = async (pg, sel) => { const ok = await pg.evaluate(s => { const b = document.querySelector(s); if (!b || !b.offsetParent) return false; return true; }, sel); if (ok) await pg.click(sel); await p(pg, 400); return ok; };
const apercu = async (pg, f, arg) => { const h = await pg.$('#at-apercu'); const fd = h ? await h.contentFrame() : null; return fd ? fd.evaluate(f, arg) : null; };
const lireForme = pg => apercu(pg, () => { const d = document.querySelector('.feuille') || document.body; const q = s => Array.from(d.querySelectorAll(s)).map(x => x.textContent.trim()).filter(Boolean); return { u: q('u'), b: q('b.p8-gras'), c: Array.from(d.querySelectorAll('span[data-coul]')).map(x => ({ t: x.textContent.trim(), c: getComputedStyle(x).color })), m: Array.from(d.querySelectorAll('mark')).map(x => ({ t: x.textContent.trim(), f: getComputedStyle(x).backgroundColor })), leg: ((d.querySelector('.f-legende') || {}).textContent || '').trim() }; });
const rendu = pg => pg.evaluate(() => { try { const s = atelierPageHTML(AT.doc, null); let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return { long: s.length, empreinte: h }; } catch (e) { return String(e.message); } });
const W = 1707, H = 743;
{ const { ctx, pg, errs } = await ouvrirCtx(W, H, stFeuilles()); await entrerProf(pg);
  const ouv = await ouvrirFeuille(pg, 'Dictée classique'); const r0 = await rendu(pg); info('A86', 'le rendu de « Le port » sans forme : ' + JSON.stringify(r0) + ' (à comparer avant / après)');
  const barre = await pg.evaluate(() => { const v = id => { const b = document.getElementById(id); return b && b.offsetParent ? (b.title || '') : null; }; const pal = id => Array.from(document.querySelectorAll('#' + id + ' .p8-p')).map(b => (b.getAttribute('data-c') || '✕') + ':' + (b.style.background || '')); const gab = new DOMParser().parseFromString('<div>' + dr_gabarit + '</div>', 'text/html'); const palD = id => Array.from(gab.querySelectorAll('#' + id + ' .p8-p')).map(b => (b.getAttribute('data-c') || '✕') + ':' + (b.style.background || ''));
    return { gras: v('atf-gras'), soul: v('atf-soul'), surl: v('atf-surl'), txt: v('atf-txt'), leg: v('atf-legende'), palSurl: pal('atf-pal-surl'), palTxt: pal('atf-pal-txt'), palSurlD: palD('at-pal-surl'), palTxtD: palD('at-pal-txt') }; });
  if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A86-1707-' + SUFF + '-editeur.png') });
  verif('A86', ouv && /^Gras \(Ctrl\+B\)/.test(barre.gras || '') && /^Souligné \(Ctrl\+U\)/.test(barre.soul || '') && /^Surligner/.test(barre.surl || '') && /^Couleur du texte/.test(barre.txt || '') && /Légende de surlignage/.test(barre.leg || '') && JSON.stringify(barre.palSurl) === JSON.stringify(barre.palSurlD) && JSON.stringify(barre.palTxt) === JSON.stringify(barre.palTxtD) && barre.palSurl.length === 5,
    'dans l\'éditeur de la feuille : G (Ctrl+B), S (Ctrl+U), « ab » et sa palette, « A » et sa palette, « Légende de surlignage » — les palettes sont celles de la diapo, couleur pour couleur', JSON.stringify(barre).slice(0, 600));
  /* poser : « Un port » (sujet) souligné, « est » (verbe conjugué) en gras, « fatiguée » (participe employé comme adjectif) en vert, « Un port » surligné en jaune ; la légende */
  const g1 = await choisir(pg, 'Un port'); await bouton(pg, '#atf-soul');
  const g2 = await choisir(pg, 'est'); await bouton(pg, '#atf-gras');
  const g3 = await choisir(pg, 'fatiguée'); await bouton(pg, '#atf-txt'); await bouton(pg, '#atf-pal-txt .p8-p[data-c="vert"]');
  const g4 = await choisir(pg, 'Un port'); await bouton(pg, '#atf-surl'); await bouton(pg, '#atf-pal-surl .p8-p[data-c="jaune"]');
  const g5 = await choisir(pg, 'sont'); await pg.keyboard.press('Control+b'); await p(pg, 400);   /* Ctrl+B dans le champ, comme dans la diapo */
  await bouton(pg, '#atf-legende'); await pg.fill('#atf-leg-in', 'jaune = sujet · Sujet souligné · verbe conjugué en gras', { timeout: 3000 }).catch(() => {}); await p(pg, 2500);
  const m0 = await lireForme(pg); if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A86-1707-' + SUFF + '-le-port.png') });
  const ok0 = f => f && f.u.includes('Un port') && f.b.includes('est') && f.b.includes('sont') && f.c.some(x => x.t === 'fatiguée' && x.c === 'rgb(30, 125, 69)') && f.m.some(x => x.t === 'Un port' && x.f === 'rgb(255, 233, 74)') && /sujet/.test(f.leg) && /Sujet souligné/.test(f.leg) && /verbe conjugué en gras/.test(f.leg);
  verif('A86', [g1, g2, g3, g4, g5].every(Boolean) && ok0(m0), '« Le port » à l\'aperçu : « Un port » souligné et surligné en jaune, « est » et « sont » en gras, « fatiguée » en vert, la légende', JSON.stringify(m0).slice(0, 500));
  const stocke = await pg.evaluate(() => JSON.stringify({ forme: AT.doc.forme, legende: AT.doc.legende }));
  info('A86', 'la donnée : ' + stocke.slice(0, 400));
  /* un second geste retire */
  await choisir(pg, 'sont'); await bouton(pg, '#atf-gras'); await p(pg, 1200); const m1 = await lireForme(pg);
  verif('A86', m1 && !m1.b.includes('sont') && m1.b.includes('est'), 'un second geste retire le gras (« sont »), le reste demeure', JSON.stringify(m1 && m1.b));
  await p(pg, 2000);
  /* rechargée : la forme est relue */
  await pg.reload({ waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg);
  await ouvrirFeuille(pg, 'Dictée classique'); const m2 = await lireForme(pg);
  verif('A86', m2 && m2.u.includes('Un port') && m2.b.includes('est') && m2.c.some(x => x.t === 'fatiguée') && m2.m.some(x => x.t === 'Un port') && /Sujet souligné/.test(m2.leg), 'après rechargement, la forme et la légende sont relues', JSON.stringify(m2).slice(0, 300));
  /* imprimée : le document de l'aperçu est celui de l'impression ; en média « print », fond blanc, les marques et leurs couleurs restent */
  await pg.emulateMedia({ media: 'print' }); await p(pg, 400);
  const imp = await apercu(pg, () => { const d = document.querySelector('.feuille') || document.body; const f = getComputedStyle(document.body).backgroundColor; const fe = getComputedStyle(d).backgroundColor; return { fond: f, fondFeuille: fe, u: d.querySelectorAll('u').length, b: d.querySelectorAll('b.p8-gras').length, c: Array.from(d.querySelectorAll('span[data-coul]')).map(x => getComputedStyle(x).color), m: Array.from(d.querySelectorAll('mark')).map(x => getComputedStyle(x).backgroundColor), leg: !!d.querySelector('.f-legende') }; });
  if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A86-1707-' + SUFF + '-impression.png') }); await pg.emulateMedia({ media: 'screen' });
  verif('A86', imp && /255, 255, 255|rgba\(0, 0, 0, 0\)/.test(imp.fond + ' ' + imp.fondFeuille) && imp.u > 0 && imp.b > 0 && imp.c.includes('rgb(30, 125, 69)') && imp.m.includes('rgb(255, 233, 74)') && imp.leg, 'à l\'impression (média print de l\'aperçu) : fond blanc, le souligné, le gras, la couleur, le surlignage et la légende', JSON.stringify(imp));
  /* « Les connecteurs logiques » : la colonne des rapports et un cas */
  const ouv2 = await ouvrirFeuille(pg, 'Les connecteurs logiques'); const r1 = await rendu(pg); info('A86', 'le rendu des connecteurs sans forme : ' + JSON.stringify(r1) + ' (à comparer avant / après)');
  const c1 = await choisir(pg, 'Cause'); await bouton(pg, '#atf-txt'); await bouton(pg, '#atf-pal-txt .p8-p[data-c="rouge"]');
  const c2 = await choisir(pg, 'car'); await bouton(pg, '#atf-surl'); await bouton(pg, '#atf-pal-surl .p8-p[data-c="vert"]'); await p(pg, 2200);
  const m4 = await lireForme(pg); if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A86-1707-' + SUFF + '-connecteurs.png') });
  const cellule = await apercu(pg, () => { const x = Array.from(document.querySelectorAll('td span[data-coul], th span[data-coul], td mark, th mark')).map(e => e.textContent.trim()); return x; });
  verif('A86', ouv2 && c1 && c2 && m4 && m4.c.some(x => x.t === 'Cause' && x.c === 'rgb(192, 57, 43)') && m4.m.some(x => x.t === 'car' && x.f === 'rgb(182, 240, 194)') && (cellule || []).length >= 2, '« Les connecteurs logiques » : « Cause » en rouge, « car » surligné en vert, dans les cases du tableau', JSON.stringify({ m4, cellule }).slice(0, 400));
  verif('A86', errs.length === 0, 'zéro erreur JS', JSON.stringify(errs.slice(0, 3))); await ctx.close(); }
await nav.close();
dire(`— fin : ${nb} vérifications · ${echecs} échec(s) — ${echecs ? 'ROUGE' : 'VERT'} · ${path.basename(FICHIER)} md5 ${MD5}`);
fs.writeFileSync(path.join(OUT, 'banc-1237.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);
