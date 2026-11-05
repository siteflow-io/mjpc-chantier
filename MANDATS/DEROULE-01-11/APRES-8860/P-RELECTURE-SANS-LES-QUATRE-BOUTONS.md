# MANDAT P — LA RELECTURE SANS LES QUATRE BOUTONS DU TABLEAU ; LA VUE TABLEAU N'ÉCRIT RIEN (Paul, 05/11 07:35)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`. Base : sas `deroule/fermer-lancement` `1a60c142b` (la 8.86.0-⑲ en ligne + 721). Branche : `deroule/suite` (tu la crées depuis cette base ; les mandats Q et R la continueront). **20 minutes au plus.***

## 0 · CE QUE PAUL A DIT, ET CE QUE DIT LE SITE
- Paul, 05/11 07:35 (sa vidéo) : « je te montre les 4 boutons en haut à droite qui n'ont en fait rien à faire dans la relecture (la vue tableau, qui génère d'ailleurs peut-être une des prises du tableau? ) ».
- Le site, dans la fenêtre « Adresse du tableau » : « il attend le cours, puis suit ce que voit la classe. Il n'écrit jamais rien. »
- Mesuré par le mandat E (sas `nuit/e`) : le tableau distant, hors mode test, écrit 7 fois `/site/cle_vue` (dr-socle.js:1308), mis de côté par la sonde de session comme « préexistant ».

## 1 · CE QUE TU FAIS
1. Mesure d'abord, par le geste, au faux hub : ce que « Ce que voit la classe » ouvert dans la Relecture écrit au hub, et s'il prend ou change ce que suit le tableau distant ; ce qu'écrit la page du tableau (`?vue=tableau`), dans un cadre et seule ; ce qu'est `/site/cle_vue` et qui le lit.
2. Dans la Relecture, l'entête ne montre plus « Ce que voit la classe », « Ouvrir le tableau », « Adresse du tableau » ni « Fin de l'heure ». Au pilotage et dans l'atelier, rien ne change.
3. Si la page du tableau écrit au hub alors que rien ne lit ce qu'elle écrit, elle n'écrit plus rien (comme le dit le site) ; si quelque chose le lit, tu le dis et tu ne changes rien.

## 2 · LA PREUVE
Base → après, compté : les boutons dans l'entête de la Relecture (4 → 0), au pilotage et dans l'atelier (inchangés) ; les écritures de la page du tableau, seule et dans un cadre ; le parcours P0-P12 vert ; les sondes de la Relecture (`MESURE-RELECTURE/`, `RELECTURE-D/`) vertes, mises à jour dans ta branche si elles lisaient ces boutons.
