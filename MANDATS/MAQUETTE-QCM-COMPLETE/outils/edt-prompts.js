// Les deux consignes de l'emploi du temps (EDT_PROMPTS, index.html l. 20745 à 20748), copiées telles quelles dans les sources de la
// maquette, pour que « 📋 Copier le prompt » dise le vrai nombre de caractères (edtPromptComplet, l. 20752). Complément 2, §4.
//   node outils/edt-prompts.js [index.html]   →   src/donnees/edt-prompts.json
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const SRC = process.argv[2] || "/home/user/siteflow-io/monsieurjaipascompris/index.html";
const txt = fs.readFileSync(SRC, "utf8");
const i = txt.indexOf("var EDT_PROMPTS={"), j = txt.indexOf("\n};", i);
const ligne = txt.slice(0, i).split("\n").length;
const prompts = Function("return " + txt.slice(i + "var EDT_PROMPTS=".length, j + 2))();
const out = {source: "index.html (production, md5 " + crypto.createHash("md5").update(fs.readFileSync(SRC)).digest("hex") + "), EDT_PROMPTS, l. " + ligne + " à " + txt.slice(0, j + 2).split("\n").length, prompts};
fs.writeFileSync(path.join(__dirname, "..", "src", "donnees", "edt-prompts.json"), JSON.stringify(out, null, 1) + "\n");
console.log(Object.keys(prompts).map(k => k + " : " + prompts[k].length + " caractères").join(" · "), "— " + out.source);
