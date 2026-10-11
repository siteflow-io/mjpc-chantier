# Le CSS des écrans de MJPC (complément 1, D1) : copié d'index.html de la production, règle par règle, sans rien changer.
# Garde toute règle dont un sélecteur porte une classe des écrans repris (le panneau prof, « Élèves & codes », la fiche, la taxonomie,
# les fenêtres de la console, et (complément 2) la boîte atInfo de l'atelier, où s'affichent les messages de l'emploi du temps), et les
# @keyframes qu'elles appellent. Écrit src/mjpc.css, avec la ligne d'origine de chaque règle ; et src/mjpc-edt.css : les règles que
# edtPoserCss pose (l. 20006 et suivantes), telles quelles, pour la section « Emploi du temps » (complément 2, §4).
#   python3 outils/css-mjpc.py [index.html]
import re, sys, hashlib, os
SRC = sys.argv[1] if len(sys.argv) > 1 else "/home/user/siteflow-io/monsieurjaipascompris/index.html"
txt = open(SRC, encoding="utf-8").read()
md5 = hashlib.md5(open(SRC, "rb").read()).hexdigest()
PREF = ("tprof", "tps-", "secu-", "eli-", "eli", "lens-", "lpd", "el-", "elf", "m8", "mjpc-act", "admin-action-btn", "cm-", "console-modal", "tprof-add-btn", "at-modale", "at-btn")
out = ["/* Le CSS des écrans de MJPC, copié d'index.html (production, md5 " + md5 + ") par outils/css-mjpc.py : chaque règle telle quelle, avec sa ligne. */"]
kf = set()
for m in re.finditer(r"<style[^>]*>(.*?)</style>", txt, re.S):
    bloc, base = m.group(1), txt[:m.start(1)].count("\n") + 1
    i, n = 0, len(bloc)
    while i < n:
        j = bloc.find("{", i)
        if j < 0: break
        sel = bloc[i:j].strip()
        # la règle entière, accolades imbriquées comprises (@media, @keyframes)
        d, k = 0, j
        while k < n:
            if bloc[k] == "{": d += 1
            elif bloc[k] == "}":
                d -= 1
                if d == 0: break
            k += 1
        regle = bloc[i:k+1].strip()
        ligne = base + bloc[:i].count("\n") + (len(bloc[i:j]) - len(bloc[i:j].lstrip("\n")))
        sel_net = re.sub(r"/\*.*?\*/", "", sel, flags=re.S).strip()
        if sel_net.startswith("@keyframes"):
            kf.add((sel_net.split()[1], ligne, regle))
        elif sel_net.startswith("@media"):
            inner = regle[regle.find("{")+1:-1]
            keep = [r.strip() + "}" for r in inner.split("}") if r.strip() and any(re.search(r"\." + re.escape(p), r.split("{")[0]) for p in PREF)]
            if keep: out.append("/* l. %d */ %s {\n  %s\n}" % (ligne, sel_net, "\n  ".join(keep)))
        elif any(re.search(r"\." + re.escape(p), sel_net) for p in PREF) or "#console-modal" in sel_net:
            out.append("/* l. %d */ %s" % (ligne, re.sub(r"^/\*.*?\*/\s*", "", regle, flags=re.S)))
        i = k + 1
used = set(re.findall(r"animation(?:-name)?\s*:\s*([\w-]+)", "\n".join(out)))
for nom, ligne, regle in sorted(kf):
    if nom in used: out.append("/* l. %d */ %s" % (ligne, regle))
dst = os.path.join(os.path.dirname(__file__), "..", "src", "mjpc.css")
open(dst, "w", encoding="utf-8").write("\n".join(out) + "\n")
print(len(out) - 1, "règles →", os.path.normpath(dst))

# la section « Emploi du temps » : son CSS vit dans le code (edtPoserCss), une règle par chaîne
m = re.search(r"function edtPoserCss\(\)\{(.*?)\n\}", txt, re.S)
base = txt[:m.start(1)].count("\n") + 1
edt = ["/* Le CSS de la section « Emploi du temps », posé par edtPoserCss dans index.html (production, md5 " + md5 + ") : chaque règle telle quelle, avec sa ligne (outils/css-mjpc.py). */"]
for k, ligne in enumerate(m.group(1).split("\n")):
    for r in re.findall(r"\+'((?:[^'\\]|\\.)*)'", ligne):
        edt.append("/* l. %d */ %s" % (base + k, r.replace("\\'", "'")))
dst2 = os.path.join(os.path.dirname(__file__), "..", "src", "mjpc-edt.css")
open(dst2, "w", encoding="utf-8").write("\n".join(edt) + "\n")
print(len(edt) - 1, "règles →", os.path.normpath(dst2))
