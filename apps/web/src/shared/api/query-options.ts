import { queryOptions } from "@tanstack/react-query";
import { landingApi } from "@/shared/api/landing-api";
import { userApi } from "@/shared/api/user-api";
import { quranApi } from "@/shared/api/quran-api";
import { hadithApi } from "@/shared/api/hadith-api";
import { groupApi } from "@/shared/api/group-api";
import { notificationApi } from "@/shared/api/notification-api";

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: ["auth", "current-user"],
    queryFn: () => userApi.getCurrentUser(),
  });

export const landingSnapshotQueryOptions = () =>
  queryOptions({
    queryKey: ["landing", "snapshot"],
    queryFn: () => landingApi.getSnapshot(),
  });

export const feedPreviewQueryOptions = () =>
  queryOptions({
    queryKey: ["feed", "preview"],
    queryFn: () => landingApi.getFeaturedFeed(),
  });

export const quranSummaryQueryOptions = () =>
  queryOptions({
    queryKey: ["quran", "surah-summaries"],
    queryFn: () => quranApi.getSurahSummaries(),
  });

export const dailyAyahQueryOptions = () =>
  queryOptions({
    queryKey: ["quran", "ayah-of-the-day"],
    queryFn: () => quranApi.getDailyAyah(),
  });

export const hadithBooksQueryOptions = () =>
  queryOptions({
    queryKey: ["hadith", "books"],
    queryFn: () => hadithApi.getBooks(),
  });

export const featuredGroupsQueryOptions = () =>
  queryOptions({
    queryKey: ["groups", "featured"],
    queryFn: () => groupApi.getFeaturedGroups(),
  });

export const notificationSummaryQueryOptions = () =>
  queryOptions({
    queryKey: ["notifications", "summary"],
    queryFn: () => notificationApi.getSummary(),
  });

