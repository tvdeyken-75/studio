
"use client";

import { useState, useMemo } from 'react';
import type { Transport } from '@/types';
import { transportData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { SlidersHorizontal, FileDown } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isWithinInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


const KpiCard = ({ title, value, icon, change, changeType, description }: { title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'positive' | 'negative', description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
                <p className={cn("text-xs text-muted-foreground", changeType === 'positive' ? 'text-green-600' : 'text-red-600')}>
                    {change} {description}
                </p>
            )}
        </CardContent>
    </Card>
);


export default function TransportReportPage() {
    const [transports, setTransports] = useState<Transport[]>(transportData);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const [columnVisibility, setColumnVisibility] = useState({
        transportNumber: true,
        customer: true,
        pickupLocation: true,
        deliveryLocation: true,
        driver: true,
        vehicleId: true,
        plannedDeliveryDate: false,
        actualDeliveryDate: true,
        onTime: true,
    });
    
    type ColumnKeys = keyof typeof columnVisibility;
    
    const columnLabels: Record<ColumnKeys, string> = {
        transportNumber: 'Transport-Nr.',
        customer: 'Kunde',
        pickupLocation: 'Abholort',
        deliveryLocation: 'Lieferort',
        driver: 'Fahrer',
        vehicleId: 'Fahrzeug',
        plannedDeliveryDate: 'Geplante Lieferung',
        actualDeliveryDate: 'Tatsächliche Lieferung',
        onTime: 'Pünktlichkeit',
    };

    const toggleColumn = (column: ColumnKeys) => {
        setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
    }

    const filteredTransports = useMemo(() => {
        let filtered = transports;

        if (dateRange?.from && dateRange?.to) {
            filtered = filtered.filter(t => {
                const deliveryDate = new Date(t.actualDeliveryDate);
                return isWithinInterval(deliveryDate, { start: dateRange.from!, end: dateRange.to! });
            });
        }
        
        if (!searchTerm) return filtered;

        const lowercasedTerm = searchTerm.toLowerCase();
        return filtered.filter(transport =>
            Object.values(transport).some(value =>
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [transports, searchTerm, dateRange]);
    
    const kpis = useMemo(() => {
        const totalTransports = filteredTransports.length;
        const onTimeDeliveries = filteredTransports.filter(t => new Date(t.actualDeliveryDate) <= new Date(t.plannedDeliveryDate)).length;
        const onTimeRate = totalTransports > 0 ? (onTimeDeliveries / totalTransports * 100).toFixed(1) : '0.0';
        
        const totalDrivers = new Set(filteredTransports.map(t => t.driver)).size;
        const totalVehicles = new Set(filteredTransports.map(t => t.vehicleId)).size;
        
        return { totalTransports, onTimeRate, totalDrivers, totalVehicles };
    }, [filteredTransports]);
    
    const formatDate = (date: string, formatString: string = 'dd.MM.yyyy HH:mm') => {
        try {
            return format(new Date(date), formatString, { locale: de });
        } catch (e) {
            return 'Ungültiges Datum';
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Gesamtzahl Transporte" value={kpis.totalTransports.toString()} icon={<Icons.route className="h-5 w-5" />} description="im ausgewählten Zeitraum" />
                <KpiCard title="Pünktlichkeitsrate" value={`${kpis.onTimeRate}%`} icon={<Icons.issue className="h-5 w-5" />} description="der Lieferungen waren pünktlich" />
                <KpiCard title="Eingesetzte Fahrer" value={kpis.totalDrivers.toString()} icon={<Icons.customers className="h-5 w-5" />} description="waren im Einsatz" />
                <KpiCard title="Eingesetzte Fahrzeuge" value={kpis.totalVehicles.toString()} icon={<Icons.fleet className="h-5 w-5" />} description="wurden genutzt" />
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center gap-4">
                        <Input
                            placeholder="Bericht durchsuchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm h-9"
                        />
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal h-9",
                                            !dateRange && "text-muted-foreground"
                                        )}
                                    >
                                        <Icons.calendar className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "dd.MM.yyyy")} -{" "}
                                                    {format(dateRange.to, "dd.MM.yyyy")}
                                                </>
                                            ) : (
                                                format(dateRange.from, "dd.MM.yyyy")
                                            )
                                        ) : (
                                            <span>Datumsbereich auswählen</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                        locale={de}
                                    />
                                </PopoverContent>
                            </Popover>
                            <Button variant="link" size="sm" className="h-9">
                                <FileDown className="mr-2 h-4 w-4" />
                                Exportieren
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <SlidersHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Spalten ein-/ausblenden</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {Object.keys(columnVisibility).map(key => (
                                        <DropdownMenuCheckboxItem
                                            key={key}
                                            className="capitalize"
                                            checked={columnVisibility[key as ColumnKeys]}
                                            onCheckedChange={() => toggleColumn(key as ColumnKeys)}
                                        >
                                            {columnLabels[key as ColumnKeys]}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Object.entries(columnVisibility).map(([key, visible]) => 
                                    visible && <TableHead key={key}>{columnLabels[key as ColumnKeys]}</TableHead>
                                )}
                                <TableHead className="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransports.length > 0 ? (
                                filteredTransports.map((transport) => {
                                    const isOnTime = new Date(transport.actualDeliveryDate) <= new Date(transport.plannedDeliveryDate);
                                    return (
                                        <TableRow key={transport.id}>
                                            {columnVisibility.transportNumber && <TableCell className="font-medium">{transport.transportNumber}</TableCell>}
                                            {columnVisibility.customer && <TableCell>{transport.customer}</TableCell>}
                                            {columnVisibility.pickupLocation && <TableCell>{transport.pickupLocation}</TableCell>}
                                            {columnVisibility.deliveryLocation && <TableCell>{transport.deliveryLocation}</TableCell>}
                                            {columnVisibility.driver && <TableCell>{transport.driver}</TableCell>}
                                            {columnVisibility.vehicleId && <TableCell>{transport.vehicleId}</TableCell>}
                                            {columnVisibility.plannedDeliveryDate && <TableCell>{formatDate(transport.plannedDeliveryDate)}</TableCell>}
                                            {columnVisibility.actualDeliveryDate && <TableCell>{formatDate(transport.actualDeliveryDate)}</TableCell>}
                                            {columnVisibility.onTime && <TableCell>
                                                <Badge variant={isOnTime ? "default" : "destructive"} className={cn("text-white", isOnTime && "bg-green-600")}>
                                                    {isOnTime ? 'Pünktlich' : 'Verspätet'}
                                                </Badge>
                                            </TableCell>}
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Icons.more className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
                                                        <DropdownMenuItem>Lieferschein drucken</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="h-24 text-center">
                                        Keine abgeschlossenen Transporte im ausgewählten Zeitraum gefunden.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

    