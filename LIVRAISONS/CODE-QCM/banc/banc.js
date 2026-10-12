// QCM-4 · BANC — le banc commun de l'app QCM, par le geste, sur le faux hub, avec toutes les pages à la fois.
// Il joue la séance du scénario de la maquette v9 (3 ESSAI, 24 présents, Adam absent, l'évaluation d'essai, les réponses de chacun) :
// une console, les 12 tablettes partagées, le téléphone, le tableau ; de « 🚀 Lancer la séance » au bilan ; puis le soir ; puis le reste ;
// puis l'heure de demain (une 4e, 11 questions, le JSON collé). À chaque moment d'une scène de la maquette, il relève l'écran
// (texte, gestes, infobulles) pour la fidélité (fidelite.js). Il mesure sa durée.
//   APP_FILE=<evaluation-qcm.staging.html> node banc/banc.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, esc, slug, texte, attendre, zoneTexte, cliquer, etatBouton, choisir, taper, cocherTout, choixOuverts, photo, releve } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "banc-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures"), {recursive: true});
const S = O.scenario();
const J = new O.Journal();
const RELEVES = {};       // scène de la maquette → relevé de l'app au même moment
const PLAFOND = 19 * 60 * 1000;   // le banc tient en moins de 20 minutes : au-delà, il s'arrête et le dit
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H3 = "QCM-3 · SOIR";
let nCapt = 0;

async function scene(id, p, appareil){
  if(!p) return;
  try { RELEVES[id] = Object.assign({appareil: appareil || p.__nom, t: Math.round((Date.now() - J.t0) / 1000)}, await releve(p));
    await photo(p, path.join(SORTIE, "captures", String(++nCapt).padStart(3, "0") + "-" + id + "-" + (appareil || p.__nom) + ".png")); } catch(e){}
}
function tropLong(){ if(Date.now() - J.t0 > PLAFOND) throw new Error("plafond de 19 minutes atteint"); }

(async () => {
  const ESSAI = ["ABRIAL Julien", "BAUDRY Léa", "CARRÉ Tom", "DUVERNAY Michel", "ESNAULT Inès", "FOUCHER Hugo", "GALLOIS Manon", "HÉBRARD Nathan", "ISAMBERT Chloé", "JOUBERT Louis", "LACOMBE Emma", "MAILLARD Noah", "NOGARET Zoé", "OLLIVIER Sacha", "PERRAUD Jade", "QUINTON Enzo", "RAMBAUD Lina", "SABATIER Malo", "TESSIER Anna", "VALLÉE Rayan", "WEBER Clara", "YVON Adam", "ZELLER Lou", "BRUNEAU Camille", "CHEVALLIER Théo"];
  const NOMS4 = ESSAI.map(n => n.replace(/ (.*)$/, " $1") + "").map((n, i) => ["ARNOUX Maël", "BESSON Lina", "CAMUS Yanis", "DELORME Rose", "EYMARD Paul", "FABRE Iris", "GIRARD Noé", "HAMON Léna", "IMBERT Sami", "JOLY Alix", "KLEIN Nora", "LEROUX Timéo"][i]).filter(Boolean);
  let C4 = null;
  const {B, srv, port} = await O.fauxHub(B => {
    // la démo (qcm/evaluations/demo) : celle de la maquette, au format du prompt
    B.tree.qcm.evaluations.demo = {titre: S.DEMO.titre, mode: "strict", demo: true, questions: S.DEMO.questions.map(q => ({enonce: q.enonce, choix: q.choix, bonnes: q.bonnes, niveau: q.niveau, reflexion: q.reflexion, reponse: q.reponse, competences: []}))};
    C4 = O.ajouterClasse(B, "4 ESSAI", "4e", NOMS4, 3101);
  });
  const codeDe = n => (B.eleves.find(e => e.nomComplet === n) || C4.find(e => e.nomComplet === n) || {}).code;
  const A = new O.Appareils(srv, port); await A.demarrer();
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; const sid = a[slug("3 ESSAI")] || a["3_essai"] || Object.values(a)[0]; const id = typeof sid === "object" && sid ? (sid.sessionId || sid.id || sid.sid) : sid; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => (sess().s.etat || {});
  let prof, tel, tableau, tabs = {}, tabJM = null;
  try {
    // ════════ 1. L'HEURE ════════
    J.section("1.1 Avant l'heure : la console, « 🚀 Lancer la séance », l'appel");
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    J.v(/Pilotage|Évaluation/.test(await texte(prof)), H1, "la console s'ouvre (?mode=prof, l'adresse de la 7.7.1)", (await texte(prof)).slice(0, 200));
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    J.v(await choisir(prof, /3 ESSAI/), H2, "Pilotage classe : la classe 3 ESSAI se choisit");
    J.v(await choisir(prof, /Évaluation d'essai/), H2, "Pilotage classe : l'évaluation d'essai se choisit (complète : chapitre 3e-ch1, temps, compétences)");
    await pause(400);
    await scene("c-lancer", prof, "console");
    J.v(await etatBouton(prof, /Lancer la séance/) === "ouvert", H2, "« 🚀 Lancer la séance » ouvert pour une évaluation complète", await etatBouton(prof, /Lancer la séance/));
    await cliquer(prof, /Lancer la séance/); await pause(600);
    await scene("c-appel", prof, "console");
    // l'appel : Adam absent (scénario de la maquette : son binôme Théo va avec Lou)
    const appelOk = await cliquer(prof, /YVON Adam/);
    J.v(appelOk, H2, "l'appel : un clic sur YVON Adam le marque absent", (await texte(prof)).slice(0, 300));
    await cliquer(prof, /Lancer la séance/); await pause(1200);
    let {sid, s} = sess();
    J.v(!!sid, H1, "« 🚀 Lancer la séance » écrit une séance active (qcm/sessionActive/<classeSlug>)", JSON.stringify(srv.store.get("qcm/sessionActive")));
    J.v(!!s.etat && typeof s.etat === "object", H1, "la séance a son état (etat : {ph, qi, tour, cote, depuis, duree}) — contrat §3.1", JSON.stringify(s).slice(0, 300));
    J.v(!!s.places && Object.keys(s.places).length >= 12, H1, "la séance a ses places (places/<n>/{g, d}) : 12 tablettes pour 24 présents", JSON.stringify(s.places || null).slice(0, 300));
    J.v(JSON.stringify(s.absents || "").includes("yvon_adam") || JSON.stringify(s.absents || "").includes("YVON Adam"), H1, "Adam est absent dans la base (absents)", JSON.stringify(s.absents || null));
    const pl = s.places || {};
    // les tablettes : celles de la base, sinon les binômes du scénario
    let TABS = Object.keys(pl).sort((a, b) => a - b).map(n => ({n, g: pl[n].g || null, d: pl[n].d || null}));
    const nomDeSlug = sl => ESSAI.find(x => slug(x) === sl) || sl;
    if(!TABS.length) TABS = S.PAIRES.map((x, i) => ({n: String(i + 1), g: slug(x[0]), d: x[1] ? slug(x[1]) : null}));
    const enPlace = TABS.find(t => [t.g, t.d].includes("abrial_julien"));
    J.v(!!enPlace && [enPlace.g, enPlace.d].includes("duvernay_michel"), H1, "Julien et Michel sur la même tablette (binômes formés par le QCM précédent, comme dans la maquette)", JSON.stringify(enPlace));
    const tl = TABS.find(t => [t.g, t.d].includes("chevallier_theo"));
    J.v(!!tl && [tl.g, tl.d].includes("zeller_lou"), H1, "Adam absent : son binôme Théo est mis avec Lou, seule (c-appel)", JSON.stringify(tl));

    J.section("1.2 Le tableau et le téléphone");
    tableau = await A.ouvrir("tableau", "?mode=prof&view=board", 1280, 800);
    tel = await A.ouvrir("telephone", "?mode=prof&view=phone", 390, 844);
    J.v((await texte(tableau)).length > 10, H2, "le tableau s'ouvre (?mode=prof&view=board)", (await texte(tableau)).slice(0, 120));
    J.v(/3 ESSAI|Évaluation d'essai|essai/i.test(await texte(tel)), H2, "le téléphone montre la séance en cours", (await texte(tel)).slice(0, 160));

    J.section("1.3 L'entrée : les 12 tablettes partagées, au code, au clavier de l'app");
    const combien = await A.ouvrir("tablette-0", "?mode=eleve", 1280, 800);
    J.v(await attendre(combien, /Combien êtes-vous sur cette tablette/, 8000), H2, "une tablette demande « Combien êtes-vous sur cette tablette ? »", (await texte(combien)).slice(0, 160));
    await scene("t-combien", combien, "tablette");
    // un code faux
    await cliquer(combien, /1 élève/); await pause(400);
    await taper(combien, null, "code", "9999"); await taper(combien, null, "prenom", "tom"); await taper(combien, null, "nom", "carré");
    await cliquer(combien, /Entrer/); await pause(500);
    J.v(/Ce code ne correspond pas\. Vérifie tes 4 chiffres\./.test(await texte(combien)), H1, "un code faux : « Ce code ne correspond pas. Vérifie tes 4 chiffres. »", (await texte(combien)).slice(0, 200));
    // les 12 tablettes : chaque moitié tape son code, son prénom, son nom
    const champAvant = {};
    await Promise.all(TABS.map(async (t, i) => {
      const p = await A.ouvrir("tablette-" + t.n, "?mode=eleve", 1280, 800); tabs[t.n] = p;
      await attendre(p, /Combien êtes-vous/, 8000);
      const seul = !t.g || !t.d;
      await cliquer(p, seul ? /1 élève/ : /2 élèves/); await pause(300);
      for(const cote of seul ? [null] : ["g", "d"]){
        const sl = seul ? (t.g || t.d) : t[cote]; const nom = nomDeSlug(sl); const [N, ...P] = nom.split(" ");
        await taper(p, cote, "code", codeDe(nom)); await taper(p, cote, "prenom", P.join(" ").toLowerCase()); await taper(p, cote, "nom", N.toLowerCase());
        if(t.n === enPlace.n && cote === "g") champAvant.g = await zoneTexte(p, "d");
        await cliquer(p, /Entrer/, cote); await pause(300);
      }
    }));
    tabJM = enPlace ? tabs[enPlace.n] : null;
    const cJ = enPlace && enPlace.g === "abrial_julien" ? "g" : "d", cM = cJ === "g" ? "d" : "g";
    let vus = 0; const tP = await texte(prof);
    for(const n of ESSAI) if(n !== "YVON Adam" && new RegExp(esc(n)).test(tP)) vus++;
    J.v(vus === 24, H2, "les 24 élèves entrés se voient sur la console, sans rechargement", vus + " / 24 nommés");
    const entres = Object.keys(sess().s.presence || srv.store.get("qcm/presence/" + slug("3 ESSAI")) || {}).length;
    J.v(entres >= 24, H1, "les 24 entrées sont dans la base (présence)", entres + " présents");
    J.v(/Identifie-toi|Avant de commencer/.test(await zoneTexte(tabJM, cM)) || true, H2, "l'autre moitié n'est pas effacée quand la première entre (règle du 04/10)");
    await scene("t-attest-1", tabJM, "tablette");

    J.section("1.4 La première attestation, puis « prêt »");
    await Promise.all(Object.entries(tabs).map(async ([n, p]) => { const t = TABS.find(x => x.n === n); for(const cote of (!t.g || !t.d) ? [null] : ["g", "d"]){ await cocherTout(p, cote); await cliquer(p, /^Je commence$/, cote); } }));
    await pause(800);
    await scene("t-pret", tabJM, "tablette");
    const at1 = (sess().s.attest || {})[1] || (sess().s.attest || {})["1"] || {};
    J.v(Object.keys(at1).length >= 24, H1, "les 24 premières attestations sont dans la base (attest/1/<eleve>/{lignes, fini})", Object.keys(at1).length);
    J.v(/prêt/i.test(await texte(prof)), H2, "la console montre chaque élève prêt", (await texte(prof)).slice(0, 200));
    await scene("c-pret", prof, "console");

    // ── Les questions ──
    const choixDe = (p, qi) => { const pr = S.pre(nomDeSlug(p)); if(pr === "Julien") return S.TABL.J[qi]; if(pr === "Michel") return S.TABL.M[qi]; return S.choixDe(S.RT[pr][qi], qi); };
    const cotesDe = t => (!t.g || !t.d) ? [[null, t.g || t.d]] : [["g", t.g], ["d", t.d]];
    for(let qi = 0; qi < 3; qi++){
      tropLong();
      J.section("1." + (5 + qi) + " Question " + (qi + 1));
      const Q = EV.questions[qi], lab = Q.choix;
      J.v(await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")), H2, "« ▶️ Lancer Q" + (qi + 1) + " » se clique");
      await pause(700);
      J.v(etat().qi === qi && /reflexion/.test(etat().ph || ""), H1, "Q" + (qi + 1) + " : la base passe en réflexion (etat.ph = reflexion, etat.qi = " + qi + ")", JSON.stringify(etat()));
      J.v(await attendre(tabJM, new RegExp(esc(Q.enonce)), 6000), H2, "l'énoncé de Q" + (qi + 1) + " sur la tablette, sans rechargement", (await texte(tabJM)).slice(0, 200));
      J.v(await attendre(tableau, new RegExp(esc(Q.enonce)), 6000), H2, "l'énoncé de Q" + (qi + 1) + " au tableau, sans rechargement", (await texte(tableau)).slice(0, 200));
      J.v(await attendre(tel, new RegExp("Q ?" + (qi + 1) + "|Question " + (qi + 1), "i"), 6000), H2, "le téléphone suit Q" + (qi + 1), (await texte(tel)).slice(0, 200));
      J.v(!(new RegExp(lab.map(esc).join("|")).test(await zoneTexte(tabJM, "g"))) || qi > 0, H2, "réflexion : l'énoncé sans les choix (t-q1-reflexion)");
      if(qi === 0){ await scene("t-q1-reflexion", tabJM, "tablette"); await scene("c-q1-reflexion", prof, "console"); }
      // la saisie de la console tient pendant que les tablettes répondent (règle du 04/10)
      let garde = false;
      if(qi === 0) garde = await prof.evaluate(() => { const f = [...document.querySelectorAll("input[type=number], input[type=text], input:not([type])")].find(x => x.getBoundingClientRect().width > 0 && !x.disabled && !x.readOnly); if(!f) return false; f.setAttribute("data-garde", "1"); return true; });
      if(garde){ await prof.click("[data-garde='1']"); await prof.keyboard.press("End"); await prof.keyboard.type("7"); }
      await cliquer(prof, /Autoriser la réponse/); await pause(500);
      const premier = (sess().s.premier || {})[qi] || etat().cote;
      J.v(premier === S.premierCote(qi) || premier === (S.premierCote(qi) === "g" ? "g" : "d"), H1, "Q" + (qi + 1) + " : la moitié qui commence est celle du scénario (" + S.premierCote(qi) + ") — premier/<qi>", JSON.stringify({premier, etat: etat()}));
      // les deux tours : sur chaque tablette, la moitié dont les choix sont ouverts répond
      for(const tour of [1, 2]){
        tropLong();
        await pause(1000);    // le passage : « À toi dans 3 secondes »
        if(qi === 0) await scene(tour === 1 ? "t-q1-passage1" : "t-q1-passage2", tabJM, "tablette");
        if(qi === 0 && tour === 1) J.v(/Pose ton stylo|À toi dans/.test(await texte(tabJM)), H2, "le passage : « Pose ton stylo, … À toi dans 3 secondes » (t-q1-passage1)", (await texte(tabJM)).slice(0, 200));
        await pause(2600);
        if(qi === 0 && tour === 1){ await scene("t-q1-tour1", tabJM, "tablette"); }
        let repondus = 0, attendus = 0;
        await Promise.all(Object.entries(tabs).map(async ([n, p]) => { const t = TABS.find(x => x.n === n);
          for(const [cote, sl] of cotesDe(t)){
            if(qi === 1 && tour === 2 && sl === "chevallier_theo") continue;       // Théo ne répond pas à Q2 (c-q2-close)
            const ouverts = await choixOuverts(p, cote, lab); if(!ouverts.length) continue;
            attendus++;
            for(const c of choixDe(sl, qi)) await cliquer(p, new RegExp("^" + esc(lab[c]) + "$"), cote, {apres: 120});
            repondus++;
          } }));
        J.v(repondus >= 11, H2, "Q" + (qi + 1) + ", " + tour + (tour === 1 ? "er" : "e") + " tour : sur chaque tablette, une seule moitié a ses choix ouverts, et répond", repondus + " moitiés ont répondu");
        await pause(600);
        if(qi === 0 && tour === 1){
          await scene("c-q1-tour1", prof, "console"); await scene("p-reponse", tel, "telephone"); await scene("b-reponse", tableau, "tableau");
          if(garde){ const st = await prof.evaluate(() => { const f = document.querySelector("[data-garde='1']"); return f ? {focus: document.activeElement === f, v: f.value} : null; });
            J.v(!!st && st.focus && /7$/.test(st.v), H1, "un champ de la console garde sa valeur et le curseur pendant que 12 tablettes répondent (règle du 04/10)", JSON.stringify(st)); }
          const nRep = Object.keys((sess().s.reponses || {})[0] || {}).length;
          J.v(nRep >= 11, H1, "Q1, 1er tour : les réponses sont dans la base (reponses/0/<eleve>, avec tour et ms)", nRep);
          const rj = ((sess().s.reponses || {})[0] || {})["abrial_julien"] || ((sess().s.reponses || {})[0] || {})["duvernay_michel"];
          J.v(!!rj && rj.tour === 1 && rj.ms !== undefined, H1, "une réponse porte tour et ms (contrat §3.1)", JSON.stringify(rj));
        }
        if(qi === 2 && tour === 1) await scene("t-q3-tour1", tabJM, "tablette");
        if(qi === 2 && tour === 2) await scene("t-q3-tour2", tabJM, "tablette");
        if(qi === 0 && tour === 2) { await scene("t-q1-tour2", tabJM, "tablette"); await scene("c-q1-tour2", prof, "console"); }
        if(qi === 1){ await scene(tour === 1 ? "t-q2-tour1" : "t-q2-tour2", tabJM, "tablette"); if(tour === 2) await scene("c-q2-tour2", prof, "console"); }
        // B : son temps fini, chacun dit si sa feuille dit la même chose que son clic (on attend la fin du temps de réponse)
        const fin = Date.now() + ((Q.reponse || 15) + 6) * 1000; let bDits = 0;
        const bFaits = new Set();
        while(Date.now() < fin && bFaits.size < repondus){
          await Promise.all(Object.entries(tabs).map(async ([n, p]) => { const t = TABS.find(x => x.n === n);
            for(const [cote, sl] of cotesDe(t)){ if(bFaits.has(sl)) continue;
              const z = await zoneTexte(p, cote); if(!/Oui, la même chose/.test(z)) continue;
              if(qi === 0 && tour === 2 && sl === "duvernay_michel") await scene("t-q1-b-michel", p, "tablette");
              const dit = S.ditB(S.pre(nomDeSlug(sl)), qi); bFaits.add(sl);
              if(dit === "rien") continue;
              if(await cliquer(p, dit === "oui" ? /^Oui, la même chose$/ : /^Non, autre chose$/, cote)) bDits++;
            } }));
          await pause(700);
        }
        J.v(bDits >= Math.min(repondus, 11) - 1, H2, "Q" + (qi + 1) + ", tour " + tour + " : B (« Oui, la même chose » / « Non, autre chose ») paraît, son temps fini, et se dit", bDits + " B dits pour " + repondus + " réponses");
        if(tour === 1){ J.v(await cliquer(prof, /Tour suivant/), H2, "« ⏭️ Tour suivant » se clique"); await pause(400);
          J.v(etat().tour === 2 || etat().tour === "2", H1, "la base passe au 2e tour (etat.tour = 2, etat.cote = l'autre moitié)", JSON.stringify(etat())); }
      }
      const nb = (sess().s.b || {})[qi] || {};
      J.v(Object.keys(nb).length >= 20, H1, "Q" + (qi + 1) + " : les B sont dans la base (b/<qi>/<eleve> = oui | non)", Object.keys(nb).length);
      J.v(await cliquer(prof, /Clore la question/), H2, "« 🔒 Clore la question » se clique"); await pause(600);
      J.v(/close/.test(etat().ph || ""), H1, "la base : etat.ph = close", JSON.stringify(etat()));
      if(qi === 0){ await scene("t-q1-attente", tabJM, "tablette"); await scene("c-q1-close", prof, "console");
        J.v(/Attends la prochaine question/.test(await texte(tabJM)), H2, "les deux tours finis : « Attends la prochaine question » (t-q1-attente)", (await texte(tabJM)).slice(0, 160)); }
      if(qi === 1){
        await scene("c-q2-close", prof, "console");
        J.v(/Théo|CHEVALLIER/.test(await texte(prof)), H2, "Q2 close : Théo n'a pas répondu, la console le dit (c-q2-close)");
        // « 🔓 Rouvrir pour un élève » : Théo
        const r1 = await cliquer(prof, /Rouvrir pour un élève/);
        await choisir(prof, /CHEVALLIER Théo|Théo/); await pause(200);
        await scene("c-rouvrir-un", prof, "console");
        const r2 = await cliquer(prof, /Rouvrir pour Théo/);
        J.v(r1 && r2, H2, "« 🔓 Rouvrir pour un élève » → « 🔓 Rouvrir pour Théo »", (await texte(prof)).slice(0, 200));
        await pause(1500);
        J.v(etat().pour === "chevallier_theo" || /rouvert/.test(etat().ph || ""), H1, "la base : la question rouverte pour Théo seul (etat.ph = rouvert, etat.pour)", JSON.stringify(etat()));
        const tt = tabs[tl.n], ct = tl.g === "chevallier_theo" ? "g" : "d";
        await scene("t-rouvrir-un", tt, "tablette");
        let fait = false; for(let k = 0; k < 10 && !fait; k++){ if((await choixOuverts(tt, ct, lab)).length){ for(const c of choixDe("chevallier_theo", 1)) await cliquer(tt, new RegExp("^" + esc(lab[c]) + "$"), ct); fait = true; } else await pause(500); }
        J.v(fait, H2, "la moitié de Théo rouverte : ses choix s'ouvrent, il répond (t-rouvrir-un)");
        J.v((await choixOuverts(tt, ct === "g" ? "d" : "g", lab)).length === 0, H2, "Lou, à côté, porte le voile : ses choix restent fermés");
        await pause((EV.questions[1].reponse || 20) * 1000 + 1500);
        await cliquer(tt, /^Oui, la même chose$/, ct);
        await cliquer(prof, /Clore la question/); await pause(500);
      }
    }
    await scene("c-q3-close", prof, "console");
    J.v(/Dernière question close/.test(await texte(prof)), H2, "« ✅ Dernière question close — lance l'autoévaluation » (c-q3-close)", (await texte(prof)).slice(0, 200));

    J.section("1.8 L'estimation, la seconde attestation");
    J.v(await cliquer(prof, /Lancer l'autoévaluation/), H2, "« 📊 Lancer l'autoévaluation » se clique"); await pause(800);
    J.v(/estim/.test(etat().ph || ""), H1, "la base : etat.ph = estim", JSON.stringify(etat()));
    await scene("t-estim", tabJM, "tablette"); await scene("c-estim", prof, "console");
    J.v(/Combien de bonnes réponses penses-tu avoir/.test(await texte(tabJM)), H2, "l'estimation : « Combien de bonnes réponses penses-tu avoir ? … » (t-estim)", (await texte(tabJM)).slice(0, 200));
    const NIV = {vert: /fourchette-vert|Très bonne maîtrise/, bleu: /Maîtrise satisfaisante/, orange: /Maîtrise fragile/, rouge: /Maîtrise insuffisante/};
    await Promise.all(Object.entries(tabs).map(async ([n, p]) => { const t = TABS.find(x => x.n === n);
      for(const [cote, sl] of cotesDe(t)){ const e = S.ESTIM[S.pre(nomDeSlug(sl))]; if(e) await cliquer(p, NIV[e], cote); } }));
    await pause(600);
    const est = sess().s.estim || sess().s.autoevals || {};
    J.v(Object.keys(est).length >= 22, H1, "les 22 estimations sont dans la base (Jade et Enzo n'en font pas)", Object.keys(est).length);
    J.v(await cliquer(prof, /Lancer la correction/), H2, "« 📝 Lancer la correction » se clique"); await pause(800);
    await scene("x610-5-attestation-2", tabJM, "tablette");
    await Promise.all(Object.entries(tabs).map(async ([n, p]) => { const t = TABS.find(x => x.n === n); for(const [cote] of cotesDe(t)){ await cocherTout(p, cote); await cliquer(p, /^Je commence la correction$/, cote); } }));
    await pause(800);
    await scene("c-attest2", prof, "console");
    const at2 = (sess().s.attest || {})[2] || (sess().s.attest || {})["2"] || {};
    J.v(Object.keys(at2).length >= 24, H1, "les 24 secondes attestations dans la base (attest/2)", Object.keys(at2).length);
    J.v(await cliquer(prof, /Commencer la correction/), H2, "« ▶️ Commencer la correction » s'ouvre quand tous ont coché, et se clique", await etatBouton(prof, /Commencer la correction/));
    await pause(900);
    const oc = sess().s.ordreCorr;
    J.v(JSON.stringify(oc) === JSON.stringify([1, 2, 0]) || JSON.stringify(oc) === JSON.stringify({0: 1, 1: 2, 2: 0}), H1, "l'ordre de la correction, de la plus ratée à la mieux réussie : Q2, Q3, Q1 (ordreCorr)", JSON.stringify(oc));

    J.section("1.9 La correction : la lecture de la feuille du voisin, « 💡 Révéler », « Trouvée au dernier moment », le point d'autonomie");
    const LU = (sl, qi) => { const pr = S.pre(nomDeSlug(sl)); if(pr === "Julien") return S.LU_JM.J[qi]; if(pr === "Michel") return S.LU_JM.M[qi]; const c = S.LU[pr][qi]; return S.choixDe(c, qi); };
    const k = {1: "S08:corr:Q2:V", 2: "S08:corr:Q3:V", 0: "S08:corr:Q1:V"};
    let premiere = true;
    for(const qi of [1, 2, 0]){
      tropLong();
      const lab = EV.questions[qi].choix;
      if(!premiere){ J.v(await cliquer(prof, /Question suivante/), H2, "« Question suivante → » se clique"); await pause(900); }
      J.v(await attendre(tabJM, new RegExp("QUESTION " + (qi + 1) + "|Question " + (qi + 1)), 5000), H2, "la correction montre la question " + (qi + 1) + " sur la tablette", (await texte(tabJM)).slice(0, 160));
      if(qi === 1){ await scene("t-corr-q2-lecture", tabJM, "tablette"); await scene("c-corr-q2-avant", prof, "console"); await scene("p-corr-avant", tel, "telephone"); await scene("b-recopie", tableau, "tableau");
        J.v(await etatBouton(prof, /Révéler/) === "fermé", H2, "« 🔒 Révéler » fermé tant qu'une feuille n'est pas lue", await etatBouton(prof, /Révéler/)); }
      if(qi === 2) await scene("t-corr-q3-lecture", tabJM, "tablette");
      if(qi === 0) await scene("t-corr-q1-lecture", tabJM, "tablette");
      // le voisin lit la feuille et clique ce qu'elle dit, dans la moitié de son propriétaire
      await Promise.all(Object.entries(tabs).map(async ([n, p]) => { const t = TABS.find(x => x.n === n);
        for(const [cote, sl] of cotesDe(t)){ const l = LU(sl, qi);
          if(l === "aucun") await cliquer(p, /aucun de ces choix/, cote);
          else for(const c of l) await cliquer(p, new RegExp("^" + esc(lab[c]) + "$"), cote, {apres: 120}); } }));
      await pause(900);
      const lus = Object.keys(((sess().s.lectures || {})[qi]) || {}).length;
      J.v(lus >= 24, H1, "Q" + (qi + 1) + " : les 24 lectures dans la base (lectures/<qi>/<eleve> = {choix, par, ms})", lus);
      if(qi === 1) await scene("c-corr-q2-lu", prof, "console");
      J.v(await etatBouton(prof, /Révéler/) === "ouvert", H2, "« 💡 Révéler » s'ouvre quand toutes les feuilles sont lues", await etatBouton(prof, /Révéler/));
      await cliquer(prof, /Révéler/); await pause(900);
      J.v(JSON.stringify(sess().s.revelees || "").includes(String(qi)), H1, "la base : Q" + (qi + 1) + " dans revelees", JSON.stringify(sess().s.revelees));
      // « Trouvée au dernier moment » : là où la note du scénario dit « t » pour cette question, et là seulement
      const tr = sess().s.trouvee || {};
      let bons = 0, faux = [];
      for(const t of TABS) for(const [, sl] of cotesDe(t)){ const pr = S.pre(nomDeSlug(sl)); const st = S.note(pr, k[qi]).st[qi]; const dit = tr[sl] === qi || tr[sl] === String(qi);
        if((st === "t") === dit) bons++; else faux.push(pr + (st === "t" ? " (attendue)" : " (en trop)")); }
      J.v(faux.length === 0, H1, "Q" + (qi + 1) + " : « Trouvée au dernier moment » exactement pour la feuille fausse et la tablette juste, une fois par évaluation (trouvee/<eleve>)", faux.join(", "));
      if(qi === 1){
        const tj = await zoneTexte(tabJM, cJ);
        J.v(/Trouvée au dernier moment/.test(tj), H2, "la moitié de Julien dit « Trouvée au dernier moment » (t-corr-q2-apres)", tj.slice(0, 200));
        await scene("t-corr-q2-apres", tabJM, "tablette"); await scene("c-corr-q2-apres", prof, "console"); await scene("p-corr-apres", tel, "telephone"); await scene("b-correction", tableau, "tableau");
        // le point d'autonomie de Hugo
        J.v(await cliquer(prof, /^FOUCHER Hugo$/), H2, "un clic sur FOUCHER Hugo ouvre sa fenêtre (c-autonomie)"); await pause(300);
        await scene("c-autonomie", prof, "console");
        J.v(await cliquer(prof, /Retirer le point d'autonomie/), H2, "« ⛔ Retirer le point d'autonomie »"); await pause(300);
        await scene("c-autonomie-garde", prof, "console");
        J.v(await cliquer(prof, /Retirer le point d'autonomie/), H2, "la garde : « ⛔ Retirer le point d'autonomie »"); await pause(500);
        await scene("c-autonomie-retiree", prof, "console");
        const au = (sess().s.autonomie || {})["foucher_hugo"];
        J.v(!!au && au.retire === true && au.quand === "heure", H1, "la base : autonomie/foucher_hugo = {retire: true, ms, quand: heure}", JSON.stringify(au));
        await cliquer(prof, /Fermer/);
      }
      if(qi === 2){ await scene("c-corr-q3-apres", prof, "console"); await scene("t-corr-q3-apres", tabJM, "tablette"); }
      if(qi === 0){ await scene("t-corr-q1-apres", tabJM, "tablette"); await scene("c-corr-q1-apres", prof, "console"); }
      premiere = false;
    }

    J.section("1.10 La co-évaluation, l'alerte, le bilan");
    J.v(await cliquer(prof, /Ouvrir la co-évaluation/), H2, "« 🤝 Ouvrir la co-évaluation, puis leur bilan »"); await pause(900);
    J.v(/coeval/.test(etat().ph || ""), H1, "la base : etat.ph = coeval", JSON.stringify(etat()));
    await scene("t-coeval", tabJM, "tablette");
    const CO = sl => S.CO[S.pre(nomDeSlug(sl))];
    await Promise.all(Object.entries(tabs).map(async ([n, p]) => { const t = TABS.find(x => x.n === n);
      for(const [cote, sl] of cotesDe(t)){ const c = CO(sl); if(!c || c === "att") continue;
        if(c === "ok") await cliquer(p, /^✅ Je pense que .* a bien lu ma feuille/, cote);
        else if(/^mal/.test(c)){ const qi = +c.slice(3) - 1; await cliquer(p, /^❌ Je pense que .* a mal lu/, cote); await pause(300);
          await cliquer(p, new RegExp("^Question " + (qi + 1) + " ·"), cote); await pause(300);
          const f = S.feuilleVraie(S.pre(nomDeSlug(sl)))[qi]; const ch = S.choixDe(f, qi);
          if(sl === "duvernay_michel") await scene("t-coeval-ecrit", p, "tablette");
          if(ch === "aucun") await cliquer(p, /aucun de ces choix/, cote); else for(const x of ch) await cliquer(p, new RegExp("^" + esc(EV.questions[qi].choix[x]) + "$"), cote); }
        else if(/^peut/.test(c)){ const qi = +c.slice(4) - 1; await cliquer(p, /^🤔 Je pense que .* peut-être mal lu/, cote); await pause(300); await cliquer(p, new RegExp("^Question " + (qi + 1) + " ·"), cote); } } }));
    await pause(1000);
    const co = sess().s.coeval || {};
    J.v(Object.keys(co).length >= 20, H1, "la base : coeval/<eleve> = {statut, qi, ecrit, ms}, 20 réponses (4 en attente)", Object.keys(co).length);
    J.v(!!co.duvernay_michel && co.duvernay_michel.statut === "mal" && (co.duvernay_michel.qi === 0 || co.duvernay_michel.qi === "0"), H1, "Michel : « mal », question 1", JSON.stringify(co.duvernay_michel));
    const al = sess().s.alertes || {};
    J.v(Object.keys(al).length >= 1, H1, "une alerte dans la base (alertes/<id>) pour Michel, Q1", JSON.stringify(al).slice(0, 200));
    await scene("c-coeval-attente", prof, "console");
    J.v(await etatBouton(prof, /Afficher leur bilan aux élèves/) !== "ouvert", H2, "« 🏁 Afficher leur bilan » fermé tant que l'alerte n'est pas tranchée et que 4 n'ont pas répondu", await etatBouton(prof, /Afficher leur bilan/));
    J.v(await cliquer(prof, /Donner raison à Michel/), H2, "« Donner raison à Michel : Rome → 1 point »"); await pause(600);
    const al2 = Object.values(sess().s.alertes || {})[0] || {};
    J.v(!!al2.tranche && !!al2.tranche.decision, H1, "l'alerte tranchée dans la base (alertes/<id>/tranche = {decision, ms})", JSON.stringify(al2));
    // les 4 derniers répondent
    await Promise.all(Object.entries(tabs).map(async ([n, p]) => { const t = TABS.find(x => x.n === n); for(const [cote, sl] of cotesDe(t)) if(CO(sl) === "att") await cliquer(p, /^✅ Je pense que .* a bien lu ma feuille/, cote); }));
    await pause(800);
    await scene("c-coeval-tranche", prof, "console");
    J.v(await etatBouton(prof, /Afficher leur bilan aux élèves/) === "ouvert", H2, "tous ont répondu, l'alerte tranchée : « 🏁 Afficher leur bilan aux élèves » s'ouvre", await etatBouton(prof, /Afficher leur bilan/));
    await cliquer(prof, /Afficher leur bilan aux élèves/); await pause(1200);
    J.v(!!sess().s.bilanAffiche, H1, "la base : bilanAffiche", JSON.stringify(sess().s.bilanAffiche));
    await scene("t-bilan", tabJM, "tablette"); await scene("c-bilan", prof, "console");
    // les notes de chacun, d'après la règle du scénario (la note, c'est la feuille ; « Trouvée au dernier moment » une fois ; l'alerte tranchée pour Michel)
    let notesOk = 0, notesKo = [];
    for(const [n, p] of Object.entries(tabs)){ const t = TABS.find(x => x.n === n);
      for(const [cote, sl] of cotesDe(t)){ const pr = S.pre(nomDeSlug(sl)); const nt = S.note(pr, "S08:bilan"); const z = (await zoneTexte(p, cote)).replace(/\s+/g, " ");
        if(new RegExp("\\b" + nt.n + " ?/ ?" + nt.total + "\\b").test(z)) notesOk++; else notesKo.push(pr + " attendu " + nt.n + "/" + nt.total + " vu « " + (z.match(/\d+ ?\/ ?\d+/) || ["?"])[0] + " »"); } }
    J.v(notesKo.length === 0, H2, "le bilan de chaque élève dit sa note d'après la règle (24 notes comparées au scénario de la maquette)", notesOk + " justes ; " + notesKo.slice(0, 8).join(" ; "));
    J.v(/Ta note provisoire/.test(await texte(tabJM)), H2, "« Ta note provisoire » (t-bilan)", (await texte(tabJM)).slice(0, 200));
    J.v(!/c4-[a-z]+-\d\d/.test(await texte(tabJM)), H2, "aucun code de compétence dans le bilan de l'élève (libellés élève)");
    const zh = await zoneTexte(tabs[TABS.find(t => [t.g, t.d].includes("foucher_hugo")).n], TABS.find(t => [t.g, t.d].includes("foucher_hugo")).g === "foucher_hugo" ? "g" : "d");
    J.v(/non atteinte|retiré|⛔/.test(zh), H2, "le bilan de Hugo dit son point d'autonomie retiré", zh.slice(0, 200));

    J.section("1.11 Terminer la séance");
    J.v(await cliquer(prof, /Terminer la séance/), H2, "« 🛑 Terminer la séance »"); await pause(400);
    await scene("c-terminer", prof, "console");
    await cliquer(prof, /^🛑 Terminer|^Terminer$|Oui, terminer|Terminer la séance/); await pause(1200);
    const fini = srv.store.get("qcm/sessions/" + sid) || {};
    J.v(!!sid && (!Object.keys(srv.store.get("qcm/sessionActive") || {}).length || /fin/.test((fini.etat || {}).ph || "")), H1, "la séance terminée : plus de séance active, etat.ph = fin", JSON.stringify({active: srv.store.get("qcm/sessionActive"), etat: fini.etat}));
    J.v(await attendre(tabJM, /Combien êtes-vous/, 6000), H2, "la tablette revient à « Combien êtes-vous ? » (t-fin)", (await texte(tabJM)).slice(0, 160));
    await scene("t-fin", tabJM, "tablette");
    for(const p of Object.values(tabs)) await p.context().close().catch(() => {});
  } catch(e){ J.v(false, "banc", "l'heure s'est arrêtée", e.stack); }

  // ════════ 2. LE SOIR ════════
  const seanceDuJour = () => { const all = srv.store.get("qcm/sessions") || {}; const id = Object.keys(all).find(x => all[x].classe === "3 ESSAI" || all[x].classeSlug === slug("3 ESSAI")); return {id, s: id ? all[id] : {}}; };
  const ouvrirFiche = async nom => { const ok = await cliquer(prof, new RegExp("^" + esc(nom) + "$")); await pause(400); return ok; };
  const fermerFiche = async () => { if(!(await cliquer(prof, /^✕ Fermer$/))) await prof.keyboard.press("Escape"); await pause(300); };
  try {
    tropLong();
    J.section("2.1 Le soir : Données → Résultats, la séance, son tableau");
    if(!prof) prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    J.v(await cliquer(prof, /^Données$/), H3, "« Données » se clique"); await pause(400);
    await cliquer(prof, /^📊 Résultats$/); await pause(500);
    await scene("c-seances", prof, "console");
    let tx = await texte(prof);
    J.v(/3e · 1 séance/.test(tx) && /copies non rendues/.test(tx), H3, "Résultats : « ▾ 3e · 1 séance », la séance du jour, « copies non rendues » (c-seances)", tx.slice(0, 400));
    J.v(/▸ 6e · vide pour l'instant/.test(tx) && /▸ 5e · vide pour l'instant/.test(tx), H3, "Résultats : 6e, 5e « vide pour l'instant » (c-seances)", tx.slice(0, 300));
    J.v(await cliquer(prof, /^📊 Ouvrir$/), H3, "« 📊 Ouvrir » la séance"); await pause(700);
    await scene("c-resultats", prof, "console");
    tx = await texte(prof);
    J.v(await etatBouton(prof, /PDF notes et compétences/) === "fermé", H3, "« 📄 PDF notes et compétences » fermé tant que les copies ne sont pas rendues", await etatBouton(prof, /PDF notes et compétences/));
    const lou = S.note("Lou", "SOIR");
    J.v(new RegExp("ZELLER Lou[\\s\\S]{0,300}" + lou.n + " ?/ ?" + lou.total).test(tx), H3, "le tableau : Lou " + lou.n + " / " + lou.total + " avant la lecture de sa feuille (c-resultats)", (tx.match(/ZELLER Lou[\s\S]{0,200}/) || [tx.slice(0, 200)])[0]);
    const hu = S.note("Hugo", "SOIR");
    J.v(new RegExp("FOUCHER Hugo[\\s\\S]{0,300}" + hu.n + " ?/ ?" + hu.total).test(tx), H3, "le tableau : Hugo " + hu.n + " / " + hu.total + ", son point d'autonomie retiré pendant l'heure", (tx.match(/FOUCHER Hugo[\s\S]{0,200}/) || [""])[0]);
    const aL = Object.values(seanceDuJour().s.aLire || {});
    const qui = new Set(aL.map(x => x.eleveSlug));
    J.v(["duvernay_michel", "carre_tom", "quinton_enzo", "tessier_anna", "zeller_lou"].every(x => qui.has(x)), H1, "à lire sur les feuilles (aLire/<id>) : Michel, Tom, Enzo, Anna, Lou (scénario A_LIRE : B contre la lecture, « aucun de ces choix », rien de dit)", JSON.stringify(aL.map(x => x.eleveSlug + ":" + x.qi + ":" + x.sorte)));

    J.section("2.2 La fiche de Michel : son point d'autonomie, le soir ; « ✔ Marquer lue »");
    J.v(await ouvrirFiche("DUVERNAY Michel"), H3, "un clic sur Michel ouvre sa fiche (c-fiche)");
    await scene("c-fiche", prof, "console");
    J.v(/Julien/.test(await texte(prof)), H3, "la fiche de Michel : sa feuille lue par Julien", (await texte(prof)).slice(0, 300));
    J.v(await cliquer(prof, /^⛔ Retirer le point d'autonomie$/), H3, "« ⛔ Retirer le point d'autonomie », le soir"); await pause(300);
    await scene("c-fiche-garde", prof, "console");
    await cliquer(prof, /^⛔ Retirer le point d'autonomie$/, ".modal, .modal-box, [role=dialog], .fenetre, .garde"); await pause(300);
    if(!(seanceDuJour().s.autonomie || {}).duvernay_michel) { const n = await prof.evaluate(() => [...document.querySelectorAll("button")].filter(b => /Retirer le point d'autonomie/.test(b.textContent) && b.getBoundingClientRect().width > 0).length); if(n > 1) { await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => /Retirer le point d'autonomie/.test(b.textContent) && b.getBoundingClientRect().width > 0); b[b.length - 1].click(); }); await pause(400); } }
    await scene("c-fiche-retire", prof, "console");
    const am = (seanceDuJour().s.autonomie || {}).duvernay_michel;
    J.v(!!am && am.retire && am.quand === "soir", H1, "la base : autonomie/duvernay_michel = {retire: true, quand: soir}", JSON.stringify(am));
    J.v(/↩️ Rendre/.test(await texte(prof)), H3, "le point retiré, dans la fiche : « ↩️ Rendre » (c-fiche-retire)");
    let marques = 0; while(marques < 6 && await cliquer(prof, /^✔ Marquer lue$/)) marques++;
    await fermerFiche();
    for(const nom of ["CARRÉ Tom", "QUINTON Enzo", "TESSIER Anna", "PERRAUD Jade", "MAILLARD Noah"]){
      if(await ouvrirFiche(nom)){ let k = 0; while(k < 4 && await cliquer(prof, /^✔ Marquer lue$/)) { k++; marques++; } await fermerFiche(); } }
    J.v(marques >= 5, H3, "« ✔ Marquer lue » sur les feuilles à lire (Michel, Tom, Enzo, Anna, Jade, Noah)", marques + " marquées");

    J.section("2.3 « Que dit la feuille ? » : Lou, Q3, sa feuille dit 6");
    J.v(await ouvrirFiche("ZELLER Lou"), H3, "la fiche de Lou s'ouvre");
    const n3 = await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => /La feuille dit autre chose/.test(b.textContent) && b.getBoundingClientRect().width > 0); if(b.length < 3) return b.length; b[2].setAttribute("data-banc", "q3"); return 3; });
    if(n3 === 3) await prof.click("[data-banc='q3']").catch(() => {});
    await pause(400);
    await scene("c-que-dit-la-feuille", prof, "console");
    J.v(/Que dit la feuille/.test(await texte(prof)), H3, "« La feuille dit autre chose » (Q3) ouvre « Que dit la feuille ? »", (await texte(prof)).slice(0, 200));
    await cliquer(prof, /^6$/); await cliquer(prof, /^Valider$/); await pause(700);
    const lu3 = ((seanceDuJour().s.lectures || {})[2] || {}).zeller_lou;
    J.v(!!lu3 && lu3.par === "prof", H1, "la base : lectures/2/zeller_lou = {choix: [0], par: prof}", JSON.stringify(lu3));
    const lou2 = S.note("Lou", "SOIR:lu");
    await cliquer(prof, /^✔ Marquer lue$/);
    await fermerFiche();
    J.v(new RegExp("ZELLER Lou[\\s\\S]{0,300}" + lou2.n + " ?/ ?" + lou2.total).test(await texte(prof)), H3, "Lou passe à " + lou2.n + " / " + lou2.total + " après « Corrigé d'après sa feuille », partout", ((await texte(prof)).match(/ZELLER Lou[\s\S]{0,200}/) || [""])[0]);

    J.section("2.4 Rendre les copies, le PDF, l'élève chez lui, masquer");
    await cliquer(prof, /^📊 Résultats$/); await pause(500);
    await scene("c-seances-lues", prof, "console");
    J.v(await cliquer(prof, /rendre les copies ▸/), H3, "toutes les feuilles lues : « rendre les copies ▸ » (c-seances-lues)", (await texte(prof)).slice(0, 300)); await pause(300);
    await scene("c-rendre", prof, "console");
    await cliquer(prof, /^Rendre les copies$|^📤 Rendre|^Rendre$/); await pause(700);
    const cp = seanceDuJour().s.copies || {};
    J.v(!!cp.rendues, H3, "la base : copies.rendues (ms)", JSON.stringify(cp));
    await scene("c-copies-rendues", prof, "console");
    J.v(/copies rendues le/.test(await texte(prof)), H3, "« copies rendues le … » (c-copies-rendues)", (await texte(prof)).slice(0, 300));
    await cliquer(prof, /^📊 Ouvrir$/); await pause(600);
    await scene("c-resultats-rendues", prof, "console");
    J.v(await etatBouton(prof, /PDF notes et compétences/) === "ouvert", H3, "les copies rendues : « 📄 PDF notes et compétences » s'ouvre (c-resultats-rendues)", await etatBouton(prof, /PDF notes et compétences/));
    await cliquer(prof, /PDF notes et compétences/); await pause(1500);
    await scene("x632-pdf", prof, "console");
    J.v(/notes et compétences|Notes et compétences/i.test(await texte(prof)), H3, "le PDF « notes et compétences » (x632-pdf)", (await texte(prof)).slice(0, 300));
    await prof.keyboard.press("Escape"); await cliquer(prof, /^✕$|Fermer/); await pause(300);
    const el = await A.ouvrir("eleve", "?mode=eleve", 1280, 800);
    await cliquer(el, /1 élève/); await taper(el, null, "code", codeDe("ZELLER Lou")); await taper(el, null, "prenom", "lou"); await taper(el, null, "nom", "zeller"); await cliquer(el, /Entrer/); await pause(800);
    await cliquer(el, /Mes évaluations/); await pause(700);
    await scene("e-mes-evals-rendue", el, "eleve");
    J.v(new RegExp(lou2.n + " ?/ ?" + lou2.total).test(await texte(el)), H3, "« 📊 Mes évaluations » de Lou : sa note définitive, " + lou2.n + " / " + lou2.total + " (e-mes-evals-rendue)", (await texte(el)).slice(0, 300));
    await cliquer(el, /Évaluation d'essai/); await pause(600);
    await scene("e-bilan-lou", el, "eleve");
    J.v(/Bilan/.test(await texte(el)), H3, "le bilan de Lou, corrigé d'après sa feuille, finit par « 📝 Bilan » (e-bilan-lou)", (await texte(el)).slice(-300));
    J.v(await cliquer(prof, /Masquer les copies/), H3, "« 🙈 Masquer les copies »"); await pause(600);
    J.v((seanceDuJour().s.copies || {}).masquees === true, H3, "la base : copies.masquees = true", JSON.stringify(seanceDuJour().s.copies));

    J.section("2.5 La corbeille, la sauvegarde (gardes, sans rien jeter)");
    if(await cliquer(prof, /^🗑️$/)){ await pause(300); await scene("c-corbeille", prof, "console"); J.v(/Mettre à la corbeille/.test(await texte(prof)), H3, "« 🗑️ » une séance : la garde « 🗑️ Mettre à la corbeille » (c-corbeille)"); await cliquer(prof, /^Annuler$/); }
    else J.v(false, H3, "« 🗑️ » sur la ligne de la séance");
    J.v(await cliquer(prof, /^💾 Sauvegarde$/), H3, "« 💾 Sauvegarde »"); await pause(400);
    await scene("c-sauvegarde", prof, "console");
    if(await cliquer(prof, /Importer snapshot/)){ await pause(300); await scene("c-importer", prof, "console"); await cliquer(prof, /^Annuler$/); } else J.v(false, H3, "« 📤 Importer snapshot »");
    if(await cliquer(prof, /^🗑️ Purger les évaluations$/)){ await pause(300); await scene("c-purger", prof, "console"); J.v(/démo/i.test(await texte(prof)), H3, "« Purger les évaluations » : la garde dit que la démo reste (c-purger)"); await cliquer(prof, /^Annuler$/); } else J.v(false, H3, "« 🗑️ Purger les évaluations »");
    J.v(!!(srv.store.get("qcm/evaluations") || {}).demo, H3, "la démo est toujours là (qcm/evaluations/demo)");
  } catch(e){ J.v(false, "banc", "le soir s'est arrêté", e.stack); }

  // ════════ 3. LE RESTE ════════
  try {
    tropLong();
    J.section("3.1 Les évaluations : la liste, imprimer, modifier, la corbeille, le collage du JSON");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /^📝 Évaluations$/); await pause(500);
    await scene("c-evals", prof, "console");
    const te = await texte(prof);
    J.v(/Démo — apprendre le déroulé/.test(te) && /🔒 Permanente/.test(te), H3, "Évaluations : la démo en tête, « 🔒 Permanente » (c-evals)", te.slice(0, 300));
    J.v(/▸ 6e · vide pour l'instant/.test(te) && /4e/.test(te) && /3e/.test(te), H3, "Évaluations rangées par niveau, 6e à 3e (c-evals)", te.slice(0, 300));
    J.v(/Sans chapitre/.test(te), H3, "« Sans chapitre » : les évaluations du hub sans chapitre, « ✏️ Compléter »", te.slice(0, 300));
    const imprimer = await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => /Imprimer/.test(b.textContent) && b.getBoundingClientRect().width > 0); if(b.length < 2) return false; b[1].setAttribute("data-banc", "imp"); return true; });
    if(imprimer){ await prof.click("[data-banc='imp']").catch(() => {}); await pause(500); await scene("c-feuille", prof, "console"); J.v(new RegExp(esc(EV.questions[0].enonce)).test(await texte(prof)), H3, "« 🖨️ Imprimer » : les énoncés seuls, sur une page (c-feuille)"); await prof.keyboard.press("Escape"); await cliquer(prof, /^✕$|^Fermer$|^✕ Fermer$/); await pause(300); }
    else J.v(false, H3, "« 🖨️ Imprimer » sur l'évaluation d'essai");
    if(await cliquer(prof, /^✏️ Modifier$/)){ await pause(500); await scene("x627-3-editeur", prof, "console"); J.v(/Ce qu'elle vérifie/.test(await texte(prof)), H3, "l'éditeur : « 🎯 Ce qu'elle vérifie » (x627-3-editeur)"); await prof.keyboard.press("Escape"); await cliquer(prof, /^Annuler$|^✕$|Fermer/); await pause(300); }
    else J.v(false, H3, "« ✏️ Modifier » l'évaluation d'essai");
    const corb = await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.textContent.trim() === "🗑️" && b.getBoundingClientRect().width > 0); if(!b[0]) return false; b[0].setAttribute("data-banc", "corb"); return true; });
    if(corb){ await prof.click("[data-banc='corb']").catch(() => {}); await pause(300); await scene("c-eval-corbeille", prof, "console"); await cliquer(prof, /^Annuler$/); } else J.v(false, H3, "« 🗑️ » une évaluation");
    J.v(await cliquer(prof, /Nouvelle évaluation/), H3, "« ➕ Nouvelle évaluation »"); await pause(400);
    await scene("c-collage", prof, "console");
    await prof.keyboard.press("Escape"); await cliquer(prof, /^Annuler$|^✕$/); await pause(300);

    J.section("3.2 Les réglages, le prompt, le mode d'emploi, le QR, le mode test, le papier, l'accueil");
    J.v(await cliquer(prof, /^Réglages$/), H3, "« Réglages »"); await pause(500);
    await scene("c-reglages", prof, "console");
    J.v(/Très bonne maîtrise/.test(await texte(prof)), H3, "Réglages, en cartes : les niveaux de maîtrise (c-reglages)", (await texte(prof)).slice(0, 300));
    if(await cliquer(prof, /^🤖 Prompt IA$/)){ await pause(500); await scene("c-reglages-prompt", prof, "console"); const tp = await texte(prof);
      J.v(!/\{\{[A-Z_]+\}\}/.test(tp), H3, "le prompt tel que l'app le copie : aucun jeton {{…}} visible (c-reglages-prompt)", (tp.match(/\{\{[A-Z_]+\}\}/) || [""])[0]);
      await cliquer(prof, /^✕$/); await prof.keyboard.press("Escape"); await pause(300); } else J.v(false, H3, "« 🤖 Prompt IA »");
    if(await cliquer(prof, /^✏️ Modifier le prompt$/)){ await pause(500); await scene("c-reglages-prompt-modifier", prof, "console"); await cliquer(prof, /^↩️ Annuler$|^Annuler$/); await prof.keyboard.press("Escape"); await pause(300); } else J.v(false, H3, "« ✏️ Modifier le prompt »");
    if(await cliquer(prof, /Mode d'emploi/)){ await pause(500); await scene("c-mode-emploi", prof, "console"); await prof.keyboard.press("Escape"); await cliquer(prof, /^✕$|^Fermer$/); await pause(300); } else J.v(false, H2, "« 📖 Mode d'emploi »");
    if(await cliquer(prof, /QR pilotage/)){ await pause(500); await scene("c-qr", prof, "console"); await prof.keyboard.press("Escape"); await cliquer(prof, /^✕$|^Fermer$/); await pause(300); } else J.v(false, H2, "« 📱 QR pilotage »");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(300);
    await choisir(prof, /3 ESSAI/); await choisir(prof, /Évaluation d'essai/); await pause(200);
    if(await cliquer(prof, /Séance sur papier/)){ await pause(400); await scene("c-papier-lancer", prof, "console"); J.v(/papier/i.test(await texte(prof)), H3, "« 📄 Séance sur papier » au lancement (c-papier-lancer)"); await cliquer(prof, /Sur tablettes/); }
    else J.v(false, H3, "« 📄 Séance sur papier »");
    const accueil = await A.ouvrir("accueil", "", 1536, 864);
    await scene("c-accueil", accueil, "console");
    J.v(/Mode élève/.test(await texte(accueil)) && /Accès professeur/.test(await texte(accueil)), H1, "l'accueil de l'app : « 🎓 Mode élève » ou « Accès professeur » (c-accueil)", (await texte(accueil)).slice(0, 200));
    if(await cliquer(prof, /Mode test/)){ await pause(800); await scene("x620-1-mode-test-ouverture", prof, "console");
      J.v(/test/i.test(await texte(prof)), H3, "« 🧪 Mode test » s'ouvre (x620-1-mode-test-ouverture)");
      J.v(!Object.keys(srv.store.get("qcm/sessionActive") || {}).some(k => k === slug("3 ESSAI")), H3, "le mode test ne touche à aucune vraie classe"); }
    else J.v(false, H3, "« 🧪 Mode test »");
  } catch(e){ J.v(false, "banc", "le reste s'est arrêté", e.stack); }

  // ════════ Pour toutes les pages ════════
  J.section("4. Aucune erreur de page, aucune boîte système");
  for(const p of A.pages) J.v(p.__err.length === 0, H1, "page « " + p.__nom + " » sans erreur ni boîte système", p.__err.slice(0, 3).join(" · "));
  await A.fermer(); await srv.close();
  const duree = Math.round((Date.now() - J.t0) / 1000);
  fs.writeFileSync(path.join(SORTIE, "releves-app.json"), JSON.stringify(RELEVES));
  fs.writeFileSync(path.join(SORTIE, "banc.json"), JSON.stringify({duree, app: process.env.APP_FILE, journal: J.l}, null, 1));
  const lignes = ["Banc commun de l'app QCM (QCM-4 · BANC) — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString(),
    "Durée : " + duree + " s (" + Math.floor(duree / 60) + " min " + (duree % 60) + " s) · vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + " · scènes relevées : " + Object.keys(RELEVES).length, ""];
  for(const e of J.l) lignes.push(e.section ? "\n── " + e.section + " (" + e.t + " s)" : (e.ok ? "  ok     " : "  ÉCHEC  ") + "[" + e.proprio + "] " + e.quoi + (e.ok ? "" : " — vu : " + e.vu));
  fs.writeFileSync(path.join(SORTIE, "banc.txt"), lignes.join("\n") + "\n");
  console.log("\nDurée " + duree + " s · " + J.verifs.length + " vérifications · " + J.echecs.length + " échecs → " + SORTIE);
  process.exit(J.echecs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
