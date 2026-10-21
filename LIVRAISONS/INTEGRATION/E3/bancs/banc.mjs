// LE BANC UNIQUE D'E3 — le tableau, par le geste (contrat §9 ; mandat E3, « bancs par le geste »).
// usage : node banc.mjs <fichier.html> [sortie.txt] [dossier-captures]
//   MJPC_ENTREE=site : le fichier est index.html intégré (assemble/index.html), joué par l'entrée du site sur le faux hub, horloge au 14/09 09:00 ;
//   sans la variable : le fichier est la maquette p8-5g, jouée seule (les bancs écrits avant E1-a, qui passeront ensuite sur le site).
//   MJPC_HUB, MJPC_PLAYWRIGHT, MJPC_CHROMIUM comme les outils de la conscience. Code 1 si un seul cas échoue.
// Ce que chaque cas prouve est dit dans sa ligne ; un cas qui ne peut pas se jouer sur l'entrée choisie est « absent » (écrit, jamais compté vert).
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';

const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null; const CAPT = process.argv[4] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc.mjs <fichier.html> [sortie.txt] [captures/]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', path.join(path.dirname(FICHIER), 'node_modules', 'playwright'), 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const SITE = process.env.MJPC_ENTREE === 'site';
const ici = path.dirname(new URL(import.meta.url).pathname);
const HUB = path.resolve(process.env.MJPC_HUB || path.join(ici, '..', '..', '..', '..', 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const URL0 = 'file://' + FICHIER;

const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null ? ' — ' + detail : '')); return !!ok; };
const absent = (k, quoi, detail) => dire('  absent ' + k + ' · ' + quoi + (detail ? ' — ' + detail : ''));
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });

// ── le faux hub (le même dispositif que parcours.mjs et controles.mjs) ──
const hubStore0 = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); return { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } }; };
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } }; try { st.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {}
  /* comme les contrôles v2.2 de la conscience : on joue l'HEURE 1 d'une séance jamais jouée — l'heure du 07/09 que porte le faux hub ferait lancer l'heure 2 (F2, 13 · 26) */
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {} return st; };
const hubBrut = () => { const st = hubStore0(); return st; };
const fauxHub = s => { /* le hub survit au rechargement de l'onglet (sessionStorage), comme le vrai hub survit au rechargement du pilote */ let sv = null; try { sv = sessionStorage.getItem('__E3HUB'); } catch (e) {} window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = []; const garder = () => { try { sessionStorage.setItem('__E3HUB', JSON.stringify(window.__HUB)); } catch (e) {} }; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; garder(); };
  window.__hubLire = lire; window.__hubPoser = pos;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });

// ── l'entrée : la maquette seule, ou le site par ses gestes jusqu'au Pilotage ──
const ouvrir = async (w = 1366, h = 768, brut = false) => { const ctx = await nav.newContext({ viewport: { width: w, height: h }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = [], boites = [];
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); ctx.on('page', p => { if (p !== pg) p.on('pageerror', e => errs.push('[fenêtre du tableau] ' + String(e.message).slice(0, 160))); }); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
  if (!SITE) { await pg.goto(URL0); await pg.waitForTimeout(700); return { ctx, pg, errs, boites }; }
  await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
  await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, brut ? hubBrut() : hubStore());
  await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await pg.waitForTimeout(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await pg.waitForTimeout(300);
  await pg.click('#tprof-btn'); await pg.waitForTimeout(500); await pg.evaluate(() => atelierOuvrir()); await pg.waitForTimeout(1000);
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await pg.waitForTimeout(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l\u2019atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await pg.waitForTimeout(2500);
  await sansVoile(pg); return { ctx, pg, errs, boites }; };
// le voile « n fiches d'applications ne sont pas à jour » (#fi-overlay) recouvre le site sur le faux hub (audit E1 F15 : /manifestes manque) : il n'est pas du tableau, on le retire
const sansVoile = pg => pg.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); }).catch(() => {});
const lancer = async pg => { await sansVoile(pg); await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(SITE ? 2500 : 600); await sansVoile(pg); if (SITE) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(200); } };
const ouvrirTableau = async pg => { const [fen] = await Promise.all([pg.waitForEvent('popup'), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.waitForTimeout(SITE ? 1500 : 900); return fen; };
// ce que montre une diapo : au pilote, #mur ; dans la fenêtre, #mur2 (.mur.tableau) — la page tableau ne doit jamais contenir #mur (audit I3)
const lire = (ctx, quel) => ctx.evaluate(q => { const mur = q === 'pilote' ? document.getElementById('mur') : (document.getElementById('mur2') || document.querySelector('.mur.tableau')); if (!mur) return null; const mb = mur.getBoundingClientRect(); const c = mur.querySelector('.corpsd') || mur;
  const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0');
  const act = (mur.querySelector('.act') || {}).textContent || '';
  return { page: ((mur.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), act: act.trim().slice(0, 60), lignes: els.map(l => l.getAttribute('data-p') || l.textContent.trim().slice(0, 24)), hors: els.filter(e => { const b = e.getBoundingClientRect(); return b.top < mb.top - 1 || b.bottom > mb.bottom + 1; }).length, mur: !!document.getElementById('mur'), id: mur.id, cls: mur.className }; }, quel);
const pareil = (a, b) => !!a && !!b && a.page === b.page && a.act === b.act && JSON.stringify(a.lignes) === JSON.stringify(b.lignes);
const dev = async (pg, n) => { for (let i = 0; i < n; i++) { await pg.click('#bdev'); await pg.waitForTimeout(90); } };
const cap = async (ctx, n) => { if (CAPT) { try { await ctx.screenshot({ path: path.join(CAPT, n + '.png') }); } catch (e) {} } };
const fin = (k, o) => { verif(k, !o.errs.length, 'aucune erreur JS au pilote ni dans la fenêtre du tableau', o.errs.join(' ; ') || undefined); verif(k, !o.boites.length, 'aucune boîte système', o.boites.join(' ; ') || undefined); return o.ctx.close(); };
const CAS = async (k, titre, f) => { dire(''); dire(k + ' — ' + titre); try { await f(); } catch (e) { verif(k, false, 'le cas n\'a pas pu aller au bout', String(e.message).split('\n')[0]); } };

dire('banc E3 (le tableau) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · entrée ' + (SITE ? 'SITE (faux hub ' + HUB + ')' : 'MAQUETTE seule') + ' · fichier md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex') + ' · ' + fs.statSync(FICHIER).size + ' o');

// T1 — la fenêtre locale (mandat point 1, P8) : heure lancée, trois dévoilements, « ⧉ Ouvrir le tableau » → la fenêtre est la page elle-même, #mur2 montre la diapo 1 avec trois lignes ;
//      un dévoilement de plus → la fenêtre suit, sans rechargement.
await CAS('T1', 'la fenêtre locale montre ce que voit la classe, et suit sans rechargement', async () => { const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 3); await pg.waitForTimeout(300);
  const pil = await lire(pg, 'pilote'); const fen = await ouvrirTableau(pg); const url = fen.url(); const t0 = await lire(fen, 'tableau'); await cap(fen, 'T1-fenetre-trois-devoiles');
  if (SITE) verif('T1', /[?&]vue=tableau/.test(url) && /[?&]local=1/.test(url), 'la fenêtre est la page elle-même, `?vue=tableau&local=1`', url.slice(-60)); else absent('T1', 'la fenêtre est `?vue=tableau&local=1`', 'maquette : ' + (url || 'about:blank') + ' (document.write) — se jouera sur le site');
  verif('T1', !!t0 && t0.id === 'mur2' && /\btableau\b/.test(t0.cls), 'la fenêtre rend dans #mur2.mur.tableau', t0 ? '#' + t0.id + ' .' + t0.cls : 'rien');
  verif('T1', !!t0 && !t0.mur, 'la page du tableau ne contient pas #mur (les contrôles lisent #mur d\'abord)', t0 ? String(t0.mur) : '—');
  verif('T1', !!pil && pil.lignes.length === 3, 'au pilote : la diapo 1, trois lignes dévoilées', pil ? pil.lignes.length + ' l. « ' + pil.act + ' »' : '—');
  verif('T1', pareil(pil, t0) && t0.hors === 0, 'à l\'ouverture : même diapo, mêmes lignes, même compteur que le pilote, rien hors du cadre', `pilote ${pil && pil.lignes.length} l. « ${pil && pil.page} » · tableau ${t0 && t0.lignes.length} l. « ${t0 && t0.page} », hors ${t0 && t0.hors}`);
  await fen.evaluate(() => { window.__pasRecharge = 1; }); await dev(pg, 1); await pg.waitForTimeout(700); const p1 = await lire(pg, 'pilote'), t1 = await lire(fen, 'tableau'); const garde = await fen.evaluate(() => window.__pasRecharge === 1);
  verif('T1', pareil(p1, t1) && t1.lignes.length === 4, 'un ▶ de plus : la fenêtre suit (quatre lignes, comme le pilote) dans les 700 ms', `pilote ${p1.lignes.length} l. · tableau ${t1 && t1.lignes.length} l.`);
  verif('T1', garde, 'sans rechargement de la fenêtre', String(garde)); await cap(fen, 'T1-fenetre-quatre-devoiles');
  if (SITE) { await pg.evaluate(() => dr_versMur(null, { sortie: true })); await pg.waitForTimeout(400); const vide = await lire(fen, 'tableau');
    await pg.evaluate(() => dr_versMur(S.mur)); await pg.waitForTimeout(400); const remis = await lire(fen, 'tableau');
    verif('T1', !!vide && vide.lignes.length === 0 && pareil(remis, t1), 'le crochet `dr_versMur` (relance F7) : `null` vide la fenêtre, `S.mur` la remontre', `vide ${vide && vide.lignes.length} l. · remis ${remis && remis.lignes.length} l.`);
    await pg.evaluate(() => { S.fichePage = { di: S.di, bi: 0 }; dr_versMur(null, { sortie: true }); S.fichePage = null; }); await pg.waitForTimeout(400); const fiche = await lire(fen, 'tableau');
    verif('T1', pareil(fiche, t1), 'la fiche se referme (`dr_versMur(null, {sortie:true})` pendant `S.fichePage`) : la fenêtre garde son image, elle ne se vide pas', `${fiche && fiche.lignes.length} l.`);
    const branche = await pg.evaluate(() => /dr_versMur/.test(String(pousser)) || /dr_auMur/.test(String(pousser))); verif('T1', branche, '`pousser` du socle appelle le crochet (dr_auMur → dr_versMur)', String(branche));
    const ses = await pg.evaluate(() => { const s = document.getElementById('dr-session'); return s ? s.textContent.trim() : null; }); verif('T1', !!ses && /● session/.test(ses) && !/coupée/.test(ses), 'le témoin « ● session » (#dr-session, posé par E1, rempli par E3) dit que la scène arrive au hub', ses || 'absent'); }
  const errF = []; fen.on('pageerror', e => errF.push(String(e.message).slice(0, 120))); await fen.waitForTimeout(3000);
  verif('T1', errF.length === 0, 'la fenêtre tourne 3 s sans aucune erreur JS (relecteurs 1 n° 5, 2 n° 1 : `tick` sans #fin)', errF.join(' ; ') || '0');
  if (SITE) { const c3 = await nav.newContext(); await c3.route(u => !String(u).startsWith('file:'), r => r.abort()); const p3 = await c3.newPage(); const e3 = []; p3.on('pageerror', e => e3.push(String(e.message).slice(0, 120)));
    await p3.goto(URL0 + '?vue=tableau&local=1'); await p3.waitForTimeout(4000); await c3.close();
    verif('T1', e3.length === 0, 'la page `?vue=tableau&local=1` chargée seule tourne 4 s sans erreur JS', e3.length + ' erreur(s) ' + (e3[0] || '')); }
  await fen.close(); await fin('T1', o); });

// T2 — le gel vu de la fenêtre (mandat point 5 ; cadrage 1 §2.1) : gelé, le pilote avance de trois ▶ et change de diapo — la fenêtre ne bouge pas ; dégelé ici, elle rattrape le pilote.
await CAS('T2', 'gelé, la fenêtre ne bouge pas pendant que le pilote avance ; dégelée, elle rattrape', async () => { const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 2); const fen = await ouvrirTableau(pg); const a = await lire(fen, 'tableau');
  await pg.click('#bgel'); await pg.waitForTimeout(300); const gele = await pg.evaluate(() => document.body.classList.contains('gel')); verif('T2', gele, '❄ : le pilote est gelé (body.gel)');
  await dev(pg, 3); await pg.waitForTimeout(600); const p = await lire(pg, 'pilote'), b = await lire(fen, 'tableau'); await cap(fen, 'T2-gel-fenetre-tenue');
  verif('T2', pareil(a, b) && !pareil(p, b), 'trois ▶ pendant le gel : la fenêtre montre toujours ce qu\'elle montrait, le pilote a avancé', `avant ${a.lignes.length} l. « ${a.act} » · pendant ${b.lignes.length} l. « ${b.act} » · pilote ${p.lignes.length} l. « ${p.act} »`);
  await pg.click('#bgel'); await pg.waitForTimeout(400); const g2 = await pg.evaluate(() => { const g = document.getElementById('garde2'); return !!(g && g.classList.contains('on')); }); if (g2) { await pg.click('#garde2-ici'); await pg.waitForTimeout(500); }
  const p2 = await lire(pg, 'pilote'), c = await lire(fen, 'tableau'); await cap(fen, 'T2-degel-fenetre-rattrape');
  verif('T2', pareil(p2, c), 'dégelé ici' + (g2 ? ' (seconde garde : « Dégeler ici »)' : '') + ' : la fenêtre montre ce que montre le pilote', `pilote ${p2.lignes.length} l. « ${p2.act} » · tableau ${c && c.lignes.length} l. « ${c && c.act} »`);
  await fen.close(); await fin('T2', o); });

// T3 — la fenêtre ouverte pendant le gel (p8-5g, point 1 : à `pret`, « ce que la classe voit, gel compris ») : elle montre l'image gelée, pas le pilote.
await CAS('T3', 'ouverte pendant le gel, la fenêtre montre l\'image gelée', async () => { const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 2); const p0 = await lire(pg, 'pilote');
  await pg.click('#bgel'); await pg.waitForTimeout(300); await dev(pg, 3); await pg.waitForTimeout(300); const p1 = await lire(pg, 'pilote');
  const fen = await ouvrirTableau(pg); const t = await lire(fen, 'tableau'); await cap(fen, 'T3-ouverte-pendant-le-gel');
  verif('T3', pareil(p0, t) && !pareil(p1, t), 'la fenêtre montre ce que la classe voyait au gel (2 lignes), pas le pilote (5)', `gel ${p0.lignes.length} l. · pilote ${p1.lignes.length} l. · tableau ${t && t.lignes.length} l.`);
  await fen.close(); await fin('T3', o); });

// T4 — la vue « ⧉ Tableau » du pilote (mandat point 8 ; K11) : elle montre ce que montre la fenêtre (même rendu).
await CAS('T4', 'la vue « ⧉ Tableau » du pilote montre ce que montre la fenêtre', async () => { const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 3); const fen = await ouvrirTableau(pg); await pg.click('#btableau'); await pg.waitForTimeout(500);
  const vue = await pg.evaluate(() => { const mur = Array.from(document.querySelectorAll('.mur.tableau')).find(m => m.id !== 'mur2' && !m.closest('#volet') && m.id !== 'p8-banc' && m.getBoundingClientRect().width > 0); if (!mur) return null; const c = mur.querySelector('.corpsd') || mur; return { lignes: Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0).map(l => l.getAttribute('data-p')), act: ((mur.querySelector('.act') || {}).textContent || '').trim().slice(0, 60) }; });
  const t = await lire(fen, 'tableau'); await cap(pg, 'T4-vue-tableau-du-pilote');
  verif('T4', !!vue && !!t && JSON.stringify(vue.lignes) === JSON.stringify(t.lignes) && vue.act === t.act, 'mêmes lignes, même diapo', `vue ${vue && vue.lignes.length} l. · fenêtre ${t && t.lignes.length} l.`);
  await fen.close(); await fin('T4', o); });

// T5 — la page tableau, appareil distant (mandat points 4-5) : la garde lecture seule, l'écran d'attente, la scène suivie, l'image gardée. Se joue sur le site seulement.
await CAS('T5', 'le tableau distant (`?vue=tableau`) : attente, garde, scène suivie, image gardée', async () => {
  if (!SITE) { absent('T5', 'la page `?vue=tableau` n\'existe pas dans la maquette', 'se jouera sur assemble/index.html'); return; }
  // le pilote : une heure lancée, trois dévoilements → sa scène au faux hub
  const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 3); await pg.waitForTimeout(1200);
  const hubPilote = () => pg.evaluate(() => { const c = window.__hubLire('/site/cours_actif'); if (!c) return { c: null }; const b = '/site/' + c.niveau + '/chapitres/' + c.chapitre + '/seances/' + c.seance + '/deroule_joue/' + c.classeSlug; return { c, b, scene: window.__hubLire(b + '/scene'), ecrans: window.__hubLire(b + '/ecrans'), part: window.__hubLire(b + '/part') }; });
  const h0 = await hubPilote(); verif('T5', !!h0.c && !!h0.scene, 'le pilote a écrit `cours_actif` et `C/scene`', h0.c ? h0.b : 'pas de cours_actif');
  verif('T5', !!h0.scene && h0.scene.eid && h0.scene.ts && h0.scene.origine && ('trameMaj' in h0.scene) && h0.scene.nDev === 3, 'la scène = `et` + {eid, origine, ts, trameMaj}, nDev 3', h0.scene ? Object.keys(h0.scene).slice(0, 14).join(',') : '—');
  verif('T5', !!h0.scene && !('rev' in h0.scene) && !('vues' in h0.scene) && !('morceau' in h0.scene) && !('iz' in h0.scene), 'rev, vues, morceau, iz tombent', '');
  // le distant : un second contexte, le même faux hub au départ, sans cours actif → l'attente
  const ctx2 = await nav.newContext({ viewport: { width: 1280, height: 720 }, timezoneId: 'Europe/Paris' }); await ctx2.route(u => !String(u).startsWith('file:'), r => r.abort());
  const tb = await ctx2.newPage(); const errs2 = []; tb.on('pageerror', e => errs2.push(String(e.message).slice(0, 160))); const st = hubStore(); await tb.clock.setFixedTime(new Date('2026-09-14T08:50:00+02:00')); await tb.addInitScript(fauxHub, st);
  await tb.goto(URL0 + '?vue=tableau&n=3e', { waitUntil: 'load' }); await tb.waitForTimeout(2500);
  const att = await tb.evaluate(() => { const a = document.getElementById('ses-tab-att') || document.getElementById('dr-attente'); return a && a.offsetParent !== null ? a.innerText.replace(/\s+/g, ' ').trim() : null; }); await cap(tb, 'T5-attente');
  verif('T5', !!att && /monsieurjaipascompris/i.test(att) && /\d\d:\d\d/.test(att), 'sans cours actif : l\'écran d\'attente (le nom du site, l\'heure, la date)', att || '—');
  verif('T5', !!att && /Classe attendue : 3E Charles de Gaulle · 08:57 – 09:52/.test(att), 'à 08:50 (`?n=3e`) : la classe attendue, lue dans la grille en lecture seule (réveil n°3)', att || '—');
  // le pilote publie : on recopie sa scène, son pointeur et sa copie dans le faux hub du distant (deux contextes ne partagent pas la mémoire — audit I2)
  const relais = async h => tb.evaluate(h => { window.__hubPoser('/site/cours_actif', h.c); window.__hubPoser(h.b + '/ecrans', h.ecrans); window.__hubPoser(h.b + '/scene', h.scene); }, h);
  await tb.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await relais(h0); const t0r = Date.now(); let vu = null;
  while (Date.now() - t0r < 6000) { const r = await lire(tb, 'tableau'); if (r && r.lignes.length === 3) { vu = r; break; } await pause(50); } const delai = Date.now() - t0r;
  await cap(tb, 'T5-distant-suit'); const pil = await lire(pg, 'pilote');
  verif('T5', pareil(pil, vu), 'une scène arrive : l\'attente disparaît, #mur2 montre la diapo du pilote, trois lignes', `pilote ${pil.lignes.length} l. « ${pil.act} » · distant ${vu ? vu.lignes.length + ' l. « ' + vu.act + ' »' : 'rien'}`);
  verif('T5', !!vu && delai <= 2000 + 900 + 600, 'la première scène paraît après la recherche du cours (2 s) et un sondage (900 ms)', delai + ' ms depuis l\'écriture dans son hub');
  // suivre : un ▶ au pilote → relayé → le distant suit
  await dev(pg, 1); await pg.waitForTimeout(500); const h1 = await hubPilote(); await relais(h1); const t1r = Date.now(); let vu1 = null; while (Date.now() - t1r < 6000) { const r = await lire(tb, 'tableau'); if (r && r.lignes.length === 4) { vu1 = r; break; } await pause(50); }
  const d1 = Date.now() - t1r; verif('T5', !!vu1 && d1 <= 1200, 'un ▶ de plus : le distant suit (quatre lignes) en ≤ 900 ms de sondage + rendu (mesure proposée, audit I2)', d1 + ' ms depuis l\'écriture dans son hub');
  // le délai (relance C4/I2) : 10 ▶, chacun relayé ; médiane et maximum, attendu ≤ 1 500 ms au maximum (pilote → hub du distant → #mur2)
  const delais = []; for (let g = 0; g < 10; g++) { const r0 = await lire(tb, 'tableau'); const tg = Date.now(); await dev(pg, 1);
    let ok = false; while (Date.now() - tg < 4000) { await relais(await hubPilote()); const r = await lire(tb, 'tableau'); if (r && !pareil(r, r0)) { ok = true; break; } await pause(25); }   /* le banc recopie le hub du pilote en continu : un hub partagé */ delais.push(ok ? Date.now() - tg : 9999); }
  const tri = delais.slice().sort((a, b) => a - b); const med = tri[5], max = tri[9];
  verif('T5', max <= 1500, `10 ▶ : du clic au distant, médiane ${med} ms, maximum ${max} ms (attendu ≤ 1 500 ms au maximum ; veille 125 + débounce 250 + sondage 900)`, delais.join(' '));
  { const dern = await hubPilote(); h1.scene = Object.assign({}, h1.scene, { ts: dern.scene.ts + 1000 }); await relais(h1); await pause(1500); }   /* on remet la diapo à 4 lignes pour la suite */
  // le pilote se ferme : plus de scène neuve → l'image reste (30 s d'horloge du distant)
  await fin('T5', o); const avant = await lire(tb, 'tableau'); await tb.clock.runFor(30000).catch(async () => { await pause(1500); }); await pause(1200); const apres = await lire(tb, 'tableau'); await cap(tb, 'T5-pilote-ferme-image-gardee');
  verif('T5', pareil(avant, apres) && apres.lignes.length === 4, 'le pilote fermé : 30 s plus tard, le distant garde sa dernière image', `${apres && apres.lignes.length} l.`);
  // une scène plus ancienne (ts antérieur) n'est jamais acceptée
  await tb.evaluate(h => { const s = Object.assign({}, h.scene, { nDev: 1, ts: h.scene.ts - 60000 }); window.__hubPoser(h.b + '/scene', s); }, h1); await pause(1500); const vieux = await lire(tb, 'tableau');
  verif('T5', !!vieux && vieux.lignes.length === 4, 'une scène plus ancienne que la dernière montrée est refusée', `${vieux && vieux.lignes.length} l.`);
  // une scène dont l'heure n'est pas un nombre est ignorée (relecteur 2, n° 5c) ; une scène « du futur » ne bloque pas la suite (n° 5b)
  await tb.evaluate(h => { window.__hubPoser(h.b + '/scene', Object.assign({}, h.scene, { nDev: 1, ts: '9999999999999' })); }, h1); await pause(1500); const txt = await lire(tb, 'tableau');
  verif('T5', !!txt && txt.lignes.length === 4, 'une scène à l\'heure illisible (texte) est ignorée', `${txt && txt.lignes.length} l.`);
  await tb.evaluate(h => { window.__hubPoser(h.b + '/scene', Object.assign({}, h.scene, { nDev: 2, ts: Date.now() + 3600000 })); }, h1); await pause(1500);
  await tb.evaluate(h => { window.__hubPoser(h.b + '/scene', Object.assign({}, h.scene, { nDev: 3, ts: Date.now() + 1000 })); }, h1); await pause(1500); const apresFutur = await lire(tb, 'tableau');
  verif('T5', !!apresFutur && apresFutur.lignes.length === 3, 'après une scène venue d\'une horloge en avance, la scène vraie suivante passe', `${apresFutur && apresFutur.lignes.length} l.`);
  // le pilote absent (pointeur retiré) : une scène plus récente n'est pas acceptée (mandat point 5 ; relecteur 2, n° 5a)
  await tb.evaluate(h => { window.__hubPoser('/site/cours_actif', null); }, h1); await pause(3600);
  await tb.evaluate(h => { window.__hubPoser(h.b + '/scene', Object.assign({}, h.scene, { nDev: 1, ts: Date.now() + 5000 })); }, h1); await pause(1500); const absentP = await lire(tb, 'tableau');
  verif('T5', !!absentP && absentP.lignes.length === 3, 'pointeur retiré : une scène plus récente est refusée, l\'image reste', `${absentP && absentP.lignes.length} l.`);
  // la garde : aucune écriture, aucune tentative
  const g = await tb.evaluate(() => ({ ecr: (window.__ECR || []).slice(), bloq: (window.SES && SES.ecrituresBloquees) | 0, mode: window.SES && SES.mode }));
  verif('T5', g.mode === 'tableau' && g.ecr.length === 0, 'K15 en vue tableau : zéro écriture au hub', g.ecr.join(' ') || '0');
  verif('T5', g.bloq === 0, 'personne n\'a même essayé d\'écrire (`SES.ecrituresBloquees` = 0)', String(g.bloq));
  const essai = await tb.evaluate(() => fetch('https://x.firebasedatabase.app/site/essai.json', { method: 'PUT', body: '1' }).then(() => 'passé', () => 'refusé')); const g2 = await tb.evaluate(() => ({ ecr: window.__ECR.length, bloq: SES.ecrituresBloquees }));
  verif('T5', essai === 'refusé' && g2.ecr === 0 && g2.bloq === 1, 'une écriture tentée est refusée et comptée', `${essai}, ${g2.bloq} bloquée(s), ${g2.ecr} au hub`);
  const bea = await tb.evaluate(() => { const r = navigator.sendBeacon('https://x.firebasedatabase.app/presence/x.json', 'x'); return { r, bloq: SES.ecrituresBloquees }; });
  verif('T5', bea.r === false && bea.bloq === 2, '`sendBeacon` aussi est refusé et compté (relance M8)', JSON.stringify(bea));
  verif('T5', !errs2.length, 'aucune erreur JS au distant', errs2.join(' ; ') || undefined);
  await ctx2.close(); });

// T6 — la participation (relance C8 : `C/part` tombe ; M4 : « qui a participé » au tableau suit la parole). Site seulement.
await CAS('T6', 'la participation : plus de `C/part` ; « qui a participé » au tableau suit la parole', async () => {
  if (!SITE) { absent('T6', 'la maquette n\'écrit rien au hub', 'se jouera sur le site'); return; }
  const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 1); const fen = await ouvrirTableau(pg);
  const qui = await pg.evaluate(() => { try { const c = dr_classe(); const n = String((c.eleves || [])[1] || (c.eleves || [])[0] || ''); const p = n.split(/\s+/).slice(-1)[0] || n; return p.slice(0, 4); } catch (e) { return 'a'; } });
  const parler = async () => { await pg.keyboard.press('F2'); await pg.waitForTimeout(200); await pg.keyboard.type(qui); await pg.waitForTimeout(150); await pg.keyboard.press('1'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(800); };
  await parler();
  const ecr = await pg.evaluate(() => window.__ECR.filter(e => /\/part$/.test(e)));
  verif('T6', ecr.length === 0, 'une parole n\'écrit plus `C/part` (plus de lecteur ; elle vit dans `C/etat` et le journal)', ecr.join(' ') || '0');
  await pg.evaluate(() => { if (typeof basculerQui === 'function') basculerQui('banc'); }); await pg.waitForTimeout(800);
  const q1 = await fen.evaluate(() => { const q = document.querySelector('#mur2 .quiw .quit'); return q ? q.textContent : null; });
  await parler(); await pg.waitForTimeout(500);
  const q2 = await fen.evaluate(() => { const q = document.querySelector('#mur2 .quiw .quil'); return q ? q.textContent : null; }); await cap(fen, 'T6-qui-suit-la-parole');
  verif('T6', !!q1 && /1 élève/.test(q1), '« qui a participé » affiché au tableau', q1 || '—');
  verif('T6', !!q2 && /×2/.test(q2), 'une parole de plus pendant que la boîte est au tableau : elle suit (×2) sans réafficher la boîte (M4)', q2 || '—');
  await fen.close(); await fin('T6', o); });

// T7 — R3, le minuteur d'activité au tableau (recyclage R3 ; E2 le calcule, E3 le transporte) : « au tableau » coché → la fenêtre et la scène portent « ⏱ mm:ss » en bandeau ; « Arrêter » → il part.
await CAS('T7', 'le minuteur d\'activité au tableau (R3) : fenêtre et scène', async () => {
  if (!SITE) { absent('T7', 'la maquette n\'a pas le minuteur (R3 est d\'E2)', ''); return; }
  const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 1);
  if (!(await pg.$('#dr-minut-b'))) { absent('T7', 'pas de bouton ⏱ (E2)'); await fin('T7', o); return; }
  const fen = await ouvrirTableau(pg);
  await pg.click('#dr-minut-b'); await pg.fill('#dr-minut-in', '05:00'); await pg.check('#dr-minut-tab'); await pg.click('#dr-minut-go'); await pg.waitForTimeout(1500);
  const band = await fen.evaluate(() => { const b = document.querySelector('#mur2 .bandeau'); return b ? { txt: b.textContent.trim(), on: b.classList.contains('on') } : null; });
  const sc = await pg.evaluate(() => { const c = window.__hubLire('/site/cours_actif'); return c ? window.__hubLire('/site/' + c.niveau + '/chapitres/' + c.chapitre + '/seances/' + c.seance + '/deroule_joue/' + c.classeSlug + '/scene') : null; });
  await cap(fen, 'T7-minuteur-au-tableau');
  verif('T7', !!band && band.on && /^⏱ \d\d:\d\d$/.test(band.txt), 'la fenêtre montre le minuteur en bandeau', band ? '« ' + band.txt + ' »' : 'pas de bandeau');
  verif('T7', !!sc && /^⏱ \d\d:\d\d$/.test(sc.bandeau || ''), 'la scène au hub le porte (le distant le montrera)', sc ? '« ' + (sc.bandeau || '') + ' »' : '—');
  await pg.click('#dr-minut-b'); await pg.click('#dr-minut-stop'); await pg.waitForTimeout(1000);
  const band2 = await fen.evaluate(() => { const b = document.querySelector('#mur2 .bandeau'); return b ? b.classList.contains('on') : false; });
  verif('T7', !band2, '« Arrêter » : le bandeau quitte le tableau', String(band2));
  await fen.close(); await fin('T7', o); });

// T8 — « Adresse du tableau » (relance F5 : le QR tombe) : un bouton à côté de « ⧉ » qui affiche l'adresse `?vue=tableau`, sans aucune écriture ; ✕ le ferme.
await CAS('T8', '« Adresse du tableau » (le QR tombe)', async () => {
  if (!SITE) { absent('T8', 'se joue sur le site', ''); return; }
  const o = await ouvrir(); const pg = o.pg; await pg.waitForTimeout(400); const avant = await pg.evaluate(() => window.__ECR.length);
  const qr = await pg.evaluate(() => typeof sesQROuvrir === 'function' || !!document.getElementById('dr-tab-qr')); verif('T8', !qr, 'le QR n\'existe plus (ni `sesQROuvrir`, ni bouton)', String(qr));
  const ok = await pg.$('#dr-tab-adr'); verif('T8', !!ok, 'le bouton « Adresse du tableau » est à côté de « ⧉ », avec son infobulle', ok ? await pg.$eval('#dr-tab-adr', b => b.textContent + ' — ' + b.title.slice(0, 50)) : 'absent'); if (!ok) { await fin('T8', o); return; }
  await pg.click('#dr-tab-adr'); await pg.waitForTimeout(400); await cap(pg, 'T8-adresse-du-tableau');
  const url = await pg.evaluate(() => { const u = document.getElementById('dr-tab-adr-url'); return u ? u.textContent : null; });
  verif('T8', !!url && /\?vue=tableau$/.test(url), 'l\'adresse affichée est celle du tableau, `?vue=tableau`', url || '—');
  const img = await pg.evaluate(() => !!document.querySelector('#dr-tab-adr-boite img')); verif('T8', !img, 'aucune image demandée au réseau (pas de QR distant)', String(img));
  await pg.click('#dr-tab-adr-x'); await pg.waitForTimeout(300); const ferme = await pg.evaluate(() => !document.getElementById('dr-tab-adr-boite'));
  verif('T8', ferme, '✕ ferme la boîte', String(ferme));
  const apres = await pg.evaluate(() => window.__ECR.length); verif('T8', apres === avant, 'aucune écriture au hub', (apres - avant) + ' écriture(s)');
  await fin('T8', o); });

// T9 — la fenêtre rechargée pendant que Paul est dans l'Atelier en pleine heure (relecteur 2, n° 3) : elle remontre ce que voit la classe.
await CAS('T9', 'la fenêtre rechargée pendant l\'Atelier remontre la classe', async () => {
  if (!SITE) { absent('T9', 'se joue sur le site'); return; }
  const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 3); const fen = await ouvrirTableau(pg); const a = await lire(fen, 'tableau');
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]') || document.getElementById('ong-atelier'); if (b) b.click(); }); await pg.waitForTimeout(800); await sansVoile(pg);
  await fen.reload(); await fen.waitForTimeout(2000); const b = await lire(fen, 'tableau'); await cap(fen, 'T9-rechargee-pendant-atelier');
  verif('T9', pareil(a, b) && b.lignes.length === 3, 'après F5 dans la fenêtre, Paul dans l\'Atelier : la diapo de la classe, trois lignes', `avant ${a && a.lignes.length} l. · après ${b ? b.lignes.length + ' l.' : 'rien'}`);
  await fen.close(); await fin('T9', o); });

// T10 — le distant dont la copie jouée est illisible : jamais une page blanche, l'attente reste (relecteur 2, n° 8).
await CAS('T10', 'le distant sans copie jouée lisible garde l\'attente', async () => {
  if (!SITE) { absent('T10', 'se joue sur le site'); return; }
  const ctx2 = await nav.newContext({ viewport: { width: 1280, height: 720 }, timezoneId: 'Europe/Paris' }); await ctx2.route(u => !String(u).startsWith('file:'), r => r.abort());
  const tb = await ctx2.newPage(); const errs2 = []; tb.on('pageerror', e => errs2.push(String(e.message).slice(0, 160))); await tb.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00'));
  const st = hubStore(); const b = '/site/3e/chapitres/0/seances/0/deroule_joue/3E Charles de Gaulle'; const t = new Date('2026-09-14T09:00:00+02:00').getTime();
  await tb.addInitScript(fauxHub, st); await tb.goto(URL0 + '?vue=tableau', { waitUntil: 'load' }); await tb.waitForTimeout(500);
  await tb.evaluate(({ b, t }) => { window.__hubPoser('/site/cours_actif', { niveau: '3e', chapitre: 0, seance: 0, classeSlug: '3E Charles de Gaulle', classeNom: '3E Charles de Gaulle', ts: t }); window.__hubPoser(b + '/scene', { si: 0, di: 0, eid: 'inconnu', nDev: 2, lum: [], ecr: [], reps: {}, ts: t + 10, origine: 'x', trameMaj: 0 }); }, { b, t });
  await tb.waitForTimeout(4000); const vis = await tb.evaluate(() => { const a = document.getElementById('ses-tab-att'); return !!(a && a.offsetParent !== null); }); await cap(tb, 'T10-sans-copie');
  verif('T10', vis, 'l\'écran d\'attente reste affiché (pas de page blanche)', String(vis)); verif('T10', !errs2.length, 'aucune erreur JS', errs2.join(' ; ') || undefined); await ctx2.close(); });

// T11 — la classe attendue suit le niveau de la page ; sans grille, rien (réveil n°3).
await CAS('T11', 'l\'attente : le niveau de la page, et rien sans grille', async () => {
  if (!SITE) { absent('T11', 'se joue sur le site'); return; }
  for (const cas of [{ q: '?vue=tableau&n=5e', st: s => s, attendu: v => !/Classe/.test(v), dit: 'niveau 5e : aucune heure de 5e ce matin → pas de classe attendue' }, { q: '?vue=tableau&n=3e', st: s => { delete s.site.edt.grille; return s; }, attendu: v => !/Classe/.test(v), dit: 'sans grille au hub : rien d\'autre que le nom du site, la date, l\'heure' }, { q: '?vue=tableau&n=3e', st: s => s, h: '2026-09-14T10:30:00+02:00', attendu: v => /Classe attendue : 3E Charles de Gaulle · 13:00|Classe attendue : .* · \d\d:\d\d/.test(v) || !/08:57/.test(v), dit: 'à 10:30, l\'heure de 08:57 est passée : elle n\'est plus attendue' }]) {
    const c = await nav.newContext({ timezoneId: 'Europe/Paris' }); await c.route(u => !String(u).startsWith('file:'), r => r.abort()); const t = await c.newPage(); await t.clock.setFixedTime(new Date(cas.h || '2026-09-14T08:50:00+02:00')); await t.addInitScript(fauxHub, cas.st(hubStore()));
    await t.goto(URL0 + cas.q); await t.waitForTimeout(2500); const v = await t.evaluate(() => document.getElementById('ses-tab-att').innerText.replace(/\s+/g, ' ')); verif('T11', cas.attendu(v), cas.dit, v); await c.close(); } });

// T12 — rien ne part au hub depuis la Relecture ; le témoin « tableau en Win K » seulement si la fenêtre est ouverte (réveil n°3, (a) et (b)).
await CAS('T12', 'la Relecture n\'écrit pas la scène ; le témoin ne ment pas', async () => {
  if (!SITE) { absent('T12', 'se joue sur le site'); return; }
  const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 2); await pg.waitForTimeout(600);
  await pg.click('#btableau'); await pg.waitForTimeout(500); const t0 = await pg.evaluate(() => (document.getElementById('vue-temoin') || {}).textContent || '');
  verif('T12', !/Win K|connecté/.test(t0), '« ⧉ Tableau » sans fenêtre ouverte : aucun support annoncé', `« ${t0.trim()} »`);
  const fen = await ouvrirTableau(pg); await pg.waitForTimeout(400); const t1 = await pg.evaluate(() => (document.getElementById('vue-temoin') || {}).textContent || '');
  verif('T12', /tableau en Win K/.test(t1), 'fenêtre ouverte : « tableau en Win K »', `« ${t1.trim()} »`);
  const n0 = await pg.evaluate(() => window.__ECR.filter(e => /\/scene$/.test(e)).length);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="relecture"]'); if (b) b.click(); }); await pg.waitForTimeout(800);
  await pg.evaluate(() => { try { S.taille = 2; dr_tout(); } catch (e) {} }); await pg.waitForTimeout(900);
  const n1 = await pg.evaluate(() => window.__ECR.filter(e => /\/scene$/.test(e)).length);
  verif('T12', n1 === n0, 'dans la Relecture, un redessin du socle n\'écrit aucune scène au hub', `${n1 - n0} écriture(s) de la scène`);
  await fen.close(); await fin('T12', o); });

// T13 — l'heure 2 d'une séance déjà jouée (le faux hub tel quel : une heure du 07/09) : elle s'ouvre là où la classe s'est arrêtée (dr_heureContinue, E2) ; la fenêtre montre cette diapo et suit.
await CAS('T13', 'l\'heure suivante : la fenêtre suit depuis le rituel', async () => {
  if (!SITE) { absent('T13', 'se joue sur le site'); return; }
  const o = await ouvrir(1366, 768, true); const pg = o.pg; await lancer(pg); const p0 = await lire(pg, 'pilote'); const fen = await ouvrirTableau(pg); const t0 = await lire(fen, 'tableau');
  verif('T13', pareil(p0, t0), 'la fenêtre montre la diapo d\'ouverture de l\'heure, comme le pilote', `pilote « ${p0 && p0.act} » ${p0 && p0.lignes.length} l. · tableau « ${t0 && t0.act} » ${t0 && t0.lignes.length} l.`);
  await dev(pg, 3); await pg.waitForTimeout(600); const p1 = await lire(pg, 'pilote'), t1 = await lire(fen, 'tableau'); await cap(fen, 'T13-heure-2');
  verif('T13', pareil(p1, t1), 'trois ▶ : la fenêtre suit', `pilote « ${p1.act} » ${p1.lignes.length} l. · tableau « ${t1 && t1.act} » ${t1 && t1.lignes.length} l.`);
  await fen.close(); await fin('T13', o); });

// T14 — le bloc écrit en classe reste au tableau après un rechargement du pilote (réveil n°6 ; relecture continue d'E4, ligne 110) :
//       la fenêtre ouverte avant le rechargement est retrouvée par le pilote rechargé et montre toujours le bloc écrit.
await CAS('T14', 'le bloc écrit en classe reste au tableau après rechargement et reprise', async () => {
  if (!SITE) { absent('T14', 'se joue sur le site'); return; }
  const o = await ouvrir(); const pg = o.pg; await lancer(pg); const fen = await ouvrirTableau(pg);
  const phrase = 'Phrase écrite en classe par le banc E3';
  /* « clique ici et écris » n'existe que dans l'Atelier (p8EcritureOuverte) : en pleine heure, Paul y passe, écrit, revient au Pilotage et dévoile */
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await pg.waitForTimeout(900); await sansVoile(pg);
  if (await pg.$('#at-aide .x')) { await pg.click('#at-aide .x'); await pg.waitForTimeout(200); }
  const z = await pg.$('#mur .p8-ecrire'); if (!z) { absent('T14', 'pas de zone « écrire » dans l\'Atelier (E1)'); await fen.close(); await fin('T14', o); return; }
  await z.click(); await pg.keyboard.type(phrase, { delay: 2 }); await pg.keyboard.press('Escape'); await pg.waitForTimeout(1200);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await pg.waitForTimeout(900); await sansVoile(pg);
  const vu = s2 => s2.evaluate(t => { const m = document.getElementById('mur') || document.getElementById('mur2'); return !!m && (m.innerText || '').indexOf(t) >= 0; }, phrase);
  for (let i = 0; i < 14 && !(await vu(fen)); i++) { await dev(pg, 1); await pg.waitForTimeout(150); const g = await pg.$('#garde.on #garde-devant'); if (g) { await g.click(); await pg.waitForTimeout(200); } }
  const v0 = await vu(fen); verif('T14', v0, 'avant : la fenêtre montre le bloc écrit', String(v0));
  await pg.waitForTimeout(1500); await pg.reload({ waitUntil: 'load' }); await pg.waitForTimeout(2500);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await pg.waitForTimeout(5500); const rep = await clicTexte(pg, 'button', 'Reprendre le cours'); await pg.waitForTimeout(4000); await sansVoile(pg); await clicTexte(pg, 'button', 'Compris'); await pg.waitForTimeout(300);
  if (!rep) absent('T14', 'pas de bannière « Reprendre le cours » après le rechargement (E2)');
  const p1 = await vu(pg); verif('T14', p1, 'après « Reprendre le cours » : le pilote montre le bloc écrit (E2 : `dr_reprendre` ne fusionne pas `C/ecrans` — ligne 110 d\'E4)', String(p1));
  await pg.waitForTimeout(3500); const f1 = await vu(fen); await cap(fen, 'T14-apres-rechargement'); const pr = await lire(pg, 'pilote'), fr = await lire(fen, 'tableau');
  verif('T14', pareil(pr, fr), 'E3 · après le rechargement, la fenêtre restée ouverte est retrouvée par le pilote rechargé (signe `ici`) et montre ce qu\'il montre', `pilote « ${pr && pr.act} » ${pr && pr.lignes.length} l. · tableau « ${fr && fr.act} » ${fr && fr.lignes.length} l.`);
  verif('T14', f1, 'le bloc écrit en classe est encore au tableau après la reprise (dépend du pilote : E2, ligne 110 d\'E4)', String(f1));
  await dev(pg, 1); await pg.waitForTimeout(1200); const pp = await lire(pg, 'pilote'), ff = await lire(fen, 'tableau');
  verif('T14', pareil(pp, ff), 'et elle suit de nouveau le pilote rechargé (un ▶)', `pilote ${pp && pp.lignes.length} l. · tableau ${ff && ff.lignes.length} l.`);
  await fen.close(); await fin('T14', o); });

// T15 — la copie d'un autre jour au tableau (réveil n°9 ; E1 `dr_jouerCopie`, contrat §12.8) : le lundi, une retouche en classe dans une diapo montrée ;
//       le mardi (même onglet rechargé, le hub gardé), l'heure suivante est lancée : la retouche de la veille est au mur, dans la fenêtre du tableau.
await CAS('T15', 'la copie d\'un autre jour : la retouche de la veille est au tableau', async () => {
  if (!SITE) { absent('T15', 'se joue sur le site'); return; }
  const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 1); await pg.waitForTimeout(300);
  const ajout = ' (retouché en classe la veille)';
  const cible = await pg.$('#mur [data-p="0.t"]'); if (!cible) { absent('T15', 'pas de texte retouchable sur la diapo 1 (E1)'); await fin('T15', o); return; }
  await cible.click(); await pg.keyboard.press('End'); await pg.keyboard.type(ajout, { delay: 2 }); await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
  await dev(pg, 2); await pg.waitForTimeout(2500);   /* la copie part au hub (900 ms), le journal aussi */
  const lundi = await pg.evaluate(t => (document.getElementById('mur').innerText || '').indexOf(t.trim()) >= 0, ajout); verif('T15', lundi, 'lundi : la retouche est au pilote', String(lundi));
  /* le lendemain : l'horloge passe au mardi 15/09 10:10 (une heure de 3E Charles de Gaulle), le pilote est rechargé, le hub est gardé */
  await pg.clock.setFixedTime(new Date('2026-09-15T10:10:00+02:00')); await pg.reload({ waitUntil: 'load' }); await pg.waitForTimeout(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await pg.waitForTimeout(300);
  await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('#ses-reprise button, button')).find(x => /Plus tard/.test(x.textContent || '')); if (b) b.click(); });
  await pg.evaluate(() => { const b = document.getElementById('tprof-btn'); if (b) b.click(); }); await pg.waitForTimeout(500); await pg.evaluate(() => atelierOuvrir()); await pg.waitForTimeout(1000);
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await pg.waitForTimeout(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await pg.waitForTimeout(2500); await sansVoile(pg);
  if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'T15-mardi-avant-lancer.png') }); await pg.evaluate(() => { const b = document.querySelector('[data-lancer="1"]'); if (b) b.click(); }); await pg.waitForTimeout(2500); await sansVoile(pg); await clicTexte(pg, 'button', 'Lancer l\u2019heure'); await clicTexte(pg, 'button', "Lancer l'heure"); await pg.waitForTimeout(2500); await sansVoile(pg); await clicTexte(pg, 'button', 'Compris'); const fen = await ouvrirTableau(pg);
  /* aller à la diapo 1 de la séance (là où la retouche a été faite) si l'heure s'ouvre ailleurs */
  const ouv = await pg.evaluate(t => (document.getElementById('mur').innerText || '').indexOf(t.trim()) >= 0, ajout);
  if (!ouv) { await pg.evaluate(() => { try { const i = dr_seances()[S.si].ecrans.findIndex(e => /routine/.test(e.act || '')); if (i >= 0) { S.di = i; S.page = null; dr_tout(); } } catch (e) {} }); await pg.waitForTimeout(500); const g = await pg.$('#garde.on #garde-devant'); if (g) { await g.click(); await pg.waitForTimeout(300); } }
  for (let i = 0; i < 3; i++) { if (await fen.evaluate(t => ((document.getElementById('mur2') || {}).innerText || '').indexOf(t.trim()) >= 0, ajout)) break; await dev(pg, 1); await pg.waitForTimeout(500); }
  const mardiP = await pg.evaluate(t => (document.getElementById('mur').innerText || '').indexOf(t.trim()) >= 0, ajout);
  const mardiT = await fen.evaluate(t => ((document.getElementById('mur2') || {}).innerText || '').indexOf(t.trim()) >= 0, ajout); await cap(fen, 'T15-copie-de-la-veille');
  verif('T15', mardiP, 'mardi, l\'heure suivante lancée : la retouche de la veille est au pilote (E1 `dr_jouerCopie`)', String(mardiP));
  verif('T15', mardiT, 'et au mur : la fenêtre du tableau la montre', String(mardiT));
  await fen.close(); await fin('T15', o); });

// T16 — le grave 148 d'E1 (réveil n°10) : en heure lancée, l'Atelier, une autre diapo, retour au Pilotage → le tableau n'a pas bougé (la diapo que la classe voyait).
await CAS('T16', 'l\'Atelier et une autre diapo en pleine heure : le tableau ne bouge pas', async () => {
  if (!SITE) { absent('T16', 'se joue sur le site'); return; }
  const o = await ouvrir(); const pg = o.pg; await lancer(pg); await dev(pg, 2); await pg.waitForTimeout(500); const fen = await ouvrirTableau(pg); const avant = await lire(fen, 'tableau');
  const scene = () => pg.evaluate(() => { const c = window.__hubLire('/site/cours_actif'); const s = c ? window.__hubLire('/site/' + c.niveau + '/chapitres/' + c.chapitre + '/seances/' + c.seance + '/deroule_joue/' + c.classeSlug + '/scene') : null; return s ? { eid: s.eid, nDev: s.nDev } : null; });
  const s0 = await scene();
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await pg.waitForTimeout(900); await sansVoile(pg);
  if (await pg.$('#at-aide .x')) { await pg.click('#at-aide .x'); await pg.waitForTimeout(200); }
  const allee = await pg.evaluate(() => { const v = document.querySelector('#volet [data-at-di="3"]') || document.querySelectorAll('#volet [data-at-di]')[3]; if (!v) return false; v.click(); return true; }); await pg.waitForTimeout(700);
  if (!allee) absent('T16', 'pas de liste des diapos dans l\'Atelier ([data-at-di])');
  const pendant = await lire(fen, 'tableau');
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await pg.waitForTimeout(1500); await sansVoile(pg);
  const g = await pg.$('#garde.on'); const apres = await lire(fen, 'tableau'); const s1 = await scene(); await cap(fen, 'T16-retour-au-pilotage');
  verif('T16', pareil(avant, pendant), 'dans l\'Atelier, sur une autre diapo : la fenêtre du tableau n\'a pas bougé', `avant « ${avant && avant.act} » ${avant && avant.lignes.length} l. · pendant « ${pendant && pendant.act} » ${pendant && pendant.lignes.length} l.`);
  verif('T16', pareil(avant, apres), 'revenu au Pilotage : le tableau montre toujours la diapo que la classe voyait (grave 148, E1)', `avant « ${avant && avant.act} » ${avant && avant.lignes.length} l. · après « ${apres && apres.act} » ${apres && apres.lignes.length} l.${g ? ' (une garde est ouverte)' : ''}`);
  verif('T16', !!s0 && !!s1 && s0.eid === s1.eid && s0.nDev === s1.nDev, 'et la scène au hub (le tableau distant) non plus', `${JSON.stringify(s0)} → ${JSON.stringify(s1)}`);
  await fen.close(); await fin('T16', o); });

dire(''); dire(`banc E3 : ${nb} vérifications, ${echecs} échec(s)` + (echecs ? ' — ROUGE' : ' — VERT'));
if (SORTIE) { fs.mkdirSync(path.dirname(path.resolve(SORTIE)), { recursive: true }); fs.writeFileSync(SORTIE, R.join('\n') + '\n'); }
await nav.close(); process.exit(echecs ? 1 : 0);
