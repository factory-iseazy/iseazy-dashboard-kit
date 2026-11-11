import { ResponsiveBar } from "@nivo/bar";
import { fmtCompact, fmtInt } from "../format";
import { useChartChrome, useNivoTheme } from "../theme";

/** Composición temporal (@nivo/bar apilado): una barra por mes, segmentos por
    categoría (identidad en la leyenda + tooltip; gap blanco entre segmentos). */
export function BarrasApiladas({
  datos,
  claves,
  colores,
  height = 380,
}: {
  datos: Record<string, string | number>[];
  claves: string[];
  colores: Record<string, string>;
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  const c = useChartChrome();
  if (!datos.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  const cadaN = Math.max(1, Math.ceil(datos.length / 12)); // con muchos meses, una etiqueta de cada N
  const etiquetas = datos.map((d) => String(d.mes));
  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={datos}
        theme={nivoTheme as never}
        keys={claves}
        indexBy="mes"
        groupMode="stacked"
        margin={{ top: 8, right: 210, bottom: 30, left: 44 }}
        padding={0.35}
        colors={(bar: { id: string | number }) => colores[String(bar.id)] ?? "#ABB8C3"}
        borderWidth={1}
        borderColor={c.surface}
        enableLabel={false}
        enableGridY
        gridYValues={4}
        axisBottom={{ tickSize: 0, tickPadding: 8, format: (v: string) => (etiquetas.indexOf(String(v)) % cadaN === 0 ? v : "") }}
        axisLeft={{ tickSize: 0, tickPadding: 6, tickValues: 4, format: (v: number) => fmtCompact(v) }}
        valueFormat={(v: number) => fmtInt(v)}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 204,
            itemWidth: 190,
            itemHeight: 17,
            itemsSpacing: 1,
            symbolSize: 10,
            symbolShape: "square",
          },
        ]}
        animate={false}
      />
    </div>
  );
}
