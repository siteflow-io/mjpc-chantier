import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const F = process.argv[2] || 'file:///home/claude/C12/maquette-v9c2-courante.html';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a); const R = {}; const note = (k, v) => { R[k] = v; console.log(k, '→', JSON.stringify(v)); };
await page.goto(F); await p(400);
await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 800; c.height = 500; c.getContext('2d').fillStyle = '#789'; c.getContext('2d').fillRect(0, 0, 800, 500); const u = c.toDataURL(); DATA.seances.forEach(s => s.ecrans.forEach(e => e.blocs.forEach(b => { if (b.t === 'image') b.ref = u; }))); });
// 1. le mur : l'image est-elle recréée à chaque geste ? (identité du nœud) — pilote et tableau
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]); await tab.waitForLoadState(); await p(400);
await page.click('#volet .vig[data-i="1"]'); await p(100); await page.click('#garde-devant'); await p(300);
await ev(() => { window.__img = document.querySelector('#mur img'); }); await tab.evaluate(() => { window.__img = document.querySelector('#mur2 img'); });
await page.click('#blum'); await page.click('#blum'); await p(200);   // un geste qui redessine sans changer la diapo
note('1. pilote : l\'image est le même nœud après un geste', await ev(() => window.__img === document.querySelector('#mur img')));
await page.keyboard.press('n'); await page.keyboard.type('note'); await page.keyboard.press('Enter'); await page.keyboard.press('Escape'); await p(100);
await page.click('#bgel'); await page.click('#bgel'); await p(300);
note('1. tableau : l\'image est le même nœud après gel/dégel', await tab.evaluate(() => window.__img === document.querySelector('#mur2 img')));
// 2. l'écran de fin : cocher une notion en bas → l'écran remonte-t-il ? une décision → la rangée perd-elle son défilement ? la vignette agrandie reste-t-elle agrandie ?
await page.click('#bfin'); await p(500);
await ev(() => { document.getElementById('ecran-fin').scrollTop = 500; });
const av = await ev(() => ({ rangee: document.querySelector('.rangee').scrollLeft, ecran: document.getElementById('ecran-fin').scrollTop }));
await ev(() => { /* clic par script ici : un vrai clic ferait défiler l'écran pour atteindre le bouton, et c'est la conservation du défilement qu'on mesure */ document.querySelector('#fin .carte:nth-child(1) [data-c="pastemps"]').click(); }); await p(300);
const ap = await ev(() => ({ rangee: document.querySelector('.rangee').scrollLeft, ecran: document.getElementById('ecran-fin').scrollTop }));

note('2. après une décision : position verticale de l\'écran conservée', { avant: av.ecran, apres: ap.ecran, ok: Math.abs(av.ecran - ap.ecran) < 40 });
await page.click('#fin .carte:nth-child(1) .mini'); await p(100); const grandAv = await ev(() => !!document.querySelector('#fin .mini.grand'));
await ev(() => { const c = document.querySelector('#fin .taxo [data-notion]'); if (c) c.click(); }); await p(300);
note('2. après une case de notion : la vignette agrandie l\'est encore', { avant: grandAv, apres: await ev(() => !!document.querySelector('#fin .mini.grand')) });
await page.click('#f-fermer'); await p(200);
// 3. le volet : défilement conservé après un dévoilement ; la vignette est-elle le même nœud ?
await ev(() => { document.getElementById('volet').scrollTop = 300; window.__vig = document.querySelector('#volet .vig[data-i="1"]'); });
await page.keyboard.press('ArrowRight'); await p(200);
note('3. volet : défilement conservé et vignette non recréée après ▶', await ev(() => ({ scroll: document.getElementById('volet').scrollTop, memeNoeud: window.__vig === document.querySelector('#volet .vig[data-i="1"]') })));
// 4. la liste de classe : recréée à chaque frappe dans le VIF ?
await ev(() => { window.__l = document.querySelector('#liste div'); }); await page.fill('#vif', 'c'); await p(100);
note('4. liste de classe : même nœud après une frappe dans le VIF', await ev(() => window.__l === document.querySelector('#liste div')));
// 5. une note en cours d'édition survit-elle à un « verser » sur une autre ?
await page.keyboard.press('Escape'); await page.keyboard.press('n'); await page.keyboard.type('deuxième'); await page.keyboard.press('Enter'); await p(100);
await page.click('#fnotes .ligne:nth-child(1) .t'); await page.keyboard.press('End'); await page.keyboard.type(' — ajout'); await page.click('#fnotes .ligne:nth-child(2) [data-v]'); await p(150);
note('5. l\'édition de la note 1 est conservée après « verser » sur la note 2', await ev(() => S.notesFil[0].t));
note('erreurs JS', errs); await nav.close();
