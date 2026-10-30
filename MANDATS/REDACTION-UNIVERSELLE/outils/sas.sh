#!/bin/bash
# usage: sas.sh "message de commit"  — remplace HHMM par l'heure réelle dans les fichiers modifiés, commit main, push, fusion dans integration
cd /home/claude/mjpc-chantier || exit 1
H=$(TZ=Europe/Paris date +%H:%M)
for f in $(git status --porcelain | awk '{print $2}' | grep -E '\.md$'); do [ -f "$f" ] && sed -i "s/HHMM/$H/g" "$f"; done
git add -A MANDATS TRANSCRIPTS AUDITS LIVRAISONS 2>/dev/null
git commit -q -m "$1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FmzsMHBMC1WuguNe8MTJi3" || exit 1
timeout 60 git push -q origin main || { echo "push main KO"; exit 1; }
git checkout -q integration && timeout 60 git fetch -q origin integration && git merge -q --ff-only origin/integration
git merge --no-edit -q main 2>/dev/null
if git status --short | grep -q "^UU"; then
  git checkout --theirs TRANSCRIPTS/C13/TRANSCRIPT-C13.md 2>/dev/null
  python3 -I - <<'PY'
import re,subprocess
for p in subprocess.run(['git','diff','--name-only','--diff-filter=U'],capture_output=True,text=True).stdout.split():
    t=open(p,encoding='utf8').read()
    open(p,'w',encoding='utf8').write(re.sub(r'<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> main\n',lambda m:m.group(1)+m.group(2),t,flags=re.S))
PY
  git add -A MANDATS TRANSCRIPTS AUDITS && git commit -q --no-edit
fi
timeout 60 git push -q origin integration && echo "poussé ($H)"
git checkout -q main
