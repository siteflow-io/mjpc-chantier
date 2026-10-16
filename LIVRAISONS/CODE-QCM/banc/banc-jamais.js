// QCM-4 · BANC — les scènes que le banc commun n'avait jamais atteintes, par le geste, sur le faux hub :
// « 1 élève » et « Tu es bien Julien ? » (t-un-eleve) ; deux élèves échangés pendant la séance (c-deplacer, t-deplace) ;
// l'élève seul qui lit lui-même sa feuille (t-corr-seul) ; puis une séance sur l'évaluation de 3e de la maquette
// (« 3e- éval 1 Analyse logique - Construire une phrase complexe ») : B sur la question 3 (x610-1, x610-2), la co-évaluation
// et l'alerte (x610-6 à x610-9), les gardes « ⛔ à Michel / à Julien / aux deux » (x610-autonomie-*).
// La classe 3 ESSAI réduite à cinq élèves (Julien, Michel, Théo, Lou, Adam) : deux tablettes partagées et une tablette seule.
//   APP_FILE=<app> BANC=<faux hub> node banc/banc-jamais.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, esc, slug, texte, attendre, zoneTexte, cliquer, etatBouton, choisir, taper, cocherTout, choixOuverts, photo, releve } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "jamais-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures-jamais"), {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE";
const PLAFOND = 5 * 60 * 1000;
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const HUB = JSON.parse(fs.readFileSync(path.join(O.RACINE, "MANDATS", "MAQUETTE-QCM-COMPLETE", "src", "donnees", "evaluations_hub.json")));
const ID3 = Object.keys(HUB).find(k => /Analyse logique - Construire une phrase complexe/.test(HUB[k].titre || ""));
const E3 = HUB[ID3];
const CLASSE = ["ABRIAL Julien", "DUVERNAY Michel", "CHEVALLIER Théo", "ZELLER Lou", "YVON Adam"];
const RELEVES = {}; let nCapt = 0;
async function scene(id, p, appareil){ if(!p) return false; try { RELEVES[id] = Object.assign({appareil: appareil || p.__nom, t: Math.round((Date.now() - J.t0) / 1000)}, await releve(p));
  await photo(p, path.join(SORTIE, "captures-jamais", String(++nCapt).padStart(3, "0") + "-" + id + ".png")); return true; } catch(e){ return false; } }
const PROPRIO = id => /^x610-(1|2|6|7)|^t-/.test(id) ? H2 : H2;
function atteinte(id, ok, vu){ J.v(ok && !!RELEVES[id], PROPRIO(id), "scène « " + id + " » atteinte par le geste et relevée", vu || "pas atteinte"); }
async function attendreBase(f, ms){ const fin = Date.now() + ms; while(Date.now() < fin){ try { if(f()) return true; } catch(e){} await pause(150); } try { return !!f(); } catch(e){ return false; } }
function tropLong(){ if(Date.now() - J.t0 > PLAFOND) throw new Error("plafond de 5 minutes atteint"); }

(async () => {
  const S = O.scenario();
  const {B, srv, port} = await O.fauxHub(B => {
    B.tree.classes["3 ESSAI"].eleves = CLASSE.slice();
    for(const k of Object.keys(B.tree.codes)) if(B.tree.codes[k].classe === "3 ESSAI" && !CLASSE.some(n => slug(n) === k)) delete B.tree.codes[k];
    B.tree.qcm.evaluations.essai.titre = S.EV_ESSAI ? S.EV_ESSAI.titre : B.tree.qcm.evaluations.essai.titre;
    // l'évaluation de 3e de la maquette (HUB_EVALS), au format du prompt (temps courts : Paul autorise la réponse et coupe les tours)
    B.tree.qcm.evaluations[ID3] = {titre: E3.titre, mode: "strict", niveau: "3e", chapitre: "3e-ch1", createdAt: E3.createdAt,
      questions: E3.questions.map(q => ({enonce: q.enonce, choix: q.choix, bonnes: q.bonnes, niveau: q.niveau, explication: q.explication, reflexion: 5, reponse: 6, competences: ["c4-lire-01"], verifie: q.verifie || "construire une phrase complexe", bonus: false, longueurAssumee: false}))};
    // un QCM précédent : l'app forme d'elle-même les binômes Julien–Michel et Théo–Lou
    const ch1 = S.ID_CH1 && B.tree.qcm.evaluations[S.ID_CH1];
    if(ch1){ const papier = {}, nq = ch1.questions.length;
      [["ABRIAL Julien", "DUVERNAY Michel"], ["CHEVALLIER Théo", "ZELLER Lou"]].forEach((p, i) => p.forEach(n => { const justes = nq - i; papier[slug(n)] = {choix: ch1.questions.map((q, qi) => qi < justes ? q.bonnes.slice() : [q.choix.findIndex((_, c) => !q.bonnes.includes(c))])}; }));
      B.tree.qcm.sessions = {sess_ch1: {evalId: S.ID_CH1, classe: "3 ESSAI", classeSlug: "3 ESSAI", date: Date.UTC(2026, 8, 24, 8, 4), phase: "finie", qIdx: nq - 1, etat: "terminee", absents: ["yvon_adam"], papier}}; }
  });
  const codeDe = n => (B.eleves.find(e => e.nomComplet === n) || {}).code;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : (x.etat && typeof x.etat === "object" ? x.etat : {}); };
  const entrer = (p, cote, nom) => O.entrer1(p, cote, nom, codeDe(nom));   // reprise 7, point 13 : l'entrée d'outils.js (l'ancienne et la nouvelle)
  const fermerFen = async p => { for(let k = 0; k < 2; k++){ const o = await p.evaluate(() => [...document.querySelectorAll(".checkin-overlay, .modal-overlay, .modal, [role=dialog]")].some(e => e.getBoundingClientRect().width > 0)).catch(() => false); if(!o) return; if(!(await cliquer(p, /^Annuler$|^Fermer$|^✕ Fermer$|^✕$/))) await p.keyboard.press("Escape"); await pause(250); } };
  let prof, tel, places = [], tabsP = {};
  // les moitiés de la séance : [{p, cote, sl}]
  const moities = () => { const r = []; for(const t of places){ const p = tabsP[t.n]; if(!p) continue; const seul = !t.g || !t.d; if(seul) r.push({p, cote: null, sl: t.g || t.d}); else { r.push({p, cote: "g", sl: t.g}); r.push({p, cote: "d", sl: t.d}); } } return r; };

  // lancer une séance (classe 3 ESSAI, l'évaluation choisie), l'appel (les absents cliqués), les tablettes, l'entrée, la première attestation
  async function lancer(evalRe, absents, avant){
    await fermerFen(prof);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(300);
    await choisir(prof, /3 ESSAI|3e Essai/); await pause(200);
    J.v(await choisir(prof, evalRe), H2, "l'évaluation se choisit au lancement : " + evalRe.source); await pause(300);
    await cliquer(prof, /Lancer la séance/); await pause(500);
    for(const n of absents) await cliquer(prof, new RegExp(esc(n)));
    await cliquer(prof, /Lancer la séance/); await pause(1200);
    J.v(!!sess().sid, H1, "la séance est lancée (sessionActive)", JSON.stringify(srv.store.get("qcm/sessionActive")));
    const pl = sess().s.places || {};
    places = Object.keys(pl).map(n => ({n, g: pl[n].g, d: pl[n].d}));
    J.v(places.length > 0, H1, "les places dans la base", JSON.stringify(pl));
    if(avant) await avant();
    tabsP = {};
    for(const t of places){
      const p = await A.tablette("tablette-" + t.n + "-" + Date.now() % 1000, "3 ESSAI"); tabsP[t.n] = p;
      const seul = !t.g || !t.d;
      await cliquer(p, seul ? /1 élève/ : /2 élèves/); await pause(300);
      if(seul && /Tu es bien/.test(await texte(p))){ await cliquer(p, /^Non$/); await pause(300); }
      for(const cote of seul ? [null] : ["g", "d"]){ const sl = seul ? (t.g || t.d) : t[cote]; await entrer(p, cote, CLASSE.find(n => slug(n) === sl)); }
    }
    for(const m of moities()){ await cocherTout(m.p, m.cote); await cliquer(m.p, /^Je commence$/, m.cote); }
    await pause(500);
  }
  const tabDe = sl => { const t = places.find(t => t.g === sl || t.d === sl); return t ? {p: tabsP[t.n], cote: (!t.g || !t.d) ? null : (t.g === sl ? "g" : "d"), t} : {}; };
  // une question, par le geste : « ▶️ Lancer Qn », « ✋ Autoriser la réponse », les clics de chaque tour, B, la clôture
  async function question(Q, qi, choixDe, hookB){
    tropLong();
    await fermerFen(prof);
    if(!(await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")))) J.v(false, H2, "« ▶️ Lancer Q" + (qi + 1) + " »", (await texte(prof)).slice(0, 200));
    await pause(500);
    await cliquer(prof, /Autoriser la réponse/); await pause(300);
    for(const tour of [1, 2]){
      await attendreBase(() => etat().ph === "reponse" && etat().tour === tour, 8000); await pause(300);
      const faits = new Set();
      for(let k = 0; k < 3; k++){ for(const m of moities()){ if(faits.has(m.sl)) continue; if(!(await choixOuverts(m.p, m.cote, Q.choix)).length) continue;
        for(const c of choixDe(m.sl)) await cliquer(m.p, new RegExp("^" + esc(Q.choix[c]) + "$"), m.cote, {apres: 80}); faits.add(m.sl); } if(faits.size) break; await pause(400); }
      if(tour === 1) await cliquer(prof, /Tour suivant/);
      // B : chacun de ceux qui ont répondu
      const fin = Date.now() + 6000, bf = new Set();
      while(Date.now() < fin && bf.size < faits.size){
        for(const m of moities()){ if(bf.has(m.sl) || !faits.has(m.sl)) continue; const z = await zoneTexte(m.p, m.cote); if(!/Oui, la même chose/.test(z)) continue;
          if(hookB) await hookB(m, tour); bf.add(m.sl); await cliquer(m.p, /^Oui, la même chose$/, m.cote); }
        if(tour === 1 && etat().tour === 2) break;
        await pause(250);
      }
    }
    if(!(await attendreBase(() => etat().ph === "close" && etat().qi === qi, 6000))){ await cliquer(prof, /Clore la question/); await pause(500); }
  }
  // l'estimation, la seconde attestation, « ▶️ Commencer la correction » (Paul, 13/10)
  async function versCorrection(){
    await fermerFen(prof);
    J.v(await cliquer(prof, /Lancer l'autoévaluation/), H2, "« 📊 Lancer l'autoévaluation »"); await pause(700);
    for(const m of moities()) await cliquer(m.p, /Maîtrise satisfaisante/, m.cote);
    await pause(400);
    J.v(await cliquer(prof, /Lancer la correction/), H2, "« 📝 Lancer la correction »"); await pause(700);
    for(const m of moities()){ await cocherTout(m.p, m.cote); await cliquer(m.p, /^Je commence la correction$/, m.cote); }
    await pause(700);
    J.v(await cliquer(prof, /Commencer la correction/), H2, "Paul clique « ▶️ Commencer la correction »");
    J.v(await attendreBase(() => etat().ph === "lecture", 5000), H1, "la correction commence (deroule.ph = lecture)", JSON.stringify(etat()));
    await pause(600);
  }
  // la question en cours de correction, lue sur une tablette (son énoncé)
  const qiCorr = (ev) => { const d = etat(); if(typeof d.qi === "number") return d.qi; return -1; };
  async function terminer(){
    await fermerFen(prof);
    await cliquer(prof, /^🛑 Terminer la séance$|Terminer la séance/); await pause(300); await cliquer(prof, /^🛑 Terminer$|Oui, terminer|^🛑 Terminer la séance$|Terminer définitivement/); await pause(1000);
    J.v(!(srv.store.get("qcm/sessionActive") || {})["3 ESSAI"], H1, "la séance terminée (sessionActive vidée)", JSON.stringify(srv.store.get("qcm/sessionActive")));
    for(const p of Object.values(tabsP)) await p.context().close().catch(() => {});
    tabsP = {}; dernier = null;
  }

  try {
    // ════════ 2. Séance sur l'évaluation de 3e : B à la question 3, la co-évaluation, l'alerte ════════
    J.section("J.4 L'évaluation de 3e : Julien et Michel, Théo et Lou (Adam absent)");
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    tel = await A.ouvrir("telephone", "?mode=prof&view=phone", 390, 844);
    await lancer(new RegExp(esc("Analyse logique - Construire une phrase complexe")), ["YVON Adam"]);
    const jm3 = tabDe("abrial_julien");
    J.v(!!jm3.p && tabDe("duvernay_michel").p === jm3.p, H1, "Julien et Michel sur la même tablette", JSON.stringify(places));
    const Q3 = E3.questions[2];
    // les clics de la question 3 (S3E) : Michel C, E et « Oui, la même chose » ; Julien E ; les autres questions : la première bonne
    const choix3 = qi => sl => qi === 2 ? (sl === "duvernay_michel" ? [2, 4] : sl === "abrial_julien" ? [4] : E3.questions[qi].bonnes.slice(0, 1)) : E3.questions[qi].bonnes.slice(0, 1);
    const vusB = {};
    for(let qi = 0; qi < E3.questions.length; qi++){
      const hook = qi !== 2 ? null : async (m, tour) => { const id = m.sl === "abrial_julien" ? "x610-1-b-julien" : m.sl === "duvernay_michel" ? "x610-2-b-michel" : null; if(id && !vusB[id]){ vusB[id] = await scene(id, m.p, "tablette"); } };
      await question(E3.questions[qi], qi, choix3(qi), hook);
    }
    atteinte("x610-1-b-julien", !!vusB["x610-1-b-julien"]); atteinte("x610-2-b-michel", !!vusB["x610-2-b-michel"]);
    J.section("J.5 L'évaluation de 3e : la correction des 11 questions");
    await versCorrection();
    // la lecture : Julien lit la feuille de Michel (Q3 : E), Michel celle de Julien ; les autres : la première bonne
    for(let k = 0; k < E3.questions.length; k++){
      tropLong();
      let qi = -1; for(let w = 0; w < 15 && qi < 0; w++){ const z = await texte(jm3.p); qi = E3.questions.findIndex(q => z.includes(q.enonce)); if(qi < 0) await pause(250); }
      if(qi < 0){ J.v(false, H2, "la correction : l'énoncé de la question corrigée sur la tablette de Julien", (await texte(jm3.p)).slice(0, 300)); qi = 0; }
      const Q = E3.questions[qi];
      for(const m of moities()){ const ch = qi === 2 && m.sl === "abrial_julien" ? [4] : Q.bonnes; for(const c of ch) await cliquer(m.p, new RegExp("^" + esc(Q.choix[c]) + "$"), m.cote, {apres: 80}); }
      await pause(300);
      await cliquer(prof, /Révéler/); await pause(600);
      if(k < E3.questions.length - 1){ if(!(await cliquer(prof, /Question suivante/))) break; await pause(700); }
    }
    J.section("J.6 La co-évaluation : Michel « ❌ » à la question 3 ; l'alerte sur la console et le téléphone ; les gardes « ⛔ »");
    await fermerFen(prof);
    J.v(await cliquer(prof, /Ouvrir la co-évaluation/), H2, "« 🤝 Ouvrir la co-évaluation, puis leur bilan »"); await pause(900);
    const cJ = jm3.cote, cM = tabDe("duvernay_michel").cote;
    let ok6 = false, ok7 = false;
    if(await cliquer(jm3.p, /^❌ Je pense que .* a mal lu/, cM)){ await pause(300); ok6 = /c'est laquelle/.test(await zoneTexte(jm3.p, cM)); if(ok6) await scene("x610-6-coeval-laquelle", jm3.p, "tablette"); }
    atteinte("x610-6-coeval-laquelle", ok6, (await zoneTexte(jm3.p, cM)).slice(0, 300));
    await cliquer(jm3.p, /^✅ Je pense que .* a bien lu ma feuille/, cJ); await pause(200);
    if(await cliquer(jm3.p, /^Question 3 ·/, cM)){ await pause(300); ok7 = /Qu'avais-tu écrit sur ta feuille/.test(await zoneTexte(jm3.p, cM)); }
    for(const c of [1, 2, 4]) await cliquer(jm3.p, new RegExp("^" + esc(Q3.choix[c]) + "($|Julien a lu)"), cM, {apres: 120});
    await pause(400);
    if(ok7) await scene("x610-7-coeval-ecrit", jm3.p, "tablette");
    atteinte("x610-7-coeval-ecrit", ok7, (await zoneTexte(jm3.p, cM)).slice(0, 300));
    for(const m of moities()) if(m.p !== jm3.p) await cliquer(m.p, /^✅ Je pense que .* a bien lu ma feuille/, m.cote);
    await pause(800);
    const ok8 = await attendre(prof, /pense qu'ABRIAL Julien a mal lu sa feuille|a mal lu sa feuille à la question 3/, 4000);
    await scene("x610-8-console-alerte", prof, "console"); J.v(ok8, H2, "x610-8 : l'alerte « ❌ DUVERNAY Michel pense qu'ABRIAL Julien a mal lu sa feuille à la question 3 » sur la console", (await texte(prof)).slice(0, 300));
    const ok9 = await attendre(tel, /a mal lu sa feuille/, 4000);
    await scene("x610-9-telephone-alerte", tel, "telephone"); J.v(ok9, H2, "x610-9 : l'alerte au téléphone", (await texte(tel)).slice(0, 300));
    for(const [re, id] of [[/^⛔ à Michel$/, "x610-autonomie-michel"], [/^⛔ à Julien$/, "x610-autonomie-julien"], [/^⛔ aux deux$/, "x610-autonomie-deux"]]){
      const ok = await cliquer(prof, re); await pause(300);
      if(ok) await scene(id, prof, "console"); atteinte(id, ok, (await texte(prof)).slice(0, 300));
      if(ok){ if(!(await cliquer(prof, /^Annuler$/))) await prof.keyboard.press("Escape"); await pause(300); }
    }
    J.v(Object.keys(sess().s.autonomie || {}).length === 0, H1, "les gardes annulées n'ont retiré aucun point d'autonomie", JSON.stringify(sess().s.autonomie));
    await terminer();
    // ════════ 1. Séance d'essai : « 1 élève », l'échange, l'élève seul à la correction ════════
    J.section("J.1 L'évaluation d'essai, cinq élèves : Adam seul sur sa tablette");
    await lancer(/Évaluation d'essai/, [], async () => {
      // « 1 élève » sur une tablette où Julien est connecté à MJPC (son compte élève, le raccourci de la 7.7.1)
      const t0 = await A.tablette("tablette-mjpc", "3 ESSAI");
      await t0.evaluate(() => { const s = JSON.stringify({display: "ABRIAL Julien", nom: "ABRIAL", prenom: "Julien", classe: "3 ESSAI", ts: Date.now(), is_prof: false}); try { localStorage.setItem("mjpc_eleve", s); sessionStorage.setItem("mjpc_eleve", s); } catch(e){} });
      await t0.reload().catch(() => {}); await pause(1200);
      for(let k = 0; k < 20 && !/Combien êtes-vous|Identifie-toi|Tu es bien/.test(await texte(t0)); k++){ if(/Choisis ta classe/.test(await texte(t0))) await cliquer(t0, /^3 ESSAI$/); await pause(250); }
      await cliquer(t0, /1 élève/); await pause(500);
      const ok = await attendre(t0, /Tu es bien Julien \?/, 3000);
      if(ok) await scene("t-un-eleve", t0, "tablette");
      atteinte("t-un-eleve", ok, (await texte(t0)).slice(0, 200));
      await t0.context().close().catch(() => {});
    });
    const jm = tabDe("abrial_julien"), th = tabDe("chevallier_theo"), ad = tabDe("yvon_adam");
    J.v(!!jm.p && !!th.p && !!ad.p && !ad.cote, H1, "Julien, Théo et Adam ont leur tablette ; Adam seul", JSON.stringify(places));
    const choixEssai = qi => sl => { const Q = EV.questions[qi]; return sl === "duvernay_michel" ? [Q.choix.findIndex((_, c) => !Q.bonnes.includes(c))] : Q.bonnes.slice(0, 1); };
    await question(EV.questions[0], 0, choixEssai(0));
    // l'échange : le nom de Julien glissé sur celui de Théo, dans « 📱 Tablettes » de la console (c-deplacer)
    J.section("J.2 Deux élèves échangés pendant la séance (Q1 close)");
    const marque = await prof.evaluate(() => { const m = [...document.querySelectorAll(".tab-mini-m")]; const a = m.find(x => /ABRIAL Julien/.test(x.textContent)), b = m.find(x => /CHEVALLIER Théo/.test(x.textContent)); if(!a || !b) return false; a.setAttribute("data-dep", "a"); b.setAttribute("data-dep", "b"); return a.getAttribute("draggable") === "true"; }).catch(() => false);
    J.v(marque, H2, "pendant la séance, le nom de Julien se glisse dans « 📱 Tablettes » (draggable)", (await texte(prof)).slice(0, 200));
    if(marque){ await prof.dragAndDrop("[data-dep='a']", "[data-dep='b']").catch(e => J.v(false, H2, "glisser Julien sur Théo", e.message)); await pause(900); }
    const ok1 = await attendre(prof, /échangés/, 3000); const zt = ((await texte(prof)).match(/📱 Tablettes[\s\S]{0,400}/) || [""])[0];
    await scene("c-deplacer", prof, "console"); J.v(ok1, H2, "c-deplacer : « ABRIAL Julien et CHEVALLIER Théo échangés : leurs réponses déjà données les suivent »", zt); atteinte("c-deplacer", true);
    const ok2 = await attendre(jm.p, /va sur la tablette/, 3000);
    if(ok2) await scene("t-deplace", jm.p, "tablette"); atteinte("t-deplace", ok2, (await texte(jm.p)).slice(0, 300));
    // les deux élèves vont à leur nouvelle moitié et y retapent leur code (« ↔️ va sur la tablette … : retape son code »)
    { const pl = sess().s.places || {}; places = Object.keys(pl).map(n => ({n, g: pl[n].g, d: pl[n].d}));
      J.v(JSON.stringify(pl).length > 0 && tabDe("abrial_julien").t && tabDe("abrial_julien").t.n !== jm.t.n, H1, "la base : Julien est à la place de Théo (places)", JSON.stringify(pl));
      for(const m of moities()){ const z = await zoneTexte(m.p, m.cote); if(/Entrer/.test(z) && !/ABRIAL JULIEN|DUVERNAY MICHEL|CHEVALLIER THÉO|ZELLER LOU/.test(z.slice(0, 0))) await entrer(m.p, m.cote, CLASSE.find(n => slug(n) === m.sl)); }
      for(const m of moities()){ await cocherTout(m.p, m.cote); await cliquer(m.p, /^Je commence$/, m.cote); } }
    J.section("J.3 Q2, Q3, l'estimation, la correction : Adam, seul, lit lui-même sa feuille (t-corr-seul)");
    await question(EV.questions[1], 1, choixEssai(1));
    await question(EV.questions[2], 2, choixEssai(2));
    await versCorrection();
    // la première question corrigée est la plus ratée ; t-corr-seul est sur Q2 : on corrige jusqu'à elle
    let okSeul = false;
    for(let k = 0; k < 3 && !okSeul; k++){
      const z = await texte(ad.p);
      if(/Lesquelles sont des capitales européennes/.test(z) && /Qu'as-tu écrit sur ta feuille/.test(z)){
        await cliquer(ad.p, /^Madrid$/); await pause(400); await scene("t-corr-seul", ad.p, "tablette"); okSeul = true; break; }
      for(const m of moities()) await cliquer(m.p, /aucun de ces choix/, m.cote);
      await cliquer(prof, /Révéler/); await pause(700); await cliquer(prof, /Question suivante/); await pause(900);
    }
    atteinte("t-corr-seul", okSeul, (await texte(ad.p)).slice(0, 300));
    await terminer();

  } catch(e){ J.v(false, "banc", "le banc des scènes jamais atteintes s'est arrêté", e.stack); }
  // le bilan des scènes : atteinte ou non, avec son propriétaire
  J.section("J.7 Les scènes jamais atteintes avant ce banc");
  for(const id of ["t-un-eleve", "t-corr-seul", "c-deplacer", "t-deplace", "x610-1-b-julien", "x610-2-b-michel", "x610-6-coeval-laquelle", "x610-7-coeval-ecrit", "x610-8-console-alerte", "x610-9-telephone-alerte", "x610-autonomie-michel", "x610-autonomie-julien", "x610-autonomie-deux"])
    J.v(!!RELEVES[id], H2, "bilan : « " + id + " » " + (RELEVES[id] ? "atteinte et relevée" : "pas atteinte"), "pas atteinte");
  for(const p of A.pages) J.v(p.__err.length === 0, H1, "page « " + p.__nom + " » sans erreur ni boîte système", p.__err.slice(0, 3).join(" · "));
  const cerr = {}; for(const p of A.pages) for(const t of p.__cerr || []) if(!/^Failed to load resource/.test(t)) (cerr[t] = cerr[t] || []).push(p.__nom);
  for(const t of Object.keys(cerr)) J.v(false, /Ecran|écran (c|t|p|b)-/.test(t) ? H2 : H1, "erreur écrite par l'app dans " + cerr[t].length + " page(s) (" + cerr[t].slice(0, 4).join(", ") + ")", t);
  await A.fermer(); await srv.close();
  const duree = Math.round((Date.now() - J.t0) / 1000);
  fs.writeFileSync(path.join(SORTIE, "releves-jamais.json"), JSON.stringify(RELEVES));
  const lignes = ["Les scènes jamais atteintes (QCM-4 · BANC) — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString(),
    "Durée : " + duree + " s (" + Math.floor(duree / 60) + " min " + (duree % 60) + " s) · vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + " · scènes relevées : " + Object.keys(RELEVES).join(", "), ""];
  for(const e of J.l) lignes.push(e.section ? "\n── " + e.section + " (" + e.t + " s)" : e.secours ? "  SECOURS " + e.secours : (e.ok ? "  ok     " : "  ÉCHEC  ") + "[" + e.proprio + "] " + e.quoi + (e.ok ? "" : " — vu : " + e.vu));
  fs.writeFileSync(path.join(SORTIE, "jamais.txt"), lignes.join("\n") + "\n");
  console.log("\nDurée " + duree + " s · " + J.verifs.length + " vérifications · " + J.echecs.length + " échecs");
  process.exit(J.echecs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
