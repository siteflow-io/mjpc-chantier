#!/bin/sh
cd /home/claude; r=0; for f in test-b2-apercu test-bb2 test-cahier-b2 test-a0-b2 regression-b2 tout-cliquer-b2 audit-affichage-b2; do out=$(timeout 300 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
