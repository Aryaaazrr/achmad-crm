import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { usePage } from '@inertiajs/react';

interface SiteHeaderProps {
    currentPage?: string;
}

interface BreadcrumbConfig {
    [key: string]: {
        title: string;
        parent?: {
            title: string;
            href: string;
        };
    };
}

const breadcrumbConfig: BreadcrumbConfig = {
    '/dashboard': {
        title: 'SmartISP',
        parent: {
            title: 'Dashboard',
            href: '/dashboard'
        }
    },
    '/leads': {
        title: 'Leads',
        parent: {
            title: 'Dashboard',
            href: '/dashboard'
        }
    },
    '/customers': {
        title: 'Customers',
        parent: {
            title: 'Dashboard',
            href: '/dashboard'
        }
    },
    '/products': {
        title: 'Products',
        parent: {
            title: 'Dashboard',
            href: '/dashboard'
        }
    },
    '/sales': {
        title: 'Sales',
        parent: {
            title: 'Dashboard',
            href: '/dashboard'
        }
    },
    '/users': {
        title: 'Users',
        parent: {
            title: 'Dashboard',
            href: '/dashboard'
        }
    },
    '/users/create': {
        title: 'Create Users',
        parent: {
            title: 'User',
            href: '/users'
        }
    },
    '/settings': {
        title: 'Settings',
        parent: {
            title: 'Dashboard',
            href: '/dashboard'
        }
    }
};

export function SiteHeader({ currentPage }: SiteHeaderProps = {}) {
    const { url } = usePage();
    const currentPath = currentPage || url;
    const pageConfig = breadcrumbConfig[currentPath];

    return (
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background border-b z-50">
            <div className="flex flex-1 items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {pageConfig?.parent && (
                            <>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href={pageConfig.parent.href}>
                                        {pageConfig.parent.title}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                            </>
                        )}
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {pageConfig?.title || 'Page'}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
