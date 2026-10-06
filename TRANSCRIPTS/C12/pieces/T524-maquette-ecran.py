import sys, copy, json, time, os; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15kc.html'); W=int(os.environ.get('W','1280')); H_=int(os.environ.get('H','800')); OUT=os.environ.get('OUT','/home/claude/MAQ9/actuel'); CSS=os.environ.get('CSS','')
DGD='dictee_preparee_5e_grandes_decouvertes-5e_herge'
db=copy.deepcopy(L.BASE); D=db['correction_dictee'][DGD]; D['copyPublishedAt']=1790000000000; now=int(time.time()*1000)
D['heure']={'debut':now-5*60000,'fin':now+40*60000,'classe':D['config']['classe']}
cl=L.classe_registre(D['config']['classe']); res=D['results']; ab=D.get('absents') or {}
def nE(k): v=res[k]; return len([e for e in (v.get('errors') or []) if e and e.get('type')!='A'])+len(v.get('extras') or [])
l=sorted([(k,nE(k)) for k,v in res.items() if isinstance(v,dict) and not ab.get(k)], key=lambda x:(x[1],x[0])); a=l[-1][0]; b2=l[0][0]
for k in (a,b2): D['autocorrection'].pop(k,None)
for kk in list(db.keys()):
    if kk.startswith('autocorr'): pass
b=Banc(F,W,H_); p=b.ouvrir('?mode=eleve',db=db); p.wait_for_timeout(1000)
p.get_by_role('button',name='👥 2 élèves').click(); p.wait_for_timeout(700)
for n,k in ((1,a),(2,b2)): p.evaluate("(x)=>localStorage.setItem('cd_moitie_'+x[0],JSON.stringify({identite:{nom:x[1],cle:x[2],classe:x[3],via:'code'},t:Date.now(),arrivee:Date.now()+x[0]}))",[n,L.nom_eleve(cl,k),k,D['config']['classe']])
p.reload(); p.wait_for_timeout(2000)
if CSS: p.add_style_tag(content=open(CSS).read()); p.wait_for_timeout(300)
for n in (1,2):
    z=p.locator('.moitie').nth(n-1); li=z.locator('.mesdictees-ligne',has_text='grandes')
    print('lignes :', z.locator('.mesdictees-ligne').all_inner_texts()[:4]);
    if li.count(): li.first.click(); p.wait_for_timeout(1500)
for n in (1,2):
    z=p.locator('.moitie').nth(n-1)
    z.evaluate("(m)=>{const c=m.querySelector('input[type=checkbox]');if(c&&!c.checked)c.click()}"); p.wait_for_timeout(300)
    z.evaluate("(m)=>{const b=[...m.querySelectorAll('button')].find(x=>/Commencer|Je commence|J’ai lu|C’est parti/.test(x.textContent));if(b)b.click()}"); p.wait_for_timeout(1200)
p.screenshot(path=OUT+'-copie.png')

# ouvrir le premier mot masqué « ••• » de chaque moitié
for n in (1,2):
    z=p.locator('.moitie').nth(n-1)
    info=z.evaluate("(m)=>{const all=[...m.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.top>400&&r.width>30&&r.width<200&&getComputedStyle(e).cursor==='pointer'&&e.children.length<=2});return all.slice(0,3).map(e=>e.tagName+'.'+e.className+' '+(e.title||''))}"); print('cliquables :',info)
    z.evaluate("(m)=>{const all=[...m.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.top>400&&r.width>30&&r.width<200&&getComputedStyle(e).cursor==='pointer'&&e.children.length<=2});if(all[0])all[0].click()}"); p.wait_for_timeout(900)
V=os.environ.get('V','')
if V in ('1','3'):
    p.add_style_tag(content=open('/home/claude/MAQ9/v%s.css'%V).read()); p.wait_for_timeout(300)
    p.evaluate('''()=>{document.querySelectorAll('.moitie .score-bar').forEach(sb=>{function cache(e){[...e.children].forEach(c=>{if(/Grammaire/.test(c.textContent)&&/corrigé/.test(c.textContent))cache(c);else if(/Grammaire/.test(c.textContent))c.style.display='none'})}cache(sb)})}''')
if V=='3':
    p.evaluate('''()=>{document.querySelectorAll('.moitie').forEach(m=>{const kb=[...m.querySelectorAll('div[style*="position: fixed"]')].pop();if(!kb)return;const rows=[...kb.querySelectorAll('div')].filter(d=>d.children.length>=8&&[...d.children].every(c=>c.tagName==='BUTTON'));const acc=rows.find(r=>/é/.test(r.textContent));if(acc)acc.style.display='none';const r3=rows.find(r=>/⇧/.test(r.textContent));if(r3){const b=document.createElement('button');b.textContent='é à ç';b.style.cssText=r3.children[0].style.cssText+';background:#eef2ff;min-width:64px;height:34px;margin:2px';r3.insertBefore(b,r3.children[1]);}const pon=rows.concat([...kb.querySelectorAll('div')]).find(d=>/espace/.test(d.textContent)&&d.children.length<=6);});}''')
    p.wait_for_timeout(300)
if V=='2':
    p.evaluate('''()=>{document.querySelectorAll('.moitie').forEach(m=>{const sb=m.querySelector('.score-bar');if(sb)sb.style.display='none';
      [...m.querySelectorAll('.card')].forEach(c=>{if(/Regagner des points/.test(c.textContent)&&!/Clique sur un mot/.test(c.textContent))c.style.display='none'});
      const kb=[...m.querySelectorAll('div[style*="position: fixed"]')].pop();if(!kb)return;
      const open=m.querySelector('.word-btn[style*="box-shadow"], .word-btn.ouvert, .word-btn.actif')||[...m.querySelectorAll('.word-btn')].find(w=>getComputedStyle(w).boxShadow!=='none'&&/•/.test(w.textContent));
      const ws=[...m.querySelectorAll('.word-btn')];const i=open?ws.indexOf(open):-1;const ctx=i>=0?ws.slice(Math.max(0,i-5),i).map(w=>/err-/.test(w.className)?'…':w.textContent.trim()).join(' ')+'  [ ? ]  '+ws.slice(i+1,i+6).map(w=>/err-/.test(w.className)?'…':w.textContent.trim()).join(' '):'';
      const d=document.createElement('div');d.textContent='… '+ctx+' …';d.style.cssText='font:1.15rem Georgia,serif;padding:6px 12px 2px;color:#1e293b;border-bottom:1px solid #e2e8f0;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';kb.insertBefore(d,kb.firstChild);
      if(open)open.scrollIntoView({block:'end'});});}''')
    p.wait_for_timeout(400)
p.screenshot(path=OUT+'-mot-ouvert.png')
print("structure :", p.evaluate('''()=>{const m=document.querySelectorAll('.moitie')[0];function desc(e){const cs=getComputedStyle(e);return e.tagName+'.'+(typeof e.className==='string'?e.className:'')+'#'+e.id+' pos='+cs.position+' top='+cs.top+' bottom='+cs.bottom+' h='+Math.round(e.getBoundingClientRect().height)}
const ch=[...m.querySelectorAll('*')].filter(e=>getComputedStyle(e).position==='sticky').map(e=>desc(e)+' txt='+e.textContent.slice(0,40));
const kb=[...m.querySelectorAll('button')].find(b=>b.textContent.trim()==='espace');let k=kb,ck=[];while(k&&k!==m){const cs=getComputedStyle(k);if(cs.position==='sticky'||cs.position==='fixed'||cs.position==='absolute')ck.push(desc(k));k=k.parentElement}
return {entete:ch,clavier:ck}}'''))
print("défil :", p.evaluate("()=>[...document.querySelectorAll('.moitie')].map(m=>{const d=m.querySelector('.moitie-defil')||m;return {h:Math.round(m.getBoundingClientRect().height),scroll:d.scrollHeight,top:d.scrollTop}})"))
for n in (1,2):
    z=p.locator('.moitie').nth(n-1)
    m=z.locator('.word-btn').filter(has_text='?').first
    cands=z.evaluate("(m)=>{const x=[...m.querySelectorAll('span,button')].filter(e=>/masq|cach|hidden|blur|mask/i.test(e.className||'')).map(e=>e.className);return [...new Set(x)].slice(0,5)}")
    print("moitié",n,"classes masquées :",cands)
b.fermer()
