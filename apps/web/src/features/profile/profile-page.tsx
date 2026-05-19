import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { currentUserQueryOptions } from "@/shared/api/query-options";
import { userApi } from "@/shared/api/user-api";
import { Avatar } from "@/shared/ui/avatar";
import { buttonClasses } from "@/shared/ui/button";
import { PagePlaceholder } from "@/shared/ui/page-placeholder";

type ProfilePageProps = {
  username: string;
};

export function ProfilePage({ username }: ProfilePageProps) {
  const { data: currentUser } = useQuery(currentUserQueryOptions());
  const { data } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => userApi.getProfile(username),
  });

  const isCurrentUser = currentUser?.username === username;

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={data.name} imageUrl={data.imageUrl} className="h-20 w-20" />
            <div>
              <h1 className="font-display text-4xl font-semibold text-ink">{data.name}</h1>
              <div className="mt-1 text-sm text-ink-muted">@{data.username}</div>
              <div className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">
                {data.bio ?? "Profil ini sudah terhubung ke fondasi query dan siap dikembangkan ke social graph penuh."}
              </div>
            </div>
          </div>
          {isCurrentUser ? (
            <Link to="/settings/profile" className={buttonClasses({ variant: "primary", size: "md" })}>
              Edit profil
            </Link>
          ) : null}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.25rem] border border-line bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">Followers</div>
            <div className="mt-2 text-2xl font-semibold text-ink">{data.followerCount}</div>
          </div>
          <div className="rounded-[1.25rem] border border-line bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">Following</div>
            <div className="mt-2 text-2xl font-semibold text-ink">{data.followingCount}</div>
          </div>
          <div className="rounded-[1.25rem] border border-line bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">Grup</div>
            <div className="mt-2 text-2xl font-semibold text-ink">{data.groupCount}</div>
          </div>
        </div>
      </section>

      <PagePlaceholder
        eyebrow="Profil"
        title="Timeline profil, daftar post, dan relasi follow tinggal ditambahkan di fase sosial."
        description="Route dinamis username, card identitas, dan tautan settings sudah terpasang agar pengembangan selanjutnya fokus ke perilaku, bukan struktur dasar."
        tags={["Dynamic route", "Profile summary", "Social extension point"]}
      />
    </div>
  );
}
