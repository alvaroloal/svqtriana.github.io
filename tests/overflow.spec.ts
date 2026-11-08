import { test, expect } from '@playwright/test';

/*
 * Nada se sale del ancho de la pantalla en móvil, tampoco con la letra del
 * sistema ampliada. Ver docs/lessons/2026-11-08-grid-column-grows-to-longest-word.md.
 */
const PAGES = ['/', '/nosotros', '/productos', '/media', '/encuentro'];
const CASES = [
  { width: 320, fontScale: 100 },
  { width: 360, fontScale: 100 },
  { width: 360, fontScale: 130 },
  { width: 320, fontScale: 130 },
];

for (const { width, fontScale } of CASES) {
  test.describe(`${width}px con la letra al ${fontScale} %`, () => {
    test.use({ viewport: { width, height: 800 } });

    for (const path of PAGES) {
      test(`${path} no se sale de la pantalla`, async ({ page }) => {
        await page.goto(path);
        if (fontScale !== 100) {
          await page.addStyleTag({ content: `html { font-size: ${fontScale}%; }` });
        }

        const overflowing = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          const hits: string[] = [];
          for (const element of document.querySelectorAll<HTMLElement>('body *')) {
            // Los carruseles de producto se desplazan en horizontal a propósito.
            if (element.closest('svg, [aria-hidden="true"], [data-gallery]')) continue;
            const rect = element.getBoundingClientRect();
            if (rect.width === 0) continue;
            if (rect.right > viewport + 1 || rect.left < -1) {
              const text = (element.textContent ?? '').trim().slice(0, 40);
              hits.push(`<${element.tagName.toLowerCase()}> ${Math.round(rect.right)}px «${text}»`);
            }
          }
          return hits;
        });

        expect(overflowing, `Elementos fuera de ${width}px:\n${overflowing.join('\n')}`).toEqual([]);
      });
    }
  });
}
