import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/features/public/landing-page";
import { landingSnapshotQueryOptions } from "@/shared/api/query-options";

export const Route = createFileRoute("/(public)/_public/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(landingSnapshotQueryOptions()),
  component: LandingPage,
});

