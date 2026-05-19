import { useQuery } from "@tanstack/react-query";
import { currentUserQueryOptions } from "@/shared/api/query-options";
import { Input } from "@/shared/ui/input";
import { PagePlaceholder } from "@/shared/ui/page-placeholder";

type SettingsPageProps = {
  section: "profile" | "account";
};

export function SettingsPage({ section }: SettingsPageProps) {
  const { data } = useQuery(currentUserQueryOptions());

  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow={section === "profile" ? "Settings profile" : "Settings account"}
        title={section === "profile" ? "Pengaturan profil siap dihubungkan ke CRUD backend." : "Pengaturan akun siap untuk flow keamanan lanjutan."}
        description="Kita sengaja menyiapkan form shell dan state summary lebih awal agar nanti penambahan mutation cukup fokus ke field yang benar-benar dibutuhkan."
        tags={["Form scaffold", "Mutation-ready", "Auth-aware"]}
      />

      <section className="glass-panel rounded-[1.75rem] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="mb-2 text-sm font-medium text-ink">Nama</div>
            <Input value={data?.name ?? ""} readOnly />
          </label>
          <label className="block">
            <div className="mb-2 text-sm font-medium text-ink">Email</div>
            <Input value={data?.email ?? ""} readOnly />
          </label>
          <label className="block">
            <div className="mb-2 text-sm font-medium text-ink">Username</div>
            <Input value={data?.username ?? ""} readOnly />
          </label>
          <label className="block">
            <div className="mb-2 text-sm font-medium text-ink">Lokasi</div>
            <Input value={data?.location ?? "Jakarta"} readOnly />
          </label>
        </div>
      </section>
    </div>
  );
}

