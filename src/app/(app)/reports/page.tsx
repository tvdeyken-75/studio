

"use client";

import { useState, useMemo } from 'react';
import type { Tour, TourStop, Address } from '@/types';
import { tourData, customerData, fleetData, trailerData, addressData } from '@/lib/data';
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
import { format, isWithinInterval, getISOWeek, parseISO, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
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

const AddTourDialog = ({ onAddTour, existingTours }: { onAddTour: (tour: Tour) => void; existingTours: Tour[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const generateNewTourNumber = () => {
        const highestNum = existingTours.reduce((max, tour) => {
            if (tour.tourNumber.startsWith('T-')) {
                const num = parseInt(tour.tourNumber.replace('T-', ''), 10);
                return isNaN(num) ? max : Math.max(max, num);
            }
            return max;
        }, 0);
        return `T-${(highestNum + 1).toString().padStart(5, '0')}`;
    };

    const { register, handleSubmit, control, watch, setValue, reset } = useForm<Tour>({
        defaultValues: {
            id: `tour-${Date.now()}`,
            tourNumber: generateNewTourNumber(),
            tourDate: format(new Date(), 'yyyy-MM-dd'),
            status: 'Entwurf',
            stops: []
        }
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "stops"
    });
    
    const tourPOIs = useMemo(() => addressData.filter(a => a.tourPOI), []);

    const onSubmit = (data: Tour) => {
        onAddTour(data);
        setIsOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            reset({
                id: `tour-${Date.now()}`,
                tourNumber: generateNewTourNumber(),
                tourDate: format(new Date(), 'yyyy-MM-dd'),
                status: 'Entwurf',
                stops: []
            });
        }
        setIsOpen(open);
    };

    const addStop = (type: 'Pickup' | 'Delivery') => {
        append({
            id: `stop-${Date.now()}`,
            stopSequence: fields.length + 1,
            type,
            addressId: '',
            addressName: '',
            location: '',
            plannedDateTime: new Date().toISOString(),
            goodsDescription: '',
            status: 'Planned'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                                    <Label>Tour-Nummer</Label>
                                    <Input {...register('tourNumber')} readOnly className="h-9 font-mono"/>
                                </div>
                                 <div className="space-y-1.5">
                                    <Label>Kunde</Label>
                                     <Select onValueChange={(val) => setValue('customerId', val)}>
                                        <SelectTrigger className="h-9"><SelectValue placeholder="Kunde auswählen" /></SelectTrigger>
                                        <SelectContent>
                                            {customerData.map(c => <SelectItem key={c.id} value={c.id}>{c.firmenname}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Kundenreferenz</Label>
                                    <Input {...register('customerReference')} className="h-9"/>
                                </div>
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
                                 <div className="space-y-1.5">
                                    <Label>Status</Label>
                                     <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Entwurf">Entwurf</SelectItem>
                                                    <SelectItem value="Geplant">Geplant</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
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
                                                <Label>Tour Adresse</Label>
                                                <Controller
                                                    name={`stops.${index}.addressId`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={(val) => {
                                                            field.onChange(val);
                                                            const address = tourPOIs.find(a => a.id === val);
                                                            setValue(`stops.${index}.addressName`, address?.name || '');
                                                            setValue(`stops.${index}.location`, `${address?.strasse}, ${address?.plz} ${address?.stadt}`);
                                                        }}>
                                                            <SelectTrigger className="h-9"><SelectValue placeholder="Adresse auswählen..." /></SelectTrigger>
                                                            <SelectContent>
                                                                {tourPOIs.map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.kurzname})</SelectItem>)}
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
                                            <Label>Standortdetails (z.B. Rampe)</Label>
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
    const [selectedWeek, setSelectedWeek] = useState<string>('this-week');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const addTour = (tour: Tour) => {
        setTours(prev => [tour, ...prev]);
    }

    const [columnVisibility, setColumnVisibility] = useState({
        tourNumber: true,
        kw: true,
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
        kw: 'KW',
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
    
    const statusOptions: Tour['status'][] = ['Entwurf', 'Geplant', 'Zugewiesen', 'Unterwegs', 'Abgeschlossen', 'Geschlossen', 'Storniert'];


    const filteredTours = useMemo(() => {
        let filtered = tours;
        const now = new Date();

        if (selectedWeek !== 'all') {
            let weekStart, weekEnd;
            if (selectedWeek === 'this-week') {
                weekStart = startOfWeek(now, { weekStartsOn: 1 });
                weekEnd = endOfWeek(now, { weekStartsOn: 1 });
            } else if (selectedWeek === 'last-week') {
                 weekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                 weekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
            } else if (selectedWeek === 'next-week') {
                 weekStart = startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
                 weekEnd = endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
            }

            if (weekStart && weekEnd) {
                 filtered = filtered.filter(t => {
                    const tourDate = parseISO(t.tourDate);
                    return isWithinInterval(tourDate, { start: weekStart, end: weekEnd });
                });
            }
        }
        
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(t => t.status === selectedStatus);
        }
        
        if (!searchTerm) return filtered;

        const lowercasedTerm = searchTerm.toLowerCase();
        return filtered.filter(tour =>
            Object.values(tour).some(value =>
                String(value).toLowerCase().includes(lowercasedTerm)
            ) || tour.stops.some(stop => stop.addressName.toLowerCase().includes(lowercasedTerm) || stop.location.toLowerCase().includes(lowercasedTerm))
        );
    }, [tours, searchTerm, selectedWeek, selectedStatus]);
    
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
                             <AddTourDialog onAddTour={addTour} existingTours={tours} />
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
                         <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                            <SelectTrigger className="h-9 w-[180px]">
                                <SelectValue placeholder="Woche filtern..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Wochen</SelectItem>
                                <SelectItem value="last-week">Letzte Woche</SelectItem>
                                <SelectItem value="this-week">Diese Woche</SelectItem>
                                <SelectItem value="next-week">Nächste Woche</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="h-9 w-[180px]">
                                <SelectValue placeholder="Status filtern..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Status</SelectItem>
                                {statusOptions.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

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
                                        {columnVisibility.kw && <TableCell>{`KW ${getISOWeek(parseISO(tour.tourDate))}`}</TableCell>}
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

    
