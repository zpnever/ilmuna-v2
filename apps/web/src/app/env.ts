const fallbackBaseUrl = "/api/v1";

export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl,
  apiMocking: import.meta.env.VITE_API_MOCKING || "enabled",
} as const;

export type ApiMockingMode = (typeof appEnv)["apiMocking"];

