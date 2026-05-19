import { appEnv } from "@/app/env";
import { useSessionStore } from "@/features/auth/session-store";

export class ApiHttpError extends Error {
  response: Response;
  body: unknown;

  constructor(response: Response, body: unknown) {
    super(response.statusText || "HTTP request failed");
    this.name = "ApiHttpError";
    this.response = response;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | null;
  json?: unknown;
};

async function performRequest<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const token = useSessionStore.getState().session?.accessToken;

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${appEnv.apiBaseUrl.replace(/\/$/, "")}/${path}`, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  if (!response.ok) {
    let body: unknown = null;
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    throw new ApiHttpError(response, body);
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

function createMethod(method: "GET" | "POST" | "PATCH" | "DELETE") {
  return (path: string, options: RequestOptions = {}) => ({
    json: <T>() => performRequest<T>(path, { ...options, method }),
    text: () => performRequest<string>(path, { ...options, method }),
  });
}

export const apiClient = {
  get: createMethod("GET"),
  post: createMethod("POST"),
  patch: createMethod("PATCH"),
  delete: createMethod("DELETE"),
};
