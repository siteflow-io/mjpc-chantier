// QCM-4 · BANC — la fidélité à la maquette : l'écran de l'app au moment de chaque scène (relevé par banc.js) contre la scène de la maquette v9
// (banc/reference/maquette-v9.json, relevée par releve-maquette.js). Même texte (aux données près), mêmes gestes, mêmes infobulles.
// Chaque écart est un défaut, sauf s'il est nommé un par un dans banc/ecarts-maquette.json, avec sa raison.
//   node banc/fidelite.js <dossier de sortie du banc>
const path = require("path"), fs = require("fs");
const { donneesPres } = require("./releve");
const SORTIE = path.resolve(process.argv[2]);
const REF = JSON.parse(fs.readFileSync(path.join(__dirname, "reference", "maquette-v9.json")));
// les relevés du banc commun, puis ceux des gestes rares (banc-branches.js) pour les scènes que le premier n'atteint pas
const APP = JSON.parse(fs.readFileSync(path.join(SORTIE, "releves-app.json")));
if(fs.existsSync(path.join(SORTIE, "releves-branches.json"))){ const br = JSON.parse(fs.readFileSync(path.join(SORTIE, "releves-branches.json"))); for(const k of Object.keys(br)) if(!APP[k]) APP[k] = br[k]; }
const ECARTS = JSON.parse(fs.readFileSync(path.join(__dirname, "ecarts-maquette.json")));
const NOMS = ["ABRIAL Julien", "BAUDRY Léa", "CARRÉ Tom", "DUVERNAY Michel", "ESNAULT Inès", "FOUCHER Hugo", "GALLOIS Manon", "HÉBRARD Nathan", "ISAMBERT Chloé", "JOUBERT Louis", "LACOMBE Emma", "MAILLARD Noah", "NOGARET Zoé", "OLLIVIER Sacha", "PERRAUD Jade", "QUINTON Enzo", "RAMBAUD Lina", "SABATIER Malo", "TESSIER Anna", "VALLÉE Rayan", "WEBER Clara", "YVON Adam", "ZELLER Lou", "BRUNEAU Camille", "CHEVALLIER Théo"];
const PRENOMS = NOMS.map(n => n.split(" ").slice(1).join(" ")).sort((a, b) => b.length - a.length);
const dp = s => donneesPres(s, NOMS.concat(PRENOMS));
// l'écran de la scène, propre à la séance (le sommaire ⚙ et les décorations émoji seules ne comptent pas)
const DECO = /^[⭐🎯✨💡🎲🔥]$/u;
// le propriétaire d'un écran (COMMUN §1) : l'heure → QCM-2 ; le soir et le reste → QCM-3
const SOIR = /^(c-seances|c-resultats|c-fiche|c-que-dit|c-rendre|c-copies|x632|c-corbeille|c-sauvegarde|c-importer|c-purger|e-|c-evals|c-eval-|c-collage|x627|c-feuille|c-reglages|m-|x620|c-papier|t-papier|c-rattrapage|t-corr-seul|c-demo|t-demo)/;
const proprio = id => SOIR.test(id) ? "QCM-3 · SOIR" : "QCM-2 · HEURE";
const nomme = (id, sorte, t) => ECARTS.ecarts.some(e => (e.scene === id || e.scene === "*") && e.sorte === sorte && (e.texte === t || (e.motif && new RegExp(e.motif).test(t))));
const lignes = [], defauts = [];
let nScenes = 0, nSans = 0;
const parScene = {};
for(const sc of REF.scenes){
  const a = APP[sc.id];
  if(!a){ continue; }
  nScenes++;
  const r = {id: sc.id, appareil: a.appareil, gestesManquants: [], gestesEnTrop: [], fermesDifferents: [], bullesManquantes: [], texteManquant: []};
  const gR = new Map(), gA = new Map();
  sc.gestes.filter(g => g.l && !DECO.test(g.l)).forEach(g => gR.set(dp(g.l), g.ferme));
  a.gestes.filter(g => g.l && !DECO.test(g.l)).forEach(g => gA.set(dp(g.l), g.ferme));
  for(const [l, f] of gR){ if(!gA.has(l)){ if(!nomme(sc.id, "geste", l)) r.gestesManquants.push(l); } else if(gA.get(l) !== f && !nomme(sc.id, "ferme", l)) r.fermesDifferents.push(l + (f ? " (fermé dans la maquette)" : " (ouvert dans la maquette)")); }
  for(const [l] of gA) if(!gR.has(l) && !nomme(sc.id, "geste-en-trop", l)) r.gestesEnTrop.push(l);
  const bA = new Set(a.bulles.map(dp));
  for(const b of new Set(sc.bulles.map(dp))) if(!bA.has(b) && !nomme(sc.id, "bulle", b)) r.bullesManquantes.push(b);
  const tA = new Set(a.texte.map(dp));
  for(const t of new Set(sc.texte.filter(l => !DECO.test(l)).map(dp))) if(!tA.has(t) && !nomme(sc.id, "texte", t)) r.texteManquant.push(t);
  const n = r.gestesManquants.length + r.gestesEnTrop.length + r.fermesDifferents.length + r.bullesManquantes.length + r.texteManquant.length;
  if(!n) nSans++;
  parScene[sc.id] = Object.assign(r, {ecarts: n, proprio: proprio(sc.id)});
  if(n) defauts.push({scene: sc.id, proprio: proprio(sc.id), n, r});
}
const hors = ECARTS.horsApp ? new RegExp(ECARTS.horsApp.motif) : null;
const nonAtteintes = REF.scenes.filter(s => !APP[s.id] && !(hors && hors.test(s.id))).map(s => s.id);
const horsApp = REF.scenes.filter(s => hors && hors.test(s.id)).map(s => s.id);
lignes.push("Fidélité de l'app à la maquette v9 (QCM-4 · BANC) — référence " + REF.maquette + " md5 " + REF.md5);
lignes.push("Scènes atteintes par le geste : " + nScenes + " / " + (REF.scenes.length - REF.scenes.filter(s => hors && hors.test(s.id)).length) + " (hors MJPC) · fidèles (aucun écart non nommé) : " + nSans + " · avec écarts : " + defauts.length + " · écarts nommés dans ecarts-maquette.json : " + ECARTS.ecarts.length);
lignes.push("");
for(const d of defauts){
  const r = d.r;
  lignes.push("■ " + d.scene + " (" + r.appareil + ") [" + d.proprio + "] — " + d.n + " écarts");
  if(r.gestesManquants.length) lignes.push("    gestes de la maquette absents : " + r.gestesManquants.slice(0, 25).map(x => "« " + x + " »").join(", ") + (r.gestesManquants.length > 25 ? " … (+" + (r.gestesManquants.length - 25) + ")" : ""));
  if(r.fermesDifferents.length) lignes.push("    ouverts/fermés autrement : " + r.fermesDifferents.slice(0, 15).map(x => "« " + x + " »").join(", "));
  if(r.gestesEnTrop.length) lignes.push("    gestes en trop : " + r.gestesEnTrop.slice(0, 15).map(x => "« " + x + " »").join(", ") + (r.gestesEnTrop.length > 15 ? " … (+" + (r.gestesEnTrop.length - 15) + ")" : ""));
  if(r.bullesManquantes.length) lignes.push("    infobulles absentes : " + r.bullesManquantes.length + " — " + r.bullesManquantes.slice(0, 6).map(x => "« " + x.slice(0, 90) + " »").join(", "));
  if(r.texteManquant.length) lignes.push("    textes absents : " + r.texteManquant.length + " — " + r.texteManquant.slice(0, 12).map(x => "« " + x.slice(0, 80) + " »").join(", "));
}
lignes.push("");
lignes.push("Scènes que le banc n'a pas encore atteintes par le geste (" + nonAtteintes.length + ") : " + nonAtteintes.join(", "));
if(horsApp.length) lignes.push("Scènes hors de l'app, nommées dans ecarts-maquette.json (" + horsApp.length + ") : " + horsApp.join(", ") + " — " + ECARTS.horsApp.raison);
fs.writeFileSync(path.join(SORTIE, "fidelite.txt"), lignes.join("\n") + "\n");
fs.writeFileSync(path.join(SORTIE, "fidelite.json"), JSON.stringify({atteintes: nScenes, fideles: nSans, parScene, nonAtteintes}, null, 1));
console.log(lignes.slice(0, 2).join("\n") + "\n→ " + path.join(SORTIE, "fidelite.txt"));
process.exit(defauts.length ? 1 : 0);
