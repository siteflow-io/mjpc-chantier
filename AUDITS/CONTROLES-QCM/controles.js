// Les contrôles de la conscience n°12 pour la maquette complète du QCM (protocole de l'audit du 12/10/2026, obligation 1).
// Ils disent ce qui doit être vrai, tiré du cadrage et des écrans validés ; ils passent par le geste (un clic, puis l'écran où il mène).
// Les valeurs attendues sont figées dans attendus/ (figer-attendus.js, sur la v8 auditée) : elles ne viennent pas de la version contrôlée.
// usage : node controles.js <maquette-qcm-vN.html> [sortie.txt]   — code de sortie 1 si un seul contrôle échoue.
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs"), path = require("path");
const V = path.resolve(process.argv[2]), SORTIE = process.argv[3] || null;
const A = path.join(__dirname, "attendus");
const NOTES = JSON.parse(fs.readFileSync(path.join(A, "notes.json")));
const PDF3E = fs.readFileSync(path.join(A, "pdf-3e.txt"), "utf8");
const RAPPORT = [];
let nb = 0, echecs = 0;
function verif(n, ok, quoi, detail) { nb++; if (!ok) echecs++; RAPPORT.push((ok ? "  ok     " : "  ÉCHEC  ") + "C" + n + " · " + quoi + (detail && !ok ? " — " + detail : "")); return ok; }
const norm = s => (s || "").replace(/[  ]/g, " ");

let navig;
async function page(w, h) {
  const ctx = await navig.newContext({viewport: {width: w, height: h}});
  const p = await ctx.newPage();
  await p.addInitScript(() => { window.__ouvert = []; window.open = u => { window.__ouvert.push(String(u)); return null; }; window.print = () => {}; window.close = () => {}; });
  p.on("dialog", d => d.dismiss().catch(() => {}));
  return p;
}
async function aller(p, h) {
  await p.goto("about:blank");
  await p.goto("file://" + V + "#scene=" + h);
  await p.waitForFunction(() => window.SCENE_PRETE, null, {timeout: 8000}).catch(() => {});
  await p.waitForTimeout(500);
}
const TEXTE = () => { const out = [document.getElementById("root").innerText]; document.querySelectorAll("iframe").forEach(f => { try { out.push(f.contentDocument.body.innerText); } catch (e) {} }); return out.join("\n"); };
// Clique le k-ième élément visible dont le texte contient « lib », et rend où il mène : la scène du hash, ou la page ouverte par window.open.
async function cliquer(p, lib, k) {
  const ok = await p.evaluate(([lib, k]) => {
    const els = [...document.querySelectorAll("#root button, #root a, #root [data-va], #root [role=button]")].filter(e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && (e.textContent || "").includes(lib); });
    const e = els[k || 0]; if (!e) return false; e.setAttribute("data-ctl", "1"); return true;
  }, [lib, k || 0]);
  if (!ok) return {trouve: false};
  const avant = await p.evaluate(() => location.hash);
  await p.click("[data-ctl='1']", {timeout: 2000}).catch(() => {});
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({hash: location.hash, ouvert: window.__ouvert.slice()}));
  const dest = r.ouvert.length ? (r.ouvert[r.ouvert.length - 1].split("#scene=")[1] || null) : (r.hash !== avant ? r.hash.replace(/^#scene=/, "") : null);
  return {trouve: true, dest: dest ? decodeURIComponent(dest) : null, parFenetre: r.ouvert.length > 0};
}
async function lireTableau(p) {
  return p.evaluate(() => { const tb = document.querySelector("#root table"); if (!tb) return null;
    return {cls: tb.className, th: [...tb.querySelectorAll("th")].map(x => x.innerText.replace(/\s+/g, " ").trim()),
      rows: [...tb.querySelectorAll("tbody tr")].map(tr => [...tr.children].map(td => td.innerText.replace(/\s+/g, " ").trim()))}; });
}
// Les moitiés d'une tablette : les deux blocs de 35 à 60 % de la largeur, de gauche à droite
const MOITIES = () => { const W = innerWidth; const all = [...document.querySelectorAll("#root *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
  return all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x).map(e => e.innerText); };
function lum(c) { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function contraste(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

(async () => {
  navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await page(1536, 864);

  // C1 — le tableau des résultats de chaque séance : celui de c-resultats, rempli pour cette séance (complément 4, correction 1)
  await aller(p, "c-resultats");
  const ref = await lireTableau(p);
  const sortes = th => th.filter(x => !/^Q\d+$/.test(x)).map(x => x.startsWith("🧩") ? "🧩" : x.replace(/ ▴| ▾/g, "")).filter((x, i, a) => a.indexOf(x) === i);
  const SORTES = ref ? sortes(ref.th) : [];
  for (const [id, k] of [["S3E", 0], ["PAP", 1], ["S08", 2], ["CH1", 3], ["JB", 4]]) {
    await aller(p, "c-seances");
    const c = await cliquer(p, "📊 Ouvrir", k);
    verif(1, c.trouve && c.dest && c.dest.includes("c-resultats") && (id === "S08" ? !/seance=(?!S08)/.test(c.dest) : c.dest.includes("seance=" + id)), id + " : « 📊 Ouvrir » n°" + (k + 1) + " de « Résultats » mène au tableau de cette séance", JSON.stringify(c));
    if (!c.dest) continue;
    await aller(p, c.dest);
    const t = await lireTableau(p);
    if (!verif(1, !!t, id + " : un tableau s'ouvre")) continue;
    verif(1, t.cls === ref.cls, id + " : le tableau a la mise en forme de c-resultats (classe « " + ref.cls + " »)", "classe « " + t.cls + " »");
    const s = sortes(t.th), manque = SORTES.filter(x => !s.includes(x));
    verif(1, manque.length === 0, id + " : le tableau a les colonnes de c-resultats (compétences, autonomie, « À lire sur la feuille »…)", "manquent : " + manque.join(", "));
    const nq = t.th.filter(x => /^Q\d+$/.test(x)).length;
    verif(1, nq === NOTES[id].questions, id + " : " + NOTES[id].questions + " colonnes de questions", nq + " colonnes");
    const iN = t.th.indexOf("Note"), i20 = t.th.indexOf("Sur 20");
    let faux = [];
    for (const [nom, att] of Object.entries(NOTES[id].eleves)) {
      const r = t.rows.find(x => x[0] === nom);
      if (att === "absent") { if (r && r.length > 3 && /\d/.test(r[iN] || "")) faux.push(nom + " noté alors qu'absent"); continue; }
      if (!r) { faux.push(nom + " sans ligne"); continue; }
      if (r[iN] !== att[0] || r[i20] !== att[1]) faux.push(nom + " : " + r[iN] + " · " + r[i20] + " au lieu de " + att.join(" · "));
    }
    verif(1, faux.length === 0, id + " : la note et la note sur 20 de chaque élève", faux.slice(0, 4).join(" ; ") + (faux.length > 4 ? " ; … (" + faux.length + ")" : ""));
    const pdf = await p.evaluate(() => { const b = [...document.querySelectorAll("#root button")].find(x => /PDF notes/.test(x.textContent)); return b ? (b.disabled ? "fermé" : "ouvert") : "absent"; });
    verif(1, pdf !== "absent", id + " : « 📄 PDF notes et compétences » est là, ouvert ou fermé", pdf);
  }

  // C2 — le PDF est celui de sa séance (correction 2)
  await aller(p, "c-resultats-rendues");
  let c = await cliquer(p, "PDF notes");
  verif(2, c.trouve && !!c.dest, "« 📄 PDF notes et compétences » de c-resultats-rendues ouvre un PDF", JSON.stringify(c));
  if (c.dest) {
    await aller(p, c.dest);
    const t = norm(await p.evaluate(TEXTE));
    verif(2, /Évaluation : Évaluation d'essai/.test(t), "ce PDF est celui de l'évaluation d'essai", (t.match(/Évaluation : [^\n]*/) || ["aucune ligne « Évaluation : »"])[0]);
    verif(2, /Séance : 08\/10\/2026 · 3 questions/.test(t), "ce PDF est celui de la séance du 08/10, 3 questions", (t.match(/Séance : [^\n]*/) || ["aucune ligne « Séance : »"])[0]);
    verif(2, /ZELLER Lou\s*6,7/.test(t), "Lou y a 6,7, sa note après la lecture du soir (1 / 3)", (t.match(/ZELLER Lou[^\n]{0,20}/) || ["Lou absente du PDF"])[0]);
  }
  await aller(p, "x632-pdf");
  const t632 = await p.evaluate(() => [...document.querySelectorAll("iframe")].map(f => f.contentDocument.body.innerText).join("\n"));
  verif(2, t632 === PDF3E, "x632-pdf (séance de 3e) est, au caractère près, le PDF validé", "écart de " + Math.abs(t632.length - PDF3E.length) + " caractères, ou texte différent");

  // C3 — l'appel du rattrapage (correction 3)
  await aller(p, "c-rattrapage");
  c = await cliquer(p, "Lancer le rattrapage");
  verif(3, c.trouve && !!c.dest, "« 🚀 Lancer le rattrapage » ouvre un appel", JSON.stringify(c));
  if (c.dest) {
    await aller(p, c.dest);
    const t = norm(await p.evaluate(() => { const m = document.querySelector("#root .checkin-modal, #root [role=dialog], #root .modal"); return (m || document.getElementById("root")).innerText; }));
    verif(3, /YVON Adam/.test(t), "l'appel nomme YVON Adam");
    verif(3, !/1 absent sur 1/.test(t), "Adam n'y est pas absent", (t.match(/[^\n]*1 absent sur 1[^\n]*/) || [""])[0].slice(0, 120));
    verif(3, !/CHEVALLIER Théo|ZELLER Lou/.test(t), "aucun autre élève de la classe n'y paraît", (t.match(/[^\n]*(CHEVALLIER Théo|ZELLER Lou)[^\n]*/) || [""])[0].slice(0, 140));
  }

  // C4 — la démo sur les tablettes, au moment qu'elle déclare : la question 1 (correction 4)
  const pt = await page(1280, 800);
  await aller(pt, "t-demo-q");
  let m = (await pt.evaluate(MOITIES)).map(norm);
  verif(4, m.length === 2 && m.every(x => /QUESTION 1 \/ 3/.test(x)), "t-demo-q : « QUESTION 1 / 3 » dans les deux moitiés", m.map(x => (x.match(/QUESTION \d+ \/ \d+/) || ["?"])[0]).join(" | "));
  verif(4, m.length === 2 && m.every(x => /Évaluation d'entraînement : elle ne compte pas\./.test(x)), "t-demo-q : le bandeau de la démo dans les deux moitiés");

  // C5 — la séance interrompue dit le bon côté (correction 5)
  await aller(p, "c-interrompue");
  let t = norm(await p.evaluate(TEXTE));
  verif(5, /question 2, 2e tour \(moitiés de gauche\)/.test(t), "c-interrompue : « question 2, 2e tour (moitiés de gauche) »", (t.match(/État : [^\n]*/) || ["aucune ligne « État : »"])[0]);

  // C6 — Adam, seul, garde le chrono de la v7 (correction 6)
  await aller(pt, "t-corr-seul");
  t = norm(await pt.evaluate(TEXTE));
  verif(6, /temps de réponse/i.test(t) && !/feuille du voisin/i.test(t), "t-corr-seul : le chrono dit « Temps de réponse », pas « la feuille du voisin »", (t.match(/[^\n]*TEMPS[^\n]*/i) || ["aucun chrono"])[0]);
  for (const id of ["t-corr-q1-lecture", "t-corr-q2-lecture", "t-corr-q3-lecture"]) {
    await aller(pt, id);
    m = (await pt.evaluate(MOITIES)).map(norm);
    verif(6, m.length === 2 && m.every(x => /temps pour lire la feuille du voisin/i.test(x)), id + " : « Temps pour lire la feuille du voisin » dans les deux moitiés (un voisin lit)");
  }

  // C7 — sur le téléphone, tout texte posé directement sur le fond de la page se lit : contraste mesuré aux pixels (correction 7)
  const ptel = await page(390, 844);
  const TEL = await (async () => { await aller(ptel, "p-reponse"); return ptel.evaluate(() => (window.LISTE_SCENES || []).filter(s => s.vue === "telephone").map(s => s.id)); })();
  const {execFileSync} = require("child_process");
  let mesures = 0;
  for (const id of TEL) {
    await aller(ptel, id);
    const n = await ptel.evaluate(() => {
      const fondPropre = e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.backgroundImage !== "none" || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)) return x; } return null; };
      const pageFond = fondPropre(document.getElementById("root").firstElementChild || document.getElementById("root"));
      let k = 0;
      document.querySelectorAll("#root *").forEach(e => {
        const txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("").trim();
        if (txt.length < 3) return; const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
        const f = fondPropre(e); if (f !== pageFond && f !== null) return;   // le texte a son propre fond (carte, bouton) : mesuré ailleurs (garde 14)
        e.setAttribute("data-ctl7", String(k++));
      });
      return k;
    });
    for (let k = 0; k < n; k++) {
      const box = await ptel.evaluate(k => { const e = document.querySelector(`[data-ctl7="${k}"]`); e.scrollIntoView({block: "center"}); const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return {x: r.x, y: r.y, w: r.width, h: r.height, color: cs.color, fs: parseFloat(cs.fontSize), fw: parseInt(cs.fontWeight), txt: e.textContent.trim().slice(0, 60)}; }, k);
      if (box.y < 0 || box.y + box.h > 844) continue;
      const devant = await ptel.evaluate(([k, x, y]) => { const e = document.querySelector(`[data-ctl7="${k}"]`); const t = document.elementFromPoint(x, y); return !!t && (t === e || e.contains(t)); }, [k, box.x + Math.min(box.w, 20) / 2, box.y + box.h / 2]);
      if (!devant) continue;   // un texte recouvert (derrière une fenêtre ouverte) n'est pas à lire
      const clip = {x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(390 - Math.max(0, box.x), Math.max(2, box.w)), height: Math.max(2, box.h)};
      await ptel.evaluate(k => { const e = document.querySelector(`[data-ctl7="${k}"]`); e.dataset.couleur = e.style.color; e.style.setProperty("color", "transparent", "important"); }, k);
      await ptel.waitForTimeout(60);
      const f = path.join(require("os").tmpdir(), "ctl7.png"); fs.writeFileSync(f, await ptel.screenshot({clip}));
      await ptel.evaluate(k => { const e = document.querySelector(`[data-ctl7="${k}"]`); e.style.color = e.dataset.couleur || ""; }, k);
      const px = JSON.parse(execFileSync("python3", ["-W", "ignore", "-c", "import sys,json;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');p=sorted(list(im.getdata()),key=lambda c:sum(c));print(json.dumps(p[len(p)//2]))", f]).toString());
      const coul = box.color.match(/[\d.]+/g).slice(0, 3).map(Number);
      const kk = contraste(coul, px), grand = box.fs >= 24 || (box.fs >= 18.66 && box.fw >= 700);
      mesures++;
      if (kk < (grand ? 3 : 4.5)) verif(7, false, id + " : « " + box.txt + " » contraste " + kk.toFixed(1) + " (texte " + box.color + ", fond rgb(" + px.join(", ") + "))", "sous " + (grand ? 3 : 4.5));
    }
  }
  verif(7, mesures > 0, "téléphone : " + mesures + " textes posés sur le fond de la page, mesurés aux pixels dans " + TEL.length + " scènes", "aucun texte mesuré");

  // C8 — la règle du désaccord, là où elle est seule (correction 8)
  const REGLE = /Un désaccord, c'est sérieux : tu n'en signales qu'un, celui dont tu es le plus sûr\. Il se vérifie sur ta feuille\./;
  for (const [id, g, d] of [["t-coeval", 1, 1], ["t-coeval-daccord", 1, 1], ["x610-6-coeval-laquelle", 1, 1], ["t-coeval-ecrit", 1, 0], ["x610-7-coeval-ecrit", 1, 0]]) {
    await aller(pt, id);
    m = (await pt.evaluate(MOITIES)).map(norm);
    const vu = m.map(x => REGLE.test(x) ? 1 : 0);
    verif(8, m.length === 2 && vu[0] === g && vu[1] === d, id + " : la règle du désaccord " + (g ? "dans" : "hors de") + " la moitié de gauche, " + (d ? "dans" : "hors de") + " celle de droite", "vue : gauche " + vu[0] + ", droite " + vu[1]);
    if (!d) verif(8, m.length === 2 && /C'est ta seule question de désaccord\./.test(m[1]), id + " : « ☝️ C'est ta seule question de désaccord. » reste dans la moitié de droite");
  }

  // C9 — l'évaluation de 3e : « À compléter » le 07/10, complétée pour la séance du 09/10 (correction 1.5)
  await aller(p, "c-evals");
  t = norm(await p.evaluate(TEXTE));
  const i = t.indexOf("3e- éval 1 Analyse logique");
  verif(9, i >= 0 && /À compléter/.test(t.slice(i, i + 400)), "c-evals (07/10) : l'évaluation de 3e est encore « À compléter »");
  await aller(p, "c-seances");
  c = await cliquer(p, "📊 Ouvrir", 0);
  if (c.dest) {
    await aller(p, c.dest);
    const tb = await lireTableau(p);
    const comp = tb ? tb.th.filter(x => x.startsWith("🧩")).map(x => x.split(" ")[1]) : [];
    verif(9, comp.includes("c4-langue-04") && comp.includes("c4-ecrire-02"), "le tableau de la séance de 3e a les deux compétences du PDF validé (c4-langue-04, c4-ecrire-02)", "compétences : " + (comp.join(", ") || "aucune"));
  }

  // C10 — l'heure de classe jouée geste par geste, de l'appel au soir, la même à chaque audit (attendus/heure.json, tiré de la v8 auditée)
  const HEURE = JSON.parse(fs.readFileSync(path.join(A, "heure.json")));
  const TAILLE = {console: [1536, 864], telephone: [390, 844], tablette: [1280, 800], tableau: [1280, 800], eleve: [1280, 800]};
  const LS = await (async () => { await aller(p, "c-lancer"); return p.evaluate(() => Object.fromEntries((window.LISTE_SCENES || []).map(s => [s.id, s.moment]))); })();
  for (const [i, s] of HEURE.entries()) {
    await aller(p, s.scene);
    if (s.rang < 0) s.rang = (await p.evaluate(lib => [...document.querySelectorAll("#root button, #root a, #root [data-va], #root [role=button]")].filter(e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && (e.textContent || "").includes(lib); }).length, s.geste)) - 1;
    const c = await cliquer(p, s.geste, s.rang);
    const dest = c.dest ? c.dest.split("&")[0] : null;
    verif(10, dest === s.mene, "pas " + (i + 1) + " : " + s.scene + " → « " + s.geste + " » → " + s.mene, "mène à " + (c.dest || "rien"));
    verif(10, LS[s.mene] === s.moment, "pas " + (i + 1) + " : " + s.mene + " se déclare au moment " + s.moment, "déclaré : " + LS[s.mene]);
    const q = /Q(\d)/.exec(s.moment);
    if (q && dest) {
      const [w, h] = TAILLE[s.vue] || TAILLE.console; const pq = await page(w, h);
      await aller(pq, c.dest);
      const tx = norm(await pq.evaluate(TEXTE));
      verif(10, new RegExp("question " + q[1] + "\\b", "i").test(tx), "pas " + (i + 1) + " : " + s.mene + " montre la question " + q[1], (tx.match(/question \d[^\n]{0,20}/i) || ["aucune question"])[0]);
      await pq.context().close();
    }
  }
  await aller(p, "c-resultats-rendues");
  const rr = await lireTableau(p);
  const lou = rr ? rr.rows.find(x => x[0] === "ZELLER Lou") : null;
  verif(10, !!lou && lou.includes("1/3") && lou.includes("6,7"), "le soir, copies rendues : Lou a 1 / 3 (6,7) dans ton tableau, après la lecture de sa feuille", lou ? lou.join(" | ").slice(0, 120) : "Lou absente du tableau");

  await navig.close();
  const tete = "Contrôles de la conscience n°12 — " + path.basename(V) + " — " + new Date().toISOString() + "\nmd5 de controles.js : " + require("crypto").createHash("md5").update(fs.readFileSync(__filename)).digest("hex") + "\nVérifications : " + nb + " · échecs : " + echecs + "\n";
  const txt = tete + RAPPORT.join("\n") + "\n";
  if (SORTIE) fs.writeFileSync(SORTIE, txt);
  process.stdout.write(txt);
  process.exit(echecs ? 1 : 0);
})();
