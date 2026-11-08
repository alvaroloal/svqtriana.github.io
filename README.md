# svqtriana.com

Web de la **Peña Sevillista SVQ Triana**, peña sevillista fundada el 27 de julio
de 2019 en el barrio de Triana, Sevilla.

Sitio estático generado con **Astro 7** y **Tailwind CSS v4**, publicado en
GitHub Pages y servido a través de Cloudflare. Sin framework de UI, sin jQuery y
sin scripts de terceros.

## Puesta en marcha

Requiere **Node 24 LTS** (Astro 7.4 exige `>=22.23.4`; el proyecto fija 24 en
`.nvmrc` y en `engines`).

```sh
npm ci
npm run dev        # http://localhost:4321
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga. |
| `npm run build` | Genera `dist/` con las 5 páginas, `404.html`, `sitemap.xml` y `llms.txt`. |
| `npm run preview` | Sirve `dist/` como lo haría Astro. |
| `npm run check` | `astro check`: tipos y diagnósticos. |
| `npm run check:dist` | Invariantes sobre `dist/` (títulos, canonical, JSON-LD, assets, CSP, versión). |
| `npm run test:e2e` | Playwright: accesibilidad, menú móvil, mapa, rutas y desbordes en móvil. |
| `npm run test:lighthouse` | Lighthouse CI móvil sobre `dist/`. |
| `npm run verify` | `check` + `build` + `check:dist` + `test:e2e`. |

`npm run preview` (y `scripts/serve-dist.mjs`, que usan las pruebas) resuelven
`/nosotros` como `nosotros.html`, igual que GitHub Pages.

## Estructura

| Ruta | Qué es |
|---|---|
| `src/pages/` | Las cinco páginas, `404.astro`, `sitemap.xml.ts` y `llms.txt.ts`. |
| `src/layouts/BaseLayout.astro` | `<head>` común, cabecera, pie y el único script del sitio. |
| `src/components/` | Cabecera, navegación móvil, pie, tarjetas, galerías, línea de tiempo y motivos decorativos. |
| `src/data/` | Todo el contenido literal: web, temporada, productos, vídeos, historia, encuentro, JSON-LD. |
| `src/assets/` | Maestros de imagen que procesa `astro:assets` (AVIF + WebP). |
| `src/styles/global.css` | Tokens de Tailwind v4, tipografías y utilidades propias. |
| `src/scripts/nav.ts` | Menú móvil, galerías de producto y mapa bajo demanda. |
| `public/` | Ficheros que se sirven tal cual: `CNAME`, `ads.txt`, `robots.txt`, `sw.js`, iconos, fuentes y la imagen OG. |
| `tests/` | Playwright: `a11y`, `mobile-nav`, `map`, `routes`, `overflow`. |
| `scripts/` | `check-dist.mjs`, `serve-dist.mjs` y `convert-pulsera.mjs`. |
| `infra/cloudflare/` | Headers, caché y analítica como Terraform. |
| `docs/` | Runbooks y lecciones. |

## El trabajo de temporada

Una vez al año cambia el cartel. Es casi todo el mantenimiento que necesita el
sitio: [`docs/runbooks/maintenance.md`](docs/runbooks/maintenance.md).

## Comprobaciones

```sh
npm run verify
terraform -chdir=infra/cloudflare validate
```

El CI (`.github/workflows/checks.yml`) ejecuta tipos, build, invariantes de
`dist/`, Playwright, Lighthouse y `terraform validate`. **Ahora mismo está
desactivado**, igual que `deploy.yml`: los dos solo se lanzan a mano desde la
pestaña Actions. Ejecuta `npm run verify` en local antes de publicar. Cómo
reactivarlos está en el comentario de cada workflow.
Cada comprobación existe porque algo se rompió de verdad en el sitio anterior.

`npm audit --omit=dev` sale limpio: lo que se publica son ficheros estáticos,
sin dependencias en tiempo de ejecución. Los avisos que muestra `npm audit`
completo viven en la cadena de `@lhci/cli` → `lighthouse` → `puppeteer-core` y
solo afectan a la máquina que ejecuta las pruebas, no al sitio.

## Compartir el MVP sin tocar producción

Este repositorio **no se ha desplegado**. Para enseñarlo al DevOps y a quien
administra la web hay una vía aislada en Cloudflare Pages (plan gratis), con
URL `*.pages.dev`, `noindex` y la CSP real de producción:

```sh
npx --yes wrangler@4 login
npx --yes wrangler@4 pages project create svqtriana-mvp --production-branch mvp
npm ci
npm run preview:cf
```

`npm run preview:cf` construye, comprueba, prepara `dist/` y publica. No hace
falta un `npm run build` aparte.

Instrucciones completas, alternativa con GitHub y checklist de revisión:
[`docs/runbooks/preview-cloudflare.md`](docs/runbooks/preview-cloudflare.md).
No cambia DNS, ni la zona de `svqtriana.com`, ni el Pages de producción.

## Trampas

Cosas que parecen errores y no lo son, o que parecen inocuas y no lo son.

- **`build.format: 'file'` no es un capricho.** Genera `dist/nosotros.html`, que
  GitHub Pages sirve como `/nosotros` sin barra final. Con el formato por
  defecto (`directory`) las URLs canónicas y el sitemap acabarían con barra, y
  el sitio anterior no las tenía.
- **`sw.js` sigue publicado aunque la web no registre ningún service worker.**
  Es el kill-switch del worker antiguo: desregistra, borra las cachés
  `svq-triana-*` y recarga. Debe seguir en la raíz al menos seis meses después
  del corte. Ver [`docs/root-files.md`](docs/root-files.md).
- **Nada de `<script>` inline ejecutable.** La CSP de Cloudflare no lleva
  `'unsafe-inline'`, así que Astro compila a ficheros externos
  (`inlineStylesheets: 'never'` y `vite.build.assetsInlineLimit: 0`).
  `check:dist` falla si vuelve a aparecer uno. El JSON-LD sí va inline: es
  `application/ld+json`, no se ejecuta y la CSP no lo bloquea.
- **Tampoco `style=""`.** `check:dist` lo prohíbe; por eso `style-src` puede ir
  sin `'unsafe-inline'`.
- **El mapa de Google no está en el HTML.** Se inyecta al pulsar «Ver mapa»
  desde `src/scripts/nav.ts`. La CSP permite el iframe, pero no se pide nada a
  Google al cargar la página.
- **Los vídeos son enlaces, no embeds.** Sin iframes de YouTube no hay cookies
  de terceros ni `frame-src` para youtube.com.
- **La versión del pie sale de `CHANGELOG.md`.** `version.ts` lee
  `PUBLIC_SITE_VERSION` (lo fija `deploy.yml`) o, en local, la primera entrada
  `## vYYYYMMDD`. Si no coinciden, `check:dist` falla.
- **`compressHTML` está activo por defecto.** No lo desactives para «arreglar»
  el HTML: cambia el espaciado, no el DOM, y solo hincha el fichero.
- **Las rutas distinguen mayúsculas en producción.** En Windows/macOS no. Un
  asset que resuelve en local puede dar 404 en Pages solo por la caja.
- **Los headers vienen de Cloudflare, no del repo.** GitHub Pages no puede
  enviarlos. Están en `infra/cloudflare/` y se aplican con Terraform.

## Dónde están las decisiones

- [`docs/root-files.md`](docs/root-files.md) — por qué ciertos ficheros van en `public/` y por qué `sw.js` sigue ahí.
- [`docs/lessons/_index.md`](docs/lessons/_index.md) — qué falló, el mecanismo y qué lo detecta ahora.
- [`docs/runbooks/maintenance.md`](docs/runbooks/maintenance.md) — los trabajos recurrentes.
- [`infra/cloudflare/README.md`](infra/cloudflare/README.md) — por qué los headers viven en el edge.
- [`CHANGELOG.md`](CHANGELOG.md) — qué cambia en cada despliegue.
