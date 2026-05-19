import { createFileRoute } from "@tanstack/react-router";
import { FollowsPage } from "@/features/profile/follows-page";

function FollowersRouteComponent() {
  const { username } = Route.useParams();
  return <FollowsPage username={username} mode="followers" />;
}

export const Route = createFileRoute("/(app)/_app/$username/followers")({
  component: FollowersRouteComponent,
});

