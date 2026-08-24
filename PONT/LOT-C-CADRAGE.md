# LOT C — CADRAGE À FAIRE AVEC PAUL (consigné le 24/08/2026, conscience n°9)
STATUT : idée de Paul, retenue par lui, NON CODÉE. Ce document existe pour qu'elle ne se perde pas
(règle gravée : ce qui n'a pas de ligne écrite cesse d'exister).

## L'IDÉE, DANS SES MOTS (24/08)
« Est-ce que finalement tout l'attirail qui concerne le jeu d'une séance ne devrait pas être déplacé
dans le bouton de la vue du déroulé classe ? Non pas deux éditeurs à deux endroits, mais simplement
une vue propre au profil classe, indépendante VISUELLEMENT (et uniquement visuellement) de la
véritable édition (l'atelier). »

## MESURES FAITES AVANT SA DÉCISION (conscience n°9, sur la prod 8.60.0 — à re-vérifier au moment du lot)
1. LE CADRE EST DÉJÀ ADRESSABLE. Le déroulé vit dans un cadre indépendant repositionné en continu
   sur une ZONE D'ACCUEIL NOMMÉE (_drAfficher suit le rectangle de `at-dr-hote-zone`, requestAnimationFrame).
   Déplacer la vue = déplacer la zone. AUCUNE ligne du moteur à toucher. Coût du déplacement visuel : ~nul.
2. LA SÉPARATION PRÉPARATION / CLASSE EXISTE DÉJÀ dans le code (`AT_DR_REGIME` = 'prep' | 'classe',
   ~12 points de lecture). Elle n'a simplement AUCUNE traduction visuelle : les deux régimes cohabitent
   au même endroit. L'idée de Paul revient à donner à ce régime existant sa vue propre.
3. LE VERROU, ET IL EST UNIQUE : sur 66 fonctions du jeu (atDr*, ses*, atVecu*, atT5*), DOUZE lisent
   l'état de l'ÉDITEUR (`AT.edChap`, `ATVUES.snum`) pour savoir sur quelle séance elles agissent :
   atDrCloreFin · atDrJouer · atDrJouerClic · atDrModifsDeLaSeance · atDrMonter · atDrReprendre ·
   atDrTrame · atDrTrameEnregistrer · atVecuEcrire · sesCoursEcrire · sesReprendre · sesTelChercherCours.
   Elles ne fonctionnent que si l'éditeur est ouvert sur la bonne séance.
   LE REMPLACEMENT EXISTE DÉJÀ : le contexte de session (`AT_PONT.ctx` / `SES.ctx`) porte exactement
   level, chnum, snum, classe. Le travail = sevrer ces douze fonctions, une par une, avec preuve
   par fonction. RISQUE PRINCIPAL : une fonction qui garde son ancienne source écrira dans la MAUVAISE
   séance — défaut silencieux, même famille que le bug du 24/08.

## CE QUE LE LOT C DOIT PORTER ENSEMBLE (décision de Paul : cadrage commun)
- La VUE DU DÉROULÉ JOUÉ PAR CLASSE (profil de classe) — création. Sa matière est DÉJÀ au hub :
  `deroule_joue/<classe>` porte demarreLe, ecrans, part, scene, vecu (mesuré le 24/08).
- Le DÉPLACEMENT du jeu vers cette vue (les 12 fonctions ci-dessus).
- L'IDENTITÉ STABLE DES ÉCRANS (aujourd'hui aucun id : act, blocs, comp, dur). À poser au POINT DE
  PASSAGE UNIQUE du rendu (patron `idBloc` du moteur), jamais dans les 13 fonctions qui créent ou
  déplacent des écrans. PIÈGE NOMMÉ : `_drRefusionner` fusionne un écran de suite dans son parent —
  elle doit CONSERVER l'id du parent et JETER celui de la suite, sinon deux écrans partagent une identité.
- LE RATTACHEMENT DU VÉCU ET DE LA PARTICIPATION à ces identités. Aujourd'hui tout est par RANG :
  vecu.activites[].n · part[<initiales>][].ecran · scene.ecran · scene.fiche[n,j]. La scène circule
  entre les trois appareils : la bascule doit la traverser AUSSI, sinon téléphone et tableau parlent
  encore en rangs quand le reste parle en identités.

## RÉSERVE QUI FIXE L'ÉCHÉANCE (à ne pas laisser filer)
Tant que le vécu est indexé par rang, un vécu enregistré AVANT un changement de trame devient douteux
(les participations glissent d'un cran quand un écran est inséré). Sans conséquence pendant la phase
de données martyres (Paul purge et réinjecte). INACCEPTABLE avec de vrais élèves : un diagnostic de
compétence mal fondé est invisible et a l'autorité douce d'un graphique (doctrine, ⑦ du 14/07).
=> LE LOT C DOIT ÊTRE FAIT AVANT LA PREMIÈRE SÉANCE QUI COMPTE.

## CE QUI A ÉTÉ ÉCARTÉ, ET POURQUOI (ne pas rouvrir sans raison neuve)
- Les « sessions horodatées » au lancement (une session par jeu, au lieu d'écraser la copie) :
  proposées le 24/08 pour protéger un vécu existant. ÉCARTÉES par Paul le même jour : il purge et
  réinjecte, il n'y a rien à protéger. Le BESOIN reste (rejouer une séance avec la même classe,
  rattrapage, deux groupes) mais sa FORME se décide AVEC la vue — la coder avant serait à refaire.
