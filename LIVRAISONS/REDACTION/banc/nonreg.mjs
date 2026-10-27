// LA NON-RÉGRESSION (mandat RU, banc ④) : pour trois copies et les MÊMES gestes, la fiche de redaction.html est mot pour mot
// celle de redaction_dugain_v3.html (production) — au nom de classe près (« 3e De Gaulle » → la classe choisie) et à l'énoncé près (contrôle n°79).
// Les gestes passent par le clavier et la souris de l'app (mode interrogatif) : 1-2-3-4, C + citation, + (compteur),
// le crayon ✏️, N puis E, la meilleure citation, Entrée jusqu'au récapitulatif.
import { hubDeDepart, installer, sessionProf } from './fauxhub.mjs';
// Paul, 27/10 14:12 : « un exemple pour le banc doit toujours être réaliste » — trois copies qui se tiennent : des niveaux cohérents entre eux,
// une longueur d'accord avec le reste, le compteur d'accord avec le niveau d'orthographe (seuils selon la longueur notée), des citations qui prouvent
// la phrase choisie, des fautes marquées qui sont des fautes, un crayon qui réécrit pour cette copie.
// L'ordre des points est l'ordre de correction : orthographe, syntaxe, lexique, enchaînement, énonciation, longueur, puis le critère propre au sujet.
export const COPIES = [
  // une copie fragile, courte, non relue (imagination) : 25 erreurs, longueur fragile → seuils [4, 10, 20] → Insuffisant, l'encart DNB sort
  { eleve: 'AUDEBERT Elise', variante: 0, plus: 25,
    niveaux: [[0, 3], [1, 2], [1, 0], [1, 1], [1, 2], [1, 1], [1, 3], [1, 1], [1, 2], [1, 0]],
    citations: { 1: 'Elle marchait. Il pleuvait. Elle avait froid.', 4: 'Marguerite entra dans la salle et elle voit les blessés', 7: 'il y avait de la boue partout et des rats dans la tranchée' },
    fautes: { 4: [7] },   // « voit » : le présent dans un récit au passé
    crayon: { k: 8, texte: "Tu inventes plusieurs péripéties, mais le départ vers le front arrive sans explication : on ne sait pas pourquoi Marguerite quitte l'hôpital." },
    meilleure: null },
  // une copie satisfaisante (réflexion), l'engagement non évalué (adaptation) : 9 erreurs, longueur satisfaisante → seuils [6, 15, 30] → Satisfaisant
  { eleve: 'BOIVIN Eden', variante: 1, plus: 9,
    niveaux: [[2, 0], [2, 1], [2, 2], [2, 1], [2, 0], [2, 2], [2, 1], [2, 2], [2, 0], 'NE'],
    citations: { 1: "Les récits de vie nous touchent parce qu'ils racontent des épreuves que nous n'avons pas vécues", 3: 'Un deuxième argument tient à la mémoire', 6: 'On peut se demander si lire la vie d’un autre nous aide vraiment à comprendre la nôtre', 7: "Dans Si c'est un homme, Primo Levi ne raconte pas seulement le camp : il montre ce qu'un homme garde de lui quand on lui a tout pris" },
    fautes: {}, crayon: null, meilleure: null },
  // une très bonne copie (imagination) : 3 erreurs, longueur très satisfaisante → seuils [7, 17, 35] → Très satisfaisant
  { eleve: 'CESBRON Lili', variante: 0, plus: 3,
    niveaux: [[3, 1], [3, 2], [3, 1], [3, 0], [3, 1], [3, 2], [3, 0], [3, 2], [3, 1], [3, 3]],
    citations: { 0: 'nous nous étions promis de ne jamais pleurer devant eux', 1: "Ce n'est qu'en voyant ses mains, ces mains qui avaient tenu des pinceaux avant la guerre, que je compris ce qu'on lui avait pris", 2: 'le grincement du brancard sur le gravier', 5: 'Je restai longtemps devant la porte, la main sur la poignée froide, sans oser entrer', 7: 'les bottes alignées sous les lits, comme si leurs propriétaires allaient revenir les chercher', 8: 'Le premier obus tomba au moment où elle refermait sa lettre', 9: "Je ne savais plus si j'avais peur pour lui ou peur de ce que j'allais devenir sans lui" },
    fautes: {},
    crayon: { k: 8, texte: "Tu construis ton récit avec un vrai sens du rythme : l'attente s'installe, et l'accident tombe au bon moment, comme quand tu écris {CIT}." },
    meilleure: ['Je compte les jours comme on compte les pas dans un couloir d’hôpital', 'Une image juste, qui dit l’attente sans la nommer.'] }
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
      if ((cp.fautes || {})[k] && cp.fautes[k].length) { await pg.click('.cit-actions .case-editer'); await att(pg, 200); for (const n of cp.fautes[k]) { const t = pg.locator('.mot-token').nth(n); if (await t.count()) { await t.click(); await att(pg, 120); } } await att(pg, 150); await pg.click('.marquage-actions .case-editer'); await att(pg, 200); } }
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
  await pg.goto('file://' + F + (q || '?mode=prof&id=dugain&classe=3_franklin_aretha')); await pg.waitForFunction(() => window.RU && RU.classe && state.classe.length > 0, null, { timeout: 12000 }).catch(() => {}); await att(pg, 400); return { pg, errs };
}
