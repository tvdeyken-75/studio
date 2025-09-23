"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("touren")) return "touren";
    return "menu";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="menu" asChild>
          <Link href="/settings/menu">Menü</Link>
        </TabsTrigger>
        <TabsTrigger value="touren" asChild>
          <Link href="/settings/touren">Touren</Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}
