#!/bin/sh
# le banc unique : rejoue tous les bancs du lot d'une seule commande et échoue si un seul échoue
cd /home/claude; r=0; for f in test-a-cahier test-a0-a regression-a tout-cliquer-a audit-affichage-a; do out=$(timeout 300 node vis/$f.mjs 2>&1 | grep -a "fin :" | tail -1); echo "$f : $out"; echo "$out" | grep -q "fin : 0 défaut" || r=1; done; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
