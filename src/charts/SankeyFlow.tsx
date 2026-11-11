import { ResponsiveSankey } from "@nivo/sankey";
import { fmtInt } from "../format";
import { useNivoTheme } from "../theme";

export interface NodoSankey {
  id: string;
  label: string;
  color: string;
}
export interface LinkSankey {
  source: string;
  target: string;
  value: number;
}

/** Flujo de adquisición (@nivo/sankey): Origen → Canal → Producto. La identidad
    la llevan las etiquetas de nodo; el color agrupa por capa (decorativo). */
export function SankeyFlow({
  nodos,
  links,
  height = 480,
}: {
  nodos: NodoSankey[];
  links: LinkSankey[];
  height?: number;
}) {
  const nivoTheme = useNivoTheme();
  const colorPor = Object.fromEntries(nodos.map((n) => [n.id, n.color]));
  const labelPor = Object.fromEntries(nodos.map((n) => [n.id, n.label]));
  if (!links.length) return <p className="py-6 text-center text-sm text-soft">Sin datos para este corte.</p>;
  return (
    <div style={{ height }}>
      <ResponsiveSankey
        data={{ nodes: nodos.map(({ id }) => ({ id })), links }}
        theme={nivoTheme as never}
        margin={{ top: 8, right: 150, bottom: 8, left: 110 }}
        colors={(n: { id: string }) => colorPor[n.id] ?? "#ABB8C3"}
        nodeOpacity={1}
        nodeThickness={14}
        nodeInnerPadding={2}
        nodeSpacing={14}
        nodeBorderWidth={0}
        linkOpacity={0.25}
        linkHoverOpacity={0.55}
        linkHoverOthersOpacity={0.08}
        enableLinkGradient
        labelPosition="outside"
        labelPadding={10}
        label={(n: { id: string }) => labelPor[n.id] ?? n.id}
        valueFormat={(v: number) => fmtInt(v)}
        animate={false}
      />
    </div>
  );
}
