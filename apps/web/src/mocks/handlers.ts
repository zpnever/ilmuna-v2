import { http, passthrough } from "msw";
import { resolveMockRequest } from "@/mocks/resolver";

export const handlers = [
  http.all("*", async ({ request }) => {
    const response = await resolveMockRequest(request);
    return response ?? passthrough();
  }),
];

