// E3 · DETTE 13 · 12 PAR LE GESTE — le curseur « texte au tableau » et la taille réellement obtenue (relance 25/10 20:23, Paul point 335) : sur une diapo pleine (la police absorbée par le plancher), le curseur à 44 puis 52 pt ; lire le libellé `#taille-l`, mesurer la police du `.corpsd` du pilote (px → pt par la loi 32 pt = 5,6 % de la hauteur), comparer ; le tableau (fenêtre) ne porte pas ce libellé. Deux tailles (1366 × 768, 1920 × 1080). Scaffold : celui de mesure-react-piece.mjs.
// usage : MJPC_ENTREE=site MJPC_HUB=AUDITS/INTEGRATION-DEROULE/hub node mesure-1312.mjs assemble/index.html [sortie.txt] [captures/]
//   Code 1 si une vérification échoue.
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
/* §12.28 (3a), M6 : l'Atelier ne lance plus — l'heure s'ouvre dans « la classe en cours » (dr_ouvrirClasse, l'entrée d'E1 que la case appelle), puis son « ▶ Lancer » */
const ouvrirLaClasse = pg => pg.evaluate(() => new Promise(r => { try { const v = document.querySelector('[data-lancer="1"]'); if (v && v.offsetParent !== null) return r(true); if (typeof dr_ouvrirClasse !== 'function' || !window.AT || !AT.edChap) return r(false); dr_ouvrirClasse(AT.edChap.level, AT.edChap.chnum, String(ATVUES.snum), () => r(true)); setTimeout(() => r(true), 4000); } catch (e) { r(false); } }));
const lancer = async pg => { await sansVoile(pg); if (SITE) { await ouvrirLaClasse(pg); await pg.waitForTimeout(1500); await sansVoile(pg); } await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(SITE ? 2500 : 600); await sansVoile(pg); if (SITE) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(200); } };
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
const FONTS = path.join(ici, '..', 'outils', 'eb-garamond');
const police = async pg => { const css = [[400, 'normal'], [400, 'italic'], [500, 'normal'], [600, 'normal'], [700, 'normal'], [800, 'normal']].map(([w, st]) => `@font-face{font-family:'EB Garamond';font-weight:${w};font-style:${st};src:url('file://${path.join(FONTS, `eb-garamond-latin-${w}-${st}.woff2`)}') format('woff2'),url('file://${path.join(FONTS, `eb-garamond-latin-ext-${w}-${st}.woff2`)}') format('woff2');}`).join('\n'); await pg.addStyleTag({ content: css }); await pg.evaluate(() => document.fonts.ready); };
const p = (pg, ms) => pg.waitForTimeout(ms);
dire('E3 · dette 13 · 12 par le geste (le curseur « texte au tableau » et la taille obtenue) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex'));
const lirePolice = pg => pg.evaluate(() => { const mur = document.getElementById('mur'); const c = mur && mur.querySelector('.corpsd'); if (!c) return null; const murH = mur.clientHeight || 616; const px = parseFloat(getComputedStyle(c).fontSize); const pt = px / (murH * 0.056) * 32; const et = (typeof etatDiapo === 'function') ? etatDiapo() : null; const tl = document.getElementById('taille-l'); const cur = document.getElementById('taille');
  return { murH, px: +px.toFixed(2), pt: +pt.toFixed(1), demande: cur ? CRANS[+cur.value] : null, cran: cur ? +cur.value : null, libelle: tl ? tl.textContent.trim() : null, infobulle: tl ? (tl.title || '') : null, reduite: et ? et.policeReduite : undefined, deborde: c.scrollHeight > c.clientHeight + 2, pages: ((mur.querySelector('.page') || {}).textContent || '').trim() }; });
const curseur = (pg, v) => pg.evaluate(v => { const cur = document.getElementById('taille'); cur.value = String(v); cur.dispatchEvent(new Event('input', { bubbles: true })); }, v);
/* une diapo pleine : celle qui, à 52 pt, ne peut pas grossir (policeReduite ou pages) — on avance jusqu'à en trouver une parmi les premières diapos de l'heure */
const diapoPleine = async pg => { for (let i = 0; i < 12; i++) { await curseur(pg, 4); await p(pg, 400); const r = await lirePolice(pg); if (r && (r.reduite || r.pages || r.pt < 50)) return { i, r }; await curseur(pg, 1); await p(pg, 200); await pg.click('#bsuiv, [data-suiv], #bdev').catch(() => {}); await p(pg, 300); } return null; };
for (const [w, hh] of [[1366, 768], [1920, 1080]]) { const T = w + '×' + hh;
await CAS('P-' + w, '13 · 12 par le geste, ' + T + ' : le curseur à 44 puis 52 sur une diapo pleine', async () => {
  const o = await ouvrir(w, hh, false); const pg = o.pg; await police(pg); await lancer(pg); await dev(pg, 14); await p(pg, 400);
  const d = await diapoPleine(pg); verif('P', !!d, T + ' · une diapo pleine est trouvée (à 52 pt la police ne peut pas grossir : policeReduite, pages, ou police obtenue < 50 pt)', d ? 'diapo ' + d.i + ' : à 52 pt obtenu ' + d.r.pt + ' pt, policeReduite ' + d.r.reduite + ', pages « ' + d.r.pages + ' »' : 'aucune parmi les 12 premières');
  if (!d) return fin('P-' + w, o);
  for (const [cran, pt] of [[3, 44], [4, 52]]) { await curseur(pg, cran); await p(pg, 500); const r = await lirePolice(pg); await cap(pg, 'P-' + w + '-curseur-' + pt);
    dire('    curseur ' + pt + ' pt : libellé « ' + r.libelle + ' » · police du corps ' + r.px + ' px = ' + r.pt + ' pt (mur ' + r.murH + ' px) · policeReduite ' + r.reduite + (r.infobulle ? ' · infobulle « ' + r.infobulle.slice(0, 80) + ' »' : '') + (r.pages ? ' · pages « ' + r.pages + ' »' : ''));
    const differe = Math.abs(r.pt - pt) > 1.5; const m = String(r.libelle || '').match(/(\d+)\s*pt\s*→\s*(\d+)/); const annonce = m ? +m[2] : null;
    if (differe) { verif('P', annonce != null, T + ' · à ' + pt + ' pt demandés la diapo reste à ' + r.pt + ' pt : le libellé du curseur dit la taille réellement obtenue (« ' + pt + ' pt → N »)', 'libellé « ' + r.libelle + ' »');
      if (annonce != null) verif('P', Math.abs(annonce - r.pt) <= 1.5, T + ' · la taille annoncée (' + annonce + ' pt) est celle mesurée au corps (' + r.pt + ' pt, ± 1,5)', (annonce - r.pt).toFixed(1) + ' pt d\'écart'); }
    else verif('P', annonce == null, T + ' · à ' + pt + ' pt demandés la diapo les obtient (' + r.pt + ' pt) : le libellé ne dit rien de plus', 'libellé « ' + r.libelle + ' »'); }
  let fen = null; try { fen = await ouvrirTableau(pg); } catch (x) {}
  if (fen) { const n = await fen.evaluate(() => Array.from(document.querySelectorAll('body *')).filter(el => el.children.length === 0 && el.getBoundingClientRect().height > 0 && /texte au tableau|pt →/.test(el.textContent || '')).length); verif('P', n === 0, T + ' · rien du curseur ni de la taille annoncée dans la fenêtre du tableau', n + ' élément(s)'); await fen.close().catch(() => {}); } else absent('P', T + ' · la fenêtre du tableau', 'ne s\'est pas ouverte');
  await fin('P-' + w, o); }); }
await nav.close();
dire(''); dire('mesure 13 · 12 : ' + nb + ' vérifications, ' + echecs + ' échec(s)' + (echecs ? ' — ROUGE' : ' — VERT'));
if (SORTIE) fs.writeFileSync(SORTIE, R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);
