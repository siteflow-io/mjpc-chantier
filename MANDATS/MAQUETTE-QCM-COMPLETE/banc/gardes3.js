// Les gardes 9 à 15 du complément 3 (§3), dans le banc unique avec les gardes 1 à 8. Elles lisent la scène ouverte dans Chromium,
// l'intérieur des cadres compris, et passent par le geste, aux tailles de chaque vue.
//    9. Aucune explication à l'écran, les bons mots (banc/existant/textes-console.json : le classement des textes de la maquette).
//   10. Une infobulle par élément des vues de Paul ; aucune côté élève ; chaque bulle « i » se lit en entier.
//   11. Les quatre niveaux toujours là, dans la liste des évaluations et celle des séances ; le tri « classe ».
//   12. Chaque geste mène au bon endroit : le bon objet, le bon moment, le même appareil (src/scenario.js : le moment de chaque scène).
//   13. Une seule séance, les mêmes chiffres partout : chaque chiffre lu à l'écran, comparé au scénario au moment de la scène.
//   14. Tout se lit et tout s'atteint.
//   15. Le geste se voit.
const path = require("path"), fs = require("fs");
const C = require("./controles.js");
const RACINE = path.join(__dirname, "..");
const SAS = path.join(RACINE, "..", "..");
const PROD = process.env.PROD || "/home/user/siteflow-io/monsieurjaipascompris";
const lire = p => fs.readFileSync(p, "utf8");

/* ════════ Le scénario, hors de la page (la référence de la garde 13, et le moment de chaque scène) ════════ */
global.HUB_EVALS = JSON.parse(lire(path.join(RACINE, "src", "donnees", "evaluations_hub.json")));
global.EV3 = (new Function(lire(path.join(RACINE, "src", "ev3e.js")) + ";return EV3;"))();
// (complément 4) SCN_FILE : le scénario d'une version livrée, pour jouer les gardes sur elle avec son propre scénario (la v8 à l'étape A)
const SCN = require(process.env.SCN_FILE || path.join(RACINE, "src", "scenario.js"));
// le moment d'une scène : celui que LISTE_SCENES déclare ; pour une version qui ne le déclare pas (la v7), celui du scénario
// (complément 4, garde 16.3) une destination (« c-resultats&seance=PAP ») est jouée comme une scène : sa scène est ce qui précède le premier « & »
const baseDe = id => String(id).split("&")[0];
function momentDe(sc){ return sc.moment || SCN.MOMENT_DE[baseDe(sc.id)] || null; }
function appareilDe(sc){ return sc.appareil || SCN.appareilDe(baseDe(sc.id), sc.vue); }

const TAILLES = {console: [{w:1366, h:768}, {w:1536, h:864}, {w:1920, h:1080}], telephone: [{w:390, h:844}], tablette: [{w:1280, h:800}],
  tableau: [{w:1280, h:800}, {w:1920, h:1080}], eleve: [{w:1280, h:800}, {w:390, h:844}]};
const VUES_PAUL = ["console", "telephone"];
const vueEleve = sc => ["tablette", "eleve", "tableau"].includes(sc.vue);

/* ════════ Le corpus du site d'aujourd'hui : ce qu'un texte de la maquette n'est pas (complément 3, §1.4) ════════ */
let CORPUS_SITE = null;
function unjs(s){ return s.replace(/\\u([0-9a-fA-F]{4})/g, (m, x) => String.fromCharCode(parseInt(x, 16))).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, "\n"); }
function unhtml(s){ return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&rsquo;/g, "’").replace(/&laquo;/g, "«").replace(/&raquo;/g, "»").replace(/&hellip;/g, "…"); }
// la forme d'un texte pour le chercher : apostrophes, espaces, points de suspension ; les noms, les nombres et les libellés mis à part
function formeTexte(s){ return C.norm(String(s).replace(/\.\.\./g, "…")).replace(/\s+/g, " ").trim(); }
function corpusSite(){
  if(CORPUS_SITE) return CORPUS_SITE;
  const t = ["evaluation-qcm.html", "index.html", "correction_dictee.html"].map(f => unhtml(unjs(lire(path.join(PROD, f))))).join("\n");
  // (changement 8.1) « séance » pour « session » : la seule exception au mot pour mot de l'existant
  CORPUS_SITE = formeTexte(t.replace(/<\/?(strong|b|em|i|span|br|code)\b[^>]*>/g, "").replace(/(?<![\p{L}])([Ss])ession(s?)(?![\p{L}])/gu, (m, a, b) => (a === "S" ? "Séance" : "séance") + b));
  return CORPUS_SITE;
}
function dansSite(t){ const f = formeTexte(t); if(f.length < 3) return true; const c = corpusSite(); if(c.includes(f)) return true;
  // un texte fait de morceaux du site et de données (noms, nombres) : chaque morceau est dans le site
  const segs = f.split(/[§#¤ɸ]+/).map(s => s.trim()).filter(s => (s.match(/\p{L}/gu) || []).length >= 4);
  return /[§#¤ɸ]/.test(f) && segs.length > 0 && segs.every(s => c.includes(s)); }
// les données : énoncés, choix, titres, explications des évaluations ; la taxonomie ; l'emploi du temps ; le prompt de Paul
let DONNEES = null;
function donnees(){
  if(DONNEES) return DONNEES;
  const o = new Set(), ajoute = s => { if(s && typeof s === "string" && s.trim().length > 1) o.add(C.normEsp(s)); };
  const evs = [SCN.EV_ESSAI, SCN.DEMO, global.EV3].concat(Object.values(global.HUB_EVALS));
  evs.forEach(e => { ajoute(e.titre); (e.questions || []).forEach(q => { if(!q) return; ajoute(q.enonce); (q.choix || []).forEach(ajoute); ajoute(q.explication); }); });
  const tx = JSON.parse(lire(path.join(RACINE, "src", "donnees", "taxonomie_atelier.json")));
  (function parcours(x){ if(typeof x === "string") ajoute(x); else if(Array.isArray(x)) x.forEach(parcours); else if(x && typeof x === "object") Object.values(x).forEach(parcours); })(tx);
  Object.values(C.LIB_ELEVE).concat(Object.values(C.LIB_OFFICIELS)).forEach(ajoute);
  const prompt = C.promptCorrige(/## Le texte proposé\s*```\n([\s\S]*?)\n```/.exec(lire(path.join(SAS, "MANDATS", "PROMPT-QCM-CREATION", "README.md")))[1]);
  prompt.split("\n").forEach(ajoute);
  DONNEES = o; return o;
}
// « ... » dans une donnée du hub (la taxonomie : « Élève : … · 6e-3e · … », index.html _taxoLigneNotion) : la donnée reste telle quelle
function pointsDansDonnee(t){ return estDonnee(t) || String(t).split(" · ").filter(s => /\.\.\./.test(s)).every(s => estDonnee(s.replace(/^Élève : /, ""))); }
function estDonnee(t){ const n = C.normEsp(t); if(!n) return true; const D = donnees(); if(D.has(n)) return true;
  // une donnée précédée d'un repère (« Q3 · », « Question 2 · », « E · », « 📚 ») ou suivie de « ✓ »
  const sans = n.replace(/^(Q\d+ · |Question \d+ · |[A-F] (✓ )?· ?|[A-F] ✓ |📚 |DUVERNAY Michel — Q\d · )/, "").replace(/ ✓$/, "");
  return D.has(sans); }

/* ════════ Garde 9 — aucune explication à l'écran, les bons mots ════════ */
const FICHIER_TEXTES = path.join(__dirname, "existant", "textes-console.json");
function classement(){ const j = fs.existsSync(FICHIER_TEXTES) ? JSON.parse(lire(FICHIER_TEXTES)) : {textes: [], motifs: []};
  const parForme = new Map(); (j.textes || []).forEach(x => parForme.set(formeTexte(x.texte), x));
  const motifs = (j.motifs || []).map(m => Object.assign({re: new RegExp(m.motif, "u")}, m));
  return {j, parForme, motifs}; }
function classer(t, K){ const f = formeTexte(t); if(K.parForme.has(f)) return K.parForme.get(f); const n = C.normEsp(t); return K.motifs.find(m => m.re.test(n)) || null; }
// Les textes visibles d'une scène : chaque bloc (le premier ancêtre qui n'est pas en ligne), avec ce qu'il est
function lireTextes9(){
  const root = document.getElementById("root");
  const vis = el => { const r = el.getBoundingClientRect(); if(r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.02; };
  const bloc = el => { let a = el; while(a && a !== root){ const d = getComputedStyle(a).display; if(d !== "inline" && d !== "contents") return a; a = a.parentElement; } return root; };
  const blocs = new Map();
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while((n = tw.nextNode())){
    const v = n.nodeValue; if(!v.trim()) continue;
    const el = n.parentElement; if(!el || el.closest(".info-tip,.deco,style,script,#som-racine") || !vis(el)) continue;
    const b = bloc(el); if(!blocs.has(b)) blocs.set(b, []); blocs.get(b).push(v);
  }
  const ELEVE = ".tablette,.eleve-page,.sim,.grand-tab,.voir-tab-in,.feuille-a4,.bilan-imprime-page,.eleve-card";
  const out = [];
  blocs.forEach((parts, b) => {
    const t = parts.join("").replace(/\s+/g, " ").trim(); if(!t) return;
    out.push({t, geste: !!b.closest("button,a,select,option,label,.tel-el,.qdf-c,[role=button],.niv-titre,.m8tx-dom-titre,.m8tx-fam-titre"),
      mode: !!b.closest("[data-mode-emploi],.me-bloc"), eleve: !!b.closest(ELEVE), prompt: !!b.closest("[data-prompt],.codeblock,textarea"), cls: (typeof b.className === "string" ? b.className : "").slice(0, 40)});
  });
  const titres = Array.from(root.querySelectorAll("[title]")).filter(e => !e.closest("#som-racine")).map(e => ({t: e.getAttribute("title"), eleve: !!e.closest(ELEVE)})).filter(x => x.t && x.t.trim());
  const tips = Array.from(root.querySelectorAll(".info-tip")).map(e => ({t: (e.textContent || "").replace(/\s+/g, " ").trim(), eleve: !!e.closest(ELEVE)})).filter(x => x.t);
  const indications = Array.from(root.querySelectorAll("input[placeholder],textarea[placeholder]")).filter(vis).map(e => ({t: e.placeholder, eleve: !!e.closest(ELEVE)}));
  // les fenêtres de confirmation : une fenêtre ouverte qui a un bouton qui agit (pas seulement « Annuler » ou « Fermer »)
  const fermer = /^(✕|Annuler|Fermer|✕ Fermer|OK|Compris|✓ J'ai compris|↩️ Annuler)$/;
  const fenetres = Array.from(root.querySelectorAll(".checkin-modal,.cm-box,.alerte-boite,.tel-sheet,.modal")).filter(vis).map(f => {
    const boutons = Array.from(f.querySelectorAll("button")).filter(vis).map(b => (b.innerText || "").replace(/\s+/g, " ").trim());
    const agit = boutons.filter(x => !fermer.test(x));
    // le corps : les paragraphes, hors du titre, des listes de choix, des champs et des boutons
    let cands = Array.from(f.querySelectorAll(".fen-corps p,.fen-corps > div:not(.depart-grille):not(.depart-l),.cm-sub,.alerte-texte,.tel-etat,:scope > p,:scope > div:not(.checkin-header):not(.checkin-actions):not(.qdf-choix):not(.checkin-list):not(.rouvrir-l):not(.fen-corps)"))
      .filter(x => vis(x) && !x.querySelector("button,input,textarea,select") && !x.closest(".qdf-choix,.depart-grille"));
    cands = cands.filter(x => !cands.some(y => y !== x && y.contains(x)));
    const corps = cands.map(x => (x.innerText || "").replace(/\s+/g, " ").trim()).filter(Boolean);
    const titre = ((f.querySelector("h2,h3,.cm-title") || {}).innerText || "").replace(/\s+/g, " ").replace(/\s*i$/, "").trim();
    return {titre: titre.slice(0, 80), agit, corps, editeur: !!f.querySelector(".preview,.ed-chap,textarea.json"), question: /\?$/.test(titre)};
  }).filter(x => x.agit.length && !x.editeur && x.question);
  return {textes: out, titres, tips, indications, fenetres};
}
// une phrase : ce qui finit par « . », « ! », « ? » ou « … » suivis d'une espace ou de la fin (« Q2. » ou « 3 s. » n'en coupent pas)
function phrases(t){ return String(t).replace(/\s+/g, " ").trim().split(/(?<=[.!?…»])\s+(?=[A-ZÀ-ÖØ-Ý«📱🛑⛔✅❌⚠️🔴🟢🔵🟠👉☝️📌🙈])/u).filter(x => (x.match(/\p{L}/gu) || []).length >= 3); }
const MOTS_9 = [
  {nom: "« session »", re: /(?<![\p{L}])sessions?(?![\p{L}])/iu},
  {nom: "« (s) »", re: /\(s\)/},
  {nom: "« ... »", re: /\.\.\./},
  {nom: "« recopie »", re: /recopi/i},
  {nom: "un texte de maquette", re: /pour la capture|repliées? pour|\(maquette\)|scène suivante|cette scène/i}];
// une élision manquante, dans un texte écrit par la maquette : « de » ou « que » devant une voyelle (pas devant un nombre, une lettre seule, un sigle)
const ELISION = /(?<![\p{L}'’])(de|que|De|Que)\s+(?=([AEIOUYÉÈÊÀÂÎÔÛHaeiouyéèêàâîôûh][\p{L}]))(?!(?:Hugo|haut|hors|hui|huit|hasard|héros|hâte|hiérarchis|hublot|hub\b))/u;
function garde9Scene(sc, lu, K, journal){
  const out = [], tag = "garde 9. " + sc.id;
  const paul = VUES_PAUL.includes(sc.vue);
  for(const x of lu.textes){
    const site = dansSite(x.t), donnee = estDonnee(x.t) || (x.t.match(/\p{L}/gu) || []).length < 3;
    // 9.6 : les mots, partout (textes, élève compris, sauf les données du hub)
    if(!donnee) for(const m of MOTS_9) if(m.re.test(x.t) && !(m.nom === "« ... »" && pointsDansDonnee(x.t))) out.push(tag + " : " + m.nom + " à l'écran — « " + x.t.slice(0, 110) + " »");
    if(!donnee && !site && ELISION.test(x.t)) out.push(tag + " : une élision manque — « " + x.t.slice(0, 110) + " »");
    if(!paul || x.eleve || x.geste || site || donnee) continue;
    // 9.1 et 9.2 : chaque texte de la maquette est classé ; aucune explication à l'écran, hors du mode d'emploi
    const c = classer(x.t, K);
    if(!c){ out.push(tag + " : texte de la maquette sans classement dans textes-console.json — « " + x.t.slice(0, 140) + " »"); if(journal) journal.push({scene: sc.id, texte: x.t}); continue; }
    if(c.categorie === "explication" && !x.mode) out.push(tag + " : une explication reste à l'écran (sa place : " + (c.destination ? (c.destination.infobulle ? "l'infobulle de « " + c.destination.infobulle + " »" : "le mode d'emploi, « " + c.destination.mode_emploi + " »") : "?") + ") — « " + x.t.slice(0, 120) + " »");
  }
  for(const x of lu.titres.concat(lu.tips, lu.indications)){
    if(estDonnee(x.t)) continue;
    for(const m of MOTS_9) if(m.re.test(x.t)) out.push(tag + " : " + m.nom + " dans une infobulle — « " + x.t.slice(0, 110) + " »");
    if(!dansSite(x.t) && ELISION.test(x.t)) out.push(tag + " : une élision manque dans une infobulle — « " + x.t.slice(0, 110) + " »");
  }
  // 9.4 : le corps d'une fenêtre de confirmation tient en deux phrases au plus
  for(const f of lu.fenetres){ const n = f.corps.reduce((a, t) => a + phrases(t).length, 0);
    if(n > 2) out.push(tag + " : la fenêtre « " + f.titre + " » a " + n + " phrases dans son corps (deux au plus) — « " + f.corps.join(" ").slice(0, 140) + " »"); }
  return [...new Set(out)];
}
// 9.3 : chaque explication retirée se retrouve à sa place : l'infobulle de l'élément, ou la section du mode d'emploi
function lireDestinations(dest){
  const root = document.getElementById("root"), out = [];
  const lib = e => { const c = e.cloneNode(true); c.querySelectorAll(".info-i,.info-tip").forEach(x => x.remove()); return (c.textContent || "").replace(/\s+/g, " ").trim(); };
  for(const d of dest){
    if(d.infobulle){
      const els = Array.from(root.querySelectorAll("*")).filter(e => lib(e) === d.infobulle || (e.getAttribute && e.getAttribute("data-bulle") === d.infobulle));
      const textes = els.map(e => { const t = e.closest("[title]"); const tip = e.querySelector(".info-tip"); return [(t && t.getAttribute("title")) || "", tip ? tip.textContent : ""].join(" "); });
      out.push({d, trouve: els.length > 0, textes});
    } else if(d.mode_emploi){
      const secs = Array.from(root.querySelectorAll("[data-mode-emploi] h3,.me-bloc h3")).filter(h => h.textContent.trim() === d.mode_emploi);
      out.push({d, trouve: secs.length > 0, textes: secs.map(h => h.parentElement.innerText)});
    }
  }
  return out;
}
function garde9Destinations(lu){
  const out = [];
  const n = s => C.normEsp(String(s)).replace(/\.\.\./g, "…");
  for(const x of lu){
    const ou = x.d.infobulle ? "l'infobulle de « " + x.d.infobulle + " » (" + x.d.scene + ")" : "le mode d'emploi, section « " + x.d.mode_emploi + " »";
    if(!x.trouve){ out.push("garde 9. l'explication « " + x.d.texte.slice(0, 80) + "… » : " + ou + " n'existe pas"); continue; }
    if(!x.textes.some(t => n(t).includes(n(x.d.place)))) out.push("garde 9. l'explication « " + x.d.texte.slice(0, 80) + "… » ne se retrouve pas dans " + ou);
  }
  return out;
}
// 9.5 : les textes vus par l'élève, ceux de la v7, hors des exceptions du §1.2 (la typographie, les quatre retouches du point 778)
function lireTextesEleve(){
  const root = document.getElementById("root"), out = [];
  const vis = el => { const r = el.getBoundingClientRect(); if(r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none"; };
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while((n = tw.nextNode())){ const v = n.nodeValue.replace(/\s+/g, " ").trim(); const el = n.parentElement; if(!v || !el || el.closest(".info-tip,.deco,style,script") || !vis(el)) continue; out.push(v); }
  return out;
}
const RETOUCHES_778 = [
  {avant: /^❌ Tu avais faux\.$/, contexte: "la consigne qui suit le bandeau (le doublon part)"},
  {avant: /^Un désaccord, c'est sérieux : tu n'en signales qu'un, celui dont tu es le plus sûr\. Il se vérifie sur ta feuille\.$/, contexte: "la règle du désaccord, dite une fois"},
  {avant: /^Temps de réponse$/i, apres: "📄 Temps pour lire la feuille du voisin", contexte: "le chrono de la lecture"},
  {avant: /^Ma feuille ne dit aucun de ces choix$/, apres: "aucun de ces choix", contexte: "« Ta réponse : … »"},
  {avant: /^☝️ Un désaccord, c'est sérieux/, contexte: "la règle du désaccord, dite une fois"}];
// les exceptions du §1.2 : la typographie, et « séance » pour « session » (changement 8.1, la seule exception au mot pour mot)
function typo(s){ return C.normEsp(String(s).replace(/\.\.\./g, "…").replace(/(?<![\p{L}])([Ss])ession(s?)(?![\p{L}])/gu, (m, a, b) => (a === "S" ? "Séance" : "séance") + b)).replace(/\s*([:;!?»])/g, " $1").replace(/«\s*/g, "« ").replace(/\s+/g, " ").trim(); }
function entier7(texteV7, t){ const n = C.normEsp(t); return Object.values(texteV7).some(l => l.some(x => { const v = C.normEsp(x); return /…$/.test(v) && v.length > 12 && n.includes(v.replace(/…$/, "").trim()); })); }
function garde95(texteV7, texteV8){
  // texteV7, texteV8 : {scène: [textes]} ; les données (énoncés, choix, noms, nombres) mises à part par formeTexte
  const out = [];
  const tous7 = new Set(), tous8 = new Set();
  Object.values(texteV7).forEach(l => l.forEach(t => tous7.add(formeTexte(typo(t)))));
  Object.values(texteV8).forEach(l => l.forEach(t => tous8.add(formeTexte(typo(t)))));
  for(const sc in texteV8){
    for(const t of new Set(texteV8[sc])){
      if(estDonnee(t) || (t.match(/\p{L}/gu) || []).length < 3) continue;
      const f = formeTexte(typo(t));
      if(tous7.has(f)) continue;
      // (changement 6.4) un texte que la v7 tronquait (« … ») se lit désormais en entier : c'est le même texte
      if(entier7(texteV7, t)) continue;
      if(RETOUCHES_778.some(r => r.apres && C.normEsp(t).includes(r.apres))) continue;
      out.push("garde 9. " + sc + " : un texte vu par l'élève n'est pas dans la v7 — « " + t.slice(0, 110) + " »");
    }
  }
  for(const sc in texteV7){
    if(!texteV8[sc]) continue;
    const ici = new Set(texteV8[sc].map(t => formeTexte(typo(t))));
    for(const t of new Set(texteV7[sc])){
      if(estDonnee(t) || (t.match(/\p{L}/gu) || []).length < 3) continue;
      const f = formeTexte(typo(t));
      if(ici.has(f) || tous8.has(f) && /^[\p{L} '’-]{1,40}$/u.test(t)) continue;
      if(/…$/.test(t.trim()) && (texteV8[sc] || []).some(x => C.normEsp(x).includes(C.normEsp(t).replace(/…$/, "").trim()))) continue;
      if(RETOUCHES_778.some(r => r.avant.test(C.normEsp(t)))) continue;
      out.push("garde 9. " + sc + " : un texte vu par l'élève dans la v7 a disparu — « " + t.slice(0, 110) + " »");
    }
  }
  return out;
}

/* ════════ Garde 10 — une infobulle par élément ════════ */
// Les infobulles de l'existant (l'inventaire de la garde 1) : elles restent mot pour mot, et elles sont les seules permises côté élève
let TITRES_EXISTANT = null, TITRES_ELEVE = null;
let EX_FORMES = null;
function titresExistant(){
  if(TITRES_EXISTANT) return TITRES_EXISTANT;
  const dir = path.join(__dirname, "existant"); TITRES_EXISTANT = new Set(); TITRES_ELEVE = new Set();
  fs.readdirSync(dir).filter(f => /^(qcm|mjpc|code)-.*\.json$/.test(f)).forEach(f => { const v = JSON.parse(lire(path.join(dir, f)));
    const eleve = /^(qcm-eleve|code-eleve)/.test(f);
    (v.titres || []).forEach(x => { const t = C.normEsp(typeof x === "string" ? x : x.t); TITRES_EXISTANT.add(t); if(eleve) TITRES_ELEVE.add(t); });
    (v.boutons || []).forEach(b => { if(b.t){ const t = C.normEsp(b.t); TITRES_EXISTANT.add(t); if(eleve) TITRES_ELEVE.add(t); } }); });
  // (complément 3) les infobulles de ce que la maquette a cloné mot pour mot de correction_dictee.html (§1.4) : « Déplier ce niveau »…
  const dictee = C.unjs ? C.unjs(lire(path.join(PROD, "correction_dictee.html"))) : lire(path.join(PROD, "correction_dictee.html")).replace(/\\u([0-9a-fA-F]{4})/g, (m, x) => String.fromCharCode(parseInt(x, 16)));
  (dictee.match(/title\s*[:=]\s*[^,}>]+/g) || []).forEach(m => (m.match(/"([^"]+)"|'([^']+)'/g) || []).forEach(q => TITRES_EXISTANT.add(C.normEsp(q.slice(1, -1)))));
  // (complément 3) les infobulles écrites dans les sources du site : un title littéral (« Démarrer la session avec les absents marqués »,
  // en « séance » depuis le changement 8), ou le début littéral d'un title que le site calcule (« élève à dispositif — cases cochées le » + la date)
  TITRES_PREFIXES = [];
  for(const f of ["evaluation-qcm.html", "index.html"]){
    const src = lire(path.join(PROD, f));
    for(const m of src.matchAll(/\btitle\s*[:=]\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')(\s*\+)?/g)){
      const lit = C.normEsp((m[1] !== undefined ? m[1] : m[2]).replace(/\\(["'])/g, "$1")); if(lit.length < 6) continue;
      const seance = lit.replace(/(?<![\p{L}])([Ss])ession(s?)(?![\p{L}])/gu, (x, a, pl) => (a === "S" ? "S" : "s") + "éance" + pl);
      if(m[3]){ if(lit.length >= 15) TITRES_PREFIXES.push(lit, seance); } else { TITRES_EXISTANT.add(lit); TITRES_EXISTANT.add(seance); }
    }
  }
  return TITRES_EXISTANT;
}
let TITRES_PREFIXES = [];
const deLExistant = n => TITRES_PREFIXES.some(p => n.startsWith(p));
// 10.1 et 10.2 : chaque geste, chaque élément qui porte son texte ou sa marque ; la souris posée en son centre
function lireBulles10(){
  const root = document.getElementById("root"), out = [];
  const ELEVE = ".tablette,.eleve-page,.sim,.grand-tab,.voir-tab-in,.feuille-a4,.bilan-imprime-page,.pdf-page,iframe,.feuille-fond";
  const GESTE = "button,a[href],input,select,textarea,[role=button],.tel-el,.qdf-c,label";
  const vis = el => { const r = el.getBoundingClientRect(); if(r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
  const couches = Array.from(root.querySelectorAll(".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.fen-fond,.at-modale")).filter(vis);
  const dessus = couches.length ? couches[couches.length - 1] : null;
  const propre = e => Array.from(e.childNodes).some(c => c.nodeType === 3 && c.nodeValue.trim());
  const geste = e => e.matches(GESTE) || (getComputedStyle(e).cursor === "pointer" && !(e.parentElement && getComputedStyle(e.parentElement).cursor === "pointer"));
  const lib = e => { const c = e.cloneNode(true); c.querySelectorAll(".info-tip").forEach(x => x.remove()); return (c.textContent || e.value || e.placeholder || "").replace(/\s+/g, " ").trim().slice(0, 60); };
  const gestesDe = e => Array.from(e.querySelectorAll(GESTE)).filter(vis);
  const cands = Array.from(root.querySelectorAll("*")).filter(e => vis(e) && !e.closest(ELEVE) && !e.closest(".info-tip,.deco,#som-racine,style,script,option") && (!dessus || dessus.contains(e)) && !e.matches("svg *"))
    .filter(e => e.classList.contains("info-i") || (geste(e) && !e.parentElement.closest(GESTE + ",.info-i")) || (propre(e) && !e.closest(GESTE + ",.info-i")));
  for(const e of cands){
    const sorte = e.classList.contains("info-i") ? "i" : geste(e) ? "geste" : "affichage";
    if(sorte === "i"){ const tip = e.querySelector(".info-tip"); out.push({lib: lib(e.parentElement).slice(0, 50), sorte, ok: !!(tip && tip.textContent.trim()), raison: tip ? "bulle vide" : "pas de bulle"}); continue; }
    e.scrollIntoView({block: "center", inline: "center"});
    const r = e.getBoundingClientRect();
    if(r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
    const hit = document.elementFromPoint(cx, cy);
    if(!hit) continue;
    if(!e.contains(hit) && !hit.contains(e)){ if(hit.closest(".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.fen-fond,.at-modale") && !e.closest(".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.fen-fond,.at-modale")) continue; }
    const t = hit.closest("[title]"), titre = t ? t.getAttribute("title").trim() : "";
    let raison = null;
    if(!titre) raison = "aucune infobulle sous la souris";
    else if(t !== e && !e.contains(t) && !t.contains(e)) raison = "l'infobulle sous la souris est celle d'un autre élément (« " + lib(t).slice(0, 30) + " »)";
    else if(t !== e && !e.contains(t)){
      const r2 = t.getBoundingClientRect(), autres = gestesDe(t).filter(g => g !== e && !e.contains(g) && !g.contains(e));
      if(autres.length) raison = "l'infobulle est portée par un bloc qui contient d'autres gestes (« " + lib(autres[0]).slice(0, 30) + " »)";
      else if(r2.width * r2.height > 120000) raison = "l'infobulle est portée par un bloc de " + Math.round(r2.width * r2.height) + " px²";
    }
    out.push({lib: lib(e), sorte, ok: !raison, raison, titre: titre.slice(0, 200)});
  }
  window.scrollTo(0, 0);
  const titres = Array.from(root.querySelectorAll("[title]")).filter(e => !e.closest(ELEVE) && !e.closest("#som-racine")).map(e => e.getAttribute("title")).filter(Boolean);
  const eleve = Array.from(root.querySelectorAll("[title]")).filter(e => e.closest(".tablette,.eleve-page")).map(e => ({lib: lib(e).slice(0, 40), t: e.getAttribute("title")}))
    .concat(Array.from(root.querySelectorAll(".info-i")).filter(e => e.closest(".tablette,.eleve-page")).map(e => ({lib: lib(e.parentElement).slice(0, 40), t: "(bulle « i »)"})));
  return {elements: out, titres, eleve};
}
const MOTS_CODE = /\b[a-z]+[A-Z][a-zA-Z]+\b|\(\)|Firebase|sessionActive|en_cours|snapshot|\bparse\b|drill-down|\bVuePhone\b/;
function garde10Scene(sc, lu){
  const out = [], tag = "garde 10. " + sc.id, EX = titresExistant();
  const sans = lu.elements.filter(x => !x.ok);
  // un relevé par sorte d'élément, avec les premiers exemples, pour que la sortie se lise
  const parRaison = {};
  sans.forEach(x => { const k = x.sorte + " · " + x.raison; (parRaison[k] = parRaison[k] || []).push(x.lib); });
  Object.keys(parRaison).forEach(k => out.push(tag + " : " + parRaison[k].length + " × " + k + " — " + [...new Set(parRaison[k])].slice(0, 6).map(l => "« " + l + " »").join(", ")));
  // 10.3 : une infobulle écrite par la maquette : au moins une phrase complète qui finit par un point ; ni double espace, ni mot du code
  if(!EX_FORMES) EX_FORMES = new Set([...EX].map(x => C.norm(x)));
  for(const t of new Set(lu.titres)){
    // une infobulle de l'existant calculée (« Question en cours — 10/10 justes pour le moment ») : comparée à sa forme, comme à la garde 1
    const n = C.normEsp(t); if(EX.has(n) || EX_FORMES.has(C.norm(n)) || deLExistant(n)) continue;
    if(!/[.!?»…)]$/.test(t.trim()) && !/\.\s/.test(t)) out.push(tag + " : une infobulle sans phrase complète — « " + t.slice(0, 100) + " »");
    if(/\S  \S/.test(t)) out.push(tag + " : une infobulle avec un double espace — « " + t.slice(0, 100) + " »");
    if(MOTS_CODE.test(t.replace(/«[^»]*»/g, ""))) out.push(tag + " : une infobulle avec un mot du code — « " + t.slice(0, 100) + " »");
  }
  return out;
}
// 10.5 : côté élève et au tableau, aucune infobulle, sauf celles que la 7.7.1 y met déjà
function garde10Eleve(sc, lu){
  titresExistant();
  return lu.eleve.filter(x => !TITRES_ELEVE.has(C.normEsp(x.t))).map(x => "garde 10. " + sc.id + " : une infobulle côté élève — « " + x.lib + " » : « " + x.t.slice(0, 90) + " »");
}
// 10.6 et 10.7 : chaque bulle « i » s'ouvre au survol et se lit en entier, aux trois tailles de la console (par le geste : la souris)
async function garde10Bulles(page, sc, T){
  const out = [], tag = "garde 10. " + sc.id + " @" + T.w + "×" + T.h;
  const n = await page.evaluate(() => document.querySelectorAll("#root .info-i").length);
  for(let k = 0; k < n; k++){
    const pre = await page.evaluate(k => { const i = document.querySelectorAll("#root .info-i")[k]; const r = i.getBoundingClientRect(); if(r.width < 2) return null;
      const couches = Array.from(document.querySelectorAll("#root .modal-back,#root .checkin-overlay,#root .sessions-menu-overlay,#root .tel-sheet-fond,#root .grand-fond,#root .fen-fond,#root .at-modale")).filter(c => c.getBoundingClientRect().width > 0);
      const dessus = couches.length ? couches[couches.length - 1] : null;
      if(dessus && !dessus.contains(i)) return null;
      if(i.closest(".tablette,.eleve-page,.sim,.grand-tab,.voir-tab-in")) return null;
      i.scrollIntoView({block: "center", inline: "center"}); const q = i.getBoundingClientRect();
      return {x: q.left + q.width / 2, y: q.top + q.height / 2, ctx: (i.parentElement.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40), tip: !!i.querySelector(".info-tip")}; }, k);
    if(!pre) continue;
    if(!pre.tip){ out.push(tag + " : le « i » de « " + pre.ctx + " » n'a pas de bulle"); continue; }
    await page.mouse.move(pre.x, pre.y); await page.waitForTimeout(60);
    const r = await page.evaluate(k => {
      const i = document.querySelectorAll("#root .info-i")[k], t = i.querySelector(".info-tip"), cs = getComputedStyle(t), R = t.getBoundingClientRect();
      if(cs.display === "none" || R.width < 2) return {ouvre: false};
      let couvert = 0; for(const fy of [0.25, 0.75]) for(const fx of [0.15, 0.5, 0.85]){ const x = R.left + R.width * fx, y = R.top + R.height * fy; const el = (x >= 0 && y >= 0 && x < innerWidth && y < innerHeight) ? document.elementFromPoint(x, y) : null; if(!el || !t.contains(el)) couvert++; }
      return {ouvre: true, deborde: t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > t.clientHeight + 1, ws: cs.whiteSpace, hors: R.left < 0 || R.top < 0 || R.right > innerWidth + 0.5 || R.bottom > innerHeight + 0.5,
        cote: [Math.round(R.left), Math.round(R.top), Math.round(R.right), Math.round(R.bottom)], couvert, police: cs.fontFamily, app: getComputedStyle(i.closest(".tprof-box") || document.body).fontFamily, casse: cs.textTransform, espace: cs.letterSpacing, vide: !t.textContent.trim()};
    }, k);
    await page.mouse.move(0, 0);
    const nom = tag + " : la bulle de « " + pre.ctx + " »";
    if(!r.ouvre){ out.push(nom + " ne s'ouvre pas au survol"); continue; }
    if(r.vide) out.push(nom + " est vide");
    if(r.deborde || r.ws === "nowrap") out.push(nom + " : son texte sort de sa bulle (white-space: " + r.ws + ")");
    if(r.hors) out.push(nom + " sort de la fenêtre (bulle " + r.cote.join(", ") + ")");
    if(r.couvert) out.push(nom + " est recouverte en " + r.couvert + " point(s) sur 6");
    if(r.police !== r.app) out.push(nom + " s'écrit en « " + r.police + " », pas dans la police de l'app (« " + r.app + " »)");
    if(r.casse !== "none") out.push(nom + " s'écrit en " + r.casse);
    if(r.espace !== "normal") out.push(nom + " a un espacement de lettres de " + r.espace);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return out;
}

/* ════════ Garde 11 — les niveaux toujours là ════════ */
const NIVEAUX = ["6e", "5e", "4e", "3e"];
function lireListes11(){
  const root = document.getElementById("root");
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const evals = root.querySelector(".eval-row") ? "evaluations" : null;
  const carteRes = Array.from(root.querySelectorAll(".card")).find(c => /📊 Résultats/.test((c.querySelector("h2") || {}).textContent || "") && c.querySelector(".results-eval-row"));
  const liste = evals || (carteRes ? "seances" : null);
  if(!liste) return null;
  // une liste derrière une fenêtre ouverte (l'éditeur, une garde) ne se joue pas
  const couches = Array.from(root.querySelectorAll(".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.fen-fond,.at-modale,.feuille-fond")).filter(vis);
  if(couches.length && !couches[couches.length - 1].querySelector(".eval-row,.results-eval-row")) return null;
  const titres = Array.from(root.querySelectorAll(".niv-titre,[data-niveau]")).filter(vis).map(t => ({t: (t.textContent || "").replace(/\s+/g, " ").trim(), niveau: t.getAttribute("data-niveau"), bouton: t.tagName === "BUTTON"}));
  const tri = Array.from(root.querySelectorAll(".tri-l select,select[data-tri]")).map(s => Array.from(s.options).map(o => o.value + "|" + o.textContent));
  return {liste, titres, tri: tri[0] || []};
}
function garde11Scene(sc, lu){
  const out = [], tag = "garde 11. " + sc.id + " (la liste des " + (lu.liste === "evaluations" ? "évaluations" : "séances") + ")";
  for(const n of NIVEAUX){
    const t = lu.titres.find(x => x.niveau === n || new RegExp("^[▾▸▶▼ ]*" + n + "\\b").test(x.t));
    if(!t){ out.push(tag + " : la section « " + n + " » n'est pas là"); continue; }
    if(/· 0 |vide/.test(t.t) && !/vide pour l'instant/.test(t.t)) out.push(tag + " : la section « " + n + " », vide, ne dit pas « vide pour l'instant » — « " + t.t + " »");
    if(!t.bouton) out.push(tag + " : la section « " + n + " » ne se replie pas (son titre n'est pas un geste)");
  }
  if(lu.liste === "evaluations" && !lu.tri.some(o => /^classe\|/.test(o))) out.push(tag + " : le tri n'a pas « classe » (" + lu.tri.map(o => o.split("|")[1]).join(", ") + ")");
  if(lu.liste === "seances" && !["classe", "date", "evaluation"].every(k => lu.tri.some(o => o.startsWith(k + "|")))) out.push(tag + " : le tri n'a pas « classe, date, évaluation »");
  return out;
}
// 11.3 et 11.4, par le geste : chaque section se replie et se déplie ; le tri « classe » range chaque évaluation sous chaque classe qui l'a passée
async function garde11Gestes(page, sc, lu, moment){
  const out = [], tag = "garde 11. " + sc.id;
  for(const n of NIVEAUX){
    const sel = '.niv-titre[data-niveau="' + n + '"], button.niv-titre:has-text("' + n + '")';
    const loc = page.locator(sel).first(); if(!(await loc.count())) continue;
    const lignes = async () => page.evaluate(n => { const t = Array.from(document.querySelectorAll(".niv-titre")).find(x => x.getAttribute("data-niveau") === n || new RegExp("^[▾▸▶▼ ]*" + n + "\\b").test(x.textContent.trim()));
      const g = t && (t.closest(".niv-groupe") || t.parentElement); return g ? Array.from(g.querySelectorAll(".eval-row,.results-eval-row,.niv-vide")).filter(r => r.getBoundingClientRect().height > 0).length : -1; }, n);
    const a = await lignes(); await loc.click(); await page.waitForTimeout(80); const b = await lignes(); await loc.click(); await page.waitForTimeout(80); const c = await lignes();
    if(!(b !== a && c === a)) out.push(tag + " : la section « " + n + " » ne se replie pas puis ne se déplie pas par le geste (" + a + " → " + b + " → " + c + " lignes)");
  }
  if(lu.liste === "evaluations" && lu.tri.some(o => /^classe\|/.test(o))){
    await page.selectOption(".tri-l select, select[data-tri]", "classe"); await page.waitForTimeout(120);
    const rang = await page.evaluate(() => Array.from(document.querySelectorAll(".eval-row")).filter(r => r.getBoundingClientRect().height > 0).map(r => {
      const titre = (r.querySelector(".eval-titre") || r).textContent.replace(/🔒 Permanente/, "").trim(); let c = r.previousElementSibling;
      while(c && !c.matches(".classe-titre,[data-classe]")) c = c.previousElementSibling;
      const g = r.closest("[data-classe]"); return {titre, classe: g ? g.getAttribute("data-classe") : c ? (c.getAttribute("data-classe") || c.textContent.trim()) : null}; }));
    const evs = SCN.evals();
    for(const e of evs){
      // (complément 3) l'espace insécable de la typographie (changement 6.7) n'est pas une autre lettre
      const passees = SCN.passees(e.id, moment).map(x => x.classe), ici = rang.filter(x => C.normEsp(x.titre).startsWith(C.normEsp(e.titre))).map(x => x.classe && C.normEsp(x.classe));
      const attendu = passees.length ? passees : ["Pas encore passée"];
      for(const cl of attendu) if(!ici.some(x => x && x.indexOf(cl) >= 0)) out.push(tag + " : trié par classe, « " + e.titre.slice(0, 50) + " » n'est pas sous « " + cl + " »");
    }
  }
  return out;
}


/* ════════ Gardes 12 et 15 — la carte des gestes : chaque élément cliquable de chaque scène, cliqué dans une page neuve ════════ */
const COUCHES = ".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.fen-fond,.at-modale,.feuille-fond";
const NOMS_TOUS = C.PERMIS.tous.slice();
const PRENOMS_TOUS = [...new Set(NOMS_TOUS.map(n => n.split(" ").slice(1).join(" ")))].filter(x => x.length > 1);
function argsPage(){ return {noms: NOMS_TOUS, prenoms: PRENOMS_TOUS, titres: SCN.evals().map(e => e.titre).concat([SCN.DEMO.titre]), couches: COUCHES}; }
// Dans la page : chaque élément cliquable, ce qu'il est, l'objet qu'il nomme (l'élève, la tablette, la question, l'évaluation, la séance)
function listerGestes(a){
  const root = document.getElementById("root");
  const vis = e => { const r = e.getBoundingClientRect(); if(r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); return cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
  const lib = e => { const c = e.cloneNode(true); c.querySelectorAll(".info-tip,.info-i").forEach(x => x.remove()); return ((c.textContent || "").replace(/\s+/g, " ").trim() || e.value || e.placeholder || e.getAttribute("aria-label") || "").slice(0, 80); };
  const GESTE = "button,input,select,textarea,a[href],.tel-el,.qdf-c,[role=button],.clv .tc";
  const cands = [], vus = new Set();
  root.querySelectorAll(GESTE).forEach(e => { if(e.closest(".info-tip,.info-i")) return; cands.push(e); vus.add(e); });
  root.querySelectorAll("*").forEach(e => {
    if(vus.has(e) || e.closest(GESTE) || e.closest(".info-tip,.info-i,.deco") || e.querySelector(GESTE)) return;
    if(getComputedStyle(e).cursor === "pointer" && !(e.parentElement && e.parentElement !== root && getComputedStyle(e.parentElement).cursor === "pointer")){ cands.push(e); vus.add(e); }
  });
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const RE_N = new RegExp("(?<![\\p{L}])(" + a.noms.concat(a.prenoms).sort((x, y) => y.length - x.length).map(esc).join("|") + ")(?![\\p{L}])", "u");
  const sorteDe = (e, l) => e.tagName.toLowerCase() + ":" + (l.replace(RE_N, "§").replace(new RegExp(RE_N.source, "gu"), "§").replace(/\d+/g, "#") || (typeof e.className === "string" ? e.className.split(" ")[0] : ""));
  function objetDans(t){ let m;
    if((m = RE_N.exec(t))) return {sorte: "élève", v: m[1]};
    if((m = /Tablette\s*(\d+)/i.exec(t))) return {sorte: "tablette", v: m[1]};
    if((m = /(?<![\p{L}])(?:Q\s?|[Qq]uestion\s)(\d+)(?!\d)/u.exec(t))) return {sorte: "question", v: m[1]};
    for(const ti of a.titres) if(ti && t.includes(ti.slice(0, 28))) return {sorte: "évaluation", v: ti.slice(0, 28)};
    if((m = /(?<!\d)(\d\d\/\d\d)(?!\d)/.exec(t))) return {sorte: "séance", v: m[1]};
    return null; }
  const couches = Array.from(root.querySelectorAll(a.couches)).filter(vis);
  const out = cands.map((e, k) => { e.setAttribute("data-g3", k); const l = lib(e); return {e, k, l, s: sorteDe(e, l)}; });
  return out.map(x => {
    const e = x.e, cs = getComputedStyle(e), r = e.getBoundingClientRect();
    let objet = objetDans(x.l), a2 = e.parentElement, n = 0;
    while(!objet && a2 && a2 !== root && n < 7){
      if(out.some(y => y !== x && y.s === x.s && a2.contains(y.e))) break;
      objet = objetDans((a2.innerText || "").replace(/\s+/g, " ")); a2 = a2.parentElement; n++;
    }
    const decl = e.closest("[data-moment],[data-appareil]");
    const derriere = couches.length > 0 && !couches[couches.length - 1].contains(e);
    return {k: x.k, derriere, tag: e.tagName.toLowerCase(), type: (e.getAttribute("type") || "").toLowerCase(), lib: x.l, sorte: x.s, objet,
      dis: !!(e.disabled || e.closest(".ferme-env") || e.getAttribute("aria-disabled") === "true"), vis: vis(e), ptr: cs.cursor === "pointer",
      geste: e.matches("button,input,select,textarea,a[href],.tel-el,.qdf-c,[role=button],.clv .tc"), lecture: !!(e.readOnly), clv: !!e.closest(".clv,[data-clavier]"),
      fen: couches.some(c => c.contains(e)), editeur: !!(e.closest(".preview") || (e.closest(".modal") && e.closest(".modal").querySelector(".preview"))),
      eleve: !!e.closest(".tablette,.eleve-page,.sim,.grand-tab,.voir-tab-in"), va: e.getAttribute("data-va"),
      moment: decl ? decl.getAttribute("data-moment") : null, appareil: decl ? decl.getAttribute("data-appareil") : null,
      valeurSeule: e.hasAttribute("data-valeur-seule"), fichier: !!(e.querySelector("input[type=file]") || (e.closest("label") && e.closest("label").querySelector("input[type=file]"))), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height)};
  });
}
// Dans la page : l'état de l'écran (où l'on est, ce qui est ouvert, ce qu'on lit, l'évaluation de l'éditeur)
function lireEtat(couchesSel){
  const root = document.getElementById("root");
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const hc = s => { let h = 0; for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };
  let s = root.innerHTML; root.querySelectorAll("input,textarea,select").forEach(e => { s += "|" + e.value + (e.checked ? "1" : "0"); });
  const couches = Array.from(root.querySelectorAll(couchesSel)).filter(vis);
  const texte = root.innerText;
  // l'évaluation de l'éditeur : son texte et ses champs, hors du compteur des modifications
  let ev = null; const pv = root.querySelector(".preview");
  if(pv){ const c = pv.cloneNode(true); c.querySelectorAll(".ed-modif,[data-compteur-modifs]").forEach(x => x.remove()); let v = c.innerText || c.textContent;
    pv.querySelectorAll("input,textarea,select").forEach(e => { v += "|" + e.value + (e.checked ? "1" : "0"); }); const j = root.querySelector("textarea.json"); if(j) v += "|" + j.value; ev = hc(v); }
  const m = /[#&]m=([^&]+)/.exec(location.hash), sc = /scene=([^&]+)/.exec(location.hash);
  return {hash: location.hash, scene: sc ? decodeURIComponent(sc[1]) : null, m: m ? decodeURIComponent(m[1]) : null, empreinte: hc(s), cle: hc(texte), texte,
    couches: couches.length, coucheTexte: couches.length ? couches[couches.length - 1].innerText.slice(0, 2000) : "", ev, ouvert: (window.__G3OUVERT || []).slice(),
    valeurs: Array.from(root.querySelectorAll("input,textarea")).map(e => e.value).join("¦")};
}
const ESPION_G3 = () => { window.__G3OUVERT = []; const note = n => function(){ window.__G3OUVERT.push(n); return null; };
  window.open = note("window.open"); window.print = note("window.print"); window.alert = note("alert"); window.confirm = note("confirm"); window.prompt = note("prompt"); };
// (complément 4) la page est remise à neuf sur place quand elle est déjà la maquette : la scène est démontée et rendue de nouveau
// à son adresse (comme la vérification 5 du banc et l'exploration de la garde 16) ; sinon, elle est chargée
async function recharger(page, url, id){
  if(page.url().indexOf(url) === 0){
    const ok = await page.evaluate(a => { if(typeof rendre !== "function") return false; window.__G3OUVERT = []; window.SOMMAIRE_OUVERT = false; window.SCENE_PRETE = null;
      if(document.activeElement && document.activeElement.blur) document.activeElement.blur(); window.scrollTo(0, 0);
      const cible = "#scene=" + a + "&cap=1"; if(location.hash !== cible) location.hash = cible; else rendre(); return true; }, id).catch(() => false);
    if(ok){ await page.waitForFunction(i => window.SCENE_PRETE === i, baseDe(id), {timeout: 10000}).catch(() => {}); await page.waitForTimeout(30); return; }
  }
  await page.goto("about:blank"); await page.goto(url + "#scene=" + id + "&cap=1");
  await page.waitForFunction(i => window.SCENE_PRETE === i, baseDe(id), {timeout: 10000}).catch(() => {});
  await page.waitForTimeout(30);
}
const FERMER = /^(✕|×|Annuler|Fermer|✕ Fermer|✓ J'ai compris|J'ai compris|OK|Compris|← Retour à la liste)$/;
function objetDansTexte(txt, o){
  if(!o) return true; const t = C.normEsp(txt);
  if(o.sorte === "élève"){ const p = o.v.split(" ").length > 1 && /^[A-ZÀ-ÖØ-Ý' -]+$/.test(o.v.split(" ")[0]) ? o.v.split(" ").slice(1).join(" ") : o.v; return new RegExp("(?<![\\p{L}])" + p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\p{L}])", "u").test(t); }
  if(o.sorte === "tablette") return new RegExp("[Tt]ablette\\s*" + o.v + "(?!\\d)").test(t);
  if(o.sorte === "question") return new RegExp("(?<![\\p{L}])(Q\\s?" + o.v + "|[Qq]uestion\\s" + o.v + ")(?!\\d)", "u").test(t);
  if(o.sorte === "évaluation") return t.includes(C.normEsp(o.v));
  if(o.sorte === "séance") return t.includes(o.v);
  return true;
}
// La carte d'une scène : chaque élément, cliqué (tapé, choisi) dans une page neuve ; ce qu'il fait ; et, pour une fenêtre qu'il ouvre, ce qui la ferme
async function carteScene(page, url, sc, A){
  await recharger(page, url, sc.id);
  const liste = await page.evaluate(listerGestes, A);
  const depart = await page.evaluate(lireEtat, COUCHES);
  const res = [];
  for(const c of liste){
    const r = {c};
    if(!c.vis || c.dis || c.derriere){ res.push(r); continue; }
    await recharger(page, url, sc.id); await page.evaluate(listerGestes, A);
    const loc = page.locator('[data-g3="' + c.k + '"]');
    if(!(await loc.count())){ r.err = "disparu à la remise à neuf"; res.push(r); continue; }
    try { await loc.scrollIntoViewIfNeeded({timeout: 1000}); } catch(e){}
    // la souris déjà posée sur l'élément : le survol n'est pas un effet du clic ; le focus non plus (il est retiré avant la seconde capture)
    const champ = c.tag === "textarea" || c.tag === "select" || (c.tag === "input" && !/^(checkbox|radio|button|submit)$/.test(c.type));
    if(!champ) try { await loc.hover({timeout: 1000}); await page.waitForTimeout(30); } catch(e){}
    const avant = await page.evaluate(lireEtat, COUCHES), img0 = await page.screenshot();
    try {
      if(c.tag === "textarea" || (c.tag === "input" && /^(text|search|number|password|email|tel|)$/.test(c.type))){ await loc.click({timeout: 1500}); await page.keyboard.type("7"); r.tape = true; }
      else if(c.tag === "select"){ const v = await loc.evaluate(s => { const cur = s.value; const o = Array.from(s.options).find(x => x.value !== cur && !x.disabled); return o ? o.value : null; });
        if(v === null){ r.seul = true; res.push(r); continue; } await loc.selectOption(v, {timeout: 1500}); r.choisi = v; }
      else await loc.click({timeout: 1500});
    } catch(e){ r.err = String(e.message || e).split("\n")[0].slice(0, 140); res.push(r); continue; }
    await page.waitForTimeout(90);
    if(!champ) await page.evaluate(() => { const a = document.activeElement; if(a && a !== document.body && !/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) a.blur(); });
    const apres = await page.evaluate(lireEtat, COUCHES), img1 = await page.screenshot();
    r.aller = apres.scene !== baseDe(sc.id) ? apres.scene : null; r.m = apres.m; r.hash = apres.hash;
    r.navigue = apres.hash !== avant.hash; r.ouvre = !r.navigue && apres.couches > avant.couches; r.ferme = apres.couches < avant.couches;
    r.change = apres.empreinte !== avant.empreinte; r.pixels = !img0.equals(img1); r.ouvert = apres.ouvert.length ? apres.ouvert : null;
    r.cle = apres.cle; r.contientObjet = objetDansTexte(apres.couches ? apres.coucheTexte : apres.texte, c.objet);
    r.evChange = avant.ev !== apres.ev; r.valeurChange = avant.valeurs !== apres.valeurs;
    // un menu qui mène à l'écran du choix l'applique aussi : l'écran atteint montre le choix dans son menu
    if(r.choisi !== undefined) r.persiste = r.navigue ? await page.evaluate(v => Array.from(document.querySelectorAll("#root select")).some(s => s.value === v), r.choisi).catch(() => false)
      : await loc.evaluate((s, v) => s.value === v, r.choisi).catch(() => false);
    r.couchesApres = apres.couches;
    // 12.3 : une fenêtre ouverte par ce geste (sur place, ou dans une autre scène qui l'a ouverte) se ferme sur l'écran de départ
    const ouvreFenetre = r.ouvre || (r.navigue && apres.couches > 0 && depart.couches === 0);
    if(ouvreFenetre){
      r.fermetures = [];
      const fermeurs = await page.evaluate(a => { const root = document.getElementById("root"); const cs = Array.from(root.querySelectorAll(a.sel)).filter(e => e.getBoundingClientRect().width > 1); const c = cs[cs.length - 1];
        // le « ✕ » d'un choix, dans l'éditeur, retire le choix : ce n'est pas un bouton qui ferme la fenêtre
        return c ? Array.from(c.querySelectorAll("button")).filter(b => b.getBoundingClientRect().width > 1 && !b.disabled).map((b, i) => ({i, l: (b.innerText || "").replace(/\s+/g, " ").trim(), dedans: !!b.closest(".preview")})).filter(x => a.re.test(x.l) && !x.dedans) : []; }, {sel: COUCHES, re: FERMER}).catch(() => []);
      const essais = [{par: "Échap"}].concat(fermeurs.map(f => ({par: f.l, i: f.i})));
      for(const es of essais){
        await recharger(page, url, sc.id); await page.evaluate(listerGestes, A);
        try { await page.locator('[data-g3="' + c.k + '"]').click({timeout: 1500}); await page.waitForTimeout(60);
          if(es.par === "Échap") await page.keyboard.press("Escape");
          else await page.evaluate(a => { const root = document.getElementById("root"); const cs = Array.from(root.querySelectorAll(a.sel)).filter(e => e.getBoundingClientRect().width > 1); const c = cs[cs.length - 1];
            const b = Array.from(c.querySelectorAll("button")).filter(b => b.getBoundingClientRect().width > 1 && !b.disabled)[a.i]; b.click(); }, {sel: COUCHES, i: es.i});
          await page.waitForTimeout(80);
          const z = await page.evaluate(lireEtat, COUCHES);
          r.fermetures.push({par: es.par, ok: z.scene === baseDe(sc.id) && z.couches === depart.couches && z.cle === depart.cle, ou: z.scene + (z.couches ? " (une fenêtre encore ouverte)" : "")});
        } catch(e){ r.fermetures.push({par: es.par, ok: false, ou: "erreur : " + String(e.message).split("\n")[0].slice(0, 80)}); }
      }
    }
    res.push(r);
  }
  return {liste, depart, res};
}
// 12.4 : aucune destination ne vient d'une table rangée par libellé seul ; ALLER["*"] ne garde que les onglets
function lireAller(){
  const onglets = Array.from(document.querySelectorAll("#root .tabs button, #root .nav2 button, #root [role=tab]")).map(b => (b.innerText || "").replace(/\s+/g, " ").trim());
  let cles = null; try { cles = (typeof ALLER !== "undefined" && ALLER["*"]) ? Object.keys(ALLER["*"]) : []; } catch(e){ cles = []; }
  return {onglets, cles};
}
function garde12Aller(lu, onglets){
  return lu.cles.filter(k => !onglets.has(k)).map(k => "garde 12. ALLER[\"*\"] mène encore par libellé seul : « " + k + " » → " + "(table par libellé)");
}
function garde12Scene(sc, carte, scenesParId){
  const out = [], tag = "garde 12. " + sc.id;
  const mSrc = momentDe(sc), aSrc = appareilDe(sc);
  const groupes = {};
  for(const r of carte.res){
    const c = r.c; if(!c.vis || c.dis || c.derriere || r.err || c.clv) continue;
    const declare = c.moment || c.appareil;
    if(r.navigue){
      const dest = scenesParId[r.aller || baseDe(sc.id)] || null;
      const mDest = r.m || (dest ? momentDe(dest) : null), aDest = dest ? appareilDe(dest) : null;
      const nm = k => k ? k + (SCN.MOMENTS[k] ? " (" + SCN.MOMENTS[k].etape + ")" : "") : "?";
      if(c.moment){ if(mDest !== c.moment) out.push(tag + " : « " + c.lib + " » déclare « " + nm(c.moment) + " » et mène à « " + (r.aller || sc.id) + " », moment " + nm(mDest)); }
      else if(mDest !== mSrc) out.push(tag + " : « " + c.lib + " » mène à « " + (r.aller || sc.id) + " », au moment " + nm(mDest) + ", sans le déclarer (la scène est au moment " + nm(mSrc) + ")");
      if(c.appareil){ if(aDest !== c.appareil) out.push(tag + " : « " + c.lib + " » déclare l'appareil « " + c.appareil + " » et mène à « " + (r.aller || sc.id) + " » (" + aDest + ")"); }
      else if(aDest !== aSrc) out.push(tag + " : « " + c.lib + " » mène d'un appareil à l'autre (" + aSrc + " → " + aDest + ", « " + (r.aller || sc.id) + " ») sans le déclarer");
    } else if(declare && !r.ouvre) out.push(tag + " : « " + c.lib + " » déclare « " + (c.moment || c.appareil) + " » et ne mène nulle part");
    if(r.navigue || r.ouvre){ (groupes[c.sorte] = groupes[c.sorte] || []).push(r); }
    for(const f of r.fermetures || []) if(!f.ok) out.push(tag + " : la fenêtre ouverte par « " + c.lib + " » : « " + f.par + " » ne ramène pas à l'écran d'où on l'a ouverte (→ " + f.ou + ")");
  }
  // 12.2 : deux éléments de même sorte ne mènent jamais au même écran, et l'écran atteint nomme l'objet cliqué
  for(const s in groupes){
    const g = groupes[s]; if(g.length < 2) continue;
    const parCle = {};
    g.forEach(r => { (parCle[r.cle] = parCle[r.cle] || []).push(r); });
    Object.values(parCle).filter(l => l.length > 1).forEach(l => out.push(tag + " : " + l.length + " éléments « " + s.split(":").slice(1).join(":") + " » mènent au même écran (" + (l[0].aller || "sur place") + ") — " + [...new Set(l.map(r => r.c.objet ? r.c.objet.v : r.c.lib))].slice(0, 5).map(x => "« " + x + " »").join(", ")));
    g.filter(r => r.c.objet && !r.contientObjet).forEach(r => out.push(tag + " : « " + r.c.lib + " » (" + r.c.objet.sorte + " « " + r.c.objet.v + " ») mène à un écran qui ne le nomme pas (" + (r.aller || "sur place") + ")"));
  }
  return [...new Set(out)];
}
// 15.1, 15.2, 15.3 (clavier de l'ordinateur), 15.6 : chaque élément, cliqué, change l'écran
function garde15Scene(sc, carte){
  const out = [], tag = "garde 15. " + sc.id, rang = {};
  for(const r of carte.res){
    const c = r.c; if(!c.vis || c.dis || c.derriere) continue;
    if(r.err){ out.push(tag + " : « " + c.lib + " » ne se clique pas (" + r.err + ")"); continue; }
    if(r.seul) continue;
    let pb = null;
    if(r.tape){ if(!r.valeurChange && !c.lecture) pb = "le champ « " + (c.lib || "sans nom") + " » ne change pas de valeur au clavier de l'ordinateur";
      else if(c.lecture && !c.clv && !r.valeurChange) pb = "le champ « " + (c.lib || "sans nom") + " » ne se tape pas (lecture seule)"; }
    else if(c.tag === "select"){ if(!r.persiste) pb = "le menu « " + c.lib.slice(0, 40) + " » n'applique pas le choix « " + r.choisi + " »";
      else if(!r.navigue && !r.ouvre && r.change === false && !c.valeurSeule && !r.pixels) pb = "le menu « " + c.lib.slice(0, 40) + " » : le choix ne change rien à l'écran"; }
    else {
      // un sélecteur de fichier ouvre la fenêtre du système, hors de la page
      const effet = r.navigue || r.ouvre || r.ferme || r.pixels || r.ouvert || c.fichier;
      if(!effet) pb = c.eleve ? "côté élève, « " + c.lib + " » cliqué ne se voit pas (pixels identiques)" : (!c.geste && c.ptr) ? "« " + c.lib + " » a la main au survol mais n'agit pas" : c.clv ? "la touche « " + c.lib + " » du clavier de l'app ne tape pas" : "« " + c.lib + " » ne change rien à l'écran (pixels identiques)";
      // les gestes de l'éditeur qui changent l'évaluation (changement 7.1) ; « 🔍 Vérifier », « Copier », « Enregistrer » la relisent ou la gardent
      else if(c.editeur && !/Vérifier|Copier|Enregistrer|Imprimer/.test(c.lib) && !r.navigue && !r.ouvre && !r.ferme && !r.evChange) pb = "dans l'éditeur, « " + c.lib + " » ne change pas l'évaluation (seul le compteur bouge)";
    }
    if(pb){ const k = pb.replace(/« [^»]* »/g, "«…»"); (rang[k] = rang[k] || []).push(pb); }
  }
  // un relevé par sorte de défaut, avec les premiers exemples : la sortie se lit
  Object.values(rang).forEach(l => out.push(tag + " : " + (l.length > 1 ? l.length + " × " : "") + l[0] + (l.length > 1 ? " (et « " + [...new Set(l.slice(1).map(x => (/« ([^»]*) »/.exec(x) || [, ""])[1]))].slice(0, 4).join(" », « ") + " »)" : "")));
  return out;
}
// 15.3 (le clavier de l'app), 15.4 (Échap ferme chaque fenêtre), 15.5 (une garde avant de perdre des modifications)
async function garde15Gestes(page, url, sc){
  const out = [], tag = "garde 15. " + sc.id;
  await recharger(page, url, sc.id);
  // le clavier de l'app : ses touches sont des boutons, chacune tape dans le champ en cours, « ⌫ » efface, « ✓ » fait comme « Entrer → »
  const claviers = await page.evaluate(() => Array.from(document.querySelectorAll("#root .clv,#root [data-clavier]")).filter(c => c.getBoundingClientRect().width > 1).length);
  for(let i = 0; i < claviers; i++){
    await recharger(page, url, sc.id);
    const info = await page.evaluate(i => { const c = Array.from(document.querySelectorAll("#root .clv,#root [data-clavier]")).filter(c => c.getBoundingClientRect().width > 1)[i];
      const touches = Array.from(c.querySelectorAll(".tc,button")); return {n: touches.length, boutons: touches.filter(t => t.tagName === "BUTTON").length, libs: touches.map(t => t.textContent.trim())}; }, i);
    if(info.boutons < info.n) out.push(tag + " : le clavier de l'app n° " + (i + 1) + " : " + (info.n - info.boutons) + " touches sur " + info.n + " ne sont pas des boutons");
    const valeurs = () => page.evaluate(i => { const c = Array.from(document.querySelectorAll("#root .clv,#root [data-clavier]")).filter(c => c.getBoundingClientRect().width > 1)[i];
      const f = c.closest(".eleve-form,.tab-half,.moitie,.eleve-card,.eleve-page") || c.parentElement; return Array.from(f.querySelectorAll("input,.codebox,[data-champ]")).map(x => x.value !== undefined ? x.value : x.textContent).join("¦"); }, i);
    const cliquer = l => page.evaluate(a => { const c = Array.from(document.querySelectorAll("#root .clv,#root [data-clavier]")).filter(c => c.getBoundingClientRect().width > 1)[a.i];
      const t = Array.from(c.querySelectorAll(".tc,button")).find(x => x.textContent.trim() === a.l); if(t){ t.dispatchEvent(new MouseEvent("mousedown", {bubbles: true})); t.click(); return true; } return false; }, {i, l});
    const lettre = info.libs.find(l => /^[a-z0-9]$/.test(l));
    const v0 = await valeurs(); await cliquer(lettre); await page.waitForTimeout(40); const v1 = await valeurs();
    if(v1 === v0) out.push(tag + " : le clavier de l'app n° " + (i + 1) + " : la touche « " + lettre + " » n'écrit rien dans le champ en cours");
    else { await cliquer("⌫"); await page.waitForTimeout(40); const v2 = await valeurs(); if(v2 !== v0) out.push(tag + " : le clavier de l'app n° " + (i + 1) + " : « ⌫ » n'efface pas la dernière touche"); }
    if(info.libs.includes("✓")){
      const fin = async l => { await recharger(page, url, sc.id); // « Entrer » : celui de la moitié du clavier (une tablette a deux moitiés, chacune son clavier et son « Entrer »)
        const ok = l === "✓" ? await cliquer("✓") : await page.evaluate(i => { const c = Array.from(document.querySelectorAll("#root .clv,#root [data-clavier]")).filter(c => c.getBoundingClientRect().width > 1)[i];
          const zone = c.closest(".moitie,.eleve-card,.eleve-page") || document; const b = Array.from(zone.querySelectorAll("button")).find(x => /^Entrer/.test(x.textContent.trim())); if(b){ b.click(); return true; } return false; }, i);
        await page.waitForTimeout(80); return ok ? (await page.evaluate(lireEtat, COUCHES)).cle : null; };
      const a = await fin("✓"), b = await fin("Entrer");
      if(b !== null && a !== b) out.push(tag + " : le clavier de l'app n° " + (i + 1) + " : « ✓ » ne fait pas la même chose que « Entrer → »");
    }
  }
  // Échap ferme chaque fenêtre ouverte à l'arrivée sur la scène
  await recharger(page, url, sc.id);
  const e0 = await page.evaluate(lireEtat, COUCHES);
  if(e0.couches > 0){
    await page.keyboard.press("Escape"); await page.waitForTimeout(80);
    const e1 = await page.evaluate(lireEtat, COUCHES);
    const ferme = e1.couches < e0.couches || (e1.scene !== baseDe(sc.id) && e1.couches === 0);
    if(!ferme) out.push(tag + " : Échap ne ferme pas la fenêtre « " + e0.coucheTexte.replace(/\s+/g, " ").slice(0, 60) + " »");
    // une fenêtre qui s'enregistre : après une modification, ✕ et Échap ouvrent une garde avant de la fermer
    const aEnregistrer = /Enregistrer/.test(e0.coucheTexte);
    if(aEnregistrer){
      for(const par of ["Échap", "✕"]){
        await recharger(page, url, sc.id);
        const champ = page.locator("#root " + COUCHES.split(",").map(s => s + " textarea:not([readonly]), #root " + s + " input[type=text]:not([readonly]), #root " + s + " input:not([type]):not([readonly])").join(", #root ")).first();
        if(!(await champ.count())) break;
        try { await champ.click({timeout: 1000}); await page.keyboard.type(" 7"); } catch(e){ break; }
        await page.waitForTimeout(40);
        const a = await page.evaluate(lireEtat, COUCHES);
        if(par === "Échap") await page.keyboard.press("Escape");
        else { const x = page.locator("#root .modal-close, #root button:text-is('✕')").first(); if(!(await x.count())) continue; await x.click(); }
        await page.waitForTimeout(80);
        const b = await page.evaluate(lireEtat, COUCHES);
        const garde = b.couches >= a.couches && b.scene === a.scene && b.cle !== a.cle && /\?/.test(b.coucheTexte);
        if(!garde) out.push(tag + " : la fenêtre « " + e0.coucheTexte.replace(/\s+/g, " ").slice(0, 50) + " », modifiée, se ferme par « " + par + " » sans garde (les modifications sont perdues)");
      }
    }
  }
  return out;
}

/* ════════ Garde 13 — une seule séance, les mêmes chiffres partout ════════ */
function lireChiffres13(a){
  const root = document.getElementById("root");
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const RE_N = new RegExp("(?<![\\p{L}])(" + a.noms.concat(a.prenoms).sort((x, y) => y.length - x.length).map(esc).join("|") + ")(?![\\p{L}])", "gu");
  // le texte d'une ligne, ses cellules séparées ; sans les boutons (« ⛔ à Michel » n'est pas un état), sauf ceux qui portent un nom d'élève
  const sansBoutons = e => { const c = e.cloneNode(true); c.querySelectorAll(".info-tip,select,option").forEach(x => x.remove());
    c.querySelectorAll("button").forEach(x => { if(!new RegExp(RE_N.source, "u").test(x.textContent)) x.remove(); });
    c.querySelectorAll("*").forEach(x => x.appendChild(document.createTextNode(" "))); return (c.textContent || "").replace(/\s+/g, " ").trim(); };
  const nomsDans = t => [...new Set((t.match(RE_N) || []))];
  // les lignes d'élève : une ligne de tableau, une moitié de tablette, une ligne du téléphone, une ligne de liste, une tuile
  const lignes = [];
  root.querySelectorAll("tr,.tab-mini-m,.tel-el,li,[data-eleve],.tuile,.res-l,.bilan-l").forEach(e => {
    if(!vis(e) || e.closest(".tablette,.eleve-page")) return; const t = sansBoutons(e); const n = nomsDans(t); if(n.length !== 1) return;
    lignes.push({nom: n[0], t, sorte: e.tagName === "TR" ? "tableau" : e.classList.contains("tab-mini-m") ? "tuile" : e.classList.contains("tel-el") ? "téléphone" : "liste", eleve: e.getAttribute("data-eleve")});
  });
  // les tableaux : les en-têtes et les cellules
  const tableaux = Array.from(root.querySelectorAll("table")).filter(vis).map(t => {
    const ths = Array.from(t.querySelectorAll("thead th, tr:first-child th")).map(x => (x.innerText || "").replace(/\s+/g, " ").trim());
    // l'élève d'une ligne : le nom de sa première cellule qui en porte un (les autres cellules peuvent citer son voisin)
    const rows = Array.from(t.querySelectorAll("tbody tr, tr")).filter(r => r.querySelector("td")).map(r => { const cells = Array.from(r.children).map(x => sansBoutons(x)); const c0 = cells.find(c => nomsDans(c).length); const n = c0 ? nomsDans(c0) : []; return n.length === 1 ? {nom: n[0], cells} : null; }).filter(Boolean);
    return {ths, rows};
  });
  // « À lire sur les feuilles » et « À lire sur la feuille » : la section, ligne à ligne
  const aLire = [];
  Array.from(root.querySelectorAll("*")).filter(e => vis(e) && !e.closest("table") && Array.from(e.childNodes).some(n => n.nodeType === 3 && /À lire sur (les feuilles|la feuille)/.test(n.nodeValue))).forEach(h => {
    let s = h, k = 0; while(s.parentElement && s.parentElement !== root && k < 4 && !/(?<![\p{L}])Q\s?\d/u.test((s.innerText || "").replace((h.innerText || ""), ""))){ s = s.parentElement; k++; }
    aLire.push({titre: (h.innerText || "").replace(/\s+/g, " ").trim().slice(0, 80), lignes: (s.innerText || "").split("\n").map(x => x.trim()).filter(Boolean)});
  });
  const fin = Array.from(root.querySelectorAll(".fin-prevue,[data-fin-prevue]")).filter(vis).map(e => (e.innerText || "").replace(/\s+/g, " ").trim());
  const pv = root.querySelector(".preview");
  const editeur = pv ? {titre: ((pv.querySelector(".preview-titre-input") || {}).value || ""), meta: ((pv.querySelector(".preview-titre-meta") || {}).innerText || ""),
    enonces: Array.from(pv.querySelectorAll(".preview-q-enonce-input")).map(x => x.value), json: ((root.querySelector("textarea.json") || {}).value || "")} : null;
  const evalLignes = Array.from(root.querySelectorAll(".eval-row")).filter(vis).map(e => (e.innerText || "").replace(/\s+/g, " ").trim());
  const feuille = root.querySelector(".feuille-a4") ? {titre: ((root.querySelector(".feuille-a4 h1") || {}).innerText || ""), texte: root.querySelector(".feuille-a4").innerText} : null;
  return {texte: root.innerText, lignes, tableaux, aLire, fin, editeur, evalLignes, feuille};
}
function prenomDe(n){ const p = n.split(" "); return p.length > 1 && /^[A-ZÀ-ÖØ-Ý' -]+$/.test(p[0]) ? p.slice(1).join(" ") : n; }
const DATES_CAL = () => { const d = new Set(); SCN.SEANCES.forEach(s => { [s.date, s.fin, s.rendues, s.reprise].filter(Boolean).forEach(x => d.add(x.slice(0, 5))); });
  SCN.CORBEILLE.forEach(x => d.add(x.quand.slice(0, 5))); SCN.evals().forEach(e => e.cree && d.add(e.cree.slice(0, 5))); Object.values(SCN.MOMENTS).forEach(m => d.add(m.date.slice(0, 5))); return d; };
function garde13Scene(sc, lu){
  const out = [], tag = "garde 13. " + sc.id, k = momentDe(sc), M = SCN.MOMENTS[k];
  if(!M) return out;
  const s08 = M.seance === "S08" && SCN.rang(k) >= 0;
  const txt = C.normEsp(lu.texte);
  // 13.1 : la note de chaque élève, partout où elle s'affiche, quand toutes ses questions sont corrigées
  if(s08){
    for(const l of lu.lignes){
      const p = prenomDe(l.nom); if(!SCN.RT[p]) continue;
      const nt = SCN.note(p, k), au = SCN.autonomie(p, k);
      const m = /(?<![\d,])(\d+)\s?\/\s?(\d+)(?![\d,])/.exec(l.t);
      if(m && nt.complet && +m[2] === nt.total && +m[1] !== nt.n) out.push(tag + " : " + l.nom + " à " + m[1] + " / " + m[2] + " (" + l.sorte + ") ; le scénario dit " + nt.n + " / " + nt.total + " à ce moment (" + M.etape + ")");
      const m20 = /(\d+(?:,\d)?)\s?\/\s?20/.exec(l.t);
      if(m20 && nt.complet && m20[1] !== SCN.fr1(nt.sur20)) out.push(tag + " : " + l.nom + " à " + m20[1] + " / 20 (" + l.sorte + ") ; le scénario dit " + SCN.fr1(nt.sur20) + " / 20");
    }
    for(const t of lu.tableaux){
      const iAut = t.ths.findIndex(x => /Autonomie/.test(x)), iQ = t.ths.map((x, i) => /^Q\s?(\d)\b/.test(x) ? i : -1).filter(i => i >= 0);
      const iNote = t.ths.findIndex(x => /^Note\b/.test(x)), i20 = t.ths.findIndex(x => /Sur 20/.test(x)), iLire = t.ths.findIndex(x => /À lire sur la feuille/.test(x));
      if(iLire >= 0){ const att = SCN.aLire(k).filter(x => !x.lue || true), cleA = new Set(att.map(x => x.p + "·Q" + (x.q + 1))), vus = new Set();
        t.rows.forEach(r => { const p = prenomDe(r.nom); const c = r.cells[iLire] || ""; let m; const rq = /(?<![\p{L}])Q\s?(\d)/gu; while((m = rq.exec(c))) vus.add(p + "·Q" + m[1]); });
        const manque = [...cleA].filter(x => !vus.has(x)), trop = [...vus].filter(x => !cleA.has(x));
        if(manque.length || trop.length) out.push(tag + " : la colonne « À lire sur la feuille » a " + vus.size + " lignes ; le scénario en a " + cleA.size + " à ce moment" + (manque.length ? " — il manque " + manque.join(", ") : "") + (trop.length ? " — en trop " + trop.join(", ") : "")); }
      for(const r of t.rows){
        const p = prenomDe(r.nom); if(!SCN.RT[p]) continue; const nt = SCN.note(p, k), au = SCN.autonomie(p, k);
        if(iNote >= 0 && nt.complet){ const m = /(\d+)\s?\/\s?(\d+)/.exec(r.cells[iNote] || ""); if(m && (+m[1] !== nt.n || +m[2] !== nt.total)) out.push(tag + " : " + r.nom + " à « " + m[0] + " » dans le tableau ; le scénario dit " + nt.n + " / " + nt.total + " à ce moment (" + M.etape + ")"); }
        if(i20 >= 0 && nt.complet){ const v = (r.cells[i20] || "").trim(); if(v && v !== SCN.fr1(nt.sur20)) out.push(tag + " : " + r.nom + " à « " + v + " » sur 20 dans le tableau ; le scénario dit " + SCN.fr1(nt.sur20)); }
        if(iAut >= 0 && r.cells[iAut] !== undefined){ const c = r.cells[iAut];
          if(au.retire && !/⛔|retir/i.test(c)) out.push(tag + " : " + r.nom + ", point d'autonomie retiré " + au.quand + ", a « " + c.slice(0, 40) + " » dans la colonne « 🤝 Autonomie »");
          if(!au.retire && /⛔|retir/i.test(c)) out.push(tag + " : " + r.nom + " a son point d'autonomie retiré dans la colonne « 🤝 Autonomie » ; le scénario ne l'a pas retiré"); }
        iQ.forEach((ci, j) => { const q = +/^Q\s?(\d)/.exec(t.ths[ci])[1] - 1, st = nt.st[q], c = r.cells[ci] || ""; if(st === undefined || st === "n" || !c) return;
          const vu = /✗|❌/.test(c) ? "f" : /✓/.test(c) ? "j" : /∅/.test(c) ? "a" : null; const att = st === "t" || st === "j" ? "j" : "f";
          if(vu && (vu === "a" ? "f" : vu) !== att) out.push(tag + " : " + r.nom + ", Q" + (q + 1) + " : « " + c.slice(0, 20) + " » ; le scénario dit « " + ({j: "juste", t: "trouvée au dernier moment", f: "faux", a: "aucun de ces choix"})[st] + " »"); });
      }
    }
    // les tuiles et le téléphone : le point retiré s'y voit
    for(const l of lu.lignes.filter(x => x.sorte === "tuile" || x.sorte === "téléphone")){
      const p = prenomDe(l.nom); if(!SCN.RT[p]) continue; const au = SCN.autonomie(p, k);
      if(au.retire && !/⛔|retir/i.test(l.t)) out.push(tag + " : " + l.nom + ", point d'autonomie retiré " + au.quand + ", n'a pas « ⛔ » sur sa " + (l.sorte === "tuile" ? "moitié de tablette" : "ligne du téléphone"));
      if(!au.retire && /⛔/.test(l.t)) out.push(tag + " : " + l.nom + " a « ⛔ » sur sa " + (l.sorte === "tuile" ? "moitié de tablette" : "ligne du téléphone") + " ; le scénario ne lui a pas retiré son point");
    }
  }
  // le bilan d'une élève, côté élève (e-…, t-bilan…) : « n / 3 » est sa note
  if(/^e-bilan|^t-bilan/.test(sc.id) || /^e-mes-evals/.test(sc.id)){
    const noms = [...new Set((lu.texte.match(new RegExp("(?<![\\p{L}])(" + PRENOMS_TOUS.join("|") + ")(?![\\p{L}])", "gu")) || []))].filter(p => SCN.RT[p]);
    if(/^e-/.test(sc.id) && noms.length >= 1){
      const p = noms[0], nt = SCN.note(p, k);
      const lignesEssai = lu.texte.split("\n").filter(x => /Évaluation d'essai/.test(x) || /\d\s?\/\s?3\b/.test(x));
      for(const x of lignesEssai){ const m = /(?<![\d,])(\d)\s?\/\s?3(?![\d,])/.exec(x); if(m && nt.complet && +m[1] !== nt.n) out.push(tag + " : le bilan de " + p + " dit " + m[1] + " / 3 ; le scénario dit " + nt.n + " / 3 à ce moment (" + M.etape + ")"); }
    }
  }
  // 13.2 : les comptes
  const cpt = SCN.compteurs(k);
  const verif2 = (re, att, nom) => { if(!att) return; let m; const r = new RegExp(re.source, "g"); while((m = r.exec(txt))) if(+m[1] !== att[0] || +m[2] !== att[1]) out.push(tag + " : « " + m[0] + " » ; le scénario dit " + att[0] + " / " + att[1] + " " + nom + " (" + M.etape + ")"); };
  if(s08 || M.seance === "S08"){
    verif2(/(\d+)\s?\/\s?(\d+) ont répondu/, M.ph === "lecture" ? cpt.lus : cpt.repondu, M.ph === "lecture" ? "feuilles lues" : "ont répondu");
    verif2(/Question (\d+)\s?\/\s?(\d+)/, cpt.question, "pour « Question n / m »");
    verif2(/(\d+)\s?\/\s?(\d+) feuilles lues/, cpt.lus, "feuilles lues");
    if(cpt.manquent){ let m; const r = /Il en manque (\d+)/g; while((m = r.exec(txt))) if(+m[1] !== cpt.manquent.length) out.push(tag + " : « " + m[0] + " » ; le scénario dit " + cpt.manquent.length + " (" + cpt.manquent.join(", ") + ")"); }
    if(["reponse", "lecture", "revele", "close", "b", "coeval", "estim", "att2"].includes(M.ph)){ let m; const r = /(\d+) présents/g; while((m = r.exec(txt))) if(+m[1] !== cpt.presents) out.push(tag + " : « " + m[0] + " » ; le scénario dit " + cpt.presents + " présents"); }
  }
  // « n feuilles à lire » : les lignes encore à lire au moment de la scène (une séance rendue n'en a plus)
  if(SCN.rang(k) >= SCN.rang("S08:corr:Q2:V")){
    lu.texte.split("\n").forEach(l => { const m = /(\d+) feuilles? à lire(?! sont lues)/.exec(l); if(!m) return;
      const autre = SCN.SEANCES.find(x => x.id !== "S08" && x.date && l.includes(x.date.slice(0, 5)));
      const att = autre ? (autre.rendues ? 0 : null) : SCN.aLire(k).filter(x => !x.lue).length;
      if(att !== null && +m[1] !== att) out.push(tag + " : « " + m[0] + " »" + (autre ? " pour la séance du " + autre.date.slice(0, 5) + ", dont les copies sont rendues" : "") + " ; le scénario dit " + att + " à ce moment (" + M.etape + ")"); });
  }
  // 13.3 : « À lire sur les feuilles » : les mêmes lignes que le scénario
  if(s08 && lu.aLire.length){
    const att = SCN.aLire(k), cleA = new Set(att.map(x => x.p + "·Q" + (x.q + 1)));
    for(const s of lu.aLire){
      const vus = new Set();
      s.lignes.forEach(l => { const n = (l.match(new RegExp("(?<![\\p{L}])(" + PRENOMS_TOUS.join("|") + ")(?![\\p{L}])", "u")) || [])[1]; const q = (/(?<![\p{L}])Q\s?(\d)/u.exec(l) || [])[1]; if(n && q) vus.add(n + "·Q" + q); });
      if(!vus.size) continue;
      const manque = [...cleA].filter(x => !vus.has(x)), trop = [...vus].filter(x => !cleA.has(x));
      if(manque.length || trop.length) out.push(tag + " : « " + s.titre.slice(0, 40) + " » a " + vus.size + " lignes ; le scénario en a " + cleA.size + " à ce moment" + (manque.length ? " — il manque " + manque.join(", ") : "") + (trop.length ? " — en trop " + trop.join(", ") : ""));
    }
  }
  // 13.4 : chaque date affichée vient du calendrier, et aucune n'est après le moment de la scène
  const CAL = DATES_CAL(), cleM = SCN.cle(M.date, "00:00").slice(0, 8);
  let m; const rd = /(?<![\d\/])(\d\d)\/(\d\d)(?:\/(\d{4}))?(?![\d\/])/g;
  const avant = s => txt.slice(Math.max(0, s - 40), s);
  while((m = rd.exec(txt))){
    const d = m[1] + "/" + m[2]; if(+m[2] > 12 || +m[1] > 31) continue;
    const an = m[3] || "2026"; if(an !== "2026") continue;
    const ctx = avant(m.index), apres = txt.slice(m.index + m[0].length, m.index + m[0].length + 8);
    // une date, pas un compte (« 10/12 ont répondu ») : précédée de « le », « du », « au »…, ou avec son année, ou suivie d'une heure
    if(!m[3] && !/(?:^|[\s(])(le|du|au|Le|Du|depuis|dès|jusqu'au|Créée le|Rendues le)\s$/.test(ctx) && !/^\s*(à\s)?\d\d[:h]\d\d/.test(apres) && !/[·—]\s$/.test(ctx)) continue;
    if(/^\d\d\/\d\d$/.test(d) && /prévu|planifi|rattrapage|à venir|Rattrapage/.test(ctx)) continue;
    if(!CAL.has(d) && +m[2] >= 9) out.push(tag + " : la date « " + m[0] + " » n'est pas dans le calendrier du scénario — « …" + ctx.slice(-30) + m[0] + " »");
    const c2 = an + m[2] + m[1];
    if(c2 > cleM && !/prévu|planifi|à venir|Rattrapage|rattrapage|12\/10/.test(ctx + d)) out.push(tag + " : la date « " + m[0] + " » est après le moment de la scène (" + M.date + ") — « …" + ctx.slice(-30) + m[0] + " »");
  }
  const demo = /Démo faite le (\d\d\/\d\d)/.exec(txt); if(demo && demo[1] !== SCN.seance("DEMO").date.slice(0, 5)) out.push(tag + " : « " + demo[0] + " » ; la démo est faite le " + SCN.seance("DEMO").date.slice(0, 5));
  const rep = /Reprendre la s(?:éance|ession) du (\d\d\/\d\d)/.exec(txt); if(rep && M.seance && SCN.seance(M.seance) && rep[1] !== SCN.seance(M.seance).date.slice(0, 5)) out.push(tag + " : « " + rep[0] + " » ; la séance reprise est celle du " + SCN.seance(M.seance).date.slice(0, 5));
  // 13.5 : la fin prévue, à l'arrivée
  const fp = SCN.finPrevue(k);
  for(const f of lu.fin){ const h = /(\d{1,2})[:h](\d\d)/.exec(f); if(h && fp && (+h[1]) * 60 + (+h[2]) !== Math.round(fp.sec / 60) && Math.abs((+h[1]) * 60 + (+h[2]) - Math.round(fp.sec / 60)) > 1) out.push(tag + " : la fin prévue dit « " + h[0] + " » ; la somme des temps du scénario donne " + fp.hm); }
  // 13.6 : le contenu d'une évaluation, le même dans la liste, l'éditeur et la feuille
  const evs = SCN.evals().concat([SCN.DEMO]);
  for(const l of lu.evalLignes){ const e = evs.find(x => l.startsWith(x.titre.slice(0, 40))); const q = /(\d+) questions/.exec(l);
    if(e && q && +q[1] !== e.questions.length) out.push(tag + " : la liste dit « " + q[0] + " » pour « " + e.titre.slice(0, 50) + " » ; elle en a " + e.questions.length); }
  if(lu.editeur && lu.editeur.titre){
    const e = evs.find(x => C.normEsp(x.titre) === C.normEsp(lu.editeur.titre));
    if(e){ const q = /(\d+) questions/.exec(lu.editeur.meta); if(q && +q[1] !== e.questions.length) out.push(tag + " : l'éditeur dit « " + q[0] + " » pour « " + e.titre.slice(0, 50) + " » ; elle en a " + e.questions.length);
      const siens = new Set(e.questions.map(x => C.normEsp(x.enonce)));
      lu.editeur.enonces.forEach(en => { if(siens.has(C.normEsp(en))) return; const autre = evs.find(x => x !== e && x.questions.some(y => C.normEsp(y.enonce) === C.normEsp(en))); if(autre) out.push(tag + " : l'éditeur de « " + e.titre.slice(0, 40) + " » montre une question de « " + autre.titre.slice(0, 40) + " » — « " + en.slice(0, 60) + " »"); });
      if(lu.editeur.json && !lu.editeur.json.includes(e.questions[0].enonce.slice(0, 30))) out.push(tag + " : le champ « JSON de l'évaluation » ne montre pas le JSON de « " + e.titre.slice(0, 40) + " »"); }
  }
  if(lu.feuille){ const e = evs.find(x => C.normEsp(x.titre) === C.normEsp(lu.feuille.titre));
    if(e) e.questions.forEach((q, i) => { if(!C.normEsp(lu.feuille.texte).includes(C.normEsp(q.enonce).slice(0, 50))) out.push(tag + " : la feuille de « " + e.titre.slice(0, 40) + " » n'a pas la question " + (i + 1) + " — « " + q.enonce.slice(0, 60) + " »"); }); }
  return [...new Set(out)];
}
// 13.5, par le geste : la fin prévue bouge quand un temps bouge (la réflexion de la question 3 passée à 90 s)
async function garde13Fin(page, url, sc){
  const out = [], k = momentDe(sc);
  await recharger(page, url, sc.id);
  const lire = () => page.evaluate(() => { const f = document.querySelector("#root .fin-prevue,#root [data-fin-prevue]"); return f ? f.innerText.replace(/\s+/g, " ") : null; });
  const f0 = await lire(); if(!f0) return out;
  let champ = page.locator('#root [data-q="3"][data-temps="reflexion"]');
  if(!(await champ.count())){ const n = await page.locator("#root .pilot-q-mini input").count(); if(n < 2) return out; champ = page.locator("#root .pilot-q-mini input").nth(n - 2); }
  // la question 3 déjà posée : son temps de réflexion ne se change plus (le champ est fermé), il n'y a rien à jouer
  if(!(await champ.first().isEnabled().catch(() => false))) return out;
  try { await champ.first().fill("90"); await champ.first().press("Tab"); } catch(e){ out.push("garde 13. " + sc.id + " : la réflexion de la question 3 ne se tape pas (" + String(e.message).split("\n")[0].slice(0, 60) + ")"); return out; }
  await page.waitForTimeout(80);
  const f1 = await lire();
  const att = SCN.finPrevue(k, {2: {reflexion: 90}}), att0 = SCN.finPrevue(k);
  if(f1 === f0 && att && att0 && att.hm !== att0.hm) out.push("garde 13. " + sc.id + " : la réflexion de Q3 passée à 90 s, la fin prévue ne bouge pas (« " + f0.slice(0, 50) + " » ; le scénario donne " + att.hm + ")");
  else if(att){ const h = /(\d{1,2})[:h](\d\d)/.exec(f1 || ""); if(h && Math.abs((+h[1]) * 60 + (+h[2]) - Math.round(att.sec / 60)) > 1) out.push("garde 13. " + sc.id + " : la réflexion de Q3 passée à 90 s, la fin prévue dit « " + h[0] + " » ; le scénario donne " + att.hm); }
  return out;
}
// 13.7 : aucune scène ne force un résultat : une note ou un compte écrit en dur pour un élève, dans les sources (hors du scénario)
function garde13Sources(html){
  const out = [];
  let src = html; const d = src.indexOf("var SCN = (function(){"), f = src.indexOf('if(typeof module !== "undefined") module.exports = SCN;');
  if(d >= 0 && f > d) src = src.slice(0, d) + src.slice(f);
  const P = PRENOMS_TOUS.concat(NOMS_TOUS).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re1 = new RegExp("===?\\s*\"(" + P + ")\"[\\s\\S]{0,160}?(pts\\s*[:=]\\s*\\[|note\\s*[:=]\\s*\\d|sur20\\s*[:=]\\s*\\d|\\bn\\s*:\\s*\\d)", "gu");
  const re2 = new RegExp("\"(" + P + ")\"\\s*[:,]\\s*\\{?[^}\\n]{0,40}?\\b(pts|note|n)\\s*:\\s*\\[?\\d", "gu");
  const re3 = new RegExp("\"[^\"\\n]{0,40}(?<![\\p{L}])(" + P + ")(?![\\p{L}])[^\"\\n]{0,30}\\b\\d{1,2}\\s?\\/\\s?(3|20)\\b[^\"\\n]{0,30}\"", "gu");
  // un compte écrit en dur pour une question : plusieurs « n/m » à la suite dans un appel (« statsQ("24/24", "10/12", …) »)
  const re4 = /\(\s*"(\d+\s?\/\s?\d+)"\s*,\s*"(?:\d+\s?\/\s?\d+|—)"[^)\n]{0,60}\)/g;
  { let m; while((m = re4.exec(src))){ const l = src.slice(0, m.index).split("\n").length; out.push("garde 13. un compte écrit en dur (ligne " + l + " du fichier) — « " + src.slice(Math.max(0, m.index - 12), m.index + m[0].length).slice(0, 110) + " »"); } }
  for(const re of [re1, re2, re3]){ let m; while((m = re.exec(src))){ const l = src.slice(0, m.index).split("\n").length; out.push("garde 13. une note écrite en dur pour " + m[1] + " (ligne " + l + " du fichier) — « " + m[0].slice(0, 110) + " »"); } }
  return [...new Set(out)];
}

/* ════════ Garde 14 — tout se lit et tout s'atteint ════════ */
let CLASSES_SITE = null;
function classesSite(){
  if(CLASSES_SITE) return CLASSES_SITE;
  CLASSES_SITE = new Set();
  ["evaluation-qcm.html", "index.html", "correction_dictee.html"].forEach(f => { const t = lire(path.join(PROD, f));
    (t.match(/\.[a-zA-Z][\w-]*/g) || []).forEach(c => CLASSES_SITE.add(c.slice(1)));
    (t.match(/class(?:Name)?\s*=\s*["'][^"']+["']/g) || []).forEach(c => c.replace(/^[^"']+["']|["']$/g, "").split(/\s+/).forEach(x => CLASSES_SITE.add(x))); });
  return CLASSES_SITE;
}
function lireLisibilite(a){
  const root = document.getElementById("root"), site = new Set(a.site);
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
  const court = s => (s || "").replace(/\s+/g, " ").trim().slice(0, 50);
  const nom = e => e.tagName.toLowerCase() + (typeof e.className === "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
  const R = {inatteignable: [], defile: [], petit: [], contraste: [], emoji: [], ponctuation: [], tableau: a.tableau};
  // 14.1 : une fenêtre fixe plus haute que l'écran, sans défilement ; un texte ou un geste caché par un cadre qui coupe
  root.querySelectorAll("*").forEach(e => {
    const cs = getComputedStyle(e); if(cs.position !== "fixed" || !vis(e)) return;
    let bas = 0, quoi = ""; e.querySelectorAll("*").forEach(x => { if(!vis(x)) return; const rx = x.getBoundingClientRect(); if(rx.height < 3000 && rx.bottom > bas && (x.childNodes.length && Array.from(x.childNodes).some(n => n.nodeType === 3 && n.nodeValue.trim()) || x.matches("button,input,textarea,select"))){ bas = rx.bottom; quoi = court(x.innerText || x.value || x.placeholder); } });
    let defile = /(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 2; e.querySelectorAll("*").forEach(y => { const c = getComputedStyle(y); if(/(auto|scroll)/.test(c.overflowY) && y.scrollHeight > y.clientHeight + 2) defile = true; });
    if(bas > innerHeight + 2 && !defile) R.inatteignable.push("« " + quoi + " » à y = " + Math.round(bas) + " pour un écran de " + innerHeight + ", dans une fenêtre fixe qui ne défile pas (" + nom(e) + ")");
  });
  root.querySelectorAll("*").forEach(e => {
    const propre = Array.from(e.childNodes).some(n => n.nodeType === 3 && n.nodeValue.trim()); if(!propre && !e.matches("button,input,textarea,select")) return;
    if(!vis(e) || e.closest(".deco,.info-tip")) return; const r = e.getBoundingClientRect();
    let x = e.parentElement; while(x && x !== root){ const c = getComputedStyle(x);
      if(/(auto|scroll)/.test(c.overflowY + c.overflowX)) break;
      if(c.overflowY !== "visible" || c.overflowX !== "visible"){ const rx = x.getBoundingClientRect(); if(r.top >= rx.bottom - 1 || r.left >= rx.right - 1 || r.bottom <= rx.top + 1){ R.inatteignable.push("« " + court(e.innerText || e.value || e.placeholder) + " » caché par le cadre " + nom(x)); break; } }
      x = x.parentElement; }
  });
  // 14.2 : aucune barre de défilement de côté ; au tableau, aucune du tout
  const de = document.documentElement;
  if(de.scrollWidth > innerWidth + 1) R.defile.push("la page défile de côté (" + de.scrollWidth + " px pour " + innerWidth + ")");
  if(a.tableau && de.scrollHeight > innerHeight + 1 && getComputedStyle(document.body).overflowY !== "hidden") R.defile.push("au tableau, la page défile (" + de.scrollHeight + " px pour " + innerHeight + ")");
  root.querySelectorAll("*").forEach(e => { if(!vis(e)) return; const c = getComputedStyle(e);
    if(/(auto|scroll)/.test(c.overflowX) && e.scrollWidth > e.clientWidth + 1) R.defile.push(nom(e) + " défile de côté (" + e.scrollWidth + " px pour " + e.clientWidth + ") — « " + court(e.innerText) + " »");
    if(a.tableau && /(auto|scroll)/.test(c.overflowY) && e.scrollHeight > e.clientHeight + 1) R.defile.push("au tableau, " + nom(e) + " défile (" + e.scrollHeight + " px pour " + e.clientHeight + ") — « " + court(e.innerText) + " »");
    if(a.tableau && c.overflowY === "hidden" && e.scrollHeight > e.clientHeight + 2 && e.clientHeight > 40) R.defile.push("au tableau, " + nom(e) + " coupe son contenu (" + e.scrollHeight + " px pour " + e.clientHeight + ") — « " + court(e.innerText) + " »"); });
  // 14.3 : les classes que la maquette a écrites : aucun texte sous 12 px, aucun contraste trop faible
  const lum = c => { const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const fondDe = e => { let x = e; const couches = []; while(x){ const cs = getComputedStyle(x); if(cs.backgroundImage !== "none") return null; const c = (cs.backgroundColor.match(/[\d.]+/g) || []).map(Number); if(c.length && (c.length < 4 || c[3] > 0)){ couches.push(c); if(c.length < 4 || c[3] >= 0.99) break; } x = x.parentElement; } let base = [255, 255, 255]; for(let i = couches.length - 1; i >= 0; i--){ const c = couches[i], al = c.length > 3 ? c[3] : 1; base = [0, 1, 2].map(k => c[k] * al + base[k] * (1 - al)); } return base; };
  const maquette = e => { let x = e; while(x && x !== root){ const cl = typeof x.className === "string" ? x.className.trim().split(/\s+/).filter(Boolean) : []; if(cl.length) return cl.some(c => !site.has(c)) ? cl.filter(c => !site.has(c)).join(".") : null; x = x.parentElement; } return null; };
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; const deja = new Set();
  while((n = tw.nextNode())){
    // (complément 3) les émojis décoratifs passent aussi par la vérification 14.4 (ils n'ont ni taille ni contraste à tenir)
    const t = n.nodeValue.trim(); if(!t) continue; const pe = n.parentElement; if(!pe || !vis(pe) || pe.closest(".info-tip,style,script")) continue;
    const cl = maquette(pe), cs = getComputedStyle(pe);
    if(cl && !deja.has(pe) && !pe.closest(".deco")){ deja.add(pe);
      // l'échelle vient des transformations des ancêtres (les tablettes simulées en petit) : offsetWidth, arrondi au pixel, la faussait sur un petit texte
      let echelle = 1; for(let x = pe; x && x !== document.documentElement; x = x.parentElement){ const cx = getComputedStyle(x); if(cx.transform && cx.transform !== "none"){ const mm = /matrix\(([-\d.e]+), ?([-\d.e]+)/.exec(cx.transform); if(mm) echelle *= Math.hypot(+mm[1], +mm[2]); } if(cx.zoom && cx.zoom !== "1" && cx.zoom !== "normal") echelle *= +cx.zoom || 1; }
      const fsz = parseFloat(cs.fontSize) * (echelle > 0.2 ? echelle : 1);
      if(fsz < 11.95) R.petit.push(fsz.toFixed(1) + " px « " + court(t) + " » ." + cl);
      const col = (cs.color.match(/[\d.]+/g) || []).map(Number), fd = fondDe(pe);
      if(fd && col.length && !pe.closest("button:disabled,.ferme-env,[disabled],.ferme")){ const ac = col.length > 3 ? col[3] : 1; const c2 = [0, 1, 2].map(i => col[i] * ac + fd[i] * (1 - ac)); const l1 = lum(c2), l2 = lum(fd); const cr = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const op = +cs.opacity; const grand = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.6 && +cs.fontWeight >= 700); if(cr < (grand ? 3 : 4.5) || op < 0.99 && cr * op < (grand ? 3 : 4.5)) R.contraste.push(cr.toFixed(2) + " « " + court(t) + " » ." + cl); }
    }
    // 14.4 : un émoji décoratif coupé par un cadre (ou par le bord de l'écran)
    if(/\p{Extended_Pictographic}/u.test(t) && t.length <= 4){ const rg = document.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect();
      if(r.width > 2){ let x = pe, coupe = null; while(x && x !== root){ const c = getComputedStyle(x); if(c.overflowX !== "visible" || c.overflowY !== "visible"){ const rx = x.getBoundingClientRect(); const dedans = r.left >= rx.left - 1 && r.right <= rx.right + 1 && r.top >= rx.top - 1 && r.bottom <= rx.bottom + 1; const touche = r.right > rx.left && r.left < rx.right && r.bottom > rx.top && r.top < rx.bottom; if(!dedans && touche){ coupe = nom(x); break; } } x = x.parentElement; }
        if(!coupe && (r.left < -1 || r.right > innerWidth + 1) && r.right > 0 && r.left < innerWidth) coupe = "le bord de l'écran";
        // un émoji décoratif à demi recouvert par un cadre (la console, une carte) : une partie se voit, l'autre non
        if(!coupe && pe.closest(".deco") && getComputedStyle(pe.closest(".deco")).visibility !== "hidden"){ const dd = pe.closest(".deco");
          const pts = [[r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2], [(r.left + r.right) / 2, (r.top + r.bottom) / 2]].filter(q => q[0] >= 0 && q[1] >= 0 && q[0] < innerWidth && q[1] < innerHeight);
          const pev = dd.style.pointerEvents; dd.style.pointerEvents = "auto";   // un décor ne prend pas la souris : le temps de la mesure, si
          const vus = pts.map(q => { const el = document.elementFromPoint(q[0], q[1]); return el ? (el === dd || dd.contains(el)) : null; }).filter(v => v !== null);   // hors de la page : ni vu ni caché
          dd.style.pointerEvents = pev;
          if(vus.some(Boolean) && vus.some(v => !v)){ const q = pts.find(q => { const el = document.elementFromPoint(q[0], q[1]); return el && el !== dd && !dd.contains(el); }) || pts[0]; dd.style.pointerEvents = "auto"; const el = document.elementFromPoint(q[0], q[1]); dd.style.pointerEvents = pev; coupe = el ? nom(el.closest("[class]") || el) : "un cadre"; } }
        if(coupe) R.emoji.push("« " + t + " » coupé par " + coupe); } }
    // 14.5 : la ponctuation seule en début ou en fin de ligne ; un nombre séparé de son unité
    if(/[»:;?!«]|\d\s+(s|min|h|px|pts?|%|€|élèves?|questions?|secondes?)\b/.test(t)){
      const v = n.nodeValue, rects = i => { const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1); const rr = rg.getClientRects(); return rr.length ? rr[0] : null; };
      const prec = i => { for(let j = i - 1; j >= 0; j--) if(/\S/.test(v[j])) return j; return -1; }, suiv = i => { for(let j = i + 1; j < v.length; j++) if(/\S/.test(v[j])) return j; return -1; };
      for(let i = 0; i < v.length; i++){
        const ch = v[i]; let a2 = -1, b2 = -1, quoi = null;
        if(/[»:;?!]/.test(ch) && /\s/.test(v[i - 1] || "")){ a2 = prec(i); b2 = i; quoi = "« " + ch + " » en début de ligne"; }
        else if(ch === "«" && /\s/.test(v[i + 1] || "")){ a2 = i; b2 = suiv(i); quoi = "« « » en fin de ligne"; }
        else if(/\d/.test(ch) && /\s/.test(v[i + 1] || "") && !/\d/.test(v[i + 1] || "")){ const rest = v.slice(i + 1); const mu = /^\s+(s|min|h|px|pts?|%|€|élèves?|questions?|secondes?)\b/.exec(rest); if(mu){ a2 = i; b2 = suiv(i); quoi = "« " + ch + " " + mu[1] + " » coupé entre le nombre et l'unité"; } }
        if(quoi && a2 >= 0 && b2 >= 0){ const ra = rects(a2), rb = rects(b2); if(ra && rb && rb.top > ra.top + ra.height / 2) R.ponctuation.push(quoi + " — « " + court(v.slice(Math.max(0, i - 25), i + 10)) + " »"); }
      }
    }
  }
  for(const k of ["inatteignable", "defile", "petit", "contraste", "emoji", "ponctuation"]) R[k] = [...new Set(R[k])];
  return R;
}
function garde14(sc, T, lu){
  const tag = "garde 14. " + sc.id + " @" + T.w + "×" + T.h, out = [];
  lu.inatteignable.forEach(x => out.push(tag + " : hors d'atteinte — " + x));
  lu.defile.forEach(x => out.push(tag + " : " + x));
  if(lu.petit.length) out.push(tag + " : " + lu.petit.length + " texte(s) sous 12 px dans les classes de la maquette — " + lu.petit.slice(0, 5).join(" · "));
  // (complément 4) 14.3, le contraste, est remplacée par la garde 19, qui le mesure aux pixels quel que soit le fond (gardes4.js)
  lu.emoji.forEach(x => out.push(tag + " : émoji décoratif " + x));
  lu.ponctuation.forEach(x => out.push(tag + " : " + x));
  return out;
}

module.exports = {SCN, baseDe, momentDe, appareilDe, TAILLES, VUES_PAUL, vueEleve, formeTexte, dansSite, estDonnee, classement, classer, lireTextes9, garde9Scene,
  lireDestinations, garde9Destinations, lireTextesEleve, garde95, phrases, MOTS_9, ELISION,
  titresExistant, lireBulles10, garde10Scene, garde10Eleve, garde10Bulles, lireListes11, garde11Scene, garde11Gestes,
  COUCHES, argsPage, listerGestes, lireEtat, ESPION_G3, recharger, carteScene, lireAller, garde12Aller, garde12Scene, garde15Scene, garde15Gestes,
  lireChiffres13, garde13Scene, garde13Fin, garde13Sources, classesSite, lireLisibilite, garde14};
