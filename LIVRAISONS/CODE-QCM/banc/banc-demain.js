// QCM-4 · BANC — l'heure de demain, de bout en bout : une classe de 4e (6 élèves, un absent), l'évaluation de 4e collée par son JSON
// (11 questions, chapitre 4e-ch1, sans fiche au hub), trois tablettes (deux partagées, une pour un élève seul), les 11 questions
// à leurs deux tours, l'estimation, la correction des 11, la co-évaluation, le bilan, puis le soir (Résultats, copies, PDF).
// Par le geste, sur le faux hub, comme banc.js.   APP_FILE=<app> node banc/banc-demain.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, esc, slug, texte, attendre, zoneTexte, cliquer, etatBouton, choisir, taper, cocherTout, choixOuverts, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "demain-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures-demain"), {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H3 = "QCM-3 · SOIR";
const EV4 = JSON.parse(fs.readFileSync(path.join(__dirname, "donnees", "eval-4e-11.json"), "utf8"));
const NQ = EV4.questions.length;
const NOMS = ["ARNOUX Maël", "BESSON Lina", "CAMUS Yanis", "DELORME Rose", "EYMARD Paul", "FABRE Iris"];
const ABSENT = "FABRE Iris";
// ce que chacun clique (T) et ce que son voisin lit sur sa feuille (L), question par question : j juste, f faux
const PLAN = {
  "ARNOUX Maël":  {T: "jjjjjjjjjjf", L: "jjjjjjjjjjf"},   // 10 / 10 (ou 11 si la bonus compte au total)
  "BESSON Lina":  {T: "jjfjfjjjfjf", L: "jffjfjjjfjf"},   // feuille fausse à Q2, tablette juste : trouvée au dernier moment → 7
  "CAMUS Yanis":  {T: "ffffffffffff", L: "ffffffffffff"},  // 0
  "DELORME Rose": {T: "jfjfjfjfjff", L: "jfjfjfjfjff"},   // 5
  "EYMARD Paul":  {T: "jjjjjfffffff", L: "fjjjjfffffff"}   // trouvée à Q1 → 5
};
const attendu = n => { const p = PLAN[n]; let pts = 0, t = false; for(let i = 0; i < 10; i++){ if(p.L[i] === "j") pts++; else if(p.T[i] === "j" && !t){ t = true; pts++; } } return pts; };
let nCapt = 0;
async function capt(p, nom){ await photo(p, path.join(SORTIE, "captures-demain", String(++nCapt).padStart(3, "0") + "-" + nom + ".png")); }
const choix = (qi, c) => { const Q = EV4.questions[qi]; if(c === "j") return Q.bonnes.slice(); const f = Q.choix.map((_, i) => i).filter(i => !Q.bonnes.includes(i)); return [f[0]]; };

(async () => {
  let C4 = null;
  const {B, srv, port} = await O.fauxHub(B => { C4 = O.ajouterClasse(B, "4 ESSAI", "4e", NOMS, 3101); });
  const A = new O.Appareils(srv, port); await A.demarrer();
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["4 ESSAI"] || a[slug("4 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : (x.etat && typeof x.etat === "object" ? x.etat : {}); };   // contrat C1 : deroule
  let prof, sid = null; const seulRouvert = [];
  try {
    J.section("D.1 Le JSON de l'évaluation de 4e collé, « Lancer » ouvert");
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Évaluations/); await pause(300);
    await cliquer(prof, /Nouvelle évaluation/); await pause(300);
    const colle = await prof.evaluate(js => { const t = [...document.querySelectorAll("textarea")].find(x => x.getBoundingClientRect().width > 0); if(!t) return false; const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set; set.call(t, js); t.dispatchEvent(new Event("input", {bubbles: true})); return true; }, JSON.stringify(EV4));
    J.v(colle, H3, "« ➕ Nouvelle évaluation » : le JSON se colle");
    await cliquer(prof, /Vérifier le format/); await pause(300);
    await capt(prof, "collage");
    await cliquer(prof, /Enregistrer l'évaluation|Enregistrer|Créer|Importer/); await pause(800);
    let evs = srv.store.get("qcm/evaluations") || {}, id4 = Object.keys(evs).find(x => evs[x].chapitre === "4e-ch1");
    J.v(!!id4 && Object.keys(evs[id4].questions || {}).length === NQ, H3, "l'évaluation collée est dans la base : 11 questions, chapitre 4e-ch1, ses compétences et ses temps", id4 ? JSON.stringify(evs[id4]).slice(0, 300) : "absente");
    if(!id4){ // pour éprouver l'heure quand même, le banc la pose dans la base (et le dit)
      srv.store.apply({t: "set", p: "qcm/evaluations/banc4e", v: EV4}); srv.broadcast({t: "set", p: "qcm/evaluations/banc4e", v: EV4}, null); id4 = "banc4e";
      J.secours("l'évaluation de 4e posée dans la base par le banc (qcm/evaluations/banc4e), le collage n'ayant rien écrit, pour jouer l'heure"); await pause(800); }
    await cliquer(prof, /Pilotage classe/); await pause(300);
    J.v(await choisir(prof, /4 ESSAI|4e Essai/), H2, "Pilotage classe : 4 ESSAI se choisit"); await pause(200);
    J.v(await choisir(prof, /Paris à la barre/), H2, "l'évaluation de 4e se choisit"); await pause(300);
    await capt(prof, "lancer");
    J.v(await etatBouton(prof, /Lancer la séance/) === "ouvert", H2, "« 🚀 Lancer la séance » ouvert : l'évaluation est complète (chapitre sans fiche au hub, cadrage 741)", await etatBouton(prof, /Lancer la séance/));
    J.v(/Durée estimée/.test(await texte(prof)), H2, "« ⏱️ Durée estimée » pour 11 questions", (await texte(prof)).slice(0, 200));
    await cliquer(prof, /Lancer la séance/); await pause(500);
    await cliquer(prof, new RegExp(esc(ABSENT))); await pause(200);
    await capt(prof, "appel");
    await cliquer(prof, /Lancer la séance/); await pause(1200);
    if(!sess().sid){ J.secours("la séance de 4e lancée par ACT.lancerSeance + ACT.appelFini (le geste n'a rien lancé), pour éprouver la suite");
      await prof.evaluate(id => ACT.lancerSeance("4 ESSAI", id, {}).then(() => ACT.appelFini(["fabre_iris"])), id4).catch(e => J.secours("ACT a échoué : " + e.message)); await pause(1500); }
    ({sid} = sess());
    J.v(!!sid, H1, "la séance de 4e est lancée (sessionActive/4 ESSAI)", JSON.stringify(srv.store.get("qcm/sessionActive")));
    const pl = sess().s.places || {};
    const TABS = Object.keys(pl).sort((a, b) => a - b).map(n => ({n, g: pl[n].g || null, d: pl[n].d || null}));
    J.v(TABS.length === 3 && TABS.filter(t => !t.g || !t.d).length === 1, H1, "5 présents : trois tablettes, deux partagées et une pour un élève seul", JSON.stringify(pl));
    if(!TABS.length) throw new Error("la séance n'a pas de places (places/<n>/{g, d}) : l'heure ne peut pas se jouer");
    const nomDe = sl => NOMS.find(n => slug(n) === sl);
    const cotes = t => (!t.g || !t.d) ? [[null, t.g || t.d]] : [["g", t.g], ["d", t.d]];

    J.section("D.2 L'entrée et la première attestation");
    const tabs = {};
    await Promise.all(TABS.map(async t => { const p = await A.tablette("tablette-4e-" + t.n, "4 ESSAI"); tabs[t.n] = p;
      // reprise 7, point 13 : l'entrée d'outils.js (« Combien êtes-vous ? » ou l'entrée unique « 👋 Identifie-toi »)
      const els = cotes(t).map(([cote, sl]) => [cote || (t.g ? "g" : "d"), (C4.find(x => slug(x.nomComplet) === sl) || {}).nomComplet]).filter(x => x[1]);
      await O.entrerTablette(p, els, nm => C4.find(x => x.nomComplet === nm).code);
      if(/Tu es bien/.test(await texte(p))) await cliquer(p, /^Oui/);
      for(const [cote] of cotes(t)){ await cocherTout(p, cote); await cliquer(p, /^Je commence$/, cote); } }));
    await pause(800);
    const at1 = ((sess().s.attest || {})[1]) || {};
    J.v(Object.keys(at1).length === 5, H1, "les 5 présents entrés et attestés (attest/1)", Object.keys(at1).join(", "));
    await capt(prof, "pret"); await capt(tabs[TABS[0].n], "tablette-pret");

    for(let qi = 0; qi < NQ; qi++){
      J.section("D.3 Question " + (qi + 1) + " / " + NQ);
      const Q = EV4.questions[qi];
      J.v(await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")), H2, "« ▶️ Lancer Q" + (qi + 1) + " »"); await pause(500);
      const t0 = TABS[0], p0 = tabs[t0.n];
      J.v(await attendre(p0, new RegExp(esc(Q.enonce.slice(0, 40))), 5000), H2, "Q" + (qi + 1) + " sur la tablette 1", (await texte(p0)).slice(0, 160));
      J.v(new RegExp("(Question|QUESTION) " + (qi + 1) + " ?/ ?" + NQ).test(await texte(p0)), H2, "la tablette compte « Question " + (qi + 1) + " / " + NQ + " »", (await texte(p0)).slice(0, 160));
      await cliquer(prof, /Autoriser la réponse/);
      const parQ = {}, dejaQ = new Set();
      for(const tour of [1, 2]){
        await pause(3500);
        let rep = 0;
        await Promise.all(TABS.map(async t => { const p = tabs[t.n]; for(const [cote, sl] of cotes(t)){ const o = await choixOuverts(p, cote, Q.choix); if(!o.length) continue;
          if(dejaQ.has(sl)){ seulRouvert.push(nomDe(sl) + " (Q" + (qi + 1) + ")"); continue; }       // cadrage 27 : l'élève seul répond au tour 1, puis il attend
          for(const c of choix(qi, PLAN[nomDe(sl)].T[qi])) await cliquer(p, new RegExp("^" + esc(Q.choix[c]) + "$"), cote, {apres: 80}); rep++; dejaQ.add(sl); } }));
        parQ[tour] = rep;
        if(qi === 0) await capt(p0, "q1-tour" + tour);
        // B : son temps fini ; « ⏭️ Tour suivant » ou « 🔒 Clore » n'attend pas la fin du temps
        const fin = Date.now() + (Q.reponse + 4) * 1000; let b = 0;
        while(Date.now() < fin){ let vus = 0;
          await Promise.all(TABS.map(async t => { const p = tabs[t.n]; for(const [cote] of cotes(t)) if(await cliquer(p, /^Oui, la même chose$/, cote)){ b++; vus++; } }));
          if(b >= rep) break; await pause(600); }
        J.v(b >= rep, H2, "Q" + (qi + 1) + ", tour " + tour + " : B se dit, son temps fini", b + " B pour " + rep);
        if(tour === 1 && etat().tour === 1 && /reponse|b/.test(etat().ph || "")) await cliquer(prof, /Tour suivant/);
      }
      J.v(parQ[1] + parQ[2] === 5, H2, "Q" + (qi + 1) + " : les 5 présents répondent, chacun à son tour (les deux moitiés, et l'élève seul)", JSON.stringify(parQ));
      if(!(await (async () => { for(let k = 0; k < 40; k++){ if(etat().ph === "close") return true; await pause(250); } return false; })())) await cliquer(prof, /Clore la question/);
      await pause(300);
    }
    const nrep = Object.keys(sess().s.reponses || {}).length;
    J.v(nrep === NQ, H1, "les réponses des 11 questions dans la base", nrep);
    await capt(prof, "derniere-close");

    J.v(seulRouvert.length === 0, H2, "l'élève seul répond au 1er tour, puis il attend : ses choix ne se rouvrent pas au 2e tour (cadrage, point 27)", seulRouvert.join(", "));
    J.section("D.4 L'estimation, la seconde attestation, la correction des 11");
    J.v(await cliquer(prof, /Lancer l'autoévaluation/), H2, "« 📊 Lancer l'autoévaluation »"); await pause(600);
    await Promise.all(TABS.map(async t => { for(const [cote] of cotes(t)) await cliquer(tabs[t.n], /Maîtrise satisfaisante/, cote); }));
    J.v(await cliquer(prof, /Lancer la correction/), H2, "« 📝 Lancer la correction »"); await pause(600);
    await Promise.all(TABS.map(async t => { for(const [cote] of cotes(t)){ await cocherTout(tabs[t.n], cote); await cliquer(tabs[t.n], /^Je commence la correction$/, cote); } }));
    await pause(600);
    for(let k = 0; k < 15 && etat().ph !== "lecture"; k++) await pause(200);
    // décision de Paul, 13/10 07:22 : c'est lui qui lance la correction
    J.v(etat().ph !== "lecture", H1, "tous ont coché la seconde attestation : la correction ne commence pas seule (décision de Paul, 07:22)", JSON.stringify(etat()));
    J.v(await cliquer(prof, /Commencer la correction/), H2, "Paul clique « ▶️ Commencer la correction », ouvert");
    for(let k = 0; k < 20 && etat().ph !== "lecture"; k++) await pause(200);
    J.v(etat().ph === "lecture", H1, "après son clic, la correction commence (c-attest2)", JSON.stringify(etat()));
    const oc = sess().s.ordreCorr; const ordre = Array.isArray(oc) ? oc : oc ? Object.values(oc) : [];
    J.v(ordre.length === NQ && new Set(ordre).size === NQ, H1, "ordreCorr : les 11 questions, de la plus ratée à la mieux réussie", JSON.stringify(oc));
    for(let k = 0; k < NQ; k++){
      const qi = ordre[k] !== undefined ? +ordre[k] : k; const Q = EV4.questions[qi];
      if(k){ await cliquer(prof, /Question suivante/); await pause(600); }
      // la lecture : le voisin clique, dans la moitié du propriétaire de la feuille ; l'élève seul lit lui-même
      await Promise.all(TABS.map(async t => { const p = tabs[t.n]; for(const [cote, sl] of cotes(t)) for(const c of choix(qi, PLAN[nomDe(sl)].L[qi])) await cliquer(p, new RegExp("^" + esc(Q.choix[c]) + "$"), cote, {apres: 80}); }));
      await pause(600);
      J.v(await etatBouton(prof, /Révéler/) === "ouvert", H2, "correction de Q" + (qi + 1) + " : toutes les feuilles lues, « 💡 Révéler » s'ouvre", await etatBouton(prof, /Révéler/));
      await cliquer(prof, /Révéler/); await pause(500);
      if(k === 0) { await capt(prof, "corr-1"); await capt(tabs[TABS[0].n], "tablette-corr-1"); }
    }
    const tr = sess().s.trouvee || {};
    J.v(tr[slug("BESSON Lina")] !== undefined && +tr[slug("BESSON Lina")] === 1 && tr[slug("EYMARD Paul")] !== undefined && +tr[slug("EYMARD Paul")] === 0 && Object.keys(tr).length === 2, H1, "« Trouvée au dernier moment » : Lina à Q2, Paul à Q1, et personne d'autre", JSON.stringify(tr));

    J.section("D.5 La co-évaluation, le bilan des 5");
    J.v(await cliquer(prof, /Ouvrir la co-évaluation/), H2, "« 🤝 Ouvrir la co-évaluation, puis leur bilan »"); await pause(700);
    await Promise.all(TABS.map(async t => { for(const [cote] of cotes(t)) await cliquer(tabs[t.n], /^✅ Je pense que .* a bien lu ma feuille/, cote); }));
    await pause(700);
    const seulT = TABS.find(t => !t.g || !t.d);
    J.v(await etatBouton(prof, /Afficher leur bilan aux élèves/) === "ouvert", H2, "tous ont répondu (l'élève seul n'a pas de co-évaluation) : « 🏁 Afficher leur bilan aux élèves » s'ouvre", await etatBouton(prof, /Afficher leur bilan/));
    await cliquer(prof, /Afficher leur bilan aux élèves/); await pause(1000);
    const ko = [];
    for(const t of TABS) for(const [cote, sl] of cotes(t)){ const n = nomDe(sl), z = (await zoneTexte(tabs[t.n], cote)).replace(/\s+/g, " ");
      if(!new RegExp("\\b" + attendu(n) + " ?/ ?(10|11)\\b").test(z)) ko.push(n + " attendu " + attendu(n) + " / 10, vu « " + ((z.match(/\d+ ?\/ ?\d+/) || ["?"])[0]) + " »"); }
    J.v(ko.length === 0, H2, "le bilan de chacun des 5 dit sa note sur les 11 questions (la note, c'est la feuille ; une seule « Trouvée au dernier moment »)", ko.join(" ; "));
    for(const t of TABS) await capt(tabs[t.n], "bilan-tablette-" + t.n);
    await capt(prof, "bilan-console");
    await cliquer(prof, /Terminer la séance/); await pause(300); await cliquer(prof, /^🛑 Terminer|Oui, terminer|Terminer la séance/); await pause(1000);
    J.v((srv.store.get("qcm/sessions/" + sid) || {}).etat === "terminee" && !srv.store.get("qcm/sessionActive/4 ESSAI"), H1, "la séance de 4e terminée (etat = terminee, plus active)", JSON.stringify((srv.store.get("qcm/sessions/" + sid) || {}).etat));

    J.section("D.6 Le soir de la 4e : Résultats, rendre les copies, le PDF");
    await cliquer(prof, /^Données$/); await cliquer(prof, /Résultats/); await pause(500);
    J.v(/4 ESSAI|4e Essai/.test(await texte(prof)), H3, "Résultats : la séance de 4e, sous 4 ESSAI", (await texte(prof)).slice(0, 300));
    await cliquer(prof, /^📊 Ouvrir$/); await pause(700);
    const tt = await texte(prof);
    J.v(NOMS.filter(n => n !== ABSENT).every(n => tt.includes(n)), H3, "le tableau de la séance : les 5 présents", tt.slice(0, 300));
    J.v(/FABRE Iris[\s\S]{0,60}(absent|∅)/i.test(tt) || /absent/i.test(tt), H3, "Iris, absente, est dite absente", tt.slice(0, 300));
    await capt(prof, "resultats");
    for(const al of Object.values((srv.store.get("qcm/sessions/" + sid) || {}).aLire || {})){ const n = NOMS.find(x => slug(x) === al.eleveSlug); if(!n) continue;
      if(await cliquer(prof, new RegExp("^" + esc(n) + "$"))){ await pause(300); let k = 0; while(k < 11 && await cliquer(prof, /^✔ Marquer lue$/)) k++; if(!(await cliquer(prof, /^✕ Fermer$/))) await prof.keyboard.press("Escape"); await pause(200); } }
    await cliquer(prof, /^📊 Résultats$/); await pause(400);
    J.v(await cliquer(prof, /rendre les copies ▸/), H3, "les feuilles lues : « rendre les copies ▸ »", (await texte(prof)).slice(0, 300)); await pause(300);
    await cliquer(prof, /^Rendre les copies$|^📤 Rendre|^Rendre$/); await pause(600);
    J.v(!!((srv.store.get("qcm/sessions/" + sid) || {}).copies || {}).rendues, H3, "copies rendues (copies.rendues)", JSON.stringify((srv.store.get("qcm/sessions/" + sid) || {}).copies));
    await cliquer(prof, /^📊 Ouvrir$/); await pause(500);
    J.v(await cliquer(prof, /PDF notes et compétences/), H3, "le PDF « notes et compétences » s'ouvre (11 questions)"); await pause(1500);
    await capt(prof, "pdf");
  } catch(e){ J.v(false, "banc", "l'heure de demain s'est arrêtée", e.stack); }
  J.section("D.7 Aucune erreur de page, aucune boîte système");
  for(const p of A.pages) J.v(p.__err.length === 0, H1, "page « " + p.__nom + " » sans erreur ni boîte système", p.__err.slice(0, 3).join(" · "));
  // les erreurs que l'app écrit elle-même (un écran qui ne se dessine pas, une écriture refusée) : chacune une fois, avec ses pages
  const cerr = {}; for(const p of A.pages) for(const t of p.__cerr || []) if(!/^Failed to load resource/.test(t)) (cerr[t] = cerr[t] || []).push(p.__nom);   // une ressource externe, bloquée par le faux hub
  for(const t of Object.keys(cerr)) J.v(false, /c-(seances|resultats|fiche|evals|collage|reglages|sauvegarde)|e-mes|x627|x632|Soir|Evals/.test(t) ? H3 : /Ecran|écran (c|t|p|b)-/.test(t) ? H2 : H1, "erreur écrite par l'app dans " + cerr[t].length + " page(s) (" + cerr[t].slice(0, 4).join(", ") + ")", t);
  await A.fermer(); await srv.close();
  fs.writeFileSync(path.join(SORTIE, "phases-demain.txt"), srv.phases.join("\n") + "\n");
  const duree = Math.round((Date.now() - J.t0) / 1000);
  const lignes = ["L'heure de demain (QCM-4 · BANC) — 4 ESSAI, l'évaluation de 4e collée, 11 questions — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString(),
    "Durée : " + duree + " s (" + Math.floor(duree / 60) + " min " + (duree % 60) + " s) · vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length, ""];
  for(const e of J.l) lignes.push(e.section ? "\n── " + e.section + " (" + e.t + " s)" : e.secours ? "  SECOURS " + e.secours : (e.ok ? "  ok     " : "  ÉCHEC  ") + "[" + e.proprio + "] " + e.quoi + (e.ok ? "" : " — vu : " + e.vu));
  fs.writeFileSync(path.join(SORTIE, "demain.txt"), lignes.join("\n") + "\n");
  fs.writeFileSync(path.join(SORTIE, "demain.json"), JSON.stringify({duree, journal: J.l}, null, 1));
  console.log("\nDurée " + duree + " s · " + J.verifs.length + " vérifications · " + J.echecs.length + " échecs");
  process.exit(J.echecs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
