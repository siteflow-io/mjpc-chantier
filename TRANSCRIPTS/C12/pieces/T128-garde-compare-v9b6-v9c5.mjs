// la garde de changement de diapo : le même parcours sur la v9b.6 (validée « à peu près correcte » le 15/09) et sur la v9c.5 ; on note ce que chaque geste produit, sans juger
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const jouer = async (fichier, edt) => { const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message)); const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a); const out = [];
  await page.goto('file:///home/claude/C12/' + fichier); await p(500); if (edt) { await page.click('#edt-cases [data-lancer="1"]'); await p(300); }
  const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]); await tab.waitForLoadState(); await p(400);
  const etat = async (nom) => { const s = await ev(() => ({ di: S.di, nDev: etatDiapo().nDev, gel: !!S.gel, garde: document.getElementById('garde').classList.contains('on'), garde2: document.getElementById('garde2').classList.contains('on'), titreGarde: document.getElementById('garde-titre').textContent })); const t = await tab.evaluate(() => (window._et || {}).di); out.push(`${nom} → pilote d${s.di + 1} (${s.nDev} dévoilés) · tableau d${t == null ? '?' : t + 1} · gel ${s.gel ? 'oui' : 'non'} · garde ${s.garde ? 'OUVERTE « ' + s.titreGarde + ' »' : 'non'}${s.garde2 ? ' · garde2 OUVERTE' : ''}`); return s; };
  await etat('ouverture');
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await p(150); await etat('2 ▶');
  await page.click('#volet .vig[data-i="1"]'); await p(200); const a = await etat('clic vignette 2 (diapo pas finie)'); if (a.garde) { await page.click('#garde-non'); await p(100); await etat('  → Rester'); }
  for (let k = 0; k < 4; k++) await page.keyboard.press('ArrowRight'); await p(150); await etat('4 ▶ (diapo finie, 6/6)');
  await page.click('#volet .vig[data-i="1"]'); await p(200); const b = await etat('clic vignette 2 (la suivante, diapo finie)');
  await page.click('#volet .vig[data-i="4"]'); await p(200); const c = await etat('clic vignette 5 (saut)'); if (c.garde) { await page.click('#garde-gel'); await p(200); await etat('  → Geler, puis y aller'); await page.keyboard.press('ArrowRight'); await p(150); await etat('  ▶ pendant le gel'); }
  await page.click('#bgel'); await p(200); const d = await etat('clic ❄ (dégeler ailleurs)'); if (d.garde2) { await page.click('#garde2-revenir'); await p(200); await etat('  → Revenir là où est la classe, puis dégeler'); }
  await page.keyboard.press('ArrowLeft'); await p(200); const e = await etat('◀ en début de diapo (retour)'); if (e.garde) { await page.click('#garde-devant'); await p(200); await etat('  → Y aller devant la classe'); }
  await page.keyboard.press('PageDown'); await p(200); const f = await etat('PageDown'); if (f.garde) { await page.keyboard.press('Escape'); await p(100); await etat('  → Échap'); }
  await page.click('#volet .vig[data-i="7"]'); await p(200); const g = await etat('clic vignette 8'); if (g.garde) { await page.keyboard.press('Enter'); await p(200); await etat('  → Entrée (= geler puis y aller)'); }
  out.push('erreurs JS : ' + errs.length); await ctx.close(); return out; };
const A = await jouer('T110-maquette-pilotage-ordi-v9b6-manipulable.html', false); const B = await jouer('maquette-v9c5-courante.html', true);
console.log('══ v9b.6 (validée le 15/09) ══'); console.log(A.join('\n')); console.log('══ v9c.5 ══'); console.log(B.join('\n'));
await nav.close();
