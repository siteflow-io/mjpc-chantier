# LES LIGNES DE LA MAQUETTE DANS MA PLAGE (1482-1638), rebranchées sur la vraie heure — où que la poussée E1-a les ait posées.
# usage : python3 brancher-maquette.py [--ecrire] <fichier> [<fichier>…]     (les modules dr/*.js, ou une copie de la maquette)
# Chaque changement est un remplacement EXACT d'un passage de la maquette, qui doit se trouver une fois et une seule dans l'ensemble
# des fichiers donnés ; sinon il est dit (« absent » / « ambigu ») et rien n'est fait pour lui. Chaque passage remplacé garde, en
# commentaire, ce qu'il faisait avant (plan §7.1). Un passage déjà rebranché (« E2 : ») n'est pas retouché.
import sys
ECRIRE = '--ecrire' in sys.argv; FICHIERS = [f for f in sys.argv[1:] if f != '--ecrire']
textes = {f: open(f, encoding='utf-8').read() for f in FICHIERS}; rapport = []

def changer(nom, avant, apres):
    ou = [f for f, t in textes.items() if t.count(avant) == 1]; n = sum(t.count(avant) for t in textes.values())
    if n == 0: rapport.append('%-28s %s' % (nom, 'déjà rebranché' if any(apres[:60] in t for t in textes.values()) else 'ABSENT')); return
    if n > 1 or len(ou) != 1: rapport.append('%-28s AMBIGU (%d occurrences)' % (nom, n)); return
    textes[ou[0]] = textes[ou[0]].replace(avant, apres); rapport.append('%-28s rebranché dans %s' % (nom, ou[0].split('/')[-1]))

# 1 · lancerHeure : l'horloge réelle et l'entête de l'heure réelle
changer('lancerHeure · l\'horloge', "T0 = Date.now(); S.ecoule = 0; S.close = false;",
  "T0 = (HEURES_SIM[h] && HEURES_SIM[h].base) || Date.now(); /* E2 : now() = l'horloge réelle (la base est le début du créneau) — avant : T0 = Date.now() */ S.ecoule = 0; S.close = false;")
changer('lancerHeure · l\'entête', "$('hou').textContent = `${HEURES_SIM[h].jour} ${HEURES_SIM[h].debut}-${HEURES_SIM[h].fin} · heure ${h} sur 2 · ${seance().titre}`; voir('pilotage'); tout(); }",
  "$('hou').textContent = dr_entete(h); /* E2 : la classe, le créneau, l'heure n/N réels — avant : HEURES_SIM, « sur 2 » */ voir('pilotage'); tout(); }")
# 2 · la clôture (étape 7) : les écritures d'`atDrCloreFin`, puis la relecture
changer('clôture · les écritures', "journal('cloture', { bilanAtteste: !!S.bilanCoche }); S.close = true; S.closes = S.closes || {}; S.closes[S.heure] = now();",
  "journal('cloture', { bilanAtteste: !!S.bilanCoche }); S.close = true; S.closes = S.closes || {}; S.closes[S.heure] = now(); try { dr_cloreFin(); } catch (e) {} /* E2 : H clos, finReel, cours_actif nul, le journal et l'état (atDrCloreFin) */")
changer('clôture · après', "if (S.heure < 2) { edt(); $('ecran-edt').classList.add('on'); } else voir('relecture'); };",
  "voir('relecture'); }; /* E2 : la clôture amène à la relecture (C1 11.2) — avant : l'EDT simulé pour l'heure 2 */")
# 3 · la dernière heure de la séance : N heures (la case de l'EDT), plus 2 en dur
changer('ouvrirFin · dernière heure', "const derniere = S.heure === 2;",
  "const derniere = S.heure >= ((dr_heureJouee(S.heure) || {}).sur || 2); /* E2 : la séance a N heures (edtHeuresPour) — avant : S.heure === 2 */")
changer('clotureHtml · le bilan', "h += (S.heure === 2 ?", "h += (S.heure >= ((dr_heureJouee(S.heure) || {}).sur || 2) ? /* E2 — avant : S.heure === 2 */")
changer('ouverture · N heures', "heure ${h} sur 2</h2>", "heure ${h} sur ${(dr_heureJouee(S.heure) || {}).sur || 2}</h2>")
# 4 · l'ouverture de l'heure suivante lance par `dr_lancer` (les écritures du site), plus par `lancerHeure` seul
changer('ouverture · lancer', "$('o-lancer').onclick = () => { DECALAGE = 0; S.paliers = {}; S.t5 = false; S.palier = null; if (!S.close) return; lancerHeure(h); }; }",
  "$('o-lancer').onclick = () => { DECALAGE = 0; S.paliers = {}; S.t5 = false; S.palier = null; if (!S.close) return; dr_lancerSuite(h); }; } /* E2 : la classe, le créneau, le hub — avant : lancerHeure(h) seul */")

# 5 · la porte : l'EDT simulé tombe, la porte réelle reste (audit F6) — la classe et le créneau proposés, l'heure n/N, R8
EDT_NEUF = r'''function edt(){ /* E2 : la porte réelle du Pilotage (audit F6) — avant : deux heures simulées en dur (HEURES_SIM, « 3E Charles de Gaulle », « sur 2 »).
     Lancer en un clic avec la classe et le créneau proposés (ou ceux que Paul choisit ici) ; l'EDT reste la porte normale. */
  if (typeof dr_lancer !== 'function') { setTimeout(edt, 0); return; }   /* le démarrage (socle) passe avant le chargement de dr-classe.js */
  const c = $('edt-cases'); const niv = (AT.edChap || {}).level; const cls = (function(){ try { return _lvlClasses(niv) || []; } catch (e) { return []; } })();
  const sl0 = ($('dr-porte-classe') || {}).value || dr_classeProposee(), cr0 = ($('dr-porte-creneau') || {}).value || dr_creneauPropose();
  const h = dr_heureProposee(sl0, cr0), N = dr_nbHeures(cr0), deb = dr_debutPropose(cr0), utile = dr_tempsUtile(cr0, deb), fin = cr0.split('-')[1];
  const enCours = S.lancee && !S.close; const d = new Date(); const jour = DR_JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + DR_MOIS[d.getMonth()];
  c.innerHTML = `<div class="carte" style="background:var(--carte);border:1px solid var(--bord);border-radius:10px;padding:14px 16px;min-width:320px"><div style="color:var(--sourd);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase">${esc(jour)}</div>`
    + `<div style="font-size:1.1rem;margin:6px 0;display:flex;gap:8px;flex-wrap:wrap"><select id="dr-porte-creneau" title="Le créneau de l'heure : sa fin est fixe, elle vient de l'emploi du temps">${(typeof AT_EDT !== 'undefined' ? AT_EDT : []).map(x => `<option ${x === cr0 ? 'selected' : ''}>${x}</option>`).join('')}</select><select id="dr-porte-classe" title="La classe : ses élèves sont ceux du panneau des classes">${cls.map(x => `<option value="${esc(x.slug)}" ${x.slug === sl0 ? 'selected' : ''}>${esc(x.nom || x.slug)}</option>`).join('')}</select></div>`
    + `<div style="color:var(--texte2)">heure ${h} sur ${N} · ${esc(seance().titre || seance().title || '')}</div>`
    + `<div style="color:${utile > 0 ? 'var(--texte2)' : 'var(--rouge)'};font-size:.85rem;margin-top:4px" id="dr-porte-utile">${utile > 0 ? `<b>${utile} min utiles</b> (début ${deb}, fin ${fin} − 5 min d’agenda)` : `ce début (${deb}) ne laisse aucun temps utile avant ${fin} — la séance se lancera quand même`}</div>`
    + `<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">${enCours ? '<button class="btn or" data-reprendre="1" title="L\'heure est en cours : revenir au pilotage, là où la classe en est">Reprendre le cours</button>' : `<button class="btn" data-atelier="${h}" title="Ouvre l'atelier sur cette séance : tu prépares, rien n'est joué ni projeté">Éditer dans l'atelier</button><button class="btn or" data-lancer="1" title="Lance l'heure avec cette classe et ce créneau : le chrono démarre, tout ce qui se passe s'enregistre pour la classe, le tableau suit">▶ Lancer</button>`}<button class="btn" id="dr-porte-edt" title="Ton emploi du temps : la case de l'heure lance avec la bonne classe, le bon créneau et la bonne heure de la séance">📅 Emploi du temps</button></div></div>`;
  ['dr-porte-classe', 'dr-porte-creneau'].forEach(id => { const x = $(id); if (x) x.onchange = () => edt(); });
  const e2 = $('dr-porte-edt'); if (e2) e2.onclick = () => { $('ecran-edt').classList.remove('on'); try { edtOuvrir(); } catch (e) {} };
  c.querySelectorAll('[data-atelier]').forEach(b => b.onclick = () => { S.heure = h; try { S.di = ordreHeure(h)[0] || 0; } catch (e) {} S.page = null; $('ecran-edt').classList.remove('on'); voir('atelier'); });
  c.querySelectorAll('[data-lancer]').forEach(b => b.onclick = () => { const sl = ($('dr-porte-classe') || {}).value || sl0, cr = ($('dr-porte-creneau') || {}).value || cr0; dr_lancer(sl, cr, dr_debutPropose(cr), dr_heureProposee(sl, cr)); });
  c.querySelectorAll('[data-reprendre]').forEach(b => b.onclick = () => { $('ecran-edt').classList.remove('on'); tout(); }); }'''
tous = [(f, t) for f, t in textes.items() if 'function edt(){' in t]
if len(tous) == 1:
    f, t = tous[0]; i = t.index('function edt(){'); j = t.find("\n$('ong-pilotage')", i)
    if 'E2 : la porte réelle' in t[i:i+200]: rapport.append('%-28s déjà rebranché' % 'edt · la porte')
    elif j < 0: rapport.append('%-28s FIN INTROUVABLE' % 'edt · la porte')
    else: textes[f] = t[:i] + EDT_NEUF + t[j:]; rapport.append('%-28s rebranché dans %s' % ('edt · la porte', f.split('/')[-1]))
else: rapport.append('%-28s %s' % ('edt · la porte', 'ABSENT' if not tous else 'AMBIGU'))

print('\n'.join(rapport))
if ECRIRE:
    for f, t in textes.items(): open(f, 'w', encoding='utf-8').write(t)
    print('— écrit')
else: print('— rien écrit (ajouter --ecrire)')
