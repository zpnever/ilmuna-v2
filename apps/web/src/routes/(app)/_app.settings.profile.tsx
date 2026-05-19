import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/features/settings/settings-page";

export const Route = createFileRoute("/(app)/_app/settings/profile")({
  component: () => <SettingsPage section="profile" />,
});

