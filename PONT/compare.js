/* ═══ BANC COMPARATIF — outil premier du chantier PONT (ordre de Paul, 21/08) ═══
   Joue la MÊME séquence de gestes sur deux cibles :
     A = deroule86.html d'origine (la référence)
     B = même origine (auto-épreuve) · origine cassée volontairement (épreuve du banc)
         · le montage É1 (l'iframe du pont)
   puis compare (1) les DONNÉES (i courant, rev/vues/types de chaque bloc)
   et (2) les CLASSES DU DOM de la scène, normalisées.
   Usage : node compare.js AvsA | AvsCasse | AvsMontage <fichier-livraison> */
const c = require('@sparticuz/chromium'); const chromium = c.default || c;
const puppeteer = require('puppeteer-core');
const path = require('path');

const ORIGINE = 'file://' + path.resolve(__dirname, 'deroule89-candidat.html');

/* ── la séquence de gestes commune, exprimée avec les fonctions publiques du déroulé ── */
const GESTES = [
  'va(1)', 'devoile()', 'devoile()', 'devoile()', 'devoile()',
  'replie()', 'replie()',
  'va(3)', 'devoile()', 'devoile()', 'devoile()', 'devoile()', 'devoile()',
  "ajoute('image')", "ajoute('schema')",          /* gestes d'édition (compare n°7 — famille des boutons morts) */
  'gel()', 'gel()',
  'va(2)', 'devoile()'
];

/* ── l'état comparable, calculé DANS la fenêtre du déroulé ── */
const LIT_ETAT = `(function(){
  var donnees = { i: i, ecrans: ECRANS.map(function(e){ return {
    rev: e.rev||0, suite: !!e.suite,
    blocs: (e.blocs||[]).map(function(b){ return { t: b.t, vues: b.vues||0 }; })
  };}) };
  var dom = [].slice.call(document.querySelectorAll('#contenu *')).map(function(el){
    return el.tagName + '.' + [].slice.call(el.classList).sort().join('.');
  }).join('|');
  return { donnees: donnees, dom: dom };
})()`;

async function lanceur(){
  return puppeteer.launch({
    args: [...chromium.args, '--disable-popup-blocking'],
    executablePath: await chromium.executablePath(),
    headless: 'shell', defaultViewport: { width: 1450, height: 950 }
  });
}

/* garde-fous : lecture seule stricte */
function coiffe(page, journal){
  page.on('dialog', d => { journal.dialogues.push(d.message().slice(0,60)); d.dismiss(); });
  page.on('pageerror', e => journal.erreurs.push(String(e).slice(0,120)));
  return page.setRequestInterception(true).then(() => {
    page.on('request', r => {
      const u = r.url();
      if (u.startsWith('file://') || u.startsWith('data:') || u.startsWith('about:')) return r.continue();
      if (u.includes('firebasedatabase.app')) return r.respond({ status: 200, contentType: 'application/json', body: 'null' });
      r.abort();
    });
  });
}

/* accès A : la page origine elle-même */
async function cibleOrigine(b, journal){
  const p = await b.newPage(); await coiffe(p, journal);
  await p.goto(ORIGINE, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));
  return { evaluate: (code) => p.evaluate(code), page: p };
}

/* accès B-montage : la livraison, onglet Déroulé ouvert, on opère DANS la frame */
async function cibleMontage(b, journal, fichier){
  const p = await b.newPage(); await coiffe(p, journal);
  await p.goto('file://' + path.resolve(fichier) + '?n=3e', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));
  /* entrer dans l'éditeur de chapitre sur un chapitre de banc, puis ouvrir le Déroulé */
  await p.evaluate(() => {
    chapitresData['3e'] = chapitresData['3e'] || {};
    chapitresData['3e']['10'] = { title: 'Banc', seances: { s1: { title: 'S1', ordre: 1 } } };
    window.__poserDecor && __poserDecor();
    AT = window.AT || {}; AT.flux = 'chapitre';
    atEditerChapitre('3e', '10');
    var n = document.getElementById('at-zone');
    while (n && n.style) { n.style.display = 'block'; n.style.opacity = '1'; n.style.visibility = 'visible'; n = n.parentElement; }
    atVuesAller('deroule');
  });
  /* attendre le boot de l'iframe (srcdoc) et l'aval d'intégrité du pont */
  await p.waitForFunction(() => window.AT_PONT && AT_PONT.pret === true, { timeout: 15000 });
  const cadre = await p.$('#at-dr-iframe');
  const frame = await cadre.contentFrame();
  return { evaluate: (code) => frame.evaluate(code), page: p, frame };
}

const TRAME_COMMUNE=[
 {act:"Rituel",h:"10:07",dur:4,comp:[],blocs:[{id:"x1",t:"consigne",pic:"\ud83d\udcd5",txt:"Trame commune du comparatif.",etapes:["Un.","Deux."],vues:0}]},
 {act:"Question",h:"10:11",dur:6,comp:[],blocs:[{id:"x2",t:"consigne",pic:"\ud83c\udfaf",txt:"Deuxi\u00e8me \u00e9cran.",etapes:[],vues:0},{id:"x3",t:"question",q:"Comparons ?",reps:[{i:"AB",r:"Oui.",refo:false}],vues:0}]},
 {act:"Sch\u00e9ma",h:"10:17",dur:5,comp:[],blocs:[{id:"x4",t:"consigne",pic:"\ud83e\udded",txt:"Troisi\u00e8me \u00e9cran.",etapes:[],vues:0}]},
 {act:"Bilan",h:"10:22",dur:3,comp:[],blocs:[{id:"x5",t:"consigne",pic:"\u2705",txt:"Dernier \u00e9cran.",etapes:["Fin."],vues:0}]}
];
async function joue(acces){
  await acces.evaluate('(function(T){ ECRANS=JSON.parse(JSON.stringify(T)); i=0; ficheOuverte=null; rendre(); })('+JSON.stringify(JSON.stringify(TRAME_COMMUNE))+'.length?'+JSON.stringify(TRAME_COMMUNE).replace(/</g,'\\u003c')+':null)');
  await new Promise(r => setTimeout(r, 200));
  for (const g of GESTES) { await acces.evaluate(g); await new Promise(r => setTimeout(r, 60)); }
  return acces.evaluate(LIT_ETAT);
}

function comparer(A, B){
  const ecarts = [];
  const ja = JSON.stringify(A.donnees), jb = JSON.stringify(B.donnees);
  if (ja !== jb) {
    if (A.donnees.i !== B.donnees.i) ecarts.push('DONNÉES: écran courant A=' + A.donnees.i + ' B=' + B.donnees.i);
    A.donnees.ecrans.forEach((ea, n) => {
      const eb = B.donnees.ecrans[n]; if (!eb) { ecarts.push('DONNÉES: écran ' + n + ' absent en B'); return; }
      if (ea.rev !== eb.rev) ecarts.push('DONNÉES: écran ' + n + ' rev A=' + ea.rev + ' B=' + eb.rev);
      ea.blocs.forEach((ba, j) => {
        const bb = eb.blocs[j];
        if (!bb) { ecarts.push('DONNÉES: écran ' + n + ' bloc ' + j + ' absent en B'); return; }
        if (ba.t !== bb.t || ba.vues !== bb.vues) ecarts.push('DONNÉES: écran ' + n + ' bloc ' + j + ' A=' + JSON.stringify(ba) + ' B=' + JSON.stringify(bb));
      });
    });
    if (!ecarts.length) ecarts.push('DONNÉES: différence non localisée (longueurs ?)');
  }
  if (A.dom !== B.dom) {
    const sa = A.dom.split('|'), sb = B.dom.split('|');
    if (sa.length !== sb.length) ecarts.push('DOM: ' + sa.length + ' nœuds en A, ' + sb.length + ' en B');
    for (let k = 0; k < Math.min(sa.length, sb.length); k++)
      if (sa[k] !== sb[k]) { ecarts.push('DOM: premier écart au nœud ' + k + ' — A=' + sa[k] + ' · B=' + sb[k]); break; }
  }
  return ecarts;
}

(async () => {
  const mode = process.argv[2] || 'AvsA';
  const journal = { dialogues: [], erreurs: [] };
  const b = await lanceur();

  const A = await cibleOrigine(b, journal);
  const etatA = await joue(A);

  let etatB;
  if (mode === 'AvsA') {
    const B = await cibleOrigine(b, journal); etatB = await joue(B);
  } else if (mode === 'AvsCasse') {
    /* épreuve du banc : cible B = origine, gestes joués, PUIS cassée volontairement
       en runtime (le fichier reste intact) — le banc DOIT voir les deux écarts */
    const B = await cibleOrigine(b, journal); await joue(B);
    etatB = await B.evaluate(`(function(){
      ECRANS[3].blocs[0].vues = 99;                             /* casse de DONNÉES */
      var n = document.querySelector('#contenu *[class]');
      if (n) n.classList.remove(n.classList[0]);                /* casse de DOM */
      ${LIT_ETAT.replace(/^\(function\(\)\{/, '').replace(/\}\)\(\)$/, '')}
    })()`);
  } else if (mode === 'AvsMontage') {
    const B = await cibleMontage(b, journal, process.argv[3]); etatB = await joue(B);
    /* détection réelle des classes sans règle CSS (celle du n°7 était inerte) */
    const sr = await B.evaluate(`(function(){
      var cls=[].concat.apply([],[].slice.call(document.querySelectorAll('#contenu [class]')).map(function(e){return [].slice.call(e.classList);}));
      cls=[...new Set(cls)];
      var css=[].slice.call(document.styleSheets).map(function(s){try{return [].slice.call(s.cssRules).map(function(r){return r.cssText||'';}).join(' ');}catch(e){return '';}}).join(' ');
      return cls.filter(function(c){ return css.indexOf('.'+c)<0; });
    })()`);
    if (sr.length) ecartsCSS.push('classes sans r\u00e8gle CSS dans le cadre: ' + sr.join(' '));
  } else { throw new Error('mode inconnu'); }

  const ecartsCSS=[];
  const ecarts = comparer(etatA, etatB).concat(ecartsCSS);
  console.log(JSON.stringify({
    mode, verdict: ecarts.length ? 'ÉCARTS' : 'IDENTIQUE',
    ecarts, erreursJS: journal.erreurs, dialogues: journal.dialogues
  }, null, 1));
  await b.close();
  process.exit(ecarts.length && mode !== 'AvsCasse' ? 1 : 0);
})().catch(e => { console.error('KO:', e.message); process.exit(2); });
