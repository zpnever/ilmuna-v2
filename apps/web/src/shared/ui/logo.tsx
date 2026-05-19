import { cn } from "@/shared/utils/cn";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/50 bg-ink text-lg font-bold text-gold">
        i
      </div>
      {!compact ? (
        <div>
          <div className="font-display text-2xl font-semibold leading-none tracking-tight text-ink">ilmuna</div>
          <div className="text-xs tracking-[0.24em] text-ink-muted uppercase">Ilmu kita bersama</div>
        </div>
      ) : null}
    </div>
  );
}

