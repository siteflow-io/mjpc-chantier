// Le banc de la maquette du minuteur (C16 660) : joue 1 à 6 PAR LE GESTE (souris, clavier) dans la maquette elle-même, à 1536 × 864 et
// 1920 × 1080, et compte. Échoue (code 1) si une seule vérification échoue. usage : node banc-maquette.mjs <maquette.html> <dossier des captures>
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; const require = createRequire(import.meta.url); const pw = require('playwright');
const F = path.resolve(process.argv[2]); const CAP = path.resolve(process.argv[3] || 'captures'); fs.mkdirSync(CAP, { recursive: true });
const p = ms => new Promise(r => setTimeout(r, ms)); const V = []; const ok = (k, c, d = '') => { V.push({ k, c: !!c }); console.log((c ? 'OK  ' : 'ÉCHEC ') + k + (d ? ' · ' + d : '')); };
const nav = await pw.chromium.launch({ args: ['--no-sandbox'] });
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const garde = async pg => { if (await pg.isVisible('#garde.on #garde-devant').catch(() => false)) { await pg.click('#garde-devant'); await p(900); } };
/* les rectangles : la diapo, la pastille, les textes de la diapo (pour dire si elle en couvre) */
const mesure = (pg, murSel, ppSel) => pg.evaluate(([ms, ps]) => { const mur = document.querySelector(ms), pp = document.querySelector(ps); if (!mur || !pp || pp.style.display === 'none' || !pp.offsetWidth) return null;
  const r = mur.getBoundingClientRect(), q = pp.getBoundingClientRect(); const L = []; const w = document.createTreeWalker(mur, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement || n.parentElement.offsetParent === null) continue; const rg = document.createRange(); rg.selectNodeContents(n); Array.from(rg.getClientRects()).forEach(x => L.push({ x, t: n.textContent.trim().slice(0, 30) })); }
  const couvre = L.filter(o => Math.min(o.x.right, q.right) - Math.max(o.x.left, q.left) > 1 && Math.min(o.x.bottom, q.bottom) - Math.max(o.x.top, q.top) > 1).map(o => o.t);
  const ch = pp.querySelector('.dr-pp-chif'); return { fx: (q.left - r.left) / r.width, fy: (q.top - r.top) / r.height, fs: q.width / r.width, couvre, chif: ch ? ch.textContent : '', coul: ch ? getComputedStyle(ch).color : '' }; }, [murSel, ppSel]);
const memePlace = (a, b) => a && b && Math.abs(a.fx - b.fx) < 0.004 && Math.abs(a.fy - b.fy) < 0.006 && Math.abs(a.fs - b.fs) < 0.003;
const panneau = pg => pg.evaluate(() => { const pn = document.getElementById('dr-minut-p'), mur = document.getElementById('mur'); if (!pn || pn.style.display === 'none' || !pn.offsetWidth) return { ouvert: false };
  const r = pn.getBoundingClientRect(), m = mur.getBoundingClientRect(); const no = Array.from(document.querySelectorAll('#pilotage .notes, .notes')).filter(x => x.offsetParent !== null)[0]; const nr = no ? no.getBoundingClientRect() : null;
  return { ouvert: true, surDiapo: !(r.top >= m.bottom - 1 || r.bottom <= m.top + 1 || r.left >= m.right || r.right <= m.left), sousDiapo: r.top >= m.bottom, auDessusNotes: nr ? nr.top >= r.bottom - 1 : null }; });
const capt = async (pg, nom) => { await pg.screenshot({ path: path.join(CAP, nom + '.png') }); };

for (const [W, H] of [[1536, 864], [1920, 1080]]) {
  const tag = W + 'x' + H; const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const hors = [];
  ctx.on('request', r => { const u = r.url(); if (!/^(file|data|blob|about):/.test(u)) hors.push(u.slice(0, 90)); });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { errs.push('boîte : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
  await pg.goto('file://' + F, { waitUntil: 'load' }); await p(3500);
  /* 1 · une vraie heure : l'emploi du temps, la case du lundi 14/09 (3E Charles de Gaulle), « Ouvrir le pilotage et lancer » */
  await pg.evaluate(() => edtOuvrir()); await p(1500);   /* déclaré : l'emploi du temps s'ouvre par un appel (comme les sondes) ; le reste se joue au geste */
  await pg.evaluate(() => { const x = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0)[0]; if (x) x.click(); }); await p(800);
  const lance = await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); for (let k = 0; k < 30 && !(await pg.evaluate(() => !!(window.S && S.lancee)).catch(() => false)); k++) await p(250); await p(1500); await pg.keyboard.press('Escape').catch(() => {}); await p(400); await garde(pg);
  const lc = await pg.evaluate(() => ({ l: !!S.lancee, r: !!S.repetition })); ok(tag + ' · 1 · l\'heure lancée par la case', lance && lc.l && !lc.r, JSON.stringify([lance, lc]));
  /* la diapo 12 « Chaque groupe présente… » par sa vignette, puis tout dévoilé par « Dévoiler » */
  const i12 = await pg.evaluate(() => { const E = seance().ecrans; return E.findIndex(e => /groupe pr[eé]sente/i.test(JSON.stringify(e.blocs || [])) && /hypoth[eè]se/i.test(JSON.stringify(e.blocs || []))); });
  const v = await pg.$('#volet .vig[data-i="' + i12 + '"]'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); } await p(900); await garde(pg);
  for (let k = 0; k < 10; k++) { const c = await pg.evaluate(() => (document.getElementById('compte') || {}).textContent || ''); if (/^(\d+) \/ \1 dévoilés|rien à dévoiler/.test(c)) break; await pg.click('#bdev').catch(() => {}); await p(300); }
  ok(tag + ' · 1 · la diapo 12 « Chaque groupe présente… », tout dévoilé', await pg.evaluate(i => S.di === i, i12) && /(\d+) \/ \1 dévoilés/.test(await pg.evaluate(() => (document.getElementById('compte') || {}).textContent || '')));
  /* le tableau, comme dans le site : « Ouvrir le tableau », un second onglet */
  const [T] = await Promise.all([pg.waitForEvent('popup', { timeout: 8000 }).catch(() => null), clicTexte(pg, 'button', 'Ouvrir le tableau')]);
  ok(tag + ' · le tableau ouvert dans un second onglet', !!T); if (!T) { await ctx.close(); continue; }
  T.on('pageerror', e => errs.push('tableau : ' + String(e.message).slice(0, 160))); await T.setViewportSize({ width: W, height: H }); await p(4000);
  /* 2 · le ⏱ : le réglage s'ouvre sous la diapo, au-dessus des notes ; une durée ; « au tableau » ; Départ : le réglage se cache, la pastille paraît */
  await pg.click('#bchrono'); await p(400); const pa = await panneau(pg);
  ok(tag + ' · 2 · le réglage ouvert, jamais sur la diapo, sous elle, au-dessus des notes', pa.ouvert && !pa.surDiapo && pa.sousDiapo && pa.auDessusNotes !== false, JSON.stringify(pa));
  await pg.click('#dr-minut-in', { clickCount: 3 }); await pg.keyboard.type('05:00'); await pg.click('#dr-minut-tab'); await pg.click('#dr-minut-go'); await p(1200);
  const pb = await panneau(pg); ok(tag + ' · 2 · lancé : le réglage caché derrière le ⏱', !pb.ouvert);
  let mp = await mesure(pg, '#mur', '#dr-minut-pp'), mt = await mesure(T, '#mur2', '#dr-tab-minut');
  ok(tag + ' · 2 · la pastille au pilote et au tableau, même place, même taille', memePlace(mp, mt), JSON.stringify([mp, mt]));
  ok(tag + ' · 2 · au départ, la pastille ne couvre aucun texte (pilote, tableau)', mp && mt && !mp.couvre.length && !mt.couvre.length, JSON.stringify([mp && mp.couvre, mt && mt.couvre]));
  ok(tag + ' · 2 · or sur brun, le chiffre court', mp && /228, 180, 92/.test(mp.coul) && /^0[45]:\d\d$/.test(mt.chif), mp && mp.coul + ' ' + mt.chif);
  await capt(pg, tag + '-2-pilote'); await capt(T, tag + '-2-tableau');
  /* 3 · un nouveau clic : le réglage revient ; Pause ; le ⏱ le cache ; il revient ; Reprendre */
  await pg.click('#bchrono'); await p(300); const pc = await panneau(pg); ok(tag + ' · 3 · nouveau clic : le réglage revient', pc.ouvert && !pc.surDiapo);
  await pg.click('#dr-minut-pause'); await p(1500); const a1 = (await mesure(T, '#mur2', '#dr-tab-minut')).chif; await p(1300); const a2 = (await mesure(T, '#mur2', '#dr-tab-minut')).chif;
  ok(tag + ' · 3 · Pause : le tableau s\'arrête', a1 === a2, a1 + ' / ' + a2);
  await pg.click('#bchrono'); await p(300); ok(tag + ' · 3 · le ⏱ cache le réglage', !(await panneau(pg)).ouvert);
  await pg.click('#bchrono'); await p(300); ok(tag + ' · 3 · et le rend', (await panneau(pg)).ouvert);
  await pg.click('#dr-minut-pause'); await p(1300); const a3 = (await mesure(T, '#mur2', '#dr-tab-minut')).chif; ok(tag + ' · 3 · Reprendre : le tableau repart', a3 !== a2, a2 + ' → ' + a3);
  /* 4 · le zoom, au clavier (flèche droite × 5 : 150 %) : ensemble au tableau et au pilote */
  const avant = await mesure(pg, '#mur', '#dr-minut-pp'); await pg.focus('#dr-minut-zoom'); for (let k = 0; k < 5; k++) { await pg.keyboard.press('ArrowRight'); await p(80); } await p(900);
  mp = await mesure(pg, '#mur', '#dr-minut-pp'); mt = await mesure(T, '#mur2', '#dr-tab-minut');
  ok(tag + ' · 4 · le zoom agrandit la pastille (×1,5)', avant && mp && Math.abs(mp.fs / avant.fs - 1.5) < 0.03, avant && mp && (mp.fs / avant.fs).toFixed(3));
  ok(tag + ' · 4 · après le zoom, même place et même taille au pilote et au tableau', memePlace(mp, mt), JSON.stringify([mp, mt]));
  ok(tag + ' · 4 · la diapo n\'a pas changé (même diapo, même dévoilé)', await pg.evaluate(i => S.di === i, i12));
  await capt(pg, tag + '-4-pilote'); await capt(T, tag + '-4-tableau');
  /* 5 · glisser la pastille sur la diapo du pilote, à la souris */
  const box = await pg.locator('#dr-minut-pp').boundingBox(); const mur = await pg.locator('#mur').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2; const tx = mur.x + mur.width * 0.55, ty = mur.y + mur.height * 0.80;
  const dessus = await pg.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!(e && e.closest && e.closest('#dr-minut-pp')); }, [cx, cy]); ok(tag + ' · 5 · la pastille est au premier plan sur la diapo du pilote (rien ne la couvre)', dessus);
  await pg.mouse.move(cx, cy); await pg.mouse.down(); for (let k = 1; k <= 12; k++) { await pg.mouse.move(cx + (tx - cx) * k / 12, cy + (ty - cy) * k / 12); await p(40); } await pg.mouse.up(); await p(900);
  mp = await mesure(pg, '#mur', '#dr-minut-pp'); mt = await mesure(T, '#mur2', '#dr-tab-minut');
  ok(tag + ' · 5 · la pastille a bougé au pilote', mp && avant && Math.abs(mp.fx - avant.fx) > 0.1, mp && mp.fx.toFixed(3));
  ok(tag + ' · 5 · elle a glissé au tableau, au même endroit, même taille', memePlace(mp, mt), JSON.stringify([mp, mt]));
  ok(tag + ' · 5 · la diapo n\'a pas changé (le glisser ne clique pas la diapo)', await pg.evaluate(i => S.di === i, i12));
  await capt(pg, tag + '-5-pilote'); await capt(T, tag + '-5-tableau');
  /* 6 · la dernière minute : 01:03, Départ, or ; quatre secondes plus tard, le rouge du site, ici et au tableau */
  if (!(await panneau(pg)).ouvert) await pg.click('#bchrono'); await p(300); await pg.click('#dr-minut-in', { clickCount: 3 }); await pg.keyboard.type('01:03'); await pg.keyboard.press('Enter'); await p(600);
  const o1 = await mesure(T, '#mur2', '#dr-tab-minut'); await p(4200); const r1 = await mesure(T, '#mur2', '#dr-tab-minut'), r2 = await mesure(pg, '#mur', '#dr-minut-pp');
  ok(tag + ' · 6 · avant la dernière minute : or', o1 && /228, 180, 92/.test(o1.coul), o1 && o1.chif + ' ' + o1.coul);
  ok(tag + ' · 6 · la dernière minute : #e8484c au tableau et au pilote', r1 && r2 && /232, 72, 76/.test(r1.coul) && /232, 72, 76/.test(r2.coul), r1 && r1.chif + ' ' + r1.coul + ' · ' + (r2 && r2.coul));
  /* ■ : la pastille quitte le tableau et la diapo */
  if (!(await panneau(pg)).ouvert) await pg.click('#bchrono'); await p(300); await pg.click('#dr-minut-stop'); await p(900);
  ok(tag + ' · ■ : la pastille retirée du tableau et du pilote', !(await mesure(T, '#mur2', '#dr-tab-minut')) && !(await mesure(pg, '#mur', '#dr-minut-pp')));
  ok(tag + ' · aucune requête hors de la page', hors.length === 0, hors.length + ' · ' + hors.slice(0, 4).join(' | ') + ' · appels retenus : ' + (await pg.evaluate(() => window.__MAQ_HORS)) + '/' + (await T.evaluate(() => window.__MAQ_HORS)));
  ok(tag + ' · aucune erreur de page, aucune boîte système', errs.length === 0, errs.slice(0, 3).join(' | '));
  await ctx.close();
}
await nav.close(); const ko = V.filter(x => !x.c).length; console.log('BILAN : ' + V.length + ' vérifications, ' + (V.length - ko) + ' OK, ' + ko + ' échec(s)'); process.exit(ko ? 1 : 0);
