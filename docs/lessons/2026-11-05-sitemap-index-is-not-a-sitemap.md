# El sitemap de Astro es un índice, no un sitemap

## Qué pasó

Se instaló `@astrojs/sitemap` esperando obtener `dist/sitemap.xml`, que es la
URL que anuncian `robots.txt` y Google Search Console desde hace años. La
integración genera `sitemap-index.xml` y `sitemap-0.xml`. El build era correcto
y el fichero existía, pero en otra ruta: `/sitemap.xml` habría devuelto 404 en
producción.

## Mecanismo

La integración asume el formato de índice de sitemaps para poder paginar cuando
hay más de 50 000 URLs o varios sitemaps. En un sitio de cinco páginas el índice
es una indirección innecesaria, y cambiar la URL publicada habría roto la
referencia de `robots.txt` y el envío ya hecho a Search Console.

## Qué lo impide ahora

`src/pages/sitemap.xml.ts` genera el sitemap directamente, con las cinco URLs
sin barra final y su `lastmod`. `scripts/check-dist.mjs` comprueba que
`dist/sitemap.xml` existe, que tiene exactamente esas cinco `<loc>` y cinco
`<lastmod>`, y `tests/routes.spec.ts` que responde 200.
