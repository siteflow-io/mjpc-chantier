# Dérive redaction.html de redaction_dugain_v3.html (production) — UNE FOIS, au départ (poussée 3) ; ensuite redaction.html est la source.
# Chaque remplacement est exact et compté (il doit trouver son texte une seule fois, sinon le script échoue) : la trace de ce qui a changé.
# usage : python3 deriver.py <redaction_dugain_v3.html> <redaction.html>
import sys, re
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf8').read()
n_ok = 0
def r(a, b, n=1):
    global s, n_ok
    k = s.count(a)
    if k != n: sys.exit('ÉCHEC (%d fois, %d attendu) : %s' % (k, n, a[:90]))
    s = s.replace(a, b); n_ok += 1

# 1 · la grille sort du code : le premier <script> (GRILLE, SOUS_*, CONSIGNES : l. 1384-2742) est remplacé par les porteurs et appliquerSujet
i = s.index('<script>\n// =====================================================================\n// GRILLE DNB DUGAIN')
j = s.index('</script>', i) + len('</script>')
bloc = s[i:j]
m_conn = re.search(r'const CONNECTEURS = \{[\s\S]*?\n\};', bloc).group(0)
m_coul = re.search(r'// Couleurs par échelon[\s\S]*?\nconst ECHELON_COULEUR = \{[\s\S]*?\n\};', bloc).group(0)
s = s[:i] + '''<script>
// =====================================================================
// LE SUJET — une donnée du site (R1) : /redactions/<id>/config
// =====================================================================
// Le code ne connaît aucun sujet, aucune œuvre, aucune classe. appliquerSujet(cfg) remplit les porteurs
// que le moteur lit depuis toujours (GRILLE[variante], les sous-descripteurs, les consignes) à partir de la donnée
// (format « mjpc-redaction-1 », voir MANDATS/REDACTION-UNIVERSELLE/PROMPT-REDACTION.md).
// {prenom} est remplacé à l'affichage. Tutoiement systématique.
// =====================================================================
let SUJET = null;               // la donnée telle qu'au hub
const GRILLE = {};              // GRILLE[variante] = { label, total, criteres[{ id, titre, pts_max, indicateurs[{ id, libelle, poids, descripteurs }] }] }
const SOUS_PAR_VARIANTE = {};   // [variante][critère][indicateur][échelon][sous] = { sans, avec }
const CONSIGNES_PAR_VARIANTE = {}; // [variante][critère][échelon]
function appliquerSujet(cfg) {
  SUJET = cfg;
  [GRILLE, SOUS_PAR_VARIANTE, CONSIGNES_PAR_VARIANTE].forEach(o => Object.keys(o).forEach(k => delete o[k]));
  (cfg.variantes || []).forEach(v => {
    GRILLE[v.id] = { label: v.libelle, total: v.total, criteres: (v.criteres || []).map(cr => ({ id: cr.id, titre: cr.titre, pts_max: cr.points,
      indicateurs: (cr.indicateurs || []).map(ind => ({ id: ind.id, libelle: ind.libelle, poids: ind.poids, descripteurs: ind.descripteurs })) })) };
    SOUS_PAR_VARIANTE[v.id] = {}; CONSIGNES_PAR_VARIANTE[v.id] = {};
    (v.criteres || []).forEach(cr => { SOUS_PAR_VARIANTE[v.id][cr.id] = {}; CONSIGNES_PAR_VARIANTE[v.id][cr.id] = cr.consignes || [];
      (cr.indicateurs || []).forEach(ind => { SOUS_PAR_VARIANTE[v.id][cr.id][ind.id] = ind.sous || []; }); });
  });
}
// la variante (le sujet traité par l'élève, ex. imagination / réflexion) et ses champs
function varianteDe(vid) { return SUJET && (SUJET.variantes || []).find(v => v.id === vid) || null; }
function varianteUnique() { return SUJET && (SUJET.variantes || []).length === 1 ? SUJET.variantes[0].id : null; }
function libVariante(vid, champ, defaut) { const v = varianteDe(vid); return v && v[champ] != null ? v[champ] : (defaut != null ? defaut : (v ? v.libelle : "—")); }
// le compteur d'orthographe : l'indicateur qui le porte, celui dont l'échelon choisit les seuils (variante.compteur)
function compteurDe(id) { const c = copieFor(id); const v = varianteDe(c.sujet); return v && v.compteur ? v.compteur : null; }
function estIndCompteur(id, indId) { const k = compteurDe(id); return !!k && k.indicateur === indId; }
function totalPour(id) { const g = getGrille(id); return g ? g.total : (SUJET ? SUJET.total : 0); }

''' + m_coul + '\n\n' + m_conn + '''

// Retourne le bon dictionnaire de sous-descripteurs selon la variante de l'élève
// Usage : const SOUS = sousDescripteursPourSujet(c.sujet);
function sousDescripteursPourSujet(sujet) {
  return SOUS_PAR_VARIANTE[sujet] || {};
}
</script>''' + s[j:]

# 2 · l'énoncé : celui du sujet (state.sujet le garde pour la fiche et la modale « Sujet »)
r('''  sujet: "Brevet blanc 3e — La Chambre des officiers, Marc Dugain. Sujet d'imagination (suite du récit de Marguerite) ou sujet de réflexion (apport des récits de vie).",''',
  '''  sujet: "", // l'énoncé : celui du sujet (SUJET.enonce) tant que Paul ne l'a pas changé''')
r("      sujet: null, // 'imagination' ou 'reflexion'", "      sujet: null, // la variante traitée (SUJET.variantes[].id), ex. 'imagination' ou 'reflexion'")

# 3 · les libellés de variante
r('''    const sujLabel = l.sujet === "imagination" ? "Imag." : (l.sujet === "reflexion" ? "Réfl." : "—");''',
  '''    const sujLabel = l.sujet ? libVariante(l.sujet, "abrege") : "—";''')
r('''    const sujetTag = c.sujet === "imagination" ? "🖋️ Imagination"
                   : c.sujet === "reflexion" ? "💭 Réflexion"''',
  '''    const sujetTag = c.sujet ? libVariante(c.sujet, "etiquette")''')
r('''  sujetEl.textContent = c.sujet === "imagination" ? "Imagination" : c.sujet === "reflexion" ? "Réflexion" : "—";''',
  '''  sujetEl.textContent = c.sujet ? libVariante(c.sujet, "libelleCourt") : "—";''')
r('''sur le sujet « ${sujetActuel === 'imagination' ? 'Imagination' : 'Réflexion'} »''', '''sur le sujet « ${libVariante(sujetActuel, 'libelleCourt')} »''')
r('''Sujet actuellement sélectionné : <strong>${sujetActuel === 'imagination' ? 'Imagination' : 'Réflexion'}</strong>''', '''Sujet actuellement sélectionné : <strong>${libVariante(sujetActuel, 'libelleCourt')}</strong>''')
r('''  const ancienLabel = ancienSujet === 'imagination' ? 'Imagination' : 'Réflexion';
  const nouvLabel = s === 'imagination' ? 'Imagination' : 'Réflexion';''',
  '''  const ancienLabel = libVariante(ancienSujet, 'libelleCourt');
  const nouvLabel = libVariante(s, 'libelleCourt');''')

# 4 · l'écran de choix : un bouton par variante, depuis la donnée (le nombre de points du critère propre à la variante est calculé)
i = s.index("    const imagSel = sujetActuel === 'imagination'")
j = s.index("          </div>\n        </div>\n      </div>\n    `;", i)
s = s[:i] + '''    const boutonsVariantes = (SUJET.variantes || []).map((v, k) => {
      const sel = sujetActuel === v.id ? ' style="box-shadow:0 0 0 3px var(--bordeaux);"' : '';
      const propre = (v.criteres || []).filter(cr => !(SUJET.variantes || []).every(w => (w.criteres || []).some(x => x.id === cr.id)));
      const crit = propre.map(cr => `Critère <strong>${escapeHtml(cr.titre)}</strong> /${cr.points}`).join(' · ');
      const ch = v.choix || {};
      return `
            <button class="choix-sujet-btn ${k % 2 ? 'refl' : 'imag'}" onclick="choisirSujetAvecConfirmation('${escapeAttr(v.id)}')"${sel}
                    title="${escapeAttr((ch.infobulle || v.libelle) + (propre.length ? ' La grille compte ici ' + propre.map(cr => 'un critère « ' + cr.titre + ' » sur ' + cr.points + ' points').join(' et ') + '.' : ''))}">
              <h3>${escapeHtml(ch.titre || v.libelleCourt || v.libelle)}${sujetActuel === v.id ? ' ✓' : ''}</h3>
              <p>${escapeHtml(ch.texte || '')}${crit ? ' ' + crit + '.' : ''}</p>
            </button>`; }).join('');
    body.innerHTML = `
      <div class="choix-sujet-overlay" style="flex:1;display:flex;align-items:center;justify-content:center;">
        <div class="choix-sujet-card">
          <h2>Quel sujet a traité l'élève ?</h2>
          <div class="nom-eleve-grand">${escapeHtml(nom)}</div>
          ${avertissement}
          <div class="choix-sujet-options">${boutonsVariantes}
''' + s[j:]

# 5 · le compteur d'orthographe : l'indicateur et les seuils du sujet
i = s.index('function seuilsOrthoPour(id) {'); j = s.index('\n}\n', i) + 3
s = s[:i] + '''function seuilsOrthoPour(id) {
  const c = copieFor(id);
  const k = compteurDe(id) || { seuils: {}, defaut: 2 };
  const niveauLongueur = k.selon ? c.echelons[k.selon] : undefined;
  // Table : pour chaque échelon de l'indicateur « selon » (ex. la longueur), [maxTS, maxSat, maxFragile] — au-delà = Insuffisant
  const tableSeuils = k.seuils || {};
  const defaut = tableSeuils[k.defaut != null ? k.defaut : 2] || tableSeuils[Object.keys(tableSeuils)[0]] || [0, 0, 0];
  const seuils = (niveauLongueur !== undefined && niveauLongueur !== "NE" && tableSeuils[niveauLongueur])
                 ? tableSeuils[niveauLongueur]
                 : defaut;
  return {
    maxTS: seuils[0],
    maxSat: seuils[1],
    maxFragile: seuils[2],
    estDefaut: (niveauLongueur === undefined || niveauLongueur === "NE")
  };
}
''' + s[j:]
r('''    if (indCourant && indCourant.id === "orthographe") {''', '''    if (indCourant && estIndCompteur(state.current, indCourant.id)) {''')
r('''    const estOrtho = ind.id === "orthographe";''', '''    const estOrtho = estIndCompteur(state.current, ind.id);''')
r('''    const aideOrtho = ind.id === "orthographe"''', '''    const aideOrtho = estIndCompteur(state.current, ind.id)''')
r('''    const bandeauCompteurEtage2 = ind.id === "orthographe" ?''', '''    const bandeauCompteurEtage2 = estIndCompteur(state.current, ind.id) ?''')
r('''      if (b.ind.id === "orthographe" && (c.compteurOrthoGram || 0) > 0) {''', '''      if (estIndCompteur(id, b.ind.id) && (c.compteurOrthoGram || 0) > 0) {''')

# 6 · l'alerte de la fiche : celle du sujet
i = s.index('function notificationDeclassementDNB(id) {'); j = s.index('\n}\n', i) + 3
s = s[:i] + '''function notificationDeclassementDNB(id) {
  const a = SUJET && SUJET.fiche && SUJET.fiche.alerte;
  if (!a || !a.indicateur) return null;
  const c = copieFor(id);
  const ech = c.echelons[a.indicateur];
  if (ech === undefined || ech === "NE") return null;
  if (ech === (a.echelon != null ? a.echelon : 0)) return { titre: a.titre, contenu: a.contenu };
  return null;
}
''' + s[j:]

# 7 · le total : celui de la grille de la variante
r('''<span class="eleve-note" title="Note totale sur 40">${total}/40</span>''', '''<span class="eleve-note" title="Note totale sur ${totalPour(id)}">${total}/${totalPour(id)}</span>''')
r('''  document.getElementById("bandeauNote").textContent = complete ? `${total} / 40` : `(${total}+?) / 40`;''',
  '''  document.getElementById("bandeauNote").textContent = complete ? `${total} / ${totalPour(id)}` : `(${total}+?) / ${totalPour(id)}`;''')
r('''<td class="val total"><strong>${total} / 40</strong></td>''', '''<td class="val total"><strong>${total} / ${totalPour(state.current)}</strong></td>''')
r('''<td class="val"><strong>${complete ? total : "—"} / 40</strong></td>''', '''<td class="val"><strong>${complete ? total : "—"} / ${grille.total}</strong></td>''')

# 8 · les consignes d'entraînement : celles du critère, dans la variante
r('''    const consigne = CONSIGNES[cr.id] && CONSIGNES[cr.id][echCr];''', '''    const consigne = (CONSIGNES_PAR_VARIANTE[c.sujet] || {})[cr.id] && CONSIGNES_PAR_VARIANTE[c.sujet][cr.id][echCr];''')

# 9 · la fiche : le titre, la classe choisie, le sous-titre, « À faire » du sujet
r('''<title>${escapeHtml(nom)} — Rédaction brevet blanc</title>''', '''<title>${escapeHtml(nom)} — ${escapeHtml(ficheTexte("titre"))}</title>''')
r('''  <h1>${escapeHtml(nom)} — Rédaction brevet blanc</h1>
  <div class="meta">3e De Gaulle · ${c.sujet === "imagination" ? "Sujet d'imagination" : "Sujet de réflexion"} · Brevet blanc</div>''',
  '''  <h1>${escapeHtml(nom)} — ${escapeHtml(ficheTexte("titre"))}</h1>
  <div class="meta">${[escapeHtml(nomClasseCourante()), escapeHtml(libVariante(c.sujet, "libelleFiche")), escapeHtml(ficheTexte("sousTitre"))].filter(Boolean).join(" · ")}</div>''')
i = s.index('''<div class="autocorrection">
  <h3>À faire avec cette correction</h3>'''); j = s.index('</div>', i) + len('</div>')
s = s[:i] + '''${(SUJET.fiche && (SUJET.fiche.aFaire || []).length) ? `<div class="autocorrection">
  <h3>À faire avec cette correction</h3>
  <ol>
${SUJET.fiche.aFaire.map(t => `    <li>${t}</li>`).join("\\n")}
  </ol>
</div>` : ""}''' + s[j:]

# 10 · extraireSujet : les repères des variantes (« Sujet d'imagination », « Sujet de réflexion » pour Dugain)
i = s.index('function extraireSujet(texteSujet, typeSujet) {'); j = s.index('\n}\n', i) + 3
s = s[:i] + '''function extraireSujet(texteSujet, typeSujet) {
  if (!texteSujet) return "";
  const v = varianteDe(typeSujet);
  if (v && v.enonce) return v.enonce;          // une variante qui porte son énoncé
  // Repères des variantes dans l'énoncé commun (ex. « Sujet d'imagination » / « Sujet de réflexion »).
  const reps = (SUJET.variantes || []).filter(w => w.repere).map(w => { const m = texteSujet.match(new RegExp(w.repere, "i")); return m ? { id: w.id, debut: m.index, fin: m.index + m[0].length } : null; }).filter(Boolean);
  // Si aucun repère trouvé : texte intégral
  if (!reps.length) return texteSujet;
  const moi = reps.find(x => x.id === typeSujet);
  // Si le repère de cette variante est absent : le texte intégral (probable que le texte ne fasse que l'autre sujet)
  if (!moi) return texteSujet;
  // On coupe du repère de la variante jusqu'au repère suivant.
  const suivants = reps.filter(x => x.debut > moi.debut).sort((x, y) => x.debut - y.debut);
  return texteSujet.substring(moi.fin, suivants.length ? suivants[0].debut : texteSujet.length).trim();
}
''' + s[j:]


# 11 · le socle MJPC-CORE (+ M-SÉCU) repris tel quel de correction_dictee.html (production), et la déclaration de l'app
if len(sys.argv) < 5: sys.exit('usage : deriver.py <redaction_dugain_v3.html> <redaction.html> <correction_dictee.html> <ru-hub.js>')
cd = open(sys.argv[3], encoding='utf8').read()
a = cd.index('// MJPC-CORE v1.4.0 (2026-08-01)'); a = cd.rindex('\n', 0, cd.rindex('// ═', 0, a - 1)) + 1
b = cd.index('/* ═══ fin M-SÉCU-2 ═══ */', a) + len('/* ═══ fin M-SÉCU-2 ═══ */')
socle = cd[a:b]
hub = open(sys.argv[4], encoding='utf8').read()
DECL = open(sys.argv[0].replace('deriver.py', 'decl.js'), encoding='utf8').read()
ETAT = '<script>\n// =====================================================================\n// ÉTAT\n// ====================================================================='
r(ETAT, '<script>\n' + socle + '\n\n' + DECL + '\n' + hub + ETAT[len('<script>'):])

# 12 · l'élève : sa clé MJPC ; plus de localStorage comme mémoire (le site l'est, ru-hub)
i = s.index('function saveState() {', s.index('let state = {')); j = s.index('function eleveId(nom) {', i)
s = s[:i] + s[j:]
i = s.index('function eleveId(nom) {'); j = s.index('\n}\n', i) + 3
s = s[:i] + 'function eleveId(nom) {   // la clé MJPC de l’élève (« CLÉMENT Noé » → « clement_noe ») : celle du site\n  return sanMJPC(nom);\n}\n' + s[j:]

# 12 bis · la classe et l'énoncé passent par le site (ru-hub : ouvrirGestionClasse, sauverClasse, sauverSujet) : les versions locales tombent
i = s.index('function ouvrirGestionClasse() {\n  document.getElementById("listeEleves")'); j = s.index('function ouvrirSujet() {', i)
s = s[:i] + s[j:]
i = s.index('function sauverSujet() {\n  state.sujet = document.getElementById("sujetEdit").value;\n  saveState();'); j = s.index('function fermerModale', i)
s = s[:i] + s[j:]

# 12 ter · les mots de liaison se tirent comme avant : le hachage garde l'ancienne forme de l'identifiant (« AUDEBERT_Elise »), sinon une fiche changerait de connecteurs au passage au site
r('''    const seed = hashStable(id + indId + position);''', '''    const seed = hashStable(eleveIdAncien(nomEleveDe(id) || id) + indId + position);   // la forme d'avant (redaction_dugain_v3) : mêmes connecteurs, fiche identique''')
r('''function eleveId(nom) {   // la clé MJPC''', '''function eleveIdAncien(nom) {   // l'identifiant de redaction_dugain_v3 (« AUDEBERT_Elise ») : seulement pour tirer les connecteurs comme avant, et relire une sauvegarde JSON d'avant
  return String(nom).normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
}
function eleveId(nom) {   // la clé MJPC''')

# 13 · l'INIT : le site d'abord
i = s.index('// INIT\nloadState();'); j = s.index('</script>\n</body>', i)
s = s[:i] + '// INIT\nsetupGardeFousJSON();\nsetupGuillemetsFrancais();\nruDemarrer();\n' + s[j:]

# 14 · le HTML : remplacements lus dans html.txt (blocs « <<<AVANT … === … >>> »)
H = open(sys.argv[0].replace('deriver.py', 'html.txt'), encoding='utf8').read()
for bloc in H.split('<<<AVANT\n')[1:]:
    av, ap = bloc.split('\n===\n', 1); ap = ap.split('\n>>>', 1)[0]
    if av.startswith('BLOC '):
        d, f2 = av[5:].split(' ... ')
        i = s.index(d); j = s.index(f2, i)
        s = s[:i] + ap + s[j:]; n_ok += 1
    else:
        r(av, ap)

open(out, 'w', encoding='utf8').write(s)
print('remplacements exacts :', n_ok, '· blocs réécrits : grille, choix, seuils, alerte, À faire, extraireSujet ·', len(s), 'o')
