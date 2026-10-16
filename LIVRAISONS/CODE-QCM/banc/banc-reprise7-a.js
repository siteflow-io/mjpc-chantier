// QCM-4 · BANC — la reprise 7 (DEFAUTS-OUVERTS, « Reprise 7 du 13/10, complétée le 15/10 »), points 1, 2, 3 et 5, rejoués par le geste sur le faux hub.
// Trois faux hubs, un par histoire (une classe n'a qu'une séance active) :
//   A — point 5 puis point 1 : « 🎯 Lancer une nouvelle séance » de 3 ESSAI (Évaluation d'essai) : le champ « 🕙 Fin de l'heure » avant l'appel,
//       « ✅ Ça tient » / « ⚠️ Ça ne tient pas », l'appel sans champ, l'heure qui part avec la séance ; puis Q1 lancée, une tablette ouverte où personne
//       n'entre, une où deux élèves sont entrés : les cartes de la console et « 👁 ».
//   B — point 2 : « 📝 Évaluations », « 🚀 Lancer » sur la ligne de la démo, la classe 3 ESSAI, l'appel.
//   C — point 3 : une évaluation passée en « Sans chapitre pour l'instant » dans l'éditeur, enregistrée, le message en tête de la liste, puis lancée.
//   APP_FILE=<app> BANC=<faux hub> node banc/banc-reprise7-a.js <dossier de sortie>   → <sortie>/reprise7-a.txt, <sortie>/captures-reprise7-a/
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, choisir, taper, cocherTout, etatBouton, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise7-a-" + Date.now()));
const CAPD = path.join(SORTIE, "captures-reprise7-a");
fs.mkdirSync(CAPD, {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H3 = "QCM-3 · SOIR", BANC = "QCM-4 · BANC";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAPD, f)); return f; };
// l'heure du navigateur (même fuseau que ce processus), en minutes depuis minuit, et « hh:mm »
const minNow = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const hm = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
const enMin = s => { const m = String(s || "").match(/(\d{1,2})[:h](\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
const T0 = Date.now();

// ── le champ « 🕙 Fin de l'heure » : l'input visible dont l'étiquette proche dit « Fin de l'heure » ; dans la fenêtre de l'appel ou hors d'elle ──
async function champsFin(p){
  return p.evaluate(() => {
    document.querySelectorAll("[data-fin-banc]").forEach(x => x.removeAttribute("data-fin-banc"));
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const l = [];
    [...document.querySelectorAll("input")].filter(i => vis(i) && !/checkbox|radio|hidden/.test(i.type)).forEach((i, k) => {
      let x = i, lie = false;
      for(let d = 0; d < 4 && x; d++, x = x.parentElement){ const t = x.textContent || ""; if(t.length > 600) break; if(/Fin de l.heure/i.test(t)){ lie = true; break; } }
      if(!lie && /fin de l.heure/i.test((i.title || "") + " " + (i.getAttribute("aria-label") || "") + " " + (i.placeholder || ""))) lie = true;
      if(!lie) return;
      const fen = i.closest(".checkin-overlay, .checkin-modal, .modal, .modal-back, [role=dialog]");
      const appel = !!fen && /Check-in/.test(fen.textContent || "");
      i.setAttribute("data-fin-banc", String(k));
      l.push({k, appel, valeur: i.value, type: i.type});
    });
    return l;
  }).catch(() => []);
}
async function poserFin(p, k, v){
  const sel = "[data-fin-banc='" + k + "']";
  await p.click(sel, {timeout: 2000}).catch(() => {});
  let ok = await p.fill(sel, v, {timeout: 2000}).then(() => true).catch(() => false);
  if(!ok){ await p.click(sel, {clickCount: 3, timeout: 2000}).catch(() => {}); await p.keyboard.type(v); ok = true; }
  await p.keyboard.press("Tab").catch(() => {});
  await pause(600);
  return ok;
}
const RE_TIENT = /✅ Ça tient : (\d+) min, il en reste (\d+) avant la fin de l'heure\./;
const RE_TIENT_PAS = /⚠️ Ça ne tient pas : la séance demande (\d+) min, il n'en reste que (\d+) avant la fin de l'heure \((\d+) min de trop\)\./;
const dureeVue = t => +((t.match(/Durée estimée : (\d+) min/) || [])[1] || NaN);
const ligneDuree = t => ((t.match(/Durée estimée[^\n]*\n?[^\n]*/) || [""])[0] + " " + ((t.match(/(✅|⚠️) Ça[^\n]*/) || [""])[0])).replace(/\s+/g, " ").slice(0, 300);

// ── une séance : son id, sa base ──
function seance(srv, classe){
  const a = srv.store.get("qcm/sessionActive") || {}; let id = a[classe] || a[slug(classe)];
  if(id && typeof id === "object") id = id.sessionId || id.id || id.sid;
  return {sid: id || null, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}};
}

// ── la carte d'une tablette sur la console (« 📱 Tablette n ») : son texte ; marque son « 👁 » ──
async function carteTablette(p, num){
  return p.evaluate(num => {
    document.querySelectorAll("[data-oeil-banc]").forEach(x => x.removeAttribute("data-oeil-banc"));
    const c = [...document.querySelectorAll(".tab-mini")].filter(e => e.getBoundingClientRect().width > 0)
      .find(e => { const h = e.querySelector(".tab-mini-h span"); return h && h.textContent.replace(/\s+/g, " ").trim() === "📱 Tablette " + num; });
    if(!c) return null;
    const o = c.querySelector(".tab-oeil, button[title*='Montre les deux moitiés']"); if(o) o.setAttribute("data-oeil-banc", "1");
    return {texte: c.innerText.replace(/\s+/g, " ").trim(), oeil: !!o};
  }, num).catch(() => null);
}
// la fenêtre de « 👁 » : son titre et ses deux moitiés (ou tout son texte)
async function fenetreOeil(p){
  return p.evaluate(() => {
    const v = [...document.querySelectorAll(".voir-tab")].find(e => e.getBoundingClientRect().width > 0); if(!v) return null;
    const f = v.closest(".modal, .fenetre, [role=dialog], .modal-back") || v.parentElement;
    const m = [...v.querySelectorAll(".moitie")]; const g = m.find(x => x.classList.contains("g")) || m[0], d = m.find(x => x.classList.contains("d")) || m[1];
    return {tout: v.innerText, titre: (f && f.innerText || "").slice(0, 200), g: g ? g.innerText : "", d: d ? d.innerText : ""};
  }).catch(() => null);
}
// ressemblance de deux écrans : la part des lignes de l'un (chiffres ôtés : les décomptes) qu'on retrouve dans l'autre
const lignes = t => O.norm(t || "").replace(/\d+/g, "#").split("\n").map(x => x.replace(/\s+/g, " ").trim()).filter(x => x.length > 2);
function ressemblance(vrai, vu){ const a = lignes(vrai), b = new Set(lignes(vu)); if(!a.length) return 0; return a.filter(x => b.has(x)).length / a.length; }

(async () => {
  const fin = setTimeout(() => { J.v(false, BANC, "plafond de 6 minutes atteint"); ecrire(); process.exit(0); }, 360000);
  const hubs = [];
  const nouveauHub = async extra => { const h = await O.fauxHub(extra); const A = new O.Appareils(h.srv, h.port); await A.demarrer(); hubs.push({...h, A}); return {...h, A}; };
  const entrer = (B, p, cote, nom) => O.entrer1(p, cote, nom, B.eleves.find(x => x.nomComplet === nom).code);   // reprise 7, point 13 : l'entrée d'outils.js
  const versLancement = async prof => { await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(400); };

  // ════════ A — point 5, puis point 1 ════════
  try {
    const {B, srv, A} = await nouveauHub();
    const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
    const prof = await A.ouvrir("console-A", "?mode=prof", 1536, 864);
    J.section("Point 5 — « 🕙 Fin de l'heure » sur « 🎯 Lancer une nouvelle séance », avant l'appel");
    await versLancement(prof);
    await choisir(prof, /3 ESSAI|3e Essai/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(600);
    let t = await texte(prof); let c = await capt(prof, "A-lancement");
    let ch = (await champsFin(prof)).filter(x => !x.appel);
    J.v(/Lancer une nouvelle séance/.test(t) && ch.length > 0, H2, "« 🎯 Lancer une nouvelle séance » (3 ESSAI, Évaluation d'essai) : un champ « 🕙 Fin de l'heure », avant « 🚀 Lancer la séance »", "aucun champ « Fin de l'heure » sur la carte (" + c + ") ; texte : " + ((t.match(/Lancer une nouvelle séance[\s\S]{0,400}/) || [""])[0]));
    const m0 = minNow();
    if(ch.length){ const dv = enMin(ch[0].valeur), ecart = dv === null ? null : ((dv - (m0 + 55)) % 1440 + 1440) % 1440;
      J.v(ecart !== null && (ecart <= 1 || ecart >= 1439), H2, "le champ vaut par défaut maintenant + 55 min (" + hm(m0 + 55) + ")", "il vaut « " + ch[0].valeur + " » (" + c + ")"); }
    // fin de l'heure lointaine : maintenant + 120 min
    const loin = hm(m0 + 120);
    if(ch.length){ await poserFin(prof, ch[0].k, loin); }
    t = await texte(prof); c = await capt(prof, "A-ca-tient");
    const d = dureeVue(t), mt = t.match(RE_TIENT), rAtt = ((enMin(loin) - minNow()) % 1440 + 1440) % 1440;
    J.v(!!mt && Math.abs(+mt[2] - rAtt) <= 1 && (isNaN(d) || +mt[1] === d), H3, "fin de l'heure à " + loin + " : « ✅ Ça tient : <d> min, il en reste " + rAtt + " avant la fin de l'heure. » (d = la durée estimée)", "« " + ligneDuree(t) + " » (" + c + ")");
    // fin de l'heure trop proche : maintenant + 5 min
    const proche = hm(minNow() + 5);
    ch = (await champsFin(prof)).filter(x => !x.appel);
    if(ch.length){ await poserFin(prof, ch[0].k, proche); }
    t = await texte(prof); c = await capt(prof, "A-ca-ne-tient-pas");
    const mp = t.match(RE_TIENT_PAS), rP = ((enMin(proche) - minNow()) % 1440 + 1440) % 1440;
    J.v(!!mp && Math.abs(+mp[2] - rP) <= 1 && +mp[3] === +mp[1] - +mp[2] && (isNaN(d) || +mp[1] === d), H3, "fin de l'heure à " + proche + " : « ⚠️ Ça ne tient pas : la séance demande <d> min, il n'en reste que " + rP + " avant la fin de l'heure (<d − r> min de trop). »", "« " + ligneDuree(t) + " » (" + c + ")");
    J.v(await etatBouton(prof, /Lancer la séance/) === "ouvert", H3, "avec « ça ne tient pas », « 🚀 Lancer la séance » reste ouvert", await etatBouton(prof, /Lancer la séance/) + " (" + c + ")");
    // la démo : le champ et le message aussi
    await choisir(prof, /Démo — apprendre/); await pause(600);
    t = await texte(prof); c = await capt(prof, "A-demo");
    J.v((await champsFin(prof)).some(x => !x.appel) && /Lancer la démo/.test(t), H2, "la démo choisie : le champ « 🕙 Fin de l'heure » est là aussi, avant « 🎓 Lancer la démo »", "(" + c + ")");
    J.v(RE_TIENT.test(t) || RE_TIENT_PAS.test(t), H3, "la démo choisie : le message « Ça tient » / « Ça ne tient pas » s'affiche aussi", "« " + ligneDuree(t) + " » (" + c + ")");
    await choisir(prof, /Évaluation d'essai/); await pause(600);
    // l'heure qui part avec la séance : maintenant + 50 min
    const X = hm(minNow() + 50);
    ch = (await champsFin(prof)).filter(x => !x.appel);
    if(ch.length) await poserFin(prof, ch[0].k, X);
    J.v(await cliquer(prof, /^🚀 Lancer la séance$/), H2, "« 🚀 Lancer la séance » de la carte"); await pause(1200);
    t = await texte(prof); c = await capt(prof, "A-appel");
    J.v(/Check-in/.test(t), H2, "l'appel s'ouvre (« 📋 Check-in »)", "(" + c + ")");
    const chA = (await champsFin(prof)).filter(x => x.appel);
    const txtAppel = await prof.evaluate(() => { const f = [...document.querySelectorAll(".checkin-modal, .checkin-overlay, .modal")].find(e => e.getBoundingClientRect().width > 0 && /Check-in/.test(e.textContent)); return f ? f.innerText : ""; }).catch(() => "");
    J.v(chA.length === 0, H2, "plus de champ de fin de l'heure dans la fenêtre « 📋 Check-in »", "un champ « Fin de l'heure » y est encore (valeur « " + (chA[0] || {}).valeur + " ») ; " + ((O.norm(txtAppel).match(/🕙[^\n]*/) || [""])[0]) + " (" + c + ")");
    await cliquer(prof, /^🚀 Lancer la séance$/); await pause(1500);
    let S = seance(srv, "3 ESSAI");
    J.v(!!S.sid && (S.s.lancee || {}).fin === X, H1, "l'heure tapée part avec la séance : lancee.fin = « " + X + " » dans la base", "lancee.fin = " + JSON.stringify((S.s.lancee || {}).fin) + " (séance " + S.sid + ")");
    t = await texte(prof); c = await capt(prof, "A-console");
    J.v(new RegExp("🕙 Fin de l'heure : " + esc(X)).test(t), H2, "la console de la séance : « 🕙 Fin de l'heure : " + X + " »", "vu : « " + ((t.match(/🕙[^\n]*/) || ["(rien)"])[0]) + " » (" + c + ")");

    J.section("Point 1 — Q1 lancée : une tablette où personne n'entre, une où deux élèves sont entrés ; les cartes et « 👁 »");
    S = seance(srv, "3 ESSAI");
    const pl = S.s.places || {};
    const P = Object.keys(pl).filter(k => pl[k] && pl[k].g && pl[k].d).sort((a, b) => +a - +b);
    if(P.length < 2) throw new Error("pas deux tablettes de deux élèves dans les places : " + JSON.stringify(pl).slice(0, 200));
    const nV = P[0], nE = P[1];                 // nV : personne n'y entre ; nE : ses deux élèves entrent
    const tV = await A.tablette("tablette-vide", "3 ESSAI"), tE = await A.tablette("tablette-entree", "3 ESSAI");
    await cliquer(tE, /2 élèves/); await entrer(B, tE, "g", nomDe(pl[nE].g)); await entrer(B, tE, "d", nomDe(pl[nE].d));
    for(const cote of ["g", "d"]){ await cocherTout(tE, cote); await cliquer(tE, /^Je commence$/, cote); }
    await pause(800);
    J.v(await cliquer(prof, /Lancer Q1\b/), H2, "« ▶️ Lancer Q1 »"); await pause(2500);
    const tVt = await texte(tV); c = await capt(tV, "A-tablette-vide-q1");
    RAPPORT_INFO("la vraie tablette où personne n'entre, Q1 lancée : " + tVt.replace(/\n/g, " ⏎ ").slice(0, 200));
    J.v(/Combien êtes-vous|Identifie-toi/.test(tVt) && !/QUESTION 1/i.test(tVt), H2, "la vraie tablette où personne n'entre reste sur « Combien êtes-vous sur cette tablette ? » (Q1 lancée)", tVt.slice(0, 200) + " (" + c + ")");
    const ctV = await carteTablette(prof, nV); c = await capt(prof, "A-console-cartes-q1");
    const ppV = [pl[nV].g, pl[nV].d].map(nomDe).map(x => x.split(" ").slice(1).join(" "));
    J.v(!!ctV && !/✍️ ?écrit/.test(ctV.texte) && /pas encore entr|pas entr|n'est pas (encore )?entr|ne sont pas (encore )?entr/i.test(ctV.texte), H2, "la carte « 📱 Tablette " + nV + " » (" + ppV.join(", ") + ", pas entrés) dit qu'ils ne sont pas encore entrés, pas « ✍️ écrit »", (ctV ? "carte : « " + ctV.texte.slice(0, 250) + " »" : "carte introuvable") + " (" + c + ")");
    // « 👁 » sur la tablette où personne n'entre
    let oV = null;
    if(ctV && ctV.oeil){ await prof.click("[data-oeil-banc='1']", {timeout: 3000}).catch(() => {}); await pause(1500); oV = await fenetreOeil(prof); }
    c = await capt(prof, "A-oeil-tablette-vide");
    J.v(!!oV, H2, "« 👁 » de la tablette " + nV + " s'ouvre", (ctV && ctV.oeil ? "pas de fenêtre « .voir-tab »" : "pas de « 👁 » sur la carte") + " (" + c + ")");
    if(oV) J.v(/Combien êtes-vous|Identifie-toi/.test(oV.tout) && !/QUESTION 1/i.test(oV.tout), H2, "« 👁 » de la tablette " + nV + " montre son écran d'entrée (« Combien êtes-vous… »), pas la question", "« 👁 » montre : « " + O.norm(oV.tout).replace(/\n/g, " ⏎ ").slice(0, 250) + " » (" + c + ")");
    await cliquer(prof, /✕ Fermer|^Fermer$/); await prof.keyboard.press("Escape").catch(() => {}); await pause(500);
    // « 👁 » sur la tablette où deux élèves sont entrés : ce que montre la vraie tablette
    const ctE = await carteTablette(prof, nE);
    let oE = null;
    if(ctE && ctE.oeil){ await prof.click("[data-oeil-banc='1']", {timeout: 3000}).catch(() => {}); await pause(1200); oE = await fenetreOeil(prof); }
    const vg = await zoneTexte(tE, "g"), vd = await zoneTexte(tE, "d");
    const cO = await capt(prof, "A-oeil-tablette-entree"), cT = await capt(tE, "A-tablette-entree-q1");
    if(!oE) J.v(false, H2, "« 👁 » de la tablette " + nE + " s'ouvre", "(" + cO + ")");
    else {
      const sG = ressemblance(vg, oE.g || oE.tout), sD = ressemblance(vd, oE.d || oE.tout);
      const ppE = [pl[nE].g, pl[nE].d].map(nomDe).map(x => x.split(" ").slice(1).join(" "));
      const memePhase = (/QUESTION 1/i.test(vg + vd)) === (/QUESTION 1/i.test(oE.tout)) && !/Combien êtes-vous|Identifie-toi/.test(oE.tout);
      J.v(memePhase && sG >= 0.6 && sD >= 0.6 && ppE.every(x => oE.tout.toLowerCase().includes(x.toLowerCase())), H2, "« 👁 » de la tablette " + nE + " (" + ppE.join(", ") + ", entrés) montre ce que montre la vraie tablette, moitié par moitié",
        "lignes retrouvées : gauche " + Math.round(sG * 100) + " %, droite " + Math.round(sD * 100) + " % ; vraie tablette (g) : « " + O.norm(vg).replace(/\n/g, " ⏎ ").slice(0, 120) + " » ; « 👁 » (g) : « " + O.norm(oE.g || oE.tout).replace(/\n/g, " ⏎ ").slice(0, 120) + " » (" + cO + ", " + cT + ")");
    }
    if(oE){ const b = new Set(lignes(oE.g + "\n" + oE.d)), manque = lignes(vg + "\n" + vd).filter(x => !b.has(x)); if(manque.length) RAPPORT_INFO("lignes de la vraie tablette " + nE + " absentes de « 👁 » : " + [...new Set(manque)].join(" · ").slice(0, 200)); }
    await cliquer(prof, /✕ Fermer|^Fermer$/);
    const errA = [].concat(...A.pages.map(p => p.__err.map(e => p.__nom + " : " + e)));
    J.v(errA.length === 0, H2, "aucune erreur de page ni boîte système (A)", errA.join(" | "));
  } catch(e){ J.v(false, BANC, "A (points 5 et 1) s'est interrompu : " + e.message); }

  // ════════ B — point 2 ════════
  try {
    const {B, srv, A} = await nouveauHub(B => O.ajouterClasse(B, "4 BANC", "4e", ["ALBERT Noé", "BRUN Lina", "COSTE Maël", "DIAZ Inès"], 4101));
    const prof = await A.ouvrir("console-B", "?mode=prof", 1536, 864);
    J.section("Point 2 — « 🚀 Lancer » sur la ligne de la démo, dans « 📝 Évaluations »");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /^📝 Évaluations$/); await pause(600);
    const bt = await prof.evaluate(() => {
      document.querySelectorAll("[data-banc]").forEach(x => x.removeAttribute("data-banc"));
      const rows = [...document.querySelectorAll("[data-eval='demo'], .eval-row")].filter(r => r.getBoundingClientRect().width > 0 && (r.getAttribute("data-eval") === "demo" || /Démo — apprendre/.test(r.textContent)));
      const r = rows[0]; if(!r) return {ligne: false};
      const b = [...r.querySelectorAll("button")].find(x => /🚀 ?Lancer/.test(x.textContent) && x.getBoundingClientRect().width > 0);
      if(b) b.setAttribute("data-banc", "1");
      return {ligne: true, bouton: !!b, ouvert: b ? !b.disabled : false, titre: b ? b.title || b.getAttribute("data-tip") || "" : "", boutons: [...r.querySelectorAll("button")].map(x => x.textContent.trim())};
    }).catch(() => ({}));
    let c = await capt(prof, "B-evaluations");
    J.v(bt.bouton && bt.ouvert, H3, "la ligne de la démo a un bouton « 🚀 Lancer », ouvert", (bt.ligne ? "boutons de la ligne : " + (bt.boutons || []).join(" · ") : "ligne de la démo introuvable") + " (" + c + ")");
    let bulle = bt.titre || "";
    if(bt.bouton){ await prof.hover("[data-banc='1']").catch(() => {}); await pause(700);
      const vue = await prof.evaluate(() => { const b = [...document.querySelectorAll(".bulle, .info-bulle, .tip, [role=tooltip], .bulle-h, .infobulle")].filter(e => e.getBoundingClientRect().width > 0); return b.map(x => x.innerText).join(" | "); }).catch(() => "");
      if(!bulle) bulle = vue; c = await capt(prof, "B-infobulle"); }
    J.v(bulle.length > 15 && /lanc|classe|appel/i.test(bulle), H3, "« 🚀 Lancer » de la démo a une infobulle qui dit ce que le geste fait", "infobulle : « " + bulle + " » (" + c + ")");
    if(bt.bouton){ await prof.click("[data-banc='1']", {timeout: 3000}).catch(() => {}); await pause(1000); }
    let t = await texte(prof); c = await capt(prof, "B-lancement-demo");
    const evChoisie = await prof.evaluate(() => { for(const s of document.querySelectorAll("select")){ const o = s.options[s.selectedIndex]; if(o && /Démo|Évaluation d'essai|^\S/.test(o.textContent) && [...s.options].some(x => /Démo — apprendre/.test(x.textContent))) return o.textContent; } return null; }).catch(() => null);
    J.v(/Lancer une nouvelle séance/.test(t) && /Démo — apprendre/.test(evChoisie || ""), H3, "il mène à « 🎯 Lancer une nouvelle séance », la démo déjà choisie", "évaluation choisie : « " + evChoisie + " » (" + c + ")");
    J.v(await choisir(prof, /^\s*3e Essai( \(\d+ élèves?\))?\s*$/), H3, "la classe 3 ESSAI se choisit, écrite « 3e Essai »"); await pause(500);
    const cl = await prof.evaluate(() => { for(const s of document.querySelectorAll("select")){ const o = s.options[s.selectedIndex]; if(o && /ESSAI|BANC/i.test(o.textContent)) return o.textContent; } return null; }).catch(() => null);
    J.v(/^\s*3e Essai( \(\d+ élèves?\))?\s*$/.test(cl || "") && /Démo — apprendre/.test((await prof.evaluate(() => [...document.querySelectorAll("select")].map(s => (s.options[s.selectedIndex] || {}).textContent).join(" | ")).catch(() => ""))), H3, "après le choix de la classe, la démo reste choisie", "classe : « " + cl + " »");
    J.v(await cliquer(prof, /^🎓 Lancer la démo$|^🚀 Lancer la séance$/), H3, "« 🎓 Lancer la démo »"); await pause(1500);
    t = await texte(prof); c = await capt(prof, "B-appel");
    const S = seance(srv, "3 ESSAI");
    J.v(/Check-in/.test(t), H3, "on arrive à l'appel (« 📋 Check-in : qui est absent aujourd'hui ? »), de 3 ESSAI", (t.match(/Check-in[^\n]*\n?[^\n]*/) || [t.slice(0, 200)])[0] + " (" + c + ")");
    J.v(!!S.sid && S.s.evalId === "demo", H3, "la séance lancée est celle de 3 ESSAI, avec la démo (evalId « demo »)", JSON.stringify({sid: S.sid, evalId: S.s.evalId, actives: srv.store.get("qcm/sessionActive")}).slice(0, 250));
    const errB = [].concat(...A.pages.map(p => p.__err.map(e => p.__nom + " : " + e)));
    J.v(errB.length === 0, H3, "aucune erreur de page ni boîte système (B)", errB.join(" | "));
  } catch(e){ J.v(false, BANC, "B (point 2) s'est interrompu : " + e.message); }

  // ════════ C — point 3 ════════
  try {
    const ID = "essai_sans_chap", TITRE = "Essai à rattacher (banc)";
    const {B, srv, A} = await nouveauHub(B => { B.tree.qcm.evaluations[ID] = Object.assign(JSON.parse(JSON.stringify(EV)), {titre: TITRE, createdAt: Date.now()}); });
    const prof = await A.ouvrir("console-C", "?mode=prof", 1536, 864);
    J.section("Point 3 — « Sans chapitre pour l'instant » : l'éditeur, la base, la liste, le lancement");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /^📝 Évaluations$/); await pause(600);
    const ed = await prof.evaluate(([id, titre]) => {
      document.querySelectorAll("[data-banc]").forEach(x => x.removeAttribute("data-banc"));
      const r = [...document.querySelectorAll("[data-eval='" + id + "'], .eval-row")].find(r => r.getBoundingClientRect().width > 0 && (r.getAttribute("data-eval") === id || (r.textContent || "").includes(titre)));
      if(!r) return false; const b = [...r.querySelectorAll("button")].find(x => /✏️ (Modifier|Compléter)/.test(x.textContent)); if(!b) return false; b.setAttribute("data-banc", "1"); return true;
    }, [ID, TITRE]).catch(() => false);
    if(ed){ await prof.click("[data-banc='1']", {timeout: 3000}).catch(() => {}); await pause(900); }
    let c = await capt(prof, "C-editeur");
    J.v(ed && /Modifier l'évaluation|Compléter l'évaluation/.test(await texte(prof)), H3, "« ✏️ Modifier » ouvre l'éditeur de « " + TITRE + " »", "(" + c + ")");
    const opts = await prof.evaluate(() => { for(const s of document.querySelectorAll("select")) if([...s.options].some(o => /à choisir/i.test(o.textContent)) && s.getBoundingClientRect().width > 0) return [...s.options].map(o => o.textContent.trim()); return []; }).catch(() => []);
    const iSans = opts.findIndex(o => /^Sans chapitre pour l'instant$/i.test(o.replace(/^[^\wÀ-ÿ]+/, "").trim()) || /Sans chapitre pour l'instant/i.test(o));
    J.v(iSans >= 0 && !/à choisir/.test(opts[iSans]), H3, "le choix du chapitre propose « Sans chapitre pour l'instant », distinct de « — à choisir — »", "options : " + opts.slice(0, 6).join(" · ") + (opts.length > 6 ? " … (" + opts.length + ")" : "") + " (" + c + ")");
    if(iSans >= 0){
      await prof.evaluate(() => { document.querySelectorAll("[data-sel-banc]").forEach(x => x.removeAttribute("data-sel-banc")); for(const s of document.querySelectorAll("select")) if([...s.options].some(o => /Sans chapitre pour l'instant/i.test(o.textContent))){ s.setAttribute("data-sel-banc", "1"); return; } });
      const val = await prof.evaluate(() => { const s = document.querySelector("[data-sel-banc='1']"); return [...s.options].find(o => /Sans chapitre pour l'instant/i.test(o.textContent)).value; });
      await prof.selectOption("[data-sel-banc='1']", val).catch(() => choisir(prof, /Sans chapitre pour l'instant/)); await pause(700);
      const te = await texte(prof); c = await capt(prof, "C-sans-chapitre-choisi");
      J.v(await etatBouton(prof, /💾 Enregistrer l'évaluation/) === "ouvert" && !/reste à compléter[^\n]*chapitre/i.test(te), H3, "avec « Sans chapitre pour l'instant », le chapitre ne manque plus : « 💾 Enregistrer l'évaluation » est ouvert", (te.match(/reste à compléter[^\n]*/) || ["« 💾 » " + await etatBouton(prof, /💾 Enregistrer l'évaluation/)])[0] + " (" + c + ")");
      await cliquer(prof, /^💾 Enregistrer l'évaluation$/); await pause(1200);
    }
    const eb = srv.store.get("qcm/evaluations/" + ID) || {};
    J.v(eb.sansChapitre === true && (eb.chapitre === null || eb.chapitre === undefined), H3 + ", " + H1, "enregistrée, la base porte sansChapitre: true et chapitre: null", JSON.stringify({sansChapitre: eb.sansChapitre, chapitre: eb.chapitre}));
    await pause(500);
    let t = await texte(prof); c = await capt(prof, "C-liste");
    if(!/📝 Évaluations/.test(t)){ await cliquer(prof, /^📝 Évaluations$/); await pause(600); t = await texte(prof); c = await capt(prof, "C-liste"); }
    const RE_MSG = /⚠️ ?1 évaluation(\(s\))? sans chapitre pour l'instant : pense à (les|la) rattacher plus tard\./;
    const iMsg = t.search(RE_MSG), iDemo = t.search(/Démo — apprendre/), iLigne = t.indexOf(TITRE);
    J.v(iMsg >= 0 && (iDemo < 0 || iMsg < iDemo) && (iLigne < 0 || iMsg < iLigne), H3, "en tête de « 📝 Évaluations » : « ⚠️ 1 évaluation(s) sans chapitre pour l'instant : pense à les rattacher plus tard. »", (iMsg >= 0 ? "message vu, mais pas en tête (avant la démo et les lignes)" : "vu : « " + ((t.match(/[^\n]*sans chapitre[^\n]*/i) || ["(rien sur « sans chapitre »)"])[0]) + " »") + " (" + c + ")");
    const ligne = await prof.evaluate(([id, titre]) => { const r = [...document.querySelectorAll("[data-eval='" + id + "'], .eval-row")].find(r => r.getBoundingClientRect().width > 0 && (r.getAttribute("data-eval") === id || (r.textContent || "").includes(titre))); return r ? r.innerText : null; }, [ID, TITRE]).catch(() => null);
    J.v(!!ligne && /sans chapitre pour l'instant/i.test(ligne), H3, "la ligne de « " + TITRE + " » porte la mention « sans chapitre pour l'instant »", (ligne ? "ligne : « " + O.norm(ligne).replace(/\n/g, " ⏎ ").slice(0, 250) + " »" : "ligne introuvable") + " (" + c + ")");
    // le lancement
    await versLancement(prof);
    await choisir(prof, /^(3 ESSAI|3e Essai)/); await pause(200);
    const propose = await choisir(prof, new RegExp(esc(TITRE))); await pause(600);
    t = await texte(prof); c = await capt(prof, "C-lancement");
    J.v(propose, H1 + ", " + H3, "« 🎯 Lancer une nouvelle séance » propose « " + TITRE + " » (sans chapitre pour l'instant)", "options : " + (await prof.evaluate(() => [...document.querySelectorAll("select")].map(s => [...s.options].map(o => o.textContent).join(" · ")).join(" | ")).catch(() => "")).slice(0, 250) + " (" + c + ")");
    J.v(await etatBouton(prof, /^🚀 Lancer la séance$/) === "ouvert", H1, "« 🚀 Lancer la séance » ouvert pour l'évaluation sans chapitre", await etatBouton(prof, /Lancer la séance/) + " (" + c + ")");
    await cliquer(prof, /^🚀 Lancer la séance$/); await pause(1500);
    t = await texte(prof); c = await capt(prof, "C-appel");
    J.v(/Check-in/.test(t), H1, "l'évaluation sans chapitre se lance jusqu'à l'appel (« 📋 Check-in »)", "(" + c + ")");
    let S = seance(srv, "3 ESSAI");
    J.v(!!S.sid && S.s.evalId === ID, H1, "la séance active dans la base est celle de « " + TITRE + " »", JSON.stringify({sid: S.sid, evalId: S.s.evalId}));
    await cliquer(prof, /^🚀 Lancer la séance$/); await pause(1500);
    S = seance(srv, "3 ESSAI"); c = await capt(prof, "C-seance");
    const ph = (S.s.deroule || {}).ph;
    J.v(!!S.sid && ph && ph !== "appel", H1, "après l'appel, la séance active passe à l'entrée (deroule.ph ≠ appel)", "deroule.ph = " + ph + " (" + c + ")");
    const errC = [].concat(...A.pages.map(p => p.__err.map(e => p.__nom + " : " + e)));
    J.v(errC.length === 0, H3, "aucune erreur de page ni boîte système (C)", errC.join(" | "));
  } catch(e){ J.v(false, BANC, "C (point 3) s'est interrompu : " + e.message); }

  clearTimeout(fin);
  for(const h of hubs){ try { await h.A.fermer(); } catch(e){} try { await h.srv.close(); } catch(e){} }
  ecrire(); process.exit(0);
})();

const INFOS = [];
function RAPPORT_INFO(x){ INFOS.push(x); J.l.push({info: x}); console.log("  info   " + x); }
function ecrire(){
  const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.info ? "  info   " + x.info : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  fs.writeFileSync(path.join(SORTIE, "reprise7-a.txt"), "Reprise 7, points 1, 2, 3 et 5, par le geste (QCM-4 · BANC) — " + (process.env.APP_FILE || "?") + " — durée " + Math.round((Date.now() - T0) / 1000) + " s\n" + out + "\n");
  console.log(out);
}
