import { Outlet, ScrollRestoration, createRootRouteWithContext } from "@tanstack/react-router";
import type { RouterContext } from "@/app/router";

function RootComponent() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

