# Registro de decisiones

Toda decisión (de código, concepto, nombre, infra o proceso) se anota aquí en el mismo commit en que
se toma. Formato: código · fecha · título, y debajo decisión, por qué y lo descartado.

## D-001 · 2026-11-11 · Repo propio y público, separado del design system

**Decisión:** el kit vive en su propio repo, `factory-iseazy/iseazy-dashboard-kit`, público.

**Por qué:**
- npm no sabe instalar un paquete desde una subcarpeta de un repo git: una dependencia git solo
  admite `#commit`, `#tag` o `#semver:` (documentación de npm 10.8.2). Dentro del repo del design
  system habría que publicarlo en un registro con token.
- Funcionan de forma distinta: el design system se lee en vivo desde `main`; el código tiene que ir
  con versión fija para que un cambio no rompa una tool en producción.
- Público para que las apps, el servidor de despliegue y Claude lo lean sin credenciales. Es código
  de interfaz: no lleva datos ni lógica de negocio.

**Descartado:** dentro de `iseazy-design-system` (lo de arriba); dentro de la plantilla de
dashboard ("Use this template" copiaría el kit en cada tool); privado (cada build de despliegue
necesitaría una credencial de GitHub).

## D-002 · 2026-11-11 · Arranque sin historial

**Decisión:** el repo empieza con un commit nuevo, no con `git subtree split`. El origen queda
anotado en el CHANGELOG (commit `fdda35b` del repo donde maduró) y la historia útil, resumida ahí.

**Por qué:** los mensajes de commit de la etapa anterior describen la lógica de negocio de la tool de
origen, que no debe quedar en un repo público.

## D-003 · 2026-11-11 · Se distribuye como código fuente TypeScript, sin compilar

**Decisión:** `exports` apunta a `src/index.ts` y `src/styles.css`. Lo compila el build de la app
(Vite + TypeScript + Tailwind v4), igual que cuando vivía dentro de la tool.

**Por qué:** no añade build ni artefactos que mantener, y las apps ya cumplen esos requisitos.
Comprobado: una copia de la app de origen que instala el kit desde este repo compila con
`tsc -b && vite build` y genera las mismas 279 clases CSS que con el kit dentro del repo (el
`@source "."` de `styles.css` funciona también desde `node_modules`).

**Descartado por ahora:** publicar un build (`dist/` + tipos). Si aparece una app que no use
Vite + TypeScript + Tailwind v4, se reabre.

## D-004 · 2026-11-11 · Se mantiene el nombre del paquete `@iseazy/dashboard-kit`

**Decisión:** el paquete conserva su nombre aunque el repo se llame `iseazy-dashboard-kit`.

**Por qué:** las apps ya importan de `@iseazy/dashboard-kit`; cambiarlo obligaría a tocar todos sus
imports.
