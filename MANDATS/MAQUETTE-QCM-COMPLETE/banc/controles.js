// Les contrôles du banc unique : ce qui se lit dans la page, et ce qui se compare hors de la page.
const path = require("path"), fs = require("fs");
const SAS = path.join(__dirname, "..", "..", "..");                 // le dépôt mjpc-chantier
const PROD = process.env.PROD || "/home/user/siteflow-io/monsieurjaipascompris";
const FLUX = path.join(SAS, "MANDATS", "MAQUETTE-QCM-FLUX");

/* ── Les sources de ce que Paul a validé (mandat §1.6 et §8.3) ── */
const SOURCES_JS = ["maquette.js", "maquette2.js", "ev3e.js", "maquette610.js", "maquette620.js", "maquette626.js", "maquette627.js", "maquette628.js",
  "com626.js", "com627.js", "com628.js", "com629.js", "com632.js"].map(n => path.join(FLUX, "maquette", n)).concat([path.join(FLUX, "pdf-632", "gen632.js")]);
function lire(p){ return fs.readFileSync(p, "utf8"); }

/* ── Les élèves permis : la classe inventée « 3 ESSAI » et la classe de test de la 7.7.1 (lus dans les sources) ── */
function elevesPermis(){
  const m = lire(path.join(FLUX, "maquette", "maquette.js"));
  const bloc = /var PAIRES_AVANT = (\[[\s\S]*?\]\]);/.exec(m)[1];
  const essai = [].concat(...JSON.parse(bloc.replace(/null/g, "null"))).filter(Boolean);
  const t = lire(path.join(FLUX, "maquette", "maquette620.js"));
  const test = JSON.parse(/var TEST_NOMS = (\[[\s\S]*?\]);/.exec(t)[1]);
  return {essai, test, tous: essai.concat(test).concat(["Test Élève Un", "Test Élève Deux", "Test Élève Trois", "Test Élève Quatre", "Test Élève Cinq", "Test Élève Six"])};
}
const PERMIS = elevesPermis();
const PRENOMS = [...new Set(PERMIS.tous.map(n => n.split(" ").slice(1).join(" ")).concat(PERMIS.tous.map(n => n.split(" ")[0])))];

/* ── Les libellés des compétences : officiels (École Directe, jamais à l'élève) et élève (628) ── */
const LIB_ELEVE = JSON.parse(lire(path.join(FLUX, "maquette", "libelles_eleve.json")));
const LIB_OFFICIELS = (() => {
  const t = lire(path.join(SAS, "MANDATS", "LIBELLES-ELEVE-COMPETENCES", "README.md"));
  const o = {}; t.split("\n").forEach(l => { const m = /^\| `([a-z0-9-]+)` \| (.+?) \| (.+?) \|$/.exec(l); if(m) o[m[1]] = m[2]; });
  return o;
})();

/* ── La normalisation : apostrophes, espaces ; les noms, les nombres, les libellés et il/elle mis à part ── */
const echap = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const RE_NOMS = new RegExp("(?<![\\p{L}])(" + PERMIS.tous.concat(PRENOMS).filter(x => x.length > 1).sort((a, b) => b.length - a.length).map(echap).join("|") + ")(?![\\p{L}])", "gu");
const LIBS = Object.values(LIB_ELEVE).concat(Object.values(LIB_OFFICIELS)).sort((a, b) => b.length - a.length);
const RE_LIBS = new RegExp(LIBS.map(x => echap(x.replace(/[’]/g, "'"))).join("|"), "g");
function normEsp(s){ return String(s).replace(/[’‘]/g, "'").replace(/[   ]/g, " ").replace(/\s+/g, " ").trim(); }
function norm(s){
  return normEsp(s).replace(RE_LIBS, "¤").replace(RE_NOMS, "§").replace(/\d+([,.]\d+)?/g, "#").replace(/(?<![\p{L}])(il|elle|sûr|sûre|absent|absente)(?![\p{L}])/gu, "ɸ");
}
function unjs(s){ return s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\u([0-9a-fA-F]{4})/g, (m, x) => String.fromCharCode(parseInt(x, 16))); }

let CORPUS = null;
function corpus(racine){
  if(CORPUS) return CORPUS;
  const morceaux = [];
  morceaux.push(lire(path.join(SAS, "MANDATS", "CADRAGE-QCM.md")));
  SOURCES_JS.forEach(p => morceaux.push(unjs(lire(p))));
  morceaux.push(unjs(lire(path.join(PROD, "evaluation-qcm.html"))));
  const v1 = path.join(__dirname, "corpus-v1.txt");                // les textes rendus des maquettes existantes, réunies telles quelles (v1)
  if(fs.existsSync(v1)) morceaux.push(lire(v1));
  CORPUS = norm(morceaux.join("\n")).replace(/\s+/g, " ");
  return CORPUS;
}

/* ── 3. Chaque phrase vue par l'élève vient de ce que Paul a validé ── */
function provenance(etat, corpus){
  const enonces = etat.enonces.map(normEsp);
  const vus = new Set(), introuvables = [];
  for(const x of etat.textes){
    const brut = normEsp(x.t);
    if(!brut || (brut.match(/\p{L}/gu) || []).length < 3) continue;
    if(enonces.some(e => e === brut || (brut.length > 12 && e.includes(brut)))) continue;   // les énoncés de l'évaluation sont mis à part
    const t = norm(brut);
    if(vus.has(t)) continue; vus.add(t);
    if(corpus.includes(t)) continue;
    const segs = t.split(/[§#¤ɸ]+/).map(s => s.trim()).filter(s => (s.match(/\p{L}/gu) || []).length >= 4);
    if(t.match(/[§#¤ɸ]/) && segs.every(s => corpus.includes(s))) continue;
    introuvables.push(brut);
  }
  return {vues: vus.size, introuvables};
}

/* ── 4. Les mots interdits côté élève ── */
const INTERDITS_ELEVE = [
  [/touche|touché|touchez/i, "« touche »"], [/recopi/i, "« recopie »"], [/sanction/i, "« sanction »"], [/attestation/i, "« attestation »"],
  [/va voir|viens me voir|venez me voir/i, "« va voir »"], [/\b(c4|tr)-[a-z]+-\d\d\b/, "un code de compétence"],
  [/\b(json|hub|eid|firebase|undefined|null|NaN)\b|\[object/i, "un mot de plomberie"], [/le professeur|ton professeur|le prof\b|ton prof\b/i, "le professeur nommé"]
];
function motsInterdits(etat){
  const out = [];
  const tout = etat.textes.map(x => x.t).join("\n");
  for(const [re, nom] of INTERDITS_ELEVE){ const m = re.exec(tout); if(m) out.push(nom + " : « …" + tout.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\n/g, " ") + "… »"); }
  for(const lib of Object.values(LIB_OFFICIELS)){ const l = lib.replace(/[’]/g, "'"); if(normEsp(tout).includes(l) && !Object.values(LIB_ELEVE).includes(lib)) out.push("l'intitulé officiel « " + lib + " »"); }
  if(etat.infoEleve) out.push(etat.infoEleve + " infobulle(s) côté élève : aucune consigne en infobulle (dette n°12·112)");
  return out;
}

/* ── 7. Aucun vrai élève ── */
const MAJ_PERMIS = new Set(["QCM", "PDF", "BONUS", "MODE", "TEST", "POSE", "TON", "STYLO", "JSON", "CSV", "RÉPONSE", "RÉPONSES", "RÉFLEXION", "ESSAI", "DPP", "FPP", "PSR", "CDC", "MS", "PR", "EN", "COURS", "MULTIPLES", "TABLETTES", "EXPLICATION", "MJPC", "RÉDIGE", "TA", "SUR", "FEUILLE", "ENTIER", "A4", "OK", "CLASSE", "ED", "P.P", "P.I", "DE", "LA", "ET", "TOUT", "UN", "UNE", "PP", "PI", "SRP", "HUGO"]);
function nomsInconnus(texte){
  const re = /(?<![\p{L}])((?:[A-ZÀ-ÖØ-Ý][A-ZÀ-ÖØ-Ý'’-]+)(?: [A-ZÀ-ÖØ-Ý][A-ZÀ-ÖØ-Ý'’-]+)*) ([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+(?:-[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)?)(?![\p{L}])/gu;
  const permis = new Set(PERMIS.tous), out = new Set(); let m;
  while((m = re.exec(texte))){
    const nom = m[1], mots = nom.split(" ");
    if(mots.every(w => MAJ_PERMIS.has(w)) || mots.some(w => w.length < 2)) continue;
    const complet = nom + " " + m[2];
    if(permis.has(complet)) continue;
    if(mots.some(w => MAJ_PERMIS.has(w))) continue;
    out.add(complet);
  }
  return [...out];
}

const vueEleve = s => ["tablette", "eleve", "tableau"].includes(s.vue);
const vueProf = s => ["console", "telephone"].includes(s.vue);

const INTERDITS_SOURCE = [
  {nom: "alert(", re: /\balert\s*\(/}, {nom: "confirm(", re: /[^.\w]confirm\s*\(/}, {nom: "prompt(", re: /[^.\w-]prompt\s*\(/},
  {nom: "fetch(", re: /\bfetch\s*\(/}, {nom: "localStorage", re: /localStorage/}, {nom: "sessionStorage", re: /sessionStorage/},
  {nom: "indexedDB", re: /indexedDB/}, {nom: "XMLHttpRequest", re: /XMLHttpRequest/}, {nom: "WebSocket", re: /new WebSocket/},
  {nom: "scrollIntoView", re: /scrollIntoView/}, {nom: "window.print", re: /window\.print\s*\(/}
];

/* ── 9. Le PDF de gen632.js : son texte ── */
function textePdf632(){
  const html = lire(path.join(FLUX, "pdf-632", "notes-competences-3-ESSAI.html"));
  return html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<br>/g, "\n").replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
}

/* ── Ce qui se lit dans la page (fonctions sérialisées) ── */
function lireScene(){
  const root = document.getElementById("root");
  const visible = el => { const r = el.getBoundingClientRect(); if(r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity !== 0; };
  const dansTip = el => !!el.closest(".info-tip") && !el.closest(".info-i.ouvert");
  const textes = [], feuilles = [];
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while((n = tw.nextNode())){
    const v = n.nodeValue.trim(); if(!v) continue;
    const el = n.parentElement; if(!el || el.closest(".deco") || dansTip(el) || el.closest("style,script")) continue;
    if(!visible(el)) continue;
    textes.push({t: v});
  }
  root.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(i => { if(visible(i) && i.placeholder) textes.push({t: i.placeholder}); });
  // les énoncés des évaluations (mis à part du contrôle de provenance)
  const enonces = [];
  const evals = [window.EV, window.EV3, window.DEMO, window.EV3E].filter(Boolean);
  evals.forEach(ev => { if(ev.titre) enonces.push(ev.titre); (ev.questions || []).forEach(q => { if(!q) return; enonces.push(q.enonce); (q.choix || []).forEach(c => enonces.push(c)); if(q.explication) enonces.push(q.explication); }); });
  (window.INTERRO || []).forEach(q => { enonces.push(q.enonce); q.choix.forEach(c => enonces.push(c)); enonces.push(q.expl); });
  (window.INTERRO_ENONCES || []).forEach(e => enonces.push(e));
  (window.FEUILLES_SIMULEES || []).forEach(e => enonces.push(e));
  (window.LISTE_EVALS || []).forEach(e => enonces.push(e.titre));
  // débordement
  const vue = (document.body.className.match(/vue-(\w+)/) || [])[1];
  const debords = [];
  const de = document.documentElement;
  debords.push({ok: de.scrollWidth <= innerWidth + 1, quoi: "pas de défilement horizontal de la page", detail: de.scrollWidth + " px pour " + innerWidth});
  if(vue === "tablette"){
    root.querySelectorAll(".moitie").forEach((m, i) => {
      const c = m.firstElementChild; if(!c) return;
      const trop = c.scrollHeight - m.clientHeight;
      debords.push({ok: trop <= 1 || m.classList.contains("longueur-assumee"), quoi: "la moitié " + (i === 0 ? "de gauche" : "de droite") + " tient dans l'écran", detail: trop + " px de trop"});
    });
  }
  if(vue === "tableau") debords.push({ok: de.scrollHeight <= innerHeight + 1, quoi: "le tableau tient dans l'écran", detail: (de.scrollHeight - innerHeight) + " px de trop"});
  // chevauchements et textes coupés
  const feuillesTxt = [];
  const els = [];
  root.querySelectorAll("*").forEach(el => {
    if(el.closest(".deco") || dansTip(el)) return;
    const direct = Array.from(el.childNodes).some(c => c.nodeType === 3 && c.nodeValue.trim());
    if(!direct || !visible(el)) return;
    const r = el.getBoundingClientRect();
    // recouvert par une fenêtre : ce n'est pas un chevauchement de couches
    if(r.top >= 0 && r.top < innerHeight && r.left >= 0 && r.left < innerWidth){
      const cx = Math.min(innerWidth - 1, r.left + Math.min(r.width / 2, 8)), cy = Math.min(innerHeight - 1, r.top + r.height / 2);
      const hit = document.elementFromPoint(cx, cy);
      if(hit && hit !== el && !el.contains(hit) && !hit.contains(el) && hit.closest(".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.som-fond,.fen-fond") && !el.closest(".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.som-fond,.fen-fond")) return;
    }
    els.push({el, r});
  });
  const chevauchements = [], coupes = [];
  const nomEl = e => (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : e.tagName) + " « " + (e.textContent || "").trim().slice(0, 30) + " »";
  for(let i = 0; i < els.length; i++){
    const a = els[i];
    for(let j = i + 1; j < els.length; j++){
      const b = els[j];
      if(a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if(ox > 3 && oy > 3) chevauchements.push(nomEl(a.el) + " ⟂ " + nomEl(b.el));
    }
    const cs = getComputedStyle(a.el);
    if(cs.display !== "inline" && (cs.overflowX !== "visible" || cs.textOverflow === "ellipsis") && a.el.scrollWidth > a.el.clientWidth + 1 && !/^(INPUT|TEXTAREA|SELECT)$/.test(a.el.tagName)) coupes.push(nomEl(a.el));
  }
  // les boutons
  const boutons = [];
  root.querySelectorAll("button").forEach(b => {
    if(!visible(b)) return;
    boutons.push({txt: (b.innerText || "").trim().replace(/\s+/g, " ").slice(0, 60), title: (b.getAttribute("title") || "").trim(), desactive: b.disabled,
      horsConsole: !!b.closest(".tablette,.eleve-page")});
  });
  const fr = document.querySelector("iframe");
  let textesIframe = "";
  try { textesIframe = fr && fr.contentDocument && fr.contentDocument.body ? fr.contentDocument.body.innerText : ""; } catch(e){}
  const infoEleve = (vue === "tablette" || vue === "eleve" || vue === "tableau") ? root.querySelectorAll(".info-i").length : 0;
  return {longueurTexte: (root.innerText || "").length, iframe: !!fr, textesIframe, interdits: window.__INTERDITS || [], textes, enonces, debords, chevauchements, coupes, boutons, infoEleve};
}
function marquerBoutons(){
  const root = document.getElementById("root"); let i = 0;
  root.querySelectorAll("button").forEach(b => { const r = b.getBoundingClientRect(); if(b.disabled || r.width < 1 || r.height < 1) return; b.setAttribute("data-banc-b", String(i++)); });
  return i;
}
function empreinte(){
  const s = location.hash + "|" + document.body.innerHTML.replace(/ data-banc-b="\d+"/g, "");
  let h = 0; for(let i = 0; i < s.length; i++){ h = (h * 31 + s.charCodeAt(i)) | 0; } return h + ":" + s.length;
}

module.exports = {corpus, provenance, motsInterdits, nomsInconnus, vueEleve, vueProf, INTERDITS_SOURCE, textePdf632, lireScene, marquerBoutons, empreinte, normEsp, norm, PERMIS, LIB_OFFICIELS, LIB_ELEVE};
