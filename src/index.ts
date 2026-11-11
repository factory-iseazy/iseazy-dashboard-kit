/* Punto de entrada único del dashboard-kit. Las apps importan SIEMPRE desde aquí
   (`@iseazy/dashboard-kit`), nunca de rutas internas: así la extracción a su propio repo no
   obliga a tocar ninguna app. */

// Shell y modo claro/oscuro
export { DashboardShell, FreshnessBadge, FullScreenMessage } from "./shell/DashboardShell";
export type { EstadoDato, Frescura, Vista } from "./shell/DashboardShell";
export { ThemeModeProvider, useThemeMode, THEME_STORAGE_KEY } from "./shell/themeMode";
export type { ThemeMode } from "./shell/themeMode";
export { ThemeToggle } from "./shell/ThemeToggle";

// Rail de filtros
export { FilterRail, RailBuscador, RailGroup, RailInterruptor, RailOption } from "./FilterRail";

// Hooks
export { useAncho, useUrlState } from "./hooks";

// Tema y formato
export {
  SERIES,
  SERIES_EXTENDIDA,
  colorSerie,
  DEEMPHASIS,
  STATUS,
  PRODUCTO_COLOR,
  RAMPA_MAGENTA,
  chartChrome,
  nivoThemeFor,
  useNivoTheme,
  useChartChrome,
} from "./theme";
export * from "./format";

// Componentes
export { ChartCard, EmptyState } from "./ChartCard";
export { DataTable } from "./DataTable";
export type { ColumnaDef, Fila, TipoColumna } from "./DataTable";
export { Drawer } from "./Drawer";
export { FranjaEstado } from "./FranjaEstado";
export type { ElementoEstado, TonoEstado } from "./FranjaEstado";
export { NotaInfo } from "./NotaInfo";
export { DeltaBadge } from "./DeltaBadge";
export { InsightCard } from "./InsightCard";
export type { InsightVariant } from "./InsightCard";
export { KpiTile } from "./KpiTile";
export { Segmented } from "./Segmented";
export { SelectorMeses } from "./SelectorMeses";
export type { PresetMeses } from "./SelectorMeses";
export { Sparkline } from "./Sparkline";

// Formas de gráfica (design system §13.4)
export * from "./charts/AreaBumpCanales";
export * from "./charts/AreaTemporal";
export * from "./charts/BarrasCascada";
export * from "./charts/BarrasVariacion";
export * from "./charts/MultiplesArea";
export { mesTexto } from "./charts/escala";
export * from "./charts/BarrasAgrupadas";
export * from "./charts/BarrasApiladas";
export * from "./charts/BulletKpi";
export * from "./charts/BumpRanking";
export * from "./charts/CalendarioDiario";
export * from "./charts/ChoroplethMundo";
export * from "./charts/CirclePackFuentes";
export * from "./charts/FunnelNivo";
export * from "./charts/FunnelSteps";
export * from "./charts/HeatMapMeses";
export * from "./charts/MarimekkoCanales";
export * from "./charts/RadarPaises";
export * from "./charts/RankingBars";
export * from "./charts/SankeyFlow";
export * from "./charts/ScatterFuentes";
export * from "./charts/SwarmTicket";
export * from "./charts/TimeSeries";
export * from "./charts/TreeMapComposicion";
export * from "./charts/WaffleMix";
