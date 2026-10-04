"""L15c — l'accueil rangé (C1), par le geste : les niveaux, le tri par date de création, « vide pour l'instant », la classe lisible,
la date posée une fois, le taux, le statut (non rendues / rendre ▸ pulsant → l'onglet Copies prêt / rendues le), la coche « publiée »
qui dépublie au hub sur-le-champ, « ＋ Nouvelle dictée », le mode test replié, « Éprouver » disparu. Faux hub du kit, ZZTEST."""
import sys, copy, os, json, re, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
def deplierNiveaux(p):
    p.evaluate("() => { document.querySelectorAll('.niveau-l15c[data-ouvert=\"0\"] h3').forEach(function(h){ h.click() }) }"); p.wait_for_timeout(300)   # [L15c-c] les niveaux sont repliés par défaut
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); src=db['correction_dictee'][D3]
# une classe à clé seule (nom du registre en capitales) et une petite dictée corrigée à 100 % ; une autre déjà rendue
db['classes']['3_zz_test_alpha']={'nom':'3 ZZ TEST ALPHA','niveau':'3e','eleves':['ZZTEST Un','ZZTEST Deux']}
cp=lambda t:{'errors':[{'idx':1,'type':'L','word':'devint','fautif':'devin'}],'extras':[],'note':9.5,'deduction':.5,'counts':{'L':1},'timestamp':t,'amenagee':False}
db['correction_dictee']['dictee_zz_cent']={'config':dict(src['config'],title='ZZTEST cent pour cent',classe='3_zz_test_alpha',niveau='3e',published=True),'results':{'zztest_un':cp(1700000500000),'zztest_deux':cp(1700000400000)}}
db['correction_dictee']['dictee_zz_rendue']={'config':dict(src['config'],title='ZZTEST rendue',classe='3_zz_test_alpha',niveau='3e',published=True,creeLe=1600000000000),'results':{'zztest_un':cp(1),'zztest_deux':cp(2)},'copyPublishedAt':1790949532434}
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1800); deplierNiveaux(p)
R['niveaux']=p.evaluate("()=>[...document.querySelectorAll('#mes-dictees .niveau-l15c')].map(n=>[n.dataset.niveau,[...n.querySelectorAll('.ligne-dictee-l15c')].map(l=>l.dataset.id),!!n.querySelector('.vide-l15c')])")
R['ligne_cent']=p.evaluate("()=>{const l=document.querySelector('.ligne-dictee-l15c[data-id=\"dictee_zz_cent\"]');return l?l.innerText.replace(/\\s+/g,' '):null}")
R['statuts']=p.evaluate("()=>Object.fromEntries([...document.querySelectorAll('.ligne-dictee-l15c')].map(l=>[l.dataset.id,(l.querySelector('.statut-l15c')||{}).className+' | '+((l.querySelector('.statut-l15c')||{}).innerText||'')]))")
R['taux_D3']=p.evaluate("(id)=>{const l=document.querySelector('.ligne-dictee-l15c[data-id=\"'+id+'\"] .taux-l15c');return l?l.innerText.trim():null}",D3)
R['cree_pose']=(b.lire(p,'correction_dictee/dictee_zz_cent/config/creeLe'),b.lire(p,'correction_dictee/dictee_zz_rendue/config/creeLe'))
R['eprouver']=p.evaluate("()=>document.body.innerText.includes('Éprouver les mécanismes livrés')")
R['mode_test_replie']=(p.locator('#mode-test-replie').count(),p.evaluate("()=>document.body.innerText.includes('Un clic crée une classe fictive')"))
R['nouvelle_repliee']=p.locator('#carte-nouvelle-dictee').count()
if CAP: p.screenshot(path=CAP+'/L15c-accueil.png',full_page=False)
# la coche « publiée » : dépublie au hub, sur-le-champ
p.locator('.ligne-dictee-l15c[data-id="%s"] .coche-publiee-l15c input'%D3).click(); p.wait_for_timeout(800)
R['depublie']=(b.lire(p,'correction_dictee/%s/config/published'%D3),p.locator('.ligne-dictee-l15c[data-id="%s"] .coche-publiee-l15c'%D3).inner_text().strip())
# « ＋ Nouvelle dictée », le mode test déplié
p.locator('#btn-nouvelle-dictee').click(); p.wait_for_timeout(400); R['nouvelle_ouverte']=p.locator('#carte-nouvelle-dictee').count()
p.locator('#mode-test-replie span:has-text("Ouvrir")').click(); p.wait_for_timeout(600); R['mode_test_ouvert']=p.evaluate("()=>document.body.innerText.includes('Un clic crée une classe fictive')")
# « rendre les copies ▸ » → l'onglet Copies, son bouton prêt
p.locator('.ligne-dictee-l15c[data-id="dictee_zz_cent"] .statut-l15c').click(); p.wait_for_timeout(3000)
R['copies_pret']=p.evaluate("()=>{const b=document.getElementById('btn-rendre-copies');return b?[b.className.includes('pulse-l15c'),document.activeElement===b,b.innerText.trim()]:null}")
R['onglet']=p.evaluate("()=>[...document.querySelectorAll('button.tab')].filter(b=>b.className.includes('active')).map(b=>b.textContent.trim())")
if CAP: p.screenshot(path=CAP+'/L15c-copies.png')
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
niv=[n[0] for n in R['niveaux']]; d3=[n for n in R['niveaux'] if n[0]=='3e'][0][1]
conds={'niveaux_dans_l_ordre':niv[:4]==['3e','4e','5e','6e'],
 'vide_pour_l_instant':all(n[2] for n in R['niveaux'] if n[0] in ('5e','6e') and not n[1]),
 'tri_par_date':d3.index('dictee_zz_rendue')<d3.index('dictee_zz_cent'),
 'classe_lisible_et_mots':bool(R['ligne_cent']) and '3e Zz Test Alpha' in R['ligne_cent'] and 'créée le' in R['ligne_cent'] and '3_zz_test_alpha' not in R['ligne_cent'],
 'date_posee_une_fois':R['cree_pose'][0]==1700000400000 and R['cree_pose'][1]==1600000000000,
 'taux':R['taux_D3']=='93 %',   # 28 copies corrigées sur 30 attendues (l'absent ne compte pas)
 'statuts':'non-rendues' in R['statuts'][D3] and 'pulse-l15c' in R['statuts']['dictee_zz_cent'] and 'rendre les copies' in R['statuts']['dictee_zz_cent'] and 'copies rendues le' in R['statuts']['dictee_zz_rendue'],
 'coche_depublie':R['depublie']==[False,'non publiée'],
 'nouvelle_dictee':R['nouvelle_repliee']==0 and R['nouvelle_ouverte']==1,
 'mode_test_replie':R['mode_test_replie']==[1,False] and R['mode_test_ouvert'] is True and R['eprouver'] is False,
 'rendre_ouvre_copies':bool(R['copies_pret']) and R['copies_pret'][0] is True and any('Copies' in x for x in R['onglet']),
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15c PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
