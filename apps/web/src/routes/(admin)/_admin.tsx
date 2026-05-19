import { Outlet, createFileRoute } from "@tanstack/react-router";
import { authOnlyLoader, prefetchCurrentUser } from "@/shared/router/loaders";
import { Logo } from "@/shared/ui/logo";

function AdminLayout() {
  return (
    <div className="section-shell min-h-dvh py-6 md:py-10">
      <Logo />
      <div className="py-8">
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/(admin)/_admin")({
  beforeLoad: authOnlyLoader,
  loader: prefetchCurrentUser,
  component: AdminLayout,
});

