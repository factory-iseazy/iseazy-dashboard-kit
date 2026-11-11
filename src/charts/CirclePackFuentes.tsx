import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { fmtCompact } from "../format";
import { useNivoTheme } from "../theme";

export interface NodoPack {
  name: string;
  color?: string;
  value?: number;
  children?: NodoPack[];
}

/** Universo de fuentes (@nivo/circle-packing): burbujas de fuente agrupadas por
    canal — hace visible la cola larga que un top-10 corta. */
export function CirclePackFuentes({ raiz, height = 440 }: { raiz: NodoPack; height?: number }) {
  const nivoTheme = useNivoTheme();
  return (
    <div style={{ height }}>
      <ResponsiveCirclePacking
        data={raiz}
        theme={nivoTheme as never}
        id="name"
        value="value"
        margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        colors={(n: { data: NodoPack; depth: number }) => (n.depth === 0 ? "#FFFFFF" : n.data.color ?? "#F4F4F4")}
        childColor="noinherit"
        padding={3}
        leavesOnly={false}
        enableLabels
        label={(n) => (n.depth === 2 ? String(n.id) : "")}
        labelsSkipRadius={34}
        labelTextColor="#FFFFFF"
        borderWidth={1.5}
        borderColor="#FFFFFF"
        valueFormat={(v: number) => fmtCompact(v)}
        animate={false}
      />
    </div>
  );
}
