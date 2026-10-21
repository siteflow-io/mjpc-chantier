#!/bin/sh
# E3 — l'essai de dr-tableau.js sur la maquette p8-5g, avant E1-a : la maquette + le module + l'amorce de la page tableau.
# Ce que ça prouve : la fenêtre ouverte par « ⧉ » est la page elle-même (?vue=tableau&local=1), rendue par le `rendre` de la maquette,
# sans document.write ni recopie (inj). Ce que ça ne peut pas prouver : l'absence de #mur (le corps de la maquette est statique).
# usage : sh essai-sur-maquette.sh <maquette.html> <dossier>
set -eu
ICI=$(cd "$(dirname "$0")" && pwd); D="$2"; mkdir -p "$D"
cp "$ICI/../../dr/dr-tableau.js" "$D/"
python3 - "$1" "$D/maq.html" <<'PY'
import sys
s=open(sys.argv[1],encoding='utf-8').read()
boot='<style>.ses-corps-tab{background:#0d0b0a}.ses-tab{position:fixed;inset:0;background:#0d0b0a;z-index:99998}.ses-tab-attente{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f0e7db;background:#1a1512}.ses-tab-perdu{display:none}</style>\n<script src="dr-tableau.js"></script><script>if (dr_estTableau()) document.addEventListener(\'DOMContentLoaded\', dr_tabDemarrer);</script>\n</body>'
i=s.rfind('</body>'); open(sys.argv[2],'w',encoding='utf-8').write(s[:i]+boot+s[i+7:])
PY
node "$ICI/../bancs/banc.mjs" "$D/maq.html" "$D/banc.txt" "$D/captures"
