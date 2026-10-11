/* ═══════════════ Complément 3 — les explications quittent l'écran (changement 1) ═══════════════
   Chaque explication que la maquette écrivait à l'écran a sa place dans banc/existant/textes-console.json : l'infobulle d'un élément,
   ou une section du mode d'emploi. build.py en tire DEST_C3 : [le libellé de l'élément, le texte qu'elle y prend, les scènes où il se montre].
   Après chaque rendu, l'infobulle de l'élément reçoit ce texte, à la suite de la sienne. Une infobulle de la 7.7.1 reste mot pour mot :
   l'explication y prend la bulle « i » posée à côté de l'élément, dans la scène elle-même (InfoIB). */
function InfoIB(libelle, texte){ return h("span", {className:"info-i", "data-bulle":libelle}, "i", h("span", {className:"info-tip"}, texte)); }
function formeBulle(s){ return String(s || "").replace(/[  ]/g, " ").replace(/[’]/g, "'").replace(/\s+/g, " ").trim(); }
function poserPlaces(racine, scene){
  var ici = (window.DEST_C3 || []).filter(function(d){ return d[2].indexOf(scene) >= 0; });
  if(!ici.length) return;
  var libs = {}; ici.forEach(function(d){ (libs[d[0]] = libs[d[0]] || []).push(d[1]); });
  var cles = Object.keys(libs);
  Array.prototype.forEach.call(racine.querySelectorAll("button,h1,h2,h3,h4,label,th,strong,b,span,div,a,summary"), function(e){
    if(e.children.length > 12) return;
    var tc = e.textContent || ""; if(tc.length > 1500 || !cles.some(function(k){ return tc.indexOf(k) >= 0; }) || e.closest("#som-racine,.info-tip")) return;
    var lib = etiquetteDe(e); if(lib.length > 120 || !libs[lib]) return;
    // l'élément le plus profond qui porte ce libellé, sauf un bouton : c'est le bouton qui porte l'infobulle
    if(e.tagName !== "BUTTON" && e.closest("button")) return;
    var enfant = Array.prototype.some.call(e.children, function(c){ return !c.classList.contains("info-i") && etiquetteDe(c) === lib; });
    if(enfant && e.tagName !== "BUTTON") return;
    if(e.tagName === "BUTTON" && titre771(scene || "", lib)) return;    // la 7.7.1 garde sa bulle : InfoIB, dans la scène
    var t = e.getAttribute("title") || "";
    libs[lib].forEach(function(place){ if(formeBulle(t).indexOf(formeBulle(place)) < 0) t = t ? t + " " + place : place; });
    if(t !== (e.getAttribute("title") || "")) e.setAttribute("title", t);
  });
}
function poserGestes(){
  var racine = document.getElementById("root"); if(!racine) return;
  var scene = window.SCENE_COURANTE;
  Array.prototype.forEach.call(racine.querySelectorAll("button"), function(b){
    var lib = etiquetteDe(b);
    var t771 = titre771(scene || "", lib);
    if(t771 && !b.disabled) b.setAttribute("title", t771);
    else if(!b.getAttribute("title")){ var t = bulleDe(lib, b); if(t) b.setAttribute("title", t); }
    if(!b.hasAttribute("data-va") && !b.hasAttribute("data-local")){ var v = allerDe(scene, lib); if(v) b.setAttribute("data-va", v); }
    var env = b.parentElement;
    if(env && env.classList.contains("ferme-env") && !env.getAttribute("title") && b.getAttribute("title")) env.setAttribute("title", b.getAttribute("title"));
  });
  poserPlaces(racine, scene || "");
  poserMoments(racine);
}
/* (complément 3, changement 4) un geste qui fait avancer la séance le déclare : data-moment, le moment de l'écran où il mène.
   Les autres gardent le moment de la scène (c3-gestes.js). Seuls six gestes changent d'appareil, et le déclarent : data-appareil. */
var GESTES_AVANCENT = /^(⏭️ Tour suivant|🔒 Clore la question|✋ Autoriser la réponse|▶️ Lancer Q\d|🚀 Lancer Q\d|▶️ Lancer Q|▶️ Reprendre la séance|🚀 Lancer la séance|🚀 Lancer le rattrapage|📄 Lancer la séance sur papier|📊 Lancer l'autoévaluation|📝 Lancer la correction|💡 Révéler|Question suivante →|← Question précédente|🤝 Ouvrir la co-évaluation|🏁 Afficher leur bilan aux élèves|Donner raison à|📌 Je relis ce soir|Valider|⛔ Retirer le point d'autonomie|↩️ Rendre|↩️ Défaire|↩️ Revenu|↩️ Remettre|❌ Écarter la question|⚠️ Annuler la question|📤 Rendre les copies|🗑️ Mettre à la corbeille|🔓 Rouvrir pour ceux qui n'ont pas répondu|🔓 Rouvrir pour |🔁 Rouvrir Q|🔓 Rouvrir la séance|🔄 Reprendre la séance|💾 Grille remplie|⏸️ Feuilles ramassées|🎓 Lancer la démo|Je commence)/;
var GESTES_APPAREIL = /^(▶️ Lancer Q\d|🚀 Lancer Q\d|💡 Révéler|Question suivante →|🏁 Afficher leur bilan|🎓 Mode élève|👋 Ouvrir le portail élève)/;
function poserMoments(racine){
  var ici = SCENES.filter(function(s){ return s.id === window.SCENE_COURANTE; })[0] || {};
  var appIci = ici.appareil || SCN.appareilDe(ici.id || "", ici.vue);
  Array.prototype.forEach.call(racine.querySelectorAll("button[data-va]"), function(b){
    var va = b.getAttribute("data-va"), id = va.split("&")[0], lib = etiquetteDe(b), t = SCENES.filter(function(s){ return s.id === id; })[0];
    if(!t) return;
    // une fenêtre de confirmation ouverte par le geste n'avance rien : seul le geste qui agit (dans la fenêtre, ou sans fenêtre) avance
    var dansFenetre = !!b.closest("[data-echap]");
    if(!b.hasAttribute("data-moment") && !/[&]m=/.test(va) && GESTES_AVANCENT.test(lib) && (dansFenetre || !/(⏸️ Finir à une autre heure|⛔ Retirer le point d'autonomie|🔓 Rouvrir la séance)$/.test(lib))){
      var md = t.moment || SCN.MOMENT_DE[id]; if(md && md !== window.MOMENT_COURANT) b.setAttribute("data-moment", md);
    }
    var appT = t.appareil || SCN.appareilDe(id, t.vue);
    if(!b.hasAttribute("data-appareil") && appT !== appIci && GESTES_APPAREIL.test(lib)) b.setAttribute("data-appareil", appT);
  });
}
