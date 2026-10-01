# BANC UNIQUE ELEVE-1 ⓪ — rejoue tous les bancs du lot d'une seule commande ; sort en échec si UN SEUL échoue.
import sys,json,subprocess,urllib.request
from banc_0 import jouer as banc0
from banc_vue_eleve import jouer as vue
from PIL import Image, ImageChops
HUB='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app'
def vrai_hub():  # LECTURE seule, des comptes (jamais un nom)
    o={}
    for n in ['classes','codes','eleves','eleves_index','corbeille','manifestes']:
        d=json.load(urllib.request.urlopen(f'{HUB}/{n}.json?shallow=true')) or {}
        o[n]=len(d)
    return o
BASE,LIV,D=sys.argv[1],sys.argv[2],sys.argv[3]
avant=vrai_hub()
rb=banc0(BASE,'base',D); rl=banc0(LIV,'livree',D)
vb=vue(BASE,'base',D); vl=vue(LIV,'livree',D)
apres=vrai_hub()
def amas_ecarts(p1,p2):
    d=ImageChops.difference(Image.open(p1).convert('RGB'),Image.open(p2).convert('RGB')).convert('L').point(lambda p:255 if p>16 else 0)
    W,H=d.size; px=d.load(); am=[]
    for y in range(H):
        for x in range(W):
            if not px[x,y]: continue
            for c in am:
                if c[0]-40<=x<=c[2]+40 and c[1]-40<=y<=c[3]+40: c[0]=min(c[0],x);c[1]=min(c[1],y);c[2]=max(c[2],x);c[3]=max(c[3],y);break
            else: am.append([x,y,x,y])
    return am
diff=amas_ecarts(f'{D}/base-vue-eleve.png',f'{D}/livree-vue-eleve.png')
PASTILLE=(1400,860,1500,900)   # la pastille de version, en bas à droite (regardée à l'agrandi)
def ecart_admis(c): return (c[0]>=PASTILLE[0] and c[1]>=PASTILLE[1]) or ((c[2]-c[0]+1)*(c[3]-c[1]+1)<=25)
chk=[
 ('base : le banc VOIT la fuite (écritures au hub en mode test > 0)', len(rb.get('ecritures_hub_en_mode_test',[]))>0, rb.get('ecritures_hub_en_mode_test')),
 ('livrée : parcours complet sans échec', 'ECHEC' not in rl, rl.get('ECHEC')),
 ('livrée : mode test actif', rl.get('mode_test') is True, rl.get('mode_test')),
 ('livrée : 0 écriture au hub en mode test (retrait + purge)', rl.get('ecritures_hub_en_mode_test')==[], rl.get('ecritures_hub_en_mode_test')),
 ('livrée : 0 écriture hors hub en mode test', rl.get('externes_non_GET')==[], rl.get('externes_non_GET')),
 ('livrée : la corbeille du retrait est au magasin', any('retrait-eleve' in k for k in rl.get('magasin',{})), [k for k in rl.get('magasin',{}) if 'corbeille' in k]),
 ('livrée : le contrat du site purge eleves', 'eleves' in (rl.get('contrat_purger') or []), rl.get('contrat_purger')),
 ('livrée : /eleves purgé au magasin', rl.get('magasin',{}).get('/eleves')=='∅ (effacé)', rl.get('magasin',{}).get('/eleves')),
 ('livrée : purge terminée, 0 échec', any('0 échec' in t for t in rl.get('fin_purge',[])), rl.get('fin_purge')),
 ('livrée : 0 erreur JS', rl.get('erreurs_js')==[], rl.get('erreurs_js')),
 ('vue élève : 0 erreur JS (base, livrée)', vb['erreurs_js']==[] and vl['erreurs_js']==[], (vb['erreurs_js'],vl['erreurs_js'])),
 ('vue élève : aucun mot interdit', not any(vl['mots_interdits'].values()), vl['mots_interdits']),
 ('vue élève : mêmes écritures base / livrée', vb['ecritures_hub']==vl['ecritures_hub'] and vb['externes_non_GET']==vl['externes_non_GET'], (vl['ecritures_hub'],vl['externes_non_GET'])),
 ('vue élève : seuls écarts = la pastille de version et des points ≤ 25 px² (étoiles animées)', all(ecart_admis(c) for c in diff), diff),
 ('vrai hub inchangé (comptes avant = après)', avant==apres, (avant,apres)),
]
ok=True
for nom,res,val in chk:
    print(('OK  ' if res else 'ÉCHEC ')+nom+' — '+json.dumps(val,ensure_ascii=False)[:260]); ok=ok and res
json.dump({'base':rb,'livree':rl,'vue_base':vb,'vue_livree':vl,'hub_avant':avant,'hub_apres':apres,'diff_vue':diff},open(f'{D}/resultats.json','w'),ensure_ascii=False,indent=1)
print('BANC UNIQUE :', 'VERT (0 échec)' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
