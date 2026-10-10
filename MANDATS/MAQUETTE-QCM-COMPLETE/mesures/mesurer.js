// Les mesures (mandat §5.1, refaites au complément 1, défaut 3) : sur une vraie demi-tablette, avec le CSS de la maquette,
// la plus longue longueur d'un choix qui tient, tous les choix à la même longueur, pour 4, 5 et 6 choix et un énoncé de 40 à 300 caractères.
//   node mesures/mesurer.js <maquette-qcm-vN.html> [sortie.json]
// La règle :
//   1. une seule répartition, la même pour 4, 5 et 6 choix : tous les choix à la même longueur (la règle 4 du prompt) ;
//   2. la limite est la longueur d'un choix : la plus longue qui tient sur les trois écrans (la réponse, B, la lecture du voisin) ;
//   3. l'énoncé va de 40 à 300 caractères, par pas de 20 ; la longueur d'un choix avance par pas de 5, depuis 5 :
//      la limite est la dernière longueur avant le premier échec, donc toutes les plus courtes tiennent (elle est suffisante) ;
//   4. elle ne croît jamais, ni avec le nombre de choix, ni avec l'énoncé (vérifié ici, et par la garde 4 du banc).
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const M = require("./mesure-page.js");
const FICHIER = path.resolve(process.argv[2]), SORTIE = process.argv[3] || null;
const PAS_ENONCE = 20, PAS_CHOIX = 5, ENONCES = []; for(let e = 40; e <= 300; e += PAS_ENONCE) ENONCES.push(e);
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1280, height: 800}});
  const etalon = await M.etalon(p, FICHIER);
  const res = {etalon_q3_reste_px: etalon, marge_px: M.MARGE, pas_enonce: PAS_ENONCE, pas_choix: PAS_CHOIX, ecrans: M.ECRANS, par_choix: {}};
  for(const n of [4, 5, 6]){
    res.par_choix[n] = [];
    for(const e of ENONCES){
      let l = 0, r = null, avant = null;
      while(true){ const x = await M.restes(p, e, n, l + PAS_CHOIX); if(!M.tient(x)){ r = x; break; } l += PAS_CHOIX; avant = x; if(l > 400) break; }
      res.par_choix[n].push({enonce: e, limite: l, reste: avant || {reponse: null, b: null, lecture: null}, reste_plus_pas: r});
      process.stderr.write(n + " choix, énoncé " + e + " : " + l + "\n");
    }
  }
  // l'étalon rejoué : la vraie question 3 de 3e, ses vrais choix, sur les trois écrans
  const q3 = await p.evaluate(() => ({e: EV3E.questions[2].enonce, c: EV3E.questions[2].choix}));
  res.q3_reel = {};
  for(const ecran of M.ECRANS) res.q3_reel[ecran] = await p.evaluate(M.mesureDansLaPage, [ecran, q3.e, q3.c, M.MARGE]);
  res.q3_longueurs = {enonce: q3.e.length, choix: q3.c.map(c => c.length), plus_long: Math.max(...q3.c.map(c => c.length))};
  res.texte_limites = texteLimites(res);
  console.log(JSON.stringify(res, null, 1));
  if(SORTIE) fs.writeFileSync(SORTIE, JSON.stringify(res, null, 1) + "\n");
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });

// Le texte qui remplace {{LIMITES}} (règle 12 du prompt) : la limite de l'énoncé, puis celle d'un choix pour « 4 choix ou moins »,
// 5 et 6, par tranche d'énoncé ; les tranches de même limite se regroupent ; un nombre de choix qui ne tient plus est dit.
function texteLimites(res){
  const L = res.par_choix;
  const maxEnonce = Math.max(...L[4].filter(x => x.limite > 0).map(x => x.enonce));
  const tranches = pts => { const t = []; pts.filter(x => x.enonce <= maxEnonce).forEach(x => { const d = t[t.length - 1]; if(d && d.limite === x.limite) d.jusqua = x.enonce; else t.push({limite: x.limite, jusqua: x.enonce}); }); return t; };
  const phrase = (lib, pts) => {
    const t = tranches(pts).filter(x => x.limite > 0), tout = tranches(pts);
    if(!t.length) return lib + " : jamais.";
    const morceaux = t.map((x, i) => x.limite + " caractères par choix " + (i === 0 ? "si l'énoncé fait " + x.jusqua + " caractères ou moins" : "jusqu'à " + x.jusqua));
    const fin = tout[tout.length - 1].limite === 0 ? " ; au-delà de " + t[t.length - 1].jusqua + " caractères d'énoncé, pas de " + lib.replace(/^Avec /, "") : "";
    return lib + " : " + morceaux.join(", ") + fin + ".";
  };
  return "chaque question doit tenir sur une demi-tablette, choix compris. Compte les caractères, espaces comprises. L'énoncé fait " + maxEnonce + " caractères au plus. Les choix d'une question ont tous à peu près la même longueur, et aucun ne dépasse la limite. "
    + phrase("Avec 4 choix ou moins", L[4]) + " " + phrase("Avec 5 choix", L[5]) + " " + phrase("Avec 6 choix", L[6]);
}
