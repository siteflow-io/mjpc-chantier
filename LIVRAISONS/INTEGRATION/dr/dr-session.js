/* ═══ dr-session.js — C16 (㉞) : UNE SESSION LANCÉE EST DÉCLARÉE ET REPILOTABLE PARTOUT ════════════════════════════════════════════════
   La règle de Paul (02/11/2026 12:40) : « jamais une session lancée, quelle qu'elle soit (répétition, vraie classe, mode test) ne joue sans être
   déclarée partout ailleurs et repilotable partout ailleurs ».
   Ce que ça change en classe : Paul lance l'heure (ou un essai en mode test) sur l'ordinateur de la classe ; il ouvre le site sur son téléphone ou
   un autre ordinateur : le bandeau dit ce qui joue (« Heure en cours avec les … — Reprendre », « Essai en cours (mode test) — Reprendre ») ; un clic,
   et cet appareil pilote la même session, là où elle en est. Chaque geste d'un pilote part aussitôt au hub (l'état vivant, `vif`) et paraît sur les
   autres pilotes ; le tableau suit la session, d'où que vienne le geste. Le dernier geste compte. Clore, n'importe où, clôt partout.
   Où vit la session :
     · l'heure de classe : l'annonce `/site/cours_actif` (existait) ; l'état vivant `C/vif` (la copie de la classe, à côté de `C/etat`) ;
     · l'essai en mode test : l'annonce `/site/tableau_test/pointeur` (existait : l'image du tableau) ; l'état vivant `/site/tableau_test/vif` ;
       l'image `/site/tableau_test/scene` et `/ecrans` (existaient). Rien dans les données des classes.
   L'état vivant : { par, ts, sig, sorte, close, S, parDiapo, vuMax, J, minut, cop, ecrans? } — S, parDiapo, vuMax sont ceux de `dr_etatHeure` (la
   reprise), J le journal, minut le minuteur, ecrans la copie de la classe quand elle a changé. `ts` est une horloge logique (toujours plus grande que
   le dernier état vu) : deux appareils dont les montres diffèrent restent ordonnés.
   Deux gestes presque en même temps sur deux pilotes : fusion à trois voies (la base commune, le mien, le sien) — ce que seul l'un a changé est
   gardé ; ce que les deux ont changé prend le plus récent ; le journal et les prises de parole sont réunis. Un champ en cours de frappe n'est jamais
   écrasé : l'état reçu attend la sortie du champ (§12.56 (1) c), puis se fusionne. ═══ */
var DR_SES = { id: 's' + Math.random().toString(36).slice(2, 10), ici: null, vu: 0, recu: 0, envoye: '', socle: null, envT: null, attente: null,
  ec: null, appl: false, copieEnv: '', ann: { heure: undefined, essai: undefined }, annEc: [], rejoindre: null, closVu: {}, appui: false };

const dr_sesClone = x => x === undefined ? undefined : JSON.parse(JSON.stringify(x));
const dr_sesEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function dr_sesTest(){ try { return typeof m8TestOn === 'function' && !!m8TestOn(); } catch (e) { return false; } }
function dr_sesFrais(x){ return !!(x && x.ts && (Date.now() - x.ts) <= 4 * 3600 * 1000); }

/* ─── lire et écouter le hub lui-même (jamais le magasin du mode test) : le flux REST (`EventSource`), la lecture à intervalle en repli ─── */
function dr_sesLireHub(chemin, cb){ try { fetch(FIREBASE_BASE + chemin + '.json').then(r => (r && r.ok) ? r.json() : undefined, () => undefined).then(v => cb(v), () => cb(undefined)); } catch (e) { cb(undefined); } }
function dr_sesEcouter(chemin, cb, repli){
  const h = { chemin, es: null, ok: false, val: undefined, T: null, fini: false };
  const donner = v => { if (!h.fini) cb(v); };
  try { if (typeof EventSource === 'function') { const es = new EventSource(FIREBASE_BASE + chemin + '.json'); h.es = es;
    const recu = (ev, patch) => { let m = null; try { m = JSON.parse(ev.data); } catch (e) { return; } if (!m || typeof m.path !== 'string') return;
      h.val = (typeof dr_tabFluxPoser === 'function') ? dr_tabFluxPoser(h.val, m.path, m.data, patch) : m.data; h.ok = true; donner(h.val === undefined ? null : h.val); };
    es.addEventListener('put', ev => recu(ev, false)); es.addEventListener('patch', ev => recu(ev, true));
    es.onerror = () => { h.ok = false; try { es.close(); } catch (e) {} if (h.es === es) h.es = null; }; } } catch (e) {}
  const sonder = () => { if (h.ok || h.fini) return; dr_sesLireHub(chemin, v => { if (v !== undefined && !h.ok) donner(v); }); };
  sonder(); h.T = setInterval(sonder, repli || 1000);
  return h;
}
function dr_sesTaire(h){ if (!h) return; h.fini = true; clearInterval(h.T); try { if (h.es) h.es.close(); } catch (e) {} h.es = null; }

/* ─── quelle session cette page pilote-t-elle ? ─── */
function dr_sesIci(){
  try {
    if (typeof dr_estTableau === 'function' && dr_estTableau()) return null;
    if (typeof S !== 'object' || !S || S.atelier) return null;
    if (S.repetition) {   /* la répétition (§3.5) : son annonce à elle (hors mode test `/site/repetition`, en mode test `/site/tableau_test`, `quoi: 'repetition'`) */
      if (dr_sesTest()) return (DR_TT.sig && DR_TT.quoi === 'repetition') ? { sorte: 'repetition', base: DR_TT.chemin, sig: 'repetition|' + DR_TT.sig, test: true } : null;
      return (typeof DR_REP === 'object' && DR_REP.sig) ? { sorte: 'repetition', base: DR_REP.chemin, sig: 'repetition|' + DR_REP.sig } : null; }
    if (!(S.lancee && !S.close && typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME === 'classe' && AT_DR_COURS)) return null;
    const C = dr_cheminC(); if (!C) return null;
    if (dr_sesTest()) { if (!DR_TT.sig || DR_TT.quoi !== 'heure') return null; return { sorte: 'essai', base: DR_TT.chemin, sig: 'essai|' + DR_TT.sig, C, test: true }; }
    return { sorte: 'heure', base: C, sig: 'heure|' + (dr_cheminH() || C), C };
  } catch (e) { return null; }
}
/* écrire l'état vivant : l'heure par le transport du site (ses reprises, son témoin) ; l'essai à son adresse d'essai (jamais le magasin) */
function dr_sesEcrire(ici, sous, v){
  if (ici.test) { if (typeof dr_ttEcrire === 'function') dr_ttEcrire(sous, v, true); return; }
  if (ici.sorte === 'repetition') { if (typeof dr_repEcrire === 'function') dr_repEcrire(ici.base + sous, v); return; }   /* `dr_ecrire` refuse tout en répétition */
  /* l'heure : un PUT direct (sans le bandeau « Enregistré » ni sa mise en page, à chaque lettre tapée) ; un refus ou une coupure se dit au témoin « ● session coupée » */
  try { fetch(FIREBASE_BASE + ici.base + sous + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) }).then(r => { if (!(r && r.ok)) try { dr_sessionEtat(false); } catch (e) {} }, () => { try { dr_sessionEtat(false); } catch (e) {} }); } catch (e) {}
}

/* ─── la photo de la session (ce qui se suit d'un pilote à l'autre) ─── */
const DR_SES_LOCAL = ['ecoule', 'atelier', 'vueTableau', 'face', 'faceH', 'enFin', 'finSection', 'mode', 'preparation', 'eidCourant'];   /* ce qui est à chaque appareil : le chrono compté ici, la vue de droite, la séquence de fin ouverte ici, le mode de clic */
function dr_sesPhoto(){
  const e = dr_etatHeure(); const s = Object.assign({}, e.S); DR_SES_LOCAL.forEach(k => { if (k !== 'eidCourant') delete s[k]; });
  let m = null; try { if (DR_CL.minut) { m = dr_sesClone(DR_CL.minut); delete m.bips; } } catch (x) {}
  return { S: s, parDiapo: e.parDiapo, vuMax: e.vuMax, J: dr_journalHub(), minut: m, heures: e.heures, reactivations: e.reactivations, heuresParDurees: e.heuresParDurees };
}
/* L'HISTOIRE DES ÉTATS : chaque état envoyé ou posé ici, gardé par sa clé (appareil|heure logique) ; chaque état envoyé dit sur lequel il s'appuie (`base`).
   À la réception, la base de la fusion est CET état-là — ce que l'autre savait quand il a agi — : ce qu'ici a fait depuis (une réponse tapée, une participation)
   est gardé, ce que l'autre a fait est pris ; trois pilotes qui agissent presque en même temps ne perdent rien (mesuré : la base « dernier reçu » perdait un geste). */
function dr_sesMemo(cle, p){ if (!cle || !p) return; DR_SES.hist = DR_SES.hist || new Map(); DR_SES.hist.set(cle, { S: p.S, parDiapo: p.parDiapo, vuMax: p.vuMax, minut: p.minut }); if (DR_SES.hist.size > 40) DR_SES.hist.delete(DR_SES.hist.keys().next().value); }
function dr_sesSig(p){ return JSON.stringify([p.S, p.parDiapo, p.vuMax, (p.J || []).length, p.minut]); }
function dr_sesCopie(){ try { return dr_empreinte(seance().ecrans); } catch (e) { return ''; } }

/* ─── envoyer : après chaque geste (le rendu, la sauvegarde, le minuteur), seulement si quelque chose a changé ─── */
function dr_sesEnvoyer(){ if (DR_SES.appl || dr_sesAttend()) return; clearTimeout(DR_SES.envT); DR_SES.envT = setTimeout(dr_sesEnvoyerMaintenant, 20); }
function dr_sesEnvoyerMaintenant(close, cede){
  const ici = (close || cede) ? (DR_SES.ici || dr_sesIci()) : dr_sesIci(); if (!ici || DR_SES.appl || (!close && !cede && dr_sesAttend())) return;
  if (DR_SES.attente && !close && !cede) { if (dr_sesOccupe()) return; const a = DR_SES.attente; DR_SES.attente = null; dr_sesAppliquer(a); return; }
  /* QUI A LA MAIN (Paul, 16:19) : un seul appareil pilote à la fois. Un ordinateur la prend par un geste (dévoiler, changer de diapo, écrire, noter une participation,
     le minuteur…), sans bouton ; la télécommande, seulement par « Reprendre avec la télécommande ». Celui qui ne l'a pas suit, et n'envoie rien. */
  if (!close && !cede && !dr_sesJeTiens()) {
    if (window.DR_TC) return;
    if (Date.now() - (DR_SES.geste || 0) > 2000 || (DR_SES.geste || 0) < (DR_SES.applyTs || 0)) return;   /* rien de fait ici depuis le dernier état posé : ce n'est pas un geste (un geste fait avant que l'état se pose est repris par la fusion, dr_sesAppliquer) */
    DR_SES.main = DR_SES.id; DR_SES.mainTc = false; DR_SES.forcer = true; }
  if (!DR_SES.main) { DR_SES.main = DR_SES.id; DR_SES.mainTc = !!window.DR_TC; }
  const ph = dr_sesPhoto(); const sig = dr_sesSig(ph);
  if (!close && !cede && sig === DR_SES.envoye && !DR_SES.forcer) return; DR_SES.forcer = false;
  try { dr_sesMainAfficher(); } catch (e) {}
  /* la scène part avec le geste (pas 250 ms après) : le tableau distant suit aussitôt ; son heure sert d'horloge logique aux autres pilotes */
  try { if (!close && !cede) { if (ici.test) { if (typeof dr_ttEmettre === 'function') dr_ttEmettre(); } else if (ici.sorte === 'repetition') { if (typeof dr_repEmettre === 'function') dr_repEmettre(); } else dr_sesScene(); } } catch (e) {}
  const ts = Math.max(Date.now(), DR_SES.vu + 1, (DR_TAB.dernierTs || 0) + 1); DR_SES.vu = ts; DR_SES.envoiTs = ts; DR_SES.envoye = sig; if (!DR_SES.recuBase) DR_SES.socle = ph;   /* tant que rien n'est reçu, la base est ce qu'ici a envoyé */
  const base = DR_SES.dernier || null; DR_SES.dernier = DR_SES.id + '|' + ts; dr_sesMemo(DR_SES.dernier, ph);
  const v = Object.assign({ par: DR_SES.id, ts, sig: ici.sig, sorte: ici.sorte, close: !!close, sts: DR_TAB.dernierTs || 0,
    cours: (typeof dr_coursIci === 'function' ? dr_coursIci() : null), H: dr_cheminH(), debutReel: S.debutReel || null,
    main: DR_SES.main, mainTc: DR_SES.main === DR_SES.id ? !!window.DR_TC : !!DR_SES.mainTc, cede: !!cede, base }, ph);   /* `cede` : le dernier état de celui qui vient de perdre la main (sa réponse en cours comprise) */
  const cop = dr_sesCopie(); v.cop = cop;
  if (cop !== DR_SES.copieEnv || close) { try { v.ecrans = dr_copiePourHub(JSON.parse(JSON.stringify(seance().ecrans))); DR_SES.copieEnv = cop; } catch (e) {} }
  dr_sesEcrire(ici, '/vif', v);
}

/* la scène de l'heure, écrite tout de suite (ce que fait `dr_sceneAuto` après son minuteur, dr-tableau.js) : elle part avec l'état vivant, sans attendre que la page
   ait fini de se redessiner (mesuré au téléphone : le premier geste attendait 1,2 s derrière son premier dessin) */
function dr_sesScene(){
  try { clearTimeout(DR_TAB.emT); if (!dr_tabPeutEcrire() || !S.mur) return; const sc = dr_scene(S.mur); if (!sc) return;
    { const cle = JSON.stringify(Object.assign({}, sc, { ts: 0, origine: '' })); if (cle === DR_TAB.emisCle) return; DR_TAB.emisCle = cle; }   /* la même scène ne repart pas (son heure, plus récente, passerait devant le geste d'un autre pilote) */
    if (dr_ttOn()) { dr_ecrire(dr_cheminC() + '/scene', dr_clesVersHub(sc), 'La scène du tableau (ce que voit la classe)', () => {}); return; }
    clearTimeout(DR_TAB.ecrT); DR_TAB.ecrT = setTimeout(() => dr_sessionEtat(false), 5000);
    dr_ecrire(dr_cheminC() + '/scene', dr_clesVersHub(sc), 'La scène du tableau (ce que voit la classe)', () => { clearTimeout(DR_TAB.ecrT); dr_sessionEtat(true); }); } catch (e) {}
}
/* un appareil qui REJOINT une session (la reprise d'une heure ou d'un essai, une répétition adoptée) n'envoie rien avant d'avoir posé le premier état
   reçu — sinon son état de départ (relu au hub un peu plus tôt, ou celui d'une répétition neuve) passerait devant les gestes de l'autre ; 3 s sans état reçu : il envoie */
function dr_sesAttend(){ if (DR_SES.rejoint && Date.now() - DR_SES.rejoint < 20000) return true;   /* une reprise en cours : rien ne part avant qu'elle ait abouti */
  const t = DR_SES.attendrePremier; if (!t) return false; if (Date.now() - t > 3000) { DR_SES.attendrePremier = 0; return false; } return true; }
/* ─── recevoir ─── */
function dr_sesOccupe(){
  if (DR_SES.appui) return true;
  const a = document.activeElement; if (!a || a === document.body) return false;
  if (a.isContentEditable || a.tagName === 'SELECT') return true;   /* un texte de la diapo où l'on écrit, un menu déroulé */
  return /^(INPUT|TEXTAREA)$/.test(a.tagName) && !/^(button|checkbox|radio|range|submit)$/i.test(a.type || '') && String(a.value || '') !== '';   /* un champ où l'on a commencé à écrire (la palette, que le pilote garde sous le curseur, vide : non) */
}
function dr_sesRecu(v){
  const ici = DR_SES.ici; if (!ici || !v || typeof v !== 'object') return;
  if (v.par === DR_SES.id || v.sig !== ici.sig) { if (v && v.sig !== ici.sig && dr_sesAttend()) DR_SES.attendrePremier = 0; return; }
  const cleV = v.par + '|' + v.ts; if (cleV === DR_SES.recuCle || (DR_SES.hist && DR_SES.hist.has(cleV))) return; DR_SES.recuCle = cleV;   /* un état neuf au hub (le dernier écrit) : jamais rejeté parce que la montre de son appareil retarde */
  DR_SES.recu = Math.max(DR_SES.recu, v.ts); DR_SES.vu = Math.max(DR_SES.vu, v.ts);
  try { DR_TAB.dernierTs = Math.max(DR_TAB.dernierTs || 0, (+v.sts || 0) + 50, v.ts); } catch (e) {}   /* ma prochaine scène passe après la sienne */
  if (v.close) { DR_SES.attendrePremier = 0; dr_sesClosAilleurs(v); return; }
  const avais = DR_SES.main === DR_SES.id;
  if (v.main && v.ts > (DR_SES.envoiTs || 0)) { DR_SES.main = v.main; DR_SES.mainTc = !!v.mainTc; }   /* deux prises presque en même temps : la plus récente l'emporte */
  const perdue = avais && DR_SES.main !== DR_SES.id;
  if (perdue) { DR_SES.geste = 0; DR_SES.appui = false; DR_SES.attente = null; try { const a = document.activeElement; if (a && a !== document.body && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) a.blur(); } catch (e) {} }   /* l'autre a pris la main : le champ se ferme tel qu'il est, son texte gardé */
  try { dr_sesMainAfficher(); } catch (e) {}
  if (!perdue && dr_sesOccupe()) { if (!DR_SES.attendrePremier && dr_sesPoserAutour(v)) return; DR_SES.attente = v; return; }
  const premier = !!DR_SES.attendrePremier; DR_SES.attendrePremier = 0;
  if (premier) { DR_SES.socle = null; DR_SES.geste = 0; }   /* le premier état reçu fait foi : l'état de départ d'ici n'est pas un geste */
  dr_sesAppliquer(v);
  if (perdue) dr_sesEnvoyerMaintenant(false, true);   /* avant de se taire : son dernier état, la réponse en cours comprise, part à celui qui a la main */
  if (premier && window.DR_TC && !DR_TC.mainPrise) { DR_TC.mainPrise = true; setTimeout(() => dr_tcPrendreMain(), 0); }   /* le QR scanné : la télécommande a la main */
}
function dr_sesJeTiens(){ return !DR_SES.main || DR_SES.main === DR_SES.id; }
/* à l'ordinateur : « La télécommande a la main » (ou un autre ordinateur), posé une fois, seul son texte change */
function dr_sesMainAfficher(){
  if (window.DR_TC) return; const h = document.querySelector('#dr-zone .haut'); if (!h) return; let t = document.getElementById('dr-ses-main');
  const txt = (DR_SES.ici && !dr_sesJeTiens()) ? (DR_SES.mainTc ? 'La télécommande a la main' : 'Un autre ordinateur a la main') : '';
  if (!t) { if (!txt) return; t = document.createElement('span'); t.id = 'dr-ses-main'; t.className = 'dr-ses-main'; t.style.cssText = 'color:#8fc4ea;font-size:.92em;white-space:nowrap';
    const s0 = document.getElementById('dr-session'); if (s0 && s0.parentNode) s0.insertAdjacentElement('afterend', t); else h.appendChild(t); }
  if (t.textContent !== txt) t.textContent = txt; const ti = txt ? 'Ce que voit la classe suit ' + (DR_SES.mainTc ? 'la télécommande' : 'l’autre ordinateur') + '. Un geste ici (dévoiler, changer de diapo, écrire une réponse…) te rend la main.' : '';
  if (t.title !== ti) t.title = ti; const d = txt ? '' : 'none'; if (t.style.display !== d) t.style.display = d;
}
/* pendant une frappe ici : un état reçu qui ne change rien de ce que la classe voit de cette diapo (la même diapo, la même page, le même dévoilement,
   ni gel ni loupe ni taille changés — une participation, le minuteur, une note) se pose TOUT DE SUITE, sans redessiner la diapo : le champ garde son
   focus et ce qu'on y tape, la scène d'ici continue de partir à chaque lettre, avec la participation et le minuteur à jour. Sinon : il attend la
   sortie du champ (rend faux). */
const DR_SES_VUE = ['eidCourant', 'gel', 'loupe', 'taille', 'doc', 'fichePage', 'repetition', 'lancee', 'close', 'heure'];   /* la page n'y est pas : elle dépend de la taille de l'écran de chaque appareil (mesuré : téléphone page 2, ordinateur page 1, sur la même diapo) */
function dr_sesPoserAutour(v){
  try {
    const b = (v.base && DR_SES.hist && DR_SES.hist.get(v.base)) || DR_SES.socle; if (!b || DR_SES.attente) return false;
    const loc = dr_sesPhoto();
    const m = { S: dr_sesFus3(b.S, loc.S, v.S), parDiapo: dr_sesFus3(b.parDiapo, loc.parDiapo, v.parDiapo), vuMax: dr_sesFus3(b.vuMax, loc.vuMax, v.vuMax), minut: dr_sesFus3(b.minut, loc.minut, v.minut), J: dr_sesJournal(loc.J, v.J) };
    if (!dr_sesEq(m.parDiapo, dr_sesRange(loc.parDiapo)) || !dr_sesEq(m.vuMax, dr_sesRange(loc.vuMax))) return false;   /* un dévoilement, une réponse ailleurs : la diapo changerait */
    const lS = dr_sesRange(loc.S) || {}; if (DR_SES_VUE.some(k => !dr_sesEq((m.S || {})[k], lS[k]))) return false;
    if (Array.isArray(v.ecrans) && v.cop !== dr_sesCopie()) return false;   /* la copie de la classe a changé : la diapo changerait */
    const S1 = dr_copieEtatDuHub(dr_etatRempli(dr_duHub(m.S || {})), seance().ecrans); const SL = dr_copieEtatDuHub(dr_etatRempli(dr_duHub(loc.S || {})), seance().ecrans);
    DR_SES.appl = true;
    try {
      Object.keys(S1).forEach(k => { if (DR_SES_LOCAL.includes(k) || DR_SES_VUE.includes(k)) return; if (!dr_sesEq(S1[k], SL[k])) S[k] = S1[k]; });
      if (!dr_sesEq(m.minut, dr_sesRange(loc.minut))) { DR_CL.minut = m.minut ? Object.assign({ bips: {} }, m.minut) : null; try { dr_minuteurAfficher(); dr_minuteurBoucle(); } catch (e) {} }
      const J1 = (Array.isArray(m.J) ? m.J : []).map(dr_duHub); J.length = 0; J1.forEach(o => J.push(o));
      try { if (typeof participation === 'function') participation(); } catch (e) {}   /* le panneau de la participation, pas la diapo */
      try { if (S.qui && !S.gel && typeof quiAParticipe === 'function') { S.qui = quiAParticipe(); if (S.mur) S.mur.qui = S.qui; } } catch (e) {}
    } finally { DR_SES.appl = false; }
    DR_SES.socle = { S: v.S, parDiapo: v.parDiapo, vuMax: v.vuMax, J: v.J, minut: v.minut }; DR_SES.recuBase = true; DR_SES.envoye = '';   /* la base commune : l'état reçu ; ce qu'on tape ici part au prochain envoi, fusionné (ici a la main : il frappe) */
    DR_SES.dernier = v.par + '|' + v.ts; dr_sesMemo(DR_SES.dernier, m);
    try { if (DR_SES.ici && (DR_SES.ici.test || DR_SES.ici.sorte === 'essai')) { if (typeof dr_ttEmettre === 'function') dr_ttEmettre(); } else if (DR_SES.ici && DR_SES.ici.sorte === 'repetition') { if (typeof dr_repEmettre === 'function') dr_repEmettre(); } else dr_sesScene(); } catch (e) {}   /* la classe voit la participation, le minuteur, sans attendre la prochaine lettre */
    dr_sesEnvoyer(); return true;
  } catch (e) { DR_SES.appl = false; return false; }
}
/* les trois états rangés COMME LE HUB LES RANGE avant d'être comparés (le hub ne garde ni valeur nulle, ni liste ou objet vides) : l'état reçu est passé par lui,
   l'état d'ici non — sans cela, `reps: {}` ici contre rien là-bas passait pour un changement de l'autre pilote, et la réponse tapée ici était perdue (mesuré) */
function dr_sesRange(v){ if (v === null || v === undefined || (typeof v === 'number' && !isFinite(v))) return undefined; if (typeof v !== 'object') return v;
  if (Array.isArray(v)) { const a = v.map(dr_sesRange); return a.some(x => x !== undefined) ? a.map(x => x === undefined ? null : x) : undefined; }
  const o = {}; Object.keys(v).forEach(k => { const r = dr_sesRange(v[k]); if (r !== undefined) o[k] = r; }); return Object.keys(o).length ? o : undefined; }
function dr_sesFus3(b, m, t){ return dr_sesFus(dr_sesRange(b), dr_sesRange(m), dr_sesRange(t)); }
/* la fusion à trois voies : ce que seul l'un a changé est gardé ; les deux ont changé : le plus récent (le sien, puisqu'il arrive après) */
function dr_sesFus(b, m, t){
  if (dr_sesEq(m, b)) return t; if (dr_sesEq(t, b)) return m;
  if (Array.isArray(m) && Array.isArray(t)) { const id = x => x && typeof x === 'object' && x.id != null ? 'i' + x.id : null;
    if (m.concat(t).every(x => id(x))) { const vus = new Set(t.map(id)); const bs = new Set((Array.isArray(b) ? b : []).map(id)); return t.concat(m.filter(x => !vus.has(id(x)) && !bs.has(id(x)))); }
    const bb = Array.isArray(b) ? b : []; const o = []; for (let i = 0; i < Math.max(m.length, t.length); i++) { const r = dr_sesFus(bb[i], m[i], t[i]); if (r !== undefined) o.push(r); } return o; }   /* rang par rang (les lignes de réponse d'un bloc) : une réponse tapée ici n'est jamais perdue parce que l'autre pilote a changé autre chose */
  if (m && t && typeof m === 'object' && typeof t === 'object' && !Array.isArray(m) && !Array.isArray(t)) { const o = {};
    new Set(Object.keys(m).concat(Object.keys(t))).forEach(k => { const r = dr_sesFus(b && typeof b === 'object' ? b[k] : undefined, m[k], t[k]); if (r !== undefined) o[k] = r; }); return o; }
  if (typeof m === 'string' && m !== '' && (t === '' || t == null)) return m;   /* un texte écrit ici contre un texte vide là-bas : le texte écrit (rien de perdu) ; un objet retiré là-bas (le gel levé, une parole retirée) reste retiré */
  return t;
}
function dr_sesJournal(m, t){ const cle = x => JSON.stringify([x && x.t, x && x.type, x && x.di, x && x.k, x && x.nom]); const vus = new Set((t || []).map(cle)); const o = (t || []).concat((m || []).filter(x => !vus.has(cle(x)))); return o.sort((a, b) => ((a && a.t) || 0) - ((b && b.t) || 0)); }
function dr_sesAppliquer(v){
  const ici = DR_SES.ici; if (!ici) return;
  let p = { S: v.S, parDiapo: v.parDiapo, vuMax: v.vuMax, J: v.J, minut: v.minut };
  const loc = dr_sesPhoto(); let renvoyer = false;
  if (DR_SES.socle) {   /* ce qu'ici a changé depuis la base commune (le dernier état reçu) est gardé, même déjà parti : l'autre pilote a pu écrire sans l'avoir reçu */
    const b = (v.base && DR_SES.hist && DR_SES.hist.get(v.base)) || DR_SES.socle; p = { S: dr_sesFus3(b.S, loc.S, p.S), parDiapo: dr_sesFus3(b.parDiapo, loc.parDiapo, p.parDiapo), vuMax: dr_sesFus3(b.vuMax, loc.vuMax, p.vuMax), J: dr_sesJournal(loc.J, p.J), minut: dr_sesFus3(b.minut, loc.minut, p.minut) }; renvoyer = true; }
  DR_SES.appl = true;
  try {
    if (Array.isArray(v.ecrans) && v.cop !== dr_sesCopie()) { const copie = dr_sesClone(v.ecrans); dr_copieDuHub(copie); dr_adopterIdentites(copie); const E0 = seance().ecrans; E0.splice(0, E0.length, ...copie); try { reindexer(); } catch (e) {} DR_SES.copieEnv = dr_sesCopie(); }
    const garde = {}; DR_SES_LOCAL.forEach(k => { if (k in S) garde[k] = S[k]; });
    const S1 = dr_copieEtatDuHub(dr_etatRempli(dr_duHub(p.S || {})), seance().ecrans);
    DR_SES_LOCAL.forEach(k => { delete S1[k]; });
    const J1 = (Array.isArray(p.J) ? p.J : []).map(dr_duHub);
    dr_restaurer({ S: S1, parDiapo: dr_parDiapoRempli(dr_duHub(p.parDiapo || {})), vuMax: dr_duHub(p.vuMax || {}), J: J1 });
    Object.keys(garde).forEach(k => { S[k] = garde[k]; });
    const eid = p.S && p.S.eidCourant; if (eid != null) { const i = indexDe(eid); if (i >= 0) S.di = i; }
    S.ecoule = Math.max(+garde.ecoule || 0, S.debutReel ? Math.round((Date.now() - S.debutReel) / 1000) : 0);
    try { DR_CL.minut = p.minut ? Object.assign({ bips: {} }, p.minut) : null; dr_minuteurAfficher(); dr_minuteurBoucle(); } catch (e) {}
    try { document.body.classList.toggle('gel', !!S.gel); const bg = document.getElementById('bgel'); if (bg) bg.classList.toggle('gelon', !!S.gel); } catch (e) {}
    try { tout(); } catch (e) {}
    if (v.cop && v.cop === dr_sesCopie()) DR_SES.copieEnv = v.cop;   /* la même copie ici : elle ne repartira pas avec le prochain geste */
    J.length = 0; J1.forEach(o => J.push(o));   /* le rendu journalise ce qu'il montre : ici, c'est déjà au journal reçu */
    try { if (typeof participation === 'function') participation(); } catch (e) {}
    if ((ici.test || ici.sorte === 'repetition') && typeof dr_scene === 'function' && S.mur) { const X = ici.test ? DR_TT : DR_REP; if (!ici.test) dr_repTrame(false); else dr_ttTrame(false); const sc = dr_scene(S.mur); if (sc) { sc.trameMaj = X.trameMaj || 0; X.emis = JSON.stringify(Object.assign({}, sc, { ts: 0, origine: '' })); } }   /* la scène est déjà au hub : rien ne repart d'ici */
    clearTimeout(DR_TAB.emT);
  } finally { DR_SES.appl = false; }
  DR_SES.applyTs = Date.now();   /* ce qui change ici en posant l'état reçu n'est pas un geste */
  const apres = dr_sesPhoto(); DR_SES.socle = { S: v.S, parDiapo: v.parDiapo, vuMax: v.vuMax, J: v.J, minut: v.minut }; DR_SES.recuBase = true;
  DR_SES.dernier = v.par + '|' + v.ts; dr_sesMemo(DR_SES.dernier, renvoyer ? { S: p.S, parDiapo: p.parDiapo, vuMax: p.vuMax, minut: p.minut } : v);   /* ce qu'ici sait maintenant (la fusion, si elle a gardé quelque chose d'ici) */ DR_SES.envoye = dr_sesSig(apres);   /* la base commune : l'état reçu (ce que l'autre pilote savait), pas ce qu'ici a fait par-dessus */
  /* la fusion a gardé quelque chose d'ici (un geste fait juste avant que l'état arrive, une réponse en cours) : il part — et si ce geste est récent, cet appareil prend la main */
  const garde = renvoyer && ['S', 'parDiapo', 'vuMax', 'minut'].some(k => !dr_sesEq(dr_sesRange(p[k]), dr_sesRange(v[k])));
  if (garde) { if (!dr_sesJeTiens() && !window.DR_TC && Date.now() - (DR_SES.geste || 0) < 2000) { DR_SES.main = DR_SES.id; DR_SES.mainTc = false; DR_SES.forcer = true; try { dr_sesMainAfficher(); } catch (e) {} }
    DR_SES.envoye = ''; dr_sesEnvoyer(); }
}
/* l'heure (ou l'essai) close sur un autre appareil : ce pilote le dit et revient à l'accueil ; rien n'est réécrit (l'autre a tout écrit) */
function dr_sesClosAilleurs(v){
  const ici = DR_SES.ici; DR_SES.closVu[v.sig] = true; dr_sesSuivreFin();
  if (v.sorte === 'repetition') {   /* « ■ Arrêter » sur un autre appareil : la répétition s'arrête ici aussi (ce qui y a été joué est oublié, comme toujours) */
    DR_SES.arretAilleurs = true;
    try { if (typeof DR_REP === 'object') DR_REP.sig = null; if (ici && ici.test) { clearInterval(DR_TT.T); DR_TT.T = null; DR_TT.sig = null; DR_TT.quoi = null; } } catch (e) {}
    try { arreterRepetition(); } catch (e) {} DR_SES.arretAilleurs = false;
    try { atInfo('La répétition a été arrêtée sur un autre appareil : elle s’arrête ici aussi.'); } catch (e) {}
    if (window.DR_TC && typeof dr_tcClos === 'function') dr_tcClos(v); return; }
  try { [DR_CL.jT, DR_CL.eT, DR_CL.tT, DR_CL.cT].forEach(clearTimeout); } catch (e) {}
  try { S.close = true; S.lancee = false; S.mur = null; S.gel = null; document.body.classList.remove('gel'); } catch (e) {}
  try { if (typeof AT_DR_REGIME !== 'undefined') AT_DR_REGIME = 'prep'; } catch (e) {}
  try { SES.actif = false; } catch (e) {}
  try { if (ici && ici.sorte === 'essai') { clearInterval(DR_TT.T); DR_TT.T = null; DR_TT.sig = null; DR_TT.quoi = null; } } catch (e) {}
  try { if (typeof dr_ongletClos === 'function') dr_ongletClos(); } catch (e) {}
  try { if (typeof dr_minuteurFin === 'function') { const f = window.dr_minuteurEnvoyer; window.dr_minuteurEnvoyer = () => {}; try { dr_minuteurFin(); } finally { window.dr_minuteurEnvoyer = f; } } } catch (e) {}
  try { if (typeof dr_versMur === 'function') dr_versMur(null, { sortie: true }); } catch (e) {}
  try { const f = document.getElementById('ecran-fin'); if (f) f.classList.remove('on', 'ouverture'); } catch (e) {}
  try { if (typeof atClasseFermer === 'function') atClasseFermer(); else if (typeof edtOuvrir === 'function') edtOuvrir(); } catch (e) {}
  const nom = (v.cours && (v.cours.classeNom || v.cours.classeSlug)) || '';
  try { atInfo((v.sorte === 'essai' ? 'L’essai (mode test)' : 'L’heure' + (nom ? ' des ' + escapeHtml(nom) : '')) + ' a été close sur un autre appareil : elle est close ici aussi.'); } catch (e) {}
  if (window.DR_TC && typeof dr_tcClos === 'function') dr_tcClos(v);
}

/* ─── suivre : dès que cette page pilote une session, elle écoute son état vivant ; elle se tait quand la session s'arrête ici ─── */
function dr_sesSuivreFin(){ dr_sesTaire(DR_SES.ec); DR_SES.ec = null; DR_SES.ici = null; DR_SES.socle = null; DR_SES.recuBase = false; DR_SES.hist = new Map(); DR_SES.dernier = null; DR_SES.recuCle = null; DR_SES.main = null; DR_SES.mainTc = false; DR_SES.envoiTs = 0; try { dr_sesMainAfficher(); } catch (e) {} DR_SES.envoye = ''; DR_SES.attente = null; DR_SES.recu = 0; DR_SES.copieEnv = ''; }
function dr_sesVeiller(){
  const ici = dr_sesIci();
  if (!ici) { if (DR_SES.ici) dr_sesSuivreFin(); return; }
  if (DR_SES.ici && DR_SES.ici.sig === ici.sig) { DR_SES.ici = ici; if (dr_sesSig(dr_sesPhoto()) !== DR_SES.envoye) dr_sesEnvoyer(); return; }
  dr_sesSuivreFin(); DR_SES.ici = ici;
  if (DR_SES.rejoint) { DR_SES.rejoint = 0; DR_SES.attendrePremier = Date.now(); DR_SES.copieEnv = dr_sesCopie(); }   /* la copie est venue avec la reprise : elle ne repart qu'à son prochain changement */   /* cet appareil a rejoint la session : le premier état reçu fait foi (3 s au plus) */
  DR_SES.ec = dr_sesEcouter(ici.base + '/vif', v => dr_sesRecu(v), 300);
  dr_sesEnvoyer();
}
if (!(typeof dr_estTableau === 'function' && dr_estTableau())) {
  setInterval(() => { try { dr_sesVeiller(); } catch (e) {} }, 400);
  /* un geste en cours (bouton appuyé) : l'état reçu attend le relâché ; un champ quitté : l'état reçu se pose, fusionné avec ce qui y a été écrit */
  document.addEventListener('pointerdown', ev => { DR_SES.appui = true; if (!(ev.target && ev.target.closest && ev.target.closest('#ses-reprise, #dr-tc-qr, #tc-bas, #tc-accueil'))) DR_SES.geste = Date.now(); }, true);
  ['keydown', 'input', 'click'].forEach(t => document.addEventListener(t, ev => { if (!(ev.target && ev.target.closest && ev.target.closest('#ses-reprise, #dr-tc-qr, #tc-bas, #tc-accueil'))) DR_SES.geste = Date.now(); }, true));   /* un geste d'ici : il prend la main */
  const relache = () => { DR_SES.appui = false; if (DR_SES.attente) setTimeout(() => { if (DR_SES.attente && !dr_sesOccupe()) { const a = DR_SES.attente; DR_SES.attente = null; dr_sesAppliquer(a); } }, 30); };
  document.addEventListener('pointerup', relache, true); document.addEventListener('pointercancel', relache, true);
  document.addEventListener('focusout', () => setTimeout(() => { if (DR_SES.attente && !dr_sesOccupe()) { dr_sesEnvoyerMaintenant(); if (DR_SES.attente) { const a = DR_SES.attente; DR_SES.attente = null; dr_sesAppliquer(a); } } }, 30), true);
}
/* les gestes qui changent la session : le rendu (`dr_tout`), la sauvegarde (`dr_copieAuto`), le minuteur (`dr_minuteurEnvoyer`) — après eux, l'envoi */
['dr_tout', 'dr_copieAuto', 'dr_minuteurEnvoyer'].forEach(n => { const f = window[n]; if (typeof f !== 'function' || f.__ses) return;
  const g = function () { const r = f.apply(this, arguments); try { if (!DR_SES.appl && DR_SES.ici) dr_sesEnvoyer(); } catch (e) {} return r; }; g.__ses = true; window[n] = g; });
/* pendant qu'un état reçu se pose, rien ne repart d'ici (la scène, la copie, l'état : l'autre pilote les a écrits) ; et pendant qu'un état reçu attend la fin
   d'une frappe ici — il a changé ce que voit la classe (une autre diapo, un dévoilement, le gel : `dr_sesPoserAutour` ne l'a pas posé) —, la scène d'ici ne
   repart pas non plus (elle ferait reculer le tableau d'un geste) : elle repart, fusionnée, à la sortie du champ */
['dr_sceneAuto', 'dr_copieAuto', 'dr_ttEmettre', 'dr_repEmettre'].forEach(n => { const f = window[n]; if (typeof f !== 'function' || f.__sesMuet) return;
  const g = function () { if (DR_SES.appl || (n !== 'dr_copieAuto' && ((DR_SES.ici && !dr_sesJeTiens()) || (DR_SES.attente && dr_sesOccupe())))) return; return f.apply(this, arguments); }; g.__sesMuet = true; g.__ses = f.__ses; window[n] = g; });   /* le tableau ne suit que l'appareil qui a la main */
/* clore ici : l'état vivant part une dernière fois, « clos », pour les autres pilotes ; puis la clôture d'avant (le pointeur, l'image d'essai) */
(function(){ const f = window.dr_cloreFin; if (typeof f !== 'function' || f.__ses) return;
  const g = function () { const ici = dr_sesIci() || DR_SES.ici; if (ici) { DR_SES.ici = ici; try { dr_sesEnvoyerMaintenant(true); } catch (e) {} }
    const r = f.apply(this, arguments);
    /* l'heure de classe close : le tableau distant revient à l'horloge (la scène « close », plus récente que toute autre) — l'essai retire déjà son pointeur et sa scène (dr_ttFin) ;
       fermer l'onglet sans clore ne l'écrit jamais : l'heure reste déclarée et le tableau garde son image (LOT B ③) */
    if (ici && ici.sorte === 'heure') { try { const ts = Math.max(Date.now(), (DR_TAB.dernierTs || 0) + 1, DR_SES.vu + 1); DR_TAB.dernierTs = ts; dr_ecrire(ici.base + '/scene', { clos: true, ts, origine: (typeof SES === 'object' && SES && SES.id) || 'pilote' }, 'Heure close : le tableau distant revient à l’horloge', () => {}); } catch (e) {} }
    if (ici) { DR_SES.closVu[ici.sig] = true; dr_sesSuivreFin(); } return r; };
  g.__ses = true; window.dr_cloreFin = g; })();

/* ═══ L'ESSAI EN MODE TEST : il se rejoint ═══
   L'appareil qui reprend un essai passe en mode test (le temps de l'essai, il le dit) ; ce que l'essai a joué vient de son adresse d'essai
   (l'état vivant, la copie) et se dépose dans son magasin — la reprise d'une heure (`dr_reprendreCours`) le relit comme d'habitude ; son
   pointeur est adopté (jamais un deuxième). */
function dr_sesChemC(p){ return '/site/' + p.niveau + '/chapitres/' + p.chapitre + '/seances/' + p.seance + '/deroule_joue/' + p.classeSlug; }
function dr_sesReprendreEssai(p, fini){
  if (!dr_sesTest()) { try { M8_TEST = true; sessionStorage.setItem('mjpc_m8_test', '1'); } catch (e) {} try { atInfo('Cet appareil passe en mode test le temps de l’essai : rien n’est enregistré pour la classe.'); } catch (e) {} }
  dr_sesLireHub(DR_TT.chemin + '/vif', v => dr_sesLireHub(DR_TT.chemin + '/ecrans', ecrTT => {
    if (!v || !v.S || !v.cours) { try { atInfo('L’essai en cours n’a pas encore d’état lisible : réessaie dans un instant.'); } catch (e) {} if (fini) fini(false); return; }
    const c = Object.assign({}, v.cours, { niveau: p.niveau, chapitre: p.chapitre, seance: p.seance, classeSlug: p.classeSlug || v.cours.classeSlug, classeNom: p.classeNom || v.cours.classeNom });
    const C = dr_sesChemC(c);
    const poser = (ch, val) => { try { _sitePut(ch, val); } catch (e) {} };
    poser(C + '/etat', { S: v.S, parDiapo: v.parDiapo, vuMax: v.vuMax, maj: v.ts, heures: v.heures, reactivations: v.reactivations, heuresParDurees: v.heuresParDurees });
    poser(C + '/journal', v.J || []); const ecr = Array.isArray(v.ecrans) ? v.ecrans : (Array.isArray(ecrTT) ? dr_clesDuHub(ecrTT) : null); if (ecr) poser(C + '/ecrans', ecr);   /* la copie de l'essai : celle de l'état vivant, sinon celle que voit le tableau (`/site/tableau_test/ecrans`) */
    poser('/site/cours_actif', Object.assign({}, c, { ts: Date.now() }));
    DR_SES.rejoindre = { sig: p.ts + '|' + p.seance, p };
    try { if (typeof edtFermer === 'function') edtFermer(); if (typeof edtModaleFermer === 'function') edtModaleFermer(); } catch (e) {}
    dr_reprendreCours(c); if (fini) fini(true);
  }));
}
/* relancer la même séance ailleurs la rejoint ; une autre séance qui joue : le site le dit avant, Paul choisit */
(function(){ const f = window.dr_lancer; if (typeof f !== 'function' || f.__ses) return;
  const g = function (classeSlug, creneau, debut, heure, sur) { const args = arguments, self = this;
    const ec = AT.edChap || {}; const ici = { niveau: ec.level, chapitre: ec.chnum, seance: ATVUES.snum, classeSlug: classeSlug };
    const meme = x => x && String(x.niveau) === String(ici.niveau) && String(x.chapitre) === String(ici.chapitre) && String(x.seance) === String(ici.seance) && (!ici.classeSlug || x.classeSlug === ici.classeSlug);
    const suite = () => f.apply(self, args);
    if (dr_sesTest()) {
      dr_sesLireHub(DR_TT.chemin + '/pointeur', p => {
        if (dr_sesFrais(p) && p.quoi === 'heure' && meme(p) && !(DR_TT.sig && DR_TT.sig === p.ts + '|' + p.seance)) { dr_sesReprendreEssai(p); return; }   /* le même essai joue ailleurs : on le rejoint */
        if (dr_sesFrais(p) && p.quoi === 'heure' && !meme(p)) { dr_sesDemander('Un essai (mode test) joue déjà sur un autre appareil : ' + (p.classeNom || p.classeSlug || '') + ' · séance ' + p.seance + '.', () => dr_sesReprendreEssai(p), suite); return; }
        suite(); });
      return; }
    dr_sesLireHub('/site/cours_actif', c => {
      if (dr_sesFrais(c) && !meme(c) && !(typeof dr_heureTenue === 'function' && dr_heureTenue())) { _drHeureCloseAu(c, close => { if (close) { suite(); return; }
        dr_sesDemander('Une heure joue déjà sur un autre appareil : les ' + (c.classeNom || c.classeSlug || '') + ' (' + (c.debut || '') + '-' + (c.fin || '') + '). La lancer ici la clôt.', () => { sesRepriseRetirer(); dr_reprendreCours(c); }, suite); }); return; }
      suite(); });
  };
  g.__ses = true; window.dr_lancer = g; })();
function dr_sesDemander(msg, rejoindre, lancer){
  if (typeof atModaleChoix !== 'function') { lancer(); return; }
  atModaleChoix(escapeHtml(msg) + '<br>Que veux-tu faire ?', [
    { label: 'Rejoindre la séance en cours', title: 'Cet appareil pilote la séance qui joue, là où elle en est : rien n’est créé', prim: true, action: rejoindre },
    { label: 'Lancer celle-ci quand même', title: 'Lance la séance que tu as choisie ; celle qui joue s’arrête', action: lancer },
    { label: 'Annuler', title: 'Ne rien faire', action: () => {} } ]);
}

/* ═══ LE BANDEAU, PARTOUT : abonné aux annonces du hub (l'heure, l'essai), sur tout appareil où le professeur est connecté ═══ */
function dr_sesVeilleDemarrer(){
  if (DR_SES.annEc.length) return;
  DR_SES.annEc.push(dr_sesEcouter('/site/cours_actif', v => { DR_SES.ann.heure = v; dr_sesBandeau(); }, 1500));
  DR_SES.annEc.push(dr_sesEcouter(DR_TT.chemin + '/pointeur', v => { DR_SES.ann.essai = v; dr_sesBandeau(); }, 1500));
  if (typeof DR_REP === 'object') DR_SES.annEc.push(dr_sesEcouter(DR_REP.chemin + '/pointeur', v => { DR_SES.ann.rep = v; dr_sesBandeau(); }, 1500));
  setInterval(dr_sesBandeau, 1000);
}
function dr_sesBandeau(){
  try {
    if (SES.mode) return;
    const prof = document.body.classList.contains('admin-mode') || (window.TRACK && TRACK.eleve && TRACK.eleve.is_prof);
    if (!prof || window.DR_TC) { if (SES._reprise) sesRepriseRetirer(); return; }
    if (SES.actif || (typeof dr_heureTenue === 'function' && dr_heureTenue()) || DR_SES.ici) { if (SES._reprise) sesRepriseRetirer(); return; }   /* cette page pilote déjà */
    let c = null;
    const h = DR_SES.ann.heure, t = DR_SES.ann.essai;
    if (dr_sesFrais(h)) c = Object.assign({}, h, { __sorte: 'heure' });
    else if (dr_sesFrais(t) && t.quoi === 'heure') c = Object.assign({}, t, { __sorte: 'essai' });
    else if (dr_sesFrais(DR_SES.ann.rep)) c = Object.assign({}, DR_SES.ann.rep, { __sorte: 'repetition', test: false });   /* une heure lancée prime ; puis l'essai ; puis la répétition */
    else if (dr_sesFrais(t) && t.quoi === 'repetition') c = Object.assign({}, t, { __sorte: 'repetition', test: true });
    if (!c) { const loc = (typeof dr_heurePartie === 'function') ? dr_heurePartie() : null; if (dr_sesFrais(loc) && !dr_sesTest()) c = Object.assign({}, loc, { __sorte: 'heure' }); }
    if (!c) { if (SES._reprise) sesRepriseRetirer(); return; }
    if (c.__sorte === 'heure' && typeof dr_heureTenueAilleurs === 'function' && dr_heureTenueAilleurs(_drSignatureCours(c))) { if (SES._reprise) sesRepriseRetirer(); return; }   /* un autre onglet de ce navigateur la tient (§12.28-3 d) */
    const cle = c.__sorte + '|' + (c.__sorte !== 'heure' ? c.ts + '|' + c.seance : _drSignatureCours(c));
    if (DR_SES.closVu[cle]) return;
    if (SES._reprise && SES._reprise.__cle === cle) return;   /* déjà là : rien ne se redessine (§12.56 (1) a) */
    c.__cle = cle;
    if (c.__sorte === 'heure') { _drHeureCloseAu(c, close => { if (close) { DR_SES.closVu[cle] = true; if (SES._reprise) sesRepriseRetirer(); return; } if (!DR_SES.ici) sesReprisePeindre(c); }); return; }
    sesReprisePeindre(c);
  } catch (e) {}
}
/* le texte du bandeau, selon ce qui joue */
function dr_sesTexte(c){ if (c && c.__sorte === 'repetition') return '<b>Répétition en cours' + (c.test ? ' (mode test)' : '') + '</b>';
  return c && c.__sorte === 'essai' ? '<b>Essai en cours (mode test)</b> — ' + escapeHtml(c.classeNom || c.classeSlug || '')
  : 'Heure en cours avec les <b>' + escapeHtml((c && (c.classeNom || c.classeSlug)) || '') + '</b>'; }
function dr_sesBulle(c){ if (c && c.__sorte === 'repetition') return 'Cet appareil joue la même répétition, là où elle en est (rien n’est écrit pour la classe)' + (c.test ? ' ; il passe en mode test le temps de la répétition' : '') + '. Ce que tu fais ici, le tableau distant et les autres appareils le suivent.';
  return c && c.__sorte === 'essai' ? 'Cet appareil pilote l’essai qui joue (en mode test, rien n’est enregistré pour la classe), là où il en est : il passe en mode test le temps de l’essai. Ce que tu fais ici, le tableau et les autres appareils le suivent.'
  : 'Cet appareil pilote l’heure de cette classe, là où elle en est : la diapo, sa page, les lignes dévoilées, le chrono, les paroles, les notes, l’appel. Ce que tu fais ici, le tableau et les autres appareils le suivent ; rien n’est créé.'; }

/* ═══ LA RÉPÉTITION (§3.5) : déclarée et repilotable comme l'heure ═══
   L'annonce existait (`/site/repetition/pointeur` ; en mode test `/site/tableau_test/pointeur`, `quoi: 'repetition'`) ; l'état vivant vit à côté
   (`/site/repetition/vif`, `/site/tableau_test/vif`). Une heure lancée prime au tableau distant, comme aujourd'hui (§12.41 (2)). Reprendre : l'appareil
   ouvre la séance dans l'Atelier, lance la répétition et adopte son pointeur (jamais une deuxième) ; le premier état reçu le met où elle en est. */
function dr_sesReprendreRepetition(p){
  const test = !!(p.test || p.chemin === DR_TT.chemin);
  if (test && !dr_sesTest()) { try { M8_TEST = true; sessionStorage.setItem('mjpc_m8_test', '1'); } catch (e) {} try { atInfo('Cet appareil passe en mode test le temps de la répétition : rien n’est enregistré pour la classe.'); } catch (e) {} }
  DR_SES.rejoindre = { sig: p.ts + '|' + p.seance, p: Object.assign({}, p, { quoi: 'repetition' }) };
  try { if (typeof edtFermer === 'function') edtFermer(); if (typeof edtModaleFermer === 'function') edtModaleFermer(); } catch (e) {}
  try { atelierOuvrir(); } catch (e) {}
  atChargerChapitres(p.niveau, () => { try { atEditerChapitre(p.niveau, p.chapitre); } catch (e) {} ATVUES.snum = String(p.seance);
    edtQuandPilotagePret(manque => { if (manque) { try { atInfo('La répétition ne s’ouvre pas ici (manque : ' + manque + ').'); } catch (e) {} return; }
      try { atVuesAller('pilotage'); } catch (e) {} if (S.repetition) return; DR_SES.rejoint = Date.now(); try { lancerRepetition(); } catch (e) {} }); });
}
/* relancer la même répétition ailleurs la rejoint ; une autre répétition joue : le site le dit avant */
(function(){ const f = window.lancerRepetition; if (typeof f !== 'function' || f.__ses) return;
  const g = function () { const self = this, args = arguments; if (S.repetition || DR_SES.rejoindre) return f.apply(self, args);
    const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || {}; const sn = String(typeof ATVUES !== 'undefined' ? ATVUES.snum : '');
    const meme = x => dr_sesFrais(x) && String(x.niveau) === String(ec.level) && String(x.chapitre) === String(ec.chnum) && String(x.seance) === sn;
    const test = dr_sesTest(); const ch = test ? DR_TT.chemin + '/pointeur' : DR_REP.chemin + '/pointeur'; let fait = false;
    const lancer = () => { if (fait) return; fait = true; f.apply(self, args); };
    setTimeout(lancer, 1500);   /* le hub ne répond pas : la répétition part quand même, ici */
    dr_sesLireHub(ch, p => { if (fait) return; const rep = p && (test ? p.quoi === 'repetition' : true) && dr_sesFrais(p);
      if (rep && meme(p)) { DR_SES.rejoindre = { sig: p.ts + '|' + p.seance, p: Object.assign({}, p, { quoi: 'repetition' }) }; DR_SES.rejoint = Date.now(); lancer(); return; }
      if (rep && !(test ? DR_TT.sig : DR_REP.sig)) { fait = true; dr_sesDemander('Une répétition joue déjà sur un autre appareil (séance ' + (p.seance != null ? (+p.seance + 1) : '?') + ').', () => dr_sesReprendreRepetition(p), () => { f.apply(self, args); }); return; }
      lancer(); }); };
  g.__ses = true; window.lancerRepetition = g; })();
/* « ■ Arrêter » ici : l'état vivant part une dernière fois, « clos », pour les autres appareils ; puis l'arrêt d'avant (le pointeur, la scène) */
(function(){ const f = window.arreterRepetition; if (typeof f !== 'function' || f.__ses) return;
  const g = function () { const ici = DR_SES.arretAilleurs ? null : (dr_sesIci() || (DR_SES.ici && DR_SES.ici.sorte === 'repetition' ? DR_SES.ici : null));
    if (ici && ici.sorte === 'repetition') { DR_SES.ici = ici; try { dr_sesEnvoyerMaintenant(true); } catch (e) {} }
    const r = f.apply(this, arguments); if (ici) { DR_SES.closVu[ici.sig] = true; dr_sesSuivreFin(); } return r; };
  g.__ses = true; window.arreterRepetition = g; })();
/* la reprise d'une heure (ou d'un essai) rejoint : le premier état reçu fait foi */
(function(){ const f = window.dr_reprendre; if (typeof f !== 'function' || f.__ses) return;
  const g = function () { DR_SES.rejoint = Date.now(); return f.apply(this, arguments); }; g.__ses = true; window.dr_reprendre = g; })();

/* ═══ LA TÉLÉCOMMANDE PAR LE QR CODE (§3.6 ; Paul, 14:59 : « regarde le fonctionnement dans évaluation qcm. Je scanne le qr code, et ça me met
   directement sur la séance ») ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Le modèle : `evaluation-qcm.html` (`QRPilotage`) — l'adresse porte un nonce (`…&telecommande=1&qr=<nonce>`), le téléphone écrit `…/<nonce>/scan`, la
   fenêtre du QR l'écoute et se ferme ; l'image du QR vient de `api.qrserver.com` (gratuit, sans compte ; le site n'a pas de QR dessiné dans la page).
   Le nonce est posé au hub par l'ordinateur quand il montre le QR (`/site/telecommande/<nonce>` ; en mode test `/site/tableau_test/telecommande/<nonce>`) :
   le téléphone ne pilote que si le nonce existe et a moins de 15 minutes (puis il le garde dans son onglet : F5 le garde télécommande).
   Le téléphone est un pilote de la session (il la reprend, comme « Reprendre ») ; par-dessus, l'allure de la maquette acquise (MAQUETTE-TELECOMMANDE,
   C16 194, captures du 02/11 14:26) : l'en-tête (la classe, « Diapo n sur N », la diapo), le tableau tel que le voit la classe, « n / N dévoilés »,
   ◀ ▶, ❄ Geler, « QUI A PARLÉ » avec les initiales de la classe (deux élèves aux mêmes initiales : celles du pilote, `iniDe`, qui les numérote), le
   minuteur. Chaque bouton fait le geste du pilote (◀ ▶ : les boutons du pilote eux-mêmes) ; l'état vivant le porte aux autres pilotes et au tableau. ═══ */
const DR_TC_BULLE = 'Télécommande : montre un QR code ; scanne-le avec l’appareil photo de ton téléphone : il s’ouvre directement sur cette séance, en télécommande (◀ ▶, geler, qui a parlé, le minuteur). '
  + 'Ce que tu y fais, la classe le voit au tableau et cet ordinateur le suit. La fenêtre se ferme d’elle-même quand le téléphone l’a scanné.';
function dr_tcChemin(nonce, test){ return (test ? DR_TT.chemin : '/site') + '/telecommande/' + nonce; }
function dr_tcEcrire(ch, v, test){
  if (typeof dr_estTableau === 'function' && dr_estTableau()) return;
  if (test) { if (ch.indexOf(DR_TT.chemin + '/') === 0 && typeof dr_ttEcrire === 'function') dr_ttEcrire(ch.slice(DR_TT.chemin.length), v, true); return; }   /* en mode test : seulement l'adresse d'essai */
  try { fetch(FIREBASE_BASE + ch + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) }).catch(() => {}); } catch (e) {}
}
/* côté ordinateur : le bouton, dans la barre des actions rapides, tant que cette page pilote une session */
function dr_tcBouton(){
  if (window.DR_TC) return; const ou = document.getElementById('bqui'); let b = document.getElementById('dr-tc-btn');
  if (!b && ou) { b = document.createElement('button'); b.className = 'rond'; b.id = 'dr-tc-btn'; b.type = 'button'; b.textContent = '📱'; b.title = DR_TC_BULLE; b.setAttribute('aria-label', '📱 Télécommande');
    b.addEventListener('click', ev => { ev.stopPropagation(); dr_tcQrOuvrir(); }); ou.insertAdjacentElement('afterend', b); }
  if (b) { const v = DR_SES.ici ? '' : 'none'; if (b.style.display !== v) b.style.display = v; }
}
var DR_TC_QR = null;
function dr_tcQrOuvrir(){
  const ici = DR_SES.ici; if (!ici || document.getElementById('dr-tc-qr')) return;
  const nonce = 'tc' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); const test = dr_sesTest(); const ch = dr_tcChemin(nonce, test);
  dr_tcEcrire(ch, { ts: Date.now(), sorte: ici.sorte, sig: ici.sig }, test);
  const niv = ((typeof AT !== 'undefined' && AT && AT.edChap) || {}).level || ((location.search.match(/[?&]n=([^&]+)/) || [])[1]) || '';
  const url = location.href.split(/[?#]/)[0] + '?n=' + encodeURIComponent(niv) + '&telecommande=1&qr=' + nonce + (test ? '&test=1' : '');
  const d = document.createElement('div'); d.className = 'ses-qr-fond'; d.id = 'dr-tc-qr';
  d.innerHTML = '<div class="ses-qr-boite"><button class="ses-qr-x" id="dr-tc-qr-x" title="Ferme cette fenêtre ; rien ne change">✕</button>'
    + '<h3>📱 Télécommande</h3><p>Scanne ce code avec l’appareil photo de ton téléphone : il s’ouvre directement sur cette séance' + (ici.sorte === 'repetition' ? ' (la répétition)' : ici.sorte === 'essai' ? ' (l’essai, en mode test)' : '') + ', en télécommande. Cette fenêtre se ferme d’elle-même quand le téléphone l’a scanné.</p>'
    + '<img id="dr-tc-qr-img" alt="QR code de la télécommande" width="280" height="280" style="display:block;margin:10px auto;width:280px;height:280px;background:#fff;border-radius:8px">'
    + '<div class="ses-qr-url" id="dr-tc-qr-url"></div></div>';
  d.querySelector('#dr-tc-qr-img').src = 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=' + encodeURIComponent(url);
  d.querySelector('#dr-tc-qr-url').textContent = url;
  d.addEventListener('click', ev => { if (ev.target === d || ev.target.id === 'dr-tc-qr-x') dr_tcQrFermer(false); });
  document.body.appendChild(d);
  DR_TC_QR = { ch, test, url, h: dr_sesEcouter(ch + '/scan', v => { if (v) dr_tcQrFermer(true); }, 700) };
}
function dr_tcQrFermer(scanne){
  const q = DR_TC_QR; DR_TC_QR = null; const d = document.getElementById('dr-tc-qr'); if (d) d.remove(); if (!q) return; dr_sesTaire(q.h);
  if (!scanne) dr_tcEcrire(q.ch, null, q.test);   /* fermée sans scan : le nonce ne sert plus ; scanné, il reste (le téléphone l'a gardé dans son onglet) */
  /* scanné : la fenêtre se ferme, rien d'autre ne s'ouvre devant le pilote (une boîte à fermer, en classe, gênerait) */
}
if (!(typeof dr_estTableau === 'function' && dr_estTableau())) setInterval(() => { try { dr_tcBouton(); } catch (e) {} }, 400);

/* côté téléphone : `?telecommande=1&qr=<nonce>` */
window.DR_TC = (function(){ try { if (/[?&]vue=tableau(&|$)/.test(location.search) || !/[?&]telecommande=1(&|$)/.test(location.search)) return null; const m = /[?&]qr=([A-Za-z0-9_-]{4,80})(&|$)/.exec(location.search); if (!m) return null;
  return { nonce: m[1], test: /[?&]test=1(&|$)/.test(location.search), etat: 'ouvre', rec: null, h: '', murCle: '', basCle: '', T: null }; } catch (e) { return null; } })();
const DR_TC_STYLE = 'body.tc-on{background:#0f0d0a!important;overflow:hidden!important}'
  + '#tc-haut,#tc-bas,#tc-accueil{position:fixed;left:0;right:0;z-index:2147483000;font-family:"EB Garamond",Garamond,Georgia,serif;color:#efe6d6;background:#0f0d0a}'
  + '#tc-haut{top:0;padding:10px 14px 8px;border-bottom:1px solid #332a20}'
  + '#tc-haut .cl{display:flex;justify-content:space-between;align-items:baseline;gap:8px}#tc-haut .cl b{font-size:19px;letter-spacing:.02em}#tc-haut .cl .vif{font-size:14px;color:#7fb77e;white-space:nowrap}'
  + '#tc-haut .di{margin-top:3px;font-size:16px;color:#b9ab94;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#tc-haut .di b{color:#e4b45c;font-weight:600}'
  + '#tc-bas{bottom:0;padding:8px 12px 14px;border-top:1px solid #332a20;display:flex;flex-direction:column;gap:10px;overflow:auto}'
  + '#tc-bas .voit{display:flex;justify-content:space-between;font-size:15px;color:#b9ab94}#tc-bas .voit .gel{color:#8fc4ea}'
  + '#tc-bas .rang{display:flex;gap:10px}'
  + '#tc-bas button{font-family:inherit;background:#241e17;border:1px solid #4a3d2f;color:#efe6d6;border-radius:12px;padding:0;touch-action:manipulation}'
  + '#tc-bas .gros{flex:1;height:76px;font-size:30px;font-weight:600}#tc-bas .gros.or{flex:1.6;background:#3a2c14;border-color:#e4b45c;color:#e4b45c}'
  + '#tc-bas .moyen{flex:1;height:52px;font-size:19px}#tc-bas .moyen.gelon{background:#1d2a33;border-color:#8fc4ea;color:#8fc4ea}'
  + '#tc-bas h4{margin:2px 0 0;font-size:13px;letter-spacing:.12em;color:#7d7061;font-weight:600}'
  + '#tc-bas .eleves{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}#tc-bas .eleves button{height:40px;font-size:15px}#tc-bas .eleves button.on{background:#22301f;border-color:#7fb77e;color:#7fb77e}'
  + '#tc-bas .minut{display:flex;gap:8px;align-items:center}#tc-bas .minut .t{flex:1.3;text-align:center;font-size:30px;font-variant-numeric:tabular-nums;color:#e4b45c}#tc-bas .minut button{flex:1;height:48px;font-size:17px}'
  + '#tc-accueil{top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:stretch;padding:24px 18px;gap:18px}'
  + '#tc-accueil .rien{text-align:center;color:#b9ab94;font-size:19px;line-height:1.4}'
  + '#tc-accueil .band{background:#1b1712;border:1px solid #e4b45c;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:12px}#tc-accueil .band .q{font-size:20px;line-height:1.3}'
  + '#tc-accueil .band button{height:60px;font-size:20px;font-weight:600;font-family:inherit;background:#3a2c14;border:1px solid #e4b45c;color:#e4b45c;border-radius:12px}'
  + 'body.tc-on #ses-tab.tc-tab{position:fixed;left:0;width:100vw;height:calc(100vw * 9 / 16);z-index:2147482999;overflow:hidden;background:#0f0d0a}'
  + 'body.tc-on #ses-reprise{display:none!important}';
function dr_tcPoser(){
  if (document.getElementById('tc-haut')) return; const st = document.createElement('style'); st.id = 'tc-style'; st.textContent = DR_TC_STYLE; document.head.appendChild(st);
  document.body.classList.add('tc-on');
  const mk = (id, cl) => { const z = document.createElement('div'); z.id = id; if (cl) z.className = cl; document.body.appendChild(z); return z; };
  DR_TC.haut = mk('tc-haut'); DR_TC.tab = mk('ses-tab', 'tc-tab'); DR_TC.mur = document.createElement('div'); DR_TC.mur.className = 'mur tableau'; DR_TC.mur.id = 'tc-mur'; DR_TC.tab.appendChild(DR_TC.mur);
  DR_TC.bas = mk('tc-bas'); DR_TC.acc = mk('tc-accueil');
  /* un seul écouteur par zone, posé une fois (§12.56 (1) e) */
  DR_TC.bas.addEventListener('click', ev => { const b = ev.target && ev.target.closest && ev.target.closest('button[data-a]'); if (!b) return; ev.preventDefault(); dr_tcGeste(b.dataset.a, b.dataset.ini); });
  DR_TC.acc.addEventListener('click', ev => { const b = ev.target && ev.target.closest && ev.target.closest('button[data-a]'); if (!b) return; if (b.dataset.a === 'garde') { const o = document.getElementById(b.dataset.id); if (o) o.click(); setTimeout(dr_tcMaj, 50); } if (b.dataset.a === 'rejoindre') dr_tcRejoindre(); });
}
function dr_tcPoserSi(z, h){ if (z.__h !== h) { z.innerHTML = h; z.__h = h; } }
const dr_tcEsc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function dr_tcAccueil(h){ DR_TC.haut.style.display = 'none'; DR_TC.bas.style.display = 'none'; DR_TC.tab.style.display = 'none'; DR_TC.acc.style.display = ''; dr_tcPoserSi(DR_TC.acc, h); }
/* le démarrage : le nonce vérifié au hub, le scan écrit, la séance reprise — sans rien choisir */
function dr_tcDemarrer(){
  dr_tcPoser(); dr_tcAccueil('<div class="rien">📱 La télécommande s’ouvre…</div>');
  let garde = null; try { garde = JSON.parse(sessionStorage.getItem('mjpc-tc') || 'null'); } catch (e) {}
  const ch = dr_tcChemin(DR_TC.nonce, DR_TC.test);
  dr_sesLireHub(ch, rec => {
    const ok = rec && rec.ts && (Date.now() - rec.ts) < 15 * 60000; const deja = garde && garde.nonce === DR_TC.nonce && garde.rec;
    if (!ok && !deja) { DR_TC.etat = 'perime'; dr_tcAccueil('<div class="rien">Ce QR code n’est plus valable.<br>Sur l’ordinateur, clique 📱 dans la barre du pilote : un nouveau code paraît.</div>'); return; }
    DR_TC.rec = ok ? rec : garde.rec; try { sessionStorage.setItem('mjpc-tc', JSON.stringify({ nonce: DR_TC.nonce, rec: DR_TC.rec })); } catch (e) {}
    try { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); } catch (e) {}   /* le QR vaut la session du professeur, pour cette page */
    if (DR_TC.test && !dr_sesTest()) { try { M8_TEST = true; sessionStorage.setItem('mjpc_m8_test', '1'); } catch (e) {} }
    if (ok && !deja) dr_tcEcrire(ch + '/scan', Date.now(), DR_TC.test);   /* la fenêtre du QR, sur l'ordinateur, se ferme */
    dr_tcRejoindre();
    clearInterval(DR_TC.T); DR_TC.T = setInterval(dr_tcMaj, 400);
  });
}
function dr_tcRejoindre(){
  if (DR_SES.ici || !DR_TC.rec) return; DR_TC.etat = 'ouvre'; const s = DR_TC.rec.sorte;
  const rien = () => { DR_TC.etat = 'rien'; dr_tcMaj(); };
  if (s === 'essai') { dr_sesLireHub(DR_TT.chemin + '/pointeur', p => { if (dr_sesFrais(p) && p.quoi === 'heure') dr_sesReprendreEssai(p, ok => { if (!ok) rien(); }); else rien(); }); return; }
  if (s === 'repetition') { dr_sesLireHub((DR_TC.test ? DR_TT.chemin : DR_REP.chemin) + '/pointeur', p => { if (dr_sesFrais(p) && (!DR_TC.test || p.quoi === 'repetition')) dr_sesReprendreRepetition(Object.assign({}, p, { test: DR_TC.test })); else rien(); }); return; }
  dr_sesLireHub('/site/cours_actif', c => { if (!dr_sesFrais(c)) { rien(); return; } _drHeureCloseAu(c, close => { if (close) { rien(); return; } dr_reprendreCours(c); }); });
}
function dr_tcClos(v){ DR_TC.etat = 'clos'; DR_TC.murCle = ''; dr_tcMaj(); }
/* le dessin : seulement ce qui a changé (§12.56 (1)) ; pendant un appui, rien ne bouge */
function dr_tcMaj(){
  if (!DR_TC || !DR_TC.haut) return; if (DR_SES.appui) return;
  const ici = DR_SES.ici; const g = document.getElementById('garde'); const gardeOn = g && g.classList.contains('on');
  if (gardeOn) {   /* une garde du pilote (une diapo d'une autre heure…) : elle se dit ici, ses boutons font la même chose */
    const t = (g.querySelector('h3, .titre, b') || {}).innerText || ''; const p = (g.querySelector('p') || {}).innerText || '';
    const bs = Array.from(g.querySelectorAll('button')).filter(b => b.offsetParent !== null && b.id).map(b => '<button data-a="garde" data-id="' + dr_tcEsc(b.id) + '">' + dr_tcEsc(b.innerText.trim()) + '</button>').join('');
    dr_tcAccueil('<div class="band"><div class="q">' + dr_tcEsc(t) + '</div><div class="rien" style="font-size:16px;text-align:left">' + dr_tcEsc(p) + '</div>' + bs + '</div>'); return; }
  if (!ici || !(S.mur || S.gel)) {
    dr_tcAccueil(DR_TC.etat === 'clos' ? '<div class="rien">La séance est close.<br>La télécommande s’arrête ici.</div>'
      : DR_TC.etat === 'rien' ? '<div class="rien">Aucune séance en cours.<br>Lance l’heure sur l’ordinateur de la classe,<br>puis scanne de nouveau son QR code.</div><div class="band"><button data-a="rejoindre" title="Cherche de nouveau la séance qui joue">Chercher la séance</button></div>'
      : DR_TC.etat === 'perime' ? (DR_TC.acc.__h || '') : '<div class="rien">📱 La séance s’ouvre…</div>'); return; }
  DR_TC.acc.style.display = 'none'; DR_TC.haut.style.display = ''; DR_TC.bas.style.display = ''; DR_TC.tab.style.display = '';
  const vu = S.gel || S.mur; const E = seance().ecrans; const e = E[vu.di] || {};
  let et = ''; try { const x = dr_etiquetteDe(vu); et = x == null ? '' : (typeof x === 'string' ? x : (x.t || x.txt || '')); } catch (x) {} const titre = et || e.act || '';
  const fil = vu.fil || null; const nom = ici.sorte === 'repetition' ? 'Répétition' : ((typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && (AT_DR_COURS.classeNom || AT_DR_COURS.classeSlug)) || '');
  const vif = ici.sorte === 'essai' ? '● en direct · essai' : ici.sorte === 'repetition' ? '● en direct' : '● en direct';
  let num = ''; try { const rg = rangDe(vu.di); num = rg ? 'Diapo <b>' + rg + ' sur ' + ordreHeure(S.heure).length + '</b> · heure ' + S.heure + ' · ' : 'Hors de l\'heure ' + S.heure + ' · '; } catch (x) {}   /* les mots du pilote, hors de l'heure aussi */   /* les mots du pilote : le numéro et le total de l'heure en cours */
  dr_tcPoserSi(DR_TC.haut, '<div class="cl"><b>' + dr_tcEsc(nom) + '</b><span class="vif" title="La télécommande suit la séance en direct' + (ici.test ? ' (mode test : rien n’est enregistré pour la classe)' : '') + '">' + vif + '</span></div>'
    + '<div class="di">' + num + dr_tcEsc(titre) + '</div>');
  /* le tableau, tel que le voit la classe (le rendu du tableau distant, `dr_rendreMur`, dans sa boîte) */
  const hb = DR_TC.haut.getBoundingClientRect().bottom; const top = Math.round(hb + 6) + 'px'; if (DR_TC.tab.style.top !== top) DR_TC.tab.style.top = top;
  const mc = JSON.stringify(vu); if (mc !== DR_TC.murCle) { DR_TC.murCle = mc; try { dr_rendreMur(vu, null, DR_TC.mur); } catch (x) {} }
  const bt = Math.round(DR_TC.tab.getBoundingClientRect().bottom + 6) + 'px'; if (DR_TC.bas.style.top !== bt) DR_TC.bas.style.top = bt;
  let tot = null; try { tot = elements(e).length; } catch (x) {} const nd = +vu.nDev || 0;
  const L = (typeof ELEVES !== 'undefined' && ELEVES) ? ELEVES : []; const parle = n => (S.parts || []).some(p => p && p.nom === n && (p.heure == null || p.heure === S.heure));
  const nb = L.filter(parle).length; const m = (typeof DR_CL === 'object' && DR_CL.minut) || null;
  const gel = !!S.gel; const tient = dr_sesJeTiens();
  const desact = tient ? '' : '<div class="desact" style="text-align:center;color:#8fc4ea;font-size:17px">Télécommande désactivée : l’ordinateur a repris la main</div>'
    + '<div class="rang"><button class="gros or" data-a="main" style="height:58px;font-size:21px" title="La télécommande reprend la main, là où l’ordinateur en est, la réponse qu’il écrivait comprise : ce que tu fais ici, la classe le voit au tableau">Reprendre avec la télécommande</button></div>';
  const h = desact + '<div class="voit"><span>' + (tot != null ? nd + ' / ' + tot + ' dévoilés' : nd + ' dévoilé' + (nd > 1 ? 's' : '')) + '</span><span class="gel">' + (gel ? '❄ tableau gelé' : '') + '</span></div>'
    + '<div class="rang"><button class="gros" data-a="prec" title="Revoile le dernier élément montré à la classe ; au début de la diapo, revient à la page ou à la diapo d’avant">◀</button><button class="gros or" data-a="suiv" title="Dévoile l’élément suivant au tableau ; tout dévoilé, passe à la diapo suivante (avec sa page)">▶</button></div>'
    + '<div class="rang"><button class="moyen' + (gel ? ' gelon' : '') + '" data-a="gel" title="' + (gel ? 'Dégèle le tableau : la classe revoit ce que tu montres' : 'Gèle le tableau : la classe garde ce qu’elle voit, tu peux préparer la suite') + '">' + (gel ? '❄ Dégeler' : '❄ Geler') + '</button></div>'
    + '<h4>QUI A PARLÉ · ' + nb + ' / ' + L.length + '</h4>'
    + '<div class="eleves">' + (L.length ? L.map(n => { const ini = (typeof iniDe === 'function' ? iniDe(n) : '') || '?'; return '<button class="' + (parle(n) ? 'on' : '') + '" data-a="qui" data-ini="' + dr_tcEsc(ini) + '" title="' + dr_tcEsc(n) + ' a parlé : un appui le note, un second l’enlève">' + dr_tcEsc(ini) + '</button>'; }).join('') : '<span style="grid-column:1/-1;color:#7d7061">la liste de la classe</span>') + '</div>'
    + '<h4>MINUTEUR</h4><div class="minut"><button data-a="m-moins" title="Une minute de moins">−</button><span class="t"></span><button data-a="m-plus" title="Une minute de plus">+</button>'
    + '<button data-a="m-go" title="Le minuteur part, au tableau">Départ</button><button data-a="m-pause" title="Met le minuteur en pause ; un second appui le fait repartir">Pause</button><button data-a="m-stop" title="Arrête le minuteur et le retire du tableau">■</button></div>';
  dr_tcPoserSi(DR_TC.bas, h);
  /* sans la main : chaque commande grisée dit sa raison (son infobulle) ; seul « Reprendre avec la télécommande » reste */
  const OFF = 'Télécommande désactivée : l’ordinateur a repris la main. Appuie sur « Reprendre avec la télécommande » pour piloter d’ici.';
  DR_TC.bas.querySelectorAll('button[data-a]').forEach(b => { if (b.dataset.a === 'main') return; if (b.disabled !== !tient) b.disabled = !tient; if (!tient) { if (b.title !== OFF) { if (b.dataset.t0 == null) b.dataset.t0 = b.title; b.title = OFF; } b.style.opacity = '.4'; } else { if (b.dataset.t0 != null) { b.title = b.dataset.t0; delete b.dataset.t0; } if (b.style.opacity) b.style.opacity = ''; } });
  const reste = m ? (m.etat === 'pret' ? m.duree : m.etat === 'court' ? Math.max(0, m.fin - Date.now()) : Math.max(0, m.reste || 0)) : (typeof dr_minutDuree === 'function' ? (dr_minutDuree() || 300000) : 300000);
  const tt = DR_TC.bas.querySelector('.minut .t'); const txt = typeof dr_mmss === 'function' ? dr_mmss(reste) : String(Math.ceil(reste / 1000)); if (tt && tt.textContent !== txt) tt.textContent = txt;   /* l'horloge ne pose que ses chiffres */
}
/* « Reprendre avec la télécommande » (et le QR scanné) : la télécommande prend la main ; l'ordinateur ferme son champ tel qu'il est et lui envoie son dernier état */
function dr_tcPrendreMain(){ if (!DR_SES.ici) return; DR_SES.main = DR_SES.id; DR_SES.mainTc = true; DR_SES.forcer = true; clearTimeout(DR_SES.envT); try { dr_sesEnvoyerMaintenant(); } catch (e) {} DR_TC.murCle = ''; setTimeout(dr_tcMaj, 30); }
/* chaque bouton : le geste du pilote */
function dr_tcGeste(a, ini){
  if (!DR_SES.ici) return; const $b = id => document.getElementById(id);
  if (a === 'main') { dr_tcPrendreMain(); return; }
  if (!dr_sesJeTiens()) return;   /* désactivée : seul « Reprendre avec la télécommande » agit */
  try {
    if (a === 'suiv') { const b = $b('bdev'); if (b) b.click(); else devoiler(); }
    else if (a === 'prec') { const b = $b('bprec'); if (b) b.click(); else revoiler(); }
    else if (a === 'gel') { if (S.gel) degeler(); else gel(); }
    else if (a === 'qui' && ini) { const nom = typeof nomDe === 'function' ? nomDe(ini) : null; if (!nom) return;
      const mes = (S.parts || []).filter(p => p && p.nom === nom && (p.heure == null || p.heure === S.heure));
      if (mes.length) partRetire(ini, mes[mes.length - 1].id); else partAjoute(ini, 'participe');
      try { if (typeof dr_sauve === 'function') dr_sauve(); } catch (x) {} dr_tout(); }
    else if (/^m-/.test(a)) dr_tcMinut(a.slice(2));
  } catch (e) { try { console.warn('[télécommande] ' + e.message); } catch (x) {} }
  setTimeout(dr_tcMaj, 150);   /* une diapo qui arrive se pose en deux temps : l'en-tête la redit une fois posée */
  try { clearTimeout(DR_SES.envT); dr_sesEnvoyerMaintenant(); } catch (e) {}   /* le geste part tout de suite, avant que le téléphone redessine (mesuré : le premier ▶ attendait 1,2 s derrière le premier dessin) */
  setTimeout(dr_tcMaj, 30);
}
function dr_tcMinut(a){
  try { dr_minuteurPoser(); } catch (e) {} const inp = document.getElementById('dr-minut-in'); const m = DR_CL.minut;
  if (a === 'go') { const t = document.getElementById('dr-minut-tab'); if (t) t.checked = true; if (m && m.etat === 'pause') dr_minuteurPause(); else if (!(m && m.etat === 'court')) dr_minuteurDepart(); return; }
  if (a === 'pause') { dr_minuteurPause(); return; }
  if (a === 'stop') { dr_minuteurArret(); return; }
  const d = a === 'plus' ? 60000 : -60000;
  if (m && m.etat === 'court') { m.fin = Math.max(Date.now() + 1000, m.fin + d); m.duree = Math.max(60000, m.duree + d); }
  else if (m && m.etat === 'pause') { m.reste = Math.max(1000, (m.reste || 0) + d); m.duree = Math.max(60000, m.duree + d); }
  else { const nv = Math.max(60000, (dr_minutDuree() || 300000) + d); if (inp) inp.value = dr_mmss(nv); if (m && m.etat === 'pret') { m.duree = nv; m.reste = nv; } }
  dr_minuteurEnvoyer(); dr_minuteurAfficher(); try { dr_minuteurBoucle(); } catch (e) {}
}
if (window.DR_TC) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(dr_tcDemarrer, 900)); else setTimeout(dr_tcDemarrer, 900); }
