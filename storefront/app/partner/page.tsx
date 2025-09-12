"use client"
import { useAuth } from '@/providers/auth-provider'
import React from 'react'

function page() {
    const { user } = useAuth();
    return (
        <div>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
        </div>
    )
}

export default page