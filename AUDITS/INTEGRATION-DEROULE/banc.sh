#!/bin/sh
# LE BANC D'INTÉGRATION — ce que chaque exécutant lance avant CHAQUE poussée, et ce que la conscience rejoue à chaque audit.
# usage : sh AUDITS/INTEGRATION-DEROULE/banc.sh [dossier-de-sortie]       (depuis la racine du sas, branche `integration`)
# 1. assemble LIVRAISONS/INTEGRATION/index.html + dr/* → assemble/index.html     2. les collisions (0 attendu)
# 3. le parcours P0-P12 + K15 sur l'assemblé           4. le parcours en MODE TEST (K15-test : zéro écriture)
# 5. les contrôles K1-K13 de la conscience par l'entrée du site (MJPC_ENTREE=site)
# Code de sortie : 0 si tout est vert. Les sorties sont dans le dossier donné (par défaut AUDITS/INTEGRATION-DEROULE/sorties/<date-heure>/).
set -u
ICI=$(cd "$(dirname "$0")" && pwd); RACINE=$(cd "$ICI/../.." && pwd)
SRC="$RACINE/LIVRAISONS/INTEGRATION/index.html"; ASM="$RACINE/LIVRAISONS/INTEGRATION/assemble/index.html"
OUT="${1:-$ICI/sorties/$(date +%Y-%m-%d_%H%M)}"; mkdir -p "$OUT"
echo "banc d'intégration · $(date -u +%Y-%m-%d\ %H:%M) UTC · branche $(git -C "$RACINE" rev-parse --abbrev-ref HEAD 2>/dev/null) · commit $(git -C "$RACINE" rev-parse --short HEAD 2>/dev/null)" | tee "$OUT/banc.txt"
R=0
echo "— 1. assemblage" | tee -a "$OUT/banc.txt"; node "$ICI/assembler.mjs" "$SRC" "$ASM" 2>&1 | tee -a "$OUT/banc.txt" || R=1
echo "— 2. collisions" | tee -a "$OUT/banc.txt"; node "$ICI/collisions.mjs" "$SRC" 2>&1 | tee -a "$OUT/banc.txt" || R=1
echo "— 3. parcours" | tee -a "$OUT/banc.txt"; node "$ICI/parcours.mjs" "$ASM" "$OUT/parcours" 2>&1 | tail -n 25 | tee -a "$OUT/banc.txt"; [ -f "$OUT/parcours/parcours.txt" ] && grep -q "PARCOURS VERT" "$OUT/parcours/parcours.txt" || R=1
echo "— 4. parcours en mode test" | tee -a "$OUT/banc.txt"; MJPC_MODE_TEST=1 node "$ICI/parcours.mjs" "$ASM" "$OUT/parcours-mode-test" 2>&1 | tail -n 8 | tee -a "$OUT/banc.txt"; [ -f "$OUT/parcours-mode-test/parcours.txt" ] && grep -q "PARCOURS VERT" "$OUT/parcours-mode-test/parcours.txt" || R=1
echo "— 5. contrôles K1-K13 par l'entrée du site" | tee -a "$OUT/banc.txt"; MJPC_ENTREE=site node "$RACINE/AUDITS/CONTROLES-DEROULE/controles.mjs" "$ASM" "$OUT/controles.txt" 2>&1 | tail -n 5 | tee -a "$OUT/banc.txt" || R=1
echo "— résultat : $([ $R = 0 ] && echo VERT || echo ROUGE) · sorties dans $OUT" | tee -a "$OUT/banc.txt"
exit $R
