# DICTEE6 — MANDAT D'EXÉCUTION (passation complète de Paul, 18/08/2026 — VERSÉE EN DETTE le 23/08)
STATUT : la phase 1 (maquettes, arbitrage) est au rapport.md de ce dossier. CE MANDAT (phase 2, le code)
N'A JAMAIS ÉTÉ EXÉCUTÉ. Prérequis VÉRIFIÉ le 23/08 : DICTEE5 est PROMUE (prod = 596 070 o,
md5 be0dbf9e742a605707a13e5e934ea15a, TYPE_STYLE présent). Le mandat est exécutable tel quel.
Fichier : correction_dictee.html UNIQUEMENT. Hub : lecture seule. Livraison : sas DICTEE6/.

LE PROBLÈME (mesuré) : 3 couches par mot fautif (correction verte dessus / mot barré / badges dessous),
couches en absolute translateX(-50%) => largeur nulle dans le flux => 17 chevauchements sur 2 copies
réelles, jusqu'à 40 px ; le mot fantôme « l'argent » (2 M adjacents soudés) ; 7/17 impliquent un M,
10/17 aucun. La cause : l'écart largeur mot / largeur annotation (P +50 px, M +40, E +30, G +8, L +6).

LES 7 RÈGLES VALIDÉES PAR PAUL (leur COMBINAISON fait le résultat) :
1. PAYSAGE, copie 1180 px (au lieu de 780) — 7-9 lignes au lieu de 17 ; seul, il n'améliore RIEN
   (11 chevauchements) : ne vaut qu'avec la règle 2.
2. RÉSERVATION DE LARGEUR : min-width(layer-base)=max(largeur top, largeur after)+8 px, seulement si
   plus large que le mot ; couches centrées inchangées ; ligne de base intacte. Mesuré : 0 chevauchement.
3. DÉROGATION MANQUANTS (idée de Paul) : type M => le mot correct s'écrit À SA PLACE dans la phrase,
   vert #276749, ITALIQUE GRAS (signal validé, ne pas retirer), fond rgba(151,90,22,.10), padding 0 5px,
   radius 3px ; couche du dessus masquée pour ce type. Le mot est DÉJÀ dans layer-base sous .vert (masqué).
   Écart min entre corrections vertes voisines : 7 => 17 px.
4. PASTILLES sur les mots barrés : padding 1px 4px, radius 4px, margin 0 1px, fond à 7 % de la couleur
   du type (dérivée de TYPE_STYLE). Délimite sans ajouter d'espace (« qu'ils », « eux-mêmes ») —
   demandée explicitement par Paul, PAS cosmétique.
5. INTERLIGNE 3,8 (creux mesuré 14 px ; 3,4 => 6 px ; 3,0 => -1 px) + FILETS CALCULÉS : position =
   milieu entre bas des annotations de la ligne N et haut de celles de N+1. JAMAIS de filet périodique
   (coupe les corrections vertes — erreur commise puis écartée, repérée par Paul).
6. LES POINTS EN MARGE, LES TYPES DANS LE TEXTE (rectification explicite de Paul) : seuls les points
   perdus migrent — colonne 250 px à droite, groupés PAR LIGNE en face de leur ligne. La colonne
   unique continue est ÉCARTÉE (38 lignes face à 8). Badge de type seul sous le mot ≈ 20 px (vs 60).
7. NUMÉROTATION UNIQUE : une seule série dans l'ordre du texte — trou numéroté (mode rapide) => LE TROU
   PORTE LE NUMÉRO (mécanisme DICTEE2, data-trou, à réutiliser) ; mot saisi => numéro en exposant.
   Le même numéro sert la marge ET le détail en bas. PIÈGE VÉCU : une 2e série produit deux numéros
   par erreur et rend la copie incompréhensible.
PIÈGE TECHNIQUE : .mot .layer-base>span{display:none} masque tout ajout — réafficher explicitement
(display:inline-block !important) le numéro d'appel et le vert des M. Vérifier À L'IMAGE (le textContent
ne détecte pas l'invisibilité).

RÉPARATION DU MÊME LOT : 2 règles codent la couleur en dur (le vert-top et le .vert du type P => #c53030
rouge au lieu du magenta TYPE_STYLE) — à dériver de TYPE_STYLE. Aucune note touchée.

PISTES ÉCARTÉES SUR MESURE (ne pas rouvrir sans raison nouvelle) : alignement à gauche (11 chev., aggrave) ·
couches dans le flux (0 chev. mais ligne de base ondule) · filets seuls (10 chev.) · marge seule (2 chev.,
mot fantôme intact) · filet périodique · colonne unique · portrait avec colonne (17 lignes, +22 %, texte 530 px).

NE PAS CASSER : trous numérotés + numérotation stable · les 3 couches · modes Rien/Brut/Barré/Placeholder/
Vert direct · cases Correction verte / Badge type / Points perdus (décochée => la marge disparaît) ·
LES 3 CONTEXTES DE RENDU IDENTIQUES (aperçu Copies, modale élève, export HTML autonome — l'export embarque
le script de mesure) · TYPE_COST intouché, 0 note modifiée (recalcul comparatif sur 145 copies, méthode connue) ·
bilan, détail, autocorrection.

LA MATIÈRE (piège vérifié : 4 dictées sur 5 en mode rapide SANS mot saisi => télescopage invisible) :
dictee_5e_chapitre_utopie-5e_herge (31 copies, 517 fautifs saisis) = LA base. Copies à rendre au minimum :
bouton_amauri (38 erreurs, 0/20 : « bâties eux-mêmes », le mot fantôme l'/argent idx 125-127, « qu'ont » en
bord droit, jetons collés) · cadiou_fourrier_louann (4e Banksy, 39 erreurs, copie à trous = le cas le plus
fréquent, révèle la double numérotation) · complément : guegnard_lysandre (3 M consécutifs « et il pensa »).
MÉTHODE DE MESURE (celle du maquettage) : banc Puppeteer, firebase mocké seed mémoire, buildCopieHtml appelé
directement (data depuis __SEED__, tokenize, mode barre+badge+points+vert), HTML rechargé nu + CSS/JS de
maquette injectés ; collision = paires de fautifs même ligne (écart vertical <6 px) avec écart horizontal
<6 px entre couches. CIBLES : 0 chevauchement · vertes voisines >=17 px · badges voisins >=16 px · creux
~14 px · 1 numéro par erreur · 0 note modifiée.

RÈGLES DE TRAVAIL : lecture intégrale du fichier · tailles avant/après par fonction · 0 fonction supprimée ·
hub lecture seule · aucune dette reportée · couleurs/libellés de TYPE_STYLE uniquement · français sobre ·
captures par gestes réels examinées une à une · livraison DICTEE6/ + rapport.md (mesures avant/après,
captures, md5+taille) · STOP après.

§8 — À INSTRUIRE, PAS À CODER (mandat séparé) : le choix élève numérique/papier, la liasse d'impression
prof, le quota. Questions ouvertes de Paul : nature du quota (par trimestre ou validation au cas par cas) ·
qui arbitre un refus · périmètre de la liasse (classe/dictée/mêlées) · 1 ou 2 mises en page (portrait
papier / paysage écran) · où l'élève choisit. Réserves posées : paysage inconfortable au téléphone ;
l'orientation d'impression à régler sous peine de copie réduite.
NOTE : les annexes CSS/JS verbatim de la maquette validée vivent dans la passation d'origine chez Paul et
dans les maquettes de phase 1 — l'exécutant DOIT les redemander à Paul s'il ne les retrouve pas (elles font foi).