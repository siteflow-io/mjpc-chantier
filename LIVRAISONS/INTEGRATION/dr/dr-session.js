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
    if (typeof S !== 'object' || !S || S.repetition || S.atelier) return null;
    if (!(S.lancee && !S.close && typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME === 'classe' && AT_DR_COURS)) return null;
    const C = dr_cheminC(); if (!C) return null;
    if (dr_sesTest()) { if (!DR_TT.sig || DR_TT.quoi !== 'heure') return null; return { sorte: 'essai', base: DR_TT.chemin, sig: 'essai|' + DR_TT.sig, C }; }
    return { sorte: 'heure', base: C, sig: 'heure|' + (dr_cheminH() || C), C };
  } catch (e) { return null; }
}
/* écrire l'état vivant : l'heure par le transport du site (ses reprises, son témoin) ; l'essai à son adresse d'essai (jamais le magasin) */
function dr_sesEcrire(ici, sous, v){
  if (ici.sorte === 'essai') { if (typeof dr_ttEcrire === 'function') dr_ttEcrire(sous, v, true); return; }
  if (typeof dr_ecrire === 'function') dr_ecrire(ici.base + sous, v, 'La session en direct (les autres appareils suivent)', () => {});
}

/* ─── la photo de la session (ce qui se suit d'un pilote à l'autre) ─── */
const DR_SES_LOCAL = ['ecoule', 'atelier', 'vueTableau', 'face', 'faceH', 'enFin', 'finSection', 'mode', 'preparation', 'eidCourant'];   /* ce qui est à chaque appareil : le chrono compté ici, la vue de droite, la séquence de fin ouverte ici, le mode de clic */
function dr_sesPhoto(){
  const e = dr_etatHeure(); const s = Object.assign({}, e.S); DR_SES_LOCAL.forEach(k => { if (k !== 'eidCourant') delete s[k]; });
  let m = null; try { if (DR_CL.minut) { m = dr_sesClone(DR_CL.minut); delete m.bips; } } catch (x) {}
  return { S: s, parDiapo: e.parDiapo, vuMax: e.vuMax, J: dr_journalHub(), minut: m, heures: e.heures, reactivations: e.reactivations, heuresParDurees: e.heuresParDurees };
}
function dr_sesSig(p){ return JSON.stringify([p.S, p.parDiapo, p.vuMax, (p.J || []).length, p.minut]); }
function dr_sesCopie(){ try { return dr_empreinte(seance().ecrans); } catch (e) { return ''; } }

/* ─── envoyer : après chaque geste (le rendu, la sauvegarde, le minuteur), seulement si quelque chose a changé ─── */
function dr_sesEnvoyer(){ if (DR_SES.appl) return; clearTimeout(DR_SES.envT); DR_SES.envT = setTimeout(dr_sesEnvoyerMaintenant, 20); }
function dr_sesEnvoyerMaintenant(close){
  const ici = close ? DR_SES.ici : dr_sesIci(); if (!ici || DR_SES.appl) return;
  if (DR_SES.attente && !close) { if (dr_sesOccupe()) return; const a = DR_SES.attente; DR_SES.attente = null; dr_sesAppliquer(a); return; }
  const ph = dr_sesPhoto(); const sig = dr_sesSig(ph);
  if (!close && sig === DR_SES.envoye) return;
  /* la scène part avec le geste (pas 250 ms après) : le tableau distant suit aussitôt ; son heure sert d'horloge logique aux autres pilotes */
  try { if (!close) { if (ici.sorte === 'essai') { if (typeof dr_ttEmettre === 'function') dr_ttEmettre(); } else if (typeof dr_sceneAuto === 'function') dr_sceneAuto(true); } } catch (e) {}
  const ts = Math.max(Date.now(), DR_SES.vu + 1, (DR_TAB.dernierTs || 0) + 1); DR_SES.vu = ts; DR_SES.envoye = sig; DR_SES.socle = ph;
  const v = Object.assign({ par: DR_SES.id, ts, sig: ici.sig, sorte: ici.sorte, close: !!close, sts: DR_TAB.dernierTs || 0,
    cours: (typeof dr_coursIci === 'function' ? dr_coursIci() : null), H: dr_cheminH(), debutReel: S.debutReel || null }, ph);
  const cop = dr_sesCopie(); v.cop = cop;
  if (cop !== DR_SES.copieEnv || close) { try { v.ecrans = dr_copiePourHub(JSON.parse(JSON.stringify(seance().ecrans))); DR_SES.copieEnv = cop; } catch (e) {} }
  dr_sesEcrire(ici, '/vif', v);
}

/* ─── recevoir ─── */
function dr_sesOccupe(){
  if (DR_SES.appui) return true;
  const a = document.activeElement; if (!a || a === document.body) return false;
  return !!(a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
}
function dr_sesRecu(v){
  const ici = DR_SES.ici; if (!ici || !v || typeof v !== 'object') return;
  if (v.par === DR_SES.id || v.sig !== ici.sig) return;
  if (!(v.ts > DR_SES.recu)) return; DR_SES.recu = v.ts; DR_SES.vu = Math.max(DR_SES.vu, v.ts);
  try { DR_TAB.dernierTs = Math.max(DR_TAB.dernierTs || 0, (+v.sts || 0) + 50, v.ts); } catch (e) {}   /* ma prochaine scène passe après la sienne */
  if (v.close) { dr_sesClosAilleurs(v); return; }
  if (dr_sesOccupe()) { DR_SES.attente = v; return; }
  dr_sesAppliquer(v);
}
/* la fusion à trois voies : ce que seul l'un a changé est gardé ; les deux ont changé : le plus récent (le sien, puisqu'il arrive après) */
function dr_sesFus(b, m, t){
  if (dr_sesEq(m, b)) return t; if (dr_sesEq(t, b)) return m;
  if (Array.isArray(m) && Array.isArray(t)) { const id = x => x && typeof x === 'object' && x.id != null ? 'i' + x.id : null;
    if (m.concat(t).every(x => id(x))) { const vus = new Set(t.map(id)); const bs = new Set((Array.isArray(b) ? b : []).map(id)); return t.concat(m.filter(x => !vus.has(id(x)) && !bs.has(id(x)))); }
    return t; }
  if (m && t && typeof m === 'object' && typeof t === 'object' && !Array.isArray(m) && !Array.isArray(t)) { const o = {};
    new Set(Object.keys(m).concat(Object.keys(t))).forEach(k => { const r = dr_sesFus(b && typeof b === 'object' ? b[k] : undefined, m[k], t[k]); if (r !== undefined) o[k] = r; }); return o; }
  return t;
}
function dr_sesJournal(m, t){ const cle = x => JSON.stringify([x && x.t, x && x.type, x && x.di, x && x.k, x && x.nom]); const vus = new Set((t || []).map(cle)); const o = (t || []).concat((m || []).filter(x => !vus.has(cle(x)))); return o.sort((a, b) => ((a && a.t) || 0) - ((b && b.t) || 0)); }
function dr_sesAppliquer(v){
  const ici = DR_SES.ici; if (!ici) return;
  let p = { S: v.S, parDiapo: v.parDiapo, vuMax: v.vuMax, J: v.J, minut: v.minut };
  const loc = dr_sesPhoto(); let renvoyer = false;
  if (DR_SES.socle && dr_sesSig(loc) !== DR_SES.envoye) {   /* un geste d'ici n'est pas encore parti : on le garde */
    const b = DR_SES.socle; p = { S: dr_sesFus(b.S, loc.S, p.S), parDiapo: dr_sesFus(b.parDiapo, loc.parDiapo, p.parDiapo), vuMax: dr_sesFus(b.vuMax, loc.vuMax, p.vuMax), J: dr_sesJournal(loc.J, p.J), minut: dr_sesFus(b.minut, loc.minut, p.minut) }; renvoyer = true; }
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
    J.length = 0; J1.forEach(o => J.push(o));   /* le rendu journalise ce qu'il montre : ici, c'est déjà au journal reçu */
    try { if (typeof participation === 'function') participation(); } catch (e) {}
    if (ici.sorte === 'essai' && typeof dr_scene === 'function' && S.mur) { const sc = dr_scene(S.mur); if (sc) { sc.trameMaj = DR_TT.trameMaj || 0; DR_TT.emis = JSON.stringify(Object.assign({}, sc, { ts: 0, origine: '' })); } }   /* la scène est déjà au hub : rien ne repart d'ici */
    clearTimeout(DR_TAB.emT);
  } finally { DR_SES.appl = false; }
  const apres = dr_sesPhoto(); DR_SES.socle = apres; DR_SES.envoye = dr_sesSig(apres);
  if (renvoyer && !dr_sesEq(dr_sesSig(apres), dr_sesSig({ S: p.S, parDiapo: p.parDiapo, vuMax: p.vuMax, J: v.J, minut: v.minut }))) { DR_SES.envoye = ''; dr_sesEnvoyer(); }
}
/* l'heure (ou l'essai) close sur un autre appareil : ce pilote le dit et revient à l'accueil ; rien n'est réécrit (l'autre a tout écrit) */
function dr_sesClosAilleurs(v){
  const ici = DR_SES.ici; DR_SES.closVu[v.sig] = true; dr_sesSuivreFin();
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
function dr_sesSuivreFin(){ dr_sesTaire(DR_SES.ec); DR_SES.ec = null; DR_SES.ici = null; DR_SES.socle = null; DR_SES.envoye = ''; DR_SES.attente = null; DR_SES.recu = 0; DR_SES.copieEnv = ''; }
function dr_sesVeiller(){
  const ici = dr_sesIci();
  if (!ici) { if (DR_SES.ici) dr_sesSuivreFin(); return; }
  if (DR_SES.ici && DR_SES.ici.sig === ici.sig) { DR_SES.ici = ici; if (dr_sesSig(dr_sesPhoto()) !== DR_SES.envoye) dr_sesEnvoyer(); return; }
  dr_sesSuivreFin(); DR_SES.ici = ici;
  DR_SES.ec = dr_sesEcouter(ici.base + '/vif', v => dr_sesRecu(v), 300);
  dr_sesEnvoyer();
}
if (!(typeof dr_estTableau === 'function' && dr_estTableau())) {
  setInterval(() => { try { dr_sesVeiller(); } catch (e) {} }, 400);
  /* un geste en cours (bouton appuyé) : l'état reçu attend le relâché ; un champ quitté : l'état reçu se pose, fusionné avec ce qui y a été écrit */
  document.addEventListener('pointerdown', () => { DR_SES.appui = true; }, true);
  const relache = () => { DR_SES.appui = false; if (DR_SES.attente) setTimeout(() => { if (DR_SES.attente && !dr_sesOccupe()) { const a = DR_SES.attente; DR_SES.attente = null; dr_sesAppliquer(a); } }, 30); };
  document.addEventListener('pointerup', relache, true); document.addEventListener('pointercancel', relache, true);
  document.addEventListener('focusout', () => setTimeout(() => { if (DR_SES.attente && !dr_sesOccupe()) { dr_sesEnvoyerMaintenant(); if (DR_SES.attente) { const a = DR_SES.attente; DR_SES.attente = null; dr_sesAppliquer(a); } } }, 30), true);
}
/* les gestes qui changent la session : le rendu (`dr_tout`), la sauvegarde (`dr_copieAuto`), le minuteur (`dr_minuteurEnvoyer`) — après eux, l'envoi */
['dr_tout', 'dr_copieAuto', 'dr_minuteurEnvoyer'].forEach(n => { const f = window[n]; if (typeof f !== 'function' || f.__ses) return;
  const g = function () { const r = f.apply(this, arguments); try { if (!DR_SES.appl && DR_SES.ici) dr_sesEnvoyer(); } catch (e) {} return r; }; g.__ses = true; window[n] = g; });
/* pendant qu'un état reçu se pose, rien ne repart d'ici (la scène, la copie, l'état : l'autre pilote les a écrits) */
['dr_sceneAuto', 'dr_copieAuto'].forEach(n => { const f = window[n]; if (typeof f !== 'function' || f.__sesMuet) return;
  const g = function () { if (DR_SES.appl) return; return f.apply(this, arguments); }; g.__sesMuet = true; g.__ses = f.__ses; window[n] = g; });
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
  dr_sesLireHub(DR_TT.chemin + '/vif', v => {
    if (!v || !v.S || !v.cours) { try { atInfo('L’essai en cours n’a pas encore d’état lisible : réessaie dans un instant.'); } catch (e) {} if (fini) fini(false); return; }
    const c = Object.assign({}, v.cours, { niveau: p.niveau, chapitre: p.chapitre, seance: p.seance, classeSlug: p.classeSlug || v.cours.classeSlug, classeNom: p.classeNom || v.cours.classeNom });
    const C = dr_sesChemC(c);
    const poser = (ch, val) => { try { _sitePut(ch, val); } catch (e) {} };
    poser(C + '/etat', { S: v.S, parDiapo: v.parDiapo, vuMax: v.vuMax, maj: v.ts, heures: v.heures, reactivations: v.reactivations, heuresParDurees: v.heuresParDurees });
    poser(C + '/journal', v.J || []); if (Array.isArray(v.ecrans)) poser(C + '/ecrans', v.ecrans);
    poser('/site/cours_actif', Object.assign({}, c, { ts: Date.now() }));
    DR_SES.rejoindre = { sig: p.ts + '|' + p.seance, p };
    try { if (typeof edtFermer === 'function') edtFermer(); if (typeof edtModaleFermer === 'function') edtModaleFermer(); } catch (e) {}
    dr_reprendreCours(c); if (fini) fini(true);
  });
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
    if (!c) { const loc = (typeof dr_heurePartie === 'function') ? dr_heurePartie() : null; if (dr_sesFrais(loc) && !dr_sesTest()) c = Object.assign({}, loc, { __sorte: 'heure' }); }
    if (!c) { if (SES._reprise) sesRepriseRetirer(); return; }
    if (c.__sorte === 'heure' && typeof dr_heureTenueAilleurs === 'function' && dr_heureTenueAilleurs(_drSignatureCours(c))) { if (SES._reprise) sesRepriseRetirer(); return; }   /* un autre onglet de ce navigateur la tient (§12.28-3 d) */
    const cle = c.__sorte + '|' + (c.__sorte === 'essai' ? c.ts + '|' + c.seance : _drSignatureCours(c));
    if (DR_SES.closVu[cle]) return;
    if (SES._reprise && SES._reprise.__cle === cle) return;   /* déjà là : rien ne se redessine (§12.56 (1) a) */
    c.__cle = cle;
    if (c.__sorte === 'heure') { _drHeureCloseAu(c, close => { if (close) { DR_SES.closVu[cle] = true; if (SES._reprise) sesRepriseRetirer(); return; } if (!DR_SES.ici) sesReprisePeindre(c); }); return; }
    sesReprisePeindre(c);
  } catch (e) {}
}
/* le texte du bandeau, selon ce qui joue */
function dr_sesTexte(c){ return c && c.__sorte === 'essai' ? '<b>Essai en cours (mode test)</b> — ' + escapeHtml(c.classeNom || c.classeSlug || '') + ' —'
  : 'Heure en cours avec les <b>' + escapeHtml((c && (c.classeNom || c.classeSlug)) || '') + '</b> —'; }
function dr_sesBulle(c){ return c && c.__sorte === 'essai' ? 'Cet appareil pilote l’essai qui joue (en mode test, rien n’est enregistré pour la classe), là où il en est : il passe en mode test le temps de l’essai. Ce que tu fais ici, le tableau et les autres appareils le suivent.'
  : 'Cet appareil pilote l’heure de cette classe, là où elle en est : la diapo, sa page, les lignes dévoilées, le chrono, les paroles, les notes, l’appel. Ce que tu fais ici, le tableau et les autres appareils le suivent ; rien n’est créé.'; }
