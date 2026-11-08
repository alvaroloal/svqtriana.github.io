# Una columna de grid crece hasta la palabra más larga

## Qué pasó

En la vista previa del rediseño, en un móvil real, el hero de la portada se
cortaba por la derecha: «TEMPORADA», el antetítulo «… Desde 2019» y los botones
«Hazte socio» y «Ver precios». En las capturas de 390 px se veía bien, porque
«TEMPORADA» cabía por pocos píxeles. Bastaba un móvil más estrecho o la letra
del sistema algo más grande para que dejara de caber.

## Mecanismo

El hero es un `grid` que solo define columnas desde `lg`. En móvil la columna es
implícita (`auto`), y un elemento de grid tiene `min-width: auto`: no puede ser
más estrecho que su contenido mínimo. El contenido mínimo del `<h1>` es la
palabra «TEMPORADA», que no se puede partir, con un tamaño mínimo en `rem`
(`clamp(3.4rem, …)`) que crece con la letra del sistema. La columna se ensancha
hasta esa palabra y arrastra con ella todo lo demás. El `overflow-hidden` de la
sección recorta el sobrante en vez de mostrar una barra de desplazamiento, así
que el fallo se ve como texto cortado.

En escritorio ese mismo mecanismo es el diseño: la columna de texto toma el
ancho de «TEMPORADA» a 7rem y el cartel ocupa lo que queda. El primer arreglo
limitó también la columna en escritorio, y el hero cambió: título más pequeño,
cartel más grande y hero más alto. Hubo que deshacerlo solo para escritorio.

## Qué lo impide ahora

- **Móvil**: la columna del hero es `minmax(0, 1fr)` y la de texto lleva
  `min-w-0`, así que nunca supera el ancho disponible. El título se mide con
  unidades de contenedor (`@container` y `text-[min(15cqw,7rem)]`): «TEMPORADA»
  ocupa como mucho el ~96 % de su columna, sea cual sea la pantalla o la letra
  del sistema.
- **Escritorio (`lg`)**: se recuperan las columnas originales
  (`1.1fr 0.9fr`), `min-width: auto` y sin contención (`container-type:
  normal`), para que la columna vuelva a medirse por el título. A partir de
  ~1150 px el hero es idéntico al original (comprobado píxel a píxel a 1280,
  1536 y 1920 px); por debajo, el título
  se reduce lo justo para que el cartel no se quede en 169 px.
- Con dos regímenes distintos, cualquier cambio en el hero se comprueba en móvil
  **y** en escritorio, comparando capturas con la versión anterior.
- `tests/overflow.spec.ts` recorre las cinco páginas a 320 y 360 px, con la
  letra al 100 % y al 130 %, y falla si algún elemento se sale de la pantalla.
