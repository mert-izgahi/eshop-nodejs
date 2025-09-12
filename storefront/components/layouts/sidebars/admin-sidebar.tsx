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
import { DashboardIcon, CategoryIcon, OrdersIcon, CouponIcon, PatnerIcon, PermissionsIcon, StaffIcon, ProductsIcon, SettingsIcon, UsersIcon, BankIcon, StoreIcon, WalletIcon, WithdrawIcon, EarningsIcon, FAQIcon, SupportCenterIcon } from '@/lib/icons';
import { usePathname } from 'next/navigation';
import SidebarLink from './sidebar-link';



function AdminSidebar() {
    const { user } = useAuth();
    const isAdmin = useMemo(() => {
        return user?.role === "admin";
    }, [user?.role]);
    const pathname = usePathname();
    const adminMainLinks = [
        { label: "Dashboard", link: "/admin", icon: <DashboardIcon />, active: pathname === '/admin' },
        { label: "Settings", link: "/admin/settings", icon: <SettingsIcon />, active: pathname === '/admin/settings' || pathname?.startsWith('/admin/settings/') },
    ];
    const adminContentLinks = [
        { label: "Categories", link: "/admin/categories", icon: <CategoryIcon />, active: pathname === '/admin/categories' || pathname?.startsWith('/admin/categories/') },
        { label: "Payment Methods", link: "/admin/payment-methods", icon: <BankIcon />, active: pathname === '/admin/payment-methods' || pathname?.startsWith('/admin/payment-methods/') },
    ];
    const adminStoresLinks = [
        { label: "Stores", link: "/admin/stores", icon: <StoreIcon />, active: pathname === '/admin/stores' || pathname?.startsWith('/admin/stores/') },
        { label: "Products", link: "/admin/products", icon: <ProductsIcon />, active: pathname === '/admin/products' || pathname?.startsWith('/admin/products/') },
        { label: "Orders", link: "/admin/orders", icon: <OrdersIcon />, active: pathname === '/admin/orders' || pathname?.startsWith('/admin/orders/') },
        { label: "Coupons", link: "/admin/coupons", icon: <CouponIcon />, active: pathname === '/admin/coupons' || pathname?.startsWith('/admin/coupons/') },
    ];

    const adminUsersLinks = [
        { label: "Accounts", link: "/admin/accounts", icon: <UsersIcon />, active: pathname === '/admin/accounts' || pathname?.startsWith('/admin/accounts/') },
        { label: "Partners", link: "/admin/partners", icon: <PatnerIcon />, active: pathname === '/admin/partners' || pathname?.startsWith('/admin/partners/') },
        { label: "Staff", link: "/admin/staffs", icon: <StaffIcon />, active: pathname === '/admin/staffs' || pathname?.startsWith('/admin/staffs/') },
        { label: "Permissions", link: "/admin/permissions", icon: <PermissionsIcon />, active: pathname === '/admin/permissions' || pathname?.startsWith('/admin/permissions/') },
    ];
    const adminFinanceLinks = [
        { label: "Wallet", link: "/admin/wallet", icon: <WalletIcon />, active: pathname === '/admin/wallet' || pathname?.startsWith('/admin/wallet/') },
        { label: "Earnings", link: "/admin/earnings", icon: <EarningsIcon />, active: pathname === '/admin/earnings' || pathname?.startsWith('/admin/earnings/') },
        { label: "Withdraw Requests", link: "/admin/withdraw-requests", icon: <WithdrawIcon />, active: pathname === '/admin/withdraw-requests' || pathname?.startsWith('/admin/withdraw-requests/') },
    ];

    const adminSupportLinks = [
        { label: "FAQ", link: "/admin/faq", icon: <FAQIcon />, active: pathname === '/admin/faq' || pathname?.startsWith('/admin/faq/') },
        { label: "Support Center", link: "/admin/support-center", icon: <SupportCenterIcon />, active: pathname === '/admin/support-center' || pathname?.startsWith('/admin/support-center/') },
    ];
    if (!isAdmin) return null;
    return (
        <Sidebar className='border-none'>
            <SidebarHeader className='bg-neutral-50 dark:bg-neutral-900 h-16 flex flex-row items-center px-4'>
                <Logo />
            </SidebarHeader>
            <SidebarContent className='bg-neutral-50 dark:bg-neutral-900'>
                {/* MAIN GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                adminMainLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                {/* Content GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Content Managment</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                adminContentLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                {/* Users GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Users Managment</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                adminUsersLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                {/* Stores GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Patners Managment</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                adminStoresLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                {/* Finance GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Finance</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                adminFinanceLinks.map((item) => (
                                    <SidebarLink key={item.label} item={item} />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                {/* Support GROUP */}
                <SidebarGroup>
                    <SidebarGroupLabel>Support Center</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                adminSupportLinks.map((item) => (
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

export default AdminSidebar