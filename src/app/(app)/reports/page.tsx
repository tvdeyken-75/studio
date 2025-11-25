

"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Tour, TourStop, Address, Transport, TripTemplate } from '@/types';
import { tourData, customerData, fleetData, trailerData, addressData, dieselpreiseData, transportData, tripTemplateData } from '@/lib/data';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';


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

const formatCurrency = (value?: number) => {
    if (value === undefined || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

const SaveTemplateDialog = ({ stops, onSave }: { stops: TourStop[], onSave: (template: TripTemplate) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { toast } = useToast();

    const handleSave = () => {
        if (!name) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte geben Sie einen Namen für die Vorlage ein.' });
            return;
        }

        const newTemplate: TripTemplate = {
            id: `template-${Date.now()}`,
            name,
            description,
            stops: stops.map(({ id, actualDateTime, status, ...rest }) => rest)
        };

        onSave(newTemplate);
        toast({ title: 'Vorlage gespeichert', description: `Die Vorlage "${name}" wurde erfolgreich erstellt.` });
        setIsOpen(false);
        setName('');
        setDescription('');
    }

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={!stops || stops.length === 0}>
                    <Icons.add className="h-3 w-3 mr-1"/> Als Vorlage speichern
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Als Trip-Vorlage speichern</DialogTitle>
                    <DialogDescription>
                        Speichern Sie die aktuelle Stopp-Konfiguration als wiederverwendbare Vorlage.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                        <Label>Name der Vorlage</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Beschreibung</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Abbrechen</Button></DialogClose>
                    <Button onClick={handleSave}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const AddTourDialog = ({ onSave, existingTours, tourToEdit, children, presetTour }: { onSave: (tour: Tour) => void; existingTours: Tour[], tourToEdit?: Tour | null, children: React.ReactNode, presetTour?: Partial<Tour> }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [templates, setTemplates] = useState(tripTemplateData);
    
    const generateNewTourNumber = () => {
        const defaultStartNumber = '00001';
        const tourNumberPrefix = 'T-';
        const padLength = 5;

        const savedStartNumber = typeof window !== 'undefined' ? localStorage.getItem('tourStartNumber') : null;

        let highestNum = 0;

        if (existingTours.length > 0) {
             highestNum = existingTours.reduce((max, tour) => {
                if (tour.tourNumber.startsWith(tourNumberPrefix)) {
                    const num = parseInt(tour.tourNumber.replace(tourNumberPrefix, ''), 10);
                    return isNaN(num) ? max : Math.max(max, num);
                }
                return max;
            }, 0);
        }

        let nextNum;
        if (highestNum > 0) {
            nextNum = highestNum + 1;
        } else {
            nextNum = parseInt(savedStartNumber || defaultStartNumber, 10);
        }
        
        return `${tourNumberPrefix}${(nextNum).toString().padStart(padLength, '0')}`;
    };

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<Tour>({
        defaultValues: tourToEdit || presetTour || {
            id: `tour-${Date.now()}`,
            tourNumber: generateNewTourNumber(),
            tourDate: format(new Date(), 'yyyy-MM-dd'),
            status: 'Entwurf',
            stops: [],
            rohertrag: 0,
            dieselfloaterPercentage: 0,
            mautzuschlagPercentage: 0,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "stops"
    });
    
    const tourPOIs = useMemo(() => addressData.filter(a => a.tourPOI), []);

    const watchedFields = watch();

    useEffect(() => {
        if (presetTour) {
            reset(presetTour);
        }
    }, [presetTour, reset]);

    useEffect(() => {
        const customer = customerData.find(c => c.id === watchedFields.customerId);
        if (customer) {
            setValue('mautzuschlagPercentage', customer.mautzuschlag || 0);
            if(customer.dieselfloater) {
                 const latestDieselpreis = dieselpreiseData.sort((a,b) => new Date(b.von).getTime() - new Date(a.von).getTime())[0];
                 setValue('dieselfloaterPercentage', latestDieselpreis?.zuschlag || 0);
            } else {
                setValue('dieselfloaterPercentage', 0);
            }
        }
    }, [watchedFields.customerId, setValue]);

    const totalKilometers = useMemo(() => {
        return watchedFields.stops.reduce((sum, stop) => sum + (stop.kilometers || 0), 0);
    }, [watchedFields.stops]);

    const dieselfloaterAmount = useMemo(() => (watchedFields.rohertrag || 0) * ((watchedFields.dieselfloaterPercentage || 0) / 100), [watchedFields.rohertrag, watchedFields.dieselfloaterPercentage]);
    const mautzuschlagAmount = useMemo(() => (watchedFields.rohertrag || 0) * ((watchedFields.mautzuschlagPercentage || 0) / 100), [watchedFields.rohertrag, watchedFields.mautzuschlagPercentage]);
    const zwischensumme = useMemo(() => (watchedFields.rohertrag || 0) + dieselfloaterAmount + mautzuschlagAmount, [watchedFields.rohertrag, dieselfloaterAmount, mautzuschlagAmount]);
    const mwstAmount = useMemo(() => zwischensumme * 0.19, [zwischensumme]);
    const bruttoAmount = useMemo(() => zwischensumme + mwstAmount, [zwischensumme, mwstAmount]);


    const onSubmit = (data: Tour) => {
        const finalData = {
            ...data,
            totalKilometers,
            calculatedRevenue: zwischensumme,
            profitability: zwischensumme - (data.totalCosts || 0),
        };
        onSave(finalData);
        setIsOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            const defaultValues = tourToEdit || presetTour || {
                id: `tour-${Date.now()}`,
                tourNumber: generateNewTourNumber(),
                tourDate: format(new Date(), 'yyyy-MM-dd'),
                status: 'Entwurf',
                stops: [],
                rohertrag: 0,
                dieselfloaterPercentage: 0,
                mautzuschlagPercentage: 0,
            };
            reset(defaultValues);
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
            status: 'Planned',
            kilometers: 0,
        });
    };
    
    const handleLoadTemplate = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;
        
        const newStops = template.stops.map(stop => ({
            ...stop,
            id: `stop-tpl-${Date.now()}-${stop.id}`,
            status: 'Planned',
            plannedDateTime: new Date().toISOString(),
        } as TourStop));
        
        setValue('stops', newStops, { shouldDirty: true });
    };

    const handleSaveTemplate = (template: TripTemplate) => {
        setTemplates(prev => [...prev, template]);
        // Here you would also persist this to your main data source
    };


    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-6xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{tourToEdit ? `Tour ${tourToEdit.tourNumber} bearbeiten` : 'Neue Tour erstellen'}</DialogTitle>
                        <DialogDescription>
                            Definieren Sie eine neue Tour mit allen zugehörigen Ressourcen und Stopps.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                        <div className="space-y-4">
                             {/* Section 1: Core Tour Data */}
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold text-base">Tour-Stammdaten</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Tour-Nummer</Label>
                                        <Input {...register('tourNumber')} readOnly className="h-9 font-mono"/>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Tour-Datum</Label>
                                        <Input type="date" {...register('tourDate')} className="h-9"/>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Kunde</Label>
                                        <Controller
                                            name="customerId"
                                            control={control}
                                            rules={{ required: 'Kunde ist erforderlich' }}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="h-9"><SelectValue placeholder="Kunde auswählen" /></SelectTrigger>
                                                    <SelectContent>
                                                        {customerData.map(c => <SelectItem key={c.id} value={c.id}>{c.firmenname}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.customerId && <p className="text-xs text-destructive">{errors.customerId.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Kundenreferenz</Label>
                                        <Input {...register('customerReference')} className="h-9"/>
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
                                         <Controller
                                            name="vehicleId"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="h-9"><SelectValue placeholder="Fahrzeug auswählen" /></SelectTrigger>
                                                    <SelectContent>
                                                        {fleetData.map((v) => (
                                                        <SelectItem key={v.id} value={v.id}>
                                                            {v.kennzeichen}
                                                        </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
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
                            
                            {/* Section 3: Calculation */}
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold text-base">Kalkulation</h3>
                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                     <div className="space-y-1.5">
                                        <Label>Rohertrag (€)</Label>
                                        <Controller name="rohertrag" control={control} render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-9"/>} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Dieselfloater (%)</Label>
                                        <Controller name="dieselfloaterPercentage" control={control} render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-9"/>} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Mautzuschlag (%)</Label>
                                        <Controller name="mautzuschlagPercentage" control={control} render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-9"/>} />
                                    </div>
                                 </div>
                                 <div className="space-y-4 p-4 border rounded-md bg-muted/50 mt-4">
                                    <h4 className="font-medium text-center text-sm">Berechnungs-Vorschau</h4>
                                    <Separator />
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr><td>Rohertrag</td><td className="text-right">{formatCurrency(watchedFields.rohertrag)}</td></tr>
                                            <tr><td>+ Dieselfloater ({watchedFields.dieselfloaterPercentage?.toFixed(2)}%)</td><td className="text-right">{formatCurrency(dieselfloaterAmount)}</td></tr>
                                            <tr><td>+ Mautzuschlag ({watchedFields.mautzuschlagPercentage?.toFixed(2)}%)</td><td className="text-right">{formatCurrency(mautzuschlagAmount)}</td></tr>
                                            <tr><td colSpan={2}><Separator className="my-2"/></td></tr>
                                            <tr className="font-bold"><td>Zwischensumme (Netto)</td><td className="text-right">{formatCurrency(zwischensumme)}</td></tr>
                                                <tr><td>+ MwSt. (19%)</td><td className="text-right">{formatCurrency(mwstAmount)}</td></tr>
                                            <tr><td colSpan={2}><Separator className="my-2"/></td></tr>
                                            <tr className="font-bold text-base"><td>Gesamtbetrag (Brutto)</td><td className="text-right">{formatCurrency(bruttoAmount)}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                         {/* Section 2: Stops */}
                        <div className="space-y-4 p-4 border rounded-lg">
                             <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-base">Tour-Stopps</h3>
                                <div className="flex gap-2">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" variant="outline" size="sm">Vorlage laden</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {templates.map(t => (
                                                <DropdownMenuItem key={t.id} onSelect={() => handleLoadTemplate(t.id)}>
                                                    {t.name}
                                                </DropdownMenuItem>
                                            ))}
                                            {templates.length === 0 && <DropdownMenuItem disabled>Keine Vorlagen</DropdownMenuItem>}
                                        </DropdownMenuContent>
                                     </DropdownMenu>
                                     <SaveTemplateDialog stops={watchedFields.stops} onSave={handleSaveTemplate} />
                                </div>
                             </div>
                             <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => addStop('Pickup')}><Icons.add className="h-3 w-3 mr-1"/> Abholung</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addStop('Delivery')}><Icons.add className="h-3 w-3 mr-1"/> Lieferung</Button>
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
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label>Standortdetails (z.B. Rampe)</Label>
                                                <Controller name={`stops.${index}.location`} control={control} render={({field}) => <Input {...field} placeholder="z.B. Rampe 5" className="h-9" />} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label>Kilometer</Label>
                                                <Controller
                                                    name={`stops.${index}.kilometers`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="h-9" />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                         <div className="space-y-1.5">
                                            <Label>Frachtbeschreibung</Label>
                                            <Textarea {...register(`stops.${index}.goodsDescription`)} placeholder="z.B. 24t, 33 Paletten" rows={2} />
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

const TourDetailDialog = ({ tour, onSave, children, mode = 'view' }: { tour: Tour; onSave: (updatedTour: Tour) => void; children: React.ReactNode, mode?: 'view' | 'edit' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rohertrag, setRohertrag] = useState(tour.rohertrag || 0);
    const [dieselfloater, setDieselfloater] = useState(tour.dieselfloaterPercentage || 0);
    const [mautzuschlag, setMautzuschlag] = useState(tour.mautzuschlagPercentage || 0);

    const printRef = useRef<HTMLDivElement>(null);

    const isEditMode = mode === 'edit';

    const tourDetails = useMemo(() => {
        const customer = customerData.find(c => c.id === tour.customerId);
        const vehicle = fleetData.find(v => v.id === tour.vehicleId);
        const trailer = trailerData.find(t => t.id === tour.trailerId);
        // In a real app, you'd fetch driver data properly
        const driverName = tour.driverId?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

        return { customer, vehicle, trailer, driverName };
    }, [tour]);


    useEffect(() => {
        if(isOpen) {
            setMautzuschlag(tour.mautzuschlagPercentage || tourDetails.customer?.mautzuschlag || 0);
            
            const latestDieselpreis = dieselpreiseData.sort((a,b) => new Date(b.von).getTime() - new Date(a.von).getTime())[0];
            setDieselfloater(tour.dieselfloaterPercentage || latestDieselpreis?.zuschlag || 0);

            setRohertrag(tour.rohertrag || 0);
        }
    }, [isOpen, tour, tourDetails]);
    
    const totalKilometers = useMemo(() => {
        return tour.stops.reduce((sum, stop) => sum + (stop.kilometers || 0), 0);
    }, [tour.stops]);

    const dieselfloaterAmount = useMemo(() => rohertrag * (dieselfloater / 100), [rohertrag, dieselfloater]);
    const mautzuschlagAmount = useMemo(() => rohertrag * (mautzuschlag / 100), [rohertrag, mautzuschlag]);
    const zwischensumme = useMemo(() => rohertrag + dieselfloaterAmount + mautzuschlagAmount, [rohertrag, dieselfloaterAmount, mautzuschlagAmount]);
    const mwstAmount = useMemo(() => zwischensumme * 0.19, [zwischensumme]);
    const bruttoAmount = useMemo(() => zwischensumme + mwstAmount, [zwischensumme, mwstAmount]);

    const handleSave = () => {
        const updatedTour: Tour = {
            ...tour,
            rohertrag,
            dieselfloaterPercentage: dieselfloater,
            mautzuschlagPercentage: mautzuschlag,
            totalKilometers,
            calculatedRevenue: zwischensumme,
            profitability: zwischensumme - (tour.totalCosts || 0) // Placeholder for costs
        };
        onSave(updatedTour);
        setIsOpen(false);
    };

    const handlePrint = () => {
       const printContent = printRef.current;
       if (printContent) {
           const printWindow = window.open('', '', 'height=800,width=800');
           if (printWindow) {
               printWindow.document.write('<html><head><title>Tour Kalkulation</title>');
               printWindow.document.write('<style>body { font-family: sans-serif; font-size: 10px; } table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; } td, th { border: 1px solid #ddd; padding: 4px; text-align: left;} .text-right { text-align: right; } .font-bold { font-weight: bold; } .mb-4 { margin-bottom: 1rem; } h1, h2, h3 { margin: 0; padding: 0; } h1 {font-size: 1.5rem; margin-bottom: 0.5rem;} h2 { font-size: 1.2rem; margin-bottom: 0.5rem; border-bottom: 1px solid #ddd; padding-bottom: 2px;} h3 { font-size: 1rem; margin-bottom: 0.25rem; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } .col-span-2 { grid-column: span 2; }</style>');
               printWindow.document.write('</head><body>');
               printWindow.document.write(printContent.innerHTML);
               printWindow.document.write('</body></html>');
               printWindow.document.close();
               printWindow.focus();
               printWindow.print();
           }
       }
    };
    
    const formatDate = (date: string, formatString: string = 'dd.MM.yyyy HH:mm') => {
        try {
            return format(new Date(date), formatString, { locale: de });
        } catch (e) {
            return 'Ungültiges Datum';
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Kalkulation für Tour' : 'Details für Tour'} {tour.tourNumber}</DialogTitle>
                    <DialogDescription>{isEditMode ? 'Berechnen Sie den Ertrag und erstellen Sie einen Report.' : 'Übersicht der Tourdetails und des Reports.'}</DialogDescription>
                </DialogHeader>
                
                <div ref={printRef} className="py-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Details */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-base mb-2">Tour-Informationen</h3>
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr className="border-b"><td className="py-1 pr-2 text-muted-foreground">Datum:</td><td className="font-medium">{formatDate(tour.tourDate, 'dd.MM.yyyy')}</td></tr>
                                        <tr className="border-b"><td className="py-1 pr-2 text-muted-foreground">Kunde:</td><td className="font-medium">{tourDetails.customer?.firmenname || 'N/A'}</td></tr>
                                        <tr className="border-b"><td className="py-1 pr-2 text-muted-foreground">Referenz:</td><td className="font-medium">{tour.customerReference || 'N/A'}</td></tr>
                                        <tr className="border-b"><td className="py-1 pr-2 text-muted-foreground">Fahrer:</td><td className="font-medium">{tourDetails.driverName || 'N/A'}</td></tr>
                                        <tr className="border-b"><td className="py-1 pr-2 text-muted-foreground">Fahrzeug:</td><td className="font-medium">{tourDetails.vehicle?.kennzeichen || 'N/A'}</td></tr>
                                        <tr className="border-b"><td className="py-1 pr-2 text-muted-foreground">Anhänger:</td><td className="font-medium">{tourDetails.trailer?.kennzeichen || 'N/A'}</td></tr>
                                        <tr><td className="py-1 pr-2 text-muted-foreground">Kilometer:</td><td className="font-medium">{totalKilometers} km</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-2">Tour-Stopps</h3>
                                <div className="space-y-2">
                                    {tour.stops.map(stop => (
                                        <div key={stop.id} className="p-2 border rounded-md">
                                            <p className="font-medium text-sm">{stop.stopSequence}. {stop.type === 'Pickup' ? 'Abholung' : 'Lieferung'}: {stop.addressName}</p>
                                            <p className="text-xs text-muted-foreground">{stop.location}</p>
                                            <p className="text-xs text-muted-foreground">Geplant: {formatDate(stop.plannedDateTime)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Calculation */}
                         <div className="space-y-4">
                            <h3 className="font-semibold text-base">Kalkulation</h3>
                            <div className="space-y-4 p-4 border rounded-md" style={{backgroundColor: isEditMode ? 'transparent' : 'hsl(var(--muted)/0.5)'}}>
                                {isEditMode ? (
                                    <div className="space-y-3">
                                        <div className="space-y-1.5"><Label>Rohertrag (€)</Label><Input type="number" value={rohertrag} onChange={(e) => setRohertrag(Number(e.target.value))} className="h-9"/></div>
                                        <div className="space-y-1.5"><Label>Dieselfloater (%)</Label><Input type="number" value={dieselfloater} onChange={(e) => setDieselfloater(Number(e.target.value))} className="h-9"/></div>
                                        <div className="space-y-1.5"><Label>Mautzuschlag (%)</Label><Input type="number" value={mautzuschlag} onChange={(e) => setMautzuschlag(Number(e.target.value))} className="h-9"/></div>
                                    </div>
                                ) : null}

                                <h4 className="font-medium text-center text-sm pt-2">Berechnungs-Vorschau</h4>
                                <Separator />
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr><td>Rohertrag</td><td className="text-right">{formatCurrency(rohertrag)}</td></tr>
                                        <tr><td>+ Dieselfloater ({dieselfloater.toFixed(2)}%)</td><td className="text-right">{formatCurrency(dieselfloaterAmount)}</td></tr>
                                        <tr><td>+ Mautzuschlag ({mautzuschlag.toFixed(2)}%)</td><td className="text-right">{formatCurrency(mautzuschlagAmount)}</td></tr>
                                        <tr><td colSpan={2}><Separator className="my-2"/></td></tr>
                                        <tr className="font-bold"><td>Zwischensumme (Netto)</td><td className="text-right">{formatCurrency(zwischensumme)}</td></tr>
                                            <tr><td>+ MwSt. (19%)</td><td className="text-right">{formatCurrency(mwstAmount)}</td></tr>
                                        <tr><td colSpan={2}><Separator className="my-2"/></td></tr>
                                        <tr className="font-bold text-base"><td>Gesamtbetrag (Brutto)</td><td className="text-right">{formatCurrency(bruttoAmount)}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={handlePrint}>Drucken</Button>
                    <div className="flex-grow"></div>
                    <DialogClose asChild><Button type="button" variant="ghost">Abbrechen</Button></DialogClose>
                    {isEditMode && <Button type="button" onClick={handleSave}>Berechnung speichern</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const FahrbefehlDialog = ({ tour }: { tour: Tour }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
       const printContent = printRef.current;
       if (printContent) {
           const printWindow = window.open('', '', 'height=800,width=800');
           if (printWindow) {
               printWindow.document.write('<html><head><title>Fahrbefehl</title>');
               printWindow.document.write('<style>body { font-family: sans-serif; font-size: 12px; } .container { max-width: 800px; margin: auto; padding: 20px; } h1, h2 { border-bottom: 1px solid #ccc; padding-bottom: 5px; } table { width: 100%; border-collapse: collapse; margin-top: 1rem; } td, th { border: 1px solid #ddd; padding: 8px; text-align: left; } .header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1rem; } .logo { align-self: start; } </style>');
               printWindow.document.write('</head><body>');
               printWindow.document.write(printContent.innerHTML);
               printWindow.document.write('</body></html>');
               printWindow.document.close();
               printWindow.focus();
               printWindow.print();
           }
       }
    };

    const tourDetails = useMemo(() => {
        const vehicle = fleetData.find(v => v.id === tour.vehicleId);
        const trailer = trailerData.find(t => t.id === tour.trailerId);
        const driverName = tour.driverId?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        return { vehicle, trailer, driverName };
    }, [tour]);
    
    const formatDate = (date: string, formatString: string = 'dd.MM.yyyy HH:mm') => {
        try {
            return format(new Date(date), formatString, { locale: de });
        } catch (e) {
            return 'Ungültiges Datum';
        }
    }

    return (
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Fahrbefehl für Tour {tour.tourNumber}</DialogTitle>
                <DialogDescription>
                    Dies ist die Ansicht für den Fahrer. Sie kann gedruckt und mitgegeben werden.
                </DialogDescription>
            </DialogHeader>
            <div ref={printRef} className="py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="header-grid">
                    <div>
                        <h1>Fahrbefehl</h1>
                        <p><strong>Tour-Nr:</strong> {tour.tourNumber}</p>
                        <p><strong>Datum:</strong> {formatDate(tour.tourDate, 'dd.MM.yyyy')}</p>
                    </div>
                    <div className="logo">
                        <Logo />
                    </div>
                </div>

                <h2>Informationen</h2>
                <table>
                    <tbody>
                        <tr><td><strong>Fahrer:</strong></td><td>{tourDetails.driverName || 'N/A'}</td></tr>
                        <tr><td><strong>Fahrzeug:</strong></td><td>{tourDetails.vehicle?.kennzeichen || 'N/A'} ({tourDetails.vehicle?.hersteller} {tourDetails.vehicle?.modell})</td></tr>
                        <tr><td><strong>Anhänger:</strong></td><td>{tourDetails.trailer?.kennzeichen || 'N/A'} ({tourDetails.trailer?.hersteller})</td></tr>
                        <tr><td><strong>Kundenreferenz:</strong></td><td>{tour.customerReference || 'N/A'}</td></tr>
                    </tbody>
                </table>
                
                <h2>Stopps</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Typ</th>
                            <th>Adresse</th>
                            <th>Standortdetails</th>
                            <th>Geplante Zeit</th>
                            <th>Fracht</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tour.stops.map((stop, index) => (
                            <tr key={stop.id}>
                                <td>{index + 1}</td>
                                <td>{stop.type === 'Pickup' ? 'Abholung' : 'Lieferung'}</td>
                                <td>{stop.addressName}</td>
                                <td>{stop.location}</td>
                                <td>{formatDate(stop.plannedDateTime)}</td>
                                <td>{stop.goodsDescription}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="mt-8">
                    <h2>Unterschrift Fahrer</h2>
                    <div className="mt-12 border-t pt-2">
                       <p>{tourDetails.driverName || '__________________________'}</p>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={handlePrint}>Drucken</Button>
                <DialogClose asChild>
                    <Button variant="ghost">Schließen</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};


function TourReportPageInternal() {
    const [tours, setTours] = useState<Tour[]>(tourData);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWeek, setSelectedWeek] = useState<string>('this-week');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [isAddTourDialogOpen, setIsAddTourDialogOpen] = useState(false);
    const [presetTour, setPresetTour] = useState<Partial<Tour> | undefined>();

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const action = searchParams.get('action');
        const transportId = searchParams.get('transportId');
        if (action === 'create-tour' && transportId) {
            const transport = transportData.find(t => t.id === transportId);
            if (transport) {
                const customer = customerData.find(c => c.firmenname === transport.customer);
                const preset: Partial<Tour> = {
                    customerId: customer?.id,
                    customerReference: transport.transportNumber,
                    vehicleId: transport.vehicleId,
                    stops: [
                        {
                            id: `stop-p-${Date.now()}`,
                            stopSequence: 1,
                            type: 'Pickup',
                            addressName: transport.pickupLocation,
                            location: transport.pickupLocation,
                            plannedDateTime: transport.plannedPickupDate,
                            status: 'Planned',
                            addressId: '',
                            goodsDescription: '',
                        },
                        {
                            id: `stop-d-${Date.now()}`,
                            stopSequence: 2,
                            type: 'Delivery',
                            addressName: transport.deliveryLocation,
                            location: transport.deliveryLocation,
                            plannedDateTime: transport.plannedDeliveryDate,
                            status: 'Planned',
                            addressId: '',
                            goodsDescription: '',
                        }
                    ]
                };
                setPresetTour(preset);
                
                // We need to wrap this in a timeout to ensure the state update is processed
                // before the dialog is triggered. Also reset the URL.
                setTimeout(() => {
                    setIsAddTourDialogOpen(true);
                    router.replace('/reports');
                }, 0);
            }
        }
    }, [searchParams, router]);
    

    const addOrUpdateTour = (tour: Tour) => {
        setTours(prev => {
            const index = prev.findIndex(t => t.id === tour.id);
            if (index > -1) {
                const newTours = [...prev];
                newTours[index] = tour;
                return newTours;
            }
            return [tour, ...prev];
        });
    }

    const [columnVisibility, setColumnVisibility] = useState({
        tourNumber: true,
        kw: true,
        tourDate: true,
        driverId: true,
        vehicleId: true,
        stops: true,
        status: true,
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
        const totalRevenue = filteredTours.reduce((sum, tour) => sum + (tour.calculatedRevenue || tour.totalRevenue || 0), 0);
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
                             <AddTourDialog onSave={addOrUpdateTour} existingTours={tours} presetTour={presetTour}>
                                <Button size="sm" variant="outline">
                                    <Icons.add className="mr-2 h-4 w-4" />
                                    Neue Tour
                                </Button>
                             </AddTourDialog>
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
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Icons.more className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <TourDetailDialog tour={tour} onSave={addOrUpdateTour} mode="view">
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Details anzeigen</DropdownMenuItem>
                                                        </TourDetailDialog>
                                                         <AddTourDialog onSave={addOrUpdateTour} existingTours={tours} tourToEdit={tour}>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Tour bearbeiten</DropdownMenuItem>
                                                        </AddTourDialog>
                                                         <DropdownMenuSeparator />
                                                         <DialogTrigger asChild>
                                                            <DropdownMenuItem>Fahrbefehl erstellen</DropdownMenuItem>
                                                         </DialogTrigger>
                                                        <TourDetailDialog tour={tour} onSave={addOrUpdateTour} mode="edit">
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Kalkulation &amp; Report</DropdownMenuItem>
                                                        </TourDetailDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <FahrbefehlDialog tour={tour} />
                                            </Dialog>
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
            <AddTourDialog onSave={addOrUpdateTour} existingTours={tours} presetTour={presetTour}>
                <div style={{ display: isAddTourDialogOpen ? 'block' : 'none' }} />
            </AddTourDialog>
        </div>
    );
}

export default function TransportReportPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <TourReportPageInternal />
        </React.Suspense>
    );
}
