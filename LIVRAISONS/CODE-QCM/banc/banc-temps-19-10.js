// QCM-4 · BANC — « Le temps tapé, et la note d'une séance arrêtée avant la fin — 19/10/2026 » (DEFAUTS-OUVERTS), point 28, par le geste, sur le faux hub.
// Paul (16/10 14:58, validé le 19/10 09:43) : « le temps tapé ne part qu'à Entrée, ou quand tu quittes le champ […]. Pendant la frappe, le chrono continue
// comme avant. « +5 », « +10 » et « +30 » partent tout de suite. […] la même règle vaut pour [les chronos des questions] ».
// 3 ESSAI, Adam absent, deux tablettes entrées (quatre élèves). Le journal du faux hub compte chaque écriture de temps/ et de deroule/duree.
//  A. pendant le 1er tour de Q1 : « 45 » tapé chiffre par chiffre dans le temps de réponse de Q1, une tablette répond pendant la frappe (un redessin) :
//     rien n'est écrit, le tour ne finit pas, le champ garde « 45 » et le curseur ; Entrée : le temps vaut 45, le tour continue ;
//     « 50 » puis quitter le champ (Tab) : 50 ; le champ vidé puis quitté : il reprend 50, rien n'est écrit ; « Toutes les questions », Q2 : « 30 »,
//     rien avant Entrée, puis 30 ; « +5 » : tout de suite ; les infobulles des champs disent « Entrée ».
//  B. à la lecture de la feuille du voisin : « 130 » tapé pendant que les tablettes cliquent : rien n'est écrit, aucune lecture figée ; Entrée : 130 ;
//     « +10 » avant le 0 : tout de suite, +10 ; un temps tapé (Entrée) pour arriver à 0, la lecture figée ; « +10 » après le 0 : rouverte pour 10 s.
//   APP_FILE=<app> node banc/banc-temps-19-10.js <dossier de sortie>   → temps.txt, captures-temps/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, choisir, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "temps-" + Date.now()));
const CAP = path.join(SORTIE, "captures-temps"); fs.mkdirSync(CAP, {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H12 = H2 + ", " + H1, BANC = "QCM-4 · BANC";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const JUSTE = [["Rome"], ["Madrid", "Berlin"], ["8"]];
const t0 = Date.now();
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return "captures-temps/" + f; };
const note = s => { J.l.push({note: s}); console.log("  note   " + s); };
(async () => {
  const fin = setTimeout(() => { J.v(false, BANC, "plafond de 7 minutes atteint"); ecrire(); process.exit(0); }, 420000);
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sid = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; return id || dernier; };
  const S = () => { const id = sid(); return id ? srv.store.get("qcm/sessions/" + id) || {} : {}; };
  const etat = () => { const d = S().deroule; return d && typeof d === "object" ? d : {}; };
  const reste = () => { const d = etat(); return d.duree ? d.duree - (Date.now() - (d.depuis || 0)) / 1000 : null; };
  const tps = (qi, k) => { const v = ((S().temps || {})[qi] || {})[k || "reponse"]; return v != null ? v : EV.questions[qi][k || "reponse"]; };   // sans temps de la séance, celui de l'évaluation
  // le journal : les écritures de temps/<qi> et de deroule/duree (ou deroule entier)
  const ecr = []; const nrm = p => String(p || "").replace(/^\/+|\/+$/g, "");
  srv.watchers.push(op => { const b = nrm(op.p); const ch = op.t === "update" ? Object.keys(op.v || {}).map(k => b + "/" + nrm(k)) : [b];
    for(const c of ch) if(/sessions\/[^/]+\/(temps(\/|$)|deroule\/duree$|deroule$)/.test(c)) ecr.push({t: Date.now(), c}); });
  const ecrDepuis = t => ecr.filter(x => x.t >= t).map(x => x.c.replace(/^.*sessions\/[^/]+\//, ""));
  let nLect = 0; srv.watchers.push(op => { const b = nrm(op.p); const ch = op.t === "update" ? Object.keys(op.v || {}).map(k => b + "/" + k) : [b]; if(ch.some(c => /\/lectures(\/|$)/.test(c))) nLect++; });
  // un champ visible de la console, par son sélecteur
  const marque = async (sel, nom) => prof.evaluate(([sel, nom]) => { const i = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0); document.querySelectorAll("[data-banc='" + nom + "']").forEach(x => x.removeAttribute("data-banc")); if(!i) return null; i.setAttribute("data-banc", nom); return {v: i.value, title: i.title || "", dis: i.disabled}; }, [sel, nom]).catch(() => null);
  const etatChamp = async nom => prof.evaluate(nom => { const i = document.querySelector("[data-banc='" + nom + "']"); return i ? {v: i.value, focus: document.activeElement === i} : {v: null, focus: false}; }, nom).catch(() => ({v: null, focus: false}));
  let prof;
  try {
    J.section("La séance : 3 ESSAI, Adam absent, deux tablettes, quatre élèves ; Q1, « Autoriser la réponse »");
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI|3e Essai/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
    await cliquer(prof, /Lancer la séance/); await pause(600); await cliquer(prof, /YVON Adam/); await pause(300);
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
    await pause(1500);
    const pl = S().places || {}; const T = Object.keys(pl).map(k => ({g: pl[k].g, d: pl[k].d})).filter(t => t.g && t.d);
    if(T.length < 2) throw new Error("pas de places");
    const t1 = await A.tablette("tablette-1", "3 ESSAI"), t2 = await A.tablette("tablette-2", "3 ESSAI");
    await O.entrerTablette(t1, [["g", nomDe(T[0].g)], ["d", nomDe(T[0].d)]], codeDe);
    await O.entrerTablette(t2, [["g", nomDe(T[1].g)], ["d", nomDe(T[1].d)]], codeDe);
    const M = [[t1, "g", T[0].g], [t1, "d", T[0].d], [t2, "g", T[1].g], [t2, "d", T[1].d]];
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);
    await cliquer(prof, /Lancer Q1\b/); await pause(800);
    await cliquer(prof, /Autoriser la réponse/);
    for(let k = 0; k < 40 && etat().ph !== "reponse"; k++) await pause(200);
    const d0 = etat(), cote = d0.cote || "g";
    J.v(d0.ph === "reponse" && d0.tour === 1, BANC, "le 1er tour de Q1 est en cours", JSON.stringify(d0));
    await pause(2000);

    J.section("A. Le temps de réponse de Q1, tapé pendant le 1er tour");
    const SEL = "input[data-temps='reponse'][data-q='1']";
    const ch0 = await marque(SEL, "q1r");
    J.v(!!ch0 && !ch0.dis, BANC, "le champ du temps de réponse de Q1, ouvert, pendant le tour", JSON.stringify(ch0));
    J.v(!!ch0 && /Entrée/.test(ch0.title), H2, "son infobulle dit que le temps part à Entrée (« Tape le temps …, puis Entrée … »)", "« " + (ch0 ? ch0.title : "") + " »");
    const tav = tps(0), duav = etat().duree;
    await prof.click("[data-banc='q1r']"); await prof.keyboard.press("Control+A");
    const tA = Date.now(); const pertes = []; let minR = Infinity;
    await prof.keyboard.type("4");
    // pendant la frappe, la moitié qui a la main sur la tablette 2 répond (un redessin venu d'une tablette)
    await cliquer(t2, /^Rome$/, cote);
    for(let k = 0; k < 8; k++){ await pause(100); const st = await etatChamp("q1r"); if(st.v !== "4" || !st.focus) pertes.push("après « 4 » : « " + st.v + " »" + (st.focus ? "" : ", curseur perdu")); const r = reste(); if(r != null) minR = Math.min(minR, r); }
    await prof.keyboard.type("5");
    for(let k = 0; k < 8; k++){ await pause(100); const st = await etatChamp("q1r"); if(st.v !== "45" || !st.focus) pertes.push("après « 45 » : « " + st.v + " »" + (st.focus ? "" : ", curseur perdu")); const r = reste(); if(r != null) minR = Math.min(minR, r); }
    const fA = await capt(prof, "a-45-avant-entree");
    const e45 = etat(), w45 = ecrDepuis(tA);
    J.v(!w45.length, H2, "pendant la frappe de « 45 », rien n'est écrit (ni temps/0, ni deroule/duree)", w45.join(" · ") + " ; " + fA);
    J.v(e45.ph === "reponse" && e45.tour === 1 && minR > 0, H2, "pendant la frappe, le tour ne finit pas : le chrono continue comme avant", JSON.stringify({ph: e45.ph, tour: e45.tour, minReste: +minR.toFixed(1)}));
    J.v(!pertes.length, H2, "pendant la frappe, une tablette répond (un redessin) : le champ garde « 45 » et le curseur", [...new Set(pertes)].slice(0, 3).join(" | "));
    J.v(!!((S().reponses || {})[0] || {})[T[1][cote]], BANC, "la tablette 2 a bien répondu pendant la frappe", JSON.stringify(Object.keys((S().reponses || {})[0] || {})));
    await prof.keyboard.press("Enter"); await pause(1200);
    const eE = etat(); const fE = await capt(prof, "a-45-entree");
    J.v(tps(0) === 45, H12, "à Entrée, le temps de réponse de Q1 vaut 45", "temps/0/reponse " + tav + " → " + tps(0) + " ; " + fE);
    J.v(eE.ph === "reponse" && eE.tour === 1 && reste() > 0 && eE.duree === duav + (45 - tav), H12, "à Entrée, le tour continue, son temps suit (durée " + duav + " → " + (duav + 45 - tav) + ")", JSON.stringify({ph: eE.ph, tour: eE.tour, duree: eE.duree, reste: +(reste() || 0).toFixed(1)}));
    // quitter le champ
    await marque(SEL, "q1r"); await prof.click("[data-banc='q1r']"); await prof.keyboard.press("Control+A"); const tQ = Date.now(); await prof.keyboard.type("50", {delay: 300}); await pause(500);
    const wQ = ecrDepuis(tQ); await prof.keyboard.press("Tab"); await pause(1200);
    J.v(!wQ.length && tps(0) === 50 && etat().ph === "reponse", H12, "« 50 » tapé puis le champ quitté (Tab) : rien avant, puis le temps vaut 50, le tour continue", "avant Tab : " + wQ.join(" · ") + " · temps " + tps(0) + " · " + JSON.stringify({ph: etat().ph, tour: etat().tour}));
    // le champ vidé puis quitté
    await marque(SEL, "q1r"); await prof.click("[data-banc='q1r']"); await prof.keyboard.press("Control+A"); const tV = Date.now(); await prof.keyboard.press("Backspace"); await pause(400); await prof.keyboard.press("Tab"); await pause(1000);
    const cV = await marque(SEL, "q1r"); const fV = await capt(prof, "a-vide");
    J.v(cV && cV.v === "50" && tps(0) === 50 && !ecrDepuis(tV).length, H2, "le champ vidé puis quitté reprend sa valeur (50), rien n'est écrit", JSON.stringify({champ: cV && cV.v, temps: tps(0), ecrit: ecrDepuis(tV)}) + " ; " + fV);
    // « Toutes les questions » : le temps de réponse de Q2
    const SEL2 = "input[data-temps='reponse'][data-q='2']";
    const c2 = await marque(SEL2, "q2r");
    if(c2){ const t2av = tps(1); J.v(/Entrée/.test(c2.title), H2, "« Toutes les questions », Q2 : l'infobulle du temps dit « Entrée »", "« " + c2.title + " »");
      await prof.click("[data-banc='q2r']"); await prof.keyboard.press("Control+A"); const t2t = Date.now(); await prof.keyboard.type("30", {delay: 400}); await pause(600);
      const w2 = ecrDepuis(t2t); const st2 = await etatChamp("q2r"); await prof.keyboard.press("Enter"); await pause(1000);
      J.v(!w2.length && st2.v === "30", H2, "« Toutes les questions », Q2 : « 30 » tapé, rien n'est écrit avant Entrée, le champ garde « 30 »", w2.join(" · ") + " · champ « " + st2.v + " »");
      J.v(tps(1) === 30, H12, "« Toutes les questions », Q2 : à Entrée, le temps de réponse de Q2 vaut 30", "temps/1/reponse " + t2av + " → " + tps(1)); }
    else J.v(false, H2, "« Toutes les questions » : le champ du temps de réponse de Q2", "absent ; " + await capt(prof, "a-toutes-questions"));
    // « +5 » : tout de suite
    const dP = etat().duree; const tP = Date.now();
    const okP = await prof.evaluate(() => { const i = [...document.querySelectorAll("input[data-temps='reponse'][data-q='1']")].find(x => x.getBoundingClientRect().width > 0); let c = i; for(let k = 0; k < 5 && c && !c.querySelector("button"); k++) c = c.parentElement;
      const b = c && [...c.querySelectorAll("button")].find(b => b.textContent.trim() === "+5"); if(!b) return false; b.setAttribute("data-banc", "p5"); return true; }).catch(() => false);
    if(okP) await prof.click("[data-banc='p5']"); await pause(800);
    J.v(okP && etat().duree === dP + 5 && ecr.some(x => x.t >= tP), H12, "« +5 » du temps de réponse, pendant le tour : tout de suite, la durée gagne 5 s", "clic " + okP + " · duree " + dP + " → " + etat().duree);

    J.section("La suite de la séance, jusqu'à la lecture de la feuille du voisin");
    const fait = new Set();
    for(let qi = 0; qi < 3; qi++){
      if(qi){ await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800); await cliquer(prof, /Autoriser la réponse/); await pause(1500); }
      for(let k = 0; k < 120 && !/close/.test(etat().ph || ""); k++){
        for(const [p, c, sl] of M){ const z = await zoneTexte(p, c), cle = qi + ":" + (etat().tour || 1) + ":" + sl;
          if(/la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z)){ await cliquer(p, /Oui, la même chose/, c); continue; }
          if(!fait.has(cle) && (await O.choixOuverts(p, c, EV.questions[qi].choix)).length){ for(const x of JUSTE[qi]) await cliquer(p, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); } }
        if(etat().ph === "reponse" && k > 4) await cliquer(prof, /Tour suivant/);
        await pause(350);
      }
      if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
    }
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
    for(const [p, c] of M) await cliquer(p, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(900);
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence la correction$/, c); }
    await pause(1200); await cliquer(prof, /Commencer la correction/); await pause(1500);
    J.v(etat().ph === "lecture", BANC, "la lecture de la feuille du voisin", JSON.stringify(etat()));
    if(etat().ph !== "lecture") throw new Error("pas de lecture");
    const ql = etat().qi, Q = EV.questions[ql], juste = JUSTE[ql], autre = Q.choix.find(x => !juste.includes(x));
    for(const [p, c] of M) for(const x of juste) await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 120});
    await pause(600);

    J.section("B. Le temps pour lire la feuille du voisin, tapé pendant que les tablettes lisent");
    const SL = ".pilot-chrono-card input[data-temps='lecture']";
    const cl0 = await marque(SL, "lec");
    J.v(!!cl0 && /Entrée/.test(cl0.title), H2, "l'infobulle du temps pour lire la feuille du voisin dit « Entrée »", "« " + (cl0 ? cl0.title : "(champ absent)") + " »");
    await prof.click("[data-banc='lec']"); await prof.keyboard.press("Control+A");
    let frappe = true, figeVu = [], minL = Infinity; const l0 = nLect, tB = Date.now(), pertesL = [];
    const clics = (async () => { while(frappe){ for(const [p, c, sl] of M){ if(!frappe) break; await cliquer(p, new RegExp("^" + esc(autre) + "$"), c, {apres: 90});
      if(/Temps fini/.test(await zoneTexte(p, c)) && !figeVu.includes(sl)) figeVu.push(sl); } } })();
    let tape = "";
    for(const ch of "130"){ await prof.keyboard.type(ch); tape += ch;
      for(let k = 0; k < 6; k++){ await pause(150); const r = reste(); if(r != null) minL = Math.min(minL, r); const st = await etatChamp("lec"); if(st.v !== tape || !st.focus) pertesL.push("après « " + tape + " » : « " + st.v + " »" + (st.focus ? "" : ", curseur perdu")); } }
    const wB = ecrDepuis(tB); const fB = await capt(prof, "b-130-avant-entree");
    frappe = false; await clics;
    J.v(nLect - l0 >= 4, BANC, "pendant la frappe, les tablettes ont cliqué leur lecture", (nLect - l0) + " écritures de lectures/");
    J.v(!wB.length, H2, "pendant la frappe de « 130 », rien n'est écrit", wB.join(" · ") + " ; " + fB);
    J.v(minL > 0 && !figeVu.length, H2, "pendant la frappe de « 130 », aucune lecture n'est figée (le chrono continue comme avant)", "plus petit temps restant " + (isFinite(minL) ? minL.toFixed(1) : "?") + " s ; « Temps fini » vu : " + figeVu.join(", "));
    J.v(!pertesL.length, H2, "pendant la frappe, les tablettes cliquent (des redessins) : le champ garde la valeur et le curseur", [...new Set(pertesL)].slice(0, 3).join(" | "));
    await prof.keyboard.press("Enter"); await pause(1200);
    J.v(tps(ql) === 130, H12, "à Entrée, le temps pour lire vaut 130", "temps/" + ql + "/reponse : " + tps(ql));
    // « +10 » avant le 0
    const plus = async m => { const ok = await prof.evaluate(m => { const c = [...document.querySelectorAll(".pilot-chrono-card")].find(x => /Temps pour lire la feuille du voisin/.test(x.textContent)); const b = c && [...c.querySelectorAll("button")].find(b => b.textContent.trim() === "+" + m); if(!b) return false; document.querySelectorAll("[data-banc='plus']").forEach(x => x.removeAttribute("data-banc")); b.setAttribute("data-banc", "plus"); return true; }, m).catch(() => false);
      if(ok) await prof.click("[data-banc='plus']", {timeout: 3000}).catch(() => {}); return ok; };
    const dL = etat().duree; const okL = await plus(10); await pause(900);
    J.v(okL && etat().duree === dL + 10 && tps(ql) === 140, H12, "« +10 » avant le 0 : tout de suite, +10 s (durée " + dL + " → " + (dL + 10) + ", temps 140)", "durée " + etat().duree + " · temps " + tps(ql));
    // arriver au 0 : un temps tapé (Entrée), le 0 dans 4 s
    const d = etat(), ec = (Date.now() - d.depuis) / 1000; const v4 = String(Math.max(1, Math.ceil(tps(ql) + ec + 4 - d.duree)));
    await marque(SL, "lec"); await prof.click("[data-banc='lec']"); await prof.keyboard.press("Control+A"); await prof.keyboard.type(v4, {delay: 50}); await prof.keyboard.press("Enter");
    for(let k = 0; k < 60 && !(reste() <= -1); k++) await pause(250);
    await pause(500);
    const [pA, cA, slA] = M[0];
    const zF = await zoneTexte(pA, cA); const fF = await capt(pA, "b-fige-a0");
    J.v(/Temps fini/.test(zF), H2, "au 0, la lecture est figée (« ⏱️ Temps fini : ta lecture est enregistrée »)", "reste " + (reste() || 0).toFixed(1) + " s · " + zF.slice(0, 160) + " ; " + fF);
    const okA = await plus(10); const tA2 = Date.now(); await pause(1200);
    const rA = reste(), att = 10 - (Date.now() - tA2) / 1000, ouv = await O.choixOuverts(pA, cA, Q.choix);
    J.v(okA && rA != null && Math.abs(rA - att) <= 1.5 && ouv.length > 0, H12, "« +10 » après le 0 : la lecture repart pour 10 s, ses choix rouverts", "reste " + (rA == null ? "?" : rA.toFixed(1)) + " s (attendu ≈ " + att.toFixed(1) + ") · ouverts " + JSON.stringify(ouv) + " ; " + await capt(pA, "b-rouverte"));
    for(const p of A.pages) J.v(!p.__err.length, H2, p.__nom + " : aucune erreur de page", p.__err.slice(0, 3).join(" | "));
  } catch(e){ J.v(false, BANC, "le jeu s'est interrompu : " + e.message); try { await capt(prof, "interrompu"); } catch(x){} }
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(e){}
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "temps.txt"), "Point 28, le temps tapé, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
    console.log(out);
  }
})();
