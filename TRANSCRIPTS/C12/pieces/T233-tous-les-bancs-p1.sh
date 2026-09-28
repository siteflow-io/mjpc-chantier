#!/bin/sh
# à jouer en tranches d'une commande chacune (les processus de fond meurent entre deux tours)
cd /home/claude; r=0; for f in audit-affichage-p1 test-p1 test-g2-p1 test-g1-p1 test-f-p1 test-e-p1 test-b5-p1 test-b4-p1 test-b3-p1 test-d-p1 test-c-p1 test-b2-apercu-p1 test-b-p1 test-cahier-p1 test-a0-p1 regression-p1 tout-cliquer-p1; do out=$(timeout 400 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
