import type { HadithBookSummary } from "@/shared/api/contracts";
import { apiClient } from "@/shared/api/client";

export const hadithApi = {
  getBooks() {
    return apiClient.get("hadist/books").json<HadithBookSummary[]>();
  },
};

