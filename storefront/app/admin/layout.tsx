"use client";

import { useAuth } from '@/providers/auth-provider';
import { Loader2, AlertTriangle, Clock, } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useMemo, useCallback } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/layouts/sidebars';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  const { isCheckingAuth, user, refreshUser } = useAuth();
  const router = useRouter();

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const { data: adminAccessStatus, isLoading: isCheckingAdminAccess, refetch: checkAdminAccess } = useQuery<{ hasValidAdminAccess: boolean, adminAccessKeyExpires: string }>({
    queryKey: ["check-admin-status"],
    queryFn: async () => {
      const response = await api.get("/api/v1/admin/check-admin-status");
      const { data } = await response.data;
      console.log(data);
      return data;
    }
  });


  // Redirect non-admin users
  useEffect(() => {
    if (!isCheckingAuth && !isAdmin) {
      router.push('/sign-in');
    }
  }, [isCheckingAuth, isAdmin, router]);

  // Redirect admins without access
  useEffect(() => {
    if (!isCheckingAuth && isAdmin && !isCheckingAdminAccess && !adminAccessStatus?.hasValidAdminAccess) {
      router.push('/request-admin-access');
    }
  }, [isCheckingAuth, isAdmin, isCheckingAdminAccess, adminAccessStatus?.hasValidAdminAccess, router]);

  // Auto-refresh user data periodically to check admin access status
  useEffect(() => {
    if (isAdmin && adminAccessStatus?.hasValidAdminAccess && !isCheckingAdminAccess) {
      const interval = setInterval(() => {
        checkAdminAccess?.();
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAdmin, adminAccessStatus?.hasValidAdminAccess, isCheckingAdminAccess]);


  
  // Show loading state
  if (isCheckingAuth || isCheckingAdminAccess || !isAdmin) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }



  // Show access required state
  if (!adminAccessStatus?.hasValidAdminAccess) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <pre>
          {JSON.stringify(adminAccessStatus, null, 2)}
        </pre>
        <div className='max-w-md text-center space-y-4'>
          <AlertTriangle className="w-16 h-16 text-amber-600 mx-auto" />
          <h2 className="text-2xl font-semibold">Admin Access Required</h2>
          <p className="text-muted-foreground text-sm">
            You need to verify your admin access to continue.
          </p>
          <Button asChild className="w-full">
            <Link href="/request-admin-access">Request Admin Access</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className='flex-1 flex flex-col'>
        {/* Header */}
        <header className='flex items-center justify-between h-16  bg-neutral-50 dark:bg-neutral-900 px-6'>
          <SidebarTrigger />

          {/* Admin Access Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-lime-600"></div>
              <span className='text-xs'>Admin Access Active</span>
            </div>
            {adminAccessStatus?.adminAccessKeyExpires && (
              <span className="text-xs">
                (expires {dayjs(adminAccessStatus.adminAccessKeyExpires).format('h:mm A')})
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default AuthLayout;