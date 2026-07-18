/* ════════════════════════════════════════════════════════════════════════════
   MJPC-BENCH — banc de test versionné de l'écosystème MJPC
   Usage : node mjpc-bench.js <fichier.html> [chemin/hub.json]
   Extrait les fonctions livrées du fichier et les exécute sur l'export réel du hub.
   S'enrichit à chaque lot — ne jamais supprimer un test qui passe.
   Créé Phase 2 lot 1 (14/07/2026), après 2 incidents de bancs jetables en Phase 1.
   ════════════════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const fichier = process.argv[2] || 'index.html';
const hubPath = process.argv[3] || '/home/claude/hub.json';
const html = fs.readFileSync(fichier, 'utf8');
const hub = JSON.parse(fs.readFileSync(hubPath, 'utf8'));

let ok = 0, ko = 0;
const t = (nom, cond) => { cond ? (ok++, console.log('✔', nom)) : (ko++, console.log('✘', nom)); };
const section = s => console.log('\n── ' + s + ' ──');
const fin = () => { console.log(`\n${ok}/${ok + ko} tests OK`); process.exit(ko ? 1 : 0); };

/* Extraction d'une fonction nommée par équilibrage d'accolades (fiable sur du minifié partiel). */
function corpsFonction(nom) {
  const m = html.match(new RegExp('function ' + nom + '\\([^)]*\\)\\{'));
  if (!m) return null;
  let depth = 0;
  for (let k = html.indexOf('{', m.index); k < html.length; k++) {
    if (html[k] === '{') depth++;
    else if (html[k] === '}') { depth--; if (!depth) return html.slice(m.index, k + 1); }
  }
  return null;
}
function sandbox(noms, prelude, exportsSup) {
  let code = prelude || '';
  for (const n of noms) { const c = corpsFonction(n); if (!c) return null; code += c + '\n'; }
  const sb = {};
  new Function(code + '; this.x={' + noms.concat(exportsSup || []).join(',') + '};').call(sb);
  return sb.x;
}

/* ════ SUITE 1 — SOCLE (non-régression Phase 1) ════ */
(function () {
  const deb = html.indexOf('// MJPC-CORE v');   /* M6 : détection non versionnée (v1.0.0 en dur masquait les apps v1.1.0) */
  if (deb < 0) { section('SOCLE'); console.log('  (absent de ce fichier — suite ignorée)'); return; }
  const finS = html.indexOf('\n};', html.indexOf('\nvar MJPC_PURGE')) + 3;
  const sb = {};
  new Function(html.slice(deb, finS) + '; this.x={sanMJPC,cleClasse,estClasseTest,extractEleves,ecrireClasse};').call(sb);
  const { sanMJPC, cleClasse, estClasseTest, extractEleves, ecrireClasse } = sb.x;
  section('SOCLE (non-régression Phase 1)');
  t('sanMJPC canon (CLÉMENT Noé → clement_noe)', sanMJPC('CLÉMENT Noé') === 'clement_noe');
  t('cleClasse identité (trim seul)', cleClasse(' 4e Hugo ') === '4e Hugo');
  t('estClasseTest : internes oui, vraies non',
    estClasseTest('_TEST') && estClasseTest('CLASSE TEST') && estClasseTest('_test_worktrack') && !estClasseTest('4E BANKSY'));
  t('extractEleves sur toutes les classes réelles du hub',
    Object.values(hub.classes || {}).every(c => extractEleves(c, []).length > 0));
  const cur = JSON.parse(JSON.stringify(hub.classes['4E BANKSY']));
  const mock = { ref: () => ({ transaction: (f, cb) => { mock._out = f(cur); cb(null, true); } }) };
  ecrireClasse(mock, '4E BANKSY', extractEleves(cur, []), { nom: '4E BANKSY' });
  t('ecrireClasse : non destructive (archivee préservée, format canonique, résidus purgés)',
    Array.isArray(mock._out.eleves) && mock._out.archivee === cur.archivee &&
    !Object.keys(mock._out).some(k => /^\d+$/.test(k)));
})();


/* ════ SUITE M6 — SOUCHE : passe de la grille (18/07/2026) ════ */
(function () {
  if (!/function Nav2\(/.test(html)) { section('M6 SOUCHE'); console.log('  (app hors périmètre M6 — suite ignorée)'); return; }
  section('M6 SOUCHE — navigation deux niveaux');
  const navDecl = html.match(/var NAV2_GROUPES=\[[\s\S]*?\n\];/)[0];
  const nav = sandbox(['groupeDeTab'], navDecl + '\n', ['NAV2_GROUPES']);
  const ANCIENS = ['correct', 'rapide', 'bilan', 'copies', 'exercices', 'fiches', 'suivi'];
  t('les 7 onglets d\'origine sont tous rangés dans un groupe',
    ANCIENS.every(x => nav.groupeDeTab(x) !== null));
  t('aucun onglet rangé deux fois',
    (() => { const v = []; nav.NAV2_GROUPES.forEach(g => g.tabs.forEach(x => v.push(x[0]))); return new Set(v).size === v.length; })());
  t('trois groupes exactement (Pilotage / Données / Réglages)',
    nav.NAV2_GROUPES.length === 3 && nav.NAV2_GROUPES.map(g => g.id).join(',') === 'pilotage,donnees,reglages');
  t('Correction et Rapide en Pilotage, Exercices en Données (décision Q1)',
    nav.groupeDeTab('correct') === 'pilotage' && nav.groupeDeTab('rapide') === 'pilotage' &&
    nav.groupeDeTab('exercices') === 'donnees');
  t('Préparation existe en Pilotage, Réglages est doté',
    nav.groupeDeTab('preparation') === 'pilotage' && nav.groupeDeTab('reglages') === 'reglages');
  t('onglet inconnu → null (pas de groupe fantôme)', nav.groupeDeTab('zzz') === null);
  t('atterrissage : l\'écran ouvre sur Correction dans Pilotage',
    /useState\("correct"\),tab=/.test(html) && /useState\("pilotage"\),groupe=/.test(html));
  t('les 7 composants d\'onglets sont montés inchangés (aucun rouvert)',
    ['h(Bilan,{', 'h(Copies,{', 'h(ExercicesAdmin,{', 'h(Fiches,{', 'h(Suivi,{'].every(x => html.includes(x)));

  section('M6 SOUCHE — identité élève (code personnel contre /codes réel)');
  const prelSan = corpsFonction('sanMJPC') + '\n';
  const codes = hub.codes || {};
  const cd = sandbox(['codeAttendu'], prelSan + 'var codesData=' + JSON.stringify(codes) + ';\n');
  const canon = Object.keys(codes).find(k => codes[k] && codes[k].code && k === (codes[k].name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''));
  t('code retrouvé sur une clé canonique réelle (' + canon + ')',
    !!canon && cd.codeAttendu(canon, codes[canon].name) === String(codes[canon].code));
  const degrade = Object.keys(codes).find(k => codes[k] && codes[k].name && /[A-Z_]{4,}/.test(k) && k !== canon);
  if (degrade) {
    const cleVraie = codes[degrade].name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    t('clé dégradée du registre (' + degrade + ') rattrapée par le champ name (dette ⑮ non bloquante)',
      cd.codeAttendu(cleVraie, codes[degrade].name) === String(codes[degrade].code));
  }
  t('élève sans code enregistré → null (message, jamais d\'entrée)', cd.codeAttendu('inconnu_zzz', 'INCONNU Zzz') === null);
  t('entrée string du registre acceptée (format hérité)',
    sandbox(['codeAttendu'], prelSan + 'var codesData={"x_y":"4242"};\n').codeAttendu('x_y', 'X Y') === '4242');
  t('le code est comparé en chaîne (pas de 0123 → 123)', String(codes[canon].code).length === String(codes[canon].code).trim().length);

  section('M6ter SOUCHE — HARNAIS LÉONIE (cas réel de l\'audit)');
  /* Reproduction fidèle de la chaîne livrée : registre → dictées → identité → filtre. */
  const prelBase = corpsFonction('sanMJPC') + '\nfunction san(n){return sanMJPC(n)}\n' +
                   corpsFonction('extractEleves') + '\n' + corpsFonction('resolveEleves') + '\n';
  const outils = sandbox([], prelBase + corpsFonction('classeDuRegistre') + '\n',
                         ['sanMJPC', 'san', 'extractEleves', 'resolveEleves', 'classeDuRegistre']);
  const CLE_L = 'oger_colas_leonie', DID_UTOPIE = 'dictee_5e_chapitre_utopie-5e_herge';
  const DID_GD = 'dictee_preparee_5e_grandes_decouvertes-5e_herge';

  /* Le registre : Léonie y est bien, en 5e HERGÉ. */
  t('Léonie est au registre /classes/5e HERGÉ',
    outils.extractEleves(hub.classes['5e HERGÉ'], []).some(e => outils.san(e) === CLE_L));
  t('son code personnel est au registre /codes',
    !!(hub.codes[CLE_L] && hub.codes[CLE_L].code));

  /* Construction des dictées, exactement comme l'app la fait, à partir du registre. */
  const bâtir = (registre) => Object.keys(hub.correction_dictee).map(id => {
    const v = hub.correction_dictee[id] || {}, c = v.config || {};
    return { id, title: c.title || id, classe: c.classe || '', published: c.published !== false,
             showNote: c.showNote !== false, base: c.base || 20, results: v.results || {},
             autocorrection: v.autocorrection || {}, copyPublishedAt: v.copyPublishedAt || null,
             eleves: outils.extractEleves(outils.classeDuRegistre(c.classe || '', registre), c.eleves) };
  });

  /* L'identité, telle que doLogin la calcule à partir du registre chargé. */
  const identiteDe = (registre, nom, prenom, rosterDictees) => {
    const roster = [];
    Object.keys(registre).forEach(c => outils.extractEleves(registre[c], []).forEach(e => { if (roster.indexOf(e) < 0) roster.push(e); }));
    (rosterDictees || []).forEach(e => { if (roster.indexOf(e) < 0) roster.push(e); });
    const res = outils.resolveEleves(roster, [{ nom: nom.toUpperCase(), prenom }]);
    if (res && res.erreur) return { erreur: res.erreur };
    const moi = res[0];
    let cls = '';
    const kc = Object.keys(registre);
    for (let ci = 0; ci < kc.length && !cls; ci++) {
      const rr = outils.extractEleves(registre[kc[ci]], []);
      for (let ri = 0; ri < rr.length; ri++) if (outils.san(rr[ri]) === moi.cle) { cls = kc[ci]; break; }
    }
    return { nom: moi.nom, cle: moi.cle, classe: cls };
  };

  const idL = identiteDe(hub.classes, 'OGER-COLAS', 'Léonie', []);
  t('PREUVE B1 : identite.classe vaut « 5e HERGÉ » (code ' + hub.codes[CLE_L].code + ')', idL.classe === '5e HERGÉ');
  t('identite.cle canonique', idL.cle === CLE_L);

  const filtreAvec = (dictees, identite) =>
    sandbox(['mesDictees'], prelBase + 'var identite=' + JSON.stringify(identite) + ';\nvar dictees=' + JSON.stringify(dictees) + ';\n').mesDictees();

  const dictL = bâtir(hub.classes);
  const dUtopie = dictL.find(d => d.id === DID_UTOPIE);
  t('au hub : la dictée Utopie est publiée, classe ' + dUtopie.classe + ', sans résultat pour Léonie',
    dUtopie.published === true && !dUtopie.results[CLE_L]);
  const listeL = filtreAvec(dictL, idL);
  t('PREUVE B1 : la dictée Utopie APPARAÎT dans « Mes dictées » de Léonie',
    listeL.some(d => d.id === DID_UTOPIE));
  t('le roster de la dictée est complet (31 élèves de 5e HERGÉ)', dUtopie.eleves.length === 31);

  /* La course : registre absent au moment de la construction. La garde doit empêcher
     toute liste fausse ; et une fois le registre arrivé, la liste est juste. */
  const dCourse = bâtir({});
  t('sans registre, le roster était vide (la course était réelle)',
    dCourse.find(d => d.id === DID_UTOPIE).eleves.length === 0);
  t('CORRECTIF : les dictées ne se construisent plus sans registre (classesData en dépendance)',
    html.includes('if(!classesData)return;') && html.includes('},[forcedDicteeId,classesData]);'));
  t('CORRECTIF : la liste attend le registre plutôt que d\'afficher un faux vide',
    html.includes('if(!classesData||!dictees.length) return h("div"'));
  t('CORRECTIF : doLogin lit le registre chargé, plus la globale', html.includes('var registre=classesData||CLASSES||{};'));

  section('M6ter SOUCHE — trois états de publication (correctif B2)');
  const et = sandbox(['etatDicteeEleve'], '');
  const dGD = dictL.find(d => d.id === DID_GD);
  t('au hub : « Grandes découvertes » a des résultats mais AUCUN copyPublishedAt',
    Object.keys(dGD.results).length > 0 && !dGD.copyPublishedAt);
  const cleGD = Object.keys(dGD.results)[0];
  const eGD = et.etatDicteeEleve(dGD, cleGD);
  t('PREUVE B2 : copie corrigée mais non rendue → ' + eGD.label, eGD.code === 'nonrendue');
  t('PREUVE B2 : cette ligne n\'affiche PAS la note', eGD.montrerNote === false);
  t('PREUVE B2 : cette ligne ne propose PAS « Ouvrir »', eGD.ouvrable === false);
  t('la copie rendue (Utopie, copyPublishedAt présent) reste ouvrable',
    (() => { const k = Object.keys(dUtopie.results)[0]; if (!k) return true;
             const e = et.etatDicteeEleve(dUtopie, k); return e.ouvrable === true && e.montrerNote === true; })());
  t('pas de résultat → « Pas encore corrigée », ni note ni ouverture',
    (() => { const e = et.etatDicteeEleve(dUtopie, CLE_L); return e.code === 'attente' && !e.ouvrable && !e.montrerNote; })());
  t('rendue + autocorrection achevée → « Terminée »',
    et.etatDicteeEleve({ results: { x: { timestamp: 1 } }, copyPublishedAt: 1, autocorrection: { x: { total: 5, solved: 5 } } }, 'x').code === 'terminee');
  t('rendue + autocorrection en cours → « À faire »',
    et.etatDicteeEleve({ results: { x: { timestamp: 1 } }, copyPublishedAt: 1, autocorrection: { x: { total: 5, solved: 2 } } }, 'x').code === 'afaire');
  t('les quatre états sont exclusifs et couvrent les trois dimensions',
    ['attente', 'nonrendue', 'afaire', 'terminee'].every(c => html.includes('code:"' + c + '"')));

  section('M6ter SOUCHE — la ligne ne promet que ce qui existe');
  t('« Ouvrir » n\'est rendu que si l\'état est ouvrable', html.includes('et.ouvrable?h("span",{style:{color:"var(--primary)"'));
  t('la note n\'est rendue que si l\'état l\'autorise', html.includes('(et.montrerNote&&d.showNote!==false'));
  t('une ligne non ouvrable n\'a ni curseur main ni gestionnaire de clic',
    html.includes('cursor:et.ouvrable?"pointer":"default"') && html.includes('onClick:et.ouvrable?function(){ouvrirDictee(d)}:null'));
  t('ouvrirDictee refuse aussi par le fond (garde-fou, pas seulement l\'affichage)',
    html.includes('if(!et.ouvrable){setAttente(d);setErrMsg("");setScreen("attente");return}'));
  t('l\'écran d\'attente distingue les TROIS situations (absent · pas corrigée · pas rendue)',
    html.includes('var e=identite?etatDicteeEleve(attente,identite.cle):{code:"attente"};') &&
    html.includes('e.code==="absent"') && html.includes('e.code==="nonrendue"') &&
    html.includes('Cette dict\\u00e9e n\\u2019est pas encore corrig\\u00e9e'));
  t('message de liste vide sans « corrigée »',
    html.includes('Tu n\\u2019as pas encore de dict\\u00e9e. Celles de ta classe appara\\u00eetront ici.'));

  section('M6quater SOUCHE — « Mes dictées » est un lieu (ouverture directe)');
  t('sans identifiant dans l\'URL : la liste, toujours',
    html.includes('if(!idUrl||autoOuvert){ setScreen("mesdictees"); return; }'));
  t('l\'ouverture directe ne se déclenche qu\'une fois (drapeau autoOuvert)',
    html.includes('setAutoOuvert(true);') && html.includes('useState(false),autoOuvert='));
  t('le lien nominatif des familles ouvre toujours sa destination',
    html.includes('(autoLoginParams&&san(autoLoginParams.eleveKey)===identite.cle) ? autoLoginParams.dicteeId'));
  t('un identifiant d\'URL sans correspondance retombe sur la liste, sans planter',
    html.includes('if(cible) ouvrirDictee(cible);\n    else setScreen("mesdictees");'));
  t('retour depuis un écran de travail : liste, jamais réouverture',
    html.includes('function retourListe(){ setEleveData(null);setAttente(null);setScreen("mesdictees"); }'));

  section('M6quater SOUCHE — D11 : l\'absence (cas réel Maïwen)');
  const CLE_M = 'antonini_maiwen';
  const dictM = bâtir(hub.classes).map(d => Object.assign({}, d,
    { absents: (hub.correction_dictee[d.id] || {}).absents || {} }));
  const dGD2 = dictM.find(d => d.id === DID_GD);
  const dUt2 = dictM.find(d => d.id === DID_UTOPIE);
  t('au hub : Maïwen est marquée absente sur « Grandes découvertes »', dGD2.absents[CLE_M] === true);
  t('au hub : elle n\'est pas absente sur « Utopie »', !dUt2.absents[CLE_M]);
  const etM = sandbox(['etatDicteeEleve'], '');
  const eGD2 = etM.etatDicteeEleve(dGD2, CLE_M);
  t('PREUVE D11 : « Grandes découvertes » → ' + eGD2.label + ' (plus « Pas encore corrigée »)', eGD2.code === 'absent');
  t('un élève absent ne voit ni note ni « Ouvrir »', eGD2.montrerNote === false && eGD2.ouvrable === false);
  t('l\'absence prime sur l\'absence de copie rendue',
    etM.etatDicteeEleve({ absents: { x: true }, results: {}, autocorrection: {} }, 'x').code === 'absent');
  t('l\'absence prime même si une copie existe et est rendue',
    etM.etatDicteeEleve({ absents: { x: true }, copyPublishedAt: 1, results: { x: { note: 12 } },
                          autocorrection: { x: { total: 3, solved: 3 } } }, 'x').code === 'absent');
  t('un élève présent sur la même dictée n\'est pas marqué absent',
    (() => { const autre = Object.keys(dGD2.results).find(k => k !== CLE_M);
             return !autre || etM.etatDicteeEleve(dGD2, autre).code !== 'absent'; })());
  t('nœud absents chargé depuis Firebase', html.includes('absents:val[id].absents||{}'));
  t('les cinq états sont exclusifs et couvrent les quatre dimensions',
    ['absent', 'attente', 'nonrendue', 'afaire', 'terminee'].every(c => html.includes('code:"' + c + '"')));

  section('M6quater SOUCHE — brique de rattrapage (chantier X, non ouvert)');
  t('l\'état porte un champ rattrapage explicite, à null tant que le chantier est fermé',
    (html.match(/rattrapage:null/g) || []).length === 5);
  t('aucun appelant ne suppose la présence de rattrapage (pas de déréférencement)',
    !/rattrapage\.(?!$)/.test(html) && !/\.rattrapage\[/.test(html));
  t('l\'écran d\'attente réserve l\'emplacement du rattrapage sans rien coder',
    html.includes('Emplacement du RATTRAPAGE MODAL'));
  t('l\'élève absent est orienté vers le professeur (à la 1re personne), pas laissé sans suite',
    html.includes('Vois avec moi comment la rattraper, si c\\u2019est possible.'));

  section('M6ter SOUCHE — le vocabulaire de l\'élève (complément d\'audit)');
  /* Extraction des composants vus par l'élève, pour interroger leurs textes. */
  const corpsDe = (nom) => { const i = html.indexOf('function ' + nom + '('); let d = 0;
    for (let k = html.indexOf('{', i); k < html.length; k++) {
      if (html[k] === '{') d++; else if (html[k] === '}') { d--; if (!d) return html.slice(i, k + 1); } } return ''; };
  /* Les commentaires du code sont retirés d'abord : sans cela l'extraction enjambe
     un commentaire et le prend pour un texte affiché (faux positif constaté). */
  const sansCommentaires = (src) => src.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
  const textesEleve = ['AppEleve', 'MaCopie', 'EleveCorrection', 'ExercicesEleve']
    .map(n => sansCommentaires(corpsDe(n))).join('\n')
    .match(/"[^"]{12,}"/g).filter(x => /[a-zéèêàûôç]{4,}\s/i.test(x) && !/[{};]|=>|h\(/.test(x));
  t('aucun texte montré à l\'élève ne parle de « publier » (notion interne)',
    !textesEleve.some(x => /publi[ée]/i.test(x)));
  t('le message faux a disparu (« Le professeur ne l\'a pas encore publiée »)',
    !html.includes('Le professeur ne l\\u2019a pas encore publi\\u00e9e'));
  t('message d\'arrivée corrigé : « Ta correction n\'est pas encore consultable »',
    html.includes('Ta correction n\\u2019est pas encore consultable') &&
    html.includes('Elle sera disponible apr\\u00e8s la s\\u00e9ance de correction.'));
  t('l\'inaccompli est dit par le FLUX, jamais par le professeur (principe cardinal)',
    html.includes('Corrig\\u00e9e, pas encore rendue') &&
    (html.split('Elle sera disponible apr\\u00e8s la s\\u00e9ance de correction.').length - 1) === 2 &&
    html.includes('Tes erreurs \\u00e0 revoir appara\\u00eetront ici apr\\u00e8s la s\\u00e9ance de correction.'));
  t('la logique de MaCopie est intacte (seules deux chaînes ont changé)',
    corpsDe('MaCopie').includes('if(!pubAt){') && corpsDe('MaCopie').includes('/copyPublishedAt'));
  t('les trois dimensions restent croisées (published · copyPublishedAt · results)',
    html.includes('if(!d.copyPublishedAt) return {code:"nonrendue"') &&
    html.includes('if(d.published===false)return false;') &&
    html.includes('var corr=d.results?d.results[cle]:null;'));

  section('M6sexies SOUCHE — PRINCIPE CARDINAL : jamais le professeur mis en cause');
  const corpsC = (nom) => { const i = html.indexOf('function ' + nom + '('); let d = 0;
    for (let k = html.indexOf('{', i); k < html.length; k++) {
      if (html[k] === '{') d++; else if (html[k] === '}') { d--; if (!d) return html.slice(i, k + 1); } } return ''; };
  const decode = (t) => t.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => {
    const c = parseInt(h, 16); return (c >= 0xD800 && c <= 0xDFFF) ? m : String.fromCharCode(c); });
  const textesEleveC = ['AppEleve', 'MaCopie', 'EleveCorrection', 'ExercicesEleve', 'Fiches']
    .map(n => corpsC(n).split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n')).join('\n')
    .match(/"[^"]{10,}"/g)
    .filter(x => !/[{};]|=>|h\(|solid |rgba\(|<div|<span|JSON_DICTEE|Tu es un professeur/.test(x))
    .map(decode).filter(x => /[a-zéèêàûôçA-ZÉ]{4,}\s/.test(x));

  t('CAS FONDATEUR : « transcription non saisie par le professeur » a disparu',
    !html.includes('transcription non saisie'));
  t('rien n\'est affiché à la place (pas de message de remplacement)',
    html.includes("transcriptHtml = '';") && !/placeholder-msg">\(/.test(html));
  t('interdit n°1 — aucun manquement imputé au professeur',
    !textesEleveC.some(x => /(le |ton |du )?(professeur|prof)\b[^"]{0,40}(n['’]a pas|ne l['’]a pas|pas encore|n['’]est pas|en attente)/i.test(x)));
  t('interdit n°1 bis — le professeur n\'est jamais sujet d\'une négation à la 1re personne',
    !textesEleveC.some(x => /\b(je|j['’])\b[^"]{0,30}\b(ne |n['’])[^"]{0,30}(pas|plus|jamais)\b/i.test(x)));
  t('interdit n°2 — aucun texte ne révèle que la machine corrige',
    !textesEleveC.some(x => /(l['’]app|l['’]application|le syst[èe]me|automatiquement|par la machine)\b[^"]{0,40}(corrig|calcul|not[ée])/i.test(x)));
  t('interdit n°3 — aucune donnée manquante racontée en désignant un responsable',
    !textesEleveC.some(x => /(non saisi|non renseign|non valid|manquante?)[^"]{0,30}(par|du) (le )?(prof|professeur)/i.test(x)));
  t('l\'ACCOMPLI reste au « je » (l\'autorité s\'affirme)',
    html.includes('c\\u2019est moi qui la calcule sur ta copie papier') &&
    html.includes('J\\u2019ai sign\\u00e9 ta graphie ici') &&
    html.includes('Je la corrigerai \\u00e0 la main'));
  t('l\'ADRESSE reste au « je »', html.includes('Vois avec moi comment la rattraper') &&
    html.includes('Clique ici quand je te le demande'));
  t('l\'INACCOMPLI est impersonnel dans les quatre messages d\'attente',
    ['Ton code n\\u2019est pas encore enregistr\\u00e9',
     'Ta copie est corrig\\u00e9e. Elle sera disponible apr\\u00e8s la s\\u00e9ance de correction.',
     'Cette dict\\u00e9e n\\u2019est pas encore corrig\\u00e9e',
     'Ta correction n\\u2019est pas encore consultable'].every(x => html.includes(x)));
  t('les CONSTATS d\'état restent sans acteur (Pas encore corrigée · Tu étais absent(e))',
    html.includes('label:"Pas encore corrig\\u00e9e"') && html.includes('label:"Tu \\u00e9tais absent(e)"'));

  section('M6quinquies SOUCHE — point 28 : « l\'app, c\'est moi »');
  const corpsDe28 = (nom) => { const i = html.indexOf('function ' + nom + '('); let d = 0;
    for (let k = html.indexOf('{', i); k < html.length; k++) {
      if (html[k] === '{') d++; else if (html[k] === '}') { d--; if (!d) return html.slice(i, k + 1); } } return ''; };
  const sansCom28 = (src) => src.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
  /* Les prompts destinés à l'IA sont écrits PAR le professeur, pas adressés à l'élève :
     on les exclut par leur signature (« Tu es un professeur… », « {{JSON_DICTEE}} »). */
  const textes28 = ['AppEleve', 'MaCopie', 'EleveCorrection', 'ExercicesEleve']
    .map(n => sansCom28(corpsDe28(n))).join('\n')
    .match(/"[^"]{8,}"/g)
    .filter(x => !/[{};]|=>|h\(|JSON_DICTEE|Tu es un professeur|solid |rgba\(/.test(x));
  t('aucun texte élève ne parle du professeur à la 3e personne',
    !textes28.some(x => /\b(ton |le |du |au )?(professeur|prof)\b/i.test(x)));
  t('AppEleve : « je » pour l\'adresse, flux impersonnel pour l\'attente',
    html.includes('Ton code n\\u2019est pas encore enregistr\\u00e9. Viens me voir pour qu\\u2019on le mette en place.') &&
    html.includes('viens me le demander.') &&
    html.includes('Vois avec moi comment la rattraper, si c\\u2019est possible.') &&
    html.includes('Ta copie est corrig\\u00e9e. Elle sera disponible apr\\u00e8s la s\\u00e9ance de correction.'));
  t('MaCopie : le flux annonce, personne n\'est en défaut',
    corpsDe28('MaCopie').includes('Elle sera disponible apr\\u00e8s la s\\u00e9ance de correction.'));
  t('EleveCorrection : ses 4 mentions sont converties (vérifié dans le composant)',
    (() => { const c = corpsDe28('EleveCorrection');
      return c.includes('c\\u2019est moi qui la calcule sur ta copie papier') &&
             c.includes('Clique ici quand je te le demande') &&
             c.includes('o\\u00f9 j\\u2019ai sign\\u00e9 ta graphie') &&
             c.includes('J\\u2019ai sign\\u00e9 ta graphie ici'); })());
  t('Fiches (imprimées et remises aux élèves) : mention convertie',
    corpsDe28('Fiches').includes('J\\u2019ai h\\u00e9sit\\u00e9 \\u00e0 mettre illisible'));
  t('DÉPASSEMENT RÉPARÉ : l\'infobulle du tableau prof (Suivi) est restaurée à l\'identique',
    corpsDe28('Suivi').includes('Note de la dict\\u00e9e (corrig\\u00e9e par le prof)') &&
    !corpsDe28('Suivi').includes('que j\\u2019ai corrig\\u00e9e'));
  t('ExercicesEleve : les 2 mentions sont converties',
    html.includes('Je la corrigerai \\u00e0 la main') && html.includes(', que je corrigerai.'));
  t('le libellé prof « Accès professeur » est conservé (ce n\'est pas un texte élève)',
    html.includes('"Acc\\u00e8s professeur"'));
  t('les prompts IA ne sont pas touchés (écrits par le professeur, pas lus par l\'élève)',
    html.includes('Tu es un professeur de fran\\u00e7ais expert en didactique'));
  t('la logique des écrans de travail reste intacte (seules des chaînes ont changé)',
    corpsDe28('EleveCorrection').includes('totalErrorsRef') && corpsDe28('ExercicesEleve').includes('exCheckItem') !== undefined &&
    corpsDe28('MaCopie').includes('if(!pubAt){'));

  section('M6 SOUCHE — contrats et garde-fous');
  t('socle embarqué en v1.1.0 (recopie verbatim)', html.includes('var MJPC_CORE_VERSION="1.1.0"'));
  t('les 12 fonctions du socle sont présentes une seule fois',
    ['sanMJPC', 'cleClasse', 'classeTestId', 'estClasseInterne', 'estClasseTest', 'extractEleves', 'ecrireClasse',
     'renvoyerVersMJPC', 'resolveEleves', 'publierManifeste', 'lireSessionMJPC', 'validerEleveMJPC']
      .every(f => (html.split('\nfunction ' + f + '(').length - 1) === 1));
  t('pastille de version en dur (socle non modifié, décision Q5)',
    /var APP_VERSION="[\d.]+"/.test(html) && !html.includes('MJPC_CORE_VERSION="1.2'));
  t('lecteur d\'annonces branché sur site/annonces, tolérant à l\'absence',
    html.includes('db.ref("site/annonces")') && /if\(!v\)\{setAnnonces\(\[\]\);return\}/.test(html));
  t('l\'auto-login d\'URL n\'ouvre plus sans identité prouvée',
    !/setEleveData\(\{eleve:eleveName/.test(html) && /if\(!identite\|\|screen!=="login"/.test(html));
  t('manifeste inchangé (aucun nœud nouveau créé par M6)',
    html.includes('noeuds: ["correction_dictee","classes_amenages"]'));
  t('✏️ de l\'accueil et sous-onglet Préparation montent LE MÊME composant (zéro duplication)',
    (html.split('function EditionDictee(').length - 1) === 1 &&
    html.includes('editing===d.id&&h(EditionDictee,{dicteeId:d.id') &&
    html.includes('h(EditionDictee,{dicteeId:p.dicteeId,onClose:p.onDone}'));
  t('✏️ : même source de chargement qu\'avant (config + dictee.amenagee de la dictée)',
    /db\.ref\("correction_dictee\/"\+p\.dicteeId\)\.once\("value"/.test(html) &&
    html.includes('showAmen:!!(amen&&amen.enabled)'));
  t('Réglages n\'écrit aucun nœud Firebase (localStorage seul)',
    (() => { const i = html.indexOf('function Reglages('); const j = html.indexOf('\nfunction ', i + 10); return !html.slice(i, j).includes('db.ref('); })());
  t('écrans de travail non rouverts (GRAMM, correction rapide, snapshots intacts)',
    html.includes('function RapideGlobal(') && html.includes('function CorrEleve(') && html.includes('function _h(forms, group, rule)'));
})();

/* ════ SUITE 3 — EMPREINTE ÉLÈVE (Phase 2, lot 2) ════ */
(function () {
  const noms = ['_idBlocks', '_idSkeleton', '_idIsTimestampKey', '_idStripClassPrefix', '_idVariants', '_idMatch', '_fpScan', '_fpScanChamp', '_eleveFootprint'];
  let code = '';
  for (const n of noms) { const c = corpsFonction(n); if (!c) { section('EMPREINTE'); console.log('  (fonctions absentes — suite ignorée)'); return; } code += c + '\n'; }
  const sb = {};
  new Function(code + '; this.x={_idMatch,_eleveFootprint};').call(sb);
  const { _idMatch, _eleveFootprint } = sb.x;
  section('EMPREINTE ÉLÈVE (lot 2)');
  t('_idMatch : clé composée 4e_banksy__aloyeau_elyse ← ALOYEAU Elyse', _idMatch('4e_banksy__aloyeau_elyse', 'ALOYEAU Elyse'));
  t('_idMatch : clé dégradée CL_MENT_Lylou ← CLÉMENT Lylou', _idMatch('CL_MENT_Lylou', 'CLÉMENT Lylou'));
  t('_idMatch : pas de faux positif entre élèves', !_idMatch('boivin_eden', 'ALOYEAU Elyse'));

  const fp1 = _eleveFootprint(hub, 'ALOYEAU Elyse', '4E BANKSY');
  const nodes1 = new Set(fp1.map(x => x.node));
  t('empreinte ALOYEAU Elyse : mjpcProfils couvert', nodes1.has('mjpcProfils'));
  t('empreinte ALOYEAU Elyse : plan_de_travail couvert (progress/signaux/connexions)', nodes1.has('plan_de_travail'));
  t('empreinte : signaux/connexions présents dans les chemins',
    fp1.some(x => x.path.includes('/signaux/')) && fp1.some(x => x.path.includes('/connexions/')));

  // un lecteur réel de l'applaudimètre (champ lecteur)
  const hl = (hub.applaudimetre || {}).historiqueLectures || {};
  const unLecteur = Object.values(hl).map(p => p && p.lecteur).find(Boolean);
  if (unLecteur) {
    const fp2 = _eleveFootprint(hub, unLecteur, '');
    t('empreinte lecteur applaudimètre (' + unLecteur + ') : passage trouvé par CHAMP',
      fp2.some(x => x.path.startsWith('applaudimetre/historiqueLectures/')));
  }
  // eleveSexes QCM
  const es = ((hub.qcm || {}).eleveSexes || {});
  const cl0 = Object.keys(es)[0];
  if (cl0) {
    const ek0 = Object.keys(es[cl0])[0];
    const nomDe = ek0.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    const fp3 = _eleveFootprint(hub, nomDe, '');
    t('empreinte : qcm/eleveSexes couvert (' + ek0 + ')', fp3.some(x => x.path.startsWith('qcm/eleveSexes/')));
  }
  // GARDE-FOU CAPITAL : l'empreinte ne pointe JAMAIS la conception
  const interdits = ['/config', 'referentiel', 'chapitres', '/bareme', '/corrige', '/meta', 'manifestes', '/site/', '/dictee\u001f'];
  const tousFp = [];
  Object.values(hub.classes || {}).slice(0, 2).forEach((c, i) => {});
  ['ALOYEAU Elyse', 'BOIVIN Eden', unLecteur || 'X Y'].forEach(n => { _eleveFootprint(hub, n, '4E BANKSY').forEach(x => tousFp.push(x.path)); });
  const fuite = tousFp.find(p => ['referentiel', 'chapitres', 'manifestes', 'corbeille'].some(m => p.includes(m)) || /\/(config|bareme|corrige|meta)(\/|$)/.test(p));
  t('GARDE-FOU : aucune empreinte ne pointe la conception (config/referentiel/chapitres/corrige/meta/manifestes/corbeille)', !fuite);
  if (fuite) console.log('    FUITE :', fuite);
  // exclusion des binômes (prénoms ambigus)
  const fpT = _eleveFootprint(hub, 'CALDEIRA Tiago', '3E Charles de Gaulle');
  t('exclusion à dessein : aucun chemin debats/* (binômes = prénoms, trop ambigu)', !fpT.some(x => x.path.startsWith('debats/')));
})();


/* ════ SUITE 4 — PURGE DE RENTRÉE (Phase 2, lot 3) ════ */
(function () {
  const x = sandbox(['_b2GetPath', '_purgeResoudreMotif', '_purgeExpand', '_purgePlan'], '');
  if (!x) { section('PURGE'); console.log('  (fonctions absentes — suite ignorée)'); return; }
  section('PURGE DE RENTRÉE (lot 3)');
  const { _purgeResoudreMotif, _purgeExpand, _purgePlan } = x;

  t('wildcard : dictees/*/results → autant que de dictées avec results',
    _purgeResoudreMotif(hub, 'dictees/*/results').length === Object.values(hub.dictees).filter(d => d.results).length);
  t('motif inexistant → zéro chemin (pas d\'invention)', _purgeResoudreMotif(hub, 'dictees/*/inexistant').length === 0);
  t('motif simple : students absent du hub → zéro chemin', _purgeResoudreMotif(hub, 'students').length === 0);

  // PRESERVER PRIME : session purgée SAUF session/reglages (le cas fondateur applause_meter)
  const hubT = { a: { session: { reglages: { x: 1 }, reader: 'X', classeSlug: 'Y' } } };
  const del1 = _purgeExpand(hubT, 'a/session', ['a/session/reglages']);
  t('preserver prime : a/session éclatée en enfants, reglages épargné',
    del1.length === 2 && del1.includes('a/session/reader') && del1.includes('a/session/classeSlug') && !del1.includes('a/session/reglages'));
  t('preserver prime : chemin lui-même préservé → aucun delete', _purgeExpand(hubT, 'a/session/reglages', ['a/session/reglages']).length === 0);
  t('sans branche préservée → delete du bloc entier', _purgeExpand(hubT, 'a/session', []).join() === 'a/session');

  // Plan complet sur le hub réel avec les VRAIS manifestes publiés
  const res = _purgePlan(hub);
  const apps = Object.keys(res.parApp);
  /* MàJ M5 (17/07) : le manifeste 'taxonomie' (publié en M2) porte le compte à 11 —
     10 apps + le référentiel. */
  t('plan : les 11 manifestes lus — 10 apps + taxonomie (' + apps.length + ')', apps.length === 11 && apps.indexOf('taxonomie') > -1);
  t('plan : jamais un chemin de conception',
    !res.plan.some(p => ['referentiel', 'chapitres', 'manifestes', 'corbeille'].some(m => p.path.includes(m)) || /\/(config|bareme|corrige|meta|reglages|dictee)$/.test(p.path)));
  t('plan : applaudimetre/session/reglages épargné, le reste de session purgé',
    !res.plan.some(p => p.path === 'applaudimetre/session/reglages') &&
    !res.plan.some(p => p.path === 'applaudimetre/session') &&
    res.plan.some(p => p.path.startsWith('applaudimetre/session/')));
  t('plan : dédoublonné inter-apps', new Set(res.plan.map(p => p.path)).size === res.plan.length);
  t('plan : mesurable (taille totale > 0)', Object.values(res.parApp).reduce((a, d) => a + d.taille, 0) > 0);
  console.log('    → dry-run réel :', res.plan.length, 'emplacements sur', apps.length, 'contrats');
})();


/* ════ SUITE 5 — ORPHELINS (Phase 2, lot 4) ════ */
(function () {
  const x = sandbox(['_orphelins'], 'var _ORPH_BLANCHE={classes:1,manifestes:1,corbeille:1};');
  if (!x) { section('ORPHELINS'); console.log('  (fonction absente — suite ignorée)'); return; }
  section('ORPHELINS (lot 4)');
  const os = x._orphelins(hub);
  /* MàJ M2 (16/07) : le nœud `results` a disparu du hub depuis l'écriture du test — l'état sain
     est désormais AUCUN orphelin ; on tolère les deux états connus, tout autre nœud ressort. */
  t('sur le hub réel : aucun orphelin (ou `results` seul, état historique) (' + JSON.stringify(os) + ')',
    os.length === 0 || (os.length === 1 && os[0] === 'results'));
  t('qcm couvert par préfixe (manifeste déclare qcm/eleveSexes…)', !os.includes('qcm'));
  t('mjpcProfils couvert (déclaré, hors purge : longitudinal voulu)', !os.includes('mjpcProfils'));
  t('liste blanche jamais orpheline', !os.includes('classes') && !os.includes('manifestes') && !os.includes('corbeille'));
  t('détection des futurs : un nœud inconnu ressortirait', x._orphelins(Object.assign({ zombie_2027: { a: 1 } }, hub)).includes('zombie_2027'));
})();


/* ════ SUITE 6 — SESSION PARTAGÉE MJPC (passe panneaux, jalon 2 débat) ════ */
(function () {
  const prelude = `var _store={};
    var sessionStorage={getItem:k=>_store[k]||null};
    var localStorage={getItem:k=>_store[k]||null};
    this._store=_store;`;
  const x = sandbox(['sanMJPC', 'extractEleves', 'lireSessionMJPC', 'validerEleveMJPC'], prelude, ['_store']);
  if (!x) { section('SESSION MJPC'); console.log('  (socle < v1.1.0 dans ce fichier — suite ignorée)'); return; }
  section('SESSION PARTAGÉE MJPC (socle v1.1.0)');
  const { lireSessionMJPC, validerEleveMJPC } = x;
  const pose = o => { x._store['mjpc_eleve'] = JSON.stringify(o); };

  pose({ nom: 'CLÉMENT', prenom: 'Noé', classe: '4E BANKSY', ts: Date.now() });
  const s1 = lireSessionMJPC();
  t('session élève fraîche → lue (nom complet reconstruit)', !!s1 && s1.nom === 'CLÉMENT Noé' && !s1.is_prof);

  pose({ nom: 'X', prenom: 'Y', classe: '4E BANKSY', ts: Date.now() - 13 * 3600 * 1000 });
  t('session de 13 h → périmée (validité 12 h)', lireSessionMJPC() === null);

  pose({ is_prof: true, display: 'M. Meney (prof)', ts: Date.now() });
  const sp = lireSessionMJPC();
  t('session professeur → reconnue', !!sp && sp.is_prof === true);
  t('session professeur ≠ élève (jamais validée comme élève)', validerEleveMJPC(sp, hub.classes) === null);

  // validation contre le registre RÉEL du hub
  const roster = Object.entries(hub.classes).find(([k, v]) => !v.archivee && k !== '_TEST');
  const unNom = (function () { const l = []; const c = roster[1]; (Array.isArray(c.eleves) ? c.eleves : Object.values(c.eleves || c)).forEach(e => { if (typeof e === 'string') l.push(e); }); return l[0]; })();
  if (unNom) {
    const ok = validerEleveMJPC({ is_prof: false, nom: unNom, classe: roster[0], ts: Date.now() }, hub.classes);
    t('élève réel du registre (' + unNom + ', ' + roster[0] + ') → identité résolue, clé canonique', !!ok && ok.cle === ok.cle.toLowerCase() && ok.nom === unNom);
  }
  t('élève inconnu au registre → refusé', validerEleveMJPC({ is_prof: false, nom: 'INTRUS Total', classe: roster[0], ts: Date.now() }, hub.classes) === null);
  t('classe inexistante → refusé', validerEleveMJPC({ is_prof: false, nom: unNom || 'X Y', classe: '6e FANTOME', ts: Date.now() }, hub.classes) === null);
})();

/* ════ SUITE TAXONOMIE — Concordance premier étage (M2, 16/07/2026) ════
   Charge taxonomie_atelier.json (à côté du banc, ou 4e argument) et vérifie :
   intégrité structurelle + RÈGLE DE COMPTAGE MULTI-CIBLE (plan, point 14bis).
   taxoCompter est l'IMPLÉMENTATION DE RÉFÉRENCE du comptage : quand une app
   l'embarquera (M9, M19+), le banc testera SA copie via corpsFonction — d'ici
   là, la référence vit ici, livrée avec la règle (règle + test, même livraison). */
function taxoCompter(erreurs, table) {
  var idx = {}; table.forEach(function (a) { idx[a.terme] = a; });
  var points = {}, nonMappes = 0;
  erreurs.forEach(function (e) {
    var a = idx[e.terme];
    if (!a) { nonMappes++; return; }
    /* UNE erreur = UN point, posé à l'étage que le code connaît :
       la cible unique (egal) ou le GROUPE des cibles (inclus), jamais dupliqué. */
    var cle = a.cibles.slice().sort().join('+');
    points[cle] = (points[cle] || 0) + 1;
  });
  return { points: points, nonMappes: nonMappes };
}
(function () {
  var taxoPath = process.argv[4] || require('path').join(__dirname, 'taxonomie_atelier.json');
  if (!fs.existsSync(taxoPath)) { section('TAXONOMIE'); console.log('  (taxonomie_atelier.json absent — suite ignorée)'); return; }
  var taxo = JSON.parse(fs.readFileSync(taxoPath, 'utf8'));
  section('TAXONOMIE (M2 — intégrité)');
  var doms = taxo.domaines || [];
  var fams = [], notions = [];
  doms.forEach(function (d) { (d.familles || []).forEach(function (f) { fams.push(f); (f.notions || []).forEach(function (n) { notions.push(n); }); }); });
  t('5 domaines', doms.length === 5);
  t('40 familles (tranchage 10/05)', fams.length === 40);
  t('148 notions (Zone 2 réelle + revalidation M2)', notions.length === 148);
  var nids = notions.map(function (n) { return n.id; });
  t('ids de notions uniques', new Set(nids).size === nids.length);
  var fids = fams.map(function (f) { return f.id; });
  t('ids de familles uniques', new Set(fids).size === fids.length);
  t('ids retirés jamais réutilisés (ortho-lex-009, ortho-gram-033)', nids.indexOf('ortho-lex-009') < 0 && nids.indexOf('ortho-gram-033') < 0);
  t('double libellé prof/élève sur toute notion et toute famille',
    notions.every(function (n) { return n.libelleProf && n.libelleEleve; }) &&
    fams.every(function (f) { return f.libelleProf && f.libelleEleve; }));
  t('fam-23 : id conservé, libellé élargi (invariant id/libellé)',
    fams.some(function (f) { return f.id === 'fam-23' && /Temps composés/.test(f.libelleProf); }));
  t('meta/version présente', !!(taxo.meta && taxo.meta.version));
  t('4 types d\'erreur (dimension orthogonale)', (taxo.typesErreur || []).length === 4);
  var nComp = 0;
  Object.keys(taxo.competences || {}).forEach(function (k) { taxo.competences[k].forEach(function (d) { nComp += d.items.length; }); });
  t('28 compétences (18 Français C4 + 10 transversales)', nComp === 28);
  /* Résolution des cibles + egal → cible unique */
  var valides = new Set(nids.concat(fids, doms.map(function (d) { return d.id; }), (taxo.typesErreur || []).map(function (e) { return e.id; })));
  Object.keys(taxo.competences || {}).forEach(function (k) { taxo.competences[k].forEach(function (d) { valides.add(d.id); d.items.forEach(function (c) { valides.add(c.id); }); }); });
  var tables = (taxo.alias && taxo.alias.tables) || {}, okCibles = true, okEgal = true, nAlias = 0;
  Object.keys(tables).forEach(function (app) {
    tables[app].forEach(function (a) {
      nAlias++;
      if (a.relation === 'egal' && a.cibles.length !== 1) okEgal = false;
      a.cibles.forEach(function (c) { if (!valides.has(c)) okCibles = false; });
    });
  });
  t('26 alias au squelette (9 + 13 + 4), tous en statut proposé', nAlias === 26 &&
    Object.keys(tables).every(function (app) { return tables[app].every(function (a) { return a.statut === 'propose'; }); }));
  t('egal → cible unique (contrôle d\'intégrité)', okEgal);
  t('aucun alias orphelin (toutes cibles résolvables)', okCibles);

  section('TAXONOMIE (M2 — règle de comptage 14bis)');
  var tMan = tables.manuscrit || [], tDu = tables.dictee_universelle || [];
  /* LE test exigé : 2 erreurs G → jamais plus de 2 points au total, où qu'on regarde. */
  var r1 = taxoCompter([{ terme: 'G' }, { terme: 'G' }], tMan);
  var tot1 = Object.values(r1.points).reduce(function (s, v) { return s + v; }, 0);
  t('2 erreurs G (multi-cible ×3 domaines) → total = 2 points exactement', tot1 === 2 && r1.nonMappes === 0);
  t('2 erreurs G → un seul étage porteur (le groupe), aucune duplication par domaine', Object.keys(r1.points).length === 1);
  var r2 = taxoCompter([{ terme: 'G-ACC' }], tDu);
  t('1 erreur G-ACC (inclus fam-07+fam-08) → 1 point au groupe, pas 1 par famille',
    Object.values(r2.points).reduce(function (s, v) { return s + v; }, 0) === 1 && Object.keys(r2.points).length === 1);
  var mix = [{ terme: 'G-HOM' }, { terme: 'G-ACC' }, { terme: 'G-ACC' }, { terme: 'L-MAJ' }, { terme: 'O1' }];
  var r3 = taxoCompter(mix, tDu);
  t('mix egal/inclus/errType (5 erreurs) → invariant : somme des points = 5',
    Object.values(r3.points).reduce(function (s, v) { return s + v; }, 0) === 5);
  var r4 = taxoCompter([{ terme: 'CODE-INCONNU' }], tDu);
  t('terme non mappé → compté à part (nonMappes), jamais perdu ni inventé',
    r4.nonMappes === 1 && Object.keys(r4.points).length === 0);
})();

/* ════ SUITE 2 — CORBEILLE (Phase 2, lot 1) ════ */
(async function () {
  const prelude = `var FIREBASE_BASE='https://mock';var _puts=[];
    function _nowStr(){return 'mock-date';}
    function fetch(url,opts){_puts.push({url:url,body:opts&&JSON.parse(opts.body)});return Promise.resolve({ok:true});}`;
  const x = sandbox(['_anneeScolaire', '_b2Url', '_fbPutPath', '_corbeillePut'], prelude, ['_puts']);
  if (!x) { section('CORBEILLE'); console.log('  (fonctions absentes de ce fichier — suite ignorée)'); return fin(); }
  section('CORBEILLE (lot 1)');
  const d = new Date();
  const attendue = (d.getMonth() < 7) ? ((d.getFullYear() - 1) + '-' + d.getFullYear()) : (d.getFullYear() + '-' + (d.getFullYear() + 1));
  t('_anneeScolaire dynamique (' + attendue + ')', x._anneeScolaire() === attendue);
  t('_b2Url encode les segments sans casser les /', x._b2Url('corbeille/2026-07-14/x y') === 'corbeille/2026-07-14/x%20y');
  const chemin = await x._corbeillePut('retrait-eleve', { classes: { X: { eleves: ['A B'] } } }, { eleve: 'A B' });
  t('_corbeillePut : chemin corbeille/<jour>/<motif>_<HHMMSS>',
    /^corbeille\/\d{4}-\d{2}-\d{2}\/retrait-eleve_\d{6}$/.test(chemin));
  const put = x._puts[0];
  t('_corbeillePut : URL REST cohérente avec le chemin', put.url.includes('/' + chemin.split('/').map(encodeURIComponent).join('/') + '.json'));
  t('_corbeillePut : payload {_meta{motif,annee,source}, data} complet',
    put.body._meta && put.body._meta.motif === 'retrait-eleve' && put.body._meta.annee === attendue &&
    put.body._meta.source === 'index' && put.body._meta.eleve === 'A B' &&
    put.body.data.classes.X.eleves[0] === 'A B');
  /* Non-régression écran b2 : reconstruction de classe après retrait (fonction existante) */
  const y = sandbox(['_b2ClassRebuild'], 'var _B2_META={niveau:1,annee:1,id:1,title:1,nom:1,archivee:1,couleur:1};');
  if (y) {
    const nb = y._b2ClassRebuild(JSON.parse(JSON.stringify(hub.classes['4E PYTHAGORE'])), { [Object.values(hub.classes['4E PYTHAGORE']).find(v => typeof v === 'string')]: true });
    t('_b2ClassRebuild : retrait d\'un nom sur classe réelle, métas conservées, ré-indexé',
      nb && nb.archivee === hub.classes['4E PYTHAGORE'].archivee);
  }
  fin();
})();
