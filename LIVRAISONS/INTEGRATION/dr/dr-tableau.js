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
        f.postMessage({ et, ecran, documents: docs }, '*'); }
    } catch (e) {}
  }
  if (et) dr_sceneAuto();
}

/* la fenêtre dit `pret` à l'ouverture (comme la maquette) : on lui pousse ce que la classe voit, gel compris (p8-5g, point 1) */
window.addEventListener('message', ev => {
  if (dr_estTableau() || !ev.data || !ev.data.pret) return;
  if (ev.source && DR_TAB.fen && ev.source !== DR_TAB.fen) return;
  try {
    if (typeof S !== 'object' || !S) return;
    if (!S.atelier) { pousser(S.mur || S.gel || etatComplet()); return; }
    /* Paul est dans l'Atelier en pleine heure (`pousser` n'y pousse rien, p1) : la fenêtre rouverte ou rechargée remontre quand même
       ce que voit la classe, sans rien écrire ni journaliser (relecteur 2, n° 3) */
    const et = S.gel || S.mur; if (!et || !DR_TAB.fen || DR_TAB.fen.closed) return;
    let ecran = null; try { ecran = dr_ecranVu(dr_seances()[et.si].ecrans[et.di]); } catch (e) {}
    DR_TAB.fen.postMessage({ et, ecran }, '*');   /* directement : pas de scène au hub depuis l'Atelier */
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
  return sc;
}
function dr_sceneAuto(vite){
  clearTimeout(DR_TAB.emT);
  DR_TAB.emT = setTimeout(() => {
    if (!dr_tabPeutEcrire() || !S.mur) return;
    const sc = dr_scene(S.mur); if (!sc) return;
    clearTimeout(DR_TAB.ecrT); DR_TAB.ecrT = setTimeout(() => dr_sessionEtat(false), 5000);   /* sans accusé en 5 s : la session est coupée */
    dr_ecrire(dr_cheminC() + '/scene', sc, 'La scène du tableau (ce que voit la classe)', () => { clearTimeout(DR_TAB.ecrT); dr_sessionEtat(true); });
  }, vite ? 0 : 250);   /* le débounce de `sesEmettre` */
}
/* le témoin « ● session » (relance F8 : `sesBandeau`/`sesBandeauEtat` tombent ; E1 pose `#dr-session` dans `.haut`, je le remplis) */
function dr_sessionEtat(ok){
  const s = document.getElementById('dr-session'); if (!s) return;
  if (ok) { DR_TAB.perduDepuis = 0; s.className = 'dr-session'; s.textContent = '\u25cf session';
    s.title = 'Le tableau distant reçoit ce que voit la classe (la dernière scène est arrivée au hub).'; }
  else { if (!DR_TAB.perduDepuis) DR_TAB.perduDepuis = Date.now(); const h = new Date(DR_TAB.perduDepuis).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    s.className = 'dr-session dr-session-ko'; s.textContent = '\u25cf session coupée depuis ' + h;
    s.title = 'Le hub ne répond plus depuis ' + h + ' : le tableau distant garde la dernière image qu\u2019il a reçue ; la fenêtre du tableau, elle, continue de suivre.'; }
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
    + '<p>Sur l\u2019ordinateur branché au vidéoprojecteur, ouvre cette adresse dans Chrome : il attend le cours, puis suit ce que voit la classe. Il n\u2019écrit jamais rien.</p>'
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
function dr_tabVeiller(){
  try { dr_tabPoserBoutons(); } catch (e) {}
  if (!dr_tabPeutEcrire()) return;
  /* M4 : une parole n'appelle pas `pousser` — « qui a participé », s'il est au tableau, se recalcule ici et repart par `pousser` (dr_tout) */
  if (S.qui && !S.gel && typeof quiAParticipe === 'function') { try { const q = quiAParticipe(); if (JSON.stringify(q) !== JSON.stringify(S.qui)) { S.qui = q; dr_tout(); } } catch (e) {} }
  if ((DR_TAB.tic++ % 8) === 0) {   /* une fois par seconde : la copie jouée a-t-elle changé ? */
    let ts = ''; try { const t = (typeof dr_trame === 'function') ? dr_trame() : null; ts = t ? JSON.stringify(t) : ''; } catch (e) {}
    if (ts && ts !== DR_TAB.trameSig) {
      const premier = DR_TAB.trameSig === ''; DR_TAB.trameSig = ts;
      clearTimeout(DR_TAB.trameT);
      /* APRÈS la poussée réelle de la copie (`dr_sauve`, débounce 900 ms) — jamais l'annonce avant la marchandise */
      DR_TAB.trameT = setTimeout(() => { DR_TAB.trameMaj = Date.now(); if (!premier) dr_sceneAuto(); }, premier ? 0 : 1100);   /* la copie a changé : la scène le dit au distant */
    }
  }
}
if (!dr_estTableau()) DR_TAB.veilleT = setInterval(dr_tabVeiller, 125);

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
    + '<div class="d" id="ses-tab-d"></div><div class="c" id="ses-tab-c" style="display:none"></div></div>'
    + '<div class="mur tableau" id="mur2"></div>'
    + '<div class="ses-tab-perdu" id="ses-tab-perdu"></div>';
  [].slice.call(document.body.children).forEach(el => { el.style.display = 'none'; });
  document.body.appendChild(z); document.body.classList.add('ses-corps-tab');
  if (!document.getElementById('dr-tab-style')) {
    const st = document.createElement('style'); st.id = 'dr-tab-style';
    st.textContent = '#ses-tab #mur2{position:absolute;inset:0;margin:auto;width:min(100vw,calc(100vh * 16 / 9));height:auto;aspect-ratio:16/9;border-radius:0;box-shadow:none}';
    document.head.appendChild(st);
  }
  const horloge = () => { const d = new Date(), J = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], M = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const h = document.getElementById('ses-tab-h'), dd = document.getElementById('ses-tab-d');
    if (h) h.textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    if (dd) dd.textContent = J[d.getDay()] + ' ' + d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear(); };
  horloge(); setInterval(horloge, 1000);
  window.addEventListener('resize', () => { if (DR_TAB.montre) dr_rendreMur(DR_TAB.montre); });
}

/* la classe attendue (relance F1) : elle vient de `dr_proposer()` d'E2 quand il existe (la grille lue en lecture seule par `dr_lire`,
   jamais le module EDT en vue tableau) ; sinon l'attente ne dit que le nom du site, la date et l'heure. */
function dr_tabAttendre(){
  if (DR_TAB.montre || SES.ctx) return;
  /* seule une proposition qui vient de l'EDT (`depuis: 'edt'`) est une classe ATTENDUE ; le repli « première classe du niveau » ne l'est pas */
  const dire = p => { if (DR_TAB.montre || SES.ctx) return; if (p && p.depuis && p.depuis !== 'edt') p = null; const c = p && (p.classeNom || p.classe || p.classeSlug), cr = p && (p.creneau || (p.debut && p.fin ? p.debut + '-' + p.fin : ''));
    dr_tabDireClasse(c ? 'Classe attendue : ' + c + (cr ? ' \u00b7 ' + String(cr).replace('-', ' \u2013 ') : '') : ''); };
  if (typeof dr_proposer !== 'function') { dire(null); return; }
  try { const r = dr_proposer(dire); if (r && typeof r.then === 'function') r.then(dire, () => dire(null)); else if (r !== undefined) dire(r); } catch (e) { dire(null); }
}

/* la ligne du bas de l'attente : la classe attendue, ou celle du cours trouvé ; vide, elle disparaît (appelée par `sesTabChercherCours`, `sesTabVeillePointeur`) */
function dr_tabDireClasse(t){ const el = document.getElementById('ses-tab-c'); if (el) { el.textContent = t || ''; el.style.display = t ? '' : 'none'; } }

/* la fenêtre locale : elle reçoit l'état du pilote par `postMessage` et ne lit jamais le hub */
function dr_tabRecevoir(ev){
  const d = ev.data; if (!d || typeof d !== 'object') return;
  if (d.sortie && !('et' in d)) { const t = document.querySelector('#mur2 .f-tab'); if (t) t.classList.add('ecran-sortie'); return; }   /* la fiche se referme */
  if ('et' in d && !d.et) { dr_rendreMur(null); return; }
  if (d.et) {
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
    return;
  }
  sesTabChercherCours();
  dr_tabAttendre(); setInterval(dr_tabAttendre, 30000);
}

/* le distant : le cours trouvé, on lit la copie jouée, puis la scène toutes les 900 ms et le pointeur toutes les 3 s */
function dr_tabCheminC(c){ return '/site/' + c.niveau + '/chapitres/' + c.chapitre + '/seances/' + c.seance + '/deroule_joue/' + c.classeSlug; }
/* la règle (relance F2/I1) : une scène n'est acceptée que si la clé de cours de `cours_actif` est celle de ce cours ;
   le « pilote présent » n'existe pas — sans scène neuve, l'image reste */
function dr_tabPointeur(){
  dr_tabLire('/site/cours_actif', c => { if (c === undefined) return;   /* lecture échouée : on ne conclut rien */
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
  DR_TAB.ts = 0; DR_TAB.trameMaj = 0; DR_TAB.pilotePresent = true;   /* le cours vient d'être trouvé au pointeur */
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
    DR_TAB.ts = o.ts;
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
