import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import product from '@/routes/product';
import users from '@/routes/users';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Box, Folder, LayoutDashboardIcon, User2Icon } from 'lucide-react';
import AppLogo from './app-logo';
import { NavSetting } from './nav-setting';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboardIcon,
    },
];

const managerOnlyNavItems: NavItem[] = [
    {
        title: 'Product',
        href: product.index(),
        icon: Box,
    },
];

const settingNavItems: NavItem[] = [
    {
        title: 'Users',
        href: users.index(),
        icon: User2Icon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/Aryaaazrr/achmad-crm',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://github.com/Aryaaazrr/achmad-crm',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (props as any).auth?.user;
    const roles = user?.roles;

    const navMain = roles[0].name === 'manager' ? [...mainNavItems, ...managerOnlyNavItems] : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navMain} />
                {roles[0].name === 'manager' && <NavSetting items={settingNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
