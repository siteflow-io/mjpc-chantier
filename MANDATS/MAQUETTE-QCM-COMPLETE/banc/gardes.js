// Les cinq gardes du complément 1 (§4), branchées dans le banc unique. Elles lisent la page par le geste (la scène ouverte,
// rien n'est appelé pour agir) et lisent aussi dans les iframes.
//   1. L'existant : rien de la 7.7.1 ni de MJPC ne se perd sans un point du cadrage cité mot pour mot (banc/existant/).
//   2. Le méta : aucun renvoi au cadrage, au mandat, à la maquette, aucune marque de validation à l'écran.
//   3. Les chiffres : la taxonomie, les compétences, les durées de la séance et le prompt viennent des vraies données.
//   4. Les mesures : limites.json monte jamais avec le nombre de choix ni avec l'énoncé ; chaque limite tient, la suivante non ; l'étalon reste 67 px.
//   5. L'estimation : pour chaque élève, le bloc « 🎯 Ton estimation » et le bilan général disent le même degré.
const path = require("path"), fs = require("fs");
const C = require("./controles.js");
const { extraireEcran } = require("./existant/extraction.js");
const RACINE = path.join(__dirname, "..");
const SAS = path.join(RACINE, "..", "..");
const EXISTANT = path.join(__dirname, "existant");
const lire = p => fs.readFileSync(p, "utf8");

/* ════════ Garde 1 — l'existant ════════ */
function inventaires(){
  return fs.readdirSync(EXISTANT).filter(f => /^(qcm|mjpc|code)-.*\.json$/.test(f)).sort().map(f => Object.assign({fichier: f}, JSON.parse(lire(path.join(EXISTANT, f)))));
}
const CADRAGE = C.normEsp(lire(path.join(SAS, "MANDATS", "CADRAGE-QCM.md")));
function retraits(){
  const f = path.join(EXISTANT, "retraits.json");
  return fs.existsSync(f) ? JSON.parse(lire(f)).retraits : [];
}
// Chaque retrait cite le cadrage mot pour mot : la citation doit s'y trouver telle quelle, et le point cité doit la contenir.
const CADRAGE_LIGNES = lire(path.join(SAS, "MANDATS", "CADRAGE-QCM.md")).split("\n");
function verifierRetraits(verif){
  const R = retraits();
  for(const r of R){
    const cit = C.normEsp(r.citation || "");
    verif(cit.length >= 12 && CADRAGE.includes(cit), "garde 1. retrait « " + r.element + " » (" + r.ecran + ") : la citation est dans CADRAGE-QCM.md, mot pour mot", "« " + cit.slice(0, 90) + " »");
    // le point cité : une ligne du cadrage qui commence par « N. » et contient la citation (un point redonné plus loin compte aussi)
    const ok = CADRAGE_LIGNES.some(l => l.startsWith(r.point + ". ") && C.normEsp(l).includes(cit));
    verif(ok, "garde 1. retrait « " + r.element + " » : la citation est bien du point " + r.point);
  }
  return R.length;
}
const nrm = s => C.norm(String(s || ""));
// Les formes que la 7.7.1 calcule d'après les données de la séance : comparées à leur forme, pas à leurs valeurs.
//  - les fourchettes (l. 3965–3966) : « Entre a et b bonnes réponses sur n », ou « a bonne réponse sur n » quand a = b ;
//  - le singulier ou le pluriel selon le compte (« 1 question déjà corrigée », « 2 questions déjà corrigées », l. 4338–4341) ;
//  - le niveau d'une question (Facile, Standard, Approfondi, Expert) et sa couleur (🔴 🟠 🔵 🟢) ;
//  - les noms des élèves, les nombres et les libellés (déjà mis à part par controles.norm).
const NIVEAUX_Q = /(?<![\p{L}])(Facile|Standard|Approfondi|Expert|FACILE|STANDARD|APPROFONDI|EXPERT)(?![\p{L}])/gu;
//  - la bande des questions du téléphone (l. 5680) : « Qn — pas de réponse » ou « Qn — a/b bonnes (x%) », selon les réponses de la séance.
function forme(s){
  return nrm(s).replace(/ — (pas de réponse|#\/# bonnes \(#%\))$/, " — ‹taux›").replace(NIVEAUX_Q, "‹niveau›").replace(/[🔴🟠🔵🟢]/gu, "◍").replace(/[Ee]ntre # et #/g, "#").replace(/\(s\)/g, "")
    .replace(/(?<=\p{L}{2})[sx](?![\p{L}])/gu, "").replace(/\s+/g, " ").trim();
}
// Une phrase de la 7.7.1 qui n'est qu'une donnée de la séance jouée (le titre de l'évaluation du faux hub, un nom, un nombre) n'est pas comparée.
function phraseComparable(p){
  if(/jambon|Le jambon-beurre/i.test(p) || donnee(p)) return false;
  const t = nrm(p).replace(/[§#¤ɸ]/g, "");
  return (t.match(/\p{L}/gu) || []).length >= 3;
}
// Les textes des évaluations du faux hub (énoncés, choix, titres) : des données de la séance jouée, jamais comparés
const DONNEES_HUB = (() => { const o = new Set(); const f = path.join(__dirname, "fauxhub", "evals_now.json");
  if(fs.existsSync(f)){ const E = JSON.parse(lire(f)); for(const k in E){ const e = E[k]; if(e.titre) o.add(C.normEsp(e.titre)); (e.questions || []).forEach(q => { o.add(C.normEsp(q.enonce || "")); (q.choix || []).forEach(c => o.add(C.normEsp(c))); if(q.explication) o.add(C.normEsp(q.explication)); }); } }
  return o; })();
// Un bouton ou une infobulle qui n'est qu'une donnée : un nom d'élève (« AUDEBERT Élise »), un mot seul tiré de l'évaluation (« Rome »)
const NOM_PRENOM = /^[A-ZÀ-ÖØ-Ý][A-ZÀ-ÖØ-Ý'’ -]+ [A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ-]+…?\s*[⏳✓✗✅❌⚪🟡]?$/u;
const CLASSES_DONNEES = ["3 ESSAI"];
function donnee(x){ const t = nrm(x).replace(/[§#¤ɸ]/g, ""); const n = C.normEsp(x);
  return DONNEES_HUB.has(n) || [...DONNEES_HUB].some(d => d.length > 12 && n.startsWith(d)) || CLASSES_DONNEES.includes(n) || /^\p{Lu}[\p{Ll}'’]+(-\p{Lu}[\p{Ll}'’]+)+$/u.test(n) || NOM_PRENOM.test(String(x).trim()) || (t.match(/\p{L}/gu) || []).length < 1 || /^\p{Lu}[\p{Ll}'’-]+$/u.test(String(x).trim()); }
function retire(R, inv, sc, type, element){
  return R.some(r => (r.ecran === inv.ecran || r.ecran === "*") && r.type === type && forme(r.element) === forme(element) && (!r.scenes || r.scenes.includes(sc)));
}
// Compare un inventaire de l'existant et ce que montre une scène (la même extraction : extraction.js)
function garde1(sc, inv, vu, R){
  const pertes = [];
  const perdre = (type, element, detail) => { if(!retire(R, inv, sc, type, element)) pertes.push("garde 1. " + sc + " (de « " + inv.ecran + " ») : " + type + " « " + element + " » perdu" + (detail ? " — " + detail : "")); };
  // les infobulles se comparent à leur forme, comme les libellés : « Q10 est la 1e question révélée » et « Q2 est la 1e question révélée » sont la même infobulle
  const btn = new Map(); vu.boutons.forEach(b => { const k = forme(b.l); if(!btn.has(k)) btn.set(k, []); btn.get(k).push(forme(b.t)); });
  const vus = new Set();
  for(const b of inv.boutons || []){
    const k = forme(b.l); if(vus.has(k + "|" + b.t)) continue; vus.add(k + "|" + b.t);
    if(donnee(b.l)) continue;
    if(!btn.has(k)){ perdre("bouton", b.l); continue; }
    if(b.t && !btn.get(k).includes(forme(b.t)) && !retire(R, inv, sc, "infobulle", b.l))
      pertes.push("garde 1. " + sc + " (de « " + inv.ecran + " ») : l'infobulle de « " + b.l + " » n'est pas celle de l'existant — « " + b.t.slice(0, 120) + " » ; la scène dit « " + (btn.get(k)[0] || "rien").slice(0, 120) + " »");
  }
  const champs = new Set(vu.champs.map(forme));
  for(const c of [...new Set((inv.champs || []).map(x => typeof x === "string" ? x : x.l))]) if(!champs.has(forme(c))) perdre("champ", c);
  const cases = new Set(vu.cases.map(forme));
  for(const c of [...new Set((inv.cases || []).map(x => typeof x === "string" ? x : x.l))]) if(!cases.has(forme(c))) perdre("case", c);
  const titres = new Set(vu.titres.concat(vu.boutons.map(b => b.t)).map(forme));
  for(const t of [...new Set((inv.titres || []).map(x => typeof x === "string" ? x : x.t))]) if(!donnee(t) && !titres.has(forme(t))) perdre("infobulle", t);
  if(inv.classes){
    const ordre = inv.classes.map(x => x.c);
    ordre.forEach(c => { if(!vu.classes.includes(c)) perdre("structure", c, "la classe n'est pas dans la scène"); });
    const pos = ordre.filter(c => vu.classes.includes(c)).map(c => vu.classes.indexOf(c));
    for(let i = 1; i < pos.length; i++) if(pos[i] < pos[i - 1]){ perdre("structure", "ordre", "l'ordre de l'existant n'est pas suivi : " + ordre.join(" › ")); break; }
  }
  if((inv.phrases || []).length){
    const tout = forme(vu.phrases.join(" "));
    for(const x of [...new Set(inv.phrases.map(p => typeof p === "string" ? p : p.p))]){
      if(!phraseComparable(x)) continue;
      if(!tout.includes(forme(x))) perdre("phrase", x);
    }
  }
  return pertes;
}

/* ════════ Garde 2 — le méta ════════ */
// Les nombres entre parenthèses qui sont des données déclarées (et seulement elles)
const PARENTHESES_DONNEES = [
  {re: /👥 Classe \(\d+\)/u, pourquoi: "le nombre d'élèves de la classe, au tableau (la 7.7.1, l.5404)"}
];
const META = [
  {nom: "« tour N »", re: /(?<![\p{L}])tours? \d+/iu}, {nom: "« point N »", re: /(?<![\p{L}])points? \d+(?! ?(\/|sur|pt))/iu},
  {nom: "« cadrage »", re: /cadrage/i}, {nom: "« mandat »", re: /(?<![\p{L}])mandat/iu}, {nom: "« conscience »", re: /conscience/i}, {nom: "« exécutant »", re: /exécutant/i},
  {nom: "« à valider »", re: /à valider/i}, {nom: "« pas encore validé »", re: /pas encore validé/i}, {nom: "« souligné en pointillés »", re: /soulign\S* en pointillés/i},
  {nom: "« maquette »", re: /maquette/i}
];
function lireMeta(){
  // Tout ce qui se lit : textes visibles, infobulles, indications, valeurs des champs ; dans la page et dans chaque iframe ; hors du sommaire ⚙.
  const docs = [document]; document.querySelectorAll("iframe").forEach(f => { try { if(f.contentDocument && f.contentDocument.body) docs.push(f.contentDocument); } catch(e){} });
  const out = [], marques = [];
  const orange = c => { const m = /rgba?\((\d+), (\d+), (\d+)/.exec(c || ""); return m && +m[1] > 190 && +m[2] > 80 && +m[2] < 200 && +m[3] < 120; };
  docs.forEach((doc, di) => {
    const win = doc.defaultView, ou = di ? "iframe" : "page";
    const hors = el => !el.closest("#som-racine,.som-fond,.som-gear,#sommaire");
    const visible = el => { const r = el.getBoundingClientRect(); if(r.width < 1 || r.height < 1) return false; const cs = win.getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none"; };
    const tw = doc.createTreeWalker(doc.body, win.NodeFilter.SHOW_TEXT); let n;
    while((n = tw.nextNode())){ const v = n.nodeValue.replace(/\s+/g, " ").trim(); const el = n.parentElement; if(!v || !el || el.closest("style,script,title") || !hors(el)) continue;
      if(!visible(el) && !el.closest(".info-tip")) continue; out.push({ou, quoi: "texte", t: v, prompt: !!el.closest("[data-prompt]")}); }
    doc.body.querySelectorAll("[title],[placeholder],input,textarea").forEach(el => { if(!hors(el)) return;
      if(el.getAttribute("title")) out.push({ou, quoi: "infobulle", t: el.getAttribute("title")});
      if(el.getAttribute("placeholder")) out.push({ou, quoi: "indication", t: el.getAttribute("placeholder")});
      if((el.tagName === "TEXTAREA" || el.tagName === "INPUT") && el.value && visible(el)) out.push({ou, quoi: "champ", t: el.value}); });
    doc.body.querySelectorAll("*").forEach(el => { if(!hors(el) || !visible(el)) return;
      const cs = win.getComputedStyle(el);
      // un souligné : le trait sous le texte (text-decoration), ou une bordure du bas seule, en pointillés ; pas un cadre en tirets
      const seulBas = parseFloat(cs.borderTopWidth) === 0 && parseFloat(cs.borderLeftWidth) === 0 && parseFloat(cs.borderRightWidth) === 0;
      const souligne = (/underline/.test(cs.textDecorationLine) && /dotted|dashed/.test(cs.textDecorationStyle) && orange(cs.textDecorationColor)) || (seulBas && /dotted|dashed/.test(cs.borderBottomStyle) && parseFloat(cs.borderBottomWidth) > 0 && orange(cs.borderBottomColor));
      if(el.classList.contains("prov") || souligne) marques.push(ou + " : " + (el.className ? "." + String(el.className).split(" ")[0] + " " : "") + "« " + (el.textContent || "").trim().slice(0, 50) + " »"); });
  });
  return {textes: out, marques};
}
function garde2(sc, lu){
  const out = [];
  const gab = C.normEsp(promptAttendu()), tete = gab.slice(0, 80);
  // le texte du prompt (README), donnée de Paul : le gabarit, ou le prompt rempli que l'app copie (garde 3 le compare au README)
  const duPrompt = x => x.prompt || (x.quoi === "champ" && C.normEsp(x.t).includes(tete)) || (C.normEsp(x.t).length > 20 && gab.includes(C.normEsp(x.t)));
  const vus = new Set();
  for(const x of lu.textes){
    if(duPrompt(x)) continue;
    for(const m of META){ const r = m.re.exec(x.t); if(r){ const k = m.nom + "|" + x.t; if(vus.has(k)) continue; vus.add(k); out.push("garde 2. " + sc + " : " + m.nom + " dans " + (x.ou === "iframe" ? "l'iframe, " : "") + x.quoi + " — « …" + x.t.slice(Math.max(0, r.index - 40), r.index + 50) + "… »"); } }
    const re = /\(\s*\d{2,3}\s*\)/g; let r;
    while((r = re.exec(x.t))){
      const autour = x.t.slice(Math.max(0, r.index - 40), r.index + r[0].length + 2);
      if(PARENTHESES_DONNEES.some(d => d.re.test(autour))) continue;
      const k = "par|" + x.t; if(vus.has(k)) continue; vus.add(k);
      out.push("garde 2. " + sc + " : un nombre entre parenthèses " + r[0] + " dans " + (x.ou === "iframe" ? "l'iframe, " : "") + x.quoi + " — « …" + autour + "… »");
    }
  }
  for(const m of lu.marques) out.push("garde 2. " + sc + " : une marque de validation (souligné orange en pointillés, .prov) visible — " + m);
  return out;
}

/* ════════ Garde 3 — les chiffres ════════ */
const PROD = process.env.PROD || "/home/user/siteflow-io/monsieurjaipascompris";
const TAXO_SRC = path.join(RACINE, "src", "donnees", "taxonomie_atelier.json");   // la copie de la production, avec son md5 (src/donnees/MD5.txt)
function taxo(){ return JSON.parse(lire(fs.existsSync(TAXO_SRC) ? TAXO_SRC : path.join(PROD, "taxonomie_atelier.json"))); }
function attenduTaxo(){
  const t = taxo();
  const doms = t.domaines.map(d => ({libelleProf: d.libelleProf, libelleEleve: d.libelleEleve, familles: d.familles.length, notions: d.familles.reduce((a, f) => a + (f.notions || []).length, 0), d}));
  const total = doms.reduce((a, d) => a + d.notions, 0);
  const notions = {}; t.domaines.forEach(d => d.familles.forEach(f => (f.notions || []).forEach(n => { notions[n.id] = n; })));
  const comps = {}; for(const k in t.competences) t.competences[k].forEach(g => g.items.forEach(it => { comps[it.id] = {libelle: it.libelle, eleve: C.LIB_ELEVE[it.id]}; }));
  const groupes = []; for(const k in t.competences) t.competences[k].forEach(g => groupes.push({libelle: g.libelle, items: g.items}));
  return {groupes, etat: "Version " + t.meta.version + " · " + t.meta.date + " · " + t.domaines.length + " domaines · " + total + " notions", doms, notions, comps};
}
function lireChiffres(){
  const root = document.getElementById("root");
  const txt = el => (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  const q = s => Array.from(root.querySelectorAll(s)).filter(e => e.getBoundingClientRect().width > 0);
  const tout = root.innerText || "";
  return {
    etats: q(".m8tx-etat").map(txt),
    etatsLibres: (tout.match(/Version [^\n]*?domaines[^\n]*?notions/g) || []),
    doms: q(".m8tx-dom-titre").map(txt),
    notions: q(".m8tx-notion").map(n => ({id: txt(n.querySelector(".m8tx-id") || n).split(" ")[0], prof: n.querySelector(".m8tx-prof") ? txt(n.querySelector(".m8tx-prof")) : null, l2: n.querySelector(".m8tx-n-l2") ? txt(n.querySelector(".m8tx-n-l2")) : null})),
    // la section « Les compétences » de l'éditeur de la taxonomie (637) : ses identifiants, ses libellés
    comps: (() => { const sec = root.querySelector(".m8tx-comps"); if(!sec) return null; const t = sec.innerText || "";
      const groupes = Array.from(sec.querySelectorAll(".m8tx-fam")).map(g => { const ti = g.querySelector(".m8tx-fam-titre"); const it = g.innerText || "";
        return {titre: ti ? txt(ti) : "", ouvert: !!g.querySelector(".m8tx-notion"), ids: (it.match(/\b(c4|tr)-[a-z]+-\d\d\b/g) || [])}; });
      return {ids: t.match(/\b(c4|tr)-[a-z]+-\d\d\b/g) || [], texte: t.replace(/\s+/g, " "), groupes}; })(),
    texte: tout.replace(/\s+/g, " "),
    durees: Array.from(root.querySelectorAll("input")).filter(i => i.getBoundingClientRect().width > 0).map(i => ({v: i.value, lab: txt(i.closest("label,.reg-l,.reg-d,div") || i)})),
    // le prompt : rempli (à la lecture, ce que l'app copie) ou modifiable (le gabarit enregistré, jetons compris)
    prompts: Array.from(root.querySelectorAll("textarea,[data-prompt]")).filter(el => el.getBoundingClientRect().width > 0)
      .map(el => ({texte: el.tagName === "TEXTAREA" ? el.value : el.textContent, modifiable: el.tagName === "TEXTAREA" && !el.readOnly}))
      .filter(x => /Tu vas m'aider|Tu es|tu es/.test(x.texte) && x.texte.length > 500)
  };
}
// Les durées fixes de la séance (649)
const DUREES_649 = [
  {lab: /Installation et consignes/, v: "5", quoi: "5 minutes d'installation et de consignes"},
  {lab: /Correction, par question/, v: "1", quoi: "1 minute de correction par question"},
  {lab: /Co-évaluation et bilan/, v: "2", quoi: "2 minutes pour la co-évaluation et le bilan"},
  {lab: /Passage de la tablette|décompte/, v: "3", quoi: "3 secondes de décompte"},
  {lab: /dit-elle la même chose/, v: "5", quoi: "5 secondes où l'élève dit si sa feuille dit la même chose"},
  {lab: /Entre deux questions/, v: "15", quoi: "15 secondes avant la suivante"}
];
// MESURES=0 : sans la garde 4 ni le texte de {{LIMITES}} (le banc de l'étape B, avant que la mesure soit refaite à l'étape C)
const MESURES = process.env.MESURES !== "0";
// le chapitre de 3e et ses compétences (copie du sas, CONSULTANT/CHAPITRE-1/, md5 dans src/donnees/MD5.txt)
function chapitre(){ const c = JSON.parse(lire(path.join(RACINE, "src", "donnees", "chapitre-3e-poesie-peinture-final.json"))).chapitre; return {majeures: c.competencesMajeures, mineures: c.competencesMineures}; }
function promptAttendu(){
  const readme = lire(path.join(SAS, "MANDATS", "PROMPT-QCM-CREATION", "README.md"));
  return /## Le texte proposé\s*```\n([\s\S]*?)\n```/.exec(readme)[1];
}
function limitesTexte(){
  const f = path.join(RACINE, "mesures", "limites.json");
  const l = JSON.parse(lire(f)); return l.texte_limites || null;
}
function garde3(sc, lu){
  const out = [], A = attenduTaxo();
  const pb = m => out.push("garde 3. " + sc + " : " + m);
  for(const e of lu.etats) if(C.normEsp(e) !== A.etat) pb("l'état du référentiel dit « " + e + " » ; taxonomie_atelier.json dit « " + A.etat + " »");
  for(const e of lu.etatsLibres) if(!lu.etats.length && C.normEsp(e) !== A.etat) pb("l'état du référentiel dit « " + e + " » ; taxonomie_atelier.json dit « " + A.etat + " »");
  if(lu.doms.length){
    if(lu.doms.length !== A.doms.length) pb(lu.doms.length + " domaines montrés ; taxonomie_atelier.json en a " + A.doms.length);
    A.doms.forEach((d, i) => { const vu = C.normEsp(lu.doms[i] || ""); const att = d.libelleProf + " (élève : " + d.libelleEleve + ") " + d.familles + " familles · " + d.notions + " notions";
      if(lu.doms[i] && !vu.endsWith(C.normEsp(att))) pb("le domaine " + (i + 1) + " dit « " + vu + " » ; attendu « " + att + " »"); });
  }
  for(const n of lu.notions){
    const ref = A.notions[n.id] || null, comp = A.comps[n.id] || null;
    if(!ref && !comp){ pb("« " + n.id + " » n'est ni une notion ni une compétence du référentiel"); continue; }
    const prof = ref ? ref.libelleProf : comp.libelle;
    const l2 = ref ? "Élève : " + ref.libelleEleve + " · " + ref.niveaux + (ref.exemple ? " · " + ref.exemple : "") : "Élève : " + comp.eleve;
    if(n.prof !== null && C.normEsp(n.prof) !== C.normEsp(prof)) pb("« " + n.id + " » dit « " + n.prof + " » ; le référentiel dit « " + prof + " »");
    if(n.l2 !== null && C.normEsp(n.l2) !== C.normEsp(l2)) pb("« " + n.id + " » : « " + n.l2 + " » ; attendu « " + l2 + " »");
  }
  // Les compétences : là où la section « Les compétences » s'affiche, les 28, chacune avec son libellé et son libellé élève
  // chaque groupe avec son nombre de compétences ; un groupe ouvert les montre toutes ; tous ouverts, ce sont les 28
  if(lu.comps){
    const ids = [...new Set(lu.comps.ids)], t = lu.comps.texte;
    if(lu.comps.groupes.length !== A.groupes.length) pb(lu.comps.groupes.length + " groupes de compétences montrés ; taxonomie_atelier.json en a " + A.groupes.length);
    A.groupes.forEach(g => { const vu = lu.comps.groupes.filter(x => C.normEsp(x.titre).includes(C.normEsp(g.libelle)))[0];
      if(!vu){ pb("le groupe « " + g.libelle + " » manque"); return; }
      const n = g.items.length + " compétence" + (g.items.length > 1 ? "s" : "");
      if(!vu.titre.includes(n)) pb("le groupe « " + g.libelle + " » dit « " + vu.titre + " » ; attendu « " + n + " »");
      if(vu.ouvert) g.items.forEach(it => { if(!vu.ids.includes(it.id)) pb("la compétence « " + it.id + " » manque au groupe ouvert « " + g.libelle + " »"); }); });
    if(lu.comps.groupes.length && lu.comps.groupes.every(g => g.ouvert)) Object.keys(A.comps).forEach(id => { if(!ids.includes(id)) pb("la compétence « " + id + " » manque à la liste"); });
    ids.forEach(id => { const c = A.comps[id]; if(!c){ pb("« " + id + " » n'est pas une compétence du référentiel"); return; } if(!t.includes(C.normEsp(c.libelle))) pb("le libellé de « " + id + " » n'est pas « " + c.libelle + " »");
      if(c.eleve && !t.includes(C.normEsp(c.eleve))) pb("le libellé élève de « " + id + " » n'est pas « " + c.eleve + " »"); });
  }
  // Les durées de la séance (649) : là où Réglages les montre
  if(/Les durées de la séance/.test(lu.texte)){
    for(const d of DUREES_649){ const ch = lu.durees.filter(x => d.lab.test(x.lab)); if(!ch.length || !ch.some(x => x.v === d.v)) pb("la durée « " + d.quoi + " » (649) : la scène dit « " + (ch[0] ? ch[0].v : "rien") + " »"); }
  }
  // Le prompt : modifiable, c'est le gabarit du README mot pour mot, jetons compris ; rempli (ce que l'app copie), c'est le texte
  // du README, chaque jeton remplacé : le chapitre et ses compétences d'après les vraies données, {{LIMITES}} par le texte des mesures
  for(const x of lu.prompts){
    const p = x.texte, gab = promptAttendu();
    if(x.modifiable){ if(C.normEsp(p) !== C.normEsp(gab)) pb("le prompt à modifier n'est pas le gabarit du README, jetons compris"); continue; }
    const restes = p.match(/\{\{[A-Z_]+\}\}/g); if(restes) pb("le prompt garde ses jetons non remplacés : " + [...new Set(restes)].join(" "));
    const morceaux = gab.split(/\{\{[A-Z_]+\}\}/); let pos = 0;
    for(const m of morceaux){ const t = m.trim(); if(!t) continue; const i = p.indexOf(t, pos); if(i < 0){ pb("le prompt n'a pas, à sa place, le texte du README « " + t.slice(0, 70) + "… »"); break; } pos = i + t.length; }
    // {{COMPETENCES_CHAPITRE}} : chaque compétence du chapitre, une par ligne, avec son code, son libellé officiel et son libellé élève
    const ch = chapitre();
    ch.majeures.concat(ch.mineures).forEach(code => { const c = A.comps[code];
      const l = p.split("\n").filter(x => x.includes(code))[0];
      if(!l) pb("le prompt n'a pas la compétence « " + code + " » du chapitre");
      else if(!l.includes(c.libelle) || !l.includes(c.eleve)) pb("la ligne de « " + code + " » n'a pas son libellé officiel et son libellé élève : « " + l.slice(0, 120) + " »"); });
    const ids = [...new Set(p.match(/\b(c4|tr)-[a-z]+-\d\d\b/g) || [])].filter(id => !ch.majeures.concat(ch.mineures).includes(id));
    if(ids.length) pb("le prompt donne des compétences hors du chapitre : " + ids.join(" "));
    // {{DUREES}} : les durées fixes du point 649, avec ses mots
    for(const d of ["3 secondes de décompte", "5 secondes où l'élève dit si sa feuille dit la même chose", "15 secondes avant la question suivante", "5 minutes d'installation et de consignes", "1 minute de correction par question", "2 minutes pour la co-évaluation et le bilan"])
      if(!C.normEsp(p).includes(d)) pb("le prompt ne dit pas, pour {{DUREES}}, « " + d + " » (649)");
    if(MESURES){
      const lt = limitesTexte();
      if(!lt) pb("mesures/limites.json ne donne pas le texte de {{LIMITES}}");
      else if(!p.includes(lt)) pb("le prompt ne porte pas, pour {{LIMITES}}, le texte de mesures/limites.json");
    }
  }
  return out;
}

/* ════════ Garde 4 — les mesures ════════ */
function garde4(verif){
  const f = path.join(RACINE, "mesures", "limites.json");
  const l = JSON.parse(lire(f));
  verif(l.etalon_q3_reste_px === 67, "garde 4. l'étalon (la vraie question 3 de 3e, sur l'écran de réponse) reste à 67 px", l.etalon_q3_reste_px + " px");
  const L = l.par_choix;   // {"4": [{enonce, limite, reste:{reponse,b,lecture}, reste_plus_pas:{…}}…], "5": …, "6": …}
  if(!verif(!!L, "garde 4. limites.json donne la limite d'un choix (tous les choix de même longueur), pour 4, 5 et 6 choix", "absente : " + Object.keys(l).join(", "))){
    // l'ancienne forme : le total des choix ; elle aussi ne doit jamais monter
    const T = l.total || {};
    const ns = Object.keys(T).sort();
    const enonces = T[ns[0]] ? T[ns[0]].map(x => x.enonce) : [];
    enonces.forEach((e, k) => { for(let a = 0; a < ns.length - 1; a++){ const x = T[ns[a]][k], y = T[ns[a + 1]][k];
      verif(!(y && x && (y.total_max || y.choix_max) > (x.total_max || x.choix_max)), "garde 4. à " + e + " caractères d'énoncé, la limite ne monte pas de " + ns[a] + " à " + ns[a + 1] + " choix", (x.total_max || x.choix_max) + " → " + (y.total_max || y.choix_max)); } });
    return;
  }
  verif(l.pas_enonce === 20 && l.pas_choix === 5, "garde 4. les pas : 20 caractères d'énoncé, 5 caractères de choix", l.pas_enonce + " / " + l.pas_choix);
  const ns = ["4", "5", "6"];
  ns.forEach(n => {
    const pts = L[n] || [];
    verif(pts.length && pts[0].enonce === 40 && pts[pts.length - 1].enonce === 300, "garde 4. " + n + " choix : l'énoncé de 40 à 300 caractères", pts.length + " points");
    pts.forEach((p, k) => {
      if(p.limite > 0) for(const ec of ["reponse", "b", "lecture"]){
        verif(p.reste[ec] >= 0, "garde 4. " + n + " choix, énoncé " + p.enonce + ", choix de " + p.limite + " : tient sur l'écran « " + ec + " »", p.reste[ec] + " px");
      }
      verif(["reponse", "b", "lecture"].some(ec => p.reste_plus_pas[ec] < 0) || p.limite === 0, "garde 4. " + n + " choix, énoncé " + p.enonce + " : un choix de " + (p.limite + l.pas_choix) + " ne tient plus (la limite est la plus grande)", JSON.stringify(p.reste_plus_pas));
      if(k) verif(p.limite <= pts[k - 1].limite, "garde 4. " + n + " choix : la limite ne monte pas quand l'énoncé s'allonge (" + pts[k - 1].enonce + " → " + p.enonce + ")", pts[k - 1].limite + " → " + p.limite);
    });
  });
  for(let a = 0; a < ns.length - 1; a++) (L[ns[a]] || []).forEach((p, k) => { const q = (L[ns[a + 1]] || [])[k];
    if(q) verif(q.limite <= p.limite, "garde 4. énoncé " + p.enonce + " : la limite ne monte pas de " + ns[a] + " à " + ns[a + 1] + " choix", p.limite + " → " + q.limite); });
}

// L'échantillon : la limite est suffisante, rejouée dans la maquette elle-même (la page du banc) : à quelques points du tableau,
// la limite tient sur les trois écrans, et les longueurs plus courtes aussi (la moitié de la limite, 5 caractères), avec un énoncé plus court aussi.
async function garde4Echantillon(page, fichier, verif){
  const M = require("../mesures/mesure-page.js");
  const l = JSON.parse(lire(path.join(RACINE, "mesures", "limites.json")));
  const et = await M.etalon(page, fichier);
  verif(et === 67, "garde 4. l'étalon, remesuré dans la maquette : la vraie question 3 de 3e garde 67 px sur l'écran de réponse", et + " px");
  for(const n of ["4", "5", "6"]){
    const pts = (l.par_choix || {})[n] || [];
    for(const k of [0, Math.floor(pts.length / 2), pts.length - 1]){ const x = pts[k]; if(!x || !x.limite) continue;
      for(const lc of [...new Set([x.limite, Math.max(5, Math.round(x.limite / 10) * 5), 5])]) for(const e of [...new Set([x.enonce, 40])]){
        const r = await M.restes(page, e, +n, lc);
        verif(M.tient(r), "garde 4. échantillon : " + n + " choix de " + lc + " caractères, énoncé de " + e + " (limite " + x.limite + " à " + x.enonce + ") : tient sur les trois écrans", JSON.stringify(r)); } }
  }
}

/* ════════ Garde 5 — l'estimation ════════ */
function lireEstimation(){
  const root = document.getElementById("root");
  const out = [];
  const NIV = ["🔴", "🟠", "🔵", "🟢"];
  const contexte = el => { let a = el; while(a && a !== root){ if(a.matches(".moitie,.eleve-page,.modal,.bilan-imprime-page,.fiche-eleve,.card")) { const t = (a.textContent || "").slice(0, 400); if(/[A-ZÉ]{2,} [A-Z]|· [A-ZÉ]/.test(t) || a.matches(".moitie,.eleve-page,.modal")) return t; } a = a.parentElement; } return (root.textContent || "").slice(0, 400); };
  root.querySelectorAll("*").forEach(el => {
    if(el.getBoundingClientRect().width < 1) return;
    const direct = Array.from(el.childNodes).filter(c => c.nodeType === 3).map(c => c.nodeValue).join("");
    const m = /(un peu|nettement) surestimé/.exec(el.tagName === "TEXTAREA" ? el.value : direct);
    if(!m) return;
    const com = el.closest("[data-com]");
    const txt = el.tagName === "TEXTAREA" ? el.value : (el.innerText || "");
    const em = NIV.map(e => txt.indexOf(e)).map((p, i) => [p, i]).filter(x => x[0] >= 0).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    out.push({source: com ? "bilan" : "bloc", degre: m[1], entree: com ? com.getAttribute("data-com") : null, niveaux: em, contexte: contexte(el), texte: txt.slice(0, 200)});
  });
  return out;
}
const NOMS_LONGS = C.PERMIS.tous.slice().sort((a, b) => b.length - a.length);
// L'élève d'un bloc : le premier nom de la classe qui se lit autour (le badge de sa moitié, le titre de sa fiche)
function eleveDe(ctx, sc){
  let best = null; const C2 = ctx.toUpperCase();
  for(const n of NOMS_LONGS){ const p = n.split(" "); for(const forme of [n, p.slice(1).join(" ") + " " + p[0]]){ const i = C2.indexOf(forme.toUpperCase()); if(i >= 0 && (!best || i < best.i)) best = {i, n}; } }
  return best ? best.n : "l'élève de la scène " + sc;
}
function garde5Scene(sc, lu, tous){
  const out = [];
  for(const x of lu){
    const eleve = eleveDe(x.contexte, sc);
    let attendu = null;
    if(x.source === "bloc" && x.niveaux.length >= 2){ const ecart = Math.abs(x.niveaux[0] - x.niveaux[1]); attendu = ecart >= 2 ? "nettement" : "un peu"; }
    if(x.source === "bilan" && x.entree){ const e = JSON.parse(x.entree); attendu = e.ecart >= 2 ? "nettement" : "un peu"; }
    if(attendu && attendu !== x.degre) out.push("garde 5. " + sc + " : " + eleve + " — le " + (x.source === "bloc" ? "bloc « 🎯 Ton estimation »" : "bilan général") + " dit « " + x.degre + " surestimé » ; l'écart de niveaux veut « " + attendu + " » (com632.js) — « " + x.texte.slice(0, 110) + "… »");
    tous.push({sc, eleve, source: x.source, degre: x.degre});
  }
  return out;
}
function garde5Final(tous, verif){
  const par = {}; tous.forEach(x => { (par[x.eleve] = par[x.eleve] || []).push(x); });
  for(const e in par){
    const blocs = par[e].filter(x => x.source === "bloc"), bilans = par[e].filter(x => x.source === "bilan");
    for(const b of blocs) for(const g of bilans)
      verif(b.degre === g.degre, "garde 5. " + e + " : le bloc de l'estimation (" + b.sc + ") et le bilan général (" + g.sc + ") disent le même degré", "« " + b.degre + " » / « " + g.degre + " »");
  }
}

module.exports = {MESURES, garde4Echantillon, inventaires, retraits, verifierRetraits, garde1, lireMeta, garde2, lireChiffres, garde3, garde4, lireEstimation, garde5Scene, garde5Final, extraireEcran, attenduTaxo, PARENTHESES_DONNEES};
