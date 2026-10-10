# COMPLÉMENT 1 — LA MAQUETTE COMPLÈTE DU QCM : CE QUE L'AUDIT FINAL A TROUVÉ

*Écrit par la conscience n°12 le 10/10/2026 (tour 639), sur l'ordre de Paul : « Ok fais le mandat qui règle tout. Puis dis moi quand je relance l'exécutant » (13:44). Pour l'exécutant de la maquette complète du QCM, en session cloud de Claude Code, dans le dépôt du sas `siteflow-io/mjpc-chantier`. Il complète le mandat https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md, qui reste en vigueur en entier. Le rapport d'audit : https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/MAQUETTE-QCM-COMPLETE-10-10/README.md.*

---

## 0. Ce que ça change pour la classe

Ta maquette v5 est sérieuse, et son banc passe (15 712 vérifications, 0 échec, rejoué par la conscience). Mais l'audit final y a trouvé **cinq défauts que ce banc ne voit pas**, et une tension que Paul a tranchée. Si Paul validait la v5, le code partirait d'une image fausse :
- dans MJPC, les écrans « Élèves & codes » et « Taxonomie » perdraient de vraies fonctions (l'import de la classe, ↻ et ✕ sur chaque élève, la fiche de l'élève avec ses aménagements, l'arbre des notions), et afficheraient des chiffres inventés ;
- la console de Paul montrerait des renvois au cadrage ;
- l'instance de création d'éval recevrait une règle de longueur absurde (moins de choix, moins de texte), et des questions seraient refusées au collage ;
- un élève perdrait une phrase de l'app d'aujourd'hui ;
- le PDF « notes et compétences » porterait les marques de validation du cadrage, que l'extension de Paul lirait dans École Directe ;
- une famille lirait « un peu surestimé » dans un bloc et « nettement surestimé » dans le bilan d'à côté.

Ce complément les corrige tous, **et ajoute au banc les gardes qui les auraient vus**, pour qu'ils ne reviennent pas.

---

## 1. Qui tu es, ce que tu ne fais jamais

Tu es **l'exécutant du complément 1 de la maquette complète du QCM**. Les onze interdits du mandat (§1) valent tous, mot pour mot. En particulier : **tu fais tout ce complément d'une traite, sans t'arrêter et sans rien demander** (personne ne te répondra) ; tu ne t'arrêtes qu'une fois, quand l'étape D est finie et son banc à zéro défaut ; **une livraison n'a jamais ni trou ni dette** : un défaut se corrige, toujours, il ne se marque pas.

En plus :
1. tu travailles sur la branche `maquette-qcm`, et seulement dans `MANDATS/MAQUETTE-QCM-COMPLETE/` ; tu ne fusionnes rien dans `main` ;
2. tu ne modifies pas les fichiers `maquette-qcm-v1.html` à `v5.html` ni leurs md5 : ils restent l'histoire ; ta livraison est `maquette-qcm-v6.html` ;
3. tu ne touches qu'à ce que ce complément nomme, **et** à tout ce que les nouvelles gardes trouvent (§4) : chaque trouvaille est un défaut, corrigé et inscrit au journal ;
4. tu ne lis pas le hub réel : les vraies données dont tu as besoin sont dans des fichiers de la production (§2).

---

## 2. À lire d'abord

Commence ainsi : `git fetch origin`, `git checkout maquette-qcm`, puis `git merge origin/main`. La fusion n'apporte que des fichiers hors de ton dossier (le cadrage à jour, ce complément, le rapport d'audit) : aucun conflit n'est possible, puisque tu n'as écrit que dans ton dossier.

À lire, en entier :
1. ce complément ;
2. le rapport d'audit, `AUDITS/MAQUETTE-QCM-COMPLETE-10-10/README.md`, et ses `sorties/` ;
3. dans `MANDATS/CADRAGE-QCM.md` : la ligne d'état (ligne 6), puis les sections des tours 638 et 639 (points 680 à 696), qui sont les plus récentes et font foi ;
4. ta propre livraison : `README.md`, `DEFAUTS.md`, `POINT-SCENE.md`, `mesures/README.md`.

Dans la production (clone en lecture, `main` à `d873f69`), vérifie les md5 avant tout :

| Fichier | md5 au 10/10/2026 | Pourquoi |
| --- | --- | --- |
| `PROTOCOLE-MAQUETTE.md` | `cea75531c1caf46e566ef45b5a9f3d17` | les règles de toute maquette |
| `evaluation-qcm.html` (7.7.1) | `ecae65624855a1a877708986a8e984e5` | l'existant du QCM |
| `index.html` (MJPC) | `ac792b28f40d3a0510e725fc4a6b6985` | l'existant de MJPC : « Élèves & codes », la fiche de l'élève, la Taxonomie |
| `taxonomie_atelier.json` | `26128f95a0c0b59f45f6cc672218497b` | **la vraie taxonomie** : version 1.4.0 du 2026-08-02, 7 domaines, 51 familles, 210 notions, et les 28 compétences (`competences.francaisC4`, `competences.transversales`) ; c'est le même contenu qu'au hub le 10/10, relu par la conscience |
| `correction_dictee.html` | `9d5dcfb612a70a8182689566b1fe23c5` | le modèle du bilan général |

Au sas : `MANDATS/LIBELLES-ELEVE-COMPETENCES/libelles_eleve.json` (md5 `17e9a9876c0372bd7716e5a5acb542b0`), les 28 libellés élève.

---

## 3. Les défauts, et ce qui est attendu

### Défaut 1 — les écrans de MJPC ne partent pas de l'existant

Scènes : `m-classe-exclusions`, `m-exclusion-refusee`, `m-taxonomie-competences`. Ta v5 dit elle-même « le panneau prof est redessiné » : c'est le défaut. **Ces écrans reprennent le balisage, les classes CSS et les textes d'`index.html`**, copiés de la production, et n'ajoutent que ce que le cadrage change (les exclusions, 585 et 590 ; la section « Les compétences », 637). Chaque élément vient d'une ligne de source que ton inventaire cite (§4, garde 1).

1. **Le menu du panneau prof** (l. 1627 à 1646) : les 14 entrées, sous leurs quatre titres (« Vue d'ensemble », « Personnes », « Contenu », « Système »), avec leurs icônes. « 👥 Élèves & codes » et « 📚 Taxonomie » ouvrent leurs scènes. Les 12 autres sont **grisées**, avec l'infobulle « Inchangé : cet écran reste celui d'aujourd'hui. » (protocole §2 : un bouton fait ce qu'il dit, ou il est grisé avec la raison).
2. **« Élèves & codes »** (la section, l. 5505 à 5532), dans l'ordre du vrai écran :
   - l'encart de la clé (`secuEncartHtml`, l. 14749), dans l'état « clé saisie » : c'est l'état où se voient le ◆ et les fiches ;
   - l'import du fichier de classe (`eliSectionHtml`, l. 5555) ;
   - la barre des classes (`lens-bar`) ;
   - la zone d'import : le champ (« Un élève par ligne », « ex : DUPONT Marie ») et « + Importer / compléter » (l. 5518) ;
   - la barre d'outils (l. 5522) : « Générer N codes manquants » quand des élèves n'ont pas de code, « 🖨 Imprimer », « Tout régénérer » ;
   - chaque ligne d'élève comme à la l. 5529 : le numéro ; le nom, cliquable, avec son infobulle (« Ouvre la fiche de l'élève : sexe, dispositif, cases PAP. Rien n'est écrit tant que tu n'enregistres pas. »), qui ouvre la fiche ; le ◆ d'un élève à dispositif ; le code (✻✻✻✻ quand il est masqué) ; **↻** (« Régénérer le code ») ; **✕** (« Retirer l'élève »).
   - **« 🚫 Jamais avec… » prend place dans la ligne, juste après le ◆**, c'est-à-dire à côté des aménagements (585). Il garde ce que ta v5 fait déjà : les camarades à cocher, les deux sens, au plus 3, la quatrième refusée avec la raison (`m-exclusion-refusee`).
3. **La fiche de l'élève** (`elfOuvrir`, l. 5917) : une nouvelle scène, ouverte par un clic sur le nom. Elle reprend la vraie fiche : son titre, « ← 3 ESSAI · Élèves & codes », le sexe, le dispositif et les cases PAP (les vraies lignes du code), la synthèse, l'historique, « Enregistrer la fiche », « Fermer ». Seules les données sont inventées, pour un élève de « 3 ESSAI ».
4. **« Taxonomie »** (`_profSectionTaxo`, l. 2084 ; `_blocTaxonomie`, l. 2605 ; l'éditeur, l. 2484 à 2604) :
   - le titre « 📚 Taxonomie — le référentiel des notions », le paragraphe, et « Ouvrir l'éditeur » (« Fermer l'éditeur » quand il est ouvert) ;
   - l'éditeur ouvert, sur **la vraie taxonomie**, copiée dans tes sources avec son md5 (ce n'est pas une donnée d'élève). La ligne d'état est exactement celle que la vraie fonction produit avec cette donnée : « Version 1.4.0 · 2026-08-02 · 7 domaines · 210 notions ». Puis les 7 domaines, chacun avec « N familles · M notions » ;
   - une scène avec un domaine ouvert : ses familles et ses notions, chaque notion avec « Élève : … », ses niveaux, son exemple, « ✏️ Modifier », « Désactiver » ou « Réactiver », et « + Nouvelle notion » ;
   - une scène avec une notion en modification : « Libellé professeur », « Libellé élève », « Niveaux », « Exemple (facultatif) », « Enregistrer », « Annuler » ;
   - **dans l'éditeur, après l'arbre, la section « Les compétences » (637)**, bâtie sur le modèle des notions (mêmes classes, mêmes boutons). On y trouve les 28 compétences de `taxonomie_atelier.json`, rangées sous leurs groupes, chacune avec son libellé officiel et « Élève : » suivi de son libellé élève (`libelles_eleve.json`). Une compétence en modification a le même formulaire qu'une notion, avec son « Libellé élève ».
5. **Chaque geste de ces écrans fait dans la maquette ce que sa fonction fait dans `index.html`** (la ligne est citée dans l'inventaire). Il est simulé, et déclaré dans le README. Une boîte système de la vraie app (`confirm`, `alert`) est dessinée dans la page, avec son texte exact.

### Défaut 2 — des renvois au cadrage à l'écran

Relevé de l'audit (`AUDITS/MAQUETTE-QCM-COMPLETE-10-10/sorties/meta.txt` et `meta-infobulles.txt`) :
1. « Le prompt du cadrage (tour 630). » (`c-reglages`, `c-reglages-prompt`) : la phrase part. Le texte commence à « Il ne devine jamais un temps : … ».
2. « … aucune note ne tombe entre deux (340). » : « (340) » part.
3. L'infobulle de « 📖 Mode d'emploi », dans 85 scènes : elle reprend celle de la 7.7.1, mot pour mot, « Ouvre le mode d'emploi avec toutes les explications de l'app. » (l. 6016).
4. L'infobulle « Remet le prompt du cadrage (tour 630)… » : le geste est « 🔄 Restaurer le prompt par défaut » de la 7.7.1 (l. 6499). Il garde le comportement et l'infobulle de la 7.7.1, sauf si un point du cadrage les change. Dans ce cas, l'inventaire (§4, garde 1) cite ce point, et l'infobulle dit ce que fait le geste, sans renvoi.

La règle, pour tout le reste : l'infobulle d'un geste qui existe déjà est celle de l'app d'aujourd'hui, mot pour mot ; seul ce que le cadrage change s'écrit autrement. **Un texte de console ne cite jamais un point, un tour, le cadrage, un mandat ou la maquette.**

### Défaut 3 — les limites de longueur se contredisent

Dans `mesures/README.md`, à énoncé court, 5 choix tiennent 410 caractères et 6 choix 480, parce que la mesure à 5 choix garde le plus long choix de la question 3. À 6 choix, la limite tombe aussi de 480 à 120 entre 120 et 150 caractères d'énoncé. Tu refais la mesure ainsi :
1. **une seule règle de répartition, la même pour 4, 5 et 6 choix : tous les choix à la même longueur.** C'est aussi ce que le prompt demande à l'instance (règle 4 : « Les choix sont homogènes en longueur et en construction ») ;
2. la limite est **la longueur d'un choix** : la plus longue qui tient, sur les trois écrans que tu as déjà retenus (la réponse, B, la lecture du voisin), chacun à son état le plus chargé ;
3. l'énoncé va de 40 à 300 caractères, par pas de 20 ; la longueur d'un choix avance par pas de 5 ;
4. **la limite est suffisante** : à chaque point du tableau, toutes les longueurs plus courtes tiennent aussi, et le banc le vérifie sur un échantillon ;
5. **elle ne croît jamais**, ni avec le nombre de choix, ni avec la longueur de l'énoncé ;
6. **l'étalon** : la vraie question 3 de 3e garde ses 67 px de reste sur l'écran de réponse. Le README dit, chiffres à l'appui, si elle respecte la nouvelle limite. Si elle ne la respecte pas alors qu'elle tient, il le dit tel quel : une limite suffisante est prudente ;
7. tu rends le tableau, le `limites.json` refait, et **le texte exact qui remplace `{{LIMITES}}`**. Le texte donne la limite de l'énoncé, puis celle d'un choix pour « 4 choix ou moins », 5 et 6, par tranche d'énoncé, sans phrase qui se contredise. Le prompt affiché et copié dans Réglages (`c-reglages-prompt`) porte ce nouveau texte.

### Défaut 4 — une phrase d'élève de la 7.7.1 retirée sans cadrage

Ton défaut n°19 : « 👀 Écoute le prof — la correction sera révélée. » a été retirée, parce que ton banc interdit tout « le prof » côté élève. La règle de Paul vise « va voir ton professeur » (en classe, l'élève lève la main) et ce qui met le professeur en cause : cette phrase n'est ni l'un ni l'autre (points 684 et 691).
1. Elle revient **là où la 7.7.1 la montre** (l. 4362 : à la correction, tant que la réponse n'est pas révélée), dans toutes les scènes de cet état.
2. « ✅ Réponse enregistrée — tu peux encore la changer » reste seulement là où la 7.7.1 (l. 3356) ou un point du cadrage la met.
3. Le banc cesse d'interdire « le professeur », « le prof », « ton prof » en soi. Il interdit toujours « va voir », « viens me voir », « venez me voir ». La mise en cause du professeur est tenue par la vérification de provenance : seules des phrases validées passent.

### Défaut 5 — le PDF porte les marques de validation (le défaut de la conscience)

Scène `x632-pdf`. On y voit l'encadré « Exemple de la maquette. Dans les commentaires, souligné en pointillés orange : une phrase proposée, pas encore validée par toi. … » et 121 soulignés orange. Ce sont les marques de validation de `gen632.js`, faites pour que Paul relise au tour 632. Le mandat disait « mot pour mot `gen632.js` » sans les exclure : c'est la faute de la conscience, et son audit ne l'a pas vue, parce que son relevé ne lisait pas l'intérieur des cadres (`iframe`).

Tout est acquis (point 659). Le PDF se montre donc tel que le code le produira : **le même texte, mot pour mot, sans l'encadré et sans aucun souligné**. La vérification 9 compare le texte du PDF à celui de `gen632.js`, l'encadré mis à part. Il en va de même pour tout morceau de commentaire marqué « proposé » (`p:true`) ailleurs : aucun souligné.

### Défaut 6 — la tension 686, tranchée : le bloc « 🎯 Ton estimation » suit le bilan général

Dans `t-bilan`, le bloc de Michel dit « Tu as un peu surestimé ce que tu avais réussi », pendant que son bilan général (`c-fiche`) dit « nettement ». Le bloc suit désormais la règle de `com632.js`, avec le même écart :
- écart de deux niveaux ou plus : « Tu as nettement surestimé ce que tu avais réussi. » (phrase validée, point 632) ;
- écart d'un niveau : « Tu as un peu surestimé ce que tu avais réussi. » (la 7.7.1) ;
- les autres cas, inchangés.

C'est vrai partout où le bloc paraît : le bilan au tableau, le bilan imprimé, « Mes évaluations », et la fiche s'il y paraît.

---

## 4. Les nouvelles gardes du banc

Elles entrent dans le banc unique (`banc/banc.js`). Elles passent par le geste dans Chromium, comme les autres, et **lisent aussi l'intérieur des cadres (`iframe`)**.

**Avant de corriger quoi que ce soit, tu joues chaque nouvelle garde sur la v5.** Elle doit y trouver les défauts connus du §3 qui la concernent. La sortie va dans `sorties/gardes-sur-v5.txt`. Une garde qui ne voit pas le défaut connu n'est pas une garde : tu la refais avant d'aller plus loin.

1. **L'existant.** Pour chaque écran de la production dont une scène part, un inventaire va dans `banc/existant/`. Il liste ses boutons, ses champs, ses cases, ses entrées de menu et leurs infobulles, et, pour un écran d'élève, ses phrases.
   - Pour la 7.7.1, l'écran est relevé dans le vrai écran, joué sur le faux hub du banc (`AUDITS/QCM-MODE-TEST-09-10/banc/` : `server.js`, `APP_FILE`, `npm install` ; `banc_modetest.js` montre comment jouer la séance).
   - Pour `index.html`, que l'on ne peut pas jouer sans le vrai hub, l'écran est relevé dans le code de la fonction qui le dessine, avec ses lignes.
   - Chaque inventaire dit quelles scènes partent de cet écran.
   - Le banc refuse une scène qui perd un élément de son inventaire. La seule exception est un élément inscrit dans `banc/existant/retraits.json`, avec le point du cadrage qui le retire ou le remplace, cité mot pour mot ; le banc vérifie que la citation est bien dans `MANDATS/CADRAGE-QCM.md`.
2. **Le méta.** Aucun texte visible, aucune infobulle, dans aucune scène ni aucun cadre, ne contient :
   - « tour N », « point N », « points N à M » ;
   - un nombre de deux ou trois chiffres entre parenthèses. L'exception est une étiquette de donnée déclarée dans le banc avec sa source, comme « 👥 Classe (25) » : le nombre d'élèves ;
   - « cadrage », « mandat », « conscience », « exécutant », « à valider », « pas encore validé », « souligné en pointillés » ;
   - « maquette », hors du sommaire ⚙ ;
   - aucun souligné de proposition (`.prov` visible, ou un trait orange en pointillés).
3. **Les chiffres.** Chaque chiffre affiché qui décrit une donnée réelle vient de la donnée réelle, relue par le banc dans son fichier. Cela vaut pour :
   - la version, la date et les comptes de la taxonomie (`taxonomie_atelier.json`) ;
   - les 28 compétences et leurs libellés (`taxonomie_atelier.json`, `libelles_eleve.json`) ;
   - les durées de la séance (point 649) ;
   - le texte du prompt (`MANDATS/PROMPT-QCM-CREATION/README.md`, avec ses jetons remplacés).

   Un chiffre inventé, s'il décrit une donnée réelle, est un défaut.
4. **Les mesures.** Le banc relit `mesures/limites.json`. Il refuse :
   - une limite qui croît avec le nombre de choix ou avec la longueur de l'énoncé ;
   - un point du tableau dont la limite ne tient pas, ou dont la limite plus un pas tient encore ;
   - un étalon qui n'est plus à 67 px.
5. **L'estimation.** Pour chaque élève dont une scène montre le bloc « 🎯 Ton estimation » et le bilan général (dans la même scène ou dans deux scènes), les deux disent le même degré : « un peu » ou « nettement », selon le même écart.

Les vérifications 1 à 9 du mandat restent toutes. La vérification 4 perd seulement l'interdit « le professeur nommé » (défaut 4).

---

## 5. Les étapes, d'une traite

Quatre étapes, enchaînées sans arrêt. Chacune finit par sa garde (le banc, ses captures regardées, le journal des défauts tenu ; mandat §7), puis par un commit poussé sur `maquette-qcm`. Ce commit est une sauvegarde, pas un arrêt. En cours d'étape, pour ménager le temps, tu peux rejouer le banc sur les seules scènes touchées (`SEUL=…`). **En fin d'étape, il rejoue tout.**

| Étape | Ce qu'elle fait | Sa garde |
| --- | --- | --- |
| **A — les gardes** | La fusion de `main` ; la liste de ce que tu as lu, avec les md5 ; les inventaires de l'existant (§4, garde 1) ; les cinq nouvelles gardes dans le banc. | Elles sont jouées sur la v5, et chacune y trouve son défaut connu (`sorties/gardes-sur-v5.txt`) ; les vérifications 1 à 9 passent toujours sur la v5. |
| **B — les corrections** | Les défauts 1, 2, 4, 5 et 6, et tout ce que les nouvelles gardes ont trouvé d'autre sur la v5 : chaque trouvaille est un défaut du journal, corrigé. | Le banc entier, à zéro défaut. |
| **C — les mesures** | Le défaut 3 : la mesure refaite, le tableau, le texte de `{{LIMITES}}`, et le prompt de Réglages mis à jour. | Le banc entier, à zéro défaut, avec la garde 4. |
| **D — la livraison** | `maquette-qcm-v6.html` et son md5 ; toutes les captures refaites et regardées ; le livret `livret-maquette-qcm-v6.pdf` ; le README, `DEFAUTS.md` et `POINT-SCENE.md` mis à jour ; le banc final. | Le banc final, qui rejoue tout sur la v6, à zéro défaut (`sorties/banc-final-v6.txt`). |

---

## 6. La livraison, une seule

Sur la branche `maquette-qcm`, dans `MANDATS/MAQUETTE-QCM-COMPLETE/` :
1. `maquette-qcm-v6.html`, son md5, ses sources et ses scripts ;
2. `banc/existant/` : les inventaires, et `retraits.json` avec ses citations ;
3. `sorties/` : `gardes-sur-v5.txt`, la sortie du banc de chaque étape, et `banc-final-v6.txt` ;
4. `captures/` : toutes les captures de la v6, écran entier, regardées. Cela comprend les nouvelles scènes de MJPC : la fiche de l'élève, l'éditeur ouvert, un domaine ouvert, une notion et une compétence en modification ;
5. `livret-maquette-qcm-v6.pdf` ;
6. `mesures/` refait ;
7. le `README.md`, avec en tête une section « Complément 1 » :
   - chaque défaut du §3, et la scène qui le montre corrigé ;
   - ce que les nouvelles gardes ont trouvé d'autre, et sa correction ;
   - les mesures, et le texte de `{{LIMITES}}` ;
   - ce que la maquette simule dans MJPC.

   Le reste du README est mis à jour, sans rien laisser de faux. `DEFAUTS.md` continue à partir du n°36, et `POINT-SCENE.md` donne les nouvelles scènes.

Zéro trou, zéro dette, zéro défaut : le banc final le prouve.

## 7. Après l'étape D

Tu t'arrêtes, une seule fois. La conscience fait l'audit final du complément ; Paul valide sur captures. Rien n'est fusionné dans `main` par toi.
