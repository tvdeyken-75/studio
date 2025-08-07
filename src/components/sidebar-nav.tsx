"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { Separator } from './ui/separator';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Icons.dashboard },
  { href: '/route-planning', label: 'Routenplanung', icon: Icons.route },
  { href: '/address-insights', label: 'Standort-Analyse', icon: Icons.address },
  { href: '/fleet', label: 'Fahrzeugflotte', icon: Icons.fleet },
  { href: '/customers', label: 'Kunden & Auftragnehmer', icon: Icons.customers },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="flex items-center gap-2.5 p-4">
        <Icons.logo className="h-7 w-7 text-primary" />
        <span className="text-lg font-semibold text-foreground">AmbientTMS</span>
      </SidebarHeader>
      <Separator />
      <SidebarMenu className="flex-1 p-4">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <Separator />
       <SidebarFooter className="p-4">
            <div className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} AmbientTMS Inc.
            </div>
       </SidebarFooter>
    </>
  );
}
