import React from 'react'
import CustomerDetailsPage from './client'

interface props {
    params: Promise<{
        userId: string
    }>
}
async function page({ params }: props) {
    const { userId } = await params
    return (
        <CustomerDetailsPage userId={userId} />
    )
}

export default page