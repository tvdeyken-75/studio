

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
import { SlidersHorizontal, FileDown, Trash2, Send, CodeXml } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { customerData, transportData, dieselpreiseData } from "@/lib/data";
import { format, getYear, parseISO, isValid } from "date-fns";
import { de } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";


// MOCK DATA - In a real app, this would be fetched from a database
const initialInvoices: Invoice[] = [
    {
        id: '1',
        rechnungsnummer: 'RN-000001',
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
        rechnungsnummer: 'RN-000002',
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

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Ungültiges Datum';
    try {
        return format(date, 'dd.MM.yyyy');
    } catch {
        return 'Ungültiges Datum';
    }
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}


const AddLeistungDialog = ({ onAddItem }: { onAddItem: (item: InvoiceItem) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [beschreibung, setBeschreibung] = useState('');
    const [nettopreis, setNettopreis] = useState(0);
    const [datum, setDatum] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handleSave = () => {
        if (!beschreibung || nettopreis === 0) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte geben Sie eine Beschreibung und einen Preis ein.' });
            return;
        }
        onAddItem({
            id: `item-leistung-${Date.now()}`,
            beschreibung,
            menge: 1,
            einheit: 'Leistung',
            einzelpreis: nettopreis,
            gesamtpreis: nettopreis,
            datum
        });
        setIsOpen(false);
        setBeschreibung('');
        setNettopreis(0);
        setDatum(format(new Date(), 'yyyy-MM-dd'));
        toast({ title: 'Position hinzugefügt.' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Icons.add className="mr-2 h-3 w-3" />
                    Leistungsposition
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Leistungsposition hinzufügen</DialogTitle>
                    <DialogDescription>
                        Fügen Sie eine abrechenbare Leistung zur Rechnung hinzu.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="space-y-1.5">
                        <Label htmlFor="datum">Datum</Label>
                        <Input id="datum" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="beschreibung">Beschreibung</Label>
                        <Textarea id="beschreibung" value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} placeholder="z.B. Sonderfahrt" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="nettopreis">Nettopreis (€)</Label>
                        <Input id="nettopreis" type="number" step="0.01" value={nettopreis} onChange={(e) => setNettopreis(parseFloat(e.target.value) || 0)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Abbrechen</Button>
                    <Button size="sm" onClick={handleSave}>Hinzufügen</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const AddInfoDialog = ({ onAddItem }: { onAddItem: (item: InvoiceItem) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [beschreibung, setBeschreibung] = useState('');

    const handleSave = () => {
        if (!beschreibung) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte geben Sie eine Beschreibung ein.' });
            return;
        }
        onAddItem({
            id: `item-info-${Date.now()}`,
            beschreibung,
            menge: 1,
            einheit: 'Info',
            einzelpreis: 0,
            gesamtpreis: 0,
            datum: format(new Date(), 'yyyy-MM-dd')
        });
        setIsOpen(false);
        setBeschreibung('');
        toast({ title: 'Position hinzugefügt.' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Icons.add className="mr-2 h-3 w-3" />
                    Info-Position
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Informationsposition hinzufügen</DialogTitle>
                    <DialogDescription>
                        Fügen Sie eine nicht-abrechenbare Information zur Rechnung hinzu.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="beschreibung">Beschreibung</Label>
                        <Textarea id="beschreibung" value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} placeholder="z.B. Wichtiger Hinweis für den Kunden" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Abbrechen</Button>
                    <Button size="sm" onClick={handleSave}>Hinzufügen</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const CreateInvoiceDialog = ({ onSave, lastInvoiceNumber, invoiceToEdit, children, mode = 'create' }: { onSave: (invoice: Invoice) => void, lastInvoiceNumber: string, invoiceToEdit?: Invoice | null, children: React.ReactNode, mode?: 'create' | 'edit' | 'view' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const isEditOrViewMode = mode === 'edit' || mode === 'view';
    const isViewMode = mode === 'view';

    const { register, handleSubmit, control, watch, setValue, getValues, reset } = useForm<Invoice>();

    const { fields, append, remove, update } = useFieldArray({ control, name: "items" });
    const watchedItems = watch('items');
    const watchedKundenId = watch('kundenId');
    
    const [availableTours, setAvailableTours] = useState<Transport[]>([]);
    const [selectedTourId, setSelectedTourId] = useState<string>('');

     useEffect(() => {
        if (isOpen) {
            const defaultValues = isEditOrViewMode && invoiceToEdit ? 
                {...invoiceToEdit} : 
                {
                    id: `inv-${Date.now()}`,
                    rechnungsnummer: generateNewInvoiceNumber(),
                    rechnungsdatum: format(new Date(), 'yyyy-MM-dd'),
                    status: 'Entwurf',
                    waehrung: 'EUR',
                    items: [],
                };
            reset(defaultValues);
        }
    }, [isOpen, invoiceToEdit, reset, isEditOrViewMode]);

    useEffect(() => {
        if (watchedKundenId) {
            const customer = customerData.find(c => c.id === watchedKundenId);
            const customerTours = transportData.filter(t => t.customer === customer?.firmenname && t.status === 'Abgeschlossen');
            setAvailableTours(customerTours);
            if (mode === 'create') {
                setSelectedTourId('');
                setValue('items', []);
            }
        } else {
            setAvailableTours([]);
            if (mode === 'create') {
                setSelectedTourId('');
                setValue('items', []);
            }
        }
    }, [watchedKundenId, setValue, mode]);

    const calculateTotal = () => {
        return watchedItems?.reduce((total, item) => total + (item.gesamtpreis || 0), 0) || 0;
    }
    
    const generateNewInvoiceNumber = () => {
        const [prefix, numPart] = lastInvoiceNumber.split('-');
        const nextNum = parseInt(numPart, 10) + 1;
        return `${prefix}-${String(nextNum).padStart(6, '0')}`;
    };

    const onSubmit = (data: Invoice) => {
        if (isViewMode) return setIsOpen(false);

        if (!data.kundenId) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte wählen Sie einen Kunden aus.' });
            return;
        }
         if (data.items.length === 0) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Die Rechnung muss mindestens eine Position enthalten.' });
            return;
        }

        const finalData = { 
            ...data, 
            betrag: calculateTotal(),
            rechnungsnummer: data.rechnungsnummer || generateNewInvoiceNumber(),
            kundenName: customerData.find(c => c.id === data.kundenId)?.firmenname || ''
        };
        onSave(finalData);
        toast({ title: 'Erfolg', description: `Rechnung ${finalData.rechnungsnummer} wurde ${isEditOrViewMode ? 'aktualisiert' : 'erstellt'}.` });
        setIsOpen(false);
    };
    
    const handleTourSelection = (tourId: string) => {
        const tour = availableTours.find(t => t.id === tourId);
        if (!tour) return;
        
        setSelectedTourId(tourId);

        const newItems: InvoiceItem[] = [];
        const basePrice = 1250.00; 

        newItems.push({
            id: `item-${Date.now()}-tour`,
            beschreibung: `Transport ${tour.pickupLocation} - ${tour.deliveryLocation} (${tour.transportNumber})`,
            menge: 1, einheit: 'Tour', einzelpreis: basePrice, gesamtpreis: basePrice,
            datum: tour.actualDeliveryDate
        });
        
        const lastDieselpreis = dieselpreiseData.sort((a,b) => new Date(b.von).getTime() - new Date(a.von).getTime())[0];
        if (lastDieselpreis) {
            const zuschlag = basePrice * (lastDieselpreis.zuschlag / 100);
            newItems.push({
                id: `item-${Date.now()}-diesel`,
                beschreibung: `Dieselfloaterzuschlag (${lastDieselpreis.woche}: ${lastDieselpreis.zuschlag.toFixed(2)}%)`,
                menge: 1, einheit: '%', einzelpreis: zuschlag, gesamtpreis: zuschlag,
                datum: tour.actualDeliveryDate
            });
        }
        
        const kunde = customerData.find(c => c.id === watchedKundenId);
        if (kunde && kunde.mautzuschlag > 0) {
            const zuschlag = basePrice * (kunde.mautzuschlag / 100);
            newItems.push({
                id: `item-${Date.now()}-maut`,
                beschreibung: `Mautzuschlag (${kunde.mautzuschlag}%)`,
                menge: 1, einheit: '%', einzelpreis: zuschlag, gesamtpreis: zuschlag,
                datum: tour.actualDeliveryDate
            });
        }
        
        setValue('items', newItems);
    }
    
    const addItem = (item: InvoiceItem) => {
        append(item);
    }

    const titleMap = {
        create: 'Neue Rechnung erstellen',
        edit: `Rechnung ${invoiceToEdit?.rechnungsnummer} bearbeiten`,
        view: `Rechnung ${invoiceToEdit?.rechnungsnummer} anzeigen`
    };

    const descriptionMap = {
        create: 'Füllen Sie die Details aus und fügen Sie Rechnungspositionen hinzu.',
        edit: 'Bearbeiten Sie die Rechnungsdetails.',
        view: 'Details der Rechnung.'
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{titleMap[mode]}</DialogTitle>
                        <DialogDescription>{descriptionMap[mode]}</DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label>Kunde</Label>
                                <Controller
                                    name="kundenId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isViewMode}>
                                            <SelectTrigger className="h-9"><SelectValue placeholder="Kunde auswählen" /></SelectTrigger>
                                            <SelectContent>{customerData.map(c => <SelectItem key={c.id} value={c.id}>{c.firmenname}</SelectItem>)}</SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Rechnungsdatum</Label>
                                <Input type="date" {...register('rechnungsdatum')} className="h-9" readOnly={isViewMode}/>
                            </div>
                             <div className="space-y-1.5">
                                <Label>Fälligkeitsdatum</Label>
                                <Input type="date" {...register('faelligkeitsdatum')} className="h-9" readOnly={isViewMode}/>
                            </div>
                        </div>

                         {mode === 'create' && (
                            <div className="space-y-1.5">
                                <Label>Abgeschlossenen Transportauftrag auswählen (Optional)</Label>
                                <Select onValueChange={handleTourSelection} value={selectedTourId} disabled={!watchedKundenId || availableTours.length === 0}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder={!watchedKundenId ? "Bitte zuerst Kunde auswählen" : (availableTours.length > 0 ? "Transportauftrag auswählen" : "Keine abgeschlossenen Aufträge für diesen Kunden")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTours.map(t => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.transportNumber}: {t.pickupLocation} nach {t.deliveryLocation} am {format(new Date(t.actualDeliveryDate), 'dd.MM.yyyy')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                         )}

                        <div className="space-y-2 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Rechnungspositionen</Label>
                                {!isViewMode && (
                                    <div className="flex items-center gap-2">
                                        <AddLeistungDialog onAddItem={addItem} />
                                        <AddInfoDialog onAddItem={addItem} />
                                    </div>
                                )}
                            </div>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-40">Datum</TableHead>
                                        <TableHead>Beschreibung</TableHead>
                                        <TableHead className="w-48 text-right">Nettopreis (€)</TableHead>
                                        {!isViewMode && <TableHead className="w-12"></TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                 <Controller
                                                    control={control}
                                                    name={`items.${index}.datum`}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Input 
                                                            type="date" 
                                                            value={value ? format(parseISO(value), 'yyyy-MM-dd') : ''}
                                                            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
                                                            className="h-9 text-sm"
                                                            readOnly={isViewMode}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                  control={control}
                                                  name={`items.${index}.beschreibung`}
                                                  render={({ field }) => (
                                                    <Textarea {...field} className="h-9 text-sm" readOnly={isViewMode}/>
                                                  )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                               <Controller
                                                    control={control}
                                                    name={`items.${index}.gesamtpreis`}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={value}
                                                            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                                                            className="h-9 text-right text-sm"
                                                            readOnly={isViewMode}
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            {!isViewMode && (
                                                <TableCell className="text-right">
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                     {(fields.length === 0 || !fields) && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                Bitte wählen Sie einen Transportauftrag aus oder fügen Sie manuell Positionen hinzu.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
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
                         <DialogClose asChild><Button type="button" variant="ghost">Schließen</Button></DialogClose>
                        {!isViewMode && <Button type="submit">Rechnung speichern</Button>}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const InvoiceDetailDialog = ({ invoice, onAction }: { invoice: Invoice, onAction: (action: string) => void }) => {
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const printWindow = window.open('', '', 'height=800,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Rechnung</title>');
                printWindow.document.write('<style>body{font-family:sans-serif; padding: 20px;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ddd; padding:8px;} th{background-color:#f2f2f2;} .text-right{text-align:right;} .mt-4{margin-top:1.5rem;} .font-bold{font-weight:bold;}</style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
            }
        }
    };
    
    const total = invoice.betrag;
    const vat = total * 0.19;
    const gross = total + vat;

    return (
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>Rechnungsdetails: {invoice.rechnungsnummer}</DialogTitle>
                 <DialogDescription>
                    Hier können Sie die Rechnungsdetails einsehen und weitere Aktionen ausführen.
                </DialogDescription>
            </DialogHeader>
            <div ref={printRef} className="py-4 max-h-[60vh] overflow-y-auto pr-4 text-sm">
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <h3 className="font-bold text-lg">AmbientTMS</h3>
                        <p>Musterstraße 1, 12345 Musterstadt</p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-bold text-xl">RECHNUNG</h2>
                        <p>Nr: {invoice.rechnungsnummer}</p>
                        <p>Datum: {formatDate(invoice.rechnungsdatum)}</p>
                    </div>
                </div>
                 <div className="mb-8">
                    <p className="font-bold">{invoice.kundenName}</p>
                    <p>{customerData.find(c => c.id === invoice.kundenId)?.strasse} {customerData.find(c => c.id === invoice.kundenId)?.hausnummer}</p>
                    <p>{customerData.find(c => c.id === invoice.kundenId)?.plz} {customerData.find(c => c.id === invoice.kundenId)?.ort}</p>
                 </div>
                 <table>
                     <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Beschreibung</th>
                            <th className="text-right">Betrag</th>
                        </tr>
                     </thead>
                     <tbody>
                        {invoice.items.map(item => (
                            <tr key={item.id}>
                                <td>{item.datum ? formatDate(item.datum) : 'N/A'}</td>
                                <td>{item.beschreibung}</td>
                                <td className="text-right">{formatCurrency(item.gesamtpreis)}</td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
                 <div className="flex justify-end mt-4">
                    <div className="w-1/2 space-y-2">
                        <div className="flex justify-between"><span>Zwischensumme</span><span>{formatCurrency(total)}</span></div>
                        <div className="flex justify-between"><span>MwSt. (19%)</span><span>{formatCurrency(vat)}</span></div>
                        <div className="flex justify-between font-bold text-lg"><span>Gesamtbetrag</span><span>{formatCurrency(gross)}</span></div>
                    </div>
                 </div>
                 <p className="mt-8">Fällig am: {formatDate(invoice.faelligkeitsdatum)}</p>
            </div>
            <DialogFooter className="justify-start">
                 <Button onClick={handlePrint}><FileDown className="mr-2 h-4 w-4" /> Als PDF drucken/speichern</Button>
                 <Button onClick={() => onAction('email')} variant="outline"><Send className="mr-2 h-4 w-4" /> Per E-Mail senden</Button>
                 <Button onClick={() => onAction('xml')} variant="outline"><CodeXml className="mr-2 h-4 w-4" /> Als E-Rechnung (XML) exportieren</Button>
                 <div className="flex-grow"></div>
                 <DialogClose asChild><Button variant="ghost">Schließen</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};


export default function BuchhaltungPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'cancel'>('view');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState({
      rechnungsnummer: true,
      kundenName: true,
      rechnungsdatum: true,
      faelligkeitsdatum: true,
      betrag: true,
      status: true,
  });

  const addOrUpdateInvoice = (invoice: Invoice) => {
    setInvoices(prev => {
        const index = prev.findIndex(i => i.id === invoice.id);
        if (index > -1) {
            const newInvoices = [...prev];
            newInvoices[index] = invoice;
            return newInvoices;
        }
        return [invoice, ...prev];
    })
  }

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? {...inv, status} : inv));
    toast({ title: "Status aktualisiert", description: `Rechnung wurde als "${status}" markiert.` });
  }

  const handleAction = (invoice: Invoice, action: 'view' | 'edit' | 'cancel' | 'markPaid') => {
      setSelectedInvoice(invoice);
      if(action === 'markPaid') {
          updateInvoiceStatus(invoice.id, 'Bezahlt');
          return;
      }
      setDialogMode(action);
      setIsDialogOpen(true);
  }

  const handleDetailAction = (action: string) => {
    toast({
        title: "Funktion in Entwicklung",
        description: `Die Aktion "${action}" wird in Kürze implementiert.`,
    });
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
    if (invoices.length === 0) return 'RN-000000';
    return invoices.reduce((latest, inv) => {
      const latestNum = parseInt(latest.split('-')[1], 10);
      const invNum = parseInt(inv.rechnungsnummer.split('-')[1], 10);
      return invNum > latestNum ? inv.rechnungsnummer : latest;
    }, 'RN-000000');
  }, [invoices]);

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Rechnungen</CardTitle>
                <CardDescription>
                    Verwalten Sie Rechnungen, E-Rechnungen, Stornierungen und Mahnungen.
                </CardDescription>
            </div>
             <CreateInvoiceDialog onSave={addOrUpdateInvoice} lastInvoiceNumber={lastInvoiceNumber} mode="create">
                <Button variant="link" className="text-primary">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neue Rechnung
                </Button>
            </CreateInvoiceDialog>
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
                  {columnVisibility.rechnungsdatum && <TableCell>{formatDate(invoice.rechnungsdatum)}</TableCell>}
                  {columnVisibility.faelligkeitsdatum && <TableCell>{formatDate(invoice.faelligkeitsdatum)}</TableCell>}
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
                            <DropdownMenuItem onSelect={() => handleAction(invoice, 'view')}>Anzeigen</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleAction(invoice, 'edit')}>Bearbeiten</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleAction(invoice, 'markPaid')} disabled={invoice.status === 'Bezahlt'}>Als bezahlt markieren</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onSelect={() => handleAction(invoice, 'cancel')}>Stornieren</DropdownMenuItem>
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
    
    <Dialog open={isDialogOpen && dialogMode === 'edit'} onOpenChange={setIsDialogOpen}>
        <CreateInvoiceDialog onSave={addOrUpdateInvoice} lastInvoiceNumber={lastInvoiceNumber} invoiceToEdit={selectedInvoice} mode='edit'>
            <span />
        </CreateInvoiceDialog>
    </Dialog>

    <Dialog open={isDialogOpen && dialogMode === 'view'} onOpenChange={setIsDialogOpen}>
        {selectedInvoice && <InvoiceDetailDialog invoice={selectedInvoice} onAction={handleDetailAction} />}
    </Dialog>
    
    <AlertDialog open={isDialogOpen && dialogMode === 'cancel'} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Möchten Sie diese Rechnung wirklich stornieren?</AlertDialogTitle>
                <AlertDialogDescription>
                    Diese Aktion kann nicht rückgängig gemacht werden. Die Rechnung
                    wird als "Storniert" markiert.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                    if(selectedInvoice) updateInvoiceStatus(selectedInvoice.id, 'Storniert');
                    setIsDialogOpen(false);
                }}>
                    Stornieren
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
