"use client";

import { useAuth } from '@/providers/auth-provider';
import { Loader2, AlertTriangle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useCallback } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/layouts/sidebars';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  const { isCheckingAuth, user, refreshUser } = useAuth();
  const router = useRouter();

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const adminAccessStatus = useMemo(() => {
    if (!isAdmin || !user) {
      return { hasAccess: false, isExpiring: false, expiresAt: null };
    }

    const hasAccessKey = !!user.adminAccessKey;
    const expiresAt = user.adminAccessKeyExpires ? dayjs(user.adminAccessKeyExpires) : null;
    const hasValidExpiry = expiresAt && expiresAt.isAfter(dayjs());
    const hasAccess = hasAccessKey && hasValidExpiry;

    // Check if expiring within 15 minutes
    const isExpiring = expiresAt ? expiresAt.diff(dayjs(), 'minute') <= 15 : false;

    return {
      hasAccess,
      isExpiring,
      expiresAt,
    };
  }, [isAdmin, user?.adminAccessKey, user?.adminAccessKeyExpires]);

  const handleRequestAdminAccess = useCallback(() => {
    router.push('/request-admin-access');
  }, [router]);

  // Redirect non-admin users
  useEffect(() => {
    if (!isCheckingAuth && !isAdmin) {
      router.push('/sign-in');
    }
  }, [isCheckingAuth, isAdmin, router]);

  // Redirect admins without access
  useEffect(() => {
    if (!isCheckingAuth && isAdmin && !adminAccessStatus.hasAccess) {
      router.push('/request-admin-access');
    }
  }, [isCheckingAuth, isAdmin, adminAccessStatus.hasAccess, router]);

  // Auto-refresh user data periodically to check admin access status
  useEffect(() => {
    if (isAdmin && adminAccessStatus.hasAccess) {
      const interval = setInterval(() => {
        refreshUser?.();
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAdmin, adminAccessStatus.hasAccess, refreshUser]);

  // Show loading state
  if (isCheckingAuth || !isAdmin) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  // Show access required state
  if (!adminAccessStatus.hasAccess) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <div className='max-w-md text-center space-y-4'>
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-semibold">Admin Access Required</h2>
          <p className="text-muted-foreground">
            You need to verify your admin access to continue.
          </p>
          <Button onClick={handleRequestAdminAccess} className="w-full">
            Request Admin Access
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className='flex-1 flex flex-col'>
        {/* Admin Access Warning */}
        {adminAccessStatus.isExpiring && (
          <Alert className="m-4 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            <Clock className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Your admin access will expire in{' '}
                {adminAccessStatus.expiresAt?.diff(dayjs(), 'minute')} minutes.
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRequestAdminAccess}
                className="ml-2"
              >
                Extend Access
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <header className='flex items-center justify-between h-16  bg-neutral-50 dark:bg-neutral-900 px-6'>
          <SidebarTrigger />

          {/* Admin Access Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
              <span className='text-xs'>Admin Access Active</span>
            </div>
            {adminAccessStatus.expiresAt && (
              <span className="text-xs">
                (expires {dayjs(adminAccessStatus.expiresAt).format('h:mm A')})
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