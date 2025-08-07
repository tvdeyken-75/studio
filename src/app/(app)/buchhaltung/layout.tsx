"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BuchhaltungLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("rechnungen")) return "rechnungen";
    if (pathname.includes("transaktionen")) return "transaktionen";
    if (pathname.includes("kostenstellen")) return "kostenstellen";
    if (pathname.includes("dokumente")) return "dokumente";
    if (pathname.includes("analyse")) return "analyse";
    return "rechnungen";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="rechnungen" asChild>
          <Link href="/buchhaltung">Rechnungen</Link>
        </TabsTrigger>
        <TabsTrigger value="transaktionen" asChild>
          <Link href="/buchhaltung/transaktionen">Einnahmen/Ausgaben</Link>
        </TabsTrigger>
        <TabsTrigger value="kostenstellen" asChild>
          <Link href="/buchhaltung/kostenstellen">Kostenstellen</Link>
        </TabsTrigger>
        <TabsTrigger value="dokumente" asChild>
          <Link href="/buchhaltung/dokumente">Dokumentenverwaltung</Link>
        </TabsTrigger>
        <TabsTrigger value="analyse" asChild>
          <Link href="/buchhaltung/analyse">Finanzanalyse</Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}
