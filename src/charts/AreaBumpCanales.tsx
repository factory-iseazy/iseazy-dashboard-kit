import { ResponsiveAreaBump } from "@nivo/bump";
import { useNivoTheme } from "../theme";

// Mismos typings quisquillosos que ResponsiveBump en 0.87 — cast local.
const AreaBump = ResponsiveAreaBump as unknown as React.FC<Record<string, unknown>>;

export interface SerieAreaBump {
  id: string;
  color: string;
  data: { x: string; y: number }[]; // y = volumen (el área codifica el peso)
}

/** Peso de cada serie en el tiempo (@nivo/bump AreaBump): combina volumen
    (grosor del área) y ranking (posición vertical) en una sola lectura. */
export function AreaBumpCanales({ series, height = 380 }: { series: SerieAreaBump[]; height?: number }) {
  const nivoTheme = useNivoTheme();
  if (!series.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  const colorPor = Object.fromEntries(series.map((s) => [s.id, s.color]));
  return (
    <div style={{ height }}>
      <AreaBump
        data={series.map(({ id, data }) => ({ id, data }))}
        theme={nivoTheme as never}
        margin={{ top: 16, right: 150, bottom: 28, left: 150 }}
        colors={(s: { id: string }) => colorPor[s.id] ?? "#ABB8C3"}
        spacing={6}
        blendMode="normal"
        fillOpacity={0.82}
        activeFillOpacity={0.95}
        inactiveFillOpacity={0.15}
        borderWidth={0}
        startLabel={(s: { id: string }) => s.id}
        endLabel={(s: { id: string }) => s.id}
        axisTop={null}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        animate={false}
      />
    </div>
  );
}
