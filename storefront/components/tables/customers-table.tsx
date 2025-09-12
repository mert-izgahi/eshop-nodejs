import { api } from '@/lib/axios-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CategoryType, IAccount, IPagination, IResponseWithPagination } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import Datatable from './datatable';
import { Loader2 } from 'lucide-react'
import dayjs from 'dayjs'
import { Button } from '../ui/button'
import { CopyIcon, DetailsIcon } from '@/lib/icons'
import { UpdateCategoryModal, DeleteCategoryModal } from '../modals/categories'
import { toast } from 'sonner'
import TableSearchForm from './datatable/table-search-form'
import { useSearchParams } from 'next/navigation'
import TableSortSelect from './datatable/table-sort-select'
import TablePagination from './datatable/table-pagination'
import { DeleteUserModal } from '../modals/users'
import Link from 'next/link'
function CustomersTable() {
    const searchParams = useSearchParams();

    const search = useMemo(() => {
        return searchParams.get('search') || ''
    }, [searchParams])

    const sortBy = useMemo(() => {
        return searchParams.get('sortBy') || ''
    }, [searchParams]);

    const sortType = useMemo(() => {
        return searchParams.get('sortType') || ''
    }, [searchParams]);

    const page = useMemo(() => {
        return searchParams.get('page') || '1'
    }, [searchParams]);

    const { data: customers, isLoading, refetch } = useQuery<IResponseWithPagination<IAccount>>({
        queryKey: ['get-customers', search, sortBy, sortType, page],
        queryFn: async () => {
            const response = await api.get(`/api/v1/users/customers?search=${search}&sortBy=${sortBy}&sortType=${sortType}&page=${page}`,)
            const { data } = await response.data;
            return data
        },
    });


    const columns = React.useMemo<ColumnDef<IAccount>[]>(
        () => [
            {
                header: "Image",
                accessorKey: 'profilePicture',
                cell: ({ row }) => {
                    return (
                        <div className='w-10 h-10'>
                            <img src={row.original.profilePicture || './img-placeholder.svg'}
                                width={100} height={100}
                                alt={row.original.firstName}
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
                header: 'First Name',
                accessorKey: 'firstName',
            },
            {
                header: 'Last Name',
                accessorKey: 'lastName',
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
                            <DeleteUserModal id={row.original._id} />
                            <Button size={"icon"} type='button' variant={"ghost"} asChild>
                                <Link href={`/admin/customers/${row.original._id}`}>
                                    <DetailsIcon className='w-4 h-4' />
                                </Link>
                            </Button>
                        </div>
                    )
                }
            }
        ],
        [],
    )

    return (
        <div className='flex flex-col gap-y-4'>
            <div className="flex flex-row items-center justify-between">
                <div>
                    <TableSearchForm />
                </div>
                <div>
                    <TableSortSelect />
                </div>
            </div>
            <Datatable columns={columns} data={customers?.results || []} loading={isLoading} />

            <div className="flex">
                <TablePagination {...customers?.pagination as IPagination} />
            </div>
        </div>
    )
}

export default CustomersTable