import { Outlet, createFileRoute } from "@tanstack/react-router";
import { publicLoader } from "@/shared/router/loaders";

function PublicLayout() {
  return <Outlet />;
}

export const Route = createFileRoute("/(public)/_public")({
  beforeLoad: publicLoader,
  component: PublicLayout,
});

