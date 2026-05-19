import { createFileRoute } from "@tanstack/react-router";
import { FollowsPage } from "@/features/profile/follows-page";

function FollowingRouteComponent() {
  const { username } = Route.useParams();
  return <FollowsPage username={username} mode="following" />;
}

export const Route = createFileRoute("/(app)/_app/$username/following")({
  component: FollowingRouteComponent,
});

