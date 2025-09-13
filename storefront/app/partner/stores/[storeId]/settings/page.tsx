"use client"

import { Container } from '@/components/common/container'
import StoreForm from '@/components/forms/store-form'
import { Separator } from '@/components/ui/separator'
import { useParams } from 'next/navigation'
import React from 'react'

function StoreSettingsPage() {
    const params = useParams();
    const storeId = params.storeId
    return (
        <Container className='flex flex-col py-6'>
            {/* Header */}
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className='text-2xl font-bold'>Store Settings</h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage store settings, and configure your store
                    </p>
                </div>
            </div>
            <Separator className='my-4' />

            {/* Content */}
            <StoreForm mode='update' storeId={storeId as string} />
        </Container>
    )
}

export default StoreSettingsPage