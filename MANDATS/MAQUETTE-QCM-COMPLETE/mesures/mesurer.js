// Les mesures du mandat §5.1 : sur une vraie demi-tablette (1280 × 800, chaque moitié 640 de large), avec le CSS de la maquette,
// combien de place reste sous l'écran le plus chargé, pour 4, 5 et 6 choix, selon la longueur de l'énoncé et des choix.
//   node mesures/mesurer.js <maquette-qcm-vN.html> [sortie.json]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const FICHIER = path.resolve(process.argv[2]), SORTIE = process.argv[3] || null;
const MOTS = "la proposition relative complète toujours le nom antécédent qui la précède dans la phrase complexe et le verbe conjugué de la principale reste entier quand le sujet est loin".split(" ");
function texte(n, decal){ let t = "", i = decal || 0; while(t.length < n){ t += (t ? " " : "") + MOTS[i % MOTS.length]; i++; } return t.slice(0, n).replace(/\s+\S*$/, "") || t.slice(0, n); }
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1280, height: 800}});
  await p.goto("file://" + FICHIER + "#scene=t-annexe&cap=1");
  await p.waitForFunction(() => window.SCENE_PRETE === "t-annexe");
  // l'étalon : la vraie question 3 de l'évaluation de 3e (6 choix longs), sur l'écran de réponse
  // le reste : sous la carte de l'élève, jusqu'au bas de sa moitié (la mesure du tour 610 : 67 px pour la vraie Q3).
  // Une moitié tient tant que ce reste couvre la marge du bas de la page (16 px) ; les recherches comptent le reste au-delà de cette marge.
  const RESTE = () => Array.from(document.querySelectorAll(".moitie")).map(m => { var c = m.querySelector(".eleve-card"); return c && Math.round(m.getBoundingClientRect().bottom - c.getBoundingClientRect().bottom); });
  const reste = () => p.evaluate("(" + RESTE.toString() + ")()");
  const etalon = (await reste())[0];
  const MARGE = 16;
  await p.evaluate(m => { window.MARGE = m; }, MARGE);
  // un écran : « reponse » (le clic, l'état le plus chargé : tous les choix cliqués), « b » (« dit-elle la même chose que ton clic ? »), « lecture » (A)
  async function mesure(ecran, enonce, choix){
    return p.evaluate(([ecran, enonce, choix, MARGE]) => {
      var q = {enonce:enonce, choix:choix, bonnes:[0], niveau:"approfondi", reflexion:30, reponse:20, competences:[], explication:""};
      var ev = {titre:"3e- éval 1 Analyse logique - Construire une phrase complexe", mode:"strict", questions:[q, q, q]};
      var n = choix.length, ordre = []; for(var i = 0; i < n; i++) ordre.push(i);
      var sv = {EV:EV, ORD:ORD, LU:LU, TABL:TABL};
      EV = ev; ORD = [{J:ordre, M:ordre}, {J:ordre, M:ordre}, {J:ordre, M:ordre}]; LU = {J:[ordre, ordre, ordre], M:[ordre, ordre, ordre]}; TABL = {J:[ordre, ordre, ordre], M:[ordre, ordre, ordre]};
      var el;
      try {
        el = ecran === "reponse" ? EcrReponse(J, 2, ordre, ordre, 2, ev) : ecran === "b" ? EcrDeclareFlux(J, 2, ordre, 4) : EcrLecture(J, 2, true, 3);
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(Tablette(el, el), document.getElementById("root"));
      } finally { EV = sv.EV; ORD = sv.ORD; LU = sv.LU; TABL = sv.TABL; }
      var m = document.querySelector(".moitie"), c = m.querySelector(".eleve-card");
      return Math.round(m.getBoundingClientRect().bottom - c.getBoundingClientRect().bottom) - MARGE;
    }, [ecran, enonce, choix, MARGE]);
  }
  const res = {etalon_q3_reste_px: etalon, ecrans: {}};
  for(const ecran of ["reponse", "b", "lecture"]){
    res.ecrans[ecran] = {};
    for(const n of [4, 5, 6]){
      const lignes = [];
      for(const le of [60, 120, 180, 240, 300]){
        // la plus grande longueur de choix (tous les choix à cette longueur) qui laisse au moins 0 px
        let bas = 5, haut = 260;
        if(await mesure(ecran, texte(le), Array.from({length:n}, (_, i) => texte(bas, i))) < 0){ lignes.push({enonce:le, choix_max:0}); continue; }
        while(haut - bas > 1){ const mil = (bas + haut) >> 1; (await mesure(ecran, texte(le), Array.from({length:n}, (_, i) => texte(mil, i)))) >= 0 ? bas = mil : haut = mil; }
        lignes.push({enonce:le, choix_max:bas});
      }
      res.ecrans[ecran][n] = lignes;
    }
  }
  // La longueur totale des choix, répartie comme dans la vraie Q3 (un choix long, les autres moyens) : la plus grande qui tient sur les trois écrans
  const PROFIL = [49, 44, 60, 58, 137, 54];
  res.total = {};
  for(const n of [4, 5, 6]){
    const prof = PROFIL.slice(0, n), somme = prof.reduce((a, b) => a + b, 0);
    res.total[n] = [];
    for(const le of [80, 100, 120, 150, 200, 250]){
      const choixDe = T => prof.map((x, i) => texte(Math.max(4, Math.round(x * T / somme)), i));
      // balayage par pas de 10 : la mise en page change quand un choix dépasse 40 caractères (un choix par ligne),
      // la hauteur ne croît donc pas toujours avec la longueur ; la limite est la plus longue qui tient, toutes les plus courtes tenant aussi
      const tient = async T => { for(const ecran of ["reponse", "b", "lecture"]) if(await mesure(ecran, texte(le), choixDe(T)) < 0) return false; return true; };
      let T = 40; while(T <= 1200 && await tient(T)) T += 10;
      res.total[n].push({enonce:le, total_max:T - 10});
    }
  }
  // l'étalon rejoué par le mesureur : la vraie Q3, ses vrais choix, sur les trois écrans
  const q3 = await p.evaluate(() => ({e:EV3E.questions[2].enonce, c:EV3E.questions[2].choix}));
  res.q3_reel = {};
  for(const ecran of ["reponse", "b", "lecture"]) res.q3_reel[ecran] = await mesure(ecran, q3.e, q3.c);
  res.q3_longueurs = {enonce:q3.e.length, choix:q3.c.map(c => c.length), total_choix:q3.c.join("").length};
  console.log(JSON.stringify(res, null, 1));
  if(SORTIE) fs.writeFileSync(SORTIE, JSON.stringify(res, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
