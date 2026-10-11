/* ═══════════════ Complément 3 — les évaluations : la liste par niveau, l'éditeur et la feuille d'une évaluation ═══════════════
   Une même évaluation a le même contenu partout (changement 5.6) : celles du hub, telles quelles (src/donnees/evaluations_hub.json),
   l'évaluation d'essai et la démo du scénario. La liste est rangée comme « Mes dictées » (changement 3) : la démo en tête, puis 6e, 5e,
   4e, 3e, toujours là, chacun repliable, puis « Sans chapitre ». L'éditeur s'ouvre sur l'évaluation cliquée (« &eval= ») et chaque
   geste y change l'évaluation (changement 7.1). */
var NIVEAUX_EV = ["6e", "5e", "4e", "3e"];
var CHAP_EDITEUR = [{id:"3e-ch1", niveau:"3e", libelle:"3e · Chapitre 1 — Poésie et peinture au XIXe siècle", comps:CHAPITRE_3E.majeures.concat(CHAPITRE_3E.mineures)}];
function evalCourante(){ var id = paramHash("eval") || SCN.ID_CH1; return id === "vide" ? {id:"vide", titre:"", mode:"strict", chap:null, niveau:null, competences:[], questions:[]} : SCN.evalParId(id); }
function chapDe(e){ return e.chap ? CHAP_EDITEUR.filter(function(c){ return e.chap.indexOf("Poésie et peinture") >= 0; })[0] : null; }
// ce qu'il reste à compléter avant de pouvoir la lancer
function manquesDe(e){
  var l = [];
  if(!e.chap) l.push("le chapitre");
  if(e.questions.some(function(q){ return q.reflexion == null || q.reponse == null; })) l.push("les deux temps de chaque question");
  if(e.questions.some(function(q){ return !(q.competences || []).length; })) l.push("les compétences");
  if(e.questions.some(function(q){ return !q.verifie; })) l.push("ce que chaque question vérifie");
  return l;
}
function listeFr(l){ return l.length > 1 ? l.slice(0, -1).join(", ") + " et " + l[l.length - 1] : l[0] || ""; }
function competencesDe(e){ var o = []; e.questions.forEach(function(q){ (q.competences || []).forEach(function(c){ if(o.indexOf(c) < 0) o.push(c); }); }); return o; }

/* ════════ 📝 Évaluations : la démo, puis les quatre niveaux, puis « Sans chapitre » ════════ */
function CarteEvaluations(){
  var k = MO();
  var s1 = useState("date"), tri = s1[0], setTri = s1[1];
  var s2 = useState({}), replies = s2[0], setReplies = s2[1];
  var s3 = useState([]), copies = s3[0], setCopies = s3[1];
  var liste = copies.concat(SCN.evals());
  function cleTri(e){ return tri === "titre" ? e.titre : tri === "chapitre" ? (e.chap || "~") : (e.cree || "").split("/").reverse().join(""); }
  function trie(l){ return l.slice().sort(function(a, b){ var x = cleTri(a), y = cleTri(b); return tri === "date" ? y.localeCompare(x) : x.localeCompare(y); }); }
  function ligne(e, cl){
    var manques = manquesDe(e), pret = !manques.length, passees = e.copie ? [] : SCN.passees(e.id, k), comps = competencesDe(e);
    return h("div", {key:e.id + (cl || ""), className:"eval-row", "data-eval":e.id},
      h("div", null,
        h("div", {className:"eval-titre"}, e.titre),
        h("div", {className:"eval-meta"},
          h("span", null, "📚 " + (e.chap || "chapitre : —")),
          h("span", null, e.mode === "partiel" ? "✨ Partiel" : "🎯 Tout ou rien"),
          h("span", null, e.questions.length + " questions"),
          comps.length > 0 && h("span", null, "🧩 " + comps.length + " compétence" + (comps.length > 1 ? "s" : "")),
          e.cree && h("span", null, "Créée le " + e.cree)),
        pret ? h("div", {className:"eval-etat ok"}, "✅ Prête à lancer")
             : h("div", {className:"eval-etat manque"}, "⚠️ À compléter avant de la lancer : " + listeFr(manques)),
        h("div", {className:"eval-passee"}, passees.length ? passees.map(function(x){ return "passée par " + x.classe + " le " + x.date; }).join(" · ") : "pas encore passée")),
      h("div", {className:"eval-actions"},
        h("button", {className:"btn btn-sm " + (pret ? "btn-ghost" : "btn-primary"), "data-va":"x627-3-editeur", title:pret ? "Ouvre l'éditeur sur « " + e.titre + " » : énoncés, choix, temps, compétences, ce que chaque question vérifie. Une évaluation déjà passée garde ses notes." : "Ouvre l'éditeur sur « " + e.titre + " », pour compléter ce qui manque avant de pouvoir la lancer : " + listeFr(manques) + "."}, pret ? "✏️ Modifier" : "✏️ Compléter"),
        h("button", {className:"btn btn-sm btn-ghost", "data-va":"c-feuille", title:"Montre la feuille des énoncés seuls de « " + e.titre + " », avec les points, à imprimer pour la classe."}, "🖨️ Imprimer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-local":"1", title:"Fait une copie de « " + e.titre + " », modifiable et supprimable, en tête de sa liste : elle garde tout ce qui est rempli.",
          onClick:function(){ setCopies([Object.assign({}, e, {id:"copie-" + e.id + "-" + copies.length, titre:e.titre + " (copie)", cree:MOM().date, copie:true})].concat(copies)); }}, "📋 Dupliquer"),
        h("button", {className:"btn btn-sm btn-rouge", "data-va":"c-eval-corbeille", title:"Met « " + e.titre + " » à la corbeille, après une confirmation : gardée un an, restaurable depuis 💾 Sauvegarde."}, "🗑️")));
  }
  var parNiveau = {}; NIVEAUX_EV.concat(["Sans chapitre"]).forEach(function(n){ parNiveau[n] = []; });
  liste.forEach(function(e){ parNiveau[e.chap ? (e.niveau || chapDe(e).niveau) : "Sans chapitre"].push(e); });
  function groupe(n){
    var l = trie(parNiveau[n]), rep = replies[n] === undefined ? !l.length : replies[n];
    var corps;
    if(tri === "classe"){
      // sous chaque classe qui l'a passée ; les autres, sous « Pas encore passée »
      var cl = {}; l.forEach(function(e){ var p = e.copie ? [] : SCN.passees(e.id, k); (p.length ? p.map(function(x){ return x.classe; }) : ["Pas encore passée"]).forEach(function(c){ (cl[c] = cl[c] || []).push(e); }); });
      corps = Object.keys(cl).sort(function(a, b){ return a === "Pas encore passée" ? 1 : b === "Pas encore passée" ? -1 : a.localeCompare(b); }).map(function(c){
        return h("div", {key:c, className:"classe-groupe", "data-classe":c}, h("div", {className:"classe-titre", "data-classe":c}, c === "Pas encore passée" ? c : "👥 " + c), cl[c].map(function(e){ return ligne(e, c); })); });
    } else corps = l.map(function(e){ return ligne(e); });
    return h("div", {key:n, className:"niv-groupe", "data-niveau-groupe":n},
      h("button", {className:"niv-titre", "data-niveau":n, "data-local":"1", "aria-expanded":!rep, title:rep ? "Déplier ce niveau" : "Replier ce niveau", onClick:function(){ var o = Object.assign({}, replies); o[n] = !rep; setReplies(o); }},
        (rep ? "▸ " : "▾ ") + n + " · " + (l.length ? l.length + " évaluation" + (l.length > 1 ? "s" : "") : "vide pour l'instant")),
      !rep && (l.length ? corps : h("div", {className:"niv-vide"}, "vide pour l'instant")));
  }
  var demo = SCN.DEMO, d = SCN.dureeEstimee(demo);
  return h("div", {className:"card"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem"}},
      h("h2", {style:{margin:0}}, "📝 Évaluations", InfoI("Tes évaluations, rangées par niveau (celui de leur chapitre), comme « Mes dictées », puis triées. La démo est en tête, pour tous les niveaux : elle est permanente.")),
      h("div", {className:"row"},
        h("label", {className:"tri-l"}, "Trier par ", h("select", {value:tri, "data-tri":"evals", title:"Trie chaque niveau par date de création, par titre, par chapitre, ou par classe : sous chaque classe qui l'a passée.", onChange:function(ev){ setTri(ev.target.value); }},
          h("option", {value:"date"}, "date"), h("option", {value:"titre"}, "titre"), h("option", {value:"chapitre"}, "chapitre"), h("option", {value:"classe"}, "classe"))),
        h("button", {className:"btn btn-or btn-sm", "data-va":"c-reglages-prompt", title:"Ouvre le prompt de création d'éval, à copier dans l'instance qui écrit le JSON."}, "🤖 Prompt IA"),
        h("button", {className:"btn btn-primary btn-sm", "data-va":"c-collage", title:"Colle le JSON d'une nouvelle évaluation : l'app le vérifie avant de l'enregistrer."}, "➕ Nouvelle évaluation"))),
    h("p", {style:{opacity:.8, margin:".4rem 0 0"}}, "Prépare ici tes évaluations : rédaction, relecture, impression. Le lancement en classe se fait dans « Pilotage classe »."),
    h("div", {className:"eval-row demo-eval", "data-eval":"demo"},
      h("div", null,
        h("div", {className:"eval-titre"}, demo.titre, h("span", {className:"perm-chip"}, "🔒 Permanente")),
        h("div", {className:"eval-meta"}, h("span", null, "📚 tous les niveaux"), h("span", null, "🎯 Tout ou rien"), h("span", null, demo.questions.length + " questions"), h("span", null, d.min + " minutes")),
        h("div", {className:"eval-etat ok"}, "✅ Prête à lancer")),
      h("div", {className:"eval-actions"},
        h("button", {className:"btn btn-sm btn-ghost", "data-va":"c-feuille", title:"Montre la feuille des énoncés de la démo, à imprimer."}, "🖨️ Imprimer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-local":"1", title:"Fait de la démo une évaluation ordinaire, modifiable et supprimable : la démo elle-même ne change jamais.", onClick:function(){ setCopies([Object.assign({}, demo, {id:"copie-demo-" + copies.length, titre:demo.titre + " (copie)", demo:false, cree:MOM().date, copie:true})].concat(copies)); }}, "📋 Dupliquer"))),
    NIVEAUX_EV.map(groupe),
    parNiveau["Sans chapitre"].length > 0 && groupe("Sans chapitre"));
}
function Evaluations(modale){ return Console("pilotage", "evals", h(F, null, h(CarteEvaluations), modale || null), false); }
function ScEvalCorbeille(){
  var e = evalCourante();
  return Fenetre(Evaluations(null), "🗑️ Mettre cette évaluation à la corbeille ?", e.titre + " · " + e.questions.length + " questions",
    h("p", null, "Elle part dans la corbeille du site, gardée un an, avec ses questions" + (SCN.passees(e.id, MO()).length ? " ; ses séances passées gardent leurs notes" : "") + "."),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-evals", title:"Ne met rien à la corbeille."}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-sauvegarde", title:"Met l'évaluation à la corbeille, restaurable un an depuis 💾 Sauvegarde → 🗑️ Corbeille."}, "🗑️ Mettre à la corbeille")], "c-evals");
}

/* ════════ L'éditeur : l'évaluation ouverte, et chaque geste la change ════════ */
function copieEval(e){ return JSON.parse(JSON.stringify(e)); }
function jsonDe(e){ return JSON.stringify({titre:e.titre, mode:e.mode || "strict", chapitre:e.chap ? chapDe(e).id : undefined, questions:e.questions.map(function(q){
  var o = {enonce:q.enonce, choix:q.choix, bonnes:q.bonnes, niveau:q.niveau};
  if(q.reflexion != null) o.reflexion = q.reflexion; if(q.reponse != null) o.reponse = q.reponse; if((q.competences || []).length) o.competences = q.competences;
  if(q.verifie) o.verifie = q.verifie; if(q.explication) o.explication = q.explication; if(q.assumee) o.longueurAssumee = true; return o; })}, null, 2); }
function QuestionEditee(p){
  var q = p.q, i = p.i, n = p.n, ch = p.chap, maj = p.maj;
  var s = useState(false), menu = s[0], setMenu = s[1];
  var multi = q.bonnes.length > 1, comps = q.competences || [];
  function temps(lbl, champ, unite){ var v = q[champ];
    return h("label", {className:"ed-temps" + (v == null ? " manque" : "")}, lbl, h("input", {type:"number", min:1, value:v == null ? "" : v, placeholder:"—", "data-q":i + 1, "data-temps":champ,
      title:"Le temps de " + (champ === "reflexion" ? "réflexion" : "réponse") + " de la question " + (i + 1) + ", en secondes" + (champ === "reponse" ? ", pour chaque tour" : "") + ".",
      onChange:function(e){ var x = parseInt(e.target.value, 10); maj(i, function(qq){ qq[champ] = x > 0 ? x : null; }); }}), unite); }
  return h("div", {className:"preview-q editable" + (q.bonus ? " ed-bonus-q" : ""), "data-question":i + 1},
    h("div", {className:"preview-q-header"},
      h("div", {className:"preview-q-titre-row"},
        h("button", {className:"ed-plier", "data-local":"1", "aria-expanded":!p.replie, title:p.replie ? "Déplie la question " + (i + 1) + "." : "Replie la question " + (i + 1) + ".", onClick:p.plier}, (p.replie ? "▸ " : "▾ ") + "Q" + (i + 1)),
        h("span", {className:"preview-q-num"}, multi && h("span", {className:"multi-tag"}, "RÉPONSES MULTIPLES"), q.bonus && h("span", {className:"multi-tag bonus-tag"}, "BONUS"), q.assumee && h("span", {className:"multi-tag assumee-tag"}, "📏 LONGUEUR ASSUMÉE")),
        p.replie && h("span", {className:"ed-resume"}, q.enonce),
        h("div", {className:"preview-q-actions"},
          h("button", {className:"btn-mini", "data-local":"1", disabled:i === 0, title:i === 0 ? "C'est la première question : elle ne monte pas plus haut." : "Monte la question " + (i + 1) + " d'un rang.", onClick:function(){ p.deplacer(i, -1); }}, "↑"),
          h("button", {className:"btn-mini", "data-local":"1", disabled:i === n - 1, title:i === n - 1 ? "C'est la dernière question : elle ne descend pas plus bas." : "Descend la question " + (i + 1) + " d'un rang.", onClick:function(){ p.deplacer(i, 1); }}, "↓"),
          h("button", {className:"btn-mini btn-mini-supp", "data-local":"1", title:"Retire la question " + (i + 1) + " de l'évaluation.", onClick:function(){ p.retirer(i); }}, "🗑"))),
      !p.replie && h("div", {className:"preview-q-niveau-row"},
        h("span", {className:"ed-lbl"}, "Difficulté :"),
        ["facile","standard","approfondi","expert"].map(function(nv){ return h("button", {key:nv, className:"niv-pastille niv-" + nv + (q.niveau === nv ? "" : " inactif"), "data-local":"1", "aria-pressed":q.niveau === nv, title:"Met la question " + (i + 1) + " en difficulté « " + NIV[nv].label + " ».", onClick:function(){ maj(i, function(qq){ qq.niveau = nv; }); }}, NIV[nv].label); }))),
    !p.replie && h(F, null,
      h("textarea", {className:"preview-q-enonce-input", value:q.enonce, placeholder:"Énoncé de la question (autonome : l'élève doit pouvoir répondre sans voir les choix)", title:"L'énoncé de la question " + (i + 1) + ", tel que l'élève le lit.", onChange:function(e){ var v = e.target.value; maj(i, function(qq){ qq.enonce = v; }); }}),
      h("div", {className:"ed-verif" + (q.verifie ? "" : " manque")},
        h("span", {className:"ed-lbl"}, "🎯 Ce qu'elle vérifie, pour le bilan de l'élève :", InfoI("Une courte phrase à l'infinitif, dans les mots de l'élève. Le bilan général s'en sert : « À revoir en priorité : … » quand l'élève rate la question, « Bravo, tu sais … » quand il réussit une question difficile. L'instance la remplit avec le prompt ; tu la corriges ici.")),
        h("input", {value:q.verifie || "", placeholder:"par exemple : trouver l'antécédent d'un pronom relatif", title:"Ce que vérifie la question " + (i + 1) + ", à l'infinitif.", onChange:function(e){ var v = e.target.value; maj(i, function(qq){ qq.verifie = v; }); }})),
      h("div", {className:"ed-ligne"},
        temps("🧠 Réflexion", "reflexion", "s"),
        temps("✋ Réponse", "reponse", "s par tour"),
        h("span", {className:"ed-comps"}, h("span", {className:"ed-lbl"}, "🧩 Compétences (1 ou 2) :"),
          comps.length ? comps.map(function(c){ return h("span", {key:c, className:"comp-chip"}, c, h("button", {className:"x", "data-local":"1", title:"Retire « " + c + " » de la question " + (i + 1) + ".", onClick:function(){ maj(i, function(qq){ qq.competences = comps.filter(function(x){ return x !== c; }); }); }}, "✕")); }) : h("span", {className:"comp-chip manque"}, "aucune"),
          h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:!ch || comps.length >= 2, "aria-expanded":menu,
            title:!ch ? "Choisis d'abord le chapitre : il donne les compétences permises." : comps.length >= 2 ? "La question a déjà deux compétences, le plus permis." : "Ouvre la liste des compétences du chapitre, pour en ajouter une à la question " + (i + 1) + ".", onClick:function(){ setMenu(!menu); }}, "+ ajouter ▾"),
          menu && ch && h("div", {className:"ed-menu-comps"}, ch.comps.filter(function(c){ return comps.indexOf(c) < 0; }).map(function(c){
            return h("button", {key:c, className:"ed-menu-l", "data-local":"1", title:"Ajoute « " + c + " » à la question " + (i + 1) + " : " + LIB_OFF[c] + ".", onClick:function(){ maj(i, function(qq){ qq.competences = comps.concat([c]); }); setMenu(false); }}, h("strong", null, c), " " + LIB_OFF[c]); })))),
      h("label", {className:"ed-bonus"}, h("button", {className:"ck" + (q.bonus ? " on" : ""), "data-local":"1", "aria-pressed":!!q.bonus, title:q.bonus ? "Décoche : la question " + (i + 1) + " compte de nouveau dans le total." : "Coche pour faire de la question " + (i + 1) + " une question bonus.", onClick:function(){ maj(i, function(qq){ qq.bonus = !qq.bonus; }); }}, q.bonus ? "✓" : ""), "Question bonus : elle compte dans les points gagnés, pas dans le total"),
      h("label", {className:"ed-bonus"}, h("button", {className:"ck" + (q.assumee ? " on" : ""), "data-local":"1", "aria-pressed":!!q.assumee, title:q.assumee ? "Décoche : la question " + (i + 1) + " doit tenir sur une demi-tablette." : "Coche si tu assumes que la question " + (i + 1) + " dépasse une demi-tablette : sa moitié défilera seule.", onClick:function(){ maj(i, function(qq){ qq.assumee = !qq.assumee; }); }}, q.assumee ? "✓" : ""), "📏 Longueur assumée : sa moitié défile seule, la page ne bouge pas"),
      h("div", {className:"preview-q-choix-edit"},
        q.choix.map(function(c, j){ var bon = q.bonnes.indexOf(j) >= 0;
          return h("div", {key:j, className:"preview-choix-edit" + (bon ? " bon" : "")},
            h("input", {type:"checkbox", className:"preview-choix-check", checked:bon, title:bon ? "Bonne réponse : un clic la décoche." : "Coche si c'est une bonne réponse.", onChange:function(){ maj(i, function(qq){ qq.bonnes = bon ? qq.bonnes.filter(function(x){ return x !== j; }) : qq.bonnes.concat([j]).sort(); }); }}),   // la case de la 7.7.1
            h("input", {className:"preview-choix-input", value:c, placeholder:"Texte du choix", title:"Le choix, tel que l'élève le lit.", onChange:function(e){ var v = e.target.value; maj(i, function(qq){ qq.choix[j] = v; }); }}),
            h("button", {className:"btn-mini btn-mini-supp", "data-local":"1", disabled:q.choix.length <= 2, title:q.choix.length <= 2 ? "Une question garde au moins 2 choix." : "Supprimer ce choix (minimum 2 choix par question).",
              onClick:function(){ maj(i, function(qq){ qq.choix.splice(j, 1); qq.bonnes = qq.bonnes.filter(function(x){ return x !== j; }).map(function(x){ return x > j ? x - 1 : x; }); }); }}, "✕")); }),
        h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", style:{marginTop:".4rem", alignSelf:"flex-start"}, title:"Ajoute un choix vide à la question " + (i + 1) + ".", onClick:function(){ maj(i, function(qq){ qq.choix.push(""); }); }}, "➕ Ajouter un choix")),
      h("div", {className:"preview-q-explication-zone"},
        h("label", {className:"preview-q-explication-label"}, "💡 Explication (affichée aux élèves lors de la correction)", InfoI("L'explication que l'élève lit après la révélation, sous la bonne réponse.")),
        h("textarea", {className:"preview-q-explication-input", value:q.explication || "", placeholder:"Explication de la bonne réponse (1-3 phrases)", title:"L'explication de la correction de la question " + (i + 1) + ".", onChange:function(e){ var v = e.target.value; maj(i, function(qq){ qq.explication = v; }); }}))));
}
function EditeurQCM(){
  var base = evalCourante();
  var s1 = useState(function(){ return copieEval(base); }), ev = s1[0], setEv = s1[1];
  var s2 = useState(0), modifs = s2[0], setModifs = s2[1];
  var s3 = useState(function(){ var o = {}; base.questions.forEach(function(q, i){ o[i] = i >= 2; }); return o; }), replis = s3[0], setReplis = s3[1];
  var s4 = useState(false), garde = s4[0], setGarde = s4[1];
  var s5 = useState(null), verif = s5[0], setVerif = s5[1];
  function changer(f){ var e = copieEval(ev); f(e); setEv(e); setModifs(modifs + 1); }
  function maj(i, f){ changer(function(e){ f(e.questions[i]); }); }
  var ch = chapDe(ev), manques = manquesDe(ev), bonus = ev.questions.filter(function(q){ return q.bonus; }).length, total = ev.questions.length - bonus;
  var comps = competencesDe(ev);
  useEffect(function(){
    function echap(e){ if(e.key === "Escape" && !window.SOMMAIRE_OUVERT){ e.stopImmediatePropagation(); if(modifs > 0) setGarde(true); else versScene("c-evals"); } }
    document.addEventListener("keydown", echap, true); return function(){ document.removeEventListener("keydown", echap, true); };
  });
  return h("div", {className:"modal", style:{maxWidth:"980px"}},
    h("button", {className:"modal-close", "data-local":"1", title:modifs ? "Ferme l'éditeur : une garde te demande d'abord si tu perds tes " + modifs + " modifications." : "Ferme l'éditeur et revient à la liste des évaluations.", onClick:function(){ if(modifs > 0) setGarde(true); else versScene("c-evals"); }}, "✕"),
    h("h2", null, manques.length ? "✏️ Compléter l'évaluation" : "✏️ Modifier l'évaluation"),
    h("div", {className:"field"}, h("label", null, "JSON de l'évaluation"),
      h("textarea", {className:"json", value:jsonDe(ev), readOnly:true, placeholder:JSON_INDICATION, title:"Le JSON de l'évaluation ouverte, tel que l'éditeur le tient. « 🔍 Vérifier le format » le relit.", style:{minHeight:"110px"}})),
    h("div", {className:"row"}, h("button", {className:"btn btn-ghost", "data-local":"1", title:"Relit le JSON de l'évaluation et dit ce qu'il reste à compléter.", onClick:function(){ setVerif(manques.length ? "🔍 Le format est bon ; il reste à compléter : " + listeFr(manques) + "." : "🔍 Le format est bon : rien ne manque."); }}, "🔍 Vérifier le format")),
    verif && h("div", {className:"fen-note"}, verif),
    h("div", {className:"preview"},
      h("div", {className:"preview-titre-row"},
        h("textarea", {className:"preview-titre-input", rows:2, value:ev.titre, placeholder:"Titre de l'évaluation", title:"Le titre de l'évaluation.", onChange:function(e){ var v = e.target.value; changer(function(x){ x.titre = v; }); }}),
        h("span", {className:"preview-titre-meta"}, ev.questions.length + " question" + (ev.questions.length > 1 ? "s" : "") + " · " + total + " point" + (total > 1 ? "s" : "") + (bonus ? " + " + bonus + " bonus" : ""))),
      h("div", {className:"ed-chap"}, h("span", {className:"ed-lbl"}, "📚 Chapitre", InfoI("Le chapitre donne le niveau et les compétences permises : une compétence hors du chapitre est refusée.")),
        h("select", {value:ch ? ch.id : "", title:"Le chapitre de l'évaluation : il donne son niveau et les compétences permises.", onChange:function(e){ var c = CHAP_EDITEUR.filter(function(x){ return x.id === e.target.value; })[0];
          changer(function(x){ x.chap = c ? c.libelle.replace("Chapitre", "Ch.") : null; x.niveau = c ? c.niveau : null; if(c) x.questions.forEach(function(q){ q.competences = (q.competences || []).filter(function(cc){ return c.comps.indexOf(cc) >= 0; }); }); }); }},
          h("option", {value:""}, "— à choisir —"), CHAP_EDITEUR.map(function(c){ return h("option", {key:c.id, value:c.id}, c.libelle); }))),
      h("div", {className:"preview-mode-row", style:{marginBottom:".8rem", padding:".7rem .9rem", background:"#FFF9E6", border:"2px solid #FFD23F", borderRadius:"10px"}},
        h("div", {style:{fontWeight:900, fontSize:".9rem", color:"#8B6914", marginBottom:".4rem"}}, "📊 Mode de scoring", InfoI("Tout ou rien : 1 point si la réponse est exacte. Partiel : une part du point par bonne case, autant de retiré par mauvaise, plancher 0.")),
        h("div", {style:{display:"flex", gap:".5rem", flexWrap:"wrap"}},
          ["strict", "partiel"].map(function(md){ var on = (ev.mode || "strict") === md;
            return h("button", {key:md, className:"mode-choix" + (on ? " on" : ""), "data-local":"1", "aria-pressed":on, title:on ? "Le mode de l'évaluation." : md === "partiel" ? "Passe l'évaluation en mode partiel." : "Passe l'évaluation en mode tout ou rien.", onClick:function(){ if(!on) changer(function(x){ x.mode = md; }); }},
              h("span", {className:"rond" + (on ? " on" : "")}), h("span", null, md === "strict" ? "🎯 Tout ou rien" : "✨ Partiel", h("div", {className:"sous"}, md === "strict" ? "1 point si la réponse est exacte ; sinon 0" : "Une part du point par bonne case ; autant de retiré par mauvaise (plancher 0)"))); }))),
      h("div", {className:"ed-comp-box"},
        h("div", {className:"tt"}, "🧩 Les compétences de cette évaluation — chacune porte sur au moins 3 questions", InfoI("Chaque compétence doit porter sur au moins 3 questions, pour que les quatre niveaux de maîtrise soient possibles.")),
        comps.length ? comps.map(function(c){ var qs = ev.questions.map(function(q, i){ return (q.competences || []).indexOf(c) >= 0 ? "Q" + (i + 1) : null; }).filter(Boolean);
          return h("div", {key:c, className:"ed-comp-l"}, h("span", {className:"c"}, c), h("span", {className:"t"}, ch && CHAPITRE_3E.majeures.indexOf(c) >= 0 ? "majeure" : "mineure"), h("span", null, LIB_OFF[c]), h("span", {className:"q"}, qs.join(", ")), h("span", {className:qs.length >= 3 ? "ok" : "manque"}, (qs.length >= 3 ? "✅ " : "⚠️ ") + qs.length + " question" + (qs.length > 1 ? "s" : ""))); })
          : h("div", {className:"ed-comp-autres"}, ch ? "Aucune compétence encore : « + ajouter ▾ » sur chaque question." : "Choisis d'abord le chapitre : il donne les compétences permises."),
        ch && h("div", {className:"ed-comp-autres"}, "Les autres compétences du chapitre, pas évaluées ici : " + ch.comps.filter(function(c){ return comps.indexOf(c) < 0; }).join(" · "))),
      modifs > 0 && h("div", {className:"ed-modif", "data-compteur-modifs":"1"}, "⚠ Modifications non enregistrées (" + modifs + ")"),
      ev.questions.map(function(q, i){ return h(QuestionEditee, {key:i + ":" + ev.questions.length, q:q, i:i, n:ev.questions.length, chap:ch, maj:maj, replie:!!replis[i],
        plier:function(){ var o = Object.assign({}, replis); o[i] = !replis[i]; setReplis(o); },
        deplacer:function(a, d){ changer(function(x){ var t = x.questions[a]; x.questions[a] = x.questions[a + d]; x.questions[a + d] = t; }); var o = Object.assign({}, replis), t2 = o[a]; o[a] = o[a + d]; o[a + d] = t2; setReplis(o); },
        retirer:function(a){ changer(function(x){ x.questions.splice(a, 1); }); var o = {}; Object.keys(replis).forEach(function(kk){ kk = +kk; if(kk < a) o[kk] = replis[kk]; else if(kk > a) o[kk - 1] = replis[kk]; }); setReplis(o); }}); }),
      h("button", {className:"btn btn-ghost", "data-local":"1", style:{marginTop:".6rem"}, title:"Ajoute une question vide à la fin de l'évaluation.", onClick:function(){ changer(function(x){ x.questions.push({enonce:"", choix:["", ""], bonnes:[], niveau:"standard", reflexion:null, reponse:null, competences:[]}); }); }}, "➕ Ajouter une question")),
    h("div", {className:"row", style:{marginTop:"1rem", alignItems:"center"}},
      h("button", {className:"btn btn-primary" + (manques.length ? " ferme" : ""), disabled:manques.length > 0, "data-va":manques.length ? null : "c-evals", title:manques.length ? "S'ouvre quand il ne reste rien à compléter : " + listeFr(manques) + "." : "Enregistre l'évaluation, telle qu'elle est."}, "💾 Enregistrer l'évaluation"),
      manques.length > 0 && h("span", {className:"ed-reste"}, "⚠️ Il reste à compléter : " + listeFr(manques) + ".")),
    garde && h("div", {className:"fen-fond alerte-native"},
      h("div", {className:"alerte-boite"}, h("div", {className:"alerte-texte"}, "Fermer l'éditeur sans enregistrer ? Tes " + modifs + " modifications seront perdues."),
        h("div", {className:"alerte-pied"},
          h("button", {className:"alerte-non", "data-local":"1", title:"Revient à l'éditeur, avec tes modifications.", onClick:function(){ setGarde(false); }}, "Continuer à modifier"),
          h("button", {className:"alerte-ok", "data-local":"1", title:"Ferme l'éditeur : les modifications sont perdues.", onClick:function(){ versScene("c-evals"); }}, "Fermer sans enregistrer")))));
}
function Editeur(){ return Evaluations(h("div", {className:"modal-back"}, h(EditeurQCM, {key:paramHash("eval") || "ch1"}))); }

/* ════════ La feuille imprimée : les énoncés seuls de l'évaluation, avec les points ════════ */
function Feuille(){
  var e = paramHash("eval") === "demo" ? SCN.DEMO : evalCourante();
  return h("div", {className:"feuille-fond", "data-echap":"c-evals"},
    h("button", {className:"btn-fermer-impression", "data-va":"c-evals", title:"Ferme l'aperçu et revient à la liste des évaluations."}, "✕ Fermer"),
    h("div", {className:"feuille-a4"},
      h("div", {className:"feuille-impression visible", style:{padding:0}},
        h("div", {className:"feuille-header"},
          h("h1", null, e.titre),
          h("div", {className:"ligne-info"},
            h("div", {className:"champ"}, h("strong", null, "Nom :"), h("div", {className:"blanc"})),
            h("div", {className:"champ"}, h("strong", null, "Classe :"), h("div", {className:"blanc"})),
            h("div", {className:"champ"}, h("strong", null, "Date :"), h("div", {className:"blanc"})))),
        e.questions.map(function(q, i){
          return h("div", {key:i, className:"feuille-q-seul"}, h("span", {className:"n"}, "Question " + (i+1)), h("span", {className:"pt"}, q.bonus || /^BONUS/.test(q.enonce) ? "bonus" : "1 pt"), h("div", {className:"e"}, q.enonce));
        }))),
    h("div", {className:"feuille-legende"}, "A4, à l'échelle : toute l'évaluation tient sur cette page."));
}
