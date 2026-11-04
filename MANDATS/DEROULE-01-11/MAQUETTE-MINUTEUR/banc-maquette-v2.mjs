// Le banc de la maquette du minuteur v2 (C16 677) : le chrono P6 et « Ce que voit la classe » qui est le tableau. PAR LE GESTE (souris, clavier),
// à 1536 × 864 et 1920 × 1080, compté. Échoue (code 1) si une seule vérification échoue. usage : node banc-maquette-v2.mjs <maquette.html> <dossier des captures>
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; const require = createRequire(import.meta.url); const pw = require('playwright');
const F = path.resolve(process.argv[2]); const CAP = path.resolve(process.argv[3] || 'captures-v2'); fs.mkdirSync(CAP, { recursive: true });
const p = ms => new Promise(r => setTimeout(r, ms)); const V = []; const ok = (k, c, d = '') => { V.push({ k, c: !!c }); console.log((c ? 'OK  ' : 'ÉCHEC ') + k + (d ? ' · ' + d : '')); };
const nav = await pw.chromium.launch({ args: ['--no-sandbox'] });
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const garde = async pg => { if (await pg.isVisible('#garde.on #garde-devant').catch(() => false)) { await pg.click('#garde-devant'); await p(900); } };
/* le rectangle : place et taille en parts de la diapo, les textes qu'il couvre, le décompte, la couleur de l'anneau et du décompte */
const mesure = (pg, murSel, ppSel) => pg.evaluate(([ms, ps]) => { const mur = document.querySelector(ms), pp = document.querySelector(ps); if (!mur || !pp || pp.style.display === 'none' || !pp.offsetWidth) return null;
  const r = mur.getBoundingClientRect(), q = pp.getBoundingClientRect(); const L = []; const w = document.createTreeWalker(mur, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement || n.parentElement.offsetParent === null) continue; const rg = document.createRange(); rg.selectNodeContents(n); Array.from(rg.getClientRects()).forEach(x => L.push({ x, t: n.textContent.trim().slice(0, 30) })); }
  const couvre = L.filter(o => Math.min(o.x.right, q.right) - Math.max(o.x.left, q.left) > 1 && Math.min(o.x.bottom, q.bottom) - Math.max(o.x.top, q.top) > 1).map(o => o.t);
  const ch = pp.querySelector('.dr-pp-chif'), an = pp.querySelector('.dr-pp-anneau'); const cr = ch ? ch.getBoundingClientRect() : null;
  return { fx: (q.left - r.left) / r.width, fy: (q.top - r.top) / r.height, fw: q.width / r.width, fh: q.height / r.height, ratio: q.width / q.height, couvre, chif: ch ? ch.textContent : '', coul: ch ? getComputedStyle(ch).color : '', anneau: an ? an.getAttribute('stroke') : '', chifDedans: cr ? cr.left >= q.left - 1 && cr.right <= q.right + 1 : false, fond: getComputedStyle(pp).backgroundColor }; }, [murSel, ppSel]);
const memePlace = (a, b) => a && b && Math.abs(a.fx - b.fx) < 0.004 && Math.abs(a.fy - b.fy) < 0.006 && Math.abs(a.fw - b.fw) < 0.003 && Math.abs(a.fh - b.fh) < 0.005;
const panneau = pg => pg.evaluate(() => { const pn = document.getElementById('dr-minut-p'), mur = document.getElementById('mur'); if (!pn || pn.style.display === 'none' || !pn.offsetWidth) return { ouvert: false };
  const r = pn.getBoundingClientRect(), m = mur.getBoundingClientRect(); const no = Array.from(document.querySelectorAll('#pilotage .notes, .notes')).filter(x => x.offsetParent !== null)[0]; const nr = no ? no.getBoundingClientRect() : null;
  return { ouvert: true, surDiapo: !(r.top >= m.bottom - 1 || r.bottom <= m.top + 1 || r.left >= m.right || r.right <= m.left), sousDiapo: r.top >= m.bottom, dansEcran: r.bottom <= innerHeight && r.right <= innerWidth, auDessusNotes: nr ? nr.top >= r.bottom - 1 : null,
    pieces: { anneau: pn.querySelectorAll('.dr-mr-anneau').length, chiffres: pn.querySelectorAll('.dr-mr-dig b').length, plusMoins: pn.querySelectorAll('.dr-mr-pm').length, go: !!pn.querySelector('#dr-minut-go'), stop: !!pn.querySelector('#dr-minut-stop'), inter: !!pn.querySelector('#dr-minut-tab'), zoom: pn.querySelectorAll('input[type=range]').length },
    chiffres: Array.from(pn.querySelectorAll('.dr-mr-dig b')).map(b => b.textContent).join(''), sansBulle: Array.from(pn.querySelectorAll('button,label')).filter(b => !b.title).length }; });
/* ce que montre un tableau : le texte visible de la diapo et ses surlignages (la vignette et la fenêtre doivent dire la même chose) */
const vue = pg => pg.evaluate(() => { const m = document.getElementById('mur2'); if (!m) return null; return (m.innerText || '').replace(/\s+/g, ' ').trim() + ' ‖ marques : ' + Array.from(m.querySelectorAll('mark')).map(x => x.textContent).join(' / ') + ' ‖ à recopier : ' + m.querySelectorAll('[class*="ecr"],[class*="recop"]').length; });
const capt = async (pg, nom) => { await pg.screenshot({ path: path.join(CAP, nom + '.png') }); };

for (const [W, H] of [[1536, 864], [1920, 1080]]) {
  const tag = W + 'x' + H; const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const hors = [];
  ctx.on('request', r => { const u = r.url(); if (!/^(file|data|blob|about):/.test(u)) hors.push(u.slice(0, 90)); });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { errs.push('boîte : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
  await pg.goto('file://' + F, { waitUntil: 'load' }); await p(3500);
  /* 1 · une vraie heure : la case du lundi 14/09 (3E), « Ouvrir le pilotage et lancer » ; la diapo 12 par sa vignette, rien de plus dévoilé */
  await pg.evaluate(() => edtOuvrir()); await p(1500);   /* déclaré : l'emploi du temps s'ouvre par un appel (comme le banc v1 et les sondes) ; le reste se joue au geste */
  await pg.evaluate(() => { const x = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0)[0]; if (x) x.click(); }); await p(800);
  const lance = await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); for (let k = 0; k < 30 && !(await pg.evaluate(() => !!(window.S && S.lancee)).catch(() => false)); k++) await p(250); await p(1500); await pg.keyboard.press('Escape').catch(() => {}); await p(400); await garde(pg);
  ok(tag + ' · 1 · l\'heure lancée par la case', lance && await pg.evaluate(() => !!S.lancee && !S.repetition));
  const i12 = await pg.evaluate(() => { const E = seance().ecrans; return E.findIndex(e => /groupe pr[eé]sente/i.test(JSON.stringify(e.blocs || [])) && /hypoth[eè]se/i.test(JSON.stringify(e.blocs || []))); });
  const v = await pg.$('#volet .vig[data-i="' + i12 + '"]'); if (v) { await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); } await p(900); await garde(pg);
  ok(tag + ' · 1 · la diapo 12 « Chaque groupe présente… »', await pg.evaluate(i => S.di === i, i12));
  /* le tableau, comme dans le site : « Ouvrir le tableau », un second onglet ; puis « Ce que voit la classe » */
  const [T] = await Promise.all([pg.waitForEvent('popup', { timeout: 8000 }).catch(() => null), clicTexte(pg, 'button', 'Ouvrir le tableau')]);
  ok(tag + ' · le tableau ouvert dans un second onglet', !!T); if (!T) { await ctx.close(); continue; }
  T.on('pageerror', e => errs.push('tableau : ' + String(e.message).slice(0, 160))); await T.setViewportSize({ width: W, height: H }); await p(3500);
  await pg.click('#btableau'); await p(4500); const Vg = pg.frames().find(f => /vignette=1/.test(f.url()));
  const vg = await pg.evaluate(() => { const f = document.querySelector('#vue-mini iframe.dr-vig'); const b = document.getElementById('vue-mini'); if (!f || f.style.display === 'none') return null; const r = f.getBoundingClientRect(), rb = b.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), dedans: r.left >= rb.left - 1 && r.right <= rb.right + 1 && r.bottom <= rb.bottom + 1, rects: [r.left, r.top, r.right, r.bottom, rb.left, rb.top, rb.right, rb.bottom].map(Math.round), bord: getComputedStyle(b).borderTopWidth + ' ' + getComputedStyle(b).paddingTop + ' ' + getComputedStyle(b).boxSizing, titre: (document.getElementById('vue-titre') || {}).textContent }; });
  ok(tag + ' · 2 · « Ce que voit la classe » : la page du tableau elle-même, en petit dans la colonne de droite', !!Vg && vg && vg.dedans && Math.abs(vg.w / vg.h - 16 / 9) < 0.02, JSON.stringify(vg));
  if (!Vg) { await ctx.close(); continue; }
  const v0t = await vue(T), v0v = await vue(Vg); ok(tag + ' · 2 · au départ, la vignette montre ce que montre le tableau', v0t && v0t === v0v, (v0t || '').slice(0, 60) + ' | ' + (v0v || '').slice(0, 60));
  /* 2 · un dévoilement : « Dévoiler » ; la fenêtre et la vignette montrent la ligne */
  await pg.click('#bdev'); await p(1500); const v1t = await vue(T), v1v = await vue(Vg);
  ok(tag + ' · 2 · un dévoilement paraît au tableau et dans « Ce que voit la classe », pareil', v1t && v1t !== v0t && v1t === v1v, (v1t || '').length + ' / ' + (v1v || '').length + ' signes');
  for (let k = 0; k < 8; k++) { const c = await pg.evaluate(() => (document.getElementById('compte') || {}).textContent || ''); if (/^(\d+) \/ \1 dévoilés|rien à dévoiler/.test(c)) break; await pg.click('#bdev').catch(() => {}); await p(350); } await p(1200);
  ok(tag + ' · 2 · tout dévoilé : pareil des deux côtés', (await vue(T)) === (await vue(Vg)));
  /* 2 · un mot au tableau : double-clic sur « tableau » dans la diapo du pilote, Ctrl+H (surligner) */
  const mot = await pg.evaluate(() => { const w = document.createTreeWalker(document.getElementById('mur'), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const i = n.textContent.indexOf('abréviations'); if (i >= 0) { const rg = document.createRange(); rg.setStart(n, i + 2); rg.setEnd(n, i + 3); const q = rg.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; } } return null; });
  if (mot) { await pg.mouse.dblclick(mot.x, mot.y); await p(200); await pg.keyboard.press('Control+h'); await p(1600); }
  const v2t = await vue(T), v2v = await vue(Vg);
  ok(tag + ' · 2 · un mot surligné au pilote paraît au tableau et dans « Ce que voit la classe », pareil', mot && /marques : abréviations/.test(v2t || '') && v2t === v2v, (v2t || '').split('‖').slice(1).join('‖') + ' | ' + (v2v || '').split('‖').slice(1).join('‖'));
  /* 3 · le réglage P6 : sous la diapo, au-dessus des notes ; l'anneau, quatre chiffres et leurs + −, ▶, ■, l'interrupteur ; plus de zoom */
  await pg.click('#bchrono'); await p(400); const pa = await panneau(pg);
  ok(tag + ' · 3 · le réglage ouvert, jamais sur la diapo, sous elle, au-dessus des notes', pa.ouvert && !pa.surDiapo && pa.sousDiapo && pa.auDessusNotes !== false, JSON.stringify({ s: pa.surDiapo, d: pa.sousDiapo, n: pa.auDessusNotes }));
  ok(tag + ' · 3 · le réglage entier dans l\'écran, sans défiler', pa.dansEcran);
  ok(tag + ' · 3 · le réglage : l\'anneau, 4 chiffres, 8 + et −, ▶, ■, « au tableau » ; aucun zoom ; chaque bouton a sa bulle', pa.pieces && pa.pieces.anneau === 1 && pa.pieces.chiffres === 4 && pa.pieces.plusMoins === 8 && pa.pieces.go && pa.pieces.stop && pa.pieces.inter && pa.pieces.zoom === 0 && pa.sansBulle === 0 && pa.chiffres === '0500', JSON.stringify(pa.pieces) + ' ' + pa.chiffres + ' sans bulle ' + pa.sansBulle);
  /* l'interrupteur « au tableau » : la durée paraît aussitôt, immobile, au tableau, dans la vignette et sur la diapo du pilote */
  await pg.click('#dr-minut-tab'); await p(1200);
  let mp = await mesure(pg, '#mur', '#dr-minut-pp'), mt = await mesure(T, '#mur2', '#dr-tab-minut'), mv = await mesure(Vg, '#mur2', '#dr-tab-minut');
  ok(tag + ' · 3 · « au tableau » allumé : 05:00 au tableau et dans la vignette, avant ▶', mt && mv && mt.chif === '05:00' && mv.chif === '05:00', mt && mt.chif + ' / ' + (mv && mv.chif));
  await capt(pg, tag + '-3-reglage');
  await pg.click('#dr-minut-go'); await p(1300); ok(tag + ' · 3 · ▶ : le réglage se cache derrière le ⏱', !(await panneau(pg)).ouvert);
  mp = await mesure(pg, '#mur', '#dr-minut-pp'); mt = await mesure(T, '#mur2', '#dr-tab-minut'); mv = await mesure(Vg, '#mur2', '#dr-tab-minut');
  ok(tag + ' · 4 · au départ : le rectangle au tableau, dans la vignette et sur la diapo du pilote, même place, même taille', memePlace(mp, mt) && memePlace(mt, mv), JSON.stringify([mp, mt, mv].map(x => x && [x.fx, x.fy, x.fw, x.fh].map(y => y.toFixed(4)))));
  ok(tag + ' · 4 · un rectangle allongé (trois fois plus large que haut), or sur brun, le décompte dedans, aucun texte couvert', mt && Math.abs(mt.ratio - 3) < 0.05 && /228, 180, 92/.test(mt.coul) && /58, 44, 20/.test(mt.fond) && mt.chifDedans && !mt.couvre.length && !mp.couvre.length, mt && [mt.ratio.toFixed(2), mt.coul, mt.fond, mt.chifDedans, mt.couvre.length].join(' '));
  await capt(pg, tag + '-4-pilote'); await capt(T, tag + '-4-tableau');
  /* 5 · glisser le rectangle sur la diapo du pilote, à la souris */
  const box = await pg.locator('#dr-minut-pp').boundingBox(); const mur = await pg.locator('#mur').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2; const tx = mur.x + mur.width * 0.5, ty = mur.y + mur.height * 0.6;
  await pg.mouse.move(cx, cy); await pg.mouse.down(); for (let k = 1; k <= 12; k++) { await pg.mouse.move(cx + (tx - cx) * k / 12, cy + (ty - cy) * k / 12); await p(40); } await pg.mouse.up(); await p(1000);
  const avant = mp; mp = await mesure(pg, '#mur', '#dr-minut-pp'); mt = await mesure(T, '#mur2', '#dr-tab-minut'); mv = await mesure(Vg, '#mur2', '#dr-tab-minut');
  ok(tag + ' · 5 · glissé : il a bougé, et au tableau et dans la vignette il est au même endroit, même taille', mp && Math.abs(mp.fx - avant.fx) > 0.1 && memePlace(mp, mt) && memePlace(mt, mv), JSON.stringify([mp, mt, mv].map(x => x && [x.fx, x.fy].map(y => y.toFixed(4)))));
  ok(tag + ' · 5 · la diapo n\'a pas changé (le glisser ne clique pas la diapo)', await pg.evaluate(i => S.di === i, i12));
  /* 6 · redimensionner par le coin en bas à droite (+150 px), puis par le coin en haut à gauche (−60 px) : le coin opposé ne bouge pas */
  const bx = await pg.locator('#dr-minut-pp').boundingBox(); const se = await pg.locator('#dr-minut-pp .dr-pp-se').boundingBox();
  await pg.mouse.move(se.x + se.width / 2, se.y + se.height / 2); await pg.mouse.down(); for (let k = 1; k <= 10; k++) { await pg.mouse.move(se.x + se.width / 2 + 15 * k, se.y + se.height / 2 + 5 * k); await p(40); } await pg.mouse.up(); await p(1000);
  const bx2 = await pg.locator('#dr-minut-pp').boundingBox(); mp = await mesure(pg, '#mur', '#dr-minut-pp'); mt = await mesure(T, '#mur2', '#dr-tab-minut'); mv = await mesure(Vg, '#mur2', '#dr-tab-minut');
  ok(tag + ' · 6 · coin bas droit : plus grand (+150 px), le coin haut gauche n\'a pas bougé', Math.abs(bx2.width - bx.width - 150) < 3 && Math.abs(bx2.x - bx.x) < 1.5 && Math.abs(bx2.y - bx.y) < 1.5, [bx.width, bx2.width, bx2.x - bx.x, bx2.y - bx.y].map(Math.round).join(' '));
  ok(tag + ' · 6 · agrandi : même place et même taille au tableau et dans la vignette, toujours trois fois plus large que haut', memePlace(mp, mt) && memePlace(mt, mv) && Math.abs(mt.ratio - 3) < 0.05 && mt.chifDedans, JSON.stringify([mp, mt, mv].map(x => x && [x.fw, x.fh].map(y => y.toFixed(4)))));
  const nw = await pg.locator('#dr-minut-pp .dr-pp-nw').boundingBox(); await pg.mouse.move(nw.x + nw.width / 2, nw.y + nw.height / 2); await pg.mouse.down(); for (let k = 1; k <= 6; k++) { await pg.mouse.move(nw.x + nw.width / 2 + 10 * k, nw.y + nw.height / 2 + 3 * k); await p(40); } await pg.mouse.up(); await p(1000);
  const bx3 = await pg.locator('#dr-minut-pp').boundingBox(); mp = await mesure(pg, '#mur', '#dr-minut-pp'); mt = await mesure(T, '#mur2', '#dr-tab-minut'); mv = await mesure(Vg, '#mur2', '#dr-tab-minut');
  ok(tag + ' · 6 · coin haut gauche : plus petit (−60 px), le coin bas droit n\'a pas bougé ; tableau et vignette suivent', Math.abs(bx2.width - bx3.width - 60) < 3 && Math.abs((bx3.x + bx3.width) - (bx2.x + bx2.width)) < 1.5 && Math.abs((bx3.y + bx3.height) - (bx2.y + bx2.height)) < 1.5 && memePlace(mp, mt) && memePlace(mt, mv), [bx2.width, bx3.width].map(Math.round).join(' → '));
  ok(tag + ' · 6 · la diapo n\'a pas changé', await pg.evaluate(i => S.di === i, i12));
  await capt(pg, tag + '-6-pilote'); await capt(T, tag + '-6-tableau');
  /* 7 · ⏸ puis ▶ par le bouton du réglage (rouvert par le ⏱) */
  await pg.click('#bchrono'); await p(300); await pg.click('#dr-minut-go'); await p(1500); const a1 = (await mesure(T, '#mur2', '#dr-tab-minut')).chif; await p(1300); const a2 = (await mesure(T, '#mur2', '#dr-tab-minut')).chif, a2v = (await mesure(Vg, '#mur2', '#dr-tab-minut')).chif;
  ok(tag + ' · 7 · ⏸ : le tableau et la vignette s\'arrêtent', a1 === a2 && a2 === a2v, a1 + ' / ' + a2 + ' / ' + a2v);
  await pg.click('#dr-minut-go'); await p(1300); const a3 = (await mesure(T, '#mur2', '#dr-tab-minut')).chif; ok(tag + ' · 7 · ▶ : il repart', a3 !== a2, a2 + ' → ' + a3);
  /* 8 · les crans d'un chrono de 10 s : ■, la durée par les + et − (05:00 → 05:10 → 00:10), ▶ ; vert à 10 et 6, jaune à 5, orange à 2, rouge à 1 */
  if (!(await panneau(pg)).ouvert) await pg.click('#bchrono'); await p(300); await pg.click('#dr-minut-stop'); await p(700); ok(tag + ' · 8 · ■ : le chrono quitte le tableau et la vignette, le réglage se cache', !(await mesure(T, '#mur2', '#dr-tab-minut')) && !(await mesure(Vg, '#mur2', '#dr-tab-minut')) && !(await panneau(pg)).ouvert);
  await pg.click('#bchrono'); await p(400);
  await pg.click('.dr-mr-pm[data-d="10"]'); await p(150); for (let k = 0; k < 5; k++) { await pg.click('.dr-mr-pm[data-d="-60"]'); await p(150); }
  const pb = await panneau(pg); ok(tag + ' · 8 · la durée réglée par les + et − : 00:10', pb.chiffres === '0010', pb.chiffres);
  const gris = await pg.evaluate(() => { const b = document.querySelector('.dr-mr-pm[data-d="-60"]'); return { d: b.disabled, t: b.title }; }); ok(tag + ' · 8 · « − minute » grisé, sa raison dans sa bulle', gris.d && /^Grisé/.test(gris.t), gris.t);
  if (!(await pg.isChecked('#dr-minut-tab'))) await pg.click('#dr-minut-tab'); await p(300); await pg.click('#dr-minut-go');
  const vu = { T: {}, V: {}, P: {} }; const t0 = Date.now();
  while (Date.now() - t0 < 11500) { const [x, y, z] = await Promise.all([mesure(T, '#mur2', '#dr-tab-minut'), mesure(Vg, '#mur2', '#dr-tab-minut'), mesure(pg, '#mur', '#dr-minut-pp')]);
    [[x, 'T'], [y, 'V'], [z, 'P']].forEach(([m, k]) => { if (m && /^00:\d\d$/.test(m.chif)) { const s = +m.chif.slice(3); (vu[k][s] = vu[k][s] || new Set()).add(m.anneau); } }); await p(60); }
  const ATT = { 10: '#4f9d5d', 6: '#4f9d5d', 5: '#e0b83a', 2: '#e07b2e', 1: '#e8484c' };
  for (const k of ['T', 'V', 'P']) { const nom = { T: 'au tableau', V: 'dans « Ce que voit la classe »', P: 'sur la diapo du pilote' }[k];
    const res = Object.keys(ATT).map(s => [s, vu[k][s] ? Array.from(vu[k][s]).join('+') : 'pas vu']); ok(tag + ' · 8 · les crans ' + nom + ' : vert à 10 et 6, jaune à 5, orange à 2, rouge à 1', res.every(([s, c]) => c === ATT[s]), res.map(x => x.join('=')).join(' ')); }
  await p(4500); ok(tag + ' · 8 · fini : le chrono quitte le tableau, la vignette et la diapo', !(await mesure(T, '#mur2', '#dr-tab-minut')) && !(await mesure(Vg, '#mur2', '#dr-tab-minut')) && !(await mesure(pg, '#mur', '#dr-minut-pp')));
  ok(tag + ' · aucune requête hors de la page', hors.length === 0, hors.length + ' · ' + hors.slice(0, 4).join(' | ') + ' · appels retenus : ' + (await pg.evaluate(() => window.__MAQ_HORS)) + '/' + (await T.evaluate(() => window.__MAQ_HORS)) + '/' + (await Vg.evaluate(() => window.__MAQ_HORS)));
  ok(tag + ' · aucune erreur de page, aucune boîte système', errs.length === 0, errs.slice(0, 3).join(' | '));
  await ctx.close();
}
await nav.close(); const ko = V.filter(x => !x.c).length; console.log('BILAN : ' + V.length + ' vérifications, ' + (V.length - ko) + ' OK, ' + ko + ' échec(s)'); process.exit(ko ? 1 : 0);
