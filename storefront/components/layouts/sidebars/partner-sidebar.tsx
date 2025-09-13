import React, { useMemo } from 'react'
import Link from 'next/link';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import Logo from '@/components/common/logo'
import UserButton from '@/components/common/user-button'
import { useAuth } from '@/providers/auth-provider';
import { DashboardIcon, OrdersIcon, CouponIcon, RefundIcon, ReviewIcon, ChatIcon, SupportCenterIcon, WarehouseIcon, NotificationIcon, RefundRequestIcon, ProductsIcon, SettingsIcon, UsersIcon, StoreIcon, WalletIcon, WithdrawIcon, EarningsIcon, AnalyticsIcon } from '@/lib/icons';
import { usePathname } from 'next/navigation';
import SidebarLink from './sidebar-link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';


interface Props {
    currentStoreId: string
}
function PartnerSidebar({ currentStoreId }: Props) {

    const { user } = useAuth();
    const isPartner = useMemo(() => {
        return user?.role === "partner";
    }, [user?.role]);
    const pathname = usePathname();
    const partnerMainLinks = [
        { label: "Dashboard", link: "/partner", icon: <DashboardIcon />, active: pathname === '/partner' },
        { label: "Stores", link: "/partner/stores", icon: <StoreIcon />, active: pathname === '/admin/stores' || pathname?.startsWith('/admin/stores/') },
    ];

    const storeQuery = useQuery({
        queryKey: ['store', currentStoreId],
        queryFn: async () => {
            const res = await api.get(`/api/v1/partner/stores/${currentStoreId}`);
            const { data } = await res.data;
            console.log(data);

            return data;
        },
    })

    const partnerStoreLinks = [
        { label: "Analytics", link: `/partner/stores/${currentStoreId}`, icon: <AnalyticsIcon />, active: pathname === `/partner/stores/${currentStoreId}` },
        { label: "Products", link: "/partner/products", icon: <ProductsIcon />, active: pathname === '/admin/products' || pathname?.startsWith('/admin/products/') },
        { label: "Orders", link: `/partner/stores/${currentStoreId}/orders`, icon: <OrdersIcon />, active: pathname === `/partner/stores/${currentStoreId}/orders` || pathname?.startsWith(`/partner/stores/${currentStoreId}/orders`) },
        { label: "Coupons", link: `/partner/stores/${currentStoreId}/coupons`, icon: <CouponIcon />, active: pathname === `/partner/stores/${currentStoreId}/coupons` || pathname?.startsWith(`/partner/stores/${currentStoreId}/coupons`) },
        { label: "Customers", link: `/partner/stores/${currentStoreId}/customers`, icon: <UsersIcon />, active: pathname === `/partner/stores/${currentStoreId}/customers` || pathname?.startsWith(`/partner/stores/${currentStoreId}/customers`) },
        { label: "Reviews", link: `/partner/stores/${currentStoreId}/reviews`, icon: <ReviewIcon />, active: pathname === `/partner/stores/${currentStoreId}/reviews` || pathname?.startsWith(`/partner/stores/${currentStoreId}/reviews`) },
        { label: "Refunds", link: `/partner/stores/${currentStoreId}/refunds`, icon: <RefundIcon />, active: pathname === `/partner/stores/${currentStoreId}/refunds` || pathname?.startsWith(`/partner/stores/${currentStoreId}/refunds`) },
        { label: "Refunds Requests", link: `/partner/stores/${currentStoreId}/refund-requests`, icon: <RefundRequestIcon />, active: pathname === `/partner/stores/${currentStoreId}/refund-requests` || pathname?.startsWith(`/partner/stores/${currentStoreId}/refund-requests`) },
        { label: "Warehouse", link: `/partner/stores/${currentStoreId}/warehouse`, icon: <WarehouseIcon />, active: pathname === `/partner/stores/${currentStoreId}/warehouse` || pathname?.startsWith(`/partner/stores/${currentStoreId}/warehouse`) },
        { label: "Store Settings", link: `/partner/stores/${currentStoreId}/settings`, icon: <SettingsIcon />, active: pathname === `/partner/stores/${currentStoreId}/settings` || pathname?.startsWith(`/partner/stores/${currentStoreId}/settings`) },
    ];

    const partnerFinanceLinks = [
        { label: "Wallet", link: "/partner/wallet", icon: <WalletIcon />, active: pathname === '/partner/wallet' || pathname?.startsWith('/partner/wallet/') },
        { label: "Earnings", link: "/partner/earnings", icon: <EarningsIcon />, active: pathname === '/partner/earnings' || pathname?.startsWith('/partner/earnings/') },
        { label: "Earnings History", link: "/partner/earnings", icon: <EarningsIcon />, active: pathname === '/partner/earnings' || pathname?.startsWith('/partner/earnings/') },
        { label: "Withdraw Requests", link: "/partner/withdraw-requests", icon: <WithdrawIcon />, active: pathname === '/partner/withdraw-requests' || pathname?.startsWith('/partner/withdraw-requests/') },
    ];
    const partnerSupportLinks = [
        { label: "Chat", link: "/partner/chat", icon: <ChatIcon />, active: pathname === '/partner/chat' || pathname?.startsWith('/partner/chat') },
        { label: "Notifications", link: "/partner/notifications", icon: <NotificationIcon />, active: pathname === '/partner/notifications' || pathname?.startsWith('/partner/notifications') },
        { label: "Support Center", link: "/partner/support-center", icon: <SupportCenterIcon />, active: pathname === '/partner/support-center' || pathname?.startsWith('/partner/support-center/') },
    ];

    if (!isPartner) return null;
    if (!currentStoreId) return null;

    return (
        <Sidebar className='border-none'>
            <SidebarHeader className='bg-neutral-50 dark:bg-neutral-900 h-16 flex flex-row items-center px-4'>
                <Logo />

            </SidebarHeader>
            <SidebarContent className='bg-neutral-50 dark:bg-neutral-900'>
                {/* MAIN GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Partner Panel</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                partnerMainLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />

                {/* STORE GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>{storeQuery.data?.name}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                partnerStoreLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />

                {/* FINANCE GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Finance</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                partnerFinanceLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />

                {/* SUPPORT GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                partnerSupportLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />

            </SidebarContent>
            <SidebarFooter className='bg-neutral-50 dark:bg-neutral-900 h-16 flex flex-row items-center px-4'>
                <UserButton />
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                    <span className="text-xs">{user?.email}</span>
                </div>
            </SidebarFooter>
        </Sidebar >
    )
}

export default PartnerSidebar