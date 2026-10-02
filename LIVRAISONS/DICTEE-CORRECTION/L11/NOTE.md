# DICTÉE — L'ÉCRAN DE CORRECTION · L11 — les formes acceptées

*Exécutant des compléments L9-L11-L12, livraison L11 — **point 3 corrigé le 02/10 (C12, tours 393-396) : un BOUTON, aucun raccourci ; le 0 du pavé reste un chiffre**. Rien n'est promu.*

## Ce que ça change pour toi
- **Une règle du texte** : `correction_dictee_textes/<texteKey>/formesAcceptees/<motClé>/<formeClé>` = { mot, forme, creeLe, origine ("correction" | "preparation"), dicteeId } — `texteKey` = l'empreinte du texte (L10), `motClé` = le mot attendu (majuscule de début de phrase ignorée), `formeClé` = la forme sans la casse. **Toutes les dictées qui ont ce texte la partagent** ; le nœud est déjà préservé par la purge. (`dicteeId` = la dictée où la règle a été posée : c'est ce qui permet d'écrire « acceptée dans « titre » ».)
- **Sur une copie** : l'erreur dont la recopie est une forme acceptée **garde son type et sa couleur**, porte `sansCout: true`, et **ne compte ni dans la note, ni dans les forfaits, ni dans les répétitions** (`computeNote` la saute ; `counts.sansCout` la compte à part). **Rétroactif** : poser ou retirer une règle recalcule toutes les copies de toutes les dictées du texte — « n copies recalculées (ici et dans « … ») » ; une dictée ouverte après un changement de règle est recalculée (ligne « ✓ Formes acceptées : … »).
- **En correction (rapide et texte)**, dans la case « ce qu'a écrit l'élève », à côté de « Valider » : **le bouton « ✓ forme acceptée (ce texte) »** — il prend la forme en cours (tapée, ou le numéro composé au pavé) : l'erreur est posée, la règle créée, la case se ferme, le message : « « syllabe » est maintenant une forme acceptée pour ce texte : visible chez tous, sans retrait, dans cette dictée et dans « … » (même texte) ; n copies recalculées » ; sur une forme déjà acceptée, il s'intitule **« ✕ ne plus accepter »** et l'annule ; **case vide : inactif** (« Tape ou choisis d'abord la forme. »). **Aucun raccourci** ; **le 0 du pavé reste un chiffre** (1 puis 0 = la n° 10 ; 0 seul : « Pas de forme n° 0. »).
- **La liste des formes déjà vues (L10)** : « acceptée » pour ce texte ; pour un autre texte : « acceptée dans « titre » » (dictée supprimée : « … une dictée supprimée ») et un petit bouton **« accepter ici »**.
- **Préparation → « ✓ Formes acceptées »** (à côté de la version aménagée) : le texte mot par mot, à ses places ; les mots tolérés **soulignés en vert avec leur nombre** ; un clic ouvre « Formes acceptées pour « … » » : pastilles avec ✕, « ajouter une forme acceptée » (Entrée ajoute ; garde : « C'est le mot juste : une forme acceptée est une autre graphie. »), Échap ferme (où que soit le curseur) ; chaque ajout ou retrait recalcule, message compté.
- **Réglages** : « Formes acceptées de ce texte — partagées avec : « … » » — mot, forme, origine, **retirer** (aucun ajout ici).
- **Ce que voit l'élève** : la mention **« forme acceptée »**, et rien d'autre : sur sa feuille, **à la place du coût** de cette erreur (sous le mot, et dans la liste des erreurs) ; dans son autocorrection, sur la carte de l'erreur (elle reste à corriger, sans retrait) ; son tableau de points ne compte pas ces erreurs (comme la note).
- **Le bilan exporté** : `sans_cout` par élève.

## Défauts trouvés en route, réglés ici
1. Échap ne fermait pas la fenêtre de Préparation quand le curseur n'était plus dans son champ.
2. Le message d'une forme acceptée ne s'affichait pas en mode rapide.
3. L'écran de la copie ne recevait pas l'identifiant de sa dictée : le titre tombait sur « une dictée supprimée », et le recalcul aurait pu réécrire la copie ouverte.
4. La carte d'erreur de l'autocorrection sur ordinateur (une autre que celle des tablettes) ne portait pas la mention.
5. Sur la feuille, une erreur acceptée affichait encore « −1 » sous le mot : la mention remplace désormais le coût.

## Le fichier
- Base **6.7.0-L9 en ligne** (773 563 o, md5 `4f0ecbca3b9041f76c89b92d8d9a07e9`, vérifiée à la commande) → **6.7.0-L11** : **795,799 o** (+22,236), md5 `fe8f030b0f402f0cb8bcf031d91799bb`.
- Ajoutées : `ACCEPT`, `cleFb`, `accepteesDe`, `estAcceptee`, `marquerSansCout`, `accepteesAilleurs`, `autresDicteesDuTexte`, `accepteesCharger`, `recalculerTexte`, `cheminRegle`, `regleEnMemoire`, `regleRetireeEnMemoire`, `poserRegle`, `retirerRegle`, `phraseRecalc`, `FormesAccepteesPrep` ; dans `CorrEleve` : `boutonAccepterL11`, `formeEnCoursL11`, `accepterCourantL11`, le message. Modifiées : `computeNote` 1,165 → 1,373 · `save` 6,463 → 6,630 · `toucheFormes` 1,211 → 1,211 · `listeFormesHtml` 896 → 2,144 · `Reglages` 4,309 → 6,372 ; l'ouverture (les règles lues, le recalcul si elles ont changé) ; les deux cases (le bouton) ; `EditionDictee` (le bouton de Préparation) ; la feuille (`buildCopieHtml` : la mention, les répétitions sans les formes acceptées) ; l'autocorrection (les deux cartes, le tableau de points) ; le bilan exporté. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L11_geste.py`** (par le geste, 16 vérifications) : deux dictées au même texte (brevet blanc 3E et « ZZTEST jumelle », des copies avec « syllabe » sur « syllabes ») et une d'un autre texte ; **Préparation** : « Syllabes » refusé (garde) ; « syllabe » ajoutée → « 3 copies recalculées (ici et dans « ZZTEST jumelle ») », les copies des deux dictées sans coût, le mot souligné avec « 1 » ; **les notes : 5 → 10 / 9,5 / 10, puis ✕ → 9 / 8,5 / 9** ; **correction** : le bouton inactif case vide ; « syllabe » tapé, « ✓ forme acceptée (ce texte) » → le message exact, l'erreur de l'élève sans coût (note 10), les autres copies des deux dictées sans coût ; le même bouton devenu « ✕ ne plus accepter » → annulée (message, coût revenu) ; un autre élève : « 1 syllabe ×4 acceptée », pavé 1 → sans coût ; **le 0 reste un chiffre** (« Pas de forme n° 0. ») ; **Réglages** : « partagées avec : « ZZTEST jumelle » », la règle listée ; **l'autre texte** : « acceptée dans « Dictée brevet blanc 3E » » + « accepter ici » → acceptée là aussi ; **le bilan exporté** : `"sans_cout": 1` ; Réglages → retirer → recalcul, coût revenu ; **la feuille de l'élève**, comparée mot à mot à celle de la L9 : seules deux différences — « −1 » → « forme acceptée » sous le mot, « −1 pt » → « forme acceptée » dans la liste ; **son autocorrection** : la carte dit « forme acceptée » ; 0 erreur de page.
**Banc unique sur L11 : VERT, 0 échec** (`sorties/`) : S1/S3 sans perte, S2 correct ; fuzz_correction ×2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur ; bancs L1, L2, L3, L5, L6, L6b, L7, L8, L10, L9, L11 verts ; vue élève (l'accueil) identique à la 6.6.3.

## Aide « ? » (L12)
Les lignes de L11 (le bouton, « accepter ici », Préparation → Formes acceptées, Réglages → retirer) s'écriront dans l'aide avec L12, qui la crée.

## Captures (`captures/`)
`A1-case-avant.png` / `A2-case-apres.png` ; `A3-liste-apres.png` ; `A4-autre-texte-apres.png` ; `A5-preparation-avant.png` / `A6-preparation-apres.png` ; `A7-reglages-apres.png` ; `A8-eleve-feuille-apres.png` ; `A9-eleve-autocorrection-apres.png`.

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → la dictée des Dylan → Préparation → « ✓ Formes acceptées » → clique « cadavres » → tape « cadavre », Entrée : le mot se souligne, « n copies recalculées (ici et dans « Franklin… ») » ; les notes remontent.
2. ✕ sur la pastille : elles redescendent.
3. Correction, mode rapide, sur « cadavres » : G, tape « cadavre » (ou son numéro), clique « ✓ forme acceptée (ce texte) » : le message ; l'erreur ne coûte rien. Le même bouton, devenu « ✕ ne plus accepter », l'annule.
4. Le 0 du pavé compose toujours (1 puis 0 = la 10e forme).
5. Réglages : « Formes acceptées de ce texte — partagées avec… », « retirer ».
6. Côté élève : « forme acceptée » à la place du retrait, sur sa feuille et dans son autocorrection.
