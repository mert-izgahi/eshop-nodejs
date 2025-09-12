"use client"
import { Container } from '@/components/common/container'
import AccountsTable from '@/components/tables/accounts-table'
import { Separator } from '@/components/ui/separator'
import React from 'react'

function CustomersPage() {
    return (
        <Container className='flex flex-col py-6'>
            {/* Header */}
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className='text-2xl font-bold'>Accounts</h1>
                    <p className='text-sm text-muted-foreground'>
                        List of accounts available in platform
                    </p>
                </div>
            </div>
            <Separator className='my-4' />

            {/* Content */}
            <AccountsTable />
        </Container>
    )
}

export default CustomersPage