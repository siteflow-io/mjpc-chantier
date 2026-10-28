/* §12.56 (1) (a)(d) — la règle du redessin : on ne pose que ce qui change. dr_poseSi(el, 'textContent' | 'className' | 'title' | 'disabled' | 'hidden', v) ;
   dr_classeSi(el, nom, oui) n'ajoute ou ne retire une classe que si elle n'y est pas déjà (classList.remove/add réécrit l'attribut même quand rien ne change). */
function dr_poseSi(el, quoi, v){ if (el && el[quoi] !== v) el[quoi] = v; return el; }
function dr_classeSi(el, nom, oui){ if (el && el.classList.contains(nom) !== !!oui) el.classList.toggle(nom, !!oui); return el; }
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
function dr_dimensionnerZone(){ const z = dr_zone(); if (!z || z.classList.contains('dr-parque')) return; const haut = Math.max(0, z.getBoundingClientRect().top); const hz = Math.max(420, window.innerHeight - haut - 4); z.style.height = hz + 'px'; document.documentElement.style.setProperty('--dr-zone-h', hz + 'px'); }   /* sur la racine (la variable descend jusqu'à la colonne) : le module ne lit aucun id du site (collisions.mjs) */   /* E1 (§12.27-4) : la colonne du chapitre (.ed2-som) prend la même hauteur que la zone — chacune défile chez elle, la page ne défile plus */
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
/* E1 (§12.39, 13 · 80) : `dr_cles` est l'INDEX interne du volet (S.si ↔ clé, jamais écrit au hub, jamais montré) ; le numéro MONTRÉ est le rang dans l'`ordre` (`seRangDe`, le même que Structure) ; la clé désigne la séance, `dr_seanceDe(chCle, snum)` dit si c'est celle-ci */
function dr_rangAffiche(si){ try { const c = dr_chapitre(), k = dr_cleSeance(si); if (c && k != null && typeof seRangDe === 'function') { const r = seRangDe(c.seances, k); if (r) return r; } } catch (e) {} return (si || 0) + 1; }
function dr_estCetteSeance(chCle, snum){ const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || null; const sk = (typeof ATVUES !== 'undefined' && ATVUES && ATVUES.snum != null) ? String(ATVUES.snum) : null; return !!(ec && sk != null && chCle != null && snum != null && String(chCle) === String(ec.chnum) && String(snum) === sk); }
/* la trame d'une séance : B/deroule.ecrans, identifiée (eid) et lue par le rendu (dr_preparer) — jamais copiée */
function dr_trameDe(sk){
  dr_toutLire(); const sce = dr_seance(sk); if (!sce) return [];
  if (!sce.deroule || typeof sce.deroule !== 'object') sce.deroule = { ecrans: [], maj: 0 };
  if (!Array.isArray(sce.deroule.ecrans)) sce.deroule.ecrans = [];
  const E = sce.deroule.ecrans;
  if (!DR_MEM.prepares.has(E)) { DR_MEM.prepares.add(E); dr_syncHubLu(sk, sce.deroule); if (typeof _drIdentifierEcrans === 'function') _drIdentifierEcrans(E); dr_normaliserTrame(E, sk); dr_preparer(E); dr_lireSousObjets(sk); return E; }   /* l'empreinte se prend après la lecture : rien ne s'écrit tant que Paul n'a rien modifié */
  dr_invRafraichir(E, sk); dr_preparer(E); return E;
}
/* la vue d'une séance telle que la maquette la lisait (DATA.seances[si] = {titre, ecrans}) : un regard, pas une copie */
function dr_seances(){ if (DR_SEANCES_MESURE) return DR_SEANCES_MESURE; if (dr_pageTableau()) { const s = []; s[(typeof DR_TAB !== 'undefined' && DR_TAB.si) || 0] = { titre: '', ecrans: dr_preparer(dr_tabTrame()) }; return s; } return dr_cles().map(k => dr_vueSeance(k)); }
/* la page tableau (?vue=tableau, E3) n'a pas de chapitre ouvert : elle rend les écrans qu'elle reçoit (DR_TAB.ecrans, posés par dr_tabPoserEcran d'E3) */
function dr_pageTableau(){ return /[?&]vue=tableau(&|$)/.test(location.search); }
function dr_tabTrame(){ return (typeof DR_TAB !== 'undefined' && Array.isArray(DR_TAB.ecrans)) ? DR_TAB.ecrans : []; }
function dr_vueSeance(k){ const sce = dr_seance(k); if (!sce) return { titre: '', ecrans: [] }; let v = DR_MEM.vues.get(sce); if (!v) { v = {}; Object.defineProperty(v, 'titre', { get: () => sce.title || sce.titre || '', enumerable: true }); Object.defineProperty(v, 'ecrans', { get: () => dr_trameDe(k), set: x => { sce.deroule = sce.deroule || {}; sce.deroule.ecrans = x; DR_MEM.prepares.add(x); dr_preparer(x); }, enumerable: true }); Object.defineProperty(v, 'cle', { value: k }); DR_MEM.vues.set(sce, v); } return v; }
function dr_trame(){ /* en préparation : la trame de la séance de la colonne ; en classe : la copie jouée (E2 : dr_trameJouee) */
  if (typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME === 'classe' && typeof dr_trameJouee === 'function') { const t = dr_trameJouee(); if (t) return dr_preparer(t); }
  if (dr_pageTableau()) return dr_preparer(dr_tabTrame());
  const k = (typeof ATVUES !== 'undefined' && ATVUES.snum != null) ? ATVUES.snum : dr_cleSeance(0); return dr_trameDe(k);
}
/* E1 (§12.25 (3)) : l'eid de la diapo de réactivation construite en classe (E4), posé par le socle, stable comme celui de la fin d'heure — une par heure et par séance, jamais un rang */
function dr_eidReactivation(h, sk){ if (sk == null) { try { sk = dr_ctx().snum; } catch (e) {} } return 'react-h' + (+h || 1) + '-s' + (sk != null ? sk : 'x'); }
function dr_poserEidReactivation(e, h, sk){ if (e && e.role === 'reactivation') e.eid = dr_eidReactivation(h != null ? h : e.heure, sk); return e; }
/* cadrage 4 · 2.6 (repris de la maquette, normaliserTrame) : chaque heure se termine par une diapo de rôle « fin » ; écrans sans heure = heure 1 (le site n'a pas encore d'heure prévue) */
function dr_normaliserTrame(E, sk){
  for (let i = E.length - 1; i >= 0; i--) if (E[i] && E[i].role === 'reactivation') E.splice(i, 1);   /* E1 (§12.26 (2)) : la réactivation construite est propre à chaque classe (C/ecrans) — jamais dans le déroulé du chapitre : le prompt n'en écrit pas, l'import la refuse, et si une trame du hub en portait une, l'Atelier ne la montre pas et ne la réécrit pas (dr_derouleDe) */
  E.forEach(e => dr_heureParDefaut(e));
  const heures = [...new Set(E.map(e => e.heure))].sort((a, b) => a - b);
  heures.forEach(h => { const idx = E.map((e, i) => e.heure === h ? i : -1).filter(i => i >= 0); const der = idx[idx.length - 1]; if (der != null && E[der].role === 'fin') return;
    const fin = { eid: 'fin-h' + h + '-s' + (sk != null ? sk : 'x'), /* E1 (relecteur neuf n°2) : stable — elle dépendait de la première diapo : celle-ci déplacée, la note de la fin d'heure restait orpheline au hub. La clé de la séance est celle du hub (/seances/<clé>), pas un rang */ act: 'Fin d\'heure', dur: 5, role: 'fin', comp: [], blocs: [] }; fin.heure = h; Object.defineProperty(fin, 'dr_pose', { value: true });
    E.splice(der + 1, 0, fin); });
  dr_invPoser(E, sk);   /* EX (§12.62 (3)) : les quatre diapos d'ouverture, posées par le site comme la fin d'heure */
}
/* ═══ EX (§12.62 (3), Paul 28/10 « 95 oui ») : LES QUATRE DIAPOS INVARIABLES — posées par le site, comme la fin d'heure.
   Au début de la première séance du chapitre : « présentation du chapitre » puis « plan » ; au début de chaque séance : « présentation de la séance »
   puis « problématique ». Remplies depuis le chapitre (le JSON au hub), avec les mots de la feuille sommaire (`chSommaire`, index.html) : aucune phrase
   nouvelle ; un mot qui manque → la ligne reste vide, et la carte le dit. Hors activité (un rôle), 0 minute. Retirables : le retrait est retenu dans
   `deroule/retraits` (la liste des rôles retirés de la séance). Tant que Paul ne les a pas modifiées, elles ne s'écrivent pas au hub (comme la fin d'heure) :
   elles suivent le chapitre ; modifiées, elles s'écrivent comme toute diapo. Identités stables : `inv-<rôle>-s<clé de séance>`. ═══ */
const DR_INV = ['presentation-chapitre', 'plan', 'presentation-seance', 'problematique'];
const DR_INV_NOM = { 'presentation-chapitre': 'la présentation du chapitre', plan: 'le plan du chapitre', 'presentation-seance': 'la présentation de la séance', problematique: 'la problématique' };
function dr_estInvariable(e){ return !!(e && DR_INV.indexOf(e.role) >= 0); }
function dr_invEid(role, sk){ return 'inv-' + role + '-s' + (sk != null ? sk : 'x'); }
function dr_invPremiere(sk){ try { const c = dr_chapitre(); if (!c || typeof atSeances !== 'function') return false; const l = atSeances(c).filter(p => p.se && p.se.type !== 'sommaire'); return !!l.length && String(l[0].j) === String(sk); } catch (e) { return false; } }
/* les libellés, lus là où la feuille sommaire les lit (jamais recopiés) ; null = le mot manque */
function dr_invCompLib(id){ const t = (typeof CH !== 'undefined' && CH) ? CH.taxo : null; if (!t) return null; let lib = null; ['francaisC4', 'transversales'].forEach(k => (((t.competences || {})[k]) || []).forEach(b => (b.items || []).forEach(i => { if (i.id === id && i.actif !== false && i.libelle) lib = i.libelle; }))); return lib; }
function dr_invNotionLib(id){ let lib = null; try { dr_taxo().forEach(d => d.familles.forEach(f => f.notions.forEach(n => { if (n.id === id) lib = n.eleve || n.prof || null; }))); } catch (e) {} return lib; }
function dr_invEntree(c, niv){ if (!c || !c.entree) return null; try { const l = (typeof chEntreesDuNiveau === 'function' ? chEntreesDuNiveau(niv) : null) || []; const x = l.find(z => z.id === c.entree); if (x) return x.libelle; } catch (e) {} return /[\s'’]/.test(String(c.entree)) ? String(c.entree) : null; }
/* le contenu d'une diapo invariable : { act, blocs, manque: [ce qui manque, dans les mots de Paul] } — lu à chaque fois depuis le chapitre */
function dr_invContenu(role, sk){ const c = dr_chapitre(); const se = dr_seance(sk) || {}; const manque = []; const niv = (typeof AT !== 'undefined' && AT && AT.edChap) ? AT.edChap.level : null; if (!c) return { act: '', blocs: [], manque: ['le chapitre'] };
  const bloc = (txt, el) => ({ t: 'texte', id: 'binv-' + role + '-s' + sk, txt, el });
  const libs = (ids, lire, quoi) => { const ok = [], pas = []; (ids || []).forEach(id => { const l = lire(id); if (l) ok.push(l); else pas.push(id); }); if (pas.length) manque.push(quoi + ' (' + pas.join(', ') + ')'); return ok; };
  if (role === 'presentation-chapitre') { const el = []; const en = dr_invEntree(c, niv); if (en) el.push('Entrée du programme : ' + en); else manque.push('l’entrée du programme');
    const maj = libs(c.competencesMajeures, dr_invCompLib, 'le libellé d’une compétence principale'); if (maj.length) el.push('Compétence(s) principale(s) : ' + maj.join(' · ')); else if (!(c.competencesMajeures || []).length) manque.push('la ou les compétences principales');
    const min = libs(c.competencesMineures, dr_invCompLib, 'le libellé d’une compétence aussi travaillée'); if (min.length) el.push('Aussi travaillées : ' + min.join(' · '));
    if (!String(c.title || '').trim()) manque.push('le titre du chapitre'); return { act: String(c.title || ''), blocs: [bloc('Ce que nous travaillons', el)], manque }; }
  if (role === 'plan') { const types = {}; (typeof CH_TYPES_SEANCE !== 'undefined' ? CH_TYPES_SEANCE : []).forEach(t => { types[t.id] = t.libelle; }); const l = (typeof atSeances === 'function' ? atSeances(c) : []).filter(p => p.se && p.se.type !== 'sommaire');
    const el = l.map((p, n) => (n + 1) + '. ' + String(p.se.title || '') + (p.se.type && (types[p.se.type] || p.se.type) ? ' · ' + (types[p.se.type] || p.se.type) : '')); if (!el.length) manque.push('le plan des séances');
    return { act: 'Le plan du chapitre', blocs: [bloc('', el)], manque }; }
  if (role === 'presentation-seance') { const el = []; const no = libs(se.notions, dr_invNotionLib, 'le libellé d’une notion'); if (no.length) el.push('Notions rencontrées : ' + no.join(' · '));
    const majC = c.competencesMajeures || []; const cs = se.competences || []; const p1 = libs(cs.filter(id => majC.indexOf(id) >= 0), dr_invCompLib, 'le libellé d’une compétence'); const p2 = libs(cs.filter(id => majC.indexOf(id) < 0), dr_invCompLib, 'le libellé d’une compétence');
    if (p1.length) el.push('Compétence(s) principale(s) : ' + p1.join(' · ')); if (p2.length) el.push('Aussi travaillées : ' + p2.join(' · ')); if (!(se.notions || []).length && !cs.length) manque.push('les notions et les compétences de la séance');
    if (!String(se.title || '').trim()) manque.push('le titre de la séance'); return { act: String(se.title || ''), blocs: [bloc('Ce que nous travaillons', el)], manque }; }
  if (role === 'problematique') { const q = String(c.problematique || '').trim(); if (!q) manque.push('la problématique du chapitre'); return { act: 'Notre question', blocs: [bloc('', q ? [q] : [])], manque }; }
  return { act: '', blocs: [], manque }; }
const DR_INV_VU = new WeakMap();   /* la trame → la taxonomie avec laquelle ses diapos invariables ont été remplies (on les remplit de nouveau quand elle arrive) */
function dr_invIntacte(e){ return !!(e && e.dr_inv && e.dr_invCanon === dr_canon(e)); }
function dr_invMarquer(e){ dr_preparer([e]); Object.defineProperty(e, 'dr_invCanon', { value: dr_canon(e), writable: true, configurable: true }); }
function dr_invNeuve(role, sk, h){ const k = dr_invContenu(role, sk); const e = { eid: dr_invEid(role, sk), act: k.act, dur: 0, role, comp: [], blocs: k.blocs, heure: h };
  Object.defineProperty(e, 'dr_pose', { value: true, configurable: true }); Object.defineProperty(e, 'dr_inv', { value: true, configurable: true }); dr_invMarquer(e); return e; }
function dr_invPoser(E, sk){ try { if (sk == null || !Array.isArray(E) || dr_pageTableau()) return; const sce = dr_seance(sk); if (!sce || sce.type === 'sommaire') return;
  const ret = (sce.deroule && Array.isArray(sce.deroule.retraits)) ? sce.deroule.retraits : [];
  for (let i = E.length - 1; i >= 0; i--) if (dr_estInvariable(E[i]) && ret.indexOf(E[i].role) >= 0 && dr_invIntacte(E[i])) E.splice(i, 1);   /* retirée ici ou sur un autre appareil */
  const vraies = E.filter(e => e && !e.dr_pose && e.role !== 'fin' && !dr_estInvariable(e)); if (!vraies.length) return;   /* une séance sans trame n'a pas encore de début */
  const h0 = Math.min(...vraies.map(e => +e.heure || 1)); const voulus = (dr_invPremiere(sk) ? DR_INV : DR_INV.slice(2)).filter(r => ret.indexOf(r) < 0);
  let pos = 0; voulus.forEach(r => { const k = E.findIndex(e => e && e.role === r); if (k >= 0) { pos = k + 1; return; } E.splice(pos, 0, dr_invNeuve(r, sk, h0)); pos++; });
  DR_INV_VU.set(E, (typeof CH !== 'undefined' && CH) ? CH.taxo : null); } catch (e) {} }
/* la taxonomie arrive après la première lecture : les diapos intactes se remplissent de nouveau (les libellés des compétences et des notions) ; celles que Paul a modifiées ne bougent plus */
function dr_invRafraichir(E, sk){ if (!Array.isArray(E)) return;
  for (let q = 0; q < E.length; q++) { const e = E[q]; if (!e || e.dr_inv || DR_INV.indexOf(e.role) < 0 || DR_INV_LU.has(e)) continue; DR_INV_LU.add(e); if (e.eid !== dr_invEid(e.role, sk)) continue;   /* revenue par ↶ (une copie) : redevenue intacte si elle est telle que le chapitre la donne */
    const k = dr_invContenu(e.role, sk); const n = { eid: e.eid, act: k.act, dur: 0, role: e.role, comp: [], blocs: k.blocs }; dr_preparer([n]); const sans = x => dr_canon({ eid: x.eid, act: x.act, dur: x.dur, role: x.role, comp: x.comp, blocs: x.blocs, masquee: x.masquee });
    if (sans(n) === sans(e)) { Object.defineProperty(e, 'dr_pose', { value: true, configurable: true }); Object.defineProperty(e, 'dr_inv', { value: true, configurable: true }); dr_invMarquer(e); } }
  const t = (typeof CH !== 'undefined' && CH) ? CH.taxo : null; if (DR_INV_VU.get(E) === t) return; DR_INV_VU.set(E, t);   /* la taxonomie est arrivée : les intactes se remplissent de nouveau */
  E.forEach(e => { if (!dr_estInvariable(e) || !dr_invIntacte(e)) return; const k = dr_invContenu(e.role, sk); const avant = dr_canon({ act: e.act, blocs: e.blocs }); e.act = k.act; e.blocs = k.blocs; dr_invMarquer(e); if (dr_canon({ act: e.act, blocs: e.blocs }) !== avant && typeof S !== 'undefined' && S.atelier) { try { setTimeout(() => { if (dr_actif()) dr_tout(); }, 0); } catch (x) {} } }); }
const DR_INV_LU = new WeakSet();

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
  DR_MEM.base = DR_MEM.base || {}; DR_MEM.base[sk] = dr_syncBase(dr_derouleDe(sk, true));   /* E1 (§12.60) : la séance telle qu'elle est ici après la lecture — ce qui change ici se compare à elle ; ce qui change ailleurs se compare au hub tel qu'on l'a lu (DR_MEM.hubLu) */
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
  const o = { ecrans: E.filter(e => !(e && e.dr_pose && !e.dr_inv && !(e.blocs || []).length) && !(e && e.role === 'reactivation') && !dr_invIntacte(e)) };   /* la fin d'heure posée à la lecture ne s'écrit que si Paul y a mis quelque chose ; E1 (§12.26 (2)) : jamais une réactivation construite dans B/deroule ; EX (§12.62 (3)) : une diapo d'ouverture que Paul n'a pas modifiée non plus (elle suit le chapitre) */
  { const presents = new Set(E.filter(Boolean).map(e => e.role)); const ret = (Array.isArray(d.retraits) ? d.retraits : []).filter(r => DR_INV.indexOf(r) >= 0 && !presents.has(r)); if (ret.length) o.retraits = ret; }   /* EX (§12.62 (3)) : les diapos d'ouverture retirées par Paul — celles qui sont revenues (↶) n'y sont plus */
  if (acts.length) o.activites = acts; if (Object.keys(notes).length) o.notes = notes; if (Object.keys(travail).length) o.travail = travail;
  if (d.reactivation === 'oui' || d.reactivation === 'non') o.reactivation = d.reactivation;   /* E1 (§12.25 (5)) : le réglage par séance (E2 l'écrit sur B/deroule/reactivation) — porté ici pour que le PUT entier de dr_sauve ne l'efface pas */
  return o;
}

/* ── l'écriture : dr_sauve (débounce 900 ms, comme atDrEnrAuto), témoin « Enregistré à … » (atDrEnrConfirme) ── */
function dr_sauve(){ if (typeof S !== 'undefined' && S.repetition) return; clearTimeout(DR_MEM.minuteur); DR_MEM.minuteur = setTimeout(dr_sauveMaintenant, 900); }
/* E1 (relecteur neuf n°2) : une frappe faite moins de 900 ms avant de quitter la page partait avec elle — quand la page se cache ou se ferme, l'enregistrement en attente part tout de suite (toujours par dr_ecrire) */
function dr_sauveAvantDepart(){ if (DR_MEM.minuteur) { clearTimeout(DR_MEM.minuteur); dr_sauveMaintenant(true); } }
window.addEventListener('pagehide', dr_sauveAvantDepart); window.addEventListener('beforeunload', dr_sauveAvantDepart); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') dr_sauveAvantDepart(); });
function dr_copieDepuisAtelier(){ /* E1 (relecture continue E4, 20:50, grave — perte de données) : en heure lancée, une retouche faite dans l'onglet Atelier part au hub en 900 ms, dans la copie de la classe (C/ecrans), sans attendre le retour au Pilotage ; jamais dans la trame */
  try { if (typeof dr_cheminC !== 'function' || !dr_cheminC() || typeof AT_DR_REGIME === 'undefined' || AT_DR_REGIME !== 'classe') return; const ecr = JSON.parse(JSON.stringify(seance().ecrans));
    dr_ecrire(dr_cheminC() + '/ecrans', ecr, 'Séance en classe — retouche dans l’atelier', () => { if (typeof dr_temoinEnregistre === 'function') dr_temoinEnregistre(); if (typeof DR_CL === 'object' && DR_CL && typeof dr_empreinte === 'function') DR_CL.empreinteEcrite = dr_empreinte(ecr); }); } catch (e) {} }
/* ═══ E1 (§12.60, E3 retour 104 ; la règle de Paul du 04/10 : « un html doit toujours s'actualiser en interne ») : L'ATELIER SUR DEUX APPAREILS ═══
   Avant : l'Atelier ne relisait jamais le chapitre et chaque enregistrement réécrivait le `deroule` entier de la séance — le dernier appareil effaçait l'autre sans le dire.
   Désormais : (1) la séance ouverte est relue toutes les 3 s (le site lit le hub par `dr_lire`, sans flux) et ce qui a changé ailleurs paraît aussitôt — sauf sous un
   geste en cours (un texte où Paul écrit, un menu ouvert, un appui) : alors au tour suivant. (2) L'enregistrement relit le hub, puis n'écrit que les diapos changées ici,
   à leur place (`deroule/ecrans/<n>`, retrouvée par l'`eid`), et les sous-objets changés (activités, notes, travail) ; si la même diapo a changé ici ET ailleurs depuis la
   dernière lecture, rien n'est écrit pour elle : le site le dit à Paul, en clair, avec « Garder la mienne » / « Prendre celle de l'autre appareil ». Un changement de
   structure (diapo ajoutée, retirée, déplacée) écrit la liste entière, après avoir repris d'abord les diapos changées ailleurs. */
function dr_canon(x){ if (Array.isArray(x)) return '[' + x.map(dr_canon).join(',') + ']'; if (x && typeof x === 'object') return '{' + Object.keys(x).filter(k => x[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + dr_canon(x[k])).join(',') + '}'; return JSON.stringify(x === undefined ? null : x); }
function dr_syncListe(v){ return Array.isArray(v) ? v.filter(Boolean) : (v && typeof v === 'object') ? Object.keys(v).sort((a, b) => (+a) - (+b)).map(k => v[k]).filter(Boolean) : []; }
/* l'heure d'une diapo que le hub ne porte pas se déduit ici (le partage par les durées) : la base et le hub la prennent de l'appareil, sinon chaque diapo paraîtrait changée */
const dr_syncAH = e => Object.prototype.propertyIsEnumerable.call(e, 'heure') && e.heure != null;   /* l'heure par défaut (dr_heureParDefaut) n'est pas une donnée : elle ne s'écrit pas */
function dr_syncH(o){ const m = {}; dr_syncListe(o && o.ecrans).forEach(e => { if (e && e.eid && dr_syncAH(e)) m[e.eid] = e.heure; }); return m; }
function dr_syncBaseVue(B, H){ Object.keys(B.sansH || {}).forEach(eid => { if (H[eid] == null || B.el[eid] == null) return; const x = JSON.parse(B.el[eid]); if (x.heure == null) x.heure = H[eid]; B.el[eid] = dr_canon(x); delete B.sansH[eid]; }); }
function dr_syncBase(o, H){ const E = dr_syncListe(o && o.ecrans); const el = {}, sansH = {}; E.forEach(e => { if (!e || !e.eid) return; let x = e; if (!dr_syncAH(e)) { if (H && H[e.eid] != null) x = Object.assign({}, e, { heure: H[e.eid] }); else sansH[e.eid] = true; } el[e.eid] = dr_canon(x); }); return { sansH, ordre: E.map(e => e && e.eid).join('|'), el, activites: dr_canon((o && o.activites) || null), notes: dr_canon((o && o.notes) || null), travail: dr_canon((o && o.travail) || null), retraits: dr_canon((o && o.retraits) || null) }; }
const DR_SYNC = { conflits: {}, T: null, lecture: false };
function dr_syncGeste(){ const a = document.activeElement; if (a && a.closest && a.closest('#dr-zone, #volet') && (a.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(a.tagName))) return true; if (typeof DR_COL !== 'undefined' && (DR_COL.glisse || DR_COL.renomme)) return true;   /* EX (§12.62 (4)) : un glisser ou un renommage dans la colonne est un geste en cours */ if (document.querySelector('.choix-obj, #menuplus.on, .menu-at.on, .ctx-menu, #at-ctx, .dr-menu.on')) return true; return !!(typeof DR_VOLET !== 'undefined' && DR_VOLET.vig); }
function dr_syncConflit(k, eid, distante){ DR_SYNC.conflits[eid] = { k, distante }; dr_syncDire(); }
function dr_syncDire(){ let z = document.getElementById('dr-conflit'); const l = Object.keys(DR_SYNC.conflits); if (!l.length) { if (z) z.remove(); return; }
  if (!z) { z = document.createElement('div'); z.id = 'dr-conflit'; z.style.cssText = 'position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:99999;max-width:640px;background:#2a2014;color:#f0e7db;border:1px solid #c9a04a;border-radius:10px;padding:10px 14px;font:14px/1.4 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.4)'; document.body.appendChild(z); }
  z.innerHTML = l.map(eid => { const c = DR_SYNC.conflits[eid]; const E = (dr_seance(c.k) || {}).deroule ? dr_seance(c.k).deroule.ecrans : []; const e = (E || []).find(x => x && x.eid === eid) || c.distante || {}; return `<div data-cf="${dr_esc(eid)}" style="margin:4px 0">⚠ La diapo « ${dr_esc(e.act || '')} » a été modifiée sur un autre appareil pendant que tu la modifiais ici : rien n’est effacé, ta version n’est pas encore enregistrée. <button class="btn" data-cf-moi="${dr_esc(eid)}" title="Enregistre ta version : celle de l’autre appareil est remplacée">Garder la mienne</button> <button class="btn" data-cf-autre="${dr_esc(eid)}" title="Prend la version de l’autre appareil : ta modification de cette diapo est abandonnée">Prendre celle de l’autre appareil</button></div>`; }).join('');
  z.querySelectorAll('[data-cf-moi]').forEach(b => b.onclick = () => { const eid = b.dataset.cfMoi, c = DR_SYNC.conflits[eid]; delete DR_SYNC.conflits[eid]; const Hl = DR_MEM.hubLu && DR_MEM.hubLu[c.k]; if (Hl && c.distante) Hl.el[eid] = dr_canon(c.distante); DR_MEM.empreintes[c.k] = ''; dr_syncDire(); dr_sauve(); });
  z.querySelectorAll('[data-cf-autre]').forEach(b => b.onclick = () => { const eid = b.dataset.cfAutre, c = DR_SYNC.conflits[eid]; delete DR_SYNC.conflits[eid]; dr_syncPoser(c.k, eid, c.distante); dr_syncDire(); try { dr_tout(); } catch (e) {} }); }
/* deux références par séance : DR_MEM.hubLu[k] (le hub tel qu'on l'a lu ou écrit — ce qui change ailleurs s'y compare) et DR_MEM.base[k] (la séance ici après lecture — ce qui change ici s'y compare). La lecture range et complète la séance (fins d'heure, heures) : les deux formes ne se comparent jamais entre elles. */
function dr_syncHubLu(k, d){ try { DR_MEM.hubLu = DR_MEM.hubLu || {}; DR_MEM.hubLu[k] = dr_syncBase(JSON.parse(JSON.stringify(d || {}))); DR_MEM.hubLu[k].cles = dr_syncCles(d); } catch (e) {} }
function dr_syncCles(d){ const E = d && d.ecrans, m = {}; if (!E || typeof E !== 'object') return m; (Array.isArray(E) ? E.map((x, i) => i) : Object.keys(E)).forEach(q => { if (E[q] && E[q].eid) m[E[q].eid] = String(q); }); return m; }
/* pose une diapo venue du hub à la place de la nôtre (même eid) */
function dr_syncPoser(k, eid, distante){ const sce = dr_seance(k); if (!sce || !sce.deroule || !distante) return false; const E = sce.deroule.ecrans; const i = E.findIndex(e => e && e.eid === eid); if (i < 0) return false;
  E[i] = JSON.parse(JSON.stringify(distante)); dr_preparer(E); const B = DR_MEM.base[k]; if (B) { B.el[eid] = dr_canon(E[i]); if (!dr_syncAH(E[i])) (B.sansH = B.sansH || {})[eid] = true; else delete (B.sansH || {})[eid]; } const Hl = DR_MEM.hubLu && DR_MEM.hubLu[k]; if (Hl) Hl.el[eid] = dr_canon(distante); DR_MEM.empreintes[k] = JSON.stringify(dr_derouleDe(k, true)); return true; }
/* la lecture : ce que le hub a de neuf pour la séance k (comparé au hub lu), et ce qu'on a changé ici (comparé à la base) */
function dr_syncComparer(k, rv, appliquer){ const B = DR_MEM.base && DR_MEM.base[k], Hl = DR_MEM.hubLu && DR_MEM.hubLu[k]; if (!B || !Hl || !rv) return { change: false };
  const lo = dr_derouleDe(k, true); dr_syncBaseVue(B, dr_syncH(lo)); const R = dr_syncBase(rv), L = dr_syncBase(lo); const RE = dr_syncListe(rv.ecrans); let change = false;
  const localTouche = L.ordre !== B.ordre || Object.keys(L.el).some(eid => L.el[eid] !== B.el[eid]);
  if (R.ordre !== Hl.ordre) { /* la structure a changé ailleurs */
    if (!localTouche && appliquer) { const sce = dr_seance(k); sce.deroule.ecrans.splice(0, sce.deroule.ecrans.length, ...JSON.parse(JSON.stringify(RE))); ['activites', 'notes', 'travail', 'retraits'].forEach(n => { if (rv[n] !== undefined) sce.deroule[n] = JSON.parse(JSON.stringify(rv[n])); else delete sce.deroule[n]; }); const E = sce.deroule.ecrans; if (typeof _drIdentifierEcrans === 'function') _drIdentifierEcrans(E); dr_normaliserTrame(E, k); dr_preparer(E); dr_lireSousObjets(k); DR_MEM.hubLu[k] = R; R.cles = dr_syncCles(rv); return { change: true }; }
    return { change: false, structure: true }; }
  RE.forEach(e => { const eid = e && e.eid; if (!eid || R.el[eid] === Hl.el[eid]) return;
    if (L.el[eid] === B.el[eid]) { if (appliquer && dr_syncPoser(k, eid, e)) change = true; }
    else if (!DR_SYNC.conflits[eid]) dr_syncConflit(k, eid, e); });
  ['activites', 'notes', 'travail', 'retraits'].forEach(n => { if (R[n] !== Hl[n] && L[n] === B[n] && appliquer) { const sce = dr_seance(k); if (rv[n] !== undefined) sce.deroule[n] = JSON.parse(JSON.stringify(rv[n])); else delete sce.deroule[n]; if (n === 'retraits') { dr_invPoser(sce.deroule.ecrans, k); dr_preparer(sce.deroule.ecrans); }   /* EX (§12.62 (3)) : retirée (ou remise) sur l'autre appareil */ const d = DR_MEM.hubLu[k]; dr_lireSousObjets(k); d[n] = R[n]; DR_MEM.hubLu[k] = d; change = true; } });
  return { change }; }
function dr_syncLire(){ try { if (DR_SYNC.lecture || typeof S === 'undefined' || !S.atelier || S.repetition || !dr_actif() || dr_ctx().regime === 'classe') return; const k = (typeof ATVUES !== 'undefined' && ATVUES.snum != null) ? String(ATVUES.snum) : null; if (k == null || !DR_MEM.base || !DR_MEM.base[k]) return;
  if (DR_MEM.minuteur || dr_syncGeste()) return;   /* un enregistrement en attente, ou un geste en cours : au tour suivant (rien sous le geste) */
  DR_SYNC.lecture = true; dr_lire(dr_cheminBDe(k) + '/deroule', rv => { DR_SYNC.lecture = false; if (!rv || DR_MEM.minuteur || dr_syncGeste()) return; const r = dr_syncComparer(k, rv, true); if (r.change) { try { dr_tout(); } catch (e) {} } }); } catch (e) { DR_SYNC.lecture = false; } }
setInterval(dr_syncLire, 3000);
/* la place d'une diapo au hub (le hub n'est pas rangé comme ici : la lecture range) */
function dr_syncCleHub(rv, eid){ const q = dr_syncCles(rv)[eid]; return q == null ? null : q; }
/* l'écriture : relire, reprendre ce qui a changé ailleurs, puis n'écrire que nos changements */
function dr_syncEcrire(k, o, depart){ const B = DR_MEM.base && DR_MEM.base[k]; const chemin = dr_cheminBDe(k) + '/deroule'; const fini = () => { if (typeof atDrEnrConfirme === 'function') atDrEnrConfirme(true); if (typeof dr_temoinEnregistre === 'function') dr_temoinEnregistre(); };
  const tout = () => { const sce = dr_seance(k); const o2 = dr_derouleDe(k, true); const val = Object.assign({}, sce.deroule, o2, { maj: Date.now() }); if (!o2.activites) delete val.activites; if (!o2.notes) delete val.notes; if (!o2.travail) delete val.travail; if (!o2.retraits) delete val.retraits; sce.deroule.maj = val.maj;
    const ecrit = JSON.parse(JSON.stringify(val)); dr_ecrire(chemin, ecrit, 'Trame du déroulé — séance ' + k, fini); DR_MEM.base[k] = dr_syncBase(o2); DR_MEM.hubLu = DR_MEM.hubLu || {}; DR_MEM.hubLu[k] = dr_syncBase(ecrit); DR_MEM.hubLu[k].cles = dr_syncCles(ecrit); DR_MEM.empreintes[k] = JSON.stringify(o2); };
  if (!B || !DR_MEM.hubLu || !DR_MEM.hubLu[k]) { DR_MEM.base = DR_MEM.base || {}; tout(); return; }
  const ecrire = rv => { const Hl = DR_MEM.hubLu[k]; const o2 = dr_derouleDe(k, true); dr_syncBaseVue(B, dr_syncH(o2)); const R = rv ? dr_syncBase(rv) : Hl; const cles = rv ? dr_syncCles(rv) : (Hl.cles || {}); if (rv) Hl.cles = cles;
    if (rv) dr_syncComparer(k, rv, false);   /* les conflits se disent ; rien n'est posé pendant l'écriture */
    const L = dr_syncBase(o2); const LE = dr_syncListe(o2.ecrans);
    if (L.ordre !== B.ordre) { /* réorganisée ici : la séance entière, après avoir repris ce qui a changé ailleurs, diapo par diapo */
      if (R.ordre !== Hl.ordre) { dr_syncDireStructure(); return; }
      if (rv) dr_syncListe(rv.ecrans).forEach(e => { const eid = e && e.eid; if (eid && R.el[eid] !== Hl.el[eid] && L.el[eid] === B.el[eid]) dr_syncPoser(k, eid, e); }); tout(); return; }
    let n = 0, manque = false; LE.forEach(e => { const eid = e && e.eid; if (!eid || L.el[eid] === B.el[eid] || DR_SYNC.conflits[eid]) return; if (R.el[eid] !== Hl.el[eid]) return;   /* changée ailleurs aussi : le conflit est dit, rien n'est écrit */
      const q = cles[eid]; if (q == null) { manque = true; return; } const ecrit = JSON.parse(JSON.stringify(e)); dr_ecrire(chemin + '/ecrans/' + q, ecrit, 'Trame du déroulé — séance ' + k + ', une diapo', () => {}); B.el[eid] = L.el[eid]; delete (B.sansH || {})[eid]; Hl.el[eid] = dr_canon(ecrit); n++; });
    if (manque) { tout(); return; }   /* une diapo d'ici que le hub n'a pas (la fin d'heure où Paul a écrit) : la séance entière */
    ['activites', 'notes', 'travail', 'retraits'].forEach(nm => { if (L[nm] !== B[nm] && R[nm] === Hl[nm]) { const v = o2[nm] ? JSON.parse(JSON.stringify(o2[nm])) : null; dr_ecrire(chemin + '/' + nm, v, 'Trame du déroulé — séance ' + k + ', ' + nm, () => {}); B[nm] = L[nm]; Hl[nm] = dr_canon(v); n++; } });
    if (n) { const m = Date.now(); const sce = dr_seance(k); if (sce && sce.deroule) sce.deroule.maj = m; dr_ecrire(chemin + '/maj', m, 'Trame du déroulé — séance ' + k, fini); } else fini();
    DR_MEM.empreintes[k] = JSON.stringify(o2); };
  if (depart) ecrire(undefined); else dr_lire(chemin, v => ecrire(v || undefined)); }   /* la page part : pas le temps de relire — le hub tel qu'on l'a lu en dernier */
function dr_syncDireStructure(){ try { toast('La séance a changé de forme sur un autre appareil pendant que tu la réorganisais ici : rien n’est effacé — recharge la page pour voir l’autre version, ta réorganisation reste ici tant que tu ne recharges pas.'); } catch (e) {} }
function dr_sauveMaintenant(depart){
  DR_MEM.minuteur = null; if (typeof S !== 'undefined' && S.repetition) return;
  if (dr_ctx().regime === 'classe') { if (S.atelier && S.lancee && !S.close) { dr_copieDepuisAtelier(); return; } if (typeof dr_copieAuto === 'function') dr_copieAuto(); return; }   /* en classe : la copie jouée (E2) ; l'atelier ouvert pendant l'heure l'écrit lui-même (dr_copieAuto se tait tant que l'atelier est ouvert) */
  if (!dr_chapitre()) return;
  let n = 0; dr_cles().forEach(k => { const sce = dr_seance(k); if (!sce || !sce.deroule || !DR_MEM.prepares.has(sce.deroule.ecrans)) return;
    const o = dr_derouleDe(k); const j = JSON.stringify(o); if (DR_MEM.empreintes[k] === j) return; DR_MEM.empreintes[k] = j; n++;
    if (o.activites) sce.deroule.activites = o.activites; if (o.notes) sce.deroule.notes = o.notes; if (o.travail) sce.deroule.travail = o.travail; if (o.retraits) sce.deroule.retraits = o.retraits; else delete sce.deroule.retraits;   /* EX (§12.62 (3)) */
    dr_syncEcrire(k, o, depart);   /* E1 (§12.60) : seulement ce qui a changé, diapo par diapo (à son eid), après avoir relu le hub — jamais la séance entière par-dessus un autre appareil */
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
/* E1 (§12.38-1, registres 13 · 79, 13 · 81 ; Paul 27/10 23:03 « jouer en avance prend toujours les Dylan ») : LA SOURCE UNIQUE de la classe, de l'heure n/N
   et de la date hors d'une heure lancée — la prochaine case de CETTE séance (par sa clé, §12.39) à l'emploi du temps, parmi les classes pour qui elle est (§12.35).
   L'en-tête de l'Atelier et la répétition la disent ; E4 l'affiche dans la colonne (§12.36 (5)). Le nom de la classe se clique : `dr_choisirClasse(slug)` prend une autre
   classe de la séance (sa prochaine case). Sans case dans la projection : la première classe pour qui la séance est, `aEdt: false` (« pas encore à l'emploi du temps »).
   Jamais « la première classe du niveau » en silence. Rend { classeSlug, classeNom, iso, creneau, heure, sur, date, classes: [{slug, nom}], aEdt, choisie } ou null (pas de séance ouverte). */
function dr_sourceSeance(){ try {
  const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || null; const sk = (typeof ATVUES !== 'undefined' && ATVUES && ATVUES.snum != null) ? String(ATVUES.snum) : null; if (!ec || sk == null || typeof chapitresData === 'undefined') return null;
  const ch = (chapitresData[ec.level] || {})[ec.chnum]; const se = ch && ch.seances && ch.seances[sk]; if (!se) return null;
  const cleS = ec.level + '|' + ec.chnum + '|' + sk; const ch0 = DR_MEM.classeChoisie && DR_MEM.classeChoisie.cle === cleS ? DR_MEM.classeChoisie.slug : null;
  const edtPret = (typeof dr_edtPret === 'function' ? dr_edtPret() : (typeof EDT_CHAP !== 'undefined' && EDT_CHAP && !!EDT_CHAP[ec.level])) && typeof edtProjeter === 'function';
  if (!edtPret && typeof dr_edtAssurer === 'function' && !DR_MEM.edtDemande) { DR_MEM.edtDemande = true; try { dr_edtAssurer(); } catch (e) {} }   /* l'emploi du temps se lit une fois ; la source se refait quand il est là */
  const d = new Date(); const iso0 = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const cle = cleS + '|' + (ch0 || '') + '|' + (edtPret ? 1 : 0) + '|' + iso0 + '|' + Math.floor(Date.now() / 30000) + '|' + JSON.stringify(se.classes || null);
  const M = DR_MEM.source; if (M && M.cle === cle) return M.v;
  const nomDe = sl => { try { return (classesData[sl] && classesData[sl].nom) || sl; } catch (e) { return sl; } };
  const classes = (typeof _lvlClasses === 'function' ? (_lvlClasses(ec.level) || []) : []).map(k => typeof k === 'object' ? (k.slug || k.id) : k).filter(Boolean)
    .filter(sl => typeof edtSeancePour !== 'function' || edtSeancePour(se, nomDe(sl))).map(sl => ({ slug: sl, nom: nomDe(sl) }));
  let cs = []; if (edtPret) { try { cs = Object.values(edtProjeter(iso0, 70) || {}).filter(c => c && c.nature === 'prevu' && c.classeMjpc && String(c.chCle) === String(ec.chnum) && String(c.snum) === sk).sort((a, b) => (a.iso + a.creneau).localeCompare(b.iso + b.creneau)); } catch (e) { cs = []; } }
  const slugDe = n => (typeof edtCleClasse === 'function' ? edtCleClasse(n) : n);
  const c0 = ch0 ? cs.find(c => slugDe(c.classeMjpc) === ch0) : cs.find(c => classes.some(x => x.slug === slugDe(c.classeMjpc))) || cs[0];
  let v;
  if (c0) { const sl = slugDe(c0.classeMjpc); const [y, mo, j] = c0.iso.split('-').map(Number); const dt = new Date(y, mo - 1, j);
    v = { classeSlug: sl, classeNom: nomDe(sl), iso: c0.iso, creneau: c0.creneau, heure: c0.heure || 1, sur: c0.sur || 1, date: dt.toLocaleDateString('fr-FR', { weekday: 'short' }) + ' ' + String(j).padStart(2, '0') + '/' + String(mo).padStart(2, '0') + ' ' + String(c0.creneau).split('-')[0], classes, aEdt: true, choisie: !!ch0 }; }
  else { const sl = ch0 || (classes[0] && classes[0].slug) || null; v = { classeSlug: sl, classeNom: sl ? nomDe(sl) : '', iso: null, creneau: null, heure: null, sur: null, date: '', classes, aEdt: false, choisie: !!ch0 }; }
  DR_MEM.source = { cle, v }; return v; } catch (e) { return null; } }
function dr_sourceTexte(src){ src = src || dr_sourceSeance(); if (!src) return ''; return src.aEdt ? ('heure ' + src.heure + '/' + src.sur + ' · ' + src.date) : 'pas encore à l’emploi du temps'; }
function dr_choisirClasse(slug){ const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || null; if (!ec || typeof ATVUES === 'undefined' || ATVUES.snum == null) return; DR_MEM.classeChoisie = { cle: ec.level + '|' + ec.chnum + '|' + String(ATVUES.snum), slug }; DR_MEM.source = null; DR_MEM.heuresAVenir = {}; try { dr_hclasseMaj(); } catch (e) {} try { dr_tout(); } catch (e) {} }
/* le nom de la classe se clique (hors d'une heure lancée) : les autres classes de la séance */
function dr_hclasseMenu(ev){ try { if (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && AT_DR_COURS.classeSlug) return; const src = dr_sourceSeance(); if (!src || src.classes.length < 2) return; if (ev) ev.stopPropagation();
  let m = document.getElementById('dr-classes-choix'); if (m) { m.remove(); return; } m = document.createElement('div'); m.id = 'dr-classes-choix'; const r = (ev && ev.currentTarget || document.getElementById('hclasse')).getBoundingClientRect();
  m.style.cssText = 'position:fixed;z-index:9999;left:' + Math.round(r.left) + 'px;top:' + Math.round(r.bottom + 4) + 'px;background:var(--carte2,#241e17);border:1px solid var(--bord2,#4a3d2f);border-radius:8px;padding:4px;display:flex;flex-direction:column;gap:2px';
  m.innerHTML = src.classes.map(c => `<button class="btn" data-cl="${dr_esc(c.slug)}" title="Prend ${dr_esc(c.nom)} : sa prochaine heure de cette séance à l’emploi du temps — la classe, l’heure n/N et la date de l’Atelier et de la répétition"${c.slug === src.classeSlug ? ' style="font-weight:700"' : ''}>${dr_esc(c.nom)}</button>`).join('');
  m.querySelectorAll('[data-cl]').forEach(b => b.onclick = e => { e.stopPropagation(); m.remove(); dr_choisirClasse(b.dataset.cl); });
  document.body.appendChild(m); setTimeout(() => document.addEventListener('click', function f(){ document.removeEventListener('click', f); const x = document.getElementById('dr-classes-choix'); if (x) x.remove(); }), 0); } catch (e) {} }
/* E1 (§12.51, Paul 28/10 10:17 : « en répétition, je dois bien évidemment voir mes élèves de la classe test (charles de gaulle) à droite ») : la classe des gestes d'élève en répétition */
function dr_classeTest(){ try { if (typeof classesData === 'undefined' || !classesData) return {}; const k = (typeof edtCleClasse === 'function' && edtCleClasse('3E Charles de Gaulle')) || ''; if (classesData[k]) return classesData[k]; const k2 = Object.keys(classesData).find(x => /charles de gaulle/i.test(String((classesData[x] || {}).nom || x))); return (k2 && classesData[k2]) || classesData['CLASSE TEST'] || {}; } catch (e) { return {}; } }
function dr_classe(){
  const c = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) || null; const src = (c && c.classeSlug) ? null : dr_sourceSeance(); const slug = (c && c.classeSlug) || (src && src.classeSlug) || DR_MEM.classeSlug || dr_classeDuNiveau();   /* E1 (§12.38-1) : hors d'une heure lancée, la classe de la source unique (la prochaine case de la séance) — avant : la dernière vue, sinon la première du niveau */   /* la classe du niveau du chapitre (E2 propose la sienne par dr_classeProposee, qui lit dr_classe) */
  const cl = (slug && typeof classesData !== 'undefined' && (classesData[slug] || (typeof edtCleClasse === 'function' && classesData[edtCleClasse(slug)]))) || {};   /* E1 (§12.31-1 bis) : un nom passé pour une clé se résout comme dans l'emploi du temps */
  /* E4 (§12.38 (2), Paul 23:16) : en répétition, les gestes d'élève se jouent sur les élèves de « CLASSE TEST » (quatre élèves inventés), jamais sur ceux d'une vraie classe
     (ni « _TEST », copié d'une classe réelle) ; la classe de l'heure répétée (son nom, sa réactivation, ses heures) reste celle-ci */
  const rep = typeof S !== 'undefined' && S && S.repetition; const clEl = rep ? dr_classeTest() : cl;   /* E1 (§12.51, Paul 10:17) : la classe test est 3E Charles de Gaulle — avant : le nœud « CLASSE TEST » (quatre élèves inventés) */
  const eleves = (typeof extractEleves === 'function' && clEl && Object.keys(clEl).length) ? (extractEleves(clEl) || []) : ((clEl.eleves) || []);
  const cleEl = (rep ? 'classe-test|' : '') + slug;
  if (slug !== DR_MEM.classeSlug || cleEl !== DR_MEM.elevesDe || ELEVES.length !== eleves.length) { DR_MEM.classeSlug = slug; DR_MEM.elevesDe = cleEl; ELEVES.length = 0; eleves.forEach(n => ELEVES.push(n)); dr_initiales(); }
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
/* E4 (§12.55) : L'HORLOGE DE LA CASE, pour la classe test 3E Charles de Gaulle seulement. Lancée à n'importe quel moment, l'heure part
   de l'horaire de sa case (08:57 pour 08:57-09:52) puis avance avec la montre : now() porte le décalage, et tout ce qui vit du temps
   dans l'heure le suit (l'heure affichée, le compte à rebours, le T-5, « l'heure dépasse », l'échéance proposée). Toutes les autres
   classes, la répétition et l'Atelier : l'horloge vraie. « aller à 5 minutes de la fin » fait sauter cette horloge à T-5. */
const DR_HC = { cle: null, dec: 0, saut: 0 };
function dr_horlogeCase(){ try {
  if (typeof S === 'undefined' || !S || !S.lancee || S.repetition || S.atelier && !S.lancee) return null;
  const c = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) || null; if (!c || !/charles\s+de\s+gaulle/i.test(String(c.classeNom || c.classeSlug || ''))) return null;
  const hj = (S.heuresCours || {})[S.heure] || null; const deb = String((hj && hj.debut) || String(c.creneau || '').split('-')[0] || c.debut || ''); const m = /^(\d{1,2}):(\d{2})/.exec(deb); if (!m) return null;
  const t0r = +S.debutReel || 0; if (!t0r) return null; const cle = [c.classeSlug, S.heure, deb, t0r].join('|');
  if (DR_HC.cle !== cle) { const d = new Date(t0r); DR_HC.cle = cle; DR_HC.dec = new Date(d.getFullYear(), d.getMonth(), d.getDate(), +m[1], +m[2]).getTime() - t0r; DR_HC.saut = 0; DR_HC.debut = deb; }
  return DR_HC; } catch (e) { return null; } }
function now(){ const h = dr_horlogeCase(); return Date.now() + (h ? h.dec + h.saut : 0); }   /* E1 : l'horloge réelle (la maquette : HEURES_SIM[S.heure].base + DECALAGE) ; E4 (§12.55) : + le décalage de la case des De Gaulle */
function dr_allerT5(){ const h = dr_horlogeCase(); if (!h || S.close || typeof heureCahier !== 'function') return; const cible = heureCahier() - 5 * 60000 + 1500; const ici = now(); if (cible > ici) h.saut += cible - ici; }
/* l'en-tête des De Gaulle : « horloge de la case : 08:57 (il est 10:53) » et le bouton — posés une fois, puis seul leur texte change (la règle du redessin, §12.56 (1)) */
function dr_horlogeCaseAfficher(){ try {
  const ch = document.querySelector('#dr-zone .haut .chrono'); if (!ch) return; const h = dr_horlogeCase();
  let t = document.getElementById('dr-hcase'), b = document.getElementById('dr-t5'), f = document.getElementById('bfin');
  if (!h) { if (t && t.style.display !== 'none') t.style.display = 'none'; if (b && b.style.display !== 'none') b.style.display = 'none'; if (f && f.classList.contains('dr-creneau-fini')) f.classList.remove('dr-creneau-fini'); return; }
  if (!t) { t = document.createElement('span'); t.id = 'dr-hcase'; t.className = 'dr-hcase'; t.title = 'Classe test : l’heure suit l’horloge de sa case, pas celle de ta montre — tu essaies le flux de la classe à n’importe quel moment. Toutes les autres classes : l’heure vraie.'; ch.insertAdjacentElement('afterend', t); }
  if (!b) { b = document.createElement('button'); b.id = 'dr-t5'; b.className = 'btn'; b.textContent = '⏩ aller à 5 minutes de la fin'; b.title = 'Classe test seulement : l’horloge de la case saute à 5 minutes avant le cahier de textes — l’alerte de fin d’heure part comme en classe, la séquence de fin s’ouvre. Rien n’est écrit pour une vraie classe.'; b.addEventListener('click', dr_allerT5); t.insertAdjacentElement('afterend', b); }
  const txt = 'horloge de la case : ' + hhmm(now()) + ' (il est ' + new Date().toLocaleTimeString('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }) + ')';
  if (t.textContent !== txt) t.textContent = txt; if (t.style.display === 'none') t.style.display = ''; const vb = S.close ? 'none' : ''; if (b.style.display !== vb) b.style.display = vb;
  if (f && typeof heureCahier === 'function') { const fini = !S.close && now() >= heureCahier() + 5 * 60000; if (fini !== f.classList.contains('dr-creneau-fini')) { f.classList.toggle('dr-creneau-fini', fini); if (fini) { f.dataset.drT0 = f.title; f.title = 'Le créneau de la case est fini (' + String((((S.heuresCours || {})[S.heure]) || {}).fin || '') + ') : fais la fin de l’heure, puis clos-la.'; } else if (f.dataset.drT0 != null) { f.title = f.dataset.drT0; delete f.dataset.drT0; } } }
} catch (e) {} }
setInterval(dr_horlogeCaseAfficher, 1000);

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
/* E1 (§12.61 (2)) : plus de « ▶ Lancer l'heure » au Pilotage — l'heure se lance par la case de l'emploi du temps (edtLancer → dr_lancer) */
/* ── les boîtes du site (atModaleChoix) à la place de celles du navigateur (cadrage n°7, T1 : « les confirm() natifs → modales MJPC ») ── */
/* E1 (R21) les images vivent dans mjpc-medias ; la trame garde l'adresse complète, Paul ne voit et ne tape que la relative (3.2) */
const DR_MEDIAS = 'https://siteflow-io.github.io/mjpc-medias/';
const DR_MEDIAS_2 = 'https://siteflow-io.github.io/mjpc-medias-2/';   /* E4 (§12.49 (4), (6)) : le deuxième dépôt, dit par le préfixe « m2: » du chemin relatif */
function dr_mediasAdresse(rel){ const r = String(rel || '').trim().replace(/^\/+/, ''); const m = /^m2:\/*(.*)$/.exec(r); return m ? DR_MEDIAS_2 + m[1] : DR_MEDIAS + r; }   /* la SEULE fonction qui écrit l'adresse de mjpc-medias (l'Atelier, l'import, le site) */
function dr_refRelative(ref){ const r = String(ref || ''); if (r.indexOf(DR_MEDIAS_2) === 0) return 'm2:' + r.slice(DR_MEDIAS_2.length); return r.replace(DR_MEDIAS, ''); }
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
function dr_suivreBarre(v){ if (typeof ATVUES !== 'undefined') { ATVUES.vue = v; if (typeof atVuesRetenir === 'function') atVuesRetenir(); } if (typeof atVuesMarquer === 'function') atVuesMarquer(v); }
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
/* E1 (§12.27-8, dette 13 · 38) : #hclasse dit la classe de l'heure — celle d'AT_DR_COURS (posée par E2 au lancement, à la reprise, à l'ouverture
   « Où en est la classe ») —, et avant tout lancement la classe proposée (celle que dit « ▶ Lancer avec … », dr_proposer d'E2) ; suivie au rendu et à la seconde */
function dr_hclasseNom(leger){ try { if (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && (AT_DR_COURS.classeNom || AT_DR_COURS.classeSlug)) return AT_DR_COURS.classeNom || AT_DR_COURS.classeSlug; } catch (e) {} if (leger) return null; try { if (typeof dr_proposer === 'function') { const p = dr_proposer(); if (p && p.classeNom) return p.classeNom; } } catch (e) {} return dr_classe().nom; }
function dr_hclasseMaj(leger){ const hc = document.getElementById('hclasse'); if (!hc) return; const n = dr_hclasseNom(leger); if (n == null) return; if (hc.textContent !== n) hc.textContent = n;
  /* E1 (§12.38-1) : hors d'une heure lancée, le nom se clique (les autres classes de la séance) et l'en-tête dit l'heure n/N et la date de la source */
  const enCours = typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && AT_DR_COURS.classeSlug; const src = enCours ? null : dr_sourceSeance();
  if (!enCours && src) { if (!hc._drMenu) { hc._drMenu = true; hc.onclick = dr_hclasseMenu; } const t = src.classes.length > 1 ? 'Les classes de cette séance : clique pour en prendre une autre — l’Atelier et la répétition prennent sa prochaine heure à l’emploi du temps' : 'La classe de cette séance : sa prochaine heure à l’emploi du temps'; if (hc.title !== t) hc.title = t; hc.style.cursor = src.classes.length > 1 ? 'pointer' : '';
    const ho = document.getElementById('hou'); if (ho && typeof S !== 'undefined' && S && !S.lancee && ((S.atelier && document.body.classList.contains('vue-atelier')) || S.repetition) && !document.documentElement.classList.contains('dr-en-classe')) {   /* l'Atelier et la répétition seulement : l'écran de la classe garde son entête */ let tx = dr_sourceTexte(src); if (typeof S !== 'undefined' && S && S.repetition && src.aEdt) { const hv = dr_heureAVenir(S.heure || 1); tx = hv ? ('heure ' + (S.heure || 1) + '/' + (hv.sur || src.sur) + ' · ' + new Date(hv.base).toLocaleDateString('fr-FR', { weekday: 'short' }) + ' ' + new Date(hv.base).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ' ' + hv.debut) : tx; } tx = ' · ' + tx; if (ho.textContent !== tx) ho.textContent = tx; } }
  else if (hc._drMenu) { hc._drMenu = false; hc.onclick = null; hc.style.cursor = ''; } }
setInterval(() => { try { if (dr_actif()) dr_hclasseMaj(); } catch (e) {} }, 1000);
function dr_demarrer(){ dr_envelopperJouer(); dr_toutLire(); dr_classe(); dr_taxo(); dr_suivreSeance(); dr_hclasseMaj(); const ho = document.getElementById('hou'); if (ho && !S.lancee) ho.textContent = 'aucune heure lancée'; DR_MEM.demarre = true; }

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
    if(et.textes&&et.textes[bi+'.src']!=null)b=Object.assign({},b,{src:et.textes[bi+'.src']});   /* E4 (§12.59 (1)) : les mots corrigés en classe (la copie), le dessin reste */
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
  const rit = e => e.role === 'reactivation';   /* E1 (§12.25 (6)) : la lecture par le titre tombe (dr_estRituel) — seule role === 'reactivation' compte */ const bil = e => e.role === 'bilan' || (!e.role && /bilan/i.test(String(e.act || ''))); /* E1 (réveil n°12, E4 ligne 160 ; §12.16, C1 6.1) : la trame réelle ne porte pas de rôle — le rituel d'ouverture (« Où en sommes-nous ? », dr_estRituel d'E2) en tête de l'heure suivante, le bilan en dernier, hors classe comme en classe */
  const react = idx.filter(i => E[i].heure === h && rit(E[i])); const glissees = idx.filter(i => glisse(E[i], i)); const propres = idx.filter(i => E[i].heure === h && !rit(E[i]) && !bil(E[i])); const bilan = idx.filter(i => E[i].heure === h && !rit(E[i]) && bil(E[i]));
  const vue = i => !dr_masqueeCachee(E[i]);   /* EX (§12.62 (4)) : une diapo masquée reste dans la trame, mais la classe ne la voit ni ne la joue */
  return [...react, ...glissees, ...propres, ...bilan].filter(vue); }
/* EX (§12.62 (4)) : « Masquer » — la diapo reste dans la trame (l'Atelier la montre, grisée), jamais montrée en classe ni jouée (le pilotage, la répétition, le tableau) */
function dr_masqueeCachee(e){ return !!(e && e.masquee && e.role !== 'fin' && !(typeof S !== 'undefined' && S.atelier && !S.repetition)); }

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

/* E1 (§12.33 bis, dette 13 · 76) : la question du bilan « sans réponse attendue » (§12.23 : reps vides ou absentes — l'import en pose une vide) n'a ni puce ni ligne sous elle,
   au tableau, au pilote, dans l'Atelier : sa réponse s'écrit dans la copie de la classe. Ailleurs, une ligne vide reste la place où l'on écrit. */
function dr_qSansReponse(e, b){ return !!(e && e.role === 'bilan' && b && b.t === 'question' && !(b.el || []).some(x => String(x == null ? '' : x).trim())); }
/* E4 (§12.38 (3), A91) : hors de la classe (Atelier, répétition), la diapo du cahier de textes montre le cahier par le même rendu qu'en classe — un bloc montré, jamais écrit dans la trame (les données : dr_cahierHorsClasse, E1) */
function dr_blocsVus(e){ if (e && e.blocs && e.blocs.length) return e.blocs; try { if (e && e.role === 'fin' && typeof dr_cahierHorsClasse === 'function' && dr_cahierHorsClasse(e)) return [{ t: 'cahier' }]; } catch (x) {} return (e && e.blocs) || []; }
function elements(e){ const out = []; dr_blocsVus(e).forEach((b, bi) => { if (b.t === 'image' && typeof dr_marquesElements === 'function') { dr_marquesElements(b).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: 'image' })); return; } /* E4 : R1, les marques une à une (dr-recyclage.js) */ if (b.t === 'cahier') { ['l\'échéance', 'le travail à faire', 'le contenu de la séance', 'qui a participé'].forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: 'cahier' })); return; } if (b.t === 'schema') { p8Elements(b).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: 'schema' })); return; } /* (p8-2) une bulle = un élément, dans l'ordre de la source ; « Tout ensemble » : aucun */ if (b.t === 'question') out.push({ b: bi, e: 'q', txt: b.txt || '', t: 'question', q: true }); /* (p8-3c) la question se dévoile à son tour, avant ses lignes */ if (dr_qSansReponse(e, b)) return; /* E1 (§12.33 bis, 13 · 76) : la question du bilan sans réponse attendue n'a pas de ligne */ (b.el || []).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: b.t })); }); return out; }

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

/* E1 (§12.34-1, dette 13 · 65) : L'ŒUVRE ENTIÈRE, JAMAIS RECADRÉE — l'image est « contain » (dr.css), et sa boîte (.img-sup) prend la taille du rectangle de l'image affichée,
   centrée dans la place qu'elle avait : les marques (pt, et, fl, cd, lg), posées en % de la boîte, se rapportent ainsi à l'œuvre, à toutes les tailles, au pilote, au tableau, dans l'Atelier. */
function dr_imageAjuster(sup){ const img = sup.querySelector(':scope > img'); if (!img || !img.naturalWidth || !img.naturalHeight) return; sup.style.width = ''; sup.style.height = ''; sup.style.left = ''; sup.style.top = ''; sup.style.aspectRatio = '';
  const W0 = sup.clientWidth, H0 = sup.clientHeight; if (!W0 || !H0) return; const r = img.naturalWidth / img.naturalHeight; let w = W0, h = w / r; if (h > H0) { h = H0; w = h * r; }
  sup.style.aspectRatio = 'auto'; sup.style.width = w.toFixed(1) + 'px'; sup.style.height = h.toFixed(1) + 'px'; if (getComputedStyle(sup).position === 'absolute') { sup.style.left = ((W0 - w) / 2).toFixed(1) + 'px'; sup.style.top = ((H0 - h) / 2).toFixed(1) + 'px'; } }
function dr_imagesEntieres(mur){ mur.querySelectorAll('.img-sup').forEach(sup => { const img = sup.querySelector(':scope > img'); if (!img) return; if (img.complete && img.naturalWidth) dr_imageAjuster(sup); else if (!img._drAj) { img._drAj = true; img.addEventListener('load', () => { dr_imageAjuster(sup); }, { once: true }); } }); }
/* ═══ E1 (§12.44, registres 13 · 56, 13 · 84 ; cadrage 4 bis, 4b.1-4b.5 ; Paul 28/10 07:04, 07:29, 07:55) : LA CLÉ USB, POUR DE VRAI ═══
   Chaque appareil désigne UNE FOIS le dossier de sa clé (`showDirectoryPicker`, Chrome et Edge : le dossier est retenu pour ce navigateur, dans IndexedDB ;
   à l'ouverture suivante, le navigateur redemande seulement l'accord). La diapo ne retient que le nom du fichier et le nom du dossier, jamais un chemin de disque ;
   le fichier ne traverse jamais le hub. C'est l'appareil qui projette qui lit (4b.3) : l'ordi de classe (la vue du tableau, par l'adresse du tableau) lit sa clé et
   dit au site, par fichier, s'il voit le dossier et le fichier (`/site/cle_vue` : le nom du dossier, l'état, la liste des noms — rien d'autre ; la seule écriture
   permise à la vue du tableau) ; la fenêtre du tableau ouverte depuis l'ordi portable lit la clé de l'ordi portable. La garde (`dr_cleEtatFichier`) vérifie pour
   de vrai, fichier par fichier, sur l'appareil qui projette ; « Revérifier » refait la lecture. Plus de `S.cle` fixé. */
const DR_CLE = { h: null, nom: '', fichiers: [], etat: 'aucun', urls: {}, retenu: false, distant: null, _charge: null };
function dr_cleIdb(op, v){ if (typeof window.__drCleIdbBanc === 'function') return Promise.resolve(window.__drCleIdbBanc(op, v)).catch(() => null);   /* banc seulement : relire un dossier depuis IndexedDB fait planter Chromium sans écran (mesuré) — le banc garde le dossier autrement, le site garde IndexedDB */
  return new Promise(res => { try { const q = indexedDB.open('mjpc-cle', 1); q.onupgradeneeded = () => q.result.createObjectStore('h'); q.onerror = () => res(null);
  q.onsuccess = () => { try { const tx = q.result.transaction('h', op === 'get' ? 'readonly' : 'readwrite'); const st = tx.objectStore('h'); const r = op === 'get' ? st.get('dossier') : st.put(v, 'dossier'); r.onsuccess = () => res(op === 'get' ? (r.result || null) : true); r.onerror = () => res(null); } catch (e) { res(null); } }; } catch (e) { res(null); } }); }
async function dr_cleScanner(){ const h = DR_CLE.h; Object.keys(DR_CLE.urls).forEach(k => { try { URL.revokeObjectURL(DR_CLE.urls[k]); } catch (e) {} }); DR_CLE.urls = {};
  if (!h) { if (DR_CLE.memo) { DR_CLE.etat = 'vu'; DR_CLE.fichiers = Object.keys(DR_CLE.memo).sort(); } else { DR_CLE.etat = 'aucun'; DR_CLE.fichiers = []; } dr_cleRapporter(); return DR_CLE; }   /* memo : Firefox / Safari, le dossier choisi pour cette page seulement */
  try { const p = h.queryPermission ? await h.queryPermission({ mode: 'read' }) : 'granted'; if (p !== 'granted') { DR_CLE.etat = 'a-autoriser'; DR_CLE.fichiers = []; dr_cleRapporter(); return DR_CLE; }
    const l = []; for await (const [n, x] of h.entries()) if (x && x.kind === 'file') l.push(n); DR_CLE.fichiers = l.sort(); DR_CLE.etat = 'vu'; }
  catch (e) { DR_CLE.etat = 'pas-vu'; DR_CLE.fichiers = []; }   /* la clé retirée : le dossier ne répond plus */
  dr_cleRapporter(); return DR_CLE; }
function dr_cleCharger(){ if (!DR_CLE._charge) DR_CLE._charge = (async () => { const h = await dr_cleIdb('get'); if (h && h.kind === 'directory') { DR_CLE.h = h; DR_CLE.nom = h.name; DR_CLE.retenu = true; } return dr_cleScanner(); })(); return DR_CLE._charge; }
async function dr_cleAutoriser(){ try { if (DR_CLE.h && DR_CLE.h.requestPermission) await DR_CLE.h.requestPermission({ mode: 'read' }); } catch (e) {} return dr_cleScanner(); }
/* « Désigner le dossier de la clé » : true (désigné), false (annulé), null (ce navigateur ne sait pas retenir un dossier : Firefox, Safari) */
async function dr_cleDesigner(){ if (typeof window.showDirectoryPicker !== 'function') return null; let h = null; try { h = await window.showDirectoryPicker({ id: 'mjpc-cle', mode: 'read' }); } catch (e) { return false; }
  DR_CLE.memo = null; DR_CLE.h = h; DR_CLE.nom = h.name; DR_CLE.retenu = !!(await dr_cleIdb('put', h)); DR_CLE._charge = Promise.resolve(DR_CLE); await dr_cleScanner(); return true; }
const DR_CLE_VIDEO = /\.(mp4|m4v|webm|mov|ogv|mkv)$/i;
function dr_cleDurees(){ const l = DR_CLE.fichiers.filter(n => DR_CLE_VIDEO.test(n)); DR_CLE.durees = DR_CLE.durees || {}; return Promise.all(l.map(n => DR_CLE.durees[n] != null ? null : dr_cleUrl(n).then(u => new Promise(res => { if (!u) { res(); return; } const v = document.createElement('video'); v.preload = 'metadata'; const fin = d => { DR_CLE.durees[n] = d; res(); }; v.onloadedmetadata = () => fin(Math.round(v.duration || 0)); v.onerror = () => fin(0); setTimeout(() => fin(DR_CLE.durees[n] || 0), 4000); v.src = u; })))); }
function dr_cleVoitIci(nom){ return !!nom && DR_CLE.etat === 'vu' && DR_CLE.fichiers.indexOf(nom) >= 0; }
async function dr_cleUrl(nom){ if (!nom) return null; if (DR_CLE.urls[nom]) return DR_CLE.urls[nom];
  if (dr_cleVoitIci(nom) && DR_CLE.memo && DR_CLE.memo[nom]) return (DR_CLE.urls[nom] = URL.createObjectURL(DR_CLE.memo[nom]));
  if (dr_cleVoitIci(nom) && DR_CLE.h) { try { const f = await (await DR_CLE.h.getFileHandle(nom)).getFile(); return (DR_CLE.urls[nom] = URL.createObjectURL(f)); } catch (e) { DR_CLE.etat = 'pas-vu'; dr_cleRapporter(); return null; } }
  try { if (window.opener && window.opener !== window && typeof window.opener.dr_cleUrl === 'function') return await window.opener.dr_cleUrl(nom); } catch (e) {}   /* la fenêtre du tableau de l'ordi portable lit par la clé de son pilote */
  return null; }
/* l'ordi de classe (la vue du tableau distante) dit au site ce qu'il voit — par fichier, rien d'autre ; jamais en mode test */
function dr_cleRapporter(){ try { if (typeof dr_estTableau !== 'function' || !dr_estTableau() || (typeof dr_tabLocal === 'function' && dr_tabLocal())) return; if (typeof m8TestOn === 'function' && m8TestOn()) return;
  const v = { appareil: (typeof SES === 'object' && SES) ? SES.id : '', nom: DR_CLE.nom || '', etat: DR_CLE.etat, fichiers: DR_CLE.fichiers.slice(0, 400), ts: Date.now() };
  const f = (typeof _fetchVrai === 'function') ? _fetchVrai : fetch; f(FIREBASE_BASE + '/site/cle_vue.json', { method: 'PUT', body: JSON.stringify(v) }).catch(() => {}); } catch (e) {} }
function dr_cleDistant(){ const r = DR_CLE.distant; return (r && r.ts && (Date.now() - r.ts) < 120000) ? r : null; }
function dr_cleLireDistant(cb){ try { dr_lire('/site/cle_vue', v => { DR_CLE.distant = v || null; if (cb) cb(); }); } catch (e) { if (cb) cb(); } }
/* l'appareil qui projette : la fenêtre du tableau ouverte d'ici (l'ordi portable), sinon l'ordi de classe s'il parle (son rapport est frais), sinon ici */
function dr_cleOu(){ try { if (typeof DR_TAB !== 'undefined' && DR_TAB.fen && !DR_TAB.fen.closed) return 'portable'; } catch (e) {} return dr_cleDistant() ? 'classe' : 'portable'; }
function dr_cleEtatFichier(nom){ const ou = dr_cleOu(); const lieu = ou === 'classe' ? 'l’ordi de classe' : 'ton ordi portable'; const r = ou === 'classe' ? dr_cleDistant() : { etat: DR_CLE.etat, fichiers: DR_CLE.fichiers, nom: DR_CLE.nom };
  const ok = r.etat === 'vu' && (r.fichiers || []).indexOf(nom) >= 0;
  const texte = ok ? '✔ « ' + nom + ' » — clé USB branchée sur ' + lieu + (r.nom ? ' (dossier « ' + r.nom + ' »)' : '')
    : r.etat === 'aucun' ? '✘ « ' + nom + ' » — branche la clé USB sur ' + lieu + ' et désigne son dossier (une fois)'
    : r.etat === 'a-autoriser' ? '✘ « ' + nom + ' » — la clé « ' + r.nom + ' » est connue sur ' + lieu + ' : autorise sa lecture (« Revérifier »)'
    : r.etat === 'pas-vu' ? '✘ « ' + nom + ' » — branche la clé USB sur ' + lieu + ' (le dossier « ' + r.nom + ' » ne répond pas)'
    : '✘ le fichier « ' + nom + ' » manque sur la clé de ' + lieu + ' (dossier « ' + r.nom + ' ») — mets-le sur cette clé';
  return { ok, ou, lieu, etat: ok ? 'vu' : (r.etat === 'vu' ? 'manque' : r.etat), texte }; }
function dr_cleVoit(nom){ return !!nom && dr_cleEtatFichier(nom).ok; }
/* « Revérifier » : relit la clé d'ici et le rapport de l'ordi de classe, puis cb */
function dr_cleReverifier(cb){ const fin = () => { if (cb) cb(); }; (DR_CLE.etat === 'a-autoriser' ? dr_cleAutoriser() : (DR_CLE.h ? dr_cleScanner() : dr_cleCharger())).then(() => dr_cleLireDistant(fin), () => dr_cleLireDistant(fin)); }
setTimeout(() => { try { dr_cleCharger(); } catch (e) {} }, 0);
setInterval(() => { try { if (typeof dr_estTableau === 'function' && dr_estTableau()) { if (DR_CLE.h && DR_CLE.etat !== 'a-autoriser') dr_cleScanner(); else dr_cleRapporter(); } else if (typeof dr_actif === 'function' && dr_actif()) { dr_cleLireDistant(); if (DR_CLE.h && DR_CLE.etat !== 'a-autoriser') dr_cleScanner(); } } catch (e) {} }, 15000);   /* la clé retirée se voit en 15 s au plus, ici comme sur l'ordi de classe */
/* la vidéo dans la diapo, avec le lecteur du navigateur (4b.2) : ▶ lit de `videoDe` jusqu'au repère `videoPos` et s'arrête ; ◀ revient au précédent. Lit l'appareil qui
   projette (une vue tableau, `et.pilote` faux) — et le pilote en répétition, quand c'est lui qui a la clé. Un seul <video> par mur, recollé après chaque rendu. */
function dr_videoBrancher(mur, et){ try { if (!mur || (mur.id !== 'mur' && mur.id !== 'mur2') || et._ref) return;   /* jamais dans un mur de mesure (vignettes, pagination) */
  const z = mur.querySelector('.video'); const e = dr_seances()[et.si] && dr_seances()[et.si].ecrans[et.di]; const b = e && e.blocs && e.blocs[0];
  if (!z || !b || b.t !== 'video' || !b.fichier) { if (mur._drVid) { try { mur._drVid.pause(); } catch (x) {} } return; }
  const lit = !et.pilote || (typeof S === 'object' && S && S.repetition && dr_cleVoitIci(b.fichier)); if (!lit) return;
  let v = mur._drVid; if (!v) { v = mur._drVid = document.createElement('video'); v.className = 'dr-vid'; v.playsInline = true; v.preload = 'auto'; v.style.cssText = 'display:block;width:100%;max-height:72%;background:#000;margin:.2em 0'; v.addEventListener('timeupdate', () => { const fin = +v.dataset.fin; if (v.dataset.lecture === '1' && isFinite(fin) && v.currentTime >= fin - 0.05) { v.pause(); v.dataset.lecture = '0'; } }); }
  if (v.parentNode !== z) z.insertBefore(v, z.firstChild);
  const regler = () => { const de = +(et.videoDe || 0), a = +(et.videoPos || 0), seg = [b.fichier, de, a, et.videoT0 || 0, et.videoLecture ? 1 : 0].join('|'); if (v.dataset.seg === seg) return; v.dataset.seg = seg;
    if (et.videoLecture) { v.dataset.fin = String(a); v.dataset.lecture = '1'; try { v.currentTime = de; } catch (x) {} const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    else { v.dataset.lecture = '0'; v.pause(); try { if (Math.abs(v.currentTime - a) > 0.3) v.currentTime = a; } catch (x) {} } };
  if (v.dataset.f === b.fichier && v.src) { regler(); return; }
  dr_cleUrl(b.fichier).then(u => { if (!u) return; v.dataset.f = b.fichier; v.dataset.seg = ''; v.src = u; if (v.readyState >= 1) regler(); else v.addEventListener('loadedmetadata', regler, { once: true }); }); } catch (x) {} }
/* E1 (§12.44 (4 ter), Paul 28/10 07:29 « Pour les pdf images etc, oui, évidemment ») : une image ou un PDF de la clé — `fichier` (et `dossier`), pas de `ref` : il reste
   sur la clé, l'appareil qui projette le lit comme une vidéo (même dossier, même garde). Le pilote le montre s'il a la clé ; sinon il dit où est le fichier. */
const DR_CLE_IMAGE = /\.(jpe?g|png|webp|gif)$/i, DR_CLE_PDF = /\.pdf$/i;
function dr_cleMediaHtml(b, et){ const n = dr_esc(b.fichier); const vide = `<div class="img-vide" style="display:none">${et && (et.pilote || et.atelier) ? 'sur la clé · ' + n : ''}</div>`;
  return DR_CLE_PDF.test(b.fichier) ? `<iframe class="dr-cle-pdf" data-cle="${n}" title="${n}" style="width:100%;height:100%;border:0;background:#fff"></iframe>${vide}` : `<img data-cle="${n}" alt="">${vide}`; }
function dr_cleMediasBrancher(mur){ try { mur.querySelectorAll('[data-cle]').forEach(x => { const nom = x.getAttribute('data-cle'); if (x._drCle === nom) return; x._drCle = nom;
  dr_cleUrl(nom).then(u => { if (u) { x.src = u + (DR_CLE_PDF.test(nom) ? '#toolbar=0' : ''); x.style.display = ''; } else { x.style.display = 'none'; const v = x.nextElementSibling; if (v && v.classList.contains('img-vide')) { v.style.display = 'flex'; if (v.textContent) v.textContent = 'sur la clé de ' + (dr_cleOu() === 'classe' ? 'l’ordi de classe' : 'l’ordi qui projette') + ' · ' + nom; } } }); }); } catch (e) {} }
function rendre(mur, et){ const et0 = et; /* (p8-5f) */ if (et && et.atelier && et.pilote) { et = Object.assign({}, et, { nDev: elements(dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di]).length }); } if (et && et.oral && !et.pilote) { mur.innerHTML = `<div class="oral-carte"><div class="t">Activité ${dr_esc(String(et.oral.num))} — ${dr_esc(et.oral.titre)}</div><div class="s">à l'oral</div></div>`; return; }
  const e = dr_seances()/* E1 : lisait DATA.seances */[et.si].ecrans[et.di]; if (e && e.forme && typeof e.forme === 'object') { const fo = e.forme; et = Object.assign({}, et, { surl: (fo.surl || []).concat(et.surl || []), coulTxt: (fo.coulTxt || []).concat(et.coulTxt || []), gras: (fo.gras || []).concat(et.gras || []), soul: (fo.soul || []).concat(et.soul || []) }); } /* E1 : la mise en forme de la trame (atelier), sous celle de l'heure */ const deja = et.deja || 0; const H = mur.clientHeight || 616; const fs = policePx(H, TAILLES[et.taille].pt); const reps = et.reps || {}; const tailles = et.tailles || {}; const fsB = Object.assign({}, et.fsBloc || {}); (e.blocs || []).forEach((b, bi) => { if (b.taille === 'petit') fsB[bi] = (fsB[bi] || 1) * 0.85; if (b.taille === 'grand') fsB[bi] = (fsB[bi] || 1) * 1.2; }); const tx = et.textes || {};
  const numA = numDe(e); const actTxt = tx['-1.act'] != null ? tx['-1.act'] : e.act; const actLib = (numA ? 'Activité ' + numA + ' — ' : '') + actTxt; const actHtml = `<span class="act">${numA ? 'Activité ' + numA + ' — ' : ''}<span${et.pilote && !et.atelier && typeof S !== 'undefined' && S.lancee && !S.close && !S.repetition ? ' data-p="-1.act"' : ''}>${dr_esc(actTxt)}</span></span>`;   /* E4 (§12.59 (1)) : l'étiquette d'activité se corrige en direct, au clic, comme la consigne (dans la copie de la classe) */ let h = ''; const alertesDiapo = []; /* (p4a) les alertes de forme de la diapo : une bandelette en surimpression, elles ne prennent pas la place du contenu */
  const b0 = e.blocs[0] || (et.cahier && et.cahier.horsClasse ? { t: 'cahier' } : undefined);   /* E4 (§12.38 (3)) : le cahier montré hors de la classe — et dans la fenêtre du tableau, qui reçoit l'état */
  if (et.fichePage != null && e.blocs[et.fichePage] && e.blocs[et.fichePage].t === 'fiche') { const b = e.blocs[et.fichePage]; h += `<div class="f-tab${et.ficheEntre ? ' entre' : ''}"><div class="f-page"><div class="f-entete"><div class="f-metas"><span><span class="f-meta-l">Fiche</span>${dr_esc(b.tt || 'fiche notion')}</span><span><span class="f-meta-l">Chapitre</span>${dr_esc(dr_chapitreTitre()/* E1 : lisait DATA.chapitre */.split(' (')[0])}</span></div><div class="f-titre">${dr_esc(b.txt)}</div></div>${(b.el || []).map((x, i) => { const c = (i >= (et.ficheDev || 0) ? ' pas' : '') + ((et.ficheEcr || []).includes(i) ? ' aecrire' : ''); return i === 0 ? `<div class="f-ancrage${c}" data-fk="${i}">${x}</div>` : `<div class="f-bloc${c}" data-fk="${i}">${x}</div>`; }).join('')}${et.pilote && !et.atelier ? '<button class="dr-fiche-fermer" title="Refermer la fiche (Échap)">✕</button>' : ''}<div class="f-pied"><span>${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom)}</span><span>monsieurjaipascompris</span></div></div></div>`; }
  else if (b0 && b0.t === 'cahier' && et.cahier) { const f = et.cahier; const nd = (et.pilote && et.cahier.prepa) ? 4 : (et.nDev || 0); const cel = (k, inner) => (!et.pilote && k >= nd) ? '' : `<div class="cel${k >= nd ? ' pas' : ''}${et.flash === k ? ' spot-on' : ''}" data-k="${k}" data-p="0.c.${k}">${inner}</div>`;
    h += `<div class="corpsd ecran cahier${f.grand ? ' grand' : ''}" style="font-size:${fs.toFixed(2)}px"><span class="act">Cahier de textes — ${dr_esc(f.jour)}, ${dr_esc(f.de)} – ${dr_esc(f.a)}</span>` + `<div class="ed-agenda"><div class="ed-bandeau"><span class="ed-logo">MON ESPACE<br>ÉLÈVE</span><span class="ed-etab">Collège Saint-Joseph</span></div><div class="ed-corps"><div class="ed-titre">Cahier de textes <span class="ed-classe">(3 ${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom.replace(/^3E /, ''))})</span></div>`
      + cel(0, `<div class="ed-date"${et.pilote && !et.atelier && typeof S !== 'undefined' && S.lancee && !S.close ? ' data-ech="1" title="Clic : changer l’échéance — c’est celle de « Fin de l’heure »"' : ''}>PRENEZ VOS AGENDAS — POUR ${dr_esc(f.date.replace(/, \d{2}:\d{2}$/, '')).toUpperCase()}</div>`) + (et.pilote ? `<button class="ed-agrandir" data-agrandir="1" title="${f.grand ? 'Réduit la carte : la date reprend sa taille' : 'Agrandit la carte du récit ou du travail : la date et le bandeau se réduisent, la carte prend la place — tout reste dans la diapo, le tableau fait pareil'}">${f.grand ? '⤡ réduire' : '⤢ agrandir'}</button>` : '')
      + `<div class="ed-onglets"><span class="${f.onglet === 'contenu' ? '' : 'on'}"${et.pilote ? ' data-onglet="travail" title="Montre le travail à faire"' : ''}>Travail à faire</span><span class="${f.onglet === 'contenu' ? 'on' : ''}${nd < 3 ? ' ed-voile' : ''}"${et.pilote && nd >= 3 ? ' data-onglet="contenu" title="Montre le contenu de la séance (le récit)"' : ''}>Contenus de séances</span></div>`
      + (f.onglet === 'contenu' && nd >= 3
          ? cel(2, `<div class="ed-carte">${et.pilote ? `<div class="rv"><span class="${f.version === 'moi' ? '' : 'on'}" data-rv="site" title="Le récit composé par le site — il se réécrit tout seul à chaque geste ; ta version reste gardée">composé par le site</span><span class="${f.version === 'moi' ? 'on' : ''}" data-rv="moi" title="Ta version : le récit devient modifiable ici, avec Ctrl+Z / Ctrl+Y ; chaque modification est une version gardée">ma version (modifier)</span><span class="rv-h">${f.version === 'moi' && f.suite ? `<button id="rv-reprendre" title="Colle la suite composée par le site à la fin de ta version, en un seul texte à corriger">Reprendre la suite dans ma version</button>` : ''}<button id="rv-undo" title="Revenir à la version précédente">↶</button><button id="rv-redo" title="Rétablir la version suivante">↷</button></span></div>` : ''}<div class="ed-matiere">FRANCAIS — contenu de la séance${f.version === 'moi' ? ' · ma version' : ''}</div><div class="ed-texte ed-recit"${et.pilote && f.version === 'moi' ? ' contenteditable="true" id="ed-recit-edit"' : ''} data-p="0.r">${f.recit || '<i>rien encore</i>'}</div></div>`)
          : cel(1, `<div class="ed-carte"><div class="ed-matiere">FRANCAIS</div>${f.deja ? `<div class="ed-deja">déjà donné pour cette date (${dr_esc(f.dejaQuand)}) : ${dr_esc(f.deja)}</div>` : ''}<div class="ed-texte"${et.pilote ? ' contenteditable="true" id="ed-edit" title="Écris ici : c\'est ce que les élèves voient, ce qui partira dans École Directe, le récit et l\'historique"' : ''} data-p="0.w">${f.travail ? dr_esc(f.travail).replace(/\n/g, '<br>') : (et.pilote ? '' : '<i>rien pour la prochaine fois</i>')}</div><div class="ed-donne">Donné le ${dr_esc(f.donne)}</div></div>`))
      + `</div></div>` + cel(3, `<div class="ed-part"><span class="dr-g">${f.qui.length} élève${f.qui.length > 1 ? 's' : ''} sur ${f.total} ${f.qui.length > 1 ? 'ont' : 'a'} participé</span><span>${f.qui.length ? f.qui.map(o => dr_esc(o.p) + (o.n > 1 ? ' <i class="qn">×' + o.n + '</i>' : '')).join(' · ') : 'personne pour l\'instant'}</span><span class="m">${f.ecrit} réponse${f.ecrit > 1 ? 's' : ''} écrite${f.ecrit > 1 ? 's' : ''} · ${f.oral} prise${f.oral > 1 ? 's' : ''} de parole · ${f.total - f.qui.length ? 'il reste ' + (f.total - f.qui.length) + ' à passer' : 'tout le monde a participé'}</span></div>`) + `</div>`; }
  else if (et.doc) { h += actHtml + docHtml(et.doc) + (et.pilote ? `<button class="doc-x" data-docx="1" title="Ferme le document : retour à la diapo (le journal note le départ)">✕ retour à la diapo</button>` : ''); }
  else if (b0 && b0.t === 'video') { h += actHtml + videoHtml(b0, et); }
  else {
    const pleinImg = e.blocs.length === 1 && b0.t === 'image' && b0.support !== false; /* l'intention de l'ancien (.e.plein-img), que son CSS cassé n'appliquait pas : corrigé sur l'ordre de Paul (16/09) */ h += `<div class="corpsd ecran${pleinImg ? ' plein-img' : ''}" style="font-size:${fs.toFixed(2)}px">${actHtml}`; let k = 0;
    e.blocs.forEach((b, bi) => { const cls = 'bloc' + (tailles[bi] ? ' t-' + tailles[bi] : '') + (b.t === 'image' ? ' img' + (e.blocs.length === 1 ? ' img-plein' : '') + (et.arrivee ? ' neuf-vu' : '') : ''); const st = fsB[bi] ? ` style="font-size:${fsB[bi]}em"` : ''; h += `<div class="${cls}" data-bi="${bi}"${st}>`;
      const titre = tx[bi + '.t'] != null ? tx[bi + '.t'] : b.txt; const marqBloc = ((et.ecr || []).includes('b' + bi) ? ' aecrire' : '') + (et.arrivee ? ' neuf-vu' : ''); const lumBloc = et.flash === 'b' + bi ? ' spot-on' : '';
      const TYPES = ['consigne', 'texte', 'question', 'fiche', 'schema', 'image', 'video', 'page', 'doc', 'cahier']; /* (p8-3c) le cahier de textes a son rendu */ if (!TYPES.includes(b.t)) { if (et.pilote || et.atelier) alertesDiapo.push(`<div class="obj-nonlisible" data-bloc="${bi}"><b>⚠ Objet non lisible — « ${dr_esc(b.t || '?')} » (bloc ${bi + 1})</b>Rien ne s'affiche à sa place en classe, jamais une page blanche. Déclare un objet manquant, ou remplace-le (3.1) ; le texte pour l'instance est dans « À régler ».</div>`); h += '</div>'; return; }
      if (b.t === 'fiche' && !b.feuille && !dr_ficheEnLigne(b)) { /* E1 : une fiche du site qui porte son texte (titre, définition, corps) s'affiche comme dans l'ancien moteur ; « À régler » dit toujours qu'elle n'est pas liée à une feuille (audit E1, F17) */ if (et.pilote || et.atelier) alertesDiapo.push(`<div class="obj-nonlisible" data-bloc="${bi}"><b>⚠ Fiche non liée — « ${dr_esc(b.txt || '')} » (bloc ${bi + 1})</b>Lie-la à une fiche d'une feuille du chapitre (clic droit → Lier à une fiche…), sinon le bloc ne s'affiche pas en classe (1.7).</div>`); h += '</div>'; return; }
      if (b.t === 'page') { const etp = b.contrat ? ((et.pageEtape || {})[bi] || 1) : null; h += `<div class="page-sup${marqBloc}${lumBloc}" data-bloc="${bi}"><div class="page-t" data-p="${bi}.t">${surligne(dr_esc(titre), bi + '.t', et)}</div><div class="page-v">${b.contrat ? `<div class="page-cadre">page HTML — ${dr_esc(b.src || '')} · <b>étape ${etp} / ${b.etapes || 1}</b></div><div class="page-etape">${dr_esc(b.src || 'la page')} — étape ${etp} : ${b.contrat ? 'ce que la page montre à cette étape (dans le site : la page elle-même, chargée dans la diapo)' : ''}</div>` : `page HTML — ${dr_esc(b.src || 'sans fichier')}${(et.pilote || et.atelier) ? ' · <b style="color:#b3261e">sans contrat de pilotage : jouée comme une image</b>' : ''}`}</div></div>`; h += '</div>'; return; }
      if (b.t === 'doc') { const d = (dr_documents()/* E1 : lisait DATA.documents */[String(S.si)] || []).find(x => x.id === b.doc); const proj = d ? (['pdf', 'image', 'html', 'docx'].includes(d.type)) : false; h += `<div class="doc-sup${marqBloc}${lumBloc}" data-bloc="${bi}" data-docbloc="${dr_esc(b.doc || '')}" title="${(et.pilote || et.atelier) ? 'Un clic ouvre le document au tableau (pages aux flèches, la croix pour revenir à la diapo)' : ''}"><span class="doc-ic">📄</span> <span class="doc-t" data-p="${bi}.t">${surligne(dr_esc(titre || (d ? d.titre : 'document')), bi + '.t', et)}</span>${d ? `<span class="doc-i"> · ${dr_esc(d.type)}${d.pages ? ' · ' + d.pages + ' pages' : d.etapes ? ' · ' + d.etapes + ' étapes' : ''}${(et.pilote || et.atelier) ? (proj ? ' · <b style="color:#1a7a3e">projetable</b>' : ' · <b style="color:#b3261e">non projetable tel quel : convertis-le en PDF</b>') : ''}</span>` : `<span class="doc-i" style="color:#b3261e"> · document introuvable dans la séance</span>`}</div>`; h += '</div>'; return; }
      if (b.t === 'consigne' || b.t === 'texte') { const tPas = !!e.construite && (b.el || []).length > 0 && k >= et.nDev; /* E1 (dette 13 · 34) : sur l'écran construit par le site seulement, le titre d'un bloc paraît avec sa première ligne dévoilée (comme la question, p8-3c) — jamais un titre vide en bas de page ; ailleurs le titre reste dès le début (p8-4) */ if (String(titre == null ? '' : titre).trim() || !(b.el || []).length) /* (p8-4) sans ligne de tête : ses lignes seules */ h += `<div class="cons${marqBloc}${lumBloc}${tPas ? ' pas' : ''}" data-bloc="${bi}">${b.t === 'texte' ? '' : `<span class="pic">${dr_esc(b.pic || '•')}</span>`}<span class="txt" data-p="${bi}.t">${surligne(dr_esc(titre), bi + '.t', et)}</span></div>`;
        if (b.el && b.el.length) { h += '<ul class="etapes">'; b.el.forEach((x, ei) => { const c = [k >= et.nDev ? 'pas' : '', et.flash === k ? 'spot-on' : '', (et.ecr || []).includes(k) ? 'aecrire' : '', et.neuf === k ? 'neuf-vu' : ''].join(' '); const t2 = tx[bi + '.' + ei] != null ? tx[bi + '.' + ei] : x; h += `<li data-k="${k}" data-p="${bi}.${ei}" class="${c}${k < deja ? ' deja' : ''}">${surligne(dr_esc(t2), bi + '.' + ei, et)}</li>`; if (deja && k === deja - 1) h += `<li class="cahier">retrouve cette partie dans ton cahier</li>`; k++; }); h += '</ul>'; } }
      else if (b.t === 'question') { const kq = k; const qPas = kq >= et.nDev; /* (p8-3c) la question se dévoile à son tour ; ses lignes la suivent */ h += `<p class="q${marqBloc}${lumBloc}${qPas ? ' pas' : ''}${et.neuf === kq ? ' neuf-vu' : ''}" data-k="${kq}" data-p="${bi}.t" data-bloc="${bi}">${surligne(dr_esc(titre), bi + '.t', et)}</p>`; k++; const qSans = dr_qSansReponse(e, b);
        if (b.el && b.el.length && !qSans) { h += '<ul class="etapes">'; b.el.forEach((x, ei) => { const c = [k >= et.nDev ? 'pas' : '', et.flash === k ? 'spot-on' : '', (et.ecr || []).includes(k) ? 'aecrire' : '', et.neuf === k ? 'neuf-vu' : ''].join(' '); const t2 = tx[bi + '.' + ei] != null ? tx[bi + '.' + ei] : x; h += `<li data-k="${k}" data-p="${bi}.${ei}" class="${c}">${surligne(dr_esc(t2), bi + '.' + ei, et)}</li>`; k++; }); h += '</ul>'; }
        const rs = reps[bi] || []; rs.forEach((r, ri) => { if (!et.pilote && !r.r) return; /* la classe ne voit jamais une ligne vide */ if (!et.pilote && qPas) return; /* (p8-3c) ni la réponse d'une question pas encore dévoilée */ h += `<div class="rep${qPas ? ' pas' : ''}" data-r="${ri}" data-bi="${bi}"><span class="ini${r.refo ? ' refo' : ''}${r.i ? '' : ' vide'}"${et.pilote ? ` contenteditable="true" data-p="${bi}.i.${ri}" title="Les initiales (dans n'importe quel ordre) ou le début du prénom ; double-clic : reformulée"` : ''}>${dr_esc(r.i || '')}</span><span class="dit"${et.pilote ? ` contenteditable="true" data-p="${bi}.r.${ri}" title="La réponse, au tableau au fil de la frappe ; Entrée : la réponse suivante"` : ''}>${dr_esc(r.r)}</span></div>`; });
        if (et.pilote && !qSans && (!rs.length || rs[rs.length - 1].validee)) { const ri = rs.length; /* E1 (13 · 76) : pas de ligne libre sous la question du bilan sans réponse attendue */ h += `<div class="rep libre${qPas ? ' pas' : ''}" data-r="${ri}" data-bi="${bi}"><span class="ini vide" contenteditable="true" data-p="${bi}.i.${ri}" title="Les initiales (dans n'importe quel ordre) ou le début du prénom"></span><span class="dit" contenteditable="true" data-p="${bi}.r.${ri}" title="La réponse, au tableau au fil de la frappe ; Entrée : la réponse suivante"></span></div>`; } }
      else if (b.t === 'fiche') { h += `<div class="fiche${marqBloc}${lumBloc}" data-bloc="${bi}">${et.pilote && !et.atelier ? `<button class="dr-fiche-ouvrir" data-fo="${bi}" title="Ouvrir la fiche en page : ▶ la dévoile paragraphe par paragraphe ; ✍🏻 sur un paragraphe">⤢ Ouvrir la fiche</button>` : ''}<div class="tt"${et.pilote && !et.atelier && typeof S !== 'undefined' && S.lancee && !S.close && !S.repetition ? ` data-p="${bi}.tt"` : ''}>${dr_esc(tx[bi + '.tt'] != null ? tx[bi + '.tt'] : (b.tt || 'fiche'))}</div><h3 data-p="${bi}.t">${surligne(dr_esc(titre), bi + '.t', et)}</h3>${(b.el || []).map((x, ei) => `<div class="${ei === 0 ? 'def' : 'corps'}" data-p="${bi}.${ei}">${surligne(tx[bi + '.' + ei] != null ? tx[bi + '.' + ei] : x, bi + '.' + ei, et)}</div>`).join('')}${typeof dr_rappelHtml === 'function' ? dr_rappelHtml(b, bi, et) : ''/* E4 : R2 */}</div>`; }
      else if (b.t === 'image') { h += `<div class="img-sup">${b.ref ? `<img src="${b.ref}" alt="" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'"><div class="img-vide" style="display:none">${et && (et.pilote || et.atelier) ? 'image absente de mjpc-medias · ' + dr_esc(dr_refRelative(b.ref)) : ''}</div>` : b.fichier ? dr_cleMediaHtml(b, et) : '<div class="img-vide"></div>'}${typeof dr_marquesHtml === 'function' ? dr_marquesHtml(b, bi, k, et) : ''/* E4 : R1 */}</div>${b.txt ? `<div class="img-lg" data-p="${bi}.t">${surligne(dr_esc(titre), bi + '.t', et)}</div>` : ''}`; if (typeof dr_marquesNb === 'function') k += dr_marquesNb(b); /* E4 : R1 */ }
      else if (b.t === 'schema') { /* (p8-2) le moteur de l'ancien déroulé ; la carte dit son titre au centre, une seule fois (décision 2) */ if (tx[bi + '.src'] != null) b = Object.assign({}, b, { src: tx[bi + '.src'] }); /* E4 (§12.59 (1)) : les mots corrigés en classe (la copie) ; le dessin reste */ const k0 = k; const nS = p8Elements(b).length; const vu = nS ? Math.max(0, (et.nDev || 0) - k0) : Infinity; const fl = typeof et.flash === 'number' && et.flash >= k0 && et.flash < k0 + nS ? et.flash - k0 : null; const bx = (mur._p8 || {})[e.eid + '|' + bi] || {}; h += `<div class="sch p8-sch${marqBloc}${lumBloc}" data-bloc="${bi}">${(b.forme || 'carte') === 'carte' ? '' : `<div class="sch-t" data-p="${bi}.t">${dr_esc(titre)}</div>`}<div class="sch-dessin p8-dessin" data-p8="${bi}" data-vu="${vu}" data-fl="${fl == null ? '' : fl}" data-titre="${dr_esc(titre)}">${p8Dessin(b, bx.W, bx.H, H, TAILLES[et.taille].pt, vu, fl, !!et.atelier, titre)}</div></div>`; k += nS; }
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
  mur.style.fontSize = policePx(H, 32).toFixed(2) + 'px'; poserHtml(mur, h); mur.classList.toggle('avec-bandeau', !!et.bandeau); if (typeof p8RetiresPoser === 'function') p8RetiresPoser(mur, e, et);   /* E4 (§12.59 (3)) */
  /* repris de l'ancien (moteur L1666-1670) : la légende d'une image et ses marques se calent sur la largeur de l'image, pas sur le corps */
  dr_imagesEntieres(mur); /* E1 (§12.34-1, 13 · 65) : l'œuvre entière, la boîte à sa forme */ dr_videoBrancher(mur, et); dr_cleMediasBrancher(mur); /* E1 (§12.44) : la vidéo lue pour de vrai ; les images et PDF de la clé (4 ter) */
  mur.querySelectorAll('.img-sup').forEach(sup => { const L = sup.getBoundingClientRect().width; if (!L) return; sup.querySelectorAll('.mk').forEach(m => { m.style.fontSize = (L * 0.042) + 'px'; }); const lg = sup.parentElement.querySelector('.img-lg'); if (lg) lg.style.fontSize = (L * 0.035) + 'px'; });
  if (et.sansPages) { const corps = mur.querySelector('.corpsd'); if (corps) { let px = parseFloat(corps.style.fontSize); while (corps.scrollHeight > corps.clientHeight + 2 && px > 8) { px -= 0.5; corps.style.fontSize = px.toFixed(2) + 'px'; } } } else if (et.pages) { const cP = mur.querySelector('.corpsd'); if (cP && et.policeRatio) cP.style.fontSize = (et.policeRatio * (mur.clientHeight || 616)).toFixed(2) + 'px'; if (cP && et.pagesP) { const cles = Array.from(cP.querySelectorAll('li, .rep')).map(p85fCle); et.pages = et.pagesP.map(p => p.map(c => cles.indexOf(c)).filter(i => i >= 0)); } appliquerPages(mur, et); } /* (p8-5f) les pages du pilote, à sa police rapportée à la hauteur du tableau */ else paginer(mur, et);
  p8Poser(mur, et); /* (p8-2) le schéma dans la place « plein » réellement disponible */
  if (et.pilote && !et._ref && typeof brancherFin === 'function') brancherFin(); /* E1 (13 · 74) : pas pour le mur de référence */
  const corpsF = mur.querySelector('.corpsd'); if (corpsF && !corpsF.classList.contains('cahier')) { corpsF.scrollTop = 0; corpsF.classList.toggle('p85f-ancre', !corpsF.classList.contains('plein-img') && corpsF.scrollHeight > corpsF.clientHeight + 2); corpsF._p85fDeborde = corpsF.scrollHeight > corpsF.clientHeight + 2; } /* (p8-5f) jamais défilé : ancré en haut, coupé en bas */
  loupeSur(mur, et);
  if (et0 && et0 !== et) { et0.pages = et.pages; et0.pagesP = et.pagesP; et0.page = et.page; et0.policeReduite = et.policeReduite; et0.policeRatio = et.policeRatio; } /* E1 (13 · 74) : pagesP aussi — la pagination de référence de l'Atelier les lit */ /* (p8-5f) les pages de l'atelier reviennent au pilote */
}

function dr_occurrence(li, r, txt){ /* E1 (relecture continue E4, B4 15:50) : quelle occurrence du texte Paul a sélectionnée (0 = la première) — la mise en forme garde la position, plus seulement le texte */ try { const av = document.createRange(); av.setStart(li, 0); av.setEnd(r.startContainer, r.startOffset); const debut = av.toString().length; const tout = li.textContent; let n = 0, i = tout.indexOf(txt); while (i >= 0 && i < debut) { n++; i = tout.indexOf(txt, i + 1); } return n; } catch (e) { return 0; } }
function dr_remplacerNieme(h, e2, n, f){ let i = -1; for (let k = 0; k <= (n || 0); k++) { i = h.indexOf(e2, i + 1); if (i < 0) return h; } return h.slice(0, i) + f(e2) + h.slice(i + e2.length); }
/* (p8-5c) la couleur du texte sur fond clair (le tableau, et — E4, §12.37 — la feuille imprimée) : une seule table */
const DR_TEXTE_COULEURS = { rouge: '#c0392b', vert: '#1e7d45', bleu: '#1f5fbf', or: '#b8860b' };
function surligne(htmlTexte, p, et){ (et.surl || []).filter(x => x.p === p).forEach(x => { const e2 = dr_esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = dr_remplacerNieme(htmlTexte, e2, x.n, e2 => `<mark style="background:${COULEURS[x.couleur] || '#fff1a8'}">${e2}</mark>`); }); /* (p8-5c) la couleur du texte : la donnée garde le nom, le rendu choisit la teinte du tableau (fond crème) */ const TX = DR_TEXTE_COULEURS; (et.coulTxt || []).filter(x => x.p === p).forEach(x => { const e2 = dr_esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = dr_remplacerNieme(htmlTexte, e2, x.n, e2 => `<span class="p8-ct" data-coul="${x.couleur}" style="color:${TX[x.couleur] || 'inherit'}">${e2}</span>`); }); (et.gras || []).filter(x => x.p === p).forEach(x => { const e2 = dr_esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = dr_remplacerNieme(htmlTexte, e2, x.n, e2 => `<b class="p8-gras">${e2}</b>`); }); (et.soul || []).filter(x => x.p === p).forEach(x => { const e2 = dr_esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = dr_remplacerNieme(htmlTexte, e2, x.n, e2 => `<u class="p8-soul">${e2}</u>`); }); /* E1 (R6, R13) gras et souligné, comme la couleur */ return htmlTexte; }

/* E1 (§12.33 bis, dettes 13 · 74-75) : DANS L'ATELIER, LA PAGINATION SE FAIT À LA TAILLE QU'AURA LA DIAPO DANS L'ÉCRAN DE LA CLASSE (S._tailleClasse, dimensionner) — celle d'où partent les pages du tableau ;
   l'Atelier réserve plus de place (sa barre, la poignée, les notes) et sa diapo est plus petite : rendue telle quelle, elle paginerait autrement que la classe ne verra.
   La diapo est rendue dans un mur caché à cette taille ; ses pages (par identité, pagesP) et sa police (rapportée à la hauteur) reviennent à l'Atelier, comme le tableau les reçoit. */
/* E1 (§12.34 (7), 13 · 59) : « Vérifier » (l'import d'un chapitre) — combien de pages ferait au tableau chaque diapo d'une séance pas encore au hub.
   La même mesure que la vignette de l'Atelier (`p85hPages`) : la diapo rendue telle que la classe la voit, à la taille de l'écran de la classe (`dr_tailleRef`).
   `dr_seances()` rend, le temps de la mesure, la séance importée (DR_SEANCES_MESURE) ; rien n'est écrit. Rend un nombre de pages par diapo (null : pas mesurée). */
var DR_SEANCES_MESURE = null;
function dr_pagesImport(ecrans){ if (!Array.isArray(ecrans)) return null; let E; try { E = dr_preparer(JSON.parse(JSON.stringify(ecrans))); } catch (x) { return null; }
  const R = dr_tailleRef(); const z = document.createElement('div'); z.className = 'mur tableau'; z.setAttribute('aria-hidden', 'true'); z.style.cssText = 'position:fixed;left:-20000px;top:0;opacity:0;pointer-events:none;width:' + R.W + 'px;height:' + R.H + 'px';
  let hote = null; if (dr_actif()) dr_zone().appendChild(z); else { hote = document.createElement('div'); hote.className = 'at-som-volet'; hote.setAttribute('aria-hidden', 'true'); hote.style.cssText = 'position:fixed;left:-20000px;top:0;opacity:0;pointer-events:none;width:' + R.W + 'px;height:' + R.H + 'px;margin:0'; hote.appendChild(z); document.body.appendChild(hote); }   /* hors du déroulé ouvert : un hôte qui reçoit les règles de la diapo (dr.css, `:is(#dr-zone,#ses-tab,.at-som-volet)`) */
  const out = []; const sauf = { si: S.si, di: S.di };
  DR_SEANCES_MESURE = [{ titre: '', ecrans: E }];
  try { E.forEach((e, i) => { if (!e || typeof e !== 'object' || e.role === 'fin' || e.role === 'reactivation') { out.push(null); return; }
      const et = { si: 0, di: i, nDev: elements(e).length, lum: [], ecr: [], taille: S.taille, page: 0, reps: {}, tailles: {}, textes: {}, fsBloc: {}, pilote: false, _ref: true };
      try { rendre(z, et); out.push(et.pages && et.pages.length > 1 ? et.pages.length : 1); } catch (x) { out.push(null); } }); }
  finally { DR_SEANCES_MESURE = null; S.si = sauf.si; S.di = sauf.di; z.remove(); if (hote) hote.remove(); }
  return out; }
function dr_tailleRef(){ return (S && S._tailleClasse && S._tailleClasse.H) ? S._tailleClasse : { W: 1096, H: 616 }; }
function dr_paginerReference(mur, et){ if (!(S.atelier && !S.repetition)) return false; const R = dr_tailleRef(); const H0 = mur.clientHeight; if (!H0 || Math.abs(H0 - R.H) < 1) return false;
  let z = $('mur-ref'); if (!z) { z = document.createElement('div'); z.id = 'mur-ref'; z.setAttribute('aria-hidden', 'true'); (typeof dr_zone === 'function' ? dr_zone() : document.body).appendChild(z); } z.className = mur.className; z.style.cssText = 'position:fixed;left:-20000px;top:0;opacity:0;pointer-events:none;width:' + R.W + 'px;height:' + R.H + 'px';
  const et2 = Object.assign({}, et, { _ref: true, pages: null, pagesP: null, policeRatio: null, policeReduite: null }); rendre(z, et2);
  const corps = mur.querySelector('.corpsd'); const page = mur.querySelector('.page'); et.policeReduite = et2.policeReduite; et.policeRatio = et2.policeRatio;
  if (!corps) { if (page) page.textContent = ''; et.pages = null; et.pagesP = null; return true; }
  if (et2.policeRatio) corps.style.fontSize = (et2.policeRatio * H0).toFixed(2) + 'px';
  if (!et2.pagesP || et2.pagesP.length <= 1) { et.pages = null; et.pagesP = null; if (page) page.textContent = ''; let px = parseFloat(corps.style.fontSize); while (corps.scrollHeight > corps.clientHeight + 2 && px > 8) { px -= 0.5; corps.style.fontSize = px.toFixed(2) + 'px'; } return true; } /* une page : le pilote s'ajuste à sa taille, sans paginer */
  const els = Array.from(corps.querySelectorAll('li, .rep')); const cles = els.map(p85fCle); et.pagesP = et2.pagesP; et.pages = et2.pagesP.map(p => p.map(c => cles.indexOf(c)).filter(i => i >= 0));
  if (!et._pageManuelle || et.page == null || et.page >= et.pages.length) et.page = pageDeSuivi(et, els, et.pages); appliquerPages(mur, et); return true; }
function paginer(mur, et){ if (mur.id === 'mur' && !et._ref && dr_paginerReference(mur, et)) return;
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
const etatComplet0 = () => { S.eidCourant = ecran().eid; const __p = !!S.preparation; const __oral = S.oralEnCours && S.oralEnCours.act ? (function(){ const a = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(z => z.id === S.oralEnCours.act); return a ? { num: a.num, titre: a.titre } : null; })() : null; const d = etatDiapo(); const e = ecran(); return { si: S.si, di: S.di, fichePage: (S.fichePage && S.fichePage.di === S.di) ? S.fichePage.bi : null, ficheEntre: !!(S.fichePage && S.fichePage.entre), ficheDev: S.fichePage ? (S.fichePage.nDev || 0) : 0, ficheEcr: S.fichePage ? (S.fichePage.ecr || []).slice() : [], /* E1 (R14) la fiche ouverte se dévoile par paragraphes, ✍🏻 sur un paragraphe */ arrivee: !!(S.arrivee && S.arrivee.di === S.di), neuf: (S.neuf && S.neuf.di === S.di && now() - S.neuf.t < 700) ? S.neuf.k : null, eid: e.eid, qui: S.qui || null, quiTotal: dr_presents(), coupure: !!S.coupure, cahier: (e.role === 'fin') ? (() => { const hc = typeof dr_cahierHorsClasse === 'function' ? dr_cahierHorsClasse(e) : null; /* E4 (§12.38 (3), A91) */ const q = hc && hc.qui ? hc.qui : quiAParticipe(); let ecrit = 0; Object.keys(parDiapo).forEach(k => Object.values(parDiapo[k].reps || {}).forEach(l => l.forEach(r => { if (r.eleve && r.r) ecrit++; }))); const sim = dr_heureDe(hc ? hc.heure : S.heure)/* E1 : lisait HEURES_SIM */; return { horsClasse: !!hc, onglet: S.finVue || 'travail', suite: !!suiteDepuis(S.heure), prepa: !!S.preparation, oral: S.oralEnCours && S.oralEnCours.act ? (function(){ const a = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(z => z.id === S.oralEnCours.act); return a ? { num: a.num, titre: a.titre } : null; })() : null, grand: (S.cahierGrand || {})[S.heure] !== false, /* agrandi par défaut (Paul, 23/09) */ version: (S.recitVersion || {})[S.heure] || 'site', scroll: (S.cahierScroll || {})[S.heure] || 0, recit: (S.finVue === 'contenu') ? (hc ? (hc.contenu || recitPourED(hc.heure)) : recitPourED(S.heure)) : '', /* E4 (§12.38 (3), tranché 02:25) : hors de la classe, le contenu prévu de l'heure (dr_cahierHorsClasse(e).contenu, E1) */ travail: (hc && !(S.travailEdite && S.travailEdite[S.heure] != null) ? (hc.travail || texteTravailED()) : texteTravailED()), date: (S.echeance ? (dr_classe()/* E1 : lisait DATA.classe */.prochaines.find(x => x.iso === S.echeance) || {}).l : null) || (hc && hc.date) || 'la prochaine fois', donne: sim.jour.replace(/^\S+\s/, '').replace(/ \d{4}$/, ''), jour: sim.jour, de: sim.debut.replace(':', ' h '), a: sim.fin.replace(':', ' h '), heure: hc ? hc.heure : S.heure, qui: q, total: dr_presents(), ecrit, oral: S.parts.length }; })() : null, attente: S.close ? { h: hhmm(), d: dr_heureDe(S.heure)/* E1 : lisait HEURES_SIM */.jour, n: dr_classe()/* E1 : lisait DATA.classe */.nom, c: seance().titre } : null, flash: (S.flash && S.flash.di === S.di && now() - S.flash.t < 10500) ? S.flash.k : null, surl: (d.surl || []).slice(), coulTxt: (d.coulTxt || []).slice(), gras: (d.gras || []).slice(), soul: (d.soul || []).slice(), /* E1 (R6, R13) */ deja: (glisseeDe(e) ? dejaVuAvant(S.di) : 0), nDev: d.nDev, lum: d.lum.slice(), ecr: d.ecr.slice(), taille: S.taille, page: S.page, loupe: S.loupe, bandeau: S.bandeau, reps: JSON.parse(JSON.stringify(d.reps)), tailles: Object.assign({}, d.tailles), textes: Object.assign({}, d.textes), fsBloc: Object.assign({}, d.fsBloc), _blocActif: S.blocActif, _pageManuelle: !!S.pageManuelle, encart: S.encart || null, doc: S.doc ? Object.assign({}, S.doc) : null, videoPos: S.videoPos[e.eid] || 0, videoLecture: !!S.videoLecture, videoDe: (S.videoDe || {})[e.eid] || 0, videoT0: (S.videoT0 || {})[e.eid] || 0 }; };   /* E1 (§12.44) : le segment à lire (de → jusqu'au repère) */

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
function dimensionner(){ const sc = document.querySelector('.scene'); const cadre = $('murcadre'); if (!sc || !cadre) return; const alerte = $('alerte-video').style.display === 'block' ? $('alerte-video').offsetHeight + 7 : 0; const enAtelier = !!(S.atelier && !S.repetition);
  /* E1 (§12.33 bis, dette 13 · 74) : l'écran de la classe et la répétition gardent EXACTEMENT la taille de ⑤ (la barre de la classe, le titre, 16 + 21 + 44) — la pagination du tableau en dépend ;
     seul l'Atelier compte ce qui y est réellement visible (§12.33-1, 13 · 55 : sa barre, la poignée, le minimum des notes). Dans les deux, la poignée garde ses 12 px (dr.css) : elle reste dans l'écran. */
  const titre = (document.querySelector('.titre') || {}).offsetHeight || 0; const autourClasse = dr_hOutilsClasse(sc) + titre + alerte + 16 /* padding */ + 21 /* gaps */ + 44 /* notes au minimum */;
  const taille = autour => { const wDispo = sc.clientWidth - 32; const hDispo = (sc.clientHeight - autour) * (S.preparation ? (S.murPart || 1) : 1); const part = S.vue || 1; let w = Math.min(wDispo, hDispo * 16 / 9) * part; let h = w * 9 / 16; if (h > hDispo) { h = hDispo; w = h * 16 / 9; } if (!S.preparation && (S.murPart || 1) < 1) { h = h * S.murPart; w = h * 16 / 9; } /* (p8-5e) hors préparation, la part s'applique à la hauteur obtenue : la poignée agit dès le premier pixel */ return { w, h }; };
  const tc = taille(autourClasse); S._tailleClasse = { W: Math.floor(tc.w), H: Math.floor(tc.h) }; /* la diapo telle qu'elle sera dans l'écran de la classe : la pagination et « trop pleine » de l'Atelier s'y mesurent (13 · 75) */
  let t = enAtelier ? taille(dr_hauteurAutour(sc, cadre, alerte)) : tc; cadre.style.width = Math.floor(t.w) + 'px'; cadre.style.height = Math.floor(t.h) + 'px';
  if (enAtelier) { const deb = sc.scrollHeight - sc.clientHeight; if (deb > 0) { const h = Math.max(60, t.h - deb); cadre.style.width = Math.floor(h * 16 / 9) + 'px'; cadre.style.height = Math.floor(h) + 'px'; } } /* E1 (13 · 55) : dans l'Atelier, s'il déborde encore (un zoom, une barre qui passe à la ligne), la diapo cède ce qui manque */ }
/* E1 (§12.33 bis) : la hauteur de la barre de la classe (.outils), même quand l'Atelier la cache — mesurée sur une copie hors écran, à la largeur de la scène */
function dr_hOutilsClasse(sc){ const o = document.querySelector('#dr-zone .outils') || document.querySelector('.outils'); if (!o) return 0; if (o.offsetHeight) { S._hOutils = o.offsetHeight; return S._hOutils; } const L = sc.clientWidth - 32; if (S._hOutils && S._hOutilsL === L) return S._hOutils;
  const c = o.cloneNode(true); c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); c.removeAttribute('id'); c.style.cssText = 'position:absolute;left:-20000px;top:0;visibility:hidden;width:' + L + 'px'; c.style.setProperty('display', 'flex', 'important'); o.parentElement.appendChild(c); const hh = c.offsetHeight; c.remove(); if (hh) { S._hOutils = hh; S._hOutilsL = L; } return hh || S._hOutils || 0; }
/* E1 (§12.33-1) : la hauteur prise par tout ce qui partage la scène avec la diapo (enfants visibles hors diapo et notes, marges, espaces) + le minimum des notes */
function dr_hauteurAutour(sc, cadre, alerte){ const cs = getComputedStyle(sc); const notes = sc.querySelector(':scope > .notes'); const vis = Array.from(sc.children).filter(e => e !== cadre && e !== notes && e.id !== 'alerte-video' && getComputedStyle(e).display !== 'none' && getComputedStyle(e).position !== 'absolute' && getComputedStyle(e).position !== 'fixed');
  const gap = parseFloat(cs.rowGap) || 7; const n = vis.length + 1 + (notes ? 1 : 0); const notesMin = notes ? Math.max(44, parseFloat(getComputedStyle(notes).minHeight) || 0) : 0;
  return vis.reduce((t, e) => t + e.offsetHeight, 0) + alerte + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0) + gap * Math.max(0, n - 1) + notesMin; }

dr_ecouteWin('resize', () => { dimensionner(); dr_tout(); });
/* E1 (§12.54, la ⑧, cas 41 d'E3 rouge 2 fois sur 3 : « Reprendre » → 3 lignes → 4 lignes) : la règle du redessin — la diapo prend la taille de la scène À CHAQUE fois que la
   scène change de taille, pas seulement au rendu ou au redimensionnement de la fenêtre. Mesuré : depuis l'horloge de la case (§12.55, `#dr-hcase` et `#dr-t5` posés dans
   l'entête par une minuterie), l'entête passe à deux lignes à 1707 × 743 (46 → 80 px) APRÈS le dernier rendu : la scène rétrécit de 34 px, la diapo garde son ancienne taille
   (les notes sortent de l'écran) — et sa pagination dépend alors de l'instant du dernier rendu : avant la reprise une page, après la reprise une autre. */
(function(){ try { let raf = 0, dim = ''; const ro = new ResizeObserver(() => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const sc = document.querySelector('.scene'); if (!sc || !dr_actif()) return; const d = sc.clientWidth + 'x' + sc.clientHeight; if (d === dim) return; const avant = dim; dim = d; if (!avant) return; try { dimensionner(); dr_tout(); } catch (e) {} }); });
  const brancher = () => { const sc = document.querySelector('#dr-zone .scene') || document.querySelector('.scene'); if (sc && !sc._drRo) { sc._drRo = true; ro.observe(sc); } }; brancher(); setInterval(brancher, 2000); } catch (e) {} })();

S.lg = 186;
 S.ld = 336;
/* E4 (§12.36 (7), Paul 23:22 « Oui 697 ») : la colonne de droite retient sa largeur pour ce navigateur, comme celle de gauche (une clé chacune, sous try) */
function dr_ldLire(){ try { const v = JSON.parse(localStorage.getItem('mjpc_atelier_colonne_droite') || 'null'); if (v && typeof v.l === 'number') { S.ld = Math.max(60, Math.min(1200, v.l)); S.sansDroite = !!v.rep; } } catch (e) {} }
function dr_ldGarder(){ try { localStorage.setItem('mjpc_atelier_colonne_droite', JSON.stringify({ l: S.ld, rep: !!S.sansDroite })); } catch (e) {} }
dr_ldLire();

function poserColonnes(){ const c = $('corps'); c.style.setProperty('--lg', (S.sansGauche ? 0 : S.lg) + 'px'); c.style.setProperty('--ld', (S.sansDroite ? 0 : S.ld) + 'px'); c.classList.toggle('sans-gauche', !!S.sansGauche); c.classList.toggle('sans-droite', !!S.sansDroite); }

function dr_tirer(poignee, cote){ let dep = null; poignee.addEventListener('mousedown', ev => { ev.preventDefault(); dep = { x: ev.clientX, lg: S.sansGauche ? 0 : S.lg, ld: S.sansDroite ? 0 : S.ld }; poignee.classList.add('tire'); document.body.style.cursor = 'col-resize'; });
  dr_ecouteDoc('mousemove', ev => { if (!dep) return; const max = Math.floor(innerWidth * 0.45); if (cote === 'g') { const l = Math.max(0, Math.min(max, dep.lg + (ev.clientX - dep.x))); S.sansGauche = l < 60; if (!S.sansGauche) S.lg = l; } else { const l = Math.max(0, Math.min(max, dep.ld - (ev.clientX - dep.x))); S.sansDroite = l < 60; if (!S.sansDroite) S.ld = l; } poserColonnes(); dimensionner(); });
  dr_ecouteDoc('mouseup', () => { if (!dep) return; /* repliée par le geste : elle rouvrira à sa largeur d'avant le geste */ if (cote === 'g' && S.sansGauche && dep.lg >= 60) S.lg = dep.lg; if (cote === 'd' && S.sansDroite && dep.ld >= 60) S.ld = dep.ld; if (cote === 'd') dr_ldGarder(); dep = null; poignee.classList.remove('tire'); document.body.style.cursor = ''; dr_tout(); });
  poignee.addEventListener('dblclick', () => { if (cote === 'g') S.sansGauche = !S.sansGauche; else { S.sansDroite = !S.sansDroite; dr_ldGarder(); } poserColonnes(); dr_tout(); }); }

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

function creneauDe(di){ /* l'heure prévue d'une diapo : la base de son heure + le cumul des durées avant elle */ const E = seance().ecrans; const h = E[di].heure; const o = ordreHeure(h); let t = dr_heureDe(h)/* E1 : lisait HEURES_SIM */ ? dr_heureDe(h)/* E1 : lisait HEURES_SIM */.base : 0; for (const i of o) { if (i === di) break; if (!E[i].masquee) t += (E[i].dur || 0) * 60000; } return { debut: t, fin: t + (E[di].masquee ? 0 : (E[di].dur || 0)) * 60000 }; }   /* EX (§12.62 (4)) : une diapo masquée ne prend pas de temps à l'heure */

/* E1 (§12.25 (5)) : l'entête de l'Atelier dit le réglage de la séance — ouvrir chaque heure par la réactivation, oui (le défaut) ou non — par les deux fonctions d'E2 ; un clic le change */
function dr_reglageReactHtml(){ if (typeof dr_reglageReactivationLu !== 'function') return ''; let v = null, brut; try { const sk = dr_cleSeance(S.si); v = dr_reglageReactivationLu(sk); brut = ((dr_seance(sk) || {}).deroule || {}).reactivation; } catch (e) {} const non = v === 'non'; /* « (par défaut) » : rien n'est posé pour la séance (E2 lit l'absent comme « oui ») */ return `<div class="sea2 dr-react" data-dr-react="${non ? 'oui' : 'non'}" style="cursor:pointer" title="Le réglage de cette séance : ce qui est proposé à l'ouverture de chaque heure (tu choisis encore à chaque heure). Clique pour le changer">Ouvrir chaque heure par la réactivation : <b>${non ? 'non' : 'oui'}</b>${brut === 'oui' || brut === 'non' ? '' : ' (par défaut)'}</div>`; }
function dr_reglageReactBrancher(z){ const b = z && z.querySelector('[data-dr-react]'); if (!b || b._ok) return; b._ok = true; b.style.cursor = 'pointer'; b.onclick = () => { if (typeof dr_reglageReactivation !== 'function') return; try { dr_reglageReactivation(dr_cleSeance(S.si), b.dataset.drReact); } catch (e) {} dr_tout(); }; }
/* E4 (§12.36 (3)(5)(6), A84) : sous la séance ouverte, son réglage, ses heures et ses diapos — plus de doublons (ni « Chapitre · … » ni « Séance n — … ») ;
   la ligne d'heure dit sa date et sa case (« H1 · lun. 14/09 · 08:57 → 09:52 », puis « 57 min prévues pour 50 utiles +7 ») et ouvre sa première diapo ;
   chaque diapo dit son heure prévue (`creneauDe`) à la place de son numéro. La date et la case : la source de l'heure (E1, `dr_heureAVenir`) — affichée, jamais recalculée ici. */
function dr_voletHeure(hh){ let v = null; try { v = typeof dr_heureAVenir === 'function' ? dr_heureAVenir(hh) : null; } catch (e) {} if (!v && S.lancee && !S.close && hh === S.heure) { try { v = dr_heureDe(hh); } catch (e) {} } return v && v.base ? v : null; }
function dr_hhmm(ms){ const d = new Date(ms); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function voletAtelier(){ const E = seance().ecrans; const heures = [...new Set(E.map(e => e.heure))].sort(); const acts = dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []; const numA = i => { const a = actDe(E[i]); return a ? 'A' + a.num : ''; }; let h = `<div class="at-chap">${dr_reglageReactHtml()}`; heures.forEach(hh => { const o = ordreHeure(hh); const prevu = o.filter(i => E[i].role !== 'fin' && !E[i].masquee).reduce((t, i) => t + (E[i].dur || 0), 0); const sim = dr_voletHeure(hh); const utiles = sim && sim.utiles ? sim.utiles : 50; const dep = prevu + 5 - utiles; const jour = sim ? new Date(sim.base).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' }) : '';
    h += `<div class="fr dr-fr"${o.length ? ' data-at-hdi="' + o[0] + '"' : ''} title="Ouvre la première diapo de cette heure"><div class="dr-fr-l1">H${hh} · ${sim ? dr_esc(jour) + ' · ' + dr_esc(sim.debut) + ' → ' + dr_esc(sim.fin) : 'pas encore à l’emploi du temps'}${dr_heureEstJouee(hh) ? ' · jouée' : ''}</div><div class="dr-fr-l2">${prevu + 5} min prévues pour ${utiles} utiles ${dep > 0 ? '<span class="plus" title="Ce que l\'heure dépasse : réduis une durée ou déplace une diapo">+' + dep + '</span>' : '<span style="color:var(--joue)">✔</span>'}</div></div>`;
    let cumul = 0; const sel = typeof dr_colSel === 'function' ? dr_colSel() : []; o.forEach(i => { const e = E[i]; const quand = sim ? dr_hhmm(creneauDe(i).debut) : '+' + cumul + '′'; if (!e.masquee) cumul += e.role === 'fin' ? 5 : (e.dur || 0); const fixe = e.role === 'fin' || (typeof roleFixe === 'function' && !!roleFixe(e));   /* EX (§12.62 (4)) : l'identité sur la ligne (data-eid), le glisser, la sélection, « masquée » ; une diapo sans titre le dit ici (jamais au mur) */
      h += `<div class="dr-d${i === S.di ? ' on' : ''}${e.masquee ? ' dr-masq' : ''}${sel.indexOf(e.eid) >= 0 ? ' dr-sel-d' : ''}${dr_estInvariable(e) ? ' dr-inv' : ''}" data-at-di="${i}" data-eid="${dr_esc(String(e.eid || ''))}"${fixe ? '' : ' draggable="true"'} title="${dr_esc(dr_colBulle(e, fixe))}"><span class="dr-n dr-quand">${quand}</span><span class="t">${e.role === 'fin' ? 'Cahier de textes' : (String(e.act || '').trim() ? dr_esc(e.act) : '<i class="dr-sans-titre">sans titre</i>')}${(function(){ const n = (p85hPages(i).pages || [0]).length; return n > 1 ? '<span class="p85h-pages" title="Cette diapo se lit en ' + n + ' pages au tableau (le texte ne tient pas au plancher lisible d\'une page) : en classe, une vignette par page"> · ' + n + ' pages</span>' : ''; })()}</span>${e.masquee ? '<span class="dr-tag" title="Masquée : elle reste dans la trame, mais la classe ne la voit jamais et elle ne se joue pas ; ses minutes ne comptent pas — clic droit → « Ne plus masquer »">masquée</span>' : ''}${e.role === 'fin' ? '' : '<span class="a">' + numA(i) + '</span>'}<span class="dr-h">${e.role === 'fin' ? 5 : (e.dur || 0)} min</span></div>`; }); }); h += `</div>`; return h; }
/* EX (§12.62 (4)) : l'infobulle d'une ligne de la colonne, pour Paul — ce que fait chaque geste (le début reste celui que le banc lit, A84) */
function dr_colBulle(e, fixe){ return 'Clic : ouvre cette diapo · double-clic : la renommer' + (fixe ? '' : ' · glisser : la déplacer') + ' · Ctrl + clic ou Maj + clic : en choisir plusieurs · clic droit : insérer avant ou après, renommer, masquer, copier, coller, envoyer, supprimer' + (dr_estInvariable(e) ? ' — posée par le site au début de la séance (' + DR_INV_NOM[e.role] + '), remplie depuis le chapitre' : e.role === 'fin' ? ' — posée par le site : le cahier de textes de la fin de l’heure' : ''); }

function droiteAtelier(){ const E = seance().ecrans; const e = ecran(); const aide = S.aideFermee ? '' : '<div class="at-d at-aide" id="at-aide"><span class="x" title="Ferme l\'aide">✕</span><b>Écrire dans la diapo</b> — un clic dans un bloc, tu tapes ; <b>Tab</b> passe à l\'élément suivant, <b>Maj + Tab</b> au précédent, <b>Entrée</b> en fin de ligne crée l\'élément suivant, <b>Échap</b> annule une ligne vide ; <b>Alt + ↑ / ↓</b> monte ou descend le bloc. Rien à sauver : c\'est enregistré quelques secondes après la frappe, et le témoin le dit.</div>'; const r = droiteAtelier0(e, E); return r[0] + aide + r[1]; }   /* EX (§12.62 (1)) : la carte seule en haut, l'aide dessous */

function droiteAtelier0(e, E){ const a = actDe(e); const dA = a ? diaposAct(a) : [e]; const rang = a ? dA.indexOf(S.di) + 1 : 1; const cr = creneauDe(S.di); const sim = dr_heureDe(e.heure)/* E1 : lisait HEURES_SIM */; const comp = (e.comp || []).map(libNotion); const remob = (e.remob || []).map(libNotion); const nEl = elements(e).length;
  const acts0 = dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []; const heures = [...new Set(E.map(z => z.heure))].sort(); const chips = (ids, quoi) => ids.map(id => `<span class="dr-chip" data-n="${dr_esc(id)}" title="${dr_esc(libNotion(id))}">${dr_esc(libNotion(id))}<span class="x" data-retire="${quoi}" data-id="${dr_esc(id)}" title="Retire cette notion">✕</span></span>`).join('');
  /* EX (§12.62 (1), Paul 28/10 « 93 oui ») : la carte est ouverte par défaut, seule en haut de la colonne (l'aide et le chapitre dessous) ; chaque champ se voit comme un champ ;
     « — hors activité » est un choix permis (horsActivite), pas une faute ; « réactivation » reste dans la liste, grisée avec sa raison (elle vit dans la copie de la classe :
     choisie pour une diapo de la trame, la diapo disparaissait — mesuré, JOURNAL d'EX, mission 0) ; la diapo d'ouverture a sa carte, comme la fin d'heure. Replier : « replier ». */
  const ouverte = !S.declareRepliee; const corr = (S.declareLigne && S.declareEid === e.eid) ? `<div class="corr">⚠ À corriger ici : ${dr_esc(S.declareLigne)}</div>` : '';
  const masq = e.masquee ? `<div class="l dr-masq-l">⊘ <b>Masquée</b> — elle reste dans la trame ; la classe ne la voit jamais et elle ne se joue pas ; ses minutes ne comptent pas · <span class="plus" data-masquer="0" title="La diapo revient dans l'heure : la classe la verra et ses minutes comptent de nouveau">ne plus masquer</span></div>` : '';
  const titreChamp = `<span class="ed dr-champ" id="dc-titre" contenteditable="plaintext-only" title="Le titre de la diapo — le même que dans la colonne de gauche (double-clic : renommer) et que l'étiquette en haut de la diapo au tableau ; vide, rien ne s'écrit au tableau">${dr_esc(e.act)}</span>`;
  const durChamp = `<input id="dc-dur" class="dr-champ" type="number" min="0" value="${e.dur || 0}" style="width:56px" title="Les minutes prévues pour cette diapo — 0 : elle ne compte pas dans l'heure ; l'heure prévue de la suite se recalcule">`;
  const quand = `Heure prévue : <b>H${e.heure}</b>${sim ? ' (' + dr_esc(sim.jour.replace(/ 2026$/, '')) + ')' : ''} · ${hhmm(cr.debut)} → ${hhmm(cr.fin)}`;
  let x;
  if (e.role === 'fin') x = `<div class="at-d"><h5>CE QUE LA DIAPO DÉCLARE</h5><div class="l"><b>Fin d'heure</b> — posée par le site, les cinq minutes réservées au cahier ; pas de numéro d'activité ; ne se duplique pas, ne glisse pas, ne se retire pas (2.6)</div><div class="l">Heure : <b>H${e.heure}</b>${sim ? ' (' + dr_esc(sim.jour.replace(/ 2026$/, '')) + ')' : ''} · 5 min</div></div>`;
  else if (dr_estInvariable(e)) { const intacte = dr_invIntacte(e); const k = intacte ? dr_invContenu(e.role, dr_cleSeance(S.si)) : { manque: [] }; const nom = DR_INV_NOM[e.role];
    x = `<div class="at-d at-declare"><h5>CE QUE LA DIAPO DÉCLARE</h5><div class="l"><b>${dr_esc(nom.charAt(0).toUpperCase() + nom.slice(1))}</b> — posée par le site au début ${e.role === 'presentation-chapitre' || e.role === 'plan' ? 'de la première séance du chapitre' : 'de la séance'}, remplie depuis le chapitre avec les mots de la feuille sommaire ; hors activité ; elle ne se duplique pas et ne glisse pas ; tu peux la retirer (clic droit → « Retirer ») : le site ne la remettra pas.</div>${intacte ? '<div class="l at-note">Elle suit le chapitre : ce qui change dans le chapitre (Structure, un nouvel import) y paraît. Dès que tu écris dedans, elle est à toi et ne suit plus le chapitre.</div>' : '<div class="l at-note">Tu l’as modifiée : elle ne suit plus le chapitre.</div>'}${k.manque.length ? `<div class="l al">⚠ Il manque dans le chapitre : ${dr_esc(k.manque.join(' ; '))}<i>rien n’est écrit à sa place au tableau — écris-le dans le chapitre, ou dans la diapo</i></div>` : ''}${masq}<div class="l">Diapo : ${titreChamp} · durée ${durChamp} min</div><div class="l">${quand}</div></div>`; }
  else if (!ouverte) x = `<div class="at-d at-declare"><h5>CE QUE LA DIAPO DÉCLARE <span class="modif" data-declare="ouvrir" title="Rouvre la carte : activité, titre, durée, rôle, heure prévue, notions, légende">ouvrir</span></h5>${corr}<div class="l lire">${a ? '<b>A' + a.num + ' · ' + dr_esc(a.titre) + '</b> — diapo ' + rang + ' sur ' + dA.length + ' de l\'activité' : e.horsActivite ? '<b>hors activité</b>' : '<b style="color:#ff8a8e">sans activité</b> — à rattacher à une activité, ou à mettre « hors activité »'}${e.role ? ' · rituel : <b>' + (e.role === 'reactivation' ? 'réactivation' : e.role) + '</b>' : ''}<br>${quand} · ${e.dur || 0} min<br>Notions travaillées : ${(e.comp || []).length ? (e.comp || []).map(n => '<b>' + dr_esc(libNotion(n)) + '</b>').join(', ') : '<i>aucune</i>'}<br>Remobilise : ${(e.remob || []).length ? (e.remob || []).map(n => '<b>' + dr_esc(libNotion(n)) + '</b>').join(', ') : 'rien'}${e.legende ? '<br>Surlignage : ' + dr_esc(Object.keys(e.legende).map(k => k + ' = ' + e.legende[k]).join(' · ')) : ''}</div>${masq}</div>`;
  else x = `<div class="at-d at-declare"><h5>CE QUE LA DIAPO DÉCLARE <span class="modif" data-declare="replier" title="Replie la carte en quatre lignes ; « ouvrir » la rouvre">replier</span></h5>${corr}${masq}<div class="l">Activité : <select id="dc-act" class="dr-champ" title="L'activité de cette diapo — une activité a un numéro continu sur le chapitre, un titre, une ou plusieurs diapos (3.2 bis) ; « hors activité » : la diapo n'appartient à aucune activité (une image, une transition) — c'est permis, ce n'est pas une faute">${!a && !e.horsActivite ? '<option value="?" selected disabled>— sans activité : à rattacher</option>' : ''}${acts0.map(z => `<option value="${z.id}" ${a && a.id === z.id ? 'selected' : ''}>A${z.num} · ${dr_esc(z.titre)}</option>`).join('')}<option value="" ${!a && e.horsActivite ? 'selected' : ''}>— hors activité</option><option value="+">+ nouvelle activité…</option></select></div>${a ? `<div class="l">Titre de l'activité : <span class="ed dr-champ" id="dc-atitre" contenteditable="plaintext-only" title="Le titre de l'activité, écrit ici">${dr_esc(a.titre)}</span> <span class="at-note">· ${dA.length} diapo${dA.length > 1 ? 's' : ''} · diapo ${rang} sur ${dA.length}</span></div>` : ''}<div class="l">Diapo : ${titreChamp} · durée ${durChamp} min · rôle : <select id="dc-role" class="dr-champ" title="bilan : dernier de la séance, unique · la réactivation et la fin d'heure ne se choisissent pas ici (grisées : leur raison est dans la liste)"><option value="" ${!e.role ? 'selected' : ''}>aucun</option><option value="reactivation" disabled ${e.role === 'reactivation' ? 'selected' : ''}>réactivation — elle vit dans la copie de la classe : tu la choisis à l'ouverture de l'heure (« Ouvrir par la réactivation »)</option><option value="bilan" ${e.role === 'bilan' ? 'selected' : ''}>bilan (dernier de la séance)</option><option value="fin" disabled>fin d'heure (posée par le site)</option></select></div><div class="l">${quand} — <span class="at-note">proposée d'après les durées</span>${(heures.includes(e.heure + 1) || (e.heure === Math.max(...heures) && !e.role)) ? ` · <span class="plus" data-heure="${e.heure + 1}" title="Passe la diapo en H${e.heure + 1}, en tête de cette heure : le compte des deux heures se recalcule">↓ passer en H${e.heure + 1}</span>` : ''}${heures.includes(e.heure - 1) ? ` · <span class="plus" data-heure="${e.heure - 1}" title="Passe la diapo en H${e.heure - 1}, à la fin de cette heure (avant sa fin d'heure)">↑ passer en H${e.heure - 1}</span>` : ''}</div><div class="l">Notions travaillées : ${chips(e.comp || [], 'comp')} <span class="plus" data-plus="comp" title="Ajoute une notion travaillée par cette diapo">+ notion…</span></div><div class="l">Remobilise : ${chips(e.remob || [], 'remob')} <span class="plus" data-plus="remob" title="Ajoute une notion que cette diapo suppose acquise">+ notion…</span> · <span class="plus" data-proposer="1" title="Proposition par défaut : les notions de la même famille travaillées plus tôt dans le chapitre (2.7)">proposer</span></div><div class="l">Légende de surlignage : <span class="ed dr-champ" id="dc-leg" contenteditable="plaintext-only" title="jaune = … · vert = … (facultatif)">${e.legende ? Object.keys(e.legende).map(k => k + ' = ' + e.legende[k]).join(' · ') : ''}</span>${e.legende ? '' : '<span class="at-note"> (facultatif)</span>'}</div><div class="l">Éléments : ${nEl}${nEl > 1 ? ' · dévoilés un par un' : ''}</div></div>`;
  const carte = x; x = '';
  /* le travail à faire prévu par heure (2.3) */ const tp = dr_travail()/* E1 : lisait DATA.travailPrevu */ || (dr_travail()/* E1 : lisait DATA.travailPrevu = {} — le socle tient l'objet */); const cleTp = S.si + '|' + e.heure; const hSuiv = heures.filter(z => z > e.heure); x += `<div class="at-d${(S.plis || {}).tp === false ? '' : ' pli'}"><h5 data-pli="tp" title="Un clic pour ouvrir ou replier">L'HEURE ${e.heure} — le travail à faire prévu</h5><div class="l">Proposé au T-5 de cette heure, dans le cahier de textes : <span class="ed" id="dc-tp" contenteditable="plaintext-only" title="Le travail à faire que le T-5 proposera à la fin de cette heure ; ce que l'heure suivante remobilisera">${dr_esc(tp[cleTp] || '')}</span>${tp[cleTp] ? '' : '<span class="at-note"> (rien de prévu)</span>'}</div><div class="l at-note">Le spiralaire : ce que l'heure suivante remobilisera.</div></div>`;
  /* les activités du chapitre (3.2 bis) */ const sansNum = E.map((z, i) => ({ z, i })).filter(o => !o.z.role && !actDe(o.z) && !o.z.horsActivite && !o.z.masquee);   /* EX (§12.62 (1)) : « hors activité » choisi n'est pas une faute */ x += `<div class="at-d${(S.plis || {}).acts === false ? '' : ' pli'}"><h5 data-pli="acts" title="Un clic pour ouvrir ou replier">LES ACTIVITÉS DU CHAPITRE (${acts0.length})</h5>${acts0.slice().sort((p1, p2) => p1.num - p2.num).map(z => { const d = diaposAct(z); const hs = [...new Set(d.map(i => E[i] && E[i].heure).filter(Boolean))]; return `<div class="act-l"><span class="dr-n">A${z.num}</span><span>${dr_esc(z.titre)}</span><span class="dr-d">${d.length} diapo${d.length > 1 ? 's' : ''} · ${hs.map(h => 'H' + h).join(', ') || '—'}</span></div>`; }).join('')}${sansNum.map(o => `<div class="act-l sans"><span class="dr-n">—</span><span>${dr_esc(o.z.act)}</span><span class="dr-d dr-warn">sans numéro d'activité : refus à l'import (3.2 bis)</span></div>`).join('')}<div class="l"><span class="plus" data-nouvelle-act="1" title="Une activité de plus, numérotée à la suite">+ activité</span> · <span class="plus" data-renum="1" title="Renumérote toutes les activités dans l'ordre des diapos, sans trou">renuméroter (continu)</span></div></div>`;
  x += p8Panneau(e); /* (p8-3) le panneau du schéma */ /* pour la classe : le temps et les notions */ const alertes = []; const h = e.heure; const o = ordreHeure(h); const prevu = o.filter(i => E[i].role !== 'fin' && !E[i].masquee).reduce((t, i) => t + (E[i].dur || 0), 0); const dep = prevu + 5 - 50; if (dep > 0) alertes.push(`⚠ L'heure ${h} dépasse de ${dep} min<i>${prevu} min d'activités + 5 min de cahier pour 50 utiles — le T-5 le redira ; réduis une durée ou déplace une diapo</i>`); /* E1 (§12.34-3, dette 13 · 69) : une notion se juge sur tout le chapitre (prompt §1.2 : « les notions travaillées depuis le début du chapitre ») — les séances d'avant, puis celle-ci jusqu'à la diapo ; « plus tard » et « nulle part » sur tout le chapitre */
  const SEch = (typeof dr_seances === 'function' ? dr_seances() : []) || []; const Eavant = SEch.slice(0, S.si).flatMap(d => (d && d.ecrans) || []); const Etout = SEch.flatMap(d => (d && d.ecrans) || []); const compAvant = new Set(Eavant.flatMap(z => z.comp || []));
  const compTous = new Set((Etout.length ? Etout : E).flatMap(z => z.comp || [])); E.forEach((z, i) => (z.remob || []).forEach(id => { const avant = compAvant.has(id) || E.some((y, j) => j < i && (y.comp || []).includes(id)); if (!avant) alertes.push(`⚠ « ${dr_esc(z.act)} » (H${z.heure}) remobilise une notion que rien ne travaille avant<i>« ${dr_esc(libNotion(id))} »${compTous.has(id) ? ' est travaillée plus tard — remonte l\'activité qui la travaille, ou change l\'ordre' : ' n\'est travaillée nulle part dans le chapitre'}</i>`); })); const jamais = [...new Set(E.flatMap(z => z.remob || []))].filter(id => !compTous.has(id)); if (jamais.length) alertes.push(`⚠ ${jamais.length} notion${jamais.length > 1 ? 's' : ''} remobilisée${jamais.length > 1 ? 's' : ''} ${jamais.length > 1 ? 'ne sont travaillées' : 'n\'est travaillée'} par aucune activité<i>${jamais.map(id => '« ' + dr_esc(libNotion(id)) + ' »').join(', ')} — prévue${jamais.length > 1 ? 's' : ''} nulle part</i>`); x += `<div class="at-d"><h5>POUR LA CLASSE — le temps et les notions</h5>${alertes.length ? alertes.map(t => '<div class="l al">' + t + '</div>').join('') : '<div class="l ok">✔ Rien à signaler : l\'heure tient, les notions remobilisées sont travaillées avant</div>'}</div>`;
  /* sur la forme : seulement s'il y a quelque chose à dire — la part de la diapo ouverte de la liste « À régler » */ const forme = alertesForme().filter(a => a.di === S.di).map(a => `⚠ ${dr_esc(a.l)}<i>${dr_esc(a.faire)}</i>`); if (forme.length) x += `<div class="at-d"><h5>SUR LA FORME — ce qui peut casser en classe</h5>${forme.map(t => '<div class="l al">' + t + '</div>').join('')}<div class="at-note">Ces alertes ne s'affichent jamais pendant une heure réelle : elles se règlent ici, ou dans « À régler » du chapitre.</div></div>`;
  /* le chapitre */ const acts = dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []; const nH = [...new Set(E.map(z => z.heure))].length; const Ejusque = Eavant.concat(E.slice(0, S.di + 1)); const notions = [...new Set(Ejusque.flatMap(z => (z.comp || []).concat(z.remob || [])))]; const compJusque = new Set(Ejusque.flatMap(z => z.comp || [])); const trav = notions.filter(id => compJusque.has(id)); /* E1 (13 · 69) : le chapitre jusqu'à la diapo ouverte */ x += `<div class="at-d"><h5>LE CHAPITRE</h5><div class="l">${dr_cles().length} séance${dr_cles().length > 1 ? 's' : ''} dans le chapitre · ${nH} h · ${E.length} diapos · ${acts.length} activités · notions : ${notions.length}, <span class="dr-ok">travaillées : ${trav.length}</span>${notions.length - trav.length ? ', <span class="al">jamais travaillées : ' + (notions.length - trav.length) + '</span>' : ''}</div><div class="l">Pages HTML : <b>${E.reduce((t, z) => t + (z.blocs || []).filter(b => b.t === 'html' || b.t === 'page').length, 0)}</b> · objets manquants à l'éditeur : <b>${dr_manques().length}</b> <span class="at-note">(à faire tendre vers zéro, 4.4)</span></div><div class="at-regler"><button id="at-regler" title="La liste complète de ce qui peut casser en classe dans ce chapitre, avec la marche à suivre et le texte prêt à copier pour l'instance (6.1)">À régler (${(typeof alertesChapitre === 'function' ? alertesChapitre() : alertesForme()).length})</button> <span class="at-note">— la seule liste de ce que tu as à faire ; chaque ligne dit le geste</span></div></div>`; return [carte, x]; }

// ───────── navigation, gardes, gel ─────────
let gardeEnAttente = null;

function apercuOuvrir(diapos, k){ if (!diapos.length) return; S._apercu = { diapos, k }; const i = diapos[k]; const e = seance().ecrans[i]; $('gc-ap-titre').textContent = `${libDiapo(i).replace(/^d/, 'D')} — ${e.act} (${k + 1}/${diapos.length}${numDe(e) ? ', activité ' + numDe(e) : ''})`; const m = $('gc-ap-mini'); m.innerHTML = ''; m.dataset.hash = ''; const w = Math.min(1096, innerWidth - 80); const sc = w / 1096; m.style.height = Math.round(616 * sc) + 'px'; const inner = document.createElement('div'); inner.className = 'mur'; inner.style.transform = `scale(${sc})`; m.appendChild(inner); const st = parDiapo[K(i)] || {}; rendre(inner, { si: S.si, di: i, nDev: elements(e).length, lum: [], ecr: [], taille: 1, page: 0, reps: st.reps || {}, tailles: st.tailles || {}, textes: st.textes || {}, fsBloc: {}, pilote: false, videoPos: S.videoPos[e.eid] || 0, sansPages: true, eid: e.eid }); const pg = inner.querySelector('.page'); if (pg) pg.textContent = ''; $('gc-ap-prev').disabled = k === 0; $('gc-ap-next').disabled = k >= diapos.length - 1; $('gc-apercu').classList.add('on'); journal('cahier-garde-apercu', { di: i }); }

function apercuFermer(){ $('gc-apercu').classList.remove('on'); S._apercu = null; }

$('gc-ap-x').onclick = apercuFermer;
 $('gc-ap-prev').onclick = () => { const a = S._apercu; if (a && a.k > 0) apercuOuvrir(a.diapos, a.k - 1); };
 $('gc-ap-next').onclick = () => { const a = S._apercu; if (a && a.k < a.diapos.length - 1) apercuOuvrir(a.diapos, a.k + 1); };
 $('gc-apercu').addEventListener('click', ev => { if (ev.target === $('gc-apercu')) apercuFermer(); });

dr_ecouteDoc('keydown', ev => { if (!$('gc-apercu').classList.contains('on')) return; if (ev.key === 'Escape') { apercuFermer(); ev.stopPropagation(); ev.preventDefault(); } if (ev.key === 'ArrowLeft') { $('gc-ap-prev').click(); ev.stopPropagation(); ev.preventDefault(); } if (ev.key === 'ArrowRight') { $('gc-ap-next').click(); ev.stopPropagation(); ev.preventDefault(); } }, true);

/* E1 (§12.29-2, S2) : la garde « Aller au cahier » (gardeCahier, #garde-cahier) est tombée — un seul chemin vers le cahier, la séquence « Fin de l'heure » ; ce qu'elle disait est son étape 2 (dette 13 · 46 réglée ainsi). */
function dr_garde(faire, quoi){ if (S.gel || S.repetition || !S.lancee) return faire(); /* (p6) aucune garde en répétition ; E1 (§12.28-3a) ni avant le lancement : dans l'écran de la classe, « Où en est la classe » montre les diapos sans que la classe suive — il n'y a pas encore d'heure */ gardeEnAttente = faire; $('garde-titre').textContent = 'La classe te suivrait — ' + quoi + '.'; $('garde').classList.add('on'); $('garde-gel').focus({ preventScroll: true }); }

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

function allerSuivante(){ const o = ordreHeure(S.heure); if (!o.includes(S.di)) { /* hors de l'heure : on suit la trame */ let i = S.di + 1; while (i < seance().ecrans.length && retiree(seance().ecrans[i])) i++; if (i >= seance().ecrans.length) return; S.di = i; S.page = null; S.doc = null; dr_tout(); return; } let k = o.indexOf(S.di) + 1; while (k < o.length && retiree(seance().ecrans[o[k]])) k++; if (k >= o.length) return; /* E1 (§12.29-2, contrôle n°64) : la garde du cahier tombée, ▶ va à la diapo du cahier comme à toute diapo */ S.di = o[k]; S.page = null; S.doc = null; dr_tout(); }

function revoiler(){ dr_horsHeureGarder(); if (dr_ficheDevoiler(-1)) return; /* E1 (R14) */ const d = etatDiapo(); if (S.doc) { if (S.doc.pos > 1) { S.doc.pos--; dr_tout(); } return; } const e = ecran(); if (e.blocs[0] && e.blocs[0].t === 'video') { videoPrecedent(); return; } if (!S.preparation && !S.atelier && pagePrecedente()) return;
  if (d.nDev > 0) { d.nDev--; S.page = null; S.blocActif = null; dr_tout(); return; } const o = ordreHeure(S.heure); const k = o.indexOf(S.di); const prec = k > 0 ? o[k - 1] : (k < 0 && S.di > 0 ? S.di - 1 : -1); if (prec < 0) return; dr_garde(() => { S.di = prec; S.page = null; S.doc = null; dr_tout(); }, 'revenir à la ' + libDiapo(prec)); } /* E1 (relecture continue E4, ligne 156) : le rang dans l'heure, comme « Diapo 7 sur 8 » */

function aller(i, parLeFil){ i = Math.max(0, Math.min(seance().ecrans.length - 1, i)); if (i === S.di) return; /* E1 (§12.29-2, contrôle n°64) : la vignette du cahier a la garde ordinaire « La classe te suivrait », comme toute diapo (avant : la garde du cahier) */ S.pageManuelle = false; S.blocActif = null; const fil = !!parLeFil; /* (a) Paul, 17/09 : seul ▶ est le fil ; un clic sur une vignette, avant ou après, demande d'abord */
  const faire = () => { S.di = i; S.page = null; S.doc = null; dr_tout(); }; if (fil) return faire(); const o = ordreHeure(S.heure); const avant = o.indexOf(i) >= 0 && o.indexOf(S.di) >= 0 ? o.indexOf(i) < o.indexOf(S.di) : i < S.di; dr_garde(faire, (avant ? 'revenir à la ' : 'sauter à la ') + libDiapo(i)); }

function gel(){ /* E1 (§12.41) : la répétition gèle aussi le tableau distant (« la diapo, le dévoilement, la loupe, le gel ») — rien n'est écrit pour autant (journal muet en répétition) ; avant : « aucun gel » */ if (S.preparation) { $('bgel').title = 'En préparation : reviens au cours d\'abord (« Revenir au cours »)'; journal('gel-refuse-preparation'); return; } if (S.gel) { if (S.gel.si !== S.si || S.gel.di !== S.di) { $('garde2-titre').textContent = `La classe est sur la ${libDiapo(S.gel.di)}, tu es à la ${libDiapo(S.di)}.`; /* E1 (relecture continue E4, A5 16:15 ; C1 2.4) : le vrai numéro, celui de l'heure (« Diapo 5 sur 8 »), comme pour la classe */ $('garde2').classList.add('on'); $('garde2-revenir').focus({ preventScroll: true }); return; } degeler(); }
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

function preparerCahier(){ if (S.preparation) return; const i = ordreHeure(S.heure).find(k => seance().ecrans[k].role === 'fin'); if (i == null) return; /* E1 (§12.29-3, S3) : l'écran ne change jamais de forme — plus de S.lg = 64, S.murPart = 0.58, notes réduites, #corps.prep ; la séquence en préparation (#prep) vit dans la colonne de droite, sous « le tableau, en ce moment » */ S.dispoAvant = { vue: S.vueTableau }; if (!S.gel) { journal('gel'); S.gel = etatComplet(); document.body.classList.add('gel'); $('bgel').classList.add('gelon'); } S.preparation = { di: S.gel.di, si: S.gel.si }; S.vueTableau = true; /* en préparation, la vue de droite montre ce que la classe voit */ $('droite').classList.add('prep'); journal('cahier-preparation'); S._parGardeCahier = true; S.di = i; S.page = null; S.doc = null; S._parGardeCahier = false; dr_tout(); ouvrirFin(true); alerteFermer(); }

function revenirAuCours(){ if (!S.preparation) return; const pr = S.preparation; S.preparation = null; const d0 = S.dispoAvant || {}; S.vueTableau = !!d0.vue; $('droite').classList.remove('prep'); $('prep').style.display = 'none'; if ($('corps').classList.contains('prep')) { $('corps').classList.remove('prep'); S.lg = d0.lg || S.lg; S.murPart = d0.murPart || 1; poserColonnes(); } /* une heure reprise d'avant §12.29 */ S.si = pr.si; S.di = pr.di; S.page = null; try { dimensionner(); } catch (e) {} journal('cahier-preparation-fin'); if (S.gel) degeler(); else dr_tout(); }

function degeler(){ S.gel = null; document.body.classList.remove('gel'); $('bgel').classList.remove('gelon'); journal('degel'); dr_tout(); }

$('garde2-revenir').onclick = () => { $('garde2').classList.remove('on'); S.si = S.gel.si; S.di = S.gel.di; S.page = null; degeler(); };

$('garde2-ici').onclick = () => { $('garde2').classList.remove('on'); degeler(); };
 $('garde2-non').onclick = () => { $('garde2').classList.remove('on'); };

$('bgel').onclick = gel;
 $('bdev').onclick = devoiler;
 $('bprec').onclick = revoiler;

$('bcoche').onclick = () => { S.bilanCoche = !S.bilanCoche; journal(S.bilanCoche ? 'bilan-atteste' : 'bilan-decoche'); dr_tout(); };

/* E1 (§12.54, Paul 28/10 10:53 : « le clic sur une diapo de la colonne de gauche est aléatoire ; clic droit et "y aller" fonctionne bien ») : le clic est un appui puis un
   relâché ; entre les deux, un redessin pouvait déplacer la colonne (`volet` la ramène sur la diapo courante — `scrollTop` — dès qu'elle sort de la vue, par exemple quand
   l'appui fait perdre le focus au texte de la diapo), et le relâché tombait ailleurs : pas de clic sur la vignette. Désormais la vignette est celle de l'APPUI, et la
   colonne ne se recentre ni pendant un appui ni dans les 4 s qui suivent un défilement de Paul. */
var DR_VOLET = { vig: null, t: 0, scrollT: 0, auto: false };
$('volet').addEventListener('pointerdown', ev => { if (ev.button !== 0) return; const v = ev.target.closest('.vig'); DR_VOLET.vig = v ? { i: v.dataset.i, pg: v.dataset.pg } : null; DR_VOLET.t = Date.now(); }, true);
$('volet').addEventListener('scroll', () => { if (DR_VOLET.auto) { DR_VOLET.auto = false; return; } DR_VOLET.scrollT = Date.now(); }, { passive: true });
/* le geste se joue au relâché, avec la vignette de l'appui : un redessin pendant l'appui peut remplacer la vignette sous le pointeur, et le navigateur ne donne alors aucun « click » */
$('volet').addEventListener('pointerup', ev => { if (ev.button !== 0) return; const x = DR_VOLET.vig; DR_VOLET.vig = null; if (!x || x.i == null) return; DR_VOLET.fait = true; setTimeout(() => { DR_VOLET.fait = false; }, 0); p85hAllerPage(+x.i, x.pg); }, true);
$('volet').addEventListener('click', ev => { if (DR_VOLET.fait) { DR_VOLET.fait = false; return; } const v = ev.target.closest('.vig'); if (v) p85hAllerPage(+v.dataset.i, v.dataset.pg); });   /* (p8-5h, 2) la vignette d'une page va à cette page — un « click » sans appui (clavier, script) passe ici */

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

$('bplus').onclick = ev => { ev.stopPropagation(); const r = $('bplus').getBoundingClientRect(); menuA($('menuplus'), r.left, r.bottom + 4, [{ a: 'reserve', l: 'Réserve de la séance…', t: 'ce qui est en réserve pour ceux qui ont fini ; afficher en encart' }, { a: 'docs', l: 'Documents de la séance…', t: 'projeter un document ; pages aux flèches ; croix pour fermer' }, { a: 'oral', l: 'Expliqué à l\'oral…', t: 'ce que tu as expliqué sans jouer la diapo : ça remplace une activité de l\'heure (faite à l\'oral) ou c\'est une reprise ; les notions cochées passent travaillées à l\'oral ; ta phrase devient le paragraphe au récit' }, { a: 'notion', l: 'Déclarer une notion imprévue…', t: 'une notion travaillée à l\'oral, sur la diapo affichée' }, { a: 'appel', l: 'L\'appel : clic droit sur un nom de la liste', off: true }]);
  $('menuplus').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; $('menuplus').classList.remove('on'); const a = b.dataset.a; if (a === 'chrono') { S.bandeau = S.bandeau ? '' : '⏱ 07:00'; dr_tout(); } if (a === 'qui') basculerQui('menu'); if (a === 'reserve') ouvrirReserve(); if (a === 'docs') ouvrirDocs(); if (a === 'notion') ouvrirNotion(); if (a === 'oral') ouvrirOral(); }; };

function basculerQui(par){ if (S.qui) { S.qui = null; journal('qui-retire', { par }); } else { S.qui = quiAParticipe(); journal('qui-affiche', { n: S.qui.length, par }); } $('bqui').classList.toggle('actif', !!S.qui); dr_tout(); }

$('bqui').onclick = () => basculerQui('bouton');
function basculerChrono(){ S.bandeau = S.bandeau ? '' : '⏱ 07:00'; const b = $('bchrono'); if (b) b.classList.toggle('actif', !!S.bandeau); dr_tout(); }   /* E1 (§12.51, Paul 28/10 10:17) : le geste de ⋯ « Chrono au tableau », sorti sous la diapo (la même publication) */
if ($('bchrono')) $('bchrono').onclick = basculerChrono;

function brancherMenus(){
  // sur une diapo (volet et scène), sur un bloc / une ligne / une réponse, sur un nom
  $('volet').oncontextmenu = ev => { if (S.atelier) { const d = ev.target.closest('[data-at-di]'); if (!d) return; ev.preventDefault(); menuAtelierDiapo(+d.dataset.atDi, ev.clientX, ev.clientY); return; } const v = ev.target.closest('.vig'); if (!v) return; ev.preventDefault(); menuDiapo(+v.dataset.i, ev.clientX, ev.clientY); };
  mur.oncontextmenu = ev => { ev.preventDefault(); if (S.atelier) { menuAtelierMur(ev); return; } const rep = ev.target.closest('.rep[data-r]'); const li = ev.target.closest('li[data-k]'); const bloc = ev.target.closest('.bloc');
    if (rep) { const d = etatDiapo(); const bi = +bloc.dataset.bi; const r = d.reps[bi][+rep.dataset.r]; menuA($('menu'), ev.clientX, ev.clientY, [{ a: 'eleve', l: `Aller à ${r.eleve ? prenomUnique(r.eleve) : r.i}`, t: 'ouvre ses prises de parole' }, { a: 'corriger', l: 'Corriger cette réponse', t: 'le texte au tableau, avec trace' }, { a: 'suppr-rep', l: 'Supprimer cette prise de parole', t: 'la réponse et sa prise, avec trace' }]);
      $('menu').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; $('menu').classList.remove('on'); if (b.dataset.a === 'suppr-rep') { d.reps[bi].splice(+rep.dataset.r, 1); journal('reponse-supprimee', { eleve: r.eleve }); dr_tout(); } if (b.dataset.a === 'corriger') { const dit = rep.querySelector('.dit') || rep; dit.contentEditable = 'true'; dit.focus(); const avant = r.r; dit.onblur = () => { dit.contentEditable = 'false'; r.r = dit.textContent.trim(); if (r.r !== avant) journal('reponse-corrigee', { eleve: r.eleve, avant, apres: r.r }); dr_tout(); }; dit.onkeydown = e2 => { if (e2.key === 'Enter') { e2.preventDefault(); dit.blur(); } if (e2.key === 'Escape') { e2.preventDefault(); e2.stopPropagation(); dit.textContent = avant; dit.blur(); } }; } if (b.dataset.a === 'eleve') { $('vif').value = r.eleve ? dr_prenom(r.eleve) : ''; participation(); $('vif').focus({ preventScroll: true }); } }; return; }
    const xr = (typeof p8CleElement === 'function' && S.lancee && !S.close && !S.repetition) ? p8CleElement(ev.target) : null;   /* E4 (§12.59 (3)) : retirer du tableau, remettre */
    if (li) { const k = +li.dataset.k; const d = etatDiapo(); menuA($('menu'), ev.clientX, ev.clientY, [{ a: 'lum', l: 'Mettre en lumière', t: 'dix pulsations dorées au tableau, puis rien ; noté au journal et dans le récit' }, { a: 'ecr', l: (d.ecr.includes(k) ? 'Retirer « à écrire »' : 'À écrire'), t: 'marqué à recopier, noté au journal' }, { a: 'revoiler', l: 'Revoiler celui-ci', off: k >= d.nDev, t: 'et tout ce qui suit' }, '-', { a: 'petit', l: 'Bloc : petit', ss: true, t: 'la taille du bloc, au tableau' }, { a: 'normal', l: 'Bloc : normal', ss: true, t: 'la taille du bloc, au tableau' }, { a: 'grand', l: 'Bloc : grand', ss: true, t: 'la taille du bloc, au tableau' }, ...(xr ? ['-', p8EstRetire(xr.cle) ? { a: 'remettre', l: 'Remettre au tableau', t: 'la classe le revoit ; noté au journal' } : { a: 'retirer', l: 'Retirer du tableau', t: 'la classe ne le voit plus — il revient d’un clic (Remettre au tableau) ; noté au journal ; la trame ne change pas : « Fin de l’heure » te proposera de le retirer aussi du chapitre' }] : [])]);
      $('menu').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; $('menu').classList.remove('on'); const a = b.dataset.a; const bi = +bloc.dataset.bi; if (a === 'retirer' || a === 'remettre') { p8Retirer(xr, a === 'retirer'); return; } if (a === 'lum') { allumer(k); return; } if (a === 'ecr') { const arr = d.ecr; const j = arr.indexOf(k); if (j >= 0) arr.splice(j, 1); else arr.push(k); } if (a === 'revoiler') { d.nDev = k; } if (['petit', 'normal', 'grand'].includes(a)) { if (a === 'normal') delete d.tailles[bi]; else d.tailles[bi] = a; } dr_tout(); }; return; }
    if (xr) { const bS = bloc ? (ecran().blocs || [])[+bloc.dataset.bi] : null; const sch = bS && bS.t === 'schema'; menuA($('menu'), ev.clientX, ev.clientY, [{ a: 't', l: xr.lib.charAt(0).toUpperCase() + xr.lib.slice(1), off: true }, '-', p8EstRetire(xr.cle) ? { a: 'remettre', l: 'Remettre au tableau', t: 'la classe le revoit ; noté au journal' } : { a: 'retirer', l: 'Retirer du tableau', t: 'la classe ne le voit plus — il revient d’un clic (Remettre au tableau) ; noté au journal ; la trame ne change pas' + (xr.chapitre ? ' : « Fin de l’heure » te proposera de le retirer aussi du chapitre' : '') }, ...(sch ? [{ a: 'sch', l: 'Corriger les mots du schéma…', t: 'le titre et les mots, pour cette classe, au tableau tout de suite ; le dessin reste ; « Fin de l’heure » te proposera de les verser' }] : []), '-', { a: 'diapo', l: 'La diapo…', t: 'les gestes de la diapo (y aller, retirer de l’heure, notion imprévue, commenter)' }]);   /* E4 (§12.59 (1), (3)) */
      $('menu').onclick = e2 => { const b = e2.target.closest('[data-a]'); if (!b || b.disabled) return; $('menu').classList.remove('on'); const a = b.dataset.a; if (a === 'retirer' || a === 'remettre') p8Retirer(xr, a === 'retirer'); if (a === 'sch') p8CorrigerSchema(+bloc.dataset.bi); if (a === 'diapo') { const r = $('mur').getBoundingClientRect(); menuDiapo(S.di, r.left + 40, r.top + 40); } }; return; }
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

/* E4 (§12.59 (2)) : sur la diapo du cahier, l'échéance se corrige d'un clic — la même que « Fin de l'heure » (S.echeance), pas une deuxième copie (8.1 bis).
   Un seul écouteur, posé une fois (la règle du redessin, §12.56 (1) e). */
dr_ecouteDoc('click', ev => { const d = ev.target && ev.target.closest && ev.target.closest('#mur [data-ech]'); if (!d || typeof S === 'undefined' || !S.lancee || S.close) return; ev.preventDefault(); ev.stopPropagation();
  const L = ((typeof dr_classe === 'function' ? dr_classe() : {}) || {}).prochaines || []; const r = d.getBoundingClientRect();
  menuA($('menu'), r.left, r.bottom + 4, [{ a: 't', l: 'L’échéance — au tableau et dans « Fin de l’heure »', off: true }, '-', ...L.slice(0, 8).map((p, i) => ({ a: 'e' + i, l: (S.echeance === p.iso ? '✔ ' : '') + p.l })), { a: 'aucune', l: (S.echeance ? '' : '✔ ') + 'Sans échéance' }]);
  $('menu').onclick = e2 => { const b = e2.target.closest('[data-a]'); if (!b || b.disabled) return; $('menu').classList.remove('on'); const avant = S.echeance || null; const a = b.dataset.a; const iso = a === 'aucune' ? null : ((L[+a.slice(1)] || {}).iso || null); if (a === 't') return;
    S.echeance = iso; S.echeanceChoisie = true; S.echeanceAuto = false; if (S.finFaites) S.finFaites[1] = true; journal('echeance-tableau', { avant, apres: iso }); if (typeof edTexte === 'function') edTexte(); dr_tout(); }; }, true);
