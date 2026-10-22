// E2 (22/10, prompt §1.2) : `edtHeuresPour` — la frontière posée dans la trame fait foi, sinon le quotient hors fin d'heure.
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const prendre = n => { const i = src.indexOf('\nfunction ' + n + '('); const j = src.indexOf('\n}', i); return src.slice(i, j + 2); };
const code = prendre('edtMinutes') + prendre('edtTempsUtile') + prendre('edtHeuresPour') + '\nreturn edtHeuresPour;';
const edtHeuresPour = new Function(code)();
const hub = JSON.parse(fs.readFileSync(new URL('../../../../AUDITS/INTEGRATION-DEROULE/hub/site_3e.json', import.meta.url), 'utf8'));
const d = (E) => ({ deroule: { ecrans: E } });
const fin = h => ({ act: 'Fin d\'heure', dur: 5, heure: h, role: 'fin', blocs: [] });
const cas = [
  ['faux hub · séance 0 (110 min, sans heure) → 3', edtHeuresPour(hub.chapitres[0].seances[0], null), 3],
  ['faux hub · séance 5 (55 min, sans heure) → 2', edtHeuresPour(hub.chapitres[0].seances[5], null), 2],
  ['faux hub · séance 0, créneau 08:57-09:52 → 3', edtHeuresPour(hub.chapitres[0].seances[0], '08:57-09:52'), 3],
  ['prompt · trois heures posées pleines (3 × 50 + 3 fins) → 3', edtHeuresPour(d([{ act: 'a', dur: 50, heure: 1 }, fin(1), { act: 'r', dur: 5, heure: 2, role: 'reactivation' }, { act: 'b', dur: 45, heure: 2 }, fin(2), { act: 'r', dur: 5, heure: 3, role: 'reactivation' }, { act: 'c', dur: 40, heure: 3 }, { act: 'bilan', dur: 5, heure: 3, role: 'bilan' }, fin(3)]), null), 3],
  ['prompt · une heure pleine posée (50 + fin 5) → 1', edtHeuresPour(d([{ act: 'a', dur: 30, heure: 1 }, { act: 'b', dur: 20, heure: 1 }, fin(1)]), null), 1],
  ['prompt · trois heures posées légères (25 min chacune) → 3', edtHeuresPour(d([{ act: 'a', dur: 25, heure: 1 }, fin(1), { act: 'b', dur: 25, heure: 2 }, fin(2), { act: 'c', dur: 25, heure: 3 }, fin(3)]), null), 3],
  ['sans heure, 90 min + 2 fins → quotient 2', edtHeuresPour(d([{ act: 'a', dur: 45 }, fin(1), { act: 'b', dur: 45 }, fin(2)]), null), 2],
  ['heure en chaîne « 2 » (tolérée par Number) → 2', edtHeuresPour(d([{ act: 'a', dur: 10, heure: '1' }, { act: 'b', dur: 10, heure: '2' }]), null), 2],
  ['trame vide → 1', edtHeuresPour(d([]), null), 1],
];
let ko = 0; cas.forEach(([l, v, att]) => { const ok = v === att; if (!ok) ko++; console.log((ok ? 'ok  ' : 'KO  ') + l + ' : ' + v); });
console.log(ko ? 'ROUGE (' + ko + ')' : 'VERT'); process.exit(ko ? 1 : 0);
