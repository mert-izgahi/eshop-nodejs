"use client"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import * as React from "react"
const SidebarLink = ({ item }: { item: { label: string, link: string, icon: React.ReactNode, active: boolean } }) => {
    return <SidebarMenuItem>
        <SidebarMenuButton asChild className={cn('cursor-pointer rounded-sm h-10',
            {
                "bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white": item.active,
                "hover:bg-neutral-200 dark:hover:bg-neutral-800": !item.active
            }
        )}>
            <Link href={item.link} className="flex flex-row items-center gap-x-2">
                {item.icon}
                <span className="text-xs">{item.label}</span>
            </Link>
        </SidebarMenuButton>
    </SidebarMenuItem>
}

SidebarLink.displayName = "SidebarLink"

export default SidebarLink