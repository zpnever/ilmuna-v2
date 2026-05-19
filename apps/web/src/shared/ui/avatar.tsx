import { cn } from "@/shared/utils/cn";
import { initialsFromName } from "@/shared/utils/format";

type AvatarProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export function Avatar({ name, imageUrl, className }: AvatarProps) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={cn("rounded-full object-cover", className)} />;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-full border border-gold/40 bg-stone-100 text-sm font-semibold text-ink",
        className,
      )}
    >
      {initialsFromName(name)}
    </div>
  );
}

