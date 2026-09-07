"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { LeadFormModal } from "./LeadFormModal";
import { useVisualViewport } from "@/lib/useVisualViewport";

interface FormModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const FormModalContext = createContext<FormModalContextValue | null>(null);

export function useFormModal(): FormModalContextValue {
  const ctx = useContext(FormModalContext);
  if (!ctx) throw new Error("useFormModal must be used within FormModalProvider");
  return ctx;
}

export function FormModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useVisualViewport(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    // `overflow: hidden` sozinho no body não trava o scroll de forma
    // confiável no iOS Safari (o bounce/rubber-band da página por trás
    // continua acontecendo por touchmove) e, pior, não preserva a posição:
    // ao reabrir o scroll, a página pode pular para o topo. A técnica
    // robusta é congelar o body em position:fixed na posição atual e
    // restaurar o scroll manualmente ao fechar — mesmo scrollY de antes,
    // sem pulo de layout.
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <FormModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      <LeadFormModal isOpen={isOpen} onClose={close} />
    </FormModalContext.Provider>
  );
}
