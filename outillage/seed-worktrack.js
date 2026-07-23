#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   outillage/seed-worktrack.js — RÉGÉNÉRATION DU SEED de worktrack.html
   Écosystème MJPC — monsieurjaipascompris.com — Paul Meney

   RÈGLE (doctrine S0-⑥) : le seed embarqué (`let CHAPTER = {…};`) n'est JAMAIS
   écrit à la main. Il est la copie exacte du chapitre canonique tel qu'il vit
   au hub (plan_de_travail/chapitres/<id>). Ce script fait cette copie.

   Usage :
     node outillage/seed-worktrack.js [fichier.html] [idChapitre]
     — fichier.html : worktrack.html ou worktrack.staging.html (défaut : worktrack.html)
     — idChapitre   : défaut ch07

   Ce qu'il fait :
     1. GET https://mjpc-hub…/plan_de_travail/chapitres/<id>.json (lecture seule)
     2. Remplace le bloc entre les marqueurs SEED-BEGIN / SEED-END du fichier
        par `let CHAPTER = <JSON indenté 2>;` — rien d'autre n'est touché.
     3. Affiche l'empreinte (octets, md5) avant/après pour le rapport.

   Le script REFUSE d'écrire si : le hub ne répond pas, le JSON est vide,
   ou les marqueurs sont absents/multiples. Aucune écriture réseau, jamais.
   ═══════════════════════════════════════════════════════════════════════════ */
"use strict";
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");

const FICHIER = process.argv[2] || "worktrack.html";
const CHAP_ID = process.argv[3] || "ch07";
const HUB = "https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app";
const URL = HUB + "/plan_de_travail/chapitres/" + CHAP_ID + ".json";
const BEGIN = "/* SEED-BEGIN — généré par outillage/seed-worktrack.js — ne pas éditer à la main */";
const END = "/* SEED-END */";

function md5(s) { return crypto.createHash("md5").update(s).digest("hex"); }

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, r => {
      if (r.statusCode !== 200) { rej(new Error("HTTP " + r.statusCode + " sur " + url)); return; }
      let b = "";
      r.on("data", c => b += c);
      r.on("end", () => res(b));
    }).on("error", rej);
  });
}

(async () => {
  console.log("[seed] lecture du hub : " + URL);
  const brut = await get(URL);
  let chap;
  try { chap = JSON.parse(brut); } catch (e) { throw new Error("JSON du hub illisible : " + e.message); }
  if (!chap || typeof chap !== "object" || !chap.meta || chap.meta.id !== CHAP_ID)
    throw new Error("Chapitre " + CHAP_ID + " absent ou invalide au hub — REFUS d'écrire.");
  console.log("[seed] chapitre reçu : " + (chap.meta.titre || "?") + " · niveau " + (chap.meta.niveau || "?") +
    " · version " + (chap.version || "?") + " · " + Buffer.byteLength(brut) + " o · md5 " + md5(brut).slice(0, 12));

  const src = fs.readFileSync(FICHIER, "utf8");
  const avant = { o: Buffer.byteLength(src), md5: md5(src) };
  const iB = src.indexOf(BEGIN), iE = src.indexOf(END);
  if (iB < 0 || iE < 0 || iE < iB) throw new Error("Marqueurs SEED-BEGIN/SEED-END absents ou inversés — REFUS.");
  if (src.indexOf(BEGIN, iB + 1) >= 0 || src.indexOf(END, iE + 1) >= 0) throw new Error("Marqueurs multiples — REFUS.");

  const bloc = BEGIN + "\nlet CHAPTER = " + JSON.stringify(chap, null, 2) + ";\n" + END;
  const out = src.slice(0, iB) + bloc + src.slice(iE + END.length);
  fs.writeFileSync(FICHIER, out);
  const apres = { o: Buffer.byteLength(out), md5: md5(out) };
  console.log("[seed] " + FICHIER + " : " + avant.o + " o (" + avant.md5.slice(0, 12) + ") → " +
    apres.o + " o (" + apres.md5.slice(0, 12) + ")");
  console.log("[seed] fait — le seed est la copie exacte du hub (" + CHAP_ID + ", version " + (chap.version || "?") + ").");
})().catch(e => { console.error("[seed] ÉCHEC : " + e.message); process.exit(1); });
