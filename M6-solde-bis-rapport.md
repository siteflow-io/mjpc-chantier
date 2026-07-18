# M6-SOLDE bis — arbitrages ③ ④ ⑤
*Exécutant M6, 18/07/2026. Dernière livraison de la souche. Sas — aucune promotion, aucune écriture hub.*

## 0. Empreintes

| Objet | md5 | Taille |
|---|---|---|
| M6-solde (audité) | `e46cc2d76ecdeb421fd6e7708d5f5132` | 536 780 o |
| **M6-solde bis : `correction_dictee.staging.html`** | `7b5b5fae760ffda22dde4f5b4d3df21e` | 536 044 o |

Double parseur **OK** · banc **148/148 sur l'export réel** · non-régression `pilotage_debat_s3.html` 12/12.

## 1. ③ L'outil est nommé — formulation soumise

Le titre parlant reste, le nom de l'outil ouvre le sous-titre :

> ### Ce que lisent les élèves
> **Éditeur des messages élève.** Ces phrases s'affichent à l'écran de tes élèves. Modifie-les librement : un champ laissé vide revient au texte d'origine.

Pourquoi cette articulation plutôt que le titre : le titre répond à « qu'est-ce que je vais trouver là ? », qui est la question qu'on se pose en parcourant les Réglages ; le nom de l'outil répond à « comment ça s'appelle ? », qui est la question qu'on se pose quand on en parle ou qu'on le cherche. Mettre « Éditeur » en titre aurait fait gagner le second au prix du premier. En gras et en tête du sous-titre, il est lu en premier tout en laissant le titre faire son travail.

**Variantes si Paul préfère** : titre « Éditeur des messages élève » avec sous-titre « Ce que lisent tes élèves… » (l'inverse exact) · ou un titre à deux temps « Éditeur — ce que lisent les élèves » (nomme et décrit d'un coup, mais s'allonge en mobile).

## 2. ④ « Masquer les copies »

Quatre endroits alignés, pas seulement le bouton : le bouton **🙈 Masquer les copies**, son infobulle *(les élèves perdront l'accès)*, la **confirmation** — qui disait encore « Dépublier ? » et dit maintenant « Masquer les copies ? Les élèves ne pourront plus accéder à leur copie via le lien partagé. » — et le message de retour **« ✅ Copies masquées »**. Le mot « dépublier » a disparu de l'app.

Les autres « Retirer » du code (retirer une lacune, retirer du registre PAP) sont sans rapport avec les copies : intacts, et testés comme tels — mon premier test les condamnait par excès de largeur.

## 3. ⑤ Profil « MONSIEUR Meney » — ce que j'ai trouvé avant de retirer

**Trois dépendances dans le code**, pas une :

1. `doLogin` — la branche d'exception qui fabriquait une copie avec cinq erreurs choisies au hasard dans le texte. **Supprimée** (826 octets). `doLogin` n'a plus aucune exception : tout le monde passe par le code personnel.
2. `setEleveData({… key:"meney_monsieur" …})` — partait avec elle.
3. **`EleveCorrection`, ligne 7796** : un bouton **« ↻ Recommencer »** (efface l'autocorrection et rejoue le parcours) **conditionné à `d.key === "meney_monsieur"`**. C'est la trouvaille : un outil de test réel, caché derrière le faux profil.

**Ce que j'en ai fait, et que je soumets** : le supprimer aurait perdu une fonction utile ; le laisser en aurait fait du code mort inatteignable. Je l'ai **rattaché au bac à sable** — `estClasseTest(d.dictee.classe)` — où il sert exactement à ce pour quoi il existait : rejouer le parcours d'un élève fictif sans tout regénérer. Testé : actif sur `_test_correction_dictee`, **inaccessible depuis 5e HERGÉ ou 4E BANKSY**. Si Paul préfère la suppression pure, c'est une ligne.

**Au hub, trois traces devenues orphelines** (aucune n'est touchée par cette livraison) :
- `/codes/MONSIEUR_Meney` — clé hors format, déjà connue comme dette B ;
- `correction_dictee/dictee_5e_chapitre_utopie-5e_herge/autocorrection/meney_monsieur` ;
- `correction_dictee/dictee_brevet_blanc_4e-4e_banksy/autocorrection/meney_monsieur`.

Ce sont des restes de tes propres essais. Elles ne gênent rien (le `Suivi` les ignore, elles ne sont dans aucun roster), mais plus rien ne peut les régénérer ni les lire. **Elles relèvent de M16-0** : c'est exactement le type de résidu que le contrôle des nœuds avant purge doit voir. Le contrat de purge de la souche couvre déjà `correction_dictee/*/autocorrection`, donc les deux dernières partiront à la purge de rentrée ; `/codes/MONSIEUR_Meney` appartient au site. Je n'écris rien au hub.

## 4. Intégrité

Modifiés vs production : `Bilan` (2), `Suivi` (2), `Fiches` (1), `Copies` (7, dont D10 et la confirmation), `MaCopie` (1), `EleveCorrection` (7, dont le rattachement du bouton Recommencer), `ExercicesEleve` (2), `buildCopieHtml` (2). Intacts : `RapideGlobal`, `CorrEleve`, `ExercicesAdmin`, `ConfigAmenagee`, `gramComment`.

## 5. Registre à la clôture de la souche

**Soldées en M6** : D1 (mode test) · D4 (corbeille) · D6 (tableaux mobiles) · D8 (casse `/classes`) · D10 (« publier » ambigu) · D11 (absence) · D13 (textes éditables). **Rayée** : ~~D3~~ (nœud fantôme).

**Ouvertes, hors souche** :
- **D2** — amélioration K.1, après M15.
- **D5** — 26 alias Concordance, arbitrage de Paul.
- **D7** — plan L69 : la description de `validerEleveMJPC` ne correspond pas au socle livré.
- **D9** — deux registres de classes en mémoire (globale `CLASSES` + état `classesData`). Côté élève, l'état fait autorité ; côté prof, la globale reste seule.
- **D12** — l'absence n'est portée que par la dictée ; à remonter au hub pour le profil longitudinal (M15).
- **D14** — le dictionnaire de textes est propre à la souche ; à promouvoir au socle en M15 avec la pastille de version, sinon divergence entre apps.
- **Chantier X** — rattrapage modal : brique posée (champ `rattrapage`, emplacement réservé), rien codé.
- **Chantier W** — corbeille : Paul l'ouvre ; ma phrase « récupérable un an » est une promesse que l'app ne tient pas encore seule (elle archive, elle ne restaure pas). C'est le chantier qui la rendra vraie.

## 6. Avant promotion

L'essai de Paul : créer le bac à sable · incarner **Sacha** (absent → *Tu étais absent(e)*, ni note ni lien) et **Chloé** (sans copie sur la dictée A) · modifier un texte dans Réglages et le voir côté élève · supprimer une dictée de test et vérifier `corbeille/<jour>/` au hub. Plus l'audit visuel desktop + mobile 390 px.

Je ne promeus pas.
