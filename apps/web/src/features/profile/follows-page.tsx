import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/shared/api/user-api";
import { Avatar } from "@/shared/ui/avatar";
import { PagePlaceholder } from "@/shared/ui/page-placeholder";

type FollowsPageProps = {
  username: string;
  mode: "followers" | "following";
};

export function FollowsPage({ username, mode }: FollowsPageProps) {
  const { data } = useQuery({
    queryKey: ["profile", username, mode],
    queryFn: () => (mode === "followers" ? userApi.getFollowers(username) : userApi.getFollowing(username)),
  });

  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow={mode === "followers" ? "Followers" : "Following"}
        title={`Daftar ${mode === "followers" ? "followers" : "following"} untuk @${username} sudah tersambung ke contract mock.`}
        description="Halaman ini memvalidasi dynamic nested route dan response paginated sejak awal, sehingga nanti tinggal menambah follow action dan infinite scrolling."
        tags={["Nested dynamic route", "Paginated shape", "Social graph"]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {data?.data.map((user) => (
          <article key={user.id} className="glass-panel flex items-center gap-4 rounded-[1.75rem] p-5">
            <Avatar name={user.name} imageUrl={user.imageUrl} className="h-14 w-14" />
            <div>
              <div className="font-semibold text-ink">{user.name}</div>
              <div className="text-sm text-ink-muted">@{user.username}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

