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
V=os.environ.get('V','')
if V=='B':
    p.evaluate('''()=>{const E=[["Je retrouve moi-même les erreurs de ma dictée, en tapant le bon mot.",1],["Ma note d’autocorrection est une note à part : elle ne s’ajoute pas à ma note de dictée.",1],["Un essai au hasard me coûte des points.",1],["À la fin, si j’ai perdu des points, je pourrai en regagner en répondant à des questions.",0],["Si mon voisin m’aide, c’est moi qui tape.",0],["Je ne regarde pas la copie papier de mon voisin : si je le fais, j’ai zéro à l’autocorrection.",0]];
      const EA=[["Je retourne ma copie papier à chaque fois que je la lis, et je ne la montre jamais à mon voisin.",0]];
      document.querySelectorAll('.moitie').forEach((m,mi)=>{const card=[...m.querySelectorAll('.card')].find(c=>/Avant de commencer/.test(c.textContent));if(!card)return;const L=mi===0?E:E.concat(EA);
        const titre=card.firstChild.outerHTML;let h=titre+'<div style="font-size:.85rem;color:#64748b;margin:2px 0 10px">Coche chaque phrase après l’avoir lue. La suivante apparaît 5 secondes après.</div>';
        L.forEach((e,i)=>{const fait=e[1]===1,courant=!fait&&(i===0||L[i-1][1]===1);if(!fait&&!courant)return;
          h+='<label style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;margin:6px 0;border-radius:10px;border:2px solid '+(fait?'#86efac':'#2563eb')+';background:'+(fait?'#f0fdf4':'#fff')+';font-size:1rem;line-height:1.45"><input type="checkbox" '+(fait?'checked':'')+' style="width:24px;height:24px;flex:none;margin-top:1px"><span>'+e[0]+'</span></label>'});
        const reste=L.filter(e=>e[1]!==1).length-1;h+='<div style="font-size:.85rem;color:#64748b;margin:8px 2px">'+(reste>0?'Encore '+reste+' phrase'+(reste>1?'s':'')+' après celle-ci.':'C’est la dernière.')+'</div>';
        h+='<button class="btn btn-primary" disabled style="width:auto;opacity:.45">Commencer mon autocorrection</button>';card.innerHTML=h;});
      const m2=document.querySelectorAll('.moitie')[1];if(m2){const lab=[...m2.querySelectorAll('label')];const l3=lab[lab.length-1];}}''')
    p.wait_for_timeout(300); p.screenshot(path=OUT+'-engagements.png'); b.fermer(); sys.exit(0)
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
if V in ('A','C'):
    p.evaluate('''()=>{const opts=[["#a16207","#fef3c7","or"],["#334155","#e2e8f0","ardoise"]];
      document.querySelectorAll('.moitie').forEach((m,i)=>{const o=opts[i]||opts[0];const sb=m.querySelector('.score-bar');if(!sb)return;
        const nom=(sb.textContent.match(/[A-ZÉÈ][A-ZÉÈ\-]+ [A-Z][a-zé]+/)||[''])[0];const pr=(sb.textContent.match(/\d+\/\d+ corrigé · \d+ essai[s]? raté[s]?/)||[''])[0];
        function chip(fond,bord,txt,extra){return '<span style="display:inline-flex;align-items:center;gap:4px;margin:0 8px 0 0;white-space:nowrap"><span style="display:inline-block;width:22px;height:13px;border-radius:4px;background:'+fond+';border:2px solid '+bord+';'+(extra||'')+'"></span>'+txt+'</span>'}
        sb.innerHTML='<div style="display:flex;align-items:center;gap:10px"><b style="font-size:1.35rem;color:#166534">5</b><div style="flex:1;min-width:0"><b style="font-size:.95rem">'+nom+'</b> <span style="font-size:.82rem;color:#64748b">· '+pr+'</span><div style="height:4px;background:#e5e7eb;border-radius:2px;margin-top:3px"></div></div><button class="btn-sm btn-ghost" style="width:auto;padding:2px 10px">←</button><button class="btn-sm btn-ghost" style="width:auto;padding:2px 8px">🔄</button></div>'
          +'<div style="display:flex;flex-wrap:wrap;row-gap:3px;font-size:.74rem;margin-top:5px;color:#334155">'
          +chip('#fde8e8','#dc2626','Grammaire')+chip('#fdf3e1','#a16207','Mot manquant')+chip('#f3e8ff','#9333ea','Illisible')+chip('#e0ecff','#2563eb','Lexique')
          +chip(o[1],o[0],'<b>Accent, majuscule</b>','box-shadow:0 0 0 2px '+o[0]+' inset')+chip('#fce7f3','#db2777','Ponctuation')+chip('#ccfbf1','#0d9488','Élision')
          +'<span style="margin-right:8px;white-space:nowrap"><s>mot</s> Mot en trop</span><span style="white-space:nowrap"><span style="border-bottom:3px solid #facc15">mot</span>⚠ Attention graphie</span></div>';
        sb.style.padding='6px 12px';});}''')
    p.wait_for_timeout(300)
if V=='C':
    p.evaluate('''()=>{const m=document.querySelectorAll('.moitie')[0];const kb=[...m.querySelectorAll('div[style*="position: fixed"]')].pop();if(!kb)return;const d=document.createElement('div');d.innerHTML='<div style="display:flex;gap:10px;align-items:flex-start;background:#fffbeb;border:2px solid #f59e0b;border-radius:10px;padding:8px 12px;margin:6px 10px 2px;font-size:1rem;line-height:1.4"><span style="font-size:1.3rem">💡</span><span><b>Pose-toi la question de l’accord :</b> qui est-ce qui est <b>« ••• »</b> ? Cherche le nom qu’il complète, puis accorde-le.</span></div>';kb.insertBefore(d,kb.children[1]||kb.firstChild);
      const m2=document.querySelectorAll('.moitie')[1];const kb2=[...m2.querySelectorAll('div[style*="position: fixed"]')].pop();if(kb2){const d2=document.createElement('div');d2.innerHTML='<div style="margin:6px 10px 2px"><button class="btn-sm btn-ghost" style="width:auto;border:2px dashed #f59e0b;color:#92400e">💡 Une astuce pour ce mot</button> <span style="font-size:.8rem;color:#64748b">(plus de 20 erreurs : l’astuce s’ouvre d’un geste)</span></div>';kb2.insertBefore(d2,kb2.children[1]||kb2.firstChild);}}''')
    p.wait_for_timeout(300)
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
