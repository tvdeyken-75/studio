"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("/suppliers")) return "suppliers";
    if (pathname.includes("/subcontractors")) return "subcontractors";
    return "customers";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="customers" asChild>
          <Link href="/customers">Kundenstamm</Link>
        </TabsTrigger>
        <TabsTrigger value="suppliers" asChild>
          <Link href="/customers/suppliers">Lieferanten</Link>
        </TabsTrigger>
        <TabsTrigger value="subcontractors" asChild>
          <Link href="/customers/subcontractors">Subunternehmer</Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}
