import { createFileRoute } from "@tanstack/react-router";
import { QuranPage } from "@/features/quran/quran-page";
import { dailyAyahQueryOptions, quranSummaryQueryOptions } from "@/shared/api/query-options";

export const Route = createFileRoute("/(app)/_app/quran")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(quranSummaryQueryOptions()),
      context.queryClient.ensureQueryData(dailyAyahQueryOptions()),
    ]),
  component: QuranPage,
});

