/* ═══ dr-ouverture.js — LES DIAPOS D'OUVERTURE AU CANON (mandat C16 « diapos d'ouverture » ; contrat §12.67, §12.76 ; canons MANDATS/CANONS-DIAPOS/1 à 4) ═══
   Ce que ça change en classe : les diapos qui reviennent à chaque chapitre et à chaque séance (Paul, 28/10 : « à remplir automatiquement depuis le JSON »)
   ont l'interface des canons de Paul (29/10 09:54 : « celles-ci sont les canons ») : la présentation du chapitre, les compétences du chapitre, le parcours
   du chapitre, le début de séance, la problématique ; et, à la dernière séance, les compétences du chapitre en bilan. Posées par le site (dr-socle.js,
   dr_invPoser), hors activité, 0 minute, retirables, modifiables (Paul écrit dedans : « ta version »).
   Une diapo d'ouverture porte UN bloc `{ t: 'ouverture', forme, el, d }` : `el` = les textes que Paul peut écrire (chacun `data-p = bloc.ei`) ;
   `d` = le décor et la structure (numéros, dates, couleurs des cases). Tout ce que le tableau doit dessiner est DANS le bloc : la fenêtre du tableau et
   le tableau distant n'ont pas le chapitre, ils dessinent par la même fonction `rendre` (dr-socle.js), branche `dr_ouvHtml`.
   Les lignes que la flèche dévoile sont des éléments du fil (`elements`, dr-socle.js) : la présentation (le titre, la question, l'entrée et les dates),
   les compétences domaine par domaine, le parcours séance par séance, le début de séance (le titre, l'objectif, puis les compétences une à une),
   la problématique (la question). Le décor (fond, fil, carrés, image) arrive avec la diapo. Aucune animation (la dette ① les posera sur ces éléments).
   ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

/* ── LA CHARTE — un seul endroit nommé (C16 34, 35) : les couleurs relevées au pixel sur les canons ; « la charte des 3e », le bleu nuit, vaut aussi
   pour les 4e tant que le chantier des chartes (§12.73) n'a pas posé la sienne : il se branche ici (`dr_ouvCharte`). ── */
const DR_CHARTES = {
  '3e': {
    nom: 'la charte des 3e',
    nuit: '#1f3b4d',          /* le fond des canons 1 et 4, les numéros du parcours, les titres sur fond clair */
    nuitClair: '#c9d6de',     /* la question du chapitre, l'objectif (texte clair sur le bleu nuit) */
    sourdine: '#8fa5b2',      /* « Chapitre n — niveau », « SÉANCE n », l'entrée et les dates */
    fil: '#5d727f', point: '#3e7c79', trait: '#3e7c79',
    carreOff: '#2c4a5d', carreOn: '#eaf0f3', compTexte: '#dce6ec',
    papier: '#ffffff', bande: '#f4f3f0', gris: '#6e6e68', encre: '#23231f', filet: '#e4e3e0', filetFort: '#c9c7c0',
    vif: '#0070c0',           /* les séances évaluées (canon 3 ; C13 995) */
    or: '#c9a04a',            /* la séance du jour (capture 7 du 29/10) */
    legMajeure: '#6e6e68', legMineure: '#dedcd6',
    /* les domaines, dans l'ordre du canon 2 : [nom au tableau, foncé (majeure), clair (mineure)] ; les transversales (le mandat : « en domaine à part »)
       prennent le bleu nuit de la charte — aucune autre couleur n'est inventée */
    domaines: { lire: ['LIRE', '#3e7c79', '#d5e4e3'], ecrire: ['ÉCRIRE', '#6b5fa8', '#dfdbee'], langue: ['LA LANGUE', '#b07d2b', '#efe2c9'], culture: ['LA CULTURE ET L’ORAL', '#b85042', '#efd5d0'], transversales: ['LES COMPÉTENCES TRANSVERSALES', '#1f3b4d', '#d6dde3'] },
    /* la couleur du texte et les surligneurs, lisibles sur le bleu nuit (mesurés au banc) : les teintes claires du panneau des notes (P8_TXT_NOTES) */
    texteSurNuit: { rouge: '#ff8f80', vert: '#7ddc9a', bleu: '#9cc3ff', or: '#e8c25e' }
  }
};
const DR_OUV_DOMAINES = ['lire', 'ecrire', 'langue', 'culture', 'transversales'];
function dr_ouvCharte(niveau){ return DR_CHARTES[String(niveau || '')] || DR_CHARTES['3e']; }   /* §5.4 du mandat : le bleu nuit pour les 3e et les 4e */
function dr_ouvVars(ch){ return ['nuit', 'nuitClair', 'sourdine', 'fil', 'point', 'trait', 'carreOff', 'carreOn', 'compTexte', 'papier', 'bande', 'gris', 'encre', 'filet', 'filetFort', 'vif', 'or', 'legMajeure', 'legMineure'].map(k => '--ouv-' + k + ':' + ch[k]).join(';') + ';' + Object.keys(ch.texteSurNuit).map(k => '--ouv-t-' + k + ':' + ch.texteSurNuit[k]).join(';'); }

/* ── la mémoire du module : la génération (une écriture de la carte la fait avancer), l'empreinte du chapitre, les dates de la classe ── */
const DR_OUV = { gen: 0, emp: null, empT: 0, empCh: null, empGen: -1, taxoIds: new WeakMap(), taxoN: 0, dates: null };
function dr_ouvInvalider(){ DR_OUV.gen++; DR_OUV.dates = null; }

/* ── les séances du chapitre, dans l'ordre (sans la feuille sommaire) ; dans la copie d'une classe, celles qu'elle joue (§12.35, `edtSeancePour`) ── */
function dr_ouvSeances(c, classe){ let l = []; try { l = (typeof atSeances === 'function' ? atSeances(c) : []).filter(p => p.se && p.se.type !== 'sommaire'); } catch (e) {} if (classe && typeof edtSeancePour === 'function') l = l.filter(p => { try { return edtSeancePour(p.se, classe.nom); } catch (e) { return true; } }); return l; }
function dr_ouvNumChapitre(c, niv){ const o = +(c && c.ordre); if (o > 0) return o; try { const l = (typeof ordPaires === 'function' ? ordPaires((chapitresData || {})[niv] || {}) : []); const i = l.findIndex(p => p.o === c); if (i >= 0) return i + 1; } catch (e) {} return 1; }
/* la classe de la copie : seulement en heure de classe (régime « classe ») ; dans l'Atelier et en répétition, « selon la classe » */
function dr_ouvClasse(){ try { if (typeof AT_DR_REGIME === 'undefined' || AT_DR_REGIME !== 'classe' || typeof AT_DR_COURS === 'undefined' || !AT_DR_COURS || !AT_DR_COURS.classeSlug) return null; const slug = AT_DR_COURS.classeSlug; return { slug, nom: AT_DR_COURS.classeNom || (typeof dr_nomClasse === 'function' ? dr_nomClasse(slug) : slug) }; } catch (e) { return null; } }

/* ── la taxonomie : une compétence, sa phrase d'élève (13 · 91 : jamais l'intitulé officiel, sauf repli dit dans « À régler »), son domaine ── */
function dr_ouvComp(id){ const t = (typeof CH !== 'undefined' && CH) ? CH.taxo : null; if (!t) return null; let r = null, n = 0;
  ['francaisC4', 'transversales'].forEach(k => (((t.competences || {})[k]) || []).forEach(b => (b.items || []).forEach(i => { n++; if (r || !i || i.id !== id || i.actif === false) return;
    const bid = String(b.id || ''); const dom = k === 'transversales' ? 'transversales' : /lire/.test(bid) ? 'lire' : /ecrire/.test(bid) ? 'ecrire' : /langue/.test(bid) ? 'langue' : 'culture';   /* « La culture et l'oral » : c4-culture et c4-oral (canon 2) */
    r = { id, eleve: String(i.libelleEleve || '').trim(), officiel: String(i.libelle || '').trim(), dom, rang: n }; })));
  return r; }
function dr_ouvTaxoId(){ const t = (typeof CH !== 'undefined' && CH) ? CH.taxo : null; if (!t || typeof t !== 'object') return 0; let n = DR_OUV.taxoIds.get(t); if (!n) { n = ++DR_OUV.taxoN; DR_OUV.taxoIds.set(t, n); } return n; }

/* ── les dates de la classe : le premier jour de chaque séance — les heures jouées (deroule_joue, et celle lancée dans cette page), puis les cases
   à venir de son emploi du temps (`edtProjeter`, la projection même de l'EDT) ; gardées 20 s (la projection coûte) ── */
const DR_OUV_JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const DR_OUV_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function dr_ouvJourCourt(iso){ const d = new Date(iso + 'T12:00:00'); return isNaN(d) ? '' : DR_OUV_JOURS[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1); }
function dr_ouvJourLong(iso){ const d = new Date(iso + 'T12:00:00'); return isNaN(d) ? '' : d.getDate() + (d.getDate() === 1 ? 'er' : '') + ' ' + DR_OUV_MOIS[d.getMonth()]; }
function dr_ouvDates(c, classe){ const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || {}; const cle = [classe.slug, ec.level, ec.chnum, DR_OUV.gen].join('|'); const t = Date.now();
  if (DR_OUV.dates && DR_OUV.dates.cle === cle && t - DR_OUV.dates.t < 20000) return DR_OUV.dates.v;
  const L = dr_ouvSeances(c, classe); const v = {}; L.forEach(p => { v[p.j] = []; });
  L.forEach(p => { const dj = p.se.deroule_joue || {}; Object.keys(dj).forEach(sl => { const b = dj[sl]; if (!b || !(sl === classe.slug || b.classe === classe.nom)) return; Object.keys(b.heures || {}).forEach(k => { const m = /^(\d{4}-\d\d-\d\d)_/.exec(k); if (m) v[p.j].push(m[1]); }); }); });
  try { Object.keys((typeof DR_CL !== 'undefined' && DR_CL.joueesIci) || {}).forEach(H => { const m = /\/chapitres\/([^/]+)\/seances\/([^/]+)\/deroule_joue\/([^/]+)\/heures\/(\d{4}-\d\d-\d\d)_/.exec(H); if (m && String(m[1]) === String(ec.chnum) && m[3] === classe.slug && v[m[2]]) v[m[2]].push(m[4]); }); } catch (e) {}
  try { if (typeof edtProjeter === 'function' && typeof edtAujourdhui === 'function') { const cel = edtProjeter(edtAujourdhui(), 120) || {}; Object.keys(cel).forEach(k => { const x = cel[k]; if (x && x.classeMjpc === classe.nom && x.nature === 'prevu' && x.snum != null && String(x.chCle) === String(ec.chnum) && v[x.snum]) v[x.snum].push(x.iso); }); } } catch (e) {}
  Object.keys(v).forEach(k => { v[k] = [...new Set(v[k])].sort(); });
  DR_OUV.dates = { cle, t, v }; return v; }
/* une séance terminée pour la classe : toutes ses heures jouées (`edtSeanceJouee`, le compte de l'EDT) ; jouée : au moins une heure */
function dr_ouvHeuresJouees(se, classe){ try { return typeof edtHeuresJouees === 'function' ? edtHeuresJouees(se, classe.nom) : 0; } catch (e) { return 0; } }
function dr_ouvTerminee(se, classe){ try { return typeof edtSeanceJouee === 'function' ? edtSeanceJouee(se, classe.nom) > 0 : false; } catch (e) { return false; } }

/* ── l'image : `{ ref }` (en ligne, mjpc-medias) ou `{ fichier, dossier }` (la clé USB) ; `false` = retirée par Paul ; absente = non renseignée ── */
function dr_ouvImage(x){ if (!x || typeof x !== 'object') return null; if (x.ref) return { ref: String(x.ref) }; if (x.fichier) return { fichier: String(x.fichier), dossier: String(x.dossier || '') }; return null; }

/* ── la majeure d'une séance : la première de ses `competences` (C16 31) ── */
function dr_ouvGrille(L){ /* les rangées du canon 2 : une par compétence travaillée dans une séance, rangées par domaine ; dans un domaine, par la première séance où elle est majeure, puis par sa première séance */
  const rows = {}; L.forEach((p, si) => (Array.isArray(p.se.competences) ? p.se.competences : []).forEach((id, n) => { if (!id) return; const r = rows[id] = rows[id] || { id, cells: L.map(() => 0), majPrem: Infinity, prem: Infinity }; const v = n === 0 ? 2 : 1; if (v > r.cells[si]) r.cells[si] = v; if (v === 2) r.majPrem = Math.min(r.majPrem, si); r.prem = Math.min(r.prem, si); }));
  return Object.keys(rows).map(id => Object.assign(rows[id], { tx: dr_ouvComp(id) })); }

/* ═══ LE CONTENU d'une diapo d'ouverture : { act, blocs: [le bloc], manque: [phrases], manques: [{ l, champ, sk }] } — lu depuis le chapitre (et la classe) ═══ */
function dr_ouvContenu(role, sk){
  const c = dr_chapitre(); const manques = []; const fin = (act, forme, el, d) => ({ act, blocs: [{ t: 'ouverture', id: 'binv-' + role + '-s' + sk, forme, el, d }], manque: manques.map(m => m.l), manques });
  if (!c) { manques.push({ l: 'le chapitre', champ: null }); return fin('', 'probleme', [], {}); }
  const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || {}; const niv = ec.level || ''; const classe = dr_ouvClasse(); const L = dr_ouvSeances(c, classe); const N = L.length;
  const si = Math.max(0, L.findIndex(p => String(p.j) === String(sk))); const rang = si + 1; const se = (L[si] || {}).se || dr_seance(sk) || {};
  const nCh = dr_ouvNumChapitre(c, niv); const imgCh = dr_ouvImage(c.image);
  const dates = classe ? dr_ouvDates(c, classe) : null;
  if (role === 'presentation-chapitre') {
    const el = [], g = []; const titre = String(c.title || '').trim(); const q = String(c.problematique || '').trim(); const en = dr_invEntree(c, niv);
    if (titre) { el.push(titre); g.push('titre'); } else manques.push({ l: 'le chapitre n’a pas de titre', champ: 'titre' });
    if (q) { el.push(q); g.push('question'); } else manques.push({ l: 'le chapitre n’a pas de question (sa problématique)', champ: 'question' });
    if (!en) manques.push({ l: 'le chapitre n’a pas d’entrée du programme', champ: null });
    let quand = 'les dates selon la classe'; if (dates) { const tous = Object.keys(dates).reduce((a, k) => a.concat(dates[k]), []).sort(); quand = !tous.length ? '' : tous.length === 1 || tous[0] === tous[tous.length - 1] ? 'le ' + dr_ouvJourLong(tous[0]) : 'du ' + dr_ouvJourLong(tous[0]) + ' au ' + dr_ouvJourLong(tous[tous.length - 1]); }
    const ligne = [en, quand].filter(Boolean).join('  ·  '); if (ligne) { el.push(ligne); g.push('entree'); }
    if (c.image === undefined || c.image === null) manques.push({ l: 'le chapitre n’a pas d’image', champ: 'image' });
    return fin('Présentation du chapitre', 'presentation', el, { g, kicker: 'Chapitre ' + nCh + ' — ' + niv, image: imgCh, classe: !!classe });
  }
  if (role === 'competences-chapitre' || role === 'competences-bilan') {
    const bilan = role === 'competences-bilan'; const rows = dr_ouvGrille(L); const el = []; const doms = [];
    DR_OUV_DOMAINES.forEach(dk => { const rs = rows.filter(r => r.tx && r.tx.dom === dk).sort((a, b) => (a.majPrem - b.majPrem) || (a.prem - b.prem) || (a.tx.rang - b.tx.rang)); if (!rs.length) return;
      doms.push({ dom: dk, rows: rs.map(r => { let lib = r.tx.eleve; if (!lib) { lib = r.tx.officiel || r.id; manques.push({ l: 'la compétence « ' + (r.tx.officiel || r.id) + ' » n’a pas de phrase d’élève dans la taxonomie (l’intitulé officiel est montré à sa place)', champ: null }); } el.push(lib); return { ei: el.length - 1, cells: r.cells }; }) }); });
    rows.filter(r => !r.tx).forEach(r => manques.push({ l: 'la compétence « ' + r.id + ' » n’est pas dans la taxonomie (elle n’est pas montrée)', champ: null }));
    if (!rows.length) manques.push({ l: 'aucune séance ne déclare de compétences', champ: null });
    let faites = null; if (bilan && classe) faites = L.map((p, k) => (k === si || dr_ouvHeuresJouees(p.se, classe) > 0) ? 1 : 0);   /* le bilan dans la copie de la classe : les séances jouées cochées, les autres en pâle */
    return fin('Les compétences du chapitre', 'competences', el, { titre: 'Les compétences du chapitre ' + nCh, sous: 'Ce que chaque séance travaille, et ce qui revient d’une séance à l’autre.', N, doms, bilan, faites });
  }
  if (role === 'plan') {
    const el = []; const seances = L.map((p, k) => { const s = p.se; el.push(String(s.title || '').trim()); el.push(String(s.objectif || '').trim());
      const x = { ev: s.evaluee === true }; if (classe) { const ds = (dates || {})[p.j] || []; x.date = ds.length ? dr_ouvJourCourt(ds[0]) : ''; x.faite = k !== si && dr_ouvTerminee(s, classe); } return x; });
    return fin('Le parcours du chapitre', 'parcours', el, { sn: 'Séance ' + rang + ' sur ' + N, N, jour: si, seances, classe: !!classe });
  }
  if (role === 'presentation-seance') {
    const el = [], g = [], comps = []; const titre = String(se.title || '').trim(); const obj = String(se.objectif || '').trim();
    if (titre) { el.push(titre); g.push('titre'); } else manques.push({ l: 'la séance ' + rang + ' n’a pas de titre', champ: 'titre', sk });
    if (obj) { el.push(obj); g.push('objectif'); } else manques.push({ l: 'la séance ' + rang + ' n’a pas d’objectif (la phrase de la séance)', champ: 'objectif', sk });
    if (se.evaluee !== true && se.evaluee !== false) manques.push({ l: 'la séance ' + rang + ' ne dit pas si elle est évaluée', champ: 'evaluee', sk });
    (Array.isArray(se.competences) ? se.competences : []).forEach((id, n) => { const tx = dr_ouvComp(id); if (!tx) return; let lib = tx.eleve; if (!lib) { lib = tx.officiel || id; manques.push({ l: 'la compétence « ' + (tx.officiel || id) + ' » n’a pas de phrase d’élève dans la taxonomie (l’intitulé officiel est montré à sa place)', champ: null }); } el.push(lib); g.push('comp'); comps.push({ dom: tx.dom, maj: n === 0 }); });
    if (!(se.competences || []).length) manques.push({ l: 'la séance ' + rang + ' ne déclare pas de compétences', champ: 'competences', sk });
    const img = se.image === false ? null : (dr_ouvImage(se.image) || (c.image === false ? null : imgCh));
    return fin('Séance ' + rang + ' · ' + (titre || 'sans titre'), 'debut', el, { g, kicker: 'SÉANCE ' + rang, N, jour: si, comps, image: img });
  }
  if (role === 'problematique') {
    const q = String(c.problematique || '').trim();   /* son manque est dit une fois, sur la présentation du chapitre */
    return fin('Notre question', 'problematique', q ? [q] : [], { kicker: 'NOTRE QUESTION' });
  }
  return fin('', 'probleme', [], {});
}

/* ── les éléments du fil d'un bloc d'ouverture : ce que la flèche dévoile, un à un (le texte sert au récit et aux notes) ── */
function dr_ouvElements(b){ const d = (b && b.d) || {}; const el = Array.isArray(b && b.el) ? b.el : [];
  if (b.forme === 'parcours') return (d.seances || []).map((s, k) => String(el[2 * k] || ''));
  if (b.forme === 'competences') { const D = dr_ouvCharte().domaines; return (d.doms || []).map(x => (D[x.dom] || [x.dom])[0]); }
  return el.map(x => String(x == null ? '' : x)); }
function dr_ouvBloc(e){ const b = e && e.blocs && e.blocs[0]; return b && b.t === 'ouverture' ? b : null; }

/* ═══ LE RENDU — la même fonction pour le pilote, la fenêtre du tableau, le tableau distant, les vignettes (aux proportions du tableau, 16/9 ;
   tout en cqh / cqw : la diapo se dessine à sa taille). Au pilote, ce qui n'est pas dévoilé reste visible et pâle ; au tableau, rien (dr.css). ═══ */
function dr_ouvHtml(e, b, et){
  const d = b.d || {}; const ch = dr_ouvCharte(); const bi = 0; const tx = et.textes || {}; const nDev = et.nDev == null ? 0 : et.nDev;
  const T = ei => { const v = tx[bi + '.' + ei]; return v != null ? v : String((b.el || [])[ei] == null ? '' : b.el[ei]); };
  const S_ = (ei) => surligne(dr_esc(T(ei)), bi + '.' + ei, et);
  const cls = k => (k >= nDev ? ' pas' : '') + (et.flash === k ? ' spot-on' : '') + ((et.ecr || []).includes(k) ? ' aecrire' : '');
  const img = x => { if (!x) return ''; const inner = x.ref ? `<img src="${dr_esc(x.ref)}" alt="" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'"><div class="img-vide" style="display:none">${et.pilote || et.atelier ? 'image absente de mjpc-medias · ' + dr_esc(typeof dr_refRelative === 'function' ? dr_refRelative(x.ref) : x.ref) : ''}</div>` : (typeof dr_cleMediaHtml === 'function' ? dr_cleMediaHtml({ fichier: x.fichier }, et) : ''); return `<div class="ouv-img">${inner}</div>`; };
  const vars = dr_ouvVars(ch); let h = '';
  if (b.forme === 'presentation') { const g = d.g || []; const avec = !!d.image;
    h = `<div class="ouv ouv-pres ouv-sombre${avec ? ' ouv-avec-img' : ''}" style="${vars}"><div class="ouv-g"><div class="ouv-k">${dr_esc(d.kicker || '')}</div><ul class="ouv-l">`
      + (b.el || []).map((x, k) => `<li data-k="${k}" data-p="${bi}.${k}" class="ouv-${g[k] || 'ligne'}${cls(k)}">${S_(k)}</li>`).join('') + `</ul></div>${img(d.image)}</div>`; }
  else if (b.forme === 'problematique') {
    h = `<div class="ouv ouv-prob ouv-sombre" style="${vars}"><div class="ouv-g"><div class="ouv-k">${dr_esc(d.kicker || '')}</div><ul class="ouv-l">`
      + (b.el || []).map((x, k) => `<li data-k="${k}" data-p="${bi}.${k}" class="ouv-question${cls(k)}">${S_(k)}</li>`).join('') + `</ul></div></div>`; }
  else if (b.forme === 'debut') { const g = d.g || []; const avec = !!d.image; const N = Math.max(1, +d.N || 1); const D = ch.domaines; let ci = 0;
    const lignes = (b.el || []).map((x, k) => { const genre = g[k] || 'comp';
      if (genre === 'titre') return `<li data-k="${k}" data-p="${bi}.${k}" class="ouv-titre${cls(k)}">${S_(k)}</li>` + '<li class="ouv-trait" aria-hidden="true"></li>';
      if (genre === 'objectif') return `<li data-k="${k}" class="ouv-obj${cls(k)}"><span class="ouv-pre">Objectif : </span><span data-p="${bi}.${k}">${S_(k)}</span></li>` + `<li class="ouv-cs" aria-hidden="true"><span>COMPÉTENCES DE LA SÉANCE</span><span class="ouv-carres">${Array.from({ length: N }, (_, n) => `<i class="${n === d.jour ? 'on' : ''}"></i>`).join('')}</span></li>`;
      const cp = (d.comps || [])[ci++] || {}; const dc = D[cp.dom] || D.transversales;
      return `<li data-k="${k}" class="ouv-comp${cp.maj ? ' maj' : ''}${cls(k)}"><i style="background:${cp.maj ? dc[1] : dc[2]}"></i><span data-p="${bi}.${k}">${S_(k)}</span></li>`; }).join('');
    const sansObj = !g.includes('objectif') ? `<li class="ouv-cs" aria-hidden="true"><span>COMPÉTENCES DE LA SÉANCE</span><span class="ouv-carres">${Array.from({ length: N }, (_, n) => `<i class="${n === d.jour ? 'on' : ''}"></i>`).join('')}</span></li>` : '';   /* sans objectif, les carrés gardent leur place, sous le titre */
    const L2 = sansObj ? lignes.replace(/(<li data-k="[^"]*"[^>]*class="ouv-comp)/, sansObj + '$1') : lignes;
    h = `<div class="ouv ouv-debut ouv-sombre${avec ? ' ouv-avec-img' : ''}" style="${vars}"><div class="ouv-fil" aria-hidden="true"></div><div class="ouv-point" aria-hidden="true"></div><div class="ouv-g"><div class="ouv-k">${dr_esc(d.kicker || '')}</div><ul class="ouv-l">${L2.indexOf('ouv-cs') < 0 ? L2 + `<li class="ouv-cs" aria-hidden="true"><span>COMPÉTENCES DE LA SÉANCE</span><span class="ouv-carres">${Array.from({ length: N }, (_, n) => `<i class="${n === d.jour ? 'on' : ''}"></i>`).join('')}</span></li>` : L2}</ul></div>${img(d.image)}</div>`; }
  else if (b.forme === 'parcours') { const S2 = d.seances || []; const n = Math.max(1, S2.length);
    h = `<div class="ouv ouv-parc ouv-clair${d.classe ? ' ouv-dates' : ''}" style="${vars};--ouv-n:${n}"><div class="ouv-bande"><div class="ouv-h1">Le parcours du chapitre</div><div class="ouv-sn">${dr_esc(d.sn || '')}</div></div><ul class="ouv-rangs">`
      + S2.map((s, k) => `<li data-k="${k}" class="ouv-r${s.ev ? ' ev' : ''}${k === d.jour ? ' jour' : ''}${s.faite ? ' faite' : ''}${cls(k)}"><span class="ouv-n">${k + 1}</span>${d.classe ? `<span class="ouv-date">${s.faite ? '<b class="ouv-ok" title="séance terminée">✓</b> ' : ''}${dr_esc(s.date || '')}</span>` : ''}<span class="ouv-t" data-p="${bi}.${2 * k}">${S_(2 * k)}</span><span class="ouv-x" data-p="${bi}.${2 * k + 1}">${S_(2 * k + 1)}</span></li>`).join('')
      + `</ul></div>`; }
  else if (b.forme === 'competences') { const N = Math.max(1, +d.N || 1); const D = ch.domaines; const doms = d.doms || []; const R = doms.reduce((t, x) => t + 1 + x.rows.length, 0) || 1; const fa = Array.isArray(d.faites) ? d.faites : null;
    const rh = Math.min(5, 66 / R);   /* la hauteur d'une rangée en cqh : celle du canon (45 px sur 900), moins quand le chapitre a beaucoup de compétences */
    const tete = `<div class="ouv-tete"><span class="ouv-cl">Compétence</span><span class="ouv-cases">${Array.from({ length: N }, (_, s) => `<b class="${fa && !fa[s] ? 'pale' : ''}">S${s + 1}</b>`).join('')}</span></div>`;
    h = `<div class="ouv ouv-comp ouv-clair${d.bilan ? ' ouv-bilan' : ''}" style="${vars};--ouv-n:${N};--ouv-rh:${rh.toFixed(3)}cqh"><div class="ouv-h1">${dr_esc(d.titre || '')}</div><div class="ouv-sous">${dr_esc(d.sous || '')}</div><div class="ouv-tab">${tete}<ul class="ouv-doms">`
      + doms.map((x, k) => { const dc = D[x.dom] || D.transversales; return `<li data-k="${k}" class="ouv-dom${cls(k)}"><div class="ouv-dn" style="color:${dc[1]}">${dr_esc(dc[0])}</div>`
        + x.rows.map(r => `<div class="ouv-cr"><span class="ouv-cl" data-p="${bi}.${r.ei}">${S_(r.ei)}</span><span class="ouv-cases">${r.cells.map((v, s) => `<i class="${v === 2 ? 'M' : v === 1 ? 'm' : ''}${fa && !fa[s] ? ' pale' : ''}"${v ? ` style="background:${v === 2 ? dc[1] : dc[2]}"` : ''}>${v && fa && fa[s] ? '✓' : ''}</i>`).join('')}</span></div>`).join('') + `</li>`; }).join('')
      + `</ul></div><div class="ouv-leg"><span><i style="background:${ch.legMajeure}"></i>majeure</span><span><i style="background:${ch.legMineure}"></i>mineure</span>${fa ? '<span class="ouv-leg-ok">✓ séance faite</span>' : ''}</div></div>`; }
  else h = `<div class="ouv ouv-sombre" style="${vars}"></div>`;
  return h;
}
/* ── la colonne de texte tient dans sa place : sa taille descend (la variable --ouv-z) tant que rien ne déborde — jamais de texte coupé ── */
function dr_ouvAjuster(mur){ try { const o = mur && mur.querySelector(':scope > .ouv'); if (!o || !o.clientHeight) return; const zones = Array.from(o.querySelectorAll('.ouv-g, .ouv-rangs, .ouv-r, .ouv-doms, .ouv-cl')); if (!zones.length) return;
  let z = 1; o.style.setProperty('--ouv-z', '1'); const deborde = () => zones.some(g => g.scrollHeight > g.clientHeight + 1 || g.scrollWidth > g.clientWidth + 1);
  while (deborde() && z > 0.42) { z = Math.round((z - 0.04) * 100) / 100; o.style.setProperty('--ouv-z', String(z)); } } catch (e) {} }

/* ── « À régler » : ce qui manque n'est jamais inventé (C16 31) — une ligne par champ, dite par la diapo qui le porte (le chapitre : sa présentation ;
   une séance : son début de séance), qui ouvre la carte au bon champ ── */
function dr_ouvAlertes(E, sk){ const out = []; (E || []).forEach((e, i) => { if (!dr_estInvariable(e) || !dr_invIntacte(e)) return; const k = dr_invContenu(e.role, sk); (k.manques || []).forEach(m => {
  out.push({ di: i, k: 'ouverture', champ: m.champ || null, l: m.l.charAt(0).toUpperCase() + m.l.slice(1), ou: 'diapo « ' + (e.act || '') + ' »', faire: m.champ ? 'remplis-le dans la carte « Ce que la diapo déclare » (« Ouvrir la diapo » t’y emmène) : il change le chapitre, pour toutes tes classes ; le site n’invente rien à sa place' : 'à régler dans la taxonomie ou dans la Structure du chapitre ; le site n’invente rien à sa place', copier: 'Chapitre « ' + dr_chapitreTitre() + ' » : ' + m.l + '.' }); }); }); return out; }
