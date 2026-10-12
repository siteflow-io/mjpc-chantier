// QCM-4 · BANC — les outils du banc : le faux hub, les pages, les gestes, les vérifications.
// Tout passe par le geste dans Chromium ; la base est celle du faux hub (AUDITS/QCM-MODE-TEST-09-10/banc), partagée par WebSocket.
const path = require("path"), fs = require("fs"), vm = require("vm"), crypto = require("crypto");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const RACINE = path.resolve(__dirname, "..", "..", "..");
const FAUX = path.resolve(process.env.BANC || path.join(RACINE, "AUDITS", "QCM-MODE-TEST-09-10", "banc"));
const { startServer, installRoutes, empreinte } = require(path.join(FAUX, "server.js"));
const { buildTree } = require(path.join(FAUX, "tree.js"));
const { releve } = require("./releve");
const pause = ms => new Promise(r => setTimeout(r, ms));
const norm = s => (s || "").replace(/[   ]/g, " ");
const esc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const slug = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

// Le scénario de la maquette v9 (src/scenario.js), chargé hors de la page comme le faisait son banc (garde 13)
function scenario(){
  const M = path.join(RACINE, "MANDATS", "MAQUETTE-QCM-COMPLETE", "src");
  const ctx = {HUB_EVALS: JSON.parse(fs.readFileSync(path.join(M, "donnees", "evaluations_hub.json"))), console};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(M, "scenario.js"), "utf8") + ";this.SCN = SCN;", ctx);
  return ctx.SCN;
}

// ── Le journal des vérifications : chacune a sa partie, son propriétaire (COMMUN §1) et, si elle échoue, ce qui est vu ──
class Journal {
  constructor(){ this.l = []; this.t0 = Date.now(); this.partie = "?"; }
  section(nom){ this.partie = nom; this.l.push({section: nom, t: Math.round((Date.now() - this.t0) / 1000)}); console.log("── " + nom + "  (" + Math.round((Date.now() - this.t0) / 1000) + " s)"); }
  v(ok, proprio, quoi, vu){
    const e = {partie: this.partie, ok: !!ok, proprio, quoi, vu: ok ? undefined : String(vu === undefined ? "" : vu).replace(/\s+/g, " ").slice(0, 400)};
    this.l.push(e); console.log((ok ? "  ok     " : "  ÉCHEC  ") + "[" + proprio + "] " + quoi + (ok ? "" : " — " + e.vu.slice(0, 200)));
    return !!ok;
  }
  // le banc a dû faire à la place de l'app (ex. : lancer la séance par ACT quand le geste n'a rien lancé) : écrit, jamais compté comme réussi
  secours(quoi){ this.l.push({partie: this.partie, secours: quoi}); console.log("  SECOURS " + quoi); }
  get echecs(){ return this.l.filter(x => x.ok === false); }
  get verifs(){ return this.l.filter(x => x.ok !== undefined); }
}

// ── Le faux hub, avec la classe, ses codes, les évaluations et la taxonomie ──
async function fauxHub(extra){
  const B = buildTree();
  const att = path.join(RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus");
  B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: JSON.parse(fs.readFileSync(path.join(att, "evaluation-essai.json")))});
  B.tree.taxonomie = Object.assign({}, B.tree.taxonomie, {competences: JSON.parse(fs.readFileSync(path.join(att, "taxonomie-competences.json")))});
  if(extra) extra(B);
  const port = 8600 + Math.floor(Math.random() * 150);
  const srv = await startServer(B.tree, port, () => {});
  srv.port = port;
  // le journal des phases : chaque écriture de deroule (contrat C1), horodatée depuis le départ
  const t0 = Date.now(); srv.phases = [];
  srv.watchers.push(op => { const ch = op.t === "update" ? Object.keys(op.v || {}).map(k => op.p + "/" + k) : [op.p];
    for(const c of ch) if(/\/deroule(\/|$)|sessionActive/.test(c)){ const sid = (c.match(/sessions\/([^/]+)/) || [])[1]; const d = sid ? srv.store.get("qcm/sessions/" + sid + "/deroule") : null;
      srv.phases.push(((Date.now() - t0) / 1000).toFixed(1) + " s  " + (d ? JSON.stringify({ph: d.ph, qi: d.qi, tour: d.tour, cote: d.cote, duree: d.duree, pour: d.pour}) : c)); break; } });
  return {B, srv, port};
}
// Une seconde classe (4e) avec ses codes, pour l'heure de demain
function ajouterClasse(B, cle, niveau, noms, premierCode){
  const eleves = noms.map((n, i) => { const [nom, ...pr] = n.split(" "); return {nomComplet: n, nom, prenom: pr.join(" "), code: String(premierCode + i * 7), classe: cle}; });
  B.tree.classes[cle] = {nom: cle, niveau, archivee: false, eleves: eleves.map(e => e.nomComplet)};
  for(const e of eleves){ const sel = crypto.randomBytes(16).toString("hex");
    B.tree.codes[slug(e.nomComplet)] = {name: e.nomComplet, classe: cle, createdAt: Date.now(), sel, empreinte: empreinte(e.code, sel), chiffre: "banc"}; }
  return eleves;
}

// ── Les pages : chacune dans son contexte (un appareil), servie par le faux hub ──
class Appareils {
  constructor(srv, port){ this.srv = srv; this.port = port; this.pages = []; this.nav = null; }
  async demarrer(){ this.nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"}); }
  async ouvrir(nom, q, w, h){
    const ctx = await this.nav.newContext({viewport: {width: w, height: h}});
    await installRoutes(ctx, {...this.srv, port: this.port}, null);
    const p = await ctx.newPage(); p.__nom = nom; p.__err = [];
    p.on("pageerror", e => p.__err.push("erreur de page : " + e.message));
    p.__cerr = [];
    p.on("console", m => { if(m.type() === "error"){ const t = m.text().replace(/\s+/g, " ").slice(0, 260); if(!p.__cerr.some(x => x.slice(0, 80) === t.slice(0, 80))) p.__cerr.push(t); } });
    p.on("dialog", d => { p.__err.push("boîte système : " + d.type() + " « " + d.message().slice(0, 80) + " »"); d.dismiss().catch(() => {}); });
    await p.goto("http://localhost:" + this.port + "/evaluation-qcm.html" + q).catch(e => p.__err.push("chargement : " + e.message));
    await pause(1200);
    this.pages.push(p); return p;
  }
  // une tablette : « 🎓 Choisis ta classe » (si l'app le demande), puis « Combien êtes-vous sur cette tablette ? »
  async tablette(nom, classe){
    const p = await this.ouvrir(nom, "?mode=eleve", 1280, 800);
    for(let k = 0; k < 30; k++){ const t = await texte(p); if(/Combien êtes-vous/.test(t)) break;
      if(/Choisis ta classe/.test(t)){ await cliquer(p, new RegExp("^" + esc(classe) + "$")); p.__classeDemandee = true; } await pause(250); }
    return p;
  }
  async fermer(){ if(this.nav) await this.nav.close().catch(() => {}); }
}

// ── Lire et agir dans une page ──
async function texte(p){ return norm(await p.evaluate(() => { const t = [document.body.innerText]; document.querySelectorAll("iframe").forEach(f => { try { t.push(f.contentDocument.body.innerText); } catch(e){} }); return t.join("\n"); }).catch(() => "")); }
async function attendre(p, re, ms){ const fin = Date.now() + (ms || 8000); while(Date.now() < fin){ if(re.test(await texte(p))) return true; await pause(200); } return false; }
// La racine d'une moitié de tablette : .moitie.g / .moitie.d de la maquette, sinon les deux grands blocs côte à côte
const RACINE_ZONE = `function(zone){
  if(zone === null || zone === undefined) return document;
  if(typeof zone === "string" && zone !== "g" && zone !== "d") return document.querySelector(zone);
  var cote = zone === "g" || zone === 0 ? "g" : "d";
  var m = document.querySelector(".moitie." + cote); if(m) return m;
  var W = innerWidth, all = [].slice.call(document.querySelectorAll("body *")).filter(function(e){ var r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
  var mm = all.filter(function(e){ return !all.some(function(o){ return o !== e && o.contains(e); }); }).sort(function(a, b){ return a.getBoundingClientRect().x - b.getBoundingClientRect().x; });
  return mm[cote === "g" ? 0 : 1] || null; }`;
async function zoneTexte(p, zone){ return norm(await p.evaluate(([f, zone]) => { const r = eval("(" + f + ")")(zone); return r ? (r.innerText || r.body && r.body.innerText || "") : ""; }, [RACINE_ZONE, zone]).catch(() => "")); }
// Cliquer l'élément visible et ouvert dont le texte correspond (le plus court) ; renvoie false s'il n'y en a pas
async function cliquer(p, re, zone, opts){
  opts = opts || {};
  const ok = await p.evaluate(([src, fl, f, zone, ferme]) => {
    const re = new RegExp(src, fl); const racine = eval("(" + f + ")")(zone); if(!racine) return false;
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const t = e => { const c = e.cloneNode(true); c.querySelectorAll(".info-tip,.info-i").forEach(x => x.remove()); return (c.textContent || "").replace(/[  ]/g, " ").replace(/\s+/g, " ").trim(); };
    const c = [...racine.querySelectorAll("button, a, [role=button], [data-va], label, .tc, [role=checkbox]")].filter(e => vis(e) && (ferme || !e.disabled) && re.test(t(e)));
    // l'élément au premier plan (une fenêtre ouverte recouvre la page : Paul clique ce qu'il voit), puis le texte le plus court
    const dessus = e => { e.scrollIntoView({block: "nearest"}); const r = e.getBoundingClientRect(); const x = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!x && (x === e || e.contains(x) || x.contains(e)); };
    c.sort((a, b) => (dessus(b) - dessus(a)) || (t(a).length - t(b).length));
    if(!c[0]) return false; document.querySelectorAll("[data-banc]").forEach(x => x.removeAttribute("data-banc")); c[0].setAttribute("data-banc", "1"); return true;
  }, [re.source, re.flags, RACINE_ZONE, zone === undefined ? null : zone, !!opts.ferme]).catch(() => false);
  if(!ok) return false;
  await p.click("[data-banc='1']", {timeout: 3000}).catch(() => {});
  await pause(opts.apres === undefined ? 250 : opts.apres);
  return true;
}
async function etatBouton(p, re){ return p.evaluate(([src, fl]) => { const re = new RegExp(src, fl); const b = [...document.querySelectorAll("button")].filter(e => e.getBoundingClientRect().width > 0).find(e => re.test((e.textContent || "").replace(/\s+/g, " "))); return b ? (b.disabled || /ferme|disabled/.test(b.className) ? "fermé" : "ouvert") : "absent"; }, [re.source, re.flags]).catch(() => "absent"); }
// Choisir une option d'un menu par son texte (le geste : change)
async function choisir(p, re){ return p.evaluate(([src, fl]) => { const re = new RegExp(src, fl); for(const s of document.querySelectorAll("select")){ const o = [...s.options].find(x => re.test(x.textContent)); if(o){ s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); return true; } } return false; }, [re.source, re.flags]).catch(() => false); }
// Taper au clavier de l'app (ses touches .tc sont des boutons), dans le champ de la moitié (data-champ, sinon placeholder)
async function taper(p, zone, champ, valeur){
  const ok = await p.evaluate(([f, zone, champ]) => { const r = eval("(" + f + ")")(zone); if(!r) return false;
    const i = r.querySelector("input[data-champ='" + champ + "']") || [...r.querySelectorAll("input")].find(x => (x.placeholder || "").toLowerCase().includes(champ === "code" ? "code" : champ === "prenom" ? "prénom" : "nom") && !(champ === "nom" && /prénom/i.test(x.placeholder)));
    if(!i) return false; document.querySelectorAll("[data-champ-banc]").forEach(x => x.removeAttribute("data-champ-banc")); i.setAttribute("data-champ-banc", "1"); return true; }, [RACINE_ZONE, zone, champ]).catch(() => false);
  if(!ok) return false;
  await p.click("[data-champ-banc='1']", {timeout: 2000}).catch(() => {});
  const touches = await p.evaluate(([f, zone]) => { const r = eval("(" + f + ")")(zone); return !!(r && r.querySelector(".tc")); }, [RACINE_ZONE, zone]).catch(() => false);
  for(const c of valeur){
    let fait = false;
    if(touches){ const maj = c !== c.toLowerCase(); if(maj) await cliquer(p, /^⇧$/, zone, {apres: 30});
      fait = await cliquer(p, new RegExp("^" + esc(c.toLowerCase() === " " ? "espace" : c.toLowerCase()) + "$"), zone, {apres: 30}); }
    if(!fait){ await p.click("[data-champ-banc='1']", {timeout: 1000}).catch(() => {}); await p.keyboard.type(c); }
  }
  return true;
}
// Cocher toutes les lignes d'une attestation, une par une (chaque ligne n'apparaît qu'après la précédente)
async function cocherTout(p, zone){
  let n = 0;
  for(let k = 0; k < 15; k++){
    const fait = await p.evaluate(([f, zone]) => { const r = eval("(" + f + ")")(zone); if(!r) return false;
      const c = [...r.querySelectorAll(".case-b:not(.on), input[type=checkbox], [role=checkbox]")].find(x => !x.disabled && !x.checked && x.getAttribute("aria-checked") !== "true" && x.getBoundingClientRect().width > 0);
      if(!c) return false; c.setAttribute("data-case-banc", "1"); return true; }, [RACINE_ZONE, zone]).catch(() => false);
    if(!fait) break;
    await p.click("[data-case-banc='1']", {timeout: 2000}).catch(() => {});
    await p.evaluate(() => document.querySelectorAll("[data-case-banc]").forEach(x => x.removeAttribute("data-case-banc"))).catch(() => {});
    n++; await pause(120);
  }
  return n;
}
// Les choix cliquables d'une moitié (ses .eleve-choix-btn ouverts, ou ses boutons dont le texte est un choix)
async function choixOuverts(p, zone, choix){
  return p.evaluate(([f, zone, choix]) => { const r = eval("(" + f + ")")(zone); if(!r) return [];
    return [...r.querySelectorAll("button")].filter(b => !b.disabled && b.getBoundingClientRect().width > 0 && choix.includes((b.textContent || "").replace(/\s+/g, " ").trim())).map(b => b.textContent.trim()); }, [RACINE_ZONE, zone, choix]).catch(() => []);
}
async function photo(p, fichier){ try { await p.screenshot({path: fichier, fullPage: false}); return true; } catch(e){ return false; } }

module.exports = { RACINE, FAUX, pause, norm, esc, slug, scenario, Journal, fauxHub, ajouterClasse, Appareils, texte, attendre, zoneTexte, cliquer, etatBouton, choisir, taper, cocherTout, choixOuverts, photo, releve };
