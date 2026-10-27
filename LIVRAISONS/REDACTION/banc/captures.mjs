// LES CAPTURES POUR PAUL (contrôle n°80, E) : des corrections vraisemblables — des niveaux qui se tiennent entre eux,
// des citations qui prouvent ce que dit la phrase. (La non-régression garde ses copies d'essai ; ces copies-ci ne servent qu'aux images.)
// Un plan = la variante, puis pour chaque point dans l'ordre de correction : [niveau, sous-niveau, citation ou null] ; le compteur ; la meilleure citation.
export const PLAN_DUGAIN = { eleve: 'CHOUTEAU Baptistine', variante: 0, erreurs: 11, plan: {
  orthographe: [2, 1, null],
  syntaxe: [2, 1, "Quand l'infirmière-chef me tendit le registre des entrées, je compris que je ne reverrais pas Paris avant l'hiver"],
  lexique: [2, 1, "les brancardiers déposaient les blessés devant l'ambulance de campagne"],
  enchainement: [2, 0, null],
  enonciation: [2, 1, "La pluie tombait depuis l'aube quand je franchis la grille de l'hôpital"],
  longueur: [2, 2, null],
  remobilisation: [2, 1, null],
  cadre: [2, 0, "l'odeur d'éther et de laine mouillée qui remplissait la salle"],
  peripeties: [2, 0, null],
  sensations: [2, 2, "je n'avais pas peur, mais une inquiétude sourde me serrait le ventre chaque fois qu'on ouvrait la porte"] },
  meilleure: "je n'osais plus regarder les lits vides" };
export const PLAN_LETTRE = { eleve: 'CHOUTEAU Baptistine', variante: null, erreurs: 6, plan: {
  theme_tenu: [2, 2, "moi qui rabotais encore des portes à Tulle l'été dernier"],
  trois_paragraphes: [2, 2, null],
  lectures: [2, 1, null],
  ce_qu_on_tait: [2, 1, "Ne t'inquiète pas pour le froid, nous avons tout ce qu'il faut"],
  phrases_complexes: [2, 2, "la tranchée dont je t'ai parlé, où nous dormons à six, est plus sèche depuis lundi"],
  architectures: [2, 2, null],
  modalisation_litote: [2, 2, null],
  codes: [2, 2, "Je t'embrasse comme avant, quand je rentrais de l'atelier"],
  personne_destinataire: [2, 2, null],
  trente_lignes: [2, 1, null],
  orthographe: [2, 0, null],
  lexique: [2, 1, null] },
  meilleure: null };
const att = (pg, ms) => pg.waitForTimeout(ms);
export async function corrigerSelon(pg, P) {
  const cle = await pg.evaluate(n => eleveId(n), P.eleve);
  await pg.evaluate(k => ouvrirCopie(k), cle); await att(pg, 400);
  if (!(await pg.evaluate(() => document.getElementById('interroOverlay').classList.contains('show')))) { await pg.click('button[onclick="ouvrirInterrogatif()"]'); await att(pg, 400); }
  const btns = await pg.$$('.choix-sujet-btn'); if (btns.length && P.variante != null) { await btns[P.variante].click(); await att(pg, 400); }
  for (let n = 0; n < 30; n++) {
    const st = await pg.evaluate(() => ({ etape: interroState.etape, id: interroState.indicateurs && interroState.indicateurs[interroState.k] && interroState.indicateurs[interroState.k].id, compteur: interroState.indicateurs && estIndCompteur(state.current, interroState.indicateurs[interroState.k].id) }));
    if (st.etape !== 'indicateur_niveau') break;
    const [e, s, cit] = P.plan[st.id];
    if (st.compteur) for (let i = 0; i < P.erreurs; i++) { await pg.keyboard.press('+'); await att(pg, 15); }
    await pg.keyboard.press(String(e + 1)); await att(pg, 400); await pg.keyboard.press(String(s + 1)); await att(pg, 200);
    if (cit) { await pg.keyboard.press('c'); await att(pg, 100); await pg.keyboard.type(cit); await pg.keyboard.press('Enter'); await att(pg, 250); }
    await pg.evaluate(() => document.activeElement && document.activeElement.blur()); await pg.keyboard.press('Enter'); await att(pg, 300);
  }
  if (P.meilleure) { await pg.fill('#meilleureCitationInput', P.meilleure); await pg.dispatchEvent('#meilleureCitationInput', 'input'); }
  await pg.evaluate(() => { document.activeElement && document.activeElement.blur(); interroSuiv(); }); await att(pg, 400);
  return { cle, fiche: await pg.evaluate(k => genererHTMLEleve(k), cle) };
}
