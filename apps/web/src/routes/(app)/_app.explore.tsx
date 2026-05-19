import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage } from "@/features/explore/explore-page";
import { featuredGroupsQueryOptions, quranSummaryQueryOptions } from "@/shared/api/query-options";

export const Route = createFileRoute("/(app)/_app/explore")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(featuredGroupsQueryOptions()),
      context.queryClient.ensureQueryData(quranSummaryQueryOptions()),
    ]),
  component: ExplorePage,
});

