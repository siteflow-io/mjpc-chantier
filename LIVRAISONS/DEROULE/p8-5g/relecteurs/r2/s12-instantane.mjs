// L'instantané de la répétition est-il restauré ? comparaison pilotage (sans heure) avant / après une répétition
import { ouvrir, versAtelier, taperHuit, ouvrirEcran2, etat, pause, R2 } from './commun.mjs';
const mode = process.argv[2] || 'rep';
const { browser, ctx, page, erreurs } = await ouvrir();
await versAtelier(page);
await taperHuit(page);
const photo = async () => page.evaluate(() => ({
  titre: document.querySelector('#dtitre')?.textContent.slice(0, 50),
  vigs: Array.from(document.querySelectorAll('.vig')).map(v => v.className).join('|'),
  texte: document.body.innerText.replace(/\d\d:\d\d(:\d\d)?/g, 'hh:mm'),
}));
if (mode === 'base') {
  // sans répétition : l'atelier sur la diapo 3, puis Pilotage, lancer
  await page.locator('text=Tableau 2').first().click(); await pause(500);
  console.log('atelier :', await page.evaluate(() => document.body.innerText.match(/Atelier · Diapo \d+ sur \d+/)?.[0]));
  await page.click('#ong-pilotage'); await pause(500);
  console.log('pilotage sans heure, titre :', (await photo()).titre);
  await page.click('[data-lancer="1"]'); await pause(800);
  console.log('heure lancée, titre :', (await photo()).titre);
} else {
  await page.click('#ong-pilotage'); await pause(500);
  const avant = await photo();
  await page.click('#ong-atelier', { force: true }).catch(() => {}); await pause(500);
  if (await page.locator('#ecran-edt.on').count()) await versAtelier(page);
  await page.click('#at-jouer'); await pause(600);
  for (let i = 0; i < 16; i++) { await page.click('#bdev'); await pause(120); }
  await pause(300);
  console.log('répétition arrivée sur :', (await photo()).titre);
  await page.click('#rep-stop'); await pause(600);
  console.log('atelier après arrêt :', await page.evaluate(() => document.body.innerText.match(/Atelier · Diapo \d+ sur \d+/)?.[0]));
  await page.click('#ong-pilotage'); await pause(500);
  const apres = await photo();
  console.log('pilotage titre avant/après :', avant.titre, '→', apres.titre);
  console.log('vignettes identiques :', avant.vigs === apres.vigs);
  const la = avant.texte.split('\n'), lb = apres.texte.split('\n');
  const diff = lb.filter(l => !la.includes(l)).slice(0, 15), diff2 = la.filter(l => !lb.includes(l)).slice(0, 15);
  console.log('lignes nouvelles après :', JSON.stringify(diff)); console.log('lignes disparues :', JSON.stringify(diff2));
  await page.click('[data-lancer="1"]'); await pause(800);
  console.log('heure lancée, titre :', (await photo()).titre);
  await page.screenshot({ path: R2 + '/s12-heure-apres-rep.png' });
}
console.log('erreurs', erreurs);
await browser.close();
