"use client";

import PartnerSidebar from '@/components/layouts/sidebars/partner-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { api } from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useMemo } from 'react'
import { useParams } from 'next/navigation';

function layout({ children }: { children: React.ReactNode }) {
    const { data: partnerAccessStatus, isLoading: isCheckingPartnerAccess, refetch: checkPartnerAccess } = useQuery<{ hasValidPartnerAccess: boolean, partnerAccessKeyExpires: string, onboarding: boolean }>({
        queryKey: ["check-partner-status"],
        queryFn: async () => {
            const response = await api.get("/api/v1/partner/check-partner-status");
            const { data } = await response.data;
            return data;
        }
    });
    const params = useParams();
    const storeId = useMemo(() => {
        return params?.storeId;
    }, [params]);
    return (
        <SidebarProvider>
            <PartnerSidebar currentStoreId={storeId as string} />
            <main className='flex-1 flex flex-col'>
                {/* Header */}
                <header className='flex items-center justify-between h-16  bg-neutral-50 dark:bg-neutral-900 px-6'>
                    <SidebarTrigger />

                    {/* Admin Access Status */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-lime-600"></div>
                            <span className='text-xs'>Partner Access Active</span>
                        </div>
                        {partnerAccessStatus?.partnerAccessKeyExpires && (
                            <span className="text-xs">
                                (expires {dayjs(partnerAccessStatus.partnerAccessKeyExpires).format('h:mm A')})
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

export default layout