"use client";

import { clearTokens } from '@/lib/local-storage';
import { useAuth } from '@/providers/auth-provider';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from '@/components/layouts/sidebars';

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isCheckingAuth, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && !isAdmin) {
      clearTokens();
      router.push('/sign-in');
    }
  }, [isCheckingAuth, isAdmin, router]);

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