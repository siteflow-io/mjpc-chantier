// Conscience n°13 · 26/10/2026 — LA MESURE « TOUTE LA LARGEUR, TOUTE LA HAUTEUR » DE CHAQUE ÉCRAN DU SITE, PAR LE GESTE.
// Sur le faux hub (le dispositif d'E3 : horloge figée au lundi 14/09/2026 09:00), aux tailles demandées. Pour chaque écran :
// la place que prend ce qui se lit (le texte visible, non recouvert) en largeur et en hauteur, les règles CSS qui bornent
// (max-width / width en px sur un bloc large), la taille du texte (médiane pondérée par les signes, p10, p90), les défilements
// de côté, et une capture écran entier. Le même script mesure la production (« avant ») et la maquette (« après »).
// usage : MJPC_HUB=<hub> node mesure.mjs <fichier.html> <sortie/> [1366x768,1920x1080]
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = process.argv[3] || 'mesure'; const TAILLES = String(process.argv[4] || '1366x768,1920x1080').split(',').map(t => t.split('x').map(Number));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node mesure.mjs <fichier.html> <sortie/> [1366x768,1920x1080]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const HUB = path.resolve(process.env.MJPC_HUB || 'AUDITS/INTEGRATION-DEROULE/hub'); const FONTS = process.env.MJPC_FONTS || null;
fs.mkdirSync(OUT, { recursive: true }); const URL0 = 'file://' + FICHIER;
const md5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {} return st; };
const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const p = (pg, ms) => pg.waitForTimeout(ms);
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansVoile = pg => pg.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); }).catch(() => {});
const police = async pg => { if (!FONTS) return; const css = [[400, 'normal'], [400, 'italic'], [500, 'normal'], [600, 'normal'], [700, 'normal'], [800, 'normal']].map(([w, st]) => `@font-face{font-family:'EB Garamond';font-weight:${w};font-style:${st};src:url('file://${path.join(FONTS, `eb-garamond-latin-${w}-${st}.woff2`)}') format('woff2'),url('file://${path.join(FONTS, `eb-garamond-latin-ext-${w}-${st}.woff2`)}') format('woff2');}`).join('\n'); await pg.addStyleTag({ content: css }).catch(() => {}); await pg.evaluate(() => document.fonts.ready).catch(() => {}); };

/* ── la mesure, dans la page ─────────────────────────────────────────────── */
const mesurer = pg => pg.evaluate(() => {
  const W = innerWidth, H = innerHeight;
  const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const s = getComputedStyle(el); if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false; return !(r.right < 0 || r.bottom < 0 || r.left > W || r.top > H); };
  let L = 1e9, R = -1e9, T = 1e9, B = -1e9; const tailles = []; let signes = 0;
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode()) { const t = tw.currentNode; const txt = t.textContent.replace(/\s+/g, ' ').trim(); if (!txt) continue; const el = t.parentElement; if (!el || !vis(el) || el.closest('script,style,noscript')) continue;
    const rg = document.createRange(); rg.selectNodeContents(t); let vu = false;
    for (const r of rg.getClientRects()) { if (r.width < 1 || r.height < 1 || r.right < 0 || r.left > W || r.bottom < 0 || r.top > H) continue;
      const cx = Math.min(W - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(H - 1, Math.max(0, r.top + r.height / 2)); const top = document.elementFromPoint(cx, cy); if (!top || !(top === el || el.contains(top) || top.contains(el))) continue;
      vu = true; L = Math.min(L, r.left); R = Math.max(R, r.right); T = Math.min(T, r.top); B = Math.max(B, r.bottom); }
    if (vu) { tailles.push([parseFloat(getComputedStyle(el).fontSize), txt.length]); signes += txt.length; } }
  tailles.sort((a, b) => a[0] - b[0]); const quantile = q => { let c = 0; for (const [f, n] of tailles) { c += n; if (c >= q * signes) return f; } return tailles.length ? tailles[tailles.length - 1][0] : 0; };
  /* les bornes : les règles CSS en px qui tiennent un bloc large visible */
  const bornes = []; const vus = new Set();
  for (const sh of Array.from(document.styleSheets)) { let rules; try { rules = sh.cssRules; } catch (e) { continue; }
    const marche = rs => { for (const r of Array.from(rs || [])) { if (r.cssRules && !r.selectorText) { if (r.media && !matchMedia(r.media.mediaText).matches) continue; marche(r.cssRules); continue; } if (!r.selectorText || !r.style) continue;
      for (const prop of ['max-width', 'width', 'max-height', 'height']) { const v = r.style.getPropertyValue(prop); const m = /^(\d+(?:\.\d+)?)px$/.exec(v.trim()); if (!m) continue; const px = +m[1]; const large = prop.indexOf('width') >= 0; if (px < (large ? 300 : 250)) continue;
        let els = []; try { els = Array.from(document.querySelectorAll(r.selectorText)); } catch (e) { continue; }
        for (const el of els) { if (!vis(el)) continue; const b = el.getBoundingClientRect(); if (large ? b.width < W * 0.25 : b.height < H * 0.25) continue; const cx = b.left + b.width / 2, cy = Math.min(H - 1, Math.max(0, b.top + Math.min(b.height, H) / 2)); const top = document.elementFromPoint(Math.min(W - 1, Math.max(0, cx)), cy); if (!top || !(el === top || el.contains(top))) continue;
          const k = r.selectorText + '|' + prop; if (vus.has(k)) break; vus.add(k); bornes.push({ regle: r.selectorText.slice(0, 80), prop, valeur: v.trim(), larg: Math.round(b.width), haut: Math.round(b.height) }); break; } } } };
    marche(rules); }
  /* les défilements de côté */
  const de = document.scrollingElement; const cote = []; if (de && de.scrollWidth > de.clientWidth + 2) cote.push('la page (' + de.scrollWidth + ' > ' + de.clientWidth + ')');
  for (const el of Array.from(document.querySelectorAll('body *'))) { if (!vis(el)) continue; const s = getComputedStyle(el); if ((s.overflowX === 'auto' || s.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 80) { const d = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''); cote.push(d + ' (' + el.scrollWidth + ' > ' + el.clientWidth + ')'); if (cote.length > 6) break; } }
  return { W, H, larg: R > L ? Math.round((Math.min(R, W) - Math.max(L, 0)) / W * 100) : 0, haut: B > T ? Math.round((Math.min(B, H) - Math.max(T, 0)) / H * 100) : 0, gauche: Math.round(Math.max(L, 0)), droite: Math.round(W - Math.min(R, W)), haut0: Math.round(Math.max(T, 0)), bas: Math.round(H - Math.min(B, H)),
    police: { med: quantile(0.5), p10: quantile(0.1), p90: quantile(0.9) }, signes, bornes, cote };
});

const lignes = []; const tout = [];
for (const [W, H] of TAILLES) {
  const T = W + 'x' + H; const dir = path.join(OUT, T); fs.mkdirSync(dir, { recursive: true });
  const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { errs.push('boîte : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
  await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, hubStore());
  let n = 0; const ecran = async (nom, cible) => { n++; const id = String(n).padStart(2, '0') + '-' + nom; await sansVoile(pg); await p(pg, 250); const m = await mesurer(cible || pg); await (cible || pg).screenshot({ path: path.join(dir, id + '.png') }).catch(() => {}); m.ecran = nom; m.id = id; m.taille = T; tout.push(m);
    lignes.push(`${T} · ${id} · largeur ${m.larg} % (marges ${m.gauche} / ${m.droite} px) · hauteur ${m.haut} % · texte ${m.police.med} px (p10 ${m.police.p10}, p90 ${m.police.p90}) · ${m.bornes.length ? 'bornes : ' + m.bornes.map(b => b.regle + ' {' + b.prop + ':' + b.valeur + '}').join(' ; ') : 'aucune borne px'}${m.cote.length ? ' · défile de côté : ' + m.cote.join(', ') : ''}`); console.log(lignes[lignes.length - 1]); };
  /* l'accueil, avant toute entrée */
  await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 2200); await police(pg); await ecran('accueil-connexion');
  /* l'entrée du professeur (l'entrée quotidienne de Paul) : l'emploi du temps paraît */
  await pg.evaluate(() => { try { loginAsProf(); } catch (e) {} }); await p(pg, 2500); await sansVoile(pg);
  if (!(await pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none'); }))) { await pg.evaluate(() => edtOuvrir()); await p(pg, 1800); }
  await ecran('edt-semaine');
  await pg.evaluate(() => edtVue('mois')); await p(pg, 900); await ecran('edt-mois');
  await pg.evaluate(() => edtVue('annee')); await p(pg, 900); await ecran('edt-annee');
  await pg.evaluate(() => edtVue('calendrier')); await p(pg, 900); await ecran('edt-heures-perdues');
  await pg.evaluate(() => edtVue('semaine')); await p(pg, 700);
  await pg.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/.test(e.innerText)); if (c) c.click(); }); await p(pg, 900); await ecran('edt-case-modale');
  await pg.keyboard.press('Escape'); await p(pg, 300);
  await pg.evaluate(() => { if (typeof EDT_CL === 'object' && typeof edtCarteClic === 'function') { const c = Array.from(document.querySelectorAll('.edt-carte')).find(x => /Charles/.test(x.innerText)); if (c) c.click(); } }); await p(pg, 1000);
  if (await pg.evaluate(() => EDT_VUE.mode === 'classe')) { await ecran('edt-la-classe'); await pg.evaluate(() => edtVue('semaine')); await p(pg, 600); }
  await pg.evaluate(() => edtFermer()); await p(pg, 600); await ecran('accueil-niveaux');
  /* la page du niveau, un chapitre ouvert */
  await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 1800); await ecran('niveau-3e');
  await pg.evaluate(() => { const h = Array.from(document.querySelectorAll('[onclick="toggleChapter(this)"]')).find(x => x.offsetParent !== null); if (h) h.click(); }); await p(pg, 900); await ecran('niveau-3e-chapitre-ouvert');
  /* le panneau prof, chaque section */
  await pg.evaluate(() => openProfPanel()); await p(pg, 900);
  for (const s of ['dashboard', 'classes', 'eleves', 'profil-test', 'archi', 'archives', 'corbeille', 'annonces', 'brevet', 'taxo', 'edt', 'config', 'presence']) { await pg.evaluate(id => { try { showProfSection(id); } catch (e) {} }, s); await p(pg, 900); await ecran('panneau-' + s); }
  /* l'atelier : l'accueil, Mes chapitres, puis les quatre vues du chapitre */
  await pg.evaluate(() => atelierOuvrir()); await p(pg, 1200); await ecran('atelier-accueil');
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900); await ecran('atelier-mes-chapitres');
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(pg, 1800); await sansVoile(pg); await police(pg);
  for (const v of ['structure', 'atelier', 'pilotage']) { await pg.evaluate(x => { const b = document.querySelector('.at-onglet[data-vue="' + x + '"]'); if (b) b.click(); }, v); await p(pg, 1800); await ecran('chapitre-' + v + (v === 'pilotage' ? '-avant-lancement' : '')); }
  /* l'heure lancée : le pilote, la fin de l'heure, la fenêtre du tableau, la Relecture */
  if (await pg.$('[data-lancer="1"]')) { await pg.click('[data-lancer="1"]').catch(() => {}); await p(pg, 2500); await sansVoile(pg); await pg.keyboard.press('Escape'); await p(pg, 300);
    for (let i = 0; i < 4; i++) { await pg.click('#bdev').catch(() => {}); await p(pg, 120); }
    await ecran('pilote-heure-lancee');
    if (await pg.$('#bfin')) { await pg.click('#bfin').catch(() => {}); await p(pg, 900); await ecran('pilote-fin-de-l-heure'); await clicTexte(pg, 'button', 'Revenir au cours'); await p(pg, 500); }
    try { const [fen] = await Promise.all([pg.waitForEvent('popup', { timeout: 6000 }), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.setViewportSize({ width: W, height: H }).catch(() => {}); await p(fen, 1500); n++; const m = await mesurer(fen); await fen.screenshot({ path: path.join(dir, String(n).padStart(2, '0') + '-fenetre-du-tableau.png') }); m.ecran = 'fenetre-du-tableau'; m.id = String(n).padStart(2, '0') + '-fenetre-du-tableau'; m.taille = T; tout.push(m); lignes.push(`${T} · ${m.id} · largeur ${m.larg} % · hauteur ${m.haut} % · texte ${m.police.med} px · ${m.bornes.length ? 'bornes : ' + m.bornes.map(b => b.regle + ' {' + b.prop + ':' + b.valeur + '}').join(' ; ') : 'aucune borne px'}`); console.log(lignes[lignes.length - 1]); await fen.close(); } catch (e) { lignes.push(T + ' · fenêtre du tableau : pas ouverte (' + String(e.message).slice(0, 60) + ')'); }
  }
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="relecture"]'); if (b) b.click(); }); await p(pg, 2000); await ecran('chapitre-relecture');
  /* la visionneuse d'un document (élève comme prof) */
  await pg.evaluate(() => { try { atelierFermer(); } catch (e) {} try { closeProfPanel(); } catch (e) {} }); await p(pg, 900);
  await pg.evaluate(() => { try { openViewer('Un document', 'about:blank'); } catch (e) {} }); await p(pg, 900); await ecran('visionneuse');
  lignes.push(T + ' · erreurs JS : ' + (errs.length ? errs.join(' ; ') : 'aucune'));
  await nav.close();
}
fs.writeFileSync(path.join(OUT, 'mesure.txt'), 'fichier md5 ' + md5 + '\n' + lignes.join('\n') + '\n'); fs.writeFileSync(path.join(OUT, 'mesure.json'), JSON.stringify(tout, null, 1));
console.log('fin · ' + tout.length + ' écrans mesurés');
