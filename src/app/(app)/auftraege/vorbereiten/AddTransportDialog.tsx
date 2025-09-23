
"use client";

import { useState } from 'react';
import type { Transport } from '@/types';
import { customerData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useForm, Controller } from 'react-hook-form';

export const AddTransportDialog = ({ onAdd, trigger }: { onAdd: (transport: Transport) => void, trigger: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Partial<Transport>>({
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
                {trigger}
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
