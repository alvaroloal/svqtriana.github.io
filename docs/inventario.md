# Inventario verificado del sitio legado

Fecha: 2026-11-05. Fuente de verdad: clon de `svqtriana.github.io` en
`../svqtriana.github.io` (rama `main`, commit `ccad68d`). Este documento fija lo que la
migración debe conservar; cualquier duda se resuelve contra el HTML legado, no contra este
resumen.

## Rutas y metadatos

| Ruta | Fichero legado | Indexable | `<title>` | Canonical / `og:url` |
|---|---|---|---|---|
| `/` | `index.html` | sí | `PS SVQ Triana \| Peña sevillista de Triana, Sevilla` | `https://svqtriana.com/` |
| `/nosotros` | `nosotros.html` | sí | `Nuestra historia \| PS SVQ Triana` | `https://svqtriana.com/nosotros` |
| `/productos` | `productos.html` | sí | `Material oficial \| PS SVQ Triana` | `https://svqtriana.com/productos` |
| `/media` | `media.html` | sí | `Galería de vídeos \| PS SVQ Triana` | `https://svqtriana.com/media` |
| `/encuentro` | `encuentro.html` | **sí desde la migración** (antes `noindex, follow`) | `Dónde nos vemos \| PS SVQ Triana` | `https://svqtriana.com/encuentro` |

Descripciones actuales (literales):

- **Home:** `Peña sevillista fundada el 27 de julio de 2019 en el barrio de Triana, Sevilla. Abierta la renovación y las nuevas altas de la temporada 26/27.`
- **Nosotros:** `Historia de PS SVQ Triana: peña sevillista fundada el 27 de julio de 2019 en Triana. Conoce nuestros orígenes, crecimiento y pasión sevillista.`
- **Productos:** `Material oficial de PS SVQ Triana: camisetas, banderas, bufandas, pegatinas y más. Peña sevillista de Triana con precios especiales para socios.` → **corregir**: las camisetas ya no están a la venta.
- **Media:** `Galería de vídeos de PS SVQ Triana: spots promocionales, pregones, desplazamientos y momentos especiales de nuestra peña sevillista.`
- **Encuentro:** `Punto de encuentro de PS SVQ Triana: Cervecería el Punto de Triana. Ven con nosotros a ver el Sevilla en nuestro local de referencia.`

OG/Twitter: `og:image` = `https://svqtriana.com/images/cartel-27.jpg` (1131×1600, JPEG),
`og:image:alt` = `Cartel oficial de la temporada 2026/2027 de PS SVQ Triana`,
`twitter:site` = `@ps_svqtriana1`, `og:locale` = `es_ES`, `og:site_name` = `PS SVQ Triana`.

Comunes: `theme-color` y `msapplication-TileColor` = `#df0606`, `google-adsense-account` =
`ca-pub-5217718596352992`, `author` = `SVQ Triana`, `referrer` =
`strict-origin-when-cross-origin`, manifest `images/site.webmanifest`.

## Identidad y datos compartidos

- Nombre: `PS SVQ Triana` (Peña Sevillista SVQ Triana).
- Fundación: `27 de julio de 2019`, Triana, Sevilla.
- Email: `svqtriana@gmail.com`; enlaces con `?subject=[WEB]`.
- Instagram: `https://www.instagram.com/ps_svqtriana/`.
- Facebook: `https://www.facebook.com/PS-SVQ-Triana-110014627020914`.
- X: `https://twitter.com/ps_svqtriana1`.
- TikTok: `https://www.tiktok.com/@p.s.svq.triana`.
- YouTube: `https://www.youtube.com/@svqtriana2090` (en `llms.txt`, no en el nav).
- Formulario de socio:
  `https://docs.google.com/forms/d/e/1FAIpQLSdJ7KOc7hi-vBmWrmMwsD1zKJmmoM0TmtUd1IQ3cx_eS69azA/viewform`.
- Versión legada: `v20260905`.

Nav legado: `INICIO` (`/#home`), `NUESTRA HISTORIA` (`/nosotros`), `MATERIAL` (`/productos`),
`GALERÍA` (`/media`) + iconos Instagram, Facebook, X, TikTok. **La migración añade `ENCUENTRO`
(`/encuentro`)** por decisión del responsable.

Footer: `Contacto`, X `@PS_SVQTRIANA1`, Instagram `@PS_SVQTRIANA`, email
`svqtriana@gmail.com`; `© {año} PS SVQ Triana - Todos los derechos reservados`;
`Desarrollado por @mlorentedev` (enlace a `https://github.com/mlorentedev`); versión enlazada a
`CHANGELOG.md`.

## Contenido por página

### `/` — Inicio

- H1: `TEMPORADA 26/27`.
- CTA: `HAZTE SOCIO` → formulario de Google (`aria-label="Formulario para hacerse socio de la peña"`).
- Cartel: `images/webp/cartel-27.webp`, `width=1080 height=1528`, `fetchpriority=high`.
- `alt` del cartel: `Cartel oficial de la temporada 2026/2027 de PS SVQ Triana: renovación 20€ (28€ con camiseta) y nueva alta 25€ (35€ con camiseta)`.
- Precios (también en `llms.txt`): renovación 20 € (28 € con camiseta); nueva alta 25 €
  (35 € con camiseta).
- JSON-LD: `SportsClub` (nombre, `alternateName`, descripción, URL, logo, imagen,
  `foundingDate` 2019-07-27, `foundingLocation`, `location`, `sameAs` Instagram/Facebook/Twitter,
  `sport`, `memberOf` Sevilla FC, `offers`).

### `/nosotros` — Nuestra historia

- H1: `¿QUIÉNES SOMOS?`.
- Texto íntegro en `nosotros.html` (líneas 108–144). Hitos verificables, sin inventar fechas:
  - `27 de julio de 2019`: fundación, tarde calurosa; grupo de WhatsApp y boca a boca.
  - ~`80 socios` en los primeros días de abono; primera bufanda.
  - Spot 19/20 (aprox. un mes de vida): compartido por el Sevilla FC en RRSS, TV y radio;
    duplicó socios; superó `150.000 visualizaciones` en un día; versos del poema en la bandera.
  - `230 socios` al cierre del primer año.
  - Primer viaje de la peña, `de forma clandestina al Villamarín`.
  - `I Pregón de Navidad` en `diciembre de 2019`.
  - Autobús a `Pamplona`; autobús a `Getafe`.
  - Pandemia; `Sorteo Solidario` para el Comedor Social de Triana; Spot 20/21.
  - Cierre literal: `Y aquí estamos con más fuerza que nunca. Igual que aquella tarde calurosa de julio.`
  - Pregunta final: `¿Quieres seguir escribiendo la historia con nosotros?`
- Fotos y `alt` actuales:
  - `derby19.webp` — `Aficionados de PS SVQ Triana en el derby sevillano de 2019`.
  - `getafe20.webp` — `Viaje de la peña al estadio del Getafe en 2020`.
  - `getafe20_2.webp` — `Más imágenes del viaje a Getafe en 2020`.
  - `comida19.webp` — `Comida de hermandad de la peña en 2019`.

### `/productos` — Material

Orden actual y datos:

1. **Bufanda oficial roja y negra** — Socio 10 €, No socio 12 €; imagen `bufanda`.
2. **Bandera oficial** — Socio 10 €, No socio 12 €; imagen `bandera`.
3. **Pulsera oficial** — 1 €; imágenes `pulsera2` (alt `Pulsera oficial de la peña`) y
   `pulsera` (alt `Pulsera oficial vista alternativa`).
4. **Pegatinas** — lote de 6 unidades, 1 €; imágenes `pegatina_escudo` (`Pegatina del escudo`),
   `pegatina_orilla` (`Pegatina de la orilla del río`), `pegatina_spencer` (`Pegatina de Spencer`),
   `pegatina_pancarta` (`Pegatina de pancarta`).

No hay carrito ni pago online. JSON-LD actual: `Store` con `OfferCatalog` (bufanda, bandera,
pegatinas); **añadir pulsera** y corregir la descripción que menciona camisetas.

### `/media` — Galería

Correspondencia título ↔ miniatura ↔ ID (verificada en `media.html` y su JSON-LD):

| # | Título | Temporada | Miniatura | YouTube |
|---|---|---|---|---|
| 1 | El Sevilla siempre será su gente | 26/27 | `video6` | `Nz1E1GyG1EA` |
| 2 | Cita con nuestra herencia | 21/22 | `video5` | `NZbk3zVNMaY` |
| 3 | La brújula de mis sentidos | 20/21 | `video4` | `gyamGKXwkMc` |
| 4 | Desplazamientos | 19/20 | `video3` | `BQ16EOFLZEM` |
| 5 | Ya estamos aquí | 19/20 | `video1` | `0v1XvikTbIo` |
| 6 | I Pregón | Diciembre de 2019 | `video2` | `C85CSoQkVy8` |

- H1: `GALERÍA`.
- JSON-LD: `ItemList` de `VideoObject` (se mantiene, actualizando miniaturas locales).
- Sin iframes: link-out a `https://youtu.be/{id}` (decisión 2026-11-05).

### `/encuentro` — Punto de encuentro

- H1: `Ven con nosotros a ver el Sevilla`.
- Cartel: `cartelPunto.webp`, alt `Cartel de la Cervecería el Punto de Triana, punto de encuentro de PS SVQ Triana`.
- Local: **Cervecería el Punto de Triana**. Iframe legado de Google Maps (embed `pb=` con
  `2d-6.013321098573216`, `3d37.38654652492175`, place id `0xd126dcec28e1743:0x2ba12f6709ca46aa`).
- Migración: click-to-load + `title` accesible + `loading="lazy"`.

## Assets

### Masters usados por el contenido (se copian a `src/assets/`)

- `images/cartel-27.jpg`, `images/cartelPunto.jpg`.
- `images/derby19.jpg`, `getafe20.jpg`, `getafe20_2.jpg`, `comida19.jpg`.
- `images/bufanda.jpg`, `bandera.jpeg`, `pulsera.jpg`, `pulsera2.jpg`,
  `pegatina_escudo.jpg`, `pegatina_orilla.jpg`, `pegatina_spencer.jpg`, `pegatina_pancarta.jpg`.
- `images/video1.jpg` … `video6.jpg`.
- `images/puente3.jpg`, `noche.jpg`, `fondorsp.jpeg`.

### Ficheros de ruta fija (se copian a `public/`)

`CNAME`, `ads.txt` (minúsculas), `robots.txt`, `favicon.ico`, `sw.js` (kill-switch),
`site.webmanifest` (o generado), `fonts/GlacialIndifference-Regular.woff2`,
`fonts/GlacialIndifference-Bold.woff2`, `images/cartel-27.jpg`, `images/logo_192.png`,
`images/logo_512.png`, `images/logo.svg`, `images/apple-touch-icon.png`,
`images/webp/logo_192.webp`, `images/webp/logo_512.webp`.

### No se migran

`css/`, `js/`, `*.html` raíz, `scripts/{bump-version,prune-bootstrap,compare-render,to-webp,serve}.py`,
Bootstrap, jQuery y bxSlider. Los masters no usados (camisetas, vasos, bolsas, sudaderas, etc.)
quedan fuera del build salvo que se necesiten para una sección.

## Ficheros raíz legados

| Fichero | Contenido que se conserva |
|---|---|
| `CNAME` | `svqtriana.com` |
| `ads.txt` | `google.com, pub-5217718596352992, DIRECT, f08c47fec0942fa0` |
| `robots.txt` | `User-agent: *`, `Allow: /`, `Sitemap: https://svqtriana.com/sitemap.xml` (se elimina el comentario obsoleto sobre JS) |
| `llms.txt` | Se genera desde `src/data/`; corregir «camiseta oficial» |
| `sitemap.xml` | Se genera con `@astrojs/sitemap`; ahora incluye `/encuentro` |
| `sw.js` | Kill-switch (§11 del plan) |

## Métricas de partida (producción, `v20260905`)

Lighthouse móvil según `CHANGELOG.md`: Performance 82, Accessibility 100, CLS 0,
TBT 0 ms, peso 436 K, 19 peticiones.
