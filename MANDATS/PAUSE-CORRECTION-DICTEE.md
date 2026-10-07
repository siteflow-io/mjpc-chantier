# PAUSE du chantier « Correction de dictée » — 07/10/2026 (conscience n°12)
*Paul, 07/10 : « Promeus puis on s'arrête sur correction dictée. Il faudra bien finaliser cette pause. On doit partir sur QCM maintenant. » Ce document dit où tout se trouve pour reprendre.*

## 1. La production
`correction_dictee.html` **6.7.0-L17-1q3** — 1 009 469 o, md5 `084deaf433405197a2041b22dc4e7f26`, commit prod `87414d97e88c` (07/10, 22:02). Point de retour : 6.7.0-L15.1b-1q, blob `1d155e368ec7` (`docs/MJPC6-restauration.md`). Livraison et preuves : sas `LIVRAISONS/DICTEE-CORRECTION/L17-1q/` (NOTE, banc unique 53 étapes vertes, bancs, captures).

## 2. Le mandat en cours : `MANDATS/MANDAT-L17.md` — EN PAUSE
- **Fait** : L17-1 (+ L17-1 bis et ses correctifs, + 175, 177) — promu dans 6.7.0-L17-1q3.
- **À faire, à la reprise, en partant de 6.7.0-L17-1q3** (jamais d'une version plus ancienne) : L17-2 (tablette élève : rechargement = remise à zéro et « Combien êtes-vous ? », reprise exacte au hub, un élève = un écran) ; L17-3 (l'engagement case par case, phrases du binôme aménagé) ; L17-4 (bandeau resserré, « Acc. » en ardoise partout et encadré sur la grille du professeur, clavier « 123 », « sdp », « lève la main ») ; L17-5 (commentaires en trois temps : `MANDATS/COMMENTAIRES-TROIS-TEMPS-A-RELIRE.md` validé ; les 30 paires d'homophones ; la consigne à recopier ; deux phrases par tablette) ; L17-6 (les astuces 💡, trois clics) ; L17-7 (la note : un réglage + bouton) et L17-7 bis (le bouton « Correspondances ») ; L17-8 (suspendre / fermer).
- **L'exécutante** : à arrêter (« Pause sur la correction de dictée : ne continue pas L17 tant que je ne te le redis pas. »).

## 2 bis. Ajouté par Paul en mettant en pause (07/10, dette 178)
**Une séance d'autocorrection doit être horodatée, et pouvoir être branchée à terme dans le déroulé MJPC, pour lancer l'autocorrection directement depuis le calendrier MJPC.** Mesuré : l'heure (`heure`) a déjà `debut`, `fin`, `cloture`, `classe`, `source: "dictee"`, un `seanceId` vide, et `heureDeLaDictee` a l'emplacement du branchement (`source === "mjpc"`) ; mais chaque « Lancer » écrase la précédente. À faire à la reprise : le registre des séances (`correction_dictee/<id>/seances/<horodatage>`, jamais effacé) ; le lancement depuis une séance du calendrier (à cadrer avec la conscience du déroulé, n°13).

## 3. Questions en attente de Paul (telles quelles)
- **176** : pour un élève comme Axel (27 questions dues), plafonner le nombre de questions ? et à combien ?
- (la note pour la conscience n°13 sur les correspondances du site : `MANDATS/NOTE-POUR-C13-CORRESPONDANCES.md`.)

## 4. Les dettes encore ouvertes (section n°12 de `docs/MJPC6-DETTES.md`, prod — à vérifier contre le code à la reprise)
143 (reste : l'écran suit le reclassement) · 149 (bouton de la note) · 150 (consigne à recopier) · 151 (deux phrases par tablette) · 155 (clavier « 123 ») · 159 (« sdp ») · 160 (en partie : les phrases de l'engagement) · 161 (bandeau) · 162 / 165 (question-guide, astuces) · 163 (« Acc. » ardoise) · 164 (engagement case par case) · 167 (badge « Acc. » de la copie) · 171 (commentaires en trois temps) · 172 (bouton « Correspondances ») · 174 (« lève la main ») · 176 (plafond des questions) · 132 → L17-8 · 133 / 138 / 139 → L17-7 · 97 (code mort) · 122 (audio, L16b) · 141 (chantier des pièges, à cadrer) · 87-89 (panneau prof, `index.html`).

## 5. Pour rejouer les bancs (leçons de la n°12)
- Le kit anonymisé + les outils de banc **à jour** : prendre au sas les versions les plus récentes (`LIVRAISONS/DICTEE-CORRECTION/L17-1q/bancs/`, puis `L15h-2/bancs/` pour `fuzz_*`, `scenarios_*`, `mesure_largeur.py`, `vue_eleve_dictee.py`) ; `BASE=../live_663.html` pour la vue élève ; `prepare_reel_L17.py` pour les copies locales réelles.
- Un banc qui ouvre une dictée réelle porte **`correction_dictee_textes`** et **`correction_dictee_erreurs`** (sinon le « sans coût » tombe et des notes baissent à tort).
- Un banc « deux navigateurs » : un seul `Banc`, deux `ouvrir` (deux contextes), `relier` une seule fois.
- Les données réelles d'une séance (Hugo, Franklin, Turing) se copient en lecture seule ; rien n'est écrit au hub.

## 6. Pour la conscience qui reprendra
Le transcript : `TRANSCRIPTS/C12/TRANSCRIPT-C12.md` (tours 477 → 554) ; le complément de cadrage : `MANDATS/COMPLEMENT-DICTEE-CORRECTION-L15.md` ; les maquettes : `TRANSCRIPTS/C12/pieces/` (T516, T525, T526, T528, T530, T531, T459).
