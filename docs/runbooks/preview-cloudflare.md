# Publicar el MVP para revisión (Cloudflare Pages, plan gratis)

Esto **no es el corte a producción**. Es una URL de revisión para que el DevOps
y quien administra la web vean el MVP sin tocar `svqtriana.com`, su DNS, su zona
de Cloudflare ni la configuración de Pages del repo de producción.

| Sí | No |
|---|---|
| Un proyecto **aparte** de Cloudflare Pages (`svqtriana-mvp`) | Cambiar DNS o la zona de `svqtriana.com` |
| URL `*.pages.dev` | Añadir `mvp.svqtriana.com` (eso sí toca la zona) |
| `noindex` y `Disallow /` en la vista previa | `terraform apply` |
| Borrar el proyecto cuando acabe la revisión | Cambiar Settings → Pages del repo de producción |

## Opción A (recomendada): subida directa, sin conectar el repo

La más rápida y la que menos permisos pide: no hay que dar a Cloudflare acceso
al repositorio, no se ejecuta nada de GitHub y cada subida es un snapshot
inmutable de `dist/`.

### 1. Requisitos

- Node 24 y el repo en local.
- Una cuenta de Cloudflare gratuita.
- `git` (opcional, solo para el `X-Preview-Commit`).

### 2. Autenticarse

```sh
npx --yes wrangler@4 login
```

Abre el navegador y crea un token OAuth para **tu** usuario. No reutilices el
token de Terraform de producción: para la vista previa basta con OAuth o con un
token limitado a `Account → Cloudflare Pages → Edit`.

Si la cuenta tiene varios accounts, exporta el correcto:

```sh
# PowerShell
$env:CLOUDFLARE_ACCOUNT_ID = "<account_id>"
```

### 3. Crear el proyecto una sola vez

```sh
npx --yes wrangler@4 pages project create svqtriana-mvp --production-branch mvp
```

### 4. Construir y publicar

```sh
npm ci
npm run preview:cf
```

`preview:cf` hace cuatro cosas, en este orden:

1. `npm run build` regenera `dist/`.
2. `npm run check:dist` verifica los invariantes antes de publicar nada.
3. `scripts/prepare-preview.mjs` prepara `dist/`:
   - escribe `_headers` con la **misma CSP** que
     `infra/cloudflare/csp.txt` (la que se aplicará en producción), más
     `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options`, `nosniff` y caché
     inmutable para `/_astro/*`;
   - reescribe `robots.txt` con `Disallow: /` para que ningún crawler siga el
     sitemap de producción desde una URL de revisión;
   - elimina `CNAME`, que solo entiende GitHub Pages.
4. `wrangler pages deploy dist` sube el resultado.

La salida imprime dos URLs:

```
https://svqtriana-mvp.pages.dev                 # rama mvp (estable)
https://<hash>.svqtriana-mvp.pages.dev          # este deploy concreto
```

Comparte la primera con el DevOps; la segunda es útil para señalar una versión
exacta en una revisión.

### 5. Iterar

```sh
npm run preview:cf
```

**`npm run build` por sí solo no publica**: solo regenera `dist/` en local. La
web de `*.pages.dev` cambia cuando se ejecuta `preview:cf`, que vuelve a
construir y sube un deployment nuevo. La URL estable
(`https://svqtriana-mvp.pages.dev`) sigue siendo la misma y sirve la última
subida; las URLs con hash de cada deployment anterior se conservan.

Si el navegador te enseña una versión vieja, fuerza recarga (Ctrl+F5). El HTML
se sirve sin caché larga y los assets llevan hash, así que no debería hacer
falta.

## Opción B (mejor para iterar en equipo): GitHub + Pages

Si el DevOps prefiere revisar por PR:

1. Subir el repo a un repositorio **privado** (o a un fork/mirror dedicado).
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build`. Output directory: `dist`.
4. Variable de entorno: `NODE_VERSION=24` (o `24.22.2`).
5. Cada push a una rama y cada PR generan una preview
   `<hash>.svqtriana-mvp.pages.dev`.

No hacen falta secretos: Pages construye desde el repo y lee `CHANGELOG.md`
para la versión del pie. Conectar un proyecto de Pages **no** modifica el repo
ni el Pages de producción; aun así, si se quiere separación estricta, conectar
un fork y no el repo que administra la web.

> Ojo: en esta opción el `_headers` de `prepare-preview.mjs` no se ejecuta,
> porque el build de Pages solo corre `npm run build`. Si quieres la CSP y el
> `noindex` también por esta vía, cambia el build command a
> `npm run build && node scripts/prepare-preview.mjs`.

## Opción C: demo en vivo de 10 minutos

Para una llamada, sin cuenta ni proyecto:

```sh
npm run build
node scripts/serve-dist.mjs 4321        # terminal 1
cloudflared tunnel --url http://localhost:4321   # terminal 2
```

`cloudflared` se instala aparte (`winget install Cloudflare.cloudflared` o
desde <https://github.com/cloudflare/cloudflared/releases>). La URL
`*.trycloudflare.com` es efímera y cambia en cada arranque. No sirve para
compartir de forma duradera.

## Proteger la vista previa (opcional, gratis)

Si no quieres que el MVP sea público:

1. Cloudflare Dashboard → Zero Trust → Access → Applications → Add an
   application → Self-hosted.
2. Application domain: `svqtriana-mvp.pages.dev` (y `*.<proyecto>.pages.dev` si
   quieres cubrir también las previews con hash).
3. Policy: `Emails` con las direcciones de quien vaya a revisar, y login por
   **One-time PIN** (no hace falta configurar un IdP).

El plan Free de Zero Trust cubre hasta **50 usuarios**. El alta puede pedir
datos de pago para verificar la cuenta, pero el plan Free no cobra.

## Límites del plan gratis (consultados 2026-11)

| Límite | Free |
|---|---|
| Peticiones y ancho de banda de estáticos | Ilimitados |
| Builds | 500/mes, 1 concurrente, 20 min por build |
| Ficheros por sitio | 20 000 |
| Tamaño por fichero | 25 MiB |
| Dominios custom por proyecto | 100 |
| Reglas en `_headers` | 100 |
| Usuarios de Access | 50 |

El sitio tiene 6 HTML y unos pocos cientos de assets: sobra con muchísimo
margen.

## Limpiar

```sh
npx --yes wrangler@4 pages project delete svqtriana-mvp
```

Y borra la aplicación de Access si la creaste. No hay ningún registro DNS que
deshacer: **no se ha tocado la zona de `svqtriana.com`**.

## Qué revisar (checklist para el DevOps)

```sh
npm ci
npm run verify                              # tipos, build, invariantes, Playwright
npm run build && npm run check:dist
terraform -chdir=infra/cloudflare fmt -check -recursive
terraform -chdir=infra/cloudflare init -backend=false
terraform -chdir=infra/cloudflare validate
```

En la URL del MVP:

- [ ] `/`, `/nosotros`, `/productos`, `/media`, `/encuentro` responden 200 sin
      `.html` y sin barra final.
- [ ] `/robots.txt`, `/sitemap.xml`, `/ads.txt`, `/llms.txt`, `/sw.js` responden
      200; una ruta inexistente devuelve 404 con la página de error.
- [ ] Canonical, `og:url` y sitemap coinciden y no llevan `.html` ni barra final.
- [ ] `/encuentro` es indexable en producción y el mapa **no** carga hasta
      pulsar «Ver mapa».
- [ ] Los vídeos son enlaces a YouTube; no hay iframes de YouTube.
- [ ] Menú móvil a 375 px, cierre con Escape y con clic fuera.
- [ ] Consola sin `Refused to load` (la CSP de la preview es la de producción).
- [ ] Cabeceras: `curl -sI https://svqtriana-mvp.pages.dev/ | grep -iE 'content-security-policy|x-robots-tag|x-frame-options'`.
- [ ] Lighthouse móvil dentro de los umbrales de `lighthouserc.json`.
- [ ] Decisiones de producto en `MIGRACION-ASTRO.md` §18: `/encuentro` pública,
      link-out a vídeos, mapa click-to-load, sin anuncios visibles, Fraunces.

## Qué NO demuestra la preview

- **Cloudflare Web Analytics**: el beacon lo inyecta la zona de producción, no
  un proyecto de Pages. Su ausencia en la preview es esperada.
- **Cabeceras de la zona**: las aplica `infra/cloudflare/headers.tf`, no
  `_headers`. La preview usa una copia generada desde el mismo `csp.txt`; el
  resto de headers de zona solo se verifican tras el `apply` (F7).
- **Comportamiento de GitHub Pages**: la preview sirve desde Pages; el fallback
  de rutas es el mismo que prueba `scripts/serve-dist.mjs`, pero el hosting real
  de producción seguirá siendo GitHub Pages hasta el corte.
