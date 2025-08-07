
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Customer, Invoice, InvoiceItem, Transport, Dieselpreis } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SlidersHorizontal, FileDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { customerData, transportData, dieselpreiseData } from "@/lib/data";
import { format, getYear, parseISO } from "date-fns";
import { de } from 'date-fns/locale';
import { cn } from "@/lib/utils";

// MOCK DATA - In a real app, this would be fetched from a database
const initialInvoices: Invoice[] = [
    {
        id: '1',
        rechnungsnummer: 'RN-000001-2024',
        kundenId: '1',
        kundenName: 'Musterfirma GmbH',
        rechnungsdatum: '2024-07-28',
        faelligkeitsdatum: '2024-08-27',
        status: 'Offen',
        betrag: 1500.00,
        waehrung: 'EUR',
        items: [{ id: 'item1', beschreibung: 'Transport Berlin-Hamburg', menge: 1, einheit: 'Stück', einzelpreis: 1200, gesamtpreis: 1200, datum: '2024-07-25' }],
    },
    {
        id: '2',
        rechnungsnummer: 'RN-000002-2024',
        kundenId: '2',
        kundenName: 'Bau AG',
        rechnungsdatum: '2024-07-29',
        faelligkeitsdatum: '2024-08-12',
        status: 'Bezahlt',
        betrag: 2500.50,
        waehrung: 'EUR',
        items: [{ id: 'item1', beschreibung: 'Schwertransport München-Frankfurt', menge: 1, einheit: 'Stück', einzelpreis: 2500.50, gesamtpreis: 2500.50, datum: '2024-07-26' }],
    }
];

type ColumnKeys = keyof Invoice | 'aktionen';

const columnLabels: Record<ColumnKeys, string> = {
    rechnungsnummer: "Rechnungs-Nr.",
    kundenName: "Kunde",
    rechnungsdatum: "Rechnungsdatum",
    faelligkeitsdatum: "Fälligkeitsdatum",
    betrag: "Betrag",
    status: "Status",
    id: "ID",
    kundenId: "Kunden-ID",
    waehrung: "Währung",
    items: "Positionen",
    aktionen: "Aktionen",
};

const statusVariant: Record<Invoice['status'], "default" | "destructive" | "secondary" | "outline"> = {
    'Entwurf': 'secondary',
    'Offen': 'default',
    'Bezahlt': 'outline',
    'Storniert': 'destructive',
    'Überfällig': 'destructive'
};

const statusColor: Record<Invoice['status'], string> = {
    'Entwurf': '',
    'Offen': 'bg-blue-600',
    'Bezahlt': 'bg-green-600',
    'Storniert': '',
    'Überfällig': 'bg-orange-600'
}


const CreateInvoiceDialog = ({ onAddInvoice, lastInvoiceNumber }: { onAddInvoice: (invoice: Invoice) => void, lastInvoiceNumber: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const { register, handleSubmit, control, watch, setValue, getValues } = useForm<Invoice>({
        defaultValues: {
            id: `inv-${Date.now()}`,
            rechnungsdatum: format(new Date(), 'yyyy-MM-dd'),
            status: 'Entwurf',
            waehrung: 'EUR',
            items: [],
        }
    });
    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const watchedItems = watch('items');
    const watchedKundenId = watch('kundenId');

    const calculateTotal = () => {
        return watchedItems.reduce((total, item) => total + (item.gesamtpreis || 0), 0);
    }
    
    const generateNewInvoiceNumber = () => {
        const year = getYear(new Date(getValues('rechnungsdatum')));
        const [prefix, numPart, yearPart] = lastInvoiceNumber.split('-');
        let nextNum = 1;
        if (parseInt(yearPart) === year) {
            nextNum = parseInt(numPart) + 1;
        }
        return `${prefix}-${String(nextNum).padStart(6, '0')}-${year}`;
    }

    const onSubmit = (data: Invoice) => {
        if (!data.kundenId || data.items.length === 0) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte wählen Sie einen Kunden und fügen Sie mindestens eine Position hinzu.' });
            return;
        }

        const finalData = { 
            ...data, 
            betrag: calculateTotal(),
            rechnungsnummer: generateNewInvoiceNumber(),
            kundenName: customerData.find(c => c.id === data.kundenId)?.firmenname || ''
        };
        onAddInvoice(finalData);
        toast({ title: 'Erfolg', description: `Rechnung ${finalData.rechnungsnummer} wurde erstellt.` });
        setIsOpen(false);
    };

    const handleAddPosition = () => {
        // This is a simplified version. A real app might have more complex logic to get tours.
        const tourNettoPreis = 1250.00; // Example price
        const tourId = transportData[0].id;
        const tourBeschreibung = `Transport ${transportData[0].pickupLocation} - ${transportData[0].deliveryLocation}`;

        append({
            id: `item-${Date.now()}`,
            beschreibung: tourBeschreibung,
            menge: 1,
            einheit: 'Tour',
            einzelpreis: tourNettoPreis,
            gesamtpreis: tourNettoPreis,
            datum: transportData[0].actualDeliveryDate,
        });

        // Add Dieselfloaterzuschlag
        const lastDieselpreis = dieselpreiseData.sort((a,b) => new Date(b.von).getTime() - new Date(a.von).getTime())[0];
        if (lastDieselpreis) {
            const zuschlag = tourNettoPreis * (lastDieselpreis.zuschlag / 100);
            append({
                id: `item-${Date.now()}-diesel`,
                beschreibung: `Dieselfloaterzuschlag (${lastDieselpreis.woche}: ${lastDieselpreis.zuschlag}%)`,
                menge: 1, einheit: '%', einzelpreis: zuschlag, gesamtpreis: zuschlag, datum: transportData[0].actualDeliveryDate
            });
        }

        // Add Mautzuschlag
        const kunde = customerData.find(c => c.id === watchedKundenId);
        if (kunde && kunde.mautzuschlag > 0) {
            const zuschlag = tourNettoPreis * (kunde.mautzuschlag / 100);
             append({
                id: `item-${Date.now()}-maut`,
                beschreibung: `Mautzuschlag (${kunde.mautzuschlag}%)`,
                menge: 1, einheit: '%', einzelpreis: zuschlag, gesamtpreis: zuschlag, datum: transportData[0].actualDeliveryDate
            });
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-primary">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neue Rechnung
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Neue Rechnung erstellen</DialogTitle>
                        <DialogDescription>
                            Füllen Sie die Details aus und fügen Sie Rechnungspositionen hinzu.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-4">
                        {/* Header Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label>Kunde</Label>
                                <Select onValueChange={(val) => setValue('kundenId', val, { shouldValidate: true })} >
                                     <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Kunde auswählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customerData.map(c => <SelectItem key={c.id} value={c.id}>{c.firmenname}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Rechnungsdatum</Label>
                                <Input type="date" {...register('rechnungsdatum')} className="h-9"/>
                            </div>
                             <div className="space-y-1.5">
                                <Label>Fälligkeitsdatum</Label>
                                <Input type="date" {...register('faelligkeitsdatum')} className="h-9"/>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-2 pt-4">
                            <Label>Rechnungspositionen</Label>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-20">Datum</TableHead>
                                        <TableHead className="w-3/5">Beschreibung</TableHead>
                                        <TableHead>Nettopreis (€)</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell className="text-sm text-muted-foreground">{field.datum ? format(parseISO(field.datum), 'dd.MM.yyyy') : ''}</TableCell>
                                            <TableCell>
                                                 <Controller
                                                    control={control}
                                                    name={`items.${index}.beschreibung`}
                                                    render={({ field }) => <Textarea {...field} placeholder="Leistungsbeschreibung" className="min-h-0 h-9"/>}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    control={control}
                                                    name={`items.${index}.gesamtpreis`}
                                                    render={({ field }) => <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-9"/>}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Icons.logout className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             <Button type="button" variant="link" size="sm" onClick={handleAddPosition} disabled={!watchedKundenId}>
                                <Icons.add className="mr-2 h-4 w-4" /> Position hinzufügen
                            </Button>
                        </div>
                        
                        {/* Footer Section */}
                        <div className="flex justify-end pt-4">
                            <div className="w-1/3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Zwischensumme</span>
                                    <span>{calculateTotal().toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">MwSt. (19%)</span>
                                    <span>{(calculateTotal() * 0.19).toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Gesamtbetrag</span>
                                    <span>{(calculateTotal() * 1.19).toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <DialogFooter className="pt-4">
                         <DialogClose asChild><Button type="button" variant="ghost">Abbrechen</Button></DialogClose>
                        <Button type="submit">Rechnung erstellen</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function BuchhaltungPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [columnVisibility, setColumnVisibility] = useState({
      rechnungsnummer: true,
      kundenName: true,
      rechnungsdatum: true,
      faelligkeitsdatum: true,
      betrag: true,
      status: true,
  });

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  }

  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;
    const lowercasedTerm = searchTerm.toLowerCase();
    return invoices.filter(invoice => 
      invoice.rechnungsnummer.toLowerCase().includes(lowercasedTerm) ||
      invoice.kundenName.toLowerCase().includes(lowercasedTerm) ||
      invoice.status.toLowerCase().includes(lowercasedTerm)
    );
  }, [invoices, searchTerm]);
  
  const lastInvoiceNumber = useMemo(() => {
    if (invoices.length === 0) return 'RN-000000-2024';
    return invoices.reduce((latest, inv) => {
        const latestYear = parseInt(latest.split('-')[2]);
        const invYear = parseInt(inv.rechnungsnummer.split('-')[2]);
        if (invYear > latestYear) return inv.rechnungsnummer;
        if (invYear < latestYear) return latest;
        
        const latestNum = parseInt(latest.split('-')[1]);
        const invNum = parseInt(inv.rechnungsnummer.split('-')[1]);
        return invNum > latestNum ? inv.rechnungsnummer : latest;
    }, 'RN-000000-2024');
  }, [invoices]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Rechnungen</CardTitle>
                <CardDescription>
                    Verwalten Sie Rechnungen, E-Rechnungen, Stornierungen und Mahnungen.
                </CardDescription>
            </div>
             <CreateInvoiceDialog onAddInvoice={addInvoice} lastInvoiceNumber={lastInvoiceNumber} />
        </div>
      </CardHeader>
        <div className="p-4 border-b border-t flex justify-between items-center gap-4">
             <Input 
                placeholder="Rechnungen durchsuchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-md h-9"
            />
            <div className="flex gap-2 items-center">
                <Button variant="link" size="sm" onClick={() => toast({title: "Info", description: "Export-Funktion wird in Kürze implementiert."})}>
                    <FileDown className="mr-2 h-4 w-4" /> Exportieren
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <SlidersHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuLabel>Spalten ein-/ausblenden</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                        {Object.keys(columnVisibility).map(key => (
                            <DropdownMenuCheckboxItem
                                key={key}
                                className="capitalize"
                                checked={columnVisibility[key as keyof typeof columnVisibility]}
                                onCheckedChange={() => setColumnVisibility(prev => ({...prev, [key]: !prev[key as keyof typeof columnVisibility]}))}
                            >
                                {columnLabels[key as keyof Invoice]}
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
              {columnVisibility.rechnungsnummer && <TableHead>Rechnungs-Nr.</TableHead>}
              {columnVisibility.kundenName && <TableHead>Kunde</TableHead>}
              {columnVisibility.rechnungsdatum && <TableHead>Rechnungsdatum</TableHead>}
              {columnVisibility.faelligkeitsdatum && <TableHead>Fälligkeit</TableHead>}
              {columnVisibility.betrag && <TableHead className="text-right">Betrag</TableHead>}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  {columnVisibility.rechnungsnummer && <TableCell className="font-medium">{invoice.rechnungsnummer}</TableCell>}
                  {columnVisibility.kundenName && <TableCell>{invoice.kundenName}</TableCell>}
                  {columnVisibility.rechnungsdatum && <TableCell>{format(new Date(invoice.rechnungsdatum), 'dd.MM.yyyy')}</TableCell>}
                  {columnVisibility.faelligkeitsdatum && <TableCell>{format(new Date(invoice.faelligkeitsdatum), 'dd.MM.yyyy')}</TableCell>}
                  {columnVisibility.betrag && <TableCell className="text-right">{formatCurrency(invoice.betrag)}</TableCell>}
                  {columnVisibility.status && <TableCell>
                    <Badge variant={statusVariant[invoice.status]} className={cn('text-white', statusColor[invoice.status])}>
                        {invoice.status}
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
                            <DropdownMenuItem>Anzeigen</DropdownMenuItem>
                            <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                            <DropdownMenuItem>Als PDF exportieren</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Als bezahlt markieren</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Stornieren</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="h-24 text-center">
                  Keine Rechnungen gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
