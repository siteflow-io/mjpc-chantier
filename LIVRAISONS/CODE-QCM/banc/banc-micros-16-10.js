// QCM-4 · BANC — le banc des micros de la conscience du 16/10 (DEFAUTS-OUVERTS, « Contrôle à froid des micros de la conscience — 16/10/2026 », point 4) :
// lance ses trois jeux par le geste, chacun sur son faux hub, et réunit leurs sorties dans <sortie>/micros.txt :
//   a. banc-micros-16-10-a.js — 8.0.2, le nom lisible des classes (clé « 3_essai », nom « 3 ESSAI », niveau 3e) : console, appel, tablette, téléphone,
//      tableau, Résultats, le PDF, le CSV ;
//   b. banc-micros-16-10-b.js — 8.0.3, la correction avec un voisin (de « Avant la correction » à la co-évaluation), un élève seul, sur papier ;
//      la console (« n questions pas encore lues », « — », « pas encore lue ») ; une séance terminée avant la fin de la correction ;
//   c. banc-micros-16-10-c.js — 8.0.3, la carte du temps de la lecture (« +5 », « +10 », « +30 », un temps tapé, la lecture figée à 0 puis rouverte).
//   APP_FILE=<app> node banc/banc-micros-16-10.js <dossier de sortie>   (SEUL=1 : les trois l'un après l'autre)
const path = require("path"), fs = require("fs"), cp = require("child_process");
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "micros-" + Date.now()));
fs.mkdirSync(SORTIE, {recursive: true});
const t0 = Date.now();
const jeux = ["a", "b", "c"];
const jouer = x => new Promise(ok => {
  const p = cp.spawn(process.execPath, [path.join(__dirname, "banc-micros-16-10-" + x + ".js"), SORTIE], {env: process.env, stdio: ["ignore", "ignore", "pipe"]});
  let err = ""; p.stderr.on("data", d => { err += d; });
  const t = setTimeout(() => p.kill("SIGKILL"), 480000);
  p.on("exit", c => { clearTimeout(t); ok({x, c, err}); });
});
(async () => {
  const r = [];
  if(process.env.SEUL) for(const x of jeux) r.push(await jouer(x)); else r.push(...await Promise.all(jeux.map(jouer)));
  let tot = 0, ech = 0; const corps = [];
  for(const {x, c, err} of r){
    const f = path.join(SORTIE, "micros-" + x + ".txt");
    const t = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
    const m = t.match(/vérifications : (\d+) · échecs : (\d+)/);
    if(m){ tot += +m[1]; ech += +m[2]; } else { tot++; ech++; }
    corps.push("════ micros-" + x + (m ? "" : " — ÉCHEC [QCM-4 · BANC] le jeu n'a rien écrit (code " + c + ") " + err.slice(-300)) + "\n" + t);
  }
  const out = "Les micros de la conscience du 16/10, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s\nvérifications : " + tot + " · échecs : " + ech + "\n\n" + corps.join("\n");
  fs.writeFileSync(path.join(SORTIE, "micros.txt"), out);
  console.log("vérifications : " + tot + " · échecs : " + ech);
})();
