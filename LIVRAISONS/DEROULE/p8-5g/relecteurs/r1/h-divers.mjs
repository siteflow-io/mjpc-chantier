// avant le lancement ; curseur « texte au tableau » ; fenêtre du pilote redimensionnée / poignées ; poignée-mur
import { demarrer, ouvrirEcran2, comparer, etatMur, pause, R1 } from './commun.mjs';
{
  const { browser, page, erreurs } = await demarrer({ lancer: false });
  const pop = await ouvrirEcran2(page, erreurs).catch(e => (console.log('Écran 2 avant lancement :', e.message), null));
  if (pop) {
    await pause(600);
    console.log('avant lancement, tableau:', JSON.stringify(await etatMur(pop, '#mur2')), 'pilote:', (await etatMur(page, '#mur'))?.compteur);
    await page.locator('[data-lancer="1"]').first().click(); await pause(700);
    await comparer(page, pop, 'puis lancer l\'heure');
    for (let i = 0; i < 9; i++) { await page.click('#bdev'); await pause(120); }
    await comparer(page, pop, '9 ▶');
  }
  console.log('erreurs', erreurs);
  await browser.close();
}
{
  const { browser, page, erreurs } = await demarrer();
  for (let i = 0; i < 9; i++) { await page.click('#bdev'); await pause(120); }
  let pop = await ouvrirEcran2(page, erreurs); await pause(600);
  await comparer(page, pop, 'base 9');
  // curseur texte au tableau
  const t = page.locator('#taille');
  const vals = await t.evaluate(e => [e.min, e.max, e.step, e.value]); console.log('curseur', vals);
  await t.focus();
  for (let k = 0; k < 3; k++) { await page.keyboard.press('ArrowRight'); await pause(500); await comparer(page, pop, 'curseur → ' + (k + 1)); }
  for (let k = 0; k < 6; k++) { await page.keyboard.press('ArrowLeft'); await pause(500); await comparer(page, pop, 'curseur ← ' + (k + 1)); }
  await page.mouse.click(5, 5); // sortir du curseur
  await pop.close(); await pause(300);
  pop = await ouvrirEcran2(page, erreurs); await pause(600);
  await comparer(page, pop, 'rouverture après curseur');
  // la fenêtre du pilote change de taille
  for (const [w, h] of [[1920, 1080], [1024, 700], [1366, 768], [1280, 800]]) {
    await page.setViewportSize({ width: w, height: h }); await pause(600);
    await comparer(page, pop, `pilote ${w}x${h}`);
    await page.click('#bdev'); await pause(300); await comparer(page, pop, `pilote ${w}x${h} puis ▶`);
    await page.click('#bprec'); await pause(300);
  }
  // poignée-mur : double clic / tirer
  const b = await page.locator('#poignee-mur').boundingBox();
  if (b) {
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2, b.y - 200, { steps: 8 }); await page.mouse.up(); await pause(600);
    await comparer(page, pop, 'poignée-mur tirée vers le haut (diapo réduite)');
    await pop.close(); await pause(300); pop = await ouvrirEcran2(page, erreurs); await pause(600);
    await comparer(page, pop, 'rouverture diapo réduite');
    await page.click('#bdev'); await pause(300); await comparer(page, pop, 'diapo réduite ▶');
  }
  // replier les volets
  await page.dblclick('#pg'); await page.dblclick('#pd'); await pause(600);
  await comparer(page, pop, 'volets repliés');
  await pop.close(); await pause(300); pop = await ouvrirEcran2(page, erreurs); await pause(600);
  await comparer(page, pop, 'rouverture volets repliés');
  await page.screenshot({ path: R1 + '/h-pilote-replie.png' });
  console.log('erreurs', erreurs);
  await browser.close();
}
