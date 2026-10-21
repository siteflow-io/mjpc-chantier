import sys
L=open('/home/user/ref/maq.html',encoding='utf-8').read().split('\n')
# 1-indexed inclusive ranges
R=[(382,442),(888,891),(916,917),(1435,1448),(1644,1803)]
out=[]
for a,b in R:
    out.append('/* ── maquette p8-5g, lignes %d-%d ── */'%(a,b))
    out.extend(L[a-1:b])
open('recit-maquette.js','w',encoding='utf-8').write('\n'.join(out)+'\n')
keep=[l for i,l in enumerate(L,1) if not any(a<=i<=b for a,b in R)]
open('maq-sans-e4.html','w',encoding='utf-8').write('\n'.join(keep))
print(len(out), len(keep))
