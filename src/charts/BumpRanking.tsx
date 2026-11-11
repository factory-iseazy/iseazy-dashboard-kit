import { ResponsiveBump } from "@nivo/bump";
import { useNivoTheme } from "../theme";

// Los typings de @nivo/bump 0.87 exigen props que tienen default — cast local.
const Bump = ResponsiveBump as unknown as React.FC<Record<string, unknown>>;

export interface SerieBump {
  id: string;
  color: string;
  data: { x: string; y: number }[]; // y = posición en el ranking (1 = líder)
}

/** Carrera de ranking (@nivo/bump): posición de cada serie mes a mes. La
    identidad la llevan las etiquetas de inicio/fin; el color acompaña. */
export function BumpRanking({ series, height = 400 }: { series: SerieBump[]; height?: number }) {
  const nivoTheme = useNivoTheme();
  if (!series.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  const colorPor = Object.fromEntries(series.map((s) => [s.id, s.color]));
  return (
    <div style={{ height }}>
      <Bump
        data={series.map(({ id, data }) => ({ id, data }))}
        theme={nivoTheme as never}
        margin={{ top: 16, right: 150, bottom: 28, left: 150 }}
        colors={((s: { id: string }) => colorPor[s.id] ?? "#ABB8C3") as never}
        lineWidth={2.5}
        activeLineWidth={4}
        inactiveLineWidth={2}
        inactiveOpacity={0.2}
        pointSize={7}
        activePointSize={10}
        inactivePointSize={0}
        pointColor={{ from: "serie.color" }}
        pointBorderWidth={2}
        pointBorderColor="#FFFFFF"
        startLabel={((s: { id: string }) => s.id) as never}
        endLabel={((s: { id: string }) => s.id) as never}
        axisTop={null}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{ tickSize: 0, tickPadding: 6 }}
        axisRight={null}
        enableGridX={false}
        enableGridY={false}
        animate={false}
      />
    </div>
  );
}

