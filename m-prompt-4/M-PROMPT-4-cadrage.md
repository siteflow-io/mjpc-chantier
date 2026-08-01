# M-PROMPT-4 — CADRAGE (exécutant → conscience)
**01/08 · j'attends le feu vert**

## Lu (md5 mesurés)
**`MJPC6-plan-de-travail.md` 24 307 o · `ff138159edf2102ace731c582d8d6d9b`** (l'index, relu en prise de fonction) · **DISPOSITIF `3615782428d3a24962d4b4a74d8a8a83`** · DOCTRINE `c92d863d0fad9714a756d5552c97f3be` · doctrine du site `bbc34f10fd772eb16b0268cafaebe3f5` · **CHANTIER `971cab0976b7a3f46a7b31743fe2b28f`** · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · **journal `add0bb94ddbc34df5fd0a745fcb25936`** · canon **`d89d456389f598c7a731cf894a60a4cb` (1.4.0)**.
Bases : `index` 655 836 `2849b680…` (8.13.0) · `correction_dictee` 577 012 `9b700154…` · `worktrack` 1 048 372 `2518f616…` · `dictee_universelle` 1 985 615 `dfee9df9…` · `pilotage_debat_s3` 479 275 `8d33882e…` · `evaluation-qcm` 534 063 `7cec4f78…` · `analyse_logique` 568 116 `90b8401a…` · `applause_meter` 651 889 `4b1c6bdf…`.

## LA MESURE DU DÉFAUT — **12 prompts sur 12, zéro mention**
| prompt | taille | « MJPC » |
|---|---|---|
| index · chapitre | 3 703 c. | **0** |
| index · fiche_seance | 2 736 c. | **0** |
| index · diaporama | 2 649 c. | **0** |
| correction_dictee · banque / directives / format | 2 217 / 2 117 / 3 676 c. | **0 / 0 / 0** |
| worktrack · chapitre | 14 974 c. | **0** |
| dictee_universelle · analyse | 252 c. | **0** |
| evaluation-qcm | 3 349 c. | **0** |
| applause_meter · critères | 208 c. | **0** |
| analyse_logique · corrigé | 319 c. | **0** |
| pilotage_debat_s3 · documents | 7 168 c. | **0** |
**Le mandat annonçait « très probablement » pour les apps : c'est vérifié, et c'est total.** (Un premier comptage m'a donné des tailles impossibles — 152 236 c. pour un prompt : ma borne de regex débordait sur le code suivant. Remesuré déclaration par déclaration ; les chiffres ci-dessus sont les bons, et `PROMPT_CHAPTER` retombe sur ses 14 974 c. connus, ce qui valide la méthode.)

## D'où je génère la liste des outils
**Deux sources croisées, mesurées** :
① **ce qui est RÉELLEMENT reliable à une séance** — les **9 branches de `openItem`** (`dictee`, `reecriture`, `qcm`, `debat`, `analyse_logique`, `applaudimetre`, `worktrack`, `tache`, `diaporama`, plus `gallery` sans source) et `CH_KINDS` (7 valeurs) ;
② **`/manifestes` au hub — 11 entrées** avec `app.id`, `app.nom`, `app.contenant` (`index`, `taxonomie` et les 9 apps).
**Ce que je retiens, et pourquoi** : la liste est **générée depuis les identifiants** (branches + manifestes), et **chaque identifiant reçoit sa phrase d'usage** depuis une table `MJPC_OUTILS` au canon. Une phrase d'usage ne peut pas se déduire d'un manifeste — *« je dicte, l'élève écrit sur son appareil, il s'autocorrige mot à mot »* ne s'invente pas depuis `{id, nom, noeuds}`. **Mais le mécanisme empêche la liste de mentir** : un identifiant branché qui n'a pas de phrase **paraît quand même**, suivi de « (description à écrire) ». Ainsi une app nouvelle ne peut pas disparaître silencieusement — c'est le mécanisme d'oubli que le chantier a payé plusieurs fois. Preuve par élément factice au rapport.

## Le poids, chiffré — **et un dosage argumenté**
La présentation complète pèse **≈ 2 350 caractères** (mesuré sur le texte ci-dessous, liste d'outils comprise). Ajoutée telle quelle :
| prompt | avant | après | écart |
|---|---|---|---|
| worktrack | 14 974 | 17 324 | +16 % |
| index · chapitre (+ taxonomie) | 14 346 | 16 696 | +16 % |
| pilotage · documents | 7 168 | 9 518 | +33 % |
| evaluation-qcm | 3 349 | 5 699 | +70 % |
| index · fiche_seance | 2 736 | 5 086 | +86 % |
| **applause_meter** | **208** | **2 558** | **+1 130 %** |
| **analyse_logique** | **319** | **2 669** | **+736 %** |
| **dictee_universelle** | **252** | **2 602** | **+933 %** |
**Je propose deux formes, et je les nomme** : **le tronc complet** (≈2 350 c.) dans `index.html` (chapitre, fiche de séance, diaporama) — c'est là que l'IA conçoit, c'est là qu'elle a besoin de tout savoir ; **une forme brève** (≈650 c. : où ça atterrit, qui publie, le principe cardinal, et « demande-moi la liste des outils si tu as besoin de conseiller ») dans les **sept apps**, dont les prompts sont très ciblés (transcrire une analyse, produire des critères). Motif : dans `applause_meter`, un tronc de 2 350 c. **noierait** un prompt de 208 c. qui ne demande que six critères — l'IA passerait plus de temps à lire le contexte qu'à faire le travail. **Rien n'est tronqué en silence : les deux formes sont écrites, nommées, et le rapport dit laquelle va où.**

## LE TEXTE QUE JE PROPOSE (tronc complet — c'est Paul qui valide)
> **OÙ TON TRAVAIL ATTERRIT.** Tu travailles pour **MJPC (monsieurjaipascompris.fr)**, le site de cours d'un professeur de français en collège. Les élèves l'ouvrent surtout **sur leur téléphone**. Il est organisé en **niveaux → chapitres → séances → éléments**, et **chaque étage se publie séparément** : c'est **le professeur qui publie**, rien ne s'ouvre aux élèves sans son geste, et la classe avance au fil qu'il déroule.
> **LES OUTILS DONT IL DISPOSE** — quand tu proposes une activité, propose-la **avec ces outils-là**, jamais dans l'abstrait :
> [liste générée]
> **CE QUI COMMANDE.**
> · **Jamais le professeur n'est mis en cause devant l'élève.** Aucun texte destiné à un élève ne doit dire ou laisser entendre qu'il manque quelque chose de la part du professeur : pas de « ton professeur n'a pas encore… ». On écrit de façon impersonnelle : « ce code sera renouvelé en classe ».
> · **Le papier reste premier pour ce que l'élève produit** ; le numérique sert au retour, au suivi et à l'entraînement.
> · *« La mécanique me permet de développer l'humain »* : ce qui est répétitif se mécanise pour libérer du temps d'enseignement.
> · **C'est le professeur qui décide.** Tu proposes, tu signales, tu argumentes — **tu ne tranches pas**, et tu ne complètes jamais un manque en l'inventant sans le dire.
> **TU PEUX ÊTRE CONSULTÉ EN COURS DE ROUTE.** S'il te demande conseil — combler un trou de progression, choisir une activité, répartir un travail —, réponds **avec les outils ci-dessus** et **avec sa taxonomie**, en nommant ce qui existe déjà. Un conseil hors sol lui fait perdre du temps.

**La forme brève** (apps) : les deux premiers paragraphes réduits à trois phrases + le principe cardinal + « si tu dois me conseiller au-delà de cette tâche, demande-moi la liste de mes outils avant de proposer quoi que ce soit ».

## Ce que je touche, et les ancres
**9 fichiers** : `mjpc-core.js` (**1.4.0 → 1.5.0**, §12 : `MJPC_PRESENTATION`, `MJPC_PRESENTATION_BREVE`, `MJPC_OUTILS`, `mjpcPromptPresentation(source,options)`, et **`mjpcPromptComposer` place la pièce EN TÊTE**) · `index.html` (8.13.0 → 8.14.0) · les **7 apps** (pastilles +1 chacune). Ancres : **par contexte** (les marqueurs sont en double dans `index.html`) ; **le socle d'`index.html` n'est pas remplacé en bloc** — j'y **ajoute** la §12 modifiée par substitution ciblée des trois constantes, sans toucher au reste.
**LE POINT DU MANDAT QUE JE CONFIRME PAR LA MESURE** : les prompts édités par Paul sont **persistés en base** et lus par `mjpcPromptCharger`/`cdChargerPrompt`/etc. **La présentation est une PIÈCE DISTINCTE assemblée à la volée** — elle n'entre jamais dans le texte enregistré. **Un prompt déjà édité n'est donc pas écrasé** : il reçoit la présentation en tête au moment de la composition. Preuve au banc : un prompt « édité par Paul » en base, la présentation apparaît devant, **et le texte en base reste identique à l'octet**.

## Questions (2)
**Q1 — le dosage (tronc complet au site, forme brève aux apps)** : validé ? Ou tronc complet partout, au prix d'un prompt d'applaudimètre douze fois plus long que sa tâche ?
**Q2 — `MJPC_OUTILS` porte les phrases d'usage au CANON.** C'est du contenu pédagogique dans le socle technique, ce qui est inhabituel. L'alternative serait un nœud hub `/site/config/outils` éditable par Paul — mais alors le prompt dépend du réseau pour se composer, et une app hors ligne perdrait la liste. **Je propose le canon avec surcharge hub facultative** (le hub complète, le dur fait foi). Confirmes-tu ?
