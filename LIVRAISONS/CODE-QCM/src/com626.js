/* Tour 626 — le commentaire personnalisé de l'élève, sur le modèle de generateBilan de correction_dictee.html (Paul, 10/10 08:37).
   La dictée : une ouverture selon la note, les points à travailler (le domaine dominant), un conseil ciblé.
   Le QCM, même forme : une ouverture selon la maîtrise de la note (les 4 tranches, 339), les compétences à travailler,
   une phrase ciblée (le point d'autonomie, les questions faciles ratées, les questions difficiles réussies), l'estimation.
   Chaque phrase porte p:true quand elle est une proposition (elle n'existe ni dans la dictée ni dans la 7.7.1, mot pour mot). */
function commentaireQCM(r){
  var ph = [];
  // 1. L'ouverture : les phrases de la dictée, « dictée » devenu « évaluation » ; ses 5 paliers ramenés aux 4 niveaux de maîtrise
  var ouv = {
    vert:   {t:"Très belle évaluation, qui reflète une maîtrise solide."},
    bleu:   {t:"Bonne évaluation, avec quelques points isolés à surveiller."},
    orange: {t:"Évaluation fragile. Il faut consolider les bases avant la prochaine évaluation."},
    rouge:  {t:"Évaluation difficile. Reprends les notions essentielles point par point.", p:true}   // dictée : « les règles essentielles »
  };
  ph.push(ouv[r.niveau]);
  // 2. Les compétences : « Points à travailler : » (la dictée) pour une compétence en Maîtrise fragile ou insuffisante ; sinon « À consolider : »
  function liste(l){ l = l.map(function(x){ return "« " + x + " »"; }); return l.length < 2 ? l.join("") : l.slice(0, -1).join(", ") + " et " + l[l.length - 1]; }
  var faibles = r.comps.filter(function(c){ return c.niveau === "orange" || c.niveau === "rouge"; }).map(function(c){ return c.lib; });
  var moyennes = r.comps.filter(function(c){ return c.niveau === "bleu"; }).map(function(c){ return c.lib; });
  if(faibles.length) ph.push({t:"Points à travailler : " + liste(faibles) + "."});
  else if(moyennes.length) ph.push({t:"À consolider : " + liste(moyennes) + ".", p:true});
  // 3. Une phrase ciblée, la première qui s'applique
  if(r.autonomieRetiree) ph.push({t:"Les compétences « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel » ne sont pas atteintes pour cette évaluation.", p:true});
  else if(r.facilesRatees >= 2) ph.push({t:"Conseil : commence par revoir les questions que tu as ratées alors qu'elles étaient faciles ou réussies par la plupart de la classe.", p:true});
  else if(r.difficilesReussies >= 2) ph.push({t:"Bravo pour les questions difficiles que tu as réussies.", p:true});
  // 4. L'estimation : les phrases de la 7.7.1 ; « nettement » quand l'écart est de deux niveaux ou plus (615)
  if(r.estimation === "ok") ph.push({t:"Ton estimation correspond à ton vrai résultat : tu te connais bien !"});
  else if(r.estimation === "sur") ph.push(r.ecart >= 2 ? {t:"Tu as nettement surestimé ce que tu avais réussi.", p:true} : {t:"Tu as un peu surestimé ce que tu avais réussi."});
  else if(r.estimation === "sous") ph.push({t:"Tu as fait mieux que ce que tu croyais."});
  return ph;
}
if(typeof module !== "undefined") module.exports = {commentaireQCM: commentaireQCM};
