# L15.1a — l'analyse des erreurs, À BLANC (rien n'est changé dans l'app ni au hub)

*Calculé le 05/10 par le moteur de L15.1 (`analyse_l151.js`, joint) sur les copies du hub, lues en lecture seule. Aucun nom : les copies sont numérotées dans l'ordre de leurs clés. Seules les erreurs G, L et C **avec recopie** ont un écart à analyser (sans recopie : le commentaire honnête par type, comme aujourd'hui).*

## Ce que tu fais ce soir
1. **Les commentaires par catégorie** (tableau 2) : ce sont mes propositions ; réécris-les dans tes mots (les trous {forme}, {mot}, {lettre}… sont remplis automatiquement). Ils iront au hub, éditables ensuite dans Réglages.
2. **Les lignes** (tableau 4) : raye celles où le commentaire est **hors sujet** ; dis-le, la règle sera corrigée (cible : 0 hors sujet).
3. **La césure** (tableau 5) : corrige les mots mal coupés ; la fonction doit donner 100 % de la liste relue.
4. Dis « ok » : L15.1b-1 (la dictée) code ce que tu as validé.

## 1. Les taux, dictée par dictée
| Dictée | Erreurs G/L/C | Recopiées | **Reconnues** | Commentaire honnête (« autre ») | dont : écart reconnu mais d'une famille qui ne va pas avec le type posé |
|---|---|---|---|---|---|
| 3E Dylan — Dictée n°1 type brevet (avec révisions), extrait de la lettre de Fritz | 231 | 231 | **217 (94 %)** | 14 | 3 |
| 3E Franklin — Dictée n°1 type brevet (avec révisions), extrait de la lettre de Fritz | 229 | 229 | **215 (94 %)** | 14 | 2 |
| 4E Hugo — Dictée n°1 préparée, "Les travaux de Paris" | 419 | 419 | **380 (91 %)** | 39 | 5 |
| 4E Turing — Dictée n°1 préparée, "Les travaux de Paris" | 528 | 528 | **480 (91 %)** | 48 | 7 |
| **Total** | | **1407** | **1292 (92 %)** | **115** | 17 |

*Les « 514 erreurs des 3E » du complément : 254 (Dylan) + 260 (Franklin), tous types ; 460 sont des G/L/C recopiées, ce sont elles qui ont un écart. Côté élève, la catégorie de repli s'appellera « autre » ; « non reconnu » n'existera que côté professeur.*

## 2. Les catégories (des objets : id, famille, compétence, motifs, commentaire) — leur commentaire proposé, à réécrire
| Catégorie (id) | Famille | Compétence | Erreurs | Commentaire proposé | Exemple |
|---|---|---|---|---|---|
| Élision (qu', l', d'…) (`cat-elision`) | mots | D1.2 | 2 | Tu as écrit « {forme} » : devant une voyelle, on élide : « {mot}' ». | « que » → « qu » |
| Majuscule (`cat-majuscule`) | mots | D1.2 | 10 | Tu as écrit « {forme} » : attention à la majuscule, on écrit « {mot} ». | « paris » → « Paris » |
| Homophone grammatical (`cat-homophone`) | homophones | D1.5 | 314 | « {forme} » et « {mot} » se prononcent de la même façon ; ici, il faut « {mot} ». {regle} | « a » → « à » |
| Nombre en chiffres (`cat-chiffre`) | mots | D1.2 | 7 | Tu as écrit « {forme} » : dans une dictée, le nombre s'écrit en lettres : « {mot} ». | « 3 » → « trois » |
| Trait d'union (`cat-tiret`) | mots | D1.2 | 0 | Tu as écrit « {forme} » : attention au trait d'union, on écrit « {mot} ». | « peut être » → « peut-être » |
| Apostrophe (`cat-apostrophe`) | mots | D1.2 | 1 | Tu as écrit « {forme} » : il faut l'apostrophe, on écrit « {mot} ». | « larbre » → « l'arbre » |
| Mots collés ou coupés (`cat-collage`) | mots | D1.2 | 0 | Tu as écrit « {forme} » : attention à la séparation des mots, on écrit « {mot} ». | « parcontre » → « par contre » |
| Cédille (`cat-cedille`) | lexique | D1.2 | 5 | Tu as écrit « {forme} » : il faut une cédille sous le c (ç) pour le son [s] : « {mot} ». | « facon » → « façon » |
| Pluriel manquant (-s, -x) (`cat-pluriel-manquant`) | accords | D1.1 | 210 | Tu as écrit « {forme} » : il manque la marque du pluriel (-{lettre}). Il faut « {mot} ». | « maison » → « maisons » |
| Pluriel en trop (-s, -x) (`cat-pluriel-en-trop`) | accords | D1.1 | 192 | Tu as écrit « {forme} » : le -{lettre} est en trop, ici le mot est au singulier : « {mot} ». | « abris » → « abri » |
| Verbe : -nt manquant (3e du pluriel) (`cat-verbe-nt-manquant`) | accords | D1.1 | 82 | Tu as écrit « {forme} » : le sujet est au pluriel, le verbe prend -nt : « {mot} ». | « mange » → « mangent » |
| Verbe : -nt en trop (`cat-verbe-nt-en-trop`) | accords | D1.1 | 46 | Tu as écrit « {forme} » : le sujet est au singulier, le verbe ne prend pas -nt : « {mot} ». | « mangent » → « mange » |
| Féminin pluriel : -es manquant (`cat-fem-pl-manquant`) | accords | D1.1 | 9 | Tu as écrit « {forme} » : il manque les marques du féminin et du pluriel (-es) : « {mot} ». | « perdu » → « perdues » |
| Féminin pluriel : -es en trop (`cat-fem-pl-en-trop`) | accords | D1.1 | 9 | Tu as écrit « {forme} » : les marques du féminin et du pluriel (-es) sont en trop : « {mot} ». | « perdues » → « perdu » |
| Féminin : -e manquant (`cat-feminin-manquant`) | accords | D1.1 | 38 | Tu as écrit « {forme} » : il manque le -e du féminin : « {mot} ». | « grand » → « grande » |
| Féminin : -e en trop (`cat-feminin-en-trop`) | accords | D1.1 | 11 | Tu as écrit « {forme} » : le -e est en trop, le mot est au masculin : « {mot} ». | « grande » → « grand » |
| -eux / -euse (`cat-eux-euse`) | accords | D1.1 | 0 | Tu as écrit « {forme} » : -eux au masculin, -euse au féminin : « {mot} ». | « heureux » → « heureuse » |
| Pluriel en -aux (`cat-pluriel-aux`) | accords | D1.1 | 0 | Tu as écrit « {forme} » : ce mot en -al fait son pluriel en -aux : « {mot} ». | « chevals » → « chevaux » |
| -ons / -ont (`cat-ons-ont`) | conjugaison | D1.1 | 1 | Tu as écrit « {forme} » : -ons va avec « nous », -ont avec « ils, elles » : « {mot} ». | « allont » → « allons » |
| Imparfait / passé simple (`cat-imparfait-passe-simple`) | conjugaison | D1.1 | 0 | Tu as écrit « {forme} » : tu as confondu l'imparfait et le passé simple : « {mot} ». | « marchait » → « marcha » |
| Terminaison -é / -er / -ez / -ai / -ait (`cat-terminaison-e-er`) | conjugaison | D1.1 | 62 | Tu as écrit « {forme} » : la terminaison est -{attendu}, pas -{ecrit} : « {mot} ». | « mangé » → « manger » |
| -s / -x / -t final du verbe (la personne) (`cat-verbe-personne`) | conjugaison | D1.1 | 6 | Tu as écrit « {forme} » : la terminaison dépend de la personne du sujet : « {mot} ». | « veux » → « veut » |
| -t / -d final du verbe (`cat-verbe-t-d`) | conjugaison | D1.1 | 0 | Tu as écrit « {forme} » : ce verbe garde le -{attendu} de son radical : « {mot} ». | « prent » → « prend » |
| Accent (`cat-accent`) | lexique | D1.2 | 50 | Tu as écrit « {forme} » : attention à l'accent {accent} sur le {lettre} : « {mot} ». | « eleve » → « élève » |
| Consonne double (`cat-consonne-double`) | lexique | D1.2 | 108 | Tu as écrit « {forme} » : attention au {lettre}, simple ou double : « {mot} ». | « apeler » → « appeler » |
| Lettre muette finale (`cat-lettre-muette`) | lexique | D1.2 | 28 | Tu as écrit « {forme} » : attention à la lettre muette à la fin du mot ({lettre}) : « {mot} ». | « bor » → « bord » |
| y / i (`cat-y-i`) | lexique | D1.2 | 0 | Tu as écrit « {forme} » : dans ce mot, il faut un {attendu} : « {mot} ». | « sistème » → « système » |
| Le son [s] (s, ss, c, ç, t) (`cat-son-s`) | lexique | D1.2 | 2 | Tu as écrit « {forme} » : le son [s] s'écrit ici « {attendu} » : « {mot} ». | « pousière » → « poussière » |
| Le son [k] (c, qu, k) (`cat-son-k`) | lexique | D1.2 | 4 | Tu as écrit « {forme} » : le son [k] s'écrit ici « {attendu} » : « {mot} ». | « cartier » → « quartier » |
| Le son [g] / [ʒ] (g, gu, ge, j) (`cat-son-g-j`) | lexique | D1.2 | 0 | Tu as écrit « {forme} » : ici on écrit « {attendu} » : « {mot} ». | « mangons » → « mangeons » |
| Les nasales (an/en, in/ain/ein, on/om) (`cat-nasales`) | lexique | D1.2 | 14 | Tu as écrit « {forme} » : le son s'écrit ici « {attendu} » : « {mot} ». | « tamps » → « temps » |
| m devant b, p (`cat-m-devant-b-p`) | lexique | D1.2 | 0 | Tu as écrit « {forme} » : devant b, m ou p, on écrit m : « {mot} ». | « tenps » → « temps » |
| o / au / eau (`cat-o-au-eau`) | lexique | D1.2 | 9 | Tu as écrit « {forme} » : le son [o] s'écrit ici « {attendu} » : « {mot} ». | « bato » → « bateau » |
| h muet (`cat-h-muet`) | lexique | D1.2 | 7 | Tu as écrit « {forme} » : il y a un h dans ce mot : « {mot} ». | « abit » → « habit » |
| Lettres inversées (`cat-lettres-inversees`) | lexique | D1.2 | 0 | Tu as écrit « {forme} » : deux lettres sont inversées : « {mot} ». | « dagnereux » → « dangereux » |
| Lettre oubliée (`cat-lettre-omise`) | lexique | D1.2 | 27 | Tu as écrit « {forme} » : il manque une lettre ({lettre}) : « {mot} ». | « chose » → « choses » |
| Lettre en trop (`cat-lettre-ajoutee`) | lexique | D1.2 | 33 | Tu as écrit « {forme} » : le {lettre} est en trop : « {mot} ». | « maisoon » → « maison » |
| Lettre changée (`cat-lettre-changee`) | lexique | D1.2 | 22 | Tu as écrit « {forme} » : une lettre est changée ({ecrit} au lieu de {attendu}) : « {mot} ». | « bacon » → « balcon » |
| Autre (`cat-autre`) | autre |  | 98 | Compare lettre à lettre avec le mot juste : « {mot} ». |  |

*« Mot long » (trois syllabes ou plus, jamais un nombre de lettres) : la ligne « Mot long — décompose-le en syllabes : dé·com·po·sé. » s'ajoute au commentaire (tes mots).*

## 3. Ce qui reste en « autre » (le commentaire honnête) — trié par fréquence
| Forme → mot | Fois |
|---|---|
| puenteure → puanteur | 4 |
| ures → eurent | 3 |
| neuvent → neuves | 3 |
| encors → encore | 3 |
| emmené → amenés | 2 |
| exumes → exhume | 2 |
| deux → 2 | 2 |
| eures → eurent | 2 |
| entié → entiers | 2 |
| raipondais → répondaient | 2 |
| abattir → abattirent | 2 |
| commmencairent → commencèrent | 2 |
| urent → eurent | 2 |
| çe → se | 1 |
| entandus → entendu | 1 |
| quelqu'que → quelques | 1 |
| instens → instant | 1 |
| ammenés → amenés | 1 |
| idez → idée | 1 |
| ecxumes → exhume | 1 |
| on → on | 1 |
| odeur → puanteur | 1 |
| recouvrit → recouvre | 1 |
| veutent → veut | 1 |
| exhubent → exhume | 1 |
| cadave → cadavres | 1 |
| arbris → abri | 1 |
| attenduent → entendu | 1 |
| entendut → entendu | 1 |
| venut → venu | 1 |
| j'usqua → jusqu | 1 |
| abatirrent → abattirent | 1 |
| répendait → répondaient | 1 |
| faux boures → faubourgs | 1 |
| connait → connaissait | 1 |
| neveus → neuves | 1 |
| perduent → perdu | 1 |
| louins → loin | 1 |
| abâttir → abattirent | 1 |
| connaiçaient → connaissait | 1 |
| à bâtir → abattirent | 1 |
| bourdés → bordées | 1 |
| ains → un | 1 |
| partir → parties | 1 |
| commencères → commencèrent | 1 |
| abbatir → abattirent | 1 |
| part → par | 1 |
| ouvrillés → ouvriers | 1 |
| auters → hauteur | 1 |
| repondais → répondaient | 1 |
| ancor → encore | 1 |
| empeure → empereur | 1 |
| un → à | 1 |
| urtent → eurent | 1 |
| par → vers | 1 |
| abattires → abattirent | 1 |
| habatir → ouvriers | 1 |
| boulvards → boulevard | 1 |
| demandes → demander | 1 |
| chantié → chantier | 1 |
| empeur → empereur | 1 |
| repouser → repoussé | 1 |
| connèssait → connaissait | 1 |
| ouvrilliers → ouvriers | 1 |
| s'entiée → entiers | 1 |
| loing → loin | 1 |
| entiées → entiers | 1 |
| empeurer → empereur | 1 |
| d'émolition → démolitions | 1 |
| demolission → démolitions | 1 |
| commençère → commencèrent | 1 |
| abatir → abattirent | 1 |
| eur → eurent | 1 |
| faux bours → faubourgs | 1 |
| connesaient → connaissait | 1 |
| abatirs → abattirent | 1 |
| cartier → quartiers | 1 |
| faux bourds → faubourgs | 1 |
| étaits → étaient | 1 |
| commençairent → commencèrent | 1 |
| égoux → égouts | 1 |
| empreure → empereur | 1 |
| logements → loyers | 1 |
| dépaçaient → dépassait | 1 |
| imaginait → imaginaient | 1 |
| faux-bourg → faubourgs | 1 |
| ouvriés → ouvriers | 1 |
| imaginaits → imaginaient | 1 |
| faulbourds → faubourgs | 1 |
| creusat → creusa | 1 |
| partit → parties | 1 |
| faux bourgs → faubourgs | 1 |
| auteures → hauteur | 1 |
| laugements → logement | 1 |
| cens → sans | 1 |
| creusaent → creusa | 1 |
| partient → parties | 1 |

## 4. Les erreurs, une ligne chacune
| Dictée | Copie | Type | Forme → mot | Catégorie | Commentaire proposé | Mot long |
|---|---|---|---|---|---|---|
| 3E Dylan | n° 1 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Dylan | n° 1 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Dylan | n° 1 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 1 | G | « tombes » → « tombe » | Pluriel en trop (-s, -x) | Tu as écrit « tombes » : le -s est en trop, ici le mot est au singulier : « tombe ». |  |
| 3E Dylan | n° 2 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Dylan | n° 2 | L | « signale » → « signal » | Lettre en trop | Tu as écrit « signale » : le e est en trop : « signal ». |  |
| 3E Dylan | n° 2 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Dylan | n° 2 | G | « ammener » → « amenés » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « ammener » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « amenés ». | oui |
| 3E Dylan | n° 2 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Dylan | n° 2 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Dylan | n° 2 | L | « çe » → « ce » | Cédille | Tu as écrit « çe » : il faut une cédille sous le c (ç) pour le son [s] : « ce ». |  |
| 3E Dylan | n° 2 | L | « ford » → « fort » | Lettre changée | Tu as écrit « ford » : une lettre est changée (d au lieu de t) : « fort ». |  |
| 3E Dylan | n° 2 | G | « passer » → « passé » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « passer » : la terminaison est -é, pas -er : « passé ». |  |
| 3E Dylan | n° 2 | G | « coucher » → « couchés » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « coucher » : la terminaison est -és, pas -er : « couchés ». |  |
| 3E Dylan | n° 2 | L | « goûtte » → « goutte » | Accent | Tu as écrit « goûtte » : attention à l'accent circonflexe sur le u : « goutte ». |  |
| 3E Dylan | n° 2 | G | « recouvrent » → « recouvre » | Verbe : -nt en trop | Tu as écrit « recouvrent » : le sujet est au singulier, le verbe ne prend pas -nt : « recouvre ». |  |
| 3E Dylan | n° 2 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 2 | G | « veux » → « veut » | -s / -x / -t final du verbe (la personne) | Tu as écrit « veux » : la terminaison dépend de la personne du sujet : « veut ». |  |
| 3E Dylan | n° 2 | G | « çe » → « se » | **autre** (écart Lettre changée, pas pour un G) | Compare lettre à lettre avec le mot juste : « se ». |  |
| 3E Dylan | n° 2 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Dylan | n° 3 | L | « vehicules » → « véhicules » | Accent | Tu as écrit « vehicules » : attention à l'accent aigu sur le e : « véhicules ». | oui |
| 3E Dylan | n° 3 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Dylan | n° 3 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Dylan | n° 3 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 3E Dylan | n° 3 | L | « souville » → « Souville » | Majuscule | Tu as écrit « souville » : attention à la majuscule, on écrit « Souville ». |  |
| 3E Dylan | n° 3 | L | « 3 » → « trois » | Nombre en chiffres | Tu as écrit « 3 » : dans une dictée, le nombre s'écrit en lettres : « trois ». |  |
| 3E Dylan | n° 3 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 3 | G | « chaques » → « chaque » | Pluriel en trop (-s, -x) | Tu as écrit « chaques » : le -s est en trop, ici le mot est au singulier : « chaque ». |  |
| 3E Dylan | n° 3 | G | « instants » → « instant » | Pluriel en trop (-s, -x) | Tu as écrit « instants » : le -s est en trop, ici le mot est au singulier : « instant ». |  |
| 3E Dylan | n° 3 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Dylan | n° 3 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 3 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 3 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Dylan | n° 4 | L | « vehicules » → « véhicules » | Accent | Tu as écrit « vehicules » : attention à l'accent aigu sur le e : « véhicules ». | oui |
| 3E Dylan | n° 4 | G | « à » → « a » | Homophone grammatical | « à » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Dylan | n° 4 | L | « amemnés » → « amenés » | Lettre en trop | Tu as écrit « amemnés » : le m est en trop : « amenés ». | oui |
| 3E Dylan | n° 4 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 3E Dylan | n° 4 | G | « à » → « a » | Homophone grammatical | « à » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Dylan | n° 4 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 3E Dylan | n° 4 | G | « passés » → « passé » | Pluriel en trop (-s, -x) | Tu as écrit « passés » : le -s est en trop, ici le mot est au singulier : « passé ». |  |
| 3E Dylan | n° 4 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Dylan | n° 4 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 4 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Dylan | n° 4 | G | « veux » → « veut » | -s / -x / -t final du verbe (la personne) | Tu as écrit « veux » : la terminaison dépend de la personne du sujet : « veut ». |  |
| 3E Dylan | n° 4 | G | « tombes » → « tombe » | Pluriel en trop (-s, -x) | Tu as écrit « tombes » : le -s est en trop, ici le mot est au singulier : « tombe ». |  |
| 3E Dylan | n° 5 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Dylan | n° 5 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Dylan | n° 5 | L | « 3 » → « trois » | Nombre en chiffres | Tu as écrit « 3 » : dans une dictée, le nombre s'écrit en lettres : « trois ». |  |
| 3E Dylan | n° 5 | G | « coucher » → « couchés » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « coucher » : la terminaison est -és, pas -er : « couchés ». |  |
| 3E Dylan | n° 5 | L | « prêt » → « près » | Homophone grammatical | « prêt » et « près » se prononcent de la même façon ; ici, il faut « près ». « prêt(s) » = adjectif (→ terminé). « près » = adverbe/préposition de lieu (→ à côté). |  |
| 3E Dylan | n° 5 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Dylan | n° 5 | L | « creusser » → « creuser » | Consonne double | Tu as écrit « creusser » : attention au s, simple ou double : « creuser ». |  |
| 3E Dylan | n° 5 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Dylan | n° 6 | L | « véicules » → « véhicules » | h muet | Tu as écrit « véicules » : il y a un h dans ce mot : « véhicules ». | oui |
| 3E Dylan | n° 6 | L | « ammenés » → « amenés » | Consonne double | Tu as écrit « ammenés » : attention au m, simple ou double : « amenés ». | oui |
| 3E Dylan | n° 6 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 7 | G | « véhicule » → « véhicules » | Pluriel manquant (-s, -x) | Tu as écrit « véhicule » : il manque la marque du pluriel (-s). Il faut « véhicules ». | oui |
| 3E Dylan | n° 7 | L | « ammenés » → « amenés » | Consonne double | Tu as écrit « ammenés » : attention au m, simple ou double : « amenés ». | oui |
| 3E Dylan | n° 7 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 3E Dylan | n° 7 | G | « passés » → « passé » | Pluriel en trop (-s, -x) | Tu as écrit « passés » : le -s est en trop, ici le mot est au singulier : « passé ». |  |
| 3E Dylan | n° 7 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Dylan | n° 7 | L | « boir » → « boire » | Lettre oubliée | Tu as écrit « boir » : il manque une lettre (e) : « boire ». |  |
| 3E Dylan | n° 7 | L | « puanteure » → « puanteur » | Lettre en trop | Tu as écrit « puanteure » : le e est en trop : « puanteur ». | oui |
| 3E Dylan | n° 7 | L | « obu » → « obus » | Lettre muette finale | Tu as écrit « obu » : attention à la lettre muette à la fin du mot (s) : « obus ». |  |
| 3E Dylan | n° 7 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 8 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Dylan | n° 8 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Dylan | n° 8 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Dylan | n° 8 | L | « 3 » → « trois » | Nombre en chiffres | Tu as écrit « 3 » : dans une dictée, le nombre s'écrit en lettres : « trois ». |  |
| 3E Dylan | n° 8 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 8 | G | « instants » → « instant » | Pluriel en trop (-s, -x) | Tu as écrit « instants » : le -s est en trop, ici le mot est au singulier : « instant ». |  |
| 3E Dylan | n° 8 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 8 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 8 | G | « ce » → « se » | Homophone grammatical | « ce » et « se » se prononcent de la même façon ; ici, il faut « se ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 3E Dylan | n° 8 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Dylan | n° 8 | G | « tombent » → « tombe » | Verbe : -nt en trop | Tu as écrit « tombent » : le sujet est au singulier, le verbe ne prend pas -nt : « tombe ». |  |
| 3E Dylan | n° 9 | G | « venue » → « venu » | Féminin : -e en trop | Tu as écrit « venue » : le -e est en trop, le mot est au masculin : « venu ». |  |
| 3E Dylan | n° 9 | G | « emmené » → « amenés » | **autre** | Compare lettre à lettre avec le mot juste : « amenés ». | oui |
| 3E Dylan | n° 9 | L | « bàs » → « bas » | Accent | Tu as écrit « bàs » : attention à l'accent grave sur le a : « bas ». |  |
| 3E Dylan | n° 9 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 9 | L | « ce-là » → « cela » | Accent + Trait d'union | Tu as écrit « ce-là » : attention à l'accent, et à le trait d'union : « cela ». |  |
| 3E Dylan | n° 9 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Dylan | n° 9 | L | « puenteure » → « puanteur » | **autre** | Compare lettre à lettre avec le mot juste : « puanteur ». | oui |
| 3E Dylan | n° 9 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 9 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Dylan | n° 10 | G | « entandus » → « entendu » | **autre** | Compare lettre à lettre avec le mot juste : « entendu ». | oui |
| 3E Dylan | n° 10 | L | « alèrte » → « alerte » | Accent | Tu as écrit « alèrte » : attention à l'accent grave sur le e : « alerte ». |  |
| 3E Dylan | n° 10 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Dylan | n° 10 | L | « ammenés » → « amenés » | Consonne double | Tu as écrit « ammenés » : attention au m, simple ou double : « amenés ». | oui |
| 3E Dylan | n° 10 | G | « quelqu'que » → « quelques » | **autre** | Compare lettre à lettre avec le mot juste : « quelques ». |  |
| 3E Dylan | n° 10 | G | « pouver » → « pouvez » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « pouver » : la terminaison est -ez, pas -er : « pouvez ». |  |
| 3E Dylan | n° 10 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 3E Dylan | n° 10 | G | « vues » → « vu » | Féminin pluriel : -es en trop | Tu as écrit « vues » : les marques du féminin et du pluriel (-es) sont en trop : « vu ». |  |
| 3E Dylan | n° 10 | G | « passés » → « passé » | Pluriel en trop (-s, -x) | Tu as écrit « passés » : le -s est en trop, ici le mot est au singulier : « passé ». |  |
| 3E Dylan | n° 10 | L | « hobbus » → « obus » | Consonne double + Lettre en trop | Tu as écrit « hobbus » : attention à la consonne double, et à une lettre en trop : « obus ». |  |
| 3E Dylan | n° 10 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Dylan | n° 10 | L | « atendre » → « attendre » | Consonne double | Tu as écrit « atendre » : attention au t, simple ou double : « attendre ». |  |
| 3E Dylan | n° 10 | L | « instens » → « instant » | **autre** | Compare lettre à lettre avec le mot juste : « instant ». |  |
| 3E Dylan | n° 10 | L | « celà » → « cela » | Accent | Tu as écrit « celà » : attention à l'accent grave sur le a : « cela ». |  |
| 3E Dylan | n° 10 | G | « sent » → « sans » | Homophone grammatical | « sent » et « sans » se prononcent de la même façon ; ici, il faut « sans ». « sans » = préposition privation (→ avec). « s'en » = se+en (→ de cela). « sens/sent » = verbe sentir. |  |
| 3E Dylan | n° 10 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Dylan | n° 10 | L | « puanteure » → « puanteur » | Lettre en trop | Tu as écrit « puanteure » : le e est en trop : « puanteur ». | oui |
| 3E Dylan | n° 10 | L | « hobbus » → « obus » | Consonne double + Lettre en trop | Tu as écrit « hobbus » : attention à la consonne double, et à une lettre en trop : « obus ». |  |
| 3E Dylan | n° 10 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 10 | G | « nouveaux » → « nouveau » | Pluriel en trop (-s, -x) | Tu as écrit « nouveaux » : le -x est en trop, ici le mot est au singulier : « nouveau ». |  |
| 3E Dylan | n° 10 | L | « Quant » → « Quand » | Homophone grammatical | « Quant » et « Quand » se prononcent de la même façon ; ici, il faut « Quand ». « quand » = temps (→ lorsque). « quant à » = en ce qui concerne. « qu'en » = que+en. |  |
| 3E Dylan | n° 10 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Dylan | n° 10 | G | « tombes » → « tombe » | Pluriel en trop (-s, -x) | Tu as écrit « tombes » : le -s est en trop, ici le mot est au singulier : « tombe ». |  |
| 3E Dylan | n° 11 | G | « ammené » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « ammené » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Dylan | n° 11 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Dylan | n° 11 | L | « 3 » → « trois » | Nombre en chiffres | Tu as écrit « 3 » : dans une dictée, le nombre s'écrit en lettres : « trois ». |  |
| 3E Dylan | n° 11 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 11 | G | « instants » → « instant » | Pluriel en trop (-s, -x) | Tu as écrit « instants » : le -s est en trop, ici le mot est au singulier : « instant ». |  |
| 3E Dylan | n° 11 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Dylan | n° 11 | L | « puanteure » → « puanteur » | Lettre en trop | Tu as écrit « puanteure » : le e est en trop : « puanteur ». | oui |
| 3E Dylan | n° 11 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 11 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Dylan | n° 11 | L | « Quant » → « Quand » | Homophone grammatical | « Quant » et « Quand » se prononcent de la même façon ; ici, il faut « Quand ». « quand » = temps (→ lorsque). « quant à » = en ce qui concerne. « qu'en » = que+en. |  |
| 3E Dylan | n° 11 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Dylan | n° 12 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Dylan | n° 12 | L | « pouviez » → « pouvez » | Lettre en trop | Tu as écrit « pouviez » : le i est en trop : « pouvez ». |  |
| 3E Dylan | n° 12 | L | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 3E Dylan | n° 12 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 12 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Dylan | n° 12 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 12 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Dylan | n° 13 | L | « allerte » → « alerte » | Consonne double | Tu as écrit « allerte » : attention au l, simple ou double : « alerte ». |  |
| 3E Dylan | n° 13 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Dylan | n° 13 | G | « à » → « a » | Homophone grammatical | « à » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Dylan | n° 13 | G | « amenné » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « amenné » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Dylan | n° 13 | L | « killomètres » → « kilomètres » | Consonne double | Tu as écrit « killomètres » : attention au l, simple ou double : « kilomètres ». | oui |
| 3E Dylan | n° 13 | L | « idé » → « idée » | Lettre oubliée | Tu as écrit « idé » : il manque une lettre (e) : « idée ». |  |
| 3E Dylan | n° 13 | G | « à » → « a » | Homophone grammatical | « à » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Dylan | n° 13 | L | « souville » → « Souville » | Majuscule | Tu as écrit « souville » : attention à la majuscule, on écrit « Souville ». |  |
| 3E Dylan | n° 13 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 13 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Dylan | n° 13 | L | « Quant » → « Quand » | Homophone grammatical | « Quant » et « Quand » se prononcent de la même façon ; ici, il faut « Quand ». « quand » = temps (→ lorsque). « quant à » = en ce qui concerne. « qu'en » = que+en. |  |
| 3E Dylan | n° 13 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Dylan | n° 13 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 3E Dylan | n° 14 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Dylan | n° 14 | G | « à » → « a » | Homophone grammatical | « à » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Dylan | n° 14 | G | « ammené » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « ammené » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Dylan | n° 14 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 3E Dylan | n° 14 | L | « ford » → « fort » | Lettre changée | Tu as écrit « ford » : une lettre est changée (d au lieu de t) : « fort ». |  |
| 3E Dylan | n° 14 | G | « passés » → « passé » | Pluriel en trop (-s, -x) | Tu as écrit « passés » : le -s est en trop, ici le mot est au singulier : « passé ». |  |
| 3E Dylan | n° 14 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Dylan | n° 14 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Dylan | n° 14 | G | « recouvrent » → « recouvre » | Verbe : -nt en trop | Tu as écrit « recouvrent » : le sujet est au singulier, le verbe ne prend pas -nt : « recouvre ». |  |
| 3E Dylan | n° 14 | G | « nouveaux » → « nouveau » | Pluriel en trop (-s, -x) | Tu as écrit « nouveaux » : le -x est en trop, ici le mot est au singulier : « nouveau ». |  |
| 3E Dylan | n° 14 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Dylan | n° 14 | G | « veux » → « veut » | -s / -x / -t final du verbe (la personne) | Tu as écrit « veux » : la terminaison dépend de la personne du sujet : « veut ». |  |
| 3E Dylan | n° 14 | G | « creusés » → « creuser » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « creusés » : la terminaison est -er, pas -és : « creuser ». |  |
| 3E Dylan | n° 14 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 3E Dylan | n° 15 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Dylan | n° 15 | L | « 3 » → « trois » | Nombre en chiffres | Tu as écrit « 3 » : dans une dictée, le nombre s'écrit en lettres : « trois ». |  |
| 3E Dylan | n° 15 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 15 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Dylan | n° 15 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 15 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 15 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Dylan | n° 15 | L | « creser » → « creuser » | Lettre oubliée | Tu as écrit « creser » : il manque une lettre (u) : « creuser ». |  |
| 3E Dylan | n° 15 | G | « veux » → « veut » | -s / -x / -t final du verbe (la personne) | Tu as écrit « veux » : la terminaison dépend de la personne du sujet : « veut ». |  |
| 3E Dylan | n° 16 | G | « ammenés » → « amenés » | **autre** (écart Consonne double, pas pour un G) | Compare lettre à lettre avec le mot juste : « amenés ». | oui |
| 3E Dylan | n° 16 | L | « kilomêtres » → « kilomètres » | Accent | Tu as écrit « kilomêtres » : attention à l'accent grave sur le e : « kilomètres ». | oui |
| 3E Dylan | n° 16 | L | « idez » → « idée » | **autre** (écart Terminaison -é / -er / -ez / -ai / -ait, pas pour un L) | Compare lettre à lettre avec le mot juste : « idée ». |  |
| 3E Dylan | n° 16 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 16 | L | « prêt » → « près » | Homophone grammatical | « prêt » et « près » se prononcent de la même façon ; ici, il faut « près ». « prêt(s) » = adjectif (→ terminé). « près » = adverbe/préposition de lieu (→ à côté). |  |
| 3E Dylan | n° 16 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Dylan | n° 16 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 16 | L | « obu » → « obus » | Lettre muette finale | Tu as écrit « obu » : attention à la lettre muette à la fin du mot (s) : « obus ». |  |
| 3E Dylan | n° 16 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 17 | G | « cherchez » → « chercher » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « cherchez » : la terminaison est -er, pas -ez : « chercher ». |  |
| 3E Dylan | n° 17 | G | « ammenez » → « amenés » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « ammenez » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « amenés ». | oui |
| 3E Dylan | n° 17 | L | « 3 » → « trois » | Nombre en chiffres | Tu as écrit « 3 » : dans une dictée, le nombre s'écrit en lettres : « trois ». |  |
| 3E Dylan | n° 17 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 17 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Dylan | n° 17 | G | « recouvrent » → « recouvre » | Verbe : -nt en trop | Tu as écrit « recouvrent » : le sujet est au singulier, le verbe ne prend pas -nt : « recouvre ». |  |
| 3E Dylan | n° 17 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 17 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Dylan | n° 18 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Dylan | n° 18 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Dylan | n° 18 | L | « puenteure » → « puanteur » | **autre** | Compare lettre à lettre avec le mot juste : « puanteur ». | oui |
| 3E Dylan | n° 18 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 19 | G | « amenée » → « amenés » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « amenée » : la terminaison est -és, pas -ée : « amenés ». | oui |
| 3E Dylan | n° 19 | L | « puanteure » → « puanteur » | Lettre en trop | Tu as écrit « puanteure » : le e est en trop : « puanteur ». | oui |
| 3E Dylan | n° 19 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 19 | G | « ecxumes » → « exhume » | **autre** | Compare lettre à lettre avec le mot juste : « exhume ». |  |
| 3E Dylan | n° 19 | L | « Quant » → « Quand » | Homophone grammatical | « Quant » et « Quand » se prononcent de la même façon ; ici, il faut « Quand ». « quand » = temps (→ lorsque). « quant à » = en ce qui concerne. « qu'en » = que+en. |  |
| 3E Dylan | n° 20 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Dylan | n° 20 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Dylan | n° 20 | L | « ammenés » → « amenés » | Consonne double | Tu as écrit « ammenés » : attention au m, simple ou double : « amenés ». | oui |
| 3E Dylan | n° 20 | G | « idés » → « idée » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « idés » : la terminaison est -ée, pas -és : « idée ». |  |
| 3E Dylan | n° 20 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 3E Dylan | n° 20 | G | « on » → « on » | **autre** |  |  |
| 3E Dylan | n° 20 | G | « vus » → « vu » | Pluriel en trop (-s, -x) | Tu as écrit « vus » : le -s est en trop, ici le mot est au singulier : « vu ». |  |
| 3E Dylan | n° 20 | L | « l'à » → « là » | Apostrophe | Tu as écrit « l'à » : il faut l'apostrophe, on écrit « là ». |  |
| 3E Dylan | n° 20 | G | « instants » → « instant » | Pluriel en trop (-s, -x) | Tu as écrit « instants » : le -s est en trop, ici le mot est au singulier : « instant ». |  |
| 3E Dylan | n° 20 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Dylan | n° 20 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Dylan | n° 20 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Dylan | n° 21 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Dylan | n° 21 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Dylan | n° 21 | G | « cherchers » → « chercher » | Pluriel en trop (-s, -x) | Tu as écrit « cherchers » : le -s est en trop, ici le mot est au singulier : « chercher ». |  |
| 3E Dylan | n° 21 | L | « véicules » → « véhicules » | h muet | Tu as écrit « véicules » : il y a un h dans ce mot : « véhicules ». | oui |
| 3E Dylan | n° 21 | L | « kilomêtres » → « kilomètres » | Accent | Tu as écrit « kilomêtres » : attention à l'accent grave sur le e : « kilomètres ». | oui |
| 3E Dylan | n° 21 | L | « que » → « qu » | Élision (qu', l', d'…) | Tu as écrit « que » : devant une voyelle, on élide : « qu' ». |  |
| 3E Dylan | n° 21 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Dylan | n° 21 | G | « à » → « a » | Homophone grammatical | « à » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Dylan | n° 21 | L | « sorti » → « sortie » | Lettre oubliée | Tu as écrit « sorti » : il manque une lettre (e) : « sortie ». |  |
| 3E Dylan | n° 21 | G | « passés » → « passé » | Pluriel en trop (-s, -x) | Tu as écrit « passés » : le -s est en trop, ici le mot est au singulier : « passé ». |  |
| 3E Dylan | n° 21 | L | « odeur » → « puanteur » | **autre** | Compare lettre à lettre avec le mot juste : « puanteur ». | oui |
| 3E Dylan | n° 21 | G | « recouvrit » → « recouvre » | **autre** | Compare lettre à lettre avec le mot juste : « recouvre ». |  |
| 3E Dylan | n° 21 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Dylan | n° 21 | G | « veutent » → « veut » | **autre** | Compare lettre à lettre avec le mot juste : « veut ». |  |
| 3E Dylan | n° 21 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Dylan | n° 21 | G | « tombent » → « tombe » | Verbe : -nt en trop | Tu as écrit « tombent » : le sujet est au singulier, le verbe ne prend pas -nt : « tombe ». |  |
| 3E Dylan | n° 22 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Dylan | n° 23 | G | « amener » → « amenés » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « amener » : la terminaison est -és, pas -er : « amenés ». | oui |
| 3E Dylan | n° 23 | G | « passer » → « passé » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « passer » : la terminaison est -é, pas -er : « passé ». |  |
| 3E Dylan | n° 23 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 23 | L | « goûte » → « goutte » | Accent + Consonne double | Tu as écrit « goûte » : attention à l'accent, et à la consonne double : « goutte ». |  |
| 3E Dylan | n° 23 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Dylan | n° 24 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Dylan | n° 24 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Dylan | n° 24 | G | « vus » → « vu » | Pluriel en trop (-s, -x) | Tu as écrit « vus » : le -s est en trop, ici le mot est au singulier : « vu ». |  |
| 3E Dylan | n° 24 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Dylan | n° 24 | G | « passez » → « passé » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « passez » : la terminaison est -é, pas -ez : « passé ». |  |
| 3E Dylan | n° 24 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Dylan | n° 24 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Dylan | n° 24 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Dylan | n° 24 | G | « mort » → « morts » | Pluriel manquant (-s, -x) | Tu as écrit « mort » : il manque la marque du pluriel (-s). Il faut « morts ». |  |
| 3E Franklin | n° 1 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Franklin | n° 1 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Franklin | n° 1 | L | « véicules » → « véhicules » | h muet | Tu as écrit « véicules » : il y a un h dans ce mot : « véhicules ». | oui |
| 3E Franklin | n° 1 | G | « as » → « a » | Homophone grammatical | « as » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 1 | L | « fron » → « front » | Lettre muette finale | Tu as écrit « fron » : attention à la lettre muette à la fin du mot (t) : « front ». |  |
| 3E Franklin | n° 1 | G | « vus » → « vu » | Pluriel en trop (-s, -x) | Tu as écrit « vus » : le -s est en trop, ici le mot est au singulier : « vu ». |  |
| 3E Franklin | n° 1 | G | « coucher » → « couchés » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « coucher » : la terminaison est -és, pas -er : « couchés ». |  |
| 3E Franklin | n° 1 | G | « voirs » → « voir » | Pluriel en trop (-s, -x) | Tu as écrit « voirs » : le -s est en trop, ici le mot est au singulier : « voir ». |  |
| 3E Franklin | n° 1 | L | « orrible » → « horrible » | h muet | Tu as écrit « orrible » : il y a un h dans ce mot : « horrible ». |  |
| 3E Franklin | n° 1 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 1 | G | « exhubent » → « exhume » | **autre** | Compare lettre à lettre avec le mot juste : « exhume ». |  |
| 3E Franklin | n° 1 | G | « nouveaux » → « nouveau » | Pluriel en trop (-s, -x) | Tu as écrit « nouveaux » : le -x est en trop, ici le mot est au singulier : « nouveau ». |  |
| 3E Franklin | n° 1 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Franklin | n° 1 | G | « tombent » → « tombe » | Verbe : -nt en trop | Tu as écrit « tombent » : le sujet est au singulier, le verbe ne prend pas -nt : « tombe ». |  |
| 3E Franklin | n° 2 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Franklin | n° 2 | G | « cadave » → « cadavres » | **autre** | Compare lettre à lettre avec le mot juste : « cadavres ». |  |
| 3E Franklin | n° 2 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 2 | G | « veux » → « veut » | -s / -x / -t final du verbe (la personne) | Tu as écrit « veux » : la terminaison dépend de la personne du sujet : « veut ». |  |
| 3E Franklin | n° 2 | L | « creser » → « creuser » | Lettre oubliée | Tu as écrit « creser » : il manque une lettre (u) : « creuser ». |  |
| 3E Franklin | n° 3 | G | « amener » → « amenés » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « amener » : la terminaison est -és, pas -er : « amenés ». | oui |
| 3E Franklin | n° 3 | G | « idées » → « idée » | Pluriel en trop (-s, -x) | Tu as écrit « idées » : le -s est en trop, ici le mot est au singulier : « idée ». |  |
| 3E Franklin | n° 3 | G | « passées » → « passé » | Féminin pluriel : -es en trop | Tu as écrit « passées » : les marques du féminin et du pluriel (-es) sont en trop : « passé ». |  |
| 3E Franklin | n° 3 | L | « troues » → « trous » | Lettre en trop | Tu as écrit « troues » : le e est en trop : « trous ». |  |
| 3E Franklin | n° 3 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Franklin | n° 3 | L | « obu » → « obus » | Lettre muette finale | Tu as écrit « obu » : attention à la lettre muette à la fin du mot (s) : « obus ». |  |
| 3E Franklin | n° 3 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 4 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Franklin | n° 4 | G | « ammener » → « amenés » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « ammener » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « amenés ». | oui |
| 3E Franklin | n° 4 | G | « vue » → « vu » | Féminin : -e en trop | Tu as écrit « vue » : le -e est en trop, le mot est au masculin : « vu ». |  |
| 3E Franklin | n° 4 | G | « instants » → « instant » | Pluriel en trop (-s, -x) | Tu as écrit « instants » : le -s est en trop, ici le mot est au singulier : « instant ». |  |
| 3E Franklin | n° 4 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 4 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Franklin | n° 4 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Franklin | n° 5 | G | « cherché » → « chercher » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « cherché » : la terminaison est -er, pas -é : « chercher ». |  |
| 3E Franklin | n° 5 | G | « emmené » → « amenés » | **autre** | Compare lettre à lettre avec le mot juste : « amenés ». | oui |
| 3E Franklin | n° 5 | L | « sorti » → « sortie » | Lettre oubliée | Tu as écrit « sorti » : il manque une lettre (e) : « sortie ». |  |
| 3E Franklin | n° 5 | L | « goûte » → « goutte » | Accent + Consonne double | Tu as écrit « goûte » : attention à l'accent, et à la consonne double : « goutte ». |  |
| 3E Franklin | n° 5 | G | « exumes » → « exhume » | **autre** | Compare lettre à lettre avec le mot juste : « exhume ». |  |
| 3E Franklin | n° 5 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Franklin | n° 6 | L | « puanteure » → « puanteur » | Lettre en trop | Tu as écrit « puanteure » : le e est en trop : « puanteur ». | oui |
| 3E Franklin | n° 6 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 6 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Franklin | n° 7 | L | « deux » → « 2 » | **autre** | Compare lettre à lettre avec le mot juste : « 2 ». |  |
| 3E Franklin | n° 7 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Franklin | n° 7 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Franklin | n° 7 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 7 | G | « idées » → « idée » | Pluriel en trop (-s, -x) | Tu as écrit « idées » : le -s est en trop, ici le mot est au singulier : « idée ». |  |
| 3E Franklin | n° 7 | G | « vus » → « vu » | Pluriel en trop (-s, -x) | Tu as écrit « vus » : le -s est en trop, ici le mot est au singulier : « vu ». |  |
| 3E Franklin | n° 7 | G | « sens » → « sans » | Homophone grammatical | « sens » et « sans » se prononcent de la même façon ; ici, il faut « sans ». « sans » = préposition privation (→ avec). « s'en » = se+en (→ de cela). « sens/sent » = verbe sentir. |  |
| 3E Franklin | n° 7 | G | « gouttes » → « goutte » | Pluriel en trop (-s, -x) | Tu as écrit « gouttes » : le -s est en trop, ici le mot est au singulier : « goutte ». |  |
| 3E Franklin | n° 7 | G | « nouveaux » → « nouveau » | Pluriel en trop (-s, -x) | Tu as écrit « nouveaux » : le -x est en trop, ici le mot est au singulier : « nouveau ». |  |
| 3E Franklin | n° 7 | G | « creusé » → « creuser » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « creusé » : la terminaison est -er, pas -é : « creuser ». |  |
| 3E Franklin | n° 7 | G | « arbris » → « abri » | **autre** | Compare lettre à lettre avec le mot juste : « abri ». |  |
| 3E Franklin | n° 8 | G | « ammené » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « ammené » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Franklin | n° 8 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 8 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 8 | G | « vus » → « vu » | Pluriel en trop (-s, -x) | Tu as écrit « vus » : le -s est en trop, ici le mot est au singulier : « vu ». |  |
| 3E Franklin | n° 8 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 8 | L | « goûte » → « goutte » | Accent + Consonne double | Tu as écrit « goûte » : attention à l'accent, et à la consonne double : « goutte ». |  |
| 3E Franklin | n° 8 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 8 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 9 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Franklin | n° 9 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 9 | L | « goûte » → « goutte » | Accent + Consonne double | Tu as écrit « goûte » : attention à l'accent, et à la consonne double : « goutte ». |  |
| 3E Franklin | n° 10 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Franklin | n° 10 | L | « ammenés » → « amenés » | Consonne double | Tu as écrit « ammenés » : attention au m, simple ou double : « amenés ». | oui |
| 3E Franklin | n° 10 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 10 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 10 | L | « goûte » → « goutte » | Accent + Consonne double | Tu as écrit « goûte » : attention à l'accent, et à la consonne double : « goutte ». |  |
| 3E Franklin | n° 10 | L | « puenteure » → « puanteur » | **autre** | Compare lettre à lettre avec le mot juste : « puanteur ». | oui |
| 3E Franklin | n° 10 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 11 | L | « alèrte » → « alerte » | Accent | Tu as écrit « alèrte » : attention à l'accent grave sur le e : « alerte ». |  |
| 3E Franklin | n° 11 | G | « vue » → « vu » | Féminin : -e en trop | Tu as écrit « vue » : le -e est en trop, le mot est au masculin : « vu ». |  |
| 3E Franklin | n° 11 | L | « làs » → « là » | Lettre en trop | Tu as écrit « làs » : le s est en trop : « là ». |  |
| 3E Franklin | n° 11 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 11 | L | « goûte » → « goutte » | Accent + Consonne double | Tu as écrit « goûte » : attention à l'accent, et à la consonne double : « goutte ». |  |
| 3E Franklin | n° 11 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Franklin | n° 11 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 11 | L | « Quant » → « Quand » | Homophone grammatical | « Quant » et « Quand » se prononcent de la même façon ; ici, il faut « Quand ». « quand » = temps (→ lorsque). « quant à » = en ce qui concerne. « qu'en » = que+en. |  |
| 3E Franklin | n° 11 | L | « creser » → « creuser » | Lettre oubliée | Tu as écrit « creser » : il manque une lettre (u) : « creuser ». |  |
| 3E Franklin | n° 11 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Franklin | n° 12 | G | « attenduent » → « entendu » | **autre** | Compare lettre à lettre avec le mot juste : « entendu ». | oui |
| 3E Franklin | n° 12 | G | « à » → « a » | Homophone grammatical | « à » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 12 | G | « ammené » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « ammené » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Franklin | n° 12 | L | « 3 » → « trois » | Nombre en chiffres | Tu as écrit « 3 » : dans une dictée, le nombre s'écrit en lettres : « trois ». |  |
| 3E Franklin | n° 12 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 12 | G | « puanteurs » → « puanteur » | Pluriel en trop (-s, -x) | Tu as écrit « puanteurs » : le -s est en trop, ici le mot est au singulier : « puanteur ». | oui |
| 3E Franklin | n° 12 | G | « terres » → « terre » | Pluriel en trop (-s, -x) | Tu as écrit « terres » : le -s est en trop, ici le mot est au singulier : « terre ». |  |
| 3E Franklin | n° 12 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Franklin | n° 13 | G | « avont » → « avons » | -ons / -ont | Tu as écrit « avont » : -ons va avec « nous », -ont avec « ils, elles » : « avons ». |  |
| 3E Franklin | n° 13 | G | « entendut » → « entendu » | **autre** (écart Lettre muette finale, pas pour un G) | Compare lettre à lettre avec le mot juste : « entendu ». | oui |
| 3E Franklin | n° 13 | G | « venut » → « venu » | **autre** (écart Lettre muette finale, pas pour un G) | Compare lettre à lettre avec le mot juste : « venu ». |  |
| 3E Franklin | n° 13 | G | « ammené » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « ammené » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Franklin | n° 13 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 13 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 13 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 13 | L | « obu » → « obus » | Lettre muette finale | Tu as écrit « obu » : attention à la lettre muette à la fin du mot (s) : « obus ». |  |
| 3E Franklin | n° 13 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Franklin | n° 13 | G | « creusé » → « creuser » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « creusé » : la terminaison est -er, pas -é : « creuser ». |  |
| 3E Franklin | n° 14 | G | « entendue » → « entendu » | Féminin : -e en trop | Tu as écrit « entendue » : le -e est en trop, le mot est au masculin : « entendu ». | oui |
| 3E Franklin | n° 14 | L | « véicules » → « véhicules » | h muet | Tu as écrit « véicules » : il y a un h dans ce mot : « véhicules ». | oui |
| 3E Franklin | n° 14 | G | « nouveaux » → « nouveau » | Pluriel en trop (-s, -x) | Tu as écrit « nouveaux » : le -x est en trop, ici le mot est au singulier : « nouveau ». |  |
| 3E Franklin | n° 15 | L | « ammené » → « amenés » | Consonne double + Lettre muette finale | Tu as écrit « ammené » : attention à la consonne double, et à la lettre muette finale : « amenés ». | oui |
| 3E Franklin | n° 15 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 15 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 15 | G | « pouver » → « pouvez » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « pouver » : la terminaison est -ez, pas -er : « pouvez ». |  |
| 3E Franklin | n° 15 | G | « ceux » → « ce » | Homophone grammatical | « ceux » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = déterminant ou pronom singulier ; « ceux » = pronom pluriel (→ celles). |  |
| 3E Franklin | n° 15 | L | « que » → « qu » | Élision (qu', l', d'…) | Tu as écrit « que » : devant une voyelle, on élide : « qu' ». |  |
| 3E Franklin | n° 15 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 15 | G | « troues » → « trous » | Féminin : -e en trop | Tu as écrit « troues » : le -e est en trop, le mot est au masculin : « trous ». |  |
| 3E Franklin | n° 15 | L | « obu » → « obus » | Lettre muette finale | Tu as écrit « obu » : attention à la lettre muette à la fin du mot (s) : « obus ». |  |
| 3E Franklin | n° 15 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 16 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Franklin | n° 16 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Franklin | n° 16 | G | « passés » → « passé » | Pluriel en trop (-s, -x) | Tu as écrit « passés » : le -s est en trop, ici le mot est au singulier : « passé ». |  |
| 3E Franklin | n° 16 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 16 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Franklin | n° 17 | L | « vehicules » → « véhicules » | Accent | Tu as écrit « vehicules » : attention à l'accent aigu sur le e : « véhicules ». | oui |
| 3E Franklin | n° 17 | G | « ammené » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « ammené » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Franklin | n° 17 | G | « chaques » → « chaque » | Pluriel en trop (-s, -x) | Tu as écrit « chaques » : le -s est en trop, ici le mot est au singulier : « chaque ». |  |
| 3E Franklin | n° 17 | G | « instants » → « instant » | Pluriel en trop (-s, -x) | Tu as écrit « instants » : le -s est en trop, ici le mot est au singulier : « instant ». |  |
| 3E Franklin | n° 17 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Franklin | n° 18 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 18 | L | « voire » → « voir » | Lettre en trop | Tu as écrit « voire » : le e est en trop : « voir ». |  |
| 3E Franklin | n° 19 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Franklin | n° 19 | G | « cherchés » → « chercher » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « cherchés » : la terminaison est -er, pas -és : « chercher ». |  |
| 3E Franklin | n° 19 | L | « véicules » → « véhicules » | h muet | Tu as écrit « véicules » : il y a un h dans ce mot : « véhicules ». | oui |
| 3E Franklin | n° 19 | L | « amené » → « amenés » | Lettre muette finale | Tu as écrit « amené » : attention à la lettre muette à la fin du mot (s) : « amenés ». | oui |
| 3E Franklin | n° 19 | L | « j'usqua » → « jusqu » | **autre** | Compare lettre à lettre avec le mot juste : « jusqu ». |  |
| 3E Franklin | n° 19 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 19 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 19 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 3E Franklin | n° 19 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 19 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Franklin | n° 19 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 19 | G | « veux » → « veut » | -s / -x / -t final du verbe (la personne) | Tu as écrit « veux » : la terminaison dépend de la personne du sujet : « veut ». |  |
| 3E Franklin | n° 19 | G | « creusé » → « creuser » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « creusé » : la terminaison est -er, pas -é : « creuser ». |  |
| 3E Franklin | n° 19 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 3E Franklin | n° 20 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Franklin | n° 20 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Franklin | n° 20 | L | « vehicules » → « véhicules » | Accent | Tu as écrit « vehicules » : attention à l'accent aigu sur le e : « véhicules ». | oui |
| 3E Franklin | n° 20 | G | « as » → « a » | Homophone grammatical | « as » et « a » se prononcent de la même façon ; ici, il faut « a ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 20 | G | « ammener » → « amenés » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « ammener » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « amenés ». | oui |
| 3E Franklin | n° 20 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 20 | G | « kilométre » → « kilomètres » | Accent + Pluriel manquant (-s, -x) | Tu as écrit « kilométre » : attention à l'accent, et à la marque du pluriel : « kilomètres ». | oui |
| 3E Franklin | n° 20 | G | « passés » → « passé » | Pluriel en trop (-s, -x) | Tu as écrit « passés » : le -s est en trop, ici le mot est au singulier : « passé ». |  |
| 3E Franklin | n° 20 | G | « couchées » → « couchés » | Féminin : -e en trop | Tu as écrit « couchées » : le -e est en trop, le mot est au masculin : « couchés ». |  |
| 3E Franklin | n° 20 | G | « troues » → « trous » | Féminin : -e en trop | Tu as écrit « troues » : le -e est en trop, le mot est au masculin : « trous ». |  |
| 3E Franklin | n° 20 | L | « puanteure » → « puanteur » | Lettre en trop | Tu as écrit « puanteure » : le e est en trop : « puanteur ». | oui |
| 3E Franklin | n° 20 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 20 | G | « nouveaux » → « nouveau » | Pluriel en trop (-s, -x) | Tu as écrit « nouveaux » : le -x est en trop, ici le mot est au singulier : « nouveau ». |  |
| 3E Franklin | n° 21 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 21 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Franklin | n° 21 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 21 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 21 | L | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 3E Franklin | n° 21 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 21 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Franklin | n° 21 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 21 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Franklin | n° 22 | L | « signale » → « signal » | Lettre en trop | Tu as écrit « signale » : le e est en trop : « signal ». |  |
| 3E Franklin | n° 22 | G | « venus » → « venu » | Pluriel en trop (-s, -x) | Tu as écrit « venus » : le -s est en trop, ici le mot est au singulier : « venu ». |  |
| 3E Franklin | n° 22 | G | « ammener » → « amenés » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « ammener » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « amenés ». | oui |
| 3E Franklin | n° 22 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 22 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 22 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 22 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 3E Franklin | n° 22 | G | « vus » → « vu » | Pluriel en trop (-s, -x) | Tu as écrit « vus » : le -s est en trop, ici le mot est au singulier : « vu ». |  |
| 3E Franklin | n° 22 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 22 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Franklin | n° 22 | L | « boir » → « boire » | Lettre oubliée | Tu as écrit « boir » : il manque une lettre (e) : « boire ». |  |
| 3E Franklin | n° 22 | L | « puenteur » → « puanteur » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « puenteur » : le son s'écrit ici « an » : « puanteur ». | oui |
| 3E Franklin | n° 22 | G | « exhument » → « exhume » | Verbe : -nt en trop | Tu as écrit « exhument » : le sujet est au singulier, le verbe ne prend pas -nt : « exhume ». |  |
| 3E Franklin | n° 22 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Franklin | n° 22 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Franklin | n° 22 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Franklin | n° 22 | G | « tombent » → « tombe » | Verbe : -nt en trop | Tu as écrit « tombent » : le sujet est au singulier, le verbe ne prend pas -nt : « tombe ». |  |
| 3E Franklin | n° 23 | G | « ammené » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « ammené » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Franklin | n° 23 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 23 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 23 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 23 | L | « sorti » → « sortie » | Lettre oubliée | Tu as écrit « sorti » : il manque une lettre (e) : « sortie ». |  |
| 3E Franklin | n° 23 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Franklin | n° 23 | L | « puenteure » → « puanteur » | **autre** | Compare lettre à lettre avec le mot juste : « puanteur ». | oui |
| 3E Franklin | n° 23 | L | « abrit » → « abri » | Lettre muette finale | Tu as écrit « abrit » : attention à la lettre muette à la fin du mot (t) : « abri ». |  |
| 3E Franklin | n° 24 | G | « entendus » → « entendu » | Pluriel en trop (-s, -x) | Tu as écrit « entendus » : le -s est en trop, ici le mot est au singulier : « entendu ». | oui |
| 3E Franklin | n° 24 | G | « ont » → « On » | Homophone grammatical | « ont » et « On » se prononcent de la même façon ; ici, il faut « On ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Franklin | n° 24 | G | « venues » → « venu » | Féminin pluriel : -es en trop | Tu as écrit « venues » : les marques du féminin et du pluriel (-es) sont en trop : « venu ». |  |
| 3E Franklin | n° 24 | L | « amené » → « amenés » | Lettre muette finale | Tu as écrit « amené » : attention à la lettre muette à la fin du mot (s) : « amenés ». | oui |
| 3E Franklin | n° 24 | L | « quelque » → « quelques » | Lettre muette finale | Tu as écrit « quelque » : attention à la lettre muette à la fin du mot (s) : « quelques ». |  |
| 3E Franklin | n° 24 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 24 | G | « idées » → « idée » | Pluriel en trop (-s, -x) | Tu as écrit « idées » : le -s est en trop, ici le mot est au singulier : « idée ». |  |
| 3E Franklin | n° 24 | G | « vus » → « vu » | Pluriel en trop (-s, -x) | Tu as écrit « vus » : le -s est en trop, ici le mot est au singulier : « vu ». |  |
| 3E Franklin | n° 24 | G | « l'as » → « là » | Homophone grammatical | « l'as » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 3E Franklin | n° 24 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 24 | G | « instants » → « instant » | Pluriel en trop (-s, -x) | Tu as écrit « instants » : le -s est en trop, ici le mot est au singulier : « instant ». |  |
| 3E Franklin | n° 24 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 24 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 3E Franklin | n° 24 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Franklin | n° 24 | G | « suites » → « suite » | Pluriel en trop (-s, -x) | Tu as écrit « suites » : le -s est en trop, ici le mot est au singulier : « suite ». |  |
| 3E Franklin | n° 25 | G | « véhicule » → « véhicules » | Pluriel manquant (-s, -x) | Tu as écrit « véhicule » : il manque la marque du pluriel (-s). Il faut « véhicules ». | oui |
| 3E Franklin | n° 25 | G | « ammené » → « amenés » | Consonne double + Pluriel manquant (-s, -x) | Tu as écrit « ammené » : attention à la consonne double, et à la marque du pluriel : « amenés ». | oui |
| 3E Franklin | n° 25 | G | « couché » → « couchés » | Pluriel manquant (-s, -x) | Tu as écrit « couché » : il manque la marque du pluriel (-s). Il faut « couchés ». |  |
| 3E Franklin | n° 25 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Franklin | n° 26 | L | « deux » → « 2 » | **autre** | Compare lettre à lettre avec le mot juste : « 2 ». |  |
| 3E Franklin | n° 26 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 26 | L | « signale » → « signal » | Lettre en trop | Tu as écrit « signale » : le e est en trop : « signal ». |  |
| 3E Franklin | n° 26 | G | « amené » → « amenés » | Pluriel manquant (-s, -x) | Tu as écrit « amené » : il manque la marque du pluriel (-s). Il faut « amenés ». | oui |
| 3E Franklin | n° 26 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 26 | G | « quelque » → « quelques » | Pluriel manquant (-s, -x) | Tu as écrit « quelque » : il manque la marque du pluriel (-s). Il faut « quelques ». |  |
| 3E Franklin | n° 26 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 26 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 26 | G | « passés » → « passé » | Pluriel en trop (-s, -x) | Tu as écrit « passés » : le -s est en trop, ici le mot est au singulier : « passé ». |  |
| 3E Franklin | n° 26 | L | « troups » → « trous » | Lettre en trop | Tu as écrit « troups » : le p est en trop : « trous ». |  |
| 3E Franklin | n° 26 | L | « goute » → « goutte » | Consonne double | Tu as écrit « goute » : attention au t, simple ou double : « goutte ». |  |
| 3E Franklin | n° 26 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 3E Franklin | n° 26 | L | « cadavre » → « cadavres » | Lettre muette finale | Tu as écrit « cadavre » : attention à la lettre muette à la fin du mot (s) : « cadavres ». |  |
| 3E Franklin | n° 26 | G | « exumes » → « exhume » | **autre** | Compare lettre à lettre avec le mot juste : « exhume ». |  |
| 3E Franklin | n° 26 | L | « Quant » → « Quand » | Homophone grammatical | « Quant » et « Quand » se prononcent de la même façon ; ici, il faut « Quand ». « quand » = temps (→ lorsque). « quant à » = en ce qui concerne. « qu'en » = que+en. |  |
| 3E Franklin | n° 26 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Franklin | n° 27 | L | « puanteure » → « puanteur » | Lettre en trop | Tu as écrit « puanteure » : le e est en trop : « puanteur ». | oui |
| 3E Franklin | n° 27 | G | « cadavre » → « cadavres » | Pluriel manquant (-s, -x) | Tu as écrit « cadavre » : il manque la marque du pluriel (-s). Il faut « cadavres ». |  |
| 3E Franklin | n° 27 | L | « goûte » → « goutte » | Accent + Consonne double | Tu as écrit « goûte » : attention à l'accent, et à la consonne double : « goutte ». |  |
| 3E Franklin | n° 28 | L | « vehicules » → « véhicules » | Accent | Tu as écrit « vehicules » : attention à l'accent aigu sur le e : « véhicules ». | oui |
| 3E Franklin | n° 28 | G | « kilomètre » → « kilomètres » | Pluriel manquant (-s, -x) | Tu as écrit « kilomètre » : il manque la marque du pluriel (-s). Il faut « kilomètres ». | oui |
| 3E Franklin | n° 28 | L | « goûte » → « goutte » | Accent + Consonne double | Tu as écrit « goûte » : attention à l'accent, et à la consonne double : « goutte ». |  |
| 3E Franklin | n° 28 | G | « exhumes » → « exhume » | Pluriel en trop (-s, -x) | Tu as écrit « exhumes » : le -s est en trop, ici le mot est au singulier : « exhume ». |  |
| 3E Franklin | n° 28 | G | « abris » → « abri » | Pluriel en trop (-s, -x) | Tu as écrit « abris » : le -s est en trop, ici le mot est au singulier : « abri ». |  |
| 3E Franklin | n° 28 | L | « toute » → « tout » | Homophone grammatical | « toute » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 1 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 1 | G | « abatirrent » → « abattirent » | **autre** (écart Consonne double, pas pour un G) | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Hugo | n° 1 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 1 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 1 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 1 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Hugo | n° 1 | G | « répendait » → « répondaient » | **autre** | Compare lettre à lettre avec le mot juste : « répondaient ». | oui |
| 4E Hugo | n° 1 | L | « boulevar » → « boulevard » | Lettre muette finale | Tu as écrit « boulevar » : attention à la lettre muette à la fin du mot (d) : « boulevard ». | oui |
| 4E Hugo | n° 1 | L | « avenus » → « avenues » | Lettre oubliée | Tu as écrit « avenus » : il manque une lettre (e) : « avenues ». | oui |
| 4E Hugo | n° 1 | G | « eures » → « eurent » | **autre** | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Hugo | n° 1 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 1 | G | « partie » → « parties » | Pluriel manquant (-s, -x) | Tu as écrit « partie » : il manque la marque du pluriel (-s). Il faut « parties ». |  |
| 4E Hugo | n° 1 | L | « faux boures » → « faubourgs » | **autre** | Compare lettre à lettre avec le mot juste : « faubourgs ». |  |
| 4E Hugo | n° 1 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 1 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 1 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Hugo | n° 1 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 1 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Hugo | n° 1 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 1 | G | « repousser » → « repoussé » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repousser » : la terminaison est -é, pas -er : « repoussé ». | oui |
| 4E Hugo | n° 1 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Hugo | n° 1 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 1 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 2 | G | « connait » → « connaissait » | **autre** | Compare lettre à lettre avec le mot juste : « connaissait ». | oui |
| 4E Hugo | n° 2 | L | « abbatirent » → « abattirent » | Consonne double | Tu as écrit « abbatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Hugo | n° 2 | G | « neuve » → « neuves » | Pluriel manquant (-s, -x) | Tu as écrit « neuve » : il manque la marque du pluriel (-s). Il faut « neuves ». |  |
| 4E Hugo | n° 2 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Hugo | n° 2 | G | « demandés » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandés » : la terminaison est -er, pas -és : « demander ». | oui |
| 4E Hugo | n° 2 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Hugo | n° 3 | G | « Se » → « Ce » | Homophone grammatical | « Se » et « Ce » se prononcent de la même façon ; ici, il faut « Ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 3 | G | « dépassais » → « dépassait » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « dépassais » : la terminaison est -ait, pas -ais : « dépassait ». | oui |
| 4E Hugo | n° 3 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 3 | L | « connaisait » → « connaissait » | Consonne double | Tu as écrit « connaisait » : attention au n, simple ou double : « connaissait ». | oui |
| 4E Hugo | n° 3 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Hugo | n° 3 | G | « imaginais » → « imaginaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « imaginais » : le sujet est au pluriel, le verbe prend -nt : « imaginaient ». | oui |
| 4E Hugo | n° 3 | L | « empreur » → « empereur » | Lettre oubliée | Tu as écrit « empreur » : il manque une lettre (e) : « empereur ». | oui |
| 4E Hugo | n° 3 | G | « voulaient » → « voulait » | Verbe : -nt en trop | Tu as écrit « voulaient » : le sujet est au singulier, le verbe ne prend pas -nt : « voulait ». |  |
| 4E Hugo | n° 3 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 3 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 3 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 3 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Hugo | n° 3 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Hugo | n° 3 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 3 | G | « ures » → « eurent » | **autre** | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Hugo | n° 3 | G | « chassés » → « chassées » | Féminin : -e manquant | Tu as écrit « chassés » : il manque le -e du féminin : « chassées ». |  |
| 4E Hugo | n° 3 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 3 | L | « faubougs » → « faubourgs » | Lettre oubliée | Tu as écrit « faubougs » : il manque une lettre (r) : « faubourgs ». |  |
| 4E Hugo | n° 3 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 3 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 3 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 3 | G | « travailles » → « travail » | Consonne double + Féminin pluriel : -es en trop | Tu as écrit « travailles » : attention à la consonne double, et à un -es en trop : « travail ». |  |
| 4E Hugo | n° 3 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 3 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Hugo | n° 3 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 3 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 3 | G | « loyer » → « loyers » | Pluriel manquant (-s, -x) | Tu as écrit « loyer » : il manque la marque du pluriel (-s). Il faut « loyers ». |  |
| 4E Hugo | n° 3 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 4 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 4 | L | « conaissait » → « connaissait » | Consonne double | Tu as écrit « conaissait » : attention au n, simple ou double : « connaissait ». | oui |
| 4E Hugo | n° 4 | L | « ouvriés » → « ouvriers » | Accent + Lettre oubliée | Tu as écrit « ouvriés » : attention à l'accent, et à une lettre oubliée : « ouvriers ». |  |
| 4E Hugo | n° 4 | L | « abatirent » → « abattirent » | Consonne double | Tu as écrit « abatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Hugo | n° 4 | G | « entié » → « entiers » | **autre** | Compare lettre à lettre avec le mot juste : « entiers ». |  |
| 4E Hugo | n° 4 | L | « avenus » → « avenues » | Lettre oubliée | Tu as écrit « avenus » : il manque une lettre (e) : « avenues ». | oui |
| 4E Hugo | n° 4 | G | « bordés » → « bordées » | Féminin : -e manquant | Tu as écrit « bordés » : il manque le -e du féminin : « bordées ». |  |
| 4E Hugo | n° 4 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Hugo | n° 4 | L | « neveus » → « neuves » | **autre** | Compare lettre à lettre avec le mot juste : « neuves ». |  |
| 4E Hugo | n° 4 | G | « touts » → « toutes » | Féminin : -e manquant | Tu as écrit « touts » : il manque le -e du féminin : « toutes ». |  |
| 4E Hugo | n° 4 | G | « hauteurs » → « hauteur » | Pluriel en trop (-s, -x) | Tu as écrit « hauteurs » : le -s est en trop, ici le mot est au singulier : « hauteur ». |  |
| 4E Hugo | n° 4 | G | « Mes » → « Mais » | Homophone grammatical | « Mes » et « Mais » se prononcent de la même façon ; ici, il faut « Mais ». « mes » = possessif pl. « mais » = opposition (→ cependant). « m'est » = me+est (→ m'était). « met/mets » = verbe mettre. |  |
| 4E Hugo | n° 4 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 4 | L | « urent » → « eurent » | Lettre oubliée | Tu as écrit « urent » : il manque une lettre (e) : « eurent ». |  |
| 4E Hugo | n° 4 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 4 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Hugo | n° 4 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 4 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Hugo | n° 4 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 4 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Hugo | n° 4 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 4 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Hugo | n° 4 | G | « repoussés » → « repoussé » | Pluriel en trop (-s, -x) | Tu as écrit « repoussés » : le -s est en trop, ici le mot est au singulier : « repoussé ». | oui |
| 4E Hugo | n° 4 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 4 | G | « demanders » → « demander » | Pluriel en trop (-s, -x) | Tu as écrit « demanders » : le -s est en trop, ici le mot est au singulier : « demander ». | oui |
| 4E Hugo | n° 4 | L | « loyés » → « loyers » | Accent + Lettre oubliée | Tu as écrit « loyés » : attention à l'accent, et à une lettre oubliée : « loyers ». |  |
| 4E Hugo | n° 5 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Hugo | n° 5 | L | « abatirent » → « abattirent » | Consonne double | Tu as écrit « abatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Hugo | n° 5 | L | « cartiers » → « quartiers » | Le son [k] (c, qu, k) | Tu as écrit « cartiers » : le son [k] s'écrit ici « qu » : « quartiers ». |  |
| 4E Hugo | n° 5 | L | « antiers » → « entiers » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « antiers » : le son s'écrit ici « en » : « entiers ». |  |
| 4E Hugo | n° 5 | G | « égout » → « égouts » | Pluriel manquant (-s, -x) | Tu as écrit « égout » : il manque la marque du pluriel (-s). Il faut « égouts ». |  |
| 4E Hugo | n° 5 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 5 | G | « bordé » → « bordées » | Féminin pluriel : -es manquant | Tu as écrit « bordé » : il manque les marques du féminin et du pluriel (-es) : « bordées ». |  |
| 4E Hugo | n° 5 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Hugo | n° 5 | L | « pière » → « pierre » | Accent + Consonne double | Tu as écrit « pière » : attention à l'accent, et à la consonne double : « pierre ». |  |
| 4E Hugo | n° 5 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Hugo | n° 5 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Hugo | n° 5 | G | « chassait » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chassait » : la terminaison est -ées, pas -ait : « chassées ». |  |
| 4E Hugo | n° 5 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 5 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 5 | G | « perduent » → « perdu » | **autre** | Compare lettre à lettre avec le mot juste : « perdu ». |  |
| 4E Hugo | n° 5 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 5 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 5 | G | « repouser » → « repoussé » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repouser » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « repoussé ». | oui |
| 4E Hugo | n° 5 | G | « louins » → « loin » | **autre** | Compare lettre à lettre avec le mot juste : « loin ». |  |
| 4E Hugo | n° 5 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 5 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 5 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 5 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Hugo | n° 5 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 6 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 6 | L | « connaisait » → « connaissait » | Consonne double | Tu as écrit « connaisait » : attention au n, simple ou double : « connaissait ». | oui |
| 4E Hugo | n° 6 | G | « abâttir » → « abattirent » | **autre** | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Hugo | n° 6 | G | « droit » → « droites » | Féminin pluriel : -es manquant | Tu as écrit « droit » : il manque les marques du féminin et du pluriel (-es) : « droites ». |  |
| 4E Hugo | n° 6 | G | « bordée » → « bordées » | Pluriel manquant (-s, -x) | Tu as écrit « bordée » : il manque la marque du pluriel (-s). Il faut « bordées ». |  |
| 4E Hugo | n° 6 | G | « tout » → « toutes » | Homophone grammatical | « tout » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 6 | G | « mêmes » → « même » | Pluriel en trop (-s, -x) | Tu as écrit « mêmes » : le -s est en trop, ici le mot est au singulier : « même ». |  |
| 4E Hugo | n° 6 | G | « hauteurs » → « hauteur » | Pluriel en trop (-s, -x) | Tu as écrit « hauteurs » : le -s est en trop, ici le mot est au singulier : « hauteur ». |  |
| 4E Hugo | n° 6 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Hugo | n° 6 | G | « ures » → « eurent » | **autre** | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Hugo | n° 6 | G | « chasser » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chasser » : la terminaison est -ées, pas -er : « chassées ». |  |
| 4E Hugo | n° 6 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 6 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 6 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 6 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Hugo | n° 6 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 6 | G | « travailles » → « travail » | Consonne double + Féminin pluriel : -es en trop | Tu as écrit « travailles » : attention à la consonne double, et à un -es en trop : « travail ». |  |
| 4E Hugo | n° 6 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 6 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Hugo | n° 6 | G | « repoussés » → « repoussé » | Pluriel en trop (-s, -x) | Tu as écrit « repoussés » : le -s est en trop, ici le mot est au singulier : « repoussé ». | oui |
| 4E Hugo | n° 6 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Hugo | n° 6 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 6 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 7 | L | « connaisait » → « connaissait » | Consonne double | Tu as écrit « connaisait » : attention au n, simple ou double : « connaissait ». | oui |
| 4E Hugo | n° 7 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 7 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 7 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 7 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Hugo | n° 8 | L | « commancèrent » → « commencèrent » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « commancèrent » : le son s'écrit ici « en » : « commencèrent ». | oui |
| 4E Hugo | n° 8 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 8 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 8 | G | « connaiçaient » → « connaissait » | **autre** | Compare lettre à lettre avec le mot juste : « connaissait ». | oui |
| 4E Hugo | n° 8 | L | « à bâtir » → « abattirent » | **autre** | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Hugo | n° 8 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 8 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 8 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Hugo | n° 8 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Hugo | n° 8 | G | « bourdés » → « bordées » | **autre** | Compare lettre à lettre avec le mot juste : « bordées ». |  |
| 4E Hugo | n° 8 | G | « tout » → « toutes » | Homophone grammatical | « tout » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 8 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 8 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Hugo | n° 8 | G | « raipondais » → « répondaient » | **autre** | Compare lettre à lettre avec le mot juste : « répondaient ». | oui |
| 4E Hugo | n° 8 | G | « ains » → « un » | **autre** | Compare lettre à lettre avec le mot juste : « un ». |  |
| 4E Hugo | n° 8 | G | « belle » → « belles » | Pluriel manquant (-s, -x) | Tu as écrit « belle » : il manque la marque du pluriel (-s). Il faut « belles ». |  |
| 4E Hugo | n° 8 | L | « eurênt » → « eurent » | Accent | Tu as écrit « eurênt » : attention à l'accent circonflexe sur le e : « eurent ». |  |
| 4E Hugo | n° 8 | G | « uns » → « un » | Pluriel en trop (-s, -x) | Tu as écrit « uns » : le -s est en trop, ici le mot est au singulier : « un ». |  |
| 4E Hugo | n° 8 | L | « pris » → « prix » | Lettre changée | Tu as écrit « pris » : une lettre est changée (s au lieu de x) : « prix ». |  |
| 4E Hugo | n° 8 | G | « chassé » → « chassées » | Féminin pluriel : -es manquant | Tu as écrit « chassé » : il manque les marques du féminin et du pluriel (-es) : « chassées ». |  |
| 4E Hugo | n° 8 | L | « pars » → « par » | Lettre en trop | Tu as écrit « pars » : le s est en trop : « par ». |  |
| 4E Hugo | n° 8 | G | « démolition » → « démolitions » | Pluriel manquant (-s, -x) | Tu as écrit « démolition » : il manque la marque du pluriel (-s). Il faut « démolitions ». | oui |
| 4E Hugo | n° 8 | G | « partir » → « parties » | **autre** | Compare lettre à lettre avec le mot juste : « parties ». |  |
| 4E Hugo | n° 8 | L | « peurdu » → « perdu » | Lettre en trop | Tu as écrit « peurdu » : le u est en trop : « perdu ». |  |
| 4E Hugo | n° 8 | G | « repouser » → « repoussé » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repouser » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « repoussé ». | oui |
| 4E Hugo | n° 8 | G | « demandé » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandé » : la terminaison est -er, pas -é : « demander ». | oui |
| 4E Hugo | n° 9 | G | « bordés » → « bordées » | Féminin : -e manquant | Tu as écrit « bordés » : il manque le -e du féminin : « bordées ». |  |
| 4E Hugo | n° 9 | G | « repondait » → « répondaient » | Accent + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « repondait » : attention à l'accent, et à l'accord du verbe au pluriel (-nt) : « répondaient ». | oui |
| 4E Hugo | n° 9 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 9 | G | « chassés » → « chassées » | Féminin : -e manquant | Tu as écrit « chassés » : il manque le -e du féminin : « chassées ». |  |
| 4E Hugo | n° 9 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 9 | G | « faubourg » → « faubourgs » | Pluriel manquant (-s, -x) | Tu as écrit « faubourg » : il manque la marque du pluriel (-s). Il faut « faubourgs ». |  |
| 4E Hugo | n° 9 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 9 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 9 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Hugo | n° 9 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 9 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Hugo | n° 9 | G | « demandés » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandés » : la terminaison est -er, pas -és : « demander ». | oui |
| 4E Hugo | n° 9 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 9 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 9 | G | « abattir » → « abattirent » | **autre** | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Hugo | n° 10 | L | « abbatirent » → « abattirent » | Consonne double | Tu as écrit « abbatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Hugo | n° 10 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 10 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Hugo | n° 10 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Hugo | n° 11 | G | « entié » → « entiers » | **autre** | Compare lettre à lettre avec le mot juste : « entiers ». |  |
| 4E Hugo | n° 11 | G | « repondait » → « répondaient » | Accent + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « repondait » : attention à l'accent, et à l'accord du verbe au pluriel (-nt) : « répondaient ». | oui |
| 4E Hugo | n° 11 | L | « avenus » → « avenues » | Lettre oubliée | Tu as écrit « avenus » : il manque une lettre (e) : « avenues ». | oui |
| 4E Hugo | n° 11 | G | « Beaucoups » → « Beaucoup » | Pluriel en trop (-s, -x) | Tu as écrit « Beaucoups » : le -s est en trop, ici le mot est au singulier : « Beaucoup ». |  |
| 4E Hugo | n° 11 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 11 | L | « demender » → « demander » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « demender » : le son s'écrit ici « an » : « demander ». | oui |
| 4E Hugo | n° 11 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 11 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 12 | G | « voulaient » → « voulait » | Verbe : -nt en trop | Tu as écrit « voulaient » : le sujet est au singulier, le verbe ne prend pas -nt : « voulait ». |  |
| 4E Hugo | n° 12 | G | « bordés » → « bordées » | Féminin : -e manquant | Tu as écrit « bordés » : il manque le -e du féminin : « bordées ». |  |
| 4E Hugo | n° 12 | G | « c'est » → « ces » | Homophone grammatical | « c'est » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 12 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 12 | G | « demandé » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandé » : la terminaison est -er, pas -é : « demander ». | oui |
| 4E Hugo | n° 13 | G | « Se » → « Ce » | Homophone grammatical | « Se » et « Ce » se prononcent de la même façon ; ici, il faut « Ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 13 | L | « parisients » → « Parisiens » | Majuscule + Lettre en trop | Tu as écrit « parisients » : attention à la majuscule, et à une lettre en trop : « Parisiens ». | oui |
| 4E Hugo | n° 13 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Hugo | n° 13 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Hugo | n° 13 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Hugo | n° 13 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 13 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 13 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Hugo | n° 13 | G | « repoussés » → « repoussé » | Pluriel en trop (-s, -x) | Tu as écrit « repoussés » : le -s est en trop, ici le mot est au singulier : « repoussé ». | oui |
| 4E Hugo | n° 13 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 13 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Hugo | n° 14 | G | « neuvent » → « neuves » | **autre** | Compare lettre à lettre avec le mot juste : « neuves ». |  |
| 4E Hugo | n° 14 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 15 | L | « commençèrent » → « commencèrent » | Cédille | Tu as écrit « commençèrent » : il faut une cédille sous le c (ç) pour le son [s] : « commencèrent ». | oui |
| 4E Hugo | n° 15 | L | « connaicsait » → « connaissait » | Le son [s] (s, ss, c, ç, t) | Tu as écrit « connaicsait » : le son [s] s'écrit ici « s » : « connaissait ». | oui |
| 4E Hugo | n° 15 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Hugo | n° 15 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 15 | G | « eures » → « eurent » | **autre** | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Hugo | n° 15 | L | « pris » → « prix » | Lettre changée | Tu as écrit « pris » : une lettre est changée (s au lieu de x) : « prix ». |  |
| 4E Hugo | n° 15 | L | « demolitions » → « démolitions » | Accent | Tu as écrit « demolitions » : attention à l'accent aigu sur le e : « démolitions ». | oui |
| 4E Hugo | n° 15 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 15 | G | « faubourg » → « faubourgs » | Pluriel manquant (-s, -x) | Tu as écrit « faubourg » : il manque la marque du pluriel (-s). Il faut « faubourgs ». |  |
| 4E Hugo | n° 15 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 15 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Hugo | n° 15 | G | « repouser » → « repoussé » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repouser » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « repoussé ». | oui |
| 4E Hugo | n° 15 | G | « été » → « étaient » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « été » : la terminaison est -aient, pas -é : « étaient ». |  |
| 4E Hugo | n° 16 | L | « empeureur » → « empereur » | Lettre en trop | Tu as écrit « empeureur » : le u est en trop : « empereur ». | oui |
| 4E Hugo | n° 16 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 16 | G | « Beaucoups » → « Beaucoup » | Pluriel en trop (-s, -x) | Tu as écrit « Beaucoups » : le -s est en trop, ici le mot est au singulier : « Beaucoup ». |  |
| 4E Hugo | n° 16 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 17 | G | « conaissaient » → « connaissait » | Consonne double + Verbe : -nt en trop | Tu as écrit « conaissaient » : attention à la consonne double, et à un -nt en trop : « connaissait ». | oui |
| 4E Hugo | n° 17 | L | « abatirent » → « abattirent » | Consonne double | Tu as écrit « abatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Hugo | n° 17 | L | « cartiers » → « quartiers » | Le son [k] (c, qu, k) | Tu as écrit « cartiers » : le son [k] s'écrit ici « qu » : « quartiers ». |  |
| 4E Hugo | n° 17 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 17 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Hugo | n° 17 | G | « demandés » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandés » : la terminaison est -er, pas -és : « demander ». | oui |
| 4E Hugo | n° 18 | G | « commencères » → « commencèrent » | **autre** | Compare lettre à lettre avec le mot juste : « commencèrent ». | oui |
| 4E Hugo | n° 18 | L | « dépaçait » → « dépassait » | Consonne double + Lettre changée | Tu as écrit « dépaçait » : attention à la consonne double, et à une lettre changée : « dépassait ». | oui |
| 4E Hugo | n° 18 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 18 | G | « abbatir » → « abattirent » | **autre** | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Hugo | n° 18 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 18 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Hugo | n° 18 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Hugo | n° 18 | G | « border » → « bordées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « border » : la terminaison est -ées, pas -er : « bordées ». |  |
| 4E Hugo | n° 18 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Hugo | n° 18 | L | « fassades » → « façades » | Consonne double + Lettre changée | Tu as écrit « fassades » : attention à la consonne double, et à une lettre changée : « façades ». |  |
| 4E Hugo | n° 18 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 18 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 18 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 18 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Hugo | n° 18 | G | « repondait » → « répondaient » | Accent + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « repondait » : attention à l'accent, et à l'accord du verbe au pluriel (-nt) : « répondaient ». | oui |
| 4E Hugo | n° 18 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 18 | G | « chasser » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chasser » : la terminaison est -ées, pas -er : « chassées ». |  |
| 4E Hugo | n° 18 | G | « part » → « par » | **autre** (écart Lettre muette finale, pas pour un G) | Compare lettre à lettre avec le mot juste : « par ». |  |
| 4E Hugo | n° 18 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 18 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 18 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 18 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Hugo | n° 18 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 18 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Hugo | n° 18 | G | « repoussait » → « repoussé » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repoussait » : la terminaison est -é, pas -ait : « repoussé ». | oui |
| 4E Hugo | n° 18 | L | « loing » → « loin » | Lettre en trop | Tu as écrit « loing » : le g est en trop : « loin ». |  |
| 4E Hugo | n° 18 | G | « sens » → « sans » | Homophone grammatical | « sens » et « sans » se prononcent de la même façon ; ici, il faut « sans ». « sans » = préposition privation (→ avec). « s'en » = se+en (→ de cela). « sens/sent » = verbe sentir. |  |
| 4E Hugo | n° 18 | G | « demandaient » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandaient » : la terminaison est -er, pas -aient : « demander ». | oui |
| 4E Hugo | n° 18 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 19 | G | « ceux » → « ce » | Homophone grammatical | « ceux » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = déterminant ou pronom singulier ; « ceux » = pronom pluriel (→ celles). |  |
| 4E Hugo | n° 19 | L | « empreur » → « empereur » | Lettre oubliée | Tu as écrit « empreur » : il manque une lettre (e) : « empereur ». | oui |
| 4E Hugo | n° 19 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Hugo | n° 19 | L | « fammilles » → « familles » | Consonne double | Tu as écrit « fammilles » : attention au l, simple ou double : « familles ». |  |
| 4E Hugo | n° 19 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 19 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 19 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Hugo | n° 19 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 19 | G | « travailles » → « travail » | Consonne double + Féminin pluriel : -es en trop | Tu as écrit « travailles » : attention à la consonne double, et à un -es en trop : « travail ». |  |
| 4E Hugo | n° 19 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Hugo | n° 19 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 19 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 20 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Hugo | n° 20 | G | « ouvrier » → « ouvriers » | Pluriel manquant (-s, -x) | Tu as écrit « ouvrier » : il manque la marque du pluriel (-s). Il faut « ouvriers ». |  |
| 4E Hugo | n° 20 | L | « abâttirent » → « abattirent » | Accent | Tu as écrit « abâttirent » : attention à l'accent circonflexe sur le a : « abattirent ». | oui |
| 4E Hugo | n° 20 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Hugo | n° 20 | L | « creusat » → « creusa » | Lettre muette finale | Tu as écrit « creusat » : attention à la lettre muette à la fin du mot (t) : « creusa ». |  |
| 4E Hugo | n° 20 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Hugo | n° 20 | G | « neuv » → « neuves » | Féminin pluriel : -es manquant | Tu as écrit « neuv » : il manque les marques du féminin et du pluriel (-es) : « neuves ». |  |
| 4E Hugo | n° 20 | G | « hauteurs » → « hauteur » | Pluriel en trop (-s, -x) | Tu as écrit « hauteurs » : le -s est en trop, ici le mot est au singulier : « hauteur ». |  |
| 4E Hugo | n° 20 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 20 | L | « balçons » → « balcons » | Cédille | Tu as écrit « balçons » : il faut une cédille sous le c (ç) pour le son [s] : « balcons ». |  |
| 4E Hugo | n° 20 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Hugo | n° 20 | G | « chasser » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chasser » : la terminaison est -ées, pas -er : « chassées ». |  |
| 4E Hugo | n° 20 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 20 | G | « faubourg » → « faubourgs » | Pluriel manquant (-s, -x) | Tu as écrit « faubourg » : il manque la marque du pluriel (-s). Il faut « faubourgs ». |  |
| 4E Hugo | n° 20 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 20 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 20 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Hugo | n° 20 | L | « travaille » → « travail » | Consonne double + Lettre en trop | Tu as écrit « travaille » : attention à la consonne double, et à une lettre en trop : « travail ». |  |
| 4E Hugo | n° 20 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 20 | G | « reppousser » → « repoussé » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « reppousser » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « repoussé ». | oui |
| 4E Hugo | n° 20 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Hugo | n° 20 | G | « encors » → « encore » | **autre** (écart Lettre changée, pas pour un G) | Compare lettre à lettre avec le mot juste : « encore ». |  |
| 4E Hugo | n° 21 | L | « commencerent » → « commencèrent » | Accent | Tu as écrit « commencerent » : attention à l'accent grave sur le e : « commencèrent ». | oui |
| 4E Hugo | n° 21 | L | « chantiér » → « chantier » | Accent | Tu as écrit « chantiér » : attention à l'accent aigu sur le e : « chantier ». |  |
| 4E Hugo | n° 21 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 21 | L | « conaissait » → « connaissait » | Consonne double | Tu as écrit « conaissait » : attention au n, simple ou double : « connaissait ». | oui |
| 4E Hugo | n° 21 | L | « equipes » → « équipes » | Accent | Tu as écrit « equipes » : attention à l'accent aigu sur le e : « équipes ». |  |
| 4E Hugo | n° 21 | L | « ouvrillés » → « ouvriers » | **autre** | Compare lettre à lettre avec le mot juste : « ouvriers ». |  |
| 4E Hugo | n° 21 | G | « abatire » → « abattirent » | Consonne double + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « abatire » : attention à la consonne double, et à l'accord du verbe au pluriel (-nt) : « abattirent ». | oui |
| 4E Hugo | n° 21 | L | « cartiers » → « quartiers » | Le son [k] (c, qu, k) | Tu as écrit « cartiers » : le son [k] s'écrit ici « qu » : « quartiers ». |  |
| 4E Hugo | n° 21 | L | « cresa » → « creusa » | Lettre oubliée | Tu as écrit « cresa » : il manque une lettre (u) : « creusa ». |  |
| 4E Hugo | n° 21 | G | « egout » → « égouts » | Accent + Pluriel manquant (-s, -x) | Tu as écrit « egout » : attention à l'accent, et à la marque du pluriel : « égouts ». |  |
| 4E Hugo | n° 21 | G | « parisien » → « Parisiens » | Majuscule + Pluriel manquant (-s, -x) | Tu as écrit « parisien » : attention à la majuscule, et à la marque du pluriel : « Parisiens ». | oui |
| 4E Hugo | n° 21 | G | « voulaient » → « voulait » | Verbe : -nt en trop | Tu as écrit « voulaient » : le sujet est au singulier, le verbe ne prend pas -nt : « voulait ». |  |
| 4E Hugo | n° 21 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 21 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Hugo | n° 21 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Hugo | n° 21 | L | « fassades » → « façades » | Consonne double + Lettre changée | Tu as écrit « fassades » : attention à la consonne double, et à une lettre changée : « façades ». |  |
| 4E Hugo | n° 21 | G | « avais » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avais » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 21 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 21 | L | « meme » → « même » | Accent | Tu as écrit « meme » : attention à l'accent circonflexe sur le e : « même ». |  |
| 4E Hugo | n° 21 | G | « auters » → « hauteur » | **autre** | Compare lettre à lettre avec le mot juste : « hauteur ». |  |
| 4E Hugo | n° 21 | L | « repondais » → « répondaient » | **autre** | Compare lettre à lettre avec le mot juste : « répondaient ». | oui |
| 4E Hugo | n° 21 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Hugo | n° 21 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 21 | L | « pris » → « prix » | Lettre changée | Tu as écrit « pris » : une lettre est changée (s au lieu de x) : « prix ». |  |
| 4E Hugo | n° 21 | G | « famille » → « familles » | Pluriel manquant (-s, -x) | Tu as écrit « famille » : il manque la marque du pluriel (-s). Il faut « familles ». |  |
| 4E Hugo | n° 21 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Hugo | n° 21 | G | « chassée » → « chassées » | Pluriel manquant (-s, -x) | Tu as écrit « chassée » : il manque la marque du pluriel (-s). Il faut « chassées ». |  |
| 4E Hugo | n° 21 | G | « démolition » → « démolitions » | Pluriel manquant (-s, -x) | Tu as écrit « démolition » : il manque la marque du pluriel (-s). Il faut « démolitions ». | oui |
| 4E Hugo | n° 21 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 21 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Hugo | n° 21 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 21 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Hugo | n° 21 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 21 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Hugo | n° 21 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 21 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Hugo | n° 21 | L | « loing » → « loin » | Lettre en trop | Tu as écrit « loing » : le g est en trop : « loin ». |  |
| 4E Hugo | n° 21 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 21 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 21 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Hugo | n° 21 | G | « loyer » → « loyers » | Pluriel manquant (-s, -x) | Tu as écrit « loyer » : il manque la marque du pluriel (-s). Il faut « loyers ». |  |
| 4E Hugo | n° 21 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 21 | L | « ancor » → « encore » | **autre** | Compare lettre à lettre avec le mot juste : « encore ». |  |
| 4E Hugo | n° 22 | G | « dépassé » → « dépassait » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « dépassé » : la terminaison est -ait, pas -é : « dépassait ». | oui |
| 4E Hugo | n° 22 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 22 | G | « conaissaient » → « connaissait » | Consonne double + Verbe : -nt en trop | Tu as écrit « conaissaient » : attention à la consonne double, et à un -nt en trop : « connaissait ». | oui |
| 4E Hugo | n° 22 | L | « avenus » → « avenues » | Lettre oubliée | Tu as écrit « avenus » : il manque une lettre (e) : « avenues ». | oui |
| 4E Hugo | n° 22 | L | « empeure » → « empereur » | **autre** | Compare lettre à lettre avec le mot juste : « empereur ». | oui |
| 4E Hugo | n° 22 | G | « voulaient » → « voulait » | Verbe : -nt en trop | Tu as écrit « voulaient » : le sujet est au singulier, le verbe ne prend pas -nt : « voulait ». |  |
| 4E Hugo | n° 22 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Hugo | n° 22 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Hugo | n° 22 | G | « neuve » → « neuves » | Pluriel manquant (-s, -x) | Tu as écrit « neuve » : il manque la marque du pluriel (-s). Il faut « neuves ». |  |
| 4E Hugo | n° 22 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 22 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Hugo | n° 22 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Hugo | n° 22 | L | « un » → « à » | **autre** | Compare lettre à lettre avec le mot juste : « à ». |  |
| 4E Hugo | n° 22 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 22 | L | « urtent » → « eurent » | **autre** | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Hugo | n° 22 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 22 | L | « par » → « vers » | **autre** | Compare lettre à lettre avec le mot juste : « vers ». |  |
| 4E Hugo | n° 22 | G | « demandé » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandé » : la terminaison est -er, pas -é : « demander ». | oui |
| 4E Hugo | n° 22 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 23 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 23 | G | « abattires » → « abattirent » | **autre** | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Hugo | n° 23 | L | « empreur » → « empereur » | Lettre oubliée | Tu as écrit « empreur » : il manque une lettre (e) : « empereur ». | oui |
| 4E Hugo | n° 23 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 23 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Hugo | n° 23 | G | « sens » → « sans » | Homophone grammatical | « sens » et « sans » se prononcent de la même façon ; ici, il faut « sans ». « sans » = préposition privation (→ avec). « s'en » = se+en (→ de cela). « sens/sent » = verbe sentir. |  |
| 4E Hugo | n° 24 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 24 | G | « conaissaient » → « connaissait » | Consonne double + Verbe : -nt en trop | Tu as écrit « conaissaient » : attention à la consonne double, et à un -nt en trop : « connaissait ». | oui |
| 4E Hugo | n° 24 | G | « habatir » → « ouvriers » | **autre** | Compare lettre à lettre avec le mot juste : « ouvriers ». |  |
| 4E Hugo | n° 24 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Hugo | n° 24 | L | « egouts » → « égouts » | Accent | Tu as écrit « egouts » : attention à l'accent aigu sur le e : « égouts ». |  |
| 4E Hugo | n° 24 | G | « avenus » → « avenues » | Féminin : -e manquant | Tu as écrit « avenus » : il manque le -e du féminin : « avenues ». | oui |
| 4E Hugo | n° 24 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 24 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Hugo | n° 24 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Hugo | n° 24 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 24 | L | « meme » → « même » | Accent | Tu as écrit « meme » : attention à l'accent circonflexe sur le e : « même ». |  |
| 4E Hugo | n° 24 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 24 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Hugo | n° 24 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Hugo | n° 24 | G | « boulvards » → « boulevard » | **autre** | Compare lettre à lettre avec le mot juste : « boulevard ». | oui |
| 4E Hugo | n° 24 | G | « avenus » → « avenues » | Féminin : -e manquant | Tu as écrit « avenus » : il manque le -e du féminin : « avenues ». | oui |
| 4E Hugo | n° 24 | L | « pris » → « prix » | Lettre changée | Tu as écrit « pris » : une lettre est changée (s au lieu de x) : « prix ». |  |
| 4E Hugo | n° 24 | G | « chasser » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chasser » : la terminaison est -ées, pas -er : « chassées ». |  |
| 4E Hugo | n° 24 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 24 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Hugo | n° 24 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 24 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 24 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Hugo | n° 24 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 24 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Hugo | n° 24 | G | « reppouser » → « repoussé » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « reppouser » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « repoussé ». | oui |
| 4E Hugo | n° 24 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Hugo | n° 24 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 24 | G | « demandes » → « demander » | **autre** (écart Lettre changée, pas pour un G) | Compare lettre à lettre avec le mot juste : « demander ». | oui |
| 4E Hugo | n° 24 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 24 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Hugo | n° 24 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Hugo | n° 24 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 25 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Hugo | n° 25 | L | « reppousé » → « repoussé » | Consonne double | Tu as écrit « reppousé » : attention au s, simple ou double : « repoussé ». | oui |
| 4E Hugo | n° 25 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Hugo | n° 25 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 26 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 26 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 27 | L | « chantié » → « chantier » | **autre** (écart Terminaison -é / -er / -ez / -ai / -ait, pas pour un L) | Compare lettre à lettre avec le mot juste : « chantier ». |  |
| 4E Hugo | n° 27 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 27 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Hugo | n° 27 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Hugo | n° 27 | G | « conaissaient » → « connaissait » | Consonne double + Verbe : -nt en trop | Tu as écrit « conaissaient » : attention à la consonne double, et à un -nt en trop : « connaissait ». | oui |
| 4E Hugo | n° 27 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Hugo | n° 27 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Hugo | n° 27 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Hugo | n° 27 | L | « pris » → « prix » | Lettre changée | Tu as écrit « pris » : une lettre est changée (s au lieu de x) : « prix ». |  |
| 4E Hugo | n° 27 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Hugo | n° 27 | L | « faubougs » → « faubourgs » | Lettre oubliée | Tu as écrit « faubougs » : il manque une lettre (r) : « faubourgs ». |  |
| 4E Hugo | n° 27 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Hugo | n° 28 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Hugo | n° 29 | G | « commencère » → « commencèrent » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « commencère » : le sujet est au pluriel, le verbe prend -nt : « commencèrent ». | oui |
| 4E Hugo | n° 29 | L | « connaisait » → « connaissait » | Consonne double | Tu as écrit « connaisait » : attention au n, simple ou double : « connaissait ». | oui |
| 4E Hugo | n° 29 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Hugo | n° 29 | L | « neuveu » → « neuves » | Lettre changée | Tu as écrit « neuveu » : une lettre est changée (u au lieu de s) : « neuves ». |  |
| 4E Hugo | n° 29 | L | « hauteure » → « hauteur » | Lettre en trop | Tu as écrit « hauteure » : le e est en trop : « hauteur ». |  |
| 4E Hugo | n° 29 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Hugo | n° 29 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 1 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Turing | n° 1 | G | « Se » → « Ce » | Homophone grammatical | « Se » et « Ce » se prononcent de la même façon ; ici, il faut « Ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 1 | G | « dépaser » → « dépassait » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « dépaser » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « dépassait ». | oui |
| 4E Turing | n° 1 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 1 | L | « equipes » → « équipes » | Accent | Tu as écrit « equipes » : attention à l'accent aigu sur le e : « équipes ». |  |
| 4E Turing | n° 1 | G | « abatire » → « abattirent » | Consonne double + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « abatire » : attention à la consonne double, et à l'accord du verbe au pluriel (-nt) : « abattirent ». | oui |
| 4E Turing | n° 1 | L | « cartiers » → « quartiers » | Le son [k] (c, qu, k) | Tu as écrit « cartiers » : le son [k] s'écrit ici « qu » : « quartiers ». |  |
| 4E Turing | n° 1 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 1 | L | « empeur » → « empereur » | **autre** | Compare lettre à lettre avec le mot juste : « empereur ». | oui |
| 4E Turing | n° 1 | G | « vouler » → « voulait » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « vouler » : la terminaison est -ait, pas -er : « voulait ». |  |
| 4E Turing | n° 1 | G | « etait » → « étaient » | Accent + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « etait » : attention à l'accent, et à l'accord du verbe au pluriel (-nt) : « étaient ». |  |
| 4E Turing | n° 1 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 1 | G | « border » → « bordées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « border » : la terminaison est -ées, pas -er : « bordées ». |  |
| 4E Turing | n° 1 | L | « fasades » → « façades » | Lettre changée | Tu as écrit « fasades » : une lettre est changée (s au lieu de ç) : « façades ». |  |
| 4E Turing | n° 1 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 1 | L | « mémé » → « même » | Accent | Tu as écrit « mémé » : attention à l'accent circonflexe sur le e : « même ». |  |
| 4E Turing | n° 1 | G | « hauteures » → « hauteur » | Féminin pluriel : -es en trop | Tu as écrit « hauteures » : les marques du féminin et du pluriel (-es) sont en trop : « hauteur ». |  |
| 4E Turing | n° 1 | G | « est » → « et » | Homophone grammatical | « est » et « et » se prononcent de la même façon ; ici, il faut « et ». « et » = conjonction (→ et puis). « est/es » = être (→ était/étais). « ai » = avoir 1re pers. |  |
| 4E Turing | n° 1 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Turing | n° 1 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Turing | n° 1 | G | « bouts » → « bout » | Pluriel en trop (-s, -x) | Tu as écrit « bouts » : le -s est en trop, ici le mot est au singulier : « bout ». |  |
| 4E Turing | n° 1 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Turing | n° 1 | G | « c'est » → « ces » | Homophone grammatical | « c'est » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 1 | G | « belle » → « belles » | Pluriel manquant (-s, -x) | Tu as écrit « belle » : il manque la marque du pluriel (-s). Il faut « belles ». |  |
| 4E Turing | n° 1 | L | « pris » → « prix » | Lettre changée | Tu as écrit « pris » : une lettre est changée (s au lieu de x) : « prix ». |  |
| 4E Turing | n° 1 | G | « chassés » → « chassées » | Féminin : -e manquant | Tu as écrit « chassés » : il manque le -e du féminin : « chassées ». |  |
| 4E Turing | n° 1 | G | « êtais » → « étaient » | Accent + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « êtais » : attention à l'accent, et à l'accord du verbe au pluriel (-nt) : « étaient ». |  |
| 4E Turing | n° 1 | G | « partie » → « parties » | Pluriel manquant (-s, -x) | Tu as écrit « partie » : il manque la marque du pluriel (-s). Il faut « parties ». |  |
| 4E Turing | n° 1 | G | « beaucoups » → « Beaucoup » | Majuscule + Pluriel en trop (-s, -x) | Tu as écrit « beaucoups » : attention à la majuscule, et à un pluriel en trop : « Beaucoup ». |  |
| 4E Turing | n° 1 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 1 | G | « perdues » → « perdu » | Féminin pluriel : -es en trop | Tu as écrit « perdues » : les marques du féminin et du pluriel (-es) sont en trop : « perdu ». |  |
| 4E Turing | n° 1 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 1 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 1 | G | « travailles » → « travail » | Consonne double + Féminin pluriel : -es en trop | Tu as écrit « travailles » : attention à la consonne double, et à un -es en trop : « travail ». |  |
| 4E Turing | n° 1 | L | « repouser » → « repoussé » | **autre** | Compare lettre à lettre avec le mot juste : « repoussé ». | oui |
| 4E Turing | n° 1 | G | « sens » → « sans » | Homophone grammatical | « sens » et « sans » se prononcent de la même façon ; ici, il faut « sans ». « sans » = préposition privation (→ avec). « s'en » = se+en (→ de cela). « sens/sent » = verbe sentir. |  |
| 4E Turing | n° 1 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 1 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Turing | n° 1 | G | « etais » → « étaient » | Accent + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « etais » : attention à l'accent, et à l'accord du verbe au pluriel (-nt) : « étaient ». |  |
| 4E Turing | n° 1 | L | « encors » → « encore » | Lettre changée | Tu as écrit « encors » : une lettre est changée (s au lieu de e) : « encore ». |  |
| 4E Turing | n° 2 | L | « connèssait » → « connaissait » | **autre** | Compare lettre à lettre avec le mot juste : « connaissait ». | oui |
| 4E Turing | n° 2 | L | « ouvrilliers » → « ouvriers » | **autre** | Compare lettre à lettre avec le mot juste : « ouvriers ». |  |
| 4E Turing | n° 2 | L | « abatirent » → « abattirent » | Consonne double | Tu as écrit « abatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 2 | L | « aveunues » → « avenues » | Lettre en trop | Tu as écrit « aveunues » : le u est en trop : « avenues ». | oui |
| 4E Turing | n° 2 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 3 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 3 | L | « habatirent » → « abattirent » | Consonne double + Lettre en trop | Tu as écrit « habatirent » : attention à la consonne double, et à une lettre en trop : « abattirent ». | oui |
| 4E Turing | n° 3 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 3 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Turing | n° 3 | G | « Beaucoups » → « Beaucoup » | Pluriel en trop (-s, -x) | Tu as écrit « Beaucoups » : le -s est en trop, ici le mot est au singulier : « Beaucoup ». |  |
| 4E Turing | n° 3 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 3 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Turing | n° 3 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 3 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 3 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 3 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 4 | L | « commmencairent » → « commencèrent » | **autre** | Compare lettre à lettre avec le mot juste : « commencèrent ». | oui |
| 4E Turing | n° 4 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 4 | G | « connaissaient » → « connaissait » | Verbe : -nt en trop | Tu as écrit « connaissaient » : le sujet est au singulier, le verbe ne prend pas -nt : « connaissait ». | oui |
| 4E Turing | n° 4 | L | « ouvriés » → « ouvriers » | Accent + Lettre oubliée | Tu as écrit « ouvriés » : attention à l'accent, et à une lettre oubliée : « ouvriers ». |  |
| 4E Turing | n° 4 | L | « abbatirent » → « abattirent » | Consonne double | Tu as écrit « abbatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 4 | G | « s'entiée » → « entiers » | **autre** | Compare lettre à lettre avec le mot juste : « entiers ». |  |
| 4E Turing | n° 4 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 4 | G | « étais » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « étais » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 4 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 4 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Turing | n° 4 | G | « bordée » → « bordées » | Pluriel manquant (-s, -x) | Tu as écrit « bordée » : il manque la marque du pluriel (-s). Il faut « bordées ». |  |
| 4E Turing | n° 4 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Turing | n° 4 | L | « facades » → « façades » | Cédille | Tu as écrit « facades » : il faut une cédille sous le c (ç) pour le son [s] : « façades ». |  |
| 4E Turing | n° 4 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 4 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 4 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Turing | n° 4 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Turing | n° 4 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Turing | n° 4 | G | « Boulevards » → « boulevard » | Majuscule + Pluriel en trop (-s, -x) | Tu as écrit « Boulevards » : attention à la majuscule, et à un pluriel en trop : « boulevard ». | oui |
| 4E Turing | n° 4 | G | « avenus » → « avenues » | Féminin : -e manquant | Tu as écrit « avenus » : il manque le -e du féminin : « avenues ». | oui |
| 4E Turing | n° 4 | L | « ûrent » → « eurent » | Accent + Lettre oubliée | Tu as écrit « ûrent » : attention à l'accent, et à une lettre oubliée : « eurent ». |  |
| 4E Turing | n° 4 | G | « partie » → « parties » | Pluriel manquant (-s, -x) | Tu as écrit « partie » : il manque la marque du pluriel (-s). Il faut « parties ». |  |
| 4E Turing | n° 4 | L | « Faubourds » → « faubourgs » | Majuscule + Lettre changée | Tu as écrit « Faubourds » : attention à la majuscule, et à une lettre changée : « faubourgs ». |  |
| 4E Turing | n° 4 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 4 | G | « travailles » → « travail » | Consonne double + Féminin pluriel : -es en trop | Tu as écrit « travailles » : attention à la consonne double, et à un -es en trop : « travail ». |  |
| 4E Turing | n° 4 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 4 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 4 | G | « repoussée » → « repoussé » | Féminin : -e en trop | Tu as écrit « repoussée » : le -e est en trop, le mot est au masculin : « repoussé ». | oui |
| 4E Turing | n° 4 | G | « loing » → « loin » | **autre** (écart Lettre en trop, pas pour un G) | Compare lettre à lettre avec le mot juste : « loin ». |  |
| 4E Turing | n° 4 | G | « demandée » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandée » : la terminaison est -er, pas -ée : « demander ». | oui |
| 4E Turing | n° 4 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 4 | G | « encors » → « encore » | **autre** (écart Lettre changée, pas pour un G) | Compare lettre à lettre avec le mot juste : « encore ». |  |
| 4E Turing | n° 6 | L | « commmencairent » → « commencèrent » | **autre** | Compare lettre à lettre avec le mot juste : « commencèrent ». | oui |
| 4E Turing | n° 6 | G | « chantiers » → « chantier » | Pluriel en trop (-s, -x) | Tu as écrit « chantiers » : le -s est en trop, ici le mot est au singulier : « chantier ». |  |
| 4E Turing | n° 6 | L | « dépasait » → « dépassait » | Consonne double | Tu as écrit « dépasait » : attention au s, simple ou double : « dépassait ». | oui |
| 4E Turing | n° 6 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 6 | G | « connaissaient » → « connaissait » | Verbe : -nt en trop | Tu as écrit « connaissaient » : le sujet est au singulier, le verbe ne prend pas -nt : « connaissait ». | oui |
| 4E Turing | n° 6 | G | « équipe » → « équipes » | Pluriel manquant (-s, -x) | Tu as écrit « équipe » : il manque la marque du pluriel (-s). Il faut « équipes ». |  |
| 4E Turing | n° 6 | L | « habatirent » → « abattirent » | Consonne double + Lettre en trop | Tu as écrit « habatirent » : attention à la consonne double, et à une lettre en trop : « abattirent ». | oui |
| 4E Turing | n° 6 | G | « entiées » → « entiers » | **autre** | Compare lettre à lettre avec le mot juste : « entiers ». |  |
| 4E Turing | n° 6 | G | « rue » → « rues » | Pluriel manquant (-s, -x) | Tu as écrit « rue » : il manque la marque du pluriel (-s). Il faut « rues ». |  |
| 4E Turing | n° 6 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 6 | L | « Parisient » → « Parisiens » | Lettre changée | Tu as écrit « Parisient » : une lettre est changée (t au lieu de s) : « Parisiens ». | oui |
| 4E Turing | n° 6 | L | « immaginaient » → « imaginaient » | Consonne double | Tu as écrit « immaginaient » : attention au m, simple ou double : « imaginaient ». | oui |
| 4E Turing | n° 6 | L | « empeurer » → « empereur » | **autre** | Compare lettre à lettre avec le mot juste : « empereur ». | oui |
| 4E Turing | n° 6 | G | « voulais » → « voulait » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « voulais » : la terminaison est -ait, pas -ais : « voulait ». |  |
| 4E Turing | n° 6 | G | « ètais » → « étaient » | Accent + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « ètais » : attention à l'accent, et à l'accord du verbe au pluriel (-nt) : « étaient ». |  |
| 4E Turing | n° 6 | G | « neuvent » → « neuves » | **autre** | Compare lettre à lettre avec le mot juste : « neuves ». |  |
| 4E Turing | n° 6 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 6 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 6 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 6 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Turing | n° 6 | G | « c'est » → « ces » | Homophone grammatical | « c'est » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 6 | G | « belle » → « belles » | Pluriel manquant (-s, -x) | Tu as écrit « belle » : il manque la marque du pluriel (-s). Il faut « belles ». |  |
| 4E Turing | n° 6 | G | « famille » → « familles » | Pluriel manquant (-s, -x) | Tu as écrit « famille » : il manque la marque du pluriel (-s). Il faut « familles ». |  |
| 4E Turing | n° 6 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Turing | n° 6 | G | « chassée » → « chassées » | Pluriel manquant (-s, -x) | Tu as écrit « chassée » : il manque la marque du pluriel (-s). Il faut « chassées ». |  |
| 4E Turing | n° 6 | G | « d'émolition » → « démolitions » | **autre** | Compare lettre à lettre avec le mot juste : « démolitions ». | oui |
| 4E Turing | n° 6 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 6 | G | « partie » → « parties » | Pluriel manquant (-s, -x) | Tu as écrit « partie » : il manque la marque du pluriel (-s). Il faut « parties ». |  |
| 4E Turing | n° 6 | L | « fausbourgs » → « faubourgs » | Lettre en trop | Tu as écrit « fausbourgs » : le s est en trop : « faubourgs ». |  |
| 4E Turing | n° 6 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 6 | G | « perdue » → « perdu » | Féminin : -e en trop | Tu as écrit « perdue » : le -e est en trop, le mot est au masculin : « perdu ». |  |
| 4E Turing | n° 6 | G | « travaille » → « travail » | Consonne double + Féminin : -e en trop | Tu as écrit « travaille » : attention à la consonne double, et à un -e en trop : « travail ». |  |
| 4E Turing | n° 6 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 6 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 6 | G | « repousait » → « repoussé » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repousait » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « repoussé ». | oui |
| 4E Turing | n° 6 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Turing | n° 6 | G | « demandées » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandées » : la terminaison est -er, pas -ées : « demander ». | oui |
| 4E Turing | n° 6 | G | « avies » → « avis » | Féminin : -e en trop | Tu as écrit « avies » : le -e est en trop, le mot est au masculin : « avis ». |  |
| 4E Turing | n° 7 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Turing | n° 7 | G | « demandé » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandé » : la terminaison est -er, pas -é : « demander ». | oui |
| 4E Turing | n° 8 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 8 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 8 | L | « egouts » → « égouts » | Accent | Tu as écrit « egouts » : attention à l'accent aigu sur le e : « égouts ». |  |
| 4E Turing | n° 8 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 8 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Turing | n° 8 | G | « chassés » → « chassées » | Féminin : -e manquant | Tu as écrit « chassés » : il manque le -e du féminin : « chassées ». |  |
| 4E Turing | n° 8 | G | « demolission » → « démolitions » | **autre** | Compare lettre à lettre avec le mot juste : « démolitions ». | oui |
| 4E Turing | n° 8 | L | « faubourds » → « faubourgs » | Lettre changée | Tu as écrit « faubourds » : une lettre est changée (d au lieu de g) : « faubourgs ». |  |
| 4E Turing | n° 8 | G | « Beaucoups » → « Beaucoup » | Pluriel en trop (-s, -x) | Tu as écrit « Beaucoups » : le -s est en trop, ici le mot est au singulier : « Beaucoup ». |  |
| 4E Turing | n° 8 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Turing | n° 8 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 8 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 8 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 8 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 8 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 8 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Turing | n° 8 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 8 | G | « demandés » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandés » : la terminaison est -er, pas -és : « demander ». | oui |
| 4E Turing | n° 8 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 8 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 9 | L | « dépaissait » → « dépassait » | Lettre en trop | Tu as écrit « dépaissait » : le i est en trop : « dépassait ». | oui |
| 4E Turing | n° 9 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Turing | n° 9 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Turing | n° 9 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 9 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 9 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 9 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Turing | n° 9 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 9 | G | « demandés » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandés » : la terminaison est -er, pas -és : « demander ». | oui |
| 4E Turing | n° 9 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 10 | G | « commençère » → « commencèrent » | **autre** | Compare lettre à lettre avec le mot juste : « commencèrent ». | oui |
| 4E Turing | n° 10 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Turing | n° 10 | L | « dépasait » → « dépassait » | Consonne double | Tu as écrit « dépasait » : attention au s, simple ou double : « dépassait ». | oui |
| 4E Turing | n° 10 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 10 | G | « connaisaient » → « connaissait » | Consonne double + Verbe : -nt en trop | Tu as écrit « connaisaient » : attention à la consonne double, et à un -nt en trop : « connaissait ». | oui |
| 4E Turing | n° 10 | G | « abatir » → « abattirent » | **autre** | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Turing | n° 10 | G | « avenus » → « avenues » | Féminin : -e manquant | Tu as écrit « avenus » : il manque le -e du féminin : « avenues ». | oui |
| 4E Turing | n° 10 | L | « empreur » → « empereur » | Lettre oubliée | Tu as écrit « empreur » : il manque une lettre (e) : « empereur ». | oui |
| 4E Turing | n° 10 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 10 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 10 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Turing | n° 10 | G | « bordé » → « bordées » | Féminin pluriel : -es manquant | Tu as écrit « bordé » : il manque les marques du féminin et du pluriel (-es) : « bordées ». |  |
| 4E Turing | n° 10 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Turing | n° 10 | L | « fassades » → « façades » | Consonne double + Lettre changée | Tu as écrit « fassades » : attention à la consonne double, et à une lettre changée : « façades ». |  |
| 4E Turing | n° 10 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 10 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 10 | L | « auteur » → « hauteur » | h muet | Tu as écrit « auteur » : il y a un h dans ce mot : « hauteur ». |  |
| 4E Turing | n° 10 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Turing | n° 10 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Turing | n° 10 | L | « au » → « du » | Lettre changée | Tu as écrit « au » : une lettre est changée (a au lieu de d) : « du ». |  |
| 4E Turing | n° 10 | G | « c'est » → « ces » | Homophone grammatical | « c'est » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 10 | G | « belle » → « belles » | Pluriel manquant (-s, -x) | Tu as écrit « belle » : il manque la marque du pluriel (-s). Il faut « belles ». |  |
| 4E Turing | n° 10 | G | « avenus » → « avenues » | Féminin : -e manquant | Tu as écrit « avenus » : il manque le -e du féminin : « avenues ». | oui |
| 4E Turing | n° 10 | G | « eur » → « eurent » | **autre** | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Turing | n° 10 | G | « chasser » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chasser » : la terminaison est -ées, pas -er : « chassées ». |  |
| 4E Turing | n° 10 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 10 | G | « partie » → « parties » | Pluriel manquant (-s, -x) | Tu as écrit « partie » : il manque la marque du pluriel (-s). Il faut « parties ». |  |
| 4E Turing | n° 10 | L | « faux bours » → « faubourgs » | **autre** | Compare lettre à lettre avec le mot juste : « faubourgs ». |  |
| 4E Turing | n° 10 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Turing | n° 10 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 10 | G | « travaille » → « travail » | Consonne double + Féminin : -e en trop | Tu as écrit « travaille » : attention à la consonne double, et à un -e en trop : « travail ». |  |
| 4E Turing | n° 10 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 10 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Turing | n° 10 | G | « repouser » → « repoussé » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repouser » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « repoussé ». | oui |
| 4E Turing | n° 10 | L | « louin » → « loin » | Lettre en trop | Tu as écrit « louin » : le u est en trop : « loin ». |  |
| 4E Turing | n° 10 | L | « avies » → « avis » | Lettre en trop | Tu as écrit « avies » : le e est en trop : « avis ». |  |
| 4E Turing | n° 10 | G | « loyer » → « loyers » | Pluriel manquant (-s, -x) | Tu as écrit « loyer » : il manque la marque du pluriel (-s). Il faut « loyers ». |  |
| 4E Turing | n° 10 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 10 | L | « encors » → « encore » | Lettre changée | Tu as écrit « encors » : une lettre est changée (s au lieu de e) : « encore ». |  |
| 4E Turing | n° 11 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 11 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 11 | L | « abbatirent » → « abattirent » | Consonne double | Tu as écrit « abbatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 11 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 11 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 11 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 11 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 11 | G | « repousser » → « repoussé » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repousser » : la terminaison est -é, pas -er : « repoussé ». | oui |
| 4E Turing | n° 11 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Turing | n° 12 | L | « commençèrent » → « commencèrent » | Cédille | Tu as écrit « commençèrent » : il faut une cédille sous le c (ç) pour le son [s] : « commencèrent ». | oui |
| 4E Turing | n° 12 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Turing | n° 12 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 12 | G | « connaissaient » → « connaissait » | Verbe : -nt en trop | Tu as écrit « connaissaient » : le sujet est au singulier, le verbe ne prend pas -nt : « connaissait ». | oui |
| 4E Turing | n° 12 | L | « abatirent » → « abattirent » | Consonne double | Tu as écrit « abatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 12 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 12 | G | « bordé » → « bordées » | Féminin pluriel : -es manquant | Tu as écrit « bordé » : il manque les marques du féminin et du pluriel (-es) : « bordées ». |  |
| 4E Turing | n° 12 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Turing | n° 12 | G | « hauteures » → « hauteur » | Féminin pluriel : -es en trop | Tu as écrit « hauteures » : les marques du féminin et du pluriel (-es) sont en trop : « hauteur ». |  |
| 4E Turing | n° 12 | G | « ures » → « eurent » | **autre** | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Turing | n° 12 | G | « chassée » → « chassées » | Pluriel manquant (-s, -x) | Tu as écrit « chassée » : il manque la marque du pluriel (-s). Il faut « chassées ». |  |
| 4E Turing | n° 12 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 12 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 12 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 12 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 12 | G | « demandé » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandé » : la terminaison est -er, pas -é : « demander ». | oui |
| 4E Turing | n° 12 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 13 | L | « commensèrent » → « commencèrent » | Le son [s] (s, ss, c, ç, t) | Tu as écrit « commensèrent » : le son [s] s'écrit ici « c » : « commencèrent ». | oui |
| 4E Turing | n° 13 | G | « Se » → « Ce » | Homophone grammatical | « Se » et « Ce » se prononcent de la même façon ; ici, il faut « Ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 13 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 13 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 13 | L | « con » → « on » | Lettre en trop | Tu as écrit « con » : le c est en trop : « on ». |  |
| 4E Turing | n° 13 | G | « connesaient » → « connaissait » | **autre** | Compare lettre à lettre avec le mot juste : « connaissait ». | oui |
| 4E Turing | n° 13 | G | « abatirs » → « abattirent » | **autre** | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Turing | n° 13 | G | « cartier » → « quartiers » | **autre** | Compare lettre à lettre avec le mot juste : « quartiers ». |  |
| 4E Turing | n° 13 | G | « parisient » → « Parisiens » | Majuscule + -s / -x / -t final du verbe (la personne) | Tu as écrit « parisient » : attention à la majuscule, et à la terminaison de la personne (-s, -x, -t) : « Parisiens ». | oui |
| 4E Turing | n° 13 | L | « empeureur » → « empereur » | Lettre en trop | Tu as écrit « empeureur » : le u est en trop : « empereur ». | oui |
| 4E Turing | n° 13 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 13 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 13 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Turing | n° 13 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 13 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 13 | G | « raipondais » → « répondaient » | **autre** | Compare lettre à lettre avec le mot juste : « répondaient ». | oui |
| 4E Turing | n° 13 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Turing | n° 13 | G | « c'est » → « ces » | Homophone grammatical | « c'est » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 13 | G | « belle » → « belles » | Pluriel manquant (-s, -x) | Tu as écrit « belle » : il manque la marque du pluriel (-s). Il faut « belles ». |  |
| 4E Turing | n° 13 | G | « avenus » → « avenues » | Féminin : -e manquant | Tu as écrit « avenus » : il manque le -e du féminin : « avenues ». | oui |
| 4E Turing | n° 13 | G | « urent » → « eurent » | **autre** (écart Lettre oubliée, pas pour un G) | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Turing | n° 13 | G | « famille » → « familles » | Pluriel manquant (-s, -x) | Tu as écrit « famille » : il manque la marque du pluriel (-s). Il faut « familles ». |  |
| 4E Turing | n° 13 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Turing | n° 13 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 13 | G | « parti » → « parties » | Féminin pluriel : -es manquant | Tu as écrit « parti » : il manque les marques du féminin et du pluriel (-es) : « parties ». |  |
| 4E Turing | n° 13 | L | « faux bourds » → « faubourgs » | **autre** | Compare lettre à lettre avec le mot juste : « faubourgs ». |  |
| 4E Turing | n° 13 | G | « beaucoups » → « Beaucoup » | Majuscule + Pluriel en trop (-s, -x) | Tu as écrit « beaucoups » : attention à la majuscule, et à un pluriel en trop : « Beaucoup ». |  |
| 4E Turing | n° 13 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 13 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Turing | n° 13 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 13 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 13 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 13 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Turing | n° 13 | G | « repousser » → « repoussé » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repousser » : la terminaison est -é, pas -er : « repoussé ». | oui |
| 4E Turing | n° 13 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Turing | n° 13 | L | « demender » → « demander » | Les nasales (an/en, in/ain/ein, on/om) | Tu as écrit « demender » : le son s'écrit ici « an » : « demander ». | oui |
| 4E Turing | n° 13 | L | « avit » → « avis » | Lettre changée | Tu as écrit « avit » : une lettre est changée (t au lieu de s) : « avis ». |  |
| 4E Turing | n° 13 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 13 | G | « étaits » → « étaient » | **autre** | Compare lettre à lettre avec le mot juste : « étaient ». |  |
| 4E Turing | n° 14 | L | « commençairent » → « commencèrent » | **autre** | Compare lettre à lettre avec le mot juste : « commencèrent ». | oui |
| 4E Turing | n° 14 | L | « déppassait » → « dépassait » | Consonne double | Tu as écrit « déppassait » : attention au s, simple ou double : « dépassait ». | oui |
| 4E Turing | n° 14 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 14 | L | « abbattirent » → « abattirent » | Consonne double | Tu as écrit « abbattirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 14 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 14 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Turing | n° 14 | G | « border » → « bordées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « border » : la terminaison est -ées, pas -er : « bordées ». |  |
| 4E Turing | n° 14 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Turing | n° 14 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 14 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 14 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Turing | n° 14 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Turing | n° 14 | L | « urent » → « eurent » | Lettre oubliée | Tu as écrit « urent » : il manque une lettre (e) : « eurent ». |  |
| 4E Turing | n° 14 | G | « chasser » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chasser » : la terminaison est -ées, pas -er : « chassées ». |  |
| 4E Turing | n° 14 | G | « démolition » → « démolitions » | Pluriel manquant (-s, -x) | Tu as écrit « démolition » : il manque la marque du pluriel (-s). Il faut « démolitions ». | oui |
| 4E Turing | n° 14 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Turing | n° 14 | G | « reppousser » → « repoussé » | Consonne double + Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « reppousser » : attention à la consonne double, et à la terminaison (-é, -er, -ez, -ai…) : « repoussé ». | oui |
| 4E Turing | n° 14 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Turing | n° 15 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Turing | n° 15 | L | « imginaient » → « imaginaient » | Lettre oubliée | Tu as écrit « imginaient » : il manque une lettre (a) : « imaginaient ». | oui |
| 4E Turing | n° 15 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 15 | G | « Beaucoups » → « Beaucoup » | Pluriel en trop (-s, -x) | Tu as écrit « Beaucoups » : le -s est en trop, ici le mot est au singulier : « Beaucoup ». |  |
| 4E Turing | n° 15 | G | « perdues » → « perdu » | Féminin pluriel : -es en trop | Tu as écrit « perdues » : les marques du féminin et du pluriel (-es) sont en trop : « perdu ». |  |
| 4E Turing | n° 15 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 15 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 15 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 15 | G | « Ont » → « on » | Homophone grammatical | « Ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 15 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 15 | G | « repoussés » → « repoussé » | Pluriel en trop (-s, -x) | Tu as écrit « repoussés » : le -s est en trop, ici le mot est au singulier : « repoussé ». | oui |
| 4E Turing | n° 15 | G | « encors » → « encore » | **autre** (écart Lettre changée, pas pour un G) | Compare lettre à lettre avec le mot juste : « encore ». |  |
| 4E Turing | n° 16 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 16 | G | « abattir » → « abattirent » | **autre** | Compare lettre à lettre avec le mot juste : « abattirent ». | oui |
| 4E Turing | n° 16 | L | « égoux » → « égouts » | **autre** | Compare lettre à lettre avec le mot juste : « égouts ». |  |
| 4E Turing | n° 16 | L | « empreure » → « empereur » | **autre** | Compare lettre à lettre avec le mot juste : « empereur ». | oui |
| 4E Turing | n° 16 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 16 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 16 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Turing | n° 16 | G | « bordés » → « bordées » | Féminin : -e manquant | Tu as écrit « bordés » : il manque le -e du féminin : « bordées ». |  |
| 4E Turing | n° 16 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 16 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 16 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 16 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Turing | n° 16 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Turing | n° 16 | G | « boulevards » → « boulevard » | Pluriel en trop (-s, -x) | Tu as écrit « boulevards » : le -s est en trop, ici le mot est au singulier : « boulevard ». | oui |
| 4E Turing | n° 16 | G | « chassé » → « chassées » | Féminin pluriel : -es manquant | Tu as écrit « chassé » : il manque les marques du féminin et du pluriel (-es) : « chassées ». |  |
| 4E Turing | n° 16 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 16 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 16 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 16 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 16 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Turing | n° 16 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Turing | n° 16 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 16 | L | « logements » → « loyers » | **autre** | Compare lettre à lettre avec le mot juste : « loyers ». |  |
| 4E Turing | n° 16 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 17 | G | « dépaçaient » → « dépassait » | **autre** | Compare lettre à lettre avec le mot juste : « dépassait ». | oui |
| 4E Turing | n° 17 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 17 | G | « ceux » → « ce » | Homophone grammatical | « ceux » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = déterminant ou pronom singulier ; « ceux » = pronom pluriel (→ celles). |  |
| 4E Turing | n° 17 | L | « abatirent » → « abattirent » | Consonne double | Tu as écrit « abatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 17 | G | « bordés » → « bordées » | Féminin : -e manquant | Tu as écrit « bordés » : il manque le -e du féminin : « bordées ». |  |
| 4E Turing | n° 17 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 17 | G | « ce » → « se » | Homophone grammatical | « ce » et « se » se prononcent de la même façon ; ici, il faut « se ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 17 | G | « chassés » → « chassées » | Féminin : -e manquant | Tu as écrit « chassés » : il manque le -e du féminin : « chassées ». |  |
| 4E Turing | n° 17 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 17 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 18 | G | « commencère » → « commencèrent » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « commencère » : le sujet est au pluriel, le verbe prend -nt : « commencèrent ». | oui |
| 4E Turing | n° 18 | G | « dépassaient » → « dépassait » | Verbe : -nt en trop | Tu as écrit « dépassaient » : le sujet est au singulier, le verbe ne prend pas -nt : « dépassait ». | oui |
| 4E Turing | n° 18 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 18 | G | « ouvrier » → « ouvriers » | Pluriel manquant (-s, -x) | Tu as écrit « ouvrier » : il manque la marque du pluriel (-s). Il faut « ouvriers ». |  |
| 4E Turing | n° 18 | L | « abbatirent » → « abattirent » | Consonne double | Tu as écrit « abbatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 18 | G | « quartier » → « quartiers » | Pluriel manquant (-s, -x) | Tu as écrit « quartier » : il manque la marque du pluriel (-s). Il faut « quartiers ». |  |
| 4E Turing | n° 18 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Turing | n° 18 | G | « rue » → « rues » | Pluriel manquant (-s, -x) | Tu as écrit « rue » : il manque la marque du pluriel (-s). Il faut « rues ». |  |
| 4E Turing | n° 18 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 18 | G | « creusas » → « creusa » | Pluriel en trop (-s, -x) | Tu as écrit « creusas » : le -s est en trop, ici le mot est au singulier : « creusa ». |  |
| 4E Turing | n° 18 | G | « Parisien » → « Parisiens » | Pluriel manquant (-s, -x) | Tu as écrit « Parisien » : il manque la marque du pluriel (-s). Il faut « Parisiens ». | oui |
| 4E Turing | n° 18 | L | « imaginait » → « imaginaient » | **autre** (écart Verbe : -nt manquant (3e du pluriel), pas pour un L) | Compare lettre à lettre avec le mot juste : « imaginaient ». | oui |
| 4E Turing | n° 18 | G | « avenus » → « avenues » | Féminin : -e manquant | Tu as écrit « avenus » : il manque le -e du féminin : « avenues ». | oui |
| 4E Turing | n° 18 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 18 | G | « bordée » → « bordées » | Pluriel manquant (-s, -x) | Tu as écrit « bordée » : il manque la marque du pluriel (-s). Il faut « bordées ». |  |
| 4E Turing | n° 18 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Turing | n° 18 | G | « façade » → « façades » | Pluriel manquant (-s, -x) | Tu as écrit « façade » : il manque la marque du pluriel (-s). Il faut « façades ». |  |
| 4E Turing | n° 18 | G | « neuvent » → « neuves » | **autre** | Compare lettre à lettre avec le mot juste : « neuves ». |  |
| 4E Turing | n° 18 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 18 | G | « hauteurs » → « hauteur » | Pluriel en trop (-s, -x) | Tu as écrit « hauteurs » : le -s est en trop, ici le mot est au singulier : « hauteur ». |  |
| 4E Turing | n° 18 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Turing | n° 18 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 18 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Turing | n° 18 | G | « boulevards » → « boulevard » | Pluriel en trop (-s, -x) | Tu as écrit « boulevards » : le -s est en trop, ici le mot est au singulier : « boulevard ». | oui |
| 4E Turing | n° 18 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 18 | G | « belle » → « belles » | Pluriel manquant (-s, -x) | Tu as écrit « belle » : il manque la marque du pluriel (-s). Il faut « belles ». |  |
| 4E Turing | n° 18 | G | « avenus » → « avenues » | Féminin : -e manquant | Tu as écrit « avenus » : il manque le -e du féminin : « avenues ». | oui |
| 4E Turing | n° 18 | G | « famille » → « familles » | Pluriel manquant (-s, -x) | Tu as écrit « famille » : il manque la marque du pluriel (-s). Il faut « familles ». |  |
| 4E Turing | n° 18 | G | « chasser » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chasser » : la terminaison est -ées, pas -er : « chassées ». |  |
| 4E Turing | n° 18 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Turing | n° 18 | G | « faux-bourg » → « faubourgs » | **autre** | Compare lettre à lettre avec le mot juste : « faubourgs ». |  |
| 4E Turing | n° 18 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 18 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 18 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 18 | G | « travails » → « travail » | Pluriel en trop (-s, -x) | Tu as écrit « travails » : le -s est en trop, ici le mot est au singulier : « travail ». |  |
| 4E Turing | n° 18 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Turing | n° 18 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 18 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 18 | G | « reppoussée » → « repoussé » | Consonne double + Féminin : -e en trop | Tu as écrit « reppoussée » : attention à la consonne double, et à un -e en trop : « repoussé ». | oui |
| 4E Turing | n° 18 | G | « pauvre » → « pauvres » | Pluriel manquant (-s, -x) | Tu as écrit « pauvre » : il manque la marque du pluriel (-s). Il faut « pauvres ». |  |
| 4E Turing | n° 18 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 18 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 18 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 19 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 19 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 19 | G | « connaissaient » → « connaissait » | Verbe : -nt en trop | Tu as écrit « connaissaient » : le sujet est au singulier, le verbe ne prend pas -nt : « connaissait ». | oui |
| 4E Turing | n° 19 | G | « ouvriés » → « ouvriers » | **autre** | Compare lettre à lettre avec le mot juste : « ouvriers ». |  |
| 4E Turing | n° 19 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Turing | n° 19 | L | « bous » → « bout » | Lettre changée | Tu as écrit « bous » : une lettre est changée (s au lieu de t) : « bout ». |  |
| 4E Turing | n° 19 | G | « c'est » → « ces » | Homophone grammatical | « c'est » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 20 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Turing | n° 20 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 20 | G | « ceux » → « ce » | Homophone grammatical | « ceux » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = déterminant ou pronom singulier ; « ceux » = pronom pluriel (→ celles). |  |
| 4E Turing | n° 20 | L | « abbatirent » → « abattirent » | Consonne double | Tu as écrit « abbatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 20 | G | « imaginaits » → « imaginaient » | **autre** | Compare lettre à lettre avec le mot juste : « imaginaient ». | oui |
| 4E Turing | n° 20 | G | « hauteurs » → « hauteur » | Pluriel en trop (-s, -x) | Tu as écrit « hauteurs » : le -s est en trop, ici le mot est au singulier : « hauteur ». |  |
| 4E Turing | n° 20 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Turing | n° 20 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Turing | n° 20 | G | « boulevards » → « boulevard » | Pluriel en trop (-s, -x) | Tu as écrit « boulevards » : le -s est en trop, ici le mot est au singulier : « boulevard ». | oui |
| 4E Turing | n° 20 | G | « beaucoups » → « Beaucoup » | Majuscule + Pluriel en trop (-s, -x) | Tu as écrit « beaucoups » : attention à la majuscule, et à un pluriel en trop : « Beaucoup ». |  |
| 4E Turing | n° 20 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Turing | n° 20 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 20 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Turing | n° 20 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 20 | G | « demandées » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandées » : la terminaison est -er, pas -ées : « demander ». | oui |
| 4E Turing | n° 20 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 20 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 20 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Turing | n° 21 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Turing | n° 21 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 21 | G | « hauteurs » → « hauteur » | Pluriel en trop (-s, -x) | Tu as écrit « hauteurs » : le -s est en trop, ici le mot est au singulier : « hauteur ». |  |
| 4E Turing | n° 21 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 21 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 21 | L | « démolissions » → « démolitions » | Consonne double + Lettre changée | Tu as écrit « démolissions » : attention à la consonne double, et à une lettre changée : « démolitions ». | oui |
| 4E Turing | n° 21 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 22 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Turing | n° 22 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 22 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Turing | n° 22 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 22 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 22 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 22 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 22 | G | « travailles » → « travail » | Consonne double + Féminin pluriel : -es en trop | Tu as écrit « travailles » : attention à la consonne double, et à un -es en trop : « travail ». |  |
| 4E Turing | n° 22 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Turing | n° 22 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 23 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 23 | G | « connaissaient » → « connaissait » | Verbe : -nt en trop | Tu as écrit « connaissaient » : le sujet est au singulier, le verbe ne prend pas -nt : « connaissait ». | oui |
| 4E Turing | n° 23 | G | « ouvrier » → « ouvriers » | Pluriel manquant (-s, -x) | Tu as écrit « ouvrier » : il manque la marque du pluriel (-s). Il faut « ouvriers ». |  |
| 4E Turing | n° 23 | L | « immaginaient » → « imaginaient » | Consonne double | Tu as écrit « immaginaient » : attention au m, simple ou double : « imaginaient ». | oui |
| 4E Turing | n° 23 | L | « urent » → « eurent » | Lettre oubliée | Tu as écrit « urent » : il manque une lettre (e) : « eurent ». |  |
| 4E Turing | n° 23 | G | « chassés » → « chassées » | Féminin : -e manquant | Tu as écrit « chassés » : il manque le -e du féminin : « chassées ». |  |
| 4E Turing | n° 23 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Turing | n° 23 | L | « faulbourds » → « faubourgs » | **autre** | Compare lettre à lettre avec le mot juste : « faubourgs ». |  |
| 4E Turing | n° 23 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 23 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 23 | G | « la » → « là » | Homophone grammatical | « la » et « là » se prononcent de la même façon ; ici, il faut « là ». « la » = article/pronom. « là » = adverbe lieu (→ ici). « l'a/l'as » = le/la+a/as (→ l'avait). |  |
| 4E Turing | n° 23 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |
| 4E Turing | n° 23 | L | « loyés » → « loyers » | Accent + Lettre oubliée | Tu as écrit « loyés » : attention à l'accent, et à une lettre oubliée : « loyers ». |  |
| 4E Turing | n° 24 | L | « conaissait » → « connaissait » | Consonne double | Tu as écrit « conaissait » : attention au n, simple ou double : « connaissait ». | oui |
| 4E Turing | n° 24 | L | « abatirent » → « abattirent » | Consonne double | Tu as écrit « abatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 24 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 24 | G | « creusat » → « creusa » | **autre** (écart Lettre muette finale, pas pour un G) | Compare lettre à lettre avec le mot juste : « creusa ». |  |
| 4E Turing | n° 24 | L | « empeureur » → « empereur » | Lettre en trop | Tu as écrit « empeureur » : le u est en trop : « empereur ». | oui |
| 4E Turing | n° 24 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 24 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 24 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Turing | n° 24 | G | « bordé » → « bordées » | Féminin pluriel : -es manquant | Tu as écrit « bordé » : il manque les marques du féminin et du pluriel (-es) : « bordées ». |  |
| 4E Turing | n° 24 | G | « arbre » → « arbres » | Pluriel manquant (-s, -x) | Tu as écrit « arbre » : il manque la marque du pluriel (-s). Il faut « arbres ». |  |
| 4E Turing | n° 24 | G | « hauteurs » → « hauteur » | Pluriel en trop (-s, -x) | Tu as écrit « hauteurs » : le -s est en trop, ici le mot est au singulier : « hauteur ». |  |
| 4E Turing | n° 24 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 24 | G | « répondait » → « répondaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « répondait » : le sujet est au pluriel, le verbe prend -nt : « répondaient ». | oui |
| 4E Turing | n° 24 | G | « chasser » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chasser » : la terminaison est -ées, pas -er : « chassées ». |  |
| 4E Turing | n° 24 | G | « partit » → « parties » | **autre** | Compare lettre à lettre avec le mot juste : « parties ». |  |
| 4E Turing | n° 24 | L | « faux bourgs » → « faubourgs » | **autre** | Compare lettre à lettre avec le mot juste : « faubourgs ». |  |
| 4E Turing | n° 24 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Turing | n° 24 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 24 | G | « logements » → « logement » | Pluriel en trop (-s, -x) | Tu as écrit « logements » : le -s est en trop, ici le mot est au singulier : « logement ». |  |
| 4E Turing | n° 24 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 24 | G | « travailles » → « travail » | Consonne double + Féminin pluriel : -es en trop | Tu as écrit « travailles » : attention à la consonne double, et à un -es en trop : « travail ». |  |
| 4E Turing | n° 24 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 24 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 24 | G | « loins » → « loin » | Pluriel en trop (-s, -x) | Tu as écrit « loins » : le -s est en trop, ici le mot est au singulier : « loin ». |  |
| 4E Turing | n° 24 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 24 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 25 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 25 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 25 | G | « entier » → « entiers » | Pluriel manquant (-s, -x) | Tu as écrit « entier » : il manque la marque du pluriel (-s). Il faut « entiers ». |  |
| 4E Turing | n° 25 | G | « voulaient » → « voulait » | Verbe : -nt en trop | Tu as écrit « voulaient » : le sujet est au singulier, le verbe ne prend pas -nt : « voulait ». |  |
| 4E Turing | n° 25 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 25 | G | « travaille » → « travail » | Consonne double + Féminin : -e en trop | Tu as écrit « travaille » : attention à la consonne double, et à un -e en trop : « travail ». |  |
| 4E Turing | n° 25 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 25 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Turing | n° 26 | G | « grandes » → « grands » | Féminin : -e en trop | Tu as écrit « grandes » : le -e est en trop, le mot est au masculin : « grands ». |  |
| 4E Turing | n° 26 | L | « traveaux » → « travaux » | o / au / eau | Tu as écrit « traveaux » : le son [o] s'écrit ici « au » : « travaux ». |  |
| 4E Turing | n° 26 | G | « se » → « Ce » | Homophone grammatical | « se » et « Ce » se prononcent de la même façon ; ici, il faut « Ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 26 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 26 | G | « connaissaient » → « connaissait » | Verbe : -nt en trop | Tu as écrit « connaissaient » : le sujet est au singulier, le verbe ne prend pas -nt : « connaissait ». | oui |
| 4E Turing | n° 26 | L | « égous » → « égouts » | Lettre oubliée | Tu as écrit « égous » : il manque une lettre (t) : « égouts ». |  |
| 4E Turing | n° 26 | L | « immaginaient » → « imaginaient » | Consonne double | Tu as écrit « immaginaient » : attention au m, simple ou double : « imaginaient ». | oui |
| 4E Turing | n° 26 | L | « empereure » → « empereur » | Lettre en trop | Tu as écrit « empereure » : le e est en trop : « empereur ». | oui |
| 4E Turing | n° 26 | G | « étais » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « étais » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 26 | G | « auteures » → « hauteur » | **autre** | Compare lettre à lettre avec le mot juste : « hauteur ». |  |
| 4E Turing | n° 26 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 26 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 26 | G | « urent » → « eurent » | **autre** (écart Lettre oubliée, pas pour un G) | Compare lettre à lettre avec le mot juste : « eurent ». |  |
| 4E Turing | n° 26 | G | « étais » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « étais » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 26 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Turing | n° 26 | G | « Beaucoups » → « Beaucoup » | Pluriel en trop (-s, -x) | Tu as écrit « Beaucoups » : le -s est en trop, ici le mot est au singulier : « Beaucoup ». |  |
| 4E Turing | n° 26 | G | « perdues » → « perdu » | Féminin pluriel : -es en trop | Tu as écrit « perdues » : les marques du féminin et du pluriel (-es) sont en trop : « perdu ». |  |
| 4E Turing | n° 26 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 26 | G | « laugements » → « logement » | **autre** | Compare lettre à lettre avec le mot juste : « logement ». |  |
| 4E Turing | n° 26 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 26 | G | « travaills » → « travail » | Consonne double + Pluriel en trop (-s, -x) | Tu as écrit « travaills » : attention à la consonne double, et à un pluriel en trop : « travail ». |  |
| 4E Turing | n° 26 | G | « avaient » → « avait » | Verbe : -nt en trop | Tu as écrit « avaient » : le sujet est au singulier, le verbe ne prend pas -nt : « avait ». |  |
| 4E Turing | n° 26 | G | « repoussés » → « repoussé » | Pluriel en trop (-s, -x) | Tu as écrit « repoussés » : le -s est en trop, ici le mot est au singulier : « repoussé ». | oui |
| 4E Turing | n° 26 | L | « cens » → « sans » | **autre** | Compare lettre à lettre avec le mot juste : « sans ». |  |
| 4E Turing | n° 26 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 26 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 27 | L | « habatirent » → « abattirent » | Consonne double + Lettre en trop | Tu as écrit « habatirent » : attention à la consonne double, et à une lettre en trop : « abattirent ». | oui |
| 4E Turing | n° 27 | L | « empereure » → « empereur » | Lettre en trop | Tu as écrit « empereure » : le e est en trop : « empereur ». | oui |
| 4E Turing | n° 27 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 27 | G | « large » → « larges » | Pluriel manquant (-s, -x) | Tu as écrit « large » : il manque la marque du pluriel (-s). Il faut « larges ». |  |
| 4E Turing | n° 27 | G | « droite » → « droites » | Pluriel manquant (-s, -x) | Tu as écrit « droite » : il manque la marque du pluriel (-s). Il faut « droites ». |  |
| 4E Turing | n° 27 | G | « border » → « bordées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « border » : la terminaison est -ées, pas -er : « bordées ». |  |
| 4E Turing | n° 27 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 27 | G | « toute » → « toutes » | Homophone grammatical | « toute » et « toutes » se prononcent de la même façon ; ici, il faut « toutes ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 27 | G | « est » → « et » | Homophone grammatical | « est » et « et » se prononcent de la même façon ; ici, il faut « et ». « et » = conjonction (→ et puis). « est/es » = être (→ était/étais). « ai » = avoir 1re pers. |  |
| 4E Turing | n° 27 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 27 | G | « balcon » → « balcons » | Pluriel manquant (-s, -x) | Tu as écrit « balcon » : il manque la marque du pluriel (-s). Il faut « balcons ». |  |
| 4E Turing | n° 27 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 27 | G | « repondait » → « répondaient » | Accent + Verbe : -nt manquant (3e du pluriel) | Tu as écrit « repondait » : attention à l'accent, et à l'accord du verbe au pluriel (-nt) : « répondaient ». | oui |
| 4E Turing | n° 27 | G | « a » → « à » | Homophone grammatical | « a » et « à » se prononcent de la même façon ; ici, il faut « à ». « a/as » = verbe avoir (→ avait/avais). « à » = préposition. |  |
| 4E Turing | n° 27 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 27 | G | « chassaient » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chassaient » : la terminaison est -ées, pas -aient : « chassées ». |  |
| 4E Turing | n° 27 | L | « demolisions » → « démolitions » | Accent + Lettre changée | Tu as écrit « demolisions » : attention à l'accent, et à une lettre changée : « démolitions ». | oui |
| 4E Turing | n° 27 | G | « partis » → « parties » | Féminin : -e manquant | Tu as écrit « partis » : il manque le -e du féminin : « parties ». |  |
| 4E Turing | n° 27 | G | « avait » → « avaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « avait » : le sujet est au pluriel, le verbe prend -nt : « avaient ». |  |
| 4E Turing | n° 27 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 27 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 27 | G | « voisin » → « voisins » | Pluriel manquant (-s, -x) | Tu as écrit « voisin » : il manque la marque du pluriel (-s). Il faut « voisins ». |  |
| 4E Turing | n° 27 | G | « repoussait » → « repoussé » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « repoussait » : la terminaison est -é, pas -ait : « repoussé ». | oui |
| 4E Turing | n° 27 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 27 | G | « était » → « étaient » | Verbe : -nt manquant (3e du pluriel) | Tu as écrit « était » : le sujet est au pluriel, le verbe prend -nt : « étaient ». |  |
| 4E Turing | n° 28 | G | « bordés » → « bordées » | Féminin : -e manquant | Tu as écrit « bordés » : il manque le -e du féminin : « bordées ». |  |
| 4E Turing | n° 28 | G | « ses » → « ces » | Homophone grammatical | « ses » et « ces » se prononcent de la même façon ; ici, il faut « ces ». « c'est » → cela est. « s'est » → s'était. « ces » → cette (dém. pl.). « ses » → sa (poss. pl.). « sais/sait » → savais/savait. |  |
| 4E Turing | n° 28 | G | « perdus » → « perdu » | Pluriel en trop (-s, -x) | Tu as écrit « perdus » : le -s est en trop, ici le mot est au singulier : « perdu ». |  |
| 4E Turing | n° 28 | G | « leur » → « leurs » | Homophone grammatical | « leur » et « leurs » se prononcent de la même façon ; ici, il faut « leurs ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 29 | G | « tous » → « tout » | Homophone grammatical | « tous » et « tout » se prononcent de la même façon ; ici, il faut « tout ». « tout » adverbe = tout à fait. « tous/toute/toutes » = accord selon le contexte. |  |
| 4E Turing | n° 29 | G | « se » → « ce » | Homophone grammatical | « se » et « ce » se prononcent de la même façon ; ici, il faut « ce ». « ce » = démonstratif (devant nom ou → cela). « se » = réfléchi (devant verbe pronominal). |  |
| 4E Turing | n° 29 | G | « ouvrier » → « ouvriers » | Pluriel manquant (-s, -x) | Tu as écrit « ouvrier » : il manque la marque du pluriel (-s). Il faut « ouvriers ». |  |
| 4E Turing | n° 29 | L | « abatirent » → « abattirent » | Consonne double | Tu as écrit « abatirent » : attention au t, simple ou double : « abattirent ». | oui |
| 4E Turing | n° 29 | G | « ont » → « on » | Homophone grammatical | « ont » et « on » se prononcent de la même façon ; ici, il faut « on ». « on » = pronom sujet (→ il). « ont » = avoir (→ avaient). |  |
| 4E Turing | n° 29 | G | « creusaent » → « creusa » | **autre** | Compare lettre à lettre avec le mot juste : « creusa ». |  |
| 4E Turing | n° 29 | G | « vouler » → « voulait » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « vouler » : la terminaison est -ait, pas -er : « voulait ». |  |
| 4E Turing | n° 29 | G | « pierres » → « pierre » | Pluriel en trop (-s, -x) | Tu as écrit « pierres » : le -s est en trop, ici le mot est au singulier : « pierre ». |  |
| 4E Turing | n° 29 | G | « chassaient » → « chassées » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « chassaient » : la terminaison est -ées, pas -aient : « chassées ». |  |
| 4E Turing | n° 29 | G | « partient » → « parties » | **autre** | Compare lettre à lettre avec le mot juste : « parties ». |  |
| 4E Turing | n° 29 | G | « perdues » → « perdu » | Féminin pluriel : -es en trop | Tu as écrit « perdues » : les marques du féminin et du pluriel (-es) sont en trop : « perdu ». |  |
| 4E Turing | n° 29 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 29 | G | « demandaient » → « demander » | Terminaison -é / -er / -ez / -ai / -ait | Tu as écrit « demandaient » : la terminaison est -er, pas -aient : « demander ». | oui |
| 4E Turing | n° 29 | G | « leurs » → « leur » | Homophone grammatical | « leurs » et « leur » se prononcent de la même façon ; ici, il faut « leur ». « leur » pronom (invariable, devant verbe → lui). « leurs » déterminant possessif pluriel. |  |
| 4E Turing | n° 29 | G | « ou » → « où » | Homophone grammatical | « ou » et « où » se prononcent de la même façon ; ici, il faut « où ». « ou » = choix (→ ou bien). « où » = lieu/temps. |  |

## 5. La césure — 150 mots des dictées (3E, 4E, Hugo), la césure proposée, à corriger
*Règle (tes mots du 05/10) : la langue parlée ; le -e muet final ne fait pas de syllabe (« belle » = 1, « charmante » = char·mante) ; « mot long » = 3 syllabes ou plus.*

| Mot | Césure proposée | Syllabes | Mot long |
|---|---|---|---|
| centre | centre | 1 |  |
| Pour | Pour | 1 |  |
| nous | nous | 1 |  |
| lente | lente | 1 |  |
| Comme | Comme | 1 |  |
| souvent | souvent | 1 |  |
| chez | chez | 1 |  |
| ceux | ceux | 1 |  |
| sont | sont | 1 |  |
| elle | elle | 1 |  |
| trop | trop | 1 |  |
| fort | fort | 1 |  |
| cette | cette | 1 |  |
| voix | voix | 1 |  |
| douce | douce | 1 |  |
| très | très | 1 |  |
| notre | notre | 1 |  |
| clan | clan | 1 |  |
| même | même | 1 |  |
| courte | courte | 1 |  |
| devint | de·vint | 2 |  |
| parler | par·ler | 2 |  |
| d’abord | d’a·bord | 2 |  |
| propos | pro·pos | 2 |  |
| syllabes | syl·labes | 2 |  |
| atteints | at·teints | 2 |  |
| lassions | las·sions | 2 |  |
| avec | a·vec | 2 |  |
| rencontres | ren·contres | 2 |  |
| étaient | é·taient | 2 |  |
| toujours | tou·jours | 2 |  |
| durée | du·rée | 2 |  |
| n’avait | n’a·vait | 2 |  |
| état | é·tat | 2 |  |
| famille | fa·mille | 2 |  |
| finirent | fi·nirent | 2 |  |
| montrer | mon·trer | 2 |  |
| refus | re·fus | 2 |  |
| Alors | A·lors | 2 |  |
| travaux | tra·vaux | 2 |  |
| chantier | chan·tier | 2 |  |
| équipes | é·quipes | 2 |  |
| d’ouvriers | d’ou·vriers | 2 |  |
| quartiers | quar·tiers | 2 |  |
| entiers | en·tiers | 2 |  |
| creusa | creu·sa | 2 |  |
| égouts | é·gouts | 2 |  |
| voulait | vou·lait | 2 |  |
| bordées | bor·dées | 2 |  |
| façades | fa·çades | 2 |  |
| avaient | a·vaient | 2 |  |
| hauteur | hau·teur | 2 |  |
| balcons | bal·cons | 2 |  |
| familles | fa·milles | 2 |  |
| chassées | chas·sées | 2 |  |
| parties | par·ties | 2 |  |
| faubourgs | fau·bourgs | 2 |  |
| Beaucoup | Beau·coup | 2 |  |
| perdu | per·du | 2 |  |
| logement | lo·gement | 2 |  |
| travail | tra·vail | 2 |  |
| voisins | voi·sins | 2 |  |
| avait | a·vait | 2 |  |
| avis | a·vis | 2 |  |
| loyers | loy·ers | 2 |  |
| Marguerite | Mar·gue·rite | 3 | oui |
| adressions | a·dres·sions | 3 | oui |
| Penanster | Pe·nans·ter | 3 | oui |
| répétait | ré·pé·tait | 3 | oui |
| surdité | sur·di·té | 3 | oui |
| redoutait | re·dou·tait | 3 | oui |
| contrastait | con·tras·tait | 3 | oui |
| grognements | gro·gne·ments | 3 | oui |
| s’intégra | s’in·té·gra | 3 | oui |
| rapidement | ra·pi·dement | 3 | oui |
| quotidiennes | quo·ti·diennes | 3 | oui |
| informé | in·for·mé | 3 | oui |
| écrivait | é·cri·vait | 3 | oui |
| retrouver | re·trou·ver | 3 | oui |
| refusa | re·fu·sa | 3 | oui |
| dépêché | dé·pê·ché | 3 | oui |
| au-devant | au-de·vant | 3 | oui |
| signifier | si·gni·fier | 3 | oui |
| recevoir | re·ce·voir | 3 | oui |
| commencèrent | com·men·cèrent | 3 | oui |
| dépassait | dé·pas·sait | 3 | oui |
| connaissait | con·nais·sait | 3 | oui |
| abattirent | a·bat·tirent | 3 | oui |
| Parisiens | Pa·ri·siens | 3 | oui |
| avenues | a·ve·nues | 3 | oui |
| l’empereur | l’em·pe·reur | 3 | oui |
| répondaient | ré·pon·daient | 3 | oui |
| boulevard | bou·le·vard | 3 | oui |
| repoussé | re·pous·sé | 3 | oui |
| demander | de·man·der | 3 | oui |
| entendu | en·ten·du | 3 | oui |
| véhicules | vé·hi·cules | 3 | oui |
| amenés | a·me·nés | 3 | oui |
| kilomètres | ki·lo·mètres | 3 | oui |
| puanteur | pu·an·teur | 3 | oui |
| fatiguée | fa·ti·guée | 3 | oui |
| scintillement | scin·til·lement | 3 | oui |
| amuser | a·mu·ser | 3 | oui |
| élancées | é·lan·cées | 3 | oui |
| mystérieux | mys·té·rieux | 3 | oui |
| ambition | am·bi·tion | 3 | oui |
| contempler | con·tem·pler | 3 | oui |
| belvédère | bel·vé·dère | 3 | oui |
| accoudé | ac·cou·dé | 3 | oui |
| mouvements | mou·ve·ments | 3 | oui |
| naturellement | na·tu·rel·lement | 4 | oui |
| singulièrement | sin·gu·liè·rement | 4 | oui |
| n’imaginaient | n’i·ma·gi·naient | 4 | oui |
| démolitions | dé·mo·li·tions | 4 | oui |
| l’architecture | l’ar·chi·tec·ture | 4 | oui |
| colorations | co·lo·ra·tions | 4 | oui |
| merveilleusement | mer·veil·leu·sement | 4 | oui |
| entretenir | en·tre·te·nir | 4 | oui |
| curiosité | cu·rio·si·té | 4 | oui |
| préoccupations | pré·oc·cu·pa·tions | 5 | oui |
| décomposition | dé·com·po·si·tion | 5 | oui |
| aristocratique | a·ris·to·cra·ti·que | 6 | oui |
| membres | membres | 1 |  |
| leur | leur | 1 |  |
| trace | trace | 1 |  |
| mais | mais | 1 |  |
| d’eux | d’eux | 1 |  |
| grands | grands | 1 |  |
| tout | tout | 1 |  |
| qu’on | qu’on | 1 |  |
| Sous | Sous | 1 |  |
| rues | rues | 1 |  |
| larges | larges | 1 |  |
| droites | droites | 1 |  |
| d’arbres | d’arbres | 1 |  |
| neuves | neuves | 1 |  |
| toutes | toutes | 1 |  |
| leurs | leurs | 1 |  |
| pierre | pierre | 1 |  |
| d’un | d’un | 1 |  |
| bout | bout | 1 |  |
| l’autre | l’autre | 1 |  |
| belles | belles | 1 |  |
| eurent | eurent | 1 |  |
| prix | prix | 1 |  |
| pauvres | pauvres | 1 |  |
| vers | vers | 1 |  |
| plus | plus | 1 |  |
| loin | loin | 1 |  |
| sans | sans | 1 |  |