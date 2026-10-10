// Le banc unique de la maquette complète du QCM (mandat §8). Une commande rejoue tout :
//   node banc/banc.js <maquette-qcm-vN.html> <étape> [sortie.txt]
// Il échoue (code 1) si une seule vérification échoue. Tout passe par Chromium, par le geste (clic, clavier) :
// jamais un appel de fonction de la maquette pour agir. Les lectures (textes, positions) se font dans la page.
// Les vérifications 2, 3, 4, 5, 8 et 9 portent sur les scènes déjà relues par une étape (etape ≤ l'étape jouée) ;
// les vérifications 1, 6 et 7 portent sur toutes les scènes dès l'étape 1. À l'étape 5, tout porte sur tout.
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const C = require("./controles.js");
const G = require("./gardes.js");
// GARDES=0 : sans les gardes du complément 1 ; GARDES=seules : les gardes seules (ni clics, ni vérifications 1 à 9 par scène)
const GARDES = process.env.GARDES || "oui";
const RACINE = path.join(__dirname, "..");
const FICHIER = path.resolve(process.argv[2]);
const ETAPE = +process.argv[3] || 1;
const SORTIE = process.argv[4] || null;
const SEUL = process.env.SEUL || null;

const VUES = {
  tablette:  [{w:1280, h:800}],
  console:   [{w:1366, h:768}, {w:1536, h:864}, {w:1920, h:1080}],
  telephone: [{w:390, h:844}],
  tableau:   [{w:1280, h:800}],
  eleve:     [{w:1280, h:800}, {w:390, h:844}]
};

let nb = 0; const echecs = []; const journal = [];
function verif(ok, quoi, detail){ nb++; if(!ok) echecs.push(quoi + (detail ? " — " + detail : "")); return ok; }

if(SORTIE && fs.existsSync(SORTIE)) fs.unlinkSync(SORTIE);   // (garde, défaut 28) jamais une sortie d'un banc précédent
(async () => {
  const corpus = C.corpus(RACINE);
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const url = "file://" + FICHIER;

  // L'instrumentation : toute boîte système, tout réseau, tout stockage est relevé
  const espion = () => {
    window.__INTERDITS = [];
    const note = n => function(){ window.__INTERDITS.push(n); };
    window.alert = note("alert"); window.confirm = note("confirm"); window.prompt = note("prompt");
    window.fetch = note("fetch"); window.open = note("window.open"); window.print = note("print");
    window.XMLHttpRequest = function(){ window.__INTERDITS.push("XMLHttpRequest"); };
    window.WebSocket = function(){ window.__INTERDITS.push("WebSocket"); };
    ["localStorage", "sessionStorage", "indexedDB"].forEach(k => { try { Object.defineProperty(window, k, {get(){ window.__INTERDITS.push(k); return undefined; }}); } catch(e){} });
  };
  async function ouvrir(w, h, id, extra){
    const ctx = await navig.newContext({viewport: {width: w, height: h}});
    const page = await ctx.newPage();
    const err = [], reseau = [];
    page.on("pageerror", e => err.push(e.message));
    page.on("console", m => { if(m.type() === "error") err.push("console : " + m.text()); });
    page.on("dialog", d => { err.push("boîte système : " + d.type()); d.dismiss().catch(() => {}); });
    page.on("request", r => { const u = r.url(); if(!/^(file|data|about|blob):/.test(u)) reseau.push(u); });
    await page.addInitScript(espion);
    await page.goto(url + "#scene=" + id + (extra || ""));
    await page.waitForFunction(i => window.SCENE_PRETE === i, id, {timeout: 10000});
    await page.waitForTimeout(80);
    return {ctx, page, err, reseau};
  }

  // 0. La maquette elle-même : sans réseau, sans boîte système, sans stockage, dans son source
  const src = fs.readFileSync(FICHIER, "utf8");
  for(const motif of C.INTERDITS_SOURCE) verif(!motif.re.test(src), "6. source : aucun « " + motif.nom + " »");
  verif(!/<script[^>]+src=|<link[^>]+href=/i.test(src), "6. source : aucun script ni style externe");

  const p0 = await ouvrir(1280, 800, "c-evals");
  const scenes = await p0.page.evaluate(() => window.LISTE_SCENES);
  await p0.ctx.close();
  verif(scenes && scenes.length >= 80, "1. la liste des scènes", scenes ? scenes.length + " scènes" : "absente");
  journal.push(scenes.length + " scènes");

  // Le sommaire ⚙ : il s'ouvre, liste toutes les scènes, et mène à chacune, par le geste
  {
    const o = await ouvrir(1366, 768, scenes[0].id);
    await o.page.click(".som-gear");
    const n = await o.page.locator(".som-l").count();
    verif(n === scenes.length, "1. ⚙ le sommaire liste toutes les scènes", n + " / " + scenes.length);
    const cible = scenes[Math.floor(scenes.length / 2)].id;
    await o.page.click('.som-l[href="#scene=' + cible + '"]');
    await o.page.waitForFunction(i => window.SCENE_PRETE === i, cible);
    verif(await o.page.locator("#sommaire").count() === 0, "1. ⚙ un clic sur une scène ferme le sommaire et l'ouvre");
    await o.page.click(".som-gear"); await o.page.keyboard.press("Escape");
    verif(await o.page.locator("#sommaire").count() === 0, "1. ⚙ Échap ferme le sommaire");
    verif(o.err.length === 0, "1. ⚙ aucune erreur de page", o.err.join(" | "));
    await o.ctx.close();
  }

  const relu = s => s.etape <= ETAPE;
  // Les gardes du complément 1 : les inventaires de l'existant, par scène ; les retraits et leurs citations ; les mesures
  const INV = GARDES !== "0" ? G.inventaires() : [];
  const parScene = {}; INV.forEach(v => v.scenes.forEach(s => { (parScene[s] = parScene[s] || []).push(v); }));
  const RETRAITS = G.retraits(), ESTIMATIONS = [];
  if(GARDES !== "0"){
    journal.push(INV.length + " écrans de l'existant · " + G.verifierRetraits(verif) + " retraits");
    for(const v of INV) for(const s of v.scenes) verif(scenes.some(x => x.id === s), "garde 1. la scène « " + s + " », qui part de « " + v.ecran + " » (" + v.fichier + "), existe");
    if(G.MESURES){ G.garde4(verif); const pm = await navig.newPage({viewport: {width: 1280, height: 800}}); await G.garde4Echantillon(pm, FICHIER, verif); await pm.close(); }
    else journal.push("sans la garde 4 (MESURES=0)");
  }
  async function verifierScene(sc){
    const R = {n:0, echecs:[]};
    const verif = (ok, quoi, detail) => { R.n++; if(!ok) R.echecs.push(quoi + (detail ? " — " + detail : "")); return ok; };
    const tailles = VUES[sc.vue];
    if(GARDES !== "0" && relu(sc)){
      const T = tailles[0], H = (sc.vh && sc.vue === "console") ? Math.max(sc.vh, T.h) : T.h;
      const g = await ouvrir(T.w, H, sc.id, "&cap=1");
      const vu = await g.page.evaluate(G.extraireEcran, {phrases: true});
      for(const inv of parScene[sc.id] || []){ const pertes = G.garde1(sc.id, inv, vu, RETRAITS); verif(pertes.length === 0, "garde 1. " + sc.id + " : rien de « " + inv.ecran + " » ne se perd", pertes.length + " perte(s)"); pertes.forEach(x => verif(false, x)); }
      G.garde2(sc.id, await g.page.evaluate(G.lireMeta)).forEach(x => verif(false, x)); verif(true, "garde 2. " + sc.id + " : le méta cherché");
      G.garde3(sc.id, await g.page.evaluate(G.lireChiffres)).forEach(x => verif(false, x)); verif(true, "garde 3. " + sc.id + " : les chiffres cherchés");
      G.garde5Scene(sc.id, await g.page.evaluate(G.lireEstimation), ESTIMATIONS).forEach(x => verif(false, x));
      await g.ctx.close();
    }
    if(GARDES === "seules") return R;
    for(let ti = 0; ti < tailles.length; ti++){
      const T = tailles[ti], H = (sc.vh && sc.vue === "console") ? Math.max(sc.vh, T.h) : T.h;
      const o = await ouvrir(T.w, H, sc.id, "&cap=1");
      const tag = sc.id + " @" + T.w + "×" + H;
      const etat = await o.page.evaluate(C.lireScene);
      // 1. la scène s'ouvre sans erreur et montre quelque chose
      verif(o.err.length === 0, "1. " + tag + " : aucune erreur de page", o.err.join(" | "));
      verif(etat.longueurTexte > 20 || etat.iframe, "1. " + tag + " : la scène montre quelque chose", etat.longueurTexte + " caractères");
      // 6. aucun réseau, aucune boîte, aucun stockage
      verif(o.reseau.length === 0, "6. " + tag + " : aucune requête réseau", o.reseau.join(" "));
      verif(etat.interdits.length === 0, "6. " + tag + " : ni boîte système, ni stockage, ni réseau", etat.interdits.join(" "));
      // 7. aucun vrai élève
      const inconnus = C.nomsInconnus(etat.textes.map(x => x.t).join("\n") + "\n" + etat.textesIframe);
      verif(inconnus.length === 0, "7. " + tag + " : seuls les élèves de 3 ESSAI et de la classe de test", inconnus.join(", "));
      if(relu(sc)){
        // 2. le débordement
        for(const d of etat.debords) verif(d.ok, "2. " + tag + " : " + d.quoi, d.detail);
        // 8. aucun chevauchement entre couches, aucun texte coupé
        verif(etat.chevauchements.length === 0, "8. " + tag + " : aucun chevauchement", etat.chevauchements.slice(0, 4).join(" | "));
        verif(etat.coupes.length === 0, "8. " + tag + " : aucun texte coupé", etat.coupes.slice(0, 4).join(" | "));
        if(ti === 0){
          // 3. et 4. les phrases vues par l'élève
          if(C.vueEleve(sc)){
            const r = C.provenance(etat, corpus);
            for(const x of r.introuvables) verif(false, "3. " + sc.id + " : phrase introuvable dans ce que Paul a validé", "« " + x + " »");
            verif(true, "3. " + sc.id + " : " + r.vues + " phrases cherchées mot pour mot");
            for(const x of C.motsInterdits(etat)) verif(false, "4. " + sc.id + " : texte vu par l'élève interdit", x);
            verif(true, "4. " + sc.id + " : mots interdits cherchés");
          }
          // 5. les boutons : une infobulle à chacun (console, téléphone), et aucun bouton inerte (partout)
          for(const b of etat.boutons){
            if(C.vueProf(sc) && !b.horsConsole) verif(b.title.length >= 12, "5. " + sc.id + " : infobulle de « " + b.txt + " »", b.title ? "« " + b.title + " »" : "aucune");
            if(b.desactive) verif(b.title.length >= 12, "5. " + sc.id + " : « " + b.txt + " » grisé dit pourquoi");
          }
          // 5. (garde ajoutée à l'étape 2, défauts 7, 10, 13) chaque bouton actif déclare son geste
          verif(etat.sansGeste.length === 0, "5. " + sc.id + " : chaque bouton déclare son geste", etat.sansGeste.join(" · "));
          // 5. chaque bouton qui mène ailleurs mène à une scène qui existe
          for(const c of [...new Set(etat.cibles)]) verif(scenes.some(x => x.id === c), "5. " + sc.id + " : la scène « " + c + " » où mène un bouton existe");
          // 9. le commentaire, mot pour mot : celui que com632.js écrit pour la même entrée
          for(const c of etat.commentaires) verif(C.normEsp(c.texte) === C.normEsp(C.texteCom632(JSON.parse(c.entree))), "9. " + sc.id + " : le commentaire est celui de com632.js, mot pour mot", "« " + C.normEsp(c.texte).slice(0, 80) + "… »");
          // 9. le PDF, mot pour mot
          if(sc.id === "x632-pdf") verif(etat.textesIframe.replace(/\s+/g, "") === C.textePdf632(RACINE).replace(/\s+/g, ""), "9. le PDF est celui de gen632.js, mot pour mot");
        }
      }
      await o.ctx.close();
    }
    // 5. aucun bouton inerte : chaque bouton actif est cliqué, sur la scène remise à neuf (démontée puis rendue), et doit changer quelque chose
    if(relu(sc)){
      const T = VUES[sc.vue][0], H = (sc.vh && sc.vue === "console") ? Math.max(sc.vh, T.h) : T.h;
      const q = await ouvrir(T.w, H, sc.id, "&cap=1");
      const n = await q.page.evaluate(C.marquerBoutons);
      const aNeuf = async () => {
        await q.page.evaluate(id => { window.__INTERDITS = []; window.SOMMAIRE_OUVERT = false; window.SCENE_PRETE = null;
          var cible = "#scene=" + id + "&cap=1"; if(location.hash !== cible) location.hash = cible; else rendre(); }, sc.id);
        await q.page.waitForFunction(i => window.SCENE_PRETE === i, sc.id, {timeout: 10000});
        await q.page.evaluate(C.marquerBoutons);
      };
      for(let i = 0; i < n; i++){
        await aNeuf();
        q.err.length = 0;
        const avant = await q.page.evaluate(C.empreinte);
        const loc = q.page.locator('[data-banc-b="' + i + '"]');
        if(await loc.count() === 0){ verif(false, "5. " + sc.id + " : le bouton n° " + i + " a disparu à la remise à neuf"); continue; }
        const libelle = (await loc.innerText()).trim().slice(0, 60);
        try { await loc.click({timeout: 2000}); } catch(e){ verif(false, "5. " + sc.id + " : « " + libelle + " » ne se clique pas", e.message.split("\n")[0]); continue; }
        await q.page.waitForTimeout(40);
        const apres = await q.page.evaluate(C.empreinte);
        verif(apres !== avant, "5. " + sc.id + " : « " + libelle + " » fait quelque chose");
        verif(q.err.length === 0, "5. " + sc.id + " : « " + libelle + " » sans erreur de page", q.err.join(" | "));
        const interdits = await q.page.evaluate(() => window.__INTERDITS);
        verif(interdits.length === 0, "6. " + sc.id + " : « " + libelle + " » sans boîte ni stockage", interdits.join(" "));
      }
      await q.ctx.close();
    }
    return R;
  }
  // Quatre scènes à la fois ; les résultats se rangent dans l'ordre de la séance
  const aFaire = scenes.filter(sc => !SEUL || sc.id.includes(SEUL));
  const resultats = new Array(aFaire.length); let suivant = 0;
  async function ouvrier(){ while(suivant < aFaire.length){ const k = suivant++; resultats[k] = await verifierScene(aFaire[k]); } }
  await Promise.all([ouvrier(), ouvrier(), ouvrier(), ouvrier()]);
  for(const r of resultats){ nb += r.n; echecs.push(...r.echecs); }
  if(GARDES !== "0") G.garde5Final(ESTIMATIONS, verif);
  await navig.close();

  const lignes = [];
  lignes.push("Banc unique — maquette complète du QCM");
  lignes.push("Fichier : " + path.basename(FICHIER) + " · étape jouée : " + ETAPE + (GARDES === "0" ? " · sans les gardes du complément 1" : GARDES === "seules" ? " · les gardes du complément 1 seules" : " · avec les gardes du complément 1") + (GARDES !== "0" && !G.MESURES ? ", sans les mesures (garde 4 et texte de {{LIMITES}} : étape C)" : "") + " · " + new Date().toISOString());
  lignes.push(journal.join(" · "));
  lignes.push("Vérifications : " + nb + " · échecs : " + echecs.length);
  if(echecs.length) lignes.push("", "ÉCHECS :", ...echecs.map((e, i) => (i + 1) + ". " + e));
  else lignes.push("Zéro défaut.");
  const txt = lignes.join("\n") + "\n";
  if(SORTIE) fs.writeFileSync(SORTIE, txt);
  console.log(txt.length > 20000 ? txt.slice(0, 20000) + "\n… (" + echecs.length + " échecs, voir la sortie)" : txt);
  process.exit(echecs.length ? 1 : 0);
})().catch(e => { console.error(e); if(SORTIE) fs.writeFileSync(SORTIE, "Banc unique — ÉCHEC FATAL : " + e.message + "\n"); process.exit(2); });
