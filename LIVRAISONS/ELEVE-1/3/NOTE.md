# ELEVE-1 · LIVRAISON ③ — la fiche élève et le rappel des équipes éducatives

*Exécutante : l'instance relectrice (mandat « L'ÉLÈVE — 1 » v4). 01/10/2026. Rien n'est promu : la livraison attend l'audit de la conscience puis ton « promeus ».*

## Ce que ça change pour toi
- **La fiche élève** (capture T284-e2) : dans « Élèves & codes », un clic sur un nom ouvre sa fiche — la première page de son profil (« Historique et progression de l'élève » est réservé dessous, dans l'année seulement). En tête : « ◆ NOM Prénom — classe », né le …, le **sexe** (F / M : un clic l'enregistre aussitôt, sans ta clé — il n'est pas chiffré ; c'est lui que le QCM lit), le **dispositif** (oui / non), « cases cochées le … », le cadenas. Puis **les quinze lignes de la fiche PAP, mot pour mot**, en deux blocs, une case et une remarque par ligne, et la synthèse. « Ce que les apps liront : dictée aménagée oui/non, sexe — jamais la fiche. »
- **« Enregistrer la fiche »** : ta clé est nécessaire (sa propre fenêtre, pas celle des codes) ; il chiffre et écrit le dispositif, les cases, les remarques, la synthèse et la date du jour ; il publie pour les apps « dictée aménagée » (la case pap-15) ; le nombre de dispositifs de la classe suit le oui/non.
- **Sans ta clé**, la fiche s'ouvre quand même : le sexe se règle, le reste dit « saisis ta clé » (l'encart de la clé est en haut de la fiche).
- **Ce que tu tapes n'est jamais effacé par un redessin** (prouvé au banc).
- **Avec ta clé, ◆ à côté des élèves à dispositif** dans la liste de la classe.
- **Le rappel des équipes éducatives** (capture T284-e4), sur la page des classes : la date de l'ESS du niveau lue dans le calendrier annuel (la première s'il y en a plusieurs) ; du 1er au 21 septembre, la ligne avec la date ; la veille « c'est demain » ; le jour « aujourd'hui » ; ensuite « les cases de … sont-elles à jour ? » jusqu'à ce que chaque fiche soit cochée après l'ESS. Avec ta clé : une ligne par élève fléché et la date de ses cases ; sans ta clé : le nombre seul et « saisis ta clé pour ouvrir leurs fiches ». La marge « lu dans le calendrier annuel : … » ; « rien à signaler » pour une classe sans fléché ; le bouton « Ouvrir les fiches ». **Dans l'emploi du temps**, la case de la première heure de la classe dans la semaine porte un nombre (« 🗂 1 fléché · cases PAP (ESS 15/09) »), jamais un nom.
- **Chez toi, dès la promotion** : tes ESS de 3e (08/09) et de 4e (15/09) sont passées ; pour tes classes qui ont des élèves fléchés, le rappel dira « les cases … sont-elles à jour ? » jusqu'à ce que tu enregistres leurs fiches.

## Le fichier
- `index.html` : base **8.74.0-② promue** (1 813 946 o, md5 `80d454863a1b1ae4a741222b7cfdf1eb`, vérifiée à la commande) → **8.74.0-③** : **1,838,175 o** (+24,229), md5 `ac792b28f40d3a0510e725fc4a6b6985`.
- Ajouté (bloc `[ELEVE-1 ③]`, préfixe `elf` vérifié libre : 0 `elf…`, `_elf…`, `ELF…`, `elf-` dans la base) : `ELF_PAP` (les quinze libellés), `ELF`, `ELF_FLECHES`, `elfOuvrir`, `elfFermer`, `elfProfil`, `elfLire`, `elfRedessiner`, `elfFicheHtml`, `elfCase`, `elfRemarque`, `elfSynthese`, `elfDispositif`, `elfSexe`, `elfEnregistrer`, `elfChargerFleches`, `elfMarquerListe`, `elfNiveau`, `elfEssDuNiveau`, `elfRappel`, `elfRappelClasseHtml`, `elfOuvrirClasse`, `elfPreparerRappels`, `elfSlugCellule`, `elfPremieresCases`, `elfRappelCaseHtml` (+ petites aides de date) ; les styles `elf-*`.
- Modifié (avant → après) : `_profSectionEleves` 3,813 → 4,361 · `_profSectionClasses` 3,507 → 3,696 · `edtPeindreSemaine` 2,123 → 2,310 · `eliFini` 899 → 960 · `_deleteEleveCls` 1,690 → 1,715 ; le commentaire de feuille de route « PROFIL ÉLÈVE » pointe vers la fiche (le modèle multi-années marqué « non ouvert, par choix — 1.7 »).
- **Les places réservées**, localisées et citées : le commentaire « TODO: PROFIL ÉLÈVE — suivi longitudinal » (feuille de route, l. ~1728 de la base) — réécrit pour dire que sa première page existe ; la composante d'atelier `place_agregats` « Historique et progression de l'élève » (l. ~7462, réservée aux feuilles) — non touchée ; son intitulé est repris, réservé, sous la fiche.
- Syntaxe : 2 blocs, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.
- Écart avec la capture T284-e2, voulu par le mandat : les libellés sont ceux de la fiche PAP mot pour mot (la capture les abrégeait) ; le sexe et le dispositif se choisissent (la capture les affichait).

## Les bancs (`bancs/`) — par le geste, en mode test, hub SIMULÉ, données `ZZTEST`
Page servie en local (contexte sûr pour le chiffrement). Hors geste, déclaré : l'identité prof (session) ; **l'horloge du banc posée** (10/09, 14/09, 15/09, 16/09, 20/10 — jamais celle du conteneur) ; la **lecture** du magasin et le déchiffrement avec la clé de test pour prouver ce qui est écrit ; **la case de l'heure prouvée par la fonction** (`elfPremieresCases`, `elfRappelCaseHtml`) sur des cases fictives — l'emploi du temps complet n'est pas reconstitué au banc. Calendrier d'essai : ESS de 4e le 15/09 et le 22/09 (la 1re retenue), une ligne « Equipe éduc. N.Laury … 5e ».
Une erreur trouvée par le banc et corrigée avant la livraison : la page des classes se redessinait sans fin quand rien de neuf n'était à lire.
**Banc unique `banc_unique_3.py` : VERT, {nok} vérifications, 0 échec** (`sortie_banc_unique_3.txt`) — dont : 10/09 « ESS de la 4e : mardi 15/09 », Bruno nommé « jamais cochées », la marge lit la 1re date ; la 3e sans ESS : la ligne de septembre ; la 5e : « rien à signaler » ; 14/09 « c'est demain » ; 15/09 « aujourd'hui » ; 16/09 « les cases de 4 ZZTEST sont-elles à jour ? » ; la fiche de Bruno (◆, né le 27/09/2013, dispositif oui, « jamais ») ; un redessin pendant la saisie n'efface rien ; enregistrée : cases [pap-03, pap-15], remarque et synthèse chiffrées, majLe 2026-09-16, « dictée aménagée » pour les apps ; rouverte : tout revient ; Anna non → oui : le compte 1 → 2 ; Clara : sexe M aussitôt (fiche et apps) ; ◆ à côté d'Anna et Bruno ; les deux fiches cochées après l'ESS : le rappel s'éteint ; 20/10 : plus rien pour la 3e ; la case de l'heure : « 1 fléché · cases PAP (ESS 15/09) », aucun nom ; 390 et 360 px : « Enregistrer la fiche » visible ; sans clé : rappel au nombre, fiche ouverte, cases inactives, la fenêtre de la clé, le sexe écrit quand même ; **0 écriture vers la base, 0 erreur** ; vue élève inchangée (pastille seule) ; vrai hub inchangé pendant le banc.

## Infobulles ajoutées (pour toi)
le nom dans la liste (« Ouvre la fiche de l'élève : sexe, dispositif, cases PAP. Rien n'est écrit tant que tu n'enregistres pas. ») · le sexe (« … Un clic l'enregistre aussitôt, sans ta clé : il n'est pas chiffré. ») · le dispositif (« … Le choix s'écrit quand tu enregistres la fiche ; le nombre de la classe suit. ») · « Enregistrer la fiche » (« Chiffre avec ta clé et écrit … Ta clé est nécessaire. ») · « Fermer » et le retour (« Ce qui n'est pas enregistré est perdu. ») · « Ouvrir les fiches » · la case de l'heure (« Rappel des équipes éducatives … (Panneau prof → Classes) ») · la place réservée.

## Attendus hub (après tes fiches)
`/classes/<slug>/profils/<clé>` : `dispositif`, `pap`, `remarques`, `synthese` = « v1.… » (chiffrés), `majLe` = « 2026-10-01 » ; `/classes/<slug>/amenagements/<clé>` : `sexe`, `dicteeAmenagee` true/false ; `/classes/<slug>/nbDispositifs` suit.

## Captures (`captures/`)
Pour toi, légendées : `T1-avant.png` / `T2-apres.png` (la page des classes le 16/09 : rien / le rappel) ; `T3-fiche-haut.png`, `T4-fiche-bas.png` (la fiche enregistrée) ; `T5-sans-cle.png`. Pour l'audit : `el-classes-*` (10/09, 16/09 avec et sans clé, éteint), `el-fiche-*` (vide, remplie, sans clé, 390 px, 360 px), vues élève.

## Tes tests, geste par geste, après promotion
1. Ouvre https://siteflow-io.github.io/monsieurjaipascompris/?n=3e&v=8.74.0 : pastille **V8.74.0-③**.
2. Panneau prof → Classes : pour tes classes qui ont des élèves fléchés, « ESS de la … — les cases … sont-elles à jour ? » (sans ta clé : le nombre ; avec ta clé : les noms).
3. Élèves & codes → saisis ta clé → une de tes classes : ◆ à côté des élèves à dispositif → clique sur un nom : sa fiche.
4. Coche ses cases PAP, une remarque, la synthèse → « Enregistrer la fiche » → « Fiche enregistrée — cases cochées le 01/10/2026 ». Ferme, rouvre : tout est là.
5. Le sexe d'un élève qui n'en a pas : clique F ou M dans sa fiche.
6. Quand toutes les fiches fléchées d'une classe sont enregistrées : Classes → son rappel s'est éteint.
7. Emploi du temps (semaine) : la première heure de chaque classe qui a des fiches à mettre à jour porte « 🗂 n fléchés · cases PAP (ESS …) ».
