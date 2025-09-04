import {
    Box,
    CameraIcon,
    FileCodeIcon,
    FileTextIcon,
    FolderGit2,
    FolderIcon,
    LayoutDashboardIcon,
    ListIcon,
    Notebook,
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
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutDashboardIcon,
        },
        {
            title: 'Product',
            url: '#',
            icon: Box,
        },
        {
            title: 'Leads',
            url: '#',
            icon: ListIcon,
        },
        {
            title: 'Projects',
            url: '#',
            icon: FolderIcon,
        },
        {
            title: 'Customer',
            url: '#',
            icon: UserCheck2,
        },
    ],
    navClouds: [
        {
            title: 'Capture',
            icon: CameraIcon,
            isActive: true,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Proposal',
            icon: FileTextIcon,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Prompts',
            icon: FileCodeIcon,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '/settings/profile',
            icon: SettingsIcon,
        },
        {
            title: 'Repository',
            url: 'https://github.com/Aryaaazrr/achmad-crm',
            icon: FolderGit2,
        },
    ],
    settingApplication: [
        {
            name: 'Users',
            url: '/users',
            icon: UsersIcon,
        },
        {
            name: 'Role',
            url: '#',
            icon: Notebook,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <a href="#">
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
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
