# RELECTURE DU MANDAT « L'ÉLÈVE » — instance relectrice, 30/09/2026

**À CORRIGER AVANT LANCEMENT**

*Objet relu : `MANDATS/MANDAT-ELEVE.md` (sas), md5 `d5cfbd4bb6103e1231533a0e59d439cb`, identique à la pièce T291. Heure vérifiée à deux sources (appareil de Paul 15:52, en-tête GitHub 13:52 UTC).*

**Couverture.** Lu en entier : le cadrage 6 ; le transcript C12, tours 268 → 292 ; `CLAUDE.md` ; `PROTOCOLE-MAQUETTE.md` ; `MJPC6-0-INDEX` ; `MJPC6-LECTURES` ; `OU-EST-CE-DEJA-ECRIT` ; `PASSATION-C9-C10-fautes` ; `PROTOCOLE-AJOUTS-25-08` ; `README` ; `LOT12/MANDAT.md` ; `REPRISE-MAQUETTE`.
Lu en partie : le dispositif (règles gravées, point 16, A0, principe cardinal, grille, addenda du 20/08 et du 25/08) ; la doctrine du site (IV, VIII) ; le cadrage 1 (§8, 11t.1, 2.5, §3, §6) ; le registre (n°12 · 76).
Mesuré dans le code : chaque ancrage cité par le mandat, dans `index.html`, `evaluation-qcm.html` et `correction_dictee.html`. Au hub : en lecture seule, sans aucune écriture.
Non lu, donc je ne sais pas : `MJPC6-2-DOCTRINE`, le journal, `OU-TROUVER-QUOI`, le plan, la restauration, les cadrages 2 à 4, les passations C5→C8 et C10-C11, `mjpc-core.js`, les captures T271, T283 et T284 hors `e4-rappel-dictee-zoom`.
Remarque sur le prompt de relecture : seul `LOT12` porte un `MANDAT.md` (LOT1 → LOT11 n'ont qu'un rapport) ; `LOT10` n'existe pas.

## A. Dérives

1. **Une mesure déléguée.** Le cadrage 1.3 et 5.1 disent « à mesurer avant tout mandat » ; le mandat (§0, ②) renvoie la mesure à l'exécutant. Mesuré ici : **le hub se lit sans aucune clé** (GET anonyme 200 sur `/`, `/classes`, `/codes`, `/eleves`, `/qcm/eleveSexes`). La décision 41 est à reposer (question 53).
2. **Pas de mise en tension avec la refonte du déroulé.** La décision du 07/09 le refait « depuis zéro », et le tour 281 laissait (e3) et (e4) « à trancher alors ». Les livraisons ④⑤ codent dans le moteur actuel sans le dire et sans inscrire le ◆ ni la pastille au chantier de la base saine : ils disparaîtront à la refonte (règle gravée du 29/07).
3. **Les captures validées ne sont pas citées** (T271, T273, T283, T284). La règle « Maquettes → mandat » et `PROTOCOLE-MAQUETTE` §0 veulent le code fidèle geste par geste à ce que Paul a vu. Correction : les lister, écran par écran, comme référence.
4. **Une promesse faite à Paul manque** (tour 285, point 70) : « le mandat le dira : la fiche élève est le profil longitudinal… ». Le titre « Fiche élève » et la prise de la place réservée « PROFIL ÉLÈVE — suivi longitudinal » sont absents de ③.
5. **② contredit le cadrage 2.4** (« jamais pap ni synthese à l'import ») : il écrit `pap: []` et `majLe: null` à chaque import. Un réimport effacerait les cases cochées par Paul.
6. **Une migration inventée et floue.** Au tour 283 (point 64, capture e1), la migration se fait « à la validation ». Le mandat invente un bouton dans Configuration, et écrit « le même bouton (ou un second) » : une catégorie molle.
7. **Le gabarit des lots n'est pas suivi** (faute ② de la n°9). Il manque :
   - le titre de la conversation ;
   - la base, avec taille et md5, et l'ordre « re-télécharge, vérifie, sinon STOP » (règle du 29/07) ;
   - la version livrée et l'incrément de pastille ;
   - le double parseur ;
   - la taille avant/après de chaque fonction modifiée (règle du 04/08) ;
   - « MJPC-CORE intouchable » ;
   - « termine par MEMO » ;
   - le point de retour tenu par la conscience.
8. **« Rien devant l'élève » (3.4 bis) sans preuve exigée.** Règle du 05/08 : un invariant non prouvé est un vœu. Aucun banc ni capture en vue élève n'est demandé. En ⑥, la ligne « PAP · pap-15 » et les cartes « aménagé » ne déclarent pas leur public.
9. **Pas de regard mobile** (règle gravée du 02/08 : 390 et 360 px), alors que la fiche des 15 lignes PAP est un cadre à hauteur bornée.
10. **§0 incomplet.** Il omet la doctrine du site (« obligatoire avant tout morceau touchant index.html », 0-INDEX), le registre des dettes et `OU-EST-CE-DEJA-ECRIT`.

## B. Ancrages faux

11. **« Toute écriture passe par les fonctions routées, jamais par un fetch direct » : faux.**
    - `mjpcFetchOk` (l. 13585) fait un `fetch` direct, sans passer par le mode test ; `_fbPutPath` et `_fbDeletePath` (l. 5797-5803) l'utilisent, donc `_corbeillePut` (l. 5949), `_purgeExec` (l. ~6064) et `ensureEleveUuid` (l. 4854).
    - Le cadrage 1 · 11t.1 ajoute que le cours actif et la scène du tableau distant partent au vrai hub en mode test.

    Conséquence : les bancs de ② (retrait, purge) et de ⑤ (la pastille poussée), joués en mode test, écriraient ou effaceraient au vrai hub. C'est une dette préexistante, à régler avant tout banc.
12. **La purge de rentrée n'emporte pas les classes.** Aucun des 11 contrats de purge publiés (`/manifestes`) ne vide `classes`. Et `_purgePlan` lit les contrats **publiés au hub**, pas la constante `MJPC_PURGE` du fichier. Correction : dire qui vide `/classes/<slug>/profils`, republier le contrat (`publierManifesteREST`) et le vérifier au hub. Même chose pour `eleves`.
13. **La reprise depuis la corbeille n'existe pas** (« l'ajout dans une autre classe le reprend »). L'archive `retrait-eleve` est en « consultation seule » (`_corbPourquoiPasAuto`, l. ~6445) : c'est un geste nouveau, à décrire.
14. **Deux comparaisons de noms.** L'existant repère les doublons par `_normName` (l. 4745), qui ôte espaces et tirets. La clé du profil est `sanMJPC`, qui les garde : « DE LA TOUR Anne » et « DELATOUR Anne » seraient « déjà présent » pour l'un et deux clés pour l'autre. Correction : `sanMJPC` pour les deux.
15. **`toggleAmenageDictee` « reste » : incomplet.** Son corps (l. 2962-2979) choisit entre écrire l'override et l'ôter d'après le registre `classeAmenages`. Il est à rebrancher sur pap-15 du profil, sinon il bascule faux.
16. **`secuExigeCle` (l. 14086) parle de « générer un code »** : son texte est faux s'il est réutilisé à l'import.
17. **`/codes/<clé>` porte aussi `classe`** (`_putCode`, l. 5435) : le mandat l'omet.

## C. Omissions

18. **La date au survol du ◆** (« cases cochées le … », cadrage 3.4 ter) est absente de ④.
19. **Personne ne supprime `classes_amenages`** (cadrage 3.4 quinquies : « le nœud disparaît »). Mesuré : il ne porte qu'une classe, `5e HERGÉ`, supprimée par Paul. La migration concerne donc 0 élève, et le nœud résiduel contredit 1.7.
20. **Des sexes de classes supprimées survivent.** `qcm/eleveSexes` compte 9 classes, dont 6 de classes supprimées (Banksy, Pythagore, Hergé, en deux graphies chacune). Leur sort n'est pas dit, et la « lecture de repli » du QCM les garderait vivants.
21. **`adapte` au contrat d'injection** (cadrage 3.5 : « en attendant, le contrat d'injection porte adapte ») est écarté au §4. Cela contredit la règle « ce qui n'existe pas encore ne tombe pas ».
22. **Écarts avec la capture validée T284-e4** :
    - la marge « lu dans le calendrier annuel : … » manque ;
    - « rien à signaler » manque ;
    - le rappel est nommé par élève, avec la date (« les cases de … sont-elles à jour ? (cochées le 04/09, avant l'ESS) »), alors que le mandat le fait par classe ;
    - « — ou élève par élève, par le clic droit » manque.
23. **Deux points du cadrage manquent** : la pastille « de la taille de l'étiquette » (4.2) et « l'âge n'est jamais lu par une app » (4.4).
24. **Promotion et suivi non dits.** Le mandat ne dit pas quelle livraison Paul promeut ni à partir de quand il peut importer ses classes (son besoin, tour 281). Il n'impose pas non plus à l'exécutant les docs de suivi avant chaque livraison.
25. **Une dette mesurée non nommée** : `ensureEleveUuid` écrit `annee:'2025-2026'` en dur (l. ~4852), ce qui touche 1.7.
26. **Le recalcul des notes ignore l'aménagement** (dette préexistante). Quand la base d'une dictée change, toutes les notes sont recalculées sur la nouvelle base (l. 2888-2899), y compris celles des élèves aménagés. Cela télescope la règle de ⑥ : la trace « jamais recalculée après ».
27. **La fuite du mode test n'est pas au registre** : « mjpcFetchOk » et « _fbPutPath » y ont 0 occurrence. À inscrire par la conscience.

## D. Ajouts non cadrés

28. Le bouton de migration dans Configuration (voir point 6).
29. « Ouvrir sa fiche dans la console » à la place de `toggleAmenageClasse` : ni le cadrage ni Paul (tours 282-283) ne l'ont demandé.
30. L'import bloqué sans la clé : le cadrage chiffre la naissance mais ne dit pas de bloquer, et OU-EST-CE ⑧ pose que le professeur n'est jamais bloqué (question 54).

## E. Trous

31. **Appariement de la classe.** Le fichier dit « Classe : 3 DYLAN BOB » ; le hub porte `3e_bob_dylan`, nommée « 3e Bob Dylan », créée sans élèves. Un appariement par le nom créerait un doublon. Solution : l'aperçu propose une correspondance et laisse choisir parmi les classes existantes, jamais de création silencieuse.
32. **ESS individuelle.** Le libellé du 14/09 est « 16h Equipe éduc. <un seul mot> 17h Equipes éducatives 5e » : un seul mot ne donne pas une clé `nom_prenom`, et « suivi du niveau » pris au large lirait ce 5e. Solution : le niveau est le mot immédiatement après « éduc… » ; sinon, question 59.
33. **Banc ⑥ sans profil.** Le site en mode test écrit dans son magasin local ; la dictée lit le hub et son bac à sable écrit `/classes/_test_correction_dictee` au vrai hub (l. 6896). Solution : le bac à sable de la dictée sème lui-même un profil pap-15 de test, et le purge.
34. **Formats non dits** : le clair de `naissance` avant chiffrement (le fichier donne JJ/MM/AAAA, le cadrage 1.2 AAAA-MM-JJ) et la forme du clair de `remarques` (un paquet, ou une remarque par case).
35. **« Prénom + initiale » depuis « NOM Prénom »** : particules et noms composés non traités ; deux prénoms identiques le même jour sur la pastille (question 60).
36. **Cas anormaux non décrits** : fichier mal formé, date illisible, sexe vide, ligne vide, classe sans `annee` (la classe témoin 3E Charles de Gaulle n'en a pas).
37. **Plus aucun endroit pour poser un sexe.** Un élève ajouté par la voie de secours n'en a pas ; le QCM n'en écrira plus, et ③ ne dit pas que le sexe se saisit dans la fiche.
38. **Noms fictifs sans convention.** Solution : un préfixe impossible, vérifié à la commande contre `/codes` et `/classes` (règle absolue du 22/07 : la collision se juge sur la clé).
39. **Collision avec les envois de Paul.** Paul pousse lui-même `correction_dictee.html` ; le mandat part de b815d1dc sans md5 ni « si la base a changé : STOP ».
40. **Chemin du profil depuis la dictée.** La dictée connaît le NOM de la classe (`data.classe`) ; la clé de `/classes` se résout par `classeDuRegistre` (l. 6700, via `sanMJPC`). Le mandat doit dire que le profil se lit sous la clé résolue, jamais sous le nom brut.
41. **`results/<clé>` s'écrit en au moins six endroits** : `save` l. 2424, recalcul l. 2897, restauration l. 3019, transfert l. 3044-3050, l. 3166. « À la sauvegarde d'une correction » ne suffit pas : dire ce que la trace devient au transfert et à la restauration.
42. **Objets du cadrage 1 cités sans leur ancrage en production** : « copie de classe » (cadrage 1 §8 ; la copie au démarrage, OU-EST-CE ①), « répétition » (cadrage 1 · 2.5), « journal du tableau » (§3). L'exécutant doit savoir ce qui leur répond aujourd'hui dans `index.html` (`deroule_joue`, `sesPhoto`, `W.gele`, `AT_DR_REGIME`).

## F. Conforme (mesuré)

43. `sanMJPC` (l. 2636 : NFD, minuscules, `_`) et `san = sanMJPC` (l. 5382).
44. **Le coffre.** `mjpcChiffrer(cle, texte)` (l. 2942), AES-GCM, paquet « v1.iv.ct » ; `mjpcDechiffrer(cle, paquet)` (l. 2949) ; `mjpcEmpreinte` (l. 2964, PBKDF2) ; clé dérivée par PBKDF2 à 310 000 itérations ; `SECU` (l. 13603) ; `secuExigeCle` rend un booléen.
45. `_importEleves(slug)` (l. 5474) et `parseEleves` : une ligne = un nom. La liste est faite de chaînes (29 sur la classe témoin, au hub).
46. **Le retrait** `_deleteEleveCls` : corbeille `retrait-eleve` (nom + code), puis `mjpcLot` (liste + code).
47. **La purge d'index** : `MJPC_PURGE.purger` d'index = `["eleves_index","codes"]`, dans le code et au hub. `/eleves` : 3 fiches. La dette n°12 · 76 est au registre, telle que le mandat la cite.
48. **Le mode test du site en partie** : `_sitePut` (l. 1813) et `mjpcEcrireRest` (l. 2823) passent bien par `M8_TEST_STORE`. `AT_DR_SUIVI` (l. 14157) est tel que cité.
49. **Le calendrier 2026-2027 au hub** :
    - `etablissement` : 59 entrées `{date, heure, id, libelle, prendLeCreneau}` ;
    - `evenementsClasse` : 15 entrées `{debut, fin, heure, id, libelle, niveau}` ;
    - équipes éducatives le 08/09 (3e), le 10/09 (6e), le 14/09 (5e + une individuelle), le 15/09 (« 17h Equipes éducatives 4e 18h30 Parents 4e »).
50. **La dictée.** `isEleveAmenage(clé, override, registre)` (l. 1941) : l'override prime. La base effective (l. 3011) ne dépend pas du barème, conforme à 59 a. `classes_amenages` est au manifeste (l. 1140) et à la purge (l. 1148).
51. **Le QCM** écrit `qcm/eleveSexes` (l. 2220, 2250), le déclare et le purge (l. 1947-1952).
52. **Présents dans le mandat** :
    - les mots de Paul en tête (vérifiés verbatim, tours 268, 271, 281, 289) ;
    - jetons et dépôts donnés, absents du fichier au sas ;
    - bancs par le geste, banc unique, preuves comptées, captures regardées ;
    - infobulles pour Paul, adresse complète, principe cardinal, rien de payant ;
    - relevé de collisions ; « s'il ne sait pas, il demande ».

    Décisions retrouvées : 59 a (élève par élève et en bloc), 41, 42, 44, « un élève ne vit qu'un an », la pastille invariable, « jamais par-dessus le cours ».

## G. Questions à Paul

53. La base se lit sans aucune clé. On garde en clair « dispositif » et les numéros de cases PAP sous le nom de l'élève, ou on les chiffre (les apps ne les liraient alors qu'avec ta clé) ?
54. Sans ta clé saisie, l'import de ta classe est refusé, ou il écrit la liste, le sexe et le dispositif, et garde la date de naissance pour quand tu saisis ta clé ?
55. Au réimport, si le fichier dit « pas de dispositif » pour un élève que tu as fléché à la main dans sa fiche : le fichier l'emporte, ou ta fiche ?
56. Le ◆ dans la copie de classe : oui (cadrage 3.4) ou non (mandat ④) ?
57. Le ◆ et la pastille d'anniversaire : dans le moteur actuel, ou seulement dans la nouvelle version du déroulé ?
58. Six livraisons dans une seule conversation d'exécutant, ou deux mandats ? Le premier (① ② ③ ⑥) te débloque tes classes et tes dictées ; le second (④ ⑤) toucherait le pilotage.
59. Équipe éducative individuelle (le calendrier ne porte qu'un mot) : le site rappelle pour tous tes élèves qui portent ce nom, ou le libellé portera « NOM Prénom » ?
60. Deux élèves au même prénom le même jour : « Bon anniversaire Léa et Léa », ou le prénom suivi de l'initiale ?
61. Le document papier de la dictée aménagée a pour titre par défaut « Dictée aménagée » et pour titre de page « … — Version aménagée » (`buildAmenageePapierHtml`, l. 5455). Ce mot est-il voulu sur la feuille que l'élève a devant lui (cadrage 3.4 bis) ?
