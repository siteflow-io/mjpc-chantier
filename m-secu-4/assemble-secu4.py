#!/usr/bin/env python3
# ══ M-SÉCU-4 — index.html : changer le code professeur ══
import re
s=open("index.base.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    s=s.replace(a,n)

# ── 1. le dispatch ──
sub("""  if(id==='taxo')return _profSectionTaxo();""",
"""  if(id==='taxo')return _profSectionTaxo();
  if(id==='codeprof')return _profSectionCodeProf();   /* M-SÉCU-4 — accès par l'encart sécurité */""")

# ── 2. le bouton dans l'encart (branche clé-valide) ──
sub("""      +'<button class="mjpc-act secu-retrait" onclick="secuRetirerClair()">Retirer les codes en clair</button>'
      +'</div>';""",
"""      +'<button class="mjpc-act secu-retrait" onclick="secuRetirerClair()">Retirer les codes en clair</button>'
      +'<button class="mjpc-act" onclick="secuCodeProfOuvrir()">Code professeur</button>'
      +'</div>';""")

# ── 3. LA SECTION M-SÉCU-4, collée avant le constat M-SÉCU-3 ──
ANCRE="/* ── M-SÉCU-3 : plus de source claire pour les poser — CONSTAT seulement."
SECTION="""/* ═══════════════════════════════════════════════════════════════════════════
   M-SÉCU-4 — CHANGER LE CODE PROFESSEUR. L'écran qui rend la rotation possible.
   Derrière la clé (secuExigeCle). Trois gestes nommés : ajouter, retirer,
   remplacer. GARANTIE : jamais zéro fiche — le retrait de la dernière est
   refusé, et le remplacement écrit D'ABORD la nouvelle (relue, vérifiée)
   AVANT de retirer les anciennes. Archive en corbeille avant chaque geste,
   ABANDON si elle échoue. Aucun code n'est affiché, journalisé ni écrit en
   clair : seules les fiches illisibles voyagent.
   ═══════════════════════════════════════════════════════════════════════════ */
function secuCodeProfOuvrir(){if(!secuExigeCle())return;showProfSection('codeprof');}
function _profSectionCodeProf(){
  setTimeout(secuCpRafraichir,0);
  return '<h2>\\ud83d\\udd11 Code professeur</h2>'
    +'<div class="tprof-section-sub">Un code s\\u2019ajoute, se retire ou se remplace ici, avec la cl\\u00e9 de chiffrement. '
    +'Aucun code n\\u2019est jamais affich\\u00e9 ni enregistr\\u00e9 en clair : les donn\\u00e9es qui le v\\u00e9rifient sont illisibles sans lui. '
    +'<button class="secu-i" onclick="secuCpInfo()" aria-label="En savoir plus">\\u24d8</button></div>'
    +'<div id="cp-etat" class="cp-etat">Lecture de l\\u2019\\u00e9tat\\u2026</div>'
    +'<div class="cp-form">'
    +'<input type="password" id="cp-c1" class="cm-input" autocomplete="new-password" placeholder="Nouveau code">'
    +'<input type="password" id="cp-c2" class="cm-input" autocomplete="new-password" placeholder="Confirme le nouveau code">'
    +'<div class="cp-actions">'
    +'<button class="mjpc-act" onclick="secuCpAjouter()">Ajouter ce code</button>'
    +'<button class="mjpc-act cp-remplace" onclick="secuCpRemplacer()">Remplacer tout par ce code</button>'
    +'</div>'
    +'<div class="cp-note">Apr\\u00e8s ce changement, l\\u2019ancien code cesse de fonctionner partout, imm\\u00e9diatement : sur tous tes appareils et dans les dix applications.</div>'
    +'</div>'
    +'<div id="cp-msg" class="cp-msg" aria-live="polite"></div>'
    +'<div class="cp-retour"><button class="mjpc-act" onclick="showProfSection(\\'eleves\\')">\\u2190 Retour \\u00e0 \\u00c9l\\u00e8ves &amp; codes</button></div>';
}
function secuCpInfo(){
  _showConsoleModal('Code professeur',
    '<div class="cm-sub">Le code professeur ouvre l\\u2019espace professeur des dix applications. Il se v\\u00e9rifie par des donn\\u00e9es illisibles pos\\u00e9es ici \\u2014 jamais par le code lui-m\\u00eame, qui n\\u2019est \\u00e9crit nulle part.<br><br>'
    +'<b>Ajouter</b> : un nouveau code s\\u2019ajoute, les anciens continuent de fonctionner.<br>'
    +'<b>Retirer</b> : un code cesse de fonctionner. Le dernier ne peut pas \\u00eatre retir\\u00e9.<br>'
    +'<b>Remplacer tout</b> : le nouveau code devient le seul \\u2014 apr\\u00e8s v\\u00e9rification, jamais avant.<br><br>'
    +'Chaque geste archive l\\u2019\\u00e9tat pr\\u00e9c\\u00e9dent en corbeille.</div>',
    [{label:'Compris',cls:'primary'}]);
}
function _cpMsg(t,ok){var d=document.getElementById('cp-msg');if(d){d.innerHTML=t;d.className='cp-msg '+(ok?'cp-ok':'cp-ko');}}
function _cpDate(ts){if(!ts)return 'pos\\u00e9 avant ce jour';try{var d=new Date(ts);return 'pos\\u00e9 le '+d.toLocaleDateString('fr-FR');}catch(e){return 'pos\\u00e9 avant ce jour';}}
function _cpLireFiches(){return secuLire(SECU_CH_PROF).then(function(v){return Array.isArray(v)?v:[];});}
function secuCpRafraichir(){
  _cpLireFiches().then(function(fiches){
    var d=document.getElementById('cp-etat');if(!d)return;
    if(!fiches.length){d.innerHTML='<b>Aucun code actif.</b> Ajoute un code maintenant : sans lui, seule la cl\\u00e9 ouvre l\\u2019espace professeur.';return;}
    var h='<b>'+fiches.length+'</b> code'+(fiches.length>1?'s':'')+' actif'+(fiches.length>1?'s':'')+' :<ul class="cp-liste">';
    fiches.forEach(function(f,i){
      h+='<li>Code n\\u00b0 '+(i+1)+' \\u2014 '+_cpDate(f.ts)
        +' <button class="mjpc-act cp-mini" onclick="secuCpRetirer(\\''+String(f.sel)+'\\')">Retirer ce code</button></li>';
    });
    h+='</ul>';
    d.innerHTML=h;
  });
}
function _cpDouble(){
  var a=(document.getElementById('cp-c1')||{}).value||'';
  var b=(document.getElementById('cp-c2')||{}).value||'';
  if(!a){_cpMsg('Saisis le nouveau code (deux fois).',false);return null;}
  if(a!==b){_cpMsg('Les deux saisies ne concordent pas. Rien n\\u2019a \\u00e9t\\u00e9 modifi\\u00e9.',false);return null;}
  return a;
}
function _cpArchive(fiches){
  var ts=Date.now();
  return secuEcrire('/corbeille/code-prof-'+ts,{_meta:{chemin:SECU_CH_PROF,app:'site',ts:ts},data:fiches});
}
function _cpFiche(code){
  var sel=mjpcSelAleatoire();
  return mjpcEmpreinte(String(code),sel).then(function(emp){return {sel:sel,empreinte:emp,ts:Date.now()};});
}
/* relit le nœud et confirme qu'une fiche relue concorde avec le code saisi */
function _cpConcordance(code){
  return _cpLireFiches().then(function(fiches){
    if(!fiches.length)return {fiches:fiches,ok:false};
    return Promise.all(fiches.map(function(f){
      return mjpcEmpreinte(String(code),f.sel).then(function(h){return h===f.empreinte;},function(){return false;});
    })).then(function(rs){return {fiches:fiches,ok:rs.indexOf(true)>=0};});
  });
}
function secuCpAjouter(){
  if(!secuExigeCle())return;
  var code=_cpDouble();if(code===null)return;
  _cpMsg('V\\u00e9rification\\u2026',true);
  _cpLireFiches().then(function(fiches){
    _cpArchive(fiches).then(function(a){
      if(!a.ok){_cpMsg('L\\u2019archive en corbeille a \\u00e9chou\\u00e9 \\u2014 <b>rien n\\u2019a \\u00e9t\\u00e9 modifi\\u00e9</b>. R\\u00e9essaie quand la connexion est stable.',false);return;}
      _cpFiche(code).then(function(nf){
        secuEcrire(SECU_CH_PROF,fiches.concat([nf])).then(function(r){
          if(!r.ok){_cpMsg('L\\u2019\\u00e9criture a \\u00e9chou\\u00e9. Le changement n\\u2019est <b>pas</b> effectif \\u2014 rien d\\u2019ancien n\\u2019a \\u00e9t\\u00e9 retir\\u00e9.',false);return;}
          _cpConcordance(code).then(function(v){
            if(!v.ok){_cpMsg('Le changement n\\u2019est pas encore effectif : la v\\u00e9rification n\\u2019a pas abouti. Rien d\\u2019ancien n\\u2019a \\u00e9t\\u00e9 retir\\u00e9.',false);return;}
            _cpMsg('Fait le '+new Date().toLocaleDateString('fr-FR')+'. Le nouveau code ouvre l\\u2019espace professeur des dix applications ; les codes d\\u00e9j\\u00e0 en place continuent de fonctionner.',true);
            var c1=document.getElementById('cp-c1');if(c1)c1.value='';var c2=document.getElementById('cp-c2');if(c2)c2.value='';
            secuCpRafraichir();
          });
        });
      });
    });
  });
}
function secuCpRetirer(sel){
  if(!secuExigeCle())return;
  _cpLireFiches().then(function(fiches){
    if(fiches.length<=1){
      _cpMsg('Ce code est le dernier. Le retirer fermerait l\\u2019acc\\u00e8s professeur partout \\u2014 ajoute d\\u2019abord un nouveau code, retire ensuite l\\u2019ancien.',false);
      return;
    }
    var reste=fiches.filter(function(f){return String(f.sel)!==String(sel);});
    if(reste.length===fiches.length){_cpMsg('Ce code n\\u2019est plus dans la liste \\u2014 elle a peut-\\u00eatre chang\\u00e9 ailleurs. \\u00c9tat relu.',false);secuCpRafraichir();return;}
    _showConsoleModal('Retirer ce code',
      '<div class="cm-sub">Ce code cessera de fonctionner partout, imm\\u00e9diatement : sur tous tes appareils et dans les dix applications. L\\u2019\\u00e9tat pr\\u00e9c\\u00e9dent part en corbeille.</div>',
      [{label:'Annuler',cls:''},
       {label:'Retirer',cls:'primary',onclick:function(){
         _cpArchive(fiches).then(function(a){
           if(!a.ok){_cpMsg('L\\u2019archive en corbeille a \\u00e9chou\\u00e9 \\u2014 <b>rien n\\u2019a \\u00e9t\\u00e9 modifi\\u00e9</b>.',false);return;}
           secuEcrire(SECU_CH_PROF,reste).then(function(r){
             if(!r.ok){_cpMsg('Le retrait a \\u00e9chou\\u00e9. L\\u2019\\u00e9tat pr\\u00e9c\\u00e9dent est inchang\\u00e9.',false);return;}
             _cpLireFiches().then(function(rel){
               var parti=rel.every(function(f){return String(f.sel)!==String(sel);});
               _cpMsg(parti&&rel.length>=1?'Fait. Ce code ne fonctionne plus nulle part.':'La v\\u00e9rification n\\u2019a pas abouti \\u2014 \\u00e9tat relu.',parti&&rel.length>=1);
               secuCpRafraichir();
             });
           });
         });
       }}]);
  });
}
function secuCpRemplacer(){
  if(!secuExigeCle())return;
  var code=_cpDouble();if(code===null)return;
  _showConsoleModal('Remplacer tout par ce code',
    '<div class="cm-sub">Apr\\u00e8s ce changement, l\\u2019ancien code cesse de fonctionner partout, imm\\u00e9diatement : sur tous tes appareils et dans les dix applications.<br><br>'
    +'Le nouveau code est \\u00e9crit et v\\u00e9rifi\\u00e9 <b>avant</b> tout retrait \\u2014 en cas de probl\\u00e8me \\u00e0 mi-chemin, rien n\\u2019est perdu. L\\u2019\\u00e9tat pr\\u00e9c\\u00e9dent part en corbeille.</div>',
    [{label:'Annuler',cls:''},
     {label:'Remplacer',cls:'primary',onclick:function(){
       _cpMsg('\\u00c9criture du nouveau code\\u2026',true);
       _cpLireFiches().then(function(fiches){
         _cpArchive(fiches).then(function(a){
           if(!a.ok){_cpMsg('L\\u2019archive en corbeille a \\u00e9chou\\u00e9 \\u2014 <b>rien n\\u2019a \\u00e9t\\u00e9 modifi\\u00e9</b>. R\\u00e9essaie quand la connexion est stable.',false);return;}
           _cpFiche(code).then(function(nf){
             /* ÉTAPE A — écrire d'abord : anciennes + nouvelle */
             secuEcrire(SECU_CH_PROF,fiches.concat([nf])).then(function(r1){
               if(!r1.ok){_cpMsg('L\\u2019\\u00e9criture a \\u00e9chou\\u00e9. Le changement n\\u2019est <b>pas</b> effectif \\u2014 rien d\\u2019ancien n\\u2019a \\u00e9t\\u00e9 retir\\u00e9.',false);return;}
               _cpConcordance(code).then(function(v){
                 if(!v.ok){_cpMsg('Le changement n\\u2019est pas encore effectif : la v\\u00e9rification n\\u2019a pas abouti. Rien d\\u2019ancien n\\u2019a \\u00e9t\\u00e9 retir\\u00e9.',false);return;}
                 /* ÉTAPE B — retirer ensuite : la nouvelle seule */
                 secuEcrire(SECU_CH_PROF,[nf]).then(function(r2){
                   if(!r2.ok){_cpMsg('Le nouveau code fonctionne, mais l\\u2019ancien n\\u2019a pas pu \\u00eatre retir\\u00e9 \\u2014 r\\u00e9essaie \\u00ab Remplacer \\u00bb pour terminer.',false);secuCpRafraichir();return;}
                   _cpConcordance(code).then(function(v2){
                     var fini=v2.ok&&v2.fiches.length===1;
                     _cpMsg(fini
                       ?('Fait le '+new Date().toLocaleDateString('fr-FR')+'. Le nouveau code ouvre l\\u2019espace professeur des dix applications ; l\\u2019ancien ne fonctionne plus nulle part.')
                       :'Le nouveau code fonctionne, mais la v\\u00e9rification finale n\\u2019a pas abouti \\u2014 relance \\u00ab Remplacer \\u00bb pour terminer.',fini);
                     var c1=document.getElementById('cp-c1');if(c1)c1.value='';var c2=document.getElementById('cp-c2');if(c2)c2.value='';
                     secuCpRafraichir();
                   });
                 });
               });
             });
           });
         });
       });
     }}]);
}
"""
sub(ANCRE,SECTION+"\n"+ANCRE)

# ── 4. la double saisie de la PREMIÈRE clé (canari absent) ──
sub("""    /* valide, ou toute première clé (canari absent : elle fait foi et le pose) */
    SECU.cle=r.cle;SECU.valide=true;SECU.raison='';""",
"""    /* M-SÉCU-4 : la TOUTE PREMIÈRE clé exige une confirmation — une faute de
       frappe deviendrait la clé et ne se découvrirait qu'au prochain appareil. */
    if(r.raison==='canari-absent'){
      var conf=document.getElementById('secu-cle-confirm');
      if(!conf){
        var inp2=document.createElement('input');
        inp2.type='password';inp2.id='secu-cle-confirm';inp2.className='cm-input';
        inp2.placeholder='Confirme la cl\\u00e9';
        inp.parentNode.insertBefore(inp2,inp.nextSibling);
        if(msg)msg.textContent='Confirme la cl\\u00e9 : c\\u2019est elle qui verrouillera toutes les donn\\u00e9es. Une faute de frappe ici ne se d\\u00e9couvrirait qu\\u2019au prochain appareil.';
        return;
      }
      if(conf.value!==secret){
        if(msg)msg.textContent='Les deux saisies ne concordent pas. Rien n\\u2019a \\u00e9t\\u00e9 modifi\\u00e9.';
        return;
      }
    }
    SECU.cle=r.cle;SECU.valide=true;SECU.raison='';""")

# ── 5. le CSS de l'écran (au vrai head : ancre ^<body) ──
CSS="""<style>
/* ═══ M-SÉCU-4 — écran Code professeur ═══ */
.cp-etat{margin:12px 0;padding:12px 14px;border:1px solid rgba(255,255,255,.18);border-radius:10px;font-size:.95rem}
.cp-liste{margin:8px 0 0 0;padding-left:18px}
.cp-liste li{margin:6px 0}
.cp-form{display:flex;flex-direction:column;gap:10px;max-width:460px;margin:10px 0}
.cp-actions{display:flex;gap:10px;flex-wrap:wrap}
.cp-actions .mjpc-act{min-height:44px}
.cp-mini{min-height:36px;padding:4px 10px;font-size:.85rem;margin-left:8px}
.cp-note{font-size:.88rem;opacity:.85;line-height:1.45}
.cp-msg{margin:10px 0;font-size:.95rem;min-height:1.2em}
.cp-msg.cp-ok{color:#7fd18b}.cp-msg.cp-ko{color:#f0a2a2}
.cp-retour{margin-top:16px}
@media (max-width:480px){.cp-actions{flex-direction:column;align-items:stretch}.cp-form{max-width:none}}
/* ═══ fin M-SÉCU-4 ═══ */
</style>
"""
m=re.search(r'^<body[\\s>]',s,re.M)
s=s[:m.start()]+CSS+s[m.start():]

# ── 6. pastille ──
sub('var APP_VERSION="8.9.0"','var APP_VERSION="8.10.0"')

open("index.staging.html","w",encoding='utf-8').write(s)
print(f"index.staging.html écrit ({len(s)} car.)")
