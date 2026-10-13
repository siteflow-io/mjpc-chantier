const O = require(process.env.OUTILS), fs = require("fs"), path = require("path");
const REF = JSON.parse(fs.readFileSync(path.join(process.env.CQ, "banc/reference/maquette-v9.json")));
const s = x => typeof x === "string" ? x : (x.l || JSON.stringify(x)), diff = (a, b) => a.filter(x => b.indexOf(x) < 0);
async function cmp(p, id){ const r = await O.releve(p), m = REF.scenes.find(x => x.id === id); await p.screenshot({path: process.argv[2] + "/" + id + ".png"});
  console.log("##### " + id); for(const [k, n] of [["gestes", "GESTES"], ["bulles", "BULLES"], ["texte", "TEXTES"]]){ const a = (m[k] || []).map(s), b = (r[k] || []).map(s); console.log(n + " absents :", JSON.stringify(diff(a, b)).slice(0, 900)); console.log(n + " en trop :", JSON.stringify(diff(b, a)).slice(0, 900)); } }
(async () => {
  const {B, srv, port} = await O.fauxHub(() => {});
  const A = new O.Appareils(srv, port); await A.demarrer();
  const p = await A.ouvrir("console", "?mode=prof", 1536, 864); await O.pause(1500);
  const ev = (f, ...a) => p.evaluate(f, ...a), clic = async re => { const ok = await O.cliquer(p, re); console.log("CLIC", re, ok); await O.pause(1500); return ok; };
  console.log("ELV", await ev(() => Object.keys(ELV).join(",")));
  await ev(() => ACT.lancerSeance("3 ESSAI", "essai", {})); await O.pause(600);
  await ev(() => ACT.appelFini(["yvon_adam"])); await O.pause(500);
  await ev(() => Promise.all(SCN.presents().map(x => ELV.cocher(1, 8, x).then(() => ELV.commencer(x, 1))))); await O.pause(500);
  for(let qi = 0; qi < 3; qi++){
    await ev(q => ACT.lancerQuestion(q), qi); await O.pause(500); await ev(() => ACT.autoriserReponse()); await O.pause(3800);
    for(let tour = 1; tour <= 2; tour++){
      await ev(() => { const e = SCN.etat(), q = SCN.ev().questions[e.qi]; return Promise.all(SCN.presents().filter(x => SCN.cote(x) === e.cote).map((x, i) => ELV.repondre(e.qi, i % 3 ? q.bonnes : [q.choix.map((c, j) => j).find(j => q.bonnes.indexOf(j) < 0)], x))); }); await O.pause(400);
      await ev(() => { const e = SCN.etat(); return Promise.all(SCN.presents().filter(x => SCN.reponse(x, e.qi)).map(x => ELV.direB(e.qi, "oui", x))); }); await O.pause(400);
      if(tour === 1){ await ev(() => ACT.tourSuivant()); await O.pause(500); }
    }
    await ev(() => ACT.cloreQuestion()); await O.pause(600);
  }
  // à partir d'ici, par le geste à la console
  await clic(/Lancer l'autoévaluation|estimation/); await cmp(p, "c-estim");
  await ev(() => Promise.all(SCN.presents().map((x, i) => ELV.estimer(["vert", "bleu", "orange", "rouge"][i % 4], x)))); await O.pause(800);
  await clic(/Lancer la correction/); await O.pause(500);
  await ev(() => Promise.all(SCN.presents().slice(1).map(x => ELV.cocher(2, 5, x).then(() => ELV.commencer(x, 2))))); await O.pause(800);
  await cmp(p, "c-attest2");
  await ev(() => Promise.all(SCN.presents().slice(0, 1).map(x => ELV.cocher(2, 5, x).then(() => ELV.commencer(x, 2))))); await O.pause(1000);
  await clic(/Commencer la correction/); await cmp(p, "c-corr-q2-avant");
  for(let k = 0; k < 3; k++){
    await ev(() => { const e = SCN.etat(), q = SCN.ev().questions[e.qi]; return Promise.all(SCN.presents().map((x, i) => { const r = SCN.reponse(x, e.qi); const faux = [q.choix.map((c, j) => j).find(j => q.bonnes.indexOf(j) < 0)]; return ELV.lire(e.qi, i === 1 && !window.__tr ? (window.__tr = e.qi + 1, faux) : r ? r.choix : "aucun", x); })); }); await O.pause(800);
    if(k === 0) await cmp(p, "c-corr-q2-lu");
    await clic(/Révéler/); if(k === 0) await cmp(p, "c-corr-q2-apres");
    if(k < 2) await clic(/Question suivante/);
  }
  await clic(/co-?évaluation|Co-évaluation|coéval/i);
  const pr = await ev(() => SCN.presents());
  const tq = await ev(() => window.__tr - 1); console.log("TROUVEE qi", tq, "élève", pr[1], "");
  await ev(o => Promise.all(o.pr.map((x, i) => i === 1 ? ELV.coeval("mal", o.tq, SCN.ev().questions[o.tq].bonnes, x) : i === 2 ? ELV.coeval("mal", 1, null, x) : ELV.coeval("ok", null, null, x))), {pr, tq}); await O.pause(1500);
  await cmp(p, "c-coeval-attente");
  console.log("BOUTONS ALERTE", JSON.stringify(await p.evaluate(() => [...document.querySelectorAll("button")].filter(b => b.offsetParent && /raison|feuille dit|relis|⛔/.test(b.textContent)).map(b => (b.disabled ? "🚫" : "") + b.textContent.trim().slice(0, 80)))));
  await cmp(p, "c-coeval-attente");
  console.log("ALERTES TEXTE\n" + (await O.texte(p)).split("\n").filter(l => /pense qu|Donner raison|Trouvée|trouvée|passe de|point/.test(l)).join("\n"));
  for(const re of [/^Donner raison à/, /^Donner raison à/]){ await clic(re); console.log("APRES\n" + (await O.texte(p)).split("\n").filter(l => /Alerte tranchée|reste à|passe à|note provisoire|Défaire/.test(l)).join("\n")); }
  await cmp(p, "c-coeval-tranche");
  await clic(/Afficher leur bilan/); await cmp(p, "c-bilan");
  await clic(/Terminer la séance/); await O.pause(500); await clic(/Terminer/); await O.pause(800);
  console.log("FIN\n" + (await O.texte(p)).split("\n").filter(l => l.trim()).slice(0, 25).join(" | "));
  console.log("ERREURS", JSON.stringify(p.__err || []));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
