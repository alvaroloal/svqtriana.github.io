# Astro inlinea lo que la CSP prohíbe

## Qué pasó

El primer build de la migración tenía un `<script>` con el menú móvil, las
galerías y el mapa dentro de cada HTML. No lo escribimos inline: Astro compiló
el `<script>` de `BaseLayout` a un chunk y Vite lo volvió a incrustar porque
pesaba menos que `build.assetsInlineLimit` (4 KB por defecto). El build estaba
verde; el fallo habría aparecido solo en producción, con `script-src 'self'` y
sin `'unsafe-inline'`: el navegador habría bloqueado el script y el menú móvil
no habría abierto.

Lo mismo con el CSS. `build.inlineStylesheets` vale `'auto'` por defecto e
incrusta en `<style>` las hojas pequeñas, que `style-src 'self'` también bloquea.

## Mecanismo

La decisión de inlinear no es de Astro sino de Vite: `shouldInlineAsset` compara
el tamaño del chunk con `assetsInlineLimit`. Un script de 2 KB se inlinea aunque
el componente lo declare como módulo externo. No hay aviso; el HTML servido es
distinto del que esperabas.

## Qué lo impide ahora

- `astro.config.mjs` fija `vite.build.assetsInlineLimit: 0` e
  `inlineStylesheets: 'never'`.
- `scripts/check-dist.mjs` falla si algún HTML contiene un `<script>` sin `src`
  que no sea `application/ld+json`, un bloque `<style>` o un atributo `style=""`.
- La CSP de `infra/cloudflare/headers.tf` no lleva `'unsafe-inline'` ni en
  `script-src` ni en `style-src`, así que el fallo no puede taparse por
  accidente.
