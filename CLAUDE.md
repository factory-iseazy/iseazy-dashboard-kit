# iseazy-dashboard-kit · instrucciones para Claude Code

Este repo es el **kit de código** de los dashboards de datos de isEazy (paquete
`@iseazy/dashboard-kit`). Lo usan varias tools por versión (tag): un cambio aquí llega a todas
cuando suben de versión. Trabaja con cuidado y en castellano.

## 0. Antes de cualquier tarea no trivial, lee

1. `README.md`: qué hay, cómo se usa, reglas para cambiar el kit y deuda pendiente.
2. `docs/DECISIONS.md`: lo ya decidido. No lo vuelvas a discutir sin motivo.
3. `CHANGELOG.md`: qué ha cambiado en cada versión.

**Toda decisión se anota en `docs/DECISIONS.md` en el mismo turno en que se toma**, y todo cambio
del kit en `CHANGELOG.md`.

## 1. Reglas del kit (no las rompas)

- El kit **no importa nada** de ninguna app y no conoce ningún dato concreto.
- Las apps importan **solo** de `@iseazy/dashboard-kit` (`src/index.ts`). Toda pieza pública se
  exporta desde ahí.
- **Nombres genéricos**: nada que nombre un caso de uso (países, canales, clientes…).
- Todo componente nace en **claro y oscuro**. Nada de colores fijos: tokens de `styles.css`,
  `useNivoTheme()` y `useChartChrome()`.
- Las gráficas llaman a `useNivoTheme()` al principio del componente, antes de cualquier `return`.
- Antes de dar algo por hecho: `npm install` (si hace falta) y `npm run typecheck`.

## 2. Versiones y publicación

- `vMAYOR.MENOR.PARCHE` (ver README). Cambiar el nombre o una prop obligatoria de algo que una app
  usa es **mayor**: avisa antes de hacerlo.
- Publicar una versión = subir `version` en `package.json`, entrada en `CHANGELOG.md`, commit, tag
  `vX.Y.Z` y `git push --follow-tags`. **Solo cuando el usuario lo pida.**

## 3. Normas

- **Repo público.** Nunca metas datos reales, URLs internas, credenciales ni lógica de negocio de
  ninguna tool. Los datos de ejemplo, inventados.
- **Nunca escribas nombres de personas** en código, comentarios, docs ni commits: usa roles.
- Para probar variantes, **controles visibles** (showroom), nunca parámetros que haya que editar a
  mano.

## Design system iseazy

Este proyecto consume el design system isEazy. La fuente única de verdad
para todas las decisiones visuales vive en:

  https://raw.githubusercontent.com/factory-iseazy/iseazy-design-system/main/DESIGN.md

### Antes de cualquier output visual

**PRIMERO**: ¿esta tool es un **dashboard/tool de datos** (KPIs, gráficas,
filtros — test en §13.1)? → lee **§13 (Modo dashboard)**: en ese modo §13
manda sobre §4/§5 donde entren en conflicto (sidebar, paleta de gráficas,
patrones de KPIs, tool-shell).

¿Es una tool de **edición y registro diario** (rejillas, formularios, guardar —
test en §14.1)? → lee **§14 (Modo app operativa)**: en ese modo §14 manda
sobre §4/§5 (tamaños de tabla, campo y botón; interacción; color de categoría).

Después, antes de elegir colores, tipografía, layout, componentes o cualquier
cosa que afecte cómo se ve la tool, haz `WebFetch` al DESIGN.md con un `prompt`
que extraiga SOLO la sección que necesitas. No descargues las 3.700 líneas
enteras cada vez. Mapeo:

| Necesitas | WebFetch con prompt |
|---|---|
| Color (tokens, brand, accents, deco, grey) | "Extrae §2 (Tokens de color)" |
| Modo oscuro | "Extrae §2.8 (Modo oscuro)" |
| Tipografía (escala, stacks) | "Extrae §3 (Tipografía)" |
| Layout (spacing, radius, shadows, motion, focus) | "Extrae §4 (Layout y sistema visual)" |
| Icono → consultar Tabler | "Extrae §5.2 (Iconografía)" |
| Charts | "Extrae §5.3 (Gráficos)" |
| **Dashboard de datos** (layout, rail de filtros, paleta de gráficas, formas, tablas, interacción) | "Extrae §13 (Modo dashboard)" |
| **App operativa** (densidad, interacción, color de categoría, checklist) | "Extrae §14 (Modo app operativa)" |
| Tabla editable, marca de hoy, fila por categoría | "Extrae §5.14.4" |
| Barra de guardado y feedback inline | "Extrae §5.10.3" |
| Patrón de pantalla (hero, cards, stats, etc.) | "Extrae §5.4 (Patrones de bloque)" |
| Anti-patrones | "Extrae §5.5" |
| Botones | "Extrae §5.6" |
| Forms (inputs, validación) | "Extrae §5.7" |
| Badges, tags, avatars | "Extrae §5.8" |
| Tooltips | "Extrae §5.9" |
| Alerts y toasts | "Extrae §5.10" |
| Modales/dialogs | "Extrae §5.11" |
| Empty states | "Extrae §5.12" |
| Loading (spinner, skeleton, progress) | "Extrae §5.13" |
| Tablas y pagination | "Extrae §5.14" |
| Dropdowns, popovers, drawer, tabs internas, stepper, date, combobox, breadcrumbs, slider, file upload | "Extrae §5.15 a §5.24" |
| Tool shell (wrapper de la pantalla) | "Extrae §5.25" |
| CSS classes copy-paste (.t-*, .btn-*, .field-*, etc.) | "Extrae §12 (Utilidades CSS extra)" |
| CSS de componentes para HTML sin Tailwind (badge, alert, dialog, table, dropdown, tabs, save-bar, choice-pills, .c-*) | "Extrae §12.6" |

### Reglas duras (no negociables)

0. **Si la tool es un dashboard de datos** (test §13.1), el modo dashboard
   (§13) manda sobre §4/§5 donde entren en conflicto — incluidos el matiz del
   sidebar de §5.5 (rail de filtros permitido), la paleta de §5.3 (sustituida
   por §13.3) y los patrones de KPIs de §5.4. **Si es una tool de edición y
   registro diario** (test §14.1), el modo app operativa (§14) manda sobre
   §4/§5: `table-compact`, `field-input-sm` y `btn-sm` por defecto, feedback
   inline en `save-bar`, color de categoría con `.c-*`.
1. **No inventar tokens de color** fuera de §2. Solo las variables CSS
   definidas allí.
2. **No renombrar patrones** por su caso de uso (nada de `post-card`,
   `client-card`, `experiment-card` — usa los nombres genéricos de §5.4).
3. **Anti-patrones a evitar**: §5.5. Sidebar permanente con avatares
   circulares + emojis, headings con gradiente de texto, sombras
   `shadow-2xl`, etc.
4. **Toda pantalla debe estar envuelta en el `tool-shell`** de §5.25:
   header con logo isEazy + nombre de la tool + toggle dark/light.
   No renderizar contenido fuera del shell.
5. Si el sistema necesita un cambio que no encaja con lo que hay,
   **NO modifiques tokens o componentes localmente**. Dile al usuario:
   "Esto requiere una decisión sobre el design system. Abre un issue en
   https://github.com/factory-iseazy/iseazy-design-system/issues
   describiendo el caso de uso." Sigue trabajando con lo más cercano
   del sistema actual hasta que se resuelva.

### Logos isEazy (vía URL raw, sin copia local)

Base: `https://raw.githubusercontent.com/factory-iseazy/iseazy-design-system/main/assets`

- Marca: `{base}/logos/iseazy/iseazy.svg` + `iseazy-white.svg` (dark mode)
- Productos: `{base}/logos/iseazy/iseazy-{producto}.svg` + `-white.svg`
  donde `{producto}` ∈ {`author`, `factory`, `skills`, `lms`, `engage`, `game`}

Patrón dual obligatorio para soportar light + dark mode automáticamente:

    <img src="{base}/logos/iseazy/iseazy.svg"
         class="block dark:hidden h-7 w-auto" />
    <img src="{base}/logos/iseazy/iseazy-white.svg"
         class="hidden dark:block h-7 w-auto" />

### Stack recomendado

- **React + Tailwind + shadcn/ui + Tabler Icons** para tools React.
- **Streamlit** con el `.streamlit/config.toml` del §2.7 para tools data.
- **HTML estático con Tailwind CDN** para landings o playgrounds.
- **Dashboards de datos**: cualquiera de los stacks anteriores + las reglas
  del modo dashboard (§13).
- **Tools de edición y registro**: cualquiera de los stacks anteriores + las
  reglas del modo app operativa (§14). Si la tool no usa Tailwind (Jinja2,
  HTML servido), el CSS de componentes está en §12.6.

En todos los casos, copia las variables CSS de §2.2 al `:root` de tu
`globals.css`, configura Tailwind con `darkMode: 'class'`, y usa las
clases CSS copy-paste de §12 si las necesitas (buttons, forms, etc).

### Versión

Conectado al design system en `main` el día de la instalación. El sistema
lee siempre la última versión publicada — si hay actualizaciones cuando
trabajes mañana, se aplican automáticamente.
