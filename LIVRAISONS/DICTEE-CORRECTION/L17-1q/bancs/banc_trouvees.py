# 687 (a) : « trouvées » ne compte jamais un mot « Attention graphie » (A).
# Cas réel : Emma Danard (Franklin) — 13 erreurs dont 2 A ; le hub portait solved=12 pour total=11 (le « là » A trouvé était compté).
# Cas dérivé du réel : la même copie, un mot ordinaire NON trouvé (« venu ») → 10 vraies trouvées sur 11 ; l'ancien compte donne 11 → « Terminée » à tort.
import sys, copy, json, os, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_fusion.html')
T=json.load(open('/tmp/franklin2.json')); DID=T['id']
def prep(rate):
    db=copy.deepcopy(L.BASE); db['classes']['3_franklin_aretha']=T['classe']; D=copy.deepcopy(T['dictee']); db['correction_dictee']={DID:D}
    db['correction_dictee_textes']=json.load(open('/tmp/textes.json')); db['correction_dictee_erreurs']=json.load(open('/tmp/formes.json'))
    ac=D['autocorrection']['danard_emma']   # solved=12 au hub (réel)
    if rate:
        r=list(ac['results']); r[1]=None; ac['results']=r; ac.pop('status',None)
        h=ac.get('history') or {}
        if isinstance(h,list): h={str(i):v for i,v in enumerate(h) if v is not None}
        h['1']=[{'typed':'venue','ok':False}]; ac['history']=h
        at=ac.get('attempts'); at=list(at) if isinstance(at,list) else dict(at or {})
        if isinstance(at,list): at[1]=1
        else: at['1']=1
        ac['attempts']=at; ac['solved']=11   # « venu » : un essai, raté, pas retrouvé ; l'ancien compte (avec le « là » A) écrirait 11
    return db
R={}
for rate in (False,True):
    tag='derive' if rate else 'reel'; db=prep(rate)
    b=Banc(F,1500,1000); p=b.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%DID,db=copy.deepcopy(db)); p.wait_for_timeout(3500)
    p.locator('button:has-text("Suivi")').first.click(); p.wait_for_timeout(2000)
    t=p.locator('body').inner_text(); i=t.find('D. Emma'); R[tag+'_suivi']=re.findall(r'(\d+)/(\d+)',t[i:i+60])[1:2]; b.fermer()
    b=Banc(F,1280,900); p=b.ouvrir('?mode=eleve',db=copy.deepcopy(db),session={'display':'DANARD Emma','classe':'3_franklin_aretha'}); p.wait_for_timeout(1500)
    if p.get_by_role('button',name='👤 1 élève').count(): p.get_by_role('button',name='👤 1 élève').click(); p.wait_for_timeout(800)
    R[tag+'_mes_dictees']=[l for l in p.locator('.mesdictees-ligne',has_text='Fritz').first.inner_text().split('\n') if l in ('Terminée','À faire','En cours','Commencée')][:1]
    p.locator('.mesdictees-ligne',has_text='Fritz').first.click(); p.wait_for_timeout(2500)
    R[tag+'_ecrit']=b.lire(p,'correction_dictee/%s/autocorrection/danard_emma/solved'%DID); b.fermer()
print(json.dumps(R,ensure_ascii=False))
ok=(R['reel_suivi']==[('11','11')] and R['reel_ecrit'] in (12,11) and R['reel_mes_dictees']==['Terminée'] and R['derive_suivi']==[('10','11')] and R['derive_mes_dictees']!=['Terminée'] and R['derive_ecrit'] in (11,10))
print('BANC TROUVÉES : '+('VERT' if ok else 'ROUGE'))
