/* Tema central de gráficas: el ÚNICO sitio donde se decide el color y el estilo de los datos.
   Paleta categórica = design system §13.3 (CHART_DASH, validada para daltonismo sobre fondo
   CLARO). El cromo de las gráficas (ejes, rejilla, texto) cambia con el modo claro/oscuro y
   sale de los tokens §2.2/§2.8. La paleta de SERIES para fondo oscuro está pendiente de validar
   (ver KIT.md, deuda heredada): hasta entonces se usa la clara en ambos modos. */

import { useThemeMode, type ThemeMode } from "./shell/themeMode";

export const SERIES = ["#EB1C79", "#03A0F4", "#C99A0F", "#6538E0", "#73C13C", "#89239B"] as const;

function mezclar(hex: string, con: string, t: number): string {
  const a = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  const b = con.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

/** Paleta ampliada para cuando hay MÁS de 6 series con identidad propia (p. ej. el top 20 de clientes
    heredado de la tool anterior): las 6 de §13.3, sus tintes (35 % hacia blanco) y sus sombras (30 %
    hacia negro). Es una extensión del kit, no del design system: por encima de 6 series la doctrina
    recomienda plegar a "Otros" (§13.3.1). Se usa solo donde la funcionalidad heredada lo exige. */
export const SERIES_EXTENDIDA: readonly string[] = [
  ...SERIES,
  ...SERIES.map((c) => mezclar(c, "#FFFFFF", 0.35)),
  ...SERIES.map((c) => mezclar(c, "#000000", 0.3)),
  "#83919B",
  "#ACACAC",
];

/** Color de la serie i-ésima (cicla por la paleta ampliada). */
export const colorSerie = (i: number) => SERIES_EXTENDIDA[i % SERIES_EXTENDIDA.length];

/** Serie de contexto/comparación: gris recesivo, nunca compite con la actual. */
export const DEEMPHASIS = "#D1D1D1";

export const STATUS = {
  positivo: "#73C13C",
  negativo: "#DC3545",
  aviso: "#C99A0F",
  info: "#03A0F4",
} as const;

/** Identidad fija por producto isEazy (§2.3): el color sigue a la entidad, no al ranking. */
export const PRODUCTO_COLOR: Record<string, string> = {
  author: "#EB1C79", factory: "#3B189B", skills: "#C99A0F", lms: "#03A0F4",
  engage: "#6538E0", game: "#73C13C", esg: "#89239B", brain: "#03A0F4",
  iseazy: "#83919B", sin_producto: "#ACACAC",
};

/** Rampa secuencial magenta (magnitud: claro→oscuro) para heatmap/choropleth (§13.3 DASH_SEQ). */
export const RAMPA_MAGENTA = ["#FDECF4", "#F8B4D0", "#F06BA6", "#EB1C79", "#BC1661", "#670933"];

/** Cromo de las gráficas por modo. Claro = valores de la semilla; oscuro = tokens §2.8. */
const CROMO: Record<ThemeMode, { grid: string; axisText: string; ink: string; subtle: string; surface: string; deemphasis: string }> = {
  light: { grid: "#EFEFEF", axisText: "#83919B", ink: "#333333", subtle: "#525252", surface: "#FFFFFF", deemphasis: DEEMPHASIS },
  // deemphasis en oscuro = token line-strong de §2.8 (el #D1D1D1 destaca demasiado sobre #1C1F24)
  dark: { grid: "#24272E", axisText: "#999999", ink: "#F4F4F4", subtle: "#BFBFBF", surface: "#1C1F24", deemphasis: "#525252" },
};

export function chartChrome(mode: ThemeMode) {
  return CROMO[mode];
}

/** Tema Nivo para un modo: tipografía y cromo recesivo iguales en toda gráfica. */
export function nivoThemeFor(mode: ThemeMode) {
  const c = CROMO[mode];
  return {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: 11,
    textColor: c.axisText,
    text: { fill: c.axisText, fontSize: 11 },
    axis: {
      ticks: { line: { stroke: "transparent" }, text: { fill: c.axisText, fontSize: 11 } },
      domain: { line: { stroke: "transparent" } },
      legend: { text: { fill: c.subtle, fontSize: 11 } },
    },
    grid: { line: { stroke: c.grid, strokeWidth: 1 } },
    legends: { text: { fill: c.subtle } },
    crosshair: { line: { stroke: c.subtle, strokeWidth: 1, strokeOpacity: 0.45, strokeDasharray: "0" } },
    tooltip: { container: { background: "transparent", boxShadow: "none", padding: 0 } },
  } as const;
}

/** Tema Nivo del modo activo. Llamarlo al principio del componente, antes de cualquier return. */
export function useNivoTheme() {
  return nivoThemeFor(useThemeMode().mode);
}

/** Colores de cromo del modo activo, para capas y marcas dibujadas a mano. */
export function useChartChrome() {
  return chartChrome(useThemeMode().mode);
}
