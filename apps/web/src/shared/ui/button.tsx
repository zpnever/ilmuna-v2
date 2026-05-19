import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/shared/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
  }
>;

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center rounded-full border transition duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    variant === "primary" && "border-ink bg-ink text-white hover:-translate-y-0.5 hover:bg-black",
    variant === "secondary" && "border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-gold hover:text-gold-strong",
    variant === "ghost" && "border-transparent bg-transparent text-ink-muted hover:text-ink",
    size === "sm" && "h-10 px-4 text-sm font-semibold",
    size === "md" && "h-11 px-5 text-sm font-semibold",
    size === "lg" && "h-[3.25rem] px-6 text-base font-semibold",
    block && "w-full",
    className,
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  block = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      {...props}
    >
      {children}
    </button>
  );
}
