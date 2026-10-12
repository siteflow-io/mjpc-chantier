// QCM-4 · BANC — les gestes rares de l'heure, par le geste, sur le faux hub : la démo ; l'entrée qui se trompe (code pas enregistré,
// mauvaise tablette, binôme) ; « 👁 », du temps ajouté, « 🔴 1 séance en cours » ; le départ et le retour d'un élève ; la garde de
// « 🛑 Terminer » ; « ❌ Écarter » et « ↩️ Remettre » ; « ⚠️ Annuler » ; « 🔓 Rouvrir pour tous » ; « ⏸️ Finir à une autre heure »
// puis « ▶️ Reprendre » ; la console perdue. La classe 3 ESSAI, deux tablettes (Julien et Michel, Théo et Lou), le téléphone.
//   APP_FILE=<app> node banc/banc-branches.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, esc, slug, texte, attendre, zoneTexte, cliquer, etatBouton, choisir, taper, cocherTout, choixOuverts, photo, releve } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "branches-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures"), {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H3 = "QCM-3 · SOIR";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const RELEVES = {}; let nCapt = 0;
async function scene(id, p, appareil){ if(!p) return; try { RELEVES[id] = Object.assign({appareil: appareil || p.__nom}, await releve(p));
  await photo(p, path.join(SORTIE, "captures", "br-" + String(++nCapt).padStart(3, "0") + "-" + id + ".png")); } catch(e){} }

(async () => {
  const {B, srv, port} = await O.fauxHub(B => {
    B.tree.qcm.evaluations.demo = {titre: "🎓 Démo — apprendre le déroulé", mode: "strict", demo: true, questions: EV.questions.map(q => ({enonce: q.enonce, choix: q.choix, bonnes: q.bonnes, niveau: q.niveau, reflexion: q.reflexion, reponse: q.reponse, competences: []}))};
    delete B.tree.codes[slug("BRUNEAU Camille")];       // un code pas encore enregistré (t-login-inconnu)
  });
  const codeDe = n => B.eleves.find(e => e.nomComplet === n).code;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : (x.etat && typeof x.etat === "object" ? x.etat : {}); };   // contrat C1 : deroule
  const entrer = async (p, cote, nom) => { const [N, ...P] = nom.split(" "); await taper(p, cote, "code", codeDe(nom)); await taper(p, cote, "prenom", P.join(" ").toLowerCase()); await taper(p, cote, "nom", N.toLowerCase()); await cliquer(p, /Entrer/, cote); await pause(400); };
  let prof, tel;
  try {
    J.section("B.1 La démo, lancée avec la classe : rien ne compte");
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI/); await pause(200); J.v(await choisir(prof, /Démo — apprendre le déroulé/), H2, "la démo se choisit au lancement"); await pause(300);
    await scene("c-demo-lancer", prof, "console");
    J.v(await cliquer(prof, /Lancer la démo|Lancer la séance/), H2, "« 🎓 Lancer la démo »"); await pause(500); await cliquer(prof, /Lancer la démo|Lancer la séance/); await pause(1000);
    const sd = sess();
    J.v(!!sd.sid && sd.s.evalId === "demo", H1, "la séance de la démo est lancée (evalId = demo)", JSON.stringify({sid: sd.sid, evalId: sd.s.evalId}));
    const td = await A.tablette("tablette-demo", "3 ESSAI");
    await cliquer(td, /2 élèves/); await entrer(td, "g", "ABRIAL Julien"); await entrer(td, "d", "DUVERNAY Michel");
    for(const c of ["g", "d"]){ await cocherTout(td, c); await cliquer(td, /^Je commence$/, c); }
    await cliquer(prof, /Lancer Q1\b/); await pause(800);
    await scene("t-demo-q", td, "tablette");
    J.v(/🎓 Évaluation d'entraînement : elle ne compte pas\./.test(await texte(td)), H2, "la démo : « 🎓 Évaluation d'entraînement : elle ne compte pas. » (t-demo-q)", (await texte(td)).slice(0, 200));
    await cliquer(prof, /Terminer la séance/); await pause(300); await cliquer(prof, /^🛑 Terminer|Oui, terminer|Terminer la séance/); await pause(1000);
    await td.context().close(); dernier = null;
    J.v(!!(srv.store.get("qcm/evaluations") || {}).demo, H1, "la démo reste dans la base après sa séance");

    J.section("B.2 L'entrée qui se trompe : un code pas enregistré, la mauvaise tablette, le binôme");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
    await cliquer(prof, /Lancer la séance/); await pause(400); await cliquer(prof, /YVON Adam/); await cliquer(prof, /Lancer la séance/); await pause(1200);
    if(!sess().sid){ J.secours("la séance lancée par ACT (le geste n'a rien lancé)"); await prof.evaluate(() => ACT.lancerSeance("3 ESSAI", "essai", {}).then(() => ACT.appelFini(["yvon_adam"]))).catch(() => {}); await pause(1500); }
    const pl = sess().s.places || {};
    const T = Object.keys(pl).map(n => ({n, g: pl[n].g, d: pl[n].d}));
    const tJM = T.find(t => [t.g, t.d].includes("abrial_julien")), tTL = T.find(t => [t.g, t.d].includes("chevallier_theo"));
    J.v(!!tJM && !!tTL, H1, "les places de Julien et de Théo dans la base", JSON.stringify(pl).slice(0, 200));
    if(!tJM || !tTL) throw new Error("pas de places : les branches ne peuvent pas se jouer");
    const t1 = await A.tablette("tablette-1", "3 ESSAI"), t2 = await A.tablette("tablette-2", "3 ESSAI");
    tel = await A.ouvrir("telephone", "?mode=prof&view=phone", 390, 844);
    // le code pas encore enregistré : Camille
    const tc = await A.tablette("tablette-camille", "3 ESSAI");
    await cliquer(tc, /2 élèves/); await taper(tc, "g", "code", "1234"); await taper(tc, "g", "prenom", "camille"); await taper(tc, "g", "nom", "bruneau"); await cliquer(tc, /Entrer/, "g"); await pause(500);
    await scene("t-login-inconnu", tc, "tablette");
    J.v(/lève la main/i.test(await zoneTexte(tc, "g")), H1, "un code pas encore enregistré : « lève la main » (t-login-inconnu)", (await zoneTexte(tc, "g")).slice(0, 200));
    await tc.context().close();
    const cJ = tJM.g === "abrial_julien" ? "g" : "d", cM = cJ === "g" ? "d" : "g";
    await cliquer(t1, /2 élèves/); await entrer(t1, cJ, "ABRIAL Julien");
    await scene("t-binome", t1, "tablette");
    const binJ = tJM[cM], nomBinJ = (B.eleves.find(e => slug(e.nomComplet) === binJ) || {}).nomComplet || "?";
    J.v(new RegExp("Ton binôme : " + esc(nomBinJ)).test(await zoneTexte(t1, cM)), H2, "Julien entré : l'autre moitié nomme son binôme, « Ton binôme : " + nomBinJ + " » (t-binome)", (await zoneTexte(t1, cM)).slice(0, 200));
    // l'élève de la tablette de Théo qui n'est pas Théo s'assoit d'abord à la tablette de Julien, à la place du binôme de Julien
    const cT0 = tTL.g === "chevallier_theo" ? "g" : "d", egare = tTL[cT0 === "g" ? "d" : "g"], nomEgare = (B.eleves.find(e => slug(e.nomComplet) === egare) || {}).nomComplet;
    const tw = await A.tablette("tablette-egaree", "3 ESSAI"); await cliquer(tw, /2 élèves/); await entrer(tw, "g", "ABRIAL Julien".replace("ABRIAL Julien", nomEgare));
    await scene("t-rejoins", tw, "tablette");
    J.v(new RegExp("rejoins " + esc("Théo")).test(await zoneTexte(tw, "g")), H2, nomEgare + " à une tablette qui n'est pas la sienne : « Tu es avec Théo… rejoins Théo. » (t-rejoins)", (await zoneTexte(tw, "g")).slice(0, 200));
    await tw.context().close();
    await entrer(t1, cM, nomBinJ);
    await cliquer(t2, /2 élèves/);
    const cT = cT0, cL = cT === "g" ? "d" : "g";
    await entrer(t2, cT, "CHEVALLIER Théo"); await entrer(t2, cL, nomEgare);
    J.v(/ABRIAL Julien/.test(await texte(prof)) && /CHEVALLIER Théo/.test(await texte(prof)), H2, "les quatre entrés se voient sur la console");
    // l'attestation : Julien finit, Michel en est à quelques lignes
    await cocherTout(t1, cJ);
    for(let k = 0; k < 3; k++) await t1.evaluate(([f, z]) => { const r = eval("(" + f + ")")(z); const c = r && [...r.querySelectorAll(".case-b:not(.on)")].find(x => !x.disabled); if(c) c.click(); }, [`function(zone){ return document.querySelector(".moitie." + zone); }`, cM]).catch(() => {});
    await pause(300);
    await scene("t-attest-2", t1, "tablette");
    J.v(await etatBouton(t1, /^Je commence$/) !== "absent", H2, "Julien a tout coché : « Je commence » s'ouvre (t-attest-2)");
    for(const [p, c] of [[t1, cJ], [t1, cM], [t2, cT], [t2, cL]]){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(500);

    J.section("B.3 Pendant Q1 : « 👁 », du temps ajouté, « 🔴 1 séance en cours », le départ et le retour, la garde de « 🛑 Terminer »");
    await cliquer(prof, /Lancer Q1\b/); await pause(600);
    if(await cliquer(prof, /^🔴/)){ await pause(300); await scene("c-sessions", prof, "console"); await prof.keyboard.press("Escape"); await cliquer(prof, /^✕$|^Fermer$/); }
    else J.v(false, H2, "« 🔴 1 séance en cours » se clique (c-sessions)");
    await cliquer(prof, /Autoriser la réponse/); await pause(3600);
    if(await cliquer(prof, /^👁$/)){ await pause(400); await scene("c-voir-tablette", prof, "console"); J.v(/Julien|Michel|Théo|Lou/.test(await texte(prof)), H2, "« 👁 » : les deux moitiés d'une tablette, en direct (c-voir-tablette)"); await prof.keyboard.press("Escape"); await cliquer(prof, /^✕$|^Fermer$/); }
    else J.v(false, H2, "« 👁 » se clique");
    for(let k = 0; k < 4; k++) await cliquer(prof, /^\+30$/);
    await pause(300);
    await scene("c-fin-prevue", prof, "console");
    const tm = sess().s.temps || {};
    J.v(Object.keys(tm).length > 0, H1, "le temps ajouté dans la base (temps/<qi>/{reflexion, reponse})", JSON.stringify(tm));
    J.v(await cliquer(prof, /Départ d'un élève/), H2, "« 🚫 Départ d'un élève »"); await pause(300);
    await scene("c-depart", prof, "console");
    const parti = await prof.evaluate(() => { const r = [...document.querySelectorAll("button")].filter(b => /Parti/.test(b.textContent) && b.getBoundingClientRect().width > 0); const b = r.find(b => /ZELLER Lou/.test((b.closest("tr, li, .ligne, div") || b).textContent)); if(!b) return false; b.setAttribute("data-banc", "parti"); return true; });
    if(parti) await prof.click("[data-banc='parti']").catch(() => {}); await pause(600);
    J.v(!!(sess().s.partis || {}).zeller_lou, H1, "Lou partie : partis/zeller_lou (ms)", JSON.stringify(sess().s.partis));
    await scene("c-parti", prof, "console");
    await cliquer(prof, /Fermer|✕/);
    J.v(await cliquer(prof, /Retour d'un élève/), H2, "« ↩️ Retour d'un élève » s'ouvre quand un élève est parti"); await pause(300);
    await scene("c-retour", prof, "console");
    await cliquer(prof, /↩️ Revenu/); await pause(600);
    J.v(!(sess().s.partis || {}).zeller_lou, H1, "Lou revenue : la clé partis/zeller_lou retirée", JSON.stringify(sess().s.partis));
    await cliquer(prof, /Fermer|✕/);
    if(await cliquer(prof, /^🛑 Terminer la séance$/)){ await pause(300); await scene("c-terminer", prof, "console"); await cliquer(prof, /^Annuler$/); await pause(300);
      J.v(!!sess().sid, H2, "la garde de « 🛑 Terminer » : « Annuler » garde la séance (c-terminer)"); }
    await scene("p-reponse", tel, "telephone");
    if(await cliquer(tel, /CHEVALLIER Théo|Théo/)){ await pause(400); await scene("p-eleve", tel, "telephone"); await cliquer(tel, /Fermer|✕|Retour/); }
    else J.v(false, H2, "au téléphone, un clic sur Théo ouvre sa fiche (p-eleve)");
    const lab = EV.questions[0].choix;
    for(const [p, c, ch] of [[t1, cJ, 2], [t1, cM, 3], [t2, cT, 2], [t2, cL, 2]]) if((await choixOuverts(p, c, lab)).length) await cliquer(p, new RegExp("^" + esc(lab[ch]) + "$"), c);
    await cliquer(prof, /Tour suivant/); await pause(3600);
    for(const [p, c, ch] of [[t1, cJ, 2], [t1, cM, 3], [t2, cT, 2], [t2, cL, 2]]) if((await choixOuverts(p, c, lab)).length) await cliquer(p, new RegExp("^" + esc(lab[ch]) + "$"), c);
    await cliquer(prof, /Clore la question/); await pause(500);

    J.section("B.4 « ❌ Écarter » la question 3, la tablette compte sans elle, « ↩️ Remettre »");
    const ec = await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => /Écarter/.test(b.textContent) && b.getBoundingClientRect().width > 0); const x = b[b.length - 1]; if(!x) return false; x.setAttribute("data-banc", "ec"); return true; });
    if(ec) await prof.click("[data-banc='ec']").catch(() => {}); await pause(300);
    await scene("c-ecarter", prof, "console");
    J.v(await cliquer(prof, /Écarter la question 3/), H2, "la garde : « ❌ Écarter la question 3 » (c-ecarter)"); await pause(500);
    J.v(JSON.stringify(sess().s.ecartees || "").includes("2"), H1, "la base : ecartees = [2]", JSON.stringify(sess().s.ecartees));
    await scene("c-ecartee", prof, "console");
    J.v(/Écartée — pas posée/.test(await texte(prof)), H2, "« ❌ Écartée — pas posée », « ↩️ Remettre » (c-ecartee)");
    await cliquer(prof, /Lancer Q2\b/); await pause(800);
    await scene("t-q2-ecartee", t1, "tablette");
    J.v(/Question 2 \/ 2|QUESTION 2 \/ 2|2 ?\/ ?2/.test(await texte(t1)), H2, "les tablettes comptent sans elle : « Question 2 / 2 » (t-q2-ecartee)", (await texte(t1)).slice(0, 200));
    J.v(await cliquer(prof, /↩️ Remettre/), H2, "« ↩️ Remettre » la question 3"); await pause(500);
    J.v(!JSON.stringify(sess().s.ecartees || "").includes("2"), H1, "la base : la question 3 remise (ecartees sans 2)", JSON.stringify(sess().s.ecartees));
    await cliquer(prof, /Autoriser la réponse/); await pause(3600);
    const lab2 = EV.questions[1].choix;
    for(const [p, c] of [[t1, cJ], [t1, cM], [t2, cT], [t2, cL]]) if((await choixOuverts(p, c, lab2)).length) { await cliquer(p, /^Madrid$/, c); await cliquer(p, /^Berlin$/, c); }
    await cliquer(prof, /Tour suivant/); await pause(3600);
    for(const [p, c] of [[t1, cJ], [t1, cM], [t2, cT], [t2, cL]]) if((await choixOuverts(p, c, lab2)).length) await cliquer(p, /^Genève$/, c);
    await cliquer(prof, /Clore la question/); await pause(500);

    J.section("B.5 « ⚠️ Annuler » la question 2 ; « 🔓 Rouvrir pour tous »");
    const an = await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => /⚠️ Annuler/.test(b.textContent) && b.getBoundingClientRect().width > 0); const x = b[1]; if(!x) return false; x.setAttribute("data-banc", "an"); return true; });
    if(an) await prof.click("[data-banc='an']").catch(() => {}); await pause(300);
    await scene("c-annuler", prof, "console");
    J.v(await cliquer(prof, /Annuler la question 2/), H2, "la garde : « ⚠️ Annuler la question 2 » (c-annuler)"); await pause(500);
    J.v(JSON.stringify(sess().s.annulees || "").includes("1"), H1, "la base : annulees = [1]", JSON.stringify(sess().s.annulees));
    await scene("c-annulee", prof, "console");
    J.v(/Annulée — posée, puis annulée/.test(await texte(prof)), H2, "« ⚠️ Annulée — posée, puis annulée » (c-annulee)");
    if(await cliquer(prof, /Rouvrir pour tous/)){ await pause(300); await scene("c-rouvrir-tous", prof, "console"); await cliquer(prof, /^Annuler$|^Fermer$/); }

    J.section("B.6 « ⏸️ Finir à une autre heure », puis « ▶️ Reprendre » ; la console perdue");
    J.v(await cliquer(prof, /^⏸️ Finir à une autre heure$/), H2, "« ⏸️ Finir à une autre heure »"); await pause(300);
    await scene("c-finir-autre-heure", prof, "console");
    const fins = await prof.evaluate(() => [...document.querySelectorAll("button")].filter(b => /Finir à une autre heure/.test(b.textContent) && b.getBoundingClientRect().width > 0).length);
    if(fins > 1) await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => /Finir à une autre heure/.test(b.textContent) && b.getBoundingClientRect().width > 0); b[b.length - 1].click(); });
    await pause(800);
    J.v(/pause/.test(etat().ph || "") || !!sess().s.paused, H1, "la séance garde son état exact, en pause (etat.ph = pause)", JSON.stringify(etat()));
    await prof.reload(); await pause(1200); await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(400);
    await scene("c-reprendre", prof, "console");
    J.v(await cliquer(prof, /Reprendre la séance du/), H2, "« ▶️ Reprendre la séance du … — question … » (c-reprendre)", (await texte(prof)).slice(0, 300)); await pause(800);
    J.v(!/pause/.test(etat().ph || ""), H1, "reprise : la séance n'est plus en pause", JSON.stringify(etat()));
    // la console perdue en pleine question : une nouvelle console retrouve la séance
    await cliquer(prof, /Lancer Q3\b/); await pause(600);
    await prof.context().close();
    prof = await A.ouvrir("console-2", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
    await scene("c-interrompue", prof, "console");
    J.v(/Reprendre la séance/.test(await texte(prof)) || /Q3|Question 3/.test(await texte(prof)), H2, "la console perdue : une nouvelle console retrouve la séance (c-interrompue)", (await texte(prof)).slice(0, 300));
    await cliquer(prof, /🔄 Reprendre la séance/); await pause(500);
    await cliquer(prof, /Terminer la séance|Terminer définitivement/); await pause(300); await cliquer(prof, /^🛑 Terminer|Oui, terminer|Terminer la séance|Terminer définitivement/); await pause(800);
    await scene("t-fin", t1, "tablette");
  } catch(e){ J.v(false, "banc", "les branches se sont arrêtées", e.stack); }
  J.section("B.7 Aucune erreur de page, aucune boîte système");
  for(const p of A.pages) J.v(p.__err.length === 0, H1, "page « " + p.__nom + " » sans erreur ni boîte système", p.__err.slice(0, 3).join(" · "));
  // les erreurs que l'app écrit elle-même (un écran qui ne se dessine pas, une écriture refusée) : chacune une fois, avec ses pages
  const cerr = {}; for(const p of A.pages) for(const t of p.__cerr || []) if(!/^Failed to load resource/.test(t)) (cerr[t] = cerr[t] || []).push(p.__nom);   // une ressource externe, bloquée par le faux hub
  for(const t of Object.keys(cerr)) J.v(false, /c-(seances|resultats|fiche|evals|collage|reglages|sauvegarde)|e-mes|x627|x632|Soir|Evals/.test(t) ? H3 : /Ecran|écran (c|t|p|b)-/.test(t) ? H2 : H1, "erreur écrite par l'app dans " + cerr[t].length + " page(s) (" + cerr[t].slice(0, 4).join(", ") + ")", t);
  await A.fermer(); await srv.close();
  fs.writeFileSync(path.join(SORTIE, "phases-branches.txt"), srv.phases.join("\n") + "\n");
  const duree = Math.round((Date.now() - J.t0) / 1000);
  fs.writeFileSync(path.join(SORTIE, "releves-branches.json"), JSON.stringify(RELEVES));
  const lignes = ["Les gestes rares de l'heure (QCM-4 · BANC) — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString(),
    "Durée : " + duree + " s (" + Math.floor(duree / 60) + " min " + (duree % 60) + " s) · vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length, ""];
  for(const e of J.l) lignes.push(e.section ? "\n── " + e.section + " (" + e.t + " s)" : e.secours ? "  SECOURS " + e.secours : (e.ok ? "  ok     " : "  ÉCHEC  ") + "[" + e.proprio + "] " + e.quoi + (e.ok ? "" : " — vu : " + e.vu));
  fs.writeFileSync(path.join(SORTIE, "branches.txt"), lignes.join("\n") + "\n");
  console.log("\nDurée " + duree + " s · " + J.verifs.length + " vérifications · " + J.echecs.length + " échecs");
  process.exit(J.echecs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
