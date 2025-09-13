"use client";

import { useAuth } from '@/providers/auth-provider';
import { Loader2, AlertTriangle, } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import PartnerSidebar from '@/components/layouts/sidebars/partner-sidebar';
interface AuthLayoutProps {
    children: React.ReactNode;
}

function PartnerLayout({ children }: AuthLayoutProps) {
    const { isCheckingAuth, user, refreshUser } = useAuth();
    const router = useRouter();

    const isPartner = useMemo(() => user?.role === "partner", [user?.role]);

    const { data: partnerAccessStatus, isLoading: isCheckingPartnerAccess, refetch: checkPartnerAccess } = useQuery<{ hasValidPartnerAccess: boolean, partnerAccessKeyExpires: string, onboarding: boolean }>({
        queryKey: ["check-partner-status"],
        queryFn: async () => {
            const response = await api.get("/api/v1/partner/check-partner-status");
            const { data } = await response.data;
            return data;
        }
    });

    // Redirect non-partner users
    useEffect(() => {
        if (!isCheckingAuth && !isPartner) {
            router.push('/sign-in');
        }
    }, [isCheckingAuth, isPartner, router]);

    // Redirect partners with onboarding
    useEffect(() => {
        if (!isCheckingAuth && isPartner && !isCheckingPartnerAccess && partnerAccessStatus?.onboarding) {
            router.push('/onboarding');
        }
    }, [isCheckingAuth, isPartner, isCheckingPartnerAccess, partnerAccessStatus?.onboarding, router]);

    


    // Redirect partners without access
    useEffect(() => {
        if (!isCheckingAuth && isPartner && !isCheckingPartnerAccess && !partnerAccessStatus?.onboarding && !partnerAccessStatus?.hasValidPartnerAccess) {
            router.push('/request-partner-access');
        }
    }, [isCheckingAuth, isPartner, isCheckingPartnerAccess, partnerAccessStatus?.hasValidPartnerAccess, partnerAccessStatus?.onboarding, router]);

    // Auto-refresh user data periodically to check admin access status
    useEffect(() => {
        if (isPartner && partnerAccessStatus?.hasValidPartnerAccess && !isCheckingPartnerAccess) {
            const interval = setInterval(() => {
                checkPartnerAccess?.();
            }, 5 * 60 * 1000); // Check every 5 minutes

            return () => clearInterval(interval);
        }
    }, [isPartner, partnerAccessStatus?.hasValidPartnerAccess, isCheckingPartnerAccess]);



    // Show loading state
    if (isCheckingAuth || isCheckingPartnerAccess || !isPartner) {
        return (
            <div className='w-full h-screen flex justify-center items-center'>
                <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
            </div>
        );
    }


    if (partnerAccessStatus?.onboarding) {
        return (
            <div className='w-full h-screen flex justify-center items-center'>
                <div className='max-w-md text-center space-y-4'>
                    <AlertTriangle className="w-16 h-16 text-amber-600 mx-auto" />
                    <h2 className="text-2xl font-semibold">Complete Pratner Onboarding</h2>
                    <p className="text-muted-foreground text-sm">
                        You need to complete your onboarding to continue.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/onboarding">Complete Onboarding</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Show access required state
    if (!partnerAccessStatus?.hasValidPartnerAccess) {
        return (
            <div className='w-full h-screen flex justify-center items-center'>
                <div className='max-w-md text-center space-y-4'>
                    <AlertTriangle className="w-16 h-16 text-amber-600 mx-auto" />
                    <h2 className="text-2xl font-semibold">Partner Access Required</h2>
                    <p className="text-muted-foreground text-sm">
                        You need to verify your partner access to continue.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/request-partner-access">Request Partner Access</Link>
                    </Button>
                </div>
            </div>
        );
    }
    return <>{children}</>;
    // return (
    //     <SidebarProvider>
    //         <PartnerSidebar />
    //         <main className='flex-1 flex flex-col'>
    //             {/* Header */}
    //             <header className='flex items-center justify-between h-16  bg-neutral-50 dark:bg-neutral-900 px-6'>
    //                 <SidebarTrigger />

    //                 {/* Admin Access Status */}
    //                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
    //                     <div className="flex items-center gap-1">
    //                         <div className="w-2 h-2 rounded-full bg-lime-600"></div>
    //                         <span className='text-xs'>Partner Access Active</span>
    //                     </div>
    //                     {partnerAccessStatus?.partnerAccessKeyExpires && (
    //                         <span className="text-xs">
    //                             (expires {dayjs(partnerAccessStatus.partnerAccessKeyExpires).format('h:mm A')})
    //                         </span>
    //                     )}
    //                 </div>
    //             </header>

    //             {/* Content */}
    //             <div className="flex-1 overflow-auto">
    //                 {children}
    //             </div>
    //         </main>
    //     </SidebarProvider>
    // );
}

export default PartnerLayout;