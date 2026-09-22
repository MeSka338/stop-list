import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:ring-neutral-400",
  secondary:
    "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 focus-visible:ring-neutral-300",
  ghost:
    "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950 focus-visible:ring-neutral-300",
};

export function Button({
  className,
  type = "button",
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        VARIANT_STYLES[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
