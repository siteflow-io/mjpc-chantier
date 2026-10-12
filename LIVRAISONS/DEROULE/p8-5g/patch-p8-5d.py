# patch-p8-5d.py — (p8-5d) les notes suivent toujours la diapo, et le premier caractère (complément MANDATS/COMPLEMENT-DEROULE-P8-5d.md, C13 tours 46-47)
# usage : python3 patch-p8-5d.py <gabarit p8-5c> <gabarit p8-5d en sortie>
# Deux remplacements dans le code p8-5c, chacun exigé une fois exactement (sinon arrêt) ; les tailles avant / après des deux fonctions touchées sont écrites.
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
TOUCHEES = ['p8RendreNotes', 'p8NouvelleNote']
avant_t = {f: (len(fonction(f).encode()), fonction(f).count('\n') + 1) for f in TOUCHEES}

# 1. le panneau suit la diapo courante, toujours (Paul, 11/10 : « une note suit sa diapo, toujours ») : la décision 8 de p8-5c (le panneau attendait la sortie du paragraphe) est retirée.
#    Si le paragraphe qui a le focus appartient à une autre diapo, il le rend (blur) avant le rendu : ce qui était tapé est déjà enregistré (à chaque frappe), rien n'est perdu.
un("if (af && P8_IDENT.has(af) && P8_IDENT.get(af).key !== key) return; /* on écrit dans la note d'une autre diapo (l'animation a changé de diapo) : le panneau attend la fin de la frappe, il sera redessiné à la sortie du paragraphe */",
   "if (af && (P8_IDENT.has(af) ? P8_IDENT.get(af).key : af.dataset.p8key) !== key) af.blur(); /* (p8-5d) le panneau suit la diapo courante, toujours : le paragraphe d'une autre diapo rend le focus avant le rendu ; ce qui était tapé est déjà enregistré */",
   'p8RendreNotes : le panneau suit la diapo, toujours')
# 3. le premier caractère après Entrée : le paragraphe neuf prend le focus dans le même geste (avant : au tour suivant, setTimeout 0 ; les touches tapées entre-temps se perdaient)
un("const j = L2.indexOf(n); setTimeout(() => { const nv = $('notesd').querySelector('.p8-mt[data-p8n=\"' + j + '\"]'); if (nv) nv.focus(); }, 0); }",
   "const j = L2.indexOf(n); const nv = $('notesd').querySelector('.p8-mt[data-p8n=\"' + j + '\"]'); if (nv) nv.focus(); /* (p8-5d) dans le même geste : la touche suivante arrive dans le paragraphe neuf */ }",
   'p8NouvelleNote : le focus dans le même geste')

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
for f in TOUCHEES:
    a = fonction(f); print('%s : %d o / %d lignes → %d o / %d lignes' % (f, avant_t[f][0], avant_t[f][1], len(a.encode()), a.count('\n') + 1))
