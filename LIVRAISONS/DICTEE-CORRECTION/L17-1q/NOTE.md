# L17-1q — la version d'ensemble (conscience n°12, 07/10/2026, sur ordre de Paul : « voir ce qui est bon à prendre d'elle, garder tes micros, une version d'ensemble »)
*Base : la production **6.7.0-L15.1b-1q** (les cinq micros du 07/10 : deux binômes sur deux tablettes + émojis selon les sexes ; jamais d'identifiant de notion ; la garde de « Je garde ma note »). Fusionnée avec la livraison **L17-1** de l'exécutante (base 6.7.0-L15.1b-1l). → **6.7.0-L17-1q3** : 1009469 o, md5 `084deaf433405197a2041b22dc4e7f26`. Rien n'est promu.*

## Ce que ça change pour la classe
Les binômes sont annoncés dès la connexion (d'après les erreurs, comme l'aperçu de la console) et figés à « Lancer » pour toute la séance ; un absent, un élève qui part ou qui revient ne défont jamais un binôme au travail ; un élève qui se connecte sur une autre tablette que son binôme lit « Tu es avec … : … rejoins … » ; Paul choisit binômes imposés ou placement libre (la case « Binômes imposés », par dictée).

## Pris de L17-1 (l'exécutante), tel quel
Binômes fixés pour la séance (`binomesSeanceL17`, « Lancer ») puis libérés ; la garde avant « Lancer » ; absent / parti / revient ; « Binômes imposés (d'après les erreurs) » et placement libre (fin de `peerTarget`) ; l'aménagé avec l'élève classique au plus grand recoupement de mots ; 0 erreur = « Terminé » / « Heure terminée » ; le banc du lot 3b refait ; ses bancs accordés aux micros du 06/10 (L5, L14, L15h2, L15ka).

## Corrigé ou complété par la conscience (mesuré, prouvé)
1. **Avant « Lancer », la tablette annonce le binôme** (cadrage du 06/10, tour 521 ; le mandat l'avait omis) : `binomesActifsL17(...) || binomesSeanceL17(...)` — la même fonction et les mêmes données que l'aperçu de la console ; « Lancer » fige ces paires. Après la séance : l'aperçu d'après les erreurs du moment.
2. **Un seul registre « qui est assis où »** : `correction_dictee/<id>/places/<élève> = {tablette, moitie, arrivee, t}` (écrit dès qu'un élève est assis dans une moitié ; battement 30 s ; retiré à la déconnexion) — la garde, « parti » et la règle « rejoins » le lisent ; le registre `tablettes/` de L17-1 est retiré.
3. **« parti » ne se décoche que sur une nouvelle arrivée** (il retape son code) : chez L17-1, la réécriture toutes les 60 s d'une moitié restée ouverte l'aurait décoché en moins d'une minute.
4. **L'élève qui revient — le cas manquant** (règle du 06/10, tour 533) : son binôme réapparié mais qui n'a pas commencé → ils se retrouvent, l'autre redevient seul (ou rejoint un élève seul).
5. **« Trouvées » sans les mots « Attention graphie » (A)** (dette 154 élucidée) : la tablette comptait le « là » trouvé d'Emma Danard (12 pour 11) ; le Suivi affichait déjà 11/11 ; le vrai dégât : « Mes dictées » pouvait dire « Terminée » à un élève à qui il restait un mot. Corrigé aux cinq écritures et à la lecture.

## Bancs (`bancs/`)
- **`banc_revient.py`** (nouveau, trois cas) : vert ; **rouge sur L17-1 seul** (le cas 2).
- **`banc_trouvees.py`** (nouveau, la copie réelle de Danard et sa variante) : vert ; **rouge sur la production** (« Terminée » à tort).
- **`banc_L171_geste.py`** accordé : le registre unique ; « parti » tient tant qu'il n'est pas revenu ; le retour = une nouvelle arrivée ; après la séance, l'aperçu — vert (15 conditions).
- Les bancs des micros du 07/10 (`banc_l17bis`, `-b`, `-c` sur les paires réelles de la séance, la case « Binômes imposés » cochée ; `banc_175`, `banc_177`) : verts.
- **Banc unique** : voir `sortie_banc_unique.txt`.

## À savoir pour Paul
La case « Binômes imposés » est aujourd'hui **cochée** pour les Franklin et la dictée Baudelaire des Dylan ; **décochée** pour les Hugo, les Turing, la Fritz des Dylan et le brevet blanc des 3E : là, placement libre tant qu'elle n'est pas cochée (Préparation).
