// QCM-4 · BANC — « Le temps tapé, et la note d'une séance arrêtée avant la fin » (DEFAUTS-OUVERTS), points 7 à 10, tranchés par Paul le 20/10 à 08:49 :
// une question jamais lancée sort du total (« Q4 à Q11 pas posées ») ; une question lancée, lue en classe par le voisin mais pas révélée, reste
// « pas encore lue » jusqu'à la lecture de Paul le soir (« Lire les copies », « ✅ Oui »). Par le geste, sur le faux hub, trois séances :
//  A. une évaluation de 11 questions (écrite dans CE faux hub, d'après « 3e- éval 1 Analyse logique », complétée pour être prête) : Q1 à Q3 jouées,
//     « 🛑 Terminer » : la note sur 3, « Q4 à Q11 pas posées » au tableau de la séance et au PDF, jamais « écartée » ; le soir, Paul lit Q1 à Q3
//     (« Lire les copies ») : la note complète, la même dans la base, c4, le tableau, le CSV, Résultats, le PDF, le bilan de l'élève (Q1 à Q3 seulement) ;
//     puis « 🔓 Rouvrir » la séance et « ▶️ Lancer Q4 » : Q4 revient dans le total.
//  B. « Évaluation d'essai » (3 questions) : la correction ; Q1 et Q2 révélées ; Q3 lue par les voisins, pas révélée ; « 🛑 Terminer » :
//     Q3 « pas encore lue » ; le soir, « Lire les copies » propose Q3 avec la lecture du voisin, « ✅ Oui » : la note complète, la même partout.
//  C. l'évaluation de 11 questions, Q1 à Q3 jouées, « ⏸️ Finir à une autre heure » : Q4 à Q11 restent dans le total (sur 11).
// La séance exacte du point 10 (11 questions, Q1 et Q2 révélées, Q3 en lecture, Q4 à Q11 jamais lancées) n'est pas jouable par le geste : la correction
// ne se lance qu'après la dernière question (« 📊 Lancer l'autoévaluation »). A et B en couvrent les deux moitiés.
//   APP_FILE=<app> node banc/banc-arret-20-10.js <dossier de sortie>   → arret.txt, captures-arret/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, choisir, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "arret-" + Date.now()));
const CAP = path.join(SORTIE, "captures-arret"); fs.mkdirSync(CAP, {recursive: true});
const H1 = "QCM-1 · SOCLE", H3 = "QCM-3 · SOIR", H13 = H1 + ", " + H3, BANC = "QCM-4 · BANC";
const JA = new O.Journal(), JB = new O.Journal(), JC = new O.Journal();
const t0 = Date.now();
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return "captures-arret/" + f; };
const note = (J, s) => { J.l.push({note: s}); console.log("  note   " + s); };
const fr1 = x => (Math.round(x * 10) / 10).toString().replace(".", ",");
const SRC = require(path.join(O.RACINE, "AUDITS", "QCM-MODE-TEST-09-10", "banc", "evals_now.json"))["eval_1791393134857"];
const E11 = {titre: SRC.titre, chapitre: "3e-ch1", mode: "strict", createdAt: SRC.createdAt, updatedAt: SRC.updatedAt,
  questions: SRC.questions.slice(0, 11).map((q, i) => Object.assign({}, q, {niveau: q.niveau || "standard", reflexion: 20, reponse: 15, competences: ["c4-lire-01"], verifie: "l'analyse logique, question " + (i + 1), bonus: false, longueurAssumee: false}))};
const ESSAI = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const L = l => Array.isArray(l) ? l : l && typeof l === "object" ? Object.keys(l).sort((a, b) => a - b).map(k => l[k]) : [];
const bonnesDe = (ev, qi) => L(ev.questions[qi].bonnes).map(i => ev.questions[qi].choix[i]);
const NAVS = [];
setTimeout(() => { for(const J of [JA, JB, JC]) J.v(false, BANC, "plafond de 9 minutes atteint"); ecrire(); process.exit(0); }, 540000).unref();

// ── une séance : le faux hub (avec l'évaluation de 11 questions), la console, deux élèves sur une tablette, les autres absents ──
async function seance(J, evNom){
  const {B, srv, port} = await O.fauxHub(B => { B.tree.qcm.evaluations.banc_11 = E11; });
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer(); NAVS.push(A);
  let dernier = null;
  const sid = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; return id || dernier; };
  const S = () => { const id = sid(); return id ? JSON.parse(JSON.stringify(srv.store.get("qcm/sessions/" + id) || {})) : {}; };
  const etat = () => S().deroule || {};
  const prof = await A.ouvrir("console", "?mode=prof", 1536, 1000);
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
  await choisir(prof, /3 ESSAI|3e Essai/); await pause(200); await choisir(prof, evNom); await pause(300);
  await cliquer(prof, /Lancer la séance/); await pause(800);
  const paires = await prof.evaluate(() => { try { return SCN.binomesProposes("3 ESSAI"); } catch(e){ return null; } }) || [];
  const gN = (paires.find(p => p && p[0] && p[1]) || []).map(String).map(nomDe);
  for(const e of B.eleves) if(!gN.includes(e.nomComplet)) await cliquer(prof, new RegExp("^(✓|🚫)?\\s*" + esc(e.nomComplet) + "$", "u"), null, {apres: 40});
  await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
  await pause(1500);
  const T = Object.values(S().places || {}).find(t => t.g && t.d);
  if(!T) throw new Error("pas de tablette à deux élèves");
  const t1 = await A.tablette("tablette-1", "3 ESSAI");
  await O.entrerTablette(t1, [["g", nomDe(T.g)], ["d", nomDe(T.d)]], codeDe);
  const M = [["g", T.g], ["d", T.d]];
  for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence$/, c); }
  await pause(800);
  const deuxNotes = x => prof.evaluate(([x, id]) => { const o = {}; const f = a => a ? {n: a.n, total: a.total, complet: !!a.complet, sur20: Math.round(a.sur20 * 10) / 10, st: (a.st || []).join("")} : null;
    try { o.base = f(SCN.note(x, undefined, id)); } catch(e){ o.base = "erreur : " + e.message; }
    try { o.c4 = f(resultatV(seanceV(id), x)); } catch(e){ o.c4 = "erreur : " + e.message; }
    return o; }, [x, dernier]).catch(e => ({erreur: e.message}));
  return {B, srv, A, prof, t1, M, S, etat, sid, nomDe, codeDe, deuxNotes, dernier: () => dernier};
}
// jouer la question qi : chacun répond rep(sl), B « Oui » ; jusqu'à la question close
async function jouerQ(X, ev, qi, rep){
  const {prof, t1, M, etat} = X;
  await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800); await cliquer(prof, /Autoriser la réponse/); await pause(1500);
  const fait = new Set();
  for(let k = 0; k < 120 && !/close/.test(etat().ph || ""); k++){
    for(const [c, sl] of M){ const z = await zoneTexte(t1, c), cle = (etat().tour || 1) + ":" + sl;
      if(/la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z)){ await cliquer(t1, /Oui, la même chose/, c); continue; }
      if(!fait.has(cle) && (await O.choixOuverts(t1, c, L(ev.questions[qi].choix))).length){ for(const x of rep(sl)) await cliquer(t1, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); } }
    if(etat().ph === "reponse" && k > 4) await cliquer(prof, /Tour suivant/);
    await pause(350);
  }
  if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
}
const terminer = async prof => { await cliquer(prof, /Terminer la séance/); await pause(600); await cliquer(prof, /^🛑 Terminer la séance$|Terminer la séance/); await pause(2000); };
const clic = (p, re, zone) => cliquer(p, re, zone, {apres: 700});
async function ouvrirSeance(prof){ await clic(prof, /^Données$/); await clic(prof, /^📊 Résultats$|Résultats/);
  const ok = await prof.evaluate(() => { const b = [...document.querySelectorAll("button, [data-va]")].filter(b => b.getBoundingClientRect().width > 0 && /📊 Ouvrir/.test(b.textContent))[0]; if(!b) return false; document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return true; }).catch(() => false);
  if(ok){ await prof.click("[data-c='1']").catch(() => {}); await pause(1200); } return ok; }
const ligneTab = (prof, sl) => prof.evaluate(sl => { const tr = document.querySelector("tr[data-eleve='" + sl + "']"); return tr ? [...tr.querySelectorAll("td")].map(td => td.innerText.replace(/\s+/g, " ").trim()) : null; }, sl).catch(() => null);
// la colonne de la note (« n/N … »), puis « Sur 20 » : après les colonnes des questions, quel que soit leur nombre
const iNote = c => (c || []).findIndex((v, i) => i > 0 && /^\d+(,\d)?\/\d+/.test(v));
const noteC = c => { const i = iNote(c); return i < 0 ? {note: "", s20: "", q: []} : {note: c[i], s20: c[i + 1], q: c.slice(1, i), maitrise: c[i + 2]}; };
const enTete = prof => prof.evaluate(() => { const t = document.body.innerText; const m = t.match(/[^\n]*questions écartées ou annulées[^\n]*/); return m ? m[0] : ""; }).catch(() => "");
const noteDirecte = prof => prof.evaluate(() => { const e = document.querySelector("[data-note-directe]"); return e ? e.innerText.replace(/\s+/g, " ").trim() : ""; }).catch(() => "");
async function ouvrirCopie(prof, nm){ const ini = slug(nm.split(" ")[0]).slice(0, 4);
  const ok = await prof.click("[data-initiales='1']", {timeout: 3000}).then(() => true).catch(() => false);
  if(ok){ await prof.keyboard.press("Control+A"); await prof.keyboard.type(ini, {delay: 60}); await pause(500); await prof.keyboard.press("Enter"); await pause(1200); }
  return ok && (await texte(prof)).includes("📄 " + nm); }
// lire une ligne : « ✏️ … » (ou le bouton qui ouvre « Que dit la copie ? »), les choix, puis « Enregistrer » ; ou « ✅ Oui »
async function lireLigne(prof, qi, choix, oui){
  const r = await prof.evaluate(([qi, oui]) => { const l = [...document.querySelectorAll("[data-ligne]")].find(d => (d.querySelector("strong") || {}).textContent === "Question " + (qi + 1)); if(!l) return {ok: false, vu: "pas de ligne Q" + (qi + 1)};
    const txt = l.innerText.replace(/\s+/g, " ").trim(); const bs = [...l.querySelectorAll("button")];
    const b = oui ? bs.find(b => /✅ Oui/.test(b.textContent)) : (bs.find(b => b.classList.contains("btn-ghost") && !/Annuler/.test(b.textContent)) || bs[0]);
    if(!b) return {ok: false, vu: "pas de bouton : " + txt.slice(0, 200)}; l.setAttribute("data-banc-l", "1"); b.click(); return {ok: true, txt}; }, [qi, oui]).catch(e => ({ok: false, vu: e.message}));
  await pause(600);
  if(r.ok && !oui){ for(const c of choix) await cliquer(prof, new RegExp("^" + esc(c) + "$"), "[data-banc-l='1']", {apres: 150});
    r.ok = await prof.evaluate(() => { const l = document.querySelector("[data-banc-l='1']"); const b = l && [...l.querySelectorAll("button.btn-primary")].find(b => !b.disabled); if(!b) return false; b.click(); return true; }).catch(() => false); }
  await prof.evaluate(() => document.querySelectorAll("[data-banc-l]").forEach(x => x.removeAttribute("data-banc-l"))).catch(() => {});
  await pause(1300); return r; }
// la note complète, sur tous les écrans du soir (tableau, fiche, CSV, Résultats, PDF, bilan de l'élève)
async function partout(J, X, x, attN, attT, pref){
  const {prof, srv, nomDe, codeDe, A} = X, nm = nomDe(x), s20 = fr1(attN * 20 / attT), re = new RegExp("^" + attN + "/" + attT + "(?!\\d)");
  await clic(prof, /← Tableau de la séance/); await pause(800);
  const c = await ligneTab(prof, x);
  const nc = noteC(c); J.v(!!c && re.test(nc.note) && !/pas encore lue/.test(nc.note) && nc.s20 === s20, H3, pref + "le tableau de la séance, " + nm + " : " + attN + "/" + attT + " · " + s20 + ", sans « pas encore lues »", JSON.stringify(c));
  const dl = prof.waitForEvent("download", {timeout: 5000}).catch(() => null);
  const okCsv = await cliquer(prof, /Export CSV/); const d = await dl;
  if(okCsv && d){ const f = path.join(SORTIE, "arret-" + Date.now() + ".csv"); await d.saveAs(f).catch(() => {}); const csv = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
    const lg = csv.split(/\r?\n/).find(l => l.includes(nm.split(" ")[0])) || "";
    J.v(new RegExp("(^|;)" + attN + "/" + attT + "(;| |$)").test(lg) && lg.includes(s20) && !/pas encore lue/.test(lg), H3, pref + "le CSV, " + nm + " : " + attN + "/" + attT + " et " + s20, lg.slice(0, 200)); }
  else J.v(false, H3, pref + "« 📥 Export CSV »", okCsv ? "aucun téléchargement" : "bouton absent");
  await clic(prof, /^📊 Résultats$/); await pause(600);
  const tR = await texte(prof); J.v(!/pas encore lue/.test(tR) && !/écartée/.test(tR.replace(/questions écartées ou annulées/g, "")), H3, pref + "Données → Résultats : ni « pas encore lue », ni « écartée »", (tR.match(/[^\n]*(pas encore lue|écartée)[^\n]*/) || [""])[0]);
  const okRe = await cliquer(prof, /rendre les copies ▸/); let okRe2 = false; if(okRe){ await pause(500); okRe2 = await cliquer(prof, /^Rendre les copies$|^📤 Rendre|^Rendre$/); await pause(1200); }
  J.v(!!(srv.store.get("qcm/sessions/" + X.dernier() + "/copies") || {}).rendues, BANC, pref + "les copies rendues", "« rendre les copies ▸ » " + okRe + ", « Rendre » " + okRe2 + " ; " + await capt(prof, pref.replace(/\W+/g, "") + "rendre"));
  await ouvrirSeance(prof);
  const fen = prof.context().waitForEvent("page", {timeout: 6000}).catch(() => null);
  const okPdf = await cliquer(prof, /PDF notes et compétences/); const pdf = await fen;
  let tp = "";
  if(pdf){ await pdf.waitForLoadState().catch(() => {}); await pause(1000); tp = await texte(pdf); await capt(pdf, pref.replace(/\W+/g, "") + "pdf");
    J.v(tp.includes(s20) && !/pas encore lue/.test(tp), H3, pref + "le PDF : " + s20 + ", sans « pas encore lue »", (tp.split("\n").find(l => l.includes(nm.split(" ")[0])) || "").slice(0, 200)); await pdf.close().catch(() => {}); }
  else J.v(false, H3, pref + "« 📄 PDF notes et compétences » ouvre sa fenêtre", okPdf ? "aucune fenêtre" : "bouton absent ou fermé");
  const el = await A.ouvrir("eleve-" + slug(nm).slice(0, 8), "?mode=eleve", 1280, 800);
  await O.entrer1(el, null, nm, codeDe(nm)); await pause(1500);
  let te = await texte(el); if(!/ \/ 20/.test(te)){ await cliquer(el, /📊 Mes évaluations/); await pause(1200); te = await texte(el); }
  const cE = await capt(el, pref.replace(/\W+/g, "") + "eleve");
  J.v(new RegExp(attN + " \\/ " + attT + "(?!\\d)").test(te) && te.includes(s20), H13, pref + "le bilan de " + nm + " (« 📊 Mes évaluations ») : " + attN + " / " + attT + " · " + s20 + " / 20", ((te.match(/[^\n]*\/ 20[^\n]*/g) || []).join(" | ") || te.slice(0, 300)) + " ; " + cE);
  return {pdf: tp};
}

// ════════════ A. 11 questions, Q1 à Q3 jouées, « 🛑 Terminer » ; le soir ; puis « 🔓 Rouvrir » et Q4 ════════════
async function partieA(){
  const J = JA;
  try {
    J.section("A. « 3e- éval 1 Analyse logique » (11 questions) : Q1 à Q3 jouées, justes ; « 🛑 Terminer »");
    const X = await seance(J, /Analyse logique/);
    const {prof, nomDe, deuxNotes, M, srv} = X;
    for(let qi = 0; qi < 3; qi++) await jouerQ(X, E11, qi, () => bonnesDe(E11, qi));
    await terminer(prof);
    const sid = X.dernier(); const sf = srv.store.get("qcm/sessions/" + sid) || {};
    J.v(sf.etat === "terminee", BANC, "la séance est terminée après Q3", JSON.stringify({etat: sf.etat, lancees: sf.questionsLancees}));
    const [x1, x2] = M.map(m => m[1]);
    const d0 = await deuxNotes(x1);
    J.v(d0.base && d0.base.total === 3 && d0.c4 && d0.c4.total === 3, H13, "Q4 à Q11, jamais lancées, sortent du total : la note est sur 3 (la base et c4)", JSON.stringify(d0));
    J.v(d0.base && d0.base.n === 0 && !d0.base.complet && JSON.stringify(d0.base) === JSON.stringify(d0.c4), H13, "avant la lecture du soir : 0 / 3, pas complète, la même dans la base et dans c4", JSON.stringify(d0));
    J.v(await ouvrirSeance(prof), H3, "Données → Résultats → « 📊 Ouvrir » la séance");
    const et = await enTete(prof), c0 = await ligneTab(prof, x1), cT = await capt(prof, "A-tableau-avant");
    J.v(/Q4 à Q11 pas posées/.test(et) && !/Q\d+[^·]*écartée/.test(et), H3, "en tête du tableau de la séance : « Q4 à Q11 pas posées », jamais « écartée »", "« " + et + " » ; " + cT);
    J.v(!!c0 && /^0\/3/.test(noteC(c0).note) && /3 questions pas encore lues/.test(noteC(c0).note), H3, "le tableau de la séance, " + nomDe(x1) + " : « 0/3 », « 3 questions pas encore lues » (Q4 à Q11 n'y comptent pas)", JSON.stringify(c0));
    J.v(!!c0 && c0.length && !noteC(c0).q.some(v => /écart/i.test(v)), H3, "le tableau de la séance : aucune case « écartée » pour Q4 à Q11", JSON.stringify(c0));
    J.section("A, le soir : Paul lit Q1 à Q3 de chaque copie");
    J.v(await clic(prof, /📄 Lire les copies/) || await clic(prof, /^\d+ feuilles? à lire$/), H3, "« 📄 Lire les copies »", await capt(prof, "A-lire-copies"));
    for(const x of [x1, x2]){
      J.v(await ouvrirCopie(prof, nomDe(x)), H3, "« Lire les copies » : la copie de " + nomDe(x), (await texte(prof)).slice(0, 200));
      for(let qi = 0; qi < 3; qi++){ const r = await lireLigne(prof, qi, bonnesDe(E11, qi), false);
        if(!r.ok) J.v(false, H3, nomDe(x) + ", Q" + (qi + 1) + " : Paul lit la feuille", r.vu || "« Enregistrer » absent"); }
      const tq = await texte(prof);
      J.v(!/Question (4|5|6|7|8|9|10|11)\b/.test((tq.match(/📄 [^\n]*[\s\S]*/) || [""])[0].slice(0, 3000)), H3, nomDe(x) + " : « Lire les copies » ne propose pas Q4 à Q11", (tq.match(/Question (4|5|6|7|8|9|10|11)[^\n]*/) || [""])[0]);
      const d = await deuxNotes(x), nd = await noteDirecte(prof);
      J.v(d.base && d.base.n === 3 && d.base.total === 3 && d.base.complet && JSON.stringify(d.base) === JSON.stringify(d.c4), H13, nomDe(x) + ", Q1 à Q3 lues : 3 / 3, complète, la même dans la base et dans c4", JSON.stringify(d));
      J.v(/Note : [^·]*3 \/ 3/.test(nd) && !/pas encore lue/.test(nd), H3, nomDe(x) + " : « 🧮 La note, en direct » dit 3 / 3", nd.slice(0, 300));
    }
    const p = await partout(J, X, x1, 3, 3, "A, ");
    J.v(/Q4 à Q11 pas posées/.test(p.pdf) && !/Q4[^\n]*écartée/.test(p.pdf), H3, "A, le PDF, la ligne « Questions : … » : « Q4 à Q11 pas posées »", (p.pdf.match(/[^\n]*Questions ?:[^\n]*/) || [p.pdf.slice(0, 200)])[0]);
    J.section("A : « 🔓 Rouvrir » la séance, « ▶️ Lancer Q4 » : Q4 revient dans le total");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
    const okR = await cliquer(prof, /🔓 Rouvrir/); await pause(700); const okR2 = await cliquer(prof, /^🔓 Rouvrir la séance$/); await pause(1500);
    J.v(okR && okR2, H3, "« 🔓 Rouvrir » la séance terminée, puis « 🔓 Rouvrir la séance »", (await texte(prof)).slice(0, 300) + " ; " + await capt(prof, "A-rouvrir"));
    for(let k = 0; k < 3; k++){ if(await cliquer(prof, /^🚀 Lancer la séance$/)) await pause(1500); }
    let okQ4 = false; for(let k = 0; k < 10 && !okQ4; k++){ okQ4 = await cliquer(prof, /Lancer Q4\b/); if(!okQ4){ await cliquer(prof, /▶️ Reprendre/); await pause(800); } }
    await pause(1500); const d4 = await deuxNotes(x1); const c4cap = await capt(prof, "A-q4");
    J.v(okQ4 && d4.base && d4.base.total === 4 && d4.c4 && d4.c4.total === 4, H13, "la séance rouverte lance Q4 : Q4 revient dans le total (sur 4), la base et c4", "Lancer Q4 : " + okQ4 + " · " + JSON.stringify(d4) + " ; " + c4cap);
  } catch(e){ J.v(false, BANC, "la séance A s'est interrompue : " + e.message); }
}

// ════════════ B. « Évaluation d'essai » : Q1 et Q2 révélées, Q3 lue par les voisins, pas révélée ; « 🛑 Terminer » ════════════
async function partieB(){
  const J = JB;
  try {
    J.section("B. « Évaluation d'essai » : Q1 et Q2 révélées, Q3 lue par les voisins, pas révélée ; « 🛑 Terminer »");
    const X = await seance(J, /Évaluation d'essai/);
    const {prof, t1, M, etat, S, nomDe, deuxNotes} = X;
    const [x1, x2] = M.map(m => m[1]);
    // Q1 faux pour les deux, Q2 faux pour l'élève 2, Q3 juste : la correction lit Q1, Q2, puis Q3
    const REP = [() => ["Milan"], sl => sl === x2 ? ["Genève"] : ["Madrid", "Berlin"], () => ["8"]];
    for(let qi = 0; qi < 3; qi++) await jouerQ(X, ESSAI, qi, REP[qi]);
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
    for(const [c] of M) await cliquer(t1, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(900);
    for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence la correction$/, c); }
    await pause(1200); await cliquer(prof, /Commencer la correction/); await pause(1500);
    const ordre = L(S().ordreCorr).map(Number);
    J.v(JSON.stringify(ordre) === "[0,1,2]", BANC, "la correction lit Q1, Q2, puis Q3", JSON.stringify(ordre));
    // chaque lecteur lit sur la feuille du voisin ce que le voisin a cliqué
    for(let i = 0; i < 3; i++){
      const qi = ordre[i];
      for(const [c, sl] of M){ const v = M.find(m => m[1] !== sl)[1]; for(const t of REP[qi](v)) await cliquer(t1, new RegExp("^" + esc(t) + "$"), c, {apres: 150}); }
      await pause(900);
      if(i < 2){ await cliquer(prof, /Révéler/); await pause(1200); await cliquer(prof, /Question suivante/); await pause(1200); }
    }
    const lec = (S().lectures || {})[2] || {};
    J.v(etat().ph === "lecture" && Number(etat().qi) === 2 && Object.keys(lec).length === 2, BANC, "Q3 en lecture, lue par les deux voisins, pas révélée", JSON.stringify({deroule: etat(), lectures: lec, revelees: S().revelees}));
    await terminer(prof);
    const d0 = await deuxNotes(x1);
    J.v(d0.base && d0.base.st && d0.base.st[2] === "n" && !d0.base.complet && JSON.stringify(d0.base) === JSON.stringify(d0.c4), H13, "Q3, lue en classe par le voisin mais pas révélée : « pas encore lue », la même dans la base et dans c4", JSON.stringify(d0));
    J.v(await ouvrirSeance(prof), H3, "Données → Résultats → « 📊 Ouvrir » la séance");
    const c0 = await ligneTab(prof, x1); await capt(prof, "B-tableau-avant");
    J.v(!!c0 && /1 question pas encore lue/.test(noteC(c0).note), H3, "le tableau de la séance, " + nomDe(x1) + " : « 1 question pas encore lue »", JSON.stringify(c0));
    J.section("B, le soir : « Lire les copies » propose Q3 avec la lecture du voisin ; « ✅ Oui »");
    J.v(await clic(prof, /📄 Lire les copies/) || await clic(prof, /^\d+ feuilles? à lire$/), H3, "« 📄 Lire les copies »");
    for(const x of [x1, x2]){
      const nm = nomDe(x), v = nomDe(M.find(m => m[1] !== x)[1]).split(" ").slice(1).join(" ");
      J.v(await ouvrirCopie(prof, nm), H3, "« Lire les copies » : la copie de " + nm, (await texte(prof)).slice(0, 200));
      const r = await lireLigne(prof, 2, [], true); const cL = await capt(prof, "B-lire-" + slug(nm).slice(0, 8));
      J.v(r.ok && /lu par/i.test(r.txt || "") && (r.txt || "").includes(v), H3, nm + ", Q3 : la ligne propose la lecture du voisin (« lu par " + v + " ») et « ✅ Oui »", (r.txt || r.vu || "").slice(0, 300) + " ; " + cL);
      const d = await deuxNotes(x), nd = await noteDirecte(prof);
      J.v(d.base && d.base.complet && d.base.total === 3 && JSON.stringify(d.base) === JSON.stringify(d.c4), H13, nm + ", après « ✅ Oui » : la note complète, la même dans la base et dans c4", JSON.stringify(d));
      J.v(/Note : /.test(nd) && !/pas encore lue/.test(nd), H3, nm + " : « 🧮 La note, en direct », sans « pas encore lue »", nd.slice(0, 300));
    }
    // élève 1 : Q1 faux, Q2 juste, Q3 juste → 2 / 3
    await partout(J, X, x1, 2, 3, "B, ");
  } catch(e){ J.v(false, BANC, "la séance B s'est interrompue : " + e.message); }
}

// ════════════ C. 11 questions, Q1 à Q3, « ⏸️ Finir à une autre heure » : Q4 à Q11 restent dans le total ════════════
async function partieC(){
  const J = JC;
  try {
    J.section("C. « 3e- éval 1 Analyse logique » : Q1 à Q3 jouées ; « ⏸️ Finir à une autre heure »");
    const X = await seance(J, /Analyse logique/);
    const {prof, M, deuxNotes, srv} = X;
    for(let qi = 0; qi < 3; qi++) await jouerQ(X, E11, qi, () => bonnesDe(E11, qi));
    const ok1 = await cliquer(prof, /Finir à une autre heure/); await pause(700); const ok2 = await cliquer(prof, /^⏸️ Finir à une autre heure$/); await pause(1800);
    const sf = srv.store.get("qcm/sessions/" + X.dernier()) || {};
    J.v(ok1 && ok2 && sf.etat !== "terminee", BANC, "« ⏸️ Finir à une autre heure » : la séance en pause (pas terminée)", JSON.stringify({etat: sf.etat, reprise: !!sf.reprise, ph: (sf.deroule || {}).ph}) + " ; " + await capt(prof, "C-pause"));
    const d = await deuxNotes(M[0][1]);
    J.v(d.base && d.base.total === 11 && d.c4 && d.c4.total === 11, H13, "la séance en pause garde Q4 à Q11 dans le total (sur 11), la base et c4", JSON.stringify(d));
  } catch(e){ J.v(false, BANC, "la séance C s'est interrompue : " + e.message); }
}

let ecrit = false;
function ecrire(){
  if(ecrit) return; ecrit = true;
  const tous = [JA, JB, JC], v = tous.reduce((a, j) => a + j.verifs.length, 0), e = tous.reduce((a, j) => a + j.echecs.length, 0);
  let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(x){}
  const lignes = j => j.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  const out = "vérifications : " + v + " · échecs : " + e + "\n" + tous.map(lignes).join("\n");
  fs.writeFileSync(path.join(SORTIE, "arret.txt"), "Points 7 à 10 (29 tranché par Paul, 20/10), la séance arrêtée avant la fin, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
  console.log(out);
}
(async () => {
  await Promise.all([partieA(), partieB(), partieC()]);
  for(const A of NAVS) for(const p of A.pages) JB.v(!p.__err.length, BANC, p.__nom + " : aucune erreur de page", p.__err.slice(0, 3).join(" | "));
  for(const A of NAVS) try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
})();
