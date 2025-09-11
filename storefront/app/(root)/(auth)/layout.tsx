"use client";
import * as React from "react";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();


  // Redirect to home if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);


  return <div>{children}</div>;
}
