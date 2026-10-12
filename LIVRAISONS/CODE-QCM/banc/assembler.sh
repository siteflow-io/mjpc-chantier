#!/bin/bash
# QCM-4 · BANC — un assemblage (COMMUN §2) : build.py, puis les contrôles de la conscience, le banc commun et la fidélité, sur l'app assemblée.
# Sorties : LIVRAISONS/CODE-QCM/sorties/<AAAA-MM-JJ_HHMM>/ (controles.txt, banc.txt, fidelite.txt, captures/, resume.txt, avec leurs durées).
#   bash LIVRAISONS/CODE-QCM/banc/assembler.sh [fichier de l'app, si ce n'est pas celui que build.py assemble]
cd "$(dirname "$0")/../../.." || exit 2
R=$PWD; L=$R/LIVRAISONS/CODE-QCM; H=$(TZ=Europe/Paris date +%Y-%m-%d_%H%M); O=$L/sorties/$H; mkdir -p "$O"
BANC=$R/AUDITS/QCM-MODE-TEST-09-10/banc
[ -d "$BANC/node_modules/ws" ] || (cd "$BANC" && npm install --no-audit --no-fund >/dev/null 2>&1)
t0=$(date +%s)
{
echo "Assemblage QCM-4 · BANC — $(TZ=Europe/Paris date '+%d/%m/%Y %H:%M') (heure de Paris) — code-qcm $(git rev-parse --short HEAD)"
echo
echo "── build.py"
( cd "$L" && timeout 300 python3 build.py ) > "$O/build.txt" 2>&1; rb=$?
tail -5 "$O/build.txt"; echo "  code de sortie : $rb"
APP=${1:-$L/evaluation-qcm.staging.html}
if [ ! -f "$APP" ]; then echo "  ÉCHEC : $APP absent après build.py (COMMUN §5 : evaluation-qcm.staging.html)"; fi
[ -f "$APP" ] && echo "  app : $(md5sum "$APP" | cut -c1-32)  $(basename "$APP")  $(stat -c %s "$APP") octets"
echo
echo "── empreintes des contrôles de la conscience"
( cd "$R/AUDITS/CONTROLES-QCM-APP" && md5sum -c EMPREINTES.md5 ) 2>&1 | sed 's/^/  /'
} > "$O/resume.txt"
if [ -f "${1:-$L/evaluation-qcm.staging.html}" ]; then
  APP=${1:-$L/evaluation-qcm.staging.html}
  a=$(date +%s); APP_FILE="$APP" BANC="$BANC" timeout 900 node "$R/AUDITS/CONTROLES-QCM-APP/controles-app.js" "$O/controles.txt" > "$O/controles.log" 2>&1; rc=$?; b=$(date +%s)
  { echo; echo "── contrôles de la conscience ($((b-a)) s, code $rc)"; sed -n '1,4p' "$O/controles.txt" 2>/dev/null | sed 's/^/  /'; grep -c "ÉCHEC" "$O/controles.txt" 2>/dev/null | sed 's/^/  échecs : /'; } >> "$O/resume.txt"
  a=$(date +%s); APP_FILE="$APP" BANC="$BANC" timeout 1260 node "$L/banc/banc.js" "$O" > "$O/banc.log" 2>&1; rb=$?; b=$(date +%s)
  { echo; echo "── banc commun ($((b-a)) s, code $rb)"; sed -n '2p' "$O/banc.txt" 2>/dev/null | sed 's/^/  /'; } >> "$O/resume.txt"
  if [ -f "$O/releves-app.json" ]; then node "$L/banc/fidelite.js" "$O" > "$O/fidelite.log" 2>&1
    { echo; echo "── fidélité à la maquette"; sed -n '2p' "$O/fidelite.txt" | sed 's/^/  /'; } >> "$O/resume.txt"; fi
fi
echo >> "$O/resume.txt"; echo "Durée totale de l'assemblage : $(( $(date +%s) - t0 )) s" >> "$O/resume.txt"
cat "$O/resume.txt"; echo "→ $O"
