import { IconX } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

/** Panel lateral (drawer, design system §5.15-5.24) para bajar al detalle sin perder la vista:
    se abre por la derecha sobre un velo, se cierra con Esc, con la X o clicando fuera. */
export function Drawer({
  abierto,
  onCerrar,
  titulo,
  subtitulo,
  acciones,
  ancho = "min(1080px, 96vw)",
  children,
}: {
  abierto: boolean;
  onCerrar: () => void;
  titulo: React.ReactNode;
  subtitulo?: React.ReactNode;
  acciones?: React.ReactNode;
  ancho?: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    panel.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [abierto, onCerrar]);

  return (
    <div className={`fixed inset-0 z-40 ${abierto ? "" : "pointer-events-none"}`} aria-hidden={!abierto}>
      <div
        onClick={onCerrar}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-200 dark:bg-black/50 ${abierto ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        style={{ width: ancho }}
        className={`absolute right-0 top-0 flex h-full flex-col border-l border-line bg-card shadow-xl outline-none transition-transform duration-200 ease-out ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink-deep">{titulo}</h2>
            {subtitulo && <div className="mt-1 text-[12.5px] text-subtle">{subtitulo}</div>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {acciones}
            <button onClick={onCerrar} aria-label="Cerrar" className="rounded-md p-1.5 text-subtle hover:bg-muted">
              <IconX size={18} stroke={1.75} />
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{abierto && children}</div>
      </div>
    </div>
  );
}
