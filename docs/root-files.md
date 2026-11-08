# Por qué estos ficheros viven en `public/`

Todo lo que está en `public/` se copia tal cual a `dist/` y se sirve desde la
raíz del dominio. Varios de estos ficheros se piden desde una ruta fija por algo
que no controlamos: moverlos a una carpeta los rompe en silencio — sin error,
sin log, solo una función que deja de funcionar.

| Fichero | Quién lo pide | Qué rompe si se mueve |
|---|---|---|
| `sw.js` | El navegador, por la ruta donde se registró el service worker antiguo | Su **scope**. Un service worker solo controla URLs bajo el directorio desde el que se sirve. En `/js/sw.js` controlaría `/js/*` y nada más, así que los navegadores con el worker viejo nunca recibirían el kill-switch. Ampliar el scope exige un header `Service-Worker-Allowed` y GitHub Pages no permite enviar headers. La raíz es la única opción. |
| `ads.txt` | El crawler de Google AdSense, en `/ads.txt` | La verificación de anuncios. Ojo con las minúsculas: Pages distingue mayúsculas y el fichero estuvo un año como `Ads.txt`, así que `/ads.txt` devolvía 404 mientras `/Ads.txt` devolvía 200. |
| `robots.txt` | Todos los crawlers, en `/robots.txt` | Nadie lo lee en otra ruta. |
| `sitemap.xml` | Los buscadores, apuntados desde `robots.txt` | Se referencia por URL absoluta, así que podría moverse — pero no hay motivo. |
| `llms.txt` | Convención propuesta para crawlers de LLM, en `/llms.txt` | Ver la nota de abajo. |
| `CNAME` | GitHub Pages | El dominio propio. Si no llega a `dist/`, el deploy pierde svqtriana.com. |
| `favicon.ico` | Los navegadores, que prueban `/favicon.ico` si ningún `<link rel=icon>` coincide | El icono de la pestaña. |

`sitemap.xml` y `llms.txt` no son ficheros estáticos: los genera
`src/pages/sitemap.xml.ts` y `src/pages/llms.txt.ts` a partir de `src/data/`.
Se sirven en la raíz por la misma razón que los demás.

## El kill-switch: por qué `sw.js` sigue existiendo

La web nueva **no registra ningún service worker**. Pero los navegadores que
visitaron la web antigua (≤ `v20260905`) tienen uno instalado que servía CSS y
JS cache-first durante 30 días y el HTML con stale-while-revalidate. Si el
fichero desapareciera, esos navegadores seguirían sirviendo la web vieja
indefinidamente.

`public/sw.js` es, por tanto, un kill-switch: al activarse desregistra el
worker, borra las cachés `svq-triana-*` y recarga las pestañas abiertas. No
tiene listener de `fetch`, así que no intercepta nada.

- **Mantener al menos 6 meses después del corte** (hasta ~mayo de 2027), y
  mientras Cloudflare Web Analytics siga mostrando visitas de navegadores
  antiguos.
- Pasado ese plazo se puede borrar. Antes no.
- No registrar nunca un service worker desde las páginas: `check:dist` no lo
  impide explícitamente, pero la CSP y el kill-switch están diseñados para que
  no exista ninguno nuevo.

## Sobre `llms.txt`

Se mantiene, con expectativas bajas. Es una propuesta
([llmstxt.org](https://llmstxt.org), finales de 2024) y **no consta que ningún
crawler de IA importante lo consuma** — ni OpenAI, ni Anthropic, ni Google.
Cuesta unas líneas y puede servir más adelante.

Lo que de verdad determina si un motor de respuestas puede describir el sitio es
que el contenido esté en el HTML servido. Los crawlers de IA, en su mayoría, no
ejecutan JavaScript: por eso la navegación, el pie y todos los datos van en el
HTML, y el único JS es progresivo.

## Restricciones del hosting que conviene recordar

GitHub Pages sirve ficheros estáticos y **no puede enviar headers de
respuesta**. Dos consecuencias que ya han mordido:

- Los headers tienen que venir del CDN que está delante. Un `.htaccess` estuvo
  un año en el repo definiendo CSP, HSTS y `X-Frame-Options`, y no se aplicó ni
  una línea: es un fichero de Apache y Pages no ejecuta Apache. Se borró el
  2026-09-05, cuando `infra/cloudflare/` ya estaba aplicado y verificado.
- Las rutas distinguen **mayúsculas**, al contrario que un checkout local en
  Windows o macOS. Un fichero que resuelve en local puede dar 404 en producción
  solo por la caja.

GitHub Pages sirve URLs sin extensión: `/nosotros` resuelve a `nosotros.html`.
El sitio elige siempre la forma sin extensión (canonical, `og:url`, sitemap,
nav) para no duplicar contenido. `scripts/serve-dist.mjs` reproduce ese
comportamiento en local.
