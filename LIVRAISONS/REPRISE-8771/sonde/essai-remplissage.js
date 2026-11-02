// Les deux lecteurs ajoutés (dr_etatRempli, dr_parDiapoRempli), tirés tels quels de la 8.77.1-⑩ corrigée, sur un état rangé comme le vrai hub le rend.
// usage : node essai-remplissage.js <index.html corrigé>
const L = require('fs').readFileSync(process.argv[2], 'utf8').split('\n');
const pick = (debut, n) => { const i = L.findIndex(x => x.startsWith(debut)); return L.slice(i, i + n).join('\n'); };
const code = [pick('const S = window.S = {', 3), pick('const DR_S_DEFAUT', 1), pick('const DR_ETAT_HORS', 1), pick('const dr_estObjet', 1), pick('function dr_etatRempli', 3), pick('function dr_parDiapoRempli', 5)].join('\n');
const r = new Function('window', code + '\nreturn { dr_etatRempli, dr_parDiapoRempli };')({});
const s = r.dr_etatRempli({ si: 0, heure: 1, travail: { prevu: true, libre: 'x' }, lancee: true, ecoule: 12 });
console.log('S relu sans ses vides : {"si":0,"heure":1,"travail":{"prevu":true,"libre":"x"},"lancee":true,"ecoule":12}');
console.log('S rempli             : ' + JSON.stringify({ parts: s.parts, gel: s.gel, travail: s.travail, comm: s.comm, lancee: s.lancee, ecoule: s.ecoule }) + ' ; jamais remis (DR_ETAT_HORS) : ' + JSON.stringify(['mur', 'cand', 'attente', 'di', 'ordres'].filter(k => k in s)));
console.log('parDiapo rempli      : ' + JSON.stringify(r.dr_parDiapoRempli({ e5: { nDev: 2, lum: { '0': 3, '2': 5 } }, e6: { nDev: 1, ecr: [null, 4], reps: { b: [{ eleve: 'x', r: 'y' }] } } })));
