import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/features/profile/profile-page";

function ProfileRouteComponent() {
  const { username } = Route.useParams();
  return <ProfilePage username={username} />;
}

export const Route = createFileRoute("/(app)/_app/$username")({
  component: ProfileRouteComponent,
});

