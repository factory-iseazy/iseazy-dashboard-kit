import { ResponsiveBullet } from "@nivo/bullet";
import { useNivoTheme } from "../theme";

/** KPI vs. objetivo (@nivo/bullet): barra = real, marcador = objetivo, tramos
    de fondo = 60 % / 100 % / 120 % del objetivo (mismo tono, más claro). */
export function BulletKpi({
  label,
  valorStr,
  actual,
  objetivo,
  color,
  height = 64,
}: {
  label: string;
  valorStr: string;
  actual: number;
  objetivo: number;
  color: string;
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  const pct = objetivo ? Math.round((actual / objetivo) * 100) : null;
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-subtle">{label}</span>
        <span className="tnum text-xs text-soft">
          {pct != null ? `${pct} % del objetivo` : "sin objetivo"}
        </span>
      </div>
      <div className="mb-1 text-2xl font-semibold leading-none tracking-tight text-ink-deep">{valorStr}</div>
      {/* overflow-hidden recorta el eje de ticks del bullet (sin API para ocultarlo);
          el medidor se lee por el marcador de objetivo + el % del rótulo, no por escala */}
      <div style={{ height: height - 30, overflow: "hidden" }}>
        <div style={{ height }}>
        <ResponsiveBullet
          data={[
            {
              id: "",
              ranges: [objetivo * 0.6, objetivo, Math.max(objetivo * 1.2, actual * 1.05)],
              measures: [actual],
              markers: [objetivo],
            },
          ]}
          theme={nivoTheme as never}
          margin={{ top: 8, right: 4, bottom: 22, left: 4 }}
          layout="horizontal"
          titlePosition="before"
          titleOffsetX={0}
          rangeColors={["#F4F4F4", "#EBEBEB", "#F8F8F8"]}
          measureColors={[color]}
          markerColors={["#212529"]}
          measureSize={0.32}
          markerSize={0.9}
          isInteractive={false} /* el tooltip del bullet se recortaba con el clip del eje; el dato ya está impreso arriba */
          animate={false}
        />
        </div>
      </div>
    </div>
  );
}
