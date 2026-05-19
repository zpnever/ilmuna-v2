import { useQuery } from "@tanstack/react-query";
import { featuredGroupsQueryOptions } from "@/shared/api/query-options";
import { PagePlaceholder } from "@/shared/ui/page-placeholder";

export function GroupsPage() {
  const { data } = useQuery(featuredGroupsQueryOptions());

  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow="Grup"
        title="Halaman grup siap menjadi pangkal modul forum, materi, dan tugas."
        description="Untuk sekarang kita mengunci bahasa visual, struktur card, serta kontrak summary grup sehingga fase berikutnya tinggal menambah detail dan aksi."
        tags={["Group summary", "Forum extension point", "Task-ready shell"]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {data?.map((group) => (
          <article key={group.id} className="glass-panel rounded-[1.75rem] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-strong">
              {group.isPublic ? "Grup publik" : "Undangan"}
            </div>
            <div className="mt-2 text-2xl font-semibold text-ink">{group.name}</div>
            <div className="mt-3 text-sm leading-7 text-ink-muted">{group.description}</div>
            <div className="mt-4 text-sm text-ink-muted">
              {group.memberCount} anggota • Fokus: {group.studyFocus}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

