// Mandat L (C16 640) — compare, combinaison par combinaison, le relevé de l'audit global I (03/11, 8.81 : AUDIT-GLOBAL/sorties/audit-I.jsonl)
// et celui de ce jour (sorties/audit-I.jsonl, même sonde rejouée sur la base 1a60c142b). Rien n'est interprété : chaque colonne est lue dans le relevé.
// usage : node comparer.mjs [ancien.jsonl] [neuf.jsonl] [sortie.txt]
import fs from 'fs'; import path from 'path';
const ici = path.dirname(new URL(import.meta.url).pathname);
const ANC = process.argv[2] || path.join(ici, '..', 'AUDIT-GLOBAL', 'sorties', 'audit-I.jsonl');
const NEU = process.argv[3] || path.join(ici, 'sorties', 'audit-I.jsonl');
const lire = f => { const m = new Map(); if (!fs.existsSync(f)) return m; fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).forEach(l => { try { const o = JSON.parse(l); m.set(o.partie + ' ' + o.nom, o); } catch (e) {} }); return m; };
const A0 = lire(ANC), N0 = lire(NEU);
const qui = s => !s ? '?' : /^l’horloge|^l'horloge|attente/.test(s) ? 'horloge' : /mêl/.test(s) ? 'mêlés' : (s.match(/^([A-C])\b/) || [, s.slice(0, 18)])[1];
const dit = d => d ? [d.repTab, d.mainTxt].filter(Boolean).join(' / ').slice(0, 70) : '';
const sigD = o => { if (!o) return null; const r = {}; (o.etapes || []).forEach((e, i) => { const k = (i + 1) + '. ' + e.quoi.replace(/ \(bandeau : .*?\) puis/, ' puis').slice(0, 60); r[k] = qui(e.suit) + (e.pointeur ? ' · pointeur ' + e.pointeur : '') + (e.bandeauB ? ' · bandeau « ' + e.bandeauB + ' »' : '') + (e.B && !e.B.ferme && dit(e.B) ? ' · dit à B « ' + dit(e.B) + ' »' : ''); }); return r; };
const sig = o => { if (!o) return null; if (o.partie === 'Q1D') return sigD(o); const E = o.etapes || []; const eB = E.find(e => /^B .*lance/.test(e.quoi)) || {}; const eA = E.find(e => /^deux ▶ chez A$/.test(e.quoi)) || {};
  const eS = E.find(e => /^B s’arrête/.test(e.quoi)) || {}; const eF = E[E.length - 1] || {}; const dlg = eB.lancement && eB.lancement.dialogue;
  return { 'B lance → tableau': qui(eB.suit), 'A ▶ → tableau': qui(eA.suit), 'B arrête → tableau': qui(eS.suit), 'fin': qui(eF.suit),
    'B lancée': eB.B ? (eB.B.lancee ? (eB.B.test ? 'essai' : eB.B.rep ? 'répét.' : 'heure') : 'non') : '?',
    'modale B': dlg ? ((dlg.texte || '').slice(0, 50) + ' ' + JSON.stringify(dlg.boutons || [])) : '—',
    'dit à B': dit(eB.B) || '—', 'dit à A': dit(eB.A) || '—' }; };
const noms = [...new Set([...A0.keys(), ...N0.keys()])].filter(k => /^Q1D? /.test(k) && N0.has(k));
const L = []; let ch = 0, pareil = 0;
for (const k of noms) { const a = sig(A0.get(k)), n = sig(N0.get(k)); const diff = a ? Object.keys(n).filter(x => a[x] !== n[x]) : Object.keys(n);
  if (diff.length) ch++; else pareil++;
  L.push(k + ' : ' + (diff.length ? 'CHANGÉ (' + diff.map(x => x + ' : « ' + (a ? a[x] : '—') + ' » → « ' + n[x] + ' »').join(' ; ') + ')' : 'pareil') + ' · aujourd’hui : ' + Object.entries(n).map(([x, v]) => x + ' = ' + v).join(' · ')); }
const out = ['Comparaison 03/11 → ' + new Date().toISOString().slice(0, 16) + ' UTC · ' + noms.length + ' cas rejoués · pareil ' + pareil + ' · changé ' + ch, ...L];
fs.writeFileSync(process.argv[4] || path.join(ici, 'sorties', 'comparaison.txt'), out.join('\n') + '\n');   /* mandat Q : [sortie] en 3e argument */ console.log(out.join('\n'));
