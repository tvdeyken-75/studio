"use client";

import { useState, useMemo } from 'react';
import type { Transport, Customer, Vehicle, Trailer } from '@/types';
import { transportData, customerData, fleetData, trailerData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';

const statusColors: { [key: string]: string } = {
  Geplant: 'bg-blue-500',
  'In Vorbereitung': 'bg-yellow-500',
  'Bereit zur Abholung': 'bg-green-500',
  Unterwegs: 'bg-purple-500',
  Abgeschlossen: 'bg-gray-500',
  Storniert: 'bg-red-500',
};


const AddTransportDialog = ({ onAdd }: { onAdd: (transport: Transport) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<Partial<Transport>>({
        defaultValues: {
            id: `transport-${Date.now()}`,
            transportNumber: `T-${Math.floor(Math.random() * 10000)}`,
            status: 'In Vorbereitung',
        }
    });

    const onSubmit = (data: Partial<Transport>) => {
        if(!data.customer || !data.pickupLocation || !data.deliveryLocation) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte füllen Sie alle Pflichtfelder aus.' });
            return;
        }

        const customer = customerData.find(c => c.id === data.customer);
        const transport: Transport = {
            ...data,
            id: `t-${Date.now()}`,
            transportNumber: data.transportNumber || '',
            customer: customer?.firmenname || 'Unbekannt',
            status: data.status || 'In Vorbereitung',
            plannedPickupDate: data.plannedPickupDate || new Date().toISOString(),
            plannedDeliveryDate: data.plannedDeliveryDate || new Date().toISOString(),
            actualPickupDate: '',
            actualDeliveryDate: '',
        } as Transport;
        
        onAdd(transport);
        toast({ title: 'Transportauftrag erstellt', description: `Auftrag ${transport.transportNumber} wurde angelegt.` });
        setIsOpen(false);
        reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neuer Transportauftrag
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Neuen Transportauftrag anlegen</DialogTitle>
                        <DialogDescription>
                            Füllen Sie die Details aus. Sie können aus einer Vorlage laden oder diesen Auftrag als Vorlage speichern.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-4">
                        <div className="flex items-center gap-4 mb-4">
                             <Button type="button" variant="outline" size="sm">Aus Vorlage laden</Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Kunde</Label>
                                <Controller
                                    name="customer"
                                    control={control}
                                    rules={{ required: 'Kunde ist ein Pflichtfeld' }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Kunde auswählen..." /></SelectTrigger>
                                            <SelectContent>
                                                {customerData.map(c => <SelectItem key={c.id} value={c.id}>{c.firmenname}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                 {errors.customer && <p className="text-xs text-destructive">{errors.customer.message}</p>}
                            </div>
                             <div className="space-y-1.5">
                                <Label>Auftragsnummer (Kunde)</Label>
                                <Input {...register('auftragsId')} placeholder="Optional"/>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Frachtbeschreibung</Label>
                            <Textarea {...register('frachtbeschreibung')} placeholder="z.B. 33 Paletten, 24t, Lebensmittel" />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label>Abholort</Label>
                                <Input {...register('pickupLocation', { required: true })} />
                                {errors.pickupLocation && <p className="text-xs text-destructive">Abholort ist ein Pflichtfeld.</p>}
                            </div>
                             <div className="space-y-1.5">
                                <Label>Geplantes Abholdatum</Label>
                                <Input type="datetime-local" {...register('plannedPickupDate')} />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label>Lieferort</Label>
                                <Input {...register('deliveryLocation', { required: true })} />
                                {errors.deliveryLocation && <p className="text-xs text-destructive">Lieferort ist ein Pflichtfeld.</p>}
                            </div>
                             <div className="space-y-1.5">
                                <Label>Geplantes Lieferdatum</Label>
                                <Input type="datetime-local" {...register('plannedDeliveryDate')} />
                            </div>
                        </div>

                         <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label>Fahrer</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Fahrer zuweisen..."/></SelectTrigger></Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Fahrzeug</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Fahrzeug zuweisen..."/></SelectTrigger></Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Anhänger</Label>
                                <Select><SelectTrigger><SelectValue placeholder="Anhänger zuweisen..."/></SelectTrigger></Select>
                            </div>
                        </div>
                        
                         <div className="flex items-center space-x-2 pt-4">
                            <Checkbox id="saveAsTemplate" />
                            <Label htmlFor="saveAsTemplate" className="text-sm font-normal">
                                Als wiederkehrende Tour-Vorlage speichern
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Abbrechen</Button></DialogClose>
                        <Button type="submit">Speichern</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function TransportVorbereitenPage() {
    const [transports, setTransports] = useState<Transport[]>(transportData.filter(t => t.status !== 'Abgeschlossen'));
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const addTransport = (transport: Transport) => {
        setTransports(prev => [transport, ...prev]);
    }

    const filteredTransports = useMemo(() => {
        if (!searchTerm) return transports;
        const lowercasedTerm = searchTerm.toLowerCase();
        return transports.filter(transport => 
            Object.values(transport).some(value => 
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [transports, searchTerm]);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
        } catch {
            return 'Ungültiges Datum';
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Transportaufträge vorbereiten</CardTitle>
                        <CardDescription>
                            Erstellen, planen und disponieren Sie neue Transportaufträge.
                        </CardDescription>
                    </div>
                    <AddTransportDialog onAdd={addTransport} />
                </div>
            </CardHeader>
            <div className="p-4 border-b border-t">
                 <Input 
                    placeholder="Aufträge durchsuchen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-md h-9"
                />
            </div>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Auftrags-Nr.</TableHead>
                            <TableHead>Kunde</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Abholung</TableHead>
                            <TableHead>Lieferung</TableHead>
                            <TableHead>Gepl. Lieferung</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransports.length > 0 ? (
                            filteredTransports.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.transportNumber}</TableCell>
                                    <TableCell>{t.customer}</TableCell>
                                    <TableCell>
                                        <Badge style={{ backgroundColor: statusColors[t.status] }} className="text-white">
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{t.pickupLocation}</TableCell>
                                    <TableCell>{t.deliveryLocation}</TableCell>
                                    <TableCell>{formatDate(t.plannedDeliveryDate)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Icons.more className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Bearbeiten & Disponieren</DropdownMenuItem>
                                                <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Stornieren</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Keine Aufträge in Vorbereitung.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
