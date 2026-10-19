// SONDE DE LA CONSCIENCE N°12 — 29, seconde moitié (19/10, Paul 09:43 ; acquise) : dans une séance terminée, une question posée mais jamais
// révélée en classe compte dès que Paul a lu la feuille le soir. Le contrôle fixé d'avance dans la section de DEFAUTS-OUVERTS (fb9a961d) :
// une séance terminée avant la fin, lue le soir : la même note (au tableau de la séance, dans « La note, en direct », au bilan de l'élève).
// Par le geste, sur le faux hub ; l'attendu vient de la base elle-même. Élèves fictifs (la fausse classe du banc).
// usage : APP_FILE=<app> BANC=<faux hub> CTL=<AUDITS/CONTROLES-QCM-APP> BASE=<base-soir.json> node sonde-note.js [sortie.txt]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC), CTL = path.resolve(process.env.CTL), SORTIE = process.argv[2] || null;
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const TAXO = JSON.parse(fs.readFileSync(path.join(CTL, "attendus", "taxonomie-competences.json")));
const RAPPORT = []; let nb = 0, echecs = 0;
function verif(n, ok, quoi, detail) { nb++; if (!ok) echecs++; RAPPORT.push((ok ? "  ok     " : "  ÉCHEC  ") + n + " · " + quoi + (detail && !ok ? " — " + String(detail).slice(0, 500) : "")); return ok; }
const pause = ms => new Promise(r => setTimeout(r, ms));
const norm = s => (s || "").replace(/[\u00a0\u202f]/g, " ");
// (de la sonde du micro 8.0.3) attendre, cliquer dans une moitié, les moitiés, taper au clavier de l'app
async function attendre(p, re, ms) { const fin = Date.now() + (ms || 10000); while (Date.now() < fin) { if (re.test(await texte(p))) return true; await pause(250); } return false; }
// Clique l'élément visible (bouton, lien, élément cliquable) dont le texte correspond, dans la zone donnée (sélecteur ou index de moitié)
async function cliquer(p, re, zone) {
  const ok = await p.evaluate(([src, fl, zone]) => {
    const re = new RegExp(src, fl);
    let racine = document;
    if (typeof zone === "number") { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
      const m = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x); racine = m[zone]; if (!racine) return false; }
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const c = [...racine.querySelectorAll("button, a, [role=button], [data-va], option, label, .tc")].filter(e => vis(e) && !e.disabled && re.test((e.textContent || "").replace(/[  ]/g, " ").trim()));
    c.sort((a, b) => a.textContent.length - b.textContent.length);
    if (!c[0]) return false; document.querySelectorAll("[data-ctl]").forEach(x => x.removeAttribute("data-ctl")); c[0].setAttribute("data-ctl", "1"); return true;
  }, [re.source, re.flags, zone === undefined ? null : zone]);
  if (!ok) return false;
  await p.click("[data-ctl='1']", {timeout: 3000}).catch(() => {});
  await pause(400);
  return true;
}
async function fermeOuvert(p, re) { return p.evaluate(([src, fl]) => { const re = new RegExp(src, fl); const b = [...document.querySelectorAll("button")].find(e => re.test(e.textContent || "")); return b ? (b.disabled || /ferm|disabled|lock/i.test(b.className) ? "fermé" : "ouvert") : "absent"; }, [re.source, re.flags]); }
async function moities(p) { return (await p.evaluate(() => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
  return all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x).map(e => e.innerText); })).map(norm); }
// Taper au clavier de l'app (ses touches sont des boutons), sinon au clavier de l'ordinateur
async function taper(p, moitie, placeholder, valeur) {
  const ok = await p.evaluate(([i, ph]) => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
    const m = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[i]; if (!m) return false;
    const f = [...m.querySelectorAll("input")].find(x => (x.placeholder || "").includes(ph)); if (!f) return false; document.querySelectorAll("[data-champ]").forEach(x => x.removeAttribute("data-champ")); f.setAttribute("data-champ", "1"); return true; }, [moitie, placeholder]);
  if (!ok) return false;
  await p.click("[data-champ='1']").catch(() => {});
  const avecTouches = await p.evaluate(() => document.querySelectorAll(".tc").length > 0);
  for (const c of valeur) {
    if (avecTouches) { const fait = await cliquer(p, new RegExp("^" + c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"), moitie); if (!fait) await p.keyboard.type(c); }
    else await p.keyboard.type(c);
  }
  return true;
}

// la tête des contrôles : texte visible (cadres compris), verif
async function texte(p) { return norm(await p.evaluate(() => { const t = [document.body.innerText]; document.querySelectorAll("iframe").forEach(f => { try { t.push(f.contentDocument.body.innerText); } catch (e) {} }); return t.join("\n"); })); }
(async () => {
  const t0 = Date.now();
  // La séance du banc du 13/10 (3 ESSAI, élèves fictifs), terminée. La correction s'est arrêtée après Q2 : seule Q2 est révélée,
  // et personne n'a lu en classe les feuilles de Q1 et de Q3 (leurs lectures, leurs lignes « à lire », leurs alertes retirées).
  const B = buildTree();
  const base = JSON.parse(fs.readFileSync(process.env.BASE));
  const SID = "sess_1791877316846", S = base.sessions[SID];
  S.revelees = {0: 1};
  S.lectures = {1: S.lectures[1]};
  S.aLire = Object.fromEntries(Object.entries(S.aLire || {}).filter(([k, v]) => +v.qi === 1));
  S.alertes = Object.fromEntries(Object.entries(S.alertes || {}).filter(([k, v]) => +v.qi === 1));
  S.trouvee = Object.fromEntries(Object.entries(S.trouvee || {}).filter(([k, v]) => +v === 1));
  // deux présents, Tom et sa voisine Léa (place 2), pour que toutes les feuilles à lire se lisent et que les copies se rendent
  const DEUX = ["carre_tom", "baudry_lea"], tous = [].concat(...Object.values(S.places).map(t => [t.g, t.d])).filter(Boolean);
  S.absents = Object.fromEntries(tous.filter(x => !DEUX.includes(x)).map((x, i) => [i, x]));
  S.aLire = Object.fromEntries(Object.entries(S.aLire || {}).filter(([k, v]) => DEUX.includes(v.eleveSlug)));
  S.trouvee = Object.fromEntries(Object.entries(S.trouvee || {}).filter(([k, v]) => DEUX.includes(k)));
  B.tree.qcm = Object.assign({}, B.tree.qcm, base);
  B.tree.taxonomie = Object.assign({}, B.tree.taxonomie, {competences: TAXO});
  const EV = base.evaluations.essai, X = "carre_tom", NOM = "CARRÉ Tom";
  const egal = (a, b) => { const x = Object.values(a || {}).map(Number).sort(), y = Object.values(b || {}).map(Number).sort(); return x.length === y.length && x.every((v, i) => v === y[i]); };
  // l'attendu, de la base : Q2 d'après la lecture de son voisin en classe (ou « Trouvée au dernier moment »), Q1 juste, Q3 fausse, lues par Paul
  const q2 = egal(S.lectures[1][X].choix, EV.questions[1].bonnes) || +(S.trouvee || {})[X] === 1 ? 1 : 0;
  const N = q2 + 1 + 0, SUR20 = (Math.round(N * 20 / 3 * 10) / 10).toString().replace(".", ",");
  const PORT = 8960 + Math.floor(Math.random() * 30);
  const srv = await startServer(B.tree, PORT, () => {});
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const err = [];
  async function ouvrir(q, w, h) { const ctx = await navig.newContext({viewport: {width: w, height: h}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); p.on("pageerror", e => err.push(e.message)); p.on("dialog", d => { err.push("boîte système : " + d.type()); d.dismiss().catch(() => {}); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await pause(2000); return p; }
  const codeDe = nom => B.eleves.find(e => e.nomComplet === nom).code;
  const clic = async (p, re, sel) => { const ok = await p.evaluate(([s, f, sel]) => { const r = new RegExp(s, f); const rac = sel ? document.querySelector(sel) : document; if (!rac) return false;
    const b = [...rac.querySelectorAll("button, a, [role=button], [data-va], .lire-prop")].filter(e => e.getBoundingClientRect().width > 0 && !e.disabled && r.test((e.textContent || "").replace(/[  ]/g, " ").trim())).sort((a, b) => a.textContent.length - b.textContent.length)[0];
    if (!b) return false; document.querySelectorAll("[data-ctl]").forEach(x => x.removeAttribute("data-ctl")); b.setAttribute("data-ctl", "1"); return true; }, [re.source, re.flags, sel || null]);
    if (!ok) return false; await p.click("[data-ctl='1']", {timeout: 3000}).catch(() => {}); await pause(700); return true; };
  const ligne = (p, sl) => p.evaluate(sl => { const r = document.querySelector("tr[data-eleve='" + sl + "']"); return r ? [...r.querySelectorAll("td")].map(x => x.innerText.replace(/\s+/g, " ").trim()) : null; }, sl);
  const tete = p => p.evaluate(() => [...document.querySelectorAll("thead th")].map(x => x.innerText.replace(/\s+/g, " ").trim()));
  const noteDirecte = p => p.evaluate(() => { const n = document.querySelector("[data-note-directe]"); return n ? n.innerText.replace(/\s+/g, " ") : ""; });
  try {
    const prof = await ouvrir("?mode=prof", 1536, 864);
    const ouvrirSeance = async () => { await clic(prof, /^Données$/); await clic(prof, /Résultats/); return clic(prof, /📊 Ouvrir/); };
    verif("N1", await ouvrirSeance(), "Résultats : « 📊 Ouvrir » la séance");
    let T = await tete(prof), iN = T.indexOf("Note"), iM = T.indexOf("Maîtrise de la note"), r = await ligne(prof, X);
    verif("N1", !!r && new RegExp("^" + q2 + "/3 2 questions pas encore lues$").test(r[iN]) && r[iM] === "—", "avant la lecture du soir : Tom « " + q2 + "/3 2 questions pas encore lues », maîtrise « — »", JSON.stringify({T, r}));
    verif("N2", await clic(prof, /Lire les copies/), "« 📄 Lire les copies »");
    await prof.click("[data-initiales='1']").catch(() => {}); await prof.keyboard.type("ct", {delay: 60}); await pause(500); await prof.keyboard.press("Enter"); await pause(1500);
    const lignes = await prof.evaluate(() => [...document.querySelectorAll("[data-ligne]")].map(d => ({id: d.getAttribute("data-ligne"), t: d.innerText.replace(/\s+/g, " ")})));
    const l1 = lignes.find(x => x.id === "nl_carre_tom_0"), l3 = lignes.find(x => x.id === "nl_carre_tom_2");
    verif("N2", !!l1 && !!l3 && /Question 1/.test(l1.t) && /Question 3/.test(l3.t) && /Que dit la copie \?/.test(l1.t), "la copie de Tom : Q1 et Q3, jamais lues en classe, sont à lire, « Que dit la copie ? »", JSON.stringify(lignes).slice(0, 600));
    for (const [qi, choix] of [[0, Object.values(EV.questions[0].bonnes).map(Number)], [2, [Object.values(EV.questions[2].choix).findIndex((c, i) => !Object.values(EV.questions[2].bonnes).map(Number).includes(i))]]]) {
      const id = "nl_carre_tom_" + qi;
      const ok1 = await prof.evaluate(id => { const l = document.querySelector("[data-ligne='" + id + "']"); const b = l && [...l.querySelectorAll("button")].find(b => /Je clique ce qu'elle dit/.test(b.textContent)); if (!b) return false; b.click(); return true; }, id); await pause(600);
      let ok2 = true; for (const c of choix) ok2 = ok2 && await prof.evaluate(([id, t]) => { const l = document.querySelector("[data-ligne='" + id + "']"); const b = l && [...l.querySelectorAll(".eleve-choix-btn")].find(b => b.textContent.trim() === t); if (!b) return false; b.click(); return true; }, [id, Object.values(EV.questions[qi].choix)[c]]);
      await pause(400);
      const ok3 = await prof.evaluate(id => { const l = document.querySelector("[data-ligne='" + id + "']"); const b = l && [...l.querySelectorAll("button.btn-primary")].find(b => !b.disabled); if (!b) return false; b.click(); return true; }, id); await pause(1500);
      const lu = ((srv.store.get("qcm/sessions/" + SID + "/lectures") || {})[qi] || {})[X];
      verif("N3", ok1 && ok2 && ok3 && !!lu && lu.par === "prof", "Q" + (qi + 1) + " : « ✏️ Je clique ce qu'elle dit », le choix de la copie, puis l'enregistrement : lectures/" + qi + "/carre_tom écrite par Paul", JSON.stringify({ok1, ok2, ok3, lu}));
    }
    const ndTom = await noteDirecte(prof);
    // la copie de Léa : Q1 et Q3 lues aussi (justes), pour que toutes les feuilles soient lues
    await prof.click("[data-initiales='1']").catch(() => {}); await prof.keyboard.press("Control+A"); await prof.keyboard.type("bl", {delay: 60}); await pause(500); await prof.keyboard.press("Enter"); await pause(1500);
    for (const qi of [0, 2]) { const id = "nl_baudry_lea_" + qi;
      await prof.evaluate(id => { const l = document.querySelector("[data-ligne='" + id + "']"); const b = l && [...l.querySelectorAll("button")].find(b => /Je clique ce qu'elle dit/.test(b.textContent)); if (b) b.click(); }, id); await pause(600);
      for (const c of Object.values(EV.questions[qi].bonnes).map(Number)) await prof.evaluate(([id, t]) => { const l = document.querySelector("[data-ligne='" + id + "']"); const b = l && [...l.querySelectorAll(".eleve-choix-btn")].find(b => b.textContent.trim() === t); if (b) b.click(); }, [id, Object.values(EV.questions[qi].choix)[c]]);
      await pause(400); await prof.evaluate(id => { const l = document.querySelector("[data-ligne='" + id + "']"); const b = l && [...l.querySelectorAll("button.btn-primary")].find(b => !b.disabled); if (b) b.click(); }, id); await pause(1500); }
    const lea = srv.store.get("qcm/sessions/" + SID + "/lectures") || {};
    verif("N3", !!(lea[0] || {}).baudry_lea && !!(lea[2] || {}).baudry_lea, "la copie de Léa : Q1 et Q3 lues par Paul", JSON.stringify({q1: (lea[0] || {}).baudry_lea, q3: (lea[2] || {}).baudry_lea}));
    const nd = ndTom;
    verif("N3", new RegExp("Note : [^·]*" + N + " / 3").test(nd) && !/pas encore lue/.test(nd), "« 🧮 La note, en direct » : " + N + " / 3, sans « pas encore lue »", nd.slice(0, 400));
    await prof.screenshot({path: path.join(path.dirname(SORTIE || "x"), "N3-lire-les-copies.png")}).catch(() => {});
    verif("N4", await ouvrirSeance(), "de nouveau, le tableau de la séance");
    T = await tete(prof); iN = T.indexOf("Note"); iM = T.indexOf("Maîtrise de la note"); const iS = T.indexOf("Sur 20"); r = await ligne(prof, X);
    verif("N4", !!r && r[iN] === N + "/3" && r[iS] === SUR20 && r[iM] !== "—" && !/pas encore lue/.test(r.join(" ")), "le tableau de la séance : Tom « " + N + "/3 », « " + SUR20 + " », une maîtrise, sans « pas encore lues »", JSON.stringify({T, r}));
    // les copies rendues, puis le bilan de Tom sur sa tablette
    await clic(prof, /^Données$/); await clic(prof, /Résultats/); await pause(600);
    if (await clic(prof, /rendre les copies ▸/)) await clic(prof, /^Rendre les copies$|^📤 Rendre|^Rendre$/);
    await pause(1200);
    verif("N5", !!(srv.store.get("qcm/sessions/" + SID + "/copies") || {}).rendues, "les copies rendues", JSON.stringify(srv.store.get("qcm/sessions/" + SID + "/copies")));
    const tab = await ouvrir("?mode=eleve", 1280, 800);
    await attendre(tab, /Identifie-toi/, 10000);
    await taper(tab, 0, "code", codeDe(NOM)); await taper(tab, 0, "Prénom", "tom"); await taper(tab, 0, "Nom", "carré");
    await cliquer(tab, /Entrer/, 0); await pause(2000);
    let te = await texte(tab);
    if (!/ \/ 20/.test(te)) { await cliquer(tab, /📊 Mes évaluations/); await pause(1500); te = await texte(tab); }
    verif("N5", new RegExp(N + " / 3 · " + SUR20 + " / 20").test(te), "le bilan de Tom, sur sa tablette (« 📊 Mes évaluations ») : " + N + " / 3 · " + SUR20 + " / 20, la même note", te.slice(0, 500));
    await tab.screenshot({path: path.join(path.dirname(SORTIE || "x"), "N5-mes-evaluations.png")}).catch(() => {});
    verif("N6", err.length === 0, "aucune erreur de page ni boîte système", err.slice(0, 3).join(" · "));
  } catch (e) { verif("N0", false, "la sonde s'est arrêtée", e.stack); }
  await navig.close(); await srv.close();
  const txt = "Sonde de la conscience n°12 — 29, seconde moitié : la note d'une séance arrêtée avant la fin, lue le soir — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString() + "\nDurée : " + Math.round((Date.now() - t0) / 1000) + " s · vérifications : " + nb + " · échecs : " + echecs + "\n" + RAPPORT.join("\n") + "\n";
  if (SORTIE) fs.writeFileSync(SORTIE, txt); process.stdout.write(txt); process.exit(echecs ? 1 : 0);
})();
