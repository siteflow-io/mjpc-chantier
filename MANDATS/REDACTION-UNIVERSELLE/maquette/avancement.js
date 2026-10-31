// Le tableau lit la correction des scans sans initialiser ni réécrire une copie.
// Une rubrique terminée est une case complète ; une marque seule commence la lecture.
function scAvancement(k) {
  const copie = state.copies[k], s = copie && copie.scan;
  if (!s) return null;
  const rep = s.rep || {}, marques = s.marques || {}, vu = s.vu || {};
  const commence = Object.keys(marques).length > 0 || Number(s.lignes) > 0
    || Object.values(vu).some(Boolean)
    || Object.values(rep).some(r => r && Object.values(r).some(v => v === "o" || v === "n"));
  if (!commence) return null; // une ouverture, un chrono ou une recopie ne corrigent pas la copie
  const g = SUJET && SUJET.grille2;
  let fait = 0, total = 0;
  const lecture = { rep, marques };
  ((g && g.criteres) || []).forEach(c => (c.points || []).forEach(p => {
    total++;
    if (p.calcul) {
      // La passe a été terminée par Paul. Sur une copie à repères, le nombre de
      // lignes peut venir des pages : aucune image n'est nécessaire au tableau.
      if (vu[c.id] && (s.lignes == null || Number(s.lignes) > 0)) fait++;
    } else {
      const pt = Object.assign({}, p, { questions: p.questions || [], cases: p.cases || [] });
      const r = scCase(pt, k, lecture);
      if (r && r.complet) fait++;
    }
  }));
  return { commence: true, fait, total, pct: total ? Math.round(100 * fait / total) : 0 };
}
