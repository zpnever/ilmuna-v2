import { act, render } from "@testing-library/react";
import { createMemoryHistory } from "@tanstack/react-router";
import type { AuthSession } from "@/shared/api/contracts";
import { App, createAppRouter } from "@/app/router";
import { createAppQueryClient } from "@/app/query-client";
import { useSessionStore } from "@/features/auth/session-store";

type RenderRouteOptions = {
  route?: string;
  session?: AuthSession | null;
};

export async function renderRoute({ route = "/", session = null }: RenderRouteOptions = {}) {
  const queryClient = createAppQueryClient();

  if (session) {
    useSessionStore.getState().setSession(session);
  }

  const router = createAppRouter({
    history: createMemoryHistory({
      initialEntries: [route],
    }),
    queryClient,
  });

  let rendered!: ReturnType<typeof render>;

  await act(async () => {
    rendered = render(<App router={router} queryClient={queryClient} />);
    await router.load();
  });

  return {
    queryClient,
    router,
    ...rendered,
  };
}
