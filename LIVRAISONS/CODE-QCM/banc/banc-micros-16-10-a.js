// QCM-4 · BANC — les micros de la conscience du 16/10, contrôlés à froid (DEFAUTS-OUVERTS, « Contrôle à froid des micros de la conscience —
// 16/10/2026 ») : le micro 8.0.2, le nom des classes à l'écran (`nomClasseV`, c3-base.js), rejoué par le geste sur le faux hub.
// Le faux hub porte une classe AU FORMAT RÉEL DU REGISTRE : clé « 3_essai », nom « 3 ESSAI », niveau « 3e » (les codes : classe « 3_essai ») ;
// à côté, « 3_dylan_bob » (nom « 3 DYLAN BOB »), « 3e_charles_de_gaulle » (nom écrit à la main « 3E Charles de Gaulle ») et la classe interne « _test_x ».
// Attendu (Paul, 16/10 07:15) : « 3e Essai » partout où la classe paraît, jamais « 3_essai » ni « 3 ESSAI » ; « 3e Dylan Bob » ; « 3E Charles de Gaulle »
// tel quel ; « _test_x » tel quel ; la clé reste l'identifiant dans la base (sessionActive/3_essai, sessions/<id>/classeSlug).
// La séance : deux élèves sur une tablette (les autres absents à l'appel), Q1 à Q3, l'estimation, la correction, la co-évaluation, le bilan,
// « 🛑 Terminer » ; puis le soir : Données → Résultats, le tableau de la séance, « 📥 Export CSV », rendre les copies, « 📄 PDF notes et compétences ».
// Chaque écran : aucune occurrence du nom brut dans son texte (innerText et les options des menus ; les attributs ne comptent pas).
//   APP_FILE=<app> BANC=<faux hub> node banc/banc-micros-16-10-a.js <dossier de sortie>
const path = require("path"), fs = require("fs"), crypto = require("crypto");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, choisir, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "micros-a-" + Date.now()));
const CAPT = path.join(SORTIE, "captures-micros-a");
fs.mkdirSync(CAPT, {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H3 = "QCM-3 · SOIR", BANC = "QCM-4 · BANC";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const JUSTE = [["Rome"], ["Madrid", "Berlin"], ["8"]];
const CLE = "3_essai", LISIBLE = "3e Essai";
const BRUT = /3_essai|\b3 ESSAI\b|3_dylan_bob|\b3 DYLAN BOB\b|3e_charles_de_gaulle/g;
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAPT, f)); return f; };

(async () => {
  const t0 = Date.now();
  const fin = setTimeout(() => { J.v(false, BANC, "plafond de 6 minutes atteint"); ecrire(); process.exit(0); }, 360000);
  // ── le faux hub : la classe du faux hub par défaut (« 3 ESSAI ») passe au format réel du registre ──
  const {B, srv, port} = await O.fauxHub(B => {
    const c = B.tree.classes["3 ESSAI"]; delete B.tree.classes["3 ESSAI"];
    B.tree.classes[CLE] = Object.assign({}, c, {nom: "3 ESSAI", niveau: "3e"});
    for(const k of Object.keys(B.tree.codes)) if(B.tree.codes[k].classe === "3 ESSAI") B.tree.codes[k].classe = CLE;
    const sup = (cle, nom, niveau, noms, code) => { O.ajouterClasse(B, cle, niveau, noms, code); B.tree.classes[cle].nom = nom; };
    sup("3_dylan_bob", "3 DYLAN BOB", "3e", ["ARNAUD Basile", "BERGER Chloé", "COLIN Dylan", "DUBOIS Emma"], 5101);
    sup("3e_charles_de_gaulle", "3E Charles de Gaulle", "3e", ["ESNAULT Fanny", "FABRE Gaspard", "GIRARD Hélène", "HAMON Ilan"], 6101);
    sup("_test_x", "_test_x", "3e", ["TEST Un", "TEST Deux"], 7101);
  });
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a[CLE]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : {}; };
  // le texte de l'écran, et celui des options de ses menus (ce que Paul lit en ouvrant un menu)
  const lu = async p => { const t = await texte(p); const o = await p.evaluate(() => [...document.querySelectorAll("select")].map(s => [...s.options].map(x => x.textContent).join(" | ")).join("\n")).catch(() => ""); return t + "\n" + O.norm(o); };
  // le contrôle d'un écran : pas de nom brut ; et, si demandé, le nom lisible
  const ecran = async (p, nom, proprio, attendu) => {
    const t = await lu(p), f = await capt(p, slug(nom).slice(0, 40));
    const vus = [...new Set(t.match(BRUT) || [])];
    const ctx = vus.length ? (t.match(new RegExp("[^\\n]{0,60}(" + vus.map(esc).join("|") + ")[^\\n]{0,60}")) || [""])[0] : "";
    J.v(!vus.length, proprio, nom + " : jamais le nom brut de la classe (capture " + f + ")", "vu : " + vus.join(", ") + " — « " + ctx + " »");
    if(attendu) J.v(attendu.test(t), proprio, nom + " : « " + (attendu.source.replace(/\\/g, "")) + " » (capture " + f + ")", t.slice(0, 300));
    return t;
  };
  let prof, tel, tab, t1;
  try {
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    tel = await A.ouvrir("telephone", "?mode=prof&view=phone", 390, 844);

    J.section("1. La console avant la séance : « Pilotage classe », le menu « Classe »");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(500);
    const opts = await prof.evaluate(() => [...document.querySelectorAll("select")].map(s => [...s.options].map(o => ({v: o.value, t: o.textContent}))));
    const menu = (opts.find(l => l.some(o => o.v === "3_essai" || /Essai|ESSAI/.test(o.t))) || []);
    const opt = v => (menu.find(o => o.v === v) || {}).t || "(absente)";
    J.v(/^3e Essai \(\d+ élèves\)$/.test(opt(CLE)), H2, "menu « Classe » : la clé « 3_essai » s'écrit « 3e Essai (25 élèves) »", opt(CLE));
    J.v(/^3e Dylan Bob \(/.test(opt("3_dylan_bob")), H2, "menu « Classe » : « 3 DYLAN BOB » s'écrit « 3e Dylan Bob »", opt("3_dylan_bob"));
    J.v(/^3E Charles de Gaulle \(/.test(opt("3e_charles_de_gaulle")), H2, "menu « Classe » : « 3E Charles de Gaulle » reste tel quel", opt("3e_charles_de_gaulle"));
    const ot = menu.find(o => o.v === "_test_x");
    J.v(!ot || /^_test_x\b/.test(ot.t), H2, "menu « Classe » : la classe interne, si elle paraît, reste « _test_x »", ot ? ot.t : "(absente du menu)");
    J.v(choisirVal(menu) && await prof.evaluate(cle => { for(const s of document.querySelectorAll("select")){ if([...s.options].some(o => o.value === cle)){ s.value = cle; s.dispatchEvent(new Event("change", {bubbles: true})); return true; } } return false; }, CLE), BANC, "le menu « Classe » : « 3e Essai » choisi");
    await pause(300); await choisir(prof, /Évaluation d'essai/); await pause(500);
    await ecran(prof, "console, Pilotage classe, 3e Essai choisie", H2, /3e Essai/);

    J.section("2. L'appel (« 📋 Check-in ») : deux élèves présents, les autres absents");
    await cliquer(prof, /Lancer la séance/); await pause(800);
    await ecran(prof, "l'appel « 📋 Check-in »", H2, /3e Essai —/);
    // la première paire proposée reste ; tous les autres sont marqués absents, d'un clic sur leur nom
    const paires = await prof.evaluate(cle => { try { return SCN.binomesProposes(cle); } catch(e){ return null; } }, CLE) || [];
    const garde = (paires.find(p => p && p[0] && p[1]) || []).map(String);
    const gNoms = garde.map(nomDe);
    let abs = 0; for(const e of B.eleves) if(!gNoms.includes(e.nomComplet)){ if(await cliquer(prof, new RegExp("^(✓|🚫)?\\s*" + esc(e.nomComplet) + "$", "u"), null, {apres: 60})) abs++; }
    J.v(gNoms.length === 2 && abs === B.eleves.length - 2, BANC, "à l'appel, " + abs + " absents ; présents : " + gNoms.join(", "), JSON.stringify(paires).slice(0, 200));
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
    await pause(1500);
    const S0 = sess();
    J.v(!!S0.sid && S0.s.classeSlug === CLE, H1, "la base : sessionActive/3_essai, et sessions/<id>/classeSlug = « 3_essai » (la clé reste l'identifiant)", JSON.stringify(srv.store.get("qcm/sessionActive")) + " · classeSlug " + S0.s.classeSlug);
    const pl = S0.s.places || {}; const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d})).find(t => t.g && t.d);
    if(!T) throw new Error("pas de tablette à deux élèves dans places : " + JSON.stringify(pl).slice(0, 200));
    const M = [["g", T.g], ["d", T.d]];

    J.section("3. La console pendant la séance, le téléphone, le tableau, la tablette");
    await ecran(prof, "console, la carte de la séance (lancée)", H2, /3e Essai/);
    const badge = await cliquer(prof, /séances? en cours/); await pause(500);
    J.v(badge, H1, "« 🔴 1 séance en cours » se clique");
    await ecran(prof, "« 🔴 Séances actuellement en cours »", H1, /3e Essai — Évaluation d'essai/);
    await cliquer(prof, /^✕$/); await pause(300);
    await ecran(tel, "le téléphone, séance lancée", H2);
    tab = await A.ouvrir("tableau", "?mode=prof&view=board", 1920, 1080);
    await ecran(tab, "le tableau, séance lancée", H2);
    t1 = await A.ouvrir("tablette", "?mode=eleve", 1280, 800);
    await ecran(t1, "la tablette, avant l'entrée", H2);
    await O.entrerTablette(t1, M.map(([c, sl]) => [c, nomDe(sl)]), codeDe); await pause(800);
    const tt = await ecran(t1, "la tablette, les deux élèves entrés", H2);
    // l'en-tête est en capitales par la feuille de style (« 3E ESSAI · ABRIAL JULIEN ») : son texte (textContent) dit le nom écrit par l'app
    const entetes = await t1.evaluate(() => [...document.querySelectorAll("body *")].filter(e => e.children.length === 0 && / · /.test(e.textContent || "") && e.getBoundingClientRect().width > 0).map(e => e.textContent.replace(/\s+/g, " ").trim()));
    for(const [c, sl] of M){ const nm = nomDe(sl);
      J.v(entetes.includes("3e Essai · " + nm), H2, "la tablette : l'en-tête « 3e Essai · " + nm + " » (son texte ; à l'écran en capitales)", entetes.join(" | ").slice(0, 200)); }
    for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence$/, c); }
    await pause(800);

    J.section("4. Q1 à Q3 : Autoriser, Tour suivant, Clore");
    for(let qi = 0; qi < 3; qi++){
      await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800);
      await cliquer(prof, /Autoriser la réponse/); await pause(1500);
      const fait = new Set();
      for(let k = 0; k < 90 && !/close/.test(etat().ph || ""); k++){
        for(const [c, sl] of M){
          const z = await zoneTexte(t1, c), cle = qi + ":" + (etat().tour || 1) + ":" + sl;
          if(/la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z)){ await cliquer(t1, /Oui, la même chose/, c); continue; }
          if(!fait.has(cle) && (await O.choixOuverts(t1, c, EV.questions[qi].choix)).length){ for(const x of JUSTE[qi]) await cliquer(t1, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); }
        }
        if(etat().ph === "reponse" && k > 5) await cliquer(prof, /Tour suivant/);
        if(k > 40) await cliquer(prof, /Clore la question/);
        await pause(400);
      }
      if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
      if(qi === 0){ await ecran(prof, "console, Q1 close", H2, /3e Essai/); await ecran(tel, "le téléphone, Q1 close", H2); await ecran(tab, "le tableau, Q1 close", H2); }
    }
    J.v(/close/.test(etat().ph || ""), BANC, "Q3 close", JSON.stringify(etat()));

    J.section("5. L'estimation, la seconde attestation, la correction, la co-évaluation, le bilan");
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(800);
    for(const [c] of M) await cliquer(t1, /Maîtrise satisfaisante/, c);
    await pause(500);
    await cliquer(prof, /Lancer la correction/); await pause(800);
    for(const [c] of M){ await cocherTout(t1, c); await cliquer(t1, /^Je commence la correction$/, c); }
    await pause(1200);
    await cliquer(prof, /Commencer la correction/); await pause(1500);
    J.v(etat().ph === "lecture", BANC, "« ▶️ Commencer la correction » : la lecture", JSON.stringify(etat()));
    await ecran(prof, "console, la correction", H2, /3e Essai/);
    const oc = sess().s.ordreCorr; const ordre = (Array.isArray(oc) ? oc : Object.values(oc || {})).map(Number);
    for(let i = 0; i < ordre.length; i++){
      const qi = ordre[i];
      if(i){ await cliquer(prof, /Question suivante/); await pause(900); }
      for(const [c] of M) for(const x of JUSTE[qi]) await cliquer(t1, new RegExp("^" + esc(x) + "$"), c, {apres: 120});
      await pause(900); await cliquer(prof, /Révéler/); await pause(1200);
    }
    await ecran(t1, "la tablette, la correction révélée", H2);
    await cliquer(prof, /Ouvrir la co-évaluation/); await pause(1200);
    for(const [c] of M) await cliquer(t1, /^✅ Je pense que .* a bien lu ma feuille/, c);
    await pause(1200);
    await ecran(prof, "console, la co-évaluation", H2, /3e Essai/);
    await cliquer(prof, /Afficher leur bilan aux élèves/); await pause(1500);
    await ecran(prof, "console, le bilan de classe", H2, /3e Essai/);
    await ecran(t1, "la tablette, le bilan", H2);
    await ecran(tel, "le téléphone, le bilan", H2);
    await ecran(tab, "le tableau, le bilan", H2);

    J.section("6. « 🛑 Terminer » : la garde, puis « Séances précédentes »");
    await cliquer(prof, /Terminer la séance/); await pause(600);
    await ecran(prof, "la garde « 🛑 Terminer la séance ? »", H1, /3e Essai — Évaluation d'essai/);
    await cliquer(prof, /^🛑 Terminer la séance$/); await pause(2000);
    const sid = dernier, s1 = srv.store.get("qcm/sessions/" + sid) || {};
    J.v(s1.classeSlug === CLE && !(srv.store.get("qcm/sessionActive") || {})[CLE], H1, "la base, la séance terminée : classeSlug « 3_essai », sessionActive/3_essai vidée", "classeSlug " + s1.classeSlug + " · " + JSON.stringify(srv.store.get("qcm/sessionActive")));
    await ecran(tel, "le téléphone, séance terminée", H2);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(500);
    await prof.evaluate(cle => { for(const s of document.querySelectorAll("select")){ if([...s.options].some(o => o.value === cle)){ s.value = cle; s.dispatchEvent(new Event("change", {bubbles: true})); return true; } } return false; }, CLE);
    await pause(800);
    await ecran(prof, "console, « 📚 Séances précédentes »", H3, /Séances précédentes — 3e Essai/);

    J.section("7. Le soir : Données → Résultats, le tableau de la séance, le CSV, le PDF");
    J.v(await cliquer(prof, /^Données$/), H3, "« Données » se clique"); await pause(400);
    await cliquer(prof, /^📊 Résultats$/); await pause(700);
    await ecran(prof, "Données → Résultats", H3);
    const ouvrir = async () => { const ok = await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => /📊 Ouvrir/.test(b.textContent) && b.getBoundingClientRect().width > 0)
        .find(b => { let x = b; for(let k = 0; k < 6 && x; k++, x = x.parentElement) if(/Évaluation d'essai/.test(x.textContent || "")) return true; return false; }); if(!b) return false; b.setAttribute("data-banc", "ouvrir"); return true; });
      if(ok) await prof.click("[data-banc='ouvrir']").catch(() => {}); await pause(900); return ok; };
    J.v(await ouvrir(), H3, "« 📊 Ouvrir » la séance");
    await ecran(prof, "le tableau de la séance", H3, /Évaluation d'essai — 3e Essai/);
    // « 📥 Export CSV » : le fichier téléchargé (son nom, son contenu)
    const dl = prof.waitForEvent("download", {timeout: 5000}).catch(() => null);
    const okCsv = await cliquer(prof, /Export CSV/); const d = await dl;
    if(!okCsv) J.v(false, H3, "« 📥 Export CSV » sur le tableau de la séance", "absent");
    else if(!d) J.v(false, H3, "« 📥 Export CSV » télécharge un fichier", "aucun téléchargement");
    else { const nom = d.suggestedFilename(); const f = path.join(SORTIE, "micros-a-" + nom.replace(/[^\w.-]/g, "_")); await d.saveAs(f).catch(() => {});
      const c = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
      J.v(!/3_essai|3[-_ ]ESSAI/.test(nom), H3, "le CSV : son nom ne porte pas le nom brut (« resultats-3e-Essai-… »)", nom);
      J.v(!(c.match(BRUT) || []).length, H3, "le CSV : son contenu ne porte pas le nom brut", (c.match(BRUT) || []).join(", ")); }
    await ecran(prof, "le tableau de la séance, après « 📥 Export CSV »", H3);
    // rendre les copies (les feuilles à lire, s'il y en a, marquées lues d'abord), puis le PDF
    for(const sl of garde){ const nm = nomDe(sl); if(await cliquer(prof, new RegExp("^" + esc(nm) + "$"))){ await pause(400); let k = 0; while(k < 4 && await cliquer(prof, /^✔ Marquer lue$/)) k++; if(!(await cliquer(prof, /^✕ Fermer$/))) await prof.keyboard.press("Escape"); await pause(300); } }
    await cliquer(prof, /^📊 Résultats$/); await pause(600);
    if(await cliquer(prof, /rendre les copies ▸/)){ await pause(400); await cliquer(prof, /^Rendre les copies$|^📤 Rendre|^Rendre$/); await pause(900); }
    J.v(!!((srv.store.get("qcm/sessions/" + sid) || {}).copies || {}).rendues, BANC, "les copies rendues (pour ouvrir le PDF)", JSON.stringify((srv.store.get("qcm/sessions/" + sid) || {}).copies));
    await ecran(prof, "Données → Résultats, copies rendues", H3);
    await ouvrir();
    const fen = prof.context().waitForEvent("page", {timeout: 6000}).catch(() => null);
    const okPdf = await cliquer(prof, /PDF notes et compétences/); await pause(1500);
    const pdf = await fen;
    if(pdf){ await pdf.waitForLoadState().catch(() => {}); await pause(800);
      await ecran(pdf, "le PDF « notes et compétences »", H3, /Classe : 3e Essai/); await pdf.close().catch(() => {}); }
    else J.v(false, H3, "« 📄 PDF notes et compétences » ouvre sa fenêtre", okPdf ? "aucune fenêtre" : "bouton absent ou fermé");
  } catch(e){ J.v(false, BANC, "le jeu s'est interrompu : " + e.message); try { if(prof) await capt(prof, "interruption"); } catch(x){} }
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "micros-a.txt"), "Micro 8.0.2, le nom des classes à l'écran, par le geste (QCM-4 · BANC) — app " + (process.env.APP_FILE || "?") + " md5 " + md5() + " — durée " + Math.round((Date.now() - t0) / 1000) + " s\n" + out + "\n");
    console.log(out);
  }
  function md5(){ try { return crypto.createHash("md5").update(fs.readFileSync(process.env.APP_FILE)).digest("hex"); } catch(e){ return "?"; } }
  function choisirVal(m){ return m.some(o => o.v === CLE); }
})();
