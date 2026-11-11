import { ResponsiveSwarmPlot } from "@nivo/swarmplot";
import { fmtCompactMoney, fmtMoney } from "../format";
import { useNivoTheme } from "../theme";

export interface PuntoDeal {
  id: string;
  group: string; // producto (label)
  importe: number;
  color: string;
}

/** Distribución real del ticket (@nivo/swarmplot): cada punto es un deal ganado.
    Descubre lo que el ticket medio esconde: colas, outliers y productos con dos
    poblaciones de precio. El eje plotea log10(importe) (la escala del componente
    solo es lineal) y se re-etiqueta en euros — así conviven 500 € y 200 k€. */
export function SwarmTicket({ deals, height = 440 }: { deals: PuntoDeal[]; height?: number }) {
  const nivoTheme = useNivoTheme();
  if (!deals.length) return <p className="py-6 text-center text-sm text-soft">Sin deals ganados en este corte.</p>;
  const grupos = [...new Set(deals.map((d) => d.group))];
  const colorPor: Record<string, string> = {};
  for (const d of deals) colorPor[d.group] = d.color;
  const conLog = deals.map((d) => ({ ...d, logImporte: Math.log10(Math.max(d.importe, 1)) }));
  const lo = Math.floor(Math.min(...conLog.map((d) => d.logImporte)));
  const hi = Math.ceil(Math.max(...conLog.map((d) => d.logImporte)));
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  return (
    <div style={{ height }}>
      <ResponsiveSwarmPlot
        data={conLog}
        theme={nivoTheme as never}
        groups={grupos}
        value="logImporte"
        valueScale={{ type: "linear", min: lo, max: hi }}
        size={7}
        spacing={1.5}
        colors={(n: { group: string }) => colorPor[n.group] ?? "#ABB8C3"}
        colorBy="group"
        borderWidth={1}
        borderColor="#FFFFFF"
        margin={{ top: 12, right: 24, bottom: 44, left: 66 }}
        axisBottom={{ tickSize: 0, tickPadding: 10 }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 6,
          tickValues: ticks,
          format: (v: number) => fmtCompactMoney(10 ** v),
        }}
        gridYValues={ticks}
        axisTop={null}
        axisRight={null}
        enableGridY
        tooltip={({ data }) => {
          const d = data as unknown as PuntoDeal;
          return (
            <div className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs shadow-md">
              <span className="font-medium text-ink-deep">{d.group}</span>{" "}
              <span className="tnum font-semibold text-ink">{fmtMoney(d.importe)}</span>
            </div>
          );
        }}
        animate={false}
      />
    </div>
  );
}
