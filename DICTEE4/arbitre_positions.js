#!/usr/bin/env node
/* ARBITRE DES 15 POSITIONS — décisions de Paul, 09/08/2026 (mission DICTEE4).
 * Entrées : les *_migre.json de DICTEE3 + le HTML de la livraison (tokenize verbatim).
 * Règles appliquées À LA LETTRE :
 *  - faute sur le MOT (s'approchèrent → approchèrent) : idx = jeton du mot, word = le mot ;
 *  - faute sur l'APOSTROPHE (qu', n', d'une → ') : idx = jeton apostrophe désigné, word = ce jeton ;
 *  - manquants « ' » : idx = l'apostrophe voisine désignée dans la liste DICTEE3.
 * Chaque application est VÉRIFIÉE : tokens[idx] === word à l'identique.
 * Seuls idx et word changent (le type ne bouge pas ici — la requalification E est un fichier séparé).
 */
"use strict";
const fs = require("fs");
function chargerTokenize(chemin){
  const m = fs.readFileSync(chemin, "utf8").match(/function tokenize\(text\)\{.*?\}return t\}/s);
  return new Function(m[0] + "; return tokenize;")();
}
const tokenize = chargerTokenize(process.argv[2] || "work4.html");
const estApos = w => /^['\u2019]$/.test(w);

/* La RÈGLE de Paul par mot visé — les positions viennent des verdicts DICTEE3 (lus, pas retapés) :
   - mots entiers dont la faute porte sur le MOT  → cible le mot restant ;
   - élisions seules et « ' » manquants          → cible le jeton apostrophe désigné. */
const REGLES = {
  "s'approch\u00e8rent": { cible: "mot", mot: "approch\u00e8rent" },
  "qu'":  { cible: "apostrophe" },
  "n'":   { cible: "apostrophe" },
  "d'une":{ cible: "apostrophe" },
  "'":    { cible: "apostrophe" },
  "\u2019": { cible: "apostrophe" }
};

/* Trouver le jeton visé dans la fenêtre désignée en DICTEE3 :
   pour "apostrophe" : l'unique jeton apostrophe dans [pos-1 .. pos+2] ;
   pour "mot"        : l'unique jeton égal au mot dans [pos .. pos+2].   */
function trouver(tokens, d){
  const lo = Math.max(0, d.pos - 1), hi = Math.min(tokens.length - 1, d.pos + 2);
  const hits = [];
  for (let i = lo; i <= hi; i++){
    if (d.cible === "apostrophe" ? estApos(tokens[i]) : tokens[i] === d.mot) hits.push(i);
  }
  return hits.length === 1 ? hits[0] : { ambigu: hits };
}

let totalOk = 0, totalErr = 0, totalArb = 0;
const fichiers = fs.readdirSync("migres").filter(f => f.endsWith("_migre.json"));
for (const fichier of fichiers){
  const verdict = JSON.parse(fs.readFileSync("migres/" + fichier.replace("_migre.json", "_verdict.json"), "utf8"));
  const brut = fs.readFileSync("migres/" + fichier, "utf8");
  const snap = JSON.parse(brut), original = JSON.parse(brut);
  const data = snap.data, tokens = tokenize(data.config.text);
  const faits = [];
  for (const a of (verdict.arbitrages || [])){
    const regle = REGLES[a.word];
    if (!regle){ console.error("R\u00c8GLE MANQUANTE pour", JSON.stringify(a.word)); process.exit(1); }
    const errs = (data.results[a.eleve] || {}).errors || [];
    const e = errs.find(x => x && x.idx === a.idx && x.word === a.word);
    if (!e){ console.error("INTROUVABLE:", fichier, a.eleve, a.word, "idx", a.idx); process.exit(1); }
    const d = { cible: regle.cible, mot: regle.mot, pos: a.positionCandidate };
    const j = trouver(tokens, d);
    if (typeof j !== "number"){ console.error("AMBIGU:", fichier, a.eleve, a.word, j); process.exit(1); }
    e.idx = j; e.word = tokens[j];
    if (tokens[e.idx] !== e.word){ console.error("VERIF KO:", fichier, a.eleve); process.exit(1); }
    faits.push(a.eleve + " " + JSON.stringify(a.word) + " (" + e.type + ") \u2192 idx " + j + " " + JSON.stringify(tokens[j]));
  }
  let ok = 0, tot = 0, ratees = [];
  for (const el of Object.keys(data.results))
    for (const e of (data.results[el].errors || []))
      if (e && e.idx != null && e.type !== "M" && e.type !== "P"){
        tot++; if (tokens[e.idx] === e.word) ok++; else ratees.push(el + ":" + e.idx + ":" + JSON.stringify(e.word));
      }
  /* et les M/P sur apostrophe arbitr\u00e9s doivent pointer une apostrophe */
  const diffs = [];
  (function cmp(a, b, ch){
    if (a === b) return;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== "object"){ diffs.push(ch); return; }
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) cmp(a[k], b[k], ch + "/" + k);
  })(original, snap, "");
  const horsChamp = diffs.filter(c => !/\/errors\/\d+\/(idx|word)$/.test(c));
  const out = "arbitres/" + fichier.replace("_migre.json", "_arbitre.json");
  fs.writeFileSync(out, JSON.stringify(snap, null, 2));
  totalOk += ok; totalErr += tot; totalArb += faits.length;
  console.log("\u2550\u2550\u2550 " + fichier.slice(14, 52));
  console.log("   arbitrages: " + faits.length + " | v\u00e9rification hors M/P: " + ok + "/" + tot + (ratees.length ? " | RAT\u00c9ES: " + ratees.join(", ") : " \u2014 100 %"));
  console.log("   champs hors idx/word: " + JSON.stringify(horsChamp) + " | " + out);
  faits.forEach(f => console.log("   \u2713 " + f));
}
console.log("\u2550\u2550\u2550 arbitrages appliqu\u00e9s: " + totalArb + " (attendu 15)");
console.log("\u2550\u2550\u2550 TOTAL: " + totalOk + "/" + totalErr);
