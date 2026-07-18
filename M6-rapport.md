# M6 — RAPPORT DE LIVRAISON · Souche (correction_dictee)
*Exécutant M6, 18/07/2026. Livraison au sas — aucune promotion, aucune écriture hub.*

## 0. Empreintes

| Objet | md5 | Taille |
|---|---|---|
| Source production (lue, non modifiée) | `e6f44978c9eaccc7aeb8230c29239c87` | 499 648 o · 7 317 l. |
| **Livré : `correction_dictee.staging.html`** | `61b3747f96eec43d073c49384fdb31c9` | 516 608 o |
| `mjpc-core.js` (recopié verbatim) | `1b106b4082ee5b44154027c5a0a6552c` | v1.1.0 |
| Plan de travail (lu) | `6c8d4ee9a1dc91ded64b5575db8fe7cc` | v50, 719 l. |

Preuves : double parseur (`node --check` + acorn) **OK** · banc **40/40 sur l'export réel du hub** · non-régression du banc sur `pilotage_debat_s3.html` (12/12) et sur la souche d'origine (5/5).

## 1. Ce qui a été fait

**Socle (prérequis pt 7).** Bloc embarqué v1.0.0 → **v1.1.0, recopie verbatim** (contrôle programmatique : le contenu de `mjpc-core.js` est présent tel quel dans le fichier). Complétude vérifiée : les **12 fonctions** présentes, **une seule fois chacune** (`sanMJPC`, `cleClasse`, `classeTestId`, `estClasseInterne`, `estClasseTest`, `extractEleves`, `ecrireClasse`, `renvoyerVersMJPC`, `resolveEleves`, `publierManifeste`, `lireSessionMJPC`, `validerEleveMJPC`). Aucune modification du socle lui-même (Q5/N4 respectés).

**Pt 2 — Navigation deux niveaux.** `Pilotage{Préparation · Correction · ⚡Rapide}` · `Données{Bilan · Copies · Fiches élèves · Suivi · Exercices}` · `Réglages` + « ? ». Atterrissage Pilotage→Correction. Le groupe **suit** l'onglet quand celui-ci change de l'extérieur (raccourci ⇧R → bascule automatique sur Pilotage). Barre d'actions transverses (M→P, Snapshot, Restaurer, Retour) et raccourcis inchangés.

**Pt 4 — Préparation, par extraction (N2).** Le bloc d'édition inline de l'accueil est devenu le composant `EditionDictee`, monté **aux deux endroits** : le ✏️ de l'accueil et le sous-onglet Préparation. **Zéro duplication** (une seule définition dans le fichier, testé). Le ✏️ ne pré-remplit plus un état externe : `EditionDictee` charge lui-même `correction_dictee/<id>` (mêmes champs, même `dictee.amenagee`) → l'état mort `editForm` d'`AppProf` a été retiré.

**Pt 5 — Réglages doté (N3).** Deux cartes : *Lecture audio* (activation + vitesse + bouton d'essai, sur les helpers `getSpeechEnabled`/`getSpeechRate` existants) et *Copies envoyées aux familles* (note, détail des points, surlignage, lien exercices — sur `getCopyOptions`/`setCopyOptions` existants). **localStorage seul, aucun `db.ref` dans le composant** (testé). Le panneau de `Copies` n'a pas été touché : les réglages écrivent le même stockage, sans extraction risquée.

**Pt 7 — Connexion élève (correction de la conscience appliquée).** Le portail est celui de **l'accès élève à l'app**, pas du mode Copies. Constat : l'accès existait, en **texte libre** (nom + prénom, aucune preuve). Livré : **code personnel + nom + prénom**, le nom résolu par `resolveEleves` contre le registre, le code vérifié contre `/codes`. Shunt `lireSessionMJPC` + `validerEleveMJPC` : l'élève déjà connecté au site entre sans rien ressaisir. L'app reste autonome si MJPC tombe (le portail natif fonctionne seul). Profil de test « MENEY Monsieur » conservé.

**N1 — Lien nominatif : les deux, comme demandé.** ① Le lien `?dictee=&eleveKey=&screen=` reste fonctionnel — il désigne toujours la bonne copie et le bon écran ; ② il ne **prouve** plus l'identité : sans session MJPC valide, le code est demandé à l'arrivée, puis la destination de l'URL s'ouvre directement. *Raisonnement consigné* : l'URL est un objet qui circule (messageries, historiques, partages) ; elle est une bonne **adresse** et une mauvaise **preuve**. Le coût pour l'usage familial est d'un champ de 4 chiffres. **Point à trancher par Paul** : un parent qui consultait la copie sans l'élève devra désormais lui demander son code — c'est le seul usage réel dégradé que je vois ; il est signalé, non arbitré.

**Pt 8 — « Mes dictées » (N5).** Liste **systématique** après connexion (décision de cohérence appliquée) : les dictées publiées où l'élève a une copie, avec titre, classe et note si `showNote`. Lecture seule, aucune écriture, aucun nœud nouveau. Sans copie : message d'attente, jamais une erreur.

**Pt 10 — « ? ».** Modale d'aide (les trois groupes, raccourcis, ce que voit l'élève) + **lecteur d'annonces sur `site/annonces`** (Q2), filtré sur l'app, **tolérant à l'absence du nœud** (absence = « aucune annonce », pas une erreur). Pied de modale : version app + version socle.

**Pt 18 — Pastille de version.** `APP_VERSION="6.0.0"` **en dur** (Q5), affichée sur l'accueil et dans la modale. Metas anti-cache ajoutées au `<head>`.

**Pt 17 — Responsive 390 px.** Media query `≤480px` : nav repliée (groupes en flex-wrap, sous-onglets compactés), modale d'aide resserrée, lignes « Mes dictées » et bandeau élève en colonne. Écrans concernés : nav, connexion, Mes dictées, Réglages, « ? ».

**Pt 14 — Wording élève.** « Mon code (4 chiffres) », « Entrer », « Mes dictées », « Ouvrir → », « Me déconnecter », « Ton code est le même que sur le site MJPC. Si tu l'as oublié, demande-le à ton professeur. », « Tu n'as pas encore de dictée corrigée ici. Reviens quand ton professeur aura rendu la prochaine. »

**Pt 11 — Manifeste.** **Inchangé** : M6 n'a créé aucun nœud Firebase (testé). Voir dette D3.

## 2. Ce qui n'a PAS été touché (preuve, pas déclaration)

Comparaison **octet pour octet** des corps de fonctions entre la source de production et le livrable :

`RapideGlobal` · `CorrEleve` · `Bilan` · `Suivi` · `Fiches` · `Copies` · `MaCopie` · `EleveCorrection` · `ExercicesEleve` · `ExercicesAdmin` · `ConfigAmenagee` · `gramComment` · `_h` (moteur GRAMM) → **tous IDENTIQUES**.

Les écrans de travail ont été **rangés, pas rouverts**. Aucune écriture hub n'a été faite (lectures seules : `/classes`, `/codes`, `/correction_dictee` pour le banc).

## 3. Mesure demandée — tableaux denses en 390 px

L'environnement d'exécution n'a **pas de navigateur** (ni Chromium ni Puppeteer) : la mesure ci-dessous est **structurelle**, pas un rendu. Le visuel réel reste à l'audit.

- `Bilan` : **9 colonnes** · `Suivi` : **12 colonnes** · `.bilan-table{width:100%;font-size:.86rem}`, **aucun `min-width` fixe**, aucun `overflow-x` de secours.
- Largeur utile en 390 px : ~358 px (padding 16+16). Estimation de la largeur incompressible : ~55-70 px par colonne à cette taille de police → **~500-630 px pour Bilan, ~660-840 px pour Suivi**.
- **Ampleur du débordement : facteur ~1,4-1,8 pour Bilan, ~1,8-2,3 pour Suivi.** Sans `min-width`, la table se comprime au lieu de scroller : le symptôme attendu n'est pas une barre horizontale mais un **écrasement illisible** des colonnes (mots coupés), ce qui diffère du débat s'il avait des largeurs fixes.
- **Réponse à la question posée** : oui, la souche a le même problème de fond (tableaux prof non pensés mobile), mais il s'y **manifeste autrement** (compression, pas débordement). Un `overflow-x:auto` sur les conteneurs de tables réglerait les deux d'un geste — hors périmètre M6, à consigner au plan.

## 4. Contestations sourcées

**C1 — Le banc perdait sa suite SOCLE.** `mjpc-bench.js` détectait le socle par `html.indexOf('// MJPC-CORE v1.0.0')` (ligne de la SUITE 1). Toute app passée en v1.1.0 voyait la suite **silencieusement ignorée** — c'est-à-dire que la non-régression du socle disparaissait au moment précis où le socle change. Vérifié sur pièces : avant correctif, `── SOCLE ── (absent de ce fichier — suite ignorée)` sur le staging v1.1.0. Correctif livré : détection non versionnée (`'// MJPC-CORE v'`). Les 5 tests d'origine repassent.

**C2 — Le plan décrit `validerEleveMJPC` autrement que le fichier.** Plan L69 : « `validerEleveMJPC` (code + nom + prénom contre /codes) ». Fichier `mjpc-core.js` v1.1.0, L183-194 : `validerEleveMJPC(session, classesData)` valide une **session** contre **`/classes`** ; il n'y a aucune lecture de `/codes` dans le socle. **Le fichier fait foi** : le socle fournit le *shunt*, la vérification par code est une logique locale à l'app (comme dans le débat). J'ai donc implémenté la vérification `/codes` dans la souche. Si le plan doit rester la description de référence, c'est sa ligne 69 qu'il faut corriger, pas le socle.

**C3 — `/codes` contient des clés dégradées.** Vérifié sur l'export réel : `CL_MENT_Lylou`, `PINEAU_Cl_mence`, `MONSIEUR_Meney`, plus des entrées de type chaîne (`ELIO-1381`). La dette ⑮ est réelle et **bloquerait la connexion** de ces élèves. La souche la contourne sans la masquer : si la clé canonique est absente, le registre est balayé sur le champ `name`. Testé sur `CL_MENT_Lylou` (banc). La dette reste entière côté site.

## 5. Note K0 — mécanisme de mutualisation des décisions de correction (doc, pas code)

Repéré dans `CorrScreen`, bouton **« 🔄 M→P »**. Patron, en cinq temps : ① le prof prend **une** décision de requalification (« les M portés sur un signe de ponctuation sont des P ») ; ② l'app **dénombre** avant d'agir, en balayant toutes les copies (erreurs concernées, copies touchées, gain en points) ; ③ elle **demande confirmation avec les chiffres** — jamais une propagation silencieuse ; ④ elle écrit **copie par copie**, en n'écrivant que les copies réellement changées ; ⑤ elle **recalcule les dérivés** de chaque copie (`autocorrection/*/total`, `errorRefs`) pour que le parcours élève reste cohérent avec la nouvelle correction. C'est le patron « une décision → toutes les copies » que la Banque pédagogique peut reprendre tel quel : ce qui le rend acceptable, c'est le dénombrement chiffré préalable et l'écriture sélective, pas la propagation elle-même.

## 6. Registre des dettes (spec vivante)

**Dettes soldées en M6** : aucune ouverte par cette passe n'est restée ouverte — les deux gestes découverts en cours de route (état mort `editForm`, suite SOCLE du banc) ont été traités dans la livraison, pas consignés.

**Dettes consignées, non traitées (justifiées)** :
- **D1 — Mode test de la souche** : embryon existant (`_test_correction_dictee` via `ecrireClasse`, 5 élèves, résultats pré-remplis) mais **sans purge de sortie, sans nettoyage des zombies, sans incarnation**, et rechargement manuel. Passe dédiée courte, sur le patron QCM/M5ter. *Non traité par décision (Q3).*
- **D2 — Amélioration K.1** (l'élève formule une action en fin d'autocorrection) : après M15. *Non traité par décision (Q4).*
- **D3 — `dictee_settings/*` hors manifeste** (`promptIaBanque`, `promptDirectives`, `promptFormat`) : nœud écrit par la souche, absent de `MJPC_MANIFESTE` et du contrat de purge. **Rejoint M16-0** (contrôle des nœuds orphelins avant purge) : c'est exactement le type de nœud que la purge de rentrée doit voir. Contenu = travail de conception → `preserver` probable, à trancher avec la propriété du nœud (souche vs `dictee_universelle`).
- **D4 — Suppression de dictée sans corbeille hub** : export JSON local puis `remove()` sec ; la corbeille du site n'est pas sollicitée.
- **D5 — Alias Concordance** : 26 alias en attente de l'arbitrage de Paul. *Hors M6 par décision (Q6).*
- **D6 (nouvelle) — Tableaux prof en mobile** : `Bilan` (9 col.) et `Suivi` (12 col.) sans `min-width` ni `overflow-x` → écrasement en 390 px (§3). Un `overflow-x:auto` sur les conteneurs de tables réglerait la souche et probablement le débat.
- **D7 (nouvelle) — Plan L69 à corriger** : la description de `validerEleveMJPC` ne correspond pas au socle livré (§C2).

## 7. Annonce élèves (champ « nouveautés »)

> Pour entrer dans l'application, vous utilisez maintenant votre code personnel MJPC, comme sur le site. Une fois connectés, vous retrouvez toutes vos dictées corrigées au même endroit, dans « Mes dictées ».

## 8. Reste à faire avant promotion

1. Audit de la conscience, **dont visuel desktop + mobile 390 px** (je n'ai pas de navigateur : aucune capture de mon côté).
2. Essai de Paul — en particulier : le ✏️ de l'accueil, le raccourci ⇧R, une connexion élève réelle avec un vrai code, et le lien de copie envoyé aux familles.
3. Arbitrage de Paul sur le seul usage dégradé identifié (§N1 : parent consultant sans l'élève).
4. Promotion **sur son ordre**, par la conscience. Je ne promeus pas.
