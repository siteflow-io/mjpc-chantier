# Captures construites : la correction en oui / non (C13 1116-1120). Données : la copie d'Emma (son bilan du 29/10), poids réels de la grille.
import math, html
E=html.escape
P=[ # (id, critère, libellé, poids, [(question, réponse, ordre de lecture)], au-delà)
('codes',"L'organisation et la lettre","Les codes de la lettre",2,[("Y a-t-il un lieu ?",1,'oeil'),("Y a-t-il une date ?",0,'oeil'),("Le destinataire est-il nommé ?",1,'oeil'),("La lettre est-elle signée ?",1,'oeil')],None),
('trente_lignes',"L'organisation et la lettre","Trente lignes",2,[("La lettre fait-elle trente lignes ?",0,'oeil')],None),
('trois_paragraphes',"Le thème et l'invention","Les trois paragraphes",4,[("Le 1er paragraphe montre-t-il le concret ?",1,'lire'),("Le 2e dit-il le plus dur ?",1,'lire'),("Le 3e dit-il l'inquiétude pour l'autre ?",0,'oeil')],None),
('theme_tenu',"Le thème et l'invention","Le thème tenu",6,[("Sait-on qui écrit ?",1,'lire'),("Sait-on d'où il écrit ?",1,'lire'),("Sait-on à qui ?",1,'lire'),("Est-ce bien la guerre de 14-18 ?",1,'lire'),("Le personnage a-t-il une vie à lui ?",0,'lire')],("On croit lire une vraie lettre de 14-18 ?",0)),
('lectures',"Le thème et l'invention","Les lectures reprises",2,[("Fait-il voir le concret, comme Jean Déléage ?",1,'lire'),("Les détails du chapitre sont-ils repris sans être recopiés ?",0,'lire')],None),
('phrases_complexes',"La construction des phrases","Les phrases complexes",5,[("Toutes les phrases sont-elles complexes ?",1,'lire'),("Chaque subordonnée a-t-elle sa principale ?",1,'lire'),("Chaque relatif est-il le bon ?",0,'lire')],None),
('architectures',"La construction des phrases","Les cinq architectures",7,[("Les cinq sont-elles là ?",1,'lire'),("Sont-elles construites correctement ?",1,'lire'),("Leurs numéros sont-ils dans la marge ?",0,'oeil')],("Reviennent-elles plusieurs fois ?",0)),
('personne_destinataire',"L'organisation et la lettre","La 1re personne et le destinataire",2,[("Le « je » est-il tenu ?",1,'lire'),("Écrit-il vraiment à quelqu'un ?",1,'lire'),("Les temps sont-ils cohérents ?",0,'lire')],None),
('modalisation_litote',"La construction des phrases","Modalisation et litote",2,[("Chaque paragraphe a-t-il sa modalisation ?",1,'fin'),("La litote fait-elle entendre plus qu'elle ne dit ?",0,'fin')],None),
('ce_qu_on_tait',"Le thème et l'invention","Ce qu'on tait",2,[("La lettre tait-elle quelque chose ?",0,'fin'),("Devine-t-on pourquoi ?",0,'fin')],None),
('lexique',"La langue","Lexique",2,[("Le vocabulaire est-il juste ?",1,'fin'),("Est-il varié ?",1,'fin')],("Un terme recherché ou imagé ?",0)),
]
ORDRE=['codes','trente_lignes','trois_paragraphes','theme_tenu','lectures','phrases_complexes','architectures','personne_destinataire','modalisation_litote','ce_qu_on_tait','lexique']
COUL=['rouge','orange','vert','foncé']; LAB=['Insuffisant','Fragile','Satisfaisant','Très satisfaisant']
def calc(p):
  qs=p[4]; oui=sum(q[1] for q in qs); n=len(qs); man=n-oui; r=oui/n
  au=p[5] and p[5][1]
  ech=3 if (oui==n and au) else 2 if r>=.75 else 1 if r>=.5 else 0
  if ech==3: return ech,float(p[3]),man
  sub=max(0,min(3,3-man)); return ech, math.floor(p[3]*(ech*4+sub)/12*2)/2, man
R={p[0]:calc(p) for p in P}
ERR=[2,2,3,5,5,7,8,9,9,11,14,15,17,19]
R['orthographe']=(0,0.0,len(ERR))
tot=sum(v[1] for v in R.values())
crit={}
for p in P: crit.setdefault(p[1],[]).append(p[0])
crit.setdefault('La langue',[]).insert(0,'orthographe')
MAX={"Le thème et l'invention":14,"La construction des phrases":14,"L'organisation et la lettre":6,"La langue":6}
LIB={p[0]:p[2] for p in P}; LIB['orthographe']='Orthographe et grammaire'
POI={p[0]:p[3] for p in P}; POI['orthographe']=4
manques=sum(v[2] for k,v in R.items() if k!='orthographe'); gestes=3+manques+len(ERR)+1
css='''*{box-sizing:border-box}body{margin:0;background:#f6f1e7;color:#2b2420;font:15px/1.35 Georgia,"Liberation Serif",serif}
.top{background:linear-gradient(#c4935a,#a87842);color:#fff;display:flex;align-items:center;gap:14px;padding:10px 18px}
.top b{font-size:20px;letter-spacing:.03em}.pill{background:rgba(255,255,255,.18);border-radius:8px;padding:5px 10px}.esp{flex:1}
.cols{display:flex;gap:14px;padding:12px 16px;height:calc(100vh - 52px)}
.col{background:#fffdf8;border:1px solid #e1d6c4;border-radius:10px;padding:10px 12px;overflow:hidden}
h3{break-after:avoid;margin:2px 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#7a2a2a}
.q{break-inside:avoid;display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px dashed #eadfcd;font-size:14px}
.q .t{flex:1}.on{display:inline-block;min-width:44px;text-align:center;border-radius:6px;padding:1px 6px;font-size:13px;border:1px solid #c9bba4;color:#8a7a62}
.on.oui{background:#e8f2df;border-color:#9cc27f;color:#3d6b26}.on.non{background:#f6d0cc;border-color:#c0504a;color:#8e2b25;font-weight:bold}
.q .p{font-size:11.5px;color:#9a8a72;width:120px;text-align:right}
.g{display:flex;align-items:center;gap:6px;margin:3px 0;font-size:13.5px}.g .l{flex:1}
.c{width:118px;text-align:center;border-radius:5px;padding:2px 0;font-size:12.5px;border:1px solid}
.c0{background:#f4b1ad;border-color:#c0504a}.c1{background:#f5c98a;border-color:#c98a2e}.c2{background:#a9d18e;border-color:#5f9a3e}.c3{background:#5f9a5a;border-color:#3d6b3a;color:#fff}
.n{width:62px;text-align:right;font-weight:bold}
.reg{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px}.reg span{width:30px;height:26px;border:1px solid #c9bba4;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;position:relative;background:#fff}
.reg span.e{background:#f6d0cc;border-color:#c0504a;font-weight:bold}.reg span i{position:absolute;top:-6px;right:-5px;background:#8e2b25;color:#fff;border-radius:8px;font-size:9.5px;padding:0 3px;font-style:normal}
.ges{font-size:22px;font-weight:bold;color:#3d6b26}.m{color:#8a7a62;font-size:12.5px}'''
def vueA():
  h='<div class="top"><b>CHAUVIN Emma</b><span>Copie 7 sur 30</span><span class="pill">Copie suivante : CF ⏎</span><span class="esp"></span><span class="pill">Écrire une lettre de la Grande Guerre</span><span class="pill">⏱ le chrono de la copie</span><span class="pill" style="font-size:18px">%.1f / 40</span></div>'%tot
  h+='<div class="cols"><div class="col" style="flex:1.25;column-count:2;column-gap:22px">'
  for grp,tit in [('oeil',"D'un coup d'œil"),('lire','En lisant'),('fin','À la fin')]:
    h+='<h3>'+tit+'</h3>'
    for k in ORDRE:
      p=[x for x in P if x[0]==k][0]
      for q in p[4]:
        if q[2]!=grp: continue
        h+='<div class="q"><span class="t">%s</span><span class="on %s">%s</span><span class="p">%s</span></div>'%(E(q[0]),'oui' if q[1] else 'non','oui' if q[1] else 'NON',E(p[2]))
      if grp=='fin' and p[5]: h+='<div class="q"><span class="t">%s <span class="m">· au-delà</span></span><span class="on">non</span><span class="p">%s</span></div>'%(E(p[5][0]),E(p[2]))
  h+='<div class="m" style="margin-top:6px">Tout est « oui » d’avance : tu ne cliques que ce qui manque, et l’« au-delà » quand il est là. Les « NON » de cette copie : %d clics.</div></div>'%manques
  h+='<div class="col" style="flex:1"><h3>La grille — calculée</h3>'
  for cr,ks in crit.items():
    st=sum(R[k][1] for k in ks); h+='<div class="g" style="margin-top:7px"><span class="l"><b>%s</b></span><span class="n">%s / %d</span></div>'%(E(cr),('%g'%st).replace('.',','),MAX[cr])
    for k in ks:
      e,nt,man=R[k]; h+='<div class="g"><span class="l">%s <span class="m">/ %d</span></span><span class="c c%d">%d %s</span><span class="n">%s</span></div>'%(E(LIB[k]),POI[k],e,e+1,LAB[e],('%g'%nt).replace('.',','))
  h+='<h3 style="margin-top:12px">La langue — les erreurs, par ligne</h3><div class="reg">'
  for l in range(1,31):
    c=ERR.count(l); h+='<span class="%s">%d%s</span>'%('e' if c else '',l,'<i>%d</i>'%c if c>1 else '')
  h+='</div><div class="m">14 erreurs : un clic sur la ligne de chaque erreur. Au-delà de quinze, le total en deux touches.</div>'
  h+='<div style="margin-top:12px;display:flex;align-items:baseline;gap:10px"><span class="ges">%d / 30 gestes</span><span class="m">initiales et Entrée 3 · manques %d · erreurs %d · valider 1</span></div>'%(gestes,manques,len(ERR))
  h+='<div class="m">Aujourd’hui sur la même copie : 12 échelons + 12 sous-échelons + 14 au compteur + 4 citations = 42.</div></div></div>'
  return h
def vueB():
  h='<div style="max-width:1100px;margin:0 auto;background:#fff;padding:26px 40px;min-height:100vh">'
  h+='<div style="display:flex;align-items:baseline"><h2 style="margin:0;font-size:24px">CHAUVIN Emma — Écrire une lettre de la Grande Guerre</h2><span class="esp"></span><b style="font-size:24px">%s / 40</b></div><div class="m">3 FRANKLIN ARETHA · rédaction 1</div>'%('%g'%tot).replace('.',',')
  h+='<h3 style="margin-top:16px">Ton échelle</h3><table style="border-collapse:collapse;width:100%;font-size:13px">'
  for cr,ks in crit.items():
    for k in ks:
      e=R[k][0]; h+='<tr><td style="padding:2px 6px;width:34%%">%s</td>'%E(LIB[k])+''.join('<td style="padding:2px"><div class="c %s" style="width:100%%;%s">%d %s</div></td>'%('c%d'%i if i==e else '', '' if i==e else 'border-color:#e3dacb;color:#b8ab95;background:#fff', i+1, LAB[i]) for i in range(4))+'</tr>'
  h+='</table>'
  h+='''<h3 style="margin-top:16px">Mon bilan</h3><p style="font-size:15.5px;text-align:justify">Emma, ta lettre tient le thème : on sait qui écrit, d’où, à qui, et c’est bien la guerre de 14-18. Tu fais voir le concret, comme Jean Déléage, et toutes tes phrases sont complexes, avec les cinq architectures.</p>
<p style="font-size:15.5px;text-align:justify">Ce qui manque encore : ton personnage n’a pas de vie à lui ; le troisième paragraphe, l’inquiétude pour l’autre, n’est pas écrit ; un détail est trop proche du texte lu (« Il y a aussi beaucoup de mort qui sont entassés sur le sol où l’on marche. », ligne 9) ; ta lettre dit tout, même le pire, sans se demander ce que l’autre peut entendre (« Je ne veux pas que tu pleure pour moi qui tue des gens. », ligne 14) ; ta litote dit la chose au lieu de la faire entendre.</p>
<p style="font-size:15.5px;text-align:justify">Une phrase m’a touché : « je parlais de mes enfants qui était ma fiertée » (ligne 17) — on y entend la guerre vécue par un père. Ta priorité, Emma : le troisième paragraphe.</p>
<h3 style="margin-top:14px">À reprendre</h3><ol style="font-size:15px;margin-top:4px">
<li>Ajoute la date de ta lettre.</li><li>Écris le troisième paragraphe : ton inquiétude pour l’autre.</li><li>Donne une vie à ton personnage : son âge, son métier d’avant.</li><li>Récris le détail de la ligne 9 avec tes mots.</li><li>Tais une chose, et laisse deviner pourquoi.</li><li>Récris ta litote pour qu’elle fasse entendre plus qu’elle ne dit.</li><li>Vérifie chaque relatif, et note le numéro de chaque architecture dans la marge.</li><li>Corrige tes 14 erreurs : ligne 2 (2), 3, 5 (2), 7, 8, 9 (2), 11, 14, 15, 17, 19. Tu les corriges dans l’appli.</li></ol></div>'''
  return h
for nom,b in [('a',vueA()),('b',vueB())]:
  open('vue-%s.html'%nom,'w',encoding='utf8').write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>'+css+'</style></head><body>'+b+'</body></html>')
print('total',tot,'gestes',gestes,'manques',manques)
