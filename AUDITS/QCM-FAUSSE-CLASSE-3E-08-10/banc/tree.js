// Arbre initial du faux hub : la fausse classe, ses codes, les évaluations
// et réglages du QCM recopiés du vrai hub (lu en lecture seule le 08/10).
const fs = require("fs");
const crypto = require("crypto");
const { empreinte } = require("./server");

const CLASSE_CLE = "3 ESSAI";
const CLASSE_NOM = "3 ESSAI";

function sanMJPC(s){
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function buildTree(){
  const noms = JSON.parse(fs.readFileSync(__dirname + "/fausse_classe.json", "utf8"));
  const evals = JSON.parse(fs.readFileSync(__dirname + "/../donnees/evaluations_hub_08-10.json", "utf8"));
  const eleves = noms.map((n, i) => {
    const [nom, ...pr] = n.split(" ");
    return {nomComplet: n, nom, prenom: pr.join(" "), code: String(2101 + i * 7)};
  });
  const codes = {};
  for(const e of eleves){
    const sel = crypto.randomBytes(16).toString("hex");
    codes[sanMJPC(e.nomComplet)] = {name: e.nomComplet, classe: CLASSE_CLE, createdAt: Date.now(),
      sel, empreinte: empreinte(e.code, sel), chiffre: "banc"};
  }
  const tree = {
    classes: { [CLASSE_CLE]: {nom: CLASSE_NOM, niveau: "3e", archivee: false, eleves: eleves.map(e => e.nomComplet)} },
    codes,
    qcm: {
      evaluations: evals,
      settings: {niveaux: [{chrono: 10, id: "facile"}, {chrono: 15, id: "standard"}, {chrono: 20, id: "approfondi"}, {chrono: 30, id: "expert"}]}
    }
  };
  return {tree, eleves, CLASSE_CLE, CLASSE_NOM, sanMJPC};
}
module.exports = { buildTree };
