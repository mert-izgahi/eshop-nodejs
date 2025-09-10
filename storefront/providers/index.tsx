"use client";

import * as React from "react";
import ReactQueryProvider from "./react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./auth-provider";


interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-center" />
      </AuthProvider>
    </ReactQueryProvider>
  );
}
