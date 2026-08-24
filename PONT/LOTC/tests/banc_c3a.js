/* BANC LOT C3a — cinq points, hub SIMULÉ en mémoire (aucune écriture ne sort).
   Usage : node banc_c3a.js <fichier.html> <etiquette> */
const c = require('@sparticuz/chromium'); const chromium = c.default || c;
const puppeteer = require('puppeteer-core');
const path = require('path'), fs = require('fs');

const FICHIER = process.argv[2] || 'c3a-index.html';
const TAG     = process.argv[3] || 'candidat';
const URL     = 'file://' + path.resolve(FICHIER) + '?n=3e';

const TRAME = [
  {act:"Rituel d'entrée",h:"10:07",dur:4,comp:[],blocs:[
    {t:"consigne",pic:"📕",txt:"Ouvrez le cahier à la dernière page collée.",etapes:["Relisez votre point de vigilance.","Gardez la page ouverte."],vues:0}]},
  {act:"Mise en commun",h:"10:11",dur:8,comp:[],blocs:[
    {t:"consigne",pic:"🎯",txt:"On met en commun les réponses de l'interro de cours, une par une, en justifiant à chaque fois par une citation précise du texte étudié la semaine dernière.",
     etapes:["Première réponse : la nature du mot souligné, et sa fonction dans la phrase.",
             "Deuxième réponse : l'effet produit par l'enjambement du vers trois sur la lecture.",
             "Troisième réponse : le registre dominant, et les deux marques qui le signalent.",
             "Quatrième réponse : la figure de style de la dernière strophe, nommée et expliquée.",
             "Cinquième réponse : ce que le poème dit du regard du poète sur la ville moderne.",
             "Sixième réponse : la relation entre le titre du recueil et ce poème en particulier."],vues:0},
    {t:"question",q:"Question 2 — Quel effet produit l'enjambement du vers 3 ?",reps:[
      {i:"GA",r:"Ça met en valeur « Fugitive beauté », parce que le mot passe à la ligne.",refo:false},
      {i:"MX",r:"Le rejet ralentit la lecture : on s'arrête sur le groupe mis en avant.",refo:true},
      {i:"",r:"",refo:false}],vues:0}]},
  {act:"Notion",h:"10:19",dur:8,comp:[],blocs:[
    {t:"consigne",pic:"✂️",txt:"Collez la fiche notion après la page du sonnet.",etapes:["Découpez au trait pointillé."],vues:0}]},
  {act:"Travail individuel",h:"10:27",dur:6,comp:[],blocs:[
    {t:"consigne",pic:"✍🏻",txt:"Analyse logique : exercice en autonomie.",etapes:["Phrases 1 à 4 sur le cahier."],vues:0}]}
];

const AMORCE = (trame) => {
  /* ── hub SIMULÉ : les GET sont servis en mémoire, les écritures rangées et COMPTÉES,
        jamais transmises. Garde contre le double enveloppement (le cadre rejoue le script). */
  if (window.__hubPose) return; window.__hubPose = true;
  window.__HUB = {}; window.__ECR = { nonGET: 0, sorties: 0, detail: [] };
  const estHub = (u) => String(u).indexOf('firebasedatabase.app') >= 0;
  const chemin = (u) => { let m = String(u).match(/firebasedatabase\.app\/(.*?)(\?|$)/); return m ? m[1] : ''; };
  const lire = (ch) => {
    let p = ch.replace(/\.json$/, '').split('/').filter(Boolean), n = window.__HUB;
    for (const k of p) { if (n === null || n === undefined || typeof n !== 'object') return null; n = n[k]; }
    return (n === undefined) ? null : n;
  };
  const ecrire = (ch, v) => {
    let p = ch.replace(/\.json$/, '').split('/').filter(Boolean), n = window.__HUB;
    for (let i = 0; i < p.length - 1; i++) { if (typeof n[p[i]] !== 'object' || n[p[i]] === null) n[p[i]] = {}; n = n[p[i]]; }
    if (v === null) delete n[p[p.length - 1]]; else n[p[p.length - 1]] = v;
  };
  const vrai = window.fetch.bind(window);
  window.fetch = function (u, o) {
    const url = (u && u.url) ? u.url : String(u);
    const meth = ((o && o.method) || 'GET').toUpperCase();
    if (estHub(url)) {
      if (meth !== 'GET') {
        window.__ECR.nonGET++; window.__ECR.detail.push(meth + ' ' + chemin(url));
        let v = null; try { v = o && o.body ? JSON.parse(o.body) : null; } catch (e) {}
        ecrire(chemin(url), meth === 'DELETE' ? null : v);
        return Promise.resolve(new Response('null', { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return Promise.resolve(new Response(JSON.stringify(lire(chemin(url))), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return vrai(u, o);
  };
  window.__TRAME = trame;
};

const dormir = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await puppeteer.launch({
    args: [...chromium.args, '--disable-popup-blocking'],
    executablePath: await chromium.executablePath(),
    headless: 'shell', defaultViewport: { width: 1450, height: 950 }
  });
  const R = { etiquette: TAG, fichier: FICHIER };
  const page = await b.newPage();
  page.on('dialog', d => d.dismiss().catch(() => {}));
  const erreurs = []; page.on('pageerror', e => erreurs.push(String(e).slice(0, 140)));
  await page.evaluateOnNewDocument(AMORCE, TRAME);
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await dormir(900);

  /* entrée prof, puis MONTAGE DIRECT du cadre du déroulé (mêmes portes que le site :
     _drAssurerCadre + _drNormaliserTrame), rendu VISIBLE et dimensionné — sans quoi le
     moteur ne peut pas mesurer le débordement, donc jamais scinder. */
  await page.evaluate((trame) => {
    document.body.classList.add('admin-mode');
    try { SECU.valide = true; } catch (e) {}
    const g = document.getElementById('page-validation'); if (g) g.style.display = 'none';
    document.querySelectorAll('.at-bandeau-invalide,.lien-invalide').forEach(x => x.style.display = 'none');
    try { loadPublished('3e'); } catch (e) {}
    try {
      window.classesData = window.classesData || {};
      classesData['c3a'] = { nom: '3e Aretha Franklin', niveau: '3e', eleves: {} };
      classesData['c3b'] = { nom: '3e Bob Dylan', niveau: '3e', eleves: {} };
    } catch (e) {}
    chapitresData['3e'] = chapitresData['3e'] || {};
    chapitresData['3e']['10'] = { title: 'Chapitre 1 — Poésie et peinture', seances: {
      '1': { title: 'Séance 3', deroule: { ecrans: JSON.parse(JSON.stringify(trame)) } } } };
    try { AT.edChap = { level: '3e', chnum: '10' }; } catch (e) {}
    try { ATVUES.snum = '1'; } catch (e) {}
    try { AT_PONT.ctx = { level: '3e', chnum: '10', snum: '1' }; } catch (e) {}
    _drAssurerCadre();
  }, TRAME);
  await dormir(1800);
  await page.evaluate((trame) => {
    const f = document.getElementById('at-dr-iframe');
    if (f) { f.style.display = 'block'; f.style.width = '100%'; f.style.height = '82vh';
      f.style.opacity = '1'; f.style.visibility = 'visible'; f.style.border = '0';
      document.body.appendChild(f); }
    try {
      const W = drWin();
      W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
      W.__pontCharge = true; W.i = 0; W.rendre();
    } catch (e) { window.__monteErr = String(e); }
  }, TRAME);
  await dormir(1200);

  /* recharge de la trame : le cadre repart d'un état connu avant chaque mesure */
  const charger = () => page.evaluate((trame) => {
    const W = drWin();
    W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
    W.__pontCharge = true; W.i = 0; W.iz = 1; W.rendre();
    return W.ECRANS.length;
  }, TRAME);
  const etat = () => page.evaluate(() => {
    try { const W = drWin();
      return { total: W.ECRANS.length, suites: W.ECRANS.filter(e => e && e.suite).length, i: W.i }; }
    catch (e) { return { err: String(e) } }
  });

  R.cadrePret = await page.evaluate(() => { try { return !!(drWin() && drWin().ECRANS); } catch (e) { return false; } });
  R.ecransCharges = await charger();
  R.monteErr = await page.evaluate(() => window.__monteErr || null);

  /* ═══ ⓪ ÉQUIVALENCE DE LA CLÉ (la fonction a rétréci par EXTRACTION, pas par perte) ═══ */
  R.cle = await page.evaluate(() => {
    try {
      AT_DR_COURS = { debut: '10:14', fin: '11:02', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
      const k = _drCleHeure(), cr = _drCreneauHeure();
      const k2 = _drCleHeureDe({ classeSlug: 'c3a', debut: '10:14', fin: '11:02' });
      AT_DR_COURS = null;
      return { cle: k, creneau: cr, memeCleParLesDeuxChemins: k === k2 };
    } catch (e) { return { err: String(e) } }
  });

  /* ═══ ⑤ DUPLICATION — l'identité est posée AU GESTE ═══ */
  await charger();
  R.dup = await page.evaluate(() => {
    try {
      const W = drWin();
      _drIdentifierEcrans(W.ECRANS);
      const origEid = W.ECRANS[1].eid;
      const nAvant = W.ECRANS.length;
      W.ctxEcran = 1; W.ctxDup();
      const ids = W.ECRANS.map(e => e.eid).filter(Boolean);
      const copie = W.ECRANS[2];
      return {
        nAvant: nAvant, nApres: W.ECRANS.length,
        identites: ids.length, doublons: ids.length - new Set(ids).size,
        originalGardeLaSienne: W.ECRANS[1].eid === origEid,
        copiePorteUneIdentiteNEUVE: !!(copie && copie.eid && copie.eid !== origEid),
        copieDevoilementAZero: !!(copie && copie.rev === 0 && copie.blocs.every(b => !b.vues)),
        copieFragmentEfface: !!(copie && copie.blocs.every(b => !b.frag)),
        copieIdsDeBlocsDistincts: !!(copie && copie.blocs.every((b, j) => b.id !== W.ECRANS[1].blocs[j].id))
      };
    } catch (e) { return { err: String(e) } }
  });

  /* ═══ ③ REDIMENSIONNEMENT — réduire crée un fils, remettre en grand doit le tuer ═══ */
  await charger();
  await page.evaluate(() => {           /* Paul est sur son écran chargé, tout dévoilé */
    const W = drWin(); W.i = 1; const e = W.ECRANS[1];
    e.rev = e.blocs.length + 1; e.blocs.forEach(b => { b.vues = 99; });
    W.rendre();
  });
  await dormir(500);
  R.resize = { grandAvant: await etat() };
  await page.setViewport({ width: 700, height: 520 });    /* l'écran partagé en deux */
  await dormir(1500);
  R.resize.reduit = await etat();
  await page.setViewport({ width: 1450, height: 950 });   /* on remet en grand */
  await dormir(2000);
  R.resize.reGrandApres = await etat();
  /* la preuve n'est pas « zéro suite » (le contenu peut légitimement déborder même en
     grand) mais « la suite NÉE DE LA RÉDUCTION est morte » : on revient à l'état d'avant. */
  R.resize.filsNesDeLaReduction = (R.resize.reduit.suites || 0) - (R.resize.grandAvant.suites || 0);
  R.resize.filsSurvivantApresRetour = (R.resize.reGrandApres.suites || 0) - (R.resize.grandAvant.suites || 0);

  /* ═══ ④ LE TABLEAU ET LE MORCEAU ═══ */
  await charger();
  await page.evaluate(() => {
    const W = drWin(); W.i = 1; const e = W.ECRANS[1];
    e.rev = e.blocs.length + 1; e.blocs.forEach(b => { b.vues = 99; }); W.rendre();
  });
  await page.setViewport({ width: 700, height: 520 });
  await dormir(1600);
  R.quatre = await page.evaluate(() => {
    try {
      const W = drWin();
      const iFils = W.ECRANS.findIndex(e => e && e.suite);
      if (iFils < 0) return { pasDeFils: true, total: W.ECRANS.length };
      W.i = iFils;                       /* LE PILOTE EST SUR LE FILS */
      const f = W.ECRANS[iFils]; f.rev = 2;   /* il n'a dévoilé QUE l'en-tête hérité */
      f.blocs.forEach(b => { b.vues = 0; });
      W.rendre();
      const pere = W.ECRANS[iFils - 1];
      AT_DR_REGIME = 'classe';
      AT_DR_COURS = { debut: '10:07', fin: '11:02', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
      SES.ctx = { niveau: '3e', chapitre: '10', seance: '1', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
      const p = sesPhoto();
      const blocsEntier = pere.blocs.length + f.blocs.length;
      return {
        totalPilote: W.ECRANS.length, iFils: iFils, morceauEmis: p.morceau,
        eidEmis: p.eid, eidDuPere: pere.eid || null, memeIdentite: p.eid === (pere.eid || null),
        revEmis: p.rev, revDuFilsBrut: f.rev,
        blocsDuPereTronque: pere.blocs.length, blocsDuPereEntier: blocsEntier,
        revSiOnAvaitEmisToutLEcran: blocsEntier + 1,
        neDevoilePasToutLEcran: p.rev < blocsEntier + 1,
        vuesEmises: p.vues, photo: JSON.parse(JSON.stringify(p))
      };
    } catch (e) { return { err: String(e) } }
  });
  const scene = (R.quatre && R.quatre.photo) ? R.quatre.photo : null;
  const trameJouee = await page.evaluate(() => { try { return DR.dr_exporterTrame(); } catch (e) { return null; } });

  /* ═══ ④ bis : TROIS PAGES — la vue tableau applique la photo ═══ */
  if (scene && trameJouee) {
    for (const vue of ['tableau', 'tel']) {
      const q = await b.newPage();
      q.on('dialog', d => d.dismiss().catch(() => {}));
      await q.evaluateOnNewDocument(AMORCE, TRAME);
      await q.evaluateOnNewDocument((sc, tr) => { window.__PRE = { scene: sc, trame: tr }; }, scene, trameJouee);
      await q.goto('file://' + path.resolve(FICHIER) + '?n=3e&vue=' + vue, { waitUntil: 'domcontentloaded' });
      await dormir(500);
      await q.evaluate(() => {
        const c = { niveau: '3e', chapitre: '10', seance: '1', classeSlug: 'c3a',
          classeNom: '3e Aretha Franklin', debut: '10:07', fin: '11:02', ts: Date.now() };
        window.__HUB.site = { cours_actif: c, '3e': { chapitres: { '10': { seances: { '1': { deroule_joue: { c3a: {
          ecrans: window.__PRE.trame, scene: window.__PRE.scene, part: {} } } } } } } } };
      });
      await dormir(2500);
      /* le montage passe normalement par un poll de 2 s ; on l'appelle par SES PROPRES
         fonctions pour ne pas dépendre du minutage du banc — mêmes chemins que le site. */
      await q.evaluate(() => {
        try {
          SES.ctx = { niveau: '3e', chapitre: '10', seance: '1', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
          SES.tabPointeur = (typeof sesTabCle === 'function') ? sesTabCle(SES.ctx) : '';
          if (typeof sesTabMonter === 'function') sesTabMonter();
        } catch (e) { window.__tabErr = String(e); }
      });
      await dormir(4500);
      await q.evaluate(() => { try { if (typeof sesTabPoll === 'function') sesTabPoll(); } catch (e) {} });
      await dormir(1200);
      const mesure = await q.evaluate((v) => {
        try {
          const W = drWin();
          const o = { vue: v, cadre: !!W, ecrans: W ? W.ECRANS.length : 0, i: W ? W.i : null,
            rev: (W && W.ECRANS[W.i]) ? W.ECRANS[W.i].rev : null,
            eidLocal: (W && W.ECRANS[W.i]) ? (W.ECRANS[W.i].eid || null) : null,
            suites: W ? W.ECRANS.filter(e => e && e.suite).length : 0,
            ecrituresSorties: window.__ECR.nonGET, tabErr: window.__tabErr || null };
          const t = document.getElementById('ses-tab-toile');
          const D = t && t.contentDocument, z = D && D.getElementById('t');
          o.texteProjete = z ? z.innerText.replace(/\s+/g, ' ').trim() : null;
          return o;
        } catch (e) { return { vue: v, err: String(e) } }
      }, vue);
      R['vue_' + vue] = mesure;
      await q.screenshot({ path: 'tests/c3a-' + TAG + '-' + vue + '.png' }).catch(() => {});
      await q.close();
    }
  }
  await page.setViewport({ width: 1450, height: 950 });
  await dormir(600);

  /* ═══ ① ET ② ENCHAÎNEMENT DE DEUX CLASSES ═══ */
  R.enchainement = await page.evaluate(async () => {
    const attendre = (ms) => new Promise(r => setTimeout(r, ms));
    const out = {};
    try {
      /* la 3e tourne : pointeur posé, trace ouverte */
      AT_DR_REGIME = 'classe';
      AT_DR_COURS = { debut: '10:07', fin: '11:02', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
      ATVUES.snum = '1';
      sesCoursEcrire();
      atVecuDemarrer();
      await attendre(1200);
      out.pointeurApresLancement1 = !!(window.__HUB.site && window.__HUB.site.cours_actif);
      out.classe1 = window.__HUB.site.cours_actif && window.__HUB.site.cours_actif.classeSlug;
      const cle1 = _drCleHeure();
      out.cle1 = cle1;

      /* Paul enchaîne la 4e SANS clore : le site clôt l'ancienne heure */
      const c1 = JSON.parse(JSON.stringify(window.__HUB.site.cours_actif));
      _drCloreHeureRestee('c3b', '3e Bob Dylan');
      await attendre(900);
      const h1 = window.__HUB.site['3e'].chapitres['10'].seances['1'].deroule_joue['c3a'].heures[cle1];
      out.trace1Close = !!(h1 && h1.clos === true);
      out.pointeurEfface = !(window.__HUB.site.cours_actif);

      /* puis le cours neuf s'annonce */
      AT_DR_COURS = { debut: '11:04', fin: '11:59', classeSlug: 'c3b', classeNom: '3e Bob Dylan' };
      sesCoursEcrire();
      await attendre(600);
      out.pointeurApresLancement2 = window.__HUB.site.cours_actif && window.__HUB.site.cours_actif.classeSlug;

      /* ② la bannière : elle propose ENCORE la 3e ? on la met dans l'état du constat */
      SES.actif = false;
      SES._reprise = c1;                       /* ce que la bannière portait */
      sesReprisePeindre ? sesReprisePeindre(c1) : null;
      out.banniereAvant = !!document.getElementById('ses-reprise');
      /* on tente de reprendre l'heure CLOSE */
      sesReprendre();
      await attendre(900);
      out.reprisePossible = (AT_DR_COURS && AT_DR_COURS.classeSlug === 'c3a');
      out.banniereApresTentative = !!document.getElementById('ses-reprise');
      out.classeCouranteApres = AT_DR_COURS && AT_DR_COURS.classeSlug;

      /* la veille de la bannière : elle se retire d'elle-même (heure close / autre cours) */
      SES._reprise = c1; sesReprisePeindre(c1);
      const avantVeille = !!document.getElementById('ses-reprise');
      await new Promise(r => {
        _drHeureCloseAu(c1, function (close) { out.veilleVoitClose = close; if (close) sesRepriseRetirer(); r(); });
      });
      out.banniereAvantVeille = avantVeille;
      out.banniereApresVeille = !!document.getElementById('ses-reprise');
      return out;
    } catch (e) { out.err = String(e); return out; }
  });

  /* ═══ clôture VOLONTAIRE : le pointeur suit ═══
     (atDrCloreFin enchaîne atVecuEcrire — qui scelle `clos:true`, corps INTOUCHÉ — puis
     sesCoursFermer, qui retire le pointeur. On éprouve ici le geste du pointeur.) */
  R.clotureVolontaire = await page.evaluate(async () => {
    const attendre = (ms) => new Promise(r => setTimeout(r, ms));
    const out = {};
    try {
      AT_DR_REGIME = 'classe'; ATVUES.snum = '1';
      AT_DR_COURS = { debut: '11:04', fin: '11:59', classeSlug: 'c3b', classeNom: '3e Bob Dylan' };
      SES.ctx = null;
      sesCoursEcrire();
      await attendre(700);
      out.pointeurAvant = !!(window.__HUB.site && window.__HUB.site.cours_actif);
      out.classeDesignee = window.__HUB.site.cours_actif && window.__HUB.site.cours_actif.classeSlug;
      sesCoursFermer();
      await attendre(700);
      out.pointeurApres = !!(window.__HUB.site && window.__HUB.site.cours_actif);
      /* et plus rien à reprendre : la veille de la bannière ne trouve aucun cours */
      out.veilleTrouveUnCours = await new Promise(r => {
        sesGet(FIREBASE_BASE + '/site/cours_actif.json', v => r(!!(v && v.ts)));
      });
      return out;
    } catch (e) { out.err = String(e); return out; }
  });

  R.ecritures = await page.evaluate(() => ({ nonGETsimulees: window.__ECR.nonGET, sortiesReelles: window.__ECR.sorties }));
  R.pageerrors = erreurs;

  await page.screenshot({ path: 'tests/c3a-' + TAG + '.png' }).catch(() => {});
  await b.close();
  fs.mkdirSync('tests', { recursive: true });
  fs.writeFileSync('tests/c3a-' + TAG + '.json', JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
})();
