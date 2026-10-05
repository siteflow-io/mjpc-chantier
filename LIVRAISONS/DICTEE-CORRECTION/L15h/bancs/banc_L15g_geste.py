"""L15g — les profils de barème, la base, le branchement MJPC préparé. Par le geste, faux hub du kit, ZZTEST."""
import sys, copy, os, json, re, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); CAP=os.environ.get('CAPTURES','')
DP='dictee_preparee_5e_grandes_decouvertes-5e_herge'; DU='dictee_5e_chapitre_utopie-5e_herge'; DB3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE)
txt=db['correction_dictee'][DP]['config']['text']
# les mots du texte, comme l'app (tokenize) : on repère leur / leurs par la page plus bas ; la copie semée : deux G, sur « leur » et « leurs »
cl=db['correction_dictee'][DP]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Famille','ZZTEST Amen']
R={}
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1500)
toks=p.evaluate("(t)=>tokenize(t)",txt); iL=[i for i,w in enumerate(toks) if w.lower()=='leur'][0]; iLs=[i for i,w in enumerate(toks) if w.lower()=='leurs'][0]
p.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/results/zztest_famille'%DP,{'errors':[{'idx':iL,'type':'G','word':toks[iL],'fautif':'leurs'},{'idx':iLs,'type':'G','word':toks[iLs],'fautif':'leur'}],'extras':[],'note':8,'deduction':2,'counts':{'G':2},'timestamp':NOW-3600000,'amenagee':False}])
# une copie aménagée sur la 5e utopie (version aménagée sur 10)
p.evaluate("(a)=>db.ref(a[0]).update(a[1])",['correction_dictee/%s/dictee/amenagee'%DU,{'base':10}])
p.evaluate("(a)=>db.ref(a[0]).set(true)",['correction_dictee/%s/amenages/zztest_amen'%DU])   # l'élève est marqué aménagé (sinon L15-0b le démarque à l'ouverture)
p.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/results/zztest_amen'%DU,{'errors':[],'extras':[],'note':10,'deduction':0,'counts':{},'timestamp':NOW-3600000,'amenagee':True,'mode':'A','base':10}])
p.wait_for_timeout(400)
avant_autres={k:json.dumps(b.lire(p,'correction_dictee/%s/results'%k),sort_keys=True) for k in (DB3,)}
def ouvrir(titre):
    p.locator('button:has-text("← Retour")').first.click() if p.locator('button:has-text("← Retour")').count() else None; p.wait_for_timeout(900)
    p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
    p.evaluate('''(t)=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes(t)&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}''',titre); p.wait_for_timeout(2500)
    p.locator('button.tab:has-text("Préparation")').first.click(); p.wait_for_timeout(800)
note=lambda d,k: (b.lire(p,'correction_dictee/%s/results/%s'%(d,k)) or {})
corb=lambda motif: sum(1 for j,v in (b.lire(p,'corbeille') or {}).items() for k in (v or {}) if k.startswith(motif))
ouvrir('grandes découvertes')
R['accueil_nomme']=None
# Brevet : voir, sans pouvoir modifier
p.locator('#profil-dictee-l15g').select_option('brevet'); p.wait_for_timeout(300); p.locator('#modifier-profil-l15g').click(); p.wait_for_timeout(500)
R['brevet_verrouille']=(p.locator('#editeur-profil-l15g input:not([disabled])').count(),p.locator('#enregistrer-profil-l15g').count(),p.locator('#editeur-profil-l15g h3').inner_text())
p.keyboard.press('Escape'); p.locator('#editeur-profil-l15g button:has-text("Fermer")').click(); p.wait_for_timeout(300)
p.locator('#profil-dictee-l15g').select_option('preparee'); p.wait_for_timeout(300)
# dupliquer Préparée → « Ciblée » ; G à 0,5 ; répétition par famille (leur/leurs)
p.evaluate("()=>{window.prompt=()=> 'Ciblée'}"); p.locator('#dupliquer-profil-l15g').click(); p.wait_for_timeout(900)
R['ciblee_creee']=p.locator('#nom-profil-l15g').input_value()
p.locator('#editeur-profil-l15g label:has-text("G grammaire") input').fill('0.5'); p.locator('#repetition-l15g').select_option('famille'); p.wait_for_timeout(200)
p.locator('#familles-l15g').fill('leur/leurs'); p.locator('#enregistrer-profil-l15g').click(); p.wait_for_timeout(1500)
if CAP: p.screenshot(path=CAP+'/L15g-editeur.png')
p.locator('#editeur-profil-l15g button:has-text("Fermer")').click(); p.wait_for_timeout(300)
c0=corb('recalcul-preparation')
p.locator('button:has-text("Enregistrer")').first.click(); p.wait_for_timeout(3500)
R['famille']=(note(DP,'zztest_famille').get('note'),note(DP,'zztest_famille').get('deduction'))
R['corbeille_preparation']=corb('recalcul-preparation')-c0
R['toast']=p.evaluate("()=>{const e=document.getElementById('toast-recalcul-l15g');return e?e.innerText:null}")
# « par mot exact » : leur et leurs, deux mots → deux fautes
pid=(b.lire(p,'correction_dictee/%s/config'%DP) or {}).get('bareme')
p.locator('button.tab:has-text("Préparation")').first.click(); p.wait_for_timeout(500)
p.locator('#modifier-profil-l15g').click(); p.wait_for_timeout(500); p.locator('#repetition-l15g').select_option('mot'); p.locator('#enregistrer-profil-l15g').click(); p.wait_for_timeout(2500)
R['mot_exact']=note(DP,'zztest_famille').get('deduction'); p.locator('#editeur-profil-l15g button:has-text("Fermer")').click(); p.wait_for_timeout(300)
R['autres_identiques']=all(json.dumps(b.lire(p,'correction_dictee/%s/results'%k),sort_keys=True)==v for k,v in avant_autres.items())
# la base ordinaire 10 → 20
p.locator('.config-field:has(label:text-is("Note sur")) input').first.fill('20'); p.locator('button:has-text("Enregistrer")').first.click(); p.wait_for_timeout(3500)
R['base_ordinaire']=(note(DP,'zztest_famille').get('note'),(b.lire(p,'correction_dictee/%s/config'%DP) or {}).get('base'))
# la base aménagée 10 → 20 (la 5e utopie)
ouvrir('chapitre utopie')
c1=corb('recalcul-base-amenagee')
p.evaluate("()=>{const i=[...document.querySelectorAll('input[type=number]')].find(x=>x.value==='10'&&x.closest('div')&&x.closest('div').innerText.includes('Note sur'));if(i){const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,'20');i.dispatchEvent(new Event('input',{bubbles:true}));}}"); p.wait_for_timeout(3000)
R['base_amenagee']=(note(DU,'zztest_amen').get('base'),note(DU,'zztest_amen').get('note'),corb('recalcul-base-amenagee')-c1)
# le Bilan dit ce qu'il compte
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(500); p.locator('button.tab:has-text("Bilan")').first.click(); p.wait_for_timeout(1200)
R['bilan']=(p.evaluate("()=>{const e=document.querySelector('.moy-ordinaires');return e?e.innerText:null}"),p.evaluate("()=>[...document.querySelectorAll('.moy-amen')].map(e=>e.innerText)"))
if CAP: p.screenshot(path=CAP+'/L15g-bilan.png')
# l'accueil nomme le profil ; l'heure : source et séance écrites au lancement
p.locator('button:has-text("← Retour")').first.click(); p.wait_for_timeout(1200)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
R['accueil_nomme']=p.evaluate("(id)=>{const l=document.querySelector('.ligne-dictee-l15c[data-id=\"'+id+'\"] .sous-ligne-l15c');return l?l.innerText:null}",DP)
if CAP: p.screenshot(path=CAP+'/L15g-accueil.png')
R['erreurs']=b.erreurs[:3]; b.fermer()
src=open(F,encoding='utf-8').read()
lectures=[m.start() for m in re.finditer(r'/heure"\)',src)]
non_passees=[src[max(0,i-20):i+160].replace('\n',' ') for i in lectures if 'heureDeLaDictee' not in src[i:i+450] and '.set(' not in src[i:i+20] and '.update(' not in src[i:i+20] and 'heure/fin' not in src[i-12:i+8]]
R['heure_un_seul_chemin']=(len(lectures),non_passees,src.count('.heure||null'),src.count('[BRANCHEMENT MJPC — déroulé]'),'source:"dictee",seanceId:""' in src)
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'brevet_verrouille':R['brevet_verrouille'][0]==0 and R['brevet_verrouille'][1]==0 and 'verrouill' in R['brevet_verrouille'][2],
 'dupliquer_ciblee':R['ciblee_creee']=='Ciblée',
 'famille_leur_leurs':R['famille'][1]==0.5,
 'mot_exact':R['mot_exact']==1,
 'recalcul_compte_corbeille':R['corbeille_preparation']>=1 and bool(R['toast']) and 'recalculée' in R['toast'],
 'autres_dictees_identiques':R['autres_identiques'] is True,
 'base_ordinaire_20':R['base_ordinaire'][1]==20 and R['base_ordinaire'][0]==19.0,
 'base_amenagee_20':R['base_amenagee'][0]==20 and R['base_amenagee'][2]>=1,
 'bilan_etiquettes':bool(R['bilan'][0]) and R['bilan'][0].startswith('Moyenne — ') and 'ordinaire' in R['bilan'][0] and any(', à part, sur leur base : ' in x for x in R['bilan'][1]),
 'accueil_nomme_profil':bool(R['accueil_nomme']) and 'barème Ciblée' in R['accueil_nomme'],
 'heure_un_seul_chemin':R['heure_un_seul_chemin'][1]==[] and R['heure_un_seul_chemin'][2]==0 and R['heure_un_seul_chemin'][3]>=2 and R['heure_un_seul_chemin'][4] is True,
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15g PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
