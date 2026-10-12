// répétition (Jouer en avance) sur la diapo en pages ; puis arrêt et lancement de l'heure, fenêtre restée ouverte
import { demarrer, ouvrirEcran2, comparer, etatMur, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer({ lancer: false, pilotage: false });
await page.click('#at-jouer'); await pause(800);
console.log('pilote en répétition:', (await etatMur(page, '#mur'))?.compteur, await page.evaluate(() => S.repetition));
let pop = await ouvrirEcran2(page, erreurs); await pause(150);
await comparer(page, pop, 'répétition ouverture 0 (150 ms)');
for (let i = 1; i <= 9; i++) { await page.click('#bdev'); await pause(150); }
await comparer(page, pop, 'répétition 9 ▶');
await pop.close(); await pause(300);
pop = await ouvrirEcran2(page, erreurs); await pause(150);
await comparer(page, pop, 'répétition rouverture à 9 (150 ms)');
await page.hover('#murcadre'); await page.mouse.wheel(0, -300); await pause(400);
await comparer(page, pop, 'répétition molette haut');
await pop.close(); await pause(300);
pop = await ouvrirEcran2(page, erreurs); await pause(400);
await comparer(page, pop, 'répétition rouverture page 1 choisie');
await page.keyboard.press('Shift+ArrowRight'); await pause(400);
await comparer(page, pop, 'répétition Maj+→');
// vignette diapo 2 puis retour
await page.click('#volet .vig[data-i="1"]'); await pause(500); await comparer(page, pop, 'répétition vignette d2');
await page.click('#volet .vig[data-i="0"]'); await pause(500); await comparer(page, pop, 'répétition vignette d1');
// arrêter, la fenêtre reste ouverte
await page.click('#rep-stop'); await pause(800);
console.log('après ■ Arrêter, tableau montre :', JSON.stringify((await etatMur(pop, '#mur2'))));
await pop.screenshot({ path: R1 + '/i-apres-arret.png' });
await page.click('#ong-pilotage'); await pause(400);
await page.locator('[data-lancer="1"]').first().click(); await pause(800);
await comparer(page, pop, 'heure lancée, fenêtre restée ouverte depuis la répétition');
await page.click('#bdev'); await pause(300); await comparer(page, pop, '▶');
console.log('erreurs', erreurs);
await browser.close();
