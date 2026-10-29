"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";
import { LangProvider } from "@/lib/i18n";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <AuthProvider>
          {children}
          <Toaster theme="dark" richColors position="bottom-right" />
        </AuthProvider>
      </LangProvider>
    </QueryClientProvider>
  );
}
