import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useThemeMode } from "./themeMode";

/** Toggle claro/oscuro del header (§5.25): luna en claro, sol en oscuro. */
export function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  const oscuro = mode === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={oscuro ? "Modo claro" : "Modo oscuro"}
      className="grid size-9 place-items-center rounded-lg text-subtle transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {oscuro ? <IconSun size={18} stroke={1.75} /> : <IconMoonStars size={18} stroke={1.75} />}
    </button>
  );
}
