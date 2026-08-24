/* BANC LOT TABLEAU-ÉCRITURE — pilote + ?vue=tableau, hub PARTAGÉ en mémoire côté Node.
   Aucune écriture ne sort : tout non-GET est intercepté, rangé, compté.
   Usage : node banc_te.js <fichier.html> <etiquette> */
const c = require('@sparticuz/chromium'); const chromium = c.default || c;
const puppeteer = require('puppeteer-core');
const path = require('path'), fs = require('fs');

const FICHIER = process.argv[2] || 'te-index.html';
const TAG = process.argv[3] || 'candidat';
const BASE = 'file://' + path.resolve(FICHIER);

/* ── le hub, un seul pour les deux pages ── */
const HUB = {}; const ECR = { nonGET: 0, sorties: 0, detail: [] };
const chemins = (ch) => ch.replace(/\.json$/, '').split('/').filter(Boolean);
function hubGet(ch) {
  let n = HUB; for (const k of chemins(ch)) {
    if (n === null || n === undefined || typeof n !== 'object') return null; n = n[k];
  } return (n === undefined) ? null : n;
}
function hubPut(ch, v, meth) {
  ECR.nonGET++; ECR.detail.push(meth + ' ' + ch);
  const p = chemins(ch); let n = HUB;
  for (let i = 0; i < p.length - 1; i++) { if (typeof n[p[i]] !== 'object' || n[p[i]] === null) n[p[i]] = {}; n = n[p[i]]; }
  if (v === null || meth === 'DELETE') delete n[p[p.length - 1]]; else n[p[p.length - 1]] = v;
  return true;
}

const AMORCE = () => {
  if (window.__hubPose) return; window.__hubPose = true;
  const est = (u) => String(u).indexOf('firebasedatabase.app') >= 0;
  const ch = (u) => { const m = String(u).match(/firebasedatabase\.app\/(.*?)(\?|$)/); return m ? m[1] : ''; };
  const vrai = window.fetch.bind(window);
  window.fetch = function (u, o) {
    const url = (u && u.url) ? u.url : String(u);
    const meth = ((o && o.method) || 'GET').toUpperCase();
    if (est(url)) {
      if (meth !== 'GET') {
        let v = null; try { v = o && o.body ? JSON.parse(o.body) : null; } catch (e) {}
        return window.__hubPut(ch(url), v, meth)
          .then(() => new Response('null', { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return window.__hubGet(ch(url))
        .then(v => new Response(JSON.stringify(v === undefined ? null : v), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return vrai(u, o);
  };
};

const TRAME = [
  { act: "Rituel d'entrée", h: "10:07", dur: 4, comp: [], blocs: [
    { t: "consigne", pic: "📕", txt: "Ouvrez le cahier à la dernière page collée.", etapes: ["Relisez votre point de vigilance."], vues: 0 }] },
  { act: "Mise en commun", h: "10:11", dur: 8, comp: [], blocs: [
    { t: "question", q: "Question 2 — Quel effet produit l'enjambement du vers 3 ?", reps: [
      { i: "EB", r: "Ça met en valeur le mot rejeté.", refo: false },
      { i: "", r: "", refo: false }], vues: 2 }] },
  { act: "Notion", h: "10:19", dur: 8, comp: [], blocs: [
    { t: "fiche", tt: "Fiche notion · Chapitre 1", titre: "Les registres", def: "L'ambiance générale d'un texte.",
      corps: "<div class=\"f-entete\"><div class=\"f-titre\">Les registres</div></div><div class=\"f-bloc\">Le lyrique exprime les sentiments.</div><div class=\"f-bloc\">L'épique amplifie et grandit.</div><div class=\"f-pied\"><span>MJPC</span></div>", vues: 0 }] },
  { act: "Travail individuel", h: "10:27", dur: 6, comp: [], blocs: [
    { t: "consigne", pic: "✍🏻", txt: "Analyse logique : exercice en autonomie.", etapes: ["Phrases 1 à 4 sur le cahier."], vues: 0 }] }
];

const LONG = "Le poète regarde la ville qui passe et il retient de cette passante un éclat très bref mais qui suffit à changer le regard qu il porte sur la foule entière et sur lui même ";

const dormir = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await puppeteer.launch({
    args: [...chromium.args, '--disable-popup-blocking'],
    executablePath: await chromium.executablePath(),
    headless: 'shell', defaultViewport: { width: 1450, height: 950 }
  });
  const R = { etiquette: TAG, fichier: FICHIER };
  const erreurs = [];

  const preparer = async (p) => {
    p.on('dialog', d => d.dismiss().catch(() => {}));
    p.on('pageerror', e => erreurs.push(String(e).slice(0, 140)));
    await p.exposeFunction('__hubGet', async (ch) => hubGet(ch));
    await p.exposeFunction('__hubPut', async (ch, v, m) => hubPut(ch, v, m));
    await p.evaluateOnNewDocument(AMORCE);
  };

  /* ── LE PILOTE ── */
  const pil = await b.newPage(); await preparer(pil);
  await pil.goto(BASE + '?n=3e', { waitUntil: 'domcontentloaded' });
  await dormir(900);
  await pil.evaluate((trame) => {
    document.body.classList.add('admin-mode');
    try { SECU.valide = true; } catch (e) {}
    const g = document.getElementById('page-validation'); if (g) g.style.display = 'none';
    try { loadPublished('3e'); } catch (e) {}
    try { window.classesData = window.classesData || {};
      classesData['c3a'] = { nom: '3e Aretha Franklin', niveau: '3e', eleves: {} }; } catch (e) {}
    chapitresData['3e'] = chapitresData['3e'] || {};
    chapitresData['3e']['10'] = { title: 'Chapitre 1', seances: {
      '1': { title: 'Séance 3', deroule: { ecrans: JSON.parse(JSON.stringify(trame)) } } } };
    try { AT.edChap = { level: '3e', chnum: '10' }; ATVUES.snum = '1';
      AT_PONT.ctx = { level: '3e', chnum: '10', snum: '1' }; } catch (e) {}
    _drAssurerCadre();
  }, TRAME);
  /* on attend que le cadre réponde, plutôt que de parier sur une durée */
  await pil.waitForFunction(() => { try { return typeof drWin().rendre === 'function'; } catch (e) { return false; } },
    { timeout: 30000, polling: 300 });
  await dormir(400);
  await pil.evaluate((trame) => {
    /* ⚠ on ne DÉPLACE PAS l'iframe : une iframe détachée puis rattachée perd son contenu
       (piège consigné dans le code du site). On rend visibles ses parents, sur place. */
    const f = document.getElementById('at-dr-iframe');
    if (f) {
      f.style.display = 'block'; f.style.width = '1200px'; f.style.height = '760px';
      f.style.opacity = '1'; f.style.visibility = 'visible'; f.style.border = '0';
      f.style.position = 'fixed'; f.style.left = '0'; f.style.top = '0'; f.style.zIndex = '9999';
      let n = f.parentElement;
      while (n && n !== document.body) {
        n.style.display = 'block'; n.style.opacity = '1'; n.style.visibility = 'visible';
        n.classList.remove('cache'); n = n.parentElement;
      }
    }
    const W = drWin();
    W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
    W.__pontCharge = true; W.i = 1; W.iz = 1;
    const r = W.document.getElementById('rz'); if (r) r.value = '1';
    W.ECRANS[1].rev = 2;                 /* Paul a dévoilé la question : le mur la montre */
    W.rendre();
    /* la séance est jouée : la copie au fil de l'eau et la session ont leur contexte
       (on repose la structure : loadPublished a pu la reconstruire entre-temps) */
    chapitresData['3e'] = chapitresData['3e'] || {};
    if (!chapitresData['3e']['10']) chapitresData['3e']['10'] = { title: 'Chapitre 1', seances: {} };
    if (!chapitresData['3e']['10'].seances['1'])
      chapitresData['3e']['10'].seances['1'] = { title: 'Séance 3', deroule: { ecrans: JSON.parse(JSON.stringify(trame)) } };
    try { AT.edChap = { level: '3e', chnum: '10' }; ATVUES.snum = '1'; } catch (e) {}
    const sce = chapitresData['3e']['10'].seances['1'];
    sce.deroule_joue = { c3a: { classe: '3e Aretha Franklin', demarreLe: Date.now(),
      ecrans: JSON.parse(JSON.stringify(trame)) } };
    AT_DR_REGIME = 'classe';
    AT_DR_COURS = { debut: '10:07', fin: '11:02', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
    sesCoursEcrire();
    /* le tableau du pilotage, ouvert : c'est LA SURFACE PROJETÉE joignable */
    try { W.tableau(); } catch (e) {}
  }, TRAME);
  await dormir(2000);
  R.pilote = await pil.evaluate(() => ({
    ecrans: drWin().ECRANS.length, i: drWin().i, cran: drWin().iz,
    murJoignable: !!(typeof _drSurfaceProjetee === 'function' ? _drSurfaceProjetee() : null)
  }));

  /* ── outil de frappe ── */
  const taper = (sel, texte, morceau = 12) => pil.evaluate(async (sel, texte, morceau) => {
    const W = drWin();
    const pose = (el) => { el.focus();
      const r = W.document.createRange(); r.selectNodeContents(el); r.collapse(false);
      const s = W.getSelection(); s.removeAllRanges(); s.addRange(r); };
    for (let k = 0; k < texte.length; k += morceau) {
      const el = W.document.querySelector('#contenu [data-p="' + sel + '"]');
      if (!el) return { err: 'champ absent : ' + sel };
      el.textContent = el.textContent + texte.slice(k, k + morceau);
      pose(el);
      el.dispatchEvent(new W.Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 90));
    }
    return { ok: true, cran: W.iz };
  }, sel, texte, morceau);

  const effacer = (sel, combien) => pil.evaluate(async (sel, combien) => {
    const W = drWin();
    for (let k = 0; k < combien; k++) {
      const el = W.document.querySelector('#contenu [data-p="' + sel + '"]');
      if (!el) return { err: 'champ absent' };
      el.textContent = el.textContent.slice(0, -70);
      el.focus();
      const r = W.document.createRange(); r.selectNodeContents(el); r.collapse(false);
      const s = W.getSelection(); s.removeAllRanges(); s.addRange(r);
      el.dispatchEvent(new W.Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 90));
    }
    return { cran: W.iz };
  }, sel, combien);

  /* ═══ ① LE CONTENU TAPÉ PARVIENT AU TABLEAU DISTANT ═══ */
  const tab = await b.newPage(); await preparer(tab);
  await tab.goto(BASE + '?n=3e&vue=tableau', { waitUntil: 'domcontentloaded' });
  await dormir(600);
  await tab.evaluate(() => {
    try { SES.ctx = { niveau: '3e', chapitre: '10', seance: '1', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
      SES.tabPointeur = (typeof sesTabCle === 'function') ? sesTabCle(SES.ctx) : '';
      if (typeof sesTabMonter === 'function') sesTabMonter();
    } catch (e) { window.__tabErr = String(e); }
  });
  await tab.waitForFunction(() => { try { const t = document.getElementById('ses-tab-toile');
    return !!(t && t.contentDocument && t.contentDocument.getElementById('t')); } catch (e) { return false; } },
    { timeout: 30000, polling: 400 }).catch(() => {});
  await dormir(1200);
  const lireMur = () => tab.evaluate(() => {
    try {
      const t = document.getElementById('ses-tab-toile'), D = t && t.contentDocument;
      const z = D && D.getElementById('t');
      const p = D && D.querySelector('.dr-puls');
      const brut = z ? (z.innerText || z.textContent || '') : '';
      return { monte: !!z, texte: brut.replace(/\s+/g, ' ').trim(),
        html: z ? z.innerHTML.length : 0, i: (function(){try{return drWin().i;}catch(e){return null;}})(),
        ecrans: (function(){try{return drWin().ECRANS.length;}catch(e){return null;}})(),
        pulseSur: p ? p.textContent : null, ecrituresSorties: 0,
        diag: (function(){ try{ const W=drWin();
          return { win: !!W.win, winClosed: W.win?W.win.closed:null, gele: W.gele,
                   tDansWin: !!(W.win&&W.win.document&&W.win.document.getElementById('t')),
                   memeT: !!(W.win&&W.win.document&&W.win.document.getElementById('t')===z),
                   rev: (W.ECRANS[W.i]||{}).rev, tabErr: window.__tabErr||null }; }
          catch(e){ return {err:String(e)} } })() };
    } catch (e) { return { err: String(e) } }
  });
  R.murAvantFrappe = await lireMur();

  R.frappe1 = await taper('0.r.0', "lorem ipsum dolor sit amet consectetur ", 13);
  await dormir(2600);
  R.murApresLorem = await lireMur();

  /* Paul efface le lorem et met une autre réponse */
  await pil.evaluate(() => {
    const W = drWin();
    const el = W.document.querySelector('#contenu [data-p="0.r.0"]');
    el.textContent = "Ça met en valeur le mot rejeté. ";
    el.focus();
    const r = W.document.createRange(); r.selectNodeContents(el); r.collapse(false);
    const s = W.getSelection(); s.removeAllRanges(); s.addRange(r);
    el.dispatchEvent(new W.Event('input', { bubbles: true }));
  });
  R.frappe2 = await taper('0.r.0', "La passante disparait aussitot dans la foule ", 15);
  await dormir(2600);
  R.murApresRemplacement = await lireMur();
  R.un = {
    murPorteLorem: !!(R.murApresLorem.texte && R.murApresLorem.texte.indexOf('lorem ipsum') >= 0),
    murPorteLaSuite: !!(R.murApresRemplacement.texte && R.murApresRemplacement.texte.indexOf('La passante') >= 0),
    murGardeEncoreLorem: !!(R.murApresRemplacement.texte && R.murApresRemplacement.texte.indexOf('lorem ipsum') >= 0)
  };

  /* ═══ ⑦ LA PULSATION ═══ */
  R.pulsation = { surLeMurApresFrappe: R.murApresRemplacement.pulseSur };
  await tab.screenshot({ path: 'tests/te-' + TAG + '-pulsation-1.png' }).catch(() => {});
  await taper('0.r.0', "durablement ", 12);
  await dormir(2400);
  const m2 = await lireMur();
  R.pulsation.apresReprise = m2.pulseSur;
  R.pulsation.aSaute = !!(R.pulsation.surLeMurApresFrappe && m2.pulseSur && R.pulsation.surLeMurApresFrappe !== m2.pulseSur);
  R.pulsation.uneSeuleMarque = await tab.evaluate(() => {
    try { const D = document.getElementById('ses-tab-toile').contentDocument;
      return D.querySelectorAll('.dr-puls').length; } catch (e) { return -1; }
  });
  await tab.screenshot({ path: 'tests/te-' + TAG + '-pulsation-2.png' }).catch(() => {});

  /* ═══ ②③④⑤ LE ZOOM ═══ */
  await pil.evaluate((trame) => {
    const W = drWin();
    W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
    W.__pontCharge = true; W.i = 1; W.iz = 3;                 /* Paul est monté à 44 pt */
    const r = W.document.getElementById('rz'); if (r) r.value = '3';
    try { if (typeof AT_ZOOM !== 'undefined') AT_ZOOM.plafond = 3; } catch (e) {}
    W.ECRANS[1].rev = 2; W.rendre();
  }, TRAME);
  await dormir(500);
  R.zoom = { departManuel: await pil.evaluate(() => drWin().iz) };
  const suite = [];
  for (let t = 0; t < 6; t++) {
    await taper('0.r.0', LONG, 20);
    suite.push(await pil.evaluate(() => ({ cran: drWin().iz,
      suites: drWin().ECRANS.filter(e => e && e.suite).length })));
  }
  R.zoom.pendantLaFrappe = suite;
  R.zoom.cranApresDebordement = suite[suite.length - 1].cran;
  R.zoom.jamaisSousLePlancher = suite.every(x => x.cran >= 1);
  R.zoom.suitesCreees = suite[suite.length - 1].suites;

  /* ④ on efface : la remontée est symétrique */
  const remontee = [];
  for (let t = 0; t < 16; t++) {
    await effacer('0.r.0', 1);
    remontee.push(await pil.evaluate(() => ({ cran: drWin().iz,
      reste: (drWin().document.querySelector('#contenu [data-p="0.r.0"]') || {}).textContent ?
        drWin().document.querySelector('#contenu [data-p="0.r.0"]').textContent.length : 0 })));
  }
  await dormir(400);
  R.zoom.pendantLEffacement = remontee;
  R.zoom.cranApresEffacement = await pil.evaluate(() => drWin().iz);
  R.zoom.plafondRespecte = R.zoom.cranApresEffacement <= 3;

  /* ⑤ le zoom manuel n'est pas contrarié */
  await pil.evaluate(() => { const W = drWin();
    W.document.getElementById('rz').value = '4'; W.zoom(); });
  await taper('0.r.0', LONG, 20);
  R.zoom.apresZoomManuelA52 = await pil.evaluate(() => ({ cran: drWin().iz,
    plafond: (typeof AT_ZOOM !== 'undefined') ? AT_ZOOM.plafond : null,
    suites: drWin().ECRANS.filter(e => e && e.suite).length }));

  /* ═══ ⑥ LA COUPURE, PAR L'ÉTAT — réponse, consigne, fiche ═══ */
  const coupe = async (champ, prepa) => {
    await pil.evaluate((trame, prepa) => {
      const W = drWin();
      W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
      W.__pontCharge = true; W.iz = 1;
      const r = W.document.getElementById('rz'); if (r) r.value = '1';
      try { if (typeof AT_ZOOM !== 'undefined') AT_ZOOM.plafond = 1; } catch (e) {}
      eval(prepa);
      W.rendre();
    }, TRAME, prepa);
    await dormir(400);
    for (let t = 0; t < (champ === '0.def' ? 12 : 5); t++) await taper(champ, LONG, 20);
    await dormir(600);
    return pil.evaluate(() => {
      const W = drWin();
      const f = W.ECRANS.filter(e => e && e.suite);
      const p = W.ECRANS.find(e => e && !e.suite && e.grp);
      const b0 = f.length ? f[0].blocs[0] : null;
      return {
        suites: f.length, libelle: f.length ? ('suite ' + f[0].suite) : null,
        cran: W.iz,
        typeDuMorceau: b0 ? b0.t : null,
        initialeConservee: (b0 && b0.reps && b0.reps[0]) ? b0.reps[0].i : null,
        suiteRep: !!(b0 && b0.reps && b0.reps[0] && b0.reps[0].suiteRep),
        fragmentPose: !!(b0 && b0.frag),
        pereGardeSonIdentite: !!(p && p.eid),
        filsSansIdentite: f.every(e => !e.eid),
        devoilementDuMorceau: b0 ? (b0.vues || 0) : null
      };
    });
  };
  R.coupure = {};
  R.coupure.reponse = await coupe('0.r.0',
    "W.i=1; W.ECRANS[1].rev=2; W.ECRANS[1].blocs[0].reps=[{i:'EB',r:'Ça met en valeur le mot rejeté. ',refo:false}]; W.ECRANS[1].blocs[0].vues=1;");
  R.coupure.consigne = await coupe('0.txt', "W.i=0; W.ECRANS[0].rev=2; W.ECRANS[0].blocs[0].vues=1;");
  /* la ligne zoom/dézoom de la matrice se prouve ICI : le groupe existe (consigne scindée) */
  R.matriceZoom = await pil.evaluate(() => {
    const W = drWin();
    const g = (W.ECRANS.find(e => e && e.grp) || {}).grp;
    const lot = W.ECRANS.filter(e => e.grp === g);
    const avant = { total: W.ECRANS.length, suites: W.ECRANS.filter(e => e && e.suite).length,
      vues: lot.reduce((s, e) => s + (e.blocs || []).reduce((t, b) => t + (b.vues || 0), 0), 0),
      etapes: lot.reduce((s, e) => s + (e.blocs || []).reduce((t, b) => t + ((b.etapes || []).length), 0), 0),
      eidDuPere: (lot.find(e => !e.suite) || {}).eid || null };
    W.document.getElementById('rz').value = '0'; W.zoom();      /* dézoom : la refusion opère */
    const p = W.ECRANS.find(e => e.eid === avant.eidDuPere);
    const apres = { total: W.ECRANS.length, suites: W.ECRANS.filter(e => e && e.suite).length,
      vues: p ? (p.blocs || []).reduce((t, b) => t + (b.vues || 0), 0) : null,
      etapes: p ? (p.blocs || []).reduce((t, b) => t + ((b.etapes || []).length), 0) : null,
      pereRetrouve: !!p, fragmentsEffaces: p ? (p.blocs || []).every(b => !b.frag) : null };
    return { avant, apres, devoilementRecolle: avant.vues === apres.vues, morceauxRecolles: apres.suites === 0 };
  });

  R.coupure.fiche = await coupe('0.def', "W.i=2; W.ECRANS[2].rev=2;");

  R.ecritures = { nonGETinterceptees: ECR.nonGET, sortiesReelles: ECR.sorties };
  R.hubPorteLaTrame = (() => {
    try { const e = HUB.site['3e'].chapitres['10'].seances['1'].deroule_joue.c3a.ecrans;
      return { present: Array.isArray(e), texteDuChamp: e && e[1] && e[1].blocs[0].reps[0].r ? e[1].blocs[0].reps[0].r.slice(0, 60) : null };
    } catch (e) { return { present: false } }
  })();
  R.pageerrors = erreurs;

  await pil.screenshot({ path: 'tests/te-' + TAG + '-pilote.png' }).catch(() => {});
  await tab.screenshot({ path: 'tests/te-' + TAG + '-tableau.png' }).catch(() => {});
  await b.close();
  fs.mkdirSync('tests', { recursive: true });
  fs.writeFileSync('tests/te-' + TAG + '.json', JSON.stringify(R, null, 2));
  console.log(JSON.stringify(R, null, 2));
})();
