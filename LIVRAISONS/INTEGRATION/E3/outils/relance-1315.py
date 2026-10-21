#!/usr/bin/env python3
# E3 — la relance du 21/10 13:15 (réveil n°2) appliquée à index.html : F5 (le QR tombe), F8 (sesBandeau* tombent), C5 (sesGet, _sesRangLocal
# tombent ; le pointeur réécrit sur dr_lire), M8 (la garde couvre sendBeacon). Même méthode que brancher-index.py (nom à la colonne 0, fin « } »).
import re, sys, hashlib
src = sys.argv[1]; html = open(src, encoding='utf-8').read(); L = html.split('\n'); bilan = []
def trouver(nom):
    pat = re.compile(r'^function ' + re.escape(nom) + r'\(')
    deb = [i for i, l in enumerate(L) if pat.match(l)]
    if len(deb) != 1: raise SystemExit('introuvable ou en double : %s (%d)' % (nom, len(deb)))
    i = deb[0]
    if L[i].rstrip().endswith('}') and L[i].count('{') == L[i].count('}'): return i, i
    j = i + 1
    while j < len(L) and L[j].rstrip() != '}': j += 1
    return i, j
def remplacer(nom, neuf):
    global L
    i, j = trouver(nom); avant = len('\n'.join(L[i:j + 1]))
    L = L[:i] + (neuf.split('\n') if neuf is not None else []) + L[j + 1:]
    bilan.append('%-24s %7d o -> %s' % (nom, avant, ('%d o' % len(neuf)) if neuf is not None else 'retirée'))
for n in ['sesBandeau', 'sesBandeauEtat', 'sesQROuvrir', 'sesQRFermer', 'sesGet', '_sesRangLocal']: remplacer(n, None)
remplacer('sesTabVeillePointeur', '''function sesTabVeillePointeur(){
  dr_tabLire('/site/cours_actif',function(c){                /* [E3] par dr_lire (sesGet tombe, relance C5) */
    if(!c||!c.ts||(Date.now()-c.ts)>4*3600*1000)return;   /* plus de cours : l'image RESTE (relance C3) */
    var cle=sesTabCle(c);
    if(!cle||cle===SES.tabPointeur)return;                /* même cours : rien à faire */
    SES.tabPointeur=cle; SES.ctx=c;
    dr_tabDireClasse(c.classeNom||c.classeSlug||'');
    dr_tabMonter();                                        /* [E3] le nouveau cours prend la main : sa copie, puis sa scène */
  });
}''')
remplacer('sesTabChercherCours', '''function sesTabChercherCours(){
  var t=setInterval(function(){
    dr_tabLire('/site/cours_actif',function(c){             /* [E3] par dr_lire (sesGet tombe, relance C5) */
      if(!c||!c.ts||(Date.now()-c.ts)>4*3600*1000)return;   /* [E3] l'attente est tenue par dr_tabAttendre */
      clearInterval(t);
      SES.ctx=c; SES.tabPointeur=sesTabCle(c);
      dr_tabDireClasse(c.classeNom||c.classeSlug||'');
      dr_tabMonter();                                      /* [E3] au lieu de sesTabMonter (l'ancien moteur) */
    });
  },2000);
}''')
out = '\n'.join(L)
old = "    return _fetchVrai.apply(this,arguments);\n  };\n}"
new = ("    return _fetchVrai.apply(this,arguments);\n  };\n"
       "  /* [E3] relance M8 : sendBeacon (la présence) est une écriture aussi — bloquée et comptée */\n"
       "  if(navigator.sendBeacon){ navigator.sendBeacon=function(u){ SES.ecrituresBloquees++; try{console.warn('[session] sendBeacon bloqué depuis la vue tableau :',String(u).slice(0,80));}catch(e){} return false; }; }\n}")
assert out.count(old) == 1; out = out.replace(old, new); bilan.append('garde lecture seule : + sendBeacon')
print('\n'.join(bilan)); open(src, 'w', encoding='utf-8').write(out); print('md5 ' + hashlib.md5(out.encode()).hexdigest())
