/* BANC LOT SUITES — le GESTE de Paul, pas l'appel direct.
   Trame réelle chargée depuis le hub (GET), parcours par CLICS, zoom par le CURSEUR.
   Usage : node banc_suites.js <fichier.html> <etiquette> */
const c = require('@sparticuz/chromium'); const chromium = c.default || c;
const puppeteer = require('puppeteer-core');
const path = require('path'), fs = require('fs');

const FICHIER = process.argv[2] || 'p3/index.html';
const TAG = process.argv[3] || 'base';
const TRAME = JSON.parse(fs.readFileSync('trame-paul.json', 'utf8'));
/* on numérote les six étapes de la consigne de Paul À LA SOURCE : E1..E6.
   C'est la seule façon de LIRE l'ordre du CONTENU, étape par étape — et non écran par
   écran, l'erreur exacte des trois tentatives précédentes. Rien d'autre n'est modifié. */
(function () {
  for (const e of TRAME) for (const b of (e.blocs || []))
    if (b.t === 'consigne' && (b.etapes || []).length >= 6) {
      b.etapes = b.etapes.map((t, k) => 'E' + (k + 1) + ' ' + t);
      return;
    }
})();

const HUB = {}; const ECR = { nonGET: 0, sorties: 0, detail: [] };
const seg = (ch) => ch.replace(/\.json$/, '').split('/').filter(Boolean);
function hubGet(ch) { let n = HUB; for (const k of seg(ch)) { if (n == null || typeof n !== 'object') return null; n = n[k]; } return n === undefined ? null : n; }
function hubPut(ch, v, m) {
  ECR.nonGET++; ECR.detail.push(m + ' ' + ch + ' :: ' + JSON.stringify(v).slice(0, 120));
  const p = seg(ch); let n = HUB;
  for (let i = 0; i < p.length - 1; i++) { if (typeof n[p[i]] !== 'object' || n[p[i]] === null) n[p[i]] = {}; n = n[p[i]]; }
  if (v === null || m === 'DELETE') delete n[p[p.length - 1]]; else n[p[p.length - 1]] = v;
  return true;
}

const AMORCE = () => {
  if (window.__hubPose) return; window.__hubPose = true;
  const est = u => String(u).indexOf('firebasedatabase.app') >= 0;
  const ch = u => { const m = String(u).match(/firebasedatabase\.app\/(.*?)(\?|$)/); return m ? m[1] : ''; };
  const vrai = window.fetch.bind(window);
  window.fetch = function (u, o) {
    const url = (u && u.url) ? u.url : String(u);
    const meth = ((o && o.method) || 'GET').toUpperCase();
    if (est(url)) {
      if (meth !== 'GET') { let v = null; try { v = o && o.body ? JSON.parse(o.body) : null; } catch (e) {}
        return window.__hubPut(ch(url), v, meth).then(() => new Response('null', { status: 200 })); }
      return window.__hubGet(ch(url)).then(v => new Response(JSON.stringify(v === undefined ? null : v),
        { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return vrai(u, o);
  };
};

const dormir = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await puppeteer.launch({
    args: [...chromium.args, '--disable-popup-blocking'],
    executablePath: await chromium.executablePath(),
    headless: 'shell',
    defaultViewport: { width: 900, height: 600 }   /* écran scindé : les conditions de Paul */
  });
  const R = { etiquette: TAG, fichier: FICHIER, viewport: '900x600' };
  const erreurs = [];
  const p = await b.newPage();
  p.on('dialog', d => d.dismiss().catch(() => {}));
  p.on('pageerror', e => erreurs.push(String(e).slice(0, 160)));
  await p.exposeFunction('__hubGet', async ch => hubGet(ch));
  await p.exposeFunction('__hubPut', async (ch, v, m) => hubPut(ch, v, m));
  await p.evaluateOnNewDocument(AMORCE);

  /* le hub porte la trame RÉELLE, sous le chemin réel */
  HUB.site = { '3e': { chapitres: { '0': { titre: 'Chapitre 1', seances: { '0': {
    titre: 'Séance 1', deroule: { ecrans: JSON.parse(JSON.stringify(TRAME)) } } } } } } };

  await p.goto('file://' + path.resolve(FICHIER) + '?n=3e', { waitUntil: 'domcontentloaded' });
  await dormir(900);

  /* ── LE PARCOURS RÉEL, par clics ── */
  const trace = [];
  const cliquer = async (texte, ...alt) => {
    const ok = await p.evaluate((t, alt) => {
      const cibles = [t].concat(alt);
      const visible = (x) => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const tous = Array.from(document.querySelectorAll('[onclick],button,a,.at-porte,.at-carte,.chap-carte,.tab'))
        .filter(visible);
      const txt = x => (x.innerText || x.textContent || '').trim().toLowerCase();
      for (const c of cibles) {                       /* correspondance EXACTE d'abord */
        const el = tous.find(x => txt(x) === c.toLowerCase());
        if (el) { el.click(); return c + ' = ' + txt(el).slice(0, 26); }
      }
      for (const c of cibles) {                       /* puis le plus court qui contienne */
        const l = tous.filter(x => txt(x).includes(c.toLowerCase())).sort((a, b2) => txt(a).length - txt(b2).length);
        if (l.length) { l[0].click(); return c + ' ~ ' + txt(l[0]).slice(0, 26); }
      }
      window.__libelles = tous.map(x => txt(x).slice(0, 30)).slice(0, 20);
      return null;
    }, texte, alt);
    trace.push({ clic: texte, trouve: ok });
    await dormir(700);
    return ok;
  };
  await p.evaluate(() => {
    document.body.classList.add('admin-mode');
    try { SECU.valide = true; } catch (e) {}
    const g = document.getElementById('page-validation'); if (g) g.style.display = 'none';
    try { loadPublished('3e'); } catch (e) {}
  });
  await dormir(1200);
  await cliquer('Panneau prof');
  await cliquer('Atelier');
  await cliquer('Mes chapitres', 'Chapitres');
  await cliquer("Chapitre 1", 'Analyse', 'Séance');
  await cliquer('Modifier');
  await cliquer('Séance 1', 'Séance');
  await cliquer('Déroulé', 'Deroule');
  R.parcours = trace;
  R.libellesDisponibles = await p.evaluate(() => window.__libelles || null);
  R.cadreParClics = await p.evaluate(() => { try { return typeof drWin().rendre === 'function'; } catch (e) { return false; } });

  /* repli documenté si la chaîne de clics n'a pas abouti : mêmes portes que le site */
  if (!R.cadreParClics) {
    await p.evaluate((trame) => {
      chapitresData['3e'] = chapitresData['3e'] || {};
      chapitresData['3e']['0'] = { title: 'Chapitre 1', seances: { '0': { title: 'Séance 1',
        deroule: { ecrans: JSON.parse(JSON.stringify(trame)) } } } };
      try { AT.edChap = { level: '3e', chnum: '0' }; ATVUES.snum = '0';
        AT_PONT.ctx = { level: '3e', chnum: '0', snum: '0' }; } catch (e) {}
      _drAssurerCadre();
    }, TRAME);
    await p.waitForFunction(() => { try { return typeof drWin().rendre === 'function'; } catch (e) { return false; } },
      { timeout: 30000, polling: 300 });
  }
  /* le cadre doit être VISIBLE et dimensionné, sans le déplacer (il perdrait son contenu) */
  await p.evaluate((trame) => {
    const f = document.getElementById('at-dr-iframe');
    if (f) { f.style.display = 'block'; f.style.width = '880px'; f.style.height = '560px';
      f.style.opacity = '1'; f.style.visibility = 'visible'; f.style.border = '0';
      f.style.position = 'fixed'; f.style.left = '0'; f.style.top = '0'; f.style.zIndex = '9999';
      let n = f.parentElement;
      while (n && n !== document.body) { n.style.display = 'block'; n.style.opacity = '1';
        n.style.visibility = 'visible'; n.classList.remove('cache'); n = n.parentElement; } }
    const W = drWin();
    /* si le parcours a chargé la trame lui-même, ON N'Y TOUCHE PAS : c'est elle qu'on mesure */
    if (!(W.ECRANS && W.ECRANS.length > 3))
      W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
    W.__pontCharge = true; W.i = 0; W.iz = 1;
    const r = W.document.getElementById('rz'); if (r) r.value = '1';
    W.rendre();
  }, TRAME);
  await dormir(900);

  /* ═══ CE QUI PORTE LE CHAPITRE — état de référence ═══ */
  const photo = () => p.evaluate(() => {
    const W = drWin();
    return {
      ecrans: W.ECRANS.length,
      titres: W.ECRANS.map(e => e.act),
      durees: W.ECRANS.map(e => e.dur),
      blocs: W.ECRANS.map(e => (e.blocs || []).map(b => b.t).join(',')),
      etapesTotal: W.ECRANS.reduce((s, e) => s + (e.blocs || []).reduce((t, b) => t + ((b.etapes || []).length), 0), 0),
      identites: W.ECRANS.map(e => e.eid || null),
      vignettes: W.document.querySelectorAll('#bande .vig, #bande .mini, .vig').length,
      titreColonne: (W.document.querySelector('.col-titre, #titreCol, .titre-col') || {}).textContent || null,
      badge: (W.document.querySelector('.badge, #badge') || {}).textContent || null,
      libelles: Array.from(W.document.querySelectorAll('.lab')).map(x => x.textContent.trim()).slice(0, 24)
    };
  });
  R.chargementBrut = await photo();
  await p.evaluate(() => { const W = drWin();
    W.iz = 1; W.document.getElementById('rz').value = '1';
    try { W.reabsorbe(); } catch (e) {} W.i = 0; W.rendre(); });
  await dormir(500);
  R.numerotation = await p.evaluate(() => {
    const W = drWin();
    const t = W.ECRANS.reduce((a, e) => a.concat((e.blocs || []).reduce((c, b) => c.concat(b.etapes || []), [])), []);
    return { marquees: t.filter(x => /^E\d+ /.test(x)).length, total: t.length };
  });
  R.chargement = await photo();

  /* ═══ ③ LE GESTE : monter le zoom au CURSEUR jusqu'à obtenir ≥ 4 morceaux ═══ */
  const cran = (n) => p.evaluate((n) => {
    const W = drWin(); const r = W.document.getElementById('rz');
    r.value = String(n);
    r.dispatchEvent(new W.Event('input', { bubbles: true }));   /* le geste : on tire le curseur */
    return W.iz;
  }, n);
  const etatGroupe = () => p.evaluate(() => {
    const W = drWin();
    const g = (W.ECRANS.find(e => e && e.grp) || {}).grp || null;
    const lot = g ? W.ECRANS.map((e, n) => ({ n, e })).filter(x => x.e.grp === g) : [];
    return {
      cran: W.iz, total: W.ECRANS.length,
      ordre: lot.map(x => x.e.suite ? ('suite ' + x.e.suite) : 'PÈRE'),
      rangs: lot.map(x => x.e.suite || 0),
      etapesDuGroupe: lot.reduce((s, x) => s + (x.e.blocs || []).reduce((t, b) => t + ((b.etapes || []).length), 0), 0),
      blocsDuGroupe: lot.map(x => (x.e.blocs || []).map(b => b.t + '/' + ((b.etapes || []).length)).join('+')),
      libellesBande: Array.from(W.document.querySelectorAll('.lab')).map(x => x.textContent.trim()).slice(0, 10),
      titresVisibles: Array.from(W.document.querySelectorAll('#contenu .cons .txt, #contenu .cons b')).map(x => x.textContent.trim().slice(0, 40)),
      identitesDuGroupe: lot.map(x => x.e.eid || null),
      /* LA mesure du lot : les étapes lues de gauche à droite, écran par écran */
      contenu: lot.map(x => (x.e.blocs || []).reduce((a, b) => a.concat(b.etapes || []), [])
        .map(t => (String(t).match(/^E\d+/) || ['?'])[0])),
      contenuAPlat: lot.reduce((a, x) => a.concat((x.e.blocs || []).reduce((c, b) =>
        c.concat(b.etapes || []), [])), []).map(t => (String(t).match(/^E\d+/) || ['?'])[0]),
      /* LA question de ② : s'il reste une suite, est-ce parce que ça DÉBORDE encore
         (scission légitime) ou parce que la refusion n'a pas tout recollé ? */
      debordeEncore: (function () { try { return !!W.deborde(); } catch (e) { return null; } })(),
      /* mesuré SUR LE PÈRE, écran affiché : c'est lui qui déborde ou non */
      pereDeborde: (function () { try {
        const px = lot.find(x => !x.e.suite); if (!px) return null;
        const garde = W.i; W.i = px.n; W.rendre();
        const d = !!W.deborde(); W.i = garde; W.rendre(); return d;
      } catch (e) { return null; } })(),
      etapesDuPere: (function () { const p = lot.find(x => !x.e.suite);
        return p ? (p.e.blocs || []).reduce((t, b) => t + ((b.etapes || []).length), 0) : null; })(),
      i: W.i
    };
  });

  R.positionAvant = await p.evaluate(() => {
    const W = drWin();
    try { _drIdentifierEcrans(W.ECRANS); } catch (e) {}
    return { i: W.i, eid: (W.ECRANS[W.i] || {}).eid || null, act: (W.ECRANS[W.i] || {}).act || null };
  });
  R.montee = [];
  for (const n of [1, 2, 3, 4]) {
    await cran(n); await dormir(800);
    R.montee.push(await etatGroupe());
  }
  R.apresMontee = await etatGroupe();
  R.positionApres = await p.evaluate(() => {
    const W = drWin();
    return { i: W.i, eid: (W.ECRANS[W.i] || {}).eid || null, act: (W.ECRANS[W.i] || {}).act || null,
      surUnFils: !!(W.ECRANS[W.i] || {}).suite };
  });
  R.positionTenue = (R.positionAvant.eid && R.positionApres.eid === R.positionAvant.eid);

  /* ═══ ① L'ORDRE DES SUITES ═══ */
  const lu = R.apresMontee.contenuAPlat || [];
  R.contenu = {
    lecture: lu.join(' '),
    parEcran: (R.apresMontee.contenu || []).map(x => x.join(' ')).join(' | '),
    dansLOrdre: lu.length > 0 && lu.every((v, k) => k === 0 || (+v.slice(1)) > (+lu[k - 1].slice(1))),
    etapesPresentes: lu.length,
    aucuneManquante: (() => { const s = new Set(lu); return [1,2,3,4,5,6].every(k => s.has('E' + k)); })()
  };
  R.un = {
    morceaux: R.apresMontee.ordre.filter(x => x !== 'PÈRE').length,
    ordreObserve: R.apresMontee.ordre.join(' | '),
    rangsCroissants: (() => { const r = R.apresMontee.rangs.filter(x => x); return r.every((v, k) => k === 0 || v > r[k - 1]); })(),
    pereEnTete: R.apresMontee.ordre[0] === 'PÈRE',
    libellePereDansLaBande: R.apresMontee.libellesBande[0] || null,
    titresEnDouble: (() => { const t = R.apresMontee.titresVisibles; return t.length - new Set(t).size; })()
  };

  /* ═══ ② LE DÉZOOM CRAN PAR CRAN, jusqu'au bas ═══ */
  /* ═══ ② LA CAPTURE DE LA BANDE — on vise la BOÎTE DU GROUPE, là où les deux textes
     se chevauchent, et on la regarde. Un compteur ne prouve rien ici. ═══ */
  R.captureVignettes = null;
  await p.evaluate(() => {
    const f = document.getElementById('at-dr-iframe'); if (!f) return;
    f.style.cssText = 'display:block;width:880px;height:700px;opacity:1;visibility:visible;'
      + 'border:0;position:fixed;left:0;top:0;z-index:2147483647;background:#151110';
    let n = f.parentElement;
    while (n && n !== document.body) { n.style.display = 'block'; n.style.opacity = '1';
      n.style.visibility = 'visible'; n.style.transform = 'none'; n.classList.remove('cache');
      n = n.parentElement; }
  });
  await dormir(700);
  try {
    for (const f of p.frames()) {
      const el = await f.$('#vgs .grp').catch(() => null);
      if (!el) continue;
      await f.evaluate(() => { const c = document.getElementById('vgs'); if (c) c.scrollTop = 0; });
      await dormir(400);
      await el.screenshot({ path: 'tests/cascade-' + TAG + '-groupe.png' });
      R.captureVignettes = 'tests/cascade-' + TAG + '-groupe.png';
      R.mesureChevauchement = await f.evaluate(() => {
        const g = document.querySelector('#vgs .grp');
        const gl = g && g.querySelector('.gl');
        const lab = g && g.querySelector('.vgw .lab');
        if (!gl || !lab) return null;
        const a = gl.getBoundingClientRect(), b = lab.getBoundingClientRect();
        return { etiquette: gl.textContent.trim().slice(0, 64),
          libelle: lab.textContent.trim().slice(0, 64),
          basEtiquette: Math.round(a.bottom), hautLibelle: Math.round(b.top),
          seChevauchent: !(a.bottom <= b.top + 0.5 || b.bottom <= a.top + 0.5),
          position: getComputedStyle(gl).position };
      });
      break;
    }
  } catch (e) { R.captureVignettes = 'ECHEC ' + e; }

  R.descente = [];
  for (const n of [3, 2, 1, 0]) {
    await cran(n); await dormir(800);
    R.descente.push(await etatGroupe());
  }
  const bas = R.descente[R.descente.length - 1];
  R.contenuAuBas = {
    lecture: (bas.contenuAPlat || []).join(' '),
    dansLOrdre: (bas.contenuAPlat || []).every((v, k) => k === 0 || (+v.slice(1)) > (+bas.contenuAPlat[k - 1].slice(1))),
    etapes: (bas.contenuAPlat || []).length
  };
  R.deux = {
    cranFinal: bas.cran,
    ecransDuGroupeAuBas: bas.ordre.length,
    etapesAuBas: bas.etapesDuGroupe,
    etapesAuDepart: R.chargement.etapesTotal,
    aucunePerte: bas.etapesDuGroupe > 0 ? null : null,
    etapesTotalesTrame: await p.evaluate(() => drWin().ECRANS.reduce((s, e) =>
      s + (e.blocs || []).reduce((t, b) => t + ((b.etapes || []).length), 0), 0)),
    totalEcrans: bas.total
  };
  R.deux.aucunePerte = (R.deux.etapesTotalesTrame === R.chargement.etapesTotal);

  /* ═══ NON-RÉGRESSION : le dévoilement, avancer et reculer sur cinq écrans ═══ */
  R.devoilement = await p.evaluate(async () => {
    const W = drWin(); const pas = [];
    W.iz = 1; W.document.getElementById('rz').value = '1';
    try { W.reabsorbe(); } catch (e) {}
    W.i = 0; W.rendre();
    for (let k = 0; k < 5; k++) {
      W.i = k; W.rendre();
      for (let t = 0; t < 3; t++) { try { W.avance(); } catch (e) {} }
      pas.push({ n: k, rev: W.ECRANS[k].rev, vues: (W.ECRANS[k].blocs || []).map(b => b.vues || 0).join('-') });
      for (let t = 0; t < 2; t++) { try { W.recule(); } catch (e) {} }
      pas.push({ n: k, apresRecul: W.ECRANS[k].rev, vues: (W.ECRANS[k].blocs || []).map(b => b.vues || 0).join('-') });
    }
    return pas;
  });

  /* ═══ NON-RÉGRESSION : la matrice actions × état, EN ENTIER ═══ */
  R.matrice = await p.evaluate((trame) => {
    const recharge = () => { const W = drWin();
      W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
      W.__pontCharge = true; W.i = 0; W.iz = 1; W.rendre(); return W; };
    const out = {};
    let W = recharge();
    /* copier/dupliquer */
    _drIdentifierEcrans(W.ECRANS);
    const eidAvant = W.ECRANS[0].eid;
    W.ECRANS[0].blocs[0].vues = 3; W.ECRANS[0].rev = 2; W.ECRANS[0].blocs[0].frag = 'fX';
    W.ctxEcran = 0; W.ctxDup();
    const cp = W.ECRANS[1];
    out.dupliquer = { identifiantNeuf: !!(cp.eid && cp.eid !== eidAvant),
      originalGarde: W.ECRANS[0].eid === eidAvant,
      devoilementAZero: cp.rev === 0 && (cp.blocs || []).every(b => !b.vues),
      fragmentEfface: (cp.blocs || []).every(b => !b.frag),
      doublons: (() => { const l = W.ECRANS.map(e => e.eid).filter(Boolean); return l.length - new Set(l).size; })() };
    /* déplacer */
    W = recharge(); _drIdentifierEcrans(W.ECRANS);
    const av = W.ECRANS[2].eid, tit = W.ECRANS[2].act, nb = W.ECRANS[2].blocs.length;
    W.i = 2; try { W.monte(); } catch (e) { try { W.deplace(-1); } catch (e2) {} }
    const dep = W.ECRANS.find(e => e.eid === av);
    out.deplacer = { retrouve: !!dep, memeTitre: dep ? dep.act === tit : null,
      memeNombreDeBlocs: dep ? dep.blocs.length === nb : null, total: W.ECRANS.length };
    /* supprimer */
    W = recharge(); _drIdentifierEcrans(W.ECRANS);
    const cible = W.ECRANS[3].eid, avant = W.ECRANS.length;
    W.i = 3; try { W.supprime(); } catch (e) { W.ECRANS.splice(3, 1); }
    out.supprimer = { retire: !W.ECRANS.some(e => e.eid === cible), total: W.ECRANS.length, attendu: avant - 1,
      marquesPurgees: !W.ECRANS.some(e => (e.blocs || []).some(b => b.frag)) };
    /* ajouter */
    W = recharge(); _drIdentifierEcrans(W.ECRANS);
    W.i = 0; try { W.nouvelEcran(); } catch (e) {}
    const neuf = W.ECRANS[1];
    out.ajouter = { cree: !!neuf, aZero: !!neuf && (neuf.rev === undefined || neuf.rev === 0) && (neuf.blocs || []).length === 0 };
    /* fiche : dévoilement interne conservé */
    W = recharge();
    const nf = W.ECRANS.findIndex(e => (e.blocs || []).some(b => b.t === 'fiche'));
    if (nf >= 0) { W.i = nf; W.ECRANS[nf].blocs[0].vues = 2; W.ficheOuverte = [nf, 0]; W.rendre();
      out.fiche = { vuesConservees: W.ECRANS[nf].blocs[0].vues === 2, ouverte: !!W.ficheOuverte }; }
    return out;
  }, TRAME);

  /* ═══ NON-RÉGRESSION : ce qui partirait au hub ═══ */
  ECR.detail.length = 0; ECR.nonGET = 0;
  await p.evaluate((trame) => {
    const W = drWin();
    W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
    W.__pontCharge = true; W.i = 0; W.rendre();
    try { atDrTrameEnregistrer(true); } catch (e) {}
  }, TRAME);
  await dormir(1600);
  R.enregistrement = { ecritures: ECR.nonGET, empreinte: ECR.detail.map(x => x.split(' :: ')[0]).sort() };
  R.trameQuiPartirait = await p.evaluate(() => { try { return JSON.stringify(DR.dr_exporterTrame()).length; } catch (e) { return null; } });

  /* ═══ NON-RÉGRESSION : LA SESSION À TROIS PAGES ═══ */
  await p.evaluate((trame) => {
    const W = drWin();
    W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
    W.__pontCharge = true; W.i = 0; W.iz = 1; W.rendre();
    AT_DR_REGIME = 'classe';
    AT_DR_COURS = { debut: '10:07', fin: '11:02', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
    SES.ctx = { niveau: '3e', chapitre: '0', seance: '0', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
    const sce = chapitresData['3e']['0'].seances['0'];
    sce.deroule_joue = { c3a: { classe: '3e Aretha Franklin', demarreLe: Date.now(),
      ecrans: JSON.parse(JSON.stringify(trame)) } };
    try { sesCoursEcrire(); } catch (e) {}
  }, TRAME);
  await dormir(900);
  R.session = { photos: await p.evaluate(() => {
    const W = drWin(); const out = [];
    for (let k = 0; k < 5; k++) {
      W.i = k; W.ECRANS[k].rev = 2; W.rendre();
      const ph = sesPhoto();
      out.push({ n: k, ecran: ph.ecran, eid: ph.eid, rev: ph.rev, morceau: ph.morceau,
        vues: JSON.stringify(ph.vues) });
    }
    return out;
  }) };
  const scene = await p.evaluate(() => JSON.parse(JSON.stringify(sesPhoto())));
  const trameJouee = await p.evaluate(() => DR.dr_exporterTrame());
  /* le harnais pose la séance jouée dans SON hub, pour que les deux autres pages la lisent */
  HUB.site['3e'].chapitres['0'].seances['0'].deroule_joue = { c3a: {
    classe: '3e Aretha Franklin', demarreLe: Date.now(), ecrans: trameJouee, scene: scene } };
  HUB.site.cours_actif = { niveau: '3e', chapitre: '0', seance: '0', classeSlug: 'c3a',
    classeNom: '3e Aretha Franklin', debut: '10:07', fin: '11:02', ts: Date.now() };
  for (const vue of ['tableau', 'tel']) {
    const q = await b.newPage();
    q.on('dialog', d => d.dismiss().catch(() => {}));
    await q.exposeFunction('__hubGet', async ch => hubGet(ch));
    await q.exposeFunction('__hubPut', async (ch, v, m) => hubPut(ch, v, m));
    await q.evaluateOnNewDocument(AMORCE);
    await q.goto('file://' + path.resolve(FICHIER) + '?n=3e&vue=' + vue, { waitUntil: 'domcontentloaded' });
    await dormir(500);
    await q.evaluate((sc, tj) => {
      try {
        SES.ctx = { niveau: '3e', chapitre: '0', seance: '0', classeSlug: 'c3a', classeNom: '3e Aretha Franklin' };
        SES.tabPointeur = (typeof sesTabCle === 'function') ? sesTabCle(SES.ctx) : '';
        if (typeof sesTabMonter === 'function') sesTabMonter();
      } catch (e) {}
    }, scene, trameJouee);
    await q.waitForFunction(() => { try { return typeof drWin().rendre === 'function'; } catch (e) { return false; } },
      { timeout: 25000, polling: 400 }).catch(() => {});
    await dormir(2500);
    R.session[vue] = await q.evaluate(() => {
      try { const W = drWin();
        const t = document.getElementById('ses-tab-toile'), D = t && t.contentDocument;
        const z = D && D.getElementById('t');
        return { cadre: !!W, ecrans: W.ECRANS.length, i: W.i,
          eidDesigne: (W.ECRANS[W.i] || {}).eid || null,
          rev: (W.ECRANS[W.i] || {}).rev,
          projete: z ? (z.innerText || z.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120) : null };
      } catch (e) { return { err: String(e) } }
    });
    await q.close();
  }

  /* ═══ NON-RÉGRESSION : LA CLÔTURE quand rien n'a été modifié ═══ */
  ECR.detail.length = 0; ECR.nonGET = 0;
  /* le cas propre : la séance jouée est la copie EXACTE de la préparation, rien n'a bougé */
  await p.evaluate((trame) => {
    const W = drWin();
    W.ECRANS = _drNormaliserTrame(JSON.parse(JSON.stringify(trame)));
    W.__pontCharge = true; W.i = 0; W.iz = 1; W.rendre();
    const sce = chapitresData['3e']['0'].seances['0'];
    sce.deroule = { ecrans: JSON.parse(JSON.stringify(DR.dr_exporterTrame())) };
    sce.deroule_joue = { c3a: { classe: '3e Aretha Franklin', demarreLe: Date.now(),
      ecrans: JSON.parse(JSON.stringify(DR.dr_exporterTrame())) } };
  }, TRAME);
  await dormir(600);
  R.clotureSansModif = await p.evaluate(async () => {
    const dire = []; const vraie = window._modaleConfirme;
    window._modaleConfirme = function (t, h) { dire.push(String(h).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)); };
    let n = null; try { n = atDrModifsDeLaSeance().length; } catch (e) {}
    try { atDrClotureModale(); } catch (e) { dire.push('ERREUR ' + e); }
    window._modaleConfirme = vraie;
    return { nbModifs: n, message: dire[0] || null, rienModifie: dire.some(m => /rien modifi/i.test(m)) };
  });
  R.cloture = await p.evaluate(async () => {
    const dire = [];
    const vraiInfo = window.atInfo;
    window.atInfo = function (m) { dire.push(String(m).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)); };
    const vraiModale = window._modaleConfirme;
    window._modaleConfirme = function (t, h) { dire.push(String(t) + ' :: ' + String(h).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220)); };
    try { atDrClotureModale(); } catch (e) { dire.push('ERREUR ' + e); }
    window._modaleConfirme = vraiModale;
    await new Promise(r => setTimeout(r, 1500));
    window.atInfo = vraiInfo;
    return { messages: dire, rienModifie: dire.some(m => /rien modifi/i.test(m)),
      nbModifs: (function () { try { return atDrModifsDeLaSeance().length; } catch (e) { return null; } })() };
  });
  R.clotureEcritures = ECR.nonGET;

  R.ecritures = { nonGETinterceptees: ECR.nonGET, sortiesReelles: ECR.sorties };
  R.pageerrors = erreurs;
  await p.screenshot({ path: 'tests/suites-' + TAG + '.png' }).catch(() => {});
  await b.close();
  fs.mkdirSync('tests', { recursive: true });
  fs.writeFileSync('tests/suites-' + TAG + '.json', JSON.stringify(R, null, 2));
  console.log(JSON.stringify({ parcours: R.parcours, cadreParClics: R.cadreParClics,
    chargement: { ecrans: R.chargement.ecrans, etapes: R.chargement.etapesTotal },
    un: R.un, deux: R.deux, pageerrors: R.pageerrors.length }, null, 2));
})();
