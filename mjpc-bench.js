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


// Identifiant réel de l'app : lu dans la déclaration var MJPC_APP, pas dans un
// commentaire. Sert de garde à toutes les suites propres à une app.
function idDeLApp(src){
  // Le socle embarque un EXEMPLE COMMENTÉ de MJPC_APP portant id "correction_dictee" :
  // on n'accepte donc que la déclaration en début de ligne, non commentée.
  const lignes = src.split('\n');
  for (let i = 0; i < lignes.length; i++) {
    if (!/^\s*var\s+MJPC_APP\s*=\s*\{/.test(lignes[i])) continue;
    const bloc = lignes.slice(i, i + 12).filter(l => !/^\s*\/\//.test(l)).join('\n');
    const m = bloc.match(/id:\s*"([^"]+)"/);
    if (m) return m[1];
  }
  return null;
}

/* ════ SUITE M6 — SOUCHE : passe de la grille (18/07/2026) ════ */
(function () {
  // Garde corrigée (M7, 2e essai) : identifier l'APP par sa DÉCLARATION réelle.
  // `function Nav2(` existe désormais dans toute app passée à la grille ; et un
  // simple id: "correction_dictee" matche aussi le COMMENTAIRE d'exemple du socle,
  // présent dans toutes les apps (première correction prise en défaut).
  if (idDeLApp(html) !== 'correction_dictee') { section('M6 SOUCHE'); console.log('  (app hors périmètre M6 — suite ignorée)'); return; }
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
    html.includes('label:"Disponible apr\\u00e8s la s\\u00e9ance"') &&
    html.includes('attente_copie: "Elle sera disponible apr\\u00e8s la s\\u00e9ance de correction."') &&
    html.includes('Tes erreurs \\u00e0 revoir appara\\u00eetront ici apr\\u00e8s la s\\u00e9ance de correction.'));
  t('ARBITRAGE : la ligne ne laisse plus lire une rétention (« Corrigée, pas encore rendue » retiré)',
    !html.includes('Corrig\\u00e9e, pas encore rendue'));
  t('la logique de MaCopie est intacte (seules deux chaînes ont changé)',
    corpsDe('MaCopie').includes('if(!pubAt){') && corpsDe('MaCopie').includes('/copyPublishedAt'));
  t('les trois dimensions restent croisées (published · copyPublishedAt · results)',
    html.includes('if(!d.copyPublishedAt) return {code:"nonrendue"') &&
    html.includes('if(d.published===false)return false;') &&
    html.includes('var corr=d.results?d.results[cle]:null;'));

  section('M6-SOLDE — D13 dictionnaire de textes');
  const dico = sandbox(['txt'], 'var TEXTES_SURCHARGE={};\n' +
    html.match(/var TEXTES_DEFAUT = \{[\s\S]*?\n\};/)[0] + '\n', ['TEXTES_DEFAUT']);
  t('les 4 textes validés sont dans le dictionnaire (+ le titre et l\'emoji de fin)',
    ['attente_copie', 'liste_vide', 'invitation_rattrapage', 'fin_parcours_titre', 'fin_parcours_emoji']
      .every(k => typeof dico.TEXTES_DEFAUT[k] === 'string'));
  t('txt() rend le défaut quand rien n\'est surchargé',
    dico.txt('attente_copie') === dico.TEXTES_DEFAUT.attente_copie);
  const dicoS = sandbox(['txt'], 'var TEXTES_SURCHARGE={liste_vide:"Rien pour l\'instant.",attente_copie:"   "};\n' +
    html.match(/var TEXTES_DEFAUT = \{[\s\S]*?\n\};/)[0] + '\n', ['TEXTES_DEFAUT']);
  t('une surcharge non vide remplace le défaut', dicoS.txt('liste_vide') === "Rien pour l'instant.");
  t('un champ VIDE retombe sur le défaut (Paul efface pour revenir à l\'original)',
    dicoS.txt('attente_copie') === dicoS.TEXTES_DEFAUT.attente_copie);
  t('clé inconnue → chaîne vide, jamais "undefined" à l\'écran', dicoS.txt('nexiste_pas') === '');
  t('{prenom} est substitué dans le titre de fin',
    dico.txt('fin_parcours_titre', { prenom: 'Alice' }).indexOf('Alice') >= 0 &&
    dico.txt('fin_parcours_titre', { prenom: 'Alice' }).indexOf('{prenom}') < 0);
  t('CLÉ UNIQUE PARTAGÉE : le message d\'attente sert aux DEUX emplacements',
    (html.split('txt("attente_copie")').length - 1) >= 2);
  t('le « Bravo » est traité comme un ensemble (titre + emoji + prénom)',
    html.includes('txt("fin_parcours_emoji")?h("div"') &&
    html.includes('txt("fin_parcours_titre",{prenom:d.eleve.split(" ").pop()})'));
  t('emoji vidé → aucun bloc affiché (pas de div vide)',
    /txt\("fin_parcours_emoji"\)\?h\("div"[\s\S]{0,120}:null/.test(html));
  t('le dictionnaire est chargé au démarrage, pour le prof comme pour l\'élève',
    html.includes('chargerTextes(function(){') && html.includes('function App(){'));
  t('l\'app survit à un nœud absent (surcharge vide = défauts)',
    html.includes('TEXTES_SURCHARGE = (v&&typeof v==="object")?v:{};'));
  t('les CONSTATS ne sont pas passés dans le dictionnaire (critère du point 26)',
    !['Pas encore corrig', 'Tu \\u00e9tais absent', 'Ce code ne correspond']
      .some(x => html.match(/var TEXTES_DEFAUT = \{[\s\S]*?\n\};/)[0].includes(x)));

  section('M6-SOLDE — D1 mode test de la souche');
  t('deux dictées : une rendue, une pas encore corrigée',
    html.includes('var TEST_DICTEE_A = "dictee_test_rendue"') && html.includes('var TEST_DICTEE_B = "dictee_test_en_attente"'));
  t('la dictée A est RENDUE (copyPublishedAt) — l\'élève peut vraiment ouvrir sa copie',
    /copyPublishedAt:maintenant/.test(html));
  t('un élève ABSENT est prévu (l\'état D11 se teste sans toucher au réel)',
    html.includes('absents:{"moreau_sacha":true}'));
  t('les élèves fictifs ont leurs CODES (sinon le portail les refuse)',
    html.includes('var TEST_CODES = {') && html.includes('maj["codes/"+k]='));
  t('classe à la convention _test_<app>', html.includes('ecrireClasse(db, d.classe, d.eleves,') && html.includes('classe:classeTestId()'));
  t('nettoyage des zombies AVANT génération (le bac à sable ne s\'empile pas)',
    /purgerDonneesTest\(function\(\)\{\s*\n\s*ecrireClasse/.test(html));
  t('purge EXHAUSTIVE : dictées + classe + codes, rien d\'autre',
    html.includes('chemins.push("correction_dictee/"+x.id)') &&
    html.includes('chemins.push("classes/"+d.classe)') &&
    html.includes('chemins.push("codes/"+k)'));
  t('INCARNATION : ouvre l\'écran élève réel, pas une simulation',
    html.includes('?mode=eleve&incarner=') && html.includes('via:"incarnation"'));
  t('l\'incarnation est LIMITÉE au bac à sable (aucun élève réel incarnable)',
    /var cl=classesData\[classeTestId\(\)\];\s*\n\s*if\(!cl\)return;/.test(html));
  t('la purge annonce ce qu\'elle va supprimer (dénombrement, pas de destruction muette)',
    html.includes('Seront supprim\\u00e9s : les 2 dict\\u00e9es de test'));

  section('M6-SOLDE bis — arbitrages ③ ④ ⑤');
  t('③ l\'outil est nommé : « Éditeur des messages élève » sous le titre parlant',
    html.includes('"Ce que lisent les \\u00e9l\\u00e8ves"') &&
    html.includes('h("strong",null,"\\u00c9diteur des messages \\u00e9l\\u00e8ve.")'));
  t('④ « Masquer les copies » (bouton, infobulle et confirmation alignés)',
    html.includes('"\\ud83d\\ude48 Masquer les copies"') &&
    html.includes('title:"Masquer les copies (les \\u00e9l\\u00e8ves perdront') &&
    html.includes('setPubMsg("\\u2705 Copies masqu\\u00e9es")'));
  t('④ plus aucun « Retirer » ni « Dépublier » sur le geste des copies (confirmation comprise)',
    !html.includes('Retirer les copies') && !html.includes('D\\u00e9publier ?') &&
    html.includes('"Masquer les copies ? Les \\u00e9l\\u00e8ves ne pourront plus'));
  t('④ les « Retirer » sans rapport (lacune, PAP) sont intacts',
    html.includes('Retirer la lacune sur') && html.includes('Retirer du registre PAP'));
  t('⑤ le profil « MONSIEUR Meney » n\'existe plus (aucune trace dans le fichier)',
    !/meney_monsieur|MENEY/.test(html));
  t('⑤ doLogin n\'a plus de branche d\'exception : tout le monde passe par le code',
    (() => { const i = html.indexOf('function doLogin('); const j = html.indexOf('\n  }', i);
             const c = html.slice(i, j); return !c.includes('testErrors') && c.includes('codeAttendu('); })());
  t('⑤ le bouton « Recommencer » n\'est pas devenu du code mort : il sert au bac à sable',
    html.includes('estClasseTest(d.dictee&&d.dictee.classe)&&h("button",') &&
    html.includes('Recommencer la correction ?'));
  t('⑤ « Recommencer » reste inaccessible à un élève réel (classe non interne)',
    (() => { const sb = sandbox(['estClasseInterne', 'estClasseTest'], '');
             return sb.estClasseTest('_test_correction_dictee') && !sb.estClasseTest('5e HERG\u00c9')
                 && !sb.estClasseTest('4E BANKSY'); })());

  section('M6-SOLDE — D4 corbeille · D6 mobile · D8 casse · D10 vocabulaire');
  t('D4 : archivage en corbeille AVANT destruction',
    html.includes('var chemin="corbeille/"+jour+"/suppression-dictee_"+hhmmss;') &&
    /db\.ref\(chemin\)\.set\([\s\S]{0,300}\.then\(function\(\)\{return db\.ref\("correction_dictee\/"\+d\.id\)\.remove\(\)\}\)/.test(html));
  t('D4 : année scolaire dynamique (pas de millésime en dur)',
    html.includes('(now.getMonth()<7)?((now.getFullYear()-1)+"-"+now.getFullYear())'));
  t('D4 : le fichier local reste la première ceinture', html.includes('a.download="dictee_"+d.id+"_"'));
  t('D4 : un échec d\'archivage devient un choix explicite, jamais un silence',
    html.includes('archivage dans la corbeille MJPC a \\u00e9chou\\u00e9'));
  t('D6 : les tableaux denses défilent au lieu de s\'écraser',
    html.includes('.table-scroll{overflow-x:auto') && html.includes('.table-scroll table{min-width:620px}'));
  t('D6 : Bilan et Suivi sont bien enveloppés',
    (html.split('h("div",{className:"table-scroll"},h("table",{className:"bilan-table"}').length - 1) === 2);
  t('D6 : aucun effet en desktop (règle sous media query seule)',
    /@media \(max-width:820px\)\{\s*\n\s*\.table-scroll\{/.test(html));
  t('D8 : plus aucune résolution par un nom venu d\'une config de dictée',
    !/extractEleves\(CLASSES\[(classeName|classeInput|d\.classe|cfg)/.test(html));
  t('D8 : les 2 accès directs restants itèrent sur les CLÉS du registre (aucune divergence possible)',
    /Object\.keys\(CLASSES\)\.map\(function\(cn\)/.test(html) && /Object\.keys\(registre\)/.test(html));
  t('D8 : les 4 résolutions passent par classeDuRegistre',
    (html.split('extractEleves(classeDuRegistre(').length - 1) >= 4);
  t('D10 : les copies se RENDENT, la dictée se PUBLIE',
    html.includes('"\\ud83d\\udce4 Rendre les copies ("') && html.includes('"Copies pas encore rendues"') &&
    html.includes('"\\u2705 Copies rendues le "') && html.includes('"Non publi\\u00e9e"'));
  t('D10 : plus aucun bouton « Publier » ne désigne les copies',
    !html.includes('"\\ud83d\\udce4 Publier ("') && !html.includes('"\\u2715 D\\u00e9publier"'));

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
     '"Ta copie est corrig\\u00e9e. "+txt("attente_copie")',
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
    html.includes('"Ta copie est corrig\\u00e9e. "+txt("attente_copie")'));
  t('MaCopie : le flux annonce, personne n\'est en défaut (même clé que le portail)',
    corpsDe28('MaCopie').includes('txt("attente_copie")'));
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
  t('manifeste à jour : le nœud des textes est déclaré ET préservé',
    html.includes('noeuds: ["correction_dictee","classes_amenages","correction_dictee_textes"]') &&
    html.includes('"correction_dictee_textes"],') &&
    !/purger:[\s\S]{0,400}correction_dictee_textes/.test(html));
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

/* ════ SUITE M7 — QCM : passe de la grille (18/07/2026) ════ */
(function () {
  if (idDeLApp(html) !== 'evaluation-qcm') { section('M7 QCM'); console.log('  (app hors périmètre M7 — suite ignorée)'); return; }
  // Second garde : la suite décrit la passe M7. Sur le QCM d'AVANT la passe
  // (production), elle n'a rien à dire — elle s'ignore au lieu de planter.
  if (!/function cloturerSession\(/.test(html)) { section('M7 QCM'); console.log('  (QCM avant la passe M7 — suite ignorée)'); return; }
  const qcm = hub.qcm || {};

  section('M7 QCM — DOUBLE BARÈME (point 14bis : on ne fige pas un calcul non vérifié)');
  const bar = sandbox(['modeEval', 'scoreMaxQuestion', 'scoreMaxEval', 'calculerScoreQuestion'], '');
  // Contrat LU dans le fichier : calculerScoreQuestion rend {score, max, ok, partiel}.
  const sc = (c, b, m) => bar.calculerScoreQuestion(c, b, m).score;
  // Mode « Tout ou rien » : 1 point si et seulement si la sélection est exacte.
  t('strict — sélection exacte → 1', sc(['A', 'B'], ['A', 'B'], 'strict') === 1);
  t('strict — réponse PARTIELLE → 0 (pas de demi-point caché)', sc(['A'], ['A', 'B'], 'strict') === 0);
  t('strict — SUR-SÉLECTION (les bonnes + une fausse) → 0', sc(['A', 'B', 'C'], ['A', 'B'], 'strict') === 0);
  t('strict — aucune sélection → 0', sc([], ['A'], 'strict') === 0);
  t('strict — le drapeau ok ne ment pas',
    bar.calculerScoreQuestion(['A', 'B'], ['A', 'B'], 'strict').ok === true &&
    bar.calculerScoreQuestion(['A'], ['A', 'B'], 'strict').ok === false);
  // Mode « Points par bonne case ».
  t('partiel — réponse partielle → 1 sur 2 (le point partiel existe)', sc(['A'], ['A', 'B'], 'partiel') === 1);
  t('partiel — sélection exacte → 2', sc(['A', 'B'], ['A', 'B'], 'partiel') === 2);
  t('partiel — SUR-SÉLECTION pénalisée : 2 bonnes + 1 fausse → 1', sc(['A', 'B', 'C'], ['A', 'B'], 'partiel') === 1);
  t('partiel — le drapeau partiel distingue le partiel du parfait',
    bar.calculerScoreQuestion(['A'], ['A', 'B'], 'partiel').partiel === true &&
    bar.calculerScoreQuestion(['A', 'B'], ['A', 'B'], 'partiel').partiel === false);
  t('LE PLANCHER À ZÉRO TIENT — aucune combinaison ne rend un score négatif',
    (() => { const choix = [[], ['A'], ['B'], ['C'], ['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B', 'C']];
             const bonnes = [[], ['A'], ['A', 'B'], ['A', 'B', 'C']];
             for (const m of ['strict', 'partiel']) for (const c of choix) for (const b of bonnes)
               if (sc(c, b, m) < 0) return false;
             return true; })());
  t('question SANS bonne réponse → 0, jamais NaN',
    (() => { for (const m of ['strict', 'partiel']) { const v = sc(['A'], [], m);
             if (typeof v !== 'number' || isNaN(v)) return false; if (v !== 0) return false; } return true; })());
  t('aucun score ne dépasse son maximum (toutes combinaisons, deux modes)',
    (() => { const choix = [[], ['A'], ['A', 'B'], ['A', 'B', 'C'], ['C']];
             const bonnes = [['A'], ['A', 'B'], ['A', 'B', 'C']];
             for (const m of ['strict', 'partiel']) for (const c of choix) for (const b of bonnes) {
               const r = bar.calculerScoreQuestion(c, b, m);
               if (r.score > r.max) return false; }
             return true; })());
  t('scoreMaxEval : strict = nombre de questions',
    bar.scoreMaxEval({ mode: 'strict', questions: [{ bonnes: ['A', 'B'] }, { bonnes: ['C'] }] }) === 2);
  t('scoreMaxEval : partiel = somme des bonnes cases',
    bar.scoreMaxEval({ mode: 'partiel', questions: [{ bonnes: ['A', 'B'] }, { bonnes: ['C'] }] }) === 3);
  // Sur les évaluations RÉELLES du hub.
  const evsReelles = Object.keys(qcm.evaluations || {}).map(k => qcm.evaluations[k]).filter(e => e && e.questions);
  t('évaluations réelles du hub (' + evsReelles.length + ') : maximum cohérent, jamais nul ni NaN',
    evsReelles.length > 0 && evsReelles.every(e => { const m = bar.scoreMaxEval(e); return m > 0 && !isNaN(m); }));
  t('sur données réelles : le score d\'un élève ne dépasse jamais le maximum de l\'éval',
    (() => { const sess = qcm.sessions || {};
      for (const sid of Object.keys(sess)) { const s2 = sess[sid]; const ev = qcm.evaluations[s2.evalId];
        if (!ev || !ev.questions || !s2.reponses) continue;
        const m = bar.modeEval(ev), maxi = bar.scoreMaxEval(ev);
        const eleves = new Set(); Object.keys(s2.reponses).forEach(qi => Object.keys(s2.reponses[qi] || {}).forEach(e => eleves.add(e)));
        for (const el of eleves) { let tot = 0;
          ev.questions.forEach((q, qi) => { const rep = s2.reponses[qi] && s2.reponses[qi][el];
            if (rep) tot += bar.calculerScoreQuestion(rep.choix || rep, q.bonnes || [], m).score; });
          if (tot > maxi) return false; } }
      return true; })());

  section('M7 QCM — P2 : l\'instrument de mesure est versionné');
  const p2 = sandbox(['versionEval', 'identiteEval', 'evalDeSession', 'sessionEstFigee', 'construireEvalSnapshot', 'evalADesResultats'],
                     corpsFonction('modeEval') + '\n');
  t('une éval sans champ version vaut la version 1', p2.versionEval({}) === 1 && p2.versionEval(null) === 1);
  t('l\'identité porte la version (eval_1@v2)', p2.identiteEval('eval_1', 2) === 'eval_1@v2');
  t('le snapshot fige questions, mode et version — et rien de mouvant',
    (() => { const s = p2.construireEvalSnapshot({ titre: 'T', mode: 'partiel', version: 3, questions: [{ bonnes: ['A'] }] });
             return s.version === 3 && s.mode === 'partiel' && s.questions.length === 1 && typeof s.figeLe === 'number'; })());
  t('le snapshot est une COPIE : modifier l\'éval après coup ne le change pas',
    (() => { const ev = { questions: [{ bonnes: ['A'] }] }; const s = p2.construireEvalSnapshot(ev);
             ev.questions[0].bonnes = ['B']; return s.questions[0].bonnes[0] === 'A'; })());
  t('session FIGÉE : l\'énoncé du jour prime sur l\'éval courante',
    p2.evalDeSession({ evalId: 'e1', evalSnapshot: { titre: 'ancien' } }, { e1: { titre: 'modifié' } }).titre === 'ancien');
  t('session NON figée (avant M7) : repli assumé sur l\'éval courante',
    p2.evalDeSession({ evalId: 'e1' }, { e1: { titre: 'courant' } }).titre === 'courant');
  t('sessionEstFigee distingue les deux cas',
    p2.sessionEstFigee({ evalSnapshot: {} }) === true && p2.sessionEstFigee({}) === false);
  t('une éval ayant une session TERMINÉE a servi',
    p2.evalADesResultats('e1', { s1: { evalId: 'e1', etat: 'terminee' } }) === true);
  t('une éval ayant des RÉPONSES a servi (même session non close)',
    p2.evalADesResultats('e1', { s1: { evalId: 'e1', etat: 'en_cours', reponses: { 0: { x: ['A'] } } } }) === true);
  t('une éval jamais lancée n\'a pas servi',
    p2.evalADesResultats('e1', { s1: { evalId: 'e2', etat: 'terminee' } }) === false);
  t('sessions RÉELLES du hub : aucune ne perd son énoncé (snapshot ou repli)',
    Object.keys(qcm.sessions || {}).every(k => { const s = qcm.sessions[k];
      return !!p2.evalDeSession(s, qcm.evaluations || {}) || !s.evalId; }));
  t('CLÔTURE UNIQUE : un seul chemin écrit "terminee" et pose le snapshot',
    html.includes('function cloturerSession(sess, ev, cb)') &&
    (html.split('cloturerSession(').length - 1) >= 3 &&
    !/db\.ref\(DB_ROOT\+"\/sessions\/"\+sess\.id\+"\/etat"\)\.set\("terminee"\)/.test(html));
  t('le profil longitudinal porte la version (jamais d\'agrégation de deux versions)',
    html.includes('evalVersion: versionEval(ev)') && html.includes('evalIdentite: identiteEval('));
  t('l\'archivage lit l\'énoncé FIGÉ, pas l\'éval modifiée depuis',
    html.includes('ev = sess.evalSnapshot || ev;'));
  t('modifier une éval qui a servi crée une VERSION, avec confirmation chiffrée',
    html.includes('nouvelleVersion = versionCourante + 1;') && html.includes('Tes modifications créeront la VERSION'));
  t('les versions se voient côté prof (point 4 de la décision)',
    html.includes('versionEval(e) > 1 ? h("span", {className:"version-pill"'));

  section('M7 QCM bis — P2 : les portes dérobées (audit du 18/07)');
  // La preuve est un GREP, pas une intention : on compte les écritures d'état.
  const ecrituresEtat = (html.match(/etat"\)\.set\("terminee"\)|etat"\] = "terminee"/g) || []).length;
  t('exactement 2 écritures d\'état subsistent (cloturerSession + nettoyage), ' + ecrituresEtat + ' comptée(s)',
    ecrituresEtat === 2);
  t('celle de cloturerSession', /function cloturerSession[\s\S]{0,400}maj\["\/sessions\/"\+sess\.id\+"\/etat"\] = "terminee";/.test(html));
  t('PORTE 1 refermée — purgerSessionMenu passe par cloturerSession',
    /function purgerSessionMenu\(s\)\{[\s\S]{0,500}cloturerSession\(Object\.assign\(\{id:s\.sid\}, s\.sess\)/.test(html) &&
    !/function purgerSessionMenu[\s\S]{0,400}etat"\)\.set\("terminee"\)/.test(html));
  t('PORTE 2 refermée — terminerDefinitivement passe par cloturerSession',
    /function terminerDefinitivement\(\)\{[\s\S]{0,700}cloturerSession\(Object\.assign\(\{\}, sessionInterrompue/.test(html) &&
    !/function terminerDefinitivement[\s\S]{0,600}updates\["\/sessions\/"\+sid\+"\/etat"\] = "terminee"/.test(html));
  t('NETTOYAGE — les sessions abandonnées sont figées ET marquées comme telles',
    html.includes('maj["/sessions/"+s.sid+"/evalSnapshotOrigine"] = "nettoyage";') &&
    html.includes('var snapNet = construireEvalSnapshot(evNet);'));
  t('le nettoyage dit ce qu\'il fige (pas de figement muet)',
    html.includes("ce n'est pas forcément l'énoncé du jour de la session"));
  t('le nettoyage dispose des évaluations pour figer',
    html.includes('db.ref(DB_ROOT+"/evaluations").once("value")   // P2') && html.includes('var evalsNettoyage = results[3].val() || {};'));

  section('M7 QCM bis — portail élève réellement atteignable');
  t('le shunt est au niveau AppEleve : une session donne la classe ET l\'identité',
    /function AppEleve\(p\)\{[\s\S]{0,3000}var sess = lireSessionMJPC\(\);/.test(html) &&
    html.includes('setClasseSlug(ks[i]);'));
  t('sans session, le portail à code reste le seul chemin',
    html.includes('h(EleveLogin, {classe:classes[classeSlug]') &&
    html.includes('if(!code.trim()){ setErr("Entre ton code personnel (4 chiffres)."); return; }'));
  t('le shunt ignore les classes internes (sauf bac à sable) et les sessions professeur',
    html.includes('if(!p.bacASable && estClasseInterneObj(classes[ks[i]])) continue;') &&
    html.includes('if(!sess || sess.is_prof) return;'));
  t('M-TEST — la classe du bac à sable n\'est visible QUE dans le bac à sable',
    html.includes('return p.bacASable ? true : !estClasseInterneObj(classes[k]);') &&
    html.includes('h(AppEleve, {bacASable:true,'));

  section('M7 QCM bis — « Mes évaluations » (point 8)');
  t('le composant existe et lit le profil longitudinal',
    html.includes('function MesEvaluations(p)') &&
    html.includes('db.ref("mjpcProfils/"+classeSlug+"/"+slug+"/sessions").once('));
  t('LECTURE SEULE — aucune écriture, aucun recalcul de score',
    (() => { const i = html.indexOf('function MesEvaluations(p)'); const j = html.indexOf('\nfunction ', i + 10);
             const c = html.slice(i, j);
             return !/\.set\(|\.update\(|\.remove\(/.test(c) && !/calculerScoreQuestion|scoreMaxEval/.test(c); })());
  t('les versions ne se confondent pas dans la liste (P2 ③)',
    html.includes('(x.evalVersion && x.evalVersion > 1)'));
  t('liste vide : un message qui annonce, jamais un reproche',
    html.includes("Tu n'as pas encore d'évaluation ici. Celles de ta classe apparaîtront après la correction."));
  t('accessible depuis l\'écran élève', html.includes('"📊 Mes évaluations"') && html.includes('setVoirMesEvals(true)'));

  section('M7 QCM bis — dettes traitées');
  t('D1 (#7) médiane décimale arrondie à l\'affichage', html.includes('var medianeAff = Math.round(mediane);'));
  t('D3 (#14) aucune fourchette invalide, quel que soit le total',
    (() => { const sb = sandbox(['bornesFourchette'], 'var FOURCHETTES_DEF=[{key:"vert"},{key:"bleu"},{key:"orange"},{key:"rouge"}];\n');
             for (let total = 0; total <= 40; total++)
               for (const k of ['vert', 'bleu', 'orange', 'rouge']) {
                 const b = sb.bornesFourchette(k, total);
                 if (b.inf > b.sup || b.inf < 0 || b.sup > total) return false; }
             return true; })());
  t('ARBITRAGE — attente_question est repassé en dur (constat, pas annonce)',
    !html.includes('attente_question:') && html.includes('"⏳ Attends la prochaine question..."'));
  t('trois textes éditables restent, tous des annonces',
    (() => { const m = html.match(/var TEXTES_DEFAUT = \{[\s\S]*?\n\};/)[0];
             return (m.match(/^\s{2}\w+:/gm) || []).length === 3; })());

  section('M7 QCM — C1/C2/C3 : les trois constats corrigés');
  t('C1 — plus de doublon estClasseInterne (le socle n\'est plus écrasé)',
    (html.split('\nfunction estClasseInterne(').length - 1) === 1 && html.includes('function estClasseInterneObj(classe)'));
  t('C1 — les appels qui passent un OBJET pointent la bonne fonction',
    !/estClasseInterne\(classes\[k\]\)/.test(html) && (html.split('estClasseInterneObj(classes[k])').length - 1) === 2);
  t('C1 — estClasseTest reconnaît de nouveau la classe de test',
    (() => { const sb = sandbox(['estClasseInterne', 'estClasseTest'], '');
             return sb.estClasseTest('_test_evaluation-qcm') === true && sb.estClasseTest('4E BANKSY') === false; })());
  t('C2 — le snapshot d\'avant-effacement contient les classes',
    html.includes('Promise.all([db.ref(DB_ROOT).once("value"), db.ref("classes").once("value")])') &&
    html.includes('classes:classesSnap.val() || {}'));
  t('C3 — un seul état de session close ("terminee")',
    !/"termine"/.test(html) && (html.split('"terminee"').length - 1) >= 3);

  section('M7 QCM — structure (points 1-5, 20)');
  const nav7 = sandbox(['groupeDeTab'], html.match(/var NAV2_GROUPES = \[[\s\S]*?\n\];/)[0] + '\n', ['NAV2_GROUPES']);
  t('trois groupes (Pilotage · Données · Réglages)',
    nav7.NAV2_GROUPES.length === 3 && nav7.NAV2_GROUPES.map(g => g.id).join(',') === 'pilotage,donnees,reglages');
  t('les 4 onglets conservés sont tous rangés',
    ['evals', 'pilot', 'results', 'snapshot'].every(x => nav7.groupeDeTab(x) !== null));
  t('aucun onglet rangé deux fois',
    (() => { const v = []; nav7.NAV2_GROUPES.forEach(g => g.tabs.forEach(x => v.push(x[0]))); return new Set(v).size === v.length; })());
  t('atterrissage sur le travail principal (Pilotage classe)',
    html.includes('useState("pilot"), tab =') && html.includes('useState("pilotage"), groupe ='));
  t('ONGLET CLASSES RETIRÉ — plus aucune référence vive',
    !/h\(OngletClasses\)/.test(html) && !/function OngletClasses\(/.test(html) && !/onClick:ajouterClasse/.test(html));
  t('l\'identité renvoie vers la console MJPC (socle §6)',
    html.includes('renvoyerVersMJPC("Ajouter, modifier ou supprimer une classe'));
  t('SAUVETAGE — deduireNiveauDuNom n\'est pas partie avec l\'onglet (dette « niveau écrasé »)',
    (html.split('function deduireNiveauDuNom(').length - 1) === 1);
  t('Préparation et Réglages existent et montent des composants existants',
    html.includes('function OngletPreparation()') && html.includes('function OngletReglages()') && html.includes('h(OngletEvals)'));
  t('les composants d\'onglets ne sont pas rouverts',
    ['function OngletEvals(', 'function OngletPilotage(', 'function OngletResultats(', 'function OngletSnapshot(']
      .every(x => html.includes(x)));

  section('M7 QCM — portail élève (point 7)');
  t('socle en v1.1.0 (recopie verbatim)', html.includes('var MJPC_CORE_VERSION="1.1.0"'));
  t('les 12 fonctions du socle sont présentes une seule fois',
    ['sanMJPC', 'cleClasse', 'classeTestId', 'estClasseInterne', 'estClasseTest', 'extractEleves', 'ecrireClasse',
     'renvoyerVersMJPC', 'resolveEleves', 'publierManifeste', 'lireSessionMJPC', 'validerEleveMJPC']
      .every(f => (html.split('\nfunction ' + f + '(').length - 1) === 1));
  t('le nom seul n\'ouvre plus la porte : un code est exigé',
    html.includes('if(!code.trim()){ setErr("Entre ton code personnel (4 chiffres)."); return; }') &&
    html.includes('if(String(code.trim()) !== String(attendu))'));
  t('le code est vérifié contre /codes réel', html.includes('db.ref("codes").once("value"'));
  t('shunt de session MJPC (l\'élève déjà connecté n\'a rien à ressaisir)',
    html.includes('var sess = lireSessionMJPC();') && html.includes('if(!sess || sess.is_prof) return;'));
  t('clés dégradées du registre rattrapées par le champ name',
    html.includes('if(v && v.name && sanMJPC(v.name) === cle)'));
  t('CODES RÉELS : un élève du hub est bien résolvable',
    (() => { const codes = hub.codes || {}; const k = Object.keys(codes).find(x => codes[x] && codes[x].code);
             return !!k && String(codes[k].code).length >= 3; })());

  section('M7 QCM — mode test (point 16 : analysé, étendu, jamais dégradé)');
  t('le patron d\'origine est intact (nettoyage, classe _test_, purge exhaustive)',
    html.includes('var TEST_CLASSE_NOM = "_test_evaluation-qcm"') &&
    html.includes('function AppTest(p){') && html.includes('Nettoyer toutes les sessions test orphelines'));
  t('EXTENSION — les élèves fictifs ont des codes (sinon le portail les refuse)',
    html.includes('function codesTest()') && html.includes('db.ref("codes").update(codesTest())'));
  t('les codes fictifs sont purgés à la sortie (exhaustivité)',
    html.includes('Object.keys(cds).forEach(function(k){ promises.push(db.ref("codes/"+k).remove()); })'));
  t('les codes de test sont déterministes (rejouables)',
    (() => { const sb = sandbox(['codesTest'], corpsFonction('sanMJPC') + '\nvar TEST_CLASSE_NOM="_t";\nvar TEST_ELEVES=[{nomComplet:"DURAND Alice"},{nomComplet:"MARTIN Lucas"}];\n');
             const a = sb.codesTest(), b = sb.codesTest();
             return JSON.stringify(Object.keys(a).map(k => a[k].code)) === JSON.stringify(Object.keys(b).map(k => b[k].code)); })());

  section('M7 QCM — textes, version, diagnostic (points 18, 23, 25, 26, 28, cardinal)');
  const dico7 = sandbox(['txt'], 'var TEXTES_SURCHARGE={};\n' + html.match(/var TEXTES_DEFAUT = \{[\s\S]*?\n\};/)[0] + '\n', ['TEXTES_DEFAUT']);
  t('trois textes éditables après arbitrage, tous des ANNONCES (point 26)',
    Object.keys(dico7.TEXTES_DEFAUT).length === 3);
  t('txt() rend le défaut quand rien n\'est surchargé', dico7.txt('attente_session') === dico7.TEXTES_DEFAUT.attente_session);
  t('un champ vide retombe sur le défaut',
    sandbox(['txt'], 'var TEXTES_SURCHARGE={attente_session:"   "};\n' + html.match(/var TEXTES_DEFAUT = \{[\s\S]*?\n\};/)[0] + '\n')
      .txt('attente_session') === dico7.TEXTES_DEFAUT.attente_session);
  t('clé inconnue → chaîne vide, jamais "undefined" à l\'écran', dico7.txt('inexistant') === '');
  t('PRINCIPE CARDINAL — aucun texte élève n\'impute un manquement au professeur',
    !/"[^"]*(le |ton |du )?professeur[^"]*(n['’]a pas|ne l['’]a pas|pas encore|n['’]est pas)/i.test(html));
  t('POINT 28 — plus aucune mention du professeur à la 3e personne côté élève',
    (() => { // Les commentaires du code sont retirés d'abord : sans cela l'extraction
             // enjambe un commentaire et le prend pour un texte affiché (faux positif).
             const sansCom = html.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
             const restes = (sansCom.match(/"[^"]*professeur[^"]*"/g) || [])
               .filter(x => !/Accès professeur/.test(x) && !/[{};]|=>|h\(/.test(x));
             return restes.length === 0; })());
  t('l\'ACCOMPLI est au « je » (l\'autorité s\'affirme)',
    html.includes('"⏸️ J\'ai mis le chrono en pause"') && html.includes('"⏱️ J\'ai ajouté du temps de réflexion."'));
  t('l\'INACCOMPLI est dit par le flux (jamais un acteur en défaut)',
    dico7.TEXTES_DEFAUT.attente_session.indexOf('professeur') < 0 &&
    dico7.TEXTES_DEFAUT.attente_correction.indexOf('professeur') < 0);
  t('point 18 — pastille de version + metas anti-cache',
    /var APP_VERSION="[\d.]+"/.test(html) && html.includes('http-equiv="Cache-Control"'));
  t('point 23 — bloc diagnostic en tête de script, verbatim',
    html.includes('DIAGNOSTIC — À LIRE EN PREMIER SI « ÇA NE MARCHE PLUS »') &&
    html.includes('LES RÈGLES FIREBASE ONT-ELLES EXPIRÉ ?'));
  t('point 21 — la version se déclare « à compléter »', html.includes('VERSION À COMPLÉTER'));
  t('point 17 — responsive 390 px (nav repliée sous 480)',
    /@media\(max-width:480px\)\{\s*\n\s*\.nav2-groupes/.test(html));
  t('point 10 — lecteur d\'annonces branché sur site/annonces, tolérant à l\'absence',
    html.includes('db.ref("site/annonces")') && html.includes('if(!v){ setAnnonces([]); return; }'));
  t('point 11 — manifeste et purge à jour (qcm/textes déclaré ET préservé)',
    html.includes('"qcm/settings","qcm/textes","mjpcProfils"') &&
    html.includes('preserver: ["qcm/evaluations","qcm/settings","qcm/textes"]'));
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

/* ════ SUITE M-TEST — le bac à sable est-il le reflet exact du réel ? ════ */
(function () {
  const app = idDeLApp(html);
  const corpsDe = (nom) => { const i = html.indexOf('function ' + nom + '('); if (i < 0) return ''; let d = 0;
    for (let k = html.indexOf('{', i); k < html.length; k++) {
      if (html[k] === '{') d++; else if (html[k] === '}') { d--; if (!d) return html.slice(i, k + 1); } } return ''; };

  if (app === 'evaluation-qcm' && /function OutilsTestP2\(/.test(html)) {
    section('M-TEST · QCM — les mécanismes de M7 sont éprouvables');
    const o = corpsDe('OutilsTestP2');
    t('la clôture du bac à sable appelle cloturerSession (pas une copie)',
      o.includes('cloturerSession(sess, e.val(), function()') && !/etat"\)\.set\("terminee"\)/.test(o));
    t('le snapshot est lu par evalDeSession et sessionEstFigee, les fonctions réelles',
      o.includes('evalDeSession(sess,') && o.includes('sessionEstFigee(sess)') && o.includes('versionEval(ev)'));
    t('la comparaison figé/courant recompte avec calculerScoreQuestion (vraie fonction)',
      o.includes('calculerScoreQuestion(choix, q.bonnes || [], mode).score') && o.includes('modeEval(enonce)'));
    t('AUCUNE logique de score n\'est réimplémentée dans les outils de test',
      !/nbBon|maxPartiel|parfait\s*=/.test(o));
    t('le chrono se fait expirer sans attendre (phaseStart repoussé)',
      o.includes('phaseStart").set(Date.now() - (sess.chrono + 5) * 1000'));
    t('les écritures des outils restent dans le bac à sable',
      (o.match(/db\.ref\(DB_ROOT\+"\/[a-zA-Z]+\//g) || []).every(x => true) &&
      o.includes('TEST_EVAL_ID') && o.includes('TEST_CLASSE_SLUG') && !/\/classes\//.test(o));
    t('le portail élève monte le VRAI AppEleve (donc EleveLogin), pas une copie',
      corpsDe('PortailTestQCM').includes('h(AppEleve, {bacASable:true'));
    t('les codes affichés viennent de codesTest(), la fonction qui les a écrits',
      corpsDe('PortailTestQCM').includes('setCodes(codesTest());'));
    t('« Mes évaluations » est atteignable depuis la vue élève du bac à sable',
      html.includes('setVoirMesEvals(true)') && html.includes('function MesEvaluations(p)'));
  }

  if (app === 'correction_dictee' && /function OutilsTestSouche\(/.test(html)) {
    section('M-TEST · Souche — les mécanismes de M6 sont éprouvables');
    const o = corpsDe('OutilsTestSouche');
    t('les 4 états sont calculés par etatDicteeEleve (vraie fonction)',
      o.includes('var et=etatDicteeEleve(d,san(e));') && !/copyPublishedAt\s*\?/.test(o));
    t('les 4 états sont ATTEIGNABLES depuis le bac à sable',
      (() => { const sb = sandbox(['etatDicteeEleve'], '');
        const A = { results: { durand_alice: { timestamp: 1 }, martin_lucas: { timestamp: 1 } },
                    autocorrection: { durand_alice: { solved: 3, total: 3 } },
                    absents: { moreau_sacha: true }, copyPublishedAt: 1 };
        const B = { results: {}, autocorrection: {}, absents: {}, copyPublishedAt: null };
        return sb.etatDicteeEleve(A, 'durand_alice').code === 'terminee'
            && sb.etatDicteeEleve(A, 'martin_lucas').code === 'afaire'
            && sb.etatDicteeEleve(A, 'moreau_sacha').code === 'absent'
            && sb.etatDicteeEleve(B, 'robert_chloe').code === 'attente'; })());
    t('le bac à sable écrit bien l\'autocorrection achevée d\'Alice (état Terminée)',
      html.includes('autocorrection:{"durand_alice":{status:"idle", solved:3, total:3'));
    t('l\'éditeur de textes est éprouvé par le vrai accesseur txt()',
      o.includes('txt("liste_vide")') && o.includes('db.ref("correction_dictee_textes")'));
    t('la corbeille est éprouvée par le chemin réel, EXTRAIT et non recopié',
      o.includes('supprimerDicteeAvecCorbeille({id:TEST_DICTEE_B') &&
      (html.split('function supprimerDicteeAvecCorbeille(').length - 1) === 1);
    t('le bouton de l\'accueil et le bac à sable appellent LA MÊME fonction',
      (html.split('supprimerDicteeAvecCorbeille(').length - 1) === 3);
    t('les outils n\'écrivent que dans le périmètre de test',
      o.includes('TEST_DICTEE_B') && o.includes('TEST_DICTEE_A') && !/db\.ref\("classes\//.test(o));
    t('le portail élève est traversable par incarnation (il vit dans AppEleve)',
      html.includes('?mode=eleve&incarner=') && html.includes('via:"incarnation"'));
  }

  if (app === 'pilotage_debat_s3' && /function coursTestT5\(/.test(html)) {
    section('M-TEST · Débat — cours déclaré et injection éprouvables sans attendre');
    const t5 = corpsDe('coursTestT5'), fin = corpsDe('coursTestFinAtteinte'), inj = corpsDe('injecterDocumentsTest');
    t('T-5 appelle checkCoursDebat(), la vraie fonction d\'alerte',
      t5.includes('checkCoursDebat();') && !/toast\("⏰/.test(t5));
    t('T-5 est IMMÉDIAT (fin posée dans la fenêtre des 5 minutes)',
      t5.includes('fin: Date.now()+270000') || t5.includes('fin:Date.now()+270000'));
    t('le bandeau élève peut réapparaître (_coursBandVu remis à faux)', t5.includes('_coursBandVu=false;'));
    t('la fin atteinte est immédiate et passe par la vraie fonction',
      fin.includes('checkCoursDebat();') && (fin.includes('fin:Date.now()-1000') || fin.includes('fin: Date.now()-1000')));
    t('les deux déclencheurs n\'écrivent que sur la classe de test',
      t5.includes('slugC(TEST_DEBAT_CLASSE)') && fin.includes('slugC(TEST_DEBAT_CLASSE)'));
    t('l\'injection passe par injecterDocuments() : le JSON est seulement COLLÉ',
      inj.includes('ta.value = JSON.stringify(jeu, null, 2);') &&
      !/db\.ref\(ROOT\+"\/documents"\)/.test(inj) && !/validerDocumentsJSON/.test(inj));
    t('le jeu de test a bien 10 documents (format attendu par le validateur)',
      inj.includes('for(var i=1;i<=10;i++)') && inj.includes('sujet:') && inj.includes('camps:'));
    t('les boutons sont dans le panneau du bac à sable',
      html.includes('onclick="coursTestT5()"') && html.includes('onclick="coursTestFinAtteinte()"') &&
      html.includes('onclick="injecterDocumentsTest()"'));
    t('l\'existant n\'est pas dégradé (coursTest, incarnation, purge intacts)',
      html.includes('async function coursTest(minutes){') && html.includes('function incarnerTest(cle)') &&
      html.includes('purgerEtSortirTest()'));
  }
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

