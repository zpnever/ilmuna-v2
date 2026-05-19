import { redirect } from "@tanstack/react-router";
import type { RouterContext } from "@/app/router";
import { useSessionStore } from "@/features/auth/session-store";
import { currentUserQueryOptions } from "@/shared/api/query-options";

type LoaderArgs = {
  context: RouterContext;
};

export async function publicLoader() {
  return null;
}

export async function guestOnlyLoader() {
  const session = useSessionStore.getState().session;

  if (session) {
    throw redirect({
      to: "/feed",
    });
  }

  return null;
}

export async function authOnlyLoader() {
  const session = useSessionStore.getState().session;

  if (!session) {
    throw redirect({
      to: "/login",
    });
  }

  return null;
}

export async function prefetchCurrentUser({ context }: LoaderArgs) {
  const session = useSessionStore.getState().session;

  if (!session) {
    return null;
  }

  await context.queryClient.ensureQueryData(currentUserQueryOptions());

  return null;
}

