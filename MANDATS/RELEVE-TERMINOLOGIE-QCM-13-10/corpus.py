# Le corpus du relevé : les 169 écrans de la maquette v9 (le code de la 8.0.0), et les 26 écrans de l'app relevés par QCM-4 à 13:12
import json, re, unicodedata
W = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/codewt/LIVRAISONS/CODE-QCM/"
def sa(s): return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
def charge():
    E = []
    for sc in json.load(open(W + "banc/reference/maquette-v9.json"))["scenes"]:
        lignes = [("texte", t) for t in sc.get("texte", [])] + [("bulle", b) for b in sc.get("bulles", [])] + [("geste", g.get("l", "")) for g in sc.get("gestes", [])]
        E.append({"src": "maquette v9", "id": sc["id"], "appareil": sc["appareil"], "titre": sc.get("titre", ""), "lignes": lignes})
    for k, sc in json.load(open(W + "sorties/2026-10-13_1312/releves-branches.json")).items():
        lignes = [("texte", t) for t in sc.get("texte", [])] + [("bulle", b) for b in sc.get("bulles", [])] + [("geste", (g.get("l", "") if isinstance(g, dict) else str(g))) for g in sc.get("gestes", [])]
        E.append({"src": "app 8.0.0", "id": k, "appareil": sc.get("appareil", "?"), "titre": "", "lignes": lignes})
    return E
def cote(a): return "Paul" if a in ("console", "telephone") else "élèves"
