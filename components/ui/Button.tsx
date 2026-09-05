import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-[#08110f] hover:bg-accent-strong active:bg-accent-deep shadow-[0_0_0_1px_rgba(43,201,168,0.35)]",
  secondary:
    "bg-transparent text-fg border border-border-strong hover:border-accent/60 hover:text-accent",
  ghost: "bg-transparent text-fg-muted hover:text-fg underline underline-offset-4",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
