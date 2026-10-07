# patch-p8-4.py — (p8-4) écrire directement dans la diapo, dans l'atelier et en répétition (complément MANDATS/COMPLEMENT-DEROULE-P8-4.md, version 2)
# usage : python3 patch-p8-4.py <gabarit p8-3d> <p8-4-ecrire.js> <gabarit p8-4 en sortie>
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
for nom in re.findall(r'function (p8\w+)', G) + ['P8_TYPES', 'p8-ecrire', 'p8ecrire', 'p8-type', 'p8t-']:
    if nom in s: sys.exit('ARRÊT : le nom « %s » existe déjà dans le gabarit' % nom)   # n°12 · 40
TOUCHEES = ['morph', 'rendre', 'tout', 'brancherAtelier', 'ecrireDansDiapo', 'lancerRepetition', 'arreterRepetition', 'choixObjet', 'menuAtelierMur']
avant_t = {f: (len(fonction(f).encode()), fonction(f).count('\n') + 1) for f in TOUCHEES}

# 0. les fonctions p8-4, à part (juste avant blocDe, après les gestes de p8-3)
un("function blocDe(el){", G.rstrip('\n') + "\nfunction blocDe(el){", 'insertion des fonctions p8-4')

# 1. rendre — un texte ou une consigne sans ligne de tête (écrit dans la diapo, ou changé de type) : seules ses lignes, chacune un élément
un("if (b.t === 'consigne' || b.t === 'texte') { h += `<div class=\"cons${marqBloc}${lumBloc}\" data-bloc=\"${bi}\">",
   "if (b.t === 'consigne' || b.t === 'texte') { if (String(titre == null ? '' : titre).trim() || !(b.el || []).length) /* (p8-4) sans ligne de tête : ses lignes seules */ h += `<div class=\"cons${marqBloc}${lumBloc}\" data-bloc=\"${bi}\">",
   'rendre : texte et consigne sans ligne de tête')
# 1 bis. rendre — sous le dernier bloc, au pilote seulement, quand l'écriture est ouverte : la zone où l'on clique et écrit (décision 2)
un("      h += '</div>'; });\n    h += '</div>';\n  }\n  if (alertesDiapo.length)",
   "      h += '</div>'; });\n    if (et.pilote && et.ecrire && p8PeutEcrireSous(e)) h += p8ZoneEcrire(); /* (p8-4) sous le dernier bloc, on clique et on écrit */\n    h += '</div>';\n  }\n  if (alertesDiapo.length)",
   'rendre : la zone sous le dernier bloc')

# 2. tout — l'écriture est ouverte dans l'atelier et en répétition ; en répétition, les textes se rebranchent à chaque rendu (le morph retire les attributs)
un("const et = etatComplet(); et.pilote = true; rendre(mur, et);", "const et = etatComplet(); et.pilote = true; et.ecrire = p8EcritureOuverte(); /* (p8-4) */ rendre(mur, et);", 'tout : l\'écriture ouverte')
un("if (S.atelier) { observerMur(); setTimeout(brancherAtelier, 0);", "if (S.repetition) setTimeout(brancherAtelier, 0); /* (p8-4) en répétition aussi, tout texte s'écrit d'un clic */ if (S.atelier) { observerMur(); setTimeout(brancherAtelier, 0);", 'tout : brancher en répétition')

# 3. brancherAtelier — en répétition aussi ; les champs de réponse et les cases du cahier gardent leur propre écriture ; en répétition, ni barre du bloc, ni « enregistré »
un("function brancherAtelier(){ const mur = $('mur'); if (!mur || !S.atelier) return;", "function brancherAtelier(){ const mur = $('mur'); if (!mur || !(S.atelier || S.repetition)) return; /* (p8-4) en répétition aussi */", 'brancherAtelier : en répétition')
un("elementsDeLaDiapo().forEach(x => { if (!x.getAttribute('contenteditable')) { x.setAttribute('contenteditable', 'plaintext-only'); x.setAttribute('spellcheck', 'false'); x.title = 'Écris ici : c\\'est enregistré tout seul quelques secondes après (Tab : l\\'élément suivant · Entrée : un nouvel élément · Échap : annule une ligne vide)'; }",
   "elementsDeLaDiapo().filter(x => x.dataset.p.split('.').length === 2).forEach(x => { /* (p8-4) les champs de réponse (bloc.i.n, bloc.r.n) et les cases du cahier (0.c.n) gardent leur propre écriture */ if (!x.getAttribute('contenteditable')) { x.setAttribute('contenteditable', 'plaintext-only'); x.setAttribute('spellcheck', 'false'); x.title = S.repetition ? 'Écris ici : le tableau suit la frappe ; en répétition, tout ce que tu écris est oublié à l\\'arrêt (Entrée : un nouvel élément)' : 'Écris ici : c\\'est enregistré tout seul quelques secondes après (Tab : l\\'élément suivant · Entrée : un nouvel élément · Échap : annule une ligne vide)'; }",
   'brancherAtelier : quels textes, et leur infobulle')
un("conteneur.classList.add('bloc-edit'); poserBarreBloc(conteneur, blocDe(x)); });", "if (S.repetition) return; /* (p8-4) en répétition : on écrit, on ne range pas */ conteneur.classList.add('bloc-edit'); poserBarreBloc(conteneur, blocDe(x)); });", 'brancherAtelier : pas de barre du bloc en répétition')

# 4. ecrireDansDiapo — en répétition, le tableau suit la frappe (c'est aussi le redessin que la saisie doit tenir)
un("marquerModif({ di: S.di, bi: b.bi, ei: b.ei, n: txt.length }); }", "marquerModif({ di: S.di, bi: b.bi, ei: b.ei, n: txt.length }); if (S.repetition) tout(); /* (p8-4) le tableau suit la frappe ; le texte qui a le focus n'est jamais touché par le redessin */ }", 'ecrireDansDiapo : le tableau suit la frappe en répétition')

# 5. la répétition : l'instantané s'étend à la séance (ses diapos et leurs blocs) ; à l'arrêt, tout ce qui a été écrit est oublié (cadrage 4 §1.5)
un("Jlen: J.length, di: S.di };", "Jlen: J.length, di: S.di, ecrans: clone(DATA.seances[S.si].ecrans) /* (p8-4) la séance : ses diapos et leurs blocs */ };", 'lancerRepetition : l\'instantané de la séance')
un("J.length = snap.Jlen; S.repetition = false;", "J.length = snap.Jlen; if (snap.ecrans) { const E0 = DATA.seances[S.si].ecrans; E0.splice(0, E0.length, ...snap.ecrans); } /* (p8-4) ce qui a été écrit en répétition est oublié */ S.repetition = false;", 'arreterRepetition : la séance restaurée')

# 6. « + bloc » ne propose plus que ce qui n'est pas du texte libre (décision 3) : la carte « Texte » sort ; la consigne reste (elle a sa disposition : la puce, puis ses étapes)
un("${OBJETS.map(o => { const g8", "${OBJETS.filter(o => o.t !== 'texte' /* (p8-4) le texte s'écrit dans la diapo, sous le dernier bloc */).map(o => { const g8", 'choixObjet : sans « Texte »')
un('title="Ajoute un bloc de texte à la fin de la diapo (une consigne et ses étapes) ; le curseur va dedans"',
   'title="Ajoute un objet à la diapo : consigne, question, fiche, schéma, image, vidéo, document — le texte, lui, s\'écrit directement : clique sous le dernier bloc et écris"',
   'l\'infobulle de « + bloc »')

# 7. le menu du bloc : « Changer de type… » (décision 4)
un("[{ a: 'titre', l: `Bloc ${bi + 1} · ${(b.t || '').toUpperCase()} · ${n} élément${n > 1 ? 's' : ''}`, off: true }, '-',",
   "[{ a: 'titre', l: `Bloc ${bi + 1} · ${(b.t || '').toUpperCase()} · ${n} élément${n > 1 ? 's' : ''}`, off: true }, '-', { a: 'p8-type', l: 'Changer de type…', off: !!p8GardeType(b, e), t: p8GardeType(b, e) || 'Le bloc prend en entier la disposition du type choisi, comme créé par « + bloc » ; chaque ligne reste un élément' } /* (p8-4) */, '-',",
   'menuAtelierMur : « Changer de type… »')
un("journal('atelier-menu', { di: S.di, bi, action: act }); if (act === 'b-lier')", "journal('atelier-menu', { di: S.di, bi, action: act }); if (act === 'p8-type') { p8MenuType(bi, ev.clientX, ev.clientY); return; } /* (p8-4) */ if (act === 'b-lier')", 'menuAtelierMur : ouvre le choix du type')

un("'-', { a: 'e-supprimer', l: 'Supprimer l\\'élément'", "'-', { a: 'p8-type', l: 'Changer de type du bloc…', off: !!p8GardeType(b, e), t: p8GardeType(b, e) || 'Le bloc prend en entier la disposition du type choisi, comme créé par « + bloc » ; chaque ligne reste un élément' } /* (p8-4) un bloc tapé n'a que ses lignes : le clic droit sur une ligne le propose aussi */, '-', { a: 'e-supprimer', l: 'Supprimer l\\'élément'", 'menuAtelierMur : « Changer de type » depuis une ligne')
un("journal('atelier-menu', { di: S.di, bi, ei, action: act }); if (act === 'e-dupliquer')", "journal('atelier-menu', { di: S.di, bi, ei, action: act }); if (act === 'p8-type') { p8MenuType(bi, ev.clientX, ev.clientY); return; } /* (p8-4) */ if (act === 'e-dupliquer')", 'menuAtelierMur : le choix du type depuis une ligne')

# 7 bis. morph — défaut trouvé : il retirait les attributs absents du nouveau rendu AVANT de protéger le nœud qui a le focus ; le texte où l'on écrit perdait
#         « contenteditable » au premier redessin, donc le focus, et la frappe partait aux raccourcis. Le nœud qui a le focus garde ses attributs (règle : un redessin ne le touche pas).
un("  for (const at of Array.from(a.attributes)) if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);\n",
   "  if (!estActif) for (const at of Array.from(a.attributes)) if (!b.hasAttribute(at.name)) a.removeAttribute(at.name); /* (p8-4) le texte où l'on écrit garde ses attributs (contenteditable) : un redessin ne le touche pas */\n",
   'morph : le nœud qui a le focus garde ses attributs')

# 8. le tableau reçoit une liste fermée de fonctions (n°12 · 75)
un("p8Place, p8SepCoupe, p8Separe,", "p8Place, p8SepCoupe, p8Separe, p8PeutEcrireSous, p8ZoneEcrire, p8EcritureOuverte,", 'le tableau : les fonctions p8-4 du rendu')
if 'p8DiapoASchema,' not in s[s.index('const fns = {'):s.index('const fns = {') + 3000]:
    un("p8Place, p8SepCoupe, p8Separe, p8PeutEcrireSous,", "p8Place, p8SepCoupe, p8Separe, p8DiapoASchema, p8PeutEcrireSous,", 'le tableau : p8DiapoASchema')

# 9. le style : la zone sous le dernier bloc (classe préfixée, cherchée avant d'être écrite)
un(".mur ul.etapes li:empty{min-height:calc(1lh + .24em)}",
   ".mur ul.etapes li:empty{min-height:calc(1lh + .24em)}\n/* (p8-4) sous le dernier bloc, on clique et on écrit : discrète, elle ne prend qu'une ligne basse ; collée au bas du cadre quand la diapo déborde (elle reste à portée de clic) */\n"
   ".mur .p8-ecrire{display:block;position:sticky;bottom:0;z-index:1;background:rgba(255,253,248,.96);min-height:1em;margin-top:.2em;padding:.05em .2em;font-size:.6em;line-height:1.3;color:#6a5a48;border-top:1px dashed #e6ddd0;outline:none;cursor:text}\n"
   ".mur .p8-ecrire:empty::before{content:\"✎ clique ici et écris\";color:#b8a98f;font-style:italic}\n.mur .p8-ecrire:focus{border-top-color:#c99a4e}",
   'style : la zone sous le dernier bloc')

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
for f in TOUCHEES:
    a = fonction(f); print('%s : %d o / %d lignes → %d o / %d lignes' % (f, avant_t[f][0], avant_t[f][1], len(a.encode()), a.count('\n') + 1))
print('p8-4-ecrire.js : %d o, %d fonctions (%s)' % (len(G.encode()), len(re.findall(r'^function ', G, re.M)), ', '.join('%s %d o' % (n, len(fonction(n).encode())) for n in re.findall(r'function (p8\w+)', G))))
