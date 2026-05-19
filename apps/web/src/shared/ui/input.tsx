import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid = false, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border bg-white px-4 text-sm text-ink shadow-sm outline-none transition",
        invalid ? "border-danger focus:border-danger" : "border-line focus:border-gold",
        className,
      )}
      {...props}
    />
  );
}

