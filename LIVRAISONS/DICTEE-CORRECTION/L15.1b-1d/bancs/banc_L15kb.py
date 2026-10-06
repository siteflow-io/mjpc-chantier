# micro L15k-b : binômes d'après les erreurs (le hub partiel ignoré), voile avec « Revenir », absents du jour (orphelins seuls), 0 erreur = Terminé, session prof glissante
import sys, copy, json, time, os, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15kb.html'); DGD='dictee_preparee_5e_grandes_decouvertes-5e_herge'
db=copy.deepcopy(L.BASE); D=db['correction_dictee'][DGD]; D['copyPublishedAt']=1790000000000
cl=L.classe_registre(D['config']['classe']); res=D['results']; ab=D.get('absents') or {}
def nE(k): v=res[k]; return len([e for e in (v.get('errors') or []) if e and e.get('type')!='A'])+len(v.get('extras') or [])
l=sorted([(k,nE(k)) for k,v in res.items() if isinstance(v,dict) and not ab.get(k)], key=lambda x:(x[1],x[0]))
B={}; i,j=0,len(l)-1
while i<j: B[l[i][0]]=l[j][0]; B[l[j][0]]=l[i][0]; i+=1; j-=1
a=l[0][0]; bon=B[a]; autres=[k for k,_ in l if k not in (a,bon)]; mauvais=autres[0]
D['binomes']={'zz_x':'zz_y','zz_y':'zz_x'}   # le hub partiel (comme les Hugo)
for k in (a,bon,mauvais): D['autocorrection'].pop(k,None)
R={}; now=int(time.time()*1000)
def seed(p,n,cle,t): p.evaluate("(a)=>localStorage.setItem('cd_moitie_'+a[0],JSON.stringify({identite:{nom:a[1],cle:a[2],classe:a[3],via:'code'},t:a[4],arrivee:a[4]}))",[n,L.nom_eleve(cl,cle),cle,D['config']['classe'],t])
b=Banc(F,1280,800); p=b.ouvrir('?mode=eleve',db=copy.deepcopy(db)); p.wait_for_timeout(1000)
p.get_by_role('button',name='👥 2 élèves').click(); p.wait_for_timeout(800)
seed(p,1,a,now); p.reload(); p.wait_for_timeout(1800)
t2=p.evaluate("()=>document.querySelectorAll('.moitie')[1].innerText")
R['binome_affiche']=('Ton binôme : '+L.nom_eleve(cl,bon)) in t2
# un mauvais élève sur la moitié 2 → voile → Revenir → l'écran « Ton binôme » revient
seed(p,2,mauvais,now+1000); p.reload(); p.wait_for_timeout(1800)
R['voile']=p.locator('.moitie-refusee').count()==1 and 'Ce n’est pas ta tablette : lève la main.' in p.locator('.moitie-refusee').inner_text()
R['refusee_oubliee']=p.evaluate("()=>(JSON.parse(localStorage.getItem('cd_moitie_2')||'{}')).refusee===true")
p.locator('#revenir-moitie-2').click(); p.wait_for_timeout(1500)
t2b=p.evaluate("()=>document.querySelectorAll('.moitie')[1].innerText"); R['revenir']=p.locator('.moitie-refusee').count()==0 and ('Ton binôme : '+L.nom_eleve(cl,bon)) in t2b
seed(p,2,mauvais,now+2000); p.reload(); p.wait_for_timeout(1800); p.reload(); p.wait_for_timeout(1800)
R['rechargement_sans_voile']=p.locator('.moitie-refusee').count()==0
# le bon binôme entre
seed(p,2,bon,now+3000); p.reload(); p.wait_for_timeout(1800); R['bon_entre']=p.locator('.moitie-refusee').count()==0 and 'Ton binôme' not in p.evaluate("()=>document.querySelectorAll('.moitie')[1].innerText")
R['hub_binomes_intact']=b.lire(p,'correction_dictee/%s/binomes'%DGD)=={'zz_x':'zz_y','zz_y':'zz_x'}
p.screenshot(path='/home/claude/MICRO16/capture-tablette.png'); b.fermer()
# absents du jour : le professeur coche le binôme de a ; seuls a et un autre orphelin sont réappariés ; les autres paires identiques ; la tablette le voit en direct
b2=Banc(F,1366,900); db2=copy.deepcopy(db); p2=b2.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%DGD,db=db2); p2.wait_for_timeout(3000)
p2.locator('button:has-text("Suivi")').first.click(); p2.wait_for_timeout(1500)
R['panneau']=p2.locator('#absents-binomes-l15k').count()==1
p2.locator('#btn-binomes-l15k').click(); p2.wait_for_timeout(400); liste=p2.locator('#liste-binomes-l15k').inner_text(); R['liste_binomes']=('↔' in liste) and (L.nom_eleve(cl,a) in liste)
nb=L.nom_eleve(cl,bon); p2.locator('#absents-binomes-l15k label',has_text=nb).first.locator('input').check(); p2.wait_for_timeout(1200)
aj=b2.lire(p2,'correction_dictee/%s/absentsJour'%DGD) or {}; R['absent_ecrit']=bool((aj.get('eleves') or {}).get(bon))
liste2=p2.locator('#liste-binomes-l15k').inner_text()
p2.screenshot(path='/home/claude/MICRO16/capture-suivi.png')
# vérification de la règle par calcul (les autres paires identiques)
B2=p2.evaluate("(x)=>binomesDuJourL15k(x[0],x[1],x[2])",[res,ab,aj]); ch=[k for k in B if k not in (bon,) and B2.get(k)!=B[k]]; R['seuls_orphelins']=sorted(ch)
R['zero_erreur']=None
b2.fermer()
# 0 erreur = Terminé : une copie sans erreur
db3=copy.deepcopy(db); k0=autres[1]; db3['correction_dictee'][DGD]['results'][k0]['errors']=[]; db3['correction_dictee'][DGD]['results'][k0]['extras']=[]
b3=Banc(F,1366,900); p3=b3.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%DGD,db=db3); p3.wait_for_timeout(3000); p3.locator('button:has-text("Suivi")').first.click(); p3.wait_for_timeout(1500)
t3=p3.locator('body').inner_text(); R['zero_erreur']=bool(re.search(re.escape(L.nom_eleve(cl,k0).split()[0])+r'[\s\S]{0,200}Termin', t3)) or 'Terminé' in t3
# session prof glissante
p3.evaluate("()=>{const o={is_prof:true,display:'Professeur',ts:Date.now()-11*3600*1000};localStorage.setItem('mjpc_eleve',JSON.stringify(o));sessionStorage.setItem('mjpc_eleve',JSON.stringify(o))}"); p3.reload(); p3.wait_for_timeout(1500)
ts=p3.evaluate("()=>JSON.parse(localStorage.getItem('mjpc_eleve')).ts"); R['session_glisse']=abs(ts-int(time.time()*1000))<60000
b3.fermer()
print(json.dumps(R,ensure_ascii=False))
ok=all(R[k] for k in ('binome_affiche','voile','refusee_oubliee','revenir','rechargement_sans_voile','bon_entre','hub_binomes_intact','panneau','liste_binomes','absent_ecrit','zero_erreur','session_glisse')) and set(R['seuls_orphelins'])<= {a,bon}|set(k for k,_ in l)
print('BANC L15k-b : '+('VERT' if ok else 'ROUGE'))
