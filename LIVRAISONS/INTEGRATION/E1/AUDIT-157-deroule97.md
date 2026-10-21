# Audit deroule97 : les 157 fonctions, geste par geste, face à la maquette p8-5g

*Lecture seule. Sources : `DEROULE/deroule97.html` (2682 lignes, 157 `function x`), `work/maquette.html` (1836 lignes), `MANDATS/INTEGRATION-DEROULE/RECYCLAGE-ANCIEN-DEROULE.md` (A, B = R1-R12). « L » = ligne de deroule97 ; « m.L » = ligne de maquette.html (la maquette a des lignes très longues : la ligne donne le début de l'instruction).*

Comment on a cherché dans la maquette : par nom de fonction, identifiant, libellé de bouton ou `title`, et touche (`grep -o` sur tout le fichier). Tous les gestionnaires `keydown`, `paste`, `dblclick`, `wheel`, `contextmenu` et `mousedown` de la maquette ont été relus (m.L947, 1114, 1191, 1196-1197, 1213, 1257, 1311-1312, 1382, 1386, 1500, 1642, 1814-1825). « repris » veut dire que le geste existe, même sous une autre forme.

Quatre faits à connaître avant de lire le tableau :
- **Les gestes sans bouton de deroule97** sont tous dans 5 gestionnaires anonymes, sans nom de fonction : le `keydown` global « forme » (L2440-2463 : Ctrl/Cmd+Z, Ctrl/Cmd+C/X sur sélection, Ctrl/Cmd+V, Ctrl/Cmd+B/U/H, →/Espace, ←/Retour arrière), le `keydown` des marques (L1825-1831 : Échap, Suppr), les `mousedown/move/up` de préhension (L1706-1808), le glisser des blocs (L2014-2041), le lasso (L2187-2228). Il faut y ajouter les glisser des vignettes et du sommaire (L2070-2134), le clic droit (L2349-2378) et le double-clic `ondblclick="bascule"` (L654).
- **`touche` (n°88) n'est PAS le gestionnaire clavier général**. C'est la fonction interne d'`editeMarque` : Entrée et Échap pendant qu'on écrit sur une marque d'image (L1819-1821).
- **`zoom` (n°62) est la réglette « 32 pt »** (`<input type=range id="rz" oninput="zoom()">`, L415), c'est-à-dire la taille du texte. Son effet de bord, `reabsorbe`, tombe avec LOT G. Le geste visible, lui, est repris dans la maquette (`$('taille').oninput`, m.L1319, « Le texte grossit au tableau »).
- **Fonctions imbriquées** comptées dans les 157 : `cls`, `ouvre` (dans `html`), `etat` (dans `outilsDuRegime`), `pousse` (dans `carte`), `bord` (dans `cycle`), `majApresPoint` (dans `majVues`), `fin`, `touche` (dans `editeMarque`). `ouvre` (L577) est vide (`function ouvre(){}`) : c'est du code mort.

## 1. Les 157 fonctions

Légende de la colonne « maquette » : **repris** · **pas repris** · **interne** (moteur interne, sans geste propre) · **tombe** (tombe par le cadrage : zoom/suites, scission, degorge, réabsorbe, LOT G, téléphone).

| n° | nom (L) | ce qu'elle fait | geste visible | maquette | R |
|---|---|---|---|---|---|
| 1 | prenom (538) | initiales → prénom | au tableau, « Qui a participé » nomme les élèves | repris (m.L1356 sq., `o.p` dans la modale qui) | — |
| 2 | hm (540) | minutes → hh:mm depuis DEBUT | heures affichées (vignettes, durées, récit) | repris | — |
| 3 | horaires (541) | recalcule l'heure de chaque écran à partir des durées | les heures se recalent quand une durée change | repris (`ouOnEnEst`, m.L1233 : « les heures de début de la suite se recalent ») | — |
| 4 | maintenant (542) | heure réelle en minutes | — | interne | — |
| 5 | ecranDuMoment (543) | écran que l'horloge attend | ligne de durée en rouge `retard` (L784) | repris (m.L1234 « l'heure dépasse de… », « en retard de ») | — |
| 6 | corps (548) | corps des vignettes | — | interne | — |
| 7 | calePilote (549) | taille du texte au pilote = loi du tableau | — | interne | — |
| 8 | sauve (555) | empile l'état (40 max) | — (support de ↶) | pas repris | R4 |
| 9 | annuler (556) | dépile l'état | bouton « ↶ Annuler » (title « Ctrl+Z ») L410 ; Ctrl/Cmd+Z L2442 | pas repris (Ctrl+Z = `annulerDerniere`, seulement parole/note/appel, m.L1403) | R4 |
| 10 | marqueFiche (558) | un paragraphe de fiche est-il ✍🏻 ? | marque ✍🏻 sur un paragraphe de fiche ouverte | pas repris (la fiche ouverte n'a pas de paragraphes marquables, m.L837) | **R14** |
| 11 | marque (560) | un objet est-il ✍🏻 ? | liseré « à écrire » | repris (`aecrire`, `et.ecr`) | — |
| 12 | html (563) | rendu d'un écran (pilote ou classe) | tout l'écran | repris (`rendre` de la maquette) | — |
| 13 | cls (571) | classes « à écrire » / grisé « après » | grisé de ce qui n'est pas dévoilé | repris (`pas`, `aecrire`) | — |
| 14 | ouvre (577) | vide (code mort) | — | interne | — |
| 15 | borneRev (660) | borne le dévoilement | — | interne | — |
| 16 | rendre (669) | rend tout ; contient « Où on en est » x/y (L753-769), la participation (L770-781), « Temps par activité » (L783-785) | colonne Pilote | repris en partie (voir R7 ; durées : repris ; participation : repris) | R7 |
| 17 | outilsDuRegime (799) | grise les outils sans objet sur un écran visuel et dit pourquoi (title) | boutons ✦, ✍🏻, G, S, surligneurs, + Schéma/+ Image grisés avec explication | repris autrement (gardes p8 : `p8GardesBarre`, `p8GardeObjet`, avec titles) | — |
| 18 | etat (804) | grise ou rend un bouton, garde son title | idem | repris autrement | — |
| 19 | schLignes (820) | lignes de la source du schéma | — | interne (repris `p8Lignes`) | — |
| 20 | esc (821) | échappe le HTML | — | interne | — |
| 21 | schemaHTML (823) | schéma, dévoilement un à un | schéma au tableau | repris (`p8SchemaHTML`) | — |
| 22 | schEch (846) | échelle du schéma selon la réglette | — | repris (`p8Ech`) | — |
| 23 | cle (847) | clé d'une bulle | — | repris (`p8Cle`) | — |
| 24 | mesure (848) | taille d'une bulle | — | repris (`p8Mesure`) | — |
| 25 | separe (850) | anti-chevauchement | — | repris (`p8Separe`) | — |
| 26 | surface (891) | agrandit la surface | — | repris | — |
| 27 | dessine (899) | dessine une bulle | — | repris (`p8Dessine`) | — |
| 28 | carte (906) | carte mentale | forme « Carte mentale » | repris (`p8Carte`) | — |
| 29 | pousse (915) | ajoute une bulle (imbriquée) | — | repris (`pousse` dans `p8Carte`) | — |
| 30 | frise (951) | frise | forme « Frise » ; points tirables | repris (`p8Frise`, `g.p8-jal`) | — |
| 31 | arbre (986) | arbre | forme « Arbre » | repris (`p8Arbre`) | — |
| 32 | cycle (1019) | cycle | forme « Cycle » | repris (`p8Cycle`) | — |
| 33 | bord (1026) | pointe de flèche au bord | — | repris | — |
| 34 | grille (1055) | tableau | forme « Tableau » | repris (`p8Grille`) | — |
| 35 | ouTexte (1076) | où la parole a été prise | historique d'un élève | repris (même nom) | — |
| 36 | partAjoute (1085) | note une prise de parole | boutons de `ouvrirPart` | repris (même nom) | — |
| 37 | partRetire (1092) | retire une prise de parole | ✕ « retirer » | repris (même nom) | — |
| 38 | histoire (1099) | historique d'un élève | infobulle de la pastille (L780), fiche d'élève | repris (même nom) | — |
| 39 | copierED (1115) | copie HTML+texte pour École Directe | « 📋 Copier pour École Directe — contenu de séance » / « … travail à faire » (L1379-1380) | repris | — |
| 40 | figeRecit (1142) | fige le récit pour le retoucher | « Le figer pour le corriger » (L1378) | repris (versions ↶ ↷, « Ta version ») | — |
| 41 | rendRecit (1143) | retour au récit automatique (avec confirmation) | « Revenir au récit automatique » (L1384) | repris | — |
| 42 | imparfait (1164) | présent → imparfait | — | repris (même nom) | — |
| 43 | empreinte (1174) | hachage pour les connecteurs | — | repris (même nom) | — |
| 44 | connecteur (1175) | connecteur logique | — | repris | — |
| 45 | personne (1176) | vous → on | — | repris | — |
| 46 | recit (1177) | consigne → phrase au passé | — | repris | — |
| 47 | lisible (1197) | nettoie un texte cité | — | pas repris (sert seulement à `citations`) | **R15** |
| 48 | citations (1204) | relève ce qui a été surligné et marqué « à recopier » dans les fiches | récit : « où on a surligné « … » », « On a recopié dans le cahier : … » (L1297-1303) | pas repris | **R15** |
| 49 | majVues (1231) | Sommaire (L1233-1242), Documents (L1244-1247), récit (L1249-1386), Papier (L1387-1406) | onglets Sommaire, Documents, Relecture, Papier | Sommaire, Documents : R12 ; récit : repris ; **Papier : pas repris** | R12 / **R16** |
| 50 | majApresPoint (1330) | majuscule après un point | — | interne | — |
| 51 | lire (1408) | lit l'écran dans le modèle ; écrit `ANNOT` (L1434-1440) | — (support de toute écriture) | interne ; la couche `ANNOT` n'est pas reprise | R14 |
| 52 | ligne (1442) | Entrée dans une réponse → la ligne suivante, la réponse est montrée | **Entrée** dans une réponse (L655) | repris (m.L1329 `brancherAjout`, title « Entrée : la réponse suivante ») | — |
| 53 | va (1446) | aller à un écran | clic sur une vignette, une ligne d'« Où on en est », « ouvrir » | repris (`aller`) | — |
| 54 | pas (1449) | écran suivant ou précédent | (par ▶ en fin d'écran) | repris | — |
| 55 | elems (1453) | ce qui se dévoile dans un bloc ; **fiche ouverte : ses blocs** (L1470-1477) | ▶ dans une fiche ouverte | repris, sauf la fiche (`elements`, m.L814 : pas de branche fiche) | R14 |
| 56 | photoVu (1481) | photo avant le geste | — | interne | — |
| 57 | animeArrivees (1487) | animation de ce qui paraît | apparition animée | repris (`neuf-vu`) | — |
| 58 | devoile (1516) | dévoile | ▶ (title « dévoile l'élément suivant ») ; → / Espace (L2462) | repris | — |
| 59 | replie (1529) | replie | ◀ ; ← **et Retour arrière** (L2463) | repris (◀, ←) ; **Retour arrière : pas repris** | **R19** |
| 60 | bascule (1543) | réponse verbatim / reformulée | **double-clic** sur les initiales (L654) | repris (m. `ini.ondblclick`, title « double-clic : reformulée ») | — |
| 61 | gel (1544) | gel total | « ❄ Gel » | repris (+ touche G) | — |
| 62 | zoom (1547) | taille du texte (24-52 pt) ; au dézoom, `reabsorbe` | réglette « 32 pt » (L415) | réglette : repris (`#taille`, m.L1319) ; réabsorption : tombe | R11 (effet de bord) |
| 63 | supprimeSuite (1550) | supprime une suite | confirm « Cet écran de suite est vide — le supprimer ? » (L716) ; menu | tombe | R11 |
| 64 | reabsorbe (1560) | recolle les suites | « Tout replier dans l'écran d'origine » | tombe | R11 |
| 65 | regime (1610) | écran visuel ou déroulé | — | interne (repris : `p8DiapoASchema`) | — |
| 66 | estVisuel (1614) | idem | — | interne | — |
| 67 | imagePleine (1615) | image document = plein écran | image pleine | repris (`plein-img`) | — |
| 68 | reglages (1620) | panneau Schéma / Image (L1628-1657) | formes, Un à un/Tout ensemble, Contenu, ⌖ Réordonner ; Adresse, fichier, Légende, Document analysé/Illustration, marques | schéma : repris (m.L1082) ; image : pas repris | R1 / **R21** |
| 69 | majB (1661) | modifie le bloc réglé | — | interne | — |
| 70 | calibreMarques (1664) | marques à l'échelle de l'image | — | code recopié (m.L878) mais aucune marque n'est produite | R1 |
| 71 | dessineEcran (1672) | redessine sans perdre le focus | — | interne | — |
| 72 | setForme (1677) | change la forme du schéma | boutons Carte mentale / Frise / Arbre / Cycle / Tableau | repris | — |
| 73 | setSrc (1679) | source du schéma | textarea « Contenu » | repris (`#p8-src`) | — |
| 74 | setPos (1680) | efface les positions manuelles | « ⌖ Réordonner » | repris | — |
| 75 | setRef (1681) | adresse mjpc-medias, avec un lien qui suit la frappe | champ « Adresse dans mjpc-medias » d'une image **déjà posée** | pas repris (l'adresse ne se donne qu'à la création, m.L998 ; menu image = « Supprimer l'image » seulement) | **R21** |
| 76 | setLeg (1684) | légende | champ « Légende » ; légende éditable sur l'image (L643) | repris (légende éditable en place, `img-lg data-p`, m.L863) | — |
| 77 | setSupport (1685) | Document analysé / Illustration | 2 boutons (L1646) | pas repris | R1 |
| 78 | setDev (1686) | un à un / tout ensemble (schéma ; marques) | « Un à un / Tout ensemble » ; « Marques une à une / Toutes ensemble » | schéma : repris ; marques : pas repris | R1 |
| 79 | armeMk (1687) | arme l'outil de marque | ① Point · Étiquette · → Flèche · ▭ Cadre · Légende ; puis clic sur l'image (L1690-1701) | pas repris | R1 |
| 80 | supMk (1689) | supprime une marque | ✕ dans la liste des marques | pas repris | R1 |
| 81 | repeintSch (1703) | repeint pendant qu'on tire | — | repris (`p8Redessiner`) | — |
| 82 | marquePris (1704) | bulles prises | **Ctrl+clic** = plusieurs bulles (L1716) | repris (`p8MarquePris`, ctrl/meta) | — |
| 83 | urlMedia (1752) | adresse complète mjpc-medias | « image absente de mjpc-medias · ref » (L618) | repris (préfixe à la création, m.L998) ; le message d'absence n'est pas repris (`img-vide` vide) | R21 |
| 84 | prendreImage (1753) | charge un fichier image du disque (FileReader) | `<input type=file accept=image/*>` (L1644) | pas repris (aucun `FileReader` ni `type="file"` ; la maquette refuse toute adresse non relative) | R1 (cité ; voir §3) |
| 85 | blocImg (1759) | le bloc image de l'écran | — | interne | — |
| 86 | editeMarque (1809) | écrit sur la marque, sur place | **deux appuis rapprochés** (< 380 ms) sur une marque (L1744) | pas repris | R1 |
| 87 | fin (1816) | valide le texte de la marque | perte du focus | pas repris | R1 |
| 88 | touche (1819) | Entrée valide, Échap annule (sur une marque) | **Entrée / Échap** dans une marque | pas repris | R1 (B lui attribue à tort Ctrl+B/U : §3) |
| 89 | ajoute (1832) | ajoute un bloc | + Consigne / + Fiche / + Question / + Schéma / + Image | repris (`choixObjet`, `ajouterBloc`) | — |
| 90 | uid (1856) | identifiant | — | interne | — |
| 91 | idBloc (1857) | identifiant de bloc | — | interne | — |
| 92 | memeFeuille (1864) | même feuille (par ref) | — | pas repris | R2 |
| 93 | dejaPosee (1869) | combien de fois la feuille est posée | — | pas repris | R2 |
| 94 | neuf_ (1877) | copie « neuve » ; fiche déjà posée → `rappel` | Dupliquer / Copier / Coller | copie : repris (`cloneBloc`) ; rappel auto : pas repris | R2 |
| 95 | purgeMarques (1887) | les ✍🏻 suivent le bloc | — | interne | — |
| 96 | coupeTexte (1892) | coupe un texte trop long | — | tombe | R11 |
| 97 | scinde (1903) | coupe un bloc sur une suite | — | tombe | R11 |
| 98 | degorge (1961) | reporte le trop-plein sur un écran neuf | « la fin est reportée sur un écran neuf » (L726) | tombe (remplacé par les pages) | R11 |
| 99 | nouvelEcran (1988) | insère un écran | « + Écran » (L392) | repris (`insererDiapoApres`, Ctrl+Entrée ; `nouvelleActivite`) | — |
| 100 | dansSurligne (1992) | la sélection est-elle déjà surlignée ? | **Ctrl+H sur un passage déjà surligné le retire** (L2007) | pas repris (Ctrl+H ajoute toujours du jaune, m.L1821 → `surligner`, m.L1452) | **R18** |
| 101 | forme (2004) | gras, souligné, surlignage | boutons **G** (title « Ctrl+B »), **S** (« Ctrl+U »), 4 couleurs, ✕ (L409) | surlignage 4 couleurs + ✕ : repris ; **G, S : pas repris** (0 occurrence de `bold`, `bgras`, `bsoul`, « gras » ; la maquette a une couleur de texte « A ») | **R13**, R6 |
| 102 | stylo (2044) | outil ✍🏻 | « ✍🏻 À écrire » | repris (`becr`) | — |
| 103 | cleObjet (2047) | clé de l'objet marqué | — | interne | — |
| 104 | menuEcran (2137) | menu contextuel d'une vignette ou d'une ligne du sommaire | **clic droit** sur une vignette | repris (`menuAtelierDiapo`, `menuDiapo`) ; les entrées « suite » tombent | — |
| 105 | bornes (2156) | étendue d'un groupe de suites | — | tombe | R11 |
| 106 | ctxAller (2160) | « Ouvrir cet écran » | menu | repris (« Ouvrir ») | — |
| 107 | ctxSup (2161) | « Supprimer l'écran » | menu | repris (+ Suppr dans l'atelier) | — |
| 108 | ctxSupSuite (2164) | « Supprimer cette suite » | menu | tombe | R11 |
| 109 | ctxReabs (2165) | « Tout replier dans l'écran d'origine » | menu | tombe | R11 |
| 110 | ctxDup (2166) | « Dupliquer l'écran » | menu | repris (+ Ctrl+D) | — |
| 111 | ctxVide (2173) | « Insérer un écran vide après » | menu | repris | — |
| 112 | ctxMonte (2176) | « Monter » / « Descendre » | menu | repris (+ Alt+↑↓) | — |
| 113 | selVide (2186) | vide la sélection | « Annuler la sélection » | pas repris | R5 |
| 114 | selSup (2229) | supprime les éléments sélectionnés (y compris des paragraphes de fiche, L2236) | « Supprimer les N éléments » | pas repris | R5 |
| 115 | selEcrire (2242) | marque ✍🏻 la sélection | « ✍🏻 Marquer « à écrire » » | pas repris | R5 |
| 116 | ouvrirRappel (2246) | « Pourquoi ce rappel ? » | clic sur la pastille « ↻ Rappel » (L595) | pas repris (0 occurrence de « Rappel ») | R2 |
| 117 | poseRappel (2260) | pose le motif ou le texte libre | 4 motifs + « valider ce texte » | pas repris | R2 |
| 118 | ouvrirPart (2269) | fiche d'élève : historique, 3 motifs, note | clic sur une pastille d'initiales (L779) | repris (même nom) | — |
| 119 | supPart (2298) | retire une prise de parole | ✕ « retirer » | repris (title « retirer ») | — |
| 120 | corrigePart (2299) | corrige motif et note | ✎ « corriger » | repris (même nom) | — |
| 121 | majPart (2310) | valide la correction | « valider la note » | repris (dans `corrigePart`) | — |
| 122 | allerRep (2316) | va à la réponse dans l'écran | → « se corrige dans l'écran » | repris (même title) | — |
| 123 | posePart (2318) | pose une prise de parole | « a participé / a proposé une piste / on y reviendra avec lui » | repris (même nom ; touches 1-9, m.L1382) | — |
| 124 | spot (2328) | outil ✦ | « ✦ Mettre en lumière » | repris (`blum`) | — |
| 125 | allumeTableau (2339) | pulsation au tableau (sauf gel) | — | repris (`allumer`) | — |
| 126 | allume (2345) | dix pulsations | — | repris (`allumer`, m.L1316) | — |
| 127 | ferme (2383) | ferme le menu contextuel | clic ailleurs | interne | — |
| 128 | sousTab (2384) | étape ou réponse visée | — | interne | — |
| 129 | csSup (2386) | « Supprimer cette étape / réponse » | clic droit sur une étape ou une réponse | repris (`e-supprimer` ; Échap sur un élément vide, m.L1213) | — |
| 130 | csDup (2388) | « Dupliquer » une étape | idem | repris (`e-dupliquer`) | — |
| 131 | csMove (2389) | « Monter / Descendre » une étape | idem | repris (`e-monter/descendre`) | — |
| 132 | cbSup (2391) | « Supprimer ce bloc » | clic droit sur un bloc | repris (`b-supprimer`) | — |
| 133 | cbDup (2393) | « Dupliquer » le bloc | idem | repris (`b-dupliquer`) | — |
| 134 | cbMove (2394) | « Monter / Descendre » le bloc | idem | repris (`b-monter/descendre`, Alt+↑↓) | — |
| 135 | cbCopie (2396) | « Copier » | idem | repris (`b-copier`) | — |
| 136 | cbColle (2397) | « Coller ici » | idem | repris (`b-coller`) | — |
| 137 | cbCoupe (2401) | « Couper » | idem | repris (`b-couper`) | — |
| 138 | selCopie (2404) | copie la sélection | « Copier » du lasso ; **Ctrl/Cmd+C** (L2445) | pas repris | R5 |
| 139 | selCoupe (2407) | « Couper » du lasso | menu du lasso | pas repris | R5 (non cité) |
| 140 | selCopie2 (2408) | coupe la sélection | **Ctrl/Cmd+X** (L2446) | pas repris | R5 (non cité) |
| 141 | loupe (2413) | ouvre / ferme la fiche (animation de sortie) | clic sur une fiche | repris (`fermerFiche`, `ecran-sortie`) | — |
| 142 | fermeLoupe (2427) | « ✕ refermer la fiche » | bouton (L680) | repris (Échap ferme la fiche, m.L1817) | — |
| 143 | corpsFiche (2428) | la feuille recouverte de la couche d'annotation `ANNOT` | fiche annotée en classe | pas repris (0 occurrence de `ANNOT`/`annot`) | **R14** |
| 144 | ficheHTML (2433) | la fiche en page A4 | la fiche ouverte au pilote | repris (`f-tab`/`f-page`, m.L837), sans annotation | R14 |
| 145 | scrollFiche (2437) | le défilement du pilote suit au tableau | faire défiler la fiche | repris autrement (pages ; A : « la page de fiche ») | — |
| 146 | deborde (2473) | mesure le débordement | — | tombe (pages) | R11 |
| 147 | verifDeborde (2482) | report automatique pendant la frappe | — | tombe | R11 |
| 148 | majVignette (2495) | la vignette suit la frappe | — | repris (`miniatures`) | — |
| 149 | quiParle (2505) | modale « Qui a participé » | « 👥 Qui a participé » | repris (`basculerQui`, Maj+P) | — |
| 150 | peintQui (2510) | peint la modale (« il reste N élèves à passer ») | — | repris (même texte) | — |
| 151 | tableau (2527) | ouvre la fenêtre du tableau, écran d'attente horloge/date | « ⧉ Ouvrir le tableau » | repris (`bvideoproj` ; écran d'attente à la clôture) | — |
| 152 | cale (2620) | taille du texte au tableau | — | interne (repris `policePx`) | — |
| 153 | envoie (2624) | point de sortie unique (gel) ; fiche bloc à bloc (L2633-2644) ; chrono (L2658-2660) | — | repris (`pousser`) sauf fiche bloc à bloc (R14) et minuteur (R3) | R3, R14 |
| 154 | ong (2664) | onglets | Sommaire · Documents · Déroulé · Relecture · Papier (L386-392) | Déroulé, Relecture : repris ; Sommaire, Documents : R12 ; **Papier : pas repris** | R12 / **R16** |
| 155 | affiche (2671) | affiche mm:ss et l'envoie | champs `#cmin` `#csec` | pas repris | R3 |
| 156 | regleChrono (2673) | règle le minuteur | saisie mm:ss | pas repris | R3 |
| 157 | chrono (2674) | Départ / Pause, compte à rebours | « Départ » / « Pause » ; « Chrono au tableau » (L418-419) | pas repris (« Chrono au tableau » de la maquette pose un bandeau fixe « ⏱ 07:00 », m.L1459 : `S.bandeau = S.bandeau ? '' : '⏱ 07:00'`) | R3 |

Certaines lignes sont mixtes : une fonction peut servir un geste repris et un geste qui ne l'est pas. Les deux sont alors indiqués.

## 2. Gestes qui marchaient, absents de la maquette ET absents de B (R1-R12)

| | le geste | où il vit | preuve dans deroule97 | dans la maquette (recherche faite) | territoire |
|---|---|---|---|---|---|
| **R13** | **Gras et souligné à la souris** : boutons **G** et **S** de la barre (le pendant à la souris de R6) | `forme` (2004) | L409 `<button id="bgras" onclick="forme('bold')" title="Ctrl+B"><b>G</b></button><button id="bsoul" onclick="forme('underline')" title="Ctrl+U">` ; L2011 `else document.execCommand(q);` | **rien** : 0 occurrence de `bold`, `bgras`, `bsoul`, `>G<`, « gras ». La barre a « A » (couleur du texte, m.L321 « Texte en rouge/vert/bleu/or ») et le surligneur. De plus, `ecrireDansDiapo` enregistre `el.textContent` (m.L1202), donc un gras natif du navigateur serait perdu. La table A dit pourtant « repris » (§3). | E1 |
| **R14** | **La fiche ouverte se pilote comme un écran** : ▶ la dévoile bloc à bloc, au pilote (grisé) comme au tableau (masqué) ; ✍🏻 sur un paragraphe ; elle est éditable et surlignable en classe dans une **couche d'annotation par classe** (`ANNOT`), la feuille restant propre ; « tu la prépares — la classe ne la voit pas encore » tant que le bloc n'est pas dévoilé ; le lasso peut y supprimer un paragraphe | `rendre` (677-699), `elems` (1470-1477), `marqueFiche` (558), `lire` (1434-1440), `corpsFiche` (2428), `envoie` (2633-2644), `selSup` (2236-2237) | L1471 `/* fermée, la fiche est UN objet (un seul cran) ; ouverte, elle se dévoile par ses blocs */` ; L696 `if(kc>=vus)el.classList.add('apres');` ; L2643 `if(kc2>=vus){ el.style.display='none'; …` ; L1439 `if(b)ANNOT[idBloc(b)]=cp.innerHTML;` ; L682 `'tu la prépares — la classe ne la voit pas encore'` | la fiche s'affiche **entière** : m.L837 rend tous les `b.el` dans `f-page`, sans `data-k` ni état ; `elements()` (m.L814) n'a pas de branche fiche ; 0 occurrence de `ANNOT`/`annot` ; 0 occurrence de « la classe ne la voit pas » | E3 (au tableau) ; E1 pour la couche dans le rendu commun |
| **R15** | **Le récit cite ce qui a été surligné et marqué « à recopier »** : « …, où on a surligné « … » ; « … » » et « On a recopié dans le cahier : « … » » ; les fragments voisins sont recollés, les titres d'encadré seuls sont écartés, une citation n'est jamais répétée | `citations` (1204), `lisible` (1197), appel dans `majVues` (1297-1303) | L1302 `if(sur.length)s2+=', où on a surligné '+sur.slice(0,3).join(' ; ');` ; L1303 `if(cop.length)s2+='. On a recopié dans le cahier : '+cop.slice(0,3).join(' ; ');` | **rien** : « surligné » n'apparaît que dans la table `VERBES` ; `d.surl` et `d.ecr` ne servent qu'au rendu et au journal (`journal('surligne'…)`, m.L1452 ; `journal('ecrire'…)`) ; aucune fonction du récit (`relecture`, `recitHtml`, `narrativiser`) ne lit ces événements | E4 |
| **R16** | **L'onglet Papier** : ce qui s'imprime pour le cahier, en A4 : le récit (« Ce qu'on a fait aujourd'hui · À relire — date ») puis **toutes les fiches de la séance dans leur version annotée par la classe**, chacune marquée « à coller dans le cahier » | `majVues` (1387-1406), `ong('papier')` ; bouton L391, vue L452-456 | L1404 `+'<div class="a4-coller">à coller dans le cahier</div></div>');` ; L1402 `/* toutes les fiches, dans leur version ANNOTÉE par la classe */` | **rien** : 0 occurrence de « à coller », `window.print`, `@media print`, `A4` ; « Papier » n'apparaît que dans `pressePapiers`. R12 ne couvre que Sommaire et Documents | E4 |
| **R17** | **Ctrl/Cmd+V colle les blocs copiés** à la fin de l'écran, sans passer par le menu (hors saisie) | `keydown` anonyme (2448-2453) ; `neuf_` | L2448 `if((ev.ctrlKey\|\|ev.metaKey)&&ev.key.toLowerCase()==='v'&&!ed&&presse){` ; L2451 `lot.forEach(function(b){ ECRANS[i].blocs.push(neuf_(b)); });` | **rien au clavier** : le seul `paste` (m.L1197) colle du texte dans les notes. Le menu de bloc affiche « Copier · Ctrl + C » et « Couper · Ctrl + X » (m.L992) **sans gestionnaire clavier** (aucun `=== 'c'`/`'x'`/`'v'`). « Coller ici » existe au menu | E1 |
| **R18** | **Ctrl+H bascule** : sur un passage déjà surligné, Ctrl+H retire le surlignage | `forme` (2004-2010), `dansSurligne` (1992) | L2007 `if(couleur===null\|\|(dansSurligne()&&couleur===undefined)){` ; L2457 `if(k==='h'){ev.preventDefault();forme('hilite');return;}` | Ctrl+H appelle toujours `p8Former('surl','jaune')` (m.L1821) et `surligner` ajoute toujours (m.L1452 `if (couleur) d.surl.push(…)`) ; on ne retire qu'avec ✕ de la palette | E1 |
| **R19** | **Retour arrière (⌫) = ◀ replier** au pilotage (hors saisie) | `keydown` anonyme (2463) → `replie` | L2463 `if(ev.key==='ArrowLeft'\|\|ev.key==='Backspace'){ev.preventDefault();replie();}` | 0 occurrence de `Backspace` ; seul ← replie (m.L1825) | E2 |
| **R20** | **Les raccourcis marchent aussi avec Cmd (Mac)** : Z, C, X, V, B, U, H | `keydown` anonyme (2442-2457) | L2442 `if((ev.ctrlKey\|\|ev.metaKey)&&ev.key.toLowerCase()==='z')` ; L2454 `if(ed&&(ev.ctrlKey\|\|ev.metaKey))` | le clavier global teste `ev.ctrlKey` seul : Ctrl+Z, Ctrl+H (m.L1820-1821), Ctrl+D, Ctrl+Entrée (m.L1642) ; `metaKey` n'apparaît que 3 fois (Ctrl+clic des bulles, Ctrl+Z du VIF) | E1 |
| **R21** | **Changer l'adresse d'une image déjà posée**, avec le lien qui suit la frappe (ouvrir l'image pour vérifier) et, au pilote, le message « image absente de mjpc-medias · ref » | `reglages` (1642-1643), `setRef` (1681), `urlMedia` (1752), `html` (618) | L1642 `h+='<label>Adresse dans mjpc-medias</label><input value="'+(b.ref\|\|'')+'" oninput="setRef(this.value)">';` ; L1683 `a.innerHTML=v?('<a href="'+urlMedia(v)+'" target="_blank">'…` ; L618 `'image absente de mjpc-medias · '+(b.ref\|\|'')` | l'adresse ne se donne qu'à la création (`formulaireObjet`, m.L998) ; menu d'une image : « Image · bloc n », « Supprimer l'image » (m.L989-992) ; `img-vide` est vide (m.L863) | E1 |

Gestes relus et rangés « repris sous une autre forme », donc non numérotés :
- glisser une vignette (L2070-2108) ou un bloc par sa bordure (L2014-2041), glisser une étape ou une réponse dans son bloc (L2036-2038) : la maquette n'a **aucun glisser** (0 `draggable`, 0 `dragover`), mais elle a Monter/Descendre au menu, Alt+↑↓ et la barre de bloc haut/bas ;
- Échap qui désélectionne les bulles (L1828) : la maquette les désélectionne d'un clic à vide.

## 3. Points de la table existante qui paraissent faux ou imprécis

**Dans B**
1. **R6 : « moteur : `touche` »** est faux. `touche` (L1819) est la fonction interne d'`editeMarque` : elle gère Entrée et Échap sur une marque d'image. Ctrl+B et Ctrl+U sont dans le `keydown` anonyme, L2454-2456. R6 dit aussi « les boutons G, S existent » : c'est **faux dans la maquette p8-5g** (voir R13).
2. **R3 : « « Chrono au tableau » publie ce chrono-là (l'heure écoulée) »** est imprécis. Dans la maquette, l'action `chrono` pose un bandeau **fixe** `'⏱ 07:00'` (m.L1459) : il ne publie ni l'heure écoulée ni un compte à rebours. Le reste de R3 est juste.
3. **R1 : « aucun code ne les pose ni ne les rend »** est vrai pour la pose et la production des marques, mais **le CSS des marques et leur calibrage sont recopiés** (CSS `.mk-pt/.mk-et/.mk-fl/.mk-cd/.mk-lg`, et m.L878, qui est `calibreMarques`). C'est du code qui ne s'exécute sur rien. R1 cite aussi `prendreImage`, qui ne touche pas aux marques : c'est **l'import d'une image depuis le disque** (`input type=file`, FileReader, L1644, L1753-1758), que la maquette n'a pas et qu'elle exclut par doctrine (adresse relative seulement, m.L998). R1 ne nomme pas les sous-gestes qui existaient : déplacer une marque (L1740-1749, L1799-1802), redimensionner un cadre par ses 4 poignées (L1727-1730, L1791-1795), tirer les bouts d'une flèche (L1732-1738), Suppr qui supprime la marque choisie (L1829-1830) et Échap (L1828). Dans la maquette, **Suppr dans l'atelier supprime la diapo entière** (m.L1642). Le même geste aura deux sens à arbitrer.
4. **R5 : la liste des fonctions est incomplète.** Il manque `selCoupe` (2407) et `selCopie2` (2408), le menu « Couper » du lasso (L2223), les raccourcis Ctrl/Cmd+C et Ctrl/Cmd+X sur la sélection (L2443-2446) et le lasso lui-même, qui est un gestionnaire anonyme (L2187-2228).
5. **R7 : « où il vit : pont `atVecu*` »** oublie que le moteur le fait déjà. « Où on en est » avec `vus/tot` par activité (les suites cumulées), la pastille `ici`/`montre` et le clic qui y va sont dans `rendre`, L753-769 : `+(tot?' <span …>'+vus+'/'+tot+'</span>':'')`. Côté maquette, l'état worktrack par activité (`dur-e`) et « x min passées sur y prévues » existent (m.L1233-1238) : la partie « réel/prévu » est donc en partie présente.
6. **R8** : la maquette affiche déjà « N min prévues / 50 utiles » et « l'heure dépasse de N min » dans « Où on en est » (m.L1234). Le 50 est fixe. Le reste de R8 (début proposé, garde au lancement) n'a pas été vérifié ici : ce sont des fonctions du pont.
7. **R11 : « `zoom` »** mélange deux choses. Dans deroule97, `zoom` est la réglette de taille du texte (L415, L1547). Son geste visible est **repris** dans la maquette (`#taille`, m.L1319). Seul son effet de bord, `reabsorbe`, tombe.
8. **R7, R8, R9, R10, R11 (`_drRefusionner`)** citent des fonctions du pont ou de la session (`atVecu*`, `AT_DR_VECU`, `atVecuAfficher`, `atTempsUtile`, `atDebutPropose`, `atDrMajUtile`, `atDrJouerClic`, `_drEmpreinteTrame`, `_drVerifier`, `sesTel*`, `_drRefusionner`). **Aucune n'existe dans deroule97** : 0 occurrence de `atVecu`, `_dr`, `sesTel`. Ce n'est pas une erreur, B les dit « pont » ou « session », mais elles ne sont pas vérifiables avec ce fichier.
9. **En-tête de la table : « `deroule86` …, 157 fonctions »** est faux. deroule86 en a **156**, et deroule97 en a 157 (il ajoute `etat`, L804 ; c'est la seule différence dans la liste).
10. **R12** ne couvre que Sommaire et Documents. Le cinquième onglet, **Papier**, n'est couvert nulle part : voir R16.

**Dans A, parce que cela touche B**
- « **gras / souligné (les boutons G, S — p8-5c, K3)** » : **absent de la maquette p8-5g** (voir R13). 0 occurrence de `K3`, `bold`, `bgras`, `bsoul`.
- « **réordonner (poignée)** » : la maquette n'a aucun glisser-déposer de diapos. Ses `.poignee` règlent la largeur des colonnes (m.L947) et la hauteur de la diapo (m.L1500). On réordonne par le menu Monter/Descendre et par Alt+↑↓.
- « **« Chrono au tableau » (menu ⋯, en bandeau)** » : c'est un bandeau fixe « ⏱ 07:00 » (voir le point 2).
