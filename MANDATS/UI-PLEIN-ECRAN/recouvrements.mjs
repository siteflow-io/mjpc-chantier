// Conscience n°13 · 26/10/2026 (17:05, Paul : « tu dois faire l'ensemble des mesures des boutons, on ne va pas faire les boutons un par un ») — LES RECOUVREMENTS, d'après LA MESURE « TOUTE LA LARGEUR, TOUTE LA HAUTEUR » DE CHAQUE ÉCRAN DU SITE, PAR LE GESTE.
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

/* ── LES RECOUVREMENTS : tout ce qu'un élément fixe flottant (bouton, badge, pastille — pas une barre pleine largeur) cache,
   la page défilée de haut en bas, chaque conteneur qui défile aussi ── */
const recouvrements = pg => pg.evaluate(async () => {
  const W = innerWidth, H = innerHeight; const att = ms => new Promise(r => setTimeout(r, ms));
  const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0); };
  const nom = el => { if (!el) return '?'; const t = (el.innerText || el.value || el.getAttribute('title') || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40); return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '') + (t ? ' « ' + t + ' »' : ''); };
  /* les flottants : position fixed, visibles, moins de la moitié de la largeur et de la hauteur */
  const flottants = () => Array.from(document.querySelectorAll('body *')).filter(el => { const s = getComputedStyle(el); if (s.position !== 'fixed') return false; if (!vis(el)) return false; const r = el.getBoundingClientRect(); if (r.width >= W * 0.5 || r.height >= H * 0.5) return false; if (r.right < 0 || r.left > W || r.bottom < 0 || r.top > H) return false; if (el.parentElement && el.parentElement.closest && Array.from(document.querySelectorAll('body *')).length > 0) { let p = el.parentElement; while (p && p !== document.body) { if (getComputedStyle(p).position === 'fixed' && p.getBoundingClientRect().width < W * 0.5) return false; p = p.parentElement; } } return true; });
  const trouve = new Map();
  const sonder = () => { const F = flottants(); if (!F.length) return; const cibles = Array.from(document.querySelectorAll('button, a[href], a[onclick], input, select, textarea, label, [onclick], [role=button], h1, h2, h3, h4, p, li, td, th, span, b, i, em, strong, div')).filter(el => { if (!vis(el)) return false; if (F.some(f => f.contains(el) || el.contains(f))) return false; const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) return false; if (el.tagName === 'DIV' || el.tagName === 'SPAN' || el.tagName === 'B' || el.tagName === 'I' || el.tagName === 'EM' || el.tagName === 'STRONG') { const tx = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim()).length; if (!tx && !el.getAttribute('onclick')) return false; } return true; });
    for (const f of F) { const fr = f.getBoundingClientRect(); for (const el of cibles) { const r = el.getBoundingClientRect(); const ix = Math.max(0, Math.min(r.right, fr.right) - Math.max(r.left, fr.left)), iy = Math.max(0, Math.min(r.bottom, fr.bottom) - Math.max(r.top, fr.top)); if (ix < 3 || iy < 3) continue;
        const cx = Math.max(fr.left, r.left) + ix / 2, cy = Math.max(fr.top, r.top) + iy / 2; const top = document.elementFromPoint(Math.min(W - 1, cx), Math.min(H - 1, cy)); if (!top || !f.contains(top)) continue;
        const k = nom(f) + ' ⟶ ' + nom(el); if (!trouve.has(k)) trouve.set(k, { flottant: nom(f), cache: nom(el), part: Math.round(ix * iy / Math.max(1, r.width * r.height) * 100) }); } } };
  /* ce qui défile : la page, puis chaque conteneur visible qui défile en hauteur */
  const defilants = [document.scrollingElement].concat(Array.from(document.querySelectorAll('body *')).filter(el => { if (!vis(el)) return false; const s = getComputedStyle(el); return (s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 10 && el.clientHeight > 120; }));
  sonder();
  for (const d of defilants) { if (!d) continue; const debut = d.scrollTop, pas = Math.max(80, Math.round((d.clientHeight || H) * 0.5)); for (let y = 0; y <= d.scrollHeight; y += pas) { d.scrollTop = y; await att(60); sonder(); if (d.scrollTop + d.clientHeight >= d.scrollHeight - 2) break; } d.scrollTop = debut; await att(40); }
  return Array.from(trouve.values());
});
const lignes = []; const tout = [];
for (const [W, H] of TAILLES) {
  const T = W + 'x' + H; const dir = path.join(OUT, T); fs.mkdirSync(dir, { recursive: true });
  const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { errs.push('boîte : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
  await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, hubStore());
  let n = 0; const ecran = async (nom, cible) => { n++; const id = String(n).padStart(2, '0') + '-' + nom; await sansVoile(pg); await p(pg, 250); const L = await recouvrements(cible || pg); tout.push({ taille: T, ecran: nom, id, recouvrements: L });
    lignes.push(`${T} · ${id} · ${L.length ? L.length + ' recouvrement(s) : ' + L.map(x => x.flottant + ' cache ' + x.cache + ' (' + x.part + ' %)').join(' ; ') : 'aucun recouvrement'}`); console.log(lignes[lignes.length - 1]); };
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
  await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 900); await pg.evaluate(() => { if (!document.getElementById('page-level').classList.contains('active')) openLevel('3e', '3ème', 'var(--3e)'); }); await p(pg, 1800); await ecran('niveau-3e');   /* le premier openLevel ne fait que choisir le niveau sur l'accueil (clickedLevel) ; la page du niveau s'ouvre au second — trouvé par E3 (F4, 26/10) */
  await pg.evaluate(() => { const h = Array.from(document.querySelectorAll('[onclick="toggleChapter(this)"]')).find(x => x.offsetParent !== null); if (h) h.click(); }); await p(pg, 900); await ecran('niveau-3e-chapitre-ouvert');
  /* les onglets de la page du niveau (Chapitres, Fiches transversales, Zone autonomie, Dictée, Réécriture, Évaluation, Analyse d'image, Étude de texte, Rédaction, Analyse logique) */
  const onglets = await pg.evaluate(() => Array.from(document.querySelectorAll('#page-level button, #page-level [onclick]')).filter(b => b.offsetParent !== null && /^(tab-btn-|)/.test(b.id || '') && (b.closest('.tabs, .level-tabs, .tab-bar, [class*=tab]')) && !b.closest('[class*=publish]') && !/publi/i.test(b.innerText || '')).map((b, i) => { b.setAttribute('data-onglet-mesure', String(i)); return (b.innerText || '').trim().slice(0, 30); }));
  for (let i = 0; i < onglets.length; i++) { await pg.evaluate(k => { const b = document.querySelector('[data-onglet-mesure="' + k + '"]'); if (b) b.click(); }, String(i)); await p(pg, 900); await pg.evaluate(() => { document.querySelectorAll('.doc-viewer-overlay.visible, .doc-viewer-overlay.open').forEach(o => o.classList.remove('visible', 'open')); }); await ecran('niveau-3e-onglet-' + (onglets[i] || i).replace(/[^a-zA-Zàâçéèêëîïôûùüÿœ0-9]+/g, '-').toLowerCase()); }
  /* la page du niveau vue comme un élève (👁) */
  if (await pg.evaluate(() => typeof basculerVue === 'function')) { await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('[data-onglet-mesure]'))[0]; if (b) b.click(); basculerVue(); }); await p(pg, 1200); await ecran('niveau-3e-vue-eleve'); await pg.evaluate(() => basculerVue()); await p(pg, 900); }
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
    try { const [fen] = await Promise.all([pg.waitForEvent('popup', { timeout: 6000 }), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.setViewportSize({ width: W, height: H }).catch(() => {}); await p(fen, 1500); n++; const L = await recouvrements(fen); tout.push({ taille: T, ecran: 'fenetre-du-tableau', recouvrements: L }); lignes.push(`${T} · fenêtre du tableau · ${L.length ? L.length + ' recouvrement(s) : ' + L.map(x => x.flottant + ' cache ' + x.cache).join(' ; ') : 'aucun recouvrement'}`); console.log(lignes[lignes.length - 1]); await fen.close(); } catch (e) { lignes.push(T + ' · fenêtre du tableau : pas ouverte (' + String(e.message).slice(0, 60) + ')'); }
  }
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="relecture"]'); if (b) b.click(); }); await p(pg, 2000); await ecran('chapitre-relecture');
  /* la visionneuse d'un document (élève comme prof) */
  await pg.evaluate(() => { try { atelierFermer(); } catch (e) {} try { closeProfPanel(); } catch (e) {} }); await p(pg, 900);
  await pg.evaluate(() => { try { openViewer('Un document', 'about:blank'); } catch (e) {} }); await p(pg, 900); await ecran('visionneuse');
  lignes.push(T + ' · erreurs JS : ' + (errs.length ? errs.join(' ; ') : 'aucune'));
  await nav.close();
}
fs.writeFileSync(path.join(OUT, 'recouvrements.txt'), 'fichier md5 ' + md5 + '\n' + lignes.join('\n') + '\n'); fs.writeFileSync(path.join(OUT, 'recouvrements.json'), JSON.stringify(tout, null, 1));
console.log('fin · ' + tout.length + ' écrans mesurés');
