// (p8-5d) mesure, pas un banc : la diapo change sans qu'aucun clic n'ôte le focus de la note (seul cas : l'animation accélérée de ⚙, simulation de la maquette).
// Ce qu'on attend de p8-5d : le panneau passe à la diapo courante, la note rend le focus, ce qui était tapé avant est entier dans la diapo d'avant.
import { chromium, CHROMIUM, MAQUETTE } from './env.mjs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'] });
const pg = await (await nav.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
await pg.goto(MAQUETTE); await pg.waitForTimeout(600); await pg.click('#edt-cases [data-lancer="1"]'); await pg.waitForTimeout(500);
const k1 = await pg.evaluate(() => cle());
await pg.click('#bsimu'); await pg.waitForTimeout(200); await pg.click('#s-anim'); await pg.click('#notesd .p8-mt'); await pg.keyboard.press('Control+End');
let tape = ''; for (const ch of 'Silence, puis on observe.') { if (await pg.evaluate(k => cle() !== k, k1)) break; await pg.keyboard.type(ch); tape += ch; await pg.waitForTimeout(60); }
const f0 = await pg.evaluate(() => !!document.activeElement.closest('#notesd')); /* le focus est encore dans la note à la fin de la frappe */
for (let k = 0; k < 50 && await pg.evaluate(k => cle() === k, k1); k++) await pg.waitForTimeout(100); /* on attend que l'animation change de diapo, sans toucher à rien */
await pg.waitForTimeout(200); console.log('focus dans la note à la fin de la frappe, diapo 1 : ' + f0);
const R = await pg.evaluate(k1 => ({ diapo: S.di + 1, cle: cle(), cles: Array.from(document.querySelectorAll('#notesd .p8-mt')).map(x => x.dataset.p8key), focus: !!document.activeElement.closest('#notesd'), note1: DATA.notes[k1].map(n => n.html).join(' ¶ ').slice(-40) }), k1);
console.log('tapé sur la diapo 1 avant le changement : « ' + tape + ' »'); console.log(JSON.stringify(R)); console.log('panneau = diapo courante : ' + R.cles.every(k => k === R.cle) + ' · focus rendu : ' + !R.focus + ' · tapé entier dans la diapo 1 : ' + R.note1.endsWith(tape) + ' · erreurs JS : ' + errs.length);
await nav.close();
