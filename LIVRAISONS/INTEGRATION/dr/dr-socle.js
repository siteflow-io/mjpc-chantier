/* ═══════════════════════════════════════════════════════════════════════════
   dr-socle.js — LE SOCLE DU DÉROULÉ (E1, contrat des quatre §5)
   Première partie : les interfaces, ce qui remplace la simulation de la maquette
   (DATA, ELEVES, HEURES_SIM, DECALAGE). Seconde partie : le code de la maquette
   p8-5g, découpé par E1/decouper.mjs (chaque ligne qui lisait DATA le dit).
   Règles (contrat §5) : aucune écriture au hub autrement que par dr_ecrire (donc
   mjpcPutJson : classeur d'issues, témoin, mode test) ; rien en répétition ; jamais
   un rang au hub : les écrans, les activités et les notes se désignent par eid.
   ═══════════════════════════════════════════════════════════════════════════ */
var DR_MEM = { zone: document.getElementById('dr-zone'), demarre: false, chap: null, activites: {}, notes: {}, travail: {}, empreintes: {}, vues: new WeakMap(), prepares: new WeakSet(), blocs: new WeakSet(), taxo: null, taxoSrc: null, classeSlug: null, minuteur: null };

/* ── la zone : #dr-zone, créée une fois (dr-gabarit.js), garée dans <body> tant que le déroulé n'est pas montré.
   Le site peut effacer sa zone (`at-zone`) quand il veut : la nôtre n'y meurt jamais, elle revient au garage. ── */
function dr_zone(){ return DR_MEM.zone || document.getElementById('dr-zone'); }
function dr_actif(){ const z = dr_zone(); return !!(z && z.isConnected && !z.classList.contains('dr-parque')); }
function dr_parquer(){ const z = dr_zone(); if (!z) return; z.classList.add('dr-parque'); if (z.parentNode !== document.body) document.body.appendChild(z); dr_placerVolet(); }
function dr_monter(hote){ const z = dr_zone(); if (!z || !hote) return; if (z.parentNode !== hote) hote.appendChild(z); z.classList.remove('dr-parque'); dr_placerVolet(); dr_dimensionnerZone(); }
/* (13, contrat §8.3) la colonne unique : le #volet du déroulé vit sous la séance dépliée de la colonne du site (.at-som-volet, posé par atSomInjecterEcrans) ;
   quand le déroulé n'est pas à l'écran, il revient à sa place dans la zone (avant .scene). Jamais deux colonnes. */
function dr_placerVolet(){
  const v = DR_MEM.volet || (DR_MEM.volet = document.getElementById('volet')); const z = dr_zone(); if (!v || !z) return;
  const hote = dr_actif() ? document.querySelector('#at-arbre .at-som-volet') : null;
  if (hote) { if (v.parentNode !== hote) hote.appendChild(v); z.classList.add('dr-colonne-unique'); }
  else { const c = z.querySelector('.corps'); if (c && v.parentNode !== c) c.insertBefore(v, c.querySelector('.scene')); z.classList.remove('dr-colonne-unique'); }
}
function dr_dimensionnerZone(){ const z = dr_zone(); if (!z || z.classList.contains('dr-parque')) return; const haut = Math.max(0, z.getBoundingClientRect().top); z.style.height = Math.max(420, window.innerHeight - haut - 4) + 'px'; }
/* les écoutes globales de la maquette (clavier, souris, fenêtre) ne valent que quand le déroulé est à l'écran :
   ailleurs dans le site, ← → espace G N T L R n'appartiennent pas au déroulé */
function dr_ecouteDoc(type, fn, opt){ document.addEventListener(type, function(ev){ if (!dr_actif()) return; return fn.call(this, ev); }, opt); }
function dr_imageAbsente(img){ /* E1 (relecture continue E4, B4 15:50) : une image absente montre toujours sa ligne « image absente de mjpc-medias · … », jamais l'icône cassée — même quand le redessin recrée l'<img> après coup */ if (!img || !img.closest || !img.closest('#mur, #vue-mini')) return; const v = img.nextElementSibling; if (!v || !v.classList.contains('img-vide')) return; img.style.display = 'none'; v.style.display = 'flex'; }
function dr_imagesAbsentes(){ document.querySelectorAll('#mur .img-sup img, #vue-mini .img-sup img').forEach(i => { if (i.complete && !i.naturalWidth && i.getAttribute('src')) dr_imageAbsente(i); }); }
dr_ecouteDoc('error', ev => { if (ev.target && ev.target.tagName === 'IMG') dr_imageAbsente(ev.target); }, true);
function dr_ecouteWin(type, fn, opt){ window.addEventListener(type, function(ev){ if (!dr_actif() && type !== 'message') return; return fn.call(this, ev); }, opt); }
(function(){ /* le garde-fou : si le site efface la zone qui la portait, elle revient au garage (ses écoutes, son état et ses nœuds restent) */
  const veille = () => { const z = dr_zone(); if (z && !z.isConnected) dr_parquer(); const v = DR_MEM.volet; if (v && !v.isConnected) dr_placerVolet(); };   /* la colonne redessinée par le site : le volet y revient (ou rentre dans la zone) */
  try { new MutationObserver(veille).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  window.addEventListener('resize', () => { if (dr_actif()) dr_dimensionnerZone(); });
})();

/* ── le contexte : le chapitre ouvert, la séance de la colonne, l'heure de cours ── */
function dr_ctx(){
  { const t = typeof SES !== 'undefined' && SES && SES.mode === 'tableau' && SES.ctx; if (t) return { level: t.niveau, chnum: t.chapitre, snum: t.seance != null ? String(t.seance) : null, classeSlug: t.classeSlug, classeNom: t.classeNom || t.classeSlug, debut: t.debut || null, fin: t.fin || null, heure: t.heure || 1, regime: 'tableau' }; } /* E1 (réveil n°2, M1) : en vue tableau, le contexte vient de cours_actif (SES.ctx), pas d'AT.edChap — pour qu'E3 rende sans chapitre chargé */
  const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || null;
  const c = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) || null;
  const cl = dr_classe();
  return { level: ec ? ec.level : null, chnum: ec ? ec.chnum : null, snum: (typeof ATVUES !== 'undefined' && ATVUES.snum != null) ? String(ATVUES.snum) : null,
    classeSlug: c ? c.classeSlug : cl.slug, classeNom: c ? (c.classeNom || c.classeSlug) : cl.nom, debut: c ? c.debut : null, fin: c ? c.fin : null,
    heure: (typeof S !== 'undefined' && S && S.heure) || 1, regime: (typeof AT_DR_REGIME !== 'undefined' ? AT_DR_REGIME : 'prep') };
}
function dr_chapitre(){ const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || null; if (!ec || typeof chapitresData === 'undefined') return null; return (chapitresData[ec.level] || {})[ec.chnum] || null; }
function dr_chapitreTitre(){ const c = dr_chapitre(); return (c && (c.title || c.titre)) || ''; }
function dr_cles(){ const c = dr_chapitre(); if (!c || !c.seances) return []; return Object.keys(c.seances).filter(k => c.seances[k]).sort((a, b) => (+a) - (+b)); }
function dr_seance(sk){ const c = dr_chapitre(); return (c && c.seances && c.seances[sk]) || null; }
function dr_rangSeance(sk){ const i = dr_cles().indexOf(String(sk)); return i < 0 ? 0 : i; }
function dr_cleSeance(si){ const k = dr_cles(); return k[si] != null ? k[si] : null; }
/* la trame d'une séance : B/deroule.ecrans, identifiée (eid) et lue par le rendu (dr_preparer) — jamais copiée */
function dr_trameDe(sk){
  dr_toutLire(); const sce = dr_seance(sk); if (!sce) return [];
  if (!sce.deroule || typeof sce.deroule !== 'object') sce.deroule = { ecrans: [], maj: 0 };
  if (!Array.isArray(sce.deroule.ecrans)) sce.deroule.ecrans = [];
  const E = sce.deroule.ecrans;
  if (!DR_MEM.prepares.has(E)) { DR_MEM.prepares.add(E); if (typeof _drIdentifierEcrans === 'function') _drIdentifierEcrans(E); dr_normaliserTrame(E, sk); dr_preparer(E); dr_lireSousObjets(sk); return E; }   /* l'empreinte se prend après la lecture : rien ne s'écrit tant que Paul n'a rien modifié */
  dr_preparer(E); return E;
}
/* la vue d'une séance telle que la maquette la lisait (DATA.seances[si] = {titre, ecrans}) : un regard, pas une copie */
function dr_seances(){ if (dr_pageTableau()) { const s = []; s[(typeof DR_TAB !== 'undefined' && DR_TAB.si) || 0] = { titre: '', ecrans: dr_preparer(dr_tabTrame()) }; return s; } return dr_cles().map(k => dr_vueSeance(k)); }
/* la page tableau (?vue=tableau, E3) n'a pas de chapitre ouvert : elle rend les écrans qu'elle reçoit (DR_TAB.ecrans, posés par dr_tabPoserEcran d'E3) */
function dr_pageTableau(){ return /[?&]vue=tableau(&|$)/.test(location.search); }
function dr_tabTrame(){ return (typeof DR_TAB !== 'undefined' && Array.isArray(DR_TAB.ecrans)) ? DR_TAB.ecrans : []; }
function dr_vueSeance(k){ const sce = dr_seance(k); if (!sce) return { titre: '', ecrans: [] }; let v = DR_MEM.vues.get(sce); if (!v) { v = {}; Object.defineProperty(v, 'titre', { get: () => sce.title || sce.titre || '', enumerable: true }); Object.defineProperty(v, 'ecrans', { get: () => dr_trameDe(k), set: x => { sce.deroule = sce.deroule || {}; sce.deroule.ecrans = x; DR_MEM.prepares.add(x); dr_preparer(x); }, enumerable: true }); Object.defineProperty(v, 'cle', { value: k }); DR_MEM.vues.set(sce, v); } return v; }
function dr_trame(){ /* en préparation : la trame de la séance de la colonne ; en classe : la copie jouée (E2 : dr_trameJouee) */
  if (typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME === 'classe' && typeof dr_trameJouee === 'function') { const t = dr_trameJouee(); if (t) return dr_preparer(t); }
  if (dr_pageTableau()) return dr_preparer(dr_tabTrame());
  const k = (typeof ATVUES !== 'undefined' && ATVUES.snum != null) ? ATVUES.snum : dr_cleSeance(0); return dr_trameDe(k);
}
/* cadrage 4 · 2.6 (repris de la maquette, normaliserTrame) : chaque heure se termine par une diapo de rôle « fin » ; écrans sans heure = heure 1 (le site n'a pas encore d'heure prévue) */
function dr_normaliserTrame(E, sk){
  E.forEach(e => dr_heureParDefaut(e));
  const heures = [...new Set(E.map(e => e.heure))].sort((a, b) => a - b);
  heures.forEach(h => { const idx = E.map((e, i) => e.heure === h ? i : -1).filter(i => i >= 0); const der = idx[idx.length - 1]; if (der != null && E[der].role === 'fin') return;
    const fin = { eid: 'fin-h' + h + '-s' + (sk != null ? sk : 'x'), /* E1 (relecteur neuf n°2) : stable — elle dépendait de la première diapo : celle-ci déplacée, la note de la fin d'heure restait orpheline au hub. La clé de la séance est celle du hub (/seances/<clé>), pas un rang */ act: 'Fin d\'heure', dur: 5, role: 'fin', comp: [], blocs: [] }; fin.heure = h; Object.defineProperty(fin, 'dr_pose', { value: true });
    E.splice(der + 1, 0, fin); });
}

/* ── dr_blocLu : le bloc du site lu TEL QUEL par le rendu de la maquette (qui lisait {t, bid, txt, el}).
   Un seul sens, à la lecture : des accesseurs non énumérables posés sur l'objet du site lui-même ; aucune seconde copie,
   et JSON.stringify n'écrit que le modèle du site. Un bloc créé par la maquette (format {t, bid, txt, el}) est rangé au
   modèle du site à sa première lecture (même objet). ── */
function dr_tableauLie(lire, ecrire, longueur, couper){ /* un tableau de chaînes vu à travers le modèle du site */
  return new Proxy([], {
    get(t, p){ if (p === 'length') return longueur(); if (typeof p === 'string' && /^\d+$/.test(p)) return lire(+p); const v = Array.prototype[p]; return typeof v === 'function' ? v : t[p]; },
    set(t, p, v){ if (p === 'length') { couper(+v); return true; } if (typeof p === 'string' && /^\d+$/.test(p)) { ecrire(+p, v); return true; } t[p] = v; return true; },
    deleteProperty(t, p){ if (typeof p === 'string' && /^\d+$/.test(p)) { ecrire(+p, ''); } return true; },
    has(t, p){ if (typeof p === 'string' && /^\d+$/.test(p)) return +p < longueur(); return p in Array.prototype; },
    ownKeys(){ const n = longueur(); const k = []; for (let i = 0; i < n; i++) k.push(String(i)); k.push('length'); return k; },
    getOwnPropertyDescriptor(t, p){ if (p === 'length') return { value: longueur(), writable: true, enumerable: false, configurable: false }; if (typeof p === 'string' && /^\d+$/.test(p) && +p < longueur()) return { value: lire(+p), writable: true, enumerable: true, configurable: true }; return undefined; }
  });
}
function dr_acces(b, nom, get, set){ Object.defineProperty(b, nom, { get, set, enumerable: false, configurable: true }); }
function dr_idBloc(b, eid, k){ if (b.id) return b.id; let h = 0; const s = String(eid || '') + ':' + k + ':' + (b.t || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return 'b' + (h >>> 0).toString(36); }
function dr_blocLu(b, eid, k){
  if (!b || typeof b !== 'object') return b;
  if (DR_MEM.blocs.has(b)) return b;   /* déjà lu (un clone de la maquette est un objet neuf : il est relu) */
  /* 1 · un bloc au format de la maquette (créé, collé, cloné par elle) est rangé au modèle du site, sur place */
  const own = n => Object.prototype.hasOwnProperty.call(b, n) && !(Object.getOwnPropertyDescriptor(b, n) || {}).get;
  if (own('bid')) { b.id = b.bid; delete b.bid; }   /* un bid posé par la maquette (copie, collage) fait foi */
  const t = b.t;
  if (t === 'question') { if (own('txt')) { b.q = b.txt; delete b.txt; } if (own('el')) { const el = b.el || []; delete b.el; b.reps = el.map(r => (r && typeof r === 'object') ? r : { i: '', r: String(r == null ? '' : r), refo: false }); } }
  else if (t === 'consigne') { if (own('el')) { const el = b.el || []; delete b.el; b.etapes = el.slice(); } }
  else if (t === 'fiche') { if (own('txt')) { b.titre = b.txt; delete b.txt; } if (own('el')) { const el = b.el || []; delete b.el; b.def = el[0] != null ? el[0] : (b.def || ''); b.corps = el.slice(1).join('') || (b.corps || ''); } }
  else if (t === 'image') { if (own('txt')) { b.legende = b.txt; delete b.txt; } if (own('el')) { const el = b.el || []; delete b.el; if (el.length) b.marques = el; } }
  else if (t === 'schema') { if (own('txt')) { b.titre = b.txt; delete b.txt; } if (own('el')) { delete b.el; } }
  /* 2 · les accesseurs : la maquette lit et écrit bid / txt / el, le site garde id / q / reps / etapes / titre / def / corps / legende */
  if (!b.id) b.id = dr_idBloc(b, eid, k);
  dr_acces(b, 'bid', () => b.id, v => { b.id = v; });
  if (t === 'question') {
    if (!Array.isArray(b.reps)) b.reps = [];
    dr_acces(b, 'txt', () => b.q != null ? b.q : '', v => { b.q = v; });
    const el = dr_tableauLie(i => { const r = b.reps[i]; return r == null ? undefined : (typeof r === 'object' ? (r.r != null ? r.r : '') : String(r)); },
      (i, v) => { if (b.reps[i] && typeof b.reps[i] === 'object') b.reps[i].r = v; else b.reps[i] = { i: '', r: v, refo: false }; },
      () => b.reps.length, n => { b.reps.length = n; });
    dr_acces(b, 'el', () => el, v => { b.reps = (v || []).map(r => (r && typeof r === 'object') ? r : { i: '', r: String(r == null ? '' : r), refo: false }); });
  } else if (t === 'fiche') {
    dr_acces(b, 'txt', () => b.titre != null ? b.titre : '', v => { b.titre = v; });
    const el = dr_tableauLie(i => i === 0 ? (b.def || '') : i === 1 ? (b.corps || '') : undefined, (i, v) => { if (i === 0) b.def = v; else if (i === 1) b.corps = v; }, () => 2, () => {});
    dr_acces(b, 'el', () => el, v => { v = v || []; b.def = v[0] || ''; b.corps = v.slice(1).join(''); });
  } else if (t === 'image') {
    dr_acces(b, 'txt', () => b.legende != null ? b.legende : '', v => { b.legende = v; });
    if (!Array.isArray(b.marques)) Object.defineProperty(b, 'marques', { value: [], writable: true, enumerable: false, configurable: true });
    dr_acces(b, 'el', () => b.marques, v => { b.marques = v || []; });
  } else if (t === 'schema') {
    dr_acces(b, 'txt', () => b.titre != null ? b.titre : '', v => { b.titre = v; });
    const vide = []; dr_acces(b, 'el', () => vide, () => {});
  } else if (t === 'consigne') {
    if (!Array.isArray(b.etapes)) Object.defineProperty(b, 'etapes', { value: [], writable: true, enumerable: false, configurable: true });   /* E1 (relecteur neuf n°2) : les valeurs par défaut ne s'écrivent pas (dr_ecritsSeulement) */
    if (b.txt == null) Object.defineProperty(b, 'txt', { value: '', writable: true, enumerable: false, configurable: true });
    dr_acces(b, 'el', () => b.etapes, v => { b.etapes = v || []; });
  } else {
    if (!Array.isArray(b.el)) { const vide = []; Object.defineProperty(b, 'el', { value: vide, writable: true, enumerable: false, configurable: true }); }
  }
  DR_MEM.blocs.add(b); return b;
}
/* l'heure prévue : absente du site, elle vaut 1 ; dès que Paul la change, elle devient une donnée de la trame (enregistrée) */
function dr_heureParDefaut(e){ if (!e || typeof e !== 'object' || Object.getOwnPropertyDescriptor(e, 'heure')) return; Object.defineProperty(e, 'heure', { get(){ return 1; }, set(v){ Object.defineProperty(e, 'heure', { value: v, writable: true, enumerable: true, configurable: true }); }, enumerable: false, configurable: true }); }
/* une fiche du site porte son propre texte (titre, définition, corps) : la trame réelle n'a aucune fiche liée à une feuille (le lien de la maquette était simulé) */
function dr_ficheEnLigne(b){ return !!(b && b.t === 'fiche' && (String(b.titre || '').trim() || String(b.def || '').trim() || String(b.corps || '').trim())); }
function dr_preparer(E){ if (!Array.isArray(E)) return E; E.forEach(e => { if (!e || typeof e !== 'object') return; if (!Array.isArray(e.blocs)) e.blocs = []; dr_heureParDefaut(e); e.blocs.forEach((b, k) => dr_blocLu(b, e.eid, k)); }); return E; }

/* ── les sous-objets de la trame : B/deroule/{activites, notes, travail}. En mémoire, sous la forme que la maquette lisait
   (DATA.activites[si] = [{id, num, titre, diapos:[rangs]}], DATA.notes["si|eid"], DATA.travailPrevu["si|heure"]) ;
   au hub, par eid et par heure (jamais un rang). ── */
function dr_lireSousObjets(sk){
  const sce = dr_seance(sk); if (!sce) return; const si = String(dr_rangSeance(sk)); const d = sce.deroule || {}; const E = d.ecrans || [];
  const rangDe = eid => E.findIndex(e => e && e.eid === eid);
  DR_MEM.activites[si] = (Array.isArray(d.activites) ? d.activites : Object.values(d.activites || {})).map(a => ({ id: a.id, num: a.num, titre: a.titre || '', diapos: (a.diapos || []).map(rangDe).filter(i => i >= 0) }));
  Object.keys(DR_MEM.notes).forEach(k => { if (k.startsWith(si + '|')) delete DR_MEM.notes[k]; });
  Object.keys(d.notes || {}).forEach(eid => { DR_MEM.notes[si + '|' + eid] = d.notes[eid]; });
  Object.keys(DR_MEM.travail).forEach(k => { if (k.startsWith(si + '|')) delete DR_MEM.travail[k]; });
  Object.keys(d.travail || {}).forEach(h => { DR_MEM.travail[si + '|' + h] = d.travail[h]; });
  DR_MEM.empreintes[sk] = JSON.stringify(dr_derouleDe(sk, true));
}
function dr_activites(){ dr_toutLire(); return DR_MEM.activites; }
function dr_notes(){ dr_toutLire(); return DR_MEM.notes; }
function dr_travail(){ dr_toutLire(); return DR_MEM.travail; }
function dr_toutLire(){ const c = dr_chapitre(); if (DR_MEM.chap === c) return; DR_MEM.chap = c; DR_MEM.activites = {}; DR_MEM.notes = {}; DR_MEM.travail = {}; DR_MEM.empreintes = {}; DR_MEM.prepares = new WeakSet(); if (c) dr_cles().forEach(k => dr_trameDe(k)); }
function dr_documents(){ return {}; }   /* E4 : les items de type doc de la séance (sce.items) — remplacée dans dr-recit.js */
function dr_feuilles(){ return []; }    /* les fiches liées du chapitre (p4a) : source au hub à trancher (audit E1, M1) */
/* ce qui s'écrit au hub pour une séance : {ecrans, activites (eid), notes (eid), travail (heure)} */
/* E1 (relecteur neuf n°2) : un champ posé par défaut à la lecture (etapes, el, marques, txt) reste caché tant qu'il est vide — une frappe dans la diapo 1 écrivait « etapes: [] » dans un bloc de la diapo 18 ; dès qu'il reçoit un contenu, il s'écrit */
function dr_ecritsSeulement(E){ (E || []).forEach(e => (e && e.blocs || []).forEach(b => { if (!b || typeof b !== 'object') return; ['etapes', 'el', 'marques', 'txt'].forEach(n => { const d = Object.getOwnPropertyDescriptor(b, n); if (d && !d.enumerable && 'value' in d && ((Array.isArray(d.value) && d.value.length) || (typeof d.value === 'string' && d.value !== ''))) Object.defineProperty(b, n, { value: d.value, writable: true, enumerable: true, configurable: true }); }); })); }
function dr_derouleDe(sk, brut){
  const sce = dr_seance(sk); const d = (sce && sce.deroule) || {}; const E = d.ecrans || []; const si = String(dr_rangSeance(sk));
  const acts = (DR_MEM.activites[si] || []).map(a => { const o = { id: a.id, num: a.num, titre: a.titre || '', diapos: [...new Set((a.diapos || []).map(i => E[i] && E[i].eid).concat(E.filter(e => e && e.actId === a.id).map(e => e.eid)).filter(Boolean))] }; return o; });   /* E1 (relecteur neuf 1) : les diapos de l'activité par eid — celles que la trame rattache (actId), pas seulement la liste tenue à part */
  const notes = {}; Object.keys(DR_MEM.notes).forEach(k => { if (k.startsWith(si + '|')) { const eid = k.slice(si.length + 1); if (/^[^.#$\[\]\/]+$/.test(eid)) notes[eid] = DR_MEM.notes[k]; } });
  const travail = {}; Object.keys(DR_MEM.travail).forEach(k => { if (k.startsWith(si + '|')) travail[k.slice(si.length + 1)] = DR_MEM.travail[k]; });
  if (!brut) dr_preparer(E);
  dr_ecritsSeulement(E);
  const o = { ecrans: E.filter(e => !(e && e.dr_pose && !(e.blocs || []).length)) };   /* la fin d'heure posée à la lecture ne s'écrit que si Paul y a mis quelque chose */
  if (acts.length) o.activites = acts; if (Object.keys(notes).length) o.notes = notes; if (Object.keys(travail).length) o.travail = travail; return o;
}

/* ── l'écriture : dr_sauve (débounce 900 ms, comme atDrEnrAuto), témoin « Enregistré à … » (atDrEnrConfirme) ── */
function dr_sauve(){ if (typeof S !== 'undefined' && S.repetition) return; clearTimeout(DR_MEM.minuteur); DR_MEM.minuteur = setTimeout(dr_sauveMaintenant, 900); }
/* E1 (relecteur neuf n°2) : une frappe faite moins de 900 ms avant de quitter la page partait avec elle — quand la page se cache ou se ferme, l'enregistrement en attente part tout de suite (toujours par dr_ecrire) */
function dr_sauveAvantDepart(){ if (DR_MEM.minuteur) { clearTimeout(DR_MEM.minuteur); dr_sauveMaintenant(); } }
window.addEventListener('pagehide', dr_sauveAvantDepart); window.addEventListener('beforeunload', dr_sauveAvantDepart); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') dr_sauveAvantDepart(); });
function dr_copieDepuisAtelier(){ /* E1 (relecture continue E4, 20:50, grave — perte de données) : en heure lancée, une retouche faite dans l'onglet Atelier part au hub en 900 ms, dans la copie de la classe (C/ecrans), sans attendre le retour au Pilotage ; jamais dans la trame */
  try { if (typeof dr_cheminC !== 'function' || !dr_cheminC() || typeof AT_DR_REGIME === 'undefined' || AT_DR_REGIME !== 'classe') return; const ecr = JSON.parse(JSON.stringify(seance().ecrans));
    dr_ecrire(dr_cheminC() + '/ecrans', ecr, 'Séance en classe — retouche dans l’atelier', () => { if (typeof dr_temoinEnregistre === 'function') dr_temoinEnregistre(); if (typeof DR_CL === 'object' && DR_CL && typeof dr_empreinte === 'function') DR_CL.empreinteEcrite = dr_empreinte(ecr); }); } catch (e) {} }
function dr_sauveMaintenant(){
  DR_MEM.minuteur = null; if (typeof S !== 'undefined' && S.repetition) return;
  if (dr_ctx().regime === 'classe') { if (S.atelier && S.lancee && !S.close) { dr_copieDepuisAtelier(); return; } if (typeof dr_copieAuto === 'function') dr_copieAuto(); return; }   /* en classe : la copie jouée (E2) ; l'atelier ouvert pendant l'heure l'écrit lui-même (dr_copieAuto se tait tant que l'atelier est ouvert) */
  if (!dr_chapitre()) return;
  let n = 0; dr_cles().forEach(k => { const sce = dr_seance(k); if (!sce || !sce.deroule || !DR_MEM.prepares.has(sce.deroule.ecrans)) return;
    const o = dr_derouleDe(k); const j = JSON.stringify(o); if (DR_MEM.empreintes[k] === j) return; DR_MEM.empreintes[k] = j; n++;
    const val = Object.assign({}, sce.deroule, o, { maj: Date.now() }); if (!o.activites) delete val.activites; if (!o.notes) delete val.notes; if (!o.travail) delete val.travail;
    sce.deroule.maj = val.maj; if (o.activites) sce.deroule.activites = o.activites; if (o.notes) sce.deroule.notes = o.notes; if (o.travail) sce.deroule.travail = o.travail;
    dr_ecrire(dr_cheminBDe(k) + '/deroule', JSON.parse(JSON.stringify(val)), 'Trame du déroulé — séance ' + k, () => { if (typeof atDrEnrConfirme === 'function') atDrEnrConfirme(true); if (typeof dr_temoinEnregistre === 'function') dr_temoinEnregistre(); });
  });
  if (!n && typeof dr_temoinEnregistre === 'function') dr_temoinEnregistre();   /* E1 (relecteur neuf 1) : rien à écrire, le hub a déjà cet état */
}

/* ── ce qu'un autre document reçoit (la fenêtre du tableau, par postMessage ou JSON) : l'écran tel que la maquette le lisait,
   accesseurs résolus en clair. Un transport, pas une donnée : rien de ceci ne s'écrit au hub. ── */
function dr_blocVu(b){ const o = Object.assign({}, b); o.bid = b.bid; o.txt = b.txt; o.el = Array.from(b.el || [], x => x); return JSON.parse(JSON.stringify(o)); }
function dr_ecranVu(e){ if (!e || typeof e !== 'object') return e; const o = JSON.parse(JSON.stringify(e)); o.heure = e.heure; o.blocs = (e.blocs || []).map(dr_blocVu); return o; }
function dr_donneesVues(){ return { chapitre: dr_chapitreTitre(), seances: dr_seances().map(v => ({ titre: v.titre, ecrans: v.ecrans.map(dr_ecranVu) })), activites: dr_activites(), notes: dr_notes(), travailPrevu: dr_travail(), documents: dr_documents(), taxo: dr_taxo(), classe: dr_classe(), feuilles: dr_feuilles() }; }

/* le CSS du déroulé, en texte, pour l'autre document (la fenêtre du tableau) */
function dr_cssTableau(){ for (const s of Array.from(document.styleSheets)) { try { const n = s.ownerNode; if (n && ((n.href && /dr\/dr\.css/.test(n.href)) || (n.tagName === 'STYLE' && /dr\.css — le CSS de la maquette/.test(n.textContent || '')))) return Array.from(s.cssRules).map(r => r.cssText).join('\n'); } catch (e) {} } return ''; }

/* les interfaces du socle, telles que l'autre document (la fenêtre du tableau) les lit : sur sa projection DATA */
function dr_cotesTableau(){ return "var dr_seances = () => DATA.seances, dr_activites = () => DATA.activites || {}, dr_notes = () => DATA.notes || {}, dr_travail = () => DATA.travailPrevu || {}, dr_documents = () => DATA.documents || {}, dr_taxo = () => DATA.taxo || [], dr_classe = () => DATA.classe || {}, dr_chapitreTitre = () => DATA.chapitre || '', dr_feuilles = () => DATA.feuilles || [], dr_donneesVues = () => DATA;\nvar dr_heureDe = h => (" + JSON.stringify(dr_heureDe(1)) + ");"; }

/* ── la classe : ses élèves (« NOM Prénom »), son École Directe, ses prochaines heures ── */
function dr_classeDuNiveau(){ const c = (typeof AT !== 'undefined' && AT && AT.edChap) || null; if (!c || typeof _lvlClasses !== 'function') return null; const l = _lvlClasses(c.level) || []; const k = l[0]; return k == null ? null : (typeof k === 'object' ? (k.slug || k.id || k.nom) : k); }
function dr_classe(){
  const c = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) || null; const slug = (c && c.classeSlug) || DR_MEM.classeSlug || dr_classeDuNiveau();   /* la classe du niveau du chapitre (E2 propose la sienne par dr_classeProposee, qui lit dr_classe) */
  const cl = (slug && typeof classesData !== 'undefined' && classesData[slug]) || {};
  const eleves = (typeof extractEleves === 'function' && cl && Object.keys(cl).length) ? (extractEleves(cl) || []) : ((cl.eleves) || []);
  if (slug !== DR_MEM.classeSlug || ELEVES.length !== eleves.length) { DR_MEM.classeSlug = slug; ELEVES.length = 0; eleves.forEach(n => ELEVES.push(n)); dr_initiales(); }
  const ed = cl.ed || {};
  return { slug: slug || '', nom: cl.nom || slug || '', eleves: ELEVES, ed, espaceED: ed.espace != null ? ed.espace : null, lienED: ed.lien || '', prochaines: (typeof edtProchainesDe === 'function' && slug) ? (edtProchainesDe(slug, 3) || []) : [] };
}
/* ── la taxonomie du site (CH.taxo, chargée par chChargerTaxo), lue sous la forme de la maquette {id, prof, eleve, familles[{…, notions[]}]} ── */
function dr_taxo(){
  const t = (typeof CH !== 'undefined' && CH && CH.taxo) || null; if (!t) { if (typeof chChargerTaxo === 'function' && !DR_MEM.taxoDemande) { DR_MEM.taxoDemande = true; chChargerTaxo(() => { if (dr_actif()) dr_tout(); }); } return []; }
  if (DR_MEM.taxoSrc === t && DR_MEM.taxo) return DR_MEM.taxo;
  const lib = (o, k) => o[k] || o['libelle' + k.charAt(0).toUpperCase() + k.slice(1)] || '';
  DR_MEM.taxoSrc = t; DR_MEM.taxo = (t.domaines || []).map(d => ({ id: d.id, prof: lib(d, 'prof'), eleve: lib(d, 'eleve'), familles: (d.familles || []).map(f => ({ id: f.id, prof: lib(f, 'prof'), eleve: lib(f, 'eleve'), notions: (f.notions || []).filter(n => n && n.actif !== false).map(n => ({ id: n.id, prof: lib(n, 'prof'), eleve: lib(n, 'eleve') })) })) }));
  return DR_MEM.taxo;
}
/* ── l'heure : la maquette lisait HEURES_SIM[h] = {jour, debut, fin, base} ; ici l'heure de cours réelle (AT_DR_COURS, E2)
   ou, en préparation, l'heure qu'il est. Les heures passées viendront des paquets H (E2). ── */
function dr_heureEstJouee(h){ try { return !!((S.closes && S.closes[h]) || (dr_heureDe(h) || {}).jouee); } catch (e) { return false; } }   /* E1 (E4, 03:30) : une heure close dans la page est « jouée » dès la clôture — la copie de la séance en page n'a pas encore son paquet (le hub l'a) */
function dr_heureAVenir(h){ /* E1 (réveils n°12-14, contrat §12.18 ; E4 lignes 161, 172, 177) : une seule suite, celle de l'EDT — l'heure n de l'atelier est l'heure n de la classe
     telle que `dr_heuresDeLaClasse` d'E2 la donne (jouée : sa date ; à venir : sa case, numérotée comme « Lancer ») ; l'heure ouverte en classe garde le créneau du cours */
  try { const ouverte = S.lancee && !S.close ? S.heure : 0; if (ouverte && h === ouverte) return null; if (typeof dr_heuresDeLaClasse !== 'function') return null;
    const slug = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && AT_DR_COURS.classeSlug) || (typeof dr_classeProposee === 'function' ? dr_classeProposee() : null); if (!slug) return null;
    const cle = slug + '|' + h + '|' + (ATVUES && ATVUES.snum) + '|' + (typeof EDT !== 'undefined' && EDT.charge ? 1 : 0); const M = DR_MEM.heuresAVenir = DR_MEM.heuresAVenir || {}; if (M[cle] && Date.now() - M[cle].t < 30000) return M[cle].v;
    const L = dr_heuresDeLaClasse(slug) || []; const x = L.find(e => +e.n === h && e.jouee) || L.find(e => +e.n === h); if (!x || !x.iso || !x.creneau) return null;
    const [debut, fin] = String(x.creneau).split('-'); const [y, mo, d] = x.iso.split('-').map(Number); const [hh, mm] = debut.split(':').map(Number); const [fh, fm] = fin.split(':').map(Number); const dt = new Date(y, mo - 1, d, hh || 0, mm || 0);
    const v = { jour: dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), debut, fin, base: dt.getTime(), utiles: Math.max(0, ((fh * 60 + fm) - (hh * 60 + mm)) - 5), aVenir: !x.jouee, jouee: !!x.jouee, sur: x.sur }; M[cle] = { t: Date.now(), v }; return v; } catch (e) { return null; } }
function dr_heureDe(h){ { const av = h != null ? dr_heureAVenir(h) : null; if (av) return av; }
  const c = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) || null; const d = new Date(); const p = n => (n < 10 ? '0' : '') + n;
  const debut = (c && c.debut) || (p(d.getHours()) + ':' + p(d.getMinutes())); const fin = (c && c.fin) || (() => { const x = new Date(d.getTime() + 55 * 60000); return p(x.getHours()) + ':' + p(x.getMinutes()); })();
  const [hh, mm] = debut.split(':').map(Number); const base = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh || 0, mm || 0).getTime();
  const [fh, fm] = fin.split(':').map(Number); const utiles = Math.max(0, ((fh * 60 + fm) - (hh * 60 + mm)) - 5);
  return { jour: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), debut, fin, base, utiles };
}
function now(){ return Date.now(); }   /* E1 : l'horloge réelle (la maquette : HEURES_SIM[S.heure].base + DECALAGE) */

/* ── le transport : lecture par secuLire, écriture par mjpcPutJson (chemin sans FIREBASE_BASE, sans .json) ── */
function dr_lire(chemin, cb){ if (typeof secuLire !== 'function') { cb && cb(null); return; } secuLire(chemin).then(v => cb && cb(v)); }
function dr_ecrire(chemin, valeur, libelle, cb){ if (typeof S !== 'undefined' && S.repetition) return; if (typeof mjpcPutJson !== 'function') return; mjpcPutJson(FIREBASE_BASE + chemin + '.json', valeur, libelle || 'Déroulé', () => { dr_temoinHub(); if (cb) cb(); }); }
/* E1 (réveil n°3, 3) : le déroulé écrit souvent (la classe toutes les 900 ms) — le bandeau « Enregistré à … » du site, posé à chaque écriture acceptée, couvrait les pastilles et ne disparaissait plus. Pour les écritures du déroulé, il se referme dans la même tâche (il n'est jamais peint) ; le témoin est une ligne discrète de l'entête (#dr-enr). Un échec garde le bandeau du site. */
function dr_temoinHub(){ const bd = document.querySelector('.mjpc-bandeau-ok'); if (bd && !(typeof MJPC_ECHECS !== 'undefined' && MJPC_ECHECS.liste && MJPC_ECHECS.liste.length)) bd.style.display = 'none'; const t = document.getElementById('dr-enr'); if (dr_temoinTest()) return; if (t) { const d = new Date(now()); t.textContent = 'Enregistré à ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); t.title = t.textContent + ' — la dernière écriture acceptée par le hub'; } }
function dr_temoinTest(){ /* E1 (relecture continue E4, 13:35) : en mode test du site, rien ne part au hub — le témoin le dit, en pastille, au lieu d'« Enregistré à … » */ const t = document.getElementById('dr-enr'); const test = typeof m8TestOn === 'function' && m8TestOn(); if (t) { t.classList.toggle('dr-test', test); if (test) { t.textContent = 'mode test — rien n\'est enregistré'; t.title = 'Le mode test du site est actif : aucune écriture ne part au hub.'; } else if (t.classList.contains('dr-test-vu')) { t.textContent = ''; t.title = ''; } t.classList.toggle('dr-test-vu', test); } return test; }
setInterval(() => { try { dr_temoinTest(); } catch (e) {} }, 1500);
function dr_cheminBDe(sk){ const x = dr_ctx(); return '/site/' + x.level + '/chapitres/' + x.chnum + '/seances/' + sk; }
function dr_cheminB(){ return dr_cheminBDe(dr_ctx().snum); }
function dr_cheminC(){ const x = dr_ctx(); return dr_cheminB() + '/deroule_joue/' + x.classeSlug; }
function dr_cheminH(){ const c = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) || null; if (!c || typeof _drCleHeureDe !== 'function') return null; return dr_cheminC() + '/heures/' + _drCleHeureDe(c); }

/* ── les onglets et la navigation du socle ── */
function dr_onglet(v){ if (!dr_actif()) return; if (v === 'atelier' && typeof S !== 'undefined' && S.repetition) { arreterRepetition(); return; } voir(v); }
function dr_aller(i){ if (typeof S === 'undefined') return; if (S.lancee && !S.atelier) aller(i); else { S.di = i; S.page = null; dr_tout(); } }   /* dr_tout : le tout() de la maquette, préfixé (contrat §7) */
/* ── « ▶ Lancer l'heure » ([data-lancer="1"], contrat §7) : E2 le rebranche sur dr_lancer (la classe, le créneau, la copie jouée, cours_actif).
   En attendant E2 : le lancement de la maquette (l'EDT simulé, heure 1), en mémoire — rien ne s'écrit. ── */
function dr_lancerClic(){
  if (typeof dr_lancer === 'function') { dr_lancer(); return; }
  if (S.lancee || S.repetition) return;
  S.heure = 1; S.lancee = true; S.ordres = S.ordres || {}; S.ordres[1] = ordreHeureCalc(1); S.ordresEid = S.ordresEid || {}; S.ordresEid[1] = S.ordres[1].map(eidDe); S.ecoule = 0; journal('lancement', { heure: 1 });
  const hd = dr_heureDe(1); $('hou').textContent = hd.jour + ' ' + hd.debut + '-' + hd.fin + ' · heure 1 · ' + seance().titre; voir('pilotage');
}
(function(){ const b = document.getElementById('dr-lancer'); if (b) b.onclick = dr_lancerClic; })();
/* ── les boîtes du site (atModaleChoix) à la place de celles du navigateur (cadrage n°7, T1 : « les confirm() natifs → modales MJPC ») ── */
/* E1 (R21) les images vivent dans mjpc-medias ; la trame garde l'adresse complète, Paul ne voit et ne tape que la relative (3.2) */
const DR_MEDIAS = 'https://siteflow-io.github.io/mjpc-medias/';
function dr_refRelative(ref){ return String(ref || '').replace(DR_MEDIAS, ''); }
/* E1 (relecteur neuf n°2) : les objets manquants déclarés vivent dans leur diapo (e.manques), donc au hub avec la trame */
function dr_manques(){ const E = (typeof seance === 'function' && seance()) ? seance().ecrans : []; const out = []; E.forEach((e, di) => (Array.isArray(e && e.manques) ? e.manques : []).forEach(m => out.push({ si: S.si, di, texte: m.texte, t: m.t }))); return out; }
function dr_dire(msg){ if (typeof atModaleChoix !== 'function') { try { console.warn(msg); } catch (e) {} return; } atModaleChoix(dr_esc(msg), [{ lib: 'Compris', prim: true }]); }
function dr_confirmer(msg, oui, libOui){ if (typeof atModaleChoix !== 'function') { if (window.confirm(msg)) oui(); return; } atModaleChoix(dr_esc(msg), [{ lib: 'Annuler' }, { lib: dr_esc(libOui || 'Oui'), prim: true, danger: /suppr/i.test(libOui || ''), fn: oui }]); }
function dr_saisir(question, defaut, cb, libOk){
  if (typeof atModaleChoix !== 'function') { const v = window.prompt(question, defaut || ''); if (v) cb(v); return; }
  atModaleChoix('<label class="dr-saisie-l">' + dr_esc(question) + '<br><input id="dr-saisie" class="dr-saisie" type="text" value="' + dr_esc(defaut || '') + '" style="width:100%;margin-top:6px"></label>', [{ lib: 'Annuler' }, { lib: dr_esc(libOk || 'Valider'), prim: true, fn: () => { const i = document.getElementById('dr-saisie'); const v = i ? i.value.trim() : ''; if (v) cb(v); } }]);
  setTimeout(() => { const i = document.getElementById('dr-saisie'); if (!i) return; i.focus(); i.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Enter') { ev.preventDefault(); const p = document.querySelector('#at-modale .at-btn-prim'); if (p) p.click(); } else if (ev.key === 'Escape') { const m = document.querySelector('#at-modale'); /* la modale du site, lue, pas déclarée */ if (m) m.remove(); } }; }, 0);
}
/* la barre du site suit la vue de la maquette (voir() est appelée aussi par la répétition, la clôture…) */
function dr_suivreBarre(v){ const lb = document.getElementById('dr-lancer'); if (lb) lb.classList.toggle('dr-cache', !!(S.lancee || S.repetition)); if (typeof ATVUES !== 'undefined') { ATVUES.vue = v; if (typeof atVuesRetenir === 'function') atVuesRetenir(); } if (typeof atVuesMarquer === 'function') atVuesMarquer(v); }
/* la séance de la colonne devient celle du déroulé (ATVUES.snum ↔ S.si) */
function dr_suivreSeance(){ const k = (typeof ATVUES !== 'undefined' && ATVUES.snum != null) ? String(ATVUES.snum) : dr_cleSeance(0); const si = dr_rangSeance(k); if (S.si !== si) { S.si = si; S.di = 0; S.page = null; if (typeof reindexer === 'function') reindexer(); } dr_frontiereHorsClasse(); }
function dr_frontiereHorsClasse(){ /* E1 (réveil n°10 ; C1 6.1) : la frontière d'heure portée par la trame vaut hors classe aussi — la trame réelle met ses écrans à l'heure 1 (§12.5) ; hors classe, le socle la pose par le calcul d'E2 (par les durées, le temps utile du créneau proposé), comme le lancement : l'atelier et le Pilotage montrent les heures que la classe jouera. Une frontière déjà posée (par Paul ou une heure jouée) n'est jamais refaite. Elle entre dans la trame à la prochaine modification de Paul */
  try { if (typeof S === 'undefined' || (S.lancee && !S.close) || S.repetition || typeof dr_partagerHeures !== 'function') return 0; let utile = 0; try { const p = typeof dr_proposer === 'function' ? dr_proposer() : null; if (p && p.creneau && typeof dr_utileCreneau === 'function') utile = dr_utileCreneau(p.creneau); } catch (e) {} if (typeof dr_edtAssurer === 'function') dr_edtAssurer(); return dr_partagerHeures(utile || 50); } catch (e) { return 0; } }   /* l'EDT chargé : les heures à venir prennent leur date */
/* le premier montage : la classe, la taxonomie, le rendu */
/* ── E1 (réveil n°8 ; contrat §12.8) LA COPIE JOUÉE D'UN AUTRE JOUR — à une nouvelle heure de la même séance avec la même classe, ce que la
   classe a modifié en classe reste, ce que Paul a préparé depuis entre ; une séance close pour la classe repart de la trame (LOT A ④).
   · dr_copieReporter(h) : au lancement de l'heure h, les retouches faites en classe aux heures d'avant (S.copie[k], k < h) passent dans les
     écrans de la copie — elles restent dans S.copie[k] pour le récit de l'heure k ; le chemin « heure suivante » d'E2 les montre ainsi ;
   · dr_jouerCopie(copie) : au premier lancement (`dr_lancerNeuf` d'E2), la copie d'avant fusionnée par eid avec la trame (`dr_fusionCopie`
     d'E2), retouches comprises ; `atDrJouer` (E2) réécrivant la copie avec la trame, l'enveloppe ci-dessous en garde l'image juste avant. ── */
let DR_COPIE_AVANT = null;
function dr_cuireCopie(ecrans, copie, avant){ let n = 0; Object.keys(copie || {}).map(Number).filter(k => k < avant).sort((a, b) => a - b).forEach(k => { const H = copie[k] || {}; Object.keys(H).forEach(eid => { const e = (ecrans || []).find(x => x && x.eid === eid); if (!e) return; Object.keys(H[eid] || {}).forEach(bid => { const b = (e.blocs || []).find(x => x && (x.bid || x.id) === bid); const cb = H[eid][bid]; if (!b || !cb) return; if (cb.t != null && b.txt !== cb.t) { b.txt = cb.t; n++; } Object.keys(cb.el || {}).forEach(ei => { b.el = Array.isArray(b.el) ? b.el : []; if (b.el[+ei] !== cb.el[ei]) { b.el[+ei] = cb.el[ei]; n++; } }); }); }); }); return n; }
function dr_copieReporter(h){ try { if (!S.copie || !S.lancee) return 0; const n = dr_cuireCopie(seance().ecrans, S.copie, h); if (n) { if (typeof dr_copieAuto === 'function') dr_copieAuto(true); dr_tout(); } return n; } catch (e) { return 0; } }
function dr_copieMemoire(classeSlug){ try { const ec = AT.edChap, sk = ATVUES.snum; const sce = chapitresData[ec.level][ec.chnum].seances[sk]; const c = sce && sce.deroule_joue && sce.deroule_joue[classeSlug]; return c ? { sk: String(sk), classeSlug, c: JSON.parse(JSON.stringify(c)) } : null; } catch (e) { return null; } }
function dr_envelopperJouer(){ if (typeof atDrJouer !== 'function' || atDrJouer._dr) return; const j0 = atDrJouer; atDrJouer = function(classeSlug){ DR_COPIE_AVANT = dr_copieMemoire(classeSlug); return j0.apply(this, arguments); }; atDrJouer._dr = true; }
function dr_jouerCopie(copie){ try {
  let n = copie && !Array.isArray(copie) && typeof copie === 'object' && copie.ecrans ? copie : null;
  if (!n && DR_COPIE_AVANT && typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && DR_COPIE_AVANT.classeSlug === AT_DR_COURS.classeSlug && DR_COPIE_AVANT.sk === String(ATVUES.snum)) n = DR_COPIE_AVANT.c;
  DR_COPIE_AVANT = null; if (!n) return null;
  const dh = x => (typeof dr_duHub === 'function' ? dr_duHub(x) : x); const liste = x => (Array.isArray(x) ? x : (x && typeof x === 'object' ? Object.values(x) : []));
  const vieux = liste(n.ecrans).filter(Boolean).map(dh); const Jv = liste(n.journal).filter(Boolean).map(dh); if (!vieux.length || !Jv.some(x => x.type === 'diapo')) return null;   /* jamais jouée : la trame telle quelle */
  const E = seance().ecrans; const vus = new Set(Jv.filter(x => x.type === 'diapo').map(x => x.eid)); const derniere = liste(n.heures).some(x => x && x.clos && +x.sur > 0 && +x.heure >= +x.sur); const toutVu = vieux.filter(e => e.role !== 'fin' && e.eid).every(e => vus.has(e.eid)); if (derniere || toutVu) return null;   /* la séance close pour la classe (sa dernière heure, « n sur n », close ; ou toutes ses diapos montrées) : elle repart de la trame (LOT A ④) — la trame réelle met tous ses écrans à l'heure 1 (§12.5), le nombre d'heures ne s'y lit pas */
  const Sv = n.etat && n.etat.S ? dh(n.etat.S) : {}; const cuit = JSON.parse(JSON.stringify(vieux)); dr_cuireCopie(cuit, Sv.copie || {}, Infinity);
  const f = typeof dr_fusionCopie === 'function' ? dr_fusionCopie(E.slice(), cuit, Jv) : cuit; E.splice(0, E.length, ...f); try { reindexer(); } catch (e) {} return f;
} catch (e) { DR_COPIE_AVANT = null; return null; } }
function dr_demarrer(){ dr_envelopperJouer(); dr_toutLire(); dr_classe(); dr_taxo(); dr_suivreSeance(); const hc = document.getElementById('hclasse'); if (hc) hc.textContent = dr_classe().nom; const ho = document.getElementById('hou'); if (ho && !S.lancee) ho.textContent = 'aucune heure lancée'; DR_MEM.demarre = true; }

/* ── la surface d'inspection (lecture seule) pour les contrôles de la conscience ── */
window.dr = { get S(){ return S; }, get J(){ return J; }, ctx: () => dr_ctx(), trame: () => dr_trame(), chapitre: () => dr_chapitre(), classe: () => dr_classe(), notes: () => dr_notes() };

/* ── ce que la maquette calculait au chargement depuis ELEVES (l. 775) : les initiales, recalculées à chaque classe ── */
const ELEVES = [];   /* E1 : la maquette avait ELEVES en dur (29 noms) ; rempli par dr_classe() depuis classesData */

/* ── les huit noms de la maquette sont préfixés dr_ (contrat §7). Ils n'étaient pas en collision avec le site (audit E1, F2) ;
   des modules écrits sur la maquette les appellent encore (E4 : esc, tout, presents ; E2 : tout) : alias de transition,
   sans collision (collisions.mjs à 0), à retirer quand chaque module écrit dr_esc, dr_tout… ── */
function esc(s){ return dr_esc(s); }
function tout(){ return dr_tout(); }
function presents(...a){ return dr_presents(...a); }
function prenom(...a){ return dr_prenom(...a); }
function candidats(...a){ return dr_candidats(...a); }

/* ═══════════ seconde partie : le code de la maquette p8-5g — le socle (l. 447-972, 1252-1322, 1450-1481, 1640-1643, 1813-1833) ═══════════ */

const $ = id => document.getElementById(id);
 /* (b) DECALAGE (coupure, simulation) compte enfin dans l'heure : il était ignoré depuis la v9c.7 */
const dr_esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CRANS = [26, 32, 38, 44, 52];
 /* la loi de taille de l'existant (moteur L547-553) : 32 pt = 5,6 % de la hauteur de la diapo ; 26 pt = le plancher lisible du fond (Paul, 15/09) */
const TAILLES = CRANS.map(pt => ({ l: pt + ' pt', pt }));

const policePx = (hauteurDiapo, pt) => hauteurDiapo * 0.056 * (pt / 32);

/* ═══ (p8-2) LES SCHÉMAS — LE MOTEUR DE L'ANCIEN DÉROULÉ, REPRIS À PART SOUS LE PRÉFIXE p8 ═══
   Source : AT_DR_B64 d'index.html de production (base c9bc2d9), décodé : schLignes, schemaHTML, carte, frise, arbre, cycle, grille,
   mesure, cle, separe, surface, dessine, SCH_COUL / COUL, et la préhension (tirSch, jalSch, repeintSch, le mousedown sur g.n / g.jal).
   Chaque écart avec l'ancien code est écrit dans la NOTE de p8-2, avec la ligne du tableau des télescopages qui le justifie (T1 à T7). */
var P8_SCH_COUL = ['#7b1113','#e8484c','#d64fd6','#4a1258','#6f4fd8','#2f6fe0','#25c8a5','#5bc236','#c99a4e','#8a7a5a'];

var P8_COUL = ["#7b1113","#e8484c","#d64fd6","#4a1258","#6f4fd8","#2f6fe0","#25c8a5","#5bc236","#c99a4e","#8a7a5a"];

var P8_POLICE = 'EB Garamond,Garamond,serif';

var P8_MEMO = {}, P8_MESURES = {};

function p8Lignes(b){ return String(b.src||'').split('\n').map(function(s){return s.replace(/\s+$/,'');}).filter(function(s){return s.trim();}); }

/* l'ancien schEch : la même réglette, lue sur le cran de « Texte au tableau » ; elle ne donne plus que la géométrie (rayons, écarts), jamais la police (T1) */
function p8Ech(pt){ var k=pt/32; return Math.max(0.6,Math.min(2.4, k*1.35)); }

function p8Cle(txt){ return 'k'+String(txt).replace(/[^a-zA-Z0-9À-ÿ]/g,'').slice(0,24); }

/* T4 : la boîte réelle du texte rendu (mesurée dans un SVG caché, même police), plus les marges de l'ancien mesure() */
function p8Mesure(txt,fs,poids,u,parts){
  var ps=parts||[{t:String(txt),fs:fs}], cle0=poids+'|'+ps.map(function(p){return p.fs.toFixed(2)+':'+p.t;}).join('|'), l=P8_MESURES[cle0];
  if(l===undefined){
    var d=document, NS='http://www.w3.org/2000/svg', sv=d.getElementById('p8-mesureur');
    if(!sv){ sv=d.createElementNS(NS,'svg'); sv.setAttribute('id','p8-mesureur'); sv.setAttribute('aria-hidden','true'); sv.setAttribute('style','position:fixed;left:-10000px;top:0;width:10px;height:10px;visibility:hidden;pointer-events:none'); d.body.appendChild(sv); }
    var t=d.createElementNS(NS,'text'); t.setAttribute('font-family',P8_POLICE); t.setAttribute('font-weight',poids);
    ps.forEach(function(p){ var s=d.createElementNS(NS,'tspan'); s.setAttribute('font-size',p.fs); s.textContent=p.t; t.appendChild(s); });
    sv.appendChild(t); l=t.getComputedTextLength(); sv.removeChild(t); P8_MESURES[cle0]=l;
  }
  var fsMax=Math.max.apply(null,ps.map(function(p){return p.fs;}));
  return {w:Math.max(52*u,l)+14*u, h:fsMax*2.1};
}

/* T5 : la place qu'une bulle a encore dans le cadre, dans une direction (une bulle placée à la main ne bouge pas) */
function p8Place(n,axe,sens,W,H,u){ if(n.fixe)return 0; if(axe==='x')return Math.max(0,sens>0?(W-n.w/2-4*u)-n.x:n.x-(n.w/2+4*u)); return Math.max(0,sens>0?(H-n.h/2-4*u)-n.y:n.y-(n.h/2+4*u)); }

/* T11 : le segment p → q passe-t-il derrière la boîte de la bulle n ? (découpage du segment par la boîte, Liang-Barsky) */
function p8SepCoupe(p,q,n){
  var t0=0,t1=1,dx=q[0]-p[0],dy=q[1]-p[1],P=[-dx,dx,-dy,dy],Q=[p[0]-(n.x-n.w/2),(n.x+n.w/2)-p[0],p[1]-(n.y-n.h/2),(n.y+n.h/2)-p[1]];
  for(var i=0;i<4;i++){ if(P[i]===0){ if(Q[i]<0)return false; continue; } var r=Q[i]/P[i]; if(P[i]<0){ if(r>t1)return false; if(r>t0)t0=r; } else { if(r<t0)return false; if(r<t1)t1=r; } }
  return t1-t0>1e-6;
}

function p8Separe(N,W,H,marge,u,liens){
  if(false)return N;    /* pendant qu'on tire, rien ne bouge tout seul */
  marge=marge||6*u;
  for(var pas=0;pas<600;pas++){
    var bouge=false;
    for(var a=0;a<N.length;a++)for(var b=a+1;b<N.length;b++){
      var A=N[a],B=N[b];
      var dx=B.x-A.x, dy=B.y-A.y;
      var ox=(A.w+B.w)/2+marge-Math.abs(dx), oy=(A.h+B.h)/2+marge-Math.abs(dy);
      if(ox>0&&oy>0){
        bouge=true;
        if(A.fixe&&B.fixe)continue;          /* deux boîtes fixées par Paul : on ne touche à rien */
        /* T5 : le cadre visible est une limite ; une poussée que le cadre bloque passe sur l'autre axe, s'il a la place */
        var sx=(dx>=0?1:-1), sy=(dy>=0?1:-1);
        var placeX=p8Place(A,'x',-sx,W,H,u)+p8Place(B,'x',sx,W,H,u), placeY=p8Place(A,'y',-sy,W,H,u)+p8Place(B,'y',sy,W,H,u);
        var surX=(ox<oy)?(placeX>=ox||placeY<oy):!(placeY>=oy||placeX<ox);
        if(surX){ var s=(dx>=0?1:-1)*ox/2;
          if(!A.fixe)A.x-=s; if(!B.fixe)B.x+=s;
          if(A.fixe&&!B.fixe)B.x+=s; if(B.fixe&&!A.fixe)A.x-=s;
        } else { var t=(dy>=0?1:-1)*oy/2;
          if(!A.fixe)A.y-=t; if(!B.fixe)B.y+=t;
          if(A.fixe&&!B.fixe)B.y+=t; if(B.fixe&&!A.fixe)A.y-=t;
        }
      }
    }
    /* T11 (C13, tour 18) : un trait qui passe derrière une bulle qui n'est pas à son bout est un contact, comme un chevauchement —
       la bulle en cause est poussée vers la place libre du cadre visible ; une bulle placée à la main ne l'est jamais (décision 7 : la mesure le dit) */
    (liens||[]).forEach(function(l){ var P=l.pts();
      N.forEach(function(n){ if(n===l.a||n===l.b||n.fixe)return;
        for(var i=0;i+1<P.length;i++){ if(!p8SepCoupe(P[i],P[i+1],n))continue;
          var dx=P[i+1][0]-P[i][0], dy=P[i+1][1]-P[i][1], lg=Math.hypot(dx,dy)||1, nx=-dy/lg, ny=dx/lg;
          var d=(n.x-P[i][0])*nx+(n.y-P[i][1])*ny, il=Math.abs(nx)*n.w/2+Math.abs(ny)*n.h/2+marge/2, sg=(d>=0?1:-1);
          var essais=[sg*(il-Math.abs(d)), -sg*(il+Math.abs(d))];
          for(var j=0;j<2;j++){ var tx=n.x+nx*essais[j], ty=n.y+ny*essais[j];
            if(tx>=n.w/2+4*u-0.5&&tx<=W-n.w/2-4*u+0.5&&ty>=n.h/2+4*u-0.5&&ty<=H-n.h/2-4*u+0.5){ n.x=tx; n.y=ty; bouge=true; break; } }
          break; } }); });
    N.forEach(function(n){ if(n.fixe)return;
      n.x=Math.max(n.w/2+4*u,Math.min(W-n.w/2-4*u,n.x));
      n.y=Math.max(n.h/2+4*u,Math.min(H-n.h/2-4*u,n.y)); });
    if(!bouge)break;
  }
  /* dernier recours, RÉPÉTÉ jusqu'à ce que plus rien ne se touche : on descend la plus basse —
     T5 : sans jamais sortir du cadre visible ; ce qui se touche encore, la mesure le dit (« trop dense ») */
  for(var tour=0;tour<80;tour++){
    var reste=false;
    for(var a2=0;a2<N.length;a2++)for(var b2=a2+1;b2<N.length;b2++){
      var A2=N[a2],B2=N[b2];
      if(A2.fixe&&B2.fixe)continue;
      var ox2=(A2.w+B2.w)/2+marge-Math.abs(B2.x-A2.x), oy2=(A2.h+B2.h)/2+marge-Math.abs(B2.y-A2.y);
      if(ox2>0&&oy2>0){ var c=(A2.y>=B2.y?A2:B2); if(c.fixe)c=(c===A2?B2:A2);
        if(!c.fixe){ var y2=Math.min(H-c.h/2-4*u, c.y+oy2+3*u); if(y2>c.y+0.5){ c.y=y2; reste=true; }
          else { /* T5 : le cadre l'arrête en bas — elle part sur le côté qui a de la place (jamais hors du cadre) */
            var o=(c===A2?B2:A2), sens=(c.x>=o.x?1:-1); if(p8Place(c,'x',sens,W,H,u)<1)sens=-sens;
            var x2=Math.max(c.w/2+4*u,Math.min(W-c.w/2-4*u,c.x+sens*(ox2+3*u))); if(Math.abs(x2-c.x)>0.5){ c.x=x2; reste=true; } } } }
    }
    if(!reste)break;
  }
  return N;
}

/* T2 : la place est calculée sur le schéma entier ; ce qui n'est pas encore dévoilé porte « p8-pas » (pâle au pilote, absent au tableau) */
function p8Cls(c,k){ if(k==null||k<0)return ''; return (k>=c.vu?' p8-pas':'')+(c.flash===k?' spot-on':''); }

function p8Dessine(n,c){
  var u=c.u, aide=c.atelier?'<title>Tire pour la placer ; elle gardera cette place. Si tu renommes la notion, elle reprendra une place calculée.</title>':'';
  var txt=n.parts ? n.parts.map(function(p){ return '<tspan font-size="'+p.fs.toFixed(2)+'"'+(p.b?' font-weight="700"':'')+'>'+dr_esc(p.t)+'</tspan>'; }).join('') : dr_esc(n.t);
  /* T2 : sous la bulle, un fond opaque — pâle au pilote, elle cache quand même les traits qui passent dessous */
  return '<g class="p8-n'+(n.fixe?' p8-bouge':'')+p8Cls(c,n.k)+'" data-k="'+p8Cle(n.t)+'">'+aide
    +'<rect class="p8-fond" x="'+(n.x-n.w/2).toFixed(2)+'" y="'+(n.y-n.h/2).toFixed(2)+'" width="'+n.w.toFixed(2)+'" height="'+n.h.toFixed(2)+'" rx="'+(n.h/3).toFixed(2)+'" fill="#fff" stroke="none"/>'
    +'<rect x="'+(n.x-n.w/2).toFixed(2)+'" y="'+(n.y-n.h/2).toFixed(2)+'" width="'+n.w.toFixed(2)+'" height="'+n.h.toFixed(2)+'" rx="'+(n.h/3).toFixed(2)+'" '
    +'fill="'+(n.clair?'#fff':n.c)+'" stroke="'+(n.noyau?'#b01414':n.c)+'" stroke-width="'+((n.noyau?3:1.6)*u).toFixed(2)+'"/>'
    +'<text x="'+n.x.toFixed(2)+'" y="'+(n.y+n.fs*0.36).toFixed(2)+'" text-anchor="middle" font-family="'+P8_POLICE+'" '
    +'font-size="'+n.fs.toFixed(2)+'" font-weight="'+(n.noyau?700:600)+'" fill="'+(n.clair?'#1c1c1c':'#fff')+'">'+txt+'</text></g>';
}

function p8Trait(x1,y1,x2,y2,coul,larg,opac,k,a,b,c){ return '<line class="p8-l'+p8Cls(c,k)+'" data-a="'+(a?p8Cle(a.t):'')+'" data-b="'+(b?p8Cle(b.t):'')+'" x1="'+x1.toFixed(2)+'" y1="'+y1.toFixed(2)+'" x2="'+x2.toFixed(2)+'" y2="'+y2.toFixed(2)+'" stroke="'+coul+'" stroke-width="'+larg.toFixed(2)+'" opacity="'+opac+'"/>'; }

function p8Svg(c,s){ return '<svg class="p8-svg" data-w="'+c.W+'" data-h="'+c.H+'" viewBox="0 0 '+c.W+' '+c.H+'" preserveAspectRatio="none">'+s+'</svg>'; }

function p8Carte(L,c){
  var fam=L.map(function(s){ var p=s.split(':');
    return {nom:(p[0]||'').trim(), membres:(p[1]||'').split(',').map(function(x){return x.trim();}).filter(Boolean)}; })
    .filter(function(f){return f.nom;});
  var e=c.e, u=c.u, W=1000,H=560,cx=W/2,cy=H/2;
  var R=Math.min(W,H)*(0.30+0.03*e), r2=Math.min(W,H)*(0.47+0.04*e);
  var fsT=c.fsT, fsF=c.fsT, fsM=c.fsN;   /* T1 : 32 pt le centre et les familles, 26 pt les notions (la loi de la maquette) */
  var tit=c.titre||'—';
  var N=[], liens=[], k=0;
  function pousse(txt,x,y,fs,col,clair,noyau,kk){
    var m=p8Mesure(txt,fs,noyau?700:600,u), p=(c.pos||{})[p8Cle(txt)];
    var n={t:txt,x:(p?p.x:x)*c.sx,y:(p?p.y:y)*c.sy,w:m.w,h:m.h,fs:fs,c:col,clair:clair,noyau:noyau,fixe:!!p,k:kk};
    N.push(n); return n;
  }
  var nc=pousse(tit,cx,cy,fsT,'#b01414',false,true,-1);
  fam.forEach(function(f,kf){
    var a=(-Math.PI/2)+(2*Math.PI*kf/fam.length), col=P8_SCH_COUL[kf%P8_COUL.length];
    var nf=pousse(f.nom, cx+Math.cos(a)*R, cy+Math.sin(a)*R, fsF, col, false, false, k++);
    liens.push({a:nc,b:nf,c:col,w:5});
    f.membres.forEach(function(m,j){
      var sp=Math.min(0.34,1.15/Math.max(1,f.membres.length));
      var a2=a+(j-(f.membres.length-1)/2)*sp;
      var nm=pousse(m, cx+Math.cos(a2)*r2, cy+Math.sin(a2)*r2, fsM, col, true, false, k++);
      liens.push({a:nf,b:nm,c:col,w:1.6});
    });
  });
  p8Separe(N,c.W,c.H,7*e*u,u,liens.map(function(l){ return {a:l.a,b:l.b,pts:function(){ return [[l.a.x,l.a.y],[l.b.x,l.b.y]]; }}; }));   /* T11 */
  var s='';
  liens.forEach(function(l){ s+=p8Trait(l.a.x,l.a.y,l.b.x,l.b.y,l.c,l.w*u,(l.w>3?1:.75),l.b.k,l.a,l.b,c); });
  N.forEach(function(n){ s+=p8Dessine(n,c); });
  return p8Svg(c,s);
}

function p8Frise(L,c){
  var e=c.e, u=c.u, W=c.W, H=c.H;
  var pts=L.map(function(s,i){ var p=s.split(':'); if(p.length<2)p=s.split('=');   /* T9 : la frise des feuilles écrit « date = événement » */
    return {d:parseInt((p[0]||'').replace(/\D/g,''),10), t:(p[1]||'').trim(), i:i}; })
    .filter(function(p){return !isNaN(p.d);});
  if(!pts.length)return '';        /* rien à montrer : jamais de consigne d'auteur au tableau */
  var min=Math.min.apply(null,pts.map(function(p){return p.d;})),
      max=Math.max.apply(null,pts.map(function(p){return p.d;}));
  var yL=H/2, N=[];
  pts.forEach(function(p,k){
    var x=(max===min)?W/2:(((p.d-min)/(max-min))*(W*0.86)+W*0.07);
    var alt=(k%2)?1:-1;
    var parts=[{t:String(p.d),fs:c.fsT,b:1},{t:' · '+p.t,fs:c.fsN}];   /* T1 : la date en 32 pt, l'événement en 26 pt */
    var m=p8Mesure(p.d+' · '+p.t,c.fsT,600,u,parts), pos=(c.pos||{})[p8Cle(p.d+p.t)];
    N.push({t:p.d+' · '+p.t, parts:parts, jalonX:x, x:pos?pos.x*c.sx:x, y:pos?pos.y*c.sy:yL+alt*(58*e*u+m.h/2),
            w:m.w, h:m.h, fs:c.fsT, c:P8_SCH_COUL[k%P8_COUL.length], clair:true, noyau:false, fixe:!!pos, cleFrise:p8Cle(p.d+p.t), k:p.i});
  });
  p8Separe(N,W,H,9*e*u,u,[{a:null,b:null,pts:function(){ return [[W*0.04,yL],[W*0.96,yL]]; }}].concat(N.map(function(n){ return {a:null,b:n,pts:function(){ return [[n.jalonX,yL],[n.x,n.y]]; }}; })));   /* T11 */
  var s='<line class="p8-l" data-a="" data-b="" x1="'+(W*0.04)+'" y1="'+yL+'" x2="'+(W*0.96)+'" y2="'+yL+'" stroke="#d9cdb4" stroke-width="'+(4*e*u).toFixed(2)+'"/>';
  N.forEach(function(n,k){
    s+=p8Trait(n.jalonX,yL,n.x,n.y,n.c,1.4*u,.6,n.k,null,n,c);
    s+='<g class="p8-jal'+p8Cls(c,n.k)+'" data-i="'+k+'" data-min="'+min+'" data-max="'+max+'" data-w="'+W+'">'+(c.atelier?'<title>Tire ce point pour changer sa date.</title>':'')
      +'<circle cx="'+n.jalonX+'" cy="'+yL+'" r="'+(13*e*u).toFixed(2)+'" fill="transparent"/>'
      +'<circle cx="'+n.jalonX+'" cy="'+yL+'" r="'+(7*e*u).toFixed(2)+'" fill="'+n.c+'" stroke="#fff" stroke-width="'+(2.5*e*u).toFixed(2)+'"/>'
      +'</g>';
  });
  N.forEach(function(n){ s+=p8Dessine(n,c); });
  return p8Svg(c,s);
}

/* ── ARBRE : profondeur déduite de l'indentation ── */
function p8Arbre(L,c){
  var e=c.e, u=c.u, W=1000,H=560, noeuds=L.map(function(s,k){ var d=(s.match(/^ */)||[''])[0].length/2; return {d:d,t:s.trim(),k:k}; });
  var parNiv={}; noeuds.forEach(function(n){ (parNiv[n.d]=parNiv[n.d]||[]).push(n); });
  var maxD=Math.max.apply(null,noeuds.map(function(n){return n.d;}));
  noeuds.forEach(function(n){
    var rang=parNiv[n.d].indexOf(n), tot=parNiv[n.d].length;
    n.fs=n.d?c.fsN:c.fsT; var m=p8Mesure(n.t,n.fs,n.d?600:700,u); n.w=m.w; n.h=m.h;   /* T1 : les nœuds de tête en 32 pt, les autres en 26 pt */
    var p=(c.pos||{})[p8Cle(n.t)];
    n.x=(p?p.x:(rang+1)/(tot+1)*W)*c.sx; n.y=(p?p.y:60+n.d*(H-110)/Math.max(1,maxD))*c.sy; n.fixe=!!p;
  });
  var liensA=[]; noeuds.forEach(function(n,k){ if(!n.d)return; for(var j=k-1;j>=0;j--){ if(noeuds[j].d===n.d-1){ var P=noeuds[j];   /* T11 */
    liensA.push({a:P,b:n,pts:function(){ var x0=P.x,y0=P.y+14*u,x3=n.x,y3=n.y-14*u,ym=(P.y+n.y)/2,o=[]; for(var i=0;i<=16;i++){ var t=i/16,v=1-t; o.push([v*v*v*x0+3*v*v*t*x0+3*v*t*t*x3+t*t*t*x3, v*v*v*y0+3*v*v*t*ym+3*v*t*t*ym+t*t*t*y3]); } return o; }}); break; } } });
  p8Separe(noeuds,c.W,c.H,7*e*u,u,liensA);
  var s='';
  noeuds.forEach(function(n,k){
    if(!n.d)return;
    for(var j=k-1;j>=0;j--){ if(noeuds[j].d===n.d-1){
      var P=noeuds[j];
      s+='<path class="p8-l'+p8Cls(c,n.k)+'" data-a="'+p8Cle(P.t)+'" data-b="'+p8Cle(n.t)+'" d="M'+P.x.toFixed(2)+' '+(P.y+14*u).toFixed(2)+' C'+P.x.toFixed(2)+' '+((P.y+n.y)/2).toFixed(2)+' '
        +n.x.toFixed(2)+' '+((P.y+n.y)/2).toFixed(2)+' '+n.x.toFixed(2)+' '+(n.y-14*u).toFixed(2)+'" fill="none" stroke="#c9b79a" stroke-width="'+(2*u).toFixed(2)+'"/>';
      break; } }
  });
  noeuds.forEach(function(n){ n.c=P8_SCH_COUL[n.d%P8_COUL.length]; n.clair=n.d>1; n.noyau=!n.d; s+=p8Dessine(n,c); });
  return p8Svg(c,s);
}

/* ── CYCLE : étapes réparties sur un cercle ── */
function p8Cycle(L,c){
  var e=c.e, u=c.u, W=1000,H=560,cx=W/2,cy=H/2,R=Math.min(W,H)*(0.30+0.035*e);
  var N=L.map(function(t,k){ var a=(-Math.PI/2)+2*Math.PI*k/L.length, fs=c.fsN, m=p8Mesure(t,fs,600,u), p=(c.pos||{})[p8Cle(t)];   /* T1 : les étapes en 26 pt */
    return {t:t,x:(p?p.x:cx+Math.cos(a)*R)*c.sx,y:(p?p.y:cy+Math.sin(a)*R)*c.sy,w:m.w,h:m.h,fs:fs,
            c:P8_SCH_COUL[k%P8_COUL.length],clair:false,noyau:false,fixe:!!p,k:k}; });
  p8Separe(N,c.W,c.H,9*e*u,u,N.map(function(n,k){ var m=N[(k+1)%N.length]; return {a:n,b:m,pts:function(){   /* T11 */
    var d=bord(m,n), f=bord(n,m), mx=(d.x+f.x)/2, my=(d.y+f.y)/2, vx=cx*c.sx-mx, vy=cy*c.sy-my, l=Math.hypot(vx,vy)||1, qx=mx-vx/l*26*e*u, qy=my-vy/l*26*e*u, o=[];
    for(var i=0;i<=16;i++){ var t=i/16,v=1-t; o.push([v*v*d.x+2*v*t*qx+t*t*f.x, v*v*d.y+2*v*t*qy+t*t*f.y]); } return o; }}; }));
  /* la flèche s'arrête AU BORD de la boîte visée : sa pointe n'est jamais recouverte */
  function bord(de,vers){
    var dx=de.x-vers.x, dy=de.y-vers.y, l=Math.hypot(dx,dy)||1; dx/=l; dy/=l;
    var tx=dx!==0 ? (vers.w/2+6*u)/Math.abs(dx) : 1e9;
    var ty=dy!==0 ? (vers.h/2+6*u)/Math.abs(dy) : 1e9;
    var t=Math.min(tx,ty);
    return {x:vers.x+dx*t, y:vers.y+dy*t};
  }
  var cxp=cx*c.sx, cyp=cy*c.sy;
  var s='<defs><marker id="p8-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="'+(5*e)
   +'" markerHeight="'+(5*e)+'" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#8a7a5a"/></marker></defs>';
  N.forEach(function(n,k){
    var m=N[(k+1)%N.length];
    var d=bord(m,n), f=bord(n,m);
    var mx=(d.x+f.x)/2, my=(d.y+f.y)/2;
    var vx=cxp-mx, vy=cyp-my, l=Math.hypot(vx,vy)||1;
    var qx=mx-vx/l*26*e*u, qy=my-vy/l*26*e*u;            /* légère courbure vers l'extérieur */
    var kk=((k+1)%N.length===0)?N.length-1:k+1;          /* T2 : la flèche paraît avec l'étape qu'elle atteint (la dernière referme le cycle) */
    s+='<path class="p8-l'+p8Cls(c,kk)+'" data-a="'+p8Cle(n.t)+'" data-b="'+p8Cle(m.t)+'" d="M'+d.x.toFixed(2)+' '+d.y.toFixed(2)+' Q'+qx.toFixed(2)+' '+qy.toFixed(2)+' '+f.x.toFixed(2)+' '+f.y.toFixed(2)+'" fill="none" stroke="'+n.c
      +'" stroke-width="'+(3*e*u).toFixed(2)+'" marker-end="url(#p8-fl)" opacity=".85"/>';
  });
  N.forEach(function(n){ s+=p8Dessine(n,c); });          /* les boîtes PAR-DESSUS les flèches */
  return p8Svg(c,s);
}

/* ── TABLEAU ── */
function p8Grille(L,c){
  if(!L.length)return '';
  var t='<table class="p8-grille"><tr class="p8-r'+p8Cls(c,0)+'">'+L[0].split('|').map(function(x){return '<th style="font-size:'+c.fsT.toFixed(2)+'px">'+dr_esc(x.trim())+'</th>';}).join('')+'</tr>';
  L.slice(1).forEach(function(l,i){ t+='<tr class="p8-r'+p8Cls(c,i+1)+'">'+l.split('|').map(function(x){return '<td style="font-size:'+c.fsN.toFixed(2)+'px">'+dr_esc(x.trim())+'</td>';}).join('')+'</tr>'; });
  return t+'</table>';
}

/* T3 : la source n'est jamais coupée au dévoilé (b.vues n'est pas repris) ; le dévoilement passe par le compteur de la maquette (c.vu) */
function p8SchemaHTML(b,c){
  var L=p8Lignes(b), t=b.forme||'carte';
  if(t==='carte')return p8Carte(L,c);
  if(t==='frise')return p8Frise(L,c);
  if(t==='arbre')return p8Arbre(L,c);
  if(t==='cycle')return p8Cycle(L,c);
  if(t==='tableau')return p8Grille(L,c);
  return ''; }

/* ce qui se dévoile, bulle par bulle, dans l'ordre de la source (l'ancien elems) : réglé « Un à un » seulement ; « Tout ensemble » (et sans réglage) : rien, il paraît d'un coup */
function p8Elements(b){
  if(b.devoilerTout!==false)return [];
  var L=p8Lignes(b);
  if((b.forme||'carte')==='carte'){ var out=[]; L.forEach(function(s){ var p=s.split(':'); out.push((p[0]||'').trim()); (p[1]||'').split(',').map(function(x){return x.trim();}).filter(Boolean).forEach(function(m){ out.push(m); }); }); return out; }
  return L.map(function(s){ return s.trim(); });
}

/* T1 : les tailles viennent de la loi de la maquette (policePx) — 32 pt les titres, 26 pt les éléments, jamais moins à aucun cran */
function p8Contexte(b,W,H,hDiapo,cran,vu,flash,atelier,titre){
  var kc=Math.max(1,cran/32), fsT=policePx(hDiapo,32*kc), fsN=policePx(hDiapo,26*kc), e=p8Ech(cran);
  return {W:W,H:H,sx:W/1000,sy:H/560,e:e,u:fsN/(13*e),fsT:fsT,fsN:fsN,pos:b.pos||{},titre:titre,vu:vu,flash:flash,atelier:!!atelier};
}

function p8Dessin(b,W,H,hDiapo,cran,vu,flash,atelier,titre){
  if(!W||!H)return '';
  var cle0=JSON.stringify([b.forme||'carte',b.src||'',b.pos||{},titre,W,H,hDiapo,cran,vu,flash,!!atelier]);
  if(P8_MEMO[cle0]!==undefined)return P8_MEMO[cle0];
  if(Object.keys(P8_MEMO).length>300)P8_MEMO={};
  var h=p8SchemaHTML(b,p8Contexte(b,W,H,hDiapo,cran,vu,flash,atelier,titre)); P8_MEMO[cle0]=h; return h;
}

/* le dessin se pose dans la place « plein » réellement disponible (T6 : le repère 1000 × 560 y est étiré) ; mesurée après le rendu, reposée par le morph — rien n'est reconstruit si rien n'a changé */
function p8Poser(mur,et){
  var e=dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di]; if(!e)return;
  mur._p8=mur._p8||{};
  mur.querySelectorAll('.p8-dessin').forEach(function(z){
    var bi=+z.dataset.p8, b=e.blocs[bi]; if(!b||b.t!=='schema')return;
    var W=z.clientWidth, H=z.clientHeight; if(!W||!H)return;
    mur._p8[e.eid+'|'+bi]={W:W,H:H};
    var h=p8Dessin(b,W,H,mur.clientHeight||616,TAILLES[et.taille].pt,+z.dataset.vu,z.dataset.fl===''?null:+z.dataset.fl,!!et.atelier,z.dataset.titre);
    if(z.dataset.wh!==W+'x'+H||z.innerHTML.length===0){ z.dataset.wh=W+'x'+H; }
    poserHtml(z,h);
  });
}

/* LA MESURE — une seule, pour les bancs et pour l'atelier (C13, tour 2 : les boîtes réelles, contre le cadre réellement visible) :
   les chevauchements (entre bulles, et avec les autres couches de la diapo), les bulles hors du cadre visible, les traits qui passent
   à travers un mot, les libellés sur deux lignes, les polices sous 26 pt. Ne compte que ce qui est affiché (au tableau, le non-dévoilé est absent). */
function p8MesureLisible(mur){
  var res={chevauchements:0,horsCadre:0,traits:0,deuxLignes:0,sousPlancher:0,total:0,blocs:{},details:[]};
  if(!mur)return res;
  var M=mur.getBoundingClientRect(); if(!M.height)return res;
  var ptDe=function(px){ return px/(M.height*0.056)*32; };
  var vu=function(el){ if(!el.getClientRects().length)return false; for(var x=el;x&&x!==mur;x=x.parentElement){ var cs=getComputedStyle(x); if(cs.display==='none'||cs.visibility==='hidden')return false; } return true; };
  var inter=function(a,b){ return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)); };
  mur.querySelectorAll('.p8-sch').forEach(function(sch){
    var z=sch.querySelector('.p8-dessin'); if(!z)return; var bi=sch.dataset.bloc;
    var r={chevauchements:0,horsCadre:0,traits:0,deuxLignes:0,sousPlancher:0,total:0,details:[]};
    var Z=z.getBoundingClientRect(), L0=Math.max(Z.left,M.left), T0=Math.max(Z.top,M.top), R0=Math.min(Z.right,M.right), B0=Math.min(Z.bottom,M.bottom);
    for(var x=z.parentElement;x&&x!==mur;x=x.parentElement){ var cs=getComputedStyle(x); if(cs.overflowX!=='visible'||cs.overflowY!=='visible'){ var q=x.getBoundingClientRect(); L0=Math.max(L0,q.left); T0=Math.max(T0,q.top); R0=Math.min(R0,q.right); B0=Math.min(B0,q.bottom); } }
    var V={left:L0,top:T0,right:R0,bottom:B0};
    var bulles=[].slice.call(z.querySelectorAll('g.p8-n')).filter(vu).map(function(g){ return {k:g.dataset.k,nom:g.querySelector('text').textContent.trim().slice(0,40),r:g.querySelector('rect').getBoundingClientRect(),tr:g.querySelector('text').getBoundingClientRect(),texte:g.querySelector('text')}; });
    var cases=[].slice.call(z.querySelectorAll('.p8-grille th, .p8-grille td')).filter(vu).map(function(td){ return {k:'',nom:td.textContent.trim().slice(0,40),r:td.getBoundingClientRect(),tr:td.getBoundingClientRect(),cel:td}; });
    for(var i=0;i<bulles.length;i++)for(var j=i+1;j<bulles.length;j++)if(inter(bulles[i].r,bulles[j].r)>1){ r.chevauchements++; r.details.push('chevauchement : '+bulles[i].nom+' × '+bulles[j].nom); }
    var couches=[].slice.call(mur.querySelectorAll('*')).filter(function(x){ return !z.contains(x)&&!x.contains(z)&&!(x.closest&&x.closest('.alertes-diapo, .bloc-barre'))&&[].some.call(x.childNodes,function(n){return n.nodeType===3&&n.textContent.trim();})&&vu(x); }).map(function(x){ return {nom:x.textContent.trim().slice(0,30),r:x.getBoundingClientRect()}; });
    var toutes=bulles.concat(cases);
    if(cases.length){ var tb=z.querySelector('.p8-grille'); if(tb&&vu(tb))toutes.push({nom:'le tableau',r:tb.getBoundingClientRect(),tr:tb.getBoundingClientRect()}); }
    toutes.forEach(function(b){ couches.forEach(function(k){ if(inter(b.r,k.r)>1){ r.chevauchements++; r.details.push('chevauchement avec la diapo : '+b.nom+' × '+k.nom); } });
      if(b.r.left<V.left-0.5||b.r.right>V.right+0.5||b.r.top<V.top-0.5||b.r.bottom>V.bottom+0.5){ r.horsCadre++; r.details.push('hors du cadre visible : '+b.nom); } });
    /* une bulle de tableau compte une fois de trop si on garde aussi la table entière : la table ne sert qu'aux couches et au cadre */
    if(cases.length){ r.horsCadre=Math.min(r.horsCadre,cases.filter(function(b){ return b.r.left<V.left-0.5||b.r.right>V.right+0.5||b.r.top<V.top-0.5||b.r.bottom>V.bottom+0.5; }).length||(r.horsCadre?1:0)); }
    [].slice.call(z.querySelectorAll('.p8-l')).filter(vu).forEach(function(l){
      var ctm=l.getScreenCTM(), lg=l.getTotalLength(); if(!ctm||!lg)return; var a=l.dataset.a, b2=l.dataset.b, vus={};
      for(var s=1;s<60;s++){ var P=l.getPointAtLength(lg*s/60), X=ctm.a*P.x+ctm.c*P.y+ctm.e, Y=ctm.b*P.x+ctm.d*P.y+ctm.f;
        bulles.forEach(function(bb){ if(bb.k===a||bb.k===b2||vus[bb.k])return; if(X>bb.tr.left+1&&X<bb.tr.right-1&&Y>bb.tr.top+1&&Y<bb.tr.bottom-1){ vus[bb.k]=1; r.traits++; r.details.push('trait à travers : '+bb.nom); } }); }
    });
    cases.forEach(function(cl){ var rg=document.createRange(); rg.selectNodeContents(cl.cel); var tops={}; [].forEach.call(rg.getClientRects(),function(q){ if(q.width>1)tops[Math.round(q.top)]=1; }); if(Object.keys(tops).length>1){ r.deuxLignes++; r.details.push('sur deux lignes : '+cl.nom); }
      var px=parseFloat(getComputedStyle(cl.cel).fontSize)*(M.height/(mur.offsetHeight||M.height)); if(ptDe(px)<25.9){ r.sousPlancher++; r.details.push('sous 26 pt : '+cl.nom+' ('+ptDe(px).toFixed(1)+' pt)'); } });
    bulles.forEach(function(bb){ var t=bb.texte, ctm=t.getScreenCTM(); var tailles=[].slice.call(t.querySelectorAll('tspan')).map(function(s){return +s.getAttribute('font-size');}); if(!tailles.length)tailles=[+t.getAttribute('font-size')];
      var mi=Math.min.apply(null,tailles)*(ctm?Math.hypot(ctm.a,ctm.b):1); if(ptDe(mi)<25.9){ r.sousPlancher++; r.details.push('sous 26 pt : '+bb.nom+' ('+ptDe(mi).toFixed(1)+' pt)'); }
      var rg=document.createRange(); rg.selectNodeContents(t); var tops={}; [].forEach.call(t.getClientRects(),function(q){ if(q.width>1)tops[Math.round(q.top)]=1; }); if(Object.keys(tops).length>1){ r.deuxLignes++; r.details.push('sur deux lignes : '+bb.nom); } });
    r.total=r.chevauchements+r.horsCadre+r.traits+r.deuxLignes+r.sousPlancher; r.bulles=bulles.length+cases.length;
    res.blocs[bi]=r; ['chevauchements','horsCadre','traits','deuxLignes','sousPlancher','total'].forEach(function(q){ res[q]+=r[q]; }); res.details=res.details.concat(r.details);
  });
  return res;
}

const MOTIFS = { 1: 'a participé', 2: 'a proposé une piste', 3: 'on y reviendra avec lui', participe: 'a participé', piste: 'a proposé une piste', revenir: 'on y reviendra avec lui', reponse: 'a répondu' };

const dr_prenom = e => e.split(' ').slice(1).join(' ');

/* repris du pont (_drPrenomsDeLaClasse) : « NOM Prénom » → initiales P+N, les doublons numérotés ; PRENOMS[ini] → prénom ; INI[nom] → initiales */
const PRENOMS = {}, INI = {};
 function dr_initiales(){ Object.keys(PRENOMS).forEach(k => delete PRENOMS[k]); Object.keys(INI).forEach(k => delete INI[k]); /* E1 : la maquette le calculait une fois sur ELEVES en dur */  const pris = {}; ELEVES.forEach(n => { const mots = n.trim().split(/\s+/); const pre = mots.length > 1 ? mots.slice(1).join(' ') : mots[0]; const fam = mots.length > 1 ? mots[0] : ''; let ini = ((pre[0] || '') + (fam[0] || pre[1] || '')).toUpperCase(); const base = ini; let k = 2; while (pris[ini]) ini = base + String(k++); pris[ini] = 1; PRENOMS[ini] = pre; INI[n] = ini; });  }

const iniDe = n => INI[n] || '';
 const nomDe = ini => ELEVES.find(n => INI[n] === ini) || null;

const MOTIFS_PART = [{ c: 'participe', l: 'a participé' }, { c: 'piste', l: 'a proposé une piste' }, { c: 'revenir', l: 'on y reviendra avec lui' }];
 /* moteur L1071 */
const prenomUnique = e => { const p = dr_prenom(e); const doublon = ELEVES.filter(x => x !== e && dr_prenom(x) === p).length; return doublon ? p + ' ' + e[0] + '.' : p; };

// ───────── l'état ─────────
const S = window.S = { si: 0, di: 0, heure: 1, taille: 1, page: null, pageManuelle: false, mode: null, gel: null, loupe: null, bandeau: '', ecoule: 0, vue: 1, blocActif: null,
  parts: [], cand: null, notesFil: [], comm: {}, appel: {}, decisions: {}, reserve: [], notionsImprevues: {}, travail: { terminer: [], preparer: [], apprendre: null, prevu: true, libre: '' }, echeance: null, motAbsents: '',
  cle: 'portable', tab: 'fenetre', doc: null, videoPos: {}, t5: false, close: false, versements: {}, mur: null, attente: null };

const parDiapo = {};
 const vuMax = {};
 const J = window.J = [];

const seance = () => dr_seances()/* E1 : lisait DATA.seances */[S.si];
 const ecran = () => seance().ecrans[S.di];
 const cle = () => K(S.di);

const etatDiapo = () => parDiapo[cle()] || (parDiapo[cle()] = { nDev: 0, lum: [], ecr: (typeof dr_ecrDeLaTrame === 'function' ? dr_ecrDeLaTrame() : [])/* E4 : R5, « à écrire » préparé dans l'atelier */, reps: {}, tailles: {}, textes: {}, fsBloc: {} });

const eleves = () => ELEVES;

const absentA = (e, t) => { const seg = S.appel[e] || []; let present = true; for (const s of seg) { if (s.t <= (t || now())) present = (s.type === 'arrive' || s.type === 'revenu') ? true : (s.type === 'absent' || s.type === 'parti') ? false : present; } return !present; };

const dr_presents = () => ELEVES.filter(e => !absentA(e)).length;

const nomPresent = e => !absentA(e);

const TZ = 'Europe/Paris';

const hhmm = t => new Date(t || now()).toLocaleTimeString('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });

const fmt = t => new Date(t).toLocaleTimeString('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit' });

const duree = ms => { const s = Math.round(ms / 1000); return s < 60 ? s + ' s' : Math.floor(s / 60) + ' min ' + String(s % 60).padStart(2, '0') + ' s'; };

const eidDe = i => { const e = seance().ecrans[i]; return e ? e.eid : null; };
 const indexDe = eid => seance().ecrans.findIndex(e => e.eid === eid);
 const K = i => S.si + '|' + (eidDe(i) != null ? eidDe(i) : i);
 /* (a0) toute clé d'état par diapo est si|eid, jamais si|rang */
const journal = (type, x) => { if (S.atelier || /^atelier/.test(type)) return; /* E1 (relecteur neuf 1 ; contrat §5 : rien ne se journalise dans l'atelier) — la maquette y gardait ses « atelier-* », qui partaient ensuite dans C/journal au lancement */ if (S.repetition && !/^repetition/.test(type)) return; /* (p6) rien n'est écrit en répétition */ if (type === 'lancement') { dr_horsHeureRendre(); setTimeout(() => dr_copieReporter(S.heure), 0); } if (!S.lancee && !S.repetition) return; /* E1 (relecture continue E4, 14:05) : hors heure lancée, rien n'entre au journal — parcourir la trame avant de lancer faisait des entrées « h:1 », une heure 1 fantôme dans la Relecture */ if (type === 'diapo' && S.recitRelu && S.recitRelu[S.heure]) { S.recitRelu[S.heure] = false; S.recitAChange = S.recitAChange || {}; S.recitAChange[S.heure] = true; } const o = Object.assign({ t: now(), h: S.heure, type, mur: S.mur ? { si: S.mur.si, di: S.mur.di, eid: S.mur.eid } : null }, x || {}); if (o.di != null && o.eid == null) o.eid = eidDe(o.di); J.push(o); };

function reindexer(){ /* (a0) après toute insertion ou réordonnancement de la trame : le rang de chaque objet se recalcule depuis son identifiant */ J.forEach(o => { if (o.eid != null) { const i = indexDe(o.eid); if (i >= 0) o.di = i; } if (o.mur && o.mur.eid != null) { const i = indexDe(o.mur.eid); if (i >= 0) o.mur.di = i; } }); if (S.ordres) Object.keys(S.ordres).forEach(h => { S.ordresEid = S.ordresEid || {}; if (S.ordresEid[h]) S.ordres[h] = S.ordresEid[h].map(indexDe).filter(i => i >= 0); }); if (S.gel && S.gel.eid != null) { const i = indexDe(S.gel.eid); if (i >= 0) S.gel.di = i; } if (S.mur && S.mur.eid != null) { const i = indexDe(S.mur.eid); if (i >= 0) S.mur.di = i; } if (S.eidCourant != null) { const i = indexDe(S.eidCourant); if (i >= 0) S.di = i; } (S.coupures || []).forEach(c => { if (c.eid != null) { const i = indexDe(c.eid); if (i >= 0) c.di = i; } }); }

const diapoAuMur = () => (S.mur ? S.mur.di : S.di);

const ecransDeLHeure = () => seance().ecrans.map((e, i) => ({ e, i })).filter(x => x.e.heure === S.heure && !decisionDe(x.e));

function ordreHeure(h){ if (S.ordres && S.ordres[h]) return S.ordres[h].slice(); /* l'ordre d'une heure est figé à son lancement (6.6) : une glissée faite mardi reste la diapo 4 de mardi */ return ordreHeureCalc(h); }

function ordreHeureCalc(h){ const o0 = ordreHeureCalc0(h); const E = seance().ecrans; const fins = o0.filter(i => E[i].role === 'fin'); return o0.filter(i => E[i].role !== 'fin').concat(fins); }
 /* (a) le rôle fin est toujours en dernier */
function ordreHeureCalc0(h){ const E = seance().ecrans; const idx = E.map((e, i) => i); const glisse = (e, i) => { if (e.role === 'fin') return false; const d = decisionDe(e); return d && e.heure < h && ['suivante', 'terminer', 'preparer'].includes(d.choix) && !finie(e, i); };
  const rit = e => e.role === 'reactivation' || (!e.role && h > 1 && typeof dr_estRituel === 'function' && dr_estRituel(e)); const bil = e => e.role === 'bilan' || (!e.role && /bilan/i.test(String(e.act || ''))); /* E1 (réveil n°12, E4 ligne 160 ; §12.16, C1 6.1) : la trame réelle ne porte pas de rôle — le rituel d'ouverture (« Où en sommes-nous ? », dr_estRituel d'E2) en tête de l'heure suivante, le bilan en dernier, hors classe comme en classe */
  const react = idx.filter(i => E[i].heure === h && rit(E[i])); const glissees = idx.filter(i => glisse(E[i], i)); const propres = idx.filter(i => E[i].heure === h && !rit(E[i]) && !bil(E[i])); const bilan = idx.filter(i => E[i].heure === h && !rit(E[i]) && bil(E[i]));
  return [...react, ...glissees, ...propres, ...bilan]; }

const glisseeDe = (e, h) => { h = h || S.heure; const d = decisionDe(e); return d && e.heure < h && ['suivante', 'terminer', 'preparer'].includes(d.choix) ? d : null; };

const actDe = e => (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(a => a.id === e.actId) || null;

const numDe = e => { const a = actDe(e); return a ? a.num : null; };

const cleDec = e => e.actId || e.eid;

const rangDe = (di, h) => { const o = ordreHeure(h || S.heure); const k = o.indexOf(di); return k >= 0 ? k + 1 : null; };
 /* Paul, 17/09 : un numéro de diapo affiché est son rang dans l'heure en cours ; l'index de la trame reste interne */
const libDiapo = (di, h) => { const r = rangDe(di, h); return r ? 'diapo ' + r : 'diapo hors de l\'heure (« ' + (seance().ecrans[di] || {}).act + ' »)'; };

const decisionDe = e => S.decisions[cleDec(e)];

const diaposDe = a => a.diapos.map(i => seance().ecrans[i]);

const finie = (e, i) => { if (S.faiteOral && e.actId && S.faiteOral[e.actId]) return true; /* faite à l'oral (7.2) : ses diapos comptent finies */ const n = elements(e).length; return n ? (vuMax[K(i)] || 0) >= n : (e.blocs[0] && e.blocs[0].t === 'video' ? (S.videoPos[e.eid] || 0) >= e.blocs[0].duree : !!vuMax[K(i)] || J.some(x => x.type === 'diapo' && x.si === S.si && x.di === i)); };

const retiree = e => { const d = decisionDe(e); return !!(d && d.moment === 'classe'); };

function elements(e){ const out = []; e.blocs.forEach((b, bi) => { if (b.t === 'image' && typeof dr_marquesElements === 'function') { dr_marquesElements(b).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: 'image' })); return; } /* E4 : R1, les marques une à une (dr-recyclage.js) */ if (b.t === 'cahier') { ['l\'échéance', 'le travail à faire', 'le contenu de la séance', 'qui a participé'].forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: 'cahier' })); return; } if (b.t === 'schema') { p8Elements(b).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: 'schema' })); return; } /* (p8-2) une bulle = un élément, dans l'ordre de la source ; « Tout ensemble » : aucun */ if (b.t === 'question') out.push({ b: bi, e: 'q', txt: b.txt || '', t: 'question', q: true }); /* (p8-3c) la question se dévoile à son tour, avant ses lignes */ (b.el || []).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: b.t })); }); return out; }

// ───────── mise à jour minimale : on ne reconstruit pas, on ajuste (le nœud qui a le focus n'est jamais touché ; les champs gardent leur valeur ; les défilements et les images restent) ─────────
function morph(a, b){
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) { a.replaceWith(b.cloneNode(true)); return; }
  if (a.nodeType === 3) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
  if (a.nodeType !== 1) return;
  const actif = document.activeElement; const estActif = !!(actif && a === actif && (actif.isContentEditable || /INPUT|TEXTAREA/.test(actif.tagName)));
  if (!estActif) for (const at of Array.from(a.attributes)) if (!b.hasAttribute(at.name)) a.removeAttribute(at.name); /* (p8-4) le texte où l'on écrit garde ses attributs (contenteditable) : un redessin ne le touche pas */
  for (const at of Array.from(b.attributes)) if (a.getAttribute(at.name) !== at.value) { if (at.name === 'class' && a.classList.contains('grand')) a.setAttribute('class', at.value + ' grand'); else a.setAttribute(at.name, at.value); }
  if (estActif) return; /* le champ où Paul écrit garde son contenu ; ses attributs (la classe « reformulée », le titre) suivent */
  if (/INPUT|TEXTAREA|SELECT/.test(a.tagName)) return;
  const ac = Array.from(a.childNodes), bc = Array.from(b.childNodes);
  for (let i = 0; i < bc.length; i++) { if (!ac[i]) a.appendChild(bc[i].cloneNode(true)); else morph(ac[i], bc[i]); }
  for (let i = bc.length; i < ac.length; i++) if (!ac[i].classList || !ac[i].classList.contains('ecran-sortie')) ac[i].remove();
}

function poserHtml(el, h){ const t = document.createElement(el.tagName); t.innerHTML = h; const ac = Array.from(el.childNodes).filter(x => !(x.classList && x.classList.contains('ecran-sortie'))), bc = Array.from(t.childNodes); for (let i = 0; i < bc.length; i++) { if (!ac[i]) el.appendChild(bc[i].cloneNode(true)); else morph(ac[i], bc[i]); } for (let i = bc.length; i < ac.length; i++) ac[i].remove(); }

// ───────── rendu (pilote et tableau) ─────────
function dejaVuAvant(di){ /* ce que la classe a vu de cette diapo dans une heure précédente */ let n = 0; for (let h = 1; h < S.heure; h++) n = Math.max(n, vuJ(h, di).fin); return n; }

function rendre(mur, et){ const et0 = et; /* (p8-5f) */ if (et && et.atelier && et.pilote) { et = Object.assign({}, et, { nDev: elements(dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di]).length }); } if (et && et.oral && !et.pilote) { mur.innerHTML = `<div class="oral-carte"><div class="t">Activité ${dr_esc(String(et.oral.num))} — ${dr_esc(et.oral.titre)}</div><div class="s">à l'oral</div></div>`; return; }
  const e = dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di]; if (e && e.forme && typeof e.forme === 'object') { const fo = e.forme; et = Object.assign({}, et, { surl: (fo.surl || []).concat(et.surl || []), coulTxt: (fo.coulTxt || []).concat(et.coulTxt || []), gras: (fo.gras || []).concat(et.gras || []), soul: (fo.soul || []).concat(et.soul || []) }); } /* E1 : la mise en forme de la trame (atelier), sous celle de l'heure */ const deja = et.deja || 0; const H = mur.clientHeight || 616; const fs = policePx(H, TAILLES[et.taille].pt); const reps = et.reps || {}; const tailles = et.tailles || {}; const fsB = Object.assign({}, et.fsBloc || {}); (e.blocs || []).forEach((b, bi) => { if (b.taille === 'petit') fsB[bi] = (fsB[bi] || 1) * 0.85; if (b.taille === 'grand') fsB[bi] = (fsB[bi] || 1) * 1.2; }); const tx = et.textes || {};
  const numA = numDe(e); const actLib = (numA ? 'Activité ' + numA + ' — ' : '') + e.act; let h = ''; const alertesDiapo = []; /* (p4a) les alertes de forme de la diapo : une bandelette en surimpression, elles ne prennent pas la place du contenu */
  const b0 = e.blocs[0];
  if (et.fichePage != null && e.blocs[et.fichePage] && e.blocs[et.fichePage].t === 'fiche') { const b = e.blocs[et.fichePage]; h += `<div class="f-tab${et.ficheEntre ? ' entre' : ''}"><div class="f-page"><div class="f-entete"><div class="f-metas"><span><span class="f-meta-l">Fiche</span>${dr_esc(b.tt || 'fiche notion')}</span><span><span class="f-meta-l">Chapitre</span>${dr_esc(dr_chapitreTitre()/* E1 : lisait DATA.chapitre */.split(' (')[0])}</span></div><div class="f-titre">${dr_esc(b.txt)}</div></div>${(b.el || []).map((x, i) => { const c = (i >= (et.ficheDev || 0) ? ' pas' : '') + ((et.ficheEcr || []).includes(i) ? ' aecrire' : ''); return i === 0 ? `<div class="f-ancrage${c}" data-fk="${i}">${x}</div>` : `<div class="f-bloc${c}" data-fk="${i}">${x}</div>`; }).join('')}${et.pilote && !et.atelier ? '<button class="dr-fiche-fermer" title="Refermer la fiche (Échap)">✕</button>' : ''}<div class="f-pied"><span>${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom)}</span><span>monsieurjaipascompris</span></div></div></div>`; }
  else if (b0 && b0.t === 'cahier' && et.cahier) { const f = et.cahier; const nd = (et.pilote && et.cahier.prepa) ? 4 : (et.nDev || 0); const cel = (k, inner) => (!et.pilote && k >= nd) ? '' : `<div class="cel${k >= nd ? ' pas' : ''}${et.flash === k ? ' spot-on' : ''}" data-k="${k}" data-p="0.c.${k}">${inner}</div>`;
    h += `<div class="corpsd ecran cahier${f.grand ? ' grand' : ''}" style="font-size:${fs.toFixed(2)}px"><span class="act">Cahier de textes — ${dr_esc(f.jour)}, ${dr_esc(f.de)} – ${dr_esc(f.a)}</span>` + `<div class="ed-agenda"><div class="ed-bandeau"><span class="ed-logo">MON ESPACE<br>ÉLÈVE</span><span class="ed-etab">Collège Saint-Joseph</span></div><div class="ed-corps"><div class="ed-titre">Cahier de textes <span class="ed-classe">(3 ${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom.replace(/^3E /, ''))})</span></div>`
      + cel(0, `<div class="ed-date">PRENEZ VOS AGENDAS — POUR ${dr_esc(f.date.replace(/, \d{2}:\d{2}$/, '')).toUpperCase()}</div>`) + (et.pilote ? `<button class="ed-agrandir" data-agrandir="1" title="${f.grand ? 'Réduit la carte : la date reprend sa taille' : 'Agrandit la carte du récit ou du travail : la date et le bandeau se réduisent, la carte prend la place — tout reste dans la diapo, le tableau fait pareil'}">${f.grand ? '⤡ réduire' : '⤢ agrandir'}</button>` : '')
      + `<div class="ed-onglets"><span class="${f.onglet === 'contenu' ? '' : 'on'}"${et.pilote ? ' data-onglet="travail" title="Montre le travail à faire"' : ''}>Travail à faire</span><span class="${f.onglet === 'contenu' ? 'on' : ''}${nd < 3 ? ' ed-voile' : ''}"${et.pilote && nd >= 3 ? ' data-onglet="contenu" title="Montre le contenu de la séance (le récit)"' : ''}>Contenus de séances</span></div>`
      + (f.onglet === 'contenu' && nd >= 3
          ? cel(2, `<div class="ed-carte">${et.pilote ? `<div class="rv"><span class="${f.version === 'moi' ? '' : 'on'}" data-rv="site" title="Le récit composé par le site — il se réécrit tout seul à chaque geste ; ta version reste gardée">composé par le site</span><span class="${f.version === 'moi' ? 'on' : ''}" data-rv="moi" title="Ta version : le récit devient modifiable ici, avec Ctrl+Z / Ctrl+Y ; chaque modification est une version gardée">ma version (modifier)</span><span class="rv-h">${f.version === 'moi' && f.suite ? `<button id="rv-reprendre" title="Colle la suite composée par le site à la fin de ta version, en un seul texte à corriger">Reprendre la suite dans ma version</button>` : ''}<button id="rv-undo" title="Revenir à la version précédente">↶</button><button id="rv-redo" title="Rétablir la version suivante">↷</button></span></div>` : ''}<div class="ed-matiere">FRANCAIS — contenu de la séance${f.version === 'moi' ? ' · ma version' : ''}</div><div class="ed-texte ed-recit"${et.pilote && f.version === 'moi' ? ' contenteditable="true" id="ed-recit-edit"' : ''} data-p="0.r">${f.recit || '<i>rien encore</i>'}</div></div>`)
          : cel(1, `<div class="ed-carte"><div class="ed-matiere">FRANCAIS</div>${f.deja ? `<div class="ed-deja">déjà donné pour cette date (${dr_esc(f.dejaQuand)}) : ${dr_esc(f.deja)}</div>` : ''}<div class="ed-texte"${et.pilote ? ' contenteditable="true" id="ed-edit" title="Écris ici : c\'est ce que les élèves voient, ce qui partira dans École Directe, le récit et l\'historique"' : ''} data-p="0.w">${f.travail ? dr_esc(f.travail).replace(/\n/g, '<br>') : (et.pilote ? '' : '<i>rien pour la prochaine fois</i>')}</div><div class="ed-donne">Donné le ${dr_esc(f.donne)} par M. MENEY P.</div></div>`))
      + `</div></div>` + cel(3, `<div class="ed-part"><span class="dr-g">${f.qui.length} élève${f.qui.length > 1 ? 's' : ''} sur ${f.total} ${f.qui.length > 1 ? 'ont' : 'a'} participé</span><span>${f.qui.length ? f.qui.map(o => dr_esc(o.p) + (o.n > 1 ? ' <i class="qn">×' + o.n + '</i>' : '')).join(' · ') : 'personne pour l\'instant'}</span><span class="m">${f.ecrit} réponse${f.ecrit > 1 ? 's' : ''} écrite${f.ecrit > 1 ? 's' : ''} · ${f.oral} prise${f.oral > 1 ? 's' : ''} de parole · ${f.total - f.qui.length ? 'il reste ' + (f.total - f.qui.length) + ' à passer' : 'tout le monde a participé'}</span></div>`) + `</div>`; }
  else if (et.doc) { h += `<span class="act">${dr_esc(actLib)}</span>` + docHtml(et.doc) + (et.pilote ? `<button class="doc-x" data-docx="1" title="Ferme le document : retour à la diapo (le journal note le départ)">✕ retour à la diapo</button>` : ''); }
  else if (b0 && b0.t === 'video') { h += `<span class="act">${dr_esc(actLib)}</span>` + videoHtml(b0, et); }
  else {
    const pleinImg = e.blocs.length === 1 && b0.t === 'image' && b0.support !== false; /* l'intention de l'ancien (.e.plein-img), que son CSS cassé n'appliquait pas : corrigé sur l'ordre de Paul (16/09) */ h += `<div class="corpsd ecran${pleinImg ? ' plein-img' : ''}" style="font-size:${fs.toFixed(2)}px"><span class="act">${dr_esc(actLib)}</span>`; let k = 0;
    e.blocs.forEach((b, bi) => { const cls = 'bloc' + (tailles[bi] ? ' t-' + tailles[bi] : '') + (b.t === 'image' ? ' img' + (e.blocs.length === 1 ? ' img-plein' : '') + (et.arrivee ? ' neuf-vu' : '') : ''); const st = fsB[bi] ? ` style="font-size:${fsB[bi]}em"` : ''; h += `<div class="${cls}" data-bi="${bi}"${st}>`;
      const titre = tx[bi + '.t'] != null ? tx[bi + '.t'] : b.txt; const marqBloc = ((et.ecr || []).includes('b' + bi) ? ' aecrire' : '') + (et.arrivee ? ' neuf-vu' : ''); const lumBloc = et.flash === 'b' + bi ? ' spot-on' : '';
      const TYPES = ['consigne', 'texte', 'question', 'fiche', 'schema', 'image', 'video', 'page', 'doc', 'cahier']; /* (p8-3c) le cahier de textes a son rendu */ if (!TYPES.includes(b.t)) { if (et.pilote || et.atelier) alertesDiapo.push(`<div class="obj-nonlisible" data-bloc="${bi}"><b>⚠ Objet non lisible — « ${dr_esc(b.t || '?')} » (bloc ${bi + 1})</b>Rien ne s'affiche à sa place en classe, jamais une page blanche. Déclare un objet manquant, ou remplace-le (3.1) ; le texte pour l'instance est dans « À régler ».</div>`); h += '</div>'; return; }
      if (b.t === 'fiche' && !b.feuille && !dr_ficheEnLigne(b)) { /* E1 : une fiche du site qui porte son texte (titre, définition, corps) s'affiche comme dans l'ancien moteur ; « À régler » dit toujours qu'elle n'est pas liée à une feuille (audit E1, F17) */ if (et.pilote || et.atelier) alertesDiapo.push(`<div class="obj-nonlisible" data-bloc="${bi}"><b>⚠ Fiche non liée — « ${dr_esc(b.txt || '')} » (bloc ${bi + 1})</b>Lie-la à une fiche d'une feuille du chapitre (clic droit → Lier à une fiche…), sinon le bloc ne s'affiche pas en classe (1.7).</div>`); h += '</div>'; return; }
      if (b.t === 'page') { const etp = b.contrat ? ((et.pageEtape || {})[bi] || 1) : null; h += `<div class="page-sup${marqBloc}${lumBloc}" data-bloc="${bi}"><div class="page-t" data-p="${bi}.t">${surligne(dr_esc(titre), bi + '.t', et)}</div><div class="page-v">${b.contrat ? `<div class="page-cadre">page HTML — ${dr_esc(b.src || '')} · <b>étape ${etp} / ${b.etapes || 1}</b></div><div class="page-etape">${dr_esc(b.src || 'la page')} — étape ${etp} : ${b.contrat ? 'ce que la page montre à cette étape (dans le site : la page elle-même, chargée dans la diapo)' : ''}</div>` : `page HTML — ${dr_esc(b.src || 'sans fichier')}${(et.pilote || et.atelier) ? ' · <b style="color:#b3261e">sans contrat de pilotage : jouée comme une image</b>' : ''}`}</div></div>`; h += '</div>'; return; }
      if (b.t === 'doc') { const d = (dr_documents()/* E1 : lisait DATA.documents */[String(S.si)] || []).find(x => x.id === b.doc); const proj = d ? (['pdf', 'image', 'html', 'docx'].includes(d.type)) : false; h += `<div class="doc-sup${marqBloc}${lumBloc}" data-bloc="${bi}" data-docbloc="${dr_esc(b.doc || '')}" title="${(et.pilote || et.atelier) ? 'Un clic ouvre le document au tableau (pages aux flèches, la croix pour revenir à la diapo)' : ''}"><span class="doc-ic">📄</span> <span class="doc-t" data-p="${bi}.t">${surligne(dr_esc(titre || (d ? d.titre : 'document')), bi + '.t', et)}</span>${d ? `<span class="doc-i"> · ${dr_esc(d.type)}${d.pages ? ' · ' + d.pages + ' pages' : d.etapes ? ' · ' + d.etapes + ' étapes' : ''}${(et.pilote || et.atelier) ? (proj ? ' · <b style="color:#1a7a3e">projetable</b>' : ' · <b style="color:#b3261e">non projetable tel quel : convertis-le en PDF</b>') : ''}</span>` : `<span class="doc-i" style="color:#b3261e"> · document introuvable dans la séance</span>`}</div>`; h += '</div>'; return; }
      if (b.t === 'consigne' || b.t === 'texte') { if (String(titre == null ? '' : titre).trim() || !(b.el || []).length) /* (p8-4) sans ligne de tête : ses lignes seules */ h += `<div class="cons${marqBloc}${lumBloc}" data-bloc="${bi}">${b.t === 'texte' ? '' : `<span class="pic">${dr_esc(b.pic || '•')}</span>`}<span class="txt" data-p="${bi}.t">${surligne(dr_esc(titre), bi + '.t', et)}</span></div>`;
        if (b.el && b.el.length) { h += '<ul class="etapes">'; b.el.forEach((x, ei) => { const c = [k >= et.nDev ? 'pas' : '', et.flash === k ? 'spot-on' : '', (et.ecr || []).includes(k) ? 'aecrire' : '', et.neuf === k ? 'neuf-vu' : ''].join(' '); const t2 = tx[bi + '.' + ei] != null ? tx[bi + '.' + ei] : x; h += `<li data-k="${k}" data-p="${bi}.${ei}" class="${c}${k < deja ? ' deja' : ''}">${surligne(dr_esc(t2), bi + '.' + ei, et)}</li>`; if (deja && k === deja - 1) h += `<li class="cahier">retrouve cette partie dans ton cahier</li>`; k++; }); h += '</ul>'; } }
      else if (b.t === 'question') { const kq = k; const qPas = kq >= et.nDev; /* (p8-3c) la question se dévoile à son tour ; ses lignes la suivent */ h += `<p class="q${marqBloc}${lumBloc}${qPas ? ' pas' : ''}${et.neuf === kq ? ' neuf-vu' : ''}" data-k="${kq}" data-p="${bi}.t" data-bloc="${bi}">${surligne(dr_esc(titre), bi + '.t', et)}</p>`; k++;
        if (b.el && b.el.length) { h += '<ul class="etapes">'; b.el.forEach((x, ei) => { const c = [k >= et.nDev ? 'pas' : '', et.flash === k ? 'spot-on' : '', (et.ecr || []).includes(k) ? 'aecrire' : '', et.neuf === k ? 'neuf-vu' : ''].join(' '); const t2 = tx[bi + '.' + ei] != null ? tx[bi + '.' + ei] : x; h += `<li data-k="${k}" data-p="${bi}.${ei}" class="${c}">${surligne(dr_esc(t2), bi + '.' + ei, et)}</li>`; k++; }); h += '</ul>'; }
        const rs = reps[bi] || []; rs.forEach((r, ri) => { if (!et.pilote && !r.r) return; /* la classe ne voit jamais une ligne vide */ if (!et.pilote && qPas) return; /* (p8-3c) ni la réponse d'une question pas encore dévoilée */ h += `<div class="rep${qPas ? ' pas' : ''}" data-r="${ri}" data-bi="${bi}"><span class="ini${r.refo ? ' refo' : ''}${r.i ? '' : ' vide'}"${et.pilote ? ` contenteditable="true" data-p="${bi}.i.${ri}" title="Les initiales (dans n'importe quel ordre) ou le début du prénom ; double-clic : reformulée"` : ''}>${dr_esc(r.i || '')}</span><span class="dit"${et.pilote ? ` contenteditable="true" data-p="${bi}.r.${ri}" title="La réponse, au tableau au fil de la frappe ; Entrée : la réponse suivante"` : ''}>${dr_esc(r.r)}</span></div>`; });
        if (et.pilote && (!rs.length || rs[rs.length - 1].validee)) { const ri = rs.length; h += `<div class="rep libre${qPas ? ' pas' : ''}" data-r="${ri}" data-bi="${bi}"><span class="ini vide" contenteditable="true" data-p="${bi}.i.${ri}" title="Les initiales (dans n'importe quel ordre) ou le début du prénom"></span><span class="dit" contenteditable="true" data-p="${bi}.r.${ri}" title="La réponse, au tableau au fil de la frappe ; Entrée : la réponse suivante"></span></div>`; } }
      else if (b.t === 'fiche') { h += `<div class="fiche${marqBloc}${lumBloc}" data-bloc="${bi}">${et.pilote && !et.atelier ? `<button class="dr-fiche-ouvrir" data-fo="${bi}" title="Ouvrir la fiche en page : ▶ la dévoile paragraphe par paragraphe ; ✍🏻 sur un paragraphe">⤢ Ouvrir la fiche</button>` : ''}<div class="tt">${dr_esc(b.tt || 'fiche')}</div><h3 data-p="${bi}.t">${surligne(dr_esc(titre), bi + '.t', et)}</h3>${(b.el || []).map((x, ei) => `<div class="${ei === 0 ? 'def' : 'corps'}" data-p="${bi}.${ei}">${surligne(tx[bi + '.' + ei] != null ? tx[bi + '.' + ei] : x, bi + '.' + ei, et)}</div>`).join('')}${typeof dr_rappelHtml === 'function' ? dr_rappelHtml(b, bi, et) : ''/* E4 : R2 */}</div>`; }
      else if (b.t === 'image') { h += `<div class="img-sup">${b.ref ? `<img src="${b.ref}" alt="" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'"><div class="img-vide" style="display:none">${et && (et.pilote || et.atelier) ? 'image absente de mjpc-medias · ' + dr_esc(dr_refRelative(b.ref)) : ''}</div>` : '<div class="img-vide"></div>'}${typeof dr_marquesHtml === 'function' ? dr_marquesHtml(b, bi, k, et) : ''/* E4 : R1 */}</div>${b.txt ? `<div class="img-lg" data-p="${bi}.t">${surligne(dr_esc(titre), bi + '.t', et)}</div>` : ''}`; if (typeof dr_marquesNb === 'function') k += dr_marquesNb(b); /* E4 : R1 */ }
      else if (b.t === 'schema') { /* (p8-2) le moteur de l'ancien déroulé ; la carte dit son titre au centre, une seule fois (décision 2) */ const k0 = k; const nS = p8Elements(b).length; const vu = nS ? Math.max(0, (et.nDev || 0) - k0) : Infinity; const fl = typeof et.flash === 'number' && et.flash >= k0 && et.flash < k0 + nS ? et.flash - k0 : null; const bx = (mur._p8 || {})[e.eid + '|' + bi] || {}; h += `<div class="sch p8-sch${marqBloc}${lumBloc}" data-bloc="${bi}">${(b.forme || 'carte') === 'carte' ? '' : `<div class="sch-t" data-p="${bi}.t">${dr_esc(titre)}</div>`}<div class="sch-dessin p8-dessin" data-p8="${bi}" data-vu="${vu}" data-fl="${fl == null ? '' : fl}" data-titre="${dr_esc(titre)}">${p8Dessin(b, bx.W, bx.H, H, TAILLES[et.taille].pt, vu, fl, !!et.atelier, titre)}</div></div>`; k += nS; }
      h += '</div>'; });
    if (et.pilote && et.ecrire && p8PeutEcrireSous(e)) h += p8ZoneEcrire(); /* (p8-4) sous le dernier bloc, on clique et on écrit */
    h += '</div>';
  }
  if (alertesDiapo.length) h += '<div class="alertes-diapo">' + alertesDiapo.join('') + '</div>';
  if (e.legende && !et.doc) h += `<div class="legsur">${Object.keys(e.legende).map(c => `<span class="${c}">${dr_esc(c)} = ${dr_esc(e.legende[c])}</span>`).join('')}</div>`;
  if (et.encart) h += `<div class="encart"><b>Pour ceux qui ont fini</b>${dr_esc(et.encart)}</div>`;
  if (et.qui) { const ont = et.qui; const N = et.quiTotal || ont.length; const reste = N - ont.length; h += `<div class="quiw on"><div class="quib"><div class="quit">${ont.length} élève${ont.length > 1 ? 's' : ''} sur ${N} ont participé</div><div class="quil">${ont.length ? ont.map(o => dr_esc(o.p) + (o.n > 1 ? ' <i class="qn">×' + o.n + '</i>' : '')).join(' · ') : 'personne pour l\'instant'}</div>${reste ? `<div class="quir">il reste ${reste} élève${reste > 1 ? 's' : ''} à passer</div>` : ''}</div></div>`; }
  if (!et.pilote && et.cahier) setTimeout(() => { const cd = mur.querySelector('.corpsd.cahier'); if (cd) cd.classList.toggle('grand', !!et.cahier.grand); const c = mur.querySelector('.ed-carte'); if (c) c.scrollTop = (et.cahier.scroll || 0) * Math.max(0, c.scrollHeight - c.clientHeight); }, 0);
  if (!et.pilote) h += `<span class="pt-cnx${et.coupure ? ' rouge' : ''}" style="position:absolute;right:1.2%;top:1.6%;width:1.2cqh;height:1.2cqh"></span>`;
  if (et.attente) h = `<div class="attente"><div class="dr-h">${dr_esc(et.attente.h)}</div><div class="dr-d">${dr_esc(et.attente.d)}</div><div class="dr-n">${dr_esc(et.attente.n)}</div><div class="dr-c">${dr_esc(et.attente.c)}</div></div>`;
  h += `<span class="page dr-page"></span><div class="bandeau ${et.bandeau ? 'on' : ''}">${dr_esc(et.bandeau || '')}</div>`;
  mur.style.fontSize = policePx(H, 32).toFixed(2) + 'px'; poserHtml(mur, h); mur.classList.toggle('avec-bandeau', !!et.bandeau);
  /* repris de l'ancien (moteur L1666-1670) : la légende d'une image et ses marques se calent sur la largeur de l'image, pas sur le corps */
  mur.querySelectorAll('.img-sup').forEach(sup => { const L = sup.getBoundingClientRect().width; if (!L) return; sup.querySelectorAll('.mk').forEach(m => { m.style.fontSize = (L * 0.042) + 'px'; }); const lg = sup.parentElement.querySelector('.img-lg'); if (lg) lg.style.fontSize = (L * 0.035) + 'px'; });
  if (et.sansPages) { const corps = mur.querySelector('.corpsd'); if (corps) { let px = parseFloat(corps.style.fontSize); while (corps.scrollHeight > corps.clientHeight + 2 && px > 8) { px -= 0.5; corps.style.fontSize = px.toFixed(2) + 'px'; } } } else if (et.pages) { const cP = mur.querySelector('.corpsd'); if (cP && et.policeRatio) cP.style.fontSize = (et.policeRatio * (mur.clientHeight || 616)).toFixed(2) + 'px'; if (cP && et.pagesP) { const cles = Array.from(cP.querySelectorAll('li, .rep')).map(p85fCle); et.pages = et.pagesP.map(p => p.map(c => cles.indexOf(c)).filter(i => i >= 0)); } appliquerPages(mur, et); } /* (p8-5f) les pages du pilote, à sa police rapportée à la hauteur du tableau */ else paginer(mur, et);
  p8Poser(mur, et); /* (p8-2) le schéma dans la place « plein » réellement disponible */
  if (et.pilote && typeof brancherFin === 'function') brancherFin();
  const corpsF = mur.querySelector('.corpsd'); if (corpsF && !corpsF.classList.contains('cahier')) { corpsF.scrollTop = 0; corpsF.classList.toggle('p85f-ancre', !corpsF.classList.contains('plein-img') && corpsF.scrollHeight > corpsF.clientHeight + 2); corpsF._p85fDeborde = corpsF.scrollHeight > corpsF.clientHeight + 2; } /* (p8-5f) jamais défilé : ancré en haut, coupé en bas */
  loupeSur(mur, et);
  if (et0 && et0 !== et) { et0.pages = et.pages; et0.page = et.page; et0.policeReduite = et.policeReduite; et0.policeRatio = et.policeRatio; } /* (p8-5f) les pages de l'atelier reviennent au pilote */
}

function dr_occurrence(li, r, txt){ /* E1 (relecture continue E4, B4 15:50) : quelle occurrence du texte Paul a sélectionnée (0 = la première) — la mise en forme garde la position, plus seulement le texte */ try { const av = document.createRange(); av.setStart(li, 0); av.setEnd(r.startContainer, r.startOffset); const debut = av.toString().length; const tout = li.textContent; let n = 0, i = tout.indexOf(txt); while (i >= 0 && i < debut) { n++; i = tout.indexOf(txt, i + 1); } return n; } catch (e) { return 0; } }
function dr_remplacerNieme(h, e2, n, f){ let i = -1; for (let k = 0; k <= (n || 0); k++) { i = h.indexOf(e2, i + 1); if (i < 0) return h; } return h.slice(0, i) + f(e2) + h.slice(i + e2.length); }
function surligne(htmlTexte, p, et){ (et.surl || []).filter(x => x.p === p).forEach(x => { const e2 = dr_esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = dr_remplacerNieme(htmlTexte, e2, x.n, e2 => `<mark style="background:${COULEURS[x.couleur] || '#fff1a8'}">${e2}</mark>`); }); /* (p8-5c) la couleur du texte : la donnée garde le nom, le rendu choisit la teinte du tableau (fond crème) */ const TX = { rouge: '#c0392b', vert: '#1e7d45', bleu: '#1f5fbf', or: '#b8860b' }; (et.coulTxt || []).filter(x => x.p === p).forEach(x => { const e2 = dr_esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = dr_remplacerNieme(htmlTexte, e2, x.n, e2 => `<span class="p8-ct" data-coul="${x.couleur}" style="color:${TX[x.couleur] || 'inherit'}">${e2}</span>`); }); (et.gras || []).filter(x => x.p === p).forEach(x => { const e2 = dr_esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = dr_remplacerNieme(htmlTexte, e2, x.n, e2 => `<b class="p8-gras">${e2}</b>`); }); (et.soul || []).filter(x => x.p === p).forEach(x => { const e2 = dr_esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = dr_remplacerNieme(htmlTexte, e2, x.n, e2 => `<u class="p8-soul">${e2}</u>`); }); /* E1 (R6, R13) gras et souligné, comme la couleur */ return htmlTexte; }

function paginer(mur, et){
  const corps = mur.querySelector('.corpsd'); const page = mur.querySelector('.page'); if (!corps) { if (page) page.textContent = ''; et.pages = null; return; }
  const H = corps.clientHeight; corps.querySelectorAll('.hors').forEach(l => l.classList.remove('hors'));
  const gros = et._blocActif != null ? corps.querySelector(`.bloc[data-bi="${et._blocActif}"]`) : null;
  const murH = mur.clientHeight || 616; const pt0 = TAILLES[et.taille].pt; const pxMin = policePx(murH, 26);
  if (corps.scrollHeight > H + 2) { /* la police de la diapo descend jusqu'au plancher (26 pt), jamais en dessous */ let px = parseFloat(corps.style.fontSize); while (corps.scrollHeight > H + 2 && px > pxMin + 0.1) { px = Math.max(pxMin, px - 0.5); corps.style.fontSize = px.toFixed(2) + 'px'; } et.policeReduite = px < policePx(murH, pt0) - 0.1 ? Math.round(px / policePx(murH, 32) * 32) : null; } else et.policeReduite = null; et.policeRatio = corps.style.fontSize && murH ? parseFloat(corps.style.fontSize) / murH : null; /* (p8-5f) la police de la diapo, en part de sa hauteur : le tableau la reprend */
  if (corps.scrollHeight <= H + 2) { page.textContent = ''; et.pages = null; return; }
  const els = Array.from(corps.querySelectorAll('li, .rep')); const base = corps.querySelector('.act') ? corps.querySelector('.act').offsetHeight + 8 : 0; const top0 = els.length ? p85fHaut(els[0], corps) : 0; const pages = []; let cur = [], debut = 0; /* (p8-5f) la hauteur de chaque ligne dans le corps, quel que soit son bloc */
  els.forEach((l, i) => { const y = p85fHaut(l, corps); const bas = y + l.offsetHeight - top0; if (bas - debut > H - base && cur.length) { pages.push(cur); cur = []; debut = y - top0; } cur.push(i); }); pages.push(cur);
  { const pageAvant = et.page; const limite = H - (parseFloat(getComputedStyle(corps).paddingBottom) || 0); for (let pi = 0; pi < pages.length && pi < 60; pi++) { et.pages = pages; et.page = pi; appliquerPages(mur, et); const p = pages[pi]; const k = p.findIndex(i => p85fHaut(els[i], corps) + els[i].offsetHeight > limite + 1); if (k > 0) { const suite = pages[pi + 1]; pages.splice(pi, suite ? 2 : 1, p.slice(0, k), p.slice(k).concat(suite || [])); } } et.page = pageAvant; } /* (p8-5f) chaque page est montrée et mesurée sur ses boîtes réelles (titres, consignes, écarts entre blocs compris) : une ligne qui passe la marge du bas ouvre la page suivante, qui reprend la suite et se mesure à son tour ; une ligne seule trop haute reste (ancrée en haut, coupée en bas) */
  et.pages = pages; et.pagesP = pages.map(p => p.map(i => p85fCle(els[i]))); /* (p8-5f) les pages par identité, pour le tableau */ if (!et._pageManuelle || et.page == null || et.page >= pages.length) et.page = pageDeSuivi(et, els, pages); appliquerPages(mur, et);
}

function pageDeSuivi(et, els, pages){ let cible = -1; els.forEach((l, i) => { if (l.classList.contains('libre') && et._blocActif != null && +l.dataset.bi === et._blocActif) cible = i; });
  if (et.atelier) { const f = (S._p85fCible != null && $('mur').querySelector(`[data-p="${S._p85fCible}"]`)) || document.activeElement; const fi = f ? els.findIndex(l => l === f || l.contains(f)) : -1; if (fi < 0) return et.page != null && et.page < pages.length ? et.page : 0; cible = fi; } /* (p8-5f) l'atelier : la page de la ligne qui a le curseur, ou de celle qui va le recevoir */
  if (cible < 0 && !et.atelier && S.neuf && S.neuf.di === S.di && S.neuf.k === et.nDev - 1) { const ni = els.findIndex(l => l.dataset.k != null && +l.dataset.k === S.neuf.k); if (ni >= 0) cible = ni; } /* E1 (relecture continue E4, A4 14:50 ; C1 5.2) : la page suit ce que ▶ vient de montrer — plus la page de la dernière réponse écrite */
  if (cible < 0) { let last = -1; els.forEach((l, i) => { if (l.dataset.k != null && +l.dataset.k < et.nDev) last = i; if (l.dataset.r != null && !l.classList.contains('pas')) last = i; }); /* (p8-5f) un champ de réponse ne compte que dévoilé */ cible = Math.max(0, last); }
  const pi = pages.findIndex(p => p.includes(cible)); return pi < 0 ? 0 : pi; }

function appliquerPages(mur, et){ const corps = mur.querySelector('.corpsd'); const page = mur.querySelector('.page'); if (!corps || !et.pages) { if (page) page.textContent = ''; return; }
  const els = Array.from(corps.querySelectorAll('li, .rep')); const pi = Math.max(0, Math.min(et.pages.length - 1, et.page || 0)); els.forEach((l, i) => l.classList.toggle('hors', !et.pages[pi].includes(i)));
  corps.querySelectorAll('.bloc').forEach(b => { const vis = Array.from(b.querySelectorAll('li, .rep')).some(x => !x.classList.contains('hors')); b.querySelectorAll('.cons, .q').forEach(t => t.classList.toggle('hors', !vis && b.querySelectorAll('li, .rep').length > 0)); });
  page.innerHTML = et.pages.length > 1 ? `<span data-p="-1" title="page précédente (molette, Maj+←)">‹</span>page ${pi + 1} / ${et.pages.length}<span data-p="1" title="page suivante (molette, Maj+→)">›</span>` : ''; }

function p85fCle(l){ return l.dataset.p || ('r' + l.dataset.bi + '.' + l.dataset.r + '.' + (l.dataset.k || '')); }
 /* (p8-5f) l'identité d'une ligne de page, la même au pilote et au tableau */
function p85fHaut(l, corps){ let y = 0, n = l; while (n && n !== corps) { y += n.offsetTop; n = n.offsetParent; } if (n === corps) return y; const r = corps.getBoundingClientRect(); const k = r.height && corps.offsetHeight ? corps.offsetHeight / r.height : 1; return (l.getBoundingClientRect().top - r.top) * k + corps.scrollTop; }
 /* (p8-5f) la hauteur d'une ligne dans le corps de la diapo, où qu'elle soit */
function p85fSuivreFrappe(el){ const c = $('mur').querySelector('.corpsd'); if (!c || !el || !c.contains(el)) return; const rb = el.getBoundingClientRect(), cb = c.getBoundingClientRect(); const deborde = c.scrollHeight > c.clientHeight + 2; if (rb.bottom > cb.bottom + 1 || rb.top < cb.top - 1 || deborde !== !!c._p85fDeborde) { c._p85fDeborde = deborde; S.pageManuelle = false; dr_tout(); if (document.activeElement === el && el.isConnected) { const z = el.closest('ul, ol, .bloc, p') || el.parentElement; if (z && !z.classList.contains('bloc-edit')) { $('mur').querySelectorAll('.bloc-edit').forEach(y => y.classList.remove('bloc-edit')); z.classList.add('bloc-edit'); poserBarreBloc(z, blocDe(el)); } } } }
 /* (p8-5f) dans l'atelier, la frappe qui fait passer la ligne sous le cadre redessine : la page suit la ligne tapée (le redessin ne touche pas l'élément qui a le focus ; le cadre et la barre du bloc en cours d'édition sont remis, comme au focus) */
dr_ecouteDoc('scroll', ev => { const c = ev.target; if (c && c.classList && c.classList.contains('corpsd') && !c.classList.contains('cahier') && c.scrollTop) c.scrollTop = 0; }, true);

// ───────── l'état complet, le tableau, le journal ─────────
const etatComplet0 = () => { S.eidCourant = ecran().eid; const __p = !!S.preparation; const __oral = S.oralEnCours && S.oralEnCours.act ? (function(){ const a = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(z => z.id === S.oralEnCours.act); return a ? { num: a.num, titre: a.titre } : null; })() : null; const d = etatDiapo(); const e = ecran(); return { si: S.si, di: S.di, fichePage: (S.fichePage && S.fichePage.di === S.di) ? S.fichePage.bi : null, ficheEntre: !!(S.fichePage && S.fichePage.entre), ficheDev: S.fichePage ? (S.fichePage.nDev || 0) : 0, ficheEcr: S.fichePage ? (S.fichePage.ecr || []).slice() : [], /* E1 (R14) la fiche ouverte se dévoile par paragraphes, ✍🏻 sur un paragraphe */ arrivee: !!(S.arrivee && S.arrivee.di === S.di), neuf: (S.neuf && S.neuf.di === S.di && now() - S.neuf.t < 700) ? S.neuf.k : null, eid: e.eid, qui: S.qui || null, quiTotal: dr_presents(), coupure: !!S.coupure, cahier: (e.role === 'fin') ? (() => { const q = quiAParticipe(); let ecrit = 0; Object.keys(parDiapo).forEach(k => Object.values(parDiapo[k].reps || {}).forEach(l => l.forEach(r => { if (r.eleve && r.r) ecrit++; }))); const sim = dr_heureDe(S.heure)/* E1 : lisait HEURES_SIM */; return { onglet: S.finVue || 'travail', suite: !!suiteDepuis(S.heure), prepa: !!S.preparation, oral: S.oralEnCours && S.oralEnCours.act ? (function(){ const a = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(z => z.id === S.oralEnCours.act); return a ? { num: a.num, titre: a.titre } : null; })() : null, grand: (S.cahierGrand || {})[S.heure] !== false, /* agrandi par défaut (Paul, 23/09) */ version: (S.recitVersion || {})[S.heure] || 'site', scroll: (S.cahierScroll || {})[S.heure] || 0, recit: (S.finVue === 'contenu') ? recitPourED(S.heure) : '', travail: texteTravailED(), date: (S.echeance ? (dr_classe()/* E1 : lisait DATA.classe */.prochaines.find(x => x.iso === S.echeance) || {}).l : null) || 'la prochaine fois', donne: sim.jour.replace(/^\S+\s/, '').replace(/ \d{4}$/, ''), jour: sim.jour, de: sim.debut.replace(':', ' h '), a: sim.fin.replace(':', ' h '), heure: S.heure, qui: q, total: dr_presents(), ecrit, oral: S.parts.length }; })() : null, attente: S.close ? { h: hhmm(), d: dr_heureDe(S.heure)/* E1 : lisait HEURES_SIM */.jour, n: dr_classe()/* E1 : lisait DATA.classe */.nom, c: seance().titre } : null, flash: (S.flash && S.flash.di === S.di && now() - S.flash.t < 10500) ? S.flash.k : null, surl: (d.surl || []).slice(), coulTxt: (d.coulTxt || []).slice(), gras: (d.gras || []).slice(), soul: (d.soul || []).slice(), /* E1 (R6, R13) */ deja: (glisseeDe(e) ? dejaVuAvant(S.di) : 0), nDev: d.nDev, lum: d.lum.slice(), ecr: d.ecr.slice(), taille: S.taille, page: S.page, loupe: S.loupe, bandeau: S.bandeau, reps: JSON.parse(JSON.stringify(d.reps)), tailles: Object.assign({}, d.tailles), textes: Object.assign({}, d.textes), fsBloc: Object.assign({}, d.fsBloc), _blocActif: S.blocActif, _pageManuelle: !!S.pageManuelle, encart: S.encart || null, doc: S.doc ? Object.assign({}, S.doc) : null, videoPos: S.videoPos[e.eid] || 0, videoLecture: !!S.videoLecture }; };

/* E1 (réveil n°2, pour E3) : `fenetreMur` passe chez E3 (dr-tableau.js) ; le socle ne la déclare plus, il la lit (typeof). Tout envoi au tableau passe par le crochet d'E3 `dr_versMur` ; tant qu'il n'existe pas, l'ancien envoi à la fenêtre (une transition, pas un double envoi) */
function dr_auMur(et, msg){ if (typeof dr_versMur === 'function') { if (et) dr_versMur(et); else dr_versMur(null, { sortie: true }); return; }   /* la signature d'E3 (dr-tableau.js) */ const f = dr_fenetre(); if (f) { try { f.postMessage(msg || { sortie: true }, '*'); } catch (e) {} } }
/* E1 : la fenêtre du tableau, où qu'elle ait été ouverte — celle de la maquette (fenetreMur) ou celle d'E3 (DR_TAB.fen, ?vue=tableau&local=1) : pousser, la fiche, l'arrêt de la répétition y envoient */
function dr_fenetre(){ const fm = typeof fenetreMur !== 'undefined' ? fenetreMur : null; if (fm && !fm.closed) return fm; try { if (typeof DR_TAB !== 'undefined' && DR_TAB && DR_TAB.fen && !DR_TAB.fen.closed) return DR_TAB.fen; } catch (e) {} return null; }

/* E1 (R14, la couche commune) la fiche ouverte se pilote comme une diapo — l'ancien moteur (elems d'une fiche ouverte, marqueFiche) : ouverte au pilote, ▶ la dévoile paragraphe par paragraphe, ◀ revient ; ✍🏻 marque un paragraphe ; la couche d'annotation de la classe (ANNOT) est au tableau (E3) */
function dr_ficheOuverte(){ const f = S.fichePage; if (!f || f.di !== S.di) return null; const b = ecran().blocs[f.bi]; return b && b.t === 'fiche' ? b : null; }
function ouvrirFiche(bi){ const b = ecran().blocs[bi]; if (!b || b.t !== 'fiche' || S.atelier) return; S.fichePage = { di: S.di, bi, entre: true, nDev: 0, ecr: [] }; journal('fiche-ouverte', { si: S.si, di: S.di, bi, titre: String(b.txt || '') }); dr_tout(); setTimeout(() => { if (S.fichePage) { S.fichePage.entre = false; dr_tout(); } }, 460); }
function dr_ficheDevoiler(sens){ const b = dr_ficheOuverte(); if (!b) return false; const f = S.fichePage, n = (b.el || []).length; if (sens > 0 && f.nDev >= n) return true; if (sens < 0 && f.nDev <= 0) return true;
  f.nDev += sens; journal(sens > 0 ? 'fiche-devoile' : 'fiche-retire', { si: S.si, di: S.di, bi: f.bi, k: sens > 0 ? f.nDev - 1 : f.nDev }); dr_tout(); return true; }
function dr_ficheEcrire(k){ const f = S.fichePage; if (!dr_ficheOuverte()) return; const i = f.ecr.indexOf(k); if (i >= 0) f.ecr.splice(i, 1); else f.ecr.push(k); journal('fiche-ecrire', { si: S.si, di: S.di, bi: f.bi, k, pose: i < 0 }); dr_tout(); }
dr_ecouteDoc('click', ev => { if (S.atelier || !ev.target.closest) return; const o = ev.target.closest('#mur .dr-fiche-ouvrir'); if (o) { ev.preventDefault(); ev.stopPropagation(); ouvrirFiche(+o.dataset.fo); return; }
  if (ev.target.closest('#mur .dr-fiche-fermer')) { ev.preventDefault(); ev.stopPropagation(); fermerFiche(); return; } const p = S.mode === 'ecr' && ev.target.closest('#mur .f-tab [data-fk]'); if (p) { ev.preventDefault(); ev.stopPropagation(); dr_ficheEcrire(+p.dataset.fk); } }, true);
function fermerFiche(){ if (!S.fichePage) return; journal('fiche-fermee', { si: S.si, di: S.di, bi: S.fichePage.bi }); const t = mur.querySelector('.f-tab'); if (t) t.classList.add('ecran-sortie'); dr_auMur(null); /* E1 : le crochet d'E3 (sortie) */ setTimeout(() => { if (t) t.remove(); /* E1 (R14) la page sortie s'en va (la maquette n'ouvrait jamais de fiche : la sortie restait) */ S.fichePage = null; dr_tout(); }, 460); }

function sortieEcran(mur){ const e = mur.querySelector('.corpsd, .img, .video, .doc'); if (!e) return; const c = e.cloneNode(true); c.classList.add('ecran-sortie'); c.querySelectorAll('[contenteditable]').forEach(x => x.removeAttribute('contenteditable')); mur.appendChild(c); setTimeout(() => c.remove(), 520); }

function pousser(et){ if (S.atelier) return; /* (p1) l'atelier ne pousse rien au tableau, n'écrit rien au journal, ne marque rien comme vu (cadrage 4, 1.5) */ if (S.repetition) { /* (p6) la répétition : le tableau reçoit, rien n'est écrit (ni journal, ni vu) */ S.mur = et; dr_auMur(et, { et, ecran: dr_ecranVu(dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di])/* E1 : l'écran en clair pour l'autre document */, documents: dr_documents()/* E1 : lisait DATA.documents */[String(et.si)] || [] }); /* E1 : le crochet d'E3, if (typeof dr_versMur === 'function') dr_versMur(et) */ return; } const av = S.mur; const k = et.si + '|' + (dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di] ? dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di].eid : et.di); /* (a0, oubli réparé le 22/09) : la clé de vuMax par identifiant, comme partout */
  if (!av) journal('diapo', { si: et.si, di: et.di, eid: dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di].eid, nature: 'début', deja: et.deja || 0 });
  else if (av.si !== et.si || av.di !== et.di) journal('diapo', { si: et.si, di: et.di, eid: dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di].eid, deja: et.deja || 0, nature: (et.si === av.si && et.di === av.di + 1) ? 'suivante' : (et.si === av.si && et.di < av.di) ? 'retour' : 'saut', de: { si: av.si, di: av.di } });
  if (et.nDev > (vuMax[k] || 0)) { for (let i = (vuMax[k] || 0); i < et.nDev; i++) journal('devoile', { si: et.si, di: et.di, k: i }); vuMax[k] = et.nDev; }
  else if (av && av.si === et.si && av.di === et.di && et.nDev < (vuMax[k] || 0)) { for (let i = (vuMax[k] || 0) - 1; i >= et.nDev; i--) journal('retire', { si: et.si, di: et.di, k: i }); vuMax[k] = et.nDev; }
  if (av && av.si === et.si && av.di === et.di) {
    et.ecr.filter(x => !av.ecr.includes(x)).forEach(x => journal('ecrire', { si: et.si, di: et.di, k: x }));
    Object.keys(et.reps || {}).forEach(bi => (et.reps[bi] || []).forEach((r, ri) => { const avR = ((av.reps || {})[bi] || [])[ri]; if (!avR && r.r) journal('reponse', { si: et.si, di: et.di, bi: +bi, ri, eleve: r.eleve, ini: r.i, txt: r.r, refo: r.refo }); else if (avR && (avR.r !== r.r || avR.refo !== r.refo)) { const ev2 = J.slice().reverse().find(x => x.type === 'reponse' && x.si === et.si && x.di === et.di && x.bi === +bi && x.ri === ri); if (ev2) { ev2.txt = r.r; ev2.refo = r.refo; } } }));
    if (av.page !== et.page && et.pages && et.pages.length > 1) journal('page', { si: et.si, di: et.di, p: (et.page || 0) + 1 });
    if ((av.encart || null) !== (et.encart || null)) journal(et.encart ? 'reserve-affichee' : 'reserve-retiree', { txt: et.encart || av.encart });
    if (JSON.stringify(av.doc || null) !== JSON.stringify(et.doc || null)) { if (et.doc && (!av.doc || av.doc.id !== et.doc.id)) journal('document', { id: et.doc.id, pos: et.doc.pos }); else if (et.doc) journal('document-page', { id: et.doc.id, pos: et.doc.pos }); else journal('document-ferme', { id: av.doc.id }); }
    if (av.videoLecture !== et.videoLecture || av.videoPos !== et.videoPos) journal(et.videoLecture ? 'video-lecture' : 'video-pause', { si: et.si, di: et.di, pos: et.videoPos });
  }
  S.mur = et; dr_auMur(et, { et, ecran: dr_ecranVu(dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di])/* E1 : l'écran en clair pour l'autre document */, documents: dr_documents()/* E1 : lisait DATA.documents */[String(et.si)] || [] }); /* E1 : le crochet d'E3, if (typeof dr_versMur === 'function') dr_versMur(et) */ if (et.neuf != null) S.neuf = null; if (et.arrivee) S.arrivee = null; if (S.fichePage && S.fichePage.entre) S.fichePage.entre = false; }

// ───────── le cadre de la diapo : dimensionné dans la colonne centrale ; Ctrl + molette = la part de la colonne (0,55 à 1), jamais par-dessus les outils ─────────
function dimensionner(){ const sc = document.querySelector('.scene'); const cadre = $('murcadre'); if (!sc || !cadre) return; const alerte = $('alerte-video').style.display === 'block' ? $('alerte-video').offsetHeight + 7 : 0; const outils = document.querySelector('.outils').offsetHeight + document.querySelector('.titre').offsetHeight + alerte + 16 /* padding */ + 21 /* gaps */ + 44 /* notes au minimum */; const wDispo = sc.clientWidth - 32; const hDispo = (sc.clientHeight - outils) * (S.preparation ? (S.murPart || 1) : 1); const part = S.vue || 1;
  let w = Math.min(wDispo, hDispo * 16 / 9) * part; let h = w * 9 / 16; if (h > hDispo) { h = hDispo; w = h * 16 / 9; } if (!S.preparation && (S.murPart || 1) < 1) { h = h * S.murPart; w = h * 16 / 9; } /* (p8-5e) hors préparation, la part s'applique à la hauteur obtenue : la poignée agit dès le premier pixel */ cadre.style.width = Math.floor(w) + 'px'; cadre.style.height = Math.floor(h) + 'px'; }

dr_ecouteWin('resize', () => { dimensionner(); dr_tout(); });

S.lg = 186;
 S.ld = 336;

function poserColonnes(){ const c = $('corps'); c.style.setProperty('--lg', (S.sansGauche ? 0 : S.lg) + 'px'); c.style.setProperty('--ld', (S.sansDroite ? 0 : S.ld) + 'px'); c.classList.toggle('sans-gauche', !!S.sansGauche); c.classList.toggle('sans-droite', !!S.sansDroite); }

function dr_tirer(poignee, cote){ let dep = null; poignee.addEventListener('mousedown', ev => { ev.preventDefault(); dep = { x: ev.clientX, lg: S.sansGauche ? 0 : S.lg, ld: S.sansDroite ? 0 : S.ld }; poignee.classList.add('tire'); document.body.style.cursor = 'col-resize'; });
  dr_ecouteDoc('mousemove', ev => { if (!dep) return; const max = Math.floor(innerWidth * 0.45); if (cote === 'g') { const l = Math.max(0, Math.min(max, dep.lg + (ev.clientX - dep.x))); S.sansGauche = l < 60; if (!S.sansGauche) S.lg = l; } else { const l = Math.max(0, Math.min(max, dep.ld - (ev.clientX - dep.x))); S.sansDroite = l < 60; if (!S.sansDroite) S.ld = l; } poserColonnes(); dimensionner(); });
  dr_ecouteDoc('mouseup', () => { if (!dep) return; /* repliée par le geste : elle rouvrira à sa largeur d'avant le geste */ if (cote === 'g' && S.sansGauche && dep.lg >= 60) S.lg = dep.lg; if (cote === 'd' && S.sansDroite && dep.ld >= 60) S.ld = dep.ld; dep = null; poignee.classList.remove('tire'); document.body.style.cursor = ''; dr_tout(); });
  poignee.addEventListener('dblclick', () => { if (cote === 'g') S.sansGauche = !S.sansGauche; else S.sansDroite = !S.sansDroite; poserColonnes(); dr_tout(); }); }

dr_tirer($('pg'), 'g');
 dr_tirer($('pd'), 'd');
 poserColonnes();

// ───────── la vue de droite (Paul, 17/09) : la diapo suivante en entier ⇄ ce que le tableau affiche (l'état envoyé, rien de non dévoilé) ; le bouton Tableau bascule ─────────
function ligneSuite(){ const z = $('pv-suite'); if (!z) return; const su = suitePourLaClasse(); if (!su) { z.style.display = 'none'; return; } z.style.display = 'block'; if (su.genre === 'element') z.innerHTML = `<span>Pour les élèves qui ont fini, ${su.lib} : <b>${dr_esc(su.txt)}</b></span><button class="btn or" id="pv-montrer" title="Exceptionnel : montre cet élément à la classe sur la diapo où elle est, sans quitter ta préparation. Ça compte pour la classe (journal, récit, temps), pas pour le cahier. Jamais au-delà de la diapo suivante, jamais le cahier de textes.">Montrer cette suite à la classe</button>`; else if (su.genre === 'diapo') z.innerHTML = `<span>Leur diapo est finie — la suite serait la diapo ${su.rang} : <b>${dr_esc(su.titre)}</b></span><button class="btn or" id="pv-montrer" title="Passe la classe à sa diapo suivante, sans quitter ta préparation. Ça compte pour la classe. Jamais le cahier de textes.">Passer la classe à la diapo ${su.rang}</button>`; else if (su.genre === 'cahier') z.innerHTML = `<span>Leur diapo est finie — la suite serait le cahier de textes, qui se joue avec la classe : <b>reviens au cours</b>.</span>`; else z.innerHTML = `<span>Leur diapo est finie ; rien après dans cette heure.</span>`; const b = $('pv-montrer'); if (b) b.onclick = montrerSuite; }

function vueDroite(et){ const boite = $('vue-mini'); const w = boite.clientWidth || 300; const sc = w / 1096; boite.style.height = Math.round(616 * sc) + 'px'; let inner = boite.querySelector(':scope > .mur'); if (!inner) { inner = document.createElement('div'); inner.className = 'mur'; boite.appendChild(inner); } inner.style.transform = `scale(${sc})`;
  const suiv = document.querySelector('.suivante');
  if (S.vueTableau) { suiv.classList.add('tableau'); $('vue-titre').textContent = 'Le tableau, en ce moment'; const etT = S.gel ? S.gel : (S.mur || et); const copie = Object.assign({}, etT, { pilote: false, _pageManuelle: etT._pageManuelle }); inner.className = 'mur tableau'; rendre(inner, copie); /* (p8-5h, 12) la vue « ⧉ Tableau » montre la page du tableau et porte son compteur « page i / n », comme la fenêtre — lisait pages: null (d'avant p8-5f) */ $('suiv-titre').textContent = S.gel ? 'gelé — la classe est sur la ' + libDiapo(S.gel.di) : 'la classe voit la ' + libDiapo((S.mur || et).di); $('vue-temoin').innerHTML = `<span class="pt-cnx ${S.coupure ? 'rouge' : 'vert'}"></span> ${S.coupure ? 'déconnecté' : (S.tab === 'classe' ? 'tableau distant connecté' : 'tableau en Win K')}`; }
  else { suiv.classList.remove('tableau'); $('vue-titre').textContent = 'Diapo suivante'; const o = ordreHeure(S.heure); const k = o.indexOf(S.di); const ni = k >= 0 ? o[k + 1] : S.di + 1; const sv = ni != null ? seance().ecrans[ni] : null; $('vue-temoin').textContent = '';
    if (!sv) { inner.innerHTML = ''; inner.className = 'mur'; $('suiv-titre').innerHTML = '<span style="color:var(--sourd)">— fin de l\'heure —</span>'; return; }
    const st = parDiapo[K(ni)] || {}; const etS = { si: S.si, di: ni, nDev: elements(sv).length, lum: [], ecr: [], taille: 1, page: 0, reps: st.reps || {}, tailles: st.tailles || {}, textes: st.textes || {}, fsBloc: {}, pilote: false, videoPos: S.videoPos[sv.eid] || 0, sansPages: true }; inner.className = 'mur'; rendre(inner, etS); const pg = inner.querySelector('.page'); if (pg) pg.textContent = ''; $('suiv-titre').innerHTML = `<b>${dr_esc(sv.act)}</b>${numDe(sv) ? ' · activité ' + numDe(sv) : ''}${typeof dr_libGlissee === 'function' && dr_libGlissee(sv) ? ' · ' + dr_libGlissee(sv) : ''}`; /* E1 (relecture continue E4, ligne 144) : le libellé de l'ouverture (§12.17), par dr_libGlissee d'E2 */ } }

$('btableau').onclick = () => { S.vueTableau = !S.vueTableau; journal(S.vueTableau ? 'vue-tableau' : 'vue-suivante'); dr_tout(); };

// ───────── tout() : le rendu du pilotage ─────────
const mur = $('mur');

const etatComplet = () => { const et = etatComplet0(); et.pageEtape = Object.assign({}, (S.pageEtape || {})[ecran().eid] || {}); if (S.atelier) { et.atelier = true; et.nDev = elements(ecran()).length; } if (S.oralEnCours && S.oralEnCours.act) { const a = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(z => z.id === S.oralEnCours.act); if (a) et.oral = { num: a.num, titre: a.titre }; } return et; };

function creneauDe(di){ /* l'heure prévue d'une diapo : la base de son heure + le cumul des durées avant elle */ const E = seance().ecrans; const h = E[di].heure; const o = ordreHeure(h); let t = dr_heureDe(h)/* E1 : lisait HEURES_SIM */ ? dr_heureDe(h)/* E1 : lisait HEURES_SIM */.base : 0; for (const i of o) { if (i === di) break; t += (E[i].dur || 0) * 60000; } return { debut: t, fin: t + (E[di].dur || 0) * 60000 }; }

function voletAtelier(){ const E = seance().ecrans; const heures = [...new Set(E.map(e => e.heure))].sort(); const acts = dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []; const numA = i => { const a = actDe(E[i]); return a ? 'A' + a.num : ''; }; let h = `<div class="at-chap"><div class="sea">Chapitre · ${dr_esc(dr_chapitreTitre())}</div><div class="sea2">Séance ${(S.si || 0) + 1} — ${dr_esc(seance().titre)} (${heures.length} h)</div>`; heures.forEach(hh => { const o = ordreHeure(hh); const prevu = o.filter(i => E[i].role !== 'fin').reduce((t, i) => t + (E[i].dur || 0), 0); const sim = dr_heureDe(hh)/* E1 : lisait HEURES_SIM */; const dep = prevu + 5 - 50; h += `<div class="fr"><span>H${hh} · ${sim ? dr_esc(sim.jour.replace(/ \d{4}$/, '')) : ''}${dr_heureEstJouee(hh) ? ' · jouée' : ' · 55 min'}</span><span>${prevu} + 5 = ${prevu + 5} min ${dep > 0 ? '<span class="plus" title="Ce que l\'heure dépasse : réduis une durée ou déplace une diapo">+' + dep + '</span>' : '<span style="color:var(--joue)">✔</span>'}</span></div>`; o.forEach(i => { const e = E[i]; h += `<div class="dr-d${i === S.di ? ' on' : ''}" data-at-di="${i}" title="Ouvre cette diapo dans l'atelier"><span class="dr-n">${rangDe(i, hh)}</span><span class="t">${e.role === 'fin' ? 'Cahier de textes' : dr_esc(e.act)}${(function(){ const n = (p85hPages(i).pages || [0]).length; return n > 1 ? '<span class="p85h-pages" title="Cette diapo se lit en ' + n + ' pages au tableau (le texte ne tient pas au plancher lisible d\'une page) : en classe, une vignette par page"> · ' + n + ' pages</span>' : ''; })()}</span>${e.role === 'fin' ? '' : '<span class="a">' + numA(i) + '</span>'}<span class="dr-h">${e.role === 'fin' ? 5 : (e.dur || 0)} min</span></div>`; }); }); h += `<div class="aide">Ctrl + molette : zoom · clic droit : dupliquer, insérer, déplacer, envoyer vers une autre séance, supprimer</div></div>`; return h; }

function droiteAtelier(){ const E = seance().ecrans; const e = ecran(); const aide = S.aideFermee ? '' : '<div class="at-d at-aide" id="at-aide"><span class="x" title="Ferme l\'aide">✕</span><b>Écrire dans la diapo</b> — un clic dans un bloc, tu tapes ; <b>Tab</b> passe à l\'élément suivant, <b>Maj + Tab</b> au précédent, <b>Entrée</b> en fin de ligne crée l\'élément suivant, <b>Échap</b> annule une ligne vide ; <b>Alt + ↑ / ↓</b> monte ou descend le bloc. Rien à sauver : c\'est enregistré quelques secondes après la frappe, et le témoin le dit.</div>'; return aide + droiteAtelier0(e, E); }

function droiteAtelier0(e, E){ const a = actDe(e); const dA = a ? diaposAct(a) : [e]; const rang = a ? dA.indexOf(S.di) + 1 : 1; const cr = creneauDe(S.di); const sim = dr_heureDe(e.heure)/* E1 : lisait HEURES_SIM */; const comp = (e.comp || []).map(libNotion); const remob = (e.remob || []).map(libNotion); const nEl = elements(e).length;
  const acts0 = dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []; const heures = [...new Set(E.map(z => z.heure))].sort(); const chips = (ids, quoi) => ids.map(id => `<span class="dr-chip" data-n="${dr_esc(id)}" title="${dr_esc(libNotion(id))}">${dr_esc(libNotion(id))}<span class="x" data-retire="${quoi}" data-id="${dr_esc(id)}" title="Retire cette notion">✕</span></span>`).join('');
  let x = e.role === 'fin' ? `<div class="at-d"><h5>CE QUE LA DIAPO DÉCLARE</h5><div class="l"><b>Fin d'heure</b> — posée par le site, les cinq minutes réservées au cahier ; pas de numéro d'activité ; ne se duplique pas, ne glisse pas, ne se retire pas (2.6)</div><div class="l">Heure : <b>H${e.heure}</b>${sim ? ' (' + dr_esc(sim.jour.replace(/ 2026$/, '')) + ')' : ''} · 5 min</div></div>` : (!(S.declareOuverte && S.declareEid === e.eid) ? `<div class="at-d"><h5>CE QUE LA DIAPO DÉCLARE <span class="modif" data-declare="ouvrir" title="Ouvre les champs : activité, titre, durée, rôle, heure prévue, notions, légende — tu n'y vas que si « À régler » te le demande ou si quelque chose est faux">modifier</span></h5><div class="l lire">${a ? '<b>A' + a.num + ' · ' + dr_esc(a.titre) + '</b> — diapo ' + rang + ' sur ' + dA.length + ' de l\'activité' : '<b style="color:#ff8a8e">hors activité</b> — sans numéro : le chapitre est refusé à l\'import (3.2 bis)'}${e.role ? ' · rituel : <b>' + (e.role === 'reactivation' ? 'réactivation' : e.role) + '</b>' : ''}<br>Heure prévue : <b>H${e.heure}</b>${sim ? ' (' + dr_esc(sim.jour.replace(/ 2026$/, '')) + ')' : ''} · ${hhmm(cr.debut)} → ${hhmm(cr.fin)} · ${e.dur || 0} min<br>Notions travaillées : ${(e.comp || []).length ? (e.comp || []).map(n => '<b>' + dr_esc(libNotion(n)) + '</b>').join(', ') : '<i>aucune</i>'}<br>Remobilise : ${(e.remob || []).length ? (e.remob || []).map(n => '<b>' + dr_esc(libNotion(n)) + '</b>').join(', ') : 'rien'}${e.legende ? '<br>Surlignage : ' + dr_esc(Object.keys(e.legende).map(k => k + ' = ' + e.legende[k]).join(' · ')) : ''}</div></div>` : `<div class="at-d"><h5>CE QUE LA DIAPO DÉCLARE <span class="modif" data-declare="fermer" title="Referme les champs">fermer</span></h5>${S.declareLigne ? `<div class="corr">⚠ À corriger ici : ${dr_esc(S.declareLigne)}</div>` : ''}<div class="l">Activité : <select id="dc-act" title="L'activité de cette diapo — une activité a un numéro continu sur le chapitre, un titre, une ou plusieurs diapos (3.2 bis)">${acts0.map(z => `<option value="${z.id}" ${a && a.id === z.id ? 'selected' : ''}>A${z.num} · ${dr_esc(z.titre)}</option>`).join('')}<option value="" ${!a ? 'selected' : ''}>— hors activité (rituel)</option><option value="+">+ nouvelle activité…</option></select></div>${a ? `<div class="l">Titre de l'activité : <span class="ed" id="dc-atitre" contenteditable="plaintext-only" title="Le titre de l'activité, écrit ici">${dr_esc(a.titre)}</span> <span class="at-note">· ${dA.length} diapo${dA.length > 1 ? 's' : ''} · diapo ${rang} sur ${dA.length}</span></div>` : ''}<div class="l">Diapo : <span class="ed" id="dc-titre" contenteditable="plaintext-only" title="Le titre de la diapo">${dr_esc(e.act)}</span> · durée <input id="dc-dur" type="number" min="1" value="${e.dur || 0}" style="width:52px" title="Les minutes prévues : l'heure prévue de la suite se recalcule"> min · rôle : <select id="dc-role" title="réactivation : première de son heure · bilan : dernier de la séance, unique · fin d'heure : posée par le site"><option value="" ${!e.role ? 'selected' : ''}>aucun</option><option value="reactivation" ${e.role === 'reactivation' ? 'selected' : ''}>réactivation (première de son heure)</option><option value="bilan" ${e.role === 'bilan' ? 'selected' : ''}>bilan (dernier de la séance)</option><option value="fin" disabled>fin d'heure (posée par le site)</option></select></div><div class="l">Heure prévue : <b>H${e.heure}</b>${sim ? ' (' + dr_esc(sim.jour.replace(/ 2026$/, '')) + ')' : ''} · ${hhmm(cr.debut)} → ${hhmm(cr.fin)} — <span class="at-note">proposée d'après les durées</span>${(heures.includes(e.heure + 1) || (e.heure === Math.max(...heures) && !e.role)) ? ` · <span class="plus" data-heure="${e.heure + 1}" title="Passe la diapo en H${e.heure + 1}, en tête de cette heure : le compte des deux heures se recalcule">↓ passer en H${e.heure + 1}</span>` : ''}${heures.includes(e.heure - 1) ? ` · <span class="plus" data-heure="${e.heure - 1}" title="Passe la diapo en H${e.heure - 1}, à la fin de cette heure (avant sa fin d'heure)">↑ passer en H${e.heure - 1}</span>` : ''}</div><div class="l">Notions travaillées : ${chips(e.comp || [], 'comp')} <span class="plus" data-plus="comp" title="Ajoute une notion travaillée par cette diapo">+ notion…</span></div><div class="l">Remobilise : ${chips(e.remob || [], 'remob')} <span class="plus" data-plus="remob" title="Ajoute une notion que cette diapo suppose acquise">+ notion…</span> · <span class="plus" data-proposer="1" title="Proposition par défaut : les notions de la même famille travaillées plus tôt dans le chapitre (2.7)">proposer</span></div><div class="l">Légende de surlignage : <span class="ed" id="dc-leg" contenteditable="plaintext-only" title="jaune = … · vert = … (facultatif)">${e.legende ? Object.keys(e.legende).map(k => k + ' = ' + e.legende[k]).join(' · ') : ''}</span>${e.legende ? '' : '<span class="at-note"> (facultatif)</span>'}</div><div class="l">Éléments : ${nEl}${nEl > 1 ? ' · dévoilés un par un' : ''}</div></div>`);
  /* le travail à faire prévu par heure (2.3) */ const tp = dr_travail()/* E1 : lisait DATA.travailPrevu */ || (dr_travail()/* E1 : lisait DATA.travailPrevu = {} — le socle tient l'objet */); const cleTp = S.si + '|' + e.heure; const hSuiv = heures.filter(z => z > e.heure); x += `<div class="at-d${(S.plis || {}).tp === false ? '' : ' pli'}"><h5 data-pli="tp" title="Un clic pour ouvrir ou replier">L'HEURE ${e.heure} — le travail à faire prévu</h5><div class="l">Proposé au T-5 de cette heure, dans le cahier de textes : <span class="ed" id="dc-tp" contenteditable="plaintext-only" title="Le travail à faire que le T-5 proposera à la fin de cette heure ; ce que l'heure suivante remobilisera">${dr_esc(tp[cleTp] || '')}</span>${tp[cleTp] ? '' : '<span class="at-note"> (rien de prévu)</span>'}</div><div class="l at-note">Le spiralaire : ce que l'heure suivante remobilisera.</div></div>`;
  /* les activités du chapitre (3.2 bis) */ const sansNum = E.map((z, i) => ({ z, i })).filter(o => !o.z.role && !actDe(o.z)); x += `<div class="at-d${(S.plis || {}).acts === false ? '' : ' pli'}"><h5 data-pli="acts" title="Un clic pour ouvrir ou replier">LES ACTIVITÉS DU CHAPITRE (${acts0.length})</h5>${acts0.slice().sort((p1, p2) => p1.num - p2.num).map(z => { const d = diaposAct(z); const hs = [...new Set(d.map(i => E[i] && E[i].heure).filter(Boolean))]; return `<div class="act-l"><span class="dr-n">A${z.num}</span><span>${dr_esc(z.titre)}</span><span class="dr-d">${d.length} diapo${d.length > 1 ? 's' : ''} · ${hs.map(h => 'H' + h).join(', ') || '—'}</span></div>`; }).join('')}${sansNum.map(o => `<div class="act-l sans"><span class="dr-n">—</span><span>${dr_esc(o.z.act)}</span><span class="dr-d dr-warn">sans numéro d'activité : refus à l'import (3.2 bis)</span></div>`).join('')}<div class="l"><span class="plus" data-nouvelle-act="1" title="Une activité de plus, numérotée à la suite">+ activité</span> · <span class="plus" data-renum="1" title="Renumérote toutes les activités dans l'ordre des diapos, sans trou">renuméroter (continu)</span></div></div>`;
  x += p8Panneau(e); /* (p8-3) le panneau du schéma */ /* pour la classe : le temps et les notions */ const alertes = []; const h = e.heure; const o = ordreHeure(h); const prevu = o.filter(i => E[i].role !== 'fin').reduce((t, i) => t + (E[i].dur || 0), 0); const dep = prevu + 5 - 50; if (dep > 0) alertes.push(`⚠ L'heure ${h} dépasse de ${dep} min<i>${prevu} min d'activités + 5 min de cahier pour 50 utiles — le T-5 le redira ; réduis une durée ou déplace une diapo</i>`); const compTous = new Set(E.flatMap(z => z.comp || [])); E.forEach((z, i) => (z.remob || []).forEach(id => { const avant = E.some((y, j) => j < i && (y.comp || []).includes(id)); if (!avant) alertes.push(`⚠ « ${dr_esc(z.act)} » (H${z.heure}) remobilise une notion que rien ne travaille avant<i>« ${dr_esc(libNotion(id))} »${compTous.has(id) ? ' est travaillée plus tard — remonte l\'activité qui la travaille, ou change l\'ordre' : ' n\'est travaillée nulle part dans le chapitre'}</i>`); })); const jamais = [...new Set(E.flatMap(z => z.remob || []))].filter(id => !compTous.has(id)); if (jamais.length) alertes.push(`⚠ ${jamais.length} notion${jamais.length > 1 ? 's' : ''} remobilisée${jamais.length > 1 ? 's' : ''} ${jamais.length > 1 ? 'ne sont travaillées' : 'n\'est travaillée'} par aucune activité<i>${jamais.map(id => '« ' + dr_esc(libNotion(id)) + ' »').join(', ')} — prévue${jamais.length > 1 ? 's' : ''} nulle part</i>`); x += `<div class="at-d"><h5>POUR LA CLASSE — le temps et les notions</h5>${alertes.length ? alertes.map(t => '<div class="l al">' + t + '</div>').join('') : '<div class="l ok">✔ Rien à signaler : l\'heure tient, les notions remobilisées sont travaillées avant</div>'}</div>`;
  /* sur la forme : seulement s'il y a quelque chose à dire — la part de la diapo ouverte de la liste « À régler » */ const forme = alertesForme().filter(a => a.di === S.di).map(a => `⚠ ${dr_esc(a.l)}<i>${dr_esc(a.faire)}</i>`); if (forme.length) x += `<div class="at-d"><h5>SUR LA FORME — ce qui peut casser en classe</h5>${forme.map(t => '<div class="l al">' + t + '</div>').join('')}<div class="at-note">Ces alertes ne s'affichent jamais pendant une heure réelle : elles se règlent ici, ou dans « À régler » du chapitre.</div></div>`;
  /* le chapitre */ const acts = dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []; const nH = [...new Set(E.map(z => z.heure))].length; const notions = [...new Set(E.flatMap(z => (z.comp || []).concat(z.remob || [])))]; const trav = notions.filter(id => compTous.has(id)); x += `<div class="at-d"><h5>LE CHAPITRE</h5><div class="l">${dr_cles().length} séance${dr_cles().length > 1 ? 's' : ''} dans le chapitre · ${nH} h · ${E.length} diapos · ${acts.length} activités · notions : ${notions.length}, <span class="dr-ok">travaillées : ${trav.length}</span>${notions.length - trav.length ? ', <span class="al">jamais travaillées : ' + (notions.length - trav.length) + '</span>' : ''}</div><div class="l">Pages HTML : <b>${E.reduce((t, z) => t + (z.blocs || []).filter(b => b.t === 'html' || b.t === 'page').length, 0)}</b> · objets manquants à l'éditeur : <b>${dr_manques().length}</b> <span class="at-note">(à faire tendre vers zéro, 4.4)</span></div><div class="at-regler"><button id="at-regler" title="La liste complète de ce qui peut casser en classe dans ce chapitre, avec la marche à suivre et le texte prêt à copier pour l'instance (6.1)">À régler (${(typeof alertesChapitre === 'function' ? alertesChapitre() : alertesForme()).length})</button> <span class="at-note">— la seule liste de ce que tu as à faire ; chaque ligne dit le geste</span></div></div>`; return x; }

// ───────── navigation, gardes, gel ─────────
let gardeEnAttente = null;

function apercuOuvrir(diapos, k){ if (!diapos.length) return; S._apercu = { diapos, k }; const i = diapos[k]; const e = seance().ecrans[i]; $('gc-ap-titre').textContent = `${libDiapo(i).replace(/^d/, 'D')} — ${e.act} (${k + 1}/${diapos.length}${numDe(e) ? ', activité ' + numDe(e) : ''})`; const m = $('gc-ap-mini'); m.innerHTML = ''; m.dataset.hash = ''; const w = Math.min(1096, innerWidth - 80); const sc = w / 1096; m.style.height = Math.round(616 * sc) + 'px'; const inner = document.createElement('div'); inner.className = 'mur'; inner.style.transform = `scale(${sc})`; m.appendChild(inner); const st = parDiapo[K(i)] || {}; rendre(inner, { si: S.si, di: i, nDev: elements(e).length, lum: [], ecr: [], taille: 1, page: 0, reps: st.reps || {}, tailles: st.tailles || {}, textes: st.textes || {}, fsBloc: {}, pilote: false, videoPos: S.videoPos[e.eid] || 0, sansPages: true, eid: e.eid }); const pg = inner.querySelector('.page'); if (pg) pg.textContent = ''; $('gc-ap-prev').disabled = k === 0; $('gc-ap-next').disabled = k >= diapos.length - 1; $('gc-apercu').classList.add('on'); journal('cahier-garde-apercu', { di: i }); }

function apercuFermer(){ $('gc-apercu').classList.remove('on'); S._apercu = null; }

$('gc-ap-x').onclick = apercuFermer;
 $('gc-ap-prev').onclick = () => { const a = S._apercu; if (a && a.k > 0) apercuOuvrir(a.diapos, a.k - 1); };
 $('gc-ap-next').onclick = () => { const a = S._apercu; if (a && a.k < a.diapos.length - 1) apercuOuvrir(a.diapos, a.k + 1); };
 $('gc-apercu').addEventListener('click', ev => { if (ev.target === $('gc-apercu')) apercuFermer(); });

dr_ecouteDoc('keydown', ev => { if (!$('gc-apercu').classList.contains('on')) return; if (ev.key === 'Escape') { apercuFermer(); ev.stopPropagation(); ev.preventDefault(); } if (ev.key === 'ArrowLeft') { $('gc-ap-prev').click(); ev.stopPropagation(); ev.preventDefault(); } if (ev.key === 'ArrowRight') { $('gc-ap-next').click(); ev.stopPropagation(); ev.preventDefault(); } }, true);

function gardeCahier(faire){ const E = seance().ecrans; const o = ordreHeure(S.heure); const acts = {}; o.forEach(i => { const e = E[i]; if (e.role) return; const a = actDe(e); if (!a) return; const k = a.id; acts[k] = acts[k] || { a, diapos: [], restantes: 0, dur: 0, commencee: false }; acts[k].diapos.push(i); if (!finie(e, i)) acts[k].restantes++; else acts[k].commencee = true; acts[k].dur = dureeDe(a); }); const rest = Object.values(acts).filter(x => { const dec = decisionDe(E[x.diapos[0]]); return x.restantes > 0 && !(dec && !dec.defaut); }); /* une décision par défaut (posée par la séquence) n'est pas une décision de Paul */ const avance = E.map((e, i) => ({ e, i })).filter(x => x.e.heure > S.heure && !x.e.role && finie(x.e, x.i)); let titre, corps;
  if (rest.length) { titre = 'Aller au cahier de textes — ce qui resterait non fait pour cette heure'; corps = rest.map(x => `<div class="gc-l cliquable" data-diapos="${x.diapos.filter(i => !finie(E[i], i)).join(',')}" title="Clique : l'aperçu des diapos restantes de cette activité"><span class="gc-n">A${x.a.num}</span><span>${dr_esc(x.a.titre || x.a.act || '')} — ${x.restantes} diapo${x.restantes > 1 ? 's' : ''} restante${x.restantes > 1 ? 's' : ''}</span><span class="gc-r">${x.dur} min prévues · ${x.commencee ? 'commencée' : 'pas commencée'}</span></div>`).join('') + `<div class="gc-s">${rest.length > 1 ? 'Ces ' + rest.length + ' activités seront à décider' : 'Cette activité sera à décider'} dans la colonne de droite (à l'heure suivante, à la maison, en réserve, non fait).</div>`; }
  else if (avance.length) { const parH = {}; avance.forEach(x => { const k = 'heure ' + x.e.heure; parH[k] = (parH[k] || 0) + 1; }); titre = 'Aller au cahier de textes — tu es en avance'; corps = avance.map(x => `<div class="gc-l"><span class="gc-n">${numDe(x.e) ? 'A' + numDe(x.e) : ''}</span><span>${dr_esc(x.e.act)} — faite</span><span class="gc-r">prévue pour l'heure ${x.e.heure}</span></div>`).join('') + `<div class="gc-s">Tu as fait ${avance.length} diapo${avance.length > 1 ? 's' : ''} en avance (${Object.entries(parH).map(([k, n]) => n + ' pour l\'' + k).join(', ')}). L'ordre de l'heure suivante s'en souviendra.</div>`; }
  else { titre = 'Aller au cahier de textes — validation'; corps = `<div class="gc-l"><span class="gc-n">✔</span><span>Aucune activité restante prévue pour cette heure — tu es à l'heure.</span><span class="gc-r"></span></div><div class="gc-s">Rien à décider : le cahier de textes n'aura que le travail à faire et le récit.</div>`; }
  $('gc-titre').textContent = titre; $('gc-corps').innerHTML = corps; $('gc-corps').querySelectorAll('.gc-l.cliquable').forEach(l => l.onclick = () => apercuOuvrir(l.dataset.diapos.split(',').map(Number).filter(n => !isNaN(n)), 0)); $('garde-cahier').classList.add('on'); $('gc-rester').onclick = () => { $('garde-cahier').classList.remove('on'); journal('cahier-garde', { choix: 'rester' }); }; $('gc-aller').onclick = () => { $('garde-cahier').classList.remove('on'); journal('cahier-garde', { choix: 'y-aller' }); faire(); if (!S.enFin) ouvrirFin(true); /* la séquence est là avant le cahier (Paul, 24/09) */ }; $('gc-aller').focus({ preventScroll: true }); }

function dr_garde(faire, quoi){ if (S.gel || S.repetition) return faire(); /* (p6) aucune garde en répétition */ gardeEnAttente = faire; $('garde-titre').textContent = 'La classe te suivrait — ' + quoi + '.'; $('garde').classList.add('on'); $('garde-gel').focus({ preventScroll: true }); }

$('garde-gel').onclick = () => { $('garde').classList.remove('on'); if (!S.gel) gel(); const f = gardeEnAttente; gardeEnAttente = null; if (f) f(); };

$('garde-devant').onclick = () => { $('garde').classList.remove('on'); const f = gardeEnAttente; gardeEnAttente = null; if (f) f(); };

$('garde-non').onclick = () => { $('garde').classList.remove('on'); gardeEnAttente = null; };

function dr_horsHeureGarder(){ /* E1 (relecture continue E4, B4 15:50 ; cadrage 2 §1.4) : ▶ ◀ au Pilotage avant le lancement feuillettent la trame — l'état des diapos d'avant est mis de côté, et rendu au lancement : rien n'est « terminé » que la classe n'a pas vu */ if (S.lancee || S.repetition || S.atelier || S._horsHeure) return; S._horsHeure = { pd: JSON.stringify(parDiapo), vm: JSON.stringify(vuMax) }; }
function dr_horsHeureRendre(){ const h = S._horsHeure; if (!h) return; S._horsHeure = null; const r = (o, t) => { Object.keys(o).forEach(k => delete o[k]); Object.assign(o, JSON.parse(t)); }; r(parDiapo, h.pd); r(vuMax, h.vm); S.neuf = null; }
function devoiler(){ dr_horsHeureGarder(); if (S.preparation) return; if (dr_ficheDevoiler(1)) return; /* E1 (R14) */ /* en préparation, rien ne se dévoile : le cahier se joue avec la classe */ if (ecran().role === 'fin') { const d0 = etatDiapo(); if (d0.nDev === 2) S.finVue = 'contenu'; } const e = ecran(); const d = etatDiapo(); S.blocActif = null; S.pageManuelle = false;
  if (S.doc) { const doc = (dr_documents()/* E1 : lisait DATA.documents */[String(S.si)] || []).find(x => x.id === S.doc.id); const n = doc ? (doc.type === 'pdf' ? doc.pages : doc.etapes) || 1 : 1; if (S.doc.pos < n) { S.doc.pos++; dr_tout(); return; } if (typeof toast === 'function') toast('Le document est au tableau : ✕ pour revenir à la diapo, puis ▶.'); return; } /* E1 (relance du 21/10, relecteur d\'E4) : au bout du document, ▶ ne dévoile rien derrière lui — la classe ne voit que le document */
  if (e.blocs[0] && e.blocs[0].t === 'video') { videoSuivant(); return; }
  { const bp = e.blocs.findIndex(b => b.t === 'page' && b.contrat); if (bp >= 0) { S.pageEtape = S.pageEtape || {}; const pe = S.pageEtape[e.eid] = S.pageEtape[e.eid] || {}; const k = pe[bp] || 1; if (k < (e.blocs[bp].etapes || 1)) { pe[bp] = k + 1; journal('page-etape', { si: S.si, di: S.di, bi: bp, etape: k + 1 }); dr_tout(); return; } } }
  const n = elements(e).length; if (d.nDev < n) { S.neuf = { di: S.di, k: d.nDev, t: now() }; d.nDev++; S.page = null; } else if (S.di < seance().ecrans.length - 1) { allerSuivante(); return; } dr_tout(); }

function allerSuivante(){ const o = ordreHeure(S.heure); if (!o.includes(S.di)) { /* hors de l'heure : on suit la trame */ let i = S.di + 1; while (i < seance().ecrans.length && retiree(seance().ecrans[i])) i++; if (i >= seance().ecrans.length) return; S.di = i; S.page = null; S.doc = null; dr_tout(); return; } let k = o.indexOf(S.di) + 1; while (k < o.length && retiree(seance().ecrans[o[k]])) k++; if (k >= o.length) return; if (seance().ecrans[o[k]].role === 'fin' && !S.gel && !S._parGardeCahier) { const cible = o[k]; gardeCahier(() => { S.di = cible; S.page = null; S.doc = null; dr_tout(); }); return; } /* (a) 6.3 : par ▶ aussi, la garde du cahier */ S.di = o[k]; S.page = null; S.doc = null; dr_tout(); }

function revoiler(){ dr_horsHeureGarder(); if (dr_ficheDevoiler(-1)) return; /* E1 (R14) */ const d = etatDiapo(); if (S.doc) { if (S.doc.pos > 1) { S.doc.pos--; dr_tout(); } return; } const e = ecran(); if (e.blocs[0] && e.blocs[0].t === 'video') { videoPrecedent(); return; } if (!S.preparation && !S.atelier && pagePrecedente()) return;
  if (d.nDev > 0) { d.nDev--; S.page = null; S.blocActif = null; dr_tout(); return; } const o = ordreHeure(S.heure); const k = o.indexOf(S.di); const prec = k > 0 ? o[k - 1] : (k < 0 && S.di > 0 ? S.di - 1 : -1); if (prec < 0) return; dr_garde(() => { S.di = prec; S.page = null; S.doc = null; dr_tout(); }, 'revenir à la ' + libDiapo(prec)); } /* E1 (relecture continue E4, ligne 156) : le rang dans l'heure, comme « Diapo 7 sur 8 » */

function aller(i, parLeFil){ i = Math.max(0, Math.min(seance().ecrans.length - 1, i)); if (i === S.di) return; if (seance().ecrans[i].role === 'fin' && !S.gel && !S._parGardeCahier) { gardeCahier(() => { S._parGardeCahier = true; aller(i, true); S._parGardeCahier = false; }); return; } S.pageManuelle = false; S.blocActif = null; const fil = !!parLeFil; /* (a) Paul, 17/09 : seul ▶ est le fil ; un clic sur une vignette, avant ou après, demande d'abord */
  const faire = () => { S.di = i; S.page = null; S.doc = null; dr_tout(); }; if (fil) return faire(); const o = ordreHeure(S.heure); const avant = o.indexOf(i) >= 0 && o.indexOf(S.di) >= 0 ? o.indexOf(i) < o.indexOf(S.di) : i < S.di; dr_garde(faire, (avant ? 'revenir à la ' : 'sauter à la ') + libDiapo(i)); }

function gel(){ if (S.repetition) { toast('Jouer en avance — répétition : aucun gel, rien n\'est écrit.'); return; } if (S.preparation) { $('bgel').title = 'En préparation : reviens au cours d\'abord (« Revenir au cours »)'; journal('gel-refuse-preparation'); return; } if (S.gel) { if (S.gel.si !== S.si || S.gel.di !== S.di) { $('garde2-titre').textContent = `La classe est sur la ${libDiapo(S.gel.di)}, tu es à la ${libDiapo(S.di)}.`; /* E1 (relecture continue E4, A5 16:15 ; C1 2.4) : le vrai numéro, celui de l'heure (« Diapo 5 sur 8 »), comme pour la classe */ $('garde2').classList.add('on'); $('garde2-revenir').focus({ preventScroll: true }); return; } degeler(); }
  else { journal('gel'); S.gel = etatComplet(); document.body.classList.add('gel'); $('bgel').classList.add('gelon'); dr_tout(); } }

function suitePourLaClasse(){ /* ce qui serait montré à la classe sur la diapo où elle est (le gel), ou sa diapo suivante ; jamais le cahier de textes */ if (!S.preparation || !S.gel) return null; const E = seance().ecrans; const gi = S.gel.di; const e = E[gi]; const els = elements(e); const nd = S.gel.nDev || 0; if (nd < els.length) return { genre: 'element', di: gi, k: nd, txt: els[nd].txt, lib: 'la suite sur leur diapo' }; const o = ordreHeure(S.heure); const k = o.indexOf(gi); const suiv = o.slice(k + 1).find(i => !retiree(E[i])); if (suiv == null) return { genre: 'rien' }; if (E[suiv].role === 'fin') return { genre: 'cahier' }; return { genre: 'diapo', di: suiv, titre: E[suiv].act, rang: rangDe(suiv) }; }

function montrerSuite(){ const su = suitePourLaClasse(); if (!su || su.genre === 'rien' || su.genre === 'cahier') return; const E = seance().ecrans; if (su.genre === 'element') { S.gel.nDev = (S.gel.nDev || 0) + 1; const k = K(su.di); vuMax[k] = Math.max(vuMax[k] || 0, S.gel.nDev); journal('devoile', { si: S.si, di: su.di, k: S.gel.nDev - 1, depuisPreparation: true }); journal('montre-depuis-preparation', { di: su.di, k: S.gel.nDev - 1 }); } else { const di0 = S.di; S.di = su.di; S.page = null; const et = etatComplet(); S.di = di0; et.nDev = Math.max(et.nDev || 0, 0); S.gel = et; S.preparation.di = su.di; journal('diapo', { si: S.si, di: su.di, eid: E[su.di].eid, deja: 0, nature: 'suivante', depuisPreparation: true }); journal('montre-depuis-preparation', { di: su.di, diapo: true }); } pousser(S.gel); dr_tout(); }

const diaposAct = a => seance().ecrans.map((e, i) => i).filter(i => seance().ecrans[i].actId === a.id);
 /* les diapos d'une activité, par identifiant (a0) */
function notionsTravaillees(){ /* les notions travaillées : une activité qui les porte est finie (toutes ses diapos), ou un oral les a travaillées — voir une diapo ne suffit pas (7.1) */ const E = seance().ecrans; const t = {}; (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).forEach(a => { const ds = diaposAct(a).filter(i => E[i] && E[i].role !== 'fin' && !retiree(E[i])); if (!ds.length) return; const toutes = ds.every(i => finie(E[i], i)); if (!toutes) return; const h = (J.find(x => x.type === 'diapo' && ds.includes(x.di)) || {}).h; ds.forEach(i => (E[i].comp || []).forEach(id => { t[id] = t[id] || { h, par: 'A' + a.num + ' · ' + a.titre }; })); }); Object.keys(S.notionsOral || {}).forEach(id => { t[id] = t[id] || S.notionsOral[id]; }); return t; }

function libNotion(id){ let lib = id; dr_taxo()/* E1 : lisait DATA.taxo */.forEach(d => d.familles.forEach(f => f.notions.forEach(n => { if (n.id === id) lib = n.prof || n.eleve || id; }))); return lib; }

function remobNonTravaillees(h){ /* ce que les activités de l'heure h remobilisent sans que ce soit travaillé (7.1) */ const E = seance().ecrans; const trav = notionsTravaillees(); const out = []; E.forEach((e, i) => { if (e.heure !== h || retiree(e)) return; (e.remob || []).forEach(id => { if (!trav[id] && !out.some(o => o.id === id && o.di === i)) { const a = actDe(e); const src = E.findIndex(z => (z.comp || []).includes(id)); const as = src >= 0 ? actDe(E[src]) : null; const dec = as ? S.decisions[as.id] : null; out.push({ id, lib: libNotion(id), di: i, act: e.act, a, source: as, sourceEtat: dec ? ({ reserve: 'en réserve', nonfait: 'non faite', terminer: 'partie à la maison', preparer: 'partie à la maison', suivante: 'reportée' }[dec.choix] || dec.choix) : (src >= 0 && E[src].heure < h ? 'non jouée' : 'à venir') }); } }); }); return out; }

function miseEnFormeLegere(t){ t = String(t || '').trim().replace(/\s+([,.!?:;»])/g, (m, p) => (/[?!:;»]/.test(p) ? ' ' + p : p)).replace(/([«])\s*/g, '$1 ').replace(/\s{2,}/g, ' '); t = t.replace(/\b(\w+)\s+\1\b/gi, '$1'); if (!t) return t; t = t.charAt(0) === t.charAt(0).toLowerCase() ? t.charAt(0).toUpperCase() + t.slice(1) : t; t = t.replace(/([.!?])\s+([a-zà-ÿ])/g, (m, p, c) => p + ' ' + c.toUpperCase()); if (!/[.!?»]$/.test(t)) t += '.'; return t; }

function ouvrirOral(prerempli){ const h = S.heure; const E = seance().ecrans; const acts = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).filter(a => diaposAct(a).some(i => E[i].heure === h) && !(S.faiteOral || {})[a.id] && !(S.decisions[a.id] && !S.decisions[a.id].defaut) && diaposAct(a).some(i => !retiree(E[i]) && E[i].role !== 'fin')); const enCours = acts.find(a => diaposAct(a).includes(S.di)); const nonFaites = acts.filter(a => !diaposAct(a).filter(i => E[i].heure === h).every(i => finie(E[i], i)));
  S.oralEnCours = { t0: now(), pauses: [], di: S.di, eid: ecran().eid, act: enCours ? enCours.id : null }; $('oral-rempl').innerHTML = 'Cet oral :' + nonFaites.map(a => `<label><input type="radio" name="oral-r" value="${a.id}" ${prerempli && prerempli.act === a.id ? 'checked' : (!prerempli && enCours && enCours.id === a.id ? 'checked' : '')}> <b>remplace l'activité ${a.num} — ${dr_esc(a.titre)}</b>, faite à l'oral (ses diapos ne seront pas dévoilées ; la classe voit « Activité ${a.num} — à l'oral »)</label>`).join('') + `<label><input type="radio" name="oral-r" value="" ${prerempli && !prerempli.act ? 'checked' : (nonFaites.length && !(prerempli && prerempli.act) && enCours ? '' : 'checked')}> est <b>une reprise</b> (rien de prévu : le prévu se décale d'autant)</label>`;
  const remob = remobNonTravaillees(h); const trav = notionsTravaillees(); const vues = {}; const notionsDe = a => [...new Set(diaposAct(a).flatMap(i => E[i].comp || []))]; let hn = 'Notions travaillées à l\'oral : ';
  const rendreNotions = () => { const r = document.querySelector('#oral input[name="oral-r"]:checked'); const actId = r && r.value ? r.value : null; if (actId) { const a = acts.find(z => z.id === actId); const ns = notionsDe(a); $('oral-notions').innerHTML = 'Notions travaillées à l\'oral — <i>celles de l\'activité</i> : ' + (ns.length ? ns.map(id => `<label class="inline"><input type="checkbox" data-n="${id}" checked disabled> ${dr_esc(libNotion(id))}</label>`).join('') : '<i>aucune notion portée par cette activité</i>') + ` <a href="#" id="oral-plus" style="font-size:.85rem" title="Exceptionnel : une notion en plus de celles de l\'activité">+ une autre notion…</a><div id="oral-autres-z" style="display:none;margin-top:4px"></div>`; $('oral-plus').onclick = ev => { ev.preventDefault(); ev.target.style.display = 'none'; ns.forEach(id => { vues[id] = 1; }); autresNotions(); }; return; } if (prerempli && prerempli.notion) { $('oral-notions').innerHTML = 'Notion reprise à l\'oral — <i>celle de l\'ouverture de l\'heure</i> : ' + `<label class="inline"><input type="checkbox" data-n="${prerempli.notion}" checked disabled> ${dr_esc(libNotion(prerempli.notion))}</label>`; return; } $('oral-notions').innerHTML = hn0; brancherAutres(); }; remob.forEach(r => { if (vues[r.id]) return; vues[r.id] = 1; hn += `<label class="inline"><input type="checkbox" data-n="${r.id}"> ${dr_esc(r.lib)} <span class="prop">remobilisée, non travaillée</span></label>`; }); const courantes = E[S.di].comp || []; courantes.forEach(id => { if (vues[id]) return; vues[id] = 1; hn += `<label class="inline"><input type="checkbox" data-n="${id}"> ${dr_esc(libNotion(id))}</label>`; }); hn += ` <a href="#" id="oral-autres" style="font-size:.85rem" title="Les autres notions du chapitre (celles que la trame de la séance travaille ou remobilise)">autres notions du chapitre…</a><div id="oral-autres-z" style="display:none;margin-top:4px"></div>`; const hn0 = hn;
  const autresNotions = () => { const z = $('oral-autres-z'); z.style.display = 'block'; const chap = [...new Set(E.flatMap(e => (e.comp || []).concat(e.remob || [])))].filter(id => !vues[id]); chap.forEach(id => { vues[id] = 1; }); z.innerHTML = chap.map(id => `<label class="inline"><input type="checkbox" data-n="${id}"> ${dr_esc(libNotion(id))}</label>`).join('') + ` <a href="#" id="oral-tout" style="font-size:.85rem" title="Tout le programme, par famille, replié — seulement si la notion n'est pas dans le chapitre">tout le programme…</a><div id="oral-tout-z" style="display:none;margin-top:4px"></div>`; $('oral-tout').onclick = ev2 => { ev2.preventDefault(); ev2.target.style.display = 'none'; const z2 = $('oral-tout-z'); z2.style.display = 'block'; z2.innerHTML = dr_taxo()/* E1 : lisait DATA.taxo */.map(d => d.familles.map(f => { const ns = f.notions.filter(n => !vues[n.id]); return ns.length ? `<details><summary style="cursor:pointer;color:var(--texte2)">${dr_esc(d.nom || d.domaine || '')} · ${dr_esc(f.nom || f.famille || '')} (${ns.length})</summary>${ns.map(n => `<label class="inline"><input type="checkbox" data-n="${n.id}"> ${dr_esc(n.prof || n.eleve || n.id)}</label>`).join('')}</details>` : ''; }).join('')).join(''); }; };
  const brancherAutres = () => { const oa = $('oral-autres'); if (oa) oa.onclick = ev => { ev.preventDefault(); ev.target.style.display = 'none'; autresNotions(); }; };
  rendreNotions(); document.querySelectorAll('#oral input[name="oral-r"]').forEach(x => x.onchange = rendreNotions);
  $('oral-txt').value = prerempli && prerempli.texte ? prerempli.texte : ''; $('oral').classList.add('on'); journal('oral-debut', { h, di: S.di, act: S.oralEnCours.act }); const tick = () => { if (!S.oralEnCours) return; const o = S.oralEnCours; const enPause = o.pauses.length && !o.pauses[o.pauses.length - 1].fin; const passe = Math.round((now() - o.t0 - o.pauses.reduce((t, x) => t + ((x.fin || now()) - x.debut), 0)) / 1000); const a = enCours; const prevu = a ? dureeDe(a) : 0; const ta = a ? tempsActivite(a) : 0; const reste = heureCahier() - now(); const ecart = Math.round((reste - (ordreHeure(h).filter(i => !vuJ(h, i).fin && E[i].role !== 'fin').reduce((t, i) => t + (E[i].dur || 0), 0)) * 60000) / 60000); $('oral-chrono').innerHTML = (a ? `<b style="color:var(--joue)">A${a.num} · ${dr_esc(a.titre)}</b> · ${ta} min passée${ta > 1 ? 's' : ''} sur ${prevu} prévues · ` : '') + (ecart < 0 ? `l'heure est en retard de ${-ecart} min` : ecart > 0 ? `l'heure est en avance de ${ecart} min` : 'l\'heure est dans les temps'); $('oral-h').textContent = 'début ' + hhmm(o.t0).replace(':', ' h ') + ' · ' + Math.floor(passe / 60) + ' min ' + (passe % 60) + ' s' + (enPause ? ' (en pause)' : ''); }; tick(); S._oralTick = setInterval(tick, 1000);
  $('oral-pause').onclick = () => { S.oralEnCours.pauses.push({ debut: now() }); $('oral-pause').disabled = true; $('oral-reprendre').disabled = false; journal('oral-pause'); }; $('oral-reprendre').onclick = () => { const pp = S.oralEnCours.pauses; if (pp.length) pp[pp.length - 1].fin = now(); $('oral-pause').disabled = false; $('oral-reprendre').disabled = true; journal('oral-reprise'); };
  $('oral-annuler').onclick = () => { fermerOral(); journal('oral-annule'); }; $('oral-valider').onclick = validerOral; pousser(etatComplet()); dr_tout(); }

function fermerOral(){ clearInterval(S._oralTick); S.oralEnCours = null; $('oral').classList.remove('on'); $('oral-pause').disabled = false; $('oral-reprendre').disabled = true; }

function validerOral(){ const o = S.oralEnCours; if (!o) return; const h = S.heure; const E = seance().ecrans; const r = document.querySelector('#oral input[name="oral-r"]:checked'); const actId = r && r.value ? r.value : null; const notions = [...new Set(Array.from(document.querySelectorAll('#oral input[data-n]:checked')).map(x => x.dataset.n))]; const texte = miseEnFormeLegere($('oral-txt').value); const t1 = now(); const duree = Math.round((t1 - o.t0 - o.pauses.reduce((t, x) => t + ((x.fin || t1) - x.debut), 0)) / 60000 * 10) / 10;
  const oral = { h, t0: o.t0, t1, duree, pauses: o.pauses, act: actId, notions, texte, audio: null }; S.oraux = S.oraux || {}; S.oraux[h] = S.oraux[h] || []; S.oraux[h].push(oral); S.notionsOral = S.notionsOral || {}; notions.forEach(id => { S.notionsOral[id] = S.notionsOral[id] || { h, par: actId ? 'A' + ((dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(a => a.id === actId) || {}).num + ' (à l\'oral)' : 'reprise à l\'oral', oral: true }; });
  if (actId) { const a = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(z => z.id === actId); S.faiteOral = S.faiteOral || {}; S.faiteOral[actId] = { h, t0: o.t0, t1, duree }; journal('oral', { h, act: actId, num: a && a.num, duree, notions, texte, remplace: true }); /* ses diapos sont sautées pour cette heure ; le curseur va à la première diapo de l'activité suivante */ const dA = diaposAct(a); const o2 = ordreHeure(h); const apres = o2.filter(i => !dA.includes(i) && !vuJ(h, i).fin && !retiree(E[i]) && o2.indexOf(i) > o2.indexOf(dA[0])); fermerOral(); if (apres.length) { S._parGardeCahier = E[apres[0]].role === 'fin'; S.di = apres[0]; S.page = null; S._parGardeCahier = false; } } else { /* une reprise : rien de prévu, le prévu se décale d'autant (son temps est une coupure non comptée dans les activités) */ S.coupures = S.coupures || []; S.coupures.push({ debut: o.t0, fin: t1, di: o.di, eid: o.eid, duree: Math.round(duree), compte: false, reprise: true }); journal('oral', { h, act: null, duree, notions, texte, reprise: true }); fermerOral(); }
  dr_tout(); }

function preparerCahier(){ if (S.preparation) return; S.dispoAvant = { lg: S.lg, murPart: S.murPart || 1, notes: !!S.notesReduites, vue: S.vueTableau }; S.lg = 64; S.murPart = 0.58; S.notesReduites = true; $('corps').classList.add('prep'); document.querySelector('.notes').classList.add('reduites'); poserColonnes(); const i = ordreHeure(S.heure).find(k => seance().ecrans[k].role === 'fin'); if (i == null) return; if (!S.gel) { journal('gel'); S.gel = etatComplet(); document.body.classList.add('gel'); $('bgel').classList.add('gelon'); } S.preparation = { di: S.gel.di, si: S.gel.si }; S.vueTableau = true; /* en préparation, la vue de droite montre ce que la classe voit */ journal('cahier-preparation'); S._parGardeCahier = true; S.di = i; S.page = null; S.doc = null; S._parGardeCahier = false; dr_tout(); ouvrirFin(true); alerteFermer(); }

function revenirAuCours(){ if (!S.preparation) return; const pr = S.preparation; S.preparation = null; const d0 = S.dispoAvant || {}; S.lg = d0.lg || 186; S.murPart = d0.murPart || 1; S.notesReduites = !!d0.notes; S.vueTableau = !!d0.vue; $('corps').classList.remove('prep'); document.querySelector('.notes').classList.toggle('reduites', S.notesReduites); poserColonnes(); $('prep').style.display = 'none'; S.si = pr.si; S.di = pr.di; S.page = null; try { dimensionner(); } catch (e) {} journal('cahier-preparation-fin'); if (S.gel) degeler(); else dr_tout(); }

function degeler(){ S.gel = null; document.body.classList.remove('gel'); $('bgel').classList.remove('gelon'); journal('degel'); dr_tout(); }

$('garde2-revenir').onclick = () => { $('garde2').classList.remove('on'); S.si = S.gel.si; S.di = S.gel.di; S.page = null; degeler(); };

$('garde2-ici').onclick = () => { $('garde2').classList.remove('on'); degeler(); };
 $('garde2-non').onclick = () => { $('garde2').classList.remove('on'); };

$('bgel').onclick = gel;
 $('bdev').onclick = devoiler;
 $('bprec').onclick = revoiler;

$('bcoche').onclick = () => { S.bilanCoche = !S.bilanCoche; journal(S.bilanCoche ? 'bilan-atteste' : 'bilan-decoche'); dr_tout(); };

$('volet').addEventListener('click', ev => { const v = ev.target.closest('.vig'); if (v) p85hAllerPage(+v.dataset.i, v.dataset.pg); });   /* (p8-5h, 2) la vignette d'une page va à cette page */

function pageMain(d){ if (!S.pagesCourantes || S.pagesCourantes.length < 2) return; S.page = Math.max(0, Math.min(S.pagesCourantes.length - 1, (S.page || 0) + d)); S.pageManuelle = true; dr_tout(); }

mur.addEventListener('click', ev => { const sp = ev.target.closest('.page span'); if (sp) { ev.stopPropagation(); pageMain(+sp.dataset.p); } });

$('murcadre').addEventListener('wheel', ev => { if (ecran().role === 'fin' && !ev.ctrlKey) { const c = mur.querySelector('.ed-carte'); if (c) { c.scrollTop += ev.deltaY; ev.preventDefault(); } return; } if (S.loupe || ev.ctrlKey) return; if (!S.pagesCourantes || S.pagesCourantes.length < 2) return; ev.preventDefault(); pageMain(ev.deltaY > 0 ? 1 : -1); }, { passive: false });

document.querySelector('.scene').addEventListener('wheel', ev => { if (!ev.ctrlKey) return; ev.preventDefault(); S.vue = Math.max(.55, Math.min(1, Math.round(((S.vue || 1) + (ev.deltaY < 0 ? .05 : -.05)) * 100) / 100)); dr_tout(); }, { passive: false });

// ───────── marques, loupe, taille ─────────
$('blum').onclick = () => { S.mode = S.mode === 'lum' ? null : 'lum'; $('blum').classList.toggle('on', S.mode === 'lum'); $('becr').classList.remove('on'); };

$('becr').onclick = () => { S.mode = S.mode === 'ecr' ? null : 'ecr'; $('becr').classList.toggle('on', S.mode === 'ecr'); $('blum').classList.remove('on'); };

function allumer(k){ /* repris de l'ancien allume() : la classe spot-on pendant 10,5 s (dix pulsations), puis rien ; l'outil se repose */ S.flash = { di: S.di, k, t: now() }; journal('lumiere', { si: S.si, di: S.di, k }); S.mode = null; $('blum').classList.remove('on'); dr_tout(); setTimeout(() => { if (S.flash && S.flash.t + 10500 <= now()) { S.flash = null; dr_tout(); } }, 10600); }

mur.addEventListener('click', ev => { if (!S.mode) return; const li = ev.target.closest('li[data-k]'); const bloc = li ? null : ev.target.closest('[data-bloc]'); if (!li && !bloc) return; const k = li ? +li.dataset.k : 'b' + bloc.dataset.bloc; if (S.mode === 'lum') { allumer(k); return; } const d = etatDiapo(); const arr = d.ecr; const j = arr.indexOf(k); if (j >= 0) arr.splice(j, 1); else arr.push(k); dr_tout(); });

$('taille').oninput = ev => { S.taille = +ev.target.value; S.page = null; dr_tout(); };

$('bloupe').onclick = () => { if (S.loupe) { S.loupe = null; $('bloupe').classList.remove('on'); dr_tout(); return; } S.loupeArm = !S.loupeArm; $('bloupe').classList.toggle('on', S.loupeArm); };

let dragL = null;
 mur.addEventListener('mousedown', ev => { if (!S.loupeArm) return; const r = mur.getBoundingClientRect(); dragL = { x0: (ev.clientX - r.left) / r.width, y0: (ev.clientY - r.top) / r.height }; ev.preventDefault(); });

dr_ecouteDoc('mousemove', ev => { if (!dragL) return; const r = mur.getBoundingClientRect(); const c = $('cadre-loupe'); c.style.display = 'block'; const x1 = ev.clientX - r.left, y1 = ev.clientY - r.top, x0 = dragL.x0 * r.width, y0 = dragL.y0 * r.height; c.style.left = Math.min(x0, x1) + 'px'; c.style.top = Math.min(y0, y1) + 'px'; c.style.width = Math.abs(x1 - x0) + 'px'; c.style.height = Math.abs(y1 - y0) + 'px'; });

dr_ecouteDoc('mouseup', ev => { if (!dragL) return; $('cadre-loupe').style.display = 'none'; const r = mur.getBoundingClientRect(); const x1 = (ev.clientX - r.left) / r.width, y1 = (ev.clientY - r.top) / r.height; const x0 = Math.min(dragL.x0, x1), y0 = Math.min(dragL.y0, y1), w = Math.abs(x1 - dragL.x0), h = Math.abs(y1 - dragL.y0); dragL = null; S.loupeArm = false; if (w < 0.04 || h < 0.04) { $('bloupe').classList.remove('on'); return; } /* le cadre tracé : cette zone remplit le tableau */ S.loupe = { x0: Math.max(0, x0), y0: Math.max(0, y0), w: Math.min(1, w), h: Math.min(1, h) }; journal('loupe', { zone: [Math.round(x0 * 100), Math.round(y0 * 100), Math.round(w * 100), Math.round(h * 100)] }); dr_tout(); });

// ───────── surligner par couleur (repris de l'existant : quatre couleurs + retirer, sur la sélection) ─────────
const COULEURS = { jaune: '#ffe94a', vert: '#b6f0c2', rose: '#ffc9d6', bleu: '#bcd9ff' };
 /* repris de l'ancien, moteur L412 */
function surligner(couleur){ const sel = window.getSelection(); if (!sel.rangeCount || sel.isCollapsed) { $('dern').textContent = 'sélectionne d\'abord le texte à surligner'; return; } const r = sel.getRangeAt(0); const li = r.startContainer.parentElement && r.startContainer.parentElement.closest('#mur [data-p]'); if (!li) { p8Dire('sélectionne d\'abord le texte à surligner — dans la diapo ou dans tes notes'); return; } /* (p8-5c) jamais le silence */ const d = dr_formeCible(); /* E1 : dans l'atelier, la trame (e.forme, enregistrée) — lisait etatDiapo() */ if (S.atelier && !S.repetition) marquerModif({ di: S.di, forme: 'surl' }); const txt = r.toString(); d.surl = d.surl || []; if (couleur) d.surl.push(Object.assign({ p: li.dataset.p, txt, couleur }, dr_occurrence(li, r, txt) ? { n: dr_occurrence(li, r, txt) } : {})); else d.surl = d.surl.filter(x => !(x.p === li.dataset.p && (txt.includes(x.txt) || x.txt.includes(txt)))); /* retirer : toute marque qui contient la sélection ou qu'elle contient */ journal(couleur ? 'surligne' : 'surligne-retire', { si: S.si, di: S.di, p: li.dataset.p, txt, couleur }); sel.removeAllRanges(); dr_tout(); }

/* (p8-5c) les cinq carrés sont remplacés par « ab » et « A » et leurs palettes (p8-5c.js) */

// ───────── ⋯ et le clic droit ─────────
function menuA(m, x, y, items){ m.innerHTML = items.map(it => it === '-' ? '<hr>' : `<button class="it ${it.off ? 'off' : ''} ${it.ss ? 'ss' : ''}" data-a="${it.a}" ${it.off ? 'disabled' : ''} title="${dr_esc(it.t || '')}">${dr_esc(it.l)}</button>`).join(''); m.style.position = 'fixed'; m.style.zIndex = '1000'; m.classList.add('on'); const w = m.offsetWidth || 260, h = m.offsetHeight || 300; m.style.left = Math.max(4, Math.min(x, innerWidth - w - 4)) + 'px'; m.style.top = Math.max(4, Math.min(y, innerHeight - h - 4)) + 'px'; } /* E1 (relecteur neuf 1) : au point du clic, dans la fenêtre — le volet vit dans la colonne du site (§8.3) : relatif au pilotage, le menu passait sous la colonne */

dr_ecouteDoc('click', ev => { if (!ev.target.closest('.menu') && !ev.target.closest('#bplus')) { $('menu').classList.remove('on'); $('menuplus').classList.remove('on'); } });

$('bplus').onclick = ev => { ev.stopPropagation(); const r = $('bplus').getBoundingClientRect(); menuA($('menuplus'), r.left, r.bottom + 4, [{ a: 'chrono', l: 'Chrono au tableau', t: 'affiche le chrono en bandeau au tableau (une publication)' }, { a: 'qui', l: 'Qui a participé (au tableau)', t: 'les prénoms de ceux qui ont parlé, au tableau ; jamais pendant le gel' }, '-', { a: 'reserve', l: 'Réserve de la séance…', t: 'ce qui est en réserve pour ceux qui ont fini ; afficher en encart' }, { a: 'docs', l: 'Documents de la séance…', t: 'projeter un document ; pages aux flèches ; croix pour fermer' }, { a: 'oral', l: 'Expliqué à l\'oral…', t: 'ce que tu as expliqué sans jouer la diapo : ça remplace une activité de l\'heure (faite à l\'oral) ou c\'est une reprise ; les notions cochées passent travaillées à l\'oral ; ta phrase devient le paragraphe au récit' }, { a: 'notion', l: 'Déclarer une notion imprévue…', t: 'une notion travaillée à l\'oral, sur la diapo affichée' }, { a: 'appel', l: 'L\'appel : clic droit sur un nom de la liste', off: true }]);
  $('menuplus').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; $('menuplus').classList.remove('on'); const a = b.dataset.a; if (a === 'chrono') { S.bandeau = S.bandeau ? '' : '⏱ 07:00'; dr_tout(); } if (a === 'qui') basculerQui('menu'); if (a === 'reserve') ouvrirReserve(); if (a === 'docs') ouvrirDocs(); if (a === 'notion') ouvrirNotion(); if (a === 'oral') ouvrirOral(); }; };

function basculerQui(par){ if (S.qui) { S.qui = null; journal('qui-retire', { par }); } else { S.qui = quiAParticipe(); journal('qui-affiche', { n: S.qui.length, par }); } $('bqui').classList.toggle('actif', !!S.qui); dr_tout(); }

$('bqui').onclick = () => basculerQui('bouton');

function brancherMenus(){
  // sur une diapo (volet et scène), sur un bloc / une ligne / une réponse, sur un nom
  $('volet').oncontextmenu = ev => { if (S.atelier) { const d = ev.target.closest('[data-at-di]'); if (!d) return; ev.preventDefault(); menuAtelierDiapo(+d.dataset.atDi, ev.clientX, ev.clientY); return; } const v = ev.target.closest('.vig'); if (!v) return; ev.preventDefault(); menuDiapo(+v.dataset.i, ev.clientX, ev.clientY); };
  mur.oncontextmenu = ev => { ev.preventDefault(); if (S.atelier) { menuAtelierMur(ev); return; } const rep = ev.target.closest('.rep[data-r]'); const li = ev.target.closest('li[data-k]'); const bloc = ev.target.closest('.bloc');
    if (rep) { const d = etatDiapo(); const bi = +bloc.dataset.bi; const r = d.reps[bi][+rep.dataset.r]; menuA($('menu'), ev.clientX, ev.clientY, [{ a: 'eleve', l: `Aller à ${r.eleve ? prenomUnique(r.eleve) : r.i}`, t: 'ouvre ses prises de parole' }, { a: 'corriger', l: 'Corriger cette réponse', t: 'le texte au tableau, avec trace' }, { a: 'suppr-rep', l: 'Supprimer cette prise de parole', t: 'la réponse et sa prise, avec trace' }]);
      $('menu').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; $('menu').classList.remove('on'); if (b.dataset.a === 'suppr-rep') { d.reps[bi].splice(+rep.dataset.r, 1); journal('reponse-supprimee', { eleve: r.eleve }); dr_tout(); } if (b.dataset.a === 'corriger') { const dit = rep.querySelector('.dit') || rep; dit.contentEditable = 'true'; dit.focus(); const avant = r.r; dit.onblur = () => { dit.contentEditable = 'false'; r.r = dit.textContent.trim(); if (r.r !== avant) journal('reponse-corrigee', { eleve: r.eleve, avant, apres: r.r }); dr_tout(); }; dit.onkeydown = e2 => { if (e2.key === 'Enter') { e2.preventDefault(); dit.blur(); } if (e2.key === 'Escape') { e2.preventDefault(); e2.stopPropagation(); dit.textContent = avant; dit.blur(); } }; } if (b.dataset.a === 'eleve') { $('vif').value = r.eleve ? dr_prenom(r.eleve) : ''; participation(); $('vif').focus({ preventScroll: true }); } }; return; }
    if (li) { const k = +li.dataset.k; const d = etatDiapo(); menuA($('menu'), ev.clientX, ev.clientY, [{ a: 'lum', l: 'Mettre en lumière', t: 'dix pulsations dorées au tableau, puis rien ; noté au journal et dans le récit' }, { a: 'ecr', l: (d.ecr.includes(k) ? 'Retirer « à écrire »' : 'À écrire'), t: 'marqué à recopier, noté au journal' }, { a: 'revoiler', l: 'Revoiler celui-ci', off: k >= d.nDev, t: 'et tout ce qui suit' }, '-', { a: 'petit', l: 'Bloc : petit', ss: true, t: 'la taille du bloc, au tableau' }, { a: 'normal', l: 'Bloc : normal', ss: true, t: 'la taille du bloc, au tableau' }, { a: 'grand', l: 'Bloc : grand', ss: true, t: 'la taille du bloc, au tableau' }]);
      $('menu').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; $('menu').classList.remove('on'); const a = b.dataset.a; const bi = +bloc.dataset.bi; if (a === 'lum') { allumer(k); return; } if (a === 'ecr') { const arr = d.ecr; const j = arr.indexOf(k); if (j >= 0) arr.splice(j, 1); else arr.push(k); } if (a === 'revoiler') { d.nDev = k; } if (['petit', 'normal', 'grand'].includes(a)) { if (a === 'normal') delete d.tailles[bi]; else d.tailles[bi] = a; } dr_tout(); }; return; }
    menuDiapo(S.di, ev.clientX, ev.clientY); };
}

function libDecision(d){ return ({ suivante: 'à l\'heure suivante', reserve: 'en réserve', terminer: 'à terminer à la maison', preparer: 'à préparer à la maison', pastemps: 'à la maison, pas le temps', maison: 'à la maison', nonfait: 'non fait', reporter: 'reportée à la séance suivante', passee: 'passée (vidéo)' })[d.choix] || d.choix; }

function menuDiapo(i, x, y){ const e = seance().ecrans[i]; const a = actDe(e); const role = !!e.role; const dec = decisionDe(e); const commencee = a ? a.diapos.some(di => vuMax[K(di)] || (S.mur && S.mur.di === di)) : (!!vuMax[K(i)] || (S.mur && S.mur.di === i));
  const libA = a ? `l'activité ${a.num} (${a.diapos.length > 1 ? a.diapos.length + ' diapos' : '1 diapo'})` : 'cette diapo';
  const items = [{ a: 'aller', l: 'Y aller' + (i !== S.di ? '' : ' (tu y es)'), off: i === S.di }, '-',
    { a: 'ret', l: dec ? `Retirée de l'heure — ${libDecision(dec)}` : `Retirer ${libA} de l'heure`, off: commencee || role || !!dec, t: commencee ? 'déjà commencée devant la classe : elle se décide à la fin de l\'heure' : role ? (e.role === 'bilan' ? 'le bilan de la séance ne se retire pas' : 'la réactivation ne se retire pas') : 'toute l\'activité, avec ses diapos' },
    { a: 'ret-reserve', l: 'en réserve (pour ceux qui ont fini)', ss: true, off: commencee || role || !!dec, t: 'la réserve sert pendant la séance' }, { a: 'ret-maison', l: 'à la maison', ss: true, off: commencee || role || !!dec, t: 'en entier dans le récit' }, { a: 'ret-nonfait', l: 'non fait', ss: true, off: commencee || role || !!dec, t: 'avec un motif, pour toi' }, '-',
    { a: 'notion', l: 'Déclarer une notion imprévue…', t: 'une notion travaillée à l\'oral, non prévue, sur cette diapo' }, { a: 'comm', l: `Commenter… (${(S.comm[e.eid] || []).length})`, t: 'pour cette classe seulement, jamais au tableau' }];
  menuA($('menu'), x, y, items); $('menu').onclick = ev => { const b = ev.target.closest('[data-a]'); if (!b) return; $('menu').classList.remove('on'); const act = b.dataset.a; if (act === 'aller') aller(i); if (act === 'notion') ouvrirNotion(e.eid); if (act === 'comm') ouvrirComm(e.eid);
    if (act.startsWith('ret-')) { const choix = act.slice(4); const poser = motif => { S.decisions[cleDec(e)] = { choix, moment: 'classe', h: hhmm(), heure: S.heure, motif: motif || '' }; journal('retiree', { act: cleDec(e), choix, motif: motif || '' }); if (a ? a.diapos.includes(S.di) : i === S.di) allerSuivante(); else dr_tout(); }; if (choix === 'nonfait') demander(`« ${a ? 'Activité ' + a.num + ' — ' + a.titre : e.act} » non faite — motif (pour toi)`, poser); else poser(''); } }; }

function demander(titre, cb){ const f = $('fraison'); $('fraison-t').textContent = titre; const i = $('fraison-i'); i.value = ''; f.classList.add('on'); f.style.left = '380px'; f.style.top = '140px'; i.focus({ preventScroll: true }); i.onkeydown = ev => { if (ev.key === 'Enter') { f.classList.remove('on'); cb(i.value.trim()); } if (ev.key === 'Escape') { ev.stopPropagation(); f.classList.remove('on'); cb(''); } }; }

// ───────── relecture : le récit, et ce qui s'est passé ─────────
function voir(v){ ['fnotes', 'fcomm', 'fnotion', 'freserve', 'fdocs', /* E1 : 'fsimu' tombé avec la simulation */ 'ppop', 'vif-palette', 'menu', 'menuplus'].forEach(id => $(id).classList.remove('on')); document.body.classList.toggle('vue-relecture', v === 'relecture'); $('ecran-relecture').classList.toggle('on', v === 'relecture'); const at = v === 'atelier'; if (at !== !!S.atelier) { const enClasse = S.lancee && !S.close && !S.repetition; if (at && enClasse) S._classeLa = { si: S.si, di: S.di, page: S.page, pageManuelle: S.pageManuelle }; S.atelier = at; journal(at ? 'atelier-ouvert' : 'atelier-ferme', { di: S.di }); if (!at && S._classeLa) { const c = S._classeLa; S._classeLa = null; if (enClasse && c.si === S.si && seance().ecrans[c.di]) { S.di = c.di; S.page = c.page; S.pageManuelle = c.pageManuelle; } if (DR_MEM.minuteur) { clearTimeout(DR_MEM.minuteur); dr_sauveMaintenant(); } if (S._etatAtT && typeof dr_etatAtelierMaintenant === 'function') dr_etatAtelierMaintenant(true); } } /* E1 (relecture continue E4, 20:50, grave) : l'atelier ouvert pendant l'heure feuillette la copie sans emmener la classe — au retour au Pilotage, Paul retrouve la diapo où est la classe : ni saut, ni garde, rien au journal */ document.body.classList.toggle('vue-atelier', at); $('ong-pilotage').classList.toggle('on', v === 'pilotage'); $('ong-relecture').classList.toggle('on', v === 'relecture'); $('ong-atelier').classList.toggle('on', at); if (v === 'relecture') relecture(); else dr_tout();  dr_suivreBarre(v); /* E1 : la barre fusionnée du site suit la vue */ }

dr_ecouteDoc('keydown', ev => { if (!S.atelier) return; const champ = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable; if (champ) return; if ($('menu').classList.contains('on')) return; if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'd' || ev.key === 'D')) /* E1 (R20) */ { ev.preventDefault(); dupliquerDiapo(S.di); } else if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); insererDiapoApres(S.di); } else if (ev.key === 'Delete') { ev.preventDefault(); supprimerDiapo(S.di); } else if (ev.altKey && ev.key === 'ArrowUp') { ev.preventDefault(); deplacerDiapo(S.di, -1); } else if (ev.altKey && ev.key === 'ArrowDown') { ev.preventDefault(); deplacerDiapo(S.di, 1); } }, true);
 /* (p8-5g) à l'ouverture, l'état au mur — ce que la classe voit, gel compris — avec ses pages, sa page et sa police */
$('btoutes').onclick = () => { $('toutes').innerHTML = seance().ecrans.map((e, i) => `<div class="vig" data-i="${i}" style="display:block"><div class="mini" data-i="${i}"></div><div style="font-size:.8rem;color:var(--texte2)">${i + 1} · ${numDe(e) ? 'A' + numDe(e) + ' · ' : ''}${dr_esc(e.act)} · H${e.heure}${decisionDe(e) ? ' · ' + libDecision(decisionDe(e)) : ''}</div></div>`).join(''); $('vtoutes').classList.add('on'); miniatures($('toutes')); $('toutes').querySelectorAll('.vig').forEach(v => v.onclick = () => { $('vtoutes').classList.remove('on'); aller(+v.dataset.i); }); };

dr_ecouteDoc('keydown', ev => { const champ = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
  if ($('garde').classList.contains('on')) { if (ev.key === 'Enter') { ev.preventDefault(); $('garde-gel').click(); } if (ev.key === 'Escape') $('garde-non').click(); return; }
  if ($('garde2').classList.contains('on')) { if (ev.key === 'Enter') { ev.preventDefault(); $('garde2-revenir').click(); } if (ev.key === 'Escape') $('garde2-non').click(); return; }
  if (ev.key === 'Escape') { const ouvertes = ['vtoutes', 'fnotes', 'fcomm', 'fnotion', 'freserve', 'fdocs', /* E1 : 'fsimu' tombé avec la simulation */ 'fraison', 'ppop', 'vif-palette', 'menu', 'menuplus'].filter(id => $(id).classList.contains('on')); ouvertes.forEach(id => $(id).classList.remove('on')); if (!ouvertes.length && S.fichePage) { fermerFiche(); return; } if (!ouvertes.length && S.qui) { S.qui = null; journal('qui-retire'); dr_tout(); return; } if (!ouvertes.length && S.doc) { S.doc = null; dr_tout(); } if (document.activeElement) document.activeElement.blur(); return; }
  if ((ev.key === '²' || ev.key === 'F2') ) { ev.preventDefault(); $('vif').focus({ preventScroll: true }); $('vif').select(); return; }
  if ((ev.key === ' ' && ev.shiftKey) || (ev.code === 'Space' && ev.shiftKey)) { ev.preventDefault(); ouvrirPalette(); return; }
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z' && !champ) /* E1 (R20) Cmd aussi */ { ev.preventDefault(); annulerDerniere(); return; }
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'h') { ev.preventDefault(); dr_basculerSurl(); return; } /* E1 (R18, R20) Ctrl+H bascule : sur un passage surligné, il retire */ /* (p8-5c) le jaune direct, dans la diapo ou dans les notes */
  if ((ev.ctrlKey || ev.metaKey) && !ev.altKey && /^[cxv]$/i.test(ev.key) && S.atelier && !S.repetition && typeof dr_blocClavier === 'function' && dr_blocClavier(ev, champ)) return; /* E1 (R17) les blocs au clavier */
  if (champ) return;
  if (S.atelier && ev.key.length === 1 && /[a-z]/i.test(ev.key) && !ev.ctrlKey && !ev.metaKey && !ev.altKey) return; /* E1 (relecteur neuf n°2) : les touches seules de la classe (g gèle, r relecture, n, t, l…) n'agissent pas dans l'atelier */
  if ((ev.key === 'ArrowRight' && !ev.shiftKey) || ev.key === ' ') { ev.preventDefault(); if (ev.repeat) return; /* une touche maintenue ne dévoile pas en rafale */; devoiler(); }
  else if (ev.key === 'ArrowLeft' && ev.shiftKey) { ev.preventDefault(); pageMain(-1); } else if (ev.key === 'ArrowRight' && ev.shiftKey) { ev.preventDefault(); pageMain(1); }
  else if (ev.key === 'ArrowLeft') { ev.preventDefault(); revoiler(); }
  else if (ev.key === 'PageDown') { ev.preventDefault(); const o = ordreHeure(S.heure); const k = o.indexOf(S.di); const n = k >= 0 ? o[k + 1] : S.di + 1; if (n != null) aller(n); } else if (ev.key === 'PageUp') { ev.preventDefault(); const o = ordreHeure(S.heure); const k = o.indexOf(S.di); const n = k > 0 ? o[k - 1] : (k < 0 ? S.di - 1 : null); if (n != null && n >= 0) aller(n); }
  else if (ev.key.toLowerCase() === 'g') { ev.preventDefault(); gel(); } else if (ev.shiftKey && ev.key.toLowerCase() === 'p') { ev.preventDefault(); basculerQui('Maj+P'); } else if (ev.key.toLowerCase() === 'n') { ev.preventDefault(); basculerNotes(); } else if (ev.key.toLowerCase() === 't') { ev.preventDefault(); $('btoutes').click(); } else if (ev.key.toLowerCase() === 'l') { ev.preventDefault(); $('bloupe').click(); } else if (ev.key.toLowerCase() === 'r') { ev.preventDefault(); voir(document.body.classList.contains('vue-relecture') ? 'pilotage' : 'relecture'); } });

/* E2 : `heureCahier` et `tick` (la veille du T-5, l'heure) sont partis dans dr-classe.js (contrat §3, déplacés par leur propriétaire ; audits E1 F6 et E2 C2) */
