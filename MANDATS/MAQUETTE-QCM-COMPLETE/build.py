# Assemble la maquette complète du QCM en un seul fichier HTML autonome : maquette-qcm-vN.html.
# Le CSS de la 7.7.1 (qcm.css) tel quel, les ajouts des maquettes, React 17 local, puis les scènes, puis le socle.
# Usage : python3 build.py N   (N = la version ; le fichier d'une version déjà livrée n'est jamais réécrit)
import os, re, sys, json, hashlib
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, "src")
def lire(*p): return open(os.path.join(*p), encoding="utf-8").read()

CSS = ["qcm.css", "maquette.css", "maquette610.css", "maquette620.css", "maquette626.css", "maquette627.css", "maquette628.css", "socle.css", "etapes.css", "mjpc.css", "mjpc-edt.css", "mjpc-ajouts.css", "complement2.css", "c3.css", "c3-bulles.css"]
# (complément 3) le scénario, un seul : tout ce que montrent les scènes s'en calcule (src/scenario.js), avec les évaluations du hub lues le 08/10
JS = ["scenario.js", "maquette.js", "maquette2.js", "ev3e.js", "maquette610.js", "maquette620.js",
      "com626.js", "maquette626.js", "com627.js", "maquette627.js", "com628.js", "maquette628.js", "com632.js"]
EXTRA_JS = json.load(open(os.path.join(S, "ordre_js.json"))) if os.path.exists(os.path.join(S, "ordre_js.json")) else []
JS += EXTRA_JS + ["gestes.js", "etape2.js", "etape3.js", "etape4.js", "mjpc.js", "complement1.js", "complement2.js",
       # (complément 3) le scénario dans les écrans : chaque chiffre au moment de la scène
       "c3-base.js", "c3-pilot.js", "c3-corr.js", "c3-appareils.js", "c3-soir.js", "c3-evals.js", "c3-scenes.js", "c3-objets.js", "c3-tablettes.js", "c3-telephone.js", "c3-x610.js", "c3-feuille.js", "c3-textes.js", "c3-gestes.js", "c3-bulles.js", "socle.js"]

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
# (complément 1, défaut 5) le PDF tel que le code le produira : le même texte, sans l'encadré « Exemple de la maquette… »
# et sans aucun souligné de proposition (les marques de validation de gen632.js, faites pour la relecture de Paul)
pdf = re.sub(r'<div class="exemple">.*?</div>\n?', "", pdf, count=1, flags=re.S)
pdf = re.sub(r"\.prov\{[^}]*\}", "", pdf).replace('<span class="prov">', "<span>")
assert "Exemple de la maquette" not in pdf and 'class="prov"' not in pdf
# (complément 1, D1) la vraie taxonomie de la production, copiée dans les sources avec son md5 (src/donnees/MD5.txt)
taxo = lire(S, "donnees", "taxonomie_atelier.json")
# le prompt de création d'éval, tel qu'il est au sas (tour 630, acquis au tour 633)
prompt = re.search(r"## Le texte proposé\s*```\n(.*?)\n```", lire(D, "..", "PROMPT-QCM-CREATION", "README.md"), re.S).group(1)
# (complément 3, relecteur n°248, changement 8) à la correction, c'est le voisin qui lit la feuille et clique ce qu'elle dit : le prompt le dit
_avant = "3. Correction, après toutes les questions : l'élève recopie sur la tablette ce que dit sa feuille, puis je révèle la réponse et je commente."
if _avant not in prompt: sys.exit("refus : la ligne 3 du prompt n'est plus celle du sas")
prompt = prompt.replace(_avant, "3. Correction, après toutes les questions : chaque élève lit la feuille de son voisin et clique sur la tablette ce qu'elle dit, puis je révèle la réponse et je commente.")
# (complément 1) ce qui remplit les jetons du prompt : le chapitre de 3e et ses compétences (copie du sas, md5 dans src/donnees/MD5.txt),
# les libellés élève, et le texte de {{LIMITES}} des mesures (mesures/limites.json, « texte_limites »)
chap = json.loads(lire(S, "donnees", "chapitre-3e-poesie-peinture-final.json"))["chapitre"]
chapitre = {"titre": chap["title"], "majeures": chap["competencesMajeures"], "mineures": chap["competencesMineures"]}
libel = json.loads(lire(S, "donnees", "libelles_eleve.json"))
limites = json.loads(lire(D, "mesures", "limites.json"))
texte_limites = limites.get("texte_limites") or re.search(r"(?m)^> (.*)$", lire(D, "mesures", "README.md")).group(1)
# (complément 2, §4) les objets de l'emploi du temps relus au hub par la conscience (MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT/),
# vérifiés contre leurs md5 ; et les deux consignes d'index.html (src/donnees/edt-prompts.json)
EDT_DIR = os.path.join(D, "..", "COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT")
edt = {}
for l in open(os.path.join(EDT_DIR, "md5.txt"), encoding="utf-8").read().split("\n"):
    if not l.strip(): continue
    m5, f = l.split()[:2]
    if hashlib.md5(open(os.path.join(EDT_DIR, f), "rb").read()).hexdigest() != m5: sys.exit("refus : " + f + " n'a pas son md5 (" + m5 + ")")
    edt[f[:-5]] = json.loads(lire(EDT_DIR, f))
edt_prompts = json.loads(lire(S, "donnees", "edt-prompts.json"))["prompts"]
# (complément 3) les évaluations du hub, lues le 08/10 (banc/fauxhub/evals_now.json), vérifiées contre leur md5 (src/donnees/MD5.txt)
hub_brut = open(os.path.join(S, "donnees", "evaluations_hub.json"), "rb").read()
if hashlib.md5(hub_brut).hexdigest() != "ae5860e47e633875e873d9d0190d798a": sys.exit("refus : evaluations_hub.json n'a pas son md5")
hub = json.loads(hub_brut.decode("utf-8"))
# (complément 3, changement 1) les explications retirées de l'écran, et leur place : l'infobulle de l'élément (banc/existant/textes-console.json)
dest_c3 = [[x["destination"]["infobulle"], x["destination"]["place"], sorted(set(x.get("scenes", []) + [x["destination"]["scene"]]))]
           for x in json.loads(lire(D, "banc", "existant", "textes-console.json"))["textes"]
           if x.get("categorie") == "explication" and x.get("destination", {}).get("infobulle")]
html = ("<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"UTF-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
        "<title>Maquette complète du QCM</title>\n"
        "<script>\n" + lire(D, "vendor", "react.production.min.js") + "\n</script>\n"
        "<script>\n" + lire(D, "vendor", "react-dom.production.min.js") + "\n</script>\n"
        + "".join("<style>\n/* ═════ " + c + " ═════ */\n" + lire(S, c) + "\n</style>\n" for c in CSS) +
        "</head>\n<body>\n<div id=\"root\"></div>\n<div id=\"som-racine\"></div>\n"
        "<script>\nvar PROMPT_TEXTE = " + json.dumps(prompt, ensure_ascii=False).replace("</", "<\\/") + ";\nwindow.PDF632_HTML = " + json.dumps(pdf, ensure_ascii=False).replace("</", "<\\/") + ";\nvar TAXO = " + json.dumps(json.loads(taxo), ensure_ascii=False).replace("</", "<\\/") + ";\n"
        + "var CHAPITRE_3E = " + json.dumps(chapitre, ensure_ascii=False) + ";\nvar LIBELLES_ELEVE = " + json.dumps(libel, ensure_ascii=False) + ";\nvar LIMITES_TEXTE = " + json.dumps(texte_limites, ensure_ascii=False) + ";\n"
        + "var DEST_C3 = " + json.dumps(dest_c3, ensure_ascii=False).replace("</", "<\\/") + ";\n"
        + "var HUB_EVALS = " + json.dumps(hub, ensure_ascii=False).replace("</", "<\\/") + ";\n"
        + "var EDT_DONNEES = " + json.dumps(edt, ensure_ascii=False).replace("</", "<\\/") + ";\nvar EDT_PROMPTS_INDEX = " + json.dumps(edt_prompts, ensure_ascii=False).replace("</", "<\\/") + ";\n"
        + "\n".join(js(n) for n in JS) + "\n</script>\n</body>\n</html>\n")

# garde (étape 4, défaut 27) : le script assemblé se compile, sinon rien n'est écrit
import subprocess, tempfile
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
    f.write("\n".join(js(n) for n in JS)); essai = f.name
r = subprocess.run(["node", "--check", essai], capture_output=True, text=True)
os.unlink(essai)
if r.returncode: sys.exit("refus : le script assemblé ne se compile pas\n" + r.stderr[:800])

n = sys.argv[1] if len(sys.argv) > 1 else "dev"
nom = "maquette-qcm-v%s.html" % n
chemin = os.path.join(D, nom)
if n != "dev" and os.path.exists(chemin) and "--force" not in sys.argv:
    sys.exit("refus : %s existe déjà (une version livrée ne se réécrit pas)" % nom)
open(chemin, "w", encoding="utf-8").write(html)
md5 = hashlib.md5(html.encode("utf-8")).hexdigest()
open(chemin + ".md5", "w").write(md5 + "  " + nom + "\n")
print(nom, len(html), "octets, md5", md5)
