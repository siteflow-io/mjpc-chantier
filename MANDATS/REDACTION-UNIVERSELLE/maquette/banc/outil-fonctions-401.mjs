// Outil de la conscience n°14 pour 401 : les fonctions de premier niveau d'un fichier, les remplacer, trouver celles que plus rien n'appelle, les retirer.
import fs from "node:fs";
import * as acorn from "acorn";
const [cmd, fichier, ...reste] = process.argv.slice(2);
const lire = f => fs.readFileSync(f, "utf8");
const decls = t => acorn.parse(t, { ecmaVersion: 2022, sourceType: "script", allowHashBang: true }).body
  .filter(n => n.type === "FunctionDeclaration").map(n => ({ nom: n.id.name, a: n.start, b: n.end }));
// le début d'une déclaration, avec les lignes de commentaire collées au-dessus
const debut = (t, a) => { let i = t.lastIndexOf("\n", a - 1) + 1; for (;;) { const j = t.lastIndexOf("\n", i - 2) + 1; const l = t.slice(j, i - 1).trim(); if (i > 0 && (l.startsWith("//") || (l.startsWith("/*") && l.endsWith("*/")))) i = j; else break; } return i; };
if (cmd === "liste") { for (const d of decls(lire(fichier))) console.log(d.nom, d.a, d.b); }
else if (cmd === "remplacer") { let t = lire(fichier); const [nom, src] = reste; const d = decls(t).find(x => x.nom === nom); if (!d) throw new Error("pas de " + nom); t = t.slice(0, d.a) + lire(src).trim() + t.slice(d.b); fs.writeFileSync(fichier, t); console.log("remplacée", nom); }
else if (cmd === "morts") {   // morts <fichier> <corpus…> : les fonctions du fichier qu'aucun texte du corpus ne nomme hors de leur propre corps
  const t = lire(fichier), corpus = reste.map(lire).join("\n"); const D = decls(t); const out = [];
  for (const d of D) { const sans = t.slice(0, d.a) + t.slice(d.b); const re = new RegExp("\\b" + d.nom.replace(/\$/g, "\\$") + "\\b", "g"); const n = (sans.match(re) || []).length + (corpus.match(re) || []).length; if (!n) out.push(d.nom); }
  console.log(out.join(" "));
}
else if (cmd === "supprimer") { let t = lire(fichier); const noms = new Set(reste); const D = decls(t).filter(d => noms.has(d.nom)).sort((x, y) => y.a - x.a);
  for (const d of D) { const a = debut(t, d.a); let b = d.b; if (t[b] === "\n") b++; t = t.slice(0, a) + t.slice(b); }
  fs.writeFileSync(fichier, t); console.log("retirées", D.length); }
if (cmd === "inatteignables") {   // inatteignables <fichier> <corpus…> : les fonctions que rien de vivant n'atteint (le code de premier niveau du fichier et le corpus sont les racines)
  const t = lire(fichier), corpus = reste.map(lire).join("\n"), D = decls(t);
  let racine = t; for (const d of [...D].sort((x, y) => y.a - x.a)) racine = racine.slice(0, d.a) + racine.slice(d.b);
  const nomme = (txt, n) => new RegExp("\\b" + n.replace(/\$/g, "\\$") + "\\b").test(txt);
  const vivant = new Set(D.filter(d => nomme(corpus, d.nom) || nomme(racine, d.nom)).map(d => d.nom));
  let change = true; while (change) { change = false; for (const d of D) if (vivant.has(d.nom)) { const corps = t.slice(d.a, d.b); for (const e of D) if (!vivant.has(e.nom) && e.nom !== d.nom && nomme(corps, e.nom)) { vivant.add(e.nom); change = true; } } }
  console.log(D.filter(d => !vivant.has(d.nom)).map(d => d.nom).join(" "));
}
if (cmd === "inatteignables2") {   // comme « inatteignables », sans compter les noms écrits dans les commentaires des fichiers JS
  const sansCom = txt => { const C = []; try { acorn.parse(txt, { ecmaVersion: 2022, onComment: (b, x, a, z) => C.push([a, z]) }); } catch (e) { return txt; } let o = txt; for (const [a, z] of C.sort((p, q) => q[0] - p[0])) o = o.slice(0, a) + " ".repeat(z - a) + o.slice(z); return o; };
  const t0 = lire(fichier), t = sansCom(t0), corpus = reste.map(f => /\.js$/.test(f) ? sansCom(lire(f)) : lire(f)).join("\n"), D = decls(t0);
  let racine = t; for (const d of [...D].sort((x, y) => y.a - x.a)) racine = racine.slice(0, d.a) + racine.slice(d.b);
  const nomme = (txt, n) => new RegExp("\\b" + n.replace(/\$/g, "\\$") + "\\b").test(txt);
  const vivant = new Set(D.filter(d => nomme(corpus, d.nom) || nomme(racine, d.nom)).map(d => d.nom));
  let change = true; while (change) { change = false; for (const d of D) if (vivant.has(d.nom)) { const corps = t.slice(d.a, d.b); for (const e of D) if (!vivant.has(e.nom) && e.nom !== d.nom && nomme(corps, e.nom)) { vivant.add(e.nom); change = true; } } }
  console.log(D.filter(d => !vivant.has(d.nom)).map(d => d.nom).join(" "));
}
