from pathlib import Path
import re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
root = Path(__file__).resolve().parent.parent
font = TTFont(root / 'public/fonts/LobsterTwo-Italic.ttf')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
parts = ['<svg viewBox="0 0 600 350" role="img" aria-label="Resep Nurolanda"><title>Resep Nurolanda</title>']
index = 0
for word, baseline, width in [('Resep', 140, 275), ('Nurolanda', 290, 490)]:
    advance = sum(glyphs[cmap[ord(c)]].width for c in word)
    scale = width / advance
    x = (600 - width) / 2
    for char in word:
        glyph = glyphs[cmap[ord(char)]]
        pen = SVGPathPen(glyphs)
        glyph.draw(pen)
        parts.append(f'<path class="signature-letter" d="{pen.getCommands()}" transform="translate({x:.2f} {baseline}) scale({scale:.5f} {-scale:.5f})" pathLength="1" vector-effect="non-scaling-stroke" style="--letter-delay:{index * .077:.3f}s"/>')
        x += glyph.width * scale
        index += 1
parts.append('</svg>')
page = root / 'index.html'
html = page.read_text(encoding='utf-8')
html = re.sub(r'(<div class="intro-signature">).*?(</div>)', lambda m: m[1] + ''.join(parts) + m[2], html, count=1, flags=re.S)
page.write_text(html, encoding='utf-8')
