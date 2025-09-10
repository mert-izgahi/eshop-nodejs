"use client";
import { useAuth } from '@/providers/auth-provider';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from '@/components/layouts/sidebars';
import { storage } from '@/lib/local-storage';

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isCheckingAuth, isAdmin, user } = useAuth();
  const adminAccessKey = storage.adminAccessKey;
  const hasPermissions = useMemo(() => {
    if (isAdmin && adminAccessKey && user?.adminAccessKey === adminAccessKey) {
      return true;
    }
    return false;
  }, [isAdmin, adminAccessKey, user?.adminAccessKey]);
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && !isAdmin) {
      storage.clearAll();
      router.push('/sign-in');
    }
  }, [isCheckingAuth, isAdmin,]);


  useEffect(() => {
    if (!isCheckingAuth && isAdmin && !hasPermissions) {
      router.push('/request-admin-access');
    }
  }, [isCheckingAuth, isAdmin, hasPermissions]);

  if (isCheckingAuth || !isAdmin) {
    return <div className='w-full h-screen flex justify-center items-center'>
      <Loader2 className="animate-spin w-5 h-5" />
    </div>
  }
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>
        <header>
          <SidebarTrigger />
        </header>
        {children}
      </main>
    </SidebarProvider>
  )
}

export default AuthLayout