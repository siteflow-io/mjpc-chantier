#!/bin/sh
cd /home/claude; r=0; for f in test-d test-cd test-b2-apercu-d test-bd test-cahier-d test-a0-d regression-d tout-cliquer-d audit-affichage-d; do out=$(timeout 400 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
