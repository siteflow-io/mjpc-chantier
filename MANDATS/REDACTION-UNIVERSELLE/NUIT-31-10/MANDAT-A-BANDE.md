# Mandat A — la bande : le mot par mot ⇧R, puis l'aller-retour avec l'IA sans mélange (nuit du 31/10, conscience n°14)

Lis d'abord `COMMUN.md` (même dossier) : les règles, les commandes, la livraison. Ton arbre : `$S/wt-nuit-a`, branche `c14-nuit-a`. **Ton territoire : `recopie.js`, `recopie.css`, `banc/recopie.mjs`.** Dans cet ordre ; chaque morceau fini est commité et poussé avant le suivant.

## A1 — le mot par mot ⇧R dans la bande

**Pour la classe.** La bande s'arrête seulement aux fautes proposées par l'IA. Quand l'IA en a laissé passer une, Paul doit pouvoir passer la ligne mot par mot, comme en correction de dictée, et marquer la faute oubliée. Paul, 30/10 18:29 : « la bande passe exactement comme en correction dictée ». Décidé (C14 183, « ok » 09:57) : « ⇧R = la dictée » ; (C14 196, acquis) : « en dictée, on marque une faute avec G ou L, qui n'existent pas en rédaction. Je propose F (faute) ; Entrée et Espace y restent "le mot est correct", comme en dictée. »

**Le modèle.** Lis dans `correction_dictee.html` (production, lecture seule) le mode mot par mot (sa touche ⇧R, ses touches, son affichage, son retour en arrière, ce qui se passe en fin de ligne et en fin de copie). Reprends-le geste pour geste, sauf G et L, remplacés par F.

**Ce qui existe.** La bande : `rcBandeOuvrir`, `rcBandeRendre` (la photo en ruban `rcBandePhoto`, le texte en ruban `rcRubanTexte`), `rcBandeClavier` (à un arrêt : Entrée ou Espace = oui, c'est une faute ; N = non ; Retour arrière ; ← → glissent le cadre ; Ctrl+Z), `rcBandeDecider` (une faute gardée devient une marque des scans par `scPoser`, rangée dans `l.marquesBande[cle]`, et `l.decisions[cle]`), la place du cadre `rcPlaceSeg(a)` (déjà entre le début et la fin de l'encre de la ligne), les mots d'une ligne `rcPosMots`, la reprise `rcBandeMemoriser` (`recopie.bandeArret`).

**Ce que tu codes.**
1. ⇧R bascule entre « les arrêts » (aujourd'hui) et « mot par mot ». Le mode est écrit en clair au-dessus de la bande, avec ce que font les touches dans ce mode (C14 183 : « ce qui change de sens d'un mode à l'autre est écrit en clair à l'arrêt »). Le mode et la place sont gardés pour la reprise (même logique que `bandeArret`), et ⇧R revient à l'arrêt le plus proche du mot où l'on était.
2. Mot par mot : chaque mot et chaque ponctuation de chaque ligne écrite, dans l'ordre de la copie, est un arrêt ; le cadre se pose sur le mot dans la photo (même placement que les arrêts), le mot est au centre du ruban de texte. Entrée ou Espace = le mot est correct, mot suivant ; F = faute sur ce mot ; Retour arrière = mot précédent ; Échap = fermer, comme aujourd'hui.
3. F sur un mot qui est dans une faute proposée par l'IA = la même chose qu'Entrée à cet arrêt en mode arrêts (la faute est gardée, avec son type). F sur un autre mot = une faute oubliée par l'IA : une marque des scans comme dans `rcBandeDecider`, `bande: { ligne, cle, eleve: <le mot>, corrige: null, code: null, oubliee: true }`, une clé qui ne peut pas rencontrer celle d'un écart de l'IA, et la décision rangée de la même façon. Sans type (G et L n'existent pas en rédaction) : son cadre et sa marque sont gris neutre. F une deuxième fois sur le même mot retire cette faute (rien n'est perdu sans le geste).
4. Un clic sur un mot du ruban de texte, en mot par mot, y amène la bande.
5. Le compteur d'en haut et le flux comptent ces fautes avec les autres ; la note de la langue (`scNote`) aussi, puisque ce sont des marques.

**Banc (par le geste).** Ouvrir la bande d'une copie de la maquette, ⇧R, Entrée trois fois (3 mots passés, 0 marque), F sur un mot hors des fautes proposées (1 marque grise, `oubliee`), F à nouveau (0), F sur un mot d'une faute proposée (la faute gardée, avec son type), ⇧R (retour aux arrêts, à l'arrêt le plus proche), recharger la page (même mode, même mot). Capture `C14-40-bande-mot-par-mot.png`.

## A2 — l'aller-retour avec l'IA sans mélange (dette déclarée par Paul)

**Pour la classe.** Paul, 31/10 15:59 : « les élèves doivent être identifiés. sinon c'est la porte ouverte au mélange de données. » Le nom d'un élève ne part jamais chez l'IA (décision C14 182). Il faut qu'une correction rendue par l'IA ne puisse jamais tomber sur une autre copie, ni sur une autre ligne.

**Ce qui existe.** `rcExportIA` (les copies numérotées sans nom, chaque ligne avec son identité `id`, `l.envoiIA = { texte, le }`, `recopie.envoi = { n, le, lignes }`), `rcIALire` (lit les formats `mjpc-recopie-ia-1`, `-2`, `-3`, retour coupé), `rcIAChargerSuite` (raccroche par l'identité de la ligne, refuse une ligne changée depuis l'envoi, `recopie.charge`), `rcFluxRendre` (le tableau du flux).

**Ce que tu codes.**
1. Mesure d'abord : les identités de lignes (`scId("ligne")` et celles posées à la détection des lignes) sont-elles uniques dans toute la classe ? Écris la réponse au rapport.
2. Chaque copie reçoit une identité interne (champ ajouté, par exemple `recopie.id`, créée une fois, jamais le nom) et part avec elle dans l'export ; chaque envoi garde la liste des identités de lignes parties pour chaque copie.
3. Au chargement, une ligne rendue est appliquée seulement si elle est partie dans un envoi, dans cette copie-là, et si son texte n'a pas changé depuis (déjà fait). Sinon elle est refusée et comptée.
4. Une ligne rendue qui ne ressemble plus à la ligne envoyée (la correction d'orthographe garde la plupart des mots : refuse si moins de la moitié des mots de la ligne envoyée se retrouvent dans la ligne rendue, en constante nommée `RC_RESSEMBLANCE_IA = 0.5` ; la conscience mesure ce seuil sur les vraies copies et l'écrit dans `NUIT-31-10/SEUIL-A2.md` — lis-le s'il existe avant ta fin) est refusée et comptée : c'est le cas où l'IA a échangé deux lignes.
5. Les refus sont dits en clair à Paul après le chargement (combien, quelles copies par leur numéro dans l'envoi), et le flux le montre. Les anciens formats de retour (-1, -2, -3) se chargent toujours. La consigne envoyée à l'IA (`RC_CONSIGNE_IA`) ne change pas ; si tu dois la changer, ne la change pas et écris pourquoi au rapport.

**Banc.** Un retour d'IA réaliste où deux lignes de deux copies ont été échangées : 2 lignes refusées, comptées, dites ; les autres chargées. Un retour avec une ligne d'une copie qui n'était pas dans l'envoi : refusée. Un ancien retour `-2` : chargé. Capture `C14-41-retour-ia-refus.png`.

## A3 — seulement s'il reste du temps à 03:30 : la feuille épouse la fin de l'encre (C14 152)

Dans la feuille de recopie (à droite de la photo), le texte d'une ligne finit là où l'encre de l'élève finit sur la photo (la bande, elle, place déjà les mots entre le début et la fin de l'encre). Affichage seulement : rien d'enregistré ne change, les lignes vertes ne bougent pas, la ligne où Paul tape n'est jamais retouchée pendant qu'il tape, la taille des lettres reste entre 80 % et 120 %. Si ce n'est pas propre au banc et sur la capture, ne le livre pas et écris-le.
