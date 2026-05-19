import { useQuery } from "@tanstack/react-query";
import { hadithBooksQueryOptions } from "@/shared/api/query-options";
import { PagePlaceholder } from "@/shared/ui/page-placeholder";

export function HadithPage() {
  const { data } = useQuery(hadithBooksQueryOptions());

  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow="Hadist"
        title="Daftar kitab hadist sudah punya route, query, dan panel awal."
        description="Detail kitab, daftar hadist paginated, dan bookmark personal akan menumpuk di atas fondasi ini tanpa perlu mengubah shell atau kontrak dasar."
        tags={["Book listing", "Bookmark-ready", "API aligned"]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {data?.map((book) => (
          <article key={book.slug} className="glass-panel rounded-[1.75rem] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">{book.narrator}</div>
            <div className="mt-2 text-2xl font-semibold text-ink">{book.name}</div>
            <div className="mt-3 text-sm text-ink-muted">{book.totalItems.toLocaleString("id-ID")} hadist</div>
          </article>
        ))}
      </div>
    </div>
  );
}

