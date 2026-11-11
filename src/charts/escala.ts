/* Utilidades de escala compartidas por las gráficas SVG del kit. */

/** Paso "bonito" (1, 2, 2,5, 5 × 10^n) para ~`n` divisiones hasta `max`. */
export function pasoBonito(max: number, n = 4): number {
  if (!(max > 0)) return 1;
  const crudo = max / n;
  const mag = 10 ** Math.floor(Math.log10(crudo));
  const r = crudo / mag;
  const f = r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10;
  return f * mag;
}

/** Máximo redondeado hacia arriba y sus marcas (0 … max). */
export function marcasY(max: number, n = 4): { max: number; marcas: number[] } {
  const paso = pasoBonito(max, n);
  const tope = Math.max(paso, Math.ceil(max / paso) * paso);
  const marcas: number[] = [];
  for (let v = 0; v <= tope + paso / 2; v += paso) marcas.push(v);
  return { max: tope, marcas };
}

/** Path de línea (y opcionalmente área hasta `base`) con huecos donde el valor es null. */
export function pathLinea(puntos: ({ x: number; y: number } | null)[]): string {
  let d = "";
  let abierto = false;
  for (const p of puntos) {
    if (!p) {
      abierto = false;
      continue;
    }
    d += `${abierto ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    abierto = true;
  }
  return d;
}

export function pathArea(puntos: ({ x: number; y: number } | null)[], base: number): string {
  const validos = puntos.filter((p): p is { x: number; y: number } => !!p);
  if (validos.length < 2) return "";
  const linea = validos.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("");
  return `${linea}L${validos[validos.length - 1].x.toFixed(1)},${base}L${validos[0].x.toFixed(1)},${base}Z`;
}

const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** 'YYYY-MM' → 'octubre de 2026'. */
export function mesTexto(mes: string): string {
  const [y, m] = mes.split("-").map(Number);
  return `${MESES_LARGOS[m - 1]} de ${y}`;
}
