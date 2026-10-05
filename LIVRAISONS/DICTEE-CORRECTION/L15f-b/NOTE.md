# DICTÉE — L'ÉCRAN DE CORRECTION · L15f-b — L15f reprise sur L16a : côté élève, la note après le chrono, le regain en clair, le bilan, l'actualisation

*Exécutant du complément L15, livraison **L15f-b** (dettes n°12 · 111, 112, 113, 114 ; visuels G1, G2, G3). **L15f reprise sur la 6.7.0-L16a en ligne** (L15f avait été déposée avant L16a par erreur d'ordre) : le code de L15f est le même, rejoué sur la nouvelle base. Elle remplace `LIVRAISONS/DICTEE-CORRECTION/L15f/`. **Nouveau : un banc à deux navigateurs** (ta règle du 04/10). Rien n'est promu.*

## Ce que ça change pour la classe
- **111 — pendant le chrono du stylo vert, aucune note** n'est visible derrière la fenêtre (ni la note de dictée, ni l'autocorrection, ni « À savoir », ni les tableaux) ; la fenêtre dit **« Ta note de dictée s'affichera à la fin du chrono. »** ; à zéro, l'écran de fin.
- **112 — Regagner des points**, quand l'élève peut répondre : **la consigne en clair**, mot pour mot : « **Comment ça marche :** une question sur une règle que tu as ratée ; si tu réponds juste, tu regagnes 1,25 point sur ta note d'autocorrection. Si tu réponds faux, tu ne perds rien. Tu peux aussi garder ta note telle quelle. » (le montant suit le nombre d'erreurs : 5 ÷ n) ; **« ❓ Répondre à une question », puis « Je garde ma note (n/5) »** à côté (G2) : cliqué, c'est enregistré sur la copie (`autocorrection/<élève>/garderNote`) et plus aucune question n'est proposée pour cette dictée ; **plus aucune infobulle** dans l'encart.
- **113 — le regain dans le bilan** (G3) : la note d'autocorrection avec son détail (**« 2,5/5 + 1,25 regagné »**) ; le tableau **« Détail de ton autocorrection »** sous l'en-tête (« 4 erreurs à retrouver, 7 essais (3 essais ratés, le premier offert) −2,5 », chaque question « Question regagnée : … +1,25 » / « Question ratée : … 0 », « Note d'autocorrection 3,75 / 5 ») ; **la phrase à recopier mentionne le regain** (« … surtout de grammaire ; j'ai regagné 1,25 point en répondant sur l'accord du verbe, et pour la prochaine, … ») ; **ton Suivi** porte « dont +1,25 regagné » sous la note ; **le bilan exporté** porte, par élève, `autocorrection: {note, sans_regain, regain}`.
- **114 — l'actualisation en direct** : l'écran de l'élève **écoute**, pour chaque dictée, les copies rendues et la publication : **masquer** → sa ligne repasse à « Disponible après la séance », et s'il avait sa copie ouverte il revient à « Mes dictées » ; **rendre** → « Ouvrir » revient seul ; **dépublier** (L15c) → la dictée disparaît de sa liste ; sans rechargement.


## Le fichier
- Base **6.7.0-L16a en ligne** (876 574 o, md5 `73f4968ea2bacd374effac5e6c372515`, vérifiée à la commande) → **6.7.0-L15f-b** : **883,573 o** (+6,999), md5 `af0f37e6be684d55ad18e89ef1b9fbb3`.
- Les changements de L15f, rejoués tels quels : dans `EleveCorrection` (`scoreSansRegainL15f`, `regainL15f`, `questionsTraiteesL15f`, `detailAutocorrectionL15f`, `garderNoteL15f`, la fenêtre du stylo, l'en-tête de fin, l'encart) ; `phraseARecopier` ; le Suivi ; `buildDicteeJSON` et `PromptIaModal` ; `AppEleve` (l'écoute de `copyPublishedAt` et `config/published`, le retour à « Mes dictées »). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L15fb_geste.py`** (par le geste, 15 vérifications) : les 14 de L15f (le chrono sans note ; à zéro, l'écran de fin ; la consigne mot pour mot ; « Je garde ma note (2,5/5) » ; aucune infobulle ; « 2,5/5 + 1,25 regagné » ; le tableau ; la phrase avec le regain ; « dont +1,25 regagné » au Suivi ; le regain à part dans le bilan exporté ; masquer / rendre / masquer copie ouverte / dépublier ; 0 erreur) **+ DEUX NAVIGATEURS** : le professeur dans l'un, l'élève dans l'autre, sur le même faux hub (chaque écriture de l'un est rejouée dans l'autre, comme Firebase la propage) — l'élève a sa copie ouverte ; **le professeur clique « 🙈 Masquer les copies »** (onglet Copies) → chez l'élève, sans rechargement : retour à « Mes dictées », « Disponible après la séance » ; **il clique « Rendre les copies »** → chez l'élève : « Terminée 5/10 Ouvrir → » ; **il décoche « publiée » à l'accueil** → chez l'élève : la dictée disparaît de sa liste.
**Le kit** : `fakefb.js` peut relayer ses écritures vers un autre navigateur quand un banc le branche (`deux_navigateurs.py` : `relier`, `synchroniser`) ; les autres bancs n'en voient rien. Les versions d'avant jointes (`fakefb_avant_L15fb.js`).
**Banc unique sur L15f-b : VERT, 0 échec, 33 étapes** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, L15c, L15c-b, L15c-c, L15c-d, L15d, L15e, L16a, L15f-b, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`G1-chrono.png`, `G2-regain.png`, `G3-bilan.png` ; `G4-deux-navigateurs.png` (chez l'élève, après « Masquer les copies » cliqué chez le professeur).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → en mode test, un élève finit son autocorrection : pendant le chrono du stylo vert, aucune note ; à zéro, sa note.
2. « Regagner des points » : la consigne en clair ; « Je garde ma note » : plus de question.
3. Une question réussie : « … + 1,25 regagné », le détail, la phrase à recopier ; ton Suivi : « dont +1,25 regagné ».
4. Deux appareils (ou deux navigateurs) : l'élève a sa copie ouverte ; toi, « 🙈 Masquer les copies » : il revient à « Mes dictées » ; « Rendre les copies » : « Ouvrir » revient ; décoche « publiée » : la dictée disparaît de sa liste — sans qu'il recharge.
