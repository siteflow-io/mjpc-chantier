# LE RECYCLAGE — ce que l'ancien déroulé savait faire, ce que la maquette ne fait pas, et qui doit être repris

*Conscience n°13, 21/10/2026, 09:00 → 09:40. Question de Paul (08:49) : « as-tu mesuré les fonctionnalités de l'ancien déroulé qui n'étaient pas intégrées dans le nouveau et qu'il faudra bien sûr recycler ? Afin que le travail ne soit pas perdu, POUR CE QUI MARCHAIT ». Réponse honnête : avant ce matin, non — le plan listait ce qui tombe par fonction (§4), pas par geste. Voici la mesure, faite maintenant.*

## Comment c'est mesuré
- **L'ancien déroulé** = le moteur `deroule86` (`DEROULE/deroule86.html`, 157 fonctions) + le pont et la session du site (`_dr*`, `atDr*`, `atVecu*`, `atT5*`, `ses*`). Inventaire **par le geste visible** : les boutons et leurs infobulles (`<button … title>`), les menus contextuels, les raccourcis clavier, les onglets, les champs — puis les fonctions derrière.
- **La maquette p8-5g** : recherche de chaque geste (mot, identifiant, fonction) dans son code ; « repris » = le geste existe (même s'il a changé de forme) ; « pas repris » = rien ne le fait.
- **« Marchait »** = aucune dette ouverte dessus au registre `docs/MJPC6-DETTES.md` et le geste joue dans la production d'hier (parcours T72). Ce que je ne peux pas savoir : si Paul s'en servait. Il raye ce qu'il ne veut pas.
- **Limite** : les 157 fonctions n'ont pas été relues une à une ; les gestes sans bouton (un double-clic, une touche dans un champ) peuvent manquer. **C'est la mission 0 d'E1** (contrat §11) : relire les 157 fonctions et compléter ce tableau.

## A · Ce que la maquette a REPRIS (rien à faire, les mandats le couvrent)
▶ / ◀ dévoiler-replier · ❄ Gel · ✦ Mettre en lumière · ✍🏻 À écrire (marquer un objet que les élèves écrivent) · surligner en quatre couleurs + retirer (Ctrl+H) · gras / souligné (les boutons G, S — p8-5c, K3) · la loupe, l'image pleine · la fiche dans l'écran (ouvrir, refermer, la page de fiche) · les schémas (frise, arbre, cycle, grille, carte) · + Consigne / Fiche / Question / Schéma / Image (le choix d'objet) · copier / couper / coller un bloc (presse-papiers, « Coller ici ») · dupliquer, insérer un écran après, monter, descendre, supprimer, couper ici, envoyer vers une séance (menu de la diapo) · réordonner (poignée) · 👥 Qui a participé · le VIF (F2 : initiales, 1/2/3, note) et la palette (Maj+Espace) — **repris tels quels du pont** (mêmes identifiants `vif-*`) · le chrono de l'heure et « Chrono au tableau » (menu ⋯, en bandeau) · la T-5 et les décisions sur les activités (à l'heure suivante · à la maison · en réserve · non fait = reporter · maison · annuler · rien) · les notions qui ne seront pas travaillées (une ligne) · l'appoint (notion imprévue) · le récit, le relire (= « Le figer pour le corriger » / « Revenir au récit automatique » → les versions ↶ ↷) · « Copier pour École Directe » · « travail à faire » · le tableau (⧉, Écran 2) avec le gel, les pages, la police.
Côté site, repris par le contrat : la copie jouée par classe, le paquet de l'heure, `cours_actif`, la clôture certaine, la reprise, l'emploi du temps comme porte, la colonne du chapitre, le QR, le tableau distant (`?vue=tableau`), la garde lecture seule, le bandeau ● session.

## B · Ce que la maquette NE FAIT PAS et qui marchait — À RECYCLER (ajouté aux mandats)

| | le geste de l'ancien | où il vit dans l'ancien | dans la maquette | marchait ? | recyclé par |
|---|---|---|---|---|---|
| R1 | **Les marques sur une image** : un bloc image est « Document analysé » (on pose des marques dessus : numéros, zones) ou « Illustration » ; les marques se dévoilent « une à une » ou « toutes ensemble » ; poser, éditer, supprimer une marque ; le calibrage à la taille | moteur : `b.marques`, `b.support`, `armeMk`, `editeMarque`, `supMk`, `calibreMarques`, `prendreImage`, `setSupport`, `setDev` | le bloc image existe (légende, `support`), le formulaire d'objet annonce « des marques », **mais aucun code ne les pose ni ne les rend** | oui (aucune dette) | **E1** (le rendu au socle, les gestes dans l'Atelier) ; **E3** les rend au tableau par le même rendu |
| R2 | **Le rappel d'une fiche** : quand une fiche déjà posée revient, « Pourquoi ce rappel ? » — pour réviser avant l'évaluation · parce que la notion n'était pas acquise · parce qu'on en a besoin pour la suite · pour les absents · ou dit autrement — **visible par les élèves dans le récit** ; `memeFeuille` (deux homonymes ne sont pas la même fiche), `dejaPosee` | moteur : `ouvrirRappel`, `poseRappel`, `MOTIFS_RAPPEL`, `b.rappel`, `memeFeuille`, `dejaPosee` | non (`proposerRemob` est autre chose : proposer des notions à remobiliser) | oui | **E1** (le geste dans l'Atelier, `b.rappel` dans le bloc) ; **E4** (la phrase dans le récit et le papier) |
| R3 | **Le minuteur d'activité** : mm:ss, « Départ », compte à rebours affiché au pilote et **au tableau** (« Chrono au tableau ») — pour « Étape 1 : j'observe en silence (5 min) » | moteur : `regleChrono`, `chrono`, `#cmin`, `#csec`, `#bchr`, `#bmon` ; la scène le transporte (`chrono`) | non : le « chrono » de la maquette est l'heure écoulée ; « Chrono au tableau » publie ce chrono-là, pas un compte à rebours | oui | **E2** (le geste au pilote), **E3** (au tableau, dans `et`) |
| R4 | **↶ Annuler (Ctrl+Z) dans la préparation** : revenir en arrière sur une modification de la trame (bloc supprimé, texte, ordre) — une pile d'états | moteur : `annuler`, `pile`, `sauve` | non : Ctrl+Z n'annule que la dernière parole/note/appel, et les versions du récit | oui | **E1** |
| R5 | **La sélection multiple** dans la préparation : plusieurs éléments à la fois → « Supprimer les N éléments », « Marquer à écrire », copier, « Annuler la sélection » | moteur : `SEL`, `selSup`, `selEcrire`, `selCopie`, `selVide` | non | oui | **E1** (après R1-R4 ; Paul raye s'il ne s'en sert pas) |
| R6 | **Les raccourcis Ctrl+B / Ctrl+U** (gras, souligné au clavier, en plus des boutons) | moteur : `touche` | les boutons G, S existent ; pas les raccourcis | oui | **E1** (une ligne) |
| R7 | **« Où on en est »** : la liste des activités de l'heure avec, pour chacune, « dévoilés / total » (3/8), la pastille de l'activité en cours, et les durées prévues/réelles | pont : `atVecu*`, `AT_DR_VECU`, `atVecuAfficher` (colonne de droite, T72-EX-05) | partiel : le compteur « HEURE 1 · 9 DIAPOS », les vignettes, les durées par diapo ; **pas le x/y par activité ni le réel/prévu** | oui | **E2** (dans la colonne de droite de la maquette, à partir de `J`) |
| R8 | **Le temps utile** : « 50 min utiles (fin − 5 min d'agenda) », le début proposé (`atDebutPropose`, « maintenant »), l'avertissement « ce début ne laisse aucun temps utile » | pont : `atTempsUtile`, `atDebutPropose`, `atDrMajUtile`, `atDrJouerClic` (la garde) | partiel : `heureCahier()` = fin − 5 min existe ; pas l'affichage du temps utile au lancement ni la garde | oui | **E2** (dans `dr_lancer` et l'entête) |
| R9 | **« déroulé intègre · bit pour bit »** : l'empreinte de la copie jouée comparée à ce qui est au hub, affichée dans l'entête (témoin d'intégrité) | pont : `_drEmpreinteTrame`, `_drVerifier`, « déroulé intègre » (T72-EX-05) | non | oui | **E2** (un témoin dans l'entête, calculé sur `C/ecrans` après chaque `dr_sauve`) |
| R10 | **Le téléphone** (`?vue=tel`) : cran de zoom à distance, chrono, +1 participation, le curseur | session : `sesTel*` (14 fonctions) | non | oui (aucune dette ouverte) | **tombe par le cadrage** (C1 §13) — à refaire plus tard (point 22 du POINT), pas dans ce mandat ; **rien n'est perdu** : le code reste dans l'historique de la production |
| R11 | **Le zoom / la scission / les suites / la réabsorption** (LOT G, « Tout replier dans l'écran d'origine ») | moteur : `zoom`, `scinde`, `degorge`, `reabsorbe`, `supprimeSuite` ; pont : `_drRefusionner`… | non — remplacé par les **pages** (p8-5f) | **non** : dette LOT G (registre, « s'il faut refaire le moteur, il faut »), c'est précisément ce que les pages règlent | tombe, voulu |
| R12 | **Les onglets du moteur** « Sommaire » et « Documents » | moteur : `ong` | — | oui | couverts : Sommaire = la colonne du site (contrat §8.3), Documents = Structure (cadrage n°7) |

## B bis · Ajouts des exécutants (mission 0, 21/10) — attribués au réveil n°2
| | le geste | où dans `deroule97` | recyclé par |
|---|---|---|---|
| R13 | **G et S** (gras, souligné) — la table A les disait « repris » : **faux**, la maquette n'a que la couleur et le surligneur | `forme`, boutons | E1 |
| R14 | **la fiche ouverte se pilote comme une diapo** (▶ bloc à bloc, ✍🏻, annotée par la classe, « tu la prépares — la classe ne la voit pas encore ») | `rendre`, `elems`, `marqueFiche`, `corpsFiche`, `envoie` | E1 (couche commune), E3 (au tableau) |
| R15 | **le récit cite le surligné et le recopié** (« où on a surligné « … » », « On a recopié dans le cahier : … ») | `citations`, `lisible`, `majVues` | E4 |
| R16 | **le Papier = le récit + chaque fiche annotée, « à coller dans le cahier »**, une page A4 chacune | `majVues` | E4 |
| R17 | **Ctrl/Cmd+V colle les blocs copiés** | keydown | E1 |
| R18 | **Ctrl+H bascule** (retire le surlignage sur un passage surligné) | `forme`, `dansSurligne` | E1 |
| R19 | **⌫ = ◀ replier** au pilotage | keydown | E2 |
| R20 | **les raccourcis avec Cmd (Mac)** | keydown | E1 |
| R21 | **changer l'adresse d'une image posée**, « image absente de mjpc-medias · ref » | `reglages`, `setRef`, `urlMedia` | E1 |
| R22 | **la copie pour École Directe en HTML propre** (`text/html` + `text/plain`) | `copierED` | E4 |
Corrections de la table B par les audits : R6 vit dans le keydown, pas dans `touche` ; R3 : le « Chrono au tableau » de la maquette est un bandeau figé « ⏱ 07:00 » ; R11 : la réglette de taille (`zoom`) est reprise, seule la réabsorption des suites tombe. Attribution finale : R1, R2, R4, R5, R6 → E4 (`dr-recyclage.js`, mission E4-2).

## C · Ce qui est à Paul
- Rayer dans B ce dont il ne se sert pas (R5, R6 sont les candidats).
- Dire si R3 (le minuteur d'activité) doit aussi s'écrire dans le récit (« 5 min de silence, montre en main ») — ma proposition : oui, une ligne dans `J` (`journal('minuteur')`).

MEMO
