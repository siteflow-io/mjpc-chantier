// QCM-4 · BANC — contrôle à froid des micros, la mesure demandée par la conscience à 14:39 (DEFAUTS-OUVERTS) : « Mesure, par le geste, si les
// chronos des questions ont le même effet que la carte de la lecture quand on tape un temps pendant que le chrono tourne (« 45 » tapé pendant
// un tour : le « 4 » seul fait-il finir le tour ?). Écris ce que tu vois dans le VERDICT ; rien ne se corrige avant la réponse de Paul. »
// Une MESURE, pas un contrôle : ce qui est vu s'écrit en notes ; seules comptent comme vérifications les conditions de la mesure (le tour
// en cours au moment de la frappe, la valeur tapée gardée par le champ).
// 3 ESSAI, Adam absent ; deux tablettes entrées (quatre élèves) ; Q1, « Autoriser la réponse » ; 8 s après, Paul tape « 45 » dans le champ
// du temps de réponse de Q1, chiffre par chiffre (0,8 s entre les deux), puis Tab ; la base et les tablettes relevées toutes les 100 ms.
//   APP_FILE=<app> node banc/banc-micros-16-10-d.js <dossier de sortie>   → micros-d.txt, captures-micros-d/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, zoneTexte, cliquer, choisir, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "micros-d-" + Date.now()));
const CAP = path.join(SORTIE, "captures-micros-d"); fs.mkdirSync(CAP, {recursive: true});
const J = new O.Journal();
const BANC = "QCM-4 · BANC";
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return f; };
const note = s => { J.l.push({note: s}); console.log("  note   " + s); };
const t0 = Date.now();
(async () => {
  const fin = setTimeout(() => { J.v(false, BANC, "plafond de 4 minutes atteint"); ecrire(); process.exit(0); }, 240000);
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return id ? srv.store.get("qcm/sessions/" + id) || {} : {}; };
  const etat = () => { const d = sess().deroule; return d && typeof d === "object" ? d : {}; };
  const reste = () => { const d = etat(); return d.duree ? d.duree - (Date.now() - (d.depuis || 0)) / 1000 : null; };
  try {
    J.section("La mesure : « 45 » tapé dans le temps de réponse de Q1, pendant le 1er tour");
    const prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI|3e Essai/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
    await cliquer(prof, /Lancer la séance/); await pause(600); await cliquer(prof, /YVON Adam/); await pause(300);
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
    await pause(1500);
    const pl = sess().places || {}; const T = Object.keys(pl).map(k => ({g: pl[k].g, d: pl[k].d})).filter(t => t.g && t.d);
    if(T.length < 2) throw new Error("pas de places");
    const t1 = await A.tablette("tablette-1", "3 ESSAI"), t2 = await A.tablette("tablette-2", "3 ESSAI");
    await O.entrerTablette(t1, [["g", nomDe(T[0].g)], ["d", nomDe(T[0].d)]], codeDe);
    await O.entrerTablette(t2, [["g", nomDe(T[1].g)], ["d", nomDe(T[1].d)]], codeDe);
    for(const [p, c] of [[t1, "g"], [t1, "d"], [t2, "g"], [t2, "d"]]){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);
    await cliquer(prof, /Lancer Q1\b/); await pause(800);
    await cliquer(prof, /Autoriser la réponse/);
    for(let k = 0; k < 40 && etat().ph !== "reponse"; k++) await pause(200);
    const d0 = etat();
    J.v(d0.ph === "reponse", BANC, "le 1er tour de Q1 est en cours (deroule.ph = reponse)", JSON.stringify(d0));
    await pause(8000);
    const sel = "input[data-temps='reponse'][data-q='1']";
    const champ = await prof.evaluate(sel => { const i = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0); return i ? {v: i.value, dis: i.disabled} : null; }, sel);
    J.v(!!champ && !champ.dis, BANC, "le champ du temps de réponse de Q1 est à la console, ouvert, pendant le tour", JSON.stringify(champ));
    note("avant la frappe : " + JSON.stringify({ph: d0.ph, tour: d0.tour, cote: d0.cote, duree: etat().duree, temps: (sess().temps || {})[0]}) + " ; écoulé " + ((Date.now() - (etat().depuis || 0)) / 1000).toFixed(1) + " s, reste " + (reste() || 0).toFixed(1) + " s");
    // la frappe : « 4 », 0,8 s, « 5 », puis Tab ; relevés toutes les 100 ms
    const rel = []; let marche = true;
    const releve = (async () => { while(marche){ const d = etat(); rel.push({t: Date.now(), ph: d.ph, tour: d.tour, cote: d.cote, duree: d.duree, reste: reste()}); await pause(100); } })();
    await prof.evaluate(sel => { const i = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0); i.setAttribute("data-banc", "t"); }, sel);
    await prof.click("[data-banc='t']"); await prof.keyboard.press("Control+A");
    const tA = Date.now(); await prof.keyboard.type("4"); await pause(800);
    const apres4 = {d: etat(), r: reste()}; const f4 = await capt(prof, "console-apres-4"); const z4 = await zoneTexte(t1, d0.cote || "g"); await capt(t1, "tablette-apres-4");
    await prof.keyboard.type("5"); await pause(800);
    const apres45 = {d: etat(), r: reste()}; const f45 = await capt(prof, "console-apres-45");
    await prof.keyboard.press("Tab"); await pause(1500);
    marche = false; await releve;
    const fTab = await capt(prof, "console-apres-tab"); const zT = await zoneTexte(t1, d0.cote || "g"); await capt(t1, "tablette-apres-tab");
    const vu = rel.filter(x => x.t >= tA);
    const minR = Math.min(...vu.map(x => x.reste == null ? Infinity : x.reste));
    const phases = [...new Set(vu.map(x => x.ph + (x.tour ? "/t" + x.tour : "") + (x.cote ? "/" + x.cote : "")))];
    note("après « 4 » (0,8 s) : " + JSON.stringify({ph: apres4.d.ph, tour: apres4.d.tour, duree: apres4.d.duree, reste: apres4.r == null ? null : +apres4.r.toFixed(1)}) + " (" + f4 + ") ; la moitié qui avait la main : « " + z4.replace(/\s+/g, " ").slice(0, 120) + " »");
    note("après « 45 » (0,8 s) : " + JSON.stringify({ph: apres45.d.ph, tour: apres45.d.tour, duree: apres45.d.duree, reste: apres45.r == null ? null : +apres45.r.toFixed(1)}) + " (" + f45 + ")");
    note("après Tab : " + JSON.stringify({ph: etat().ph, tour: etat().tour, duree: etat().duree, temps: (sess().temps || {})[0], reste: reste() == null ? null : +reste().toFixed(1)}) + " (" + fTab + ") ; la moitié : « " + zT.replace(/\s+/g, " ").slice(0, 120) + " »");
    note("pendant la frappe, toutes les 100 ms : le plus petit temps restant " + (isFinite(minR) ? minR.toFixed(1) + " s" : "?") + " ; les phases vues : " + phases.join(" → "));
    const fini = vu.some(x => x.ph !== "reponse" || x.tour !== d0.tour);
    note("MESURE : " + (fini ? "le « 4 » seul a fait finir le tour (le chrono à 0 ; la phase a changé : " + phases.join(" → ") + ")" : (isFinite(minR) && minR <= 0 ? "le « 4 » seul a mis le chrono à 0 (reste " + minR.toFixed(1) + " s), sans que la phase change" : "le « 4 » seul n'a pas fait finir le tour (le plus petit temps restant : " + (isFinite(minR) ? minR.toFixed(1) + " s" : "?") + ")")));
    J.v(((sess().temps || {})[0] || {}).reponse === 45 || /^45$/.test(String(await prof.evaluate(sel => (document.querySelector(sel) || {}).value, sel))), BANC, "le champ a gardé « 45 » (la mesure porte bien sur la frappe de « 45 »)", JSON.stringify((sess().temps || {})[0]));
  } catch(e){ J.v(false, BANC, "le jeu s'est interrompu : " + e.message); }
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(e){}
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "micros-d.txt"), "La mesure du temps tapé pendant un tour (chronos des questions), par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
    console.log(out);
  }
})();
