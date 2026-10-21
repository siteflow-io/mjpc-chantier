# LES FONCTIONS D'E2 DANS index.html — trouver, mesurer, remplacer, retirer, par leur NOM (jamais par un numéro de ligne).
# Une fonction du site commence à « function NOM( » en colonne 0 et finit à la première ligne « } » en colonne 0 qui suit,
# ou sur sa propre ligne si elle tient en une (les fonctions d'une ligne). Le découpage est VÉRIFIÉ : les accolades de la plage,
# hors chaînes et commentaires, doivent s'équilibrer — sinon l'outil refuse et le dit.
import re, sys
def _fin(t, i):
    """depuis la première « { » à partir de i, rend l'index juste après l'accolade qui la ferme (chaînes, gabarits, commentaires, regex simples évités)"""
    n=0; L=len(t); q=None; ouvert=False
    while i<L:
        c=t[i]
        if q:
            if c=='\\': i+=2; continue
            if c==q: q=None
        elif c in '\'"`': q=c
        elif t.startswith('//',i): j=t.find('\n',i); i=L if j<0 else j; continue
        elif t.startswith('/*',i): j=t.find('*/',i+2); i=L if j<0 else j+2; continue
        elif c=='{': n+=1; ouvert=True
        elif c=='}':
            n-=1
            if ouvert and n==0: return i+1
        i+=1
    return -1
def plage(lignes, nom):
    debut=[k for k,l in enumerate(lignes) if re.match(r'function '+re.escape(nom)+r'\s*\(', l)]
    if len(debut)!=1: raise SystemExit('fonction %s : %d définition(s)'%(nom,len(debut)))
    a=debut[0]; t='\n'.join(lignes[a:]); j=_fin(t,0)
    if j<0: raise SystemExit('fonction %s : pas de fin'%nom)
    b=a+t[:j].count('\n')
    if t[j:].split('\n')[0].strip() not in ('',';'): raise SystemExit('fonction %s : du code suit sa fin sur la ligne %d'%(nom,b+1))
    return a,b
def remplacer(texte, nom, neuf):
    L=texte.split('\n'); a,b=plage(L,nom); return '\n'.join(L[:a]+neuf.rstrip('\n').split('\n')+L[b+1:]), (b-a+1, len('\n'.join(L[a:b+1])))
def retirer(texte, nom):
    L=texte.split('\n'); a,b=plage(L,nom)
    while b+1<len(L) and L[b+1].strip()=='' and a>0 and L[a-1].strip()=='': b+=1   # un seul blanc entre deux fonctions
    return '\n'.join(L[:a]+L[b+1:]), len('\n'.join(L[a:b+1]))
if __name__=='__main__':
    f=sys.argv[1]; L=open(f,encoding='utf-8').read().split('\n')
    for nom in sys.argv[2:]:
        a,b=plage(L,nom); print('%-24s l.%d-%d  %d lignes  %d o  fin: %s'%(nom,a+1,b+1,b-a+1,len('\n'.join(L[a:b+1])),L[b][:40]))
