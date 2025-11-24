"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("lohnabrechnung")) return "lohnabrechnung";
    return "mitarbeiter";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="mitarbeiter" asChild>
          <Link href="/hr/mitarbeiter">Mitarbeiter</Link>
        </TabsTrigger>
        <TabsTrigger value="lohnabrechnung" asChild>
          <Link href="/hr/lohnabrechnung">Lohnabrechnung</Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}
