// QCM-4 · BANC — le micro 8.0.3 de la conscience (16/10), la carte du temps de la lecture, par le geste (DEFAUTS-OUVERTS, « Contrôle à froid
// des micros de la conscience — 16/10/2026 » ; Paul, 11:02 : « je n'ai pas la main sur le chrono de correction. Il le faut, je dois avoir les
// options rapides +5 +10 etc. ») :
//  1. à la lecture de la feuille du voisin, sur la console : la carte « 📄 Temps pour lire la feuille du voisin », son champ, « +5 », « +10 »,
//     « +30 », chacun avec une infobulle qui dit ce que fait le geste ;
//  2. « +5 », « +10 », « +30 » pendant la lecture : deroule/duree et temps/<qi>/reponse augmentent d'autant, le chrono de la tablette aussi ;
//  3. un temps tapé dans le champ, caractère par caractère, pendant que deux tablettes cliquent leur lecture (la console se redessine) :
//     la saisie n'est pas effacée pendant la frappe ; validée (Tab : le curseur quitte le champ), le temps vaut la valeur tapée ;
//  4. la lecture figée à 0 (point 11 de la reprise 7 : « ⏱️ Temps fini : ta lecture est enregistrée », un clic ne change plus la base),
//     puis « +10 » (l'infobulle : « Une lecture déjà figée à 0 se rouvre pour ces secondes. ») : la lecture se rouvre, un clic la change ;
//     de même, « +10 » donné 15 s après le 0 ;
//  5. aucune erreur de page.
//   APP_FILE=<app> BANC=<faux hub> node banc/banc-micros-16-10-c.js <sortie>   → <sortie>/micros-c.txt, <sortie>/captures-micros-c/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, texte, zoneTexte, cliquer, choisir, taper, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "micros-c-" + Date.now()));
const CAP = path.join(SORTIE, "captures-micros-c"); fs.mkdirSync(CAP, {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H12 = H2 + " (c3-corr.js, c3-pilot.js), " + H1 + " (ACT.ajouterTemps)", BANC = "QCM-4 · BANC";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const t0 = Date.now();
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return f; };
const hubs = [];
let ecrit = false;
function ecrire(fin){
  if(ecrit) return; ecrit = true;
  const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + (fin ? " · " + fin : "") + "\n" + J.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(e){}
  fs.writeFileSync(path.join(SORTIE, "micros-c.txt"), "Micro 8.0.3, la carte du temps de la lecture, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
  console.log(out);
}
setTimeout(async () => { J.v(false, BANC, "plafond de 6 minutes atteint : le banc s'arrête là", J.partie); ecrire("arrêté au plafond de 6 minutes");
  try { for(const h of hubs) await h.A.fermer(); } catch(e){} process.exit(0); }, 6 * 60 * 1000).unref();
const note = s => { J.l.push({note: s}); console.log("  note   " + s); };
const sidDe = (srv, cl) => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a[cl] || a[slug(cl)]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; return id || null; };
// la racine d'une moitié (la même règle que outils.js)
const RZ = `function(zone){ var cote = zone === "g" ? "g" : "d"; var m = document.querySelector(".moitie." + cote); if(m) return m;
  var W = innerWidth, all = [].slice.call(document.querySelectorAll("body *")).filter(function(e){ var r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
  var mm = all.filter(function(e){ return !all.some(function(o){ return o !== e && o.contains(e); }); }).sort(function(a, b){ return a.getBoundingClientRect().x - b.getBoundingClientRect().x; });
  return mm[cote === "g" ? 0 : 1] || null; }`;
const choisis = (p, c) => p.evaluate(([f, c]) => { const r = eval("(" + f + ")")(c); if(!r) return null; return [...r.querySelectorAll(".eleve-choix-btn.selected")].map(b => b.textContent.trim()); }, [RZ, c]).catch(() => null);

async function lancer(prof, srv, cl, absents){
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(300);
  await prof.evaluate(cl => { for(const s of document.querySelectorAll("select")){ const o = [...s.options].find(x => x.value === cl); if(o){ s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); return true; } } return false; }, cl); await pause(200);
  await choisir(prof, /Évaluation d'essai/); await pause(400);
  await cliquer(prof, /Lancer la séance/); await pause(500);
  for(const a of absents || []) await cliquer(prof, new RegExp(esc(a)));
  await cliquer(prof, /Lancer la séance/); await pause(1200);
  return sidDe(srv, cl);
}
async function ident(p, nom, code, z){
  const [N, ...P] = nom.split(" ");
  if(!(await taper(p, z, "code", code))){ if(z === null) return false; z = null; if(!(await taper(p, null, "code", code))) return false; }
  await taper(p, z, "prenom", P.join(" ").toLowerCase()); await taper(p, z, "nom", N.toLowerCase());
  if(!(await cliquer(p, /Entrer/, z))) await cliquer(p, /Entrer/);
  await pause(700); return true;
}
async function entrerPaire(p, g, d, codeDe){
  await O.attendre(p, /Combien êtes-vous|Identifie-toi|Tu es bien/, 20000);
  const t = await texte(p);
  if(/Combien êtes-vous/.test(t)){ await cliquer(p, /2 élèves/); await pause(300); await ident(p, g, codeDe(g), "g"); await ident(p, d, codeDe(d), "d"); return; }
  if(/Tu es bien/.test(t)){ await cliquer(p, /^Non$/); await pause(400); }
  await ident(p, g, codeDe(g), null);
  for(let k = 0; k < 12 && !/tape ton code/.test(await zoneTexte(p, "d")); k++) await pause(250);
  await taper(p, "d", "code", codeDe(d)); if(!(await cliquer(p, /Entrer/, "d"))) await cliquer(p, /^✓$/, "d"); await pause(700);
}

(async () => {
  try {
    J.section("La séance de 3 ESSAI, deux tablettes, quatre élèves, jusqu'à la lecture de la première question corrigée");
    const h = await O.fauxHub(); const A = new O.Appareils(h.srv, h.port); await A.demarrer(); hubs.push({A});
    const {B, srv} = h;
    const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
    const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
    const pre = sl => (nomDe(sl) || sl).split(" ").slice(1).join(" ");
    let dernier = null; const sid = () => { const x = sidDe(srv, "3 ESSAI"); if(x) dernier = x; return x || dernier; };
    const S = () => { const id = sid(); return id ? srv.store.get("qcm/sessions/" + id) || {} : {}; };
    const etat = () => { const d = S().deroule; return d && typeof d === "object" ? d : {}; };
    // les écritures de lectures/ (les clics des tablettes), comptées depuis le faux hub
    let nLect = 0; srv.watchers.push(op => { const ch = op.t === "update" ? Object.keys(op.v || {}).map(k => op.p + "/" + k) : [op.p]; if(ch.some(c => /\/lectures(\/|$)/.test(c))) nLect++; });
    const prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await lancer(prof, srv, "3 ESSAI", ["YVON Adam"]);
    const pl = S().places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d})).filter(x => x.g && x.d);
    if(T.length < 2) throw new Error("pas de séance ou pas de places : " + JSON.stringify(srv.store.get("qcm/sessionActive")) + " " + JSON.stringify(pl).slice(0, 200));
    const [tA, tB] = T;
    const t1 = await A.ouvrir("tablette-1", "?mode=eleve", 1280, 800), t2 = await A.ouvrir("tablette-2", "?mode=eleve", 1280, 800);
    await entrerPaire(t1, nomDe(tA.g), nomDe(tA.d), codeDe); await entrerPaire(t2, nomDe(tB.g), nomDe(tB.d), codeDe);
    const M = [[t1, "g", tA.g], [t1, "d", tA.d], [t2, "g", tB.g], [t2, "d", tB.d]];
    note("tablette 1 : " + pre(tA.g) + " | " + pre(tA.d) + " ; tablette 2 : " + pre(tB.g) + " | " + pre(tB.d) + " ; entrés : " + Object.keys(S().entres || {}).length);
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);
    const JUSTE = [["Rome"], ["Madrid", "Berlin"], ["8"]];
    for(let qi = 0; qi < 3; qi++){
      await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800);
      await cliquer(prof, /Autoriser la réponse/); await pause(1500);
      const fait = new Set();
      for(let k = 0; k < 90 && !/close/.test(etat().ph || ""); k++){
        for(const [p, c, sl] of M){
          const z = await zoneTexte(p, c), cle = qi + ":" + (etat().tour || 1) + ":" + sl;
          const bq = /la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z);
          if(!fait.has(cle) && !bq && (await O.choixOuverts(p, c, EV.questions[qi].choix)).length){ for(const x of JUSTE[qi]) await cliquer(p, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); }
          if(bq) await cliquer(p, /Oui, la même chose/, c);
        }
        if(etat().ph === "reponse" && k > 6) await cliquer(prof, /Tour suivant/);
        await pause(400);
      }
      if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
    }
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
    for(const [p, c] of M) await cliquer(p, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(900);
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence la correction$/, c); }
    await pause(1200);
    await cliquer(prof, /Commencer la correction/); await pause(1200);
    J.v(etat().ph === "lecture", H1, "la correction commence au clic de Paul (deroule.ph = lecture)", JSON.stringify(etat()));
    if(etat().ph !== "lecture") throw new Error("pas de lecture : " + JSON.stringify(etat()));
    const qi = etat().qi, Q = EV.questions[qi], juste = JUSTE[qi], autre = Q.choix.find(x => !juste.includes(x));
    note("lecture de Q" + (qi + 1) + " : " + JSON.stringify({duree: etat().duree, temps: (S().temps || {})[qi]}) + " ; « " + autre + " » sert de clic d'essai");
    // chaque lecteur clique ce que dit la feuille (juste)
    for(const [p, c] of M) for(const x of juste) await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 120});
    await pause(600);

    // ── outils de la console ──
    const carte = () => prof.evaluate(() => {
      const c = [...document.querySelectorAll(".pilot-chrono-card")].find(x => /Temps pour lire la feuille du voisin/.test(x.textContent) && x.getBoundingClientRect().width > 0);
      if(!c) return null; const i = c.querySelector("input");
      return {v: (c.querySelector(".v") || {}).textContent, champ: i ? {value: i.value, title: i.title, aria: i.getAttribute("aria-label"), temps: i.getAttribute("data-temps"), disabled: i.disabled} : null,
        boutons: [...c.querySelectorAll("button")].map(b => ({t: b.textContent.trim(), title: b.title, disabled: b.disabled}))}; }).catch(() => null);
    const plus = async m => { const ok = await prof.evaluate(m => { const c = [...document.querySelectorAll(".pilot-chrono-card")].find(x => /Temps pour lire la feuille du voisin/.test(x.textContent));
      const b = c && [...c.querySelectorAll("button")].find(b => b.textContent.trim() === "+" + m); if(!b) return false; document.querySelectorAll("[data-banc]").forEach(x => x.removeAttribute("data-banc")); b.setAttribute("data-banc", "plus"); return true; }, m).catch(() => false);
      if(ok) await prof.click("[data-banc='plus']", {timeout: 3000}).catch(() => {}); return ok; };
    const champSel = ".pilot-chrono-card input[data-temps='lecture']";
    const chronoTab = async (p, c) => { const m = (await zoneTexte(p, c)).match(/Temps pour lire la feuille du voisin\s*(-?\d+)/i); return m ? +m[1] : null; };
    const resteBase = () => { const d = etat(); return d.duree ? d.duree - (Date.now() - (d.depuis || 0)) / 1000 : null; };
    const tempsBase = () => ((S().temps || {})[qi] || {}).reponse;
    const lect = sl => JSON.stringify(((S().lectures || {})[qi] || {})[sl]);

    J.section("1 — la carte « 📄 Temps pour lire la feuille du voisin » sur la console, son champ, « +5 », « +10 », « +30 », leurs infobulles");
    const k0 = await carte(); const f1 = await capt(prof, "1-carte-lecture");
    J.v(!!k0, H2, "à la lecture, la console montre la carte « 📄 Temps pour lire la feuille du voisin »", "(" + f1 + ") " + (await texte(prof)).slice(0, 300));
    J.v(!!(k0 && k0.champ && !k0.champ.disabled), H2, "la carte a son champ du temps, ouvert", "(" + f1 + ") " + JSON.stringify(k0 && k0.champ));
    J.v(!!(k0 && k0.champ && /Tape le temps pour lire la feuille du voisin/.test(k0.champ.title) && /chrono/.test(k0.champ.title)), H2, "l'infobulle du champ dit ce que fait le geste (« Tape le temps pour lire la feuille du voisin … chrono de la lecture »)", "(" + f1 + ") title : « " + (k0 && k0.champ ? k0.champ.title : "") + " »");
    for(const m of [5, 10, 30]){
      const b = k0 && k0.boutons.find(x => x.t === "+" + m);
      J.v(!!b && !b.disabled, H2, "la carte a « +" + m + " », ouvert", "(" + f1 + ") boutons : " + JSON.stringify(k0 && k0.boutons.map(x => x.t)));
      J.v(!!b && new RegExp("Ajoute " + m + " s au temps pour lire la feuille du voisin").test(b.title) && /chrono en cours/.test(b.title), H2, "l'infobulle de « +" + m + " » dit ce que fait le geste (« Ajoute " + m + " s au temps pour lire la feuille du voisin, tout de suite au chrono en cours »)", "(" + f1 + ") title : « " + (b ? b.title : "") + " »");
    }

    J.section("2 — « +5 », « +10 », « +30 » pendant la lecture : la base, la console et la tablette suivent");
    for(const m of [5, 10, 30]){
      const k_ = await carte(), d0 = etat().duree, tb0 = tempsBase() != null ? tempsBase() : +(k_ && k_.champ && k_.champ.value), ch0 = await chronoTab(t1, "g"), cv0 = parseInt(((await carte()) || {}).v, 10), ts0 = Date.now();
      const ok = await plus(m); await pause(1300);
      const d1 = etat().duree, tb1 = tempsBase(), ch1 = await chronoTab(t1, "g"), cv1 = parseInt(((await carte()) || {}).v, 10), dt = (Date.now() - ts0) / 1000;
      const f = await capt(t1, "2-plus" + m + "-tablette"); const fc = await capt(prof, "2-plus" + m + "-console");
      J.v(ok && d1 === d0 + m, H12, "« +" + m + " » : deroule/duree passe de " + d0 + " à " + (d0 + m), "(" + fc + ") clic : " + ok + " · duree " + d0 + " → " + d1);
      J.v(tb1 === tb0 + m, H12, "« +" + m + " » : temps/" + qi + "/reponse passe de " + tb0 + " à " + (tb0 + m), "temps " + tb0 + " → " + tb1);
      const okT = ch0 != null && ch1 != null && Math.abs((ch1 - ch0) - (m - dt)) <= 2;
      J.v(okT, H2, "« +" + m + " » : le chrono de la tablette (moitié de " + pre(tA.g) + ") gagne " + m + " s (au temps écoulé près)", "(" + f + ") chrono " + ch0 + " → " + ch1 + " en " + dt.toFixed(1) + " s");
      J.v(!isNaN(cv0) && !isNaN(cv1) && Math.abs((cv1 - cv0) - (m - dt)) <= 2, H2, "« +" + m + " » : le temps qui reste sur la carte de la console gagne " + m + " s", "(" + fc + ") " + cv0 + "s → " + cv1 + "s en " + dt.toFixed(1) + " s");
    }

    J.section("3 — un temps tapé dans le champ, caractère par caractère, pendant que les deux tablettes cliquent leur lecture");
    const tot0 = tempsBase(); const cible = String(tot0 + 70 > 99 ? tot0 + 70 : 150);
    await prof.click(champSel, {timeout: 3000}).catch(e => note("le champ ne se clique pas : " + e.message));
    await prof.keyboard.press("Control+A");
    // la console : ses redessins comptés pendant la frappe
    await prof.evaluate(() => { window.__mut = 0; window.__obs = new MutationObserver(l => { window.__mut += l.length; }); window.__obs.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true}); });
    let frappe = true, minReste = Infinity, figeVu = [];
    const lect0 = nLect;
    const clics = (async () => { while(frappe){ for(const [p, c, sl] of M){ if(!frappe) break; await cliquer(p, new RegExp("^" + esc(autre) + "$"), c, {apres: 90});
      const z = await zoneTexte(p, c); if(/Temps fini/.test(z) && !figeVu.includes(pre(sl))) figeVu.push(pre(sl)); } } })();
    const pertes = [];
    let tape = "";
    for(const ch of cible){
      await prof.keyboard.type(ch); tape += ch;
      for(let k = 0; k < 6; k++){ await pause(150); const r = resteBase(); if(r != null) minReste = Math.min(minReste, r);
        const st = await prof.evaluate(sel => { const i = document.querySelector(sel); return {v: i ? i.value : null, focus: !!i && document.activeElement === i}; }, champSel).catch(() => ({v: null, focus: false}));
        if(st.v !== tape || !st.focus) pertes.push("après « " + tape + " » : champ « " + st.v + " »" + (st.focus ? "" : ", curseur perdu")); }
    }
    // le curseur reste dans le champ 3 s de plus, les tablettes cliquent toujours (le chrono rouvert par la valeur entière)
    for(let k = 0; k < 20; k++){ await pause(150); const st = await prof.evaluate(sel => { const i = document.querySelector(sel); return {v: i ? i.value : null, focus: !!i && document.activeElement === i}; }, champSel).catch(() => ({v: null, focus: false}));
      if(st.v !== tape || !st.focus) pertes.push("après « " + tape + " », avant la validation : champ « " + st.v + " »" + (st.focus ? "" : ", curseur perdu")); }
    const fT = await capt(prof, "3-frappe-avant-validation");
    const mut = await prof.evaluate(() => { window.__obs.disconnect(); return window.__mut; }).catch(() => -1);
    frappe = false; await clics;
    note("pendant la frappe : " + (nLect - lect0) + " écritures de lectures/ par les tablettes, " + mut + " changements du DOM de la console");
    J.v(nLect - lect0 >= 4 && mut > 0, BANC, "pendant la frappe, les tablettes ont bien cliqué et la console s'est redessinée (sinon la vérification suivante ne dit rien)", (nLect - lect0) + " écritures, " + mut + " mutations");
    J.v(!pertes.length, H2, "la saisie « " + cible + " », tapée lentement, n'est jamais effacée ni coupée par un redessin (valeur du champ et curseur, toutes les 150 ms)", "(" + fT + ") " + [...new Set(pertes)].slice(0, 4).join(" | "));
    await prof.keyboard.press("Tab"); await pause(1200);
    const fV = await capt(prof, "3-apres-validation"); const kV = await carte();
    J.v(tempsBase() === +cible, H12, "validé (Tab), temps/" + qi + "/reponse vaut la valeur tapée (" + cible + ")", "(" + fV + ") temps : " + tempsBase());
    J.v(!!kV && kV.champ && kV.champ.value === cible, H2, "validé, le champ de la carte montre " + cible, "(" + fV + ") " + JSON.stringify(kV && kV.champ && kV.champ.value));
    note("pendant la frappe, le plus petit temps restant vu dans la base : " + (isFinite(minReste) ? minReste.toFixed(1) + " s" : "?") + (figeVu.length ? " ; « ⏱️ Temps fini » vu sur les moitiés de " + figeVu.join(", ") : ""));
    if(isFinite(minReste) && minReste <= 0) note("QUESTION pour la conscience : le champ envoie chaque valeur entière au fil de la frappe (règle du 04/10) ; en tapant « " + cible + " », le premier chiffre seul (« " + cible[0] + " s ») a mis le chrono de la lecture à 0 un instant : les lectures cliquées se figent pendant la frappe" + (figeVu.length ? " (vu sur les moitiés de " + figeVu.join(", ") + ")" : " (le banc ne l'a pas vu à l'écran entre deux relevés)") + ", et se rouvrent quand la valeur tapée dépasse le temps écoulé. Voulu ?");
    // remettre chaque lecture sur ce que dit la feuille
    for(const [p, c] of M){ for(let k = 0; k < 4; k++){ const s = await choisis(p, c); if(!s) break; const x = s.find(y => !juste.includes(y)) || juste.find(y => !s.includes(y)); if(!x) break; await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 200}); } }
    await pause(500);

    J.section("4 — la lecture figée à 0, puis rouverte par « +10 »");
    // un temps tapé pour que le 0 tombe dans 4 s : v = total + écoulé + 4 − duree
    const d = etat(), ecoule = (Date.now() - d.depuis) / 1000; const v4 = String(Math.ceil(tempsBase() + ecoule + 4 - d.duree));
    await prof.click(champSel, {timeout: 3000}).catch(() => {}); await prof.keyboard.press("Control+A"); await prof.keyboard.type(v4, {delay: 60}); await prof.keyboard.press("Tab");
    note("le banc tape « " + v4 + " » dans le champ : le 0 dans ≈ " + (resteBase() || 0).toFixed(1) + " s");
    for(let k = 0; k < 60 && !(resteBase() <= -1); k++) await pause(250);
    await pause(400);
    const [pA, cA, slA] = M[0];
    let zA = await zoneTexte(pA, cA); const fF = await capt(pA, "4-fige-a0");
    J.v(/⏱️ Temps fini : ta lecture est enregistrée/.test(zA), H2, "à 0, la moitié de " + pre(slA) + " (lecture cliquée) : « ⏱️ Temps fini : ta lecture est enregistrée »", "(" + fF + ") reste base " + (resteBase() || 0).toFixed(1) + " s · " + zA.slice(0, 220));
    let av = lect(slA); await cliquer(pA, new RegExp("^" + esc(autre) + "$"), cA, {apres: 700});
    J.v(lect(slA) === av && av !== undefined, H12, "à 0, un clic sur « " + autre + " » ne change pas la lecture dans la base (lectures/" + qi + "/" + slA + ")", "avant " + av + " · après " + lect(slA));
    if(lect(slA) !== av) await cliquer(pA, new RegExp("^" + esc(autre) + "$"), cA, {apres: 400});
    const kF = await carte(); const fCF = await capt(prof, "4-console-a0");
    note("à 0, la carte de la console : " + JSON.stringify(kF && {v: kF.v, boutons: kF.boutons.map(b => b.t + (b.disabled ? " (fermé)" : ""))}) + " (" + fCF + ")");
    // « +10 » : la lecture se rouvre
    const dA = etat().duree; const okP = await plus(10); const tP = Date.now(); await pause(1300);
    zA = await zoneTexte(pA, cA); const ouv = await O.choixOuverts(pA, cA, Q.choix); const fR = await capt(pA, "4-rouverte-plus10");
    // l'infobulle : « Une lecture déjà figée à 0 se rouvre pour ces secondes » : il reste 10 s depuis le clic (au temps du relevé près)
    const rP = resteBase(), attenduP = 10 - (Date.now() - tP) / 1000;
    J.v(okP && rP != null && Math.abs(rP - attenduP) <= 1.5, H12, "à 0, « +10 » sur la carte : la lecture repart pour 10 s depuis le clic (l'infobulle)", "clic : " + okP + " · duree " + dA + " → " + etat().duree + " · reste " + (rP == null ? "?" : rP.toFixed(1)) + " s, attendu ≈ " + attenduP.toFixed(1) + " s · carte : " + JSON.stringify(kF && kF.boutons.map(b => b.t + (b.disabled ? " (fermé)" : ""))));
    J.v(!/Temps fini/.test(zA) && ouv.length > 0, H2, "après « +10 », la lecture de " + pre(slA) + " se rouvre (plus de « Temps fini », ses choix ouverts)", "(" + fR + ") ouverts : " + JSON.stringify(ouv) + " · reste base " + (resteBase() || 0).toFixed(1) + " s · " + zA.slice(0, 200));
    av = lect(slA); await cliquer(pA, new RegExp("^" + esc(autre) + "$"), cA, {apres: 700}); const ap = lect(slA);
    J.v(ap !== av, H12, "après « +10 », un clic sur « " + autre + " » change de nouveau la lecture dans la base", "avant " + av + " · après " + ap);
    if(ap !== av) await cliquer(pA, new RegExp("^" + esc(autre) + "$"), cA, {apres: 400});
    // « +10 » donné 15 s après le 0
    J.section("4 bis — « +10 » donné 15 s après le 0 (l'infobulle : « Une lecture déjà figée à 0 se rouvre pour ces secondes. »)");
    for(let k = 0; k < 80 && !(resteBase() <= 0); k++) await pause(250);
    const t0z = Date.now(); while(Date.now() - t0z < 15000) await pause(500);
    zA = await zoneTexte(pA, cA);
    J.v(/Temps fini : ta lecture est enregistrée/.test(zA), H2, "15 s après le 0, la lecture de " + pre(slA) + " est figée", zA.slice(0, 200));
    const dB = etat().duree; await plus(10); await pause(1300);
    zA = await zoneTexte(pA, cA); const ouv2 = await O.choixOuverts(pA, cA, Q.choix); const fR2 = await capt(pA, "4bis-plus10-apres-15s");
    const fC2 = await capt(prof, "4bis-console");
    J.v(!/Temps fini/.test(zA) && ouv2.length > 0, H12, "15 s après le 0, « +10 » rouvre la lecture de " + pre(slA) + " pour 10 s (l'infobulle de « +10 » : « Une lecture déjà figée à 0 se rouvre pour ces secondes. »)", "(" + fR2 + ", " + fC2 + ") duree " + dB + " → " + etat().duree + ", temps restant dans la base " + (resteBase() || 0).toFixed(1) + " s : « +10 » s'ajoute au temps déjà dépassé · ouverts : " + JSON.stringify(ouv2) + " · " + zA.slice(0, 120));

    J.section("5 — aucune erreur de page");
    for(const p of A.pages){ J.v(!p.__err.length, H2, p.__nom + " : aucune erreur de page", p.__err.slice(0, 3).join(" | ")); if(p.__cerr.length) note(p.__nom + " (console du navigateur) : " + p.__cerr.slice(0, 2).join(" | ")); }
    await A.fermer();
  } catch(e){ J.v(false, BANC, "le jeu s'est interrompu : " + e.message); }
  ecrire(); process.exit(0);
})();
