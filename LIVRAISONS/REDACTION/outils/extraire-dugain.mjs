// La grille Dugain en données : extraite de redaction_dugain_v3.html (production), mot pour mot, par script.
// usage : node extraire-dugain.mjs <redaction_dugain_v3.html> <sortie.json>
// Rien n'est retapé : les objets GRILLE, SOUS_IMAGINATION, SOUS_REFLEXION, CONSIGNES sont évalués tels quels
// (après reordonnerGrillePourFluxCorrection, l'ordre que l'app produit à l'écran) ; les textes en dur de la fiche
// et de l'écran de choix sont relevés dans le code par des motifs, et le script échoue si l'un manque.
// Il compte avant (dans l'app) / après (dans le JSON) chaque sorte de phrase : zéro perdue, ou il échoue.
import fs from 'node:fs';
const [src, out] = process.argv.slice(2); if (!src || !out) { console.log('usage : node extraire-dugain.mjs <redaction_dugain_v3.html> <sortie.json>'); process.exit(2); }
const s = fs.readFileSync(src, 'utf8');
const a = s.indexOf('const GRILLE'), b = s.indexOf('</script>', a);
const o = new Function(s.slice(a, b) + ';return { GRILLE, SOUS_IMAGINATION, SOUS_REFLEXION, CONSIGNES, CONNECTEURS };')();
const prendre = (re, quoi) => { const m = s.match(re); if (!m) { console.error('INTROUVABLE : ' + quoi); process.exit(1); } return m[1]; };

// la compétence de chaque indicateur (R8) — PROPOSITION d'E4, donnée de travail jamais vue par l'élève, à valider par Paul
const COMP = { orthographe: ['c4-langue-01'], syntaxe: ['c4-langue-04'], lexique: ['c4-langue-03'], enchainement: ['c4-ecrire-02'], enonciation: ['c4-ecrire-01'], longueur: ['c4-ecrire-02'],
  remobilisation: ['c4-ecrire-03'], cadre: ['c4-ecrire-01'], peripeties: ['c4-ecrire-01'], sensations: ['c4-langue-03'], these: ['c4-ecrire-04'], exemples: ['c4-ecrire-03'], nuance: ['c4-ecrire-04'], engagement: ['c4-ecrire-04'] };

const enonce = prendre(/let state = \{[\s\S]*?sujet: "([^"]+)"/, 'l\'énoncé par défaut (state.sujet)');
// contrôle n°79 (B) : l'énoncé de chaque variante, découpé UNE FOIS dans l'énoncé de l'app, sans un mot ajouté (seule la majuscule de « Sujet de réflexion », en tête de phrase)
const iI = enonce.indexOf("Sujet d'imagination"), iR = enonce.indexOf(' ou sujet de réflexion');
if (iI < 0 || iR < 0) { console.error('INTROUVABLE : les deux sujets dans l\'énoncé'); process.exit(1); }
const ENONCES = { imagination: enonce.slice(0, iR), reflexion: enonce.slice(0, iI) + 'S' + enonce.slice(iR + ' ou s'.length) };
const mots = t => t.toLowerCase().match(/[\p{L}\p{N}'’-]+/gu) || [];
for (const v in ENONCES) { const ajoutes = mots(ENONCES[v]).filter(m => !mots(enonce).includes(m)); if (ajoutes.length) { console.error('ÉCHEC : mots ajoutés à l\'énoncé ' + v + ' : ' + ajoutes); process.exit(1); } }
const alerte = { titre: prendre(/titre: "(Important pour le DNB officiel)"/, 'le titre de l\'alerte DNB'), contenu: prendre(/contenu: "(Le critère d'orthographe-grammaire[^"]+)"/, 'le contenu de l\'alerte DNB') };
const aFaire = (s.slice(s.indexOf('<h3>À faire avec cette correction</h3>')).match(/<ol>([\s\S]*?)<\/ol>/) || [])[1];
if (!aFaire) { console.error('INTROUVABLE : « À faire avec cette correction »'); process.exit(1); }
const titreFiche = prendre(/<title>\$\{escapeHtml\(nom\)\} — ([^<]+)<\/title>/, 'le titre de la fiche');
const sousTitre = prendre(/<div class="meta">3e De Gaulle · \$\{[^}]+\} · ([^<]+)<\/div>/, 'le sous-titre de la fiche');
const VAR = {
  imagination: { libelleCourt: 'Imagination', libelleFiche: "Sujet d'imagination", etiquette: '🖋️ Imagination', abrege: 'Imag.', repere: "sujet\\s*d['’\\s]*imagination",
    choix: { titre: '🖋️ Imagination', texte: prendre(/<p>(Suite du récit de Marguerite\.) Critère/, 'le texte du choix Imagination'), infobulle: prendre(/title="(L'élève a choisi le sujet d'imagination : [^"]+?)\. La grille DNB/, 'l\'infobulle du choix Imagination') + '.' } },
  reflexion: { libelleCourt: 'Réflexion', libelleFiche: 'Sujet de réflexion', etiquette: '💭 Réflexion', abrege: 'Réfl.', repere: 'sujet\\s*de\\s*r[ée]flexion',
    choix: { titre: '💭 Réflexion', texte: prendre(/<p>(Apport des récits de vie\.) Critère/, 'le texte du choix Réflexion'), infobulle: prendre(/title="(L'élève a choisi le sujet de réflexion : [^"]+?)\. La grille DNB/, 'l\'infobulle du choix Réflexion') + '.' } }
};
// le compteur : seuils de seuilsOrthoPour (l. 3637), relevés dans le code
const tab = prendre(/const tableSeuils = \{([\s\S]*?)\};/, 'les seuils du compteur');
const seuils = {}; tab.replace(/(\d):\s*\[(\d+),\s*(\d+),\s*(\d+)\]/g, (m, k, x, y, z) => { seuils[k] = [+x, +y, +z]; });
if (Object.keys(seuils).length !== 4) { console.error('seuils du compteur incomplets'); process.exit(1); }

const SOUS = { imagination: o.SOUS_IMAGINATION, reflexion: o.SOUS_REFLEXION };
const config = {
  id: 'dugain', format: 'mjpc-redaction-sujet/1',
  titre: 'Brevet blanc 3e — La Chambre des officiers (Marc Dugain)', niveau: '3e', total: 40, enonce,
  fiche: { titre: titreFiche, sousTitre, aFaire: [...aFaire.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()), alerte: Object.assign({ indicateur: 'orthographe', echelon: 0 }, alerte) },
  variantes: Object.keys(o.GRILLE).map(v => {
    const g = o.GRILLE[v];
    return Object.assign({ id: v, libelle: g.label }, VAR[v], { enonce: ENONCES[v], total: g.total,
      compteur: { indicateur: 'orthographe', selon: 'longueur', seuils, defaut: 2 },
      criteres: g.criteres.map(cr => ({ id: cr.id, titre: cr.titre, pts_max: cr.pts_max, consignes: [0, 1, 2, 3].map(e => o.CONSIGNES[cr.id][e]),
        indicateurs: cr.indicateurs.map(ind => ({ id: ind.id, libelle: ind.libelle, poids: ind.poids, competences: COMP[ind.id] || [],
          descripteurs: ind.descripteurs.slice(), sous: SOUS[v][cr.id][ind.id].map(ech => ech.map(x => ({ sans: x.sans, avec: x.avec }))) })) })) });
  })
};
// compte avant / après
const avant = { descripteurs: 0, sous: 0, consignes: 0 }, apres = { descripteurs: 0, sous: 0, consignes: 0 };
for (const v in o.GRILLE) { o.GRILLE[v].criteres.forEach(cr => { avant.consignes += 4; cr.indicateurs.forEach(i => { avant.descripteurs += i.descripteurs.length; SOUS[v][cr.id][i.id].forEach(e => e.forEach(x => { avant.sous += (x.sans ? 1 : 0) + (x.avec ? 1 : 0); })); }); }); }
const tous = [];
config.variantes.forEach(v => v.criteres.forEach(cr => { apres.consignes += cr.consignes.filter(Boolean).length; cr.consignes.forEach(t => tous.push(t)); cr.indicateurs.forEach(i => { apres.descripteurs += i.descripteurs.length; i.descripteurs.forEach(t => tous.push(t)); i.sous.forEach(e => e.forEach(x => { apres.sous += (x.sans ? 1 : 0) + (x.avec ? 1 : 0); tous.push(x.sans, x.avec); })); }); }));
// chaque phrase de l'app est-elle dans le JSON, mot pour mot ?
const absentes = []; for (const v in o.GRILLE) o.GRILLE[v].criteres.forEach(cr => { o.CONSIGNES[cr.id] && [0, 1, 2, 3].forEach(e => { if (!tous.includes(o.CONSIGNES[cr.id][e])) absentes.push(o.CONSIGNES[cr.id][e]); }); cr.indicateurs.forEach(i => { i.descripteurs.forEach(t => { if (!tous.includes(t)) absentes.push(t); }); SOUS[v][cr.id][i.id].forEach(e => e.forEach(x => { if (!tous.includes(x.sans)) absentes.push(x.sans); if (!tous.includes(x.avec)) absentes.push(x.avec); })); }); });
console.log('avant (app) :', JSON.stringify(avant), '· après (JSON) :', JSON.stringify(apres), '· absentes :', absentes.length);
if (JSON.stringify(avant) !== JSON.stringify(apres) || absentes.length) { console.error('ÉCHEC : des phrases perdues'); process.exit(1); }
fs.writeFileSync(out, JSON.stringify(config, null, 1) + '\n');
console.log('écrit', out, fs.statSync(out).size, 'o');
