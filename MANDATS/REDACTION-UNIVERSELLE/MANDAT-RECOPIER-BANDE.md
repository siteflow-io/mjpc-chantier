# MANDAT — RÉDACTION : RECOPIER LA COPIE, PUIS LA BANDE DES FAUTES

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul garde la rédaction de chaque élève en entier, avec ses fautes et sa correspondance avec la photo : « au profil longitudinal de l'élève c'est hautement précieux » (C14, 16:38). Il recopie à côté de la photo, puis examine les fautes proposées par comparaison. Il décide de chacune. Le travail déjà fait pendant le développement reste lisible.

## Statut et références
**VERSION À COMPLÉTER — révision C15 du 30/10/2026, complétée suivant le prompt de 21:30**, sur « Ok continue » de Paul, après la proposition C15 68. Cette révision remplace le texte C14 du 30/10 à 19:11 ; elle corrige le mandat et la sortie de son banc. Elle ne lance pas le codage fonctionnel de la recopie ou de la bande, et n'autorise aucune promotion. L'exécutant prépare un périmètre qu'il peut livrer en entier ; il ne s'arrête pas au milieu d'un mandat.

Références à lire : `TRANSCRIPTS/C14/TRANSCRIPT-C14.md` jusqu'au dernier tour ; **le tour 25 reste l'état de référence**. Le tour 24 précise la demande de recopie d'abord, le tour 27 confirme l'audit C15 et propose aussi la correction de la sortie du banc ; le tour 28 vérifie la révision et rappelle la première mission de l'exécutant ; le tour 29 met à jour le prompt C15 et organise la relève. Audit détaillé : `TRANSCRIPTS/C15/TRANSCRIPT-C15.md`, tour 1, huit écarts. Registre unique en production : `docs/MJPC6-DETTES.md`, premier flux des scans, surtout ⑧, ⑨, ⑪ et les défauts repris au point 59. Règles : `PROTOCOLE-MAQUETTE.md`, `docs/MJPC6-1-DISPOSITIF.md` (notamment 27 : emprunter la tokenisation).

L'ordre **61** est **validé par Paul** (« Ok », après C15 90, transcript C15 tour 7, le 30/10/2026) : **56 la recopie**, **57 la bande des fautes**, **58 la grille dans la bande**, et **59 réglé avant la première mise en ligne**. Ces interventions se préparent séparément : les touches de la bande ne bloquent pas la recopie. Le fichier de recopies **53** reste conditionnel ; la confirmation des lignes sur des pages entières **36** reste à faire. La suppression des quatre passes **45** attend la grille dans la bande. Les touches **51** se reposent simplement à Paul quand on aborde 57.


**Vérification préalable C15, 30/10/2026 :** le site a été ouvert dans le navigateur, mais reste à l'entrée professeur, sans session ouverte. Le banc courant, blob `6edec4937325512999c4b5f72c31f142b6271ad0`, a été lancé sur la dernière maquette scans `T399-maquette-redaction-scans-v14.html` avec les deux PDF d'essai du sas, vérifiés contre leurs blobs. Il s'arrête à la création du navigateur : Chromium manque dans cet atelier. Une tentative d'installation du navigateur officiel, dans le dossier de travail, échoue sur une archive invalide ; aucun navigateur n'a été installé. **Zéro vérification fonctionnelle exécutée, aucun nouveau résultat 49/0.** Tant que le banc complet ne peut pas tourner et que l'existant n'a pas été joué, le travail reste au cadrage, suivant le prompt C15. Aucune modification fonctionnelle ni promotion. L'accord sur 61 ne valide pas le fichier de recopies 53.

## Première mission de l'exécutant — auditer avant de coder
Avant de commencer le codage de l'intervention, relire intégralement ce mandat et le confronter aux transcripts C14 et C15 jusqu'à leur dernier tour, au registre `docs/MJPC6-DETTES.md` (notamment ⑧, ⑨ et ⑪) et au code courant. Vérifier les consignes par la lecture du code et par les mesures possibles.

**Signaler les erreurs de la conscience avant de coder** : toute contradiction, consigne impossible ou hypothèse présentée comme une mesure doit être relevée et accompagnée de sa preuve. Ne pas appliquer silencieusement une consigne erronée ni remplacer l'audit par une exécution supposée correcte.

C'est la première mission fixée par Paul le 21/10, rappelée par C14 84 et par le prompt C15 mis à jour le 30/10 à 21:30.

## La base : reconstruire le fichier courant avant de le modifier
La référence du dépôt relue par C15 est `redaction.html` **1.2.3-RU**, blob `753ebaaec117ffd1ae406a15edab2e0dc955884a`, **533 112 octets**, md5 `bde58bd636a12ea3e6af66474b476e38`. Ce constat porte sur le dépôt ; il ne remplace pas une vérification du fichier servi en ligne.

Le générateur actuel `maquette/gen-maquette.py` **refuse le fichier qui porte déjà les scans**. Il part de `SAUVEGARDES/redaction-1.1.0-RU-avant-scans-2026-10-30.html`, md5 `f7c2c85e05468c7dd74d785eb9aa707c`, et y injecte les sources courantes `scan.js`, `scan.css`, `eleve.js` et les transformations 1.2.3. Ne pas lui donner la 1.2.3 comme entrée et ne pas supprimer son assertion pour contourner ce contrôle.

Avant toute modification fonctionnelle, figer les sources et reconstruire la référence. Depuis `maquette/`, la commande de référence est :
```sh
PROD=1 VERSION=1.2.3-RU python3 gen-maquette.py ../../../SAUVEGARDES/redaction-1.1.0-RU-avant-scans-2026-10-30.html <dossier-des-lectures> <sortie-de-reference.html>
```
Comparer les **octets** de la sortie avec le fichier courant de production, pas seulement les numéros de version. Une différence interdit de poursuivre sur cette base. Si la production a changé depuis cette révision, reprendre sa nouvelle référence et prouver la conservation de tout ce qui y a été ajouté.

**Mesure C15 de ce tour :** huit fichiers d'entrée et de référence vérifiés contre leurs blobs GitHub ; reconstruction 1.2.3 avec quatre entrées JSON inventées, sans appel à Firebase : **533 112 octets identiques**, même md5. Le générateur lancé avec la 1.2.3 comme entrée refuse et ne produit aucun fichier. Les entrées inventées suffisent ici à vérifier la construction `PROD=1` ; elles ne prouvent pas les gestes de l'app.

La maquette fonctionnelle reprend ce même code, avec la nouveauté dedans, sur le faux hub aussi strict que Firebase, alimenté par une copie anonymisée des lectures autorisées. Les noms, textes et photos réels restent hors du sas. Le mode `PROD=1` sert à construire un fichier ; il ne le met jamais en ligne.

## 56 — Recopier
Un bouton « ✍ Recopier » dans l'en-tête des scans ouvre la photo à gauche et une feuille lignée à droite, avec les mêmes lignes à la même hauteur. Les lignes écrites sont cherchées dans l'encre après retrait de la réglure. Les lignes sont cadrées avant la frappe : chaque ligne est un trait vert avec ses poignées gauche et droite pour être recalée ; des boutons permettent d'ajouter et de retirer une ligne. Le texte commence en face du début de la ligne manuscrite. La ligne en cours est encadrée sur la photo et montrée en grand juste au-dessus du champ de frappe.

Entrée passe à la ligne suivante ; ↑ et ↓ changent de ligne. La recopie conserve exactement fautes, ponctuation, mots barrés et mots coupés. La saisie, les lignes recalées et la position de reprise sont enregistrées ; un redessin ne remplace jamais le champ où Paul écrit. Chaque ligne a une identité stable : son rang affiché ne sert pas d'identité. Recaler ou insérer une ligne ne rattache pas le texte ni ses marques à une autre ligne.

**Ce qui est mesuré et ce qui ne l'est pas :** C14 a trouvé 11 lignes sur 11 sur un fragment d'une seule page. Sur trois ou quatre pages entières, et pour le début horizontal de toutes les lignes : je ne sais pas. La mesure du fragment ne valide pas ces deux points. Le point 36 reste nécessaire pour confirmer ces résultats. Une ligne ajoutée de deux mots, une pente, une rature et un grand blanc font partie des cas à éprouver. Si le cadrage n'est pas juste, les poignées servent à le corriger avant la frappe ; un résultat non mesuré n'est pas annoncé comme exact.

Sur une ancienne copie, la détection ou la recopie ne remplace jamais seule le total de lignes déjà saisi par Paul : ce total intervient dans sa note. Les données de recopie s'ajoutent aux données existantes. Les textes sont des valeurs, jamais des noms de clés ; conserver les protections `scCles`, `scCleSite` et `scFb` de 1.2.3.

### Le fichier de recopies — seulement si Paul valide 53
Ne pas présenter l'import comme acquis. Si Paul dit oui à 53, ajouter sa lecture avec les quatre règles proposées, sans les changer : chaque copie commence par « ### NOM Prénom » ; une ligne tapée correspond à une ligne écrite, même de deux mots, et les lignes vides ne sont pas tapées ; un mot barré est entre crochets [comme ça] ; « --- » indique une nouvelle page. Fautes, ponctuation et mots coupés en fin de ligne restent tels quels.

Le fichier est par classe et reste chez Paul, jamais au sas. Ses lignes se rapprochent des lignes détectées page par page ; un nombre différent se voit et se recale aux poignées. Aucune correspondance d'élève ou de page ambiguë n'est supposée correcte.

## 57 — Le texte corrigé et la bande des fautes
L'export pour l'IA reprend la demande de Paul de 16:38 : un JSON avec son prompt intégré, copies désignées par des numéros, aucun nom d'élève. Aucun appel à une IA depuis l'app, aucun service payant. Le prompt est montré à Paul avant livraison. Il impose de corriger sans reformuler, en conservant pages et lignes. Le retour doit pouvoir être rattaché à la bonne copie, à la bonne page et à la bonne ligne.

« Coller le texte corrigé » reçoit ce retour, ou un texte corrigé à la main. Le contrôle du retour se fait avant toute modification des copies : une copie, une page ou une ligne manquante ou surnuméraire est refusée avec sa raison ; le contenu déjà enregistré reste intact. Sans texte corrigé, Paul garde la correction manuelle au clavier sur le texte recopié.

La fonction `tokenize` de `correction_dictee.html` est empruntée **telle quelle**, pas réécrite. Les insertions et retraits de mots demandent l'alignement par plus longue sous-suite commune : la comparaison rang par rang avait produit 380 écarts, contre 35 après alignement (C14, tour 17). Conserver le rattachement des écarts au texte original et à sa ligne ; un mot ajouté ou retiré ne décale pas toutes les fautes suivantes. Une proposition n'est pas une faute de Paul avant sa décision.

La bande reprend l'affichage du mode rapide de la dictée : contexte centré, carte du mot et position courante, avec la photo de la **ligne entière** au-dessus. Elle s'arrête aux fautes proposées, numérotées d'avance dans la copie numérique ; la liste des arrêts est à droite. ⇧R passe au mot par mot et revient aux arrêts en gardant la même copie et sa position. Retour revient à l'arrêt ou au mot précédent. Un clic sur un autre mot permet de signaler une faute non proposée ou d'attacher une remarque.

### Les touches — 51 attend cette intervention
Le gestionnaire `scClavier` de la rédaction ne comporte **aucune touche qui pose une faute** : les fautes actuelles se posent au pointeur. Ne pas demander de reprendre un raccourci inexistant.

Dans le mode rapide de dictée, Entrée et Espace passent au mot suivant sans poser de faute ; les conserver dans cette fonction. G et L n'existent pas en rédaction. La décision sur l'action qui garde une faute proposée reste à soumettre simplement à Paul au moment de 57. Ne pas reprendre l'Entrée des images B et C14 42, qui avait le sens inverse. Mesurer toutes les touches communes dans leur contexte réel et reprendre leur fonction exacte.

### La marque sur la photo et les fautes déjà posées
La mesure C14 place le centre dans le bon mot de la photo **33 fois sur 44**, dont 18 sur 18 sur les lignes propres et 4 sur 10 sur une ligne avec rature. Le point 35, accueilli par le « Ok » du tour 20, en tire la règle : **sur la photo, désigner la ligne avec son numéro dans la marge ; le mot exact et sa bonne forme se lisent dans le texte numérique**. Ne pas promettre un encadrement exact du mot sur la photo à partir d'une proportion de lettres.

Les fautes gardées conservent le format des marques de langue existantes (identité, page, place, forme, sens, passe, bonne forme, horodatages) ; leur lien au texte et à la ligne s'ajoute. Les anciennes marques restent à leur place.

Le premier mandat promettait de reconnaître une faute ancienne « sur la même ligne et le même mot ». Cette preuve n'existe pas : les anciennes marques portent des coordonnées, sans lien au mot recopié. **Le traitement de ces doublons reste à cadrer avant 57**, pas avant 56. Aucune marque ancienne n'est supprimée, déplacée ou fusionnée automatiquement pour cacher le problème. Montrer à Paul ce qui est reconnaissable et ce qui ne l'est pas avant de retenir une règle ; ne pas annoncer une absence de doublons non prouvée.

## ⑨ — Les anciennes copies, pendant que Paul corrige
Une version ajoute ; elle ne renomme ni ne retire ce que les copies portent. Garder marques, réponses et identités de questions, bonnes formes, pages, positions, lignes, temps, note et reprise. Les photos gardent leur emplacement dans le navigateur (`mjpc_scans`). La simple ouverture d'une copie ne la réécrit pas.

Ne jamais réécrire la grille actuelle dans `config/grille2` pour y mettre les stickers. La grille des stickers sera une autre grille ; chaque copie garde celle avec laquelle Paul l'a corrigée et sa note ne change pas seule. Une conversion ne se fait que pour le même fait, sur le geste de Paul, avec la note avant et après. Ce qui n'a pas d'équivalent reste lisible dans son ancienne grille. Cette règle vaut aussi pour les copies que Paul complétera après ce mandat.

Avant chaque proposition de promotion, ouvrir les vraies copies en lecture seule avec la version actuelle et la candidate, sur **le même instantané privé lu au site**, afin de ne pas confondre une modification faite par Paul et un écart de version. Bloquer et compter les tentatives d'écriture, y compris celles du suivi ; aucune ne doit atteindre la base réelle. Comparer nombres de copies, marques et lignes, contenu des réponses, bonnes formes, positions et notes, y compris les copies incomplètes. Les images privées restent hors du sas. Une différence inexpliquée interdit la promotion ; le rapport donne les comptes sans identité ni texte d'élève.

## 58 et 45 — La grille vient ensuite
La grille en stickers et son compte en direct sont une intervention distincte. La grille se récrit point par point, chacun validé par Paul ; la maquette de cette grille attend qu'elle soit entière (⑧). Seul « Le thème tenu » est validé : six stickers ; les six donnent 6 points, un manque donne 4, deux ou trois donnent 2, au-delà 0. Les noms restent à donner ou confirmer par Paul.

Le compte montre les stickers posés, ce qui manque, et les effets sur la grille et les points en direct. Les propositions IA ne remplacent pas les décisions de Paul. Le fichier de l'élève reste en lecture seule et la coche de sa correction reste fermée. D'ici à cette intervention, **les quatre passes restent utilisables** ; 45 ne peut les retirer qu'une fois la grille disponible dans la bande.

## 59 — Trois défauts à régler avant la première mise en ligne
La tuile du tableau des élèves doit lire l'avancement réel de la correction sur les scans, au lieu de « Non commencé · 0 % » pour une copie corrigée.

Il faut le geste de remise à zéro d'une copie, avec la corbeille MJPC, et le traitement de la page restée ouverte : une copie effacée ailleurs ne doit plus être réécrite au geste suivant. Cela se prouve avec deux pages ouvertes sur le faux hub, jamais en effaçant une vraie copie pour essayer.

Les mots du fichier en lecture seule de l'élève doivent être donnés ou validés par Paul. Aucun texte élève inventé pour finir la livraison. Ces trois points sont des conditions de mise en ligne, pas une permission d'élargir silencieusement 56 à toute la correction par l'élève.

Le test iPhone de la pièce jointe École Directe, les réponses du Lexique à redonner et les deux tâches de dimanche restent les attentes distinctes du point 60. Ne pas les présenter comme réalisés.

## Le banc et les preuves
`maquette/banc/banc.mjs` contient actuellement **49 appels de vérification**, comptés ; ce nombre ne signifie pas que C15 les a rejoués. La fin du banc est corrigée dans cette révision : une vérification ratée ou une erreur collectée donne « BANC : ÉCHEC » et un code de sortie 1 ; une réussite donne 0. Le navigateur est fermé avant la sortie.

**Mesure isolée C15 :** le témoin d'avant affiche un échec mais sort à 0. Avec la correction, trois essais de la fin réelle du script donnent respectivement 0 (réussite), 1 (vérification ratée), 1 (erreur collectée). Syntaxe Node vérifiée. **Le banc navigateur complet n'a pas été rejoué dans ce tour** ; aucun résultat « 49/0 » nouveau n'est annoncé.

Pour chaque intervention fonctionnelle, ajouter les épreuves par les gestes réels au banc unique, puis le rejouer en entier. Pour 56 : saisir trois lignes, dont une de deux mots ; garder fautes et ponctuation ; recaler les deux poignées ; ajouter et retirer une ligne sans changer l'identité des autres ; reprendre après rechargement ; plusieurs pages ; conservation d'une ancienne copie et de son total de lignes. L'import de 53 ne se teste et ne se livre que s'il est validé.

Pour 57 : contrôler le retour avant de l'utiliser ; refuser un nombre de lignes ou une référence de copie incorrects sans rien écraser ; comparer après insertion, retrait, répétition de mots, apostrophe et ponctuation ; compter les propositions ; garder, refuser et ajouter une faute ; ⇧R aller-retour et Retour ; recharger ; vérifier le fichier de l'élève et la conservation des anciennes marques. La décision de touches de Paul est une entrée du banc, pas un choix du test.

Rejouer les invariants de ⑨ et les trois défauts de 59 avant la première mise en ligne. Le faux hub refuse les mêmes noms de clés que Firebase ; aucune écriture refusée ne passe pour un succès. Les nouveaux textes sont des valeurs et les clés passent par les protections de 1.2.3.

Captures d'écran entier regardées avant livraison ; infobulles des nouveaux gestes ; tailles prévues au protocole (1366 × 768, 1536 × 864, 1920 × 1080, décisions à 1280 × 720), et regard mobile des écrans concernés. Les essais se font avec des exemples inventés et réalistes. Mesurer le temps de recopie et de correction, ainsi que les **30 clics**, avant de promettre le gain : ce ne sont pas « 30 gestes ».

## Livraison et promotion
Livrer la nouveauté sur une branche du sas : vrai fichier construit, générateur et sources, banc unique, captures regardées et rapport compté. Rien de réel d'élève au sas. Une maquette n'est jamais une démo écrite à côté de l'app.

Si l'exécutant ne peut pas faire tourner le banc complet ou ouvrir le site, il le dit : **cadrage seulement, pas de codage fonctionnel**. Aucun lancement automatique à partir de la présente révision.

La promotion exige le « promeus » de Paul sur une livraison présente et auditée, le banc complet sans défaut et les conditions de 59 réglées. Sauvegarde et point de retour avant ; fichier promu vérifié bit à bit ; dans le même tour, journal, registre des dettes, restauration et où-trouver-quoi, adresse avec `&v=`, tests de Paul geste par geste. Pas de mise en ligne sur une dette.
