/* ═══ E1-a — LA COUPE DE LA MAQUETTE POUR LE TERRITOIRE D'E2 (maquette p8-5g l. 1323-1438, 1482-1607, 1614-1638), posée par le découpage d'E1
   (mandat E1 point 2 ; contrat §3 : les modules d'E2-E4 « existent dès E1-a, remplis par le découpage »). E2 avait déjà écrit son module : il suit,
   INTACT, à partir de « dr-classe.js — E2 » ; chargé après, il l'emporte sur tout nom qu'il redéclare. Aucun let/const en double (mesuré).
   Les lectures de DATA / HEURES_SIM y sont déjà remplacées par les interfaces du socle (commentées « E1 : lisait … »). À E2 de fondre les deux. ═══ */

// ───────── mise en commun : réponses au fil de la frappe ─────────
const plat = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function dr_candidats(v){ v = plat((v || '').trim()); if (!v) return []; return ELEVES.filter(e => nomPresent(e)).filter(e => { const [nom, ...pr] = e.split(' '); const p2 = plat(pr.join(' ')); const n2 = plat(nom); return (n2.startsWith(v[0]) && (v.length < 2 || p2.startsWith(v.slice(1)))) || plat(e).startsWith(v) || p2.startsWith(v) || (p2[0] === v[0] && v.length >= 2 && n2.startsWith(v[1])); }); }

function brancherFin(){ const h = S.heure; const cd = mur.querySelector('.corpsd.cahier'); if (cd) cd.classList.toggle('grand', (S.cahierGrand || {})[h] !== false); const ag = mur.querySelector('[data-agrandir]'); if (ag) ag.onclick = () => { S.cahierGrand = S.cahierGrand || {}; S.cahierGrand[h] = (S.cahierGrand[h] === false); journal(S.cahierGrand[h] ? 'cahier-agrandi' : 'cahier-reduit', { h }); dr_tout(); }; mur.querySelectorAll('[data-rv]').forEach(b => b.onclick = () => { if (((S.recitVersion || {})[h] || 'site') !== b.dataset.rv) basculerRecit(h, b.dataset.rv); }); const re = mur.querySelector('#ed-recit-edit'); if (re) { re.oninput = () => { S.recitMoi = S.recitMoi || {}; S.recitMoi[h] = re.innerHTML; if (!S._rvT) S._rvT = setTimeout(() => { S._rvT = null; poserVersion(h, re.innerHTML); journal('recit-modifie', { h }); dr_tout(); }, 800); }; re.onkeydown = ev => { ev.stopPropagation(); }; } const rp = mur.querySelector('#rv-reprendre'); if (rp) rp.onclick = () => reprendreSuite(h); const u = mur.querySelector('#rv-undo'), r = mur.querySelector('#rv-redo'); if (u && r) { const v = versionsDe(h); u.disabled = v.k <= 0; r.disabled = v.k >= v.l.length - 1; u.onclick = () => { const v = versionsDe(h); if (v.k > 0) { v.k--; S.recitMoi[h] = v.l[v.k].html; journal('recit-version-precedente', { h }); dr_tout(); } }; r.onclick = () => { const v = versionsDe(h); if (v.k < v.l.length - 1) { v.k++; S.recitMoi[h] = v.l[v.k].html; journal('recit-version-suivante', { h }); dr_tout(); } }; }
  const carte = mur.querySelector('.ed-carte'); if (carte) { const max = () => Math.max(1, carte.scrollHeight - carte.clientHeight); const r = (S.cahierScroll || {})[h] || 0; if (Math.abs(carte.scrollTop - r * max()) > 2) carte.scrollTop = r * max(); carte.onscroll = () => { S.cahierScroll = S.cahierScroll || {}; const ratio = carte.scrollTop / max(); if (Math.abs((S.cahierScroll[h] || 0) - ratio) < 0.002) return; S.cahierScroll[h] = ratio; if (ratio >= 0.97 && !(S.recitRelu || {})[h] && S.finVue === 'contenu' && !S.preparation && ecran().role === 'fin') { S.recitRelu = S.recitRelu || {}; S.recitRelu[h] = true; journal('recit-relu', { h, par: 'défilement' }); if (S.enFin) setTimeout(() => ouvrirFin(true), 100); } if (!S._scT) S._scT = setTimeout(() => { S._scT = null; const etc = etatComplet(); pousser(etc); try { vueDroite(etc); } catch (e) {} }, 60); }; }
  const ed = mur.querySelector('#ed-edit'); if (ed) { ed.oninput = () => { S.travailEdite = S.travailEdite || {}; S.travailEdite[S.heure] = ed.innerText; if (!S._edT) S._edT = setTimeout(() => { S._edT = null; journal('travail-edite', { texte: S.travailEdite[S.heure] }); dr_tout(); }, 800); }; } mur.querySelectorAll('[data-onglet]').forEach(o => o.onclick = () => { S.finVue = o.dataset.onglet; journal('cahier-onglet', { onglet: S.finVue, di: S.di }); dr_tout(); }); }

function brancherAjout(){ /* repris de l'ancien (moteur L648-656, ligne() L1441) : la ligne EST le champ ; la frappe part au tableau à la lettre (cadrage 4.2) */
  mur.querySelectorAll('.rep[data-r]').forEach(rep => { const bi = +rep.dataset.bi, ri = +rep.dataset.r; const ini = rep.querySelector('.ini'), dit = rep.querySelector('.dit'); if (!ini || !dit || !ini.isContentEditable) return;
    const d = etatDiapo(); const ligne = () => { d.reps[bi] = d.reps[bi] || []; if (!d.reps[bi][ri]) d.reps[bi][ri] = { i: '', r: '', eleve: null, refo: false, t: now(), heure: S.heure }; return d.reps[bi][ri]; };
    ini.oninput = () => { const r = ligne(); const l = dr_candidats(ini.textContent); r.eleve = l.length === 1 ? nomDe(l[0]) : null; r.i = r.eleve ? iniDe(r.eleve) : ini.textContent.trim().toUpperCase(); ini.classList.toggle('vide', !r.i); S.blocActif = bi; S._garderFocus = { bi, ri, quoi: 'ini' }; if (r.r) dr_tout(); };
    ini.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === 'Tab') { ev.preventDefault(); const r = ligne(); if (!r.eleve && ini.textContent.trim()) { const l = dr_candidats(ini.textContent); if (l.length) { r.eleve = nomDe(l[0]); r.i = l[0]; ini.textContent = r.i; ini.classList.remove('vide'); } } dit.focus({ preventScroll: true }); } if (ev.key === 'Escape') { ev.stopPropagation(); ini.blur(); } };
    ini.ondblclick = ev => { ev.preventDefault(); const r = ligne(); if (!r.r) return; r.refo = !r.refo; journal('reponse-reformulee', { eleve: r.eleve, refo: r.refo }); S._garderFocus = { bi, ri, quoi: 'ini' }; dr_tout(); };
    dit.oninput = () => { const r = ligne(); const av = r.r; r.r = dit.textContent; S.blocActif = bi; S._garderFocus = { bi, ri, quoi: 'dit' }; dr_tout(); };
    dit.onkeydown = ev => { if (ev.key === 'Enter') { ev.preventDefault(); const r = ligne(); if (!r.r.trim()) return; r.validee = true; if (r.eleve) journal('parole', { nom: r.eleve, m: 'reponse' }); S.derniere = { type: 'reponse' }; S.blocActif = bi; S._garderFocus = { bi, ri: ri + 1, quoi: 'ini' }; dr_tout(); } if (ev.key === 'Escape') { ev.stopPropagation(); dit.blur(); } };
    dit.onfocus = () => { S.blocActif = bi; }; });
  if (S._garderFocus) { const g = S._garderFocus; const rep = mur.querySelector(`.rep[data-bi="${g.bi}"][data-r="${g.ri}"]`); if (rep) { const c = rep.querySelector(g.quoi === 'ini' ? '.ini' : '.dit'); if (c && document.activeElement !== c) { c.focus({ preventScroll: true }); const sel = window.getSelection(); const rg = document.createRange(); rg.selectNodeContents(c); rg.collapse(false); sel.removeAllRanges(); sel.addRange(rg); } } S._garderFocus = null; } }

// ───────── PARTICIPATION — le dispositif de l'ancien, repris tel quel : le panneau d'initiales (moteur L770-779), l'historique (L1099-1112), la fiche d'élève (ouvrirPart, corrigePart, posePart, supPart, allerRep), le VIF du pont (L16417-16498), la palette Maj+Espace du pont (L16517-16621) ─────────
const trierIni = t => String(t).toUpperCase().replace(/[^A-Z]/g, '').split('').sort().join('');

function dr_candidats(t){ /* le pont : « TM » trouve « MT » (anagramme dès 2 lettres), sinon préfixe des initiales ou du prénom ; jamais un absent */
  t = String(t || '').trim(); if (!t.length) return []; const E = ELEVES.filter(n => !absentA(n)).map(iniDe); const tt = trierIni(t), tu = t.toUpperCase(); const tp = plat(t);
  const ex = E.filter(x => x === tu); if (ex.length) return ex;
  const meme = t.length >= 2 ? E.filter(x => trierIni(x) === tt) : []; if (meme.length) return meme;
  return E.filter(x => x.indexOf(tu) === 0 || plat(PRENOMS[x] || '').indexOf(tp) === 0); }

function ouTexte(di){ const e = seance().ecrans[di]; if (!e) return ''; const q = e.blocs.find(b => b.t === 'question' && b.txt); if (q) { const t = q.txt.replace(/^Question\s*\d*\s*[—-]?\s*/, '').trim(); return e.act + ' · ' + (t.length > 60 ? t.slice(0, 58) + '…' : t); } return e.act; }

function histoire(ini){ /* l'historique COMPLET d'un élève : ses réponses retenues ET ses prises sans réponse (moteur L1099) */
  const nom = nomDe(ini); const out = [];
  seance().ecrans.forEach((e, di) => { const st = parDiapo[K(di)]; if (!st) return; e.blocs.forEach((b, bi) => (st.reps[bi] || []).forEach((r, k) => { if (!r.r || (r.eleve !== nom && String(r.i || '').toUpperCase() !== ini)) return; out.push({ genre: 'réponse', ecran: di, h: heureDiapo(di), ou: ouTexte(di), texte: r.r.trim(), refo: !!r.refo, k, bi }); })); });
  S.parts.forEach(o => { if (o.nom === nom) out.push({ genre: 'parole', ecran: o.di - 1, h: o.h, ou: o.ou || ouTexte(o.di - 1), type: o.m, note: o.note, id: o.id }); });
  out.sort((x, y) => (x.ecran - y.ecran) || 0); return out; }

function heureDiapo(di){ const ev = J.find(x => x.type === 'diapo' && x.di === di); return ev ? hhmm(ev.t) : hhmm(); }

function partAjoute(ini, type, note){ const nom = nomDe(ini); if (!nom) return null; const o = { id: 'p' + Math.random().toString(36).slice(2, 8), nom, m: type, note: note || '', di: diapoAuMur() + 1, eid: seance().ecrans[diapoAuMur()].eid, ou: ouTexte(diapoAuMur()), h: hhmm(), heure: S.heure, t: now() }; S.parts.push(o); journal('parole', { nom, m: type, note: o.note }); S.derniere = { type: 'parole' }; participation(); vifDernier(ini, o.id); return o; }

function partRetire(ini, id){ if (ini === null) ini = undefined; const k = S.parts.findIndex(o => o.id === id); if (k < 0) return; const o = S.parts.splice(k, 1)[0]; journal('parole-supprimee', { nom: o.nom, m: o.m }); participation(); }

let partEleve = null, gardeMenu = 0;

function participation(){ /* le panneau : les initiales, vert = a répondu, pointillé = a parlé, le compteur ; les muets d'abord, en ambre (le pont L16471-16479) */
  const parle = new Set(S.parts.map(p => p.nom)); const rep = new Set(); Object.keys(parDiapo).forEach(k => Object.values(parDiapo[k].reps || {}).forEach(l => l.forEach(r => { if (r.eleve && r.r) rep.add(r.eleve); })));
  $('presents').textContent = `${[...parle, ...rep].filter((x, i, a) => a.indexOf(x) === i).length} sur ${dr_presents()} présents`;
  const items = ELEVES.map(n => { const ini = iniDe(n); const hist = histoire(ini); const nb = hist.length; const nrep = hist.filter(o => o.genre === 'réponse').length;
    const titre = hist.map(o => o.h + ' · ' + o.ou + ' — ' + (o.genre === 'réponse' ? ('« ' + o.texte.slice(0, 50) + ' »' + (o.refo ? ' (reformulée)' : '')) : ((MOTIFS_PART.find(m => m.c === o.type) || { l: o.type }).l + (o.note ? ' — ' + o.note : '')))).join(' · ');
    const seg = S.appel[n] || []; return { n, ini, nb, nrep, titre, abs: absentA(n), seg }; });
  const muets = items.filter(x => !x.nb), autres = items.filter(x => x.nb); /* muets d'abord */
  poserHtml($('part'), [...muets, ...autres].map(x => `<span class="${x.nrep ? 'dr-ok' : ''}${x.nb && !x.nrep ? ' oral' : ''}${!x.nb ? ' muet' : ''}${x.abs ? (x.seg.length && x.seg[x.seg.length - 1].type === 'parti' ? ' parti' : ' abs') : ''}${(S.vifCands || []).includes(x.ini) ? ' cand' : ''}" data-ini="${x.ini}" data-e="${dr_esc(x.n)}" title="${dr_esc(x.n)}${x.titre ? ' — ' + dr_esc(x.titre) : ''}${x.seg.map(s => ' · ' + s.type + ' ' + hhmm(s.t) + (s.raison ? ' (' + s.raison + ')' : '')).join('')}">${dr_iniVu(x.ini)}${x.nb ? `<i class="pastoral${x.nrep ? ' v' : ''}">${x.nb}</i>` : ''}</span>`).join(''));
  $('part').querySelectorAll('span[data-ini]').forEach(sp => { sp.onclick = ev => { ev.stopPropagation(); ouvrirPart(sp.dataset.ini); }; }); }

function quiAParticipe(){ /* réponses au tableau + prises de parole, par élève (ce que comptent les pastilles) */ const c = {}; S.parts.forEach(p => { c[p.nom] = (c[p.nom] || 0) + 1; }); Object.keys(parDiapo).forEach(k => Object.values(parDiapo[k].reps || {}).forEach(l => l.forEach(r => { if (r.eleve && r.r) c[r.eleve] = (c[r.eleve] || 0) + 1; }))); return ELEVES.filter(n => c[n]).map(n => ({ p: prenomUnique(n), n: c[n] })); }

function dr_ppopEcarter(p){ /* E2 (réveil n°3) : la fiche d'élève ne couvre pas les boutons de la fin de l'heure — elle se pose à côté du volet, sinon au-dessus */
  const pr0 = p.getBoundingClientRect(); if (pr0.height) p.style.top = Math.max(8, Math.min(parseFloat(p.style.top) || 0, innerHeight - pr0.height - 8)) + 'px'; if (pr0.width) p.style.left = Math.max(8, Math.min(parseFloat(p.style.left) || 0, innerWidth - pr0.width - 8)) + 'px'; { const q = p.getBoundingClientRect(); if (q.right > innerWidth - 8) p.style.left = Math.max(8, (parseFloat(p.style.left) || 0) - (q.right - innerWidth + 8)) + 'px'; }   /* toujours entière dans l'écran (sa largeur suit sa place : on remesure) */
  const f = document.getElementById('droite-fin') && document.getElementById('droite-fin').offsetParent ? document.getElementById('droite-fin') : document.getElementById('fin'); if (!f || !f.offsetParent) return; const fr = f.getBoundingClientRect(), pr = p.getBoundingClientRect(); const w = pr.width || 320, hh = pr.height || 320;
  const l = parseFloat(p.style.left) || 0, tp = parseFloat(p.style.top) || 0; if (l + w <= fr.left || l >= fr.right || tp + hh <= fr.top || tp >= fr.bottom) return;
  if (fr.left - w - 8 >= 8) p.style.left = (fr.left - w - 8) + 'px'; else if (fr.right + w + 8 <= innerWidth) p.style.left = (fr.right + 8) + 'px'; else p.style.top = Math.max(8, fr.top - hh - 8) + 'px'; }
function dr_iniVu(ini){ /* E2 (réveil n°3, C1 4b.4) : les suffixes « LC2 » disparaissent à l'écran — deux élèves aux mêmes initiales se départagent par le début du prénom ; la clé (INI, socle) reste unique */
  const b = String(ini || '').replace(/\d+$/, ''); const dup = Object.keys(INI).filter(n => String(INI[n]).replace(/\d+$/, '') === b).length > 1; if (!dup) return dr_esc(b);
  return dr_esc(b) + '<small class="dr-ini-p">' + dr_esc(String(PRENOMS[ini] || '').slice(0, 3)) + '</small>'; }
function ouvrirPart(ini){ /* la fiche d'élève de l'ancien (moteur ouvrirPart) */
  if (partEleve !== ini || !$('ppop').classList.contains('on')) DR_CL.vifMotif = null; partEleve = ini; const p = $('ppop'); const hist = histoire(ini); const P = PRENOMS[ini] || ini; let h = `<h4>${dr_iniVu(ini)} — ${hist.length} prise${hist.length > 1 ? 's' : ''} de parole <span style="color:#8a7660;font-weight:400">· ${dr_esc(P)}</span></h4>`;
  if (hist.length) h += '<div class="hist2">' + hist.map(o => o.genre === 'réponse' ? `<div class="hl"><span class="hg r">réponse</span><b>${o.h}</b> · ${dr_esc(o.ou)}<div class="hq">« ${dr_esc(o.texte.length > 70 ? o.texte.slice(0, 68) + '…' : o.texte)} »${o.refo ? ' <i>reformulée</i>' : ''}</div><span class="hx" title="se corrige dans l'écran" data-aller="${o.ecran}|${o.bi}|${o.k}">→</span></div>` : `<div class="hl"><span class="hg p">parole</span><b>${o.h}</b> · ${dr_esc(o.ou)}<div class="hq">${dr_esc((MOTIFS_PART.find(m => m.c === o.type) || { l: o.type }).l)}${o.note ? ' <i>(' + dr_esc(o.note) + ')</i>' : ''}</div><span class="hx" title="corriger" data-corr="${o.id}">✎</span><span class="hx sup" title="retirer" data-sup="${o.id}">✕</span></div>`).join('') + '</div>';
  h += '<div class="hsep">Noter une prise de parole ici :</div>'; MOTIFS_PART.forEach(m => { h += `<button class="m" data-pose="${m.c}">${m.l}</button>`; });
  h += '<input id="dr-pnote" placeholder="pourquoi (facultatif — pour toi seul)" autocomplete="off" title="La note de cette prise de parole ; Entrée pose">'; h += '<div id="dr-pdit" class="hist" style="color:#c99a4e"></div>';
  h += '<div class="hist" style="color:#5c4f42">Ces notes ne partent jamais au tableau. Elles rejoignent le profil de l\'élève.</div>';
  p.innerHTML = h;
  const el = $('part').querySelector(`span[data-ini="${ini}"]`); const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, bottom: 200 }; p.style.left = Math.max(8, Math.min(r.left - 40, innerWidth - 330)) + 'px'; p.style.top = Math.min(r.bottom + 6, innerHeight - 330) + 'px'; dr_vifDire(); if (DR_CL.vifMotif) p.querySelectorAll('button.m[data-pose]').forEach(b => b.classList.toggle('dr-choisi', b.dataset.pose === DR_CL.vifMotif));
  gardeMenu = Date.now() + 400; p.classList.add('on'); dr_ppopEcarter(p); requestAnimationFrame(() => dr_ppopEcarter(p)); setTimeout(() => dr_ppopEcarter(p), 80);   /* placée une fois affichée : sa vraie taille (elle n'en a qu'au rendu suivant) */
  p.querySelectorAll('[data-pose]').forEach(b => b.onclick = () => posePart(b.dataset.pose)); p.querySelectorAll('[data-sup]').forEach(b => b.onclick = () => { partRetire(ini, b.dataset.sup); ouvrirPart(ini); }); p.querySelectorAll('[data-corr]').forEach(b => b.onclick = () => corrigePart(ini, b.dataset.corr));
  p.querySelectorAll('[data-aller]').forEach(b => b.onclick = () => { const [di, bi, k] = b.dataset.aller.split('|').map(Number); p.classList.remove('on'); aller(di); setTimeout(() => { const el2 = mur.querySelector(`.rep[data-bi="${bi}"][data-r="${k}"] .dit`); if (el2) { el2.contentEditable = 'true'; el2.focus(); } }, 200); }); }

function posePart(type){ const n = $('dr-pnote'); partAjoute(partEleve, type, n ? n.value.trim() : ''); $('ppop').classList.remove('on'); DR_CL.vifMotif = null; }

function corrigePart(ini, id){ const o = S.parts.find(x => x.id === id); if (!o) return; const p = $('ppop'); let h = `<h4>${ini} — corriger</h4><div class="hsep">${o.h} · ${dr_esc(o.ou || '')}</div>`;
  MOTIFS_PART.forEach(m => { h += `<button class="m${m.c === o.m ? ' on' : ''}" data-maj="${m.c}">${m.l}</button>`; }); h += `<input id="pnote2" value="${dr_esc(o.note || '')}" placeholder="pourquoi (pour toi seul)"><button class="m" data-maj="">valider la note</button><button class="m sup" data-sup2="1">retirer cette prise de parole</button>`;
  p.innerHTML = h; p.querySelectorAll('[data-maj]').forEach(b => b.onclick = () => { if (b.dataset.maj) o.m = b.dataset.maj; o.note = ($('pnote2') || {}).value || o.note; journal('parole-corrigee', { nom: o.nom, m: o.m }); participation(); ouvrirPart(ini); }); p.querySelector('[data-sup2]').onclick = () => { partRetire(ini, id); ouvrirPart(ini); }; }

dr_ecouteDoc('click', ev => { if (Date.now() < gardeMenu) return; if (!ev.target.closest('#ppop')) $('ppop').classList.remove('on'); });

/* E2 (réveil n°4, point 4 ; C1 4b.1, 4b.4) : le dispositif du pont — initiales, puis 1/2/3 (choisit le motif, ne pose pas), la note, Entrée → UNE pose ;
   le chiffre choisit tant qu'aucun motif n'est choisi (dans le VIF, la note ou hors saisie), ensuite il s'écrit dans la note ; la fiche dit ce qu'Entrée posera.
   Avant : le chiffre posait aussitôt (note vide) et la note tapée ensuite repartait en initiales. Un clic sur un motif pose tout de suite, comme avant. */
dr_ecouteDoc('keydown', ev => { const pop = $('ppop'); if (!pop.classList.contains('on')) return; const bts = Array.from(pop.querySelectorAll('button.m[data-pose]')); const tg = ev.target || {}; const id = tg.id;
  const revenir = () => { $('vif').value = ''; S.vifCands = []; const sg = $('vif-sug'); if (sg) sg.innerHTML = ''; setTimeout(() => $('vif').focus({ preventScroll: true }), 60); };
  if (/^[1-9]$/.test(ev.key) && !ev.ctrlKey && !ev.metaKey && !ev.altKey) { const horsSaisie = !/input|textarea/i.test(tg.tagName || ''); const dansVif = id === 'vif' && dr_candidats(tg.value).length === 1;
    if (!DR_CL.vifMotif && (horsSaisie || dansVif || id === 'dr-pnote')) { const b = bts[+ev.key - 1]; if (b) { dr_vifChoisir(b.dataset.pose); ev.preventDefault(); ev.stopPropagation(); } return; } }
  if (ev.key === 'Enter' && (id === 'dr-pnote' || id === 'vif') && partEleve) { const m = DR_CL.vifMotif || (bts[0] && bts[0].dataset.pose); if (m) { posePart(m); revenir(); } ev.preventDefault(); ev.stopPropagation(); return; }
  if (ev.key === 'Escape') { pop.classList.remove('on'); DR_CL.vifMotif = null; $('vif').value = ''; $('vif').focus({ preventScroll: true }); ev.stopPropagation(); } }, true);
function dr_vifChoisir(m){ DR_CL.vifMotif = m; const pop = $('ppop'); pop.querySelectorAll('button.m[data-pose]').forEach(b => b.classList.toggle('dr-choisi', b.dataset.pose === m)); dr_vifDire(); const n = $('dr-pnote'); if (n) n.focus({ preventScroll: true }); }
function dr_vifDire(){ const d = $('dr-pdit'); if (!d) return; const m = DR_CL.vifMotif; const lib = x => (MOTIFS_PART.find(o => o.c === x) || { l: x }).l; const P = PRENOMS[partEleve] || partEleve || '';
  d.innerHTML = m ? 'Entrée pose <b>« ' + dr_esc(lib(m)) + ' »</b> pour <b>' + dr_esc(P) + '</b>, avec la note' : '1, 2, 3… choisit le motif · Entrée pose <b>« ' + dr_esc(lib((MOTIFS_PART[0] || {}).c)) + ' »</b> pour <b>' + dr_esc(P) + '</b>'; }

// le VIF (le pont L16417-16498) : les pastilles candidates s'allument ; un seul élève ouvre sa fiche et le curseur va dans la note ; Entrée ouvre la fiche du premier ; Échap vide ; « posé : INI ✕ (Ctrl+Z) » six secondes
$('vif').addEventListener('input', () => { const z = $('vif'); const c = dr_candidats(z.value); S.vifCands = z.value ? c : []; participation(); const sg = $('vif-sug');
  if (!z.value.trim()) { sg.innerHTML = ''; } else if (!c.length) { sg.innerHTML = '<em style="color:#a23a3a">Aucun élève avec ces initiales.</em>'; } else if (c.length === 1) { sg.innerHTML = '→ <b>' + dr_esc(PRENOMS[c[0]] || c[0]) + '</b> (Entrée)'; ouvrirPart(c[0]); setTimeout(() => { const n2 = $('dr-pnote'); if (n2) n2.focus({ preventScroll: true }); }, 60); } else { sg.innerHTML = c.slice(0, 8).map(x => `<a href="#" data-vif-c="${x}" style="color:#c99a4e;margin-right:8px;text-decoration:none"><b>${dr_esc(PRENOMS[x] || x)}</b> <span style="color:#7d6f5d">${dr_iniVu(x)}</span></a>`).join('') + (c.length > 8 ? ' … +' + (c.length - 8) : ''); sg.querySelectorAll('a').forEach(a => a.onclick = ev => { ev.preventDefault(); ouvrirPart(a.dataset.vifC); setTimeout(() => { const n2 = $('dr-pnote'); if (n2) n2.focus({ preventScroll: true }); }, 60); }); } });

$('vif').addEventListener('keydown', ev => { const z = $('vif'); if (ev.key === 'Enter') { const c = dr_candidats(z.value); if (c.length) { ouvrirPart(c[0]); setTimeout(() => { const n2 = $('dr-pnote'); if (n2) n2.focus({ preventScroll: true }); }, 60); } ev.preventDefault(); } if (ev.key === 'Escape') { z.value = ''; S.vifCands = []; participation(); z.blur(); } if ((ev.ctrlKey || ev.metaKey) && String(ev.key).toLowerCase() === 'z') { if (S.vifAnnule) { S.vifAnnule(); ev.preventDefault(); } } });

/* réveil n°5, A4-3 (C1 4b.1, 5.4 bis) : le VIF, « posé : … ✕ (Ctrl+Z) » et le haut de la liste des paroles se voient sans défiler — la colonne de droite
   (#droite, qui défile) vient à eux au F2 (le socle met le curseur dans le VIF sans faire défiler) et après chaque pose */
function dr_vifMontrer(){ try { const d = document.getElementById('droite'), a = document.getElementById('vif'); if (!d || !a || !a.offsetParent) return; const z = document.getElementById('vif-dernier'), pt = document.getElementById('part');
  const R = d.getBoundingClientRect(); const haut = a.getBoundingClientRect().top - 6; let bas = Math.max(a.getBoundingClientRect().bottom, z && z.offsetParent ? z.getBoundingClientRect().bottom : 0); if (pt && pt.offsetParent) bas = Math.max(bas, Math.min(pt.getBoundingClientRect().bottom, pt.getBoundingClientRect().top + 60));
  if (bas + 8 > R.bottom) d.scrollTop += Math.min(bas + 8 - R.bottom, haut - R.top); else if (haut < R.top) d.scrollTop -= R.top - haut; } catch (e) {} }
document.getElementById('vif').addEventListener('focus', () => setTimeout(dr_vifMontrer, 0));
function vifDernier(ini, id){ const t = $('vif-dernier'); t.innerHTML = 'posé : <b>' + dr_iniVu(ini) + '</b> <span id="dr-vif-x" title="Retire cette prise de parole (Ctrl+Z) — rien d\'autre ne change" style="cursor:pointer;color:#e8484c">✕ (Ctrl+Z)</span>'; const annule = () => { partRetire(ini, id); t.innerHTML = 'annulé.'; setTimeout(() => { t.innerHTML = ''; }, 1500); S.vifAnnule = null; }; $('dr-vif-x').onclick = annule; S.vifAnnule = annule; setTimeout(dr_vifMontrer, 0); clearTimeout(S.vifDT); S.vifDT = setTimeout(() => { t.innerHTML = ''; S.vifAnnule = null; }, 6000); }

// la palette Maj+Espace (le pont L16517-16621) : voile, initiales en grand, suggestions, motifs 1/2/3 ou Entrée, note, « dernières », clic à côté annule, le curseur revient exactement
let PAL = null;

function ouvrirPalette(){ const d = document; const mem = { el: d.activeElement, s: null, e: null, dp: null }; try { if (mem.el && mem.el.setSelectionRange) { mem.s = mem.el.selectionStart; mem.e = mem.el.selectionEnd; } } catch (e) {} try { if (mem.el && mem.el.getAttribute) mem.dp = mem.el.getAttribute('data-p'); } catch (e) {} let sel0 = null; try { if (mem.el && mem.el.isContentEditable && getSelection().rangeCount) sel0 = getSelection().getRangeAt(0).cloneRange(); } catch (e) {}
  const ov = $('vif-palette'); if (!ov.innerHTML) { ov.innerHTML = '<div class="boite"><input id="dr-vif-pal-in" placeholder="initiales de l’élève…" autocomplete="off"><div id="dr-vif-pal-sug"></div><div id="dr-vif-pal-motifs"></div><input id="dr-vif-pal-note" placeholder="pourquoi (facultatif — pour toi seul)" autocomplete="off"><div id="dr-vif-pal-hist"></div></div>'; ov.addEventListener('click', ev => { if (ev.target === ov && ov.__fermer) ov.__fermer(); }); }
  ov.classList.add('on'); const inp = $('dr-vif-pal-in'), sg = $('dr-vif-pal-sug'), zm = $('dr-vif-pal-motifs'), zn = $('dr-vif-pal-note'), zh = $('dr-vif-pal-hist'); inp.value = ''; sg.innerHTML = ''; zm.style.display = 'none'; zm.innerHTML = ''; zn.style.display = 'none'; zn.value = ''; let choisi = null;
  const fermer = () => { ov.classList.remove('on'); setTimeout(() => { try { let el = mem.el; if (mem.dp != null) { const neuf = d.querySelector(`[data-p="${mem.dp}"]`); if (neuf) el = neuf; } if (el && el.isConnected !== false && el.focus) { el.focus({ preventScroll: true }); if (mem.s !== null && el.setSelectionRange) el.setSelectionRange(mem.s, mem.e); else if (el.isContentEditable) { const s2 = getSelection(); s2.removeAllRanges(); if (sel0) s2.addRange(sel0); else { const r = d.createRange(); r.selectNodeContents(el); r.collapse(false); s2.addRange(r); } } } } catch (e) {} }, 80); PAL = null; };
  ov.__fermer = fermer; PAL = { fermer };
  const poserAvec = (ini, mc, note) => { partAjoute(ini, mc, note || ''); fermer(); };
  const histoRendre = () => { const der = S.parts.slice(-5).reverse(); zh.innerHTML = !der.length ? '' : 'dernières : ' + der.map(x => `<span style="margin-right:10px">${iniDe(x.nom)} · ${(MOTIFS_PART.find(m => m.c === x.m) || { l: x.m }).l} · ${x.h} <a href="#" data-ann="${x.id}">✕</a></span>`).join(''); zh.querySelectorAll('a[data-ann]').forEach(a => a.onclick = ev => { ev.preventDefault(); partRetire(null, a.dataset.ann); histoRendre(); }); }; histoRendre();
  const designer = x => { choisi = x; sg.innerHTML = '→ <b>' + dr_esc(PRENOMS[x] || x) + '</b> — 1/2/3, ou note puis Entrée'; zm.style.display = 'flex'; zm.innerHTML = MOTIFS_PART.map((m, k2) => `<button data-mc="${m.c}">${k2 + 1} · ${m.l}</button>`).join(''); zm.querySelectorAll('button').forEach(b => b.onclick = () => poserAvec(choisi, b.dataset.mc, zn.value.trim())); zn.style.display = 'block'; };
  inp.oninput = () => { const c = dr_candidats(inp.value); if (!inp.value.trim().length) { sg.innerHTML = ''; zm.style.display = 'none'; zn.style.display = 'none'; return; } if (!c.length) { sg.innerHTML = '<em style="color:#a23a3a">Aucun élève avec ces initiales.</em>'; zm.style.display = 'none'; zn.style.display = 'none'; choisi = null; } else if (c.length === 1) designer(c[0]); else { sg.innerHTML = c.slice(0, 10).map(x => `<a href="#" data-vif-c="${x}"><b>${dr_esc(PRENOMS[x] || x)}</b> <span>${dr_iniVu(x)}</span></a>`).join('') + (c.length > 10 ? ' … +' + (c.length - 10) : ''); sg.querySelectorAll('a[data-vif-c]').forEach(a => a.onclick = ev => { ev.preventDefault(); designer(a.dataset.vifC); }); zm.style.display = 'none'; zn.style.display = 'none'; choisi = null; } };
  const clavier = ev => { const c = dr_candidats(inp.value); const cible = c.length === 1 ? c[0] : choisi; const noteVide = !zn.value.trim(); if (/^[1-3]$/.test(ev.key) && cible && (ev.target !== zn || noteVide)) { const m = MOTIFS_PART[+ev.key - 1]; if (m) poserAvec(cible, m.c, zn.value.trim()); ev.preventDefault(); return; } if (ev.key === 'Enter' && cible) { poserAvec(cible, MOTIFS_PART[0].c, zn.value.trim()); ev.preventDefault(); return; } if (ev.key === 'Tab' && cible && zn.style.display !== 'none') { zn.focus(); ev.preventDefault(); return; } if (ev.key === 'Escape') { fermer(); ev.preventDefault(); ev.stopPropagation(); } };
  inp.onkeydown = clavier; zn.onkeydown = clavier; setTimeout(() => { try { inp.focus(); } catch (e) {} }, 30); }

function fermerPalette(){ if (PAL) PAL.fermer(); }

// Ctrl+Z hors champ : la dernière saisie (prise de parole, note, appel)
function annulerDerniere(){ const d = S.derniere; if (!d) return; if (d.type === 'parole' && S.parts.length) { const p = S.parts.pop(); journal('parole-annulee', { nom: p.nom }); } else if (d.type === 'note' && S.notesFil.length) { S.notesFil.pop(); journal('note-annulee'); peindreNotes(); } else if (d.type === 'appel' && d.eleve && (S.appel[d.eleve] || []).length) { S.appel[d.eleve].pop(); journal('appel-annule', { eleve: d.eleve }); } S.derniere = null; participation(); }

// l'appel (cadrage 1, 11 bis — la greffe de la maquette) : clic droit sur une pastille
$('part').oncontextmenu = ev => { const n = ev.target.closest('[data-e]'); if (!n) return; ev.preventDefault(); const e = n.dataset.e; const abs = absentA(e); const seg = S.appel[e] || []; const dernier = seg.length ? seg[seg.length - 1].type : 'present';
  const items = abs ? [{ a: 'arrive', l: dernier === 'parti' ? `Revenu — ${prenomUnique(e)} (${hhmm()})` : `Présent, arrivé à ${hhmm()} — ${prenomUnique(e)}`, t: 'l\'heure est prise toute seule ; une raison facultative' }] : [{ a: 'absent', l: `Absent — ${prenomUnique(e)}`, t: 'depuis le début de l\'heure ; il n\'est plus proposé dans les initiales' }, { a: 'parti', l: `Parti à ${hhmm()} — ${prenomUnique(e)}`, t: 'l\'heure est prise toute seule ; une raison facultative ; il n\'est plus proposé' }];
  menuA($('menu'), ev.clientX, ev.clientY, items); $('menu').onclick = ev2 => { const b = ev2.target.closest('[data-a]'); if (!b) return; $('menu').classList.remove('on'); const type = b.dataset.a === 'arrive' ? (dernier === 'parti' ? 'revenu' : 'arrive') : b.dataset.a; const poser = raison => { (S.appel[e] = S.appel[e] || []).push({ type, t: now(), heure: S.heure, raison: raison || '' }); journal('appel', { eleve: e, quoi: type, raison: raison || '' }); S.derniere = { type: 'appel', eleve: e }; participation(); }; if (type === 'parti' || type === 'arrive') demander(`${prenomUnique(e)} — ${type === 'parti' ? 'parti' : 'arrivé'} à ${hhmm()} : raison (facultatif)`, poser); else poser(''); }; };

// ───────── notes N (liste + verser) ─────────
$('bnotes').onclick = () => basculerNotes();
 $('fnotes-x').onclick = () => basculerNotes(false);

function basculerNotes(on){ const f = $('fnotes'); const ouvrir = on == null ? !f.classList.contains('on') : on; f.classList.toggle('on', ouvrir); if (ouvrir) { peindreNotes(); $('fil-t').focus({ preventScroll: true }); } }

function peindreNotes(){ poserHtml($('fnotes-l'), S.notesFil.map((n, i) => `<div class="ligne ${n.versee ? 'versee' : ''}"><span class="dr-h">${n.h} · d${n.di}</span><div class="t" contenteditable="true" data-i="${i}">${dr_esc(n.t)}</div><button class="btn" data-v="${i}" title="${n.versee ? 'Retire cette note du récit' : 'La note entre telle quelle dans le récit, au paragraphe de cette diapo'}">${n.versee ? 'Retirer du récit' : 'Verser au récit'}</button></div>`).join('') || '<div style="color:var(--sourd)">aucune note pour l\'instant</div>');
  $('fnotes-l').querySelectorAll('[data-v]').forEach(b => b.onclick = () => { const n = S.notesFil[+b.dataset.v]; n.versee = !n.versee; journal(n.versee ? 'note-versee' : 'note-retiree', { txt: n.t }); peindreNotes(); });
  $('fnotes-l').querySelectorAll('.t').forEach(t => t.onblur = () => { S.notesFil[+t.dataset.i].t = t.textContent; }); }

$('fil-t').onkeydown = ev => { if (ev.key === 'Enter') { const t = ev.target.value.trim(); if (t) { S.notesFil.push({ h: hhmm(), heure: S.heure, di: diapoAuMur() + 1, eid: seance().ecrans[diapoAuMur()].eid, t, versee: false, ts: now() }); journal('note', { txt: t }); S.derniere = { type: 'note' }; ev.target.value = ''; peindreNotes(); } } if (ev.key === 'Escape') basculerNotes(false); };

// ───────── commentaires (par classe, sur la diapo) ─────────
function ouvrirComm(eid){ S.commEid = eid || ecran().eid; $('fcomm-diapo').textContent = seance().ecrans.find(e => e.eid === S.commEid).act; peindreComm(); const f = $('fcomm'); f.classList.add('on'); f.style.left = '380px'; f.style.top = '120px'; $('fcomm-t').focus({ preventScroll: true }); }

function peindreComm(){ $('fcomm-l').innerHTML = (S.comm[S.commEid] || []).map(c => `<div class="dr-c"><div class="dr-h">${new Date(c.t).toLocaleDateString('fr-FR', { timeZone: TZ })} ${hhmm(c.t)} · ${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom)}</div>${dr_esc(c.txt)}</div>`).join('') || '<div style="color:var(--sourd)">aucun commentaire</div>'; }

$('fcomm-t').onkeydown = ev => { if (ev.key === 'Enter') { const t = ev.target.value.trim(); if (t) { (S.comm[S.commEid] = S.comm[S.commEid] || []).push({ t: now(), txt: t }); journal('commentaire', { eid: S.commEid, txt: t }); ev.target.value = ''; peindreComm(); dr_tout(); } } if (ev.key === 'Escape') $('fcomm').classList.remove('on'); };

$('fcomm-x').onclick = () => $('fcomm').classList.remove('on');
 $('pastille').onclick = () => ouvrirComm();

// ───────── notion imprévue ─────────
function ouvrirNotion(eid){ S.notionEid = eid || ecran().eid; $('fnotion-diapo').textContent = seance().ecrans.find(e => e.eid === S.notionEid).act; const f = $('fnotion'); f.classList.add('on'); f.style.left = '380px'; f.style.top = '120px'; $('fnotion-t').value = ''; peindreNotion(''); $('fnotion-t').focus({ preventScroll: true }); }

function peindreNotion(q){ q = q.toLowerCase(); const res = []; dr_taxo()/* E1 : lisait DATA.taxo */.forEach(d => d.familles.forEach(f => f.notions.forEach(n => { if (q && ((n.prof || '').toLowerCase().includes(q) || (n.eleve || '').toLowerCase().includes(q) || (f.prof || '').toLowerCase().includes(q))) res.push({ d, f, n }); })));
  const deja = S.notionsImprevues[S.notionEid] || [];
  $('fnotion-l').innerHTML = (deja.length ? `<div style="color:var(--texte2);margin-bottom:6px">déclarées sur cette diapo : ${deja.map(id => dr_esc(libNotion(id))).join(' · ')}</div>` : '') + (q ? (res.slice(0, 12).map(r => `<div class="dr-c" style="padding:4px 0;border-top:1px solid var(--bord)"><button class="btn" data-n="${r.n.id}" style="padding:2px 8px;margin-right:8px">+</button>${dr_esc(r.n.prof)} <span style="color:var(--sourd)">— ${dr_esc(r.d.prof)} › ${dr_esc(r.f.prof)}</span></div>`).join('') || `<div style="color:var(--texte2)">rien dans la taxonomie pour « ${dr_esc(q)} » — <button class="btn" style="padding:2px 8px" disabled title="Créer une notion : le même geste que le panneau prof, avec la garde Éduscol (les attendus ne sont pas dans la maquette)">+ une notion</button></div>`) : '');
  $('fnotion-l').querySelectorAll('[data-n]').forEach(b => b.onclick = () => { (S.notionsImprevues[S.notionEid] = S.notionsImprevues[S.notionEid] || []).push(b.dataset.n); journal('notion-imprevue', { eid: S.notionEid, id: b.dataset.n }); peindreNotion($('fnotion-t').value); }); }

$('fnotion-t').oninput = ev => peindreNotion(ev.target.value);
 $('fnotion-x').onclick = () => $('fnotion').classList.remove('on');

function libNotion(id){ for (const d of dr_taxo()/* E1 : lisait DATA.taxo */) for (const f of d.familles) for (const n of f.notions) if (n.id === id) return n.prof; return id; }

function libNotionEleve(id){ for (const d of dr_taxo()/* E1 : lisait DATA.taxo */) for (const f of d.familles) for (const n of f.notions) if (n.id === id) return n.eleve || n.prof; return id; }

// ───────── réserve et documents ─────────
function ouvrirReserve(){ const f = $('freserve'); f.classList.add('on'); f.style.left = '380px'; f.style.top = '120px';
  const l = Object.keys(S.decisions).filter(k => S.decisions[k].choix === 'reserve').map(k => objetDec(k) ? Object.assign({ cle: k }, objetDec(k)) : null).filter(Boolean);
  $('freserve-l').innerHTML = l.length ? l.map(o => `<div class="dr-c" style="padding:6px 0;border-top:1px solid var(--bord)"><b>${dr_esc(o.titre)}</b><div style="color:var(--texte2);font-size:.9rem">${dr_esc(o.contenu.slice(0, 300))}</div><button class="btn" data-enc="${o.cle}" style="margin-top:4px;padding:2px 8px" title="Un encart au tableau, « pour ceux qui ont fini » — une publication, notée au journal">${S.encart && S.encartEid === o.cle ? 'Retirer du tableau' : 'Afficher au tableau, pour ceux qui ont fini'}</button></div>`).join('') : '<div style="color:var(--sourd)">rien en réserve — une activité se met en réserve par clic droit → retirer de l\'heure → en réserve</div>';
  $('freserve-l').querySelectorAll('[data-enc]').forEach(b => b.onclick = () => { const o = objetDec(b.dataset.enc); if (S.encart && S.encartEid === b.dataset.enc) { S.encart = null; S.encartEid = null; } else { S.encart = o.titre + ' — ' + o.contenu.slice(0, 160); S.encartEid = b.dataset.enc; } dr_tout(); ouvrirReserve(); }); }

$('freserve-x').onclick = () => $('freserve').classList.remove('on');

function ouvrirDocs(){ const f = $('fdocs'); f.classList.add('on'); f.style.left = '380px'; f.style.top = '120px'; const l = dr_documents()/* E1 : lisait DATA.documents */[String(S.si)] || [];
  $('fdocs-l').innerHTML = l.map(d => `<div class="dr-c" style="padding:6px 0;border-top:1px solid var(--bord)"><b>${dr_esc(d.titre)}</b> <span style="color:var(--sourd)">${d.type === 'pdf' ? d.pages + ' pages' : d.etapes + ' étapes'}</span><div><button class="btn" data-doc="${d.id}" style="margin-top:4px;padding:2px 8px">${S.doc && S.doc.id === d.id ? '✕ Fermer (retour à la diapo)' : 'Projeter au tableau'}</button></div></div>`).join('');
  $('fdocs-l').querySelectorAll('[data-doc]').forEach(b => b.onclick = () => { if (S.doc && S.doc.id === b.dataset.doc) S.doc = null; else S.doc = { id: b.dataset.doc, pos: 1 }; dr_tout(); ouvrirDocs(); }); }

$('fdocs-x').onclick = () => $('fdocs').classList.remove('on');

// ───────── T-5, fin d'heure, fin de séance ─────────
function t5(){ dr_palier('t5'); }

const LIB_PALIER = { t5: 'le cahier de textes dans 5 minutes', t3: 'le cahier de textes dans 3 minutes', t1: 'le cahier de textes dans 1 minute', zero: 'c\'est l\'heure du cahier de textes' };

const dureeDe = a => { if (S.durees && S.durees[a.id] != null) return S.durees[a.id]; const E = seance().ecrans; return a.diapos.filter(i => ordreHeure(S.heure).includes(i)).reduce((t, i) => t + (E[i].dur || 0), 0); };
 /* (c) la durée d'une activité pour cette heure : la trame, ou ce que Paul a changé (la copie de classe) */
function tempsActivite(a){ /* le temps passé sur ses diapos au journal, hors temps mis à part (1.3 bis) */ let passe = 0; const ev = J.filter(x => x.type === 'diapo' && x.h === S.heure); ev.forEach((x, k) => { const fin = k + 1 < ev.length ? ev[k + 1].t : now(); if (a.diapos.includes(x.di)) passe += fin - x.t; }); (S.coupures || []).forEach(c => { if (!c.compte && a.diapos.includes(c.di)) passe -= (c.fin - c.debut); }); return Math.max(0, Math.round(passe / 60000)); }

function etatWorktrack(a){ const E = seance().ecrans; const diapos = a.diapos.filter(i => ordreHeure(S.heure).includes(i)); if (!diapos.length) return null; const prevu = dureeDe(a); if ((S.faiteOral || {})[a.id]) return { k: 'fin', txt: 'faite à l\'oral', prevu, min: Math.round(S.faiteOral[a.id].duree) }; const min = tempsActivite(a); const minF = tempsActiviteSec(a) / 60; const toutes = diapos.every(i => finie(E[i], i)); const enCours = diapos.includes(S.di); const commencee = diapos.some(i => (vuMax[K(i)] || 0) > 0 || J.some(x => x.type === 'diapo' && x.di === i)); if (toutes && !enCours) return { k: 'fin', txt: 'terminée', prevu, min }; /* terminée seulement une fois quittée (Paul, 23/09) : tant qu'on est dessus, elle est en cours */ if (!commencee) return { k: 'attend', txt: '', prevu, min }; if (minF > prevu) return { k: 'dep', txt: 'tu dépasses · +' + Math.ceil(minF - prevu) + ' min', prevu, min }; if (prevu && minF >= prevu * 0.8) return { k: 'peu', txt: 'il te reste peu de temps', prevu, min }; return { k: 'ok', txt: 'dans les temps', prevu, min }; }

function tempsActiviteSec(a){ let passe = 0; const ev = J.filter(x => x.type === 'diapo' && x.h === S.heure); ev.forEach((x, k) => { const fin = k + 1 < ev.length ? ev[k + 1].t : now(); if (a.diapos.includes(x.di)) passe += fin - x.t; }); (S.coupures || []).forEach(c => { if (!c.compte && a.diapos.includes(c.di)) passe -= (c.fin - c.debut); }); return Math.max(0, passe / 1000); }

function activitesDeLHeure(){ const E = seance().ecrans; const o = ordreHeure(S.heure); const vues = []; const out = []; o.forEach(i => { const e = E[i]; if (e.role) return; const a = actDe(e) || dr_pseudoAct(e, i); /* E2 : une diapo sans activité compte comme une (réveil n°3, 5) */ if (!a || vues.includes(a.id)) return; vues.push(a.id); out.push(a); }); return out; }

function etatActivite(){ const e = ecran(); const a = actDe(e); if (!a || e.role) return null; const w = etatWorktrack(a); return { a, prevu: w.prevu, min: w.min, txt: w.txt || 'dans les temps' }; }

function etatActiviteAncien(){ const e = ecran(); const a = actDe(e); if (!a || e.role) return null; const E = seance().ecrans; const prevu = a.diapos.reduce((t, i) => t + (E[i].dur || 0), 0); let passe = 0; const ev = J.filter(x => x.type === 'diapo' && x.h === S.heure); ev.forEach((x, k) => { const fin = k + 1 < ev.length ? ev[k + 1].t : now(); if (a.diapos.includes(x.di)) passe += fin - x.t; }); (S.coupures || []).forEach(c => { if (!c.compte && a.diapos.includes(c.di)) passe -= (c.fin - c.debut); }); const min = Math.round(passe / 60000); return { a, prevu, min, txt: min > prevu ? `tu dépasses de ${min - prevu} min` : (prevu && min >= prevu * 0.8 ? 'il te reste peu de temps' : 'dans les temps') }; }

function palier0(k){ if (S.close) return; S.t5 = true; S.palier = k; journal(k === 'zero' ? 'cahier-heure' : k); if (k === 't5' && !S.enFin) ouvrirFin(true); /* 7.0 : la séquence s'ouvre par l'alerte, pour préparer l'agenda avant le cahier (Paul, 24/09) */ if (ecran().role === 'fin') { alerteFermer(); return; } alerteOuvrir(); }

function alerteTexte(){ const k = S.palier; const et = etatActivite(); return `<b>${k === 'zero' ? 'C\'est l\'heure du cahier de textes.' : 'T-' + { t5: 5, t3: 3, t1: 1 }[k] + ' — ' + LIB_PALIER[k] + '.'}</b> <span>${et ? 'L\'activité en cours : <b style="color:var(--texte)">Activité ' + et.a.num + ' — ' + dr_esc(et.a.titre) + '</b>, ' + et.txt + '. ' : ''}${k === 'zero' ? 'Va au cahier de textes : l\'heure court (' + (dr_heureDe(S.heure).fin || hhmm(dr_heureDe(S.heure).base + 55 * 60000)) + ').' /* E2 (réveil n°3) : la fin réelle du créneau — avant : base + 55 min */ : 'Le cahier de textes attend — le tableau ne bouge pas tant que tu n\'y vas pas.'}</span>`; }

function alerteOuvrir(){ const b = $('al-boite'); b.className = 'al-boite ' + S.palier; b.style.display = 'flex'; $('al-ligne').style.display = 'none'; $('al-txt').innerHTML = alerteTexte(); $('al-tard').style.display = S.palier === 'zero' ? 'none' : ''; S.alerteOuverte = true; dr_alerteScene(true); [['al-preparer', 'Préparer'], ['al-aller', 'Aller au cahier']].forEach(([id, l]) => { const x = $(id); if (x && x.textContent !== l) x.textContent = l; }); }   /* libellés courts dans la rangée (l'infobulle garde la phrase entière) */

function alerteReplier(){ if (S.palier === 'zero') return; $('al-boite').style.display = 'none'; dr_alerteScene(false); const l = $('al-ligne'); l.className = 'al-ligne ' + S.palier; l.style.display = 'block'; l.textContent = 'T-' + { t5: 5, t3: 3, t1: 1 }[S.palier] + ' · le cahier de textes attend — ▸'; S.alerteOuverte = false; journal('alerte-repliee', { palier: S.palier }); }

/* E2 (réveil n°4, point 5 ; C1 6.3) : la boîte au-dessus des notes, entière dans l'écran à 1280 × 768 — la colonne du centre (#scene) est de hauteur fixe ;
   pendant l'alerte, la boîte est compacte (le texte en entier, les boutons dessous) et les notes se réduisent (dr.css, bloc E2) */
function dr_alerteScene(on){ const sc = document.querySelector('#dr-zone .scene') || document.querySelector('.scene'); if (sc) sc.classList.toggle('dr-al', !!on); }
function alerteFermer(){ $('al-boite').style.display = 'none'; dr_alerteScene(false); $('al-ligne').style.display = 'none'; S.alerteOuverte = false; }

$('al-tard').onclick = () => alerteReplier();
 $('al-preparer').onclick = () => { if (document.querySelector('.garde.on')) return; preparerCahier(); };
 $('al-ligne').onclick = () => alerteOuvrir();

$('al-aller').onclick = () => { if (document.querySelector('.garde.on')) return; const i = ordreHeure(S.heure).find(k => seance().ecrans[k].role === 'fin'); if (i != null) aller(i); };

dr_ecouteDoc('click', ev => { if (!S.alerteOuverte || S.palier === 'zero') return; if (ev.target.closest('#al-boite, #al-ligne, .garde, #vif-palette, #ppop, #menu, #menuplus, #fsimu')) return; alerteReplier(); });

(function poigneeMur(){ const pg = $('poignee-mur'); let dep = null; pg.addEventListener('mousedown', ev => { ev.preventDefault(); const sc = document.querySelector('.scene'); dep = { y: ev.clientY, part: S.murPart || 1, h: sc.clientHeight }; document.body.style.cursor = 'row-resize'; const move = e => { if (!dep) return; const d = (e.clientY - dep.y) / dep.h; S.murPart = Math.max(0.3, Math.min(1, dep.part + d * 1.6)); try { dimensionner(); } catch (x) {} }; const up = () => { dep = null; document.body.style.cursor = ''; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); journal('poignee-diapo', { part: Math.round((S.murPart || 1) * 100) }); dr_tout(); }; dr_ecouteDoc('mousemove', move); dr_ecouteDoc('mouseup', up); }); pg.addEventListener('dblclick', ev => { ev.preventDefault(); S.murPart = 1; journal('poignee-diapo', { part: 100 }); dr_tout(); }); /* (p8-5e) double-clic : la diapo reprend toute sa place */ })();

(function glisserAlerte(){ const b = $('al-boite'); const pg = $('al-poignee'); let dx = 0, dy = 0, ph = null; const move = ev => { const w = b.offsetWidth, h = b.offsetHeight; const x = Math.max(0, Math.min(innerWidth - w, ev.clientX - dx)), y = Math.max(46, Math.min(innerHeight - h, ev.clientY - dy)); b.style.left = x + 'px'; b.style.top = y + 'px'; }; const up = ev => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); if (ev.clientY > innerHeight * 2 / 3) { b.classList.remove('flotte'); b.style.left = b.style.top = ''; if (ph) { ph.remove(); ph = null; } } journal('alerte-deplacee'); };
  pg.addEventListener('mousedown', ev => { ev.preventDefault(); const r = b.getBoundingClientRect(); dx = ev.clientX - r.left; dy = ev.clientY - r.top; if (!b.classList.contains('flotte')) { ph = document.createElement('div'); ph.style.height = r.height + 8 + 'px'; b.insertAdjacentElement('afterend', ph); b.classList.add('flotte'); b.style.left = r.left + 'px'; b.style.top = r.top + 'px'; } dr_ecouteDoc('mousemove', move); dr_ecouteDoc('mouseup', up); }); })();

function controleCahier(restantes){ const h = S.heure; const dec = (restantes || []).every(x => { const d = S.decisions[x.a.id]; return d && !d.defaut; }); const travail = (texteTravail() || '').trim().length > 0 || !!(S.rienProchaine || {})[h]; const relu = !!(S.recitRelu || {})[h]; /* (b4-2) « ma version » ne coche plus « relu » : le récit se complète jusqu'à la fin (2 · 3.8) */ const absents = ELEVES.filter(e => (S.appel[e] || []).length); const copie = S.copieED && S.copieED[h] && S.copieED[h].contenu && S.copieED[h].travail;
  const etapes = [ { n: 1, lib: 'l\'échéance', ok: !!S.echeance || !!(S.finFaites || {})[1], risque: 'le cahier dira « la prochaine fois » : les élèves ne sauront pas pour quand' }, { n: 2, lib: 'ce qui reste' + ((restantes || []).length ? ' (' + (restantes || []).length + ' à décider)' : ''), ok: dec, risque: 'une activité restante sans décision glissera à l\'heure suivante par défaut' }, { n: 3, lib: 'le travail à faire', ok: travail, risque: 'rien dans École Directe ni dans l\'historique pour la prochaine fois' }, { n: 4, lib: 'le récit relu', ok: relu, risque: 'il partira tel quel dans l\'historique (et dans École Directe s\'il est copié)' }, { n: 5, lib: 'le mot aux absents' + (absents.length ? ' (' + absents.length + ')' : ' (aucun absent)'), ok: !absents.length || !!(S.motAbsents || '').trim(), facultatif: true, risque: 'les absents n\'auront pas de mot' }, { n: 6, lib: 'copié pour École Directe', ok: !!copie, risque: 'le cahier de textes de l\'école restera vide, à remplir à la main plus tard' }, { n: 7, lib: 'clore', ok: !!S.close, risque: '' } ];
  const prochaine = etapes.find(e => !e.ok && !e.facultatif) || etapes.find(e => !e.ok); return { etapes, prochaine }; }

function sequenceHtml(h, cloture, restantes){ /* (b4) 7.0 bis/ter : le pas à pas — une étape à la fois, ce qu'il faut y faire, ses contrôles, deux boutons ; le fil ; la liste des sept, cliquable */
  const tmp = document.createElement('div'); tmp.innerHTML = h; const q = sel => tmp.querySelector(sel); const out = n => (n ? n.outerHTML : '');
  const echLabel = tmp.querySelector('#f-ech') ? tmp.querySelector('#f-ech').closest('label') : null; if (echLabel) echLabel.remove(); const travaux = tmp.querySelectorAll('.travail'); const travail = travaux[0]; const avant = tmp.querySelector('#f-mot') ? tmp.querySelector('#f-mot').closest('.travail') : null; const rangee = q('.rangee'); const h3prevu = tmp.querySelector('h3'); const barre = q('.barre-fin'); tmp.querySelectorAll('[data-finvue]').forEach(x => x.parentElement.remove());
  S.finSection = S.finSection || 1; S.finFaites = S.finFaites || {}; const ctl = controleCahier(restantes); const E = ctl.etapes; const n = S.finSection; const et = E[n - 1]; const hh = S.heure; const nbF = E.filter(e => e.ok && e.n < 7).length;
  const TITRES = { 1: 'l\'échéance', 2: 'ce qui reste', 3: 'le travail à faire', 4: 'le récit relu', 5: 'avant de clore', 6: 'copier pour École Directe', 7: 'clore l\'heure' };
  const resume = { 1: S.echeance ? '✔ ' + dr_esc((dr_classe()/* E1 : lisait DATA.classe */.prochaines.find(x => x.iso === S.echeance) || {}).l || S.echeance) : ((S.finFaites || {})[1] ? '✔ sans échéance' : ''), 2: (restantes || []).length ? (restantes || []).map(x => (S.decisions[x.a.id] || {}).choix).filter(Boolean).map(c => ({ suivante: 'à l\'heure suivante', terminer: 'à la maison', preparer: 'à préparer', reserve: 'en réserve', nonfait: 'non fait', reporter: 'reportée', pastemps: 'à la maison', passee: 'passée' }[c] || c)).join(', ') : 'rien ne restait', 3: (S.rienProchaine || {})[hh] ? 'rien pour la prochaine fois' : dr_esc((texteTravail() || '').trim().slice(0, 50)) + '…', 4: (S.recitVersion || {})[hh] === 'moi' ? 'ma version' : 'relu', 5: 'notes, versements, mot aux absents', 6: 'copié (contenu et travail)', 7: '' };
  const QUOI = { 1: 'Prenez vos agendas pour le… — la date part au tableau, dans le cahier de textes. Choisis-la, ou dis « sans échéance ».', 2: 'Ce qui était prévu pour cette heure et n\'a pas été fait : une décision par activité (à l\'heure suivante, à la maison, à préparer, en réserve, non fait).', 3: 'Ce que les élèves auront à faire. Déjà là : ce que la trame prévoyait, les notions cochées, l\'activité à finir à la maison si tu l\'as décidé. Ajoute ce que tu veux, ou dis qu\'il n\'y a rien d\'autre.', 4: 'Parcours le récit une fois (dans le cahier, onglet Contenus, ou dans la relecture) ; l\'étape se coche quand tu as atteint le bout du récit final, ou d\'un clic.', 5: 'Les notes à garder, ce qui se verse dans la trame, le mot aux absents.', 6: 'Copie, puis colle dans École Directe : d\'abord le contenu de séance, puis le travail à faire.', 7: 'Relis ce qui manque encore (la liste à droite), puis clos l\'heure.' };
  const corps = {};
  corps[1] = `${out(echLabel)}<div style="margin-top:6px"><button class="btn" id="f-sans-ech" title="Pas d\'échéance donnée : le cahier dira « la prochaine fois »">Sans échéance</button></div>`;
  corps[2] = `${out(h3prevu)}${out(rangee)}`;
  corps[3] = `${out(travail)}<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="f-rien" title="Rien à faire pour la prochaine fois : l\'étape est faite, en connaissance de cause">${(S.rienProchaine || {})[hh] ? '✔ rien pour la prochaine fois' : 'Rien d\'autre pour la prochaine fois'}</button><button class="btn" id="f-vers-travail" title="Va au champ du travail à faire, dans la diapo du cahier">Écrire dans le cahier ▸</button></div>`;
  const recitFinal = !!S.close || (ecran().role === 'fin' && !S.preparation) || now() >= heureCahier() + 5 * 60000; /* E2 : l'heure finie, le récit est final (relecteur neuf n°2 : « il est 09:53 : le récit se complète » après la fin) */ corps[4] = `${recitFinal ? '' : `<div class="pp-attente">Il est ${hhmm()} : <b>le récit se complète jusqu\'à la fin de l\'heure</b> — ce que tu lis maintenant n\'est pas encore ce qui partira. Tu peux le lire et le retoucher (ma version), l\'étape ne se cochera qu\'une fois l\'heure jouée et le récit relu à la fin.</div>`}<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="f-vers-recit" title="Va au récit dans la diapo du cahier">Lire dans le cahier ▸</button><button class="btn" id="f-relu" ${recitFinal ? '' : 'disabled '}title="${recitFinal ? 'Tu l\'as relu : l\'étape est faite' : 'À relire à la fin de l\'heure : le récit n\'est pas fini'}">${et && E[3].ok ? '✔ relu' : (recitFinal ? 'Relu' : 'Relu (à la fin de l\'heure)')}</button></div>`;
  corps[5] = cloture ? out(avant) : '<div class="sous">(à la clôture)</div>';
  corps[6] = `<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="f-copie-contenu" title="Copie le récit pour le coller dans École Directe">${S.copieED && S.copieED[hh] && S.copieED[hh].contenu ? '✔ contenu copié' : 'Copier le contenu de séance'}</button><button class="btn" id="f-copie-travail" title="Copie le travail à faire en entier pour le coller dans École Directe">${S.copieED && S.copieED[hh] && S.copieED[hh].travail ? '✔ travail copié' : 'Copier le travail à faire'}</button><span id="f-copie-etat" style="color:var(--texte2);font-size:.85rem"></span></div>`;
  corps[7] = out(barre);
  const tete = `<div class="pp-tete"><b>${S.preparation ? 'Préparer le cahier de textes' : 'Fin de l\'heure'} — étape ${n} sur 7 : ${TITRES[n]}</b><span style="display:flex;gap:6px">${S.preparation ? '<button class="btn or" id="f-revenir" title="Te ramène à la diapo où la classe est restée, et dégèle le tableau — c\'est le seul geste qui dégèle">Revenir au cours</button>' : '<button class="btn" id="f-preparer" title="Gèle le tableau sur la diapo en cours, t\'emmène au cahier de textes et ouvre la préparation sous la diapo : tu prépares tout pendant que la classe travaille">Préparer le cahier de textes</button><button class="btn" id="f-reprendre" title="Referme la colonne et reprend le cours ; rien n\'est fermé, tes choix restent">Reprendre le cours</button>'}</span></div>`;
  const fil = `<div class="pp-fil">${E.map(e => `<span class="${e.ok ? 'dr-ok' : ''}${e.n === n ? ' ici' : ''}"></span>`).join('')}</div>`;
  const etape = `<div class="sec ouverte${et && et.ok ? ' faite' : ''}" data-sec="${n}"><div class="pp-quoi">${QUOI[n]}</div>${corps[n]}</div>`;
  const nav = `<div class="pp-nav"><span><button class="btn" id="f-precedente" ${n <= 1 ? 'disabled ' : ''}title="L\'étape précédente">◀ Étape précédente</button></span><button class="btn${n >= 7 ? '' : ' or'}${et && !et.ok && !et.facultatif ? ' grise' : ''}" id="f-suivante" data-fleche="${Math.min(7, n + 1)}" ${n >= 7 ? 'disabled ' : ''}title="${n >= 7 ? 'C\'est la dernière étape : clos l\'heure ici' : et && !et.ok ? 'L\'étape en cours n\'est pas faite — tu peux quand même passer à la suivante' : 'L\'étape suivante'}">Étape suivante ▶${n < 7 ? ' (' + TITRES[n + 1] + ')' : ''}</button></div>`;
  const liste = `<div class="pp-liste" title="La liste de contrôle : elle se coche toute seule ; un clic sur une ligne ouvre l\'étape">${E.map(e => `<div class="sec${e.n === n ? ' ouverte' : ''}${e.ok ? ' faite' : ''}" data-sec="${e.n}"><span class="ctl-l${e.ok ? ' dr-ok' : ''}${ctl.prochaine && ctl.prochaine.n === e.n ? ' ici' : ''}" data-ctl="${e.n}" data-ouvre="${e.n}">${e.ok ? '✔' : (e.n === n ? '▶' : '○')} ${e.n} · ${dr_esc(e.lib)}${e.facultatif ? ' <i>(facultatif)</i>' : ''}${e.n === 4 && !e.ok && (S.recitAChange || {})[hh] ? ' — <i>le récit a changé depuis : à relire</i>' : (e.n === 4 && !e.ok && !recitFinal ? ' — <i>à relire à la fin de l\'heure</i>' : '')}${e.ok && e.n !== n && resume[e.n] ? '<span class="okr">' + resume[e.n] + '</span>' : ''}</span></div>`).join('')}<div style="margin-top:6px;color:var(--sourd);font-size:.75rem">${nbF} étape${nbF > 1 ? 's' : ''} faite${nbF > 1 ? 's' : ''} sur 7${ctl.prochaine ? /* E2 (réveil n°3) : sept étapes (C1 7) — avant : « sur 6 » */ ' — c\'est là que tu en es : ' + ctl.prochaine.n : ''}</div></div>`;
  return `<div class="dr-seq">${tete}<div class="dr-pp"><div>${fil}${etape}${nav}</div>${liste}</div></div>`; }

function allerAuCahier(onglet){ const i = ordreHeure(S.heure).find(k => seance().ecrans[k].role === 'fin'); if (i == null) return; S.finVue = onglet; if (S.di !== i) { if (S.gel || S.preparation) { S._parGardeCahier = true; S.di = i; S.page = null; S._parGardeCahier = false; dr_tout(); } else aller(i); } else dr_tout(); setTimeout(() => { const c = document.querySelector(onglet === 'travail' ? '#mur #ed-edit' : '#mur .ed-recit'); if (c && onglet === 'travail') c.focus(); }, 80); }

function copierTexte(txt, ok){ const dire = m => { const z = $('f-copie-etat') || $('r-copie-etat'); if (z) z.textContent = m; }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => dire(ok)).catch(() => dire('copie impossible ici')); else dire('copie impossible ici'); }

function manquesAvantDeClore(restantes){ return controleCahier(restantes).etapes.filter(e => !e.ok && e.n < 7); }

function ouvrirFin(cloture){ if ((document.getElementById('fin').parentElement === document.getElementById('ecran-fin') && document.getElementById('ecran-fin').classList.contains('on')) && !S._rattrapage) return; const derniere = S.heure >= ((dr_heureJouee(S.heure) || {}).sur || 1); /* E2 : la séance a N heures (edtHeuresPour) — avant : S.heure === 2 */ const E = seance().ecrans;
  const acts = dr_activitesOuDiapos(); /* E2 : les activités, et chaque diapo sans activité comme la sienne (réveil n°3, 3 ; C1 7.0-7.1) — avant : les activités seules */
  const restantes = acts.map(a => { const diapos = a.diapos.filter(i => E[i].heure <= S.heure && !finie(E[i], i) && !(decisionDe(E[i]) && decisionDe(E[i]).choix === 'passee')); const dansHeure = a.diapos.some(i => E[i].heure === S.heure || glisseeDe(E[i], S.heure)); return { a, diapos, commencee: a.diapos.some(i => vuMax[K(i)]) }; }).filter(x => x.diapos.length && (x.a.diapos.some(i => E[i].heure === S.heure) || x.a.diapos.some(i => glisseeDe(E[i], S.heure)) || (derniere && S.decisions[x.a.id] && S.decisions[x.a.id].choix === 'reserve')));
  restantes.forEach(x => { if (!S.decisions[x.a.id] && !derniere) S.decisions[x.a.id] = { choix: 'suivante', moment: 'fin', defaut: true, heure: S.heure }; });
  const bilan = E.find(e => e.role === 'bilan');
  const montrees = new Set(J.filter(x => x.type === 'diapo' && x.h === S.heure).map(x => x.di)); /* E2 : les diapos montrées DANS CETTE HEURE (vu par E4 : l'heure 2 donnait à apprendre les notions de l'heure 1) — avant : tout le journal */ const notionsHeure = new Set(); E.forEach((e, i) => { if (montrees.has(i) || vuMax[K(i)]) (e.comp || []).forEach(c => notionsHeure.add(c)); (S.notionsImprevues[e.eid] || []).forEach(c => notionsHeure.add(c)); });
  if (S.travail.apprendre == null) S.travail.apprendre = [...notionsHeure].filter(id => libNotion(id) !== id && !dejaVue(id)); /* E2 : seulement les nouvelles (réveil n°3, 5) */
  const prevu = dr_travail()/* E1 : lisait DATA.travailPrevu */[S.si + '|' + S.heure] || '';
  let h = `<h2>${cloture ? 'Fin de l\'heure — ce qu\'il reste à décider, puis clore' : 'Il reste 5 minutes'} — ${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom)} · H${S.heure}${derniere ? ' · dernière heure de la séance' : ''}</h2><div class="sous">${derniere ? 'La séance se ferme : pour ce qui reste, une décision par activité.' : 'Ce qui était prévu pour cette heure et n\'a pas été fait glisse à l\'heure suivante, sauf si tu décides autrement — une décision par activité.'} ${derniere && bilan && !(vuMax[K(E.indexOf(bilan))]) ? '<button class="btn or" id="f-bilan" title="Saute devant la classe jusqu\'au bilan de la séance">Aller au bilan</button>' : ''}</div>`;
  h += `<h3 style="color:var(--sourd);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase">Prévu pour cette heure, pas fait — <span class="debord" id="f-debord"></span></h3><div class="rangee">`;
  restantes.forEach(x => { const a = x.a; const d = S.decisions[a.id] || {}; const notions = [...new Set(x.diapos.flatMap(i => E[i].comp || []))].map(libNotion).filter(l => l && !/^[a-z0-9-]+$/.test(l)).slice(0, 4); const prevAilleurs = x.diapos.some(i => (E[i].comp || []).some(c => E.some((o, oi) => !a.diapos.includes(oi) && oi > i && (o.comp || []).includes(c))));
    const choix = derniere ? [['reporter', 'Reporter à la séance suivante'], ['terminer', 'Terminer à la maison'], ['preparer', 'Préparer à la maison'], ['pastemps', 'À la maison, pas le temps'], ['nonfait', 'Non fait']] : [['suivante', 'À l\'heure suivante'], ['terminer', 'Terminer à la maison'], ['preparer', 'Préparer à la maison'], ['pastemps', 'À la maison, pas le temps'], ['reserve', 'En réserve'], ['nonfait', 'Non fait']];
    const enClasse = d.moment === 'classe' && !(derniere && d.choix === 'reserve'); /* 7.5 : à la dernière heure, une réserve non donnée reçoit une décision de fin de séance */ const dur = x.diapos.reduce((t, i) => t + E[i].dur, 0);
    h += `<div class="carte" data-act="${a.id}"><div style="margin-bottom:6px"><b>${a.pseudo ? 'Diapo' : 'Activité'} ${dr_esc(String(a.num))} — ${dr_esc(a.titre)}</b> <span style="color:var(--sourd)">· ${x.diapos.length} diapo${x.diapos.length > 1 ? 's' : ''} restante${x.diapos.length > 1 ? 's' : ''} · ${dur} min${x.commencee ? ' · commencée' : ''}${enClasse ? ' · retirée en classe à ' + d.h + ' : ' + libDecision(d) : (d.moment === 'classe' && d.choix === 'reserve' ? ' · était en réserve : la séance se ferme, décide' : '')}</span></div><div class="minis">${x.diapos.map(i => `<div class="mini" data-i="${i}" title="${dr_esc(E[i].act)} — un clic agrandit"></div>`).join('')}</div><div class="dec" ${enClasse ? 'style="opacity:.4;pointer-events:none"' : ''}>${choix.filter(c => !(c[0] === 'terminer' && !x.commencee) && !(c[0] === 'preparer' && x.commencee)).map(c => `<button class="btn ${d.choix === c[0] ? 'on' : ''}" data-c="${c[0]}" title="${({ suivante: 'elle glisse à l\'heure suivante, après la réactivation', terminer: 'commencée : l\'élève la termine chez lui, on la reprend en classe (même à l\'oral)', preparer: 'pas commencée : l\'élève la prépare chez lui, on la reprend en classe', pastemps: 'pas commencée : elle sort du programme, fléchée « pas le temps »', reserve: 'pour ceux qui ont fini, pendant la séance', nonfait: 'avec un motif, pour toi', reporter: 'elle entre en tête de la séance suivante de cette classe' })[c[0]]}">${c[1]}</button>`).join('')}</div>${notions.length ? `<div class="cout">Ces notions ne seraient pas travaillées : ${notions.map(dr_esc).join(' · ')} — <b>${prevAilleurs ? 'prévu plus loin dans le chapitre' : 'pas prévu ailleurs'}</b></div>` : ''}${d.choix === 'nonfait' ? `<div class="cout">motif : <input type="text" data-motif="${a.id}" value="${dr_esc(d.motif || '')}" placeholder="pour toi" style="width:60%"></div>` : ''}</div>`; });
  if (!restantes.length) { const nonVues = ordreHeure(S.heure).filter(i => !E[i].role && !vuMax[K(i)]).length; h += nonVues && !acts.length ? `<div style="color:var(--texte2)">La trame de cette séance n’a pas d’activités à décider : <b>${nonVues} diapo${nonVues > 1 ? 's' : ''} de cette heure n’${nonVues > 1 ? 'ont' : 'a'} pas été montrée${nonVues > 1 ? 's' : ''}</b> — ${nonVues > 1 ? 'elles continuent' : 'elle continue'} à l’heure suivante de la séance.</div>` : '<div style="color:var(--texte2)">tout ce qui était prévu pour cette heure a été fait.</div>'; }   /* E2 : relecteur neuf n°2 — sans activités, « tout a été fait » mentait */
  h += `</div>`;
  h += `<div class="travail"><h3 style="margin-top:0">Travail à faire pour la prochaine fois</h3>`;
  const term = restantes.filter(x => (S.decisions[x.a.id] || {}).choix === 'terminer'); const prep = restantes.filter(x => (S.decisions[x.a.id] || {}).choix === 'preparer'); const mais = restantes.filter(x => ['pastemps', 'maison'].includes((S.decisions[x.a.id] || {}).choix));
  h += `<div style="color:var(--texte2)">${term.length ? 'terminer : ' + term.map(x => '<b>activité ' + dr_esc(String(x.a.num)) + '</b>').join(', ') + ' (reprise en classe) · ' : ''}${prep.length ? 'préparer : ' + prep.map(x => '<b>activité ' + dr_esc(String(x.a.num)) + '</b>').join(', ') + ' (reprise en classe) · ' : ''}${mais.length ? 'à faire : ' + mais.map(x => '<b>activité ' + dr_esc(String(x.a.num)) + '</b>').join(', ') + ' · ' : ''}${!term.length && !prep.length && !mais.length ? 'rien choisi au-dessus pour la maison.' : ''}</div>`;
  h += `<label><input type="checkbox" id="f-prevu" ${S.travail.prevu && prevu ? 'checked' : ''} ${prevu ? '' : 'disabled'}> Ce que la trame prévoyait pour cette heure : <i>${dr_esc(prevu || 'rien de prévu')}</i></label>`;
  h += `<div class="taxo"><label><b>Apprendre les notions de l'heure</b> <button class="btn" id="f-nouvelles" style="padding:1px 7px;font-size:.8rem" title="Décoche les notions déjà rencontrées plus tôt dans le chapitre (dans la maquette : d'après la trame, pas d'après ce que la classe a vu)">seulement les nouvelles</button></label>${taxoHtml(notionsHeure)}</div>`;
  h += `<label>Autre travail : <input type="text" id="f-libre" value="${dr_esc(S.travail.libre)}" placeholder="un travail spécifique, dans tes mots" style="width:70%"></label>`;
  h += `<label>Échéance (si tu la donnes) : <select id="f-ech" title="La date pour laquelle les élèves notent le travail ; la prochaine heure de la classe est proposée en premier"><option value="">aucune</option>${dr_classe()/* E1 : lisait DATA.classe */.prochaines.map(p => `<option value="${p.iso}" ${S.echeance === p.iso ? 'selected' : ''}>${dr_esc(p.l)}</option>`).join('')}</select> <span style="color:var(--sourd)">— la prochaine heure de la classe est proposée en premier</span></label>`;
  h += `</div><div style="margin:8px 0 4px;color:var(--texte2)"><b style="color:var(--or)">Au tableau, pendant cet écran :</b> <button class="btn ${(S.finVue || 'travail') === 'travail' ? 'on' : ''}" data-finvue="travail" title="Le tableau montre l'agenda École Directe : travail à faire, la date, la participation">Travail à faire</button> <button class="btn ${S.finVue === 'contenu' ? 'on' : ''}" data-finvue="contenu" title="Le tableau montre le contenu de la séance : le récit de l'heure, tel que les élèves le retrouveront">Contenu de la séance (le récit)</button></div></div>`;
  if (cloture) { h += clotureHtml(); }
  h += `<div style="height:70px"></div><div class="barre-fin"><span style="color:var(--texte2)">${cloture ? 'Clore ferme l\'heure : le journal, le récit, le travail à faire et le mot des absents sont enregistrés pour cette classe.' : 'Rien n\'est fermé : tu reviens au cours avec ces décisions.'}</span><span style="flex:1"></span><button class="btn" id="f-fermer">${cloture ? 'Annuler' : 'Revenir au cours'}</button>${cloture ? '<button class="btn or" id="f-clore" title="Ferme l\'heure : le journal, le récit, le travail à faire et le mot des absents sont enregistrés pour cette classe ; s\'il manque quelque chose, le site te le dit d\'abord">Clore l\'heure</button>' : '<button class="btn or" id="f-ok">Garder ces décisions</button>'}</div>`;
  h = sequenceHtml(h, cloture, restantes);
  const zone = S.preparation ? $('prep') : $('fin'); if (S.preparation) { $('prep').style.display = 'block'; $('droite').classList.remove('fin'); } else { $('prep').style.display = 'none'; }
  const scrollAvant = $('droite').scrollTop; poserHtml(zone, h); if (S.preparation) { if ($('fin').innerHTML) poserHtml($('fin'), ''); } $('ecran-fin').classList.remove('on', 'ouverture'); /* la séquence vit dans la colonne : le voile de fin ne s'ouvre jamais vide (il interceptait les clics) */ if ($('fin').parentElement !== $('droite-fin')) $('droite-fin').appendChild($('fin')); if (!S.preparation) { $('droite').classList.add('fin'); if (S.sansDroite) { S.sansDroite = false; poserColonnes(); } S.enFin = true; } else { $('droite').classList.remove('fin'); S.enFin = false; } /* le tableau passe sur la vue de fin d'heure (travail à faire, participation) */
  $('fin').querySelectorAll('.mini').forEach(m => { const i = +m.dataset.i; const e = E[i]; const st = parDiapo[K(i)] || { nDev: 0, lum: [], ecr: [], reps: {}, tailles: {}, textes: {}, fsBloc: {} }; const et = { si: S.si, di: i, nDev: elements(e).length, lum: st.lum, ecr: st.ecr, taille: 1, page: 0, reps: st.reps, tailles: st.tailles, textes: st.textes, fsBloc: {}, pilote: false, videoPos: S.videoPos[e.eid] || 0 }; let inner = m.querySelector(':scope > .mur'); if (!inner) { inner = document.createElement('div'); inner.className = 'mur'; m.innerHTML = ''; m.appendChild(inner); } rendre(inner, et); if (st.nDev < elements(e).length) inner.querySelectorAll('[data-k]').forEach(li => { if (+li.dataset.k >= st.nDev) li.classList.add('pas'); }); /* (p8-3c) la question comprise */ const pg = inner.querySelector('.page'); if (pg) pg.textContent = ''; m.onclick = () => m.classList.toggle('grand'); });
  const Z = S.preparation ? $('prep') : $('fin'); Z.querySelectorAll('[data-ouvre]').forEach(t => t.onclick = () => { const n = +t.dataset.ouvre; if (n === S.finSection) return; S.finSection = n; ouvrirFin(cloture); });
  const fsv = $('f-suivante'); if (fsv) fsv.onclick = () => { if (S.finSection < 7) { S.finFaites[S.finSection] = S.finFaites[S.finSection] || (S.finSection === 5); S.finSection++; journal('fin-section', { n: S.finSection }); ouvrirFin(cloture); } }; const fpv = $('f-precedente'); if (fpv) fpv.onclick = () => { if (S.finSection > 1) { S.finSection--; ouvrirFin(cloture); } }; document.querySelectorAll('#fin .pp-liste [data-sec]').forEach(l => { l.style.cursor = 'pointer'; l.onclick = () => { const k = +l.dataset.sec; if (k >= 1 && k <= 7 && k !== S.finSection) { S.finSection = k; journal('fin-section', { n: k }); ouvrirFin(cloture); } }; });   /* E2 (banc du 21/10, 15:40) : l'infobulle disait « un clic sur une ligne ouvre l'étape », rien n'y était branché */

  const fpr = $('f-preparer'); if (fpr) fpr.onclick = preparerCahier; const frv = $('f-revenir'); if (frv) frv.onclick = revenirAuCours;
  const frn = $('f-rien'); if (frn) frn.onclick = () => { S.rienProchaine = S.rienProchaine || {}; S.rienProchaine[S.heure] = !S.rienProchaine[S.heure]; journal('rien-prochaine-fois', { h: S.heure, valeur: S.rienProchaine[S.heure] }); ouvrirFin(cloture); };
  const fvt = $('f-vers-travail'); if (fvt) fvt.onclick = () => { allerAuCahier('travail'); }; const fvr = $('f-vers-recit'); if (fvr) fvr.onclick = () => { allerAuCahier('contenu'); };
  const frl = $('f-relu'); if (frl) frl.onclick = () => { S.recitRelu = S.recitRelu || {}; S.recitRelu[S.heure] = true; journal('recit-relu', { h: S.heure, par: 'clic' }); ouvrirFin(cloture); };
  const fcc = $('f-copie-contenu'); if (fcc) fcc.onclick = () => { S.copieED = S.copieED || {}; S.copieED[S.heure] = Object.assign(S.copieED[S.heure] || {}, { t: now(), contenu: true }); journal('copie-ed', { quoi: 'contenu' }); const dire = m => { const z = $('f-copie-etat'); if (z) z.textContent = m; }; const d = document.createElement('div'); let html0 = ''; try { d.innerHTML = recitHtml(now(), S.heure); const rec0 = d.querySelector('.recit'), tete = d.querySelector('.dr-recit-tete'); if (rec0 && typeof dr_recitContenuED === 'function') html0 = (tete ? tete.innerHTML : '') + dr_recitContenuED(rec0); } catch (e) {} if (!html0) html0 = recitPourED(S.heure);
    if (typeof dr_recitCopierED === 'function') dr_recitCopierED(html0, null, 'copié : le contenu de séance', dire); else { d.innerHTML = html0; copierTexte(d.innerText, 'copié : le contenu de séance'); } ouvrirFin(cloture); }; /* E2 (réveil n°5, A4-1) : le même contenu que la copie de la Relecture (son entête, `dr_recitContenuED`), et le texte simple composé par l'outil d'E4 (ses paragraphes) — avant : `textContent`, les paragraphes collés sans retour */
  const fct = $('f-copie-travail'); if (fct) fct.onclick = () => { S.copieED = S.copieED || {}; S.copieED[S.heure] = Object.assign(S.copieED[S.heure] || {}, { t: now(), travail: true }); journal('copie-ed', { quoi: 'travail' }); { const tx = texteTravail() || '(rien à faire)'; const dire = m => { const z = $('f-copie-etat'); if (z) z.textContent = m; }; if (typeof dr_recitCopierED === 'function') dr_recitCopierED('<p>' + dr_esc(tx).replace(/\n/g, '<br>') + '</p>', tx, 'copié : le travail à faire', dire);   /* comme la Relecture (E4) */ else copierTexte(tx, 'copié : le travail à faire'); } ouvrirFin(cloture); }; /* E2 : HTML propre + texte — avant : texte brut */

  const fmo = $('f-mot'); if (fmo) fmo.oninput = () => { S.motAbsents = fmo.value; };   /* E2 : le mot aux absents se garde à la frappe */
  const fse = $('f-sans-ech'); if (fse) fse.onclick = () => { S.echeance = null; S.finFaites[1] = true; S.finSection = 2; edTexte(); dr_tout(); ouvrirFin(cloture); };
  const fe2 = $('f-ech'); if (fe2) fe2.addEventListener('change', () => { S.finFaites[1] = true; ouvrirFin(cloture); });
  $('droite').scrollTop = scrollAvant; $('fin').querySelectorAll('[data-finvue]').forEach(b => b.onclick = () => { S.finVue = b.dataset.finvue; journal('tableau-onglet', { onglet: S.finVue }); ouvrirFin(cloture); dr_tout(); });
  const debord = () => { const min = restantes.filter(x => ['suivante', 'terminer', 'preparer'].includes((S.decisions[x.a.id] || {}).choix)).reduce((t, x) => t + x.diapos.reduce((u, i) => u + E[i].dur, 0), 0); const suiv = E.filter(e => e.heure === S.heure + 1).reduce((t, e) => t + e.dur, 0); const d = suiv + min - 46; if ($('f-debord')) if ($('f-debord')) $('f-debord').textContent = derniere ? '' : (d > 0 ? `l'heure suivante dépasserait de ${d} min` : 'l\'heure suivante tient'); }; debord();
  Z.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const id = b.closest('.carte').dataset.act; S.decisions[id] = { choix: b.dataset.c, moment: 'fin', h: hhmm(), heure: S.heure }; ouvrirFin(cloture); dr_tout(); });
  $('fin').querySelectorAll('[data-motif]').forEach(i => i.onchange = () => { S.decisions[i.dataset.motif].motif = i.value; edTexte(); });
  Z.querySelectorAll('[data-notion]').forEach(c => c.onchange = () => { const id = c.dataset.notion; const l = S.travail.apprendre; if (c.checked) { if (!l.includes(id)) l.push(id); } else { const j = l.indexOf(id); if (j >= 0) l.splice(j, 1); } ouvrirFin(cloture); });
  $('fin').querySelectorAll('[data-grp]').forEach(c => c.onchange = () => { const ids = c.dataset.grp.split(','); const l = S.travail.apprendre; ids.forEach(id => { const j = l.indexOf(id); if (c.checked) { if (j < 0) l.push(id); } else if (j >= 0) l.splice(j, 1); }); ouvrirFin(cloture); });
  const fn = $('f-nouvelles'); if (fn) fn.onclick = () => { S.travail.apprendre = S.travail.apprendre.filter(id => !dejaVue(id)); ouvrirFin(cloture); };
  const fp = $('f-prevu'); if (fp) fp.onchange = () => { S.travail.prevu = fp.checked; edTexte(); };
  if ($('f-libre')) $('f-libre').oninput = ev => { S.travail.libre = ev.target.value; edTexte(); dr_tout(); }; if ($('f-ech')) $('f-ech').onchange = ev => { S.echeance = ev.target.value || null; edTexte(); dr_tout(); };
  const fb = $('f-bilan'); if (fb) fb.onclick = () => { $('ecran-fin').classList.remove('on'); $('droite').classList.remove('fin'); S.enFin = false; const bi = E.indexOf(bilan); S.di = bi; S.page = null; dr_tout(); journal('aller-bilan', { di: bi }); };
  const frp = $('f-reprendre'); if (frp) frp.onclick = () => { $('ecran-fin').classList.remove('on'); $('droite').classList.remove('fin'); S.enFin = false; dr_tout(); };   /* E2 : un id par bouton (relecteur neuf n°2 : deux #f-fermer) */
  const ffm = $('f-fermer'); if (ffm) ffm.onclick = () => { $('ecran-fin').classList.remove('on'); $('droite').classList.remove('fin'); S.enFin = false; dr_tout(); };
  const fc = $('f-clore'); if (fc) fc.onclick = () => { if (S.preparation) { $('gclore-corps').innerHTML = `<div class="gc-l"><span class="gc-n">❄</span><span>Tu prépares le cahier : la classe est encore sur la diapo ${rangDe(S.preparation.di)} — <b>reviens au cours</b> (« Revenir au cours »), puis clos.</span></div>`; $('garde-clore').classList.add('on'); $('gclore-oui').style.display = 'none'; $('gclore-non').textContent = 'Compris'; $('gclore-non').onclick = () => { $('garde-clore').classList.remove('on'); $('gclore-oui').style.display = ''; $('gclore-non').textContent = 'Y retourner'; }; return; } const manques = manquesAvantDeClore(restantes); if (manques.length && !S._cloreQuandMeme) { $('gclore-corps').innerHTML = manques.map(m => `<div class="gc-l"><span class="gc-n">○</span><span><b>${dr_esc(m.lib)}</b>${m.facultatif ? ' (facultatif)' : ''} — ${dr_esc(m.risque)}</span></div>`).join(''); $('garde-clore').classList.add('on'); $('gclore-non').onclick = () => { $('garde-clore').classList.remove('on'); S.finSection = manques[0].n; ouvrirFin(cloture); }; $('gclore-oui').onclick = () => { $('garde-clore').classList.remove('on'); journal('clore-quand-meme', { manques: manques.map(m => m.lib) }); S._cloreQuandMeme = true; fc.click(); S._cloreQuandMeme = false; }; $('gclore-non').focus(); return; } S.motAbsents = ($('f-mot') || {}).value || S.motAbsents || ''; /* E2 : le mot tapé à l'étape 5 est gardé (relecteur neuf n°2) */ S.mots = S.mots || {}; S.mots[S.heure] = S.motAbsents; S.travailHeure = S.travailHeure || {}; S.travailHeure[S.heure] = texteTravailED(); S.echeanceHeure = S.echeanceHeure || {}; S.echeanceHeure[S.heure] = S.echeance; S.apprendreHeure = S.apprendreHeure || {}; S.apprendreHeure[S.heure] = (S.travail && S.travail.apprendre) ? S.travail.apprendre.slice() : []; if (S.travailEdite && S.travailEdite[S.heure] != null) journal('travail-edite-final', { texte: S.travailEdite[S.heure] }); journal('cloture', { bilanAtteste: !!S.bilanCoche }); S.close = true; S.closes = S.closes || {}; S.closes[S.heure] = now(); try { dr_cloreFin(); } catch (e) {} /* E2 : H clos, finReel, cours_actif nul, le journal et l'état (atDrCloreFin) */ S.enFin = false; if (S.gel) degeler(); dr_tout(); /* le tableau passe en attente */ $('ecran-fin').classList.remove('on'); $('droite').classList.remove('fin'); voir('relecture'); }; /* E2 : la clôture amène à la relecture (C1 11.2) — avant : l'EDT simulé pour l'heure 2 */
  edTexte();
}

function dejaVue(id){ return dr_seances()/* E1 : lisait DATA.seances */.some((s, k) => s.ecrans.some(e => (e.comp || []).includes(id) && (k < S.si || (k === S.si && e.heure < S.heure)))); }

function taxoHtml(set){ let h = ''; dr_taxo()/* E1 : lisait DATA.taxo */.forEach(d => { const fams = d.familles.map(f => ({ f, ns: f.notions.filter(n => set.has(n.id)) })).filter(x => x.ns.length); if (!fams.length) return; const idsD = fams.flatMap(x => x.ns.map(n => n.id)); const allD = idsD.every(id => S.travail.apprendre.includes(id));
  h += `<div class="dom"><label><input type="checkbox" data-grp="${idsD.join(',')}" ${allD ? 'checked' : ''}> <b>${dr_esc(d.prof)}</b></label>`; fams.forEach(x => { const idsF = x.ns.map(n => n.id); const allF = idsF.every(id => S.travail.apprendre.includes(id)); h += `<div class="fam"><label><input type="checkbox" data-grp="${idsF.join(',')}" ${allF ? 'checked' : ''}> ${dr_esc(x.f.prof)}</label>`; x.ns.forEach(n => { h += `<div class="not"><label><input type="checkbox" data-notion="${n.id}" ${S.travail.apprendre.includes(n.id) ? 'checked' : ''}> ${dr_esc(n.eleve || n.prof)} <span class="neuve">${dejaVue(n.id) ? 'déjà rencontrée' : 'nouvelle'}</span></label></div>`; }); h += '</div>'; }); h += '</div>'; }); return h || '<div style="color:var(--sourd)">aucune notion déclarée sur les diapos jouées</div>'; }

function contenuEntier(e){ return e.blocs.map(b => { if (b.t === 'consigne') return b.txt + (b.el && b.el.length ? ' ' + b.el.map((x, i) => (i + 1) + '. ' + x).join(' ') : ''); if (b.t === 'question') return b.txt; if (b.t === 'fiche') return b.txt + (b.el && b.el[0] ? ' — ' + b.el[0] : ''); if (b.t === 'image') return b.txt + ' (image)'; if (b.t === 'schema') return 'le schéma « ' + b.txt + ' »'; if (b.t === 'video') return 'la vidéo « ' + b.txt + ' »'; return b.txt; }).join(' '); }

function objetDec(cle){ const a = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(x => x.id === cle); if (a) { const E = seance().ecrans; const rest = a.diapos.filter(i => !finie(E[i], i)); return { titre: 'Activité ' + a.num + ' — ' + a.titre, video: rest.length === 1 && E[rest[0]].blocs[0] && E[rest[0]].blocs[0].t === 'video' ? E[rest[0]].blocs[0] : null, contenu: rest.map(i => E[i].act + ' : ' + contenuEntier(E[i])).join(' — ') }; } const e = seance().ecrans.find(x => x.eid === cle); return e ? { titre: e.act, video: e.blocs[0] && e.blocs[0].t === 'video' ? e.blocs[0] : null, contenu: contenuEntier(e) } : null; }

function texteTravailED(){ return (S.travailEdite && S.travailEdite[S.heure] != null) ? S.travailEdite[S.heure] : texteTravail(); }

function texteTravail(){ if (S.travailEdite && S.travailEdite[S.heure] != null && S.travailEdite[S.heure] !== '') return S.travailEdite[S.heure]; const l = []; const ech = S.echeance ? dr_classe()/* E1 : lisait DATA.classe */.prochaines.find(p => p.iso === S.echeance) : null;
  Object.keys(S.decisions).forEach(cle => { const d = S.decisions[cle]; if (d.heure && d.heure !== S.heure) return; const o = objetDec(cle); if (!o) return; if (d.choix === 'terminer') l.push(`Terminer « ${o.titre} » : ${o.contenu}`); if (d.choix === 'preparer') l.push(`Préparer « ${o.titre} » : ${o.contenu}`); if (d.choix === 'pastemps' || d.choix === 'maison') { if (o.video) l.push(`Regarder la vidéo « ${o.video.txt} » : voici le lien de l'espace de travail ${dr_classe()/* E1 : lisait DATA.classe */.lienED} ; clique ensuite sur le dossier Français, puis sur « ${dr_chapitreTitre()/* E1 : lisait DATA.chapitre */.split(' (')[0]} » (le chapitre en cours), puis sur la vidéo « ${o.video.fichier} ».`); else l.push(`Faire « ${o.titre} » : ${o.contenu}`); } });
  if (S.travail.prevu && dr_travail()/* E1 : lisait DATA.travailPrevu */[S.si + '|' + S.heure]) l.push(dr_travail()/* E1 : lisait DATA.travailPrevu */[S.si + '|' + S.heure]);
  if (S.travail.apprendre && S.travail.apprendre.length) l.push('Apprendre : ' + S.travail.apprendre.map(libNotionEleve).join(' ; ') + '.');
  if (S.travail.libre.trim()) l.push(S.travail.libre.trim());
  return (l.length ? 'Pour la prochaine séance' + (ech ? ' (' + ech.l.split(',')[0] + ')' : '') + ' — ' + l.join(' — ') : ''); }

function edTexte(){ const el = $('f-ed'); if (!el) return; if (document.activeElement !== el) el.textContent = texteTravailED() || ''; const rs = $('f-ed-reset'); if (rs) rs.onclick = ev => { ev.preventDefault(); delete S.travailEdite[S.heure]; journal('travail-recompose'); ouvrirFin(!!$('f-clore')); dr_tout(); }; el.oninput = () => { S.travailEdite = S.travailEdite || {}; S.travailEdite[S.heure] = el.textContent; if (!S._edT) S._edT = setTimeout(() => { S._edT = null; journal('travail-edite', { texte: S.travailEdite[S.heure] }); dr_tout(); }, 800); }; }

function clotureHtml(){ const versees = S.notesFil.filter(n => n.versee);
  let h = `<div class="travail"><h3 style="margin-top:0">Avant de clore</h3>`;
  h += `<div><b>Durées changées pendant l'heure</b> — verser dans la trame ? ${(S.durees && Object.keys(S.durees).length) ? Object.keys(S.durees).map(id => { const a = (dr_activites()/* E1 : lisait DATA.activites */[String(S.si)] || []).find(x => x.id === id); return a ? `<label><input type="checkbox" data-verse-duree="${id}"> A${a.num} · ${dr_esc(a.titre || '')} : ${S.durees[id]} min</label>` : ''; }).join('') : '<span class="sourd">aucune</span>'}<br><b>Diapos modifiées pendant l'heure</b> — ce que la classe a vu, à verser ou non dans la trame : ${p8ListeVersement()}</div>`; /* (p8-5) la copie de la classe comparée à la trame, par identité */
  h += `<div style="margin-top:8px"><b>Notes versées au récit</b> — les garder aussi comme notes présentateur de la diapo ? ${versees.length ? versees.map((n, i) => `<label><input type="checkbox" data-np="${i}"> diapo ${n.di} : ${dr_esc(n.t.slice(0, 60))}</label>`).join('') : '<span style="color:var(--sourd)">aucune</span>'}</div>`;
  const absents = ELEVES.filter(e => (S.appel[e] || []).length);
  h += `<div style="margin-top:8px"><b>Un mot pour les absents</b> (${absents.length ? absents.map(prenomUnique).join(', ') : 'aucun'}) : <input type="text" id="f-mot" title="Un mot ajouté à la fin du message de chaque absent (facultatif)" value="${dr_esc(S.motAbsents)}" placeholder="facultatif — ajouté à la fin du mot de chacun" style="width:60%"></div>`;
  h += (S.heure >= ((dr_heureJouee(S.heure) || {}).sur || 1) ? /* E2 — avant : S.heure === 2 */ `<div style="margin-top:8px;${S.bilanCoche ? 'color:var(--joue)' : 'color:var(--rouge)'}">${S.bilanCoche ? 'Le bilan de la séance est attesté : les élèves l\'ont écrit.' : 'Le bilan de la séance n\'est pas attesté (la coche, sur la diapo du bilan). La séance se clôt quand même ; la relecture le dira.'}</div>` : '') + `<div style="margin-top:8px;color:var(--texte2)">À la clôture, le site enregistre par classe et par heure : le récit, le travail à faire en entier, la liste des absents avec leurs heures, le mot par absent — là où le profil longitudinal se branchera.</div></div>`; return h; }

$('bfin').onclick = () => { if (p8CopieDiffere()) S.finSection = 5; /* (p8-5) la liste du versement s'ouvre */ ouvrirFin(true); };

// ───────── l'écran d'ouverture de l'heure suivante : où en est la classe (cadrage 1, 6.5-6.7 ; 0.3 du cadrage 4) ─────────
function faisceauHtml(h){ /* 7.1 : pour chaque activité de l'heure qui remobilise une notion non travaillée, un faisceau de questions oui / non ; une notion à la fois */ const E = seance().ecrans; const liste = remobNonTravaillees(h).filter(r => !(S.faisceauFait || {})[h + ':' + r.id + ':' + r.di]); if (!liste.length) { S.faisceau = null; return ''; } const r = liste[0]; const f = S.faisceau && S.faisceau.h === h && S.faisceau.id === r.id && S.faisceau.di === r.di ? S.faisceau : (S.faisceau = { h, id: r.id, di: r.di, q: 1, reps: [] }); const src = r.source; const prevuSrc = src ? dureeDe(src) : 0; const prevuH = ordreHeure(h).filter(i => E[i].role !== 'fin').reduce((t, i) => t + (E[i].dur || 0), 0); const utiles = (dr_heureDe(h)/* E1 : lisait HEURES_SIM */ && dr_heureDe(h)/* E1 : lisait HEURES_SIM */.utiles) || 50; const depasse = Math.max(0, prevuH + prevuSrc - utiles);
  const ctx = `<div class="ctx"><b>${dr_esc(r.act)}</b>${r.a ? ' (activité ' + r.a.num + ' de cette heure)' : ''} remobilise <b>« ${dr_esc(r.lib)} »</b> — <b>non travaillée</b>${src ? ' : « ' + dr_esc(src.titre) + ' » (activité ' + src.num + ' de l\'heure ' + (E[src.diapos[0]].heure) + ') est ' + dr_esc(r.sourceEtat) + '.' : '.'}</div>`;
  const Q = { 1: 'Cette heure a-t-elle besoin de cette notion pour tenir ?', 2: src ? `As-tu le temps de jouer d'abord « ${dr_esc(src.titre)} » (${prevuSrc} min prévues${depasse ? ' — l\'heure dépasserait de ' + depasse + ' min' : ''}) ?` : 'As-tu le temps de jouer d\'abord l\'activité qui la travaille ?', 3: 'Peux-tu reprendre la notion toi-même, à l\'oral, en quelques minutes ?' };
  const ENT = { 1: `Si <b>non</b> → on laisse tel quel (noté au journal). Si <b>oui</b> → question 2.`, 2: `Si <b>oui</b> → on remet « ${src ? dr_esc(src.titre) : 'l\'activité'} » avant, en tête de l'heure. Si <b>non</b> → question 3.`, 3: `Si <b>oui</b> → une reprise à l'oral avant « ${dr_esc(r.act)} » (une ligne dans l'ordre de l'heure). Si <b>non</b> → on décale « ${dr_esc(r.act)} » à l'heure suivante.` };
  const fil = f.reps.map((x, k) => `<div class="fil">${k + 1} · ${Q[k + 1].replace(/<[^>]+>/g, '')} — <b>${x ? 'oui' : 'non'}</b></div>`).join('');
  if (f.concl) { const LIB = { laisser: 'on laisse tel quel — l\'heure se joue comme prévu, en le sachant', remettre: `on remet « ${src ? dr_esc(src.titre) : ''} » avant, en tête de l'heure`, reprise: `une reprise à l'oral de « ${dr_esc(r.lib)} » avant « ${dr_esc(r.act)} »`, decaler: `on décale « ${dr_esc(r.act)} » à l'heure suivante` }; return `<div class="fais" id="fais"><h4>Ce que cette heure remobilise et qui n'a pas été travaillé — conclusion${liste.length > 1 ? ' (' + liste.length + ' notions, une à la fois)' : ''}</h4>${ctx}${fil}<div class="concl">Donc : <b>${LIB[f.concl]}</b>.</div><div class="rep"><button class="oui" id="fais-ok" title="Confirme : c'est noté au journal, l'ordre de l'heure se recalcule s'il y a lieu">C'est ça</button><button id="fais-re" title="Repart de la question 1">Recommencer</button></div></div>`; }
  return `<div class="fais" id="fais"><h4>Ce que cette heure remobilise et qui n'a pas été travaillé — question ${f.q} sur 3${liste.length > 1 ? ' (' + liste.length + ' notions, une à la fois)' : ''}</h4>${ctx}${fil}<div class="q">${f.q} · ${Q[f.q]}</div><div class="rep"><button class="oui" data-fais="1">Oui</button><button data-fais="0">Non</button></div><div class="concl">${ENT[f.q]}</div></div>`; }

function brancherFaisceau(h){ const z = $('fais'); if (!z) return; z.querySelectorAll('[data-fais]').forEach(b => b.onclick = () => { const f = S.faisceau; const oui = b.dataset.fais === '1'; f.reps.push(oui); if (f.q === 1) { if (!oui) f.concl = 'laisser'; else f.q = 2; } else if (f.q === 2) { if (oui) f.concl = 'remettre'; else f.q = 3; } else { f.concl = oui ? 'reprise' : 'decaler'; } journal('faisceau-reponse', { h, notion: f.id, q: f.q, oui }); ouvrirOuverture(); });
  const re = $('fais-re'); if (re) re.onclick = () => { S.faisceau.q = 1; S.faisceau.reps = []; delete S.faisceau.concl; journal('faisceau-recommence', { h }); ouvrirOuverture(); };
  const ok = $('fais-ok'); if (ok) ok.onclick = () => { const f = S.faisceau; const E = seance().ecrans; const r = remobNonTravaillees(h).find(x => x.id === f.id && x.di === f.di); S.faisceauFait = S.faisceauFait || {}; S.faisceauFait[h + ':' + f.id + ':' + f.di] = f.concl; if (f.concl === 'remettre' && r && r.source) { S.decisions[r.source.id] = { choix: 'suivante', heure: E[diaposAct(r.source)[0]].heure, t: now(), remob: true }; } if (f.concl === 'decaler' && r && r.a) { S.decisions[r.a.id] = { choix: 'suivante', heure: h, moment: 'classe', t: now(), remob: true }; } if (f.concl === 'reprise' && r) { S.reprisesPrevues = S.reprisesPrevues || {}; S.reprisesPrevues[h] = S.reprisesPrevues[h] || []; S.reprisesPrevues[h].push({ notion: f.id, lib: r.lib, avant: f.di, act: r.act }); } journal('faisceau-conclusion', { h, notion: f.id, lib: r ? r.lib : f.id, activite: r ? r.act : '', conclusion: f.concl, reponses: f.reps }); S.faisceau = null; ouvrirOuverture(); }; }

function ouvrirOuverture(){ if (S.anim) { clearInterval(S.anim); S.anim = null; } if (!S.close) { /* 6.7 : le T-5 de l'heure non close se rattrape avant de lancer, jamais devant la classe */ S._rattrapage = true; ouvrirFin(true); return; } const h = S.heure + 1; if ($('fin').parentElement !== $('ecran-fin')) $('ecran-fin').appendChild($('fin')); $('droite').classList.remove('fin'); const sim = dr_heureDe(h)/* E1 : lisait HEURES_SIM */; const o = ordreHeure(h); const E = seance().ecrans; const glissees = o.filter(i => glisseeDe(E[i], h)); const prevu = o.reduce((a, i) => a + E[i].dur, 0); const utileH = Math.max(0, dr_tempsUtile(((dr_heureJouee(h) || {}).debut || '08:00') + '-' + ((dr_heureJouee(h) || {}).fin || '08:51'), (dr_heureJouee(h) || {}).debut)); const debord = prevu - utileH; /* E2 — avant : 46 en dur */
  const jouees = E.filter((e, i) => vuMax[K(i)]).length; const h1 = dr_heureDe(S.heure)/* E1 : lisait HEURES_SIM */;
  const videos = E.filter((e, i) => o.includes(i) && e.blocs[0] && e.blocs[0].t === 'video'); const cleOk = videoAtteignable();
  let x = `<h2>Où en est la ${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom)} — ${dr_esc(sim.jour)}, ${sim.debut}-${sim.fin} · heure ${h} sur ${(dr_heureJouee(S.heure) || {}).sur || 1}</h2><div class="sous">${dr_esc(seance().titre)}</div>`;
  x += `<div class="travail"><b>L'heure ${S.heure}</b> (${dr_esc(h1.jour)}, ${h1.debut}) : ${S.close ? 'close à ' + hhmm(S.closes[S.heure]) : '<b style="color:var(--rouge)">pas close — ses décisions sont à prendre avant de lancer</b>'} · ${jouees} diapo${jouees > 1 ? 's' : ''} montrée${jouees > 1 ? 's' : ''} · ${[...new Set(S.parts.map(p => p.nom))].length} élève${S.parts.length > 1 ? 's' : ''} ayant pris la parole${S.mots && S.mots[S.heure] ? ' · mot aux absents : « ' + dr_esc(S.mots[S.heure]) + ' »' : ''}</div>`;
  x += faisceauHtml(h);
  const rp = (S.reprisesPrevues || {})[h] || []; x += `<div class="travail"><b>Ce que l'heure ${h} jouera, dans l'ordre</b> : ${rp.map(q => `<span class="puce" style="color:var(--or)">↺ reprise à l'oral de « ${dr_esc(q.lib)} » avant « ${dr_esc(q.act)} »</span>`).join('')}${o.map((i, r) => `<span class="puce">${r + 1}. ${numDe(E[i]) ? 'A' + dr_esc(String(numDe(E[i]))) + ' · ' : ''}${dr_esc(E[i].act)}${glisseeDe(E[i], h) ? ' <i style="color:var(--ambre)">↩ glissée de l\'heure ' + E[i].heure + (decisionDe(E[i]).choix === 'terminer' ? ', à terminer' : decisionDe(E[i]).choix === 'preparer' ? ', préparée à la maison' : '') + '</i>' : ''}${E[i].role === 'reactivation' ? ' <i style="color:var(--ambre)">réactivation</i>' : ''}${retiree(E[i]) && decisionDe(E[i]) && decisionDe(E[i]).remob ? ' <i style="color:var(--rouge)">↪ décalée à l\'heure suivante</i>' : ''}${E[i].role === 'bilan' ? ' <i style="color:var(--ambre)">bilan de la séance</i>' : ''}</span>`).join(' ')}<div style="margin-top:8px" class="${debord > 0 ? 'debord' : ''}">${prevu} min prévues pour ${utileH} utiles${debord > 0 ? ' — l\'heure dépasserait de ' + debord + ' min : le T-5 le redira, c\'est toi qui décides' : ''}</div></div>`;
  if (videos.length) x += `<div class="travail"><b>Les vidéos de cette heure</b> : ${videos.map(v => `<div>${cleOk ? '✔' : '✘'} <b>${dr_esc(v.blocs[0].txt)}</b> — ${cleOk ? 'clé USB branchée sur ' + (S.tab === 'classe' ? "l'ordi de classe" : 'ton ordi portable') : '<b>branche la clé USB sur ' + (S.tab === 'classe' ? "l'ordi de classe" : 'ton ordi portable') + '</b>' + (S.tab === 'classe' && S.cle === 'portable' ? ' — ou ouvre la fenêtre du tableau sur ton ordi portable, où la clé est branchée' : '')}</div>`).join('')}<button class="btn" id="o-reverif" style="margin-top:6px" title="Regarde de nouveau si la clé USB des vidéos de cette heure est branchée">Revérifier</button></div>`;
  x += `<div style="height:70px"></div><div class="barre-fin"><span style="color:var(--texte2)">Lancer ouvre l'heure ${h} sur la réactivation ; rien n'est projeté avant.</span><span style="flex:1"></span><button class="btn" id="o-relecture" title="Ouvre la relecture de l\'heure d\'avant : le récit, ce qui s\'est passé, le papier — rien n\'est lancé">Voir la relecture de l'heure ${S.heure}</button><button class="btn or" id="o-lancer" ${S.close ? 'title="Lance l\'heure ' + h + ' : le chrono démarre, la réactivation va au tableau, tout s\'enregistre pour la classe"' : 'disabled title="Clos d\'abord l\'heure précédente (Fin de l\'heure)"'}>Lancer l'heure ${h}</button></div>`;
  poserHtml($('fin'), x); $('ecran-fin').classList.add('on', 'ouverture'); brancherFaisceau(h);
  const rv = $('o-reverif'); if (rv) rv.onclick = () => ouvrirOuverture(); $('o-relecture').onclick = () => { $('ecran-fin').classList.remove('on', 'ouverture'); voir('relecture'); };
  $('o-lancer').onclick = () => { DECALAGE = 0; S.paliers = {}; S.t5 = false; S.palier = null; if (!S.close) return; dr_lancerSuite(h); }; } /* E2 : la classe, le créneau, le hub — avant : lancerHeure(h) seul */

function lancerHeure(h){ S.heure = h; S.lancee = true; S.ordres = S.ordres || {}; S.ordres[h] = ordreHeureCalc(h); S.ordresEid = S.ordresEid || {}; S.ordresEid[h] = S.ordres[h].map(eidDe); /* E2 : now() est l'horloge réelle (socle, E1) — avant : T0 = Date.now() */ S.ecoule = 0; S.close = false; S.t5 = false; S.finSection = 1; S.finFaites = {}; /* E2 : la fin de l'heure n repart de l'étape 1 (vu par E4 : l'heure 2 s'ouvrait à l'étape 7, « sans échéance » coché) */ S.bilanCoche = false; S.travail = { terminer: [], preparer: [], apprendre: null, prevu: true, libre: '' }; S.echeance = null; S.motAbsents = ''; S.encart = null; S.doc = null; if (S.gel) degeler();
  const o = ordreHeure(h); S.di = o[0]; S.page = null; S.mur = null; S._rattrapage = false; journal('lancement', { heure: h }); $('ecran-fin').classList.remove('on'); $('hou').textContent = dr_entete(h); /* E2 : la classe, le créneau, l'heure n/N réels — avant : HEURES_SIM puis dr_heureDe (E1), « sur 2 » */ voir('pilotage'); dr_tout(); }

/* ═══ fin de la coupe E1-a ═══ */

/* ═══ dr-classe.js — E2, la classe et l'heure (contrat des quatre §6 ; mandat E2) ════════════════════════
   Ce que ça change en classe : Paul lance l'heure depuis la case de l'emploi du temps (ou d'un clic dans le
   Pilotage) ; le déroulé s'ouvre avec la vraie classe, le vrai créneau, l'heure n/N de la séance ; tout ce qui
   se passe s'enregistre au fil (le journal, l'état, le paquet de l'heure) ; à T-5 la fin de l'heure se déroule
   en sept étapes et l'heure se clôt ; si la page se ferme en pleine heure, il rouvre et retrouve tout.
   Règles tenues ici (contrat §5) : toute lecture par `dr_lire`, toute écriture par `dr_ecrire` (donc le mode
   test, 13 · 25) ; rien en répétition, rien dans l'atelier, rien hors d'une heure lancée ; JAMAIS un rang au
   hub — les diapos sont désignées par leur `eid` (le rang se refait à la lecture, `reindexer`).
   Lectures de l'audit E2 appliquées en attendant la conscience (C3, C4, C5, F9, F10) : voir `E2/JOURNAL.md`.
   ═════════════════════════════════════════════════════════════════════════════════════════════════════ */
var DR_CL = { jT: null, eT: null, tT: null, cT: null, absents: null, empreinte: '', relue: '', reprise: false };

/* ─── l'heure de cours : créneau, début, temps utile (R8 : `atTempsUtile`, `atDebutPropose`, repris paramétrés) ─── */
const dr_mn = x => { const p = String(x || '').split(':'); return (+p[0] || 0) * 60 + (+p[1] || 0); };
const dr_hm = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const dr_maintenantMn = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
/* le temps utile : la fin, moins le début, moins les cinq minutes d'agenda (CADRAGE-TEMPS §4) */
function dr_tempsUtile(creneau, debut){ const f = String(creneau || '').split('-')[1]; return dr_mn(f) - dr_mn(debut || String(creneau).split('-')[0]) - 5; }
/* le début proposé : maintenant s'il est dans le créneau, sinon son début (`atDebutPropose`) */
function dr_debutPropose(creneau){ const d = dr_mn(String(creneau).split('-')[0]), f = dr_mn(String(creneau).split('-')[1]), m = dr_maintenantMn(); return dr_hm(m > d && m < f ? m : d); }
/* le créneau proposé quand on n'est pas passé par l'EDT : celui où l'on est, sinon le prochain du jour, sinon le 3e (la tête d'aujourd'hui) */
function dr_creneauPropose(){
  const L = (typeof AT_EDT !== 'undefined' && Array.isArray(AT_EDT)) ? AT_EDT : []; const m = dr_maintenantMn();
  return L.find(c => dr_mn(c.split('-')[0]) <= m && m < dr_mn(c.split('-')[1])) || L.find(c => dr_mn(c.split('-')[0]) > m) || L[2] || L[0] || '08:00-08:55';
}
/* la classe proposée : celle de l'heure en cours, sinon celle que l'Atelier a choisie, sinon la première du niveau */
function dr_classeProposee(){
  try { if (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && AT_DR_COURS.classeSlug) return AT_DR_COURS.classeSlug; } catch (e) {}
  try { const c = (typeof dr_classe === 'function') ? dr_classe() : null; if (c && c.slug) return c.slug; } catch (e) {}
  try { const l = _lvlClasses((AT.edChap || {}).level) || []; if (l[0]) return l[0].slug; } catch (e) {}
  return '';
}
/* le slug d'une classe depuis son nom (la case de l'EDT dit le nom) : la clé de `classesData` */
const dr_slugDe = nom => { try { if (classesData[nom]) return nom; const k = Object.keys(classesData || {}).find(k => (classesData[k] || {}).nom === nom); return k || nom; } catch (e) { return nom; } };
const dr_nomClasse = slug => { try { const c = classesData && classesData[slug]; return (c && c.nom) || slug; } catch (e) { return slug; } };
/* le nombre d'heures de la séance : la MÊME fonction que la case de l'EDT (`edtHeuresPour`), jamais un calcul à part */
function dr_nbHeures(creneau){
  /* N, les heures de la séance : celles de la case de l'EDT (`sur`), posées au lancement ; sans case, 1 (contrat §12.5 — plus de « dernière heure » en dur) */
  return +DR_CL.sur || 1;
}

/* l'heure proposée pour un lancement sans l'EDT : les heures déjà jouées par cette classe dans cette séance, plus une (l'heure du jour sur ce créneau ne compte pas : c'est elle) */
function dr_heureProposee(slug, creneau){
  try { const ec = AT.edChap, sk = ATVUES.snum, sce = chapitresData[ec.level][ec.chnum].seances[sk];
    if (typeof edtHeuresJouees === 'function') { const n = edtHeuresJouees(sce, dr_nomClasse(slug)); const ici = _drCleHeureDe({ classeSlug: slug, debut: String(creneau).split('-')[0], fin: String(creneau).split('-')[1] });
      const deja = Object.values(sce.deroule_joue || {}).some(b => b && (!b.classe || b.classe === dr_nomClasse(slug)) && (b.heures || {})[ici]); return n - (deja ? 1 : 0) + 1; }   /* compté comme la case de l'EDT (par le nom de la classe) */
    const hs = ((((sce || {}).deroule_joue || {})[slug] || {}).heures) || {};
    const ici = _drCleHeureDe({ classeSlug: slug, debut: String(creneau).split('-')[0], fin: String(creneau).split('-')[1] }); return Object.keys(hs).filter(k => k !== ici).length + 1; } catch (e) { return 1; }
}
/* ─── l'heure n de la séance pour cette classe : jour, début, fin, base (ce que `HEURES_SIM[h]` simulait) ───
   L'heure en cours vient de `AT_DR_COURS` ; une heure passée, de ce qui a été posé à son lancement (`S.heuresCours`,
   gardé dans `C/etat`). `dr_heureDe` (E1, le socle) peut lire `dr_heureJouee(h)` pour les heures passées. */
const DR_JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], DR_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function dr_heurePoser(h, cours, ts){
  const d = new Date(ts || Date.now()); const deb = String(dr_creneauDuCours(cours) || '').split('-')[0] || cours.debut;
  const base = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(dr_mn(deb) / 60), dr_mn(deb) % 60).getTime();
  const x = { jour: DR_JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + DR_MOIS[d.getMonth()] + ' ' + d.getFullYear(), debut: deb, fin: cours.fin, base, lanceA: cours.debut, classe: cours.classeNom, cle: _drCleHeureDe(cours, ts), sur: dr_nbHeures(dr_creneauDuCours(cours)) };
  S.heuresCours = S.heuresCours || {}; S.heuresCours[h] = x;
  if (typeof HEURES_SIM === 'object' && HEURES_SIM) HEURES_SIM[h] = x;   /* E2 : la simulation devient la vraie heure — avant : HEURES_SIM[h] en dur (1 : lundi 14 sept. 15:07, 2 : mardi 15 sept. 10:07) */
  return x;
}
function dr_heureJouee(h){ return (S.heuresCours || {})[h] || null; }
const dr_creneauDuCours = c => { try { return _drCreneauDe(c); } catch (e) { return c ? c.debut + '-' + c.fin : ''; } };

/* ─── ce qui se garde au hub : jamais un rang ───
   Un objet qui porte un `eid` et un `di` (le rang, ou le rang + 1 pour les notes et les paroles) perd son `di` et garde
   son décalage (`dio`, 0 ou 1 : une convention, pas une désignation) ; à la lecture, `di` = rang de l'`eid` + `dio`.
   Les clés interdites au hub (. # $ [ ] /) sont échappées dans les deux sens. */
const DR_CLE_HUB = /[.#$\[\]\/]/g;
function dr_versHub(x){
  if (Array.isArray(x)) return x.map(dr_versHub);
  if (!x || typeof x !== 'object') return (typeof x === 'function' || typeof x === 'undefined') ? null : x;
  if (typeof Node !== 'undefined' && x instanceof Node) return null;
  const o = {};
  if (typeof x.di === 'number' && x.eid == null && typeof eidDe === 'function' && (x.si == null || x.si === S.si)) { const e = eidDe(x.di); if (e != null) x = Object.assign({}, x, { eid: e }); }   /* relecteur neuf n°1 : `de: {si, di}` gardait son rang */
  Object.keys(x).forEach(k => {
    const v = x[k]; if (typeof v === 'function' || v === undefined) return;
    if (k === 'si' && (x.type != null || x.eid != null) && typeof S === 'object' && v === S.si) return;   /* le rang de la séance non plus : le chemin C dit la séance (relecteur neuf n°2) */
    if (k === 'di' && typeof v === 'number' && x.eid != null && typeof indexDe === 'function') { const i = indexDe(x.eid); if (i >= 0 && v - i >= 0 && v - i <= 1) o.dio = v - i; else o.di = v; return; }   /* un rang sans identité retrouvable reste tel quel : il se voit au banc */
    o[k.replace(DR_CLE_HUB, c => '%' + c.charCodeAt(0).toString(16))] = dr_versHub(v);
  });
  return o;
}
function dr_duHub(x){
  if (Array.isArray(x)) return x.map(dr_duHub);
  if (!x || typeof x !== 'object') return x;
  const o = {};
  Object.keys(x).forEach(k => { o[k.replace(/%(2e|23|24|5b|5d|2f)/g, (m, h) => String.fromCharCode(parseInt(h, 16)))] = dr_duHub(x[k]); });
  if ((o.type != null || o.eid != null) && o.si == null && typeof S === 'object' && S) o.si = S.si;
  if ('dio' in o) { const i = (o.eid != null && typeof indexDe === 'function') ? indexDe(o.eid) : -1; if (i >= 0) o.di = i + (o.dio || 0); delete o.dio; }   /* seulement là où le rang a été retiré */
  return o;
}
/* l'état de l'heure, épuré : sans le tableau ni l'attente ni l'animation, sans les minuteurs, sans les rangs ;
   avec ce que `S` ne porte pas et sans quoi la reprise perdrait les dévoilements et les réponses (`parDiapo`, `vuMax`, audit M2) */
const DR_ETAT_HORS = ['mur', 'attente', 'anim', 'coupure', 'di', 'ordres', 'repSnap', 'blocActif', 'cand'];
function dr_etatHeure(){
  try { S.eidCourant = eidDe(S.di); } catch (e) {}
  const s = {}; Object.keys(S).forEach(k => { if (DR_ETAT_HORS.includes(k) || k.charAt(0) === '_') return; s[k] = S[k]; });
  return { S: dr_versHub(s), parDiapo: dr_versHub(parDiapo), vuMax: dr_versHub(vuMax), maj: Date.now(), heures: dr_versHub(dr_heuresDesEcrans()), heuresParDurees: DR_CL.partages.get(seance().ecrans) || 0 };   /* réveil n°4, points 3 et 7 : l'heure de chaque diapo (les frontières) et l'heure courante (`S.heure`) — la reprise remonte l'heure telle qu'elle était, E4 lit où était chaque diapo */
}
/* les frontières d'heure de la trame en mémoire : {eid: heure}, sans les « Cahier de textes » (le socle les place) */
function dr_heuresDesEcrans(){ const o = {}; try { seance().ecrans.forEach(e => { if (!e.role && e.eid != null) o[e.eid] = +e.heure || 1; }); } catch (e) {} return o; }
/* reposer des frontières gardées (la reprise, l'heure suivante) : chaque diapo à son heure, chaque « Cahier de textes » derrière la dernière diapo de la sienne */
function dr_appliquerHeures(m, parDurees){ const E = seance().ecrans; if (!m || typeof m !== 'object' || !Object.keys(m).length) return 0; let n = 0;
  E.forEach(e => { if (!e.role && e.eid != null && m[e.eid] != null && +m[e.eid] !== e.heure) { e.heure = +m[e.eid]; n++; } });
  if (parDurees) DR_CL.partages.set(E, +parDurees);
  dr_placerFins(E, 1); if (typeof dr_normaliserTrame === 'function') dr_normaliserTrame(E, (dr_ctx() || {}).snum); try { reindexer(); } catch (e) {} return n; }
const dr_journalHub = () => dr_versHub(J);

/* ─── peut-on écrire ? (contrat §5 : ni atelier, ni répétition, ni hors d'une heure lancée, ni en vue tableau) ─── */
function dr_clPeutEcrire(){
  try {
    if (/[?&]vue=tableau(&|$)/.test(location.search)) return false;
    if (typeof S !== 'object' || !S || !S.lancee || S.atelier || S.repetition) return false;
    if (typeof AT_DR_REGIME === 'undefined' || AT_DR_REGIME !== 'classe' || !AT_DR_COURS) return false;
    return typeof dr_cheminC === 'function' && !!dr_cheminC();
  } catch (e) { return false; }
}

/* ─── au fil : la copie, le journal, l'état, le paquet — même débounce de 900 ms qu'aujourd'hui (`_drCopieAuto`, `_drTraceAuto`) ─── */
/* la copie jouée (`C/ecrans`), appelée par `dr_sauve` du socle en régime classe (audit E1, C3) */
function dr_copieAuto(vite){
  clearTimeout(DR_CL.cT);
  DR_CL.cT = setTimeout(() => {
    if (!dr_clPeutEcrire()) return;
    const ecr = JSON.parse(JSON.stringify(seance().ecrans)); const em = dr_empreinte(ecr);
    if (em === DR_CL.empreinteEcrite) return; DR_CL.empreinteEcrite = em;   /* la copie ne repart que si elle a changé (relecteur neuf n°2 : 14 écritures en 17 min sans rien éditer) */
    dr_ecrire(dr_cheminC() + '/ecrans', ecr, 'Séance en classe — copie au fil de l’eau (' + AT_DR_COURS.classeNom + ')', () => { dr_temoinIntegre(em); });
  }, vite ? 0 : 900);
  dr_journalAuto(vite); dr_etatAuto(vite); dr_traceAuto(vite);
}
function dr_journalAuto(vite){
  clearTimeout(DR_CL.jT);
  DR_CL.jT = setTimeout(() => { if (!dr_clPeutEcrire()) return; dr_ecrire(dr_cheminC() + '/journal', dr_journalHub(), 'Le journal de l’heure (' + AT_DR_COURS.classeNom + ')', () => {}); }, vite ? 0 : 900);
}
function dr_etatAuto(vite){
  clearTimeout(DR_CL.eT);
  DR_CL.eT = setTimeout(() => { if (!dr_clPeutEcrire()) return; dr_ecrire(dr_cheminC() + '/etat', dr_etatHeure(), 'L’état de l’heure, pour la reprendre (' + AT_DR_COURS.classeNom + ')', () => {}); }, vite ? 0 : 900);
}
function dr_traceAuto(vite){
  clearTimeout(DR_CL.tT);
  DR_CL.tT = setTimeout(() => {
    if (!dr_clPeutEcrire()) return; const ch = dr_cheminH(); if (!ch) return;
    /* `H/absents` est écrit par la case de l'EDT (`edtAbsence`) : on le relit et on le garde, jamais on ne l'écrase (audit C5) */
    dr_lire(ch + '/absents', abs => { const p = dr_paquetHeure(false); if (!p) return; if (abs) p.absents = abs; dr_ecrire(ch, p, 'Heure de cours — ' + p.creneau + ' (' + p.classe + ')', () => {}); });
  }, vite ? 0 : 900);
}
/* le témoin « déroulé intègre » (R9) : l'empreinte de ce qui a été écrit, comparée à ce que le hub rend */
function dr_empreinte(x){ const s = JSON.stringify(x); let h = 0; for (let j = 0; j < s.length; j++) h = ((h << 5) - h + s.charCodeAt(j)) | 0; return s.length + '-' + (h >>> 0).toString(36); }
function dr_temoinIntegre(em){
  dr_lire(dr_cheminC() + '/ecrans', v => { DR_CL.empreinte = em; DR_CL.relue = v ? dr_empreinte(v) : ''; const t = document.getElementById('dr-integre'); if (!t) return;
    const ok = DR_CL.relue === em; t.textContent = ok ? '● déroulé intègre' : '● déroulé à vérifier'; t.className = ok ? 'dr-integre-ok' : 'dr-integre-ko';
    t.title = ok ? 'Ce que la classe a vu est au hub, bit pour bit : la copie écrite et la copie relue ont la même empreinte (' + em + ').' : 'La copie relue au hub n’est pas celle qui vient d’être écrite : la liaison est lente ou coupée. Rien n’est perdu ici ; le site réessaie au prochain geste.'; });
}

/* ─── le paquet de l'heure : LES MÊMES CHAMPS qu'aujourd'hui (`_drPaquetHeure`), composés depuis le journal ───
   `activites[]` : une ligne par écran joué (le sens que l'EDT lit : « N activités », `reel === 0` = reportée — audit C4),
   `eid` fait foi, `n` reste un rang de LECTURE (LOT C2 ③.3) ; `reel` = le temps passé d'après les entrées `diapo` du
   journal, moins les coupures mises à part (C1 1.3 bis) ; `passages` = les entrées sur cet écran.
   `decisions` par rang TOMBE (audit C3 : personne ne le relit) ; `decisionsParEcran` (par `eid`) et `decisionsParActivite`
   (par `actId`) le remplacent. Plus ce que la maquette sait : appel, coupures, échéance, travail, réserve, versements, paroles. */
function dr_paquetHeure(clos){
  if (typeof AT_DR_COURS === 'undefined' || !AT_DR_COURS || !S.lancee) return null;
  const h = S.heure, E = seance().ecrans, t1 = clos ? (S.finReel || Date.now()) : Date.now();
  const ev = J.filter(x => x.type === 'diapo' && x.h === h);
  const fin = (x, k) => (k + 1 < ev.length ? ev[k + 1].t : t1);
  const parEid = {};
  let prec = null;
  ev.forEach((x, k) => { const eid = x.eid != null ? x.eid : eidDe(x.di); if (eid == null) return; const l = parEid[eid] || (parEid[eid] = { ms: 0, passages: 0 }); l.ms += Math.max(0, fin(x, k) - x.t); if (eid !== prec) l.passages++; prec = eid; });   /* deux « diapo » de suite sur la même diapo (le début et le lancement) = un passage — relecteur neuf n°1 */
  (S.coupures || []).forEach(c => { if (!c.compte && c.eid != null && parEid[c.eid]) parEid[c.eid].ms = Math.max(0, parEid[c.eid].ms - ((c.fin || t1) - c.debut)); });
  const activites = Object.keys(parEid).map(eid => { const i = indexDe(eid), e = E[i] || {}; return { n: i, eid, act: e.act || ('écran ' + (i + 1)), prevu: +(e.dur || 0), reel: Math.max(1, Math.round(parEid[eid].ms / 60000)), passages: parEid[eid].passages,   /* un écran vu compte au moins une minute : `reel === 0` veut dire « pas joué » pour la case de l'EDT (« reportée ») */ comp: Array.isArray(e.comp) ? e.comp : [] }; })
    .sort((a, b) => a.n - b.n);
  const acts = (typeof actDe === 'function') ? [...new Set(E.map(actDe).filter(Boolean))] : [];
  const parActivite = acts.map(a => { const ds = (a.diapos || []).map(i => eidDe(i)).filter(x => x != null); const ms = ds.reduce((t, d) => t + ((parEid[d] || {}).ms || 0), 0); const ps = ds.reduce((t, d) => t + ((parEid[d] || {}).passages || 0), 0);
    return { actId: a.id, num: a.num, titre: a.titre || '', prevu: (a.diapos || []).reduce((t, i) => t + (+((E[i] || {}).dur) || 0), 0), reel: Math.round(ms / 60000), passages: ps }; }).filter(a => a.passages);
  const decisionsParEcran = {}, decisionsParActivite = {};
  Object.keys(S.decisions || {}).forEach(k => { const d = S.decisions[k]; const a = acts.find(x => x.id === k);
    if (a) { decisionsParActivite[k] = d; (a.diapos || []).forEach(i => { const eid = eidDe(i); if (eid != null && !(typeof finie === 'function' && finie(E[i], i))) decisionsParEcran[eid] = d; }); }
    else if (indexDe(k) >= 0) decisionsParEcran[k] = d; });
  const debutReel = S.debutReel || ((J.find(x => x.type === 'lancement' && x.h === h) || {}).t) || Date.now();
  const p = {
    classe: AT_DR_COURS.classeNom, creneau: dr_creneauDuCours(AT_DR_COURS), lanceA: AT_DR_COURS.debut, fin: AT_DR_COURS.fin,
    debutReel, finReel: clos ? t1 : null, tempsUtilePrevu: dr_tempsUtile(dr_creneauDuCours(AT_DR_COURS), AT_DR_COURS.debut),
    minutesJouees: Math.round((t1 - debutReel) / 60000), heure: h, sur: (dr_heureJouee(h) || {}).sur || null,
    activites, parActivite, decisionsParEcran, decisionsParActivite,
    appel: S.appel || {}, coupures: (S.coupures || []).filter(c => (c.debut || 0) >= debutReel), echeance: S.echeance || ((S.finFaites || {})[1] ? 'aucune' : null),   /* « Sans échéance » se dit (relecteur neuf n°2) */
    travail: Object.assign({ terminer: [], preparer: [], apprendre: null, prevu: true, libre: '' }, S.travail || {}), travailTexte: (typeof texteTravailED === 'function' ? texteTravailED() : '') || '',   /* relance M7 : la forme de la maquette ; `prevu:false` = « pas de travail », jamais un silence */
    reserve: S.reserve || [], versements: S.versements || {}, parts: (S.parts || []).filter(x => x.heure == null || x.heure === h),   /* les paroles de CETTE heure (relecteur neuf n°2) */
    motAbsents: S.motAbsents || '', clos: !!clos, maj: Date.now()
  };
  if (clos && S.closPar) p.closPar = S.closPar;
  return dr_versHub(p);
}

/* ─── le pointeur du cours (`sesCoursEcrire`/`sesCoursFermer`, même forme qu'aujourd'hui) et la clôture certaine ─── */
function dr_coursActif(){ const ec = AT.edChap || {}; return { niveau: ec.level, chapitre: ec.chnum, seance: ATVUES.snum, classeSlug: AT_DR_COURS.classeSlug, classeNom: AT_DR_COURS.classeNom, debut: AT_DR_COURS.debut, fin: AT_DR_COURS.fin }; }
function dr_coursEcrire(){
  if (!AT_DR_COURS || !ATVUES.snum) return;
  try { SES.ctx = dr_coursActif(); SES.actif = true; } catch (e) {}
  dr_ecrire('/site/cours_actif', Object.assign(dr_coursActif(), { ts: Date.now() }), 'Le cours annoncé aux autres appareils', () => {});
  /* la scène du cours précédent ne doit jamais ressusciter : la scène neuve, au format d'E3 (`et`), tout de suite (audit F10) */
  try { if (typeof dr_sceneAuto === 'function') dr_sceneAuto(true); } catch (e) {}
}
function dr_coursFermer(){ dr_ecrire('/site/cours_actif', null, 'Le cours est clos', () => {}); try { SES.actif = false; } catch (e) {} }
/* efface le pointeur SEULEMENT s'il désigne encore l'heure close (`_drCoursActifEffacerSi`, par `dr_lire`) */
function dr_coursActifEffacerSi(sig){ if (!sig) return; dr_lire('/site/cours_actif', c => { if (!c || _drSignatureCours(c) !== sig) return; dr_ecrire('/site/cours_actif', null, 'Le pointeur de l’heure close', () => {}); }); }
/* la clôture CERTAINE de l'heure précédente (`_drCloreHeureRestee`, par `dr_lire` : le mode test lit sa copie) */
function dr_cloreHeureRestee(slugNeuf, nomNeuf, c){
  const suite = c => {
    if (!c || !c.ts || (Date.now() - c.ts) > 4 * 3600 * 1000) return;
    if (c.classeSlug === slugNeuf && String(c.seance) === String(ATVUES.snum) && String(c.chapitre) === String((AT.edChap || {}).chnum)) return;   /* c'est la même heure */
    const base = _drBaseHeureDe(c, c.ts); if (!base) return; const ch = base.replace(FIREBASE_BASE, '');
    dr_ecrire(ch + '/clos', true, 'Clôture certaine de l’heure précédente', () => {});
    dr_ecrire(ch + '/finReel', Date.now(), 'Fin réelle de l’heure précédente', () => {});
    dr_ecrire(ch + '/closPar', 'lancement de ' + (nomNeuf || slugNeuf), 'Motif de clôture', () => {});
    dr_coursActifEffacerSi(_drSignatureCours(c));
    try { atInfo('L’heure de ' + escapeHtml(String(c.classeNom || c.classeSlug || '')) + ' (' + escapeHtml(dr_creneauDuCours(c)) + ') n’était pas close : elle vient de l’être. Rien de cette heure n’entre dans la suivante.'); } catch (e) {}
  };
  if (c !== undefined) suite(c); else dr_lire('/site/cours_actif', suite);
}

/* ─── lancer : `atDrJouerClic`, ses gestes dans l'ordre, puis le lancement de la maquette ─── */
function dr_lancer(classeSlug, creneau, debut, heure, sur){
  if (!classeSlug && !creneau) { const pr = dr_proposer(); classeSlug = pr.classeSlug; creneau = pr.creneau; debut = pr.debut; heure = heure || pr.heure; sur = sur || pr.sur; }
  DR_CL.sur = +sur || ((S.lancee && S.close && S.heure) ? DR_CL.sur : 0) || 1;
  classeSlug = classeSlug || dr_classeProposee(); creneau = creneau || dr_creneauPropose(); debut = debut || dr_debutPropose(creneau); heure = +heure || ((S.lancee && S.close && S.heure) ? S.heure + 1 : dr_heureProposee(classeSlug, creneau));   /* l'heure close dans cette page : la suivante */
  const nom = dr_nomClasse(classeSlug), fin = String(creneau).split('-')[1];
  if (!classeSlug) { try { atInfo('Aucune classe pour ce niveau : ajoute-la dans le panneau des classes, puis lance.'); } catch (e) {} return; }
  /* R8 : on avertit, on ne bloque jamais (le professeur a tous les droits) */
  if (dr_tempsUtile(creneau, debut) <= 0) { try { atInfo('Attention : ce début ne laisse aucun temps utile avant ' + fin + ' — la séance se lance quand même.'); } catch (e) {} }
  dr_lire('/site/cours_actif', c => {
    const ici = { niveau: (AT.edChap || {}).level, chapitre: (AT.edChap || {}).chnum, seance: ATVUES.snum, classeSlug, debut, fin };
    const meme = c && c.ts && (Date.now() - c.ts) < 4 * 3600 * 1000 && c.classeSlug === classeSlug && String(c.seance) === String(ici.seance) && String(c.chapitre) === String(ici.chapitre) && c.fin === fin
      && new Date(c.ts).toDateString() === new Date().toDateString();
    if (meme) { /* cette heure tourne déjà : on la REPREND, on ne la recopie pas (audit C6) */
      AT_DR_COURS = { debut: c.debut, fin: c.fin, classeSlug, classeNom: nom }; AT_DR_REGIME = 'classe';
      dr_reprendre(ok => { if (!ok) dr_lancerNeuf(classeSlug, nom, creneau, c.debut, heure, c); }); return; }
    dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c);
  });
}
function dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c, suite){
  /* une heure close ne se reprend plus, par aucun chemin (C1 12 ; `_drHeureCloseAu`) : la même clé (jour + créneau + classe) n'est jamais réécrite */
  if (!DR_CL.cleVerifiee) { const fin0 = String(creneau).split('-')[1]; const ch0 = (typeof dr_cheminB === 'function' ? dr_cheminB() : '') + '/deroule_joue/' + classeSlug + '/heures/' + _drCleHeureDe({ classeSlug, debut, fin: fin0 });
    dr_lire(ch0, t0 => { const clos = !!(t0 && t0.clos); /* le paquet entier, pas `…/clos` : en mode test le magasin est rangé par chemin, une lecture de `…/clos` mise en cache cacherait la clôture écrite ensuite sur `H` */ if (clos === true) { try { atInfo('L’heure de ' + escapeHtml(nom) + ' sur le créneau ' + escapeHtml(creneau) + ' est déjà close aujourd’hui : elle ne se rouvre pas. Lance l’heure suivante depuis sa case de l’emploi du temps (son créneau à elle).'); } catch (e) {} return; }
      DR_CL.cleVerifiee = true; try { dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c, suite); } finally { DR_CL.cleVerifiee = false; } }); return; }
  const fin = String(creneau).split('-')[1];
  if (!suite) try { dr_cloreHeureRestee(classeSlug, nom, c); } catch (e) {}
  /* une heure tourne encore ici (Paul enchaîne deux classes en deux minutes) : elle se clôt d'abord, sa trace sous SA clé */
  if (S.lancee && !S.close && AT_DR_REGIME === 'classe' && AT_DR_COURS && DR_CL.ouverte) { const o = DR_CL.ouverte; const p = { creneau: o.creneau };
    /* écritures CIBLÉES sous la clé de l'heure qui tournait (comme la clôture certaine) : son paquet complet est déjà au hub, poussé au fil */
    dr_ecrire(o.H + '/clos', true, 'Heure close à l’ouverture de la suivante', () => {}); dr_ecrire(o.H + '/finReel', Date.now(), 'Fin réelle', () => {}); dr_ecrire(o.H + '/closPar', 'lancement suivant', 'Motif de clôture', () => {});
    dr_ecrire(o.C + '/journal', dr_journalHub(), 'Le journal de l’heure close', () => {}); [DR_CL.jT, DR_CL.eT, DR_CL.tT, DR_CL.cT].forEach(clearTimeout); S.close = true;
    try { atInfo('L’heure précédente (' + escapeHtml(AT_DR_COURS.classeNom) + ' · ' + escapeHtml(p ? p.creneau : '') + ') n’était pas close : elle vient de l’être, sa trace est enregistrée.'); } catch (e) {} }
  /* l'heure n > 1 : la séance a déjà joué pour cette classe ; on relit son état (C/etat, C/journal), puis l'écran d'ouverture de la
     maquette (« Où en est la classe », 6.5-6.7) — il dit l'heure d'avant, ce qui glisse, le faisceau ; « Lancer l'heure n » passe par
     `dr_lancerSuite`. La copie de la classe n'est PAS recopiée depuis la trame (C1 8.1 : ce qui a été vu est immuable ; audit C6). */
  if (heure > 1 && !suite) {
    dr_lireJoue(j => {
      if (j && j.S && j.S.lancee && dr_adopterIdentites(j.ecrans) > 0) { dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c, suite); return; }   /* les identités adoptées : on relit, pour que les rangs se refassent dessus */
      if (j && j.S && j.S.lancee) { if (Array.isArray(j.ecrans)) { const E = seance().ecrans; const f = dr_fusionCopie(E.slice(), j.ecrans, j.J); E.splice(0, E.length, ...f); }   /* la copie de la classe fusionnée avec la trame du jour */
        dr_restaurer(j); if (!(j.heures && Object.keys(j.heures).length)) dr_partagerHeures(dr_utileCreneau(creneau)); else dr_appliquerHeures(j.heures, j.heuresParDurees); dr_heureContinue(heure);   /* les frontières de la veille, puis la séance continue */ S.heure = heure - 1; S.close = true; S.lancee = true; DR_CL.suite = { classeSlug, nom, creneau, debut, heure, garder: true }; dr_heurePoser(heure, { debut, fin, classeSlug, classeNom: nom });
        try { $('ecran-edt').classList.remove('on'); } catch (e) {} try { voir('pilotage'); } catch (e) {} ouvrirOuverture(); return; }
      dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c, true);
    }, (typeof dr_cheminB === 'function' ? dr_cheminB() : '') + '/deroule_joue/' + classeSlug);
    return; }
  const garder = suite && DR_CL.suite && DR_CL.suite.garder; DR_CL.suite = null;
  const copie = garder ? null : ((typeof atDrJouer === 'function') ? atDrJouer(classeSlug, nom) : null);
  AT_DR_COURS = { debut, fin, classeSlug, classeNom: nom }; AT_DR_REGIME = 'classe';
  try { chChargerTaxo(() => {}); } catch (e) {}   /* [8.67.1] le T-5 nomme les notions, jamais leurs codes */
  try { if (copie && typeof dr_jouerCopie === 'function') dr_jouerCopie(copie.ecrans); } catch (e) {}   /* le socle joue la copie de la classe (E1) */
  dr_heurePoser(heure, AT_DR_COURS);
  DR_CL.ouverte = { C: dr_cheminC(), H: dr_cheminH(), creneau };   /* l'adresse de CETTE heure, gardée pour sa clôture (même si la page change de séance ou de jour) */
  S.closPar = null; S.finReel = null; S.debutReel = Date.now();
  try { $('ecran-edt').classList.remove('on'); } catch (e) {}   /* la porte se referme (le clic de l'EDT simulé le faisait) */
  dr_coursEcrire();   /* le pointeur d'abord : la bannière de reprise et le tableau distant en dépendent, même si le rendu bute */
  /* la barre du site se redessine pendant les lectures du hub (ouverture du chapitre) : on attend ses onglets, borné à 4 s (relecteur neuf n°1 : `voir` levait) */
  const go = n => { if (!['ong-pilotage', 'ong-relecture', 'ong-atelier'].every(id => document.getElementById(id)) && n < 40) { setTimeout(() => go(n + 1), 100); return; }
    try { lancerHeure(heure); } catch (e) { try { atInfo('Le Pilotage ne s’est pas affiché entièrement (' + e.message + ') : l’heure est lancée et s’enregistre ; rouvre l’onglet Pilotage.'); } catch (x) {} }
    dr_traceReprendre(() => { dr_absentsDeLaCase(); dr_copieAuto(true); }); };
  const placer = () => { dr_partagerHeures(dr_utileCreneau(creneau)); dr_heureContinue(heure); dr_edtAssurer(); go(0); };
  /* réveil n°4, point 2 : l'heure n > 1 commence là où la classe s'est arrêtée — les paquets des heures d'avant (toutes les clés de
     cette classe, comme l'EDT les compte) disent ce qui a été joué ; ces diapos sont marquées jouées, la suivante ouvre l'heure */
  if (heure > 1) dr_lire((typeof dr_cheminB === 'function' ? dr_cheminB() : '') + '/deroule_joue', dj => { try { dr_marquerJoues(dj, classeSlug, nom, DR_CL.ouverte && DR_CL.ouverte.H); } catch (e) {} placer(); });
  else placer();
}
/* ce que les heures d'avant ont joué (réveil n°4, point 2) : un paquet écrit par ce module porte l'`eid` de chaque diapo jouée ; un paquet
   plus ancien (sans `eid`, comme celui du 07/09 au faux hub) compte ses lignes : ce sont les premières diapos de la séance. Lu, jamais
   réécrit (contrat §12.13 : l'ancienne clé de la classe est de l'histoire ; l'EDT la compte déjà pour « heure n/N »). Rend le nombre marqué. */
function dr_marquerJoues(dj, slug, nom, cheminCourant){
  const E = seance().ecrans; const ix = {}; E.forEach((e, i) => { if (e.eid != null) ix[e.eid] = i; }); const marque = new Set(); let anciens = 0;
  Object.keys(dj || {}).forEach(sl => { const b = dj[sl]; if (!b || typeof b !== 'object' || !(sl === slug || b.classe === nom)) return;
    Object.keys(b.heures || {}).forEach(k => { if (cheminCourant && String(cheminCourant).endsWith('/deroule_joue/' + sl + '/heures/' + k)) return; const H = b.heures[k] || {}; let acts = H.activites; if (typeof acts === 'string') { try { acts = JSON.parse(acts); } catch (e) { acts = []; } }
      (Array.isArray(acts) ? acts : Object.values(acts || {})).forEach(a => { if (a && a.eid != null && ix[a.eid] != null) marque.add(ix[a.eid]); else if (a) anciens++; }); }); });
  if (anciens) E.forEach((e, i) => { if (anciens > 0 && !e.role && !marque.has(i)) { marque.add(i); anciens--; } });
  let n = 0; marque.forEach(i => { const k = K(i); if (!vuMax[k]) { vuMax[k] = Math.max(1, elements(E[i]).length); n++; } }); return n; }
/* « Lancer l'heure n » de l'écran d'ouverture : la classe, le créneau et le début posés par `dr_lancer` */
function dr_lancerSuite(h){ const x = DR_CL.suite || {}; const cr = x.creneau || dr_creneauPropose(); const sl = x.classeSlug || dr_classeProposee();
  dr_lancerNeuf(sl, x.nom || dr_nomClasse(sl), cr, x.debut || dr_debutPropose(cr), h || x.heure || (S.heure + 1), undefined, true); }
/* la relance dans le même créneau reprend la trace (`_drTraceReprendre`) : le début réel revient ; une trace d'une autre
   classe ou d'un autre créneau n'est pas reprise (elle se dit, l'heure part à neuf) */
function dr_traceReprendre(cb){
  const ch = dr_cheminH(); if (!ch) { if (cb) cb(); return; }
  dr_lire(ch, t => {
    if (t && !t.clos) {
      if ((t.classe && t.classe !== AT_DR_COURS.classeNom) || (t.creneau && t.creneau !== dr_creneauDuCours(AT_DR_COURS))) { try { atInfo('Une trace d’heure existait sous cette clé mais portait « ' + escapeHtml(String(t.classe || '?')) + ' · ' + escapeHtml(String(t.creneau || '?')) + ' » : elle n’est pas reprise, cette heure part à neuf.'); } catch (e) {} }
      else if (t.debutReel) { S.debutReel = t.debutReel; S.ecoule = Math.max(0, Math.round((Date.now() - t.debutReel) / 1000)); try { atInfo('Heure de ' + t.creneau + ' reprise — ' + (t.minutesJouees || 0) + ' min déjà comptées.'); } catch (e) {} }
    }
    if (cb) cb();
  });
}

/* ─── reprendre en pleine heure : `C/etat` + `C/journal` + `H` (la règle de `_drTraceReprendre`) ─── */
function dr_reprendre(cb){
  const C = dr_cheminC(), ch = dr_cheminH(); if (!C || !ch) { if (cb) cb(false); return; }
  dr_lire(C + '/ecrans', copie => dr_lire(C + '/etat', etat => dr_lire(C + '/journal', jr => dr_lire(ch, t => {
    if (!etat || !etat.S) { if (cb) cb(false); return; }
    dr_adopterIdentites(copie); if (!dr_appliquerHeures(dr_duHub(etat.heures || {}), etat.heuresParDurees) && !(etat.heures && Object.keys(etat.heures).length)) dr_partagerHeures(dr_utileCreneau(dr_creneauDuCours(AT_DR_COURS)));   /* réveil n°4, 3 : les frontières de l'heure telles qu'elles étaient (avant : recalculées, la diapo 7 repassait à l'heure 1) */
    if (t && (t.clos || (t.classe && t.classe !== AT_DR_COURS.classeNom) || (t.creneau && t.creneau !== dr_creneauDuCours(AT_DR_COURS)))) { if (cb) cb(false); return; }
    dr_restaurer({ S: dr_duHub(etat.S), parDiapo: dr_duHub(etat.parDiapo || {}), vuMax: dr_duHub(etat.vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub) });
    DR_CL.sur = ((dr_heureJouee(S.heure) || {}).sur) || DR_CL.sur || 1;   /* N revient avec l'heure */
    const hc = dr_heureJouee(S.heure); if (hc && typeof HEURES_SIM === 'object') HEURES_SIM[S.heure] = hc; else dr_heurePoser(S.heure, AT_DR_COURS, t && t.debutReel);
    S.debutReel = (t && t.debutReel) || S.debutReel || Date.now();
    S.ecoule = Math.max(0, Math.round((Date.now() - S.debutReel) / 1000)); S.lancee = true; S.close = false; S.mur = null;
    /* le temps où la page était fermée est une COUPURE (C1 1.3 bis) : mis à part tant que Paul n'a pas dit que le cours a continué */
    const trou = Date.now() - (etat.maj || Date.now());
    if (trou >= 60000) { S.coupures = S.coupures || []; const e = ecran(); S.coupures.push({ debut: etat.maj, fin: Date.now(), di: S.di, eid: e && e.eid, duree: Math.round(trou / 60000), compte: false, rechargement: true }); journal('coupure', { duree: Math.round(trou / 60000), rechargement: true }); }
    journal('reprise', { depuis: etat.maj || null });
    DR_CL.reprise = true;
    try { $('ecran-edt').classList.remove('on'); } catch (e) {}
    try { voir('pilotage'); } catch (e) {}
    try { $('hou').textContent = dr_entete(S.heure); } catch (e) {}
    try { dr_coursEcrire(); } catch (e) {}
    tout(); dr_copieAuto(true);
    try { atInfo('Heure reprise : la diapo, le chrono, les décisions, les paroles et les notes sont revenus.'); } catch (e) {}
    DR_CL.ouverte = { C, H: ch, creneau: dr_creneauDuCours(AT_DR_COURS) }; dr_absentsDeLaCase();
    if (cb) cb(true);
  }))));
}
/* remettre dans la page l'état d'une heure jouée, décodé (`dr_lireJoue`) : S, les dévoilements, le journal ; les rangs refaits */
function dr_restaurer(j){
  Object.keys(j.S || {}).forEach(k => { S[k] = j.S[k]; });
  [[parDiapo, j.parDiapo], [vuMax, j.vuMax]].forEach(([o, v]) => { Object.keys(o).forEach(k => delete o[k]); Object.assign(o, v || {}); });
  J.length = 0; (j.J || []).forEach(o => J.push(o));
  S.ordres = {}; Object.keys(S.ordresEid || {}).forEach(h => { S.ordres[h] = (S.ordresEid[h] || []).map(indexDe).filter(i => i >= 0); });   /* l'ordre de chaque heure, refait depuis les identités */
  try { reindexer(); } catch (e) {}
}
/* l'entête de l'heure : la classe, le créneau, l'heure n/N, la séance */
function dr_entete(h){ const x = dr_heureJouee(h) || {}; try { const el = document.getElementById('hou'); if (el) el.title = dr_enteteLong(h); } catch (e) {}
  return (x.classe || '') + ' · ' + (x.debut || '') + '-' + (x.fin || '') + ' · heure ' + h + '/' + (x.sur || '?'); }   /* relecteur neuf n°1 : l'entête longue était coupée à 119 px */
function dr_enteteLong(h){ const x = dr_heureJouee(h) || {}; return (x.jour || '') + ' ' + (x.debut || '') + '-' + (x.fin || '') + ' · ' + (x.classe || '') + ' · heure ' + h + ' sur ' + (x.sur || '?') + ' · ' + (seance().titre || seance().title || ''); }

/* ─── clore : l'étape 7 fait les écritures d'`atDrCloreFin` (H clos, finReel, cours_actif nul), plus le journal et l'état ─── */
function dr_cloreFin(){
  if (typeof AT_DR_COURS === 'undefined' || !AT_DR_COURS || AT_DR_REGIME !== 'classe') return;
  const C = dr_cheminC(), ch = dr_cheminH(); S.finReel = Date.now(); S.closPar = null;
  const p = dr_paquetHeure(true), jr = dr_journalHub(), et = dr_etatHeure();
  if (ch && p) dr_lire(ch + '/absents', abs => { if (abs) p.absents = abs; dr_ecrire(ch, p, 'Heure close — ' + p.creneau + ' (' + p.classe + ')', () => {}); });
  if (C) { dr_ecrire(C + '/journal', jr, 'Le journal de l’heure, à la clôture', () => {}); dr_ecrire(C + '/etat', et, 'L’état de l’heure, à la clôture', () => {}); }
  [DR_CL.jT, DR_CL.eT, DR_CL.tT, DR_CL.cT].forEach(clearTimeout);
  try { window.AT_DR_DERNIER = { level: (AT.edChap || {}).level, chnum: (AT.edChap || {}).chnum, snum: ATVUES.snum, classe: AT_DR_COURS.classeSlug, ts: Date.now() }; } catch (e) {}
  DR_CL.cleClose = ch; DR_CL.creneauClos = dr_creneauDuCours(AT_DR_COURS);   /* la clé de l'heure close dans cette page : « ▶ Lancer » ne la repropose pas */
  dr_coursFermer();
  AT_DR_REGIME = 'prep';
}

/* ─── pour les autres territoires : relire une heure jouée telle que je l'ai écrite (E4, la Relecture d'une heure close ;
   E1, `dr_heureDe` pour une heure passée). `chemin` = `C` de la classe (défaut : `dr_cheminC()`). Rend `{S, parDiapo, vuMax, J}`
   décodés (les rangs refaits depuis les `eid`), ou null. Lecture seule. ─── */
function dr_lireJoue(cb, chemin){
  const C = chemin || (typeof dr_cheminC === 'function' ? dr_cheminC() : null); if (!C) { cb(null); return; }
  dr_lire(C + '/ecrans', ecr => dr_lire(C + '/etat', et => dr_lire(C + '/journal', jr => {
    if (!et && !jr) { cb(null); return; }
    cb({ ecrans: Array.isArray(ecr) ? ecr : null, S: dr_duHub((et || {}).S || {}), parDiapo: dr_duHub((et || {}).parDiapo || {}), vuMax: dr_duHub((et || {}).vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub), maj: (et || {}).maj || null, heures: dr_duHub((et || {}).heures || {}), heuresParDurees: (et || {}).heuresParDurees || 0 });
  })));
}

/* ─── R7 « Où on en est » (l'ancien `atVecuAfficher`) : sur chaque ligne d'activité de la colonne de droite, « dévoilés / total »
   et le réel contre le prévu, depuis le journal. La liste elle-même est celle de la maquette (`ouOnEnEst`, E1) : je la complète
   après chaque rendu, sans la réécrire (le crochet est posé une fois, ici). ─── */
function dr_avanceActivites(){
  try {
    if (!S.lancee || S.atelier) return; const d = document.getElementById('durees'); if (!d) return; const E = seance().ecrans;
    d.querySelectorAll('.dur-l .dur-in[data-a]').forEach(inp => {
      const a = activitesDeLHeure().find(x => x.id === inp.dataset.a); if (!a) return; const l = inp.closest('.dur-l');
      const ds = (a.diapos || []).filter(i => E[i]); const tot = ds.reduce((t, i) => t + elements(E[i]).length, 0), vus = ds.reduce((t, i) => t + Math.min(elements(E[i]).length, ((parDiapo[K(i)] || {}).nDev || 0)), 0);
      const reel = Math.round(tempsActiviteSec(a) / 60), prevu = dureeDe(a);
      let x = l.querySelector('.dr-avance'); if (!x) { x = document.createElement('span'); x.className = 'dr-avance'; l.appendChild(x); }
      x.textContent = vus + '/' + tot + ' · ' + reel + '/' + prevu + ' min';
      x.title = 'Activité ' + a.num + ' : ' + vus + ' élément' + (vus > 1 ? 's' : '') + ' dévoilé' + (vus > 1 ? 's' : '') + ' sur ' + tot + ', ' + reel + ' min passées pour ' + prevu + ' prévues (le temps mis à part pendant une coupure ne compte pas).';
      x.classList.toggle('dr-plus', reel > prevu);
    });
  } catch (e) {}
}
if (typeof ouOnEnEst === 'function' && !ouOnEnEst.__dr) { const dr_ouOnEnEst0 = ouOnEnEst; window.ouOnEnEst = function () { const r = dr_ouOnEnEst0.apply(this, arguments); dr_avanceActivites(); return r; }; window.ouOnEnEst.__dr = true; }

/* ─── R3 le minuteur d'activité (l'ancien `regleChrono`/`chrono`, #cmin #csec #bchr #bmon) : mm:ss, « Départ », le compte à
   rebours au pilote, et « au tableau » (le bandeau de l'état du tableau, `et.bandeau`, que le tableau d'E3 affiche) — pour
   « Étape 1 : j'observe en silence (5 min) ». Il ne touche pas le chrono de l'heure. Journal : `minuteur` (départ, arrêt, fin). ─── */
DR_CL.minut = null;   /* { fin, duree, tableau, eid } */
const dr_mmss = ms => { const s = Math.max(0, Math.round(ms / 1000)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
function dr_minuteurPoser(){
  if (document.getElementById('dr-minut') || !document.getElementById('chr')) return;
  const b = document.createElement('span'); b.id = 'dr-minut'; b.className = 'dr-minut';
  b.innerHTML = '<button class="btn" id="dr-minut-b" title="Le minuteur d’activité : un compte à rebours pour une consigne minutée (« j’observe en silence, 5 min »). Il ne change pas le chrono de l’heure ; tu peux le montrer au tableau.">⏱</button>'
    + '<span id="dr-minut-p" class="dr-minut-p" style="display:none"><input id="dr-minut-in" value="05:00" size="5" title="La durée, en minutes:secondes"> <button class="btn or" id="dr-minut-go" title="Lance le compte à rebours">Départ</button> <label title="Le compte à rebours paraît aussi au tableau, en bandeau"><input type="checkbox" id="dr-minut-tab"> au tableau</label> <button class="btn" id="dr-minut-stop" title="Arrête le minuteur et le retire du tableau">Arrêter</button></span>'
    + '<b id="dr-minut-aff" class="dr-minut-aff"></b>';
  document.getElementById('chr').insertAdjacentElement('afterend', b);
  const $m = id => document.getElementById(id);
  $m('dr-minut-b').onclick = () => { const p = $m('dr-minut-p'); p.style.display = p.style.display === 'none' ? '' : 'none'; if (p.style.display === '') $m('dr-minut-in').select(); };
  $m('dr-minut-in').onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Enter') $m('dr-minut-go').click(); if (ev.key === 'Escape') $m('dr-minut-p').style.display = 'none'; };
  $m('dr-minut-go').onclick = () => { const v = String($m('dr-minut-in').value).split(':'); const ms = ((+v[0] || 0) * 60 + (+v[1] || 0)) * 1000; if (ms <= 0) return;
    DR_CL.minut = { fin: Date.now() + ms, duree: ms, tableau: $m('dr-minut-tab').checked, eid: (ecran() || {}).eid }; journal('minuteur', { action: 'depart', duree: Math.round(ms / 1000), tableau: DR_CL.minut.tableau }); $m('dr-minut-p').style.display = 'none'; dr_minuteurTic(); };
  $m('dr-minut-tab').onchange = () => { if (DR_CL.minut) { DR_CL.minut.tableau = $m('dr-minut-tab').checked; dr_minuteurTic(); } };
  $m('dr-minut-stop').onclick = () => { if (DR_CL.minut) journal('minuteur', { action: 'arret', reste: Math.round((DR_CL.minut.fin - Date.now()) / 1000) }); dr_minuteurFin(); $m('dr-minut-p').style.display = 'none'; };
}
function dr_minuteurFin(){ DR_CL.minut = null; const a = document.getElementById('dr-minut-aff'); if (a) { a.textContent = ''; a.className = 'dr-minut-aff'; } if (S.bandeau && /^⏱/.test(S.bandeau)) { S.bandeau = ''; dr_minuteurPousser(); } }
function dr_minuteurPousser(){ try { if (!S.gel && S.lancee && typeof pousser === 'function' && typeof etatComplet === 'function') pousser(etatComplet()); if (typeof dr_sceneAuto === 'function') dr_sceneAuto(); } catch (e) {} }
function dr_minuteurTic(){
  const m = DR_CL.minut; if (!m) return; const reste = m.fin - Date.now(); const a = document.getElementById('dr-minut-aff');
  if (a) { a.textContent = reste > 0 ? dr_mmss(reste) : '00:00'; a.className = 'dr-minut-aff' + (reste <= 60000 ? ' dr-minut-fin' : ''); a.title = 'Le minuteur : ' + dr_mmss(reste) + ' restantes sur ' + dr_mmss(m.duree) + (m.tableau ? ', montré au tableau' : ''); }
  const txt = m.tableau ? '⏱ ' + dr_mmss(reste) : ''; if ((S.bandeau || '') !== txt && (txt || /^⏱/.test(S.bandeau || ''))) { S.bandeau = txt; dr_minuteurPousser(); }
  if (reste <= 0) { journal('minuteur', { action: 'fin' }); setTimeout(dr_minuteurFin, 4000); DR_CL.minut = Object.assign({}, m, { fin: Infinity, fini: true }); if (a) { a.textContent = '00:00 — c’est fini'; } }
}
function dr_temoinPoser(){ const h = document.getElementById('hou'); if (!h || document.getElementById('dr-integre')) return; const t = document.createElement('span'); t.id = 'dr-integre'; t.className = 'dr-integre-ok'; t.style.marginLeft = '8px'; t.title = 'Le témoin d’intégrité : il dit si ce que la classe a vu est bien au hub, tel quel.'; h.insertAdjacentElement('afterend', t); if (DR_CL.empreinte) dr_temoinIntegre(DR_CL.empreinte); }
setInterval(() => { try { if (S.lancee && AT_DR_REGIME === 'classe') dr_temoinPoser(); if (S.lancee) dr_minuteurPoser(); if (DR_CL.minut && !DR_CL.minut.fini) dr_minuteurTic(); } catch (e) {} }, 1000);

/* ─── R19 ⌫ (retour arrière) = ◀ au pilotage (l'ancien moteur, `touche` : « ⌫ replie ») — hors d'un champ, hors de l'atelier ;
   le même geste que le bouton ◀ (#bprec), donc les mêmes gardes. ─── */
document.addEventListener('keydown', ev => {
  try {
    if (ev.key !== 'Backspace' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const a = document.activeElement; if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
    if (typeof S !== 'object' || !S || !S.lancee || S.atelier || S.close) return;
    const b = document.getElementById('bprec'); if (!b || b.disabled || b.offsetParent === null) return;
    ev.preventDefault(); b.click();
  } catch (e) {}
}, true);


/* ─── déplacés du socle par leur propriétaire (contrat §3 ; audits E1 F6, E2 C2) : le repère du cahier de textes et la veille du T-5 — tels quels ─── */
const heureCahier = () => { /* E2 : la vraie fin de l'heure (la case, `AT_DR_COURS.fin`) moins les cinq minutes du cahier — avant : dr_heureDe(S.heure).base + 55 − 5 min, où la base était l'heure de LANCEMENT (lancer à 09:00 pour 08:57-09:52 décalait le T-5 de trois minutes) */
  const hj = dr_heureJouee(S.heure); if (hj && hj.base && hj.fin) { const d = new Date(hj.base); return new Date(d.getFullYear(), d.getMonth(), d.getDate(), dr_mn(hj.fin) / 60 | 0, dr_mn(hj.fin) % 60).getTime() - 5 * 60000; }
  return dr_heureDe(S.heure).base + 55 * 60000 - 5 * 60000; };
 /* 6.3 : le repère de la fin d'heure = la fin moins les cinq minutes réservées au cahier de textes */
function tick(){ if ((document.getElementById('fin').parentElement === document.getElementById('ecran-fin') && document.getElementById('ecran-fin').classList.contains('on'))) { $('heure').textContent = hhmm(); return; } if (S.lancee && !S.close && S.ecoule % 15 === 0 && !(document.activeElement && document.activeElement.classList.contains('dur-in'))) { try { ouOnEnEst(); } catch (e) {} } if (!S.lancee) { $('chr').textContent = '—'; $('chr').className = ''; $('heure').textContent = ''; return; } if (S.close) { try { if (S.palier) alerteFermer(); } catch (e) {} return; } /* E2 : l'heure close, le chrono s'arrête (relecteur neuf n°2) */ S.ecoule++; $('heure').textContent = hhmm(); const chr = $('chr'); const reste = heureCahier() - now();
  if (S.close || reste > 5 * 60000) { const m = Math.floor(S.ecoule / 60), s = S.ecoule % 60; chr.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'); chr.className = ''; chr.title = 'Le temps écoulé depuis le lancement de l\'heure'; return; }
  const abs = Math.abs(reste); const m = Math.floor(abs / 60000), sec = Math.floor((abs % 60000) / 1000); chr.textContent = (reste >= 0 ? '−' : '+') + m + ':' + String(sec).padStart(2, '0'); chr.className = reste <= 0 ? 'cr-zero' : reste <= 60000 ? 'cr-t1' : reste <= 180000 ? 'cr-t3' : 'cr-t5'; chr.title = reste >= 0 ? 'Compte à rebours vers l\'heure du cahier de textes (' + hhmm(heureCahier()) + ')' : 'Le cahier de textes a commencé depuis ' + m + ' min ' + sec + ' s (l\'heure court jusqu\'à Clore)';
  S.paliers = S.paliers || {}; const kk = reste <= 0 ? 'zero' : reste <= 60000 ? 't1' : reste <= 180000 ? 't3' : 't5'; ['t5', 't3', 't1', 'zero'].forEach(k => { const seuil = { t5: 5 * 60000, t3: 3 * 60000, t1: 60000, zero: 0 }[k]; if (reste <= seuil && !S.paliers[k]) { S.paliers[k] = true; dr_palier(k); } }); }

setInterval(tick, 1000);

/* ─── au fil, sans dépendre d'un crochet : en classe, dès que le journal ou l'état bouge, la copie, le journal, l'état et le paquet
   partent (débounce de 900 ms) — `dr_sauve` du socle ne passe pas sur les gestes de classe (parole, dévoilement) ─── */
DR_CL.sig = '';
setInterval(() => { try { if (!dr_clPeutEcrire()) return; const g = J.length + '|' + JSON.stringify(parDiapo).length + '|' + JSON.stringify(S.parts || []).length + '|' + JSON.stringify(S.decisions || {}).length + '|' + (S.notesFil || []).length + '|' + S.di + '|' + (S.finSection || 0);
  if (g !== DR_CL.sig) { DR_CL.sig = g; dr_copieAuto(); } } catch (e) {} }, 1000);

/* ─── « ■ Clore l'heure » à côté de « Fin de l'heure » (le « ■ Clore la séance » d'aujourd'hui) : il ouvre la fin de l'heure à
   l'étape 7 — la clôture garde sa garde (ce qui manque et ce que Paul risque, C1 7.0 bis) ; rien ne se clôt sans qu'il l'ait lu ─── */
function dr_clorePoser(){
  const f = document.getElementById('bfin'); if (!f) return; let b = document.getElementById('dr-clore');
  if (!b) { b = document.createElement('button'); b.id = 'dr-clore'; b.className = f.className; b.textContent = '■ Clore l’heure';
    b.title = 'Clore l’heure : ouvre la dernière étape de la fin de l’heure ; avant de fermer, le site te dit ce qui manque (échéance, travail, récit relu, copie École Directe) et ce que tu risques — tu clos quand même si tu veux.';
    b.onclick = () => { if (!S.lancee || S.close) return; S.finSection = 7; ouvrirFin(true); }; f.insertAdjacentElement('afterend', b); }
  b.style.display = (S.lancee && !S.close && !S.repetition && !S.atelier) ? '' : 'none';
}
setInterval(() => { try { if (typeof S === 'object' && S) dr_clorePoser(); } catch (e) {} }, 500);

/* ─── après la clôture (vu par E4) : « ▶ Lancer l'heure » revient (le socle le cache tant que S.lancee), et ▶ ◀ ⌫ et les flèches
   n'écrivent plus dans le journal de l'heure close : la classe n'est plus là ─── */
setInterval(() => { try { if (typeof S !== 'object' || !S || !S.lancee || !S.close) return; const lb = document.getElementById('dr-lancer'); if (lb) lb.classList.remove('dr-cache');   /* le libellé et l'infobulle viennent de `dr_proposer` (et disent si l'heure du créneau est close) */ } catch (e) {} }, 500);
const dr_heureCloseBloque = ev => { try { if (typeof S !== 'object' || !S || !S.lancee || !S.close || S.atelier) return; if (typeof ATVUES === 'object' && ATVUES && ATVUES.vue && ATVUES.vue !== 'pilotage') return; const t = ev.target;
  if (ev.type === 'click' && t && t.closest && t.closest('#bdev, #bprec')) { ev.stopPropagation(); ev.preventDefault(); return; }
  if (ev.type === 'keydown' && /^(ArrowRight|ArrowLeft| |Backspace|PageDown|PageUp)$/.test(ev.key) && !(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))) { ev.stopPropagation(); ev.preventDefault(); } } catch (e) {} };
document.addEventListener('click', dr_heureCloseBloque, true); document.addEventListener('keydown', dr_heureCloseBloque, true);

/* ─── la garde de la clôture (« il manque… ») appartient au Pilotage : quitter le Pilotage (l'onglet Relecture pour relire le
   récit, comme la garde y invite) la referme — la Relecture n'est jamais couverte (cadrage 2 · 0.1 ; vu par le relecteur n°3 d'E4) ─── */
setInterval(() => { try { const g = document.getElementById('garde-clore'); if (!g || !g.classList.contains('on')) return;
  const v = (typeof ATVUES === 'object' && ATVUES) ? ATVUES.vue : null; if (v && v !== 'pilotage') g.classList.remove('on'); } catch (e) {} }, 250);

/* ─── l'identité des diapos en classe (relecteur neuf n°1) : la trame du hub n'a pas toujours ses `eid` ; le socle en fabrique de
   neufs à chaque chargement, et la copie de la classe (C/ecrans) garde ceux du lancement. À la reprise et à l'heure suivante, la trame
   en mémoire ADOPTE les identités de la copie (même ordre, mêmes titres) : le journal, les notes, les dévoilements retrouvent leur diapo.
   `dr_trameJouee` (attendue par `dr_trame` du socle) rend la copie de la classe. ─── */
DR_CL.copie = null;
function dr_trameJouee(){ return DR_CL.copie; }
function dr_adopterIdentites(copie){
  try { if (!Array.isArray(copie)) return 0; DR_CL.copie = copie; const E = seance().ecrans; let n = 0;
    if (E.length === copie.length) E.forEach((e, i) => { const c = copie[i]; if (c && c.eid && (e.act || '') === (c.act || '') && e.eid !== c.eid) { e.eid = c.eid; n++; } });
    return n; } catch (e) { return 0; }
}

/* ─── reprendre depuis la case de l'EDT (mandat 6, « ou à edtLancer sur une heure déjà lancée » ; relecteur neuf n°1) : la case
   d'une heure lancée et pas close propose « ▶ Reprendre le cours ». L'heure est retrouvée par sa trace (`edtCheminTrace`), pas par le
   pointeur : elle se reprend même si `cours_actif` manque. ─── */
function dr_reprendreCours(c){
  try { atelierOuvrir(); } catch (e) {}
  atChargerChapitres(c.niveau, () => {
    atEditerChapitre(c.niveau, c.chapitre); ATVUES.snum = String(c.seance);
    AT_DR_COURS = { debut: c.debut, fin: c.fin, classeSlug: c.classeSlug, classeNom: c.classeNom }; AT_DR_REGIME = 'classe';
    atVuesAller('pilotage');
    edtQuandPilotagePret(manque => { if (manque) { atInfo('Le pilotage ne s’ouvre pas (manque : ' + manque + ').'); return; }
      dr_reprendre(ok => { if (!ok) atInfo('L’état de cette heure n’est pas au hub : elle ne peut pas être reprise telle quelle.'); }); });
  });
}
/* réveil n°5, A4-4 (C1 6.5, 8.6) : la case close ouvre la Relecture de CETTE heure — la séance, la classe et l'heure de sa trace ; l'atelier
   s'ouvre sans régime « classe » (rien ne s'écrit), la Relecture d'E4 relit la classe au hub (`dr_recitChargerClasse`), puis l'heure n. */
function dr_edtRelire(cle){
  const cel = edtCellule(cle); if (!cel) return; const t = edtCheminTrace(cel.classeMjpc, cel.iso, cel.creneau); if (!t || !t.trace) { atInfo('La trace de cette heure est introuvable.'); return; }
  const m = /^\/site\/([^/]+)\/chapitres\/([^/]+)\/seances\/([^/]+)\/deroule_joue\/([^/]+)\//.exec(t.chemin); if (!m) return; const h = +t.trace.heure || null;
  if (typeof S === 'object' && S && S.lancee && !S.close) { atInfo('Une heure est en cours : relis celle-ci une fois l’heure en cours close.'); return; }
  try { edtFermer(); edtModaleFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {}
  atChargerChapitres(m[1], () => { atEditerChapitre(m[1], m[2]); ATVUES.snum = String(m[3]);
    edtQuandPilotagePret(manque => { if (manque) { atInfo('La Relecture ne s’ouvre pas (manque : ' + manque + ').'); return; } try { atVuesAller('relecture'); } catch (e) {}
      dr_recitChargerClasse(decodeURIComponent(m[4]), () => { S.face = 'recit'; if (h) S.faceH = h; try { relecture(); } catch (e) {} }); }); });
}
function dr_edtReprendre(cle){
  const cel = edtCellule(cle); if (!cel) return; const t = edtCheminTrace(cel.classeMjpc, cel.iso, cel.creneau); if (!t || !t.trace) { atInfo('La trace de cette heure est introuvable.'); return; }
  if (t.trace.clos) { atInfo('Cette heure a été close : elle ne se reprend pas.'); return; }
  const m = /^\/site\/([^/]+)\/chapitres\/([^/]+)\/seances\/([^/]+)\/deroule_joue\/([^/]+)\//.exec(t.chemin); if (!m) return;
  edtFermer(); edtModaleFermer();
  dr_reprendreCours({ niveau: m[1], chapitre: m[2], seance: m[3], classeSlug: m[4], classeNom: t.trace.classe || cel.classeMjpc, debut: t.trace.lanceA || String(cel.creneau).split('-')[0], fin: t.trace.fin || String(cel.creneau).split('-')[1] });
}

/* ─── `dr_proposer()` (contrat §12.6, relance du 21/10) : ce que « ▶ Lancer » va lancer quand on n'est pas passé par l'EDT — la case de
   l'EDT du moment pour ce niveau (aujourd'hui, l'heure en cours ou la prochaine) si c'est bien la séance ouverte ; sinon la première classe
   du niveau, le créneau qui contient maintenant (sinon le 3e), le début proposé, l'heure n de la classe et N = 1. Le bouton le dit. ─── */
function dr_proposer(){
  const niv = (AT.edChap || {}).level; const auj = new Date(); const iso = auj.getFullYear() + '-' + String(auj.getMonth() + 1).padStart(2, '0') + '-' + String(auj.getDate()).padStart(2, '0'); const m = dr_maintenantMn();
  try {
    const cel = Object.values(edtProjeter(iso, 1) || {}).filter(c => c && c.classeMjpc && edtNiveauDe(c.classeMjpc) === niv && (c.nature === 'prevu' || c.nature === 'jouee') && dr_mn(String(c.creneau).split('-')[1]) > m)
      .sort((a, b) => String(a.creneau).localeCompare(String(b.creneau)))[0];
    const titre = (seance() || {}).titre || '';
    if (cel && (cel.nature === 'jouee' || !cel.titre || cel.titre === titre)) { const sl = dr_slugDe(cel.classeMjpc);
      return { classeSlug: sl, classeNom: dr_nomClasse(sl), creneau: cel.creneau, debut: dr_debutPropose(cel.creneau), heure: cel.heure || dr_heureProposee(sl, cel.creneau), sur: cel.sur || 1, depuis: 'edt' }; }
  } catch (e) {}
  const sl = dr_classeProposee(), cr = dr_creneauPropose();
  const hp = dr_heureProposee(sl, cr); let N = hp; try { N = edtHeuresPour(chapitresData[AT.edChap.level][AT.edChap.chnum].seances[ATVUES.snum], cr); } catch (e) {}   /* N par la même fonction que la case */
  return { classeSlug: sl, classeNom: dr_nomClasse(sl), creneau: cr, debut: dr_debutPropose(cr), heure: hp, sur: Math.max(1, N, hp), depuis: 'jour' };
}
setInterval(() => { try { const b = document.getElementById('dr-lancer'); if (!b || (S.lancee && !S.close)) return; const p = dr_proposer();
  const cleP = (typeof dr_cheminB === 'function' ? dr_cheminB() : '') + '/deroule_joue/' + p.classeSlug + '/heures/' + _drCleHeureDe({ classeSlug: p.classeSlug, debut: p.debut, fin: String(p.creneau).split('-')[1] });
  if (S.close && DR_CL.cleClose && cleP === DR_CL.cleClose) { const t2 = '▶ Lancer — l’heure de ' + p.creneau + ' est close'; if (b.textContent !== t2) { b.textContent = t2; b.disabled = true; b.title = 'L’heure de ce créneau est close : elle ne se rouvre pas. L’heure suivante de la séance se lance depuis sa case de l’emploi du temps (son créneau à elle).'; } return; }   /* réveil n°3 : le geste fait ce que le bouton dit, ou il se grise avec sa raison */
  if (S.close && DR_CL.cleClose && p.depuis !== 'edt') { const nx = (edtProchainesDe(p.classeSlug, 1) || [])[0]; const t3 = '▶ Lancer — l’heure est close';   /* réveil n°5, A4-6 : après la clôture, jamais un créneau hors de la grille de la classe (avant : « 10:07-11:02 », qui n'existe pas le lundi) */
    const ti = 'L’heure de ' + (DR_CL.creneauClos || 'ce créneau') + ' est close : elle ne se rouvre pas. ' + (nx ? 'La prochaine heure de ' + p.classeNom + ' : ' + nx.l + ' — elle se lance depuis sa case de l’emploi du temps.' : 'Aucune autre heure de ' + p.classeNom + ' aujourd’hui dans l’emploi du temps.');
    if (b.textContent !== t3 || b.title !== ti || !b.disabled) { b.textContent = t3; b.disabled = true; b.title = ti; } return; }
  b.disabled = false; const t = '▶ Lancer avec ' + p.classeNom + ' · ' + p.creneau + ' · heure ' + p.heure + '/' + p.sur;
  if (b.textContent !== t) { b.textContent = t; b.title = 'Lance l’heure avec ' + p.classeNom + ', créneau ' + p.creneau + ', heure ' + p.heure + ' sur ' + p.sur + ' de la séance' + (p.depuis === 'edt' ? ' (la case de ton emploi du temps)' : ' (aucune case de l’emploi du temps pour cette séance maintenant : la classe du niveau et le créneau en cours)') + ' — le chrono démarre, tout s’enregistre pour la classe.'; } } catch (e) {} }, 1000);

/* ─── `dr_heureDe(h)` complétée (contrat §12.6, relance C1) : une heure lancée par `dr_lancer` répond avec son vrai créneau (la base =
   le début du créneau, pas le lancement) — l'heure en cours comme les heures passées, gardées dans `C/etat` (`S.heuresCours`) et relues
   par `dr_lireJoue` ; sinon la fonction du socle (E1). La fonction d'E1 n'est pas réécrite : elle est enveloppée. ─── */
if (typeof dr_heureDe === 'function' && !dr_heureDe.__e2) { const dr_heureDe0 = dr_heureDe;
  window.dr_heureDe = function (h) { try { const x = dr_heureJouee(h != null ? h : S.heure); if (x && x.base) return Object.assign({}, x, { utiles: dr_tempsUtile(x.debut + '-' + x.fin, x.lanceA) }); } catch (e) {} return dr_heureDe0.apply(this, arguments); };
  window.dr_heureDe.__e2 = true; }

/* ─── la fusion de la copie et de la trame (contrat §12.8, relance C6), pour une nouvelle heure de la même séance avec la même classe :
   par `eid` — un écran nouveau dans la trame s'ajoute ; un écran modifié dans la trame remplace sa copie SAUF si la classe l'a modifié
   en classe (le journal porte `ecrire`/`reponse`/`copie…` sur lui) ; un écran retiré de la trame reste s'il a été joué. Rend le tableau fusionné. ─── */
function dr_fusionCopie(trame, copie, journalJ){
  const parEid = {}; (copie || []).forEach(c => { if (c && c.eid) parEid[c.eid] = c; });
  const JJ = journalJ || J; const modifie = eid => JJ.some(x => x.eid === eid && /^(ecrire|reponse|copie)/.test(x.type)); const joue = eid => JJ.some(x => x.eid === eid && x.type === 'diapo');
  const sig = e => dr_empreinte({ act: e.act || '', blocs: e.blocs || [] });
  const res = [], vus = new Set();
  (trame || []).forEach(e => { const c = e && parEid[e.eid]; vus.add(e && e.eid);
    if (!c) { res.push(e); return; }                                   /* nouveau dans la trame */
    res.push(sig(e) !== sig(c) && modifie(e.eid) ? c : e); });         /* modifié dans la trame : la trame, sauf ce que la classe a modifié */
  (copie || []).forEach((c, i) => { if (!c || vus.has(c.eid) || !joue(c.eid)) return;   /* retiré de la trame mais joué : il reste, à sa place */
    const prec = (copie[i - 1] || {}).eid; const k = res.findIndex(x => x && x.eid === prec); res.splice(k >= 0 ? k + 1 : res.length, 0, c); });
  return res;
}

/* ─── la séance continue (CADRAGE-TEMPS §1) : la trame réelle met tous ses écrans à l'heure 1 (contrat §12.5) ; à l'heure n > 1, si aucun
   écran ne lui est prévu, ceux que la classe n'a pas encore vus passent à l'heure n, et le socle pose son « Cahier de textes » (relecteur
   neuf n°2 : l'heure 2 n'avait aucune diapo, ▶ levait). Rien ne change pour ce qui a été montré ; rien ne s'écrit dans la trame. ─── */
function dr_heureContinue(h){
  try { if (!(h > 1)) return 0; const E = seance().ecrans; const utile = DR_CL.partages.get(E); if (!utile && E.some(e => e.heure === h && e.role !== 'fin')) return 0;   /* une frontière posée par Paul : son heure h tient */
    const i0 = J.findIndex(x => x.type === 'lancement'); const vus = new Set((i0 < 0 ? [] : J.slice(i0)).filter(x => x.type === 'diapo').map(x => x.eid)); let n = 0;   /* ce qui a été montré APRÈS un lancement : la diapo poussée au chargement n'a pas été vue par la classe */
    E.forEach((e, i) => { if (!e.role && !vus.has(e.eid) && !vuMax[K(i)] && (+e.heure || 1) < h) { e.heure = h; n++; } });
    if (utile) n += dr_refaireHeures(E, h, utile);   /* banc.sh 13:56 (K6-K11) : la frontière par les durées laissait à l'heure 1 ce que la classe n'avait pas vu — l'heure 2 sautait les premières diapos */
    if (n && typeof dr_normaliserTrame === 'function') dr_normaliserTrame(E, (dr_ctx() || {}).snum);   /* la clé de la séance : l'eid « fin-hN-s<clé> » du socle, stable */ try { reindexer(); } catch (e) {} return n; } catch (e) { return 0; }
}
/* la séance continue (CADRAGE-TEMPS §1) sur ma frontière par les durées : à partir de l'heure h, ce qui reste se repartage par les minutes
   utiles ; chaque « Cahier de textes » (rôle fin, eid stable du socle) est déplacé derrière la dernière diapo de son heure, jamais doublé. */
function dr_refaireHeures(E, h, utile){
  let cum = 0, n = 0; E.forEach(e => { if (e.role || (+e.heure || 1) < h) return; const nh = h + Math.floor(cum / utile); if (nh !== e.heure) { e.heure = nh; n++; } cum += +e.dur || 0; });
  dr_placerFins(E, 1); return n; }   /* tous les « Cahier de textes », pour que la reprise retrouve le même ordre */
function dr_placerFins(E, h){ const fins = {}; for (let i = E.length - 1; i >= 0; i--) if (E[i].role === 'fin' && (+E[i].heure || 1) >= h) fins[E[i].heure] = E.splice(i, 1)[0];
  Object.keys(fins).map(Number).sort((a, b) => a - b).forEach(k => { let der = -1; E.forEach((e, i) => { if (e.heure === k) der = i; }); E.splice(der >= 0 ? der + 1 : E.length, 0, fins[k]); }); }

/* ─── `edtProchainesDe(slug, n)` (plan §3, « une fonction du module EDT ajoutée en une » ; le socle la lit pour `dr_classe().prochaines`) :
   les n prochaines heures de la classe, après maintenant, d'après les cases de l'emploi du temps (`edtCasesDuJour`, les jours sans cours
   exclus) — jamais une seconde lecture de la grille. Rend `[{iso, creneau, l}]` ; vide tant que l'EDT n'est pas chargé (relecteur neuf n°2 :
   l'échéance n'avait que « aucune »). ─── */
function edtProchainesDe(slug, n){
  try { if (typeof EDT === 'undefined' || !EDT.charge || typeof edtCasesDuJour !== 'function') return [];
    const nom = dr_nomClasse(slug), out = [], d0 = new Date(), m = dr_maintenantMn();
    for (let j = 0; j < 45 && out.length < (n || 3); j++) { const d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + j, 12); const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (edtJourSansCours(iso)) continue;
      edtCasesDuJour(iso).filter(c => c && c.classeMjpc === nom && (j > 0 || dr_mn(String(c.creneau).split('-')[0]) > m)).forEach(c => { if (out.length < (n || 3)) out.push({ iso, creneau: c.creneau, l: DR_JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + DR_MOIS[d.getMonth()] + ', ' + String(c.creneau).split('-')[0].replace(':', ' h ') }); }); }
    return out; } catch (e) { return []; }
}
/* l'EDT chargé au lancement (même sans passer par lui) : les prochaines heures de la classe deviennent lisibles (échéance, « À relire — ») */
function dr_edtAssurer(){ try { if (typeof EDT !== 'undefined' && !EDT.charge && typeof edtCharger === 'function') edtCharger(() => { try { edtChargerClasses(() => {}); } catch (e) {} }); } catch (e) {} }

/* ─── les infobulles de la garde de clôture et de « Annuler » (relecteur neuf n°2) — les boutons sont au gabarit ─── */
/* réveil n°4, point 5 (C1 11t.3) : le mode test se voit dans le pilotage — la pastille du site (classe `tprof-testpill on`) posée dans l'entête,
   et `data-mode-test` sur #dr-zone pour qu'E1 l'affiche à sa façon (le témoin « Enregistré à … », #dr-enr, est à E1) */
setInterval(() => { try { const on = typeof m8TestOn === 'function' ? !!m8TestOn() : !!(typeof M8_TEST !== 'undefined' && M8_TEST); const z = document.getElementById('dr-zone'); if (z) { if (on) z.dataset.modeTest = '1'; else delete z.dataset.modeTest; }
  let p = document.getElementById('dr-test'); const hou = document.getElementById('hou'); if (!p && hou && on) { p = document.createElement('span'); p.id = 'dr-test'; p.className = 'tprof-testpill on dr-test'; p.title = 'Mode test : rien de cette heure ne part au hub — ni le journal, ni l’état, ni la clôture'; p.innerHTML = '<span class="tprof-testpill-dot"></span>Mode test'; hou.insertAdjacentElement('afterend', p); }
  if (p) p.style.display = on ? '' : 'none'; } catch (e) {} }, 1000);
setInterval(() => { try { const t = { 'gclore-oui': 'Clore l’heure malgré ce qui manque : tout ce qui est fait est enregistré ; ce qui manque restera à faire plus tard', 'gclore-non': 'Revenir à l’étape qui manque, sans rien fermer', 'f-fermer': 'Referme la fin de l’heure sans rien clore : tes choix restent', 'garde-devant': 'Change de diapo sans geler : la classe voit ce que tu ouvres' };
  Object.keys(t).forEach(id => { const b = document.getElementById(id); if (b && !b.title) b.title = t[id]; }); } catch (e) {} }, 1000);

/* ─── dette 12 · 17 (sur mon territoire) : « les absents saisis dans la case EDT ne sont relus par rien ». L'appel se saisit dans le
   Pilotage OU dans la case de l'EDT — c'est la même liste (C1 11b.1) : au lancement et à la reprise, les élèves cochés absents dans la
   case (`H/absents`, des slugs `edtSlugEleve`) sont absents dans l'appel du Pilotage, dès le début de l'heure (raison « case de l'EDT »). ─── */
function dr_absentsDeLaCase(){
  const ch = (typeof dr_cheminH === 'function') ? dr_cheminH() : null; if (!ch || typeof edtSlugEleve !== 'function') return;
  dr_lire(ch + '/absents', abs => { try { if (!Array.isArray(abs) || !abs.length) return; let n = 0; const t0 = S.debutReel || now();
    (typeof ELEVES !== 'undefined' ? ELEVES : []).forEach(e => { if (!abs.includes(edtSlugEleve(e)) || (S.appel[e] || []).length) return; S.appel[e] = [{ type: 'absent', t: t0, heure: S.heure, raison: 'case de l’emploi du temps' }]; n++; });
    if (n) { journal('appel', { depuis: 'case', n }); dr_tout(); } } catch (e) {} });
}
/* dette 12 · 17 : `_drProchainCreneau` (« À relire — … ») rendait le prochain jour ouvré ; c'est la prochaine heure de la classe (contrat §12.12) */
if (typeof _drProchainCreneau === 'function' && !_drProchainCreneau.__e2) { const dr_prochain0 = _drProchainCreneau;
  window._drProchainCreneau = function () { try { const sl = (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && AT_DR_COURS.classeSlug) || dr_classeProposee(); const p = edtProchainesDe(sl, 1); if (p && p[0]) return p[0].l; } catch (e) {} return dr_prochain0.apply(this, arguments); };
  window._drProchainCreneau.__e2 = true; }
setInterval(() => { try { if (typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME === 'classe' && S.lancee && !S.close) dr_absentsDeLaCase(); } catch (e) {} }, 15000);   /* un absent coché dans la case pendant l'heure arrive au Pilotage */

/* ─── les activités de la fin de l'heure, et chaque diapo sans activité comme la sienne (réveil n°3, points 3 et 5 ; C1 7.0-7.1) : la trame
   réelle n'a pas encore d'activités ; sans elles, « ce qui reste » ne proposait rien à décider. La décision d'une diapo se range sous son `eid`
   (`cleDec` du socle), elle glisse à l'heure suivante comme une activité. ─── */
function dr_pseudoAct(e, i){ if (!e || e.role || e.actId) return null; let n = null; try { n = rangDe(i, e.heure); } catch (x) {} return { id: e.eid, num: n || (i + 1), titre: e.act || '', diapos: [i], pseudo: true }; }
function dr_activitesOuDiapos(){ const E = seance().ecrans; const vraies = dr_activites()[String(S.si)] || []; return vraies.concat(E.map((e, i) => dr_pseudoAct(e, i)).filter(Boolean)); }

/* ─── la frontière d'heure par les durées (dette 12 · 07, réveil n°3, point 2) : quand la trame ne la porte pas (tout à l'heure 1),
   l'heure n = les diapos qui commencent dans ses minutes utiles (créneau − 5 min), la suite à l'heure n + 1 ; chaque heure a son
   « Cahier de textes » (posé par le socle). En classe seulement, en mémoire : la trame du hub n'est pas réécrite. ─── */
DR_CL.partages = new WeakMap();   /* trame en mémoire → minutes utiles de la frontière que j'y ai posée */
function dr_partagerHeures(utile){
  try { const E = seance().ecrans; const pleines = E.filter(e => e.role !== 'fin'); if (new Set(pleines.map(e => +e.heure || 1)).size > 1) return 0;   /* une frontière existe déjà */
    utile = utile || 50; let cum = 0, n = 0; E.forEach(e => { if (e.role === 'fin') return; const h = 1 + Math.floor(cum / utile); if (h !== (+e.heure || 1)) { e.heure = h; n++; } cum += +e.dur || 0; });
    if (n) DR_CL.partages.set(E, utile);   /* la frontière est la mienne (par les durées) : `dr_heureContinue` peut la refaire ; une frontière posée par Paul, jamais */
    if (n && typeof dr_normaliserTrame === 'function') dr_normaliserTrame(E, (dr_ctx() || {}).snum);   /* la clé de la séance : l'eid « fin-hN-s<clé> » du socle, stable */ try { reindexer(); } catch (x) {} return n; } catch (e) { return 0; }
}
const dr_utileCreneau = cr => Math.max(10, dr_tempsUtile(cr, String(cr).split('-')[0]));
