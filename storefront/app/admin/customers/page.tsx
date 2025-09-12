"use client"
import { Container } from '@/components/common/container'
import CustomersTable from '@/components/tables/customers-table'
import { Separator } from '@/components/ui/separator'
import React from 'react'

function CustomersPage() {
    return (
        <Container className='flex flex-col py-6'>
            {/* Header */}
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className='text-2xl font-bold'>Customers</h1>
                    <p className='text-sm text-muted-foreground'>
                        List of customers available in stores
                    </p>
                </div>
            </div>
            <Separator className='my-4' />

            {/* Content */}
            <CustomersTable />
        </Container>
    )
}

export default CustomersPage