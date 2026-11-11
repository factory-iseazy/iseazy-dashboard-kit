import { ResponsiveFunnel } from "@nivo/funnel";
import type { FunnelCustomLayerProps, FunnelDatum } from "@nivo/funnel";
import { fmtDeltaPp, fmtInt } from "../format";
import { useNivoTheme, STATUS } from "../theme";

export interface PasoFunnelNivo {
  id: string;
  label: string;
  value: number;
}

export interface ConversionSalto {
  pct: string; // "39 %"
  delta?: number | null; // Δ en pp vs. comparación (fracción, ej. 0.03)
}

/** Variante trapezoidal del embudo (@nivo/funnel) con una capa custom que
    ancla la tasa de conversión de cada salto EN la frontera entre secciones
    (con su Δ en pp) — el dato accionable vive donde ya está el ojo, en vez de
    relegado a chips bajo la gráfica. */
export function FunnelNivo({
  pasos,
  colores,
  conversiones,
  height = 280,
}: {
  pasos: PasoFunnelNivo[];
  colores: string[];
  conversiones?: ConversionSalto[];
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  const capaSaltos = ({ parts }: FunnelCustomLayerProps<FunnelDatum>) => {
    if (!conversiones?.length || parts.length < 2) return null;
    return (
      <g>
        {conversiones.map((c, i) => {
          if (i + 1 >= parts.length) return null;
          const a = parts[i];
          const b = parts[i + 1];
          const y = (a.y1 + b.y0) / 2;
          const xBorde = b.x + b.width / 2; // semiancho de la sección estrecha en la frontera
          const xTexto = xBorde + 26;
          return (
            <g key={i}>
              <line x1={xBorde + 4} y1={y} x2={xTexto - 6} y2={y} stroke="#D1D1D1" strokeWidth={1} />
              <text x={xTexto} y={y - 2} fontSize={13} fontWeight={600} fill="#333333"
                style={{ fontVariantNumeric: "tabular-nums" }}>
                ↳ {c.pct}
              </text>
              {c.delta != null && (
                <text x={xTexto} y={y + 13} fontSize={11} fontWeight={600}
                  fill={c.delta >= 0 ? STATUS.positivo : STATUS.negativo}
                  style={{ fontVariantNumeric: "tabular-nums" }}>
                  {fmtDeltaPp(c.delta)}
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div style={{ height }}>
      <ResponsiveFunnel
        data={pasos}
        theme={nivoTheme as never}
        margin={{ top: 8, right: 96, bottom: 8, left: 8 }}
        colors={colores}
        valueFormat={(v) => fmtInt(Number(v))}
        direction="vertical"
        interpolation="smooth"
        shapeBlending={0.66}
        spacing={2}
        borderWidth={14}
        borderOpacity={0.25}
        labelColor="#FFFFFF"
        enableBeforeSeparators={false}
        enableAfterSeparators={false}
        currentPartSizeExtension={8}
        currentBorderWidth={22}
        layers={["separators", "parts", capaSaltos, "labels", "annotations"]}
        tooltip={({ part }) => (
          <div className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs shadow-md">
            <span className="font-medium text-ink-deep">{String(part.data.label ?? part.data.id)}</span>{" "}
            <span className="tnum font-semibold text-ink">{fmtInt(part.data.value)}</span>{" "}
            {pasos[0]?.value ? (
              <span className="tnum text-soft">({Math.round((part.data.value / pasos[0].value) * 100)} % de los leads)</span>
            ) : null}
          </div>
        )}
        motionConfig="gentle"
      />
      {conversiones?.length ? (
        <p className="sr-only">
          Conversiones entre pasos: {conversiones.map((c, i) => `${pasos[i]?.label}→${pasos[i + 1]?.label} ${c.pct}`).join(", ")}
        </p>
      ) : null}
    </div>
  );
}
