
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("transports")) return "transports";
    // Add other reports here in the future
    return "transports";
  };
  
  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="transports" asChild>
          <Link href="/reports">Transporte</Link>
        </TabsTrigger>
        {/* Add other report tabs here */}
      </TabsList>
      <div className="mt-4">{children}</div>
    </Tabs>
  );
}

    