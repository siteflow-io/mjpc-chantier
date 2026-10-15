# QCM-1 · SOCLE — assemble l'app du QCM en un seul fichier HTML : evaluation-qcm.staging.html (et son md5).
# Les écrans de la maquette validée (v9, src/), branchés sur la vraie séance : la couche de la séance réelle (src/live/), le socle MJPC-CORE
# de la 7.7.1 (src/live/mjpc-core.js), le SDK Firebase 8.10.1 de la 7.7.1 (chargé comme elle, depuis gstatic), React 17 local.
# Sans sommaire ⚙ ni scènes : chaque page montre l'écran de son appareil au moment réel (src/socle.js, src/live/pages.js).
# Les écrans de MJPC (src/mjpc.js) n'entrent pas dans l'app (COMMUN §1).
# Usage : python3 build.py            → evaluation-qcm.staging.html

import os, re, sys, json, hashlib, subprocess, tempfile
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, "src")
RACINE = os.path.normpath(os.path.join(D, "..", ".."))
MAQ = os.path.join(RACINE, "MANDATS", "MAQUETTE-QCM-COMPLETE")
def lire(*p): return open(os.path.join(*p), encoding="utf-8").read()
MAQUETTE = "--maquette" in sys.argv

CSS = ["qcm.css", "maquette.css", "maquette610.css", "maquette620.css", "maquette626.css", "maquette627.css", "maquette628.css", "socle.css", "etapes.css", "mjpc.css", "mjpc-edt.css", "mjpc-ajouts.css", "complement2.css", "c3.css", "c3-bulles.css", "c4.css"]
# les retouches de style de QCM-2 et QCM-3, si elles existent ; puis celles du socle
CSS += [c for c in ["qcm2.css", "qcm3.css", "live/live.css"] if os.path.exists(os.path.join(S, c))]
# la séance réelle d'abord : le socle MJPC-CORE, puis SCN, ACT, ELV (src/live/base.js) ; scenario.js ne garde que la compatibilité
JS = ["live/mjpc-core.js", "live/base.js", "scenario.js", "maquette.js", "maquette2.js", "ev3e.js", "maquette610.js", "maquette620.js",
      "com626.js", "maquette626.js", "com627.js", "maquette627.js", "com628.js", "maquette628.js", "com632.js"]
EXTRA_JS = json.load(open(os.path.join(S, "ordre_js.json"))) if os.path.exists(os.path.join(S, "ordre_js.json")) else []
JS += EXTRA_JS + ["gestes.js", "etape2.js", "etape3.js", "etape4.js"] + (["mjpc.js"] if MAQUETTE else ["live/sans-mjpc.js"]) + ["complement1.js", "complement2.js",
       "c3-base.js", "c3-pilot.js", "c3-corr.js", "c3-appareils.js", "c3-soir.js", "c3-evals.js", "c3-scenes.js", "c3-objets.js", "c3-tablettes.js", "c3-telephone.js", "c3-x610.js", "c3-feuille.js", "c3-textes.js", "c3-gestes.js",
       "c4-seances.js"] + (["lire-copies.js"] if os.path.exists(os.path.join(S, "lire-copies.js")) else []) + ["c3-bulles.js"]   # (15/10) « 📄 Lire les copies », posé par QCM-3
# les écrans branchés : la table des pages et des gestes (src/live/), puis le socle qui rend
JS += [j for j in ["live/pages.js", "live/gestes.js"] if os.path.exists(os.path.join(S, j))] + ["socle.js"]
if MAQUETTE: JS = [j for j in JS if not j.startswith("live/")]

def js(nom):
    t = lire(S, nom)
    # chaque morceau se relançait seul : le socle rend une seule fois, à la fin
    if nom != "socle.js": t = re.sub(r"(?m)^rendre\(\);\s*$", "", t)
    # les commentaires successifs (626, 627, 628) portaient le même nom : chacun garde le sien ; com632 garde commentaireQCM
    m = re.search(r"(?:com|maquette)(62[678])\.js$", nom)
    if m: t = t.replace("commentaireQCM", "commentaireQCM_" + m.group(1))
    if nom.startswith("com"): t = re.sub(r"(?m)^if\(typeof module.*$", "", t)
    if nom == "scenario.js": t = re.sub(r"(?m)^if\(typeof module.*$", "", t)
    return "/* ═════ " + nom + " ═════ */\n" + t

pdf = lire(S, "pdf632.html")
pdf = re.sub(r'<div class="exemple">.*?</div>\n?', "", pdf, count=1, flags=re.S)
pdf = re.sub(r"\.prov\{[^}]*\}", "", pdf).replace('<span class="prov">', "<span>")
assert "Exemple de la maquette" not in pdf and 'class="prov"' not in pdf
taxo = lire(S, "donnees", "taxonomie_atelier.json")
# le prompt de création d'éval, tel qu'il est au sas, avec la ligne 3 de la correction (complément 3, changement 8)
prompt = re.search(r"## Le texte proposé\s*```\n(.*?)\n```", lire(RACINE, "MANDATS", "PROMPT-QCM-CREATION", "README.md"), re.S).group(1)
_avant = "3. Correction, après toutes les questions : l'élève recopie sur la tablette ce que dit sa feuille, puis je révèle la réponse et je commente."
if _avant in prompt:
    prompt = prompt.replace(_avant, "3. Correction, après toutes les questions : chaque élève lit la feuille de son voisin et clique sur la tablette ce qu'elle dit, puis je révèle la réponse et je commente.")
chap = json.loads(lire(S, "donnees", "chapitre-3e-poesie-peinture-final.json"))["chapitre"]
chapitre = {"titre": chap["title"], "majeures": chap["competencesMajeures"], "mineures": chap["competencesMineures"]}
libel = json.loads(lire(S, "donnees", "libelles_eleve.json"))
limites = json.loads(lire(MAQ, "mesures", "limites.json"))
texte_limites = limites.get("texte_limites") or re.search(r"(?m)^> (.*)$", lire(MAQ, "mesures", "README.md")).group(1)
EDT_DIR = os.path.join(RACINE, "MANDATS", "COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT")
edt = {}
for l in open(os.path.join(EDT_DIR, "md5.txt"), encoding="utf-8").read().split("\n"):
    if not l.strip(): continue
    m5, f = l.split()[:2]
    if hashlib.md5(open(os.path.join(EDT_DIR, f), "rb").read()).hexdigest() != m5: sys.exit("refus : " + f + " n'a pas son md5 (" + m5 + ")")
    edt[f[:-5]] = json.loads(lire(EDT_DIR, f))
edt_prompts = json.loads(lire(S, "donnees", "edt-prompts.json"))["prompts"]
# les évaluations du scénario : la maquette seule ; l'app lit celles de la base (qcm/evaluations)
hub_brut = open(os.path.join(S, "donnees", "evaluations_hub.json"), "rb").read()
if hashlib.md5(hub_brut).hexdigest() != "ae5860e47e633875e873d9d0190d798a": sys.exit("refus : evaluations_hub.json n'a pas son md5")
hub = json.loads(hub_brut.decode("utf-8"))
dest_c3 = [[x["destination"]["infobulle"], x["destination"]["place"], sorted(set(x.get("scenes", []) + [x["destination"]["scene"]]))]
           for x in json.loads(lire(MAQ, "banc", "existant", "textes-console.json"))["textes"]
           if x.get("categorie") == "explication" and x.get("destination", {}).get("infobulle")]
def j(v): return json.dumps(v, ensure_ascii=False).replace("</", "<\\/")
titre = "Maquette complète du QCM" if MAQUETTE else "📝 Évaluation QCM"
html = ("<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"UTF-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
        "<title>" + titre + "</title>\n"
        + ("" if MAQUETTE else "<script src=\"https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js\"></script>\n<script src=\"https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js\"></script>\n")
        + "<script>\n" + lire(MAQ, "vendor", "react.production.min.js") + "\n</script>\n"
        "<script>\n" + lire(MAQ, "vendor", "react-dom.production.min.js") + "\n</script>\n"
        + "".join("<style>\n/* ═════ " + c + " ═════ */\n" + lire(S, c) + "\n</style>\n" for c in CSS) +
        "</head>\n<body>\n<div id=\"root\"></div>\n<div id=\"som-racine\"></div>\n"
        "<script>\nvar APP_QCM = " + ("false" if MAQUETTE else "true") + ";\nvar PROMPT_TEXTE = " + j(prompt) + ";\nwindow.PDF632_HTML = " + j(pdf) + ";\nvar TAXO = " + j(json.loads(taxo)) + ";\n"
        + "var CHAPITRE_3E = " + j(chapitre) + ";\nvar LIBELLES_ELEVE = " + j(libel) + ";\nvar LIMITES_TEXTE = " + j(texte_limites) + ";\n"
        + "var DEST_C3 = " + j(dest_c3) + ";\n"
        + "var HUB_EVALS = " + j(hub) + ";\n"
        + "var EDT_DONNEES = " + j(edt) + ";\nvar EDT_PROMPTS_INDEX = " + j(edt_prompts) + ";\n"
        + "\n".join(js(n) for n in JS) + "\n</script>\n</body>\n</html>\n")

# garde : le script assemblé se compile, sinon rien n'est écrit
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
    f.write("\n".join(js(n) for n in JS)); essai = f.name
r = subprocess.run(["node", "--check", essai], capture_output=True, text=True)
os.unlink(essai)
if r.returncode: sys.exit("refus : le script assemblé ne se compile pas\n" + r.stderr[:1500])

nom = "maquette-qcm-dev.html" if MAQUETTE else "evaluation-qcm.staging.html"
chemin = os.path.join(D, nom)
open(chemin, "w", encoding="utf-8").write(html)
md5 = hashlib.md5(html.encode("utf-8")).hexdigest()
open(chemin + ".md5", "w").write(md5 + "  " + nom + "\n")
print(nom, len(html), "octets, md5", md5)
