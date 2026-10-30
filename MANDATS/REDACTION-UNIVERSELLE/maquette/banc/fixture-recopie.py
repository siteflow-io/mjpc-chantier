# Six lignes inventées : deux mots, rature, pente et grand blanc ; aucune copie réelle.
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).parent
page = Image.new("RGB", (1240, 1754), (250, 249, 244))
draw = ImageDraw.Draw(page)
font_path = subprocess.check_output(["fc-match", "-f", "%{file}", "serif:style=Italic"], text=True).strip()
font = ImageFont.truetype(font_path, 32)
for y in range(230, 1700, 50):
    draw.line((45, y, 1200, y), fill=(203, 214, 232), width=2)
draw.line((150, 70, 150, 1700), fill=(225, 128, 128), width=3)
lines = [
    (200, "Une première ligne, tout simplement."),
    (250, "Deux mots"),
    (300, "Ce morceau barré reste dans la copie."),
    (650, "Cette ligne monte un tout petit peu."),
    (700, "Après le grand blanc, on continue."),
    (750, "Fin ici"),
]
for i, (y, text) in enumerate(lines):
    if i == 3:
        layer = Image.new("RGBA", (940, 65))
        ImageDraw.Draw(layer).text((0, 5), text, font=font, fill=(38, 56, 150, 255))
        layer = layer.rotate(1.2, resample=Image.Resampling.BICUBIC, expand=False)
        page.paste(layer, (180, y - 5), layer)
    else:
        draw.text((180, y), text, font=font, fill=(38, 56, 150))
draw.line((230, 318, 510, 323), fill=(38, 56, 150), width=3)
page.save(root / "recopie-lignes-essai.png")
print("Fixture : 6 lignes inventées, dont deux lignes de deux mots.")
