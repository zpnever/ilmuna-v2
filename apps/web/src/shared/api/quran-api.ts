import type { QuranAyahPreview, QuranSurahSummary } from "@/shared/api/contracts";
import { apiClient } from "@/shared/api/client";

export const quranApi = {
  getSurahSummaries() {
    return apiClient.get("quran/surahs").json<QuranSurahSummary[]>();
  },
  getDailyAyah() {
    return apiClient.get("quran/ayah-of-the-day").json<QuranAyahPreview>();
  },
};

