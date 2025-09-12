"use client"
import { Container } from '@/components/common/container'
import AccountForm from '@/components/forms/account-form'
import { Separator } from '@/components/ui/separator'
import React from 'react'
interface Props {
    id: string
}
function AccountDetailsPage({ id }: Props) {
    return (
        <Container className='flex flex-col py-6'>
            {/* Header */}
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className='text-2xl font-bold'>Account Details</h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage customer details
                    </p>
                </div>
            </div>
            <Separator className='my-4' />

            {/* Content */}
            <AccountForm id={id} />
        </Container>
    )
}

export default AccountDetailsPage