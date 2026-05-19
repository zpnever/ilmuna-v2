import type { NotificationSummary } from "@/shared/api/contracts";
import { apiClient } from "@/shared/api/client";

export const notificationApi = {
  getSummary() {
    return apiClient.get("notifications").json<NotificationSummary>();
  },
};

