import { ResponsiveChoropleth } from "@nivo/geo";
import world from "../geo/world_countries.json";
import { fmtCompact, fmtCompactMoney } from "../format";
import { useNivoTheme, RAMPA_MAGENTA } from "../theme";

export interface DatoPais {
  id: string; // ISO-3
  value: number;
  nombre: string;
}

/** Mapa mundial (@nivo/geo choropleth): magnitud por país real, escala
    secuencial de un tono. */
export function ChoroplethMundo({
  datos,
  esMoneda = false,
  height = 480,
}: {
  datos: DatoPais[];
  esMoneda?: boolean;
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  const max = Math.max(...datos.map((d) => d.value), 1);
  const fmt = esMoneda ? fmtCompactMoney : fmtCompact;
  const nombrePor = Object.fromEntries(datos.map((d) => [d.id, d.nombre]));
  return (
    <div style={{ height }}>
      <ResponsiveChoropleth
        data={datos}
        features={(world as { features: object[] }).features as never}
        theme={nivoTheme as never}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors={RAMPA_MAGENTA}
        domain={[0, max]}
        unknownColor="#F4F4F4"
        label="properties.name"
        valueFormat={(v: number) => fmt(v)}
        projectionScale={118}
        projectionTranslation={[0.5, 0.62]}
        borderWidth={0.4}
        borderColor="#FFFFFF"
        tooltip={({ feature }) => {
          const f = feature as unknown as { id: string; data?: { value: number }; properties: { name: string } };
          if (!f.data) return null;
          return (
            <div className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs shadow-md">
              <span className="font-medium text-ink-deep">{nombrePor[f.id] ?? f.properties.name}</span>{" "}
              <span className="tnum font-semibold text-ink">{fmt(f.data.value)}</span>
            </div>
          );
        }}
      />
    </div>
  );
}
