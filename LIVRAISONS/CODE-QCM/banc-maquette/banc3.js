// Les gardes 9 à 15 du complément 3, jouées par le banc unique (banc.js), ou seules : GARDES=c3.
// Elles passent par le geste dans Chromium, aux tailles de chaque vue (gardes3.js, TAILLES), et lisent l'intérieur des cadres.
// G3SEUL=9,12 : ne jouer que ces gardes (pour la mise au point) ; la livraison les joue toutes.
const path = require("path"), fs = require("fs");
const G = require("./gardes.js");
const G3 = require("./gardes3.js");
const QUELLES = process.env.G3SEUL ? process.env.G3SEUL.split(",").map(Number) : [9, 10, 11, 12, 13, 14, 15];
const joue = n => QUELLES.includes(n);

async function gardes3(navig, fichier, scenes, verif, journal, opts){
  opts = opts || {};
  const url = "file://" + fichier, src = fs.readFileSync(fichier, "utf8");
  const ref7 = opts.v7 || path.join(path.dirname(fichier), "maquette-qcm-v7.html");
  const parId = {}; scenes.forEach(s => { parId[s.id] = s; });
  const A = G3.argsPage(), K = G3.classement(), site = [...G3.classesSite()];
  // SEUL : une liste de scènes (« c-evals,c-seances », « t-* ») ; un seul mot : les scènes qui le contiennent, comme dans banc.js
  const aFaire = scenes.filter(sc => !opts.seul || (/[,*]/.test(opts.seul) ? opts.seul.split(",").some(x => x === sc.id || (x.endsWith("*") && sc.id.startsWith(x.slice(0, -1)))) : sc.id.includes(opts.seul)));
  const nouvelle = async (T) => { const ctx = await navig.newContext({viewport: {width: T.w, height: T.h}}); const page = await ctx.newPage();
    const err = []; page.on("pageerror", e => err.push(e.message)); page.on("dialog", d => d.dismiss().catch(() => {})); await page.addInitScript(G3.ESPION_G3); return {ctx, page, err}; };
  const ouvrirA = async (page, f, id) => { await page.goto("about:blank"); await page.goto("file://" + f + "#scene=" + id + "&cap=1");
    await page.waitForFunction(i => window.SCENE_PRETE === i, G3.baseDe(id), {timeout: 10000}).catch(() => {}); await page.waitForTimeout(60); };
  const tailles = sc => G3.TAILLES[sc.vue] || [{w: 1280, h: 800}];
  const destinations = [], eleve7 = {}, eleve8 = {}, journal9 = [];
  const INV = G.inventaires(), RET = G.retraits(); const parScene = {}; INV.forEach(v => v.scenes.forEach(s => { (parScene[s] = parScene[s] || []).push(v); }));
  let gestes = 0, bulles = 0;

  async function uneScene(sc){
    const R = [];
    // une garde qui échoue sur une scène est un défaut, pas un arrêt : les autres gardes de la scène sont jouées
    const essai = async (n, f) => { if(!joue(n)) return; try { await f(); } catch(e){ R.push("garde " + n + ". " + sc.id + " : la garde n'a pas pu être jouée — " + String(e.message || e).split("\n")[0].slice(0, 160)); } };
    const T0 = tailles(sc)[0];
    const o = await nouvelle(T0);
    try {
      await ouvrirA(o.page, fichier, sc.id);
      // garde 9
      await essai(9, async () => {
        const lu = await o.page.evaluate(G3.lireTextes9);
        R.push(...G3.garde9Scene(sc, lu, K, journal9));
        if(G3.vueEleve(sc)) eleve8[sc.id] = await o.page.evaluate(G3.lireTextesEleve);
      });
      // garde 10
      await essai(10, async () => {
        if(G3.VUES_PAUL.includes(sc.vue)){
          const lu = await o.page.evaluate(G3.lireBulles10); bulles += lu.elements.length;
          R.push(...G3.garde10Scene(sc, lu));
          // 10.4 : les infobulles de l'existant, mot pour mot (la comparaison de la garde 1)
          if(parScene[sc.id]){ const vu = await o.page.evaluate(G.extraireEcran, {phrases: false}); for(const inv of parScene[sc.id]) G.garde1(sc.id, inv, vu, RET).filter(x => /infobulle/.test(x)).forEach(x => R.push("garde 10. " + x.replace(/^garde 1\. /, ""))); }
          await ouvrirA(o.page, fichier, sc.id);
          for(const T of tailles(sc)){ await o.page.setViewportSize({width: T.w, height: T.h}); await ouvrirA(o.page, fichier, sc.id); R.push(...await G3.garde10Bulles(o.page, sc, T)); }
          await o.page.setViewportSize({width: T0.w, height: T0.h});
        } else { await ouvrirA(o.page, fichier, sc.id); R.push(...G3.garde10Eleve(sc, await o.page.evaluate(G3.lireBulles10))); }
      });
      // garde 11
      await essai(11, async () => {
        await ouvrirA(o.page, fichier, sc.id);
        const lu = await o.page.evaluate(G3.lireListes11);
        if(lu){ R.push(...G3.garde11Scene(sc, lu)); R.push(...await G3.garde11Gestes(o.page, sc, lu, G3.momentDe(sc))); }
      });
      // garde 13
      await essai(13, async () => {
        await ouvrirA(o.page, fichier, sc.id);
        R.push(...G3.garde13Scene(sc, await o.page.evaluate(G3.lireChiffres13, A)));
        R.push(...await G3.garde13Fin(o.page, url, sc));
      });
      // garde 14, à chaque taille de la vue
      await essai(14, async () => {
        for(const T of tailles(sc)){
          await o.page.setViewportSize({width: T.w, height: T.h}); await ouvrirA(o.page, fichier, sc.id);
          const lu = await o.page.evaluate(G3.lireLisibilite, {site, tableau: sc.vue === "tableau"});
          await o.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await o.page.waitForTimeout(40);
          const lu2 = await o.page.evaluate(G3.lireLisibilite, {site, tableau: sc.vue === "tableau"});
          for(const k of ["inatteignable", "petit", "contraste", "emoji", "ponctuation"]) lu[k] = [...new Set(lu[k].concat(lu2[k]))];
          R.push(...G3.garde14(sc, T, lu));
        }
        await o.page.setViewportSize({width: T0.w, height: T0.h});
      });
      // gardes 12 et 15 : la carte des gestes
      if(joue(12) || joue(15)) await essai(joue(12) ? 12 : 15, async () => {
        const carte = await G3.carteScene(o.page, url, sc, A); gestes += carte.liste.length;
        if(joue(12)) R.push(...G3.garde12Scene(sc, carte, parId));
        if(joue(15)){ R.push(...G3.garde15Scene(sc, carte)); R.push(...await G3.garde15Gestes(o.page, url, sc)); }
      });
    } catch(e){ R.push("gardes 9 à 15. " + sc.id + " : la scène n'a pas pu être jouée — " + String(e.message || e).split("\n")[0]); }
    await o.ctx.close();
    return R;
  }

  // Quatre scènes à la fois ; les résultats se rangent dans l'ordre des scènes
  const res = new Array(aFaire.length); let suivant = 0;
  async function ouvrier(){ while(suivant < aFaire.length){ const k = suivant++; res[k] = await uneScene(aFaire[k]); if(opts.trace) process.stderr.write(aFaire[k].id + " "); } }
  await Promise.all([ouvrier(), ouvrier(), ouvrier(), ouvrier()]);
  res.forEach((R, i) => { verif(true, "gardes 9 à 15. " + aFaire[i].id + " : jouées"); R.forEach(x => verif(false, x)); });

  // 9.3 : chaque explication retirée se retrouve à sa place (l'infobulle ou le mode d'emploi), dans la scène que le fichier lui donne
  // (complément 4) sur les destinations (garde 16.3), les gardes jouent page par page ; ces relevés d'ensemble ne se refont pas
  if(joue(9) && !opts.destinations){
    const parDest = {};
    (K.j.textes || []).filter(x => x.categorie === "explication" && x.destination).forEach(x => {
      const d = Object.assign({texte: x.texte, place: x.place || x.texte}, x.destination); const s = d.scene || (d.mode_emploi ? "c-mode-emploi" : (x.scenes || [])[0]);
      if(!s) return; d.scene = s; (parDest[s] = parDest[s] || []).push(d); });
    const o = await nouvelle({w: 1536, h: 864});
    for(const s in parDest){
      if(!parId[s]){ parDest[s].forEach(d => verif(false, "garde 9. l'explication « " + d.texte.slice(0, 60) + "… » : sa scène « " + s + " » n'existe pas")); continue; }
      await ouvrirA(o.page, fichier, s);
      G3.garde9Destinations(await o.page.evaluate(G3.lireDestinations, parDest[s])).forEach(x => verif(false, x));
      verif(true, "garde 9. " + s + " : les explications retirées cherchées à leur place");
    }
    // (complément 4) 9.5 est remplacée par la garde 20 (gardes4.js) : chaque changement vu par l'élève, nommé un par un
    await o.ctx.close();
    journal.push((K.j.textes || []).length + " textes classés dans textes-console.json" + (journal9.length ? " · " + journal9.length + " textes de la maquette sans classement" : ""));
  }
  // 12.4 : ALLER["*"] ne garde que les onglets ; 13.7 : aucune note écrite en dur
  if(joue(12) && !opts.destinations){
    const o = await nouvelle({w: 1536, h: 864}); const onglets = new Set();
    for(const id of ["c-evals", "c-seances", "c-reglages", "c-lancer", "c-sauvegarde"]) if(parId[id]){ await ouvrirA(o.page, fichier, id); (await o.page.evaluate(G3.lireAller)).onglets.forEach(x => onglets.add(x)); }
    await ouvrirA(o.page, fichier, scenes[0].id);
    G3.garde12Aller(await o.page.evaluate(G3.lireAller), onglets).forEach(x => verif(false, x)); verif(true, "garde 12. ALLER[\"*\"] regardé");
    await o.ctx.close();
  }
  if(joue(13) && !opts.destinations){ G3.garde13Sources(src).forEach(x => verif(false, x)); verif(true, "garde 13. les sources cherchées"); }
  journal.push("gardes 9 à 15 : " + aFaire.length + (opts.destinations ? " destinations" : " scènes") + " · " + gestes + " éléments cliquables cliqués · " + bulles + " éléments regardés pour leur infobulle");
  return journal9;
}
module.exports = {gardes3};

// Seules : node banc/banc3.js <maquette.html> [sortie.txt]
if(require.main === module){
  const { chromium } = require("/opt/node22/lib/node_modules/playwright");
  const FICHIER = path.resolve(process.argv[2]), SORTIE = process.argv[3] || null;
  let nb = 0; const echecs = [], journal = [];
  const verif = (ok, quoi, d) => { nb++; if(!ok) echecs.push(quoi + (d ? " — " + d : "")); return ok; };
  (async () => {
    const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
    const p = await navig.newPage(); await p.goto("file://" + FICHIER + "#scene=c-evals"); await p.waitForTimeout(400);
    const scenes = await p.evaluate(() => window.LISTE_SCENES); await p.close();
    await gardes3(navig, FICHIER, scenes, verif, journal, {seul: process.env.SEUL, trace: true});
    await navig.close();
    const L = ["Gardes 9 à 15 du complément 3 — " + path.basename(FICHIER) + (process.env.G3SEUL ? " · gardes " + process.env.G3SEUL : "") + " · " + new Date().toISOString(), journal.join(" · "),
      "Vérifications : " + nb + " · échecs : " + echecs.length];
    if(echecs.length) L.push("", "ÉCHECS :", ...echecs.map((e, i) => (i + 1) + ". " + e)); else L.push("Zéro défaut.");
    const txt = L.join("\n") + "\n"; if(SORTIE) fs.writeFileSync(SORTIE, txt);
    console.log(txt.length > 15000 ? txt.slice(0, 15000) + "\n… (" + echecs.length + " échecs)" : txt);
    process.exit(echecs.length ? 1 : 0);
  })().catch(e => { console.error(e); process.exit(2); });
}
