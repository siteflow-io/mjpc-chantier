// =============================================================================
// monsieurjaipascompris — Dépôt de fichiers sur Drive  (depot-1.0.0)
// Source : Conscience n°5, t722 (10/08/2026) — DÉPLOYÉ par Paul, autorisation
// « Tout le monde » réglée en t747. URL de déploiement :
// https://script.google.com/macros/s/AKfycbx6GptLK1g5_p9BDEF1Fp8vbUFJZ_4h03WR3CSpz6_ogwncxAFHN77tB-YzKDtSCOc8oA/exec
// =============================================================================
var DOSSIER_RACINE = '1j58D2GVuJeGbWMD7IwOUB9Zdb81G1q-r';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    switch (d.action) {
      case 'deposer':   return rep_(deposer_(d));
      case 'supprimer': return rep_(supprimer_(d));
      case 'ping':      return rep_({ status: 'ok', version: 'depot-1.0.0' });
      default:          return rep_({ error: 'Action inconnue : ' + d.action });
    }
  } catch (err) { return rep_({ error: err.message }); }
}
function doGet() {
  return rep_({ status: 'ok', message: 'monsieurjaipascompris — dépôt de fichiers' });
}
function deposer_(d) {
  if (!d.fichier)  return { error: 'Fichier manquant' };
  if (!DOSSIER_RACINE) return { error: 'Dossier racine non configuré' };
  var nom = d.nom || ('depot-' + Date.now());
  try {
    var blob = Utilities.newBlob(Utilities.base64Decode(d.fichier), d.type || 'application/octet-stream', nom);
    var dossier = DriveApp.getFolderById(DOSSIER_RACINE);
    (d.chemin || []).forEach(function (part) {
      part = nettoyer_(part);
      if (part) dossier = ouvrirOuCreer_(dossier, part);
    });
    var f = dossier.createFile(blob);
    f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var id  = f.getId();
    var ext = (nom.split('.').pop() || '').toLowerCase();
    return { status: 'ok', id: id, url: f.getUrl(), affichage: affichage_(id, ext),
      nom: nom, ext: ext, dossier: dossier.getName(), dossier_url: dossier.getUrl() };
  } catch (err) { return { error: 'Dépôt échoué : ' + err.message }; }
}
function supprimer_(d) {
  if (!d.id) return { error: 'Identifiant manquant' };
  try { DriveApp.getFileById(d.id).setTrashed(true); return { status: 'ok', id: d.id }; }
  catch (err) { return { error: 'Suppression échouée : ' + err.message }; }
}
function affichage_(id, ext) {
  if (ext === 'pdf')                   return 'https://drive.google.com/file/d/' + id + '/preview';
  if (ext === 'html' || ext === 'htm') return 'https://drive.google.com/file/d/' + id + '/preview';
  if (['pptx','ppt','docx','doc','xlsx','xls'].indexOf(ext) >= 0)
    return 'https://docs.google.com/gview?url=' + encodeURIComponent('https://drive.google.com/uc?id=' + id) + '&embedded=true';
  if (['jpg','jpeg','png','gif','webp','avif'].indexOf(ext) >= 0)
    return 'https://drive.google.com/uc?id=' + id;
  return 'https://drive.google.com/file/d/' + id + '/view';
}
function nettoyer_(s) { return String(s || '').replace(/[\/\\]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 100); }
function ouvrirOuCreer_(parent, nom) { var it = parent.getFoldersByName(nom); return it.hasNext() ? it.next() : parent.createFolder(nom); }
function rep_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
