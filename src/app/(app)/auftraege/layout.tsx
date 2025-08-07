"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuftraegeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("berichte")) return "berichte";
    if (pathname.includes("vorbereiten")) return "vorbereiten";
    if (pathname.includes("templates")) return "templates";
    return "berichte";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="berichte" asChild>
          <Link href="/auftraege">Kundenberichte</Link>
        </TabsTrigger>
        <TabsTrigger value="vorbereiten" asChild>
          <Link href="/auftraege/vorbereiten">Transportauftrag vorbereiten</Link>
        </TabsTrigger>
        <TabsTrigger value="templates" asChild>
          <Link href="/auftraege/templates">Trip Templates</Link>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}
