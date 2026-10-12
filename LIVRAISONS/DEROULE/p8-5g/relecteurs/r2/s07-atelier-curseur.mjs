// Atelier : la page suit la ligne où Paul écrit, le curseur ne perd rien
import { ouvrir, versAtelier, taperHuit, etat, pause, R2 } from './commun.mjs';
const W = +(process.argv[2] || 1280), H = +(process.argv[3] || 800);
const { browser, ctx, page, erreurs } = await ouvrir(W, H);
await versAtelier(page);
await taperHuit(page);
const focus = () => page.evaluate(() => { const a = document.activeElement; const s = getSelection(); return { tag: a.tagName, k: a.dataset?.k ?? a.closest?.('li')?.dataset.k, p: a.dataset?.p, t: (a.closest?.('li') || a).textContent.slice(0, 30), hors: !!a.closest?.('.hors'), off: s.focusOffset, node: (s.focusNode?.textContent || '').slice(0, 20) }; });
const court = async (lbl) => { const e = await etat(page); console.log(lbl, '| cpt', e.cpt, '| lignes', e.lignes.map(l => l.split(':')[0]).join(' '), '| hors', e.hors.length, '| focus', JSON.stringify(await focus())); return e; };
await court('après 8 lignes + Échap');
// 1. cliquer dans « Quatrième » (page 2) puis flèche haut
await page.getByText('Quatrième longue ligne', { exact: false }).first().click(); await pause(300);
await court('clic dans Quatrième');
await page.keyboard.press('Home');
await page.keyboard.press('Shift+Tab'); await pause(500);
await court('Maj+Tab depuis Quatrième');
await page.keyboard.type('XYZ', { delay: 30 }); await pause(500);
await court('tapé XYZ');
await page.screenshot({ path: R2 + `/s07-fleche-${W}.png` });
await page.keyboard.press('Tab'); await pause(500);
await court('Tab → Quatrième');
// sortir de la saisie : clic hors du mur (titre de l'atelier)
await page.mouse.click(600, 60); await pause(400);
await court('clic hors saisie');
// 2. Maj+← pour voir la page 1, cliquer à la fin de « Troisième », taper beaucoup → la ligne grossit
await page.keyboard.press('Shift+ArrowLeft'); await pause(400);
await court('Maj+←');
const tr = page.locator('#mur li', { hasText: 'Troisième longue ligne' }).first();
if (await tr.isVisible()) {
  await tr.click(); await page.keyboard.press('End'); await pause(200);
  await court('clic Troisième, Fin');
  const ajout = ' et Paul continue d écrire une phrase très longue qui passe à la ligne plusieurs fois pour voir si la page change pendant la frappe sans perdre une seule lettre ABCDEFGHIJ';
  await page.keyboard.type(ajout, { delay: 0 }); await pause(600);
  const e = await court('après longue frappe');
  const txt = await tr.textContent().catch(() => null);
  const attendu = 'Troisième longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre' + ajout;
  console.log(txt === attendu ? 'OK texte intact' : 'KO texte : ' + JSON.stringify(txt));
  await page.screenshot({ path: R2 + `/s07-frappe-${W}.png` });
  // Entrée puis frappe immédiate
  await page.keyboard.press('Enter'); await page.keyboard.type('Nouvelle ligne après Entrée', { delay: 0 }); await pause(600);
  await court('Entrée + frappe');
  console.log('lignes contenant Nouvelle :', await page.$$eval('#mur li', l => l.filter(x => x.textContent.includes('ouvelle ligne')).map(x => x.textContent)));
  await page.keyboard.press('Escape'); await pause(400);
  await court('Échap');
} else console.log('Troisième pas visible après Maj+←');
console.log('erreurs', erreurs);
await browser.close();
