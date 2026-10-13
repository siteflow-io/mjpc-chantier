import sys, re, collections, json
sys.path.insert(0, ".")
from corpus import *
E = charge()
def cherche(p, ctx=70, nex=3, cotes=("Paul", "élèves")):
    r = re.compile(p)
    ecr = collections.defaultdict(set); ex = collections.defaultdict(list)
    for e in E:
        c = cote(e["appareil"])
        for k, l in e["lignes"]:
            s = sa(l)
            for m in r.finditer(s):
                v = m.group(0); ecr[(c, v)].add(e["src"][:3] + ":" + e["id"])
                if len(ex[(c, v)]) < nex and l not in [x[1] for x in ex[(c, v)]]:
                    i = m.start(); ex[(c, v)].append((e["id"], l[max(0, i - ctx):i + ctx], k, l))
    return ecr, ex
if __name__ == "__main__":
    p = sys.argv[1]; ecr, ex = cherche(p, nex=int(sys.argv[2]) if len(sys.argv) > 2 else 3)
    for key in sorted(ecr, key=lambda k: -len(ecr[k])):
        print(key, len(ecr[key]), "écrans")
        for x in ex[key]: print("    ", x[0], "|", x[2], "|", x[1].replace("\n", " "))
