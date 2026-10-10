// La mesure d'une question sur une vraie demi-tablette (1280 × 800, chaque moitié 640 de large), dans la page de la maquette :
// partagée par le mesureur (mesures/mesurer.js) et par la garde 4 du banc, qui rejoue un échantillon.
// Le reste : du bas de la carte de l'élève au bas de sa moitié (la mesure du tour 610 : 67 px pour la vraie question 3 de 3e) ;
// une moitié tient tant que ce reste couvre la marge du bas de la page (16 px). La fonction rend le reste au-delà de cette marge.
const MARGE = 16;
const MOTS = "la proposition relative complète toujours le nom antécédent qui la précède dans la phrase complexe et le verbe conjugué de la principale reste entier quand le sujet est loin".split(" ");
// un texte de n caractères exactement, fait de mots du cours (la mise en page coupe aux espaces, comme pour un vrai texte)
function texte(n, decal){
  let t = "", i = decal || 0;
  while(t.length < n){ t += (t ? " " : "") + MOTS[i % MOTS.length]; i++; }
  t = t.slice(0, n);
  return t.endsWith(" ") ? t.slice(0, -1) + "s" : t;
}
// Les trois écrans qui montrent les choix, chacun à son état le plus chargé :
//  « reponse » : l'écran de réponse, tous les choix cliqués, « ✅ Réponse enregistrée » ;
//  « b » : « dit-elle la même chose que ton clic ? », le clic figé ;
//  « lecture » : la lecture de la feuille du voisin à la correction, les choix cliqués, « ✅ Réponse enregistrée » et « 👀 Écoute le prof ».
function mesureDansLaPage([ecran, enonce, choix, MARGE]){
  var q = {enonce:enonce, choix:choix, bonnes:[0], niveau:"approfondi", reflexion:30, reponse:20, competences:[], explication:""};
  var ev = {titre:"3e- éval 1 Analyse logique - Construire une phrase complexe", mode:"strict", questions:[q, q, q]};
  var n = choix.length, ordre = []; for(var i = 0; i < n; i++) ordre.push(i);
  var sv = {EV:EV, ORD:ORD, LU:LU, TABL:TABL};
  EV = ev; ORD = [{J:ordre, M:ordre}, {J:ordre, M:ordre}, {J:ordre, M:ordre}]; LU = {J:[ordre, ordre, ordre], M:[ordre, ordre, ordre]}; TABL = {J:[ordre, ordre, ordre], M:[ordre, ordre, ordre]};
  try {
    var el = ecran === "reponse" ? EcrReponse(J, 2, ordre, ordre, 2, ev) : ecran === "b" ? EcrDeclareFlux(J, 2, ordre, 4) : EcrLecture(J, 2, true, 3);
    ReactDOM.unmountComponentAtNode(document.getElementById("root"));
    ReactDOM.render(Tablette(el, el), document.getElementById("root"));
  } finally { EV = sv.EV; ORD = sv.ORD; LU = sv.LU; TABL = sv.TABL; }
  var m = document.querySelector(".moitie"), c = m.querySelector(".eleve-card");
  return Math.round(m.getBoundingClientRect().bottom - c.getBoundingClientRect().bottom) - MARGE;
}
const ECRANS = ["reponse", "b", "lecture"];
// Les restes d'une question (énoncé de e caractères, n choix de l caractères chacun) sur les trois écrans
async function restes(page, e, n, l){
  const out = {};
  for(const ecran of ECRANS) out[ecran] = await page.evaluate(mesureDansLaPage, [ecran, texte(e), Array.from({length: n}, (_, i) => texte(l, i * 3)), MARGE]);
  return out;
}
const tient = r => ECRANS.every(ec => r[ec] >= 0);
// L'étalon : la scène t-annexe, la vraie question 3 de 3e sur l'écran de réponse
async function etalon(page, fichier){
  await page.goto("file://" + fichier + "#scene=t-annexe&cap=1");
  await page.waitForFunction(() => window.SCENE_PRETE === "t-annexe");
  return page.evaluate(() => { const m = document.querySelector(".moitie"), c = m.querySelector(".eleve-card"); return Math.round(m.getBoundingClientRect().bottom - c.getBoundingClientRect().bottom); });
}
module.exports = {MARGE, texte, restes, tient, etalon, ECRANS, mesureDansLaPage};
