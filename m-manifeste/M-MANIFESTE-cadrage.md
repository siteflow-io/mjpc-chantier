# M-MANIFESTE — CADRAGE (exécutant → conscience)
**02/08 · j'attends le feu vert**

## 1. Bases mesurées
`index` **679 981 o · `97bf48794e7dc4cd5821332ae467d9e6`** (8.15.0) · `correction_dictee` 584 381 `e0d1e1b7…` · `worktrack` 1 055 561 `176a4557…` · `dictee_universelle` 1 992 950 `c81e6a86…` · `pilotage_debat_s3` 486 485 `f32f0eed…` · `evaluation-qcm` 547 444 `2588a35a…` · `analyse_logique` 581 601 `5e3663bf…` · `applause_meter` 665 724 `62cee16d…` · `reecriture` 271 443 `359a56e5…` · `reecriture_bb4e` 140 708 `764d2f5a…` · canon `d9b40cc3…` (1.5.0).
*(Au passage : M-DOC-1/1b et SITE-COURS-2e sont promus — `evaluation-qcm` et `index` portent mes staging.)*

## 2. LA MESURE DU DÉFAUT — app par app, quand la publication s'exécute
| app | déclenchement mesuré | qui l'exécute |
|---|---|---|
| **correction_dictee** | `useEffect(function(){ publierManifeste(db); }, [])` | **TOUT LE MONDE, à chaque ouverture — élève compris** |
| **evaluation-qcm** | `useEffect(function(){ publierManifeste(db); }, [])` | **idem — élève compris** |
| worktrack | à la reprise prof (`lsGet("wt_prof_poste")`) | prof seulement |
| dictee_universelle | après saisie du code prof | prof seulement |
| pilotage_debat_s3 | `if(s.is_prof){ publierManifeste(db); … }` | prof seulement |
| analyse_logique | appel direct au boot, « vue projetée pour la console MJPC » | à confirmer à l'écran |
| applause_meter | idem | à confirmer à l'écran |
| reecriture / bb4e | `if(rS.ok){ setProfAuth(true); … publierManifeste(db) }` | prof seulement |
| index | `publierManifesteREST()` au chargement | tout le monde |
**RÉPONSE À LA QUESTION DU MANDAT : OUI, deux apps écrivent au hub à chaque ouverture par un élève** (`correction_dictee`, `evaluation-qcm`), plus `index`. **C'est le comportement actuel, avant mon morceau** — je le mesure, je ne l'introduis pas.

## 3. DEUX TROUVAILLES QUI CHANGENT LA SOLUTION
**① `publierManifeste` écrit `app: MJPC_APP` — L'OBJET ENTIER.** Donc **`usage` et `quandPas` remonteraient déjà**, sans qu'une seule ligne soit à modifier. *(C'est ce que j'avais mesuré à M-PROMPT-4 : « l'objet entier remonte déjà ».)* **Le défaut n'est pas dans le code : il est dans le fait que le code n'a pas tourné.**
**② Le champ `version` du manifeste porte `MJPC_CORE_VERSION`, pas une version d'app.** Mesuré au hub : `worktrack` 1.1.0 · `correction_dictee` 1.1.0 · `evaluation-qcm` 1.1.0 · `applause_meter` 1.1.0 · `dictee_universelle` 1.1.0 · `pilotage` 1.1.0 · `analyse_logique` 1.3.0 · `reecriture` 1.3.0 · `index` 1.4.0 — **pour un code en 1.5.0**. **Le hub porte donc des déclarations vieilles de plusieurs socles, et le champ qui le prouve existe déjà.**

## 4. LES TROIS VOIES, INSTRUITES — et celle que je retiens
**① Comparer la version publiée à la sienne, et republier si elle diffère.** *Coût* : une lecture REST au chargement, puis une écriture seulement si écart. **Angle mort** : il faut quand même **qu'une app soit ouverte**. Pour `correction_dictee` et `evaluation-qcm` c'est automatique (élève) ; pour les six autres, **il faut un prof** — donc `pilotage_debat_s3`, ouverte une fois par trimestre, resterait périmée des mois.
**② Le site publie pour tous.** *Coût* : le site devrait **porter les déclarations des neuf apps** — c'est-à-dire une copie, exactement ce que M-PROMPT-4 a refusé (« la liste redeviendrait écrite à la main au site »). **Angle mort** : la copie diverge au premier changement d'app. **Écartée pour cette raison.**
**③ Un écran prof qui montre l'écart et republie.** *Coût* : un écran de plus. **Angle mort** : il faut que Paul y pense.
**CE QUE JE RETIENS : ① + ③, et voici pourquoi ensemble.** ① fait le travail **sans geste** dès qu'une app s'ouvre, et **ne coûte une écriture que s'il y a écart** (aujourd'hui les apps réécrivent le manifeste **à chaque ouverture**, même identique : ① *réduit* les écritures, il n'en ajoute pas). ③ **couvre l'angle mort de ①** : un tableau côté prof, dans le site, qui dit pour chacune des neuf apps **ce que le hub porte et depuis quand**, avec la version du socle — Paul voit d'un coup d'œil laquelle n'a pas été ouverte depuis une promotion. **Sans ③, une app rarement ouverte reste périmée sans que personne le sache — et c'est exactement le problème que le mandat pose.**
**CE QUE MA SOLUTION NE COUVRE PAS, dit franchement** : elle ne publie toujours **rien** tant qu'aucune app n'est ouverte. **Elle rend l'écart VISIBLE et le comble au premier accès ; elle ne le comble pas à distance.** Publier depuis le site exigerait que le site connaisse les déclarations — ce qui est le défaut ②.

## 5. LES DÉFAUTS DE TEXTE — relecture mot à mot
**a) LA COQUILLE, confirmée à la source** : `"Un chapitre = une comp\u00e9taire majoritaire."` → **« une compétence majoritaire »**. **Elle vient de moi** : je l'ai écrite à M-PROMPT-4, et je l'ai relue sans la voir. La cause est celle que Paul nomme : **j'ai vérifié des structures, je n'ai pas lu la phrase.**
**b) L'ADRESSE** : la présentation annonce `monsieurjaipascompris.fr` — **je n'ai pas pu vérifier son existence** : le réseau du conteneur est restreint aux domaines du chantier, et l'appel rend HTTP 000. **Je ne conclus pas.** Le site est servi depuis `siteflow-io.github.io/monsieurjaipascompris` (mesuré au dépôt). **Je propose d'écrire l'adresse réellement servie**, et de garder le domaine **seulement si Paul confirme qu'il lui appartient** — une IA pourrait tenter d'y aller.
**c) Relecture complète à faire** : présentation (tronc + brève), les trois seeds (chapitre, fiche de séance, diaporama), les messages de refus et d'aperçu. **Je la ferai mot à mot et je listerai chaque correction, avant → après.**

## 6. Ancres et portées
`publierManifeste` est **top-level** dans les neuf apps (définition unique, appels distincts). Je pose une section nommée **`§ MANIFESTE À JOUR`** au canon (§8) : `mjpcManifestePublierSiEcart(db, base)` — lecture, comparaison, écriture conditionnelle. Les neuf apps l'appellent **à la place** de `publierManifeste`, **sans changer leur moment de déclenchement**. L'écran d'écart va dans `index.html` (pastille 8.15.0 → 8.16.0), ancré **par contexte**, **sans toucher au socle non contigu**.

## 7. Questions (3)
**Q1 — Le domaine `monsieurjaipascompris.fr` existe-t-il ?** Je ne peux pas le vérifier depuis le conteneur. Si oui, je garde les deux adresses ; sinon je n'écris que celle qui sert.
**Q2 — L'écran d'écart : dans le site (console prof) ou dans chaque app ?** Je propose **le site** : il est le seul à voir les neuf d'un coup.
**Q3 — Les deux apps qui publient à chaque ouverture élève** : avec la comparaison, elles n'écriront plus que s'il y a écart — donc **une fois après chaque promotion, par le premier élève qui ouvre**. Est-ce acceptable, ou faut-il réserver la publication au prof partout (au prix de l'angle mort) ?
