"use client";

import * as React from "react";
import ReactQueryProvider from "./react-query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
