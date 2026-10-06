#!/bin/sh
# Le banc unique : rejoue les bancs l'un après l'autre, échoue si un seul échoue,
# écrit sa sortie complète dans sorties/tous-les-bancs.txt (en tête : la date, les versions, le md5 de la maquette jouée).
# Variables (toutes facultatives, défaut relatif au dossier de la livraison) : MJPC_MAQUETTE, MJPC_CHROMIUM, MJPC_CAPTURES, MJPC_SORTIE, MJPC_BANCS (liste des bancs).
ICI=$(cd "$(dirname "$0")/.." && pwd); cd "$ICI" || exit 2
MAQ=${MJPC_MAQUETTE:-maquette-pilotage-ordi-v9c15p8-2-manipulable.html}
SORTIE=${MJPC_SORTIE:-sorties/tous-les-bancs.txt}; mkdir -p "$(dirname "$SORTIE")"
BANCS=${MJPC_BANCS:-"test-p8-2-formes audit-affichage-p7 test-p7-schema-envoi test-p6-p7 test-p5-p7 test-p4b-p7 test-p4a-p7 test-p3-p7 test-p2-p7 test-p1-p7 test-g2-p7 test-g1-p7 test-f-p7 test-e-p7 test-b5-p7 test-b4-p7 test-b3-p7 test-d-p7 test-c-p7 test-b2-apercu-p7 test-b-p7 test-cahier-p7 test-a0-p7 regression-p7 tout-cliquer-p7"}
[ -f "$MAQ" ] || { echo "maquette introuvable : $MAQ"; exit 2; }
CHR=$(node -e "import('./bancs/env.mjs').then(async m => { const n = await m.chromium.launch({ executablePath: m.CHROMIUM }); console.log(n.version()); await n.close(); })" 2>&1 | tail -1)
{
  echo "date : $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "node : $(node --version) · playwright : $(node -e "console.log(require('playwright/package.json').version)") · chromium : $CHR"
  echo "maquette jouée : $MAQ"
  echo "md5 de la maquette jouée : $(md5sum "$MAQ" | cut -d' ' -f1)"
  echo "bancs : $(echo $BANCS | wc -w)"
  echo
} > "$SORTIE"
export MJPC_MAQUETTE="$MAQ"
r=0; RESUME=""
for f in $BANCS; do
  echo "===== $f =====" >> "$SORTIE"
  out=$(timeout 400 node "bancs/$f.mjs" 2>&1); code=$?
  echo "$out" >> "$SORTIE"; echo "(code de sortie : $code)" >> "$SORTIE"; echo >> "$SORTIE"
  fin=$(echo "$out" | grep -a "fin :" | tail -1)
  ligne="$f : $fin"; RESUME="$RESUME$ligne
"; echo "$ligne"
  echo "$fin" | grep -q "fin : 0 défaut" || r=1
done
{ echo "===== RÉSUMÉ ====="; printf "%s" "$RESUME"; [ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; } >> "$SORTIE"
[ $r = 0 ] && echo "TOUS LES BANCS : 0 défaut" || echo "ÉCHEC"; exit $r
