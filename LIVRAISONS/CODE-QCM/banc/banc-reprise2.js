// QCM-4 · BANC — la reprise 2 du 13/10 (DEFAUTS-OUVERTS, « Reprise 2 », points 1 à 5), rejouée par le geste sur le faux hub :
// la classe 3 ESSAI, Adam absent, deux tablettes entrées (quatre élèves), les vingt autres présents jamais entrés ; console, téléphone, tableau.
// 5. les compteurs ; 1. le chrono du téléphone ; 3. « 🔓 Rouvrir pour un élève » ; 2. « 🔓 Rouvrir pour tous » ; 4. la console rechargée ;
// 1. « ▶️ Commencer la correction » au téléphone.
//   APP_FILE=<app> node banc/banc-reprise2.js <dossier de sortie>
const path = require("path"), fs = require("fs");
const O = require("./outils");
const { pause, slug, texte, zoneTexte, cliquer, etatBouton, choisir, taper, cocherTout, choixOuverts, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise2-" + Date.now()));
fs.mkdirSync(path.join(SORTIE, "captures-reprise2"), {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
let n = 0; const capt = async (p, id) => photo(p, path.join(SORTIE, "captures-reprise2", String(++n).padStart(2, "0") + "-" + id + ".png"));
const hhmm = () => new Date().toLocaleTimeString("fr-FR", {hour: "2-digit", minute: "2-digit"});   // l'heure du navigateur, comme l'app l'écrit
(async () => {
  const t0 = Date.now();
  const {B, srv, port} = await O.fauxHub();
  const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
  const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
  const A = new O.Appareils(srv, port); await A.demarrer();
  let dernier = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a["3 ESSAI"] || a[slug("3 ESSAI")]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) dernier = id; else id = dernier; return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
  const etat = () => { const x = sess().s; return x.deroule && typeof x.deroule === "object" ? x.deroule : {}; };
  const entrer = async (p, cote, nom) => { const [N, ...P] = nom.split(" "); await taper(p, cote, "code", codeDe(nom)); await taper(p, cote, "prenom", P.join(" ").toLowerCase()); await taper(p, cote, "nom", N.toLowerCase()); await cliquer(p, /Entrer/, cote); await pause(400); };
  const repondre = async (p, c, qi) => { const lab = EV.questions[qi].choix; if((await choixOuverts(p, c, lab)).length){ await cliquer(p, new RegExp("^" + O.esc(lab[0]) + "$"), c); return true; } return false; };
  let prof, tel, tab;
  try {
    prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/);
    await choisir(prof, /3 ESSAI/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(300);
    await cliquer(prof, /Lancer la séance/); await pause(400); await cliquer(prof, /YVON Adam/); await cliquer(prof, /Lancer la séance/); await pause(1200);
    const pl = sess().s.places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d}));
    const tA = T.find(t => [t.g, t.d].includes("abrial_julien")), tB = T.find(t => [t.g, t.d].includes("chevallier_theo"));
    if(!tA || !tB) throw new Error("pas de places");
    const t1 = await A.tablette("tablette-1", "3 ESSAI"), t2 = await A.tablette("tablette-2", "3 ESSAI");
    tel = await A.ouvrir("telephone", "?mode=prof&view=phone", 390, 844);
    tab = await A.ouvrir("tableau", "?mode=prof&view=board", 1920, 1080);
    await cliquer(t1, /2 élèves/); await entrer(t1, "g", nomDe(tA.g)); await entrer(t1, "d", nomDe(tA.d));
    await cliquer(t2, /2 élèves/); await entrer(t2, "g", nomDe(tB.g)); await entrer(t2, "d", nomDe(tB.d));
    for(const [p, c] of [[t1, "g"], [t1, "d"], [t2, "g"], [t2, "d"]]){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);

    J.section("5. Les compteurs, 4 élèves entrés sur 24 présents");
    await cliquer(prof, /Lancer Q1\b/); await pause(1500);
    const cQ1 = await texte(prof); await capt(prof, "c-q1-reflexion");
    J.v(!/24\s*\/\s*24\s*CONNECT/i.test(cQ1) && /4\s*\/\s*24\s*CONNECT/i.test(cQ1), H1 + ", " + H2, "à « ▶️ Lancer Q1 », « CONNECTÉS » compte les 4 entrés (4/24), pas 24/24", (cQ1.match(/\d+\s*\/\s*\d+\s*CONNECT\S*/i) || [""])[0]);
    const denQ1 = (cQ1.match(/(\d+)\s*\/\s*(\d+)\s*ONT R/i) || [])[2];

    J.section("1. Le chrono du téléphone avance");
    const ch1 = (await texte(tel)).match(/(\d+)\s*s\b/); await pause(3000); const ch2 = (await texte(tel)).match(/(\d+)\s*s\b/);
    await capt(tel, "p-reflexion");
    J.v(!!ch1 && !!ch2 && ch1[1] !== ch2[1], H2, "au téléphone, le chrono avance (deux lectures à 3 s d'écart)", (ch1 || [""])[0] + " → " + (ch2 || [""])[0]);

    // Q1 : seul le premier élève de la tablette 1 répond ; personne d'autre
    await cliquer(prof, /Autoriser la réponse/); await pause(3000);
    let qui1 = null;
    for(const c of ["g", "d"]) if(!qui1 && await repondre(t1, c, 0)) qui1 = c;
    await pause(500);
    await cliquer(prof, /Tour suivant/); await pause(4000);
    const cT2 = await texte(prof);
    const denT2 = (cT2.match(/(\d+)\s*\/\s*(\d+)\s*ONT R/i) || [])[2];
    J.v(!!denQ1 && denQ1 === denT2, H1 + ", " + H2, "« ONT RÉPONDU » garde son dénominateur d'un tour à l'autre", denQ1 + " puis " + denT2);
    await cliquer(prof, /Clore la question/); await pause(1200);
    if(!/close/.test(etat().ph || "")){ await pause(4000); }
    const autre = qui1 === "g" ? "d" : "g", slAutre = tA[autre], nmAutre = nomDe(slAutre), preAutre = nmAutre.split(" ").slice(1).join(" ");
    const preQui = nomDe(tA[qui1]).split(" ").slice(1).join(" ");
    J.v(/close/.test(etat().ph || ""), H1, "Q1 close", JSON.stringify(etat()));

    J.section("3. « 🔓 Rouvrir pour un élève » : pour lui seul");
    J.v(await cliquer(prof, /Rouvrir pour un élève/), H2, "« 🔓 Rouvrir pour un élève »"); await pause(400);
    await capt(prof, "c-rouvrir-un-liste");
    J.v(await cliquer(prof, new RegExp("Rouvrir pour " + O.esc(preAutre))), H2, "« 🔓 Rouvrir pour " + preAutre + " »"); await pause(2500);
    const telR = await texte(tel), tabR = await texte(tab), profR = await texte(prof);
    await capt(tel, "p-rouvert-un"); await capt(tab, "b-rouvert-un"); await capt(prof, "c-rouvert-un"); await capt(t1, "t-rouvert-un");
    J.v(!/Tour suivant/.test(telR) && !/moitiés de (gauche|droite)/i.test(telR), H2, "le téléphone n'annonce pas un tour à la classe (pas de « ⏭️ Tour suivant », pas de « moitiés de … »)", telR.slice(0, 300));
    J.v(!/POSE TON STYLO|Pose ton stylo/i.test(tabR), H2, "le tableau n'annonce pas « Pose ton stylo » à la classe", tabR.slice(0, 300));
    J.v(new RegExp(O.esc(preAutre)).test(profR) && !/Question close — passe à la suivante/.test(profR), H2, "la console montre la question rouverte pour " + preAutre, profR.slice(0, 300));
    await pause(3000); await repondre(t1, autre, 0); await pause(6000);
    // B pour lui seul, puis close
    const zb = await zoneTexte(t1, autre);
    if(/dit-elle la même chose que ton clic/.test(zb)) await cliquer(t1, /Oui|la même chose/, autre);
    await pause(4000);
    const profA = await texte(prof), zq = await zoneTexte(t1, qui1);
    await capt(prof, "c-apres-rouvert-un"); await capt(t1, "t-apres-rouvert-un");
    J.v(!/2e tour/.test(profA) || /close/.test(etat().ph || ""), H1 + ", " + H2, "après sa réponse, pas de 2e tour pour la classe (la console)", JSON.stringify(etat()) + " · " + profA.slice(0, 200));
    J.v(!/pose ton stylo|Sélectionne maintenant ta réponse/i.test(zq), H1 + ", " + H2, preQui + ", qui avait répondu, ne se voit pas redonner la question", zq.slice(0, 200));

    J.section("2. « 🔓 Rouvrir pour tous » : ceux qui n'ont pas répondu");
    for(let k = 0; k < 20 && !/close/.test(etat().ph || ""); k++) await pause(500);
    J.v(await cliquer(prof, /Rouvrir pour tous/), H2, "« 🔓 Rouvrir pour tous »"); await pause(400);
    await capt(prof, "c-rouvrir-tous");
    await cliquer(prof, /Rouvrir pour ceux qui n'ont pas répondu/); await pause(3000);
    J.v(!/close/.test(etat().ph || ""), H1, "la question est rouverte (deroule.ph n'est plus close)", JSON.stringify(etat()));
    let ouverts = 0; for(let k = 0; k < 12 && !ouverts; k++){ for(const c of ["g", "d"]) if((await choixOuverts(t2, c, EV.questions[0].choix)).length) ouverts++; if(!ouverts) await pause(1000); }
    await capt(t2, "t-rouvert-tous"); await capt(prof, "c-rouvert-tous");
    J.v(ouverts > 0, H1, "la tablette 2 (sans réponse) retrouve la question", String(ouverts));
    J.v(!(await choixOuverts(t1, qui1, EV.questions[0].choix)).length, H1, preQui + ", qui avait répondu, ne la retrouve pas");
    for(let k = 0; k < 40 && !/close/.test(etat().ph || ""); k++){ await cliquer(prof, /Tour suivant|Clore la question/); await pause(1000); }

    J.section("4. La console rechargée pendant la réflexion de Q2");
    await cliquer(prof, /Lancer Q2\b/); await pause(5000);
    const avant = etat(); const h = hhmm();
    await prof.reload(); await pause(2500); await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(800);
    const ci = await texte(prof); await capt(prof, "c-interrompue");
    J.v(/Séance interrompue/.test(ci), H2, "« ⚠️ Séance interrompue détectée »", ci.slice(0, 200));
    J.v(/question 2/i.test(ci) && /réflexion/i.test(ci), H1 + ", " + H2, "l'état vrai : question 2, en réflexion", (ci.match(/État[^\n]*/) || [""])[0]);
    const hd = (ci.match(/déconnexion[^\n]*?(\d{1,2}[:h]\d{2})/i) || [])[1];
    const mn = s => { const m = (s || "").match(/(\d{1,2})[:h](\d{2})/); return m ? +m[1] * 60 + +m[2] : -99; };
    J.v(Math.abs(mn(hd) - mn(h)) <= 1, H1 + ", " + H2, "l'heure vraie de la coupure (" + h + ")", hd);
    await cliquer(prof, /🔄 Reprendre la séance/); await pause(1500);
    const apres = etat(); await capt(prof, "c-reprise");
    J.v(apres.depuis === avant.depuis && apres.ph === avant.ph, H1, "la reprise garde le chrono où il en était (deroule.depuis inchangé)", JSON.stringify(avant) + " → " + JSON.stringify(apres));

    J.section("1. « ▶️ Commencer la correction » au téléphone");
    for(const qi of [1, 2]){
      if(qi === 2) await cliquer(prof, /Lancer Q3\b/), await pause(800);
      await cliquer(prof, /Autoriser la réponse/); await pause(3000);
      for(let k = 0; k < 40 && !/close/.test(etat().ph || ""); k++){ for(const [p, c] of [[t1, "g"], [t1, "d"], [t2, "g"], [t2, "d"]]) await repondre(p, c, qi); await cliquer(prof, /Tour suivant|Clore la question/); await pause(800); }
    }
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(800);
    for(const [p, c] of [[t1, "g"], [t1, "d"], [t2, "g"], [t2, "d"]]) await cliquer(p, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(800);
    for(const [p, c] of [[t1, "g"], [t1, "d"], [t2, "g"], [t2, "d"]]){ await cocherTout(p, c); await cliquer(p, /^Je commence la correction$/, c); }
    await pause(2500);
    J.v(etat().ph !== "lecture", H1, "tous prêts : la correction n'a pas commencé seule", JSON.stringify(etat()));
    await capt(tel, "p-attest2-tous");
    J.v(await etatBouton(tel, /Commencer la correction/) === "ouvert", H2, "au téléphone, « ▶️ Commencer la correction » s'ouvre quand tous sont prêts", await etatBouton(tel, /Commencer la correction/));
    await cliquer(tel, /Commencer la correction/); await pause(2500);
    J.v(etat().ph === "lecture", H1 + ", " + H2, "le clic du téléphone lance la correction (deroule.ph = lecture)", JSON.stringify(etat()));
    await capt(tel, "p-corr");
  } catch(e){ J.v(false, "QCM-4 · BANC", "le jeu s'est interrompu : " + e.message); }
  try { await A.nav.close(); } catch(e){}
  const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  fs.writeFileSync(path.join(SORTIE, "reprise2.txt"), "Reprise 2, points 1 à 5, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s\n" + out + "\n");
  console.log(out); process.exit(0);
})();
