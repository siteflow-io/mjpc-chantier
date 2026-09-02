/* BANC-TOUT — TOUS LES BANCS DU LOT, D'UNE SEULE COMMANDE.
   Décidé par Paul le 01/09. Il n'invente aucun test : il rejoue ceux qui existent,
   dans l'ordre des livraisons, et vérifie que chacun rend encore les chiffres que
   son rapport a publiés. Une ligne par banc. Sortie ≠ 0 si un seul échoue.
   Usage : node tests/banc-tout.mjs [index.html] */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const FICHIER = process.argv[2] || 'index.html';
/* une tranche, pour les machines qui n'aiment pas les longues courses :
   `node tests/banc-tout.mjs index.html 0 5` joue les cinq premiers. Sans
   tranche, il les joue tous. Le compte-rendu et le code de sortie sont les
   mêmes : une ligne par banc, sortie ≠ 0 si un seul échoue. */
const DE = Number(process.argv[3] || 0), A = Number(process.argv[4] || 999);

/* Pour chaque banc : ce que son rapport a publié, et qu'il doit rendre encore.
   Rien d'inventé ici — ces chaînes SONT les chiffres des rapports. */
const BANCS = [
  ['banc-mise-a-niveau-01bis-a.mjs', '①bis-a · la mise à niveau au chargement',
    ['archive → ecriture', /écritures hub : 0[\s\S]*écritures hub : 0/, 'id au hub     : 122']],
  ['banc-periodes-01bis-b.mjs', '①bis-b · l\'identité des périodes',
    ['conservés depuis le hub : 3 / 3', 'A · RÉINJECTION', 'PÉRIODE AJOUTÉE']],
  ['banc-grille-datee-01ter.mjs', '①ter · la grille datée',
    ["pose alors : 6", '30 identifiants distincts', 'crn:1a22nwk']],
  ['banc-coche-02a.mjs', '②a · la coche sort de l\'objet',
    ['décisions posées : 2', 'heures justifiées : 0 → 2', 'heures justifiées : 2 → 2']],
  ['banc-migration-02b.mjs', '②b · la migration des coches héritées',
    ['heures justifiées : 10', 'écritures (hors archives) : [] · archives : 0', 'RÉINJECTER LE CALENDRIER']],
  ['banc-coches-bougent-02.mjs', '② · ce que devient une coche quand les choses bougent',
    ['tu avais coché 2 heures sur les dates précédentes', 'case à l\'écran : false',
      'ne contient plus 1 événement que tu avais coché']],
  ['banc-appariement-03a.mjs', '③a · l\'appariement branché',
    ['identifiants conservés : 15/15', "identifiants ayant changé d'horaire (permutations) : 0",
      '"candidats":4']],
  ['banc-differentiel-03b.mjs', '③b · le différentiel et la classe renommée',
    ['Ce qui disparaît EN EMPORTANT DES COCHES', 'après REFUS', '"sousNouveau":2']],
  ['banc-archivage-03.mjs', '③ · l\'archivage avant écrasement (par clics)',
    ['archives : 1 · écritures : 1', 'Impossible de mettre l’état d’avant à l’abri',
      '"archive":["P1"],"auHub":["P1","P2"]']],
  ['banc-classe-essai-03bis.mjs', '③bis-a · la classe d\'essai en mode test',
    ['classes aux comptes identiques : 7/7', 'créneaux lus par edtCasesA : 34 · dont fictifs : 4',
      "identique à l'état de départ : true"]],
  ['banc-id-famille-03bis.mjs', '③bis-b · l\'identifiant dit sa famille',
    ['"id":"per:MENSONGE"', '"evc":"15/15"', '"prefixesCorrects":true']],
  ['banc-prompt-04a.mjs', '④a · un seul collage',
    ['IDENTIQUE BIT À BIT : true', 'aucun calendrier en service', 'zoneOuverte":true']],
  ['banc-bout-en-bout-04.mjs', '④ · l\'épreuve de bout en bout',
    ['122 forts · 1 arrivant(s) · 0 faible(s)', '120 forts · 1 arrivant(s) · 2 faible(s)',
      '"identiques":true']],
  ['banc-heures-perdues-05a.mjs', '⑤a · l\'écran Heures perdues',
    ['fiches affichées : 6', '"cases":10,"cochees":0', 'cette année, 1 heure perdue, dont 1 déclarée justifiée']],
  ['banc-motifs-05b.mjs', '⑤b · une heure ne compte jamais deux fois',
    ['La banaliser remplacera ce motif', 'écritures avant la réponse : []',
      'retour arrière — événement du calendrier']],
  ['banc-banalisation-05c.mjs', '⑤c · banaliser, classer, basculer, déplacer',
    ['temps de classe              · compte 0 · Évaluation hors séance',
      '"apresRechargement":{"categorie":"Temps libre choisi","justifiee":true',
      '"natureDepart":"deplacee"']],
  ['banc-archive-decisions-05cbis.mjs', '⑤c-bis · l\'archive des décisions',
    ["heures DANS L'ARCHIVE : 1", 'avant : ["ecartJustifie"']],
  ['banc-archives-objets-05cter.mjs', '⑤c-ter · les archives des autres objets',
    ['"dansLArchive":"A"', '"dansLArchive":1', '"dansLArchive":"Trimestre 1"']],
  ['audit-adverse-02.mjs', 'audit adverse ② · les coches',
    ['Aucune heure de cours sur ces dates', '"clesSousAncienNom":1']],
  ['audit-adverse-03.mjs', 'audit adverse ③ · l\'appariement',
    ['"idsDistincts":15,"total":15', '"memeId":false']],
  ['audit-adverse-03bis.mjs', 'audit adverse ③bis · la classe d\'essai',
    ['"distincts":5,"total":5', '"fictifsLus":4']],
  ['banc-trois-issues-06a.mjs', '⑥a · les trois issues au dépôt',
    ['sorties proposées : ["Ne rien faire","Échanger les deux heures","Prendre le créneau"]',
     'identique : true', '"aReplacer":true']],
  ['banc-a-replacer-06b.mjs', '⑥b · l\'heure à replacer et la perte sèche',
    ['au bandeau : "1 heure à replacer"', 'identiques : true', '"motif":"priseAutreClasse"']],
  ['banc-destinations-06c.mjs', '⑥c · la liste élargie et le replacement réel',
    ['— pris par 4E BANKSY', 'TOTAL HEURES PERDUES 4E BANKSY : 1 → 0', 'télescopages après la pose : []', 'mettrait deux classes au même moment']],
  ['banc-dates-06.mjs', "⑥ · les dates de l'année",
    ['plus de treize mois', 'un mois de marge', '"heuresAuDela":2']],
  ['banc-annee-07b.mjs', "⑦b · la vue Année dans le site",
    ['"bandeaux":104,"etab":59,"classe":15,"jalon":30', '"defileHorizontal":true,"libelleEntier":true',
     "écritures depuis l'ouverture de la vue : []"]],
  ['banc-pastille-audit-07.mjs', "⑦ · la pastille d'événement et l'audit adverse",
    ['après UNE heure cochée sur 2 : {"texte":"Séjour Verdun 3e ✓","allumee":true}',
     '"allumee":false', '"bandeaux":10,"colonnes":12']],
  ['banc-alerte-05.mjs', '⑤ · l\'alerte mensuelle',
    ['alerte : "(aucune ligne)"', 'injecté il y a un mois', '"rappelLe":"']],
  ['verif122.mjs', 'le calendrier réel · 122 identifiants',
    ['poses: 122', "evc: 15, jal: 30, eta: 59, fer: 11, vac: 7", 'collisions: 0']]
];

/* un banc à la fois, avec sa limite de temps ; et on ne laisse jamais un
   navigateur derrière soi : deux chromium ouverts, et la machine ploie. */
const jouer = (fichier) => new Promise(res => {
  const t0 = Date.now();
  const p = spawn('node', [fichier, FICHIER], { cwd: process.cwd() });
  let sortie = '', fini = false;
  const minuteur = setTimeout(() => { if (!fini) { sortie += '\n(temps dépassé)'; p.kill('SIGKILL'); } }, 210000);
  p.stdout.on('data', d => { sortie += d; });
  p.stderr.on('data', d => { sortie += d; });
  p.on('close', code => { fini = true; clearTimeout(minuteur);
    const menage = spawn('pkill', ['-f', '/tmp/chromium']);
    menage.on('close', () => setTimeout(() => res({ code, sortie, ms: Date.now() - t0 }), 1200));
    menage.on('error', () => res({ code, sortie, ms: Date.now() - t0 })); });
});

const absents = BANCS.filter(b => !fs.existsSync(path.resolve(b[0]))).map(b => b[0]);
if (absents.length) { console.log('BANCS INTROUVABLES : ' + absents.join(', ')); process.exit(1); }

const LOT = BANCS.slice(DE, A);
console.log('BANC-TOUT — ' + LOT.length + ' banc(s) sur ' + BANCS.length + ', fichier ' + FICHIER
  + (LOT.length === BANCS.length ? '' : ' — tranche ' + DE + '\u2192' + Math.min(A, BANCS.length)) + '\n');
let rates = 0;
for (const [fichier, titre, attendus] of LOT) {
  const r = await jouer(fichier);
  const manquants = attendus.filter(a =>
    (a instanceof RegExp) ? !a.test(r.sortie) : r.sortie.indexOf(a) < 0);
  const casse = /Error|ReferenceError|⚠ erreur de page/.test(r.sortie) || r.code !== 0;
  const bon = !manquants.length && !casse;
  if (!bon) rates++;
  console.log((bon ? '  ✔ ' : '  ✘ ') + titre.padEnd(52)
    + ' · ' + String(Math.round(r.ms / 1000)).padStart(3) + ' s'
    + ' · ' + (attendus.length - manquants.length) + '/' + attendus.length + ' repères'
    + (casse ? ' · SORTIE EN ERREUR' : '')
    + (manquants.length ? ('\n      manque : ' + manquants.map(String).join(' | ').slice(0, 200)) : ''));
}
console.log('\n' + (rates ? ('ÉCHEC — ' + rates + ' banc(s) sur ' + LOT.length)
  : ('TOUT PASSE — ' + LOT.length + ' banc(s), ' + LOT.reduce((n, b) => n + b[2].length, 0) + ' repères vérifiés')));
process.exit(rates ? 1 : 0);
