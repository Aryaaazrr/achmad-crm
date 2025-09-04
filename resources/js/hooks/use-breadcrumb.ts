import { useMemo } from 'react';

interface BreadcrumbItem {
    title: string;
    href?: string;
}

interface UseBreadcrumbProps {
    currentPage: string;
    customBreadcrumb?: BreadcrumbItem[];
}

export function useBreadcrumb({ currentPage, customBreadcrumb }: UseBreadcrumbProps) {
    return useMemo(() => {
        if (customBreadcrumb) {
            return customBreadcrumb;
        }

        const breadcrumbMap: { [key: string]: BreadcrumbItem[] } = {
            'dashboard': [
                { title: 'Dashboard' }
            ],
            'leads': [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Leads' }
            ],
            'leads/create': [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Leads', href: '/leads' },
                { title: 'Create Lead' }
            ],
            'customers': [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Customers' }
            ],
            'customers/create': [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Customers', href: '/customers' },
                { title: 'Create Customer' }
            ],
            'products': [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Products' }
            ],
            'sales': [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Sales' }
            ],
            'analytics': [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Analytics' }
            ],
            'settings': [
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Settings' }
            ]
        };

        return breadcrumbMap[currentPage] || [{ title: 'Page' }];
    }, [currentPage, customBreadcrumb]);
}
