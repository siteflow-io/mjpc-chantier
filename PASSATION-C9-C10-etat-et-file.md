# PARTIE III — L'ÉTAT DE PRODUCTION, VÉRIFIÉ
| | |
|---|---|
| version servie | **v8.67.0**, commit `3a4dfbf` |
| md5 | **`9968969807aae52052ca0e6254d3daf9`** — 1 490 154 octets |
| vérification | **bit à bit au moment de la promotion** |
| retour possible | v8.66.0 `8f8a7ecebdcd918777cbd645e3150d57` · v8.65.1 `85a6c75946dd002327b36114090c2eb7` |

**Ton premier geste** : re-télécharger `index.html` et vérifier md5 + taille. Si ça diffère, **STOP** et dis-le à Paul.
*Piège vécu* : l'API GitHub renvoie l'empreinte du **fichier**, pas du commit — elle n'est pas utilisable comme
référence de restauration. Restaure depuis la **version** et son md5.

## Ce qui a été promu aujourd'hui (7 promotions, 1 restauration)
- **8.61.0** — le chargement de trame : normalisation aux 6 portes (des consignes sans `etapes` faisaient lever le
  rendu et bloquaient le chapitre de Paul), ceinture, jeton porteur du contenu, position de colonne conservée,
  création de chapitre confirmée, libellés écrits par le pont.
- **8.62.0** — téléphone (palette qui ne disparaît plus, chrono, « à écrire », focus sur les initiales), vue tableau
  ouverte **par bouton** au patron du QCM, **le tableau survit à la déconnexion du pilote**, injection de chapitre
  réparée (détection des jumeaux, voies Compléter / Remplacer / Créer un double). *La suspension du zoom a été
  retirée avant promotion, sur ordre de Paul.*
- **8.63.0** — **la trace de l'heure** : le vécu unique devient une collection `heures/<jour_créneau>`, écrite au fil
  de l'eau ; une relance dans le même créneau reprend la trace.
- **8.64.0** — **l'identité des écrans** : posée en un point de passage, les fils du zoom portent celle du père et
  meurent au dézoom ; les cinq consommateurs cessent de parler en rangs (11 modifications annoncées à la clôture,
  dont 10 fausses → 1 vraie).
- **8.65.1** — clôture sûre (un seul état de vérité pour « une heure tourne »), bannière qui se retire, fils du
  redimensionnement réabsorbé, duplication avec identité neuve, tableau qui ne montre jamais plus que ce qui est
  dévoilé **+ mon micro de position** (faute ⑤).
- **8.66.0** *(première tentative)* — abandonnée et **restaurée** : elle cassait l'ordre des suites et rendait la
  frappe saccadée.
- **8.66.0** *(seconde)* — ordre des écrans de suite.
- **8.67.0** — **l'ordre du CONTENU dans la cascade** : il n'était pas seulement inversé mais mélangé
  (`E1 E6 E3 E2 E5 E4`), et **le désordre survivait au dézoom**, donc s'inscrivait dans la préparation de Paul.

## L'inventaire de l'atelier — fait, verdict : **l'atelier va**
Mesuré sur la production, par le parcours réel : entrée · éditeur · 4 onglets · les 5 types de blocs · dupliquer,
déplacer, supprimer, **annuler** · gestes d'écran · identités sans doublon · dévoilement · navigation · **récit** ·
**les 2 boutons École Directe** · **liasse 7 pages**. Zéro erreur de page.

---

# PARTIE IV — CE QUI ATTEND, PAR ORDRE
### Ce qui ne dépend que de Paul (dis-le-lui, ne le fais pas à sa place)
1. **É4** : le message-réponse `oral` à coller pour finir son chapitre 3e → audit chapitre → publication S1.
2. **M17a** : purger les classes 2025-2026, importer les quatre réelles (3e Aretha Franklin, 3e Bob Dylan,
   4e Hugo, 4e Turing) + la classe test, codes et liens.

### Les lots
3. **La mise en page de la vignette de groupe** — vu sur capture pleine page : la vignette du père **empiète** sur
   le bas de l'étiquette « sur plusieurs écrans », et la première ligne de consigne **déborde à droite**.
4. **Le VIF au téléphone** — dernier morceau du LOT B, jamais livré. Paul l'a exigé deux fois : le téléphone doit
   avoir **les mêmes fonctions qu'en classe**. Le VIF **existe** au pilotage ordi : champ d'initiales, liste qui se
   réduit à chaque lettre, ouverture automatique dès qu'un seul candidat reste, motifs 1/2/3, Ctrl+Z. **Le porter,
   pas en inventer un autre** — la n°9 a écrit « liste dense » dans un mandat, l'exécutant a livré des cartes, Paul
   a refusé.
5. **La pulsation seule + la fusion des paroles successives** — ce que Paul a gardé du lot abandonné : la pulsation
   du dernier mot (une couleur, dix secondes, saute au mot suivant), **sans recomposer le champ** (c'est ce qui
   rendait la frappe saccadée) ; et **deux prises de parole successives du même élève comptent pour une seule
   réponse**.
6. **M-SÉCU** — la plus grave de toute la file : le hub est ouvert **en écriture anonyme à la racine**, sur des
   données d'élèves. Écrit « avant la rentrée » depuis trois passations. + les 6 apps + M-SÉCU-4 + étanchéité des jetons.
7. **Le chantier PROMPTS** — Paul prépare **trois documents** issus de la création de son chapitre 3e ; ils seront
   la base des champs à créer. **Ne touche pas aux prompts avant de les avoir lus.** Défauts connus : `etapes` non
   imposé à vide, `pic` jamais demandé, `ref`/`src` désalignés — **déjà neutralisés** par la normalisation du LOT A,
   donc ce n'est pas urgent, c'est de l'hygiène.
8. **Le bloc bilan** — il n'existe ni au prompt (5 types seulement) ni au moteur, alors que le cadrage du 19/08 en
   fait l'acte de clôture de la séance. Sans lui, le rituel décidé n'a aucun support.
9. **Le temps réel** — tranché par Paul le 23/08 : remplacer l'interrogation toutes les 900 ms par une écoute.
   Jamais fait. C'est la latence qu'il constate entre ses appareils.
10. **C3b — le profil de classe** : la boîte générale (déroulé joué **et** statistiques, pendant du profil élève).
    Sa matière est **déjà au hub** et n'est lue nulle part. Cadrage au sas : `PONT/LOT-C-CADRAGE.md`.

---

