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
function verifierRetraits(verif){
  const R = retraits();
  for(const r of R){
    const cit = C.normEsp(r.citation || "");
    verif(cit.length >= 12 && CADRAGE.includes(cit), "garde 1. retrait « " + r.element + " » (" + r.ecran + ") : la citation est dans CADRAGE-QCM.md, mot pour mot", "« " + cit.slice(0, 90) + " »");
    const re = new RegExp("(^|\\s)" + r.point + "\\. ");
    const debut = CADRAGE.search(re);
    const suite = debut >= 0 ? CADRAGE.slice(debut + 1).search(/\s\d{2,3}\. \*\*/) : -1;
    const texte = debut >= 0 ? CADRAGE.slice(debut, suite > 0 ? debut + 1 + suite : undefined) : "";
    verif(debut >= 0 && texte.includes(cit), "garde 1. retrait « " + r.element + " » : la citation est bien du point " + r.point);
  }
  return R.length;
}
const nrm = s => C.norm(String(s || ""));
// Une phrase de la 7.7.1 qui n'est qu'une donnée de la séance jouée (le titre de l'évaluation du faux hub, un nom, un nombre) n'est pas comparée.
function phraseComparable(p){
  if(/jambon|Le jambon-beurre/i.test(p) || DONNEES_HUB.has(C.normEsp(p))) return false;
  const t = nrm(p).replace(/[§#¤ɸ]/g, "");
  return (t.match(/\p{L}/gu) || []).length >= 3;
}
// Les textes des évaluations du faux hub (énoncés, choix, titres) : des données de la séance jouée, jamais comparés
const DONNEES_HUB = (() => { const o = new Set(); const f = path.join(__dirname, "fauxhub", "evals_now.json");
  if(fs.existsSync(f)){ const E = JSON.parse(lire(f)); for(const k in E){ const e = E[k]; if(e.titre) o.add(C.normEsp(e.titre)); (e.questions || []).forEach(q => { o.add(C.normEsp(q.enonce || "")); (q.choix || []).forEach(c => o.add(C.normEsp(c))); if(q.explication) o.add(C.normEsp(q.explication)); }); } }
  return o; })();
// Un bouton ou une infobulle qui n'est qu'une donnée : un nom d'élève (« AUDEBERT Élise »), un mot seul tiré de l'évaluation (« Rome »)
const NOM_PRENOM = /^[A-ZÀ-ÖØ-Ý][A-ZÀ-ÖØ-Ý'’ -]+ [A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ-]+$/;
function donnee(x){ const t = nrm(x).replace(/[§#¤ɸ]/g, ""); return DONNEES_HUB.has(C.normEsp(x)) || NOM_PRENOM.test(String(x).trim()) || (t.match(/\p{L}/gu) || []).length < 1 || /^\p{Lu}[\p{Ll}'’-]+$/u.test(String(x).trim()); }
function retire(R, inv, sc, type, element){
  return R.some(r => (r.ecran === inv.ecran || r.ecran === "*") && r.type === type && nrm(r.element) === nrm(element) && (!r.scenes || r.scenes.includes(sc)));
}
// Compare un inventaire de l'existant et ce que montre une scène (la même extraction : extraction.js)
function garde1(sc, inv, vu, R){
  const pertes = [];
  const perdre = (type, element, detail) => { if(!retire(R, inv, sc, type, element)) pertes.push("garde 1. " + sc + " (de « " + inv.ecran + " ») : " + type + " « " + element + " » perdu" + (detail ? " — " + detail : "")); };
  const btn = new Map(); vu.boutons.forEach(b => { const k = nrm(b.l); if(!btn.has(k)) btn.set(k, []); btn.get(k).push(C.normEsp(b.t)); });
  const vus = new Set();
  for(const b of inv.boutons || []){
    const k = nrm(b.l); if(vus.has(k + "|" + b.t)) continue; vus.add(k + "|" + b.t);
    if(NOM_PRENOM.test(b.l.trim())) continue;
    if(!btn.has(k)){ perdre("bouton", b.l); continue; }
    if(b.t && !btn.get(k).includes(C.normEsp(b.t)) && !retire(R, inv, sc, "infobulle", b.l))
      pertes.push("garde 1. " + sc + " (de « " + inv.ecran + " ») : l'infobulle de « " + b.l + " » n'est pas celle de l'existant — « " + b.t.slice(0, 120) + " » ; la scène dit « " + (btn.get(k)[0] || "rien").slice(0, 120) + " »");
  }
  const champs = new Set(vu.champs.map(nrm));
  for(const c of [...new Set((inv.champs || []).map(x => typeof x === "string" ? x : x.l))]) if(!champs.has(nrm(c))) perdre("champ", c);
  const cases = new Set(vu.cases.map(nrm));
  for(const c of [...new Set((inv.cases || []).map(x => typeof x === "string" ? x : x.l))]) if(!cases.has(nrm(c))) perdre("case", c);
  const titres = new Set(vu.titres.concat(vu.boutons.map(b => b.t)).map(C.normEsp));
  for(const t of [...new Set((inv.titres || []).map(x => typeof x === "string" ? x : x.t))]) if(!donnee(t) && !titres.has(C.normEsp(t))) perdre("infobulle", t);
  if(inv.classes){
    const ordre = inv.classes.map(x => x.c);
    ordre.forEach(c => { if(!vu.classes.includes(c)) perdre("structure", c, "la classe n'est pas dans la scène"); });
    const pos = ordre.filter(c => vu.classes.includes(c)).map(c => vu.classes.indexOf(c));
    for(let i = 1; i < pos.length; i++) if(pos[i] < pos[i - 1]){ perdre("structure", "ordre", "l'ordre de l'existant n'est pas suivi : " + ordre.join(" › ")); break; }
  }
  if((inv.phrases || []).length){
    const tout = nrm(vu.phrases.join(" ")).replace(/\s+/g, " ");
    for(const x of [...new Set(inv.phrases.map(p => typeof p === "string" ? p : p.p))]){
      if(!phraseComparable(x)) continue;
      if(!tout.includes(nrm(x))) perdre("phrase", x);
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
      if(!visible(el) && !el.closest(".info-tip")) continue; out.push({ou, quoi: "texte", t: v}); }
    doc.body.querySelectorAll("[title],[placeholder],input,textarea").forEach(el => { if(!hors(el)) return;
      if(el.getAttribute("title")) out.push({ou, quoi: "infobulle", t: el.getAttribute("title")});
      if(el.getAttribute("placeholder")) out.push({ou, quoi: "indication", t: el.getAttribute("placeholder")});
      if((el.tagName === "TEXTAREA" || el.tagName === "INPUT") && el.value && visible(el)) out.push({ou, quoi: "champ", t: el.value}); });
    doc.body.querySelectorAll("*").forEach(el => { if(!hors(el) || !visible(el)) return;
      const cs = win.getComputedStyle(el);
      const souligne = (/underline/.test(cs.textDecorationLine) && /dotted|dashed/.test(cs.textDecorationStyle) && orange(cs.textDecorationColor)) || (/dotted|dashed/.test(cs.borderBottomStyle) && parseFloat(cs.borderBottomWidth) > 0 && orange(cs.borderBottomColor));
      if(el.classList.contains("prov") || souligne) marques.push(ou + " : " + (el.className ? "." + String(el.className).split(" ")[0] + " " : "") + "« " + (el.textContent || "").trim().slice(0, 50) + " »"); });
  });
  return {textes: out, marques};
}
function garde2(sc, lu){
  const out = [];
  const gab = C.normEsp(promptAttendu()), tete = gab.slice(0, 80);
  const duPrompt = x => (x.quoi === "champ" && C.normEsp(x.t).includes(tete)) || (C.normEsp(x.t).length > 20 && gab.includes(C.normEsp(x.t)));   // le texte du prompt (README), donnée de Paul
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
const TAXO_SRC = path.join(RACINE, "sources", "taxonomie_atelier.json");
function taxo(){ return JSON.parse(lire(fs.existsSync(TAXO_SRC) ? TAXO_SRC : path.join(PROD, "taxonomie_atelier.json"))); }
function attenduTaxo(){
  const t = taxo();
  const doms = t.domaines.map(d => ({libelleProf: d.libelleProf, libelleEleve: d.libelleEleve, familles: d.familles.length, notions: d.familles.reduce((a, f) => a + (f.notions || []).length, 0), d}));
  const total = doms.reduce((a, d) => a + d.notions, 0);
  const notions = {}; t.domaines.forEach(d => d.familles.forEach(f => (f.notions || []).forEach(n => { notions[n.id] = n; })));
  const comps = {}; for(const k in t.competences) t.competences[k].forEach(g => g.items.forEach(it => { comps[it.id] = {libelle: it.libelle, eleve: C.LIB_ELEVE[it.id]}; }));
  return {etat: "Version " + t.meta.version + " · " + t.meta.date + " · " + t.domaines.length + " domaines · " + total + " notions", doms, notions, comps};
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
    ids: (tout.match(/\b(c4|tr)-[a-z]+-\d\d\b/g) || []),
    texte: tout.replace(/\s+/g, " "),
    durees: Array.from(root.querySelectorAll("input")).filter(i => i.getBoundingClientRect().width > 0).map(i => ({v: i.value, lab: txt(i.closest("label,.reg-l,.reg-d,div") || i)})),
    prompt: (Array.from(root.querySelectorAll("textarea")).filter(t => /Tu es|tu es/.test(t.value) && t.value.length > 500)[0] || {}).value || null
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
  // Les compétences : si la scène les liste, les 28, chacune avec son libellé et son libellé élève
  const ids = [...new Set(lu.ids)];
  if(ids.length >= 10 && /Les compétences/.test(lu.texte)){
    Object.keys(A.comps).forEach(id => { if(!ids.includes(id)) pb("la compétence « " + id + " » manque à la liste"); });
    ids.forEach(id => { const c = A.comps[id]; if(!c) return; if(!lu.texte.includes(C.normEsp(c.libelle)) && !lu.texte.includes(c.libelle)) pb("le libellé de « " + id + " » n'est pas « " + c.libelle + " »");
      if(c.eleve && !lu.texte.includes(c.eleve) && !lu.texte.includes(C.normEsp(c.eleve))) pb("le libellé élève de « " + id + " » n'est pas « " + c.eleve + " »"); });
  }
  // Les durées de la séance (649) : là où Réglages les montre
  if(/Les durées de la séance/.test(lu.texte)){
    for(const d of DUREES_649){ const ch = lu.durees.filter(x => d.lab.test(x.lab)); if(!ch.length || !ch.some(x => x.v === d.v)) pb("la durée « " + d.quoi + " » (649) : la scène dit « " + (ch[0] ? ch[0].v : "rien") + " »"); }
  }
  // Le prompt : le texte du README, chaque jeton remplacé ; {{LIMITES}} par le texte des mesures
  if(lu.prompt !== null){
    const p = lu.prompt, gab = promptAttendu();
    const restes = p.match(/\{\{[A-Z_]+\}\}/g); if(restes) pb("le prompt garde ses jetons non remplacés : " + [...new Set(restes)].join(" "));
    const morceaux = gab.split(/\{\{[A-Z_]+\}\}/); let pos = 0;
    for(const m of morceaux){ const t = m.trim(); if(!t) continue; const i = p.indexOf(t, pos); if(i < 0){ pb("le prompt n'a pas, à sa place, le texte du README « " + t.slice(0, 70) + "… »"); break; } pos = i + t.length; }
    const lt = limitesTexte();
    if(!lt) pb("mesures/limites.json ne donne pas le texte de {{LIMITES}}");
    else if(!p.includes(lt)) pb("le prompt ne porte pas, pour {{LIMITES}}, le texte de mesures/limites.json");
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
      for(const ec of ["reponse", "b", "lecture"]){
        verif(p.reste[ec] >= 0, "garde 4. " + n + " choix, énoncé " + p.enonce + ", choix de " + p.limite + " : tient sur l'écran « " + ec + " »", p.reste[ec] + " px");
      }
      verif(["reponse", "b", "lecture"].some(ec => p.reste_plus_pas[ec] < 0) || p.limite === 0, "garde 4. " + n + " choix, énoncé " + p.enonce + " : un choix de " + (p.limite + l.pas_choix) + " ne tient plus (la limite est la plus grande)", JSON.stringify(p.reste_plus_pas));
      if(k) verif(p.limite <= pts[k - 1].limite, "garde 4. " + n + " choix : la limite ne monte pas quand l'énoncé s'allonge (" + pts[k - 1].enonce + " → " + p.enonce + ")", pts[k - 1].limite + " → " + p.limite);
    });
  });
  for(let a = 0; a < ns.length - 1; a++) (L[ns[a]] || []).forEach((p, k) => { const q = (L[ns[a + 1]] || [])[k];
    if(q) verif(q.limite <= p.limite, "garde 4. énoncé " + p.enonce + " : la limite ne monte pas de " + ns[a] + " à " + ns[a + 1] + " choix", p.limite + " → " + q.limite); });
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

module.exports = {inventaires, retraits, verifierRetraits, garde1, lireMeta, garde2, lireChiffres, garde3, garde4, lireEstimation, garde5Scene, garde5Final, extraireEcran, attenduTaxo, PARENTHESES_DONNEES};
