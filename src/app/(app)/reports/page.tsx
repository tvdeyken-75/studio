
"use client";

import { useState, useMemo } from 'react';
import type { Tour, TourStop } from '@/types';
import { tourData, customerData, fleetData, trailerData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { SlidersHorizontal, FileDown, Trash2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isWithinInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useForm, useFieldArray, Controller } from 'react-hook-form';


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

const AddTourDialog = ({ onAddTour }: { onAddTour: (tour: Tour) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const { register, handleSubmit, control, watch, setValue, reset } = useForm<Tour>({
        defaultValues: {
            id: `tour-${Date.now()}`,
            tourNumber: `TOUR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            tourDate: format(new Date(), 'yyyy-MM-dd'),
            status: 'Draft',
            stops: []
        }
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "stops"
    });

    const onSubmit = (data: Tour) => {
        onAddTour(data);
        reset();
        setIsOpen(false);
    };

    const addStop = (type: 'Pickup' | 'Delivery') => {
        append({
            id: `stop-${Date.now()}`,
            stopSequence: fields.length + 1,
            type,
            customerId: '',
            customerName: '',
            location: '',
            plannedDateTime: new Date().toISOString(),
            goodsDescription: '',
            status: 'Planned'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neue Tour
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Neue Tour erstellen</DialogTitle>
                        <DialogDescription>
                            Definieren Sie eine neue Tour mit allen zugehörigen Ressourcen und Stopps.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                        {/* Section 1: Core Tour Data */}
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="font-semibold text-base">Tour-Stammdaten</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Tour-Datum</Label>
                                    <Input type="date" {...register('tourDate')} className="h-9"/>
                                </div>
                                 <div className="space-y-1.5">
                                    <Label>Fahrer</Label>
                                     <Select onValueChange={(val) => setValue('driverId', val)}>
                                        <SelectTrigger className="h-9"><SelectValue placeholder="Fahrer auswählen" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="max-mustermann">Max Mustermann</SelectItem>
                                            <SelectItem value="erika-musterfrau">Erika Musterfrau</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Status</Label>
                                     <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Draft">Draft</SelectItem>
                                                    <SelectItem value="Planned">Planned</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Fahrzeug</Label>
                                     <Select onValueChange={(val) => setValue('vehicleId', val)}>
                                        <SelectTrigger className="h-9"><SelectValue placeholder="Fahrzeug auswählen" /></SelectTrigger>
                                        <SelectContent>
                                            {fleetData.map(v => <SelectItem key={v.id} value={v.id}>{v.kennzeichen}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Anhänger</Label>
                                    <Select onValueChange={(val) => setValue('trailerId', val)}>
                                        <SelectTrigger className="h-9"><SelectValue placeholder="Anhänger auswählen" /></SelectTrigger>
                                        <SelectContent>
                                            {trailerData.map(t => <SelectItem key={t.id} value={t.id}>{t.kennzeichen}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                         {/* Section 2: Stops */}
                        <div className="space-y-4 p-4 border rounded-lg">
                             <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-base">Tour-Stopps</h3>
                                <div className="flex gap-2">
                                     <Button type="button" variant="outline" size="sm" onClick={() => addStop('Pickup')}><Icons.add className="h-3 w-3 mr-1"/> Abholung</Button>
                                     <Button type="button" variant="outline" size="sm" onClick={() => addStop('Delivery')}><Icons.add className="h-3 w-3 mr-1"/> Lieferung</Button>
                                </div>
                             </div>
                             <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-3 border rounded-md bg-muted/50 space-y-3 relative">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium text-sm">Stopp {index + 1}: {watch(`stops.${index}.type`)}</h4>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label>Kunde</Label>
                                                <Controller
                                                    name={`stops.${index}.customerId`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={(val) => {
                                                            field.onChange(val);
                                                            const customer = customerData.find(c => c.id === val);
                                                            setValue(`stops.${index}.customerName`, customer?.firmenname || '');
                                                            setValue(`stops.${index}.location`, `${customer?.strasse} ${customer?.hausnummer}, ${customer?.plz} ${customer?.ort}`);
                                                        }}>
                                                            <SelectTrigger className="h-9"><SelectValue placeholder="Kunde auswählen..." /></SelectTrigger>
                                                            <SelectContent>
                                                                {customerData.map(c => <SelectItem key={c.id} value={c.id}>{c.firmenname}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                             <div className="space-y-1.5">
                                                <Label>Geplante Zeit</Label>
                                                <Input type="datetime-local" {...register(`stops.${index}.plannedDateTime`)} className="h-9" />
                                            </div>
                                         </div>
                                         <div className="space-y-1.5">
                                            <Label>Standort</Label>
                                            <Input {...register(`stops.${index}.location`)} placeholder="z.B. Rampe 5, Lagerhalle B" className="h-9" />
                                        </div>
                                         <div className="space-y-1.5">
                                            <Label>Frachtbeschreibung</Label>
                                            <Textarea {...register(`stops.${index}.goodsDescription`)} placeholder="z.B. 24t, 33 Paletten, Lebensmittel" rows={2} />
                                        </div>
                                    </div>
                                ))}
                                {fields.length === 0 && (
                                    <p className="text-sm text-center text-muted-foreground py-8">Noch keine Stopps hinzugefügt.</p>
                                )}
                             </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Abbrechen</Button></DialogClose>
                        <Button type="submit">Tour speichern</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default function TransportReportPage() {
    const [tours, setTours] = useState<Tour[]>(tourData);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const addTour = (tour: Tour) => {
        setTours(prev => [tour, ...prev]);
    }

    const [columnVisibility, setColumnVisibility] = useState({
        tourNumber: true,
        tourDate: true,
        driverId: true,
        vehicleId: true,
        stops: true,
        status: true,
        profitability: true,
    });
    
    type ColumnKeys = keyof typeof columnVisibility;
    
    const columnLabels: Record<ColumnKeys, string> = {
        tourNumber: 'Tour-Nr.',
        tourDate: 'Datum',
        driverId: 'Fahrer',
        vehicleId: 'Fahrzeug',
        stops: 'Stopps',
        status: 'Status',
        profitability: 'Profitabilität',
    };

    const toggleColumn = (column: ColumnKeys) => {
        setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
    }
    
    const filteredTours = useMemo(() => {
        let filtered = tours;

        if (dateRange?.from && dateRange?.to) {
            filtered = filtered.filter(t => {
                const tourDate = new Date(t.tourDate);
                return isWithinInterval(tourDate, { start: dateRange.from!, end: dateRange.to! });
            });
        }
        
        if (!searchTerm) return filtered;

        const lowercasedTerm = searchTerm.toLowerCase();
        return filtered.filter(tour =>
            Object.values(tour).some(value =>
                String(value).toLowerCase().includes(lowercasedTerm)
            ) || tour.stops.some(stop => stop.customerName.toLowerCase().includes(lowercasedTerm) || stop.location.toLowerCase().includes(lowercasedTerm))
        );
    }, [tours, searchTerm, dateRange]);
    
    const kpis = useMemo(() => {
        const totalTours = filteredTours.length;
        const totalStops = filteredTours.reduce((sum, tour) => sum + tour.stops.length, 0);
        const totalRevenue = filteredTours.reduce((sum, tour) => sum + (tour.totalRevenue || 0), 0);
        const totalProfit = filteredTours.reduce((sum, tour) => sum + (tour.profitability || 0), 0);
        
        return { totalTours, totalStops, totalRevenue, totalProfit };
    }, [filteredTours]);
    
    const formatDate = (date: string, formatString: string = 'dd.MM.yyyy') => {
        try {
            return format(new Date(date), formatString, { locale: de });
        } catch (e) {
            return 'Ungültiges Datum';
        }
    }
    
     const formatCurrency = (value?: number) => {
        if (value === undefined) return 'N/A';
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
    }
    
    const statusVariant: Record<Tour['status'], "default" | "destructive" | "secondary" | "outline"> = {
        'Draft': 'secondary',
        'Planned': 'default',
        'Assigned': 'default',
        'Ongoing': 'default',
        'Finished': 'outline',
        'Closed': 'outline'
    };
    
    const statusColor: Record<Tour['status'], string> = {
        'Draft': 'bg-gray-400',
        'Planned': 'bg-blue-500',
        'Assigned': 'bg-yellow-500',
        'Ongoing': 'bg-purple-500',
        'Finished': 'bg-green-600',
        'Closed': 'bg-gray-700'
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Anzahl Touren" value={kpis.totalTours.toString()} icon={<Icons.route className="h-5 w-5" />} description="im ausgewählten Zeitraum" />
                <KpiCard title="Gesamtumsatz" value={formatCurrency(kpis.totalRevenue)} icon={<Icons.income className="h-5 w-5" />} description="erwirtschaftet" />
                <KpiCard title="Gesamtprofit" value={formatCurrency(kpis.totalProfit)} icon={<Icons.wallet className="h-5 w-5" />} description="erzielt" />
                <KpiCard title="Anzahl Stopps" value={kpis.totalStops.toString()} icon={<Icons.address className="h-5 w-5" />} description="angefahren" />
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Tourenübersicht</CardTitle>
                            <CardDescription>
                                Verwalten Sie alle geplanten und laufenden Touren.
                            </CardDescription>
                        </div>
                         <div className="flex items-center gap-2">
                             <AddTourDialog onAddTour={addTour} />
                         </div>
                    </div>
                </CardHeader>
                <div className="p-4 border-b flex justify-between items-center gap-4">
                     <Input
                        placeholder="Touren durchsuchen..."
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
                            {filteredTours.length > 0 ? (
                                filteredTours.map((tour) => (
                                    <TableRow key={tour.id}>
                                        {columnVisibility.tourNumber && <TableCell className="font-medium">{tour.tourNumber}</TableCell>}
                                        {columnVisibility.tourDate && <TableCell>{formatDate(tour.tourDate)}</TableCell>}
                                        {columnVisibility.driverId && <TableCell>{tour.driverId || 'N/A'}</TableCell>}
                                        {columnVisibility.vehicleId && <TableCell>{fleetData.find(v => v.id === tour.vehicleId)?.kennzeichen || 'N/A'}</TableCell>}
                                        {columnVisibility.stops && <TableCell>{tour.stops.length}</TableCell>}
                                        {columnVisibility.status && <TableCell>
                                            <Badge variant={statusVariant[tour.status]} className={cn('text-white', statusColor[tour.status])}>
                                                {tour.status}
                                            </Badge>
                                        </TableCell>}
                                        {columnVisibility.profitability && <TableCell className={cn(
                                            (tour.profitability || 0) < 0 ? 'text-destructive' : 'text-green-600'
                                        )}>{formatCurrency(tour.profitability)}</TableCell>}
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Icons.more className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
                                                    <DropdownMenuItem>Tour bearbeiten</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="h-24 text-center">
                                        Keine Touren im ausgewählten Zeitraum gefunden.
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
