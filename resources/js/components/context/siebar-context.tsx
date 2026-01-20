import { dashboard } from '@/routes';
import { ModalType, SidebarNavItems } from '@/types';
import { LayoutGrid, Bell, User, CalendarDays, MapPin, Truck, Route, Mail, Folder, BookOpen } from 'lucide-react';
import React, { createContext, useState, useContext, SetStateAction } from 'react';
import { NavItem } from '../../types/index';


interface SidebarContextProps {
    getNavItems: (role: string) => SidebarNavItems;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    

    const getNavItems = (role: string): SidebarNavItems => {
        const filterByRole = (items: NavItem[]) =>
            items.filter(item => item.roles.includes("all") || item.roles.includes(role));

        return {
            generalNavItems: filterByRole(navItems.generalNavItems),
            modulesNavItems: filterByRole(navItems.modulesNavItems),
            footerNavItems: filterByRole(navItems.footerNavItems),
        };
    };



    return (
        <SidebarContext.Provider value={{ getNavItems: getNavItems }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error('useModal must be within Modal Provider');
    return context;
}