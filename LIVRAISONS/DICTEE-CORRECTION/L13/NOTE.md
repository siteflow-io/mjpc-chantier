# DICTÉE — L'ÉCRAN DE CORRECTION · L13 — l'autocorrection attend la première séance ; hors classe, 45 minutes

*Exécutant des compléments L13-L14 (`MANDATS/COMPLEMENT-DICTEE-CORRECTION-L13-L14.md`), livraison L13. Rien n'est promu.*

## Ce que ça change pour la classe
- **Le verrou de la première séance** : après « J'ai lu et compris » et « Commencer mon autocorrection », si **aucune heure n'a jamais été lancée** sur la dictée (ni en cours, ni close), l'élève voit **l'écran d'attente**, mot pour mot, et rien d'autre :
  « ⏳ Ta correction s'ouvrira quand ton professeur lancera la séance. » / « Tu as lu et coché les consignes. Reste sur cette page : elle s'ouvrira toute seule, sans rien recharger. » / « ← Mes dictées ».
  **L'écran écoute l'heure** : dès que tu lances la séance (« ▶ Lancer l'autocorrection »), il s'ouvre seul, sans rechargement. Dès qu'une heure a été lancée une fois, le verrou n'existe plus pour cette dictée. L'attestation reste enregistrée comme aujourd'hui. **Sa session ne commence qu'avec la séance** (avant, elle commençait dès l'ouverture : un élève qui ouvrait la veille aurait trouvé sa fenêtre déjà passée).
- **Hors classe, 45 minutes** : à **chaque ouverture** de l'autocorrection hors séance, après qu'une séance a eu lieu et s'est close (close, ou son heure de fin passée), et aucune en cours : **le bandeau en tête de l'écran**, mot pour mot : « 🏠 **Tu es hors classe : tu as 45 minutes.** Il te reste **44 min**. » — le compte descend minute par minute ; à zéro, l'écran revient à « Mes dictées », **sans phrase** ; sa progression est gardée ; une nouvelle ouverture redonne 45 minutes. La fenêtre hors heure passe de 55 à **45 minutes** (`finDeFenetre`). Pendant une séance en classe : pas de bandeau, c'est l'heure qui compte, comme aujourd'hui. Le suivi professeur n'est pas touché.
- **Côté professeur** : l'infobulle de « ▶ Lancer l'autocorrection » dit qu'il **ouvre** l'autocorrection aux élèves (avant la première séance, ils attendent ; ensuite, hors classe, 45 minutes par ouverture) ; l'aide « ? » le dit sur l'accueil, en mode rapide et dans Données.

## Le fichier
- Base **6.7.0-L12 en ligne** (809 581 o, md5 `89a82a824077066e82823dda85353cfe`, vérifiée à la commande) → **6.7.0-L13** : **813,092 o** (+3,511), md5 `4ce6fa98b97c959856fc00d8227e300f`.
- `finDeFenetre` : 55 → 45 min. Dans `EleveCorrection` : l'heure lue (`heureLue`, `heureRef`), le moment de l'ouverture (`ouvHC`), `horsClasseL13`, `finEffL13` (hors classe : 45 min à chaque ouverture) à la place de `finDeFenetre` dans la fenêtre, le stylo vert et la fin des questions ; la session posée seulement quand une séance existe ; l'écran d'attente ; le bandeau ; le retour à « Mes dictées » à zéro. L'infobulle de « ▶ Lancer l'autocorrection » ; trois lignes d'aide. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L13_geste.py`** (par le geste) : copies publiées, aucune heure : l'élève coche, « Commencer » → **l'écran d'attente, ses trois lignes exactement**, une seule carte, aucune session posée ; **l'heure écrite au hub pendant qu'il attend** (comme « Lancer ») → **l'écran s'ouvre seul en 0,13 s, la page garde son état** (pas de rechargement), la session posée ; heure en cours → **pas de bandeau** ; une séance close puis une ouverture → **« 🏠 Tu es hors classe : tu as 45 minutes. Il te reste 44 min. »** exactement, pas d'attente ; l'horloge avancée d'une minute → **« … 43 min. »** ; avancée à 45 min → **« Mes dictées »**, sans phrase, **la progression intacte au hub** (résultats, essais, compte, attestation) ; une dictée non publiée → « Disponible après la séance », inchangé ; l'aide de l'accueil dit « Lancer l'autocorrection » ; 0 erreur. **Sur L12, ce banc est rouge.**
**Accordé** : `banc_L11_geste.py` — son passage dans l'autocorrection de l'élève pose une séance lancée (sinon il trouverait, à bon droit, l'écran d'attente ; la version d'avant jointe).
**Non joué au banc** : le mode test (bac à sable) — même chemin de code que les vraies dictées.
**Banc unique sur L13 : VERT, 0 échec** (`sorties/`) : S1/S3 sans perte, S2 correct ; fuzz_correction ×2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur ; bancs L1, L2, L3, L5, L6, L6b, L7, L8, L10, L9, L11, L12, L13 verts ; vue élève (l'accueil) identique à la 6.6.3.

## Captures (`captures/`)
`G1-avant.png` / `G2-attente.png` (« Commencer » sans séance) ; `G3-ouverte.png` (la séance lancée : l'écran s'ouvre seul) ; `G4-avant.png` / `G5-bandeau.png` (une ouverture hors classe).

## Tes tests, après promotion
1. Mode test (ou une vraie dictée sans heure lancée) : un élève coche les consignes, « Commencer » → l'attente ; lance l'autocorrection (Données → Suivi → « ▶ Lancer l'autocorrection ») : son écran s'ouvre seul, sans recharger.
2. Clôture l'heure ; l'élève rouvre chez lui : le bandeau « Tu es hors classe : tu as 45 minutes. Il te reste 44 min. » ; le compte descend.
3. Au bout de 45 minutes, il revient sur « Mes dictées » ; rouvrir lui redonne 45 minutes.
