import { ResponsiveMarimekko } from "@nivo/marimekko";
import type { CustomLayerProps } from "@nivo/marimekko";
import { fmtCompact, fmtPct } from "../format";
import { useNivoTheme } from "../theme";

export interface FilaMekko {
  canal: string;
  leads: number;
  opps: number;
  mqlSinOpp: number;
  sinCualificar: number;
}

const DIMENSIONES = [
  { id: "Con oportunidad", value: "opps" },
  { id: "MQL sin oportunidad", value: "mqlSinOpp" },
  { id: "Sin cualificar", value: "sinCualificar" },
];
const COLORES = ["#EB1C79", "#6538E0", "#EBEBEB"];

/** Volumen × calidad (@nivo/marimekko): el ANCHO de cada columna es el volumen
    de leads del canal; la ALTURA (100 %) se reparte por lo que pasó con ellos.
    Un canal ancho y claro = mucho volumen, poca calidad — de un vistazo. */
export function MarimekkoCanales({ filas, height = 420 }: { filas: FilaMekko[]; height?: number }) {
  const nivoTheme = useNivoTheme();
  if (!filas.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;

  // El eje inferior nativo muestra el acumulado de leads (sin lectura útil):
  // esta capa pone el NOMBRE del canal bajo su columna, rotado si es estrecha.
  const capaNombres = ({ bars }: CustomLayerProps<FilaMekko>) => {
    const columnas = new Map<string, { x: number; width: number; fondo: number }>();
    for (const b of bars) {
      const c = columnas.get(String(b.datum.id));
      const fondo = Math.max(c?.fondo ?? 0, b.y + b.height);
      columnas.set(String(b.datum.id), { x: b.datum.x, width: b.datum.width, fondo });
    }
    return (
      <g>
        {[...columnas.entries()].map(([canal, c]) => {
          const cx = c.x + c.width / 2;
          const estrecha = c.width < 76;
          return (
            <text
              key={canal}
              x={cx}
              y={c.fondo + 14}
              fontSize={11}
              fill="#525252"
              textAnchor={estrecha ? "end" : "middle"}
              transform={estrecha ? `rotate(-28 ${cx} ${c.fondo + 14})` : undefined}
            >
              {canal}
            </text>
          );
        })}
      </g>
    );
  };

  return (
    <div style={{ height }}>
      <ResponsiveMarimekko
        data={filas}
        theme={nivoTheme as never}
        id="canal"
        value="leads"
        dimensions={DIMENSIONES}
        layout="vertical"
        offset="expand"
        margin={{ top: 8, right: 150, bottom: 76, left: 44 }}
        colors={COLORES}
        borderWidth={2}
        borderColor="#FFFFFF"
        layers={["grid", "axes", "bars", capaNombres, "legends"]}
        axisBottom={null}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: [0, 0.25, 0.5, 0.75, 1],
          format: (v: number) => `${Math.round(v * 100)} %`,
        }}
        enableGridY={false}
        tooltip={({ bar }) => {
          const d = bar.datum as unknown as FilaMekko;
          return (
            <div className="rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-md">
              <div className="mb-0.5 font-medium text-ink-deep">{d.canal}</div>
              <div className="tnum text-subtle">
                {fmtCompact(d.leads)} leads · <span style={{ color: bar.color }}>■</span> {bar.id}:{" "}
                <strong className="text-ink">{fmtCompact(bar.value)}</strong>{" "}
                ({fmtPct(d.leads ? bar.value / d.leads : null)})
              </div>
            </div>
          );
        }}
        legends={[
          {
            anchor: "top-right",
            direction: "column",
            translateX: 144,
            itemWidth: 130,
            itemHeight: 18,
            itemsSpacing: 2,
            symbolSize: 10,
            symbolShape: "square",
          },
        ]}
        animate={false}
      />
    </div>
  );
}
