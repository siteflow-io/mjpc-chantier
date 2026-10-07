# patch-p8-3b.py — (p8-3b) T11 : un trait ne passe jamais derrière une autre bulle (complément p8-3b, C13 tour 18)
# usage : python3 patch-p8-3b.py <gabarit p8-3> <gabarit p8-3b en sortie>
# Chaque remplacement est exigé UNE fois exactement (sinon arrêt) ; les tailles avant / après de chaque fonction touchée sont écrites.
import sys
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
journal = []
def un(avant, apres, quoi):
    global s
    n = s.count(avant)
    if n != 1: sys.exit('ARRÊT : « %s » trouvé %d fois' % (quoi, n))
    s = s.replace(avant, apres); journal.append('%s : %d → %d o' % (quoi, len(avant.encode()), len(apres.encode())))
def fonction(nom):
    i = s.index('function ' + nom + '(')
    fins = [s.find(x, i + 1) for x in ('\nfunction ', '\n/*', '\nconst ', '\nlet ', '\n$(', '\ndocument.', '\nwindow.', '\nsetInterval')]
    return s[i:min(x for x in fins if x > 0)]
if 'p8SepCoupe' in s: sys.exit('ARRÊT : le nom « p8SepCoupe » existe déjà dans le gabarit')   # n°12 · 40 : cherché avant d'être écrit
TOUCHEES = ['p8Separe', 'p8Carte', 'p8Frise', 'p8Arbre', 'p8Cycle']
avant_t = {f: (len(fonction(f).encode()), fonction(f).count('\n') + 1) for f in TOUCHEES}

# 1. p8Separe reçoit les traits du dessin (6e argument, facultatif : sans lui, rien ne change)
un("function p8Separe(N,W,H,marge,u){\n", "function p8Separe(N,W,H,marge,u,liens){\n", 'p8Separe : la signature')

# 2. T11, dans la boucle d'écartement, après les chevauchements et avant le rappel dans le cadre :
#    un trait qui passe derrière une bulle qui n'est pas à son bout est un contact ; la bulle est poussée, perpendiculairement au trait,
#    du côté où elle est déjà si le cadre visible a la place, sinon de l'autre côté ; une bulle placée à la main n'est jamais poussée.
T11 = """    /* T11 (C13, tour 18) : un trait qui passe derrière une bulle qui n'est pas à son bout est un contact, comme un chevauchement —
       la bulle en cause est poussée vers la place libre du cadre visible ; une bulle placée à la main ne l'est jamais (décision 7 : la mesure le dit) */
    (liens||[]).forEach(function(l){ var P=l.pts();
      N.forEach(function(n){ if(n===l.a||n===l.b||n.fixe)return;
        for(var i=0;i+1<P.length;i++){ if(!p8SepCoupe(P[i],P[i+1],n))continue;
          var dx=P[i+1][0]-P[i][0], dy=P[i+1][1]-P[i][1], lg=Math.hypot(dx,dy)||1, nx=-dy/lg, ny=dx/lg;
          var d=(n.x-P[i][0])*nx+(n.y-P[i][1])*ny, il=Math.abs(nx)*n.w/2+Math.abs(ny)*n.h/2+marge/2, sg=(d>=0?1:-1);
          var essais=[sg*(il-Math.abs(d)), -sg*(il+Math.abs(d))];
          for(var j=0;j<2;j++){ var tx=n.x+nx*essais[j], ty=n.y+ny*essais[j];
            if(tx>=n.w/2+4*u-0.5&&tx<=W-n.w/2-4*u+0.5&&ty>=n.h/2+4*u-0.5&&ty<=H-n.h/2-4*u+0.5){ n.x=tx; n.y=ty; bouge=true; break; } }
          break; } }); });
"""
un("""      }
    }
    N.forEach(function(n){ if(n.fixe)return;
      n.x=Math.max(n.w/2+4*u,Math.min(W-n.w/2-4*u,n.x));""", """      }
    }
""" + T11 + """    N.forEach(function(n){ if(n.fixe)return;
      n.x=Math.max(n.w/2+4*u,Math.min(W-n.w/2-4*u,n.x));""", 'p8Separe : T11 dans la boucle')

# 3. le test « ce segment passe-t-il derrière cette bulle ? » (découpage de Liang-Barsky sur la boîte de la bulle), à part, juste avant p8Separe
COUPE = """/* T11 : le segment p → q passe-t-il derrière la boîte de la bulle n ? (découpage du segment par la boîte, Liang-Barsky) */
function p8SepCoupe(p,q,n){
  var t0=0,t1=1,dx=q[0]-p[0],dy=q[1]-p[1],P=[-dx,dx,-dy,dy],Q=[p[0]-(n.x-n.w/2),(n.x+n.w/2)-p[0],p[1]-(n.y-n.h/2),(n.y+n.h/2)-p[1]];
  for(var i=0;i<4;i++){ if(P[i]===0){ if(Q[i]<0)return false; continue; } var r=Q[i]/P[i]; if(P[i]<0){ if(r>t1)return false; if(r>t0)t0=r; } else { if(r<t0)return false; if(r<t1)t1=r; } }
  return t1-t0>1e-6;
}
"""
un("function p8Separe(N,W,H,marge,u,liens){\n", COUPE + "function p8Separe(N,W,H,marge,u,liens){\n", 'p8SepCoupe : insertion')

# 4. chaque forme passe ses traits, tels qu'elle les dessine, à p8Separe
#    carte : du centre à la famille, de la famille à la notion (segments droits)
un("  p8Separe(N,c.W,c.H,7*e*u,u);\n  var s='';\n  liens.forEach(",
   "  p8Separe(N,c.W,c.H,7*e*u,u,liens.map(function(l){ return {a:l.a,b:l.b,pts:function(){ return [[l.a.x,l.a.y],[l.b.x,l.b.y]]; }}; }));   /* T11 */\n  var s='';\n  liens.forEach(",
   'p8Carte : les traits passés à p8Separe')
#    frise : l'axe (aucune bulle à ses bouts) et le trait de chaque point de l'axe à sa bulle
un("  p8Separe(N,W,H,9*e*u,u);\n",
   "  p8Separe(N,W,H,9*e*u,u,[{a:null,b:null,pts:function(){ return [[W*0.04,yL],[W*0.96,yL]]; }}].concat(N.map(function(n){ return {a:null,b:n,pts:function(){ return [[n.jalonX,yL],[n.x,n.y]]; }}; })));   /* T11 */\n",
   'p8Frise : les traits passés à p8Separe')
#    arbre : la courbe de chaque nœud à son parent (la même que celle dessinée), en 16 segments
un("  p8Separe(noeuds,c.W,c.H,7*e*u,u);\n",
   "  var liensA=[]; noeuds.forEach(function(n,k){ if(!n.d)return; for(var j=k-1;j>=0;j--){ if(noeuds[j].d===n.d-1){ var P=noeuds[j];   /* T11 */\n"
   "    liensA.push({a:P,b:n,pts:function(){ var x0=P.x,y0=P.y+14*u,x3=n.x,y3=n.y-14*u,ym=(P.y+n.y)/2,o=[]; for(var i=0;i<=16;i++){ var t=i/16,v=1-t; o.push([v*v*v*x0+3*v*v*t*x0+3*v*t*t*x3+t*t*t*x3, v*v*v*y0+3*v*v*t*ym+3*v*t*t*ym+t*t*t*y3]); } return o; }}); break; } } });\n"
   "  p8Separe(noeuds,c.W,c.H,7*e*u,u,liensA);\n",
   'p8Arbre : les traits passés à p8Separe')
#    cycle : la flèche courbe de chaque étape à la suivante (la même que celle dessinée), en 16 segments
un("  p8Separe(N,c.W,c.H,9*e*u,u);\n  /* la flèche s'arrête AU BORD",
   "  p8Separe(N,c.W,c.H,9*e*u,u,N.map(function(n,k){ var m=N[(k+1)%N.length]; return {a:n,b:m,pts:function(){   /* T11 */\n"
   "    var d=bord(m,n), f=bord(n,m), mx=(d.x+f.x)/2, my=(d.y+f.y)/2, vx=cx*c.sx-mx, vy=cy*c.sy-my, l=Math.hypot(vx,vy)||1, qx=mx-vx/l*26*e*u, qy=my-vy/l*26*e*u, o=[];\n"
   "    for(var i=0;i<=16;i++){ var t=i/16,v=1-t; o.push([v*v*d.x+2*v*t*qx+t*t*f.x, v*v*d.y+2*v*t*qy+t*t*f.y]); } return o; }}; }));\n"
   "  /* la flèche s'arrête AU BORD",
   'p8Cycle : les traits passés à p8Separe')

# 5. T7 / n°12 · 75 : la fenêtre du tableau reçoit une liste fermée de fonctions — p8SepCoupe y passe, avec p8Separe
un("p8Place, p8Separe, p8Cls,", "p8Place, p8SepCoupe, p8Separe, p8Cls,", 'le tableau : p8SepCoupe dans sa liste de fonctions')

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
for f in TOUCHEES:
    a = fonction(f); print('%s : %d o / %d lignes → %d o / %d lignes' % (f, avant_t[f][0], avant_t[f][1], len(a.encode()), a.count('\n') + 1))
a = fonction('p8SepCoupe'); print('p8SepCoupe (nouvelle) : %d o / %d lignes' % (len(a.encode()), a.count('\n') + 1))
