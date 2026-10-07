# patch-p8-5.py — (p8-5) écrire en classe, dans la copie de la classe ; à la fin de l'heure, le versement diapo par diapo (complément MANDATS/COMPLEMENT-DEROULE-P8-5.md)
# usage : python3 patch-p8-5.py <gabarit p8-4> <p8-5-classe.js> <gabarit p8-5 en sortie>
# Chaque remplacement est exigé une fois exactement (sinon arrêt) ; les tailles avant / après de chaque fonction touchée sont écrites.
import sys, re
src, code, out = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src, encoding='utf-8').read(); G = open(code, encoding='utf-8').read()
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
for nom in re.findall(r'function (p8\w+)', G) + ['p8-verse', 'p8verse', 'p8eid', 'p8fait', 'S.versements']:
    if nom in s: sys.exit('ARRÊT : le nom « %s » existe déjà dans le gabarit' % nom)   # n°12 · 40
if re.search(r'S\.copie(?![A-Za-z])', s): sys.exit('ARRÊT : le nom « S.copie » existe déjà dans le gabarit')   # (« S.copieED » existe : un autre nom)
TOUCHEES = ['tout', 'brancherAtelier', 'ecrireDansDiapo', 'clotureHtml']
avant_t = {f: (len(fonction(f).encode()), fonction(f).count('\n') + 1) for f in TOUCHEES}

# 0. les fonctions p8-5, à part (juste avant blocDe, après celles de p8-4)
un("function blocDe(el){", G.rstrip('\n') + "\nfunction blocDe(el){", 'insertion des fonctions p8-5')

# 1. tout — en classe, le pilote et le tableau montrent la copie de la classe ; les textes s'y rebranchent à chaque rendu
un("const et = etatComplet(); et.pilote = true; et.ecrire = p8EcritureOuverte(); /* (p8-4) */ rendre(mur, et);",
   "const et = etatComplet(); et.pilote = true; et.ecrire = p8EcritureOuverte(); /* (p8-4) */ if (!S.atelier && !S.repetition) et.textes = p8TextesCopie(e, et.textes); /* (p8-5) la copie de la classe, au pilote et au tableau */ rendre(mur, et);",
   'tout : la copie de la classe au rendu')
un("if (S.repetition) setTimeout(brancherAtelier, 0); /* (p8-4) en répétition aussi, tout texte s'écrit d'un clic */",
   "if (S.repetition || p8EnClasse()) setTimeout(brancherAtelier, 0); /* (p8-4) en répétition aussi, tout texte s'écrit d'un clic ; (p8-5) et en classe, dans la copie */",
   'tout : brancher en classe')

# 2. brancherAtelier — en classe aussi ; on écrit le texte, on ne touche pas à la structure (ni élément nouveau, ni ligne retirée, ni bloc déplacé)
un("function brancherAtelier(){ const mur = $('mur'); if (!mur || !(S.atelier || S.repetition)) return; /* (p8-4) en répétition aussi */",
   "function brancherAtelier(){ const mur = $('mur'); if (!mur || !(S.atelier || S.repetition || p8EnClasse())) return; /* (p8-4) en répétition aussi ; (p8-5) en classe, dans la copie */",
   'brancherAtelier : en classe')
un("x.title = S.repetition ? ",
   "x.title = p8EnClasse() ? 'Écris ici : la classe voit ta correction ; elle reste dans la copie de la classe — « Fin de l\\'heure » te proposera de la verser dans la trame (Entrée : le texte suivant)' : S.repetition ? ",
   'brancherAtelier : l\'infobulle en classe')
un("if (S.repetition) return; /* (p8-4) en répétition : on écrit, on ne range pas */",
   "if (!S.atelier) return; /* (p8-4) en répétition, (p8-5) en classe : on écrit, on ne range pas */",
   'brancherAtelier : pas de barre du bloc hors de l\'atelier')
un("const all = elementsEditables(); const k = all.indexOf(x);",
   "const all = elementsEditables(); const k = all.indexOf(x); if (p8EnClasse() && (ev.key === 'Enter' || ev.key === 'Escape' || ev.altKey)) { /* (p8-5) en classe, le texte s'écrit, la structure ne change pas : Entrée passe au texte suivant */ if (ev.key === 'Enter') { ev.preventDefault(); ev.stopPropagation(); const n = all[k + 1]; if (n) focaliser(n); else x.blur(); } else if (ev.altKey) { ev.preventDefault(); ev.stopPropagation(); } return; }",
   'brancherAtelier : en classe, la structure ne change pas')

# 3. ecrireDansDiapo — en classe, la frappe va dans la copie, jamais dans la trame
un("function ecrireDansDiapo(el){ ", "function ecrireDansDiapo(el){ if (p8EnClasse()) { p8EcrireCopie(el); return; } /* (p8-5) */ ", 'ecrireDansDiapo : en classe, la copie')

# 4. « Fin de l'heure » : la liste des diapos modifiées (avant : des cases à cocher, jamais lues — rien ne remplissait « textes »), chacune « verser dans la trame » oui / non
un("<br><b>Diapos modifiées pendant l'heure</b> — verser dans le chapitre ? ${modifs.length ? modifs.map(e => `<label><input type=\"checkbox\" data-verse=\"${e.eid}\"> ${esc(e.act)}</label>`).join('') : '<span style=\"color:var(--sourd)\">aucune</span>'}</div>`;",
   "<br><b>Diapos modifiées pendant l'heure</b> — ce que la classe a vu, à verser ou non dans la trame : ${p8ListeVersement()}</div>`; /* (p8-5) la copie de la classe comparée à la trame, par identité */",
   'clotureHtml : la liste du versement')
un("function clotureHtml(){ const modifs = []; seance().ecrans.forEach((e, i) => { const st = parDiapo[K(i)]; if (st && Object.keys(st.textes || {}).length) modifs.push(e); });",
   "function clotureHtml(){",
   'clotureHtml : l\'ancienne liste, retirée')

# 4 bis. « Fin de l'heure » : si la copie diffère de la trame, la liste des diapos modifiées s'ouvre (l'étape 5 du pas à pas, « avant de clore », où elle vit)
un("$('bfin').onclick = () => ouvrirFin(true);", "$('bfin').onclick = () => { if (p8CopieDiffere()) S.finSection = 5; /* (p8-5) la liste du versement s'ouvre */ ouvrirFin(true); };", '« Fin de l\'heure » : la liste du versement s\'ouvre')

# 5. le style (classes préfixées, cherchées avant d'être écrites)
un(".mur .p8-ecrire:focus{border-top-color:#c99a4e}",
   ".mur .p8-ecrire:focus{border-top-color:#c99a4e}\n/* (p8-5) le versement de la copie de la classe, à la fin de l'heure */\n"
   ".p8-verse-liste{margin:6px 0 0}.p8-verse{border-left:3px solid var(--or);padding:4px 10px;margin:6px 0;background:rgba(201,154,78,.06)}.p8-verse-t{font-weight:600}.p8-verse-d{color:var(--texte2);margin:2px 0}.p8-verse-q{margin-top:4px}.p8-verse-q .btn{margin-right:4px}.p8-verse-dit{color:var(--joue);font-weight:600}.p8-verse-sans{color:var(--sourd);font-size:.85em}",
   'style : le versement')

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
for f in TOUCHEES:
    a = fonction(f); print('%s : %d o / %d lignes → %d o / %d lignes' % (f, avant_t[f][0], avant_t[f][1], len(a.encode()), a.count('\n') + 1))
print('p8-5-classe.js : %d o, %d fonctions (%s)' % (len(G.encode()), len(re.findall(r'^function ', G, re.M)), ', '.join('%s %d o' % (n, len(fonction(n).encode())) for n in re.findall(r'function (p8\w+)', G))))
