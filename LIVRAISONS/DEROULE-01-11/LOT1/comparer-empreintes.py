# Compare les EMPREINTES de la partie E de sonde-lot1 entre deux passes (la base et l'après) : la copie répétée, les chemins écrits, l'annonce et la scène
# de /site/repetition, ce que montre le tableau distant — sans et avec le choix au menu du nom. usage : python3 -I comparer-empreintes.py <sortie avant> <sortie après>
import json, re, sys
def lire(f):
    out = {}
    for l in open(f, encoding='utf-8'):
        m = re.search(r'\[E\] EMPREINTE (\S+) (\{.*\})\s*$', l)
        if m: out[m.group(1)] = json.loads(m.group(2))
    return out
A, B = lire(sys.argv[1]), lire(sys.argv[2]); n = d = 0
for cas in ('sans-choix', 'choix'):
    if cas not in A or cas not in B: print('ÉCHEC', cas, ': empreinte absente', cas in A, cas in B); d += 1; continue
    for k in sorted(set(A[cas]) | set(B[cas])):
        n += 1; same = A[cas].get(k) == B[cas].get(k)
        if not same: d += 1
        print(('  ok     ' if same else '  ÉCHEC  ') + cas + ' · ' + k + (' : identique' if same else ' : avant ' + json.dumps(A[cas].get(k), ensure_ascii=False)[:300] + ' · après ' + json.dumps(B[cas].get(k), ensure_ascii=False)[:300]))
print('--- fin : %d comparaisons, %d différence(s)' % (n, d))
sys.exit(1 if d else 0)
