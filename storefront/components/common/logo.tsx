import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
function Logo() {
    return (
        <Link href="/" className="flex items-center gap-x-1">
            <Image
                src="/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="w-10 h-10 object-fill"
            />

            <span className="hidden xl:inline-block text-md font-semibold">
                E-Shopping
            </span>
        </Link>
    )
}

export default Logo