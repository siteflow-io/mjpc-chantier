# des repères numérotés sur chaque capture, et la légende sous l'image
from PIL import Image, ImageDraw, ImageFont
import textwrap
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf', 19); FB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', 22); FN = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
def legender(src, dst, titre, reperes, legendes):
    im = Image.open(src).convert('RGB'); W, H = im.size
    d = ImageDraw.Draw(im)
    for n, (x, y) in enumerate(reperes, 1):
        r = 18; d.ellipse((x - r, y - r, x + r, y + r), fill=(201, 154, 78), outline=(20, 16, 12), width=3); tw = d.textlength(str(n), font=FN); d.text((x - tw / 2, y - 13), str(n), font=FN, fill=(20, 16, 12))
    lignes = []
    for n, t in enumerate(legendes, 1):
        for i, l in enumerate(textwrap.wrap(t, 118)): lignes.append((n if i == 0 else None, l))
    bandeau = 54 + 30 * len(lignes) + 16
    out = Image.new('RGB', (W, H + bandeau), (15, 13, 11)); out.paste(im, (0, 0)); d = ImageDraw.Draw(out)
    d.rectangle((0, H, W, H + bandeau), fill=(23, 19, 16)); d.line((0, H, W, H), fill=(201, 154, 78), width=2)
    d.text((28, H + 14), titre, font=FB, fill=(224, 196, 140))
    y = H + 54
    for n, l in lignes:
        if n: r = 13; d.ellipse((30 - r, y + 12 - r, 30 + r, y + 12 + r), fill=(201, 154, 78)); tw = d.textlength(str(n), font=FN); d.text((30 - tw / 2 - 1, y + 1), str(n), font=FN, fill=(20, 16, 12))
        d.text((56, y), l, font=F, fill=(236, 228, 214)); y += 30
    out.save(dst)
legender('vis/T145-A.png', 'vis/L-A.png', 'A — « Où on en est » : les durées par activité, modifiables en direct, avec les états de worktrack',
    [(1168, 104), (1200, 128), (1400, 128), (1290, 265), (1300, 566)],
    ["Le chiffre des minutes de chaque activité : tu le changes pendant le cours, les heures de début de la suite se recalent.",
     "L'heure prévue de début, calculée en cumulant depuis le début de l'heure ; la ligne en cours en gras, les faites barrées.",
     "L'état de worktrack, en pastille : terminée · dans les temps · il te reste peu de temps (80 %) · tu dépasses (+4 min) — les deux derniers pulsent.",
     "La fin d'heure, dernière ligne : ses 5 minutes sont réservées, elle ne se décale jamais.",
     "La participation reste dessous, inchangée ; l'en-tête garde prévu / utile / dépasse. Tout tient sans défilement."])
legender('vis/T145-B.png', 'vis/L-B.png', 'B — l\'alerte T-5, non bloquante (sur le modèle de worktrack) — emplacement montré non retenu',
    [(270, 76), (350, 100), (620, 104), (745, 104), (400, 300)],
    ["« T-5 — il reste 5 minutes » : une alerte au pilotage seulement, jamais au tableau des élèves.",
     "L'activité en cours et son état (« tu dépasses de 4 min ») ; la diapo de fin attend.",
     "« Aller à la fin d'heure » : c'est toi qui y vas, quand l'activité est finie — jamais de coupure devant la classe.",
     "« Plus tard » : l'alerte se replie, elle reste rappelable ; le tableau ne bouge pas.",
     "Ici elle recouvre le titre de la diapo : je la propose dans la colonne de droite, au-dessus de « Où on en est »."])
legender('vis/T145-C.png', 'vis/L-C.png', 'C — la diapo de fin d\'heure, une vraie diapo, dévoilée jusqu\'au travail à faire',
    [(430, 117), (700, 148), (660, 248), (560, 320), (790, 335), (660, 563), (560, 627), (1290, 130)],
    ["L'étiquette de la diapo : « Fin d'heure — lundi 14 septembre, 15 h 07 – 16 h 02 » ; elle est dans le volet, dernière de l'heure.",
     "L'agenda École Directe reconnaissable (bandeau, cahier de textes, onglets), en Garamond comme le site.",
     "1er élément dévoilé : « PRENEZ VOS AGENDAS — POUR MERCREDI 9 SEPTEMBRE », en gros, qui pulse — pour taire « c'est pour quand ? ».",
     "2e élément : le travail à faire, avec en tête « déjà donné pour cette date » (par toi, pour cette classe), puis celui de l'heure ; tu écris dedans directement.",
     "« Donné le 14 septembre par M. MENEY P. » : ce que les élèves retrouveront chez eux.",
     "3e élément, encore voilé (comme un élément non dévoilé) : la participation avec ses métas.",
     "Les mêmes outils que pour toute diapo : gel, lumière, surlignage, pages, taille, ▶ élément par élément.",
     "Le volet et la colonne de droite ne changent pas."])
legender('vis/T145-D.png', 'vis/L-D.png', 'D — la même diapo, onglet « Contenus de séances » : le récit de l\'heure en trois temps',
    [(395, 150), (330, 285), (330, 375), (330, 470), (620, 233), (1290, 130)],
    ["L'onglet « Contenus de séances » cliqué (au centre, ou depuis la colonne) : le tableau montre le récit.",
     "« Au début de l'heure, on a commencé par… » : tout ce qui s'est passé dans les dix premières minutes.",
     "« Puis, au milieu de l'heure, on a continué… » (25e-35e minute) ; l'activité qui se poursuit est reprise, jamais coupée.",
     "« Enfin, à la fin de l'heure, on a fait… Et on l'a terminée / mais on ne l'a pas terminée / tout juste commencée. »",
     "« figé, modifiable » : le même mécanisme que la relecture — figé, tu corriges dedans ; une seule source pour le récit.",
     "Le volet et la colonne inchangés ; l'entre-temps est raconté sans repère (« ensuite… »)."])
legender('vis/T145-E.png', 'vis/L-E.png', 'E — la colonne de droite en fin d\'heure : tout ce que tu as à cliquer, dans l\'ordre, en sections repliées',
    [(1200, 98), (1296, 164), (1200, 194), (1190, 318), (1296, 402), (1200, 506), (1200, 602), (660, 300)],
    ["1 · L'échéance — faite (mercredi 9 septembre), repliée sur une ligne-résumé ; « prenez vos agendas » est au tableau.",
     "La flèche de dévoilement : tu ouvres la section suivante quand la précédente est faite.",
     "2 · Ce qui reste, et les notions — ouverte : une carte par activité restante avec ses diapos et sa décision.",
     "Les cases : ce que la trame prévoyait, les notions (seulement les nouvelles) ; chaque case cochée ou décochée se voit au tableau.",
     "Flèche grise : la suivante n'est pas encore ouverte.",
     "3 · Avant de clore — verser les diapos modifiées, garder les notes, un mot pour les absents.",
     "4 · Clore l'heure — le journal, le récit, le travail à faire, le mot des absents sont enregistrés.",
     "Au centre, la diapo de fin telle que les élèves la voient, où tu écris le travail à faire."])
legender('vis/T147-chapitre-plein-ecran.png', 'vis/L-F.png', 'F — la Relecture, sixième face « Le chapitre » : le tracé des travaux à faire, ce qui manquait, ce qui était en trop',
    [(982, 152), (700, 330), (1150, 330), (450, 615), (990, 660), (450, 700)],
    ["La face « Le chapitre », à côté des récits d'heure et de la séance : calculée des journaux des heures closes, les heures à venir lues dans la trame.",
     "1 · Le tracé des travaux à faire : une ligne par heure — donné le, pour le, ce qui est parti dans École Directe (le texte tel quel).",
     "« Déjà donné pour cette date » : ce que tu avais déjà donné pour la même échéance ; copiable pour École Directe.",
     "2 · Parti à la maison ou reporté — le chapitre était trop plein : activité par activité, temps prévu contre temps passé, ton motif, le compte.",
     "Ce qui manquait — ajouté pendant l'heure, absent de la trame : notions imprévues, réponses gardées, notes versées, diapos modifiées et leur sort.",
     "3 (plus bas, en défilant) · Les notions du chapitre : prévue où, travaillée quand, donnée à apprendre quand ; les imprévues, les non travaillées."])
print("légendées")
