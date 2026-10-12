import json,collections,re,sys
from urllib.parse import unquote
S={s['id']:s for s in json.load(open('scenes.json'))}
L=[json.loads(l) for l in open(sys.argv[1])]
print(len(L),'éléments,',len(set(x['n'] for x in L)),'scènes')
nom=re.compile(r'^([A-ZÉÈÀÇ]{2,}[A-ZÉÈ\'-]*) ([A-ZÉ][a-zéèëïî]+)')
bad=[];ok=0
for x in L:
  m=nom.match(x['lib'])
  if not m: continue
  r=x['res'] or {}
  full=m.group(1)+' '+m.group(2)
  if r.get('aller'):
    d=unquote(r['aller'])
    if m.group(2) in d or full in d: ok+=1
    else: bad.append((x['n'],x['id'],full,'→',d))
  elif r.get('change'):
    plus=' '.join((r.get('diff') or {}).get('plus',[]))
    if full in plus or m.group(2) in plus: ok+=1
    else: bad.append((x['n'],x['id'],full,'sur place',plus[:120]))
  elif x['dis'] or not x['vis']: pass
  elif r.get('err') and 'Timeout' in r['err']: pass
  else: bad.append((x['n'],x['id'],full,'RIEN',str(r)[:100]))
print('NOMS : justes',ok,'— douteux',len(bad))
for b in bad[:60]: print('  ',b)
c=collections.Counter()
for x in L:
  r=x['res']
  if x['dis']: c['ferme']+=1
  elif not x['vis']: c['invisible']+=1
  elif r and r.get('aller'): c['va']+=1
  elif r and r.get('err') and 'Timeout' in r['err']: c['inatteignable']+=1
  elif r and r.get('change'): c['change']+=1
  elif r and r.get('ouvert'): c['ouvert']+=1
  else: c['RIEN']+=1
print(c)
g=collections.defaultdict(list)
for x in L:
  r=x['res'] or {}
  if x['dis'] or not x['vis'] or r.get('aller') or r.get('change') or r.get('ouvert') or (r.get('err') and 'Timeout' in r['err']): continue
  g[(x['lib'][:60],x['tag'],x['cls'][:30])].append(x['n'])
for k,v in sorted(g.items(), key=lambda kv: kv[1][0]): print('RIEN',sorted(set(v))[:15], k)
print('=== scènes inconnues ===')
for x in L:
  r=x['res'] or {}
  d=r.get('aller')
  if d and unquote(d).split('&')[0] not in S: print(x['n'],x['lib'][:40],d)
print("=== changements d'appareil ===")
ch=collections.defaultdict(set)
for x in L:
  r=x['res'] or {}; d=r.get('aller')
  if not d: continue
  base=unquote(d).split('&')[0]
  if base in S and S[base]['appareil']!=x['vue']: ch[(x['vue']+'→'+S[base]['appareil'], x['lib'][:40], base)].add(x['n'])
for k,v in sorted(ch.items(), key=lambda kv:min(kv[1])): print(sorted(v)[:12],k)
print("=== même libellé, même scène, même destination (hors onglets et en-tête) ===")
par=collections.defaultdict(lambda: collections.defaultdict(list))
for x in L:
  r=x['res'] or {}
  if r.get('aller'): par[x['n']][x['lib'][:40]].append(unquote(r['aller']))
for n in sorted(par):
  for lib,ds in par[n].items():
    if len(ds)>1 and len(set(ds))<len(ds): print(n,lib,len(ds),collections.Counter(ds).most_common(2))
