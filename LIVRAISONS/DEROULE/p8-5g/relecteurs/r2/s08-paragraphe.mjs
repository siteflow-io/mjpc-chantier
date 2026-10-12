// Très long paragraphe sans Entrée sur la diapo 1 ; atelier, répétition + Écran 2
import { ouvrir, versAtelier, comparer, ouvrirEcran2, etat, pause, R2 } from './commun.mjs';
const W = +(process.argv[2] || 1280), H = +(process.argv[3] || 800);
const { browser, ctx, page, erreurs } = await ouvrir(W, H);
await versAtelier(page);
const long = Array.from({ length: 24 }, (_, i) => `phrase ${i + 1} d un paragraphe immense que Paul tape sans jamais appuyer sur Entrée`).join(' ') + ' FIN';
await page.click('#mur .p8-ecrire'); await pause(200);
await page.keyboard.type(long, { delay: 0 }); await pause(800);
const haut = async (p, sel, lbl) => { const r = await p.evaluate((sel) => { const m = document.querySelector(sel); const rm = m.getBoundingClientRect(); const c = m.querySelector('.corpsd'); const out = { pageTxt: m.querySelector('.page')?.textContent, corpsClass: c?.className, police: c && getComputedStyle(c).fontSize, dessus: [], dessous: [] };
  for (const el of m.querySelectorAll('li, .act, .cons, .page, .rep')) { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue; const r = el.getBoundingClientRect(); if (!r.height) continue; if (r.top < rm.top - 1) out.dessus.push(el.textContent.slice(0, 25) + ' top ' + Math.round(r.top - rm.top)); if (r.bottom > rm.bottom + 1) out.dessous.push(el.textContent.slice(0, 25) + ' bas ' + Math.round(r.bottom - rm.bottom)); }
  // ce que l'on voit vraiment : élément au point en haut à gauche du corps
  return out; }, sel); console.log(lbl, JSON.stringify(r)); };
await haut(page, '#mur', 'atelier en frappe');
await page.screenshot({ path: R2 + `/s08-atelier-frappe-${W}.png` });
const mb = await page.locator('#mur').boundingBox(); await page.screenshot({ path: R2 + `/s08-atelier-bas-${W}.png`, clip: { x: mb.x, y: mb.y + mb.height - 90, width: mb.width, height: 100 } });
const txt = await page.evaluate(() => document.activeElement.textContent);
console.log(txt === long ? 'OK texte intact' : 'KO texte perdu: ' + (txt.length + ' vs ' + long.length));
await page.mouse.click(600, 60); await pause(400);
await haut(page, '#mur', 'atelier hors saisie');
await page.click('#at-jouer'); await pause(600);
const pop = await ouvrirEcran2(ctx, page);
for (let i = 0; i < 12; i++) { await page.click('#bdev'); await pause(150); await haut(page, '#mur', `rep ▶${i + 1} pilote`); await haut(pop, '#mur2', `rep ▶${i + 1} tableau`); if (i === 6) await pop.screenshot({ path: R2 + `/s08-pop-p7-${W}.png` }); if (!(await page.evaluate(() => document.querySelector('#mur .corpsd li:last-of-type')))) break; }
await page.screenshot({ path: R2 + `/s08-rep-${W}.png` });
await pop.screenshot({ path: R2 + `/s08-pop-${W}.png` });
await page.click('#rep-stop'); await pause(400);
console.log('erreurs', erreurs);
await browser.close();
