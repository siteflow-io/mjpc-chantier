// QCM-4 · BANC — « La séance rouverte » (DEFAUTS-OUVERTS, section « Le temps tapé, et la note d'une séance arrêtée avant la fin », points 12 à 14,
// validés par Paul le 21/10 à 09:45) : la lecture de Paul (« Lire les copies ») compte toujours, aussi pendant qu'une séance rouverte tourne.
// Par le geste, sur le faux hub, une évaluation de 4 questions (écrite dans CE faux hub : les 3 questions de l'évaluation d'essai, puis la 4e de
// « 3e- éval 1 Analyse logique », complétée pour être prête), deux élèves sur une tablette, quatre séances en même temps :
//  R1, R2. (points 13 et 16) Q4 écartée (« ❌ Écarter » : la correction ne se lance qu'après la dernière question) ; Q1 et Q2 révélées, Q3 lue par
//     les voisins, pas révélée ; « 🛑 Terminer » ; le soir, « ✅ Oui » sur Q3 : la note complète ; « 🔓 Rouvrir » : la console part de ce qui a été
//     fait (jamais « ▶️ Lancer Q1 », Q1 à Q3 faites, Q4 « ❌ Écartée — pas posée » avec « ↩️ Remettre », le bouton principal « 🛑 Terminer ») et Q3
//     compte pendant qu'elle tourne. R1 : « ↩️ Remettre » Q4 → « ▶️ Lancer Q4 », Q4 jouée et corrigée, la note sur 4. R2 : « 🛑 Terminer », sur 3.
//  P. Q1 à Q3 jouées, sans correction en classe ; « 🛑 Terminer » ; le soir, Paul lit Q1 à Q3 ; « 🔓 Rouvrir », « ▶️ Lancer Q4 » : pendant qu'elle
//     tourne, Q1 à Q3 comptent ; terminée de nouveau, la note sur 4.
//  M. (la mesure pour la question de Paul, « et si je ne lis pas les copies le soir ? », sans rien corriger) la séance de P, rouverte SANS la lecture
//     du soir, Q4 posée : la correction en classe propose-t-elle Q3 (« 💡 Révéler ») ? Ce qui est vu s'écrit en notes.
// La séance exacte du point 13 (Q3 lue par le voisin pendant la correction, Q4 jamais lancée, puis lancée dans la séance rouverte) ne se joue pas
// par le geste : la correction ne se lance qu'après la dernière question ; R1 et P en jouent les deux moitiés.
//   APP_FILE=<app> node banc/banc-rouverte-21-10.js <dossier de sortie>   → rouverte.txt, captures-rouverte/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, choisir, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "rouverte-" + Date.now()));
const CAP = path.join(SORTIE, "captures-rouverte"); fs.mkdirSync(CAP, {recursive: true});
const H1 = "QCM-1 · SOCLE", H3 = "QCM-3 · SOIR", H13 = H1 + ", " + H3, BANC = "QCM-4 · BANC";
const JR = new O.Journal(), JR2 = new O.Journal(), JP = new O.Journal(), JM = new O.Journal();
const t0 = Date.now();
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return "captures-rouverte/" + f; };
const note = (J, s) => { J.l.push({note: s}); console.log("  note   " + s); };
const SRC = require(path.join(O.RACINE, "AUDITS", "QCM-MODE-TEST-09-10", "banc", "evals_now.json"))["eval_1791393134857"];
const ESSAI = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const Q4 = Object.assign({}, SRC.questions[3], {niveau: SRC.questions[3].niveau || "standard", reflexion: 20, reponse: 15, competences: ["c4-lire-01"], verifie: "l'analyse logique, question 4", bonus: false, longueurAssumee: false});
const E4 = Object.assign({}, ESSAI, {titre: "Essai rouvert en 4 questions", questions: ESSAI.questions.concat([Q4])});
const L = l => Array.isArray(l) ? l : l && typeof l === "object" ? Object.keys(l).sort((a, b) => a - b).map(k => l[k]) : [];
const bonnesDe = (ev, qi) => L(ev.questions[qi].bonnes).map(i => ev.questions[qi].choix[i]);
const NAVS = [];
setTimeout(() => { for(const J of [JR, JR2, JP, JM]) J.v(false, BANC, "plafond de 9 minutes atteint"); ecrire(); process.exit(0); }, 540000).unref();

// ── une séance : le faux hub (avec l'évaluation de 4 questions), la console, deux élèves sur une tablette, les autres absents ──
async function seance(J){
  const {B, srv, port} = await O.fauxHub(B => { B.tree.qcm.evaluations.banc_4 = E4; });
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer(); NAVS.push(A);
  let dernier = null;
  const sid = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; return id || dernier; };
  const S = () => { const id = sid(); return id ? JSON.parse(JSON.stringify(srv.store.get("qcm/sessions/" + id) || {})) : {}; };
  const etat = () => S().deroule || {};
  const prof = await A.ouvrir("console", "?mode=prof", 1536, 1000);
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
  await choisir(prof, /3 ESSAI|3e Essai/); await pause(200); await choisir(prof, /Essai rouvert en 4 questions/); await pause(300);
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
async function jouerQ(X, qi, rep){
  const {prof, t1, M, etat} = X;
  await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800); await cliquer(prof, /Autoriser la réponse/); await pause(1500);
  const fait = new Set();
  for(let k = 0; k < 120 && !/close/.test(etat().ph || ""); k++){
    for(const [c, sl] of M){ const z = await zoneTexte(t1, c), cle = (etat().tour || 1) + ":" + sl;
      if(/la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z)){ await cliquer(t1, /Oui, la même chose/, c); continue; }
      if(!fait.has(cle) && (await O.choixOuverts(t1, c, L(E4.questions[qi].choix))).length){ for(const x of rep(sl)) await cliquer(t1, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); } }
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
const iNote = c => (c || []).findIndex((v, i) => i > 0 && /^\d+(,\d)?\/\d+/.test(v));
const noteC = c => { const i = iNote(c); return i < 0 ? {note: "", s20: "", q: []} : {note: c[i], s20: c[i + 1], q: c.slice(1, i)}; };
async function ouvrirCopie(prof, nm){ const ini = slug(nm.split(" ")[0]).slice(0, 4);
  const ok = await prof.click("[data-initiales='1']", {timeout: 3000}).then(() => true).catch(() => false);
  if(ok){ await prof.keyboard.press("Control+A"); await prof.keyboard.type(ini, {delay: 60}); await pause(500); await prof.keyboard.press("Enter"); await pause(1200); }
  return ok && (await texte(prof)).includes("📄 " + nm); }
async function ouiLigne(prof, qi){
  const r = await prof.evaluate(qi => { const l = [...document.querySelectorAll("[data-ligne]")].find(d => (d.querySelector("strong") || {}).textContent === "Question " + (qi + 1)); if(!l) return {ok: false, vu: "pas de ligne Q" + (qi + 1)};
    const txt = l.innerText.replace(/\s+/g, " ").trim(); const b = [...l.querySelectorAll("button")].find(b => /✅ Oui/.test(b.textContent));
    if(!b) return {ok: false, vu: "pas de « ✅ Oui » : " + txt.slice(0, 200)}; b.click(); return {ok: true, txt}; }, qi).catch(e => ({ok: false, vu: e.message}));
  await pause(1300); return r; }
// lire une ligne sans lecture du voisin : le bouton qui ouvre « Que dit la copie ? », les choix, puis « Enregistrer » (repris de banc-arret)
async function lireLigne(prof, qi, choix){
  const r = await prof.evaluate(qi => { const l = [...document.querySelectorAll("[data-ligne]")].find(d => (d.querySelector("strong") || {}).textContent === "Question " + (qi + 1)); if(!l) return {ok: false, vu: "pas de ligne Q" + (qi + 1)};
    const txt = l.innerText.replace(/\s+/g, " ").trim(); const bs = [...l.querySelectorAll("button")];
    const b = bs.find(b => b.classList.contains("btn-ghost") && !/Annuler/.test(b.textContent)) || bs[0];
    if(!b) return {ok: false, vu: "pas de bouton : " + txt.slice(0, 200)}; l.setAttribute("data-banc-l", "1"); b.click(); return {ok: true, txt}; }, qi).catch(e => ({ok: false, vu: e.message}));
  await pause(600);
  if(r.ok){ for(const c of choix) await cliquer(prof, new RegExp("^" + esc(c) + "$"), "[data-banc-l='1']", {apres: 150});
    r.ok = await prof.evaluate(() => { const l = document.querySelector("[data-banc-l='1']"); const b = l && [...l.querySelectorAll("button.btn-primary")].find(b => !b.disabled); if(!b) return false; b.click(); return true; }).catch(() => false); }
  await prof.evaluate(() => document.querySelectorAll("[data-banc-l]").forEach(x => x.removeAttribute("data-banc-l"))).catch(() => {});
  await pause(1300); return r; }
// un bouton de la ligne d'une question dans « 📋 Toutes les questions » ([data-q]) : « ❌ Écarter » (puis la confirmation) ou « ↩️ Remettre »
async function gesteQ(prof, q, re){ return prof.evaluate(([q, src]) => { const re = new RegExp(src); const l = document.querySelector(".pilot-q-mini[data-q='" + q + "']"); if(!l) return false;
  const b = [...l.querySelectorAll("button")].find(b => re.test(b.textContent) && !b.disabled); if(!b) return false; b.click(); return true; }, [q, re.source]).catch(() => false); }
const boutons = prof => prof.evaluate(() => [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0).map(b => b.textContent.trim()).filter(t => /Lancer|Révéler|Question suivante|Rouvrir|Reprendre|Terminer|correction|autoévaluation|Remettre/.test(t))).catch(() => []);

// Q1 faux pour les deux, Q2 juste pour l'élève 1 et faux pour l'élève 2, Q3 juste
const REPDE = x2 => [() => ["Milan"], sl => sl === x2 ? ["Genève"] : ["Madrid", "Berlin"], () => ["8"]];
// R : Q4 écartée (pour lancer la correction après Q3) ; la correction : Q1 et Q2 révélées, Q3 lue par les voisins, pas révélée ; « 🛑 Terminer »
async function arretApresCorrection(J, X){
  const {prof, t1, M, etat, S} = X, REP = REPDE(M[1][1]);
  const okE = await gesteQ(prof, 4, /❌ Écarter/); await pause(700); const okE2 = await cliquer(prof, /^❌ Écarter la question 4$/); await pause(1200);
  J.v(okE && okE2 && L(S().ecartees).map(Number).includes(3), BANC, "« ❌ Écarter » Q4 avant la séance (pour lancer la correction après Q3)", JSON.stringify({ecarter: okE, confirmer: okE2, ecartees: S().ecartees}));
  for(let qi = 0; qi < 3; qi++) await jouerQ(X, qi, REP[qi]);
  await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
  for(const [c] of M) await cliquer(t1, /Maîtrise satisfaisante/, c);
  await cliquer(prof, /Lancer la correction/); await pause(900);
  for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence la correction$/, c); }
  await pause(1200); await cliquer(prof, /Commencer la correction/); await pause(1500);
  const ordre = L(S().ordreCorr).map(Number);
  J.v(JSON.stringify(ordre) === "[0,1,2]", BANC, "la correction lit Q1, Q2, puis Q3 (Q4 écartée)", JSON.stringify(ordre));
  // sur la moitié de chaque élève, son voisin lit SA feuille (8.0.3) : il y clique ce que l'élève a écrit
  for(let i = 0; i < 3; i++){
    const qi = ordre[i];
    for(const [c, sl] of M){ for(const t of REP[qi](sl)) await cliquer(t1, new RegExp("^" + esc(t) + "$"), c, {apres: 150}); }
    await pause(900);
    if(i < 2){ await cliquer(prof, /Révéler/); await pause(1200); await cliquer(prof, /Question suivante/); await pause(1200); }
  }
  const lec = (S().lectures || {})[2] || {};
  J.v(etat().ph === "lecture" && Number(etat().qi) === 2 && Object.keys(lec).length === 2, BANC, "Q3 en lecture, lue par les deux voisins, pas révélée", JSON.stringify({deroule: etat(), lectures: lec, revelees: S().revelees}));
  note(J, "pendant la correction, la liste « 📋 Toutes les questions » (et son « ↩️ Remettre ») n'est pas à la console : la ligne de Q4 est " + (await prof.evaluate(() => !!document.querySelector(".pilot-q-mini[data-q='4']")).catch(() => false) ? "là" : "absente"));
  await terminer(prof);
  J.v(S().etat === "terminee", BANC, "« 🛑 Terminer » : la séance est terminée après Q3", JSON.stringify({etat: S().etat}));
}
// P et M : Q1 à Q3 jouées, sans correction en classe (elle ne se lance qu'après la dernière question) ; « 🛑 Terminer »
async function arretSansCorrection(J, X){
  const {prof, M, S} = X, REP = REPDE(M[1][1]);
  for(let qi = 0; qi < 3; qi++) await jouerQ(X, qi, REP[qi]);
  await terminer(prof);
  J.v(S().etat === "terminee" && L(S().questionsLancees).length === 3, BANC, "Q1 à Q3 jouées, « 🛑 Terminer » : la séance est terminée, Q4 jamais lancée", JSON.stringify({etat: S().etat, lancees: S().questionsLancees}));
}
// « 🔓 Rouvrir » la séance terminée, puis « 🔓 Rouvrir la séance »
async function rouvrir(J, X, pref){
  const {prof, S} = X;
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
  const okR = await cliquer(prof, /🔓 Rouvrir/); await pause(700); const okR2 = await cliquer(prof, /^🔓 Rouvrir la séance$/); await pause(1500);
  for(let k = 0; k < 3; k++){ if(await cliquer(prof, /^🚀 Lancer la séance$/)) await pause(1500); }
  J.v(okR && okR2 && S().etat !== "terminee", H3, pref + "« 🔓 Rouvrir » la séance terminée, puis « 🔓 Rouvrir la séance » : elle tourne", JSON.stringify({etat: S().etat}) + " ; " + await capt(prof, pref.replace(/\W+/g, "") + "rouvrir"));
}
// après « 🔓 Rouvrir », la tablette redemande les codes : les deux élèves s'y entrent de nouveau
async function rentrer(J, X, pref){
  const {t1, M, nomDe, codeDe} = X;
  const z = (await zoneTexte(t1, "g")).replace(/\s+/g, " ");
  if(/Identifie-toi/.test(z) || !/Q\d|Je commence|prêt/.test(z)){
    await O.entrerTablette(t1, [["g", nomDe(M[0][1])], ["d", nomDe(M[1][1])]], codeDe);
    for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence$/, c); }
    await pause(800); }
  note(J, pref + "la tablette après « 🔓 Rouvrir » : « " + z.slice(0, 100) + " » ; les élèves s'y entrent de nouveau");
}
async function lancerQ4(J, X, pref){
  const {prof, S} = X;
  let okQ4 = false; for(let k = 0; k < 10 && !okQ4; k++){ okQ4 = await cliquer(prof, /Lancer Q4\b/); if(!okQ4){ await cliquer(prof, /▶️ Reprendre/); await pause(800); } }
  await pause(1500);
  J.v(okQ4 && Object.keys(S().questionsLancees || {}).map(Number).includes(3), H3, pref + "« ▶️ Lancer Q4 » : Q4 lancée", JSON.stringify({lancees: S().questionsLancees, deroule: S().deroule, gestes: await boutons(prof)}) + " ; " + await capt(prof, pref.replace(/\W+/g, "") + "q4"));
  return okQ4;
}
// la note en cours et le tableau de la séance (Données → Résultats), pendant que la séance rouverte tourne
async function enCours(J, X, pref, attendu){
  const {prof, M, nomDe, deuxNotes} = X, [x1, x2] = M.map(m => m[1]);
  const d = await deuxNotes(x1);
  J.v(d.base && d.base.st && d.base.st.slice(0, 3) === attendu, H1, pref + "pendant que la séance rouverte tourne, " + nomDe(x1) + " : Q1 à Q3, lues par Paul, comptent (« " + attendu + " », jamais « pas encore lue »), dans la base", JSON.stringify(d));
  J.v(d.c4 && d.c4.st && d.c4.st.slice(0, 3) === attendu, H3, pref + "… et dans c4 (resultatLocalV)", JSON.stringify(d));
  J.v(JSON.stringify(d.base) === JSON.stringify(d.c4), H13, pref + "en cours : la même note dans la base et dans c4", JSON.stringify(d));
  note(J, pref + "en cours, " + nomDe(x2) + " : " + JSON.stringify(await deuxNotes(x2)));
  const okT = await ouvrirSeance(prof); const c = okT ? await ligneTab(prof, x1) : null;
  note(J, pref + "en cours, Données → Résultats : " + (okT ? "la séance s'ouvre ; la ligne de " + nomDe(x1) + " : " + JSON.stringify(c) : "la séance qui tourne n'y est pas (« 📊 Ouvrir » absent)") + " ; " + await capt(prof, pref.replace(/\W+/g, "") + "resultats-en-cours"));
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
}

// la console d'une séance rouverte (point 15) : les lignes de « 📋 Toutes les questions », les gestes, le bouton principal (le plus grand)
const console4 = prof => prof.evaluate(() => {
  const vis = b => b.getBoundingClientRect().width > 0;
  const lignes = [1, 2, 3, 4].map(q => { const l = document.querySelector(".pilot-q-mini[data-q='" + q + "']"); if(!l) return null;
    return {q, cls: l.className, txt: l.innerText.replace(/\s+/g, " ").slice(-110), btns: [...l.querySelectorAll("button")].filter(vis).map(b => b.textContent.trim())}; });
  const bs = [...document.querySelectorAll("button")].filter(vis).filter(b => !b.closest("[data-q]"));
  const grand = bs.map(b => { const r = b.getBoundingClientRect(); return {t: b.textContent.trim(), a: r.width * r.height}; }).sort((x, y) => y.a - x.a)[0];
  const t = document.body.innerText;
  return {lignes, gestes: bs.map(b => b.textContent.trim()).filter(x => /Lancer|Terminer|Reprendre|autoévaluation|correction/.test(x)), principal: grand ? grand.t : "", avenir: (t.match(/À VENIR[^\n]*/) || [""])[0], attente: (t.match(/⏳ En attente[^\n]*/) || [""])[0]};
}).catch(e => ({erreur: e.message}));
// la correction en classe après la dernière question : l'autoévaluation, puis chaque question en lecture lue par le voisin et révélée
async function corrigerEnClasse(J, X, pref){
  const {prof, t1, M, S, etat} = X, REP = REPDE(M[1][1]);
  const okA = await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
  if(okA){ for(const [c] of M) await cliquer(t1, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(900);
    for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence la correction$/, c); }
    await pause(1200); await cliquer(prof, /Commencer la correction/); await pause(1500); }
  const vus = [];
  for(let i = 0; i < 5; i++){
    const d = etat(); if(d.ph !== "lecture") break; const qi = Number(d.qi);
    for(const [c, sl] of M){ for(const t of (qi < 3 ? REP[qi](sl) : bonnesDe(E4, 3))) await cliquer(t1, new RegExp("^" + esc(t) + "$"), c, {apres: 150}); }
    await pause(900);
    const okRev = await cliquer(prof, /Révéler/); await pause(1200);
    vus.push({q: "Q" + (qi + 1), reveler: okRev});
    if(!await cliquer(prof, /Question suivante/)) break; await pause(1200);
  }
  note(J, pref + "la correction en classe : « 📊 Lancer l'autoévaluation » " + okA + " ; ordreCorr " + JSON.stringify(S().ordreCorr) + " ; " + JSON.stringify(vus) + " ; revelees " + JSON.stringify(S().revelees));
  return {okA, vus};
}
// Q4 jouée (les élèves rentrés sur la tablette), jusqu'à la question close
async function jouerQ4(J, X, pref){
  const {prof, t1, M, etat, S} = X;
  await cliquer(prof, /Autoriser la réponse/); await pause(1500);
  const fait = new Set();
  for(let k = 0; k < 120 && !/close/.test(etat().ph || ""); k++){
    for(const [c, sl] of M){ const z = await zoneTexte(t1, c), cle = (etat().tour || 1) + ":" + sl;
      if(/la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z)){ await cliquer(t1, /Oui, la même chose/, c); continue; }
      if(!fait.has(cle) && (await O.choixOuverts(t1, c, L(E4.questions[3].choix))).length){ for(const x of bonnesDe(E4, 3)) await cliquer(t1, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); } }
    if(etat().ph === "reponse" && k > 4) await cliquer(prof, /Tour suivant/);
    await pause(350);
  }
  if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
  J.v(/close/.test(etat().ph || "") && Object.keys((S().reponses || {})[3] || {}).length === 2, BANC, pref + "Q4 jouée par les deux élèves, close", JSON.stringify({deroule: etat(), reponses: Object.keys((S().reponses || {})[3] || {})}));
}

// ════════════ R. Q4 écartée ; Q3 lue par les voisins, pas révélée ; le soir « ✅ Oui » ; « 🔓 Rouvrir » : la console part de ce qui a été fait ════════════
//   remet : « ↩️ Remettre » Q4, « ▶️ Lancer Q4 », Q4 jouée et corrigée : la note sur 4 ; sinon « 🛑 Terminer » : la note sur 3
async function partieR(J, remet){
  const P = remet ? "R1, " : "R2, ";
  try {
    J.section(P.slice(0, 2) + ". Q4 écartée ; Q1 et Q2 révélées, Q3 lue par les voisins, pas révélée ; « 🛑 Terminer » ; le soir, « ✅ Oui » sur Q3");
    const X = await seance(J);
    const {prof, M, S, nomDe, deuxNotes} = X;
    const [x1, x2] = M.map(m => m[1]);
    await arretApresCorrection(J, X);
    const d0 = await deuxNotes(x1);
    J.v(d0.base && d0.base.st && d0.base.st[2] === "n" && !d0.base.complet && JSON.stringify(d0.base) === JSON.stringify(d0.c4), H13, P + "avant la lecture du soir : Q3 « pas encore lue », la même dans la base et dans c4", JSON.stringify(d0));
    J.v(await ouvrirSeance(prof), H3, P + "Données → Résultats → « 📊 Ouvrir » la séance");
    J.v(await clic(prof, /📄 Lire les copies/) || await clic(prof, /^\d+ feuilles? à lire$/), H3, P + "« 📄 Lire les copies »");
    for(const x of [x1, x2]){
      const nm = nomDe(x);
      J.v(await ouvrirCopie(prof, nm), H3, P + "« Lire les copies » : la copie de " + nm, (await texte(prof)).slice(0, 200));
      const r = await ouiLigne(prof, 2);
      J.v(r.ok, H3, P + nm + ", Q3 : « ✅ Oui » (la lecture de Paul, la même que celle du voisin)", (r.txt || r.vu || "").slice(0, 300));
    }
    const d1 = await deuxNotes(x1);
    J.v(d1.base && d1.base.complet && d1.base.n === 2 && d1.base.total === 3 && d1.base.st.slice(0, 3) === "fjj" && JSON.stringify(d1.base) === JSON.stringify(d1.c4), H13, P + "après la lecture du soir : 2 / 3 complète (Q1 faux, Q2 et Q3 justes ; Q4 écartée), la même dans la base et dans c4", JSON.stringify(d1));
    J.section(P + "« 🔓 Rouvrir » : la console part de ce qui a été fait ; Q3 compte pendant qu'elle tourne");
    await rouvrir(J, X, P);
    const C = await console4(prof); const cC = await capt(prof, P.replace(/\W+/g, "") + "console");
    const vu = JSON.stringify(C) + " ; " + cC;
    J.v(!C.gestes.some(t => /Lancer Q[123]\b/.test(t)) && !/Lancer Q[123]\b/.test(C.attente), "QCM-2 · HEURE", P + "la séance rouverte : jamais « ▶️ Lancer Q1 » (ni Q2, ni Q3, déjà posées)", vu);
    J.v(C.lignes.slice(0, 3).every(l => l && !l.btns.some(b => /Écarter/.test(b))) && !/À VENIR — Q ?[123]\b/.test(C.avenir), "QCM-2 · HEURE", P + "« 📋 Toutes les questions » : Q1 à Q3 faites (ni « à venir », ni « ❌ Écarter »)", vu);
    J.v(!!C.lignes[3] && /Écartée — pas posée/.test(C.lignes[3].txt) && C.lignes[3].btns.some(b => /↩️ Remettre/.test(b)), "QCM-2 · HEURE", P + "Q4 : « ❌ Écartée — pas posée » avec « ↩️ Remettre »", vu);
    J.v(/Terminer/.test(C.principal) && !C.gestes.some(t => /Lancer Q\d/.test(t)), "QCM-2 · HEURE", P + "le bouton principal : « 🛑 Terminer » (aucune question à poser)", vu);
    await enCours(J, X, P, "fjj");
    if(remet){
      J.section(P + "« ↩️ Remettre » Q4 → « ▶️ Lancer Q4 » ; Q4 jouée et corrigée : la note sur 4");
      const okRem = await gesteQ(prof, 4, /↩️ Remettre/); await pause(1200);
      const C2 = await console4(prof);
      J.v(okRem && !L(S().ecartees).map(Number).includes(3) && C2.gestes.some(t => /Lancer Q4\b/.test(t)), "QCM-2 · HEURE", P + "« ↩️ Remettre » Q4 : la console propose « ▶️ Lancer Q4 »", JSON.stringify({remettre: okRem, ecartees: S().ecartees, console: C2}) + " ; " + await capt(prof, "R1-remise"));
      await rentrer(J, X, P);
      if(await lancerQ4(J, X, P)){
        await jouerQ4(J, X, P);
        const r = await corrigerEnClasse(J, X, P);
        J.v(r.vus.some(v => v.q === "Q4" && v.reveler), "QCM-2 · HEURE", P + "Q4 corrigée en classe (« 💡 Révéler »)", JSON.stringify(r));
      }
      await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
      await terminer(prof);
      const d3 = await deuxNotes(x1);
      J.v(d3.base && d3.base.total === 4 && d3.base.n === 3 && d3.base.complet && d3.base.st === "fjjj" && JSON.stringify(d3.base) === JSON.stringify(d3.c4), H13, P + "terminée de nouveau : 3 / 4 complète (« fjjj »), la même dans la base et dans c4", JSON.stringify(d3));
    } else {
      J.section(P + "sans remettre Q4 : « 🛑 Terminer » de nouveau : la note sur 3");
      await terminer(prof);
      const d3 = await deuxNotes(x1);
      J.v(d3.base && d3.base.total === 3 && d3.base.complet && d3.base.st.slice(0, 3) === "fjj" && JSON.stringify(d3.base) === JSON.stringify(d3.c4), H13, P + "terminée de nouveau : 2 / 3 complète, Q3 comptée, la même dans la base et dans c4", JSON.stringify(d3));
    }
  } catch(e){ J.v(false, BANC, P + "la séance s'est interrompue : " + e.message); }
}

// ════════════ P. sans correction en classe : Paul lit Q1 à Q3 le soir ; « 🔓 Rouvrir », « ▶️ Lancer Q4 » : Q1 à Q3 comptent ; terminée : sur 4 ════════════
async function partieP(){
  const J = JP;
  try {
    J.section("P. Q1 à Q3 jouées, pas corrigées en classe ; « 🛑 Terminer » ; le soir, Paul lit Q1 à Q3 (« Lire les copies »)");
    const X = await seance(J);
    const {prof, M, nomDe, deuxNotes} = X;
    const [x1, x2] = M.map(m => m[1]), REP = REPDE(x2);
    await arretSansCorrection(J, X);
    J.v(await ouvrirSeance(prof), H3, "Données → Résultats → « 📊 Ouvrir » la séance");
    J.v(await clic(prof, /📄 Lire les copies/) || await clic(prof, /^\d+ feuilles? à lire$/), H3, "« 📄 Lire les copies »");
    for(const x of [x1, x2]){
      const nm = nomDe(x);
      J.v(await ouvrirCopie(prof, nm), H3, "« Lire les copies » : la copie de " + nm, (await texte(prof)).slice(0, 200));
      for(let qi = 0; qi < 3; qi++){ const r = await lireLigne(prof, qi, REP[qi](x)); if(!r.ok) J.v(false, H3, nm + ", Q" + (qi + 1) + " : Paul lit la feuille", r.vu || "« Enregistrer » absent"); }
    }
    const d1 = await deuxNotes(x1);
    J.v(d1.base && d1.base.complet && d1.base.n === 2 && d1.base.total === 3 && d1.base.st.slice(0, 3) === "fjj" && JSON.stringify(d1.base) === JSON.stringify(d1.c4), H13, "après la lecture du soir : 2 / 3 complète (Q4 jamais lancée, hors du total), la même dans la base et dans c4", JSON.stringify(d1));
    J.section("P : « 🔓 Rouvrir », « ▶️ Lancer Q4 » : pendant qu'elle tourne, Q1 à Q3 comptent");
    await rouvrir(J, X, "P, ");
    await lancerQ4(J, X, "P, ");
    await enCours(J, X, "P, ", "fjj");
    J.section("P : « 🛑 Terminer » de nouveau : la note sur 4, Q1 à Q3 comptées");
    await terminer(prof);
    const d3 = await deuxNotes(x1);
    note(J, "P, terminée de nouveau : " + JSON.stringify(d3));
    J.v(d3.base && d3.base.total === 4 && d3.base.st.slice(0, 3) === "fjj" && JSON.stringify(d3.base) === JSON.stringify(d3.c4), H13, "terminée de nouveau : la note sur 4, Q1 à Q3 comptées, la même dans la base et dans c4", JSON.stringify(d3));
  } catch(e){ JP.v(false, BANC, "la séance P s'est interrompue : " + e.message); }
}

// ════════════ M. la mesure : rouverte SANS la lecture du soir, Q4 posée : Q1 à Q3 se corrigent-elles en classe ? ════════════
async function partieM(){
  const J = JM;
  try {
    J.section("M (mesure, rien ne se corrige) : la même séance que P, rouverte sans la lecture du soir ; Q4 posée ; Q1 à Q3 se corrigent-elles en classe (« 💡 Révéler ») ?");
    const X = await seance(J);
    const {prof, t1, M, S, etat, deuxNotes} = X;
    const [x1] = M.map(m => m[1]);
    await arretSansCorrection(J, X);
    note(J, "terminée, sans lecture du soir : " + JSON.stringify(await deuxNotes(x1)));
    await rouvrir(J, X, "M, ");
    await rentrer(J, X, "M, ");
    if(await lancerQ4(J, X, "M, ")){
      await cliquer(prof, /Autoriser la réponse/); await pause(1500);
      note(J, "la tablette, Q4 lancée : « " + (await zoneTexte(t1, "g")).replace(/\s+/g, " ").slice(0, 160) + " »");
      const fait = new Set();
      for(let k = 0; k < 120 && !/close/.test(etat().ph || ""); k++){
        for(const [c, sl] of M){ const z = await zoneTexte(t1, c), cle = (etat().tour || 1) + ":" + sl;
          if(/la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z)){ await cliquer(t1, /Oui, la même chose/, c); continue; }
          if(!fait.has(cle) && (await O.choixOuverts(t1, c, L(E4.questions[3].choix))).length){ for(const x of bonnesDe(E4, 3)) await cliquer(t1, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); } }
        if(etat().ph === "reponse" && k > 4) await cliquer(prof, /Tour suivant/);
        await pause(350);
      }
      if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
      J.v(/close/.test(etat().ph || ""), BANC, "M : Q4 jouée, close", JSON.stringify({deroule: etat(), reponses: Object.keys((S().reponses || {})[3] || {})}));
      note(J, "Q4 close, les gestes de la console : " + JSON.stringify(await boutons(prof)) + " (" + await capt(prof, "M-q4-close") + ")");
      const okA = await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
      note(J, "« 📊 Lancer l'autoévaluation » : " + (okA ? "présent, cliqué" : "absent") + " ; deroule : " + JSON.stringify(etat()));
      const vus = [];
      if(okA){
        for(const [c] of M) await cliquer(t1, /Maîtrise satisfaisante/, c);
        const okC = await cliquer(prof, /Lancer la correction/); await pause(900);
        for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence la correction$/, c); }
        await pause(1200); const okC2 = await cliquer(prof, /Commencer la correction/); await pause(1500);
        note(J, "« 📝 Lancer la correction » " + okC + ", « Commencer la correction » " + okC2 + " ; ordreCorr : " + JSON.stringify(S().ordreCorr) + " ; deroule : " + JSON.stringify(etat()));
        // tant que la correction avance : le voisin lit ce que l'élève a écrit, puis « 💡 Révéler » et « Question suivante »
        const REP = REPDE(M[1][1]);
        for(let i = 0; i < 5; i++){
          const d = etat(); if(d.ph !== "lecture") break; const qi = Number(d.qi);
          for(const [c, sl] of M){ for(const t of (qi < 3 ? REP[qi](sl) : bonnesDe(E4, 3))) await cliquer(t1, new RegExp("^" + esc(t) + "$"), c, {apres: 150}); }
          await pause(900);
          const okRev = await cliquer(prof, /Révéler/); await pause(1200);
          vus.push({q: "Q" + (qi + 1), reveler: okRev, revelees: S().revelees});
          if(!await cliquer(prof, /Question suivante/)) break; await pause(1200);
        }
        note(J, "la correction en classe, question par question : " + JSON.stringify(vus) + " ; " + await capt(prof, "M-correction"));
      }
      const corr = vus.filter(v => v.reveler).map(v => v.q);
      note(J, "MESURE : " + (!okA ? "après Q4, la console ne propose pas « 📊 Lancer l'autoévaluation » : Q1 à Q3 ne se corrigent pas en classe"
        : "la correction de la séance rouverte lit " + JSON.stringify(L(S().ordreCorr).map(q => "Q" + (Number(q) + 1))) + " ; révélées en classe : " + JSON.stringify(corr) + (corr.includes("Q3") ? " — Q3 se corrige en classe" : " — Q3 ne se corrige pas en classe")));
      note(J, "la note après la correction en classe : " + JSON.stringify(await deuxNotes(x1)));
      await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
      await terminer(prof);
      note(J, "terminée de nouveau, sans lecture du soir : " + JSON.stringify(await deuxNotes(x1)));
    }
  } catch(e){ JM.v(false, BANC, "la mesure M s'est interrompue : " + e.message); }
}

let ecrit = false;
function ecrire(){
  if(ecrit) return; ecrit = true;
  const tous = [JR, JR2, JP, JM], v = tous.reduce((a, j) => a + j.verifs.length, 0), e = tous.reduce((a, j) => a + j.echecs.length, 0);
  let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(x){}
  const lignes = j => j.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  const out = "vérifications : " + v + " · échecs : " + e + "\n" + tous.map(lignes).join("\n");
  fs.writeFileSync(path.join(SORTIE, "rouverte.txt"), "Points 12, 13 et 16 (Paul, 21/10 09:45 et 14:48), la séance rouverte : la lecture du soir, la console après un écart, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
  console.log(out);
}
(async () => {
  await Promise.all([partieR(JR, true), partieR(JR2, false), partieP(), partieM()]);
  for(const A of NAVS) for(const p of A.pages) JR.v(!p.__err.length, BANC, p.__nom + " : aucune erreur de page", p.__err.slice(0, 3).join(" | "));
  for(const A of NAVS) try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
})();
