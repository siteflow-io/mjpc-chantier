
/* ═══════════════════════════════════════ CE QUI EST NOUVEAU (mandat E4) ═══════════════════════════════════════ */

/* ── (E4 · R2, R15) le rappel d'une fiche et ses citations — repris de l'ancien moteur (L1281, L1292-1311) ──
   Le rappel (b.rappel = {motif, libre}, posé dans l'Atelier par E1) : « on a repris la fiche X — pour réviser avant l'évaluation » ;
   les citations : ce que la classe a surligné (J : surligne / surligne-retire) et ce qu'elle a écrit (J : ecrire = « à recopier »). */
const DR_MOTIFS_RAPPEL = [{ c: 'reviser', l: 'pour réviser avant l\'évaluation' }, { c: 'acquis', l: 'parce que la notion n\'était pas encore acquise' }, { c: 'prerequis', l: 'parce qu\'on en a besoin pour la suite' }, { c: 'absents', l: 'pour ceux qui étaient absents' }];
function dr_recitRappel(b){ if (!b || !b.rappel) return null; const r = b.rappel; if (r.libre) return String(r.libre); const l = ((typeof MOTIFS_RAPPEL !== 'undefined' ? MOTIFS_RAPPEL : DR_MOTIFS_RAPPEL).find(m => m.c === r.motif) || {}).l; return l || ''; }
function dr_recitCitations(h, di, bi, e){
  const sur = []; J.filter(x => x.h === h && x.di === di && (x.type === 'surligne' || x.type === 'surligne-retire') && String(x.p || '').split('.')[0] === String(bi)).forEach(x => { if (x.type === 'surligne') { if (x.txt && !sur.some(s => s.p === x.p && s.txt === x.txt)) sur.push({ p: x.p, txt: String(x.txt).trim() }); } else { for (let i = sur.length - 1; i >= 0; i--) if (sur[i].p === x.p && (String(x.txt).includes(sur[i].txt) || sur[i].txt.includes(String(x.txt)))) sur.splice(i, 1); } });
  let els = []; try { els = elements(e); } catch (err) {}
  const cop = [...new Set(J.filter(x => x.h === h && x.di === di && x.type === 'ecrire').map(x => els[x.k]).filter(o => o && o.b === bi).map(o => String(o.txt).trim()))];
  return { sur: sur.map(s => s.txt).filter(Boolean), cop }; }

/* ── (E4 · dette 13 · 8) ce que la classe a vu : la diapo de la copie, avec ce qui a été corrigé en classe (S.copie[h][eid][bid] = {t, el},
   écrit par p8EcrireCopie) posé par identité de bloc — la même lecture que p8TextesCopie au rendu, pour l'heure h racontée ── */
function dr_recitBloc(b){ try { return typeof dr_blocLu === 'function' ? (dr_blocLu(b) || b) : b; } catch (e) { return b; } }
function dr_recitEcranVu(h, e){ if (!e) return e; const c = ((S.copie || {})[h] || {})[e.eid]; if (!c) return e; return Object.assign({}, e, { blocs: (e.blocs || []).map(b => { const cb = c[b.bid || b.id]; if (!cb) return b; const b2 = Object.assign({}, dr_recitBloc(b)); if (cb.t != null) b2.txt = cb.t; if (cb.el) { b2.el = (b2.el || []).slice(); Object.keys(cb.el).forEach(ei => { b2.el[+ei] = cb.el[ei]; }); } return b2; }) }); }

/* ── (E4 · mandat §2) LE RÉCIT AU HUB : C/recit/<h> ──
   Ce que la maquette garde en mémoire pour une heure h — « ma version » (S.recitVersion, S.recitMoi, S.recitMoiT, S.recitVersions),
   « le récit relu » (S.recitRelu, S.recitAChange : l'étape 4 de la fin de l'heure), la copie pour École Directe (S.copieED) —
   est écrit sous C/recit/<h> (débounce 900 ms, par dr_ecrire), relu au chargement : un récit corrigé ou relu survit au rechargement
   et à la clôture ; un récit non corrigé se recompose depuis J (comme la maquette). Rien en répétition, rien dans l'atelier. */
var DR_RECIT_ECRIT = {}, DR_RECIT_CHARGE = {}, DR_RECIT_EN_LECTURE = {};
function dr_recitChamps(){ return ['recitVersion', 'recitMoi', 'recitMoiT', 'recitVersions', 'recitRelu', 'recitAChange', 'copieED']; }
function dr_recitEtatDe(h){ const g = k => (S[k] || {})[h]; const v = g('recitVersions'); return { version: g('recitVersion') || 'site', texte: g('recitMoi') == null ? null : g('recitMoi'), moiT: g('recitMoiT') || null, versions: v ? v.l : [], k: v ? v.k : -1, relu: !!g('recitRelu'), aChange: !!g('recitAChange'), copieED: g('copieED') || null }; }
function dr_recitPoser(h, o){ if (!o || typeof o !== 'object') return; const pose = (k, val) => { if (val == null) return; S[k] = S[k] || {}; if (S[k][h] == null) S[k][h] = val; };
  pose('recitVersion', o.version && o.version !== 'site' ? o.version : null); pose('recitMoi', o.texte); pose('recitMoiT', o.moiT); if (o.versions && o.versions.length) pose('recitVersions', { l: o.versions, k: o.k != null && o.k >= 0 ? o.k : o.versions.length - 1 }); if (o.relu) pose('recitRelu', true); if (o.aChange) pose('recitAChange', true); if (o.copieED) pose('copieED', o.copieED); }
function dr_recitChemin(){ try { return typeof dr_cheminC === 'function' ? (dr_cheminC() || '') : ''; } catch (e) { return ''; } }
function dr_recitHeuresTouchees(){ const hs = new Set(); dr_recitChamps().forEach(k => Object.keys(S[k] || {}).forEach(h => hs.add(+h))); return [...hs].filter(h => h > 0); }
function dr_recitCharger(cb){ const C = dr_recitChemin(); if (!C || typeof dr_lire !== 'function') { if (cb) cb(); return; } if (DR_RECIT_EN_LECTURE[C]) { if (cb) setTimeout(cb, 300); return; } DR_RECIT_EN_LECTURE[C] = true;
  dr_lire(C + '/recit', v => { DR_RECIT_EN_LECTURE[C] = false; if (v && typeof v === 'object') Object.keys(v).forEach(h => { if (v[h] && +h > 0) dr_recitPoser(+h, v[h]); });
    dr_recitHeuresTouchees().forEach(h => { DR_RECIT_ECRIT[C + '|' + h] = JSON.stringify(dr_recitEtatDe(h)); }); DR_RECIT_CHARGE[C] = true; if (cb) cb(); }); }
function dr_recitAuto(){ try {
  if (typeof S === 'undefined' || S.repetition || S.atelier) return; const C = dr_recitChemin(); if (!C || typeof dr_ecrire !== 'function') return;
  if (!DR_RECIT_CHARGE[C]) { dr_recitCharger(); return; }   /* jamais une écriture avant d'avoir lu ce qui est au hub : on n'écrase pas un récit relu */
  dr_recitHeuresTouchees().forEach(h => { const o = dr_recitEtatDe(h); const sig = JSON.stringify(o); if (DR_RECIT_ECRIT[C + '|' + h] === sig) return; DR_RECIT_ECRIT[C + '|' + h] = sig; o.maj = Date.now(); dr_ecrire(C + '/recit/' + h, o, 'Le récit de l’heure ' + h, () => {}); });
} catch (e) {} }
setInterval(dr_recitAuto, 900);

/* ── (E4 · R13) LA COPIE POUR ÉCOLE DIRECTE EN HTML PROPRE — reprise de l'ancien copierED (moteur L1115-1141) ──
   « École Directe accepte le HTML collé : on lui donne une mise en forme simple et propre, sans nos classes ni nos repères. »
   text/html + text/plain ; le texte est celui que la maquette copiait. Repli : le texte seul, comme la maquette. */
function dr_recitHtmlPropre(html){ const out = document.createElement('div'); out.innerHTML = html;
  out.querySelectorAll('button, .rv, #r-copie-etat, .ed-suite-t').forEach(x => x.remove());
  Array.from(out.querySelectorAll('*')).forEach(x => { x.removeAttribute('class'); x.removeAttribute('contenteditable'); x.removeAttribute('id'); Array.from(x.attributes).filter(a => /^data-/.test(a.name)).forEach(a => x.removeAttribute(a.name)); });
  Array.from(out.querySelectorAll('span')).forEach(x => { if (!x.getAttribute('style')) x.replaceWith(document.createTextNode(x.textContent + ' ')); });
  return '<div style="font-family:Georgia,serif;font-size:14px;line-height:1.55">' + out.innerHTML + '</div>'; }
function dr_recitCopierED(html, texte, ok, dire){ dire = dire || (m => { const z = $('r-copie-etat'); if (z) z.textContent = m; }); const propre = dr_recitHtmlPropre(html); window.DR_RECIT_DERNIERE_COPIE = { html: propre, texte };
  const repli = () => { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texte).then(() => dire(ok + ' (texte simple)')).catch(() => dire('la copie automatique a échoué — sélectionne le texte et copie-le')); else dire('la copie automatique a échoué — sélectionne le texte et copie-le'); };
  try { if (navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== 'undefined') { navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([propre], { type: 'text/html' }), 'text/plain': new Blob([texte], { type: 'text/plain' }) })]).then(() => dire(ok)).catch(repli); return; } } catch (e) {} repli(); }
/* le contenu de séance : le récit affiché sans le travail à faire (ni ce qui le suit, comme la maquette le coupait) */
function dr_recitContenuED(rec){ const c = rec.cloneNode(true); const d = c.querySelector('.devoirs'); if (d) { let n = d.nextSibling; while (n) { const s = n.nextSibling; n.remove(); n = s; } d.remove(); } return c.innerHTML; }

/* ── (E4 · mandat §5) LES DOCUMENTS PAR RÉFÉRENCE (cadrage n°7) ──
   Les documents d'une séance sont les items de sce.items (ce que Structure connaît : ed2Documents) ; une seule copie, celle de Structure.
   L'URL suit la règle du site (openItem / openViewer) : Drive → /file/d/<id>/preview ; /view → /preview ; external, html → l'URL ;
   jamais une URL vide ou relative (elle rechargerait le site dans le cadre). Les autres genres (dictée, QCM…) s'ouvrent par le site. */
function dr_recitSnum(){ try { const c = typeof dr_ctx === 'function' ? dr_ctx() : null; if (c && c.snum != null) return c.snum; } catch (e) {} try { if (typeof ATVUES !== 'undefined' && ATVUES.snum != null) return ATVUES.snum; } catch (e) {} return typeof S !== 'undefined' ? S.si : 0; }
function dr_recitSeanceN(sk){ try { const c = typeof dr_ctx === 'function' ? dr_ctx() : null; const ch = typeof dr_chapitre === 'function' ? dr_chapitre() : null; if (ch && typeof atSeances === 'function') { const l = atSeances(ch); const i = l.findIndex(p => String(p.j) === String(sk)); if (i >= 0) return i + 1; } } catch (e) {} return (+sk || 0) + 1; }
function dr_recitUrlDe(it){ const ref = String(it.ref || '').trim(), src = it.source || ''; if (!ref) return '';
  if (src === 'drive' || (/^[A-Za-z0-9_-]{20,}$/.test(ref) && src !== 'firebase_app' && src !== 'atelier')) return 'https://drive.google.com/file/d/' + ref + '/preview';
  if (/^https?:\/\//i.test(ref) && (src === 'external' || src === 'html' || src === '' || src === 'drive')) return ref.indexOf('drive.google.com/file/d/') >= 0 ? ref.replace(/\/view(\?|$)/, '/preview$1') : ref;
  return ''; }
function dr_recitDocuments(){ const D = dr_recitSim(); if (D && D.documents) return D.documents[String(S.si)] || [];
  let se = null; const sk = dr_recitSnum(); try { se = typeof dr_seance === 'function' ? dr_seance(sk) : null; } catch (e) {} if (!se || !se.items) return [];
  const n = dr_recitSeanceN(sk); return Object.keys(se.items).map(k => ({ k, o: se.items[k] })).filter(x => x.o && typeof x.o === 'object').sort((a, b) => (a.o.ordre || 0) - (b.o.ordre || 0))
    .map(x => { const url = dr_recitUrlDe(x.o); return { id: x.k, titre: x.o.title || x.k, type: x.o.kind || 'doc', source: x.o.source || '', ref: x.o.ref || '', url, lie: !!x.o.ref, seance: sk, seanceN: n, reference: true, pages: 1, etapes: 1 }; }); }
function dr_recitAuTableau(){ try { return /[?&]vue=tableau/.test(location.search); } catch (e) { return false; } }
function dr_recitOuvrirItem(id){ const d = dr_recitDocuments().find(x => x.id === id); if (!d) return; try { if (d.url && typeof openViewer === 'function') { openViewer(d.titre, d.url); return; } if (typeof openItem === 'function' && typeof AT !== 'undefined' && AT.edChap) { openItem(AT.edChap.level, AT.edChap.chnum, d.seance, d.id); return; } } catch (e) {} }

/* ── (E4 · mandat §3) LA FACE PAPIER — composée depuis le récit relu (cadrage 2 §1.9 : le papier découle du récit) ──
   Deux parties, comme l'ancien papier (moteur L1387-1404) : « ce qu'on relit » (le récit tel qu'il part : ma version et sa suite,
   ou le composé ; le travail à faire), puis « ce qu'on colle » (chaque fiche montrée dans l'heure, avec ce que la classe y a surligné
   et recopié). L'entête et le pied du papier d'aujourd'hui. Imprimable : @media print n'imprime que la feuille (dr.css, bloc E4). */
function dr_papierRelire(h){ const pr = dr_recitProchaines(); const apres = pr.find(p => { const t = Date.parse(p.iso); return !isNaN(t) && t > dr_recitHeure(h).base; }) || pr[0]; if (apres && apres.l) return apres.l.split(',')[0];
  const d = new Date(dr_recitHeure(h).base); d.setDate(d.getDate() + 1); while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1); return dr_recitJourDe(d.getTime()).replace(/\s\d{4}$/, ''); }   /* l'ancien : le prochain jour ouvré (_drProchainCreneau) */
function dr_papierFiches(h){ const E = seance().ecrans; const vus = []; J.filter(x => x.h === h && x.type === 'diapo').forEach(x => { if (!vus.includes(x.di)) vus.push(x.di); }); const out = [];
  vus.forEach(di => { const e = dr_recitEcranVu(h, E[di]); if (!e) return; /* (13 · 8) la copie de la classe */ (e.blocs || []).forEach((b, bi) => { if (b.t !== 'fiche') return; const cit = dr_recitCitations(h, di, bi, e); const rap = dr_recitRappel(b); const lignes = (b.el || []).map(x => typeof x === 'string' ? x : (x && x.txt) || ''); let corps = lignes.map(l => { let t = esc(l); cit.sur.forEach(s => { const s2 = esc(s); if (s2 && t.includes(s2)) t = t.replace(s2, '<mark>' + s2 + '</mark>'); }); return '<p class="f-bloc">' + t + '</p>'; }).join('');
    out.push('<div class="a4"><div class="f-page"><div class="f-entete"><div class="f-titre">' + esc(b.txt || b.titre || 'Fiche') + '</div>' + (rap ? '<div class="f-soustitre">Rappel — ' + esc(rap) + '</div>' : '') + '</div>' + (corps || '<p class="f-bloc"><i>(fiche sans texte)</i></p>') + (cit.cop.length ? '<div class="f-encadre"><div class="f-enc-t">Recopié dans le cahier</div>' + cit.cop.map(c => '<p class="f-bloc">' + esc(c) + '</p>').join('') + '</div>' : '') + '</div><div class="a4-coller">à coller dans le cahier</div></div>'); }); });
  return out.join(''); }
function papierHtml(h){ const fin = (S.closes && S.closes[h]) || now(); const d = document.createElement('div'); d.innerHTML = recitHtml(fin, h); const rec = d.querySelector('.recit'); let corps = '';
  if (rec) { const r = rec.cloneNode(true); r.querySelectorAll('h2, p.sous, .ed-suite-t, button, .rv').forEach(x => x.remove()); corps = r.innerHTML;
    if (rec.classList.contains('ma-version')) { const d2 = document.createElement('div'); d2.innerHTML = troisTemps(recitHtml0(fin, h), h, fin); const dv = d2.querySelector('.recit .devoirs'); if (dv) corps += dv.outerHTML; } }
  const sce = seance(); const fiches = dr_papierFiches(h);
  return `<div class="dr-papier-barre"><button class="btn" id="r-imprimer" title="Imprime le papier du cahier : la page du récit de l'heure ${h}, puis les fiches à coller. Seule la feuille sort à l'impression, rien d'autre de l'écran.">🖨 Imprimer le papier</button><span style="color:var(--texte2);font-size:.9rem">Le papier découle du récit : ce que tu corriges dans « Le récit » (ma version) est ce qui s'imprime.</span></div>`
    + `<div class="dr-papier"><div class="a4"><div class="f-page"><div class="f-entete"><div class="f-metas"><span><span class="f-meta-l">Classe</span>${esc(dr_recitClasseNom())}</span><span><span class="f-meta-l">Chapitre</span>${esc(dr_recitChapitre())}</span><span><span class="f-meta-l">Séance</span>${esc(sce.titre || sce.title || '')}</span></div><div class="f-titre">Ce qu'on a fait aujourd'hui</div><div class="f-soustitre">À relire — ${esc(dr_papierRelire(h))}</div></div><div class="f-corps-recit">${corps || '<p><i>(rien n\'a encore été montré à la classe dans cette heure)</i></p>'}</div><div class="f-pied"><span>MJPC · monsieurjaipascompris</span><span>À relire.</span></div></div></div>${fiches}</div>`; }
function brancherPapier(){ const pap = $('rel') && $('rel').querySelector('.dr-papier'); let imp = document.getElementById('dr-impression'); if (pap) { if (!imp) { imp = document.createElement('div'); imp.id = 'dr-impression'; document.body.appendChild(imp); } imp.innerHTML = pap.outerHTML; }
  const b = $('r-imprimer'); if (b) b.onclick = () => { journal('papier-imprime', { h: S.faceH }); window.print(); }; }
function dr_papierRetirer(){ const i = document.getElementById('dr-impression'); if (i) i.remove(); }
function dr_recitSeanceTitre(){ try { const se = seance(); return (se && (se.titre || se.title)) || ''; } catch (e) { return ''; } }
/* le cadre du document dans l'écran (au pilote et au tableau, le même) : le titre, sa provenance (« vient de Structure · Séance N »),
   l'aperçu Drive / la page, ou la raison en clair quand il n'est pas encore lié */
function dr_docHtmlRef(doc){ const prov = `<span class="dr-doc-prov">— cette fiche vient de Structure · Séance ${esc(String(doc.seanceN))}</span>`;
  const grand = !dr_recitAuTableau() && doc.url ? `<button class="btn dr-doc-grand" data-doc-grand="${esc(doc.id)}" title="Ouvre le document en grand sur ton écran (pas au tableau) — la classe garde ce qu'elle voit">⤢ en grand</button>` : '';
  const corps = doc.url ? `<iframe class="dr-doc-cadre" src="${esc(doc.url)}" title="${esc(doc.titre)}" allow="autoplay" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    : `<div class="pg dr-doc-vide">${doc.lie ? 'Ce document s’ouvre par le site (' + esc(doc.type) + ') : il ne se projette pas dans l’écran.' : 'Ce document n’est pas encore lié dans Structure : lie-le dans Structure (🔗), il apparaîtra ici.'}</div>`;
  setTimeout(() => document.querySelectorAll('[data-doc-grand]').forEach(b => { if (b._ok) return; b._ok = true; b.onclick = ev => { ev.stopPropagation(); dr_recitOuvrirItem(b.dataset.docGrand); }; }), 0);
  return `<div class="doc dr-doc-ref" data-doc-id="${esc(doc.id)}"><h3>${esc(doc.titre)} ${prov} ${grand}</h3>${corps}</div>`; }
function dr_docsPanneau(l){ $('fdocs-l').innerHTML = l.map(d => `<div class="c" style="padding:6px 0;border-top:1px solid var(--bord)"><b>${esc(d.titre)}</b> <span style="color:var(--sourd)">Structure · Séance ${esc(String(d.seanceN))}${d.url ? '' : d.lie ? ' · s’ouvre par le site' : ' · pas encore lié'}</span><div>${d.url ? `<button class="btn" data-doc="${esc(d.id)}" style="margin-top:4px;padding:2px 8px" title="${S.doc && S.doc.id === d.id ? 'Ferme le document : la classe revient à la diapo' : 'Montre ce document au tableau, dans l’écran — la classe le voit tel que Structure le garde'}">${S.doc && S.doc.id === d.id ? '✕ Fermer (retour à la diapo)' : 'Projeter au tableau'}</button>` : d.lie ? `<button class="btn" data-doc-site="${esc(d.id)}" style="margin-top:4px;padding:2px 8px" title="Ouvre ce document comme le site l’ouvre (sur ton écran)">Ouvrir</button>` : `<button class="btn" disabled style="margin-top:4px;padding:2px 8px" title="Ce document n’est pas encore lié dans Structure : rien à projeter">Projeter au tableau</button>`}</div></div>`).join('') || '<div style="color:var(--sourd)">aucun document dans cette séance (Structure)</div>';
  $('fdocs-l').querySelectorAll('[data-doc]').forEach(b => b.onclick = () => { if (S.doc && S.doc.id === b.dataset.doc) { S.doc = null; journal('document-ferme', { id: b.dataset.doc }); } else { S.doc = { id: b.dataset.doc, pos: 1 }; } tout(); ouvrirDocs(); });
  $('fdocs-l').querySelectorAll('[data-doc-site]').forEach(b => b.onclick = () => dr_recitOuvrirItem(b.dataset.docSite)); }
