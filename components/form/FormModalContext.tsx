"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { LeadFormModal } from "./LeadFormModal";

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

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <FormModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      <LeadFormModal isOpen={isOpen} onClose={close} />
    </FormModalContext.Provider>
  );
}
