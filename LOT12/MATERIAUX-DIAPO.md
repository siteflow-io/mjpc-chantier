# LOT ⑫ — MATÉRIAUX DIAPO (CONSERVATOIRE)
*Exécutant LOT ⑫, 20/08/2026. Base : `index.html` 8.56.2, 1 001 473 o, md5 `660956e0dc121c9d8e0a84c9ad98e690` (vérifié à la commande). Rien ne se perd, tout se retire.*

---

## §1 — LA LOI « LA FORME EST INTERDITE À L'IA »
*L'IA dit ce que c'est, le site décide comment ça se voit. À resservir aux prompts du déroulé.*

### 1a. La table `DIAPO_FORME_INTERDITE` (base L9096–9097)

```javascript
/* Les champs de FORME que l'IA n'a pas le droit d'employer — refusés en étant nommés. */
var DIAPO_FORME_INTERDITE=['style','couleur','color','police','font','taille','size','classe','class','align','alignement','css','html','background','fond','gras','italique'];
```

17 clés : `style, couleur, color, police, font, taille, size, classe, class, align, alignement, css, html, background, fond, gras, italique`.

### 1b. Le bloc de contrôle qui l'applique (base L9115–9118, à l'intérieur de `diapoValider`, boucle sur les blocs)

```javascript
      Object.keys(b).forEach(function(k){
        if(DIAPO_FORME_INTERDITE.indexOf(String(k).toLowerCase())>=0)
          V.cite(ref,'contient un r\u00e9glage de mise en forme (\u00ab '+k+' \u00bb) : la forme est d\u00e9cid\u00e9e par le site, retire-le.');
      });
```

Principe du mécanisme : un champ de forme est **refusé en étant nommé** — le message de validation cite la clé fautive et énonce la loi (« la forme est décidée par le site, retire-le »). Le refus est pédagogique, pas silencieux.

---

## §2 — PAGINATION DE L'ATELIER PAPIER : INTROUVABLE DANS LE PÉRIMÈTRE — POINT D'ARRÊT

Le mandat demande de localiser la pagination « dans les fonctions diapo\* ou adjacentes ». Constat après cartographie exhaustive :

- Le § DIAPORAMAS (base L9086–9457, plus `diapoStatutLiaison`/`diapoLierModal` L13113–13191) **ne contient aucune pagination** — aucun découpage en pages des feuilles n'y figure.
- La pagination du découpage en pages existe, mais dans le module **éditeur de chapitre (ed2\*)**, hors périmètre diapo : `ED2_A4` (L11978), `ed2HauteurDoc` (≈L12060), `ed2Pages` (L12076–12095, trois modes + règle de veuve LOT9-②), `ed2Repaginer` (L12047), machinerie de coupes `ED2_COUPES` (L12097+). Ce module est VIVANT (l'atelier papier de l'éditeur l'utilise) : il n'est ni à retirer ni à conserver ici — il reste en production.
- Existe aussi un CSS d'impression `.feuille`/`.r-demi` (≈L9974) : c'est le § GÉNÉRATEUR (feuilles/copies), pas les diapo\*.

**Conformément à la consigne : rien de douteux n'est copié au conservatoire. Ce point attend l'arbitrage de Paul / de la conscience** — soit le mandat visait `ed2Pages` (auquel cas une simple référence suffit : le code reste vivant en production, pas besoin de conservatoire), soit il visait autre chose que je n'ai pas identifié.

---

*Conservatoire constitué avant tout retrait. Aucune édition de la base à ce stade.*
