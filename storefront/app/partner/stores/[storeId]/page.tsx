import React from 'react'
interface Props {
    params: Promise<{ storeId: string }>
}
async function page({ params }: Props) {
    const { storeId } = await params
    return (
        <div>page -  {storeId}</div>
    )
}

export default page