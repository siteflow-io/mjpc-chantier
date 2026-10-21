/* ═══ dr-tableau.js — E3, le tableau (contrat des quatre §6 ; mandat E3) ═══════════════════════════════
   Ce que ça change en classe : « ⧉ Ouvrir le tableau » ouvre le SITE LUI-MÊME en lecture seule
   (`index.html?vue=tableau&local=1`) ; il reçoit l'état du tableau du pilote et le rend avec le MÊME
   rendu (`rendre` du socle) — plus de fenêtre écrite à la main, plus de fonctions recopiées (`inj` tombe).
   Un autre appareil ouvre `?vue=tableau` : il lit la scène au hub (`C/scene` = l'état du tableau) et la
   rend par le même chemin, `dr_rendreMur`. Il garde sa dernière image quand le pilote se ferme ou gèle.
   Règles tenues ici (contrat §5) : aucune écriture autrement que par `dr_ecrire` ; aucune en vue tableau,
   en répétition, dans l'atelier, hors d'une heure lancée ; la diapo est désignée par son `eid`, le rang
   n'est qu'un repli (audit C7, en attente de la conscience). Tout est préfixé `dr_` / `DR_TAB`.
   ═══════════════════════════════════════════════════════════════════════════════════════════════════ */
var DR_TAB = { fen: null, montre: null, ts: 0, trameMaj: 0, ecrans: null, documents: null, si: null,
  emis: '', emT: null, trameSig: '', trameT: null, tic: 0, partSig: '', partT: null, veilleT: null,
  sondeT: null, pointeurT: null, cle: '', lu: false };

const dr_estTableau = () => /[?&]vue=tableau(&|$)/.test(location.search);   /* la même lecture que `SES.mode`, mais sûre au chargement du module (SES n'existe pas encore) */
const dr_tabLocal = () => /[?&]local=1(&|$)/.test(location.search);

/* ─── la lecture : `dr_lire` du socle (secuLire, mode test) ; à défaut, `sesGet` (lecture pure) ─── */
function dr_tabLire(chemin, cb){
  if (typeof dr_lire === 'function') { try { dr_lire(chemin, v => cb(v === undefined ? null : v)); return; } catch (e) {} }
  sesGet(FIREBASE_BASE + chemin + '.json', (v, err) => cb(err ? undefined : v));   /* undefined = la lecture a échoué (le tableau le dit) */
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

/* la fenêtre dit `pret` à l'ouverture (comme la maquette) : on lui pousse ce que la classe voit, gel compris (p8-5g, point 1) */
window.addEventListener('message', ev => {
  if (dr_estTableau() || !ev.data || !ev.data.pret) return;
  if (ev.source && DR_TAB.fen && ev.source !== DR_TAB.fen) return;
  try { if (typeof S === 'object' && S && !S.atelier) pousser(S.mur || S.gel || etatComplet()); } catch (e) {}
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
    dr_ecrire(dr_cheminC() + '/scene', sc, 'La scène du tableau (ce que voit la classe)', () => {});
  }, vite ? 0 : 250);   /* le débounce de `sesEmettre` */
}

/* ─── la participation : `C/part` = {participation, maj, origine} depuis `S.parts`, par eid (mandat point 6) ─── */
function dr_partListe(){
  return ((typeof S === 'object' && S && S.parts) || []).map(p => ({ id: p.id, nom: p.nom, m: p.m, eid: p.eid || null, h: p.h, heure: p.heure, t: p.t }));
  /* ni `di` (un rang), ni `note` (« pour toi seul », cadrage 1 §4b.2) : audit C8 */
}
function dr_part(){
  clearTimeout(DR_TAB.partT);
  DR_TAB.partT = setTimeout(() => {
    if (!dr_tabPeutEcrire()) return;
    dr_ecrire(dr_cheminC() + '/part', { participation: dr_partListe(), maj: Date.now(), origine: (typeof SES === 'object' && SES) ? SES.id : 'pilote' }, 'La participation de l’heure', () => {});
  }, 250);
}

/* ─── la veille du pilote : elle regarde l'état du tableau (`S.mur`), la copie jouée et la participation ;
       ce qui change part au hub — sans crochet sur les fonctions du socle (le pont et ses enveloppes tombent, C1 §13).
       Pendant le gel, `S.mur` ne bouge pas : rien ne part, le tableau garde son image. ─── */
/* le QR du tableau distant (`sesQROuvrir`, repris) : son bouton vivait dans la tête du déroulé, qui tombe (audit F8) ;
   il se pose à côté de « ⧉ Ouvrir le tableau », dans l'entête de la maquette */
function dr_tabPoserQR(){
  const b = document.getElementById('bvideoproj'); if (!b || document.getElementById('dr-tab-qr')) return;
  const q = document.createElement('button'); q.className = 'btn'; q.id = 'dr-tab-qr'; q.type = 'button'; q.textContent = 'QR';
  q.title = 'Le tableau sur un autre appareil : montre l\u2019adresse du tableau en QR. Scanné (ou l\u2019adresse ouverte dans Chrome) sur l\u2019ordinateur de la classe, il attend le cours puis suit ce que voit la classe, sans jamais rien écrire.';
  q.onclick = () => { try { sesQROuvrir(); } catch (e) {} };
  b.insertAdjacentElement('afterend', q);
}
function dr_tabVeiller(){
  try { dr_tabPoserQR(); } catch (e) {}
  if (!dr_tabPeutEcrire()) { DR_TAB.emis = ''; return; }
  let sig = ''; try { sig = JSON.stringify(S.mur || null); } catch (e) {}
  if (S.mur && sig !== DR_TAB.emis) { DR_TAB.emis = sig; dr_sceneAuto(); }
  let ps = ''; try { ps = JSON.stringify(dr_partListe()); } catch (e) {}
  if (ps !== DR_TAB.partSig) { const premier = DR_TAB.partSig === ''; DR_TAB.partSig = ps; if (!premier || (S.parts || []).length) dr_part(); }
  if ((DR_TAB.tic++ % 8) === 0) {   /* une fois par seconde : la copie jouée a-t-elle changé ? */
    let ts = ''; try { const t = (typeof dr_trame === 'function') ? dr_trame() : null; ts = t ? JSON.stringify(t) : ''; } catch (e) {}
    if (ts && ts !== DR_TAB.trameSig) {
      const premier = DR_TAB.trameSig === ''; DR_TAB.trameSig = ts;
      clearTimeout(DR_TAB.trameT);
      /* APRÈS la poussée réelle de la copie (`dr_sauve`, débounce 900 ms) — jamais l'annonce avant la marchandise */
      DR_TAB.trameT = setTimeout(() => { DR_TAB.trameMaj = Date.now(); DR_TAB.emis = ''; }, premier ? 0 : 1100);
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
     ni #mur ni #volet (les contrôles lisent `#mur` d'abord, audit I3). Provisoire : demandé à E1 de ne pas le poser en page tableau. */
  try { const z = document.getElementById('dr-zone'); if (z) z.innerHTML = ''; } catch (e) {}
  const z = document.createElement('div'); z.id = 'ses-tab'; z.className = 'ses-tab';
  z.innerHTML = '<div class="ses-tab-attente" id="ses-tab-att">'
    + '<div class="n">monsieurjaipascompris</div><div class="h" id="ses-tab-h">--:--</div>'
    + '<div class="d" id="ses-tab-d"></div><div class="c" id="ses-tab-c">Aucun cours en cours</div></div>'
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

/* la ligne du bas de l'attente : « Aucun cours en cours » ou la classe du cours trouvé (appelée par `sesTabChercherCours`, `sesTabVeillePointeur`) */
function dr_tabDireClasse(t){ const el = document.getElementById('ses-tab-c'); if (el) el.textContent = t || ''; }

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
}

/* le distant : le cours trouvé, on lit la copie jouée, puis la scène toutes les 900 ms et le pointeur toutes les 3 s */
function dr_tabCheminC(c){ return '/site/' + c.niveau + '/chapitres/' + c.chapitre + '/seances/' + c.seance + '/deroule_joue/' + c.classeSlug; }
function dr_tabMonter(){
  if (!SES.ctx) return;
  DR_TAB.ts = 0; DR_TAB.trameMaj = 0;
  dr_tabLire(dr_tabCheminC(SES.ctx) + '/ecrans', ecr => {
    if (Array.isArray(ecr)) DR_TAB.ecrans = ecr;
    if (!DR_TAB.sondeT) DR_TAB.sondeT = setInterval(dr_tabSonder, 900);
    if (!DR_TAB.pointeurT) DR_TAB.pointeurT = setInterval(sesTabVeillePointeur, 3000);
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
    if (!o || !o.ts || !(o.ts > DR_TAB.ts)) return;                 /* jamais une scène plus ancienne que la dernière montrée */
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
  dr_rendreMur(Object.assign({}, o, { di }), E[di]);
}
