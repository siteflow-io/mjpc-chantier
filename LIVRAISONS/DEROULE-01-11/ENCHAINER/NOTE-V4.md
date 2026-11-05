# MANDAT V4 — L'HORLOGE DE LA CASE NE REPART PAS À LA SÉANCE ENCHAÎNÉE · suite de `948d09b50` (assemblé `bd434b3f`)

## 0 · Les erreurs du mandat (mesurées)
1. « le T-5 tombe à 5 minutes de la fin du créneau » : non. Le T-5 tombe 5 minutes avant le cahier de textes (09:42), qui est lui-même 5 minutes avant la fin de la case (09:47, la case finit à 09:52). C'est le cas d'une heure ordinaire, mesuré : 09:42:02 sur l'horloge de la case, dans l'heure ordinaire comme dans la séance enchaînée.
2. « Rien ne change pour les autres classes » : l'horloge de la case sert aussi à une heure **rattrapée** de n'importe quelle classe. Si on enchaîne dans une heure rattrapée, elle repart elle aussi au début du créneau. Ce cas n'est pas réglé, pour suivre la lettre du mandat (la classe d'essai seulement). Il n'est pas mesuré.

## 1 · Ce qui change (le site)
- `dr/dr-classe.js` : au clic sur « ▶ Séance suivante dans cette heure », le décalage de l'horloge de la case est gardé (la classe d'essai seulement). Au lancement de la séance suivante (`dr_lancerNeuf`), il est posé dans `S.hcEnch` = { heure, début réel, décalage }. Tout autre lancement remet `S.hcEnch` à rien.
- `dr/dr-socle.js` (`dr_horlogeCase`) : si `S.hcEnch` est celui de CETTE heure (même heure, même début réel), l'horloge reprend ce décalage au lieu de repartir au début du créneau. `S.hcEnch` vit dans S : l'autre pilote et la réouverture le relisent (la réouverture n'est pas mesurée).

## 2 · La preuve (par le geste, faux hub du banc) — `sorties/v4-*.txt`, assemblé `f1840ad732cbf3138d29c234d1b57b22`
- Sonde `MJPC_HC=1` : la séance 1 dure (la montre avance de 25 min avant le clic). Puis on clique ▶. Ensuite, **sans « aller à 5 minutes de la fin »**, la montre avance seule jusqu'au T-5.
- Mode test, après (`v4-hc-ench-test-apres.txt`, 23/23) :
  - l'horloge de la case est à 09:22:29 juste avant le clic et à 09:22:31 juste après (écart 2 s, décalage −190 s → −190 s) ;
  - le T-5 arrive à 09:42:02 sur l'horloge de la case, et à la montre là où l'horloge de la séance 1 le met (écart 3 s).
- Mode test, base `bd434b3f` (`v4-hc-ench-test-base.txt`, 21/23) : l'horloge passe de 09:22:28 à 08:57:00 au clic, et le T-5 arrive 1533 s trop tard à la montre.
- Vraie heure, après : 21/21 (`v4-hc-ench-vh.txt`). L'heure ordinaire (la séance 2 lancée par la case), mode test : 10/10, le T-5 à 09:42:02 (`v4-hc-ord-test.txt`).
- **La sonde rejouée en entier sur l'après** (le contrôle de l'horloge au clic est maintenant dans chaque passage qui enchaîne) :
  - une heure : vraie heure 27/27, mode test 29/29 ;
  - deux heures : vraie heure 27/27, mode test 29/29 ;
  - répétition : 12/12 ;
  - témoin : 12/12, ses 4 lignes « TÉMOIN » identiques à la V3 (Relecture md5 `b41ca3fa`) ;
  - T-5 : vraie heure 22/22, mode test 24/24, et 10 lignes « T5 » sur 10 identiques à la V3 dans chaque mode.
- **Parcours P0-P12 : vert**, 30 contrôles, 0 échec (`v4-parcours.txt`).
- Captures dans `scratchpad/ENCHAINER-captures-V4/`.

## 3 · Ce qui reste
- L'heure rattrapée enchaînée, toutes classes (§0.2).
- La réouverture de la page pendant la séance enchaînée : pas mesurée.
- Ce qui restait après la V3 : les étapes 14, 15, 16 et le bilan B ; la dette V2 §0.3 ; la répétition en mode test.
