import type { AuthSession, LoginPayload, RegisterPayload } from "@/shared/api/contracts";
import { apiClient } from "@/shared/api/client";

export const authApi = {
  login(payload: LoginPayload) {
    return apiClient.post("auth/login", { json: payload }).json<AuthSession>();
  },
  register(payload: RegisterPayload) {
    return apiClient.post("auth/register", { json: payload }).json<AuthSession>();
  },
  logout() {
    return apiClient.post("auth/logout").text();
  },
  getCurrentSession() {
    return apiClient.get("auth/me").json<AuthSession["user"]>();
  },
};

