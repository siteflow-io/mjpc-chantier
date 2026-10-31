# Reconstruire la maquette à partir des sources et des données anonymes de la v14.
from pathlib import Path
import hashlib, json, os, subprocess, sys, tempfile

ma = Path(__file__).resolve().parent.parent
base = ma.parent.parent.parent / "SAUVEGARDES/redaction-1.1.0-RU-avant-scans-2026-10-30.html"
reference = (ma / "T399-maquette-redaction-scans-v14.html").read_text()
pos = reference.index("const BASE0=") + len("const BASE0=")
tree, end = json.JSONDecoder().raw_decode(reference[pos:])
rid = next(iter(tree["redactions"]))
cfg = tree["redactions"][rid]["config"]
cl = tree["classes"][cfg["classe"]]
candidate = ma / sys.argv[1]
with tempfile.TemporaryDirectory() as td:
    d = Path(td)
    for name, value in [
        ("cfg.json", cfg), ("cl.json", cl),
        ("val.json", tree["redactions"][rid].get("validations", {})),
        ("taxo.json", tree.get("taxonomie", {}))
    ]:
        (d / name).write_text(json.dumps(value, ensure_ascii=False))
    out = d / "reconstruite.html"
    env = dict(os.environ, VERSION="1.3.2-RU-C15-1")
    env.pop("PROD", None)
    env.pop("CLASSE_REELLE", None)
    subprocess.run([sys.executable, "gen-maquette.py", str(base), str(d), str(out)], cwd=ma, env=env, check=True)
    expected, actual = candidate.read_bytes(), out.read_bytes()
    if expected != actual:
        raise SystemExit("La maquette et ses sources ne correspondent pas.")
    print("CONSTRUCTION IDENTIQUE :", len(actual), "octets ; SHA-256", hashlib.sha256(actual).hexdigest())
