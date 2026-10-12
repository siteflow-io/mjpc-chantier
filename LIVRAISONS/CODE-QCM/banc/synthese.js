// QCM-4 · BANC — la synthèse d'un assemblage : par partie (l'heure, le soir, le reste) et par propriétaire, ce qui passe et ce qui échoue,
// d'après banc.json, demain.json, branches.txt, controles.txt et fidelite.json.   node banc/synthese.js <dossier de sortie> → synthese.txt
const fs = require("fs"), path = require("path");
const O = path.resolve(process.argv[2]);
const lire = f => { try { return fs.readFileSync(path.join(O, f), "utf8"); } catch(e){ return null; } };
const partieDe = s => /^1\.|^B\.|^D\.[1-5]/.test(s) ? "l'heure" : /^2\.|^D\.6/.test(s) ? "le soir" : /^3\./.test(s) ? "le reste" : "toutes les pages";
const T = {};   // partie → proprio → {ok, ko, quoi: []}
function compter(journal, source){
  let sec = "";
  for(const e of journal){
    if(e.section){ sec = e.section; continue; }
    if(e.ok === undefined) continue;
    const p = partieDe(sec), q = e.proprio || "?";
    T[p] = T[p] || {}; T[p][q] = T[p][q] || {ok: 0, ko: 0, quoi: []};
    if(e.ok) T[p][q].ok++; else { T[p][q].ko++; T[p][q].quoi.push(source + " " + sec.split(" ")[0] + " — " + e.quoi); }
  }
}
for(const [f, src] of [["banc.json", "banc"], ["demain.json", "demain"]]){ const t = lire(f); if(t) compter(JSON.parse(t).journal, src); }
const br = lire("branches.txt");
if(br){ const j = []; for(const l of br.split("\n")){ let m = l.match(/^── (\S+)/); if(m){ j.push({section: m[1]}); continue; }
  m = l.match(/^\s+(ok|ÉCHEC)\s+\[([^\]]+)\] (.*?)( — vu : .*)?$/); if(m) j.push({ok: m[1] === "ok", proprio: m[2], quoi: m[3]}); } compter(j, "branches"); }
const out = ["Synthèse de l'assemblage " + path.basename(O), ""];
const ctl = lire("controles.txt");
if(ctl){ const k = ctl.split("\n"); out.push("Contrôles de la conscience : " + (k[2] || "").trim()); for(const l of k.filter(x => /ÉCHEC/.test(x))) out.push("  " + l.trim().slice(0, 200)); out.push(""); }
for(const p of ["l'heure", "le soir", "le reste", "toutes les pages"]){
  if(!T[p]) continue;
  const tot = Object.values(T[p]).reduce((a, x) => ({ok: a.ok + x.ok, ko: a.ko + x.ko}), {ok: 0, ko: 0});
  out.push("■ " + p + " : " + tot.ok + " vérifications passent, " + tot.ko + " échouent");
  for(const q of Object.keys(T[p]).sort()) out.push("    " + q + " : " + T[p][q].ok + " ok, " + T[p][q].ko + " échecs");
}
const fid = lire("fidelite.json");
if(fid){ const f = JSON.parse(fid); const par = {}; for(const s of Object.values(f.parScene)) { par[s.proprio] = par[s.proprio] || {sc: 0, ec: 0}; if(s.ecarts){ par[s.proprio].sc++; par[s.proprio].ec += s.ecarts; } }
  out.push(""); out.push("Fidélité : " + f.atteintes + " scènes atteintes, " + f.fideles + " fidèles ; écarts non nommés : " + Object.entries(par).map(([q, x]) => q + " " + x.ec + " dans " + x.sc + " scènes").join(" ; ") + " ; non atteintes : " + f.nonAtteintes.length); }
fs.writeFileSync(path.join(O, "synthese.txt"), out.join("\n") + "\n");
console.log(out.join("\n"));
