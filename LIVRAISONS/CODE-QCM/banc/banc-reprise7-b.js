// QCM-4 · BANC — la reprise 7 (DEFAUTS-OUVERTS, « Reprise 7 du 13/10, complétée le 15/10 »), points 6 et 7, rejoués par le geste en mode test, sur le faux hub.
// Séance A : « 🎲 Tous les élèves répondent » à chaque phase (aux deux tours de chaque question), aucune feuille tapée, jusqu'au soir :
//   point 7 : (a) chaque élève qui a répondu dit B tout seul, sans clic ; (b) « 🎲 » remplit sa feuille du texte de son clic ; (c) « 📌 À lire … ce soir » vide ;
//   point 6 : à chaque phase, la tablette simulée 1, en petit et « 🔍 en grand », dessine ce que dessine « 👁 » (la vraie tablette, TabletteVue) ;
//             la co-évaluation et le bilan joués en grand : un clic fait ce qu'il fait sur la vraie tablette, une seule fois.
// Séance B : la même, mais Paul tape une seule feuille (« 📝 Feuille Élise », Q3) différente de tout clic : « 📌 À lire … ce soir » a une ligne, Élise, Q3.
// La vraie tablette (?mode=eleve) ne peut pas rejoindre la classe de test par le geste (« 🎓 Choisis ta classe » écarte les classes « _ ») : la référence est « 👁 ».
//   APP_FILE=<app> BANC=<faux hub> node banc/banc-reprise7-b.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, esc, texte, zoneTexte, cliquer, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise7-b-" + Date.now()));
const CAP = path.join(SORTIE, "captures-reprise7-b");
fs.mkdirSync(CAP, {recursive: true});
const J = new O.Journal();
const H3 = "QCM-3 · SOIR", BANC = "QCM-4 · BANC";
const CL = "_test_evaluation-qcm", ELISE = "audebert_elise", GATIEN = "augereau_gatien";
const FEUILLE_B = "je ne sais pas trop";   // séance B : la feuille tapée par Paul, qui ne dit aucun des choix
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return "captures-reprise7-b/" + f; };

(async () => {
  const t0 = Date.now();
  const fin = setTimeout(() => { J.v(false, BANC, "plafond de 7 minutes atteint"); ecrire(); process.exit(0); }, 420000);
  const {B, srv, port} = await O.fauxHub();
  const A = new O.Appareils(srv, port); await A.demarrer();
  // le journal des écritures de la séance de test (B, feuilles, co-évaluation), horodatées
  const ecr = [];
  srv.watchers.push(op => { const ch = op.t === "update" ? Object.keys(op.v || {}).map(k => [op.p + "/" + k, op.v[k]]) : [[op.p, op.v]];
    for(const [c, v] of ch) if(/sessions\/[^/]+\/(b|feuillesTest|coeval|reponses|lectures)(\/|$)/.test(c)) ecr.push({t: Date.now(), c: c.replace(/^\/+/, ""), v, ph: (srv.store.get("qcm/sessions/" + (c.match(/sessions\/([^/]+)/) || [])[1] + "/deroule") || {}).ph}); });
  let sid = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a[CL]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) sid = id; return sid ? srv.store.get("qcm/sessions/" + sid) || {} : {}; };
  const etat = () => { const s = sess(); return s.deroule && typeof s.deroule === "object" ? s.deroule : {}; };
  const EVT = () => srv.store.get("qcm/evaluations/" + CL) || {};
  const liste = l => Array.isArray(l) ? l : l && typeof l === "object" ? Object.values(l) : l == null ? [] : [l];
  const choixTxt = (qi, l) => liste(l).map(i => ((EVT().questions || [])[qi] || {choix: []}).choix[i]);
  // une moitié en texte comparable : sans les lignes de décor (emoji seuls), sans les secondes du chrono
  const net = s => (s || "").split("\n").map(l => l.trim()).filter(l => /[\p{L}\p{N}]/u.test(l))
    .map(l => /^\d+$/.test(l) ? "#" : l.replace(/\d+ ?s\b/g, "#s").replace(/⏱️ ?\d+/g, "⏱️#").replace(/\b\d{1,2}:\d{2}\b/g, "#:#")).join(" | ");
  const ecart = (a, b) => { if(a === b) return ""; let i = 0; while(i < a.length && a[i] === b[i]) i++; return "…" + a.slice(Math.max(0, i - 40), i + 120) + " ≠ …" + b.slice(Math.max(0, i - 40), i + 120); };
  let prof;
  const popups = [];
  const de = () => JSON.stringify((({ph, qi, tour, cote}) => ({ph, qi, tour, cote}))(etat()));

  // ── les trois vues de la tablette 1 : « 👁 » (la vraie tablette), la simulée en petit, la simulée en grand ──
  const vueOeil = async () => {
    const ok = await prof.evaluate(() => { const m = [...document.querySelectorAll(".test-prof-zone .tab-mini")].find(x => /📱 Tablette 1\b/.test((x.querySelector(".tab-mini-h") || {}).textContent || ""));
      const b = m && m.querySelector(".tab-oeil"); if(!b) return false; document.querySelectorAll("[data-banc]").forEach(x => x.removeAttribute("data-banc")); b.setAttribute("data-banc", "oeil"); return true; }).catch(() => false);
    if(!ok) return null;
    await prof.click("[data-banc='oeil']", {timeout: 2000}).catch(() => {}); await pause(350);
    const r = {g: await zoneTexte(prof, ".voir-tab .moitie.g"), d: await zoneTexte(prof, ".voir-tab .moitie.d"), tout: await zoneTexte(prof, ".voir-tab")};
    r.cap = await capt(prof, "oeil");
    if(!(await cliquer(prof, /✕ Fermer/, undefined, {apres: 150}))) await prof.keyboard.press("Escape").catch(() => {});
    return r;
  };
  const vuePetit = async () => ({g: await zoneTexte(prof, ".sims [data-sim-tab='1'] .moitie.g"), d: await zoneTexte(prof, ".sims [data-sim-tab='1'] .moitie.d"), tout: await zoneTexte(prof, ".sims [data-sim-tab='1'] .sim")});
  const ouvrirGrand = async () => { const ok = await prof.evaluate(() => { const b = document.querySelector(".sims [data-sim-tab='1'] .simt-grand"); if(!b) return false; b.setAttribute("data-banc", "grand"); return true; }).catch(() => false);
    if(ok){ await prof.click("[data-banc='grand']", {timeout: 2000}).catch(() => {}); await pause(350); } return ok; };
  const fermerGrand = async () => cliquer(prof, /Revenir aux 15 tablettes/, undefined, {apres: 200});
  const vueGrand = async () => { if(!(await ouvrirGrand())) return null; const r = {g: await zoneTexte(prof, ".grand-tab .moitie.g"), d: await zoneTexte(prof, ".grand-tab .moitie.d"), tout: await zoneTexte(prof, ".grand-tab")}; return r; };

  // ── point 6 : à une phase, les trois vues de la tablette 1 ──
  const comparees = new Set(), mesEvals = new Set();
  const comparer = async (lib, cle, opts) => {
    opts = opts || {};
    if(comparees.has(cle)) return;
    for(let essai = 0; essai < 3; essai++){
      const e0 = de();
      const oe = await vueOeil(); const pe = await vuePetit(); const gr = await vueGrand();
      const c = await capt(prof, "s6-" + cle + "-grand"); await fermerGrand();
      const e1 = de();
      if(e0 !== e1){ console.log("   (phase changée pendant la lecture : " + e0 + " → " + e1 + ", relu)"); if(etat().ph !== JSON.parse(e0).ph) { if(essai === 2) J.secours(lib + " : la phase a changé pendant la lecture, non comparée"); continue; } }
      comparees.add(cle);
      if(!oe){
        // à cette phase, la console n'a pas de « 👁 » (pas de cartes des tablettes) : la référence est l'écran que la vraie tablette dessine à cette phase (MoitieH, c3-tablettes.js)
        J.secours(lib + " : pas de « 👁 » sur la console à cette phase ; comparé à l'écran de la vraie tablette (MoitieH) : « " + opts.attendu + " »");
        for(const [vue, x] of [["en petit", pe], ["« 🔍 en grand »", gr]]){
          if(!x){ J.v(false, H3, lib + " : la tablette simulée 1 " + vue + " est là", "absente ; capture " + c); continue; }
          J.v(opts.re.test(x.g) && opts.re.test(x.d), H3, lib + " : la tablette simulée 1, " + vue + ", dessine l'écran de la vraie tablette, les deux moitiés (« " + opts.attendu + " »)", "Élise : " + net(x.g).slice(0, 160) + " · Gatien : " + net(x.d).slice(0, 160) + " ; capture " + c);
          if(opts.pasAttente) J.v(!/Attends la prochaine question/.test(x.tout), H3, lib + " : la tablette simulée 1, " + vue + ", ne dit pas « ⏳ Attends la prochaine question… »", x.tout.slice(0, 200) + " ; capture " + c);
        }
        return; }
      for(const [vue, x] of [["en petit", pe], ["« 🔍 en grand »", gr]]){
        if(!x){ J.v(false, H3, lib + " : la tablette simulée 1 " + vue + " est là", "absente ; capture " + c); continue; }
        const sansME = t => net(t).replace(/ \| 📊 Mes évaluations/g, "");
        const dg = ecart(sansME(x.g), sansME(oe.g)), dd = ecart(sansME(x.d), sansME(oe.d));
        if(/📊 Mes évaluations/.test(oe.g) && !mesEvals.has(vue)){ mesEvals.add(vue); J.v(/📊 Mes évaluations/.test(x.g), H3, "point 6 : la tablette simulée 1, " + vue + ", porte « 📊 Mes évaluations » en tête de chaque moitié, comme « 👁 » (la vraie tablette)", lib + " : absent ; captures " + c + ", 👁 " + oe.cap); }
        J.v(!dg && !dd, H3, lib + " : la tablette simulée 1, " + vue + ", dessine ce que dessine « 👁 » (la vraie tablette), les deux moitiés", (dg ? "Élise : " + dg : "") + (dd ? " Gatien : " + dd : "") + " ; captures " + c + ", 👁 " + oe.cap);
        if(opts.pasAttente) J.v(!/Attends la prochaine question/.test(x.tout), H3, lib + " : la tablette simulée 1, " + vue + ", ne dit pas « ⏳ Attends la prochaine question… »", x.tout.slice(0, 200) + " ; capture " + c);
      }
      return;
    }
  };

  // ── un clic « en grand » dans la moitié d'Élise : il fait ce qu'il fait sur la vraie tablette, une seule fois ──
  const clicGrand = async (re) => { const ok = await prof.evaluate(([src]) => { const re = new RegExp(src); const b = [...document.querySelectorAll(".grand-tab .moitie.g button")].find(x => re.test((x.textContent || "").replace(/\s+/g, " ").trim()) && !x.disabled && x.getBoundingClientRect().width > 0);
      if(!b) return false; document.querySelectorAll("[data-banc]").forEach(x => x.removeAttribute("data-banc")); b.setAttribute("data-banc", "gc"); return true; }, [re.source]).catch(() => false);
    if(ok) await prof.click("[data-banc='gc']", {timeout: 2000}).catch(() => {}); return ok; };

  // ── la liste du soir de la console ──
  const listeSoir = async () => { const t = await texte(prof); const m = t.match(/📌 À lire sur les feuilles, ce soir \((\d+)\)/); const i = t.indexOf("📌 À lire sur les feuilles");
    return {n: m ? +m[1] : 0, vu: !!m, txt: i >= 0 ? t.slice(i, i + 600) : ""}; };
  const aLireBase = () => { const a = srv.store.get("qcm/aLire/" + sid) || {}; return Object.keys(a).map(k => Object.assign({id: k}, a[k])).filter(x => x && !x.lue); };

  // ── une séance de test, jouée jusqu'au soir ──
  const seance = async (nom, opts) => {
    opts = opts || {};
    const des = [];          // les clics sur « 🎲 », horodatés
    const de6 = async (cle) => { if(!opts.point6) return; };
    const des1 = async (lib) => { if(await cliquer(prof, /🎲 Tous les élèves répondent/, undefined, {apres: 50})){ des.push({t: Date.now(), lib, ph: etat().ph}); await pause(900); return true; } J.v(false, H3, nom + " : « 🎲 Tous les élèves répondent » (" + lib + ")"); return false; };
    J.section(nom + " : « 🧪 Mode test », « 🚀 Lancer la séance », l'appel");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(300);
    const dejaTest = /MODE TEST/.test(await texte(prof));
    J.v(dejaTest || await cliquer(prof, /🧪 Mode test/), H3, nom + " : « 🧪 Mode test »" + (dejaTest ? " (la console y est restée après « 🛑 Terminer »)" : "")); await pause(2500);
    for(let k = 0; k < 20 && !/🚀 Lancer la séance/.test(await texte(prof)); k++) await pause(300);
    sid = null;
    J.v(await cliquer(prof, /^🚀 Lancer la séance$/, ".test-prof-zone"), H3, nom + " : « 🚀 Lancer la séance » de la carte du mode test"); await pause(1500);
    if(opts.point6){
      // l'appel : la vraie tablette n'a pas de séance (« Combien êtes-vous ? ») ; la simulée de même
      const pe = await vuePetit(); const c = await capt(prof, "s6-appel");
      J.v(/Combien êtes-vous|Identifie-toi/.test(pe.tout), H3, "point 6, l'appel : la tablette simulée 1, en petit, dit « Combien êtes-vous sur cette tablette ? » comme la vraie (pas de séance pour les tablettes pendant l'appel)", pe.tout.slice(0, 200) + " ; capture " + c);
    }
    J.v(await cliquer(prof, /^🚀 Lancer la séance$/), H3, nom + " : « 🚀 Lancer la séance » de la fenêtre de l'appel"); await pause(2000);
    sess(); J.v(!!sid, H3, nom + " : la séance de test existe (sessionActive/" + CL + ")", JSON.stringify(srv.store.get("qcm/sessionActive")));
    if(!sid) throw new Error("la séance de test n'est pas lancée");
    const fait = new Set(); let vuBilan = false, garde = 0, derniere = "";
    const qn = () => (EVT().questions || []).length || 3;
    while(Date.now() - t0 < 400000 && garde++ < 600){
      const e = etat(), ph = e.ph, cle = ph + ":" + e.qi + ":" + e.tour;
      if(cle !== derniere){ console.log("   phase " + de()); derniere = cle; }
      if(ph === "entree" || ph === "pret"){
        if(!fait.has("entree")){ fait.add("entree"); if(opts.point6) await comparer("point 6, l'entrée (« Avant de commencer »)", "entree"); await des1("l'entrée"); await pause(500); if(opts.point6) await comparer("point 6, prêts (« En attente du démarrage »)", "pret"); }
        await cliquer(prof, /▶️ Lancer Q1\b/, ".test-prof-zone"); await pause(800);
      }
      else if(ph === "reflexion"){
        if(!fait.has(cle)){ fait.add(cle);
          if(opts.point6 && e.qi === 0) await comparer("point 6, Q1 réflexion", "q1-reflexion");
          if(opts.feuille && e.qi === opts.feuille.qi) await taperFeuille(opts.feuille, nom);
          if(e.qi === 1 && !opts.feuille) await verifierChamps(nom);
        }
        await cliquer(prof, /Autoriser la réponse/, ".test-prof-zone"); await pause(600);
      }
      else if(ph === "reponse"){
        if(!fait.has(cle)){ fait.add(cle);
          if(opts.point6 && e.qi === 0) await comparer("point 6, Q1 tour " + e.tour + ", la réponse", "q1-reponse-" + e.tour);
          await des1("Q" + (e.qi + 1) + " tour " + e.tour);
          await pause(600);
          // (b) : chaque élève qui vient de répondre a sa feuille, du texte de son clic
          verifierFeuilles(nom, e.qi, e.tour, opts.feuille);
          // le tour fini (chacun a répondu) : le chrono expire, sans toucher à « Oui / Non »
          if(etat().ph === "reponse") await cliquer(prof, /Faire expirer le chrono/, undefined, {apres: 400});
        } else await pause(300);
      }
      else if(ph === "b"){
        if(opts.point6 && e.qi === 0 && !fait.has(cle)){ fait.add(cle); await comparer("point 6, Q1 tour " + e.tour + ", B (« avais-tu bien écrit … sur ta copie ? »)", "q1-b-" + e.tour); }
        await pause(300);
      }
      else if(ph === "passage") await pause(300);
      else if(ph === "close"){
        if(!fait.has(cle)){ fait.add(cle); await pause(800); verifierB(nom, e.qi, des, opts.feuille); if(opts.point6 && e.qi === 0) await comparer("point 6, Q1 close", "q1-close"); }
        if(e.qi + 1 < qn()){ if(!(await cliquer(prof, new RegExp("Lancer Q" + (e.qi + 2) + "\\b"), ".test-prof-zone"))) await pause(400); await pause(600); }
        else { await cliquer(prof, /Lancer l'autoévaluation/, ".test-prof-zone"); await pause(800); }
      }
      else if(ph === "estim"){
        if(!fait.has("estim")){ fait.add("estim"); if(opts.point6) await comparer("point 6, l'estimation", "estim", {re: /Combien de bonnes réponses penses-tu avoir/, attendu: "Combien de bonnes réponses penses-tu avoir ?"}); await des1("l'estimation"); }
        await cliquer(prof, /Lancer la correction/, ".test-prof-zone"); await pause(800);
      }
      else if(ph === "att2"){
        if(!fait.has("att2")){ fait.add("att2"); if(opts.point6) await comparer("point 6, la seconde attestation", "att2", {re: /Avant la correction|Je commence la correction|Attends|correction/i, attendu: "Avant la correction, …"}); await des1("la seconde attestation"); }
        await cliquer(prof, /Commencer la correction/, ".test-prof-zone"); await pause(800);
      }
      else if(ph === "lecture"){
        if(!fait.has(cle)){ fait.add(cle); if(opts.point6 && !fait.has("l6")){ fait.add("l6"); await comparer("point 6, la correction (lecture de la feuille du voisin)", "lecture"); } await des1("la lecture Q" + (e.qi + 1)); }
        if(!(await cliquer(prof, /Révéler/, ".test-prof-zone"))) await pause(500); await pause(600);
      }
      else if(ph === "revele"){
        if(opts.point6 && !fait.has("r6")){ fait.add("r6"); await comparer("point 6, la correction (réponse révélée)", "revele"); }
        if(!(await cliquer(prof, /Question suivante/, ".test-prof-zone"))){ if(!(await cliquer(prof, /Ouvrir la co-évaluation/, ".test-prof-zone"))) await pause(400); } await pause(800);
      }
      else if(ph === "coeval"){
        if(!fait.has("coeval")){ fait.add("coeval");
          if(opts.point6){
            await comparer("point 6, la co-évaluation", "coeval", {pasAttente: true, re: /a-t-(il|elle) bien lu ta feuille/, attendu: "…, … a-t-il bien lu ta feuille ?"});
            // en grand : « ✅ … a bien lu ma feuille » d'Élise, une seule écriture, puis la même chose que « 👁 »
            await ouvrirGrand(); const n0 = ecr.filter(x => x.c.endsWith("/coeval/" + ELISE)).length;
            const ok = await clicGrand(/^✅ /); await pause(1500);
            const w = ecr.filter(x => x.c.endsWith("/coeval/" + ELISE)).slice(n0);
            const c = await capt(prof, "s6-coeval-clic-grand"); const gz = await zoneTexte(prof, ".grand-tab .moitie.g"); await fermerGrand();
            J.v(ok, H3, "point 6, la co-évaluation en grand : « ✅ Je pense que Gatien a bien lu ma feuille » est là et ouvert (moitié d'Élise)", gz.slice(0, 200) + " ; capture " + c);
            if(ok){
              J.v(w.length === 1 && w[0].v && w[0].v.statut === "ok", H3, "point 6, la co-évaluation en grand : un clic « ✅ » écrit une seule fois coeval/" + ELISE + " = ok, comme sur la vraie tablette", w.length + " écriture(s) : " + JSON.stringify(w.map(x => x.v)) + " ; capture " + c);
              const oe = await vueOeil();
              J.v(oe && /Attends ton bilan/.test(oe.g) && /Attends ton bilan/.test(gz) && !/Attends la prochaine question/.test(gz), H3, "point 6, la co-évaluation en grand, après le clic : la moitié d'Élise dit ce que dit la vraie (« ⏳ Attends ton bilan… »)", "en grand : " + gz.slice(0, 160) + " · 👁 : " + (oe ? oe.g.slice(0, 160) : "—") + " ; capture " + c);
            }
          }
          await des1("la co-évaluation"); await pause(800);
          const L = await listeSoir(); const c = await capt(prof, nom.replace(/\W+/g, "") + "-coeval-liste");
          verifierListe(nom, "à la co-évaluation", L, c, opts.feuille);
        }
        await cliquer(prof, /Afficher leur bilan aux élèves/, ".test-prof-zone"); await pause(1000);
      }
      else if(ph === "bilan"){
        if(!vuBilan){ vuBilan = true; await pause(800);
          if(opts.point6){
            await comparer("point 6, le bilan", "bilan", {pasAttente: true, re: /Ta note provisoire/, attendu: "🎯 Bilan personnel · Ta note provisoire : n / 3"});
            await ouvrirGrand(); const p0 = popups.length;
            const ok = await clicGrand(/Imprimer \/ Exporter mon bilan/); await pause(1500);
            const c = await capt(prof, "s6-bilan-clic-grand"); await fermerGrand();
            J.v(ok, H3, "point 6, le bilan en grand : « 📄 Imprimer / Exporter mon bilan » est là (moitié d'Élise)", "absent ; capture " + c);
            if(ok) J.v(popups.length - p0 === 1, H3, "point 6, le bilan en grand : un clic « 📄 Imprimer / Exporter mon bilan » ouvre son bilan imprimable, une seule fois, comme sur la vraie tablette", (popups.length - p0) + " fenêtre(s) ouverte(s) : " + popups.slice(p0).join(", ") + " ; capture " + c);
          }
          const L = await listeSoir(); const c = await capt(prof, nom.replace(/\W+/g, "") + "-bilan-liste");
          verifierListe(nom, "au bilan", L, c, opts.feuille);
          const al = aLireBase(); console.log("   aLire (base) : " + JSON.stringify(al.map(x => [x.eleveSlug || x.p, x.qi, x.sorte, (x.txt || "").slice(0, 60)])));
        }
        break;
      }
      else await pause(400);
    }
    if(!vuBilan) J.v(false, BANC, nom + " : la séance n'est pas arrivée au bilan", de());
    // le soir : « 🛑 Terminer la séance », puis le tableau de la séance s'il est dans Résultats
    await cliquer(prof, /🛑 Terminer la séance/, ".test-prof-zone"); await pause(600);
    await cliquer(prof, /^🛑 Terminer/); await pause(1200);
    const sidFini = sid;
    const tf = await texte(prof); const c = await capt(prof, nom.replace(/\W+/g, "") + "-apres-terminer");
    if(/MODE TEST/.test(tf) && !/Données/.test(tf)) J.secours(nom + ", le soir : après « 🛑 Terminer », la console reste en mode test (sans Données → Résultats) et « 🗑️ Sortir et purger » efface la séance ; S.seances écarte d'ailleurs les classes « _ » : le tableau de la séance de test n'est pas joignable par le geste, non joué (" + c + ") ; aLire en base : " + JSON.stringify(aLireBase().map(x => [x.eleveSlug || x.p, x.qi, x.sorte])).slice(0, 200));
    else J.secours(nom + ", le soir : écran après « 🛑 Terminer » (" + c + ")");
    return sidFini;
  };
  // (b) : après « 🎲 » à un tour, la feuille de chaque élève qui vient de répondre dit le texte de son clic
  const verifierFeuilles = (nom, qi, tour, feuille) => {
    const s = sess(), rep = ((s.reponses || {})[qi]) || {}, ft = s.feuillesTest || {};
    const ceux = Object.keys(rep).filter(x => (rep[x] || {}).tour === tour || (tour === 1 && !(rep[x] || {}).tour));
    const mauvais = [];
    for(const x of ceux){ if(feuille && x === ELISE && qi === feuille.qi) continue;
      let f = ft[x]; if(f && typeof f === "object") f = f[qi] != null ? f[qi] : f[String(qi)]; if(f == null && ft[qi] && typeof ft[qi] === "object") f = ft[qi][x];
      const attendu = choixTxt(qi, (rep[x] || {}).choix);
      if(!f || !attendu.every(t => String(f).includes(t))) mauvais.push(x + " : feuille « " + (f || "") + " », clic « " + attendu.join(" + ") + " »"); }
    J.v(ceux.length > 0 && mauvais.length === 0, H3, nom + ", Q" + (qi + 1) + " tour " + tour + " : « 🎲 » remplit la feuille (« 📝 Feuille ») de chacun des " + ceux.length + " élèves qui répondent, du texte de ce qu'il clique", (ceux.length ? mauvais.length + " sans : " + mauvais.slice(0, 4).join(" · ") : "personne n'a répondu"));
  };
  // (b), à l'écran : à la réflexion de Q2, les champs « 📝 Feuille » de la tablette 1 disent le clic de Q1 (ou sont vides si la feuille est par question)
  const verifierChamps = async (nom) => {
    const v = await prof.evaluate(() => [...document.querySelectorAll(".sims [data-sim-tab='1'] input.simt-fi, .sims [data-sim-tab='1'] input")].map(i => i.value)).catch(() => []);
    const c = await capt(prof, "feuilles-q2-reflexion");
    console.log("   champs « 📝 Feuille » de la tablette 1 à la réflexion de Q2 : " + JSON.stringify(v) + " (" + c + ")");
  };
  // séance B : Paul tape la feuille d'Élise, à la réflexion de la question, dans le champ « 📝 Feuille Élise » de la tablette 1
  const taperFeuille = async (feuille, nom) => {
    const ok = await prof.evaluate(() => { const i = [...document.querySelectorAll(".sims [data-sim-tab='1'] input")].find(x => /Élise/.test((x.closest(".simt-f") || x.parentElement).textContent || "") || x === document.querySelector(".sims [data-sim-tab='1'] input"));
      if(!i) return false; i.setAttribute("data-banc", "feuille"); return true; }).catch(() => false);
    if(!ok){ J.v(false, H3, nom + " : le champ « 📝 Feuille Élise » de la tablette 1, à la réflexion de Q" + (feuille.qi + 1), "absent ; capture " + await capt(prof, "feuille-absente")); return; }
    await prof.click("[data-banc='feuille']").catch(() => {}); await prof.keyboard.press("Control+A"); await prof.keyboard.type(feuille.txt); await prof.keyboard.press("Tab"); await pause(700);
    const s = sess(), ft = s.feuillesTest || {}; let f = ft[ELISE]; if(f && typeof f === "object") f = f[feuille.qi]; if(f == null && ft[feuille.qi]) f = ft[feuille.qi][ELISE];
    J.v(f === feuille.txt, H3, nom + " : Paul tape « " + feuille.txt + " » dans « 📝 Feuille Élise » (Q" + (feuille.qi + 1) + ") : elle est dans la base", JSON.stringify(ft).slice(0, 300) + " ; capture " + await capt(prof, "feuille-tapee"));
  };
  // (a) : à la question close, chaque élève qui a répondu a dit B, et aucun B n'est venu d'un clic « 🎲 »
  const verifierB = (nom, qi, des, feuille) => {
    const s = sess(), rep = ((s.reponses || {})[qi]) || {}, b = ((s.b || {})[qi]) || {};
    const ceux = Object.keys(rep), sans = ceux.filter(x => !b[x]);
    // un B écrit par le clic « 🎲 » de la réponse (avant la fin du temps) n'est pas dit « tout seul » à la fin de son temps
    const wb = ecr.filter(w => new RegExp("/b/" + qi + "/").test(w.c) && w.v), horsB = wb.filter(w => w.ph !== "b" && des.some(d => w.t >= d.t && w.t <= d.t + 1500));
    J.v(ceux.length > 0 && sans.length === 0, H3, nom + ", Q" + (qi + 1) + " close : chacun des " + ceux.length + " élèves qui ont répondu a dit B tout seul (aucun « 🎲 » pendant B)", ceux.length ? sans.length + " sans B : " + sans.slice(0, 6).join(", ") : "personne n'a répondu");
    J.v(horsB.length === 0, H3, nom + ", Q" + (qi + 1) + " : aucun B n'est écrit par le clic « 🎲 » de la réponse (chacun le dit à la fin de son temps, phase B)", horsB.length + " B écrits au clic, phase « " + [...new Set(horsB.map(w => w.ph))].join(", ") + " » : " + [...new Set(horsB.map(w => w.c.split("/").pop()))].slice(0, 6).join(", ") + " · phases de tous les B : " + JSON.stringify(wb.reduce((o, w) => (o[w.ph] = (o[w.ph] || 0) + 1, o), {})));
    // la règle : « Oui » si sa feuille dit son clic ; sans feuille tapée, tous « Oui »
    const ici = feuille && feuille.qi === qi;
    const non = ceux.filter(x => b[x] && b[x] !== "oui" && !(ici && x === ELISE));
    J.v(ceux.length > 0 && non.length === 0, H3, nom + ", Q" + (qi + 1) + " : chaque B est « Oui » (la feuille remplie par « 🎲 » dit son clic)" + (ici ? ", sauf Élise" : ""), non.length + " « Non » : " + non.map(x => x + "=" + b[x]).slice(0, 6).join(", "));
    if(ici) J.v(b[ELISE] === "non", H3, nom + ", Q" + (qi + 1) + " : Élise, dont Paul a tapé la feuille « " + feuille.txt + " », dit B « Non » toute seule (sa feuille ne dit pas son clic)", "B d'Élise : " + JSON.stringify(b[ELISE]));
  };
  // (c) : la liste « 📌 À lire sur les feuilles, ce soir » de la console
  const verifierListe = (nom, ou, L, c, feuille) => {
    if(!feuille) J.v(L.n === 0, H3, nom + ", " + ou + " : la liste « 📌 À lire sur les feuilles, ce soir » est vide (aucune feuille tapée)", "« (" + L.n + ") » : " + L.txt.slice(0, 300) + " ; capture " + c);
    else J.v(L.n === 1 && /Élise|AUDEBERT/.test(L.txt) && new RegExp("Q" + (feuille.qi + 1) + "\\b|[Qq]uestion " + (feuille.qi + 1)).test(L.txt), H3, nom + ", " + ou + " : la liste « 📌 À lire sur les feuilles, ce soir » a une seule ligne, Élise, Q" + (feuille.qi + 1), "« (" + L.n + ") » : " + L.txt.slice(0, 300) + " ; capture " + c);
  };

  try {
    prof = await A.ouvrir("console", "?mode=prof", 1536, 1000);
    prof.context().on("page", p => popups.push(p.url().slice(-80)));
    await seance("Séance A (🎲 partout, aucune feuille tapée)", {point6: true});
    await seance("Séance B (une feuille tapée par Paul : Élise, Q3)", {feuille: {qi: 2, txt: FEUILLE_B}});
  } catch(e){ J.v(false, BANC, "le jeu s'est interrompu : " + e.message); try { await capt(prof, "interrompu"); } catch(x){} }
  for(const p of A.pages) J.v(p.__err.length === 0, H3, "page « " + p.__nom + " » sans erreur ni boîte système", p.__err.slice(0, 3).join(" · "));
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.secours ? "  NOTE   " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "reprise7-b.txt"), "Reprise 7, points 6 et 7, par le geste en mode test (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s\n" + out + "\n");
    console.log(out);
  }
})();
