"use client";

import { useFormModal } from "@/components/form/FormModalContext";
import { Button } from "./Button";

export function ContextualCta({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const { open } = useFormModal();
  return (
    <Button type="button" variant={variant} onClick={open} className={className}>
      {children}
    </Button>
  );
}
