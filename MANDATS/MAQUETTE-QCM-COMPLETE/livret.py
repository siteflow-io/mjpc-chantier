# Le livret PDF (mandat §6, étape 5) : toutes les captures, dans l'ordre de la séance, une phrase sous chacune.
#   python3 livret.py   →   livret-maquette-qcm-v5.pdf
import json, os, html, subprocess, tempfile
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)); C = os.path.join(D, "captures")
liste = json.load(open(os.path.join(C, "liste.json")))
tmp = tempfile.mkdtemp()
pages = []
for x in liste:
    src = os.path.join(C, x["fichier"])
    if not os.path.exists(src): continue
    im = Image.open(src).convert("RGB")
    if im.width > 1400: im = im.resize((1400, round(im.height * 1400 / im.width)))
    jpg = os.path.join(tmp, x["fichier"].replace(".png", ".jpg")); im.save(jpg, quality=72)
    pages.append('<section><div class="h"><b>%d</b> · <code>#scene=%s</code> · %s</div><img src="file://%s"><p>%s</p></section>'
                 % (x["n"], html.escape(x["id"]), html.escape(x["section"]), jpg, html.escape(x["titre"])))
doc = """<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>
@page{size:A4;margin:12mm}body{font-family:Georgia,serif;color:#1e1b4b}
section{page-break-after:always;text-align:center}
.h{font-size:11pt;text-align:left;margin-bottom:4mm;color:#5b21b6}
img{max-width:100%%;max-height:235mm;object-fit:contain;border:1px solid #ddd}
p{font-size:12pt;margin-top:4mm;text-align:left}
.titre{page-break-after:always;padding-top:70mm;text-align:center}
</style></head><body><div class="titre"><h1>La maquette complète du QCM</h1><p style="text-align:center">maquette-qcm-v5.html · %d scènes, dans l'ordre de la séance · une capture et une phrase par scène</p></div>%s</body></html>""" % (len(pages), "".join(pages))
h = os.path.join(tmp, "livret.html"); open(h, "w", encoding="utf-8").write(doc)
out = os.path.join(D, "livret-maquette-qcm-v5.pdf")
js = "const {chromium}=require('/opt/node22/lib/node_modules/playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();await p.goto('file://%s');await p.waitForLoadState('load');await p.pdf({path:'%s',format:'A4',printBackground:true});await b.close();})();" % (h, out)
subprocess.run(["node", "-e", js], check=True)
print(out, os.path.getsize(out), "octets,", len(pages), "pages de captures")
