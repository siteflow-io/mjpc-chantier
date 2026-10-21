/* ═══ dr-classe.js — E2, la classe et l'heure (contrat des quatre §6 ; mandat E2) ════════════════════════
   Ce que ça change en classe : Paul lance l'heure depuis la case de l'emploi du temps (ou d'un clic dans le
   Pilotage) ; le déroulé s'ouvre avec la vraie classe, le vrai créneau, l'heure n/N de la séance ; tout ce qui
   se passe s'enregistre au fil (le journal, l'état, le paquet de l'heure) ; à T-5 la fin de l'heure se déroule
   en sept étapes et l'heure se clôt ; si la page se ferme en pleine heure, il rouvre et retrouve tout.
   Règles tenues ici (contrat §5) : toute lecture par `dr_lire`, toute écriture par `dr_ecrire` (donc le mode
   test, 13 · 25) ; rien en répétition, rien dans l'atelier, rien hors d'une heure lancée ; JAMAIS un rang au
   hub — les diapos sont désignées par leur `eid` (le rang se refait à la lecture, `reindexer`).
   Lectures de l'audit E2 appliquées en attendant la conscience (C3, C4, C5, F9, F10) : voir `E2/JOURNAL.md`.
   ═════════════════════════════════════════════════════════════════════════════════════════════════════ */
var DR_CL = { jT: null, eT: null, tT: null, cT: null, absents: null, empreinte: '', relue: '', reprise: false };

/* ─── l'heure de cours : créneau, début, temps utile (R8 : `atTempsUtile`, `atDebutPropose`, repris paramétrés) ─── */
const dr_mn = x => { const p = String(x || '').split(':'); return (+p[0] || 0) * 60 + (+p[1] || 0); };
const dr_hm = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const dr_maintenantMn = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
/* le temps utile : la fin, moins le début, moins les cinq minutes d'agenda (CADRAGE-TEMPS §4) */
function dr_tempsUtile(creneau, debut){ const f = String(creneau || '').split('-')[1]; return dr_mn(f) - dr_mn(debut || String(creneau).split('-')[0]) - 5; }
/* le début proposé : maintenant s'il est dans le créneau, sinon son début (`atDebutPropose`) */
function dr_debutPropose(creneau){ const d = dr_mn(String(creneau).split('-')[0]), f = dr_mn(String(creneau).split('-')[1]), m = dr_maintenantMn(); return dr_hm(m > d && m < f ? m : d); }
/* le créneau proposé quand on n'est pas passé par l'EDT : celui où l'on est, sinon le prochain du jour, sinon le 3e (la tête d'aujourd'hui) */
function dr_creneauPropose(){
  const L = (typeof AT_EDT !== 'undefined' && Array.isArray(AT_EDT)) ? AT_EDT : []; const m = dr_maintenantMn();
  return L.find(c => dr_mn(c.split('-')[0]) <= m && m < dr_mn(c.split('-')[1])) || L.find(c => dr_mn(c.split('-')[0]) > m) || L[2] || L[0] || '08:00-08:55';
}
/* la classe proposée : celle de l'heure en cours, sinon celle que l'Atelier a choisie, sinon la première du niveau */
function dr_classeProposee(){
  try { if (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && AT_DR_COURS.classeSlug) return AT_DR_COURS.classeSlug; } catch (e) {}
  try { const c = (typeof dr_classe === 'function') ? dr_classe() : null; if (c && c.slug) return c.slug; } catch (e) {}
  try { const l = _lvlClasses((AT.edChap || {}).level) || []; if (l[0]) return l[0].slug; } catch (e) {}
  return '';
}
const dr_nomClasse = slug => { try { const c = classesData && classesData[slug]; return (c && c.nom) || slug; } catch (e) { return slug; } };
/* le nombre d'heures de la séance : la MÊME fonction que la case de l'EDT (`edtHeuresPour`), jamais un calcul à part */
function dr_nbHeures(creneau){
  try { const ec = AT.edChap, sk = ATVUES.snum; const sce = chapitresData[ec.level][ec.chnum].seances[sk]; return edtHeuresPour(sce, creneau); } catch (e) { return 1; }
}

/* ─── l'heure n de la séance pour cette classe : jour, début, fin, base (ce que `HEURES_SIM[h]` simulait) ───
   L'heure en cours vient de `AT_DR_COURS` ; une heure passée, de ce qui a été posé à son lancement (`S.heuresCours`,
   gardé dans `C/etat`). `dr_heureDe` (E1, le socle) peut lire `dr_heureJouee(h)` pour les heures passées. */
const DR_JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], DR_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function dr_heurePoser(h, cours, ts){
  const d = new Date(ts || Date.now()); const deb = String(dr_creneauDuCours(cours) || '').split('-')[0] || cours.debut;
  const base = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(dr_mn(deb) / 60), dr_mn(deb) % 60).getTime();
  const x = { jour: DR_JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + DR_MOIS[d.getMonth()] + ' ' + d.getFullYear(), debut: deb, fin: cours.fin, base, lanceA: cours.debut, classe: cours.classeNom, cle: _drCleHeureDe(cours, ts), sur: dr_nbHeures(dr_creneauDuCours(cours)) };
  S.heuresCours = S.heuresCours || {}; S.heuresCours[h] = x;
  if (typeof HEURES_SIM === 'object' && HEURES_SIM) HEURES_SIM[h] = x;   /* E2 : la simulation devient la vraie heure — avant : HEURES_SIM[h] en dur (1 : lundi 14 sept. 15:07, 2 : mardi 15 sept. 10:07) */
  return x;
}
function dr_heureJouee(h){ return (S.heuresCours || {})[h] || null; }
const dr_creneauDuCours = c => { try { return _drCreneauDe(c); } catch (e) { return c ? c.debut + '-' + c.fin : ''; } };

/* ─── ce qui se garde au hub : jamais un rang ───
   Un objet qui porte un `eid` et un `di` (le rang, ou le rang + 1 pour les notes et les paroles) perd son `di` et garde
   son décalage (`dio`, 0 ou 1 : une convention, pas une désignation) ; à la lecture, `di` = rang de l'`eid` + `dio`.
   Les clés interdites au hub (. # $ [ ] /) sont échappées dans les deux sens. */
const DR_CLE_HUB = /[.#$\[\]\/]/g;
function dr_versHub(x){
  if (Array.isArray(x)) return x.map(dr_versHub);
  if (!x || typeof x !== 'object') return (typeof x === 'function' || typeof x === 'undefined') ? null : x;
  if (typeof Node !== 'undefined' && x instanceof Node) return null;
  const o = {};
  Object.keys(x).forEach(k => {
    const v = x[k]; if (typeof v === 'function' || v === undefined) return;
    if (k === 'di' && typeof v === 'number' && x.eid != null && typeof indexDe === 'function') { const i = indexDe(x.eid); if (i >= 0 && v - i >= 0 && v - i <= 1) o.dio = v - i; else o.di = v; return; }   /* un rang sans identité retrouvable reste tel quel : il se voit au banc */
    o[k.replace(DR_CLE_HUB, c => '%' + c.charCodeAt(0).toString(16))] = dr_versHub(v);
  });
  return o;
}
function dr_duHub(x){
  if (Array.isArray(x)) return x.map(dr_duHub);
  if (!x || typeof x !== 'object') return x;
  const o = {};
  Object.keys(x).forEach(k => { o[k.replace(/%(2e|23|24|5b|5d|2f)/g, (m, h) => String.fromCharCode(parseInt(h, 16)))] = dr_duHub(x[k]); });
  if ('dio' in o) { const i = (o.eid != null && typeof indexDe === 'function') ? indexDe(o.eid) : -1; if (i >= 0) o.di = i + (o.dio || 0); delete o.dio; }   /* seulement là où le rang a été retiré */
  return o;
}
/* l'état de l'heure, épuré : sans le tableau ni l'attente ni l'animation, sans les minuteurs, sans les rangs ;
   avec ce que `S` ne porte pas et sans quoi la reprise perdrait les dévoilements et les réponses (`parDiapo`, `vuMax`, audit M2) */
const DR_ETAT_HORS = ['mur', 'attente', 'anim', 'coupure', 'di', 'ordres', 'repSnap', 'blocActif', 'cand'];
function dr_etatHeure(){
  try { S.eidCourant = eidDe(S.di); } catch (e) {}
  const s = {}; Object.keys(S).forEach(k => { if (DR_ETAT_HORS.includes(k) || k.charAt(0) === '_') return; s[k] = S[k]; });
  return { S: dr_versHub(s), parDiapo: dr_versHub(parDiapo), vuMax: dr_versHub(vuMax), maj: Date.now() };
}
const dr_journalHub = () => dr_versHub(J);

/* ─── peut-on écrire ? (contrat §5 : ni atelier, ni répétition, ni hors d'une heure lancée, ni en vue tableau) ─── */
function dr_clPeutEcrire(){
  try {
    if (/[?&]vue=tableau(&|$)/.test(location.search)) return false;
    if (typeof S !== 'object' || !S || !S.lancee || S.atelier || S.repetition) return false;
    if (typeof AT_DR_REGIME === 'undefined' || AT_DR_REGIME !== 'classe' || !AT_DR_COURS) return false;
    return typeof dr_cheminC === 'function' && !!dr_cheminC();
  } catch (e) { return false; }
}

/* ─── au fil : la copie, le journal, l'état, le paquet — même débounce de 900 ms qu'aujourd'hui (`_drCopieAuto`, `_drTraceAuto`) ─── */
/* la copie jouée (`C/ecrans`), appelée par `dr_sauve` du socle en régime classe (audit E1, C3) */
function dr_copieAuto(vite){
  clearTimeout(DR_CL.cT);
  DR_CL.cT = setTimeout(() => {
    if (!dr_clPeutEcrire()) return;
    const ecr = JSON.parse(JSON.stringify(seance().ecrans)); const em = dr_empreinte(ecr);
    dr_ecrire(dr_cheminC() + '/ecrans', ecr, 'Séance en classe — copie au fil de l’eau (' + AT_DR_COURS.classeNom + ')', () => { dr_temoinIntegre(em); });
  }, vite ? 0 : 900);
  dr_journalAuto(vite); dr_etatAuto(vite); dr_traceAuto(vite);
}
function dr_journalAuto(vite){
  clearTimeout(DR_CL.jT);
  DR_CL.jT = setTimeout(() => { if (!dr_clPeutEcrire()) return; dr_ecrire(dr_cheminC() + '/journal', dr_journalHub(), 'Le journal de l’heure (' + AT_DR_COURS.classeNom + ')', () => {}); }, vite ? 0 : 900);
}
function dr_etatAuto(vite){
  clearTimeout(DR_CL.eT);
  DR_CL.eT = setTimeout(() => { if (!dr_clPeutEcrire()) return; dr_ecrire(dr_cheminC() + '/etat', dr_etatHeure(), 'L’état de l’heure, pour la reprendre (' + AT_DR_COURS.classeNom + ')', () => {}); }, vite ? 0 : 900);
}
function dr_traceAuto(vite){
  clearTimeout(DR_CL.tT);
  DR_CL.tT = setTimeout(() => {
    if (!dr_clPeutEcrire()) return; const ch = dr_cheminH(); if (!ch) return;
    /* `H/absents` est écrit par la case de l'EDT (`edtAbsence`) : on le relit et on le garde, jamais on ne l'écrase (audit C5) */
    dr_lire(ch + '/absents', abs => { const p = dr_paquetHeure(false); if (!p) return; if (abs) p.absents = abs; dr_ecrire(ch, p, 'Heure de cours — ' + p.creneau + ' (' + p.classe + ')', () => {}); });
  }, vite ? 0 : 900);
}
/* le témoin « déroulé intègre » (R9) : l'empreinte de ce qui a été écrit, comparée à ce que le hub rend */
function dr_empreinte(x){ const s = JSON.stringify(x); let h = 0; for (let j = 0; j < s.length; j++) h = ((h << 5) - h + s.charCodeAt(j)) | 0; return s.length + '-' + (h >>> 0).toString(36); }
function dr_temoinIntegre(em){
  dr_lire(dr_cheminC() + '/ecrans', v => { DR_CL.empreinte = em; DR_CL.relue = v ? dr_empreinte(v) : ''; const t = document.getElementById('dr-integre'); if (!t) return;
    const ok = DR_CL.relue === em; t.textContent = ok ? '● déroulé intègre' : '● déroulé à vérifier'; t.className = ok ? 'dr-integre-ok' : 'dr-integre-ko';
    t.title = ok ? 'Ce que la classe a vu est au hub, bit pour bit : la copie écrite et la copie relue ont la même empreinte (' + em + ').' : 'La copie relue au hub n’est pas celle qui vient d’être écrite : la liaison est lente ou coupée. Rien n’est perdu ici ; le site réessaie au prochain geste.'; });
}

/* ─── le paquet de l'heure : LES MÊMES CHAMPS qu'aujourd'hui (`_drPaquetHeure`), composés depuis le journal ───
   `activites[]` : une ligne par écran joué (le sens que l'EDT lit : « N activités », `reel === 0` = reportée — audit C4),
   `eid` fait foi, `n` reste un rang de LECTURE (LOT C2 ③.3) ; `reel` = le temps passé d'après les entrées `diapo` du
   journal, moins les coupures mises à part (C1 1.3 bis) ; `passages` = les entrées sur cet écran.
   `decisions` par rang TOMBE (audit C3 : personne ne le relit) ; `decisionsParEcran` (par `eid`) et `decisionsParActivite`
   (par `actId`) le remplacent. Plus ce que la maquette sait : appel, coupures, échéance, travail, réserve, versements, paroles. */
function dr_paquetHeure(clos){
  if (typeof AT_DR_COURS === 'undefined' || !AT_DR_COURS || !S.lancee) return null;
  const h = S.heure, E = seance().ecrans, t1 = clos ? (S.finReel || Date.now()) : Date.now();
  const ev = J.filter(x => x.type === 'diapo' && x.h === h);
  const fin = (x, k) => (k + 1 < ev.length ? ev[k + 1].t : t1);
  const parEid = {};
  ev.forEach((x, k) => { const eid = x.eid != null ? x.eid : eidDe(x.di); if (eid == null) return; const l = parEid[eid] || (parEid[eid] = { ms: 0, passages: 0 }); l.ms += Math.max(0, fin(x, k) - x.t); l.passages++; });
  (S.coupures || []).forEach(c => { if (!c.compte && c.eid != null && parEid[c.eid]) parEid[c.eid].ms = Math.max(0, parEid[c.eid].ms - ((c.fin || t1) - c.debut)); });
  const activites = Object.keys(parEid).map(eid => { const i = indexDe(eid), e = E[i] || {}; return { n: i, eid, act: e.act || ('écran ' + (i + 1)), prevu: +(e.dur || 0), reel: Math.round(parEid[eid].ms / 60000), passages: parEid[eid].passages, comp: Array.isArray(e.comp) ? e.comp : [] }; })
    .sort((a, b) => a.n - b.n);
  const acts = (typeof actDe === 'function') ? [...new Set(E.map(actDe).filter(Boolean))] : [];
  const parActivite = acts.map(a => { const ds = (a.diapos || []).map(i => eidDe(i)).filter(x => x != null); const ms = ds.reduce((t, d) => t + ((parEid[d] || {}).ms || 0), 0); const ps = ds.reduce((t, d) => t + ((parEid[d] || {}).passages || 0), 0);
    return { actId: a.id, num: a.num, titre: a.titre || '', prevu: (a.diapos || []).reduce((t, i) => t + (+((E[i] || {}).dur) || 0), 0), reel: Math.round(ms / 60000), passages: ps }; }).filter(a => a.passages);
  const decisionsParEcran = {}, decisionsParActivite = {};
  Object.keys(S.decisions || {}).forEach(k => { const d = S.decisions[k]; const a = acts.find(x => x.id === k);
    if (a) { decisionsParActivite[k] = d; (a.diapos || []).forEach(i => { const eid = eidDe(i); if (eid != null && !(typeof finie === 'function' && finie(E[i], i))) decisionsParEcran[eid] = d; }); }
    else if (indexDe(k) >= 0) decisionsParEcran[k] = d; });
  const debutReel = S.debutReel || ((J.find(x => x.type === 'lancement' && x.h === h) || {}).t) || Date.now();
  const p = {
    classe: AT_DR_COURS.classeNom, creneau: dr_creneauDuCours(AT_DR_COURS), lanceA: AT_DR_COURS.debut, fin: AT_DR_COURS.fin,
    debutReel, finReel: clos ? t1 : null, tempsUtilePrevu: dr_tempsUtile(dr_creneauDuCours(AT_DR_COURS), AT_DR_COURS.debut),
    minutesJouees: Math.round((t1 - debutReel) / 60000), heure: h, sur: (dr_heureJouee(h) || {}).sur || null,
    activites, parActivite, decisionsParEcran, decisionsParActivite,
    appel: S.appel || {}, coupures: S.coupures || [], echeance: S.echeance || null, travail: (typeof texteTravailED === 'function' ? texteTravailED() : '') || '',
    reserve: S.reserve || [], versements: S.versements || {}, parts: S.parts || [],
    clos: !!clos, maj: Date.now()
  };
  if (clos && S.closPar) p.closPar = S.closPar;
  return dr_versHub(p);
}

/* ─── le pointeur du cours (`sesCoursEcrire`/`sesCoursFermer`, même forme qu'aujourd'hui) et la clôture certaine ─── */
function dr_coursActif(){ const ec = AT.edChap || {}; return { niveau: ec.level, chapitre: ec.chnum, seance: ATVUES.snum, classeSlug: AT_DR_COURS.classeSlug, classeNom: AT_DR_COURS.classeNom, debut: AT_DR_COURS.debut, fin: AT_DR_COURS.fin }; }
function dr_coursEcrire(){
  if (!AT_DR_COURS || !ATVUES.snum) return;
  try { SES.ctx = dr_coursActif(); SES.actif = true; } catch (e) {}
  dr_ecrire('/site/cours_actif', Object.assign(dr_coursActif(), { ts: Date.now() }), 'Le cours annoncé aux autres appareils', () => {});
  /* la scène du cours précédent ne doit jamais ressusciter : la scène neuve, au format d'E3 (`et`), tout de suite (audit F10) */
  try { if (typeof dr_sceneAuto === 'function') dr_sceneAuto(true); } catch (e) {}
}
function dr_coursFermer(){ dr_ecrire('/site/cours_actif', null, 'Le cours est clos', () => {}); try { SES.actif = false; } catch (e) {} }
/* efface le pointeur SEULEMENT s'il désigne encore l'heure close (`_drCoursActifEffacerSi`, par `dr_lire`) */
function dr_coursActifEffacerSi(sig){ if (!sig) return; dr_lire('/site/cours_actif', c => { if (!c || _drSignatureCours(c) !== sig) return; dr_ecrire('/site/cours_actif', null, 'Le pointeur de l’heure close', () => {}); }); }
/* la clôture CERTAINE de l'heure précédente (`_drCloreHeureRestee`, par `dr_lire` : le mode test lit sa copie) */
function dr_cloreHeureRestee(slugNeuf, nomNeuf, c){
  const suite = c => {
    if (!c || !c.ts || (Date.now() - c.ts) > 4 * 3600 * 1000) return;
    if (c.classeSlug === slugNeuf && String(c.seance) === String(ATVUES.snum) && String(c.chapitre) === String((AT.edChap || {}).chnum)) return;   /* c'est la même heure */
    const base = _drBaseHeureDe(c, c.ts); if (!base) return; const ch = base.replace(FIREBASE_BASE, '');
    dr_ecrire(ch + '/clos', true, 'Clôture certaine de l’heure précédente', () => {});
    dr_ecrire(ch + '/finReel', Date.now(), 'Fin réelle de l’heure précédente', () => {});
    dr_ecrire(ch + '/closPar', 'lancement de ' + (nomNeuf || slugNeuf), 'Motif de clôture', () => {});
    dr_coursActifEffacerSi(_drSignatureCours(c));
    try { atInfo('L’heure de ' + escapeHtml(String(c.classeNom || c.classeSlug || '')) + ' (' + escapeHtml(dr_creneauDuCours(c)) + ') n’était pas close : elle vient de l’être. Rien de cette heure n’entre dans la suivante.'); } catch (e) {}
  };
  if (c !== undefined) suite(c); else dr_lire('/site/cours_actif', suite);
}

/* ─── lancer : `atDrJouerClic`, ses gestes dans l'ordre, puis le lancement de la maquette ─── */
function dr_lancer(classeSlug, creneau, debut, heure){
  classeSlug = classeSlug || dr_classeProposee(); creneau = creneau || dr_creneauPropose(); debut = debut || dr_debutPropose(creneau); heure = +heure || 1;
  const nom = dr_nomClasse(classeSlug), fin = String(creneau).split('-')[1];
  if (!classeSlug) { try { atInfo('Aucune classe pour ce niveau : ajoute-la dans le panneau des classes, puis lance.'); } catch (e) {} return; }
  /* R8 : on avertit, on ne bloque jamais (le professeur a tous les droits) */
  if (dr_tempsUtile(creneau, debut) <= 0) { try { atInfo('Attention : ce début ne laisse aucun temps utile avant ' + fin + ' — la séance se lance quand même.'); } catch (e) {} }
  dr_lire('/site/cours_actif', c => {
    const ici = { niveau: (AT.edChap || {}).level, chapitre: (AT.edChap || {}).chnum, seance: ATVUES.snum, classeSlug, debut, fin };
    const meme = c && c.ts && (Date.now() - c.ts) < 4 * 3600 * 1000 && c.classeSlug === classeSlug && String(c.seance) === String(ici.seance) && String(c.chapitre) === String(ici.chapitre) && c.fin === fin
      && new Date(c.ts).toDateString() === new Date().toDateString();
    if (meme) { /* cette heure tourne déjà : on la REPREND, on ne la recopie pas (audit C6) */
      AT_DR_COURS = { debut: c.debut, fin: c.fin, classeSlug, classeNom: nom }; AT_DR_REGIME = 'classe';
      dr_reprendre(ok => { if (!ok) dr_lancerNeuf(classeSlug, nom, creneau, c.debut, heure, c); }); return; }
    dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c);
  });
}
function dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c){
  const fin = String(creneau).split('-')[1];
  try { dr_cloreHeureRestee(classeSlug, nom, c); } catch (e) {}
  /* une heure tourne encore ici (Paul enchaîne deux classes en deux minutes) : elle se clôt d'abord, sa trace sous SA clé */
  if (S.lancee && !S.close && AT_DR_REGIME === 'classe' && AT_DR_COURS) { const ch = dr_cheminH(); S.finReel = Date.now(); S.closPar = 'lancement suivant'; const p = dr_paquetHeure(true);
    if (ch && p) dr_ecrire(ch, p, 'Heure close à l’ouverture de la suivante — ' + p.creneau, () => {}); dr_journalAuto(true); dr_etatAuto(true);
    try { atInfo('L’heure précédente (' + escapeHtml(AT_DR_COURS.classeNom) + ' · ' + escapeHtml(p ? p.creneau : '') + ') n’était pas close : elle vient de l’être, sa trace est enregistrée.'); } catch (e) {} }
  const copie = (typeof atDrJouer === 'function') ? atDrJouer(classeSlug, nom) : null;
  AT_DR_COURS = { debut, fin, classeSlug, classeNom: nom }; AT_DR_REGIME = 'classe';
  try { chChargerTaxo(() => {}); } catch (e) {}   /* [8.67.1] le T-5 nomme les notions, jamais leurs codes */
  try { if (copie && typeof dr_jouerCopie === 'function') dr_jouerCopie(copie.ecrans); } catch (e) {}   /* le socle joue la copie de la classe (E1) */
  dr_heurePoser(heure, AT_DR_COURS);
  S.closPar = null; S.finReel = null; S.debutReel = Date.now();
  try { $('ecran-edt').classList.remove('on'); } catch (e) {}   /* la porte se referme (le clic de l'EDT simulé le faisait) */
  lancerHeure(heure);
  dr_coursEcrire();
  dr_traceReprendre(() => dr_copieAuto(true));
}
/* la relance dans le même créneau reprend la trace (`_drTraceReprendre`) : le début réel revient ; une trace d'une autre
   classe ou d'un autre créneau n'est pas reprise (elle se dit, l'heure part à neuf) */
function dr_traceReprendre(cb){
  const ch = dr_cheminH(); if (!ch) { if (cb) cb(); return; }
  dr_lire(ch, t => {
    if (t && !t.clos) {
      if ((t.classe && t.classe !== AT_DR_COURS.classeNom) || (t.creneau && t.creneau !== dr_creneauDuCours(AT_DR_COURS))) { try { atInfo('Une trace d’heure existait sous cette clé mais portait « ' + escapeHtml(String(t.classe || '?')) + ' · ' + escapeHtml(String(t.creneau || '?')) + ' » : elle n’est pas reprise, cette heure part à neuf.'); } catch (e) {} }
      else if (t.debutReel) { S.debutReel = t.debutReel; S.ecoule = Math.max(0, Math.round((Date.now() - t.debutReel) / 1000)); try { atInfo('Heure de ' + t.creneau + ' reprise — ' + (t.minutesJouees || 0) + ' min déjà comptées.'); } catch (e) {} }
    }
    if (cb) cb();
  });
}

/* ─── reprendre en pleine heure : `C/etat` + `C/journal` + `H` (la règle de `_drTraceReprendre`) ─── */
function dr_reprendre(cb){
  const C = dr_cheminC(), ch = dr_cheminH(); if (!C || !ch) { if (cb) cb(false); return; }
  dr_lire(C + '/etat', etat => dr_lire(C + '/journal', jr => dr_lire(ch, t => {
    if (!etat || !etat.S) { if (cb) cb(false); return; }
    if (t && (t.clos || (t.classe && t.classe !== AT_DR_COURS.classeNom) || (t.creneau && t.creneau !== dr_creneauDuCours(AT_DR_COURS)))) { if (cb) cb(false); return; }
    const s = dr_duHub(etat.S);
    Object.keys(s).forEach(k => { S[k] = s[k]; });
    [[parDiapo, etat.parDiapo], [vuMax, etat.vuMax]].forEach(([o, v]) => { Object.keys(o).forEach(k => delete o[k]); Object.assign(o, dr_duHub(v || {})); });
    J.length = 0; (Array.isArray(jr) ? jr : []).forEach(o => J.push(dr_duHub(o)));
    S.ordres = {}; Object.keys(S.ordresEid || {}).forEach(h => { S.ordres[h] = (S.ordresEid[h] || []).map(indexDe).filter(i => i >= 0); });   /* l'ordre de l'heure, refait depuis les identités */
    try { reindexer(); } catch (e) {}
    const hc = dr_heureJouee(S.heure); if (hc && typeof HEURES_SIM === 'object') HEURES_SIM[S.heure] = hc; else dr_heurePoser(S.heure, AT_DR_COURS, t && t.debutReel);
    S.debutReel = (t && t.debutReel) || S.debutReel || Date.now();
    try { T0 = (dr_heureJouee(S.heure) || {}).base || T0; } catch (e) {}   /* now() = l'horloge réelle */
    S.ecoule = Math.max(0, Math.round((Date.now() - S.debutReel) / 1000)); S.lancee = true; S.close = false; S.mur = null;
    /* le temps où la page était fermée est une COUPURE (C1 1.3 bis) : mis à part tant que Paul n'a pas dit que le cours a continué */
    const trou = Date.now() - (etat.maj || Date.now());
    if (trou >= 60000) { S.coupures = S.coupures || []; const e = ecran(); S.coupures.push({ debut: etat.maj, fin: Date.now(), di: S.di, eid: e && e.eid, duree: Math.round(trou / 60000), compte: false, rechargement: true }); journal('coupure', { duree: Math.round(trou / 60000), rechargement: true }); }
    journal('reprise', { depuis: etat.maj || null });
    DR_CL.reprise = true;
    try { $('ecran-edt').classList.remove('on'); } catch (e) {}
    try { voir('pilotage'); } catch (e) {}
    try { $('hou').textContent = dr_entete(S.heure); } catch (e) {}
    try { dr_coursEcrire(); } catch (e) {}
    tout(); dr_copieAuto(true);
    try { atInfo('Heure reprise : la diapo, le chrono, les décisions, les paroles et les notes sont revenus.'); } catch (e) {}
    if (cb) cb(true);
  })));
}
/* l'entête de l'heure : la classe, le créneau, l'heure n/N, la séance */
function dr_entete(h){ const x = dr_heureJouee(h) || {}; return (x.jour || '') + ' ' + (x.debut || '') + '-' + (x.fin || '') + ' · ' + (x.classe || '') + ' · heure ' + h + ' sur ' + (x.sur || '?') + ' · ' + (seance().titre || seance().title || ''); }

/* ─── clore : l'étape 7 fait les écritures d'`atDrCloreFin` (H clos, finReel, cours_actif nul), plus le journal et l'état ─── */
function dr_cloreFin(){
  if (typeof AT_DR_COURS === 'undefined' || !AT_DR_COURS || AT_DR_REGIME !== 'classe') return;
  const C = dr_cheminC(), ch = dr_cheminH(); S.finReel = Date.now(); S.closPar = null;
  const p = dr_paquetHeure(true), jr = dr_journalHub(), et = dr_etatHeure();
  if (ch && p) dr_lire(ch + '/absents', abs => { if (abs) p.absents = abs; dr_ecrire(ch, p, 'Heure close — ' + p.creneau + ' (' + p.classe + ')', () => {}); });
  if (C) { dr_ecrire(C + '/journal', jr, 'Le journal de l’heure, à la clôture', () => {}); dr_ecrire(C + '/etat', et, 'L’état de l’heure, à la clôture', () => {}); }
  [DR_CL.jT, DR_CL.eT, DR_CL.tT, DR_CL.cT].forEach(clearTimeout);
  try { window.AT_DR_DERNIER = { level: (AT.edChap || {}).level, chnum: (AT.edChap || {}).chnum, snum: ATVUES.snum, classe: AT_DR_COURS.classeSlug, ts: Date.now() }; } catch (e) {}
  dr_coursFermer();
  AT_DR_REGIME = 'prep';
}
