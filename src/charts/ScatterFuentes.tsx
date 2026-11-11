import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { fmtCompact, fmtPct } from "../format";
import { useNivoTheme } from "../theme";

export interface PuntoFuente {
  fuente: string;
  leads: number;
  conversion: number; // fracción 0-1 (lead → oportunidad)
  mqls: number;
}

/** Mapa volumen × conversión (@nivo/scatterplot): cada punto es una fuente.
    Arriba-derecha = escalar; arriba-izquierda = joyas por descubrir;
    abajo-derecha = volumen que no convierte. Eje X logarítmico. */
export function ScatterFuentes({
  puntos,
  mediaConversion,
  height = 440,
}: {
  puntos: PuntoFuente[];
  mediaConversion: number;
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  if (!puntos.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  // Límites explícitos y redondos: sin ellos el eje log de nivo puede salir invertido
  const minLeads = 10 ** Math.floor(Math.log10(Math.min(...puntos.map((p) => p.leads))));
  const maxLeads = 10 ** Math.ceil(Math.log10(Math.max(...puntos.map((p) => p.leads))));
  const ticksLog: number[] = [];
  for (let v = minLeads; v <= maxLeads; v *= 10) ticksLog.push(v, v * 3);
  const data = [
    {
      id: "fuentes",
      data: puntos.map((p) => ({ x: p.leads, y: p.conversion * 100, fuente: p.fuente, mqls: p.mqls })),
    },
  ];
  return (
    <div style={{ height }}>
      <ResponsiveScatterPlot
        data={data}
        theme={nivoTheme as never}
        margin={{ top: 16, right: 24, bottom: 48, left: 48 }}
        xScale={{ type: "log", base: 10, min: minLeads, max: maxLeads }}
        yScale={{ type: "linear", min: 0, max: "auto" }}
        colors={["#EB1C79"]}
        nodeSize={(n: { data: { mqls: number } }) => 6 + Math.min(14, Math.sqrt(n.data.mqls))}
        blendMode="multiply"
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickValues: ticksLog.filter((v) => v <= maxLeads),
          legend: "Leads (escala log)",
          legendPosition: "middle",
          legendOffset: 38,
          format: (v: number) => fmtCompact(v),
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: 5,
          legend: "Lead → Oportunidad",
          legendPosition: "middle",
          legendOffset: -40,
          format: (v: number) => `${v} %`,
        }}
        gridYValues={5}
        enableGridX={false}
        markers={[
          {
            axis: "y",
            value: mediaConversion * 100,
            lineStyle: { stroke: "#ABB8C3", strokeWidth: 1, strokeDasharray: "5 4" },
            legend: `media ${fmtPct(mediaConversion)}`,
            legendPosition: "top-right",
            textStyle: { fontSize: 10, fill: "#83919B" },
          },
        ]}
        tooltip={({ node }) => {
          const d = node.data as unknown as { fuente: string; x: number; y: number; mqls: number };
          return (
            <div className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs shadow-md">
              <span className="font-medium text-ink-deep">{d.fuente}</span>{" "}
              <span className="tnum text-subtle">
                {fmtCompact(d.x)} leads · {d.y.toFixed(1).replace(".", ",")} % a oportunidad · {fmtCompact(d.mqls)} MQL
              </span>
            </div>
          );
        }}
        animate={false}
      />
    </div>
  );
}
