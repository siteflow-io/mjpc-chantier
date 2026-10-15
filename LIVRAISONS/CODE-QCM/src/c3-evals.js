/* ═══════════════ Complément 3 — les évaluations : la liste par niveau, l'éditeur et la feuille d'une évaluation ═══════════════
   Une même évaluation a le même contenu partout (changement 5.6) : celles du hub, telles quelles (src/donnees/evaluations_hub.json),
   l'évaluation d'essai et la démo du scénario. La liste est rangée comme « Mes dictées » (changement 3) : la démo en tête, puis 6e, 5e,
   4e, 3e, toujours là, chacun repliable, puis « Sans chapitre ». L'éditeur s'ouvre sur l'évaluation cliquée (« &eval= ») et chaque
   geste y change l'évaluation (changement 7.1). */
var NIVEAUX_EV = ["6e", "5e", "4e", "3e"];
var CHAP_EDITEUR = [{id:"3e-ch1", niveau:"3e", libelle:"3e · Chapitre 1 — Poésie et peinture au XIXe siècle", comps:CHAPITRE_3E.majeures.concat(CHAPITRE_3E.mineures)}];
function evalCourante(){ var id = paramHash("eval") || SCN.ID_CH1;
  if(id === "vide") return {id:"vide", titre:"", mode:"strict", chap:null, niveau:null, competences:[], questions:[]};
  var e = id === "demo" ? SCN.DEMO : SCN.evalParId(id);
  return paramHash("copie") ? Object.assign({}, e, {titre:e.titre + " (copie)"}) : e; }
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
    var obj = "&eval=" + encodeURIComponent(e.copie ? e.de : e.id) + (e.copie ? "&copie=1" : "");   // (changement 4) l'évaluation cliquée
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
        h("button", {className:"btn btn-sm " + (pret ? "btn-ghost" : "btn-primary"), "data-va":"x627-3-editeur" + obj, title:pret ? "Ouvre l'éditeur sur « " + e.titre + " » : énoncés, choix, temps, compétences, ce que chaque question vérifie. Une évaluation déjà passée garde ses notes." : "Ouvre l'éditeur sur « " + e.titre + " », pour compléter ce qui manque avant de pouvoir la lancer : " + listeFr(manques) + "."}, pret ? "✏️ Modifier" : "✏️ Compléter"),
        h("button", {className:"btn btn-sm btn-ghost", "data-va":"c-feuille" + obj, title:"Montre la feuille des énoncés seuls de « " + e.titre + " », avec les points, à imprimer pour la classe."}, "🖨️ Imprimer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-local":"1", title:"Fait une copie de « " + e.titre + " », modifiable et supprimable, en tête de sa liste : elle garde tout ce qui est rempli.",
          onClick:function(){ setCopies([Object.assign({}, e, {id:"copie-" + e.id + "-" + copies.length, de:e.copie ? e.de : e.id, titre:e.titre + " (copie)", cree:MOM().date, copie:true})].concat(copies)); }}, "📋 Dupliquer"),
        h("button", {className:"btn btn-sm btn-rouge", "data-va":"c-eval-corbeille" + obj, title:"Met « " + e.titre + " » à la corbeille, après une confirmation : gardée un an, restaurable depuis 💾 Sauvegarde."}, "🗑️")));
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
        h("button", {className:"btn btn-sm btn-ghost", "data-va":"c-feuille&eval=demo", title:"Montre la feuille des énoncés de la démo, à imprimer."}, "🖨️ Imprimer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-local":"1", title:"Fait de la démo une évaluation ordinaire, modifiable et supprimable : la démo elle-même ne change jamais.", onClick:function(){ setCopies([Object.assign({}, demo, {id:"copie-demo-" + copies.length, de:"demo", titre:demo.titre + " (copie)", demo:false, cree:MOM().date, copie:true})].concat(copies)); }}, "📋 Dupliquer"))),
    NIVEAUX_EV.map(groupe),
    parNiveau["Sans chapitre"].length > 0 && groupe("Sans chapitre"));
}
function Evaluations(modale){ return Console("pilotage", "evals", h(F, null, h(CarteEvaluations), modale || null), false); }
function ScEvalCorbeille(){
  var e = evalCourante();
  return Fenetre(Evaluations(null), "🗑️ Mettre cette évaluation à la corbeille ?", e.titre + " · " + e.questions.length + " questions",
    h("p", null, "Elle part dans la corbeille du site, gardée un an, avec ses questions" + (SCN.passees(e.id, MO()).length ? " ; ses séances passées gardent leurs notes" : "") + "."),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-evals", title:"Ne met rien à la corbeille."}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-sauvegarde&jete=eval:" + e.id, title:"Met l'évaluation à la corbeille, restaurable un an depuis 💾 Sauvegarde → 🗑️ Corbeille."}, "🗑️ Mettre à la corbeille")], "c-evals");
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
        ["facile","standard","approfondi","expert"].map(function(nv){ if(q.niveau === nv) return h("span", {key:nv, className:"niv-pastille niv-" + nv, title:"La difficulté de la question " + (i + 1) + " : « " + NIV[nv].label + " »."}, NIV[nv].label);   // la difficulté choisie : un état, pas un geste
          return h("button", {key:nv, className:"niv-pastille niv-" + nv + (q.niveau === nv ? "" : " inactif"), "data-local":"1", "aria-pressed":q.niveau === nv, title:"Met la question " + (i + 1) + " en difficulté « " + NIV[nv].label + " ».", onClick:function(){ maj(i, function(qq){ qq.niveau = nv; }); }}, NIV[nv].label); }))),
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
    function echap(e){ if(e.key === "Escape" && !window.SOMMAIRE_OUVERT){ e.stopImmediatePropagation(); if(modifs > 0) setGarde(true); else fermerVers("c-evals"); } }
    document.addEventListener("keydown", echap, true); return function(){ document.removeEventListener("keydown", echap, true); };
  });
  return h("div", {className:"modal", style:{maxWidth:"980px"}},
    h("button", {className:"modal-close", "data-local":"1", title:modifs ? "Ferme l'éditeur : une garde te demande d'abord si tu perds tes " + modifs + " modifications." : "Ferme l'éditeur et revient à la liste des évaluations.", onClick:function(){ if(modifs > 0) setGarde(true); else fermerVers("c-evals"); }}, "✕"),
    h("h2", null, manques.length ? "✏️ Compléter l'évaluation" : "✏️ Modifier l'évaluation"),
    ev.titre && h("div", {className:"ed-titre-ouvert"}, "📝 " + ev.titre),
    h("div", {className:"field"}, h("label", null, "JSON de l'évaluation"),
      h(ChampJson, {ev:ev, placeholder:JSON_INDICATION, title:"Le JSON de l'évaluation ouverte, tel que l'éditeur le tient. « 🔍 Vérifier le format » le relit.", style:{minHeight:"110px"}})),
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
            return h(on ? "div" : "button", {key:md, className:"mode-choix" + (on ? " on" : ""), "data-local":"1", "aria-pressed":on, title:on ? "Le mode de l'évaluation." : md === "partiel" ? "Passe l'évaluation en mode partiel." : "Passe l'évaluation en mode tout ou rien.", onClick:function(){ if(!on) changer(function(x){ x.mode = md; }); }},
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
          h("button", {className:"alerte-ok", "data-local":"1", title:"Ferme l'éditeur : les modifications sont perdues.", onClick:function(){ fermerVers("c-evals"); }}, "Fermer sans enregistrer")))));
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
          return h("div", {key:i, className:"feuille-q-seul"}, h("span", {className:"n"}, "Question " + (i+1)), h("span", {className:"pt"}, q.bonus || /^BONUS/.test(q.enonce) ? "bonus" : "1 pt"), h("div", {className:"e"}, sansCoupe(q.enonce)));
        }))),
    h("div", {className:"feuille-legende"}, "A4, à l'échelle : toute l'évaluation tient sur cette page."));
}

// le champ « JSON de l'évaluation » : le JSON de l'évaluation ouverte ; il se tape (un collage, une retouche), et « 🔍 Vérifier le format » le relit
function ChampJson(p){
  var s = useState(null), texte = s[0], set = s[1];
  return h("textarea", {className:"json", value:texte == null ? jsonDe(p.ev) : texte, placeholder:p.placeholder, title:p.title, style:p.style, onChange:function(e){ set(e.target.value); }});
}

// (relecteur n°30) sur la feuille, une inversion (« entend-on », « se prononce-t-il ») ne se coupe pas à son trait d'union ; le texte ne change pas
function sansCoupe(t){
  var re = /[\p{L}']+(?:-t)?-(?:il|elle|on|ils|elles|je|tu|nous|vous|ce)(?![\p{L}])/gu, out = [], i = 0, m;
  while((m = re.exec(t))){ if(m.index > i) out.push(t.slice(i, m.index)); out.push(h("span", {key:m.index, style:{whiteSpace:"nowrap"}}, m[0])); i = m.index + m[0].length; }
  if(i < t.length) out.push(t.slice(i));
  return out.length > 1 ? out : t;
}

// fermer une fenêtre de mes écrans : revenir d'où elle a été ouverte sur place ; sinon à l'écran qu'elle nomme (la liste, les réglages)
function fermer3(defaut){ if(typeof NAV !== "undefined" && NAV.pile && NAV.pile.length) navFermer(); else versScene(defaut); }
/* ═══════════════ [QCM-3 · SOIR] Les évaluations de la base (qcm/evaluations) : la liste, le collage, l'éditeur, la feuille ═══════════════
   Une évaluation est complète quand elle a son chapitre, et chaque question ses deux temps, ses compétences et ce qu'elle vérifie :
   sinon « Lancer » reste fermé (COMMUN §3.1). Le collage vérifie tout ce que le prompt demande, avant d'enregistrer. */
function chapEv(e){ return e.chapitre ? chapitreVue(e.chapitre) : null; }
// « Sans chapitre pour l'instant » (Paul, 13/10 14:18) : le chapitre ne manque plus, l'éditeur propose les 28 compétences, et un message rappelle de la rattacher
function sansChapV(e){ return !!e && !e.chapitre && !!(e.sansChapitre || (e.brut && e.brut.sansChapitre)); }
var SANS_CHAP = "sans-chapitre";
function chapSansV(){ return {id:null, niveau:null, numero:null, titre:"", fiche:false, majeures:[], mineures:[], comps:toutesCompetences(), libelle:"Sans chapitre pour l'instant", court:"sans chapitre pour l'instant"}; }
function manquesV(e){
  var l = [];
  if(!chapEv(e) && !sansChapV(e)) l.push("le chapitre");
  if(!e.questions.length || e.questions.some(function(q){ return q.reflexion == null || q.reponse == null; })) l.push("les deux temps de chaque question");
  if(!e.questions.length || e.questions.some(function(q){ return !(q.competences || []).length; })) l.push("les compétences");
  if(!e.questions.length || e.questions.some(function(q){ return !q.verifie; })) l.push("ce que chaque question vérifie");
  return l;
}
function seancesDeLEval(id){ var X = v3Sessions(); return Object.keys(X).filter(function(s){ return X[s] && X[s].evalId === id; }); }
function passeesV(id){ return seancesV().filter(function(se){ return se.ev && se.ev.id === id && se.terminee && !se.demo && !se.test; }).sort(function(a, b){ return a.ms - b.ms; }).map(function(se){ return {classe:se.classe, date:se.date.slice(0, 5)}; }); }
function dureesV(){ var d = v3Reglages().durees; return d && typeof d === "object" ? Object.assign({}, SCN.DUREES, d) : SCN.DUREES; }
function dureeEstimeeV(ev, seul){
  var D = dureesV(), q = 0, tours = seul ? 1 : 2; ev.questions.forEach(function(x){ q += (x.reflexion || 0) + tours * (D.decompte + (x.reponse || 0) + D.b) + D.entre; });
  var c = ev.questions.length * D.correctionParQ, total = D.installation + q + D.estimAttest + c + (seul ? 0 : D.coevalBilan);
  return {questions:q, correction:c, total:total, min:Math.round(total / 60)};
}
// écrire une évaluation : une évaluation déjà passée garde, dans chacune de ses séances, l'énoncé qui a servi (ses notes ne bougent pas)
function enregistrerEval(id, e){
  var E = v3Evals(), ancienne = id ? E[id] : null, nid = id && id !== "vide" ? id : "eval_" + Date.now(), X = v3Sessions();
  var servi = ancienne ? seancesDeLEval(nid) : [], u = [];
  servi.forEach(function(s){ if(!X[s].evalSnapshot) u.push(v3Set(v3Q("sessions/" + s + "/evalSnapshot"), v3Sans(ancienne))); });
  var b = evalBrute(e, ancienne); if(ancienne && servi.length) b.version = (ancienne.version || 1) + 1;
  return Promise.all(u).then(function(){ return v3Set(v3Q("evaluations/" + nid), b); }).then(function(){ return nid; });
}
function dupliquerEval(e){ var b = evalBrute(Object.assign({}, e, {titre:e.titre + " (copie)"}), null); b.demo = null; return v3Set(v3Q("evaluations/eval_" + Date.now()), v3Sans(b)); }

/* ════════ 📝 Évaluations ════════ */
function CarteEvaluationsV(){
  useV3();
  useEffect(function(){ remettreDemo(); });
  var s1 = useState("date"), tri = s1[0], setTri = s1[1], s2 = useState({}), replies = s2[0], setReplies = s2[1];
  var liste = evalsV();
  function cleTri(e){ return tri === "titre" ? e.titre : tri === "chapitre" ? (e.chapitre ? niveauDuChapitre(e.chapitre) + ("0" + numeroDuChapitre(e.chapitre)).slice(-2) : "~") : ("000000000000000" + (e.createdAt || 0)).slice(-15); }
  function trie(l){ return l.slice().sort(function(a, b){ var x = cleTri(a), y = cleTri(b); return tri === "date" ? y.localeCompare(x) : x.localeCompare(y); }); }
  function ligne(e, cl){
    var manques = manquesV(e), pret = !manques.length, passees = passeesV(e.id), comps = competencesDe(e), obj = "&eval=" + encodeURIComponent(e.id);
    return h("div", {key:e.id + (cl || ""), className:"eval-row", "data-eval":e.id},
      h("div", null,
        h("div", {className:"eval-titre"}, e.titre),
        h("div", {className:"eval-meta"},
          h("span", null, "📚 " + (e.chap || (sansChapV(e) ? "sans chapitre pour l'instant" : "chapitre : —"))),
          h("span", null, e.mode === "partiel" ? "✨ Partiel" : "🎯 Tout ou rien"),
          h("span", null, e.questions.length + " questions"),
          comps.length > 0 && h("span", null, "🧩 " + comps.length + " compétence" + (comps.length > 1 ? "s" : "")),
          e.cree && h("span", null, "Créée le " + e.cree)),
        pret ? h("div", {className:"eval-etat ok"}, "✅ Prête à lancer")
             : h("div", {className:"eval-etat manque"}, "⚠️ À compléter avant de la lancer : " + listeFr(manques)),
        sansChapV(e) && h("div", {className:"eval-etat manque", "data-sans-chapitre":"1", title:"Elle se lance sans chapitre ; ouvre l'éditeur pour la rattacher à son chapitre."}, "⚠️ Sans chapitre pour l'instant : pense à la rattacher plus tard."),
        h("div", {className:"eval-passee"}, passees.length ? passees.map(function(x){ return "passée par " + x.classe + " le " + x.date; }).join(" · ") : "pas encore passée")),
      h("div", {className:"eval-actions"},
        h("button", {className:"btn btn-sm " + (pret ? "btn-ghost" : "btn-primary"), "data-va":"x627-3-editeur" + obj, title:pret ? "Ouvre l'éditeur sur « " + e.titre + " » : énoncés, choix, temps, compétences, ce que chaque question vérifie. Une évaluation déjà passée garde ses notes." : "Ouvre l'éditeur sur « " + e.titre + " », pour compléter ce qui manque avant de pouvoir la lancer : " + listeFr(manques) + "."}, pret ? "✏️ Modifier" : "✏️ Compléter"),
        h("button", {className:"btn btn-sm btn-ghost", "data-va":"c-feuille" + obj, title:"Montre la feuille des énoncés seuls de « " + e.titre + " », avec les points, à imprimer pour la classe."}, "🖨️ Imprimer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-local":"1", title:"Fait une copie de « " + e.titre + " », modifiable et supprimable, en tête de sa liste : elle garde tout ce qui est rempli.", onClick:function(){ dupliquerEval(e); }}, "📋 Dupliquer"),
        h("button", {className:"btn btn-sm btn-rouge", "data-va":"c-eval-corbeille" + obj, title:"Met « " + e.titre + " » à la corbeille, après une confirmation : gardée un an, restaurable depuis 💾 Sauvegarde."}, "🗑️")));
  }
  var parNiveau = {}; NIVEAUX_EV.concat(["Sans chapitre"]).forEach(function(n){ parNiveau[n] = []; });
  liste.forEach(function(e){ var n = e.chapitre && niveauDuChapitre(e.chapitre); (parNiveau[n && parNiveau[n] ? n : "Sans chapitre"]).push(e); });
  function groupe(n){
    var l = trie(parNiveau[n]), rep = replies[n] === undefined ? !l.length : replies[n], corps;
    if(tri === "classe"){
      var cl = {}; l.forEach(function(e){ var p = passeesV(e.id); (p.length ? p.map(function(x){ return x.classe; }) : ["Pas encore passée"]).forEach(function(c){ cl[c] = cl[c] || []; if(cl[c].indexOf(e) < 0) cl[c].push(e); }); });
      corps = Object.keys(cl).sort(function(a, b){ return a === "Pas encore passée" ? 1 : b === "Pas encore passée" ? -1 : a.localeCompare(b); }).map(function(c){
        return h("div", {key:c, className:"classe-groupe", "data-classe":c}, h("div", {className:"classe-titre", "data-classe":c}, c === "Pas encore passée" ? c : "👥 " + c), cl[c].map(function(e){ return ligne(e, c); })); });
    } else corps = l.map(function(e){ return ligne(e); });
    return h("div", {key:n, className:"niv-groupe", "data-niveau-groupe":n},
      h("button", {className:"niv-titre", "data-niveau":n, "data-local":"1", "aria-expanded":!rep, title:rep ? "Déplier ce niveau" : "Replier ce niveau", onClick:function(){ var o = Object.assign({}, replies); o[n] = !rep; setReplies(o); }},
        (rep ? "▸ " : "▾ ") + n + " · " + (l.length ? l.length + " évaluation" + (l.length > 1 ? "s" : "") : "vide pour l'instant")),
      !rep && (l.length ? corps : h("div", {className:"niv-vide"}, "vide pour l'instant")));
  }
  var demo = demoV(), d = dureeEstimeeV(demo);
  return h("div", {className:"card"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem"}},
      h("h2", {style:{margin:0}}, "📝 Évaluations", InfoI("Tes évaluations, rangées par niveau (celui de leur chapitre), comme « Mes dictées », puis triées. La démo est en tête, pour tous les niveaux : elle est permanente.")),
      h("div", {className:"row"},
        h("label", {className:"tri-l"}, "Trier par ", h("select", {value:tri, "data-tri":"evals", title:"Trie chaque niveau par date de création, par titre, par chapitre, ou par classe : sous chaque classe qui l'a passée.", onChange:function(ev){ setTri(ev.target.value); }},
          h("option", {value:"date"}, "date"), h("option", {value:"titre"}, "titre"), h("option", {value:"chapitre"}, "chapitre"), h("option", {value:"classe"}, "classe"))),
        h("button", {className:"btn btn-or btn-sm", "data-va":"c-reglages-prompt", title:"Ouvre le prompt de création d'éval, à copier dans l'instance qui écrit le JSON."}, "🤖 Prompt IA"),
        h("button", {className:"btn btn-primary btn-sm", "data-va":"c-collage", title:"Colle le JSON d'une nouvelle évaluation : l'app le vérifie avant de l'enregistrer."}, "➕ Nouvelle évaluation"))),
    h("p", {style:{opacity:.8, margin:".4rem 0 0"}}, "Prépare ici tes évaluations : rédaction, relecture, impression. Le lancement en classe se fait dans « Pilotage classe »."),
    (function(){ var n = liste.filter(sansChapV).length; return n > 0 && h("div", {className:"fen-note", "data-sans-chapitre-tete":"1", style:{marginTop:".5rem", background:"#FFF4E0", border:"2px solid #F5A623", borderRadius:"10px", padding:".6rem .9rem", fontWeight:700}, title:"Les évaluations « Sans chapitre pour l'instant » se lancent ; ce message reste tant qu'une n'est pas rattachée à son chapitre."},
      "⚠️ " + n + " évaluation" + (n > 1 ? "s" : "") + " sans chapitre pour l'instant : pense à les rattacher plus tard."); })(),
    h("div", {className:"eval-row demo-eval", "data-eval":"demo"},
      h("div", null,
        h("div", {className:"eval-titre"}, demo.titre, h("span", {className:"perm-chip"}, "🔒 Permanente")),
        h("div", {className:"eval-meta"}, h("span", null, "📚 tous les niveaux"), h("span", null, "🎯 Tout ou rien"), h("span", null, demo.questions.length + " questions"), h("span", null, d.min + " minutes")),
        h("div", {className:"eval-etat ok"}, "✅ Prête à lancer")),
      h("div", {className:"eval-actions"},
        // reprise 7, point 2 (Paul, 13/10 14:18) : un bouton permanent « 🚀 Lancer » sur la démo ; la classe se choisit au lancement, puis l'appel
        h("button", {className:"btn btn-sm btn-primary", "data-local":"1", "data-lancer-demo":"1", title:"Ouvre « 🎯 Lancer une nouvelle séance » avec la démo déjà choisie : tu y choisis la classe, puis vient l'appel.", onClick:function(){ if(typeof LANCEMENT !== "undefined"){ LANCEMENT.evalId = "demo"; LANCEMENT.mode = null; } versScene("c-lancer"); }}, "🚀 Lancer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-va":"c-feuille&eval=demo", title:"Montre la feuille des énoncés de la démo, à imprimer."}, "🖨️ Imprimer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-local":"1", title:"Fait de la démo une évaluation ordinaire, modifiable et supprimable : la démo elle-même ne change jamais.", onClick:function(){ dupliquerEval(demo); }}, "📋 Dupliquer"))),
    NIVEAUX_EV.map(groupe),
    parNiveau["Sans chapitre"].length > 0 && groupe("Sans chapitre"));
}
function EvaluationsV(modale){ return Console("pilotage", "evals", h(F, null, h(CarteEvaluationsV), modale || null), false); }
function ScEvalCorbeilleV(){ return h(ScEvalCorbeilleC); }
function ScEvalCorbeilleC(){
  useV3();
  var id = paramHash("eval"), e = evalV(id); if(!e || id === "demo") return EvaluationsV(null);
  var titre = e.titre + " (" + e.questions.length + " questions)";
  return Fenetre(EvaluationsV(null), "🗑️ Mettre cette évaluation à la corbeille ?", e.titre + " · " + e.questions.length + " questions",
    h("p", null, "Elle part dans la corbeille du site, gardée un an, avec ses questions" + (passeesV(e.id).length ? " ; ses séances passées gardent leurs notes" : "") + "."),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-evals", title:"Ne met rien à la corbeille."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-local":"1", title:"Met l'évaluation à la corbeille, restaurable un an depuis 💾 Sauvegarde → 🗑️ Corbeille.", onClick:function(){
       var X = v3Sessions(), u = seancesDeLEval(e.id).filter(function(s){ return !X[s].evalSnapshot; }).map(function(s){ return v3Set(v3Q("sessions/" + s + "/evalSnapshot"), v3Sans(e.brut)); });
       Promise.all(u).then(function(){ return mettreACorbeille("Évaluation", v3Q("evaluations/" + e.id), e.brut, titre); }).then(function(){ versScene("c-sauvegarde"); }); }}, "🗑️ Mettre à la corbeille")], "c-evals");
}

/* ════════ Le collage du JSON : tout ce que le prompt demande, vérifié avant d'enregistrer ════════ */
var NIVEAUX_Q = ["facile", "standard", "approfondi", "expert"];
// lire le JSON collé : les messages de lecture et de format sont ceux de la 7.7.1 (ModalCreerEval, qcmValiderEvaluation)
function lireJsonEval(texte){
  var brut = String(texte || "").trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim(), raw;
  if(!brut) return {erreurs:[], vide:true};
  try { raw = JSON.parse(brut); } catch(e){ return {erreurs:["Je ne peux pas lire cette réponse : elle est incomplète ou mal fermée (" + e.message + "). Demande à l'IA de redonner le résultat en entier, sans rien autour."]}; }
  if(!raw || typeof raw !== "object" || Array.isArray(raw)) return {erreurs:["La réponse doit être une évaluation complète (un titre et des questions)."]};
  return {raw:raw, erreurs:[]};
}
function verifierEval(raw){
  var err = [], qs = Array.isArray(raw.questions) ? raw.questions : [];
  if(!raw.titre || typeof raw.titre !== "string") err.push("Il manque le titre de l’évaluation.");
  if(!qs.length) err.push("Il manque les questions (une liste non vide).");
  var ch = chapitreVue(raw.chapitre);
  if(!raw.chapitre) err.push("Il manque le chapitre (« chapitre »), l'identifiant donné dans le prompt.");
  else if(!ch) err.push("Le chapitre « " + raw.chapitre + " » n'est pas un identifiant de chapitre : il s'écrit comme dans le prompt (« 4e-ch1 », par exemple).");
  var permises = ch ? ch.comps : toutesCompetences(), parComp = {}, assumees = [];
  qs.forEach(function(q, i){
    var ref = "Question " + (i + 1) + " : ";
    if(!q || typeof q !== "object"){ err.push(ref + "n’est pas lisible : il faut un énoncé, des choix et les bonnes réponses."); return; }
    if(!q.enonce || typeof q.enonce !== "string") err.push(ref + "n’a pas d’énoncé.");
    if(!Array.isArray(q.choix) || q.choix.length < 2) err.push(ref + "a moins de deux choix : il en faut au moins deux.");
    if(!Array.isArray(q.bonnes) || !q.bonnes.length) err.push(ref + "n’indique aucune bonne réponse.");
    else if(Array.isArray(q.choix)) q.bonnes.forEach(function(idx){ if(typeof idx !== "number" || idx < 0 || idx >= q.choix.length) err.push(ref + "désigne une bonne réponse qui n’existe pas (" + idx + ") : numérote à partir de 0, sans dépasser " + (q.choix.length - 1) + "."); });
    if(q.niveau && NIVEAUX_Q.indexOf(q.niveau) < 0) err.push(ref + "utilise un niveau inconnu (« " + q.niveau + " »). Niveaux possibles : " + NIVEAUX_Q.join(", ") + ".");
    if(!(+q.reflexion > 0)) err.push(ref + "il manque le temps de réflexion (« reflexion »).");
    if(!(+q.reponse > 0)) err.push(ref + "il manque le temps de réponse (« reponse »).");
    if(!q.verifie) err.push(ref + "il manque ce qu'elle vérifie (« verifie »), la courte phrase à l'infinitif du bilan de l'élève.");
    var tropPx = q.longueurAssumee || !q.enonce || !Array.isArray(q.choix) ? 0 : pxDeTrop(q, raw.titre);
    if(tropPx > 0) err.push(ref + tropPx + " px de trop sur une demi-tablette. Raccourcis l'énoncé ou les choix, sauf si je te dis que j'assume la longueur.");
    if(q.longueurAssumee) assumees.push(i + 1);
    var cs = Array.isArray(q.competences) ? q.competences : [];
    if(!cs.length) err.push(ref + "il manque ses compétences (« competences ») : une ou deux, prises dans celles du chapitre.");
    if(cs.length > 2) err.push(ref + cs.length + " compétences ; une question en a une ou deux.");
    cs.forEach(function(c){ if(permises.indexOf(c) < 0 || !competenceValide(c)) err.push(ref + "la compétence « " + c + " » n'est pas une compétence du chapitre (" + (ch ? ch.court : raw.chapitre || "—") + ")."); else (parComp[c] = parComp[c] || []).push(i + 1); });
  });
  Object.keys(parComp).forEach(function(c){ var l = parComp[c]; if(l.length < 3) err.push("La compétence « " + c + " » n'est évaluée que par " + l.length + " question" + (l.length > 1 ? "s" : "") + " (" + l.map(function(n){ return "Q" + n; }).join(", ") + ") : il en faut au moins 3."); });
  var ev = qs.length && qs.every(function(q){ return q && Array.isArray(q.choix); }) ? {questions:qs.map(function(q){ return {reflexion:+q.reflexion || 0, reponse:+q.reponse || 0}; })} : null;
  if(ev && qs.every(function(q){ return +q.reflexion > 0 && +q.reponse > 0; })){ var d = dureeEstimeeV(ev); if(d.min > 45) err.push("La séance durerait " + d.min + " min : " + (d.min - 45) + " min de plus que les 45 minutes utiles."); }
  return {erreurs:err, chap:ch, comps:Object.keys(parComp), assumees:assumees, n:qs.length, mode:raw.mode === "partiel" ? "partiel" : "strict"};
}
// l'évaluation collée, telle que l'éditeur et la base la tiennent
function evalDuJson(raw, id){ return evalVue(id || "vide", Object.assign({}, raw, {mode:raw.mode === "partiel" ? "partiel" : "strict", createdAt:raw.createdAt || 0})); }
function texteErreurs(err){ return "Corrige ton JSON : " + err.map(function(e, i){ return (i + 1) + ". " + e; }).join(" ") + " Renvoie le JSON complet."; }
function CopierErreursV(p){
  var s = useState(false), copie = s[0], setCopie = s[1], texte = texteErreurs(p.erreurs);
  useEffect(function(){ setCopie(false); }, [texte]);
  return h("div", {className:"copier-z"},
    h("button", {className:"btn btn-or", "data-local":"1", title:"Copie les messages, numérotés, prêts à coller dans l'instance de création d'éval : « Corrige ton JSON : 1. … Renvoie le JSON complet. »", onClick:function(){ try { navigator.clipboard.writeText(texte); } catch(e){} setCopie(true); }}, copie ? "✅ Copié" : "📋 Copier les erreurs pour l'instance de création d'éval"),
    copie && h("div", {className:"copie-ok"}, h("strong", null, "✅ Copié. "), "À coller dans l'instance de création d'éval : ", h("span", {className:"copie-t"}, texte)));
}
function CollageV(){ return EvaluationsV(h("div", {className:"modal-back"}, h(CollageVC))); }
function CollageVC(){
  useV3();
  var s1 = useState(""), texte = s1[0], setTexte = s1[1], s2 = useState(null), lu = s2[0], setLu = s2[1];
  var s3 = useState(false), garde = s3[0], setGarde = s3[1], s4 = useState(false), envoi = s4[0], setEnvoi = s4[1];
  function verifier(t){ var l = lireJsonEval(t); if(l.raw){ var v = verifierEval(l.raw); l.erreurs = v.erreurs; l.v = v; } setLu(l); }
  function fermer(){ if(texte.trim()) setGarde(true); else fermer3("c-evals"); }
  useEffect(function(){
    function f(e){ if(e.key === "Escape" && !window.SOMMAIRE_OUVERT && !garde){ e.stopImmediatePropagation(); fermer(); } }
    window.addEventListener("keydown", f, true); return function(){ window.removeEventListener("keydown", f, true); };
  });
  var ok = lu && lu.raw && !lu.erreurs.length, v = lu && lu.v;
  return h("div", {className:"modal"},
    h("button", {className:"modal-close", "data-local":"1", title:texte.trim() ? "Ferme la fenêtre : une garde te demande d'abord si tu perds le JSON collé." : "Ferme sans rien enregistrer.", onClick:fermer}, "✕"),
    garde && h("div", {className:"fen-fond alerte-native"}, h("div", {className:"alerte-boite"},
      h("div", {className:"alerte-texte"}, "Fermer sans enregistrer ? Le JSON collé sera perdu."),
      h("div", {className:"alerte-pied"},
        h("button", {className:"alerte-non", "data-local":"1", title:"Revient au JSON collé, tel qu'il est.", onClick:function(){ setGarde(false); }}, "Continuer à modifier"),
        h("button", {className:"alerte-ok", "data-local":"1", title:"Ferme la fenêtre : le JSON collé est perdu.", onClick:function(){ setGarde(false); fermer3("c-evals"); }}, "Fermer sans enregistrer")))),
    h("h2", null, "➕ Nouvelle évaluation"),
    h("div", {className:"field"},
      h("label", null, "Coller le JSON de l'évaluation", InfoI("Le JSON que l'instance de création d'éval t'a rendu. L'app le vérifie : le format, le chapitre et ses compétences, chaque question sur une demi-tablette, ce qu'elle vérifie, la durée de la séance.")),
      h("textarea", {className:"json", value:texte, placeholder:JSON_INDICATION, style:{minHeight:"260px"}, title:"Colle ici le JSON que l'instance de création d'éval t'a rendu.",
        onChange:function(e){ setTexte(e.target.value); verifier(e.target.value); }})),
    h("div", {className:"row"},
      h("button", {className:"btn btn-ghost", "data-local":"1", title:"Revérifie le JSON collé.", onClick:function(){ verifier(texte); }}, "🔍 Vérifier le format"),
      h("button", {className:"btn btn-ghost", "data-va":"x627-3-editeur&eval=vide", title:"Ouvre l'éditeur sur une évaluation vide, sans JSON."}, "✨ Démarrer à blanc")),
    lu && lu.erreurs.length > 0 && h("div", {className:"preview-error"},
      h("div", {style:{marginBottom:".35rem"}}, "❌ Rien n'est enregistré : " + lu.erreurs.length + " chose" + (lu.erreurs.length > 1 ? "s" : "") + " à corriger dans le JSON."),
      h("ol", {className:"msg-liste"}, lu.erreurs.map(function(e, i){ return h("li", {key:i}, e); }))),
    lu && lu.erreurs.length > 0 && h(CopierErreursV, {erreurs:lu.erreurs}),
    v && h("div", {className:"preview-ok"}, (lu.erreurs.length ? "✅ Le reste est bon : " : "✅ Tout est bon : ") + (v.chap ? "chapitre « " + v.chap.court + " », " : "") + (v.mode === "partiel" ? "mode partiel" : "mode tout ou rien") + ", " + v.n + " question" + (v.n > 1 ? "s" : "") + ", " + v.comps.length + " compétence" + (v.comps.length > 1 ? "s" : "") + " du chapitre" +
      (v.assumees.length ? " ; " + (v.assumees.length > 1 ? "les questions " + listeFr(v.assumees.map(String)) + " portent" : "la question " + v.assumees[0] + " porte") + " « longueur assumée » : " + (v.assumees.length > 1 ? "elles passent, et leur moitié défilera seule." : "elle passe, et sa moitié défilera seule.") : ".")),
    h("div", {className:"row", style:{marginTop:"1rem"}}, h("button", {className:"btn btn-primary" + (ok ? "" : " ferme"), disabled:!ok || envoi, "data-local":"1", title:ok ? "Enregistre l'évaluation : elle rejoint la liste, prête à lancer." : "S'ouvre quand le JSON n'a plus rien à corriger.",
      onClick:function(){ setEnvoi(true); enregistrerEval(null, evalDuJson(lu.raw)).then(function(){ setTexte(""); fermer3("c-evals"); }, function(){ setEnvoi(false); }); }}, "💾 Enregistrer l'évaluation")));
}

/* ── La garde de longueur (464) : la question mesurée sur une vraie demi-tablette (1280 × 800), sur les trois écrans qui montrent les choix,
      chacun à son état le plus chargé (mesures/mesure-page.js) ; le reste doit couvrir la marge du bas (16 px). Rend les px de trop.
      Si les écrans ne se mesurent pas ici, la garde se tait : le prompt donne déjà les limites de longueur à l'instance. ── */
var MESURE = {frame:null, cache:{}};
function cadreMesure(){
  if(MESURE.frame && document.body.contains(MESURE.frame)) return MESURE.frame;
  var f = document.createElement("iframe"); f.setAttribute("aria-hidden", "true"); f.tabIndex = -1; f.title = "mesure";
  f.style.cssText = "position:fixed;left:-20000px;top:0;width:1280px;height:800px;border:0;visibility:hidden;pointer-events:none";
  document.body.appendChild(f);
  var d = f.contentDocument; d.open(); d.write("<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'></head><body class='vue-tablette'><div id='root'></div></body></html>"); d.close();
  Array.prototype.forEach.call(document.querySelectorAll("style"), function(s){ d.head.appendChild(d.importNode(s, true)); });
  MESURE.frame = f; return f;
}
function resteMesure(q, ecran, titre){
  var f = cadreMesure(), d = f.contentDocument, root = d.getElementById("root"), n = q.choix.length, ordre = []; for(var i = 0; i < n; i++) ordre.push(i);
  var qq = {enonce:q.enonce, choix:q.choix.map(String), bonnes:[0], niveau:"approfondi", reflexion:30, reponse:20, competences:[], explication:""};
  var ev = {titre:titre || "3e- éval 1 Analyse logique - Construire une phrase complexe", mode:"strict", questions:[qq, qq, qq]}, sv = {EV:EV, ORD:ORD, LU:LU, TABL:TABL, sc:window.SCENE_COURANTE, calc:window.calc};
  // en direct, la note d'un élève se lit dans la séance : l'écran de lecture, dessiné hors séance pour la mesure, reçoit une note d'essai
  window.calc = function(){ return {st:["j", "j", "j"], pts:[1, 1, 1], n:3, total:3, complet:true, sur20:20, comp:{}, flags:[]}; };
  // la moitié telle qu'une tablette la montre, avec son en-tête (« 📊 Mes évaluations ») et le titre de l'évaluation : comme la scène étalon
  window.SCENE_COURANTE = "t-annexe"; EV = ev; ORD = [{J:ordre, M:ordre}, {J:ordre, M:ordre}, {J:ordre, M:ordre}]; LU = {J:[ordre, ordre, ordre], M:[ordre, ordre, ordre]}; TABL = {J:[ordre, ordre, ordre], M:[ordre, ordre, ordre]};
  try {
    var el = ecran === "reponse" ? EcrReponse(J, 2, ordre, ordre, 2, ev) : ecran === "b" ? EcrDeclareFlux(J, 2, ordre, 4) : EcrLecture(J, 2, true, 3);
    ReactDOM.unmountComponentAtNode(root); ReactDOM.render(Tablette(el, el), root);
  } finally { EV = sv.EV; ORD = sv.ORD; LU = sv.LU; TABL = sv.TABL; window.SCENE_COURANTE = sv.sc; window.calc = sv.calc; }
  var m = d.querySelector(".moitie"), c = m && m.querySelector(".eleve-card");
  if(!m || !c) throw new Error("mesure");
  var r = Math.round(m.getBoundingClientRect().bottom - c.getBoundingClientRect().bottom) - 16;
  ReactDOM.unmountComponentAtNode(root);
  return r;
}
function pxDeTrop(q, titre){
  var cle = JSON.stringify([q.enonce, q.choix, titre]);
  if(MESURE.cache[cle] != null) return MESURE.cache[cle];
  var trop = 0;
  // chaque écran mesuré à part : un écran qui ne se dessine pas hors séance n'annule pas la garde des autres
  var rs = ["reponse", "b", "lecture"].map(function(e){ try { return resteMesure(q, e, titre); } catch(x){ return null; } }).filter(function(x){ return x != null; });
  if(rs.length){ var r = Math.min.apply(null, rs); trop = r < 0 ? -r : 0; }
  return (MESURE.cache[cle] = trop);
}

/* ════════ L'éditeur : l'évaluation de la base (« &eval= »), chaque geste la change ; « 💾 Enregistrer » l'écrit dans qcm/evaluations ════════ */
function evalVide(){ return {id:"vide", titre:"", mode:"strict", chapitre:null, chap:null, niveau:null, competences:[], questions:[]}; }
function jsonDeV(e){ return JSON.stringify(v3Sans({titre:e.titre, chapitre:e.chapitre || undefined, mode:e.mode || "strict", questions:e.questions.map(function(q){
  var o = {enonce:q.enonce, choix:q.choix, bonnes:q.bonnes, niveau:q.niveau};
  if(q.reflexion != null) o.reflexion = q.reflexion; if(q.reponse != null) o.reponse = q.reponse; if((q.competences || []).length) o.competences = q.competences;
  if(q.verifie) o.verifie = q.verifie; if(q.explication) o.explication = q.explication; if(q.bonus) o.bonus = true; if(q.assumee) o.longueurAssumee = true; return o; })}), null, 2); }
function EditeurV(){ return EvaluationsV(h("div", {className:"modal-back"}, h(EditeurVA, {key:paramHash("eval") || "vide"}))); }
function EditeurVA(){
  useV3();
  var id = paramHash("eval") || "vide", base = id === "vide" ? evalVide() : evalV(id);
  if(!base) return h("div", {className:"modal", style:{maxWidth:"980px"}}, h("p", null, v3Pret(v3Q("evaluations")) ? "Cette évaluation n'existe plus : elle est peut-être à la corbeille." : "Chargement…"));
  return h(EditeurVC, {base:base});
}
function EditeurVC(p){
  var base = p.base;
  var s1 = useState(function(){ return copieEval(base); }), ev = s1[0], setEv = s1[1];
  var s2 = useState(0), modifs = s2[0], setModifs = s2[1];
  var s3 = useState(function(){ var o = {}; base.questions.forEach(function(q, i){ o[i] = i >= 2; }); return o; }), replis = s3[0], setReplis = s3[1];
  var s4 = useState(false), garde = s4[0], setGarde = s4[1], s5 = useState(null), verif = s5[0], setVerif = s5[1];
  var s6 = useState(null), json = s6[0], setJson = s6[1], s7 = useState(false), envoi = s7[0], setEnvoi = s7[1];
  function changer(f){ var e = copieEval(ev); f(e); setEv(e); setModifs(modifs + 1); setJson(null); }
  function maj(i, f){ changer(function(e){ f(e.questions[i]); }); }
  var ch = chapEv(ev) || (sansChapV(ev) ? chapSansV() : null), manques = manquesV(ev), bonus = ev.questions.filter(function(q){ return q.bonus; }).length, total = ev.questions.length - bonus;
  var comps = competencesDe(ev), chapitres = chapitresConnus(ev.chapitre);
  useEffect(function(){
    function echap(e){ if(e.key === "Escape" && !window.SOMMAIRE_OUVERT){ e.stopImmediatePropagation(); if(modifs > 0) setGarde(true); else fermer3("c-evals"); } }
    document.addEventListener("keydown", echap, true); return function(){ document.removeEventListener("keydown", echap, true); };
  });
  // « 🔍 Vérifier le format » : un JSON retouché dans le champ se recharge dans l'éditeur ; sinon, ce qu'il reste à compléter
  function verifier(){
    if(json != null){ var l = lireJsonEval(json); if(!l.raw){ setVerif("❌ " + l.erreurs.join(" ")); return; }
      var v = verifierEval(l.raw), e = evalDuJson(l.raw, ev.id); e.createdAt = ev.createdAt; setEv(e); setModifs(modifs + 1); setJson(null);
      setVerif(v.erreurs.length ? "🔍 Le JSON est rechargé ; il reste à corriger : " + v.erreurs.join(" ") : "🔍 Le JSON est rechargé : rien ne manque."); return; }
    setVerif(manques.length ? "🔍 Le format est bon ; il reste à compléter : " + listeFr(manques) + "." : "🔍 Le format est bon : rien ne manque.");
  }
  return h("div", {className:"modal", style:{maxWidth:"980px"}},
    h("button", {className:"modal-close", "data-local":"1", title:modifs ? "Ferme l'éditeur : une garde te demande d'abord si tu perds tes " + modifs + " modifications." : "Ferme l'éditeur et revient à la liste des évaluations.", onClick:function(){ if(modifs > 0) setGarde(true); else fermer3("c-evals"); }}, "✕"),
    h("h2", null, manques.length ? "✏️ Compléter l'évaluation" : "✏️ Modifier l'évaluation"),
    ev.titre && h("div", {className:"ed-titre-ouvert"}, "📝 " + ev.titre),
    h("div", {className:"field"}, h("label", null, "JSON de l'évaluation"),
      h("textarea", {className:"json", value:json == null ? jsonDeV(ev) : json, placeholder:JSON_INDICATION, title:"Le JSON de l'évaluation ouverte, tel que l'éditeur le tient. « 🔍 Vérifier le format » le relit.", style:{minHeight:"110px"}, onChange:function(e){ setJson(e.target.value); }})),
    h("div", {className:"row"}, h("button", {className:"btn btn-ghost", "data-local":"1", title:"Relit le JSON de l'évaluation et dit ce qu'il reste à compléter.", onClick:verifier}, "🔍 Vérifier le format")),
    verif && h("div", {className:"fen-note"}, verif),
    h("div", {className:"preview"},
      h("div", {className:"preview-titre-row"},
        h("textarea", {className:"preview-titre-input", rows:2, value:ev.titre, placeholder:"Titre de l'évaluation", title:"Le titre de l'évaluation.", onChange:function(e){ var v = e.target.value; changer(function(x){ x.titre = v; }); }}),
        h("span", {className:"preview-titre-meta"}, ev.questions.length + " question" + (ev.questions.length > 1 ? "s" : "") + " · " + total + " point" + (total > 1 ? "s" : "") + (bonus ? " + " + bonus + " bonus" : ""))),
      h("div", {className:"ed-chap"}, h("span", {className:"ed-lbl"}, "📚 Chapitre", InfoI("Le chapitre donne le niveau et les compétences permises : une compétence hors du chapitre est refusée.")),
        h("select", {value:ch ? (ch.id || SANS_CHAP) : "", title:"Le chapitre de l'évaluation : il donne son niveau et les compétences permises. « Sans chapitre pour l'instant » la laisse lancer, avec les 28 compétences ; un message te rappelle de la rattacher plus tard.", onChange:function(e){ var v = e.target.value, c = chapitreVue(v);
          changer(function(x){ x.chapitre = c ? c.id : null; x.chap = c ? c.court : null; x.niveau = c ? c.niveau : null; x.sansChapitre = v === SANS_CHAP; if(c) x.questions.forEach(function(q){ q.competences = (q.competences || []).filter(function(cc){ return c.comps.indexOf(cc) >= 0; }); }); }); }},
          h("option", {value:""}, "— à choisir —"), h("option", {value:SANS_CHAP}, "Sans chapitre pour l'instant"), chapitres.map(function(c){ return h("option", {key:c.id, value:c.id}, c.libelle); }))),
      h("div", {className:"preview-mode-row", style:{marginBottom:".8rem", padding:".7rem .9rem", background:"#FFF9E6", border:"2px solid #FFD23F", borderRadius:"10px"}},
        h("div", {style:{fontWeight:900, fontSize:".9rem", color:"#8B6914", marginBottom:".4rem"}}, "📊 Mode de scoring", InfoI("Tout ou rien : 1 point si la réponse est exacte. Partiel : une part du point par bonne case, autant de retiré par mauvaise, plancher 0.")),
        h("div", {style:{display:"flex", gap:".5rem", flexWrap:"wrap"}},
          ["strict", "partiel"].map(function(md){ var on = (ev.mode || "strict") === md;
            return h(on ? "div" : "button", {key:md, className:"mode-choix" + (on ? " on" : ""), "data-local":"1", "aria-pressed":on, title:on ? "Le mode de l'évaluation." : md === "partiel" ? "Passe l'évaluation en mode partiel." : "Passe l'évaluation en mode tout ou rien.", onClick:function(){ if(!on) changer(function(x){ x.mode = md; }); }},
              h("span", {className:"rond" + (on ? " on" : "")}), h("span", null, md === "strict" ? "🎯 Tout ou rien" : "✨ Partiel", h("div", {className:"sous"}, md === "strict" ? "1 point si la réponse est exacte ; sinon 0" : "Une part du point par bonne case ; autant de retiré par mauvaise (plancher 0)"))); }))),
      h("div", {className:"ed-comp-box"},
        h("div", {className:"tt"}, "🧩 Les compétences de cette évaluation — chacune porte sur au moins 3 questions", InfoI("Chaque compétence doit porter sur au moins 3 questions, pour que les quatre niveaux de maîtrise soient possibles.")),
        comps.length ? comps.map(function(c){ var qs = ev.questions.map(function(q, i){ return (q.competences || []).indexOf(c) >= 0 ? "Q" + (i + 1) : null; }).filter(Boolean);
          return h("div", {key:c, className:"ed-comp-l"}, h("span", {className:"c"}, c), h("span", {className:"t"}, ch && ch.majeures.indexOf(c) >= 0 ? "majeure" : "mineure"), h("span", null, libOff(c)), h("span", {className:"q"}, qs.join(", ")), h("span", {className:qs.length >= 3 ? "ok" : "manque"}, (qs.length >= 3 ? "✅ " : "⚠️ ") + qs.length + " question" + (qs.length > 1 ? "s" : ""))); })
          : h("div", {className:"ed-comp-autres"}, ch ? "Aucune compétence encore : « + ajouter ▾ » sur chaque question." : "Choisis d'abord le chapitre : il donne les compétences permises."),
        ch && h("div", {className:"ed-comp-autres"}, "Les autres compétences du chapitre, pas évaluées ici : " + ch.comps.filter(function(c){ return comps.indexOf(c) < 0; }).join(" · "))),
      modifs > 0 && h("div", {className:"ed-modif", "data-compteur-modifs":"1"}, "⚠ Modifications non enregistrées (" + modifs + ")"),
      ev.questions.map(function(q, i){ return h(QuestionEditee, {key:i + ":" + ev.questions.length, q:q, i:i, n:ev.questions.length, chap:ch, maj:maj, replie:!!replis[i],
        plier:function(){ var o = Object.assign({}, replis); o[i] = !replis[i]; setReplis(o); },
        deplacer:function(a, d){ changer(function(x){ var t = x.questions[a]; x.questions[a] = x.questions[a + d]; x.questions[a + d] = t; }); var o = Object.assign({}, replis), t2 = o[a]; o[a] = o[a + d]; o[a + d] = t2; setReplis(o); },
        retirer:function(a){ changer(function(x){ x.questions.splice(a, 1); }); var o = {}; Object.keys(replis).forEach(function(kk){ kk = +kk; if(kk < a) o[kk] = replis[kk]; else if(kk > a) o[kk - 1] = replis[kk]; }); setReplis(o); }}); }),
      h("button", {className:"btn btn-ghost", "data-local":"1", style:{marginTop:".6rem"}, title:"Ajoute une question vide à la fin de l'évaluation.", onClick:function(){ changer(function(x){ x.questions.push({enonce:"", choix:["", ""], bonnes:[], niveau:"standard", reflexion:null, reponse:null, competences:[]}); }); }}, "➕ Ajouter une question")),
    h("div", {className:"row", style:{marginTop:"1rem", alignItems:"center"}},
      h("button", {className:"btn btn-primary" + (manques.length ? " ferme" : ""), disabled:manques.length > 0 || envoi, "data-local":"1", title:manques.length ? "S'ouvre quand il ne reste rien à compléter : " + listeFr(manques) + "." : "Enregistre l'évaluation, telle qu'elle est.",
        onClick:function(){ setEnvoi(true); enregistrerEval(ev.id, ev).then(function(){ setModifs(0); fermer3("c-evals"); }, function(){ setEnvoi(false); }); }}, "💾 Enregistrer l'évaluation"),
      manques.length > 0 && h("span", {className:"ed-reste"}, "⚠️ Il reste à compléter : " + listeFr(manques) + ".")),
    garde && h("div", {className:"fen-fond alerte-native"},
      h("div", {className:"alerte-boite"}, h("div", {className:"alerte-texte"}, "Fermer l'éditeur sans enregistrer ? Tes " + modifs + " modifications seront perdues."),
        h("div", {className:"alerte-pied"},
          h("button", {className:"alerte-non", "data-local":"1", title:"Revient à l'éditeur, avec tes modifications.", onClick:function(){ setGarde(false); }}, "Continuer à modifier"),
          h("button", {className:"alerte-ok", "data-local":"1", title:"Ferme l'éditeur : les modifications sont perdues.", onClick:function(){ fermer3("c-evals"); }}, "Fermer sans enregistrer")))));
}
/* ════════ La feuille imprimée de l'évaluation cliquée ════════ */
function FeuilleV(){ return h(FeuilleVC); }
function FeuilleVC(){
  useV3();
  var id = paramHash("eval"), e = id === "demo" ? demoV() : evalV(id);
  if(!e) return h("div", {className:"feuille-fond", "data-echap":"c-evals"}, h("button", {className:"btn-fermer-impression", "data-va":"c-evals", title:"Ferme l'aperçu et revient à la liste des évaluations."}, "✕ Fermer"));
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
          return h("div", {key:i, className:"feuille-q-seul"}, h("span", {className:"n"}, "Question " + (i+1)), h("span", {className:"pt"}, q.bonus || /^BONUS/.test(q.enonce) ? "bonus" : "1 pt"), h("div", {className:"e"}, sansCoupe(q.enonce)));
        }))),
    h("div", {className:"feuille-legende"}, "A4, à l'échelle : toute l'évaluation tient sur cette page."));
}
// les écrans des évaluations, branchés comme ceux du soir (c4-seances.js)
var ECRANS_EVALS_V = {"c-evals":function(){ return EvaluationsV(null); }, "c-eval-corbeille":ScEvalCorbeilleV, "c-collage":CollageV, "x627-3-editeur":EditeurV, "c-feuille":FeuilleV};

/* ═══════════════ [QCM-3 · SOIR] Réglages : les durées, les niveaux, les textes des élèves, le prompt ; tout s'enregistre dans qcm/settings ═══════════════ */
var DUREES_LIGNES = [["installation", "Installation et consignes", 60, "min"], ["estimAttest", "Estimation et seconde attestation", 60, "min"], ["correctionParQ", "Correction, par question", 60, "min"],
  ["coevalBilan", "Co-évaluation et bilan", 60, "min"], ["decompte", "Passage de la tablette, avant chaque tour", 1, "s"], ["b", "« Ta feuille dit-elle la même chose que ton clic ? »", 1, "s"], ["entre", "Entre deux questions", 1, "s"]];
function DureesSeanceV(){ return h(DureesSeanceVC); }
function DureesSeanceVC(){
  useV3();
  var D = dureesV(), s = useState(null), brouillon = s[0], set = s[1], s2 = useState(false), fait = s2[0], setFait = s2[1];
  var v = brouillon || DUREES_LIGNES.reduce(function(o, l){ o[l[0]] = D[l[0]] / l[2]; return o; }, {});
  return h("div", {className:"reg-grille"}, DUREES_LIGNES.map(function(l){ return h("label", {key:l[0], className:"reg-l"}, h("span", null, l[1]),
      h("input", {type:"number", value:v[l[0]], min:0, title:"Tape la durée ; elle vaut pour toutes les séances à venir.", onChange:function(e){ var o = Object.assign({}, v); o[l[0]] = e.target.value; set(o); setFait(false); }}), h("span", null, l[3])); }),
    h("button", {className:"btn btn-primary btn-sm", "data-local":"1", disabled:fait && !brouillon, title:fait ? "✅ Enregistré" : "Enregistre les durées : elles valent pour le prompt, la garde au collage et au lancement, et la fin prévue.",
      onClick:function(){ var o = {}; DUREES_LIGNES.forEach(function(l){ var x = parseFloat(String(v[l[0]]).replace(",", ".")); o[l[0]] = Math.max(0, Math.round((isNaN(x) ? D[l[0]] / l[2] : x) * l[2])); });
        v3Set(v3Q("settings/durees"), o).then(function(){ set(null); setFait(true); }); }}, fait && !brouillon ? "✅ Enregistré" : "💾 Enregistrer"));
}
function NiveauxMaitriseV(){ return h(NiveauxMaitriseVC); }
function NiveauxMaitriseVC(){
  useV3();
  var R = v3Reglages().maitrise || null, base = R && R.niveaux ? R : {sur:20, niveaux:NIVEAUX_MAITRISE.map(function(n){ return {em:n[0], lib:n[1], de:+n[2], a:+n[3]}; })};
  var s = useState(null), b = s[0], set = s[1], s2 = useState(null), msg = s2[0], setMsg = s2[1], v = b || base;
  function maj(f){ var o = JSON.parse(JSON.stringify(v)); f(o); set(o); setMsg(null); }
  return h("div", null,
    h("label", {className:"reg-l"}, h("span", null, "Note sur :"), h("input", {type:"number", value:v.sur, title:"L'échelle de la note : la note est le nombre de points sur le nombre de questions, ramené sur cette échelle, au dixième.", onChange:function(e){ var x = e.target.value; maj(function(o){ o.sur = x; }); }})),
    v.niveaux.map(function(n, i){ return h("div", {key:i, className:"reg-niv"}, h("span", null, n.em + " "),
      h("input", {value:n.lib, title:"Le nom du niveau, tel qu'il s'affiche partout.", onChange:function(e){ var x = e.target.value; maj(function(o){ o.niveaux[i].lib = x; }); }}), h("span", null, " de "),
      h("input", {type:"number", value:n.de, title:"La borne basse du niveau, comprise.", onChange:function(e){ var x = e.target.value; maj(function(o){ o.niveaux[i].de = x; }); }}), h("span", null, i === 0 ? " à " : " à moins de "),
      h("input", {type:"number", value:n.a, title:"La borne haute : elle appartient au niveau du dessus.", onChange:function(e){ var x = e.target.value; maj(function(o){ o.niveaux[i].a = x; }); }})); }),
    msg && h("p", {className:msg.charAt(0) === "✅" ? "fen-note" : "fen-alerte"}, msg),
    h("button", {className:"btn btn-primary btn-sm", "data-local":"1", title:"Enregistre l'échelle et les tranches ; l'app refuse un réglage qui laisse un trou ou fait se chevaucher deux paliers.", onClick:function(){
      var l = v.niveaux.map(function(n){ return {em:n.em, lib:n.lib, de:+n.de, a:+n.a}; }).sort(function(x, y){ return x.de - y.de; }), sur = +v.sur, ok = l[0].de === 0 && l[l.length - 1].a === sur && l.every(function(n, i){ return n.de < n.a && (!i || l[i - 1].a === n.de); });
      if(!ok){ setMsg("Ce réglage laisse un trou ou fait se chevaucher deux paliers : il n'est pas enregistré."); return; }
      v3Set(v3Q("settings/maitrise"), {sur:sur, niveaux:l.slice().reverse()}).then(function(){ set(null); setMsg("✅ Enregistré"); }); }}, "💾 Enregistrer"));
}
// les messages des élèves : ceux de la 7.7.1 (qcm/textes, TEXTES_DEFAUT), un champ vide revient au texte d'origine
var TEXTES_CLES = ["attente_session", "attente_correction", "fin_session"];
// le message que lit l'élève : celui que Paul a écrit dans les Réglages (qcm/textes/<clé>), sinon celui de la maquette
function texteEleveV(cle){ var i = TEXTES_CLES.indexOf(cle), t = typeof v3 === "function" && v3db() ? v3(v3Q("textes/" + cle)) : null; return t || (i >= 0 && typeof TEXTES_ELEVE !== "undefined" ? TEXTES_ELEVE[i][1] : ""); }
function EditeurTextesV(){ return h(EditeurTextesVC); }
function EditeurTextesVC(){
  useV3();
  var T = v3(v3Q("textes")) || {};
  return h("div", {className:"card"},
    h("h2", null, "💬 Ce que lisent les élèves", InfoI("Les messages qui CONSTATENT un état ne sont pas modifiables : ils sont vrais dans tous les cas. Seuls les messages qui ANNONCENT quelque chose sont ici, parce qu'eux dépendent de ton organisation.")),
    h("p", {style:{opacity:.85}}, h("strong", null, "Éditeur des messages élève."), " Ces phrases s'affichent sur les tablettes de tes élèves. Modifie-les librement : un champ laissé vide revient au texte d'origine."),
    TEXTES_ELEVE.map(function(c, i){ var cle = TEXTES_CLES[i];
      return h("div", {key:i, style:{marginBottom:"1rem"}},
        h("label", {style:{display:"block", fontWeight:600, marginBottom:".25rem"}}, c[0]),
        h("textarea", {key:cle + ":" + (T[cle] || ""), rows:2, defaultValue:T[cle] || c[1], title:"Modifie le texte ; il s'enregistre quand tu quittes le champ.", style:{width:"100%", fontFamily:"inherit", fontSize:".9rem", padding:".5rem", borderRadius:"8px"},
          onBlur:function(e){ var x = e.target.value.trim(); v3Set(v3Q("textes/" + cle), x && x !== c[1] ? x : null); }}),
        h("p", {style:{fontSize:".78rem", opacity:.7, margin:".2rem 0 0"}}, c[2])); }));
}
function ReglagesV(){
  function carte(titre, aide, enfants){ return h("div", {className:"card"}, h("h2", null, titre, InfoI(aide)), enfants); }
  return Console("reglages", null, h(F, null,
    carte("👥 Classes et élèves", "Les classes sont communes à toutes les applications MJPC : elles se gèrent une seule fois, depuis la console MJPC. Les exclusions aussi (« 🚫 Jamais avec… », sur la fiche de la classe).",
      h(F, null, h("button", {className:"btn", "data-local":"1", onClick:function(){ window.open("index.html", "mjpc"); }, title:"Ouvre la console MJPC : les classes, les élèves, leurs codes, les aménagements et les exclusions."}, "Ouvrir la console MJPC →"))),
    carte("🤖 Le prompt de création d'éval", "Le texte à coller dans l'instance de création d'éval. À la copie, l'app y met ton chapitre, ses compétences avec leur libellé élève, les quatre difficultés et les limites de longueur mesurées sur une demi-tablette.",
      h(F, null, h("div", {className:"row"}, h("button", {className:"btn btn-or", "data-va":"c-reglages-prompt", title:"Ouvre le prompt de création d'éval, à copier dans l'instance qui écrit le JSON."}, "🤖 Prompt IA"), h("button", {className:"btn btn-ghost", "data-va":"c-reglages-prompt-modifier", title:"Ouvre le prompt enregistré, jetons compris, pour le modifier."}, "✏️ Modifier le prompt")))),
    carte("⏱️ Les durées de la séance", "Les mêmes pour le prompt et pour la garde de l'app : elles comptent la durée d'une évaluation au collage, au lancement et pendant la séance (la fin prévue). L'app note tes vraies durées pour les corriger.", DureesSeanceV()),
    carte("🎚️ Les niveaux de maîtrise et la note", "Les bornes portent sur la note, quelle que soit son échelle ; une compétence se met sur la même échelle, puis passe dans les mêmes tranches. L'app refuse un réglage qui laisse un trou ou fait se chevaucher deux paliers.", NiveauxMaitriseV()),
    EditeurTextesV(),
    carte("ℹ️ Version", "La version de l'app, et le socle qu'elle embarque.",
      h("p", {style:{opacity:.85}}, "Évaluations QCM — version de la livraison · socle MJPC-CORE"))), false);
}

/* ── Le prompt de création d'éval : le gabarit enregistré (qcm/settings/promptCreation, sinon celui du sas), rempli pour le chapitre choisi ── */
var PROMPT3 = {chapitre:null};
function gabaritPrompt(){ var g = v3Reglages().promptCreation; return typeof g === "string" && g.length ? g : PROMPT_TEXTE; }
function jetonDureesV(){ var D = dureesV();
  return "Pour chaque question : la réflexion, puis deux tours, chacun fait de " + D.decompte + " secondes de décompte, du temps de réponse et de " + D.b + " secondes où l'élève dit si sa feuille dit la même chose que son clic ; puis " + D.entre + " secondes avant la question suivante.\nPour la séance : " + D.installation / 60 + " minutes d'installation et de consignes, " + D.estimAttest / 60 + " minutes pour l'estimation et la seconde attestation, " + D.correctionParQ / 60 + " minute de correction par question, " + D.coevalBilan / 60 + " minutes pour la co-évaluation et le bilan."; }
function chapitrePrompt(){ var l = chapitresConnus(); var c = PROMPT3.chapitre && chapitreVue(PROMPT3.chapitre); return c || l[0] || chapitreVue("3e-ch1"); }
function promptRempliV(ch){
  ch = ch || chapitrePrompt();
  var comps = ch.fiche ? ch.majeures.map(function(c){ return [c, "majeure"]; }).concat(ch.mineures.map(function(c){ return [c, "mineure"]; })) : ch.comps.map(function(c){ return [c, null]; });
  var jetons = {
    CHAPITRE:ch.libelle + " (identifiant : " + ch.id + ")",
    COMPETENCES_CHAPITRE:comps.map(function(x){ return "- " + x[0] + (x[1] ? " (" + x[1] + ")" : "") + " : " + libOff(x[0]) + " — pour l'élève : " + libEleve(x[0]); }).join("\n"),
    NIVEAUX:["facile", "standard", "approfondi", "expert"].map(function(k){ return "- \"" + k + "\" (" + NIV[k].label + ")"; }).join("\n"),
    DUREES:jetonDureesV(), LIMITES:LIMITES_TEXTE};
  // un chapitre sans fiche n'a pas encore de compétences : le prompt donne les 28 et demande d'abord celles à retenir (MANDATS/EVAL-4E-PARIS/PROMPT-4E-CH1.txt)
  var g = ch.fiche ? gabaritPrompt() : gabaritPrompt().replace(/ :\n\{\{COMPETENCES_CHAPITRE\}\}/, " : ce chapitre n'en a pas encore dans mon application. Avant de proposer la moindre question, propose-moi celles à retenir dans cette liste (une majeure, quelques mineures), et attends mon accord :\n{{COMPETENCES_CHAPITRE}}");
  return g.replace(/\{\{([A-Z_]+)\}\}/g, function(t, k){ return jetons[k] != null ? jetons[k] : t; });
}
function PromptFenetreV(enfants){
  return h(F, null, ReglagesV(), h("div", {className:"modal-back", "data-echap":"c-reglages"},
    h("div", {className:"modal", style:{maxWidth:"900px"}},
      h("button", {className:"modal-close", "data-va":"c-reglages"}, "✕"),
      h("h2", null, "🤖 Le prompt de création d'éval", InfoI("Ce prompt guide l'instance de création d'éval, pour qu'elle t'aide à écrire l'évaluation puis te rende le JSON à coller dans « ➕ Nouvelle évaluation ». Tu peux le modifier (« ✏️ Modifier le prompt ») : tes modifications te suivent d'un appareil à l'autre, et l'app y remet ton chapitre à chaque copie.")),
      enfants)));
}
function ReglagesPromptV(){ return h(ReglagesPromptVC); }
function ReglagesPromptVC(){
  useV3();
  var s = useState(""), msg = s[0], setMsg = s[1], s2 = useState(0), set = s2[1], ch = chapitrePrompt(), texte = promptRempliV(ch);
  return PromptFenetreV(h(F, null,
    h("p", {style:{fontSize:".85rem", color:"#475569", margin:"0 0 .7rem"}}, "Chapitre choisi : ",
      h("select", {value:ch.id, title:"Le chapitre dont le prompt donne les compétences : celles de sa fiche au hub, sinon les 28 compétences.", onChange:function(e){ PROMPT3.chapitre = e.target.value; setMsg(""); set(function(x){ return x + 1; }); }},
        chapitresConnus(PROMPT3.chapitre).map(function(c){ return h("option", {key:c.id, value:c.id}, c.libelle); })), "."),
    h("div", {className:"row", style:{gap:".5rem", flexWrap:"wrap"}},
      h("button", {className:"btn btn-primary", "data-local":"1", onClick:function(){ try { navigator.clipboard.writeText(texte); } catch(e){} setMsg("✅ Prompt copié dans le presse-papiers"); }}, "📋 Copier le prompt"),
      h("button", {className:"btn btn-ghost", "data-va":"c-reglages-prompt-modifier"}, "✏️ Modifier le prompt")),
    h(MessagePrompt, {msg:msg}),
    h("div", {className:"codeblock prompt-rempli", "data-prompt":"rempli"}, texte)));
}
function ReglagesPromptModifierV(){ return h(ReglagesPromptModifierVC); }
function ReglagesPromptModifierVC(){
  useV3();
  var enr = gabaritPrompt();
  var s = useState(""), msg = s[0], setMsg = s[1], s2 = useState(null), b = s2[0], setB = s2[1], s3 = useState(false), confirme = s3[0], setConfirme = s3[1], s5 = useState(false), gardeOuverte = s5[0], setGarde = s5[1];
  var brouillon = b == null ? enr : b, modifie = brouillon !== enr;
  function fermer(){ if(modifie) setGarde(true); else fermer3("c-reglages"); }
  useEffect(function(){
    function f(e){ if(e.key === "Escape" && !confirme && !gardeOuverte){ e.stopImmediatePropagation(); fermer(); } }
    window.addEventListener("keydown", f, true); return function(){ window.removeEventListener("keydown", f, true); };
  });
  return h(F, null, ReglagesV(), h("div", {className:"modal-back"},
    h("div", {className:"modal", style:{maxWidth:"900px"}},
      h("button", {className:"modal-close", "data-local":"1", title:modifie ? "Ferme la fenêtre : une garde te demande d'abord si tu perds tes modifications." : "Ferme la fenêtre ; rien n'a changé.", onClick:fermer}, "✕"),
      h("h2", null, "🤖 Le prompt de création d'éval", InfoI("Ce prompt guide l'instance de création d'éval, pour qu'elle t'aide à écrire l'évaluation puis te rende le JSON à coller dans « ➕ Nouvelle évaluation ». Tu peux le modifier (« ✏️ Modifier le prompt ») : tes modifications te suivent d'un appareil à l'autre, et l'app y remet ton chapitre à chaque copie.")),
      h("textarea", {value:brouillon, onChange:function(e){ setB(e.target.value); setMsg(""); }, title:"Le prompt enregistré, jetons compris : modifie-le librement, rien n'est gardé avant « 💾 Enregistrer ».", style:{width:"100%", minHeight:"420px", fontFamily:"ui-monospace,monospace", fontSize:".8rem", padding:".7rem", border:"2px solid var(--violet)", borderRadius:"8px", boxSizing:"border-box"}}),
      h("div", {className:"row", style:{gap:".5rem", flexWrap:"wrap", marginTop:".7rem"}},
        h("button", {className:"btn btn-primary", "data-local":"1", onClick:function(){ v3Set(v3Q("settings/promptCreation"), brouillon === PROMPT_TEXTE ? null : brouillon).then(function(){ setB(null); setMsg("✅ Consignes enregistrées — elles te suivent d'un appareil à l'autre."); }); }}, "💾 Enregistrer"),
        h("button", {className:"btn btn-ghost", "data-va":"c-reglages-prompt"}, "↩️ Annuler"),
        h("button", {className:"btn btn-ghost", "data-local":"1", onClick:function(){ setConfirme(true); }}, "🔄 Restaurer le prompt par défaut")),
      h(MessagePrompt, {msg:msg}))),
    confirme && h(BoiteConfirmeNative, {texte:"Restaurer le prompt par défaut ? Tes modifications actuelles seront perdues (le prompt enregistré dans Firebase sera écrasé après ton clic sur « Enregistrer »).",
      oui:function(){ setB(PROMPT_TEXTE); setConfirme(false); }, non:function(){ setConfirme(false); }}),
    gardeOuverte && h("div", {className:"fen-fond alerte-native"}, h("div", {className:"alerte-boite"},
      h("div", {className:"alerte-texte"}, "Fermer sans enregistrer ? Tes modifications du prompt seront perdues."),
      h("div", {className:"alerte-pied"},
        h("button", {className:"alerte-non", "data-local":"1", title:"Revient au prompt, tel que tu l'as modifié.", onClick:function(){ setGarde(false); }}, "Continuer à modifier"),
        h("button", {className:"alerte-ok", "data-local":"1", title:"Ferme la fenêtre : tes modifications sont perdues.", onClick:function(){ setGarde(false); fermer3("c-reglages"); }}, "Fermer sans enregistrer")))));
}
ECRANS_EVALS_V["c-reglages"] = ReglagesV; ECRANS_EVALS_V["c-reglages-prompt"] = ReglagesPromptV; ECRANS_EVALS_V["c-reglages-prompt-modifier"] = ReglagesPromptModifierV;
