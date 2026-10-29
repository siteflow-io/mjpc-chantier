/* ═══ dr-tableau.js — E3, le tableau (contrat des quatre §6 ; mandat E3) ═══════════════════════════════
   Ce que ça change en classe : « ⧉ Ouvrir le tableau » ouvre le SITE LUI-MÊME en lecture seule
   (`index.html?vue=tableau&local=1`) ; il reçoit l'état du tableau du pilote et le rend avec le MÊME
   rendu (`rendre` du socle) — plus de fenêtre écrite à la main, plus de fonctions recopiées (`inj` tombe).
   Un autre appareil ouvre `?vue=tableau` : il lit la scène au hub (`C/scene` = l'état du tableau) et la
   rend par le même chemin, `dr_rendreMur`. Il garde sa dernière image quand le pilote se ferme ou gèle.
   Règles tenues ici (contrat §5) : aucune écriture autrement que par `dr_ecrire` ; aucune en vue tableau,
   en répétition, dans l'atelier, hors d'une heure lancée ; la diapo est désignée par son `eid`, `si`/`di` ne sont
   qu'un repli (relance du 21/10 13:15, C7). Tout est préfixé `dr_` / `DR_TAB`.
   ═══════════════════════════════════════════════════════════════════════════════════════════════════ */
var DR_TAB = { fen: null, montre: null, ts: 0, trameMaj: 0, ecrans: null, documents: null, si: null,
  emis: '', emT: null, trameSig: '', trameT: null, tic: 0, veilleT: null, ecrT: null,
  sondeT: null, pointeurT: null, cle: '', lu: false };

const dr_estTableau = () => /[?&]vue=tableau(&|$)/.test(location.search);   /* la même lecture que `SES.mode`, mais sûre au chargement du module (SES n'existe pas encore) */
const dr_tabLocal = () => /[?&]local=1(&|$)/.test(location.search);

/* ─── 13 · 44 (contrat §12.27 (9)) : la fenêtre du tableau ne montre JAMAIS un écran du prof. Elle porte la session du prof (le
   `sessionStorage` de l'onglet du pilote, recopié par `window.open`) : sans `?n=`, `restoreSession` → `_atterrirProf` → `verifierAlerteRegles`
   y ouvrait, à J + 29, « ⚠️ Vérifier les règles Firebase » devant la classe, au vidéoprojecteur. Dans la page tableau (locale ou distante),
   les gestes qui ouvrent un écran du prof (et `_initOutilsProf`, contrat §12.27 (12)) ne font rien et sont comptés (`DR_TAB.refuses`) ; la page du prof (le pilote) les garde tous.
   Deux temps : ceux déjà déclarés au chargement de ce module, puis ceux du site déclarés après lui (l'EDT), au DOMContentLoaded ; et une
   seconde ligne, le CSS : ces écrans restent cachés dans la page tableau même si un chemin oublié les posait. ─── */
const DR_TAB_ECRANS_DU_PROF = ['verifierAlerteRegles', 'ouvrirOverlayRegles', '_initOutilsProf', 'simulerJ29', 'fichesVerifierAlerte', 'openProfPanel', 'showProfSection', 'atelierOuvrir', 'edtArriveeProf', 'edtOuvrir'];
function dr_tabSansEcranDuProf(){
  DR_TAB.refuses = DR_TAB.refuses || [];
  DR_TAB_ECRANS_DU_PROF.forEach(nom => { const f = window[nom]; if (typeof f !== 'function' || f.__drTab) return;
    const muet = function(){ DR_TAB.refuses.push(nom); return false; }; muet.__drTab = true; try { window[nom] = muet; } catch (e) {} });
}
if (dr_estTableau()) {
  dr_tabSansEcranDuProf(); document.addEventListener('DOMContentLoaded', dr_tabSansEcranDuProf);
  try { document.documentElement.classList.add('dr-vue-tableau'); const st = document.createElement('style'); st.id = 'dr-tab-sans-prof';
    st.textContent = 'html.dr-vue-tableau :is(.m8-overlay,#m8-regles-overlay,.fi-overlay,.tprof-overlay,#edt-ecran,#atelier-ecran,.doc-viewer-overlay,#tprof-testpill,.admin-banner){display:none!important}';
    (document.head || document.documentElement).appendChild(st); } catch (e) {}
}

/* ─── la lecture : `dr_lire` du socle (secuLire, mode test) — `sesGet` tombe (relance C5) ─── */
function dr_tabLire(chemin, cb){
  try { dr_lire(chemin, v => cb(v === undefined ? null : v)); } catch (e) { cb(undefined); }   /* undefined = la lecture n'a pas pu partir */
}

/* ═══ CÔTÉ PILOTE ═══════════════════════════════════════════════════════════════════════════════════ */

/* « ⧉ Ouvrir le tableau » (#bvideoproj) et l'ancien « Ouvrir la vue tableau » (`sesOuvrirTableau`) :
   une seule fenêtre, la page elle-même. Déjà ouverte : elle passe devant. */
function dr_ouvrirTableau(){
  if (DR_TAB.fen && !DR_TAB.fen.closed) { try { DR_TAB.fen.focus(); } catch (e) {} return DR_TAB.fen; }
  const f = window.open(location.pathname + '?vue=tableau&local=1', 'tableau', 'width=1100,height=640');
  if (!f) { try { atInfo('La fenêtre du tableau n’a pas pu s’ouvrir — autorise les fenêtres pop-up pour ce site.'); } catch (e) {} return null; }
  DR_TAB.fen = f;
  try { fenetreMur = f; } catch (e) {}   /* `pousser` du socle envoie l'état à `fenetreMur` (maquette l. 923-936) : c'est cette page-ci qui le reçoit */
  try { f.focus(); } catch (e) {}
  return f;
}
const DR_TAB_BULLE = 'Ouvre le tableau dans une nouvelle fenêtre, à envoyer sur le vidéoprojecteur (Win+K ou Win+P « Étendre », puis F11). '
  + 'Il montre exactement ce que voit la classe — la diapo, ce qui est dévoilé, la page, la taille du texte — et rien de ton pilotage. '
  + 'Gelé, il ne bouge plus ; fermé, il se rouvre ici, sur ce que la classe voit.';

/* ─── le crochet du socle (relance F7 / C1) : `pousser` (après le journal), `fermerFiche`, la sortie de l'atelier et la répétition
       appellent `dr_versMur(et)` — ou `dr_versMur(null, {sortie:true})`. Ici vivent l'envoi à la fenêtre et la scène au hub. ─── */
function dr_versMur(et, x){
  x = x || {};
  if (et && typeof S === 'object' && S && S.qui && !S.gel && typeof quiAParticipe === 'function') {   /* M4 : « qui a participé » suit la parole */
    try { S.qui = quiAParticipe(); et.qui = S.qui; } catch (e) {}
  }
  const f = (DR_TAB.fen && !DR_TAB.fen.closed) ? DR_TAB.fen : ((typeof fenetreMur !== 'undefined' && fenetreMur && !fenetreMur.closed) ? fenetreMur : null);
  if (f) {
    try {
      if (!et) {
        /* le socle appelle `dr_versMur(null, {sortie:true})` pour deux gestes (dr_auMur) : refermer la fiche ouverte (`fermerFiche` : S.fichePage
           est encore posé — la fenêtre anime la sortie et garde l'image, comme la maquette) ou n'avoir plus rien au mur (l'atelier, l'arrêt
           d'une répétition sans état d'avant : la fenêtre se vide, K10) */
        const fiche = typeof S === 'object' && S && S.fichePage;
        f.postMessage(fiche ? { sortie: true } : Object.assign({ et: null }, x), '*');
      } else { let ecran = x.ecran; if (ecran === undefined) { try { ecran = dr_ecranVu(dr_seances()[et.si].ecrans[et.di]); } catch (e) { ecran = null; } }
        let docs = x.documents; if (docs === undefined) { try { docs = (dr_documents() || {})[String(et.si)] || []; } catch (e) { docs = []; } }
        f.postMessage({ et: dr_tabAvecEtiquette(et), ecran, documents: docs, feuilles: dr_tabFeuillesDe(et) }, '*'); }
    } catch (e) {}
  }
  if (et) dr_sceneAuto();
}

/* §12.74 (1) : la feuille du site montrée part avec l'état vers la fenêtre locale (elle ne lit pas le hub) */
/* §12.74 (2) : l'étiquette entière part avec l'état (le tableau n'a pas les activités du chapitre) */
function dr_tabAvecEtiquette(et){ if (!et || typeof dr_etiquetteDe !== 'function') return et; const t = dr_etiquetteDe(et); return t == null ? et : Object.assign({}, et, { etiquette: t }); }
function dr_tabFeuillesDe(et){ try { const r = et && et.doc && et.doc.feuille; const d = r && typeof DR_FEUILLES !== 'undefined' ? DR_FEUILLES.doc[r] : null; return d ? { [r]: d } : null; } catch (e) { return null; } }
/* la fenêtre dit `pret` à l'ouverture (comme la maquette) : on lui pousse ce que la classe voit, gel compris (p8-5g, point 1).
   Elle redit `ici` toutes les 3 s : un pilote RECHARGÉ (réveil n°6 : écrire, recharger, « Reprendre le cours ») ne connaît plus la fenêtre
   qu'il avait ouverte ; il l'adopte à ce signe et lui renvoie ce que voit la classe. Un pilote qui la connaît déjà ignore `ici`. */
/* EX ⑧ (K7) : ce renvoi remontre ce que la classe voit DÉJÀ — sans les marques d'entrée du dernier geste. `S.mur` garde `neuf` (la ligne
   que le dernier ▶ a dévoilée), `arrivee` (la diapo qui vient d'arriver) et `ficheEntre` (la fiche qui s'ouvre) : renvoyées telles quelles,
   la fenêtre qui s'ouvre rejouait l'entrée (`.neuf-vu`, opacité 0 → 1 en 0,62 s) — la dernière ligne dévoilée y était invisible à
   l'instant de la réception (pilote « page 2 / 2 » 4 l. · tableau 3 l.). Le pointeur `flash` reste : c'est un état, pas une entrée. */
function dr_tabSansEntree(et){ return et ? Object.assign({}, et, { neuf: null, arrivee: false, ficheEntre: false }) : et; }
window.addEventListener('message', ev => {
  if (dr_estTableau() || !ev.data || !(ev.data.pret || ev.data.ici)) return;
  const connue = DR_TAB.fen && !DR_TAB.fen.closed;
  if (ev.data.ici && connue) return;
  if (!connue && ev.source) DR_TAB.fen = ev.source;
  if (ev.source && DR_TAB.fen && ev.source !== DR_TAB.fen) return;
  if (ev.data.ici && !(typeof S === 'object' && S && S.lancee)) return;   /* rien à montrer tant que l'heure n'est pas (re)lancée */
  try {
    if (typeof S !== 'object' || !S) return;
    if (!S.atelier) { pousser(dr_tabSansEntree(S.mur || S.gel || etatComplet())); return; }
    /* Paul est dans l'Atelier en pleine heure (`pousser` n'y pousse rien, p1) : la fenêtre rouverte ou rechargée remontre quand même
       ce que voit la classe, sans rien écrire ni journaliser (relecteur 2, n° 3) */
    const et = dr_tabSansEntree(S.gel || S.mur); if (!et || !DR_TAB.fen || DR_TAB.fen.closed) return;
    let ecran = null; try { ecran = dr_ecranVu(dr_seances()[et.si].ecrans[et.di]); } catch (e) {}
    DR_TAB.fen.postMessage({ et: dr_tabAvecEtiquette(et), ecran, feuilles: dr_tabFeuillesDe(et) }, '*');   /* directement : pas de scène au hub depuis l'Atelier */
  } catch (e) {}
});
/* le clic sur « ⧉ Ouvrir le tableau », d'où que vienne le bouton (le gabarit est posé plus tard par `atVuesPoser`) :
   capté avant tout autre écouteur, pour qu'aucune seconde fenêtre (l'ancienne `document.write`) ne s'ouvre */
document.addEventListener('click', ev => {
  const b = ev.target && ev.target.closest && ev.target.closest('#bvideoproj');
  if (!b || dr_estTableau()) return;
  ev.preventDefault(); ev.stopImmediatePropagation(); dr_ouvrirTableau();
}, true);
document.addEventListener('mouseover', ev => {
  const b = ev.target && ev.target.closest && ev.target.closest('#bvideoproj');
  if (b && b.title !== DR_TAB_BULLE) b.title = DR_TAB_BULLE;
}, true);

/* ─── la scène au hub : `C/scene` = `et` + {eid, origine, ts, trameMaj} (mandat point 3) ─── */
function dr_tabPeutEcrire(){
  try {
    if (dr_estTableau() || typeof S !== 'object' || !S) return false;
    if (!S.lancee || S.close || S.atelier || S.repetition) return false;          /* p1, p6 : ni atelier, ni répétition */
    if (document.body.classList.contains('vue-relecture')) return false;        /* réveil n°3 (a) : rien ne part depuis la Relecture (« ma version ») */
    if (typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME !== 'classe') return false;   /* rien tant que l'heure n'est pas lancée */
    return typeof dr_cheminC === 'function' && !!dr_cheminC();
  } catch (e) { return false; }
}
function dr_scene(et){
  et = et || (typeof S === 'object' && S ? S.mur : null); if (!et) return null;
  const sc = JSON.parse(JSON.stringify(et));
  delete sc.pilote; delete sc.ecrire; delete sc.atelier; delete sc._blocActif;   /* ce qui ne regarde que l'écran de Paul */
  let eid = sc.eid; try { if (!eid && typeof eidDe === 'function') eid = eidDe(sc.di); } catch (e) {}
  sc.eid = eid || null;
  sc.origine = (typeof SES === 'object' && SES) ? SES.id : 'pilote';
  sc.ts = Math.max(Date.now(), (DR_TAB.dernierTs || 0) + 1); DR_TAB.dernierTs = sc.ts;   /* toujours croissant : deux scènes dans la même milliseconde (ou une horloge figée) restent ordonnées */
  sc.trameMaj = DR_TAB.trameMaj || 0;
  try { const t = dr_etiquetteDe(et); if (t != null) sc.etiquette = t; } catch (e) {}   /* §12.74 (2) : l'étiquette entière, numéro compris */
  try { const hc = (typeof dr_horlogeCase === 'function') ? dr_horlogeCase() : null; sc.hdec = hc ? hc.dec + hc.saut : 0; } catch (e) { sc.hdec = 0; }   /* §12.66 (2) : l'écart de l'horloge de la case (les De Gaulle) — l'horloge du tableau distant le suit */
  return sc;
}
function dr_sceneAuto(vite){
  clearTimeout(DR_TAB.emT);
  DR_TAB.emT = setTimeout(() => {
    if (!dr_tabPeutEcrire() || !S.mur) return;
    const sc = dr_scene(S.mur); if (!sc) return;
    if (dr_ttOn()) { dr_ecrire(dr_cheminC() + '/scene', sc, 'La scène du tableau (ce que voit la classe)', () => {}); return; }   /* §12.66 (1) : en mode test, ce dépôt reste au magasin du mode test ; le témoin « ● session » suit l'adresse du mode test (dr_ttEmettre) */
    clearTimeout(DR_TAB.ecrT); DR_TAB.ecrT = setTimeout(() => dr_sessionEtat(false), 5000);   /* sans accusé en 5 s : la session est coupée */
    dr_ecrire(dr_cheminC() + '/scene', sc, 'La scène du tableau (ce que voit la classe)', () => { clearTimeout(DR_TAB.ecrT); dr_sessionEtat(true); });
  }, vite ? 0 : 250);   /* le débounce de `sesEmettre` */
}

/* ═══ §12.66 (1) — LE TABLEAU DISTANT EN MODE TEST (Paul, 28/10 18:32) ═══════════════════════════════════════════════════════════════
   En mode test (`m8TestOn`), tout le transport du site va au magasin du mode test : rien ne part au hub, et le tableau distant (l'ordinateur
   de la classe, `?vue=tableau`) ne voyait rien. Une seule chose part désormais, l'IMAGE DU TABLEAU, à une adresse à elle, `/site/tableau_test`
   ({ pointeur, scene, ecrans }, le format de `/site/repetition`), pour une heure lancée en mode test comme pour une répétition en mode test.
   Rien d'autre : ni la copie (`deroule_joue`), ni le journal, ni le récit, ni le cahier, ni la présence, ni `/site/cours_actif` — ceux-là restent
   au magasin. L'écriture est un `fetch` direct (le transport du site la garderait au magasin), et elle refuse toute adresse hors de `/site/tableau_test`.
   À l'arrêt de la répétition ou à la clôture de l'heure, le pointeur et la scène sont retirés s'ils sont encore les nôtres → le tableau
   distant revient à l'horloge. Le tableau distant lit une heure lancée d'abord, puis la répétition, puis le mode test (`dr_tabLirePointeur`). */
const DR_TT = { chemin: '/site/tableau_test', quoi: null, sig: null, emis: '', trame: '', trameMaj: 0, T: null, n: 0 };
function dr_ttOn(){ try { return !dr_estTableau() && typeof m8TestOn === 'function' && !!m8TestOn(); } catch (e) { return false; } }
function dr_ttEcrire(sous, valeur, retrait){
  if (dr_estTableau() || (!retrait && !dr_ttOn()) || typeof FIREBASE_BASE === 'undefined' || typeof sous !== 'string' || sous.indexOf('..') >= 0) return Promise.resolve(false);
  DR_TT.n++;
  try { return fetch(FIREBASE_BASE + DR_TT.chemin + sous + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valeur) }).then(r => !!(r && r.ok), () => false); }
  catch (e) { return Promise.resolve(false); }
}
/* une lecture du hub lui-même (un GET), pas du magasin du mode test : savoir si le pointeur est encore le nôtre, si une heure tourne ailleurs */
function dr_ttLireHub(chemin, cb){
  try { fetch(FIREBASE_BASE + chemin + '.json').then(r => (r && r.ok) ? r.json() : undefined, () => undefined).then(v => cb(v), () => cb(undefined)); } catch (e) { cb(undefined); }
}
/* quoi : 'heure' (l'heure lancée en mode test) ou 'repetition' ; p : { niveau, chapitre, seance, classeSlug, classeNom } */
function dr_ttDebut(quoi, p){
  clearInterval(DR_TT.T); DR_TT.T = null;
  if (!dr_ttOn() || !p) return;
  const ptr = Object.assign({}, p, { seance: String(p.seance), test: true, quoi, chemin: DR_TT.chemin, ts: Date.now() });
  DR_TT.quoi = quoi; DR_TT.sig = ptr.ts + '|' + ptr.seance; DR_TT.emis = ''; DR_TT.trame = '';
  dr_ttEcrire('/scene', null); dr_ttTrame(true); dr_ttEcrire('/pointeur', ptr);
  DR_TT.T = setInterval(dr_ttEmettre, 250);
}
function dr_ttTrame(force){ try { const E = JSON.parse(JSON.stringify(seance().ecrans)); const em = JSON.stringify(E); if (!force && em === DR_TT.trame) return false; DR_TT.trame = em; DR_TT.trameMaj = Date.now(); dr_ttEcrire('/ecrans', E); return true; } catch (e) { return false; } }
function dr_ttEmettre(){
  if (!DR_TT.sig) { clearInterval(DR_TT.T); DR_TT.T = null; return; }
  if (!dr_ttOn()) { dr_ttFin(); return; }   /* le mode test s'éteint : ce qui est à nous se retire */
  if (typeof S !== 'object' || !S) return;
  if (DR_TT.quoi === 'repetition' ? !S.repetition : !(S.lancee && !S.close && !S.repetition)) return;
  if (S.atelier || document.body.classList.contains('vue-relecture')) return;   /* comme une heure lancée : rien depuis l'Atelier ni la Relecture */
  dr_ttTrame(false);
  if (!S.mur || typeof dr_scene !== 'function') return;
  const sc = dr_scene(S.mur); if (!sc) return; sc.trameMaj = DR_TT.trameMaj || 0;
  const cle = JSON.stringify(Object.assign({}, sc, { ts: 0, origine: '' })); if (cle === DR_TT.emis) return; DR_TT.emis = cle;
  const heure = DR_TT.quoi === 'heure';
  dr_ttEcrire('/scene', sc).then(ok => { if (heure) try { dr_sessionEtat(ok); } catch (e) {} });
}
function dr_ttFin(){
  clearInterval(DR_TT.T); DR_TT.T = null; const sig = DR_TT.sig; DR_TT.sig = null; DR_TT.quoi = null; DR_TT.emis = ''; DR_TT.trame = '';
  if (!sig) return;
  dr_ttLireHub(DR_TT.chemin + '/pointeur', c => { if (c && (c.ts + '|' + c.seance) === sig) { dr_ttEcrire('/pointeur', null, true); dr_ttEcrire('/scene', null, true); } });   /* seulement s'il est encore le nôtre */
}
/* l'heure lancée en mode test : son pointeur part avec celui du cours (`dr_coursEcrire`), il se retire à la clôture (`dr_coursFermer`) */
function dr_ttHeureDebut(c){ if (!dr_ttOn() || !c) return; dr_ttDebut('heure', { niveau: c.niveau, chapitre: c.chapitre, seance: c.seance, classeSlug: c.classeSlug || '', classeNom: c.classeNom || '' }); }
function dr_ttHeureFin(){ if (DR_TT.quoi === 'heure') dr_ttFin(); }
/* le témoin « ● session » (relance F8 : `sesBandeau`/`sesBandeauEtat` tombent ; E1 pose `#dr-session` dans `.haut`, je le remplis) */
function dr_sessionEtat(ok){
  const s = document.getElementById('dr-session'); if (!s) return;
  if (ok) { DR_TAB.perduDepuis = 0; s.className = 'dr-session'; s.textContent = '\u25cf session';
    s.title = 'Ce que voit la classe part bien vers le tableau distant (l\u2019ordinateur de la classe) : il suit.'; }
  else { if (!DR_TAB.perduDepuis) DR_TAB.perduDepuis = Date.now(); const h = new Date(DR_TAB.perduDepuis).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    s.className = 'dr-session dr-session-ko'; s.textContent = '\u25cf session coupée depuis ' + h;
    s.title = 'Depuis ' + h + ', le site n\u2019arrive plus à envoyer (réseau coupé ?) : le tableau distant garde la dernière image reçue ; la fenêtre du tableau, sur cet ordinateur, continue de suivre.'; }
}

/* ─── la participation : `C/part` tombe (relance C8 : plus de lecteur ; elle vit dans `C/etat` et le journal, chez E2) ─── */

/* ─── la veille du pilote : la copie jouée (une fois par seconde) — quand elle change, `trameMaj` avance et la scène le dit.
       L'état du tableau, lui, part par le crochet `dr_versMur` que `pousser` appelle (pendant le gel, rien ne part). ─── */
/* « Adresse du tableau » (relance F5 : le QR tombe avec le téléphone — il attendait une écriture que la vue tableau ne fait jamais) :
   un bouton à côté de « ⧉ » qui AFFICHE l'adresse `?vue=tableau` à taper sur l'ordinateur de la classe. Aucune écriture. */
const DR_TAB_BULLE_ADR = 'Le tableau sur un autre appareil : montre l\u2019adresse à ouvrir dans Chrome sur l\u2019ordinateur de la classe. '
  + 'Il attend le cours, puis suit ce que voit la classe, sans jamais rien écrire.';
function dr_tabAdresse(){
  if (document.getElementById('dr-tab-adr-boite')) return;
  const url = location.origin + location.pathname + '?vue=tableau';
  const d = document.createElement('div'); d.className = 'ses-qr-fond'; d.id = 'dr-tab-adr-boite';
  d.innerHTML = '<div class="ses-qr-boite"><button class="ses-qr-x" id="dr-tab-adr-x" title="Ferme cette fenêtre">\u2715</button>'
    + '<h3>Le tableau sur un autre appareil</h3>'
    + '<p>Sur l\u2019ordinateur branché au vidéoprojecteur, ouvre cette adresse dans Chrome : il attend le cours, puis suit ce que voit la classe. Il n\u2019écrit jamais rien. Un clic sur sa page le met en plein écran.</p>'
    + '<div class="ses-qr-url" id="dr-tab-adr-url"></div></div>';
  d.querySelector('#dr-tab-adr-url').textContent = url;
  d.addEventListener('click', ev => { if (ev.target === d || ev.target.id === 'dr-tab-adr-x') d.remove(); });
  document.body.appendChild(d);
}
function dr_tabPoserBoutons(){
  const b = document.getElementById('bvideoproj'); if (!b) return;
  if (b.title !== DR_TAB_BULLE) b.title = DR_TAB_BULLE;   /* une seule infobulle pour ce geste, dès qu'il est à l'écran (relecteur 1, n° 4) */
  if (document.getElementById('dr-tab-adr')) return;
  const q = document.createElement('button'); q.className = 'btn'; q.id = 'dr-tab-adr'; q.type = 'button'; q.textContent = 'Adresse du tableau';
  q.title = DR_TAB_BULLE_ADR; q.onclick = dr_tabAdresse;
  b.insertAdjacentElement('afterend', q);
}
/* le témoin de la vue « ⧉ Tableau » (réveil n°3 (b) ; cadrage 1 §1.8 : le libellé seulement si un support est connecté) : « tableau en Win K »
   n'existe que si la fenêtre du tableau est ouverte ; le tableau distant ne se déclare pas (il n'écrit jamais) : rien n'est affirmé pour lui.
   `vueDroite` (E1) peut l'appeler ; en attendant, la veille corrige ce qu'elle a écrit. */
function dr_tabTemoin(){
  const f = DR_TAB.fen && !DR_TAB.fen.closed; if (!f) return '';
  const coupe = typeof S === 'object' && S && S.coupure;
  return '<span class="pt-cnx ' + (coupe ? 'rouge' : 'vert') + '"></span> ' + (coupe ? 'déconnecté' : 'tableau en Win K');
}
function dr_tabVeiller(){
  try { dr_tabPoserBoutons(); } catch (e) {}
  try { const t = document.getElementById('vue-temoin'); if (t && typeof S === 'object' && S && S.vueTableau) { const h = dr_tabTemoin(); if (t.innerHTML !== h) t.innerHTML = h; } } catch (e) {}
  if (!dr_tabPeutEcrire()) return;
  /* M4 : une parole n'appelle pas `pousser` — « qui a participé », s'il est au tableau, se recalcule ici et repart par `pousser` (dr_tout) */
  if (S.qui && !S.gel && typeof quiAParticipe === 'function') { try { const q = quiAParticipe(); if (JSON.stringify(q) !== JSON.stringify(S.qui)) { S.qui = q; dr_tout(); } } catch (e) {} }
  if (true) {   /* chaque tour (une fois par seconde) : la copie jouée a-t-elle changé ? */
    let ts = ''; try { const t = (typeof dr_trame === 'function') ? dr_trame() : null; ts = t ? JSON.stringify(t) : ''; } catch (e) {}
    if (ts && ts !== DR_TAB.trameSig) {
      const premier = DR_TAB.trameSig === ''; DR_TAB.trameSig = ts;
      clearTimeout(DR_TAB.trameT);
      /* APRÈS la poussée réelle de la copie (`dr_sauve`, débounce 900 ms) — jamais l'annonce avant la marchandise */
      DR_TAB.trameT = setTimeout(() => { DR_TAB.trameMaj = Date.now(); if (!premier) dr_sceneAuto(); }, premier ? 0 : 1100);   /* la copie a changé : la scène le dit au distant */
    }
  }
}
if (!dr_estTableau()) DR_TAB.veilleT = setInterval(dr_tabVeiller, 1000);   /* §12.56 (4) : une fois par seconde (était 125 ms, huit fois par seconde) */

/* ═══ CÔTÉ TABLEAU (`?vue=tableau`, `&local=1`) ═══════════════════════════════════════════════════ */

function dr_tabMur(){ return document.getElementById('mur2'); }

/* le rendu, unique pour la fenêtre locale, l'appareil distant et la vue « ⧉ Tableau » : `rendre` du socle */
function dr_rendreMur(et, ecran, cible){
  const m = cible || dr_tabMur(); if (!m) return;
  if (!et) { m.innerHTML = ''; DR_TAB.montre = null; return; }   /* rien au mur (sortie de la répétition sans état d'avant : K10) */
  if (ecran) dr_tabPoserEcran(et, ecran);
  const e2 = Object.assign({}, et, { pilote: false });
  if (!cible) { DR_TAB.montre = e2; const a = document.getElementById('ses-tab-att'); if (a) a.style.display = 'none'; }
  m.classList.add('mur'); m.classList.add('tableau');
  try { rendre(m, e2); } catch (e) { try { console.warn('[tableau] rendu : ' + e.message); } catch (e2) {} }
}
/* l'écran reçu (avec l'état, ou relu dans `C/ecrans`) devient celui que le rendu du socle lit
   (dans la maquette : `DATA.seances[si].ecrans[di]`, que la fenêtre écrivait elle-même, l. 1810) */
function dr_tabPoserEcran(et, ecran){
  DR_TAB.si = et.si; DR_TAB.ecrans = DR_TAB.ecrans || []; DR_TAB.ecrans[et.di] = ecran;
  try { if (typeof dr_tabTrame === 'function') return; } catch (e) {}   /* le socle lit `DR_TAB` lui-même (interface à confirmer avec E1) */
  try { if (window.DATA && DATA.seances && DATA.seances[et.si]) DATA.seances[et.si].ecrans[et.di] = ecran; } catch (e) {}
}

/* §12.72 (Paul, 29/10 10:41 : « tu fais en sorte que le tableau distant s'affiche en plein écran (autorisation google évidemment) ») : Chrome
   n'ouvre le plein écran que sur un geste de l'utilisateur. Le premier clic, toucher ou touche sur la page du tableau distant le demande ; sorti par
   Échap, le geste suivant le redemande. Le clic sur la ligne de la clé USB est laissé à la clé (son autorisation a besoin du même geste). Rien n'est
   affiché à la classe. */
function dr_tabPleinEcran(ev){
  try { const d = document; if (d.fullscreenElement || d.webkitFullscreenElement) return;
    if (ev && ev.target && ev.target.closest && ev.target.closest('#ses-tab-cle')) return;
    const el = d.documentElement; const f = el.requestFullscreen || el.webkitRequestFullscreen; if (!f) return;
    const r = f.call(el); if (r && typeof r.catch === 'function') r.catch(() => {}); } catch (e) {}
}
/* la page tableau : on cache le site, on pose l'attente, le mur et le témoin « interrompu » */
function dr_tabPoser(){
  if (document.getElementById('ses-tab')) return;
  /* le gabarit du pilotage (#dr-zone, garé dans <body> par dr-gabarit.js) n'a rien à faire dans la page tableau : vidé, il n'y laisse
     pas de #mur (les contrôles lisent `#mur` d'abord, audit I3). Provisoire : demandé à E1 de ne pas le poser en page tableau. */
  /* (relecteur 1, n° 5 : la vider faisait planter `tick` du socle, qui cherche #fin) — on ne retire que l'id du mur caché */
  try { const m = document.querySelector('#dr-zone #mur'); if (m) m.id = 'dr-mur-gare'; } catch (e) {}
  const z = document.createElement('div'); z.id = 'ses-tab'; z.className = 'ses-tab';
  z.innerHTML = '<div class="ses-tab-attente" id="ses-tab-att">'
    + '<div class="n">monsieurjaipascompris</div><div class="h" id="ses-tab-h">--:--</div>'
    + '<div class="d" id="ses-tab-d"></div><div class="c" id="ses-tab-c" style="display:none"></div>' + (dr_tabLocal() ? '' : '<button class="c" id="ses-tab-cle"></button>') + '</div>'
    + '<div class="mur tableau" id="mur2"></div>'
    + '<div class="ses-tab-perdu" id="ses-tab-perdu"></div>';
  [].slice.call(document.body.children).forEach(el => { el.style.display = 'none'; });
  document.body.appendChild(z); document.body.classList.add('ses-corps-tab');
  if (!dr_tabLocal()) ['pointerdown', 'keydown', 'touchstart'].forEach(ty => document.addEventListener(ty, dr_tabPleinEcran, true));   /* §12.72 : le plein écran au premier geste */
  if (!document.getElementById('dr-tab-style')) {
    const st = document.createElement('style'); st.id = 'dr-tab-style';
    st.textContent = '#ses-tab #mur2{position:absolute;inset:0;margin:auto;width:min(100vw,calc(100vh * 16 / 9));height:auto;aspect-ratio:16/9;border-radius:0;box-shadow:none}'
      /* §12.66 (5) : la ligne de la clé USB quitte le centre — en bas à droite, petite et pâle, toujours cliquable ; l'horloge et la date restent seules au centre */
      + '#ses-tab #ses-tab-cle{position:absolute;right:1.6vh;bottom:1.4vh;max-width:46vw;cursor:pointer;background:transparent;color:inherit;font:inherit;font-size:1.5vh;line-height:1.3;padding:.4vh 1.2vh;border-color:#3a322b;opacity:.42;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '#ses-tab #ses-tab-cle:hover,#ses-tab #ses-tab-cle:focus-visible{opacity:.9}';
    document.head.appendChild(st);
  }
  const horloge = () => { const d = new Date(Date.now() + ((SES && SES.ctx && isFinite(DR_TAB.hdec)) ? DR_TAB.hdec : 0)), J = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], M = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const h = document.getElementById('ses-tab-h'), dd = document.getElementById('ses-tab-d');
    const th = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2), td = J[d.getDay()] + ' ' + d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear();
    if (h && h.textContent !== th) h.textContent = th; if (dd && dd.textContent !== td) dd.textContent = td; };   /* §12.56 (1)(d) : seulement le chiffre qui change */
  DR_TAB.horloge = horloge; horloge(); setInterval(horloge, 1000);
  if (!dr_tabLocal()) { dr_tabCleMaj(); setInterval(dr_tabCleMaj, 3000); const bc = document.getElementById('ses-tab-cle'); if (bc) bc.onclick = async () => { const e = DR_CLE.etat; if (e === 'a-autoriser') await dr_cleAutoriser(); else if (e === 'vu') await dr_cleScanner(); else await dr_cleDesigner(); dr_tabCleMaj(); }; }
  window.addEventListener('resize', () => { if (DR_TAB.montre) dr_rendreMur(DR_TAB.montre); });
}

/* E1 (§12.44, 4 bis) : sur l'ordi de classe (la vue du tableau, sur l'écran d'attente seulement — jamais devant la classe pendant l'heure), la clé USB des vidéos :
   la désigner une fois, l'autoriser à chaque ouverture (le navigateur redemande l'accord), la voir. L'état part au site par `dr_cleRapporter` (la seule écriture de la vue). */
function dr_tabCleMaj(){ const b = document.getElementById('ses-tab-cle'); if (!b || typeof DR_CLE === 'undefined') return; const e = DR_CLE.etat, n = DR_CLE.nom;
  const t = e === 'vu' ? '✔ Clé USB « ' + n + ' » · ' + DR_CLE.fichiers.length + ' fichier' + (DR_CLE.fichiers.length > 1 ? 's' : '') : e === 'a-autoriser' ? 'Clé USB « ' + n + ' » : autoriser la lecture' : e === 'pas-vu' ? '✘ Clé USB « ' + n + ' » : branche la clé, ou désigne son dossier' : 'Clé USB des vidéos : désigner son dossier (une fois sur cet ordi)';
  if (b.textContent !== t) b.textContent = t; b.title = e === 'vu' ? 'Cet ordi lit les vidéos de la clé ; un clic relit la clé' : 'Les vidéos se lisent depuis la clé branchée sur cet ordi : un clic pour ' + (e === 'a-autoriser' ? 'donner l’accord du navigateur' : 'choisir le dossier de la clé'); }
/* la classe attendue (réveil n°3 : tranché) — en page tableau sans cours actif, la grille de l'EDT est lue EN LECTURE SEULE (`dr_lire` :
   grille, calendrier, classes ; jamais le module EDT, qui écrit à son ouverture) et la case du moment se calcule pour le niveau de la page
   (`?n=`) avec la règle de `dr_proposer` (E2) : aujourd'hui, une heure MJPC de la bonne semaine (A/B), en cours ou la prochaine, hors vacances
   et fériés. `dr_caseDuMoment` d'E2, s'il existe (fonction pure), fait foi ; sinon `dr_tabCaseDuMoment` ci-dessous. Sans grille : rien. */
const DR_TAB_JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
function dr_tabAnnee(d){ const y = d.getFullYear(); return d.getMonth() >= 7 ? y + '-' + (y + 1) : (y - 1) + '-' + y; }
function dr_tabIso(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
/* §12.31 (13 · 51) : une classe se trouve par son nom comme par sa clé. Une seule règle, celle d'`edtCleClasse` (E1) : le nom s'il est
   une clé ; sinon la clé dont `nom` est égal ; sinon la clé dont `_slugifyClass` est égale ; sinon le nom. Ici sur les `classes` lues
   au hub (la page tableau ne charge pas l'EDT) ; `edtCleClasse` fait foi quand elle existe et donne une clé de ces classes. */
function dr_tabCle(classes, nom){
  if (nom == null || nom === '') return nom; const n = String(nom);
  if (!classes || typeof classes !== 'object') return n;
  if (Object.prototype.hasOwnProperty.call(classes, n)) return n;
  try { if (typeof edtCleClasse === 'function') { const k = edtCleClasse(n); if (k != null && Object.prototype.hasOwnProperty.call(classes, k)) return k; } } catch (e) {}
  const ks = Object.keys(classes);
  const parNom = ks.find(k => classes[k] && classes[k].nom === n); if (parNom) return parNom;
  const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const sl = (typeof _slugifyClass === 'function') ? (() => { try { return _slugifyClass(n); } catch (e) { return slug(n); } })() : slug(n);
  return ks.indexOf(sl) >= 0 ? sl : n;
}
function dr_tabCaseDuMoment(grille, cal, classes, d, niveau){
  if (!grille || !Array.isArray(grille.creneaux)) return null;
  const iso = dr_tabIso(d), lundi = dr_tabIso(new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)));
  if (cal && ((cal.vacances || []).some(v => v && iso >= v.debut && iso <= v.fin) || (cal.feries || []).some(f => f && f.date === iso))) return null;   /* comme edtJourSansCours */
  const sem = ((cal && cal.semaines) || []).find(x => x && x.lundi === lundi); const lettre = sem ? (sem.lettre || null) : null;   /* comme edtSemaineLettre */
  const mn = h => { const p = String(h || '').split(':'); return (+p[0] || 0) * 60 + (+p[1] || 0); }; const m = d.getHours() * 60 + d.getMinutes();
  const niv = c => { const k = dr_tabCle(classes, c.classeMjpc || c.classe); const x = classes && classes[k]; return (x && x.niveau) || null; };
  const l = grille.creneaux.filter(c => c && c.mjpc && c.jour === DR_TAB_JOURS[d.getDay()] && (!lettre || !c.semaine || String(c.semaine).indexOf(lettre) >= 0)
      && (!niveau || niv(c) === niveau) && mn(String(c.creneau).split('-')[1]) > m)
    .sort((a, b) => String(a.creneau).localeCompare(String(b.creneau)));
  const c = l[0]; return c ? { classeNom: c.classeMjpc || c.classe, creneau: c.creneau, depuis: 'edt' } : null;
}
function dr_tabAttendre(){
  if (DR_TAB.montre || SES.ctx) return;
  const d = new Date(), an = dr_tabAnnee(d), niveau = (location.search.match(/[?&]n=([^&]+)/) || [])[1] || null;
  const dire = p => { if (DR_TAB.montre || SES.ctx) return; const c = p && p.depuis === 'edt' && (p.classeNom || p.classe);
    dr_tabDireClasse(c ? 'Classe attendue : ' + c + ' · ' + String(p.creneau || '').replace('-', ' – ') : ''); };
  dr_tabLire('/site/edt/grille/' + an, g => { if (!g) { dire(null); return; }
    dr_tabLire('/site/edt/calendrier/' + an, cal => dr_tabLire('/classes', cl => {
      const f = (typeof dr_caseDuMoment === 'function') ? dr_caseDuMoment : (gr, ca, cr, now, n) => dr_tabCaseDuMoment(gr, ca, cl, now, n);
      let p = null; try { p = f(g, cal, null, new Date(), niveau); } catch (e) {} dire(p);
    })); });
}

/* la ligne du bas de l'attente : la classe attendue, ou celle du cours trouvé ; vide, elle disparaît (appelée par `sesTabChercherCours`, `sesTabVeillePointeur`) */
function dr_tabDireClasse(t){ const el = document.getElementById('ses-tab-c'); if (el) { el.textContent = t || ''; el.style.display = t ? '' : 'none'; } }

/* la fenêtre locale : elle reçoit l'état du pilote par `postMessage` et ne lit jamais le hub */
function dr_tabRecevoir(ev){
  const d = ev.data; if (!d || typeof d !== 'object') return;
  if (d.sortie && !('et' in d)) { const t = document.querySelector('#mur2 .f-tab'); if (t) t.classList.add('ecran-sortie'); return; }   /* la fiche se referme */
  if ('et' in d && !d.et) { dr_rendreMur(null); return; }
  if (d.et) {
    if (d.feuilles && typeof dr_feuillePoser === 'function') Object.keys(d.feuilles).forEach(r => dr_feuillePoser(r, d.feuilles[r]));   /* §12.74 (1) */
    if (d.documents) { DR_TAB.documents = d.documents; try { if (window.DATA) { DATA.documents = DATA.documents || {}; DATA.documents[String(d.et.si)] = d.documents; } } catch (e) {} }
    dr_rendreMur(d.et, d.ecran);
  }
}

/* l'entrée de la page tableau — appelée par `sesBootTableau` */
function dr_tabDemarrer(){
  dr_tabPoser();
  if (dr_tabLocal()) {
    window.addEventListener('message', dr_tabRecevoir);
    try { if (window.opener) window.opener.postMessage({ pret: true }, '*'); } catch (e) {}
    setInterval(() => { try { if (window.opener && !window.opener.closed) window.opener.postMessage({ ici: true }, '*'); } catch (e) {} }, 3000);   /* le signe pour un pilote rechargé */
    return;
  }
  sesTabChercherCours();
  dr_tabAttendre(); setInterval(dr_tabAttendre, 30000);
}

/* le distant : le cours trouvé, on lit la copie jouée, puis la scène toutes les 900 ms et le pointeur toutes les 3 s */
function dr_tabCheminC(c){ if (c && c.repetition && typeof c.chemin === 'string' && (c.chemin === '/site/repetition' || c.chemin === '/site/tableau_test')) return c.chemin;   /* §12.66 (1) : le mode test a son adresse */ return '/site/' + c.niveau + '/chapitres/' + c.chapitre + '/seances/' + c.seance + '/deroule_joue/' + c.classeSlug; }   /* E1 (§12.41) : une répétition se lit sous son chemin à elle, jamais dans la copie d'une classe */
/* E1 (§12.41) : le pointeur d'une répétition retiré (« ■ Arrêter ») → l'horloge d'attente ; une heure lancée retirée garde son image (relance C3, inchangé) */
function dr_tabRetourAttente(){ DR_TAB.hdec = 0; clearInterval(DR_TAB.sondeT); DR_TAB.sondeT = null; clearInterval(DR_TAB.pointeurT); DR_TAB.pointeurT = null; SES.ctx = null; SES.tabPointeur = null; DR_TAB.montre = null; DR_TAB.ts = 0; DR_TAB.ecrans = null;
  const m = document.getElementById('mur2'); if (m) m.innerHTML = ''; const a = document.getElementById('ses-tab-att'); if (a) a.style.display = ''; try { if (DR_TAB.horloge) DR_TAB.horloge(); } catch (e) {} dr_tabDireClasse(''); try { sesTabChercherCours(); } catch (e) {} try { dr_tabAttendre(); } catch (e) {} }
/* la règle (relance F2/I1) : une scène n'est acceptée que si la clé de cours de `cours_actif` est celle de ce cours ;
   le « pilote présent » n'existe pas — sans scène neuve, l'image reste */
/* E1 (§12.41) : le pointeur que suit le tableau distant — une heure lancée (`/site/cours_actif`, frais) prime ; sinon une répétition (`/site/repetition/pointeur`) */
/* §12.66 (1) : puis le mode test (`/site/tableau_test/pointeur`) — il se suit comme une répétition (rien n'y est d'une classe ; retiré → l'horloge) */
function dr_tabLirePointeur(cb){ const frais = x => x && x.ts && (Date.now() - x.ts) <= 4 * 3600 * 1000;
  dr_tabLire('/site/cours_actif', c => { if (frais(c)) { cb(c); return; } dr_tabLire('/site/repetition/pointeur', r => { if (frais(r)) { cb(Object.assign({}, r, { repetition: true, chemin: '/site/repetition' })); return; }
    dr_tabLire('/site/tableau_test/pointeur', t => { if (frais(t)) cb(Object.assign({}, t, { repetition: true, test: true, chemin: '/site/tableau_test' })); else cb(c === undefined && r === undefined && t === undefined ? undefined : null); }); }); }); }
function dr_tabPointeur(){
  dr_tabLirePointeur(c => { if (c === undefined) return;   /* lecture échouée : on ne conclut rien */
    DR_TAB.pilotePresent = !!(c && sesTabCle(c) === SES.tabPointeur); });
}
/* la séance du chapitre (relance M2), lue par `dr_lire(B)` : ses `items` (les documents par référence d'E4) ; rangée en mémoire de la
   page tableau là où le socle la cherche (`chapitresData`), rien n'est écrit au hub */
function dr_tabLireSeance(c){
  dr_tabLire('/site/' + c.niveau + '/chapitres/' + c.chapitre + '/seances/' + c.seance, sce => {
    if (!sce || typeof sce !== 'object') return; DR_TAB.seance = sce;
    try { if (typeof chapitresData === 'object' && chapitresData) { chapitresData[c.niveau] = chapitresData[c.niveau] || {}; const ch = chapitresData[c.niveau][c.chapitre] = chapitresData[c.niveau][c.chapitre] || { seances: {} }; ch.seances = ch.seances || {}; ch.seances[c.seance] = Object.assign({}, ch.seances[c.seance] || {}, sce); } } catch (e) {}
  });
}
function dr_tabMonter(){
  if (!SES.ctx) return;
  DR_TAB.ts = 0; DR_TAB.trameMaj = 0; DR_TAB.pilotePresent = true; DR_TAB.hdec = 0;   /* le cours vient d'être trouvé au pointeur */
  dr_tabLireSeance(SES.ctx);
  dr_tabLire(dr_tabCheminC(SES.ctx) + '/ecrans', ecr => {
    if (Array.isArray(ecr)) DR_TAB.ecrans = ecr;
    if (!DR_TAB.sondeT) DR_TAB.sondeT = setInterval(dr_tabSonder, 900);
    if (!DR_TAB.pointeurT) DR_TAB.pointeurT = setInterval(() => { sesTabVeillePointeur(); dr_tabPointeur(); }, 3000);
    dr_tabSonder();
  });
}
function dr_tabSonder(){
  const c = SES.ctx; if (!c) return;
  const base = dr_tabCheminC(c);
  dr_tabLire(base + '/scene', o => {
    const perdu = document.getElementById('ses-tab-perdu');
    if (o === undefined) {   /* la lecture a échoué : le tableau tient, il le dit */
      if (!SES.perduDepuis) SES.perduDepuis = Date.now();
      if (perdu) { perdu.textContent = 'Pilotage interrompu à ' + new Date(SES.perduDepuis).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' — le tableau tient, il reprendra tout seul.'; perdu.classList.add('on'); }
      return; }
    SES.perduDepuis = 0; if (perdu) perdu.classList.remove('on');
    if (!o || typeof o !== 'object' || typeof o.ts !== 'number' || !isFinite(o.ts)) return;   /* une scène sans heure lisible n'est pas une scène */
    if (!DR_TAB.pilotePresent) return;                               /* le pilote n'est plus là (pointeur retiré ou périmé) : l'image reste (mandat point 5 ; relecteur 2, n° 5a) */
    const futur = DR_TAB.ts > Date.now() + 5 * 60000;                 /* la dernière scène venait d'une horloge en avance : elle ne bloque pas la suite (n° 5b) */
    if (!(o.ts > DR_TAB.ts) && !futur) return;                       /* jamais une scène plus ancienne que la dernière montrée */
    if (c.ts && o.ts < c.ts - 2000) return;                          /* la scène d'une heure précédente ne ressuscite jamais */
    if (o.si == null && o.di == null && !o.eid) return;              /* la scène « à neuf » du lancement : rien à montrer encore (audit C6) */
    DR_TAB.ts = o.ts; DR_TAB.hdec = isFinite(o.hdec) ? +o.hdec : 0;   /* §12.66 (2) : l'horloge de la case, pendant l'heure */
    if (o.trameMaj && o.trameMaj > DR_TAB.trameMaj) {
      DR_TAB.trameMaj = o.trameMaj;
      dr_tabLire(base + '/ecrans', ecr => { if (Array.isArray(ecr)) DR_TAB.ecrans = ecr; dr_tabMontrer(o); });
    } else dr_tabMontrer(o);
  });
}
/* l'identité fait foi : si le rang reçu ne désigne pas la même diapo dans MA copie, on la retrouve par son eid */
function dr_tabMontrer(o){
  const E = DR_TAB.ecrans || []; let di = o.di;
  if (o.eid && (!E[di] || E[di].eid !== o.eid)) { try { const r = _drRangDeLEid(o.eid, E); if (r !== null && r !== undefined) di = r; } catch (e) {} }
  if (!E[di]) return;   /* la copie n'est pas (encore) lisible : l'attente ou la dernière image restent, jamais une page blanche (relecteur 2, n° 8) */
  dr_rendreMur(Object.assign({}, o, { di }), E[di]);
}
