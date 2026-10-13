// QCM-4 · BANC — la reprise 4 du 13/10 (DEFAUTS-OUVERTS, « Reprise 4 », points 1 à 7), rejouée par le geste sur le faux hub, en une séance :
// 3 ESSAI, Adam absent, deux tablettes entrées (quatre élèves), les autres présents jamais entrés ; console, téléphone, tableau.
// Q1 : « +5 » au 1er tour (6, 7), un élève sans réponse à chaque tour ; « 🔓 Rouvrir pour un élève », puis « pour tous » (2, 3) ;
// Q2 écartée (4) ; Q3 : la console rechargée (5) ; la correction ; la co-évaluation : une alerte sans « Trouvée » (1) ; le bilan (4).
//   APP_FILE=<app> node banc/banc-reprise4.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, choisir, taper, cocherTout, choixOuverts, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise4-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures-reprise4"), {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H12 = H1 + ", " + H2;
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
let n = 0; const capt = async (p, id) => photo(p, path.join(SORTIE, "captures-reprise4", String(++n).padStart(2, "0") + "-" + id + ".png"));
const hhmm = () => new Date().toLocaleTimeString("fr-FR", {hour: "2-digit", minute: "2-digit"});   // l'heure du navigateur, comme l'app l'écrit
(async () => {
  const t0 = Date.now();
  const fin = setTimeout(() => { J.v(false, "QCM-4 · BANC", "plafond de 7 minutes atteint"); ecrire(); process.exit(0); }, 420000);
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const pre = sl => nomDe(sl).split(" ").slice(1).join(" ");
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : {}; };
  const entrer = async (p, cote, nom) => { const [N, ...P] = nom.split(" "); await taper(p, cote, "code", codeDe(nom)); await taper(p, cote, "prenom", P.join(" ").toLowerCase()); await taper(p, cote, "nom", N.toLowerCase()); await cliquer(p, /Entrer/, cote); await pause(400); };
  const ouverts = async (p, c, qi) => (await choixOuverts(p, c, EV.questions[qi].choix)).length > 0;
  let prof, tel, tab;
  try {
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
    await cliquer(prof, /Lancer la séance/); await pause(400); await cliquer(prof, /YVON Adam/); await cliquer(prof, /Lancer la séance/); await pause(1200);
    const pl = sess().s.places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d}));
    const tA = T.find(t => [t.g, t.d].includes("abrial_julien")), tB = T.find(t => [t.g, t.d].includes("chevallier_theo"));
    if(!tA || !tB) throw new Error("pas de places");
    const jamais = T.filter(t => t !== tA && t !== tB).flatMap(t => [t.g, t.d]).filter(Boolean).map(nomDe);
    const t1 = await A.tablette("tablette-1", "3 ESSAI"), t2 = await A.tablette("tablette-2", "3 ESSAI");
    tel = await A.ouvrir("telephone", "?mode=prof&view=phone", 390, 844);
    tab = await A.ouvrir("tableau", "?mode=prof&view=board", 1920, 1080);
    await cliquer(t1, /2 élèves/); await entrer(t1, "g", nomDe(tA.g)); await entrer(t1, "d", nomDe(tA.d));
    await cliquer(t2, /2 élèves/); await entrer(t2, "g", nomDe(tB.g)); await entrer(t2, "d", nomDe(tB.d));
    const M = [[t1, "g", tA.g], [t1, "d", tA.d], [t2, "g", tB.g], [t2, "d", tB.d]];
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);
    // B : qui l'a vu, qui l'a dit
    const vuB = new Set();
    const guetterB = async () => { for(const [p, c, sl] of M){ if(vuB.has(sl)) continue; const z = await zoneTexte(p, c); if(/la même chose que ton clic/.test(z)){ vuB.add(sl); await cliquer(p, /Oui, la même chose/, c); } } };

    J.section("Q1 : « +5 » au 1er tour ; à chaque tour, un élève répond, l'autre non");
    await cliquer(prof, /Lancer Q1\b/); await pause(800);
    await cliquer(prof, /Autoriser la réponse/);
    for(let k = 0; k < 30 && etat().ph !== "reponse"; k++) await pause(200);   // après le passage (« À toi dans 3 secondes »)
    const d0 = etat().duree;
    const plus = await prof.evaluate(() => { const r = [...document.querySelectorAll("button")].filter(b => /^\+5$/.test(b.textContent.trim()) && b.getBoundingClientRect().width > 0); const b = r[1] || r[0]; if(!b) return false; b.setAttribute("data-banc", "p5"); return true; });
    if(plus) await prof.click("[data-banc='p5']").catch(() => {}); await pause(800);
    const e1 = etat(); await capt(prof, "c-q1-plus5");
    J.v(e1.tour === 1 && e1.ph === "reponse" && e1.duree === d0 + 5, H12, "« +5 » cliqué au 1er tour profite au 1er tour (deroule.duree " + d0 + " → " + (d0 + 5) + ")", JSON.stringify(e1));
    const telQ1 = await texte(tel); await capt(tel, "p-q1-plus5");
    J.v(new RegExp("réponse " + (d0 + 5) + " ?s").test(telQ1), H2, "le bandeau du téléphone suit le temps changé (« réponse " + (d0 + 5) + " s »)", (telQ1.match(/réflexion[^\n]{0,60}/) || [""])[0]);
    // le 1er tour : la moitié qui a la main a ses choix pendant son temps ; sur t1 elle répond, sur t2 non
    const c1 = e1.cote || ((await ouverts(t1, "g", 0)) ? "g" : "d"), c2 = c1;
    await pause(Math.max(0, (d0 - 2) * 1000));
    J.v(await ouverts(t1, c1, 0), H2, "au 1er tour, " + d0 + " s après le début de la réponse (temps prolongé de 5 s), la moitié qui a la main a encore ses choix", (await zoneTexte(t1, c1)).slice(0, 160));
    await cliquer(t1, /^Rome$/, c1);
    const sl1 = c1 === "g" ? tA.g : tA.d, sl2 = c2 === "g" ? tB.g : tB.d;
    const r1 = c1 === "g" ? "d" : "g", r2 = c2 === "g" ? "d" : "g", slR1 = tA[r1], slR2 = tB[r2];
    for(let k = 0; k < 60 && !(etat().tour === 2 && etat().ph === "reponse"); k++){ await guetterB(); await pause(500); }
    await pause(1500); await cliquer(t1, /^Rome$/, r1);
    for(let k = 0; k < 80 && etat().ph !== "close"; k++){ await guetterB(); await pause(500); }
    await guetterB();
    J.v(vuB.has(sl1) && vuB.has(slR1), H12, "B pour chacun de ceux qui ont répondu à Q1 (" + pre(sl1) + " au 1er tour, " + pre(slR1) + " au 2e)", "B vu par : " + [...vuB].map(pre).join(", "));
    const telC = await texte(tel); await capt(tel, "p-q1-close");
    const croix = [nomDe(sl2), nomDe(slR2), ...jamais.slice(0, 3)].filter(x => new RegExp(esc(x.split(" ").slice(1).join(" ")) + "[^\\n]{0,25}✗|" + esc(x) + "[^\\n]{0,25}✗").test(telC));
    J.v(croix.length === 0, H2, "au téléphone, un élève sans réponse ou jamais entré ne porte pas « ✗ »", croix.join(", "));

    J.section("« 🔓 Rouvrir pour un élève » (" + pre(sl2) + "), puis « pour tous »");
    await cliquer(prof, /Rouvrir pour un élève/); await pause(400);
    await cliquer(prof, new RegExp("Rouvrir pour " + esc(pre(sl2)))); await pause(2500);
    await cliquer(t2, /^Rome$/, c2);
    for(let k = 0; k < 40 && !(vuB.has(sl2) && etat().ph === "close"); k++){ await guetterB(); await pause(500); }
    J.v(vuB.has(sl2), H12, pre(sl2) + ", rouvert seul, a son B après sa réponse", "B vu par : " + [...vuB].map(pre).join(", "));
    for(let k = 0; k < 20 && etat().ph !== "close"; k++) await pause(500);
    await cliquer(prof, /Rouvrir pour tous/); await pause(500);
    const garde = await texte(prof); await capt(prof, "c-rouvrir-tous");
    const gl = (garde.match(/Ici :[^\n]*/) || [garde.slice(0, 400)])[0];
    J.v(new RegExp(esc(nomDe(slR2))).test(gl) && !jamais.some(x => gl.includes(x)), H1, "la garde de « Rouvrir pour tous » liste " + pre(slR2) + " (sans réponse), pas les élèves jamais entrés", gl.slice(0, 300));
    await cliquer(prof, /Rouvrir pour ceux qui n'ont pas répondu/); await pause(3000);
    let rouvert = false, autresOuverts = [];
    for(let k = 0; k < 30 && !rouvert; k++){ if(await ouverts(t2, r2, 0)) rouvert = true; for(const [p, c, sl] of M) if(sl !== slR2 && await ouverts(p, c, 0)) autresOuverts.push(pre(sl)); if(!rouvert) await pause(700); }
    await capt(t1, "t1-rouvert-tous"); await capt(t2, "t2-rouvert-tous");
    J.v(rouvert, H1, "« Rouvrir pour tous » : " + pre(slR2) + " retrouve la question");
    if(rouvert) await cliquer(t2, /^Rome$/, r2);
    const stylo = new Set(), bEnTrop = new Set();
    for(let k = 0; k < 100 && etat().ph !== "close"; k++){ await guetterB();
      for(const [p, c, sl] of M){ if(sl === slR2) continue; if(await ouverts(p, c, 0)) autresOuverts.push(pre(sl));
        const z = await zoneTexte(p, c); if(new RegExp("Pose ton stylo, " + esc(pre(sl)) + "|" + esc(pre(sl)) + ", pose ton stylo", "i").test(z)) stylo.add(pre(sl)); if(/la même chose que ton clic/.test(z)) bEnTrop.add(pre(sl)); }
      await pause(500); }
    J.v(stylo.size === 0, H2, "pendant « Rouvrir pour tous », aucun élève qui avait répondu (dont " + pre(sl2) + ", rouvert seul juste avant) ne lit « Pose ton stylo »", [...stylo].join(", "));
    J.v(bEnTrop.size === 0, H12, "pendant « Rouvrir pour tous », pas de nouvelle question B à ceux qui avaient déjà répondu", [...bEnTrop].join(", "));
    await guetterB();
    if(etat().ph !== "close"){ await cliquer(prof, /Clore la question/); await pause(1000); }
    J.v(autresOuverts.length === 0, H1, "la question ne revient qu'à celui qui n'avait pas répondu : pas de tour pour les autres", [...new Set(autresOuverts)].join(", "));
    J.v(vuB.has(slR2), H12, pre(slR2) + ", rouvert « pour tous », a son B", "B vu par : " + [...vuB].map(pre).join(", "));

    J.section("Q2 écartée ; Q3 : la console rechargée pendant la réflexion");
    const ec = await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => /Écarter/.test(b.textContent) && b.getBoundingClientRect().width > 0); const x = b[0]; if(!x) return false; x.setAttribute("data-banc", "ec"); return true; });
    if(ec) await prof.click("[data-banc='ec']").catch(() => {}); await pause(300);
    J.v(await cliquer(prof, /Écarter la question 2/), H2, "« ❌ Écarter la question 2 »"); await pause(600);
    J.v(JSON.stringify(sess().s.ecartees || "").includes("1"), H1, "la base : ecartees = [1]", JSON.stringify(sess().s.ecartees));
    console.log("boutons :", JSON.stringify(await prof.evaluate(() => [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0).map(b => b.textContent.trim()).filter(t => /Lancer|Fermer|Annuler|Q3/.test(t)))));
    await capt(prof, "c-apres-ecart");
    J.v(await cliquer(prof, /Lancer Q[23]\b/), H2, "« ▶️ Lancer » la question suivante (Q3, la 2e sur 2)"); await pause(4000);
    const h = hhmm();
    await prof.reload(); await pause(2500); await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(800);
    const ci = await texte(prof); await capt(prof, "c-interrompue");
    const hd = (ci.match(/déconnexion[^\n]*?(\d{1,2}[:h]\d{2})/i) || [])[1];
    const mn = s => { const m = (s || "").match(/(\d{1,2})[:h](\d{2})/); return m ? +m[1] * 60 + +m[2] : -99; };
    J.v(Math.abs(mn(hd) - mn(h)) <= 1, H12, "« Séance interrompue » : l'heure de la coupure (" + h + "), pas celle du lancement", hd);
    await cliquer(prof, /🔄 Reprendre la séance/); await pause(1500);
    console.log("après la reprise :", JSON.stringify(etat()));
    await cliquer(prof, /Autoriser la réponse/); await pause(2500);
    // Q3 : X = sl1 répond faux (6) ; les autres juste (8)
    const X = sl1, cX = c1, V = slR1;
    for(let k = 0; k < 90 && etat().ph !== "close"; k++){
      for(const [p, c, sl] of M) if(await O.choixOuverts(p, c, EV.questions[2].choix).then(x => x.length)) { if(!(p.__q3 || (p.__q3 = new Set())).has(c)){ p.__q3.add(c); await cliquer(p, sl === X ? /^6$/ : /^8$/, c); } }
      await guetterB(); if(etat().ph === "reponse" && k > 8 && k % 6 === 0) await cliquer(prof, /Tour suivant/); await pause(500);
    }

    console.log("après Q3 :", JSON.stringify(etat()));
    J.section("L'estimation, la correction (Q1, Q3), la co-évaluation : " + pre(X) + " signale ❌ la question 3");
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(800);
    for(const [p, c] of M) await cliquer(p, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(800);
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence la correction$/, c); }
    await pause(1500);
    const telA = await texte(tel); await capt(tel, "p-attest2");
    J.v(!/Q2[^\n]{0,12}\d+ ?%/.test(telA), H2, "au téléphone, la question écartée n'a pas de « % »", (telA.match(/Q1[^\n]{0,80}/) || [""])[0]);
    await cliquer(prof, /Commencer la correction/); await pause(1500);
    const oc = sess().s.ordreCorr; const ordre = (Array.isArray(oc) ? oc : Object.values(oc || {})).map(Number);
    J.v(!ordre.includes(1), H1, "ordreCorr sans la question écartée", JSON.stringify(oc));
    const JUSTE = {0: ["Rome"], 2: ["8"]};
    for(let i = 0; i < ordre.length; i++){ const qi = ordre[i]; if(!JUSTE[qi]) continue;
      if(i) { await cliquer(prof, /Question suivante/); await pause(900); }
      for(const [p, c, sl] of M){ const lu = (qi === 2 && sl === X) ? ["6"] : JUSTE[qi]; for(const x of lu) await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 120}); }
      await pause(900); await cliquer(prof, /Révéler/); await pause(1200);
    }
    const tx = await zoneTexte(t1, cX); await capt(t1, "t1-corr");
    J.v(!/Question 2\b/.test(tx), H2, "la correction de l'élève ne montre pas la question écartée", tx.slice(0, 200));
    console.log("avant la co-évaluation :", JSON.stringify(etat()));
    J.v(await cliquer(prof, /Ouvrir la co-évaluation/), H2, "« 🤝 Ouvrir la co-évaluation »"); await pause(1200);
    await cliquer(t1, /^❌ Je pense que .* a mal lu/, cX); await pause(500);
    const laq = await zoneTexte(t1, cX); await capt(t1, "t1-laquelle");
    J.v(/Question 3/.test(laq) && !/Question 2 ·/.test(laq), H2, "« c'est laquelle ? » ne propose pas la question écartée", laq.slice(0, 300));
    await cliquer(t1, /^Question 3 ·/, cX); await pause(1200);
    const avant = await texte(prof); await capt(prof, "c-alerte-avant");
    J.v(!/Donner raison à [^:\n]+: *→/.test(avant), H12, "pas de bouton « Donner raison » à choix vide avant que " + pre(X) + " ait dit ce qu'il a écrit", (avant.match(/Donner raison[^\n]*/g) || []).join(" | "));
    await cliquer(t1, /^8$/, cX); await cliquer(t1, /Valider|C'est ça|Envoyer/, cX);
    for(const [p, c, sl] of M) if(sl !== X) await cliquer(p, /^✅ Je pense que .* a bien lu ma feuille/, c);
    await pause(1500);
    const al = await texte(prof), alT = await texte(tel); await capt(prof, "c-alerte"); await capt(tel, "p-alerte");
    const lignes = t => (t.match(/Donner raison[^\n]*/g) || []).join(" | ");
    const bon = t => new RegExp("Donner raison à " + esc(pre(X)) + " : 8 → 1 point").test(lignes(t)) && new RegExp("Donner raison à " + esc(pre(V)) + " : 6 → 0 point").test(lignes(t));
    J.v(bon(al), H12, "l'alerte, à la console : « Donner raison à " + pre(X) + " : 8 → 1 point », « Donner raison à " + pre(V) + " : 6 → 0 point » (la note que la feuille vaut)", lignes(al));
    J.v(bon(alT), H2, "l'alerte, au téléphone, de même", lignes(alT));
    await cliquer(prof, new RegExp("Donner raison à " + esc(pre(X)))); await pause(500);
    await cliquer(prof, new RegExp("^(Donner raison à " + esc(pre(X)) + "|Confirmer|Oui)")); await pause(800);
    await cliquer(prof, /Afficher leur bilan aux élèves/); await pause(1500);
    const bx = await zoneTexte(t1, cX); await capt(t1, "t1-bilan");
    J.v(!/Question 2\b/.test(bx) && !/Q2 ?✗/.test(bx), H12, "le bilan de " + pre(X) + " ne compte pas la question écartée (ni « Question 2 », ni « Q2 ✗ »)", bx.slice(0, 300));
    J.v(/2 ?\/ ?2/.test(bx), H1, "le bilan de " + pre(X) + " : 2 / 2 (Q1 juste ; Q3 : raison donnée)", (bx.match(/\d+ ?\/ ?\d+/g) || []).join(", "));
  } catch(e){ J.v(false, "QCM-4 · BANC", "le jeu s'est interrompu : " + e.message); }
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "reprise4.txt"), "Reprise 4, points 1 à 7, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s\n" + out + "\n");
    console.log(out);
  }
})();
