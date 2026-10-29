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
function dr_parquer(){ const z = dr_zone(); if (!z) return; z.classList.add('dr-parque'); if (z.parentNode !== document.body) document.body.appendChild(z); }
function dr_monter(hote){ const z = dr_zone(); if (!z || !hote) return; if (z.parentNode !== hote) hote.appendChild(z); z.classList.remove('dr-parque'); dr_dimensionnerZone(); }
function dr_dimensionnerZone(){ const z = dr_zone(); if (!z || z.classList.contains('dr-parque')) return; const haut = Math.max(0, z.getBoundingClientRect().top); z.style.height = Math.max(420, window.innerHeight - haut - 4) + 'px'; }
/* les écoutes globales de la maquette (clavier, souris, fenêtre) ne valent que quand le déroulé est à l'écran :
   ailleurs dans le site, ← → espace G N T L R n'appartiennent pas au déroulé */
function dr_ecouteDoc(type, fn, opt){ document.addEventListener(type, function(ev){ if (!dr_actif()) return; return fn.call(this, ev); }, opt); }
function dr_ecouteWin(type, fn, opt){ window.addEventListener(type, function(ev){ if (!dr_actif() && type !== 'message') return; return fn.call(this, ev); }, opt); }
(function(){ /* le garde-fou : si le site efface la zone qui la portait, elle revient au garage (ses écoutes, son état et ses nœuds restent) */
  const veille = () => { const z = dr_zone(); if (z && !z.isConnected) dr_parquer(); };
  try { new MutationObserver(veille).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  window.addEventListener('resize', () => { if (dr_actif()) dr_dimensionnerZone(); });
})();

/* ── le contexte : le chapitre ouvert, la séance de la colonne, l'heure de cours ── */
function dr_ctx(){
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
  if (!DR_MEM.prepares.has(E)) { DR_MEM.prepares.add(E); if (typeof _drIdentifierEcrans === 'function') _drIdentifierEcrans(E); dr_normaliserTrame(E); dr_preparer(E); dr_lireSousObjets(sk); return E; }   /* l'empreinte se prend après la lecture : rien ne s'écrit tant que Paul n'a rien modifié */
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
function dr_normaliserTrame(E){
  E.forEach(e => dr_heureParDefaut(e));
  const heures = [...new Set(E.map(e => e.heure))].sort((a, b) => a - b);
  heures.forEach(h => { const idx = E.map((e, i) => e.heure === h ? i : -1).filter(i => i >= 0); const der = idx[idx.length - 1]; if (der != null && E[der].role === 'fin') return;
    const fin = { eid: 'fin-h' + h + '-' + (E[0] && E[0].eid ? E[0].eid : 'x'), act: 'Fin d\'heure', dur: 5, role: 'fin', comp: [], blocs: [] }; fin.heure = h; Object.defineProperty(fin, 'dr_pose', { value: true });
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
    if (!Array.isArray(b.etapes)) Object.defineProperty(b, 'etapes', { value: [], writable: true, enumerable: true, configurable: true });
    if (b.txt == null) b.txt = '';
    dr_acces(b, 'el', () => b.etapes, v => { b.etapes = v || []; });
  } else {
    if (!Array.isArray(b.el)) { const vide = []; Object.defineProperty(b, 'el', { value: vide, writable: true, enumerable: true, configurable: true }); }
  }
  DR_MEM.blocs.add(b); return b;
}
/* l'heure prévue : absente du site, elle vaut 1 ; dès que Paul la change, elle devient une donnée de la trame (enregistrée) */
function dr_heureParDefaut(e){ if (!e || typeof e !== 'object' || Object.getOwnPropertyDescriptor(e, 'heure')) return; Object.defineProperty(e, 'heure', { get(){ return 1; }, set(v){ Object.defineProperty(e, 'heure', { value: v, writable: true, enumerable: true, configurable: true }); }, enumerable: false, configurable: true }); }
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
function dr_derouleDe(sk, brut){
  const sce = dr_seance(sk); const d = (sce && sce.deroule) || {}; const E = d.ecrans || []; const si = String(dr_rangSeance(sk));
  const acts = (DR_MEM.activites[si] || []).map(a => { const o = { id: a.id, num: a.num, titre: a.titre || '', diapos: (a.diapos || []).map(i => E[i] && E[i].eid).filter(Boolean) }; return o; });
  const notes = {}; Object.keys(DR_MEM.notes).forEach(k => { if (k.startsWith(si + '|')) { const eid = k.slice(si.length + 1); if (/^[^.#$\[\]\/]+$/.test(eid)) notes[eid] = DR_MEM.notes[k]; } });
  const travail = {}; Object.keys(DR_MEM.travail).forEach(k => { if (k.startsWith(si + '|')) travail[k.slice(si.length + 1)] = DR_MEM.travail[k]; });
  if (!brut) dr_preparer(E);
  const o = { ecrans: E.filter(e => !(e && e.dr_pose && !(e.blocs || []).length)) };   /* la fin d'heure posée à la lecture ne s'écrit que si Paul y a mis quelque chose */
  if (acts.length) o.activites = acts; if (Object.keys(notes).length) o.notes = notes; if (Object.keys(travail).length) o.travail = travail; return o;
}

/* ── l'écriture : dr_sauve (débounce 900 ms, comme atDrEnrAuto), témoin « Enregistré à … » (atDrEnrConfirme) ── */
function dr_sauve(){ if (typeof S !== 'undefined' && S.repetition) return; clearTimeout(DR_MEM.minuteur); DR_MEM.minuteur = setTimeout(dr_sauveMaintenant, 900); }
function dr_sauveMaintenant(){
  DR_MEM.minuteur = null; if (typeof S !== 'undefined' && S.repetition) return;
  if (dr_ctx().regime === 'classe') { if (typeof dr_copieAuto === 'function') dr_copieAuto(); return; }   /* en classe : la copie jouée (E2) */
  if (!dr_chapitre()) return;
  dr_cles().forEach(k => { const sce = dr_seance(k); if (!sce || !sce.deroule || !DR_MEM.prepares.has(sce.deroule.ecrans)) return;
    const o = dr_derouleDe(k); const j = JSON.stringify(o); if (DR_MEM.empreintes[k] === j) return; DR_MEM.empreintes[k] = j;
    const val = Object.assign({}, sce.deroule, o, { maj: Date.now() }); if (!o.activites) delete val.activites; if (!o.notes) delete val.notes; if (!o.travail) delete val.travail;
    sce.deroule.maj = val.maj; if (o.activites) sce.deroule.activites = o.activites; if (o.notes) sce.deroule.notes = o.notes; if (o.travail) sce.deroule.travail = o.travail;
    dr_ecrire(dr_cheminBDe(k) + '/deroule', JSON.parse(JSON.stringify(val)), 'Trame du déroulé — séance ' + k, () => { if (typeof atDrEnrConfirme === 'function') atDrEnrConfirme(true); });
  });
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
function dr_heureDe(h){
  const c = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) || null; const d = new Date(); const p = n => (n < 10 ? '0' : '') + n;
  const debut = (c && c.debut) || (p(d.getHours()) + ':' + p(d.getMinutes())); const fin = (c && c.fin) || (() => { const x = new Date(d.getTime() + 55 * 60000); return p(x.getHours()) + ':' + p(x.getMinutes()); })();
  const [hh, mm] = debut.split(':').map(Number); const base = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh || 0, mm || 0).getTime();
  const [fh, fm] = fin.split(':').map(Number); const utiles = Math.max(0, ((fh * 60 + fm) - (hh * 60 + mm)) - 5);
  return { jour: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), debut, fin, base, utiles };
}
function now(){ return Date.now(); }   /* E1 : l'horloge réelle (la maquette : HEURES_SIM[S.heure].base + DECALAGE) */

/* ── le transport : lecture par secuLire, écriture par mjpcPutJson (chemin sans FIREBASE_BASE, sans .json) ── */
function dr_lire(chemin, cb){ if (typeof secuLire !== 'function') { cb && cb(null); return; } secuLire(chemin).then(v => cb && cb(v)); }
function dr_ecrire(chemin, valeur, libelle, cb){ if (typeof S !== 'undefined' && S.repetition) return; if (typeof mjpcPutJson !== 'function') return; mjpcPutJson(FIREBASE_BASE + chemin + '.json', valeur, libelle || 'Déroulé', cb); }
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
/* la barre du site suit la vue de la maquette (voir() est appelée aussi par la répétition, la clôture…) */
function dr_suivreBarre(v){ const lb = document.getElementById('dr-lancer'); if (lb) lb.classList.toggle('dr-cache', !!(S.lancee || S.repetition)); if (typeof ATVUES !== 'undefined') { ATVUES.vue = v; if (typeof atVuesRetenir === 'function') atVuesRetenir(); } if (typeof atVuesMarquer === 'function') atVuesMarquer(v); }
/* la séance de la colonne devient celle du déroulé (ATVUES.snum ↔ S.si) */
function dr_suivreSeance(){ const k = (typeof ATVUES !== 'undefined' && ATVUES.snum != null) ? String(ATVUES.snum) : dr_cleSeance(0); const si = dr_rangSeance(k); if (S.si !== si) { S.si = si; S.di = 0; S.page = null; if (typeof reindexer === 'function') reindexer(); } }
/* le premier montage : la classe, la taxonomie, le rendu */
function dr_demarrer(){ dr_toutLire(); dr_classe(); dr_taxo(); dr_suivreSeance(); const hc = document.getElementById('hclasse'); if (hc) hc.textContent = dr_classe().nom; const ho = document.getElementById('hou'); if (ho && !S.lancee) ho.textContent = 'aucune heure lancée'; DR_MEM.demarre = true; }

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
