# RAPPORT — LOT 2ter · livraison ① · IDENTITÉ DES OBJETS
Version **8.73.0-①**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base
`PONT/EDT/index.html` 8.72.0 — 1 646 417 o, md5 `e22118e6864141a8c549f810ad4f280b`, conforme à l'en-tête du mandat.
Candidat produit : **1 656 675 o**. Double parseur (node --check + acorn ES2020) : **VERT** avant et après.
Garde `verif_edt.py` : **VERTE sur les trois contrôles**.

## Ce qui a été fait
1. **Déclaration morte supprimée** — `edtPeriodePoser(nom,date)` (472 o). Les trois appels réels visaient tous la signature `(rang,champ,valeur)`. La fonction jamais appelée n'a pas été corrigée : elle a été retirée.
2. **Noyau d'identité** — `EDT_FAMILLES` (9 familles et leurs critères forts), `edtNormaliser`, `edtCondense` (FNV-1a base 36, déterministe), `edtValeurCritere`, `edtAmorce`, `edtHorodatage` (photo : horodatage à la seconde), `edtPoserIds` (collision → `#2`, à la pose seulement), `edtApparier` (quatre temps, biunivoque).
3. **Pose à l'injection** — `edtPoserIdsObjet` appelée dans `edtInjInjecter` AVANT la première écriture, et dans `edtInjecterAvecLaGrille` pour les créneaux horaires et les périodes. C'est le chemin réel : le hub est vide.
4. **Pose au chargement** — les charges tournent en mémoire dès la fin d'`edtCharger` : rien ne s'affiche sans identité, même si l'écriture échoue.
5. **`edtMettreANiveau`** — écrite pour **quatre charges** dès maintenant (`EDT_CHARGES` + `edtChargeInscrire`) : la livraison ① y branche l'identité, les livraisons ②, ⑤ et ⑨ y brancheront les trois autres **sans reprendre l'écriture**. Elle **archive avant d'écrire** (`edtArchiver` → `atCorbeilleCle`, modèle `chInjecterConfirme`) et **abandonne si l'archivage échoue** — rien n'est écrit, le site continue en lecture et le dit.
6. **Les cinq fonctions par `id`** — `edtJustifier`, `edtCreneauPoser`, `edtPeriodePoser`, `edtPeriodeSupprimer`, `edtPeriodeDeplacer`. Plus une seule désignation par rang ni par indice (`Number(c.rang)` et `Number(p.rang)` : 0 occurrence). Les 8 appelants HTML passent l'`id`.
7. **Dette trouvée et fermée** — `edtPeriodesEcrire` reconstruisait chaque période en `{rang,nom,debut,fin}` et **perdait l'`id`** à chaque écriture. L'`id` est désormais conservé.
8. **`verif_edt.py`** — deux appels déclarés au contrat avec leur raison (`secuEcrire`, `atCorbeilleCle`) et une exception ③ nommée : la corbeille commune du site, qui n'est pas un nœud de l'EDT.

## Preuves, mesurées
| Preuve | Mesure |
|---|---|
| ⑰.1 identité | 122 id posés sur le calendrier réel (15 evc · 30 jal · 59 eta · 11 fer · 7 vac), 0 collision, tous uniques · 2e passe : **0 id reposé** · deux exécutions séparées : id identiques |
| ⑰.3 la coche ne se trompe plus | coche sur le 5e (« Stages 3e »), insertion en tête → toujours « Stages 3e », rang 6 |
| ⑰.4(a) avec les id | 14 forts **silencieux** · 1 arrive · 1 disparaît, nommé |
| ⑰.4(b) sans les id | 10 forts · **4 faibles proposés nommément** (dont « Stages 3e » 16/11 → 17/11) · 1 arrive · 1 disparaît · aucune conservation silencieuse |
| ⑰.15 biunivocité | 4 homonymes dont 2 permutés → 4 forts, **0 permutation** ; 5e strictement identique → **1 ambiguïté nommée, rien d'appliqué** |
| ⑰.6 archivage | archivage OK → 1 archive puis 1 écriture · **archivage simulé en échec → 0 écriture**, message affiché |
| famille à critère unique | férié renommé → **0 appariement faible**, 11 forts par date |
| ⑰.20 `edtPeriodePoser` | une seule déclaration, les trois appels passent |
| ⑰.21 non-régression | **138 noms d'origine, 0 disparu** ; 10 ajoutés, nommés · `secu*` 29 · `published` 97 |

## Écarts signalés, jamais ajustés
- **`EDT_ANNEE` : 13 → 12 occurrences** (11 usages). La déclaration morte contenait `{annee:EDT_ANNEE,…}`. Le §⑯ et le §⑮ doivent porter la valeur d'après-①.
- **`function edt*` : 149 déclarations** (138 d'origine + **11** ajoutées : `edtAmorce`, `edtApparier`, `edtArchiver`, `edtChargeInscrire`, `edtCondense`, `edtHorodatage`, `edtMettreANiveau`, `edtNormaliser`, `edtPoserIds`, `edtPoserIdsObjet`, `edtValeurCritere`). Aucune des 138 n'a disparu. Vérifié au navigateur : 149 exposées sur `window`, aucune non déclarée, aucune déclarée manquante.
- **Banc corrigé** : une « retouche » de libellé consistant à remplacer un `e` par un `é` produit un appariement **fort**, pas faible — le libellé normalisé retire les accents (§①). Le banc était faux, pas le code.

## Ce qui reste à faire (livraisons ② à ⑧)
Inchangé par rapport à la découpe du §⑱. Rien n'a été anticipé hors de ①.

## Environnement — vérifié, pas supposé
- **Banc visuel : opérationnel.** `puppeteer-core` + `@sparticuz/chromium` installés depuis npm, binaire extrait en `/tmp/chromium`. Le candidat se charge en `file://` : **149 fonctions `edt*` exposées**, `EDT_ANNEE` = `2026-2027`, `EDT_FAMILLES` = 9 familles, `edtPoserIds`/`edtApparier`/`edtMettreANiveau` présentes, **0 erreur de page**, capture PNG 1366×768 produite (`capture-accueil-8.73.0-1.png`). Aucune preuve n'est dégradée en preuve logique : ⑰.8, ⑰.9, ⑰.13, ⑰.17 et ⑰.18 se mesureront comme le mandat les écrit.
- **Deux couches anti-écriture au banc** : interception HTTP (tout non-GET avorté) et, pour l'essai à la main, `index-banc.html`.
- **Aucun push au sas** : pas de jeton reçu (PUT api.github.com → 401).

## `index-banc.html` — pour essayer sans toucher au hub
Le candidat est **connecté au vrai Firebase** : 14 écritures dans le bloc EDT, vers `/site/edt/{calendrier, grille, creneaux, periodes, decisions, photos, reglages}`. Au simple chargement rien n'est écrit (le hub est vide, aucune charge de mise à niveau ne se déclenche) — ce sont **les gestes** qui écrivent.
`index-banc.html` = le candidat + un bloc de neutralisation en fin de document : `mjpcEcrireRest` et `_sitePut` détournés, journal dans `window.__ECRITURES__`, bandeau rouge permanent. Mesuré : une écriture volontaire est capturée, **0 requête non-GET ne sort**. Ce bloc n'est PAS dans le candidat livré au sas.
