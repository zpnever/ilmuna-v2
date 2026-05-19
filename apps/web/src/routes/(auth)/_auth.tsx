import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/shared/ui/logo";
import { guestOnlyLoader } from "@/shared/router/loaders";

function AuthLayout() {
  return (
    <div className="section-shell flex min-h-dvh flex-col py-6 md:py-10">
      <Logo />
      <div className="flex flex-1 items-center justify-center py-10">
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/(auth)/_auth")({
  beforeLoad: guestOnlyLoader,
  component: AuthLayout,
});

