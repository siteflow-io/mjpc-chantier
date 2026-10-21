/* ═══════════════════════════════════════════════════════════════════════════════════════════════════════
   dr-recit.js — E4, LE RÉCIT ET LE PAPIER (contrat des quatre, §6) — la Relecture, le Papier, École Directe, les documents
   ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Ce module reprend TELS QUELS, de la maquette p8-5g (md5 62d9557a…) :
     · le moteur du récit, l. 382-442 (repris de l'ancien déroulé) ;
     · docHtml, videoHtml (l. 888-891), loupeSur (l. 916-917) — déplacés du rendu, sans changement de geste ;
     · le panneau des documents, l. 1435-1438 (contesté : C1 de l'audit) ; la vidéo, l. 1439-1448 ;
     · la relecture, l. 1644-1803 (voir() et les raccourcis de l'atelier, l. 1640-1643, restent au socle).
   Les SEULES substitutions dans le code repris (règle 7.1 du plan : une lecture du hub au lieu d'une simulation) :
     HEURES_SIM[h]                → dr_recitHeure(h)          (le jour, le début, la fin, la base de l'heure h)
     DATA.classe.nom              → dr_recitClasseNom()       (dr_classe().nom)
     DATA.chapitre                → dr_recitChapitre()        (dr_chapitre().title)
     DATA.activites[String(S.si)] → dr_recitActivites()       (B/deroule/activites, par le socle)
     DATA.taxo                    → dr_recitTaxo()            (dr_taxo())
     DATA.classe.prochaines       → dr_recitProchaines()      (les prochaines heures de la classe, E2)
     DATA.documents[String(S.si)] → dr_recitDocuments()       (les items doc de sce.items : par référence, cadrage n°7)
     [1, 2] (les heures simulées) → les heures lues dans J
   Chaque fonction d'accès retombe sur la simulation de la maquette quand elle existe (DATA, HEURES_SIM) : le même module
   se joue sur la maquette (bancs d'avant E1-a) et sur le site. Sur le site, DATA et HEURES_SIM n'existent plus.
   Ce qui est NOUVEAU (mandat E4) est en fin de module, chaque morceau sous son titre.
   ═══════════════════════════════════════════════════════════════════════════════════════════════════════ */

/* ── les accès (E4) : une lecture, jamais une seconde copie ── */
function dr_recitA(nom){ try { return typeof window[nom] === 'function' ? window[nom] : null; } catch (e) { return null; } }
function dr_recitSim(){ try { return typeof DATA !== 'undefined' ? DATA : null; } catch (e) { return null; } }
function dr_recitClasseNom(){ const f = dr_recitA('dr_classe'); if (f) { try { const c = f(); if (c && c.nom) return c.nom; } catch (e) {} } const D = dr_recitSim(); return D && D.classe ? D.classe.nom : ''; }
function dr_recitChapitre(){ const f = dr_recitA('dr_chapitre'); if (f) { try { const c = f(); if (c) return c.title || c.titre || ''; } catch (e) {} } const D = dr_recitSim(); return D ? (D.chapitre || '') : ''; }
function dr_recitActivites(){ const f = dr_recitA('dr_activites'); if (f) { try { return f() || []; } catch (e) { return []; } } const D = dr_recitSim(); return D && D.activites ? (D.activites[String(S.si)] || []) : []; }
function dr_recitTaxo(){ const f = dr_recitA('dr_taxo'); if (f) { try { const t = f(); if (Array.isArray(t)) return t; if (t && Array.isArray(t.domaines)) return t.domaines; } catch (e) {} } const D = dr_recitSim(); return D && D.taxo ? D.taxo : []; }
function dr_recitProchaines(){ const f = dr_recitA('dr_prochaines'); if (f) { try { return f() || []; } catch (e) { return []; } } const fc = dr_recitA('dr_classe'); if (fc) { try { const c = fc(); if (c && Array.isArray(c.prochaines)) return c.prochaines; } catch (e) {} } const D = dr_recitSim(); return D && D.classe && D.classe.prochaines ? D.classe.prochaines : []; }
/* le jour, le début, la fin et la base (l'horaire réel du créneau) de l'heure h — HEURES_SIM sur la maquette ; sur le site :
   l'heure en cours depuis dr_ctx(), une heure passée depuis son paquet H (C/heures/<clé> : lanceA, debutReel, fin), à défaut le journal */
const DR_RECIT_JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], DR_RECIT_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function dr_recitJourDe(t){ const d = new Date(t); const f = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); try { return f.format(d); } catch (e) { return DR_RECIT_JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + DR_RECIT_MOIS[d.getMonth()] + ' ' + d.getFullYear(); } }
function dr_recitHm(t){ try { return new Date(t).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
function dr_recitDecalage(d){ const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(d); const g = k => +p.find(x => x.type === k).value; return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second')) - Math.floor(d.getTime() / 1000) * 1000; }
function dr_recitAHeure(t, hm){ const d = new Date(t); const jour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d); const q = String(hm || '00:00').split(':'); return Date.parse(jour + 'T' + String(+q[0] || 0).padStart(2, '0') + ':' + String(+q[1] || 0).padStart(2, '0') + ':00Z') - dr_recitDecalage(d); }   /* l'instant « hm, heure de Paris » du jour de t */
var DR_RECIT_HEURES = {};   /* h → {jour, debut, fin, base} lus dans les paquets H de la classe (dr_recitChargerHeures) */
function dr_recitHeure(h){
  try { if (typeof HEURES_SIM !== 'undefined' && HEURES_SIM[h]) return HEURES_SIM[h]; } catch (e) {}
  if (DR_RECIT_HEURES[h]) return DR_RECIT_HEURES[h];
  const f = dr_recitA('dr_ctx'); let c = null; if (f) { try { c = f(); } catch (e) {} }
  const premier = (typeof J !== 'undefined' ? J : []).find(x => x.h === h);
  if (c && (c.heure === h || c.heure == null) && c.debut) { const t0 = premier ? premier.t : (typeof now === 'function' ? now() : Date.now()); return { jour: dr_recitJourDe(t0), debut: c.debut, fin: c.fin || '', base: dr_recitAHeure(t0, c.debut) }; }
  const t0 = premier ? premier.t : Date.now(); return { jour: dr_recitJourDe(t0), debut: dr_recitHm(t0), fin: '', base: t0 };
}
