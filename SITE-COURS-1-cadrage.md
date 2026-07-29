# SITE-COURS-1 — CADRAGE · la feuille et son aperçu
> Exécutant SITE-COURS-1, 29/07/2026. Livré au sas AVANT tout code. J'attends le feu vert complet de la conscience.

---

## 1 · CE QUE J'AI LU (md5 mesurés dans mon conteneur)

**Les cinq documents, intégralement, dans l'ordre imposé :**

| Document | Taille | md5 |
|---|---|---|
| `docs/MJPC6-doctrine-du-site.md` | 58 102 o | `36c59ed6b17e2059e17e890622754a89` |
| `docs/MJPC6-1-DISPOSITIF.md` | 116 517 o | `5d429e55f2b72b3b46d80fdf3d77d30d` |
| `docs/MJPC6-2-DOCTRINE.md` | 71 039 o | `a34f6f58fab1452663684426a633b783` |
| `docs/MJPC6-3-CHANTIER.md` | 119 668 o | `da26e96dd08cb6a33bf4eaa3784162c8` |
| `docs/MJPC6-journal.md` | 82 071 o | `0a738f53471f1dc0357a3cf33d56a666` |

Toutes les lectures GitHub sont passées par le jeton avec vérification TAILLE + md5 (aucun raw.githubusercontent). Le journal a été lu jusqu'aux entrées du 27/07 incluses (écrasement bb4e, LOT-COUTURES, micros 8.5.1/8.5.2, M14).

**Les patrons de code, lus sur les fichiers de production téléchargés et vérifiés :**

| Fichier | Taille | md5 | Ce que j'y ai lu |
|---|---|---|---|
| `index.html` (MA BASE) | 395 148 o | `dcbc4afe4d31a0b56bbd11c80cb045fb` | architecture complète (détail §2) |
| `worktrack.html` | 1 017 371 o | `e37a0f8ad9f259f23020184d954a5bce` | `EVAL_TYPES`/`CONSIGNE_TYPES` (schéma déclaratif), `setMeta` L7725 |
| `correction_dictee.html` | 541 588 o | `2d0d39417bcb5f7126bb24e0ba0425aa` | `previewIdx`/`previewOpen` L4902-5199, cases L2020-2023 et L5129, `buildCopieHtml` L4606, `generateBilan` |
| `pilotage_debat_s3.html` | 452 006 o | `405d11bb461d804a93ba383262fab659` | `bilansPrintHTML` L4202 (demi-A4 148 mm, pointillés, `page-break`, aperçu iframe `srcdoc` → `print()`), atelier d'impression L4287 |
| `dictee_universelle.html` | 1 957 540 o | `6342dd533fe20c9107af27fe824a7aa2` | téléchargée pour référence (voir constat §7-c) |

**Les deux générateurs d'impression exigés** : `buildCopieHtml` (correction — fichier HTML autonome, options plates → classes CSS du body) et `bilansPrintHTML` (débat — demi-A4, `height:148mm`, `.demi:nth-of-type(2n){page-break-after:always}`, `border-bottom:1px dashed`, iframe srcdoc puis `contentWindow.print()`). Le second patron est décisif : **l'aperçu et l'impression sont le même document** (même `srcdoc`), donc l'aperçu ne peut pas différer du résultat imprimé — c'est la propriété que le §XIII.1bis exige, obtenue par construction.

---

## 2 · MA BASE, VÉRIFIÉE, ET CE QUE JE VAIS TOUCHER

**État de production** : `index.html` = 395 148 o, md5 `dcbc4afe4d31a0b56bbd11c80cb045fb` = **exactement la v8.5.2** du registre (commit `7c8d0a9aab` du 27/07 14:08 UTC). Historique du fichier paginé jusqu'à épuisement : **94 commits**, `7c8d0a9aab` est le dernier. Je re-téléchargerai la base depuis la production immédiatement avant l'édition et je déclarerai son md5 au rapport (règle gravée du 27/07).

**Parseurs de référence sur la base** : 1 seul bloc `<script>` (291 501 caractères), 4 blocs `<style>` ; `node --check` OK, acorn ES2020 OK. Aucun `</style>`/`</script>` dans des chaînes JS **dans la base actuelle** — mon générateur d'impression en introduira (chaînes de documents imprimables) : toute insertion CSS visera le `<head>` par ancre nommée, jamais « le dernier `</style>` », et je déclarerai au rapport le nouveau compte de blocs.

**Ce que le fichier porte et que je réutilise (vérifié sur pièces)** :
- `_siteGet/_sitePut/_siteDelete` (L1038-1056) : les 3 accès REST, **seuls chemins couverts par le magasin de mode test** `M8_TEST_STORE` (les `fetch(FIREBASE_BASE…)` directs ne le sont pas).
- Le Panneau prof à sections (`showProfSection`, boutons L844-858) — c'est là que l'atelier se loge (Q2).
- La corbeille : `_corbeillePut(motif, extract, meta)` → `corbeille/<jour>/<clé>` au format `{_meta:{motif,date,ts,annee,source,…meta}, data}` ; `_corbeillePuis` (archive AVANT destruction, abandon si l'archive échoue). Le champ `_meta.chemin` se passe par `meta` (patron LOT-COUTURES).
- Le LIER : `applyLinkChanges(source, ref, kind)` L2742 écrit `source`/`ref`/`kind` sur l'item — **je n'y touche pas** (morceau ②), mais le schéma prévoit qu'un document composé soit référençable par un futur `source:'atelier'`.
- `APP_VERSION="8.5.2"` L2007, pastille par `proto-badge` ; manifeste L2023-2031 : `noeuds:["site","site/annonces","site/config","eleves_index","codes"]`, `preserver:["site","site/annonces","site/config"]`.
- `PROF_CODES`, session `TRACK.eleve`/`is_prof`, `extractEleves`, `sanMJPC`, `classesData` (chargé côté prof).

**Ce que je vais toucher** : une SECTION DÉDIÉE nouvelle (CSS en section nommée, JS en bloc nommé « ATELIER DE COMPOSITION »), le tableau des boutons du Panneau prof (une entrée), le manifeste (déclaration du nouveau nœud, préservation), la pastille de version, le bac à sable M8 (guidage atelier). **Aucune fonction existante n'est réécrite** ; les invariants (`isPubFor`, `_markPub`, `_visiblePourSession`, `renderChapitres`, `openViewer`, socle, corbeille) seront prouvés identiques à l'octet au rapport.

---

## 3 · LE SCHÉMA DÉCLARATIF DES COMPOSANTES — la forme proposée

Patron : `EVAL_TYPES` de worktrack (« pour ajouter un type ou un champ, je touche un seul endroit »), étendu de ce que la doctrine exige (famille, nature, dépendances, place, réservation). **Une entrée par composante ; l'éditeur, le rendu écran et le rendu imprimé en découlent tous trois.**

```js
/* ══ ATELIER · SCHÉMA DES COMPOSANTES (source unique — version ATELIER_VERSION) ══ */
var ATELIER_VERSION = '1.0.0';   // version PROPRE du composant, publiée au manifeste (§XIII.1ter)

var ATELIER_COMPOSANTES = {
  'nom_eleve': {
    libelle: "Afficher le nom de l'élève",   // la phrase française de la case — jamais de jargon
    famille: 'A',                            // A…K + 'N' (strate de niveau, réservée)
    nature:  'donnee',                       // 'donnee' | 'structure' | 'rendu' (cf. §XIII.5 remarques)
    zone:    'entete',                       // place dans la feuille : entete|ancrage|contenu|travail|liens|pied
    exige:   'eleve',                        // rattachement requis (→ grisage conseillé si absent)
    depend:  [],                             // ids d'autres cases (→ grisage conseillé, JAMAIS verrouillant)
    defaut:  false,                          // état hors produit
    multiple: false,                         // true = bloc instanciable plusieurs fois (familles D/E, cf. Q1)
    champs:  [],                             // pour nature 'structure' : [{k,l,kind:'text'|'area'|'list'|'date'}]
    reforme: false,                          // true = porte un champ de reformulation (famille H, second texte)
    rendre:  function(doc, inst, ctx){ … },  // rendu HTML nommé et linéaire (écran ET impression : même fonction)
  },
  'place_famille_F': { libelle:"…", famille:'F', reserve:true },   // place réservée : déclarée, visible grisée,
  …                                                               // avec sa mention française — jamais un trou
};

var ATELIER_PRODUITS = {          // les pistons de combinaison — SEUL 'fiche_seance' livré ici
  fiche_seance: { libelle:'Fiche de séance', cases:{ …lot pré-coché… } }
};
```

**Propriétés garanties par cette forme :**
- **Les trois natures sont distinguées** dans le schéma ET dans l'interface (trois groupes visuels aux intitulés en français, cf. Q4) — quarante cases ne feront pas quarante choses différentes sans le dire.
- **Le grisage conseille, ne verrouille jamais** : `depend`/`exige` non satisfaits ⇒ case grisée MAIS cliquable ; le clic l'active avec un avertissement invitant à regarder l'aperçu, « parce qu'en réalité c'est lui qui fait foi » (décision de Paul du 27/07). Aucun chemin de code ne refuse un cochage.
- **Les places réservées** (`reserve:true`) : familles **F**, **G**, **K** ET la **strate de niveau** du spiralaire (morceau ④) sont déclarées au schéma et visibles grisées avec une mention en français — le morceau ④ n'imposera pas de refonte.
- **L'agrégation à la date** (famille K, non codée) est rendue possible : le document porte `dateEdition` dans ses métadonnées dès maintenant — la règle du §XIII.6 est structurellement prête.
- **La date d'édition est un INVARIANT d'impression, pas une case** : tout rendu imprimé la porte, toujours, visible (§XIII.6 : « obligatoire et visible sur tout document imprimé »). Elle reste affichée à l'écran par défaut ; seule sa présence à l'IMPRESSION est non négociable.
- **Le composant n'écrit jamais** : `rendre()` est pur (données → HTML). Les écritures appartiennent à l'app hôte (`index.html`), qui passe exclusivement par `_siteGet/_sitePut/_siteDelete`. `ATELIER_VERSION` est publiée au manifeste à côté de la version du socle.
- **Fonctions de rendu NOMMÉES et linéaires**, jamais de ternaires imbriqués ; CSS de l'atelier en section nommée.
- **Tokenisation** : aucun découpage de texte en mots n'est nécessaire dans ce morceau ; si un besoin surgissait, j'emprunterais la fonction de l'app concernée, je ne réimplémenterais rien.

---

## 4 · LES COMPOSANTES — la liste intégrale, codées et réservées

J'ai lu la liste exhaustive du §XIII.5 intégralement. **Codées dans ce morceau : les huit familles A, B, C, D, E, H, I, J, en totalité** (c'est ce que le prompt commande). **Réservées : F, G, K et la strate de niveau.**

**A · Identification (codées, 15)** : Titre · Sous-titre · Élève [donnee, exige:eleve] · Classe [donnee, exige:classe] · Niveau [donnee] · Groupe ou binôme · Chapitre · Numéro et titre de séance · Date de la séance · **Date d'édition** [invariant d'impression, voir §3] · Année scolaire · Période · Marque MJPC · Code personnel [donnee, exige:eleve] · Version du document.

**B · Ancrage pédagogique (codées, 11)** : Objectif de séance (« à la fin de cette séance, tu sauras… ») · Compétences travaillées · Notions visées [saisie libre dans ce morceau ; le rattachement aux 154 notions de `/taxonomie` viendra avec la Concordance — champ prévu, pas de sélecteur taxonomique ici, cf. Q6] · Domaine du socle · Attendu de fin de cycle · Prérequis · Ce qui sera évalué · Critères de réussite · Durée prévue · Place dans la progression annuelle · Parcours concerné.

**C · Contexte culturel (codées, 10)** : Œuvre étudiée · Auteur · Siècle et courant · Corpus · Genre · Histoire des arts · Prolongements · Lexique de la séance · Étymologie · Repère chronologique.

**D · Contenu (codées, 20 — blocs `multiple:true`, cf. Q1)** : Texte libre · Liste à puces · Liste numérotée · Définition · À retenir · Attention/piège fréquent · Méthode (les étapes) · Exemple · Contre-exemple · Citation avec référence · Extrait long avec numérotation des lignes · Tableau · Colonnes comparatives · Frise · Schéma [zone à dessiner à la main sur papier : cadre + légende — pas d'éditeur graphique] · Image (Drive) [PLACE POSÉE : le champ accepte une URL existante, l'upload/redimensionnement est le morceau ③, signalé] · Diapositive convertie (JSON) [PLACE POSÉE : type déclaré au schéma, l'injection est le morceau ③, signalé] · Consigne [reforme:true] · Question [reforme:true] · Note de bas de page.

**E · Travail de l'élève (codées, 17)** : Zone lignée · Zone quadrillée · Zone vierge · Cases à cocher · Texte à trous [statique imprimé : le texte avec ses blancs — pas le moteur interactif de worktrack] · Appariement [idem, statique] · Tableau à compléter · Brouillon · Consigne de transformation [reforme:true] · Sujet de rédaction [reforme:true] · Nombre de mots attendu · Matériel nécessaire · Modalité (seul, binôme, groupe, oral) · Barème · Note [donnee, exige:eleve — saisie manuelle ici ; l'agrégation automatique est famille K] · Points bonus · Temps passé [réservé de fait : donnée d'app, famille K le servira — champ manuel en attendant] · Trace du travail dans l'app [même statut].

**H · Différenciation et accessibilité (codées, 24)** — la valeur propre de la famille est respectée : chaque composante `reforme:true` porte **un champ de reformulation À CÔTÉ du champ principal** (un second texte à écrire, pas un réglage typographique), et la case de famille H décide laquelle sort — la même fiche en deux versions d'un seul geste.
Sur la consigne : Reformulation en langage simple [la bascule maîtresse des champs `reforme`] · Explicitation du but réel · Une seule consigne par ligne · Verbe d'action isolé et surligné · Mots-clés mis en évidence · Lexique difficile explicité en marge · Suppression de la double tâche. — Sur la tâche : Séquençage en étapes numérotées · Point de vérification intermédiaire · Exemple traité en entier (modelage) · Amorce de réponse · Réduction du nombre d'items sans réduction de l'exigence · Support de rappel sous les yeux · Aide graduée en trois coups de pouce · Temps majoré signalé. — Sur l'auto-évaluation : Critères reformulés à la première personne · Case « j'ai compris la consigne » · Ce que je fais si je bloque. — Sur la forme [nature:'rendu'] : Police adaptée (dyslexie) · Interligne augmenté · Colonne étroite · Contraste renforcé · Sans italique · Syllabation colorée [rendu CSS lettre à lettre sur les blocs de contenu — si le coût explose, je le déclare et le soumets plutôt que de livrer un à-peu-près] · Numérotation des lignes du texte.

**I · Liens et suites (codées, 7)** : Renvoi vers l'application · Renvoi vers la remédiation par notion [lien simple ; L'Atelier n'existant pas encore, le libellé reste éditable] · Séance suivante · Travail à faire · Échéance · QR code [généré localement en SVG, sans bibliothèque externe ni CDN — si le coût est déraisonnable je le déclare] · Lien de consultation en ligne.

**J · Mise en page (codées, 11)** : A4 · demi-A4 · deux par page · Marges · Pointillés de découpe · Saut de page · Numérotation · Pied de page · Orientation · Mention « à conserver » · Écran seul / impression seule [nature:'rendu']. La signature parent n'existe pas (retirée par Paul).

**Réservées, déclarées au schéma, visibles grisées avec mention** : **F** (résultats et retour — dépend des données d'apps) · **G** (absence et rattrapage — chantier X) · **K** (agrégatives — dépendent de M15 et de la Concordance) · **strate de niveau** (spiralaire — morceau ④). Ces mentions sont des textes PROF (l'atelier est un écran professeur) : je les propose en dur, sauf avis contraire.

Soit environ **115 composantes codées** et 4 réservations. C'est volumineux, mais le schéma déclaratif est précisément ce qui le rend tenable : la plupart sont un libellé + une zone + un rendu de quelques lignes.

---

## 5 · LE NŒUD DE PERSISTANCE — emplacement choisi, MESURE À L'APPUI

**La mesure (faite sur le code de la base ET sur le hub, 29/07)** :
- Le seul GET déclenché par un élève qui ouvre un niveau est `loadPublished(level)` (L2073) : `fetch(FIREBASE_BASE+'/site/'+level+'.json')` — **le nœud `/site/<niveau>` ENTIER**. Poids mesurés au hub : `/site/3e` = **10 950 o**, `/site/4e` = 512 o, `/site/5e` = 419 o, `/site/6e` = 126 o ; `/site` entier = 12 320 o.
- Les autres lectures élève : `/eleves_index/<slug>` (L3165), `/classes.json` + `/codes.json` (L4770-4772, à la connexion), `/intent/...` (écritures de tracking). `published_tabs`/`published_extras` vivent DANS `/site/<niveau>` et arrivent avec lui.
- Les lectures larges (`_fbReadAll` → racine entière, L3668 ; `_siteGet('/')` L4584 ; `/corbeille` L4509) sont **exclusivement admin** (diagnostic, snapshot, purge, corbeille, restauration).

**Conclusion et choix** : le nœud des documents composés sera **`site/atelier`** (documents sous `site/atelier/documents/<id>`). Justification :
1. **Jamais téléchargé par un élève** : aucun chemin élève ne lit `/site.json` entier, et `level` ∈ {3e,4e,5e,6e} — `/site/atelier` n'est atteint par aucun `loadPublished`. La contrainte dure est satisfaite par construction, et je le re-prouverai au rapport en journalisant les requêtes d'un parcours élève complet.
2. **Nommage français** (décision de Paul) : « atelier », « documents ».
3. **Préservation** : `preserver:["site"]` couvre déjà la branche ; je nomme EN PLUS `site/atelier` explicitement dans `noeuds` et `preserver` du manifeste (la leçon M8 : nommer lève l'ambiguïté du préfixe). Un document composé est de la CONCEPTION : il se préserve, il ne se purge pas.
4. **Mode test couvert par construction** : toutes les écritures/lectures de l'atelier passent par `_siteGet/_sitePut/_siteDelete`, les seuls chemins routés vers `M8_TEST_STORE` — en mode test, RIEN ne part au hub, avec les vrais composants et les vrais chemins (16bis).

**Forme d'un document (nommage français)** :
```
site/atelier/documents/<id>: {
  titre, produit,                    // 'fiche_seance' pour ce morceau
  cases: { <idComposante>: true|false, … },
  contenu: [ {type, valeurs:{…}, reformulations:{…}}, … ],   // blocs ordonnés (familles D/E)
  rattachement: { niveau, classe, eleve },                    // vides si document générique
  dates: { creeLe, modifieLe, dateEdition },
  versionAtelier: ATELIER_VERSION
}
```
Estimation de poids : une fiche de séance riche ≈ 3-8 Ko ; même cinquante documents (~300 Ko) ne pèsent sur AUCUN chargement élève.

**Gestes de base, les quatre** : créer · modifier (édition en direct, patron `setMeta` : l'écran suit immédiatement, la persistance suit avec un léger débounce) · **dupliquer** · supprimer — la suppression passe par `_corbeillePuis` (dénombrement affiché, archive `{_meta:{chemin:'site/atelier/documents/<id>', app:'index', ts}, data}` AVANT destruction, abandon si l'archive échoue). Jamais de suppression sèche.

---

## 6 · L'APERÇU, L'IMPRESSION, LE MODE TEST

**Aperçu (§XIII.1bis, composante de premier rang)** : je CLONE le mécanisme de `correction_dictee` (`previewOpen`/`previewIdx`, flèches ← →, compteur « n / N ») et le patron d'affichage du débat (iframe `srcdoc`). Le générateur produit un document HTML autonome complet (patron `buildCopieHtml`) ; **l'aperçu affiche ce document même, et l'impression imprime cette iframe même** (`contentWindow.print()`) — écran, aperçu et papier ne peuvent pas diverger. Les cases et les champs agissent sur l'aperçu EN DIRECT (re-rendu du `srcdoc` à chaque changement). Quand le document est rattaché à une classe, l'aperçu est **navigable élève par élève** (roster par `extractEleves` sur `classesData`, tri alphabétique — patron `previewIdx` exactement).

**Impression** : `@media print` propre dans le document généré — A4 et demi-A4 (patron 148 mm du débat), marges, pointillés de découpe, sauts de page, pied de page, mention « à conserver », **date d'édition toujours visible**. Repli « ouvrir dans un onglet » comme au débat si l'impression d'iframe échoue.

**Mode test (16bis)** : le bac à sable du site couvre l'atelier PAR CONSTRUCTION (routage `_site*` → `M8_TEST_STORE`). J'ajoute au guidage du mode test une ligne dédiée (« compose une fiche, coche, imprime, recharge : rien ne part au hub ») et je livre le parcours éprouvable en un clic depuis le bandeau existant. Élèves fictifs : les six canoniques (BERNARD Emma, DUPONT Marie, LEROY Hugo, MARTIN Lucas, MOREAU Léa, PETIT Thomas) — pour l'aperçu navigable de test, ils sont fournis en mémoire à l'aperçu, jamais écrits dans `/classes`. Toute purge vérifie ses erreurs et ne se déclare terminée que si tout a réussi.

**Mobile 390 px, écran professeur compris** : l'atelier est un écran prof — cibles ≥ 44 px en hauteur ET largeur (y compris les `[onclick]` sur `div`/`span`), colonnes empilées sous le seuil (éditeur puis aperçu), desktop en côte à côte non dégradé. Mesures au rapport, pas des impressions. ⓘ sur toute case ou bouton dont le sens n'est pas évident.

**Parcours complet qui sera joué au rapport** : composer → cocher → décocher → cocher une case grisée (avertissement, activation quand même) → éditer un champ → voir l'aperçu suivre → naviguer élève par élève → imprimer → recharger la page → retrouver son document → dupliquer → supprimer (corbeille) → restaurer. Plus le parcours ÉLÈVE témoin avec journal des requêtes prouvant que `site/atelier` n'est jamais téléchargé.

---

## 7 · CONSTATS SOURCÉS (aucun n'est écarté)

**a) ANOMALIE OUVERTE, PROUVÉE — le texte « séance sans document » (M12-R1) n'est jamais persisté.** `_siteGet('textes/seanceSansDoc', …)` (L1021) et `_sitePut('textes/seanceSansDoc', …)` (L1032) passent un chemin **sans slash initial**, or `_siteGet/_sitePut` concatènent `FIREBASE_BASE + chemin + '.json'` (L1038-1056) et `FIREBASE_BASE` n'a **pas de slash final** (L1795) → URL à hôte invalide (`…firebasedatabase.apptextes/…`), le `catch` renvoie `null` en silence, le seed reste. **Preuve côté données** (hub, 29/07) : `/site/textes` = `null` ET `/textes` = `null`. Tous les autres appels `_siteGet/_sitePut` du fichier passent un chemin commençant par `/`. Ce n'est PAS mon environnement : c'est mesuré sur la production et sur le hub. Hors de mon périmètre — la conscience arbitre (couture micro d'une ligne probable : `'/site/textes/seanceSansDoc'` aux deux appels, cohérent avec le commentaire du code qui annonce `site/textes/seanceSansDoc`).

**b) Constat d'architecture** : le magasin de mode test ne couvre que `_siteGet/_sitePut/_siteDelete` — les `fetch(FIREBASE_BASE…)` directs (publication, chapitres, images) n'y passent pas. Sans conséquence pour moi (je m'y conforme, cf. §5-4) ; consigné pour mémoire du chantier.

**c) Constat hors périmètre** : `dictee_universelle.html` en production porte le md5 `6342dd533fe20c9107af27fe824a7aa2`, différent du dernier état journalisé (`f8362a876ceefe1dc1e6d7f668f00848`, rattrapage du 27/07). Des promotions postérieures au journal ont pu avoir lieu (nous sommes le 29/07) ; je ne conclus rien, je signale l'écart pour vérification par la conscience contre l'historique des commits de ce fichier.

---

## 8 · LES QUESTIONS QUE JE POSE (feu vert attendu sur chacune)

**Q1 — Les blocs de contenu (familles D et E) : cases ou palette ?** La feuille réelle porte PLUSIEURS blocs de contenu, dans un ordre choisi (deux définitions, un exemple, une consigne…). Je propose : les composantes `multiple:true` s'activent depuis la zone Contenu de la feuille par un geste « + Définition », « + À retenir »… (patron des blocs de séance de worktrack), chaque bloc étant réordonnable et supprimable, l'aperçu suivant en direct ; les composantes uniques (en-tête, ancrage, mise en page) restent des cases classiques. Le bouton de produit pré-coche les cases ET pré-pose les blocs types de la fiche de séance. **Est-ce conforme au modèle mental de Paul (« je coche, des choses apparaissent ») ou faut-il des cases strictes partout ?**

**Q2 — Où vit l'écran de l'atelier ?** Je propose : une entrée « 🛠 Atelier » dans la barre de sections du Panneau prof, qui ouvre l'atelier en PLEIN ÉCRAN (composition à gauche, aperçu à droite ; empilés en mobile) avec retour au panneau — le panneau overlay actuel est trop étroit pour composer avec aperçu. Alternative : une section ordinaire du panneau, aperçu en modale. **Recommandation : plein écran.**

**Q3 — Le nœud `site/atelier`** (mesure §5). Valider l'emplacement et le nommage — le morceau ② (bibliothèque) héritera de ce choix sans migration.

**Q4 — Les intitulés des trois groupes de l'interface** (aucun jargon : ni « nature », ni « composante »). Proposition : « **Renseignements** » (nature donnée — ce qui vient des données réelles), « **Ce que la feuille contient** » (structure — les zones à remplir), « **Présentation** » (rendu — ce qui transforme le document). Ces textes sont côté PROF ; je les soumets par prudence.

**Q5 — Périmètre confirmé : la TOTALITÉ des composantes des familles A, B, C, D, E, H, I, J** (~115, liste §4), avec les trois places posées-signalées (Image existante sans upload, Diapositive JSON sans injection, Notions sans sélecteur taxonomique). Si la conscience préfère resserrer au strict nécessaire de la fiche de séance pour ce tour, je demande la liste arbitrée AVANT de coder.

**Q6 — Les « Notions visées » (famille B)** : champ de saisie libre dans ce morceau (le rattachement aux 154 notions relève de la Concordance/M19). Confirmer.

**Q7 — La date d'édition** : auto-posée à la création, remise à jour à chaque modification, MODIFIABLE à la main (le professeur a tous les droits), et TOUJOURS imprimée. Confirmer ce comportement.

**Q8 — Textes élève** : l'atelier est un écran professeur ; les seuls textes lus par un élève seront CEUX QUE PAUL ÉCRIT dans ses documents. Le générateur n'injecte AUCUN texte à destination d'un élève de son propre chef (pas de « en attente de… », rien). S'il s'avérait au codage qu'un libellé généré est lisible par un élève (ex. pied de page), il sera soumis en section dédiée du rapport. Confirmer cette lecture du principe cardinal pour ce morceau.

---

## 9 · CE QUE JE NE FAIS PAS (hors périmètre, places posées)
Bibliothèque et troisième source du LIER (②) · upload/redimensionnement d'images et injection JSON des diapositives (③) · les sept autres boutons de produit et les strates spiralaires (④) · familles F, G, K (réservées). Si mon travail les rencontre, je pose la place prévue par le schéma et je le signale.

*Cadrage livré au sas le 29/07/2026. J'attends le feu vert complet de la conscience avant d'écrire la moindre ligne de code.*
