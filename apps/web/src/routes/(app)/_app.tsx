import { createFileRoute } from "@tanstack/react-router";
import { AppShellLayout } from "@/features/app-shell/app-shell";
import { authOnlyLoader, prefetchCurrentUser } from "@/shared/router/loaders";

export const Route = createFileRoute("/(app)/_app")({
  beforeLoad: authOnlyLoader,
  loader: prefetchCurrentUser,
  component: AppShellLayout,
});

