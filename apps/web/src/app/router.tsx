import { RouterProvider, createBrowserHistory, createMemoryHistory, createRouter } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { appQueryClient } from "@/app/query-client";
import { AppProviders } from "@/app/providers";
import { routeTree } from "@/app/routeTree.gen";

export type RouterContext = {
  queryClient: QueryClient;
};

type CreateAppRouterOptions = {
  history?: ReturnType<typeof createBrowserHistory> | ReturnType<typeof createMemoryHistory>;
  queryClient?: QueryClient;
};

export function createAppRouter(options: CreateAppRouterOptions = {}) {
  const queryClient = options.queryClient ?? appQueryClient;

  return createRouter({
    routeTree,
    history: options.history ?? createBrowserHistory(),
    defaultPreload: "intent",
    context: {
      queryClient,
    },
    defaultPendingMinMs: 120,
  });
}

export const appRouter = createAppRouter();
export type AppRouter = typeof appRouter;

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}

type AppProps = {
  router?: AppRouter;
  queryClient?: QueryClient;
};

export function App({ router = appRouter, queryClient = appQueryClient }: AppProps) {
  return (
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

