// Audit p8-5f, par le geste : 8 lignes tapées sous le dernier bloc de la diapo 1 → pages, rien hors du cadre, atelier / pilote / tableau
import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve('../f/LIVRAISONS/DEROULE/p8-5f/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch(); const R = []; const dire = (n, ok, d) => { R.push(ok); console.log((ok ? 'ça va      ' : 'ÇA NE VA PAS') + ' · ' + n + (d ? ' — ' + d : '')); };
const mesure = pg => pg.evaluate(() => { const mur = document.getElementById('mur').getBoundingClientRect(); const c = document.querySelector('#mur .corpsd'); const els = Array.from(c.querySelectorAll('[data-p]')).filter(e => e.getBoundingClientRect().height > 0); const hors = els.filter(e => { const b = e.getBoundingClientRect(); return b.top < mur.top - 1 || b.bottom > mur.bottom + 1; }); return { police: getComputedStyle(c).fontSize, page: (document.querySelector('#mur .page') || {}).textContent || '', pages: (S.pagesCourantes || []).length, rendus: els.length, hors: hors.length, scrollTop: c.scrollTop, compte: (document.getElementById('compte') || {}).textContent || '', focusTexte: document.activeElement && document.activeElement.closest('#mur') ? document.activeElement.textContent.slice(-12) : '-', aRegler: alertesForme().filter(a => a.k === 'pleine').length }; });
for (const [W, H] of [[1280, 800], [1920, 1080]]) {
  const page = await browser.newPage({ viewport: { width: W, height: H } }); const err = []; page.on('pageerror', e => err.push(e.message));
  await page.goto(file); await page.waitForTimeout(500);
  await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
  const a0 = await mesure(page);
  await page.click('#mur .p8-ecrire'); await page.waitForTimeout(150);
  for (let i = 1; i <= 8; i++) { await page.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 5 }); if (i < 8) await page.keyboard.press('Enter'); await page.waitForTimeout(60); }
  await page.waitForTimeout(400);
  const a1 = await mesure(page);
  const trame = await page.evaluate(() => { const b = ecran().blocs[ecran().blocs.length - 1]; return (b.el || []).map(x => x.trim()); });
  dire(`${W} · atelier : 8 lignes → pages, rien hors du cadre, « À régler » + 1, curseur en place, trame entière`, a1.pages >= 2 && /page \d+ \/ \d+/.test(a1.page) && a1.hors === 0 && a1.scrollTop === 0 && a1.aRegler === a0.aRegler + 1 && /diapo\.$/.test(a1.focusTexte) && trame.length === 8 && trame.every((t, i) => t === `Ligne ajoutée numéro ${i + 1}, assez longue pour prendre de la place dans la diapo.`), `${a1.page} · pages ${a1.pages} · hors ${a1.hors} · scrollTop ${a1.scrollTop} · à régler ${a0.aRegler}→${a1.aRegler} · focus « …${a1.focusTexte} » · trame ${trame.length} lignes`);
  await page.click('.haut'); await page.keyboard.press('Shift+ArrowLeft'); await page.waitForTimeout(250);
  const a2 = await mesure(page);
  dire(`${W} · atelier : Maj+← → page 1`, /page 1 \//.test(a2.page) && a2.hors === 0, a2.page);
  // pilotage
  await page.click('#ong-pilotage'); await page.waitForTimeout(300); await page.click('[data-lancer="1"]'); await page.waitForTimeout(500);
  const p0 = await mesure(page); let horsMax = 0, bascule = null;
  for (let i = 1; i <= 14; i++) { await page.click('#bdev'); await page.waitForTimeout(90); const m = await mesure(page); horsMax = Math.max(horsMax, m.hors); if (bascule == null && /page 2 \//.test(m.page)) bascule = i; }
  const p1 = await mesure(page);
  let nPrec = 0; do { await page.click('#bprec'); await page.waitForTimeout(120); nPrec++; } while (nPrec < 14 && (await page.evaluate(() => etatDiapo().nDev)) >= bascule); const p2 = await mesure(page); /* ◀ jusqu'à revoiler le premier élément de la page 2 : la page doit revenir à 1 */
  const mr = await page.$eval('#mur', m => { const r = m.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await page.mouse.move(mr.x, mr.y); await page.mouse.wheel(0, 300); await page.waitForTimeout(250); const p3 = await mesure(page);
  dire(`${W} · pilotage : page 1 / 2 à 0 dévoilé, bascule seule, ◀, molette, rien hors du cadre`, /page 1 \/ 2/.test(p0.page) && p0.hors === 0 && bascule != null && /page 2 \/ 2/.test(p1.page) && horsMax === 0 && /page 1 \/ 2/.test(p2.page) && /page 2 \/ 2/.test(p3.page), `0 dévoilé : ${p0.page} · bascule au ▶ n°${bascule} · hors max ${horsMax} · ◀ ×${nPrec} → ${p2.page} · molette → ${p3.page}`);
  // la fenêtre du tableau
  const [fen] = await Promise.all([page.waitForEvent('popup'), page.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.waitForTimeout(600);
  const t = await fen.evaluate(() => { const mur = document.querySelector('.mur') || document.body; const mb = mur.getBoundingClientRect(); const c = document.querySelector('.corpsd'); const els = c ? Array.from(c.querySelectorAll('[data-p]')).filter(e => e.getBoundingClientRect().height > 0) : []; const hors = els.filter(e => { const b = e.getBoundingClientRect(); return b.top < mb.top - 1 || b.bottom > mb.bottom + 1; }); return { page: (document.querySelector('.page') || {}).textContent || '', hors: hors.length, rendus: els.length, police: c ? getComputedStyle(c).fontSize : '' }; });
  dire(`${W} · tableau : même page que le pilote, rien hors du cadre`, t.page === p3.page && t.hors === 0, `tableau ${t.page} (pilote ${p3.page}) · hors ${t.hors} · police ${t.police}`);
  if (W === 1280) { await page.screenshot({ path: 'T54-pilote-1280.png' }); await fen.screenshot({ path: 'T54-tableau-1280.png' }); }
  await fen.close();
  if (err.length) dire(`${W} · erreurs JS`, false, err.join(' | '));
  await page.close();
}
console.log('bilan : ' + R.filter(Boolean).length + ' ça va, ' + R.filter(x => !x).length + ' ça ne va pas, sur ' + R.length);
await browser.close();
