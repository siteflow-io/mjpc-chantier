// E1 — les captures de la NOTE : le site assemblé sur le faux hub, par les gestes, à 1366 × 768 — dans E1/captures/
import fs from 'fs'; import path from 'path';
import * as E from './env.mjs';
const OUT = path.join(E.ICI, '../captures'); fs.mkdirSync(OUT, { recursive: true });
const b = await E.nav(); const pris = [];
const cap = async (pg, nom) => { const f = path.join(OUT, 'E1-' + nom + '.png'); await pg.screenshot({ path: f }); pris.push(path.basename(f)); };
const sansVoile = pg => pg.evaluate(() => { const x = document.getElementById('fi-overlay'); if (x) x.remove(); });
{ // 1 · l'atelier dans le site : la colonne unique, la trame réelle, la barre fusionnée
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg); await cap(pg, '1-atelier-colonne-unique');
  // 2 · la mise en forme enregistrée (G, S, surlignage) et la sélection multiple
  const choisir = (k, a, z) => pg.evaluate(({ k, a, z }) => { const li = document.querySelector('#mur li[data-k="' + k + '"]'); const w = document.createTreeWalker(li, NodeFilter.SHOW_TEXT); let x = w.nextNode(); while (x && x.length < z) x = w.nextNode(); const r = document.createRange(); r.setStart(x, a); r.setEnd(x, z); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }, { k, a, z });
  await choisir(0, 0, 7); await pg.click('#at-gras'); await choisir(1, 0, 7); await pg.click('#at-soul'); await choisir(2, 0, 7); await pg.keyboard.press('Control+h'); await pg.waitForTimeout(300); await pg.mouse.click(5, 5); await pg.waitForTimeout(1500); await cap(pg, '2-mise-en-forme-enregistree');
  { const r = await pg.$eval('#volet [data-at-di="2"]', x => { const q = x.getBoundingClientRect(); return { x: q.left + 20, y: q.top + q.height / 2 }; }); await pg.mouse.click(r.x, r.y, { button: 'right' }); await pg.waitForTimeout(300); await cap(pg, '3-menu-de-la-colonne'); await pg.keyboard.press('Escape'); }
  const im = await pg.evaluate(() => dr_trame().findIndex(e => (e.blocs || []).some(x => x.t === 'image'))); await pg.click(`#volet [data-at-di="${im}"]`); await pg.waitForTimeout(400);
  const rect = () => pg.$eval('#mur .img-sup', e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  // 4 · la modale du site (« Changer l'adresse… », l'aperçu suit la frappe)
  const r = await rect(); await pg.mouse.click(r.x + r.w * .05, r.y + r.h * .1, { button: 'right' }); await pg.waitForTimeout(200); await cap(pg, '4-menu-image');
  await E.clicTexte(pg, '#menu *', 'Changer l\'adresse'); await pg.waitForTimeout(300); await pg.fill('#dr-saisie', 'dossier/absente.jpg'); await pg.waitForTimeout(600); await cap(pg, '5-modale-adresse-image'); await pg.keyboard.press('Escape');
  // 6 · la taille obtenue (13 · 12)
  await pg.evaluate(() => { S.di = 1; S.taille = 1; dr_tout(); }); await pg.waitForTimeout(300); await cap(pg, '6-taille-obtenue'); await o.ctx.close(); }
{ // 7 · l'entête du pilotage à 1366 ; 8 · la fiche ouverte au pilote
  const o = await E.ouvrir(b, { w: 1366, h: 768 }); const pg = o.pg; await sansVoile(pg);
  await pg.evaluate(() => Array.from(document.querySelectorAll('#at-arbre .at-som-pli'))[2].click()); await pg.waitForTimeout(1200);
  await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(800); await cap(pg, '7-entete-pilotage-1366');
  await pg.evaluate(() => { const i = seance().ecrans.findIndex(e => (e.blocs || []).some(b => b.t === 'fiche' && dr_ficheEnLigne(b))); S.di = i; dr_tout(); }); await pg.waitForTimeout(300);
  await pg.click('#mur .dr-fiche-ouvrir'); await pg.waitForTimeout(800); await pg.click('#bdev'); await pg.waitForTimeout(300); await cap(pg, '8-fiche-ouverte-au-pilote'); await o.ctx.close(); }
await b.close(); console.log(pris.length + ' captures : ' + pris.join(', '));
