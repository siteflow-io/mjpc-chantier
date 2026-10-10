/* Tour 627 — le bilan général de l'élève, sur le modèle de generateBilan (correction_dictee.html), personnalisé par les questions
   précises (Paul, 10/10 08:46 : jamais l'intitulé d'une compétence). Chaque question porte « ce qu'elle vérifie », une courte phrase
   à l'infinitif, dans les mots de l'élève (« trouver l'antécédent d'un pronom relatif »), qui se lit après « À revoir en priorité : »
   comme après « Bravo, tu sais ».
   Rend une liste de morceaux {t, p} ; p:true = proposition (ni dans la dictée ni dans la 7.7.1, mot pour mot, ou phrase d'exemple). */
function commentaireQCM(r){
  var out = [];
  function phrase(morceaux){ if(out.length) out.push({t:" "}); morceaux.forEach(function(m){ out.push(m); }); }
  function liste(l){ var m = []; l.forEach(function(x, i){ if(i) m.push({t: i === l.length - 1 ? " et " : ", "}); m.push({t:x, p:true}); }); return m; }
  // 1. L'ouverture : les phrases de la dictée, « dictée » devenu « évaluation » ; ses 5 paliers ramenés aux 4 niveaux de maîtrise (339)
  var ouv = {
    vert:   {t:"Très belle évaluation, qui reflète une maîtrise solide."},
    bleu:   {t:"Bonne évaluation, avec quelques points isolés à surveiller."},
    orange: {t:"Évaluation fragile. Il faut consolider les bases avant la prochaine évaluation."},
    rouge:  {t:"Évaluation difficile. Reprends les notions essentielles point par point.", p:true}   // la dictée dit « les règles »
  };
  phrase([ouv[r.niveau]]);
  // 2. À revoir en priorité (le titre du bloc de la 7.7.1) : les questions ratées, d'abord celles qui étaient faciles
  //    ou réussies par la plupart de la classe, puis les plus réussies par la classe ; trois au plus
  var ratees = r.questions.filter(function(q){ return q.pts === 0; }).sort(function(a, b){
    var pa = (a.niveau === "facile" || a.taux >= 50) ? 1 : 0, pb = (b.niveau === "facile" || b.taux >= 50) ? 1 : 0;
    return (pb - pa) || (b.taux - a.taux) || (a.n - b.n); }).slice(0, 3);
  if(ratees.length) phrase([{t:"À revoir en priorité : "}].concat(liste(ratees.map(function(q){ return q.verifie; })), [{t:"."}]));
  // 3. Bravo : les questions difficiles réussies (approfondi, expert), les plus rares d'abord ; deux au plus
  var difficiles = r.questions.filter(function(q){ return q.pts === 1 && (q.niveau === "approfondi" || q.niveau === "expert"); })
    .sort(function(a, b){ return (a.taux - b.taux) || (a.n - b.n); }).slice(0, 2);
  if(difficiles.length) phrase([{t:"Bravo, tu sais ", p:true}].concat(liste(difficiles.map(function(q){ return q.verifie; })), [{t:"."}]));
  // 4. Le point d'autonomie retiré : les deux compétences de Paul (451), nommées
  if(r.autonomieRetiree) phrase([{t:"Les compétences « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel » ne sont pas atteintes pour cette évaluation.", p:true}]);
  // 5. L'estimation : les phrases de la 7.7.1 ; « nettement » quand l'écart est de deux niveaux ou plus (615)
  if(r.estimation === "ok") phrase([{t:"Ton estimation correspond à ton vrai résultat : tu te connais bien !"}]);
  else if(r.estimation === "sur") phrase([r.ecart >= 2 ? {t:"Tu as nettement surestimé ce que tu avais réussi.", p:true} : {t:"Tu as un peu surestimé ce que tu avais réussi."}]);
  else if(r.estimation === "sous") phrase([{t:"Tu as fait mieux que ce que tu croyais."}]);
  return out;
}
if(typeof module !== "undefined") module.exports = {commentaireQCM: commentaireQCM};
