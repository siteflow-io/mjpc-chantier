// QCM-4 · BANC — la reprise 5 du 13/10 (DEFAUTS-OUVERTS, « Reprise 5 », points 1, 2 et 4), rejouée par le geste sur le faux hub :
// 1. pendant l'appel, le téléphone ne montre pas de séance ; 2. les deux « 🚀 Lancer la séance » de c-appel ;
// 4. le dénominateur de « ont répondu » à la console, au téléphone et au tableau (c-q1-tour1, p-reponse, b-reponse : « 10 / 12 » pendant
// un tour, sur ceux qui ont la main ; p-eleve : « 23 / 24 » question close, sur les présents) ; « 1 réponse enregistrée » (c-interrompue).
// 3 ESSAI, Adam absent : 24 présents sur 12 tablettes ; deux tablettes entrées (quatre élèves).
//   APP_FILE=<app> node banc/banc-reprise5.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, slug, esc, texte, cliquer, choisir, taper, cocherTout, choixOuverts, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise5-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures-reprise5"), {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H12 = H1 + ", " + H2;
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
let n = 0; const capt = async (p, id) => photo(p, path.join(SORTIE, "captures-reprise5", String(++n).padStart(2, "0") + "-" + id + ".png"));
const den = (t, re) => { const m = t.match(re); return m ? m[1] + " / " + m[2] : "?"; };
(async () => {
  const t0 = Date.now();
  const fin = setTimeout(() => { J.v(false, "QCM-4 · BANC", "plafond de 4 minutes atteint"); ecrire(); process.exit(0); }, 240000);
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : {}; };
  const entrer = (p, cote, nom) => O.entrer1(p, cote, nom, codeDe(nom));   // reprise 7, point 13 : l'entrée d'outils.js (l'ancienne et la nouvelle)
  let prof, tel, tab;
  try {
    tel = await A.ouvrir("telephone", "?mode=prof&view=phone", 390, 844);
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);

    J.section("1, 2. L'appel : les deux « 🚀 Lancer la séance » (c-appel) ; le téléphone sans séance");
    await cliquer(prof, /Lancer la séance/); await pause(600); await cliquer(prof, /YVON Adam/); await pause(800);
    const boutons = await prof.evaluate(() => [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance/.test(b.textContent)).map(b => ({l: b.textContent.trim(), ferme: !!(b.disabled || /ferme|disabled/.test(b.className))})));
    await capt(prof, "c-appel");
    J.v(boutons.length === 2 && boutons.every(b => !b.ferme), H1, "pendant l'appel, les deux « 🚀 Lancer la séance » (la carte et la fenêtre) sont ouverts, comme c-appel", JSON.stringify(boutons));
    const telA = await texte(tel); await capt(tel, "p-appel");
    J.v(/Aucune séance active/.test(telA) && !/Lancer Q1|Phase :/.test(telA), H12, "pendant l'appel, le téléphone dit « Aucune séance active » (la séance n'est pas lancée)", telA.slice(0, 200));
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance/.test(b.textContent)); b[b.length - 1].click(); });
    await pause(1500);
    const telL = await texte(tel);
    J.v(!/Aucune séance active/.test(telL), H2, "« 🚀 Lancer la séance » de la fenêtre cliqué : le téléphone montre la séance", telL.slice(0, 200));

    const pl = sess().s.places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d}));
    const tA = T.find(t => [t.g, t.d].includes("abrial_julien")), tB = T.find(t => [t.g, t.d].includes("chevallier_theo"));
    if(!tA || !tB) throw new Error("pas de places");
    const nTab = T.length;
    const t1 = await A.tablette("tablette-1", "3 ESSAI"), t2 = await A.tablette("tablette-2", "3 ESSAI");
    tab = await A.ouvrir("tableau", "?mode=prof&view=board", 1920, 1080);
    await cliquer(t1, /2 élèves/); await entrer(t1, "g", nomDe(tA.g)); await entrer(t1, "d", nomDe(tA.d));
    await cliquer(t2, /2 élèves/); await entrer(t2, "g", nomDe(tB.g)); await entrer(t2, "d", nomDe(tB.d));
    for(const [p, c] of [[t1, "g"], [t1, "d"], [t2, "g"], [t2, "d"]]){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);

    J.section("4. « ont répondu » pendant un tour et question close, aux trois appareils (24 présents, " + nTab + " tablettes)");
    await cliquer(prof, /Lancer Q1\b/); await pause(800);
    await cliquer(prof, /Autoriser la réponse/);
    for(let k = 0; k < 30 && etat().ph !== "reponse"; k++) await pause(200);
    const cote = etat().cote || "g";
    await cliquer(t1, /^Rome$/, cote); await pause(1500);
    const c1 = den(await texte(prof), /(\d+)\s*\/\s*(\d+)\s*ONT RÉPONDU/i), p1 = den(await texte(tel), /TABLETTES\s*—\s*(\d+)\s*\/\s*(\d+)/), b1 = den(await texte(tab), /(\d+)\s*\/\s*(\d+)\s*ont répondu/);
    await capt(prof, "c-tour1"); await capt(tel, "p-tour1"); await capt(tab, "b-tour1");
    const attendu1 = "1 / " + nTab;
    J.v(c1 === attendu1, H12, "console, 1er tour : « " + attendu1 + " ONT RÉPONDU » (c-q1-tour1 : sur les " + nTab + " moitiés qui ont la main)", c1);
    J.v(p1 === attendu1, H2, "téléphone, 1er tour : « TABLETTES — " + attendu1 + " ont répondu » (p-reponse)", p1);
    J.v(b1 === attendu1, H2, "tableau, 1er tour : « ✋ " + attendu1 + " ont répondu » (b-reponse)", b1);
    await cliquer(prof, /Clore la question/); await pause(1200);
    for(let k = 0; k < 20 && etat().ph !== "close"; k++){ await pause(500); if(k === 10) await cliquer(prof, /Clore la question/); }
    const p2 = den(await texte(tel), /TABLETTES\s*—\s*(\d+)\s*\/\s*(\d+)/); await capt(tel, "p-close");
    const c2 = den(await texte(prof), /(\d+)\s*\/\s*(\d+)\s*ONT RÉPONDU/i); await capt(prof, "c-close");
    J.v(c2 === "1 / 24", H12, "console, question close : « 1 / 24 ONT RÉPONDU » (c-q1-close : « 24/24 », sur les présents)", c2);
    J.v(p2 === "1 / 24", H2, "téléphone, question close : « TABLETTES — 1 / 24 ont répondu » (p-eleve : sur les présents)", p2);

    J.section("4. « 1 réponse enregistrée » (c-interrompue)");
    await prof.reload(); await pause(2500); await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(800);
    const ci = await texte(prof); await capt(prof, "c-interrompue");
    J.v(/1 réponse enregistrée/.test(ci) && !/1 réponses/.test(ci), H1, "« Séance interrompue » : « 1 réponse enregistrée », au singulier", (ci.match(/État[^\n]*/) || [ci.slice(0, 200)])[0]);
  } catch(e){ J.v(false, "QCM-4 · BANC", "le jeu s'est interrompu : " + e.message); }
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "reprise5.txt"), "Reprise 5, points 1, 2 et 4, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s\n" + out + "\n");
    console.log(out);
  }
})();
