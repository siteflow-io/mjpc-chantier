# Un paquet d'essai, inventé de bout en bout (aucune copie d'élève) : des lettres écrites à la machine en italique bleu,
# sur un papier ligné à marge rouge, comme sorties du photocopieur. Sert au banc et à Paul pour jouer sans son paquet.
from PIL import Image, ImageDraw, ImageFont
import random, sys
random.seed(7)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerifCondensed-Italic.ttf', 30)
W, H, M, PAS, Y0 = 1240, 1754, 170, 48, 190
TEXTE = """Le 12 mars 1916, dans la tranchée de Vauquois
Ma chère Louise,
je t'écrit ces quelques mots avant la relève du soir. Nous sommes
dans une tranchée qui sent la boue et le froid, et que je ne
quitte plus depuis trois semaines. Ce qui est le plus dur, ce
n'est pas le bruit des obus, que l'on finit par ne plus entendre,
c'est la boue qui colle aux jambes et qui ne sèche jamais.
Je pense souvent à la ferme, que tu tiens seule maintenant,
et aux bêtes dont tu dois t'occuper avant le jour.
Comment va notre petit Jean, qui doit marcher maintenant ?
Est-ce que la récolte de l'automne a suffit pour l'hiver ?
Je ne te dis pas tout, ma Louise, et tu le sais bien.
Ici, les hommes que je connaissais ne sont pas tous revenus,
mais je préfère te parler du soleil qui se lève sur les barbelés.
Il me semble parfois que le temps s'est arrêté, que les jours
se ressemble tous, que la guerre ne finira jamais.
Le lieutenant, qui nous parle peu, nous a promis une permission
pour le printemps, que j'attends comme on attend la pluie.
Je garde ta photographie dans la poche de ma vareuse, contre
mon cœur, et je la regarde chaque soir avant de dormir.
Écris-moi vite, dis-moi si le froid n'est pas trop dur,
si le bois que j'avais coupé suffit encore pour la cheminée.
Je t'embrasse comme je t'aime, c'est-à-dire beaucoup.
Ton Pierre""".split('\n')
def page(lignes, nom=None):
    im = Image.new('RGB', (W, H), (250, 249, 244)); d = ImageDraw.Draw(im)
    for k in range(0, 34): y = Y0 + k * PAS + 14; d.line([(40, y), (W - 40, y)], fill=(196, 208, 228), width=2)
    d.line([(M - 20, 60), (M - 20, H - 40)], fill=(226, 120, 120), width=3)
    y = Y0
    if nom: d.text((W - 420, 90), nom, font=F, fill=(40, 55, 140))
    for i, t in enumerate(lignes):
        x = M + (40 if i in (1, 2) else 0) + random.randint(-4, 4); d.text((x, y - 18 + random.randint(-2, 2)), t, font=F, fill=(38, 56, 150)); y += PAS
    return im.rotate(random.uniform(-0.6, 0.6), fillcolor=(250, 249, 244), resample=Image.BICUBIC)
noms = sys.argv[2].split('|')
P = []
for i, nom in enumerate(noms):
    L = TEXTE[:]; random.shuffle(L[3:20]) if i % 2 else None
    if i == 2: P += [page(L[:14], nom), page(L[14:])]
    else: P.append(page(L if i != 4 else L[:17], nom))
    if i == 1: P.append(Image.new('RGB', (W, H), (250, 249, 244)))   # une page blanche glissée dans le paquet
P[0].save(sys.argv[1], save_all=True, append_images=P[1:], resolution=150)
print(sys.argv[1], len(P), 'pages')
