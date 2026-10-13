// QCM-4 · BANC — la reprise 3 du 13/10 (DEFAUTS-OUVERTS, « Reprise 3 », point 5), rejouée par le geste sur le faux hub :
// l'alerte de la co-évaluation sur une question « Trouvée au dernier moment » (et sa garde, et le bilan) ; un « Oui » de B cliqué
// dans les dernières secondes ; « Aucune séance active » au téléphone après « 🛑 Terminer ».
// 3 ESSAI, deux tablettes entrées (quatre élèves, dont Julien), les autres présents marqués absents ; console, téléphone.
//   APP_FILE=<app> node banc/banc-reprise3.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, etatBouton, choisir, taper, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise3-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures-reprise3"), {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H12 = H1 + ", " + H2;
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
let n = 0; const capt = async (p, id) => photo(p, path.join(SORTIE, "captures-reprise3", String(++n).padStart(2, "0") + "-" + id + ".png"));
// les réponses : Q1 Rome ; Q2 Madrid et Berlin ; Q3 8 — tout le monde juste à la tablette
const JUSTE = [["Rome"], ["Madrid", "Berlin"], ["8"]];
(async () => {
  const t0 = Date.now();
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const pre = sl => nomDe(sl).split(" ").slice(1).join(" ");
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : {}; };
  const entrer = async (p, cote, nom) => { const [N, ...P] = nom.split(" "); await taper(p, cote, "code", codeDe(nom)); await taper(p, cote, "prenom", P.join(" ").toLowerCase()); await taper(p, cote, "nom", N.toLowerCase()); await cliquer(p, /Entrer/, cote); await pause(400); };
  let prof, tel;
  try {
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
    await cliquer(prof, /Lancer la séance/); await pause(400); await cliquer(prof, /YVON Adam/); await cliquer(prof, /Lancer la séance/); await pause(1200);
    const pl = sess().s.places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d}));
    const tA = T.find(t => [t.g, t.d].includes("abrial_julien")), tB = T.find(t => [t.g, t.d].includes("chevallier_theo"));
    if(!tA || !tB) throw new Error("pas de places");
    const t1 = await A.tablette("tablette-1", "3 ESSAI"), t2 = await A.tablette("tablette-2", "3 ESSAI");
    tel = await A.ouvrir("telephone", "?mode=prof&view=phone", 390, 844);
    await cliquer(t1, /2 élèves/); await entrer(t1, "g", nomDe(tA.g)); await entrer(t1, "d", nomDe(tA.d));
    await cliquer(t2, /2 élèves/); await entrer(t2, "g", nomDe(tB.g)); await entrer(t2, "d", nomDe(tB.d));
    const M = [[t1, "g", tA.g], [t1, "d", tA.d], [t2, "g", tB.g], [t2, "d", tB.d]];
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);
    const cJ = tA.g === "abrial_julien" ? "g" : "d", cV = cJ === "g" ? "d" : "g", slV = tA[cV];
    // l'élève du « Oui » tardif : la moitié de droite de la tablette 2 (2e tour, son B vient après)
    const [, , slY] = M[3];

    J.section("Q1 à Q3 : tout le monde juste à la tablette ; le « Oui » de B de " + pre(slY) + " dans les dernières secondes");
    for(let qi = 0; qi < 3; qi++){
      await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800);
      await cliquer(prof, /Autoriser la réponse/); await pause(2500);
      let bTardif = false; const fait = new Set();
      for(let k = 0; k < 90 && !/close/.test(etat().ph || ""); k++){
        for(const [p, c, sl] of M){
          const z = await zoneTexte(p, c);
          const cle = qi + ":" + (etat().tour || 1) + ":" + sl;
          if(!fait.has(cle) && !/la même chose que ton clic/.test(z) && (await O.choixOuverts(p, c, EV.questions[qi].choix)).length){ for(const x of JUSTE[qi]) await cliquer(p, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); }
          if(/la même chose que ton clic/.test(z)){
            if(qi === 0 && sl === slY){ const e = etat(); const reste = (e.depuis || 0) + (e.duree || 0) * 1000 - Date.now();
              if(!bTardif && e.ph === "b" && reste < 2500 && reste > 300){ await cliquer(p, /Oui, la même chose/, c); bTardif = true; } }
            else await cliquer(p, /Oui, la même chose/, c);
          }
        }
        if(etat().ph === "reponse" && k > 6) await cliquer(prof, /Tour suivant/);
        await pause(400);
      }
      if(!/close/.test(etat().ph || "")) await cliquer(prof, /Clore la question/), await pause(800);
      if(qi === 0) J.v(bTardif, "QCM-4 · BANC", pre(slY) + " a cliqué « Oui, la même chose » dans les 2,5 dernières secondes de son B");
    }
    const bb = JSON.stringify(sess().s.b || {});
    J.v(bb.includes(slY), H1, "le « Oui » tardif de " + pre(slY) + " est dans la base (b)", bb.slice(0, 300));

    J.section("L'estimation, la seconde attestation, la correction : la feuille de Julien lue « Madrid » seul à Q2");
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(800);
    for(const [p, c] of M) await cliquer(p, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(800);
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence la correction$/, c); }
    await pause(1500);
    await cliquer(prof, /Commencer la correction/); await pause(1500);
    J.v(etat().ph === "lecture", H1, "la correction commence au clic de Paul", JSON.stringify(etat()));
    const oc = sess().s.ordreCorr; const ordre = (Array.isArray(oc) ? oc : Object.values(oc || {})).map(Number);
    for(let i = 0; i < ordre.length; i++){
      const qi = ordre[i];
      if(i) { await cliquer(prof, /Question suivante/); await pause(900); }
      for(const [p, c, sl] of M){ const lu = (qi === 1 && sl === "abrial_julien") ? ["Madrid"] : JUSTE[qi]; for(const x of lu) await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 120}); }
      await pause(900);
      await cliquer(prof, /Révéler/); await pause(1200);
    }
    const tr = sess().s.trouvee || {};
    J.v(String(tr.abrial_julien) === "1", H1, "Julien : « Trouvée au dernier moment » à Q2 (trouvee/abrial_julien = 1)", JSON.stringify(tr));
    const aL = JSON.stringify(sess().s.aLire || {}), cA = await texte(prof);
    await capt(prof, "c-apres-correction");
    J.v(!new RegExp(esc(nomDe(slY)) + "[^\\n]{0,40}Q1 : n'a pas dit").test(cA) && !(new RegExp('"' + slY + '[^}]*"sorte":"(b|B|nondit)').test(aL)), H1, "« À lire ce soir » ne dit pas que " + pre(slY) + " « n'a pas dit si sa feuille disait son clic » à Q1", (cA.match(new RegExp(esc(nomDe(slY)) + "[^\\n]{0,80}")) || [""])[0] + " · " + aL.slice(0, 200));

    J.section("La co-évaluation : Julien signale ❌ la question 2, celle qu'il a trouvée au dernier moment");
    await cliquer(prof, /Ouvrir la co-évaluation/); await pause(1200);
    await cliquer(t1, /^❌ Je pense que .* a mal lu/, cJ); await pause(400);
    await cliquer(t1, /^Question 2 ·/, cJ); await pause(400);
    for(const x of ["Madrid", "Berlin"]) await cliquer(t1, new RegExp("^" + esc(x) + "$"), cJ);
    await cliquer(t1, /Valider|C'est ça|Envoyer/, cJ);
    for(const [p, c, sl] of M) if(sl !== "abrial_julien") await cliquer(p, /^✅ Je pense que .* a bien lu ma feuille/, c);
    await pause(1500);
    const cAl = await texte(prof), pAl = await texte(tel);
    await capt(prof, "c-alerte"); await capt(tel, "p-alerte");
    const ligne = t => (t.match(/Donner raison[^\n]*/g) || []).join(" | ");
    J.v(/Donner raison/.test(cAl), H2, "l'alerte de Julien, Q2, à la console", cAl.slice(0, 200));
    const juste = t => !/passe de 0 à 1 point/.test(t) && !/Donner raison à Julien[^|]*→ 0 point/.test(ligne(t)) && !new RegExp("Donner raison à " + esc(pre(slV)) + "[^|]*→ 0 point").test(ligne(t));
    J.v(juste(cAl), H1 + ", " + H2, "à la console, l'alerte part de sa note réelle (Q2 : 1 point, trouvée au dernier moment) : ni « 0 → 1 », ni « → 0 point »", ligne(cAl) + " · " + (cAl.match(/[^\n]*passe de[^\n]*/) || [""])[0]);
    J.v(juste(pAl), H2, "au téléphone, de même", ligne(pAl));
    J.v(await cliquer(prof, new RegExp("Donner raison à " + esc(pre(slV)))), H2, "« Donner raison à " + pre(slV) + " »"); await pause(500);
    const g = await texte(prof); await capt(prof, "c-garde");
    const gq = (g.match(/question 2 de [^;.\n]*/i) || [""])[0], gn = (g.match(/note provisoire[^.\n]*/i) || [""])[0];
    J.v(!/reste à 0/.test(gq) && !/passe à 0/.test(gq), H1 + ", " + H2, "la garde dit vrai : la question 2 de Julien garde son point (trouvée au dernier moment)", gq + " · " + gn);
    await cliquer(prof, new RegExp("^(Donner raison à " + esc(pre(slV)) + "|Confirmer|Oui)")); await pause(800);
    await cliquer(prof, /Afficher leur bilan aux élèves/); await pause(1500);
    const bj = await zoneTexte(t1, cJ); await capt(t1, "t-bilan-julien");
    J.v(/Question 2[^\n]*(Trouvée au dernier moment|1 point)/.test(bj) || /Trouvée au dernier moment → 1 point/.test(bj), H1, "le bilan de Julien : Q2, 1 point", bj.slice(0, 300));
    J.v(/3 ?\/ ?3/.test(bj), H1, "le bilan de Julien : 3 / 3 (Q1, Q3 justes ; Q2 trouvée au dernier moment)", (bj.match(/\d+ ?\/ ?3/) || [""])[0]);
    // reprise 6, point 5 : la note que la garde annonce est celle du bilan
    const nG = (g.match(/note provisoire[^\d\n]*(\d+) ?\/ ?(\d+)/i) || []).slice(1).join(" / "), nB = (bj.match(/note provisoire[^\d\n]*(\d+) ?\/ ?(\d+)/i) || []).slice(1).join(" / ");
    J.v(!!nG && nG === nB, H12, "la garde de l'alerte tranchée (avec trouvée) annonce la note du bilan", "garde : « " + nG + " », bilan : « " + nB + " »");

    J.section("« 🛑 Terminer » : le téléphone dit « séance »");
    await cliquer(prof, /Terminer la séance/); await pause(400); await cliquer(prof, /^🛑 Terminer la séance$|Terminer la séance/); await pause(2000);
    const pt = await texte(tel); await capt(tel, "p-termine");
    J.v(!/session/i.test(pt) && /séance/i.test(pt), H2, "au téléphone : « Aucune séance active » (et non « session »)", pt.slice(0, 200));
  } catch(e){ J.v(false, "QCM-4 · BANC", "le jeu s'est interrompu : " + e.message); }
  try { await A.nav.close(); } catch(e){}
  const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  fs.writeFileSync(path.join(SORTIE, "reprise3.txt"), "Reprise 3, point 5, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s\n" + out + "\n");
  console.log(out); process.exit(0);
})();
