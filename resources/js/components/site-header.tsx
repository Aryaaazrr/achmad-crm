import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

interface SiteHeaderProps {
    currentPage?: string;
}

const titleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    products: 'Products',
    leads: 'Leads',
    customers: 'Customers',
    users: 'Users',
    settings: 'Settings',
};

export function SiteHeader({ currentPage }: SiteHeaderProps = {}) {
    const { url } = usePage();
    const currentPath = currentPage || url;

    const segments = currentPath.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const title = titleMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return {
            title,
            href,
            isLast,
        };
    });

    return (
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((bc, idx) => (
                            <React.Fragment key={idx}>
                                <BreadcrumbItem className="hidden md:block">
                                    {bc.isLast ? (
                                        <BreadcrumbPage>{bc.title}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={bc.href}>{bc.title}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!bc.isLast && <BreadcrumbSeparator className="hidden md:block" />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
