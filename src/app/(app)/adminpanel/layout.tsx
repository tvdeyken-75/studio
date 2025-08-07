"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminpanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("templates")) return "templates";
    if (pathname.includes("workflows")) return "workflows";
    return "templates";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="templates" asChild>
          <Link href="/adminpanel">Report Template Builder</Link>
        </TabsTrigger>
        <TabsTrigger value="workflows" asChild>
          <Link href="/adminpanel/workflows">Workflows</Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}
