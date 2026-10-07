# micro L15k-a : la seconde moitié n'accepte que le binôme constitué ; la tablette n'écrit plus les binômes
import sys, copy, json, time, os; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15ka.html'); DGD='dictee_preparee_5e_grandes_decouvertes-5e_herge'
db=copy.deepcopy(L.BASE); D=db['correction_dictee'][DGD]; D['copyPublishedAt']=1790000000000
cl=L.classe_registre(D['config']['classe'])
# les binômes constitués par l'app, comme « Lancer »
import re
src=open(F,encoding='utf-8').read()
res=D['results']; abs_=D.get('absents') or {}
l=sorted([(k,len([e for e in (v.get('errors') or []) if e and e.get('type')!='A'])+len(v.get('extras') or [])) for k,v in res.items() if isinstance(v,dict) and not abs_.get(k)], key=lambda x:(x[1],x[0]))
B={}; i,j=0,len(l)-1
while i<j: B[l[i][0]]=l[j][0]; B[l[j][0]]=l[i][0]; i+=1; j-=1
T0=int(time.time()*1000)-60000
D['binomes']={'seance':T0,'paires':B,'origine':B,'maj':T0}   # [accordé à L17-1] les binômes de la séance, écrits par la console à « Lancer » (lus par la tablette)
D['heure']={'debut':T0,'fin':T0+50*60000,'classe':D['config']['classe'],'source':'dictee','seanceId':''}; D['config']['peerHelp']=True   # la séance lancée, binômes imposés
a=l[0][0]; bon=B[a]; mauvais=[k for k,_ in l if k not in (a,bon)][0]
for k in (a,bon,mauvais): D['autocorrection'].pop(k,None)
R={}
def tablette(cle2):
    b=Banc(F,1280,800); p=b.ouvrir('?mode=eleve',db=copy.deepcopy(db)); p.wait_for_timeout(1000)
    p.get_by_role('button',name='👥 2 élèves').click(); p.wait_for_timeout(900)
    now=int(time.time()*1000)
    p.evaluate("(a)=>{localStorage.setItem('cd_moitie_1',JSON.stringify({identite:{nom:a[0],cle:a[1],classe:a[4],via:'code'},t:a[5],arrivee:a[5]}))}",[L.nom_eleve(cl,a),a,None,None,D['config']['classe'],now])
    p.reload(); p.wait_for_timeout(1500)
    p.evaluate("(a)=>{localStorage.setItem('cd_moitie_2',JSON.stringify({identite:{nom:a[0],cle:a[1],classe:a[2],via:'code'},t:a[3],arrivee:a[3]}))}",[L.nom_eleve(cl,cle2),cle2,D['config']['classe'],now+1000])
    p.reload(); p.wait_for_timeout(1800)
    t=p.evaluate("()=>[...document.querySelectorAll('.moitie')].map(x=>[x.innerText.slice(0,200),!!x.querySelector('.moitie-refusee')])")
    bin_=b.lire(p,'correction_dictee/%s/binomes'%DGD)
    return b,p,t,bin_
b,p,t,bin_=tablette(bon); R['bon']=[x[1] for x in t]; R['binomes_inchanges_bon']=((bin_ or {}).get('paires')==B); b.fermer()
b,p,t,bin_=tablette(mauvais); R['mauvais']=[x[1] for x in t]; R['texte']=p.evaluate("()=>{const e=document.querySelector('.moitie-refusee');return e?e.innerText:''}").find('Ce n’est pas ta tablette : lève la main.')>=0; R['binomes_inchanges_mauvais']=((bin_ or {}).get('paires')==B)
p.screenshot(path='/home/claude/MICRO15/capture.png'); b.fermer()
print(json.dumps(R,ensure_ascii=False))
ok=R['bon']==[False,False] and R['mauvais']==[False,True] and R['texte'] and R['binomes_inchanges_bon'] and R['binomes_inchanges_mauvais']
print('BANC L15k-a : '+('VERT' if ok else 'ROUGE'))
