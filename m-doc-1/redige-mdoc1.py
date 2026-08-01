#!/usr/bin/env python3
# ══ M-DOC-1 — le descriptif prof, à l'identique du canon worktrack ══
import re
def charge(n):return open(n+'.base.html',encoding='utf-8').read()
def ecrit(n,s):open(n+'.staging.html','w',encoding='utf-8').write(s)
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    return s.replace(a,n)

CSS = """<style>
/* ═══ § DESCRIPTIF PROF (M-DOC-1) — forme du canon worktrack, zéro JavaScript ═══ */
.doc-sec{margin-top:28px;padding-top:14px;border-top:1px solid rgba(0,0,0,.15)}
.doc-sec h4{margin:0 0 6px 0;font-size:1.05rem}
.doc-sec .d{font-size:.88rem;opacity:.8;line-height:1.5;margin-bottom:10px}
.doc-sec details{border:1px solid rgba(0,0,0,.15);border-radius:10px;margin:6px 0;background:rgba(255,255,255,.5)}
.doc-sec summary{cursor:pointer;padding:10px 12px;font-weight:600;min-height:44px;display:flex;align-items:center}
.doc-sec summary::marker{color:#7c5cff}
.doc-sec .db{padding:0 12px 12px;font-size:.92rem;line-height:1.6}
.doc-sec .why{font-style:italic;opacity:.85}
.doc-sec .ref{display:block;margin-top:8px;font-size:.84rem;opacity:.75}
.doc-sec .db b{font-weight:700}
.doc-sec .db ul{margin:6px 0 6px 18px}
@media (max-width:480px){.doc-sec .db{font-size:.9rem}.doc-sec summary{padding:12px 10px}}
@media print{
  .doc-sec details{break-inside:avoid;page-break-inside:avoid;border:1px solid #999;background:#fff}
  .doc-sec details>div.db{display:block !important}
  .doc-sec summary{font-weight:700}
  .doc-sec .why{color:#333}
}
/* ═══ fin § DESCRIPTIF PROF ═══ */
</style>
"""

def volet(titre,intention,corps):
    return ('<details><summary>'+titre+'</summary><div class="db">'
            +'<span class="why">Intention : '+intention+'</span><br>'+corps+'</div></details>')

def section(chapeau,volets):
    h='<div class="prof-sec doc-sec"><h4>\U0001F4D6 Comment l\u2019app fonctionne \u2014 p\u00e9dagogie et m\u00e9canique</h4>'
    h+='<div class="d">'+chapeau+'</div>'
    return h+''.join(volets)+'</div>'

CHAPEAU=("Chaque dispositif : l\u2019intention d\u2019abord, puis la m\u00e9canique exacte, au chiffre pr\u00e8s. "
         "Aucun terme technique sans d\u00e9finition (lexique en bas).")

# ═══════════ ① APPLAUSE_METER ═══════════
AM=section(CHAPEAU,[
 volet("Ce que la classe \u00e9value",
   "faire \u00e9couter vraiment \u2014 on ne juge pas l\u2019\u00e9l\u00e8ve, on juge une lecture, sur des points annonc\u00e9s d\u2019avance.",
   "Un passage est \u00e9valu\u00e9 sur <b>3 crit\u00e8res au minimum, 8 au maximum</b>. Par d\u00e9faut il y en a <b>quatre</b> : "
   "\u00ab On t\u2019entend bien \u00bb, \u00ab C\u2019est clair \u00bb, \u00ab Le rythme est agr\u00e9able \u00bb, \u00ab C\u2019est vivant \u00bb. "
   "Chaque crit\u00e8re porte trois choses : un emoji, un <b>libell\u00e9 pour le lecteur</b>, et la <b>question pos\u00e9e aux votants</b> "
   "(par exemple : \u00ab Est-ce qu\u2019on l\u2019entendait bien ? \u00bb). Les crit\u00e8res se modifient avant la s\u00e9ance ; les votants "
   "voient la question, pas le libell\u00e9."),
 volet("Les quatre r\u00e9ponses possibles",
   "une \u00e9chelle courte et sans note \u2014 l\u2019\u00e9l\u00e8ve dit ce qu\u2019il a per\u00e7u, il ne met pas un chiffre.",
   "Pour chaque crit\u00e8re, un votant choisit entre <b>quatre r\u00e9ponses</b> : "
   "\U0001F615 <b>Pas vraiment</b> \u00b7 \U0001F642 <b>Un peu</b> \u00b7 \U0001F60A <b>Plut\u00f4t</b> \u00b7 \U0001F929 <b>Tout \u00e0 fait</b>. "
   "Il n\u2019y a pas de r\u00e9ponse neutre : l\u2019\u00e9chelle a un nombre pair de paliers, donc chaque votant penche d\u2019un c\u00f4t\u00e9."),
 volet("L\u2019applaudim\u00e8tre pendant la lecture",
   "rendre l\u2019\u00e9coute active \u2014 la classe r\u00e9agit en direct, et l\u2019enthousiasme retombe s\u2019il n\u2019est pas nourri.",
   "Pendant le passage, chaque tap ajoute <b>6 points</b> \u00e0 la jauge, et la jauge <b>perd 35 % de sa valeur par seconde</b>. "
   "Un passage dure <b>60 secondes</b> par d\u00e9faut. "
   "<b>Cette dur\u00e9e est fig\u00e9e au lancement</b> : la modifier pendant qu\u2019un \u00e9l\u00e8ve lit n\u2019a aucun effet sur le passage en cours. "
   "La jauge s\u2019affiche au tableau sur <b>64 segments</b>."),
 volet("Comment le bilan du lecteur est calcul\u00e9",
   "un rep\u00e8re robuste, que deux votes extr\u00eames ne renversent pas.",
   "Pour chaque crit\u00e8re, le bilan retient <b>la m\u00e9diane des votes, et non leur moyenne</b> : on range les votes par ordre "
   "croissant et on prend celui du milieu. <b>Quand le nombre de votes est pair</b>, il n\u2019y a pas de milieu : "
   "l\u2019app prend alors <b>la moyenne des deux votes centraux, arrondie</b>. "
   "Cons\u00e9quence \u00e0 conna\u00eetre : un vote tr\u00e8s bas isol\u00e9 ne fait pas chuter le bilan \u2014 c\u2019est voulu, et c\u2019est ce qui distingue "
   "cette mesure d\u2019une moyenne."),
 volet("Les quatre niveaux de ma\u00eetrise",
   "parler la langue du bulletin, pour que l\u2019\u00e9l\u00e8ve et sa famille s\u2019y retrouvent.",
   "Le bilan se traduit en <b>quatre niveaux</b>, ceux du bulletin : <b>Ma\u00eetrise insuffisante</b>, <b>Ma\u00eetrise fragile</b>, "
   "<b>Ma\u00eetrise satisfaisante</b>, <b>Tr\u00e8s bonne ma\u00eetrise</b>, avec une couleur chacun. "
   "Les quatre r\u00e9ponses de vote et les quatre niveaux se correspondent rang pour rang."),
 volet("Les points de contr\u00f4le",
   "fixer un seuil avant d\u2019\u00e9couter, pour ne pas juger apr\u00e8s coup.",
   "Le mode \u00ab points de contr\u00f4le \u00bb est <b>d\u00e9sactiv\u00e9 par d\u00e9faut</b>. Activ\u00e9, il compare le r\u00e9sultat de chaque crit\u00e8re "
   "\u00e0 un <b>seuil exprim\u00e9 en pourcentage, r\u00e9glable crit\u00e8re par crit\u00e8re</b> \u2014 <b>70 % pour les quatre</b> \u00e0 l\u2019installation. "
   "Le tableau affiche alors un compteur de crit\u00e8res atteints."),
 volet("Le mode test",
   "\u00e9prouver l\u2019app sans toucher aux donn\u00e9es d\u2019une vraie classe.",
   "En mode test, les codes de test <b>priment sur les codes r\u00e9els</b> : l\u2019app ne consulte pas la liste des codes du site. "
   "Rien de ce qui est fait en mode test n\u2019atteint les donn\u00e9es des \u00e9l\u00e8ves."),
 volet("Lexique",
   "aucun mot technique ne doit rester sans d\u00e9finition.",
   "<ul><li><b>Passage</b> : la lecture \u00e0 voix haute d\u2019un \u00e9l\u00e8ve, minut\u00e9e.</li>"
   "<li><b>Crit\u00e8re</b> : un point pr\u00e9cis sur lequel la classe se prononce (la voix, le rythme\u2026).</li>"
   "<li><b>Votant</b> : un \u00e9l\u00e8ve qui \u00e9value le passage d\u2019un camarade.</li>"
   "<li><b>M\u00e9diane</b> : la valeur du milieu quand on range les votes par ordre croissant \u2014 \u00e0 ne pas confondre avec la moyenne.</li>"
   "<li><b>Jauge</b> : la barre affich\u00e9e au tableau, qui monte quand la classe tape et redescend toute seule.</li>"
   "<li><b>Seuil</b> : le pourcentage \u00e0 atteindre pour qu\u2019un crit\u00e8re soit consid\u00e9r\u00e9 comme r\u00e9ussi.</li>"
   "<li><b>Niveau de ma\u00eetrise</b> : la traduction du bilan dans les quatre niveaux du bulletin.</li></ul>")])

# ═══════════ ② ANALYSE_LOGIQUE ═══════════
AL=section(CHAPEAU,[
 volet("Les \u00e9tiquettes du r\u00e9f\u00e9rentiel",
   "nommer les propositions avec les m\u00eames mots toute l\u2019ann\u00e9e, pour que l\u2019\u00e9l\u00e8ve reconnaisse la structure et non le vocabulaire.",
   "Le r\u00e9f\u00e9rentiel fourni compte <b>treize \u00e9tiquettes</b> : PP (proposition principale), DPP et FPP (d\u00e9but et fin de principale), "
   "PI (ind\u00e9pendante), PSR (subordonn\u00e9e relative), PSCc et PSCci (subordonn\u00e9es conjonctives), VC et VCP (verbes), "
   "Ant (ant\u00e9c\u00e9dent), MS (mot subordonnant), PR (pronom relatif), CDS (compl\u00e9ment). "
   "Elles se r\u00e9partissent en <b>quatre couleurs</b>. Le r\u00e9f\u00e9rentiel est modifiable : c\u2019est une banque, pas une liste fig\u00e9e."),
 volet("Ce que l\u2019\u00e9l\u00e8ve fait \u00e0 l\u2019\u00e9cran",
   "manipuler la phrase plut\u00f4t que la commenter \u2014 la structure se voit quand on la d\u00e9place.",
   "L\u2019\u00e9l\u00e8ve <b>glisse un crochet ouvrant et un crochet fermant</b> pour d\u00e9limiter une proposition, "
   "<b>d\u00e9pose une \u00e9tiquette</b> sur la proposition ou le groupe qu\u2019elle d\u00e9signe, et <b>tire une fl\u00e8che</b> d\u2019un mot subordonnant "
   "vers son ant\u00e9c\u00e9dent. Rien ne se tape au clavier : tout se manipule."),
 volet("Ce qui est not\u00e9, et comment",
   "s\u00e9parer ce qui est vu de ce qui est nomm\u00e9 \u2014 un \u00e9l\u00e8ve peut d\u00e9limiter juste et nommer faux, et cela doit se voir.",
   "Chaque \u00e9l\u00e9ment est jug\u00e9 sur <b>quatre dimensions ind\u00e9pendantes</b> : la <b>marque</b> (l\u2019endroit exact des crochets), "
   "la <b>couleur</b>, la <b>nomination</b> (l\u2019\u00e9tiquette choisie) et le <b>lien</b> (la fl\u00e8che vers l\u2019ant\u00e9c\u00e9dent). "
   "Chaque dimension re\u00e7oit une valeur : <b>juste = 1 point, partiel = 0,5 point, absent = 0</b>. "
   "Le total possible ne compte que les dimensions dont le poids est sup\u00e9rieur \u00e0 z\u00e9ro \u2014 <b>une dimension non not\u00e9e ne p\u00e9nalise pas</b>."),
 volet("Le bar\u00e8me : qui d\u00e9cide, et dans quel ordre",
   "le professeur choisit ce qui compte, classe par classe, sans jamais r\u00e9\u00e9crire le r\u00e9f\u00e9rentiel.",
   "Le poids de chaque dimension se d\u00e9cide \u00e0 <b>trois \u00e9tages, et le dernier l\u2019emporte</b> : "
   "<b>1)</b> le d\u00e9faut du r\u00e9f\u00e9rentiel \u00b7 <b>2)</b> le d\u00e9faut de la classe \u00b7 <b>3)</b> le r\u00e9glage du travail en cours. "
   "<b>Un poids n\u2019est pas seulement \u00ab compte / ne compte pas \u00bb</b> : c\u2019est un nombre. \u00ab Oui \u00bb vaut 1, \u00ab non \u00bb vaut 0, "
   "et <b>toute valeur num\u00e9rique positive est accept\u00e9e</b> \u2014 une dimension peut donc peser 2 ou 0,5 si tu le d\u00e9cides."),
 volet("Les textes \u00e0 plusieurs phrases",
   "voir la structure se r\u00e9p\u00e9ter \u2014 une notion ne s\u2019acquiert pas sur une phrase.",
   "Un travail peut porter sur plusieurs phrases : l\u2019\u00e9l\u00e8ve navigue de l\u2019une \u00e0 l\u2019autre, et "
   "<b>la progression et le score sont cumul\u00e9s sur l\u2019ensemble du texte</b>, pas remis \u00e0 z\u00e9ro \u00e0 chaque phrase."),
 volet("Ce qui est conserv\u00e9, m\u00eame apr\u00e8s une purge",
   "ne jamais perdre un r\u00e9f\u00e9rentiel ni un corrig\u00e9 \u2014 ils repr\u00e9sentent des heures de travail.",
   "M\u00eame lors d\u2019un nettoyage de fin d\u2019ann\u00e9e, l\u2019app <b>pr\u00e9serve</b> : le r\u00e9f\u00e9rentiel d\u2019\u00e9tiquettes, les bar\u00e8mes par d\u00e9faut "
   "des classes, la liste des choses \u00e0 faire, la corbeille, et pour chaque travail sa <b>configuration</b>, son <b>bar\u00e8me</b> "
   "et son <b>corrig\u00e9</b>. Ce sont les travaux des \u00e9l\u00e8ves qui se purgent, jamais le mat\u00e9riel du professeur."),
 volet("Lexique",
   "aucun mot technique ne doit rester sans d\u00e9finition.",
   "<ul><li><b>Proposition</b> : un ensemble de mots organis\u00e9 autour d\u2019un verbe conjugu\u00e9.</li>"
   "<li><b>Subordonnant</b> : le mot qui rattache une proposition \u00e0 une autre (qui, que, parce que\u2026).</li>"
   "<li><b>Ant\u00e9c\u00e9dent</b> : le mot auquel renvoie un pronom relatif.</li>"
   "<li><b>\u00c9tiquette</b> : le nom que l\u2019\u00e9l\u00e8ve donne \u00e0 une proposition (PP, PSR\u2026).</li>"
   "<li><b>Marque</b> : l\u2019endroit exact o\u00f9 l\u2019\u00e9l\u00e8ve a plac\u00e9 les crochets.</li>"
   "<li><b>Nomination</b> : le fait d\u2019avoir choisi la bonne \u00e9tiquette.</li>"
   "<li><b>Bar\u00e8me</b> : le poids donn\u00e9 \u00e0 chaque dimension.</li>"
   "<li><b>R\u00e9f\u00e9rentiel</b> : la banque d\u2019\u00e9tiquettes disponibles.</li></ul>")])

# ═══════════ ③ EVALUATION-QCM ═══════════
QCM=section(CHAPEAU,[
 volet("Les quatre niveaux de question",
   "doser l\u2019effort \u2014 toutes les questions ne demandent pas le m\u00eame temps de r\u00e9flexion.",
   "Chaque question porte un niveau, et chaque niveau donne son temps : "
   "<b>Facile 5 secondes</b> \u00b7 <b>Standard 10 secondes</b> \u00b7 <b>Approfondi 15 secondes</b> \u00b7 <b>Expert 20 secondes</b>. "
   "Le niveau ne change pas le nombre de points : il change le temps accord\u00e9."),
 volet("Les deux fa\u00e7ons de compter les points",
   "choisir entre exiger la r\u00e9ponse exacte et reconna\u00eetre ce qui est su.",
   "<b>Mode strict (celui par d\u00e9faut)</b> : chaque question vaut <b>1 point, tout ou rien</b> \u2014 il faut cocher exactement "
   "les bonnes cases, ni plus ni moins.<br>"
   "<b>Mode partiel</b> : chaque question vaut <b>autant de points qu\u2019elle a de bonnes cases</b>. "
   "Chaque bonne case coch\u00e9e rapporte <b>1 point</b>, chaque mauvaise case en retire <b>1</b>. "
   "<b>Le r\u00e9sultat d\u2019une question ne descend jamais au-dessous de z\u00e9ro</b>, et ne d\u00e9passe jamais son maximum : "
   "un \u00e9l\u00e8ve qui coche une bonne case et trois mauvaises obtient <b>0</b>, pas \u2212 2."),
 volet("Ce que \u00ab partiellement juste \u00bb veut dire",
   "distinguer l\u2019erreur de l\u2019incompl\u00e9tude \u2014 ce n\u2019est pas la m\u00eame chose \u00e0 corriger.",
   "Une r\u00e9ponse est marqu\u00e9e <b>partielle</b> lorsqu\u2019elle n\u2019est pas exacte <b>mais rapporte tout de m\u00eame des points</b>. "
   "Une r\u00e9ponse \u00e0 z\u00e9ro point n\u2019est pas \u00ab partielle \u00bb : elle est fausse. La distinction n\u2019existe qu\u2019en mode partiel."),
 volet("Une \u00e9valuation qui a servi ne se modifie plus",
   "un instrument de mesure ne se change pas en cours de route \u2014 sinon les r\u00e9sultats pass\u00e9s ne veulent plus rien dire.",
   "Si tu modifies une \u00e9valuation <b>qui a d\u00e9j\u00e0 des r\u00e9sultats</b>, l\u2019app ne la remplace pas : elle en cr\u00e9e "
   "<b>une nouvelle version</b>. Les sessions pass\u00e9es gardent leur \u00e9nonc\u00e9 d\u2019origine, et leurs r\u00e9sultats ne se m\u00e9langent "
   "jamais avec ceux de la version suivante."),
 volet("Le mode test",
   "\u00e9prouver l\u2019app sans toucher aux donn\u00e9es d\u2019une vraie classe.",
   "En mode test, tout ce qui serait enregistr\u00e9 va dans un <b>magasin de test</b> : "
   "<b>rien n\u2019atteint les donn\u00e9es r\u00e9elles</b>, ni les \u00e9valuations, ni les r\u00e9sultats."),
 volet("Lexique",
   "aucun mot technique ne doit rester sans d\u00e9finition.",
   "<ul><li><b>Question</b> : un \u00e9nonc\u00e9 et ses cases \u00e0 cocher.</li>"
   "<li><b>Case</b> : une proposition de r\u00e9ponse ; une question peut en avoir plusieurs justes.</li>"
   "<li><b>Strict</b> : la question est juste ou fausse, sans demi-mesure.</li>"
   "<li><b>Partiel</b> : les bonnes cases rapportent, les mauvaises retirent, sans descendre sous z\u00e9ro.</li>"
   "<li><b>Niveau</b> : la difficult\u00e9 annonc\u00e9e d\u2019une question, qui fixe son temps.</li>"
   "<li><b>Chrono</b> : le temps accord\u00e9 pour r\u00e9pondre \u00e0 une question.</li>"
   "<li><b>Version</b> : l\u2019\u00e9tat fig\u00e9 d\u2019une \u00e9valuation qui a d\u00e9j\u00e0 servi.</li>"
   "<li><b>Session</b> : une passation de l\u2019\u00e9valuation avec une classe.</li></ul>")])

print("longueurs :", {'applause':len(AM),'analyse':len(AL),'qcm':len(QCM)})
open('_sections.py','w').write(repr({'applause_meter':AM,'analyse_logique':AL,'evaluation-qcm':QCM}))
open('_css.txt','w').write(CSS)
