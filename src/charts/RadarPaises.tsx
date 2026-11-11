import { ResponsiveRadar } from "@nivo/radar";
import { useNivoTheme } from "../theme";

/** Perfil comparado (@nivo/radar): mismas métricas de conversión (%) para varias
    entidades — máx. 4 series para que siga siendo legible. */
export function RadarPaises({
  filas,
  series,
  colores,
  height = 420,
}: {
  filas: Record<string, string | number>[]; // [{ metrica: "L→MQL", Spain: 39, ... }]
  series: string[];
  colores: string[];
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  if (!filas.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  return (
    <div style={{ height }}>
      <ResponsiveRadar
        data={filas}
        theme={nivoTheme as never}
        keys={series}
        indexBy="metrica"
        margin={{ top: 40, right: 70, bottom: 40, left: 70 }}
        colors={colores}
        maxValue="auto"
        curve="linearClosed"
        gridLevels={4}
        gridShape="circular"
        gridLabelOffset={14}
        dotSize={7}
        dotBorderWidth={2}
        dotBorderColor="#FFFFFF"
        fillOpacity={0.12}
        blendMode="multiply"
        valueFormat={(v: number) => `${Math.round(v)} %`}
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            translateX: -50,
            translateY: -30,
            itemWidth: 80,
            itemHeight: 18,
            symbolSize: 10,
            symbolShape: "circle",
          },
        ]}
        animate={false}
      />
    </div>
  );
}
