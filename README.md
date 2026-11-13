# Enosfera · landing editorial (v2)

Variante visual de la landing de prelanzamiento de Enosfera para creadores y productores del vino. Mantiene el contenido de la landing original ([enosfera](https://github.com/lucasfloreslucero-agil/enosfera)) con otro sistema visual: paleta corta y cálida, titulares display gigantes, serif editorial, fotografía protagonista y movimiento lento.

- **Sitio publicado:** https://lucasfloreslucero-agil.github.io/enosfera-landing-v2/
- **Publicación:** GitHub Pages desde la rama `main` (raíz). Cada push a `main` actualiza el sitio.
- **Estado:** en revisión. La página lleva `noindex`.

## Estructura

- `index.html` — la landing completa (sitio estático, sin build).
- `assets/css/styles.css` — tokens (`:root`), componentes, secciones y responsive (991 / 767 / 575 px).
- `assets/js/main.js` — scroll suave, parallax de tarjetas, reveals, menú lateral, fichas y formulario.
- `assets/img/` — fotos recortadas y sin metadatos, de las carpetas de Drive del proyecto.
- `scripts/dev-server.js` — servidor local: `node scripts/dev-server.js` → http://localhost:4325

## Sistema visual

| Rol | Valor |
|---|---|
| Colores | rosa `#F38595`, nude `#E5B6AD`, rojo vino `#BA2E38`, negro, blanco |
| Display | Big Shoulders Display 800–900, mayúsculas |
| Texto | Fraunces 400–600 |
| Etiquetas y botones | Inter Tight, mayúsculas |
| Base | `html { font-size: 14px }`, secciones con 90 px de padding vertical, sin bordes redondeados |

Animaciones: scroll suave con [Lenis](https://github.com/darkroomengineering/lenis) (`lerp: 0.05`), logo fijo en el hero, ola que tapa el hero, tarjetas inclinadas con parallax y ficha al hacer clic, palabra calada sobre foto fija, collage con apertura tipo telón, titular gigante sobre foto fija. Con `prefers-reduced-motion` se desactivan el scroll suave, el parallax y los reveals.

## Formulario

Envía las postulaciones a la misma planilla de Google Sheets que la landing original. Para revisar los estados sin enviar nada, abrir la página con `?demo=ok` o `?demo=error`.

## Reglas de contenido

Voseo, frases cortas, sin emoji. El texto fuente va con mayúscula solo inicial; las mayúsculas de títulos y etiquetas son un estilo de CSS. Se dice "seguidores", nunca "suscriptores". Las preventas son compras anticipadas con recompensa: nada de lenguaje de inversión. Precios con el formato "$ 38.000". La leyenda "Beber con moderación. Prohibida su venta a menores de 18 años." y el link "Botón de arrepentimiento" son obligatorios.
