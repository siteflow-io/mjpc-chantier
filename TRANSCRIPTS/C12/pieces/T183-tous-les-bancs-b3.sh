#!/bin/sh
cd /home/claude; r=0; for f in test-b3 test-d-b3 test-c-b3 test-b2-apercu-b3 test-b-b3 test-cahier-b3 test-a0-b3 regression-b3 tout-cliquer-b3 audit-affichage-b3; do out=$(timeout 400 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
