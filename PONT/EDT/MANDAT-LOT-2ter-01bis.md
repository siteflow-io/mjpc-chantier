# MANDAT EXÉCUTANT — LOT 2ter · COMPLÉMENT À LA LIVRAISON ① · CE QUI EST POSÉ DOIT SURVIVRE
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 657 594 octets**, md5 **`b322540e9baa879985a6dca7697a9948`**, **149 fonctions `edt*`**, version affichée **8.73.0-①**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-①bis**.*

*Ce mandat ne rouvre pas la livraison ①. Elle a été auditée sur pièces le 31/08 et son cœur est bon : 122 identifiants posés sur le calendrier réel, 0 collision, déterministes, cas limites tenus. Tu répares **deux choses précises**, tu ne touches à rien d'autre.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **tout est un objet, encore une fois.** » · « **objet, donc id.** »

« **qu'est-ce qui, modifié, peut faire perdre des données écrites avant ?** » · « **je veux savoir exactement quoi remplace quoi, qu'est-ce qui disparaît, qu'est-ce qui est simplement déplacé.** »

« **ce que Paul a posé à la main survit** » à toute réinjection.

« **pas de livraison finale avec dettes non réglées sinon on accumule.** » · « **je ne promeus pas sur dette.** »

**Concrètement, pour Paul en classe.** Il réinjectera sa grille et son calendrier plusieurs fois dans l'année : le responsable EDT change un créneau, une période bouge, un nom se corrige. À chaque fois, ce qu'il a posé à la main — ses coches, ses décisions, ses heures banalisées — doit **retrouver le même objet**. Aujourd'hui, deux trous font que ça ne tient pas : ses périodes changent d'identité en silence à la réinjection, et le mécanisme qui devait compléter les objets déjà au hub — en archivant avant d'écrire — n'est branché sur rien. Les deux sont invisibles tant que rien ne bouge, et coûtent une décision perdue le jour où quelque chose bouge.

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL

**Lis avant de coder** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` (§① l'identité, §⑯ ce qui ne doit pas bouger, §⑰ les preuves, §⑱ la découpe) · `PONT/EDT/rapport-2ter-01.md` · `PONT/EDT/outils/verif_edt.py`. **`index.html` fait 1,6 Mo : ne le lis jamais en entier**, lis par recherche et par extraits.

**Le jeton du sas te sera donné dans la conversation, une fois.** Il ne s'écrit **jamais** dans un fichier — ni dans ton rapport, ni dans un script, ni dans un commentaire. Tu n'as **aucun** accès en écriture à la production : Paul seul promeut.

**L'état réel, mesuré le 31/08 — ne le suppose pas, il commande tout** : `/site/edt` au hub est **`null`**. Rien n'y a jamais été écrit. Le chemin réel de la rentrée est donc **la première injection** ; la mise à niveau ne servira qu'après. Cela ne la rend pas facultative : elle doit être **branchée et inerte**, pas absente.

**Cherche avant de fabriquer.** Le site a un **mode test natif** — `m8BasculerModeTest`, `m8TestOn`, `M8_TEST_STORE` — qui intercepte lectures **et** écritures, et qui depuis le correctif ③ couvre aussi `mjpcEcrireRest`. Il te sert de faux hub. **Ne fabrique pas de banc** avant d'avoir mesuré ce que celui-là fait : l'exécutant précédent en a écrit un de 1,6 Mo sans chercher.

## ① BRANCHER LA MISE À NIVEAU — elle existe, elle est juste, personne ne l'appelle

**Mesuré le 31/08** : `edtMettreANiveau` a **une seule occurrence dans tout le fichier**, sa déclaration (L18003). Aucun appel, aucune variante, aucun `onclick`. Et `edtArchiver` n'est appelée **que depuis elle** (L18020) : l'archivage avant écrasement est inatteignable par le même fait. Ce qui tourne à la fin d'`edtCharger` (L18034), ce sont les **charges en mémoire** — les identifiants sont recalculés à chaque affichage et **jamais écrits par ce chemin**.

Le mandat v2 la met dans ① : « ① Identité des objets (**à l'injection d'abord, en mise à niveau ensuite**) ».

**Ce qu'on attend, en résultat, pas en recette :**
1. **Elle est appelée par le chargement**, une fois, après que les charges ont tourné.
2. **Elle n'écrit que s'il y a quelque chose à mettre à niveau.** Hub vide → **zéro écriture**. Hub déjà complet → **zéro écriture**. Un chargement ne doit jamais republier ce qui est déjà juste : c'est un écrasement gratuit, donc un risque gratuit.
3. **Elle archive avant d'écrire, et abandonne si l'archivage échoue** : rien n'est écrit, le site continue en lecture avec les valeurs calculées en mémoire, **et il le dit**. Jamais en deux temps.
4. **L'archivage dont il s'agit est celui qu'elle porte déjà**, et rien de plus. Le mandat v2 décrit cet archivage au §① (`edtArchiver` → `atCorbeilleCle`, modèle `chInjecterConfirme`) et liste par ailleurs « l'archivage avant écrasement » **généralisé à toute écriture destructive du bloc** en livraison ③. Ici tu rends atteignable celui de la mise à niveau, déjà écrit et déjà déclaré au contrat de `verif_edt.py` : **tu n'étends l'archivage à aucune autre écriture**.
5. **Elle ne porte que la charge inscrite aujourd'hui** — `identite`. Les trois autres charges annoncées (§⑨ date d'injection de repli, §⑧ classement de repli, §② reprise des `justifie`) naissent en livraisons ②, ⑤ et ⑨ : **ne les anticipe pas**, ne prépare pas leur code, n'invente pas leur contenu.

## ② FERMER LA PORTE OUBLIÉE — les périodes perdent leur identité à la réinjection

**Mesuré le 31/08.** Tu avais trouvé et fermé une perte d'`id` dans `edtPeriodesEcrire` (L18278 : `{id:p.id, rang:i+1, …}` — correct). **Il y en avait deux.** `edtFusionnerPeriodes` (L18213-18220) reconstruit chaque période en `{rang, nom, debut, fin}` — **sans `id`** — alors qu'elle a l'ancienne période sous la main (`vieilles[p.nom]`). Et son résultat part **directement à l'écriture** :

```
L18256   var p={annee:…, periodes:edtFusionnerPeriodes(o.periodes)};
L18257   try{ edtPoserIdsObjet('periodes',p); }catch(e){}
L18258   mjpcPutJson(FIREBASE_BASE+edtChemin('periodes')+'.json',p, …);
```

Donc à chaque réinjection de la grille, les périodes existantes perdent leur identifiant et en reçoivent un neuf, recalculé sur leur contenu. Invisible tant que rien ne change ; **dès qu'un nom ou une date de période est retouché, l'identité change** et ce qui y était attaché devient orphelin. Le défaut **préexiste dans la base** (L17988) : c'est une dette préexistante, et elle rejoint le lot en cours.

**Ce qu'on attend :**
1. **Un `id` déjà en service n'est jamais perdu à l'écriture.** Priorité : l'entrant porte un `id` → il fait foi ; sinon l'ancienne période retrouvée transmet le sien ; sinon seulement, `edtPoserIdsObjet` en pose un neuf.
2. **Tu ne fabriques pas d'appariement gradué ici.** Le fort/faible, le différentiel et l'archivage avant écrasement sont la **livraison ③** du mandat v2 : n'y touche pas, ne branche pas `edtApparier`. `edtFusionnerPeriodes` apparie déjà par nom : tu **conserves** ce qu'elle avait sous la main, tu n'ajoutes pas une règle nouvelle.
3. **Tu vérifies qu'il n'y a pas de troisième porte.** Passe en revue **toutes** les reconstructions d'objet du bloc EDT — tout endroit qui refabrique un objet de famille avant de l'écrire — et dis, nommément, lesquelles conservent l'`id` et lesquelles ne le conservent pas. Si tu en trouves une autre, tu la fermes dans cette même livraison et tu la déclares.

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT — ne l'anticipe pas

- **L'appariement gradué et biunivoque**, le différentiel nominatif, l'archivage avant écrasement **généralisé** : livraison ③.
- **Les décisions qui sortent de l'objet injecté** (magasin `decisions`, `justifie` retiré) : livraison ②.
- **La classe d'essai 3E Charles de Gaulle.** Paul a décidé le 31/08 qu'elle entre dans ce lot, mais **son dimensionnement n'est pas tranché** : il le tranchera avec la conscience. Tu n'en écris pas une ligne.
- **La vue Année, les photos, les heures perdues, les motifs, la banalisation** : livraisons ⑤ à ⑧.

Si l'un de ces sujets te paraît nécessaire pour finir le tien, **tu le signales et tu attends**. Tu ne l'ouvres pas.

## ③ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et à publier

- **Moteur du déroulé** : `AT_DR_B64`, **309 812 caractères**, md5 de la chaîne **`2ba70f9ef8aacb6f81962ea4e1b62944`**. Identique bit à bit avant et après.
- **`function secu*` : 29** · **`published` : 97** · **`EDT_ANNEE` : 12**.
- **`function edt*` : 149**, **aucune ne disparaît**. Toute fonction ajoutée est **nommée** dans le rapport.
- **Les trois portes hors du bloc, et pas une de plus** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`.
- **Le correctif ③ reste tel quel** : le garde-fou du mode test dans `mjpcEcrireRest` ne se touche pas, ne se déplace pas, ne se « nettoie » pas.
- **`edtApparier` reste non branchée** : 0 appel avant, 0 appel après. C'est la livraison ③.
- **Les 122 identifiants du calendrier réel** (`PONT/EDT/json/calendrier-2026-2027.json`) restent **les mêmes**, même répartition : **15 evc · 30 jal · 59 eta · 11 fer · 7 vac**, 0 collision.
- **Double parseur vert** : `node --check` **et** acorn ES2020.
- **Garde `verif_edt.py` verte** sur ton candidat.

## ④ PREUVES EXIGÉES — mesurées, aucune affirmée

Chaque preuve porte **un chiffre, un chemin, une commande**. Une preuve « logique » n'est pas une preuve. Si une preuve n'a pas pu être jouée dans le site mais seulement en appelant une fonction à la main, **tu le dis** : c'est ce qui a manqué au rapport ①.

1. **La mise à niveau est atteignable** : nombre d'appels à `edtMettreANiveau`, avec la fonction et la ligne de chaque appel.
2. **Hub vide → 0 écriture** au chargement. Journal des écritures à l'appui.
3. **Hub déjà complet → 0 écriture** au chargement. Un site qui republie sans raison est un site qui écrase sans raison.
4. **Hub avec un objet privé de son `id` → 1 archive, puis 1 écriture**, dans cet ordre, et le site le dit.
5. **Archivage simulé en échec → 0 écriture**, message affiché, le site continue en lecture.
6. **Périodes, identité conservée** : réinjection d'une grille dont les périodes portent des `id` → **les mêmes `id` après**, aucun neuf. Donne-les avant/après.
7. **Périodes, nom retouché** : une période renommée conserve son `id` d'origine. Donne l'`id` avant et après.
8. **Revue des reconstructions d'objet** : la liste complète, avec pour chacune « conserve l'`id` » ou « ne le conserve pas », et ce que tu en as fait.
9. **Non-régression** : la liste chiffrée du §③ ci-dessus, méthode nommée.
10. **Garde** : verte sur ton candidat, **et rouge sur trois contrôles négatifs que tu poses toi-même** — un appel hors contrat, un `edt*` appelé hors du bloc sans être une porte, une écriture hub hors de `/site/edt/`. Donne le texte du refus.
11. **Audit adverse** : cherche ce qui **casserait** ton code, pas ce qui le confirme. Périodes sans nom, deux périodes de même nom, `id` en double dans l'entrant, JSON tronqué, hub qui répond une panne au milieu de l'archivage, deux chargements concurrents, mise à niveau pendant une modale ouverte. **Hub vide : c'est l'état réel.**

## ⑤ MÉTHODE ET DÉCOUPE

**Deux livraisons courtes**, dans cet ordre, chacune poussée au sas et **close par un arrêt** : Paul relance par « continuer » (le « continuer » natif plante une fois sur deux, ne compte pas dessus).

- **①bis-a** — la mise à niveau branchée (§①). Version **8.73.0-①bis-a**. Rapport, puis STOP.
- **①bis-b** — les périodes, et la revue des reconstructions (§②). Version **8.73.0-①bis**. Rapport final, puis STOP.

**Tu ne livres jamais avec une dette.** Si tu trouves un trou — même hors de ce mandat, même préexistant — tu le **déclares** et tu le résous dans cette même livraison, avant la finale. Tu ne le reportes pas, tu ne le notes pas « pour plus tard » : Paul ne promeut pas sur dette.

**Tu ne réécris pas ce mandat.** Si tu y trouves une contradiction ou un trou, tu le **signales** et tu attends. Un exécutant qui réécrit son mandat n'y trouve que ce qu'il y a mis — c'est arrivé sur ce lot, Paul l'a arrêté.

**Écris ton rapport pour une conscience qui n'a pas vu la conversation** : chiffres, chemins, commandes. Et **avant tout promeus, les captures d'écran entier avant/après du même parcours par clics** : Paul promeut sur captures.

## ⑥ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) + un rapport par livraison, `PONT/EDT/rapport-2ter-01bis-a.md` puis `PONT/EDT/rapport-2ter-01bis.md`. Le rapport porte la base, le candidat produit (**taille et md5 mesurés sur le fichier réellement poussé**, pas sur celui de ton disque), les preuves du §④, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.
