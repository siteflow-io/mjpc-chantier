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

/* C16 571 (MANDAT-RECIT-GEL §2.2) — QUAND PAUL CHANGE L'ÉLÈVE D'UNE RÉPONSE VALIDÉE, LE JOURNAL SUIT (la réponse et sa parole « réponse ») : avant, seul le texte
   de la ligne suivait — le journal, le récit et « Ce qui s'est passé » gardaient le premier élève, et rien ne suivait pendant un gel. */
function dr_repEleveSuit(bi, ri, r){ if (!r || !r.validee || typeof dr_repJ !== 'function') return; const si = S.si, di = S.di; const x = dr_repJ(si, di, bi, ri); if (x) { x.eleve = r.eleve; x.ini = r.i; } if (!r.eleve) return; const cle = si + '|' + di + '|' + bi + '|' + ri; let p = null; for (let k = J.length - 1; k >= 0; k--) { const y = J[k]; if (y && y.type === 'parole' && y.rep === cle) { p = y; break; } } if (p) p.nom = r.eleve; else journal('parole', { nom: r.eleve, m: 'reponse', rep: cle }); }
/* C16 nuit C (MANDAT C ; Paul, 04/11 07:36, 13:07, 13:50) — LA CASE DES INITIALES : la liste numérotée des élèves possibles (9 au plus), le chiffre qui choisit, le saut à
   la réponse quand toutes les initiales d'un seul élève possible sont tapées. Les touches de la case passent avant l'atelier (écoute à la descente) : Entrée et Tab n'y remontent plus. */
/* C16 nuit B (MANDAT B §1.1) : la même case sert dans la Relecture (« Qui a répondu ») — `src` = { eleves, ini } de la classe relue ; sans `src`, la classe du pilotage, comme en classe */
const dr_caseBase = x => plat(String(x || '').replace(/\d+$/, '')).toUpperCase();
function dr_caseCands(t, src){ const tu = plat(t).toUpperCase(); if (!tu) return []; const I = src ? src.ini : INI; return (src ? src.eleves : ELEVES).filter(n => (src || !absentA(n)) && I[n] && dr_caseBase(I[n]).indexOf(tu) === 0).sort((a, b) => dr_prenom(a).localeCompare(dr_prenom(b), 'fr')); }
function dr_caseSeul(t, entree, src){ const c = dr_caseCands(t, src); const I = src ? src.ini : INI; const tu = plat(t).toUpperCase(); const pleins = c.filter(n => dr_caseBase(I[n]) === tu); if (c.length === 1 && pleins.length === 1) return c[0]; if (entree && pleins.length === 1) return pleins[0]; return null; }
function dr_caretFin(c){ try { const sel = window.getSelection(); const rg = document.createRange(); rg.selectNodeContents(c); rg.collapse(false); sel.removeAllRanges(); sel.addRange(rg); } catch (e) {} }
function dr_caseListe(ini, t, choisir, src){ const I = src ? src.ini : INI; let L = document.getElementById('dr-case-liste'); if (!L) { L = document.createElement('div'); L.id = 'dr-case-liste'; L.title = "Les élèves possibles : tape le numéro de l'élève pour le choisir (ou clique son nom), ou continue ses initiales"; L.style.cssText = 'position:fixed;z-index:9999;background:#fffdf7;color:#2b2620;border:1px solid #c9c2b0;border-radius:6px;padding:4px 8px;font-size:14px;line-height:1.5;box-shadow:0 2px 8px rgba(0,0,0,.18);max-width:340px;display:none'; L.onmousedown = ev => { ev.preventDefault(); const x = ev.target.closest('[data-k]'); if (x && L._choisir) L._choisir(+x.dataset.k); }; document.body.appendChild(L); }
  const tt = String(t || '').trim(); if (!ini || !tt) { L.style.display = 'none'; L._choisir = null; return []; }
  const c = dr_caseCands(tt, src); const tu = plat(tt).toUpperCase(); let h = '';
  if (!c.length) { const abs = (src ? [] : ELEVES).find(n => absentA(n) && I[n] && dr_caseBase(I[n]) === tu); h = '<div style="color:#a23a3a">' + (abs ? dr_esc(dr_prenomTableau(abs)) + ' est noté(e) absent(e).' : 'Aucun élève de la classe n’a les initiales « ' + dr_esc(tt) + ' ».') + '</div>'; }
  else { const pleins = c.filter(n => dr_caseBase(I[n]) === tu).length; if (pleins > 1) h += '<div style="color:#7a5a12">' + pleins + ' élèves ont ces initiales : tape le numéro du bon.</div>'; h += c.slice(0, 9).map((n, k) => '<div data-k="' + k + '" style="cursor:pointer"><b>' + (k + 1) + '</b> ' + dr_esc(dr_prenomTableau(n)) + ' <small style="color:#857a66">' + dr_esc(dr_caseBase(I[n])) + '</small></div>').join('') + (c.length > 9 ? '<div style="color:#857a66">… et ' + (c.length - 9) + ' autres : continue les initiales.</div>' : ''); }
  L.innerHTML = h; L._choisir = k => { if (c[k] && k < 9 && choisir) choisir(c[k]); }; const b = ini.getBoundingClientRect(); L.style.left = Math.max(4, Math.min(b.left, innerWidth - 344)) + 'px'; L.style.top = (b.bottom + 4) + 'px'; L.style.display = 'block'; if (L.getBoundingClientRect().bottom > innerHeight - 4) L.style.top = Math.max(4, b.top - L.offsetHeight - 4) + 'px'; return c; }
if (!window.__drCaseCle) { window.__drCaseCle = true; document.addEventListener('keydown', ev => { const t = ev.target; if (t && t._drKey && t.isConnected && t.isContentEditable && t.closest && t.closest('#mur .rep')) t._drKey(ev); }, true); }
function brancherAjout(){ /* repris de l'ancien (moteur L648-656, ligne() L1441) : la ligne EST le champ ; la frappe part au tableau à la lettre (cadrage 4.2) */
  mur.querySelectorAll('.rep[data-r]').forEach(rep => { const bi = +rep.dataset.bi, ri = +rep.dataset.r; const ini = rep.querySelector('.ini'), dit = rep.querySelector('.dit'); if (!ini || !dit || !ini.isContentEditable) return;
    const d = etatDiapo(); const ligne = () => { d.reps[bi] = d.reps[bi] || []; if (!d.reps[bi][ri]) d.reps[bi][ri] = { i: '', r: '', eleve: null, refo: false, t: now(), heure: S.heure }; return d.reps[bi][ri]; };
    const choisir = n => { const r = ligne(); r.eleve = n; r.i = iniDe(n); ini.textContent = String(r.i).replace(/\d+$/, ''); ini.classList.remove('vide'); dr_repEleveSuit(bi, ri, r); dr_caseListe(null); S.blocActif = bi; S._garderFocus = { bi, ri, quoi: 'dit' }; dit.focus({ preventScroll: true }); dr_caretFin(dit); if (r.r) dr_tout(); };   /* nuit C : l'élève désigné (toutes ses initiales, ou son numéro) — on passe à sa réponse */
    ini.oninput = () => { const brut = ini.textContent; const net = brut.replace(/[^\p{L}]/gu, '').toUpperCase(); if (net !== brut) { ini.textContent = net; dr_caretFin(ini); } const r = ligne(); const seul = dr_caseSeul(net); if (seul) { choisir(seul); return; } r.eleve = null; r.i = net; ini.classList.toggle('vide', !r.i); dr_repEleveSuit(bi, ri, r); S.blocActif = bi; S._garderFocus = { bi, ri, quoi: 'ini' }; dr_caseListe(ini, net, choisir); if (r.r) dr_tout(); };   /* nuit C (MANDAT C §1.1-1.3, 1.6) : que des lettres, en majuscules toutes seules ; la liste numérotée dès la 1re lettre ; le saut quand toutes les initiales d'un seul élève possible sont tapées, jamais avant (MGC : pas à « MG ») ; des initiales de personne : le site le dit. Avant : n'importe quel texte, l'élève dès des initiales « exactes » (le 1er des deux MB). */
    ini._drKey = ev => { const k = ev.key; if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (/^[1-9]$/.test(k)) { ev.preventDefault(); ev.stopPropagation(); const L = document.getElementById('dr-case-liste'); if (L && L._choisir) L._choisir(+k - 1); return; }   /* le chiffre choisit l'élève de la liste */
      if (k === 'Enter' || k === 'Tab') { ev.preventDefault(); ev.stopPropagation(); const t0 = ini.textContent.trim(); if (!t0) { dr_caseListe(null); dit.focus({ preventScroll: true }); return; } const n = dr_caseSeul(t0, true); if (n) choisir(n); else dr_caseListe(ini, t0, choisir); return; }   /* nuit C (§1.5) : Entrée et Tab ne remontent plus à l'atelier (avant : le curseur partait dans le titre de l'activité) ; des initiales qui ne désignent personne, ou deux élèves : on reste dans la case, la liste le dit */
      if (k === 'Escape') { ev.stopPropagation(); dr_caseListe(null); ini.blur(); return; }
      if (k.length === 1 && !/\p{L}/u.test(k)) { ev.preventDefault(); ev.stopPropagation(); } };   /* ni chiffre 0, ni espace, ni signe : la case n'accepte que des lettres */
    ini.onfocus = () => { const r = (d.reps[bi] || [])[ri]; const t = ini.textContent.trim(); if (t && !(r && r.eleve)) dr_caseListe(ini, t, choisir); };
    ini.onblur = () => setTimeout(() => { const a = document.activeElement; if (!(a && a.classList && a.classList.contains('ini'))) dr_caseListe(null); }, 0);
    ini.ondblclick = ev => { ev.preventDefault(); const r = ligne(); if (!r.r) return; r.refo = !r.refo; journal('reponse-reformulee', { eleve: r.eleve, refo: r.refo }); S._garderFocus = { bi, ri, quoi: 'ini' }; dr_tout(); };
    dit.oninput = () => { const r = ligne(); const av = r.r; r.r = dit.textContent; S.blocActif = bi; S._garderFocus = { bi, ri, quoi: 'dit' }; dr_frappeReponse(!av, bi); };   /* C16 (㉟) : avant, chaque touche redessinait tout (dr_tout) */
    dit._drKey = ev => { if (ev.key === 'Tab' && !ev.shiftKey && !dit.textContent.trim()) { ev.preventDefault(); ev.stopPropagation(); return; }   /* nuit C (§1.5) : les initiales ont déjà mené à la réponse — Tab, réponse vide, y reste (avant : le curseur partait ailleurs) */
      if (ev.key === 'Enter') { ev.preventDefault(); ev.stopPropagation(); /* nuit C (§1.5) : valider ne renvoie plus le curseur au titre de l'activité */ const r = ligne(); if (!r.r.trim()) return; r.validee = true; if (typeof dr_repJournaliser === 'function') dr_repJournaliser(S.si, S.di, bi, ri, r); /* C16 571 : au journal à la validation, gel ou pas, sur la diapo où elle est tapée ; jamais deux fois */ if (r.eleve) journal('parole', { nom: r.eleve, m: 'reponse', rep: S.si + '|' + S.di + '|' + bi + '|' + ri }); S.derniere = { type: 'reponse' }; S.blocActif = bi; S._garderFocus = { bi, ri: ri + 1, quoi: 'ini' }; dr_tout(); } if (ev.key === 'Escape') { ev.stopPropagation(); dit.blur(); } };
    dit.onfocus = () => { S.blocActif = bi; }; });
  if (S._garderFocus) { const g = S._garderFocus; const rep = mur.querySelector(`.rep[data-bi="${g.bi}"][data-r="${g.ri}"]`); if (rep) { const c = rep.querySelector(g.quoi === 'ini' ? '.ini' : '.dit'); if (c && document.activeElement !== c) { c.focus({ preventScroll: true }); const sel = window.getSelection(); const rg = document.createRange(); rg.selectNodeContents(c); rg.collapse(false); sel.removeAllRanges(); sel.addRange(rg); } } S._garderFocus = null; } }

/* C16 (les correctifs, ㉟, repris par l'exécutant de la frappe ; Paul, 02/11 12:21 : « en écrivant les réponses des élèves […] c'était assez lent l'écriture ») — LA
   FRAPPE SUIT LES DOIGTS. Avant, chaque touche d'une réponse redessinait tout le pilote (`dr_tout` : la diapo et sa pagination, la vue de droite, « Où on en est »,
   la colonne…) dans la tâche même de la touche : la lettre ne paraissait qu'après, et la fenêtre du tableau (le même fil d'exécution) attendait aussi. Maintenant,
   une touche dans une réponse déjà commencée envoie la diapo au tableau (la fenêtre, la scène du tableau distant), sans redessiner le pilote (le texte y est
   déjà : Paul l'écrit) ; le dessin complet vient quand Paul s'arrête (400 ms sans touche), ou tout de suite si la lettre dévoile la question. Rien n'est perdu :
   la réponse est dans l'état à chaque touche (`r.r`), et part au tableau à chaque touche. */
let DR_FRAPPE_T = null;
function dr_frappeReponse(neuve, bi){
  const complet = () => { clearTimeout(DR_FRAPPE_T); DR_FRAPPE_T = null; dr_tout(); };
  /* la première lettre d'une réponse ne redessine tout que si elle dévoile la question (dr_devoilerQuestionsRepondues) : la ligne libre suivante ne paraît qu'à
     Entrée (le rendu n'en pose une que sous une réponse validée) */
  if (neuve) { try { const e = ecran(); const k = elements(e).findIndex(x => x.b === +bi && x.e === 'q'); neuve = k >= 0 && k + 1 > etatDiapo().nDev; } catch (x) {} }
  if (neuve || S.gel || S.atelier || !S.mur || S.mur.si !== S.si || S.mur.di !== S.di || typeof pousser !== 'function') { complet(); return; }
  try { const e = ecran(); const et = etatComplet(); ['pages', 'pagesP', 'tranchesP', 'policeRatio', 'policeReduite', 'page', 'fsBloc'].forEach(k => { if (S.mur[k] !== undefined) et[k] = S.mur[k]; }); et._pageManuelle = true;
    if (!S.repetition) { et.textes = p8TextesCopie(e, et.textes); et.retires = p8RetiresCopie(e); } et.pilote = false; pousser(et); } catch (x) { complet(); return; }
  try { if (typeof DR_SES === 'object' && DR_SES && DR_SES.ici && typeof dr_sesEnvoyer === 'function') dr_sesEnvoyer(); } catch (x) {}   /* ㉞ : la lettre part aussi aux autres pilotes et au tableau distant (l'état vivant et la scène, dr_sesEnvoyerMaintenant) — sans le dessin complet, le rendu ne les envoyait plus */
  clearTimeout(DR_FRAPPE_T); DR_FRAPPE_T = setTimeout(complet, 400); }
// ───────── PARTICIPATION — le dispositif de l'ancien, repris tel quel : le panneau d'initiales (moteur L770-779), l'historique (L1099-1112), la fiche d'élève (ouvrirPart, corrigePart, posePart, supPart, allerRep), le VIF du pont (L16417-16498), la palette Maj+Espace du pont (L16517-16621) ─────────
const trierIni = t => String(t).toUpperCase().replace(/[^A-Z]/g, '').split('').sort().join('');

function dr_candidats(t){ /* le pont : « TM » trouve « MT » (anagramme dès 2 lettres), sinon préfixe des initiales ou du prénom ; jamais un absent */
  t = String(t || '').trim(); if (!t.length) return []; const E = ELEVES.filter(n => !absentA(n)).map(iniDe); const tt = trierIni(t), tu = t.toUpperCase(); const tp = plat(t);
  const ex = E.filter(x => x === tu || (/^[A-Z]{2}$/.test(tu) && x.replace(/\d+$/, '') === tu)); if (ex.length) return ex;   /* relecteur neuf n°3 (6) : « RD » rend les deux élèves aux mêmes initiales (C1 4b.4 : ils se départagent au moment de taper) */
  const meme = t.length >= 2 ? E.filter(x => trierIni(x) === tt) : []; if (meme.length) return meme;
  return E.filter(x => x.indexOf(tu) === 0 || plat(PRENOMS[x] || '').indexOf(tp) === 0); }
/* C16 (lot 1, 361 ; Paul, 03/11 14:43) : LES INITIALES EXACTES — seules elles désignent un élève (la ligne de réponse à la frappe, à Entrée et à Tab ; le VIF ;
   la palette). Exactes : la clé d'un élève présent de la liste (« RD » le premier des deux RD, « RD2 » le second, comme avant), sinon, sans les accents, celle
   d'un seul élève (« EB » pour « ÉB »). Jamais des lettres inversées ni un début de prénom (`dr_candidats` les propose encore comme suggestion, qui ne
   compte pas) : avant, Entrée prenait le premier candidat — des initiales inconnues tombaient sur un autre élève, qui passait au vert (audit global I §3). */
function dr_iniExact(t){ const tu = String(t || '').trim().toUpperCase(); if (!tu) return null; const E = ELEVES.filter(n => !absentA(n)).map(iniDe).filter(Boolean);
  if (E.includes(tu)) return tu; const pt = plat(tu); const m = E.filter(x => plat(x) === pt); return m.length === 1 ? m[0] : null; }
/* l'élève désigné sans hésitation : des initiales exactes qu'aucun autre élève présent ne partage (« RD » quand il y a deux RD est exact, mais pas seul) */
function dr_iniSeul(t){ const ex = dr_iniExact(t); if (!ex) return null; const b = ex.replace(/\d+$/, ''); return ELEVES.filter(n => !absentA(n)).map(iniDe).some(x => x !== ex && String(x).replace(/\d+$/, '') === b) ? null : ex; }

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
  const b = String(ini || '').replace(/\d+$/, ''); const grp = Object.keys(INI).map(n => INI[n]).filter(x => String(x).replace(/\d+$/, '') === b); if (grp.length < 2) return dr_esc(b);
  const pr = x => String(PRENOMS[x] || ''); let k = 3; while (k < 12 && new Set(grp.map(x => pr(x).slice(0, k).toLowerCase())).size < grp.length) k++;   /* relecteur neuf n°3 (6) : le plus court début de prénom qui les sépare — « Romai » / « Roman », plus « Rom » / « Rom » */
  return dr_esc(b) + '<small class="dr-ini-p">' + dr_esc(pr(ini).slice(0, k)) + '</small>'; }
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
  const revenir = () => { $('vif').value = ''; S.vifCands = []; const sg = $('vif-sug'); if (sg) sg.innerHTML = ''; $('vif').focus({ preventScroll: true }); }; /* E1 : de même, retour au VIF dans la même tâche */
  if (/^[1-9]$/.test(ev.key) && !ev.ctrlKey && !ev.metaKey && !ev.altKey) { const horsSaisie = !/input|textarea/i.test(tg.tagName || ''); const dansVif = id === 'vif' && !!partEleve && dr_iniExact(tg.value) === partEleve;   /* lot 1 (361) : le chiffre choisit le motif pour des initiales exactes seulement */
    if (!DR_CL.vifMotif && (horsSaisie || dansVif || id === 'dr-pnote')) { const b = bts[+ev.key - 1]; if (b) { dr_vifChoisir(b.dataset.pose); ev.preventDefault(); ev.stopPropagation(); } return; } }
  if (ev.key === 'Enter' && (id === 'dr-pnote' || id === 'vif') && partEleve) { const m = DR_CL.vifMotif || (bts[0] && bts[0].dataset.pose); if (m) { posePart(m); revenir(); } ev.preventDefault(); ev.stopPropagation(); return; }
  if (ev.key === 'Escape') { pop.classList.remove('on'); DR_CL.vifMotif = null; $('vif').value = ''; $('vif').focus({ preventScroll: true }); ev.stopPropagation(); } }, true);
function dr_vifChoisir(m){ DR_CL.vifMotif = m; const pop = $('ppop'); pop.querySelectorAll('button.m[data-pose]').forEach(b => b.classList.toggle('dr-choisi', b.dataset.pose === m)); dr_vifDire(); const n = $('dr-pnote'); if (n) n.focus({ preventScroll: true }); }
function dr_vifDire(){ const d = $('dr-pdit'); if (!d) return; const m = DR_CL.vifMotif; const lib = x => (MOTIFS_PART.find(o => o.c === x) || { l: x }).l; const P = PRENOMS[partEleve] || partEleve || '';
  d.innerHTML = m ? 'Entrée pose <b>« ' + dr_esc(lib(m)) + ' »</b> pour <b>' + dr_esc(P) + '</b>, avec la note' : '1, 2, 3… choisit le motif · Entrée pose <b>« ' + dr_esc(lib((MOTIFS_PART[0] || {}).c)) + ' »</b> pour <b>' + dr_esc(P) + '</b>'; }

// le VIF (le pont L16417-16498) : les pastilles candidates s'allument ; un seul élève ouvre sa fiche et le curseur va dans la note ; Entrée ouvre la fiche du premier ; Échap vide ; « posé : INI ✕ (Ctrl+Z) » six secondes
function dr_vifAbsent(v){ const tu = String(v || '').trim().toUpperCase().replace(/\d+$/, '');   /* « TB1 » : les initiales, puis le motif */ if (tu.length < 2 || !/^[A-Z]+$/.test(tu)) return null; const tri = trierIni(tu); const va = x => { const b = String(x).replace(/\d+$/, ''); return b === tu || trierIni(b) === tri; };
  if (ELEVES.some(n => !absentA(n) && va(iniDe(n)))) return null; const n = ELEVES.find(n => absentA(n) && va(iniDe(n))); return n ? iniDe(n) : null; }
$('vif').addEventListener('input', () => { const z = $('vif'); let c = dr_candidats(z.value); S.vifCands = z.value ? c : []; participation(); const sg = $('vif-sug');
  const abs = dr_vifAbsent(z.value);   /* relecteur neuf n°3 (5) : des initiales d'absent le disent, au lieu de proposer un autre élève ; une seule lettre n'ouvre jamais la fiche (C1 4b.4) */
  const ex = dr_iniExact(z.value), seul = dr_iniSeul(z.value);   /* lot 1 (361) : seules des initiales exactes désignent ; le reste est une suggestion qui ne compte pas (un clic sur le nom la choisit) */
  try { const pop = $('ppop'); if (pop.classList.contains('on') && partEleve && partEleve !== seul) { pop.classList.remove('on'); DR_CL.vifMotif = null; } } catch (e) {}   /* lot 1 (361) : la fiche d'un autre élève, ouverte avant, se ferme — Entrée ne pose plus rien pour lui */
  if (!z.value.trim()) { sg.innerHTML = ''; } else if (abs) { sg.innerHTML = '<em style="color:#a23a3a">' + dr_esc(PRENOMS[abs] || abs) + ' est noté(e) absent(e) — rien n’est posé.</em>'; S.vifCands = []; participation(); } else if (!c.length && !ex) { sg.innerHTML = '<em style="color:#a23a3a">Aucun élève avec ces initiales.</em>'; } else if (seul) { sg.innerHTML = '→ <b>' + dr_esc(PRENOMS[seul] || seul) + '</b> (Entrée)'; ouvrirPart(seul); { const n2 = $('dr-pnote'); if (n2) n2.focus({ preventScroll: true }); } /* E1 (banc A25, 1 fois sur 3 à 70 ms/touche) : le curseur passe à la note dans la même tâche — avec 60 ms, la 1ʳᵉ lettre de la note tombait dans le VIF et se perdait (« ien vu ») */ } else { c = (ex ? [ex] : []).concat(c.filter(x => x !== ex)); sg.innerHTML = (ex ? '' : '<em style="color:#a23a3a">Initiales pas exactes</em> — tape ses deux initiales, ou clique son nom : ') + c.slice(0, 8).map(x => `<a href="#" data-vif-c="${x}" style="color:#c99a4e;margin-right:8px;text-decoration:none"><b>${dr_esc(PRENOMS[x] || x)}</b> <span style="color:#7d6f5d">${dr_iniVu(x)}</span></a>`).join('') + (c.length > 8 ? ' … +' + (c.length - 8) : ''); sg.querySelectorAll('a').forEach(a => a.onclick = ev => { ev.preventDefault(); ouvrirPart(a.dataset.vifC); setTimeout(() => { const n2 = $('dr-pnote'); if (n2) n2.focus({ preventScroll: true }); }, 60); }); } });

$('vif').addEventListener('keydown', ev => { const z = $('vif'); if (ev.key === 'Enter') { const ex = dr_iniExact(z.value); /* lot 1 (361) : des initiales exactes, sinon rien (avant : le premier candidat) */ if (ex) { ouvrirPart(ex); setTimeout(() => { const n2 = $('dr-pnote'); if (n2) n2.focus({ preventScroll: true }); }, 60); } ev.preventDefault(); } if (ev.key === 'Escape') { z.value = ''; S.vifCands = []; participation(); z.blur(); } if ((ev.ctrlKey || ev.metaKey) && String(ev.key).toLowerCase() === 'z') { if (S.vifAnnule) { S.vifAnnule(); ev.preventDefault(); } } });

/* réveil n°5, A4-3 (C1 4b.1, 5.4 bis) : le VIF, « posé : … ✕ (Ctrl+Z) » et le haut de la liste des paroles se voient sans défiler — la colonne de droite
   (#droite, qui défile) vient à eux au F2 (le socle met le curseur dans le VIF sans faire défiler) et après chaque pose */
/* réveil n°13 (E4 ligne 165) : l'étape 5 liste les diapos modifiées dans l'ordre de l'heure (la liste d'E1 suit l'ordre du tableau des écrans : la diapo 5 avant la diapo 1) */
function dr_versementDansLOrdre(){ try { const L = document.querySelector('#fin .p8-verse-liste'); if (!L) return; const o = ordreHeure(S.heure); const pos = el => { const i = indexDe(el.dataset.p8eid); const k = o.indexOf(i); return k >= 0 ? k : 1000 + i; };
  const it = Array.from(L.querySelectorAll(':scope > .p8-verse')); const tri = it.slice().sort((a, b) => pos(a) - pos(b)); if (tri.some((x, k) => x !== it[k])) tri.forEach(x => L.appendChild(x)); } catch (e) {} }
/* réveil n°7 : quand la fin de l'heure S'OUVRE, la colonne de droite revient en haut — son titre (« Fin de l'heure — étape n sur 7 ») se voit ; `dr_vifMontrer` l'avait
   fait défiler jusqu'au VIF. Un nouveau rendu de la fin de l'heure (une étape, une décision) ne la fait pas bouger. */
setTimeout(() => { if (typeof ouvrirFin !== 'function' || ouvrirFin.__dr) return; const o0 = ouvrirFin; ouvrirFin = function () { const d = document.getElementById('droite'); const avant = !!(d && d.classList.contains('fin')); const r = o0.apply(this, arguments); try { if (d && !avant && d.classList.contains('fin')) d.scrollTop = 0; } catch (e) {} dr_versementDansLOrdre(); return r; }; ouvrirFin.__dr = true; }, 0);
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
  inp.oninput = () => { let c = dr_candidats(inp.value); const ex = dr_iniExact(inp.value), seul = dr_iniSeul(inp.value); if (!inp.value.trim().length) { sg.innerHTML = ''; zm.style.display = 'none'; zn.style.display = 'none'; return; } if (!c.length && !ex) { sg.innerHTML = '<em style="color:#a23a3a">Aucun élève avec ces initiales.</em>'; zm.style.display = 'none'; zn.style.display = 'none'; choisi = null; } else if (seul) designer(seul); else { c = (ex ? [ex] : []).concat(c.filter(x => x !== ex)); sg.innerHTML = (ex ? '' : '<em style="color:#a23a3a">Initiales pas exactes</em> — tape ses deux initiales, ou clique son nom : ') + c.slice(0, 10).map(x => `<a href="#" data-vif-c="${x}"><b>${dr_esc(PRENOMS[x] || x)}</b> <span>${dr_iniVu(x)}</span></a>`).join('') + (c.length > 10 ? ' … +' + (c.length - 10) : ''); sg.querySelectorAll('a[data-vif-c]').forEach(a => a.onclick = ev => { ev.preventDefault(); designer(a.dataset.vifC); }); zm.style.display = 'none'; zn.style.display = 'none'; choisi = null; } };
  const clavier = ev => { const cible = dr_iniSeul(inp.value) || choisi;   /* lot 1 (361) : des initiales exactes (un seul élève), ou le nom cliqué — avant, un seul candidat suffisait (lettres inversées, début de prénom) */ const noteVide = !zn.value.trim(); if (/^[1-3]$/.test(ev.key) && cible && (ev.target !== zn || noteVide)) { const m = MOTIFS_PART[+ev.key - 1]; if (m) poserAvec(cible, m.c, zn.value.trim()); ev.preventDefault(); return; } if (ev.key === 'Enter' && cible) { poserAvec(cible, MOTIFS_PART[0].c, zn.value.trim()); ev.preventDefault(); return; } if (ev.key === 'Tab' && cible && zn.style.display !== 'none') { zn.focus(); ev.preventDefault(); return; } if (ev.key === 'Escape') { fermer(); ev.preventDefault(); ev.stopPropagation(); } };
  inp.onkeydown = clavier; zn.onkeydown = clavier; setTimeout(() => { try { inp.focus(); } catch (e) {} }, 30); }

function fermerPalette(){ if (PAL) PAL.fermer(); }

// Ctrl+Z hors champ : la dernière saisie (prise de parole, note, appel)
function annulerDerniere(){ const d = S.derniere; if (!d) return; if (d.type === 'parole' && S.parts.length) { const p = S.parts.pop(); journal('parole-annulee', { nom: p.nom }); } else if (d.type === 'note' && S.notesFil.length) { S.notesFil.pop(); journal('note-annulee'); peindreNotes(); } else if (d.type === 'appel' && d.eleve && (S.appel[d.eleve] || []).length) { S.appel[d.eleve].pop(); journal('appel-annule', { eleve: d.eleve }); } const ap = d.type === 'appel' ? d.eleve : null; S.derniere = null; participation(); if (ap) dr_apGeste(ap); }

// l'appel (cadrage 1, 11 bis — la greffe de la maquette) : clic droit sur une pastille
$('part').oncontextmenu = ev => { const n = ev.target.closest('[data-e]'); if (!n) return; ev.preventDefault(); const e = n.dataset.e; const abs = absentA(e); const seg = S.appel[e] || []; const dernier = seg.length ? seg[seg.length - 1].type : 'present';
  const items = abs ? [{ a: 'arrive', l: dernier === 'parti' ? `Revenu — ${prenomUnique(e)} (${hhmm()})` : `Présent, arrivé à ${hhmm()} — ${prenomUnique(e)}`, t: 'l\'heure est prise toute seule ; une raison facultative' }] : [{ a: 'absent', l: `Absent — ${prenomUnique(e)}`, t: 'depuis le début de l\'heure ; il n\'est plus proposé dans les initiales' }, { a: 'parti', l: `Parti à ${hhmm()} — ${prenomUnique(e)}`, t: 'l\'heure est prise toute seule ; une raison facultative ; il n\'est plus proposé' }];
  menuA($('menu'), ev.clientX, ev.clientY, items); $('menu').onclick = ev2 => { const b = ev2.target.closest('[data-a]'); if (!b) return; $('menu').classList.remove('on'); const type = b.dataset.a === 'arrive' ? (dernier === 'parti' ? 'revenu' : 'arrive') : b.dataset.a; const poser = raison => { (S.appel[e] = S.appel[e] || []).push({ type, t: now(), heure: S.heure, raison: raison || '' }); journal('appel', { eleve: e, quoi: type, raison: raison || '' }); S.derniere = { type: 'appel', eleve: e }; participation(); dr_apGeste(e); }; if (type === 'parti' || type === 'arrive') demander(`${prenomUnique(e)} — ${type === 'parti' ? 'parti' : 'arrivé'} à ${hhmm()} : raison (facultatif)`, poser); else poser(''); }; };

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

function activitesDeLHeure(){ const E = seance().ecrans; const o = ordreHeure(S.heure); const vues = []; const out = []; o.forEach(i => { const e = E[i]; if (e.role && e.role !== 'reactivation') return; const a = actDe(e) || dr_pseudoAct(e, i, true);   /* le rituel a sa ligne (relecteur neuf n°3, 11 ; C1 5.4 bis) */ /* E2 : une diapo sans activité compte comme une (réveil n°3, 5) */ if (!a || vues.includes(a.id)) return; vues.push(a.id); out.push(a); }); return out; }

function etatActivite(){ const e = ecran(); const a = actDe(e) || dr_pseudoAct(e, S.di, true); if (!a || (e.role && e.role !== 'reactivation')) return null; let w = {}; try { w = etatWorktrack(a) || {}; } catch (x) {}   /* relecteur neuf n°3 (8) : sans activités dans la trame, la diapo en cours est l'« activité » que la T-5 nomme (C1 6.3) */ return { a, prevu: w.prevu, min: w.min, txt: w.txt || 'dans les temps' }; }

function etatActiviteAncien(){ const e = ecran(); const a = actDe(e); if (!a || e.role) return null; const E = seance().ecrans; const prevu = a.diapos.reduce((t, i) => t + (E[i].dur || 0), 0); let passe = 0; const ev = J.filter(x => x.type === 'diapo' && x.h === S.heure); ev.forEach((x, k) => { const fin = k + 1 < ev.length ? ev[k + 1].t : now(); if (a.diapos.includes(x.di)) passe += fin - x.t; }); (S.coupures || []).forEach(c => { if (!c.compte && a.diapos.includes(c.di)) passe -= (c.fin - c.debut); }); const min = Math.round(passe / 60000); return { a, prevu, min, txt: min > prevu ? `tu dépasses de ${min - prevu} min` : (prevu && min >= prevu * 0.8 ? 'il te reste peu de temps' : 'dans les temps') }; }

function palier0(k){ if (S.close) return; S.t5 = true; S.palier = k; journal(k === 'zero' ? 'cahier-heure' : k); if (!S.enFin && !S.preparation) ouvrirFin(true); /* 7.0 : la séquence s'ouvre par l'alerte, pour préparer l'agenda avant le cahier (Paul, 24/09) ; §12.29, contrôle n°64 (b) : chaque palier la rouvre si Paul l'a repliée (« Plus tard » ne fait pas perdre les rappels) */ else if (S.enFin || S.preparation) { try { ouvrirFin(S.preparation ? true : !!document.getElementById('f-clore')); } catch (e) {} }   /* §12.29 (1) S1 : une seule chose ouverte — le palier s'écrit en tête de la séquence ; la barre du bas ne s'ouvre plus, à aucun palier */ alerteFermer(); }

/* §12.30 (Paul, 27/10 08:05 : « remets la, c'était une fonctionnalité ») : la phrase de l'activité en cours, mot pour mot comme dans la barre de la ③
   (l'ex-`alerteTexte`, tombée ici : sa seconde moitié « Le cahier de textes attend… » attend le mot de Paul, point 481). Sur une ligne à elle sous la
   tête de la séquence, aux moments du palier ; en préparation, l'activité en cours est celle de la classe (la diapo gelée). '' quand il n'y a rien à dire. */
function dr_phraseActivite(){ if (!S.palier || !S.t5 || S.close || S.repetition || !S.lancee) return ''; let et = null; const di0 = S.di;
  try { if (S.preparation && S.preparation.di != null) S.di = S.preparation.di; et = etatActivite(); } catch (e) { et = null; } finally { S.di = di0; }
  return (et ? 'L\'activité en cours : <b style="color:var(--texte)">' + (et.a.pseudo ? 'Diapo ' : 'Activité ') + et.a.num + ' — ' + dr_esc(et.a.titre) + '</b>, ' + et.txt + '. ' : '') + dr_phraseSuite(); }
/* E4 (§12.61 (1), Paul 28/10 14:36, point 481 « oui ») : la seconde moitié de l'ex-`alerteTexte` de la ③, mot pour mot, aux mêmes moments (les paliers) ; à l'heure du cahier, l'heure de la case */
function dr_phraseSuite(){ const k = S.palier; if (!k) return ''; if (k !== 'zero') return 'Le cahier de textes attend — le tableau ne bouge pas tant que tu n\'y vas pas.'; let fin = ''; try { const x = dr_heureDe(S.heure) || {}; fin = x.fin || hhmm(x.base + 55 * 60000); } catch (e) {} return 'Va au cahier de textes : l\'heure court (' + fin + ').'; }
function dr_phraseLigne(){ const p = dr_phraseActivite(); return `<div class="dr-pp-act"${p ? '' : ' hidden'} title="L'activité où la classe en est, et son temps (comme le chrono d'« Où on en est »)">${p}</div>`; }
/* tenue à jour EN PLACE (la minute, la diapo) : seulement le texte de cette ligne, jamais un redessin de la séquence (un champ en frappe garde son focus) */
setInterval(() => { try { const L = document.querySelectorAll('#dr-zone .dr-pp-act'); if (!L.length) return; const p = dr_phraseActivite(); L.forEach(l => { if (l.innerHTML !== p) l.innerHTML = p; dr_poseSi(l, 'hidden', !p); }); } catch (e) {} }, 1000);   /* §12.56 (4) : comparer avant d'écrire */

/* §12.29 (1) S1 : `alerteOuvrir` / `alerteReplier` (la barre du bas, « Préparer », « Aller au cahier », « Plus tard ») tombent ; `alerteFermer` reste (le socle l'appelle). Le palier en tête de la séquence : `dr_palierTete`. */
function alerteOuvrir(){ }   /* §12.29 S1 : la barre ne s'ouvre plus — gardée vide parce que `dr_tout` (dr-atelier.js, E1) l'appelle encore après chaque rendu ; E1 peut retirer cet appel */
function dr_palierTete(){ const k = S.palier; if (!k || S.close || !S.t5) return ''; return (k === 'zero' ? 'C\'est l\'heure du cahier de textes' : 'T-' + { t5: 5, t3: 3, t1: 1 }[k] + ' — ' + LIB_PALIER[k]) + ' · '; }



/* E2 (réveil n°4, point 5 ; C1 6.3) : la boîte au-dessus des notes, entière dans l'écran à 1280 × 768 — la colonne du centre (#scene) est de hauteur fixe ;
   pendant l'alerte, la boîte est compacte (le texte en entier, les boutons dessous) et les notes se réduisent (dr.css, bloc E2) */
function dr_alerteScene(on){ const sc = document.querySelector('#dr-zone .scene') || document.querySelector('.scene'); if (sc) sc.classList.toggle('dr-al', !!on); }
function alerteFermer(){ const b = $('al-boite'), l = $('al-ligne'); if (b) b.style.display = 'none'; dr_alerteScene(false); if (l) l.style.display = 'none'; S.alerteOuverte = false; }   /* §12.29 S1 : la barre peut ne plus exister (E1 la retire du gabarit) */









(function poigneeMur(){ const pg = $('poignee-mur'); let dep = null; pg.addEventListener('mousedown', ev => { ev.preventDefault(); const sc = document.querySelector('.scene'); dep = { y: ev.clientY, part: S.murPart || 1, h: sc.clientHeight }; document.body.style.cursor = 'row-resize'; const move = e => { if (!dep) return; const d = (e.clientY - dep.y) / dep.h; S.murPart = Math.max(0.3, Math.min(1, dep.part + d * 1.6)); try { dimensionner(); } catch (x) {} }; const up = () => { dep = null; document.body.style.cursor = ''; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); journal('poignee-diapo', { part: Math.round((S.murPart || 1) * 100) }); dr_tout(); }; dr_ecouteDoc('mousemove', move); dr_ecouteDoc('mouseup', up); }); pg.addEventListener('dblclick', ev => { ev.preventDefault(); S.murPart = 1; journal('poignee-diapo', { part: 100 }); dr_tout(); }); /* (p8-5e) double-clic : la diapo reprend toute sa place */ })();

/* §12.29 S1 : `glisserAlerte` (déplacer la barre du bas) tombe avec la barre */

/* §12.28-2 (13 · 40) : le compte de l'étape 2 — les activités pas faites dont le choix n'est pas encore fait (sans décision, ou le défaut « à l'heure suivante ») */
function dr_finCompte(restantes){ const R = restantes || []; if (!R.length) return ' — rien'; const nT = R.reduce((t, x) => t + x.diapos.length, 0); const n0 = R.filter(x => !x.decidee).reduce((t, x) => t + x.diapos.length, 0);   /* ㊳ (C16) : la fin d'heure compte en DIAPOS */
  if (!n0) return ' — tout est décidé'; const un = n0 === 1; return ' — ' + (n0 < nT ? 'encore ' : '') + n0 + ' diapo' + (un ? '' : 's') + (un ? ' : dis ce qu\'elle devient' : ' : dis ce qu\'elles deviennent'); }
function controleCahier(restantes){ const h = S.heure; const dec = (restantes || []).every(x => x.decidee);   /* ㊳ (C16) : la ligne est décidée à cette heure (une décision d'une heure d'avant ne compte pas) */ const travail = (texteTravail() || '').trim().length > 0 || !!(S.rienProchaine || {})[h]; const relu = !!(S.recitRelu || {})[h]; /* (b4-2) « ma version » ne coche plus « relu » : le récit se complète jusqu'à la fin (2 · 3.8) */ const absents = ELEVES.filter(e => (S.appel[e] || []).length); const copie = S.copieED && S.copieED[h] && S.copieED[h].contenu && S.copieED[h].travail;
  const etapes = [ { n: 1, lib: 'l\'échéance' + (S.echeance && S.echeanceAuto ? ' (proposée : ' + (((dr_classe() || {}).prochaines || []).find(p => p.iso === S.echeance) || { l: S.echeance }).l + ')' : ''), ok: !!S.echeance || !!(S.finFaites || {})[1],   /* réveil n°11 (E4 ligne 150) : ce qui est proposé et posé est ce qui est dit — l'étape cochée « proposée », la garde ne dit plus « la prochaine fois » */ risque: 'le cahier dira « la prochaine fois » : les élèves ne sauront pas pour quand' }, { n: 2, lib: 'ce qui n\'a pas été fait' + dr_finCompte(restantes),   /* E2 (§12.28-2, 13 · 40) : le compte dit ce que l'étape attend — avant : « ce qui reste (n à décider) » / « (tout décidé) » */   /* réveil n°6-7 (E4 lignes 122, A4-5) : ce que Paul n'a pas encore décidé (sans décision, ou « à l'heure suivante » posé par défaut) — avant : tout ce qui restait */ ok: dec, risque: (S.heure >= ((dr_heureJouee(S.heure) || {}).sur || 1)) ? 'une diapo non faite sans décision ne revient pas : la séance sera tenue pour finie' : 'une diapo non faite sans décision glissera à l\'heure suivante par défaut' }, { n: 3, lib: 'le travail à faire', ok: travail, risque: 'rien dans École Directe ni dans l\'historique pour la prochaine fois' }, { n: 4, lib: 'le récit relu', ok: relu, risque: 'il partira tel quel dans l\'historique (et dans École Directe s\'il est copié)' }, { n: 5, lib: 'le mot aux absents' + (absents.length ? ' (' + absents.length + ')' : ' (aucun absent)'), ok: !absents.length || !!(S.motAbsents || '').trim(), facultatif: true, risque: 'les absents n\'auront pas de mot' }, { n: 6, lib: 'copié pour École Directe', ok: !!copie, risque: 'le cahier de textes de l\'école restera vide, à remplir à la main plus tard' }, { n: 7, lib: 'clore', ok: !!S.close, risque: '' } ];
  const prochaine = etapes.find(e => !e.ok && !e.facultatif) || etapes.find(e => !e.ok); return { etapes, prochaine }; }

function sequenceHtml(h, cloture, restantes){ /* (b4) 7.0 bis/ter : le pas à pas — une étape à la fois, ce qu'il faut y faire, ses contrôles, deux boutons ; le fil ; la liste des sept, cliquable */
  const tmp = document.createElement('div'); tmp.innerHTML = h; const q = sel => tmp.querySelector(sel); const out = n => (n ? n.outerHTML : '');
  const echLabel = tmp.querySelector('#f-ech') ? tmp.querySelector('#f-ech').closest('label') : null; if (echLabel) echLabel.remove(); const travaux = tmp.querySelectorAll('.travail'); const travail = travaux[0]; const avant = tmp.querySelector('#f-mot') ? tmp.querySelector('#f-mot').closest('.travail') : null; const rangee = q('.rangee'); const h3prevu = tmp.querySelector('h3'); const barre = q('.barre-fin'); tmp.querySelectorAll('[data-finvue]').forEach(x => x.parentElement.remove());
  S.finSection = S.finSection || 1; S.finFaites = S.finFaites || {}; const ctl = controleCahier(restantes); const E = ctl.etapes; const n = S.finSection; const et = E[n - 1]; const hh = S.heure; const nbF = E.filter(e => e.ok && e.n < 7).length;
  const TITRES = { 1: 'l\'échéance', 2: 'ce qui n\'a pas été fait', 3: 'le travail à faire', 4: 'le récit relu', 5: 'avant de clore', 6: 'copier pour École Directe', 7: 'clore l\'heure' };
  const resume = { 1: S.echeance ? '✔ ' + dr_esc((dr_classe()/* E1 : lisait DATA.classe */.prochaines.find(x => x.iso === S.echeance) || {}).l || S.echeance) : ((S.finFaites || {})[1] ? '✔ sans échéance' : ''), 2: (restantes || []).length ? dr_finResume(restantes) : 'rien ne restait', 3: (S.rienProchaine || {})[hh] ? 'rien pour la prochaine fois' : dr_esc((texteTravail() || '').trim().slice(0, 50)) + '…', 4: (S.recitVersion || {})[hh] === 'moi' ? 'ma version' : 'relu', 5: 'notes, versements, mot aux absents', 6: 'copié (contenu et travail)', 7: '' };
  const QUOI = { 1: 'Prenez vos agendas pour le… — la date part au tableau, dans le cahier de textes. Choisis-la, ou dis « sans échéance ».', 2: dr_finQuoi(restantes, rangee), 3: 'Ce que les élèves auront à faire. Déjà là : ce que la trame prévoyait, les notions cochées, l\'activité à finir à la maison si tu l\'as décidé. Ajoute ce que tu veux, ou dis qu\'il n\'y a rien d\'autre.', 4: 'Parcours le récit une fois (dans le cahier, onglet Contenus, ou dans la relecture) ; l\'étape se coche quand tu as atteint le bout du récit final, ou d\'un clic.', 5: 'Les notes à garder, ce qui se verse dans la trame, le mot aux absents.', 6: 'Copie, puis colle dans École Directe : d\'abord le contenu de séance, puis le travail à faire.', 7: 'Relis ce qui manque encore (la liste des étapes, en dessous), puis clos l\'heure.' };
  const corps = {};
  corps[1] = `${out(echLabel)}<div style="margin-top:6px"><button class="btn" id="f-sans-ech" title="Pas d\'échéance donnée : le cahier dira « la prochaine fois »">Sans échéance</button></div>`;
  corps[2] = `${out(h3prevu)}${out(rangee)}`;
  corps[3] = `${out(travail)}<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="f-rien" title="Rien à faire pour la prochaine fois : l\'étape est faite, en connaissance de cause">${(S.rienProchaine || {})[hh] ? '✔ rien pour la prochaine fois' : 'Rien d\'autre pour la prochaine fois'}</button><button class="btn" id="f-vers-travail" title="Va au champ du travail à faire, dans la diapo du cahier">Écrire dans le cahier ▸</button></div>`;
  const recitFinal = !!S.close || (ecran().role === 'fin' && !S.preparation) || dr_nowCase() >= heureCahier() + 5 * 60000; /* E2 : l'heure finie, le récit est final (relecteur neuf n°2 : « il est 09:53 : le récit se complète » après la fin) */ corps[4] = `${recitFinal ? '' : `<div class="pp-attente">Il est ${hhmm()} : <b>le récit se complète jusqu\'à la fin de l\'heure</b> — ce que tu lis maintenant n\'est pas encore ce qui partira. Tu peux le lire et le retoucher (ma version), l\'étape ne se cochera qu\'une fois l\'heure jouée et le récit relu à la fin.</div>`}<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="f-vers-recit" title="Va au récit dans la diapo du cahier">Lire dans le cahier ▸</button><button class="btn" id="f-relu" ${recitFinal ? '' : 'disabled '}title="${recitFinal ? 'Tu l\'as relu : l\'étape est faite' : 'À relire à la fin de l\'heure : le récit n\'est pas fini'}">${et && E[3].ok ? '✔ relu' : (recitFinal ? 'Relu' : 'Relu (à la fin de l\'heure)')}</button></div>`;
  corps[5] = cloture ? out(avant) : '<div class="sous">(à la clôture)</div>';
  corps[6] = `<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="f-copie-contenu" title="Copie le récit pour le coller dans École Directe">${S.copieED && S.copieED[hh] && S.copieED[hh].contenu ? '✔ contenu copié' : 'Copier le contenu de séance'}</button><button class="btn" id="f-copie-travail" title="Copie le travail à faire en entier pour le coller dans École Directe">${S.copieED && S.copieED[hh] && S.copieED[hh].travail ? '✔ travail copié' : 'Copier le travail à faire'}</button><span id="f-copie-etat" style="color:var(--texte2);font-size:.85rem"></span></div>`;
  corps[7] = out(barre);
  const tete = `<div class="pp-tete"><b>${dr_palierTete()}${S.preparation ? 'Préparer le cahier de textes' : 'Fin de l\'heure'} — étape ${n} sur 7 : ${TITRES[n]}</b><span style="display:flex;gap:6px">${S.preparation ? '<button class="btn or" id="f-montrer" title="La classe passe sur la diapo du cahier de textes et le tableau se dégèle : vous faites le cahier ensemble. Ta préparation est gardée.">Montrer le cahier à la classe</button><button class="btn" id="f-revenir" title="Te ramène à la diapo où la classe est restée, et dégèle le tableau : la classe continue là où elle était. Ta préparation est gardée.">Retour au cours</button>' : '<button class="btn" id="f-preparer" title="Gèle le tableau sur la diapo en cours (la classe la garde sous les yeux), t\'emmène à la diapo du cahier de textes et ouvre la préparation : tu prépares tout pendant que la classe travaille">❄ Préparer le cahier</button><button class="btn" id="f-reprendre" title="Replie la séquence : la classe continue, rien ne change au tableau ; tes choix restent. « Fin de l\'heure » la rouvre.">Plus tard</button>'}</span></div>` + dr_phraseLigne();   /* §12.29 (2) S2 : deux boutons au plus, toujours au même endroit ; §12.30 : la phrase de l'activité en cours sous la tête */
  const fil = `<div class="pp-fil">${E.map(e => `<span class="${e.ok ? 'dr-ok' : ''}${e.n === n ? ' ici' : ''}"></span>`).join('')}</div>`;
  const etape = `<div class="sec ouverte${et && et.ok ? ' faite' : ''}" data-sec="${n}"><div class="pp-quoi">${QUOI[n]}</div>${corps[n]}</div>`;
  const nav = `<div class="pp-nav"><span><button class="btn" id="f-precedente" ${n <= 1 ? 'disabled ' : ''}title="L\'étape précédente">◀ Étape précédente</button></span><button class="btn${n >= 7 ? '' : ' or'}${et && !et.ok && !et.facultatif ? ' grise' : ''}" id="f-suivante" data-fleche="${Math.min(7, n + 1)}" ${n >= 7 ? 'disabled ' : ''}title="${n >= 7 ? 'C\'est la dernière étape : clos l\'heure ici' : et && !et.ok ? 'L\'étape en cours n\'est pas faite — tu peux quand même passer à la suivante' : 'L\'étape suivante'}">Étape suivante ▶${n < 7 ? ' (' + TITRES[n + 1] + ')' : ''}</button></div>`;
  const liste = `<div class="pp-liste" title="La liste de contrôle : elle se coche toute seule ; un clic sur une ligne ouvre l\'étape">${E.map(e => `<div class="sec${e.n === n ? ' ouverte' : ''}${e.ok ? ' faite' : ''}" data-sec="${e.n}"><span class="ctl-l${e.ok ? ' dr-ok' : ''}${ctl.prochaine && ctl.prochaine.n === e.n ? ' ici' : ''}" data-ctl="${e.n}" data-ouvre="${e.n}">${e.ok ? '✔' : (e.n === n ? '▶' : '○')} ${e.n} · ${dr_esc(e.lib)}${e.facultatif ? ' <i>(facultatif)</i>' : ''}${e.n === 4 && !e.ok && (S.recitAChange || {})[hh] ? ' — <i>le récit a changé depuis : à relire</i>' : (e.n === 4 && !e.ok && !recitFinal ? ' — <i>à relire à la fin de l\'heure</i>' : '')}${e.ok && e.n !== n && resume[e.n] ? '<span class="okr">' + resume[e.n] + '</span>' : ''}</span></div>`).join('')}<div style="margin-top:6px;color:var(--sourd);font-size:.75rem">${nbF} étape${nbF > 1 ? 's' : ''} faite${nbF > 1 ? 's' : ''} sur 7${ctl.prochaine ? /* E2 (réveil n°3) : sept étapes (C1 7) — avant : « sur 6 » */ ' — c\'est là que tu en es : ' + ctl.prochaine.n : ''}</div></div>`;
  return `<div class="dr-seq">${tete}<div class="dr-pp"><div>${fil}${etape}${nav}</div>${liste}</div></div>`; }

function allerAuCahier(onglet){ const i = ordreHeure(S.heure).find(k => seance().ecrans[k].role === 'fin'); if (i == null) return; S.finVue = onglet; if (S.di !== i) { if (S.gel || S.preparation) { S._parGardeCahier = true; S.di = i; S.page = null; S._parGardeCahier = false; dr_tout(); } else aller(i); } else dr_tout(); setTimeout(() => { const c = document.querySelector(onglet === 'travail' ? '#mur #ed-edit' : '#mur .ed-recit'); if (c && onglet === 'travail') c.focus(); }, 80); }

function copierTexte(txt, ok){ const dire = m => { const z = $('f-copie-etat') || $('r-copie-etat'); if (z) z.textContent = m; }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => dire(ok)).catch(() => dire('copie impossible ici')); else dire('copie impossible ici'); }

function manquesAvantDeClore(restantes){ return controleCahier(restantes).etapes.filter(e => !e.ok && e.n < 7); }

/* §12.28 (8), 13 · 46 — LE compte de « ce qui reste » pour l'heure en cours, un seul : celui de l'étape 2 de « Fin de l'heure ». Rend une ligne par activité
   (et par diapo sans activité, `dr_activitesOuDiapos`) qui a encore des diapos de cette heure (ou glissées vers elle) pas finies :
   `{ a, diapos (rangs pas finis), restantes, dur (min prévues des diapos pas finies), commencee, decision, decidee }` — `decidee` = Paul a choisi (une décision
   posée par défaut, « à l'heure suivante (si tu ne choisis rien) », ne compte pas). La garde du cahier (E1, `gardeCahier`) lit `dr_resteHeure().filter(x => !x.decidee)`. */
/* ㊳ (C16, mandat de la fin d'heure §3.1-3.2 ; Paul, 23:11 : « elle liste les diapos non faites de l'activité en cours, puis après les activités suivantes
   entières ») — LA FIN D'HEURE COMPTE EN DIAPOS. Une LIGNE par chose à décider, dans l'ordre de l'heure (`ordreHeure`) :
   - chaque diapo non faite (`finie` faux) d'une activité commencée, une par ligne, avec son titre ;
   - chaque activité pas commencée, en une seule ligne (son titre, son nombre de diapos) ;
   - chaque diapo sans activité, « Le bilan » et toute diapo à rôle comprises, sur sa ligne, à sa place — jamais « Fin d'heure » ni la réactivation.
   Une ligne : `{ a: { id, num, titre, diapos, pseudo, actId }, cle, ecrire, kind, diapos (rangs pas finis), restantes, dur, commencee, decision, decidee }`.
   `cle` (= `a.id`) : la clé qu'écrit un choix fait SUR la ligne (l'`eid` d'une diapo, l'`actId` d'une activité) ; `ecrire` : la clé qu'écrit le bouton du haut
   (une diapo d'activité : son activité — une décision pour toutes, que chaque diapo peut ensuite changer seule ; `decisionDe` préfère celle de la diapo).
   `decision` : la décision DE CETTE HEURE commune à ses diapos ; `decidee` : chaque diapo a une décision de cette heure, choisie par Paul (le défaut
   « à l'heure suivante » ne compte pas ; à la dernière heure, une réserve retirée en classe attend sa décision de fin de séance, 7.5). */
function dr_decCetteHeure(d){ return d && (d.heure == null || +d.heure === +S.heure) ? d : null; }
/* la clé qu'écrit le bouton du haut (ou le défaut) pour une diapo : la sienne si elle a déjà sa propre décision (même d'une heure d'avant : elle prime, `decisionDe`), sinon celle de sa ligne (`ecrire`) */
function dr_finCleDe(e, x){ return (e && e.eid != null && (S.decisions || {})[e.eid]) ? e.eid : x.ecrire; }
function dr_finSansDecision(d, derniere){ return !d || !!d.defaut || !!(derniere && d.choix === 'reserve' && d.moment === 'classe'); }
function dr_resteHeure(acts, derniere){
  const E = seance().ecrans; if (derniere == null) derniere = S.heure >= ((dr_heureJouee(S.heure) || {}).sur || 1);
  const montree = i => !!vuMax[K(i)] || J.some(x => x.type === 'diapo' && x.di === i);
  const garde = i => { const e = E[i]; if (!e || e.role === 'fin' || e.role === 'reactivation' || (typeof dr_masqueeCachee === 'function' && dr_masqueeCachee(e)) || finie(e, i)) return false; const d = decisionDe(e); return !(d && d.choix === 'passee'); };
  const lignes = [], parAct = {};
  ordreHeure(S.heure).filter(garde).forEach(i => { const e = E[i]; const a = actDe(e);
    if (a && !(a.diapos || []).some(montree)) { let L = parAct[a.id]; if (!L) { L = parAct[a.id] = { a: { id: a.id, num: a.num, titre: a.titre || '', diapos: a.diapos, actId: a.id }, cle: a.id, ecrire: a.id, kind: 'activite', diapos: [] }; lignes.push(L); } L.diapos.push(i); return; }
    lignes.push({ a: { id: e.eid, num: rangDe(i, S.heure) || (i + 1), titre: e.act || '', diapos: [i], pseudo: true, actId: a ? a.id : null }, cle: e.eid, ecrire: a ? a.id : e.eid, kind: 'diapo', actNum: a ? a.num : null, diapos: [i] }); });
  return lignes.map(x => { const ds = x.diapos.map(i => dr_decCetteHeure(decisionDe(E[i]))); const d0 = ds[0] || null; const commune = d0 && ds.every(d => d && d.choix === d0.choix) ? d0 : null;
    return Object.assign(x, { restantes: x.diapos.length, dur: x.diapos.reduce((t, i) => t + (+E[i].dur || 0), 0), commencee: x.diapos.some(montree), decision: commune, decidee: ds.length > 0 && ds.every(d => !dr_finSansDecision(d, derniere)) }); });
}
/* le résumé de l'étape 2 dans la liste des sept, compté en diapos (« 9 reportées », « 8 reportées, 1 non faite ») */
function dr_finResume(restantes){ const n = {}; const E = seance().ecrans; (restantes || []).forEach(x => x.diapos.forEach(i => { const d = dr_decCetteHeure(decisionDe(E[i])); if (d) n[d.choix] = (n[d.choix] || 0) + 1; }));
  const L = { reporter: ['reportée', 'reportées'], suivante: ['à l\'heure suivante', 'à l\'heure suivante'], terminer: ['à terminer à la maison', 'à terminer à la maison'], preparer: ['à préparer à la maison', 'à préparer à la maison'], pastemps: ['à la maison', 'à la maison'], maison: ['à la maison', 'à la maison'], reserve: ['en réserve', 'en réserve'], nonfait: ['non faite', 'non faites'], passee: ['passée', 'passées'] };
  return Object.keys(n).map(c => n[c] + ' ' + (L[c] ? L[c][n[c] > 1 ? 1 : 0] : c)).join(', ') || 'rien de décidé'; }
/* la phrase du haut de l'étape 2 : elle cite les choix réellement proposés sur les lignes */
function dr_finQuoi(restantes, rangee){ if (!(restantes || []).length) return 'Tout ce qui était prévu pour cette heure a été fait.'; const vus = []; if (rangee) rangee.querySelectorAll('.dr-fl [data-c]').forEach(b => { const t = (b.textContent || '').replace(/\s*\(si tu ne choisis rien\)\s*$/, '').trim().toLowerCase(); if (t && !vus.includes(t)) vus.push(t); });
  const liste = vus.length > 1 ? vus.slice(0, -1).map(t => '« ' + t + ' »').join(', ') + ' ou « ' + vus[vus.length - 1] + ' »' : vus.map(t => '« ' + t + ' »').join('');
  return 'Ce qui était prévu pour cette heure et n\'a pas été fait, diapo par diapo. Le bouton du haut décide d\'un clic toutes celles qui n\'ont pas encore de décision' + (liste ? ' ; sur chaque ligne, tu peux choisir autre chose : ' + liste : '') + '.'; }
/* §12.29 (2) S2 : « Montrer le cahier à la classe » — le geste d'« Aller au cahier » puis « Y aller », depuis la préparation : la préparation se
   referme (le tableau se dégèle), la classe passe sur la diapo du cahier de textes, la séquence reste ouverte (journal : `cahier-montre`) */
function dr_montrerCahier(){ if (!S.preparation) return; const i = ordreHeure(S.heure).find(k => seance().ecrans[k].role === 'fin'); const n = S.finSection; revenirAuCours();
  if (i != null) { S._parGardeCahier = true; try { aller(i, true); } finally { S._parGardeCahier = false; } }
  journal('cahier-montre'); S.finSection = n || S.finSection; if (!S.enFin) ouvrirFin(true); else ouvrirFin(!!document.getElementById('f-clore')); }
function ouvrirFin(cloture){ if ((document.getElementById('fin').parentElement === document.getElementById('ecran-fin') && document.getElementById('ecran-fin').classList.contains('on')) && !S._rattrapage) return; const derniere = S.heure >= ((dr_heureJouee(S.heure) || {}).sur || 1); /* E2 : la séance a N heures (edtHeuresPour) — avant : S.heure === 2 */ const E = seance().ecrans;
  const acts = dr_activitesOuDiapos(); /* E2 : les activités, et chaque diapo sans activité comme la sienne (réveil n°3, 3 ; C1 7.0-7.1) — avant : les activités seules */
  const restantes = dr_resteHeure(acts, derniere);   /* §12.28 (8), 13 · 46 : le compte unique, exposé (la garde du cahier d'E1 le lit) */
  restantes.forEach(x => { if (derniere) return; x.diapos.forEach(i => { if (dr_decCetteHeure(decisionDe(E[i]))) return; const k = dr_finCleDe(E[i], x); S.decisions[k] = { choix: 'suivante', moment: 'fin', defaut: true, heure: S.heure, t: now() }; }); const d0 = dr_decCetteHeure(decisionDe(E[x.diapos[0]])); if (d0 && x.diapos.every(i => decisionDe(E[i]) === d0)) x.decision = d0; });   /* ㊳ (C16) : le défaut d'une heure qui n'est pas la dernière, comme avant — sur la clé du bouton du haut */
  const bilan = E.find(e => e.role === 'bilan');
  const montrees = new Set(J.filter(x => x.type === 'diapo' && x.h === S.heure).map(x => x.di)); /* E2 : les diapos montrées DANS CETTE HEURE (vu par E4 : l'heure 2 donnait à apprendre les notions de l'heure 1) — avant : tout le journal */ const notionsHeure = new Set(); E.forEach((e, i) => { if (montrees.has(i) || vuMax[K(i)]) (e.comp || []).forEach(c => notionsHeure.add(c)); (S.notionsImprevues[e.eid] || []).forEach(c => notionsHeure.add(c)); });
  if (S.travail.apprendre == null) S.travail.apprendre = [...notionsHeure].filter(id => libNotion(id) !== id && !dejaVue(id)); /* E2 : seulement les nouvelles (réveil n°3, 5) */
  const prevu = dr_travail()/* E1 : lisait DATA.travailPrevu */[S.si + '|' + S.heure] || '';
  let h = `<h2>${cloture ? 'Fin de l\'heure — ce qui n\'a pas été fait, puis clore' : 'Il reste 5 minutes'} — ${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom)} · H${S.heure}${derniere ? ' · dernière heure de la séance' : ''}</h2><div class="sous">${derniere ? 'La séance se ferme : pour ce qui reste, une décision par activité.' : 'Ce qui était prévu pour cette heure et n\'a pas été fait glisse à l\'heure suivante, sauf si tu décides autrement — une décision par activité.'} ${derniere && bilan && !(vuMax[K(E.indexOf(bilan))]) ? '<button class="btn or" id="f-bilan" title="Saute devant la classe jusqu\'au bilan de la séance">Aller au bilan</button>' : ''}</div>`;
  h += `<h3 style="color:var(--sourd);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase">Prévu pour cette heure, pas fait — <span class="debord" id="f-debord"></span></h3><div class="rangee dr-fl-liste">`;
  /* ㊳ (C16, mandat §3.2) : UN SEUL BOUTON, EN HAUT — « Reporter les n diapos non faites au début de la prochaine heure de cette classe » : il décide d'un clic
     toutes les lignes encore sans décision (à la dernière heure : « reporter », la séance reste ouverte ; sinon « à l'heure suivante » de la séance). */
  { const nT = restantes.reduce((t, x) => t + x.diapos.length, 0); const nS = restantes.filter(x => !x.decidee).reduce((t, x) => t + x.diapos.length, 0); const autres = nS < nT;
    const lib = nS === 1 ? (autres ? 'Reporter l’autre diapo non faite' : 'Reporter la diapo non faite') : 'Reporter les ' + nS + (autres ? ' autres' : '') + ' diapos non faites';
    const bulle = derniere ? 'Un clic : chaque diapo non faite encore sans décision est reportée. La séance reste ouverte : dans l’emploi du temps, la prochaine case de cette classe propose sa suite, qui commence (après la réactivation) par ces diapos, dans l’ordre du plan ; les séances suivantes glissent d’une heure. Une ligne déjà décidée ne change pas ; tu peux changer une ligne ensuite.' : 'Un clic : chaque diapo non faite encore sans décision glisse au début de l’heure suivante de cette séance (après la réactivation). L’emploi du temps ne change pas. Une ligne déjà décidée ne change pas ; tu peux changer une ligne ensuite.';
    if (nT) h += `<div class="dr-fl-tous"><button class="btn or" id="f-tous" data-n="${nS}" ${nS ? `title="${dr_esc(bulle)}"` : 'disabled title="Chaque diapo non faite a déjà sa décision : change une ligne si tu veux"'}>${nS ? lib + ' au début de la prochaine heure de cette classe' : '✔ Chaque diapo non faite a sa décision'}</button></div>`; }
  restantes.forEach(x => { const a = x.a; const d = x.decision || {}; const notions = [...new Set(x.diapos.flatMap(i => E[i].comp || []))].map(libNotion).filter(l => l && !/^[a-z0-9-]+$/.test(l)).slice(0, 4); const prevAilleurs = x.diapos.some(i => (E[i].comp || []).some(c => E.some((o, oi) => !x.diapos.includes(oi) && oi > i && (o.comp || []).includes(c))));
    const choix = derniere ? [['reporter', 'Reporter'], ['terminer', 'Terminer à la maison'], ['preparer', 'Préparer à la maison'], ['pastemps', 'À la maison, pas le temps'], ['nonfait', 'Non fait']] : [['suivante', 'À l\'heure suivante'], ['terminer', 'Terminer à la maison'], ['preparer', 'Préparer à la maison'], ['pastemps', 'À la maison, pas le temps'], ['reserve', 'En réserve'], ['nonfait', 'Non fait']];
    const enClasse = d.moment === 'classe' && !(derniere && d.choix === 'reserve'); const dur = x.dur;
    const e0 = E[x.diapos[0]]; const vu0 = vuMax[K(x.diapos[0])] || 0; const nEl = x.kind === 'diapo' ? elements(e0).length : 0;
    const etat = x.kind === 'activite' ? `${x.diapos.length} diapo${x.diapos.length > 1 ? 's' : ''} · ${dur} min · pas commencée` : `${x.commencee ? (nEl ? 'montrée, ' + vu0 + ' / ' + nEl + ' dévoilé' + (vu0 > 1 ? 's' : '') : 'montrée') : 'pas montrée'}${x.actNum != null ? ' · activité ' + dr_esc(String(x.actNum)) : (e0.role ? ' · ' + dr_esc(e0.role === 'bilan' ? 'bilan de la séance' : 'diapo du site') : ' · sans activité')} · ${dur} min`;
    const cle = dr_cleFichiersDe(x.diapos); const sort = ['pastemps', 'nonfait', 'reserve'].includes(d.choix);
    h += `<div class="dr-fl" data-cle="${dr_esc(String(x.cle))}" data-kind="${x.kind}" data-n="${x.diapos.length}"><div class="dr-fl-t"><b>${x.kind === 'activite' ? 'Activité' : 'Diapo'} ${dr_esc(String(a.num))} — ${dr_esc(a.titre)}</b> <span class="dr-fl-e">· ${etat}${enClasse ? ' · retirée en classe à ' + d.h + ' : ' + libDecision(d) : (d.moment === 'classe' && d.choix === 'reserve' ? ' · était en réserve : la séance se ferme, décide' : '')}</span></div>${dr_cleAlerteHtml(cle, 'à la maison')}<div class="dec" ${enClasse ? 'style="opacity:.4;pointer-events:none"' : ''}>${choix.filter(c => !(c[0] === 'terminer' && !x.commencee) && !(c[0] === 'preparer' && x.commencee)).map(c => `<button class="btn ${x.decision && d.choix === c[0] ? 'on' : ''}" data-c="${c[0]}"${DR_CLE_MAISON.includes(c[0]) && cle.length ? ' disabled' : ''} title="${DR_CLE_MAISON.includes(c[0]) && cle.length ? dr_esc(dr_cleMaisonPourquoi(x.diapos)) + ' — ' : ''}${x.kind === 'activite' ? 'Pour toute l’activité (ses ' + x.diapos.length + ' diapo' + (x.diapos.length > 1 ? 's' : '') + ') : ' : 'Pour cette diapo seule : '}${({ suivante: 'elle glisse à l\'heure suivante, après la réactivation', terminer: 'commencée : l\'élève la termine chez lui, on la reprend en classe (même à l\'oral)', preparer: 'pas commencée : l\'élève la prépare chez lui, on la reprend en classe', pastemps: 'pas commencée : elle sort du programme, fléchée « pas le temps »', reserve: 'pour ceux qui ont fini, pendant la séance', nonfait: 'avec un motif, pour toi', reporter: 'elle est reportée au début de la prochaine heure de cette classe : la séance reste ouverte' })[c[0]]}${['pastemps', 'nonfait', 'reserve'].includes(c[0]) && notions.length ? ' — ces notions ne seraient pas travaillées en classe : ' + dr_esc(notions.join(' · ')) : ''}${d.choix === c[0] && d.defaut ? ' — c\'est le choix posé tant que tu n\'en fais pas un autre' : ''}">${c[1]}${d.choix === c[0] && d.defaut ? ' (si tu ne choisis rien)' : ''}</button>`).join('')}</div>${sort && notions.length ? `<div class="cout">Ces notions ne seront pas travaillées en classe : ${notions.map(dr_esc).join(' · ')} — <b>${prevAilleurs ? 'prévu plus loin dans le chapitre' : 'pas prévu ailleurs'}</b></div>` : ''}${d.choix === 'nonfait' && x.decision && S.decisions[x.cle] === x.decision ? `<div class="cout">motif : <input type="text" data-motif="${dr_esc(String(x.cle))}" value="${dr_esc(d.motif || '')}" placeholder="pour toi" style="width:60%"></div>` : ''}</div>`; });
  if (!restantes.length) h += '<div style="color:var(--texte2)">tout ce qui était prévu pour cette heure a été fait.</div>';   /* ㊳ : la trame sans activités a ses lignes, diapo par diapo — la phrase d'avant (« n diapos … continuent ») n'a plus lieu d'être */
  h += `</div>`;
  h += `<div class="travail"><h3 style="margin-top:0">Travail à faire pour la prochaine fois</h3>`;
  /* E2 (réveil n°6, E4 lignes 122 et 134) : les décisions elles-mêmes, comme le travail à faire (`texteTravail`) les lit — avant : seulement ce qui restait dans l'heure (« rien pour la prochaine fois » avec une activité à la maison), et le numéro sans le titre (« activité 6 · ») */
  const decDe = cs => Object.keys(S.decisions || {}).filter(k => { const d = S.decisions[k] || {}; return cs.includes(d.choix) && (!d.heure || d.heure === S.heure); }); const nomDec = k => '<b>' + dr_esc((objetDec(k) || {}).titre || 'diapo') + '</b>';
  const term = decDe(['terminer']), prep = decDe(['preparer']), mais = decDe(['pastemps', 'maison']);
  h += `<div style="color:var(--texte2)">${term.length ? 'terminer : ' + term.map(nomDec).join(', ') + ' (reprise en classe) · ' : ''}${prep.length ? 'préparer : ' + prep.map(nomDec).join(', ') + ' (reprise en classe) · ' : ''}${mais.length ? 'à faire : ' + mais.map(nomDec).join(', ') + ' · ' : ''}${!term.length && !prep.length && !mais.length ? 'rien choisi au-dessus pour la maison.' : ''}</div>`;
  h += `<label><input type="checkbox" id="f-prevu" ${S.travail.prevu && prevu ? 'checked' : ''} ${prevu ? '' : 'disabled'}> Ce que la trame prévoyait pour cette heure : <i>${dr_esc(prevu || 'rien de prévu')}</i></label>`;
  h += `<div class="taxo"><label><b>Apprendre les notions de l'heure</b> <button class="btn" id="f-nouvelles" style="padding:1px 7px;font-size:.8rem" title="Décoche les notions déjà rencontrées plus tôt dans le chapitre (dans la maquette : d'après la trame, pas d'après ce que la classe a vu)">seulement les nouvelles</button></label>${taxoHtml(notionsHeure)}</div>`;
  h += `<label>Autre travail : <input type="text" id="f-libre" value="${dr_esc(S.travail.libre)}" placeholder="un travail spécifique, dans tes mots" style="width:70%"></label>`;
  if (S.echeance == null && !S.echeanceChoisie) { const p0 = ((dr_classe() || {}).prochaines || [])[0]; if (p0) { S.echeance = p0.iso; S.echeanceAuto = true; } }   /* réveil n°8 (C1 7.6) : la prochaine heure de la classe est affichée ET posée par défaut — « aucune » est un choix ; avant : « aucune » affiché, la phrase disait le contraire */
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

  const fpr = $('f-preparer'); if (fpr) fpr.onclick = preparerCahier; const frv = $('f-revenir'); if (frv) frv.onclick = revenirAuCours; const fmtr = $('f-montrer'); if (fmtr) fmtr.onclick = dr_montrerCahier;
  const frn = $('f-rien'); if (frn) frn.onclick = () => { S.rienProchaine = S.rienProchaine || {}; S.rienProchaine[S.heure] = !S.rienProchaine[S.heure]; journal('rien-prochaine-fois', { h: S.heure, valeur: S.rienProchaine[S.heure] }); ouvrirFin(cloture); };
  const fvt = $('f-vers-travail'); if (fvt) fvt.onclick = () => { allerAuCahier('travail'); }; const fvr = $('f-vers-recit'); if (fvr) fvr.onclick = () => { allerAuCahier('contenu'); };
  const frl = $('f-relu'); if (frl) frl.onclick = () => { S.recitRelu = S.recitRelu || {}; S.recitRelu[S.heure] = true; journal('recit-relu', { h: S.heure, par: 'clic' }); ouvrirFin(cloture); };
  const fcc = $('f-copie-contenu'); if (fcc) fcc.onclick = () => { S.copieED = S.copieED || {}; S.copieED[S.heure] = Object.assign(S.copieED[S.heure] || {}, { t: now(), contenu: true }); journal('copie-ed', { quoi: 'contenu' }); const dire = m => { const z = $('f-copie-etat'); if (z) z.textContent = m; }; const d = document.createElement('div'); let html0 = ''; try { d.innerHTML = recitHtml(now(), S.heure); const rec0 = d.querySelector('.recit'), tete = d.querySelector('.dr-recit-tete'); if (rec0 && typeof dr_recitContenuED === 'function') html0 = (tete ? tete.innerHTML : '') + dr_recitContenuED(rec0); } catch (e) {} if (!html0) html0 = recitPourED(S.heure);
    if (typeof dr_recitCopierED === 'function') dr_recitCopierED(html0, null, 'copié : le contenu de séance', dire); else { d.innerHTML = html0; copierTexte(d.innerText, 'copié : le contenu de séance'); } ouvrirFin(cloture); }; /* E2 (réveil n°5, A4-1) : le même contenu que la copie de la Relecture (son entête, `dr_recitContenuED`), et le texte simple composé par l'outil d'E4 (ses paragraphes) — avant : `textContent`, les paragraphes collés sans retour */
  const fct = $('f-copie-travail'); if (fct) fct.onclick = () => { S.copieED = S.copieED || {}; S.copieED[S.heure] = Object.assign(S.copieED[S.heure] || {}, { t: now(), travail: true }); journal('copie-ed', { quoi: 'travail' }); { const tx = texteTravail() || '(rien à faire)'; const dire = m => { const z = $('f-copie-etat'); if (z) z.textContent = m; }; if (typeof dr_recitCopierED === 'function') dr_recitCopierED('<p>' + dr_esc(tx).replace(/\n/g, '<br>') + '</p>', tx, 'copié : le travail à faire', dire);   /* comme la Relecture (E4) */ else copierTexte(tx, 'copié : le travail à faire'); } ouvrirFin(cloture); }; /* E2 : HTML propre + texte — avant : texte brut */

  const fmo = $('f-mot'); if (fmo) fmo.oninput = () => { S.motAbsents = fmo.value; };   /* E2 : le mot aux absents se garde à la frappe */
  const fse = $('f-sans-ech'); if (fse) fse.onclick = () => { S.echeance = null; S.echeanceChoisie = true; S.echeanceAuto = false; S.finFaites[1] = true; S.finSection = 2; edTexte(); dr_tout(); ouvrirFin(cloture); };
  const fe2 = $('f-ech'); if (fe2) fe2.addEventListener('change', () => { S.finFaites[1] = true; ouvrirFin(cloture); });
  $('droite').scrollTop = scrollAvant; $('fin').querySelectorAll('[data-finvue]').forEach(b => b.onclick = () => { S.finVue = b.dataset.finvue; journal('tableau-onglet', { onglet: S.finVue }); ouvrirFin(cloture); dr_tout(); });
  const debord = () => { const min = restantes.filter(x => x.decision && ['suivante', 'terminer', 'preparer'].includes(x.decision.choix)).reduce((t, x) => t + x.diapos.reduce((u, i) => u + E[i].dur, 0), 0); const suiv = E.filter(e => e.heure === S.heure + 1).reduce((t, e) => t + e.dur, 0); const d = suiv + min - 46; if ($('f-debord')) if ($('f-debord')) $('f-debord').textContent = derniere ? '' : (d > 0 ? `l'heure suivante dépasserait de ${d} min` : 'l\'heure suivante tient'); }; debord();
  { const ft = $('f-tous'); if (ft) ft.onclick = () => { const c = derniere ? 'reporter' : 'suivante'; const t = now(); const hm = hhmm(); const L = dr_resteHeure(acts, derniere).filter(x => !x.decidee); const poses = new Set(); let n = 0;   /* ㊳ (C16) : le bouton du haut — chaque ligne encore sans décision ; une diapo d'activité : l'activité (une décision pour toutes), sauf si l'activité a déjà une décision choisie à cette heure (alors la diapo seule) */
      L.forEach(x => x.diapos.forEach(i => { if (!dr_finSansDecision(dr_decCetteHeure(decisionDe(E[i])), derniere)) return; let k = dr_finCleDe(E[i], x); if (k !== x.cle && !dr_finSansDecision(dr_decCetteHeure(S.decisions[k]), derniere)) k = x.cle; n++; if (poses.has(k)) return; poses.add(k); S.decisions[k] = { choix: c, moment: 'fin', h: hm, heure: S.heure, t, tous: true }; }));
      journal('fin-tous', { choix: c, n }); ouvrirFin(cloture); dr_tout(); }; }
  Z.querySelectorAll('.dr-fl [data-c]').forEach(b => b.onclick = () => { const id = b.closest('.dr-fl').dataset.cle; S.decisions[id] = { choix: b.dataset.c, moment: 'fin', h: hhmm(), heure: S.heure, t: now() }   /* t : l'ordre des décisions ouvre l'heure suivante (§12.16 b) */; ouvrirFin(cloture); dr_tout(); });
  $('fin').querySelectorAll('[data-motif]').forEach(i => i.onchange = () => { S.decisions[i.dataset.motif].motif = i.value; edTexte(); });
  Z.querySelectorAll('[data-notion]').forEach(c => c.onchange = () => { const id = c.dataset.notion; const l = S.travail.apprendre; if (c.checked) { if (!l.includes(id)) l.push(id); } else { const j = l.indexOf(id); if (j >= 0) l.splice(j, 1); } ouvrirFin(cloture); });
  $('fin').querySelectorAll('[data-grp]').forEach(c => c.onchange = () => { const ids = c.dataset.grp.split(','); const l = S.travail.apprendre; ids.forEach(id => { const j = l.indexOf(id); if (c.checked) { if (j < 0) l.push(id); } else if (j >= 0) l.splice(j, 1); }); ouvrirFin(cloture); });
  const fn = $('f-nouvelles'); if (fn) fn.onclick = () => { S.travail.apprendre = S.travail.apprendre.filter(id => !dejaVue(id)); ouvrirFin(cloture); };
  const fp = $('f-prevu'); if (fp) fp.onchange = () => { S.travail.prevu = fp.checked; edTexte(); };
  if ($('f-libre')) $('f-libre').oninput = ev => { S.travail.libre = ev.target.value; edTexte(); dr_tout(); }; if ($('f-ech')) $('f-ech').onchange = ev => { S.echeance = ev.target.value || null; S.echeanceChoisie = true; S.echeanceAuto = false; edTexte(); dr_tout(); };
  const fb = $('f-bilan'); if (fb) fb.onclick = () => { $('ecran-fin').classList.remove('on'); $('droite').classList.remove('fin'); S.enFin = false; const bi = E.indexOf(bilan); S.di = bi; S.page = null; dr_tout(); journal('aller-bilan', { di: bi }); };
  const frp = $('f-reprendre'); if (frp) frp.onclick = () => { $('ecran-fin').classList.remove('on'); $('droite').classList.remove('fin'); S.enFin = false; dr_tout(); };   /* E2 : un id par bouton (relecteur neuf n°2 : deux #f-fermer) */
  const ffm = $('f-fermer'); if (ffm) ffm.onclick = () => { $('ecran-fin').classList.remove('on'); $('droite').classList.remove('fin'); S.enFin = false; dr_tout(); };
  const fc = $('f-clore'); if (fc) fc.onclick = () => { if (S.preparation) { $('gclore-corps').innerHTML = `<div class="gc-l"><span class="gc-n">❄</span><span>Tu prépares le cahier : la classe est encore sur la diapo ${rangDe(S.preparation.di)} — <b>reviens au cours</b> (« Revenir au cours »), puis clos.</span></div>`; $('garde-clore').classList.add('on'); $('gclore-oui').style.display = 'none'; $('gclore-non').textContent = 'Compris'; $('gclore-non').onclick = () => { $('garde-clore').classList.remove('on'); $('gclore-oui').style.display = ''; $('gclore-non').textContent = 'Y retourner'; }; return; } const manques = manquesAvantDeClore(restantes); if (manques.length && !S._cloreQuandMeme) { $('gclore-corps').innerHTML = manques.map(m => `<div class="gc-l"><span class="gc-n">○</span><span><b>${dr_esc(m.lib)}</b>${m.facultatif ? ' (facultatif)' : ''} — ${dr_esc(m.risque)}</span></div>`).join(''); $('garde-clore').classList.add('on'); $('gclore-non').onclick = () => { $('garde-clore').classList.remove('on'); S.finSection = manques[0].n; ouvrirFin(cloture); }; $('gclore-oui').onclick = () => { $('garde-clore').classList.remove('on'); journal('clore-quand-meme', { manques: manques.map(m => m.lib) }); S._cloreQuandMeme = true; fc.click(); S._cloreQuandMeme = false; }; $('gclore-non').focus(); return; } S.motAbsents = ($('f-mot') || {}).value || S.motAbsents || ''; /* E2 : le mot tapé à l'étape 5 est gardé (relecteur neuf n°2) */ S.mots = S.mots || {}; S.mots[S.heure] = S.motAbsents; S.travailHeure = S.travailHeure || {}; S.travailHeure[S.heure] = texteTravailED(); S.echeanceHeure = S.echeanceHeure || {}; S.echeanceHeure[S.heure] = S.echeance; S.apprendreHeure = S.apprendreHeure || {}; S.apprendreHeure[S.heure] = (S.travail && S.travail.apprendre) ? S.travail.apprendre.slice() : []; if (S.travailEdite && S.travailEdite[S.heure] != null) journal('travail-edite-final', { texte: S.travailEdite[S.heure] }); journal('cloture', { bilanAtteste: !!S.bilanCoche }); S.close = true; S.closes = S.closes || {}; S.closes[S.heure] = now(); try { dr_cloreFin(); } catch (e) {} /* E2 : H clos, finReel, cours_actif nul, le journal et l'état (atDrCloreFin) */ S.enFin = false; if (S.gel) degeler(); dr_tout(); /* le tableau passe en attente */ $('ecran-fin').classList.remove('on'); $('droite').classList.remove('fin'); dr_apresCloture(); }; /* §12.66 (3) : la clôture emmène à l'emploi du temps, avec la confirmation et « Relire l'heure » — avant : la Relecture (C1 11.2) */
  edTexte();
}

function dejaVue(id){ return dr_seances()/* E1 : lisait DATA.seances */.some((s, k) => s.ecrans.some(e => (e.comp || []).includes(id) && (k < S.si || (k === S.si && e.heure < S.heure)))); }

function taxoHtml(set){ let h = ''; dr_taxo()/* E1 : lisait DATA.taxo */.forEach(d => { const fams = d.familles.map(f => ({ f, ns: f.notions.filter(n => set.has(n.id)) })).filter(x => x.ns.length); if (!fams.length) return; const idsD = fams.flatMap(x => x.ns.map(n => n.id)); const allD = idsD.every(id => S.travail.apprendre.includes(id));
  h += `<div class="dom"><label><input type="checkbox" data-grp="${idsD.join(',')}" ${allD ? 'checked' : ''}> <b>${dr_esc(d.prof)}</b></label>`; fams.forEach(x => { const idsF = x.ns.map(n => n.id); const allF = idsF.every(id => S.travail.apprendre.includes(id)); h += `<div class="fam"><label><input type="checkbox" data-grp="${idsF.join(',')}" ${allF ? 'checked' : ''}> ${dr_esc(x.f.prof)}</label>`; x.ns.forEach(n => { h += `<div class="not"><label><input type="checkbox" data-notion="${n.id}" ${S.travail.apprendre.includes(n.id) ? 'checked' : ''}> ${dr_esc(n.eleve || n.prof)} <span class="neuve">${dejaVue(n.id) ? 'déjà rencontrée' : 'nouvelle'}</span></label></div>`; }); h += '</div>'; }); h += '</div>'; }); return h || '<div style="color:var(--sourd)">aucune notion déclarée sur les diapos jouées</div>'; }

function contenuEntier(e){ return e.blocs.map(b => { if (b.t === 'consigne') return b.txt + (b.el && b.el.length ? ' ' + b.el.map((x, i) => (i + 1) + '. ' + x).join(' ') : ''); if (b.t === 'question') return b.txt; if (b.t === 'fiche') return b.txt + (b.el && b.el[0] ? ' — ' + b.el[0] : ''); if (b.t === 'image') return b.txt + ' (image)'; if (b.t === 'schema') return 'le schéma « ' + b.txt + ' »'; if (b.t === 'video') return 'la vidéo « ' + b.txt + ' »'; return b.txt; }).join(' '); }

/* réveil n°5, A4-2 (C1 7.0 ter) : une décision prise à la fin de l'heure (provisoire tant que l'heure n'est pas close) tombe si ses diapos sont ensuite
   jouées jusqu'au bout — la copie ED, le paquet et l'étape 3 ne gardent plus « Préparer … » pour une activité faite en classe ; journal « decision-levee » */
function dr_decisionsSuivre(){ if (!S.lancee || S.close || !S.decisions) return 0; let n = 0; const E = seance().ecrans; const acts = dr_activites()[String(S.si)] || [];
  Object.keys(S.decisions).forEach(k => { const d = S.decisions[k]; if (!d || d.moment !== 'fin' || (d.heure && d.heure !== S.heure)) return; const a = acts.find(x => x.id === k); const ds = a ? a.diapos : [indexDe(k)].filter(i => i >= 0); if (!ds.length) return;
    if (ds.every(i => E[i] && finie(E[i], i))) { delete S.decisions[k]; journal('decision-levee', { act: k, choix: d.choix }); n++; } }); return n; }
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
  h += `<div style="margin-top:8px"><b>Un mot pour les absents</b> (${absents.length ? absents.map(prenomUnique).join(', ') : 'aucun'}) : <input type="text" id="f-mot" title="Un mot ajouté à la fin du message de chaque absent (facultatif)" value="${dr_esc(S.motAbsents)}" placeholder="facultatif — ajouté à la fin du mot de chacun" style="width:60%"></div>${absents.length ? dr_cleAlerteHtml(dr_cleFichiersDe(ordreHeure(S.heure).filter(i => vuMax[K(i)])), 'dans le mot de l’absent') : ''}`;   /* E1 (§12.44 (4 ter)) : l'absent ne verra pas ce qui est resté sur la clé */
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

function ouvrirOuverture(){ if (S.anim) { clearInterval(S.anim); S.anim = null; } if (!S.close) { /* 6.7 : le T-5 de l'heure non close se rattrape avant de lancer, jamais devant la classe */ S._rattrapage = true; ouvrirFin(true); return; } const h = S.heure + 1; if ($('fin').parentElement !== $('ecran-fin')) $('ecran-fin').appendChild($('fin')); $('droite').classList.remove('fin'); const sim = dr_heureDe(h)/* E1 : lisait HEURES_SIM */; const o = (S.ordres && S.ordres[h]) ? ordreHeure(h) : dr_ordreOuverture(h);   /* réveil n°8 (E4 ligne 138) : l'ouverture annonce l'ordre que le lancement jouera */ const E = seance().ecrans; const glissees = o.filter(i => glisseeDe(E[i], h)); const prevu = o.reduce((a, i) => a + E[i].dur, 0); const utileH = Math.max(0, dr_tempsUtile(((dr_heureJouee(h) || {}).debut || '08:00') + '-' + ((dr_heureJouee(h) || {}).fin || '08:51'), (dr_heureJouee(h) || {}).debut)); const debord = prevu - utileH; /* E2 — avant : 46 en dur */
  const jouees = E.filter((e, i) => vuMax[K(i)]).length; const h1 = dr_heureDe(S.heure)/* E1 : lisait HEURES_SIM */;
  const videos = E.filter((e, i) => o.includes(i) && e.blocs[0] && e.blocs[0].t === 'video'); const clefs = dr_cleFichiersDe(o).filter(x => !x.video);   /* E1 (§12.44 (4 ter)) : les images et PDF de la clé, même garde */ const etC = v => (typeof dr_cleEtatFichier === 'function') ? dr_cleEtatFichier(v.blocs[0].fichier || '') : { ok: false, texte: '✘' };   /* E1 (§12.44, 4b.4) : la garde vérifie pour de vrai, fichier par fichier */
  let x = `<h2>Où en est la ${dr_esc(dr_classe()/* E1 : lisait DATA.classe */.nom)} — ${dr_esc(sim.jour)}, ${sim.debut}-${sim.fin} · heure ${h}${h > ((dr_heureJouee(S.heure) || {}).sur || 1) ? ' · suite de la séance' : ' sur ' + ((dr_heureJouee(S.heure) || {}).sur || 1)}</h2><div class="sous">${dr_esc(seance().titre)}</div>`;
  x += `<div class="travail"><b>L'heure ${S.heure}</b> (${dr_esc(h1.jour)}, ${h1.debut}) : ${S.close ? ((S.closes || {})[S.heure] ? 'close à ' + hhmm(S.closes[S.heure]) : 'close (fermée à l\'ouverture de cette heure)') /* E1 (réveil n°8) : une heure d'un autre jour jamais close n'a pas de S.closes — « Cannot read properties of undefined » à l'ouverture */ : '<b style="color:var(--rouge)">pas close — ses décisions sont à prendre avant de lancer</b>'} · ${jouees} diapo${jouees > 1 ? 's' : ''} montrée${jouees > 1 ? 's' : ''} · ${[...new Set(S.parts.map(p => p.nom))].length} élève${S.parts.length > 1 ? 's' : ''} ayant pris la parole${S.mots && S.mots[S.heure] ? ' · mot aux absents : « ' + dr_esc(S.mots[S.heure]) + ' »' : ''}</div>`;
  x += faisceauHtml(h);
  const rp = (S.reprisesPrevues || {})[h] || []; x += `<div class="travail"><b>Ce que l'heure ${h} jouera, dans l'ordre</b> : ${rp.map(q => `<span class="puce" style="color:var(--or)">↺ reprise à l'oral de « ${dr_esc(q.lib)} » avant « ${dr_esc(q.act)} »</span>`).join('')}${dr_reactPuceHtml(h)}${o.map((i, r) => E[i].role === 'reactivation' ? dr_reactPuce(h, r + 1 + dr_reactDecal(h), E[i].act) : `<span class="puce">${r + 1 + dr_reactDecal(h)}. ${numDe(E[i]) ? 'A' + dr_esc(String(numDe(E[i]))) + ' · ' : ''}${dr_esc(E[i].act)}${glisseeDe(E[i], h) ? ' <i style="color:var(--ambre)">↩ ' + (decisionDe(E[i]).choix === 'reporter' ? 'reportée' : 'glissée') + ' de l\'heure ' + E[i].heure + (decisionDe(E[i]).choix === 'terminer' ? ', terminée à la maison — <b>à reprendre</b>' : decisionDe(E[i]).choix === 'preparer' ? ', préparée à la maison — <b>à reprendre</b>' : '') + '</i>'   /* §12.17 (b2) : fléchée « à reprendre » */ : ''}${E[i].role === 'reactivation' ? ' <i style="color:var(--ambre)">réactivation</i>' : ''}${retiree(E[i]) && decisionDe(E[i]) && decisionDe(E[i]).remob ? ' <i style="color:var(--rouge)">↪ décalée à l\'heure suivante</i>' : ''}${E[i].role === 'bilan' ? ' <i style="color:var(--ambre)">bilan de la séance</i>' : ''}</span>`).join(' ')}<div style="margin-top:8px" class="${debord > 0 ? 'debord' : ''}">${prevu} min prévues pour ${utileH} utiles${debord > 0 ? ' — l\'heure dépasserait de ' + debord + ' min : le T-5 le redira, c\'est toi qui décides' : ''}</div></div>`;
  if (videos.length || clefs.length) x += `<div class="travail" id="o-videos"><b>Les vidéos de cette heure</b> : ${videos.map(v => { const c = etC(v); return `<div class="o-video ${c.ok ? 'ok' : 'ko'}"><b>${dr_esc(v.blocs[0].txt)}</b> — ${c.ok ? dr_esc(c.texte) : '<b>' + dr_esc(c.texte) + '</b>'}</div>`; }).join('')}${clefs.map(x => { const c = dr_cleEtatFichier(x.nom); return `<div class="o-video ${c.ok ? 'ok' : 'ko'}">${DR_CLE_PDF.test(x.nom) ? '📄' : '🖼'} ${c.ok ? dr_esc(c.texte) : '<b>' + dr_esc(c.texte) + '</b>'}</div>`; }).join('')}<button class="btn" id="o-reverif" style="margin-top:6px" title="Relit pour de vrai la clé USB de l’appareil qui projette : le dossier répond-il, chaque fichier y est-il ?">Revérifier</button></div>`;
  x += dr_reactBoutonHtml(h);   /* §12.22 (c) : « Ouvrir par la réactivation » oui / non, et le réglage de la séance */
  x += `<div style="height:70px"></div><div class="barre-fin"><span style="color:var(--texte2)">Lancer ouvre l'heure ${h} sur ${dr_ouvertureSur(o, h)} ; rien n'est projeté avant.</span><span style="flex:1"></span><button class="btn" id="o-relecture" title="Ouvre la relecture de l\'heure d\'avant : le récit, ce qui s\'est passé, le papier — rien n\'est lancé">Voir la relecture de l'heure ${S.heure}</button><button class="btn or" id="o-lancer" ${S.close ? 'title="Lance l\'heure ' + h + ' : le chrono démarre, ' + dr_esc(dr_ouvertureSur(o, h).replace(/<[^>]+>/g, '')) + ' va au tableau, tout s\'enregistre pour la classe"' : 'disabled title="Clos d\'abord l\'heure précédente (Fin de l\'heure)"'}>Lancer l'heure ${h}</button></div>`;
  poserHtml($('fin'), x); $('ecran-fin').classList.add('on', 'ouverture'); brancherFaisceau(h); dr_reactBrancher(h, ouvrirOuverture);
  const rv = $('o-reverif'); if (rv) rv.onclick = () => (typeof dr_cleReverifier === 'function' ? dr_cleReverifier(() => ouvrirOuverture()) : ouvrirOuverture());   /* E1 (§12.44) : la lecture refaite, puis l'écran */ $('o-relecture').onclick = () => { $('ecran-fin').classList.remove('on', 'ouverture'); voir('relecture'); };
  $('o-lancer').onclick = () => { DECALAGE = 0; S.paliers = {}; S.t5 = false; S.palier = null; if (!S.close) return; DR_CL.react.decide[h] = true; dr_lancerSuite(h); }; } /* E2 : la classe, le créneau, le hub — avant : lancerHeure(h) seul */

/* contrat §12.16 (b) : ce que la fin de l'heure d'avant reporte revient dans l'ordre des DÉCISIONS (le socle les rend dans l'ordre de la trame) —
   d'abord celles que Paul a prises (par leur heure, sinon leur ordre d'arrivée), puis celles que la clôture a posées par défaut ; les diapos d'une
   activité restent ensemble, dans leur ordre. Le rituel (a) reste premier, le programme (c) et le cahier de textes (d) suivent (`ordreHeureCalc`, E1). */
/* ce sur quoi l'heure s'ouvre, dit tel quel (réveil n°8, E4 ligne 137 : « sur la réactivation » était un texte fixe) */
function dr_ouvertureSur(o, h){ if (h != null && dr_reactAnnoncee(h)) return 'la réactivation « ' + DR_REACT_TITRE + ' » (construite)'; const E = seance().ecrans; const e = (o || []).map(i => E[i]).find(x => x && x.role !== 'fin'); if (!e) return 'le cahier de textes'; return (e.role === 'reactivation' ? 'la réactivation « ' : '« ') + dr_esc(e.act) + ' »'; }
/* le libellé d'une diapo reportée (réveil n°9, E4 ligne 144, avec E1) : « glissée » pour « à l'heure suivante », « à reprendre » pour terminer / préparer à la maison (§12.17 b2) — pour l'aperçu de la diapo suivante (socle) */
function dr_libGlissee(e, h){ const d = glisseeDe(e, h); if (!d) return ''; return d.choix === 'terminer' ? 'terminée à la maison — à reprendre' : d.choix === 'preparer' ? 'préparée à la maison — à reprendre' : d.choix === 'reporter' ? 'reportée' : 'glissée'; }
/* réveil n°11 (E4 ligne 152 ; C1 7.0 ter) : pendant « Préparer le cahier de textes », « Où on en est » dit la diapo où la classe est gelée (pas « Fin d'heure — en cours ») ;
   le volet réduit à ses numéros est dans dr.css (bloc E2, `#corps.prep`) */
function dr_ouPreparation(){ try { if (S.preparation && S.preparation.di != null) { const e = seance().ecrans[S.preparation.di]; const sp = document.querySelector('#ou > span'); const t2 = e ? e.act + ' — la classe y est (gelée pendant la préparation)' : ''; if (e && sp && sp.textContent !== t2) sp.textContent = t2; } } catch (x) {} }
setTimeout(() => { ['preparerCahier', 'revenirAuCours'].forEach(nom => { const o0 = window[nom]; if (typeof o0 !== 'function' || o0.__dr) return;
  const f = function () { if (nom === 'revenirAuCours') dr_prepCahierRendre(); const r = o0.apply(this, arguments); if (nom === 'preparerCahier') dr_prepCahierVoir(); try { ouOnEnEst(); } catch (x) {} return r; }; f.__dr = true; window[nom] = f; }); }, 0);
/* réveil n°12 (E4 ligne 162 ; C1 6.4 bis, 7.0 ter) : en préparation, le cahier de textes s'affiche ENTIER chez Paul (ses quatre éléments), sans rien dévoiler à la classe —
   la classe est gelée sur sa diapo ; l'état du cahier (dévoilés, vus) est mis de côté et rendu tel quel à « Revenir au cours » */
/* réveil n°12 (E4 ligne 162) : la diapo « fin » de chaque heure porte le cahier de textes (le bloc « cahier », ses quatre éléments) — comme la maquette (`normaliserTrame` :
   blocs: [{ t: 'cahier' }]) ; celle que pose le socle (`dr_normaliserTrame`, E1) a `blocs: []` : rien à montrer, ni en préparation ni en classe. Posé en classe, dans la copie */
/* E1 (§12.38-3, registre 13 · 83 ; Paul 23:16 « les diapos de cahier de texte sont vides ») : la diapo « Cahier de textes » HORS DE LA CLASSE (l'Atelier, la répétition).
   Les DONNÉES pour le rendu d'E4 (`dr-socle.js`, `b0.t === 'cahier'`) : rien n'est écrit dans la trame (le bloc `cahier` ne s'ajoute qu'au lancement, `dr_finAvecCahier`).
   `dr_cahierHorsClasse(e)` → null en classe (heure lancée hors répétition), hors d'une diapo de fin, ou quand la diapo a déjà son bloc ; sinon
   { montrer: true, heure, date, echeanceIso, travail, qui, classe } — `date` : l'échéance, la prochaine heure de la classe de la source (§12.38 (1), `dr_sourceSeance`)
   après l'heure répétée (`dr_heureAVenir`) ; `travail` : le travail à faire prévu de l'heure (B/deroule/travail) ; `qui` : null en répétition (les élèves de la classe test,
   §12.38 (2), E4), [] dans l'Atelier (vide). E4 : `const b0 = e.blocs[0] || (dr_cahierHorsClasse(e) ? { t: 'cahier' } : null)`, et `cahier.date` / `cahier.travail` repris d'ici quand `S.echeance` / `S.travail` sont vides. */
function dr_echeanceHorsClasse(h){ try { const src = typeof dr_sourceSeance === 'function' ? dr_sourceSeance() : null; const sl = src && src.classeSlug; if (!sl || typeof edtProchainesDe !== 'function') return null;
  const hv = typeof dr_heureAVenir === 'function' ? dr_heureAVenir(h) : null; const apres = (hv && hv.base) || Date.now();
  const x = (edtProchainesDe(sl, 20) || []).find(p => { const [y, mo, d] = p.iso.split('-').map(Number); const [hh, mm] = String(p.creneau).split('-')[0].split(':').map(Number); return new Date(y, mo - 1, d, hh || 0, mm || 0).getTime() > apres; });
  return x ? { iso: x.iso, creneau: x.creneau, l: x.l } : null; } catch (e) { return null; } }
/* E1 (§12.38-3, tranché par la conscience le 28/10 02:25, E3 retour 92) : « le contenu de la séance » hors de la classe = le contenu PRÉVU de l'heure h —
   ses diapos dans l'ordre (`ordreHeure`), sans la diapo du cahier, écrites par le même rendu que le récit d'une heure jouée (`recitPourED0` → `recitHtml0`), comme si
   toutes étaient jouées et entièrement dévoilées. Un journal fictif le temps de l'écriture (J est remis tel quel aussitôt, rien n'est journalisé ni écrit) ; rend le HTML
   des paragraphes, comme `recitPourED`. */
function dr_contenuPrevuHeure(h){ if (typeof recitPourED0 !== 'function') return ''; const sauve = J.slice(); try {
  const E = seance().ecrans; const T0 = (dr_heureAVenir(h) || {}).base || now(); const o = ordreHeure(h).filter(i => E[i] && E[i].role !== 'fin');
  J.length = 0; J.push({ t: T0, h, type: 'lancement', heure: h }); let t = T0;
  o.forEach(di => { t += 60000; J.push({ t, h, type: 'diapo', si: S.si, di, eid: E[di].eid }); const n = elements(E[di]).length; for (let k = 0; k < n; k++) J.push({ t: t + k + 1, h, type: 'devoile', si: S.si, di, k }); });
  return recitPourED0(h) || ''; } catch (x) { return ''; } finally { J.length = 0; sauve.forEach(x => J.push(x)); } }
function dr_cahierHorsClasse(e){ try { if (!e || e.role !== 'fin') return null; if (S.lancee && !S.repetition) return null; if ((e.blocs || []).some(b => b && b.t === 'cahier')) return null;
  const h = +e.heure || S.heure || 1; const ech = dr_echeanceHorsClasse(h); const src = typeof dr_sourceSeance === 'function' ? dr_sourceSeance() : null;
  const tv = (typeof dr_travail === 'function' ? dr_travail() : {})[S.si + '|' + h] || '';
  return { montrer: true, heure: h, date: ech ? ech.l : null, echeanceIso: ech ? ech.iso : null, travail: tv, qui: S.repetition ? null : [], classe: src ? src.classeNom : '', contenu: dr_contenuPrevuHeure(h) }; } catch (x) { return null; } }   /* `contenu` (02:25) : pour l'onglet « Contenus de séances » (E4) */
/* E1 (§12.44 (4 ter), Paul 28/10 07:29 et 08:01, « Ok » aux points 758 et 762) : PAR DÉFAUT TOUT RESTE SUR LA CLÉ, L'ALERTE SE TAIT. Elle ne parle que pour une
   image ou un PDF de la clé donné « à la maison » (les boutons « Terminer / Préparer à la maison », « À la maison, pas le temps » sont grisés et disent pourquoi) ou au
   mot de l'absent — avec « ⇪ Déposer en ligne » à portée (le relais d'E4, `mjpcDeposerEnLigne` : rien n'est refait ici). Déposé, le bloc prend l'adresse en ligne (`ref`)
   et l'alerte se tait. Chez Paul seulement : ces écrans ne sont jamais chez l'élève. */
const DR_CLE_MAISON = ['terminer', 'preparer', 'pastemps', 'maison'];
function dr_cleFichiersDe(indices){ const E = seance().ecrans, out = []; (indices || []).forEach(i => ((E[i] && E[i].blocs) || []).forEach((b, bi) => { if (!b || !b.fichier) return; if (b.t === 'video' && !out.some(x => x.nom === b.fichier)) out.push({ nom: b.fichier, i, bi, video: true }); if (b.t === 'image' && !b.ref && !out.some(x => x.nom === b.fichier)) out.push({ nom: b.fichier, i, bi }); })); return out.filter(x => !x.video || indices === null); }
function dr_cleMaisonPourquoi(indices){ const l = dr_cleFichiersDe(indices); return l.map(x => '« ' + x.nom + ' »').join(', ') + (l.length > 1 ? ' sont' : ' est') + ' sur la clé : à la maison, l’élève ne l’aura pas — dépose-' + (l.length > 1 ? 'les' : 'le') + ' en ligne, puis choisis'; }
function dr_cleAlerteHtml(l, ou){ if (!l || !l.length) return ''; return `<div class="dr-cle-alerte" style="margin:6px 0;padding:6px 10px;border-left:3px solid var(--ambre,#c9a04a);background:rgba(201,160,74,.12)">⚠ ${l.map(x => '« ' + dr_esc(x.nom) + ' »').join(', ')} ${l.length > 1 ? 'sont' : 'est'} sur la clé : ${dr_esc(ou)}, l’élève ne l’aura pas. ${l.map(x => `<button class="btn" data-cle-depot="${dr_esc(x.nom)}" title="Met « ${dr_esc(x.nom)} » en ligne (mjpc-medias) par le relais : la diapo prend son adresse en ligne, l’élève l’aura à la maison">⇪ Déposer en ligne « ${dr_esc(x.nom)} »</button>`).join(' ')}</div>`; }
document.addEventListener('click', async ev => { const bt = ev.target && ev.target.closest && ev.target.closest('[data-cle-depot]'); if (!bt) return; ev.preventDefault(); ev.stopPropagation(); const nom = bt.dataset.cleDepot; const dire = t => { bt.textContent = t; };
  if (typeof mjpcDeposerEnLigne !== 'function') { dire('⚠ Le dépôt en ligne n’est pas disponible ici.'); return; }
  let f = null; try { f = DR_CLE.memo && DR_CLE.memo[nom] ? DR_CLE.memo[nom] : (dr_cleVoitIci(nom) ? await (await DR_CLE.h.getFileHandle(nom)).getFile() : null); } catch (e) { f = null; }
  if (!f) { dire('⚠ « ' + nom + ' » n’est pas sur la clé de cet ordi — dépose-le depuis l’ordi où la clé est branchée.'); return; }
  bt.disabled = true; dire('⏳ Dépôt en ligne de « ' + nom + ' »…');
  mjpcDeposerEnLigne([f], (dr_ctx() || {}).level || 'divers').then(l => { const d = l[0]; const E = seance().ecrans; E.forEach((e, i) => (e.blocs || []).forEach((b, bi) => { if (b && b.t === 'image' && b.fichier === nom && !b.ref) { b.ref = dr_mediasAdresse(d.chemin); try { marquerModif({ di: i, bi, ref: 'en ligne' }); } catch (x) {} } }));
    dire('✔ En ligne : ' + d.chemin); try { if (document.querySelector('#ecran-fin.on')) ouvrirFin(!!S._rattrapage); } catch (x) {} try { dr_tout(); } catch (x) {} })
    .catch(er => { bt.disabled = false; dire('⚠ ' + er.message); }); }, true);
function dr_finAvecCahier(){ try { let n = 0; seance().ecrans.forEach(e => { if (e && e.role === 'fin' && !(e.blocs || []).some(b => b && b.t === 'cahier')) { e.blocs = (e.blocs || []).concat([{ t: 'cahier' }]); n++; } }); return n; } catch (x) { return 0; } }
function dr_prepCahierVoir(){ try { if (!S.preparation) return; const e = ecran(); if (!e || e.role !== 'fin') return; const k = K(S.di); const d = etatDiapo(); S._prepCahier = { k, nDev: d.nDev, vu: vuMax[k] }; d.nDev = elements(e).length; dr_tout(); } catch (x) {} }
function dr_prepCahierRendre(){ try { const p = S._prepCahier; if (!p) return; S._prepCahier = null; if (parDiapo[p.k]) parDiapo[p.k].nDev = p.nDev; if (p.vu == null) delete vuMax[p.k]; else vuMax[p.k] = p.vu; } catch (x) {} }   /* « Où on en est » se redit tout de suite en entrant et en sortant de la préparation */
/* contrat §12.18 (réveil n°13, E4 ligne 172, avec E1) : les heures de la séance pour une classe, telles que l'EDT les voit — une heure jouée porte sa date (« jouée »),
   une heure à venir la date de sa prochaine case de la classe à l'EDT ; même numéro que « Lancer … heure n/N ». Rend [{ n, iso, creneau, l, jouee }] — pour l'entête de l'Atelier (E1). */
function dr_jourCreneauEnClair(iso, creneau){ const d = new Date(iso + 'T12:00:00'); return DR_JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + DR_MOIS[d.getMonth()] + ', ' + String(creneau).split('-')[0].replace(':', ' h '); }   /* comme `edtProchainesDe` */
function dr_joueeIci(H, clos){ if (!H) return; DR_CL.joueesIci = DR_CL.joueesIci || {}; DR_CL.joueesIci[H] = !!(clos || DR_CL.joueesIci[H]);
  try { const m = /^\/site\/([^/]+)\/chapitres\/([^/]+)\/seances\/([^/]+)\/deroule_joue\/([^/]+)\/heures\/([^/]+)$/.exec(H); if (!m || typeof EDT_CHAP === 'undefined' || !EDT_CHAP[m[1]]) return;   /* réveil n°16 (E4 ligne 182, §12.19) : la projection de l'EDT (la source unique) apprend l'heure jouée dans la page — sans elle, la case finie se disait « passée » et la séance comptait quatre heures ; `EDT_CHAP` est une lecture du hub pour l'affichage, jamais réécrite (l'EDT le relit à son ouverture) */
    const ch = EDT_CHAP[m[1]].find(c => c && c.__cle === m[2]); const se = ch && edtListe(ch.seances).find(s => s && s.__i === m[3]); if (!se) return;
    const dj = se.deroule_joue = se.deroule_joue || {}; const b = dj[m[4]] = dj[m[4]] || { classe: dr_nomClasse(m[4]), heures: {} }; b.heures = b.heures || {}; const x = b.heures[m[5]] = b.heures[m[5]] || { classe: b.classe }; if (DR_CL.joueesIci[H]) x.clos = true; } catch (e) {} }
function dr_heuresDeLaClasse(slug){ try { slug = slug || dr_classeProposee(); const nom = dr_nomClasse(slug); const ec = AT.edChap, sce = chapitresData[ec.level][ec.chnum].seances[ATVUES.snum]; const out = [];
    const vues = {}; const pousser = (k, clos) => { const m = /^(\d{4}-\d\d-\d\d)_(\d\d)h(\d\d)-(\d\d)h(\d\d)/.exec(k); if (!m) return; const x = vues[m[1] + m[2] + m[3]]; if (x) { x.clos = x.clos || clos; return; } out.push(vues[m[1] + m[2] + m[3]] = { iso: m[1], creneau: m[2] + ':' + m[3] + '-' + m[4] + ':' + m[5], jouee: true, clos }); };
    Object.keys(sce.deroule_joue || {}).forEach(sl => { const b = sce.deroule_joue[sl]; if (!b || !(sl === slug || b.classe === nom)) return; Object.keys(b.heures || {}).forEach(k => pousser(k, !!(b.heures[k] || {}).clos)); });
    try { const pre = dr_cheminB() + '/deroule_joue/' + slug + '/heures/'; Object.keys(DR_CL.joueesIci || {}).forEach(H => { if (H.startsWith(pre)) pousser(H.slice(pre.length), DR_CL.joueesIci[H]); }); } catch (e) {}   /* réveil n°16 (E4 ligne 178) : l'heure lancée ou close dans cette page est jouée tout de suite — la copie de la séance en page ne l'a qu'après un rechargement */
    out.sort((a, b) => (a.iso + a.creneau).localeCompare(b.iso + b.creneau)); let N = 1; try { N = edtHeuresPour(sce, null) || 1; } catch (e) {}
    const auj = new Date(); const iso0 = auj.getFullYear() + '-' + String(auj.getMonth() + 1).padStart(2, '0') + '-' + String(auj.getDate()).padStart(2, '0'); const titre = sce.title || sce.titre || '';
    let cs = []; try { cs = Object.values(edtProjeter(iso0, 21) || {}).filter(c => c && c.classeMjpc === nom && c.nature === 'prevu' && (c.snum != null ? dr_estCetteSeance(c.chCle, c.snum) : c.titre === titre)).sort((a, b) => (a.iso + a.creneau).localeCompare(b.iso + b.creneau)); } catch (e) {}   /* les cases de CETTE séance pour cette classe, avec leur heure n/N : la même projection que l'EDT */
    cs.forEach(c => { if (vues[c.iso + String(c.creneau).slice(0, 2) + String(c.creneau).slice(3, 5)]) return;   /* réveil n°16 (B17) : une heure jouée dans cette page que la projection croit encore à venir n'est pas deux fois */ out.push({ iso: c.iso, creneau: c.creneau, l: (typeof edtJourEnClair === 'function' ? edtJourEnClair(c.iso) : c.iso) + ', ' + c.creneau, jouee: false, nEdt: c.heure, surEdt: c.sur }); });
    return out.map((x, k) => Object.assign({ n: x.nEdt || (k + 1), sur: x.surEdt || Math.max(N, out.length) }, x)); } catch (e) { return []; } }
function dr_ordreOuverture(h){ let o = ordreHeureCalc(h); try { if (dr_reactChoix(h) !== 'oui') { const E0 = seance().ecrans; o = o.filter(i => !(E0[i] && E0[i].role === 'reactivation')); } } catch (e) {}   /* §12.26 : « non » — la construite de la copie n'entre pas dans l'ordre (retirée au lancement) */ try { const E = seance().ecrans; const cles = Object.keys(S.decisions || {}); const gl = o.filter(i => E[i] && !E[i].role && glisseeDe(E[i], h)); if (gl.length < 2) return o;
    const rg = i => { const d = decisionDe(E[i]) || {}; if (d.choix === 'reporter') return [2, 0, 0, 0]; return [d.choix === 'suivante' ? 0 : 1, d.defaut ? 1 : 0, +d.t || 0, cles.indexOf(cleDec(E[i]))]; };   /* ㊲ (C16) : les reportées, dans l'ordre du plan */   /* §12.17 : (b1) « à l'heure suivante », puis (b2) « terminer / préparer à la maison » */
    const tri = gl.slice().sort((a, b) => { const A = rg(a), B = rg(b); return (A[0] - B[0]) || (A[1] - B[1]) || ((A[2] && B[2]) ? A[2] - B[2] : 0) || (A[3] - B[3]) || (a - b); }); let k = 0; return o.map(i => gl.includes(i) ? tri[k++] : i); } catch (e) { return o; } }
function lancerHeure(h){ dr_finAvecCahier(); S.heure = h; S.lancee = true; S.ordres = S.ordres || {}; S.ordres[h] = dr_ordreOuverture(h); S.ordresEid = S.ordresEid || {}; S.ordresEid[h] = S.ordres[h].map(eidDe); /* E2 : now() est l'horloge réelle (socle, E1) — avant : T0 = Date.now() */ S.ecoule = 0; S.close = false; S.t5 = false; S.finSection = 1; S.finFaites = {}; /* E2 : la fin de l'heure n repart de l'étape 1 (vu par E4 : l'heure 2 s'ouvrait à l'étape 7, « sans échéance » coché) */ S.bilanCoche = false; S.travail = { terminer: [], preparer: [], apprendre: null, prevu: true, libre: '' }; S.palier = null; S.paliers = {}; S.t5 = false; S.alerteOuverte = false; try { alerteFermer(); } catch (e) {}   /* réveil n°9 (E4 ligne 143) : l'alerte de l'heure d'avant (relue avec son état) ne passe pas à l'heure lancée */ S.echeance = null; S.echeanceChoisie = false; S.echeanceAuto = false; S.motAbsents = ''; S.encart = null; S.doc = null; if (S.gel) degeler();
  const o = ordreHeure(h); S.di = o[0]; S.page = null; S.mur = null; S._rattrapage = false; journal('lancement', { heure: h }); try { if (DR_CL.react && DR_CL.react.decide[h]) { const r = seance().ecrans.find(e => e && e.role === 'reactivation' && +e.heure === +h); S.reactChoix = S.reactChoix || {}; S.reactChoix[h] = r ? 'oui' : 'non'; journal('reactivation', Object.assign({ heure: h, choix: S.reactChoix[h], eid: r ? r.eid : null }, r && dr_reactEstModifiee(r) ? { modifiee: true } : {})); } } catch (e) {}   /* §12.22 (c) : le choix de Paul, au journal et dans C/etat */ $('ecran-fin').classList.remove('on'); $('hou').textContent = dr_entete(h); /* E2 : la classe, le créneau, l'heure n/N réels — avant : HEURES_SIM puis dr_heureDe (E1), « sur 2 » */ voir('pilotage'); dr_tout(); }

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
  try { const src = typeof dr_sourceSeance === 'function' ? dr_sourceSeance() : null; if (src) return src.classeSlug || ''; } catch (e) {}   /* E1 (§12.38-1) : la source unique — jamais « la première classe du niveau » en silence quand une séance est ouverte */
  try { const l = _lvlClasses((AT.edChap || {}).level) || []; if (l[0]) return l[0].slug; } catch (e) {}   /* sans séance ouverte (rien à répéter) : l'ancien repli */
  return '';
}
/* le slug d'une classe depuis son nom (la case de l'EDT dit le nom) : la clé de `classesData` */
const dr_slugDe = nom => { try { if (typeof edtCleClasse === 'function') return edtCleClasse(nom); if (classesData[nom]) return nom; const k = Object.keys(classesData || {}).find(k => (classesData[k] || {}).nom === nom); return k || nom; } catch (e) { return nom; } };   /* §12.31 (1) : UNE règle nom → clé, celle de l'emploi du temps (`edtCleClasse`, E1 : la clé, le nom égal, le slug) — avant : la clé ou le nom égal, sans le slug */
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
      const dj = sce.deroule_joue || {}; const deja = Object.keys(dj).some(sl => edtPaquetPour(sl, dj[sl], dr_nomClasse(slug)) && (dj[sl].heures || {})[ici]); return n - (deja ? 1 : 0) + 1; }   /* compté comme la case de l'EDT (par le nom de la classe) ; lot 1 (359) : la même règle que l'EDT (`edtPaquetPour`) — un paquet sans `classe` ne compte que pour la classe de sa clé */
    const hs = ((((sce || {}).deroule_joue || {})[slug] || {}).heures) || {};
    const ici = _drCleHeureDe({ classeSlug: slug, debut: String(creneau).split('-')[0], fin: String(creneau).split('-')[1] }); return Object.keys(hs).filter(k => k !== ici).length + 1; } catch (e) { return 1; }
}
/* ─── l'heure n de la séance pour cette classe : jour, début, fin, base (ce que `HEURES_SIM[h]` simulait) ───
   L'heure en cours vient de `AT_DR_COURS` ; une heure passée, de ce qui a été posé à son lancement (`S.heuresCours`,
   gardé dans `C/etat`). `dr_heureDe` (E1, le socle) peut lire `dr_heureJouee(h)` pour les heures passées. */
const DR_JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], DR_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function dr_heurePoser(h, cours, ts){
  const d = new Date(ts || Date.now()); const deb = String(dr_creneauDuCours(cours) || '').split('-')[0] || cours.debut;
  const db = cours.debut || deb; const base = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(dr_mn(db) / 60), dr_mn(db) % 60).getTime();   /* relecteur neuf n°3 (2) : la base des horaires de « Où on en est » est le lancement (C1 6.2 : le retard recale les horaires) — avant : le début du créneau */
  const dj = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(cours.iso || '')); const dJ = dj ? new Date(+dj[1], +dj[2] - 1, +dj[3]) : d;   /* C16 (lot 2a, ㊷) : une heure rattrapée dit la date de SA case */
  const x = { jour: DR_JOURS[dJ.getDay()] + ' ' + dJ.getDate() + ' ' + DR_MOIS[dJ.getMonth()] + ' ' + dJ.getFullYear(), debut: deb, fin: cours.fin, base, lanceA: cours.debut, classe: cours.classeNom, cle: _drCleHeureDe(cours, ts), sur: dr_nbHeures(dr_creneauDuCours(cours)) };
  if (cours.rattrapee) x.rattrapee = true;   /* le récit, le texte pour École Directe, le mot aux absents, le papier : aucun horaire (Paul, 03/11 12:26) */
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
/* C16 (les quatre dettes, §3.2) — LE VRAI HUB (Firebase Realtime Database) ne range ni une valeur nulle, ni une liste vide, ni un objet vide : relu, l'état
   d'une heure n'a plus ses `lum: []`, `ecr: []`, `reps: {}`… (par diapo), ni ses `parts: []`, `travail.terminer: []`, `gel: null`… — mesuré par le geste
   sur un faux hub rangé comme le vrai : la reprise s'arrêtait sur « Cannot read properties of undefined (reading 'slice') » (etatComplet0) et la diapo ne
   se dessinait plus. Relu, l'état reprend ce qui manque : par diapo, l'état d'une diapo neuve (etatDiapo) ; pour S, l'état d'une heure neuve
   (DR_S_DEFAUT : les listes, les objets et les valeurs nulles, jamais ce que l'écriture retire exprès — DR_ETAT_HORS). Rien d'autre ne change. */
const dr_estObjet = x => !!x && typeof x === 'object' && !Array.isArray(x);
function dr_etatRempli(s){ if (!dr_estObjet(s)) return s; const hors = ['mur', 'attente', 'anim', 'coupure', 'di', 'ordres', 'repSnap', 'blocActif', 'cand'];
  const rem = (d, o) => { Object.keys(d).forEach(k => { const v = d[k]; if (o[k] === undefined) { if (v === null || typeof v === 'object') o[k] = JSON.parse(JSON.stringify(v)); } else if (dr_estObjet(v) && dr_estObjet(o[k])) rem(v, o[k]); }); };
  try { const d = typeof DR_S_DEFAUT !== 'undefined' ? DR_S_DEFAUT : {}; const d2 = {}; Object.keys(d).forEach(k => { if (hors.indexOf(k) < 0) d2[k] = d[k]; }); rem(d2, s); } catch (e) {} return s; }
function dr_parDiapoRempli(pd){ if (!dr_estObjet(pd)) return {}; Object.keys(pd).forEach(k => { const x = dr_estObjet(pd[k]) ? pd[k] : {};
  pd[k] = Object.assign({ nDev: 0, lum: [], ecr: [], reps: {}, tailles: {}, textes: {}, fsBloc: {} }, x);
  ['lum', 'ecr'].forEach(n => { if (!Array.isArray(pd[k][n])) pd[k][n] = dr_estObjet(pd[k][n]) ? Object.keys(pd[k][n]).sort((a, b) => a - b).map(i => pd[k][n][i]).filter(v => v != null) : []; else pd[k][n] = pd[k][n].filter(v => v != null); });
  ['reps', 'tailles', 'textes', 'fsBloc'].forEach(n => { if (pd[k][n] == null || typeof pd[k][n] !== 'object') pd[k][n] = {}; }); });
  return pd; }
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
  if (s.copie) s.copie = dr_copieEtatPourHub(s.copie, seance().ecrans);   /* C16 (retour sûr) : ce que la classe a écrit, lisible par la 8.77.1-⑩ (dr-socle.js) */
  return { S: dr_versHub(s), parDiapo: dr_versHub(parDiapo), vuMax: dr_versHub(vuMax), maj: Date.now(), heures: dr_versHub(dr_heuresDesEcrans()), reactivations: dr_versHub(dr_reactivationsDesEcrans()), heuresParDurees: DR_CL.partages.get(seance().ecrans) || 0 };   /* réveil n°4, points 3 et 7 : l'heure de chaque diapo (les frontières) et l'heure courante (`S.heure`) — la reprise remonte l'heure telle qu'elle était, E4 lit où était chaque diapo */
}
/* `dr_normaliserTrame` du socle retire les écrans `reactivation` (E1, §12.26-2 : jamais dans la trame du chapitre) — appliquée ici à la COPIE de la classe en mémoire
   (les fins d'heure, l'heure par défaut), elle en retirerait la construite : on la met de côté et on la remet à sa place */
function dr_reactNormaliserCopie(E, sk){ if (typeof dr_normaliserTrame !== 'function') return; const mis = []; for (let i = E.length - 1; i >= 0; i--) if (E[i] && E[i].role === 'reactivation') mis.unshift({ i, e: E[i], apres: (E[i - 1] || {}).eid });
  dr_normaliserTrame(E, sk); mis.forEach(m => { if (E.includes(m.e)) return; let k = m.apres != null ? E.findIndex(x => x && x.eid === m.apres) : -1; k = k >= 0 ? k + 1 : Math.min(m.i, E.length); E.splice(k, 0, m.e); }); }
/* les frontières d'heure de la trame en mémoire : {eid: heure}, sans les « Cahier de textes » (le socle les place) */
/* C16 (les correctifs, ㉘) — LE VRAI HUB REFUSE (HTTP 400) TOUTE CLÉ QUI PORTE . # $ [ ] / : la scène du tableau (`C/scene`, `/site/repetition/scene`,
   `/site/tableau_test/scene`) copiait `S.mur`, dont les textes corrigés en direct sont rangés par position (« 0.t », « 2.1 », « -1.act ») ; elle partait sans
   échappement (02/11, 09:39 : « ● session coupée », le bandeau des enregistrements perdus, le tableau distant figé). `dr_versHub` ne convient pas à la scène :
   il retire aussi son rang et sa séance (`di`, `si`), que le tableau distant lit. Ici, les clés seulement, dans les deux sens, avec le même codage que
   `dr_versHub` / `dr_duHub` (« . » → « %2e »…) : une clé jamais échappée se relit telle quelle. */
function dr_cleVersHub(k){ return String(k).replace(/[.#$\[\]\/]/g, c => '%' + c.charCodeAt(0).toString(16)); }
function dr_cleDuHub(k){ return String(k).replace(/%(2e|23|24|5b|5d|2f)/g, (m, h) => String.fromCharCode(parseInt(h, 16))); }
function dr_clesVersHub(x){ if (Array.isArray(x)) return x.map(dr_clesVersHub); if (!x || typeof x !== 'object') return x; const o = {}; Object.keys(x).forEach(k => { o[dr_cleVersHub(k)] = dr_clesVersHub(x[k]); }); return o; }
function dr_clesDuHub(x){ if (Array.isArray(x)) return x.map(dr_clesDuHub); if (!x || typeof x !== 'object') return x; const o = {}; Object.keys(x).forEach(k => { o[dr_cleDuHub(k)] = dr_clesDuHub(x[k]); }); return o; }
function dr_heuresDesEcrans(){ const o = {}; try { seance().ecrans.forEach(e => { if (!e.role && e.eid != null) o[e.eid] = +e.heure || 1; }); } catch (e) {} return o; }
function dr_reactivationsDesEcrans(){ const o = {}; try { seance().ecrans.forEach(e => { if (e.role === 'reactivation' && e.eid != null) o[e.eid] = +e.heure || 1; }); } catch (e) {} return o; }   /* le rituel posé à chaque heure (§12.16), pour la reprise */
/* reposer des frontières gardées (la reprise, l'heure suivante) : chaque diapo à son heure, chaque « Cahier de textes » derrière la dernière diapo de la sienne */
function dr_appliquerHeures(m, parDurees, reac){ const E = seance().ecrans; if (!m || typeof m !== 'object' || !Object.keys(m).length) return 0; let n = 0;
  if (reac && typeof reac === 'object') E.forEach(e => { if (e.eid != null && reac[e.eid] != null && (!e.role || e.role === 'reactivation')) { e.role = 'reactivation'; e.heure = +reac[e.eid]; n++; } });
  E.forEach(e => { if (!e.role && e.eid != null && m[e.eid] != null && +m[e.eid] !== e.heure) { e.heure = +m[e.eid]; n++; } });
  if (parDurees) DR_CL.partages.set(E, +parDurees);
  dr_placerFins(E, 1); if (typeof dr_normaliserTrame === 'function') dr_reactNormaliserCopie(E, (dr_ctx() || {}).snum); try { reindexer(); } catch (e) {} return n; }
const dr_journalHub = () => dr_versHub(J);

/* ─── peut-on écrire ? (contrat §5 : ni atelier, ni répétition, ni hors d'une heure lancée, ni en vue tableau) ─── */
function dr_clPeutEcrire(copie){
  try {
    if (/[?&]vue=tableau(&|$)/.test(location.search)) return false;
    if (typeof S !== 'object' || !S || !S.lancee || S.repetition) return false;
    if (S.atelier && !copie) return false;   /* réveil n°10 (E4 ligne 149, grave : la retouche perdue) : en classe, l'onglet Atelier ouvert laisse passer la COPIE de la classe (C/ecrans, la trame retouchée) — le journal, l'état et le paquet attendent le retour au Pilotage (dans l'Atelier, `S` est celui de l'Atelier, le socle le rend ensuite) ; avant : rien ne s'écrivait */
    if (typeof AT_DR_REGIME === 'undefined' || AT_DR_REGIME !== 'classe' || !AT_DR_COURS) return false;
    return typeof dr_cheminC === 'function' && !!dr_cheminC();
  } catch (e) { return false; }
}

/* ─── au fil : la copie, le journal, l'état, le paquet — même débounce de 900 ms qu'aujourd'hui (`_drCopieAuto`, `_drTraceAuto`) ─── */
/* la copie jouée (`C/ecrans`), appelée par `dr_sauve` du socle en régime classe (audit E1, C3) */
function dr_copieAuto(vite){
  clearTimeout(DR_CL.cT);
  DR_CL.cT = setTimeout(() => {
    if (!dr_clPeutEcrire(true)) return;
    const ecr = dr_copiePourHub(JSON.parse(JSON.stringify(seance().ecrans))); const em = dr_empreinte(ecr);   /* C16 (retour sûr) : la copie au hub, lisible par la 8.77.1-⑩ (dr-socle.js) */
    if (em === DR_CL.empreinteEcrite) return; DR_CL.empreinteEcrite = em;   /* la copie ne repart que si elle a changé (relecteur neuf n°2 : 14 écritures en 17 min sans rien éditer) */
    const emH = dr_empreinteHub(ecr); dr_ecrire(dr_cheminC() + '/ecrans', ecr, 'Séance en classe — copie au fil de l’eau (' + AT_DR_COURS.classeNom + ')', () => { dr_temoinIntegre(emH); });   /* C16 (⑰) : l'empreinte de la copie rangée comme le hub la range */
    clearTimeout(DR_CL.iT); DR_CL.iT = setTimeout(() => dr_temoinIntegre(emH), 4000);   /* C16 (⑰) : une écriture refusée n'appelle pas la suite (mjpcPutJson : le bandeau « Réessayer ») — le témoin relit le hub de lui-même 4 s après : la copie relue n'est pas celle écrite, « à vérifier » */
  }, vite ? 0 : 900);
  dr_journalAuto(vite); dr_etatAuto(vite); dr_traceAuto(vite);
}
function dr_journalAuto(vite){
  clearTimeout(DR_CL.jT);
  DR_CL.jT = setTimeout(() => { if (!dr_clPeutEcrire()) return; dr_ecrire(dr_cheminC() + '/journal', dr_journalHub(), 'Le journal de l’heure (' + AT_DR_COURS.classeNom + ')', () => {}); }, vite ? 0 : 900);
}
function dr_etatAuto(vite){
  clearTimeout(DR_CL.eT);
  DR_CL.eT = setTimeout(() => { if (!dr_clPeutEcrire()) return; try { dr_heureLocaleEcrire(); } catch (e) {} dr_ecrire(dr_cheminC() + '/etat', dr_etatHeure(), 'L’état de l’heure, pour la reprendre (' + AT_DR_COURS.classeNom + ')', () => {}); }, vite ? 0 : 900);
}
function dr_traceAuto(vite){
  clearTimeout(DR_CL.tT);
  DR_CL.tT = setTimeout(() => {
    if (!dr_clPeutEcrire()) return; const ch = dr_cheminH(); if (!ch) return;
    /* C16 (㊱, défaut 6 ; décision de la conscience) : le paquet s'écrit en PATCH de ses propres clés — il ne réécrit plus jamais `H/absents`, que seul un
       geste d'appel écrit (la case, le pilote). Avant : relu puis réécrit en PUT entier ; un absent coché dans la case entre la lecture et l'écriture était effacé. */
    const p = dr_paquetHeure(false); if (!p) return; dr_paquetPatch(ch, p, 'Heure de cours — ' + p.creneau + ' (' + p.classe + ')');
  }, vite ? 0 : 900);
}
/* le témoin « déroulé intègre » (R9) : l'empreinte de ce qui a été écrit, comparée à ce que le hub rend */
function dr_empreinte(x){ const s = JSON.stringify(x); let h = 0; for (let j = 0; j < s.length; j++) h = ((h << 5) - h + s.charCodeAt(j)) | 0; return s.length + '-' + (h >>> 0).toString(36); }
/* C16 (les dernières dettes, ⑰ ; MANDAT-DERNIERES-DETTES §3.6) : LES DEUX COPIES COMPARÉES RANGÉES COMME LE HUB LES RANGE. Le vrai hub (Firebase Realtime
   Database) ne garde ni une valeur nulle, ni une liste ou un objet vides (et leur parent devenu vide disparaît) ; il range une liste en objet aux clés « 0 », « 1 »…
   et la rend en liste quand ses clés sont des entiers dont plus de la moitié de 0 au plus grand sont là. La copie écrite (avec ses listes vides) et la copie relue
   (sans) avaient donc deux empreintes différentes alors que rien n'était perdu : « ● déroulé à vérifier » sur le vrai hub, « ● déroulé intègre » sur un hub qui
   garde tout. Chaque copie passe par `dr_commeLeHub` avant son empreinte (`dr_empreinteHub`) : rien de ce que le hub garde n'est retiré, une vraie différence (une écriture perdue,
   la liaison coupée) reste « à vérifier ». Le vrai hub rend aussi les clés d'un objet triées (la voie (b), mesuré sur le code de Firebase 8.10.1 : écrit
   `{eid, act, role, blocs}`, relu `{act, blocs, eid, role}`) : les clés sont triées des deux côtés. */
function dr_commeLeHub(v){ if (v === null || v === undefined || typeof v === 'function' || (typeof v === 'number' && !isFinite(v))) return undefined; if (typeof v !== 'object') return v;
  const o = {}; (Array.isArray(v) ? v.map((x, i) => String(i)) : Object.keys(v)).sort().forEach(k => { const r = dr_commeLeHub(v[k]); if (r !== undefined) o[k] = r; }); return Object.keys(o).length ? o : undefined; }   /* les mêmes fonctions que la voie (b) (sas, reprise/8771, d6f2957) : une liste rangée par ses rangs, les clés triées */
function dr_empreinteHub(x){ const y = dr_commeLeHub(x); return y === undefined ? '' : dr_empreinte(y); }
function dr_temoinIntegre(em){
  dr_lire(dr_cheminC() + '/ecrans', v => { DR_CL.empreinte = em; DR_CL.relue = v ? dr_empreinteHub(v) : ''; const t = document.getElementById('dr-integre'); if (!t) return;
    const ok = DR_CL.relue === em; t.textContent = ok ? '● déroulé intègre' : '● déroulé à vérifier'; t.className = ok ? 'dr-integre-ok' : 'dr-integre-ko';
    t.title = ok ? 'Ce que la classe a vu est au hub, bit pour bit : la copie écrite et la copie relue ont la même empreinte (' + em + ').' : 'La copie relue au hub n’est pas celle qui vient d’être écrite : la liaison est lente ou coupée. Rien n’est perdu ici ; le site réessaie au prochain geste.'; });
}

/* ─── le paquet de l'heure : LES MÊMES CHAMPS qu'aujourd'hui (`_drPaquetHeure`), composés depuis le journal ───
   `activites[]` : une ligne par écran joué (le sens que l'EDT lit : « N activités », `reel === 0` = reportée — audit C4),
   `eid` fait foi, `n` reste un rang de LECTURE (LOT C2 ③.3) ; `reel` = le temps passé d'après les entrées `diapo` du
   journal, moins les coupures mises à part (C1 1.3 bis) ; `passages` = les entrées sur cet écran.
   `decisions` par rang TOMBE (audit C3 : personne ne le relit) ; `decisionsParEcran` (par `eid`) et `decisionsParActivite`
   (par `actId`) le remplacent. Plus ce que la maquette sait : appel, coupures, échéance, travail, réserve, versements, paroles. */
/* les prises de parole de l'heure pour son paquet : celles du VIF et de la palette (`S.parts`), et chaque réponse écrite avec son élève dans une diapo
   jouée cette heure — C1 4b.5 : écrire une réponse est une prise de parole (motif « réponse »), sans double saisie ; `S.parts` n'en reçoit pas de copie
   (les compteurs la comptent déjà) — réveil n°6, E4 ligne 133 */
function dr_partsHeure(h, parEid){ const out = (S.parts || []).filter(x => x.heure == null || x.heure === h).slice();
  try { Object.keys(parEid || {}).forEach(eid => { const i = indexDe(eid); if (i < 0) return; const st = parDiapo[K(i)] || {}; Object.keys(st.reps || {}).forEach(bi => (st.reps[bi] || []).forEach((r, ri) => { if (r && r.eleve && r.r) out.push({ nom: r.eleve, m: 'reponse', note: '', eid, bi: +bi, ri, heure: h, reponse: true }); })); }); } catch (e) {} return out; }
/* `H.travail` (contrat §12.9) depuis les décisions de l'heure — relecteur neuf n°3 (1) : `S.travail.terminer/preparer` restaient vides (la maquette décide dans
   `S.decisions`), `prevu` vrai même quand la trame ne prévoyait rien */
function dr_travailHeure(h){ const T = Object.assign({ terminer: [], preparer: [], apprendre: null, prevu: true, libre: '' }, S.travail || {}); const parChoix = c => Object.keys(S.decisions || {}).filter(k => { const d = S.decisions[k] || {}; return d.choix === c && (!d.heure || d.heure === h); }).map(k => ({ cle: k, titre: (objetDec(k) || {}).titre || '' }));
  let prevuTrame = ''; try { prevuTrame = dr_travail()[S.si + '|' + h] || ''; } catch (e) {}
  return Object.assign({}, T, { terminer: parChoix('terminer'), preparer: parChoix('preparer'), maison: parChoix('pastemps').concat(parChoix('maison')), prevu: !!(T.prevu && prevuTrame), prevuTexte: prevuTrame }); }
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
  Object.keys(S.decisions || {}).forEach(k => { if (acts.find(x => x.id === k)) decisionsParActivite[k] = S.decisions[k]; });   /* lu par la réactivation (« À reprendre ») des heures écrites avant ㊳ */
  E.forEach((e, i) => { if (!e || e.eid == null || e.role === 'fin' || e.role === 'reactivation' || (+e.heure || 1) > h) return; const d = decisionDe(e); if (!d || (typeof finie === 'function' && finie(e, i))) return; decisionsParEcran[e.eid] = d; });   /* ㊳ (C16) : une décision par diapo non faite de cette heure ou d'avant (pas une diapo prévue pour une heure plus loin, que la décision de son activité couvre) — la sienne, sinon celle de son activité (`decisionDe`) */
  const debutReel = S.debutReel || ((J.find(x => x.type === 'lancement' && x.h === h) || {}).t) || Date.now();
  const p = {
    classe: AT_DR_COURS.classeNom, creneau: dr_creneauDuCours(AT_DR_COURS), lanceA: AT_DR_COURS.debut, fin: AT_DR_COURS.fin, ...(AT_DR_COURS.rattrapee ? { rattrapee: true } : {}),
    debutReel, finReel: clos ? t1 : null, tempsUtilePrevu: dr_tempsUtile(dr_creneauDuCours(AT_DR_COURS), AT_DR_COURS.debut),
    minutesJouees: Math.round((t1 - debutReel) / 60000), heure: h, sur: (dr_heureJouee(h) || {}).sur || null,
    activites, parActivite, decisionsParEcran, decisionsParActivite,
    appel: S.appel || {}, coupures: (S.coupures || []).filter(c => (c.debut || 0) >= debutReel), echeance: S.echeance || ((S.finFaites || {})[1] ? 'aucune' : null),   /* « Sans échéance » se dit (relecteur neuf n°2) */
    travail: dr_travailHeure(h), travailTexte: (typeof texteTravailED === 'function' ? texteTravailED() : '') || '',   /* relance M7 : la forme de la maquette ; `prevu:false` = « pas de travail », jamais un silence */
    reserve: S.reserve || [], versements: S.versements || {}, parts: dr_partsHeure(h, parEid),   /* les paroles de CETTE heure (relecteur neuf n°2) */
    motAbsents: S.motAbsents || '', clos: !!clos, maj: Date.now(),
    appelUnique: true   /* C16 (㊱) : la marque d'une heure jouée par cette version — `H/absents` y est LA liste de l'appel (une heure d'avant : la case et la Relecture réunissent les deux listes) */
  };
  if (clos && S.closPar) p.closPar = S.closPar;
  return dr_versHub(p);
}

/* ─── le pointeur du cours (`sesCoursEcrire`/`sesCoursFermer`, même forme qu'aujourd'hui) et la clôture certaine ─── */
function dr_coursActif(){ const ec = AT.edChap || {}; return { niveau: ec.level, chapitre: ec.chnum, seance: ATVUES.snum, classeSlug: AT_DR_COURS.classeSlug, classeNom: AT_DR_COURS.classeNom, debut: AT_DR_COURS.debut, fin: AT_DR_COURS.fin, ...(AT_DR_COURS.iso ? { iso: AT_DR_COURS.iso } : {}), ...(AT_DR_COURS.rattrapee ? { rattrapee: true } : {}) }; }   /* C16 (lot 2c) : une heure reprise garde la date de sa case, rattrapée ou non */
function dr_coursEcrire(){
  if (!AT_DR_COURS || !ATVUES.snum) return;
  try { SES.ctx = dr_coursActif(); SES.actif = true; } catch (e) {}
  DR_CL.coursTs = Date.now(); dr_ecrire('/site/cours_actif', Object.assign(dr_coursActif(), { ts: DR_CL.coursTs }), 'Le cours annoncé aux autres appareils', () => {});
  try { if (typeof dr_ttHeureDebut === 'function') dr_ttHeureDebut(dr_coursActif()); } catch (e) {}   /* §12.66 (1) : en mode test, le cours reste au magasin ; l'image du tableau part à l'adresse du mode test */
  /* la scène du cours précédent ne doit jamais ressusciter : la scène neuve, au format d'E3 (`et`), tout de suite (audit F10) */
  try { if (typeof dr_sceneAuto === 'function') dr_sceneAuto(true); } catch (e) {}
}
function dr_coursFermer(){ dr_ecrire('/site/cours_actif', null, 'Le cours est clos', () => {}); try { SES.actif = false; } catch (e) {} try { if (typeof dr_ttHeureFin === 'function') dr_ttHeureFin(); } catch (e) {} }   /* §12.66 (1) : le pointeur et la scène du mode test se retirent s'ils sont encore les nôtres → le tableau distant revient à l'horloge */
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
    /* C16 (391 ; Paul, 04/11 02:51 : « Ok ») : l'autre appareil l'apprend tout de suite — l'état vivant de cette heure dit « close », comme quand on clôt une
       heure sur un appareil (`dr_sesClosAilleurs`) : son écran se ferme et le dit, rien ne s'y écrit plus pour l'heure close. Avant : son écran la montrait
       encore lancée, sans être prévenu (mesuré : sonde-lot1 W, le témoin H+H·autre) */
    try { const C = ch.slice(0, ch.lastIndexOf('/heures/')); dr_ecrire(C + '/vif', { close: true, sig: 'heure|' + ch, sorte: 'heure', cours: c, par: (typeof DR_SES === 'object' && DR_SES && DR_SES.id) || 'lancement', ts: Date.now() }, 'L’heure close, dite aux autres appareils', () => {}); } catch (e) {}
    try { atInfo('L’heure de ' + escapeHtml(String(c.classeNom || c.classeSlug || '')) + ' (' + escapeHtml(dr_creneauDuCours(c)) + ') n’était pas close : elle vient de l’être. Rien de cette heure n’entre dans la suivante.'); } catch (e) {}
  };
  if (c !== undefined) suite(c); else dr_lire('/site/cours_actif', suite);
}

/* ─── lancer : `atDrJouerClic`, ses gestes dans l'ordre, puis le lancement de la maquette ─── */
function dr_lancer(classeSlug, creneau, debut, heure, sur, isoCase){
  DR_CL.rat = isoCase ? { iso: String(isoCase), rattrapee: true } : null;   /* C16 (lot 2a, ㊷) : « ▶ Rattraper cette heure » — l'heure est rangée à la date de sa case */
  DR_CL.react = { choix: {}, prete: {}, raison: {}, decide: {}, enCours: false }; DR_CL.reactVue = null; DR_CL.reactC = null;   /* §12.22 : un nouveau lancement, un nouveau choix */
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
      AT_DR_COURS = Object.assign({ debut: c.debut, fin: c.fin, classeSlug, classeNom: nom }, DR_CL.rat || {}); AT_DR_REGIME = 'classe';
      dr_reprendre(ok => { if (!ok) dr_lancerNeuf(classeSlug, nom, creneau, c.debut, heure, c); }); return; }
    dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c);
  });
}
function dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c, suite){
  /* une heure close ne se reprend plus, par aucun chemin (C1 12 ; `_drHeureCloseAu`) : la même clé (jour + créneau + classe) n'est jamais réécrite */
  if (!DR_CL.cleVerifiee) { const fin0 = String(creneau).split('-')[1]; const ch0 = (typeof dr_cheminB === 'function' ? dr_cheminB() : '') + '/deroule_joue/' + classeSlug + '/heures/' + _drCleHeureDe(Object.assign({ classeSlug, debut, fin: fin0 }, DR_CL.rat || {}));
    dr_lire(ch0, t0 => { const clos = !!(t0 && t0.clos); /* le paquet entier, pas `…/clos` : en mode test le magasin est rangé par chemin, une lecture de `…/clos` mise en cache cacherait la clôture écrite ensuite sur `H` */ if (clos === true) { try { atInfo('L’heure de ' + escapeHtml(nom) + ' sur le créneau ' + escapeHtml(creneau) + ' est déjà close aujourd’hui : elle ne se rouvre pas. Lance l’heure suivante depuis sa case de l’emploi du temps (son créneau à elle).'); } catch (e) {} return; }
      /* §12.68 : ce que la copie de la classe était AVANT ce lancement (lu, jamais écrit) — « Annuler cette heure » la remettra telle quelle */
      const C0 = (typeof dr_cheminB === 'function' ? dr_cheminB() : '') + '/deroule_joue/' + classeSlug;
      dr_lire(C0, v0 => { DR_CL.avant = { C: C0, hub: v0 === undefined ? undefined : (v0 == null ? null : JSON.parse(JSON.stringify(v0))) };
        DR_CL.cleVerifiee = true; try { dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c, suite); } finally { DR_CL.cleVerifiee = false; } }); }); return; }
  const fin = String(creneau).split('-')[1];
  if (!suite) DR_CL.etatRestaure = false;   /* un nouveau lancement : l'état relu de la classe le redira s'il y en a un */
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
        dr_restaurer(j); if (!(j.heures && Object.keys(j.heures).length)) dr_partagerHeures(dr_utileCreneau(creneau)); else dr_appliquerHeures(j.heures, j.heuresParDurees, j.reactivations); dr_heureContinue(heure);   /* les frontières de la veille, puis la séance continue */ S.heure = heure - 1; S.close = true; S.lancee = true; DR_CL.suite = { classeSlug, nom, creneau, debut, heure, garder: true }; dr_heurePoser(heure, Object.assign({ debut, fin, classeSlug, classeNom: nom }, DR_CL.rat || {}));
        try { $('ecran-edt').classList.remove('on'); } catch (e) {} try { voir('pilotage'); } catch (e) {} DR_CL.reactC = (typeof dr_cheminB === 'function' ? dr_cheminB() : '') + '/deroule_joue/' + classeSlug; dr_reactOuvertureAssurer(heure, DR_CL.reactC, () => ouvrirOuverture()); return; }   /* §12.26 (7) : la construite de la copie, ou construite maintenant (clôture manquée) et écrite ; le chemin C pour l'écriture de Paul avant le lancement */
      dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c, true);
    }, (typeof dr_cheminB === 'function' ? dr_cheminB() : '') + '/deroule_joue/' + classeSlug);
    return; }
  /* §12.25 (2) : l'écran d'ouverture paraît aussi à l'heure 1, ou à une heure n sans état relu, quand E4 a quelque chose à réactiver — le même bouton ; sinon « Lancer » reste direct */
  if (!DR_CL.react.decide[heure] && !dr_reactDejaLa(heure) && !DR_CL.react.enCours) { DR_CL.react.enCours = true; dr_reactPreparerAsync(heure, e => { DR_CL.react.enCours = false; if (e) { DR_CL.suite = (suite && DR_CL.suite) ? DR_CL.suite : { classeSlug, nom, creneau, debut, heure, garder: false }; dr_ouvertureLegere(heure); } else { DR_CL.react.decide[heure] = true; dr_lancerNeuf(classeSlug, nom, creneau, debut, heure, c, suite); } }); return; }
  const garder = suite && DR_CL.suite && DR_CL.suite.garder; DR_CL.suite = null;
  try { DR_CL.avantMem = dr_annulInstantane(); } catch (e) { DR_CL.avantMem = null; }   /* §12.68 : la page telle qu'avant le lancement */
  const copie = garder ? null : ((typeof atDrJouer === 'function') ? atDrJouer(classeSlug, nom) : null);
  AT_DR_COURS = Object.assign({ debut, fin, classeSlug, classeNom: nom }, DR_CL.rat || {}); AT_DR_REGIME = 'classe';
  try { chChargerTaxo(() => {}); } catch (e) {}   /* [8.67.1] le T-5 nomme les notions, jamais leurs codes */
  try { if (copie && typeof dr_jouerCopie === 'function') dr_jouerCopie(copie.ecrans); } catch (e) {}   /* le socle joue la copie de la classe (E1) */
  dr_heurePoser(heure, AT_DR_COURS);
  DR_CL.ouverte = { C: dr_cheminC(), H: dr_cheminH(), creneau }; dr_joueeIci(DR_CL.ouverte.H, false);   /* l'adresse de CETTE heure, gardée pour sa clôture (même si la page change de séance ou de jour) */
  S.closPar = null; S.finReel = null; S.debutReel = Date.now();
  try { $('ecran-edt').classList.remove('on'); } catch (e) {}   /* la porte se referme (le clic de l'EDT simulé le faisait) */
  dr_coursEcrire();   /* le pointeur d'abord : la bannière de reprise et le tableau distant en dépendent, même si le rendu bute */
  /* la barre du site se redessine pendant les lectures du hub (ouverture du chapitre) : on attend ses onglets, borné à 4 s (relecteur neuf n°1 : `voir` levait) */
  const go = n => { if (!['ong-pilotage', 'ong-relecture', 'ong-atelier'].every(id => document.getElementById(id)) && n < 40) { setTimeout(() => go(n + 1), 100); return; }
    try { lancerHeure(heure); } catch (e) { try { atInfo('Le Pilotage ne s’est pas affiché entièrement (' + e.message + ') : l’heure est lancée et s’enregistre ; rouvre l’onglet Pilotage.'); } catch (x) {} }
    dr_traceReprendre(() => { dr_absentsDeLaCase(true); dr_copieAuto(true); }); };
  const placer = () => { dr_partagerHeures(dr_utileCreneau(creneau)); dr_heureContinue(heure); dr_reactInserer(heure); dr_edtAssurer(); go(0); };   /* §12.22 : la réactivation construite, une fois, si Paul a dit oui */
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
      (Array.isArray(acts) ? acts : Object.values(acts || {})).forEach(a => { if (a && a.eid != null && ix[a.eid] != null) { if (!DR_CL.etatRestaure) marque.add(ix[a.eid]); } else if (a) anciens++; }); }); });   /* réveil n°8 (E4 ligne 138) : l'état de la classe relu (`C/etat`, ses `vuMax`) dit mieux que le paquet ce qui a été dévoilé — une diapo montrée à 0/2 n'est pas « jouée » */
  if (anciens) E.forEach((e, i) => { if (anciens > 0 && !e.role && !marque.has(i)) { marque.add(i); anciens--; } });
  let n = 0; marque.forEach(i => { const k = K(i); if (!vuMax[k] && !decisionDe(E[i])) {   /* une diapo décidée garde son état : « à l'heure suivante » reprend là où la classe en était (C1 6.6, §12.17) */ vuMax[k] = Math.max(1, elements(E[i]).length); n++; } }); return n; }
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
function dr_lireTous(chemins, cb){ const r = new Array(chemins.length); let n = chemins.length; chemins.forEach((c, k) => dr_lire(c, v => { r[k] = v; if (--n === 0) cb(...r); })); }
function dr_reprendre(cb){
  const C = dr_cheminC(), ch = dr_cheminH(); if (!C || !ch) { if (cb) cb(false); return; }
  dr_lireTous([C + '/ecrans', C + '/etat', C + '/journal', ch], (copie, etat, jr, t) => {   /* les quatre lectures ensemble (contrôle n°68) — avant : l'une après l'autre */
    { const loc = dr_heureLocaleLire(C); if (loc && loc.etat && loc.etat.S && (+loc.etat.maj || 0) > (+(etat || {}).maj || 0)) { etat = loc.etat; if (Array.isArray(loc.journal)) jr = loc.journal; } }   /* §12.28-3 (e) : ce que l'onglet fermé n'avait pas encore envoyé au hub (≤ 2 s), gardé dans ce navigateur au départ */
    if (!etat || !etat.S) { if (cb) cb(false); return; }
    dr_copieDuHub(copie);   /* C16 (retour sûr) : les diapos d'ouverture reprennent leur canon (écrites lisibles pour la 8.77.1-⑩) */
    dr_adopterIdentites(copie); if (Array.isArray(copie) && copie.length && copie.every(x => x && typeof x === 'object')) { const E0 = seance().ecrans; E0.splice(0, E0.length, ...copie); try { reindexer(); } catch (e) {} }   /* réveil n°6 (E4 ligne 110, ma part) : la reprise relit la copie de la classe (C/ecrans) telle qu'elle est au hub, sans recalcul — ce qui a été écrit en classe revient */
    dr_finAvecCahier();
    if (!dr_appliquerHeures(dr_duHub(etat.heures || {}), etat.heuresParDurees, dr_duHub(etat.reactivations || {})) && !(etat.heures && Object.keys(etat.heures).length)) dr_partagerHeures(dr_utileCreneau(dr_creneauDuCours(AT_DR_COURS)));   /* réveil n°4, 3 : les frontières de l'heure telles qu'elles étaient (avant : recalculées, la diapo 7 repassait à l'heure 1) */
    if (t && (t.clos || (t.classe && t.classe !== AT_DR_COURS.classeNom) || (t.creneau && t.creneau !== dr_creneauDuCours(AT_DR_COURS)))) { if (cb) cb(false); return; }
    dr_restaurer({ S: dr_copieEtatDuHub(dr_etatRempli(dr_duHub(etat.S)), seance().ecrans), parDiapo: dr_parDiapoRempli(dr_duHub(etat.parDiapo || {})), vuMax: dr_duHub(etat.vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub) });
    try { if (typeof dr_invConvertirCopie === 'function') dr_invConvertirCopie(); } catch (e) {}   /* C16 (§4.11) : le journal relu, une ancienne diapo d'ouverture jamais montrée prend le canon ; une montrée ne change pas */
    DR_CL.sur = ((dr_heureJouee(S.heure) || {}).sur) || DR_CL.sur || 1;   /* N revient avec l'heure */
    const hc = dr_heureJouee(S.heure); if (hc && typeof HEURES_SIM === 'object') HEURES_SIM[S.heure] = hc; else dr_heurePoser(S.heure, AT_DR_COURS, t && t.debutReel);
    S.debutReel = (t && t.debutReel) || S.debutReel || Date.now();
    S.ecoule = Math.max(0, Math.round((Date.now() - S.debutReel) / 1000), +S.ecoule || 0); S.lancee = true;   /* §12.28-3 (e) : le chrono ne recule jamais (E3, retour 54 : 00:15 → 00:05) — le temps compté par la page, gardé dans l'état, est un plancher */ S.close = false; S.mur = null;
    /* le temps où la page était fermée est une COUPURE (C1 1.3 bis) : mis à part tant que Paul n'a pas dit que le cours a continué */
    const vivant = Math.max(+etat.maj || 0, +(t && t.maj) || 0) || Date.now();   /* relecteur neuf n°3 (4) : la dernière trace de vie de la page (l'état, battu chaque minute, ou le paquet) — avant : `etat.maj` seul, écrit au dernier geste : le temps passé sur la diapo depuis comptait comme coupure */
    const trou = Date.now() - vivant;
    /* C16 (lot 2c ; Paul 03/11 12:42 : « il faut reprendre là où je me serai arrêté ») : une heure reprise un AUTRE JOUR que celui de sa case (ordinaire ou rattrapée)
       reprend son horloge là où elle s'était arrêtée — le temps déjà joué compte, rien ne part à la reprise, l'heure affichée suit ; le même jour : inchangé */
    { const p2 = n => (n < 10 ? '0' : '') + n, jr = d => d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); const hj = dr_heureJouee(S.heure) || {};
      const caseJ = /^\d{4}-\d{2}-\d{2}$/.test(String(AT_DR_COURS.iso || '')) ? String(AT_DR_COURS.iso) : jr(new Date(hj.base || Date.now()));
      if (caseJ !== jr(new Date())) { const h0 = dr_horlogeCase(); S.hcReprise = { h: S.heure, t0: S.debutReel, dec: vivant + (h0 ? h0.dec + h0.saut : 0) - Date.now(), z: (h0 && h0.z) || (S.debutReel + (h0 ? h0.dec : 0)) }; S.ecoule = dr_ecouleS(S.debutReel); } }   /* z : l'origine de l'horloge de l'heure — le chrono repart du temps déjà joué */
    if (trou >= 60000) { S.coupures = S.coupures || []; const e = ecran(); S.coupures.push({ debut: vivant, fin: Date.now(), di: S.di, eid: e && e.eid, duree: Math.round(trou / 60000), compte: false, rechargement: true }); journal('coupure', { duree: Math.round(trou / 60000), rechargement: true }); }
    journal('reprise', { depuis: etat.maj || null });
    DR_CL.reprise = true;
    try { $('ecran-edt').classList.remove('on'); } catch (e) {}
    try { voir('pilotage'); } catch (e) {}
    try { $('hou').textContent = dr_entete(S.heure); } catch (e) {}
    try { dr_coursEcrire(); } catch (e) {}
    tout(); dr_copieAuto(true);
    if (S.enFin) { S.enFin = false; try { ouvrirFin(true); } catch (e) {} }   /* §12.28-3 (e) : « Fin de l'heure » revient à son étape (`S.finSection`) si la séquence était ouverte — avant : `S.enFin` revenait vrai sans la séquence, et le T-5 ne la rouvrait plus */
    try { atInfo('Heure reprise : la diapo, le chrono, les décisions, les paroles et les notes sont revenus.'); } catch (e) {}
    DR_CL.ouverte = { C, H: ch, creneau: dr_creneauDuCours(AT_DR_COURS) }; dr_joueeIci(ch, false); dr_absentsDeLaCase();
    if (cb) cb(true);
  });
}
/* remettre dans la page l'état d'une heure jouée, décodé (`dr_lireJoue`) : S, les dévoilements, le journal ; les rangs refaits */
function dr_restaurer(j){ DR_CL.etatRestaure = true;   /* réveil n°8 : l'état relu prime sur les paquets (`dr_marquerJoues`) */
  Object.keys(j.S || {}).forEach(k => { S[k] = j.S[k]; });
  [[parDiapo, j.parDiapo], [vuMax, j.vuMax]].forEach(([o, v]) => { Object.keys(o).forEach(k => delete o[k]); Object.assign(o, v || {}); });
  J.length = 0; (j.J || []).forEach(o => J.push(o));
  S.ordres = {}; Object.keys(S.ordresEid || {}).forEach(h => { S.ordres[h] = (S.ordresEid[h] || []).map(indexDe).filter(i => i >= 0); });   /* l'ordre de chaque heure, refait depuis les identités */
  try { reindexer(); } catch (e) {}
}
/* l'entête de l'heure : la classe, le créneau, l'heure n/N, la séance */
function dr_entete(h){ const x = dr_heureJouee(h) || {}; try { const el = document.getElementById('hou'); if (el) el.title = dr_enteteLong(h); } catch (e) {}
  return (x.classe || '') + ' · ' + (x.debut || '') + '-' + (x.fin || '') + ' · heure ' + h + (x.sur && h > x.sur ? ' · suite' : '/' + (x.sur || '?')); }   /* ㊲ : au-delà des heures prévues, « heure n · suite » */   /* relecteur neuf n°1 : l'entête longue était coupée à 119 px */
function dr_enteteLong(h){ const x = dr_heureJouee(h) || {}; return (x.jour || '') + ' ' + (x.debut || '') + '-' + (x.fin || '') + ' · ' + (x.classe || '') + ' · heure ' + h + ' sur ' + (x.sur || '?') + ' · ' + (seance().titre || seance().title || ''); }

/* ─── clore : l'étape 7 fait les écritures d'`atDrCloreFin` (H clos, finReel, cours_actif nul), plus le journal et l'état ─── */
function dr_cloreFin(){
  if (typeof AT_DR_COURS === 'undefined' || !AT_DR_COURS || AT_DR_REGIME !== 'classe') return;
  const C = dr_cheminC(), ch = dr_cheminH(); S.finReel = Date.now(); S.closPar = null;
  const p = dr_paquetHeure(true), jr = dr_journalHub(), et = dr_etatHeure();
  const hClose = S.heure; const cleH = ch ? String(ch).split('/').pop() : null;
  if (ch && p) dr_paquetPatch(ch, p, 'Heure close — ' + p.creneau + ' (' + p.classe + ')');   /* C16 (㊱) : en PATCH, `H/absents` n'est pas touché */
  if (C && p) try { dr_reactApresCloture(C, hClose + 1, { cle: cleH, paquet: p }); } catch (e) {}   /* §12.26-1 : la diapo de l'heure h+1, construite depuis le paquet qui vient d'être clos — le paquet local prime sur le hub chez E4 (poussée 102 : aussi en mode test, où le hub ne le portera jamais) —, écrite dans la copie */
  if (C) { dr_ecrire(C + '/journal', jr, 'Le journal de l’heure, à la clôture', () => {}); dr_ecrire(C + '/etat', et, 'L’état de l’heure, à la clôture', () => {}); }
  [DR_CL.jT, DR_CL.eT, DR_CL.tT, DR_CL.cT].forEach(clearTimeout);
  try { window.AT_DR_DERNIER = { level: (AT.edChap || {}).level, chnum: (AT.edChap || {}).chnum, snum: ATVUES.snum, classe: AT_DR_COURS.classeSlug, ts: Date.now() }; } catch (e) {}
  DR_CL.cleClose = ch; dr_joueeIci(ch, true); DR_CL.creneauClos = dr_creneauDuCours(AT_DR_COURS); DR_CL.closVu = DR_CL.closVu || {}; DR_CL.closVu[ch] = true; try { const hu = document.getElementById('hou'); if (hu) hu.textContent = dr_entete(S.heure) + ' · close'; } catch (e) {}   /* réveil n°6 (E4 ligne 119) : l'entête dit que l'heure est close */   /* la clé de l'heure close dans cette page : « ▶ Lancer » ne la repropose pas */
  try { dr_ongletClos(); } catch (e) {}   /* §12.28-3 (d) : les autres onglets retirent le bandeau, le miroir local tombe */
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
    if (Array.isArray(ecr)) dr_copieDuHub(ecr);   /* C16 (retour sûr) : le canon des diapos d'ouverture, ce que la classe a écrit (dr-socle.js) */
    cb({ ecrans: Array.isArray(ecr) ? ecr : null, S: dr_copieEtatDuHub(dr_etatRempli(dr_duHub((et || {}).S || {})), Array.isArray(ecr) ? ecr : []), parDiapo: dr_parDiapoRempli(dr_duHub((et || {}).parDiapo || {})), vuMax: dr_duHub((et || {}).vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub), maj: (et || {}).maj || null, heures: dr_duHub((et || {}).heures || {}), reactivations: dr_duHub((et || {}).reactivations || {}), heuresParDurees: (et || {}).heuresParDurees || 0 });
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
      try { const er = E[(a.diapos || [])[0]]; if (a.pseudo && er && er.role === 'reactivation') { const tt = l.querySelector('.dur-t'); if (tt && /^A/.test(tt.textContent)) { tt.textContent = '↺ ' + (er.act || 'Réactivation'); tt.title = 'La réactivation construite : pas une activité, pas de numéro (§12.22, RC15)'; } } } catch (x) {}   /* RC15 : la réactivation n'a pas de numéro d'activité dans « Où on en est » (le gabarit du socle numérote toute ligne) */
      const ds = (a.diapos || []).filter(i => E[i]); const tot = ds.reduce((t, i) => t + elements(E[i]).length, 0), vus = ds.reduce((t, i) => t + Math.min(elements(E[i]).length, ((parDiapo[K(i)] || {}).nDev || 0)), 0);
      const reel = Math.round(tempsActiviteSec(a) / 60), prevu = dureeDe(a);
      let x = l.querySelector('.dr-avance'); if (!x) { x = document.createElement('span'); x.className = 'dr-avance'; l.appendChild(x); }
      x.textContent = vus + '/' + tot + ' · ' + reel + '/' + prevu + ' min';
      x.title = 'Activité ' + a.num + ' : ' + vus + ' élément' + (vus > 1 ? 's' : '') + ' dévoilé' + (vus > 1 ? 's' : '') + ' sur ' + tot + ', ' + reel + ' min passées pour ' + prevu + ' prévues (le temps mis à part pendant une coupure ne compte pas).';
      x.classList.toggle('dr-plus', reel > prevu);
    });
  } catch (e) {}
}
if (typeof ouOnEnEst === 'function' && !ouOnEnEst.__dr) { const dr_ouOnEnEst0 = ouOnEnEst; window.ouOnEnEst = function () { const r = dr_ouOnEnEst0.apply(this, arguments); dr_avanceActivites(); dr_ouPreparation(); return r; }; window.ouOnEnEst.__dr = true; }

/* ═══ §12.70 — LE MINUTEUR, UN SEUL, SOUS LA DIAPO (Paul, 29/10 10:17-10:36 ; 13 · 92) ════════════════════════════════════════════════
   Le ⏱ sous la diapo (`#bchrono`) est LE minuteur : la durée, « Départ », « ⏸ Pause » / « ▶ Reprendre », « au tableau », « ■ ». Le ⏱ de l'en-tête
   (`#dr-minut-b`) et le « ⏱ 07:00 » en dur (`basculerChrono`) sont tombés ; le bandeau aussi (`S.bandeau` ne sert plus au minuteur).
   « au tableau » coché : la durée réglée paraît aussitôt au tableau, immobile ; « Départ » la fait courir. Le pilote n'envoie qu'aux gestes
   (cocher, régler, Départ, Pause, Reprendre, ■) : la fin, la durée, la pause ; chaque tableau compte avec sa propre horloge, recalée sur celle
   du pilote (dr-tableau.js, `dr_tabMinut…`). Couleurs : vert, jaune au premier tiers écoulé, orange au deuxième, rouge clignotant sur le dernier
   dixième. Le son sort du pilote : cinq bips discrets sur les cinq dernières secondes, un ding fort à 0. Redessin (§12.56 (1)) : posé une fois,
   puis seuls le chiffre, les classes et l'état des boutons changent. Journal : `minuteur` (depart, pause, reprise, arret, fin). ═══ */
DR_CL.minut = null;   /* { etat: 'pret'|'court'|'pause'|'fini', duree, fin (court), reste (pret, pause), tableau, eid, bips } */
const dr_mmss = ms => { const s = Math.max(0, Math.ceil(ms / 1000 - 1e-9)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
const DR_MINUT_BULLE = 'Le chrono : ouvre son réglage sous la diapo — la durée par les + et −, « au tableau » allumé pour que la classe le voie aussitôt (immobile), puis ▶. '
  + '⏸ le met en pause ici et au tableau ; ■ le retire. Il ne change pas l’heure. Il sonne sur ton ordinateur : cinq bips discrets à la fin, un ding à 0.';
/* la phase de couleur, selon la part écoulée du temps donné (§12.70 (7)) */
function dr_minutPhase(reste, duree, etat){ if (etat === 'pret') return 'pret'; if (!(duree > 0)) return 'vert'; const f = Math.ceil(Math.max(0, reste) / 1000 - 1e-9) * 1000 / duree;
  return f > 0.5 ? 'vert' : f > 0.25 ? 'jaune' : f > 0.1 ? 'orange' : 'rouge'; }   /* C16 671 (acceptée) : les crans comptés sur la durée donnée, au chiffre affiché — vert plus de la moitié, jaune jusqu'au quart, orange jusqu'au dixième, rouge le dernier dixième */
function dr_minutReste(m){ m = m || DR_CL.minut; if (!m) return 0; return m.etat === 'court' ? Math.max(0, m.fin - Date.now()) : Math.max(0, m.reste || 0); }
function dr_minutDuree(){ const i = document.getElementById('dr-minut-in'); const v = String(i ? i.value : '05:00').trim().split(':'); const ms = v.length > 1 ? ((+v[0] || 0) * 60 + (+v[1] || 0)) * 1000 : (+v[0] || 0) * 60000; return ms > 0 ? ms : 0; }
/* ce qui part au tableau (rien si « au tableau » n'est pas coché) : d durée, e état, f fin (horloge du pilote), r reste */
function dr_minuteurEtat(){ const m = DR_CL.minut; if (!m || !m.tableau) return null; const o = { d: m.duree, e: m.etat }; if (m.etat === 'court') o.f = m.fin; else o.r = Math.max(0, m.reste || 0);
  const ps = dr_minutPos(); if (ps) { o.x = ps.x; o.y = ps.y; o.s = dr_minutTaille(); } return o; }   /* §12.70 bis : la place et la taille de la pastille, en parts de la diapo */
function dr_minuteurPoser(){
  const bc = document.getElementById('bchrono'); if (!bc) return;
  if (bc.title !== DR_MINUT_BULLE) bc.title = DR_MINUT_BULLE;
  if (document.getElementById('dr-minut')) return;
  const b = document.createElement('span'); b.id = 'dr-minut'; b.className = 'dr-minut';
  b.innerHTML = '<b id="dr-minut-aff" class="dr-minut-aff" title="Le minuteur : ce qui reste"></b>'
    + '<span id="dr-minut-p" class="dr-minut-p" style="display:none">'
    + '<input id="dr-minut-in" type="hidden" value="05:00">'
    + '<svg class="dr-mr-anneau" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="14"/><circle class="dr-pp-anneau" cx="80" cy="80" r="64" fill="none" stroke="#4f9d5d" stroke-width="14" stroke-linecap="round" transform="rotate(-90 80 80)"/></svg>'
    + '<span class="dr-mr-chifs" title="La durée du chrono : chaque chiffre a son + et son −, ou un clic sur le chiffre puis le clavier ; quand il court, ce qui reste">' + '<span class="dr-mr-dig"><button class="dr-mr-pm" data-d="600" data-l="une dizaine de minutes" title="Ajoute une dizaine de minutes à la durée">+</button><b data-k="dm"></b><button class="dr-mr-pm" data-d="-600" data-l="une dizaine de minutes" title="Retire une dizaine de minutes à la durée">−</button></span>' + '<span class="dr-mr-dig"><button class="dr-mr-pm" data-d="60" data-l="une minute" title="Ajoute une minute à la durée">+</button><b data-k="m"></b><button class="dr-mr-pm" data-d="-60" data-l="une minute" title="Retire une minute à la durée">−</button></span>' + '<b class="dr-mr-dp">:</b>' + '<span class="dr-mr-dig"><button class="dr-mr-pm" data-d="10" data-l="une dizaine de secondes" title="Ajoute une dizaine de secondes à la durée">+</button><b data-k="ds"></b><button class="dr-mr-pm" data-d="-10" data-l="une dizaine de secondes" title="Retire une dizaine de secondes à la durée">−</button></span>' + '<span class="dr-mr-dig"><button class="dr-mr-pm" data-d="1" data-l="une seconde" title="Ajoute une seconde à la durée">+</button><b data-k="s"></b><button class="dr-mr-pm" data-d="-1" data-l="une seconde" title="Retire une seconde à la durée">−</button></span>' + '</span>'
    + '<button class="dr-mr-go" id="dr-minut-go" title="Lance le chrono ; si « au tableau » est allumé, il court aussi au tableau">▶</button>'
    + '<button class="dr-mr-stop" id="dr-minut-stop" title="Arrête le chrono et le retire du tableau (la durée réglée reste pour la prochaine fois)">■</button>'
    + '<label class="dr-mr-tog" title="Allumé : la classe voit le chrono au tableau, dès maintenant, même avant ▶ ; éteint : il disparaît du tableau et continue ici"><input type="checkbox" id="dr-minut-tab"><span>au tableau</span></label></span>';
  bc.insertAdjacentElement('afterend', b);
  /* §12.70 bis (Paul, 04/11 16:54) : le réglage vit en rangée sous la barre de la diapo, au-dessus des notes — jamais sur la diapo */
  const pn = b.querySelector('#dr-minut-p'); if (pn && bc.parentElement) bc.parentElement.insertAdjacentElement('afterend', pn);
  /* les clics passent par un seul écouteur, posé une fois (§12.56 (1)(e)) */
  [b, pn].forEach(x => x && x.addEventListener('click', ev => { const t = ev.target && ev.target.closest && ev.target.closest('button'); if (!t) return; ev.stopPropagation();
    const m0 = DR_CL.minut; if (t.id === 'dr-minut-go') { if (m0 && (m0.etat === 'court' || m0.etat === 'pause')) dr_minuteurPause(); else dr_minuteurDepart(); } else if (t.id === 'dr-minut-stop') dr_minuteurArret(); else if (t.dataset.d) dr_minutRegler(+t.dataset.d); }));
  if (pn) pn.addEventListener('click', ev => { const c = ev.target && ev.target.closest && ev.target.closest('.dr-mr-dig b'); if (c) dr_minutChoisir(c.dataset.k); });   /* C16 681 : la frappe */
  const $m = id => document.getElementById(id);
  $m('dr-minut-tab').addEventListener('change', () => { const on = $m('dr-minut-tab').checked; let m = DR_CL.minut;
    if (!m) { if (!on) return; const d = dr_minutDuree(); if (!d) return; m = DR_CL.minut = { etat: 'pret', duree: d, reste: d, tableau: true, eid: (ecran() || {}).eid, bips: {} }; }   /* §12.70 (2) : coché avant « Départ », la durée paraît aussitôt au tableau, immobile */
    else m.tableau = on;
    if (!on && m.etat === 'pret') DR_CL.minut = null;
    dr_minuteurEnvoyer(); dr_minuteurAfficher(); });
  dr_minuteurAfficher();
}
/* le panneau s'ouvre sous la main, au-dessus du ⏱ (position fixe, calculée à l'ouverture seulement) */
function dr_minuteurPanneau(ouvrir){ dr_minuteurPoser(); const p = document.getElementById('dr-minut-p'), bc = document.getElementById('bchrono'); if (!p || !bc) return;
  if (ouvrir === undefined) ouvrir = p.style.display === 'none';
  if (!ouvrir) { p.style.display = 'none'; return; }
  p.style.display = 'flex';   /* §12.70 bis : en rangée sous la barre, à sa place dans la page (plus de position calculée) */
}
function dr_minuteurBasculer(){ dr_minuteurPanneau(); }
function dr_minuteurDepart(){ DR_CL.minutSel = null; if (document.getElementById('dr-minut-in') && !dr_minutDuree()) { dr_minuteurAfficher(); return; } const d = (DR_CL.minut && DR_CL.minut.etat === 'pret') ? (dr_minutDuree() || DR_CL.minut.duree) : dr_minutDuree(); if (!d) return;
  const tab = !!(document.getElementById('dr-minut-tab') || {}).checked;
  DR_CL.minut = { etat: 'court', duree: d, fin: Date.now() + d, tableau: tab, eid: (ecran() || {}).eid, bips: {} };
  dr_sonPreparer(); try { journal('minuteur', { action: 'depart', duree: Math.round(d / 1000), tableau: tab }); } catch (e) {}
  dr_minuteurEnvoyer(); dr_minuteurAfficher(); dr_minuteurBoucle(); dr_minuteurPanneau(false); }   /* §12.70 bis : lancé, le réglage se cache derrière le ⏱ */
function dr_minuteurPause(){ const m = DR_CL.minut; if (!m) return;
  if (m.etat === 'court') { m.reste = Math.max(0, m.fin - Date.now()); m.etat = 'pause'; delete m.fin; try { journal('minuteur', { action: 'pause', reste: Math.round(m.reste / 1000) }); } catch (e) {} }
  else if (m.etat === 'pause') { m.fin = Date.now() + m.reste; m.etat = 'court'; delete m.reste; dr_sonPreparer(); try { journal('minuteur', { action: 'reprise' }); } catch (e) {} }
  else return;
  dr_minuteurEnvoyer(); dr_minuteurAfficher(); dr_minuteurBoucle(); }
function dr_minuteurArret(){ const m = DR_CL.minut; if (m && m.etat !== 'pret') { try { journal('minuteur', { action: 'arret', reste: Math.round(dr_minutReste(m) / 1000) }); } catch (e) {} } dr_minuteurFin(); dr_minuteurPanneau(false); }
function dr_minuteurFin(){ clearTimeout(DR_CL.minutFinT); DR_CL.minut = null; const t = document.getElementById('dr-minut-tab'); if (t) t.checked = false; dr_minuteurEnvoyer(); dr_minuteurAfficher(); dr_minuteurBoucle(); }
/* l'envoi aux tableaux, aux gestes seulement : la fenêtre locale tout de suite, le tableau distant par la scène (sans attendre le débounce) ;
   en répétition et en mode test, la scène part par leur propre veille (250 ms), qui lit `dr_minuteurEtat` dans `dr_scene` */
function dr_minuteurEnvoyer(){ dr_minutPosPoser(); try { if (typeof dr_tabPoste === 'function') dr_tabPoste({ minut: dr_minuteurEtat(), t: Date.now() }); } catch (e) {}   /* la fenêtre du tableau et « Ce que voit la classe » */
  try { if (typeof dr_sceneAuto === 'function') dr_sceneAuto(true); } catch (e) {}
  try { if (typeof dr_ttEmettre === 'function' && typeof DR_TT !== 'undefined' && DR_TT.sig) dr_ttEmettre(); } catch (e) {}
  try { if (typeof dr_repEmettre === 'function' && typeof DR_REP !== 'undefined' && DR_REP.sig) dr_repEmettre(); } catch (e) {} }
/* au pilote : le chiffre, sa couleur, l'état des boutons — seulement ce qui change */
function dr_minuteurAfficher(){ const m = DR_CL.minut; const a = document.getElementById('dr-minut-aff'); const set = (el, k, v) => { if (el && el[k] !== v) el[k] = v; };
  const reste = dr_minutReste(m); const txt = !m ? '' : m.etat === 'fini' ? '00:00' : dr_mmss(m.etat === 'pret' ? m.duree : reste);
  set(a, 'textContent', txt); set(a, 'className', 'dr-minut-aff' + (m ? ' dr-minut-' + (m.etat === 'fini' ? 'rouge' : dr_minutPhase(reste, m.duree, m.etat)) + (m.etat === 'pause' ? ' dr-minut-enpause' : '') : ''));
  if (a) { const ti = !m ? 'Le minuteur : ce qui reste' : 'Le minuteur : ' + txt + (m.etat === 'pret' ? ' réglées, pas encore parti' : m.etat === 'pause' ? ' restantes, en pause' : m.etat === 'fini' ? ', fini' : ' restantes') + ' sur ' + dr_mmss(m.duree) + (m.tableau ? ' — montré au tableau' : ''); set(a, 'title', ti); }
  dr_minutReglAfficher(m, reste);
  const bg = document.getElementById('dr-minut-go'); if (bg) { const c = !!(m && m.etat === 'court'); set(bg, 'textContent', c ? '⏸' : '▶'); const z = !c && !(m && m.etat === 'pause') && !dr_minutDuree(); set(bg, 'disabled', z); set(bg, 'title', z ? 'Grisé : la durée est 00:00 — tape ou règle une durée d’abord' : c ? 'Met le chrono en pause, ici et au tableau ; un second clic le fait repartir là où il était' : m && m.etat === 'pause' ? 'Fait repartir le chrono là où il était, ici et au tableau' : 'Lance le chrono ; si « au tableau » est allumé, il court aussi au tableau'); }
  const tb = document.getElementById('dr-minut-tab'); if (tb && document.activeElement !== tb) { const v = !!(m && m.tableau); if (tb.checked !== v && m) tb.checked = v; }
  const bc = document.getElementById('bchrono'); if (bc) bc.classList.toggle('actif', !!m); dr_minutPP(); }
/* la boucle du pilote : seulement quand le minuteur court ; elle ne pose que le chiffre et joue le son */
function dr_minuteurBoucle(){ const m = DR_CL.minut; const court = !!(m && m.etat === 'court');
  if (court && !DR_CL.minutT) DR_CL.minutT = setInterval(dr_minuteurTic, 100); else if (!court && DR_CL.minutT) { clearInterval(DR_CL.minutT); DR_CL.minutT = null; } }
function dr_minuteurTic(){ const m = DR_CL.minut; if (!m || m.etat !== 'court') { dr_minuteurBoucle(); return; } const reste = m.fin - Date.now();
  const sec = Math.ceil(reste / 1000 - 1e-9); if (sec >= 1 && sec <= 5 && !m.bips[sec]) { m.bips[sec] = true; if (reste > (sec - 1) * 1000 + 600) dr_son('bip'); }   /* cinq bips discrets, un par seconde (pas de rattrapage d'un bip manqué de plus d'une demi-seconde) */
  if (reste <= 0) { m.etat = 'fini'; m.reste = 0; delete m.fin; dr_son('ding'); try { journal('minuteur', { action: 'fin' }); } catch (e) {} dr_minuteurEnvoyer(); clearTimeout(DR_CL.minutFinT); DR_CL.minutFinT = setTimeout(() => { if (DR_CL.minut && DR_CL.minut.etat === 'fini') dr_minuteurFin(); }, 4000); }
  dr_minuteurAfficher(); dr_minuteurBoucle(); }
/* le son, du pilote (Paul, 10:36 : « si, de mon pilote ») — Web Audio, préparé au geste de « Départ » (le navigateur l'exige) */
function dr_sonPreparer(){ try { const C = window.AudioContext || window.webkitAudioContext; if (!C) return; if (!DR_CL.son) DR_CL.son = new C(); if (DR_CL.son.state === 'suspended') DR_CL.son.resume(); } catch (e) {} }
function dr_son(quoi){ try { const c = DR_CL.son; if (!c) return; const t = c.currentTime; DR_CL.sons = (DR_CL.sons || 0) + 1;
  const note = (f, g, d, t0) => { const o = c.createOscillator(), v = c.createGain(); o.type = 'sine'; o.frequency.value = f; v.gain.setValueAtTime(0.0001, t0); v.gain.exponentialRampToValueAtTime(g, t0 + 0.01); v.gain.exponentialRampToValueAtTime(0.0001, t0 + d); o.connect(v); v.connect(c.destination); o.start(t0); o.stop(t0 + d + 0.05); };
  if (quoi === 'bip') note(880, 0.06, 0.12, t); else { note(1318.5, 0.5, 1.6, t); note(659.3, 0.35, 1.8, t); note(1975.5, 0.15, 0.9, t); } } catch (e) {} }
function dr_temoinPoser(){ const h = document.getElementById('hou'); if (!h || document.getElementById('dr-integre')) return; const t = document.createElement('span'); t.id = 'dr-integre'; t.className = 'dr-integre-ok'; t.style.marginLeft = '8px'; t.title = 'Le témoin d’intégrité : il dit si ce que la classe a vu est bien au hub, tel quel.'; h.insertAdjacentElement('afterend', t); if (DR_CL.empreinte) dr_temoinIntegre(DR_CL.empreinte); }
setInterval(() => { try { if (S.lancee && AT_DR_REGIME === 'classe') dr_temoinPoser(); dr_minuteurPoser(); } catch (e) {} }, 1000);   /* §12.70 : le minuteur se pose sous la diapo (une fois) ; sa boucle ne tourne que quand il court */

/* ═══ §12.70 bis — LA PASTILLE (Paul, 04/11 16:54 ; C16 658, 17:00 « ok ») ═══════════════════════════════════════════════════════════════
   Au tableau, une pastille ronde or sur brun, un anneau qui se vide, posée d'elle-même dans un coin libre de la diapo (sans texte) ; sur la diapo
   du pilote, la même, au même endroit. Paul la glisse sur la diapo du pilote : elle glisse au tableau. Le zoom du réglage change sa taille ici et
   au tableau ensemble. La dernière minute : le rouge du site. La place et la taille partent au tableau en parts de la diapo (x, y : le coin haut
   gauche ; s : la largeur), jamais en pixels. ═══ */
DR_CL.minutPos = null;   /* { eid, x, y } */
DR_CL.minutS = 420 / 1920;   /* C16 677 : la largeur du rectangle en part de la diapo (420 px sur 1920, P6) ; sa hauteur est le tiers de sa largeur */
function dr_minutTaille(){ return DR_CL.minutS || 420 / 1920; }
const DR_MINUT_CRANS = { pret: '#4f9d5d', vert: '#4f9d5d', jaune: '#e0b83a', orange: '#e07b2e', rouge: '#e8484c' };
/* le réglage sous la diapo (P6) : les quatre chiffres (la durée, ou ce qui reste quand il court), leurs + et − (grisés avec leur raison), l'anneau */
function dr_minutReglAfficher(m, reste){ const p = document.getElementById('dr-minut-p'); if (!p) return; const court = !!(m && (m.etat === 'court' || m.etat === 'pause'));
  const ms = court ? reste : m && m.etat === 'fini' && !DR_CL.minutSel ? 0 : dr_minutDuree(); const t = dr_mmss(ms).replace(':', ''); const K = { dm: t[0], m: t[1], ds: t[2], s: t[3] };
  if (court && DR_CL.minutSel) DR_CL.minutSel = null;
  p.querySelectorAll('.dr-mr-dig b').forEach(b => { const v = K[b.dataset.k]; if (b.textContent !== v) b.textContent = v; const on = DR_CL.minutSel === b.dataset.k; if (b.classList.contains('dr-mr-sel') !== on) b.classList.toggle('dr-mr-sel', on);
    const ti = court ? 'Le chrono est parti : ■ d’abord pour changer la durée' : on ? 'Tape un chiffre au clavier : il remplace celui-ci et on passe au suivant ; Échap ou un clic ailleurs termine' : 'Clique sur ce chiffre, puis tape au clavier : il est remplacé et on passe au suivant ; Échap ou un clic ailleurs termine'; if (b.title !== ti) b.title = ti; });
  const s0 = Math.round(dr_minutDuree() / 1000); p.querySelectorAll('.dr-mr-pm').forEach(b => { const d = +b.dataset.d, n = s0 + d; const off = court || n < 1 || n > 5999; if (b.disabled !== off) b.disabled = off;
    const ti = court ? 'Grisé : le chrono est parti — ■ d’abord pour changer la durée' : n < 1 ? 'Grisé : la durée ne peut pas descendre sous une seconde' : n > 5999 ? 'Grisé : la durée ne peut pas dépasser 99:59' : (d > 0 ? 'Ajoute ' : 'Retire ') + b.dataset.l + ' à la durée';
    if (b.title !== ti) b.title = ti; });
  const an = p.querySelector('.dr-pp-anneau'); if (an) dr_minutAnneau(an, m ? (m.etat === 'fini' ? 0 : reste) : dr_minutDuree(), m ? m.duree : dr_minutDuree(), m ? m.etat : 'pret'); }
function dr_minutRegler(d){ const m = DR_CL.minut; if (m && (m.etat === 'court' || m.etat === 'pause')) return; const i = document.getElementById('dr-minut-in'); if (!i) return;
  const n = Math.round(dr_minutDuree() / 1000) + d; if (n < 1 || n > 5999) return; i.value = dr_mmss(n * 1000);
  if (m && m.etat === 'pret') { m.duree = m.reste = n * 1000; dr_minuteurEnvoyer(); } dr_minuteurAfficher(); }
/* C16 681 (Paul, 19:47) : la frappe reprise de l'ancien réglage — un clic sur un des quatre chiffres le désigne ; un chiffre tapé le remplace et passe au
   suivant (après le dernier, c'est fini) ; Échap, Entrée ou un clic ailleurs termine ; les + et − restent. Le chiffre des dizaines de secondes va de 0 à 5. */
DR_CL.minutSel = null; const DR_MINUT_K = ['dm', 'm', 'ds', 's'];
function dr_minutChoisir(k){ const m = DR_CL.minut; if (m && (m.etat === 'court' || m.etat === 'pause')) k = null; DR_CL.minutSel = DR_MINUT_K.indexOf(k) >= 0 ? k : null; dr_minuteurAfficher(); }
function dr_minutTaper(ch){ const k = DR_CL.minutSel, i = document.getElementById('dr-minut-in'); const j = DR_MINUT_K.indexOf(k); if (j < 0 || !i) return;
  if (k === 'ds' && ch > '5') return; const t = dr_mmss(dr_minutDuree()).replace(':', '').split(''); t[j] = ch; const n = (+(t[0] + t[1])) * 60 + (+(t[2] + t[3]));
  i.value = t[0] + t[1] + ':' + t[2] + t[3]; const m = DR_CL.minut; if (m && m.etat === 'pret' && n >= 1) { m.duree = m.reste = n * 1000; dr_minuteurEnvoyer(); }
  DR_CL.minutSel = DR_MINUT_K[j + 1] || null; dr_minuteurAfficher(); }
window.addEventListener('keydown', ev => { try { if (!DR_CL.minutSel) return; if (ev.ctrlKey || ev.metaKey || ev.altKey) return; const k = ev.key; let pris = true;
  if (/^[0-9]$/.test(k)) dr_minutTaper(k); else if (k === 'Escape' || k === 'Enter') dr_minutChoisir(null);
  else if (k === 'ArrowRight' || k === 'ArrowLeft' || k === 'Backspace') { const j = DR_MINUT_K.indexOf(DR_CL.minutSel) + (k === 'ArrowRight' ? 1 : -1); dr_minutChoisir(DR_MINUT_K[Math.max(0, Math.min(3, j))]); }
  else pris = false; if (pris) { ev.preventDefault(); ev.stopImmediatePropagation(); } } catch (e) {} }, true);
document.addEventListener('click', ev => { try { if (DR_CL.minutSel && !(ev.target && ev.target.closest && ev.target.closest('#dr-minut-p .dr-mr-dig b'))) dr_minutChoisir(null); } catch (e) {} }, true);
/* l'anneau : la part qui reste de la durée donnée, la couleur du cran */
function dr_minutAnneau(an, reste, duree, etat){ const ph = etat === 'fini' ? 'rouge' : dr_minutPhase(reste, duree, etat); const c = DR_MINUT_CRANS[ph] || DR_MINUT_CRANS.vert;
  if (an.getAttribute('stroke') !== c) an.setAttribute('stroke', c);
  const f = etat === 'pret' ? 1 : duree > 0 ? Math.max(0, Math.min(1, reste / duree)) : 0; const L = 2 * Math.PI * 64; const da = (f * L).toFixed(1) + ' ' + L.toFixed(1); if (an.getAttribute('stroke-dasharray') !== da) an.setAttribute('stroke-dasharray', da); }
function dr_minutPos(){ const p = DR_CL.minutPos; return p && isFinite(p.x) && isFinite(p.y) ? p : null; }
function dr_minutPastilleHTML(){ return '<svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="14"/>'
  + '<circle class="dr-pp-anneau" cx="80" cy="80" r="64" fill="none" stroke="#4f9d5d" stroke-width="14" stroke-linecap="round" transform="rotate(-90 80 80)"/></svg><span class="dr-pp-chif"></span>'; }   /* C16 677 : le rectangle P6 — l'anneau à gauche, le décompte à côté */
/* le chiffre, l'anneau, la couleur — seulement ce qui change ; servi aussi au tableau (dr-tableau.js) */
function dr_minutPastilleMaj(el, txt, reste, duree, etat){ const ch = el.querySelector('.dr-pp-chif'), an = el.querySelector('.dr-pp-anneau'); if (!ch || !an) return;
  if (ch.textContent !== txt) ch.textContent = txt; dr_minutAnneau(an, reste, duree, etat);   /* le décompte reste or ; l'anneau prend la couleur du cran */
  const clig = etat === 'court' && dr_minutPhase(reste, duree, etat) === 'rouge'; if (el.classList.contains('dr-pp-clig') !== clig) el.classList.toggle('dr-pp-clig', clig); }   /* C16 696 (Paul, 04/11 : « il faut garder le clignotement ») : rouge et en marche, le rectangle clignote, comme l'ancien chrono */
/* le coin libre : le premier des quatre coins de la diapo où la pastille ne touche aucun texte (en bas à droite d'abord) */
function dr_minutCoin(){ const mur = document.getElementById('mur'); if (!mur) return null; const r = mur.getBoundingClientRect(); if (!r.width) return null; const L = [];
  const w = document.createTreeWalker(mur, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement || n.parentElement.offsetParent === null) continue; const rg = document.createRange(); rg.selectNodeContents(n); Array.from(rg.getClientRects()).forEach(q => L.push(q)); }
  const S2 = dr_minutTaille() * r.width, H2 = S2 / 3, M = 0.0125 * r.width; const C = [[r.right - M - S2, r.bottom - M - H2], [r.right - M - S2, r.top + M], [r.left + M, r.bottom - M - H2], [r.left + M, r.top + M]];
  const k = C.find(([x, y]) => !L.some(q => Math.min(q.right, x + S2) - Math.max(q.left, x) > 0 && Math.min(q.bottom, y + H2) - Math.max(q.top, y) > 0)) || C[0];
  return { x: (k[0] - r.left) / r.width, y: (k[1] - r.top) / r.height }; }
function dr_minutPosPoser(){ const m = DR_CL.minut; if (!m || !m.tableau) return; const eid = (ecran() || {}).eid; const p = dr_minutPos(); if (p && p.eid === eid) return; const c = dr_minutCoin(); if (c) DR_CL.minutPos = { eid, x: c.x, y: c.y }; dr_minutBorner(); }
function dr_minutBorner(){ const p = dr_minutPos(); if (!p) return; const mur = document.getElementById('mur'); const r = mur ? mur.getBoundingClientRect() : null; const k = r && r.height ? r.width / r.height : 16 / 9; const s = dr_minutTaille();
  p.x = Math.max(0, Math.min(1 - s, p.x)); p.y = Math.max(0, Math.min(1 - s * k / 3, p.y)); }
/* la pastille du pilote : sur la diapo, à la place qu'elle a au tableau ; montrée seulement quand la classe la voit (« au tableau ») */
function dr_minutPP(){ const m = DR_CL.minut, p = dr_minutPos(); let el = document.getElementById('dr-minut-pp'); const mur = document.getElementById('mur'); const r = mur ? mur.getBoundingClientRect() : null;
  if (!m || !m.tableau || !p || !r || !r.width) { if (el && el.style.display !== 'none') el.style.display = 'none'; return; }
  if (!el) { el = document.createElement('div'); el.id = 'dr-minut-pp'; el.className = 'dr-pp dr-minut-pp'; el.innerHTML = dr_minutPastilleHTML();
    el.title = 'Le chrono, tel que la classe le voit au tableau : glisse-le, il se déplace au tableau en même temps ; tire un coin pour l’agrandir ou le réduire, au tableau aussi';
    ['nw', 'ne', 'sw', 'se'].forEach(c => { const k = document.createElement('i'); k.className = 'dr-pp-poi dr-pp-' + c; k.dataset.c = c; k.title = 'Tire ce coin pour agrandir ou réduire le chrono : au tableau aussi, à la même taille'; el.appendChild(k); });
    document.body.appendChild(el); dr_minutGlisser(el); }
  const s = dr_minutTaille() * r.width, hh = s / 3; const set = (k, v) => { if (el.style[k] !== v) el.style[k] = v; };
  set('display', 'flex'); set('left', (r.left + p.x * r.width).toFixed(1) + 'px'); set('top', (r.top + p.y * r.height).toFixed(1) + 'px'); set('width', s.toFixed(1) + 'px'); set('height', hh.toFixed(1) + 'px'); set('fontSize', hh.toFixed(1) + 'px');
  const reste = dr_minutReste(m); dr_minutPastilleMaj(el, m.etat === 'fini' ? '00:00' : dr_mmss(m.etat === 'pret' ? m.duree : reste), reste, m.duree, m.etat); }
/* glisser à la souris : la place suit la main ici, part à la fenêtre du tableau toutes les 120 ms, et au tableau distant au lâcher */
function dr_minutGlisser(el){ let g = null, dernier = 0;
  el.addEventListener('pointerdown', ev => { const p = dr_minutPos(); const mur = document.getElementById('mur'); if (!p || !mur) return; ev.preventDefault(); ev.stopPropagation(); const r = mur.getBoundingClientRect();
    const c = ev.target && ev.target.dataset ? ev.target.dataset.c : null; g = { c, x0: ev.clientX, y0: ev.clientY, px: p.x, py: p.y, ps: dr_minutTaille(), w: r.width, h: r.height }; try { el.setPointerCapture(ev.pointerId); } catch (e) {} el.classList.add('glisse'); });
  el.addEventListener('pointermove', ev => { if (!g) return; const p = dr_minutPos(); if (!p) return; const dx = ev.clientX - g.x0, dy = ev.clientY - g.y0;
    if (g.c) { const sx = /e$/.test(g.c) ? 1 : -1, sy = /^s/.test(g.c) ? 1 : -1; const dw = Math.abs(dx) >= Math.abs(dy) * 3 ? sx * dx : sy * dy * 3;   /* le coin opposé ne bouge pas ; la largeur garde trois fois la hauteur */
      const s = Math.max(0.09, Math.min(0.6, g.ps + dw / g.w)); DR_CL.minutS = s; p.x = sx > 0 ? g.px : g.px + g.ps - s; p.y = sy > 0 ? g.py : g.py + (g.ps - s) * g.w / g.h / 3; }
    else { p.x = g.px + dx / g.w; p.y = g.py + dy / g.h; } p.eid = (ecran() || {}).eid; dr_minutBorner(); dr_minutPP();
    const t = Date.now(); if (t - dernier > 120) { dernier = t; try { if (typeof dr_tabPoste === 'function') dr_tabPoste({ minut: dr_minuteurEtat(), t: Date.now() }); } catch (e) {} } });
  const fin = () => { if (!g) return; g = null; el.classList.remove('glisse'); dr_minuteurEnvoyer(); };
  el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', fin); el.addEventListener('click', ev => ev.stopPropagation()); }
setInterval(() => { try { if (DR_CL.minut) dr_minutPP(); } catch (e) {} }, 250);   /* la pastille suit la diapo du pilote quand la page bouge */

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
function tick(){ if ((document.getElementById('fin').parentElement === document.getElementById('ecran-fin') && document.getElementById('ecran-fin').classList.contains('on'))) { dr_poseSi($('heure'), 'textContent', hhmm()); return; } if (S.lancee && !S.close && S.ecoule % 15 === 0 && !(document.activeElement && document.activeElement.classList.contains('dur-in'))) { try { ouOnEnEst(); } catch (e) {} } if (!S.lancee) { dr_poseSi($('chr'), 'textContent', '—'); dr_poseSi($('chr'), 'className', ''); dr_poseSi($('heure'), 'textContent', ''); return; }   /* §12.56 (1)(d) : l'horloge ne pose que ce qui change */ if (S.close) { try { if (S.palier) alerteFermer(); } catch (e) {} return; } /* E2 : l'heure close, le chrono s'arrête (relecteur neuf n°2) */ try { if (dr_decisionsSuivre() && document.getElementById('fin') && document.getElementById('fin').offsetParent) ouvrirFin(!!document.getElementById('f-clore')); }   /* E2 (§12.28, B12) : le redessin garde le mode de la séquence (« Clore l'heure » reste) — avant : ouvrirFin() la repassait en « Garder ces décisions » */ catch (e) {} S.ecoule++; if (S.ecoule % 60 === 30) { try { dr_etatAuto(true); } catch (e) {} }   /* le battement de l'état (une écriture par minute) : la reprise sait jusqu'à quand la page vivait */ dr_poseSi($('heure'), 'textContent', hhmm()); const chr = $('chr'); const reste = heureCahier() - dr_nowCase();   /* C16 (515) : les alertes et le compte à rebours, à l'horloge de la case */
  if (S.close || reste > 5 * 60000) { const m = Math.floor(S.ecoule / 60), s = S.ecoule % 60; dr_poseSi(chr, 'textContent', String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')); dr_poseSi(chr, 'className', ''); dr_poseSi(chr, 'title', 'Le temps écoulé depuis le lancement de l\'heure'); return; }
  const abs = Math.abs(reste); const m = Math.floor(abs / 60000), sec = Math.floor((abs % 60000) / 1000); dr_poseSi(chr, 'textContent', (reste >= 0 ? '−' : '+') + m + ':' + String(sec).padStart(2, '0')); dr_poseSi(chr, 'className', reste <= 0 ? 'cr-zero' : reste <= 60000 ? 'cr-t1' : reste <= 180000 ? 'cr-t3' : 'cr-t5'); dr_poseSi(chr, 'title', reste >= 0 ? 'Compte à rebours vers l\'heure du cahier de textes (' + hhmm(heureCahier() - dr_nowCase() + now()) + ')' : 'Le cahier de textes a commencé depuis ' + m + ' min ' + sec + ' s (l\'heure court jusqu\'à Clore)');
  S.paliers = S.paliers || {}; const kk = reste <= 0 ? 'zero' : reste <= 60000 ? 't1' : reste <= 180000 ? 't3' : 't5'; ['t5', 't3', 't1', 'zero'].forEach(k => { const seuil = { t5: 5 * 60000, t3: 3 * 60000, t1: 60000, zero: 0 }[k]; if (reste <= seuil && !S.paliers[k]) { S.paliers[k] = true; dr_palier(k); } }); }

setInterval(tick, 1000);

/* ─── au fil, sans dépendre d'un crochet : en classe, dès que le journal ou l'état bouge, la copie, le journal, l'état et le paquet
   partent (débounce de 900 ms) — `dr_sauve` du socle ne passe pas sur les gestes de classe (parole, dévoilement) ─── */
DR_CL.sig = '';
setInterval(() => { try { if (!dr_clPeutEcrire()) return; const g = J.length + '|' + JSON.stringify(parDiapo).length + '|' + JSON.stringify(S.parts || []).length + '|' + JSON.stringify(S.decisions || {}).length + '|' + (S.notesFil || []).length + '|' + S.di + '|' + (S.finSection || 0) + '|' + S.page + '|' + !!S.enFin + '|' + !!S.preparation;   /* §12.28-3 (e) : la page, la séquence de fin ouverte, la préparation du cahier partent aussi (audit, mission 0 : ils ne partaient qu'avec un autre geste) */
  if (g !== DR_CL.sig) { DR_CL.sig = g; dr_copieAuto(); } } catch (e) {} }, 1000);

/* ─── « ■ Clore l'heure » à côté de « Fin de l'heure » (le « ■ Clore la séance » d'aujourd'hui) : il ouvre la fin de l'heure à
   l'étape 7 — la clôture garde sa garde (ce qui manque et ce que Paul risque, C1 7.0 bis) ; rien ne se clôt sans qu'il l'ait lu ─── */
function dr_clorePoser(){
  const f = document.getElementById('bfin'); if (!f) return; let b = document.getElementById('dr-clore');
  try { dr_annulPoser(); } catch (e) {}   /* §12.68 : « Annuler cette heure », jusqu'à la clôture */
  if (!b) { b = document.createElement('button'); b.id = 'dr-clore'; b.className = f.className; b.textContent = '■ Clore l’heure';
    b.title = 'Clore l’heure : ouvre la dernière étape de la fin de l’heure ; avant de fermer, le site te dit ce qui manque (échéance, travail, récit relu, copie École Directe) et ce que tu risques — tu clos quand même si tu veux.';
    b.onclick = () => { if (!S.lancee || S.close) return; S.finSection = 7; ouvrirFin(true); }; f.insertAdjacentElement('afterend', b); }
  b.style.display = (S.lancee && !S.close && !S.repetition && !S.atelier) ? '' : 'none';
}
setInterval(() => { try { if (typeof S === 'object' && S) dr_clorePoser(); } catch (e) {} }, 500);

/* ─── après la clôture (vu par E4) : « ▶ Lancer l'heure » revient (le socle le cache tant que S.lancee), et ▶ ◀ ⌫ et les flèches
   n'écrivent plus dans le journal de l'heure close : la classe n'est plus là ─── */

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
/* §12.28-3 (a)(e) : l'heure d'une classe s'ouvre dans « la classe en cours » (E1, `dr_ouvrirClasse(niveau, chcle, snum, apres)`) ; tant qu'elle
   n'est pas dans le socle, le chemin d'aujourd'hui (l'Atelier sur son Pilotage). `apres()` quand le pilote est monté. */
function dr_ouvrirLaClasse(niv, chcle, snum, apres){
  if (typeof dr_ouvrirClasse === 'function') { dr_ouvrirClasse(niv, chcle, String(snum), manque => { if (manque) { try { atInfo('Le pilotage ne s’ouvre pas (manque : ' + manque + ').'); } catch (x) {} return; } apres(); }); return; }   /* E1 : `apres(manque)`, null si tout est là ; elle charge les classes et les chapitres */
  try { atelierOuvrir(); } catch (e) {}
  try { atEditerChapitre(niv, chcle); ATVUES.snum = String(snum); atVuesAller('pilotage'); } catch (e) { try { atInfo('Le pilotage ne s’ouvre pas : ' + e.message); } catch (x) {} return; }
  edtQuandPilotagePret(manque => { if (manque) { try { atInfo('Le pilotage ne s’ouvre pas (manque : ' + manque + ').'); } catch (x) {} return; } apres(); });
}
/* contrôle n°68 (E3 retour 60 : « Reprendre » sans l'heure à 1536 / 1920) : mesuré, la reprise aboutit, mais 5 à 10 s après le clic quand la machine
   est chargée (l'écran de la classe charge classes et chapitres, puis quatre lectures au hub) — le banc regardait à 4 s. Les quatre lectures partent
   ensemble (`dr_reprendre`) ; et si un montage tardif remettait l'heure à zéro derrière elle (S.lancee retombé sans clôture), elle se refait une fois. */
function dr_reprendreQuandPret(cb, essai){ essai = essai || 0;
  dr_reprendre(ok => { if (cb) cb(ok); if (!ok) return; const sig = _drSignatureCours(Object.assign(dr_coursActif(), {}));
    setTimeout(() => { try { if (!S.lancee && !S.close && AT_DR_REGIME === 'classe' && _drSignatureCours(dr_coursActif()) === sig) { journal('reprise-refaite'); dr_reprendre(() => {}); } } catch (e) {} }, 1500); }); }
function dr_reprendreCours(c){
  const cours = Object.assign({ debut: c.debut, fin: c.fin, classeSlug: c.classeSlug, classeNom: c.classeNom }, c.iso ? { iso: c.iso } : {}, c.rattrapee && c.iso ? { rattrapee: true } : {});   /* C16 (lot 2a) : une heure rattrapée reprend sous la clé de sa case ; (lot 2c) une heure ordinaire reprise le lendemain aussi — jamais une seconde clé */
  atChargerChapitres(c.niveau, () => {
    AT_DR_COURS = cours; AT_DR_REGIME = 'classe';
    dr_ouvrirLaClasse(c.niveau, c.chapitre, c.seance, () => { AT_DR_COURS = cours; AT_DR_REGIME = 'classe';
      dr_reprendreQuandPret(ok => { if (!ok) atInfo('L’état de cette heure n’est pas au hub : elle ne peut pas être reprise telle quelle.'); }); });
  });
}
/* réveil n°5, A4-4 (C1 6.5, 8.6) : la case close ouvre la Relecture de CETTE heure — la séance, la classe et l'heure de sa trace ; l'atelier
   s'ouvre sans régime « classe » (rien ne s'écrit), la Relecture d'E4 relit la classe au hub (`dr_recitChargerClasse`), puis l'heure n. */
function dr_edtRelire(cle){
  const cel = edtCellule(cle); if (!cel) return; const t = edtCheminTrace(cel.classeMjpc, cel.iso, cel.creneau); if (!t || !t.trace) { atInfo('La trace de cette heure est introuvable.'); return; }
  dr_relireTrace(t.chemin, +t.trace.heure || null);
}
/* §12.66 (3) : la même Relecture, pour la bande de clôture — `chemin` : celui de la copie de la classe (…/deroule_joue/<classe>/…), `h` : l'heure */
function dr_relireTrace(chemin, h){
  const m = /^\/site\/([^/]+)\/chapitres\/([^/]+)\/seances\/([^/]+)\/deroule_joue\/([^/]+)\//.exec(String(chemin || '')); if (!m) return false;
  if (typeof S === 'object' && S && S.lancee && !S.close) { atInfo('Une heure est en cours : relis celle-ci une fois l’heure en cours close.'); return true; }
  try { edtFermer(); edtModaleFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {}
  atChargerChapitres(m[1], () => { atEditerChapitre(m[1], m[2]); ATVUES.snum = String(m[3]);
    edtQuandPilotagePret(manque => { if (manque) { atInfo('La Relecture ne s’ouvre pas (manque : ' + manque + ').'); return; } try { atVuesAller('relecture'); } catch (e) {}
      dr_recitChargerClasse(decodeURIComponent(m[4]), () => { S.face = 'recit'; if (h) S.faceH = h; try { relecture(); } catch (e) {} }); }); });
  return true;
}
function dr_edtReprendre(cle){
  const cel = edtCellule(cle); if (!cel) return; const t = edtCheminTrace(cel.classeMjpc, cel.iso, cel.creneau); if (!t || !t.trace) { atInfo('La trace de cette heure est introuvable.'); return; }
  if (t.trace.clos) { atInfo('Cette heure a été close : elle ne se reprend pas.'); return; }
  const m = /^\/site\/([^/]+)\/chapitres\/([^/]+)\/seances\/([^/]+)\/deroule_joue\/([^/]+)\//.exec(t.chemin); if (!m) return;
  edtFermer(); edtModaleFermer();
  dr_reprendreCours({ niveau: m[1], chapitre: m[2], seance: m[3], classeSlug: m[4], classeNom: t.trace.classe || cel.classeMjpc, debut: t.trace.lanceA || String(cel.creneau).split('-')[0], fin: t.trace.fin || String(cel.creneau).split('-')[1], iso: cel.iso, ...(t.trace.rattrapee ? { rattrapee: true } : {}) });   /* C16 (lot 2c) : la date de la case, rattrapée ou non */
}

/* ─── `dr_proposer()` (contrat §12.6, relance du 21/10) : ce que « ▶ Lancer » va lancer quand on n'est pas passé par l'EDT — la case de
   l'EDT du moment pour ce niveau (aujourd'hui, l'heure en cours ou la prochaine) si c'est bien la séance ouverte ; sinon la première classe
   du niveau, le créneau qui contient maintenant (sinon le 3e), le début proposé, l'heure n de la classe et N = 1. Le bouton le dit. ─── */
function dr_proposer(){
  const niv = (AT.edChap || {}).level; const auj = new Date(); const iso = auj.getFullYear() + '-' + String(auj.getMonth() + 1).padStart(2, '0') + '-' + String(auj.getDate()).padStart(2, '0'); const m = dr_maintenantMn(); let celAutre = null;
  try {
    const cel = Object.values(edtProjeter(iso, 1) || {}).filter(c => c && c.classeMjpc && edtNiveauDe(c.classeMjpc) === niv && (c.nature === 'prevu' || c.nature === 'jouee') && dr_mn(String(c.creneau).split('-')[1]) > m)
      .sort((a, b) => String(a.creneau).localeCompare(String(b.creneau)))[0];
    const titre = (seance() || {}).titre || '';
    if (cel && (cel.snum != null ? dr_estCetteSeance(cel.chCle, cel.snum) : (cel.nature === 'jouee' || !cel.titre || cel.titre === titre))) {   /* E1 (§12.39-1, 13 · 80) : la case est-elle À CETTE SÉANCE ? par sa clé (la projection la porte), jamais par son titre */ const sl = dr_slugDe(cel.classeMjpc);
      let N = cel.sur; if (!N) { try { N = edtHeuresPour(chapitresData[AT.edChap.level][AT.edChap.chnum].seances[ATVUES.snum], cel.creneau); } catch (e) {} }   /* relecteur neuf n°3 (7) : une case jouée ne porte pas `sur` — « heure 2/1 » */
      const hx = (dr_heuresDeLaClasse(sl) || []).find(x => x.iso === iso && x.creneau === cel.creneau);   /* réveil n°14 : la source unique de l'heure n/N (§12.18) — la même que l'Atelier */
      return { classeSlug: sl, classeNom: dr_nomClasse(sl), creneau: cel.creneau, debut: dr_debutPropose(cel.creneau), heure: (hx && hx.n) || cel.heure || dr_heureProposee(sl, cel.creneau), sur: (hx && hx.sur) || Math.max(1, N || 1, cel.heure || 1), depuis: 'edt', clos: !!(cel.nature === 'jouee' && cel.clos) }; }
    if (cel && cel.nature === 'prevu' && cel.titre && dr_mn(String(cel.creneau).split('-')[0]) <= m) celAutre = cel;   /* réveil n°16 (E4 ligne 180) : la case de maintenant est à une autre séance — « Lancer » le dit, jamais « aucune case maintenant » */
  } catch (e) {}
  const sl = dr_classeProposee(); let cr = dr_creneauPropose();
  /* réveil n°13 (E4 lignes 167, 170) : hors d'une case de la classe, jamais le créneau d'une autre classe (le repli sur les créneaux du site, `AT_EDT`) — l'EDT chargé, « Lancer » se grise et nomme la prochaine heure de la classe */
  if (dr_edtPret()) { const hs = (dr_heuresDeLaClasse(sl) || []).find(x => !x.jouee && x.iso && x.creneau); const nx = hs ? { iso: hs.iso, creneau: hs.creneau, l: dr_jourCreneauEnClair(hs.iso, hs.creneau), n: hs.n, sur: hs.sur } : null;   /* réveil n°16 (E4 lignes 177, 180 ; §12.18) : la prochaine heure de CETTE séance, la case que l'EDT lui donne (son fil) — avant, la prochaine case de la classe, quel qu'en soit le fil (« mercredi 16, 10 h 07 », la case du fil « langue ») */
    return { classeSlug: sl, classeNom: dr_nomClasse(sl), creneau: nx ? nx.creneau : cr, debut: nx ? String(nx.creneau).split('-')[0] : dr_debutPropose(cr), heure: 0, sur: 0, depuis: 'aucune', prochaine: nx, maintenant: celAutre && celAutre.classeMjpc === dr_nomClasse(sl) ? celAutre : null }; }
  try { const z = document.getElementById('dr-zone'); if (z && z.offsetParent !== null && AT.edChap && AT.edChap.level) dr_edtAssurer(); } catch (e) {}   /* l'EDT pas encore lu : on le lit — seulement le Pilotage à l'écran, une séance ouverte (la lecture de l'EDT peut mettre la grille à niveau : jamais au chargement de la page, avant que le mode de la session soit posé — K15-test, 01:19) ; d'ici là, le repli d'avant */
  const hp = dr_heureProposee(sl, cr); let N = hp; try { N = edtHeuresPour(chapitresData[AT.edChap.level][AT.edChap.chnum].seances[ATVUES.snum], cr); } catch (e) {}   /* N par la même fonction que la case */
  return { classeSlug: sl, classeNom: dr_nomClasse(sl), creneau: cr, debut: dr_debutPropose(cr), heure: hp, sur: Math.max(1, N, hp), depuis: 'jour' };
}
/* E1 (§12.61 (2), Paul 28/10 14:36 : « toujours edt ») : le bouton « ▶ Lancer » du Pilotage et sa boucle d'une seconde sont retirés — une heure se lance par la case de l'emploi du temps (« ▶ Ouvrir le pilotage et lancer », §12.33) */

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
  (copie || []).forEach((c, i) => { if (!c || vus.has(c.eid) || !(joue(c.eid) || c.role === 'reactivation')) return;   /* retiré de la trame mais joué : il reste, à sa place ; §12.26-2 : la réactivation construite ne vit que dans la copie — gardée même pas encore montrée (construite à la clôture) */
    const prec = (copie[i - 1] || {}).eid; const k = res.findIndex(x => x && x.eid === prec); res.splice(k >= 0 ? k + 1 : res.length, 0, c); });
  return res;
}

/* ─── la séance continue (CADRAGE-TEMPS §1) : la trame réelle met tous ses écrans à l'heure 1 (contrat §12.5) ; à l'heure n > 1, si aucun
   écran ne lui est prévu, ceux que la classe n'a pas encore vus passent à l'heure n, et le socle pose son « Cahier de textes » (relecteur
   neuf n°2 : l'heure 2 n'avait aucune diapo, ▶ levait). Rien ne change pour ce qui a été montré ; rien ne s'écrit dans la trame. ─── */
/* ㊲ (C16, mandat de la fin d'heure §3.5) : L'HEURE DE LA SUITE — la séance a joué ses heures prévues (`DR_CL.sur`, celles de la case) et sa dernière heure a
   reporté des diapos : l'heure h s'ouvre sur la réactivation, puis les diapos reportées (le glissé du socle, « reporter », dans l'ordre du plan), puis les
   diapos du plan jamais jouées et sans décision qui viennent après la première reportée (« Le bilan » d'une heure d'avant cette version, qui n'avait pas
   de décision), puis sa « Fin d'heure », posée ici. Rien ne s'écrit dans la trame : la copie de la classe seule. */
function dr_suiteContinue(h){ const E = seance().ecrans; const i0 = J.findIndex(x => x.type === 'lancement'); const vus = new Set((i0 < 0 ? [] : J.slice(i0)).filter(x => x.type === 'diapo').map(x => x.eid)); const vu = (e, i) => vus.has(e.eid) || !!vuMax[K(i)];
  const premiere = E.findIndex((e, i) => e && (+e.heure || 1) < h && glisseeDe(e, h) && !finie(e, i)); let n = 0;
  if (premiere >= 0) E.forEach((e, i) => { if (i <= premiere || !e || e.role === 'fin' || e.role === 'reactivation' || (typeof dr_masqueeCachee === 'function' && dr_masqueeCachee(e))) return; if ((+e.heure || 1) < h && !vu(e, i) && !decisionDe(e)) { e.heure = h; n++; } });
  if (!E.some(e => e && e.role === 'fin' && +e.heure === +h)) { const sk = (dr_ctx() || {}).snum; const fin = { eid: 'fin-h' + h + '-s' + (sk != null ? sk : 'x'), act: 'Fin d\'heure', dur: 5, role: 'fin', comp: [], blocs: [], heure: h }; Object.defineProperty(fin, 'dr_pose', { value: true }); E.push(fin); n++; }
  try { reindexer(); } catch (e) {} return n; }
function dr_heureContinue(h){
  try { if (!(h > 1)) return 0; const E = seance().ecrans; if (h > (+DR_CL.sur || 1)) return dr_suiteContinue(h);   /* ㊲ : au-delà des heures prévues, c'est la suite de la séance */ const utile = DR_CL.partages.get(E); if (!utile && E.some(e => e.heure === h && e.role !== 'fin')) return 0;   /* une frontière posée par Paul : son heure h tient */
    const i0 = J.findIndex(x => x.type === 'lancement'); const vus = new Set((i0 < 0 ? [] : J.slice(i0)).filter(x => x.type === 'diapo').map(x => x.eid)); let n = 0;   /* ce qui a été montré APRÈS un lancement : la diapo poussée au chargement n'a pas été vue par la classe */
    const vu = (e, i) => vus.has(e.eid) || !!vuMax[K(i)];
    /* contrat §12.16 (réveil n°6, C1 6.5-6.6) : (a) le rituel de l'heure — la première diapo de réactivation de la trame pas encore jouée (« Où en sommes-nous ? »), première de l'heure ;
       (b) ce que les décisions de la fin de l'heure d'avant reportent revient par le glissement du socle (`ordreHeureCalc0`) : une diapo décidée ne se déplace pas ici
       (« non fait », « pas le temps » sortent du programme — E4 ligne 130) ; (c) le reste dans l'ordre de la trame, depuis là où la classe s'est arrêtée ; (d) le cahier de textes en dernier (socle) */
    /* §12.25 (6) : la lecture du rituel par le titre est tombée — la réactivation est construite par le site au lancement (`dr_reactInserer`), seule `role === 'reactivation'` compte */
    E.forEach((e, i) => { if (!e.role && !vu(e, i) && (+e.heure || 1) < h && !decisionDe(e)) { e.heure = h; n++; } });
    if (utile) n += dr_refaireHeures(E, h, utile);   /* banc.sh 13:56 (K6-K11) : la frontière par les durées laissait à l'heure 1 ce que la classe n'avait pas vu — l'heure 2 sautait les premières diapos */
    if (n && typeof dr_normaliserTrame === 'function') dr_reactNormaliserCopie(E, (dr_ctx() || {}).snum);   /* la clé de la séance : l'eid « fin-hN-s<clé> » du socle, stable */ try { reindexer(); } catch (e) {} return n; } catch (e) { return 0; }
}
/* la séance continue (CADRAGE-TEMPS §1) sur ma frontière par les durées : à partir de l'heure h, ce qui reste se repartage par les minutes
   utiles ; chaque « Cahier de textes » (rôle fin, eid stable du socle) est déplacé derrière la dernière diapo de son heure, jamais doublé. */
/* `dr_estRituel` (le rituel reconnu à son titre) est tombée le 23/10 (§12.22 a, §12.25-6) : la réactivation n'est jamais dans la trame, le site la construit */
function dr_refaireHeures(E, h, utile){
  let cum = E.filter(e => (e.role === 'reactivation' && e.heure === h) || (!e.role && (+e.heure || 1) < h && glisseeDe(e, h))).reduce((s, e) => s + (+e.dur || 0), 0), n = 0;   /* réveil n°9 (E4 ligne 145) : le rituel et les reports ouvrent l'heure — leurs minutes comptent avant le programme ; avant : l'heure débordait, des diapos après le cahier de textes */ E.forEach(e => { if (e.role || (+e.heure || 1) < h) return; const nh = h + Math.floor(cum / utile); if (nh !== e.heure) { e.heure = nh; n++; } cum += +e.dur || 0; });
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
function dr_edtAssurer(){ try { const niv = (typeof AT !== 'undefined' && AT.edChap || {}).level; const chap = () => { try { if (niv && typeof EDT_CHAP !== 'undefined' && EDT_CHAP[niv] === undefined && !DR_CL.chapEnCours) { DR_CL.chapEnCours = true; edtChargerChapitres([niv], () => { DR_CL.chapEnCours = false; }); } } catch (e) {} };
  if (typeof EDT !== 'undefined' && !EDT.charge && typeof edtCharger === 'function') edtCharger(() => { try { edtChargerClasses(chap); } catch (e) {} }); else chap(); } catch (e) {} }   /* réveil n°13 : aussi les chapitres du niveau (`EDT_CHAP`) — sans eux, la projection de l'EDT dit « aucune séance prête » partout */
function dr_edtPret(){ try { const niv = (AT.edChap || {}).level; return !!(typeof EDT !== 'undefined' && EDT && EDT.charge && typeof EDT_CHAP !== 'undefined' && niv && EDT_CHAP[niv] !== undefined); } catch (e) { return false; } }

/* ─── les infobulles de la garde de clôture et de « Annuler » (relecteur neuf n°2) — les boutons sont au gabarit ─── */
/* réveil n°4, point 5 (C1 11t.3) : le mode test se voit dans le pilotage — la pastille du site (classe `tprof-testpill on`) posée dans l'entête,
   et `data-mode-test` sur #dr-zone pour qu'E1 l'affiche à sa façon (le témoin « Enregistré à … », #dr-enr, est à E1) */
setInterval(() => { try { const on = typeof m8TestOn === 'function' ? !!m8TestOn() : !!(typeof M8_TEST !== 'undefined' && M8_TEST); const z = document.getElementById('dr-zone'); if (z) { if (on) z.dataset.modeTest = '1'; else delete z.dataset.modeTest; }
  let p = document.getElementById('dr-test'); const hou = document.getElementById('hou'); if (!p && hou && on) { p = document.createElement('span'); p.id = 'dr-test'; p.className = 'tprof-testpill on dr-test'; p.title = 'Mode test : rien de cette heure n’est enregistré pour la classe — ni la copie, ni le journal, ni l’état, ni la clôture. Seule l’image du tableau part, à une adresse à elle, pour que le tableau distant suive ce que tu joues.'; p.innerHTML = '<span class="tprof-testpill-dot"></span>Mode test'; hou.insertAdjacentElement('afterend', p); }
  if (p) p.style.display = on ? '' : 'none'; } catch (e) {} }, 1000);
/* réveil n°12 (E4 ligne 107) : l'heure close n'offre plus la fin de l'heure, et le chrono de la tête ne reste pas en compte à rebours rouge — il dit « close · hh:mm » */
/* §12.66 (4) : une heure close au pilotage — « Fin de l'heure » devient « Relire l'heure » (plus de bouton grisé) ; (2) « close · hh:mm » est l'heure de la case
   (`S.closes[h]` = `now()` au geste de clôture ; à défaut, `finReel` lu à l'horloge de la case), pas celle de la montre */
const DR_BFIN_RELIRE = 'L’heure est close : ouvre sa Relecture — son récit, ce qui s’est passé, le papier. Rien ne se rejoue, rien ne s’écrit.';
setInterval(() => { try { const bf = document.getElementById('bfin'), ch = document.getElementById('chr'); const close = typeof S === 'object' && S && S.lancee && S.close;
  if (bf) { if (close) { if (bf.dataset.drTxt == null) { bf.dataset.drTxt = bf.textContent; bf.dataset.drTitre = bf.dataset.drT0 != null ? bf.dataset.drT0 : bf.title; } if (bf.disabled) bf.disabled = false; if (bf.textContent !== 'Relire l’heure') bf.textContent = 'Relire l’heure'; if (bf.title !== DR_BFIN_RELIRE) bf.title = DR_BFIN_RELIRE; }
    else if (bf.dataset.drTxt != null) { bf.textContent = bf.dataset.drTxt; bf.title = bf.dataset.drTitre || ''; delete bf.dataset.drTxt; delete bf.dataset.drTitre; } }
  if (ch && close) { const t2 = 'close · ' + hhmm(((S.closes || {})[S.heure]) || (typeof dr_heureCase === 'function' ? dr_heureCase(S.finReel) : S.finReel) || now()); if (ch.textContent !== t2) { ch.textContent = t2; ch.className = 'dr-chr-close'; } } } catch (e) {} }, 500);
document.addEventListener('click', ev => { try { const b = ev.target && ev.target.closest && ev.target.closest('#bfin'); if (!b || typeof S !== 'object' || !S || !S.lancee || !S.close || S.atelier) return;
  ev.preventDefault(); ev.stopImmediatePropagation(); dr_relireIci(); } catch (e) {} }, true);
/* « Relire l'heure » au pilotage : la Relecture de l'heure close, sur place (l'onglet Relecture, le récit de cette heure) */
function dr_relireIci(){ try { if (typeof atVuesAller === 'function') atVuesAller('relecture', true); else voir('relecture'); } catch (e) { try { voir('relecture'); } catch (e2) {} }
  try { S.face = 'recit'; S.faceH = S.heure; if (typeof relecture === 'function') relecture(); } catch (e) {} }

/* §12.66 (3) : À LA CLÔTURE, l'emploi du temps — en haut, « L'heure des <classe> est close à <hh:mm> » (l'heure de la case) et « Relire l'heure »,
   qui ouvre la Relecture de cette heure (le chemin de « Relire cette heure » de la case, `dr_relireTrace`). La bande est posée une fois, hors de
   l'emploi du temps (qui se redessine), puis seul son texte change ; elle part avec l'emploi du temps, au « ✕ », ou à « Relire l'heure ». */
function dr_apresCloture(){
  let R = null; try { const C = dr_cheminC(); R = { classe: (AT_DR_COURS && (AT_DR_COURS.classeNom || AT_DR_COURS.classeSlug)) || '', h: hhmm(((S.closes || {})[S.heure]) || now()), chemin: C ? C + '/' : null, heure: S.heure }; } catch (e) {}
  try { if (typeof atClasseFermer === 'function') atClasseFermer(); else if (typeof edtOuvrir === 'function') edtOuvrir(); } catch (e) { try { voir('relecture'); } catch (e2) {} return; }
  if (R) dr_closConfPoser(R);
}
function dr_closConfPoser(R){
  let b = document.getElementById('dr-clos-conf');
  if (!b) {
    if (!document.getElementById('dr-clos-conf-style')) { const st = document.createElement('style'); st.id = 'dr-clos-conf-style';
      st.textContent = '#dr-clos-conf{position:fixed;top:0;left:0;right:0;height:46px;z-index:8600;display:flex;align-items:center;gap:14px;padding:0 18px;background:#1f3a2a;color:#e8f2ea;border-bottom:1px solid #3d6b4f;font-size:15px;box-sizing:border-box}'
        + '#dr-clos-conf .dr-clos-t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#dr-clos-conf button{font:inherit;cursor:pointer;border-radius:6px}'
        + '#dr-clos-conf .dr-clos-relire{background:#e8f2ea;color:#1f3a2a;border:0;padding:5px 14px;font-weight:600}#dr-clos-conf .dr-clos-x{background:transparent;color:inherit;border:1px solid #3d6b4f;padding:3px 10px}'
        + 'html.dr-clos-conf-on #edt-ecran{top:46px}';
      document.head.appendChild(st); }
    b = document.createElement('div'); b.id = 'dr-clos-conf'; b.setAttribute('role', 'status');
    b.innerHTML = '<span class="dr-clos-t" id="dr-clos-conf-t"></span>'
      + '<button type="button" class="dr-clos-relire" id="dr-clos-relire" title="Ouvre la Relecture de cette heure : son récit, ce qui s’est passé, le papier — rien ne se rejoue, rien ne s’écrit">Relire l’heure</button>'
      + '<button type="button" class="dr-clos-x" id="dr-clos-x" title="Ferme ce message. L’heure reste close ; tu la relis aussi depuis sa case de l’emploi du temps (« Relire cette heure »)">✕</button>';
    b.addEventListener('click', ev => { const t = ev.target && ev.target.closest && ev.target.closest('button'); if (!t) return; const r = DR_CL.closConf;
      dr_closConfRetirer(); if (t.id === 'dr-clos-relire' && r) { if (!(r.chemin && dr_relireTrace(r.chemin, r.heure))) { try { atInfo('La Relecture de cette heure ne s’ouvre pas d’ici : ouvre sa case dans l’emploi du temps, « Relire cette heure ».'); } catch (e) {} } } });
    document.body.appendChild(b);
  }
  DR_CL.closConf = R; DR_CL.closConfEdt = false;
  { const rb = document.getElementById('dr-clos-relire'); if (rb) { const v = R.annulee ? 'none' : ''; if (rb.style.display !== v) rb.style.display = v; } }   /* §12.68 : une heure annulée ne se relit pas */
  const txt = R.annulee ? 'L’heure des ' + R.classe + ' est annulée : le site n’en garde rien' : 'L’heure des ' + R.classe + ' est close à ' + R.h; const t = document.getElementById('dr-clos-conf-t'); if (t && t.textContent !== txt) t.textContent = txt;
  if (b.style.display === 'none') b.style.display = ''; document.documentElement.classList.add('dr-clos-conf-on');
}
function dr_closConfRetirer(){ const b = document.getElementById('dr-clos-conf'); if (b && b.style.display !== 'none') b.style.display = 'none'; document.documentElement.classList.remove('dr-clos-conf-on'); DR_CL.closConf = null; }
setInterval(() => { try { if (!DR_CL.closConf) return; const e = document.querySelector('#edt-ecran'); /* l'écran du site (lu, jamais déclaré ici) */ const ouvert = !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0);
  if (ouvert) DR_CL.closConfEdt = true; else if (DR_CL.closConfEdt) dr_closConfRetirer();   /* l'emploi du temps se ferme : la bande part avec lui */
  if (typeof S === 'object' && S && S.lancee && !S.close) dr_closConfRetirer(); } catch (e) {} }, 1000);
setInterval(() => { try { const t = { 'gclore-oui': 'Clore l’heure malgré ce qui manque : tout ce qui est fait est enregistré ; ce qui manque restera à faire plus tard', 'gclore-non': 'Revenir à l’étape qui manque, sans rien fermer', 'f-fermer': 'Referme la fin de l’heure sans rien clore : tes choix restent', 'garde-devant': 'Change de diapo sans geler : la classe voit ce que tu ouvres' };
  Object.keys(t).forEach(id => { const b = document.getElementById(id); if (b && !b.title) b.title = t[id]; }); } catch (e) {} }, 1000);

/* ─── dette 12 · 17, puis C16 (㊱, MANDAT-APPEL) : L'APPEL, UNE SEULE LISTE PAR HEURE ───
   Paul (16:59) : « je dois pouvoir faire l'appel n'importe quand sur n'importe quel appareil ». La liste de l'heure est `H/absents` (des slugs `edtSlugEleve`) ;
   l'appel du pilote (`S.appel`, ses quatre gestes datés) la porte : « absent de l'heure » = un « absent » de cette heure que ne suit aucun « arrivé ».
   · Chaque geste d'appel s'écrit PAR ÉLÈVE ET PAR APPAREIL (`H/absentsPar/<élève>/<appareil>` = {a, t} ; index.html, `edtAppelListe`) : deux gestes croisés sur
     deux élèves restent tous les deux ; pour un même élève, le geste le plus récent compte. Un geste du pilote (clic droit, Ctrl+Z, la télécommande) s'écrit
     aussitôt (`dr_apGeste`) ; la case écrit le sien ; le pilote qui a la main suit l'appel de l'heure (le flux du hub) et verse les gestes plus récents dans
     l'appel ; les autres appareils le reçoivent par l'état vivant (㉞). En mode test : rien au hub hors de l'essai (K15-test) — l'appel passe d'un appareil à
     l'autre par l'état vivant de l'essai ; la case sert avant et après l'heure, sur l'appareil de l'essai.
   · Au lancement : l'appel fait dans la case avant l'heure (`/site/edt/appel/<année>/<clé>`) entre dans l'appel, daté à l'horloge de l'heure (`now()`, jamais
     `S.debutReel` : défaut 256), une ligne de journal par élève ; ses entrées passent dans l'heure, puis il est retiré — « Annuler cette heure » le remet.
   · Le paquet de l'heure ne réécrit jamais l'appel (PATCH de ses propres clés, `dr_paquetPatch`). ─── */
var DR_AP = { ec: null, chemin: null, pret: false, vuDernier: {}, attente: null, oT: null, avantVerse: null };
function dr_apDev(){ return 'p' + (typeof DR_SES === 'object' ? DR_SES.id : 'x'); }
function dr_apSlug(e){ return typeof edtSlugEleve === 'function' ? edtSlugEleve(e) : String(e); }
function dr_apCle(s){ return typeof edtAppelCleSure === 'function' ? edtAppelCleSure(s) : String(s); }
function dr_apNette(v){ if (typeof edtAppelListeNette === 'function') return edtAppelListeNette(v); const l = Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : []); return l.filter((x, i, a) => typeof x === 'string' && x && a.indexOf(x) === i).sort(); }
function dr_apAbsentDeLHeure(e, h){ let abs = false; ((S.appel || {})[e] || []).forEach(x => { if (!x || x.heure !== h) return; if (x.type === 'absent') abs = true; else if (x.type === 'arrive') abs = false; }); return abs; }
function dr_apListe(h){ return (typeof ELEVES !== 'undefined' ? ELEVES : []).filter(e => dr_apAbsentDeLHeure(e, h)).map(dr_apSlug).filter((x, i, a) => a.indexOf(x) === i).sort(); }
function dr_apPeutEcrire(){ try { if (typeof SES === 'object' && SES && SES.mode === 'tableau') return false; return dr_clPeutEcrire() && !S.close; } catch (e) { return false; } }
/* marquer ou défaire « absent de l'heure » pour un élève ; une ligne de journal (`dire`), sauf si la dernière de cet élève dit déjà la même chose */
function dr_apPoser(e, absent, raison, dire){ const h = S.heure; if (!e || !h || dr_apAbsentDeLHeure(e, h) === !!absent) return false; S.appel = S.appel || {};
  const reste = (S.appel[e] || []).filter(x => !(x && x.heure === h && (x.type === 'absent' || x.type === 'arrive')));
  if (absent) S.appel[e] = reste.concat([{ type: 'absent', t: now(), heure: h, raison: raison || '' }]); else if (reste.length) S.appel[e] = reste; else delete S.appel[e];
  const quoi = absent ? 'absent' : 'retire'; const dern = J.filter(x => x && x.type === 'appel' && x.eleve === e && x.h === h).pop();
  if (dire !== false && !(dern && dern.quoi === quoi)) journal('appel', { eleve: e, quoi, raison: raison || '' });
  return true; }
/* l'entrée de CET appareil pour CET élève (`H/absentsPar/<élève>/p<appareil>`) : un geste d'appel d'ici, écrit aussitôt ; rien d'autre n'est réécrit */
function dr_apGeste(e){ try { if (!e || !S.lancee || S.close || S.repetition || S.atelier) return; const ch = dr_cheminH(); if (!ch || !dr_apPeutEcrire()) return;
  const k = dr_apCle(dr_apSlug(e)); const test = typeof m8TestOn === 'function' && m8TestOn();
  /* l'heure du geste : celle du hub, écrite par le hub (`{".sv":"timestamp"}`) — jamais la montre de l'appareil (en mode test, le magasin d'une seule page : sa montre) */
  const x = { a: dr_apAbsentDeLHeure(e, S.heure) ? 1 : 0, t: test ? Date.now() : { '.sv': 'timestamp' }, tl: Date.now(), g: Math.random().toString(36).slice(2, 10) };
  dr_ecrire(ch + '/absentsPar/' + k + '/' + dr_apDev(), x, 'L’appel de l’heure — ' + ((AT_DR_COURS || {}).classeNom || ''), () => {}); } catch (x) {} }
/* la télécommande : un appui marque un absent, un second appui le défait */
function dr_apBasculer(e, raison){ if (!e || !S.lancee || S.close) return false; const abs = dr_apAbsentDeLHeure(e, S.heure); if (!dr_apPoser(e, !abs, raison)) return false;
  S.derniere = abs ? null : { type: 'appel', eleve: e }; try { participation(); } catch (x) {} dr_apGeste(e); return true; }
/* l'appel de l'heure reçu du hub (le flux) : pour chaque élève, le dernier geste À L'HEURE DU HUB ; quand il change et qu'il vient d'un autre appareil, l'appareil
   qui a la main le verse dans l'appel (aucune montre d'appareil n'est comparée) (un geste de la case : une ligne de journal ; d'un autre pilote : sans ligne, ce pilote a écrit la sienne) ; les autres appareils le
   reçoivent par l'état vivant. Une saisie en cours ici : il attend qu'on l'ait quittée (règle du 04/10). */
function dr_apRecu(v){ if (!S.lancee || S.close || S.repetition) return; DR_AP.attente = (v && typeof v === 'object') ? v : {}; dr_apVerser(); }
function dr_apVerser(){ clearTimeout(DR_AP.oT); const v = DR_AP.attente; if (!v) return;
  if (typeof dr_sesOccupe === 'function' && dr_sesOccupe()) { DR_AP.oT = setTimeout(dr_apVerser, 400); return; }
  DR_AP.attente = null; if (!S.lancee || S.close) return; const tient = !(typeof dr_sesJeTiens === 'function' && !dr_sesJeTiens());
  const D = typeof edtAppelDerniers === 'function' ? edtAppelDerniers(v) : {}; const parCle = {}; (typeof ELEVES !== 'undefined' ? ELEVES : []).forEach(e => { parCle[dr_apCle(dr_apSlug(e))] = e; }); let n = 0;
  Object.keys(D).forEach(k => { const d = D[k]; const id = d.dev + '|' + (d.g || d.t); if (DR_AP.vuDernier[k] === id) return; DR_AP.vuDernier[k] = id; if (!tient || d.dev === dr_apDev()) return; const e = parCle[k]; if (!e) return;
    if (dr_apPoser(e, !!d.a, /^l/.test(d.dev) ? 'appel au lancement' : 'case de l’emploi du temps', !/^p/.test(d.dev))) n++; });
  if (n) { try { participation(); } catch (x) {} try { dr_tout(); } catch (x) {} } }
/* l'abonnement du pilote à l'appel de son heure (vraie heure ; ni en répétition, ni à l'Atelier, ni au tableau, ni en mode test) */
function dr_apVeiller(){ try {
  let ch = null;
  if (DR_AP.pret && typeof S === 'object' && S && S.lancee && !S.close && !S.repetition && !S.atelier && typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME === 'classe'
    && !(typeof dr_estTableau === 'function' && dr_estTableau()) && !(typeof m8TestOn === 'function' && m8TestOn())) ch = dr_cheminH();
  if (ch === DR_AP.chemin) return;
  if (DR_AP.ec) { try { dr_sesTaire(DR_AP.ec); } catch (e) {} DR_AP.ec = null; }
  DR_AP.chemin = ch; DR_AP.attente = null; clearTimeout(DR_AP.oT);
  if (ch && typeof dr_sesEcouter === 'function') DR_AP.ec = dr_sesEcouter(ch + '/absentsPar', v => { if (DR_AP.chemin === ch) dr_apRecu(v); }, 1500);
} catch (e) {} }
setInterval(dr_apVeiller, 500);
/* l'appel d'avant l'heure de cette heure : celui de la case qui l'a lancée, sinon celui de la case d'aujourd'hui (classe, créneau) */
function dr_apCheminAvant(){ try { const L = window.DR_AP_LANCE; if (L && L.chemin) return L.chemin; if (typeof edtAppelCheminDe !== 'function' || !AT_DR_COURS) return null;
  const d = new Date(now()); const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  return edtAppelCheminDe(iso, dr_creneauDuCours(AT_DR_COURS), AT_DR_COURS.classeNom); } catch (e) { return null; } }
/* au lancement (`lancement`) : l'appel d'avant l'heure entre dans l'appel (une ligne par élève, l'horloge de l'heure) et dans l'heure (ses entrées, telles
   quelles), puis il est retiré — gardé ici pour « Annuler cette heure », qui le remet. À la reprise : l'appel de l'heure au hub fait foi. */
function dr_absentsDeLaCase(lancement){
  const ch = (typeof dr_cheminH === 'function') ? dr_cheminH() : null; if (!ch || typeof edtSlugEleve !== 'function' || S.repetition) return;
  DR_AP.pret = false; DR_AP.vuDernier = {}; const avCh = lancement ? dr_apCheminAvant() : null; window.DR_AP_LANCE = null; if (lancement) DR_AP.avantVerse = null;
  const fini = () => { DR_AP.pret = true; };
  dr_lire(ch, H => { const suite = av => { try {
    H = H || {}; const h = S.heure; const avPar = (av && typeof av === 'object' && av.absentsPar && typeof av.absentsPar === 'object') ? av.absentsPar : null;
    const par = Object.assign({}, (H.absentsPar && typeof H.absentsPar === 'object') ? H.absentsPar : {}); if (avPar) Object.keys(avPar).forEach(k => { par[k] = Object.assign({}, par[k] || {}, avPar[k]); });
    const L = typeof edtAppelListe === 'function' ? edtAppelListe(Object.assign({}, H, { heure: H.heure || h, absentsPar: par })) : []; const Dv = typeof edtAppelDerniers === 'function' ? edtAppelDerniers(avPar) : {};
    let n = 0;
    (typeof ELEVES !== 'undefined' ? ELEVES : []).forEach(e => { const s = dr_apSlug(e), k = dr_apCle(s); const dans = L.includes(s); const abs = dr_apAbsentDeLHeure(e, h);
      if (dans && !abs) { if (dr_apPoser(e, true, Dv[k] && Dv[k].a ? 'appel au lancement' : 'case de l’emploi du temps')) n++; }
      else if (!dans && abs && !lancement && (H.appelUnique || (par[k] && Object.keys(par[k]).length))) { if (dr_apPoser(e, false, 'case de l’emploi du temps')) n++; } });
    const D = typeof edtAppelDerniers === 'function' ? edtAppelDerniers(par) : {}; Object.keys(D).forEach(k => { DR_AP.vuDernier[k] = D[k].dev + '|' + (D[k].g || D[k].t); });
    if (n) { try { participation(); } catch (x) {} dr_tout(); }
    if (avPar && dr_apPeutEcrire()) { dr_ecrire(ch + '/absentsPar', par, 'L’appel d’avant l’heure, entré dans l’heure', () => {}); DR_AP.avantVerse = { chemin: avCh, val: av }; dr_ecrire(avCh, null, 'L’appel d’avant l’heure, versé dans l’heure', () => {}); }
  } catch (e) {} fini(); };
  if (avCh) dr_lire(avCh, suite); else suite(null); });
}
/* la Relecture d'une classe (dr-recit.js, `dr_recitChargerClasse`) : la liste de chaque heure jouée entre dans l'appel relu (`S.appel`, celui de C/etat) —
   heure de cette version : `H/absents` fait foi (un absent coché après coup y entre, un absent défait après coup en sort) ; heure d'avant cette version :
   la liste réunie de la case (`edtAppelListe` : `H/absents` et l'appel du paquet), qui n'enlève rien. Rien n'est écrit. Rend le nombre d'élèves changés. */
function dr_apFondreRelecture(heures, noms){ S.appel = S.appel || {}; let n = 0;
  Object.keys(heures || {}).forEach(k => { const H = (heures || {})[k] || {}; const h = +H.heure || null; if (!h) return;
    const L = typeof edtAppelListe === 'function' ? edtAppelListe(H) : dr_apNette(H.absents); const t0 = +H.debutReel || 0;
    const par = (H.absentsPar && typeof H.absentsPar === 'object') ? H.absentsPar : {};
    (noms || []).forEach(e => { const s = dr_apSlug(e); const dans = L.includes(s); const abs = dr_apAbsentDeLHeure(e, h); if (dans === abs || (!dans && !H.appelUnique && !par[dr_apCle(s)])) return;
      const reste = (S.appel[e] || []).filter(x => !(x && x.heure === h && (x.type === 'absent' || x.type === 'arrive')));
      if (dans) S.appel[e] = reste.concat([{ type: 'absent', t: t0, heure: h, raison: 'case de l’emploi du temps' }]); else if (reste.length) S.appel[e] = reste; else delete S.appel[e]; n++; }); });
  return n; }
/* le paquet de l'heure, en PATCH de ses propres clés (une clé disparue vaut null) : par `mjpcEcrireRest` et son issue, comme le reste — un refus ou une panne
   se voit (le bandeau « Réessayer ») et se retente ; en mode test, au magasin (le PATCH y fusionne). `H/absents` n'y est jamais. */
const DR_PAQUET_CLES = ['classe', 'creneau', 'lanceA', 'fin', 'debutReel', 'finReel', 'tempsUtilePrevu', 'minutesJouees', 'heure', 'sur', 'activites', 'parActivite', 'decisionsParEcran', 'decisionsParActivite', 'appel', 'coupures', 'echeance', 'travail', 'travailTexte', 'reserve', 'versements', 'parts', 'motAbsents', 'clos', 'maj', 'closPar', 'appelUnique', 'rattrapee'];
function dr_paquetPatch(ch, p, libelle){
  if (!ch || !p || (typeof S !== 'undefined' && S.repetition) || typeof mjpcEcrireRest !== 'function') return;
  /* en mode test, le magasin de CETTE page (aucun autre appareil n'y écrit : la course du hub n'existe pas ici) : le paquet s'écrit entier, comme avant,
     `H/absents` relu au magasin et recopié — le paquet reste une clé du magasin (mesuré : le parcours K15-test lit le magasin par ses clés) */
  if (typeof m8TestOn === 'function' && m8TestOn()) { dr_lire(ch, H0 => { const q = Object.assign({}, p); delete q.absents; delete q.absentsPar; if (H0 && H0.absents) q.absents = H0.absents; if (H0 && H0.absentsPar) q.absentsPar = H0.absentsPar; dr_ecrire(ch, q, libelle, () => {}); }); return; }
  const corps = {}; DR_PAQUET_CLES.forEach(k => { corps[k] = null; }); Object.keys(p).forEach(k => { if (k !== 'absents' && k !== 'absentsPar') corps[k] = p[k] === undefined ? null : p[k]; });
  const url = FIREBASE_BASE + ch + '.json'; const moi = () => dr_paquetPatch(ch, p, libelle);
  mjpcEcrireRest(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) }, issue => {
    if (issue && issue.etat === MJPC_ISSUE.ACCEPTEE) { try { mjpcSucces(); } catch (e) {} try { dr_temoinHub(); } catch (e) {} }
    else { try { mjpcSignalerIssue(issue, { ou: libelle, retenter: moi }); } catch (e) {} } });
}
/* dette 13 · 32 (25/10) : l'enveloppe de `_drProchainCreneau` (12 · 17, « À relire — » : le prochain jour ouvré → la prochaine heure de la classe) est retirée — la fonction n'a plus aucun appelant dans 8.75.0-① (le papier lit `dr_recitProchaines()`) ; E1 retire la fonction morte dans `index.html` */

/* ─── les activités de la fin de l'heure, et chaque diapo sans activité comme la sienne (réveil n°3, points 3 et 5 ; C1 7.0-7.1) : la trame
   réelle n'a pas encore d'activités ; sans elles, « ce qui reste » ne proposait rien à décider. La décision d'une diapo se range sous son `eid`
   (`cleDec` du socle), elle glisse à l'heure suivante comme une activité. ─── */
function dr_pseudoAct(e, i, rituel){ if (!e || (e.role && !(rituel && e.role === 'reactivation')) || e.actId || e.horsActivite || e.masquee) return null;   /* EX (§12.62 (1), (2), (4)) : une diapo « hors activité » (choisie, ou vierge) n'est pas une activité ; une masquée ne se joue pas */ let n = null; try { const E0 = seance().ecrans; const o = ordreHeure(S.heure).filter(k => E0[k] && E0[k].role !== 'fin' && E0[k].role !== 'reactivation'); const r = o.indexOf(i); n = r >= 0 ? r + 1 : rangDe(i, e.heure); } catch (x) {}   /* relecteur neuf n°3 (3) : le rang dans l'heure EN COURS — une glissée gardait celui de son heure d'origine (A5, A6 en double) ; 25/10 (B18, RC15) : la réactivation construite ne prend pas de numéro — sans ce filtre les activités de l'heure commençaient à A2 */ return { id: e.eid, num: n || (i + 1), titre: e.act || '', diapos: [i], pseudo: true }; }
function dr_activitesOuDiapos(){ const E = seance().ecrans; const vraies = dr_activites()[String(S.si)] || []; return vraies.concat(E.map((e, i) => dr_pseudoAct(e, i)).filter(Boolean)); }

/* ─── la frontière d'heure par les durées (dette 12 · 07, réveil n°3, point 2) : quand la trame ne la porte pas (tout à l'heure 1),
   l'heure n = les diapos qui commencent dans ses minutes utiles (créneau − 5 min), la suite à l'heure n + 1 ; chaque heure a son
   « Cahier de textes » (posé par le socle). En classe seulement, en mémoire : la trame du hub n'est pas réécrite. ─── */
DR_CL.partages = new WeakMap();   /* trame en mémoire → minutes utiles de la frontière que j'y ai posée */
function dr_partagerHeures(utile){
  try { const E = seance().ecrans; const pleines = E.filter(e => e.role !== 'fin'); if (new Set(pleines.map(e => +e.heure || 1)).size > 1) return 0;   /* une frontière existe déjà */
    utile = utile || 50; let cum = 0, n = 0; E.forEach(e => { if (e.role === 'fin') return; const h = 1 + Math.floor(cum / utile); if (h !== (+e.heure || 1)) { e.heure = h; n++; } cum += +e.dur || 0; });
    if (n) DR_CL.partages.set(E, utile);   /* la frontière est la mienne (par les durées) : `dr_heureContinue` peut la refaire ; une frontière posée par Paul, jamais */
    if (n && typeof dr_normaliserTrame === 'function') dr_reactNormaliserCopie(E, (dr_ctx() || {}).snum);   /* la clé de la séance : l'eid « fin-hN-s<clé> » du socle, stable */ try { reindexer(); } catch (x) {} return n; } catch (e) { return 0; }
}
const dr_utileCreneau = cr => Math.max(10, dr_tempsUtile(cr, String(cr).split('-')[0]));

/* ═══ §12.22 / §12.25 (23/10) — LA RÉACTIVATION CONSTRUITE : l'ordre de l'heure, le bouton, le réglage, le lancement (E2).
   E4 construit le contenu : `dr_reactivationConstruire(h)` rend l'écran `{act, dur: 3, construite: {depuis, t}, blocs: [...]}` ou null
   (rien de joué avant) ; s'il doit relire le hub, `dr_reactivationPreparer(h, cb)`. L'eid `react-h<n>-s<clé>` est celui du socle (E1) ;
   je le pose s'il manque, à l'identique. La diapo est construite UNE fois, au lancement de l'heure quand Paul dit oui, insérée devant
   la première diapo de l'heure (le socle la met en tête : `ordreHeureCalc0`, `role === 'reactivation'`), écrite dans `C/ecrans` par
   `dr_copieAuto` avec le reste, relue de la copie à toute reprise (jamais reconstruite). Le réglage par séance : `B/deroule/reactivation`
   = 'oui' | 'non' (porté par `dr_derouleDe`, E1 ; écrit par `dr_ecrire` : K15, mode test étanche) ; défaut : oui (§12.25-1). ═══ */
DR_CL.react = { choix: {}, prete: {}, raison: {}, decide: {}, enCours: false };
const DR_REACT_TITRE = 'Où en sommes-nous ?';
function dr_reglageReactivationLu(sk){ try { const sce = dr_seance(sk != null ? sk : ATVUES.snum); const v = sce && sce.deroule && sce.deroule.reactivation; return v === 'non' ? 'non' : 'oui'; } catch (e) { return 'oui'; } }
function dr_reglageReactivation(sk, v, cb){ v = v === 'non' ? 'non' : 'oui'; try { const k = sk != null ? sk : ATVUES.snum; const sce = dr_seance(k); if (sce) { sce.deroule = sce.deroule || {}; sce.deroule.reactivation = v; }   /* en mémoire d'abord : le PUT entier de `dr_sauve` (dr_derouleDe, E1) la garde */
    const ec = (typeof AT !== 'undefined' && AT.edChap) || {}; dr_ecrire('/site/' + ec.level + '/chapitres/' + ec.chnum + '/seances/' + k + '/deroule/reactivation', v, 'Réglage de la réactivation de la séance', cb || (() => {})); } catch (e) { if (cb) cb(false); } return v; }
function dr_reactDejaLa(h){ try { return seance().ecrans.some(e => e && e.role === 'reactivation' && +e.heure === +h); } catch (e) { return false; } }
function dr_reactValide(e){ return !!(e && typeof e === 'object' && Array.isArray(e.blocs) && e.blocs.length); }
function dr_reactPreparer(h){ const R = DR_CL.react; if (R.prete[h] !== undefined) return R.prete[h]; let e = null;
  if (typeof dr_reactivationConstruire !== 'function') { R.raison[h] = 'la construction de la réactivation n’est pas encore dans le site'; R.prete[h] = null; return null; }
  try { e = dr_reactivationConstruire(h); } catch (x) { e = null; R.raison[h] = 'la réactivation n’a pas pu être construite (' + (x && x.message) + ')'; }
  if (!dr_reactValide(e)) { R.raison[h] = R.raison[h] || (e && e.raison) || 'rien de joué avant : rien à réactiver'; R.prete[h] = null; return null; }
  R.prete[h] = e; return e; }
function dr_reactPreparerAsync(h, cb){ const R = DR_CL.react; if (R.prete[h] !== undefined || typeof dr_reactivationPreparer !== 'function') { cb(dr_reactPreparer(h)); return; }
  let fait = false; const fin = e => { if (fait) return; fait = true; if (!dr_reactValide(e)) { R.raison[h] = (e && e.raison) || 'rien de joué avant : rien à réactiver'; R.prete[h] = null; cb(null); } else { R.prete[h] = e; cb(e); } };
  try { dr_reactivationPreparer(h, fin); setTimeout(() => fin(null), 4000); } catch (x) { fin(null); } }   /* E4 relit le hub : borné à 4 s */
/* ═══ §12.26 (25/10, « va » 14:59) — LA RÉACTIVATION CONSTRUITE À LA CLÔTURE, VUE ET MODIFIÉE AVANT LE LANCEMENT (E2).
   §12.25-10 est remplacé : la diapo de l'heure h+1 est construite À LA CLÔTURE de l'heure h (`dr_reactApresCloture`, par
   `dr_reactivationPreparer(h+1, cb, {cle, paquet})` d'E4 — le paquet local prime sur le hub : pas de course avec son écriture),
   écrite tout de suite dans `C/ecrans` (la copie de la classe, jamais la trame) ; `dr_fusionCopie` la garde à l'ouverture suivante.
   Sur l'écran d'ouverture, la puce « 1. Où en sommes-nous ? » l'ouvre dans le pilote SANS LANCER (`dr_reactVoir` : rendu seul, jamais
   `pousser` — ni journal ni tableau) ; Paul y écrit comme dans toute diapo (le geste du socle, E1, armé sur `dr_reactAvantLancement()`),
   `dr_reactModifiee()` écrit la copie et pose « ta version » + ↩ dans l'entête du pilote (`.scene > .titre`, jamais au tableau) ;
   ↩ remet `construite.calculee` (E4 la pose ; `dr_reactivationRetour` / `dr_reactivationModifiee` s'il les a, sinon ici).
   « Lancer » : `dr_reactInserer` ne construit plus — « oui » : la construite est déjà dans la copie (ou, à l'heure 1 / sans copie,
   `prete[h]` tenu en mémoire est inséré) ; « non » : elle est retirée de la copie. (7) clôture manquée : construite à l'ouverture,
   écrite alors dans la copie. ═══ */
DR_CL.reactVue = null;   /* l'aperçu en cours : { h, eid, C, diAvant, retour: 'ouverture' | 'legere' } */
DR_CL.reactC = null;     /* le chemin `C` de la classe connu avant le lancement (l'ouverture depuis la case) */
function dr_reactEcran(h){ try { return seance().ecrans.find(e => e && e.role === 'reactivation' && +e.heure === +h) || null; } catch (e) { return null; } }
function dr_reactEcranDe(eid){ try { return seance().ecrans.find(e => e && e.eid === eid) || null; } catch (e) { return null; } }
function dr_reactCheminC(){ try { if (DR_CL.reactC) return DR_CL.reactC; if (DR_CL.ouverte && DR_CL.ouverte.C) return DR_CL.ouverte.C; if (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS && AT_DR_REGIME === 'classe') return dr_cheminC(); } catch (e) {} return null; }
const dr_reactClone = x => JSON.parse(JSON.stringify(x));
/* les blocs `texte` comparés sans les `id` (E4, RC20 : `dr_reactivationModifiee` fait de même) */
function dr_reactSignature(blocs){ return JSON.stringify((blocs || []).map(b => ({ t: b.t, txt: b.txt || '', el: (b.el || []).map(x => typeof x === 'string' ? x : (x && x.txt) || '') }))); }
function dr_reactEstModifiee(e){ if (!e || !e.construite || !e.construite.calculee) return false; try { if (typeof dr_reactivationModifiee === 'function') return !!dr_reactivationModifiee(e); } catch (x) {} return dr_reactSignature(e.blocs) !== dr_reactSignature(e.construite.calculee); }
/* l'écran rendu par E4, normalisé pour la copie : rôle, heure, eid du socle, dur, la version calculée gardée (§12.26-5) — l'objet lui-même (l'heure 1 le tient en mémoire jusqu'au lancement) */
function dr_reactNormaliser(h, p){ const sk = (dr_ctx() || {}).snum; if (p.act == null) p.act = DR_REACT_TITRE; p.role = 'reactivation'; p.heure = +h; p.dur = +p.dur || 3; delete p.actId;
  if (p.eid == null) p.eid = 'react-h' + h + '-s' + (sk != null ? sk : 'x');   /* la formule du socle (§12.25-3) */
  p.construite = p.construite || {}; if (!p.construite.calculee) p.construite.calculee = dr_reactClone(p.blocs || []);   /* E4 la pose (RC20) ; sinon ici, à l'identique */
  return p; }
/* poser l'écran dans `seance().ecrans`, devant la première diapo de l'heure h (le socle la met en tête) ; une fois */
function dr_reactPoser(h, p){ if (!dr_reactValide(p)) return null; const E = seance().ecrans; if (dr_reactDejaLa(h)) return dr_reactEcran(h); const e = dr_reactNormaliser(h, p);
  let i = E.findIndex(x => x && +x.heure === +h && x.role !== 'reactivation'); if (i < 0) i = E.length; let j = -1; E.forEach((x, k) => { if (x && +x.heure < +h) j = k; }); i = Math.max(i, j + 1); E.splice(i, 0, e);   /* devant la première diapo de l'heure h, derrière tout ce qui est aux heures d'avant (la construite de l'heure d'avant comprise) */
  try { if (typeof dr_preparer === 'function') dr_preparer(E); } catch (x) {} try { reindexer(); } catch (x) {} return e; }
/* la copie de la classe réécrite (C/ecrans) — par le chemin connu, pas par `dr_copieAuto` (hors heure lancée, `dr_clPeutEcrire` refuse) */
function dr_reactEcrireCopie(C, motif, cb){ C = C || dr_reactCheminC(); if (!C) { if (cb) cb(false); return false; }
  try { const ecr = dr_copiePourHub(dr_reactClone(seance().ecrans)); DR_CL.empreinteEcrite = dr_empreinte(ecr); dr_ecrire(C + '/ecrans', ecr, motif || 'La copie de la classe — la réactivation construite', () => { if (cb) cb(true); }); return true; } catch (x) { if (cb) cb(false); return false; } }
/* (1) à la clôture de l'heure h : la diapo de l'heure h+1, depuis le paquet qui vient d'être clos, dans la copie */
function dr_reactApresCloture(C, h, local, cb){ const fini = ok => { if (cb) cb(ok); };
  try { if (!C || dr_reactDejaLa(h)) return fini(false); const sur = +((dr_heureJouee(h - 1) || {}).sur || DR_CL.sur || 0); if (sur && h > sur && !(local && local.paquet && typeof edtReportees === 'function' && edtReportees(local.paquet, ['reporter']).length)) return fini(false);   /* ㊲ (C16) : une dernière heure qui a reporté ouvre la suite — sa réactivation se construit ici aussi */   /* la dernière heure de la séance : pas d'heure h+1 ici (l'heure 1 de la séance d'après se construit à son ouverture, E4 RC11) */
    if (typeof dr_reactivationPreparer !== 'function') return fini(false);
    let fait = false; const fin = e => { if (fait) return; fait = true; if (!dr_reactValide(e)) { DR_CL.react.raison[h] = (e && e.raison) || 'rien de joué avant : rien à réactiver'; return fini(false); }
      const pose = dr_reactPoser(h, e); if (!pose) return fini(false); DR_CL.react.prete[h] = undefined; dr_reactEcrireCopie(C, 'La réactivation de l’heure ' + h + ', construite à la clôture de l’heure ' + (h - 1), () => fini(true)); };
    dr_reactivationPreparer(h, fin, local || undefined); setTimeout(() => fin(null), 4000); } catch (x) { fini(false); } }
/* (7) à l'ouverture de l'heure h (état relu, l'heure d'avant close sans construite — clôture manquée) : construite maintenant, écrite dans la copie */
function dr_reactOuvertureAssurer(h, C, cb){ if (dr_reactDejaLa(h)) { cb(dr_reactEcran(h)); return; } dr_reactPreparerAsync(h, e => { if (e && C) { const pose = dr_reactPoser(h, e); if (pose) { DR_CL.react.prete[h] = undefined; dr_reactEcrireCopie(C, 'La réactivation de l’heure ' + h + ', construite à l’ouverture (clôture manquée)'); } } cb(e); }); }
function dr_reactChoix(h){ const c = DR_CL.react.choix[h]; return c === 'oui' || c === 'non' ? c : dr_reglageReactivationLu(); }
/* l'écran de l'heure h : celui de la copie, sinon celui tenu en mémoire (l'heure 1 : la copie n'existe pas avant le lancement) */
function dr_reactEcranOuPrete(h){ return dr_reactEcran(h) || (DR_CL.react.prete[h] !== undefined ? DR_CL.react.prete[h] : dr_reactPreparer(h)); }
function dr_reactAnnoncee(h){ return dr_reactChoix(h) === 'oui' && !!dr_reactEcranOuPrete(h); }
function dr_reactHorsCopie(h){ return dr_reactAnnoncee(h) && !dr_reactDejaLa(h); }   /* annoncée mais pas encore dans la copie (l'heure 1) : la puce est à part */
function dr_reactDecal(h){ return dr_reactHorsCopie(h) ? 1 : 0; }
function dr_reactPuceHtml(h){ return dr_reactHorsCopie(h) ? dr_reactPuce(h, 1, DR_REACT_TITRE) : ''; }
/* la puce « n. Où en sommes-nous ? » de l'écran d'ouverture : cliquable, elle ouvre la diapo dans le pilote sans lancer (§12.26-3) */
function dr_reactPuce(h, n, act){ return `<span class="puce" id="o-react-voir" role="button" style="cursor:pointer;text-decoration:underline dotted" title="Voir la diapo « ${dr_esc(act)} » dans le pilote, telle qu’elle ira au tableau, sans rien lancer — tu peux y écrire ; retour à cet écran ensuite">${n}. ${dr_esc(act)} <i style="color:var(--ambre)">réactivation (construite depuis l'heure d'avant)</i></span> `; }
function dr_reactInserer(h){ /* au lancement de l'heure h (§12.26) : « oui » → la construite de la copie (ou celle tenue en mémoire) ; « non » → retirée de la copie ; plus de construction ici */
  try { const E = seance().ecrans;
    if (dr_reactChoix(h) !== 'oui') { let n = 0; for (let i = E.length - 1; i >= 0; i--) { if (E[i] && E[i].role === 'reactivation' && +E[i].heure === +h) { E.splice(i, 1); n++; } } if (n) { try { reindexer(); } catch (x) {} } DR_CL.react.prete[h] = undefined; return false; }
    if (dr_reactDejaLa(h)) return true; const p = DR_CL.react.prete[h]; if (!dr_reactValide(p)) return false; const e = dr_reactPoser(h, p); DR_CL.react.prete[h] = undefined; return !!e; } catch (x) { return false; } }
function dr_reactBoutonHtml(h){ const e = dr_reactEcranOuPrete(h); const deja = dr_reactDejaLa(h); const c = dr_reactChoix(h); const reg = dr_reglageReactivationLu(); const off = !e; const raison = off ? (DR_CL.react.raison[h] || 'rien à réactiver') : '';
  const depuis = e && e.construite && e.construite.depuis ? ' (depuis ' + dr_esc(String(e.construite.depuis)) + ')' : ''; const mod = e && dr_reactEstModifiee(e);
  return `<div class="travail" id="o-react"><b>Ouvrir par la réactivation</b> — ${off ? '<i>' + dr_esc(raison) + '</i>' : 'la diapo « ' + dr_esc(DR_REACT_TITRE) + ' », construite depuis ce que la classe a fait à l’heure d’avant' + depuis + (deja ? ', dans la copie de la classe' : '') + (mod ? ' — <b>ta version</b>' : '') + ' ; la puce 1 la montre dans le pilote, sans lancer'} :
    <label style="display:inline-block;margin-right:12px" title="Oui : l’heure ${h} s’ouvre sur la réactivation construite, en tête, avant ce qui glisse et le programme — rien n’est inventé, seulement ce qui a été fait"><input type="radio" name="o-react" id="o-react-oui" value="oui" ${c === 'oui' ? 'checked' : ''} ${off ? 'disabled' : ''}> oui</label>
    <label style="display:inline-block;margin-right:12px" title="Non : l’heure ${h} s’ouvre sur ce qui glisse, puis le programme ; la réactivation construite est retirée de la copie de la classe"><input type="radio" name="o-react" id="o-react-non" value="non" ${c === 'non' ? 'checked' : ''} ${off ? 'disabled' : ''}> non</label>
    <label style="display:inline-block;margin-left:14px" title="Le réglage de la séance : la réponse proposée à chaque heure de cette séance (écrite dans la trame : deroule/reactivation ; l’Atelier l’affiche aussi) — ce choix-ci reste à toi à chaque heure">réglage de la séance : <select id="o-react-reg"><option value="oui" ${reg === 'oui' ? 'selected' : ''}>oui</option><option value="non" ${reg === 'non' ? 'selected' : ''}>non</option></select></label></div>`; }
function dr_reactBrancher(h, redessiner, retour){ try { ['o-react-oui', 'o-react-non'].forEach(id => { const el = document.getElementById(id); if (el) el.onchange = () => { if (el.checked) { DR_CL.react.choix[h] = el.value; redessiner(); } }; });
    const sel = document.getElementById('o-react-reg'); if (sel) sel.onchange = () => { dr_reglageReactivation(null, sel.value, () => {}); redessiner(); };
    const v = document.getElementById('o-react-voir'); if (v) v.onclick = ev => { if (ev) { ev.preventDefault(); ev.stopPropagation(); } dr_reactVoir(h, retour || 'ouverture'); }; } catch (e) {} }
/* ─── (3) voir sans lancer : l'aperçu dans le pilote ─── */
function dr_reactAvantLancement(){ return !!(DR_CL.reactVue && !S.atelier && !S.repetition); }   /* pour E1 : le geste d'écriture s'arme là-dessus (à l'écran d'ouverture, S est l'état relu de l'heure d'avant : S.lancee et S.close sont vrais) */
function dr_reactVoir(h, retour){ try { let e = dr_reactEcran(h); if (!e) { const p = DR_CL.react.prete[h]; if (!dr_reactValide(p)) return false; e = dr_reactPoser(h, p); if (!e) return false; }   /* l'heure 1 : l'écran tenu en mémoire est posé dans la trame en mémoire pour le rendu (E1 : `dr_derouleDe` ne l'écrit pas) ; `prete[h]` reste le même objet jusqu'au lancement */
    DR_CL.reactVue = { h: +h, eid: e.eid, C: dr_reactCheminC(), diAvant: S.di, pageAvant: S.page, retour: retour || 'ouverture' };
    S.page = null; S.pageManuelle = false; S.pagesCourantes = null;   /* 13 · 36 : la pagination repart pour cette diapo (celle de la diapo d'avant ne vaut pas) */
    try { $('ecran-fin').classList.remove('on', 'ouverture'); } catch (x) {} try { voir('pilotage'); } catch (x) {}
    dr_reactApercuRendre(); return true; } catch (x) { DR_CL.reactVue = null; return false; } }
function dr_reactApercuRendre(){ const v = DR_CL.reactVue; if (!v) return; const E = seance().ecrans; const i = E.findIndex(x => x && x.eid === v.eid); if (i < 0) { dr_reactRetour(); return; }
  const e = E[i]; if (S.di !== i) { S.di = i; S.page = null; S.pageManuelle = false; } S.doc = null; S.blocActif = null; const mur = $('mur'); if (!mur) return;   /* 13 · 36 : la page courante est gardée d'un rendu à l'autre (Maj+←/→, ‹ ›) */
  try { dimensionner(); } catch (x) {} const et = etatComplet(); et.pilote = true; et.nDev = elements(e).length; et.ecrire = false; et.attente = null; et.flash = null; et.pages = null; et.pagesP = null; et.policeRatio = null; et.page = S.page == null ? 0 : S.page; et._pageManuelle = true;   /* la première page d'abord (le suivi du dévoilement irait à la dernière : tout est « dévoilé » dans l'aperçu), puis celle que Paul a choisie */   /* toutes ses lignes ; l'heure d'avant est close : pas l'écran d'attente ; rien n'est poussé : ni journal, ni tableau. 13 · 36 : pas la zone « ✎ clique ici et écris » (inerte hors Atelier — `p8EcrireSous` refuse — et collée au bas du cadre, elle couvrait la dernière ligne) ; les pages se recalculent pour CETTE diapo (`paginer`), comme au pilote d'une heure lancée */
  rendre(mur, et); mur.className = 'mur pilote react-apercu' + (S.mode === 'lum' ? ' mode-lum' : S.mode === 'ecr' ? ' mode-ecr' : '');
  S.page = et.page; S.pagesCourantes = et.pages; S.pagesPCourantes = et.pagesP; S.policeRatioCourante = et.policeRatio;   /* 13 · 36 : le compteur « page i / n », ‹ › et Maj+←/→ (`pageMain`) marchent dans l'aperçu — le tableau aura les mêmes pages (`pagesP`) */
  try { $('numero').innerHTML = `<b>Avant le lancement · ${dr_esc(e.act)} · heure ${v.h}</b>`; $('dtitre').textContent = `· réactivation construite depuis l'heure ${v.h - 1} · prévue ${e.dur} min · H${v.h}`; $('compte').textContent = 'aperçu — rien n\'est montré à la classe, rien n\'est écrit au journal'; } catch (x) {}
  dr_reactEnteteRendre(e);
  try { if (typeof brancherAtelier === 'function') setTimeout(brancherAtelier, 0); } catch (x) {} }
/* l'entête du pilote (`.scene > .titre`, jamais au tableau) : le retour à l'écran d'ouverture ; « ta version » + ↩ quand les blocs diffèrent de la version calculée (§12.26-5) */
function dr_reactEnteteRendre(e){ let z = document.getElementById('react-entete'); const titre = document.querySelector('#pilotage .scene > .titre') || (document.getElementById('dtitre') || {}).parentElement; if (!DR_CL.reactVue || !e) { if (z) z.remove(); return; }
  if (!z) { z = document.createElement('span'); z.id = 'react-entete'; z.className = 'dr-d'; z.style.cssText = 'display:inline-flex;gap:8px;align-items:center;margin-left:14px;white-space:nowrap;flex:0 0 auto'; if (titre) { const tm = document.getElementById('temoin-mini'); if (tm && tm.parentElement === titre) titre.insertBefore(z, tm); else titre.appendChild(z); } }
  const mod = dr_reactEstModifiee(e);
  z.innerHTML = `<button class="btn" id="react-retour" title="Revenir à l’écran « Où en est la classe » — rien n’est lancé, ce que tu as écrit ici est gardé dans la copie de la classe">↶ Où en est la classe</button>` + (mod ? `<span id="react-version" style="display:inline-flex;gap:6px;align-items:center;color:var(--ambre)"><span class="ta-version"><b>ta version</b></span><button class="btn" id="react-calculee" title="Réafficher la version calculée par le site — ce que tu as changé dans cette diapo est perdu">↩</button></span>` : '');
  const r = document.getElementById('react-retour'); if (r) r.onclick = () => dr_reactRetour(); const c = document.getElementById('react-calculee'); if (c) c.onclick = () => dr_reactRetourCalculee(); }
/* (4) après la frappe de Paul dans la diapo (E1 l'appelle, ou `dr_sauve` enveloppé) : la copie écrite, la mention à jour */
function dr_reactModifiee(){ const v = DR_CL.reactVue; if (!v) return false; const e = dr_reactEcranDe(v.eid); if (!e) return false;
  try { if (typeof dr_preparer === 'function') dr_preparer(seance().ecrans); } catch (x) {}
  const mod = dr_reactEstModifiee(e); if (v.C) dr_reactEcrireCopie(v.C, mod ? 'La réactivation de l’heure ' + v.h + ' — ta version' : 'La réactivation de l’heure ' + v.h);   /* l'heure 1 (pas de copie avant le lancement) : en mémoire, écrite au lancement */
  if (document.activeElement && document.activeElement.closest && document.activeElement.closest('#mur')) dr_reactEnteteRendre(e); else dr_reactApercuRendre(); return mod; }   /* Paul écrit encore (le curseur est dans la diapo) : l'entête seule ; sinon le rendu entier */
/* (5) ↩ : la version calculée revient (sans recalcul : `construite.calculee`), la copie est réécrite, la mention tombe */
function dr_reactRetourCalculee(){ const v = DR_CL.reactVue; if (!v) return false; const e = dr_reactEcranDe(v.eid); if (!e || !e.construite || !e.construite.calculee) return false;
  try { if (typeof dr_reactivationRetour === 'function') dr_reactivationRetour(e); else e.blocs = dr_reactClone(e.construite.calculee); } catch (x) { e.blocs = dr_reactClone(e.construite.calculee); }
  try { if (typeof dr_preparer === 'function') dr_preparer(seance().ecrans); } catch (x) {} try { reindexer(); } catch (x) {}
  if (v.C) dr_reactEcrireCopie(v.C, 'La réactivation de l’heure ' + v.h + ' — la version calculée réaffichée'); dr_reactApercuRendre(); return true; }
/* retour à l'écran d'ouverture */
function dr_reactRetour(){ const v = DR_CL.reactVue; DR_CL.reactVue = null; const z = document.getElementById('react-entete'); if (z) z.remove(); try { const mur = $('mur'); if (mur) mur.classList.remove('react-apercu'); } catch (x) {}
  if (!v) return;
  if (v.retour === 'legere') { try { const E = seance().ecrans; const i = E.findIndex(x => x && x.eid === v.eid); if (i >= 0 && DR_CL.react.prete[v.h] === E[i]) { E.splice(i, 1); reindexer(); } } catch (x) {} }   /* l'heure 1 : l'écran tenu en mémoire (prete[h], ses modifications avec) quitte la trame en mémoire ; le lancement le posera */
  if (v.diAvant != null && v.diAvant >= 0 && v.diAvant < seance().ecrans.length) { S.di = v.diAvant; S.page = v.pageAvant != null ? v.pageAvant : null; S.pagesCourantes = null; S.pageManuelle = false; }
  try { if (v.retour === 'legere') dr_ouvertureLegere(v.h); else ouvrirOuverture(); } catch (x) {} }
/* pendant l'aperçu, le socle ne pousse rien et n'écrit pas la trame : `dr_tout` rend seulement, `dr_sauve` écrit la copie (E1 appelle l'un et l'autre après chaque frappe) */
setTimeout(() => { [['dr_tout', () => { dr_reactApercuRendre(); }], ['dr_sauve', () => { dr_reactModifiee(); }]].forEach(([nom, f]) => { const o0 = window[nom]; if (typeof o0 !== 'function' || o0.__react) return;
  const g = function () { if (DR_CL.reactVue) { f(); return; } return o0.apply(this, arguments); }; g.__react = true; window[nom] = g; }); }, 0);
/* l'écran d'ouverture léger (§12.25-2) : l'heure 1 d'une séance, ou une heure n dont l'état n'est pas au hub — la classe, le créneau, la réactivation proposée, le même bouton, la puce qui montre */
function dr_ouvertureLegere(h){ try { if ($('fin').parentElement !== $('ecran-fin')) $('ecran-fin').appendChild($('fin')); $('droite').classList.remove('fin'); } catch (e) {}
  const x = DR_CL.suite || {}; const nom = x.nom || dr_nomClasse(x.classeSlug); const N = DR_CL.sur || 1; const p = dr_reactEcranOuPrete(h); const sur = () => dr_reactAnnoncee(h) ? 'la réactivation « ' + dr_esc(DR_REACT_TITRE) + ' » (construite)' : 'le programme, là où la classe s’est arrêtée';   /* l'ordre de l'heure n'est calculé qu'au lancement (frontières, continuation) : on annonce ce qui est sûr */
  let html = `<h2>Où en est la ${dr_esc(nom)} — ${dr_esc(dr_jourCreneauEnClair(new Date().toISOString().slice(0, 10), x.creneau || ''))} · heure ${h} sur ${N}</h2><div class="sous">${dr_esc(seance().titre)}</div>`;
  html += `<div class="travail">${h > 1 ? 'La classe a déjà joué cette séance (son état n’est pas au hub : seul le paquet de l’heure d’avant est lu)' : 'Première heure de la séance'} : ${p && p.construite && p.construite.depuis ? 'la dernière heure jouée (' + dr_esc(String(p.construite.depuis)) + ') peut être réactivée.' : 'rien à réactiver.'}</div>`;
  if (dr_reactAnnoncee(h)) html += `<div class="travail"><b>Ce que l'heure ${h} jouera, dans l'ordre</b> : ${dr_reactDejaLa(h) ? dr_reactPuce(h, 1, DR_REACT_TITRE) : dr_reactPuceHtml(h)}<span class="puce">2. le programme, là où la classe s’est arrêtée</span></div>`;
  html += dr_reactBoutonHtml(h);
  html += `<div style="height:70px"></div><div class="barre-fin"><span style="color:var(--texte2)">Lancer ouvre l'heure ${h} sur ${sur()} ; rien n'est projeté avant.</span><span style="flex:1"></span><button class="btn or" id="o-lancer" title="Lance l’heure ${h} : le chrono démarre, ${dr_esc(sur().replace(/<[^>]+>/g, ''))} va au tableau, tout s’enregistre pour la classe">Lancer l'heure ${h}</button></div>`;
  poserHtml($('fin'), html); $('ecran-fin').classList.add('on', 'ouverture'); try { $('ecran-edt').classList.remove('on'); } catch (e) {} try { voir('pilotage'); } catch (e) {}
  dr_reactBrancher(h, () => dr_ouvertureLegere(h), 'legere'); $('o-lancer').onclick = () => { DR_CL.react.decide[h] = true; $('ecran-fin').classList.remove('on', 'ouverture'); dr_lancerSuite(h); }; }


/* ═══ §12.28-3 (c)(d)(e) — une heure lancée ne se quitte pas ; elle se reprend à l'endroit exact (E2 : la vie de l'heure) ═══
   (c) la garde du navigateur tant que l'heure est lancée et pas close ; (d) l'onglet qui tient l'heure se signale aux autres onglets de ce
   navigateur (BroadcastChannel, l'événement `storage` à défaut) et dit qu'il part (`pagehide`) : le bandeau « Heure en cours avec les <classe> —
   Reprendre » paraît aussitôt ailleurs ; un autre navigateur ne voit que `/site/cours_actif` (la veille de 5 s de `sesReprisePoser`) ;
   (e) l'état et le journal de l'heure sont aussi gardés dans ce navigateur (au fil et au départ) : la reprise prend le plus récent. */
function dr_heureTenue(){ try { return !!(typeof S === 'object' && S && S.lancee && !S.close && !S.repetition && typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME === 'classe' && AT_DR_COURS && !(typeof SES === 'object' && SES && SES.mode)); } catch (e) { return false; } }
function dr_coursIci(){ try { return Object.assign(dr_coursActif(), { ts: (DR_CL.coursTs || Date.now()) }); } catch (e) { return null; } }
/* (c) la garde : posée tant que l'heure tient, d'elle-même retirée à la clôture (S.close) — Chrome n'affiche pas de texte du site : le message est le bandeau (d) */
window.addEventListener('beforeunload', ev => { if (!dr_heureTenue()) return; try { dr_heureLocaleEcrire(); } catch (e) {} ev.preventDefault(); ev.returnValue = ''; return ''; });
/* (e) le miroir local de l'heure : un seul, l'heure tenue dans ce navigateur */
const DR_LOC_ETAT = 'mjpc-heure-etat', DR_LOC_PARTIE = 'mjpc-heure-partie';
function dr_heureLocaleEcrire(){ if (!dr_heureTenue()) return; const x = dr_heureLocaleObjet(); if (!x) return; try { localStorage.setItem(DR_LOC_ETAT, JSON.stringify(x)); } catch (e) {} }
function dr_heureLocaleObjet(){ const C = dr_cheminC(); return C ? { C, etat: dr_etatHeure(), journal: dr_journalHub(), maj: Date.now() } : null; }
/* (e) l'état de l'heure tel que ce navigateur le connaît : le miroir `localStorage` et le dernier état reçu de l'onglet de l'heure par le canal
   (son signe de vie et son départ le portent — contrôle n°68 : un `localStorage` écrit à la fermeture d'un onglet n'est pas toujours lu à temps par l'autre) */
function dr_heureLocaleLire(C){ const ok = x => x && x.C === C && x.etat && (Date.now() - (+x.maj || 0)) < 4 * 3600 * 1000; let ls = null; try { ls = JSON.parse(localStorage.getItem(DR_LOC_ETAT) || 'null'); } catch (e) {}
  const mem = (DR_CL.onglet && DR_CL.onglet.etats || {})[C] || null; const c = [ls, mem].filter(ok); if (!c.length) return null; return c.length === 1 ? c[0] : ((+c[0].maj || 0) > (+c[1].maj || 0) ? c[0] : c[1]); }
/* (d) les onglets entre eux */
DR_CL.onglet = { id: Math.random().toString(36).slice(2), tenus: {}, partis: {}, clos: {}, etats: {} };
DR_CL.canal = null; try { if (typeof BroadcastChannel === 'function') DR_CL.canal = new BroadcastChannel('mjpc-heure'); } catch (e) {}
function dr_ongletDire(m){ m.de = DR_CL.onglet.id; m.n = Date.now() + Math.random(); try { if (DR_CL.canal) { DR_CL.canal.postMessage(m); return; } } catch (e) {} try { localStorage.setItem('mjpc-heure-msg', JSON.stringify(m)); } catch (e) {} }
function dr_ongletProf(){ try { return document.body.classList.contains('admin-mode') || !!(window.TRACK && TRACK.eleve && TRACK.eleve.is_prof); } catch (e) { return false; } }   /* le bandeau n'est que pour la session prof (jamais côté élève) */
function dr_ongletEntendre(m){
  if (!m || m.de === DR_CL.onglet.id || (typeof SES === 'object' && SES && SES.mode)) return; const O = DR_CL.onglet;
  if (m.t === 'qui') { if (dr_heureTenue()) { const c = dr_coursIci(); if (c) dr_ongletDire({ t: 'tiens', sig: _drSignatureCours(c), c, etat: dr_heureLocaleObjet() }); } return; }
  if (m.etat && m.etat.C) O.etats[m.etat.C] = m.etat;   /* (e) l'état porté par le message */
  if (m.t === 'tiens') { O.tenus[m.sig] = Date.now(); delete O.partis[m.sig]; try { if (SES._reprise && _drSignatureCours(SES._reprise) === m.sig) sesRepriseRetirer(); } catch (e) {} return; }
  if (m.t === 'part') { delete O.tenus[m.sig]; if (O.clos[m.sig]) return; O.partis[m.sig] = m.c; if (!dr_heureTenue() && dr_ongletProf() && !(m.c && m.c.test)) try { sesReprisePeindre(m.c); } catch (e) {} return; }   /* lot 1 (359) : un essai parti (mode test) ne se propose jamais comme une heure — son bandeau vient de son annonce d'essai (`dr_sesBandeau`) */
  if (m.t === 'clos') { delete O.tenus[m.sig]; delete O.partis[m.sig]; O.clos[m.sig] = true; O.etats = {}; try { if (SES._reprise && _drSignatureCours(SES._reprise) === m.sig) sesRepriseRetirer(); } catch (e) {} }
}
if (DR_CL.canal) DR_CL.canal.onmessage = ev => dr_ongletEntendre(ev.data);
window.addEventListener('storage', ev => { if (ev.key === 'mjpc-heure-msg' && ev.newValue) { try { dr_ongletEntendre(JSON.parse(ev.newValue)); } catch (e) {} } });
/* l'heure est-elle tenue par un autre onglet de ce navigateur ? (un signe de vie de moins de 5 s) */
function dr_heureTenueAilleurs(sig){ const t = DR_CL.onglet.tenus[sig]; return !!(t && Date.now() - t < 5000); }
/* ce que ce navigateur sait d'une heure partie (un onglet de l'heure fermé ou rechargé) : le message, ou la marque laissée au départ */
function dr_heurePartie(){ const O = DR_CL.onglet; const k = Object.keys(O.partis).find(s => !O.clos[s] && !dr_heureTenueAilleurs(s)); if (k) return O.partis[k];
  try { const x = JSON.parse(localStorage.getItem(DR_LOC_PARTIE) || 'null'); if (x && x.c && (Date.now() - (+x.t || 0)) < 4 * 3600 * 1000) { const sg = _drSignatureCours(x.c); if (!O.clos[sg] && !dr_heureTenueAilleurs(sg)) return x.c; } } catch (e) {} return null; }
/* l'onglet de l'heure : un signe de vie toutes les 2 s ; au départ, « je pars » et la marque */
setInterval(() => { try { if (!dr_heureTenue()) return; const c = dr_coursIci(); if (!c) return; const sg = _drSignatureCours(c); dr_ongletDire({ t: 'tiens', sig: sg, c, etat: dr_heureLocaleObjet() });
  try { const x = JSON.parse(localStorage.getItem(DR_LOC_PARTIE) || 'null'); if (x && x.c && _drSignatureCours(x.c) === sg) localStorage.removeItem(DR_LOC_PARTIE); } catch (e) {} } catch (e) {} }, 2000);
/* C16 (lot 1, 359) : le miroir local d'un ESSAI le dit (`test`) — sans cette marque, un autre onglet hors mode test le proposait comme une heure (« Heure en
   cours avec les … — Reprendre ») et le reprenait en mode réel : la suite de l'essai partait au vrai hub, sans le nom de la classe (le mécanisme de l'audit
   global II §3.0.2, M2). Un essai ne se reprend que par son annonce d'essai, en mode test (`dr_sesReprendreEssai`). */
function dr_coursMiroir(){ const c = dr_coursIci(); try { if (c && typeof m8TestOn === 'function' && m8TestOn()) c.test = true; } catch (e) {} return c; }
window.addEventListener('pagehide', () => { try { if (!dr_heureTenue()) return; dr_heureLocaleEcrire(); const c = dr_coursMiroir(); if (!c) return; try { localStorage.setItem(DR_LOC_PARTIE, JSON.stringify({ c, t: Date.now() })); } catch (e) {} dr_ongletDire({ t: 'part', sig: _drSignatureCours(c), c, etat: dr_heureLocaleObjet() }); } catch (e) {} });
function dr_ongletClos(){ const c = dr_coursIci(); if (!c) return; const sg = _drSignatureCours(c); DR_CL.onglet.clos[sg] = true; dr_ongletDire({ t: 'clos', sig: sg });
  try { localStorage.removeItem(DR_LOC_ETAT); const x = JSON.parse(localStorage.getItem(DR_LOC_PARTIE) || 'null'); if (x && x.c && _drSignatureCours(x.c) === sg) localStorage.removeItem(DR_LOC_PARTIE); } catch (e) {} }
/* un onglet qui s'ouvre demande qui tient l'heure (la réponse arrive avant la première veille du bandeau) */
if (!(typeof SES === 'object' && SES && SES.mode)) setTimeout(() => dr_ongletDire({ t: 'qui' }), 0);


/* ═══ §12.68 — ANNULER UNE HEURE LANCÉE PAR ERREUR (Paul, 29/10 09:54 : « il faut que je puisse la fermer et qu'elle ne compte pas comme jouée ni rien
   du tout. le site oublierait tout ce que j'y ai fait ») ══════════════════════════════════════════════════════════════════════════════════════════
   Au Pilotage, à côté de « ■ Clore l'heure », jusqu'à la clôture : « Annuler cette heure », avec une confirmation qui dit ce qui sera oublié.
   Ce que l'heure a écrit, et seulement cela : dans la copie de la classe (`deroule_joue/<classe>`), chaque clé changée depuis le lancement revient
   à ce qu'elle était (lue avant le lancement : la copie, le journal, l'état — la participation, les absents de l'appel —, le récit, la scène) et la
   trace de cette heure (`heures/<clé>`, les absents de la case compris) disparaît ; `/site/cours_actif` s'il est encore le nôtre ; en mode test,
   l'image du tableau (`/site/tableau_test`) ; le miroir de l'heure dans ce navigateur (la présence) et les autres onglets prévenus. L'emploi du temps
   n'est jamais écrit : l'heure n'y compte pas comme jouée. La réactivation construite à la clôture d'avant est dans la copie d'avant : elle reste.
   La page revient à ce qu'elle était avant le lancement (comme « ■ Arrêter » une répétition), puis à l'emploi du temps. Le tableau distant voit sa
   scène retirée : il revient à l'horloge (dr-tableau.js, `dr_tabSceneOubliee`). Les écritures passent par `dr_ecrire` (le mode test les garde). */
const DR_ANNUL_BULLE = 'Annuler cette heure : pour une heure lancée par erreur (pas la bonne classe, pas le bon moment). Le site oublie tout ce qu’elle a écrit — '
  + 'ce que la classe a vu, la copie de la classe, le journal, le récit, la participation, les absents — et le tableau distant revient à l’horloge ; '
  + 'l’emploi du temps ne la compte pas comme jouée. Une confirmation te le redit avant. Après la clôture, ce n’est plus possible.';
function dr_annulInstantane(){ const clone = x => JSON.parse(JSON.stringify(x === undefined ? null : x)); const E = seance().ecrans;
  return { S: clone(Object.fromEntries(Object.entries(S).filter(([k, v]) => !k.startsWith('_') && k !== 'repSnap' && typeof v !== 'function'))), vuMax: clone(vuMax), parDiapo: clone(parDiapo), Jlen: J.length,
    ecrans: clone(E), props: E.map(e => Object.getOwnPropertyNames(e || {}).map(n => [n, Object.getOwnPropertyDescriptor(e, n)]).filter(([n, d]) => !d.enumerable && 'value' in d).map(([n, d]) => [n, { value: d.value, writable: !!d.writable, enumerable: false, configurable: true }])),
    cours: (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) ? clone(AT_DR_COURS) : null, regime: typeof AT_DR_REGIME !== 'undefined' ? AT_DR_REGIME : 'prep', si: S.si }; }
function dr_annulPeut(){ try { return !!(S.lancee && !S.close && !S.repetition && !S.atelier && typeof AT_DR_REGIME !== 'undefined' && AT_DR_REGIME === 'classe' && AT_DR_COURS && DR_CL.ouverte); } catch (e) { return false; } }
function dr_annulPoser(){
  const f = document.getElementById('dr-clore') || document.getElementById('bfin'); if (!f) return; let b = document.getElementById('dr-annul');
  if (!b) { b = document.createElement('button'); b.id = 'dr-annul'; b.className = 'btn'; b.type = 'button'; b.textContent = 'Annuler cette heure'; b.title = DR_ANNUL_BULLE; b.onclick = dr_annulDemander; f.insertAdjacentElement('afterend', b); }
  const v = dr_annulPeut() ? '' : 'none'; if (b.style.display !== v) b.style.display = v; }
function dr_annulDemander(){ if (!dr_annulPeut()) return; let g = document.getElementById('garde-annul');
  if (!g) { const ref = document.getElementById('garde-clore'); g = document.createElement('div'); g.className = 'garde'; g.id = 'garde-annul';
    g.innerHTML = '<div class="boite" style="width:620px;border-color:var(--or)"><h3 style="margin:0 0 8px;color:var(--or);font-size:1.05rem" id="gannul-titre"></h3><p id="gannul-corps" style="margin:0 0 6px"></p><p style="margin:0;color:var(--texte2);font-size:.9rem">L’emploi du temps ne la compte pas comme jouée. La réactivation préparée à la clôture d’avant reste.</p>'
      + '<div class="choix" style="justify-content:flex-end;margin-top:12px"><button class="btn" id="gannul-non" title="Ne rien annuler : l’heure continue, rien n’est perdu">Garder l’heure</button><button class="btn or" id="gannul-oui" title="Annule l’heure : tout ce qu’elle a écrit est oublié, le tableau distant revient à l’horloge, tu retournes à l’emploi du temps">Annuler l’heure</button></div></div>';
    (ref && ref.parentNode ? ref.parentNode : document.body).appendChild(g);
    g.addEventListener('click', ev => { const t = ev.target && ev.target.closest && ev.target.closest('button'); if (!t) return; g.classList.remove('on'); if (t.id === 'gannul-oui') dr_annulerHeure(); }); }
  const nom = (AT_DR_COURS && (AT_DR_COURS.classeNom || AT_DR_COURS.classeSlug)) || '';
  document.getElementById('gannul-titre').textContent = 'Annuler l’heure des ' + nom + ' (' + dr_creneauDuCours(AT_DR_COURS) + ') ?';
  document.getElementById('gannul-corps').textContent = 'Le site oublie tout ce que cette heure a écrit : ce que la classe a vu, la copie de la classe, le journal, le récit, la participation, les absents. L’heure s’arrête et le tableau distant revient à l’horloge.';
  g.classList.add('on'); }
/* la remise du hub : chaque clé de la copie de la classe changée depuis le lancement reprend sa valeur d'avant ; la trace de cette heure s'efface.
   Jouée deux fois (tout de suite, puis 2,5 s plus tard : une écriture partie juste avant l'annulation ne survit pas). */
function dr_annulRemettre(x){ if (!x || !x.C) return;
  dr_lire(x.C, cur => { if (cur === undefined) return; cur = cur || {}; const av = x.avant || {};
    const cles = new Set(Object.keys(cur).concat(Object.keys(av))); cles.delete('heures');
    cles.forEach(k => { const a = av[k] === undefined ? null : av[k], b = cur[k] === undefined ? null : cur[k]; if (JSON.stringify(a) !== JSON.stringify(b)) dr_ecrire(x.C + '/' + k, a, 'Heure annulée — la copie de la classe revient à avant le lancement', () => {}); });
    if (x.cle) { const a = (av.heures && av.heures[x.cle]) || null, b = (cur.heures && cur.heures[x.cle]) || null; if (JSON.stringify(a) !== JSON.stringify(b)) dr_ecrire(x.C + '/heures/' + x.cle, a, 'Heure annulée — sa trace est oubliée', () => {}); } }); }
/* la projection de l'emploi du temps apprend que l'heure n'a pas été jouée (dr_joueeIci l'y avait posée) */
function dr_joueeOublier(H){ if (!H) return; try { if (DR_CL.joueesIci) delete DR_CL.joueesIci[H]; const m = /^\/site\/([^/]+)\/chapitres\/([^/]+)\/seances\/([^/]+)\/deroule_joue\/([^/]+)\/heures\/([^/]+)$/.exec(H); if (!m || typeof EDT_CHAP === 'undefined' || !EDT_CHAP[m[1]]) return;
  const ch = EDT_CHAP[m[1]].find(c => c && c.__cle === m[2]); const se = ch && edtListe(ch.seances).find(s => s && s.__i === m[3]); const b = se && se.deroule_joue && se.deroule_joue[m[4]]; if (b && b.heures) delete b.heures[m[5]]; } catch (e) {} }
function dr_annulerHeure(){
  if (!dr_annulPeut()) return;
  const o = DR_CL.ouverte || {}; const C = o.C, H = o.H; const cle = H ? String(H).split('/').pop() : null;
  const av = (DR_CL.avant && DR_CL.avant.C === C && DR_CL.avant.hub !== undefined) ? (DR_CL.avant.hub || {}) : null;
  const nom = (AT_DR_COURS && (AT_DR_COURS.classeNom || AT_DR_COURS.classeSlug)) || ''; let sig = ''; try { sig = _drSignatureCours(dr_coursIci()); } catch (e) {}
  /* 1. plus rien ne part : les débounces, le minuteur, les autres onglets et le miroir de ce navigateur */
  [DR_CL.jT, DR_CL.eT, DR_CL.tT, DR_CL.cT].forEach(clearTimeout); try { dr_minuteurFin(); } catch (e) {}
  try { dr_ongletClos(); } catch (e) {}
  /* 2. la page revient à avant le lancement */
  const mem = DR_CL.avantMem; AT_DR_REGIME = 'prep';
  try { if (mem) { Object.keys(S).forEach(k => { if (!k.startsWith('_')) delete S[k]; }); Object.assign(S, mem.S); Object.keys(vuMax).forEach(k => delete vuMax[k]); Object.assign(vuMax, mem.vuMax); Object.keys(parDiapo).forEach(k => delete parDiapo[k]); Object.assign(parDiapo, mem.parDiapo); J.length = Math.min(J.length, mem.Jlen);
      const E0 = dr_seances()[S.si].ecrans; E0.splice(0, E0.length, ...mem.ecrans); (mem.props || []).forEach((l, k) => { const e = E0[k]; if (e) l.forEach(([n, d]) => { try { Object.defineProperty(e, n, d); } catch (x) {} }); });
      AT_DR_COURS = mem.cours; AT_DR_REGIME = mem.regime === 'classe' ? 'prep' : (mem.regime || 'prep'); }
    else { S.lancee = false; S.close = false; AT_DR_COURS = null; } } catch (e) { S.lancee = false; S.close = false; }
  S.mur = null; S.gel = null; DR_CL.ouverte = null; DR_CL.avantMem = null; DR_CL.empreinteEcrite = null; dr_joueeOublier(H);
  /* 3. le hub : la copie d'avant, la trace oubliée, le pointeur s'il est encore le nôtre, l'image du mode test */
  const x = av ? { C, avant: av, cle } : null;
  if (x) { dr_annulRemettre(x); setTimeout(() => dr_annulRemettre(x), 2500); }
  else if (H) { dr_ecrire(H, null, 'Heure annulée — sa trace est oubliée', () => {}); if (C) dr_ecrire(C + '/scene', null, 'Heure annulée — le tableau distant revient à l’horloge', () => {}); }   /* la copie d'avant n'a pas pu être lue : seule la trace part */
  /* C16 (㊱, la conscience 23:40) : l'appel fait avant l'heure, versé dans l'heure au lancement, revient dans la case de cette heure — rien ne se perd */
  try { const av = DR_AP.avantVerse; DR_AP.avantVerse = null; if (av && av.chemin && av.val) dr_ecrire(av.chemin, av.val, 'L’appel d’avant l’heure, remis dans la case', () => {}); } catch (e) {}
  try { dr_coursActifEffacerSi(sig); } catch (e) {} try { SES.actif = false; } catch (e) {} try { if (typeof dr_ttHeureFin === 'function') dr_ttHeureFin(); } catch (e) {}
  try { if (typeof dr_versMur === 'function') dr_versMur(null, { sortie: true }); } catch (e) {}   /* la fenêtre du tableau, sur cet ordinateur, se vide */
  /* 4. l'emploi du temps, avec la phrase de l'annulation */
  try { const f = document.getElementById('ecran-fin'); if (f) f.classList.remove('on'); } catch (e) {}
  try { dr_tout(); } catch (e) {}
  try { if (typeof atClasseFermer === 'function') atClasseFermer(); else if (typeof edtOuvrir === 'function') edtOuvrir(); } catch (e) {}
  try { dr_closConfPoser({ classe: nom, h: '', chemin: null, heure: null, annulee: true }); } catch (e) {}
}
