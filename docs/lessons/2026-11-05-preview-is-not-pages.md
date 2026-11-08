# La preview de Astro no es GitHub Pages

## Qué pasó

Las primeras pruebas de Playwright arrancaban `astro preview`. Un servidor de
preview que ya estaba en el puerto 4321 hizo que Playwright reutilizara el
proceso (`reuseExistingServer`) y probara un `dist/` anterior. Además, la
preview no resuelve rutas desconocidas igual que Pages: `/404` devolvía 200
porque el fichero `404.html` existe y se sirve sin extensión, de modo que la
prueba de "ruta inexistente" pasaba sin probar nada.

## Mecanismo

La preview es un servidor de desarrollo, no el de producción. GitHub Pages
resuelve `/nosotros` a `nosotros.html` y sirve `404.html` con estado 404 para
cualquier ruta que no exista; la preview tiene su propia lógica de fallback y de
estado. Probar contra ella valida el generador, no el hosting.

## Qué lo impide ahora

`scripts/serve-dist.mjs` imita a Pages: extensión opcional, `index.html` para
directorios, `dist/404.html` con estado 404 y sin redirecciones. Lo usan
`playwright.config.ts` y `lighthouserc.json`. `tests/routes.spec.ts` prueba
`/esta-pagina-no-existe`, no `/404`, precisamente para que el estado tenga que
ser 404 de verdad.
