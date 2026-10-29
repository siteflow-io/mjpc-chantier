import fs from 'fs';
const inv = JSON.parse(fs.readFileSync('inv-maq.json')); 
const P = [['E1',3,298,'CSS'],['E1',299,377,'corps'],['E4',382,623,'récit'],['E1',624,778,'schémas'],['E1',779,972,'état/rendu'],['E1',973,1251,'atelier'],['E1',1252,1322,'nav/gardes'],['E2',1323,1428,'mise en commun'],['E2',1429,1438,'réserve'],['E4',1439,1449,'docs/vidéo'],['E1',1450,1481,'surligner'],['E2',1482,1607,'T-5/fin'],['TOMBE',1608,1613,'EDT simulé'],['E2',1614,1638,'ouverture'],['E4',1639,1803,'relecture'],['E3',1804,1815,'tableau'],['E1',1816,1835,'raccourcis/horloge/démarrage']];
const de = l => P.find(p => l >= p[1] && l <= p[2]);
const par = {}; const hors = []; const chevauche = [];
for (const d of inv) { const a = de(d.ligne), b = de(d.fin); if (!a) { hors.push(d); continue; } if (a !== b) chevauche.push(d); const k = a[0] + ' ' + a[3]; (par[k] = par[k] || []).push(d.nom || d.k); }
for (const k of Object.keys(par)) console.log(k.padEnd(34), par[k].length, ':', par[k].filter(Boolean).join(' ').slice(0, 1500));
console.log('\nHORS PLAGES :', hors.map(d => (d.nom || d.k) + '@' + d.ligne).join(' '));
console.log('CHEVAUCHENT deux plages :', chevauche.map(d => (d.nom || d.k) + '@' + d.ligne + '-' + d.fin).join(' '));
