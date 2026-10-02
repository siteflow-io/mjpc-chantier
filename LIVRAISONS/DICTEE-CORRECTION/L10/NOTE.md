# DICTÉE — L'ÉCRAN DE CORRECTION · L10 — la capitalisation des formes fautives

*Exécutant du complément L10 (cadrage et maquette v2 validés par Paul le 02/10 ; `TRANSCRIPTS/C12/pieces/T369-maquette-capitalisation-v2.html`, le noyau de cette livraison). Rien n'est promu.*

## Ce que ça change pour toi
- **Ta correction capitalise** : dans la case « ce qu'a écrit l'élève » (mode rapide ET mode texte), au-dessus de la case, **la liste de toutes les formes déjà recopiées sur ce mot, dans toutes tes dictées**, en colonnes « n · *forme* ×compte », de la plus fréquente à la plus rare, **sans limite**, jamais le mot juste, jamais le vide.
- **Le pavé numérique choisit** : les chiffres **se composent** (« n° 1 » à côté de la case, les lignes qui peuvent encore correspondre surlignées, la ligne exacte plus fort) ; **la forme est prise dès que le numéro ne peut plus être le début d'un autre** (13 formes : 3 → prise ; 1 → attend ; puis 2 → la 12) ; **Entrée** prend le numéro en cours ; un numéro qui n'existe pas → « Pas de forme n° … ». **Ctrl + chiffre** fait comme le pavé. **Un chiffre de la rangée du haut est du texte** (« 3 » pour « trois »). **Échap** efface le numéro en cours, puis ferme la case. La garde du mot juste s'applique à tout. Un clic sur une ligne la prend.
- **Les formes sont des objets à part**, `correction_dictee_erreurs/<id>` = { id, creeLe, mot, forme, type, dicteeId, texteKey, niveau } — **aucun nom, aucune clé d'élève, aucune classe**. Écrits à chaque enregistrement, mis à jour si la recopie change, retirés si l'erreur est retirée (Ctrl+Z, clic) tant que la copie existe ; **jamais retirés par la suppression d'une copie, d'une dictée, ni par la purge** (le nœud est dans `MJPC_PURGE.preserver` et `MJPC_MANIFESTE.noeuds`, republiés à l'ouverture).
- **À la première ouverture d'une dictée** après la promotion, si le nœud est vide, **toutes tes copies déjà corrigées sont relues une fois** : chaque erreur G ou L recopiée devient un objet ; une ligne le dit : « ✓ n formes retenues ». (Pour garder le lien, chaque erreur ainsi relue reçoit, dans sa copie, la référence de son objet — `formeId` ; rien d'autre ne change dans les copies.) Les dictées de test (identifiant commençant par « _ ») n'entrent pas.
- **Rien devant l'élève** : objets, liste, numéro ne paraissent ni dans sa vue, ni sur sa feuille, ni dans son autocorrection.

## Le « mot » d'une forme
Le mot attendu, tel qu'écrit dans le texte, **la majuscule de début de phrase ignorée** (« Marguerite » en tête de phrase → « marguerite ») : la règle de la maquette. Conséquence à connaître : un nom propre en tête de phrase est rangé sans sa majuscule ; ailleurs, avec.

## Trois défauts trouvés au banc, réglés ici
1. Le pavé était lu par la valeur de la touche, qui change quand le verrou numérique est éteint (« 3 » devient « Page suivante ») : il est lu **par la place de la touche** — le pavé choisit, verrou allumé ou non.
2. Une écoute déjà là fermait la case du mode rapide sur Échap **avant** que le numéro soit effacé : Échap efface d'abord le numéro.
3. Dans la petite fenêtre du mode texte, la liste débordait et la case était écrasée : la fenêtre **s'élargit quand la liste est là** (deux colonnes), la case garde sa largeur.

## Non vérifiable au banc — à essayer chez toi
**Ctrl + chiffre dans Chrome** : Ctrl+1 à Ctrl+9 changent d'onglet, peut-être avant que la page voie la touche (le banc, sans onglets, le montre fonctionner). Le pavé, lui, marche dans tous les cas.

## Le fichier
- Base **6.7.0-L8 en ligne** (755 719 o, md5 `a6c0ce567fc92617be2ce0f6d613fff7`, vérifiée à la commande) → **6.7.0-L10** : **768,109 o** (+12,390), md5 `cd2363f9241bb07088bf14cfc36ab0f4`.
- Ajoutées : `FORMES`, `motCleForme`, `empreinteTexte`, `idForme`, `formesPour`, `formesSynchroniser`, `formesOuverture` ; dans `CorrScreen` : `finOuvertureL10`, la ligne « n formes retenues » ; dans `CorrEleve` : le numéro (`numFormes` + sa référence), `toucheFormes`, `listeFormesHtml`, `numeroHtml`, `listeFormesTexte`. Modifiées : `save` 6,128 → 6,217 · `confirmFautifI` 930 → 964 · `confirmFautifTexte` 659 → 693 · `cancelFautifI` 96 → 130 ; les deux cases (la liste, le numéro, les touches), l'écoute d'Échap de la case du mode rapide, la fenêtre du mode texte, la ligne d'aide du mode rapide (« pavé numérique = choisir une forme déjà vue »), le contrat (`noeuds`, `preserver`), `niveau` dans les données de la dictée. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L10_geste.py`** (les dix vérifications du banc de la maquette, jouées sur l'app, au vrai clavier) : deux dictées au même texte (« silabes » ×3, « 2 », « Syllabes » = le mot juste à la casse près, une recopie vide, dix autres formes) et une troisième d'un autre texte avec « syllabes » et sa forme à elle ; **avant : le nœud vide ; première ouverture : « n formes retenues », le nœud rempli et compté, aucun nom ni clé d'élève dans les objets** ; G sur « syllabes » : **la liste = celle recalculée depuis les objets** (13 formes, « silabes ×3 » en 1, la forme de l'autre texte comptée, ni le mot juste ni le vide) ; Numpad3 → la 3 prise aussitôt ; Numpad1 → « n° 1 », 5 lignes surlignées (1, 10-13), la 1 exacte ; Numpad2 → la 12 ; Numpad1 + Entrée → la 1 ; Digit3 + Entrée → « 3 » enregistré comme texte (L) ; Ctrl+2 → la 2 ; « Syllabes » refusé (garde) ; Échap efface « n° 1 » puis ferme ; « zzneuve » tapée → un objet, dans la liste ensuite ; mode texte : « zzctrlz » puis **Ctrl+Z → l'objet retiré** ; la même liste en mode texte, Numpad3 → prise ; **la copie effacée, puis la dictée jumelle supprimée → le nombre d'objets inchangé** ; rouverte : **pas de seconde reconstruction** ; **le contrat publié préserve le nœud** ; 0 erreur. **Sur L8, ce banc est rouge.**
**Banc unique sur L10 : VERT, 0 échec** (`sorties/`, joué en tranches sur la version définitive) : S1/S3 sans perte, S2 correct ; fuzz_correction ×2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur ; bancs L1, L2, L3, L5, L6, L6b, L7, L8, L10 verts ; vue élève identique à la 6.6.3.

## Infobulles (pour toi)
La liste (« Les formes déjà vues sur ce mot dans toutes tes dictées… Le pavé numérique choisit… la rangée du haut s'écrit… Ctrl + chiffre = comme le pavé ») ; chaque ligne (« Clic : prendre cette forme. Au pavé : n ») ; le numéro en cours ; la case (« Ce que l'élève a écrit, tel quel. Le mot juste est refusé… ») ; la ligne « n formes retenues ».

## Captures (`captures/`, à 1366 px)
`K1-avant-rapide.png` (L8 : la case vide) / `K2-apres-rapide.png` (L10 : la liste) ; `K3-apres-compose.png` (1 au pavé : « n° 1 », les candidates surlignées) ; `K4-apres-texte.png` (le mode texte).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → ouvre une dictée déjà corrigée (les Dylan) : « ✓ n formes retenues ».
2. Ouvre une copie des Franklin (même texte) → mode rapide → sur un mot souvent raté, G : la liste des formes des Dylan, la plus fréquente en 1.
3. Tape son numéro au pavé : elle est prise. Avec 10 formes ou plus : 1 attend (« n° 1 »), puis le second chiffre ; Entrée prend le numéro en cours ; Échap l'efface.
4. Tape « 3 » avec la rangée du haut : il s'écrit dans la case.
5. Une forme nouvelle : à la copie suivante, elle est dans la liste.
6. Mode texte : le même mot, G : la même liste, les mêmes gestes.
7. Essaie Ctrl + 2 : s'il change d'onglet dans ton navigateur, dis-le.
