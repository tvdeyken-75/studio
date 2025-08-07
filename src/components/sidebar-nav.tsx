"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMenu } from '@/context/menu-context';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { Separator } from './ui/separator';

export function SidebarNav() {
  const pathname = usePathname();
  const { menuItems } = useMenu();

  const isFleetActive = pathname.startsWith('/fleet');
  const isMasterDataActive = pathname.startsWith('/master-data');
  const isCustomersActive = pathname.startsWith('/customers');
  const isAuftraegeActive = pathname.startsWith('/auftraege');
  const isBuchhaltungActive = pathname.startsWith('/buchhaltung');
  const isAdminpanelActive = pathname.startsWith('/adminpanel');

  return (
    <>
      <SidebarHeader className="flex items-center gap-2.5 p-4">
        <Icons.logo className="h-7 w-7 text-sidebar-primary" />
        <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">AmbientTMS</span>
      </SidebarHeader>
      <Separator />
      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item) => {
            let isActive = false;
            if (item.href === '/') {
                isActive = pathname === '/';
            } else if (item.href.startsWith('/fleet')) {
                isActive = isFleetActive;
            } else if (item.href.startsWith('/master-data')) {
                isActive = isMasterDataActive;
            } else if (item.href.startsWith('/customers')) {
                isActive = isCustomersActive;
            } else if (item.href.startsWith('/auftraege')) {
                isActive = isAuftraegeActive;
            } else if (item.href.startsWith('/buchhaltung')) {
                isActive = isBuchhaltungActive;
            } else if (item.href.startsWith('/adminpanel')) {
                isActive = isAdminpanelActive;
            }
            else {
                isActive = pathname.startsWith(item.href);
            }
           
           return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           )
        })}
      </SidebarMenu>
      <Separator />
       <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
            <div className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} AmbientTMS Inc.
            </div>
       </SidebarFooter>
    </>
  );
}
