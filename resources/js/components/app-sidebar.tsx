import { usePage } from '@inertiajs/react';
import {
    Box,
    FileChartColumn,
    FolderGit2,
    FolderIcon,
    LayoutDashboardIcon,
    ListIcon,
    SettingsIcon,
    UserCheck2,
    UsersIcon,
} from 'lucide-react';
import * as React from 'react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import AppLogoIcon from './app-logo-icon';

const data = {
    navMain: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
        { title: 'Product', url: '/product', icon: Box },
        { title: 'Leads', url: '/leads', icon: ListIcon },
        { title: 'Projects', url: '/project', icon: FolderIcon },
        { title: 'Customer', url: '/customer', icon: UserCheck2 },
        { title: 'Report', url: '/report', icon: FileChartColumn },
    ],
    navSecondary: [
        { title: 'Repository', url: 'https://github.com/Aryaaazrr/achmad-crm', icon: FolderGit2 },
    ],
    settingApplication: [
        { name: 'Users', url: '/users', icon: UsersIcon },
        { name: 'Setting', url: '/settings/profile', icon: SettingsIcon },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { props: inertiaProps } = usePage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (inertiaProps as any).auth?.user;

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <a href="/dashboard">
                                <AppLogoIcon />
                                <span className="text-base font-semibold">SmartISP</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.settingApplication} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    );
}
