import { api } from '@/lib/axios-client'
import { useQuery } from '@tanstack/react-query'
import { CustomerType, IPagination, IResponseWithPagination } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import Datatable from './datatable';
import dayjs from 'dayjs'

import { Button } from '../ui/button'
import { DetailsIcon } from '@/lib/icons'
import TableSearchForm from './datatable/table-search-form'
import { useSearchParams } from 'next/navigation'
import TableSortSelect from './datatable/table-sort-select'
import TablePagination from './datatable/table-pagination'
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

    const { data: customers, isLoading, refetch } = useQuery<IResponseWithPagination<CustomerType>>({
        queryKey: ['get-customers', search, sortBy, sortType, page],
        queryFn: async () => {
            const response = await api.get(`/api/v1/admin/customers?search=${search}&sortBy=${sortBy}&sortType=${sortType}&page=${page}`,)
            const { data } = await response.data;
            return data
        },
    });


    const columns = React.useMemo<ColumnDef<CustomerType>[]>(
        () => [
            {
                header: 'ID',
                accessorKey: '_id',
            },
            {
                header: "Account",
                accessorKey: "accountId",
                cell: ({ row }) => {
                    return <Link className='hover:underline' href={`/admin/accounts/${row.original._id}`}>{row.original.account.firstName} {row.original.account.lastName}</Link>
                }
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
                    <TableSortSelect sortFieldKey='firstName' sortFieldLabel='First Name' />
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