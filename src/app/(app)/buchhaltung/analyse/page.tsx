"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { transactionData, tourData, customerData } from '@/lib/data';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, getMonth, getYear, parseISO, startOfQuarter, endOfQuarter, startOfMonth, endOfMonth } from 'date-fns';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
};

const KpiCard = ({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const periodOptions = [
    { value: 'year', label: 'Gesamtes Jahr' },
    { value: 's1', label: '1. Semester' },
    { value: 's2', label: '2. Semester' },
    { value: 'q1', label: '1. Quartal' },
    { value: 'q2', label: '2. Quartal' },
    { value: 'q3', label: '3. Quartal' },
    { value: 'q4', label: '4. Quartal' },
    ...Array.from({ length: 12 }, (_, i) => ({ value: `${i}`, label: format(new Date(0, i), 'MMMM') }))
];

export default function AnalysePage() {
    const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
    const [selectedPeriod, setSelectedPeriod] = useState('year');

    const yearsWithData = useMemo(() => {
        const years = new Set(transactionData.map(t => getYear(parseISO(t.datum))));
        return Array.from(years).sort((a, b) => b - a);
    }, []);

    const filteredData = useMemo(() => {
        return transactionData.filter(t => {
            const date = parseISO(t.datum);
            if (getYear(date) !== selectedYear) return false;

            switch(selectedPeriod) {
                case 'year': return true;
                case 's1': return getMonth(date) < 6;
                case 's2': return getMonth(date) >= 6;
                case 'q1': return getMonth(date) < 3;
                case 'q2': return getMonth(date) >= 3 && getMonth(date) < 6;
                case 'q3': return getMonth(date) >= 6 && getMonth(date) < 9;
                case 'q4': return getMonth(date) >= 9;
                default: // month
                    return getMonth(date) === parseInt(selectedPeriod);
            }
        });
    }, [selectedYear, selectedPeriod]);

    const periodLabel = useMemo(() => {
        const option = periodOptions.find(p => p.value === selectedPeriod);
        return `${option?.label} ${selectedYear}`;
    }, [selectedPeriod, selectedYear]);

    const monthlyIOData = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => ({
            name: format(new Date(selectedYear, i), 'MMM'),
            einnahmen: 0,
            ausgaben: 0,
        }));

        filteredData.forEach(t => {
            const month = getMonth(parseISO(t.datum));
            if (t.art === 'Einnahme') {
                months[month].einnahmen += t.betrag;
            } else {
                months[month].ausgaben += t.betrag;
            }
        });
        return months;
    }, [filteredData, selectedYear]);
    
    const revenueByCustomerData = useMemo(() => {
        const revenueMap = new Map<string, number>();
        const toursInPeriod = tourData.filter(tour => {
             const date = parseISO(tour.tourDate);
            if (getYear(date) !== selectedYear) return false;

            switch(selectedPeriod) {
                case 'year': return true;
                case 's1': return getMonth(date) < 6;
                case 's2': return getMonth(date) >= 6;
                case 'q1': return getMonth(date) < 3;
                case 'q2': return getMonth(date) >= 3 && getMonth(date) < 6;
                case 'q3': return getMonth(date) >= 6 && getMonth(date) < 9;
                case 'q4': return getMonth(date) >= 9;
                default: return getMonth(date) === parseInt(selectedPeriod);
            }
        });

        toursInPeriod.forEach(tour => {
            const revenue = tour.calculatedRevenue || tour.totalRevenue || 0;
            const customerName = customerData.find(c => c.id === tour.customerId)?.firmenname || 'Unbekannt';
            revenueMap.set(customerName, (revenueMap.get(customerName) || 0) + revenue);
        });
        return Array.from(revenueMap.entries()).map(([name, value]) => ({ name, value }));
    }, [selectedYear, selectedPeriod]);


    const expensesByCategoryData = useMemo(() => {
        const expenseMap = new Map<string, number>();
        filteredData
            .filter(t => t.art === 'Ausgabe')
            .forEach(t => {
                expenseMap.set(t.kategorie, (expenseMap.get(t.kategorie) || 0) + t.betrag);
            });
        return Array.from(expenseMap.entries()).map(([name, value]) => ({ name, value }));
    }, [filteredData]);
    
    const kpis = useMemo(() => {
        const totalEinnahmen = filteredData.filter(t => t.art === 'Einnahme').reduce((sum, t) => sum + t.betrag, 0);
        const totalAusgaben = filteredData.filter(t => t.art === 'Ausgabe').reduce((sum, t) => sum + t.betrag, 0);
        return {
            totalEinnahmen,
            totalAusgaben,
            profit: totalEinnahmen - totalAusgaben,
        };
    }, [filteredData]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Finanzanalyse</h1>
                    <p className="text-muted-foreground">Ein Überblick über Ihre finanzielle Performance.</p>
                </div>
                 <div className="flex items-center gap-2">
                     <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Zeitraum auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                            {periodOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Jahr" />
                        </SelectTrigger>
                        <SelectContent>
                            {yearsWithData.map(year => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
            </div>
             <div className="grid gap-4 md:grid-cols-3">
                <KpiCard title="Gesamteinnahmen" value={formatCurrency(kpis.totalEinnahmen)} icon={<ArrowUpRight />} description={periodLabel} />
                <KpiCard title="Gesamtausgaben" value={formatCurrency(kpis.totalAusgaben)} icon={<ArrowDownLeft />} description={periodLabel} />
                <KpiCard title="Profit" value={formatCurrency(kpis.profit)} icon={<Wallet />} description={periodLabel} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Einnahmen vs. Ausgaben</CardTitle>
                    <CardDescription>Monatlicher Vergleich für {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[350px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyIOData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value as number)} tick={{ fontSize: 12 }} />
                                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="einnahmen" name="Einnahmen" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="ausgaben" name="Ausgaben" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Umsatz nach Kunden</CardTitle>
                         <CardDescription>Umsatzverteilung für {periodLabel}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={revenueByCustomerData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                        {revenueByCustomerData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => `${name}: ${formatCurrency(value as number)}`} />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Ausgaben nach Kategorie</CardTitle>
                        <CardDescription>Kostenverteilung für {periodLabel}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={expensesByCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
                                        {expensesByCategoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                     <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => `${name}: ${formatCurrency(value as number)}`} />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
