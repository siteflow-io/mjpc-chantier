// Le banc de la frappe du chrono (C16 681, maquette v3) : un clic sur un chiffre, puis le clavier. PAR LE GESTE (souris, clavier), à 1536 × 864, compté.
// Le début (l'heure lancée, la diapo 12, le tableau, « Ce que voit la classe ») est repris tel quel du banc v2. usage : node banc-frappe-v3.mjs <maquette.html> <dossier des captures>
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

for (const [W, H] of [[1536, 864]]) {
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
  /* F · la frappe : un clic sur un chiffre le désigne ; 0, 0, 1, 5 au clavier ; Échap, un clic ailleurs ; les + et − ; 00:00 ; ▶ */
  const sel = () => pg.evaluate(() => Array.from(document.querySelectorAll('#dr-minut-p .dr-mr-dig b.dr-mr-sel')).map(b => b.dataset.k).join(','));
  const ch = async () => (await panneau(pg)).chiffres; const di0 = await pg.evaluate(() => S.di);
  await pg.click('#bchrono'); await p(400); ok(tag + ' · F · le réglage ouvert, la durée de départ 05:00', (await ch()) === '0500', await ch());
  const bul = await pg.evaluate(() => Array.from(document.querySelectorAll('#dr-minut-p .dr-mr-dig b')).filter(b => /Clique sur ce chiffre/.test(b.title)).length); ok(tag + ' · F · chaque chiffre a sa bulle (clic, puis clavier)', bul === 4, bul + '/4');
  await pg.click('.dr-mr-dig b[data-k="dm"]'); await p(200); ok(tag + ' · F · un clic sur le premier chiffre le désigne (encadré)', (await sel()) === 'dm', await sel()); await capt(pg, 'F-designe');
  const pas = []; for (const k of ['0', '0', '1', '5']) { await pg.keyboard.press(k); await p(150); pas.push((await ch()) + '/' + (await sel())); }
  ok(tag + ' · F · taper 0, 0, 1, 5 : chaque chiffre remplacé, on passe au suivant, puis c\'est fini', pas.join(' ') === '0500/m 0000/ds 0010/s 0015/', pas.join(' '));
  ok(tag + ' · F · les chiffres tapés ne changent pas la diapo', (await pg.evaluate(() => S.di)) === di0);
  await pg.click('.dr-mr-dig b[data-k="m"]'); await p(150); await pg.keyboard.press('Escape'); await p(200); ok(tag + ' · F · Échap termine', (await sel()) === '' && (await pg.evaluate(() => !!S.lancee)), await sel());
  await pg.click('.dr-mr-dig b[data-k="m"]'); await p(150); await pg.click('#dr-minut-p .dr-mr-dp'); await p(200); ok(tag + ' · F · un clic ailleurs termine', (await sel()) === '', await sel());
  await pg.click('.dr-mr-dig b[data-k="ds"]'); await p(150); await pg.keyboard.press('7'); await p(150); const r7 = (await ch()) + '/' + (await sel()); await pg.keyboard.press('Escape'); await p(150);
  ok(tag + ' · F · les dizaines de secondes refusent 7 (de 0 à 5)', r7 === '0015/ds', r7);
  await pg.click('.dr-mr-pm[data-d="10"]'); await p(200); const pl = await ch(); await pg.click('.dr-mr-pm[data-d="-10"]'); await p(200); const mo = await ch();
  ok(tag + ' · F · les + et − marchent encore : 00:25 puis 00:15', pl === '0025' && mo === '0015', pl + ' → ' + mo);
  await pg.click('.dr-mr-dig b[data-k="ds"]'); await p(150); await pg.keyboard.press('0'); await pg.keyboard.press('0'); await p(200); const go0 = await pg.evaluate(() => { const b = document.getElementById('dr-minut-go'); return { d: b.disabled, t: b.title }; });
  ok(tag + ' · F · 00:00 tapé : ▶ grisé, sa raison dans sa bulle', (await ch()) === '0000' && go0.d && /^Grisé : la durée est 00:00/.test(go0.t), (await ch()) + ' · ' + go0.t);
  await pg.click('.dr-mr-dig b[data-k="ds"]'); await p(150); await pg.keyboard.press('1'); await pg.keyboard.press('5'); await p(200); ok(tag + ' · F · retapé : 00:15, ▶ de nouveau actif', (await ch()) === '0015' && !(await pg.evaluate(() => document.getElementById('dr-minut-go').disabled)), await ch());
  await capt(pg, 'F-0015');
  if (!(await pg.isChecked('#dr-minut-tab'))) await pg.click('#dr-minut-tab'); await p(300); await pg.click('#dr-minut-go'); await p(700);
  const [x0, y0] = await Promise.all([mesure(T, '#mur2', '#dr-tab-minut'), mesure(Vg, '#mur2', '#dr-tab-minut')]); const dur = await pg.evaluate(() => DR_CL.minut && DR_CL.minut.duree);
  ok(tag + ' · F · ▶ lance 15 s : au tableau et dans « Ce que voit la classe »', dur === 15000 && x0 && y0 && /^00:1[45]$/.test(x0.chif) && /^00:1[45]$/.test(y0.chif), dur + ' ms · ' + (x0 && x0.chif) + ' / ' + (y0 && y0.chif));
  await capt(T, 'F-tableau'); await p(2200); const x1 = await mesure(T, '#mur2', '#dr-tab-minut'); ok(tag + ' · F · il court au tableau', x1 && /^00:1[123]$/.test(x1.chif), x1 && x1.chif);
  await p(19000); ok(tag + ' · F · fini après 15 s : il quitte le tableau et la vignette', !(await mesure(T, '#mur2', '#dr-tab-minut')) && !(await mesure(Vg, '#mur2', '#dr-tab-minut')));
  ok(tag + ' · aucune requête hors de la page', hors.length === 0, hors.length + ' · ' + hors.slice(0, 4).join(' | '));
  ok(tag + ' · aucune erreur de page, aucune boîte système', errs.length === 0, errs.slice(0, 3).join(' | '));
  await ctx.close();
}
await nav.close(); const ko = V.filter(x => !x.c).length; console.log('BILAN : ' + V.length + ' vérifications, ' + (V.length - ko) + ' OK, ' + ko + ' échec(s)'); process.exit(ko ? 1 : 0);
