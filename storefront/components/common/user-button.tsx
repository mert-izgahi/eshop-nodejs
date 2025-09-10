import React from 'react'
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/providers/auth-provider';
function UserButton() {
    const { isAuthenticated, user, signOut } = useAuth();
    if (!isAuthenticated) {
        return null;
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="w-10 h-10 bg-neutral-100 p-2 cursor-pointer">
                    <AvatarImage src={user?.profilePicture || '/user-placeholder.svg'} alt="User Avatar" className='w-full h-full object-cover' />
                    <AvatarFallback>{user?.firstName ? user.firstName.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='w-48'>
                <DropdownMenuLabel>Welcome {user?.firstName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className='cursor-pointer'>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className='cursor-pointer'>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' onSelect={() => {
                    signOut();
                }}>
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton