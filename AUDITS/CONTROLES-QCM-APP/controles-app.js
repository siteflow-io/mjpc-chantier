// Les contrôles de la conscience n°12 pour l'app QCM codée d'après la maquette (mandat de code, §5.3 ; protocole de l'audit du 12/10).
// L'app est servie par le faux hub du mode test (AUDITS/QCM-MODE-TEST-09-10/banc : la base partagée entre toutes les pages, par WebSocket).
// Tout passe par le geste, dans plusieurs pages à la fois : la console, une tablette partagée, le tableau, le téléphone.
// Les attendus viennent de la maquette validée (ses libellés, ses règles) et de la base elle-même, jamais de l'app contrôlée.
// usage : APP_FILE=<evaluation-qcm.staging.html> BANC=<dossier du faux hub, avec node_modules> node controles-app.js [sortie.txt]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC || path.join(__dirname, "..", "QCM-MODE-TEST-09-10", "banc"));
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const SORTIE = process.argv[2] || null;
const EV = JSON.parse(fs.readFileSync(path.join(__dirname, "attendus", "evaluation-essai.json")));
const PORT = 8790 + Math.floor(Math.random() * 100);
const RAPPORT = []; let nb = 0, echecs = 0;
function verif(n, ok, quoi, detail) { nb++; if (!ok) echecs++; RAPPORT.push((ok ? "  ok     " : "  ÉCHEC  ") + "K" + n + " · " + quoi + (detail && !ok ? " — " + String(detail).slice(0, 300) : "")); return ok; }
const pause = ms => new Promise(r => setTimeout(r, ms));
const norm = s => (s || "").replace(/[  ]/g, " ");

// Le texte visible d'une page, cadres compris
async function texte(p) { return norm(await p.evaluate(() => { const t = [document.body.innerText]; document.querySelectorAll("iframe").forEach(f => { try { t.push(f.contentDocument.body.innerText); } catch (e) {} }); return t.join("\n"); })); }
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

(async () => {
  // La base de départ : la fausse classe du faux hub (25 élèves, leurs codes) et l'évaluation d'essai de la maquette, complète
  const B = buildTree();
  B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: EV});
  const srv = await startServer(B.tree, PORT, () => {});
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  async function ouvrir(q, w, h) { const ctx = await navig.newContext({viewport: {width: w, height: h}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); const err = []; p.on("pageerror", e => err.push(e.message)); p.on("dialog", d => { err.push("boîte système : " + d.type()); d.dismiss().catch(() => {}); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await pause(1500); p.__err = err; return p; }
  const t0 = Date.now();
  const codeDe = nom => B.eleves.find(e => e.nomComplet === nom).code;
  try {
    const prof = await ouvrir("?mode=prof", 1536, 864);
    // K1 — lancer la séance de la classe, sur l'évaluation d'essai, par le geste
    await cliquer(prof, /^Pilotage$/);
    await prof.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].find(x => /3 ESSAI/.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); } } });
    await pause(300);
    await prof.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].find(x => /Évaluation d'essai/.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); } } });
    await pause(300);
    await cliquer(prof, /Lancer la séance/);
    await pause(800);
    await cliquer(prof, /Lancer la séance/);   // l'appel, puis le départ (comme dans la maquette : c-lancer, puis c-appel)
    await pause(1200);
    const actives = srv.store.get("qcm/sessionActive") || {};
    verif(1, Object.keys(actives).length > 0, "« 🚀 Lancer la séance » écrit une séance active dans la base", JSON.stringify(actives).slice(0, 200));

    // K2 — la tablette, ouverte sans rechargement après le lancement, demande combien d'élèves elle porte
    const tab = await ouvrir("?mode=eleve", 1280, 800);
    verif(2, await attendre(tab, /Combien êtes-vous sur cette tablette/, 10000), "la tablette demande « Combien êtes-vous sur cette tablette ? »", (await texte(tab)).slice(0, 200));
    await cliquer(tab, /2 élèves/);
    let m = await moities(tab);
    verif(2, m.length === 2 && m.every(x => /Identifie-toi/.test(x)), "« 👥 2 élèves » partage la tablette en deux moitiés, chacune « 👋 Identifie-toi »", m.map(x => x.slice(0, 60)).join(" | "));

    // K3 — l'entrée par le vrai code (son empreinte est au hub), au clavier de l'app ; le binôme vient de la console
    await taper(tab, 0, "code", codeDe("ABRIAL Julien")); await taper(tab, 0, "Prénom", "julien"); await taper(tab, 0, "Nom", "abrial");
    await cliquer(tab, /Entrer/, 0);
    const vuJ = await attendre(prof, /ABRIAL Julien/, 10000);
    verif(3, vuJ, "Julien entré sur la tablette se voit sur ta console sans rechargement");
    const tProf = await texte(prof);
    const voisin = (["DUVERNAY Michel", "BAUDRY Léa"].find(n => new RegExp("ABRIAL Julien[\\s\\S]{0,80}" + n + "|" + n + "[\\s\\S]{0,80}ABRIAL Julien").test(tProf))) || "DUVERNAY Michel";
    const [nomV, ...prV] = voisin.split(" ");
    await taper(tab, 1, "code", codeDe(voisin)); await taper(tab, 1, "Prénom", prV.join(" ").toLowerCase()); await taper(tab, 1, "Nom", nomV.toLowerCase());
    await cliquer(tab, /Entrer/, 1);
    verif(3, await attendre(prof, new RegExp(voisin), 10000), voisin + ", entré dans l'autre moitié, se voit sur ta console");
    // un code faux ne fait pas entrer (la maquette : « Ce code ne correspond pas. Vérifie tes 4 chiffres. »)
    const tab2 = await ouvrir("?mode=eleve", 1280, 800);
    await attendre(tab2, /Combien êtes-vous/, 8000); await cliquer(tab2, /1 élève/);
    await pause(500);
    await taper(tab2, 0, "code", "9999").catch(() => {});
    const un = await texte(tab2);
    if (/Identifie-toi/.test(un)) { await taper(tab2, 0, "Prénom", "tom"); await taper(tab2, 0, "Nom", "carré"); await cliquer(tab2, /Entrer/); await pause(600);
      verif(3, /Ce code ne correspond pas/.test(await texte(tab2)), "un code faux : « Ce code ne correspond pas. Vérifie tes 4 chiffres. »", (await texte(tab2)).slice(0, 200)); }

    // K4 — la première attestation : une coche par ligne, « Je commence » s'ouvre quand tout est coché
    for (const i of [0, 1]) {
      for (let k = 0; k < 12; k++) { const fait = await tab.evaluate(i => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
          const h = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[i]; if (!h) return false;
          const c = [...h.querySelectorAll("input[type=checkbox], [role=checkbox]")].find(x => !x.checked && x.getAttribute("aria-checked") !== "true" && x.getBoundingClientRect().width > 0); if (!c) return false; c.click(); return true; }, i); if (!fait) break; await pause(250); }
      await cliquer(tab, /Je commence/, i);
    }
    verif(4, await attendre(prof, /prêt|Prêt|PRÊT/, 8000), "les deux attestations faites, ta console le montre");

    // K5 — la question 1 lancée de la console arrive sur la tablette, le tableau et le téléphone
    const tableau = await ouvrir("?mode=prof&view=board", 1280, 800);
    const tel = await ouvrir("?mode=prof&view=phone", 390, 844);
    await cliquer(prof, /Lancer Q1/);
    m = await moities(tab);
    const q1 = new RegExp(EV.questions[0].enonce.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    verif(5, await attendre(tab, /QUESTION 1/i, 8000) && (await moities(tab)).every(x => q1.test(x)), "« ▶️ Lancer Q1 » : l'énoncé de la question 1 sur les deux moitiés", (await moities(tab)).map(x => x.slice(0, 80)).join(" | "));
    verif(5, await attendre(tableau, q1, 8000), "le tableau montre la question 1, sans rechargement");
    verif(5, await attendre(tel, /Q1|Question 1|QUESTION 1/, 8000), "le téléphone montre la question 1, sans rechargement");

    // K6 — un redessin n'efface jamais une saisie : un champ de ta console garde sa valeur et le focus quand une tablette agit
    const champ = await prof.evaluate(() => { const f = [...document.querySelectorAll("input[type=number], input[type=text]")].find(x => x.getBoundingClientRect().width > 0 && !x.disabled && !x.readOnly); if (!f) return null; f.setAttribute("data-k6", "1"); return true; });
    if (champ) { await prof.click("[data-k6='1']"); await prof.keyboard.press("End"); await prof.keyboard.type("7"); }
    await cliquer(prof, /Autoriser la réponse/);
    await pause(800);
    const avant = await texte(prof);
    const choisi = await cliquer(tab, new RegExp("^" + EV.questions[0].choix[EV.questions[0].bonnes[0]] + "$"), 0) || await cliquer(tab, new RegExp("^" + EV.questions[0].choix[EV.questions[0].bonnes[0]] + "$"), 1);
    verif(6, choisi, "au 1er tour, une moitié peut cliquer un choix de la question 1");
    let vu = false; for (let k = 0; k < 30 && !vu; k++) { await pause(300); vu = (await texte(prof)) !== avant; }
    verif(6, vu, "la réponse cliquée sur la tablette se voit sur ta console sans rechargement");
    if (champ) { const st = await prof.evaluate(() => { const f = document.querySelector("[data-k6='1']"); return f ? {focus: document.activeElement === f, v: f.value} : null; });
      verif(6, !!st && st.focus && /7$/.test(st.v), "le champ où tu tapais garde sa valeur et le curseur pendant que la tablette répond", JSON.stringify(st)); }
    else verif(6, true, "aucun champ de saisie à cet écran de la console (rien à mesurer)");

    // K7 — le 2e tour : l'autre moitié répond ; puis la question se clôt
    await cliquer(prof, /Tour suivant/);
    await pause(800);
    const autre = await cliquer(tab, new RegExp("^" + EV.questions[0].choix[EV.questions[0].bonnes[0]] + "$"), 1) || await cliquer(tab, new RegExp("^" + EV.questions[0].choix[EV.questions[0].bonnes[0]] + "$"), 0);
    verif(7, autre, "« ⏭️ Tour suivant » : l'autre moitié répond à son tour");
    verif(7, await cliquer(prof, /Clore la question/), "« 🔒 Clore la question » est là, et se clique");

    // K8 — la base garde chaque réponse, au nom de l'élève
    const sess = srv.store.get("qcm/sessions") || {};
    const brut = JSON.stringify(sess);
    verif(8, /abrial_julien|ABRIAL Julien/.test(brut) && new RegExp(voisin.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ /g, "_") + "|" + voisin).test(brut), "les réponses des deux élèves sont dans la base, sous la séance", brut.slice(0, 200));

    // K10 — les questions 2 et 3, chacune à ses deux tours : Julien juste à Q2 sur la tablette, son voisin faux ; Q3 : Julien juste, le voisin faux
    // une moitié est « active » quand ses choix de la question sont cliquables ; chaque moitié répond une fois, à son tour (le 1er tour n'est pas toujours celui de gauche)
    const active = (cote, qi) => tab.evaluate(([cote, choix]) => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
      const h = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[cote]; if (!h) return false;
      return [...h.querySelectorAll("button, [role=button]")].some(b => !b.disabled && b.getBoundingClientRect().width > 0 && choix.includes((b.textContent || "").trim())); }, [cote, EV.questions[qi].choix]);
    const repondreTour = async (qi, choixG, choixD) => {
      await cliquer(prof, /Autoriser la réponse/); await pause(600);
      const fait = new Set();
      for (const tour of [1, 2]) {
        for (let essai = 0; essai < 20 && fait.size < tour; essai++) {
          for (const [cote, choix] of [[0, choixG], [1, choixD]]) {
            if (fait.has(cote) || !(await active(cote, qi))) continue;
            for (const c of choix) await cliquer(tab, new RegExp("^" + EV.questions[qi].choix[c].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"), cote);
            fait.add(cote);
            for (let k = 0; k < 12 && !(await cliquer(tab, /Oui, la même chose/, cote)); k++) await pause(500);
          }
          if (fait.size < tour) await pause(500);
        }
        if (tour === 1) { await cliquer(prof, /Tour suivant/); await pause(800); }
      }
      return fait.size === 2 && await cliquer(prof, /Clore la question/);
    };
    await cliquer(prof, /Lancer Q2/); await attendre(tab, /QUESTION 2/i, 8000);
    verif(10, await repondreTour(1, EV.questions[1].bonnes, [1]), "question 2 : les deux tours joués, puis close");
    await cliquer(prof, /Lancer Q3/); await attendre(tab, /QUESTION 3/i, 8000);
    verif(10, await repondreTour(2, EV.questions[2].bonnes, [0]), "question 3 : les deux tours joués, puis close");

    // K11 — l'estimation et la seconde attestation, puis la correction, dans l'ordre des plus ratées : Q2 (aucune lecture n'est encore faite)
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(800);
    for (const i of [0, 1]) { await tab.evaluate(i => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
      const h = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[i]; const b = h && [...h.querySelectorAll("button")].find(x => /bonne|réponse/i.test(x.textContent) && x.getBoundingClientRect().width > 0); if (b) b.click(); }, i); await pause(300); }
    await cliquer(prof, /Lancer la correction/); await pause(800);
    for (const i of [0, 1]) {
      for (let k = 0; k < 12; k++) { const fait = await tab.evaluate(i => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
          const h = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[i]; if (!h) return false;
          const c = [...h.querySelectorAll("input[type=checkbox], [role=checkbox]")].find(x => !x.checked && x.getAttribute("aria-checked") !== "true" && x.getBoundingClientRect().width > 0); if (!c) return false; c.click(); return true; }, i); if (!fait) break; await pause(250); }
      await cliquer(tab, /Je commence|J'ai compris|Je suis prêt/, i);
    }
    await pause(1200);
    m = await moities(tab);
    verif(11, m.length === 2 && m.every(x => /QUESTION 2/i.test(x)), "la correction commence par la question 2, la plus ratée (Q2 : 1 juste sur 2 ; Q1 : 2 sur 2)", m.map(x => (x.match(/QUESTION \d/i) || ["?"])[0]).join(" | "));

    // K12 — « 💡 Révéler » reste fermé tant qu'un présent n'a pas eu sa feuille lue ; la lecture se clique dans la moitié du propriétaire de la feuille
    verif(12, (await fermeOuvert(prof, /Révéler/)) !== "ouvert", "« 💡 Révéler » fermé avant toute lecture", await fermeOuvert(prof, /Révéler/));
    // la feuille de Julien (moitié de gauche), lue par son voisin : il a écrit faux (Genève) ; celle du voisin (moitié de droite) : faux aussi (Genève)
    await cliquer(tab, /^Genève$/, 0); await cliquer(tab, /^Genève$/, 1);
    await pause(1000);
    verif(12, (await fermeOuvert(prof, /Révéler/)) === "ouvert", "« 💡 Révéler » s'ouvre quand les deux feuilles sont lues", await fermeOuvert(prof, /Révéler/));
    await cliquer(prof, /Révéler/); await pause(1000);
    m = await moities(tab);
    verif(12, m.length === 2 && m.every(x => /BONNE RÉPONSE/i.test(x)), "après « Révéler », les deux moitiés montrent la bonne réponse");
    // Julien : sa feuille est fausse, sa tablette juste : « Trouvée au dernier moment » (une fois par évaluation) ; son voisin : faux partout
    verif(12, /Trouvée au dernier moment/.test(m[0] || ""), "Julien, feuille fausse et tablette juste à Q2 : « Trouvée au dernier moment »", (m[0] || "").slice(0, 200));
    verif(12, !/Trouvée au dernier moment/.test(m[1] || ""), "son voisin, faux sur la feuille et sur la tablette : pas de « Trouvée au dernier moment »");
    // Q3 puis Q1 : les feuilles lues justes pour Julien, fausses pour le voisin à Q3, justes à Q1
    for (const [qi, g, d] of [[2, EV.questions[2].bonnes, [0]], [0, EV.questions[0].bonnes, EV.questions[0].bonnes]]) {
      await cliquer(prof, /Question suivante/); await pause(900);
      for (const [cote, choix] of [[0, g], [1, d]]) for (const c of choix) await cliquer(tab, new RegExp("^" + EV.questions[qi].choix[c].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"), cote);
      await pause(800); await cliquer(prof, /Révéler/); await pause(900);
    }

    // K13 — la co-évaluation : chacun dit que son voisin a bien lu ; puis « 🏁 Afficher leur bilan aux élèves »
    await cliquer(prof, /co-évaluation/); await pause(900);
    for (const i of [0, 1]) await cliquer(tab, /^✅|bien lu|C'est bon|d'accord/i, i);
    await pause(1000);
    verif(13, await cliquer(prof, /Afficher leur bilan aux élèves/), "« 🏁 Afficher leur bilan aux élèves » se clique quand la co-évaluation est finie");
    await pause(1200);

    // K14 — les notes, d'après la règle (la note, c'est la feuille ; « Trouvée au dernier moment » compte une fois) : Julien 3 / 3, son voisin 1 / 3
    m = (await moities(tab)).map(x => x.replace(/\s+/g, " "));
    verif(14, /3 ?\/ ?3/.test(m[0] || ""), "le bilan de Julien dit 3 / 3 (Q1 et Q3 justes sur sa feuille, Q2 trouvée au dernier moment)", (m[0] || "").slice(0, 240));
    verif(14, /1 ?\/ ?3/.test(m[1] || ""), "le bilan de son voisin dit 1 / 3 (seule Q1 juste sur sa feuille)", (m[1] || "").slice(0, 240));
    verif(14, (await moities(tab)).every(x => !/c4-[a-z]+-\d\d/.test(x)), "le bilan de l'élève ne montre aucun code de compétence (ses libellés élève)");

    // K15 — tout est dans la base : les lectures, la question trouvée au dernier moment, le bilan affiché
    const s2 = JSON.stringify(srv.store.get("qcm/sessions") || {});
    verif(15, /lectures/.test(s2) && /trouvee/.test(s2) && /bilanAffiche/.test(s2), "la base garde les lectures, la question « trouvée » et le bilan affiché (contrat, COMMUN §3.1)", s2.slice(0, 200));

    // K9 — aucune boîte système, aucune erreur de page
    const toutes = [prof, tab, tab2, tableau, tel];
    const errs = [].concat(...toutes.map(x => x.__err));
    verif(9, errs.length === 0, "aucune erreur de page ni boîte système dans les cinq pages", errs.slice(0, 3).join(" · "));
  } catch (e) { verif(0, false, "le contrôle s'est arrêté", e.stack); }
  await navig.close(); await srv.close();
  const tete = "Contrôles de la conscience n°12 pour l'app — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString() + "\nmd5 de controles-app.js : " + require("crypto").createHash("md5").update(fs.readFileSync(__filename)).digest("hex") + "\nDurée : " + Math.round((Date.now() - t0) / 1000) + " s · vérifications : " + nb + " · échecs : " + echecs + "\n";
  const txt = tete + RAPPORT.join("\n") + "\n";
  if (SORTIE) fs.writeFileSync(SORTIE, txt);
  process.stdout.write(txt);
  process.exit(echecs ? 1 : 0);
})();
