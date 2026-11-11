import { ResponsiveBar } from "@nivo/bar";
import { fmtCompact, fmtInt } from "../format";
import { useNivoTheme } from "../theme";

/** Barras agrupadas (@nivo/bar, `groupMode="grouped"`): una categoría por eje X y varias series
    lado a lado, para comparar estados o series en cada periodo (p. ej. vencimientos por mes y estado).
    Leyenda fuera de la gráfica, en la app, con los mismos colores. */
export function BarrasAgrupadas({
  datos,
  claves,
  colores,
  formato = fmtInt,
  formatoEje = fmtCompact,
  height = 300,
  indice = "mes",
}: {
  datos: Record<string, string | number>[];
  claves: string[];
  colores: Record<string, string>;
  formato?: (v: number) => string;
  formatoEje?: (v: number) => string;
  height?: number;
  indice?: string;
}) {
  const nivoTheme = useNivoTheme();
  if (!datos.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={datos}
        theme={nivoTheme as never}
        keys={claves}
        indexBy={indice}
        groupMode="grouped"
        margin={{ top: 8, right: 16, bottom: 30, left: 56 }}
        padding={0.3}
        innerPadding={2}
        colors={(bar: { id: string | number }) => colores[String(bar.id)] ?? "#ABB8C3"}
        borderRadius={3}
        enableLabel={false}
        enableGridY
        gridYValues={4}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{ tickSize: 0, tickPadding: 6, tickValues: 4, format: (v: number) => formatoEje(v) }}
        valueFormat={(v: number) => formato(v)}
        tooltip={({ id, value, indexValue, color }) => (
          <div className="rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-md">
            <div className="mb-0.5 text-[11px] text-soft">{String(indexValue)}</div>
            <span className="inline-flex items-center gap-1.5 text-ink">
              <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: color }} />
              <span className="font-semibold tnum">{formato(Number(value))}</span> {String(id)}
            </span>
          </div>
        )}
        animate={false}
      />
    </div>
  );
}
