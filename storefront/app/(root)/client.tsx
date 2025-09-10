"use client"

import { useAuth } from '@/providers/auth-provider'
import React from 'react'

function HomePage() {
    const { isCheckingAuth, isAuthenticated, user } = useAuth();
    return (
        <>
            <pre>
                {JSON.stringify({ isCheckingAuth, isAuthenticated, user }, null, 2)}
            </pre>
        </>
    )
}

export default HomePage