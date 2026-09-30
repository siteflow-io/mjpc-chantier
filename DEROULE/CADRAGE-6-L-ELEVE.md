# CADRAGE 6 — L'ÉLÈVE : le profil, l'import de la liste, les adaptations (PAP), les anniversaires

*Conscience n°12 — écrit le 30/09/2026 après les tours 268 à 274 (Paul). Vaut pour le site (la console, le pilotage, le tableau) et pour toutes les apps. Ce qui s'y décide ne se rediscute pas ailleurs ; ce qui manque se tranche dans la conversation, jamais seul.*

## 0. Ce que ça change pour la classe

- 0.1 Paul a devant lui des adolescents dont certains ont un **dispositif** (PAP) : ils doivent être **fléchés dans tout ce qu'il pilote** — la fiche élève, la copie de classe, « qui a participé », les apps — pour qu'il n'oublie jamais l'aménagement dû, **sans que rien ne se voie au tableau** ni dans ce que les élèves reçoivent. Le sexe sert aux apps (le QCM aujourd'hui, toutes demain : l'accord des messages). La date de naissance sert aux anniversaires : une attention, jamais une donnée affichée.
- 0.2 Aujourd'hui (mesuré dans `index.html` le 30/09) : la liste d'une classe est `/classes/<classe>/eleves = ["NOM Prénom", …]`, rien d'autre ; l'import est un cadre « un élève par ligne » ; le sexe vit dans `qcm/eleveSexes` rangé **par l'app QCM**, contre la décision du 18/07 (« l'identité appartient au site : une app ne la gère pas ») ; les adaptations n'existent nulle part.

## 1. Le site est le seul propriétaire de l'identité élève (décision du 18/07, enfin tenue)

- 1.1 **La liste ne change pas de forme** : `/classes/<classe>/eleves` reste la liste des « NOM Prénom » (toutes les apps la lisent ainsi ; rien ne casse).
- 1.2 **Le profil** : `/classes/<classe>/profils/<élève-slug> = { sexe: "m"|"f", naissance: "AAAA-MM-JJ", dispositif: true|false, pap: { "pap-01": { coche: true, remarque: "…" }, … }, synthese: "…" }`. L'identifiant de l'élève est le même slug que pour les codes (`san(nom)`).
- 1.3 **Chiffré comme les codes** : `naissance`, `pap` et `synthese` sont chiffrés avec la clé de Paul (SECU) ; `sexe` et `dispositif` (oui/non) sont en clair, parce que les apps les lisent sans la clé. Rien du profil ne sort dans un export, une archive ou un récit.
- 1.4 **Le QCM lit le sexe dans le profil** : une migration une fois (le site copie `qcm/eleveSexes` vers les profils, puis le QCM n'écrit plus rien) ; les apps lisent, jamais n'écrivent.

## 2. L'import de la liste : le fichier tel quel

- 2.1 **La source** : l'export du logiciel de vie scolaire (mesuré le 30/09) — une feuille « Les élèves », six lignes d'en-tête du logiciel (« Edité le… », « Année scolaire », « Classe : 3 DYLAN BOB », « Prof principal », « Effectif : 25 élèves »), puis la ligne des colonnes **Nom · Date de naissance · Sexe · Age · Régime · Classe · Dispositifs**, puis un élève par ligne. « Nom » = « NOM Prénom » dans une cellule (le format du site) ; « Sexe » = M / F ; « Date de naissance » = JJ/MM/AAAA ; « Dispositifs » = « oui » ou vide.
- 2.2 **Le geste** : dans la console, « Importer la liste » accepte **le fichier .xlsx déposé tel quel** (lu dans le navigateur par une bibliothèque libre, rien d'envoyé ailleurs, rien de payant) **ou** le tableau collé depuis Excel (tabulé). Le site saute les lignes d'en-tête du logiciel, reconnaît la ligne des colonnes par ses mots (Nom, naissance, Sexe, Dispositifs), ignore le reste (Age, Régime) et le dit ; sans ligne de colonnes, une ligne = un nom (l'existant).
- 2.3 **L'aperçu avant de valider** : la classe (lue dans le fichier : « 3 DYLAN BOB », à créer ou à compléter), le nombre d'élèves, F / M, le nombre de dispositifs, les colonnes ignorées, les élèves déjà présents (complétés, jamais doublés), les nouveaux. Paul valide ou annule.
- 2.4 **Ce que l'import écrit** : la liste (1.1) et, pour chaque élève, `sexe`, `naissance`, `dispositif` ; jamais `pap` ni `synthese` (2.5).
- 2.5 **Ce que l'import ne sait pas** : le fichier flèche (« oui ») mais ne dit pas quoi. Les cases PAP se cochent **dans la console, élève par élève, depuis la fiche PAP de l'établissement** (§3).

## 3. Les adaptations : la fiche PAP en cases à cocher, sans interprétation (Paul, 30/09 : « il faut que toutes les adaptations me soient proposées et après je clique ou non ; là, l'app sait exactement »)

- 3.1 **Le vocabulaire est la fiche « Équipe éducative » de l'établissement**, quinze lignes, deux blocs, dans son ordre, avec un identifiant fixe chacune :
  - *Pour toutes les disciplines* — **pap-01** supports écrits aérés et agrandis (ex. Arial 14) · **pap-02** limiter la copie (synthèse photocopiée, École Directe) · **pap-03** lecture par un tiers ou lecture immersive (prévoir MPA) · **pap-04** décomposer les consignes, hiérarchiser · **pap-05** aider à la mise en place de méthodes de travail (organisation répétitive, accompagnement personnalisé) · **pap-06** prendre en compte les contraintes associées (fatigue, lenteur…) · **pap-07** utilisation de l'informatique : MPA.
  - *Évaluations* — **pap-08** accorder un temps majoré · **pap-09** privilégier les évaluations sur le mode oral · **pap-10** diminuer le nombre d'exercices, de questions · **pap-11** limiter la quantité d'écrit (QCM, exercices à trous, schémas) · **pap-12** ne pas pénaliser les erreurs d'orthographe et le soin · **pap-13** ne pas pénaliser le manque de participation à l'oral · **pap-14** limiter le « par cœur » aux notions clés · **pap-15** proposer des dictées aménagées (à trous, choix parmi plusieurs propositions).
- 3.2 **Dans la console**, la fiche d'un élève fléché montre les quinze lignes à cocher, une **remarque** facultative par ligne cochée (le report de la remarque manuscrite de la fiche), et la **synthèse** (points de vigilance). Un élève non fléché peut être fléché à la main (`dispositif` passe à oui).
- 3.3 **Ce que chaque case déclenche** — proposition de la conscience, **à valider par Paul case par case, et à mesurer app par app avant tout mandat** (ce que chaque app fait aujourd'hui n'est pas encore lu) :
  - pap-01 → la tablette et les fiches en grand ; pap-03 → « lis-moi » sur la tablette (la voix du navigateur, gratuite) ; pap-04 → la version `adapte` des consignes du chapitre (décomposée) ; pap-08 → temps majoré dans les apps d'évaluation (QCM, dictée) ; pap-10 et pap-11 → moins de questions, QCM plutôt qu'écrit ; pap-12 → la correction de dictée ne compte pas l'orthographe ; pap-13 → « qui a participé » ne signale pas l'absence de participation ; pap-14 → le cahier et l'entraînement se limitent aux notions clés ; pap-15 → la dictée universelle en mode aménagé ; pap-02, 05, 06, 07, 09 → informatifs (le ◆ les montre).
- 3.4 **Le fléchage au pilotage** : un ◆ discret sur la pastille de l'élève (fiche élève, copie de classe, « qui a participé ») ; le détail (les cases cochées, les remarques, la synthèse) au clic, avec la clé. **Jamais au tableau, jamais dans ce qui va aux élèves ou aux familles, jamais dans un export.**
- 3.5 **Le chapitre porte du contenu adapté** : le contrat d'injection gagne une ligne — un bloc ou une activité peut avoir sa version `adapte` (une consigne plus courte, décomposée ; une question guidée) ; le pilotage sait qui est fléché et à qui la servir (la tablette, cadrage 7). Rien n'est improvisé devant un élève : tout ce que la tablette dit a été écrit par l'instance et lu par Paul.

## 4. Les anniversaires (Paul, 30/09)

- 4.1 **Dans la console, avec l'âge** : la ligne « 🎂 Titouan G. a 14 ans aujourd'hui · Lina B. aura 14 ans demain (mardi 15/09) » — la veille et le jour même — **à trois portes** : la case de l'heure dans l'emploi du temps (avant le lancement), un 🎂 dans la barre du pilotage pendant l'heure (présent seulement les jours d'anniversaire), et le T-5 (le cahier de textes). Chaque porte a « Afficher au tableau » / « Retirer ». Prénom + initiale du nom ; l'âge se calcule à la date du jour, rien d'autre n'est stocké.
- 4.2 **Au tableau, si Paul l'a demandé** : **la pastille** dans la ligne de l'étiquette d'activité, en haut à droite, de la taille de l'étiquette, au texte **invariable « 🎂 Bon anniversaire Titouan »** (le prénom seul ; deux le même jour : « Bon anniversaire Titouan et Lina ») — jamais l'âge, jamais la date, jamais « aujourd'hui ». Elle ne recouvre rien, ne déplace rien (Paul, 30/09 : « jamais en modale par-dessus le cours »).
- 4.3 **C'est un état poussé** comme les autres : le gel le tient ; le journal note « anniversaire affiché » sans le prénom ; la pastille se retire d'un clic ou tombe à la fin de l'heure ; en répétition (jouer en avance), rien n'est poussé.

## 5. Ce qui reste à trancher

- 5.1 Le déclenchement case par case (3.3), après lecture des apps.
- 5.2 Le cadrage 7 « LA TABLETTE » : le panneau d'aide des compétences (« Ce que tu vois », « Ce que tu peux faire », les questions prédéfinies, le fil, « Chercher un mot ») réutilisé pour les fléchés, l'émoji prof, le contenu `adapte` par diapo, les réponses vers la fiche élève — s'écrit quand Paul a donné le HTML du panneau.
