// QCM-4 · BANC — « Le temps tapé, et la note d'une séance arrêtée avant la fin — 19/10/2026 » (DEFAUTS-OUVERTS), point 29, seconde moitié,
// par le geste, sur le faux hub : « Une question posée mais jamais corrigée en classe […] compte dès que tu as lu la feuille le soir, dans « Lire les copies ». »
// 3 ESSAI, deux élèves présents sur une tablette (les autres absents à l'appel). Q1 : les deux cliquent « Milan » (faux), Q2 et Q3 : juste.
// La correction commence par Q1 (la plus ratée) ; Q1 révélée ; « 🛑 Terminer » : Q2 et Q3 posées, jamais révélées.
// Le soir, « 📄 Lire les copies » : Paul lit la feuille de l'élève 1 à Q2 (ce qu'elle dit : juste), puis à Q3 ; puis la copie de l'élève 2.
// À chaque pas, la même note partout : la base (SCN.note, live/base.js) et c4 (resultatV), « 🧮 La note, en direct », le tableau de la séance, la fiche,
// et, la note complète : le CSV, Résultats, le PDF (copies rendues), le bilan de l'élève (« 📊 Mes évaluations »).
//   APP_FILE=<app> node banc/banc-note-19-10.js <dossier de sortie>   → note.txt, captures-note/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, norm, texte, zoneTexte, cliquer, choisir, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "note-" + Date.now()));
const CAP = path.join(SORTIE, "captures-note"); fs.mkdirSync(CAP, {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H3 = "QCM-3 · SOIR", H13 = H1 + ", " + H3, BANC = "QCM-4 · BANC";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const REP = [["Milan"], ["Madrid", "Berlin"], ["8"]];   // Q1 fausse, Q2 et Q3 justes
const t0 = Date.now();
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return "captures-note/" + f; };
const note = s => { J.l.push({note: s}); console.log("  note   " + s); };
const fr1 = x => (Math.round(x * 10) / 10).toString().replace(".", ",");
(async () => {
  const fin = setTimeout(() => { J.v(false, BANC, "plafond de 7 minutes atteint"); ecrire(); process.exit(0); }, 420000);
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sid = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; return id || dernier; };
  const S = () => { const id = sid(); return id ? srv.store.get("qcm/sessions/" + id) || {} : {}; };
  const etat = () => { const d = S().deroule; return d && typeof d === "object" ? d : {}; };
  const L = l => Array.isArray(l) ? l : l && typeof l === "object" ? Object.keys(l).sort((a, b) => a - b).map(k => l[k]) : [];
  let prof;
  // les deux copies de la note, dans la page de la console : la base (SCN.note) et c4 (resultatV)
  const deuxNotes = (x) => prof.evaluate(([x, id]) => { const o = {};
    try { const a = SCN.note(x, undefined, id); o.base = a ? {n: a.n, total: a.total, complet: !!a.complet, sur20: a.sur20, st: a.st, maitrise: a.maitrise && (a.maitrise.k || a.maitrise)} : null; } catch(e){ o.base = "erreur : " + e.message; }
    try { const b = resultatV(seanceV(id), x); o.c4 = b ? {n: b.n, total: b.total, complet: !!b.complet, sur20: b.sur20, st: b.st, maitrise: b.maitrise && (b.maitrise.k || b.maitrise)} : null; } catch(e){ o.c4 = "erreur : " + e.message; }
    return o; }, [x, dernier]).catch(e => ({erreur: e.message}));
  const clic = async (p, re, zone) => cliquer(p, re, zone, {apres: 700});
  const ouvrirSeance = async () => { await clic(prof, /^Données$/); await clic(prof, /^📊 Résultats$|Résultats/);
    const ok = await prof.evaluate(() => { const b = [...document.querySelectorAll("button, [data-va]")].filter(b => b.getBoundingClientRect().width > 0 && /📊 Ouvrir/.test(b.textContent))[0]; if(!b) return false; document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return true; }).catch(() => false);
    if(ok){ await prof.click("[data-c='1']").catch(() => {}); await pause(1200); } return ok; };
  const ligneTab = sl => prof.evaluate(sl => { const tr = document.querySelector("tr[data-eleve='" + sl + "']"); return tr ? [...tr.querySelectorAll("td")].map(td => td.innerText.replace(/\s+/g, " ").trim()) : null; }, sl).catch(() => null);
  const noteDirecte = () => prof.evaluate(() => { const e = document.querySelector("[data-note-directe]"); return e ? e.innerText.replace(/\s+/g, " ").trim() : ""; }).catch(() => "");
  try {
    J.section("La séance : deux élèves sur une tablette ; Q1 fausse pour les deux, Q2 et Q3 justes");
    prof = await A.ouvrir("console", "?mode=prof", 1536, 1000);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI|3e Essai/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
    await cliquer(prof, /Lancer la séance/); await pause(800);
    const paires = await prof.evaluate(() => { try { return SCN.binomesProposes("3 ESSAI"); } catch(e){ return null; } }) || [];
    const garde = (paires.find(p => p && p[0] && p[1]) || []).map(String); const gN = garde.map(nomDe);
    for(const e of B.eleves) if(!gN.includes(e.nomComplet)) await cliquer(prof, new RegExp("^(✓|🚫)?\\s*" + esc(e.nomComplet) + "$", "u"), null, {apres: 50});
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
    await pause(1500);
    const pl = S().places || {}; const T = Object.keys(pl).map(k => ({g: pl[k].g, d: pl[k].d})).find(t => t.g && t.d);
    if(!T) throw new Error("pas de tablette à deux élèves : " + JSON.stringify(pl).slice(0, 200));
    const E1 = T.g, E2 = T.d; note("présents : " + nomDe(E1) + " (gauche), " + nomDe(E2) + " (droite)");
    const t1 = await A.tablette("tablette-1", "3 ESSAI");
    await O.entrerTablette(t1, [["g", nomDe(E1)], ["d", nomDe(E2)]], codeDe);
    const M = [["g", E1], ["d", E2]];
    for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence$/, c); }
    await pause(800);
    for(let qi = 0; qi < 3; qi++){
      await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800); await cliquer(prof, /Autoriser la réponse/); await pause(1500);
      const fait = new Set();
      for(let k = 0; k < 120 && !/close/.test(etat().ph || ""); k++){
        for(const [c, sl] of M){ const z = await zoneTexte(t1, c), cle = qi + ":" + (etat().tour || 1) + ":" + sl;
          if(/la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z)){ await cliquer(t1, /Oui, la même chose/, c); continue; }
          if(!fait.has(cle) && (await O.choixOuverts(t1, c, EV.questions[qi].choix)).length){ for(const x of REP[qi]) await cliquer(t1, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); } }
        if(etat().ph === "reponse" && k > 4) await cliquer(prof, /Tour suivant/);
        await pause(350);
      }
      if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
    }
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
    for(const [c] of M) await cliquer(t1, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(900);
    for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence la correction$/, c); }
    await pause(1200); await cliquer(prof, /Commencer la correction/); await pause(1500);
    const ordre = L(S().ordreCorr).map(Number);
    J.v(etat().ph === "lecture" && Number(etat().qi) === 0, BANC, "la correction commence par Q1 (la plus ratée)", JSON.stringify({deroule: etat(), ordre}));
    for(const [c] of M) await cliquer(t1, /^Milan$/, c, {apres: 150});
    await pause(900); await cliquer(prof, /Révéler/); await pause(1500);
    J.v(etat().ph === "revele" && Number(etat().qi) === 0, BANC, "Q1 révélée", JSON.stringify(etat()));

    J.section("« 🛑 Terminer » : Q2 et Q3 posées, jamais révélées");
    await cliquer(prof, /Terminer la séance/); await pause(600); await cliquer(prof, /^🛑 Terminer la séance$|Terminer la séance/); await pause(2000);
    const sf = srv.store.get("qcm/sessions/" + dernier) || {};
    J.v(sf.etat === "terminee", BANC, "la séance est terminée", JSON.stringify({etat: sf.etat, ph: (sf.deroule || {}).ph}));
    const dn0 = await deuxNotes(E1); note(nomDe(E1) + ", avant toute lecture du soir : " + JSON.stringify(dn0));
    J.v(dn0.base && dn0.c4 && dn0.base.n === 0 && dn0.c4.n === 0 && !dn0.base.complet && !dn0.c4.complet, H13, "avant la lecture du soir : 0 / 3, note pas complète, dans la base et dans c4", JSON.stringify(dn0));

    J.section("Le soir : « 📄 Lire les copies » ; Paul lit Q2 puis Q3 de chaque copie");
    J.v(await ouvrirSeance(), H3, "Données → Résultats → « 📊 Ouvrir » la séance");
    const r0 = await ligneTab(E1); await capt(prof, "tableau-avant");
    note("le tableau de la séance avant : " + JSON.stringify(r0));
    J.v(await clic(prof, /📄 Lire les copies/) || await clic(prof, /^\d+ feuilles? à lire$/), H3, "« 📄 Lire les copies » (ou « n feuilles à lire »)");
    const etapes = [];
    for(const x of [E1, E2]){
      const nm = nomDe(x), ini = slug(nm.split(" ")[0]).slice(0, 4);
      const okI = await prof.click("[data-initiales='1']", {timeout: 3000}).then(() => true).catch(() => false);
      if(okI){ await prof.keyboard.press("Control+A"); await prof.keyboard.type(ini, {delay: 60}); await pause(500); await prof.keyboard.press("Enter"); await pause(1200); }
      J.v(okI && (await texte(prof)).includes("📄 " + nm), H3, "« Lire les copies » : la copie de " + nm, (await texte(prof)).slice(0, 200));
      for(const qi of [1, 2]){
        // la ligne de la question : « La copie dit autre chose » (ou le seul bouton), puis ce que dit la feuille, puis « Enregistrer »
        const ok = await prof.evaluate(qi => { const l = [...document.querySelectorAll("[data-ligne]")].find(d => (d.querySelector("strong") || {}).textContent === "Question " + (qi + 1)); if(!l) return "pas de ligne";
          const b = [...l.querySelectorAll("button.btn-ghost")].find(b => !/Annuler/.test(b.textContent)) || l.querySelector("button"); if(!b) return "pas de bouton"; l.setAttribute("data-banc-l", "1"); b.click(); return "ok"; }, qi).catch(e => e.message);
        await pause(500);
        for(const c of REP[qi]) await cliquer(prof, new RegExp("^" + esc(c) + "$"), "[data-banc-l='1']", {apres: 150});
        const ok2 = await prof.evaluate(() => { const l = document.querySelector("[data-banc-l='1']"); const b = l && [...l.querySelectorAll("button.btn-primary")].find(b => !b.disabled); if(!b) return false; b.click(); l.removeAttribute("data-banc-l"); return true; }).catch(() => false);
        await pause(1500);
        const lu = ((S().lectures || {})[qi] || {})[x];
        const dn = await deuxNotes(x), nd = await noteDirecte(); const c = await capt(prof, "lire-" + slug(nm).slice(0, 10) + "-q" + (qi + 1));
        const att = qi === 1 ? 1 : 2, complet = qi === 2;
        J.v(ok === "ok" && ok2 && !!lu, H3, nm + ", Q" + (qi + 1) + " : Paul lit la feuille (« " + REP[qi].join(", ") + " ») : lectures/" + qi + "/" + x + " écrite", JSON.stringify({ligne: ok, enregistre: ok2, lu}) + " ; " + c);
        J.v(dn.base && dn.base.n === att && dn.base.complet === complet, H1, nm + ", après la lecture de Q" + (qi + 1) + " : la base (SCN.note) compte la lecture : " + att + " / 3, " + (complet ? "complète" : "pas encore complète"), JSON.stringify(dn.base));
        J.v(dn.c4 && dn.c4.n === att && dn.c4.complet === complet, H3, nm + ", après la lecture de Q" + (qi + 1) + " : c4 (resultatV) : " + att + " / 3, " + (complet ? "complète" : "pas encore complète"), JSON.stringify(dn.c4));
        J.v(JSON.stringify(dn.base) === JSON.stringify(dn.c4), H13, nm + ", après la lecture de Q" + (qi + 1) + " : les deux copies de la note disent la même chose", JSON.stringify(dn));
        J.v(new RegExp("Note : [^·]*" + att + " / 3").test(nd) && (complet ? !/pas encore lue/.test(nd) : /1 question pas encore lue/.test(nd)), H3, nm + ", Q" + (qi + 1) + " : « 🧮 La note, en direct » dit " + att + " / 3" + (complet ? ", sans « pas encore lue »" : " et « 1 question pas encore lue »"), nd.slice(0, 300));
        etapes.push({x, qi, dn});
      }
    }

    J.section("La note complète, sur tous les écrans");
    await clic(prof, /← Tableau de la séance/); await pause(1000);
    const att20 = fr1(2 * 20 / 3);
    for(const x of [E1, E2]){
      const nm = nomDe(x), c = await ligneTab(x), dn = await deuxNotes(x);
      J.v(!!c && /^2\/3/.test(c[4] || "") && !/pas encore lue/.test(c[4] || "") && (c[5] || "") === att20, H3, "le tableau de la séance, " + nm + " : 2/3 · " + att20 + ", sans « pas encore lues »", JSON.stringify(c));
      J.v(!!c && c[6] && c[6] !== "—" && c.slice(7, -2).every(v => v !== "—"), H3, "le tableau de la séance, " + nm + " : la maîtrise et les compétences, la note complète", JSON.stringify(c));
      note(nm + " : base " + JSON.stringify(dn.base && {n: dn.base.n, sur20: dn.base.sur20, maitrise: dn.base.maitrise}) + " · tableau : maîtrise « " + (c && c[6]) + " »");
    }
    const cT = await capt(prof, "tableau-apres");
    // la fiche
    if(await cliquer(prof, new RegExp("^" + esc(nomDe(E1)) + "$"))){ await pause(800); const t = await texte(prof); const cF = await capt(prof, "fiche");
      J.v(new RegExp("👤 " + esc(nomDe(E1)) + " — 2 / 3 · " + att20 + " / 20").test(t) && !/pas encore lue/.test(t.slice(0, 400)), H3, "la fiche de " + nomDe(E1) + " : « 2 / 3 · " + att20 + " / 20 », sans « pas encore lue »", (t.match(/👤[^\n]*/) || [t.slice(0, 200)])[0] + " ; " + cF);
      if(!(await cliquer(prof, /^✕ Fermer$/))) await prof.keyboard.press("Escape"); await pause(400); }
    else J.v(false, H3, "la fiche de " + nomDe(E1) + " s'ouvre depuis le tableau de la séance", cT);
    // le CSV
    const dl = prof.waitForEvent("download", {timeout: 5000}).catch(() => null);
    const okCsv = await cliquer(prof, /Export CSV/); const d = await dl;
    if(okCsv && d){ const f = path.join(SORTIE, "note-" + d.suggestedFilename().replace(/[^\w.-]/g, "_")); await d.saveAs(f).catch(() => {}); const csv = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
      const lg = csv.split(/\r?\n/).find(l => l.includes(nomDe(E1).split(" ")[0])) || "";
      J.v(/2\/3/.test(lg) && lg.includes(att20) && !/pas encore lue/.test(lg), H3, "le CSV, " + nomDe(E1) + " : 2/3 et " + att20 + ", sans « pas encore lue »", lg.slice(0, 200)); }
    else J.v(false, H3, "« 📥 Export CSV » télécharge le fichier", okCsv ? "aucun téléchargement" : "bouton absent");
    // Résultats, rendre les copies, le PDF
    await clic(prof, /^📊 Résultats$/); await pause(700);
    const tR = await texte(prof); const cR = await capt(prof, "resultats");
    note("Données → Résultats : « " + ((tR.match(/[^\n]*Évaluation d'essai[^\n]*/) || [""])[0]).slice(0, 200) + " » (" + cR + ")");
    J.v(!/pas encore lue/.test(tR), H3, "Données → Résultats : plus rien « pas encore lue » pour la séance", (tR.match(/[^\n]*pas encore lue[^\n]*/) || [""])[0]);
    if(await cliquer(prof, /rendre les copies ▸/)){ await pause(500); await cliquer(prof, /^Rendre les copies$|^📤 Rendre|^Rendre$/); await pause(1200); }
    J.v(!!(srv.store.get("qcm/sessions/" + dernier + "/copies") || {}).rendues, BANC, "les copies rendues", JSON.stringify(srv.store.get("qcm/sessions/" + dernier + "/copies")));
    await ouvrirSeance();
    const fen = prof.context().waitForEvent("page", {timeout: 6000}).catch(() => null);
    const okPdf = await cliquer(prof, /PDF notes et compétences/); const pdf = await fen;
    if(pdf){ await pdf.waitForLoadState().catch(() => {}); await pause(1000); const tp = await texte(pdf); const cP = await capt(pdf, "pdf");
      const lp = tp.split("\n").find(l => l.includes(nomDe(E1).split(" ")[0])) || "";
      J.v(tp.includes(att20) && !/pas encore lue/.test(tp), H3, "le PDF « notes et compétences » : " + att20 + ", sans « pas encore lue »", lp.slice(0, 200) + " ; " + cP); await pdf.close().catch(() => {}); }
    else J.v(false, H3, "« 📄 PDF notes et compétences » ouvre sa fenêtre", okPdf ? "aucune fenêtre" : "bouton absent ou fermé");
    // le bilan de l'élève : « 📊 Mes évaluations »
    const el = await A.ouvrir("eleve", "?mode=eleve", 1280, 800);
    await O.entrer1(el, null, nomDe(E1), codeDe(nomDe(E1))); await pause(1500);
    let te = await texte(el);
    if(!/Mes évaluations/.test(te) || !/ \/ 20/.test(te)){ await cliquer(el, /📊 Mes évaluations/); await pause(1200); te = await texte(el); }
    const cE = await capt(el, "eleve-mes-evaluations");
    const le = (te.match(/[^\n]*\/ 20[^\n]*/g) || []).join(" | ");
    J.v(/2 \/ 3/.test(te) && te.includes(att20), H13, "le bilan de " + nomDe(E1) + " (« 📊 Mes évaluations ») : 2 / 3 · " + att20 + " / 20", (le || te.slice(0, 300)) + " ; " + cE);
    for(const p of A.pages) J.v(!p.__err.length, BANC, p.__nom + " : aucune erreur de page", p.__err.slice(0, 3).join(" | "));
  } catch(e){ J.v(false, BANC, "le jeu s'est interrompu : " + e.message); try { await capt(prof, "interrompu"); } catch(x){} }
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(e){}
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "note.txt"), "Point 29, seconde moitié, la note d'une séance arrêtée avant la fin, lue le soir, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
    console.log(out);
  }
})();
