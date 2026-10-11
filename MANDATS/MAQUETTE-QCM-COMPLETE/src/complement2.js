/* ═══════════════ Complément 2 : les boutons fermés, le panneau bord à bord, la rangée de l'emploi du temps ═══════════════ */

/* ── Un bouton fermé de Paul se voit fermé, et sa raison se lit au survol (défaut 7, garde 6) ──
   Un bouton fermé ne reçoit pas la souris dans tous les navigateurs : dans les vues de Paul (la console, MJPC, le téléphone),
   chaque bouton fermé est posé dans une enveloppe qui porte sa raison, et c'est l'enveloppe qui reçoit la souris
   (le bouton fermé ne la prend pas : src/complement2.css). Une moitié d'élève montrée dans la console garde ses règles :
   le clic figé de B et les cases de l'élève ne sont pas enveloppés. */
var hBase = h;
var CLASSES_ELEVE = /(^|\s)(eleve-|decl-|autoeval)/;
function vueDeLaScene(){ var id = window.SCENE_COURANTE, sc = SCENES.filter(function(s){ return s.id === id; })[0]; return sc ? sc.vue : null; }
h = function(type, props){
  if(type === "button" && props && (props.disabled === true || props["aria-disabled"] === "true") && !CLASSES_ELEVE.test(props.className || "")
     && ["console", "telephone"].indexOf(vueDeLaScene()) >= 0){
    var args = Array.prototype.slice.call(arguments), p = Object.assign({}, props), cle = p.key;
    delete p.key; args[1] = p;
    return hBase("span", {key: cle, className: "ferme-env", title: props.title || null}, hBase.apply(null, args));
  }
  return hBase.apply(null, arguments);
};

/* ── « 📅 Emploi du temps » (edtSectionPanneau l. 19760, edtPeindrePanneau l. 19794 à 19850), avec les objets de l'année
   relus au hub (MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT/, vérifiés contre leurs md5 à l'assemblage). La rangée
   d'aujourd'hui devient trois groupes, l'un sous l'autre (n°12 · 212, 714) ; rien d'autre ne change dans la section. ── */
var EDT_OBJETS_INDEX = ["calendrier", "grille", "creneaux", "periodes", "decisions", "photos", "reglages"];   // l. 18482
// les noms en clair, pris dans index.html (l. 19803, 19804, 19805, 19411, 20680, 19754, 21908)
var EDT_NOMS = {calendrier: "Calendrier de l’année", grille: "Grille de l’emploi du temps", creneaux: "Créneaux horaires", periodes: "Découpage en périodes",
  photos: "Photos du prévu", reglages: "Réglages de l’emploi du temps", decisions: "Décisions horaires"};
var EDT_VOIES_INDEX = {calendrier: {titre: "Calendrier de l’année", objet: "calendrier"}, grille: {titre: "Grille de l’emploi du temps", objet: "grille"}, creneaux: {titre: "Créneaux horaires", objet: "creneaux"}};   // l. 19288
var EDT_JOUR = TAXO_JOUR;   // le jour de la maquette
var EDT_JOURS_SEM = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"], EDT_MOIS_AN = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function edtJourEnClairM(iso){ var p = String(iso).split("-"), d = new Date(iso + "T12:00:00"); return EDT_JOURS_SEM[(d.getDay() + 6) % 7] + " " + Number(p[2]) + " " + EDT_MOIS_AN[Number(p[1]) - 1]; }   // l. 21823
function edtPresents(){ return EDT_OBJETS_INDEX.filter(function(o){ return !!EDT_DONNEES[o]; }); }
// les trois lignes d'état, comptées comme edtPeindrePanneau (l. 19802 à 19806), edtVersions (l. 18502) et edtNomsDeGrille (l. 19663)
function edtEtatsM(){
  var cal = EDT_DONNEES.calendrier, gr = EDT_DONNEES.grille, cr = EDT_DONNEES.creneaux;
  var versions = gr.versions && gr.versions.length ? gr.versions : [{creneaux: gr.creneaux}];
  var cases = [].concat.apply([], versions.map(function(v){ return v.creneaux || []; })), noms = [];
  cases.forEach(function(c){ if(c && c.mjpc !== false && c.classe && noms.indexOf(c.classe) < 0) noms.push(c.classe); });
  var at = cr.creneaux.slice().sort(function(a, b){ return (a.rang || 0) - (b.rang || 0); }).map(function(c){ return c.debut + "-" + c.fin; });
  return [["Calendrier de l’année", cal.semaines.length + " semaines · " + cal.vacances.length + " périodes sans cours · " + cal.feries.length + " fériés · " + cal.jalons.length + " jalons · " + cal.evenementsClasse.length + " événements de classe"],
    ["Grille de l’emploi du temps", cases.length + " cases · " + noms.length + " classes nommées"],
    ["Créneaux horaires", cr.creneaux.length + " créneaux — " + at.join(" · ")]];
}
// « ⤓ Sortir les JSON cochés » : un objet, le geste d'aujourd'hui (edtSortirJson, l. 20792) ; plusieurs, chacun sous son identifiant
function edtSortiM(ids){
  var t;
  if(ids.length === 1) t = JSON.stringify(EDT_DONNEES[ids[0]], null, 1);
  else { var o = {}; ids.forEach(function(k){ o[k] = EDT_DONNEES[k]; }); t = JSON.stringify(o, null, 1); }
  var noms = ids.map(function(k){ return "« " + k + " »"; });
  return "JSON de " + (noms.length > 1 ? noms.slice(0, -1).join(", ") + " et " + noms[noms.length - 1] : noms[0]) + " copié — " + t.length + " caractères.";
}
// « 📋 Copier le prompt » : la consigne et le JSON en service, en un seul bloc (edtPromptComplet l. 20752, edtCopierPrompt l. 20765)
function edtPromptCompletM(voie){
  var v = EDT_VOIES_INDEX[voie], o = EDT_DONNEES[v.objet];
  var corps = o ? JSON.stringify(o, null, 1) : ("aucun " + v.objet + " en service — c’est une première injection");
  return EDT_PROMPTS_INDEX[voie] + "\n\n─── CE QUI EST EN SERVICE AUJOURD’HUI ───\n" + "Voici l’objet « " + v.objet + " » tel qu’il est enregistré. Reconduis les identifiants "
    + "de tout ce que tu reconnais ; n’en invente aucun.\n\n" + corps + "\n";
}
function edtJoursDepuisM(iso){ return Math.floor((new Date(EDT_JOUR + "T00:00:00") - new Date(iso + "T00:00:00")) / 86400000); }   // edtJoursDepuis, l. 19777
// atInfo (l. 14062) : le message dans la modale de l'atelier, avec « Compris »
function AtInfo(p){
  return h("div", {className: "at-modale", id: "at-modale"},
    h("div", {className: "at-modale-c"}, h("div", {className: "at-modale-m"}, p.msg),
      h("div", {className: "at-modale-b"}, h("button", {className: "at-btn at-btn-prim", "data-local": "1", title: "Ferme le message.", onClick: p.fermer}, "Compris"))));
}
function EmploiDuTemps(p){
  var presents = edtPresents();
  var s1 = useState(p.coches || []), coches = s1[0], setCoches = s1[1];
  var s2 = useState(p.message || null), msg = s2[0], setMsg = s2[1];
  var s3 = useState(!(EDT_DONNEES.reglages && EDT_DONNEES.reglages.arriverSurEdt === false)), arrive = s3[0], setArrive = s3[1];
  var s4 = useState(false), plusTard = s4[0], setPlusTard = s4[1];
  var tous = coches.length === presents.length;
  var cocher = function(o){ setCoches(coches.indexOf(o) >= 0 ? coches.filter(function(x){ return x !== o; }) : presents.filter(function(x){ return x === o || coches.indexOf(x) >= 0; })); };
  var jours = edtJoursDepuisM(EDT_DONNEES.calendrier.injecteLe);   // edtAlerteInjection (l. 19783) : un mois et plus
  return h(F, null,
    h("h2", null, "📅 Emploi du temps"),
    h("div", {id: "edt-panneau", className: "edt-panneau"},
      h("p", {className: "edt-p"}, "Année ", h("b", null, EDT_DONNEES.calendrier.annee), ". Les objets vivent au hub sous ", h("code", null, "/site/edt/"), ". Rien n’est obligatoire : ce qui manque manque, le site marche comme avant."),
      h("div", {className: "edt-etats"}, edtEtatsM().map(function(e){ return h("div", {key: e[0], className: "edt-etat edt-ok"}, h("b", null, e[0]), " — " + e[1]); })),
      // 1. « Ouvrir l'emploi du temps » et sa case, tels qu'ils sont
      h("div", {className: "edt-groupe"}, h("div", {className: "edt-groupe-t"}, "📅 L’écran de la semaine"),
        h("div", {className: "edt-actions edt-haut"},
          h("button", {className: "edt-btn edt-btn-prim", disabled: true, title: MJPC_INCHANGE}, "📅 Ouvrir l’emploi du temps"),
          h("label", {className: "edt-regl", title: "Coché, tu arrives sur l’emploi du temps à chaque connexion. Le réglage s’écrit aussitôt."},
            h("input", {type: "checkbox", checked: arrive, onChange: function(){ setArrive(!arrive); }}), " arriver sur l’emploi du temps en me connectant"))),
      // 2. « ⤓ Sortir le JSON » : une case par objet présent, « Tout cocher », un seul bouton
      h("div", {className: "edt-groupe edt-sortir"}, h("div", {className: "edt-groupe-t"}, "⤓ Sortir le JSON"),
        h("div", {className: "edt-objets"}, presents.map(function(o){
          return h("label", {key: o, className: "edt-objet", title: "Coche pour sortir le JSON de cet objet, tel qu’il est au hub."},
            h("input", {type: "checkbox", "data-objet": o, checked: coches.indexOf(o) >= 0, onChange: function(){ cocher(o); }}),
            " " + EDT_NOMS[o] + (EDT_DONNEES[o].injecteLe ? " — injecté le " + edtJourEnClairM(EDT_DONNEES[o].injecteLe) : ""));
        })),
        h("div", {className: "edt-actions edt-sortir-actions"},
          h("button", {className: "edt-btn", "data-local": "1", title: tous ? "Décoche tous les objets." : "Coche tous les objets : un seul JSON les rangera chacun sous son identifiant.", onClick: function(){ setCoches(tous ? [] : presents.slice()); }}, tous ? "Tout décocher" : "Tout cocher"),
          h("button", {className: "edt-btn edt-btn-prim edt-sortir-btn", "data-local": "1", disabled: !coches.length,
            title: coches.length ? "Copie le JSON des objets cochés : un seul objet, tel qu’il est au hub ; plusieurs, chacun rangé sous son identifiant. Ne change rien au hub." : "Coche au moins un objet : rien n’est coché.",
            onClick: function(){ setMsg(edtSortiM(coches)); }}, "⤓ Sortir les JSON cochés"))),
      // 3. « 📋 Copier le prompt » : un bouton par voie (EDT_PROMPTS, l. 20745), le geste d'aujourd'hui
      h("div", {className: "edt-groupe"}, h("div", {className: "edt-groupe-t"}, "📋 Copier le prompt"),
        h("div", {className: "edt-actions edt-prompt-actions"}, Object.keys(EDT_PROMPTS_INDEX).map(function(k){
          return h("button", {key: k, className: "edt-btn", "data-local": "1", title: "Copie la consigne pour l’IA et le JSON en service, en un seul bloc : un seul collage suffit. Ne change rien au hub.",
            onClick: function(){ setMsg("Prompt copié — " + edtPromptCompletM(k).length + " caractères, consigne et JSON ensemble. Un seul collage suffit."); }}, EDT_VOIES_INDEX[k].titre);
        }))),
      // le rappel du calendrier (l. 19821 à 19827)
      !plusTard && jours >= 30 && h("div", {className: "edt-bloc edt-rappel"},
        h("p", {className: "edt-p"}, "Le calendrier de l’année a été injecté il y a " + (jours < 60 ? "un mois" : Math.floor(jours / 30) + " mois") + " — pense à le réinjecter s’il a bougé."),
        h("div", {className: "edt-actions"},
          h("button", {className: "edt-btn edt-btn-prim", disabled: true, title: MJPC_INCHANGE}, "Réinjecter maintenant…"),
          h("button", {className: "edt-btn", "data-local": "1", title: "Le rappel se tait trente jours (edtRappelPlusTard) ; rien d’autre ne change.", onClick: function(){ setPlusTard(true); }}, "Plus tard"))),
      // « ✨ Injecter un objet » et ses trois voies (l. 19828 à 19832), qui ouvrent un autre écran : inchangées
      h("div", {className: "edt-bloc"}, h("div", {className: "edt-titre"}, "✨ Injecter un objet"),
        h("div", {className: "edt-voies"}, Object.keys(EDT_VOIES_INDEX).map(function(k){
          return h("button", {key: k, className: "edt-btn", disabled: true, title: MJPC_INCHANGE}, EDT_VOIES_INDEX[k].titre); })))),
    msg && h(AtInfo, {msg: msg, fermer: function(){ setMsg(null); }}));
}
function ScEmploiDuTemps(o){ return h(PanneauMJPC, {section: "edt", contenu: function(){ return h(EmploiDuTemps, o || {}); }}); }
MJPC_VERS.edt = "m-emploi-du-temps";
SCENES = SCENES.concat([
  {id: "m-emploi-du-temps", vue: "console", vh: 1200, render: function(){ return ScEmploiDuTemps({}); }},
  {id: "m-emploi-du-temps-un", vue: "console", vh: 1200, render: function(){ return ScEmploiDuTemps({coches: ["calendrier"], message: edtSortiM(["calendrier"])}); }},
  {id: "m-emploi-du-temps-tous", vue: "console", vh: 1200, render: function(){ var t = edtPresents(); return ScEmploiDuTemps({coches: t, message: edtSortiM(t)}); }}
]);
