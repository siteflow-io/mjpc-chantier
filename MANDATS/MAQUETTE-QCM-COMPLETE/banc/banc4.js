// Les gardes 16 à 20 du complément 4, jouées par le banc unique (banc.js), ou seules : node banc/banc4.js <maquette.html> [sortie.txt]
// G4SEUL=17,18 : ne jouer que ces gardes (mise au point) ; la livraison les joue toutes.
// EXPLO=fichier.json : reprendre une exploration déjà faite de la même version (garde 16), au lieu de la refaire.
// G16_915=0 : ne pas rejouer les gardes 9 à 15 sur les destinations (mise au point) ; la livraison les rejoue.
const path = require("path"), fs = require("fs");
const G3 = require("./gardes3.js");
const G4 = require("./gardes4.js");
const B3 = require("./banc3.js");
const X = require("./explorer.js");
const QUELLES = process.env.G4SEUL ? process.env.G4SEUL.split(",").map(Number) : [16, 17, 18, 19, 20];
const joue = n => QUELLES.includes(n);

async function gardes4(navig, fichier, scenes, verif, journal, opts){
  opts = opts || {};
  const url = "file://" + fichier, parId = {}; scenes.forEach(s => { parId[s.id] = s; });
  const ref7 = opts.v7 || path.join(__dirname, "..", "maquette-qcm-v7.html");
  const ver = (/maquette-qcm-(v\w+)\.html$/.exec(fichier) || [, "dev"])[1];
  // 16.1 et 16.2 : les destinations, jusqu'à ce qu'aucune nouvelle n'apparaisse
  let explo;
  if(process.env.EXPLO && fs.existsSync(process.env.EXPLO)) explo = JSON.parse(fs.readFileSync(process.env.EXPLO, "utf8"));
  else { explo = await X.explorer(navig, fichier, scenes, {trace: opts.trace}); if(opts.explo) fs.writeFileSync(opts.explo, JSON.stringify(explo)); }
  if(opts.liste) X.ecrireListe(explo, opts.liste);
  explo.gestes.filter(g => g.erreur).forEach(g => verif(false, "garde 16. " + g.page + " : la page n'a pas pu être explorée — " + g.erreur));
  explo.gestes.filter(g => g.d && !parId[X.base(g.d)]).forEach(g => verif(false, "garde 16. " + g.page + " : « " + g.lib + " » mène à « " + g.d + " », qui n'est pas une scène"));
  journal.push("garde 16 : " + explo.destinations.length + " destinations atteintes par le geste, au-delà des " + scenes.length + " scènes");
  const dests = explo.destinations.map(d => ({id: d.cle, vue: d.vue, moment: G4.momentPage(d.cle, parId), appareil: (parId[d.base] || {}).appareil, base: d.base}));
  const pages = scenes.map(s => ({id: s.id, vue: s.vue, moment: s.moment, base: s.id})).concat(dests);
  const seuls = opts.seul ? String(opts.seul).split(",") : null, retenu = id => !seuls || seuls.includes(id) || seuls.includes(X.base(id));
  const aFaire = pages.filter(p => retenu(p.id));

  const nouvelle = async T => { const ctx = await navig.newContext({viewport: {width: T.w, height: T.h}}); const page = await ctx.newPage();
    page.on("dialog", d => d.dismiss().catch(() => {})); await page.addInitScript(G3.ESPION_G3); return {ctx, page}; };
  const ouvrir = async (page, f, cle, sansCap) => { await page.goto("about:blank"); await page.goto("file://" + f + "#scene=" + cle + (sansCap ? "" : "&cap=1"));
    await page.waitForFunction(i => window.SCENE_PRETE === i, X.base(cle), {timeout: 10000}).catch(() => {}); await page.waitForTimeout(80); };
  const aide = await (await navig.newContext()).newPage(); await aide.goto("about:blank");
  const site = [...G3.classesSite()], structRef = {}, releves = {};
  async function refDe(b){ if(structRef[b] !== undefined) return structRef[b];
    const T = (G3.TAILLES[parId[b].vue] || [{w: 1536, h: 864}])[0], o = await nouvelle({w: 1536, h: T.h > 864 ? T.h : 864});
    await ouvrir(o.page, fichier, b); structRef[b] = await o.page.evaluate(G4.lireStructure); await o.ctx.close(); return structRef[b]; }

  async function unePage(p){
    const R = [], tailles = G3.TAILLES[p.vue] || [{w: 1280, h: 800}];
    const essai = async (n, f) => { if(!joue(n)) return; try { await f(); } catch(e){ R.push("garde " + n + ". " + p.id + " : la garde n'a pas pu être jouée — " + String(e.message || e).split("\n")[0].slice(0, 160)); } };
    for(let ti = 0; ti < tailles.length; ti++){
      const T = tailles[ti], o = await nouvelle(T);
      try {
        await ouvrir(o.page, fichier, p.id);
        if(ti === 0){
          await essai(16, async () => { const lu = await o.page.evaluate(G4.lireStructure); R.push(...G4.garde16Structure(p.id, lu, p.id !== p.base ? await refDe(p.base) : null)); });
          await essai(18, async () => { R.push(...G4.garde18(p.id, p.vue, await o.page.evaluate(G4.lireMoment18), p.moment, parId)); });
        }
        await essai(19, async () => { R.push(...await G4.garde19(o.page, aide, p.id, T, site)); });
        await essai(20, async () => { if(!["tablette", "eleve", "tableau"].includes(p.vue) || T.w === 1920 || !fs.existsSync(ref7)) return;
          // l'écran tel que l'élève le voit, hors du mode capture (comme scripts/eleve-diff.js de la conscience)
          await ouvrir(o.page, fichier, p.id, true); const b9 = await o.page.evaluate(G4.lireBlocs20); await ouvrir(o.page, ref7, p.id, true); const b7 = await o.page.evaluate(G4.lireBlocs20);
          const r = {}; b9.forEach(x => { r[x.bloc] = {v9: x.t, v7: ""}; }); b7.forEach(x => { (r[x.bloc] = r[x.bloc] || {v9: ""}).v7 = x.t; });
          releves[p.id + "@" + T.w] = r; });
      } catch(e){ R.push("gardes 16 à 20. " + p.id + " : la page n'a pas pu être jouée — " + String(e.message || e).split("\n")[0]); }
      await o.ctx.close();
    }
    return R;
  }
  const res = new Array(aFaire.length); let suivant = 0;
  async function ouvrier(){ while(suivant < aFaire.length){ const k = suivant++; res[k] = await unePage(aFaire[k]); if(opts.trace) process.stderr.write("\r16-20 : " + suivant + " / " + aFaire.length + "   "); } }
  await Promise.all([ouvrier(), ouvrier(), ouvrier(), ouvrier()]);
  res.forEach((R, i) => { verif(true, "gardes 16 à 20. " + aFaire[i].id + " : jouées"); R.forEach(x => verif(false, x)); });

  // 17 : chaque geste qui ouvre un PDF, et la scène du PDF elle-même
  if(joue(17)){
    const pdfs = []; const vu = new Set();
    explo.gestes.filter(g => g.d && X.base(g.d) === "x632-pdf").forEach(g => { const k = g.page + "→" + g.d; if(!vu.has(k)){ vu.add(k); pdfs.push({source: g.page, d: g.d}); } });
    if(parId["x632-pdf"]) pdfs.push({source: "x632-pdf", d: "x632-pdf"});
    const o = await nouvelle({w: 1536, h: 864});
    for(const x of pdfs){
      if(!retenu(x.source)) continue;
      const k = G4.momentPage(x.source, parId), id = G4.seancePage(x.source, k);
      await ouvrir(o.page, fichier, x.d); await o.page.waitForFunction(() => window.SCENE_PRETE === "x632-pdf", null, {timeout: 10000}).catch(() => {});
      const lu = await o.page.evaluate(G4.lirePdf);
      G4.garde17(x.source, x.d, lu, k, id).forEach(e => verif(false, e));
      if(x.source === "x632-pdf") verif(!!lu && lu.srcdoc === G4.pdfFige(), "garde 17. x632-pdf : le PDF construit pour la séance de 3e est le PDF figé de la v8, au caractère près", lu ? (lu.srcdoc || "").length + " caractères pour " + G4.pdfFige().length : "pas de PDF");
      verif(true, "garde 17. « " + x.source + " » → " + x.d + " : le PDF lu (séance " + id + ", moment " + k + ")");
    }
    await o.ctx.close();
    journal.push("garde 17 : " + pdfs.length + " gestes qui ouvrent un PDF");
  }
  // 20 : la liste des changements vus par l'élève, contre les relevés
  if(joue(20)){ const L = G4.chargerListe20(); G4.garde20(releves, L).forEach(e => verif(false, e)); verif(true, "garde 20. les textes vus par l'élève, v7 contre " + ver);
    journal.push("garde 20 : " + Object.keys(releves).length + " pages d'élève comparées à la v7 · " + L.lignes.length + " lignes nommées dans eleve-v7-v9.json");
    if(opts.releves) fs.writeFileSync(opts.releves, JSON.stringify(releves)); }
  await aide.context().close();
  // 16.3 : chaque destination est jouée par les gardes 9 à 15 comme une scène, au moment que déclarent sa scène et ses paramètres
  if(joue(16) && process.env.G16_915 !== "0"){
    const dd = dests.filter(d => retenu(d.id)).map(d => Object.assign({}, parId[d.base], {id: d.id, moment: d.moment, n: null}));
    await B3.gardes3(navig, fichier, dd, verif, journal, {seul: null, destinations: true, trace: opts.trace});
  }
  return {pages: aFaire.length, destinations: dests.length};
}
module.exports = {gardes4};

if(require.main === module){
  const { chromium } = require("/opt/node22/lib/node_modules/playwright");
  const FICHIER = path.resolve(process.argv[2]), SORTIE = process.argv[3] || null;
  let nb = 0; const echecs = [], journal = [];
  const verif = (ok, quoi, d) => { nb++; if(!ok) echecs.push(quoi + (d ? " — " + d : "")); return ok; };
  (async () => {
    const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
    const p = await navig.newPage(); await p.goto("file://" + FICHIER + "#scene=c-evals"); await p.waitForTimeout(500);
    const scenes = await p.evaluate(() => window.LISTE_SCENES); await p.close();
    await gardes4(navig, FICHIER, scenes, verif, journal, {seul: process.env.SEUL || null, trace: true, explo: process.env.EXPLO_OUT, liste: process.env.LISTE, releves: process.env.RELEVES});
    await navig.close();
    const L = ["Gardes 16 à 20 du complément 4 — " + path.basename(FICHIER) + (process.env.G4SEUL ? " · gardes " + process.env.G4SEUL : "") + " · " + new Date().toISOString(), journal.join(" · "),
      "Vérifications : " + nb + " · échecs : " + echecs.length];
    if(echecs.length) L.push("", "ÉCHECS :", ...echecs.map((e, i) => (i + 1) + ". " + e)); else L.push("Zéro défaut.");
    const txt = L.join("\n") + "\n"; if(SORTIE) fs.writeFileSync(SORTIE, txt);
    console.log(txt.length > 15000 ? txt.slice(0, 15000) + "\n… (" + echecs.length + " échecs)" : txt);
    process.exit(echecs.length ? 1 : 0);
  })().catch(e => { console.error(e); process.exit(2); });
}
