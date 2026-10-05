# DICTÉE — L'ÉCRAN DE CORRECTION · L16a — mode rapide : les formes par type, la bascule, « Changer → », Suppr, la ligne centrée

*Exécutant du complément L15, livraison **L16a** (dettes n°12 · 119, 120, 121 ; maquette validée `TRANSCRIPTS/C12/pieces/T420-maquette-L16-app-reelle-v3.html`, reprise geste par geste **hors audio**, qui reste L16b). **Dans l'ordre du complément : juste après L15e (promue), avant L15f** — L15f, déposée plus tôt par erreur d'ordre, sera reprise sur L16a (L15f-b). Rien n'est promu.*

## Ce que ça change pour toi
- **1. La liste par type** : chaque forme capitalisée garde le type sous lequel elle a été enregistrée ; **la case G ne montre que les formes G, la case L que les formes L** (mode rapide et mode texte) ; le pavé numérique choisit dans cette liste ; « acceptée » / « accepter ici » (L11, par place) inchangés. (Sans type — les propositions de la version aménagée, L15a —, toutes les formes servent.)
- **2. La bascule** (mode rapide, comme la maquette) : en G, une recopie (tapée ou choisie) vue en L **et pas en G** → sous le champ : **« « révaient » a déjà été enregistrée en L (×4). Passer en L ? »**, deux boutons **« Passer en L »** (l'erreur posée en L, la forme comptée en L — pas de double compte) et **« Garder G »** ; l'inverse en L ; une forme vue sous les deux types ne déclenche rien ; **aucun raccourci**.
- **3. Mot déjà marqué** : « Changer → » ne propose que **l'autre type** (déjà G → « Changer → L » seul) (119).
- **4. Suppr** annule l'erreur posée sur le mot courant et passe au suivant, **hors champ de saisie** (dans la case, Suppr efface un caractère) ; l'infobulle de « ✕ Annuler l'erreur » dit « Raccourci : Suppr » ; l'aide « ? » le liste (120).
- **5. La ligne centrée** (121) : au-dessus du gros mot, une grille « gauche | mot | droite » : le mot courant **exactement sous le gros mot**, le même budget de 52 caractères avant et après, « … » à chaque bout dès que le texte continue, des espaces réels, les erreurs soulignées en rouge ; Espace / Entrée / Retour inchangés.
- **6.** Un seul type par mot ; rien ne change côté élève. L'aide « ? » : Suppr, « Changer → », la bascule, le pavé « du type choisi ».

## Le fichier
- Base **6.7.0-L15e en ligne** (872 364 o, md5 `1c8de1e3be1b395939c2c192eb757be0`, vérifiée à la commande) → **6.7.0-L16a** : **876,574 o** (+4,210), md5 `73f4968ea2bacd374effac5e6c372515`.
- Les changements de la maquette repris (hors audio : l'épellation, la voix, le panneau d'enregistrement), nommés proprement : `formesPour(mot, attendu, type)` ; `listeFormesTexte`, la liste du mode rapide, `formeEnCoursL11` (le type) ; `confirmFautifI(valeur, sansBascule, typeImpose)` et la bascule ; « Changer → » ; Suppr ; la ligne centrée ; quatre lignes d'aide. Les deux reprises de la maquette qui défaisaient le micro L14b (la ligne du champ du mode texte) **ne sont pas reprises** : le micro reste. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L16a_geste.py`** (par le geste, 13 vérifications, la 5e « rêvaient » : formes G rêvait ×3, révais, rêver, rêvée ; L révaient ×4, rêveaient ; les deux : revaient) : **la ligne** : sur 16 mots d'affilée, l'écart des centres **≤ 0,01 px**, « … » aux deux bouts ; **G → la liste G seulement** (rêvait, revaient, révais, rêvée, rêver), le pavé 1 → « rêvait » posé en G ; **L → la liste L** (revaient, révaient, rêveaient) ; **« révaient » en G → la bascule**, le message exact, « Passer en L » → posé en L, on avance ; **« rêveaient » en G → « Garder G »** → posé en G ; **« revaient » (les deux) → rien**, posé en G ; **mot marqué G → « Changer → L » seul** ; **Suppr hors champ** → l'erreur annulée, le compte baisse, on avance ; **Suppr dans le champ** → « abc » devient « bc » ; 0 erreur.
**Accordés à L16a** (les versions d'avant jointes, `*_avant_L16a.py`) : `banc_L10_geste.py` (la liste attendue : les formes G ; la composition des numéros prouvée par le n° 12), `banc_L11_geste.py` (en L, « syllabes » n'a pas de forme : « Pas de forme n° 0. »), `banc_L7_geste.py` (la ligne n'est plus la phrase entière : le budget avant/après, « … » aux deux bouts), `banc_L12_geste.py` (le tableau du mode rapide : + Suppr, + « Changer → »), `fuzz_rapide.py` (une forme vue sous l'autre type : il garde le type choisi, comme son modèle).
**Banc unique sur L16a : VERT, 0 échec, 32 étapes** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, L15c, L15c-b, L15c-c, L15c-d, L15d, L15e, L16a, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`R1-ligne.png` (la ligne centrée) ; `R2-liste-G.png` (G : les formes G) ; `R3-bascule.png` (la bascule).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une dictée → mode rapide : la ligne au-dessus du gros mot, le mot courant pile dessous ; avance : la ligne glisse.
2. G sur un mot qui a des formes en G et en L : seules les G ; L : seules les L.
3. En G, tape une forme qu'on n'a vue qu'en L : « … Passer en L ? » ; « Passer en L » ou « Garder G ».
4. Un mot déjà marqué : un seul « Changer → » ; Suppr : l'erreur part et tu avances.
