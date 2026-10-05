"""La grille de la dictée : absent sur une copie existante, Recalculer, M→P, recherche par initiales, PAP."""
import sys, copy, os, math; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_0aeb.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
db=copy.deepcopy(L.BASE); R0=copy.deepcopy(db['correction_dictee'][D3]['results'])
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d: dlg.append(d.message[:120]))
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
clic=lambda t: p.evaluate("(t)=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes(t));if(!b)return false;b.click();return true}",t)
# 1. absent sur un élève qui a une copie
p.evaluate("(n)=>{const x=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim()===n);const el=x[0].closest('button,[role=button],div[style*=cursor]')||x[0];el.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,clientX:300,clientY:300}))}",'C. Pzzet'); p.wait_for_timeout(400)
print('1. menu du clic droit :',p.evaluate("()=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/absent|aménag|PAP/i.test(e.textContent)).map(e=>e.textContent.slice(0,50))")[:6])
p.evaluate("()=>{const b=[...document.querySelectorAll('*')].find(x=>x.children.length===0&&x.textContent.includes('Marquer absent'));b&&b.click()}"); p.wait_for_timeout(800)
r=b.lire(p,'correction_dictee/%s/results/czzoros_pzzet'%D3); a=b.lire(p,'correction_dictee/%s/absents/czzoros_pzzet'%D3)
print('   Pierre marqué absent : absent =',a,'| sa copie existe encore :',bool(r),'| fenêtre :',dlg[-1:] )
# 2. Recalculer : les notes recalculées doivent rester celles du barème
dlg.clear(); clic('🔄 Recalculer'); p.wait_for_timeout(1500)
R1=b.lire(p,'correction_dictee/%s/results'%D3) or {}
diff=[(k,R0[k].get('note'),R1.get(k,{}).get('note')) for k in R0 if R1.get(k) and abs((R0[k].get('note') or 0)-(R1[k].get('note') or 0))>1e-9]
print('2. Recalculer : fenêtres',dlg[:1],'| notes changées :',len(diff),diff[:5])
# 3. M→P
dlg.clear(); clic('🔄 M→P'); p.wait_for_timeout(1500); R2=b.lire(p,'correction_dictee/%s/results'%D3) or {}
d2=[k for k in R1 if R1[k]!=R2.get(k)]; print('3. M→P : fenêtres',dlg[:1],'| copies modifiées :',len(d2))
# 4. recherche par initiales
p.evaluate("()=>{const i=[...document.querySelectorAll('input')].find(i=>/initiales|DA/i.test(i.placeholder||''));if(i){const d=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;d.call(i,'CL');i.dispatchEvent(new Event('input',{bubbles:true}))}}"); p.wait_for_timeout(500)
print('4. recherche « CL » :',p.evaluate("()=>{const m=document.body.innerText.match(/(\\d+) élèves?/);return m?m[0]:'?'}"),'|',[x for x in p.inner_text('body').split('\n') if x.startswith('C. L') or x.startswith('L. C')][:4])
print('erreurs de page :',b.erreurs[:2]); b.fermer()
