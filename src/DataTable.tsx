import { IconChevronRight, IconDownload } from "@tabler/icons-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  type ExpandedState,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { fmtDelta, fmtDeltaMoney, fmtInt, fmtMoney, fmtPct } from "./format";
import { Sparkline } from "./Sparkline";
import { DEEMPHASIS, SERIES, STATUS } from "./theme";

export type TipoColumna = "text" | "num" | "money" | "pct" | "delta" | "deltaMoney" | "semaforo" | "bar" | "spark";

export interface ColumnaDef {
  key: string;
  header: string;
  tipo: TipoColumna;
  /** semaforo: [rojo_hasta, verde_desde] — p. ej. ROAS [1.5, 2.7] */
  umbral?: [number, number];
  /** color de la barra / sparkline (por defecto, la 1ª serie) */
  color?: string;
  /** decimales de pct/delta */
  decimales?: number;
  /** contenido propio de la celda (la columna sigue ordenando y exportando por su valor) */
  render?: (valor: unknown, fila: Fila) => React.ReactNode;
  /** texto de ayuda en la cabecera */
  ayuda?: string;
  /** no se exporta a CSV */
  sinExportar?: boolean;
}

export type Fila = Record<string, unknown>;

function CeldaSemaforo({ v, umbral }: { v: number | null; umbral: [number, number] }) {
  if (v == null) return <span className="text-xs text-soft">sin inversión</span>;
  const color = v < umbral[0] ? STATUS.negativo : v > umbral[1] ? STATUS.positivo : STATUS.aviso;
  return (
    <span className="tnum inline-flex items-center gap-1.5 font-semibold" style={{ color }}>
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: color }} />
      {v.toFixed(2).replace(".", ",")}×
    </span>
  );
}

function celda(c: ColumnaDef, v: unknown, maxBar: number): React.ReactNode {
  switch (c.tipo) {
    case "num":
      return <span className="tnum">{fmtInt(v as number)}</span>;
    case "money":
      return <span className="tnum">{fmtMoney(v as number)}</span>;
    case "pct":
      return <span className="tnum">{fmtPct(v as number, c.decimales ?? 0)}</span>;
    case "delta":
    case "deltaMoney": {
      const d = v as number | null;
      if (d == null) return <span className="text-soft">—</span>;
      return (
        <span className="tnum font-semibold" style={{ color: d >= 0 ? STATUS.positivo : STATUS.negativo }}>
          {c.tipo === "delta" ? fmtDelta(d, c.decimales ?? 0) : fmtDeltaMoney(d)}
        </span>
      );
    }
    case "semaforo":
      return <CeldaSemaforo v={v as number | null} umbral={c.umbral ?? [1, 2]} />;
    case "bar": {
      if (v == null) return null;
      const n = (v as number) || 0;
      return (
        <span className="flex min-w-24 items-center gap-2">
          <span
            className="h-[10px] rounded-r-[3px]"
            style={{ width: `max(${((Math.max(0, n) / maxBar) * 100).toFixed(1)}%, 2px)`, background: c.color ?? SERIES[0] }}
          />
        </span>
      );
    }
    case "spark":
      return Array.isArray(v) ? <Sparkline valores={v as number[]} color={c.color ?? SERIES[0]} width={72} height={22} /> : null;
    default:
      return <span className="font-medium text-ink-deep">{String(v ?? "—")}</span>;
  }
}

/** Tabla del kit (§13.6 + §5.14): ordenable (1er clic descendente en números), números a la
    derecha con tabular-nums, barra inline, sparkline, fila de totales, filas expandibles
    (`subFilas`), clic en fila y export CSV. Pagina solo por encima de `porPagina` filas. */
export function DataTable({
  datos,
  columnas,
  ordenInicial,
  exportName,
  totales,
  onFilaClick,
  filaActiva,
  subFilas,
  porPagina = 50,
  sinExportar = false,
  vacio = "Sin datos para este corte.",
}: {
  datos: Fila[];
  columnas: ColumnaDef[];
  ordenInicial?: string;
  exportName?: string;
  totales?: Fila;
  onFilaClick?: (fila: Fila) => void;
  filaActiva?: (fila: Fila) => boolean;
  /** clave de las filas hijas (árbol expandible) */
  subFilas?: string;
  porPagina?: number;
  sinExportar?: boolean;
  vacio?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>(ordenInicial ? [{ id: ordenInicial, desc: true }] : []);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagina, setPagina] = useState(0);

  const maxBar = useMemo(() => {
    const barCol = columnas.find((c) => c.tipo === "bar");
    if (!barCol) return 1;
    return Math.max(...datos.map((d) => Number(d[barCol.key]) || 0), 1);
  }, [datos, columnas]);

  const helper = createColumnHelper<Fila>();
  const defs = useMemo(
    () =>
      columnas.map((c, ci) =>
        helper.accessor((row) => row[c.key], {
          id: c.key,
          header: c.header,
          sortDescFirst: c.tipo !== "text",
          sortUndefined: "last",
          cell: (info) => {
            const contenido = c.render ? c.render(info.getValue(), info.row.original) : celda(c, info.getValue(), maxBar);
            if (ci !== 0 || !subFilas) return contenido;
            const r = info.row;
            return (
              <span className="flex items-center gap-1" style={{ paddingLeft: r.depth * 18 }}>
                {r.getCanExpand() ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      r.toggleExpanded();
                    }}
                    aria-label={r.getIsExpanded() ? "Contraer" : "Desplegar"}
                    aria-expanded={r.getIsExpanded()}
                    className="grid h-5 w-5 place-items-center rounded text-soft hover:bg-muted hover:text-ink"
                  >
                    <IconChevronRight size={14} stroke={2} className={`transition-transform ${r.getIsExpanded() ? "rotate-90" : ""}`} />
                  </button>
                ) : (
                  <span className="w-5" />
                )}
                {contenido}
              </span>
            );
          },
        }),
      ),
    [columnas, helper, maxBar, subFilas],
  );

  const table = useReactTable({
    data: datos,
    columns: defs,
    state: { sorting, expanded },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getSubRows: subFilas ? (r) => (r[subFilas] as Fila[] | undefined) : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    paginateExpandedRows: false,
  });

  // paginación sobre filas de primer nivel (las hijas van con su padre)
  const raiz = table.getSortedRowModel().rows;
  const paginada = raiz.length > porPagina;
  const raizVisible = paginada ? raiz.slice(pagina * porPagina, (pagina + 1) * porPagina) : raiz;
  const visibles: Row<Fila>[] = [];
  const meter = (r: Row<Fila>) => {
    visibles.push(r);
    if (r.getIsExpanded()) r.subRows.forEach(meter);
  };
  raizVisible.forEach(meter);

  const exportables = columnas.filter((c) => c.tipo !== "spark" && c.tipo !== "bar" && !c.sinExportar);
  const exportCsv = () => {
    const cab = [...(subFilas ? ["Nivel"] : []), ...exportables.map((c) => c.header)];
    const lineas: string[] = [];
    const fmt = (v: unknown) => (typeof v === "number" ? String(v).replace(".", ",") : `"${String(v ?? "").replace(/"/g, '""')}"`);
    const volcar = (r: Row<Fila>) => {
      lineas.push([...(subFilas ? [String(r.depth + 1)] : []), ...exportables.map((c) => fmt(r.original[c.key]))].join(";"));
      r.subRows.forEach(volcar);
    };
    raiz.forEach(volcar);
    if (totales) lineas.push([...(subFilas ? [""] : []), ...exportables.map((c) => fmt(totales[c.key]))].join(";"));
    const blob = new Blob(["﻿" + [cab.join(";"), ...lineas].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${exportName ?? "datos"}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const derecha = (t: TipoColumna) => t !== "text" && t !== "bar" && t !== "spark";

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse text-[13px]">
          <thead className="border-b border-line bg-muted-2">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h, i) => {
                  const col = columnas[i];
                  const dir = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      title={col.ayuda}
                      aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"}
                      className={`whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-subtle ${
                        derecha(col.tipo) ? "text-right" : "text-left"
                      }`}
                    >
                      <button onClick={h.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 uppercase hover:text-ink">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <span aria-hidden className="text-[9px]" style={{ color: dir ? SERIES[0] : DEEMPHASIS }}>
                          {dir === "asc" ? "▲" : "▼"}
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {visibles.map((r) => {
              const activa = filaActiva?.(r.original);
              return (
                <tr
                  key={r.id}
                  onClick={onFilaClick ? () => onFilaClick(r.original) : undefined}
                  className={`border-b border-line last:border-0 ${onFilaClick ? "cursor-pointer" : ""} ${
                    activa ? "bg-brand-soft/50" : r.depth > 0 ? "bg-muted-2/60 hover:bg-muted" : "hover:bg-muted-2"
                  }`}
                >
                  {r.getVisibleCells().map((cell, i) => (
                    <td
                      key={cell.id}
                      className={`px-3 py-1.5 ${derecha(columnas[i].tipo) ? "whitespace-nowrap text-right" : "text-left"} ${r.depth > 0 ? "text-[12.5px]" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {!visibles.length && (
              <tr>
                <td colSpan={columnas.length} className="px-3 py-6 text-center text-soft">
                  {vacio}
                </td>
              </tr>
            )}
          </tbody>
          {totales && visibles.length > 0 && (
            <tfoot className="border-t-2 border-line-strong bg-muted-2">
              <tr>
                {columnas.map((c, i) => (
                  <td key={c.key} className={`px-3 py-2 font-semibold text-ink-deep ${derecha(c.tipo) ? "whitespace-nowrap text-right" : "text-left"}`}>
                    {totales[c.key] === undefined
                      ? null
                      : i === 0
                        ? <span className={subFilas ? "pl-6" : ""}>{String(totales[c.key])}</span>
                        : c.tipo === "spark" || c.tipo === "bar"
                          ? null
                          : c.render
                            ? c.render(totales[c.key], totales)
                            : celda(c, totales[c.key], maxBar)}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <div className="mt-2 flex items-center justify-between">
        {paginada ? (
          <nav aria-label="Paginación" className="flex items-center gap-2 text-xs text-subtle">
            <button
              disabled={pagina === 0}
              onClick={() => setPagina((p) => p - 1)}
              className="rounded-md border border-line px-2 py-1 disabled:opacity-40"
            >
              ←
            </button>
            <span className="tnum">
              {pagina * porPagina + 1}–{Math.min((pagina + 1) * porPagina, raiz.length)} de {raiz.length}
            </span>
            <button
              disabled={(pagina + 1) * porPagina >= raiz.length}
              onClick={() => setPagina((p) => p + 1)}
              className="rounded-md border border-line px-2 py-1 disabled:opacity-40"
            >
              →
            </button>
          </nav>
        ) : (
          <span className="text-xs text-soft">{raiz.length ? `${raiz.length} filas` : ""}</span>
        )}
        {!sinExportar && (
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-xs font-medium text-subtle hover:bg-muted-2"
          >
            <IconDownload size={14} stroke={1.75} /> Exportar CSV
          </button>
        )}
      </div>
    </div>
  );
}
