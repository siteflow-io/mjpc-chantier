# Assemble maquette.html : le CSS du QCM 7.7.1 tel quel, les ajouts de la maquette, React 17 local.
import os
D = os.path.dirname(os.path.abspath(__file__))
def lire(n): return open(os.path.join(D, n), encoding="utf-8").read()
html = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Maquette flux binôme</title>
<script src="react.production.min.js"></script>
<script src="react-dom.production.min.js"></script>
<style>
""" + lire("qcm.css") + """
</style>
<style>
""" + lire("maquette.css") + """
</style>
</head>
<body>
<div id="root"></div>
<script>
""" + lire("maquette.js") + """
</script>
</body>
</html>
"""
open(os.path.join(D, "maquette.html"), "w", encoding="utf-8").write(html)
print("maquette.html", len(html), "octets")
