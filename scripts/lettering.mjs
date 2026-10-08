// Pacifico pen strokes from Vara, positioned once so production needs no font fetch.
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const root = new URL('../', import.meta.url);
const font = JSON.parse((await readFile(new URL('scripts/handwriting-font.json', root), 'utf8')).replace(/^\uFEFF/, ''));
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  const svg = await page.evaluate(({ glyphs }) => {
    const ns = 'http://www.w3.org/2000/svg';
    const make = (tag, attrs, parent) => {
      const node = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
      parent.append(node);
      return node;
    };
    const svg = make('svg', { id: 'handwriting', viewBox: '0 0 600 350', role: 'img', 'aria-label': 'Resep Nurolanda' }, document.body);
    make('title', {}, svg).textContent = 'Resep Nurolanda';
    for (const [word, baseline, width] of [['Resep', 120, 300], ['Nurolanda', 305, 500]]) {
      const group = make('g', { 'data-word': word }, svg);
      let cursor = 0;
      let last;
      for (const letter of word) {
        const glyph = make('g', {}, group);
        const paths = glyphs[letter].paths.map(({ d, mx, my }) => make('path', {
          d, transform: `translate(${mx} ${-my})`, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.3,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        }, glyph));
        const box = glyph.getBBox();
        const x = cursor - box.x;
        glyph.setAttribute('transform', `translate(${x} 0)`);
        const first = glyphs[letter].paths[0];
        const start = { x: x + first.mx, y: -first.my };
        if (last) {
          const middle = (last.x + start.x) / 2;
          const connector = make('path', {
            d: `M${last.x} ${last.y} C${middle} ${last.y} ${middle} ${start.y} ${start.x} ${start.y}`,
            fill: 'none', stroke: 'currentColor', 'stroke-width': 1.3, 'stroke-linecap': 'round',
          }, group);
          group.insertBefore(connector, glyph);
        }
        const endPath = paths.at(-1);
        const end = endPath.getPointAtLength(endPath.getTotalLength());
        const offset = glyphs[letter].paths.at(-1);
        last = { x: x + offset.mx + end.x, y: -offset.my + end.y };
        cursor += box.width;
      }
      const box = group.getBBox();
      const scale = width / box.width;
      group.setAttribute('transform', `translate(${(600 - width) / 2 - box.x * scale} ${baseline}) scale(${scale})`);
    }
    return svg.outerHTML;
  }, font);
  const htmlPath = new URL('index.html', root);
  const html = await readFile(htmlPath, 'utf8');
  await writeFile(htmlPath, html.replace(/(<div class="intro-signature">).*?(<\/div>)/s, (_, before, after) => before + svg + after));
} finally {
  await browser.close();
}
