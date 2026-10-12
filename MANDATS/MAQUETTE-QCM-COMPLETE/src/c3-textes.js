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
    var cotEleve = !!b.closest(".tablette,.eleve-page,.board-active,.board-attente,.sim,.grand-tab,.voir-tab-in");
    // côté élève, seules les infobulles que la 7.7.1 y met déjà : « 📄 Imprimer / Exporter mon bilan » (l. 4176) ; pas « Aide et nouveautés » sur la touche « ? » du clavier
    if(t771 && !b.disabled && (!cotEleve || lib === "📄 Imprimer / Exporter mon bilan")) b.setAttribute("title", t771);
    // (changement 2) sur un écran d'élève, la maquette n'écrit aucune infobulle : seules restent celles de la 7.7.1
    else if(!b.getAttribute("title") && !cotEleve){ var t = bulleDe(lib, b); if(t) b.setAttribute("title", t); }
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

/* (changement 6.7) la ponctuation ne reste jamais seule en début ou en fin de ligne : l'espace avant « : ; ! ? » et « », après « »,
   entre un nombre et son unité, et dans « Q 1 / 3 », devient insécable. La typographie ne change aucun mot (§1.2) : seules les espaces
   changent, dans le texte affiché (jamais dans un champ, ni dans une infobulle). Les textes rendus par React sont repris à chaque rendu. */
var TYPO_NB = " ";
function typoTexte(v){
  return v.replace(/ ([?!;:»])/g, TYPO_NB + "$1").replace(/« /g, "«" + TYPO_NB)
    .replace(/(\d) (s|min|h|px|pts?|%|€|élèves?|questions?|secondes?)(?![\p{L}])/gu, "$1" + TYPO_NB + "$2")
    .replace(/(\d) \/ (\d)/g, "$1" + TYPO_NB + "/" + TYPO_NB + "$2").replace(/ (\d{1,2}:\d\d)(?!\d)/g, TYPO_NB + "$1").replace(/\bQ (\d)/g, "Q" + TYPO_NB + "$1");
}
function typoNoeud(n){
  if(n.nodeType !== 3 || !n.nodeValue || !/[ ]/.test(n.nodeValue)) return;
  var pe = n.parentElement; if(!pe || pe.closest("input,textarea,script,style,select,option,pre,code")) return;   // un champ garde ses espaces ; le prompt affiché les prend, il se copie d'après son texte (promptRempli)
  var t = typoTexte(n.nodeValue); if(t !== n.nodeValue) n.nodeValue = t;
}
function typoArbre(racine){ var tw = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT), n; while((n = tw.nextNode())) typoNoeud(n); }
(function(){
  var racine = document.getElementById("root"); if(!racine || !window.MutationObserver) return;
  new MutationObserver(function(muts){
    muts.forEach(function(m){
      if(m.type === "characterData") typoNoeud(m.target);
      else Array.prototype.forEach.call(m.addedNodes, function(x){ if(x.nodeType === 3) typoNoeud(x); else if(x.nodeType === 1) typoArbre(x); });
    });
  }).observe(racine, {childList:true, subtree:true, characterData:true});
})();

/* (changement 6.6, relecteurs n°50, 104, 222) un émoji décoratif est entier, ou il n'est pas là : celui qui touche un cadre voisin
   (la console, la carte d'une moitié) est retiré de l'affichage, à chaque rendu et à chaque changement de taille */
function decosEntiers(){
  Array.prototype.forEach.call(document.querySelectorAll("#root .deco"), function(d){
    d.style.visibility = "";
    var r = d.getBoundingClientRect(); if(r.width < 1) return;
    var touche = Array.prototype.some.call(d.parentElement ? d.parentElement.children : [], function(x){
      if(x === d || x.classList.contains("deco")) return false;
      var q = x.getBoundingClientRect(); return q.width > 0 && r.right > q.left && r.left < q.right && r.bottom > q.top && r.top < q.bottom; });
    var horsEcran = r.left < 0 || r.right > innerWidth;
    // un cadre qui coupe ce qui dépasse (une tablette simulée, une fenêtre) : l'émoji y est entier, ou il n'y est pas
    for(var x = d.parentElement; x && x.id !== "root" && !horsEcran; x = x.parentElement){ var cs = getComputedStyle(x);
      if(cs.overflowX !== "visible" || cs.overflowY !== "visible"){ var q = x.getBoundingClientRect(); if(r.left < q.left - 1 || r.right > q.right + 1 || r.top < q.top - 1 || r.bottom > q.bottom + 1) horsEcran = true; } }
    if(touche || horsEcran) d.style.visibility = "hidden";
  });
}
(function(){
  var racine = document.getElementById("root"); if(!racine || !window.MutationObserver) return;
  var prevu = false;
  function plusTard(){ if(prevu) return; prevu = true; requestAnimationFrame(function(){ prevu = false; decosEntiers(); }); }
  new MutationObserver(function(muts){ if(muts.some(function(m){ return m.type === "childList"; })) plusTard(); }).observe(racine, {childList:true, subtree:true});
  window.addEventListener("resize", plusTard);
})();
