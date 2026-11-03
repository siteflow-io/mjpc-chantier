#!/bin/bash
# C16 379 — le témoin des sessions croisées, au banc : les parties Q1 (les télescopages : deux à deux, un même appareil, trois) et Q1D (un appareil qui
# disparaît) de sonde-audit-I.mjs, et les parties K et M de sonde-II.mjs (le paquet sans `classe` lu au vrai hub ; le mode test quitté pendant un essai),
# jouées sur la base puis sur le candidat, à la montre du navigateur ; chaque ligne qui change entre les deux est écrite dans temoin-diff.txt.
# Le témoin ne juge pas : chaque différence se lit contre le mandat du lot (ce qui devait changer) ; tout autre changement est un télescopage à expliquer.
# usage : bash temoin-sessions.sh <base index.html> <candidat index.html> <sortie>   (MJPC_PYQR, MJPC_MEDIAS passés tels quels)
ICI=$(cd "$(dirname "$0")" && pwd); B=$1; C=$2; O=$3; mkdir -p "$O"; export MJPC_HORLOGE=date
norm() { sed -E 's/"sesId":"[^"]*"/"sesId":"…"/g; s/ap_[a-z0-9]+_[a-z0-9]+/ap_…/g; s/md5 [0-9a-f]{32}/md5 …/g; s/^C16 · audit global.*$/(entête)/; s/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2} UTC/(date)/g' "$1"; }
for f in base cand; do F=$C; [ $f = base ] && F=$B
  MJPC_PARTIES=Q1,Q1D timeout 3600 node "$ICI/sonde-audit-I.mjs" "$F" "$O/I-$f" > "$O/I-$f.txt" 2>&1; echo "I $f code $?"
  MJPC_PARTIES=K,M timeout 1800 node "$ICI/sonde-II.mjs" "$F" "$O/II-$f" > "$O/II-$f.txt" 2>&1; echo "II $f code $?"
done
{ for p in I II; do echo "=== partie $p"; diff <(norm "$O/$p-base.txt") <(norm "$O/$p-cand.txt"); done; } > "$O/temoin-diff.txt"
echo "lignes changées : $(grep -cE '^[<>]' "$O/temoin-diff.txt")"
