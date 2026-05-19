import { createFileRoute } from "@tanstack/react-router";
import { GroupsPage } from "@/features/groups/groups-page";
import { featuredGroupsQueryOptions } from "@/shared/api/query-options";

export const Route = createFileRoute("/(app)/_app/groups")({
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredGroupsQueryOptions()),
  component: GroupsPage,
});

