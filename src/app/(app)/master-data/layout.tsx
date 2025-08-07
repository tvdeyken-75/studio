"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MasterDataLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("addresses")) return "addresses";
    if (pathname.includes("countries")) return "countries";
    return "addresses";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="addresses" asChild>
          <Link href="/master-data/addresses">Adressen</Link>
        </TabsTrigger>
        <TabsTrigger value="countries" asChild>
          <Link href="/master-data/countries">Länder</Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}
