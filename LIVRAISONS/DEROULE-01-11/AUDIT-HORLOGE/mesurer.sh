#!/bin/bash
# AUDIT-HORLOGE (C16 367) — un passage de sonde sur une machine libre, surveillé : avant, aucun navigateur et aucun témoin (MACHINE-CONSCIENCE, MACHINE-MESURE) ;
# pendant, toutes les 0,5 s, tout navigateur PRINCIPAL (un processus de navigateur sans « --type= » : un autre agent qui lance une sonde en crée forcément un)
# qui ne descend pas de ce passage et qui est encore là au contrôle suivant : le passage s'arrête aussitôt (ses processus, par leur PID) et il est dit
# « CHEVAUCHÉ » (écarté) ; après, le témoin retiré. Les heures : TZ=Europe/Paris date.
# (18:19 : la première version prenait pour étranger un processus de rendu de MON navigateur, fermé entre `ps` et la lecture de son parent : un faux chevauchement.)
# usage : mesurer.sh <scratchpad> <journal> <commande…>     (sortie 0 propre, 3 machine occupée avant, 4 chevauché)
S="$1"; JOURNAL="$2"; shift 2
h() { TZ=Europe/Paris date +%H:%M:%S; }
nav() { ps -eo pid=,comm= | awk '$2 ~ /^(chrom|headless)/ {print $1}'; }
principal() { [ -r /proc/$1/cmdline ] && ! tr '\0' ' ' < /proc/$1/cmdline 2>/dev/null | grep -q -- '--type='; }
if [ -n "$(nav)" ] || [ -e "$S/MACHINE-CONSCIENCE" ] || [ -e "$S/MACHINE-MESURE" ]; then echo "$(h) machine occupée : rien lancé" | tee -a "$JOURNAL"; exit 3; fi
touch "$S/MACHINE-MESURE"; DEBUT=$(h)
"$@" & MOI=$!
descend() { local p=$1; while [ -n "$p" ] && [ "$p" -gt 1 ]; do [ "$p" = "$MOI" ] && return 0; p=$(awk '{print $4}' /proc/$p/stat 2>/dev/null); done; return 1; }
etat=propre; quand=""; douteux=""
while kill -0 $MOI 2>/dev/null; do
  nouveaux=""
  for q in $(nav); do principal $q || continue; descend $q && continue; [ -d /proc/$q ] || continue
    if echo " $douteux " | grep -q " $q "; then etat=CHEVAUCHÉ; quand=$(h); break; fi; nouveaux="$nouveaux $q"; done
  [ $etat = CHEVAUCHÉ ] && break
  douteux="$nouveaux"
  sleep 0.5
done
if [ $etat = CHEVAUCHÉ ]; then
  # mes processus seulement, par leur PID : le passage et tout ce qui en descend
  tous() { local r=$1; echo $r; for c in $(ps -eo pid=,ppid= | awk -v r=$r '$2==r {print $1}'); do tous $c; done; }
  L=$(tous $MOI); kill $L 2>/dev/null; sleep 1; kill -9 $L 2>/dev/null
fi
wait $MOI 2>/dev/null; code=$?
rm -f "$S/MACHINE-MESURE"; FIN=$(h)
echo "$DEBUT → $FIN · $etat${quand:+ (un autre navigateur à $quand)} · code $code · $*" | tee -a "$JOURNAL"
[ $etat = CHEVAUCHÉ ] && exit 4; exit 0
