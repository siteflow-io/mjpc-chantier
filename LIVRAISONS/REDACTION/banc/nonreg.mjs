// LA NON-RÉGRESSION (mandat RU, banc ④) : pour trois copies et les MÊMES gestes, la fiche de redaction.html est mot pour mot
// celle de redaction_dugain_v3.html (production) — au nom de classe près (« 3e De Gaulle » → la classe choisie).
// Les gestes passent par le clavier et la souris de l'app (mode interrogatif) : 1-2-3-4, C + citation, + (compteur),
// le crayon ✏️, N puis E, la meilleure citation, Entrée jusqu'au récapitulatif.
import { hubDeDepart, installer, sessionProf } from './fauxhub.mjs';
export const COPIES = [
  { eleve: 'AUDEBERT Elise', variante: 0, niveaux: [[2, 1], [3, 2], [1, 0], [2, 3], [3, 3], [0, 1], [2, 2], [1, 3], [3, 0], [2, 1]], citations: { 1: 'Le soleil tombait sur les tranchées', 4: 'je ne savait plus ou aller' }, plus: 9, crayon: { k: 6, texte: 'Tu construis ton récit avec soin, mais la fin arrive trop vite.' }, meilleure: ['Marguerite serra la lettre contre elle', 'Une image juste et sobre.'] },
  { eleve: 'BOIVIN Eden', variante: 1, niveaux: [[0, 2], [2, 0], [2, 2], [3, 1], 'NE', [1, 1], [0, 3], [2, 2], [3, 3], [1, 0]], citations: { 2: 'les récits de vie nous apprenne a vivre' }, plus: 22, crayon: null, meilleure: null },
  { eleve: 'CESBRON Lili', variante: 0, niveaux: [[3, 3], [3, 2], [2, 1], [3, 0], [2, 3], [3, 1], [2, 0], [3, 2], [2, 2], [3, 3]], citations: { 0: 'Il pleuvait depuis trois jours', 7: 'le silence du front' }, plus: 3, crayon: { k: 2, texte: 'Ton vocabulaire est riche : « {CIT} » en est la preuve.' }, meilleure: ['Je compte les jours comme on compte les morts', ''] }
];
const att = (pg, ms) => pg.waitForTimeout(ms);
export async function corriger(pg, cp, cle) {
  await pg.evaluate(id => ouvrirCopie(id), cle); await att(pg, 300);
  if (!(await pg.evaluate(() => document.getElementById('interroOverlay').classList.contains('show')))) { await pg.click('button[onclick="ouvrirInterrogatif()"]'); await att(pg, 400); }
  const btns = await pg.$$('.choix-sujet-btn'); if (btns.length > 1) { await btns[cp.variante].click(); await att(pg, 400); }
  for (let k = 0; k < cp.niveaux.length; k++) {
    const nv = cp.niveaux[k];
    const estOrtho = await pg.evaluate(() => interroState.indicateurs[interroState.k].id === 'orthographe');
    if (estOrtho) for (let i = 0; i < cp.plus; i++) { await pg.keyboard.press('+'); await att(pg, 15); }
    if (nv === 'NE') { await pg.keyboard.press('n'); await pg.keyboard.press('e'); await att(pg, 350); continue; }
    await pg.keyboard.press(String(nv[0] + 1)); await att(pg, 400);
    await pg.keyboard.press(String(nv[1] + 1)); await att(pg, 200);
    if (cp.citations[k]) { await pg.keyboard.press('c'); await att(pg, 100); await pg.keyboard.type(cp.citations[k]); await pg.keyboard.press('Enter'); await att(pg, 250);
      if (/savait|apprenne/.test(cp.citations[k])) { await pg.click('.cit-actions .case-editer'); await att(pg, 200); for (const n of [2, 4]) { const t = pg.locator('.mot-token').nth(n); if (await t.count()) { await t.click(); await att(pg, 120); } } await att(pg, 150); await pg.click('.marquage-actions .case-editer'); await att(pg, 200); } }
    if (cp.crayon && cp.crayon.k === k) { await pg.click('.descripteur-case.selected .case-editer'); await att(pg, 200); await pg.fill('.descripteur-textarea', cp.crayon.texte); await pg.mouse.click(5, 5); await att(pg, 300); }
    await pg.evaluate(() => document.activeElement && document.activeElement.blur()); await pg.keyboard.press('Enter'); await att(pg, 300);
  }
  if (cp.meilleure) { await pg.fill('#meilleureCitationInput', cp.meilleure[0]); await pg.dispatchEvent('#meilleureCitationInput', 'input'); if (cp.meilleure[1]) { await pg.fill('#meilleureCitationCommentaireInput', cp.meilleure[1]); await pg.dispatchEvent('#meilleureCitationCommentaireInput', 'input'); } }
  await pg.evaluate(() => { document.activeElement && document.activeElement.blur(); interroSuiv(); }); await att(pg, 300);   // → le récapitulatif
  return pg.evaluate(id => genererHTMLEleve(id), cle);
}
// la production : son état d'avant (la liste collée) — rien d'autre
export async function pageProd(ctx, F, noms) {
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(n => { try { localStorage.setItem('redaction_dugain_v2', JSON.stringify({ classe: n, copies: {}, tri: 'ordre', paquetOrdre: [], interroBookmark: {} })); localStorage.setItem('redaction_dugain_autosave_on_validate', 'false'); } catch (e) {} }, noms);
  await pg.goto('file://' + F); await att(pg, 600); return { pg, errs };
}
export async function pageRU(ctx, F, hub, q) {
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(installer, hub); await pg.addInitScript(sessionProf); await pg.addInitScript(() => { try { localStorage.setItem('redaction_dugain_autosave_on_validate', 'false'); } catch (e) {} });
  await pg.goto('file://' + F + (q || '?mode=prof&id=dugain&classe=3_franklin_aretha')); await att(pg, 1200); return { pg, errs };
}
