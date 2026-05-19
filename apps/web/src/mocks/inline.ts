import { resolveMockRequest } from "@/mocks/resolver";

let originalFetch: typeof window.fetch | null = null;

export function enableInlineMocking() {
  if (typeof window === "undefined" || originalFetch) {
    return;
  }

  originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init);
    const response = await resolveMockRequest(request);

    if (response) {
      return response;
    }

    return originalFetch!(input, init);
  };
}

