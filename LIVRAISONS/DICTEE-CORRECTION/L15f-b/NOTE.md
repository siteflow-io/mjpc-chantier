# DICTÉE — L'ÉCRAN DE CORRECTION · L15f-b — côté élève (L15f reprise sur L16a) + le point 5 : la déconnexion

*Exécutant du complément L15, livraison **L15f-b** (dettes n°12 · 111, 112, 113, 114, **129**). L15f reprise sur la 6.7.0-L16a en ligne, **avec le point 5 ajouté au complément (la déconnexion)**. Elle remplace le dépôt précédent de `L15f-b/` (sans le point 5) et `L15f/`. Rien n'est promu.*

## Ce que ça change pour la classe
- **111 — pendant le chrono du stylo vert, aucune note** n'est visible derrière la fenêtre (ni la note de dictée, ni l'autocorrection, ni « À savoir », ni les tableaux) ; la fenêtre dit **« Ta note de dictée s'affichera à la fin du chrono. »** ; à zéro, l'écran de fin.
- **112 — Regagner des points**, quand l'élève peut répondre : **la consigne en clair**, mot pour mot : « **Comment ça marche :** une question sur une règle que tu as ratée ; si tu réponds juste, tu regagnes 1,25 point sur ta note d'autocorrection. Si tu réponds faux, tu ne perds rien. Tu peux aussi garder ta note telle quelle. » (le montant suit le nombre d'erreurs : 5 ÷ n) ; **« ❓ Répondre à une question », puis « Je garde ma note (n/5) »** à côté (G2) : cliqué, c'est enregistré sur la copie (`autocorrection/<élève>/garderNote`) et plus aucune question n'est proposée pour cette dictée ; **plus aucune infobulle** dans l'encart.
- **113 — le regain dans le bilan** (G3) : la note d'autocorrection avec son détail (**« 2,5/5 + 1,25 regagné »**) ; le tableau **« Détail de ton autocorrection »** sous l'en-tête (« 4 erreurs à retrouver, 7 essais (3 essais ratés, le premier offert) −2,5 », chaque question « Question regagnée : … +1,25 » / « Question ratée : … 0 », « Note d'autocorrection 3,75 / 5 ») ; **la phrase à recopier mentionne le regain** (« … surtout de grammaire ; j'ai regagné 1,25 point en répondant sur l'accord du verbe, et pour la prochaine, … ») ; **ton Suivi** porte « dont +1,25 regagné » sous la note ; **le bilan exporté** porte, par élève, `autocorrection: {note, sans_regain, regain}`.
- **114 — l'actualisation en direct** : l'écran de l'élève **écoute**, pour chaque dictée, les copies rendues et la publication : **masquer** → sa ligne repasse à « Disponible après la séance », et s'il avait sa copie ouverte il revient à « Mes dictées » ; **rendre** → « Ouvrir » revient seul ; **dépublier** (L15c) → la dictée disparaît de sa liste ; sans rechargement.



- **5 — La déconnexion (dette 129)** — mesuré : la tablette gardait l'élève dans `mjpc_eleve` (session et local, 12 h) ; « Me déconnecter » ne le vidait pas ; le Suivi ne disait jamais « Déconnecté ».
  - **(a) Côté élève, « Se déconnecter »** : sur « Mes dictées » (l'ancien « Me déconnecter », renommé) et **sur tous ses autres écrans** (un bouton en haut à droite, une par moitié en binôme), **sauf pendant le chrono du stylo vert** ; il efface `mjpc_eleve` (session et local — jamais une session de professeur, jamais la clé du coffre), la moitié du binôme, écrit `status: "offline"`, `lastSeen` et `deconnecte` sur chacune de ses dictées commencées, et renvoie au **portail de code** : la tablette l'a oublié, le suivant tape le sien. Texte élève : « Se déconnecter », rien d'autre.
  - **(b) Côté professeur (Suivi)** : **« Déconnecter »** sur chaque élève, **« Déconnecter tous »** au-dessus du tableau : ils écrivent un ordre au hub (`correction_dictee/<id>/deconnexion/<clé>` = l'heure, ou `…/tous`) ; **l'élève l'écoute et se déconnecte lui-même aussitôt** (un ordre plus ancien que sa connexion est ignoré) ; rien d'autre n'est touché.
  - **(c) Automatique** : **à la clôture de l'heure** (« Clôturer » ou fin + 10, L13b) et **à la fin des 45 minutes hors classe**, l'élève connecté se déconnecte de la même façon ; une heure close avant sa connexion ne le déconnecte pas ; **sa copie et son autocorrection restent au hub** : il les retrouve en retapant son code.
  - **(d) Le Suivi** passe l'élève en **« Déconnecté » sur-le-champ** (avant l'étape en cours), jusqu'à ce qu'il revienne.

## Le fichier
- Base **6.7.0-L16a en ligne** (876 574 o, md5 `73f4968ea2bacd374effac5e6c372515`, vérifiée à la commande) → **6.7.0-L15f-b** : **888,151 o** (+11,577), md5 `5e6ca2c533dae39615d088c94eba965f`.
- Les changements de L15f (inchangés) ; **le point 5** : `oublierSessionEleveL15f` ; `AppEleve` devient une enveloppe (le bouton fixe, par moitié) autour de `AppEleveCoeurL15f` ; `deconnexion` (la session, le statut, le binôme) ; l'écoute de `deconnexion/` et de `heure` pour chaque dictée de la liste, un contrôle toutes les 15 s (fin + 10) ; `EleveCorrection` (la fin des 45 min déconnecte ; le chrono cache le bouton) ; le Suivi (le statut « Déconnecté », « Déconnecter », « Déconnecter tous »). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L15fb_geste.py`** (15 vérifications, dont deux navigateurs : masquer / rendre / dépublier) : vert.
**`banc_L15fb5_deconnexion.py`** (la déconnexion, **à deux navigateurs**, en contexte sécurisé, 7 vérifications) : l'élève (connecté par la tablette) clique **« Se déconnecter »** → **le portail de code, `mjpc_eleve` vide (session et local), le Suivi « Déconnecté »** au même instant ; **il retape son code** → il retrouve sa dictée (« À faire 9/10 Ouvrir → ») ; **le bouton est sur l'écran de sa copie** ; **le professeur clique « Déconnecter »** sur lui → l'élève revient au portail **sans rechargement**, `mjpc_eleve` vide ; **« Déconnecter tous »** → idem ; **« Clôturer l'heure »** → idem ; 0 erreur.
**Accordé** (la version d'avant jointe) : `banc_L13_geste.py` — à la fin des 45 minutes hors classe, l'élève est déconnecté : le portail de code (avant : « Mes dictées »).
**Banc unique sur L15f-b : VERT, 0 échec, 34 étapes** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, L15c, L15c-b, L15c-c, L15c-d, L15d, L15e, L16a, L15f-b, la déconnexion, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`G1-chrono.png`, `G2-regain.png`, `G3-bilan.png`, `G4-deux-navigateurs.png` ; `G5-deconnexion-eleve.png` (le portail après « Se déconnecter ») ; `G6-suivi-deconnecte.png` (le Suivi au même instant : « Déconnecté », « Déconnecter », « Déconnecter tous »).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → les tests de L15f (le chrono, le regain, le bilan, masquer / rendre / dépublier sans recharger).
2. Sur une tablette, un élève clique « Se déconnecter » : le portail de code ; ton Suivi : « Déconnecté ». Il retape son code : il retrouve sa copie.
3. Toi, dans le Suivi : « Déconnecter » sur un élève, puis « Déconnecter tous » : leurs tablettes reviennent au portail, sans qu'ils rechargent.
4. « Clôturer l'heure » : les tablettes encore connectées reviennent au portail ; la classe suivante tape ses codes.
