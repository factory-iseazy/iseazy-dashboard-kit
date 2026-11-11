import { ResponsiveHeatMap } from "@nivo/heatmap";
import { fmtCompact } from "../format";
import { useNivoTheme, RAMPA_MAGENTA } from "../theme";

export interface FilaHeatmap {
  id: string;
  data: { x: string; y: number | null }[];
}

/** Estacionalidad (@nivo/heatmap): dimensión × mes. Cada fila se normaliza a su
    propio máximo (100 % = mejor mes de ESA fila) — sin esto, una fila con un pico
    grande aplasta la lectura de todas las demás. El valor real vive en el tooltip. */
export function HeatMapMeses({ filas, height = 420 }: { filas: FilaHeatmap[]; height?: number }) {
  const nivoTheme = useNivoTheme();
  if (!filas.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;

  const real = new Map<string, number | null>();
  const normalizadas = filas.map((f) => {
    const max = Math.max(...f.data.map((d) => d.y ?? 0), 1);
    return {
      id: f.id,
      data: f.data.map((d) => {
        real.set(`${f.id}|${d.x}`, d.y);
        return { x: d.x, y: d.y == null ? null : Math.round((d.y / max) * 100) };
      }),
    };
  });

  return (
    <div style={{ height }}>
      <ResponsiveHeatMap
        data={normalizadas}
        theme={nivoTheme as never}
        margin={{ top: 28, right: 10, bottom: 8, left: 150 }}
        colors={{ type: "quantize", colors: RAMPA_MAGENTA }}
        emptyColor="#F8F8F8"
        borderRadius={2}
        borderWidth={2}
        borderColor="#FFFFFF"
        enableLabels={false}
        axisTop={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{ tickSize: 0, tickPadding: 8 }}
        hoverTarget="cell"
        inactiveOpacity={0.6}
        tooltip={({ cell }) => {
          const v = real.get(`${cell.serieId}|${String(cell.data.x)}`);
          return (
            <div className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs shadow-md">
              <span className="font-medium text-ink-deep">{cell.serieId}</span>{" "}
              <span className="text-soft">· {String(cell.data.x)}</span>{" "}
              <span className="tnum font-semibold text-ink">{v == null ? "—" : fmtCompact(v)} leads</span>{" "}
              <span className="tnum text-soft">({cell.data.y ?? 0} % de su mejor mes)</span>
            </div>
          );
        }}
        animate={false}
      />
    </div>
  );
}
