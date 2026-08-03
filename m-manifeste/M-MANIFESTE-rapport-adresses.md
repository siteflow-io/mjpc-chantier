# M-MANIFESTE — COMPLÉMENT : la chasse aux adresses écrites en dur
**02/08 · complète `M-MANIFESTE-rapport.md`, ne le remplace pas**

## 1. Ce que la recherche a trouvé — 24 occurrences DANS DU CODE OU DU TEXTE, zéro en commentaire
Recherche sur **les dix fichiers de production**, lignes en `//` écartées.
| adresse | occurrences | où |
|---|---|---|
| `monsieurjaipascompris.fr` | **16** | la présentation MJPC (tronc + brève) **dans les huit fichiers qui la portent** : index, correction_dictee, worktrack, dictee_universelle, pilotage_debat_s3, evaluation-qcm, analyse_logique, applause_meter |
| `monsieurjaipascompris.com` | **7** | **l'en-tête `<title>`/bandeau « Écosystème MJPC — monsieurjaipascompris.com — Paul Meney »** dans index, worktrack, evaluation-qcm, analyse_logique, applause_meter, reecriture, reecriture_bb4e |
| `monsieurjaipascompris.com` | **1** | ⚠ **`var MJPC_BASE_URL = "https://monsieurjaipascompris.com";`** dans `evaluation-qcm` — **une constante ACTIVE, pas un commentaire** |
**Aucune n'est en commentaire. Toutes sont dans du texte lu ou du code exécuté.**

## 2. ⚠ LE DÉFAUT LE PLUS SÉRIEUX : `MJPC_BASE_URL`
```js
var MJPC_BASE_URL = "https://monsieurjaipascompris.com";
function urlProfilClasseMJPC(classeSlug){ return MJPC_BASE_URL + "/profil-classe/" + …; }
```
**Ce n'est pas un texte : c'est une URL construite pour être suivie.** Le commentaire du code dit lui-même : *« La page /profil-classe n'est pas encore créée — branchement préparé. »*
**Conséquence mesurée** : la fonction est **inerte aujourd'hui** (aucun appelant actif trouvé hors d'elle-même), **mais elle est fausse pour demain** — et c'est précisément le genre de branchement qu'un morceau futur activera sans le relire. **Le domaine `.com` n'est pas plus attesté que le `.fr`** : l'API GitHub Pages du dépôt répond `cname: None`, aucun domaine personnalisé n'est configuré.
**Je ne le corrige pas dans ce morceau** : `evaluation-qcm` est déjà livré ici pour la comparaison de manifeste, et **toucher une URL de branchement futur sans savoir ce que Paul compte acquérir serait décider à sa place**. **Signalé, chiffré, localisé.**

## 3. Ce que Paul doit trancher — et pourquoi ça ne peut pas attendre
**Deux domaines différents cohabitent dans le même écosystème** : le `.fr` dans les prompts (que je viens de retirer au profit de l'adresse servie), le `.com` dans les bandeaux et dans `MJPC_BASE_URL`. **Aucun des deux n'est attesté.**
· **Si Paul possède l'un d'eux** : il faut l'écrire partout, et retirer l'autre.
· **S'il n'en possède aucun** : les sept bandeaux « Écosystème MJPC — monsieurjaipascompris.com » **annoncent une adresse qui n'existe pas, sur des pages qu'un élève ouvre**.
· **S'il compte en acquérir un** : c'est le moment de le choisir, avant que d'autres branchements s'y accrochent.
**Ce que j'ai fait dans ce morceau** : corrigé **les deux occurrences de la présentation dans `index.html`** (le prompt maître, celui qu'une IA suit). **Les 14 autres occurrences sont mesurées et localisées, non corrigées** — elles relèvent d'une décision de Paul, pas d'un choix d'exécutant.

## 4. Déclaration de relecture — complément
**Relu en plus** : les bandeaux d'en-tête des dix fichiers (« Écosystème MJPC — … — Paul Meney ») — **aucune faute de langue**, seule l'adresse est en cause. Le commentaire de `MJPC_BASE_URL` — **relu, exact et honnête** (il dit lui-même que la page n'existe pas).

## 5. Ce qui reste, inchangé depuis le rapport principal
**L'écran d'écart n'est pas livré.** Il reste la moitié manquante de la solution ① + ③.
