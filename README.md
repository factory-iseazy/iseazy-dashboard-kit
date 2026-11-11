# iseazy-dashboard-kit

Kit compartido para los **dashboards de datos** de isEazy: shell con modo claro/oscuro, rail de
filtros, componentes (KPI, tablas, cards, deltas, drawer) y formas de gráfica sobre Nivo.

Es la capa de **código** de un sistema de tres capas:

| Capa | Dónde | Cómo se usa |
|---|---|---|
| **Doctrina**: qué gráfica para qué pregunta, paleta, reglas | [`iseazy-design-system`](https://github.com/factory-iseazy/iseazy-design-system), §13 (Modo dashboard) | Se lee en vivo |
| **Código**: componentes, gráficas, shell, tema | Este repo, paquete `@iseazy/dashboard-kit` | Dependencia por versión (tag) |
| **Esqueleto**: servidor, despliegue, documentos | Futura plantilla de dashboard | Se copia al crear la tool |

**Estado:** v0.1.0. Ver [CHANGELOG.md](CHANGELOG.md) y la deuda pendiente más abajo.

---

## Requisitos de la app que lo usa

- **React 18** y **TypeScript** con `"moduleResolution": "bundler"` y `"jsx": "react-jsx"`.
- **Vite** con **Tailwind CSS v4** (`@tailwindcss/vite`).
- El kit se distribuye como **código fuente TypeScript**, sin compilar: lo compila el build de la
  app. Por eso los requisitos de arriba no son opcionales.

## Instalar

En el `package.json` de la app, con el **tarball del tag** (fija la versión exacta):

```json
"dependencies": {
  "@iseazy/dashboard-kit": "https://github.com/factory-iseazy/iseazy-dashboard-kit/archive/refs/tags/v0.1.0.tar.gz"
}
```

Y después `npm install`, y se sube el `package-lock.json`. Para subir de versión se cambia el tag de
la URL y se vuelve a instalar.

**No uses la forma `github:factory-iseazy/iseazy-dashboard-kit#v0.1.0`**: npm la descarga con git, y
las imágenes `node:*-slim` y `node:*-alpine` que usan los Dockerfile de las tools no lo traen, así
que el build de despliegue falla. El tarball se descarga por HTTPS y no necesita git (D-005).

## Usar

```css
/* styles.css de la app: el kit DESPUÉS de Tailwind */
@import "tailwindcss";
@import "@iseazy/dashboard-kit/styles.css";
```

```tsx
// main.tsx
import { ThemeModeProvider } from "@iseazy/dashboard-kit";
// <ThemeModeProvider><App /></ThemeModeProvider>
```

```tsx
import { DashboardShell, FilterRail, RailGroup, RailOption, KpiTile, ChartCard } from "@iseazy/dashboard-kit";
```

Se importa **siempre** desde `@iseazy/dashboard-kit`, nunca desde rutas internas del paquete.

El `index.html` de la app aplica el modo antes de pintar, para que no parpadee. Usa la misma clave
que `ThemeModeProvider` (`THEME_STORAGE_KEY`):

```html
<script>
  (function () {
    var modo = null;
    try { modo = localStorage.getItem("iseazy-ds-theme"); } catch (e) {}
    if (modo !== "dark" && modo !== "light") {
      modo = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (modo === "dark") document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = modo;
  })();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

## Contenido

| Grupo | Piezas |
|---|---|
| Shell | `DashboardShell` (header con logo, nombre, vistas agrupadas por `grupo`, frescura y toggle), `FreshnessBadge`, `FullScreenMessage`, `ThemeModeProvider`/`useThemeMode`, `ThemeToggle` |
| Rail de filtros | `FilterRail`, `RailGroup`, `RailOption`, `RailInterruptor`, `RailBuscador`. Qué filtros hay lo decide cada app |
| Componentes | `KpiTile`, `DeltaBadge`, `Sparkline`, `ChartCard`, `EmptyState`, `InsightCard`, `DataTable`, `Segmented`, `SelectorMeses`, `Drawer`, `FranjaEstado`, `NotaInfo` |
| Hooks | `useUrlState` (estado de filtros en la URL, §13.7), `useAncho` (ancho del contenedor para SVG) |
| Tema y formato | `SERIES`, `SERIES_EXTENDIDA`/`colorSerie`, `DEEMPHASIS`, `STATUS`, `PRODUCTO_COLOR`, `RAMPA_MAGENTA`, `useNivoTheme`, `useChartChrome`, formatos es-ES (`fmtInt`, `fmtMoney`, `fmtPct`…) |
| Gráficas | `AreaTemporal`, `MultiplesArea`, `BarrasVariacion`, `BarrasCascada`, `BarrasAgrupadas`, `BarrasApiladas`, `TimeSeries`, `RankingBars`, `BulletKpi`, `FunnelSteps`, `FunnelNivo`, `HeatMapMeses`, `SankeyFlow`, `ChoroplethMundo`, `WaffleMix`, `BumpRanking`, `TreeMapComposicion`, `CalendarioDiario` y seis heredadas pendientes de generalizar (ver deuda) |

## Cómo se cambia el kit

- **El kit solo se cambia en este repo.** Si una tool necesita una pieza, se construye aquí, se
  publica un tag nuevo y la tool sube de versión. Nada de componentes casi iguales dentro de las
  tools: se mejora el que hay.
- El kit **no importa nada** de ninguna app.
- Todo componente nuevo funciona en **claro y oscuro** desde que nace.
- **Nombres genéricos** (regla 2 del design system): nada de nombres de un caso de uso concreto.
- Las gráficas llaman a `useNivoTheme()` **al principio** del componente, antes de cualquier `return`.
- Antes de subir: `npm install` y `npm run typecheck`.
- Cada cambio se anota en [CHANGELOG.md](CHANGELOG.md) y cada decisión en
  [docs/DECISIONS.md](docs/DECISIONS.md), en el mismo commit.
- Si algo necesita una decisión de diseño (tokens, paleta, patrones), no se resuelve aquí: issue en
  [`iseazy-design-system`](https://github.com/factory-iseazy/iseazy-design-system/issues).

### Versiones

`vMAYOR.MENOR.PARCHE`. **Parche**: arregla sin cambiar cómo se usa. **Menor**: añade piezas o
props opcionales. **Mayor**: rompe algo que una app ya usa (cambiar un nombre o una prop
obligatoria). Mientras se desarrolla una pieza nueva, la app puede apuntar a una rama; **antes de
desplegar, siempre a un tag**.

## Deuda pendiente

Por prioridad. Lo marcado ⚑ requiere una decisión del design system.

1. ⚑ **Paleta de series para fondo oscuro.** `SERIES` (§13.3) está validada sobre fondo claro; el
   propio §13.2 dice que sobre fondo oscuro no pasa la validación. Mientras tanto se usa la clara en
   los dos modos.
2. **Colores fijos en las gráficas** (unos 40: bordes `#FFFFFF`, `blendMode="multiply"`, etiquetas
   `#525252`, grises de cola). En oscuro se ven mal. Pasarlos a `useChartChrome()`.
3. **`STATUS` por modo** y las gráficas Nivo heredadas. `DEEMPHASIS` ya está resuelto en las
   gráficas SVG propias y en `Sparkline`.
4. **Seis gráficas con nombre y forma de datos de un caso concreto**: `RadarPaises`,
   `AreaBumpCanales`, `CirclePackFuentes`, `MarimekkoCanales`, `ScatterFuentes` y `SwarmTicket`.
   Generalizar nombre y props. Es un cambio mayor: se hará con su versión y aviso a las apps.
5. **Showroom**: catálogo vivo de todas las piezas con datos de demostración y controles (modo,
   tamaño, variantes), para ver y probar el kit sin una app real.
6. **Tamaño del bundle** (unos 580 kB con todo Nivo): separar en trozos si crece.
