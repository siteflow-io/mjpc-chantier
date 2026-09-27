#!/bin/sh
# à jouer en tranches d'une commande chacune (les processus de fond meurent entre deux tours)
cd /home/claude; r=0; for f in audit-affichage-g2 test-g2 test-g1-g2 test-f-g2 test-e-g2 test-b5-g2 test-b4-g2 test-b3-g2 test-d-g2 test-c-g2 test-b2-apercu-g2 test-b-g2 test-cahier-g2 test-a0-g2 regression-g2 tout-cliquer-g2; do out=$(timeout 400 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
