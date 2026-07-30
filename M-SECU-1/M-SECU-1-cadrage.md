# M-SÉCU-1 — CADRAGE (exécutant → conscience)
**30/07/2026 · avant tout code · j'attends le feu vert**

## 0 · Conteneur, date, lectures

- **Conteneur hérité déclaré** : ce conteneur porte M-ÉCHECS-1 entier (même conversation, promu en 8.7.1) ; rien d'inconnu, tout figé. Base du présent morceau : production re-téléchargée.
- **Date, deux sources concordantes** : conteneur `Thursday 30 July 2026 14:39 UTC` · GitHub `Thu, 30 Jul 2026 14:39:54 GMT`.
- **Lectures** (les trois inchangées ont des md5 identiques à mes lectures M-ÉCHECS-1 — déjà lues intégralement ; les deltas et nouveautés lus intégralement) :

| Document | Taille | md5 |
|---|---|---|
| MJPC6-1-DISPOSITIF.md *(inchangé)* | 121 650 | `ce116a8cdb82c5ad4a8b0365cfa4613a` |
| MJPC6-2-DOCTRINE.md *(inchangé)* | 78 342 | `a304e9010ceaafdd0e74d4e7edbc9d32` |
| MJPC6-3-CHANTIER.md | 131 278 | `d91bc507936f65d77bb6d02f20ab4c47` |
| MJPC6-journal.md | 95 517 | `9d049ced234d3b647ccd7171d47424d4` |
| MJPC6-doctrine-du-site.md *(inchangé)* | 86 663 | `bbc34f10fd772eb16b0268cafaebe3f5` |
| MJPC6-ETAT-DES-LIEUX.md | 4 790 | `c1d346ebe700b694c18d1b1ab9bc0cad` |
| mjpc-core.js (canon 1.2.0) | 13 496 | `04b3d303fe613434ce2c3e0c71657c32` |

- **Base** : `index.html` 508 257 o, md5 `8122689e00c615728ab77a71b045d387`, **v8.7.1** — identique au journal. La correction de conscience sur `mjpcEcrireRest` (`.then(onOk,onErr)`) est lue et comprise : ma §11 suivra la même discipline (aucun `catch` qui avale un bug d'aval).

## 1 · État mesuré de `/codes` au hub (30/07, lecture seule)

- **122 entrées = 120 codes réels (dicts) + 2 VESTIGES non-dict** : `ELIO-1381 → "planete-des-singes-3e"`, `ELIO-8378 → "debat-test-4e"` (anciens codes de séance du débat). La migration les DÉTECTE, les SAUTE et les NOMME au compte rendu — le « 122 » du dénombrement sera donc « 120 préparés + 2 vestiges signalés ».
- Deux structures : `{code,createdAt,name}` ×29 (anciennes) · `+classe` ×91. Aucune ne porte encore `chiffre`/`empreinte` (0/120).
- **Les codes font 4 chiffres** (`_genCode4`, espace 1000-9999). Conséquence d'honnêteté, à dire au rapport : aucune empreinte d'un secret à 9 000 valeurs ne résiste à l'essai exhaustif ; l'empreinte supprime l'EXPOSITION DIRECTE en masse (l'objectif de ce morceau), elle ne rend pas le code incassable. Je propose de la renchérir (§3) et de le dire sans fard.
- **Constat connexe grave** : `PROF_CODES=['1312','3141']` — les codes PROF sont EN CLAIR dans le HTML public (L1901), et ils ouvrent la session prof. Hors du périmètre écrit de ce morceau ; je le signale pour instruction (candidat : même régime d'empreinte, M-SÉCU-1bis ou ordre au feu vert).
- **Contradiction sourcée** (les documents/le code font foi) : le prompt dit `_printCodesClasse` « n'est pas utilisé » ; le code le câble à un bouton « 🖨 Imprimer » visible (L3736). Je n'y touche pas, mais voir Q6 (cohérence du masque sans clé).

## 2 · La forme proposée — socle §11 (canon 1.3.0)

Section « **11. Coffre : dérivation, chiffrement, empreinte** » (le doublon §8/§8 est connu, je ne renumérote pas, je le signale). Style promesses `.then`, zéro dépendance, WebCrypto :

- `mjpcCryptoDispo()` — vrai si `crypto.subtle` existe. Toute entrée du coffre passe par ce test ; absent (page servie en `http://` hors localhost) → message clair « Le chiffrement n'est pas disponible sur cette adresse (il faut le site en https) », jamais d'échec muet.
- `MJPC_COFFRE_SEL_DERIVATION = "mjpc-coffre-derivation-v1"` — sel constant de dérivation, documenté dans le bloc (constante d'écosystème : la même clé saisie donne la même clé dérivée partout).
- `mjpcDeriverCle(secret)` → Promise\<CryptoKey AES-GCM 256\> — PBKDF2-SHA-256, **310 000 itérations**, sel constant ci-dessus.
- `mjpcChiffrer(cle, texte)` → Promise\<`"v1."+b64(iv 12 o)+"."+b64(chiffré)`\> — AES-GCM, IV aléatoire par appel.
- `mjpcDechiffrer(cle, paquet)` → Promise\<texte\> — **rejette** sur clé fausse (GCM est authentifié : c'est ce qui rend le canari fiable).
- `mjpcSelAleatoire()` → 16 octets hex.
- `mjpcEmpreinte(texte, selHex)` → Promise\<hex 32 o\> — PBKDF2-SHA-256 **100 000 itérations avec sel PAR ENTRÉE** (stocké à côté). Raison : contre un secret à 4 chiffres, un SHA simple à sel constant se renverse en 9 000 hachages précalculables une fois pour toute la table ; le sel par entrée + le coût par essai obligent l'attaque entrée par entrée et la rendent coûteuse, sans rien demander de plus aux apps (elles liront `sel` et `empreinte` du même nœud au M-SÉCU-2/3).

Le canon `mjpc-core.js` 1.3.0 ET l'embarqué : verbatim identiques à l'octet, livrés ensemble.

## 3 · La clé prof — jamais retapée, jamais partie

- **Stockage local** : `localStorage['mjpc_coffre_secret']` = le secret saisi (Q1 : je propose le secret plutôt que la clé dérivée exportée — même exposition locale exacte, mais la re-dérivation reste possible si les paramètres évoluent ; c'est le modèle des conventions). Restauré à chaque chargement : rechargement, nouvel onglet, nouvelle session → la clé est là (exigence de Paul, prouvée explicitement au parcours).
- **Canari** : `/site/config/coffreCanari` = `mjpcChiffrer(cle, "MJPC-CANARI|coffre-v1")`, lu par `_siteGet`, écrit par `_sitePut` (→ verdicts 1.2.0 et mode test GRATUITS, je ne refais rien). Toute clé (saisie ou restaurée) est validée AVANT tout affichage : déchiffrement réussi ET texte exact. Clé fausse → REJETÉE : « Cette clé ne correspond pas à celle qui a verrouillé les codes. Vérifie la saisie. » Première pose (canari absent) → la clé saisie fait foi et écrit le canari (Q2).
- **Oubli** : bouton « Oublier la clé sur cet appareil », visible dans l'encart — efface le secret local, les codes redeviennent masqués immédiatement.
- **Appareils** : à chaque pose, `/site/config/coffreAppareils/<id>` = `{nom:"Windows · Chrome", pose_le}` (id aléatoire local) ; l'oubli marque `oublie_le` (meilleur effort). Écran : liste datée « où la clé est mémorisée ». Aucune donnée sensible dans ces fiches (Q3).
- **La clé ne part jamais** : preuve par journal réseau complet du banc — aucune requête ne porte ni le secret, ni la clé dérivée, ni un chiffré de la clé.

## 4 · L'écran « Élèves & codes » — même aspect, deux régimes

Identique (noms, ↻, ✕, Générer, Imprimer, Tout régénérer). Seule différence :
- **Sans clé** : la colonne code affiche `✻✻✻✻` et un encart en tête : « Les codes sont verrouillés sur cet appareil. Saisis ta clé de chiffrement pour les afficher. » + champ + ⓘ cliquable.
- **Avec clé validée** : les codes s'affichent — depuis le DÉCHIFFRÉ quand `chiffre` existe (la chaîne fait ses preuves à chaque affichage), depuis le clair sinon (pré-migration) (Q4).
- **Générer / ↻ / Tout régénérer / import de codes : EXIGENT la clé** (Q5). Raison de cohérence, pas de zèle : un code régénéré sans clé laisserait un `chiffre`/`empreinte` de l'ANCIEN code — au M-SÉCU-3, l'app validerait un code périmé. `_putCode` écrit désormais les cinq champs (`code` clair conservé, `chiffre`, `sel`, `empreinte`, + `name/classe/createdAt`) en une écriture.

## 5 · Migration des codes existants

`secuMigrerCodes()`, déclenchée à la première validation de clé (et relançable d'un bouton) :
- Dénombrement AVANT : « 120 codes à préparer, 0 déjà prêts, 2 vestiges ignorés (ELIO-…) ».
- Par entrée : `chiffre` + `sel` + `empreinte` calculés, écrits en **une écriture par élève** — `mjpcEcrireRest` PATCH sur `/codes/<clé>.json` (fusion Firebase : n'écrase ni `code` ni `createdAt`), routé magasin en mode test par ma section (le PATCH fusionne au magasin) (Q7). 120 écritures, verdicts TOUS collectés (l'équivalent `allSettled` sur le classeur d'issues 1.2.0) ; compte rendu APRÈS : « 120 préparés, 0 refusé, 0 panne, 2 vestiges ignorés » — la migration ne se déclare terminée que si tout est accepté ; les échecs sont nommés et ré-émettables.
- **Idempotente** : une entrée portant déjà `chiffre && sel && empreinte` est sautée ; preuve par seconde exécution (« 0 à préparer, 120 déjà prêts »).
- Non destructif : le clair reste (M-SÉCU-3). **Dit en toutes lettres au rapport : CE MORCEAU NE PROTÈGE RIEN ENCORE — il prépare.**

## 6 · `_allCodesTaken` — vérifié, et l'après instruit

Elle lit `codesData[k].code` (le clair, conservé) + `PROF_CODES` : **fonctionne telle quelle**, je le prouve par une régénération jouée APRÈS migration (unicité garantie). Pour l'après-clair (rapport, PAS codé ici) : index inversé `/codes_pris/<code>=true` (piste de la conscience à l'état des lieux) — tenu par `_putCode` (pose le nouveau, retire l'ancien), l'unicité se vérifie sur une clé sans lire la table ; à instruire à M-SÉCU-3 avec la question du nettoyage des orphelins.

## 7 · La preuve — banc en mémoire (l'outil validé le 30/07)

Le navigateur headless a lâché sur ce fichier (frame détachée, journal du 30/07) : **banc en mémoire** — fonctions extraites du fichier livré, exécutées dans Node (WebCrypto natif), `fetch` stubbé à trois modes (ok/refus/panne) + magasin de test. Parcours complet joué : première saisie → canari posé → migration 120 (+2 ignorés) → affichage déchiffré → **redémarrage simulé (nouveau contexte, même localStorage stubbé) : codes affichés SANS ressaisie** → clé fausse rejetée par canari → oubli → masqués → nouvelle saisie → revenus → seconde migration (0 à faire) → régénération d'un code (unicité + cinq champs) → mode test : zéro requête réseau (journal). Mobile 390 et rendu : capture statique + mesures DOM (déclaré comme tel).

## 8 · Textes proposés (vocabulaire des conventions, soumis)

- Encart sans clé : « **Les codes sont verrouillés sur cet appareil.** Saisis ta clé de chiffrement pour les afficher. » · bouton « Afficher les codes ».
- Clé fausse : « **Cette clé ne correspond pas à celle qui a verrouillé les codes.** Vérifie la saisie — rien n'a été modifié. »
- Clé validée (bref) : « Codes déverrouillés sur cet appareil. »
- Oubli : « **Oublier la clé sur cet appareil** » + confirmation : « Les codes redeviendront illisibles ici jusqu'à la prochaine saisie. Les données ne bougent pas. »
- Migration : « Préparation des codes : 120 à rendre illisibles pour le futur coffre… » puis « **120 codes préparés, 0 échec, 2 entrées anciennes ignorées (ELIO-…).** Le clair reste en place tant que les applications en ont besoin — la protection sera effective au 3e temps du chantier sécurité. »
- Crypto absente : « Le chiffrement n'est pas disponible sur cette adresse. Ouvre le site en https (adresse habituelle) pour utiliser la clé. »
- ⓘ de l'encart : « La clé transforme les codes en données illisibles pour quiconque n'a pas la clé. Elle reste sur cet appareil : elle n'est jamais envoyée. »

## 9 · Questions au feu vert

**Q1** — Stockage local : le SECRET (proposé) ou la clé dérivée exportée ?
**Q2** — Première pose (canari absent) : la clé saisie fait foi et pose le canari — confirmer.
**Q3** — Fiches d'appareils au hub (`/site/config/coffreAppareils`, nom générique + dates) : validé ?
**Q4** — Affichage avec clé : DÉCHIFFRÉ prioritaire (chaîne prouvée en usage) avec repli clair pré-migration — ou clair tant que M-SÉCU-3 n'est pas passé ?
**Q5** — Générer/↻/import de codes SANS clé : BLOQUÉS avec message (cohérence chiffre/clair) — confirmer.
**Q6** — « Imprimer » sans clé : masqué comme l'écran (même invite), ou laissé au clair (le prompt le dit inutilisé, mais il est câblé et cliquable) ?
**Q7** — Migration : PATCH par élève (120 écritures, fusion, routage test dans ma section) — ou PUT par champ via `_sitePut` (360 écritures, plus lent, zéro code nouveau) ?
**Q8** — `PROF_CODES` en clair dans le HTML public : constat porté — l'instruis-tu ici (même régime d'empreinte) ou en morceau dédié ?
