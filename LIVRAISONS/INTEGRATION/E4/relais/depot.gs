/**
 * MJPC — LE RELAIS « DÉPOSER EN LIGNE » (contrat §12.49 ; E4, 28/10).
 *
 * À coller UNE fois dans le programme Google de Paul, comme un nouveau fichier (Fichier → +, « depot.gs »).
 * Puis : Déployer → Nouveau déploiement → Application Web — « Exécuter en tant que : moi »,
 *        « Qui a accès : moi uniquement ». L'adresse /exec de CE déploiement va dans le site (MJPC_RELAIS_URL).
 *        Le déploiement des élèves (login, open, close) ne change pas.
 * La clé GitHub : Paramètres du projet → Propriétés du script → GITHUB_CLE = <la clé, droits « contents: write »
 *        sur siteflow-io/mjpc-medias et siteflow-io/mjpc-medias-2>. Jamais dans le navigateur, jamais dans un fichier.
 *
 * ATTENTION : ce fichier définit doGet(). Si le programme a DÉJÀ une fonction doGet, renomme-la
 * (par exemple doGetAncien) et décommente l'appel en bas de relaisDoGet_ — sinon Google n'en garde qu'une.
 *
 * Qui peut déposer : seulement la connexion Google du propriétaire du programme (Paul). Le déploiement
 * « moi uniquement » le garantit déjà ; deposer() le revérifie (Session.getActiveUser() === propriétaire),
 * donc même appelé depuis le déploiement des élèves, il refuse.
 */

var RELAIS = {
  proprio: 'siteflow-io',
  depots: [ { repo: 'mjpc-medias', prefixe: '' }, { repo: 'mjpc-medias-2', prefixe: 'm2:' } ],
  branche: 'main',
  plafond: 900 * 1024 * 1024,          // au-delà, le dépôt suivant
  maxFichier: 25 * 1024 * 1024,
  niveaux: ['6e', '5e', '4e', '3e', 'divers'],
  origine: 'https://siteflow-io.github.io'
};

function doGet(e) { return relaisDoGet_(e); }

function relaisDoGet_(e) {
  // Si le programme avait déjà un doGet (renommé doGetAncien, voir l'en-tête) : if (e && e.parameter && e.parameter.relais !== 'depot') return doGetAncien(e);
  // et l'adresse du site devient …/exec?relais=depot.
  var html = '<!doctype html><meta charset="utf-8"><title>MJPC — dépôt en ligne</title>'
    + '<body style="font:15px Georgia,serif;background:#17130f;color:#eadfcb;padding:22px">'
    + '<div id="m">Dépôt en ligne : connexion…</div><script>'
    + 'var O=' + JSON.stringify(RELAIS.origine) + ',m=document.getElementById("m"),op=(window.top&&window.top.opener)||window.opener;'
    + 'function dire(t){m.textContent=t;}'
    + 'if(!op){dire("Cette fenêtre s\'ouvre depuis le site (« Déposer en ligne »).");}'
    + 'else{window.addEventListener("message",function(ev){if(ev.origin!==O||!ev.data||ev.data.mjpcRelais!=="paquet")return;dire("Dépôt en cours…");'
    + 'google.script.run.withSuccessHandler(function(r){op.postMessage(r&&r.ok?{mjpcRelais:"fait",depots:r.depots}:{mjpcRelais:"refus",raison:(r&&r.raison)||"Refusé."},O);dire(r&&r.ok?"Déposé.":"Refusé : "+((r&&r.raison)||""));})'
    + '.withFailureHandler(function(er){op.postMessage({mjpcRelais:"refus",raison:"Le dépôt n\'a pas abouti — recommence."},O);dire("Échec.");}).deposer(ev.data.paquet);});'
    + 'op.postMessage({mjpcRelais:"pret"},O);dire("Prêt.");}'
    + '</script></body>';
  return HtmlService.createHtmlOutput(html).setTitle('MJPC — dépôt en ligne').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/** Appelée par la fenêtre, avec la connexion Google de celui qui l'a ouverte. */
function deposer(paquet) {
  try {
    var qui = Session.getActiveUser().getEmail(), moi = Session.getEffectiveUser().getEmail();
    if (!qui || qui !== moi) return { ok: false, raison: 'Ce dépôt est réservé au compte Google de Paul : choisis-le quand Google le demande.' };
    var cle = PropertiesService.getScriptProperties().getProperty('GITHUB_CLE');
    if (!cle) return { ok: false, raison: 'Le dépôt n\'est pas encore réglé (la clé n\'est pas rangée dans le programme Google).' };
    if (!paquet || paquet.action !== 'deposer' || !paquet.fichiers || !paquet.fichiers.length) return { ok: false, raison: 'Aucun fichier reçu.' };
    if (paquet.fichiers.length > 20) return { ok: false, raison: 'Vingt fichiers au plus à la fois.' };
    var niveau = RELAIS.niveaux.indexOf(String(paquet.niveau)) >= 0 ? String(paquet.niveau) : 'divers';
    var fichiers = [], total = 0;
    for (var i = 0; i < paquet.fichiers.length; i++) {
      var f = paquet.fichiers[i], octets = Utilities.base64Decode(String(f.b64 || ''));
      var type = typeDe_(octets), nom = String(f.nom || 'fichier');
      if (!type) return { ok: false, raison: '« ' + nom + ' » n\'est ni une image (JPG, PNG, WebP, GIF) ni un PDF : refusé.' };
      if (octets.length > RELAIS.maxFichier) return { ok: false, raison: '« ' + nom + ' » dépasse 25 Mo : refusé.' };
      fichiers.push({ nom: nom, type: type, b64: Utilities.base64Encode(octets), taille: octets.length }); total += octets.length;
    }
    var dep = depotCourant_(cle, total);
    var dossier = 'depots/' + niveau + '/';
    var pris = nomsPris_(cle, dep.repo, dossier);
    var jour = Utilities.formatDate(new Date(), 'Europe/Paris', 'yyyy-MM-dd');
    fichiers.forEach(function (f) {
      var base = jour + '-' + nettoyer_(f.nom), n = base + '.' + f.type, k = 2;
      while (pris[n]) { n = base + '-' + k + '.' + f.type; k++; }
      pris[n] = true; f.chemin = dossier + n;
    });
    ecrireUnCommit_(cle, dep.repo, fichiers, 'MJPC : dépôt en ligne (' + fichiers.length + ' fichier' + (fichiers.length > 1 ? 's' : '') + ', ' + niveau + ')');
    var p = PropertiesService.getScriptProperties(); p.setProperty('TAILLE_' + dep.repo, String(dep.taille + total));
    return { ok: true, depots: fichiers.map(function (f) { return { chemin: dep.prefixe + f.chemin, nom: f.nom, taille: f.taille }; }) };
  } catch (e) {
    console.error(e);
    return { ok: false, raison: 'Le dépôt n\'a pas abouti — recommence ; si ça continue, dis-le à la conscience.' };
  }
}

function typeDe_(o) {
  var b = function (i) { return (o[i] + 256) % 256; }, s = function (i, n) { var t = ''; for (var k = i; k < i + n; k++) t += String.fromCharCode(b(k)); return t; };
  if (o.length >= 3 && b(0) === 0xFF && b(1) === 0xD8 && b(2) === 0xFF) return 'jpg';
  if (o.length >= 8 && b(0) === 0x89 && s(1, 3) === 'PNG') return 'png';
  if (o.length >= 6 && (s(0, 6) === 'GIF87a' || s(0, 6) === 'GIF89a')) return 'gif';
  if (o.length >= 12 && s(0, 4) === 'RIFF' && s(8, 4) === 'WEBP') return 'webp';
  if (o.length >= 5 && s(0, 5) === '%PDF-') return 'pdf';
  return null;
}
function nettoyer_(nom) {
  return String(nom).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'fichier';
}
/** Le dépôt où écrire : le premier sous 900 Mo (le compte est tenu dans les propriétés, recalé sur GitHub s'il manque). */
function depotCourant_(cle, ajout) {
  var p = PropertiesService.getScriptProperties();
  for (var i = 0; i < RELAIS.depots.length; i++) {
    var d = RELAIS.depots[i], t = Number(p.getProperty('TAILLE_' + d.repo));
    if (!(t >= 0)) { var info = gh_(cle, 'GET', '/repos/' + RELAIS.proprio + '/' + d.repo); t = (info.size || 0) * 1024; p.setProperty('TAILLE_' + d.repo, String(t)); }
    if (t + ajout < RELAIS.plafond || i === RELAIS.depots.length - 1) return { repo: d.repo, prefixe: d.prefixe, taille: t };
  }
}
function nomsPris_(cle, repo, dossier) {
  var r = gh_(cle, 'GET', '/repos/' + RELAIS.proprio + '/' + repo + '/contents/' + dossier.replace(/\/$/, '') + '?ref=' + RELAIS.branche, true), pris = {};
  (Array.isArray(r) ? r : []).forEach(function (x) { pris[x.name] = true; });
  return pris;
}
/** Plusieurs fichiers d'affilée : UN seul commit (un arbre, un commit) — jamais d'écrasement (les noms sont neufs). */
function ecrireUnCommit_(cle, repo, fichiers, message) {
  var R = '/repos/' + RELAIS.proprio + '/' + repo;
  var ref = gh_(cle, 'GET', R + '/git/ref/heads/' + RELAIS.branche);
  var parent = gh_(cle, 'GET', R + '/git/commits/' + ref.object.sha);
  var arbre = fichiers.map(function (f) {
    var blob = gh_(cle, 'POST', R + '/git/blobs', false, { content: f.b64, encoding: 'base64' });
    return { path: f.chemin, mode: '100644', type: 'blob', sha: blob.sha };
  });
  var tree = gh_(cle, 'POST', R + '/git/trees', false, { base_tree: parent.tree.sha, tree: arbre });
  var commit = gh_(cle, 'POST', R + '/git/commits', false, { message: message, tree: tree.sha, parents: [parent.sha] });
  gh_(cle, 'PATCH', R + '/git/refs/heads/' + RELAIS.branche, false, { sha: commit.sha });
}
function gh_(cle, methode, chemin, absentOk, corps) {
  var o = { method: methode.toLowerCase(), muteHttpExceptions: true, headers: { Authorization: 'Bearer ' + cle, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } };
  if (corps) { o.contentType = 'application/json'; o.payload = JSON.stringify(corps); }
  var r = UrlFetchApp.fetch('https://api.github.com' + chemin, o), c = r.getResponseCode();
  if (c === 404 && absentOk) return null;
  if (c >= 300) throw new Error('GitHub ' + c + ' sur ' + methode + ' ' + chemin + ' : ' + r.getContentText().slice(0, 300));
  return JSON.parse(r.getContentText() || 'null');
}
