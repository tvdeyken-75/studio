
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { kpiData, weeklyDeliveriesData, tourData, fleetData } from "@/lib/data";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import type { Kpi, Tour } from "@/types";
import { Icons } from "@/components/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const KpiCard = ({ kpi }: { kpi: Kpi }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
       <div className="text-muted-foreground">
        {kpi.title === 'Gemeldete Probleme' ? <Icons.issue className="h-4 w-4" /> : <Icons.invoice className="h-4 w-4" />}
       </div>
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{kpi.value}</div>
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
  
  const activeTours = tourData.filter(tour => ['Unterwegs', 'Geplant', 'Zugewiesen'].includes(tour.status)).slice(0, 5);
  
  const statusVariant: Record<Tour['status'], "default" | "destructive" | "secondary" | "outline"> = {
    'Entwurf': 'secondary',
    'Geplant': 'default',
    'Zugewiesen': 'default',
    'Unterwegs': 'default',
    'Abgeschlossen': 'outline',
    'Geschlossen': 'outline',
    'Storniert': 'destructive',
  };

  const statusColor: Record<Tour['status'], string> = {
      'Entwurf': 'bg-gray-400',
      'Geplant': 'bg-blue-500',
      'Zugewiesen': 'bg-yellow-500',
      'Unterwegs': 'bg-purple-500',
      'Abgeschlossen': 'bg-green-600',
      'Geschlossen': 'bg-gray-700',
      'Storniert': 'bg-red-600',
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                  <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12}} />
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
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Aktive Touren</CardTitle>
                        <CardDescription>Übersicht der laufenden und geplanten Touren.</CardDescription>
                    </div>
                     <Button asChild variant="link" size="sm">
                        <Link href="/reports">Alle anzeigen <ArrowRight className="h-4 w-4 ml-1" /></Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tour</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Fahrzeug</TableHead>
                            <TableHead>Route</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeTours.length > 0 ? activeTours.map((tour) => {
                            const vehicle = fleetData.find(v => v.id === tour.vehicleId);
                            const route = tour.stops.length > 0
                                ? `${tour.stops[0].addressName} → ${tour.stops[tour.stops.length - 1].addressName}`
                                : 'N/A';

                            return (
                                <TableRow key={tour.id}>
                                    <TableCell>
                                        <div className="font-medium">{tour.tourNumber}</div>
                                        <div className="text-xs text-muted-foreground">{tour.customerReference || 'Keine Referenz'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[tour.status]} className={cn('text-white', statusColor[tour.status])}>
                                            {tour.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{vehicle?.kennzeichen || 'N/A'}</TableCell>
                                    <TableCell className="text-xs max-w-[150px] truncate">{route}</TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">Keine aktiven Touren.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
