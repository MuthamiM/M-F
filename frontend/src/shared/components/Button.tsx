// src/shared/components/Button.tsx
// One button component, two variants — every CTA on the site should use
// this rather than one-off styled buttons, so brand changes happen in one place.

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite",
        variant === "primary" && "bg-graphite text-white hover:bg-slate",
        variant === "secondary" && "bg-transparent text-graphite border border-fog hover:bg-cloud",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
