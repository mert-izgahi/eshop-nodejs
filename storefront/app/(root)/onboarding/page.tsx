import { Container } from '@/components/common/container';
import StoreForm from '@/components/forms/store-form';
import { StoreIcon } from 'lucide-react';

import React from 'react'

function CompletePartnerProfilePage() {
    return (
        <Container className='flex flex-col gap-6 py-8'>
            {/* Header */}
            <div className="text-center space-y-2">
                <StoreIcon className="w-12 h-12 text-red-600 mx-auto" />
                <h1 className='text-3xl font-bold'>Create your first store</h1>
                <p className='text-muted-foreground max-w-2xl mx-auto'>
                    Let us starting by creating your first store
                </p>
            </div>

            <StoreForm />
            {/* Help Section */}
            <div className="text-center space-y-2">
                <h3 className="font-medium">Need Help?</h3>
                <p className='text-sm text-muted-foreground max-w-md mx-auto'>
                    If you're experiencing issues with admin access verification, please contact our support team for assistance.
                </p>
            </div>
        </Container>
    )
}

export default CompletePartnerProfilePage