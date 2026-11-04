# PREUVE (C16 689) : fabrique, depuis l'assemblé du candidat, les deux mutants où le cadre « Ce que voit la classe » (?vignette=1) ne montre pas la même page.
# usage : python3 mutants.py <assemblé.html> <dossier>   → <dossier>/mutant-compteur.html, <dossier>/mutant-lignes.html ; puis
#   MJPC_ENTREE=site MJPC_HORLOGE=date MJPC_HUB=<racine>/AUDITS/INTEGRATION-DEROULE/hub node k11-seul.mjs <fichier.html> <sortie.txt>   (k11-seul.mjs = controles.mjs + K11-cadre.patch, K11 seul)
import sys
s = open(sys.argv[1], encoding='utf8').read(); i = s.rfind('</html>'); assert len(s) - i < 20
m1 = "<script>/* MUTANT 1 (preuve K11) : le cadre garde son premier compteur de page */ if (/[?&]vignette=1/.test(location.search)) { let p0 = null; setInterval(() => { const e = document.querySelector('#mur2 .page'); if (!e) return; if (p0 === null) p0 = e.textContent; else if (e.textContent !== p0) e.textContent = p0; }, 20); }</script>\n"
m2 = "<script>/* MUTANT 2 (preuve K11) : le cadre cache sa dernière ligne visible */ if (/[?&]vignette=1/.test(location.search)) { setInterval(() => { const c = document.querySelector('#mur2 .corpsd') || document.getElementById('mur2'); if (!c) return; const l = Array.from(c.querySelectorAll('li')).filter(x => !x.classList.contains('hors') && !x.classList.contains('pas') && x.getBoundingClientRect().height > 0); if (l.length) l[l.length - 1].style.display = 'none'; }, 20); }</script>\n"
for n, m in (('mutant-compteur', m1), ('mutant-lignes', m2)):
    open(sys.argv[2] + '/' + n + '.html', 'w', encoding='utf8').write(s[:i] + m + s[i:])
