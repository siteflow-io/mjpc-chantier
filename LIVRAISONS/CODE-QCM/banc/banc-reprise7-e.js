// QCM-4 · BANC — la reprise 7, points 12 et 14 sur papier (contrôle de la conscience de 11:05) : une séance sur papier lancée, « ⏸️ Feuilles
// ramassées », reprise, deux élèves entrés : « Avant la correction » (LignesAttest2Papier) dit la ligne du stylo vert juste après
// « Maintenant, la correction. » (point 14) et la consigne en vert, sans « rouge » (point 12).
//   APP_FILE=<app> node banc/banc-reprise7-e.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, slug, texte, zoneTexte, cliquer, choisir, cocherTout, photo, attendre } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise7-e-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures-reprise7-e"), {recursive: true});
const J = new O.Journal();
const H2 = "QCM-2 · HEURE";
let n = 0; const capt = async (p, id) => photo(p, path.join(SORTIE, "captures-reprise7-e", String(++n).padStart(2, "0") + "-" + id + ".png"));
const L14 = "Range ta trousse et ton stylo bleu ou noir : pour la correction, garde seulement ton stylo vert.";
const L12 = "Barre ta réponse et écris la bonne réponse en entier en vert à côté.";
(async () => {
  const t0 = Date.now();
  const fin = setTimeout(() => { J.v(false, "QCM-4 · BANC", "plafond de 5 minutes atteint"); ecrire(); process.exit(0); }, 300000);
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  let prof;
  try {
    J.section("La séance sur papier : lancée, « ⏸️ Feuilles ramassées », reprise");
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
    J.v(await cliquer(prof, /Séance sur papier/), H2, "le mode « 📄 Séance sur papier »"); await pause(400);
    await cliquer(prof, /Lancer la séance/); await pause(600); await cliquer(prof, /YVON Adam/); await pause(300);
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
    await pause(1500);
    const lm = (sess().s.lancee || {}).mode;
    J.v(lm === "papier", H2, "la séance est lancée sur papier (lancee.mode = papier)", JSON.stringify(sess().s.lancee || {}).slice(0, 200));
    await capt(prof, "c-papier-seance");
    J.v(await cliquer(prof, /Feuilles ramassées/), H2, "« ⏸️ Feuilles ramassées : finir à une autre heure »"); await pause(500);
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Finir à une autre heure|Feuilles ramassées|Confirmer/.test(b.textContent)); if(b.length > 1) b[b.length - 1].click(); });
    await pause(1000);
    await prof.reload(); await pause(2000); await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
    J.v(await cliquer(prof, /Reprendre la séance du/), H2, "« ▶️ Reprendre la séance du … »"); await pause(800);
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance|Reprendre|Commencer/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
    await pause(1500);
    await capt(prof, "c-papier-reprise");

    J.section("Deux élèves entrés : « Avant la correction », sur papier");
    const pl = sess().s.places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d}));
    const tA = T.find(t => [t.g, t.d].includes("abrial_julien")) || T[0];
    const t1 = await A.tablette("tablette-1", "3 ESSAI");
    await O.entrerTablette(t1, [["g", nomDe(tA.g)], ["d", nomDe(tA.d)]], codeDe);
    await pause(1500);
    // la reprise mène d'abord à l'estimation ; puis Paul lance la correction
    for(const c of ["g", "d"]) await cliquer(t1, /Maîtrise satisfaisante/, c);
    await pause(800);
    J.v(await cliquer(prof, /Lancer la correction/), H2, "« 📝 Lancer la correction »"); await pause(1500);
    let z = "";
    for(let k = 0; k < 20 && !/Avant la correction/.test(z); k++){ z = (await zoneTexte(t1, "g")) || ""; if(!/Avant la correction/.test(z)) await pause(500); }
    J.v(/Avant la correction/.test(z), H2, "la tablette montre « Avant la correction » (la séance sur papier reprise : la correction)", z.slice(0, 300));
    await cocherTout(t1, "g"); await pause(300);
    z = (await zoneTexte(t1, "g")) || ""; await capt(t1, "t-papier-attest2");
    const lignes = z.split(/\n/).map(x => x.replace(/^[☐☑✓✔⬜🔲\s]+/u, "").trim()).filter(Boolean);
    const iM = lignes.findIndex(x => /^Maintenant, la correction\.$/.test(x));
    J.v(iM >= 0 && lignes[iM + 1] === L14, H2, "point 14, sur papier : « " + L14 + " », la ligne juste après « Maintenant, la correction. »", iM >= 0 ? lignes.slice(iM, iM + 3).join(" | ") : z.slice(0, 300));
    J.v(z.includes(L12), H2, "point 12, sur papier : « " + L12 + " »", z.slice(0, 400));
    J.v(!/rouge/i.test(z) && !(await t1.evaluate(() => !!document.querySelector(".stylo-rouge"))), H2, "point 12, sur papier : aucun « rouge » ni `stylo-rouge` dans ce que voit l'élève", (z.match(/[^\n]*rouge[^\n]*/i) || [""])[0]);
  } catch(e){ J.v(false, "QCM-4 · BANC", "le jeu s'est interrompu : " + e.message); }
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "reprise7-e.txt"), "Reprise 7, points 12 et 14 sur papier, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s\n" + out + "\n");
    console.log(out);
  }
})();
