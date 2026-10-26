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

/* L'INVENTAIRE DE L'EXISTANT (conscience n°13, 26/10 20:15 — Paul : « avant de coder un nouveau dispositif, peut-on simplifier l'existant tout en gardant sa finesse ? Je parle
   surtout d'ui, de flux et d'ergonomie visuelle ET pratique »). Le parcours entier d'une heure, par le geste, à 1707 × 743, l'horloge qui court : chaque écran, chaque élément
   cliquable (son nom, son infobulle, ce qu'il appelle), dans l'écran ou plus bas dans la page, les doublons de nom, une capture écran entier. */
const inv = (pg) => pg.evaluate(() => {
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const s = getComputedStyle(el); if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false; let p = el; while (p && p !== document.body) { const q = getComputedStyle(p); if (q.display === 'none' || q.visibility === 'hidden') return false; p = p.parentElement; } return true; };
  const dansEcran = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const zone = el => { const r = el.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; return (cy < 110 ? 'haut' : cy > innerHeight - 90 ? 'bas' : 'milieu') + '-' + (cx < innerWidth / 3 ? 'gauche' : cx > innerWidth * 2 / 3 ? 'droite' : 'centre'); };
  /* ce qui est par-dessus : un écran fixe qui couvre presque toute la fenêtre (l'Atelier, l'emploi du temps, le panneau) — on ne compte que ce qui est dedans, ou ce qui flotte au-dessus */
  const couvrant = (() => { const pts = [[innerWidth / 2, innerHeight / 2], [innerWidth * 0.2, innerHeight * 0.5], [innerWidth * 0.8, innerHeight * 0.5]]; for (const [x, y] of pts) { let e = document.elementFromPoint(x, y); while (e && e !== document.body) { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); if ((s.position === 'fixed' || s.position === 'absolute') && r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.85) return e; e = e.parentElement; } } return null; })();
  const devant = el => { const r = el.getBoundingClientRect(); const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2)); const t = document.elementFromPoint(cx, cy); return !!(t && (t === el || el.contains(t) || t.contains(el))); };
  const els = Array.from(document.querySelectorAll('button, [role=button], a[href], a[onclick], [onclick], select, input:not([type=hidden]), textarea, [contenteditable=true], .cliquable, label.sw, .at-onglet')).filter(vis).filter(el => { const r = el.getBoundingClientRect(); const dansE = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; if (dansE) return devant(el); return !couvrant || couvrant.contains(el); });
  const vus = new Set(); const L = [];
  els.forEach(el => { if ([...vus].some(v => v !== el && v.contains(el) && v.tagName === 'BUTTON')) return; vus.add(el);
    const nom = ((el.tagName === 'SELECT' ? '⌄ ' + ((el.options[el.selectedIndex] || {}).text || '') : el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? '✎ ' + (el.placeholder || el.type) : el.getAttribute('contenteditable') ? '✎ (zone d\'écriture)' : (el.innerText || el.value || '')) || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    const commande = /^(BUTTON|SELECT|INPUT|TEXTAREA)$/.test(el.tagName) || el.getAttribute('role') === 'button' || el.classList.contains('btn') || el.classList.contains('at-onglet') || !!el.getAttribute('contenteditable');
    L.push({ commande, nom: nom || '(' + (el.getAttribute('title') || el.id || el.className || el.tagName).toString().slice(0, 40) + ')', titre: (el.getAttribute('title') || '').replace(/\s+/g, ' ').slice(0, 220), id: el.id || '', appel: (el.getAttribute('onclick') || '').slice(0, 70), ecran: dansEcran(el), zone: dansEcran(el) ? zone(el) : 'hors-écran' }); });
  const S0 = window.S ? { lancee: !!S.lancee, close: !!S.close, palier: S.palier || null, enFin: !!S.enFin, finSection: S.finSection, preparation: !!S.preparation, gel: !!S.gel, repetition: !!S.repetition } : null;
  const messages = Array.from(document.querySelectorAll('#al-boite, #al-ligne, .garde.on, #garde-cahier.on, .toast, #ses-reprise, [id*=reprise]')).filter(vis).map(x => (x.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 240));
  return { L, S: S0, messages, defile: document.scrollingElement.scrollHeight > innerHeight + 4 };
});
const W = 1707, H = 743; const nav = await pw.chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = [];
pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { errs.push('boîte : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
await pg.clock.install({ time: new Date('2026-09-14T08:50:00+02:00') }); await pg.addInitScript(fauxHub, hubStore());
await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 2200); await police(pg);
const R = [], TOUT = []; let k = 0;
const ecran = async (nom, quoi) => { k++; const id = String(k).padStart(2, '0') + '-' + nom; await sansVoile(pg); await p(pg, 500); let v; try { v = await inv(pg); } catch (e) { R.push(`\n## ${id} — ÉCHEC de l'inventaire : ${e.message}`); return; }
  await pg.screenshot({ path: path.join(OUT, id + '.png') }); TOUT.push({ id, quoi, ...v });
  const dans = v.L.filter(x => x.ecran), hors = v.L.filter(x => !x.ecran); const cmd = dans.filter(x => x.commande).length; const noms = {}; dans.forEach(x => { const n = x.nom.replace(/^[^\wÀ-ÿ«]+/, '').toLowerCase(); noms[n] = (noms[n] || 0) + 1; });
  const dbl = Object.entries(noms).filter(([n, c]) => c > 1 && n.length > 1);
  R.push(`\n## ${id} — ${quoi}\n- ${cmd} commandes (boutons, menus, champs) et ${dans.length - cmd} autres éléments cliquables (cases, vignettes, lignes) dans l'écran${hors.length ? ', ' + hors.length + ' plus bas (en défilant)' : ''}${v.S ? ' · ' + JSON.stringify(v.S) : ''}${dbl.length ? '\n- même nom plusieurs fois : ' + dbl.map(([n, c]) => '« ' + n + ' » ×' + c).join(', ') : ''}`);
  v.messages.forEach(m => R.push('- message : ' + m));
  const parZone = {}; dans.forEach(x => { (parZone[x.zone] = parZone[x.zone] || []).push(x); });
  Object.keys(parZone).sort().forEach(z => R.push(`- ${z} (${parZone[z].length}) : ` + parZone[z].map(x => (x.commande ? '[' : '‹') + x.nom + (x.commande ? ']' : '›') + (x.titre ? '{' + x.titre.slice(0, 90) + '}' : '')).join(' ')));
  if (hors.length) R.push(`- plus bas : ` + hors.slice(0, 60).map(x => '[' + x.nom + ']').join(' ') + (hors.length > 60 ? ' …' : ''));
  console.log(id, cmd, dans.length - cmd, hors.length); };
const pas = async (f, t = 900) => { try { await f(); } catch (e) { R.push('\n(un geste n\'a pas abouti : ' + String(e.message).slice(0, 120) + ')'); } await p(pg, t); };
const clic = (sel, txt) => clicTexte(pg, sel, txt);
const avancer = async (jusqua) => { const cible = new Date(jusqua).getTime(); const now = await pg.evaluate(() => Date.now()); if (cible > now) await pg.clock.fastForward(Math.round(cible - now)); await p(pg, 2500); await pg.clock.fastForward(1500); await p(pg, 1500); };
/* — 1 · la connexion du prof : l'emploi du temps — */
await pas(() => pg.evaluate(() => { try { loginAsProf(); } catch (e) {} }), 2500);
if (!(await pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none'); }))) await pas(() => pg.evaluate(() => edtOuvrir()), 1800);
await ecran('edt-semaine', 'l\'emploi du temps à la connexion (semaine du 14/09)');
await pas(() => pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; c.click(); }), 900);
await ecran('edt-case-a-lancer', 'la case de l\'heure à venir (3E Charles de Gaulle, lundi 08:57, heure 1/3)');
await pas(() => pg.keyboard.press('Escape'), 400); await pas(() => clic('button', 'Fermer l’emploi du temps'), 900);
await ecran('accueil', 'l\'accueil du prof');
await pas(() => pg.evaluate(() => openLevel('3e')), 1500); await pas(() => pg.evaluate(() => openLevel('3e')), 1800);
await ecran('niveau', 'la page du niveau (publier)');
/* — 2 · préparer : l'Atelier — */
await pas(() => pg.evaluate(() => atelierOuvrir()), 1500); await ecran('atelier-accueil', 'l\'Atelier, accueil');
await pas(() => clic('button,[onclick]', "atOnglet('chapitres')"), 900); await ecran('atelier-mes-chapitres', 'Mes chapitres');
await pas(() => clic('button,[onclick]', 'Éditer dans l’atelier'), 2500); await pas(() => pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); if (b) b.click(); }), 1500);
await ecran('chapitre-structure', 'le chapitre, Structure');
await pas(() => pg.evaluate(() => document.querySelector('.at-onglet[data-vue="atelier"]').click()), 2500); await ecran('chapitre-atelier', 'le chapitre, Atelier (écrire les diapos)');
await pas(() => pg.evaluate(() => document.querySelector('.at-onglet[data-vue="pilotage"]').click()), 1500); await ecran('chapitre-pilotage', 'le chapitre, Pilotage (la répétition)');
await pas(() => pg.evaluate(() => { const b = document.querySelector('#at-jouer, [id*=jouer]'); if (b && b.offsetParent) b.click(); }), 800);
if (await pg.evaluate(() => !!(window.S && S.repetition))) await ecran('chapitre-repetition', 'la répétition en cours (« Jouer en avance »)');
await pas(() => pg.evaluate(() => { const b = document.getElementById('rep-stop'); if (b && b.offsetParent) b.click(); }), 600);
await pas(() => pg.evaluate(() => document.querySelector('.at-onglet[data-vue="relecture"]').click()), 2000); await ecran('chapitre-relecture', 'le chapitre, Relecture');
await pas(() => clic('button', 'Fermer l’atelier'), 1200); await pas(() => clic('button', 'Fermer l\'atelier'), 600);
/* — 3 · l'heure : de la case à la clôture — */
await pas(() => pg.evaluate(() => { const o = document.querySelector('.tprof-overlay'); if (o && o.offsetParent) { const x = document.querySelector('.tprof-overlay .tprof-close, .tprof-overlay [onclick*=close]'); if (x) x.click(); } }), 600);
await avancer('2026-09-14T08:58:00+02:00');
await pas(() => pg.evaluate(() => edtOuvrir()), 1500);
await pas(() => pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; c.click(); }), 900);
await pas(() => clic('button', 'Ouvrir le pilotage et lancer'), 4000); await pas(() => pg.keyboard.press('Escape'), 400);
await ecran('heure-lancee', 'l\'heure lancée (08:58)');
for (let i = 0; i < 3; i++) await pas(() => pg.click('#bdev'), 200);
await avancer('2026-09-14T09:20:00+02:00'); await ecran('heure-milieu', 'l\'heure, au milieu (09:20, trois lignes dévoilées)');
await avancer('2026-09-14T09:42:20+02:00'); await ecran('heure-T-5', 'T-5 (09:42)');
await avancer('2026-09-14T09:44:20+02:00'); await ecran('heure-T-3', 'T-3 (09:44)');
await pas(() => clic('.dr-seq button, button', 'Préparer le cahier de textes'), 1500); await ecran('cahier-preparation', '« Préparer le cahier de textes »');
for (let n = 2; n <= 7; n++) { await pas(() => pg.evaluate(() => { const b = document.getElementById('f-suivante'); if (b && b.offsetParent) b.click(); }), 1000); await ecran('cahier-etape-' + n, 'le cahier de textes, étape ' + n + ' sur 7'); }
await pas(() => clic('button', 'Revenir au cours'), 1200); await ecran('cahier-revenu', 'après « Revenir au cours »');
await avancer('2026-09-14T09:47:20+02:00'); await ecran('heure-du-cahier', 'l\'heure du cahier (09:47)');
await pas(() => clic('button', 'Aller au cahier'), 1500); await ecran('aller-au-cahier', '« Aller au cahier »');
await pas(() => pg.evaluate(() => { const b = document.getElementById('dr-clore') || Array.from(document.querySelectorAll('button')).find(x => /Clore l.heure/.test(x.innerText) && x.offsetParent); b.click(); }), 1500); await ecran('clore-demande', '« ■ Clore l\'heure » (l\'entête)');
await pas(() => pg.evaluate(() => { const b = Array.from(document.querySelectorAll('#fin button, #dr-zone button')).filter(x => x.offsetParent !== null && /^Clore l[’']heure$/.test((x.innerText || '').trim()) && !x.closest('.haut')); if (b.length) b[b.length - 1].click(); }), 1500);
await ecran('clore-garde', 'la garde avant de clore (s\'il y en a une)');
await pas(() => clic('button', 'Clore quand même'), 2500); await ecran('heure-close', 'l\'heure close');
await pas(() => pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="relecture"]'); if (b) b.click(); }), 2500); await ecran('classe-relecture', 'la Relecture de la classe');
await pas(() => clic('button', '✕ Fermer'), 1500); await ecran('apres-fermer', 'après « ✕ Fermer »');
await pas(() => pg.evaluate(() => { const e = document.getElementById('edt-ecran'); if (!(e && e.style.display !== 'none')) edtOuvrir(); }), 1500);
await pas(() => pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; c.click(); }), 900);
await ecran('edt-case-close', 'la case de l\'heure close');
await pas(() => pg.keyboard.press('Escape'), 400);
await pas(() => pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && /heure 2/.test(e.innerText || '')); if (cs[0]) cs[0].click(); }), 900);
await ecran('edt-case-heure-2', 'la case de l\'heure 2 de la séance');
await pas(() => clic('button', 'Où en est la classe'), 2500); await ecran('ou-en-est-la-classe', '« Où en est la classe » (avant de lancer l\'heure 2)');
fs.writeFileSync(path.join(OUT, 'inventaire.txt'), `L'INVENTAIRE DE L'EXISTANT · ${FICHIER} · md5 ${md5} · ${W} × ${H} · ${new Date().toISOString().slice(0, 16)} UTC\n` + R.join('\n') + '\n\nerreurs JS : ' + (errs.join(' ; ') || 'aucune') + '\n');
fs.writeFileSync(path.join(OUT, 'inventaire.json'), JSON.stringify(TOUT, null, 1));
await nav.close();
