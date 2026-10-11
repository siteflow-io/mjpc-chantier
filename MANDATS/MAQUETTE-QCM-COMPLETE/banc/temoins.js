// Les témoins des gardes 7 et 8 (complément 2, §5, « Avant toute correction ») : une garde doit trouver son défaut connu.
//   - garde 7, partie 2 : une copie de la maquette où la grille de la ligne d'élève est celle d'index.html (l. 609), telle quelle ;
//   - garde 8 : une page faite de la vraie rangée d'index.html (edtPeindrePanneau, l. 19808 à 19820), de son CSS (edtPoserCss,
//     l. 20006 et suivantes, et celui du panneau prof) et des données du dossier MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT/,
//     à 1366 × 768.
//   node banc/temoins.js <maquette-qcm-vN.html> [sortie.txt]
const path = require("path"), fs = require("fs"), os = require("os");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const G2 = require("./gardes2.js");
const PROD = process.env.PROD || "/home/user/siteflow-io/monsieurjaipascompris";
const FICHIER = path.resolve(process.argv[2]), SORTIE = process.argv[3] || null;
const lignes = [];
const dire = s => { lignes.push(s); console.log(s); };
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// La rangée d'aujourd'hui, écrite comme edtPeindrePanneau l'écrit (l. 19809 à 19820), avec edtJourEnClair (l. 21823)
const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function jourEnClair(iso){ const p = iso.split("-"), d = new Date(iso + "T12:00:00"); return JOURS[(d.getDay() + 6) % 7] + " " + Number(p[2]) + " " + MOIS[Number(p[1]) - 1]; }
function rangeeIndex(){
  const E = G2.edtDonnees();
  const arrive = !(E.reglages && E.reglages.arriverSurEdt === false);
  return '<div class="edt-actions edt-haut"><button class="edt-btn edt-btn-prim">📅 Ouvrir l’emploi du temps</button>'
    + '<label class="edt-regl"><input type="checkbox"' + (arrive ? " checked" : "") + '> arriver sur l’emploi du temps en me connectant</label>'
    + G2.EDT_OBJETS.filter(o => !!E[o]).map(o => { const d = E[o].injecteLe ? " — injecté le " + jourEnClair(E[o].injecteLe) : "";
      return '<button class="edt-btn" title="copier le JSON tel qu’il est au hub' + esc(d) + '">⤓ Sortir le JSON — ' + o + esc(d) + '</button>'; }).join("")
    + ["calendrier", "grille"].map(k => '<button class="edt-btn" title="la consigne pour l’IA et le JSON en service, en un seul bloc">📋 Copier le prompt — ' + k + '</button>').join("") + "</div>";
}
function pageRangee(){
  const idx = fs.readFileSync(path.join(PROD, "index.html"), "utf8");
  const edt = /function edtPoserCss\(\)\{([\s\S]*?)\n\}/.exec(idx)[1];
  const cssEdt = (edt.match(/\+'((?:[^'\\]|\\.)*)'/g) || []).map(x => x.slice(2, -1).replace(/\\'/g, "'")).join("\n");
  const cssPanneau = fs.readFileSync(path.join(__dirname, "..", "src", "mjpc.css"), "utf8");   // les règles d'index.html, copiées telles quelles
  const etats = G2.edtEtatsAttendus().map(t => { const i = t.indexOf(" — "); return '<div class="edt-etat edt-ok"><b>' + esc(t.slice(0, i)) + "</b> — " + esc(t.slice(i + 3)) + "</div>"; }).join("");
  return "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\"><style>body{margin:0;background:#0a051e}\n" + cssPanneau + "\n" + cssEdt + "</style></head><body>"
    + '<div class="tprof-overlay visible"><div class="tprof-box"><div class="tprof-header"><div class="tprof-header-title">🛠 Panneau prof</div></div>'
    + '<div class="tprof-body"><div class="tprof-sidebar"></div><div class="tprof-content"><h2>📅 Emploi du temps</h2><div id="edt-panneau" class="edt-panneau">'
    + '<p class="edt-p">Année <b>2026-2027</b>. Les objets vivent au hub sous <code>/site/edt/</code>. Rien n’est obligatoire : ce qui manque manque, le site marche comme avant.</p>'
    + '<div class="edt-etats">' + etats + "</div>" + rangeeIndex() + "</div></div></div></div></div></body></html>";
}

(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "temoins-"));
  dire("Les témoins des gardes 7 et 8, sur " + path.basename(FICHIER) + " · " + new Date().toISOString());
  // garde 7, partie 2 : la grille d'index.html remise (la règle de la maquette qui la change est retirée)
  const html = fs.readFileSync(FICHIER, "utf8");
  const regle = ".tprof-content .el-row{grid-template-columns:28px minmax(0,1fr) auto auto 96px auto}";
  const copie = path.join(dir, "grille-index.html");
  // et la ligne telle qu'index.html la dessine (l. 5529 : 5 éléments) : sans « 🚫 Jamais avec… », que le cadrage ajoute (585)
  fs.writeFileSync(copie, html.split(regle).join("/* grille d'index.html, l. 609, remise */ .tprof-content .el-row>.ex-btn{display:none}"));
  dire("", "Témoin de la garde 7, partie 2 : la ligne d'élève avec la grille d'index.html (l. 609 : 28px minmax(0,1fr) 96px auto) et ses 5 éléments (l. 5529), sans « 🚫 Jamais avec… » — " + (html.includes(regle) ? "règle de la maquette retirée" : "règle introuvable : la copie est la maquette telle quelle"));
  for(const sc of ["m-classe-exclusions", "m-exclusion-refusee"]){
    const p = await b.newPage({viewport: {width: 1366, height: 1900}});
    await p.goto("file://" + copie + "#scene=" + sc + "&cap=1"); await p.waitForFunction(i => window.SCENE_PRETE === i, sc);
    const lu = await p.evaluate(G2.lireLignesEleves);
    const pertes = G2.garde7Lignes(sc, lu);
    const hors = lu.filter(x => !x.manque && !x.dans).length;
    dire("  " + sc + " : " + lu.length + " lignes, ↻ ✕ hors de la carte sur " + hors + (hors === lu.length ? " (chaque ligne) ✔" : " ✘"));
    pertes.slice(0, 3).forEach(x => dire("    " + x));
    await p.close();
  }
  // garde 8 : la vraie rangée, à 1366 × 768
  const rangee = path.join(dir, "rangee-index.html"); fs.writeFileSync(rangee, pageRangee());
  dire("", "Témoin de la garde 8 : la vraie rangée d'index.html (l. 19808 à 19820, son CSS, les données du dossier), à 1366 × 768");
  const p = await b.newPage({viewport: {width: 1366, height: 768}});
  await p.goto("file://" + rangee);
  const x = await p.evaluate(G2.lireEdt);
  const pertes = G2.garde8Place("rangee-index", {w: 1366, h: 768}, x);
  const cote = pertes.some(t => /défile de côté/.test(t)), long = pertes.filter(t => /tient sur/.test(t)).length;
  dire("  défilement de côté : " + (cote ? "oui ✔" : "non ✘") + " · boutons sur plus de deux lignes : " + long + (long ? " ✔" : " ✘"));
  pertes.forEach(t => dire("    " + t));
  const etats = G2.garde8Etats("rangee-index", x);
  dire("  les lignes d'état de la page témoin, recalculées : " + (etats.length ? "✘ " + etats.join(" | ") : "conformes"));
  await p.screenshot({path: path.join(dir, "rangee-index.png")});
  dire("", "Fichiers des témoins : " + dir);
  if(SORTIE) fs.writeFileSync(SORTIE, lignes.join("\n") + "\n");
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
