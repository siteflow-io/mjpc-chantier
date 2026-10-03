# AUDIT L15 — la correction de dictée : paramétrage aménagé, propositions, accueil, onglets, analyse automatique (conscience n°12, 03/10/2026)

*Mesuré sur la production 6.7.0-L13 (faux hub du kit anonymisé pour les gestes ; le vrai hub en lecture seule pour les copies). Rien n'est codé : audit et cadrage à venir. Dettes n°12 · 102 → 109.*

## 1. Le paramétrage de la version aménagée (Préparation) — par le geste
| Geste | Ce qui se passe | Verdict |
|---|---|---|
| cocher « 📘 Paramétrer une version aménagée » | `enabled:true` est écrit au hub aussitôt **et l'app bascule sur l'onglet Correction** (la grille) : l'écran de paramétrage disparaît, il faut revenir sur Préparation | **ne va pas** (102) |
| cliquer un mot dans « Sélection des lacunes » | la lacune est créée et écrite au hub aussitôt (`lacunes[]` : tokenIdx, word, type L, propositions, indice, raisonnement) | va |
| recliquer le même mot (« reclique pour la retirer », dit l'infobulle) | **la lacune reste** | **ne va pas** (104) |
| choisir « B — Trou simple » (mode par défaut) | le hub garde `defaultMode: "A"` ; rien n'est écrit au clic | **ne va pas** (105) — il faut mesurer si « Enregistrer » le pose ; au clic, non |
| « Note sur », « Consigne », « ↻ Regénérer la consigne » | présents ; non mesurés geste par geste (temps) — à inclure dans L15 | je ne sais pas |
| recharger la page (F5) | **retour à l'accueil** : la dictée, l'onglet, l'écran de paramétrage sont perdus (l'adresse ne porte ni la dictée ni l'onglet) | **ne va pas** (103) |
Les lacunes sont bien sauvées au clic ; le reste du paramétrage (mode, note, consigne) dépend d'un « Enregistrer » que je n'ai pas mesuré — à mesurer dans L15.

## 2. Les « 3 propositions » du mode A — mesuré dans le code (`suggestDistracteurs`)
La fabrique : permutations d'accents (é↔è, à→a…), **doublement spéculatif d'une consonne au hasard** (« ddevint », « nnaturellement »), dédoublement, terminaisons (-é/-er/-ait), -s/-x, une petite table d'homophones ; **aucun contrôle de crédibilité**, et quand il manque des candidats, **une proposition vide** (« devint », « ddevint », « »). L'indice et le raisonnement sont des phrases génériques, parfois hors sujet (« courrier → courriel » pour « naturellement »). **Verdict : ne va pas (106).** Cadrage à faire (L15 fin) : la première source doit être **les vraies formes fautives** capitalisées (L10 : `correction_dictee_erreurs`, par mot attendu, triées par fréquence) ; à défaut, des règles ciblées par ce que le mot permet (accord, terminaison, accent, double consonne) ; jamais de vide, jamais une forme identique au mot ; Paul édite à la main.

## 3. Injecter une dictée depuis un PDF (classique et préparée)
**La pièce jointe n'est pas arrivée dans la conversation** : rien à mesurer. À cadrer dès que Paul la renvoie (le format exact, ce qui doit entrer : titre, texte, mots préparés, barème…). (108)

## 4. L'accueil professeur (capture `L15-accueil.png`)
Ce qu'il montre : la liste des dictées (badges « Aménagée · n », « Préparée / Type brevet », « Publiée », ✏️ ⧉ 🗑️ Ouvrir) ; puis **le bloc « Mode test »** en pleine largeur (Regénérer, Tout effacer, « Éprouver les mécanismes livrés » avec trois boutons, « Se mettre à la place d'un élève » avec six boutons) — un bloc d'atelier qui prend la moitié de l'écran de travail. Observations : le mode test et ses outils d'éprouvette sont au même niveau que les dictées ; « Aménagée · 0 » sur une dictée dont la version est activée sans trou ; « Nouvelle dictée » est en dessous (hors écran à 768 px). **À cadrer (109)** : la place du mode test (replié, en bas, ou dans Données ?), la place de « Nouvelle dictée », ce que doivent dire les badges — c'est à Paul.

## 5. Les onglets d'une dictée, le rechargement
F5 sur n'importe quel onglet (Préparation, Correction, Rapide, Données, Réglages) → **l'accueil** ; aucun onglet n'est tenu, la dictée ouverte non plus. **Ne va pas (103).** Cadrage : l'adresse porte la dictée et l'onglet (`?dictee=…&onglet=…`), F5 rouvre au même endroit — comme la copie reprend là où on était (L1).

## 6. L15.1 — l'analyse automatique des erreurs (`gramComment`), sur les 37 copies des 3E (514 erreurs)
Mesuré : le commentaire est choisi **d'après le mot attendu et le type seulement — jamais d'après ce que l'élève a écrit**. Résultat sur les copies réelles : **50 % des commentaires sont génériques** (« Erreur de grammaire — vérifie les accords… », « Erreur de lexique… »), et parmi les autres, plusieurs sont **faux** :
- « abri » écrit « abris » (G, 13 fois) → « Participe en -i — même règle d'accord » (abri est un nom : l'erreur est un -s de trop) ;
- « quelques » écrit « quelque » (13) → « Participe en -u + Déterminant pluriel » ;
- « amenés » écrit « ammené » (8) → « Participe en -é » (la faute est le double m, et l'accord) ;
- « goutte » écrit « goûte » (8) → « Double consonne » (la faute est l'accent) ;
- « kilomètres » écrit « kilomètre » (13), « cadavres » → « cadavre » (20), « exhume » → « exhumes » / « exhument » (28), « instant » → « instants » (7) → générique, alors que l'écart est toujours le même : **un -s / un -nt en trop ou en moins** ;
- « trois » écrit « 3 » (7) → générique L.
Ce qui est juste : les homophones de la table (« à » / « a », « on » / « ont »), les participes quand l'écart est bien un accord (« couchés » → « couché », « venu » → « venus », « entendu » → « entendus »).
**Verdict : ne va pas (107).** Cadrage à faire : analyser **l'écart entre la forme de l'élève et le mot attendu** (lettres en plus / en moins / changées : -s, -nt, -e, accent, consonne double, terminaison -é/-er, homophone connu) et en déduire le commentaire ; quand l'écart n'est pas reconnu, un commentaire honnête (« Compare lettre à lettre : … ») plutôt qu'une règle au hasard ; et nourrir ça des formes capitalisées (L10) et des formes acceptées (L11).

## Ce que je demande à Paul pour écrire L15
- (1) le PDF (le format d'injection) ; (2) ses choix pour l'accueil (le mode test où ? « Nouvelle dictée » où ?) ; (3) pour les propositions et l'analyse : d'accord sur « les vraies formes des élèves d'abord, puis l'écart lettre à lettre » ? ; (4) l'ordre : L15 = paramétrage (102-105), onglets (103), accueil (109), propositions (106), injection (108) ; L15.1 = l'analyse (107).
