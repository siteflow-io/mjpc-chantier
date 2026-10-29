// LE DÉCOUPAGE MÉCANIQUE — E1-a (mandat E1, points 1-3) : la maquette p8-5g en modules dr/*, la production sans le pont.
// usage : node decouper.mjs            (env : MJPC_PROD = index.html de production ; MJPC_MAQ = la maquette p8-5g)
// Rejouable : il réécrit LIVRAISONS/INTEGRATION/index.html et dr/* à partir des deux fichiers de départ (md5 vérifiés).
// Après E1-a, les modules sont la source (E2-E4 y écrivent) : ce script reste la preuve du découpage (NOTE : ce qui est retiré, compté).
// Frontières : celles mesurées par l'audit (AUDIT-DU-MANDAT.md, F6), pas les plages du contrat §6 là où elles sont fausses.
import fs from 'fs'; import path from 'path'; import { createHash } from 'crypto'; import { createRequire } from 'module';
const req = createRequire(import.meta.url);
const acorn = req(process.env.MJPC_ACORN || '/opt/node-tools/node_modules/acorn'); const walk = req(process.env.MJPC_ACORN_WALK || '/opt/node-tools/node_modules/acorn-walk');
const ICI = path.dirname(new URL(import.meta.url).pathname);
// Après E1-a, dr/* et index.html sont la source (E2-E4 y ajoutent leurs blocs) : rejoué, le découpage écrit à part (decoupe/rejoue/), pour preuve — sauf --refaire.
const DEST = (fs.existsSync(path.resolve(ICI, '..', 'index.html')) && !process.argv.includes('--refaire')) ? path.resolve(ICI, 'decoupe', 'rejoue') : path.resolve(ICI, '..');
const PROD = process.env.MJPC_PROD || '/home/user/prod/index.html'; const MAQ = process.env.MJPC_MAQ || '/home/user/work/maquette.html';
const md5 = b => createHash('md5').update(b).digest('hex');
const prodBuf = fs.readFileSync(PROD), maqBuf = fs.readFileSync(MAQ);
if (md5(prodBuf) !== 'ac792b28f40d3a0510e725fc4a6b6985') throw new Error('production : md5 inattendu ' + md5(prodBuf));
if (md5(maqBuf) !== '62d9557ac8fedcfbdd8b157a2588cbee') throw new Error('maquette : md5 inattendu ' + md5(maqBuf));
const RAPPORT = []; const dire = s => { RAPPORT.push(s); console.log(s); };
dire('découpage E1-a · production md5 ' + md5(prodBuf) + ' · maquette md5 ' + md5(maqBuf));

/* ═══ 1 · la maquette ═══ */
const maq = maqBuf.toString('utf8'); const L = maq.split('\n');   // L[i] = ligne i+1
const CL = ['n', 'h', 'd', 'seq', 'c', 'pp', 'ok', 'g', 'err', 'chip', 'warn', 'html'];   // les classes en collision (contrat §7 ; audit F3, F5) → dr-x ; « page » → page dr-page ; « on » gardée
const CLs = new Set(CL);
const jetons = s => s.replace(/(^|\s)([A-Za-z_][\w-]*)(?=\s|$)/g, (m, sp, t) => sp + (CLs.has(t) ? 'dr-' + t : t === 'page' ? 'page dr-page' : t));
const selecteur = s => s.replace(/\.([A-Za-z_][\w-]*)/g, (m, c) => CLs.has(c) ? '.dr-' + c : c === 'page' ? '.dr-page' : m);

/* 1a · le CSS (lignes 4-298) : circonscrit à #dr-zone, classes en collision préfixées */
function decouperSelecteurs(sel){ const out = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(' || ch === '[') d++; if (ch === ')' || ch === ']') d--; if (ch === ',' && d === 0) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out.map(s => s.trim()).filter(Boolean); }
const Z = ':is(#dr-zone,#ses-tab)';   // la zone du déroulé, et la page tableau d'E3 (#ses-tab, ?vue=tableau) qui rend le même mur
function scoper(s){
  s = selecteur(s);
  if (/^:root\b/.test(s)) return s;
  if (s === '*') return Z + ', ' + Z + ' *';
  if (s === 'html' || s === 'body') return Z;
  const cb = s.match(/^\.(vue-atelier|vue-relecture|gel)((?:[.:\[][^\s>+~]*)*)\s+(.*)$/);   // les classes que la maquette pose sur <body> (audit E1 : sinon la règle ne vaut plus)
  if (cb) return 'body.' + cb[1] + cb[2] + ' ' + Z + ' ' + cb[3];
  const m = s.match(/^body((?:[.#:\[][^\s>+~]*)*)(\s*[>+~]?\s*)(.*)$/);
  if (m) return m[3] ? 'body' + m[1] + ' ' + Z + ' ' + m[3] : 'body' + m[1] + ' ' + Z;
  return Z + ' ' + s;
}
function cssScope(css){
  let out = '', i = 0;
  while (i < css.length) {
    if (css.startsWith('/*', i)) { const j = css.indexOf('*/', i + 2); out += css.slice(i, j + 2); i = j + 2; continue; }
    const ob = css.indexOf('{', i); if (ob < 0) { out += css.slice(i); break; }
    const tete = css.slice(i, ob); const t2 = tete.trim();
    // trouve l'accolade fermante correspondante
    let d = 1, k = ob + 1; while (k < css.length && d) { if (css.startsWith('/*', k)) { k = css.indexOf('*/', k + 2) + 2; continue; } if (css[k] === '{') d++; else if (css[k] === '}') d--; k++; }
    const corps = css.slice(ob + 1, k - 1);
    const lead = tete.match(/^\s*/)[0];
    if (/^@(-webkit-)?keyframes/.test(t2) || /^@font-face/.test(t2)) out += tete + '{' + corps + '}';
    else if (/^@(media|supports)/.test(t2)) out += tete + '{' + cssScope(corps) + '}';
    else out += lead + decouperSelecteurs(t2).map(scoper).join(',') + '{' + corps + '}';
    i = k;
  }
  return out;
}
const cssMaq = L.slice(3, 298).join('\n');
const DRCSS = '/* ═══ dr.css — le CSS de la maquette p8-5g (lignes 4-298), circonscrit à #dr-zone (audit E1, F4) ; classes en collision préfixées dr- (F3, F5). Propriété d\'E1 ; les autres ajoutent en fin de fichier, dans un bloc marqué « E<n> ». ═══ */\n'
  + '#dr-zone{position:relative;display:block;width:100%;overflow:hidden}\n#dr-zone.dr-parque{display:none!important}\n'
  + '#dr-zone .dr-cache{display:none!important}\n'
  + '#dr-zone .dr-page{display:revert;min-height:0;position:revert}   /* la règle « page » du site (display:none, min-height:100vh) ne touche pas le déroulé */\n'
  + cssScope(cssMaq) + '\n';

/* 1b · le gabarit (lignes 300-377) : sans les onglets de .haut (ce sont ceux de la barre du site), sans ⚙, sans l'EDT simulé, sans #fsimu */
let gab = L.slice(299, 377).join('\n');
const avantGab = gab.length;
gab = gab.replace(/<span class="onglets">[\s\S]*?<\/span>/, '');
gab = gab.replace(/\s*<button class="btn" id="bsimu"[^>]*>⚙<\/button>/, '');
gab = gab.replace(/<div id="ecran-edt"[\s\S]*?<div id="edt-cases"[^>]*><\/div><\/div><\/div>\n?/, '');
gab = gab.replace(/<div class="fen simu" id="fsimu">[\s\S]*?\n<\/div>\n/, '');
gab = gab.replace('<span class="ou" id="hou"></span>', '<span class="ou" id="hou"></span><button class="btn or" id="dr-lancer" data-lancer="1" title="Lance l\'heure avec la classe proposée : le chrono démarre, la diapo de départ va au mur — depuis l\'emploi du temps, c\'est la case de l\'heure qui lance">▶ Lancer l\'heure</button>');   // contrat §7 : le « Lancer » du Pilotage, [data-lancer="1"] (il vivait dans l'EDT simulé, qui tombe)
for (const id of ['ong-pilotage', 'bsimu', 'ecran-edt', 'fsimu', 's-anim']) if (gab.includes('id="' + id + '"')) throw new Error('gabarit : ' + id + ' subsiste');
gab = gab.replace(/class="([^"]*)"/g, (m, v) => 'class="' + jetons(v) + '"');
if (/<\/script/i.test(gab)) throw new Error('gabarit : </script> en clair');
const DRGAB = '/* ═══ dr-gabarit.js — le corps HTML de la maquette p8-5g (lignes 300-377), sans ses onglets (barre du site), sans ⚙, sans l\'EDT simulé ni #fsimu.\n'
  + '   Créé une fois au chargement, garé dans <body> (#dr-zone.dr-parque) ; la vue Atelier/Pilotage/Relecture le monte dans la zone du site (dr_monter). Propriété d\'E1. ═══ */\n'
  + 'var dr_gabarit = ' + JSON.stringify(gab) + ';\n'
  + '(function(){ var z = document.createElement(\'div\'); z.id = \'dr-zone\'; z.className = \'dr-parque\'; z.innerHTML = dr_gabarit; (document.body || document.documentElement).appendChild(z); DR_MEM_ZONE = z; })();\n';
dire('gabarit : ' + avantGab + ' → ' + gab.length + ' o (onglets, ⚙, #ecran-edt, #fsimu retirés)');

/* 1c · le script (lignes 382-1835) */
const OFF = 381; const code = L.slice(OFF, 1835).join('\n');
const ast = acorn.parse(code, { ecmaVersion: 'latest', locations: true });
const ligne = n => n.loc.start.line + OFF;
const modDe = l => (l >= 382 && l <= 443) ? 'recit' : (l >= 444 && l <= 446) ? 'TOMBE' : (l >= 447 && l <= 972) ? 'socle' : (l >= 973 && l <= 1251) ? 'atelier' : (l >= 1252 && l <= 1322) ? 'socle'
  : (l >= 1323 && l <= 1438) ? 'classe' : (l >= 1439 && l <= 1449) ? 'recit' : (l >= 1450 && l <= 1481) ? 'socle' : (l >= 1482 && l <= 1607) ? 'classe' : (l >= 1608 && l <= 1613) ? 'TOMBE'
  : (l >= 1614 && l <= 1638) ? 'classe' : (l >= 1639 && l <= 1643) ? 'socle' : (l >= 1644 && l <= 1803) ? 'recit' : (l >= 1804 && l <= 1809) ? 'TOMBE' : (l >= 1810 && l <= 1812) ? 'tableau'
  : (l >= 1813 && l <= 1833) ? 'socle' : 'TOMBE';
const src = n => code.slice(n.start, n.end);
// ce qui tombe à l'intérieur des plages gardées (nommé) et ce qui se transforme
const tombeNoeud = n => {
  const s = src(n);
  if (/^let DECALAGE\b|^const HEURES_SIM\b|^let T0\b|^function now\(\)/.test(s)) return 'simulation de l\'horloge (DECALAGE, HEURES_SIM, T0, now)';
  if (/^function (docHtml|videoHtml|loupeSur)\(/.test(s)) return 'E4 (contrat §6 : « + docHtml, videoHtml, loupeSur du rendu ») — dans dr-recit.js d\'E4';
  if (/^\(function normaliserTrame\(\)/.test(s)) return 'normaliserTrame sur DATA (remplacée par dr_normaliserTrame, socle)';
  if (/^\$\('ong-(atelier|pilotage|relecture)'\)\.onclick/.test(s)) return 'les onclick des onglets de la maquette (ce sont ceux de la barre du site : atVuesAller → dr_onglet)';
  return null;
};
const edits = new Map(); const ajoute = (a, b, t) => { const k = a + ':' + b; if (!edits.has(k)) edits.set(k, { a, b, t }); };
const COMPTE = { data: {}, heures: 0, renom: {}, ecoutes: 0, classes: 0 };
const G8 = new Set(['esc', 'prenom', 'presents', 'tirer', 'palier', 'tout', 'garde', 'candidats']);
const DATA_VERS = { seances: 'dr_seances()', activites: 'dr_activites()', notes: 'dr_notes()', travailPrevu: 'dr_travail()', documents: 'dr_documents()', taxo: 'dr_taxo()', classe: 'dr_classe()', chapitre: 'dr_chapitreTitre()', feuilles: 'dr_feuilles()' };
walk.fullAncestor(ast, (n, anc) => {
  const parent = anc[anc.length - 2];
  // DATA.x → l'interface du socle (une ligne = un remplacement, commenté)
  if (n.type === 'MemberExpression' && n.object.type === 'Identifier' && n.object.name === 'DATA' && !n.computed) { const p = n.property.name; if (!DATA_VERS[p]) throw new Error('DATA.' + p + ' sans interface'); if (parent && parent.type === 'AssignmentExpression' && parent.left === n) { ajoute(parent.start, parent.end, DATA_VERS[p] + '/* E1 : lisait ' + code.slice(parent.start, parent.end).replace(/\*\//g, '') + ' — le socle tient l\'objet */'); COMPTE.data[p] = (COMPTE.data[p] || 0) + 1; return; } ajoute(n.start, n.end, DATA_VERS[p] + '/* E1 : lisait DATA.' + p + ' */'); COMPTE.data[p] = (COMPTE.data[p] || 0) + 1; }
  // DATA entier (la fenêtre du tableau le recevait en JSON) → la projection de transport
  if (n.type === 'Identifier' && n.name === 'DATA' && !(parent && parent.type === 'MemberExpression' && parent.object === n)) { ajoute(n.start, n.end, 'dr_donneesVues()/* E1 : lisait DATA */'); COMPTE.data['(entier)'] = (COMPTE.data['(entier)'] || 0) + 1; }
  // HEURES_SIM[h] → dr_heureDe(h)
  if (n.type === 'MemberExpression' && n.object.type === 'Identifier' && n.object.name === 'HEURES_SIM' && n.computed) { ajoute(n.start, n.end, 'dr_heureDe(' + src(n.property) + ')/* E1 : lisait HEURES_SIM */'); COMPTE.heures++; }
  // les huit noms préfixés dr_ (contrat §7 ; audit F2 : ce ne sont pas des collisions, appliqué quand même)
  if (n.type === 'Identifier' && G8.has(n.name)) {
    if (parent && parent.type === 'MemberExpression' && parent.property === n && !parent.computed) return;
    if (parent && (parent.type === 'Property' || parent.type === 'MethodDefinition') && parent.key === n && !parent.computed) { if (parent.shorthand) ajoute(n.start, n.end, n.name + ': dr_' + n.name); return; }
    ajoute(n.start, n.end, 'dr_' + n.name); COMPTE.renom[n.name] = (COMPTE.renom[n.name] || 0) + 1;
  }
  // les écoutes globales : seulement quand le déroulé est à l'écran
  if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && n.callee.property.name === 'addEventListener' && n.callee.object.type === 'Identifier' && (n.callee.object.name === 'document' || n.callee.object.name === 'window')) { ajoute(n.callee.start, n.callee.end, n.callee.object.name === 'document' ? 'dr_ecouteDoc' : 'dr_ecouteWin'); COMPTE.ecoutes++; }
  // ce qu'on ajoutait à <body> va dans la zone (son CSS y est circonscrit)
  if (n.type === 'MemberExpression' && !n.computed && n.object.type === 'MemberExpression' && !n.object.computed && n.object.object.type === 'Identifier' && n.object.object.name === 'document' && n.object.property.name === 'body' && /^(append|appendChild)$/.test(n.property.name)) ajoute(n.object.start, n.object.end, 'dr_zone()/* E1 : lisait document.body */');
});
// les classes en collision, dans le code : attributs class (chaînes et gabarits), classList, sélecteurs, className
const litteraux = n => { const r = []; walk.full(n, x => { if ((x.type === 'Literal' && typeof x.value === 'string') || x.type === 'TemplateElement') r.push(x); }); return r; };
const remplacerDansLit = (x, f) => { if (x.type === 'TemplateElement') { const raw = code.slice(x.start, x.end); const nv = f(raw); if (nv !== raw) { ajoute(x.start, x.end, nv); COMPTE.classes++; } } else { const raw = x.raw; const q = raw[0]; const nv = q + f(raw.slice(1, -1)) + q; if (nv !== raw) { ajoute(x.start, x.end, nv); COMPTE.classes++; } } };
const parties = n => { if (n.type === 'TemplateLiteral') { const r = []; n.quasis.forEach((q, i) => { r.push({ lit: q }); if (n.expressions[i]) r.push({ ex: n.expressions[i] }); }); return r; } if (n.type === 'BinaryExpression' && n.operator === '+') return parties(n.left).concat(parties(n.right)); if (n.type === 'Literal' && typeof n.value === 'string') return [{ lit: n }]; return [{ ex: n }]; };
const vus = new WeakSet();
walk.full(ast, n => {
  if ((n.type === 'TemplateLiteral' || (n.type === 'BinaryExpression' && n.operator === '+')) && !vus.has(n)) {
    if (n.type === 'BinaryExpression') { let x = n; while (x.type === 'BinaryExpression' && x.operator === '+') { vus.add(x); x = x.left; } let y = n; while (y.type === 'BinaryExpression' && y.operator === '+') { vus.add(y); y = y.right; } }
    const P = parties(n); let dans = false, q = null;
    for (const p of P) {
      if (p.lit) { const raw = p.lit.type === 'TemplateElement' ? code.slice(p.lit.start, p.lit.end) : p.lit.raw.slice(1, -1);
        let out = '', i = 0;
        while (i < raw.length) { if (!dans) { const m = /class=(\\?["'])/.exec(raw.slice(i)); if (!m) { out += raw.slice(i); break; } out += raw.slice(i, i + m.index + m[0].length); i += m.index + m[0].length; dans = true; q = m[1]; } else { const j = raw.indexOf(q, i); const seg = j < 0 ? raw.slice(i) : raw.slice(i, j); out += jetons(seg); if (j < 0) { i = raw.length; } else { out += q; i = j + q.length; dans = false; } } }
        if (out !== raw) { if (p.lit.type === 'TemplateElement') ajoute(p.lit.start, p.lit.end, out); else ajoute(p.lit.start, p.lit.end, p.lit.raw[0] + out + p.lit.raw[0]); COMPTE.classes++; } }
      else if (dans) litteraux(p.ex).forEach(x => remplacerDansLit(x, jetons));
    }
  }
  if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed) {
    const m = n.callee.property.name; const surCl = n.callee.object.type === 'MemberExpression' && !n.callee.object.computed && n.callee.object.property.name === 'classList';
    if (surCl && /^(add|remove|toggle|contains|replace)$/.test(m)) (m === 'toggle' ? n.arguments.slice(0, 1) : n.arguments).forEach(a => { if (a.type === 'Literal' && typeof a.value === 'string') { if (a.value === 'page') throw new Error('classList page : à traiter'); remplacerDansLit(a, s => CLs.has(s) ? 'dr-' + s : s); } });
    if (/^(querySelector|querySelectorAll|closest|matches)$/.test(m) && n.arguments[0]) litteraux(n.arguments[0]).forEach(x => remplacerDansLit(x, s => s.replace(/\.([A-Za-z_][\w-]*)/g, (mm, c) => CLs.has(c) ? '.dr-' + c : mm)));
    if (m === 'setAttribute' && n.arguments[0] && n.arguments[0].value === 'class' && n.arguments[1]) litteraux(n.arguments[1]).forEach(x => remplacerDansLit(x, jetons));
  }
  if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && !n.left.computed && n.left.property.name === 'className') litteraux(n.right).forEach(x => remplacerDansLit(x, jetons));
});
// les morceaux : chaque nœud de premier niveau avec ce qui le précède (commentaires de section), dans le module de sa ligne
const MOD = { socle: [], atelier: [], classe: [], tableau: [], recit: [] }; const TOMBES = []; let prec = 0;
const contenu = e => [...edits.values()].some(f => f !== e && f.a <= e.a && f.b >= e.b && (f.a < e.a || f.b > e.b));   // un remplacement à l'intérieur d'un autre (l'affectation à DATA.x et sa lecture) : le plus large l'emporte
const appliquer = (a, b) => { const es = [...edits.values()].filter(e => e.a >= a && e.b <= b && !contenu(e)).sort((x, y) => y.a - x.a); let t = code.slice(a, b); for (const e of es) t = t.slice(0, e.a - a) + e.t + t.slice(e.b - a); return t; };
for (const n of ast.body) {
  const l = ligne(n); let m = modDe(l); const avant = code.slice(prec, n.start); prec = n.end; const pourquoi = m === 'TOMBE' ? 'plage' : tombeNoeud(n);
  if (m === 'TOMBE' || pourquoi) { TOMBES.push({ l, fin: n.loc.end.line + OFF, o: n.end - n.start, quoi: (n.type === 'FunctionDeclaration' ? 'function ' + n.id.name : n.type === 'VariableDeclaration' ? n.kind + ' ' + n.declarations.map(d => d.id.name || '…').join(',') : src(n).slice(0, 50).replace(/\s+/g, ' ')), pourquoi: pourquoi || 'simulation' }); continue; }
  let t = appliquer(n.start, n.end);
  // le calcul des initiales, fait une fois au chargement sur ELEVES en dur → une fonction, rappelée à chaque classe (dr_classe)
  if (/^\(function\(\)\{ const pris = \{\}; ELEVES\.forEach/.test(src(n))) t = 'function dr_initiales(){ Object.keys(PRENOMS).forEach(k => delete PRENOMS[k]); Object.keys(INI).forEach(k => delete INI[k]); /* E1 : la maquette le calculait une fois sur ELEVES en dur */ ' + t.replace(/^\(function\(\)\{/, '').replace(/\}\)\(\);?$/, '') + ' }';
  // l'enregistrement : la maquette le simulait (3 s) ; ici dr_sauve (débounce 900 ms → B/deroule)
  if (/^function marquerModif\(quoi\)\{/.test(src(n))) t = t.replace(/^function marquerModif\(quoi\)\{/, 'function marquerModif(quoi){ dr_sauve(); /* E1 : la maquette simulait l\'enregistrement ; dr_sauve écrit B/deroule (900 ms) */');
  // la barre du site suit la vue de la maquette
  if (/^function voir\(v\)\{/.test(src(n))) t = t.replace(/\}$/, ' dr_suivreBarre(v); /* E1 : la barre fusionnée du site suit la vue */ }');
  // la fenêtre du tableau (E3 la remplace) : elle copiait la première feuille de style de la page — c'est désormais celle du site ; elle reçoit dr.css, et son mur est dans un #dr-zone (le CSS y est circonscrit)
  if (m === 'tableau') { t = t.replace("document.querySelector('style').outerHTML", "'<style>' + dr_cssTableau() + '</style>'/* E1 : lisait la première feuille de la page (celle du site désormais) */"); t = t.replace(";\\nvar S = { si: '", ";\\n' + dr_cotesTableau() + '\\nvar S = { si: '"); t = t.replace('<body><div class="mur tableau" id="mur2"></div>', '<body><div id="dr-zone"><div class="mur tableau" id="mur2"></div></div>'); }
  // la première frappe sous le dernier bloc : le curseur va dans la ligne neuve DANS la même tâche (le redessin du site est plus long : une frappe rapide tombait entre le blur et le focus différé — K9·1)
  t = t.replace("dr_tout(); setTimeout(() => { const nv = $('mur').querySelector('[data-p=\"' + bi + '.0\"]'); if (nv) focaliser(nv); }, 0); }", "dr_tout(); { const nv0 = $('mur').querySelector('[data-p=\"' + bi + '.0\"]'); if (nv0) focaliser(nv0); } /* E1 : tout de suite (le redessin du site est plus long que celui de la maquette) */ setTimeout(() => { const nv = $('mur').querySelector('[data-p=\"' + bi + '.0\"]'); if (nv && document.activeElement !== nv) focaliser(nv); }, 0); }");
  // la colonne du site (ses écrans, en attendant la colonne unique) suit la diapo courante
  t = t.replace(/^function dr_tout\(\)\{/, 'function dr_tout(){ setTimeout(atSomSuivreCourant, 0); /* E1 : la colonne du site suit la diapo (lisait DR.dr_ecranCourant par le pont) */');
  // #fsimu est tombé : il sort des listes de fenêtres à fermer
  t = t.replace(/'fdocs', 'fsimu', /g, "'fdocs', /* E1 : 'fsimu' tombé avec la simulation */ ");
  // l'écran envoyé à la fenêtre du tableau : en clair (les accesseurs ne passent pas postMessage)
  t = t.replace(/ecran: (dr_seances\(\)\/\* E1 : lisait DATA\.seances \*\/\[et\.si\]\.ecrans\[et\.di\])/g, 'ecran: dr_ecranVu($1)/* E1 : l\'écran en clair pour l\'autre document */');
  MOD[m].push(avant.replace(/^\n+/, '\n') + t);
}
// ce qui reste de la simulation dans le code gardé
const reste = Object.entries(MOD).flatMap(([k, a]) => a.map(t => [k, t])).filter(([k, t]) => /\bDECALAGE\b|\bHEURES_SIM\b|\bDATA\b(?!\.\w+\s*\*\/)|\bT0\b/.test(t.replace(/\/\*[\s\S]*?\*\//g, '')));
reste.forEach(([k, t]) => dire('  RESTE DE SIMULATION dans ' + k + ' : ' + (t.replace(/\/\*[\s\S]*?\*\//g, '').match(/.{0,60}\b(DECALAGE|HEURES_SIM|DATA|T0)\b.{0,60}/) || [''])[0]));
dire('maquette : ' + ast.body.length + ' nœuds de premier niveau ; tombés : ' + TOMBES.length + ' (' + TOMBES.reduce((s, x) => s + x.o, 0) + ' o) + DATA (l. 379, ' + L[378].length + ' o) + ELEVES (l. 380, ' + L[379].length + ' o)');
dire('  remplacements DATA : ' + JSON.stringify(COMPTE.data) + ' ; HEURES_SIM : ' + COMPTE.heures + ' ; renommés dr_ : ' + JSON.stringify(COMPTE.renom) + ' ; écoutes globales gardées : ' + COMPTE.ecoutes + ' ; littéraux de classes : ' + COMPTE.classes);

const tete = fs.readFileSync(path.join(ICI, 'decoupe', 'socle-tete.js'), 'utf8');
const ENT = { atelier: 'dr-atelier.js — L\'ATELIER (E1) : les gestes sur la trame, la répétition, les schémas dans l\'atelier, écrire dans la diapo, les notes, la mise en forme (maquette p8-5g l. 973-1251)',
  classe: 'dr-classe.js — LA CLASSE ET L\'HEURE (E2) : la mise en commun, la participation, les notes N, les commentaires, la notion imprévue, la réserve (l. 1323-1438) ; le T-5, la fin d\'heure, la fin de séance (l. 1482-1607) ; l\'ouverture de l\'heure suivante (l. 1614-1638). Découpé par E1 (E1-a), à E2 de le rebrancher.',
  tableau: 'dr-tableau.js — LE TABLEAU (E3) : la fenêtre du vidéoprojecteur (l. 1810-1812), laissée telle quelle (document.write) : E3 la remplace par ?vue=tableau&local=1. Découpé par E1 (E1-a).',
  recit: 'dr-recit.js — LE RÉCIT ET LE PAPIER (E4) : le moteur du récit (l. 382-443), les documents et la vidéo (l. 1439-1449), la relecture (l. 1644-1803). Découpé par E1 (E1-a).' };
const IDS = /(['"#])(pnote|vif-x|vif-pal-(?:in|sug|motifs|note|hist))(?![\w-])/g;   // contrat §7 : les ids de la maquette encore en collision avec le site (le VIF et la palette du pont, à E2) → dr-
const ids = t => t.replace(IDS, '$1dr-$2');
const ecrire = (f, t) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); };
const garde = t => { t = ids(t); if (/<\/script/i.test(t)) t = t.replace(/<\/script/gi, '<\\/script'); return t; };
ecrire(path.join(DEST, 'dr', 'dr.css'), ids(DRCSS));
ecrire(path.join(DEST, 'dr', 'dr-gabarit.js'), ids(DRGAB).replace('DR_MEM_ZONE = z;', 'if (typeof DR_MEM !== \'undefined\') DR_MEM.zone = z;'));
ecrire(path.join(DEST, 'dr', 'dr-socle.js'), garde(tete + '\n/* ═══════════ seconde partie : le code de la maquette p8-5g — le socle (l. 447-972, 1252-1322, 1450-1481, 1640-1643, 1813-1833) ═══════════ */\n' + MOD.socle.join('\n') + '\n'));
/* les modules d'E2-E4 appartiennent à leurs propriétaires (contrat §3) : ils les ont écrits avant E1-a ; la coupe d'E1 est gardée pour mémoire dans decoupe/coupe/ */
for (const k of ['atelier', 'classe', 'tableau', 'recit']) ecrire(k === 'atelier' ? path.join(DEST, 'dr', 'dr-atelier.js') : path.join(DEST === path.resolve(ICI, '..') ? path.join(ICI, 'decoupe', 'coupe') : path.join(DEST, 'coupe'), 'dr-' + k + '.js'), garde('/* ═══ ' + ENT[k] + ' ═══ */\n' + MOD[k].join('\n') + '\n'));
fs.writeFileSync(path.join(ICI, 'decoupe', 'tombes-maquette.json'), JSON.stringify(TOMBES, null, 1));

/* ═══ 2 · la production : le pont tombe, les modules entrent ═══ */
let site = prodBuf.toString('utf8');
const TOMBE_SITE = new Set(('_drAssurerCadre _drEnvelopper _drHabiller _drReconstruire _drPontEtat _drAfficher _drTailleCadre _drQuandPret _drSain _drVerifier drWin _drNormaliserTrame _drFlushTrame _drRechargerSi _drEntreesEcran _drTrameDe _drEcrireTrame _drLibelles _drTitrerColonne '
  + '_drRecollerEtapes _drRefusionner _drMorceauDuDevoilement _drRangDuMorceau _drVueGroupe _drVuePere _drRatioEcran _drLargeurEcran _drPoserContexteMoteur _drCalerStructure atDrVueInterne _drTexteBloc _drEmpreinte _drCoupe atDrModifsDeLaSeance atDrEnrAuto atDrTrameEnregistrer '
  + 'atDrMonter atDrSynchroDebut atDrMajUtile atDrMaintenant atDrCompChange atDrTaxoOptions atDrBrancherSuivi AT_DR_B64 '
  /* ce que le contrat oubliait (audit C4) : la façade du pont et ses restes */
  + 'AT_DR_LONGUEUR AT_DR_SHA256 _drSainTic AT_PONT drDoc _drZoneSuivie _drRaf _drFileAttente DR AT_DRAG_ECR atEcranEnvoyer atEcranDupliquer atEcranSupprimer').split(' '));
const SIGNATURES = [   // instructions de premier niveau qui ne vivaient que par le cadre
  ["document.addEventListener('dragstart',function(ev){ var m=ev.target&&ev.target.closest&&ev.target.closest('.at-ecr[data-ecr]')", 'glisser un écran de la colonne vers une autre séance (atEcranEnvoyer, le cadre)'],
  ["document.addEventListener('dragover',function(ev){ if(!AT_DRAG_ECR)", 'idem'], ["document.addEventListener('drop',function(ev){ if(!AT_DRAG_ECR)", 'idem'], ["document.addEventListener('dragend',function(){ AT_DRAG_ECR=null; });", 'idem'],
  ['/* extension de la TABLE et du ROUTEUR par enveloppes', 'le clic droit des écrans de la colonne (atEcran*) : remplacé par celui du #volet'],
  ['setInterval(function(){ try{_drCalerStructure();}catch(e){} },600);', 'le calage du cadre sur la structure'],
  ["document.addEventListener('change',function(ev){ try{ if(ev.target&&ev.target.id==='at-dr-debut')_drPoserContexteMoteur();", 'le début de la tête de préparation (tombe avec la tête)'],
  ["document.addEventListener('change',function(ev){ try{ if(ev.target&&ev.target.id==='at-dr-classe'&&(ATVUES.vue==='relecture'", 'la classe de la tête, en relecture (tombe avec la tête et la vue du moteur)']];
const blocs = []; { const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g; let m; while ((m = re.exec(site))) blocs.push({ off: m.index + m[0].indexOf(m[1]), code: m[1] }); }
const coupes = []; const RETIRES = []; const remplacer = {}; const NOUV = fs.readFileSync(path.join(ICI, 'decoupe', 'site-fonctions.js'), 'utf8');
acorn.parse(NOUV, { ecmaVersion: 'latest' }).body.forEach(n => { if (n.type === 'FunctionDeclaration') remplacer[n.id.name] = NOUV.slice(n.start, n.end); });
const vusRempl = new Set(); let posB64 = -1;
for (const b of blocs) { let a; try { a = acorn.parse(b.code, { ecmaVersion: 'latest' }); } catch (e) { continue; }
  for (const n of a.body) { const s = b.code.slice(n.start, n.end); const A = b.off + n.start, B = b.off + n.end;
    if (n.type === 'FunctionDeclaration' && TOMBE_SITE.has(n.id.name)) { coupes.push([A, B, '']); RETIRES.push({ nom: n.id.name, o: n.end - n.start }); continue; }
    if (n.type === 'FunctionDeclaration' && remplacer[n.id.name]) { coupes.push([A, B, remplacer[n.id.name]]); vusRempl.add(n.id.name); RETIRES.push({ nom: n.id.name + ' (remplacée)', o: n.end - n.start, apres: remplacer[n.id.name].length }); continue; }
    if (n.type === 'VariableDeclaration') { const noms = n.declarations.map(d => d.id.name); if (noms.every(x => TOMBE_SITE.has(x))) { if (noms.includes('AT_DR_B64')) posB64 = A; coupes.push([A, B, noms.includes('AT_DR_B64') ? '@@MODULES@@' : '']); noms.forEach(x => RETIRES.push({ nom: x, o: n.end - n.start })); continue; } if (noms.some(x => TOMBE_SITE.has(x))) throw new Error('déclaration mêlée : ' + noms.join(',')); }
    const sig = SIGNATURES.find(([g]) => s.includes(g)); if (sig && n.type !== 'FunctionDeclaration') { coupes.push([A, B, '']); RETIRES.push({ nom: 'instruction l.' + site.slice(0, A).split('\n').length + ' — ' + sig[1], o: n.end - n.start }); } } }
for (const k of Object.keys(remplacer)) if (!vusRempl.has(k)) { /* une fonction nouvelle (atVuesMarquer) : posée après atVuesBarreHtml */ const r = coupes.find(c => c[2] === remplacer.atVuesBarreHtml); r[2] += '\n\n' + remplacer[k]; RETIRES.push({ nom: k + ' (nouvelle)', o: 0, apres: remplacer[k].length }); }
if (posB64 < 0) throw new Error('AT_DR_B64 introuvable');
coupes.sort((x, y) => y[0] - x[0]); for (const [A, B, t] of coupes) site = site.slice(0, A) + t + site.slice(B);
const MODULES = '\n</script>\n<!-- ═══ E1-a : le déroulé p8 entre dans le site, en modules (contrat §3), à l\'endroit où vivait AT_DR_B64 (l\'ancien moteur, 229 975 o, tombé avec le pont) ═══ -->\n'
  + '<link rel="stylesheet" href="dr/dr.css">\n' + ['dr-gabarit', 'dr-socle', 'dr-atelier', 'dr-classe', 'dr-tableau', 'dr-recit'].map(m => '<script src="dr/' + m + '.js"></script>').join('\n') + '\n<script>\n';
site = site.replace('@@MODULES@@', MODULES);
// « Modifier » → « Éditer dans l'atelier » (cadrage 4 · 0.3), sur la carte du chapitre
const avantPorte = site.length; site = site.replace("onclick=\"atEditerChapitre(\\''+n+'\\',\\''+num+'\\')\">Modifier</button>", "onclick=\"atEditerChapitre(\\''+n+'\\',\\''+num+'\\')\" title=\"Ouvre le chapitre : sa structure, et l\\u2019atelier o\\u00f9 tu pr\\u00e9pares ses s\\u00e9ances diapo par diapo\">\\u00c9diter dans l\\u2019atelier</button>");
if (site.length === avantPorte) throw new Error('le bouton « Modifier » du chapitre est introuvable');
// la production disait ses écrans « at-dr-iframe » ailleurs ? (doit être 0 hors commentaires)
const restes = ['at-dr-iframe', 'drWin(', 'AT_DR_B64', 'DR.dr_', 'window.DR'].map(k => k + ' : ' + (site.split(k).length - 1)).join(' · ');
dire('site : ' + RETIRES.length + ' retraits/remplacements ; restes (à leurs propriétaires) : ' + restes);
RETIRES.forEach(r => dire('  − ' + r.nom + ' (' + r.o + ' o' + (r.apres != null ? ' → ' + r.apres + ' o' : '') + ')'));
ecrire(path.join(DEST, 'index.html'), site);
dire('index.html : ' + prodBuf.length + ' → ' + Buffer.byteLength(site) + ' o · md5 ' + md5(Buffer.from(site)));
fs.writeFileSync(path.join(ICI, 'decoupe', 'rapport.txt'), RAPPORT.join('\n') + '\n');
