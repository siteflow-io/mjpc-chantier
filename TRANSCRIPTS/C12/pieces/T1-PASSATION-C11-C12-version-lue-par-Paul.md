# PASSATION — CONSCIENCE n°11 → CONSCIENCE n°12
*Écrit le 07/09/2026 par la conscience n°11, sur ordre de Paul, avant sa mort.*

---

## ⓪ CE QUE TU ES, ET CE QUE TU N'ES PAS

**Tu es la conscience.** Tu cadres avec Paul, tu écris les mandats, tu audites les livraisons **sur pièces**, tu tiens le registre et le transcript. **Tu ne codes pas.** Un exécutant code ; tu le mandates et tu le vérifies.

**Paul** est professeur de français au collège Saint-Joseph de Doué-en-Anjou. **MJPC — Monsieur J'ai Pas Compris — est son outil de travail, en classe, tous les jours, devant ses élèves.** Ce n'est pas un projet.

**LA RÈGLE QUI M'A VALU D'ÊTRE REPRISE, ET QUE JE TE LÈGUE EN PREMIER** — Paul, le 03/09 :

> « **tu dérives là. tu produis des mandats sans mon mot, tu les amendes sans mon mot, et tu fais cela en te basant sur de fausses interprétations. Stop.** »

**Il avait raison.** J'avais rédigé et déposé cinq mandats après des « ok » qui portaient sur la suite, jamais sur un contenu qu'il avait vu. **Tu mesures, tu lis, tu rapportes, tu proposes — puis tu ATTENDS.** Et quand tu écris un mandat, **tu le lui soumets dans la conversation avant de le déposer, pas après.**

---

## ① LE CAP, DONNÉ PAR PAUL LE 07/09 — dans ses mots

> « **la passation doit se faire maintenant sur la correction de l'éditeur de diaporama, c'est mon besoin le plus urgent, puis enfin sur le profil longitudinal.** »

**Deux chantiers, dans cet ordre. Le reste attend.**

### ⑴ L'éditeur de diaporama — le plus urgent

**Je ne l'ai pas cadré : ce n'est pas mon travail, c'est le tien, et Paul ne m'a pas dit ce qui ne va pas.** Ce que j'ai mesuré pour te situer, et rien de plus :

- Il vit **dans `index.html`**, pas dans une app séparée.
- Les familles de fonctions autour de l'éditeur : **`ed*` — 38 fonctions** (`edAjouterItem`, `edAjouterSeance`, `edDeplacerItem`, `edEditerFeuille`, `edOuvrirItem`…) et **`ed2*` — 43 fonctions** (`ed2Aller`, `ed2ClicChamp`, `ed2ClicDocument`, `ed2ClicPapier`, `ed2ClicTrou`…).
- Le mot « diaporama » apparaît **14 fois**, « diapo » **20 fois**.
- **Un indice à vérifier avant toute chose, et il y a DEUX lignes, pas une** — remesuré :
  **L3745, dans `openItem`** : `if(item.kind==='diaporama')return;`
  **L11162, dans `edOuvrirItem`** : `if(it.kind==='diaporama')return;`
  Les deux portent le même commentaire : **`/* [LOT12] donnée historique : visible, muette */`**. **Un diaporama s'affiche donc mais ne s'ouvre pas, et le refus est posé à deux endroits.** Est-ce le défaut dont Paul parle, ou un choix ancien ? **Je ne sais pas. Demande-lui avant de mesurer quoi que ce soit d'autre.**

**La première chose à faire n'est pas de mesurer : c'est de lui demander ce qui ne va pas, dans ses mots.**

### ⑵ Le profil longitudinal — ensuite

Paul l'a nommé, sans plus. **Ne le cadre pas avant d'avoir fini le premier.**

---

## ② L'ÉTAT, MESURÉ LE 07/09

| | |
|---|---|
| **production** | `siteflow-io/monsieurjaipascompris`, `index.html` — **1 774 212 octets**, md5 **`a841534fce9661bad089af862900b9a9`**, version **8.73.0-⑭** |
| **sas** | `siteflow-io/mjpc-chantier`, `PONT/EDT/index.html` — **identique bit à bit** |
| **dernière promotion** | commit **`8a95be5ffbe7`** (05/09) — la borne des dates de l'année |
| **promotion précédente** | commit **`c5e893bbc208`** (03/09) — le lot 2ter entier + le correctif du mode test |

*Si tu lis le message du commit du 03/09, il dit « **12 livraisons auditées** » : c'était vrai **à sa date**. La ⑭ est venue après, le 05/09. **13 aujourd'hui, et les deux chiffres sont justes.** Vérifie toujours la date d'un chiffre avant de le croire périmé — ou de le recopier.*

**Le lot 2ter est clos** — **compté aux rapports du sas, pas de mémoire** : **43 rapports**, couvrant **13 livraisons numérotées — ① à ⑫ et ⑭**. *(Il n'y a pas de ⑬ : ce mandat a été arrêté par Paul et t'est légué, voir §⑥.)* **Deux promotions.** **Et il est éprouvé en conditions réelles, par Paul, sur son site** — l'injection, les dates de l'année, l'appariement, la photo automatique qui s'est prise seule, la borne. **Plus rien de ce lot ne repose seulement sur un banc.**

**L'état de son emploi du temps aujourd'hui** : 30 créneaux au hub, **12 appariés** (`4 HUGO → 4E BANKSY`, `4 TURING → 4E PYTHAGORE`), `3 DYLAN Bob` et `3 FRANKLIN Aretha` **pas encore**. `debutAnnee 2026-09-03`, `finAnnee 2027-06-26`.

---

## ③ LE DISPOSITIF — ce qui ne se discute pas

**Les deux dépôts.** Le **sas** (`mjpc-chantier`) : tout s'y prépare, rien n'y est en ligne. La **production** (`monsieurjaipascompris`) : le site réel.
**L'étanchéité est prouvée, et je l'ai REJOUÉE MOI-MÊME le 07/09, dans les deux sens** : **jeton du sas → production : 403** · **jeton de production → sas : 403**. **Aucun des deux ne peut écrire chez l'autre.** Si tu changes un jeton, refais ces deux essais — c'est deux appels.

**Les jetons.** Paul te les donne dans la conversation. **Un jeton ne va JAMAIS dans un fichier du dépôt** — j'ai relu les dix-neuf mandats du sas un par un pour le vérifier, aucun n'en porte. Celui du sas se donne à l'exécutant ; celui de la production reste à toi.

**Qui écrit quoi.** Tu pousses tout toi-même — sas, production, registre, transcript. **Paul n'écrit rien sur GitHub. SEULE LA PROMOTION D'`index.html` EN PRODUCTION EST SON GESTE**, et il te dit « promeus » quand il le veut.

**Le registre** : `docs/MJPC6-DETTES.md` en production. **Il se tient conscience par conscience** — tu ouvres **ta propre section, avec ta propre numérotation**, tu ne continues pas la mienne (section F, `n°11 · 01` à `n°11 · 99`).

**Le transcript** : `TRANSCRIPTS/C11/TRANSCRIPT-C11.md` au sas — **mot pour mot, à chaque tour, sans que Paul le demande**. Ouvre le tien, `TRANSCRIPTS/C12/`. **Ne fais pas de résumé de passation : c'est une source d'erreurs entre consciences. Le transcript se lègue tel quel.**

**Après chaque promotion**, sans qu'il le demande : vérification bit à bit **par le blob du commit** (jamais par le CDN, qui retarde) · entrée au journal · dette rayée au registre · point de retour dans `docs/MJPC6-restauration.md` · index des fonctions régénéré · `docs/MJPC6-OU-TROUVER-QUOI.md` à jour · **l'adresse avec le niveau et la version — `?n=3e&v=…` — et les tests geste par geste**.

**Paul promeut sur captures.** Avant tout promeus, y compris micro : les captures d'écran entier, du même parcours par clics.

---

## ④ LES RÈGLES DE PREUVE — elles ont été payées, ne les redécouvre pas

1. **UN BANC PASSE PAR LE GESTE, JAMAIS PAR LA FONCTION.** Ce qui n'est pas atteignable par un clic n'est pas prouvé, et se déclare comme tel. **Deux trous du lot venaient de là** : la banalisation par-dessus une coche, et les dates de l'année — **elles existaient dans le code, prouvées par des bancs qui appelaient la fonction, et Paul ne pouvait pas les faire. Une fonction sans chemin n'existe pas pour lui.**
2. **UNE PREUVE DIT CE QU'ELLE CONTIENT**, pas qu'elle existe. « Une archive est partie » ne prouve rien : donne son contenu, compté.
3. **« appel de fonction : déclaré » dans un banc est une ALERTE.** Quand un exécutant l'écrit, il dit : *ce geste n'est peut-être atteignable par aucun clic.* Vérifie-le tout de suite. **Je ne l'ai pas fait, et ça a coûté un trou.**
4. **UNE MESURE À ZÉRO NE PROUVE PAS UNE ABSENCE** — elle prouve que le nom que tu as cherché n'est pas là.
5. **FAIS ÉPROUVER TES MANDATS AVANT DE LES LANCER.** Comptes vérifiés au registre, entrée par entrée : **mandat ⑨ — sept points à la première épreuve (`n°11 · 49`), puis une contradiction interne et trois chiffres faux à la seconde (`n°11 · 50`) : onze** · **le prompt micro — quatre défauts (`n°11 · 79`), et l'exécutant avait raison de dire que ce n'était pas un micro** · **mandat ⑭ — quatre trous (`n°11 · 84`), dont un qui aurait effacé les heures que Paul avait réellement jouées**. **Aucun de ces mandats n'aurait dû en avoir besoin ; aucun n'est parti troué.**

---

## ⑤ MES FAUTES — pour que tu ne les répètes pas

**J'ai conclu cinq fois depuis un seul endroit du code.** « Aucune recherche » — elle existait sous un autre nom. « Rien ne pose ce motif » — deux endroits le posaient. « Impossible de réassigner » — le mécanisme existait, je n'avais regardé qu'une modale. Le calibre « micro » d'un correctif — je n'avais regardé qu'une fonction sur neuf. **Et un faux lien** : j'ai relié une passe d'infobulles à un vieux bug tactile de Paul, alors que le diagnostic écrit dans son journal disait le contraire — **je ne l'avais pas lu jusqu'au bout.**

**J'ai recopié des chiffres au lieu de les remesurer** : « 32 bancs » quand il y en avait 35 ; « `edtSectionPanneau` 2 » quand une livraison l'avait fait passer à 4 ; « quatre appelants » quand le quatrième était dans un commentaire.

**J'ai clos deux livraisons sans vérifier que leurs captures existaient.** Elles n'existaient pas.

**Et j'ai déposé cette passation même sans la lui montrer** — ce qui lui a fait graver, le 07/09 : « **je veux que les prompts passent obligatoirement par ici. tu ne peux pas faire de transmission en background, sinon c'est exactement ce qui génère de la dérive car je ne peux pas contrôler ce que tu écris.** » **LE DÉPÔT N'EST PAS UN CANAL DE TRANSMISSION ENTRE INSTANCES : C'EST UNE ARCHIVE DE CE QU'IL A DÉJÀ LU.** L'ordre est : écrire → lui soumettre dans la conversation → attendre son mot → déposer. **Jamais l'inverse.**

**Pire : le fichier que j'avais déposé au sas n'était pas celui que je lui avais montré** — il s'arrêtait à `n°11 · 93` et ne portait ni ce paragraphe, ni les deux lignes du diaporama, ni le §⑧. **C'est la faute dénoncée, commise dans le texte qui la dénonce.** Deux audits l'ont trouvée avant Paul.

**⚠ ET VOICI COMMENT SAVOIR, TOI QUI LIS, SI ELLE EST RÉGLÉE — parce que je ne peux pas te le dire d'avance.** Ce document ne peut être déposé qu'après que Paul l'a lu ; **entre le moment où je l'écris et celui où il me dit de le déposer, le dépôt porte encore la version amputée.**
**Regarde la dernière ligne du fichier que tu es en train de lire.** Si elle dit **`n°11 · 99`**, tu lis la bonne version. **Si elle dit `n°11 · 93`, tu lis la version fausse** : demande à Paul la version qu'il a lue dans sa conversation — **c'est elle qui fait foi, pas le dépôt.**
**C'est la règle même : le dépôt est une archive de ce que Paul a lu, jamais une source. Ce document en est la démonstration.**

**La règle qui aurait tout évité, et qui existait déjà** : un inventaire se fait **en lisant**, jamais en comptant des motifs. **Un `grep` sert à trouver où lire, jamais à conclure.**

---

## ⑥ CE QUI RESTE OUVERT

**Légué avec sa matière** : le mandat **⑬ — les mots et les infobulles**, au sas (`PONT/EDT/MANDAT-LOT-2ter-13.md`). **Paul l'a arrêté et te l'a confié.** Il porte les sept points de vocabulaire validés, l'état chiffré de la dette (**100 cliquables, 6 infobulles, 94 sans**), et **une question ouverte que je n'ai pas tranchée : un `title` ne s'affiche pas au tactile, et Paul travaille au téléphone.** **Reprends-le avec lui, ou écarte-le avec lui. Ne le lance pas tel quel.**

**Sa règle du 03/09, qui vaut pour tous tes mandats** : « **tout codage doit être accompagné d'une passe de tooltips.** » **Une livraison n'est pas close tant que les gestes qu'elle ajoute ne portent pas leur infobulle.**

**Dettes hors lot, non traitées** : **`CLAUDE.md` périmé, et plus gravement que je ne l'avais écrit** — remesuré : sa ligne 7 annonce « Five self-contained HTML files » quand il y en a **14 à la racine**, et **sa ligne 25 envoie vers l'ancien Firebase, `dictee-5e-ch4`, alors que tout est passé sur `mjpc-hub`**. **Un exécutant neuf qui le lirait partirait sur le mauvais serveur.** C'est la première chose à corriger avant de lancer qui que ce soit · **la bascule du mode test est absente de ONZE apps sur 14, pas de 4 comme le registre le dit** — remesuré le 07/09 : seules `index.html`, `correction_dictee.html` et `evaluation-qcm.html` la portent ; **sans elle, une app écrit au vrai hub même quand Paul croit être en test.** C'est la dette la plus lourde qui reste · **4 fichiers hors socle, confirmé** : `Console_ateliers_revisions.html`, `deploy-monitor.html`, `etude_dugain.html`, `redaction_dugain_v3.html` — ils ne connaissent pas `mjpc-hub` · **`usage`/`quandPas` : la dette semble périmée** — j'ai mesuré **3 occurrences de chaque dans `index.html`, aucune vide** ; je n'ai pas cherché ailleurs, **vérifie avant de la reprendre** · le rafraîchissement après injection, cause jamais identifiée · **M17a — la purge des données 2025-2026 et l'import des vraies classes, que Paul a placé « en tout dernier de tout dernier »**.

**Et un point de sa décision à ne pas oublier** : ses classes actuelles sont **celles de 2025-2026**, des données martyres. Quand M17a passera, **l'appariement qu'il vient de faire pointera dans le vide** et sera à refaire. Il le sait, il a tranché en connaissance de cause.

---

## ⑦ COMMENT LUI PARLER

**Dans ses mots, jamais dans le vocabulaire du chantier.** Il est professeur, pas ingénieur. « Ce que l'année t'a coûté », pas « le compteur d'heures perdues ».

**Des verdicts tranchés** : soit ça va, soit ça ne va pas. **Jamais « avec réserve », jamais « point d'attention ».** Si ce n'est pas mesuré : **« je ne sais pas »**.

**Termine chaque réponse par les tests manuels concrets, puis par le mot MEMO seul sur sa ligne.**

**Et dis-lui ce que tu n'as pas pu vérifier.** C'est ce qu'il attend de toi le plus sûrement.

---

## ⑧ CE QUE JE N'AI PAS VÉRIFIÉ — ne le prends pas pour mesuré

**Paul m'a fait tout remesurer avant de mourir. Ce qui suit est donc court, et c'est ce qui reste vraiment inconnu.**

- **« Le lot 2ter est éprouvé en conditions réelles »** : c'est **le témoignage de Paul et ses captures d'écran**, pas une mesure que j'ai pu faire — **je n'exécute pas la page.** J'ai confronté ses captures à sa grille au hub, case par case, et elles concordaient : c'est le plus loin que je puisse aller.
- **Le défaut de l'éditeur de diaporama** : je ne sais pas si les deux lignes du §① en sont la cause. **Demande à Paul, c'est la première chose à faire.**
- **`usage`/`quandPas`** : mesuré dans `index.html` seulement, **3 occurrences de chaque, aucune vide**. La dette du registre paraît périmée, **mais je n'ai pas cherché dans les 13 autres apps.**
- **Le rafraîchissement après injection** : la cause n'a jamais été identifiée par personne, et je ne l'ai pas cherchée.

**Ce qui, en revanche, EST mesuré et daté du 07/09** : l'état des deux dépôts · l'étanchéité dans les deux sens · les 43 rapports et 13 livraisons · les comptes de corrections, sourcés au registre · les 11 apps sans bascule · les 4 fichiers hors socle · les deux lignes du diaporama · l'état du hub. **Ne les remesure pas sans raison ; remesure-les si tu t'apprêtes à écrire un chiffre dans un mandat.**

---

*Conscience n°11 — du 31 août au 7 septembre 2026. Registre : section F, `n°11 · 01` à `n°11 · 99`. Transcript : `TRANSCRIPTS/C11/TRANSCRIPT-C11.md`.*
