// QCM-1 · SOCLE — l'épreuve du socle, sans les écrans : une séance entière jouée par ACT (la console) et ELV (deux tablettes),
// dans plusieurs pages à la fois sur le faux hub ; on vérifie la base (le contrat), les passages du moteur, le chrono qui tient
// au rechargement, et les notes (la règle : la feuille ; « Trouvée au dernier moment » une fois ; annulées, écartées, partis).
// Usage : BANC=<faux hub avec node_modules> APP_FILE=<evaluation-qcm.staging.html> node socle.js
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC);
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const RAC = path.join(__dirname, "..", "..", "..", "..", "..");
const EV = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const TAXO = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "taxonomie-competences.json")));
const PORT = 8600 + Math.floor(Math.random() * 90);
const pause = ms => new Promise(r => setTimeout(r, ms));
let nb = 0, ko = 0; const R = [];
function verif(ok, quoi, detail){ nb++; if(!ok) ko++; R.push((ok ? "  ok     " : "  ÉCHEC  ") + quoi + (!ok && detail !== undefined ? " — " + JSON.stringify(detail).slice(0, 300) : "")); }
(async () => {
  const B = buildTree();
  // des temps courts : la réflexion 2 s, la réponse 3 s ; le décompte 1 s, B 2 s
  const ev = JSON.parse(JSON.stringify(EV)); ev.questions.forEach(q => { q.reflexion = 2; q.reponse = 3; });
  B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: ev});
  B.tree.qcm.settings.durees = {decompte: 1, b: 2};
  B.tree.taxonomie = {competences: TAXO};
  // une séance de la 7.7.1, terminée : sa forme d'avant (phase, qIdx, etat « terminee », reponses, papier, autoevals), sans deroule
  B.tree.classes["3 ANCIENNE"] = {nom: "3 ANCIENNE", niveau: "3e", archivee: false, eleves: ["ABRIAL Julien", "BAUDRY Léa", "CARRÉ Tom"]};
  B.tree.qcm.sessions = {sess_1791000000000: {classeSlug: "3 ANCIENNE", evalId: "essai", date: 1791000000000, phase: "finie", qIdx: 2, etat: "terminee",
    absents: ["yvon_adam"], reponses: {0: {abrial_julien: {choix: [2], ts: 1}}, 1: {abrial_julien: {choix: [1], ts: 2}}, 2: {abrial_julien: {choix: [1], ts: 3}}},
    papier: {baudry_lea: {choix: [[2], [0, 2], [0]], ts: 4}}, autoevals: {abrial_julien: "vert"}}};
  const srv = await startServer(B.tree, PORT, () => {});
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const err = [];
  async function ouvrir(q){ const ctx = await nav.newContext({viewport: {width: 1280, height: 800}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); p.on("pageerror", e => err.push(q + " : " + e.message)); await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q);
    await p.waitForFunction(() => window.LIVE && LIVE.pret, null, {timeout: 15000}); await pause(300); return p; }
  const base = p => srv.store.get("qcm/" + p);
  const code = nom => B.eleves.find(e => e.nomComplet === nom).code;
  const t0 = Date.now();
  try {
    let prof = await ouvrir("?mode=prof");
    // le lancement : les binômes (pas de QCM précédent : l'ordre alphabétique), puis l'appel (Adam absent)
    // la séance de la 7.7.1 se lit avec ce qu'elle a : la tablette de Julien (2 / 3), la recopie de la feuille de Léa (3 / 3)
    const anc = await prof.evaluate(() => ({j: SCN.note("abrial_julien", null, "sess_1791000000000"), l: SCN.note("baudry_lea", null, "sess_1791000000000"), e: SCN.etat("sess_1791000000000"), se: SCN.seance("sess_1791000000000")}));
    verif(anc.j.n === 2 && anc.j.total === 3 && anc.l.n === 2 && anc.e.ph === "fin" && anc.se.fin, "une séance de la 7.7.1 se lit : Julien 2 / 3 (tablette), Léa 2 / 3 (sa feuille recopiée : Q3 fausse), terminée", {j: anc.j.n, l: anc.l && anc.l.n, lst: anc.l && anc.l.st, e: anc.e, fin: anc.se && anc.se.fin});
    const sid = await prof.evaluate(() => ACT.lancerSeance("3 ESSAI", "essai", {}));
    verif(/^sess_/.test(sid) && base("sessionActive/3 ESSAI") === sid, "lancerSeance : la séance et sessionActive", base("sessionActive"));
    const s0 = base("sessions/" + sid);
    verif(s0.etat === "en_cours" && s0.phase === "idle" && s0.deroule.ph === "appel" && s0.evalSnapshot && s0.lancee, "la forme de la 7.7.1 (etat, phase), deroule « appel », l'instantané, lancee", {etat: s0.etat, phase: s0.phase, d: s0.deroule});
    verif(s0.places[1].g === "abrial_julien" && s0.places[1].d === "baudry_lea", "les places : tablette 1, Julien et Léa (ordre alphabétique)", s0.places[1]);
    await prof.evaluate(() => ACT.appelFini(["yvon_adam"]));
    await pause(400);
    const s1 = base("sessions/" + sid);
    verif(s1.deroule.ph === "entree" && Object.values(s1.absents || {}).includes("yvon_adam"), "appelFini : absents, phase « entree »", s1.deroule);
    const seuls = Object.values(s1.places).filter(p => p.seul);
    verif(seuls.length === 0, "Adam absent : son binôme est réapparié avec l'élève seul (25 élèves, 24 présents : aucune moitié vide)", s1.places);
    // finir à une autre heure, puis reprendre : l'appel, l'entrée, « prêt », et la phase gelée recommence au début
    // (ici : avant toute question, la séance reprend en « entree » ; la reprise d'un tour se vérifie plus bas, à Q2)
    // une fenêtre ouverte sur place se ferme par Échap ou « Annuler » sans jamais quitter la page (ni l'historique du navigateur)
    const url0 = prof.url();
    await prof.evaluate(() => navOuvrir("c-depart")); await pause(300); await prof.keyboard.press("Escape"); await pause(300);
    const f1 = await prof.evaluate(() => ({ecran: NAV.ecran, pile: NAV.pile.length}));
    await prof.evaluate(() => navOuvrir("c-terminer")); await pause(300);
    await prof.evaluate(() => { const b = [...document.querySelectorAll(".checkin-overlay button")].find(x => x.textContent.trim() === "Annuler"); if(b) b.click(); }); await pause(300);
    const f2 = await prof.evaluate(() => ({ecran: NAV.ecran, pile: NAV.pile.length}));
    verif(prof.url() === url0 && !f1.ecran && !f2.ecran && base("sessionActive/3 ESSAI") === sid, "Échap et « Annuler » ferment la fenêtre sur place ; la page ne bouge pas, la séance continue", {f1, f2, url: prof.url()});
    // la tablette : l'entrée par le code (empreinte), le rejoins, le code faux
    const tab = await ouvrir("?mode=eleve");
    await tab.evaluate(() => ELV.combien(2));
    let r = await tab.evaluate(c => ELV.entrer("g", c, "julien", "abrial"), code("ABRIAL Julien"));
    verif(r.ok && r.eleve === "abrial_julien" && r.tablette === 1, "ELV.entrer : Julien, par son code (l'empreinte du faux hub)", r);
    r = await tab.evaluate(() => ELV.entrer("d", "9999", "léa", "baudry"));
    verif(!r.ok && r.err === "Ce code ne correspond pas. Vérifie tes 4 chiffres.", "un code faux : le message de la 7.7.1", r);
    r = await tab.evaluate(c => ELV.entrer("d", c, "tom", "carré"), code("CARRÉ Tom"));
    verif(!r.ok && r.rejoins === "abrial_julien" ? false : !r.ok && !!r.rejoins, "Tom à la tablette de Julien : « rejoins » son binôme", r);
    r = await tab.evaluate(c => ELV.entrer("d", c, "léa", "baudry"), code("BAUDRY Léa"));
    verif(r.ok && r.eleve === "baudry_lea" && r.cote === "d", "Léa, dans l'autre moitié", r);
    verif(!!base("sessions/" + sid + "/entres/abrial_julien"), "l'entrée se lit dans la base (entres)");
    await pause(300);
    verif(!!base("presence/3 ESSAI/abrial_julien") && !!base("presence/3 ESSAI/baudry_lea"), "la présence de la 7.7.1 (qcm/presence/<classe>/<élève>)", base("presence"));
    // les attestations : Julien et Léa ; les autres présents sont simulés directement par ELV, avec leur slug
    const presents = await prof.evaluate(() => SCN.presents());
    verif(presents.length === 24, "SCN.presents : 24", presents.length);
    await tab.evaluate(() => { [1, 2, 3, 4, 5, 6, 7, 8].forEach(n => ELV.cocher(1, n, "abrial_julien")); ELV.commencer("abrial_julien", 1); ELV.commencer("baudry_lea", 1); });
    await prof.evaluate(l => Promise.all(l.filter(x => x !== "abrial_julien" && x !== "baudry_lea").map(x => ELV.commencer(x, 1))), presents);
    await pause(1200);
    verif(base("sessions/" + sid + "/deroule/ph") === "pret", "toutes les attestations faites : le moteur passe à « pret »", base("sessions/" + sid + "/deroule"));
    // Q1 : la réflexion, le passage, le 1er tour (gauche), B, le 2e tour, B, close
    await prof.evaluate(() => ACT.lancerQuestion(0));
    await pause(200);
    let d = base("sessions/" + sid + "/deroule");
    verif(d.ph === "reflexion" && d.qi === 0 && d.duree === 2 && base("sessions/" + sid + "/premier/0") === "g", "Q1 lancée : réflexion de 2 s, la gauche commence", d);
    // le chrono tient au rechargement : la tablette se recharge, SCN.reste suit depuis + duree
    await tab.reload(); await tab.waitForFunction(() => window.LIVE && LIVE.pret);
    const reste = await tab.evaluate(() => SCN.reste());
    verif(reste !== null && reste <= 2, "après un rechargement, le chrono reprend où il en est", reste);
    verif(await tab.evaluate(() => ELV.ici().g === "abrial_julien" && ELV.ici().d === "baudry_lea"), "après un rechargement, la tablette garde ses deux élèves", await tab.evaluate(() => ELV.ici()));
    await pause(2600);
    d = base("sessions/" + sid + "/deroule");
    verif(d.ph === "passage" && d.tour === 1 && d.cote === "g" || d.ph === "reponse", "au bout de la réflexion : le passage au 1er tour", d);
    await pause(1200);
    d = base("sessions/" + sid + "/deroule");
    verif(d.ph === "reponse" && d.tour === 1, "puis le 1er tour", d);
    // Julien juste (Rome) ; Léa (droite) ne peut pas répondre au 1er tour
    await tab.evaluate(() => ELV.repondre(0, [2], "abrial_julien"));
    const refus = await tab.evaluate(() => ELV.repondre(0, [2], "baudry_lea"));
    verif(Object.values(base("sessions/" + sid + "/reponses/0/abrial_julien/choix"))[0] === 2 && !base("sessions/" + sid + "/reponses/0/baudry_lea"), "1er tour : la gauche répond, la droite est refusée", refus);
    const rep = base("sessions/" + sid + "/reponses/0/abrial_julien");
    verif(rep.ts && rep.ms && rep.tour === 1, "une réponse a la forme de la 7.7.1 ({choix, ts}), plus tour et ms", rep);
    // les autres de gauche répondent juste
    const gauche = await prof.evaluate(() => SCN.presents().filter(x => SCN.cote(x) === "g" && x !== "abrial_julien"));
    await prof.evaluate(l => Promise.all(l.map(x => ELV.repondre(0, [2], x))), gauche);
    await prof.evaluate(() => ACT.tourSuivant());
    await pause(250);
    d = base("sessions/" + sid + "/deroule");
    verif(d.ph === "reponse" && d.tour === 2 && d.cote === "d" && d.bPour && d.bPour.cote === "g", "⏭️ Tour suivant coupe l'attente : le 2e tour (la droite) commence, la gauche dit B pendant ce temps (bPour)", d);
    verif(await tab.evaluate(() => SCN.doitDireB("abrial_julien") && !SCN.doitDireB("baudry_lea")), "Julien doit dire B, Léa répond");
    await tab.evaluate(() => ELV.direB(0, "oui", "abrial_julien"));
    await pause(200);
    verif(await tab.evaluate(() => !SCN.doitDireB("abrial_julien")), "Julien a dit B : sa moitié ne le demande plus");
    const ordre = await tab.evaluate(() => SCN.ordreChoix("baudry_lea", 0));
    verif(ordre.length === 4 && ordre.join() !== "0,1,2,3", "au 2e tour, les choix sont mélangés", ordre);
    const droite = await prof.evaluate(() => SCN.presents().filter(x => SCN.cote(x) === "d"));
    await prof.evaluate(l => Promise.all(l.map(x => ELV.repondre(0, [2], x))), droite);
    await prof.evaluate(() => ACT.cloreQuestion());
    await pause(250);
    d = base("sessions/" + sid + "/deroule");
    verif(d.ph === "close" && d.bPour && d.bPour.cote === "d", "🔒 Clore coupe l'attente : la question est close, la droite dit B pendant ce temps", d);
    verif(await tab.evaluate(() => SCN.doitDireB("baudry_lea")), "Léa doit dire B (bPour)");
    await tab.evaluate(() => ELV.direB(0, "non", "baudry_lea"));
    let c = await prof.evaluate(() => SCN.compteurs());
    verif(c.question && c.question[0] === 1 && c.repondu && c.repondu[0] === 24, "compteurs : question 1/3, 24 ont répondu", c);
    // Q2 : Julien juste sur la tablette, Léa fausse ; un élève part avant Q2 (Noah) et revient après
    await prof.evaluate(() => ACT.depart("maillard_noah"));
    await prof.evaluate(() => ACT.lancerQuestion(1));
    verif(base("sessions/" + sid + "/premier/1") === "d", "Q2 : la droite commence (on alterne)", base("sessions/" + sid + "/premier"));
    await prof.evaluate(() => ACT.autoriserReponse()); await pause(1500);
    await tab.evaluate(() => ELV.repondre(1, [1], "baudry_lea"));
    await prof.evaluate(() => ACT.tourSuivant()); await pause(300);
    await tab.evaluate(() => ELV.repondre(1, [0, 2], "abrial_julien"));
    await prof.evaluate(() => ACT.cloreQuestion()); await pause(300);
    await prof.evaluate(() => ACT.retour("maillard_noah"));
    // Q3 : Julien juste, Léa fausse ; l'annulation et le remettre
    // la console fermée pendant Q3 : la tablette relaie les temps comptés (la réflexion, puis le passage, au bout de leur temps)
    await prof.evaluate(() => ACT.fixerTemps(2, "reponse", 20)); await pause(200);
    await prof.evaluate(() => ACT.lancerQuestion(2)); await prof.close();
    await pause(2000 + 1500 + 1000 + 1500 + 2500);
    d = base("sessions/" + sid + "/deroule");
    verif(d.ph === "reponse" && d.qi === 2 && d.tour === 1, "la console fermée : la tablette fait passer la réflexion, puis le passage", d);
    prof = await ouvrir("?mode=prof");
    await tab.evaluate(() => ELV.repondre(2, [1], "abrial_julien"));
    await prof.evaluate(() => ACT.tourSuivant()); await pause(300);
    await tab.evaluate(() => ELV.repondre(2, [0], "baudry_lea"));
    await prof.evaluate(() => ACT.cloreQuestion()); await pause(300);
    await prof.evaluate(() => ACT.annuler(2)); verif(JSON.stringify(Object.values(base("sessions/" + sid + "/annulees") || {})) === "[2]", "⚠️ Annuler Q3 : annulees [2]", base("sessions/" + sid + "/annulees"));
    await prof.evaluate(() => ACT.remettre(2)); verif(!base("sessions/" + sid + "/annulees"), "↩️ Remettre : plus d'annulée");
    // l'estimation, la seconde attestation, la correction : l'ordre des plus ratées (Q2 d'abord : seul Julien juste à Q2 parmi ceux qui ont répondu ? on ne le sait que pour eux)
    await prof.evaluate(() => ACT.lancerEstimation());
    await tab.evaluate(() => { ELV.estimer("vert", "abrial_julien"); ELV.estimer("orange", "baudry_lea"); }); await pause(200);
    verif(base("sessions/" + sid + "/autoevals/abrial_julien") === "vert", "l'estimation, au chemin de la 7.7.1 (autoevals)");
    await prof.evaluate(() => ACT.lancerCorrection());
    const oc = Object.values(base("sessions/" + sid + "/ordreCorr") || {});
    verif(oc[0] === 1, "l'ordre de la correction se fixe : Q2 d'abord (la plus ratée)", oc);
    await prof.evaluate(l => Promise.all(l.map(x => ELV.commencer(x, 2))), presents);
    await pause(1000);
    d = base("sessions/" + sid + "/deroule");
    verif(d.ph === "lecture" && d.qi === 1, "toutes les secondes attestations : la lecture de Q2 commence", d);
    // Q2 lue : la feuille de Julien dit Genève (faux) ; celle de Léa, Genève (faux)
    await tab.evaluate(() => { ELV.lire(1, [1], "abrial_julien"); ELV.lire(1, [1], "baudry_lea"); });
    const lu = base("sessions/" + sid + "/lectures/1/abrial_julien");
    verif(lu && lu.par === "baudry_lea" && Object.values(lu.choix)[0] === 1, "la lecture : la feuille de Julien, lue par Léa", lu);
    await prof.evaluate(() => ACT.reveler());
    verif(base("sessions/" + sid + "/trouvee/abrial_julien") === 1 && base("sessions/" + sid + "/trouvee/baudry_lea") === undefined || base("sessions/" + sid + "/trouvee/baudry_lea") === null, "révéler Q2 : Julien « Trouvée au dernier moment », pas Léa", base("sessions/" + sid + "/trouvee"));
    // Q3 puis Q1
    await prof.evaluate(() => ACT.questionSuivante());
    verif(base("sessions/" + sid + "/deroule/qi") === 2, "Question suivante : Q3", base("sessions/" + sid + "/deroule"));
    await tab.evaluate(() => { ELV.lire(2, [1], "abrial_julien"); ELV.lire(2, [0], "baudry_lea"); });
    await prof.evaluate(() => ACT.reveler()); await prof.evaluate(() => ACT.questionSuivante());
    await tab.evaluate(() => { ELV.lire(0, [2], "abrial_julien"); ELV.lire(0, [2], "baudry_lea"); });
    await prof.evaluate(() => ACT.reveler());
    const nJ = await tab.evaluate(() => SCN.note("abrial_julien")), nL = await tab.evaluate(() => SCN.note("baudry_lea"));
    verif(nJ.n === 3 && nJ.total === 3 && nJ.st.join("") === "jtj", "la note de Julien : 3 / 3 (j, t, j)", nJ);
    verif(nL.n === 1 && nL.total === 3 && nL.st.join("") === "jff", "la note de Léa : 1 / 3", nL);
    verif(nJ.comp["c4-culture-01"] && nJ.comp["c4-culture-01"].max === 3, "les compétences comptent les questions", nJ.comp);
    // Noah, parti avant Q2 : Q2 hors de son total
    const nN = await prof.evaluate(() => SCN.note("maillard_noah"));
    verif(nN.st[1] === "x" && nN.total === 2, "Noah, parti pendant Q2 : Q2 pas posée pour lui (x), son total sur 2", nN);
    // l'annulée sort du total
    await prof.evaluate(() => ACT.annuler(2));
    const nJa = await prof.evaluate(() => SCN.note("abrial_julien"));
    verif(nJa.total === 2 && nJa.n === 2, "Q3 annulée : la note de Julien sur 2", nJa);
    await prof.evaluate(() => ACT.remettre(2));
    // la co-évaluation, une alerte, son verdict ; le bilan ; terminer
    await prof.evaluate(() => ACT.questionSuivante());
    verif(base("sessions/" + sid + "/deroule/ph") === "coeval", "après la dernière question : la co-évaluation", base("sessions/" + sid + "/deroule"));
    await tab.evaluate(() => { ELV.coeval("ok", null, null, "abrial_julien"); ELV.coeval("mal", 0, [3], "baudry_lea"); });
    await pause(400);
    const al = base("sessions/" + sid + "/alertes");
    verif(al && Object.keys(al).length === 1, "« ❌ » ouvre une alerte", al);
    const alid = Object.keys(al || {})[0];
    await prof.evaluate(([a]) => ACT.trancher(a, {decision: "feuille", choix: [3], eleve: "baudry_lea"}), [alid]);
    const nL2 = await prof.evaluate(() => SCN.note("baudry_lea"));
    // sa feuille dit Venise, sa tablette Rome : c'est sa question « Trouvée au dernier moment » (la seule de l'évaluation)
    verif(nL2.st[0] === "t" && nL2.n === 1, "l'alerte tranchée « la feuille dit Venise » : Q1 de Léa, feuille fausse et tablette juste, devient « Trouvée au dernier moment »", nL2);
    const lignes = await prof.evaluate(() => SCN.aLire());
    await pause(300);
    const stock = base("sessions/" + sid + "/aLire") || {};
    verif(Array.isArray(lignes) && lignes.every(l => stock[l.id] && stock[l.id].txt === l.txt && stock[l.id].eleveSlug === l.eleveSlug), "« À lire sur les feuilles » : chaque ligne est dans la base (aLire/<id>)", {lignes: lignes.map(l => l.id), stock: Object.keys(stock)});
    await prof.evaluate(() => ACT.retirerAutonomie("foucher_hugo", "heure"));
    verif(await prof.evaluate(() => SCN.autonomie("foucher_hugo").retire), "⛔ le point d'autonomie de Hugo");
    await prof.evaluate(() => ACT.afficherBilan());
    verif(!!base("sessions/" + sid + "/bilanAffiche") && base("sessions/" + sid + "/deroule/ph") === "bilan", "🏁 le bilan affiché");
    // la 7.7.1 lit la séance : phase « finie » au bilan
    verif(base("sessions/" + sid + "/phase") === "finie", "le miroir de la 7.7.1 : phase « finie »", base("sessions/" + sid + "/phase"));
    await prof.evaluate(() => ACT.terminer());
    verif(base("sessions/" + sid + "/etat") === "terminee" && !base("sessionActive/3 ESSAI"), "🛑 Terminer : etat « terminee », plus de séance active");
    await pause(800);
    verif(await tab.evaluate(() => !ELV.ici().g), "la séance terminée : la tablette oublie ses élèves", await tab.evaluate(() => ELV.ici()));
    // le soir : rendre les copies, Mes évaluations
    await prof.evaluate(s => ACT.rendreCopies(s), sid);
    const me = await prof.evaluate(() => SCN.mesEvaluations("abrial_julien", null, "3 ESSAI"));
    const me1 = me.filter(x => x.seance === sid)[0];
    verif(me1 && me1.etat === "bilan" && me1.note.n === 3, "Mes évaluations : la copie rendue, 3 / 3", me);
    // chez lui, sans séance : l'élève entre par son code sur une demi-tablette, puis voit sa moitié avec « 📊 Mes évaluations »
    const maison = await ouvrir("?mode=eleve");
    await maison.evaluate(() => ELV.choisirClasse("3 ESSAI")); await pause(300);
    const r2 = await maison.evaluate(c => ELV.entrer("g", c, "julien", "abrial"), code("ABRIAL Julien")); await pause(500);
    const tm = (await maison.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");
    verif(r2.ok && /Mes évaluations/.test(tm) && /ABRIAL JULIEN|ABRIAL Julien/i.test(tm), "chez lui, sans séance : son code, puis sa moitié avec « 📊 Mes évaluations »", {r2, tm: tm.slice(0, 200)});
    // deux séances actives (celle d'hier restée ouverte, celle de ce matin) : la console pilote la plus récente ; le badge dit « 2 séances en cours »
    const vieille = await prof.evaluate(() => ACT.lancerSeance("3 ANCIENNE", "essai", {})); await pause(50);
    const neuve = await prof.evaluate(() => ACT.lancerSeance("3 ESSAI", "essai", {})); await pause(500);
    const p2 = await ouvrir("?mode=prof"); await pause(600);
    const vu2 = await p2.evaluate(() => ({sid: SCN.sid(), n: SCN.seancesActives().length, badge: (document.body.innerText.match(/\d+ séances? en cours/) || [""])[0]}));
    verif(vu2.sid === neuve && vu2.n === 2 && vu2.badge === "2 séances en cours", "deux séances actives : la console pilote la plus récente ; « 🔴 2 séances en cours »", vu2);
    await p2.evaluate(v => ACT.terminer(v), vieille); await pause(300);
    verif(!base("sessionActive/3 ANCIENNE") && base("sessionActive/3 ESSAI") === neuve, "« 🛑 Terminer » la séance d'hier, depuis la liste : celle de ce matin continue", base("sessionActive"));
    await p2.evaluate(v => ACT.terminer(v), neuve); await pause(200);
    // Q2 gelée au 2e tour, finie à une autre heure : la séance quitte sessionActive ; reprise, appel, puis « ▶️ Reprendre » : le 2e tour recommence au début
    const sid3 = await p2.evaluate(() => ACT.lancerSeance("3 ESSAI", "essai", {})); await p2.evaluate(() => ACT.appelFini(["yvon_adam"])); await pause(300);
    await p2.evaluate(() => ACT.lancerQuestion(1)); await p2.evaluate(() => ACT.autoriserReponse()); await p2.evaluate(() => ACT.tourSuivant()); await pause(200);
    await p2.evaluate(() => ACT.finirAutreHeure()); await pause(300);
    const g1 = base("sessions/" + sid3 + "/deroule");
    verif(g1.ph === "pause" && g1.autreHeure && g1.reprise.ph === "reponse" && g1.reprise.tour === 2 && !base("sessionActive/3 ESSAI"), "⏸️ Finir à une autre heure : la séance gelée (Q2, 2e tour), hors de sessionActive", g1);
    await p2.evaluate(s => ACT.lancerSeance(null, null, {reprise:s}), sid3); await pause(300);
    await p2.evaluate(() => ACT.appelFini(["yvon_adam"])); await pause(1500);
    const g2 = base("sessions/" + sid3 + "/deroule");
    verif(base("sessionActive/3 ESSAI") === sid3 && (g2.ph === "pret" || g2.ph === "entree") && g2.reprise && g2.reprise.tour === 2, "la reprise : l'appel, puis « prêt », la phase gelée gardée (reprise)", g2);
    await p2.evaluate(() => ACT.reprendre()); await pause(200);
    const g3 = base("sessions/" + sid3 + "/deroule");
    verif(g3.ph === "reponse" && g3.qi === 1 && g3.tour === 2 && g3.cote === g1.reprise.cote && g3.duree === 3, "« ▶️ Reprendre » : le 2e tour de Q2 recommence au début (la même moitié, 3 s)", {g3, avant: g1.reprise});
    await p2.evaluate(() => ACT.cloreQuestion()); await pause(200);
    await p2.evaluate(s => ACT.terminer(s), sid3);
    // la séance sur papier : l'appel, les énoncés ; « Feuilles ramassées » ; la grille du soir ; la reprise : l'appel, l'estimation, la seconde attestation, la correction d'après la grille
    const sp = await p2.evaluate(() => ACT.lancerSeance("3 ESSAI", "essai", {mode:"papier"})); await p2.evaluate(() => ACT.appelFini(["yvon_adam"])); await pause(300);
    verif(base("sessions/" + sp + "/deroule/ph") === "papier" && base("sessions/" + sp + "/lancee/mode") === "papier", "sur papier : après l'appel, la séance sur papier (ph « papier »)", base("sessions/" + sp + "/deroule"));
    await p2.evaluate(() => ACT.finirAutreHeure()); await pause(200);
    await p2.evaluate(s => Promise.all([["abrial_julien", ["j", "f", "j"]], ["baudry_lea", ["j", "j", "f"]]].map(([x, g]) => Promise.all(g.map((v, i) => ACT.grillePapier(x, i, v, s))))), sp); await pause(200);
    await p2.evaluate(s => ACT.lancerSeance(null, null, {reprise:s}), sp); await pause(200); await p2.evaluate(() => ACT.appelFini(["yvon_adam"])); await pause(300);
    verif(base("sessions/" + sp + "/deroule/ph") === "estim", "la reprise d'un papier : l'appel, puis l'estimation", base("sessions/" + sp + "/deroule"));
    await p2.evaluate(() => ACT.lancerCorrection()); await pause(200);
    const ocp = Object.values(base("sessions/" + sp + "/ordreCorr") || {});
    verif(ocp.length === 3 && ocp[0] !== 0, "l'ordre de la correction sur papier : les erreurs de la grille (Q1 juste pour les deux, en dernier)", ocp);
    const np = await p2.evaluate(s => SCN.note("abrial_julien", null, s), sp);
    verif(np && np.n === 2 && np.st.join("") === "jfj" && np.trouvee == null, "sur papier, la note est la grille (Julien 2 / 3), jamais « Trouvée au dernier moment »", np);
    await p2.evaluate(s => ACT.terminer(s), sp); await pause(200);
    // la séance suivante : les binômes d'après ce QCM précédent (classement de la note)
    const bp = await prof.evaluate(() => SCN.binomesProposes("3 ESSAI"));
    verif(bp[0][0] === "abrial_julien" && bp.length === 13, "les binômes suivants se forment sur le classement du QCM précédent (Julien, 3 / 3, en tête)", bp.slice(0, 3));
    verif(err.length === 0, "aucune erreur de page", err.slice(0, 3));
  } catch(e){ verif(false, "l'essai s'est arrêté", e.stack); }
  await nav.close(); await srv.close();
  console.log("Épreuve du socle — " + Math.round((Date.now() - t0) / 1000) + " s · " + nb + " vérifications · " + ko + " échecs\n" + R.join("\n"));
  process.exit(ko ? 1 : 0);
})();
