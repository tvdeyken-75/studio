"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { kpiData, weeklyDeliveriesData } from "@/lib/data";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/types";
import { Icons } from "@/components/icons";

const KpiCard = ({ kpi }: { kpi: Kpi }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
       <div className="text-muted-foreground">
        {kpi.title === 'Gemeldete Probleme' ? <Icons.issue className="h-4 w-4" /> : <Icons.invoice className="h-4 w-4" />}
       </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{kpi.value}</div>
      {kpi.change && (
        <p className={cn("text-xs", kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600')}>
          {kpi.change} {kpi.description}
        </p>
      )}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const chartConfig = {
    onTime: { label: "Pünktlich", color: "hsl(var(--primary))" },
    delayed: { label: "Verspätet", color: "hsl(var(--destructive))" },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} />
        ))}
      </div>
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Lieferübersicht</CardTitle>
          <CardDescription>Pünktliche vs. verspätete Lieferungen der letzten 6 Monate.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyDeliveriesData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="onTime" fill="var(--color-onTime)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" fill="var(--color-delayed)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
