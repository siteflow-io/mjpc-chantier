#!/bin/sh
# à jouer en tranches d'une commande chacune (les processus de fond meurent entre deux tours)
cd /home/claude; r=0; for f in audit-affichage-p3 test-p3 test-p2-p3 test-p1-p3 test-g2-p3 test-g1-p3 test-f-p3 test-e-p3 test-b5-p3 test-b4-p3 test-b3-p3 test-d-p3 test-c-p3 test-b2-apercu-p3 test-b-p3 test-cahier-p3 test-a0-p3 regression-p3 tout-cliquer-p3; do out=$(timeout 400 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
