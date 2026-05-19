import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  tags?: string[];
  action?: ReactNode;
  className?: string;
};

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  tags = [],
  action,
  className,
}: PagePlaceholderProps) {
  return (
    <section
      className={cn(
        "route-placeholder-pattern glass-panel rounded-[2rem] p-6 md:p-8",
        className,
      )}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-strong">{eyebrow}</div>
      <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted md:text-base">{description}</p>
      {tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium text-ink-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-6">
        {action ?? (
          <Button variant="secondary">
            Lanjutkan pengembangan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </section>
  );
}
