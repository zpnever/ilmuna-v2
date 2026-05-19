import { useQuery } from "@tanstack/react-query";
import { featuredGroupsQueryOptions, quranSummaryQueryOptions } from "@/shared/api/query-options";
import { PagePlaceholder } from "@/shared/ui/page-placeholder";

export function ExplorePage() {
  const { data: groups } = useQuery(featuredGroupsQueryOptions());
  const { data: surahs } = useQuery(quranSummaryQueryOptions());

  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow="Explore"
        title="Explore menghubungkan konten publik, grup, dan referensi dalam satu pola tampilan."
        description="Halaman ini baru memanfaatkan kartu data ringkas agar fondasi navigasinya mantap sebelum ranking, filter, atau rekomendasi diperdalam."
        tags={["Public discovery", "Route scaffold", "Query composition"]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel rounded-[1.75rem] p-5">
          <h2 className="font-semibold text-ink">Grup yang sedang aktif</h2>
          <div className="mt-4 space-y-3">
            {groups?.map((group) => (
              <div key={group.id} className="rounded-[1.25rem] border border-line bg-white/75 p-4">
                <div className="font-semibold text-ink">{group.name}</div>
                <div className="mt-2 text-sm leading-6 text-ink-muted">{group.description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[1.75rem] p-5">
          <h2 className="font-semibold text-ink">Surah yang sering dibuka</h2>
          <div className="mt-4 space-y-3">
            {surahs?.slice(0, 4).map((surah) => (
              <div key={surah.number} className="flex items-center justify-between rounded-[1.25rem] border border-line bg-white/75 p-4">
                <div>
                  <div className="font-semibold text-ink">{surah.latinName}</div>
                  <div className="text-sm text-ink-muted">{surah.revelation}</div>
                </div>
                <div className="arabic-text text-2xl text-ink">{surah.arabicName}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

