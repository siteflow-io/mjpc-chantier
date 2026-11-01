# Le sticker, un objet du sujet — proposition de cadrage (conscience n°14, 01/11/2026)

Demande de Paul (01/11 07:59) : « La grille de stickers doit être évidemment modifiable et attachée à un sujet. À placer dans les paramètres. Un sticker est un objet, et il se rattache à un descripteur dans la grille d'évaluation ou un sous-descripteur, et à une compétence et à la taxo. Que proposes-tu ? Je veux une proposition complète et solide. » ; 08:01 : « Et c'est aussi le moment de réorganiser et voir ce qui tombe dans les fonctionnalités précédentes. »

Rien n'est codé. Chaque point numéroté se valide ou se change par son numéro.

**Mesuré avant d'écrire (code et site, en lecture seule).**
- Le sujet au site (`config`) porte déjà sa grille d'évaluation : critères → lignes notées (« indicateurs » : libellé, poids, compétences) → pour chaque ligne, quatre textes de niveau (« descripteurs ») et, pour chaque niveau, des phrases avec ou sans citation (« sous »).
- La grille des scans (`config/grille2`) en est une seconde, à côté : points, 51 questions, cases.
- La taxonomie au hub est celle d'Eduscol : 7 domaines, 51 familles, 210 notions aux identités stables, et les compétences du cycle 4. Elle a une table de correspondances par app, déjà utilisée par la dictée, avec un statut « proposé » / « validé ».
- Les onglets de la rédaction (Pilotage / Données / Réglages) sont ceux de la correction de dictée. Ses Réglages ont déjà un éditeur des textes que lisent les élèves.

## 1. Ce que ça change pour la classe

Paul ne note plus une grille. Il pose des stickers de réussite, que l'IA a déjà proposés : la grille se remplit seule. L'élève lit ce qu'il a réussi, sur sa copie et dans sa grille, puis « Pas encore réussi : … » (acquis le 30/10). Chaque sticker rattache sa réussite à une compétence du socle et à une notion de la taxonomie. Le bilan de la classe et le profil de chaque élève se remplissent sans geste de plus.

## 2. Les mots

1. **La grille d'évaluation** du sujet : ses **critères** (« Le thème et l'invention », 14 points), et dans chaque critère ses **descripteurs** = les lignes notées (« Le thème tenu », 6 points, compétence c4-ecrire-01).
2. **Un sous-descripteur** = une partie d'une ligne, qui regroupe des stickers quand la ligne en a beaucoup (dans « Les trois paragraphes » : « où tu es », « le plus dur », « l'inquiétude »). Il n'a pas de points à lui : la ligne compte tous ses stickers.
3. **Un sticker** = un seul fait réussi, que l'élève retrouve sur sa copie. Il appartient à une seule ligne, et au plus à un sous-descripteur de cette ligne.
4. Les anciens « descripteurs » (les quatre textes de niveau, avec « {prenom} ») et les anciennes phrases par niveau (« sous », avec ou sans citation) ne sont plus lus par l'élève : voir 9.

## 3. L'objet sticker (au site, dans le sujet : `redactions/<sujet>/config/stickers/<id>`)

| Champ | Ce que c'est | Exemple |
|---|---|---|
| `id`, `creeLe`, `modifieLe`, `version` | identité interne et horodatage, jamais vus par l'élève (règle de Paul) | `stk_mvx…`, version 3 |
| `texteEleve` | **ce que l'élève lit**, validé par Paul | « Tu dis d'où tu écris : du front ou de la maison. » |
| `cherche` | **ce que l'IA cherche**, en mots de prof (repris des 51 questions) | « Le personnage dit-il s'il écrit du front ou de la maison ? » |
| `portee` | un passage, ou *toute la lettre* (posé à la fin, seulement si rien ne le contredit, acquis C14 1587) | `passage` |
| `ligne` | **le descripteur** (la ligne notée) | `theme_tenu` |
| `sous` | **le sous-descripteur** (facultatif) | `ou-tu-es` |
| `competence` | une compétence du socle (taxonomie du hub) ; par défaut, celle de sa ligne | `c4-ecrire-01` |
| `taxo` | une ou deux notions (ou une famille, faute de notion) de la taxonomie | `fam-42` (Énonciation) |
| `ordre` | sa place dans la bande et dans la grille de l'élève | 2 |
| `etat` | `a-valider` / `valide` (le mot de Paul) / `range` | `valide` |
| `variantes` | les variantes du sujet où il vaut (toutes, par défaut) | — |

La ligne porte, en plus de ce qu'elle a déjà (titre, poids, compétences, barème), **son compte** : combien de stickers donnent quel niveau. Par défaut, le compte unique de la proposition (tous : niveau 3 ; un manque : 2 ; deux ou trois : 1 ; au-delà : 0), réglable ligne par ligne. Le barème de la ligne donne les points de chaque niveau, comme aujourd'hui.

## 4. Où et comment il s'édite : Réglages → « La grille et ses stickers »

5. L'onglet Réglages remplace son tableau en lecture seule par un éditeur, sur toute la largeur, en trois colonnes :
   - **à gauche, la grille en arbre** : critères, lignes (avec poids et compétence), sous-descripteurs ; sur chaque ligne, son compte en direct (« 6 stickers : 6 → 6 pts ; 5 → 4 ; 3-4 → 2 ; moins → 0 ») ;
   - **au centre, les stickers de la ligne choisie**, en cartes : le texte élève et ce que l'IA cherche s'écrivent en place, glisser change l'ordre ou la ligne ;
   - **à droite, les rattachements du sticker choisi** : la ligne, le sous-descripteur, la compétence (liste du cycle 4, avec son libellé élève), la taxonomie (un champ de recherche sur les 210 notions et 51 familles, libellés prof et élève, et l'exemple de la notion), l'aperçu « comme l'élève le lit », et « ✓ Je valide ».
6. Les gestes, tous par bouton, chacun avec son infobulle : « ＋ Un sticker », « ⧉ Dupliquer », « ↑ ↓ », « 🗑 Ranger » (passe par la corbeille MJPC), « ＋ Un sous-descripteur », « Reprendre les stickers d'un autre sujet » (une copie, rattachements compris). Toute modification s'enregistre au geste et se voit partout sans recharger (abonnement au site).
7. **Un sujet est prêt pour la bande** quand chaque sticker actif est validé et rattaché à sa ligne, à une compétence et à la taxonomie. Sinon, le bouton de l'envoi à l'IA est grisé et dit ce qui manque (« 3 stickers sans notion de la taxonomie »).
8. **Une notion qui manque à la taxonomie** (le sticker ne trouve rien de juste) : le sticker se rattache à la famille la plus proche et la notion manquante part en proposition dans la table de correspondances « redaction », avec le statut « proposé » (le même chemin que la dictée). Tu la valides dans le panneau de la taxonomie.

## 5. Les règles

9. **Une modif change partout** : le texte d'un sticker corrigé se lit aussitôt dans la bande, la grille de l'élève, le bilan. Les fichiers École Directe déjà téléchargés restent comme ils étaient : il faut les refaire.
10. **Les notes ne bougent jamais seules** (règle ⑨). Si un changement (compte d'une ligne, poids, sticker déplacé ou rangé) change la note de copies déjà corrigées, l'app les liste, avec leur note avant et après, et n'applique qu'à ton « Appliquer ».
11. **Rien ne se perd** : un sticker déjà posé sur des copies ne s'efface pas ; rangé, il ne se propose plus, et il reste sur les copies où il est posé. Chaque sticker posé garde la version qu'il avait.
12. **Une nouvelle version lit toutes les anciennes copies** : les copies corrigées avec les 51 questions gardent leur grille et leur note. Une copie passe aux stickers seulement sur ton geste, avec sa note avant et après.

## 6. L'IA et la bande (le contrat : un seul envoi par copie)

13. L'envoi à l'IA porte, en plus de la correction, la liste des stickers validés (identité, ce que l'IA cherche, portée). L'IA rend, pour chaque copie, les stickers trouvés et le passage qui le prouve.
14. La bande s'arrête, après les fautes, à chaque sticker proposé, le passage encadré sur la photo. Entrée : gardé. N : non. Le compte de la ligne et les points se voient en direct (Paul, 30/10 15:17). En mot par mot (⇧R), le bouton « ＋ Un sticker ici » pose, sur le mot où tu es, un sticker que l'IA n'a pas vu : la liste des stickers de la grille s'ouvre, on choisit au pavé numérique comme les formes de la dictée (un geste rare passe par un bouton, jamais par une touche).

## 7. L'élève

15. Sur sa copie : chaque sticker réussi souligne ou encadre son passage, dans la couleur de son critère ; au survol ou au clic, son texte (acquis le 30/10 : couleur sans nom, lien vers le détail).
16. Dans sa grille : pour chaque ligne, son niveau et ses points, ses stickers réussis, puis « Pas encore réussi : … » (le texte des stickers qui manquent) ; la règle écrite en tête de son fichier (acquis 1546-1547).

## 8. Le bilan et le profil

17. L'onglet Bilan compte, pour chaque élève et pour la classe : les stickers par ligne, par compétence et par notion de la taxonomie, avec les fautes de la langue (rattachées par la table de la dictée, 346 « ok »). Les réussites et les fautes vont au profil de l'élève (`mjpcProfils`, alimenté, jamais lu : la dette 9 du registre s'en sert).

## 9. Ce qui tombe, ce qui se recycle

| Aujourd'hui | Devient |
|---|---|
| Les 51 questions de la grille des scans | **recyclées** : elles deviennent le « ce que l'IA cherche » des stickers |
| Les cases de la grille des scans (niveaux par nombre de oui) | **remplacées** par le compte de chaque ligne |
| Les quatre passes de l'écran des scans (la langue, puis trois critères), avec leurs questions oui / non | **rangées** pour les nouvelles copies : il reste « Recopier » et « La bande » (fautes, puis stickers). Elles restent lisibles pour les copies déjà corrigées ainsi |
| Le pinceau des scans (souligné, surligné, encadré, trait de marge, « la forme vient avec la question ») | **rangé**, car il servait les questions. Restent la faute à la main et la remarque |
| Le pinceau doré (« la phrase qui t'a touché ») | **remplacé** par « ★ La phrase qui m'a marqué », à la fin de la recopie (1.4.12) |
| Les quatre textes de niveau d'une ligne (« descripteurs » avec {prenom}) et les phrases par niveau (« sous ») | **rangés** : l'élève lit ses stickers et « Pas encore réussi », plus ces paragraphes. Ils restent dans le sujet, lisibles pour les anciennes copies |
| « À reprendre » d'une case (la tâche) | **remplacé** par « Pas encore réussi : … » |
| La question à l'élève d'une ligne (« Relis le début de ta lettre… ») | **gardée** pour la correction par l'élève, au second temps |
| « Préparer le sujet » (valider les phrases de la grille, une ligne par écran) | **recyclé** : il valide les stickers, une ligne par écran, avec leurs rattachements |
| Le tableau en lecture seule des Réglages | **remplacé** par l'éditeur (4) |
| Le compteur d'orthographe et ses seuils | la ligne « Orthographe et grammaire » garde son calcul (fautes par ligne, depuis la bande) ; ses seuils se règlent dans l'éditeur |
| La ligne « Trente lignes » | **gardée**, calculée seule sur la recopie |
| Le récapitulatif d'une copie (note, grille, bilan écrit par l'app) | **gardé**, calculé depuis les stickers |
| La maquette `stickers.js` (T417, état du 30/10 13:54) | **tombe** (c'était un outil pour montrer) |
| Le prompt de création d'un sujet (`PROMPT-REDACTION.md`, format `mjpc-redaction-sujet/1`) | **à réécrire** : un sujet neuf arrive avec ses lignes, ses stickers et leurs rattachements (format `/2`) ; un sujet `/1` se lit toujours |

## 10. La reprise du sujet d'aujourd'hui (la lettre de la Grande Guerre)

Les 43 stickers de la proposition (`GRILLE-STICKERS-PROPOSITION.md`) entrent dans l'éditeur à l'état « à valider ». Chacun a sa ligne, sa compétence (celle de la ligne), ses notions proposées ci-dessous, et son « ce que l'IA cherche » repris de la question correspondante. ⚑ marque une notion qui manque à la taxonomie : elle part en proposition (8).

| Ligne (compétence) | Stickers | Notions proposées |
|---|---|---|
| Le thème tenu (c4-ecrire-01) | S1, S3 | fam-42 Énonciation et voix narrative |
| | S2, S4, S5 | fam-43 La construction du récit |
| | S6 *(toute la lettre)* | fam-43, ⚑ « cohérence avec l'époque » |
| Les trois paragraphes (c4-ecrire-02) | S7, S8, S9, S10, S11, S13 | fam-43 La construction du récit |
| | S12 | fam-15 Types et formes de phrase (l'interrogation) |
| Les lectures reprises (c4-ecrire-03) | S14, S15, S16 | fam-41 Genres et formes littéraires, ⚑ « réinvestir une lecture » |
| Ce qu'on tait (c4-ecrire-01) | S17 à S20 | fam-42 Énonciation, ⚑ « l'implicite » |
| Toutes les phrases sont complexes (c4-langue-04) | S21, S22, S23 | fam-16 Phrase simple et complexe |
| Les cinq architectures (c4-langue-04) | S24 à S30 | fam-16 Phrase simple et complexe |
| Modalisation et litote (c4-langue-04) | S31 | fam-42 Énonciation (la modalisation) |
| | S32, S33 | fam-45 Les figures de style |
| Les codes de la lettre (c4-ecrire-01) | S34 à S37 | fam-41 Genres et formes littéraires (la lettre) |
| La 1re personne et le destinataire (c4-ecrire-01) | S38, S39 | fam-42 Énonciation |
| | S40 | fam-29 Concordance des temps |
| Lexique (c4-langue-03) | S41 | fam-39 Niveaux de langue |
| | S42 | fam-33 Synonymes et antonymes |
| | S43 | fam-40 Champ lexical |

## 11. L'ordre de codage proposé (après ton mot sur 2 à 17)

1. L'objet, son enregistrement au site, l'éditeur des Réglages, la reprise des 43 stickers à l'état « à valider ».
2. La validation (« Préparer le sujet » recyclé), le sujet prêt pour la bande.
3. L'envoi à l'IA et la bande des stickers, le compte en direct.
4. Le fichier de l'élève et le Bilan.
5. Ranger les passes et le pinceau pour les nouvelles copies.
6. Le prompt de création d'un sujet au format `/2`.
Chaque morceau passe au banc entier et au vrai site en lecture seule, comme cette nuit.
