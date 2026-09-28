#!/bin/sh
# à jouer en tranches d'une commande chacune (les processus de fond meurent entre deux tours)
cd /home/claude; r=0; for f in audit-affichage-p2 test-p2 test-p1-p2 test-g2-p2 test-g1-p2 test-f-p2 test-e-p2 test-b5-p2 test-b4-p2 test-b3-p2 test-d-p2 test-c-p2 test-b2-apercu-p2 test-b-p2 test-cahier-p2 test-a0-p2 regression-p2 tout-cliquer-p2; do out=$(timeout 400 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
