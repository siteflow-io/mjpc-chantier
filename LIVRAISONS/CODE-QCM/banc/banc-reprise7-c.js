// QCM-4 · BANC — la reprise 7 (DEFAUTS-OUVERTS, « Reprise 7 du 13/10, complétée le 15/10 », point 4), points 8, 9 et 10, rejoués par le geste :
//  A. le soir de la maquette v4 de « 📄 Lire les copies » (base-faux-hub-soir.json de la maquette, sur main), geste par geste comme son capture.js :
//     Tom « ✏️ Autre chose », Rome (la note en direct, la question sur Léa), « ⛔ Oui » puis « ↩️ Rendre » (lus dans la base) ; Théo « ✅ Oui »
//     (la question sur Théo), « Non » (lu dans la base) ; un rechargement : « 🧮 Ce soir » (soir/depart) et le « Non » tiennent ; Michel « ↩️ Rendre » ;
//     pas de « Sors du tas » ; les lignes du point 8 dans « Lire les copies », le tableau de la séance et la fiche (Tom, Théo, Michel, Noah).
//  B. une séance jouée sur deux tablettes (quatre élèves de 3 ESSAI), avec une évaluation dont un choix fait plus de 60 caractères et une question
//     à deux bonnes réponses : la question de l'élève à la fin de son temps (point 9), puis une ligne « à lire » de chaque sorte (point 8),
//     dans « 📌 À lire sur les feuilles, ce soir » de la console, puis le soir dans le tableau de la séance et la fiche de l'élève.
//   APP_FILE=<app> BANC=<faux hub> node banc/banc-reprise7-c.js <dossier de sortie>   → <sortie>/reprise7-c.txt, <sortie>/captures-reprise7-c/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, norm, texte, zoneTexte, cliquer, choisir, taper, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise7-c-" + Date.now()));
const CAP = path.join(SORTIE, "captures-reprise7-c"); fs.mkdirSync(CAP, {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H3 = "QCM-3 · SOIR", H31 = H3 + ", " + H1, H13 = H1 + ", " + H3, BANC = "QCM-4 · BANC";
const t0 = Date.now();
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return f; };
let A1 = null, A2 = null, srv1 = null, srv2 = null;

// ── la sortie : écrite à la fin, ou au plafond de 7 minutes (un banc partiel vaut mieux que rien) ──
let ecrit = false;
function ecrire(fin){
  if(ecrit) return; ecrit = true;
  const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + (fin ? " · " + fin : "") + "\n" + J.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(e){}
  fs.writeFileSync(path.join(SORTIE, "reprise7-c.txt"), "Reprise 7, points 8, 9, 10, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
  console.log(out);
}
setTimeout(async () => { J.v(false, BANC, "plafond de 7 minutes atteint : le banc s'arrête là", J.partie); ecrire("arrêté au plafond de 7 minutes");
  try { if(A1) await A1.fermer(); if(A2) await A2.fermer(); } catch(e){} process.exit(0); }, 7 * 60 * 1000).unref();

// ── outils de ce banc ──
const MAQ = "MANDATS/MAQUETTE-QCM-LIRE-COPIES-13-10/";
function depuisMain(f){ // la base du soir de la maquette, lue sur origin/main (sinon une copie dans banc/donnees/)
  try { return cp.execSync("git show origin/main:" + MAQ + f, {cwd: O.RACINE, maxBuffer: 1 << 26}).toString(); }
  catch(e){ return fs.readFileSync(path.join(__dirname, "donnees", f)).toString(); }
}
// les lignes « à lire » : la phrase, puis le morceau de texte qui la suit jusqu'à la phrase suivante
const PHRASES = /n'a pas dit s(?:'il|i elle) avait|dit avoir bien écrit sa réponse sur sa feuille|dit avoir écrit autre chose sur sa feuille|n'a lu aucun des choix sur la feuille|pense qu(?:e |')\S+ a (?:peut-être )?mal lu|a dit que sa feuille|n'a pas dit si sa feuille|aucun de ces choix|Question \d+ ·|\bQ\d+ :/g;
function bloc(t, phrase){
  const i = t.indexOf(phrase); if(i < 0) return null;
  const reste = t.slice(i + phrase.length); PHRASES.lastIndex = 0; let m, fin = Math.min(reste.length, 700);
  while((m = PHRASES.exec(reste))){ if(m.index > 0){ fin = Math.min(fin, m.index); break; } }
  return reste.slice(0, fin);
}
const nb = (t, s) => t.split(s).length - 1;
// vérifier une ligne « à lire » : la phrase exacte, ses lignes dessous (dans l'ordre), la réponse en entier, une seule fois quand c'est la même
function verifLigne(t, proprio, ou, phrase, lignes, interdit, sansCompte){
  const b = bloc(t, phrase);
  if(!J.v(b !== null, proprio, ou + " : « " + phrase + " »", extrait(t, phrase))) return;
  let pos = 0, ok = true, manque = [];
  for(const l of lignes){ const k = b.indexOf(l, pos); if(k < 0){ ok = false; manque.push(l); } else pos = k + l.length; }
  J.v(ok, proprio, ou + " : sous la phrase, " + (lignes.length ? lignes.map(l => "« " + l + " »").join(", ") : "aucune ligne"), "manque " + manque.join(" | ") + " · vu : " + b.slice(0, 300));
  if(!sansCompte && ok) for(const [s, fois] of (interdit || [])) J.v(nb(b, s) === fois, proprio, ou + " : « " + s.slice(0, 50) + (s.length > 50 ? "…" : "") + " » " + (fois ? fois + " fois" : "absent") + " sous la phrase", nb(b, s) + " fois · vu : " + b.slice(0, 300));
}
function extrait(t, phrase){ const mots = phrase.split(" ").slice(0, 2).join(" "); const i = t.indexOf(mots); return i < 0 ? "(introuvable ; début : " + t.slice(0, 250) + ")" : t.slice(Math.max(0, i - 60), i + 260); }
// clic à la manière de capture.js (avec .lire-prop), sinon celui des outils
async function clic(p, re, zone){
  const ok = await p.evaluate(([s, f]) => { const r = new RegExp(s, f); const t = e => (e.textContent || "").replace(/[  ]/g, " ").replace(/\s+/g, " ").trim();
    const b = [...document.querySelectorAll("button, a, [role=button], [data-va], .lire-prop, label")].filter(e => e.getBoundingClientRect().width > 0 && !e.disabled && r.test(t(e))).sort((a, b) => t(a).length - t(b).length)[0];
    if(!b) return false; document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return true; }, [re.source, re.flags]).catch(() => false);
  if(ok){ await p.click("[data-c='1']", {timeout: 3000}).catch(() => {}); await pause(900); return true; }
  return cliquer(p, re, zone, {apres: 900});
}
async function initiales(p, t){ const ok = await p.click("[data-initiales='1']", {timeout: 2000}).then(() => true).catch(() => false); if(!ok) return false; await p.keyboard.type(t, {delay: 60}); await pause(500); await p.keyboard.press("Enter"); await pause(1000); return true; }
// l'écran « Lire les copies » (data-lire-copies, comme la maquette) ; à défaut, la page seulement si elle montre cet écran
const lc = async p => norm(await p.evaluate(() => { const e = document.querySelector("[data-lire-copies]"); if(e) return e.innerText; const t = document.body.innerText; return /tape ses initiales|La copie dit-elle/.test(t) ? t : ""; }).catch(() => ""));
// Données → Résultats → « 📊 Ouvrir » de la séance dont la page montre ce qu'on cherche
async function ouvrirSeance(p, titre){
  for(let i = 0; i < 6; i++){
    await clic(p, /^Données$/); await clic(p, /Résultats/);
    const ok = await p.evaluate(([titre, i]) => { const bs = [...document.querySelectorAll("button, [data-va]")].filter(b => b.getBoundingClientRect().width > 0 && /📊 Ouvrir/.test(b.textContent));
      const lig = b => { let e = b; for(let k = 0; k < 6 && e; k++){ if(e.tagName === "TR" || (e.innerText || "").length > 30) return e.innerText || ""; e = e.parentElement; } return ""; };
      const bons = bs.filter(b => !titre || lig(b).includes(titre)); const b = (bons.length ? bons : bs)[bons.length ? 0 : i]; if(!b) return false;
      document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return bons.length ? "titre" : true; }, [titre, i]).catch(() => false);
    if(!ok) return false;
    await p.click("[data-c='1']", {timeout: 3000}).catch(() => {}); await pause(1200);
    if(ok === "titre") return true;
    if(/Lire les copies|À lire sur la feuille/.test(await texte(p)) && (!titre || (await texte(p)).includes(titre))) return true;
  }
  return false;
}
async function cellule(p, sl){ return norm(await p.evaluate(sl => { const tr = document.querySelector("tr[data-eleve='" + sl + "']"); if(!tr) return null; const c = tr.querySelector(".alire-cell"); return (c || tr).innerText; }, sl).catch(() => null) || ""); }

(async () => {
  try {
  // ════════════ A. Le soir de la maquette v4 ════════════
  const BASE = JSON.parse(depuisMain("base-faux-hub-soir.json"));
  const SID = "sess_1791877316846";
  const h1 = await O.fauxHub(B => { B.tree.qcm = Object.assign({}, B.tree.qcm, BASE); });
  srv1 = h1.srv; const get1 = p => srv1.store.get("qcm/sessions/" + SID + (p ? "/" + p : ""));
  A1 = new O.Appareils(h1.srv, h1.port); await A1.demarrer();
  const p = await A1.ouvrir("console-soir", "?mode=prof", 1536, 864); await pause(1300);
  let sors = [];
  const pasSors = async (ou) => { const t = await texte(p); if(/Sors du tas/.test(t)) sors.push(ou); };

  J.section("A1. Le tableau de la séance et la fiche, avant « Lire les copies » : les lignes du point 8 (le soir de la maquette)");
  const ouvert = await ouvrirSeance(p, "");
  const tab = await texte(p); await capt(p, "a-tableau");
  J.v(ouvert && /À lire sur la feuille/.test(tab), BANC, "Données → Résultats → « 📊 Ouvrir » : le tableau de la séance 3 ESSAI", tab.slice(0, 200));
  verifLigne(await cellule(p, "carre_tom"), H31, "tableau, Tom, Q1", "Tom n'a pas dit s'il avait bien écrit sa réponse sur sa feuille.", ["Tablette et lecture de Léa : « Venise »"], [["« Venise »", 1]]);
  verifLigne(await cellule(p, "chevallier_theo"), H31, "tableau, Théo, Q2", "Théo dit avoir bien écrit sa réponse sur sa feuille ; Lou y a lu autre chose.", ["Tablette : « Madrid »", "Lu par Lou : « Sydney »"]);
  verifLigne(await cellule(p, "duvernay_michel"), H31, "tableau, Michel, Q3", "Julien n'a lu aucun des choix sur la feuille de Michel.", [], [["Tablette", 0]]);
  const cNoah = await cellule(p, "maillard_noah");
  J.v(/Noah pense qu(e |')Emma a peut-être mal lu sa feuille\./.test(cNoah), H31, "tableau, Noah, Q3 : « Noah pense qu'Emma a peut-être mal lu sa feuille. »", cNoah.slice(0, 250));
  const bt = (tab.match(/📄 Lire les copies \((\d+)\)/) || [])[1];
  J.v(!!bt, H3, "le bouton « 📄 Lire les copies (n) » dans le tableau de la séance", (tab.match(/📊[^\n]*\n[^\n]*/) || [""])[0] + " · " + tab.slice(0, 300));
  // la fiche de Théo (clic sur son nom)
  if(await clic(p, /^CHEVALLIER Théo$/)){
    const f = await texte(p); await capt(p, "a-fiche-theo");
    verifLigne(f, H31, "fiche de Théo", "Théo dit avoir bien écrit sa réponse sur sa feuille ; Lou y a lu autre chose.", ["Tablette : « Madrid »", "Lu par Lou : « Sydney »"]);
    await clic(p, /✕ Fermer/);
  } else J.v(false, BANC, "le nom de Théo s'ouvre dans le tableau (sa fiche)", tab.slice(0, 200));
  await pasSors("tableau");

  if(!bt){ J.section("A2 à A6. « 📄 Lire les copies » : non jouées");
    J.v(false, H31, "A2 à A6 (Tom, Léa, Théo, le rechargement, Michel, « Sors du tas ») non jouées : pas de « 📄 Lire les copies (n) » dans le tableau de la séance", "voir la capture a-tableau");
    throw "sans-lire"; }
  J.section("A2. « 📄 Lire les copies » : Tom (CT), « ✏️ Autre chose », Rome");
  if(!(await clic(p, /📄 Lire les copies/))){ await ouvrirSeance(p, ""); await clic(p, /📄 Lire les copies/); }
  let t = await lc(p); await capt(p, "a-debut");
  J.v(/Prends la première copie de ton tas et tape ses initiales/.test(t), H3, "« Lire les copies » : « Prends la première copie de ton tas et tape ses initiales »", t.slice(0, 250));
  const dep0 = get1("soir");
  J.v(!!(dep0 && dep0.depart), H1, "à la première ouverture, le point de départ s'enregistre (sessions/<id>/soir/depart)", JSON.stringify(dep0 || null).slice(0, 200));
  await pasSors("début");
  await initiales(p, "aj"); t = await lc(p); await capt(p, "a-abrial-rien");
  J.v(/📄 ABRIAL Julien/.test(t) && /Rien à lire sur cette copie : mets-la de côté\./.test(t), H3, "« aj », Entrée : ABRIAL Julien, « Rien à lire sur cette copie : mets-la de côté. »", t.slice(0, 300));
  await initiales(p, "ct"); t = await lc(p); await capt(p, "a-carre-tom");
  J.v(/📄 CARRÉ Tom/.test(t) && /La copie dit-elle « Venise » \?/.test(t), H3, "« ct », Entrée : CARRÉ Tom, « La copie dit-elle « Venise » ? »", t.slice(0, 300));
  J.v(/🤝 Tom a son point d'autonomie\./.test(t), H3, "sous le nom : « 🤝 Tom a son point d'autonomie. » et « ⛔ Retirer »", t.slice(0, 300));
  verifLigne(t, H13, "Lire les copies, Tom, Q1 (la ligne grise)", "Tom n'a pas dit s'il avait bien écrit sa réponse sur sa feuille.", ["Tablette et lecture de Léa : « Venise »"]);
  J.v(!/n'a pas dit si sa feuille disait son clic/.test(t), H13, "Lire les copies, Tom : plus l'ancienne phrase « n'a pas dit si sa feuille disait son clic »", (t.match(/[^.]*disait son clic[^.]*/) || [""])[0]);
  J.v(await clic(p, /Autre chose/), H3, "« ✏️ Autre chose »"); J.v(await clic(p, /^Rome$/), H3, "« Rome »"); J.v(await clic(p, /Valider/), H3, "« ✔ Valider »"); await pause(800);
  t = await lc(p); await capt(p, "a-tom-corrige");
  J.v(t.includes("Question 1 : 0 → 1 point (+1)"), H3, "la note en direct : « Question 1 : 0 → 1 point (+1) »", (t.match(/Question 1 :[^\n]{0,60}/g) || []).join(" | ") || t.slice(0, 300));
  J.v(t.includes("✍️ Note : 1 / 3 → 2 / 3 · 6,7 → 13,3 / 20"), H3, "« ✍️ Note : 1 / 3 → 2 / 3 · 6,7 → 13,3 / 20 »", (t.match(/✍️ Note[^\n]*/) || [""])[0]);
  J.v(/sa réponse barrée était juste ; mets un V vert dans la marge/.test(t), H3, "ce que Paul écrit : « sa réponse barrée était juste ; mets un V vert dans la marge »", (t.match(/✍️ Sur la copie[^\n]*/) || [""])[0]);
  J.v(/Léa avait lu « Venise »\.\s*Retirer son point d'autonomie \?/.test(t), H3, "la question sur Léa : « Léa avait lu « Venise ». Retirer son point d'autonomie ? »", (t.match(/[^\n]*avait lu[^\n]*/) || [""])[0] || t.slice(0, 400));
  J.v(/🧮 Ce soir[^\n]*Tom[^\n]*1 \/ 3 → 2 \/ 3/.test(t), H3, "« 🧮 Ce soir » : Tom 1 / 3 → 2 / 3", (t.match(/🧮 Ce soir[^\n]*/) || [""])[0] || "(pas de « 🧮 Ce soir »)");
  await pasSors("Tom corrigé");

  J.section("A3. « ⛔ Oui » (Léa), puis « ↩️ Rendre » : lus dans la base");
  J.v(await clic(p, /^⛔ Oui$/), H3, "« ⛔ Oui »"); await pause(800); t = await lc(p); await capt(p, "a-lea-retire");
  const auL = (get1("autonomie") || {}).baudry_lea, liL = ((get1("aLire/carre_tom_0_b") || {}).autonomie || {}).baudry_lea;
  J.v(!!(auL && auL.retire && auL.quand === "soir"), H1, "base : autonomie/baudry_lea retiré, « soir »", JSON.stringify(auL || null));
  J.v(liL === "retire", H1, "base : aLire/carre_tom_0_b/autonomie/baudry_lea = \"retire\"", JSON.stringify(get1("aLire/carre_tom_0_b") || null).slice(0, 250));
  J.v(/🧮 Ce soir[^\n]*Léa : point d'autonomie retiré/.test(t), H3, "« 🧮 Ce soir » : Léa, point d'autonomie retiré", (t.match(/🧮 Ce soir[^\n]*/) || [""])[0]);
  J.v(await clic(p, /^↩️ Rendre$/), H3, "« ↩️ Rendre » dans la case de la faute de Léa"); await pause(800); t = await lc(p); await capt(p, "a-lea-rendu");
  const auL2 = (get1("autonomie") || {}).baudry_lea;
  J.v(!auL2 || !auL2.retire, H1, "base : après « ↩️ Rendre », plus de autonomie/baudry_lea retiré", JSON.stringify(auL2 || null));
  await pasSors("Léa");

  J.section("A4. Théo (CHEV), « ✅ Oui » : la question sur Théo, puis « Non »");
  await initiales(p, "chev"); t = await lc(p); await capt(p, "a-theo");
  J.v(/📄 CHEVALLIER Théo/.test(t), H3, "« chev », Entrée : CHEVALLIER Théo", t.slice(0, 200));
  verifLigne(t, H13, "Lire les copies, Théo, Q2 (la ligne grise)", "Théo dit avoir bien écrit sa réponse sur sa feuille ; Lou y a lu autre chose.", ["Tablette : « Madrid »", "Lu par Lou : « Sydney »"]);
  J.v(await clic(p, /^✅ Oui$/), H3, "« ✅ Oui »"); await pause(800); t = await lc(p); await capt(p, "a-theo-avait-dit");
  J.v(/Théo avait dit avoir bien écrit « Madrid »\.\s*Retirer son point d'autonomie \?/.test(t), H3, "la question sur Théo : « Théo avait dit avoir bien écrit « Madrid ». Retirer son point d'autonomie ? »", (t.match(/[^\n]*avait dit[^\n]*/) || [""])[0] || t.slice(0, 400));
  J.v(await clic(p, /^Non$/), H3, "« Non »"); await pause(800);
  const liT = ((get1("aLire/chevallier_theo_1_b") || {}).autonomie || {}).chevallier_theo;
  J.v(liT === "garde", H1, "base : aLire/chevallier_theo_1_b/autonomie/chevallier_theo = \"garde\"", JSON.stringify(get1("aLire/chevallier_theo_1_b") || null).slice(0, 250));
  await pasSors("Théo");

  J.section("A5. Un rechargement : « 🧮 Ce soir » et le « Non » tiennent");
  const dep1 = JSON.stringify((get1("soir") || {}).depart || null);
  await p.reload().catch(() => {}); await pause(2500);
  await ouvrirSeance(p, ""); await clic(p, /📄 Lire les copies/); t = await lc(p); await capt(p, "a-recharge");
  J.v(/🧮 Ce soir[^\n]*Tom[^\n]*1 \/ 3 → 2 \/ 3/.test(t), H31, "après le rechargement, « 🧮 Ce soir » garde Tom 1 / 3 → 2 / 3", (t.match(/🧮 Ce soir[^\n]*/) || [""])[0] || "(pas de « 🧮 Ce soir ») " + t.slice(0, 200));
  J.v(dep1 !== "null" && JSON.stringify((get1("soir") || {}).depart || null) === dep1, H1, "le point de départ (soir/depart) n'a pas bougé au rechargement", dep1.slice(0, 120) + " → " + JSON.stringify((get1("soir") || {}).depart || null).slice(0, 120));
  await initiales(p, "chev"); t = await lc(p); await capt(p, "a-theo-apres-recharge");
  J.v(/📄 CHEVALLIER Théo/.test(t) && !/Théo avait dit[^\n]*\s*Retirer son point d'autonomie \?/.test(t), H31, "après le rechargement, la question sur Théo (« Non ») ne revient pas", t.slice(0, 400));
  await pasSors("rechargement");

  J.section("A6. Michel (DM) : « ↩️ Rendre » son point retiré en classe");
  await initiales(p, "dm"); t = await lc(p); await capt(p, "a-michel");
  J.v(/⛔ Point d'autonomie de Michel retiré/.test(t), H3, "sous le nom : « ⛔ Point d'autonomie de Michel retiré … » et « ↩️ Rendre »", t.slice(0, 300));
  verifLigne(t, H13, "Lire les copies, Michel, Q3 (la ligne grise)", "Julien n'a lu aucun des choix sur la feuille de Michel.", [], [["Tablette", 0]]);
  J.v(await clic(p, /^↩️ Rendre$/), H3, "« ↩️ Rendre »"); await pause(800); t = await lc(p); await capt(p, "a-michel-rendu");
  const auM = (get1("autonomie") || {}).duvernay_michel;
  J.v(!auM || !auM.retire, H1, "base : plus de autonomie/duvernay_michel retiré", JSON.stringify(auM || null));
  J.v(/🧮 Ce soir[^\n]*Michel : point d'autonomie rendu/.test(t), H3, "« 🧮 Ce soir » : Michel, point d'autonomie rendu", (t.match(/🧮 Ce soir[^\n]*/) || [""])[0]);
  await pasSors("Michel");
  J.v(!sors.length, H3, "pas de « Sors du tas », à aucun moment", sors.join(", "));
  J.v(!p.__err.length, H3, "aucune erreur de page (le soir)", p.__err.slice(0, 3).join(" | "));
  await A1.fermer(); A1 = null;
  } catch(e){ if(e !== "sans-lire") J.v(false, BANC, "la partie A s'est interrompue : " + e.message); try { if(A1) await A1.fermer(); } catch(x){} A1 = null; }

  // ════════════ B. Une séance : la question de l'élève (9), une ligne de chaque sorte (8) ════════════
  try {
  const L0 = "Parce que la partie éclairée par le Soleil que nous voyons depuis la Terre change chaque soir";
  const L1 = "Parce que l'ombre de la Terre recouvre chaque soir une partie différente de la Lune";
  const EV = {titre: "Reprise 7 — réponses longues", chapitre: "3e-ch1", mode: "strict", questions: [
    {enonce: "Pourquoi la Lune paraît-elle changer de forme au cours du mois ?", choix: [L0, L1, "Parce que la Lune tourne sur elle-même et nous montre une autre face à chaque fois", "Parce que les nuages cachent une partie de la Lune"], bonnes: [0], niveau: "standard", reflexion: 20, reponse: 12, competences: ["c4-culture-01", "c4-lire-01"], verifie: "expliquer les phases de la Lune", explication: "La Lune est toujours à moitié éclairée par le Soleil ; depuis la Terre, on en voit une part qui change au fil du mois.", bonus: false, longueurAssumee: true},
    {enonce: "Lesquelles sont des capitales européennes ?", choix: ["Madrid", "Genève", "Berlin", "Sydney"], bonnes: [0, 2], niveau: "standard", reflexion: 20, reponse: 12, competences: ["c4-culture-01", "c4-lire-01"], verifie: "reconnaître des capitales européennes", explication: "Madrid et Berlin sont des capitales.", bonus: false, longueurAssumee: false},
    {enonce: "Combien de pattes a une araignée ?", choix: ["6", "8", "10", "4"], bonnes: [1], niveau: "facile", reflexion: 20, reponse: 12, competences: ["c4-culture-01", "c4-lire-01"], verifie: "dire combien de pattes a une araignée", explication: "Une araignée a 8 pattes.", bonus: false, longueurAssumee: false}]};
  J.section("B0. Le faux hub : une évaluation dont un choix fait " + L0.length + " caractères, et Q2 à deux bonnes réponses ; 3 ESSAI, deux tablettes");
  const h2 = await O.fauxHub(B => { B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {reprise7c: EV}); });
  srv2 = h2.srv; const B2 = h2.B;
  const codeDe = nm => B2.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B2.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const pre = sl => nomDe(sl).split(" ").slice(1).join(" ");
  A2 = new O.Appareils(srv2, h2.port); await A2.demarrer();
  let dernier = null;
  const sess = () => { const a = srv2.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv2.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : {}; };
  const entrer = (pg, cote, nom) => O.entrer1(pg, cote, nom, codeDe(nom));   // reprise 7, point 13 : l'entrée d'outils.js (l'ancienne et la nouvelle)
  const prof = await A2.ouvrir("console", "?mode=prof", 1536, 864);
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
  await choisir(prof, /3 ESSAI|3e Essai/); await pause(200);
  J.v(await choisir(prof, /Reprise 7 — réponses longues/), BANC, "l'évaluation « Reprise 7 — réponses longues » se choisit au lancement"); await pause(300);
  await cliquer(prof, /Lancer la séance/); await pause(400); await cliquer(prof, /YVON Adam/); await cliquer(prof, /Lancer la séance/); await pause(1200);
  const pl = sess().s.places || {}; const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d})).filter(x => x.g && x.d);
  if(T.length < 2) throw new Error("pas de places (la séance ne s'est pas lancée)");
  const [tA, tC] = T;
  const t1 = await A2.tablette("tablette-1", "3 ESSAI"), t2 = await A2.tablette("tablette-2", "3 ESSAI");
  await cliquer(t1, /2 élèves/); await entrer(t1, "g", nomDe(tA.g)); await entrer(t1, "d", nomDe(tA.d));
  await cliquer(t2, /2 élèves/); await entrer(t2, "g", nomDe(tC.g)); await entrer(t2, "d", nomDe(tC.d));
  // A, B : la tablette 1 (voisins) ; C, D : la tablette 2
  const A = tA.g, Bs = tA.d, C = tC.g, D = tC.d;
  const M = [[t1, "g", A, Bs], [t1, "d", Bs, A], [t2, "g", C, D], [t2, "d", D, C]];   // [page, côté, élève, son voisin]
  for(const [pg, c] of M){ await cocherTout(pg, c); await cliquer(pg, /^Je commence$/, c); }
  await pause(800);
  const CLIC = [[L0], ["Madrid", "Berlin"], ["8"]];
  // la question de la fin du temps : A ne dit rien à Q1 ; B dit « Non » à Q2 ; tous les autres « Oui »
  const DIT = (qi, sl) => qi === 0 && sl === A ? null : qi === 1 && sl === Bs ? "non" : "oui";
  const vuB = {}; let photoB = {};

  J.section("B1. Q1 à Q3 : la question de l'élève à la fin de son temps de réponse (point 9)");
  for(let qi = 0; qi < 3; qi++){
    await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800);
    await cliquer(prof, /Autoriser la réponse/); await pause(2000);
    const fait = new Set(), dit = new Set();
    for(let k = 0; k < 110 && !/close/.test(etat().ph || ""); k++){
      for(const [pg, c, sl] of M){
        const z = await zoneTexte(pg, c);
        const estB = /avais-tu bien écrit|la même chose que ton clic/.test(z);
        if(!estB && !fait.has(sl) && (await O.choixOuverts(pg, c, EV.questions[qi].choix)).length){ for(const x of CLIC[qi]) await cliquer(pg, new RegExp("^" + esc(x) + "$"), c); fait.add(sl); }
        if(estB){
          if(!vuB[qi + ":" + sl]) vuB[qi + ":" + sl] = z;
          if(!photoB[qi] && qi < 2){ photoB[qi] = await capt(pg, "b-question-eleve-q" + (qi + 1)); }
          const d = DIT(qi, sl);
          if(d && !dit.has(sl)){ if(await cliquer(pg, d === "oui" ? /Oui, la même chose/ : /Non, autre chose/, c)) dit.add(sl); }
        }
      }
      if(etat().ph === "reponse" && k > 8 && fait.size >= 4 && k % 5 === 0) await cliquer(prof, /Tour suivant/);
      await pause(350);
    }
    if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
  }
  for(const [qi, txt] of [[0, L0], [1, "Madrid et Berlin"]]){
    for(const sl of [A, Bs, C, D]){
      const z = vuB[qi + ":" + sl] || "", attendu = pre(sl) + ", tu as répondu " + txt + " sur la tablette : avais-tu bien écrit " + txt + " sur ta copie ?";
      J.v(z.replace(/\s+/g, " ").includes(attendu), H2, "Q" + (qi + 1) + ", " + pre(sl) + " : « " + attendu + " »", z ? (z.match(/[^\n]*(avais-tu|même chose que ton clic)[^\n]*/) || [z.slice(0, 250)])[0] : "(la question n'est pas apparue sur sa moitié)");
      if(z){ J.v(/Oui, la même chose/.test(z) && /Non, autre chose/.test(z), H2, "Q" + (qi + 1) + ", " + pre(sl) + " : les boutons « Oui, la même chose » et « Non, autre chose »", z.slice(0, 250));
        J.v(!/dit-elle la même chose que ton clic/.test(z), H2, "Q" + (qi + 1) + ", " + pre(sl) + " : plus « dit-elle la même chose que ton clic »", (z.match(/[^\n]*dit-elle[^\n]*/) || [""])[0]); }
    }
  }
  const bb = sess().s.b || {};
  J.v(!((bb[0] || {})[A]) && (bb[1] || {})[Bs] === "non" && (bb[0] || {})[C] === "oui", BANC, "la base a ce que le banc a fait dire : " + pre(A) + " rien à Q1, " + pre(Bs) + " « Non » à Q2, " + pre(C) + " « Oui » à Q1", JSON.stringify(bb).slice(0, 300));

  J.section("B2. L'estimation, la correction : " + pre(Bs) + " lit sa réponse sur la feuille de " + pre(A) + " (Q1), " + pre(D) + " lit L1 chez " + pre(C) + " (Q1), " + pre(A) + " lit Madrid et Berlin chez " + pre(Bs) + " (Q2), " + pre(C) + " ne lit aucun choix chez " + pre(D) + " (Q2)");
  await cliquer(prof, /Lancer l'autoévaluation/); await pause(800);
  for(const [pg, c] of M) await cliquer(pg, /Maîtrise satisfaisante/, c);
  await cliquer(prof, /Lancer la correction/); await pause(800);
  for(const [pg, c] of M){ await cocherTout(pg, c); await cliquer(pg, /^Je commence la correction$/, c); }
  await pause(1500); await cliquer(prof, /Commencer la correction/); await pause(1500);
  const oc = sess().s.ordreCorr; const ordre = (Array.isArray(oc) ? oc : Object.values(oc || {})).map(Number);
  J.v(ordre.length === 3, BANC, "la correction commence (ordreCorr)", JSON.stringify(oc));
  // à la lecture, la moitié de chaque élève reçoit ce que son voisin lit sur sa feuille (la base : lectures/<qi>/<élève de la moitié>, par le voisin)
  const LIT = (qi, proprio) => qi === 0 && proprio === C ? [L1] : qi === 1 && proprio === D ? "aucun" : CLIC[qi];
  for(let i = 0; i < ordre.length; i++){
    const qi = ordre[i];
    if(i){ await cliquer(prof, /Question suivante/); await pause(900); }
    for(const [pg, c, sl, vois] of M){ const lu = LIT(qi, sl);
      if(lu === "aucun"){ if(!(await cliquer(pg, /aucun/i, c, {apres: 150}))) J.v(false, BANC, "Q" + (qi + 1) + " : « aucun de ces choix », lu par " + pre(vois) + " sur la feuille de " + pre(sl), await zoneTexte(pg, c)); }
      else for(const x of lu) await cliquer(pg, new RegExp("^" + esc(x) + "$"), c, {apres: 150}); }
    await pause(900); await cliquer(prof, /Révéler/); await pause(1200);
  }
  const lec = sess().s.lectures || {};
  J.v(JSON.stringify((lec[1] || {})[D] || {}).includes("aucun") && JSON.stringify(((lec[0] || {})[C] || {}).choix || {}).includes("1"), BANC, "la base a les lectures du banc (Q2 de " + pre(D) + " : aucun ; Q1 de " + pre(C) + " : L1)", JSON.stringify(lec).slice(0, 300));
  await capt(prof, "b-console-correction");

  J.section("B3. La co-évaluation : " + pre(A) + " 🤔 Q1 (écrit L1), " + pre(C) + " ❌ Q1 (écrit L0), gardée pour le soir");
  await cliquer(prof, /Ouvrir la co-évaluation/); await pause(1200);
  const [pA, cA] = [M[0][0], M[0][1]], [pC, cC] = [M[2][0], M[2][1]];
  J.v(await cliquer(pA, /^🤔/, cA), BANC, pre(A) + " : « 🤔 … peut-être mal lu »", await zoneTexte(pA, cA)); await pause(300);
  await cliquer(pA, /^Question 1 ·/, cA); await pause(300);
  // il dit avoir écrit L1 (Léa a lu L0) : écrire ce que le voisin a lu ferait « d'accord » (ecrire, etape3.js)
  J.v(await cliquer(pA, new RegExp("^" + esc(L1) + "( .* a lu)?$"), cA), BANC, pre(A) + " : « Qu'avais-tu écrit sur ta feuille ? », L1", await zoneTexte(pA, cA)); await cliquer(pA, /Valider|C'est ça|Envoyer/, cA); await pause(300);
  J.v(await cliquer(pC, /^❌ Je pense que .* a mal lu/, cC), BANC, pre(C) + " : « ❌ Je pense que " + pre(D) + " a mal lu »", await zoneTexte(pC, cC)); await pause(300);
  await cliquer(pC, /^Question 1 ·/, cC); await pause(300); await cliquer(pC, new RegExp("^" + esc(L0) + "$"), cC); await cliquer(pC, /Valider|C'est ça|Envoyer/, cC);
  for(const [pg, c, sl] of M) if(sl !== A && sl !== C) await cliquer(pg, /^✅ Je pense que .* a bien lu ma feuille/, c);
  await pause(1500); await capt(prof, "b-alerte");
  const co = sess().s.coeval || {};
  J.v((co[A] || {}).statut === "peut" && JSON.stringify((co[A] || {}).ecrit || null).includes("1") && (co[C] || {}).statut === "mal", BANC, "la base a la co-évaluation du banc (" + pre(A) + " peut, écrit L1 ; " + pre(C) + " mal)", JSON.stringify(co).slice(0, 300));
  J.v(await cliquer(prof, /📌 Je relis ce soir la question 1/), BANC, "« 📌 Je relis ce soir la question 1 »", (await texte(prof)).slice(0, 200)); await pause(800);
  await cliquer(prof, /^(📌 Je relis ce soir|Confirmer|Oui)/); await pause(600);
  await cliquer(prof, /Afficher leur bilan aux élèves/); await pause(1500);

  // les six sortes, avec les prénoms de la séance
  const SORTES = [
    ["n'a rien dit", A, 0, null, ["Tablette et lecture de " + pre(Bs) + " : « " + L0 + " »"], [[L0, 1], ["Tablette :", 0]]],
    ["a dit Oui, le voisin a lu autre chose", C, 0, pre(C) + " dit avoir bien écrit sa réponse sur sa feuille ; " + pre(D) + " y a lu autre chose.", ["Tablette : « " + L0 + " »", "Lu par " + pre(D) + " : « " + L1 + " »"], [[L0, 1], [L1, 1]]],
    ["a dit Non, le voisin a lu sa réponse", Bs, 1, pre(Bs) + " dit avoir écrit autre chose sur sa feuille ; " + pre(A) + " y a lu sa réponse.", ["Tablette et lecture de " + pre(A) + " : « Madrid » et « Berlin »"], [["« Madrid »", 1]]],
    ["le voisin n'a lu aucun choix", D, 1, pre(C) + " n'a lu aucun des choix sur la feuille de " + pre(D) + ".", [], [["Tablette", 0]]],
    ["co-évaluation « peut-être »", A, 0, null, [pre(A) + " dit avoir écrit : « " + L1 + " »"], [[L1, 1]]],
    ["l'alerte gardée pour le soir", C, 0, null, [], [["Tablette", 0], ["dit avoir écrit", 0]]]];
  // la phrase exacte (il / elle, que / qu')
  const phraseDe = async (s, t) => {
    if(s[0] === "n'a rien dit"){ const m = t.match(new RegExp(esc(pre(A)) + " n'a pas dit s(?:'il|i elle) avait bien écrit sa réponse sur sa feuille\\.")); return m ? m[0] : pre(A) + " n'a pas dit s'il avait bien écrit sa réponse sur sa feuille."; }
    if(s[0] === "co-évaluation « peut-être »"){ const m = t.match(new RegExp(esc(pre(A)) + " pense qu(?:e |')" + esc(pre(Bs)) + " a peut-être mal lu sa feuille\\.")); return m ? m[0] : pre(A) + " pense que " + pre(Bs) + " a peut-être mal lu sa feuille."; }
    if(s[0] === "l'alerte gardée pour le soir"){ const m = t.match(new RegExp(esc(pre(C)) + " pense qu(?:e |')" + esc(pre(D)) + " a mal lu sa feuille\\.")); return m ? m[0] : pre(C) + " pense que " + pre(D) + " a mal lu sa feuille."; }
    return s[3];
  };
  // (dans la fiche, la question montre aussi ses choix : les réponses y reviennent, on n'y compte pas les occurrences)
  const verifSortes = async (ou, tDe, proprio, seul) => { for(const s of SORTES){ if(seul && s[1] !== seul) continue; const t = (await tDe(s[1])) || ""; verifLigne(t, proprio, ou + " (" + s[0] + ")", await phraseDe(s, t), s[4], s[5], !!seul); } };

  J.section("B4. La console : « 📌 À lire sur les feuilles, ce soir », une ligne de chaque sorte (point 8)");
  const liste = async () => norm(await prof.evaluate(() => { const a = [...document.querySelectorAll(".alire")].filter(e => /À lire sur les feuilles/.test(e.innerText)); return a.length ? a.map(e => e.innerText).join("\n") : ""; }).catch(() => ""));
  let li = await liste(); await capt(prof, "b-console-a-lire");
  J.v(/📌 À lire sur les feuilles, ce soir \(\d+\)/.test(li), H3, "la console montre « 📌 À lire sur les feuilles, ce soir (n) »", (await texte(prof)).slice(0, 300));
  await verifSortes("console", async () => li, H13);
  J.v(!/disait son clic|sa feuille ne disait pas/.test(li), H13, "console : plus les anciennes phrases « … disait son clic »", (li.match(/[^\n]*disait[^\n]*/) || [""])[0]);

  J.section("B5. Le soir : le tableau de la séance et la fiche de l'élève");
  await cliquer(prof, /Terminer la séance/); await pause(400); await cliquer(prof, /^🛑 Terminer la séance$|Terminer la séance/); await pause(2000);
  const ok = await ouvrirSeance(prof, "Reprise 7");
  await capt(prof, "b-soir-tableau");
  J.v(ok && /À lire sur la feuille/.test(await texte(prof)), BANC, "Données → Résultats → « 📊 Ouvrir » de la séance « Reprise 7 — réponses longues »", (await texte(prof)).slice(0, 300));
  await verifSortes("tableau de la séance", async sl => cellule(prof, sl), H31);
  for(const [sl, nom] of [[A, nomDe(A)], [C, nomDe(C)]]){
    if(!(await ouvrirSeance(prof, "Reprise 7")) || !(await clic(prof, new RegExp("^" + esc(nom) + "$")))){ J.v(false, BANC, "la fiche de " + pre(sl) + " s'ouvre (clic sur son nom)"); continue; }
    const f = await texte(prof); await capt(prof, "b-fiche-" + slug(pre(sl)));
    await verifSortes("fiche de " + pre(sl), async () => f, H31, sl);
  }
  J.v(!prof.__err.length, H3, "aucune erreur de page (la console de la séance)", prof.__err.slice(0, 3).join(" | "));
  } catch(e){ J.v(false, BANC, "la partie B s'est interrompue : " + e.message); }
  try { if(A2) await A2.fermer(); } catch(e){}
  ecrire(); process.exit(0);
})();
