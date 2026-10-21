import sys, re
src = '/tmp/claude-0/sp/recit-maquette.js'
s = open(src, encoding='utf-8').read()
n_total = 0
def R(old, new, count=1):
    global s, n_total
    c = s.count(old)
    if count == 'all':
        assert c >= 1, ('absent', old[:80])
    else:
        assert c == count, (c, old[:100])
    s = s.replace(old, new); n_total += 1

# 1 · les substitutions de simulation (tête du module : la table)
R('HEURES_SIM[hs[idx + 1]]', 'dr_recitHeure(hs[idx + 1])')
s, k = re.subn(r'HEURES_SIM\[([A-Za-z.]+)\]', r'dr_recitHeure(\1)', s); assert k >= 8, k
assert 'HEURES_SIM' not in s
R('DATA.classe.prochaines', 'dr_recitProchaines()', 'all')
R('DATA.classe.nom', 'dr_recitClasseNom()', 'all')
R('DATA.chapitre', 'dr_recitChapitre()', 'all')
R('DATA.activites[String(S.si)]', 'dr_recitActivites()', 'all')
R('DATA.taxo', 'dr_recitTaxo()', 'all')
R('(DATA.documents[String(S.si)] || [])', 'dr_recitDocuments()', 'all')
R('DATA.documents[String(S.si)] || []', 'dr_recitDocuments()', 'all')
assert 'DATA.' not in s, [l for l in s.split('\n') if 'DATA.' in l][:3]
R('seance().titre', 'dr_recitSeanceTitre()', 'all')

# 2 · les heures jouées : lues dans J (la maquette en simulait deux)
R("function heuresJouees(){ return [1, 2].filter(h => J.some(x => x.h === h && x.type === 'diapo')); }",
  "function heuresJouees(){ /* (E4) lisait [1, 2].filter(…) : les deux heures simulées ; le site en a autant que l'EDT en donne */ return [...new Set(J.filter(x => x.type === 'diapo' && x.h > 0).map(x => x.h))].sort((a, b) => a - b); }")

# 3 · relecture() : le récit relu au hub d'abord ; la face Papier par heure (proposition 96) ; brancherPapier
R("function relecture(){ S.face = S.face || 'recit';",
  "function relecture(){ { const C = dr_recitChemin(); if (C && !DR_RECIT_CHARGE[C] && typeof dr_lire === 'function') { dr_recitCharger(() => relecture()); return; } } /* (E4) le récit relu, ma version, la copie ED : lus au hub avant de composer (C/recit) */ S.face = S.face || 'recit';")
R("""Ce qui s'est passé · heure ${h}</button>`; });""",
  """Ce qui s'est passé · heure ${h}</button><button class="ong ${S.face === 'papier' && S.faceH === h ? 'on' : ''}" data-f="papier" data-h="${h}" title="Le papier du cahier de l'heure ${h} : le récit relu (ma version s'il y en a une), l'entête, le travail à faire, puis les fiches à coller — prêt à imprimer">Papier · heure ${h}</button>`; }); /* (E4) + la face Papier (proposition 96, cadrage 2 §1.9) */""")
R("""`Relecture — ${dr_recitClasseNom()} · heure ${S.faceH} (${sim.jour}) · ${dr_recitSeanceTitre()}`;""",
  """S.face === 'papier' ? `Papier — ${dr_recitClasseNom()} · heure ${S.faceH} (${sim.jour}) · ${dr_recitSeanceTitre()}` : `Relecture — ${dr_recitClasseNom()} · heure ${S.faceH} (${sim.jour}) · ${dr_recitSeanceTitre()}`;""")
R("""S.face === 'passe' ? passeHtml(fin, S.faceH) : recitSeanceHtml(); if (S.face === 'chapitre') brancherChapitre(); }""",
  """S.face === 'passe' ? passeHtml(fin, S.faceH) : S.face === 'papier' ? papierHtml(S.faceH) : recitSeanceHtml(); if (S.face === 'chapitre') brancherChapitre(); if (S.face === 'papier') brancherPapier(); else dr_papierRetirer(); }""")

# 4 · la copie pour École Directe en HTML propre (R13) — le texte copié reste celui de la maquette
R("""const rc = $('r-copie-contenu'); if (rc) rc.onclick = () => { S.copieED = S.copieED || {}; S.copieED[S.heure] = Object.assign(S.copieED[S.heure] || {}, { t: now(), contenu: true }); journal('copie-ed', { quoi: 'contenu' }); copier(document.querySelector('.recit').innerText.replace(/\\n\\s*Pour la prochaine séance[\\s\\S]*$/, ''), 'copié : le contenu de séance'); };""",
  """const rc = $('r-copie-contenu'); if (rc) rc.onclick = () => { S.copieED = S.copieED || {}; S.copieED[S.heure] = Object.assign(S.copieED[S.heure] || {}, { t: now(), contenu: true }); journal('copie-ed', { quoi: 'contenu' }); const rec0 = document.querySelector('#rel .recit') || document.querySelector('.recit'); /* (E4 · R13) lisait copier(innerText) : le texte seul */ dr_recitCopierED(dr_recitContenuED(rec0), rec0.innerText.replace(/\\n\\s*Pour la prochaine séance[\\s\\S]*$/, ''), 'copié : le contenu de séance'); };""")
R("""journal('copie-ed', { quoi: 'travail' }); copier(texteTravail() || '(rien à faire)', 'copié : le travail à faire'); };""",
  """journal('copie-ed', { quoi: 'travail' }); const tt = texteTravail() || '(rien à faire)'; /* (E4 · R13) lisait copier(texte) */ dr_recitCopierED('<p>' + esc(tt).replace(/\\n/g, '<br>') + '</p>', tt, 'copié : le travail à faire'); };""")
R("""if (b) b.onclick = () => { const txt = document.querySelector('.recit').innerText; const dire = m => { const z = $('r-copie-etat'); if (z) z.textContent = m; }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => dire('copié : la séance')).catch(() => dire('la copie automatique a échoué — sélectionne le texte et copie-le')); };""",
  """if (b) b.onclick = () => { const rec0 = document.querySelector('#rel .recit') || document.querySelector('.recit'); /* (E4 · R13) lisait writeText(innerText) */ dr_recitCopierED(rec0.innerHTML, rec0.innerText, 'copié : la séance'); };""")
R("""copierTexte(txt || '(rien à faire)', 'copié : le travail à faire de l\\'heure ' + h);""",
  """{ const tt = txt || '(rien à faire)'; /* (E4 · R13) lisait copierTexte(texte) */ dr_recitCopierED('<p>' + esc(tt).replace(/\\n/g, '<br>') + '</p>', tt, 'copié : le travail à faire de l\\'heure ' + h); }""")

# 5 · la fiche dans le récit : le rappel (R2) et les citations (R15), le bilan « repris une fiche déjà vue »
R("""if (b.t === 'fiche') { nbFiches++; let s2 = 'on a travaillé la fiche <b>' + esc(b.txt) + '</b>'; if (b.el && b.el[0]) s2 += ' : ' + esc(personne(b.el[0])); phrases.push(s2); }""",
  """if (b.t === 'fiche') { nbFiches++; /* (E4 · R2, R15) lisait seulement « on a travaillé la fiche X : <première ligne> » — l'ancien moteur (L1289-1312) disait le rappel et les citations */ const rap = dr_recitRappel(b); const cit = dr_recitCitations(h, di, bi, e); let s2 = rap != null ? 'on a repris la fiche <b>' + esc(b.txt || b.titre || '') + '</b>' + (rap ? ' — ' + esc(rap) : '') : 'on a travaillé la fiche <b>' + esc(b.txt || b.titre || '') + '</b>'; if (rap != null) nbRappels++; const sur = cit.sur.filter(c => !dejaCite[c] && (dejaCite[c] = 1)), cop = cit.cop.filter(c => !dejaCite[c] && (dejaCite[c] = 1)); if (sur.length) s2 += ', où on a surligné ' + sur.slice(0, 3).map(c => '« ' + esc(c) + ' »').join(' ; '); if (cop.length) s2 += '. On a recopié dans le cahier : ' + cop.slice(0, 3).map(c => '« ' + esc(c) + ' »').join(' ; '); if (!sur.length && !cop.length && rap == null && b.el && b.el[0]) s2 += ' : ' + esc(personne(typeof b.el[0] === 'string' ? b.el[0] : (b.el[0].txt || ''))); phrases.push(s2); }""")
R("let rang = 0, nbFiches = 0, nbQuestions = 0, nbImages = 0;", "let rang = 0, nbFiches = 0, nbQuestions = 0, nbImages = 0, nbRappels = 0; /* (E4 · R2) + nbRappels */")
R("""if (nbFiches) bits.push(nbFiches > 1 ? 'travaillé ' + nbFiches + ' fiches' : 'travaillé une fiche'); if (nbImages) bits.push(nbImages > 1 ? 'observé ' + nbImages + ' documents' : 'observé un document'); if (nbQuestions) bits.push(nbQuestions > 1 ? 'répondu à ' + nbQuestions + ' questions' : 'répondu à une question');
    const tourn""",
  """if (nbFiches) bits.push(nbFiches > 1 ? 'travaillé ' + nbFiches + ' fiches' : 'travaillé une fiche'); if (nbRappels) bits.push(nbRappels > 1 ? 'repris ' + nbRappels + ' fiches déjà vues' : 'repris une fiche déjà vue'); /* (E4 · R2) l'ancien bilan, L1357 */ if (nbImages) bits.push(nbImages > 1 ? 'observé ' + nbImages + ' documents' : 'observé un document'); if (nbQuestions) bits.push(nbQuestions > 1 ? 'répondu à ' + nbQuestions + ' questions' : 'répondu à une question');
    const tourn""")

# 6 · docHtml : le document par référence (Structure), la maquette simulait
R("""function docHtml(d){ const doc = dr_recitDocuments().find(x => x.id === d.id); if (!doc) return '';""",
  """function docHtml(d){ const doc = dr_recitDocuments().find(x => x.id === d.id); if (!doc) return ''; if (doc.reference) return dr_docHtmlRef(doc); /* (E4) la maquette simulait les pages (ci-dessous) ; le site rend l'item de Structure par référence */""")

# 7 · le panneau des documents : les items de la séance
R("""const l = dr_recitDocuments();
  $('fdocs-l').innerHTML = l.map(d => `<div class="c" style="padding:6px 0;border-top:1px solid var(--bord)"><b>${esc(d.titre)}</b> <span style="color:var(--sourd)">${d.type === 'pdf' ? d.pages + ' pages' : d.etapes + ' étapes'}</span>""",
  """const l = dr_recitDocuments(); if (l.length && l[0].reference) { dr_docsPanneau(l); return; } /* (E4) les items de Structure ; ci-dessous, la simulation de la maquette */
  $('fdocs-l').innerHTML = l.map(d => `<div class="c" style="padding:6px 0;border-top:1px solid var(--bord)"><b>${esc(d.titre)}</b> <span style="color:var(--sourd)">${d.type === 'pdf' ? d.pages + ' pages' : d.etapes + ' étapes'}</span>""")

# 8 · la dette 13 · 8 : le récit raconte ce que la classe a vu dans SA copie (S.copie[h][eid][bid], p8EcrireCopie), pas la trame
R("""    g.dis.forEach(di => { const e = seance().ecrans[di]; const vu = vuJ(h, di).fin;""",
  """    g.dis.forEach(di => { const e = dr_recitEcranVu(h, seance().ecrans[di]); /* (E4 · 13 · 8) lisait seance().ecrans[di] : la trame, sans ce que la classe a corrigé */ const vu = vuJ(h, di).fin;""")
R("""  const devoirs = []; ordre.forEach(di => { const e = seance().ecrans[di]; const vu = vuJ(h, di).fin;""",
  """  const devoirs = []; ordre.forEach(di => { const e = dr_recitEcranVu(h, seance().ecrans[di]); /* (E4 · 13 · 8) */ const vu = vuJ(h, di).fin;""")
open('/tmp/claude-0/sp/recit-patche.js', 'w', encoding='utf-8').write(s)
print('ok', n_total)
