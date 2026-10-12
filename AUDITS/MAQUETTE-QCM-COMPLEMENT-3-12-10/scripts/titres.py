import json,glob,re,collections
corp=open('../aud2/corpus-prod.txt',encoding='utf-8').read()
norm=lambda s: re.sub(r"\s+"," ",s.replace("’","'").replace(' ',' ').replace(' ',' ')).strip()
allt=collections.defaultdict(set)
for f in sorted(glob.glob('txt/*.json')):
  d=json.load(open(f))
  if d['vue'] not in ('console','telephone'): continue
  for t in d['titres']:
    ti=t['title'] or ''
    if ti and 'Scènes de la maquette' not in ti: allt[ti].add(d['n'])
probs=collections.defaultdict(list)
for ti,ns in allt.items():
  n=norm(ti)
  if n in corp: continue
  m=min(ns)
  if not re.search(r'[.!?…»)]$',n): probs['sans point final'].append((m,n[:110]))
  if re.search(r'\S  \S',ti): probs['double espace'].append((m,n[:110]))
  if re.search(r'\bsession',n,re.I): probs['session'].append((m,n[:110]))
  if re.search(r'[a-z][A-Z]\w+\(|Firebase|sessionActive|undefined|NaN|\[object',n): probs['code'].append((m,n[:110]))
  if len(n)>420: probs['très longue'].append((m,n[:90]+'…'))
  if re.search(r"\b(de|que) (Inès|Élise|Emma|Enzo|Adam|Anna|ESNAULT|ISAMBERT|OLLIVIER|ABRIAL|AUDEBERT|AUGEREAU|un|une|il|elle)\b",n): probs['élision'].append((m,n[:110]))
print(len(allt),'infobulles distinctes (console, téléphone)')
for k,v in probs.items():
  print('====',k,len(v))
  for m,t in sorted(v)[:12]: print('  ',m,t)
