import { createFileRoute } from "@tanstack/react-router";
import { HadithPage } from "@/features/hadith/hadith-page";
import { hadithBooksQueryOptions } from "@/shared/api/query-options";

export const Route = createFileRoute("/(app)/_app/hadist")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hadithBooksQueryOptions()),
  component: HadithPage,
});

