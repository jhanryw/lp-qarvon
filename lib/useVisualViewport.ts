"use client";

import { useEffect } from "react";

const HEIGHT_VAR = "--vv-height";
const OFFSET_TOP_VAR = "--vv-offset-top";

/**
 * Mantém --vv-height/--vv-offset-top em document.documentElement em sincronia
 * com window.visualViewport enquanto `active` for true. É o único jeito
 * confiável de saber quanto de tela está REALMENTE visível no mobile: a
 * maioria dos navegadores móveis (iOS Safari, Chrome Android) não encolhe o
 * layout viewport (o que 100vh/100dvh e `fixed` enxergam) quando o teclado
 * abre — só o visual viewport encolhe. CSS sozinho não tem acesso a isso;
 * daí as custom properties, atualizadas via JS a cada resize/scroll do
 * visualViewport (scroll importa porque em iOS o layout viewport pode rolar
 * com o teclado aberto, deslocando visualViewport.offsetTop).
 *
 * Onde window.visualViewport não existe, não faz nada — quem consome as
 * variáveis deve sempre ter um fallback em CSS (var(--vv-height, 100dvh)),
 * então a ausência delas é um no-op seguro, não uma quebra.
 */
export function useVisualViewport(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const vv = typeof window !== "undefined" ? window.visualViewport : undefined;
    if (!vv) return;

    const root = document.documentElement;

    function update() {
      root.style.setProperty(HEIGHT_VAR, `${vv!.height}px`);
      root.style.setProperty(OFFSET_TOP_VAR, `${vv!.offsetTop}px`);
    }

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      root.style.removeProperty(HEIGHT_VAR);
      root.style.removeProperty(OFFSET_TOP_VAR);
    };
  }, [active]);
}
