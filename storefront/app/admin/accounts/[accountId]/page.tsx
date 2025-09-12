import React from 'react'
import AccountDetailsPage from './client'

interface props {
    params: Promise<{
        accountId: string
    }>
}
async function page({ params }: props) {
    const { accountId } = await params
    return (
        <AccountDetailsPage id={accountId} />
    )
}

export default page