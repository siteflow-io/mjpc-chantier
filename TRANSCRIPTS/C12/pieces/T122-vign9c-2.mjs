import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1875, height: 868 } }); page.on('pageerror', e => console.log('ERREUR :', e.message));
await page.goto('file:///home/claude/C12/maquette-v9c2-courante.html'); await page.waitForTimeout(400);
// remplacer les images par une image réelle (données) pour mesurer le débordement comme chez Paul
await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 1600; c.height = 1000; const g = c.getContext('2d'); g.fillStyle = '#7a8aa0'; g.fillRect(0, 0, 1600, 1000); g.fillStyle = '#e8e2d0'; g.fillRect(200, 300, 1200, 400); const u = c.toDataURL(); DATA.seances.forEach(s => s.ecrans.forEach(e => e.blocs.forEach(b => { if (b.t === 'image') b.ref = u; }))); });
const types = {};
for (const [si, h] of [[0, 1], [0, 2], [1, 2]]) { await page.evaluate(([k, hh]) => { S.si = k; S.di = 0; S.heure = hh; S.close = false; }, [si, h]); await page.click('#bfin'); await page.waitForTimeout(700);
  const r = await page.evaluate(() => Array.from(document.querySelectorAll('#fin .carte .mini')).map(m => { const c = m.closest('.carte'); const inner = m.querySelector('.mur'); const t = DATA.seances[S.si].ecrans[+m.dataset.i].blocs.map(b => b.t).join('+'); const rc = m.getBoundingClientRect(); const ri = inner.getBoundingClientRect(); const cont = inner.querySelector('.corpsd, .imgzone, .video'); const rcont = cont ? cont.getBoundingClientRect() : null; return { t, carte: Math.round(rc.width) + '×' + Math.round(rc.height), rendu: Math.round(ri.width) + '×' + Math.round(ri.height), deborde: cont ? (rcont.right > rc.right + 1 || rcont.bottom > rc.bottom + 1) : false, img: inner.querySelector('img') ? (() => { const i = inner.querySelector('img').getBoundingClientRect(); return Math.round(i.width) + '×' + Math.round(i.height); })() : null }; }));
  r.forEach(x => { types[x.t] = types[x.t] || x; }); console.log('séance', si + 1, 'H' + h, ':', r.map(x => x.t + ' ' + x.rendu + (x.img ? ' img ' + x.img : '') + (x.deborde ? ' DÉBORDE' : ' ok')).join(' | '));
  await page.screenshot({ path: 'vis/v9b-fin-s' + (si + 1) + 'h' + h + '.png' }); await page.click('#f-fermer'); await page.waitForTimeout(200); }
console.log('types vus :', Object.keys(types).join(', '));
await nav.close();
