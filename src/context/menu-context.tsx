"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Icons, Icon } from '@/components/icons';

interface MenuItem {
    id: string;
    label: string;
    icon: Icon;
    href: string;
}

interface MenuContextType {
    menuItems: MenuItem[];
    setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const initialNavItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Icons.dashboard, href: '/' },
  { id: 'auftraege', label: 'Aufträge', icon: Icons.orders, href: '/auftraege' },
  { id: 'reports', label: 'Transportoverview', icon: Icons.reports, href: '/reports' },
  { id: 'fleet', label: 'Fuhrpark', icon: Icons.fleet, href: '/fleet' },
  { id: 'customers', label: 'Beziehungsmanagement', icon: Icons.customers, href: '/customers' },
  { id: 'buchhaltung', label: 'Buchhaltung', icon: Icons.accounting, href: '/buchhaltung' },
  { id: 'master-data', label: 'Stammdaten', icon: Icons.database, href: '/master-data/addresses' },
  { id: 'adminpanel', label: 'Adminpanel', icon: Icons.admin, href: '/adminpanel' },
  { id: 'settings', label: 'Einstellungen', icon: Icons.settings, href: '/settings' },
];

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialNavItems);
    // In a real app, you would initialize state from localStorage or an API here.
    
    return (
        <MenuContext.Provider value={{ menuItems, setMenuItems }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = (): MenuContextType => {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};
