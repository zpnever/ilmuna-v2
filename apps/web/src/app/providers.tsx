import type { PropsWithChildren } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";

type AppProvidersProps = PropsWithChildren<{
  queryClient: QueryClient;
}>;

export function AppProviders({ children, queryClient }: AppProvidersProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

