import type { CurrentUser, PaginatedResponse } from "@/shared/api/contracts";
import { apiClient } from "@/shared/api/client";

type FollowUser = Pick<CurrentUser, "id" | "name" | "username" | "imageUrl" | "isVerified">;

export const userApi = {
  getCurrentUser() {
    return apiClient.get("auth/me").json<CurrentUser>();
  },
  getProfile(username: string) {
    return apiClient.get(`users/${username}`).json<CurrentUser>();
  },
  getFollowers(username: string) {
    return apiClient.get(`users/${username}/followers`).json<PaginatedResponse<FollowUser>>();
  },
  getFollowing(username: string) {
    return apiClient.get(`users/${username}/following`).json<PaginatedResponse<FollowUser>>();
  },
};

