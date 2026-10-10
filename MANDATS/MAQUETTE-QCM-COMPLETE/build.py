# Assemble la maquette complète du QCM en un seul fichier HTML autonome : maquette-qcm-vN.html.
# Le CSS de la 7.7.1 (qcm.css) tel quel, les ajouts des maquettes, React 17 local, puis les scènes, puis le socle.
# Usage : python3 build.py N   (N = la version ; le fichier d'une version déjà livrée n'est jamais réécrit)
import os, re, sys, json, hashlib
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, "src")
def lire(*p): return open(os.path.join(*p), encoding="utf-8").read()

CSS = ["qcm.css", "maquette.css", "maquette610.css", "maquette620.css", "maquette626.css", "maquette627.css", "maquette628.css", "socle.css", "etapes.css"]
JS = ["maquette.js", "maquette2.js", "ev3e.js", "maquette610.js", "maquette620.js",
      "com626.js", "maquette626.js", "com627.js", "maquette627.js", "com628.js", "maquette628.js", "com632.js"]
EXTRA_JS = json.load(open(os.path.join(S, "ordre_js.json"))) if os.path.exists(os.path.join(S, "ordre_js.json")) else []
JS += EXTRA_JS + ["gestes.js", "etape2.js", "etape3.js", "socle.js"]

def js(nom):
    t = lire(S, nom)
    # chaque morceau se relançait seul : le socle rend une seule fois, à la fin
    if nom != "socle.js": t = re.sub(r"(?m)^rendre\(\);\s*$", "", t)
    # les commentaires successifs (626, 627, 628) portaient le même nom : chacun garde le sien ; com632 garde commentaireQCM
    m = re.search(r"(?:com|maquette)(62[678])\.js$", nom)
    if m: t = t.replace("commentaireQCM", "commentaireQCM_" + m.group(1))
    if nom.startswith("com"): t = re.sub(r"(?m)^if\(typeof module.*$", "", t)
    return "/* ═════ " + nom + " ═════ */\n" + t

pdf = lire(S, "pdf632.html")
# le prompt de création d'éval, tel qu'il est au sas (tour 630, acquis au tour 633)
prompt = re.search(r"## Le texte proposé\s*```\n(.*?)\n```", lire(D, "..", "PROMPT-QCM-CREATION", "README.md"), re.S).group(1)
html = ("<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"UTF-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
        "<title>Maquette complète du QCM</title>\n"
        "<script>\n" + lire(D, "vendor", "react.production.min.js") + "\n</script>\n"
        "<script>\n" + lire(D, "vendor", "react-dom.production.min.js") + "\n</script>\n"
        + "".join("<style>\n/* ═════ " + c + " ═════ */\n" + lire(S, c) + "\n</style>\n" for c in CSS) +
        "</head>\n<body>\n<div id=\"root\"></div>\n<div id=\"som-racine\"></div>\n"
        "<script>\nvar PROMPT_TEXTE = " + json.dumps(prompt, ensure_ascii=False).replace("</", "<\\/") + ";\nwindow.PDF632_HTML = " + json.dumps(pdf, ensure_ascii=False).replace("</", "<\\/") + ";\n"
        + "\n".join(js(n) for n in JS) + "\n</script>\n</body>\n</html>\n")

n = sys.argv[1] if len(sys.argv) > 1 else "dev"
nom = "maquette-qcm-v%s.html" % n
chemin = os.path.join(D, nom)
if n != "dev" and os.path.exists(chemin) and "--force" not in sys.argv:
    sys.exit("refus : %s existe déjà (une version livrée ne se réécrit pas)" % nom)
open(chemin, "w", encoding="utf-8").write(html)
md5 = hashlib.md5(html.encode("utf-8")).hexdigest()
open(chemin + ".md5", "w").write(md5 + "  " + nom + "\n")
print(nom, len(html), "octets, md5", md5)
