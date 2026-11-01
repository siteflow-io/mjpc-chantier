// Le faux hub de la sonde des diapos d'ouverture (C16) : AUDITS/INTEGRATION-DEROULE/hub (jamais modifié), lu puis complété EN MÉMOIRE :
// (1) les phrases d'élève des compétences, telles qu'elles sont au vrai hub depuis le 12/10 (MANDATS/LIBELLES-ELEVE-COMPETENCES : identiques à
//     AUDITS/CONTROLES-QCM-APP/attendus/taxonomie-competences.json) — la copie du faux hub date d'avant ;
// (2) l'heure du 07/09 retirée de la copie de la classe (comme controles.mjs v2.2) : la séance 1 se joue à son heure 1, là où sont les diapos d'ouverture ;
// (3) si `champs` : ce que Paul remplira dans la carte (des phrases de séance réalistes, des séances évaluées, l'image du chapitre et d'une séance) —
//     les séances 8 et 9 restent sans phrase, la 7 sans « évaluée » : ce qui manque doit se dire dans « À régler ».
import fs from 'fs'; import path from 'path';
export const MEDIAS = 'https://siteflow-io.github.io/mjpc-medias/';
export function storeOuverture(racine, { champs = true, joue = false } = {}) {
  const HUB = path.join(racine, 'AUDITS', 'INTEGRATION-DEROULE', 'hub'); const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
  const st = { classes: J('classes.json'), taxonomie: J('taxonomie.json'), site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { st.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {}
  const reel = JSON.parse(fs.readFileSync(path.join(racine, 'AUDITS', 'CONTROLES-QCM-APP', 'attendus', 'taxonomie-competences.json'), 'utf8'));
  st.taxonomie.competences = reel;
  const ch = st.site['3e'].chapitres[0];
  if (!joue) Object.values(ch.seances).forEach(se => { if (se) delete se.deroule_joue; });
  if (champs) {
    const P = ['Observer cinq tableaux du XIXe siècle et formuler avec la classe ce qu’ils ont en commun : l’homme face à la nature, l’émotion avant la règle.',
      'Lire « L’Albatros » de Baudelaire, repérer la comparaison filée et comprendre ce que le poème dit du poète parmi les hommes.',
      'Réciter les bases du cours, puis analyser des phrases complexes : propositions, subordonnées, fonctions.',
      'Orthographier un poème en prose dicté, puis le réécrire en changeant de personne et de temps.',
      'Écrire un paragraphe d’analyse sur un sonnet, en citant le texte et en nommant ses procédés.',
      'Étudier « Parfum exotique » dans les conditions du brevet : compréhension, grammaire, réécriture.',
      'Dire « À une passante » par cœur, en faisant entendre le rythme et les enjambements.'];
    const keys = Object.keys(ch.seances).sort((a, b) => (+ch.seances[a].ordre || 0) - (+ch.seances[b].ordre || 0));
    keys.forEach((k, i) => { const se = ch.seances[k]; if (P[i]) se.objectif = P[i]; if (i !== 6) se.evaluee = [2, 3, 5, 8].indexOf(i) >= 0; });
    ch.image = { ref: MEDIAS + '3e/poesie-peinture-xixe/chapitre.png' };
    ch.seances[keys[0]].image = { ref: MEDIAS + '3e/poesie-peinture-xixe/seance-1.png' };
  }
  return st;
}
