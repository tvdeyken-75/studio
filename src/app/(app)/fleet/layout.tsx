"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("trailers")) return "trailers";
    return "vehicles";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="vehicles" asChild>
          <Link href="/fleet">Fahrzeuge</Link>
        </TabsTrigger>
        <TabsTrigger value="trailers" asChild>
          <Link href="/fleet/trailers">Anhänger</Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}
