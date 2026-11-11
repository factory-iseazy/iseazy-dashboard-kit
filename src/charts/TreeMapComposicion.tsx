import { ResponsiveTreeMap } from "@nivo/treemap";
import { fmtCompactMoney } from "../format";
import { useNivoTheme } from "../theme";

export interface NodoTreemap {
  name: string;
  color?: string;
  value?: number;
  children?: NodoTreemap[];
}

/** Composición jerárquica (@nivo/treemap): p. ej. revenue producto → país.
    El área codifica magnitud; el color, la identidad del grupo padre. */
export function TreeMapComposicion({ raiz, height = 480 }: { raiz: NodoTreemap; height?: number }) {
  const nivoTheme = useNivoTheme();
  return (
    <div style={{ height }}>
      <ResponsiveTreeMap
        data={raiz}
        theme={nivoTheme as never}
        identity="name"
        value="value"
        margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        colors={(n: { data: NodoTreemap }) => n.data.color ?? "#ABB8C3"}
        nodeOpacity={0.92}
        borderWidth={2}
        borderColor="#FFFFFF"
        innerPadding={2}
        outerPadding={4}
        label={(n) => String(n.id)}
        labelSkipSize={40}
        labelTextColor="#FFFFFF"
        parentLabelSize={22}
        parentLabelPadding={5}
        parentLabelTextColor="#FFFFFF"
        valueFormat={(v: number) => fmtCompactMoney(v)}
        animate={false}
      />
    </div>
  );
}
