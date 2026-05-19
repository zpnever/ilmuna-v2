import { beforeEach, describe, expect, it } from "vitest";
import { getDefaultUser, issueSessionForUser, resetMockDb } from "@/mocks/fixtures";
import { useSessionStore } from "@/features/auth/session-store";

describe("session store", () => {
  beforeEach(() => {
    resetMockDb();
    useSessionStore.getState().clearSession();
  });

  it("stores and clears session", () => {
    const session = issueSessionForUser(getDefaultUser());

    useSessionStore.getState().setSession(session);
    expect(useSessionStore.getState().session?.user.email).toBe("demo@ilmuna.id");

    useSessionStore.getState().clearSession();
    expect(useSessionStore.getState().session).toBeNull();
  });
});

