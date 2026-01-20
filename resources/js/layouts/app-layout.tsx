import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, SidebarNavItems, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {

    const { getNavItems } = useSidebar();


    return (
            <AppLayoutTemplate breadcrumbs={breadcrumbs} navItems={getNavItems()} {...props}>
                {children}
            </AppLayoutTemplate>
    )

};
