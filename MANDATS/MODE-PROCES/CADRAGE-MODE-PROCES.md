# Mode procès — cadrage (2 et 3 novembre 2026)

Tenu par Claude, conversation ouverte le lundi 2 novembre 2026 à 06:41, mise à jour le mardi 3
novembre à 17:50. Complète le cadrage d'origine du dossier (projet claude.ai,
`claude/CADRAGE-mode-proces-et-dossier-4e.md`, §1 à §15, du 7 septembre au 12 octobre) : là où
les deux diffèrent, celui-ci l'emporte. Rien n'est codé. Les numéros sont ceux de la conversation.

**Où en est ce cadrage (3/11, 17:44) :** Paul change de braquet. Le mode procès de l'app débat
(§7, points 21 à 38, et §10, point 72) n'est **pas** développé pour ce procès ; il reste écrit,
sans réponse de Paul, donc rien n'y est décidé. Le procès se prépare comme l'an dernier ; la seule
chose à fabriquer est **l'évaluation en direct** (§11).

---

## 1. Ce que le mode procès change pour la classe

Le jour du procès, Paul ne tient plus la régie. Le tableau dit qui plaide et qui tient chaque
poste, le chrono tourne tout seul, les jurés votent sur leur tablette et le décompte se fait seul.
La salle, disposée en tribunal, c'est Paul.

## 2. Décidé le 2 novembre

**Dit par Paul :**
- 07:34 : développer le mode procès dans l'app débat et « repousser le procès à dans deux
  semaines » : la semaine du 16 novembre.
- 07:39 : il ne corrige pas les copies entre la fin du dossier et le procès.
- 07:39 : « on organise la salle comme un procès. C'est moi qui fait. » Le mode procès ne porte
  donc que sur les écrans : au tableau, qui tient chaque poste et le chrono ; sur les tablettes,
  le vote, deux fois.
- 07:39 : aujourd'hui et demain, Paul fait le tirage au sort des camps et les élèves commencent
  à préparer leur plaidoirie (Turing le 2/11, Hugo le 3/11).
- 07:59 : *Le Horla* commence lundi prochain ; cette semaine de redémarrage a trois objectifs :
  rédiger la plaidoirie, revoir l'analyse logique, s'y entraîner.

**Proposé par Claude, non commenté par Paul, donc acquis (sa règle du 09/10) :**
- 3 · la plaidoirie a un plafond de 2 minutes, chronométré, coupé au bout.
- 4 · les postes tournent à chaque passage : chacun est juge, puis greffier, puis huissier, puis
  plaide, et retourne chez les jurés ; un absent est sauté ; les remplaçants R1 et R2 ne servent
  plus.
- 5 · on alterne un accusateur et un défenseur ; le camp est tiré par groupe, les trois élèves
  d'un groupe plaident pour le même camp (la couverture du dossier l'annonce : « par tirage au
  sort »).
- 12 · l'ordre suit la page 32 du dossier : les plaidoiries, le verdict, le procès en appel,
  puis un second verdict.
- 13 · la note sur 20 est la grille de la page 31, qui note le texte écrit ; les jurés ne font
  que voter.

## 3. Ce qui tombe du cadrage antérieur

| Où | Ce qui était écrit | Ce qui le remplace |
|---|---|---|
| §2 | le camp est attribué à la séance 7 | tirage au sort par groupe, les 2 et 3/11 |
| §2 | deux remplaçants par poste (R1, R2) | la rotation du point 4 |
| §2 | après les plaidoiries : procès en appel, puis vote | verdict, appel, second verdict (12) |
| §2 | les jurés coévaluent sur tablette ; ratio à définir | ils votent seulement ; plus de ratio (13) |
| §2 | décision du 5/10 : les oraux la semaine du 2/11 | la semaine du 16/11 |
| §5 | la question qui bloque : que fait la tablette du juré ? | elle vote (13) |
| §5 | la durée de la plaidoirie (2 min proposées) | plafond de 2 min (3) ; 10 à 15 lignes lues font 1 min à 1 min 30 (calcul, non mesuré) |
| §5 | la voix du professeur ×5 au vote | reste ouverte : point 29 |
| cadrage du *Horla* | 15 heures sûres par classe | 13 pour Turing, 14 pour Hugo (§4) |

## 4. Le calendrier, mesuré

Sur l'emploi du temps de Paul (Index Éducation, 26/08) et le calendrier du 1/11.

**Semaine du 16 novembre (semaine B)** — Hugo : lundi 16 11:04, mardi 17 13:00, jeudi 19 15:07
(le tribunal du 19 est celui des 4e Pythagore). Turing : mardi 17 8:57, jeudi 19 11:04. Le
mercredi reste à la langue. Vendredi 20 : journée orientation 4e et 3e, aucune des deux classes.
Pour Turing, deux heures doivent tenir 30 passages (environ une heure, point 11), le verdict,
l'appel et le second verdict : ça tient, sans aucune marge.

**Le Horla** — 15 heures sûres prévues du mardi 10/11 au jeudi 17/12. Le procès en prend deux
par classe : Turing mardi 17 et jeudi 19 ; Hugo lundi 16 et mardi 17. Le jeudi 19 de Hugo,
compté comme incertain par le cadrage du *Horla*, est sûr depuis le calendrier du 1/11 : si le
procès de Hugo tient en deux heures, il revient au *Horla*. Il reste donc 13 heures pour Turing
et 14 pour Hugo, pour un chapitre de 15 heures.

## 5. L'app débat, mesurée ce matin

Production `siteflow-io/monsieurjaipascompris`, commit `ddf0ad2` (02/11, 06:23).
`pilotage_debat_s3.html` : 490 509 octets, md5 `e843757ae6f49ea3d3f549a4f5f0b41c`, 6 953 lignes,
`APP_VERSION "2026-08-01-3"` (l. 3024), socle MJPC-CORE 1.6.0 (l. 2190). Depuis le 5 octobre,
seule l'en-tête « À coder » (25 lignes, 10/10) a changé.

**Ce qui existe et servira au procès :**
- l'élève se connecte avec son code MJPC et tombe sur le débat de sa classe (un débat oral par
  classe, `active/debats/<classe>`, l. 1551) ; les classes 4_hugo et 4_turing sont au hub
  (mesuré par la conscience n°13 fin octobre, pas par moi ce matin) ;
- les groupes, en mode « choisi » ou « imposé » par le professeur ;
- un chrono synchronisé sur les tablettes, avec ses phases (l. 5047) ;
- le compte en direct des votes reçus et de ceux qu'on attend (l. 6636) ;
- les archives, l'export, la sauvegarde ;
- une classe de test à six élèves.

**Ce qui manque :**
- le passage d'un seul élève : une manche oppose deux groupes (l. 5038, le camp est tiré à chaque
  manche) ;
- les postes juge, greffier, huissier et leur rotation ;
- le camp d'un groupe pour tout le procès ;
- le vote de chaque juré sur trois chefs d'accusation : la grille d'écoute actuelle est remplie
  par groupe, sur quatre critères ;
- deux votes successifs (verdict, appel) ;
- un écran pour le tableau : le code du débat n'a aucune vue séparée pour l'ordinateur de la
  classe (ni tableau distant, ni fenêtre de projection).

**Qui travaille sur ce fichier :** personne. Ce matin, la conscience n°14 travaille sur la
rédaction, la n°16 sur le déroulé (`index.html`). Aucune branche du sas ne touche le débat. Le
lot S3 du plan dix jours (22/10), qui couvrait le débat, n'a rien livré.

## 6. Les dettes du fichier, vérifiées contre le code

| | Dette | État |
|---|---|---|
| 1 | « Réglages → changer le mot de passe » écrit encore le mot de passe en clair au hub (`debat_config/profPassword`, l. 4223) et affiche « Mot de passe mis à jour », alors que l'app ne le lit plus depuis M-SÉCU-3 (l. 3170) : le geste ne sert à rien et laisse un mot de passe lisible au hub | mesurée |
| 2 | Le mode test écrit au vrai hub (classe, codes, débat de test, l. 2895-2902) : aucune bascule n'intercepte les écritures. La règle de Paul (22/07, DISPOSITIF point 16) veut un mode test dans chaque app, et le registre en fait une dette (n°11 · 98) | mesurée |
| 3 | Le soupçon de Paul (09/08) : un élève sans débat tombe-t-il sur l'écran de connexion au lieu d'un écran qui le lui dit ? | non mesurée (il faut un banc par le geste) |
| 4 | Le multi-classes : le code se dit fait (M5, 17/07, l. 1551) et une note du même fichier parle encore de « dette de refonte multi-classes » (l. 6704) | non mesurée (il faut un banc à deux classes) |
| 5 | Le direct : un comptage simple donne 36 lectures faites une seule fois contre 4 abonnements ; lesquelles devraient suivre le hub | non mesurée |
| 6 | Aucun banc par le geste pour cette app | mesurée par la n°13 (MANDAT-S-APPS §3.1) |
| 7 | Les vestiges `ELIO-*` : le code les tolère en lecture (l. 2212) ; leur présence au hub | non mesurée |
| 8 | En tête du fichier, « À coder » n°1 : la tablette partagée en deux et les binômes (Paul, 10/10) | prévu, pas codé |

**Lignes du registre contredites par le code :** « débat multi-classe (code commun ou par
classe) » — le code dit la question ⑰ « morte de fait » (l. 1566) ; « `profPassword` vaut encore
`1312` » et « est lu » — le code ne le lit plus, mais l'écrit encore (dette 1).

## 7. La liste oui / non

21. Les groupes du procès se saisissent comme aujourd'hui, en mode « imposé » : tu composes une fois les groupes de chaque classe, avec le camp tiré cette semaine.
22. L'app calcule l'ordre de passage (un accusateur, un défenseur, groupe après groupe) et tu peux le changer en direct.
23. Au tableau : le plaideur, les trois postes, le suivant, et le chrono de 2 minutes. « Suivant » fait avancer tout le monde d'un poste, et un absent se saute d'un clic.
24. Le tableau est l'ordinateur de la classe, piloté depuis ton portable, comme le tableau distant du site.
25. Pendant les plaidoiries, la tablette dit seulement qui plaide. Elle ne sert qu'aux deux votes.
26. Chaque juré vote « coupable » ou « non coupable » sur chacun des trois chefs d'accusation.
27. Tout le monde vote, y compris ceux qui ont plaidé.
28. Le vote est secret : le tableau ne montre que le décompte.
29. Tu ne votes pas : le verdict appartient au jury (le cadrage proposait que ta voix compte cinq fois).
30. C'est toi qui ouvres le vote, le fermes et révèles le verdict, chef par chef : rien ne part tout seul.
31. Le second verdict, après l'appel, s'affiche à côté du premier.
32. Le jour du procès, chaque élève a sa tablette. Si c'est non, il faut d'abord coder la tablette partagée en deux (dette 8).
33. L'app garde pour chaque classe le relevé du procès (ordre de passage, absents, durées, les deux verdicts), et tu peux l'exporter.
34. Le mandat commence par la partie débat du lot S3, jamais livrée (banc par le geste, mode test, dettes 1 à 7), puis il code le mode procès.
35. Le geste « changer le mot de passe » est retiré, et le mot de passe en clair est effacé du hub.
36. Le calendrier : un exécutant règle les dettes dès ton oui, avant la fin du crédit le 5/11 ; pendant ce temps, je fais la maquette (le fichier de production sur un faux hub, avec le procès écrit dedans) ; captures vendredi 6 ; mandat du procès lundi 9 ; promeus au plus tard jeudi 12.
37. Si le mode procès n'est pas promu jeudi 12, le procès du 16 se fait avec des bulletins papier, et la date ne bouge plus.
38. *Le Horla* se resserre : 13 heures pour Turing, 14 pour Hugo.

## 8. Où vit ce cadrage

Au sas : `MANDATS/MODE-PROCES/CADRAGE-MODE-PROCES.md`. Depuis le 3/11, le dépôt du sas est relié
à la conversation avec le droit d'écrire (autorisation donnée par Paul) : plus de jeton. Le même
texte est dans le projet claude.ai : `claude/CADRAGE-mode-proces-etat-des-lieux-2026-11-02.md`.

## 9. La suite du 2 novembre (points 39 à 71)

**Le tirage des camps** (proposé à 08:27, non commenté, donc acquis) :
- 39 · à la fin de l'heure, chaque groupe connaît son camp et l'a coché sur la couverture du
  dossier (« Camp : ☐ Accusation (l'ombre) ☐ Défense (la lumière) ») ;
- 40 · autant de groupes d'un côté que de l'autre : des papiers, moitié « Accusation », moitié
  « Défense », un par groupe ;
- 41 · Paul repart avec la liste des groupes, de leurs membres et de leur camp.

**La pièce n°3 relue** (15:24, page 28 du dossier) :
- 47 · l'argument 3 accepte toute preuve de P1 à P4 (le chemin A peut n'avoir ni P2 ni P4) :
  acquis par la fiche validée (point 65) ;
- 48 · les trois chefs d'accusation ne sont pas dans le dossier (diapo 3 de la séance 1, rappel
  diapo 19 de la séance 2) : ils sont maintenant sur la fiche du point 63 ;
- 49 · dans un groupe, tous gardent *Bel-Ami* pour l'argument 1, chacun choisit des arguments 2 et
  3 différents : acquis par la fiche (point 66) ;
- 50 · **ouvert** : la carte du parcours (page 6) renvoie aux pages 29 et 30 pour les pièces n°3 et
  n°4 ; dans le PDF du dossier, elles sont aux pages 28 et 29. L'exemplaire imprimé : je ne sais pas.

**La forme d'un argument.** Diagnostic de Paul (16:43) : « le problème principal est les trois
chefs d'accusation effectivement, mais aussi la forme d'un argument. L'élève ne sait pas faire le
lien entre le connecteur logique qu'il doit choisir et la citation qu'il doit utiliser. Sachant que
la plaidoirie est censée être une articulation des 3 arguments. » Décidé (17:01, 17:51 « ok fais ») :
- 52 · un argument se rédige en trois temps : j'annonce (connecteur de la ligne 1 de la fiche des
  connecteurs), je prouve (ligne 5 ou 6, puis la citation mot pour mot, en disant qui parle),
  j'explique ;
- 53 · la plaidoirie : l'ouverture, trois arguments sur **trois chefs différents**, la conclusion
  (ligne 10) qui demande le verdict. Chaque plaidoirie couvre donc les trois chefs.

**Les deux feuilles** (55 à 67, livrées dans la conversation, pas sur MJPC — « tu ne les mets pas
sur mjpc. tu les livres ici ») : fiche notion « Comment rédiger un argument » et fiche de séance
« Comment préparer ma pièce n°4 avec ma pièce n°3 ? », une page A4 chacune, au format de
l'Atelier (vérificateur du site 8.79.0-⑫ : aucun refus), PDF sans date d'édition (Paul, 19:41).
- 69 · si ces feuilles passent un jour par le site, la date d'édition revient au papier : le site
  l'imprime toujours, même décochée (`toujours_imprime`, `index.html` l. 7740 et 10590).
- 71 · **ouvert** : le rendu papier des feuilles du site ne justifie pas le texte, contre la règle
  de Paul du 29/10. Dette du site, pas encore au registre.

## 10. Le 3 novembre : la liste reposée, puis le changement de braquet

17:25, Paul : « reprenons le cadrage du débat du coup ». Mesuré à 17:27 : `pilotage_debat_s3.html`
inchangé (md5 `e843757a…`), aucune branche du sas sur ce fichier. La liste 21 à 38 est reposée telle
quelle, avec deux points de plus :
- 72 · les camps sont à égalité : si chacun vote pour son camp, chaque chef finit à égalité.
  Proposé : la tablette demande, pour chaque chef, « L'autre camp t'a-t-il convaincu ? » ; Paris est
  coupable sur un chef si l'accusation a convaincu plus de défenseurs que la défense n'a convaincu
  d'accusateurs. Sinon : la question « coupable / non coupable », et la voix de Paul compte cinq
  fois pour départager (26 et 29 en dépendent). **Sans réponse.**
- 73 · relier le dépôt du sas à la conversation plutôt qu'un jeton : **fait** le 3/11 à 17:46.

17:44, Paul : « je change de braquet. tout cela est à consigner au cadrage et à mettre sur github.
pour vendredi, on prépare le procès comme j'ai fait l'année dernière, la seule chose c'est
l'évaluation en live. Il me faut quelque chose qui ne casse pas comme l'année dernière pour noter
tous les critères facilement. »

**Non mesuré :** la clé de Paul n'était pas branchée le 3/11 à 17:46 ; le dossier avec les fiches
du procès de l'an dernier (Paul, 18:12 : « ce n'est pas le diaporama, c'est le dossier avec les
fiches du procès ») n'a pas été relu, et son chemin exact n'est pas connu. Ce qui a cassé l'an dernier : je ne sais
pas (aucune trace dans les conversations ni au sas).

## 11. L'évaluation en direct — proposée le 3/11 (points 74 à 80), en attente de Paul

- 74 · L'outil : une page sur l'ordi portable de Paul, sans internet, bâtie sur la page du point
  avec chaque groupe, version 3 (`Séance 6, je cherche mes preuves\Point-groupes-S6.html`), celle qui
  a tenu (13/10 : les 10 groupes des Turing enregistrés). Elle écrit le fichier sur la clé à chaque
  clic, en garde une copie dans le navigateur, et met un bandeau rouge si l'écriture échoue. Ni hub,
  ni tablettes, ni réseau.
- 75 · Les élèves : les listes École Directe déjà dans cette page ; Paul y ajoute une fois les
  groupes et les camps tirés le 2 et le 3/11 (ou il les donne et Claude les met dedans).
- 76 · Les critères, un fait entendu = une case = un point, rangés comme la grille de la page 31 du
  dossier : Position /2 (« Mesdames et messieurs les jurés… » · son camp et ce qu'il démontre dès la
  première phrase) ; Trois arguments /5 (trois chefs différents · argument 1 annoncé, prouvé,
  expliqué · argument 2 de même · argument 3 de même · trois connecteurs différents) ; Preuves /4
  (*Bel-Ami* cité · son auteur nommé · une autre pièce citée · sa source nommée) ; Conclusion /2 (un
  connecteur de conclusion · une phrase qui demande le verdict). 13 points en direct.
- 77 · Langue /4 et Soin /3 ne s'entendent pas : ils se notent sur la copie, après le procès, dans la
  même page, qui complète alors la note sur 20.
- 78 · Le geste : un écran par plaideur, les 13 cases en gros ; un clic coche, un second clic
  décoche ; « Suivant » passe au plaideur d'après dans l'ordre de passage ; un absent se saute d'un
  clic ; le chrono de 2 minutes est sur le même écran ; on peut revenir sur un plaideur déjà passé.
- 79 · Ce qui sort : le fichier de la classe sur la clé, et un relevé imprimable par élève (ses
  cases, sa note sur 13, la place pour Langue et Soin).
- 80 · Testée geste par geste par Claude avant livraison, au plus tard jeudi 5 au soir ; Paul la
  joue chez lui avec la vraie liste avant le procès, jamais en classe.

Lecture de « pour vendredi » : l'outil est prêt vendredi 6 ; le procès reste la semaine du 16/11.
