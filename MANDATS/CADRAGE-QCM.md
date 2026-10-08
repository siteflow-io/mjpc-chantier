# Cadrage QCM (`evaluation-qcm.html`) — document vivant
*Conscience n°12. Ouvert le 08/10/2026 (tours 557-559). Base mesurée : production 7.7.1 (md5 `ecae65624855a1a877708986a8e984e5`). Numérotation propre au cadrage QCM, à partir de 1 (Paul, 08/10 : « on recommence à 1, vu que c'est le cadrage qcm » ; « des références par numéros, plutôt que par points dans les numéros »). Chaque réponse de Paul est recopiée mot pour mot sous le point qu'elle tranche. Aucun code tant que le cadrage n'est pas fini.*

**Ce que ça change pour la classe** : deux élèves par tablette, qui répondent l'un après l'autre sans voir la réponse de l'autre ; des temps de réflexion et de réponse réglés question par question ; une séance (questions + correction) qui tient dans 45 minutes ; la console de Paul, qui pilote la séance, lisible d'abord.

**État au 08/10, 09:15** : Paul a répondu de 1 à 27 (tour 559), puis à 65, 67 (son « 9 »), 68 (« 10 »), 70-71 (« 12 »), 72 (« 14 »), 73 (« 16 »), 74-80 (« 21 », « 76 »), 81 (« 25 ») et 82 (tour 560). Redonnées au tour 560 pour réponse : 28 à 44, 58, 59, 61, 64, 74 ; nouvelles questions : 89, 94, 96. Sans objet : 45 à 50 (Paul, 82). 51 à 54 : production toujours fermée, geste de Paul (53).

---

## Tour 558 — les points 1 à 54

Le cadrage QCM repart à 1 : ces numéros remplacent 711 à 718. Chaque point a son propre numéro ; tu peux répondre par exemple « 25 ok, 38 non : … ».

**Ce que j'ai mesuré : les chronos, les niveaux, le prompt**

1. **La réflexion** est déjà réglable niveau par niveau, dans ton poste de pilotage (« Durées des niveaux »), et gardée au hub pour toutes les séances. Chez toi : Facile 10 s · Standard 15 s · Approfondi 20 s · Expert 30 s.

> **Paul (08/10, 08:14)** : « oui, mais elle est figée sur le ratio "niveau/temps". Or, je veux pouvoir décorréler les deux données. »

> **Suite (tour 559)** : points 56, 57.

2. **La réponse** n'a qu'un seul chrono pour toutes les questions. Il se règle pendant la séance (de 3 à 30 s), mais il repart à 5 s à chaque nouvelle séance. C'est le même pour 4 choix courts que pour ta question 3 de 3e demain (6 choix, 3 bonnes, 402 caractères à lire).

> **Paul (08/10, 08:14)** : « Pareil, il se règle en amont, au prompt. Et 30 secondes max, ce n'est pas du tout suffisant, d'où l'importance de pouvoir régler. Par ailleurs, il faut une garde de débordement: Si je demande 20 questions à l'instance et que les questions sont très complexes, et que je ne mets que 30 secondes d'écriture, elle doit me dire que ça ne rentre pas. Pareil, si le nombre des questions fait déborder la séance (sachant qu'une séance est TOUJOURS la phase de questions + la correction dans la foulée, 45 minutes utiles). »

> **Suite (tour 559)** : points 56, 57, 58, 59, 60.

3. **Les niveaux** sont quatre ; leurs noms et leurs couleurs sont fixés dans le code, leurs points (1/2/3/4) se règlent.

> **Paul (08/10, 08:14)** : « oui c'est bon, mais pour le réglage, la console actuelle n'a aucun bouton. »

> **Suite (tour 559)** : points 61.

4. **Le prompt, lui, est en dur, et il est faux.** Sa règle 5 écrit « facile (5 secondes de réflexion), standard (10s), approfondi (15s), expert (20s) », alors que tu as réglé 10/15/20/30. Le bouton « Réinitialiser » parle aussi de 5/10/15/20. L'app sait déjà écrire la liste des niveaux d'après tes réglages, mais ce n'est pas branché sur le prompt.

> **Paul (08/10, 08:14)** : « Donc prompt à établir une fois l'app complètement cadrée. »

> **Suite (tour 559)** : points 62.

**Ce que j'ai mesuré : ce qui casserait avec deux élèves sur une tablette (le « consolider »)**

5. **Le redessin.** Quand un écran du QCM arrête d'écouter le hub, il ne dit pas quelle écoute il arrête : c'est le cas 33 fois sur 38, alors que la dictée le dit 38 fois sur 47. Je l'ai prouvé avec le vrai Firebase de l'app (8.10.1). Deux moitiés écoutent la séance ; la moitié 1 se ferme ; **la moitié 2 ne reçoit plus rien** et la question suivante n'arrive pas : il faudrait recharger. Avec un élève par tablette, c'est sans effet ; avec deux, c'est bloquant. C'est à corriger partout, avant tout le reste.

> **Paul (08/10, 08:14)** : « attention, tu raisonnes comme si les moitiés existaient, ce n'est pas le cas. par ailleurs, oui correction à faire (par anticipation du coup). »

> **Suite (tour 559)** : points 63.

6. **Le rechargement.** L'élève n'est gardé que dans la page : un rechargement le renvoie à « Choisis ta classe », et il retape son code, son prénom et son nom. Ensuite, il retombe bien sur la question en cours, avec sa réponse. Ce qui coûte, c'est la ressaisie pendant un chrono de 5 s.

> **Paul (08/10, 08:14)** : « oui donc le temps de l'heure, l'élève n'a jamais besoin d'entrer son code. En revanche, à la déconnexion de fin d'heure (soit chrono, soit par moi), la tablette se libère et oublie l'élève. »

> **Suite (tour 559)** : points 64.

7. **Le raccourci MJPC.** Si un élève s'est connecté au site sur cette tablette dans les 12 dernières heures, le QCM s'ouvre directement à son nom, sans code. Sur des tablettes de classe, un élève se retrouve alors sous le nom d'un autre ; avec deux moitiés, ce seraient les deux moitiés à son nom. La dictée coupe ce raccourci sur les moitiés.

> **Paul (08/10, 08:14)** : « Donc zéro raccourci MJPC sur les tablettes. Mais à ne pas désactiver, pour l'instant, autre part (téléphone perso de l'élève, ordi au cdi, ordi maison etc). »

> **Suite (tour 559)** : points 65, 66.

8. **Les horloges.** Chaque tablette compte le chrono avec sa propre horloge, alors que c'est ton poste qui ferme la phase. Si une vieille tablette retarde de 4 s, Michel perd 4 s de son tour ; avec un gel « instantané », ça se verra. Je cale toutes les tablettes sur l'heure du hub.

> **Paul (08/10, 08:14)** : « oui, horloge commune Hub. »

9. **Une fuite.** À chaque nouvelle séance, la tablette ajoute une écoute sans retirer l'ancienne : une séance terminée peut revenir à l'écran si elle est réécrite.

> **Paul (08/10, 08:14)** : « Donc étanchéifier, et de fait, les sessions sont archivées il me semble, avec pour l'instant des données très sommaires (les réussites élèves et l'écart papier écran). ll faudra voir ce qu'on peut y ajouter et qui me serait utile (notmment pour rentrer notes et compétences sur ED). »

> **Suite (tour 559)** : points 67.

10. **À savoir pour demain, quoi qu'on décide** : seul ton poste de pilotage, sur l'ordinateur, fait passer les phases à la fin du chrono. Le pilotage au téléphone ne le fait pas : laisse le poste ouvert sur l'ordinateur.

> **Paul (08/10, 08:14)** : « Pas compris. »

> **Suite (tour 559)** : points 68.

11. **Une précision sur « comme on a fait en dictée ».** Aujourd'hui, en dictée, chaque moitié se souvient de son élève après un rechargement, sans code ; le raccourci MJPC est coupé sur les moitiés ; l'écran suit en direct. **Le retour exact est cadré, mais pas codé** (L17-2 : un rechargement ramène « Combien êtes-vous ? », chacun retape son code et retrouve son mot) : il est dans le mandat en pause. Pour le QCM, je pars donc de ce qui tourne.

> **Paul (08/10, 08:14)** : « Déjà répondu, non? »

> **Suite (tour 559)** : points 69.

**Le clonage : ce que je reprends de la dictée, à l'identique**

12. **L'entrée** : « Combien êtes-vous sur cette tablette ? », puis, sur chaque moitié, le code, le nom et le prénom, tapés avec le clavier de l'app (celui de la tablette couvrirait les deux moitiés).

> **Paul (08/10, 08:14)** : « En fait, ils sont deux par tablette. pas besoin de choix de départ en réalité (d'ailleurs pareil en dictée). ON part du principe qu'ils sont deux, et si l'élève est seul, c'est déjà réglé par la constitution des binômes. »

> **Suite (tour 559)** : points 65, 70, 71.

13. **Plus de « Choisis ta classe » sur les tablettes** : l'élève est trouvé dans les listes, comme en dictée. Cela règle au passage les classes de test visibles par les élèves, que j'avais relevées au tour 556.

> **Paul (08/10, 08:14)** : « oui absolument. jamais de choisis ta classe. »

14. **Le registre « qui est assis où »**, avec l'heure d'arrivée.

> **Paul (08/10, 08:14)** : « oui ok, mais alors je veux pouvoir déplacer des élèves (par glisser remplacer/interchanger) de binômes. »

> **Suite (tour 559)** : points 72.

15. **En binômes imposés** : « Ton binôme : X » sur la moitié libre, et « Tu es avec Lou : laisse cette tablette à quelqu'un d'autre et rejoins Lou. » sur l'autre tablette. La première arrivée garde la tablette. L'émoji suit les sexes (👭 👫 👬, ou 👥 si on ne sait pas).

> **Paul (08/10, 08:14)** : « oui. »

16. **Ton écran** : les tablettes (qui est avec qui) ; un clic montre les deux moitiés en direct.

> **Paul (08/10, 08:14)** : « oui, mais attention, car contrairement à la dictée, ma console est très importante car c'est elle qui pilote la séance: donc attention aux priorités visuelles en termes d'UI. à me proposer sur captures. »

> **Suite (tour 559)** : points 73.

17. **Absent, parti, revient** : ce sont les règles de L17-1. Les binômes sont fixés pour la séance. Celui qui part n'est remplacé par personne, et son binôme continue seul. Celui qui revient reprend sa moitié. Un retardataire rejoint un élève seul ; s'il n'y en a pas, il est seul.

> **Paul (08/10, 08:14)** : « ok. »

18. **« Départ d'un élève »** range aujourd'hui l'élève avec les absents : je sépare « parti » et « absent », comme en dictée.

> **Paul (08/10, 08:14)** : « ok. »

19. **Une différence qui simplifie** : le QCM fait déjà l'appel au lancement (« qui est absent aujourd'hui ? »). Les binômes se forment donc **après** l'appel, entre les présents seulement.

> **Paul (08/10, 08:14)** : « oui  très bien. »

**L'anti-triche, tel que je le comprends**

20. **La réflexion** ne change pas : les deux moitiés montrent l'énoncé et le chrono, et chacun rédige sur sa feuille.

> **Paul (08/10, 08:14)** : « oui. »

21. **La réponse, tour 1** : la moitié de Michel est voilée, avec « Donne la tablette à Julien pour qu'il réponde sans que tu regardes. » ; la moitié de Julien montre le chrono et les réponses possibles.

> **Paul (08/10, 08:14)** : « oui, mais petite différence, les réponses ne sont pas dans le même ordre que sur la partie du précédent! comme ça même s'il a regardé l'autre répondre et qu'il répond les mêmes lettres, il se trompe (à voir comment ça télescope la collecte des bonnes réponses). par ailleurs, il faut que lorsque michel répond, julien ait le même message "laisse la tablette à Julien poour qu'il réponde sans que tu regardes". »

> **Suite (tour 559)** : points 74, 75, 76, 77, 78, 79, 80.

22. **À la fin du chrono**, Julien est gelé aussitôt, qu'il ait répondu ou non. Il n'y a pas de bouton « J'ai fini » : il peut changer d'avis jusqu'au bout, comme aujourd'hui.

> **Paul (08/10, 08:14)** : « ok. »

23. **Le tour 2** est l'inverse, avec « Donne la tablette à Michel pour qu'il réponde sans que tu regardes. »

> **Paul (08/10, 08:14)** : « ok. »

24. **Ensuite**, les deux moitiés affichent « Attends la prochaine question », sans montrer les réponses.

> **Paul (08/10, 08:14)** : « ok. »

**Ce qui reste à cadrer : mes propositions (réponds par numéro, « ok » ou ta correction)**

25. **Qui commence** : on alterne à chaque question (question 1, la moitié de gauche ; question 2, celle de droite, et ainsi de suite). Sinon, le second a toujours plus de temps de réflexion.

> **Paul (08/10, 08:14)** : « oui alternance, et non, le second n'a pas plus de temps de réflexion, ils ont le même tous les deux en soi. »

> **Suite (tour 559)** : points 81.

26. **Le passage de la tablette** : 3 s voilées avant chaque tour, avec « Julien, à toi dans 3 s ». Sinon, le temps de passer la tablette est pris sur son chrono. Ces 3 s sont réglables.

> **Paul (08/10, 08:14)** : « ok. »

27. **Un élève seul sur sa tablette** n'a pas de voile : il répond au tour 1, puis il attend.

> **Paul (08/10, 08:14)** : « ok. »

28. **Le coût en temps**, mesuré sur tes deux évaluations de demain (réponse 5 s, passage 3 s) : 16 s par question au lieu de 5, soit **+4 min en 4e** (21 questions) et **+2 min en 3e** (11 questions).

29. **« Rouvrir pour tous »** : les deux tours recommencent ; celui qui a déjà répondu reste voilé, avec « Ta réponse est enregistrée ».

30. **La réouverture pour un seul élève** : sa moitié s'ouvre sans chrono, et l'autre est voilée avec la phrase du point 21.

31. **La pause** gèle le tour en cours, voile compris.

32. **L'autoévaluation et la correction** se font sur les deux moitiés en même temps, sans voile : il n'y a plus rien à copier.

33. **La vue tableau** affiche « 1er tour » ou « 2e tour » à côté du chrono.

34. **Le temps de réponse** devient réglable **par niveau**, comme la réflexion : une question Expert à 6 choix longs ne se lit pas en 5 s.

35. **« Les niveaux éditables »**, je le comprends comme « leurs durées et leurs points ». Ils restent quatre, avec leurs noms : le bilan, les couleurs, la pondération et tes évaluations déjà écrites reposent sur ces quatre-là.

36. **Un seul panneau, « Les niveaux »**, gardé au hub pour toutes les séances. Pour chaque niveau, on y règle la réflexion, la réponse et les points, et en plus le temps de passage du point 26. Le chrono de réponse ne repart plus à 5 s à chaque séance.

37. **Le prompt** : sa règle 5 s'écrit d'après tes réglages au moment où tu copies (noms, réflexion, réponse), et il demande en plus que chaque choix se lise dans le temps de réponse. Si tu modifies le prompt, un repère garde la place de cette liste.

38. **Le rechargement pendant le QCM** : la tablette garde ses deux élèves **jusqu'à la fin de la séance**, sans code, parce que le chrono tourne et qu'il n'y a pas le temps de retaper. À la séance suivante, elle redemande « Combien êtes-vous ? ». C'est différent de ta règle L17-2 pour la dictée, à cause du chrono ; dis-moi si tu préfères la règle de la dictée.

39. **La constitution** : au premier QCM, placement libre (aucune annonce, aucun refus) ; ensuite, d'après le QCM précédent : un classement, puis les binômes 1-2, 3-4, 5-6…

40. **Le résultat retenu** : le score app pondéré, connu dès la fin de la séance et pour tous. Le score officiel n'existe qu'après la saisie à la maison, que tous ne font pas.

41. **Le QCM précédent** : la dernière séance terminée de la classe, quelle que soit l'évaluation.

42. **Sans résultat, et nombre impair** : les absents du QCM précédent sont appariés entre eux ; s'il reste un élève, c'est le dernier du classement qui est seul.

43. **Le choix du mode** est automatique : placement libre s'il n'y a pas de QCM précédent, sinon d'après les résultats. Tu peux le changer au lancement, dans la fenêtre de l'appel.

44. **L'élève sans code** lit « Viens me voir pour qu'on le mette en place » : cela devient « lève la main ».

**Mon verdict pour demain**

45. Demain, c'est le premier QCM, donc **placement libre**, par ta propre règle. Les points 15, 17 à 19 et 39 à 43, et le clic en direct du point 16, ne servent qu'au **deuxième QCM** : c'est un **lot 2**, après demain.

46. **Pour demain, il faut le lot 1** : les points 5, 7, 8, 9, 12 à 14, 16 (seulement la liste de qui est avec qui), 20 à 38 et 44.

47. **C'est faisable aujourd'hui en micro, sur ton ordre**, si tu tranches ce matin **et si l'écriture en production revient** (points 51 à 54). Par mandat, l'aller-retour (exécutante, puis audit, puis promotion sur captures) ne tient pas sûrement dans la journée.

48. **Mon banc** : une copie de ton hub, ton poste, une tablette en deux moitiés et une tablette à un seul élève, pour une séance entière de ta 3e de demain. Je mesure aussi la question 3 (6 choix) sur une demi-tablette de 1 280 × 800.

49. **Si ce n'est pas promu ce soir**, demain se fait avec l'app actuelle, un élève par tablette.

50. **J'ai besoin de tes heures de QCM demain** (quelle 4e, quelle 3e, à quelle heure) pour caler la promotion et tes tests.

**Le blocage de la production**

51. **Je ne peux toujours pas écrire dans la production** (`siteflow-io/monsieurjaipascompris`). Je viens de réessayer après tes jetons ; GitHub répond encore : « Claude doesn't have GitHub access to siteflow-io/monsieurjaipascompris for your organization ». **Les jetons n'y changent rien** : depuis ce matin, tout passe par l'accès GitHub de la session, et la voie des jetons est fermée en écriture, même pour le sas. Le sas passe par cet accès ; la production, non.

52. **Les dettes 179 à 184** sont écrites, renvoyées aux numéros de ce cadrage, et prêtes dans la production en local ; en attendant, elles sont au sas : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/DETTES-QCM-179-184-A-REPORTER.md

53. **Le remède, de ton côté.** Puisque le sas passe et pas la production, l'app Claude installée sur siteflow-io n'a pas la production dans ses dépôts autorisés. Sur GitHub : réglages de l'organisation siteflow-io → GitHub Apps → Claude → Configure → Repository access → ajouter `monsieurjaipascompris`. Sinon, GitHub donne ces deux liens : https://github.com/apps/claude/installations/select_target et https://claude.ai/customize/connectors?auth_start=github&auth_start_force=1

54. **Tant que ce n'est pas fait, aucune promotion n'est possible d'ici.** L'autre voie : tu promeus toi-même. Je dépose le fichier au sas, et tu le téléverses dans la production.


---

## Tour 559 — suite aux réponses de Paul (points 55 à 86)

55. **Tes réponses 1 à 27 sont inscrites mot pour mot** dans le document de cadrage du QCM : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/CADRAGE-QCM.md. J'attends tes réponses de 28 à 54. Je ne reprends ci-dessous que ce qui demande une réponse ou une mise en tension.

56. **Sur 1 et 2 (décorréler)** : compris. Chaque question porte ses propres temps, réflexion et réponse, que l'IA donne dans le JSON ; le niveau ne sert plus qu'aux points, à la couleur et au bilan. Conséquence : mes points 34 à 37 changent. Les durées par niveau ne restent qu'en valeurs par défaut, pour les évaluations déjà écrites ; tes deux évaluations de demain n'ont aucun temps par question.

57. **Mesuré, et cela te donne raison sur 2** : dans tes trois séances de juin (13 questions chacune), tu as ajouté du temps 44, 42 et 34 fois (« +5 s », « +10 s », « +30 s »). Cela fait 11 min, 8 min et 5 min 30 ajoutées par séance.

58. **La garde de débordement, ma proposition : deux gardes.** Dans le prompt, l'IA estime le temps d'écriture de chaque question et te répond « ça ne rentre pas » si le temps demandé est trop court ; elle vérifie aussi que le total tient dans 45 minutes, correction comprise. Dans l'app, au collage de l'évaluation puis au lancement, la séance est comptée (questions, passages de tablette, correction), avec par exemple : « Cette évaluation dure 52 min : elle déborde des 45 minutes utiles. »

59. **Pour compter la correction, il me manque une mesure** : le hub ne garde aucune heure pendant la correction, donc je ne peux pas la mesurer sur juin. Ma proposition : 1 minute par question corrigée en attendant, et l'app note désormais le début et la fin de chaque correction, pour remplacer cette estimation par ta vraie durée. Dis-moi si 1 minute te paraît juste.

60. **Mesuré aussi : la phase des questions a pris en juin entre 1 min et 1 min 30 par question** (20, 16 et 13 min pour 13 questions), temps ajoutés compris. À ce rythme, ta 4e de demain (21 questions) prend 21 à 32 min de questions, avant la correction.

61. **Sur 3 : les boutons existent, mais ils sont cachés.** « ⚙️ Durées des niveaux » n'apparaît que dans le poste de pilotage, replié, une fois la séance lancée ; « ⚖️ Pondération des niveaux » est dans Données → Sauvegarde, sous l'export. Ma proposition : réunir les deux dans Réglages, sous « Les niveaux », et mettre les temps de chaque question dans l'éditeur de l'évaluation, à côté de la pastille de niveau.

62. **Sur 4** : c'est noté, le prompt s'écrit en dernier, quand l'app est entièrement cadrée.

63. **Sur 5** : tu as raison, les moitiés n'existent pas encore dans le QCM, et ce défaut ne se voit pas aujourd'hui. Je le corrige par anticipation, dans le même lot.

64. **Sur 6 : le QCM n'a pas d'heure de fin.** Une séance ne finit que par « Terminer la session ». Ma proposition, sur le modèle de ta règle de la dictée du 03/10 (« heure de fin + 10 minutes ») : au lancement, la séance reçoit une heure de fin (lancement + 55 min, modifiable dans la fenêtre de l'appel) ; la tablette oublie ses deux élèves à « Terminer la session », ou à l'heure de fin + 10 min si tu as oublié de terminer.

65. **Sur 7 et 12 : l'app doit savoir qu'elle est sur une tablette de classe.** Le même QCM s'ouvre aussi sur le téléphone de l'élève, au CDI ou à la maison (pour « Mes évaluations » et la saisie papier) : là, il n'y a qu'une personne, et le raccourci MJPC reste. Ma proposition : une adresse à part pour les tablettes (…/evaluation-qcm.html?tablette), mise une fois pour toutes en icône sur l'écran d'accueil de chaque tablette de classe. Elle ouvre directement les deux moitiés, sans raccourci MJPC et sans choix de classe ; l'adresse habituelle reste comme aujourd'hui.

66. **Ma question, pour 65** : aujourd'hui, comment tes élèves ouvrent-ils le QCM sur les tablettes : une adresse tapée, un favori, un QR au tableau, un lien depuis le site ?

67. **Sur 9 : oui, la séance est archivée, et c'est sommaire.** Mesuré, pour chaque élève et chaque séance, l'archive garde : la date, le titre et la version ; le score app, brut et pondéré ; la fourchette estimée, la fourchette réelle et la calibration ; question par question, le niveau, les points, juste ou faux ; la page de bilan. L'écart papier/écran n'est pas dans l'archive : il vit dans la séance (la saisie papier) et dans l'export CSV. L'étanchéité (9) entre dans le lot 1. Ce qu'il faut ajouter pour École Directe (notes, compétences) est inscrit comme dette, à cadrer après.

68. **Sur 10, redit simplement.** Aujourd'hui, c'est la page de pilotage ouverte sur ton ordinateur qui fait tout passer : à la fin du chrono de réflexion, elle fait passer les tablettes à la réponse, et à la fin du chrono de réponse, elle ferme. Si cette page n'est pas ouverte (tu pilotes seulement au téléphone), le chrono arrive à 0 et rien ne se passe : les tablettes restent bloquées. Ma proposition : avec l'horloge commune du hub (8), n'importe quel écran ouvert (ton poste, le tableau, ton téléphone) fait passer la phase, le premier qui arrive à 0. Plus aucun écran n'est indispensable.

69. **Sur 11** : oui, ton 6 y répond. Le 11 n'était qu'une précision, il n'y avait rien à trancher.

70. **Sur 12, une tension avec la dictée** : le 07/10 (tour 542), tu avais décidé que « Combien êtes-vous ? » restait dans la dictée, et tu dis maintenant « pareil en dictée ». Je l'inscris pour la reprise de la dictée, sans y toucher pendant la pause. Dans le QCM : toujours deux moitiés, et une moitié vide veut dire que l'élève est seul (27).

71. **Sur 12, au premier QCM** : en placement libre, il n'y a pas encore de constitution. L'élève seul (classe impaire) a une moitié vide, qui reste sur l'écran du code ; un retardataire peut s'y asseoir.

72. **Sur 14 : déplacer des élèves, ma proposition.** Sur ta console, chaque tablette montre ses deux moitiés. Tu glisses un nom sur un autre : les deux élèves s'échangent ; tu le glisses sur une moitié vide : il s'y déplace. Avant la question 1, c'est libre. Pendant la séance aussi, mais les deux élèves déplacés changent de tablette : leurs moitiés affichent « Julien, va sur la tablette de Léa et Tom », et ils retapent leur code sur leur nouvelle moitié (c'est la seule exception au 6). Leurs réponses déjà données les suivent.

73. **Sur 16** : je te fais les captures de ta console dès que tu as répondu de 28 à 54, parce que 29 à 33, 36, 43 et 72 touchent ta console.

74. **Sur 21 : l'ordre mélangé, ma proposition.** Celui qui répond en premier voit l'ordre de l'évaluation, celui du tableau. Le second voit un autre ordre, où aucune bonne réponse ne garde sa lettre : s'il recopie les lettres de son voisin, il se trompe à coup sûr (et en mode partiel, chaque case en trop lui coûte un point). Comme on alterne (25), chacun est second une question sur deux.

75. **Sur 21 : la collecte des réponses ne pose aucun problème.** La tablette enregistre le choix lui-même, pas sa lettre : le score app, la correction, le bilan et le tableau des scores restent justes.

76. **Sur 21 : le problème, c'est la feuille.** La feuille imprimée porte des lettres sans contenu, et la saisie papier à la maison ne montre que l'énoncé et les lettres. Si l'élève entoure sur sa feuille la lettre de **son** ordre mélangé, sa saisie à la maison est fausse, et avec elle l'écart papier/écran et le score officiel.

77. **Ma question, pour 76** : à quel moment tes élèves entourent-ils la lettre sur leur feuille, pendant la réponse ou pendant la correction (avec les lettres projetées) ?

78. **Si c'est pendant la correction**, rien ne casse.

79. **Si c'est pendant la réponse, ma proposition** : l'app retient l'ordre que chaque élève a vu. Partout où il revoit la question, sur sa moitié pendant la correction, dans la saisie à la maison et dans ses résultats, il la revoit dans son ordre. Le tableau, lui, garde l'ordre de l'évaluation : en correction, tu dis la bonne réponse par son contenu (« la bonne réponse, c'est … »), pas par sa lettre.

80. **Sur 21 : la phrase du second tour.** Pour la moitié de Julien, tu as écrit « laisse la tablette à Julien » : je comprends « à Michel ». Tu as aussi écrit « laisse » au lieu de « donne ». Je propose la même phrase des deux côtés : « Donne la tablette à X pour qu'il réponde sans que tu regardes. » Dis-moi quel verbe tu veux.

81. **Sur 25 : ils n'ont le même temps de réflexion que si le second pose son stylo dès le début de la réponse.** Sinon, pendant le tour du premier (3 s, 5 s, puis 3 s), il peut continuer à écrire sur sa feuille. Aujourd'hui, « POSE TON STYLO » ne s'affiche que sur l'écran de celui qui répond. Ma proposition : au début de la réponse, les deux moitiés affichent « POSE TON STYLO » (la phrase est déjà dans l'app), avec le voile.

82. **Pour demain, mon verdict 47 ne tient plus.** Le lot 1 a grandi avec 1, 2, 14, 16 et 21 ; ta console doit passer par des captures à valider ; et je ne peux toujours pas écrire en production (51). Demain se fait donc avec l'app actuelle, un élève par tablette (49).

83. **Pour demain, avec l'app actuelle, premier geste** : garde la page de pilotage ouverte sur l'ordinateur (68).

84. **Pour demain, deuxième geste** : règle les durées avant la question 1. Lance la séance, déplie « ⚙️ Durées des niveaux » en haut du pilotage, mets tes temps, puis « 💾 Sauvegarder » (c'est gardé pour toutes les séances). Le temps de réponse se règle dans la case « ✋ Réponse » du pilotage, entre deux questions, de 3 à 30 s.

85. **Pour demain, troisième geste** : compte tes 45 minutes. Au rythme de juin, ta 4e (21 questions) prend 21 à 32 min avant la correction, et ta 3e (11 questions) 11 à 17 min (60).

86. **Registre** : la dette 183 est mise à jour (décorréler les temps du niveau), et cinq dettes sont ajoutées : 185, les temps par question et la garde de débordement ; 186, l'archive pour École Directe ; 187, la dictée sans « Combien êtes-vous ? » ; 188, déplacer des élèves entre binômes ; 189, l'ordre mélangé du second. La production est toujours fermée, donc elles sont au sas : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/DETTES-QCM-179-184-A-REPORTER.md

---

## Tour 560 — réponses de Paul (08/10, 09:09), mot pour mot

> 65. Non, pas de favori sur les tablettes. Je leur donne l'adresse siteflow etc mode élève. On doit faire comme la dictée. Sinon, on garde le choix 1 ou 2 élèves, comme ça en 2 élèves l'App sait que c'est tablette et ça régle la question ( 1 c'est pour tout le reste). 2 élèves, je le dis à l'oral systématiquement. Et retour possible, toujours, si un élève se trompe et sélectionne 1. 9. Oui à cadrer. 10. Normalement j'ai toujours le pilotage ouvert sur l'ordi mais effectivement il faut prévoir le cas où je ne l'ai pas ( mais bon, la vue tableau je l'ouvre sur mon ordi... Donc via le pilotage de toute façon ). 12. Non, du coup on garde bien le choix 1 ou 2 élèves. Ça règle la question. Sur 12. Ok. 14. Ok c'est une bonne fonctionnalité. Il faut être sûr et certain que ça suive bien. 16. Il faudra me redonner les questions 28 à 54 pour que j'y reponde. 21. Je n'avais effectivement pas pensé que les réponses s'affichaient au tableau en phase de réponse. Dans ce cas, les réponses ne s'affichent jamais au tableau. Uniquement sur les tablettes. A mesurer et voir pour télescopage ou pas. 21. La feuille: j'avais codé cette fonctionnalité pour si jamais un jour pas de connexion, quand même faire l'évaluation sur papier. D'ailleurs, c'est à revoir aussi, parce qu'actuellement ça imprime 6 feuilles par élève, ça ne va pas. 76. Du coup c'est à cadrer. 21. Le verbe laisse. Et oui j'ai peut-être interverti les élèves d'exemple. Oui sur 25. 82. Non, le codage sera fait par une exécutante de Claude code, la totalité des livraisons, puis audit final.  Pour demain: je vais adapter les QCM actuellement en place en les repassant dans une ia avec le nouveau prompt.

## Tour 560 — suite (points 87 à 104, et 28 à 44, 58, 59, 61, 64, 74 redonnés)

87. **Tes réponses sont inscrites mot pour mot** dans le document de cadrage, sous chaque point : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/CADRAGE-QCM.md

**Les questions 28 à 54, redonnées (mêmes numéros, mises à jour d'après tes réponses)**

28. **Le coût en temps** de l'alternance, mesuré sur tes deux évaluations de demain (réponse 5 s, passage 3 s) : 16 s par question au lieu de 5, soit +4 min en 4e (21 questions) et +2 min en 3e (11 questions). C'est une mesure, rien à trancher, sauf si tu veux réagir.

29. **« Rouvrir pour tous »** : les deux tours recommencent ; celui qui a déjà répondu reste voilé, avec « Ta réponse est enregistrée ».

30. **La réouverture pour un seul élève** : sa moitié s'ouvre sans chrono, et l'autre est voilée avec « Laisse la tablette à X pour qu'il réponde sans que tu regardes. »

31. **La pause** gèle le tour en cours, voile compris.

32. **L'autoévaluation et la correction** se font sur les deux moitiés en même temps, sans voile : il n'y a plus rien à copier.

33. **La vue tableau** affiche « 1er tour » ou « 2e tour » à côté du chrono, sans jamais les choix (ton 21).

34. **Le temps de réponse (mis à jour par 56)** se règle question par question, comme la réflexion, dans le JSON donné par l'IA. Il n'a plus de plafond à 30 s : la seule limite, c'est la garde de débordement (58).

35. **Les niveaux (mis à jour par 56)** restent quatre, avec leurs noms ; ils ne donnent plus que les points, la couleur et le bilan.

36. **Le panneau « Les niveaux », dans Réglages (mis à jour par 56 et 61)** : pour chaque niveau, les points et les temps par défaut d'une question qui n'a pas les siens (tes évaluations déjà écrites) ; en plus, le temps de passage de la tablette (26).

37. **Le prompt (mis à jour par 62)** s'écrit en dernier : il donnera les deux temps de chaque question et fera la première garde de débordement (58).

38. **Le rechargement pendant le QCM** : tu y as répondu par ton 6 (l'élève ne retape jamais son code pendant l'heure, la tablette l'oublie à la fin de l'heure). Rien à trancher.

39. **La constitution** : au premier QCM, placement libre (aucune annonce, aucun refus) ; ensuite, d'après le QCM précédent, un classement, puis les binômes 1-2, 3-4, 5-6…

40. **Le résultat retenu** : le score app pondéré, connu dès la fin de la séance et pour tous. Le score officiel n'existe qu'après la saisie à la maison, que tous ne font pas.

41. **Le QCM précédent** : la dernière séance terminée de la classe, quelle que soit l'évaluation.

42. **Sans résultat, et nombre impair** : les absents du QCM précédent sont appariés entre eux ; s'il reste un élève, c'est le dernier du classement qui est seul, avec une moitié vide.

43. **Le choix du mode** est automatique : placement libre s'il n'y a pas de QCM précédent, sinon d'après les résultats. Tu peux le changer au lancement, dans la fenêtre de l'appel.

44. **L'élève sans code** lit aujourd'hui « Viens me voir pour qu'on le mette en place » : cela devient « lève la main ».

45 à 50 (le verdict pour demain) : **sans objet**. Tu as tranché en 82 : tout passe par une exécutante, puis un audit final, et demain se fait avec tes QCM adaptés (voir 100 à 102).

51 à 54 (l'écriture en production) : rien n'a changé, je ne peux toujours pas écrire en production. Cela ne bloque pas le cadrage ni le mandat, seulement la promotion. Le seul geste est le tien (53) : sur GitHub, réglages de l'organisation siteflow-io → GitHub Apps → Claude → Configure → Repository access → ajouter `monsieurjaipascompris`.

**Restent aussi à trancher, de ma réponse précédente (mêmes numéros)**

58. **Deux gardes de débordement.** Dans le prompt, l'IA estime le temps d'écriture de chaque question et te dit « ça ne rentre pas » si le temps est trop court, et elle vérifie que le total tient dans 45 minutes, correction comprise. Dans l'app, au collage puis au lancement : « Cette évaluation dure 52 min : elle déborde des 45 minutes utiles. »

59. **Le temps de correction** : 1 minute par question en attendant ; l'app note désormais le début et la fin de chaque correction, pour qu'on le remplace par ta vraie durée. Est-ce qu'1 minute te paraît juste ?

61. **Où régler** : « Durées des niveaux » (aujourd'hui caché dans le pilotage, séance lancée) et « Pondération » (aujourd'hui dans Données → Sauvegarde) réunis dans Réglages, sous « Les niveaux » ; les temps de chaque question dans l'éditeur de l'évaluation, à côté de la pastille de niveau.

64. **La fin de l'heure** : le QCM n'en a pas aujourd'hui. Au lancement, la séance reçoit une heure de fin (lancement + 55 min, modifiable dans la fenêtre de l'appel). La tablette oublie ses deux élèves à « Terminer la session », ou à l'heure de fin + 10 min si tu as oublié de terminer.

74. **L'ordre mélangé (mis à jour par ton 21 : jamais de choix au tableau)** : celui qui répond en premier voit l'ordre de l'évaluation ; le second voit un autre ordre, où aucune bonne réponse ne garde sa lettre. S'il recopie les lettres de son voisin, il se trompe à coup sûr ; en mode partiel, chaque case en trop lui coûte un point.

**Suite à tes réponses**

88. **Sur 65 : c'est retenu.** On garde « Combien êtes-vous ? ». « 2 élèves », c'est la tablette de classe : deux moitiés, sans raccourci MJPC et sans choix de classe. « 1 élève », c'est tout le reste (téléphone, CDI, maison). Le « ← Retour » vers la question est toujours là, si un élève touche 1 par erreur. En classe, tu dis toujours « 2 » ; l'élève seul choisit 2 et garde une moitié vide.

89. **Sur 65, une tension avec ton 7.** Sur une tablette de classe, l'élève qui touche « 1 » par erreur retombe sur le raccourci MJPC. Si un autre élève s'est connecté au site sur cette tablette dans les 12 dernières heures, il entre sous son nom. Ma proposition : en « 1 élève », le raccourci n'entre plus directement. Il affiche d'abord le nom, avec deux boutons : « C'est moi » et « Ce n'est pas moi », qui ouvre l'écran du code. Ce sont des mots vus par l'élève : donne-moi les tiens, ou dis « ok » pour ceux-là.

90. **Sur 12 et 70** : la dictée garde aussi « Combien êtes-vous ? ». Il n'y a plus de tension avec ta décision du 07/10, et la dette 187 est close, sans objet. Ton « sur 12 : ok » vaut pour 71 (l'élève seul a une moitié vide, un retardataire peut s'y asseoir).

91. **Sur 10** : c'est retenu (68). N'importe quel écran ouvert fait passer la phase, ton poste, la vue tableau ou ton téléphone. Plus aucun écran n'est indispensable.

92. **Sur 14, « sûr et certain que ça suive »** : il aura son banc propre, à deux navigateurs et sur deux tablettes. On y déplace un élève avant la question 1, pendant la réflexion, pendant le tour de réponse, puis on recharge une tablette entre deux déplacements. Le banc vérifie à chaque fois que les réponses déjà données suivent l'élève, que les quatre moitiés changent sans rechargement, et qu'aucune réponse n'est perdue ni comptée deux fois.

93. **Sur 21, mesuré : ce que la vue tableau montre aujourd'hui.** En réponse, l'énoncé, les choix avec leurs lettres, le chrono et « n / N ont répondu ». En correction, l'énoncé, les choix avec leurs lettres, les bonnes réponses en vert, « ✅ Bonne réponse : B, D » et l'explication. Sur la tablette, la correction montre les choix avec leurs lettres, la réponse de l'élève et la bonne.

94. **Sur 21, le télescopage : la correction.** En réponse, retirer les choix du tableau ne casse rien. Mais en correction, tes élèves corrigent en regardant le tableau, et les lettres n'y veulent plus rien dire pour celui qui avait l'ordre mélangé. Ma question : « jamais au tableau », est-ce aussi pendant la correction ?

95. **Ma proposition, pour 94** : en correction, le tableau montre les choix **sans lettres**, les bonnes en vert, et l'explication ; il n'affiche plus « Bonne réponse : B, D ». Chaque tablette montre à l'élève la question dans l'ordre qu'il a vu, avec sa réponse et la bonne (79).

96. **Sur 21 et 76, la feuille : mesuré.** J'ai imprimé en PDF la feuille de tes deux évaluations de demain, avec la mise en page de l'app : 7 pages par élève pour ta 4e (21 questions) et 4 pages pour ta 3e (11 questions). Chaque question prend tout un cadre (énoncé, cadre d'écriture, lettres), et aucun cadre n'est coupé entre deux pages. Ma question : combien de pages au plus par élève veux-tu pour cette feuille de secours ?

97. **Sur 76, ma proposition** : la saisie papier à la maison montre le **texte** des choix, dans l'ordre que l'élève a vu en classe, et plus seulement les lettres. Il retrouve sa réponse d'après ce qu'il a rédigé sur sa feuille, sans avoir besoin d'une lettre sur le papier. Cela règle à la fois l'ordre mélangé et la feuille libre, qui n'a pas de lettres.

98. **Sur 80** : c'est retenu, le verbe « laisse », des deux côtés : « Laisse la tablette à X pour qu'il réponde sans que tu regardes. »

99. **Sur 81** : c'est retenu. Au début de la réponse, les deux moitiés affichent « POSE TON STYLO », puis le voile tombe sur celle qui attend.

100. **Sur 82 : c'est retenu.** Une exécutante en session cloud fait toutes les livraisons à la suite, puis je fais un audit final, puis tu promeus. J'écris le mandat quand le cadrage est fini, captures de ta console validées comprises (73).

101. **Pour demain, « le nouveau prompt » n'existe pas encore** : il s'écrit en dernier (62), et l'app de demain (7.7.1) ne sait pas lire un temps par question. Dans l'app d'aujourd'hui, le temps de réflexion vient seulement du niveau (de 1 à 120 s, le même pour toutes les questions d'un niveau) et le temps de réponse est le même pour toutes les questions (de 3 à 30 s). Un niveau changé change aussi les points. Je te donne donc un **prompt de transition**, fait pour l'app d'aujourd'hui. L'IA estime le temps d'écriture de chaque question ; elle te donne les durées à régler pour chaque niveau et le temps de réponse ; elle dit si la séance tient dans 45 minutes, correction comprise ; s'il le faut, elle propose quoi retirer et attend ton accord ; enfin, elle te rend le JSON au format exact de l'app, sans champ nouveau.

102. **Le prompt de transition**, à coller dans une IA avec le JSON de ton évaluation (✏️ Modifier, le texte du haut). Ensuite, tu recolles le JSON rendu au même endroit, puis « 🔍 Vérifier le format » : cela crée une nouvelle version, sans risque, car aucune séance n'a encore utilisé ces deux évaluations. Puis tu règles les durées données : lance la séance, déplie « ⚙️ Durées des niveaux », « 💾 Sauvegarder » ; le temps de réponse va dans la case « ✋ Réponse » (84). Le prompt est aussi au sas : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/PROMPT-QCM-TRANSITION-09-10.md

```
Tu vas vérifier et ajuster une évaluation QCM existante pour mon application, telle qu'elle fonctionne aujourd'hui. Je te colle son JSON à la fin.

COMMENT SE PASSE UNE SÉANCE (respecte-le dans tous tes calculs)
- Une séance dure 45 minutes utiles en tout : la phase des questions, puis la correction collective dans la foulée.
- Pour chaque question : 1) réflexion : l'élève voit l'énoncé seul (les choix sont cachés) et rédige sa réponse EN ENTIER, à la main, sur sa feuille ; 2) réponse : les choix apparaissent, l'élève pose son stylo, relit sa feuille et touche la ou les lettres.
- Le temps de réflexion dépend UNIQUEMENT du niveau de la question : il est le même pour toutes les questions d'un même niveau, et se règle entre 1 et 120 secondes par niveau.
- Le temps de réponse est le même pour toutes les questions de l'évaluation, entre 3 et 30 secondes.
- Le niveau donne aussi les points : facile 1, standard 2, approfondi 3, expert 4. Changer le niveau d'une question change donc ses points : ne le fais jamais sans me le demander.
- Entre deux questions, compte 15 secondes (je lance la suivante).
- Correction : compte 1 minute par question, sauf si je te donne un autre chiffre.
- Repère réel : dans mes séances de juin, une question a pris en classe entre 1 minute et 1 minute 30 (réflexion, réponse et temps ajoutés compris). Si ton calcul donne beaucoup moins, dis-le.

CE QUE TU FAIS, DANS CET ORDRE
1. Pose-moi d'abord ces questions et attends mes réponses : la classe (4e ou 3e) ; combien de minutes je garde pour l'installation et la consigne (par défaut 5) ; si 1 minute de correction par question me convient.
2. Pour chaque question, estime le temps qu'un élève de cette classe met à lire l'énoncé et à rédiger sa réponse complète à la main (base : 10 mots par minute en rédigeant, plus le temps de lecture). Donne-le dans un tableau : numéro, niveau, réponse attendue en quelques mots, temps estimé.
3. Pour chaque niveau, propose le temps de réflexion à régler : celui de la question la plus longue de ce niveau, arrondi aux 5 secondes au-dessus. Si une question dépasse 120 secondes, écris : « La question n ne rentre pas dans le temps de réflexion maximal », et propose de la scinder ou de la raccourcir.
4. Propose le temps de réponse : le temps de lire tous les choix de la question la plus chargée et de toucher les lettres (base : 2,5 mots par seconde en lecture, plus 2 secondes par lettre à toucher), arrondi aux 5 secondes au-dessus. S'il dépasse 30 secondes, écris : « La question n ne rentre pas dans le temps de réponse maximal », et propose de raccourcir ses choix.
5. Calcule le total : installation + somme des temps de réflexion de toutes les questions + (temps de réponse + 15 s) × nombre de questions + correction. Écris clairement « Ça rentre dans 45 minutes (total : … min) » ou « Ça ne rentre pas : il manque … minutes ».
6. Si ça ne rentre pas, propose une solution SANS l'appliquer : les questions à retirer (d'abord celles qui coûtent le plus de temps pour le moins de points), ou les choix à raccourcir. Attends mon accord.
7. Quand je t'ai répondu, rends-moi le JSON corrigé au même format exact que celui que je t'ai donné (titre, mode, questions avec enonce, choix, bonnes, niveau, explication), sans aucun autre champ, dans un seul bloc ; puis, en dessous, le récapitulatif : « Durées des niveaux : facile … s, standard … s, approfondi … s, expert … s. Temps de réponse : … s. Durée totale : … min. »

RÈGLES
- Ne change jamais un énoncé, un choix, une bonne réponse, un niveau ou une explication sans mon accord.
- Si tu raccourcis des choix (avec mon accord), garde exactement le même sens et la même bonne réponse, au même rang.
- Réponds en français simple.

Voici l'évaluation :
[colle ici le JSON]
```

103. **Ce que ce prompt ne fait pas** : il ne règle rien dans l'app. Les durées des niveaux sont communes à toutes tes évaluations : celles que tu règles pour la 4e restent pour la 3e, si tu ne les changes pas entre les deux séances.

104. **Registre** : la dette 187 est close (sans objet, 90). La dette 189 reçoit tes décisions (« laisse », jamais au tableau, 76 à cadrer). Deux dettes sont ajoutées : 190, la feuille de secours (7 et 4 pages par élève) ; 191, plus aucun choix au tableau, et ce que cela change à la correction. Elles sont au sas, la production étant toujours fermée : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/DETTES-QCM-179-184-A-REPORTER.md
