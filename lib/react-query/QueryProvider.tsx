import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
