import { useChartChrome } from "./theme";

/** Sparkline de stat tile: histórico en gris recesivo, tramo final en el accent. */
export function Sparkline({
  valores,
  color,
  width = 96,
  height = 30,
}: {
  valores: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const c = useChartChrome();
  if (valores.length < 2) return null;
  const lo = Math.min(...valores);
  const hi = Math.max(...valores);
  const rango = hi - lo || 1;
  const paso = width / (valores.length - 1);
  const punto = (v: number, i: number) =>
    `${(i * paso).toFixed(1)},${(height - 3 - ((v - lo) / rango) * (height - 6)).toFixed(1)}`;
  const todos = valores.map(punto).join(" ");
  const ultimos = valores.slice(-2).map((v, i) => punto(v, valores.length - 2 + i)).join(" ");
  const [fx, fy] = punto(valores[valores.length - 1], valores.length - 1).split(",").map(Number);
  return (
    <svg width={width} height={height} aria-hidden className="block">
      <polyline points={todos} fill="none" stroke={c.deemphasis} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={ultimos} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx={fx} cy={fy} r={3.5} fill={color} stroke={c.surface} strokeWidth={2} />
    </svg>
  );
}
