# Cambios

Formato: versión · fecha · qué cambió y por qué. Más reciente arriba.

## v0.1.0 · 2026-11-11 · Repo propio

El kit deja de vivir dentro de la primera tool que lo usó y pasa a este repo, como paquete
`@iseazy/dashboard-kit` instalable por tag. El código es el mismo que en el commit `fdda35b` del
repo donde maduró; no cambia ninguna pieza ni ninguna prop.

- `package.json` propio con `react`, `react-dom` y `tailwindcss` v4 como dependencias de la app
  (peer) y `npm run typecheck` independiente.
- Comprobado que una app que lo instala desde este repo compila (typecheck incluido) y genera
  exactamente las mismas clases CSS que con el kit dentro del propio repo, también dentro de un
  contenedor `node:20-slim` como el del despliegue.
- Se instala con el tarball del tag, no con `github:` (D-005).

### Lo que traía de su etapa anterior (resumen)

**Arranque.** Nace de los componentes del primer dashboard de datos, convertidos en paquete:
punto de entrada único (`src/index.ts`), `styles.css` propio que declara sus fuentes a Tailwind con
`@source` y Nivo fijado a `0.87.0` en todos sus paquetes.

- Modo claro/oscuro: `ThemeModeProvider` (clave `iseazy-ds-theme`, preferencia del sistema por
  defecto), `ThemeToggle` con iconos Tabler, tokens §2.8 con variante `dark:` por clase, y
  `useNivoTheme()` / `useChartChrome()` en todas las gráficas.
- `DashboardShell` genérico con logo dual (§5.25) y badge de frescura con tres estados.
- Rail de filtros reducido a piezas (`FilterRail`, `RailGroup`, `RailOption`): qué filtros hay lo
  decide cada app.
- Fuera del kit: colores de identidad de un caso concreto y constantes de cromo fijas.
  `ChoroplethMundo` lee el GeoJSON de `src/geo/`.

**Piezas añadidas con uso real.** Todas en claro y oscuro y con nombre genérico.

- Gráficas en SVG propio, porque Nivo no da área solo para la serie protagonista ni comparación
  discontinua (utilidades en `charts/escala.ts`):
  - `AreaTemporal`: área degradada solo para la serie protagonista, comparación en gris
    discontinua, crosshair con tooltip único y Δ, etiqueta del último valor y clic en un punto.
    Opciones `desdeCero={false}` (ratios cerca del 100 %) y `sombrearEntre={[idA, idB]}` (hueco
    entre dos series de la misma unidad, alternativa al doble eje de §13.3.6).
  - `MultiplesArea`: pequeños múltiplos con escala común, cursor sincronizado y clic como filtro.
  - `BarrasVariacion`: columnas de hitos con la variación entre ellos en píldora.
  - `BarrasCascada`: cascada (waterfall) con totales desde cero, pasos flotantes, verde/rojo por
    signo (§13.5) y clic por barra.
- `BarrasAgrupadas` (Nivo, `groupMode="grouped"`), porque las apps no importan Nivo directamente.
- `BarrasApiladas`: leyenda ancha, borde con el color de superficie del modo y etiquetas del eje
  espaciadas con muchos meses.
- Componentes: `Drawer` (Esc, X o clic fuera), `FranjaEstado`, `NotaInfo` (ⓘ con popover),
  `SelectorMeses` (meses sueltos con atajos que da la app y rejilla por año), `RailInterruptor` y
  `RailBuscador` (lista larga con buscador que declara el recorte, §13.5).
- Hooks: `useUrlState` (§13.7) y `useAncho`.
- `DashboardShell`: pestañas agrupadas por pregunta (`Vista.grupo`), compactas y en dos líneas si no
  caben.
- `DataTable`: render propio por columna, barra y sparkline, decimales y ayuda en la cabecera, tipo
  `deltaMoney`, fila de totales, clic y fila activa, filas expandibles (`subFilas`) con CSV del árbol,
  paginación por filas de primer nivel y cifras sin partir.
- `KpiTile`: `detalle`, `sufijoDelta` (Δ frente a un periodo nombrado, §13.4), `decimales`, `onClick`
  y ancho completo. `DeltaBadge` acepta `decimales`.
- Tema: `SERIES_EXTENDIDA` y `colorSerie(i)` (20 colores para cuando hacen falta más de 6 series con
  identidad; por encima de 6 el design system recomienda plegar a "Otros", §13.3.1). Gris de
  comparación por modo en `useChartChrome().deemphasis`.
- Formato: `fmtDelta`/`fmtDeltaPp` con decimales y `fmtDeltaMoney`.
