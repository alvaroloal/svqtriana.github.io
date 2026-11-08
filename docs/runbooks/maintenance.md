# Mantener svqtriana.com

Orientación para quien — persona o agente — coja esto después. El sitio es
estático y cambia unas pocas veces al año; casi todo lo que sigue va de no romper
lo que ya funciona.

## Empezar

```sh
npm ci
npm run dev        # http://localhost:4321
```

Y antes de abrir un PR:

```sh
npm run verify
```

Lee [`README.md`](../../README.md), sobre todo la sección *Trampas*. Varias ya
han causado bugs en producción.

---

## Trabajo 1: el cartel de la nueva temporada

El trabajo recurrente. Una vez al año, hacia julio.

1. **Guarda el maestro** como `src/assets/carteles/cartel-NN.jpg`, donde `NN`
   son los dos últimos dígitos de la temporada (`cartel-28.jpg` para 2027/28).

2. **Copia el mismo JPEG** a `public/images/cartel-NN.jpg`. No vale enlazar el
   maestro de `src/`: `public/` es lo que se sirve sin procesar y la imagen OG
   tiene que ser un JPEG con URL absoluta.

3. **Edita `src/data/temporada.ts`**:
   - el `import` del cartel,
   - `etiqueta` (`'27/28'`) y `etiquetaLarga` (`'2027/2028'`),
   - `precios`, si cambian,
   - `formularioUrl`, si cambia.

4. **Edita `src/data/cartel.ts`**:
   - `cartelOg` → `/images/cartel-28.jpg`,
   - `cartelOgSize` → las dimensiones reales del JPEG,
   - `cartelAlt` → temporada y precios del cartel nuevo.

   Ese fichero alimenta el `og:image`, el `twitter:image` y el `image` del
   JSON-LD. `site.ts` ya lo lee de ahí: no hay que tocar nada más.

5. **Escribe la entrada de `CHANGELOG.md`**, con `## vYYYYMMDD` como primera
   entrada del fichero. Es la versión que mostrará el pie en el próximo deploy:
   `deploy.yml` la lee de ahí y `check:dist` falla si no coinciden.

6. **Comprueba**: `npm run build && npm run check:dist`, y abre la home en el
   navegador para ver el cartel y los precios.

7. **PR → CI → merge.** No hay script de versión ni `?v=`: los assets llevan
   hash en el nombre y el HTML se cachea poco.

8. Opcional, después del deploy: borrar el cartel anterior de
   `public/images/`. Nada lo referencia ya.

## Trabajo 2: un vídeo nuevo

1. **Título real**, sin retipearlo:

   ```sh
   curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json" \
     | python3 -m json.tool
   ```

2. **Miniatura**: descarga `maxresdefault.jpg` (o `sddefault`, o
   `hqdefault`), recorta las bandas negras y guárdala como
   `src/assets/videos/videoNN.jpg`.

3. **Añade la entrada arriba del todo en `src/data/videos.ts`**, con
   `destacado: true` y quitándolo del anterior. La tarjeta destacada de la home,
   la primera de `/media` y el JSON-LD salen todos de ahí.

4. **Comprueba**: `npm run verify`.

No se incrusta nada: cada tarjeta enlaza a `https://youtu.be/<id>`. Si algún día
se quisiera un embed, habría que abrir `frame-src` en
`infra/cloudflare/headers.tf` y añadir un banner de consentimiento.

## Trabajo 3: precios o productos

Todo está en `src/data/productos.ts` y `src/data/temporada.ts`. El HTML, el
JSON-LD (`hasOfferCatalog`) y `llms.txt` se generan de ahí, así que no hay una
segunda copia que se pueda desincronizar.

`npm run verify` valida que el JSON-LD sigue listando los 4 productos y que los
assets existen.

## Trabajo 4: cambiar la configuración de Cloudflare

Los headers, la caché y la analítica viven en [`infra/cloudflare/`](../../infra/cloudflare/README.md).
Se cambia el código, se hace `plan` y se aplica; nunca se toca el dashboard.

Dos cosas que muerden si se saltan:

- **Web Analytics ya está activo.** Aplicar `analytics.tf` como creación
  registraría un sitio duplicado. Hay que importarlo primero; por eso está
  detrás de `manage_web_analytics`.
- **Una CSP puede romper el sitio**, al contrario que el resto de headers, que
  solo dejan de proteger. Después de aplicar, abre cada página con la consola
  abierta y busca `Refused to load`. Los candidatos son el mapa de Google en
  `/encuentro` y el beacon de analítica.

Recuerda el orden: primero se despliega el HTML que cumple la política, después
se aplica Terraform. Nunca al revés.

---

## Cómo comprobar que no lo has roto

```sh
npm run verify
```

Eso encadena tipos, build, invariantes de `dist/` y Playwright. Si quieres mirar
solo las invariantes estáticas:

```sh
npm run build && npm run check:dist
```

Y si quieres ver el sitio como lo ve GitHub Pages (sin redirecciones, con
`/nosotros` → `nosotros.html` y 404 real):

```sh
node scripts/serve-dist.mjs 4321
```

Comprobaciones manuales que ningún script cubre bien:

- Abre `/` y `/encuentro` en un móvil real y pulsa «Ver mapa»: el iframe debe
  cargar y no debe haber errores de CSP.
- Abre una página con el menú móvil y ciérralo con Escape y con un clic fuera.
- Comprueba el resultado de `npm run test:lighthouse` si has tocado imágenes,
  fuentes o el orden de los bloques.

## Preguntas abiertas

- **Los precios ya son texto HTML**, no píxeles del cartel: están en
  `temporada.ts` y se ven en la home. La duplicación con el cartel impreso sigue
  existiendo, pero el HTML es la fuente de verdad para Google y lectores de
  pantalla.
- **El kill-switch del service worker** se puede borrar a partir de ~mayo de
  2027. Antes no: ver [`../root-files.md`](../root-files.md).
- **`src/assets/productos/pulsera.webp`** es el maestro del que se generó
  `pulsera.jpg` (ver `scripts/convert-pulsera.mjs`). El build sirve el JPEG
  porque WebP como fallback de `<Picture>` pesaba más que el original.
