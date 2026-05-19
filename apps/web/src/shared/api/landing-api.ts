import type { FeedPostPreview, LandingSnapshot } from "@/shared/api/contracts";
import { apiClient } from "@/shared/api/client";

export const landingApi = {
  getSnapshot() {
    return apiClient.get("public/landing").json<LandingSnapshot>();
  },
  getFeaturedFeed() {
    return apiClient.get("feed").json<FeedPostPreview[]>();
  },
};

