/* E4 — un socle SIMULÉ pour éprouver dr-recit.js avant E1-a (banc, MJPC_ENTREE=simule). Jamais livré dans le site.
   Il pose, sur la maquette p8-5g, les interfaces du contrat §5 dont mon module a besoin : dr_lire / dr_ecrire (un hub en mémoire,
   gardé d'une ouverture à l'autre par le banc : window.__E4HUB_INIT), dr_cheminB / dr_cheminC, dr_seance (la séance 0 du faux hub,
   ses items de Structure). DATA.documents est vidé : les documents viennent de Structure, par référence. */
(function(){
  window.__HUB = window.__E4HUB_INIT ? JSON.parse(JSON.stringify(window.__E4HUB_INIT)) : {}; window.__ECR = [];
  const marche = c => c.split('/').filter(Boolean);
  window.dr_lire = function (c, cb) { let n = window.__HUB; for (const k of marche(c)) { if (!n || typeof n !== 'object') { n = null; break; } n = n[k]; } const v = n === undefined ? null : JSON.parse(JSON.stringify(n)); setTimeout(() => cb(v), 0); };
  window.dr_ecrire = function (c, v, lib, cb) { const q = marche(c); let n = window.__HUB; for (let i = 0; i < q.length - 1; i++) { if (!n[q[i]] || typeof n[q[i]] !== 'object') n[q[i]] = {}; n = n[q[i]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = JSON.parse(JSON.stringify(v)); window.__ECR.push({ m: 'PUT', c, t: Date.now() }); if (cb) cb(true); };
  window.dr_cheminB = () => '/site/3e/chapitres/0/seances/0';
  window.dr_cheminC = () => '/site/3e/chapitres/0/seances/0/deroule_joue/3E Charles de Gaulle';
  window.dr_seance = () => window.__E4SEANCE || null;
  document.addEventListener('DOMContentLoaded', () => { try { DATA.documents = {}; } catch (e) {} });   /* vide, pas retiré : le rendu de la maquette (E1) le lit encore */
})();
