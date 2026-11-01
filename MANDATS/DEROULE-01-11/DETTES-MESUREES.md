# Les dettes du déroulé : ce que dit le code de la production

*Rapport en lecture seule, 01/11/2026, pour la passation à une nouvelle conscience. Aucun fichier des deux dépôts n'a été modifié. Aucun appel réseau : ni le site ni Firebase n'ont été ouverts.*

**Ce qui a été mesuré.** `index.html` de production (`/home/claude/monsieurjaipascompris`), md5 `55694fe15bc27b5fb318eeb1e05910a1`, 2 709 746 octets. C'est la **8.77.0-⑩** : `APP_VERSION="8.77.0-⑩"` à la l. 3138, et c'est le même md5 que celui du registre. Aucune promotion d'`index.html` n'a eu lieu depuis le 29/10 à 12:02 : après cette date, le journal ne parle plus que de `redaction.html`.

**Où le déroulé vit dans `index.html`** (des modules recopiés tels quels dans la page) :
- `dr.css` : l. 15998-16536 ;
- `dr-gabarit.js` : l. 16537-16544 ;
- `dr-socle.js` : l. 16545-18116 ;
- `dr-atelier.js` : l. 18117-18851 ;
- `dr-classe.js` : l. 18852-20445 ;
- `dr-tableau.js` : l. 20446-20995 ;
- `dr-recit.js` : l. 20996-21601 ;
- `dr-recyclage.js` : à partir de la l. 21602.

Le tableau local, le tableau distant et la vue « ⧉ Ce que voit la classe » passent par **une seule fonction de dessin**, `rendre` (l. 17641), appelée avec `pilote:false` par `dr_rendreMur` (l. 20726-20734).

**Limite sur les commits.** Les deux copies locales sont superficielles. Celle de la production ne remonte qu'au 29/10 à 16:21 (commit `13d677e`, 121 commits). `git log -S` ne peut donc retrouver aucun commit de code du déroulé. Les commits cités plus bas viennent du registre et du journal. **Ce qui est soldé l'est par la ligne de code citée**, jamais par le seul rapport.

**Ce que veulent dire les états :**
- **OUVERTE** : le défaut ou le manque se voit dans le code (la ligne est citée).
- **SOLDÉE** : la correction se voit dans le code (la ligne est citée).
- **NON MESURABLE EN LECTURE** : il faudrait jouer le geste à l'écran, ou lire le hub, pour trancher.

---

## 1 · Tableau de synthèse

Le compte : **28 ouvertes · 66 soldées · 36 non mesurables en lecture**.

### 1.1 Les dettes ouvertes (28)

| n° | dette | source | preuve dans le code |
|---|---|---|---|
| O1 | Rien ne doit arriver au tableau sans que Paul le dévoile | Paul 01/11 18:53 | voir §4.1 : 34 chemins, dont `dr_tout` l. 18759, `p8Elements` l. 17363, `dr_devoilerQuestionsRepondues` l. 18753-18755 |
| O2 | Bloc question : la participation doit venir avant la réponse préparée | Paul 01/11 18:53 ; registre 12 · 22 | voir §4.2 : formulaire l. 18276, `elements` l. 17535, `rendre` l. 17667-17670 |
| O3 | Le récit met le « je » de l'élève au nom de M. Meney et mange l'auxiliaire | 13 · 95 ; contrat §12.75 (1) | l. 21103 |
| O4 | Le récit introduit les citations brutalement | 13 · 96 ; contrat §12.75 (1) | l. 21278 « la consigne disait : » ; aucune trace de §12.75 dans le code |
| O5 | Aucune garde quand on recharge pendant une répétition | 13 · 97 ; contrat §12.75 (4) | `dr_heureTenue` l. 20332 exclut `S.repetition` |
| O6 | Les colonnes de Structure n'ont pas de poignée pour changer leur largeur | 13 · 98 ; contrat §12.75 (5) | `.ed2-grille` en colonnes fixes, l. 973 ; aucune poignée trouvée |
| O7 | Le texte des feuilles n'est pas justifié | 13 · 99 ; contrat §12.75 (5) | `text-align:justify` : 0 occurrence dans `index.html` |
| O8 | Au tableau, la ligne de la clé USB est une phrase | 13 · 100 ; contrat §12.75 (6) | `dr_tabCleMaj` l. 20794-20795 |
| O9 | La frise ne lit que des années | 13 · 101 | `p8Frise` l. 17254-17255 : `parseInt` sur les seuls chiffres |
| O10 | Une feuille projetée défile au tableau et ne se zoome pas | 13 · 103 ; contrat §12.75 (7) | l. 21495-21496 (cadre `srcdoc`) et CSS l. 16387 ; aucun défilement venu du pilote |
| O11 | Dans l'Atelier, les pages d'une diapo n'apparaissent pas dans la colonne de gauche | 13 · 104 ; contrat §12.75 (9) | `voletAtelier` l. 17869 : aucune page |
| O12 | « Dans les temps » sur la carte de classe ne mesure pas ce qu'il dit | 13 · 90 | `edtDivergence` l. 25712-25732 ; « h de retard » l. 24858 |
| O13 | Les compétences sont nommées par l'intitulé officiel, pas par la phrase d'élève | 13 · 91 ; contrat §12.67 (3) | `dr_invCompLib` l. 16656 lit `i.libelle` |
| O14 | Sans réseau, le site ne garde pas ce qu'on écrit | 13 · 77 | `navigator.onLine` ne sert qu'aux dépôts de fichiers (l. 4625, 18300) ; témoin « pas encore au hub » l. 18751 |
| O15 | Une infobulle de geste grisé commence de nouveau par « Grisé : » (rechute) | 13 · 2, marquée ✔ au registre | l. 19878 |
| O16 | Les diapos d'ouverture au canon | contrat §12.67 | 0 repère §12.67 dans le code |
| O17 | Le profil de la classe, et la relecture qui s'y fait | contrat §12.69 ; registre (anciens points) n° 7 ; POINT 35 ; exigence du 29/10 ① | `edtCarteClic` l. 24867-24868 : « il arrive au lot suivant » |
| O18 | La réactivation n'est jamais retirée : allumée ou grisée, et grisée elle ne va jamais au tableau | Paul 29/10 08:47 ; registre l. 30 (exigence ①) | `dr_reactInserer` l. 20264 : « non » la retire avec `E.splice` |
| O19 | Les chartes visuelles (une par niveau) | contrat §12.73 | aucune charte au choix ; les « CHARTE » trouvés sont des commentaires CSS |
| O20 | L'Atelier sans classe, et la répétition toujours avec la classe test | contrat §12.75 (2) ; Paul 29/10 11:58 | `dr_classeProposee` l. 19395-19400 |
| O21 | Une diapo vierge après la diapo du bilan, et les mots-clés cochés tout seuls | contrat §12.75 (3) et (8) ; Paul 29/10 11:58 et 12:41 | absent du code |
| O22 | La page HTML n'est jamais chargée dans la diapo | 12 · 71 bis ; 12 · 72 ; POINT 19 | l. 17663 : seulement un cadre de remplacement |
| O23 | ÉLÈVE — 2 : le ◆ au pilotage, les anniversaires | POINT 14 ; `MANDAT-ELEVE-2.md` | « ◆ » : 0 dans le déroulé ; « anniversaire » et 🎂 : 0 |
| O24 | Le téléphone télécommande | registre (anciens points) n° 2 ; POINT 22 ; R10 | l. 22574-22582 : des commentaires seulement, aucun code |
| O25 | Le branchement avec la dictée | POINT 24 ; 12 · 178 ; passation §4 point 6 | `seanceId` : 0 occurrence |
| O26 | Les attendus au hub et la garde Éduscol | 12 · 18 ; 12 · 25 ; POINT 13 ; lot A1 | aucun chemin `/attendus` ; l. 19032 « les attendus ne sont pas dans la maquette » |
| O27 | Le profil longitudinal de l'élève et le cockpit | registre (anciens points) n° 9 ; POINT 23 | `mjpcProfils` lu seulement pour l'inventaire des données (l. 6484-6485, 6515) |
| O28 | `CLAUDE.md` n'est plus à jour | 12 · 13 | `CLAUDE.md` l. 7 : « Five self-contained HTML files » |

### 1.2 Les dettes soldées (66)

| n° | dette | source | preuve dans le code |
|---|---|---|---|
| S1 | Une simulation de la maquette posait une diapo impossible | 13 · 1 | `b-sim-schema` : 0 occurrence |
| S2 | En répétition, le texte de la diapo ne s'écrivait pas | 13 · 3 | `dr_tout` l. 18756 : « en répétition aussi, tout texte s'écrit d'un clic » |
| S3 | Bloc question : le chevron recouvert | 13 · 4 | l. 17667 et CSS l. 16147 |
| S4 | Bloc question : la question suivante paraissait d'emblée | 13 · 5 | `elements` l. 17535 ; `rendre` l. 17667 (`qPas`) |
| S5 | Écrire directement dans la diapo | 13 · 6 | `p8ZoneEcrire` l. 17675 |
| S6 | « Objet non lisible « cahier » » | 13 · 7 | `TYPES` contient `cahier`, l. 17661 |
| S7 | Le récit partait de la trame, pas de la copie de la classe | 13 · 8 | l. 21470 `dr_recitEcranVu` « (13 · 8) la copie de la classe » |
| S8 | Les notes de présentateur ne s'écrivaient pas | 13 · 10 | `notesd` l. 18565 ; l. 18561 |
| S9 | La mise en forme dans les notes de présentateur | 13 · 11 ; contrat §12.47 | repères §12.47 l. 18561, 18630 |
| S10 | Une seule vignette pour une diapo à plusieurs pages | 13 · 18 | l. 18757-18758 (`pagesCourantes`, « les vignettes de page ») |
| S11 | Après « ■ Arrêter », le tableau gardait la répétition | 13 · 19 | `arreterRepetition` l. 18336 remet l'état d'avant ; `dr_repTableauFin` l. 18847 |
| S12 | La maquette n'était pas le site réel | 13 · 24 | l. 15996 : l'ancien moteur `AT_DR_B64` est tombé, les modules sont dans la page |
| S13 | Le mode test laissait partir trois écritures | 13 · 25 | `dr_ttOn` l. 20615 ; `/site/tableau_test` l. 20608 |
| S14 | L'emploi du temps ne lançait jamais l'heure 2 | 13 · 26 | `dr_heuresDeLaClasse` l. 19352 (une seule source pour « heure n/N ») |
| S15 | La reprise perdait la trace de l'heure | 13 · 27 | `dr_reprendre` l. 19709 |
| S16 | La garde « lecture seule » du tableau ne couvrait pas `sendBeacon` | 13 · 28 | l. 22352 : `sendBeacon` bloqué dans la vue du tableau |
| S17 | Le mode test ne couvrait pas les lectures | 13 · 29 | même dispositif que S13 (l. 20608-20615) |
| S18 | L'injection n'écrivait pas les trames | 13 · 30 | `atP2ValiderDeroule` l. 22031 |
| S19 | Les refus de l'import n'étaient que des textes | 13 · 31 | l. 22031 ; refus au 6e mot-clé l. 22088 |
| S20 | `_drProchainCreneau`, du code mort | 13 · 32 | 1 seule mention restante, un commentaire (l. 20169) |
| S21 | Un titre de bloc vide en bas de page dans « Où en sommes-nous ? » | 13 · 34 | l. 17666 (`tPas` sur la diapo construite) |
| S22 | L'aperçu de la réactivation débordait | 13 · 36 | `dr_reactApercuRendre` l. 20282 |
| S23 | Le site ne prenait pas toute la largeur | 13 · 37 | l. 16087 `#dr-zone .rel, #dr-zone .recit{max-width:none}`, qui l'emporte sur l. 16083 |
| S24 | La classe de l'en-tête du pilotage n'était pas celle de l'heure | 13 · 38 | `dr_hclasseMaj` l. 17061, appelée par `dr_tout` l. 18756 |
| S25 | En mode test, une publication ne se voyait pas dans l'emploi du temps | 13 · 39 | `edtCleClasse` l. 24345 ; le registre attend encore que Paul le voie chez lui |
| S26 | « 7 à décider » n'était pas compris | 13 · 40 | l. 19114 « dis ce que chacune devient » |
| S27 | Une heure lancée se quittait sans garde | 13 · 41 | `dr_heureTenue` l. 20332 ; `beforeunload` ; bandeau « reprendre » l. 20353-20354 |
| S28 | Le récit s'ouvrait par « Enfin » | 13 · 42 | l. 21240-21241 |
| S29 | Un « ? » sur chaque écran | 13 · 43 | `.aide-q` l. 15581-15601 |
| S30 | « Voir dans le panneau prof » restait par-dessus l'arborescence | 13 · 45 | l. 10790 « Voir dans l'arborescence » |
| S31 | Le « ? » ne se voyait pas | 13 · 47 | l. 26602 : or `#e0b978`, 24 × 88 px |
| S32 | En mode test, la présence du prof partait au hub | 13 · 48 | repères §12.43 l. 5025, 5051 |
| S33 | « (proposition) » ajouté au titre d'un chapitre neuf | 13 · 49 | l. 9264 |
| S34 | « Nouveau chapitre » demandait la clé de chiffrement | 13 · 50 | `chOuvrir` l. 8992, sans `secuExigeCle` |
| S35 | Le chapitre ne s'affichait pas pour Franklin, Dylan, Hugo, Turing | 13 · 51 | `edtCleClasse` l. 24345 |
| S36 | L'objet vidéo n'a jamais joué de vidéo | 13 · 56 | `dr_cleScanner` l. 17577 ; `Désigner le dossier` l. 17585 |
| S37 | La garde de la clé disait « ✔ » sans rien vérifier | 13 · 84 | `dr_cleOu` l. 17603 calcule l'endroit (plus de `S.cle` figé) |
| S38 | Le prompt et le site ne disaient pas la même chose sur le bilan | 13 · 59 | l. 22088 |
| S39 | L'œuvre était recadrée | 13 · 65 | `object-fit:contain` l. 16127 ; `dr_imagesEntieres` l. 17565 |
| S40 | L'import ne créait aucune feuille | 13 · 66 | repères §12.42 l. 1324, 9223 |
| S41 | Une séance ne pouvait pas être réservée à une classe | 13 · 67 | « Pour : toutes les classes » l. 14024 ; §12.35 l. 3619 |
| S42 | L'extrait numéroté comptait les lignes vides | 13 · 68 | l. 10138, 10182 |
| S43 | Deux chapitres pouvaient porter le même titre | 13 · 70 | « proposition 2 » l. 9264, 13778 |
| S44 | « […] » devenait un trou | 13 · 72 | l. 10234 |
| S45 | Une dictée de la Correction de dictée ne se liait pas | 13 · 73 | « Dictée manuscrite existante » l. 1706 |
| S46 | Une ligne vide « › » sous la question du bilan | 13 · 76 | `dr_qSansReponse` l. 17532, 17670 |
| S47 | Une feuille de l'Atelier sans mise en forme | 13 · 78 | repère §12.37 l. 10334 |
| S48 | Dans l'Atelier, les heures datées d'aujourd'hui | 13 · 79 | `dr_sourceSeance` l. 16902 |
| S49 | Le lancement ouvrait une autre séance que celle de la case | 13 · 80 | repères §12.39 l. 3830, 11320 |
| S50 | « Jouer en avance » prenait toujours les Dylan | 13 · 81 | l. 19398 (la source unique) |
| S51 | Des gestes d'élève dans la répétition | 13 · 82 | repère §12.38 l. 16494 |
| S52 | La diapo du cahier de textes vide hors de la classe | 13 · 83 | `dr_cahierHorsClasse` l. 19322, 17534 |
| S53 | Structure perdait la corrélation après « Écrire avec une IA » | 13 · 85 | repères §12.65 l. 8507, 11508 |
| S54 | Le ✕ de Structure sans infobulle | 13 · 86 | même passage (§12.65) |
| S55 | La ligne de la dictée liée à la mauvaise feuille | 13 · 87 | même passage (§12.65) |
| S56 | « Ch. 0 » au lieu du rang du chapitre | 13 · 89 | `ordDe` l. 4210 |
| S57 | Deux chronos, dont un « 07:00 » en dur | 13 · 92 | l. 18046, 18051 |
| S58 | Les feuilles du site « n'ont pas d'adresse » | 13 · 93 | `dr_feuilleHtml` l. 21446 ; l. 21495 |
| S59 | L'étiquette d'activité au tableau | 13 · 94 | l. 17643-17644 ; « problématique » l. 16650 |
| S60 | Lancer depuis l'emploi du temps ne montrait pas le cours | 12 · 05 | « ▶ Ouvrir le pilotage et lancer » l. 20037 |
| S61 | La relecture suivait le geste, pas ce que la classe a vu | 12 · 06 | journal par diapo et par élément dévoilé, l. 17785-17787 |
| S62 | En mise en commun, la classe ne voyait pas la réponse pendant la frappe | 12 · 09 | l. 17668 « au tableau au fil de la frappe » |
| S63 | L'échelle des schémas | 12 · 24 | l'ancien moteur est tombé (l. 15996) ; schéma `p8` l. 17375 |
| S64 | « Appoint » mal lu | 12 · 16 | « appoint » : 0 ; « notion imprévue » l. 18045 |
| S65 | Les dettes de la production trouvées en cadrant | 12 · 17 | `dr_absentsDeLaCase` l. 20163 ; rôle `bilan` l. 17503 ; « M. Meney » dans le récit l. 21284 ; S20 |
| S66 | L'existant ne savait pas reprendre là où la classe en était | 12 · 28 | `ouvrirOuverture` l. 19273 ; `dr_reprendre` l. 19709 |

### 1.3 Les dettes non mesurables en lecture (36)

| n° | dette | source | pourquoi |
|---|---|---|---|
| N1-N19 | Des réglages d'affichage soldés dans la maquette ou à l'intégration : 13 · 9, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 33, 35, 44, 46, 55, 69, 74, 75 | registre H | il faut regarder l'écran (tailles, focus, pagination, contenu construit) |
| N20-N22 | Le texte du prompt d'injection : 13 · 62, 63, 64 | registre H | le prompt n'est pas le code du site, et je ne l'ai pas relu |
| N23 | Les mouvements littéraires dans la taxonomie | 13 · 71 | l'outil existe (l. 2643) ; ce qui manque est le collage par Paul, au hub |
| N24 | Les trois lignes Drive au hub | 13 · 88 | c'est une donnée du hub |
| N25 | Le temps réel (la latence entre pilote et tableau) | registre (anciens points) n° 3 | le flux est codé (l. 20902) ; la latence se chronomètre |
| N26 | La pulsation seule, et deux paroles du même élève fusionnées | registre (anciens points) n° 4 | il faut jouer le geste |
| N27 | L'export École Directe vérifié de bout en bout | registre (anciens points) n° 5 | la copie HTML existe (l. 21413) ; il faut la vérifier avec Paul |
| N28 | Les dettes vivantes de l'ancien moteur | registre (anciens points) n° 6 | le moteur est tombé ; il faut rejouer ces gestes dans l'Atelier |
| N29 | Le zoom qui se transmet au tableau | registre (anciens points) n° 1 et 1 bis | il faut deux appareils |
| N30-N31 | Le nombre d'heures d'une séance ; les sorts du T-5 | 12 · 07 ; 12 · 08 | il faut jouer le geste |
| N32 | Les défauts vus en jouant l'ancien déroulé | 12 · 22 | en partie soldée ; la palette et la modale sont à jouer |
| N33 | L'appel et les absents | POINT 15 | « le mot aux absents » existe (l. 19116) ; les rattrapages sont à jouer |
| N34 | Ce que l'élève reçoit après l'heure ; cadrage TEMPS §8 et §11 | POINT 16 ; POINT 34 | le portail de l'élève n'a pas été mesuré |
| N35 | Le récit figé, la forme du récit de séance, le Papier | POINT 21 ; lot L7 | ce n'est pas encore cadré |
| N36 | Le reste de 12 · 13 : le mandat ⑬ des mots, le rafraîchissement après injection | 12 · 13 | aucun critère dans le code |

**Hors du déroulé, donc non comptées.** Ces entrées des mêmes sources ne touchent pas le déroulé :
- la Rédaction universelle et la Correction de dictée : 13 · 52, 53, 54, 57, 58, 60, 61, 102 ;
- le panneau prof : 12 · 87, 88, 89, 212 (les trois promues avec la ④ selon le registre ; la 89 jamais traitée) ;
- les anciens points n° 8, 10, 11, 12 du haut du registre ;
- toute la section n°12 · 79 et suivantes (dictée, QCM).

---

## 2 · Le détail de chaque dette

### 2.1 Les dettes ouvertes

**O1 et O2** : voir §4.

**O3 · 13 · 95 — le récit confond le « je » de l'élève et M. Meney, et mange l'auxiliaire.**
- Sources : registre l. 3159 ; contrat §12.75 (1) ; transcript C13 l. 7641.
- Paul (29/10 11:58) : « Je pense que tu as mélangé dans le code: "M.Meney" et le "je" élève. D'ailleurs, l'auxiliaire a été mangé. »
- **OUVERTE.** `index.html` l. 21103 : `if(/^je\b/i.test(s)) return "M. Meney "+personne(...).replace(/^([a-zà-ÿ]+)e\b/,'$1é');`.

**O4 · 13 · 96 — le récit introduit les citations brutalement.**
- Sources : registre l. 3160 ; contrat §12.75 (1).
- Paul (29/10 11:58) : « tout ce qu'il y a entre guillemets est introduit très abruptement donc on ne comprend pas bien ce qui s'est fait etc. il faut vraiment améliorer le récit ».
- **OUVERTE.**
  - l. 21278 : la tournure « la consigne disait : » est toujours là.
  - l. 21191 : « on a dévoilé « … » ».
  - Aucune trace de la réécriture du ⑪ (aucun repère §12.75 dans le code).

**O5 · 13 · 97 — aucune garde quand on recharge pendant une répétition.**
- Sources : registre l. 3161 ; contrat §12.75 (4).
- Paul (29/10 11:58) : « j'ai rechargé le site en pleine répétition: je n'ai eu aucune garde ».
- **OUVERTE.** l. 20332 : `dr_heureTenue()` rend faux si `S.repetition`.

**O6 · 13 · 98 — les colonnes de Structure sans poignée.**
- Sources : registre l. 3162 ; contrat §12.75 (5).
- Paul : « pour les colonnes de la structure, elles doivent avoir les poignées en largeur aussi ».
- **OUVERTE.**
  - l. 973 : `.ed2-grille{grid-template-columns:230px minmax(0,1fr) minmax(0,1.05fr)}`.
  - J'ai cherché `ed2Poign*`, `ed2Larg*` et `ed2-resize` : aucun résultat.

**O7 · 13 · 99 — le texte des feuilles n'est pas justifié.**
- Sources : registre l. 3163 ; contrat §12.75 (5).
- Paul : « le texte doit toujours être justifié (quand on imprime, ça repasse correctement sur les bonnes lignes, mais c'est aligné à gauche et donc c'est moche) ».
- **OUVERTE.** `text-align:justify` : 0 occurrence dans `index.html`.

**O8 · 13 · 100 — au tableau, la ligne de la clé USB est une phrase.**
- Sources : registre l. 3164 ; contrat §12.75 (6).
- Paul : « au tableau, je ne veux pas la phrase "clé usb des vidéos etc". Je veux juste "USB ✅" ou "USB ⌛" ».
- **OUVERTE.** l. 20794-20795 : « ✔ Clé USB « … » · n fichiers », « … : autoriser la lecture », « ✘ … branche la clé », « Clé USB des vidéos : désigner son dossier… ». Cette ligne est sur l'écran d'attente du tableau distant (l. 20763).

**O9 · 13 · 101 — la frise ne lit que des années.**
- Source : registre l. 3165.
- Paul (29/10 12:41) : « j'ai voulu créer une frise avec des dates journalières et mensuelles, mais le champ n'accepte que les dates annuelles ».
- **OUVERTE.** l. 17254-17255 : `parseInt((p[0]||'').replace(/\D/g,''),10)`. « 14 août » devient 14, et le mois est perdu.

**O10 · 13 · 103 — une feuille projetée défile au tableau et ne se zoome pas.**
- Sources : registre l. 3167 ; contrat §12.75 (7).
- Paul (29/10 12:45) : « Le scroll doit se faire depuis le pilotage, jamais depuis le tableau. le tableau est figé je rappelle. enfin, une fiche doit pouvoir être zoomée avec le zoom évidemment. »
- **OUVERTE.**
  - l. 21495-21496 : `<iframe class="dr-doc-cadre dr-doc-feuille" … srcdoc=…>`.
  - l. 16387 : `.dr-doc-cadre{…height:100%…}`.
  - Aucune position de défilement n'est envoyée par le pilote (cherché `docScroll`, `doc.scroll`).

**O11 · 13 · 104 — les pages d'une diapo absentes de la colonne de l'Atelier.**
- Sources : registre l. 3168 ; contrat §12.75 (9).
- Paul (29/10 12:50) : « la colonne de gauche n'affiche pas la nouvelle page. Or, comment je sais qu'elle existe si elle ne s'affiche pas? ».
- **OUVERTE.** `voletAtelier` (l. 17869) ne contient aucune page. Seul le volet du pilotage a des vignettes par page (l. 18758).

**O12 · 13 · 90 — « dans les temps » ne mesure pas ce qu'il dit.**
- Sources : registre l. 3154 ; transcript C13 l. 7143.
- Paul (29/10 08:47) : « il faut mesurer le message " dans les temps " sur la carte du bas du calendrier ».
- **OUVERTE.**
  - `edtDivergence` (l. 25712-25732) compare les séances finies du chapitre en cours à la classe la plus avancée du niveau. `net<=1` donne « dans les temps ».
  - l. 24858 : le retard compté en séances s'affiche « h de retard ».

**O13 · 13 · 91 — les compétences nommées par l'intitulé officiel.**
- Sources : registre l. 3155 ; contrat §12.67 (3).
- Paul (29/10 09:15) : « Donc il faudra la phrase élève ».
- **OUVERTE.** `dr_invCompLib` (l. 16656) prend `i.libelle`, jamais `libelleEleve`.

**O14 · 13 · 77 — sans réseau, le site ne garde pas ce qu'on écrit.**
- Source : registre l. 3141.
- Paul (27/10 14:43) : « si internet tombe, je peux continuer à travailler sur du local ».
- **OUVERTE.**
  - Aucune réserve hors ligne : `navigator.onLine` ne sert qu'aux dépôts de fichiers (l. 4625, 18300).
  - Le témoin dit « ● pas encore au hub — la connexion ? » (l. 18751).

**O15 · 13 · 2 — l'infobulle d'un geste grisé commence par « Grisé : » (rechute).**
- Source : registre l. 3063, marquée « ✔ Réglée en p8-3c ».
- **OUVERTE, c'est une rechute.** l. 19878 (le minuteur, §12.70) : « Grisé : le minuteur n'est pas parti — « Départ » d'abord ». La phrase dit bien quoi faire, mais elle commence par « Grisé : », la forme que Paul a refusée.

**O16 · §12.67 — les diapos d'ouverture au canon.**
- Source : contrat l. 395.
- Paul (29/10 10:07) : « C'est surtout l'UI qu'il faut reproduire au mieux donc ce sont de nouveaux types de diapo à créer et le prompt d'injection à adapter. »
- **OUVERTE.**
  - 0 repère §12.67 dans le code.
  - Les diapos d'ouverture de §12.62 sont toujours là (`DR_INV_NOM`, l. 16650 ; l. 18139).

**O17 · §12.69 et le profil de la classe.**
- Sources : contrat l. 397 ; registre, anciens points n° 7 (C3b) et l. 30 (exigence ①) ; POINT 35.
- Paul (29/10 08:47) : « Il faut construire le profil longitudinal classe ( entrée par l'encart en bas du calendrier). »
- **OUVERTE.** `edtCarteClic` (l. 24867-24868) dit : « Profil de la classe … il arrive au lot suivant ».

**O18 · la réactivation jamais retirée (exigence du 29/10 ①).**
- Sources : registre l. 30 ; transcript C13 l. 7143, réponse C13 952.
- Paul (29/10 08:47) : « on garde le bouton d'activation désactivation, et je veux voir la diapo qui s'allume ou se grise, mais jamais ne disparaît. Quand elle est grisée elle n'apparait jamais au tableau. »
- **OUVERTE.**
  - `dr_reactInserer` (l. 20262-20265) : si le choix n'est pas « oui », la diapo est retirée de la copie avec `E.splice(i, 1)`.
  - L'infobulle du « non » le dit (l. 20270) : « la réactivation construite est retirée de la copie de la classe ».
  - Aucun état « grisée » n'existe.

**O19 · §12.73 — les chartes visuelles.**
- Source : contrat l. 401.
- Paul (29/10 10:41) : « Est ce possible d'avoir 5 chartes visuelles que je choisis selon les chapitres et qui s'appliquent partout? ». Puis (10:47) : « pour l'instant deux chartes suffisent, une pour les 4e, une pour les 3e ».
- **OUVERTE, et à cadrer** (captures d'abord). Rien dans le code : les « CHARTE » de `dr.css` (l. 16113, 16251) sont des commentaires sur le CSS repris de l'ancien.

**O20 · §12.75 (2) — l'Atelier sans classe, la répétition toujours avec la classe test.**
- Paul (29/10 11:58) : « pourquoi dans l'atelier j'ai l'heure de la prochaine classe? Normalement l'atelier est sans classe, ou alors toujours avec la classe test, non? ».
- **OUVERTE.** `dr_classeProposee` (l. 19395-19400) prend, dans l'ordre :
  - la classe du cours,
  - sinon celle de la séance (la prochaine case),
  - sinon la première classe du niveau.
- Ce n'est jamais d'office la classe test.

**O21 · §12.75 (3) et (8) — la diapo vierge après le bilan.**
- Paul (29/10 11:58) : « pour le bilan, la règle est qu'il n'y a pas de diapo après le bilan: en fait si, il en faut une vierge absolument, car c'est sur elle qu'on va écrire le bilan ». Puis (12:41) : « il y aura forcément des diapos en plus ».
- **OUVERTE.**
  - Aucune diapo vierge n'est posée par le site après la diapo du bilan.
  - Aucun mot-clé ne se coche tout seul (j'ai cherché « se coche » et « vierge » : seules l'insertion manuelle d'une diapo vierge, l. 18140-18141, et les étapes de fin d'heure apparaissent).

**O22 · la page HTML n'est jamais chargée dans la diapo.**
- Sources : registre 12 · 71 bis et 12 · 72 (« la page HTML est un cadre qui compte ses étapes ») ; POINT 19.
- **OUVERTE.** Trouvée en mesurant ; à ma connaissance elle n'est inscrite nulle part depuis l'intégration.
  - `rendre` (l. 17663) n'écrit qu'un cadre : « page HTML — <fichier> · étape k / n » et « … ce que la page montre à cette étape (dans le site : la page elle-même, chargée dans la diapo) ».
  - Aucune iframe n'est créée. Aucune écoute de `mjpc-page` (le mot n'existe que dans le texte d'aide, l. 18305).
  - Ce texte de remplacement s'affiche aussi au tableau.
  - C'est la même famille que 13 · 84 : une simulation de la maquette restée dans le site.

**O23 · ÉLÈVE — 2 (le ◆ au pilotage, les anniversaires).**
- Sources : POINT 14 ; `MANDATS/MANDAT-ELEVE-2.md`.
- Paul (T271, cité dans le mandat) : « Oui ça peut être pas mal au tableau, mais c'est moi qui choisis d'afficher ».
- **OUVERTE.** « ◆ » : 0 dans les modules du déroulé ; « anniversaire » et 🎂 : 0 dans `index.html`.

**O24 · le téléphone télécommande.**
- Sources : registre, anciens points n° 2 ; POINT 22 ; R10 de `RECYCLAGE-ANCIEN-DEROULE.md` ; plan, lot L8.
- **OUVERTE.** l. 22574-22582 : il ne reste que les commentaires de la section `?vue=tel`, sans code.

**O25 · le branchement avec la dictée.**
- Sources : POINT 24 ; 12 · 178 ; passation C12→C13, §4 point 6.
- **OUVERTE.** `seanceId` : 0 occurrence dans `index.html`.

**O26 · les attendus au hub et la garde Éduscol.**
- Sources : 12 · 18 (l. 2726, « TOUJOURS OUVERTE ») ; 12 · 25 ; POINT 13 ; `MANDAT-A1-ATTENDUS.md`.
- **OUVERTE.**
  - Aucune lecture de `/attendus`.
  - Le bouton « + une notion » (l. 19032) le dit lui-même : « (les attendus ne sont pas dans la maquette) ».
  - L'état des données au hub n'est pas mesurable sans réseau.

**O27 · le profil longitudinal de l'élève et le cockpit.**
- Sources : registre, anciens points n° 9 ; POINT 23.
- **OUVERTE.** `mjpcProfils` n'est lu qu'à l'inventaire des données du panneau (l. 6484-6485, libellé l. 6515). Aucun écran de profil.

**O28 · 12 · 13 — `CLAUDE.md` n'est plus à jour.**
- Source : registre l. 2707.
- **OUVERTE.** `CLAUDE.md` l. 7 : « Five self-contained HTML files ». Le déroulé et les nouvelles apps n'y sont pas.

### 2.2 Les dettes soldées

Chacune a sa preuve dans le tableau 1.2 ; voici les précisions utiles.

- **13 · 4 et 13 · 5.** Le fil de dévoilement met la question avant ses lignes : `elements` l. 17535, `{e:'q'}` puis `b.el`. Au tableau, une question pas encore dévoilée est retirée de l'affichage (`display:none`, l. 16147). Paul (06/10) : « la question suivante paraît d'emblée ».
- **13 · 41.** Trois pièces :
  - la garde du navigateur (`dr_heureTenue` l. 20332) ;
  - le bandeau « reprendre » (`sesReprise*` l. 20353-20354) ;
  - « Annuler cette heure » (§12.68, l. 19633).
  - Paul (26/10) : « je ne dois pas pouvoir quitter le pilotage ».
- **13 · 56 et 13 · 84.** La clé est lue pour de vrai (`dr_cleScanner` l. 17577). L'endroit de la clé est calculé (`dr_cleOu` l. 17603). La valeur de départ `cle:'portable'` (l. 17458) reste dans l'état mais n'est plus lue pour la garde.
- **13 · 39.** Soldée dans le code. Le registre la marque « ✔ quand Paul aura vu chez lui le chapitre de Franklin, Dylan, Hugo et Turing » : ce constat de Paul reste à faire.
- **12 · 06, 12 · 09, 12 · 24, 13 · 24.** L'ancien moteur et son pont sont tombés : `AT_DR_B64` ne reste que dans des commentaires (l. 15996, 17098, 21608).
- **Les points du contrat §12.22 à §12.74 promus de la ① à la ⑩.** Chacun a ses repères dans le code. Par exemple :
  - §12.26 : 24 repères ;
  - §12.59 (rien d'incorrigeable au tableau) : 28 ;
  - §12.62 : 35 ;
  - §12.68 : 7 ;
  - §12.70 : 16 ;
  - §12.74 : 16.
- **Les points du contrat jamais livrés** n'ont aucun repère : §12.67, §12.69, §12.73, §12.75 → O16, O17, O19, O20, O21, O3-O11.

### 2.3 Les dettes non mesurables en lecture

Ce sont des comportements d'écran : une taille, un focus, une pagination, le contenu d'une diapo construite, une latence. Il faut jouer le geste. Les preuves partielles sont dans le tableau 1.3.

Deux remarques :
- **13 · 12** : le registre dit « Rien à coder » d'après la mesure d'E3 (écart de 0,3 pt). La valeur `policeReduite` est calculée (l. 17695, 17724) ; son affichage reste à regarder.
- **12 · 22** : une partie est soldée.
  - Le dégel ne saute plus sans question (`garde2`, l. 17942-17943).
  - Le mode test ne fuit plus (S13).
  - La réponse s'affiche pendant la frappe (S62).
  - Restent à jouer : la palette (le message « Aucun élève avec ces initiales », l. 18962 et 18991) et la modale de fin d'heure (les codes).

### 2.4 Les doublons regroupés

- **13 · 95, 96, 97, 98, 99, 100, 103, 104** sont aussi les points (1), (4), (5), (6), (7) et (9) du contrat §12.75, la « ⑪ ».
- **Le profil de la classe** est nommé sous plusieurs formes : le point n° 7 du haut du registre (C3b), l'exigence du 29/10 ①, le POINT 35, le contrat §12.69 et la suite de 13 · 90. Tout est regroupé en O17 ; O18 en est la partie « réactivation ».
- **13 · 91** est aussi le contrat §12.67 (3).
- **Le téléphone** : point n° 2 du haut du registre, POINT 22, R10, lot L8.
- **Les attendus** : 12 · 18, 12 · 25, POINT 13 (« attendus au hub »), lot A1.

---

## 3 · Les deux dettes du 01/11 (Paul, 18:53)

### 3.1 « rien qui n'arrive au tableau ne s'affiche tout seul. C'est moi qui dévoile tout. »

**Verdict : ça ne va pas.** Dans le code d'aujourd'hui, beaucoup de choses arrivent au tableau sans geste de dévoilement. La règle de fond est la suivante : à chaque redessin du pilote, si Paul n'a pas gelé, l'état part au tableau (`dr_tout`, l. 18759 : `if (!S.gel) pousser(et); else S.attente = et;`). Le tableau local et le tableau distant dessinent avec la même fonction `rendre`. Voici tous les chemins trouvés.

**A. Ce qui se voit dès qu'une diapo arrive au tableau, avec 0 élément dévoilé**

Au tableau, seuls sont cachés les éléments qui portent la classe `pas` (CSS l. 16147, 16236, 16268, 16354, 16438). Tout le reste se voit tout de suite.

1. **L'étiquette d'activité** « Activité n — titre » : toujours, au-dessus de tout. `actHtml` l. 17643-17644, posée l. 17654-17657.
2. **La ligne de tête d'une consigne ou d'un bloc texte.** `rendre` l. 17666 : elle ne se cache (`tPas`) que sur une diapo construite par le site. Ailleurs, « le titre reste dès le début (p8-4) ».
3. **L'image entière et sa légende.** l. 17670 : aucune classe `pas`. Une image seule prend toute la diapo (l. 17657).
4. **Toutes les marques posées sur une image, d'un coup, par défaut.** `dr_mkUneAUne` l. 21621 : une à une seulement si `devoilerTout === false`.
5. **Le schéma entier, par défaut.** `p8Elements` l. 17363 : `if (b.devoilerTout !== false) return []`. Le schéma n'a alors aucun élément à dévoiler, et `rendre` le dessine en entier (`vu = Infinity`, l. 17671). Même dévoilé bulle par bulle, le titre d'un schéma qui n'est pas une carte (`sch-t`, l. 17671) se voit d'emblée.
6. **La fiche posée dans la diapo, entière** (type, titre, définition, corps). l. 17669 : aucune classe `pas`.
   - **À jouer** : `elements` compte ses paragraphes comme des éléments à dévoiler (l. 17535), mais `rendre` n'avance pas le compteur `k` sur une fiche. Les lignes des blocs suivants risquent donc de se dévoiler en avance.
7. **La ligne d'un document** (📄 titre · type · pages). l. 17665.
8. **La page HTML** : son cadre de remplacement (voir O22). l. 17663.
9. **La vidéo** : le lecteur et sa légende. `videoHtml`, l. 17656.
10. **La légende de surlignage.** l. 17676.
11. **La diapo du cahier de textes.** Se voient d'emblée : l'en-tête « Cahier de textes — jour, horaires », le bandeau « Mon espace élève · Collège Saint-Joseph », « Cahier de textes (3 …) » et les deux onglets (l. 17650-17652). Seules ses quatre cases attendent ▶ (l. 17649).
12. **Une fiche ouverte en page.** Son en-tête (Fiche, Chapitre, titre) et son pied (la classe) se voient d'emblée (l. 17648). Seuls ses paragraphes attendent (`visibility:hidden`, l. 16354).
13. **Le point vert ou rouge de connexion**, en haut à droite. l. 17680.

**B. Ce qui fait changer la diapo du tableau sans geste « dévoiler »**

14. **Tout redessin hors gel.** Le tableau montre la diapo où est Paul (l. 18759).
15. **Le lancement de l'heure.** Au premier dessin, la première diapo part au tableau avec tout ce qui est en A.
    - Si la réactivation est à « oui », c'est la diapo « Où en sommes-nous ? » (`dr_reactInserer` l. 20262-20265) : son étiquette se voit, et ses titres de blocs attendent leur première ligne (l. 17666).
    - La diapo qui suit la réactivation arrive pareil.
16. **▶ au bout d'une diapo ouvre la suivante.** `devoiler` → `allerSuivante`, l. 17932-17934. La diapo suivante arrive avec tout ce qui est en A. Une diapo sans rien à dévoiler arrive entière : image, vidéo, schéma « tout ensemble », document, fiche posée. Cela vaut aussi pour la diapo du cahier de textes (l. 17934).
17. **Le dégel.** `degeler()` (l. 17981) redessine, et le tableau rejoint la diapo de Paul. Si Paul a bougé pendant le gel, la question « La classe est sur la X, tu es à la Y » vient d'abord (l. 17942-17943).
18. **Le clic sur une vignette.** La garde « La classe te suivrait » vient d'abord (`aller` l. 17939-17940). Si Paul confirme sans geler, la diapo arrive au tableau comme en A.
19. **La répétition (« ▶ Jouer en avance »).** Le tableau distant la reçoit dès son départ (`lancerRepetition` l. 18334 → `dr_repTableauDebut` ; `pousser` en répétition l. 17784). À l'arrêt, il revient à ce qu'il montrait avant (`dr_repTableauFin` l. 18847).
20. **« Reprendre » l'heure.** La dernière scène revient au tableau (`dr_reprendre` l. 19709).

**C. Ce qui change sur la diapo affichée sans geste « dévoiler »**

21. **Une réponse tapée sous une question pas encore dévoilée dévoile la question toute seule.**
    - `dr_devoilerQuestionsRepondues` l. 18753-18755 : `if (k >= 0 && k + 1 > d.nDev) { d.nDev = k + 1; … }`.
    - Puis la réponse part au tableau à chaque lettre (l. 17668 : « La réponse, au tableau au fil de la frappe »).
22. **« Qui a participé », une fois montré par 👥.** Il se recalcule et repart seul à chaque prise de parole (`dr_versMur` l. 20509-20511 ; `dr_tabVeiller` l. 20707).
23. **La copie de la classe modifiée.** Cela couvre la correction en direct, le texte tapé dans la diapo et l'Atelier ouvert pendant l'heure. `dr_tabVeiller` compare la copie chaque seconde et renvoie la scène (l. 20712-20720 → `dr_sceneAuto` l. 20595). Un texte retouché sur la diapo affichée change donc au tableau.
24. **La diapo du cahier de textes.**
    - Le défilement de la carte au pilote part au tableau (l. 18763).
    - Au 3e ▶, l'onglet passe seul à « Contenus de séances » (`devoiler` l. 17928).
25. **La carte « Activité n — titre / à l'oral ».** Elle part au tableau **dès l'ouverture** de la fenêtre « expliqué à l'oral », avant toute validation, si une activité y est cochée d'office (`ouvrirOral` pousse l'état, l. 17968 ; `etatComplet0` l. 17765 ; `rendre` l. 17641).

**D. Ce que le tableau distant montre hors des diapos**

26. **L'écran d'attente.** Il montre « monsieurjaipascompris », l'heure et la date (l. 20761-20763 ; horloge l. 20781-20786), la classe attendue (`dr_tabDireClasse` l. 20842) et la phrase de la clé USB (l. 20794-20795 ; voir O8).
27. **Le minuteur** (`dr-tab-minut` l. 20766). Il n'arrive que sur le geste « au tableau » de Paul.
28. **Le plein écran.** Il est demandé au premier geste sur l'appareil du tableau (l. 20747). Rien n'est affiché à la classe.

**E. Ce qui ne s'affiche que sur un geste de Paul (conforme), ou qui n'existe pas encore**

29. **Les documents** : seulement par un clic (l. 17665 « Un clic ouvre le document au tableau » ; panneau l. 21500). Une fois ouvert, le document s'affiche en entier, page par page (`docHtml` l. 21119).
30. **« Montrer cette suite à la classe »** (`montrerSuite`, l. 17947), le chrono, « Qui a participé » : sur geste.
31. **La « mise en lumière »** (`spot-on`) : sur geste.
32. **La pastille d'anniversaire : elle n'existe pas** (0 occurrence). Le mandat ÉLÈVE — 2 la prévoit sur un geste « Afficher au tableau » / « Retirer ».
33. **La réactivation à « non »** : elle est retirée de la copie (l. 20264), donc jamais au tableau. Mais l'état « grisée » voulu par Paul n'existe pas (O18).
34. **« Ta version »** n'est jamais au tableau. C'est conforme : seul le pilote a les boutons `rv` (l. 17652, `et.pilote`).

**Ce que la dette touche, pour celui qui la cadrera :**
- les blocs visibles d'emblée (points 1 à 12) ;
- les deux réglages « tout ensemble » par défaut (points 4 et 5) ;
- la règle d'envoi hors gel (points 14 à 18) ;
- le dévoilement automatique d'une question (point 21) ;
- la carte de l'oral (point 25).

Ces points se télescopent avec :
- §12.59 (« rien d'incorrigeable au tableau », la correction en direct, point 23) ;
- la règle « le tableau garde sa dernière image » (contrat §12, point 11) ;
- le cadrage C1 4.2 (« la réponse part au tableau au fil de la frappe »).

### 3.2 Le bloc « question » : « la participation des élèves doit être avant la réponse préparée par moi »

**Verdict : ça ne va pas.** Partout, l'ordre est : la question → la réponse préparée → la participation.

**Dans l'éditeur (l'Atelier) :**
- Le formulaire « + Question » (l. 18276) a deux champs, dans cet ordre : « La question (jamais vide) », puis « La réponse attendue (à part, jamais dévoilée avec la question) ».
- Il refuse une réponse vide (« Refus : la réponse attendue manque — elle vit à part, c'est le contrat »).
- Il fabrique le bloc `{ t: 'question', txt: q, el: [r] }`.
- Quand on change le type d'un bloc en « question » (l. 18456), chaque ligne devient `{ t:'question', txt, el: [''] }`, « la question, puis sa réponse attendue (ici à écrire) ».
- La carte du choix d'objet dit (l. 18444) : « avec sa réponse attendue à écrire dessous ».
- La participation n'a aucune place dans l'éditeur : elle naît en classe (`reps`).

**Dans le fil de dévoilement (pilote) :**
- `elements` (l. 17535) range d'abord la question (`{e:'q'}`), puis les lignes de `b.el`, c'est-à-dire la réponse préparée.
- La participation n'est pas une étape du fil.
- Le ▶ qui suit la question dévoile donc la réponse académique.
- La première réponse tapée dévoile la question (l. 18753-18755), pas la réponse préparée.

**Dans le dessin (pilote et tableau, même code, l. 17667-17670) :**
1. la question (`p.q`) ;
2. la réponse préparée (`ul.etapes`) : grisée au pilote (`opacity .45`, l. 16267), cachée au tableau tant qu'elle n'est pas dévoilée (`display:none`, l. 16268) ;
3. les réponses des élèves (`.rep` : initiales + ce qui a été dit) ;
4. au pilote seulement, la ligne libre pour la réponse suivante (`rep libre`).

**Ce que voit la classe.** Tant que la réponse préparée n'est pas dévoilée, la participation s'affiche juste sous la question. Dès que Paul la dévoile, elle s'insère **au-dessus** de la participation. Au pilote, la ligne de la réponse préparée est entre la question et les réponses des élèves dès le départ.

**Les cas à part :**
- **La question du bilan** n'a pas de réponse préparée (`dr_qSansReponse` l. 17532). La participation y vient directement sous la question : c'est le seul cas déjà dans l'ordre voulu.
- **Le récit** (l. 21281-21284) ne cite la réponse préparée que si aucun élève n'a répondu.

**Une trace plus ancienne.** Le registre 12 · 22 (l. 2740) notait déjà sur l'ancien déroulé : « le second ▶ qui la montre montre aussi la réponse attendue préparée ».

---

## 4 · Ce que je n'ai pas pu mesurer, ou pas lu

- **Les commits.** Les copies sont superficielles : `git log -S` et `git log --grep` ne voient rien avant le 29/10 16:21. Aucun commit de code du déroulé n'a été vérifié par git. Les hachés cités viennent du registre et du journal.
- **Les 36 dettes du tableau 1.3.** Il faut jouer le geste à l'écran, à deux appareils, ou lire le hub (sans réseau ici).
- **Le cas de la fiche posée dans une diapo** (§3.1, point 6) : le risque de dévoilement en avance des blocs qui suivent est lu dans le code, pas joué.
- **Le portail de l'élève** : je n'ai pas mesuré ce que l'élève reçoit après l'heure (N34).
- **Les sources lues en partie ou pas lues :**
  - registre `MJPC6-DETTES.md` : seulement les l. 1-53 et 2664-3241, au statut, entrée par entrée. Les sections A à F (l. 54-2663, l'historique d'août et le LOT 2ter) n'ont pas été relues : elles peuvent porter des dettes du déroulé d'avant la refonte que ce rapport ne liste pas ;
  - `PLAN-INTEGRATION-DEROULE.md` : les titres seulement ;
  - le dossier `MANDATS/PLAN-10-JOURS/` : pas lu (seulement listé) ;
  - les quatre mandats E1-E4 et `PHRASES-A-COLLER.md` : pas lus ;
  - `CONTRAT.md` : le §12 en survol, les points 67 à 75 en entier ;
  - les quatre `RELANCES` : seulement une recherche de « ouverte » et « traitée ». La dernière table d'E4, citée dans `RELANCES/E4.md` l. 141, compte « 178 lignes : 168 réglées, 10 écartées, 0 à Paul, 0 ouverte ».
- **Les transcripts.** Dans C13, j'ai lu les messages de Paul du 25/10 au 30/10 (l. 2956-8563) et le tour 343. Dans C12, seulement les titres des tours 745-759 et une recherche sur « déroulé » : après le 20/10, C12 ne parle que du QCM.

---

## 5 · Les fichiers lus

**Production (`/home/claude/monsieurjaipascompris`) :**
- `index.html` (par recherches ciblées et lectures de passages ; les lignes sont citées plus haut) ;
- `docs/MJPC6-DETTES.md` (l. 1-53, 2664-3241) ;
- `docs/MJPC6-journal.md` (l. 1-30, 1090-1287) ;
- `CLAUDE.md`.

**Sas (`/home/claude/mjpc-chantier`) :**
- `MANDATS/POINT-DEROULE-RESTE-A-CODER.md` (entier) ;
- `MANDATS/PASSATION-C12-C13-DEROULE.md` (entier) ;
- `MANDATS/NOTE-POUR-C13-AUDIT.md`, `NOTE-POUR-C13-CORRESPONDANCES.md`, `NOTE-POUR-C13-MAQUETTE-REELLE.md` (entiers) ;
- `MANDATS/PLAN-10-JOURS.md` (entier) ;
- `MANDATS/PLAN-INTEGRATION-DEROULE.md` (titres) ;
- `MANDATS/PLAN-10-JOURS/` (listé, pas lu) ;
- `MANDATS/INTEGRATION-DEROULE/CONTRAT.md` (§12 en survol, points 67-75 en entier) ;
- `MANDATS/INTEGRATION-DEROULE/RECYCLAGE-ANCIEN-DEROULE.md` (entier) ;
- `MANDATS/INTEGRATION-DEROULE/RELANCES/E1.md`, `E2.md`, `E3.md`, `E4.md` (recherches) ;
- `MANDATS/MANDAT-ELEVE-2.md` (le passage sur les anniversaires) ;
- `TRANSCRIPTS/C13/TRANSCRIPT-C13.md` (messages de Paul du 25/10 au 30/10, tour 343) ;
- `TRANSCRIPTS/C12/TRANSCRIPT-C12.md` (titres des tours tardifs, recherche « déroulé »).

**Tests à faire à la main, pour trancher ce qui n'a pas pu l'être en lecture :**
1. En mode test, avec la 3E Charles de Gaulle et le tableau distant ouvert sur un autre appareil : lancer une heure, et noter ce qui arrive au tableau avant tout ▶ (étiquette, image, schéma, fiche, cahier).
2. Sur une diapo « fiche posée + consigne » : appuyer sur ▶ une fois, et regarder si une ligne de la consigne paraît au tableau.
3. Sur une question : taper une réponse d'élève avant de dévoiler la question, puis dévoiler la réponse préparée, et regarder l'ordre au tableau.
4. Ouvrir « expliqué à l'oral » sans valider, et regarder le tableau.
5. Recharger la page en pleine répétition (13 · 97).

01/11/2026 19:06
MEMO
