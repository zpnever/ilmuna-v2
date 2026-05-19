import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { useSessionStore } from "@/features/auth/session-store";
import { resetMockDb } from "@/mocks/fixtures";
import { server } from "@/mocks/server";

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  }),
);

beforeEach(() => {
  resetMockDb();
  localStorage.clear();
  useSessionStore.getState().clearSession();
  window.scrollTo = vi.fn();
  globalThis.AbortController = window.AbortController;
  globalThis.AbortSignal = window.AbortSignal;
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
