# RAPPORT — CORRECTION DE DICTÉE : les copies et l'aperçu
Conscience n°5 · MJPC 6 · 09/08/2026 · exécutant dédié `correction_dictee.html`

## BASE
`correction_dictee.html` production (`siteflow-io/monsieurjaipascompris`) : **586 505 octets · md5 `acf79d92f48c69e7babdf8a8f3b3cefe`**.
Livrable : **589 922 octets · md5 `f62be8d5f89c5a5a9d3729ada5b7aaa9`**.

---

## ① LE BUG DES COUCHES — mesure d'abord, verdict, réparation

### Où chaque règle est définie (les trois contextes)
Un seul générateur existe : `buildCopieHtml()` (l. 5158 BASE) produit un document HTML
**complet et autonome** (DOCTYPE + `<style>` embarqué). Les trois contextes consomment ce
même document : onglet Copies du prof (iframe, l. 5883 BASE), modale élève `MaCopie`
(iframe, l. 5978), HTML exporté (téléchargement du même document, l. 5606). **Aucune règle
ne « manque dans un contexte »** : le CSS embarqué est identique partout.

### L'hypothèse « changement de contenant à l'unification de juillet » : INFIRMÉE
Le bloc CSS des couches est **strictement identique** (diff vide) entre le 12 juin
(`5c8f71fe`), le 14 juillet (`f73d634e`), la v6.0.0 du 18 juillet (`245fa0db`, l'unification
nav 2 niveaux) et la production d'aujourd'hui. La copie n'a jamais changé de contenant :
elle a toujours emporté son CSS avec elle.

### Le vrai défaut, mesuré au banc (Chromium headless, hub intercepté)
Reproduit sur la BASE, mode par défaut (« Souligné ») :
1. **La correction entrait dans le flux.** La règle `body.show-overlay.mode-barre … .layer-after
   .vert-after{display:inline}` affichait le mot correct DANS LA LIGNE, après le fautif —
   d'où le « tremblant Hors hors » de la copie d'ALOYEAU Elyse. `layer-top` (le « au-dessus »)
   n'était activé qu'en modes brut/placeholder/rien, jamais en mode par défaut.
2. **Type et points entraient dans le flux.** `.layer-after` était `display:inline-block`
   dans la ligne (badges en exposant collés au mot).
3. **Ta mesure « `.layer-after` sans règle propre » est exacte — sur les mots en trop.**
   Toutes les règles de masquage et de badge étaient préfixées `.mot.faux` ; or les extras
   (`.mot.extra-w`) n'ont pas la classe `faux` : aucun sélecteur ne les gouvernait. Leur
   badge « + » et leurs points « −0,5 » s'affichaient donc TOUJOURS, en texte brut, dans le
   flux, quels que soient les réglages — reproduit en capture sur la BASE
   (« soufflealors+−0,5 . »). C'est le morceau qui correspond mot pour mot à ta mesure.
4. En P, aucune couche `layer-top` n'était même générée (le signe manquant ne pouvait
   apparaître qu'en mode vert direct).

### La réparation (dans le CSS embarqué → les trois contextes d'un coup, export autonome)
- **Le mot correct AU-DESSUS** : `layer-top` absolu (`bottom:calc(100% + .1em)`), activé
  dans les quatre modes non-verts, mode par défaut compris. Le mot manquant (M) garde son
  fond ocre au-dessus, désormais aussi en mode barré. Le signe P manquant est généré et
  surgit au-dessus en rouge encadré.
- **Le mot de l'élève BARRÉ dessous** : mode par défaut passé de `underline` à
  `line-through` ; l'étiquette du mode devient **« Barré »** (2 emplacements).
- **Type et points SOUS le mot, jamais dans le flux** : `layer-after` en position absolue
  (`top:calc(100% + .12em)`), boîte du mot resserrée (`line-height:1.2`) pour que rien ne
  chevauche ; l'interligne 3,4 du texte absorbe les deux étages.
- **Extras couverts** : masquage, badges et points généralisés à `.mot` (plus seulement
  `.mot.faux`) ; espacement réparé (« souffle alors. » au lieu de « soufflealors . »).
- **Filet mode inconnu** : un `copyOptions.mode` hors liste rendait la copie invisible
  (aucune règle ne matchait) ; normalisé sur « barre ». La donnée du bac à sable
  (`mode:"complet"`, qui n'a jamais existé) est corrigée au passage.
- La couche `vert-after` (correction dans le flux) n'est plus ni générée ni activée : la
  spécification des trois couches est exactement base=élève · top=correct · after=type+points.

### Banc — cas exigés, tous verts (`mesures.json`)
- Copie ALOYEAU Elyse : **une faute de chaque type (G, L, M, P, I, A) + un mot en trop (X)**.
- **Trois contextes vérifiés** : onglet Copies · modale élève (portail réel : code 1234,
  empreinte PBKDF2 100 000 it. conforme M-SÉCU, seedée hors ligne) · HTML exporté ouvert
  seul dans un onglet. Dans chacun : `layer-top` et `layer-after` calculés `absolute` sur
  chaque mot, et le **flux** (texte mesuré après retrait des éléments absolus) ne contient
  plus ni correction, ni badge, ni point.
- **Les cinq modes** passés un à un : conformes.
- Copie **sans faute** (DURAND Alice) : flux strictement égal au texte de la dictée.
- Copie **longue** : 3 paragraphes, 108 tokens.
- Hub intercepté : SDK Firebase factice en mémoire, journal des écritures fourni —
  **aucune requête vers le hub réel, aucune écriture réelle** (les seules écritures du
  journal sont celles que l'app tente normalement : manifeste, copyOptions — absorbées).

---

## ② L'APERÇU À DROITE

### Ce que l'historique dit — dit franchement
J'ai relu l'historique GitHub du fichier (22 mai `5a38203c`, 12 juin, 14 juillet,
18 juillet) : **l'onglet Copies n'a jamais eu d'aperçu à droite** — il a toujours été
vertical (options en haut, copie tout en bas). Le souvenir de Paul renvoie au patron des
éditeurs du site (« exactement comme l'éditeur de chapitre et de doc »). Je n'ai donc rien
pu reprendre du fichier lui-même ; j'ai construit sur le patron qu'il décrit.

### Ce qui est construit
- **Deux colonnes** dès qu'un élève est sélectionné : à gauche tout le travail (choix de
  l'élève, mode, annotations, publication, bilan, transcriptions) ; à droite **la copie de
  l'élève, collante à l'écran** (`position:sticky`) pendant que la gauche défile. Sous
  1 100 px : retour à une colonne (passe mobile préservée).
- **Un seul point de rendu** : `renderApercu()`, appelé après chaque rendu React.
  Changement d'élève → document réécrit. Même élève → **diff minimal** : la classe du
  `body` porte mode et annotations (cocher/décocher = un changement de classe, zéro
  reconstruction) ; les sections de la copie (texte, bilan, analyse…) ne sont remplacées
  que si elles diffèrent. **La position de lecture ne saute jamais** — mesuré : décocher
  « Points perdus » → 8 points visibles → 0, marqueur posé dans l'iframe conservé (pas de
  rechargement), `scrollTop` 300 intact ; recocher → retour à 8, position intacte.
- L'aperçu reste visible aussi pendant l'édition des transcriptions (avant, il
  disparaissait en mode édition) : Paul voit la transcription apparaître dans la copie.
- L'iframe passe de `srcDoc` (rechargement à chaque rendu) à une iframe pilotée
  (`sandbox="allow-same-origin"`, sans scripts — contenu généré par l'app elle-même).
  La modale « Prévisualiser toutes » et la copie élève sont inchangées.

---

## INTOUCHÉS — vérifiés
Données élèves et corrections enregistrées · scores et points (barème et `computeNote`
intacts ; la note 13,5/20 du banc recoupe le calcul) · portail d'identification (traversé
tel quel au banc) · aucune écriture nouvelle au hub (le journal du banc fait foi) ·
contrat de purge inchangé.

## RÈGLES DE LIVRAISON — preuves
- Fichier relu en entier (zones du diff parcourues une à une, coutures relues).
- **0 fonction supprimée** : 269 fonctions avant, 270 après (ajout : `renderApercu`).
- Tailles des fonctions modifiées :
  - `buildCopieHtml` : 18 379 → 19 306 o (normalisation du mode, couche P, layer-after
    recentré sur type+points, CSS des couches, espacement extras)
  - `Copies` : 33 219 → 35 194 o (deux colonnes, `renderApercu`, aperçu déplacé à droite)
  - `genererDonneesTest` : 2 916 → 2 914 o (mode « complet » → « barre »)
  - Fichier : 586 505 → 589 922 o.
- Captures examinées avant livraison :
  - `ctx1_deux_colonnes.png` — copie corrigée à l'écran, deux colonnes
  - `ctx2_export_seul.png` — la même copie exportée, ouverte seule
  - `ctx1_points_decoches.png` — l'aperçu à droite pendant qu'on décoche (position tenue)
  - `ctx1_sans_faute.png`, `ctx3_modale_eleve.png` — cas complémentaires
  (Polices Google coupées au banc — réseau isolé — d'où la serif de repli sur les captures ;
  en production EB Garamond se charge normalement, la règle `font-family` est inchangée.)

## TEXTES FRANÇAIS SOUMIS À PAUL
1. Étiquette du mode par défaut : « Souligné » → **« Barré »** (le mot de l'élève est
   désormais barré, comme sur une copie papier).
2. Infobulle de l'aperçu : « L'aperçu suit tout ce que tu changes à gauche (mode,
   annotations, bilan, transcriptions), avec le bilan en cours d'édition même non validé. »
3. Proposition d'annonce élèves (à valider — la copie change ce que les élèves voient) :
   « Vos copies de dictée sont plus lisibles : le mot juste est écrit au-dessus du mot
   barré, et le type de faute est noté dessous. Rien ne change à vos notes. »

## SPEC VIVANTE — restes et dettes
1. **À éprouver en classe par Paul** : rendu des copies du brevet blanc (données réelles),
   notamment les très longues corrections au-dessus de mots courts (le `max-width:150%`
   du layer-top tronque-t-il bien sans chevaucher ?).
2. Dette héritée signalée, non traitée (hors périmètre) : `correction_dictee` peut écraser
   le champ `niveau` de `/classes` (dette QCM connue, option B préférée).
3. Dette signalée : la modale « Prévisualiser toutes » recharge son iframe à chaque toggle
   (srcDoc) — acceptable en usage feuilletage ; à aligner sur l'iframe pilotée si Paul le
   demande.
4. Chantiers suivants du circuit (mémo) : M14bis, extraction « Banque d'exercices ».
