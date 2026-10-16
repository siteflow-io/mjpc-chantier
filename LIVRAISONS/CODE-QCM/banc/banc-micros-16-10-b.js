// QCM-4 · BANC — le micro 8.0.3 de la conscience (DEFAUTS-OUVERTS, « Contrôle à froid des micros de la conscience — 16/10/2026 »),
// rejoué par le geste sur le faux hub, en trois séances jouées en même temps (chacune son faux hub, son navigateur) :
//  A. la correction avec un voisin, de « Avant la correction » à la co-évaluation, sur la moitié de chaque élève, mot pour mot les phrases
//     de Paul (élision « d'Inès » / « de Léa ») ; un élève seul (son voisin absent) : les phrases d'avant ; le bilan de classe, note complète ;
//     le bilan de classe, note complète (pendant la correction, aucun bouton de la console ne l'ouvre : « Révéler » attend la lecture de tous) ;
//  B. une séance terminée (« 🛑 Terminer ») au milieu de la correction : le tableau de la séance
//     et « 📄 Lire les copies » : la note telle qu'elle est, « n questions pas encore lues », la maîtrise et les compétences « — »,
//     « pas encore lue » au lieu de « écartée » ;
//  C. la séance sur papier : « Avant la correction » et « 💡 Révéler » disent les phrases d'avant, pas celles avec un voisin.
//   APP_FILE=<app> BANC=<faux hub> node banc/banc-micros-16-10-b.js <sortie>   → <sortie>/micros-b.txt, <sortie>/captures-micros-b/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, norm, texte, zoneTexte, cliquer, choisir, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "micros-b-" + Date.now()));
const CAP = path.join(SORTIE, "captures-micros-b"); fs.mkdirSync(CAP, {recursive: true});
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H3 = "QCM-3 · SOIR", BANC = "QCM-4 · BANC";
const P_E3 = H2 + " (etape3)", P_TAB = H2 + " (c3-tablettes)", P_CORR = H2 + " (c3-corr)", P_BASE = H1 + " (c3-base)", P_SEA = H3 + " (c4-seances)", P_LC = H3 + " (lire-copies)";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const JUSTE = [["Rome"], ["Madrid", "Berlin"], ["8"]];
const t0 = Date.now();
const JA = new O.Journal(), JB = new O.Journal(), JC = new O.Journal();
const NAVS = [];
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return f; };
const voy = s => /^[AEIOUYÉÈÊÀÂÎÔÛaeiouyéèêàâîôû]/.test(s);
const deN = s => (voy(s) ? "d'" : "de ") + s;

let ecrit = false;
function ecrire(fin){
  if(ecrit) return; ecrit = true;
  const tous = [JA, JB, JC], verifs = tous.reduce((a, j) => a + j.verifs.length, 0), echecs = tous.reduce((a, j) => a + j.echecs.length, 0);
  const lignes = j => j.l.map(x => x.section ? "── " + x.section : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(e){}
  let com = ""; try { com = " · commit " + cp.execSync("git rev-parse --short HEAD", {cwd: O.RACINE}).toString().trim(); } catch(e){}
  const out = "vérifications : " + verifs + " · échecs : " + echecs + (fin ? " · " + fin : "") + "\n" + tous.map(lignes).join("\n");
  fs.writeFileSync(path.join(SORTIE, "micros-b.txt"), "Micro 8.0.3 (la feuille du voisin toute la correction, les notes dans la console), par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + com + "\n" + out + "\n");
  console.log(out);
}
setTimeout(async () => { for(const j of [JA, JB, JC]) j.v(false, BANC, "plafond de 7 minutes atteint : le banc s'arrête là", j.partie); ecrire("arrêté au plafond de 7 minutes");
  for(const a of NAVS) try { await a.fermer(); } catch(e){} process.exit(0); }, 7 * 60 * 1000).unref();

// ── une séance : le faux hub, la console, le lancement (les absents cliqués dans la liste de présence) ──
async function seance(absents, papier, J){
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const pre = sl => nomDe(sl).split(" ").slice(1).join(" ");
  const A = new O.Appareils(srv, port); await A.demarrer(); NAVS.push(A);
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : {}; };
  const prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
  await choisir(prof, /3 ESSAI|3e Essai/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
  if(papier){ J.v(await cliquer(prof, /Séance sur papier/), H2, "le mode « 📄 Séance sur papier »"); await pause(400); }
  await cliquer(prof, /Lancer la séance/); await pause(500);
  for(const a of absents) await cliquer(prof, new RegExp(esc(a)));
  await pause(300);
  await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && !b.disabled && /Lancer la séance/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
  await pause(1500);
  return {B, srv, A, prof, sess, etat, codeDe, nomDe, pre};
}
// jouer Q1 à Q3 : rep(sl, qi) les choix cliqués à la tablette ; dit(sl, qi) « oui » / « non » à la question de la fin du temps
async function jouerQuestions(S, M, rep, dit){
  const {prof, etat} = S;
  for(let qi = 0; qi < 3; qi++){
    await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800);
    await cliquer(prof, /Autoriser la réponse/); await pause(2000);
    const fait = new Set(), dits = new Set();
    for(let k = 0; k < 100 && !/close/.test(etat().ph || ""); k++){
      for(const [p, c, sl] of M){
        const z = await zoneTexte(p, c);
        const estB = /la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z);
        const cle = qi + ":" + (etat().tour || 1) + ":" + sl;
        if(!estB && !fait.has(cle) && (await O.choixOuverts(p, c, EV.questions[qi].choix)).length){ for(const x of rep(sl, qi)) await cliquer(p, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); }
        if(estB && !dits.has(sl)){ const d = dit ? dit(sl, qi) : "oui"; if(await cliquer(p, d === "non" ? /Non, autre chose/ : /Oui, la même chose/, c)) dits.add(sl); }
      }
      if(etat().ph === "reponse" && k > 6 && k % 4 === 0) await cliquer(prof, /Tour suivant/);
      await pause(350);
    }
    if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
  }
}
const lignesDe = z => z.split(/\n/).map(x => x.replace(/^[☐☑✓✔⬜🔲\s]+/u, "").trim()).filter(Boolean);
const ext = (z, re) => { const m = z.match(new RegExp("[^\\n]*(" + re + ")[^\\n]*", "g")); return m ? m.join(" | ") : "(absent) " + z.slice(0, 300); };
const INTERDIT_VOISIN = /Tu avais juste|Tu avais faux|[Tt]a réponse|TA RÉPONSE|[Tt]a feuille|tu avais cliqué|tu as cliqué|montre ta feuille/;
// Données → Résultats → « 📊 Ouvrir » (comme banc-reprise7-c.js)
async function clic(p, re){
  const ok = await p.evaluate(([s, f]) => { const r = new RegExp(s, f); const t = e => (e.textContent || "").replace(/[  ]/g, " ").replace(/\s+/g, " ").trim();
    const b = [...document.querySelectorAll("button, a, [role=button], [data-va], .lire-prop, label")].filter(e => e.getBoundingClientRect().width > 0 && !e.disabled && r.test(t(e))).sort((a, b) => t(a).length - t(b).length)[0];
    if(!b) return false; document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return true; }, [re.source, re.flags]).catch(() => false);
  if(ok){ await p.click("[data-c='1']", {timeout: 3000}).catch(() => {}); await pause(900); return true; }
  return cliquer(p, re, null, {apres: 900});
}
async function ouvrirSeance(p){
  await clic(p, /^Données$/); await clic(p, /Résultats/);
  const ok = await p.evaluate(() => { const b = [...document.querySelectorAll("button, [data-va]")].filter(b => b.getBoundingClientRect().width > 0 && /📊 Ouvrir/.test(b.textContent))[0];
    if(!b) return false; document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return true; }).catch(() => false);
  if(!ok) return false; await p.click("[data-c='1']", {timeout: 3000}).catch(() => {}); await pause(1200); return true;
}
const cellules = (p, sel) => p.evaluate(sel => { const tr = document.querySelector(sel); return tr ? [...tr.querySelectorAll("td")].map(td => td.innerText.replace(/\s+/g, " ").trim()) : null; }, sel).catch(() => null);

// ════════════ A. La correction avec un voisin, et un élève seul ════════════
async function partieA(){
  const J = JA;
  try {
    J.section("A0. 3 ESSAI : YVON Adam et ZELLER Lou absents ; deux tablettes de voisins (l'une avec un prénom à voyelle), une tablette d'un élève seul");
    const S = await seance(["YVON Adam", "ZELLER Lou"], false, J);
    const {A, prof, sess, etat, nomDe, pre, codeDe} = S;
    const pl = sess().s.places || {}, abs = ["yvon_adam", "zeller_lou"];
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d}));
    const pres = sl => sl && !abs.includes(sl) && nomDe(sl);
    const deux = T.filter(t => pres(t.g) && pres(t.d));
    const tV = deux.find(t => voy(pre(t.g)) !== voy(pre(t.d)) && !/^H/.test(pre(t.g)) && !/^H/.test(pre(t.d)));
    const tC = deux.find(t => t !== tV && !voy(pre(t.g)) && !voy(pre(t.d)) && !/^H/.test(pre(t.g)) && !/^H/.test(pre(t.d)));
    const tS = T.find(t => (pres(t.g) ? 1 : 0) + (pres(t.d) ? 1 : 0) === 1);
    J.v(!!tV && !!tC, BANC, "les places : une tablette de voisins avec un prénom à voyelle, une sans", JSON.stringify(T).slice(0, 300));
    J.v(!!tS, BANC, "les places : un élève sans voisin présent (son voisin absent)", JSON.stringify(T).slice(0, 300));
    if(!tV || !tC) throw new Error("pas de places");
    const t1 = await A.tablette("tablette-voisins-1", "3 ESSAI"), t2 = await A.tablette("tablette-voisins-2", "3 ESSAI");
    await O.entrerTablette(t1, [["g", nomDe(tV.g)], ["d", nomDe(tV.d)]], codeDe);
    await O.entrerTablette(t2, [["g", nomDe(tC.g)], ["d", nomDe(tC.d)]], codeDe);
    const M = [[t1, "g", tV.g, tV.d], [t1, "d", tV.d, tV.g], [t2, "g", tC.g, tC.d], [t2, "d", tC.d, tC.g]];
    let slS = null, t3 = null;
    if(tS){ slS = pres(tS.g) ? tS.g : tS.d; t3 = await A.tablette("tablette-seul", "3 ESSAI");
      await O.entrerTablette(t3, [[pres(tS.g) ? "g" : "d", nomDe(slS)]], codeDe); M.push([t3, null, slS, null]); }
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);
    // E : l'élève au prénom à voyelle (sa feuille, lue par N) ; N : son voisin
    const E = voy(pre(tV.g)) ? tV.g : tV.d, N = E === tV.g ? tV.d : tV.g;
    // trouvée au dernier moment : E à Q2 (tablette Madrid et Berlin, N lit « Madrid ») ; faux : N et l'élève seul à Q3 (« 6 »)
    const rep = (sl, qi) => qi === 2 && (sl === N || sl === slS) ? ["6"] : JUSTE[qi];
    const lu = (sl, qi) => qi === 1 && sl === E ? ["Madrid"] : rep(sl, qi);
    const st = (sl, qi) => qi === 1 && sl === E ? "t" : qi === 2 && (sl === N || sl === slS) ? "f" : "j";

    J.section("A1. Q1 à Q3 (" + pre(E) + " et " + pre(N) + " ; " + pre(tC.g) + " et " + pre(tC.d) + (slS ? " ; " + pre(slS) + " seul" : "") + ")");
    await jouerQuestions(S, M, rep);
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(800);
    for(const [p, c] of M) await cliquer(p, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(1200);

    J.section("A2. « Avant la correction », sur la moitié de chaque élève");
    for(const [p, c, sl, vs] of M){
      await cocherTout(p, c); const z = (await zoneTexte(p, c || "g")) || (await texte(p)); const L = lignesDe(z);
      if(!vs){
        J.v(!/Donne ta feuille à|prends la sienne|Puis tu corriges la feuille de|rends sa feuille/.test(z), P_E3, "seul, " + pre(sl) + " : « Avant la correction » sans les phrases avec un voisin", ext(z, "Donne ta feuille|prends la sienne|corriges la feuille"));
        await capt(p, "a-attest2-seul"); continue;
      }
      const v = pre(vs);
      const l1 = "Maintenant, la correction. Donne ta feuille à " + v + " et prends la sienne : tu la gardes jusqu'à la fin de la correction.";
      const l2 = "Puis tu corriges la feuille " + deN(v) + " en vert, comme sa moitié de la tablette te le dit.";
      const l3 = "et si tu lis et corriges avec soin la feuille " + deN(v) + ".";
      J.v(L.includes(l1), P_E3, pre(sl) + " : « " + l1 + " »", ext(z, "Maintenant, la correction"));
      J.v(L.includes(l2), P_E3, pre(sl) + " : « " + l2 + " »", ext(z, "Puis tu corriges"));
      J.v(z.includes(l3), P_E3, pre(sl) + " : « … " + l3 + " »", ext(z, "avec soin la feuille"));
      J.v(!/montre ta feuille à/i.test(z), P_E3, pre(sl) + " : plus « montre ta feuille à »", ext(z, "ontre ta feuille"));
      if(sl === N || sl === tC.g) await capt(p, "a-attest2-" + slug(pre(sl)));
    }
    for(const [p, c] of M) await cliquer(p, /^Je commence la correction$/, c);
    await pause(1500); await cliquer(prof, /Commencer la correction/); await pause(1500);
    J.v(etat().ph === "lecture", H1, "la correction commence au clic de Paul (« Commencer la correction »)", JSON.stringify(etat()).slice(0, 200));
    const oc = sess().s.ordreCorr; const ordre = (Array.isArray(oc) ? oc : Object.values(oc || {})).map(Number);

    for(let i = 0; i < ordre.length; i++){
      const qi = ordre[i];
      if(i){ await cliquer(prof, /Question suivante/); await pause(1000); }
      J.section("A3." + (i + 1) + " Q" + (qi + 1) + " : la lecture, puis « 💡 Révéler »");
      for(const [p, c, sl, vs] of M){
        const z = (await zoneTexte(p, c || "g")) || (await texte(p));
        if(vs){
          J.v(!/montre ta feuille/i.test(z), P_E3, "lecture Q" + (qi + 1) + ", moitié de " + pre(sl) + " : plus « " + pre(sl) + ", montre ta feuille à " + pre(vs) + ". »", ext(z, "ontre ta feuille"));
          const lt = pre(vs) + ", lis la feuille " + deN(pre(sl)) + " :";
          J.v(z.includes(lt), P_E3, "lecture Q" + (qi + 1) + ", moitié de " + pre(sl) + " : « " + lt + " … »", ext(z, "lis la feuille"));
          J.v(!INTERDIT_VOISIN.test(z), P_E3, "lecture Q" + (qi + 1) + ", moitié de " + pre(sl) + " (" + pre(vs) + " a la feuille) : aucune phrase « tu » sur SA feuille", ext(z, INTERDIT_VOISIN.source));
        }
        for(const x of lu(sl, qi)) await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 120});
      }
      if(i === 0) await capt(t1, "a-lecture-q" + (qi + 1));
      await pause(900); await cliquer(prof, /Révéler/); await pause(1500);
      const vusP = new Set();
      for(const [p, c, sl, vs] of M){
        const z = (await zoneTexte(p, c || "g")) || (await texte(p)), s = st(sl, qi), pr = pre(sl);
        if(!vusP.has(p)){ vusP.add(p); await capt(p, "a-revele-q" + (qi + 1) + "-" + p.__nom); }
        if(vs){
          const v = pre(vs), ou = "« 💡 Révéler » Q" + (qi + 1) + ", moitié de " + pr + " (" + v + " a sa feuille)";
          if(s === "j"){
            J.v(z.includes("✅ " + pr + " avait juste !"), P_E3, ou + " : « ✅ " + pr + " avait juste ! »", ext(z, "avait|avais"));
            const c1 = v + ", sur la feuille " + deN(pr) + ", mets simplement un V vert dans la marge à côté de sa réponse.";
            J.v(z.includes(c1), P_E3, ou + " : « " + c1 + " »", ext(z, "V vert|sur la feuille"));
          } else if(s === "f"){
            J.v(z.includes("❌ " + pr + " avait faux."), P_E3, ou + " : « ❌ " + pr + " avait faux. »", ext(z, "avait|avais"));
            const c2 = v + ", sur la feuille " + deN(pr) + ", barre sa réponse et écris la bonne réponse en entier en vert à côté.";
            J.v(z.includes(c2), P_E3, ou + " : « " + c2 + " »", ext(z, "arre|sur la feuille"));
          } else {
            const t1s = "Sa feuille disait autre chose, mais " + pr + " a cliqué sur la bonne réponse : la question compte. Cela n'arrive qu'une fois par évaluation.";
            J.v(z.includes(t1s), P_E3, ou + ", trouvée au dernier moment : « " + t1s + " »", ext(z, "Trouvée|disait autre chose"));
            const t2s = "Sur la tablette, " + pr + " avait cliqué sur : Madrid, Berlin";
            J.v(z.includes(t2s), P_E3, ou + " : « " + t2s + " »", ext(z, "Sur la tablette"));
          }
          J.v(/SA RÉPONSE|(^|\n)Sa réponse/.test(z), P_E3, ou + " : l'étiquette « Sa réponse »", ext(z, "éponse"));
          J.v(!INTERDIT_VOISIN.test(z), P_E3 + ", " + P_TAB, ou + " : aucune phrase « tu » sur SA feuille (« Tu avais juste », « ta réponse », « ta feuille »)", ext(z, INTERDIT_VOISIN.source));
        } else {
          const ou = "« 💡 Révéler » Q" + (qi + 1) + ", " + pr + " seul";
          if(s === "j"){
            J.v(z.includes("✅ Tu avais juste !"), P_E3, ou + " : « ✅ Tu avais juste ! »", ext(z, "avait|avais"));
            J.v(z.includes("Sur ta feuille, mets simplement un V vert dans la marge à côté de ta réponse."), P_E3, ou + " : « Sur ta feuille, mets simplement un V vert dans la marge à côté de ta réponse. »", ext(z, "V vert"));
          } else {
            J.v(z.includes("❌ Tu avais faux."), P_E3, ou + " : « ❌ Tu avais faux. »", ext(z, "avait|avais"));
            J.v(z.includes("Barre ta réponse et écris la bonne réponse en entier en vert à côté."), P_E3, ou + " : « Barre ta réponse et écris la bonne réponse en entier en vert à côté. »", ext(z, "arre"));
            J.v(/TA RÉPONSE|(^|\n)Ta réponse/.test(z), P_E3, ou + " : l'étiquette « Ta réponse »", ext(z, "éponse"));
          }
          J.v(!/avait juste|avait faux|sur la feuille d|Sa réponse|SA RÉPONSE|rends sa feuille/.test(z), P_E3 + ", " + P_TAB, ou + " : pas les phrases avec un voisin", ext(z, "avait juste|avait faux|sur la feuille d|Sa réponse"));
        }
      }
    }
    const tr = sess().s.trouvee || {};
    J.v(String(tr[E]) === "1", BANC, "la base : " + pre(E) + " trouvée au dernier moment à Q2 (trouvee/" + E + " = 1)", JSON.stringify(tr));

    J.section("A4. La co-évaluation : « 📄 <voisin>, rends sa feuille à <élève>. » en tête");
    await cliquer(prof, /Ouvrir la co-évaluation/); await pause(1500);
    for(const [p, c, sl, vs] of M){
      const z = (await zoneTexte(p, c || "g")) || (await texte(p));
      if(!vs){ J.v(!/rends sa feuille/.test(z), P_E3, "co-évaluation, " + pre(sl) + " seul : pas de « rends sa feuille »", ext(z, "rends sa feuille")); continue; }
      const r = "📄 " + pre(vs) + ", rends sa feuille à " + pre(sl) + ".";
      const L = lignesDe(z), iR = L.indexOf(r), iB = L.findIndex(x => /Je pense que/.test(x));
      J.v(iR >= 0, P_E3, "co-évaluation, moitié de " + pre(sl) + " : « " + r + " »", ext(z, "rends|feuille"));
      J.v(iR >= 0 && (iB < 0 || iR < iB), P_E3, "co-évaluation, moitié de " + pre(sl) + " : « " + r + " » en tête (avant « ✅ / ❌ Je pense que … »)", L.slice(0, 8).join(" | "));
    }
    await capt(t1, "a-coeval");
    for(const [p, c, sl, vs] of M) if(vs) await cliquer(p, /^✅ Je pense que .* a bien lu ma feuille/, c);
    await pause(1500);
    await cliquer(prof, /Afficher leur bilan aux élèves/); await pause(1500);
    const cb = await texte(prof); await capt(prof, "a-bilan-classe");
    J.v(/🏁 Bilan classe/.test(cb), BANC, "« Afficher leur bilan aux élèves » : la console montre « 🏁 Bilan classe »", cb.slice(0, 300));
    const ligneB = nm => prof.evaluate(nom => { const tr = [...document.querySelectorAll(".bilan-classe-table tr")].find(t => t.innerText.includes(nom)); return tr ? [...tr.querySelectorAll("td")].map(td => td.innerText.replace(/\s+/g, " ").trim()) : null; }, nm).catch(() => null);
    { const row = await ligneB(nomDe(tC.g)), nm = nomDe(tC.g);
      J.v(!!row && !/pas encore lue/.test(row[1] || "") && row[3] !== "—" && row[3] !== "", P_CORR, "bilan de classe, " + nm + " (note complète) : la note, la maîtrise, sans « pas encore lue »", JSON.stringify(row)); }
    J.v(!prof.__err.length, BANC, "aucune erreur de page (console, séance A)", prof.__err.slice(0, 3).join(" | "));
  } catch(e){ J.v(false, BANC, "la partie A s'est interrompue : " + (e && e.message || e)); }
}

// ════════════ B. « 🛑 Terminer » au milieu de la correction : le bilan de classe, le tableau de la séance, « Lire les copies » ════════════
async function partieB(){
  const J = JB;
  try {
    J.section("B0. 3 ESSAI, deux tablettes ; Julien dit « Non, autre chose » à Q1 (une ligne à lire le soir)");
    const S = await seance(["YVON Adam"], false, J);
    const {A, prof, sess, etat, nomDe, pre, codeDe} = S;
    const pl = sess().s.places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d}));
    const tA = T.find(t => [t.g, t.d].includes("abrial_julien")), tB = T.find(t => t !== tA && t.g && t.d && t.g !== "yvon_adam" && t.d !== "yvon_adam");
    if(!tA || !tB) throw new Error("pas de places");
    const t1 = await A.tablette("tablette-1", "3 ESSAI"), t2 = await A.tablette("tablette-2", "3 ESSAI");
    await O.entrerTablette(t1, [["g", nomDe(tA.g)], ["d", nomDe(tA.d)]], codeDe);
    await O.entrerTablette(t2, [["g", nomDe(tB.g)], ["d", nomDe(tB.d)]], codeDe);
    const M = [[t1, "g", tA.g], [t1, "d", tA.d], [t2, "g", tB.g], [t2, "d", tB.d]];
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);
    await jouerQuestions(S, M, (sl, qi) => JUSTE[qi], (sl, qi) => sl === "abrial_julien" && qi === 0 ? "non" : "oui");
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(800);
    for(const [p, c] of M) await cliquer(p, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(1000);
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence la correction$/, c); }
    await pause(1500); await cliquer(prof, /Commencer la correction/); await pause(1500);
    const oc = sess().s.ordreCorr; const ordre = (Array.isArray(oc) ? oc : Object.values(oc || {})).map(Number);
    const q0 = ordre[0];
    for(const [p, c] of M) for(const x of JUSTE[q0]) await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 120});
    await pause(900); await cliquer(prof, /Révéler/); await pause(1200);
    await cliquer(prof, /Question suivante/); await pause(1000);
    J.v(etat().ph === "lecture" && Number(etat().qi) === ordre[1], BANC, "la correction : Q" + (q0 + 1) + " révélée, Q" + (ordre[1] + 1) + " en lecture (deux questions pas encore lues)", JSON.stringify(etat()).slice(0, 200));
    const sJ = "abrial_julien", nomJ = nomDe(sJ), sT = tB.g;

    J.section("B1. « 🛑 Terminer » au milieu de la correction, puis Données → Résultats → « 📊 Ouvrir »");
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
    await cliquer(prof, /Terminer la séance/); await pause(500); await cliquer(prof, /^🛑 Terminer la séance$|Terminer la séance/); await pause(2000);
    const ok = await ouvrirSeance(prof); const tab = await texte(prof); await capt(prof, "b-tableau-seance");
    J.v(ok && /À lire sur la feuille|📄 Lire les copies/.test(tab), BANC, "le tableau de la séance terminée s'ouvre", tab.slice(0, 300));
    for(const sl of [sJ, sT]){
      const c = await cellules(prof, "tr[data-eleve='" + sl + "']"), nm = nomDe(sl);
      if(!J.v(!!c, P_SEA, "tableau de la séance : la ligne de " + nm, tab.slice(0, 200))) continue;
      // élève, Q1..Q3, note, sur 20, maîtrise, compétences…, autonomie, à lire
      J.v(/^\d+(,\d)?\/3/.test(c[4] || "") && /2 questions pas encore lues/.test(c[4] || ""), P_SEA + ", " + P_BASE, "tableau de la séance, " + nm + " : la note telle qu'elle est (« n/3 ») et « 2 questions pas encore lues »", JSON.stringify(c));
      J.v(/^\d+(,\d)?$/.test(c[5] || ""), P_SEA, "tableau de la séance, " + nm + " : la note sur 20 telle qu'elle est", JSON.stringify(c));
      J.v(c[6] === "—", P_SEA, "tableau de la séance, " + nm + " : la maîtrise « — » jusqu'à la note complète", JSON.stringify(c));
      const comps = c.slice(7, -2);
      J.v(comps.length > 0 && comps.every(x => x === "—"), P_SEA, "tableau de la séance, " + nm + " : les compétences « — » jusqu'à la note complète", JSON.stringify(c));
    }
    J.v(!/écartée/.test(tab.replace(/questions écartées ou annulées/g, "")), P_SEA, "tableau de la séance : pas de « écartée » pour une question pas encore lue", ext(tab, "écartée"));

    J.section("B2. « 📄 Lire les copies » de la séance terminée avant la fin de la correction : " + nomJ);
    if(!(await clic(prof, /📄 Lire les copies/))) J.v(false, P_LC, "« 📄 Lire les copies » dans le tableau de la séance", ext(tab, "Lire les copies"));
    else {
      const ini = slug(nomJ.split(" ")[0]).slice(0, 4);
      const okI = await prof.click("[data-initiales='1']", {timeout: 2000}).then(() => true).catch(() => false);
      if(okI){ await prof.keyboard.type(ini, {delay: 60}); await pause(500); await prof.keyboard.press("Enter"); await pause(1200); }
      let t = await texte(prof); await capt(prof, "b-lire-copies");
      J.v(okI && t.includes(nomJ.split(" ")[0]), BANC, "« Lire les copies » : « " + ini + " », Entrée : la copie de " + nomJ, t.slice(0, 300));
      if(!/🧮 La note, en direct/.test(t)){ await clic(prof, /^✅ Oui$/); await pause(900); t = await texte(prof); await capt(prof, "b-lire-copies-oui"); }
      const nd = norm(await prof.evaluate(() => { const e = document.querySelector("[data-note-directe]"); return e ? e.innerText : ""; }).catch(() => "")).replace(/[ \t]+/g, " ");
      J.v(!!nd, P_LC, "« 🧮 La note, en direct » de la copie de " + nomJ, t.slice(0, 400));
      if(nd){
        const nq = ordre.slice(1).map(q => "Question " + (q + 1) + " : pas encore lue");
        J.v(nq.every(x => nd.includes(x)), P_LC, "la note en direct : « " + nq.join(" », « ") + " »", norm(nd).replace(/\s+/g, " "));
        J.v(!/écartée/.test(nd), P_LC, "la note en direct : plus « écartée » pour une question pas encore lue", norm(nd).replace(/\s+/g, " "));
        J.v(/✍️ Note : [^\n]*\d+ \/ 3/.test(nd) && /2 questions pas encore lues/.test(nd), P_LC + ", " + P_BASE, "la note en direct : la note telle qu'elle est et « 2 questions pas encore lues »", norm(nd).replace(/\s+/g, " "));
      }
    }
    J.v(!prof.__err.length, BANC, "aucune erreur de page (console, séance B)", prof.__err.slice(0, 3).join(" | "));
  } catch(e){ JB.v(false, BANC, "la partie B s'est interrompue : " + (e && e.message || e)); }
}

// ════════════ C. La séance sur papier : les phrases d'avant ════════════
async function partieC(){
  const J = JC;
  try {
    J.section("C0. La séance sur papier : lancée, « ⏸️ Feuilles ramassées », reprise ; deux élèves entrés");
    const S = await seance(["YVON Adam"], true, J);
    const {A, prof, sess, nomDe, codeDe, etat} = S;
    J.v((sess().s.lancee || {}).mode === "papier", BANC, "la séance est lancée sur papier", JSON.stringify(sess().s.lancee || {}).slice(0, 200));
    await cliquer(prof, /Feuilles ramassées/); await pause(500);
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Finir à une autre heure|Feuilles ramassées|Confirmer/.test(b.textContent)); if(b.length > 1) b[b.length - 1].click(); });
    await pause(1000);
    await prof.reload(); await pause(2000); await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600);
    J.v(await cliquer(prof, /Reprendre la séance du/), BANC, "« ▶️ Reprendre la séance du … »"); await pause(800);
    await prof.evaluate(() => { const b = [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0 && /Lancer la séance|Reprendre|Commencer/.test(b.textContent)); if(b.length) b[b.length - 1].click(); });
    await pause(1500);
    const pl = sess().s.places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d}));
    const tA = T.find(t => [t.g, t.d].includes("abrial_julien")) || T[0];
    const t1 = await A.tablette("tablette-papier", "3 ESSAI");
    await O.entrerTablette(t1, [["g", nomDe(tA.g)], ["d", nomDe(tA.d)]], codeDe);
    await pause(1500);
    for(const c of ["g", "d"]) await cliquer(t1, /Maîtrise satisfaisante/, c);
    await pause(800); await cliquer(prof, /Lancer la correction/); await pause(1500);
    let z = "";
    for(let k = 0; k < 20 && !/Avant la correction/.test(z); k++){ z = (await zoneTexte(t1, "g")) || ""; if(!/Avant la correction/.test(z)) await pause(500); }

    J.section("C1. Sur papier : « Avant la correction » et « 💡 Révéler »");
    for(const c of ["g", "d"]) await cocherTout(t1, c);
    z = (await zoneTexte(t1, "g")) || ""; await capt(t1, "c-papier-attest2");
    J.v(/Avant la correction/.test(z), BANC, "la tablette montre « Avant la correction » (papier)", z.slice(0, 300));
    J.v(!/Donne ta feuille à|prends la sienne|Puis tu corriges la feuille|rends sa feuille|montre ta feuille/i.test(z), P_E3, "papier, « Avant la correction » : pas les phrases avec un voisin", ext(z, "Donne ta feuille|corriges la feuille|ontre ta feuille"));
    J.v(z.includes("Barre ta réponse et écris la bonne réponse en entier en vert à côté."), P_E3, "papier, « Avant la correction » : « Barre ta réponse et écris la bonne réponse en entier en vert à côté. » (la phrase d'avant)", ext(z, "arre"));
    for(const c of ["g", "d"]) await cliquer(t1, /^Je commence la correction$/, c);
    await pause(1500); await cliquer(prof, /Commencer la correction/); await pause(1500);
    for(let k = 0; k < 6 && etat().ph !== "revele"; k++){ await cliquer(prof, /Révéler/); await pause(1200); }
    for(const c of ["g", "d"]){
      const r = (await zoneTexte(t1, c)) || "";
      if(c === "g") await capt(t1, "c-papier-revele");
      const avant = r.includes("Barre ta réponse et écris la bonne réponse en entier en vert à côté.") || r.includes("Sur ta feuille, mets simplement un V vert dans la marge à côté de ta réponse.");
      J.v(avant, P_E3, "papier, « 💡 Révéler », moitié " + c + " : la phrase d'avant (« Barre ta réponse … » ou « Sur ta feuille, mets simplement un V vert … »)", ext(r, "arre|V vert"));
      J.v(!/avait juste|avait faux|sur la feuille d|Sa réponse|SA RÉPONSE|Sa feuille disait|rends sa feuille/.test(r), P_E3 + ", " + P_TAB, "papier, « 💡 Révéler », moitié " + c + " : pas les phrases avec un voisin", ext(r, "avait juste|avait faux|sur la feuille d|Sa réponse|Sa feuille"));
    }
    J.v(!prof.__err.length && !t1.__err.length, BANC, "aucune erreur de page (séance sur papier)", prof.__err.concat(t1.__err).slice(0, 3).join(" | "));
  } catch(e){ JC.v(false, BANC, "la partie C s'est interrompue : " + (e && e.message || e)); }
}

(async () => {
  await Promise.all([partieA(), partieB(), partieC()]);
  for(const a of NAVS) try { await a.fermer(); } catch(e){}
  ecrire(); process.exit(0);
})();
