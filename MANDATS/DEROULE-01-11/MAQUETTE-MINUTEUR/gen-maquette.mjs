// Le générateur de la maquette du minuteur (C16 660 ; v2 C16 677 : le chrono P6, « Ce que voit la classe » qui est le tableau) : le site 8.84.0-⑰ lui-même (assemblé de LIVRAISONS/INTEGRATION, la nouveauté écrite
// dans dr/), servi sur le faux hub des sondes (hub-ouverture.mjs), anonymisé, EMBARQUÉ dans la page : aucune requête au réseau.
// usage : node gen-maquette.mjs <sortie.html>
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
import { storeOuverture } from '../../../LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const SORTIE = path.resolve(process.argv[2] || path.join(ici, 'C16-maquette-minuteur-v2.html'));
const TMP = SORTIE + '.assemble.html';
execFileSync('node', [path.join(RACINE, 'AUDITS/INTEGRATION-DEROULE/assembler.mjs'), path.join(RACINE, 'LIVRAISONS/INTEGRATION/index.html'), TMP], { stdio: 'ignore' });
let html = fs.readFileSync(TMP, 'utf8'); fs.unlinkSync(TMP);

/* 1 · la police EB Garamond, embarquée (la copie locale du dépôt, licence OFL) à la place de Google Fonts */
const FD = path.join(RACINE, 'LIVRAISONS/INTEGRATION/E3/outils/eb-garamond');
const ff = fs.readdirSync(FD).filter(f => /^eb-garamond-latin-\d+-(normal|italic)\.woff2$/.test(f)).map(f => { const [, w, st] = /-(\d+)-(normal|italic)/.exec(f);
  return `@font-face{font-family:'EB Garamond';font-style:${st};font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FD, f)).toString('base64')}) format('woff2')}`; }).join('\n');
html = html.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/g, '').replace(/<link[^>]*fonts\.gstatic\.com[^>]*>/g, '');

/* 2 · le faux hub : la copie des sondes, les images du chapitre remplacées par les images locales, les noms d'élèves inventés */
const ranger = v => { if (v === null || v === undefined) return undefined; if (typeof v === 'number' && !isFinite(v)) return undefined; if (typeof v !== 'object') return v;
  const o = {}; (Array.isArray(v) ? v.map((x, i) => [String(i), x]) : Object.entries(v)).forEach(([k, x]) => { const r = ranger(x); if (r !== undefined) o[k] = r; }); return Object.keys(o).length ? o : undefined; };
const st = ranger(storeOuverture(RACINE));
const MED = path.resolve(RACINE, '..', 'medias'); const IMG_OUV = { 'chapitre.png': 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png', 'seance-1.png': 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png' };
const IMG_DEFAUT = 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png'; const URI = {};
const imageDe = u => { const m = /mjpc-medias\/(.*\/)?([^/?"]+\.(png|jpe?g|webp))$/i.exec(u); if (!m) return null; const nom = m[2];
  const f = fs.existsSync(path.join(MED, nom)) ? path.join(MED, nom) : path.join(RACINE, IMG_OUV[nom] || IMG_DEFAUT); if (!fs.existsSync(f)) return null;
  const t = /\.webp$/i.test(f) ? 'image/webp' : /\.png$/i.test(f) ? 'image/png' : 'image/jpeg'; return URI[f] = URI[f] || ('data:' + t + ';base64,' + fs.readFileSync(f).toString('base64')); };
let json = JSON.stringify(st).replace(/https:\/\/siteflow-io\.github\.io\/mjpc-medias\/[^"\\]+/g, u => imageDe(u) || u);
const NOMS = ['MARCHAND', 'LEROUX', 'GAUTIER', 'PERRIN', 'COLIN', 'MOREAU', 'BARBIER', 'RENAUD', 'LEBLANC', 'GUERIN', 'BOYER', 'GARNIER', 'CHEVALIER', 'FRANCOIS', 'LEGRAND', 'GAUTHIER', 'MERCIER', 'BLANC', 'GUILLAUME', 'MULLER', 'HENRY', 'ROUSSEL', 'NICOLAS', 'PERRET', 'MARIE', 'FAURE', 'ROBIN', 'MASSON', 'SANCHEZ', 'NOEL', 'MEYER', 'DUFOUR', 'LUCAS', 'BRUN', 'JOLY'];
const PRENOMS = ['Anna', 'Hugo', 'Lola', 'Noé', 'Inès', 'Gabin', 'Jade', 'Louis', 'Zoé', 'Arthur', 'Mila', 'Jules', 'Rose', 'Adam', 'Léna', 'Sacha', 'Alice', 'Nathan', 'Lou', 'Tom', 'Emma', 'Victor', 'Chloé', 'Maël', 'Nina', 'Paul-Henri', 'Iris', 'Théo', 'Manon', 'Robin', 'Clara', 'Liam', 'Ambre', 'Eliott', 'Romane'];
const vrais = []; Object.entries(st.classes || {}).forEach(([c, v], ci) => ((v && v.eleves) ? Object.values(v.eleves) : []).forEach((n, i) => { if (typeof n !== 'string' || !n.trim()) return;
  const [nom, ...pr] = n.trim().split(' '); vrais.push({ n: n.trim(), nom, pr: pr.join(' '), faux: NOMS[(i + ci * 7) % NOMS.length] + ' ' + PRENOMS[(i * 3 + ci) % PRENOMS.length], c }); }));
vrais.sort((a, b) => b.n.length - a.n.length).forEach(x => { json = json.split(x.n).join(x.faux); if (x.pr) json = json.split(x.pr + ' ' + x.nom).join(x.faux.split(' ').slice(1).join(' ') + ' ' + x.faux.split(' ')[0]); });
vrais.filter(x => /^3/.test(x.c) && x.pr && x.pr !== 'Paul').forEach(x => { json = json.replace(new RegExp('(?<![\\wÀ-ÿ])' + x.pr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\wÀ-ÿ])', 'g'), x.faux.split(' ').slice(1).join(' ')); });
const restants = vrais.filter(x => json.includes(x.n) || html.includes(x.n)).map(x => x.c);
if (restants.length) { console.error('NOMS RÉELS RESTANTS : ' + restants.length); process.exit(2); }

/* 3 · la page : l'horloge au lundi 14/09/2026 09:00 (la classe d'essai), le hub dans la page, rien vers le réseau, l'entrée professeur ouverte */
const BOOT = `(function(){
var RD = Date, off = new RD('2026-09-14T09:00:00+02:00').getTime() - RD.now(), cal = false;
function FD(){ var a = Array.prototype.slice.call(arguments); if (!(this instanceof FD)) return new RD(RD.now() + off).toString(); return a.length ? new (Function.prototype.bind.apply(RD, [null].concat(a)))() : new RD(RD.now() + off); }
FD.prototype = RD.prototype; FD.now = function(){ return RD.now() + off; }; FD.parse = RD.parse; FD.UTC = RD.UTC; window.Date = FD;
/* la fenêtre du tableau se cale sur l'horloge du pilote (même ordinateur) au premier message qui la porte */
window.addEventListener('message', function(e){ var d = e.data; if (!cal && d && typeof d === 'object' && isFinite(d.t) && ((window.opener && e.source === window.opener) || (!window.opener && window.parent !== window && e.source === window.parent))) { off = d.t - RD.now(); cal = true; } }, true);
var H = ${json.replace(/<\/script/gi, '<\\/script')};
function segs(c){ return String(c).split('/').filter(Boolean); }
function fb(v){ if (v == null || typeof v !== 'object') return v; var k = Object.keys(v); var o; if (!Array.isArray(v) && k.length && k.every(function(x){ return /^(0|[1-9]\\d*)$/.test(x); })) { var mx = Math.max.apply(null, k.map(Number)); if (k.length * 2 > mx + 1) { o = []; for (var i = 0; i <= mx; i++) o.push(v[i] === undefined ? null : fb(v[i])); return o; } }
  o = Array.isArray(v) ? [] : {}; k.forEach(function(x){ o[x] = fb(v[x]); }); return o; }   /* comme le vrai hub : des clés 0, 1, 2… reviennent en liste */
function lire(c){ var v = H; var s = segs(c); for (var i = 0; i < s.length; i++) { if (v == null || typeof v !== 'object') return null; v = v[s[i]]; } return v === undefined ? null : fb(v); }
function sv(v){ if (v && typeof v === 'object') { var k = Object.keys(v); if (k.length === 1 && k[0] === '.sv') return RD.now() + off; var o = Array.isArray(v) ? [] : {}; k.forEach(function(x){ o[x] = sv(v[x]); }); return o; } return v; }
function vide(v){ return v == null || (typeof v === 'object' && !Object.keys(v).length); }
function poser(c, v){ var s = segs(c); if (!s.length) { H = vide(v) ? {} : v; return; } var o = H; for (var i = 0; i < s.length - 1; i++) { if (o[s[i]] == null || typeof o[s[i]] !== 'object') o[s[i]] = {}; o = o[s[i]]; }
  if (vide(v)) delete o[s[s.length - 1]]; else o[s[s.length - 1]] = JSON.parse(JSON.stringify(v)); }
var ES = []; function pousser(c){ ES.forEach(function(e){ if (e.ferme) return; var a = e.c, b = c; if (a.indexOf(b) === 0 || b.indexOf(a) === 0) setTimeout(function(){ e.emettre(); }, 0); }); }
function chemin(u){ return decodeURIComponent(String(u).split('firebasedatabase.app')[1].split('?')[0].replace(/\\.json$/, '')).replace(/\\/+$/, ''); }
window.__MAQ_HORS = 0;
window.fetch = function(u, o){ var s = String(u && u.url || u); if (s.indexOf('firebasedatabase.app') >= 0) { var c = chemin(s), m = ((o && o.method) || 'GET').toUpperCase(), bd = null;
    if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
    try { bd = sv(JSON.parse((o && o.body) || 'null')); } catch (e) {}
    if (m === 'POST') { var id = '-M' + (RD.now() + off).toString(36) + Math.random().toString(36).slice(2, 8); poser(c + '/' + id, bd); pousser(c); return Promise.resolve(new Response(JSON.stringify({ name: id }), { status: 200 })); }
    if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(function(k){ poser(c + '/' + k, bd[k]); }); else poser(c, m === 'DELETE' ? null : bd);
    pousser(c); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); }
  window.__MAQ_HORS++; return Promise.resolve(new Response('null', { status: 200 })); };
window.EventSource = function(u){ var self = this; this.l = {}; this.ferme = false; this.onerror = null; this.readyState = 1; var s = String(u);
  this.addEventListener = function(t, f){ (self.l[t] = self.l[t] || []).push(f); }; this.removeEventListener = function(){}; this.close = function(){ self.ferme = true; self.readyState = 2; };
  if (s.indexOf('firebasedatabase.app') < 0) { window.__MAQ_HORS++; setTimeout(function(){ if (self.onerror) self.onerror({}); }, 0); return; }
  this.c = chemin(s); this.emettre = function(){ if (self.ferme) return; var ev = { data: JSON.stringify({ path: '/', data: lire(self.c) }) }; (self.l.put || []).forEach(function(f){ try { f(ev); } catch (x) {} }); };
  ES.push(this); setTimeout(this.emettre, 0); };
window.WebSocket = function(){ throw new Error('hors maquette'); };
try { navigator.sendBeacon = function(){ window.__MAQ_HORS++; return true; }; } catch (e) {}
var XO = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(m, u){ this.__hors = true; window.__MAQ_HORS++; return XO.apply(this, arguments); };
var XS = XMLHttpRequest.prototype.send; XMLHttpRequest.prototype.send = function(){ if (this.__hors) return; return XS.apply(this, arguments); };
var q = new URLSearchParams(location.search); var tableau = q.get('vue') === 'tableau';
if (!tableau && !q.get('n')) try { history.replaceState(null, '', location.pathname + '?n=3e'); } catch (e) {}
var st = document.createElement('style'); st.textContent = ${JSON.stringify(ff)} + '\\n#fi-overlay{display:none!important}'; document.documentElement.appendChild(st);
if (!tableau) window.addEventListener('load', function(){ setTimeout(function(){ document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true;
  ['fi-overlay', 'm8-regles-overlay'].forEach(function(i){ var o = document.getElementById(i); if (o) o.remove(); }); setTimeout(function(){ var b = document.getElementById('tprof-btn'); if (b) b.click(); }, 300); }, 1500); });
})();`;
html = html.replace(/<head[^>]*>/i, m => m + '\n<script>/* MAQUETTE C16 · minuteur : faux hub embarqué, horloge au 14/09/2026 09:00, aucune requête au réseau */' + BOOT + '</script>');
fs.writeFileSync(SORTIE, html);
console.log('maquette : ' + SORTIE + ' · ' + (fs.statSync(SORTIE).size / 1e6).toFixed(2) + ' Mo · élèves renommés : ' + vrais.length + ' · images embarquées : ' + Object.keys(URI).length);
