import { api } from '@/lib/axios-client'
import { useQuery } from '@tanstack/react-query'
import { CategoryType } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import Datatable from './datatable';
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import dayjs from 'dayjs'
import { Button } from '../ui/button'
import { DeleteIcon, EditIcon,CopyIcon } from '@/lib/icons'
import { UpdateCategoryModal,DeleteCategoryModal } from '../modals/categories'
function CategoriesTable() {
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['get-categories'],
        queryFn: async () => {
            const response = await api.get('/api/v1/categories')
            const data = await response.data
            return data
        }
    });

    const columns = React.useMemo<ColumnDef<CategoryType>[]>(
        () => [
            {
                header: "Image",
                accessorKey: 'image',
                cell: ({ row }) => {
                    return (
                        <div className='w-10 h-10'>
                            <img src={row.original.image || './img-placeholder.svg'}
                                width={100} height={100}
                                alt={row.original.name}
                                className='w-full h-full'
                            />
                        </div>
                    )
                }
            },
            {
                header: 'ID',
                accessorKey: '_id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Description',
                accessorKey: 'description',
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: ({ row }) => {
                    return (
                        <div>{dayjs(row.original.createdAt).format('DD/MM/YYYY')}</div>
                    )
                }
            },
            {
                header: "Actions",
                accessorKey: "actions",
                cell: ({ row }) => {
                    return (
                        <div className='flex gap-2'>
                            <UpdateCategoryModal id={row.original._id} />
                            <DeleteCategoryModal id={row.original._id} />
                            <Button size={"icon"} type='button' variant={"ghost"}>
                                <CopyIcon className='w-4 h-4' />
                            </Button>
                        </div>
                    )
                }
            }
        ],
        [],
    )

    return (
        <Datatable columns={columns} data={categories?.data} loading={isLoading} />
    )
}

export default CategoriesTable