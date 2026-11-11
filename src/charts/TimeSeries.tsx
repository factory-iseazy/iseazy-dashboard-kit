import { ResponsiveLine } from "@nivo/line";
import { fmtCompact, fmtMes } from "../format";
import { DEEMPHASIS, useNivoTheme } from "../theme";

export interface SerieTemporal {
  id: string;
  color: string;
  /** misma longitud que `meses`; la serie de comparación va en gris recesivo */
  valores: number[];
  deemphasis?: boolean;
}

/** Forma "serie temporal" del kit: línea 2px, área 10% solo en la serie
    protagonista, crosshair + tooltip único con todas las series en esa X. */
export function TimeSeries({
  meses,
  series,
  formato = fmtCompact,
  height = 240,
}: {
  meses: string[];
  series: SerieTemporal[];
  formato?: (v: number) => string;
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  const data = series.map((s) => ({
    id: s.id,
    data: meses.map((m, i) => ({ x: fmtMes(m), y: s.valores[i] ?? 0 })),
  }));
  const colorPor = Object.fromEntries(series.map((s) => [s.id, s.deemphasis ? DEEMPHASIS : s.color]));
  const cadaN = Math.max(1, Math.ceil(meses.length / 10));

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={data}
        theme={nivoTheme as never}
        colors={(s: { id: string | number }) => colorPor[s.id] ?? DEEMPHASIS}
        margin={{ top: 10, right: 26, bottom: 26, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 0, max: "auto", nice: true }}
        lineWidth={2}
        curve="monotoneX"
        enablePoints={false}
        enableArea={series.length === 1} /* el wash solo cuando no ensucia la comparación */
        areaOpacity={0.08}
        defs={[]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          format: (v: string) => (meses.findIndex((m) => fmtMes(m) === v) % cadaN === 0 ? v : ""),
        }}
        axisLeft={{ tickSize: 0, tickPadding: 6, tickValues: 4, format: (v: number) => fmtCompact(v) }}
        gridYValues={4}
        enableGridX={false}
        enableSlices="x"
        sliceTooltip={({ slice }) => (
          <div className="rounded-lg border border-line bg-card px-3 py-2 shadow-md">
            <div className="mb-1 text-[11px] font-medium text-soft">
              {String(slice.points[0]?.data.x)}
            </div>
            {slice.points.map((p) => (
              <div key={p.id} className="flex items-center gap-2 py-0.5">
                <span aria-hidden className="inline-block h-0.5 w-3.5 rounded" style={{ background: p.serieColor }} />
                <span className="tnum text-sm font-semibold text-ink">
                  {formato(Number(p.data.y))}
                </span>
                <span className="text-xs text-soft">
                  {String(p.serieId)}
                </span>
              </div>
            ))}
          </div>
        )}
        animate={false}
        isInteractive
      />
    </div>
  );
}
