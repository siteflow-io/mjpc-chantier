// QCM-4 · BANC — « La séance rouverte » (DEFAUTS-OUVERTS, section « Le temps tapé, et la note d'une séance arrêtée avant la fin », points 12 à 14,
// validés par Paul le 21/10 à 09:45) : la lecture de Paul (« Lire les copies ») compte toujours, aussi pendant qu'une séance rouverte tourne.
// Par le geste, sur le faux hub, une évaluation de 4 questions (écrite dans CE faux hub : les 3 questions de l'évaluation d'essai, puis la 4e de
// « 3e- éval 1 Analyse logique », complétée pour être prête), deux élèves sur une tablette :
//  R. (point 13) Q1 à Q3 jouées ; la correction : Q1 et Q2 révélées, Q3 lue par les voisins, pas révélée ; « 🛑 Terminer » ; le soir, « ✅ Oui » sur Q3 :
//     la note complète ; « 🔓 Rouvrir », « ▶️ Lancer Q4 » : pendant qu'elle tourne, Q3 compte (jamais « pas encore lue »), la même note dans la base,
//     dans c4 et au tableau de la séance ; terminée de nouveau, la note sur 4, Q3 comptée.
//  M. (point 13, la mesure pour la question de Paul, sans rien corriger) la même séance, rouverte SANS la lecture du soir, Q4 posée : peut-on corriger
//     Q3 en classe (« 💡 Révéler ») ? Ce qui est vu s'écrit en notes.
// La séance exacte (Q4 jamais lancée, la correction faite avant elle) ne se joue pas autrement : la correction ne se lance qu'après la dernière
// question (« 📊 Lancer l'autoévaluation »). Le banc écarte donc Q4 pendant la séance (« ❌ Écarter »), et la remet (« ↩️ Remettre ») après « 🔓 Rouvrir ».
//   APP_FILE=<app> node banc/banc-rouverte-21-10.js <dossier de sortie>   → rouverte.txt, captures-rouverte/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, choisir, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "rouverte-" + Date.now()));
const CAP = path.join(SORTIE, "captures-rouverte"); fs.mkdirSync(CAP, {recursive: true});
const H1 = "QCM-1 · SOCLE", H3 = "QCM-3 · SOIR", H13 = H1 + ", " + H3, BANC = "QCM-4 · BANC";
const JR = new O.Journal(), JM = new O.Journal();
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
setTimeout(() => { for(const J of [JR, JM]) J.v(false, BANC, "plafond de 9 minutes atteint"); ecrire(); process.exit(0); }, 540000).unref();

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
// un bouton de la ligne d'une question dans « 📋 Toutes les questions » ([data-q]) : « ❌ Écarter » (puis la confirmation) ou « ↩️ Remettre »
async function gesteQ(prof, q, re){ return prof.evaluate(([q, src]) => { const re = new RegExp(src); const l = document.querySelector("[data-q='" + q + "']"); if(!l) return false;
  const b = [...l.querySelectorAll("button")].find(b => re.test(b.textContent) && !b.disabled); if(!b) return false; b.click(); return true; }, [q, re.source]).catch(() => false); }
const boutons = prof => prof.evaluate(() => [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0).map(b => b.textContent.trim()).filter(t => /Lancer|Révéler|Question suivante|Rouvrir|Reprendre|Terminer|correction|autoévaluation|Remettre/.test(t))).catch(() => []);

// Q1 faux pour les deux, Q2 juste pour l'élève 1 et faux pour l'élève 2, Q3 juste ; la correction : Q1 et Q2 révélées, Q3 lue par les voisins
async function jusquaLArret(J, X){
  const {prof, t1, M, etat, S} = X;
  const x2 = M[1][1];
  const REP = [() => ["Milan"], sl => sl === x2 ? ["Genève"] : ["Madrid", "Berlin"], () => ["8"]];
  // Q4 écartée avant la fin de Q3 : la correction peut se lancer après Q3
  const okE = await gesteQ(prof, 4, /❌ Écarter/); await pause(700); const okE2 = await cliquer(prof, /^❌ Écarter la question 4$/); await pause(1200);
  J.v(okE && okE2 && !!(S().ecartees || {})[3], BANC, "« ❌ Écarter » Q4 avant la séance (pour lancer la correction après Q3)", JSON.stringify({ecarter: okE, confirmer: okE2, ecartees: S().ecartees}));
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
  await terminer(prof);
  J.v(S().etat === "terminee", BANC, "« 🛑 Terminer » : la séance est terminée après Q3", JSON.stringify({etat: S().etat}));
}
// « 🔓 Rouvrir » la séance terminée, « ↩️ Remettre » Q4, « ▶️ Lancer Q4 »
async function rouvrirQ4(J, X, pref){
  const {prof, S} = X;
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
  const okR = await cliquer(prof, /🔓 Rouvrir/); await pause(700); const okR2 = await cliquer(prof, /^🔓 Rouvrir la séance$/); await pause(1500);
  for(let k = 0; k < 3; k++){ if(await cliquer(prof, /^🚀 Lancer la séance$/)) await pause(1500); }
  J.v(okR && okR2 && S().etat !== "terminee", H3, pref + "« 🔓 Rouvrir » la séance terminée, puis « 🔓 Rouvrir la séance »", JSON.stringify({etat: S().etat}) + " ; " + await capt(prof, pref.replace(/\W+/g, "") + "rouvrir"));
  const okRem = await gesteQ(prof, 4, /↩️ Remettre/); await pause(1200);
  J.v(okRem && !(S().ecartees || {})[3], H3, pref + "« ↩️ Remettre » Q4 dans « 📋 Toutes les questions »", JSON.stringify({remettre: okRem, ecartees: S().ecartees}) + " ; boutons : " + JSON.stringify(await boutons(prof)));
  let okQ4 = false; for(let k = 0; k < 10 && !okQ4; k++){ okQ4 = await cliquer(prof, /Lancer Q4\b/); if(!okQ4){ await cliquer(prof, /▶️ Reprendre/); await pause(800); } }
  await pause(1500);
  J.v(okQ4 && L(S().questionsLancees).map(Number).includes(3), H3, pref + "« ▶️ Lancer Q4 » : Q4 lancée", JSON.stringify({lancees: S().questionsLancees, deroule: S().deroule}) + " ; " + await capt(prof, pref.replace(/\W+/g, "") + "q4"));
  return okQ4;
}

// ════════════ R. la lecture du soir, puis la séance rouverte : Q3 compte pendant qu'elle tourne ════════════
async function partieR(){
  const J = JR;
  try {
    J.section("R. Q1 à Q3, Q1 et Q2 révélées, Q3 lue par les voisins, pas révélée ; « 🛑 Terminer » ; le soir, « ✅ Oui »");
    const X = await seance(J);
    const {prof, M, nomDe, deuxNotes} = X;
    const [x1, x2] = M.map(m => m[1]);
    await jusquaLArret(J, X);
    const d0 = await deuxNotes(x1);
    J.v(d0.base && d0.base.st && d0.base.st[2] === "n" && !d0.base.complet && JSON.stringify(d0.base) === JSON.stringify(d0.c4), H13, "avant la lecture du soir : Q3 « pas encore lue », la même dans la base et dans c4", JSON.stringify(d0));
    J.v(await ouvrirSeance(prof), H3, "Données → Résultats → « 📊 Ouvrir » la séance");
    J.v(await clic(prof, /📄 Lire les copies/) || await clic(prof, /^\d+ feuilles? à lire$/), H3, "« 📄 Lire les copies »");
    for(const x of [x1, x2]){
      const nm = nomDe(x);
      J.v(await ouvrirCopie(prof, nm), H3, "« Lire les copies » : la copie de " + nm, (await texte(prof)).slice(0, 200));
      const r = await ouiLigne(prof, 2);
      J.v(r.ok, H3, nm + ", Q3 : « ✅ Oui » (la lecture de Paul, la même que celle du voisin)", (r.txt || r.vu || "").slice(0, 300));
    }
    const d1 = await deuxNotes(x1);
    J.v(d1.base && d1.base.complet && d1.base.n === 2 && d1.base.total === 3 && d1.base.st.slice(0, 3) === "fjj" && JSON.stringify(d1.base) === JSON.stringify(d1.c4), H13, "après la lecture du soir : 2 / 3 complète (Q1 faux, Q2 et Q3 justes, Q4 écartée), la même dans la base et dans c4", JSON.stringify(d1));
    J.section("R : « 🔓 Rouvrir », « ↩️ Remettre » Q4, « ▶️ Lancer Q4 » : pendant qu'elle tourne, Q3 compte");
    await rouvrirQ4(J, X, "R, ");
    const d2 = await deuxNotes(x1);
    J.v(d2.base && d2.base.st && d2.base.st[2] === "j" && d2.base.st[1] === "j", H1, "la séance rouverte, Q4 lancée, en cours : Q2 et Q3, lues par Paul, comptent (jamais « pas encore lue »), dans la base", JSON.stringify(d2));
    J.v(d2.c4 && d2.c4.st && d2.c4.st[2] === "j" && d2.c4.st[1] === "j", H3, "… et dans c4 (resultatLocalV)", JSON.stringify(d2));
    J.v(JSON.stringify(d2.base) === JSON.stringify(d2.c4), H13, "en cours : la même note dans la base et dans c4", JSON.stringify(d2));
    for(const x of [x1, x2]){ const d = await deuxNotes(x); note(J, "en cours, " + nomDe(x) + " : " + JSON.stringify(d)); }
    // le tableau de la séance, pendant qu'elle tourne
    const okT = await ouvrirSeance(prof); const c2 = okT ? await ligneTab(prof, x1) : null; const cT = await capt(prof, "R-tableau-en-cours");
    J.v(!!c2 && !/pas encore lue/.test(noteC(c2).note) && /^2\/4/.test(noteC(c2).note), H3, "en cours, le tableau de la séance, " + nomDe(x1) + " : « 2/4 » (Q4 pas encore répondue), sans « Q3 pas encore lue »", JSON.stringify({ouvert: okT, ligne: c2}) + " ; " + cT);
    J.section("R : « 🛑 Terminer » de nouveau : la note sur 4, Q3 comptée");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
    await terminer(prof);
    const d3 = await deuxNotes(x1);
    note(J, "terminée de nouveau : " + JSON.stringify(d3));
    J.v(d3.base && d3.base.total === 4 && d3.base.st[2] === "j" && JSON.stringify(d3.base) === JSON.stringify(d3.c4), H13, "terminée de nouveau : la note sur 4, Q3 comptée, la même dans la base et dans c4", JSON.stringify(d3));
  } catch(e){ JR.v(false, BANC, "la séance R s'est interrompue : " + e.message); }
}

// ════════════ M. la mesure : rouverte SANS la lecture du soir, Q4 posée : peut-on corriger Q3 en classe ? ════════════
async function partieM(){
  const J = JM;
  try {
    J.section("M (mesure, rien ne se corrige) : la même séance, rouverte sans la lecture du soir ; Q4 posée ; Q3 se corrige-t-elle en classe ?");
    const X = await seance(J);
    const {prof, t1, M, S, etat, deuxNotes, nomDe} = X;
    const [x1] = M.map(m => m[1]);
    await jusquaLArret(J, X);
    note(J, "terminée, sans lecture du soir : " + JSON.stringify(await deuxNotes(x1)));
    const ok = await rouvrirQ4(J, X, "M, ");
    if(ok){
      // Q4 jouée jusqu'au bout (les élèves sont-ils encore sur la tablette ?)
      await cliquer(prof, /Autoriser la réponse/); await pause(1500);
      const zg = await zoneTexte(t1, "g"); note(J, "la tablette, Q4 lancée : « " + zg.replace(/\s+/g, " ").slice(0, 160) + " »");
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
      const bQ4 = await boutons(prof); const cQ4 = await capt(prof, "M-q4-close");
      note(J, "Q4 close, les gestes de la console : " + JSON.stringify(bQ4) + " (" + cQ4 + ")");
      const okA = await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
      note(J, "« 📊 Lancer l'autoévaluation » : " + (okA ? "présent, cliqué" : "absent") + " ; deroule : " + JSON.stringify(etat()));
      if(okA){
        for(const [c] of M) await cliquer(t1, /Maîtrise satisfaisante/, c);
        const okC = await cliquer(prof, /Lancer la correction/); await pause(900);
        for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence la correction$/, c); }
        await pause(1200); const okC2 = await cliquer(prof, /Commencer la correction/); await pause(1500);
        note(J, "« 📝 Lancer la correction » " + okC + ", « Commencer la correction » " + okC2 + " ; ordreCorr : " + JSON.stringify(S().ordreCorr) + " ; deroule : " + JSON.stringify(etat()) + " ; revelees : " + JSON.stringify(S().revelees));
        // tant que la correction avance : le voisin lit ce que l'élève a écrit (Q4 : les bonnes ; Q3 : « 8 »), puis « 💡 Révéler » et « Question suivante »
        const vus = [];
        for(let i = 0; i < 4; i++){
          const d = etat(); if(d.ph !== "lecture") break; const qi = Number(d.qi);
          const rep = qi === 2 ? ["8"] : qi === 3 ? bonnesDe(E4, 3) : [];
          for(const [c] of M){ for(const t of rep) await cliquer(t1, new RegExp("^" + esc(t) + "$"), c, {apres: 150}); }
          await pause(900);
          const okRev = await cliquer(prof, /Révéler/); await pause(1200);
          vus.push({qi: qi + 1, reveler: okRev, revelees: S().revelees});
          if(!await cliquer(prof, /Question suivante/)) break; await pause(1200);
        }
        note(J, "la correction en classe, question par question : " + JSON.stringify(vus) + " ; " + await capt(prof, "M-correction"));
        const q3 = vus.find(v => v.qi === 3);
        note(J, "MESURE : " + (q3 && q3.reveler ? "Q3 se corrige en classe : la correction de la séance rouverte la propose, « 💡 Révéler » est ouvert" : "Q3 ne se corrige pas en classe : la correction de la séance rouverte ne la propose pas (ordreCorr " + JSON.stringify(S().ordreCorr) + ")"));
      } else note(J, "MESURE : après Q4, la console ne propose pas « 📊 Lancer l'autoévaluation » ; Q3 ne se corrige pas en classe");
      note(J, "la note après la correction en classe : " + JSON.stringify(await deuxNotes(x1)));
      await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
      await terminer(prof);
      note(J, "terminée de nouveau, sans lecture du soir : " + JSON.stringify(await deuxNotes(x1)) + " ; " + nomDe(x1));
    }
  } catch(e){ JM.v(false, BANC, "la mesure M s'est interrompue : " + e.message); }
}

let ecrit = false;
function ecrire(){
  if(ecrit) return; ecrit = true;
  const tous = [JR, JM], v = tous.reduce((a, j) => a + j.verifs.length, 0), e = tous.reduce((a, j) => a + j.echecs.length, 0);
  let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(x){}
  const lignes = j => j.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  const out = "vérifications : " + v + " · échecs : " + e + "\n" + tous.map(lignes).join("\n");
  fs.writeFileSync(path.join(SORTIE, "rouverte.txt"), "Points 12 et 13 (Paul, 21/10 09:45), la séance rouverte après la lecture du soir, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
  console.log(out);
}
(async () => {
  await Promise.all([partieR(), partieM()]);
  for(const A of NAVS) for(const p of A.pages) JR.v(!p.__err.length, BANC, p.__nom + " : aucune erreur de page", p.__err.slice(0, 3).join(" | "));
  for(const A of NAVS) try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
})();
