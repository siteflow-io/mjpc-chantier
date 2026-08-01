# M-PROMPT-4 — RECTIFICATIF DE CADRAGE (exécutant → conscience)
**01/08 · corrige mon complément `93a24953d7fdc2e2a2d3cd0795e9f1b4` · j'attends le feu vert**

## 1. MON ERREUR, ET COMMENT JE SUIS TOMBÉ DEDANS
J'ai écrit que **les neuf manifestes étaient vides**. **C'est faux, et l'erreur est la mienne.** Ma regex prenait la **première** occurrence de `MJPC_MANIFESTE` dans chaque fichier — qui est **le gabarit commenté du canon** (`// MJPC_MANIFESTE = { notions: [], noeuds: [] }`, 44 caractères, identique partout). **C'est le piège de l'exemple commenté**, que la grille m'ordonnait d'écarter *« avant toute regex »*, et je l'avais recopié dans mon propre cadrage. Remesuré en écartant les lignes en `//` : **chaque app porte un manifeste ACTIF**, de 196 à 324 caractères, avec ses nœuds réels.
| app | nœuds déclarés (manifeste actif) |
|---|---|
| correction_dictee | `correction_dictee`, `classes_amenages`, `correction_dictee_textes` |
| worktrack | `plan_de_travail` (+ note : lit/écrit `/classes` racine sans le posséder) |
| dictee_universelle | `dictees`, `students`, `students_sim` |
| pilotage_debat_s3 | `debats`, `debat_config` |
| evaluation-qcm | `qcm/evaluations`, `qcm/sessions`, `qcm/sessionActive`, `qcm/presence`, `qcm/qrScans`, … |
| analyse_logique | `analyse_logique` |
| applause_meter | `applaudimetre`, `mjpcProfils` |
| reecriture / bb4e | `reecritures` / `reecriture_bb4e` |
**Seul `notions: []` est vide**, documenté partout comme *rattachement Phase 3 (Concordance)* : une attente, pas un oubli. **La dette que j'avais signalée est donc annulée** — et je la remplace par celle-ci : *une mesure qui donne le même résultat dans neuf fichiers différents doit être suspectée avant d'être publiée.*

## 2. CE QUE LA MESURE CORRIGÉE APPORTE — et un écart qui compte
`MJPC_APP.nom` mesuré (déclarations **actives**, gabarit commenté écarté) :
| app | `MJPC_APP.nom` (nom canonique) | `<title>` (l'usage) |
|---|---|---|
| correction_dictee | **Correction de dictée** | Correction dictée |
| worktrack | **Plan de travail** | Plan de travail — Les Misérables |
| **dictee_universelle** | **Dictée universelle** | **Dictée coévaluée — MJPC** |
| pilotage_debat_s3 | **Pilotage débat** (contenant : `binome`) | Débat — MJPC |
| evaluation-qcm | **Évaluation QCM** | Évaluation QCM |
| analyse_logique | **Atelier d'analyse logique** | Analyse logique — atelier MJPC |
| **applause_meter** | **L'Applaudimètre** | **L'Applaudimètre — Lecture coévaluée** |
| reecriture / bb4e | **Réécriture** / **Réécriture brevet blanc 4e** | Réécriture / Réécriture — Brevet blanc 4E |
**L'ÉCART EST INSTRUCTIF, ET IL VALIDE LE RECTIFICATIF** : `MJPC_APP.nom` dit **« Dictée universelle »** et **« L'Applaudimètre »** — **ni l'un ni l'autre ne dit la coévaluation**. Le nom canonique donne le **nom**, jamais le **quand**. C'est le `<title>` et les écrans qui révèlent que **deux apps sur neuf reposent sur l'évaluation entre élèves**. **Les deux sources sont donc nécessaires et complémentaires, exactement comme le rectificatif l'énonce.**

## 3. CE QUE JE POSE, ET CE QUE J'ABANDONNE
**J'ABANDONNE `MJPC_OUTILS`** (la structure parallèle de mon complément) : elle ferait doublon avec `MJPC_APP.nom`, qui existe, est maintenu et est écrit par Paul.
**JE POSE UN CHAMP DE PLUS DANS `MJPC_APP`** — là où il doit être :
```js
var MJPC_APP = {
  id: "applause_meter",
  nom: "L'Applaudimètre",
  contenant: "aucun",
  usage: "Les élèves écoutent un camarade lire à voix haute et votent sur des critères que le professeur a définis ; la classe voit le résultat.",
  quandPas: "Pas pour évaluer une production écrite, ni un oral argumenté — pour cela, c'est Pilotage débat."
};
```
**Ce que ça coûte** : deux lignes par app, à écrire une fois et à corriger le jour où une app change de métier. **Ce que ça protège** : le nom et l'usage vivent **au même endroit**, dans le fichier de l'app — celui qu'on modifie quand on change son métier. Une déclaration parallèle au canon aurait vieilli sans que personne la voie.
**LA GÉNÉRATION** : la liste se compose des **manifestes publiés au hub** (`/manifestes`, 11 entrées, qui portent déjà `app.id`/`app.nom`/`app.contenant`) **croisés avec les branches réelles d'`openItem`**. Une app branchée **sans `usage`** paraît quand même : *« [nom canonique] — (usage à décrire : cette application existe mais personne n'a dit quand la proposer) »*. **La liste reste générée ; seule la phrase est humaine, et son absence se voit.**
⚠ **Conséquence à dire franchement** : `usage` et `quandPas` doivent **remonter au hub** avec le manifeste pour que le site les lise — c'est-à-dire que **`publierManifeste` doit les emporter**. C'est une ligne dans chaque app, et le site n'invente rien : **il lit ce que les apps déclarent.** Sans cela, le site devrait porter une copie des usages, et l'on retomberait dans la liste écrite à la main.

## 4. LES NEUF DESCRIPTIONS — inchangées sur le fond, renommées avec le nom canonique
Les descriptions de mon complément restent valables (elles sont **mesurées dans les écrans**, ce que le rectificatif confirme comme la bonne méthode) ; **seuls les noms changent** pour adopter `MJPC_APP.nom` : « Dictée universelle » (et non « Dictée coévaluée »), « L'Applaudimètre », « Pilotage débat », « Atelier d'analyse logique », « Correction de dictée », « Plan de travail », « Réécriture ». **L'usage, lui, dit la coévaluation** — c'est précisément la répartition des rôles entre les deux sources.
Le test **« quand / quand pas »** reste appliqué à chacune, et les deux outils d'oral continuent de se renvoyer l'un à l'autre.

## 5. Ce que je croise et signale sans y toucher
Le manifeste de `pilotage_debat_s3` déclare, **mesuré** : *« M5 : debat_singes archivé en corbeille puis supprimé (17/07) »*. **La dette du chantier qui le dit encore « à migrer » est donc probablement caduque** — je le signale, je ne le corrige pas : ce n'est pas mon morceau.

## 6. Ce qui ne change pas
Le dosage (tronc complet au site, forme brève aux apps), le poids chiffré, **la pièce assemblée qui n'écrase pas les prompts persistés**, les ancres par contexte, le socle d'`index.html` jamais remplacé en bloc. **Les fichiers touchés passent de 9 à 9 + les déclarations `MJPC_APP`** : canon 1.5.0, `index.html`, et les 7 apps au canon — **`reecriture` et `reecriture_bb4e` restant hors canon, leur `usage` sera écrit par le morceau du chantier réécriture ; en attendant, elles paraîtront avec « (usage à décrire) »**, ce qui est exactement le comportement voulu.

## Question qui remplace mon Q2
**Q2′ — le champ `usage`/`quandPas` dans `MJPC_APP` et sa remontée par `publierManifeste`** : validé ? C'est un ajout au socle **et** une ligne dans chaque app. L'alternative serait que le site porte les usages — mais alors la liste redevient écrite à la main au site, ce que nous refusons tous les deux.
