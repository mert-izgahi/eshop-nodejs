"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQueryProvider({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000, // milliseconds
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
