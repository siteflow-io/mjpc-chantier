# patch-p8-5c.py — (p8-5c) la répétition propre, les notes de présentateur, la mise en forme (complément MANDATS/COMPLEMENT-DEROULE-P8-5c.md, C13 tours 33 à 44)
# usage : python3 patch-p8-5c.py <gabarit p8-5> <p8-5c.js> <gabarit p8-5c en sortie>
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
for nom in re.findall(r'function (p8\w+)', G) + ['P8_SURL', 'P8_TXT_NOTES', 'P8_IDENT', 'P8_MIGRE', 'p8-rep', 'p8-mn', 'p8-mt', 'p8-k', 'p8-vif', 'p8-fait', 'p8-mf', 'p8-palette', 'p8-ct', 'p8-p', 'p8-trait', 'p8-lettre', 'p8-rien', 'p8-vide', 'p8-mvide', 'p8key', 'bsurl', 'btxt', 'pal-surl', 'pal-txt', 'coulTxt', 'couleur-texte', 'dernierElementNote', 'p8CoulSurl', 'p8CoulTxt']:
    if re.search(re.escape(nom) + r'(?![\w-])', s): sys.exit('ARRÊT : le nom « %s » existe déjà dans le gabarit' % nom)   # n°12 · 40
TOUCHEES = ['lancerRepetition', 'arreterRepetition', 'surligner', 'surligne', 'tout', 'brancherAtelier', 'menuAtelierMur', 'supprimerBloc', 'deplacerBloc', 'couperDiapoIci', 'p8ChangerType']
avant_t = {f: (len(fonction(f).encode()), fonction(f).count('\n') + 1) for f in TOUCHEES}

# 0. le code p8-5c, à part (juste avant blocDe, après celui de p8-5)
un("function blocDe(el){", G.rstrip('\n') + "\nfunction blocDe(el){", 'insertion du code p8-5c')

# ── A. LA RÉPÉTITION, PROPRE (dette n°13 · 9) : rien n'est posé par-dessus l'entête ; l'entête lui-même change de classe (capture T35)
un('<span class="onglets">', '<span class="p8-rep-pre" title="Jouer en avance — répétition : rien n\'est écrit, aucune garde, aucun gel ; « ■ Arrêter » revient à l\'atelier et oublie tout ce qui a été joué">RÉPÉTITION ·</span><span class="onglets">', 'entête : « RÉPÉTITION · » devant les onglets')
un('<span class="heure" id="heure"></span></span>', '<span class="heure" id="heure"></span></span><span class="p8-rep-chr">· répét. <span id="rep-chrono" title="Le chrono de la répétition, depuis son lancement — l\'heure réelle ne bouge pas">00:00</span> <span id="rep-ou"></span></span>', 'entête : le chrono et le repère de la répétition, après l\'horloge')
un("<button class=\"btn fin\" id=\"bfin\" title=\"Termine l'heure : les décisions, le travail à faire, École Directe, la relecture\">Fin de l'heure</button>",
   "<button class=\"btn fin\" id=\"bfin\" title=\"Termine l'heure : les décisions, le travail à faire, École Directe, la relecture\">Fin de l'heure</button><button class=\"btn or p8-rep-stop\" id=\"rep-stop\" title=\"Retour à l'atelier sur cette diapo ; tout ce qui a été dévoilé en répétition est oublié\">■ Arrêter</button>",
   'entête : « ■ Arrêter » à la place de « Fin de l\'heure »')
un("document.body.insertAdjacentHTML('beforeend', `<div class=\"rep-bandeau\" id=\"rep-bandeau\"></div><div class=\"rep-etat\" id=\"rep-etat\"><b>JOUER EN AVANCE — RÉPÉTITION</b><span>rien n'est écrit · aucune garde, aucun gel</span><span id=\"rep-chrono\" title=\"Le chrono de la répétition, depuis son lancement — l'heure réelle ne bouge pas\">00:00</span><span id=\"rep-ou\"></span><button class=\"btn or\" id=\"rep-stop\" title=\"Retour à l'atelier sur cette diapo ; tout ce qui a été dévoilé en répétition est oublié\">■ Arrêter</button></div>`); $('rep-stop').onclick = arreterRepetition;",
   "document.querySelector('.haut').classList.add('p8-rep'); $('rep-chrono').textContent = '00:00'; $('rep-ou').textContent = ''; $('rep-stop').onclick = arreterRepetition; /* (p8-5c) plus rien par-dessus l'entête : il change de classe */",
   'lancerRepetition : l\'entête change de classe')
un("['rep-bandeau', 'rep-etat'].forEach(id => { const x = $(id); if (x) x.remove(); });", "document.querySelector('.haut').classList.remove('p8-rep'); /* (p8-5c) l'entête redevient normal */", 'arreterRepetition : l\'entête redevient normal')

# ── C. LA MISE EN FORME (dette n°13 · 11) : deux boutons ronds à la place des cinq carrés, chacun sa palette (capture T41)
PAL_S = ''.join('<button class="p8-p" data-c="%s" style="background:%s" title="%s"></button>' % (c, h, t) for c, h, t in [('jaune', '#ffe94a', 'Surligner en jaune (Ctrl+H)'), ('vert', '#b6f0c2', 'Surligner en vert'), ('rose', '#ffc9d6', 'Surligner en rose'), ('bleu', '#bcd9ff', 'Surligner en bleu')]) + '<button class="p8-p p8-aucune" data-c="" title="Sans surlignage : retire le surlignage de la sélection">✕</button>'
PAL_T = ''.join('<button class="p8-p" data-c="%s" style="background:%s" title="%s"></button>' % (c, h, t) for c, h, t in [('rouge', '#ff7b6b', 'Texte en rouge'), ('vert', '#7ddc9a', 'Texte en vert'), ('bleu', '#8ab8ff', 'Texte en bleu'), ('or', '#e3b94e', 'Texte en or')]) + '<button class="p8-p p8-aucune" data-c="" title="Sans couleur : le texte reprend sa couleur">✕</button>'
un('<span class="couleurs" title="Surligne le texte sélectionné au tableau (Ctrl+H : jaune)"><button class="coul" data-coul="jaune" style="background:#ffe94a" title="Surligner en jaune (Ctrl+H)"></button><button class="coul" data-coul="vert" style="background:#b6f0c2" title="Surligner en vert"></button><button class="coul" data-coul="rose" style="background:#ffc9d6" title="Surligner en rose"></button><button class="coul" data-coul="bleu" style="background:#bcd9ff" title="Surligner en bleu"></button><button class="coul" data-coul="aucune" title="Retirer le surlignage">✕</button></span>',
   '<span class="p8-mfw"><button class="rond p8-mf" id="bsurl" title="Surligner le texte sélectionné — dans la diapo : au tableau, la classe le voit ; dans tes notes : pour toi seul. Clic : choisir la couleur (✕ retire) · Ctrl+H : jaune"><span class="p8-lettre p8-ab">ab</span><span class="p8-trait" id="bsurl-trait"></span></button><span class="p8-palette" id="pal-surl">' + PAL_S + '</span></span>'
   '<span class="p8-mfw"><button class="rond p8-mf" id="btxt" title="Couleur du texte sélectionné — dans la diapo : au tableau, la classe le voit ; dans tes notes : pour toi seul. Clic : choisir la couleur (✕ retire)"><span class="p8-lettre">A</span><span class="p8-trait" id="btxt-trait"></span></button><span class="p8-palette" id="pal-txt">' + PAL_T + '</span></span>',
   'la barre : « ab » et « A » à la place des cinq carrés')
un("document.querySelectorAll('.couleurs [data-coul]').forEach(b => b.onclick = () => surligner(b.dataset.coul === 'aucune' ? null : b.dataset.coul));",
   "/* (p8-5c) les cinq carrés sont remplacés par « ab » et « A » et leurs palettes (p8-5c.js) */", 'les branchements des carrés, retirés')
un("if (ev.ctrlKey && ev.key.toLowerCase() === 'h') { ev.preventDefault(); surligner('jaune'); return; }", "if (ev.ctrlKey && ev.key.toLowerCase() === 'h') { ev.preventDefault(); p8Former('surl', 'jaune'); return; } /* (p8-5c) le jaune direct, dans la diapo ou dans les notes */", 'Ctrl+H : le jaune direct, aux deux cibles')
un("const li = r.startContainer.parentElement && r.startContainer.parentElement.closest('#mur [data-p]'); if (!li) return;",
   "const li = r.startContainer.parentElement && r.startContainer.parentElement.closest('#mur [data-p]'); if (!li) { p8Dire('sélectionne d\\'abord le texte à surligner — dans la diapo ou dans tes notes'); return; } /* (p8-5c) jamais le silence */",
   'surligner : une sélection ailleurs le dit')
un("function surligne(htmlTexte, p, et){ (et.surl || []).filter(x => x.p === p).forEach(x => { const e2 = esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = htmlTexte.replace(e2, `<mark style=\"background:${COULEURS[x.couleur] || '#fff1a8'}\">${e2}</mark>`); }); return htmlTexte; }",
   "function surligne(htmlTexte, p, et){ (et.surl || []).filter(x => x.p === p).forEach(x => { const e2 = esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = htmlTexte.replace(e2, `<mark style=\"background:${COULEURS[x.couleur] || '#fff1a8'}\">${e2}</mark>`); }); /* (p8-5c) la couleur du texte : la donnée garde le nom, le rendu choisit la teinte du tableau (fond crème) */ const TX = { rouge: '#c0392b', vert: '#1e7d45', bleu: '#1f5fbf', or: '#b8860b' }; (et.coulTxt || []).filter(x => x.p === p).forEach(x => { const e2 = esc(x.txt); if (e2 && htmlTexte.includes(e2)) htmlTexte = htmlTexte.replace(e2, `<span class=\"p8-ct\" data-coul=\"${x.couleur}\" style=\"color:${TX[x.couleur] || 'inherit'}\">${e2}</span>`); }); return htmlTexte; }",
   'surligne : la couleur du texte au rendu')
un("surl: (d.surl || []).slice(),", "surl: (d.surl || []).slice(), coulTxt: (d.coulTxt || []).slice(),", 'l\'état de la diapo : la couleur du texte')

# ── B. LES NOTES DE PRÉSENTATEUR (dette n°13 · 10)
un("$('notesd').innerHTML = DATA.notes[cle()] ? esc(DATA.notes[cle()]) : '<span style=\"color:var(--sourd)\">—</span>';", "p8RendreNotes(); /* (p8-5c) les notes par paragraphe, accrochées aux éléments */", 'tout : le panneau des notes')
# les ancres suivent leur élément quand la structure change ; un élément supprimé rend sa note ⌂
un("if (act === 'e-dupliquer') b.el.splice(ei + 1, 0, b.el[ei]); if (act === 'e-monter') { const t = b.el[ei - 1]; b.el[ei - 1] = b.el[ei]; b.el[ei] = t; } if (act === 'e-descendre') { const t = b.el[ei + 1]; b.el[ei + 1] = b.el[ei]; b.el[ei] = t; } if (act === 'e-supprimer') b.el.splice(ei, 1);",
   "if (act === 'e-dupliquer') { b.el.splice(ei + 1, 0, b.el[ei]); p8NotesElement(S.di, bi, ei + 1, 'inserer'); } if (act === 'e-monter') { const t = b.el[ei - 1]; b.el[ei - 1] = b.el[ei]; b.el[ei] = t; p8NotesElement(S.di, bi, ei, 'monter'); } if (act === 'e-descendre') { const t = b.el[ei + 1]; b.el[ei + 1] = b.el[ei]; b.el[ei] = t; p8NotesElement(S.di, bi, ei, 'descendre'); } if (act === 'e-supprimer') { b.el.splice(ei, 1); p8NotesElement(S.di, bi, ei, 'supprimer'); } /* (p8-5c) les notes suivent leur élément */",
   'menuAtelierMur : les notes suivent les éléments')
un("bloc.el.splice(b.ei + 1, 0, '');", "bloc.el.splice(b.ei + 1, 0, ''); p8NotesElement(S.di, b.bi, b.ei + 1, 'inserer'); /* (p8-5c) */", 'brancherAtelier : Entrée, les notes suivent')
un("bloc.el.splice(b.ei, 1);", "bloc.el.splice(b.ei, 1); p8NotesElement(S.di, b.bi, b.ei, 'supprimer'); /* (p8-5c) */", 'brancherAtelier : Échap, les notes suivent')
un("e.blocs.splice(bi, 1); marquerModif({ di: S.di, supprime: bi, reps }); tout(); }", "e.blocs.splice(bi, 1); p8NotesBloc(S.di, bi, 'supprimer'); /* (p8-5c) */ marquerModif({ di: S.di, supprime: bi, reps }); tout(); }", 'supprimerBloc : les notes du bloc reviennent à ⌂')
un("const t = e.blocs[bi]; e.blocs[bi] = e.blocs[j]; e.blocs[j] = t; marquerModif({ di: S.di, bloc: bi, vers: j });", "const t = e.blocs[bi]; e.blocs[bi] = e.blocs[j]; e.blocs[j] = t; p8NotesBloc(S.di, bi, 'echanger', j); /* (p8-5c) */ marquerModif({ di: S.di, bloc: bi, vers: j });", 'deplacerBloc : les notes suivent')
un("E.splice(i + 1, 0, suite); apresTrame({ di: i, coupe: bi, suite: suite.eid });", "E.splice(i + 1, 0, suite); p8NotesCouper(i, bi, suite.eid); /* (p8-5c) chaque paragraphe suit son élément */ apresTrame({ di: i, coupe: bi, suite: suite.eid });", 'couperDiapoIci : les notes suivent dans la diapo « (suite) »')
un("if (act === 'b-dupliquer') { e.blocs.splice(bi + 1, 0, cloneBloc(b));", "if (act === 'b-dupliquer') { e.blocs.splice(bi + 1, 0, cloneBloc(b)); p8NotesBloc(S.di, bi + 1, 'inserer', 1); /* (p8-5c) */", 'menuAtelierMur : dupliquer un bloc, les notes suivent')
un("if (act === 'b-couper') { S.pressePapiers = JSON.parse(JSON.stringify(b)); e.blocs.splice(bi, 1);", "if (act === 'b-couper') { S.pressePapiers = JSON.parse(JSON.stringify(b)); e.blocs.splice(bi, 1); p8NotesBloc(S.di, bi, 'supprimer'); /* (p8-5c) */", 'menuAtelierMur : couper un bloc, ses notes reviennent à ⌂')
un("if (act === 'b-coller') { e.blocs.splice(bi + 1, 0, cloneBloc(S.pressePapiers));", "if (act === 'b-coller') { e.blocs.splice(bi + 1, 0, cloneBloc(S.pressePapiers)); p8NotesBloc(S.di, bi + 1, 'inserer', 1); /* (p8-5c) */", 'menuAtelierMur : coller un bloc, les notes suivent')
un("if (t === 'schema' && !seul) { e.blocs.splice(bi, 1);", "if (t === 'schema' && !seul) { e.blocs.splice(bi, 1); p8NotesBloc(i, bi, 'supprimer'); /* (p8-5c) */", 'p8ChangerType : le schéma part, ses notes reviennent à ⌂')
un("e.blocs.splice(bi, 1, ...nv);", "e.blocs.splice(bi, 1, ...nv); p8NotesBloc(i, bi, 'type', nv.length); /* (p8-5c) les lignes changent de nature : les notes du bloc reviennent à ⌂ */", 'p8ChangerType : les notes suivent')

# ── le style (classes préfixées, cherchées avant d'être écrites ; jamais de display en ligne : tout passe par la classe de .haut)
CSS = ("/* (p8-5c) A · la répétition : l'entête change de classe (capture T35) */\n"
       ".haut .p8-rep-pre,.haut .p8-rep-chr,.haut .p8-rep-stop{display:none}.haut.p8-rep{background:#241c10;border-bottom:1.6px solid #c99a4e}"
       ".haut.p8-rep .p8-rep-pre{display:inline;white-space:nowrap;color:#c99a4e;font-weight:700;letter-spacing:.03em;margin-right:10px;align-self:center}"
       ".haut.p8-rep .p8-rep-chr{display:inline;white-space:nowrap;margin-left:8px;color:#c99a4e}.haut.p8-rep #bfin,.haut.p8-rep #hou,.haut.p8-rep #chr{display:none}.haut.p8-rep .p8-rep-stop{display:inline-block}\n"
       "/* (p8-5c) B · les notes de présentateur (capture T38) */\n"
       ".notes #notesd{padding-left:18px}.notes .p8-mn{position:relative;padding:5px 0 5px 36px;color:var(--sourd);line-height:1.45;font-size:.95rem}"
       ".notes .p8-mn .p8-k{position:absolute;left:0;top:6px;width:24px;height:24px;border-radius:50%;border:1px solid var(--bord);font-size:.74rem;display:flex;align-items:center;justify-content:center;color:var(--sourd);background:transparent;padding:0;font-family:inherit}"
       ".notes .p8-mn button.p8-k{cursor:pointer}.notes .p8-mn.p8-fait{opacity:.5}.notes .p8-mn.p8-vif{color:#f1e7d2;font-size:1.08rem}"
       ".notes .p8-mn.p8-vif .p8-k{border-color:#c99a4e;color:#c99a4e;background:#2a2114;font-weight:700}"
       ".notes .p8-mn.p8-vif::before{content:'';position:absolute;left:-12px;top:4px;bottom:4px;width:3px;background:#c99a4e;border-radius:2px}"
       ".notes .p8-mt{outline:none;min-height:1.2em}.notes .p8-mt[contenteditable]:focus{color:#f1e7d2}.notes .p8-mt.p8-vide:empty::before{content:'✎ écris ici tes notes pour cette diapo — Entrée : un nouveau paragraphe';color:var(--sourd);font-style:italic}"
       ".notes .p8-mn.p8-mvide{display:none}.notes .p8-rien{color:var(--sourd)}.notes mark{color:#1f1a14;border-radius:2px;padding:0 2px}"
       ".notes mark[data-coul=jaune]{background:#ffe94a}.notes mark[data-coul=vert]{background:#b6f0c2}.notes mark[data-coul=rose]{background:#ffc9d6}.notes mark[data-coul=bleu]{background:#bcd9ff}"
       ".notes span[data-coul]{font-weight:600}.notes span[data-coul=rouge]{color:#ff7b6b}.notes span[data-coul=vert]{color:#7ddc9a}.notes span[data-coul=bleu]{color:#8ab8ff}.notes span[data-coul=or]{color:#e3b94e}\n"
       "/* (p8-5c) C · la mise en forme, comme dans Word (capture T41) */\n"
       ".p8-mfw{position:relative;display:inline-flex}.rond.p8-mf{position:relative;flex-direction:column;gap:2px;font-family:\"EB Garamond\",Garamond,serif}"
       ".rond.p8-mf .p8-lettre{font-weight:800;font-size:1.05rem;line-height:1}.rond.p8-mf .p8-lettre.p8-ab{background:#ffe94a;color:#1f1a14;border-radius:2px;padding:0 3px;font-size:.78rem;font-weight:700}"
       ".rond.p8-mf .p8-trait{width:18px;height:4px;border-radius:2px}"
       ".p8-palette{display:none;position:absolute;left:50%;top:46px;transform:translateX(-50%);background:var(--carte2);border:1px solid var(--bord2);border-radius:8px;padding:6px;gap:6px;align-items:center;z-index:20;box-shadow:0 6px 18px rgba(0,0,0,.45)}"
       ".p8-palette.on{display:flex}.p8-palette .p8-p{width:24px;height:24px;border-radius:5px;border:1px solid var(--bord2);cursor:pointer;padding:0}"
       ".p8-palette .p8-p.p8-aucune{background:var(--carte2);color:var(--texte2);font-size:.8rem;display:flex;align-items:center;justify-content:center}"
       ".mur .p8-ct{font-weight:600}\n")
un(".outils{display:flex;", CSS + ".outils{display:flex;", 'le style : répétition, notes, mise en forme')

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
for f in TOUCHEES:
    a = fonction(f); print('%s : %d o / %d lignes → %d o / %d lignes' % (f, avant_t[f][0], avant_t[f][1], len(a.encode()), a.count('\n') + 1))
print('p8-5c.js : %d o, %d fonctions (%s)' % (len(G.encode()), len(re.findall(r'^function ', G, re.M)), ', '.join('%s %d o' % (n, len(fonction(n).encode())) for n in re.findall(r'function (p8\w+)', G))))
