#!/bin/sh
# Le banc d'E4 sur la maquette p8-5g, module injecté (avant E1-a, et pour la non-régression du récit hors du site).
# MJPC_ENTREE=simule : avec E4/bancs/socle-simule.js (hub en mémoire, séance 0 du faux hub).
# usage : sh essai-maquette.sh <maquette-p8-5g.html> <dossier-de-travail> [dossier-de-sortie]
set -eu
ICI=$(cd "$(dirname "$0")" && pwd); E4=$(cd "$ICI/.." && pwd); DR="$E4/../dr"
MAQ="$1"; TRAV="$2"; OUT="${3:-$E4/sorties/$(date -u +%H%M)-maquette}"; mkdir -p "$TRAV" "$OUT"
python3 - "$MAQ" "$TRAV" <<'PY'
import sys
L=open(sys.argv[1],encoding='utf-8').read().split('\n')
R=[(382,442),(888,891),(916,917),(1435,1448),(1644,1803)]
keep=[l for i,l in enumerate(L,1) if not any(a<=i<=b for a,b in R)]
open(sys.argv[2]+'/maq-sans-e4.html','w',encoding='utf-8').write('\n'.join(keep))
PY
python3 "$ICI/inject.py" "$TRAV/maq-sans-e4.html" "$DR/dr-recit.js" "$TRAV/essai.html"
if [ "${MJPC_ENTREE:-}" = simule ]; then python3 "$ICI/inject.py" "$TRAV/essai.html" "$E4/bancs/socle-simule.js" "$TRAV/essai.html"; fi   # le socle simulé, avant le module
python3 - "$TRAV/essai.html" "$E4/dr-recit.css" <<'PY'
import sys
h=open(sys.argv[1],encoding='utf-8').read(); c=open(sys.argv[2],encoding='utf-8').read()
open(sys.argv[1],'w',encoding='utf-8').write(h.replace('</style></head>','\n'+c+'\n</style></head>',1))
PY
node "$E4/bancs/banc.mjs" "$TRAV/essai.html" "$OUT"
