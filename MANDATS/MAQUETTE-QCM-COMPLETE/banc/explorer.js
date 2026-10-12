// (complément 4, garde 16) Chaque écran atteint : le banc part des scènes, clique chaque élément cliquable dans une page neuve
// (comme la carte de la conscience, AUDITS/MAQUETTE-QCM-COMPLEMENT-3-12-10/scripts/carte.js), relève chaque destination distincte
// (la scène et ses paramètres, et chaque page ouverte par window.open), puis ouvre chaque destination nouvelle à son tour,
// jusqu'à ce qu'aucune destination nouvelle n'apparaisse.
//   node banc/explorer.js <maquette.html> <sortie.json>     (seul ; le banc unique l'appelle aussi)
const path = require("path"), fs = require("fs");
const G3 = require("./gardes3.js");

const TAILLE = {console: {w: 1536, h: 864}, telephone: {w: 390, h: 844}, tablette: {w: 1280, h: 800}, tableau: {w: 1280, h: 800}, eleve: {w: 1280, h: 800}};
const ESPION = () => { window.__OUV = []; window.open = function(u){ window.__OUV.push(String(u)); return null; };
  window.print = function(){ window.__OUV.push("print"); }; window.alert = function(){}; window.confirm = function(){ return false; }; window.prompt = function(){ return null; }; };

// une adresse, ramenée à sa destination : la scène et ses paramètres, sans « de », « cap », ni un « m » qui est le moment par défaut de la scène
function normaliser(hash, defauts){
  const h = String(hash || "").replace(/^[^#]*#/, "");
  const parts = h.split("&").filter(Boolean); if(!parts.length || !/^scene=/.test(parts[0])) return null;
  const id = decodeURIComponent(parts[0].slice(6));
  const params = [];
  for(const p of parts.slice(1)){
    const i = p.indexOf("="), k = i < 0 ? p : p.slice(0, i), v = i < 0 ? "" : decodeURIComponent(p.slice(i + 1));
    if(k === "de" || k === "cap") continue;
    if(k === "m" && defauts[id] === v) continue;
    params.push(k + "=" + encodeURIComponent(v));
  }
  return id + (params.length ? "&" + params.join("&") : "");
}
const base = cle => cle.split("&")[0];

async function explorer(navig, fichier, scenes, opts){
  opts = opts || {};
  const url = "file://" + fichier, A = G3.argsPage();
  const parId = {}, defauts = {}; scenes.forEach(s => { parId[s.id] = s; defauts[s.id] = s.moment; });
  const vues = {}; scenes.forEach(s => { vues[s.id] = s.vue; });
  const connus = new Map();   // clé → {cle, base, vue, origine, geste, fenetre}
  scenes.forEach(s => connus.set(s.id, {cle: s.id, base: s.id, vue: s.vue, scene: true}));
  const file = scenes.map(s => s.id);
  const empreintes = new Map();   // le rendu d'une page → la première page qui l'a montré
  const gestes = [];          // chaque geste : la page, le libellé, ce qu'il ouvre
  let fait = 0;
  async function unePage(cle){
    const b = base(cle), T = TAILLE[vues[b]] || TAILLE.console;
    const ctx = await navig.newContext({viewport: {width: T.w, height: T.h}}); const page = await ctx.newPage();
    page.on("dialog", d => d.dismiss().catch(() => {}));
    await page.addInitScript(ESPION);
    // la page est chargée une fois ; avant chaque clic, la scène est remise à neuf (démontée, rendue de nouveau à son adresse),
    // comme la vérification 5 du banc : rien de ce qu'un clic précédent a fait ne reste
    const charger = async () => { await page.goto("about:blank"); await page.goto(url + "#scene=" + cle + "&cap=1");
      await page.waitForFunction(i => window.SCENE_PRETE === i, b, {timeout: 8000}).catch(() => {}); await page.waitForTimeout(40); };
    const aller = async () => {
      const ok = await page.evaluate(a => { if(typeof rendre !== "function") return false; window.__OUV = []; window.SOMMAIRE_OUVERT = false; window.SCENE_PRETE = null;
        const cible = "#scene=" + a.cle + "&cap=1"; if(location.hash !== cible) location.hash = cible; else rendre(); return true; }, {cle}).catch(() => false);
      if(!ok){ await charger(); return; }
      await page.waitForFunction(i => window.SCENE_PRETE === i, b, {timeout: 8000}).catch(() => {}); await page.waitForTimeout(30); };
    try {
      await charger();
      // une destination qui montre exactement l'écran d'une page déjà connue (le même rendu, au caractère près) est cet écran :
      // elle est relevée comme telle, et ses gestes ne se rejouent pas (ce sont ceux de l'écran déjà exploré)
      const fp = await page.evaluate(() => { const r = document.getElementById("root"); let s = document.body.className + "|" + r.innerHTML;
        r.querySelectorAll("iframe").forEach(f => { s += "|" + (f.getAttribute("srcdoc") || "").length; }); let h = 0; for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h + ":" + s.length; });
      const deja = empreintes.get(fp);
      if(deja && connus.get(cle) && !connus.get(cle).scene){ connus.get(cle).memeQue = deja; await ctx.close(); fait++; return; }
      if(!deja) empreintes.set(fp, cle);
      const liste = await page.evaluate(G3.listerGestes, A);
      for(const c of liste){
        if(!c.vis || c.dis || c.derriere) continue;
        await aller(); await page.evaluate(G3.listerGestes, A);
        const loc = page.locator('[data-g3="' + c.k + '"]'); if(!(await loc.count())) continue;
        const h0 = await page.evaluate(() => location.hash);
        try {
          if(c.tag === "select"){ const v = await loc.evaluate(s => { const o = Array.from(s.options).find(x => x.value !== s.value && !x.disabled); return o ? o.value : null; }); if(v === null) continue; await loc.selectOption(v, {timeout: 1500}); }
          else await loc.click({timeout: 1500});
        } catch(e){ continue; }
        await page.waitForTimeout(80);
        const r = await page.evaluate(() => ({hash: location.hash, ouv: (window.__OUV || []).slice()}));
        const sorties = [];
        if(r.hash !== h0){ const d = normaliser(r.hash, defauts); if(d && d !== cle) sorties.push({d, fenetre: false}); }
        r.ouv.filter(u => u.indexOf("#scene=") >= 0).forEach(u => { const d = normaliser(u, defauts); if(d) sorties.push({d, fenetre: true}); });
        for(const s of sorties){
          gestes.push({page: cle, lib: c.lib, d: s.d, fenetre: s.fenetre});
          if(!parId[base(s.d)]) continue;            // une scène inconnue : la garde 12 le relève
          if(!connus.has(s.d)){ connus.set(s.d, {cle: s.d, base: base(s.d), vue: vues[base(s.d)], origine: cle, geste: c.lib, fenetre: s.fenetre}); file.push(s.d); }
        }
      }
    } catch(e){ gestes.push({page: cle, erreur: String(e.message || e).split("\n")[0].slice(0, 160)}); }
    await ctx.close();
    fait++; if(opts.trace) process.stderr.write("\r" + fait + " pages · " + connus.size + " connues · file " + (file.length) + "   ");
  }
  let i = 0;
  async function ouvrier(){ while(i < file.length){ const k = file[i++]; await unePage(k); } }
  // les ouvriers repartent tant que la file a grandi pendant qu'ils travaillaient
  while(i < file.length) await Promise.all(Array.from({length: opts.ouvriers || 6}, ouvrier));
  const tous = [...connus.values()].filter(x => !x.scene);
  // les destinations distinctes : celles qui montrent un écran à elles ; les autres sont dites « même écran que »
  return {destinations: tous.filter(x => !x.memeQue), memes: tous.filter(x => x.memeQue), gestes, pages: fait};
}
function ecrireListe(res, chemin){
  const L = ["Garde 16 — les destinations atteintes par le geste, au-delà des " + (res.pages - res.destinations.length) + " scènes (" + res.pages + " pages ouvertes, " + res.gestes.length + " gestes qui mènent quelque part)",
    "Destinations nouvelles : " + res.destinations.length + " (et " + (res.memes || []).length + " adresses qui montrent un écran déjà relevé)", ""];
  res.destinations.slice().sort((a, b) => a.cle.localeCompare(b.cle)).forEach(d => L.push(d.cle + "\t← « " + d.geste + " » (" + d.origine + ")" + (d.fenetre ? " · nouvelle fenêtre" : "")));
  L.push("", "Adresses qui montrent, au caractère près, l'écran d'une page déjà relevée (" + (res.memes || []).length + ") : jouées par cette page", "");
  (res.memes || []).slice().sort((a, b) => a.cle.localeCompare(b.cle)).forEach(d => L.push(d.cle + "\t= " + d.memeQue + "\t← « " + d.geste + " » (" + d.origine + ")"));
  fs.writeFileSync(chemin, L.join("\n") + "\n");
}
module.exports = {explorer, normaliser, ecrireListe, base, TAILLE};

if(require.main === module){
  const { chromium } = require("/opt/node22/lib/node_modules/playwright");
  (async () => {
    const F = path.resolve(process.argv[2]), out = process.argv[3];
    const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
    const p = await navig.newPage(); await p.goto("file://" + F + "#scene=c-evals"); await p.waitForTimeout(500);
    let scenes = await p.evaluate(() => window.LISTE_SCENES); await p.close();
    if(process.env.SEUL) scenes = scenes.filter(s => process.env.SEUL.split(",").includes(s.id));
    const t0 = Date.now();
    const res = await explorer(navig, F, scenes, {trace: true});
    await navig.close();
    fs.writeFileSync(out, JSON.stringify(res));
    if(process.env.LISTE) ecrireListe(res, process.env.LISTE);
    console.log("\n" + res.destinations.length + " destinations · " + res.pages + " pages · " + Math.round((Date.now() - t0) / 1000) + " s");
  })().catch(e => { console.error(e); process.exit(2); });
}
