// Les gardes 16 à 20 du complément 4 (§3), dans le banc unique avec les gardes 1 à 15. Elles passent par le geste dans Chromium,
// aux tailles de chaque vue, sur chaque scène et chaque destination que la garde 16 a relevée.
//   16. Chaque écran atteint est joué comme une scène (explorer.js) ; un écran ouvert avec un paramètre a la structure de l'écran de même sorte.
//   17. Le PDF est celui de sa séance.
//   18. L'écran dit le moment qu'il déclare.
//   19. Le contraste se mesure aux pixels.
//   20. Chaque changement vu par l'élève est nommé (banc/existant/eleve-v7-v9.json).
// Aucune ne reconnaît un écart par sa forme : un écart permis est nommé un par un, avec sa scène, dans un fichier du banc.
const path = require("path"), fs = require("fs");
const C = require("./controles.js");
const G3 = require("./gardes3.js");
const SCN = G3.SCN;
const RACINE = path.join(__dirname, "..");
const lire = p => fs.readFileSync(p, "utf8");
const base = cle => cle.split("&")[0];
function param(cle, n){ const m = new RegExp("&" + n + "=([^&]*)").exec(cle); return m ? decodeURIComponent(m[1]) : null; }
const nb = s => String(s).replace(/[\u00a0\u202f\u2009]/g, " ");

/* ════════ Le moment d'une page (scène ou destination), et ce qu'elle montre au scénario ════════ */
function momentPage(cle, parId){ return param(cle, "m") || (parId[base(cle)] || {}).moment || SCN.MOMENT_DE[base(cle)] || null; }
// la séance d'une page : celle qu'elle nomme (« &seance= »), celle qu'elle reprend, ou celle de son moment
function seancePage(cle, k){ return param(cle, "seance") || (param(cle, "reprise") ? "S08" : null) || ((SCN.moment(k) || {}).seance) || null; }
// l'évaluation jouée à un moment : la démo pour la démo et le mode test, l'évaluation de 3e pour la séance de 3e, l'évaluation d'essai sinon
function evalJouee(k){ const m = SCN.moment(k) || {}; if(m.seance === "S3E") return evalAu(SCN.ID_3E, k) || global.EV3; return SCN.evalDu(k); }
// une évaluation au moment k : celle du scénario (complétée ou non à ce moment)
function evalsAu(k){ return SCN.evals.length ? SCN.evals(k) : SCN.evals(); }
function evalAu(id, k){ if(id === "demo") return SCN.DEMO; if(id === "essai") return SCN.EV_ESSAI; return (SCN.evals(k) || []).filter(e => e.id === id)[0] || null; }
function evalDeSeance(se, k){ return se.eval === "essai" ? SCN.EV_ESSAI : se.eval === "demo" ? SCN.DEMO : evalAu(se.eval, k); }
// ce qu'il reste à compléter (la règle de src/c3-evals.js, manquesDe) : le chapitre, les deux temps, les compétences, ce que chaque question vérifie
function manques(e){ const l = []; if(!e.chap) l.push("chapitre"); if(e.questions.some(q => q.reflexion == null || q.reponse == null)) l.push("temps");
  if(e.questions.some(q => !(q.competences || []).length)) l.push("compétences"); if(e.questions.some(q => !q.verifie)) l.push("vérifie"); return l; }
function competencesDe(e){ const o = []; e.questions.forEach(q => (q.competences || []).forEach(c => { if(!o.includes(c)) o.push(c); })); return o; }
// le titre d'un chapitre, sans sa forme (« 3e · Ch. 1 — … », « 3e, chapitre 1 — … »)
function titreChap(c){ if(!c) return null; const t = String(c).split("—").slice(1).join("—").trim(); return t || String(c).trim(); }

/* ════════ Garde 16.4 — un écran ouvert avec un paramètre a la structure de l'écran de même sorte ════════ */
function lireStructure(){
  const root = document.getElementById("root");
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const sansTip = e => { const c = e.cloneNode(true); c.querySelectorAll(".info-tip,.info-i").forEach(x => x.remove()); return (c.textContent || "").replace(/\s+/g, " ").trim(); };
  const tables = Array.from(root.querySelectorAll("table")).filter(vis).map(t => {
    const ths = Array.from(t.querySelectorAll("thead tr:last-child th, thead th")).map(x => sansTip(x));
    let cols = 0; const tete = t.querySelector("thead tr"); if(tete) Array.from(tete.children).forEach(c => { cols += +(c.getAttribute("colspan") || 1); });
    const lignes = Array.from(t.querySelectorAll("tbody tr")).map(r => { let n = 0; Array.from(r.children).forEach(c => { n += +(c.getAttribute("colspan") || 1); }); return {n, t: (r.innerText || "").replace(/\s+/g, " ").slice(0, 40)}; });
    const carte = t.closest(".card") || t.parentElement;
    const gestes = Array.from(carte.querySelectorAll("button")).filter(vis).map(b => sansTip(b));
    return {cls: t.className, ths, cols, lignes, gestes, legende: !!carte.querySelector(".legende-res,.legende-tab")};
  });
  return {tables};
}
const NOMS_RE = new RegExp("(?<![\\p{L}])(" + C.PERMIS.tous.slice().sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(?![\\p{L}])", "gu");
function normTh(l){ const o = []; l.forEach(x => { let y = nb(x).replace(/[▴▾]/g, "").trim(); if(/^Q\s?\d+\b/.test(y)) y = "Q#"; else if(/^🧩/.test(y)) y = "🧩#"; if(o[o.length - 1] !== y) o.push(y); }); return o.join(" | "); }
function normGeste(x){ return nb(x).replace(NOMS_RE, "§").replace(/\d+/g, "#").trim(); }
function garde16Structure(cle, lu, ref){
  const out = [], tag = "garde 16. " + cle;
  // chaque ligne d'un tableau a autant de cases que son en-tête a de colonnes (« onze cases sous trois colonnes »)
  lu.tables.forEach((t, i) => t.lignes.forEach(l => { if(t.cols && l.n !== t.cols) out.push(tag + " : le tableau n° " + (i + 1) + " a une ligne de " + l.n + " cases sous " + t.cols + " colonnes — « " + l.t + " »"); }));
  if(!ref || cle === base(cle)) return out;
  if(ref.tables.length !== lu.tables.length){ out.push(tag + " : " + lu.tables.length + " tableau(x), « " + base(cle) + " » en a " + ref.tables.length); return out; }
  ref.tables.forEach((r, i) => { const t = lu.tables[i];
    if(r.cls !== t.cls) out.push(tag + " : le tableau n° " + (i + 1) + " a la classe « " + t.cls + " », celui de « " + base(cle) + " » « " + r.cls + " »");
    if(normTh(r.ths) !== normTh(t.ths)) out.push(tag + " : les colonnes « " + normTh(t.ths) + " » ne sont pas celles de « " + base(cle) + " » (« " + normTh(r.ths) + " »)");
    if(r.legende !== t.legende) out.push(tag + " : " + (r.legende ? "la légende de « " + base(cle) + " » manque" : "une légende en plus"));
    const g = new Set(t.gestes.map(normGeste)); [...new Set(r.gestes.map(normGeste))].forEach(x => { if(!g.has(x)) out.push(tag + " : le geste « " + x + " » de « " + base(cle) + " » manque à côté du tableau"); });
  });
  return out;
}

/* ════════ Garde 17 — le PDF est celui de sa séance ════════ */
let FIGE = null;
function pdfFige(){ if(FIGE) return FIGE; const s = lire(path.join(RACINE, "maquette-qcm-v8.html")); FIGE = JSON.parse(/window\.PDF632_HTML = (".*?");\n/.exec(s)[1]); return FIGE; }
function lirePdf(){
  const f = document.querySelector("#root iframe.pdf-page"); if(!f || !f.contentDocument) return null;
  const d = f.contentDocument, info = {};
  d.querySelectorAll(".infos div").forEach(x => { const b = x.querySelector("b"); if(b) info[b.textContent.replace(/\s*:\s*$/, "").trim()] = x.textContent.replace(b.textContent, "").trim(); });
  const classe = ((d.querySelector(".classe") || {}).textContent || "").replace(/^Classe\s*:\s*/, "").trim();
  const comps = Array.from(d.querySelectorAll("thead tr:last-child th .c")).map(x => x.textContent.trim());
  const lignes = Array.from(d.querySelectorAll("tbody tr:not(.comrow)")).map(r => { const td = Array.from(r.children); return {nom: td[0].textContent.trim(), note: (td[1] || {}).textContent ? td[1].textContent.trim() : "", niv: td.slice(2).map(c => { const p = c.querySelector(".pts"); return {lib: c.childNodes[0] ? String(c.childNodes[0].textContent).trim() : c.textContent.trim(), pts: p ? p.textContent.trim() : null}; })}; });
  return {srcdoc: f.getAttribute("srcdoc"), classe, info, comps, lignes};
}
const fr1 = x => SCN.fr1(x);
const LIBM = {vert: "Très bonne maîtrise", bleu: "Maîtrise satisfaisante", orange: "Maîtrise fragile", rouge: "Maîtrise insuffisante"};
function niveauDe(n, max){ return LIBM[SCN.maitriseDe(Math.round(n * 20 / max * 10) / 10)]; }
// les points d'autonomie retirés d'une séance passée : le scénario les dit (S.retiresSeance) ; la 3e : « ⛔ aux deux » au cas ambigu (S3E:coeval:T)
function retiresDe(id, k){ if(SCN.retiresSeance) return SCN.retiresSeance(id, k); if(id === "S3E") return ["Julien", "Michel"]; return []; }
// ce que chaque élève a eu à une séance, au moment k : par question, 1, 0 ou rien (pas là) ; null : absent
function reponsesDe(id, nom, k){
  const p = SCN.pre(nom), se = SCN.seance(id);
  if(id === "S08"){ if((se.absents || []).includes(nom)) return null; const n = SCN.note(p, k); return n.pts.map(x => x === null ? 0 : x); }
  if(id === "PAP"){ if((se.absents || []).includes(nom)) return null; const n = SCN.notePapier(p, k); return n.complet ? n.pts : null; }
  const R = id === "S3E" ? SCN.R_3E : id === "CH1" ? SCN.R_CH1 : id === "JB" ? SCN.R_JB : {}; const s = R[nom];
  if(!s) return null; return s.split("").map(c => c === "-" ? null : (c === "J" || c === "T") ? 1 : 0);
}
function garde17(source, opened, lu, k, id){
  const out = [], tag = "garde 17. « " + source + " » → " + opened;
  if(!lu){ out.push(tag + " : le PDF ne s'affiche pas"); return out; }
  const se = SCN.seance(id); if(!se){ out.push(tag + " : la séance « " + id + " » n'est pas dans le scénario"); return out; }
  const ev = evalDeSeance(se, k), Mk = SCN.moment(k) || {};
  const att = {"Évaluation": ev.titre, "Séance": se.date + " · " + ev.questions.length + " questions · " + (ev.mode === "partiel" ? "partiel" : "tout ou rien")};
  if(lu.classe !== se.classe) out.push(tag + " : la classe « " + lu.classe + " » ; la séance est celle de " + se.classe);
  for(const c in att) if(nb(lu.info[c] || "") !== nb(att[c])) out.push(tag + " : « " + c + " : " + (lu.info[c] || "—") + " » ; le scénario dit « " + att[c] + " » (séance " + id + " du " + se.date.slice(0, 5) + ")");
  const tc = titreChap(ev.chap), pc = (lu.info["Chapitre"] || "").trim();
  if(tc ? !nb(pc).includes(nb(tc)) : pc !== "—") out.push(tag + " : « Chapitre : " + pc + " » ; au scénario, au moment " + k + ", « " + ev.titre.slice(0, 40) + " » a " + (tc ? "le chapitre « " + tc + " »" : "« chapitre : — »"));
  const rendue = SCN.rendueAu(id, k);
  if(rendue && !/^rendues le /.test(lu.info["Copies"] || "")) out.push(tag + " : « Copies : " + (lu.info["Copies"] || "—") + " » ; elles sont rendues le " + se.rendues.slice(0, 10));
  if(rendue && (lu.info["Copies"] || "").indexOf(se.rendues.slice(0, 10)) < 0) out.push(tag + " : « Copies : " + lu.info["Copies"] + " » ; le scénario dit rendues le " + se.rendues.slice(0, 10));
  if(!rendue) out.push(tag + " : le PDF s'ouvre alors que les copies de la séance du " + se.date.slice(0, 5) + " ne sont pas rendues au moment " + k);
  const comps = competencesDe(ev), auto = ["tr-personne-03", "tr-methodes-02"];
  if(lu.comps.join(",") !== comps.concat(auto).join(",")) out.push(tag + " : les colonnes « " + lu.comps.join(", ") + " » ; l'évaluation a les compétences « " + comps.concat(auto).join(", ") + " »");
  const eleves = (se.eleves || SCN.NOMS).slice().sort((a, b) => a.localeCompare(b, "fr")), ret = retiresDe(id, k);
  if(lu.lignes.map(l => l.nom).join("|") !== eleves.join("|")) out.push(tag + " : les élèves du PDF ne sont pas ceux de la séance (" + lu.lignes.length + " lignes pour " + eleves.length + ")");
  for(const l of lu.lignes){
    const r = reponsesDe(id, l.nom, k);
    if(!r){ if(l.note !== "Absent") out.push(tag + " : " + l.nom + " à « " + l.note + " » ; le scénario le dit absent à la séance du " + se.date.slice(0, 5)); continue; }
    const la = r.map((x, i) => x === null ? null : i).filter(i => i !== null), tot = la.reduce((a, i) => a + r[i], 0);
    if(l.note !== fr1(tot * 20 / la.length)) out.push(tag + " : " + l.nom + " à « " + l.note + " » sur 20 ; le scénario dit " + fr1(tot * 20 / la.length));
    comps.forEach((c, j) => { const qs = ev.questions.map((q, i) => (q.competences || []).includes(c) && la.includes(i) ? i : -1).filter(i => i >= 0), n = qs.reduce((a, i) => a + r[i], 0), v = l.niv[j] || {};
      if(v.pts !== n + "/" + qs.length || v.lib !== niveauDe(n, qs.length)) out.push(tag + " : " + l.nom + ", " + c + " : « " + v.lib + " " + v.pts + " » ; le scénario dit « " + niveauDe(n, qs.length) + " " + n + "/" + qs.length + " »"); });
    const aRet = id === "S08" ? SCN.autonomie(SCN.pre(l.nom), k).retire : ret.includes(SCN.pre(l.nom));
    auto.forEach((c, j) => { const v = l.niv[comps.length + j] || {}, a = aRet ? LIBM.rouge : LIBM.vert; if(v.lib !== a) out.push(tag + " : " + l.nom + ", " + c + " : « " + v.lib + " » ; le scénario dit « " + a + " »"); });
  }
  return [...new Set(out)];
}

/* ════════ Garde 18 — l'écran dit le moment qu'il déclare ════════ */
function lireMoment18(a){
  const root = document.getElementById("root");
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
  // le texte visible, nœud par nœud : « Q 1/3 » et « 1er tour » écrits côte à côte restent deux textes
  const noeuds = []; const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while((n = tw.nextNode())){ const v = n.nodeValue.replace(/\s+/g, " ").trim(); const pe = n.parentElement; if(!v || !pe || pe.closest(".info-tip,style,script,#som-racine") || !vis(pe)) continue; noeuds.push(getComputedStyle(pe).textTransform === "uppercase" ? v.toUpperCase() : v); }
  root.querySelectorAll("iframe").forEach(f => { try { noeuds.push(f.contentDocument.body.innerText.replace(/\s+/g, " ")); } catch(e){} });
  const texte = noeuds.join("\n");
  const appel = Array.from(root.querySelectorAll(".checkin-modal")).filter(m => vis(m) && m.querySelector(".checkin-list .checkin-nom")).map(m => ({
    noms: Array.from(m.querySelectorAll(".checkin-list .checkin-item")).map(i => ({nom: (i.querySelector(".checkin-nom") || i).textContent.trim(), absent: i.classList.contains("coche")})),
    resume: ((m.querySelector(".checkin-summary") || {}).innerText || "").replace(/\s+/g, " "), texte: m.innerText.replace(/\s+/g, " ")}))[0] || null;
  const evals = Array.from(root.querySelectorAll(".eval-row")).filter(vis).map(r => ({titre: ((r.querySelector(".eval-titre") || {}).textContent || "").replace(/🔒 Permanente/, "").trim(),
    meta: ((r.querySelector(".eval-meta") || {}).innerText || "").replace(/\s+/g, " "), etat: ((r.querySelector(".eval-etat") || {}).innerText || "").replace(/\s+/g, " ")}));
  return {texte, appel, evals};
}
const PH_FAMILLE = {reflexion: "réflexion", reponse: "réponse", passage: "réponse", b: "réponse", rouvert: "réponse", lecture: "correction", revele: "correction", coeval: "co-évaluation", bilan: "bilan"};
function garde18(cle, vue, lu, k, parId){
  const out = [], tag = "garde 18. " + cle + " (" + (k || "?") + ")", m = SCN.moment(k) || {}, txt = nb(lu.texte), plat = txt.replace(/\n+/g, " ");
  const qPhase = ["reflexion", "reponse", "passage", "b", "close", "rouvert"].includes(m.ph), corr = ["lecture", "revele"].includes(m.ph);
  const ev = evalJouee(k), ec = m.ecartees || [];
  const nbQ = m.seance === "S3E" ? 11 : (ev ? ev.questions.length : 3) - ec.length;
  // 18.1 « Question n / m » et l'énoncé de la question en cours
  if(m.qi != null && (qPhase || corr)){
    const attN = qPhase ? m.qi + 1 - ec.filter(x => x < m.qi).length : null;
    // à la console, la liste des questions écrit « À venir — Q 3 / 3 » : seul « Question n / m » y dit la question en cours
    const re = vue === "console" ? /(?<![\p{L}])question\s?(\d+)\s?\/\s?(\d+)(?!\d)/giu : /(?:(?<![\p{L}])question|(?<![\p{L}])Q)\s?(\d+)\s?\/\s?(\d+)(?!\d)/giu; let x;
    while((x = re.exec(txt))){
      if(qPhase && (+x[1] !== attN || +x[2] !== nbQ)) out.push(tag + " : « " + x[0] + " » ; le moment déclaré est la question " + attN + " / " + nbQ + " (" + (m.etape || "") + ")");
      if(corr && m.seance !== "S3E" && m.seance !== "RATT"){ const rang = SCN.ORDRE_CORR.indexOf(m.qi) + 1; if(+x[1] !== rang && +x[1] !== m.qi + 1) out.push(tag + " : « " + x[0] + " » à la correction de la question " + (m.qi + 1) + " (rang " + rang + " / 3)"); }
    }
    if(["tablette", "tableau", "telephone"].includes(vue) && ev && ev.questions[m.qi]){
      const cur = nb(ev.questions[m.qi].enonce);
      // une question close : les tablettes attendent la suivante, sans énoncé ; sinon, l'énoncé de la question en cours est à l'écran
      if(m.ph !== "close" && !plat.includes(cur)) out.push(tag + " : l'énoncé de la question " + (m.qi + 1) + " (« " + cur.slice(0, 60) + " ») n'est pas à l'écran");
      // le téléphone montre aussi la question suivante (« Suiv. Q2 : … ») : seules les tablettes et le tableau n'en montrent qu'une
      if(vue !== "telephone") ev.questions.forEach((q, i) => { if(i !== m.qi && nb(q.enonce) !== cur && plat.includes(nb(q.enonce))) out.push(tag + " : l'écran montre l'énoncé de la question " + (i + 1) + " (« " + q.enonce.slice(0, 60) + " ») au moment de la question " + (m.qi + 1)); });
    }
  }
  // 18.2 le tour et le côté (« moitiés de gauche ») ; l'état écrit d'une séance en pause ou interrompue
  const qt = m.qi != null && m.tour ? {qi: m.qi, tour: m.tour} : m.pause || null;
  if(qt){
    const cote = (SCN.PREMIER[qt.qi] === "J") === (qt.tour === 1) ? "gauche" : "droite";
    let x; const re = /(1er|2e)\s*tour[^\n]{0,45}?moitiés de (gauche|droite)/g;
    while((x = re.exec(plat))){ const t = x[1] === "1er" ? 1 : 2; if(t !== qt.tour) out.push(tag + " : « " + x[0] + " » ; le moment est au " + (qt.tour === 1 ? "1er" : "2e") + " tour");
      else if(x[2] !== cote) out.push(tag + " : « " + x[0] + " » ; au " + (qt.tour === 1 ? "1er" : "2e") + " tour de la question " + (qt.qi + 1) + ", ce sont les moitiés de " + cote); }
    const re2 = /question (\d+), (1er|2e) tour/g;
    while((x = re2.exec(plat))){ if(+x[1] !== qt.qi + 1 || (x[2] === "1er" ? 1 : 2) !== qt.tour) out.push(tag + " : « " + x[0] + " » ; le moment est à la question " + (qt.qi + 1) + ", " + (qt.tour === 1 ? "1er" : "2e") + " tour"); }
  }
  // 18.3 la phase
  const fam = PH_FAMILLE[m.ph];
  if(fam){ let x; const re = /Phase\s*:\s*(réflexion|réponse|correction|co-évaluation|bilan)|Phase (RÉFLEXION|RÉPONSE)/gi;
    while((x = re.exec(plat))){ const f = (x[1] || x[2]).toLowerCase(); if(f !== fam) out.push(tag + " : « " + x[0] + " » ; la phase du moment est « " + fam + " »"); } }
  // 18.4 l'appel : les élèves de cette séance, et eux seuls ; ses absents
  if(lu.appel){
    const id = seancePage(cle, k), se = SCN.seance(id) || SCN.seance("S08"), eleves = se.eleves || SCN.NOMS, abs = se.absents || [];
    const noms = lu.appel.noms.map(x => x.nom);
    eleves.forEach(n => { if(!noms.includes(n)) out.push(tag + " : l'appel de la séance « " + se.id + " » ne propose pas " + n); });
    noms.forEach(n => { if(!eleves.includes(n)) out.push(tag + " : l'appel de la séance « " + se.id + " » propose " + n + ", qui n'en est pas"); });
    lu.appel.noms.forEach(x => { if(x.absent !== abs.includes(x.nom)) out.push(tag + " : à l'appel de la séance « " + se.id + " », " + x.nom + " est " + (x.absent ? "barré absent" : "présent") + " ; le scénario le dit " + (abs.includes(x.nom) ? "absent" : "présent")); });
    const r = /(\d+) absents? sur (\d+)/.exec(lu.appel.resume); if(r && (+r[1] !== abs.length || +r[2] !== eleves.length)) out.push(tag + " : « " + r[0] + " » ; la séance « " + se.id + " » a " + abs.length + " absent(s) sur " + eleves.length);
    const autres = [...new Set((lu.appel.texte.match(NOMS_RE) || []))].filter(n => !eleves.includes(n));
    autres.forEach(n => out.push(tag + " : l'appel de la séance « " + se.id + " » nomme " + n + ", qui n'en est pas"));
  }
  // 18.5 une évaluation : son chapitre, ses compétences, son état, au moment de la page
  for(const r of lu.evals){
    const e = evalsAu(k).concat([SCN.DEMO]).filter(x => C.normEsp(x.titre) === C.normEsp(r.titre))[0]; if(!e || e.demo) continue;
    const tc = titreChap(e.chap), pret = !manques(e).length;
    if(tc ? !nb(r.meta).includes(nb(tc)) : !/chapitre : —/.test(r.meta)) out.push(tag + " : « " + e.titre.slice(0, 40) + " » dit « " + r.meta.slice(0, 60) + " » ; au scénario, à ce moment, " + (tc ? "son chapitre est « " + tc + " »" : "elle n'a pas de chapitre"));
    if(pret !== /Prête à lancer/.test(r.etat)) out.push(tag + " : « " + e.titre.slice(0, 40) + " » dit « " + r.etat.slice(0, 50) + " » ; au scénario, à ce moment, elle est " + (pret ? "prête" : "à compléter (" + manques(e).join(", ") + ")"));
    const nc = competencesDe(e).length, mc = /🧩 (\d+) compétence/.exec(r.meta); if((mc ? +mc[1] : 0) !== nc) out.push(tag + " : « " + e.titre.slice(0, 40) + " » dit " + (mc ? mc[0] : "aucune compétence") + " ; elle en a " + nc);
  }
  return [...new Set(out)];
}
// 18.5, le PDF : le chapitre et les compétences qu'il donne sont ceux de l'évaluation au moment de la page (garde 17, ci-dessus)

/* ════════ Garde 19 — le contraste se mesure aux pixels ════════ */
// Dans la page : les textes dont la classe ou le fond vient de la maquette, chacun avec ses rectangles et sa couleur
function marquer19(a){
  const root = document.getElementById("root"), site = new Set(a.site);
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
  // la classe d'un texte : celle du premier ancêtre qui en a une (comme la garde 14) ; son fond : le premier ancêtre qui en pose un.
  // L'un ou l'autre écrit par la maquette (une classe que le site n'a pas, ou un style posé par la maquette) : le texte est mesuré.
  // une classe du site, même mêlée à une classe de la maquette, garde la couleur du site ; un style posé sur un élément du site
  // le recopie (la pastille du niveau, l. 3024 de la 7.7.1) : seuls comptent les éléments dont toutes les classes sont de la maquette
  const classes = x => typeof x.className === "string" ? x.className.trim().split(/\s+/).filter(Boolean) : [];
  const deMaquette = cl => cl.length > 0 && cl.every(c => !site.has(c));
  const classeM = e => { let x = e; while(x && x !== root){ const cl = classes(x); if(cl.length) return deMaquette(cl) ? cl.join(".") : null; x = x.parentElement; } return null; };
  const fondM = e => { let x = e; while(x && x !== root){ const cs = getComputedStyle(x); if(cs.backgroundImage !== "none" || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)){ const cl = classes(x);
      if(cl.some(c => site.has(c))) return null; if(deMaquette(cl)) return "fond ." + cl.join("."); return x.style && (x.style.background || x.style.backgroundColor || x.style.backgroundImage) ? "fond posé par la maquette" : null; } x = x.parentElement; } return null; };
  const maquette = e => classeM(e) || fondM(e);
  // un texte recouvert par une fenêtre ouverte (le fond grisé de l'appel) ne se lit pas : il n'est pas mesuré
  const dessus = e => { const r = document.createRange(); const n = Array.from(e.childNodes).find(c => c.nodeType === 3 && c.nodeValue.trim()); if(!n) return false; r.selectNodeContents(n); const q = r.getClientRects()[0]; if(!q) return false;
    const x = q.left + q.width / 2, y = q.top + q.height / 2; if(x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return true; const hit = document.elementFromPoint(x, y); return !!hit && (e.contains(hit) || hit.contains(e)); };
  const out = []; let n = 0; const vus = new Set();
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let t;
  while((t = tw.nextNode())){
    const s = t.nodeValue.trim(); if(!s || !/[\p{L}\p{N}]/u.test(s)) continue; const pe = t.parentElement;
    if(!pe || vus.has(pe) || !vis(pe) || pe.closest(".info-tip,.deco,style,script,#som-racine,button:disabled,.ferme-env,[disabled],.ferme,select,option")) continue;
    const cl = maquette(pe); if(!cl) continue; vus.add(pe);
    pe.scrollIntoView({block: "center"}); if(!dessus(pe)) continue;
    let op = 1; for(let x = pe; x && x !== document.documentElement; x = x.parentElement) op *= +getComputedStyle(x).opacity;
    const cs = getComputedStyle(pe); let echelle = 1;
    for(let x = pe; x && x !== document.documentElement; x = x.parentElement){ const cx = getComputedStyle(x); const mm = /matrix\(([-\d.e]+), ?([-\d.e]+)/.exec(cx.transform || ""); if(mm) echelle *= Math.hypot(+mm[1], +mm[2]); }
    pe.setAttribute("data-g19", n);
    out.push({i: n++, texte: s.slice(0, 60), cls: cl, color: cs.color, op, taille: parseFloat(cs.fontSize) * echelle, gras: +cs.fontWeight >= 700});
  }
  return out;
}
function rects19(){
  const out = {};
  document.querySelectorAll("[data-g19]").forEach(e => { const l = [];
    Array.from(e.childNodes).filter(c => c.nodeType === 3 && c.nodeValue.trim()).forEach(c => { const r = document.createRange(); r.selectNodeContents(c); Array.from(r.getClientRects()).forEach(q => { if(q.width > 1 && q.height > 1) l.push([q.left, q.top, q.right, q.bottom]); }); });
    out[e.getAttribute("data-g19")] = l; });
  return out;
}
function cacher19(oui){
  let st = document.getElementById("g19-st");
  if(oui){ if(!st){ st = document.createElement("style"); st.id = "g19-st"; document.head.appendChild(st); }
    st.textContent = "[data-g19]{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}"; }
  else if(st) st.remove();
}
// dans une page d'aide : deux captures, décodées, comparées sous les lettres
function mesurer19(a){
  return Promise.all([a.img0, a.img1].map(b64 => new Promise(ok => { const im = new Image(); im.onload = () => { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const x = c.getContext("2d"); x.drawImage(im, 0, 0); ok(x.getImageData(0, 0, im.width, im.height)); }; im.src = "data:image/png;base64," + b64; })))
    .then(([A, B]) => {
      const W = A.width, H = A.height, res = {};
      for(const id in a.rects){
        const rs = a.rects[id]; if(!rs.length) continue;
        const R = [], G = [], Bl = []; let lettres = 0, total = 0;
        for(const q of rs){ const x0 = Math.max(0, Math.floor(q[0])), y0 = Math.max(0, Math.floor(q[1])), x1 = Math.min(W, Math.ceil(q[2])), y1 = Math.min(H, Math.ceil(q[3]));
          for(let y = y0; y < y1; y++) for(let x = x0; x < x1; x++){ const i = (y * W + x) * 4; total++;
            if(Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]) > 30){ lettres++; R.push(B.data[i]); G.push(B.data[i + 1]); Bl.push(B.data[i + 2]); } } }
        if(lettres < 3) continue;
        const med = l => { l.sort((x, y) => x - y); return l[l.length >> 1]; };
        res[id] = {fond: [med(R), med(G), med(Bl)], lettres, total};
      }
      return res;
    });
}
function contraste(c1, c2){ const lum = c => { const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const a = lum(c1), b = lum(c2); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); }
async function garde19(page, aide, cle, T, site){
  const out = [], tag = "garde 19. " + cle + " @" + T.w + "×" + T.h;
  const textes = await page.evaluate(marquer19, {site}); if(!textes.length) return out;
  const parI = {}; textes.forEach(t => { parI[t.i] = t; });
  const H = await page.evaluate(() => document.documentElement.scrollHeight), vus = new Set(), faibles = [];
  for(let y = 0; y < H; y += T.h){
    await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(40);
    const rects = await page.evaluate(rects19), dedans = {};
    for(const id in rects){ if(vus.has(id)) continue; const rs = rects[id].filter(q => q[1] >= 0 && q[3] <= T.h && q[0] >= 0 && q[2] <= T.w); if(rs.length && rs.length === rects[id].length){ dedans[id] = rs; } }
    if(!Object.keys(dedans).length) continue;
    const img0 = (await page.screenshot({animations: "disabled"})).toString("base64");
    await page.evaluate(cacher19, true); await page.waitForTimeout(20);
    const img1 = (await page.screenshot({animations: "disabled"})).toString("base64");
    await page.evaluate(cacher19, false);
    const m = await aide.evaluate(mesurer19, {img0, img1, rects: dedans});
    for(const id in m){ vus.add(id); const t = parI[id], col = (t.color.match(/[\d.]+/g) || []).map(Number), al = (col.length > 3 ? col[3] : 1) * t.op, f = m[id].fond;
      const c2 = [0, 1, 2].map(i => col[i] * al + f[i] * (1 - al)), cr = contraste(c2, f), grand = t.taille >= 24 || (t.taille >= 18.6 && t.gras);
      if(cr < (grand ? 3 : 4.5)) faibles.push(cr.toFixed(2) + " « " + t.texte + " » (." + t.cls + ", " + t.color + " sur rgb(" + f.join(", ") + "))"); }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  [...new Set(faibles)].forEach(x => out.push(tag + " : contraste " + x));
  return out;
}

/* ════════ Garde 20 — chaque changement vu par l'élève est nommé ════════ */
// les textes vus par l'élève, bloc par bloc (moitié de gauche, moitié de droite, page), comme AUDITS/MAQUETTE-QCM-COMPLEMENT-3-12-10/scripts/eleve-diff.js
function lireBlocs20(){
  const docs = [document]; document.querySelectorAll("iframe").forEach(f => { try { docs.push(f.contentDocument); } catch(e){} });
  const out = [];
  docs.forEach((d, di) => {
    const all = [...d.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); const W = d.defaultView.innerWidth; return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
    const tops = all.filter(e => !all.some(o => o !== e && o.contains(e)));
    if(tops.length >= 2){ tops.sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x).forEach((e, i) => out.push({bloc: "doc" + di + (i === 0 ? "-gauche" : i === 1 ? "-droite" : "-" + i), t: e.innerText}));
      let reste = d.body.innerText; tops.forEach(e => { reste = reste.replace(e.innerText, ""); }); out.push({bloc: "doc" + di + "-hors", t: reste}); }
    else out.push({bloc: "doc" + di, t: d.body.innerText});
  });
  return out;
}
const ligne20 = s => s.replace(/[\s\u00a0\u202f\u2009]+/g, " ").trim();
// la différence d'un bloc : les lignes de la v7 qui manquent à la v9, les lignes de la v9 qui manquent à la v7 (avec leur nombre)
function diffBloc(t7, t9){
  const c = s => { const o = new Map(); String(s || "").split("\n").map(ligne20).filter(Boolean).forEach(l => o.set(l, (o.get(l) || 0) + 1)); return o; };
  const a = c(t7), b = c(t9), moins = [], plus = [];
  a.forEach((n, l) => { const k = n - (b.get(l) || 0); for(let i = 0; i < k; i++) moins.push(l); });
  b.forEach((n, l) => { const k = n - (a.get(l) || 0); for(let i = 0; i < k; i++) plus.push(l); });
  return {moins, plus};
}
const RAISONS = ["typographie", "retouche 778", "émoji décoratif retiré", "texte lu en entier", "donnée du scénario", "élément de la 7.7.1", "geste qui se voit", "correction 4"];
function chargerListe20(){ const f = path.join(__dirname, "existant", "eleve-v7-v9.json"); return fs.existsSync(f) ? JSON.parse(lire(f)) : {lignes: []}; }
// releves : {"scène@largeur": {bloc: {v7, v9}}} ; chaque différence doit avoir sa ligne dans la liste, et chaque ligne de la liste sa différence
function garde20(releves, liste){
  const out = [], dispo = new Map();
  liste.lignes.forEach((x, i) => {
    if(!RAISONS.some(r => String(x.raison).indexOf(r) === 0)) out.push("garde 20. eleve-v7-v9.json, ligne " + (i + 1) + " (" + x.scene + ") : la raison « " + x.raison + " » n'est pas une des huit");
    const k = x.scene + "@" + x.vue + "|" + x.bloc; (dispo.get(k) || dispo.set(k, []).get(k)).push(Object.assign({i, pris7: x.v7 == null, pris9: x.v9 == null}, x)); });
  for(const sv in releves) for(const bloc in releves[sv]){
    const d = diffBloc(releves[sv][bloc].v7, releves[sv][bloc].v9), l = dispo.get(sv + "|" + bloc) || [];
    d.moins.forEach(x => { const e = l.find(y => !y.pris7 && y.v7 === x); if(e) e.pris7 = true; else out.push("garde 20. " + sv + " [" + bloc + "] : la ligne de la v7 « " + x.slice(0, 110) + " » n'est plus vue par l'élève, et eleve-v7-v9.json ne la nomme pas"); });
    d.plus.forEach(x => { const e = l.find(y => !y.pris9 && y.v9 === x); if(e) e.pris9 = true; else out.push("garde 20. " + sv + " [" + bloc + "] : la ligne « " + x.slice(0, 110) + " » est nouvelle pour l'élève, et eleve-v7-v9.json ne la nomme pas"); });
  }
  dispo.forEach(l => l.forEach(e => { const vu = Object.prototype.hasOwnProperty.call(releves, e.scene + "@" + e.vue);
    if(vu && (!e.pris7 || !e.pris9)) out.push("garde 20. eleve-v7-v9.json, ligne " + (e.i + 1) + " (" + e.scene + "@" + e.vue + " [" + e.bloc + "]) : la différence nommée ne se retrouve pas — « " + String(e.v7 == null ? "" : e.v7).slice(0, 60) + " » → « " + String(e.v9 == null ? "" : e.v9).slice(0, 60) + " »"); }));
  return out;
}

module.exports = {base, param, momentPage, seancePage, evalJouee, manques, competencesDe, titreChap, lireStructure, garde16Structure, pdfFige, lirePdf, garde17,
  lireMoment18, garde18, marquer19, rects19, cacher19, mesurer19, garde19, lireBlocs20, diffBloc, garde20, chargerListe20, RAISONS, ligne20, NOMS_RE};
