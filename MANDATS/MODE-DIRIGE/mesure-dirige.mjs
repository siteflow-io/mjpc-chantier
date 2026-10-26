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

/* LE MODE DIRIGÉ — LA MESURE (conscience n°13, 26/10 20:10, Paul : « Mesure, audit et dis moi ») : ce que Paul a devant lui, à chaque moment d'une heure lancée
   par la case de l'emploi du temps (l'horloge qui court : lancement 09:00, puis T-5, T-3, T-1, l'heure du cahier), et la « préparation du cahier de textes ».
   Pour chaque moment : les boutons visibles et cliquables, les phrases d'alerte, une capture écran entier. */
const voir = (pg, quoi) => pg.evaluate(() => {
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false; const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0); };
  const B = Array.from(document.querySelectorAll('button, [role=button], a[onclick], .btn, .cliquable, select, input[type=checkbox], input[type=range]')).filter(vis).map(b => (b.innerText || b.value || b.getAttribute('title') || b.getAttribute('aria-label') || b.id || b.className || '').replace(/\s+/g, ' ').trim().slice(0, 50)).filter(Boolean);
  const alertes = Array.from(document.querySelectorAll('#al-boite, #al-ligne, .garde.on, #garde-cahier.on, .dr-seq .pp-tete, #prep')).filter(vis).map(x => (x.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300));
  return { boutons: B, n: B.length, alertes, S: window.S ? { lancee: S.lancee, palier: S.palier, enFin: S.enFin, preparation: !!S.preparation, gel: !!S.gel, finSection: S.finSection } : null };
});
const W = 1707, H = 743; const nav = await pw.chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = [];
pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { errs.push('boîte : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
await pg.clock.install({ time: new Date('2026-09-14T08:58:00+02:00') }); await pg.addInitScript(fauxHub, hubStore());
await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 2200); await police(pg);
await pg.evaluate(() => { try { loginAsProf(); } catch (e) {} }); await p(pg, 2500); await sansVoile(pg);
if (!(await pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none'); }))) { await pg.evaluate(() => edtOuvrir()); await p(pg, 1800); }
const R = []; let k = 0;
const moment = async (nom) => { k++; await sansVoile(pg); await p(pg, 400); const v = await voir(pg); await pg.screenshot({ path: path.join(OUT, String(k).padStart(2, '0') + '-' + nom + '.png') });
  R.push(`\n## ${k} · ${nom} — ${v.n} boutons visibles${v.S ? ' · ' + JSON.stringify(v.S) : ''}`); v.alertes.forEach(a => R.push('  ALERTE · ' + a)); R.push('  ' + v.boutons.map(b => '[' + b + ']').join(' ')); console.log(R.slice(-3).join('\n')); };
await moment('emploi-du-temps');
await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; if (c) c.click(); }); await p(pg, 800);
await moment('la-case');
await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(pg, 3500); await pg.keyboard.press('Escape'); await p(pg, 300);
await moment('heure-lancee');
for (const [min, nom] of [[42.2, 'T-5'], [44.2, 'T-3'], [46.2, 'T-1'], [47.3, 'heure-du-cahier']]) {
  const cible = new Date('2026-09-14T08:58:00+02:00').getTime() + min * 60000; const now = await pg.evaluate(() => Date.now()); await pg.clock.fastForward(Math.max(1000, Math.round(cible - now))); await p(pg, 1500);
  await moment(nom); }
if (await clicTexte(pg, 'button', 'Préparer')) { await p(pg, 1500); await moment('preparer-le-cahier'); }
fs.writeFileSync(path.join(OUT, 'mesure.txt'), `mesure du mode dirigé · ${FICHIER} · md5 ${md5} · ${W} × ${H}\n` + R.join('\n') + '\n\nerreurs JS : ' + (errs.join(' ; ') || 'aucune') + '\n');
await nav.close();
