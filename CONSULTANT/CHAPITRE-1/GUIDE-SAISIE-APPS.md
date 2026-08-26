# Guide de saisie dans les applications — chapitre « Poésie et peinture au XIXe siècle »

Établi en lisant le code des applications (`cd.html`, `qcm.html`, `app.html`), pas de mémoire.
Trois créations à faire, plus le remplacement du document Drive.

---

## 1. La dictée « Le port » — application **Correction de dictée**

**Où** : écran d'accueil professeur → carte **« Nouvelle dictée »**.

**Les cinq champs, dans l'ordre du formulaire :**

| Champ | Ce qu'il faut mettre |
|---|---|
| **Titre** | `Dictée : « Le port »` |
| **Niveau** | `3e` (liste : 6e / 5e / 4e / 3e) |
| **Classe** | choisir la classe dans la liste — les élèves sont lus depuis `/classes/{nom}`, on ne les recopie pas |
| **Texte correct** | le texte ci-dessous, **collé tel quel** |
| **Note sur** | `10` |

Puis le bouton **« Commencer »**.

**Texte à coller** (celui de la feuille, sans les crochets de la version à trous) :

> Un port est un séjour charmant pour une âme fatiguée des luttes de la vie. L'ampleur du ciel, l'architecture mobile des nuages, les colorations changeantes de la mer, le scintillement des phares, sont un prisme merveilleusement propre à amuser les yeux sans jamais les lasser. Les formes élancées des navires (…) servent à entretenir dans l'âme le goût du rythme et la beauté.
>
> Et puis, surtout, il y a une sorte de plaisir mystérieux et aristocratique pour celui qui n'a plus ni curiosité ni ambition, à contempler, couché dans le belvédère ou accoudé sur le môle, tous ces mouvements de ceux qui partent et de ceux qui reviennent, de ceux qui ont encore la force de vouloir, le désir de voyager ou de s'enrichir.

**Ce que l'application fait ensuite** : elle découpe le texte en jetons cliquables (apostrophes et guillemets compris) et regroupe les mots par domaine — *D1.1 Orthographe grammaticale, D1.2 Orthographe lexicale, D1.3 Conjugaison, D1.5 Homophones grammaticaux*. Rien à saisir à la main.

**Le barème est celui de l'application**, à connaître pour ne pas le contredire sur la feuille :
G −1 · M −1 · I −1 · L −0,5 · P −0,5 · E −0,5 · **A = 0** (signalement sans retrait).
La feuille annonce G = 1 et L = 0,5 sur 10 : c'est cohérent, ce sont les mêmes poids.

**Points de vigilance :**
- Ne collez pas la version à trous : les crochets `[ ]` seraient pris pour du texte.
- La coupure du texte s'écrit `(…)` et non `[…]` — le crochet est réservé.
- « Publier » rend la dictée visible aux élèves ; laissez-la non publiée jusqu'au jour J.

---

## 2. Les critères de récitation — application **L'Applaudimètre**

**Où** : onglet **Réglages** → carte des critères → le bouton qui accepte un JSON.

**Format attendu** (vérifié dans `amValiderCriteres`) : un objet avec une liste `criteres`, **entre 1 et 6 éléments**, chacun ayant obligatoirement **`emoji`**, **`label`** (libellé court) et **`questionVotant`** (la question posée aux élèves). Tout autre champ est ignoré ; un champ manquant fait échouer la validation avec le numéro du critère fautif.

**À coller** — c'est exactement le contenu de `applaudimetre-criteres-recitation.json` :

```json
{ "criteres": [
  { "emoji": "🧠", "label": "Le texte est su",
    "questionVotant": "A-t-il dit le poème sans hésiter ni se tromper ?" },
  { "emoji": "🔊", "label": "On entend chaque mot",
    "questionVotant": "Est-ce qu'on entendait bien chaque mot, jusqu'au fond de la salle ?" },
  { "emoji": "〰", "label": "Le rythme du vers est respecté",
    "questionVotant": "A-t-il respecté le rythme des vers, les e muets et les pauses ?" },
  { "emoji": "✦", "label": "La récitation est vivante",
    "questionVotant": "Sa récitation faisait-elle entendre le sens du poème ?" }
] }
```

**Deux réglages à vérifier avant la séance 7 :**
- **Le texte au tableau doit être désactivé** — c'est une récitation, pas une lecture. Le réglage existe et est actif par défaut pour la lecture à voix haute.
- Les **seuils de checkpoints** (70 % par critère par défaut) : à laisser tels quels, sauf si vous voulez durcir.

---

## 3. Le QCM de l'interro de cours — application **Évaluation QCM**

**Où** : écran professeur → **« ➕ Nouvelle évaluation »** → champ **« Coller le JSON de l'évaluation »**.

**Format attendu** (vérifié dans `qcmValiderEvaluation`) :
- un **`titre`** (chaîne non vide) ;
- une liste **`questions`** non vide ; chaque question a un **`enonce`**, un tableau **`choix`** d'**au moins deux** éléments, et un tableau **`bonnes`** non vide ;
- les **`bonnes` sont des numéros de position, comptés à partir de 0** — c'est l'erreur classique ;
- **`niveau`** est facultatif et doit appartenir à la liste de l'application (facile, standard, approfondi, expert) ;
- `explication` est accepté et sert au retour après réponse.

**À coller** : le fichier `qcm-interro-de-cours.json` tel quel. Il contient 12 questions (11 de vous, plus la question bonus sur le champ lexical), toutes conformes : indices vérifiés, niveaux dans la liste, aucune question sans bonne réponse.

**Rappel de séance** : l'interro ouvre la séance 3 et dure 15 minutes.

---

## 4. Remplacer le document Drive des cinq tableaux

Le document Drive porte deux défauts : « Karl Friedrich » sans son patronyme, et le Voyageur de Friedrich couché sur le flanc. Le fichier `cinq-tableaux-seance-1.docx` les corrige et donne le titre établi auprès du musée.

**Procédure, si le document est lié depuis le site :**
1. Ouvrir le document Drive existant, **noter son identifiant** dans l'URL (`.../document/d/IDENTIFIANT/edit`) — c'est lui que le site connaît.
2. Dans Drive : **Fichier → Importer** le nouveau `.docx` **dans le document existant** plutôt que de créer un nouveau fichier. L'identifiant est conservé, le lien du site continue de fonctionner.
3. Vérifier après import : le titre du tableau 4 (« Ville médiévale au bord d'un fleuve — Karl Friedrich Schinkel, 1815 »), et le sens du tableau 5.

**Si vous préférez créer un nouveau document** : il faudra alors mettre à jour la référence de l'item correspondant dans la séance 1, sans quoi le lien pointera vers l'ancien fichier.

**À faire aussi** : le titre corrigé est déjà répercuté dans le chapitre, la consignation et le diaporama — mais pas dans vos éventuelles copies personnelles du document.

---

## Ordre conseillé

1. Les **critères de l'Applaudimètre** — deux minutes, un copier-coller.
2. Le **QCM** — un copier-coller, puis vérifier l'aperçu des 12 questions.
3. La **dictée** — cinq champs, mais il faut relire le texte collé.
4. Le **document Drive** — l'import dans le fichier existant préserve le lien.
