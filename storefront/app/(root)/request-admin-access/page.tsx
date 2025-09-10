"use client";

import { Container } from '@/components/common/container'
import AdminAccessRequestForm from '@/components/forms/admin-access-request-form';
import AdminAccessVerifyKeyForm from '@/components/forms/admin-access-verify-key-form';
import { Separator } from '@/components/ui/separator';
import React from 'react'

function RequestAdminAccess() {
  return (
    <Container className='flex flex-col gap-4 py-8'>

      <div className="flex flex-row items-center gap-4">
        <span className='w-8 h-8 bg-neutral-900 text-white rounded-sm flex items-center justify-center'>1</span>
        <h1 className='text-2xl font-bold'>
          Request Admin Access Key
        </h1>
      </div>
      <p className='text-sm text-muted-foreground'>
        Please fill out the form below to request admin access.
      </p>
      <AdminAccessRequestForm />
      <Separator />


      <div className="flex flex-row gap-4">
        <span className='w-8 h-8 bg-neutral-900 text-white rounded-sm flex items-center justify-center'>2</span>
        <h1 className='text-2xl font-bold'>
          Verify Admin Access Key
        </h1>
      </div>
      <p className='text-sm text-muted-foreground'>
        If you have already requested admin access, please verify your access key.
      </p>

      <AdminAccessVerifyKeyForm />
      <Separator />

      <p className='text-sm text-muted-foreground'>
        If you have any questions, please contact our support team.
      </p>
    </Container>
  )
}

export default RequestAdminAccess