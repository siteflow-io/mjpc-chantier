# SITE-COURS-2e — RAPPORT D'EXÉCUTION : le chapitre déclare, et se résume
**02/08 · exécutant → conscience**

## 1. md5
plan de travail **`bb37732b810ef75498ae5210e3d9e860`** (avertissement lu en premier) · DISPOSITIF `448f754e6c39821cab742a4d66268bb9` · DOCTRINE `6918d27f3deb49dbc11083c9be127f79` · doctrine du site `bbc34f10fd772eb16b0268cafaebe3f5` · CHANTIER `aae67ef9209a5043811a7bacb07f488a` · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · journal `0ab22aa046f9b3bb8b2d41b414172b73` · canon `d9b40cc390a5034b294fbc8e31ca15cf` (1.5.0).
**Base re-téléchargée à l'instant de l'édition** : 663 038 o · `adb8623f19929e52f4862b3ea244ec87` (8.14.0) → **livré 679 981 o · `97bf48794e7dc4cd5821332ae467d9e6` · 8.15.0**.

## 2. ① LA RÉPARATION — prouvée au journal réseau
**AVANT** (grep dans la base) : `if(m.se.items&&m.se.items[k])return;   /* jamais un item existant */` — **un item déjà là ne recevait jamais ses notions**, et c'est le cas le plus fréquent.
**APRÈS** : les tags d'un item existant **s'ajoutent s'il n'en a pas**, par écriture ciblée `…/items/<k>/notions` et `…/competences` — **le reste de l'item n'est jamais touché** (prouvé : aucune écriture sur `…/items/<k>` entier).
**Relu au hub au banc** : `/site/3e/chapitres/1/seances/0/items/etude/notions` porte bien la notion.
**Ce qui reste volontaire, et je le dis pour que personne n'y voie un oubli** : sur une **séance** qui a déjà des tags, l'injection ne les écrase pas (`if((np.notions||[]).length && !(m.se.notions||[]).length)`). C'est « compléter ne touche à rien » appliqué à ce qui **est écrit** ; un champ **absent**, lui, se remplit.

## 3. ② LA DÉCLARATION DU CHAPITRE
Trois champs ajoutés, **aucun format existant ne change** : `entree`, `competencesMajeures` (**liste** — « une compétence majeure ou plusieurs, c'est MOI qui dit »), `competencesMineures`. Écrits **par les trois voies**, y compris « compléter » (sinon la déclaration n'aurait survécu qu'au remplacement).
**Les entrées** : 4e et 3e **arrêtées** (`recit`, `poesie`, `theatre`, + `discours_essai` / `articles_essai`). **6e et 5e restent OUVERTES**, avec le message *« la liste des entrées de ce niveau n'est pas encore arrêtée : ce que tu écriras sera accepté tel quel, et je te le redemanderai le jour où elle le sera »* — **aucun refus, aucune valeur inventée** : décision qui attend Paul.
**Le prompt fait PROPOSER, jamais trancher** : « tu me le PROPOSES, c'est MOI qui tranche », avec le fondement du programme cité (hiérarchiser majeures et mineures, équilibrer sur l'année, un projet = une compétence majoritaire).
**Validation** : entrée hors liste **nommée**, compétence inconnue **nommée**, et **une compétence à la fois majeure et mineure refusée** — les motifs **s'additionnent** à ceux de `chValiderChapitre` (max 8).

## 4. ③ L'ÉTAT DE L'ANNÉE — généré
`chEtatAnnee(chaps, niveau, taxo)` lit **la liste entière** des chapitres du niveau (là où `chInventaire` n'en regarde qu'un) et rend, par chapitre : rang, titre, **entrée**, **compétences majeures EN LIBELLÉ** (règle des deux publics). Il ajoute deux lignes de synthèse : **« Déjà majeures plusieurs fois : … »** (le matériau de l'alternance) et **« Entrées du programme pas encore abordées : … »**. Le **trou de liste** (`chapitres[0] === null`) est traversé.
**Preuve de génération** : un chapitre factice ajouté paraît, et la ligne des entrées manquantes se met à jour — aucune liste retouchée.
**Le prompt demande à l'IA de s'en servir** : proposer une alternance **fondée sur le poids des compétences, pas sur le type de séance** (« un atelier d'écriture reste possible au chapitre 2 — mais l'écriture n'y est plus majeure »), et **signaler les manques du quantitatif annuel** : 4 œuvres intégrales, 3 cursives, 2 groupements, une dizaine de notions littéraires. ⚠ **Le prompt dit explicitement : « je ne déclare nulle part mes œuvres ni mes cursives : DEMANDE-MOI le décompte, ne le devine pas. »**

## 5. ④ LE SOMMAIRE — calculé, suffisant, publiable, imprimable
`chSommaire()` **calcule** depuis le chapitre : entrée, majeures et mineures **en libellé**, **plan des séances** (titre + type), **notions rencontrées** (séances ET items, dédoublonnées), plus la **zone écrite** (`problematique`, `aRetenir`) pour ce qui ne se calcule pas. **Le sommaire ne se résume pas lui-même** (la séance de type `sommaire` est exclue du plan).
**Séance de rang 0 ordinaire** : `{title:"Sommaire du chapitre", type:"sommaire", ordre:0, items:{}}` — **elle porte des items comme les autres**, et **`published` n'est jamais écrit**.
**Proposé, coché par défaut, décochable** : l'aperçu du sommaire est montré **avant** l'écriture ; décoché, rien n'est écrit (prouvé).
**IL SE SUFFIT À LUI-MÊME** — critère vérifiable : *pouvoir dire ce que le chapitre a travaillé sans relire les séances*. `chSommaireSuffisant()` exige **titre + entrée + majeures + plan** ; s'il manque quelque chose, **l'écran le nomme** (« ⚠ Il manque à ce sommaire : … Il sera créé quand même, mais le chapitre suivant en saura moins »).

## 6. Les preuves
**Banc mémoire 19/19** : la réparation écrite et relue au hub · la déclaration écrite par « compléter » · le sommaire écrit / non écrit selon la case · l'état de l'année généré avec sa preuve par chapitre factice · le sommaire calculé exact et suffisant, et un sommaire pauvre qui **dit ce qui lui manque** · les refus nommés et accumulés · 6e/5e ouvertes sans refus · aucune écriture hors `/site/<niv>/chapitres` et `/corbeille`.
**Statique** : double parseur script par script **VERT** · **canon ↔ embarqué 35/35 à l'octet** · **0 fonction supprimée**, 6 modifiées (`atPromptTexte`, `chOuvrir`, `chRendre`, `chVerifier`, `chAfficherInventaire`, `chInjecterConfirme` — le périmètre exact), 11 ajoutées · **diff 14 hunks +260/−8**, les 8 retraits étant la pastille, les lignes d'ancrage recomposées et **la ligne « jamais un item existant »** qui est l'objet même de la réparation · **le socle n'a pas été touché** · ancre prise **par contexte** (le marqueur de fin existe en double : CSS @87157, JS @521350).

## 7. DÉCLARATION DE COUVERTURE
**Testé** : tout le §6, en mémoire, sur les fonctions extraites du fichier livré.
**NON TESTÉ, ET JE LE DIS SANS L'ATTÉNUER** : **le banc navigateur n'a pas été joué** — donc ni les fonctions vérifiées sur `window`, ni le mobile 390 px mesuré, ni **l'impression du sommaire**, ni les captures. Le CSS porte ses règles `@media print` (sommaire non coupé, case masquée) et `@media (max-width:480px)`, mais **rien n'est prouvé à l'écran**. **Le morceau ne doit pas être promu en l'état** : il lui manque sa preuve d'écran, exactement comme M-DOC-1 avant M-DOC-1b. Restent aussi non testés : le hub réel (aucune écriture réelle), une vraie IA, Chrome Windows.

## 8. Signalements
· **UNE SÉANCE DE POÉSIE N'A AUJOURD'HUI AUCUNE NOTION À PORTER** : la taxonomie ne couvre que la langue (orthographe, grammaire, conjugaison, lexique). Le pan littéraire n'existe pas — **mon morceau en révèle le manque** : un chapitre « Poésie » déclarera son entrée et ses compétences, mais ses séances resteront sans notions, et **l'aval lira ce vide**. Morceau à part, mais à instruire avant que le profil longitudinal ne s'en serve.
· **Le quantitatif annuel n'est pas mesurable** : rien ne déclare œuvres intégrales, cursives ni groupements. Un futur objet devra couvrir **les trois d'un coup**, sinon il naîtra incomplet.
· Les entrées de 6e et 5e attendent Paul.

## 9. Reste à faire
1. **Banc navigateur** : portées sur `window`, 390 px, **impression du sommaire**, captures (overlay des règles neutralisé) — avant promotion.
