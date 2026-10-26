/* LA MAQUETTE « SIMPLIFIER L'EXISTANT » (conscience n°13, 26/10 20:25 ; Paul : « Montre moi les images de ce que ça donnerait »).
   Posée par-dessus le fichier intégré d'aujourd'hui, POUR LES CAPTURES SEULEMENT : elle écrit dans l'écran les tranchages S1-S5 de
   `../CADRAGE-26-10.md` (et, pour la répétition, la ligne de §12.28 (3a) déjà décidée) — rien d'autre ne change. Le bouton
   « Montrer le cahier à la classe » est dessiné à sa place, sans geste derrière (le moment où il sert se mesure avant tout code). */
(function () {
  const NOMS = [['#bvideoproj', '🖥 Ouvrir le tableau'], ['#btableau', '⧉ Ce que voit la classe']];
  const PALIER = { t5: 'T-5 — le cahier de textes dans 5 minutes', t3: 'T-3 — le cahier de textes dans 3 minutes', t1: 'T-1 — le cahier de textes dans 1 minute', zero: 'C\'est l\'heure du cahier de textes' };
  const cacher = el => { if (el && el.style.display !== 'none') { el.style.setProperty('display', 'none', 'important'); el.dataset.maqCache = '1'; } };
  const montrer = () => document.querySelectorAll('[data-maq-cache]').forEach(el => { if (el.id === 'al-boite' || el.id === 'al-ligne') return; el.style.removeProperty('display'); delete el.dataset.maqCache; });
  const appliquer = () => {
    const enClasse = document.documentElement.classList.contains('dr-en-classe');
    /* S4 — un nom par geste */
    NOMS.forEach(([sel, t]) => { const b = document.querySelector(sel); if (b && b.textContent !== t) b.textContent = t; });
    document.querySelectorAll('button').forEach(b => { const t = (b.textContent || '').trim();
      if (/^▶?\s*Reprendre le cours$/.test(t) && !b.closest('.pp-tete, .dr-seq')) { const n = '▶ Reprendre l\'heure'; if (b.textContent !== n) b.textContent = n; } });
    /* S1 — à T-5, une seule chose s'ouvre : la barre du bas ne s'ouvre plus */
    cacher(document.getElementById('al-boite')); cacher(document.getElementById('al-ligne'));
    document.querySelectorAll('.scene.dr-al').forEach(s => s.classList.remove('dr-al'));
    /* S1 + S2 + S3 — la tête des sept étapes : le palier écrit en tête ; deux boutons au plus, au même endroit :
       les étapes ouvertes → « ❄ Préparer le cahier » (le geste de « Préparer » et de « Préparer le cahier de textes », fusionnés) et « Plus tard » ;
       en préparation → « Montrer le cahier à la classe » (le geste d'« Aller au cahier », dessiné ici) et « Retour au cours » (« Revenir au cours ») */
    const S = window.S || {};
    if (S.preparation) { /* S3 — l'écran ne change pas de forme : la colonne des diapos, la diapo et les notes reprennent leur place ; les étapes restent dans la colonne de droite */
      const d = S.dispoAvant || {}; let re = false;
      if (S.lg !== (d.lg || 186)) { S.lg = d.lg || 186; re = true; } if ((S.murPart || 1) !== (d.murPart || 1)) { S.murPart = d.murPart || 1; re = true; } if (!!S.notesReduites !== !!d.notes) { S.notesReduites = !!d.notes; re = true; }
      const corps = document.getElementById('corps'); if (corps && corps.classList.contains('prep')) { corps.classList.remove('prep'); re = true; }
      const notes = document.querySelector('.notes'); if (notes && notes.classList.contains('reduites') !== !!d.notes) notes.classList.toggle('reduites', !!d.notes);
      if (re) { try { poserColonnes(); dimensionner(); } catch (e) {} }
      const prep = document.getElementById('prep'), df = document.getElementById('droite-fin'), dr = document.getElementById('droite');
      if (prep && df && prep.parentElement !== df) df.appendChild(prep); if (dr && !dr.classList.contains('fin')) dr.classList.add('fin');
      const fin = document.getElementById('fin'); if (fin) cacher(fin);
    } else { const fin = document.getElementById('fin'); if (fin && fin.dataset.maqCache) { fin.style.removeProperty('display'); delete fin.dataset.maqCache; } }
    document.querySelectorAll('.pp-tete').forEach(tt => {
      const titre = tt.querySelector('b');
      if (titre) { const base = titre.textContent.replace(/^(T-\d — [^·]*|C'est l'heure du cahier de textes) · /, '').replace(/^Préparer le cahier de textes/, 'Fin de l\'heure').replace(/ · ❄ la classe voit encore sa diapo$/, ''); const t = S.preparation ? base.replace(/^Fin de l'heure — /, '') : (S.palier && PALIER[S.palier] ? PALIER[S.palier] + ' · ' : '') + base; if (titre.textContent !== t) titre.textContent = t; }
      tt.querySelectorAll('button').forEach(b => { const t = (b.textContent || '').trim();
        if (/^Préparer le cahier de textes$/.test(t)) b.textContent = '❄ Préparer le cahier';
        if (/^Reprendre le cours$/.test(t)) b.textContent = 'Plus tard';
        if (/^Revenir au cours$/.test(t)) b.textContent = 'Retour au cours'; });
      if (S.preparation && !tt.querySelector('.maq-montrer')) { const r = Array.from(tt.querySelectorAll('button')).find(b => /Retour au cours|Revenir au cours/.test(b.textContent)); if (r) { const m = document.createElement('button'); m.className = r.className.replace(/\bor\b/, '') + ' maq-montrer'; m.textContent = 'Montrer le cahier à la classe'; m.title = 'Le cahier de textes passe au tableau : les élèves notent (le geste d\'« Aller au cahier », dessiné pour la maquette)'; m.onclick = e => { e.preventDefault(); e.stopPropagation(); }; r.parentElement.insertBefore(m, r); } } });
    /* S5 — la répétition (l'Atelier) ne montre que la répétition ; §12.28 (3a) : l'Atelier ne lance plus */
    if (!enClasse) {
      ['bfin', 'dr-clore', 'bqui', 'vif', 'vif-dernier', 'part', 'dr-lancer'].forEach(id => cacher(document.getElementById(id)));
      const pr = document.getElementById('presents'); if (pr) { const h = pr.closest('h5'); if (h) cacher(h); }
      const hou = document.getElementById('hou'); if (hou && document.getElementById('dr-lancer') && !document.getElementById('maq-rep')) { const l = document.createElement('span'); l.id = 'maq-rep'; l.style.cssText = 'margin-left:12px;color:var(--sourd,#a99);font-style:italic'; l.textContent = 'Répétition : rien n\'est écrit. Une heure avec une classe se lance depuis l\'emploi du temps.'; hou.after(l); }
    } else { const l = document.getElementById('maq-rep'); if (l) l.remove(); montrer(); }
  };
  const go = () => { appliquer(); new MutationObserver(() => { try { appliquer(); } catch (e) {} }).observe(document.body, { childList: true, subtree: true, characterData: true }); setInterval(() => { try { appliquer(); } catch (e) {} }, 300); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
