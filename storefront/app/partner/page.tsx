"use client"
import { api } from '@/lib/axios-client';
import { useAuth } from '@/providers/auth-provider'
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'

function page() {
    const { user } = useAuth();
    const router = useRouter();


    const storesQuery = useQuery({
        queryKey: ["partner-stores"],
        queryFn: async () => {
            const response = await api.get("/api/v1/partner/stores");
            const { data } = await response.data;
            return data;
        },
        enabled: !!user,
        retry: false
    });

    const lastStore = useMemo(() => {
        return storesQuery.data?.[0];
    }, [storesQuery.data]);

    useEffect(() => {
        if (!user) {
            router.push('/sign-in');
        }
    }, [user, router]);

    useEffect(() => {
        if (storesQuery.isSuccess && !lastStore) {
            router.push('/onboarding');
        }
    }, [storesQuery.isSuccess, lastStore, router]);

    useEffect(() => {
        if (storesQuery.isSuccess && lastStore) {
            router.push(`/partner/stores/${lastStore._id}`);
        }
    }, [storesQuery.isSuccess, lastStore, router]);


    if (storesQuery.isLoading) {
        return <div className='flex flex-col items-center justify-center h-screen'>
            <Loader2 className='animate-spin' />
        </div>
    }
    return <div className='flex flex-col items-center justify-center h-screen'>
        <p>
            Redirecting to your store dashboard
        </p>
    </div>
}

export default page