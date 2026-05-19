import { useQuery } from "@tanstack/react-query";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { feedPreviewQueryOptions } from "@/shared/api/query-options";
import { Avatar } from "@/shared/ui/avatar";
import { PagePlaceholder } from "@/shared/ui/page-placeholder";

export function FeedPage() {
  const { data } = useQuery(feedPreviewQueryOptions());

  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow="Feed"
        title="Feed sosial sudah punya bentuk awal yang bisa diperluas."
        description="Composer kaya teks, upload gambar, serta interaksi lanjutan sengaja ditahan untuk fase berikutnya. Yang sudah final di fase ini adalah shell, pola card, dan kontrak query-nya."
        tags={["Query-ready", "Mobile-aware", "Mock-backed"]}
      />

      <div className="space-y-4">
        {data?.map((post) => (
          <article key={post.id} className="glass-panel rounded-[1.75rem] p-5">
            <div className="flex items-center gap-3">
              <Avatar name={post.author.name} imageUrl={post.author.imageUrl} className="h-12 w-12" />
              <div>
                <div className="font-semibold text-ink">{post.author.name}</div>
                <div className="text-sm text-ink-muted">@{post.author.username}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-ink-muted">{post.excerpt}</p>
            {post.quote ? (
              <div className="mt-4 rounded-[1.5rem] border border-gold/25 bg-gold/10 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-gold-strong">
                  QS. {post.quote.surahName} : {post.quote.ayahNumber}
                </div>
                <div className="arabic-text mt-3 text-right text-2xl leading-[1.9] text-ink">{post.quote.arabic}</div>
                <div className="mt-3 text-sm text-ink-muted">{post.quote.translation}</div>
              </div>
            ) : null}
            <div className="mt-5 flex items-center gap-6 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                {post.likes}
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {post.comments}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

