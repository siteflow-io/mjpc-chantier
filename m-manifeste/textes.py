# -*- coding: utf-8 -*-
"""M-MANIFESTE — corrections de texte dans index.html, RELUES MOT À MOT."""
import re
s=open('index.html',encoding='utf-8').read()
CORR=[
 # (avant, après, où, motif)
 ('une comp\\u00e9taire majoritaire','une comp\\u00e9tence majoritaire',
  'seed du prompt de chapitre','mot tronqué : « compétaire » n\'existe pas'),
 ('MJPC (monsieurjaipascompris.fr), le site de cours d\\u2019un \"+\n  \"professeur',
  'MJPC (siteflow-io.github.io/monsieurjaipascompris), le site de cours d\\u2019un \"+\n  \"professeur',
  'MJPC_PRESENTATION (tronc)','adresse annoncée non confirmée → adresse réellement servie'),
 ('MJPC (monsieurjaipascompris.fr), le site de cours d\\u2019un professeur \"+',
  'MJPC (siteflow-io.github.io/monsieurjaipascompris), le site de cours d\\u2019un professeur \"+',
  'MJPC_PRESENTATION_BREVE','idem'),
]
faits=[]
for av,ap,ou,motif in CORR:
    n=s.count(av)
    assert n==1, f'ANCRE {n}x : {av[:60]!r}'
    s=s.replace(av,ap);faits.append((ou,motif,av[:70],ap[:70]))
assert s.count('var APP_VERSION="8.15.0"')==1
s=s.replace('var APP_VERSION="8.15.0"','var APP_VERSION="8.16.0"')
open('index.staging.html','w',encoding='utf-8').write(s)
for ou,motif,av,ap in faits:print(f"· {ou} — {motif}\n    avant : {av}\n    après : {ap}")
print(f"\nindex : {len(s)} c.")
