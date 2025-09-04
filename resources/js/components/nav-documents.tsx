import { type LucideIcon } from 'lucide-react';

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';

export function NavDocuments({
    items,
}: {
    items: {
        name: string;
        url: string;
        icon: LucideIcon;
    }[];
}) {

    const page = usePage();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Setting Application</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton tooltip={item.name} asChild isActive={page.url.startsWith(typeof item.url === 'string' ? item.url : item.url)}>
                                <Link href={item.url} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
