import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const D = [];
for (const [w, h] of [[1366, 768], [1536, 864], [1920, 1080]]) { for (const repli of [false, true]) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message)); const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a);
  await page.goto('file:///home/claude/C12/maquette-v9c2-courante.html'); await p(500); if (repli) { await page.click('#pg'); await page.click('#pd'); await p(200); }
  const tag = `${w}×${h}${repli ? ' repliées' : ''}`;
  const mesure = async (nom) => { const m = await ev(() => { const bad = []; const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }; document.querySelectorAll('button, .btn, .rond, input, select').forEach(el => { if (!vis(el)) return; if (el.closest('.fen') && !el.closest('.fen').classList.contains('on')) return; const r = el.getBoundingClientRect(); const cont = el.closest('.voile'); const defilable = cont && cont.scrollHeight > cont.clientHeight + 2; if (r.right > innerWidth + 1 || r.left < -1 || r.top < -1 || (r.bottom > innerHeight + 1 && !defilable)) bad.push((el.id || el.textContent.trim().slice(0, 14)) + ' hors écran'); }); const sc = document.scrollingElement; return { debordePage: sc.scrollHeight > innerHeight + 2 || sc.scrollWidth > innerWidth + 2, hors: bad.slice(0, 5) }; }); if (m.debordePage || m.hors.length) D.push(`${tag} · ${nom} : ${m.debordePage ? 'la page déborde ; ' : ''}${m.hors.join(', ')}`); await page.screenshot({ path: `vis/audit-${w}${repli ? 'r' : ''}-${nom}.png` }); };
  for (let k = 0; k < 6; k++) await page.keyboard.press('ArrowRight'); await mesure('pilotage');
  await page.click('#bfin'); await p(400); await mesure('fin-heure'); await page.click('#f-clore'); await p(400); await mesure('ouverture'); await page.click('#o-lancer'); await p(400);
  await page.keyboard.press('r'); await p(400); await mesure('relecture'); await page.keyboard.press('r');
  await page.keyboard.press('t'); await p(300); await mesure('toutes'); await page.keyboard.press('Escape');
  if (errs.length) D.push(tag + ' : erreurs JS ' + errs.join(' | ')); await ctx.close(); } }
console.log(D.length ? D.join('\n') : 'aucun défaut d\'affichage'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
