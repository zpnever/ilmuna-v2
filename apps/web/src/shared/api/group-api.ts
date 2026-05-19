import type { GroupSummary } from "@/shared/api/contracts";
import { apiClient } from "@/shared/api/client";

export const groupApi = {
  getFeaturedGroups() {
    return apiClient.get("groups").json<GroupSummary[]>();
  },
};

