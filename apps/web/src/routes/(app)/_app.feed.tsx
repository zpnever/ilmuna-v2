import { createFileRoute } from "@tanstack/react-router";
import { FeedPage } from "@/features/feed/feed-page";
import { feedPreviewQueryOptions, notificationSummaryQueryOptions } from "@/shared/api/query-options";

export const Route = createFileRoute("/(app)/_app/feed")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(feedPreviewQueryOptions()),
      context.queryClient.ensureQueryData(notificationSummaryQueryOptions()),
    ]),
  component: FeedPage,
});

