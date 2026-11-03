// anonymiser.mjs <racine du dépôt> <fichier>… : chaque nom d'élève des listes du faux hub (les classes de hub-ouverture, et celles de la sonde du lot 1) devient
// « un élève » (le nom entier), « élève » (un mot du nom, ≥ 3 lettres), « élève » (sa forme slug) ; puis la vérification : 0 mot de nom restant (sinon code 1).
import fs from 'fs'; import path from 'path';
const R = path.resolve(process.argv[2]); const { storeOuverture } = await import(path.join(R, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const noms = new Set(); const st = storeOuverture(R, { champs: true }); Object.values(st.classes || {}).forEach(c => (c && c.eleves || []).forEach(n => noms.add(String(n))));
const lot1 = fs.readFileSync(path.join(R, 'LIVRAISONS/DEROULE-01-11/LOT1/sonde-lot1.mjs'), 'utf8'); (lot1.match(/eleves\s*:\s*\[[^\]]*\]/g) || []).forEach(b => (b.match(/'([^']+)'|"([^"]+)"/g) || []).forEach(x => noms.add(x.slice(1, -1))));
const L = [...noms].filter(Boolean).sort((a, b) => b.length - a.length);
const slug = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const mots = [...new Set(L.join(' ').split(/[\s'’-]+/).filter(x => x.length >= 3))].sort((a, b) => b.length - a.length);
const ech = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PROTEGES = new Set(['CLASSE', 'TEST', 'Charles', 'Gaulle', 'DYLAN', 'Bob']);   /* les noms de classe du faux hub, pas des élèves */
const anon = t => { let x = t; L.forEach(n => { x = x.split(n).join('un élève'); }); L.map(slug).filter(s => s.length >= 3).sort((a, b) => b.length - a.length).forEach(s => { x = x.replace(new RegExp('(^|[^a-z0-9])' + ech(s) + '(?![a-z0-9])', 'g'), '$1élève'); });
  mots.filter(m => !PROTEGES.has(m)).forEach(m => { x = x.replace(new RegExp('(^|[^\\p{L}])' + ech(m) + '(?![\\p{L}])', 'giu'), '$1élève'); }); return x; };
let reste = 0;
for (const f of process.argv.slice(3)) { const t = fs.readFileSync(f, 'utf8'); const a = anon(t); if (a !== t) fs.writeFileSync(f, a);
  mots.filter(m => !PROTEGES.has(m)).forEach(m => { const re = new RegExp('(^|[^\\p{L}])' + ech(m) + '(?![\\p{L}])', 'iu'); if (re.test(a)) { reste++; console.log('RESTE ' + f + ' : un mot de nom'); } }); }
console.log(L.length + ' noms, ' + mots.length + ' mots ; ' + (process.argv.length - 3) + ' fichier(s) ; restes : ' + reste); process.exit(reste ? 1 : 0);
