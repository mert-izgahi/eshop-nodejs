import { api } from '@/lib/axios-client'
import { useQuery } from '@tanstack/react-query'
import { AccountType, IPagination, IResponseWithPagination } from '@/types'
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
import { DeleteAccountModal } from '../modals/accounts'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
function AccountsTable() {
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

    const { data: accounts, isLoading, refetch } = useQuery<IResponseWithPagination<AccountType>>({
        queryKey: ['get-accounts', search, sortBy, sortType, page],
        queryFn: async () => {
            const response = await api.get(`/api/v1/admin/accounts?search=${search}&sortBy=${sortBy}&sortType=${sortType}&page=${page}`,)
            const { data } = await response.data;
            return data
        },
    });


    const columns = React.useMemo<ColumnDef<AccountType>[]>(
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
                header: 'Verified',
                accessorKey: 'verified',
                cell: ({ row }) => {
                    return <Badge className={cn(row.original.verified ? 'bg-lime-600' : 'bg-neutral-600')}>
                        {row.original.verified ? 'Yes' : 'No'}
                    </Badge>
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
                            <DeleteAccountModal id={row.original._id} />
                            <Button size={"icon"} type='button' variant={"ghost"} asChild>
                                <Link href={`/admin/accounts/${row.original._id}`}>
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
            <Datatable columns={columns} data={accounts?.results || []} loading={isLoading} />

            <div className="flex">
                <TablePagination {...accounts?.pagination as IPagination} />
            </div>
        </div>
    )
}

export default AccountsTable