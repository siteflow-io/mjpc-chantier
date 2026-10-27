# Génère sujets/lettre-grande-guerre.json (R10 bis) — conscience n°13, 27/10/2026.
# Orthographe : les sous-niveaux et les quatre niveaux de la grille Dugain, repris mot pour mot (déjà donnés par Paul).
import json, subprocess, sys

S = sys.argv[1]  # dossier où se trouve grille.js (extrait de redaction_dugain_v3.html)
dug = json.loads(subprocess.check_output(["node", "-e",
    "const g=require('" + S + "/grille.js');process.stdout.write(JSON.stringify({G:g.GRILLE,S:g.SOUS_IMAGINATION}))"]))

def ind(id_, libelle, poids, competence, descripteurs, sous):
    assert len(descripteurs) == 4 and len(sous) == 4
    out = []
    for e in sous:
        assert len(e) == 4, (id_, e)
        rang = []
        for sans, avec in e:
            assert "{CIT}" in avec and "{CIT}" not in sans, (id_, sans)
            rang.append({"sans": sans, "avec": avec})
        out.append(rang)
    for d in descripteurs:
        assert d.startswith("{prenom}, "), (id_, d)
    return {"id": id_, "libelle": libelle, "poids": poids, "competence": competence,
            "descripteurs": descripteurs, "sous": out}

# ───────────────────────── 1 · Le thème et l'invention (14)
theme = ind("theme_tenu", "Le thème tenu : la Grande Guerre, la lettre, le personnage", 6, "c4-ecrire-01", [
  "{prenom}, tu ne tiens pas le thème. On ne reconnaît ni la Grande Guerre, ni une lettre écrite du front ou de la maison, ni la personne qui écrit : ton texte pourrait se passer n'importe où, n'importe quand.",
  "{prenom}, tu poses le thème mais il reste flou. La guerre est là sans être vraiment celle de 14-18, ou la personne qui écrit n'a ni nom, ni métier, ni histoire : on ne sait pas bien qui parle, d'où, ni depuis quand il est séparé de l'autre.",
  "{prenom}, tu tiens le thème du début à la fin. On sait qui écrit, d'où — la tranchée ou la maison —, à qui et depuis combien de temps ; la guerre est bien celle de 14-18.",
  "{prenom}, tu tiens le thème avec une vraie justesse. Ton personnage existe : son âge, son métier d'avant, sa place dans la guerre se sentent dans chaque ligne, et l'époque est rendue sans une fausse note. On croit lire une vraie lettre de 14-18.",
], [
  [ # Insuffisant
    ("Ton texte n'est pas une lettre de la Grande Guerre : il raconte autre chose, une autre guerre ou une autre époque. Le sujet n'est pas traité.",
     "Ton texte n'est pas une lettre de la Grande Guerre, comme on le voit quand tu écris {CIT} : il raconte autre chose, une autre guerre ou une autre époque. Le sujet n'est pas traité."),
    ("Tu parles de la guerre, mais pas sous la forme d'une lettre : c'est un récit, ou un texte qui ne s'adresse à personne.",
     "Tu parles de la guerre, mais pas sous la forme d'une lettre, comme quand tu écris {CIT} : ton texte ne s'adresse à personne."),
    ("Tu écris bien une lettre de guerre, mais des objets et des façons de vivre d'aujourd'hui s'y glissent sans cesse : la Grande Guerre disparaît.",
     "Tu écris bien une lettre de guerre, mais des objets et des façons de vivre d'aujourd'hui s'y glissent, comme quand tu écris {CIT} : la Grande Guerre disparaît."),
    ("Tu écris une lettre de 14-18, mais on ne sait jamais qui l'écrit : ni le front ni la maison ne sont reconnaissables, et la personne qui parle n'a aucune identité.",
     "Tu écris une lettre de 14-18, mais on ne sait jamais qui l'écrit, comme quand tu écris {CIT} : ni le front ni la maison ne sont reconnaissables."),
  ],
  [ # Fragile
    ("On devine la Grande Guerre, mais elle reste générale : des combats, des soldats, sans rien qui la rattache à 14-18, à la tranchée ou à la maison.",
     "On devine la Grande Guerre, mais elle reste générale, comme quand tu écris {CIT} : rien ne la rattache vraiment à 14-18."),
    ("On sait d'où tu écris, mais pas qui tu es : ton personnage n'a ni nom, ni âge, ni métier d'avant la guerre. Ta lettre parle, mais personne ne la signe vraiment.",
     "On sait d'où tu écris, mais pas qui tu es, comme on le voit quand tu écris {CIT} : ton personnage n'a ni âge ni métier d'avant la guerre."),
    ("Ton personnage est posé au début, puis il s'efface : la lettre devient un exposé sur la guerre, et on oublie qui l'écrit et à qui.",
     "Ton personnage est posé au début, puis il s'efface, comme quand tu écris {CIT} : la lettre devient un exposé sur la guerre."),
    ("Ton personnage est là, la guerre aussi, mais la séparation ne tient pas : on ne sait pas depuis combien de temps vous êtes loin l'un de l'autre, et c'est pourtant ce qui fait écrire une lettre.",
     "Ton personnage est là, la guerre aussi, mais la séparation ne tient pas, comme on le voit quand tu écris {CIT} : on ne sait pas depuis combien de temps vous êtes loin l'un de l'autre."),
  ],
  [ # Satisfaisant
    ("Tu tiens le thème : 14-18, la lettre, la personne qui écrit et celle qui la lira. Une ou deux fausses notes de l'époque t'échappent encore.",
     "Tu tiens le thème, mais une ou deux fausses notes de l'époque t'échappent encore, comme quand tu écris {CIT}."),
    ("Tu tiens le thème sans fausse note : on sait qui écrit, d'où, à qui et depuis quand. Ton personnage reste pourtant un peu général : il pourrait être n'importe quel soldat, n'importe quelle personne qui attend.",
     "Tu tiens le thème sans fausse note, comme quand tu écris {CIT}. Ton personnage reste pourtant un peu général : il pourrait être n'importe qui."),
    ("Tu tiens le thème et ton personnage a une identité : son nom, son âge ou son métier d'avant reviennent dans la lettre et la rendent crédible.",
     "Tu tiens le thème et ton personnage a une identité, comme on le voit quand tu écris {CIT} : sa vie d'avant rend la lettre crédible."),
    ("Tu tiens le thème de bout en bout et ton personnage est crédible. Pour aller plus loin, il manque que sa vie d'avant la guerre colore vraiment ce qu'il voit et ce qu'il dit.",
     "Tu tiens le thème de bout en bout et ton personnage est crédible, comme quand tu écris {CIT}. Pour aller plus loin, il manque que sa vie d'avant colore vraiment ce qu'il voit et ce qu'il dit."),
  ],
  [ # Très satisfaisant
    ("Ton personnage existe vraiment : son métier d'avant, son âge, sa place dans la guerre se sentent dans sa façon de voir et de dire. On croit lire une vraie lettre.",
     "Ton personnage existe vraiment, comme quand tu écris {CIT} : son métier d'avant et son âge se sentent dans sa façon de voir et de dire."),
    ("Tu rends l'époque avec justesse : les détails de la vie de 14-18 sont choisis, jamais plaqués, et ils servent ce que ton personnage vit.",
     "Tu rends l'époque avec justesse, comme on le voit quand tu écris {CIT} : les détails de 14-18 sont choisis, jamais plaqués."),
    ("Le personnage, l'époque et la séparation ne font qu'un : chaque ligne dit à la fois qui écrit, où il est et ce que l'absence de l'autre lui coûte.",
     "Le personnage, l'époque et la séparation ne font qu'un, comme quand tu écris {CIT} : chaque ligne dit qui écrit, où il est et ce que l'absence lui coûte."),
    ("Tu tiens le thème avec une vérité rare : ta lettre pourrait avoir été retrouvée dans un grenier. Rien n'est inventé pour faire joli, tout sonne juste.",
     "Tu tiens le thème avec une vérité rare, comme quand tu écris {CIT} : ta lettre pourrait avoir été retrouvée dans un grenier. Tout sonne juste."),
  ],
])

paragraphes = ind("trois_paragraphes", "Les trois paragraphes : le concret, le plus dur, l'inquiétude pour l'autre", 4, "c4-ecrire-02", [
  "{prenom}, ta lettre n'a pas les trois paragraphes demandés. Les contenus prévus — ce que tu vois, ce qui est le plus dur, l'inquiétude pour l'autre — manquent ou se mélangent sans ordre.",
  "{prenom}, ta lettre a des paragraphes, mais l'un des trois contenus manque ou se perd dans un autre : le concret, le plus dur ou l'inquiétude pour l'autre n'a pas sa place.",
  "{prenom}, ta lettre suit les trois paragraphes décidés : le concret de ce que tu vois, ce qui est le plus dur, puis l'inquiétude pour l'autre. Chacun porte son contenu.",
  "{prenom}, tes trois paragraphes sont pleins et justes : le concret se voit, le plus dur surprend parce que ce n'est pas ce qu'on croyait, et l'inquiétude pour l'autre touche. La lettre avance d'un paragraphe à l'autre.",
], [
  [
    ("Ta lettre est d'un seul bloc : aucun paragraphe ne la découpe, et le lecteur ne sait pas où commence ni où finit chaque idée.",
     "Ta lettre est d'un seul bloc, comme on le voit quand tu écris {CIT} : aucun paragraphe ne la découpe."),
    ("Tu fais des paragraphes, mais aucun ne porte les contenus prévus : ni le concret de ce que tu vois, ni le plus dur, ni l'inquiétude pour l'autre.",
     "Tu fais des paragraphes, mais aucun ne porte les contenus prévus, comme quand tu écris {CIT} : ni le concret, ni le plus dur, ni l'inquiétude pour l'autre."),
    ("Un seul des trois contenus est vraiment là ; les deux autres manquent.",
     "Un seul des trois contenus est vraiment là, comme quand tu écris {CIT} ; les deux autres manquent."),
    ("Les trois contenus apparaissent par moments, mais mêlés dans tous les paragraphes : le brouillon d'idées n'a pas été suivi.",
     "Les trois contenus apparaissent par moments, mais mêlés, comme quand tu écris {CIT} : le brouillon d'idées n'a pas été suivi."),
  ],
  [
    ("Deux des trois contenus sont là ; le troisième manque entièrement.",
     "Deux des trois contenus sont là, comme quand tu écris {CIT} ; le troisième manque entièrement."),
    ("Les trois contenus sont là, mais pas dans leur paragraphe : le concret déborde sur le plus dur, ou l'inquiétude pour l'autre arrive au milieu.",
     "Les trois contenus sont là, mais pas dans leur paragraphe, comme quand tu écris {CIT}."),
    ("Les trois paragraphes sont là, mais l'un d'eux tient en une ou deux lignes : son contenu est annoncé, pas écrit.",
     "Les trois paragraphes sont là, mais l'un d'eux tient en une ou deux lignes, comme quand tu écris {CIT} : son contenu est annoncé, pas écrit."),
    ("Les trois paragraphes sont là, dans l'ordre, mais l'un d'eux s'éloigne de son contenu en route et finit par parler d'autre chose.",
     "Les trois paragraphes sont là, dans l'ordre, mais l'un d'eux s'éloigne de son contenu en route, comme quand tu écris {CIT}."),
  ],
  [
    ("Les trois paragraphes portent leur contenu, mais le deuxième dit ce que tout le monde attend : le plus dur, dans la consigne, n'est pas ce qu'on croit, et ta lettre ne le montre pas encore.",
     "Les trois paragraphes portent leur contenu, mais le deuxième dit ce que tout le monde attend, comme quand tu écris {CIT} : le plus dur n'est pas ce qu'on croit, et ta lettre ne le montre pas encore."),
    ("Les trois paragraphes portent leur contenu et le plus dur n'est pas ce qu'on attendait. Le concret du premier reste pourtant général : on ne voit pas encore vraiment où tu es.",
     "Les trois paragraphes portent leur contenu et le plus dur n'est pas ce qu'on attendait. Le concret reste pourtant général, comme quand tu écris {CIT} : on ne voit pas encore vraiment où tu es."),
    ("Les trois paragraphes portent leur contenu, le concret se voit, le plus dur surprend. Le troisième reste plus court : l'inquiétude pour l'autre est dite, pas encore ressentie.",
     "Le concret se voit, le plus dur surprend, mais le troisième paragraphe reste plus court, comme quand tu écris {CIT} : l'inquiétude pour l'autre est dite, pas encore ressentie."),
    ("Les trois paragraphes sont pleins et chacun tient son contenu jusqu'au bout. Pour aller plus loin, il manque que la lettre avance de l'un à l'autre, comme une pensée qui se suit.",
     "Les trois paragraphes sont pleins, comme on le voit quand tu écris {CIT}. Pour aller plus loin, il manque que la lettre avance de l'un à l'autre, comme une pensée qui se suit."),
  ],
  [
    ("Tes trois paragraphes sont pleins et la lettre avance de l'un à l'autre : on passe de ce que tu vois à ce qui te pèse, puis à celui ou celle à qui tu penses.",
     "Tes trois paragraphes sont pleins et la lettre avance de l'un à l'autre, comme quand tu écris {CIT} : on passe de ce que tu vois à ce qui te pèse, puis à l'autre."),
    ("Le concret de ton premier paragraphe se voit, se sent, s'entend : le lecteur est là où tu es.",
     "Le concret de ton premier paragraphe se voit, se sent, s'entend, comme quand tu écris {CIT} : le lecteur est là où tu es."),
    ("Ton deuxième paragraphe surprend juste : le plus dur n'est pas ce qu'on attendait, et c'est ce qui le rend vrai.",
     "Ton deuxième paragraphe surprend juste, comme quand tu écris {CIT} : le plus dur n'est pas ce qu'on attendait, et c'est ce qui le rend vrai."),
    ("Tes trois paragraphes forment une seule lettre : le concret prépare le plus dur, et le plus dur rend l'inquiétude pour l'autre plus forte. Rien n'est là pour cocher la consigne.",
     "Tes trois paragraphes forment une seule lettre, comme on le sent quand tu écris {CIT} : le concret prépare le plus dur, et le plus dur rend l'inquiétude pour l'autre plus forte."),
  ],
])

lectures = ind("lectures", "Les lectures reprises : Jean Déléage et le chapitre", 2, "c4-ecrire-03", [
  "{prenom}, ta lettre ne reprend rien de nos lectures. Ni la lettre de Jean Déléage ni les textes du chapitre ne nourrissent ce que tu écris.",
  "{prenom}, ta lettre reprend nos lectures de loin, ou au contraire les recopie : un mot, une scène reviennent, sans devenir les tiens.",
  "{prenom}, tes lectures nourrissent ta lettre : comme Jean Déléage, tu fais voir le concret, et des détails du chapitre reviennent à leur place.",
  "{prenom}, tu as fait tiennes tes lectures : ce que tu as lu chez Jean Déléage et dans le chapitre est transformé, au service de ta propre lettre. On sent les lectures sans jamais les voir recopiées.",
], [
  [
    ("Ta lettre ne reprend rien de ce que nous avons lu : elle aurait pu être écrite sans le chapitre.",
     "Ta lettre ne reprend rien de ce que nous avons lu, comme quand tu écris {CIT} : elle aurait pu être écrite sans le chapitre."),
    ("Ta lettre contredit ce que nos lectures montraient de la guerre : la vie du front ou de la maison y est inventée à l'opposé de ce que tu as lu.",
     "Ta lettre contredit ce que nos lectures montraient de la guerre, comme quand tu écris {CIT}."),
    ("Tu recopies des passages entiers de nos lectures : ce n'est plus ta lettre, c'est celle d'un autre.",
     "Tu recopies des passages de nos lectures, comme quand tu écris {CIT} : ce n'est plus ta lettre, c'est celle d'un autre."),
    ("Tu cites nos lectures pour en parler, comme dans un exposé : ton personnage n'a pas lu Jean Déléage, il vit ce que Jean Déléage a vécu.",
     "Tu cites nos lectures pour en parler, comme quand tu écris {CIT} : ton personnage n'a pas lu Jean Déléage, il vit ce qu'il a vécu."),
  ],
  [
    ("Un seul détail de nos lectures revient, isolé, sans que la lettre s'en nourrisse.",
     "Un seul détail de nos lectures revient, isolé, quand tu écris {CIT}, sans que la lettre s'en nourrisse."),
    ("Plusieurs détails de nos lectures reviennent, mais recopiés presque mot pour mot : ils ne sont pas encore devenus les tiens.",
     "Plusieurs détails de nos lectures reviennent, mais presque mot pour mot, comme quand tu écris {CIT} : ils ne sont pas encore devenus les tiens."),
    ("Tu reprends l'esprit de nos lectures — la guerre vue de l'intérieur — mais sans le concret : les choses vues que Jean Déléage note si précisément manquent.",
     "Tu reprends l'esprit de nos lectures, mais sans le concret, comme quand tu écris {CIT} : les choses vues que Jean Déléage note si précisément manquent."),
    ("Tu reprends le concret de nos lectures, mais dans un seul paragraphe : le reste de la lettre ne s'en nourrit plus.",
     "Tu reprends le concret de nos lectures, comme quand tu écris {CIT}, mais dans un seul paragraphe : le reste de la lettre ne s'en nourrit plus."),
  ],
  [
    ("Tes lectures nourrissent ta lettre : comme Jean Déléage, tu fais voir le concret. Quelques détails restent pourtant trop proches du texte lu.",
     "Tes lectures nourrissent ta lettre : comme Jean Déléage, tu fais voir le concret. Quelques détails restent pourtant trop proches du texte lu, comme quand tu écris {CIT}."),
    ("Comme Jean Déléage, tu fais voir le concret, avec tes propres mots : on reconnaît la leçon de la lettre lue sans la retrouver recopiée.",
     "Comme Jean Déléage, tu fais voir le concret avec tes propres mots, comme quand tu écris {CIT} : on reconnaît la leçon de la lettre lue sans la retrouver recopiée."),
    ("Tes lectures reviennent dans toute la lettre, à leur place : le concret, mais aussi ce qui pèse vraiment et qui n'est pas ce qu'on croit.",
     "Tes lectures reviennent dans toute la lettre, à leur place, comme quand tu écris {CIT} : le concret, mais aussi ce qui pèse vraiment et qui n'est pas ce qu'on croit."),
    ("Tes lectures nourrissent toute la lettre. Pour aller plus loin, il manque que tu les transformes : qu'un détail lu devienne un détail à toi, que tu n'aurais pas trouvé sans elles.",
     "Tes lectures nourrissent toute la lettre, comme on le voit quand tu écris {CIT}. Pour aller plus loin, il manque que tu les transformes : qu'un détail lu devienne un détail à toi."),
  ],
  [
    ("Tu as fait tiennes tes lectures : un détail lu devient chez toi un détail neuf, qui porte ta lettre.",
     "Tu as fait tiennes tes lectures, comme quand tu écris {CIT} : un détail lu devient chez toi un détail neuf, qui porte ta lettre."),
    ("Tu reprends de Jean Déléage sa façon de regarder, pas ses phrases : on sent la lecture sans jamais la voir.",
     "Tu reprends de Jean Déléage sa façon de regarder, pas ses phrases, comme quand tu écris {CIT} : on sent la lecture sans jamais la voir."),
    ("Tes lectures sont transformées au service de ton personnage : ce qu'il voit, ce qu'il tait, ce qui lui pèse doivent à ce que tu as lu, et pourtant tout est à lui.",
     "Tes lectures sont transformées au service de ton personnage, comme quand tu écris {CIT} : tout doit à ce que tu as lu, et pourtant tout est à lui."),
    ("Tes lectures sont fondues dans ta lettre : un lecteur du chapitre les reconnaîtrait, un autre lecteur ne verrait qu'une lettre vraie.",
     "Tes lectures sont fondues dans ta lettre, comme quand tu écris {CIT} : un lecteur du chapitre les reconnaîtrait, un autre ne verrait qu'une lettre vraie."),
  ],
])

tait = ind("ce_qu_on_tait", "Ce qu'on tait, et pourquoi", 2, "c4-ecrire-01", [
  "{prenom}, ta lettre ne tait rien : tu dis tout à la personne qui te lira, sans te demander ce qu'elle peut entendre. Le silence décidé avant d'écrire n'apparaît pas.",
  "{prenom}, tu tais quelque chose, mais maladroitement : tu annonces que tu ne diras pas, au lieu de le faire sentir, ou le silence ne s'explique par rien.",
  "{prenom}, on sent ce que tu tais : ta lettre contourne un sujet, et le lecteur devine pourquoi tu le tais.",
  "{prenom}, ce que tu tais fait la force de ta lettre : le silence s'entend derrière les mots, et il en dit plus que ce qui est écrit.",
], [
  [
    ("Tu racontes tout, y compris le pire, sans te demander ce que la personne qui te lira peut entendre.",
     "Tu racontes tout, y compris le pire, comme quand tu écris {CIT}, sans te demander ce que la personne qui te lira peut entendre."),
    ("Ta lettre ne tait rien : aucun sujet n'est évité, aucun silence ne se devine.",
     "Ta lettre ne tait rien, comme on le voit quand tu écris {CIT} : aucun sujet n'est évité, aucun silence ne se devine."),
    ("Tu écris que tu caches quelque chose, puis tu le racontes : ce que tu voulais taire est écrit noir sur blanc.",
     "Tu écris que tu caches quelque chose, puis tu le racontes, comme quand tu écris {CIT} : ce que tu voulais taire est écrit noir sur blanc."),
    ("Un silence se devine par endroits, mais il est contredit ailleurs : ce que tu tais ici, tu le dis là.",
     "Un silence se devine par endroits, mais il est contredit ailleurs, comme quand tu écris {CIT} : ce que tu tais ici, tu le dis là."),
  ],
  [
    ("Tu tais quelque chose, mais on ne sait ni quoi ni pourquoi : le silence reste une phrase de plus.",
     "Tu tais quelque chose, mais on ne sait ni quoi ni pourquoi, comme quand tu écris {CIT} : le silence reste une phrase de plus."),
    ("Tu annonces ce que tu tais au lieu de le faire sentir : le silence est expliqué, pas entendu.",
     "Tu annonces ce que tu tais au lieu de le faire sentir, comme quand tu écris {CIT} : le silence est expliqué, pas entendu."),
    ("On devine ce que tu tais, mais pas pourquoi : rien dans la lettre ne fait comprendre la raison de ce silence.",
     "On devine ce que tu tais, mais pas pourquoi, comme quand tu écris {CIT} : rien ne fait comprendre la raison de ce silence."),
    ("On devine ce que tu tais et pourquoi, mais une phrase en dit trop et brise le silence.",
     "On devine ce que tu tais et pourquoi, mais une phrase en dit trop et brise le silence, comme quand tu écris {CIT}."),
  ],
  [
    ("On sent ce que tu tais : ta lettre contourne un sujet. La raison du silence reste pourtant un peu floue.",
     "On sent ce que tu tais, comme quand tu écris {CIT} : ta lettre contourne un sujet. La raison du silence reste pourtant un peu floue."),
    ("On sent ce que tu tais et pourquoi : ta lettre protège l'autre sans le lui dire.",
     "On sent ce que tu tais et pourquoi, comme quand tu écris {CIT} : ta lettre protège l'autre sans le lui dire."),
    ("Ton silence est tenu de bout en bout : jamais tu ne dis ce que tu as décidé de taire, et le lecteur le devine.",
     "Ton silence est tenu de bout en bout, comme on le sent quand tu écris {CIT} : jamais tu ne dis ce que tu as décidé de taire, et le lecteur le devine."),
    ("Ton silence est tenu et compris. Pour aller plus loin, il manque qu'il travaille la lettre : qu'une litote, un détour, un mot trop calme fasse entendre ce qui n'est pas écrit.",
     "Ton silence est tenu et compris, comme quand tu écris {CIT}. Pour aller plus loin, il manque qu'une litote, un détour, un mot trop calme fasse entendre ce qui n'est pas écrit."),
  ],
  [
    ("Ce que tu tais s'entend derrière tes mots : une litote, un détour, un mot trop calme le font comprendre.",
     "Ce que tu tais s'entend derrière tes mots, comme quand tu écris {CIT} : un détour, un mot trop calme le font comprendre."),
    ("Ton silence dit qui tu es : on comprend ce que tu caches, et on comprend aussi que tu aimes assez l'autre pour le lui cacher.",
     "Ton silence dit qui tu es, comme quand tu écris {CIT} : on comprend ce que tu caches, et que tu aimes assez l'autre pour le lui cacher."),
    ("Ce que tu tais pèse plus que ce que tu dis : le lecteur lit deux lettres, celle qui est écrite et celle qui est tue.",
     "Ce que tu tais pèse plus que ce que tu dis, comme quand tu écris {CIT} : le lecteur lit deux lettres, celle qui est écrite et celle qui est tue."),
    ("Ton silence fait la force de ta lettre : rien n'est dit, tout est entendu.",
     "Ton silence fait la force de ta lettre, comme quand tu écris {CIT} : rien n'est dit, tout est entendu."),
  ],
])

# ───────────────────────── 2 · La construction des phrases (14)
complexes = ind("phrases_complexes", "Toutes les phrases sont complexes", 5, "c4-langue-04", [
  "{prenom}, tes phrases ne sont pas des phrases complexes. La plupart n'ont qu'un verbe conjugué, ou bien les propositions se suivent sans être reliées.",
  "{prenom}, tu écris des phrases complexes, mais pas toutes : plusieurs phrases simples restent, ou certaines phrases longues ne tiennent pas à l'analyse logique.",
  "{prenom}, toutes tes phrases, ou presque, sont complexes et logiquement construites : chaque subordonnée dépend d'une principale, chaque relatif est le bon.",
  "{prenom}, toutes tes phrases sont complexes, et chacune tient à l'analyse logique sans une faille : relatifs justes, ponctuation sûre, propositions bien emboîtées. Même tes phrases les plus longues restent claires.",
], [
  [
    ("Presque toutes tes phrases sont simples : un verbe conjugué, un point, et on recommence.",
     "Presque toutes tes phrases sont simples, comme quand tu écris {CIT} : un verbe conjugué, un point, et on recommence."),
    ("Tes phrases s'allongent, mais par des virgules et des « et » : les propositions se suivent sans qu'aucune dépende d'une autre.",
     "Tes phrases s'allongent, mais par des virgules et des « et », comme quand tu écris {CIT} : les propositions se suivent sans qu'aucune dépende d'une autre."),
    ("Tu tentes des phrases complexes, mais elles se cassent : une subordonnée reste seule, sans principale, entre deux points.",
     "Tu tentes des phrases complexes, mais elles se cassent, comme quand tu écris {CIT} : une subordonnée reste seule, sans principale, entre deux points."),
    ("Moins de la moitié de tes phrases sont complexes, et plusieurs d'entre elles ne tiennent pas à l'analyse logique.",
     "Moins de la moitié de tes phrases sont complexes, et plusieurs ne tiennent pas à l'analyse logique, comme quand tu écris {CIT}."),
  ],
  [
    ("La moitié de tes phrases environ sont complexes ; les autres restent simples.",
     "La moitié de tes phrases environ sont complexes ; les autres restent simples, comme quand tu écris {CIT}."),
    ("La plupart de tes phrases sont complexes, mais plusieurs ne tiennent pas : une proposition n'a pas de principale, ou deux principales sont soudées par une virgule.",
     "La plupart de tes phrases sont complexes, mais plusieurs ne tiennent pas, comme quand tu écris {CIT} : une proposition n'a pas de principale, ou deux principales sont soudées par une virgule."),
    ("La plupart de tes phrases sont complexes et tiennent, mais tes relatifs hésitent : « que » à la place de « dont », « où » à la place de « que ».",
     "La plupart de tes phrases sont complexes et tiennent, mais tes relatifs hésitent, comme quand tu écris {CIT}."),
    ("Toutes tes phrases sont complexes sauf quelques-unes, mais l'analyse logique n'a pas été faite au brouillon : deux ou trois phrases restent bancales.",
     "Toutes tes phrases sont complexes sauf quelques-unes, mais deux ou trois restent bancales, comme quand tu écris {CIT} : l'analyse logique au brouillon les aurait sauvées."),
  ],
  [
    ("Toutes tes phrases sont complexes sauf une ou deux, et elles tiennent à l'analyse logique.",
     "Toutes tes phrases sont complexes sauf une ou deux, comme quand tu écris {CIT}, et elles tiennent à l'analyse logique."),
    ("Toutes tes phrases sont complexes et tiennent à l'analyse logique ; un relatif ou une virgule hésite encore ici ou là.",
     "Toutes tes phrases sont complexes et tiennent à l'analyse logique ; un relatif ou une virgule hésite encore, comme quand tu écris {CIT}."),
    ("Toutes tes phrases sont complexes, logiquement construites, et tes relatifs sont justes, y compris « dont » et « où ».",
     "Toutes tes phrases sont complexes, logiquement construites, et tes relatifs sont justes, comme quand tu écris {CIT}."),
    ("Toutes tes phrases sont complexes et sans faille. Pour aller plus loin, il manque que leur longueur serve ce que tu dis : une phrase qui s'étire pour l'attente, une phrase plus resserrée pour le choc.",
     "Toutes tes phrases sont complexes et sans faille, comme quand tu écris {CIT}. Pour aller plus loin, il manque que leur longueur serve ce que tu dis."),
  ],
  [
    ("Toutes tes phrases sont complexes et tiennent à l'analyse logique sans une faille, même les plus longues.",
     "Toutes tes phrases sont complexes et tiennent à l'analyse logique sans une faille, même les plus longues, comme quand tu écris {CIT}."),
    ("Tes phrases complexes restent claires même quand elles s'allongent : la ponctuation guide le lecteur d'une proposition à l'autre.",
     "Tes phrases complexes restent claires même quand elles s'allongent, comme quand tu écris {CIT} : la ponctuation guide le lecteur d'une proposition à l'autre."),
    ("Tes phrases complexes sont variées : tu choisis la construction selon ce que tu veux dire.",
     "Tes phrases complexes sont variées, comme quand tu écris {CIT} : tu choisis la construction selon ce que tu veux dire."),
    ("Tes phrases complexes servent ta lettre : leur longueur, leur rythme, leur coupe font sentir l'attente, la fatigue ou l'inquiétude. On ne voit plus l'exercice, on entend une voix.",
     "Tes phrases complexes servent ta lettre, comme quand tu écris {CIT} : leur longueur, leur rythme, leur coupe font sentir ce que tu vis. On ne voit plus l'exercice, on entend une voix."),
  ],
])

architectures = ind("architectures", "Les cinq architectures, valorisées au-delà", 7, "c4-langue-04", [
  "{prenom}, les cinq architectures n'apparaissent pas dans ta lettre, ou une seule est construite correctement.",
  "{prenom}, une partie seulement des cinq architectures apparaît : deux, trois ou quatre sont construites, les autres manquent ou ne sont pas les bonnes.",
  "{prenom}, les cinq architectures apparaissent chacune au moins une fois, construites correctement, avec leur numéro dans la marge : tu fais ce qui est demandé.",
  "{prenom}, les cinq architectures sont là, et tu en reprends plusieurs, bien construites, au service de ta lettre. C'est ce qui démarque ta copie d'une copie qui fait le strict minimum.",
], [
  [
    ("Aucune des cinq architectures n'apparaît dans ta lettre.",
     "Aucune des cinq architectures n'apparaît dans ta lettre : même une phrase comme {CIT} n'en reprend aucune."),
    ("Tu as noté des numéros dans la marge, mais les phrases ne suivent pas l'architecture annoncée : il manque des relatives, ou la principale n'est pas coupée.",
     "Tu as noté des numéros dans la marge, mais les phrases ne suivent pas l'architecture annoncée, comme quand tu écris {CIT}."),
    ("Une seule architecture est construite correctement ; les autres tentatives ne tiennent pas à l'analyse logique.",
     "Une seule architecture est construite correctement ; les autres tentatives ne tiennent pas, comme quand tu écris {CIT}."),
    ("Une architecture est construite correctement, et une autre presque : il lui manque une relative ou la fin de la principale.",
     "Une architecture est construite correctement, et une autre presque, comme quand tu écris {CIT} : il lui manque une relative ou la fin de la principale."),
  ],
  [
    ("Deux architectures sur cinq sont construites correctement ; les trois autres manquent.",
     "Deux architectures sur cinq sont construites correctement, comme quand tu écris {CIT} ; les trois autres manquent."),
    ("Trois architectures sur cinq sont là, mais l'une d'elles ne tient pas : une relative manque, ou la principale coupée ne reprend jamais.",
     "Trois architectures sur cinq sont là, mais l'une d'elles ne tient pas, comme quand tu écris {CIT}."),
    ("Trois architectures sur cinq sont construites correctement ; deux manquent.",
     "Trois architectures sur cinq sont construites correctement, comme quand tu écris {CIT} ; deux manquent."),
    ("Quatre architectures sur cinq sont construites correctement ; il en manque une pour faire ce qui est demandé.",
     "Quatre architectures sur cinq sont construites correctement, comme quand tu écris {CIT} ; il en manque une pour faire ce qui est demandé."),
  ],
  [
    ("Les cinq architectures apparaissent, mais l'une d'elles reste fragile : une relative est mal reliée, ou la principale coupée reprend mal.",
     "Les cinq architectures apparaissent, mais l'une d'elles reste fragile, comme quand tu écris {CIT}."),
    ("Les cinq architectures apparaissent, construites correctement, mais leurs numéros ne sont pas tous dans la marge.",
     "Les cinq architectures apparaissent, construites correctement, comme quand tu écris {CIT}, mais leurs numéros ne sont pas tous dans la marge."),
    ("Les cinq architectures apparaissent, construites correctement, chacune avec son numéro dans la marge : le travail demandé est fait.",
     "Les cinq architectures apparaissent, construites correctement et numérotées, comme quand tu écris {CIT} : le travail demandé est fait."),
    ("Les cinq architectures sont là, correctes et numérotées, et tu en reprends une une seconde fois : c'est le début de la valorisation.",
     "Les cinq architectures sont là, correctes et numérotées, et tu en reprends une une seconde fois, comme quand tu écris {CIT} : c'est le début de la valorisation."),
  ],
  [
    ("Les cinq architectures sont là, et tu en reprends plusieurs une seconde fois, toujours correctement construites.",
     "Les cinq architectures sont là, et tu en reprends plusieurs, toujours correctement construites, comme quand tu écris {CIT}."),
    ("Tu reprends les architectures souvent et tu varies tes relatives : « qui », « que », « dont », « où », et « et qui », « et dont » quand elles se suivent.",
     "Tu reprends les architectures souvent et tu varies tes relatives, comme quand tu écris {CIT}."),
    ("Tu reprends les architectures et tu les places là où elles servent : la plus longue pour ce qui déborde, la principale coupée pour ce qui retient le souffle.",
     "Tu reprends les architectures et tu les places là où elles servent, comme quand tu écris {CIT}."),
    ("Les architectures sont si bien reprises qu'on ne voit plus l'exercice : elles font la voix de ta lettre, et chacune tient à l'analyse logique.",
     "Les architectures sont si bien reprises qu'on ne voit plus l'exercice, comme quand tu écris {CIT} : elles font la voix de ta lettre."),
  ],
])

modal = ind("modalisation_litote", "Une modalisation par paragraphe, une litote", 2, "c4-langue-04", [
  "{prenom}, ta lettre n'a ni modalisation ni litote : rien ne montre ton degré de certitude, et rien n'est dit en moins pour faire entendre plus.",
  "{prenom}, tu modalises dans un ou deux paragraphes, pas dans les trois, ou ta litote n'en est pas une : elle dit la chose au lieu de la faire entendre.",
  "{prenom}, chacun de tes trois paragraphes a sa modalisation, et ta litote dit moins pour faire entendre plus : ce qui est demandé est fait.",
  "{prenom}, tes modalisations sont variées et justes, et ta litote porte : elle fait entendre ce que ta lettre tait. Ce n'est plus un procédé, c'est ta voix.",
], [
  [
    ("Ta lettre n'a ni modalisation ni litote.",
     "Ta lettre n'a ni modalisation ni litote : même quand tu écris {CIT}, tu affirmes sans nuance."),
    ("Tu affirmes tout avec la même certitude : aucun mot ne montre ce dont tu doutes, ce que tu espères, ce que tu crains.",
     "Tu affirmes tout avec la même certitude, comme quand tu écris {CIT} : aucun mot ne montre ce dont tu doutes, ce que tu espères, ce que tu crains."),
    ("Une modalisation apparaît une fois ; aucune litote.",
     "Une modalisation apparaît une fois, quand tu écris {CIT} ; aucune litote."),
    ("Tu tentes une litote, mais elle dit l'inverse de ce que tu veux faire entendre ; aucune modalisation ailleurs.",
     "Tu tentes une litote, mais elle dit l'inverse de ce que tu veux faire entendre, comme quand tu écris {CIT} ; aucune modalisation ailleurs."),
  ],
  [
    ("Tu modalises dans un seul paragraphe ; aucune litote.",
     "Tu modalises dans un seul paragraphe, comme quand tu écris {CIT} ; aucune litote."),
    ("Tu modalises dans deux paragraphes sur trois ; ta litote manque.",
     "Tu modalises dans deux paragraphes sur trois, comme quand tu écris {CIT} ; ta litote manque."),
    ("Tu modalises dans les trois paragraphes, mais ta litote n'en est pas une : elle dit la chose au lieu de la faire entendre.",
     "Tu modalises dans les trois paragraphes, mais ta litote n'en est pas une, comme quand tu écris {CIT} : elle dit la chose au lieu de la faire entendre."),
    ("Ta litote fonctionne, mais tes modalisations ne sont que dans un ou deux paragraphes.",
     "Ta litote fonctionne, comme quand tu écris {CIT}, mais tes modalisations ne sont que dans un ou deux paragraphes."),
  ],
  [
    ("Chaque paragraphe a sa modalisation et ta litote fonctionne, mais tes modalisations se répètent : toujours le même adverbe, toujours le même verbe.",
     "Chaque paragraphe a sa modalisation et ta litote fonctionne, mais tes modalisations se répètent, comme quand tu écris {CIT}."),
    ("Chaque paragraphe a sa modalisation, variée, et ta litote dit moins pour faire entendre plus.",
     "Chaque paragraphe a sa modalisation, variée, et ta litote dit moins pour faire entendre plus, comme quand tu écris {CIT}."),
    ("Tes modalisations sont variées et justes, et ta litote est bien placée.",
     "Tes modalisations sont variées et justes, et ta litote est bien placée, comme quand tu écris {CIT}."),
    ("Modalisations et litote sont là, variées et justes. Pour aller plus loin, il manque que ta litote serve ce que tu tais.",
     "Modalisations et litote sont là, variées et justes, comme quand tu écris {CIT}. Pour aller plus loin, il manque que ta litote serve ce que tu tais."),
  ],
  [
    ("Ta litote fait entendre ce que ta lettre tait : elle dit peu, on entend beaucoup.",
     "Ta litote fait entendre ce que ta lettre tait, comme quand tu écris {CIT} : elle dit peu, on entend beaucoup."),
    ("Tes modalisations dessinent ton personnage : ce dont il doute, ce qu'il n'ose pas croire, ce qu'il espère malgré tout.",
     "Tes modalisations dessinent ton personnage, comme quand tu écris {CIT} : ce dont il doute, ce qu'il n'ose pas croire, ce qu'il espère malgré tout."),
    ("Tu modalises et tu atténues avec finesse : chaque nuance compte, aucune n'est là pour cocher la consigne.",
     "Tu modalises et tu atténues avec finesse, comme quand tu écris {CIT} : chaque nuance compte, aucune n'est là pour cocher la consigne."),
    ("Modalisations et litote sont devenues ta voix : le lecteur ne voit plus le procédé, il entend quelqu'un qui pèse chaque mot pour l'autre.",
     "Modalisations et litote sont devenues ta voix, comme quand tu écris {CIT} : le lecteur ne voit plus le procédé, il entend quelqu'un qui pèse chaque mot pour l'autre."),
  ],
])

# ───────────────────────── 3 · L'organisation et la lettre (6)
codes = ind("codes", "Les codes de la lettre : lieu, date, adresse, signature", 2, "c4-ecrire-01", [
  "{prenom}, ton texte n'a pas les codes de la lettre : ni lieu, ni date, ni formule d'adresse, ni signature.",
  "{prenom}, ta lettre n'a qu'une partie de ses codes : il manque le lieu, la date, l'adresse ou la signature, ou l'un d'eux est faux.",
  "{prenom}, ta lettre a ses quatre codes : le lieu, la date, l'adresse à celui ou celle qui la lira, la signature.",
  "{prenom}, ta lettre a ses quatre codes, et ils disent déjà qui tu es : une date de 14-18 juste, un lieu vrai, une adresse et une signature qui disent votre lien.",
], [
  [
    ("Ton texte n'a aucun des codes de la lettre.",
     "Ton texte n'a aucun des codes de la lettre : il commence par {CIT}, comme un récit."),
    ("Un seul code apparaît : la signature, ou une formule d'adresse.",
     "Un seul code apparaît, quand tu écris {CIT}."),
    ("Deux codes apparaissent, mais mal placés : la date au milieu, la signature sans formule pour finir.",
     "Deux codes apparaissent, mais mal placés, comme quand tu écris {CIT}."),
    ("Deux codes sont à leur place ; les deux autres manquent.",
     "Deux codes sont à leur place, comme quand tu écris {CIT} ; les deux autres manquent."),
  ],
  [
    ("Trois codes sur quatre sont là ; il en manque un.",
     "Trois codes sur quatre sont là, comme quand tu écris {CIT} ; il en manque un."),
    ("Les quatre codes sont là, mais l'un d'eux est faux pour l'époque : une date hors de la guerre, un lieu qui ne peut pas être le tien.",
     "Les quatre codes sont là, mais l'un d'eux est faux pour l'époque, comme quand tu écris {CIT}."),
    ("Les quatre codes sont là, mais l'un d'eux est mal placé : la date en bas, le lieu oublié en tête.",
     "Les quatre codes sont là, mais l'un d'eux est mal placé, comme quand tu écris {CIT}."),
    ("Les quatre codes sont là et à leur place, mais la lettre s'arrête d'un coup : la signature arrive sans formule pour prendre congé.",
     "Les quatre codes sont là et à leur place, mais la lettre s'arrête d'un coup, comme quand tu écris {CIT} : la signature arrive sans formule pour prendre congé."),
  ],
  [
    ("Ta lettre a ses quatre codes, à leur place ; l'adresse et la signature restent pourtant toutes faites.",
     "Ta lettre a ses quatre codes, à leur place ; l'adresse et la signature restent pourtant toutes faites, comme quand tu écris {CIT}."),
    ("Ta lettre a ses quatre codes, et la date et le lieu sont justes pour 14-18.",
     "Ta lettre a ses quatre codes, et la date et le lieu sont justes pour 14-18, comme quand tu écris {CIT}."),
    ("Ta lettre a ses quatre codes, justes pour l'époque, et ta formule de fin prend vraiment congé de l'autre.",
     "Ta lettre a ses quatre codes, justes pour l'époque, et ta formule de fin prend vraiment congé de l'autre, comme quand tu écris {CIT}."),
    ("Ta lettre a ses quatre codes, justes et bien placés. Pour aller plus loin, il manque que l'adresse et la signature disent votre lien.",
     "Ta lettre a ses quatre codes, justes et bien placés, comme quand tu écris {CIT}. Pour aller plus loin, il manque que l'adresse et la signature disent votre lien."),
  ],
  [
    ("Tes codes disent votre lien : l'adresse et la signature suffisent à faire comprendre qui vous êtes l'un pour l'autre.",
     "Tes codes disent votre lien, comme quand tu écris {CIT} : ils suffisent à faire comprendre qui vous êtes l'un pour l'autre."),
    ("Ta date et ton lieu sont justes et parlants : on sait où en est la guerre, et où tu es dedans.",
     "Ta date et ton lieu sont justes et parlants, comme quand tu écris {CIT} : on sait où en est la guerre, et où tu es dedans."),
    ("Tes codes sont justes et vivants : la formule de fin et la signature portent la séparation.",
     "Tes codes sont justes et vivants, comme quand tu écris {CIT} : la formule de fin et la signature portent la séparation."),
    ("Tes codes font partie de la lettre : on les lit comme le reste, et ils disent déjà tout ce qui va suivre.",
     "Tes codes font partie de la lettre, comme quand tu écris {CIT} : on les lit comme le reste, et ils disent déjà tout ce qui va suivre."),
  ],
])

personne = ind("personne_destinataire", "La 1re personne et le destinataire", 2, "c4-ecrire-01", [
  "{prenom}, tu ne tiens pas la 1re personne, ou tu oublies à qui tu écris : ton texte raconte, il ne parle à personne.",
  "{prenom}, tu tiens la 1re personne, mais le destinataire disparaît par moments, ou les temps glissent sans raison.",
  "{prenom}, tu tiens la 1re personne et tu écris vraiment à quelqu'un : tu t'adresses à lui, et tes temps sont cohérents — le présent de la lettre, le passé de ce que tu racontes, le futur de ce que tu espères.",
  "{prenom}, ta lettre est un vrai dialogue avec l'absent : tu réponds à sa dernière lettre, tu le questionnes, tu l'appelles, et tes temps disent exactement où vous en êtes.",
], [
  [
    ("Tu écris à la 3e personne : ce n'est pas toi qui parles, c'est un narrateur qui raconte.",
     "Tu écris à la 3e personne, comme quand tu écris {CIT} : ce n'est pas toi qui parles, c'est un narrateur qui raconte."),
    ("Tu dis « je », mais tu ne t'adresses jamais à personne : aucun « tu », aucun « vous ».",
     "Tu dis « je », mais tu ne t'adresses jamais à personne, comme quand tu écris {CIT}."),
    ("Tu passes du « je » au « il » sans raison, et le lecteur ne sait plus qui parle.",
     "Tu passes du « je » au « il » sans raison, comme quand tu écris {CIT}, et le lecteur ne sait plus qui parle."),
    ("Tu tiens le « je », mais tes temps se mélangent si souvent qu'on ne sait plus ce qui est passé, présent ou à venir.",
     "Tu tiens le « je », mais tes temps se mélangent si souvent, comme quand tu écris {CIT}, qu'on ne sait plus ce qui est passé, présent ou à venir."),
  ],
  [
    ("Tu tiens le « je », mais le destinataire n'apparaît qu'au début et à la fin.",
     "Tu tiens le « je », mais le destinataire n'apparaît qu'au début et à la fin ; entre les deux, tu écris {CIT} comme pour personne."),
    ("Tu tiens le « je » et le destinataire, mais tu hésites entre « tu » et « vous » pour la même personne.",
     "Tu tiens le « je » et le destinataire, mais tu hésites entre « tu » et « vous » pour la même personne, comme quand tu écris {CIT}."),
    ("Tu tiens le « je » et le destinataire, mais tes temps glissent : le présent de la lettre et le passé de ce que tu racontes se mélangent.",
     "Tu tiens le « je » et le destinataire, mais tes temps glissent, comme quand tu écris {CIT}."),
    ("Tu tiens le « je », le destinataire et les temps, sauf dans un passage qui redevient un récit.",
     "Tu tiens le « je », le destinataire et les temps, sauf dans un passage qui redevient un récit, comme quand tu écris {CIT}."),
  ],
  [
    ("Tu tiens le « je » et tu écris à quelqu'un d'un bout à l'autre ; un temps hésite encore ici ou là.",
     "Tu tiens le « je » et tu écris à quelqu'un d'un bout à l'autre ; un temps hésite encore, comme quand tu écris {CIT}."),
    ("Tu tiens le « je », le destinataire et les temps : le présent de la lettre, le passé de ce que tu racontes, le futur de ce que tu espères.",
     "Tu tiens le « je », le destinataire et les temps, comme quand tu écris {CIT}."),
    ("Tu tiens tout, et tu t'adresses à l'autre au fil de la lettre, pas seulement au début : on sent qu'il est là.",
     "Tu tiens tout, et tu t'adresses à l'autre au fil de la lettre, comme quand tu écris {CIT} : on sent qu'il est là."),
    ("Tu tiens tout. Pour aller plus loin, il manque que ta lettre réponde à l'autre : à sa dernière lettre, à ses questions, à ce qu'il t'a demandé.",
     "Tu tiens tout, comme quand tu écris {CIT}. Pour aller plus loin, il manque que ta lettre réponde à l'autre : à sa dernière lettre, à ses questions."),
  ],
  [
    ("Ta lettre répond à l'autre : on devine ce qu'il t'avait écrit, et la conversation continue.",
     "Ta lettre répond à l'autre, comme quand tu écris {CIT} : on devine ce qu'il t'avait écrit, et la conversation continue."),
    ("Tu questionnes l'autre, tu l'appelles, tu lui demandes : l'absent est présent à chaque paragraphe.",
     "Tu questionnes l'autre, tu l'appelles, tu lui demandes, comme quand tu écris {CIT} : l'absent est présent à chaque paragraphe."),
    ("Tes temps disent exactement la séparation : ce qui était avant, ce qui est maintenant, ce que tu n'oses plus promettre.",
     "Tes temps disent exactement la séparation, comme quand tu écris {CIT} : ce qui était avant, ce qui est maintenant, ce que tu n'oses plus promettre."),
    ("Ta lettre est un vrai dialogue avec l'absent : en la lisant, on entend aussi celui ou celle à qui elle est écrite.",
     "Ta lettre est un vrai dialogue avec l'absent, comme quand tu écris {CIT} : en la lisant, on entend aussi celui ou celle à qui elle est écrite."),
  ],
])

lignes = ind("trente_lignes", "Trente lignes", 2, "c4-ecrire-02", [
  "{prenom}, ta lettre est nettement trop courte (moins de quinze lignes) : le sujet ne peut pas se déployer.",
  "{prenom}, ta lettre reste courte (entre quinze et vingt-cinq lignes) : les trois paragraphes n'ont pas la place de se développer.",
  "{prenom}, ta lettre fait ses trente lignes : chacun des trois paragraphes a sa place.",
  "{prenom}, ta lettre fait ses trente lignes, pleines et bien employées : chaque paragraphe se déploie, sans délayer ni précipiter.",
], [
  [
    ("Ta lettre tient en quelques lignes : elle commence et s'arrête aussitôt.",
     "Ta lettre tient en quelques lignes : elle commence et s'arrête aussitôt, sur {CIT}."),
    ("Ta lettre fait moins de dix lignes : un seul paragraphe a eu le temps d'exister.",
     "Ta lettre fait moins de dix lignes : un seul paragraphe a eu le temps d'exister, celui où tu écris {CIT}."),
    ("Ta lettre fait une dizaine de lignes : les trois paragraphes sont à peine esquissés.",
     "Ta lettre fait une dizaine de lignes : les trois paragraphes sont à peine esquissés, comme quand tu écris {CIT}."),
    ("Ta lettre approche les quinze lignes, mais s'arrête avant d'avoir dit l'essentiel.",
     "Ta lettre approche les quinze lignes, mais s'arrête avant d'avoir dit l'essentiel, sur {CIT}."),
  ],
  [
    ("Ta lettre fait une quinzaine de lignes : chaque paragraphe tient en quelques phrases.",
     "Ta lettre fait une quinzaine de lignes : chaque paragraphe tient en quelques phrases, comme quand tu écris {CIT}."),
    ("Ta lettre fait une vingtaine de lignes, mais l'un des paragraphes est sacrifié.",
     "Ta lettre fait une vingtaine de lignes, mais l'un des paragraphes est sacrifié, comme quand tu écris {CIT}."),
    ("Ta lettre fait une vingtaine de lignes, bien réparties, mais chaque paragraphe s'arrête tôt.",
     "Ta lettre fait une vingtaine de lignes, bien réparties, mais chaque paragraphe s'arrête tôt, comme quand tu écris {CIT}."),
    ("Ta lettre approche les vingt-cinq lignes : il manque quelques lignes pour que tout se déploie.",
     "Ta lettre approche les vingt-cinq lignes : il manque quelques lignes pour que tout se déploie, comme on le voit quand tu écris {CIT}."),
  ],
  [
    ("Ta lettre fait ses trente lignes, mais un paragraphe en prend la moitié et les autres se serrent.",
     "Ta lettre fait ses trente lignes, mais un paragraphe en prend la moitié et les autres se serrent, comme quand tu écris {CIT}."),
    ("Ta lettre fait ses trente lignes, mais quelques lignes répètent ce qui est déjà dit.",
     "Ta lettre fait ses trente lignes, mais quelques lignes répètent ce qui est déjà dit, comme quand tu écris {CIT}."),
    ("Ta lettre fait ses trente lignes, bien réparties entre les trois paragraphes.",
     "Ta lettre fait ses trente lignes, bien réparties entre les trois paragraphes, comme on le voit quand tu écris {CIT}."),
    ("Ta lettre fait ses trente lignes, bien réparties. Pour aller plus loin, il manque que chaque ligne soit nécessaire.",
     "Ta lettre fait ses trente lignes, bien réparties. Pour aller plus loin, il manque que chaque ligne soit nécessaire, ce que n'est pas encore {CIT}."),
  ],
  [
    ("Ta lettre fait ses trente lignes, et aucune n'est de trop.",
     "Ta lettre fait ses trente lignes, et aucune n'est de trop, pas même {CIT}."),
    ("Tes trente lignes sont pleines : chaque paragraphe prend le temps de se déployer.",
     "Tes trente lignes sont pleines : chaque paragraphe prend le temps de se déployer, comme quand tu écris {CIT}."),
    ("Tes trente lignes sont bien employées : le concret, le plus dur et l'inquiétude pour l'autre ont chacun la place qu'ils méritent.",
     "Tes trente lignes sont bien employées, comme quand tu écris {CIT} : le concret, le plus dur et l'inquiétude pour l'autre ont chacun la place qu'ils méritent."),
    ("Tes trente lignes sont tenues de bout en bout, sans délayer ni précipiter : la lettre a la longueur juste de ce qu'elle a à dire.",
     "Tes trente lignes sont tenues de bout en bout, sans délayer ni précipiter, comme quand tu écris {CIT} : la lettre a la longueur juste de ce qu'elle a à dire."),
  ],
])

# ───────────────────────── 4 · La langue (6)
# Orthographe : les quatre niveaux et les seize sous-niveaux de la grille Dugain (imagination), mot pour mot,
# sauf la phrase sur le DNB (cette lettre n'est pas l'épreuve) — à relire par Paul.
dorth = next(i for c in dug["G"]["imagination"]["criteres"] for i in c["indicateurs"] if i["id"] == "orthographe")
desc_orth = list(dorth["descripteurs"])
desc_orth[0] = "{prenom}, ton orthographe et ta grammaire sont très fragiles. Les erreurs sont nombreuses et gênent la lecture de ta lettre."
sous_orth = [[(s["sans"], s["avec"]) for s in e] for e in dug["S"]["expression"]["orthographe"]]
orth = ind("orthographe", "Orthographe et grammaire", 4, "c4-langue-01", desc_orth, sous_orth)

dlex = next(i for c in dug["G"]["imagination"]["criteres"] for i in c["indicateurs"] if i["id"] == "lexique")
sous_lex = [[(s["sans"], s["avec"]) for s in e] for e in dug["S"]["expression"]["lexique"]]
# les phrases propres au récit de Marguerite, adaptées à la lettre
def rep(e, j, sans, avec): sous_lex[e][j] = (sans, avec)
rep(0, 1, "Ton vocabulaire est très pauvre : tu emploies sans cesse des mots vagues et passe-partout, et tu ne cherches pas à varier ni à préciser. Ta lettre reste floue.",
          "Ton vocabulaire est très pauvre, comme quand tu écris {CIT}. Tu emploies des mots vagues qui ne disent rien de précis.")
rep(0, 2, "Tu utilises un vocabulaire trop familier pour une lettre écrite : termes de conversation, expressions d'aujourd'hui.",
          "Tu utilises un vocabulaire trop familier pour une lettre écrite, comme quand tu écris {CIT}.")
rep(1, 0, "Ton vocabulaire est juste mais pauvre : tu emploies un mot courant là où un mot plus précis ferait l'affaire. Ta lettre reste plate.",
          "Ton vocabulaire est juste mais pauvre, comme quand tu écris {CIT} : un mot plus précis aurait donné plus de force à la phrase.")
rep(1, 3, "Ton lexique est globalement correct mais il manque encore de précision sur ce que tu vois et ce que tu ressens. Quelques mots plus exacts enrichiraient nettement ta lettre.",
          "Ton lexique est globalement correct mais il manque encore de précision. On le voit quand tu écris {CIT} : un mot plus exact ferait toute la différence.")
rep(2, 1, "Tu emploies un lexique adapté au sujet et à l'époque : ton vocabulaire de la guerre, du front ou de la vie à l'arrière est correct et juste. Le champ lexical est mobilisé.",
          "Tu emploies un lexique adapté au sujet et à l'époque, comme quand tu écris {CIT}. Le champ lexical de la guerre est mobilisé.")
rep(2, 2, "Ton vocabulaire est varié et tu places par endroits des mots recherchés ou imagés qui donnent du relief à ta lettre. Tu cherches le mot juste plutôt que le mot habituel.",
          "Ton vocabulaire est varié et tu places par endroits des mots recherchés ou imagés, comme quand tu écris {CIT}. Tu cherches le mot juste plutôt que le mot habituel.")
rep(3, 1, "Tu emploies un lexique nuancé qui restitue finement les sensations et les émotions : tu ne dis pas « peur » mais l'inquiétude ou l'effroi ; pas « bruit » mais le crissement ou le grondement. Ta lettre gagne en épaisseur.",
          "Tu emploies un lexique nuancé qui restitue finement les sensations, comme quand tu écris {CIT} : le mot choisi est exactement celui qui dit la sensation, pas le mot général.")
rep(3, 3, "Ton vocabulaire est exactement celui qu'il fallait : précis, nuancé, parfois imagé, toujours adapté. Chaque mot est choisi, pas simplement employé. La langue est au service de ta lettre de bout en bout.",
          "Ton vocabulaire est exactement celui qu'il fallait : précis, nuancé, parfois imagé, toujours adapté. Quand tu écris {CIT}, on sent que chaque mot a été cherché et choisi.")
lex = ind("lexique", "Lexique", 2, "c4-langue-03", list(dlex["descripteurs"]), sous_lex)

sujet = {
  "format": "mjpc-redaction-sujet/1",
  "id": "lettre-grande-guerre-3e",
  "titre": "Écrire une lettre de la Grande Guerre",
  "niveau": "3e",
  "chapitre": "Chapitre 1 — J'ai été dans les tranchées · tâche finale",
  "competences_sujet": ["c4-ecrire-03", "c4-langue-04"],
  "enonce": [
    "Une lettre de trente lignes, notée sur 40 points comme la rédaction du brevet. Tu l'écris en classe, en une heure.",
    "Tu choisis : la lettre de l'homme au front, ou celle de la personne qui lui répond depuis la maison. Le choix est libre — un garçon peut écrire la lettre de celle qui attend, une fille celle du soldat.",
    "Toutes tes phrases sont des phrases complexes.",
    "Les cinq architectures ci-dessous apparaissent chacune au moins une fois. Si tu utilises ces architectures plusieurs fois, ce sera valorisé (la valorisation = ce qui démarque ta copie d'une copie qui fait le strict minimum).",
  ],
  "total": 40,
  "longueur": "trente_lignes",
  "compteur": {
    "indicateur": "orthographe",
    "selon": "trente_lignes",
    "seuils": {"3": [3, 8, 16], "2": [3, 7, 14], "1": [2, 5, 9], "0": [1, 2, 5]},
    "lecture": "pour chaque niveau de « Trente lignes » : [jusqu'à n erreurs = Très satisfaisant, jusqu'à n = Satisfaisant, jusqu'à n = Fragile] ; au-delà = Insuffisant — les seuils de Dugain ramenés à une lettre deux fois plus courte"
  },
  "criteres": [
    {"id": "theme_invention", "titre": "Le thème et l'invention", "pts_max": 14, "indicateurs": [theme, paragraphes, lectures, tait]},
    {"id": "construction", "titre": "La construction des phrases", "pts_max": 14, "indicateurs": [complexes, architectures, modal]},
    {"id": "lettre", "titre": "L'organisation et la lettre", "pts_max": 6, "indicateurs": [codes, personne, lignes]},
    {"id": "langue", "titre": "La langue", "pts_max": 6, "indicateurs": [orth, lex]},
  ],
}

# vérifications
assert sum(c["pts_max"] for c in sujet["criteres"]) == sujet["total"] == 40
for c in sujet["criteres"]:
    assert sum(i["poids"] for i in c["indicateurs"]) == c["pts_max"], c["id"]
n = sum(4 + 32 for c in sujet["criteres"] for i in c["indicateurs"])
ids = [i["id"] for c in sujet["criteres"] for i in c["indicateurs"]]
assert len(ids) == len(set(ids))
json.dump(sujet, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print("indicateurs", len(ids), "phrases", n)
