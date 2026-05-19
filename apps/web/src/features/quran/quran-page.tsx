import { useQuery } from "@tanstack/react-query";
import { dailyAyahQueryOptions, quranSummaryQueryOptions } from "@/shared/api/query-options";
import { PagePlaceholder } from "@/shared/ui/page-placeholder";

export function QuranPage() {
  const { data: surahs } = useQuery(quranSummaryQueryOptions());
  const { data: ayah } = useQuery(dailyAyahQueryOptions());

  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow="Quran"
        title="Fondasi halaman Al-Quran sudah siap untuk diperluas ke 114 surah dan detail ayat."
        description="Di fase ini, kita sudah menyiapkan tipografi Arab, route protected, kontrak query, dan pola panel yang akan dipakai ulang saat list besar serta bookmark ditambahkan."
        tags={["Arabic typography", "Bookmark-ready", "Virtual-list extension point"]}
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel rounded-[1.75rem] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-strong">Cuplikan</div>
          <div className="arabic-text mt-4 text-right text-4xl leading-[1.9] text-ink">{ayah?.arabic}</div>
          <div className="mt-4 text-sm text-ink-muted">{ayah?.translation}</div>
        </section>

        <section className="glass-panel rounded-[1.75rem] p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {surahs?.slice(0, 8).map((surah) => (
              <article key={surah.number} className="rounded-[1.25rem] border border-line bg-white/75 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">Surah {surah.number}</div>
                <div className="mt-2 font-semibold text-ink">{surah.latinName}</div>
                <div className="arabic-text mt-3 text-right text-2xl text-ink">{surah.arabicName}</div>
                <div className="mt-3 text-sm text-ink-muted">
                  {surah.totalAyahs} ayat • {surah.revelation}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

