import re, sys, json, html
def unjs(t):
    t = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), t)
    return t.replace("\\'", "'").replace('\\"', '"')
src = ""
for f in ["/home/claude/monsieurjaipascompris/evaluation-qcm.html", "/home/claude/monsieurjaipascompris/index.html", "/home/claude/monsieurjaipascompris/correction_dictee.html"]:
    src += unjs(open(f, encoding="utf-8").read()) + "\n"
src = html.unescape(src)
norm = lambda s: re.sub(r"\s+", " ", s.replace("’", "'")).strip()
open(sys.argv[1], "w", encoding="utf-8", errors="ignore").write(norm(src))
