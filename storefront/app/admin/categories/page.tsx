"use client"
import React from 'react'
import { Container } from '@/components/common/container'
import CategoriesTable from '@/components/tables/categories-table'
import CreateCategoryModal from '@/components/modals/create-category-modal'
import { Separator } from '@/components/ui/separator'
function CategoriesPage() {


  return (
    <Container className='flex flex-col py-6'>
      {/* Header */}
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className='text-2xl font-bold'>Categories</h1>
          <p className='text-sm text-muted-foreground'>
            List of categories available in the store
          </p>
        </div>
        <CreateCategoryModal />
      </div>
      <Separator className='my-4' />

      {/* Content */}
      <CategoriesTable />
    </Container>
  )
}

export default CategoriesPage