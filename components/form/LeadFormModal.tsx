"use client";

import { useEffect } from "react";
import { LeadForm } from "./LeadForm";

/**
 * Chrome around the existing LeadForm: centered dialog on desktop, bottom
 * sheet on mobile. LeadForm's internal logic (steps, validation, submit,
 * Cal.com redirect) is untouched — this only changes the container.
 */
export function LeadFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="animate-fade-up relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-bg-elevated shadow-[0_-20px_60px_rgba(0,0,0,0.6)] sm:max-w-lg sm:rounded-3xl sm:shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-elevated/95 px-5 py-3 backdrop-blur">
          <p className="text-sm font-semibold text-fg">Veja se sua operação está pronta</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário"
            className="flex size-8 items-center justify-center rounded-full text-fg-muted hover:bg-bg-elevated-2 hover:text-fg"
          >
            ✕
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <LeadForm />
        </div>
      </div>
    </div>
  );
}
