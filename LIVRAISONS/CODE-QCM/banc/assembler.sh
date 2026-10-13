#!/bin/bash
# QCM-4 · BANC — un assemblage (COMMUN §2) : build.py, puis les contrôles de la conscience, le banc commun et la fidélité, sur l'app assemblée.
# Sorties : LIVRAISONS/CODE-QCM/sorties/<AAAA-MM-JJ_HHMM>/ (controles.txt, banc.txt, fidelite.txt, captures/, resume.txt, avec leurs durées).
#   bash LIVRAISONS/CODE-QCM/banc/assembler.sh [fichier de l'app, si ce n'est pas celui que build.py assemble]
cd "$(dirname "$0")/../../.." || exit 2
R=$PWD; L=$R/LIVRAISONS/CODE-QCM; H=$(TZ=Europe/Paris date +%Y-%m-%d_%H%M); O=$L/sorties/$H; mkdir -p "$O"
BANC=$R/AUDITS/QCM-MODE-TEST-09-10/banc
# les contrôles de la conscience : ceux de main (reprise 4, point 10 : « les contrôles corrigés, md5 dans EMPREINTES.md5 sur main »),
# extraits sans changement dans un dossier à part ; à défaut, ceux de la branche
CTL=$O/.controles-main; mkdir -p "$CTL"
if git fetch -q origin main 2>/dev/null && git archive origin/main AUDITS/CONTROLES-QCM-APP | tar -x -C "$CTL" 2>/dev/null; then CTL=$CTL/AUDITS/CONTROLES-QCM-APP; else CTL=$R/AUDITS/CONTROLES-QCM-APP; fi
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
echo "── empreintes des contrôles de la conscience (la version de main, extraite telle quelle : $CTL)"
( cd "$CTL" && md5sum -c EMPREINTES.md5 ) 2>&1 | sed 's/^/  /'
} > "$O/resume.txt"
if [ -f "${1:-$L/evaluation-qcm.staging.html}" ]; then
  APP=${1:-$L/evaluation-qcm.staging.html}
  controles(){ a=$(date +%s); APP_FILE="$APP" BANC="$BANC" timeout 900 node "$CTL/controles-app.js" "$O/controles.txt" > "$O/controles.log" 2>&1; rc=$?; b=$(date +%s)
  { echo; echo "── contrôles de la conscience ($((b-a)) s, code $rc)"; sed -n '1,4p' "$O/controles.txt" 2>/dev/null | sed 's/^/  /'; grep -c "ÉCHEC" "$O/controles.txt" 2>/dev/null | sed 's/^/  échecs : /'; } > "$O/.ctl"; }
  # COURT=1 : les contrôles en même temps que les bancs ; sinon, avant
  if [ -n "$COURT" ]; then controles & else controles; fi
  # le banc commun et l'heure de demain, en même temps (deux navigateurs)
  a=$(date +%s)
  ( APP_FILE="$APP" BANC="$BANC" timeout 1260 node "$L/banc/banc.js" "$O" > "$O/banc.log" 2>&1; echo $? > "$O/.rb"; date +%s > "$O/.tb" ) &
  # COURT=1 (le réassemblage de 11:22, reprise 4 bis) : sans l'heure de demain ni les gestes rares, passés à l'assemblage précédent
  if [ -z "$COURT" ]; then
  ( APP_FILE="$APP" BANC="$BANC" timeout 1260 node "$L/banc/banc-demain.js" "$O" > "$O/demain.log" 2>&1; echo $? > "$O/.rd"; date +%s > "$O/.td" ) &
  ( APP_FILE="$APP" BANC="$BANC" timeout 1260 node "$L/banc/banc-branches.js" "$O" > "$O/branches.log" 2>&1; echo $? > "$O/.rr"; date +%s > "$O/.tr" ) &
  else echo 0 > "$O/.rd"; echo 0 > "$O/.rr"; date +%s > "$O/.td"; date +%s > "$O/.tr"; fi
  # les reprises du 13/10, par le geste (points rejoués), et les écrans jamais atteints, s'ils existent
  for x in reprise2 reprise3 reprise4 jamais; do [ -n "$COURT" ] && [ "$x" = jamais ] && continue; [ -f "$L/banc/banc-$x.js" ] && ( APP_FILE="$APP" BANC="$BANC" timeout 480 node "$L/banc/banc-$x.js" "$O" > "$O/$x.log" 2>&1 ) & done
  wait
  for x in reprise2 reprise3 reprise4 jamais; do [ -f "$O/$x.txt" ] && { echo; echo "── $x"; sed -n '1,2p' "$O/$x.txt" | sed 's/^/  /'; } >> "$O/resume.txt"; done
  { echo; echo "── banc commun ($(( $(cat "$O/.tb") - a )) s, code $(cat "$O/.rb"))"; sed -n '2p' "$O/banc.txt" 2>/dev/null | sed 's/^/  /';
    echo; echo "── les gestes rares ($(( $(cat "$O/.tr") - a )) s, code $(cat "$O/.rr"))"; sed -n '2p' "$O/branches.txt" 2>/dev/null | sed 's/^/  /';
    echo; echo "── l'heure de demain ($(( $(cat "$O/.td") - a )) s, code $(cat "$O/.rd"))"; sed -n '2p' "$O/demain.txt" 2>/dev/null | sed 's/^/  /'; } >> "$O/resume.txt"
  cat "$O/.ctl" >> "$O/resume.txt" 2>/dev/null; rm -f "$O/.ctl"
  rm -f "$O"/.r? "$O"/.t?; rm -rf "$O/.controles-main"
  if [ -f "$O/releves-app.json" ]; then node "$L/banc/fidelite.js" "$O" > "$O/fidelite.log" 2>&1
    { echo; echo "── fidélité à la maquette"; sed -n '2p' "$O/fidelite.txt" | sed 's/^/  /'; } >> "$O/resume.txt"; fi
fi
[ -d "$O" ] && node "$L/banc/synthese.js" "$O" > /dev/null 2>&1 && { echo; echo "── synthèse (synthese.txt)"; sed 's/^/  /' "$O/synthese.txt"; } >> "$O/resume.txt"
echo >> "$O/resume.txt"; echo "Durée totale de l'assemblage : $(( $(date +%s) - t0 )) s" >> "$O/resume.txt"
cat "$O/resume.txt"; echo "→ $O"
