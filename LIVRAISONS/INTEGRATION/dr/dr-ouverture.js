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
    filClair: '#1f3b4d', pointClair: '#1f3b4d', bordClair: '#ffffff',   /* C16 63 : le fil de la séance sur une diapo claire (compétences, parcours, diapos de cours) : le bleu nuit */
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
    if (en || quand) { el.push(en || ''); g.push('entree'); }   /* l'entrée (Paul peut l'écrire) et les dates (le décor de la classe, `quand`) */
    if (c.image === undefined || c.image === null) manques.push({ l: 'le chapitre n’a pas d’image', champ: 'image' });
    return fin('Présentation du chapitre', 'presentation', el, { g, kicker: 'Chapitre ' + nCh + ' — ' + niv, image: imgCh, classe: !!classe, quand });
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
    return fin('Notre problématique', 'problematique', q ? [q] : [], { kicker: 'NOTRE PROBLÉMATIQUE' });   /* C16 (micro 2, Paul 02/11 08:25 : « Il doit s'appeler notre problématique ») — lisait « Notre question » / « NOTRE QUESTION » */
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
      + (b.el || []).map((x, k) => g[k] === 'entree' ? `<li data-k="${k}" class="ouv-entree${cls(k)}">${T(k) ? `<span data-p="${bi}.${k}">${S_(k)}</span>` : ''}${T(k) && d.quand ? '  ·  ' : ''}${d.quand ? `<span class="ouv-quand">${dr_esc(d.quand)}</span>` : ''}</li>` : `<li data-k="${k}" data-p="${bi}.${k}" class="ouv-${g[k] || 'ligne'}${cls(k)}">${S_(k)}</li>`).join('') + `</ul></div>${img(d.image)}</div>`; }
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
    h = `<div class="ouv ouv-debut ouv-sombre${avec ? ' ouv-avec-img' : ''}" style="${vars}"><div class="ouv-g"><div class="ouv-k">${dr_esc(d.kicker || '')}</div><ul class="ouv-l">${L2.indexOf('ouv-cs') < 0 ? L2 + `<li class="ouv-cs" aria-hidden="true"><span>COMPÉTENCES DE LA SÉANCE</span><span class="ouv-carres">${Array.from({ length: N }, (_, n) => `<i class="${n === d.jour ? 'on' : ''}"></i>`).join('')}</span></li>` : L2}</ul></div>${img(d.image)}</div>`; }
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

/* ═══ LA CARTE « CE QUE LA DIAPO DÉCLARE » d'une diapo d'ouverture (capture 6 du 29/10) — les champs du chapitre ou de la séance ; ce qui s'y change
   change LE CHAPITRE (au hub, par les écritures de l'Atelier : atChampChapitre / atChampSeance), donc toutes les classes et la feuille sommaire.
   Ce que Paul écrit directement dans la diapo devient « ta version » ; « ↩ celle du chapitre » la rend. ═══ */
const DR_OUV_TYPE = { 'presentation-chapitre': 'présentation du chapitre', 'competences-chapitre': 'les compétences du chapitre', plan: 'le parcours du chapitre', 'presentation-seance': 'début de séance', problematique: 'la problématique', 'competences-bilan': 'les compétences du chapitre, en bilan' };
const DR_OUV_OU = { 'presentation-chapitre': 'au début de la première séance du chapitre', 'competences-chapitre': 'au début de la première séance du chapitre, après la présentation', plan: 'au début de chaque séance', 'presentation-seance': 'au début de chaque séance, après le parcours', problematique: 'au début de chaque séance, après le début de séance', 'competences-bilan': 'à la dernière séance, juste avant le bilan' };
function dr_ouvChampsChapitre(e){ return e.role === 'presentation-chapitre' || e.role === 'problematique'; }
function dr_ouvMiniature(x){ if (!x) return '<span class="dr-ouv-sans">aucune</span>'; if (x.ref) return `<img class="dr-ouv-mini" src="${dr_esc(x.ref)}" alt="" title="${dr_esc(typeof dr_refRelative === 'function' ? dr_refRelative(x.ref) : x.ref)}">`; return `<span class="dr-ouv-sans" title="sur la clé USB">🔑 ${dr_esc(x.fichier)}</span>`; }
function dr_ouvCarteHtml(e, durChamp, masq){
  const sk = dr_cleSeance(S.si); const c = dr_chapitre() || {}; const se = dr_seance(sk) || {}; const intacte = dr_invIntacte(e); const k = dr_invContenu(e.role, sk);
  const lab = t => `<div class="dr-ouv-lab">${t}</div>`; const vise = ch => (S.ouvChamp === ch && S.ouvChampEid === e.eid) ? ' dr-ouv-vise' : '';
  let h = `<div class="at-d at-declare dr-ouv-carte"><h5>CE QUE LA DIAPO DÉCLARE</h5>${lab('TYPE')}<div class="l">${dr_esc(DR_OUV_TYPE[e.role] || '')} · posée par le site ${dr_esc(DR_OUV_OU[e.role] || '')}, remplie depuis le chapitre · hors activité · ${durChamp} min</div>`;
  h += intacte ? `<div class="l at-note">Elle suit le chapitre. Ce que tu écris directement dans la diapo devient « ta version » ; tu peux la retirer (clic droit → « Retirer ») : le site ne la remettra pas.</div>`
    : `<div class="l dr-ouv-ta"><b>Ta version</b> — tu as écrit dans la diapo : elle ne suit plus le chapitre. <button class="btn" data-ouv-rendre="1" title="Remet la diapo telle que le chapitre la donne : ce que tu as écrit dans la diapo est abandonné (Ctrl + Z le remet) ; elle suit de nouveau le chapitre">↩ celle du chapitre</button></div>`;
  h += masq;
  const champ = (id, quoi, val, bulle, bloc) => `<span class="ed dr-champ dr-ouv-champ${bloc ? ' dr-ouv-bloc' : ''}${vise(quoi)}" id="${id}" data-ouv-champ="${quoi}" contenteditable="plaintext-only" title="${dr_esc(bulle)}">${dr_esc(val || '')}</span>`;
  const image = (cible, x, propre) => { const lib = cible === 'chapitre' ? 'IMAGE DU CHAPITRE' : 'IMAGE DE LA SÉANCE';
    return lab(lib) + `<div class="l dr-ouv-img${vise('image')}">${dr_ouvMiniature(x)} <button class="btn" data-ouv-image="${cible}" title="${cible === 'chapitre' ? 'Choisis l’image du chapitre — une adresse dans mjpc-medias, une image déposée en ligne, ou un fichier de ta clé USB : elle paraît sur la présentation du chapitre, et sur le début de chaque séance qui n’a pas la sienne, pour toutes tes classes' : 'Choisis l’image de cette séance — une adresse dans mjpc-medias, une image déposée en ligne, ou un fichier de ta clé USB : elle paraît sur son début de séance, pour toutes tes classes'}">Changer…</button> <span class="at-note">clé USB ou en ligne</span>`
      + (cible === 'seance' ? ` <button class="btn" data-ouv-image-chapitre="1"${propre ? '' : ' disabled'} title="${propre ? 'La séance reprend l’image du chapitre (la sienne est oubliée ; Ctrl + Z dans la Structure la remet)' : 'La séance montre déjà l’image du chapitre'}">↩ celle du chapitre</button>` : '')
      + ` <button class="btn" data-ouv-image-retirer="${cible}"${x ? '' : ' disabled'} title="${x ? (cible === 'chapitre' ? 'Plus d’image sur la présentation du chapitre (ni sur les débuts de séance qui la reprenaient) : la colonne de texte prend toute la largeur ; « À régler » ne la réclame plus' : 'Plus d’image sur ce début de séance : la colonne de texte prend toute la largeur') : 'Il n’y a pas d’image à retirer'}">Retirer</button></div>`; };
  if (dr_ouvChampsChapitre(e)) {
    if (e.role === 'presentation-chapitre') h += lab('TITRE DU CHAPITRE') + `<div class="l">${champ('dc-ouv-titre', 'titre', c.title, 'Le titre du chapitre — sur la présentation du chapitre, dans la liste de tes chapitres, sur la feuille sommaire ; il change pour toutes tes classes. Entrée le garde.')}</div>`;
    h += lab('LA PROBLÉMATIQUE DU CHAPITRE') + `<div class="l">${champ('dc-ouv-question', 'question', c.problematique, 'La problématique du chapitre — sur la présentation du chapitre, sur la diapo « Notre question » de chaque séance et sur la feuille sommaire, pour toutes tes classes. Entrée la garde.', true)}</div>`;
    if (e.role === 'presentation-chapitre') h += image('chapitre', c.image === false ? null : dr_ouvImage(c.image));
  } else {
    const L = dr_ouvSeances(c, null); const rang = Math.max(0, L.findIndex(p => String(p.j) === String(sk))) + 1;
    h += lab('TITRE DE LA SÉANCE ' + rang) + `<div class="l">${champ('dc-ouv-titre', 'titre', se.title, 'Le titre de la séance — sur son début de séance, sur le parcours, dans la colonne du chapitre et sur la feuille sommaire, pour toutes tes classes. Entrée le garde.')}</div>`;
    h += lab('OBJECTIF (LA PHRASE DE LA SÉANCE)') + `<div class="l">${champ('dc-ouv-objectif', 'objectif', se.objectif, 'Ce qu’on fait dans la séance, à l’infinitif, en une ou deux phrases — sur le début de séance (« Objectif : … »), sur le parcours et sur la feuille sommaire, pour toutes tes classes. Entrée la garde.', true)}</div>`;
    const cs = Array.isArray(se.competences) ? se.competences : [];
    h += lab('COMPÉTENCES DE LA SÉANCE') + `<div class="l dr-ouv-comps${vise('competences')}">${cs.length ? cs.map((id, n) => { const t = dr_ouvComp(id); const lib = t ? (t.eleve || t.officiel) : id; return `<span class="dr-chip dr-ouv-maj${n === 0 ? ' on' : ''}" data-ouv-maj="${dr_esc(id)}" title="${n === 0 ? 'La majeure de la séance : en gras sur le début de séance, une case foncée dans les compétences du chapitre' : 'Un clic en fait la majeure de la séance (elle passe en tête de ses compétences) : en gras sur le début de séance, une case foncée dans les compétences du chapitre, pour toutes tes classes'}">${n === 0 ? '★ ' : ''}${dr_esc(lib)}${n === 0 ? ' <i>· la majeure</i>' : ''}</span>`; }).join(' ') : '<span class="at-note">aucune — elles se déclarent dans la Structure de la séance</span>'}</div>`;
    const ev = se.evaluee; h += lab('SÉANCE ÉVALUÉE') + `<div class="l dr-ouv-ev${vise('evaluee')}"><button class="btn${ev === false ? ' on' : ''}" data-ouv-ev="0" title="La séance n’est pas évaluée : son numéro reste bleu nuit sur le parcours, pour toutes tes classes">non</button> <button class="btn${ev === true ? ' on' : ''}" data-ouv-ev="1" title="La séance est évaluée : son numéro passe en bleu vif sur le parcours, pour toutes tes classes">oui</button>${ev !== true && ev !== false ? ' <span class="at-note">pas encore dit</span>' : ''}</div>`;
    const propre = se.image !== undefined && se.image !== null; const x = se.image === false ? null : (dr_ouvImage(se.image) || (c.image === false ? null : dr_ouvImage(c.image)));
    h += image('seance', x, propre);
  }
  if (k.manque && k.manque.length && intacte) h += `<div class="l al">⚠ À remplir : ${dr_esc(k.manque.join(' ; '))}<i>le site n’invente rien à sa place : la diapo garde sa place propre, la ligne absente ne s’écrit pas</i></div>`;
  h += `<div class="l at-note">Ce que tu changes ici change le chapitre, pour toutes tes classes, et la feuille sommaire avec.</div></div>`;
  return h; }
/* les écritures : celles de l'Atelier (atChampChapitre, atChampSeance : le hub, ou le magasin du mode test ; l'annulation de la Structure) ; la diapo,
   la feuille sommaire et « À régler » suivent dès que l'écriture est faite */
function dr_ouvEcrire(quoi, champ, val){ const sk = quoi;
  try { if (quoi === 'chapitre') { if (typeof atChampChapitre !== 'function') return; atChampChapitre(champ, val); } else { if (typeof atChampSeance !== 'function') return; atChampSeance(sk, champ, val); } } catch (e) { return; }
  const lire = () => quoi === 'chapitre' ? (dr_chapitre() || {})[champ] : (dr_seance(sk) || {})[champ]; const vu = x => JSON.stringify(x === undefined ? null : x); const t0 = Date.now();
  const T = setInterval(() => { if (vu(lire()) === vu(val) || Date.now() - t0 > 5000) { clearInterval(T); dr_ouvInvalider(); try { dr_tout(); } catch (e) {} } }, 60); }
function dr_ouvBrancherCarte(da, e){ if (!da || !e || !dr_estInvariable(e)) return; const sk = dr_cleSeance(S.si); const c = dr_chapitre() || {}; const se = dr_seance(sk) || {};
  da.querySelectorAll('[data-ouv-champ]').forEach(el => { const q = el.dataset.ouvChamp; const valeur = () => q === 'titre' ? (dr_ouvChampsChapitre(e) ? c.title : se.title) : q === 'question' ? c.problematique : se.objectif;
    el.onkeydown = ev => { if (ev.key === 'Enter') { ev.preventDefault(); el.blur(); } ev.stopPropagation(); };
    el.onblur = () => { const v = el.textContent.replace(/\s+/g, ' ').trim(); if (v === String(valeur() || '').trim()) return; if (!v && q === 'titre') { el.textContent = valeur() || ''; dr_dire('Un titre ne se vide pas : écris le nouveau titre à la place de l’ancien.'); return; }
      if (q === 'question') dr_ouvEcrire('chapitre', 'problematique', v || null); else if (q === 'titre') { if (dr_ouvChampsChapitre(e)) dr_ouvEcrire('chapitre', 'title', v); else dr_ouvEcrire(sk, 'title', v); } else if (q === 'objectif') dr_ouvEcrire(sk, 'objectif', v || null); }; });
  da.querySelectorAll('[data-ouv-maj]').forEach(b => b.onclick = () => { const id = b.dataset.ouvMaj; const cs = (Array.isArray(se.competences) ? se.competences : []).slice(); if (cs[0] === id) return; dr_ouvEcrire(sk, 'competences', [id].concat(cs.filter(x => x !== id))); });
  da.querySelectorAll('[data-ouv-ev]').forEach(b => b.onclick = () => { const v = b.dataset.ouvEv === '1'; if (se.evaluee === v) return; dr_ouvEcrire(sk, 'evaluee', v); });
  da.querySelectorAll('[data-ouv-image]').forEach(b => b.onclick = () => dr_ouvImageChoisir(b.dataset.ouvImage === 'chapitre' ? 'chapitre' : sk));
  da.querySelectorAll('[data-ouv-image-retirer]').forEach(b => b.onclick = () => { const q = b.dataset.ouvImageRetirer; if (q === 'chapitre') dr_ouvEcrire('chapitre', 'image', false); else dr_ouvEcrire(sk, 'image', false); });
  da.querySelectorAll('[data-ouv-image-chapitre]').forEach(b => b.onclick = () => dr_ouvEcrire(sk, 'image', null));
  const r = da.querySelector('[data-ouv-rendre]'); if (r) r.onclick = () => dr_ouvRendre(e);
  /* « À régler » a ouvert la carte sur ce champ : il reste montré (cadre or) jusqu'à ce que Paul l'ait quitté, ou qu'il ouvre une autre diapo ; le curseur s'y pose une fois */
  if (S.ouvChamp && S.ouvChampEid !== e.eid) S.ouvChamp = null;
  if (S.ouvChamp && S.ouvChampEid === e.eid) { const f = da.querySelector('.dr-ouv-vise'); if (f && !S.ouvChampPose) { S.ouvChampPose = true; try { f.scrollIntoView({ block: 'center' }); } catch (x) {} if (f.matches('[contenteditable]')) { try { f.focus(); } catch (x) {} } }
    if (f && f.matches('[contenteditable]')) f.addEventListener('blur', () => { S.ouvChamp = null; S.ouvChampPose = false; }, { once: true }); } }
/* « ↩ celle du chapitre » : la diapo redevient celle que le chapitre donne (Ctrl + Z de l'Atelier la remet) */
function dr_ouvRendre(e){ const sk = dr_cleSeance(S.si); const k = dr_invContenu(e.role, sk); e.act = k.act; e.blocs = k.blocs; e.dur = 0; delete e.masquee;
  dr_invSiteMarque(e, k.act);
  if (typeof marquerModif === 'function') marquerModif({ di: S.di, ouverture: 'rendue' }); try { toast('La diapo suit de nouveau le chapitre (Ctrl + Z remet ta version).'); } catch (x) {} dr_tout(); }
/* « Changer… » : la même chose qu'une image de diapo — une adresse dans mjpc-medias, « ⇪ Déposer en ligne… », « 🔑 Prendre sur la clé… » */
function dr_ouvImageChoisir(cible){ if (typeof fermerChoix === 'function') fermerChoix(); const z = document.createElement('div'); z.className = 'choix-obj';
  z.innerHTML = `<h4><span>L’IMAGE ${cible === 'chapitre' ? 'DU CHAPITRE' : 'DE LA SÉANCE'} — elle change pour toutes tes classes</span><span class="x" title="Ferme sans rien changer">✕</span></h4><div class="form" id="obj-form"><label>L'adresse dans mjpc-medias — relative (jamais complète)</label><input id="of-src" placeholder="3e/poesie-peinture-xixe/friedrich.webp"><div class="dr-ok" style="justify-content:flex-start"><button class="btn" id="of-depot" title="Choisis une image sur ton ordinateur ou sur la clé : elle part en ligne dans mjpc-medias (réduite à 1920 px de large), et son adresse s'écrit ici. La première fois, une petite fenêtre Google s'ouvre : choisis le compte de Paul.">⇪ Déposer en ligne…</button><input type="file" id="of-fichier" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none"><button class="btn" id="of-clef" title="Prends l’image dans le dossier de ta clé USB : elle reste sur la clé (rien n’est déposé) ; l’ordi qui projette la lit, comme une vidéo">🔑 Prendre sur la clé…</button></div><div id="of-cle-l"></div><div class="dr-err" id="of-err"></div><div class="dr-ok"><button class="btn or" id="of-ok" title="Pose cette image ${cible === 'chapitre' ? 'sur le chapitre' : 'sur la séance'} : la diapo, et toutes tes classes, la montrent">Prendre cette image</button></div></div>`;
  (document.querySelector('.scene') || document.body).appendChild(z); z.querySelector('.x').onclick = () => z.remove(); let cle = null;
  const liste = () => { const L = $('of-cle-l'); if (!L) return; const l = DR_CLE.etat === 'vu' ? DR_CLE.fichiers.filter(n => DR_CLE_IMAGE.test(n)) : []; L.innerHTML = DR_CLE.etat !== 'vu' ? '<div class="dr-err">Aucun dossier de clé lisible sur cet ordi.</div>' : `<div class="fe" style="margin-top:6px">${l.length ? l.map(n => `<span class="fi" data-cf="${dr_esc(n)}" style="${cle === n ? 'background:#fff2c7' : ''}">🖼 ${dr_esc(n)}</span>`).join('') : 'aucune image dans le dossier « ' + dr_esc(DR_CLE.nom) + ' »'}</div>`; L.querySelectorAll('[data-cf]').forEach(x => x.onclick = () => { cle = x.dataset.cf; liste(); }); };
  $('of-clef').onclick = async () => { if (DR_CLE.etat === 'a-autoriser') await dr_cleAutoriser(); else if (DR_CLE.etat !== 'vu') { const r = await dr_cleDesigner(); if (r === null) { $('of-err').textContent = 'Ce navigateur ne retient pas le dossier de la clé : passe par Chrome ou Edge.'; return; } } liste(); };
  $('of-ok').onclick = () => { const src = $('of-src').value.trim(); let v = null; if (cle && !src) v = { fichier: cle, dossier: DR_CLE.nom || '' }; else { if (!src) { $('of-err').textContent = 'Refus : une image a une adresse.'; return; } if (/^(https?:)?\/\//i.test(src) || /^[a-z]:\\/i.test(src)) { $('of-err').textContent = 'Refus : l\'adresse doit être relative dans mjpc-medias, jamais complète (3.2).'; return; } v = { ref: dr_mediasAdresse(src) }; }
    z.remove(); if (cible === 'chapitre') dr_ouvEcrire('chapitre', 'image', v); else dr_ouvEcrire(cible, 'image', v); };
  if (typeof dr_brancherDepotImage === 'function') dr_brancherDepotImage(); }
/* la décoration de la classe suit aussi « ta version » (les dates, la séance du jour, les séances faites) : ce que Paul a écrit ne bouge pas */
function dr_ouvDecorClasse(e, k){ const b = dr_ouvBloc(e), n = k && k.blocs && k.blocs[0]; if (!b || !n || b.forme !== n.forme) return false; const d = b.d = b.d || {}, m = n.d || {}; const av = JSON.stringify(d);
  if (b.forme === 'presentation') { d.quand = m.quand; d.classe = m.classe; if (d.quand === undefined) delete d.quand; }
  if (b.forme === 'parcours' && (d.seances || []).length === (m.seances || []).length) { d.classe = m.classe; d.seances.forEach((s, i) => { s.date = m.seances[i].date; s.faite = m.seances[i].faite; if (s.date === undefined) delete s.date; if (s.faite === undefined) delete s.faite; }); }
  if (b.forme === 'competences' && +d.N === +m.N) { if (m.faites) d.faites = m.faites; else delete d.faites; }
  return JSON.stringify(d) !== av; }
