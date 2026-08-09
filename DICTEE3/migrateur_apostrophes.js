#!/usr/bin/env node
/* MIGRATEUR DE SNAPSHOTS — passage au découpage « apostrophes et guillemets jetons ».
 * Conscience n°5, chantier MJPC 6 — 09/08/2026 (mission DICTEE3).
 *
 * Usage :
 *   node migrateur_apostrophes.js <snapshot.json> <html_ANCIEN> <html_NOUVEAU> <sortie.json>
 *
 * Principes :
 *  - Les DEUX règles de découpage sont extraites VERBATIM des fichiers fournis
 *    (production actuelle = ancienne règle ; livraison DICTEE3 = nouvelle) et
 *    exécutées telles quelles. Aucune tokenisation n'est réécrite ici.
 *  - Translation par PLAGES DE CARACTÈRES : chaque jeton couvre une plage du
 *    texte ; un idx ancien est envoyé sur le jeton nouveau qui couvre son
 *    caractère de départ. Déterministe, monotone — JAMAIS de recherche
 *    d'occurrence (le brevet 4e contient quatre « caddie »).
 *  - L'EXIGENCE DE PAUL : une position migrée doit être celle qu'il aurait
 *    cliquée lui-même. Donc :
 *      · cible identique après re-découpage → migrée, vérifiée
 *        tokens[idx] === word à l'identique ;
 *      · word = apostrophe seule (M/P posés sur « ' ») → migré ET vérifié :
 *        le jeton d'arrivée est exactement l'apostrophe ;
 *      · word = mot entier contenant une apostrophe (« s'approchèrent »,
 *        « qu' »…) → le jeton n'existe plus : ON NE DEVINE PAS. Position
 *        laissée telle quelle, SIGNALÉE avec les jetons candidats — Paul
 *        tranchera (la faute portait-elle sur l'élision ou sur le mot ?).
 *      · autres M/P (word absent du texte) → position d'insertion translatée,
 *        listée une à une.
 *  - SEUL `idx` change — prouvé par comparaison structurelle.
 */
"use strict";
const fs = require("fs");
function mourir(m){ console.error("ERREUR : " + m); process.exit(1); }

function chargerTokenize(chemin){
  const src = fs.readFileSync(chemin, "utf8");
  const m = src.match(/function tokenize\(text\)\{.*?\}return t\}/s);
  if (!m) mourir("tokenize introuvable dans " + chemin);
  return new Function(m[0] + "; return tokenize;")();
}
function offsets(texte, jetons){
  const out = []; let cur = 0;
  for (const j of jetons){
    const p = texte.indexOf(j, cur);
    if (p < 0) return null;
    out.push({ debut: p, fin: p + j.length }); cur = p + j.length;
  }
  return out;
}

const [, , snapPath, htmlAncien, htmlNouveau, outPath] = process.argv;
if (!outPath) mourir("usage : <snapshot> <html_ancien> <html_nouveau> <sortie>");

const tokA = chargerTokenize(htmlAncien);
const tokN = chargerTokenize(htmlNouveau);
const brut = fs.readFileSync(snapPath, "utf8");
const snap = JSON.parse(brut);
const original = JSON.parse(brut);
const data = snap.data || snap;
const texte = (data.config || {}).text || "";
const anciens = tokA(texte), nouveaux = tokN(texte);
const offA = offsets(texte, anciens), offN = offsets(texte, nouveaux);
if (!offA || !offN) mourir("jetons non réalignables sur le texte");
const map = offA.map(oa => {
  for (let j = 0; j < offN.length; j++)
    if (oa.debut >= offN[j].debut && oa.debut < offN[j].fin) return j;
  return null;
});
const estApos = w => /^['\u2019]$/.test(w);
const aApos = w => /['\u2019]/.test(w || "");

const R = { fichier: snapPath.split("/").pop(),
            jetonsAvant: anciens.length, jetonsApres: nouveaux.length,
            idxModifies: 0, migreesVerifiees: 0, dejaJustes: 0,
            mp: [], arbitrages: [], horsTexte: [] };
let avantOk = 0, avantTot = 0;

for (const el of Object.keys(data.results || {}).sort()){
  (data.results[el].errors || []).forEach(e => {
    if (!e || e.idx == null) return;
    const motDuTexte = e.type !== "M" && e.type !== "P";
    if (motDuTexte){ avantTot++; if (anciens[e.idx] === e.word) avantOk++; }
    const cible = (e.idx >= 0 && e.idx < map.length) ? map[e.idx]
                : (e.idx === map.length ? nouveaux.length : null);
    if (cible == null){
      R.horsTexte.push({ eleve: el, idx: e.idx, type: e.type, word: e.word });
      return;
    }
    if (motDuTexte){
      if (nouveaux[cible] === e.word){                       // cible intacte : migrée et vérifiée
        if (e.idx !== cible){ e.idx = cible; R.idxModifies++; }
        R.migreesVerifiees++;
        return;
      }
      if (aApos(e.word)){                                    // mot entier avec apostrophe : arbitrage
        R.arbitrages.push({ eleve: el, idx: e.idx, type: e.type, word: e.word,
          jetonsCandidats: nouveaux.slice(cible, cible + 3),
          positionCandidate: cible,
          note: "le jeton d'origine n'existe plus tel quel : la faute portait-elle sur l'élision ou sur le mot ?" });
        return;                                              // idx laissé tel quel
      }
      R.arbitrages.push({ eleve: el, idx: e.idx, type: e.type, word: e.word,
        jetonsCandidats: nouveaux.slice(cible, cible + 2), positionCandidate: cible,
        note: "cible non retrouvée à l'identique" });
      return;
    }
    /* M / P — position d'insertion */
    if (estApos(e.word)){
      // un manquant posé SUR l'apostrophe : vérifiable puisque l'apostrophe est un jeton
      if (nouveaux[cible] === e.word || (nouveaux[cible] && estApos(nouveaux[cible]))){
        if (e.idx !== cible){ e.idx = cible; R.idxModifies++; }
        R.mp.push({ eleve: el, type: e.type, word: e.word, de: original ? undefined : 0, vers: cible, verifie: "jeton apostrophe \u00e0 l'arriv\u00e9e" });
      } else {
        R.arbitrages.push({ eleve: el, idx: e.idx, type: e.type, word: e.word,
          jetonsCandidats: nouveaux.slice(Math.max(0, cible - 1), cible + 2), positionCandidate: cible,
          note: "manquant sur apostrophe : le jeton d'arriv\u00e9e n'est pas une apostrophe" });
      }
      return;
    }
    if (e.idx !== cible){
      R.mp.push({ eleve: el, type: e.type, word: e.word, de: e.idx, vers: cible });
      e.idx = cible; R.idxModifies++;
    }
  });
}

R.avant = avantOk + "/" + avantTot + " (sous l'ancien d\u00e9coupage)";
let apOk = 0, apTot = 0;
for (const el of Object.keys(data.results || {}))
  for (const e of (data.results[el].errors || []))
    if (e && e.idx != null && e.type !== "M" && e.type !== "P"){ apTot++; if (nouveaux[e.idx] === e.word) apOk++; }
R.apres = apOk + "/" + apTot + " (sous le nouveau d\u00e9coupage ; l'\u00e9cart = les arbitrages)";

const diffs = [];
(function cmp(a, b, ch){
  if (a === b) return;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object"){ diffs.push(ch); return; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) cmp(a[k], b[k], ch + "/" + k);
})(original, snap, "");
R.champsModifies = diffs.length;
R.champsHorsIdx = diffs.filter(c => !/\/errors\/\d+\/idx$/.test(c));

fs.writeFileSync(outPath, JSON.stringify(snap, null, 2));
R.sortie = outPath;
console.log(JSON.stringify(R, null, 2));
