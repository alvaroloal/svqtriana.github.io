# Changelog

Qué cambia en [svqtriana.com](https://svqtriana.com), de lo más reciente a lo
más antiguo.

La versión es la fecha del despliegue: `vYYYYMMDD`, con `.N` para un segundo
despliegue el mismo día. Es la misma cadena que muestra el pie de página y la
que el build lee de la primera entrada de este fichero.

---

## v20261108

Rediseño de páginas y componentes. Los textos, las URLs y los datos de la peña
no cambian; cambia cómo se disponen y cómo se ven.

### El sitio

- **Cabecera con nombre**: el escudo va acompañado de «SVQ Triana · Peña
  Sevillista» y la sección activa se subraya en albero.
- **Cabeceras de página oscuras** en `/nosotros`, `/productos`, `/media` y
  `/encuentro`, con el azulejo de fondo, a juego con la portada.
- **El Puente de Triana, redibujado**: arcos, aros que menguan hacia la clave,
  pilas y farolas. Ya no se deforma con el ancho de pantalla. Aparece sobre el
  río al pie del hero, en el pie de página y en el cierre de la historia.
- **Franjas rojiblancas** del escudo, solo en el pie y en el cierre de
  `/nosotros`.
- **Portada**: «Hazte socio» a dos columnas, «La peña» en mosaico con fotos
  grandes y la cita de Triana con más presencia.
- **Nuestra historia**: texto a ancho de lectura, fechas que caben en su
  etiqueta, fotos completas en formato álbum y el último hito como cierre con
  el botón de hacerse socio.
- **Material**: cuatro tarjetas por fila en escritorio y fotos enteras, sin
  recortar las pegatinas ni la bandera.
- **Galería**: el vídeo destacado ocupa dos filas y los dos siguientes se
  apilan a su lado, sin huecos.
- **Encuentro**: el hueco del mapa tiene el alto del mapa, así que la página no
  salta al pulsar «Ver mapa».
- **Pie** en tres columnas: marca y redes, contacto y secciones.
- **El hero ya no se corta en móviles estrechos** ni con la letra del sistema
  ampliada: «TEMPORADA», el antetítulo y los botones caben siempre en
  pantalla. Una prueba nueva (`tests/overflow.spec.ts`) lo comprueba en las
  cinco páginas.

### Rendimiento y accesibilidad

Lighthouse móvil sobre `dist/`, con Lighthouse CI:

| Página | Performance | Accesibilidad | Best Practices | SEO | CLS |
|---|---:|---:|---:|---:|---:|
| `/` | 95 | 100 | 100 | 100 | 0 |
| `/nosotros` | 100 | 100 | 100 | 100 | 0 |
| `/productos` | 94 | 100 | 100 | 100 | 0 |
| `/media` | 96 | 100 | 100 | 100 | 0 |
| `/encuentro` | 98 | 100 | 100 | 100 | 0 |

---

## v20261105

Migración del sitio a Astro 7 y Tailwind CSS v4. El contenido, las URLs y los
datos de la peña no cambian; cambia cómo se genera y se sirve la web.

### El sitio

- **Las cinco secciones siguen en su URL**, sin `.html` y sin barra final:
  `/`, `/nosotros`, `/productos`, `/media` y `/encuentro`.
- **`/encuentro` pasa a ser pública**: se enlaza en el menú, se indexa y entra
  en el sitemap. Sigue mostrando el cartel de la Cervecería el Punto de Triana,
  ahora con el mapa bajo demanda.
- **Vídeos con enlace a YouTube**, sin iframes ni cookies de terceros.
- **Mapa de Google bajo demanda**: solo se carga al pulsar «Ver mapa».
- **Material sin carrito**, como antes: se pide por Instagram o email.
- **Diseño nuevo** con los motivos del barrio (azulejo, Puente de Triana y río),
  tipografía Fraunces para los titulares y Glacial Indifference para el texto.

### Rendimiento y accesibilidad

- HTML estático, sin jQuery, Bootstrap ni carruseles de terceros.
- JavaScript propio mínimo: menú móvil, galerías de producto y mapa bajo
  demanda.
- Imágenes en AVIF y WebP con `astro:assets`; fuentes locales en WOFF2.
- Sin scripts inline ejecutables: compatible con la CSP sin `'unsafe-inline'`.
- Lighthouse móvil sobre `dist/`, con Lighthouse CI:

  | Página | Performance | Accesibilidad | Best Practices | SEO | CLS |
  |---|---:|---:|---:|---:|---:|
  | `/` | 96 | 100 | 100 | 100 | 0 |
  | `/nosotros` | 100 | 100 | 100 | 100 | 0 |
  | `/productos` | 95 | 100 | 100 | 100 | 0 |
  | `/media` | 96 | 100 | 100 | 100 | 0 |
  | `/encuentro` | 98 | 100 | 100 | 100 | 0 |

  El CI falla si Performance baja de 90, Accesibilidad o SEO de 100, Best
  Practices de 95 o CLS supera 0,02.

### Infraestructura

- Publicación con GitHub Actions y GitHub Pages (sin cambiar de proveedor); las
  actions van fijadas por SHA.
- `sw.js` se mantiene como kill-switch del service worker antiguo.
- La CSP se estrecha: fuera jQuery, fuera `'unsafe-inline'` de `style-src` y
  fuera YouTube de `frame-src`. Solo queda Google Maps, y bajo demanda.
- Los assets con hash de `/_astro/*` se cachean un año en el edge y en el
  navegador. `sw.js` sigue sin cachearse.
- `terraform validate` y `terraform fmt -check` corren en CI; el `apply` sigue
  siendo un acto humano en el corte.

### Antes de la migración

Última medición de producción del sitio anterior (`v20260905`), según su
CHANGELOG: Performance 82, Accesibilidad 100, CLS 0, TBT 0 ms, 436 KB y 19
peticiones.

---

## Historial anterior a la migración

Entradas del sitio en HTML escrito a mano, tal como estaban en este repositorio
antes de pasar a Astro. Se conservan sin cambios (en inglés, como se
escribieron).

### v20260905

The first full maintenance pass in a year, and the season 26/27 poster.

### The site

- **Season 26/27 poster** on the home page.
- **New spot in the gallery** — *El Sevilla siempre será su gente* — with the
  real YouTube titles as card headings and the season as subtitle, and proper
  thumbnails on the five older videos.
- **TikTok added** to the social links, and the Twitter bird replaced with the
  X mark — in the header, in the footer contact row, and in the accessibility
  labels a screen reader reads out.
- **Official shirts removed** from the material page (out of stock); scarf and
  flag now come first.
- **The mobile menu works again.** It had been dead on all five pages: the
  bundled Bootstrap CSS is v4 and hides with `.collapse:not(.show)`, while the
  bundled JS was v3 and toggled `in`, which no stylesheet here defines.
- **The product slider** no longer sits off-centre between black bands.
- **The background image** is anchored so the crop keeps the crowd rather than
  the edge of the frame.

### Findability

- Each page has its own `<title>`, canonical and `og:url`; all five used to
  claim to be the home page.
- **URLs lost their `.html`.** Canonical, `og:url`, sitemap, nav and the
  service worker precache list all agree now.
- **The nav and footer are in the served HTML**, not built by JavaScript.
  Grepping production for a nav link used to return 0. AI crawlers largely do
  not run JS, and they saw a page with no navigation and no contact details.
- `robots.txt` no longer blocks Googlebot from `/js/` and `/css/`, which it
  needs to render the page it is indexing.
- `/ads.txt` returns 200. The file was called `Ads.txt`, and production is
  case-sensitive, so AdSense had been fetching a 404 for a year.
- `llms.txt` added.

### Speed

Measured with Lighthouse against production, before and after:

| | Before | After |
|---|---:|---:|
| Performance | 60 | 82 |
| Accessibility | 98 | 100 |
| **Cumulative Layout Shift** | **0.827** | **0** |
| Total Blocking Time | 30 ms | 0 ms |
| Total weight | 879 K | 436 K |
| Requests | 26 | 19 |

- **1.68 MB of PNGs** were being served with unused WebP twins beside them — an
  earlier conversion had matched `*.png` and missed uppercase `.PNG`.
- **Font Awesome and Owl Carousel removed.** Owl loaded on four pages and was
  used by nothing; Font Awesome served six play glyphs. The icons are inline
  SVG now, which was forced anyway: version 4.7.0 predates both the X mark and
  TikTok.
- **`css/bootstrap.css` pruned**, 187 K to 12 K, keeping Bootstrap's own
  declarations byte for byte. Verified by rendering all five pages at five
  widths under both stylesheets and comparing every element: 3613 of them, no
  computed-style or box differences.
- **No inline scripts and no inline `<style>`** on any page.
- The poster is no longer `loading="lazy"`, which it should never have been —
  it is the largest contentful paint.

### Under the hood

- **Response headers now come from Cloudflare**, as Terraform in
  `infra/cloudflare/`: CSP, HSTS, Permissions-Policy, Referrer-Policy,
  X-Frame-Options, X-Content-Type-Options. There had been an `.htaccess` here
  for a year setting all of them, and not one line ever took effect — GitHub
  Pages does not run Apache.
- **`script-src` carries no `'unsafe-inline'`**, and TLS 1.0/1.1 are no longer
  accepted.
- **Assets carry `?v=`**, so a stylesheet change actually reaches people who
  have been here before. Without it, two caches keep serving the old file: the
  service worker's for 30 days and Cloudflare's edge for 7.
- **Bootstrap's MIT notice restored.** The pruner had been dropping it, along
  with the `:root` block underneath — it read the licence banner as a selector
  list, split it on the comma inside "Twitter, Inc." and matched `.com` in
  `getbootstrap.com` as a class.

---

### Before v20260905

The site was unmaintained for roughly a year. Its history is in the commit log;
this file starts where the versioning does.
