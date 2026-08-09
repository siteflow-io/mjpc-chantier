#!/usr/bin/env node
/* CORRECTEUR DE SNAPSHOTS — remet les positions d'erreur (idx) en place.
 * Conscience n°5, chantier MJPC 6 — 09/08/2026.
 *
 * Usage :
 *   node correcteur_snapshots.js --analyse  <snapshot.json> <correction_dictee.html>
 *   node correcteur_snapshots.js --corriger <snapshot.json> <correction_dictee.html> <sortie.json> [--strict]
 *
 * LE MODÈLE (établi par mesure, voir rapport.md) :
 * Le décalage n'est pas constant : il évolue EN PALIERS le long du texte —
 * signature d'une TRANSLATION entre deux découpages. Chaque dictée fautive a
 * été corrigée sous une ancienne tokenisation ; à chaque site où l'ancienne
 * découpait différemment de l'actuelle (apostrophes d'élision), le décalage
 * change d'un cran. Un décalage constant unique ne peut pas corriger cela ;
 * la translation par positions de caractères le corrige exactement.
 *
 * LA MÉTHODE, dictée par dictée :
 *  1. `tokenize` actuel : EXTRAIT VERBATIM du fichier de production fourni,
 *     exécuté tel quel (jamais réécrit).
 *  2. On identifie l'ANCIENNE tokenisation parmi des candidates plausibles :
 *     elle doit remettre 100 % des erreurs-mots en place (ancien[idx]===word).
 *     En dessous de 100 %, la dictée n'est PAS corrigée (consigne : dans le
 *     doute, ne rien réinjecter de faux).
 *  3. Translation : chaque jeton couvre une plage de caractères du texte ;
 *     l'idx ancien est envoyé sur le jeton ACTUEL qui couvre le caractère de
 *     départ du jeton ancien. Déterministe, monotone — AUCUNE recherche
 *     d'occurrence de mot (piège des mots répétés : « caddie » ×4).
 *  4. Vérification finale, position par position : actuel[idx_corrigé]===word
 *     à l'identique, sinon la position est SIGNALÉE et non corrigée.
 *     Cas particulier déclaré : mots élidés dont le jeton actuel porte
 *     l'apostrophe (« qu » → jeton « qu' ») — position certaine par
 *     construction, égalité stricte impossible par nature. Corrigés et listés
 *     nominativement, sauf en mode --strict où ils sont seulement signalés.
 *  5. M et P (mot/ponctuation manquants) : `word` absent du texte par nature.
 *     Leur position d'insertion suit la même translation ; ils sont listés un
 *     par un au rapport (aucune vérification par mot n'est possible).
 *  6. SEUL `idx` change — prouvé par comparaison structurelle entrée/sortie.
 *     Une dictée sans aucune correction ressort À L'OCTET PRÈS.
 */
"use strict";
const fs = require("fs");

function mourir(msg) { console.error("ERREUR : " + msg); process.exit(1); }

/* ── 1. tokenize actuel : verbatim depuis la production ── */
function chargerTokenize(cheminHtml) {
  const src = fs.readFileSync(cheminHtml, "utf8");
  const m = src.match(/function tokenize\(text\)\{.*?\}return t\}/s);
  if (!m) mourir("fonction tokenize introuvable dans " + cheminHtml);
  return new Function(m[0] + "; return tokenize;")();
}

/* Positions de caractères des jetons : dérivées SANS réécrire la règle —
 * chaque jeton (produit par la fonction fournie) est retrouvé dans le texte
 * à partir d'un curseur ; les jetons couvrent le texte dans l'ordre. */
function offsets(texte, jetons) {
  const out = []; let cur = 0;
  for (const j of jetons) {
    const p = texte.indexOf(j, cur);
    if (p < 0) return null; // incohérence : cette liste de jetons ne colle pas au texte
    out.push({ debut: p, fin: p + j.length }); cur = p + j.length;
  }
  return out;
}

/* ── 2. anciennes tokenisations candidates ──
 * (reconstitutions : l'ancien code n'existe plus — c'est l'objet de l'outil).
 * PONCT : la même classe de ponctuation que la production. */
const PONCT = ".,;:!?\u2026\u00ab\u00bb\u201c\u201d()\\-\u2013\u2014";
const CANDIDATES = {
  // apostrophe = jeton à part entière (« s'approchèrent » → « s », « ' », « approchèrent »)
  "apostrophe-separee": t => {
    const o = []; const re = new RegExp("(\\s+)|([" + PONCT + "]+)|(['\u2019])|([^\\s" + PONCT + "'\u2019]+)", "g");
    let m; while ((m = re.exec(t)) !== null) { if (!m[1]) o.push(m[2] || m[3] || m[4]); } return o;
  },
  // apostrophe collée au mot entier (« s'approchèrent » → un seul jeton)
  "apostrophe-collee": t => {
    const o = []; const re = new RegExp("(\\s+)|([" + PONCT + "]+)|([^\\s" + PONCT + "]+)", "g");
    let m; while ((m = re.exec(t)) !== null) { if (!m[1]) o.push(m[2] || m[3]); } return o;
  },
  // ponctuations consécutives séparées caractère par caractère
  "ponctuation-separee": t => {
    const o = []; const re = new RegExp("(\\s+)|([" + PONCT + "])|([^\\s" + PONCT + "'\u2019]+['\u2019]?)", "g");
    let m; while ((m = re.exec(t)) !== null) { if (!m[1]) o.push(m[2] || m[3]); } return o;
  }
};

/* ── erreurs à plat ── */
function collecter(data) {
  const out = []; const res = data.results || {};
  for (const el of Object.keys(res).sort()) {
    (res[el].errors || []).forEach((e, i) => {
      if (e && e.idx != null) out.push({ eleve: el, i, e });
    });
  }
  return out;
}
const estMot = e => e.type !== "M" && e.type !== "P";

/* ── main ── */
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const [mode, snapPath, htmlPath, outPath] = args.filter(a => a !== "--strict");
if (!mode || !snapPath || !htmlPath) mourir("usage : --analyse|--corriger <snapshot> <correction_dictee.html> [sortie] [--strict]");

const tokenize = chargerTokenize(htmlPath);
const brut = fs.readFileSync(snapPath, "utf8");
const snap = JSON.parse(brut);
const data = snap.data || snap;
const texte = (data.config || {}).text || "";
const actuels = tokenize(texte);
const offActuels = offsets(texte, actuels);
if (!offActuels) mourir("les jetons actuels ne se réalignent pas sur le texte");

const erreurs = collecter(data);
const mots = erreurs.filter(x => estMot(x.e));
const exactActuel = mots.filter(x => actuels[x.e.idx] === x.e.word).length;

const R = { fichier: snapPath.split("/").pop(), jetonsActuels: actuels.length,
            avant: exactActuel + "/" + mots.length };

/* déjà exacte → rien à faire */
let variante = null, anciens = null;
if (exactActuel === mots.length) {
  R.verdict = "positions déjà exactes sous la tokenisation actuelle — aucune correction";
} else {
  /* identifier l'ancienne tokenisation : 100 % exigé */
  for (const [nom, fn] of Object.entries(CANDIDATES)) {
    const tk = fn(texte);
    const ok = mots.filter(x => tk[x.e.idx] === x.e.word).length;
    R["candidate " + nom] = ok + "/" + mots.length;
    if (ok === mots.length && !variante) { variante = nom; anciens = tk; }
  }
  R.verdict = variante
    ? "ancienne tokenisation identifiée : « " + variante + " » (100 % des mots en place)"
    : "AUCUNE candidate à 100 % — dictée NON corrigée (consigne : ne rien réinjecter d'incertain)";
}

if (mode === "--analyse") { console.log(JSON.stringify(R, null, 2)); process.exit(0); }
if (!outPath) mourir("chemin de sortie manquant");

const original = JSON.parse(brut);
let nbIdx = 0;
R.corrigees = 0; R.dejaJustes = exactActuel;
R.apostrophes = []; R.mp = []; R.nonCorrigees = [];

if (variante) {
  const offAnciens = offsets(texte, anciens);
  if (!offAnciens) mourir("les jetons anciens ne se réalignent pas sur le texte");
  /* translation par caractère de départ */
  const map = offAnciens.map(oa => {
    for (let j = 0; j < offActuels.length; j++)
      if (oa.debut >= offActuels[j].debut && oa.debut < offActuels[j].fin) return j;
    return null;
  });
  const sansApo = s => String(s).replace(/['\u2019]$/, "");

  for (const x of erreurs) {
    const e = x.e, idx = e.idx;
    if (estMot(x.e)) {
      if (actuels[idx] === e.word) continue;                      // déjà juste
      const cible = (idx >= 0 && idx < map.length) ? map[idx] : null;
      if (cible == null) {
        R.nonCorrigees.push({ eleve: x.eleve, idx, type: e.type, attendu: e.word, jetonTrouve: "(hors texte)" });
      } else if (actuels[cible] === e.word) {                     // vérifié à l'identique
        e.idx = cible; nbIdx++; R.corrigees++;
      } else if (!strict && sansApo(actuels[cible]) === sansApo(e.word) && sansApo(e.word) !== "") {
        e.idx = cible; nbIdx++;                                   // mot élidé : jeton actuel avec apostrophe
        R.apostrophes.push({ eleve: x.eleve, de: idx, vers: cible, attendu: e.word, jetonActuel: actuels[cible] });
      } else {
        R.nonCorrigees.push({ eleve: x.eleve, idx, type: e.type, attendu: e.word,
          jetonTrouve: actuels[cible] !== undefined ? actuels[cible] : "(hors texte)",
          /* position que la translation propose, pour traitement manuel : le mot
             attendu (élision entière) est aujourd'hui découpé en plusieurs jetons */
          positionProposee: cible,
          jetonSuivant: actuels[cible + 1] !== undefined ? actuels[cible + 1] : "" });
      }
    } else {
      /* M / P : position d'insertion translatée, listée, jamais vérifiable par mot */
      const cible = (idx >= 0 && idx < map.length) ? map[idx] : (idx === map.length ? offActuels.length : null);
      if (cible != null && cible !== idx) {
        e.idx = cible; nbIdx++;
        R.mp.push({ eleve: x.eleve, type: e.type, de: idx, vers: cible });
      } else if (cible == null) {
        R.mp.push({ eleve: x.eleve, type: e.type, de: idx, vers: "(hors texte — intouché)" });
      }
    }
  }
}

const apres = collecter(data).filter(x => estMot(x.e));
R.apres = apres.filter(x => actuels[x.e.idx] === x.e.word).length + "/" + apres.length;
R.idxModifies = nbIdx;

/* preuve : seuls des champs .../errors/N/idx diffèrent */
const diffs = [];
(function cmp(a, b, ch) {
  if (a === b) return;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") { diffs.push(ch); return; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) cmp(a[k], b[k], ch + "/" + k);
})(original, snap, "");
R.champsModifies = diffs.length;
R.champsHorsIdx = diffs.filter(c => !/\/errors\/\d+\/idx$/.test(c));

if (nbIdx === 0) {
  fs.copyFileSync(snapPath, outPath);
  R.sortie = outPath + " (copie À L'OCTET PRÈS du fichier d'entrée — aucune correction)";
} else {
  fs.writeFileSync(outPath, JSON.stringify(snap, null, 2));
  R.sortie = outPath;
}
console.log(JSON.stringify(R, null, 2));
