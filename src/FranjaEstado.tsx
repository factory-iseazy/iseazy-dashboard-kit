import { IconAlertTriangle, IconInfoCircle, IconCircleCheck, IconPoint } from "@tabler/icons-react";

export type TonoEstado = "neutro" | "info" | "aviso" | "peligro" | "ok";

export interface ElementoEstado {
  id: string;
  tono: TonoEstado;
  texto: React.ReactNode;
  /** tooltip con el detalle (qué significa, umbral…) */
  detalle?: string;
  onClick?: () => void;
}

const TONO: Record<TonoEstado, { cls: string; Icono: typeof IconInfoCircle }> = {
  neutro: { cls: "text-subtle", Icono: IconPoint },
  info: { cls: "text-info", Icono: IconInfoCircle },
  aviso: { cls: "text-warning", Icono: IconAlertTriangle },
  peligro: { cls: "text-destructive", Icono: IconAlertTriangle },
  ok: { cls: "text-success", Icono: IconCircleCheck },
};

/** Franja de estado del dato: una línea, siempre visible encima del contenido, con lo que hay que
    saber para fiarse de las cifras (fuente, método, cuánto se apoya en supuestos, alertas…).
    Cada elemento puede abrir su detalle. §13.5: frescura y honestidad visibles. */
export function FranjaEstado({ elementos }: { elementos: ElementoEstado[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 rounded-xl border border-line bg-card px-2 py-1.5 text-[12.5px]">
      {elementos.map((e, i) => {
        const { cls, Icono } = TONO[e.tono];
        const contenido = (
          <>
            <Icono size={15} stroke={1.75} className={`shrink-0 ${cls}`} />
            <span className="text-ink">{e.texto}</span>
          </>
        );
        return (
          <span key={e.id} className="flex items-center">
            {i > 0 && <span aria-hidden className="mx-1 h-4 w-px bg-line" />}
            {e.onClick ? (
              <button
                onClick={e.onClick}
                title={e.detalle}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted"
              >
                {contenido}
              </button>
            ) : (
              <span title={e.detalle} className="flex items-center gap-1.5 px-2 py-1">
                {contenido}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
