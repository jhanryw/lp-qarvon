"use client";

import { useEffect, useState } from "react";

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 640);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-strong bg-bg/95 p-3 backdrop-blur sm:hidden">
      <a
        href="#aplicar"
        className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-[#08110f]"
      >
        Quero analisar minha operação
      </a>
    </div>
  );
}
