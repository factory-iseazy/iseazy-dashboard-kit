import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

/** Botón ⓘ que abre una nota (popover). Para la metodología y los "qué cambia" que no deben ir
    como párrafos en la superficie (§13.2 y §13.8.3). */
export function NotaInfo({
  titulo,
  children,
  etiqueta,
  ancho = 420,
}: {
  titulo: string;
  children: React.ReactNode;
  /** texto junto al icono (p. ej. "Qué cambia") */
  etiqueta?: string;
  ancho?: number;
}) {
  const [abierta, setAbierta] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!abierta) return;
    const fuera = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setAbierta(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierta(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierta]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setAbierta((a) => !a)}
        aria-expanded={abierta}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-subtle hover:bg-muted hover:text-ink"
      >
        <IconInfoCircle size={16} stroke={1.75} />
        {etiqueta}
      </button>
      {abierta && (
        <div
          role="dialog"
          aria-label={titulo}
          style={{ width: ancho }}
          className="absolute right-0 top-full z-30 mt-1 max-w-[90vw] rounded-xl border border-line bg-card p-4 text-[13px] leading-relaxed text-ink shadow-lg"
        >
          <div className="mb-2 text-sm font-semibold text-ink-deep">{titulo}</div>
          <div className="flex flex-col gap-2 [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-ink-deep">{children}</div>
        </div>
      )}
    </div>
  );
}
