import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve('../LIVRAISONS/DEROULE/p8-5c/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(file); await page.waitForTimeout(400);
// Avant toute répétition : heure lancée, « Fin de l'heure » visible ?
await page.click('[data-lancer="1"]'); await page.waitForTimeout(300);
const finAvant = await page.$eval('#bfin', b => b.getBoundingClientRect().width > 0);
const classesAvant = await page.$eval('.haut', h => h.className);
// Atelier → répétition → arrêter → pilotage (heure déjà lancée : pas d'écran EDT)
await page.click('#ong-atelier'); await page.waitForTimeout(250); await page.click('#at-jouer'); await page.waitForTimeout(300);
const classesPendant = await page.$eval('.haut', h => h.className);
const finPendant = await page.$eval('#bfin', b => b.getBoundingClientRect().width > 0);
await page.click('#rep-stop'); await page.waitForTimeout(300);
const classesApres = await page.$eval('.haut', h => h.className);
await page.click('#ong-pilotage'); await page.waitForTimeout(300);
const finApres = await page.$eval('#bfin', b => b.getBoundingClientRect().width > 0);
const edt = await page.$eval('#ecran-edt', e => e.classList.contains('on'));
console.log({ finAvant, classesAvant, classesPendant, finPendant, classesApres, finApres, edtOuvert: edt });
console.log((finAvant && !finPendant && finApres && classesApres === classesAvant && !edt) ? 'ça va · Arrêter rend l\'entête d\'avant, « Fin de l\'heure » revient au pilotage' : 'ÇA NE VA PAS');
await browser.close();
