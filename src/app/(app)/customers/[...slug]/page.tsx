
"use client";

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import type { Customer, Kontakt, Address } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";


// MOCK DATA - In a real app, this would be fetched from a database
const MOCK_CUSTOMERS: Customer[] = [{
    id: '1',
    firmenname: 'Musterfirma GmbH',
    kundennummer: 'KN-0001',
    ustId: 'DE123456789',
    steuernummer: '123/456/7890',
    firmenbuchnummer: 'HRB 12345',
    strasse: 'Musterstraße',
    hausnummer: '123',
    plz: '12345',
    ort: 'Musterstadt',
    land: 'DE',
    telefon: '01234-567890',
    fax: '01234-567891',
    email: 'info@musterfirma.de',
    website: 'www.musterfirma.de',
    zahlungsbedingungen: '30 Tage netto',
    zahlungsziel: 30,
    waehrung: 'EUR',
    kreditlimit: 10000,
    skontoProzent: 2,
    skontoTage: 14,
    bankname: 'Musterbank',
    iban: 'DE89370400440532013000',
    bic: 'COBADEFFXXX',
    kontoinhaber: 'Musterfirma GmbH',
    aktiv: true,
    bemerkung: 'Langjähriger Kunde.',
    erstelltAm: new Date().toISOString(),
    bearbeitetAm: new Date().toISOString(),
    name: 'Musterfirma GmbH',
    contact: 'info@musterfirma.de',
    address: 'Musterstraße 123, 12345 Musterstadt',
}];
const MOCK_SUPPLIERS: Customer[] = [{
    id: 'sup-1',
    firmenname: 'Bürobedarf-Express',
    kundennummer: 'LIEF-00001',
    ustId: 'DE999888777',
    steuernummer: '999/888/7777',
    firmenbuchnummer: 'HRA 11223',
    strasse: 'Lieferweg',
    hausnummer: '5A',
    plz: '10115',
    ort: 'Berlin',
    land: 'DE',
    telefon: '030-987654',
    fax: '030-987655',
    email: 'bestellung@buero-express.de',
    website: 'www.buero-express.de',
    zahlungsbedingungen: 'Vorkasse',
    zahlungsziel: 0,
    waehrung: 'EUR',
    kreditlimit: 0,
    skontoProzent: 0,
    skontoTage: 0,
    bankname: 'Hauptstadt Bank',
    iban: 'DE98765432109876543210',
    bic: 'BEVODEBBXXX',
    kontoinhaber: 'Bürobedarf-Express e.K.',
    aktiv: true,
    bemerkung: 'Liefert Büromaterial.',
    erstelltAm: new Date().toISOString(),
    bearbeitetAm: new Date().toISOString(),
    name: 'Bürobedarf-Express',
    contact: 'bestellung@buero-express.de',
    address: 'Lieferweg 5A, 10115 Berlin',
}];
const MOCK_SUBCONTRACTORS: Customer[] = [{
    id: 'sub-1',
    firmenname: 'Sub-Transport AG',
    kundennummer: 'SUB-001',
    ustId: 'DE111222333',
    steuernummer: '111/222/3333',
    firmenbuchnummer: 'HRB 99887',
    strasse: 'Subunternehmer-Allee',
    hausnummer: '10',
    plz: '20095',
    ort: 'Hamburg',
    land: 'DE',
    telefon: '040-123456',
    fax: '040-123457',
    email: 'info@sub-transport.de',
    website: 'www.sub-transport.de',
    zahlungsbedingungen: '45 Tage netto',
    zahlungsziel: 45,
    waehrung: 'EUR',
    kreditlimit: 25000,
    skontoProzent: 1.5,
    skontoTage: 10,
    bankname: 'Hafenbank',
    iban: 'DE12345678901234567891',
    bic: 'HASPDEHHXXX',
    kontoinhaber: 'Sub-Transport AG',
    aktiv: true,
    bemerkung: 'Spezialisiert auf Kühltransporte.',
    erstelltAm: new Date().toISOString(),
    bearbeitetAm: new Date().toISOString(),
    name: 'Sub-Transport AG',
    contact: 'info@sub-transport.de',
    address: 'Subunternehmer-Allee 10, 20095 Hamburg',
}];
const MOCK_KONTAKTE: Kontakt[] = [
    { id: '1', kundenId: '1', anrede: 'Herr', vorname: 'Max', nachname: 'Mustermann', position: 'Einkauf', telefon: '01234-567892', mobil: '0171-1234567', email: 'max.mustermann@musterfirma.de', bemerkung: 'Hauptansprechpartner' },
    { id: '2', kundenId: '1', anrede: 'Frau', vorname: 'Erika', nachname: 'Musterfrau', position: 'Geschäftsführung', telefon: '01234-567893', mobil: '0172-1234567', email: 'erika.musterfrau@musterfirma.de', bemerkung: '' }
];
const MOCK_ADDRESSES: Address[] = [
    { id: '1', kurzname: 'Zentrale BER', name: 'Hauptquartier Berlin', strasse: 'Willy-Brandt-Straße 1', plz: '10557', stadt: 'Berlin', land: 'Deutschland', koordinaten: '52.518, 13.376', tourPOI: true, kundenAdresse: false, mitarbeiterAdresse: false },
    { id: '2', kurzname: 'Lager MUC', name: 'Lager München', strasse: 'Lagerstraße 5', plz: '80995', stadt: 'München', land: 'Deutschland', koordinaten: '48.177, 11.455', tourPOI: true, kundenAdresse: true, mitarbeiterAdresse: false },
];

const KontaktenForm = ({ control, register }: { control: any, register: any }) => {
  const { fields, append, remove } = useFieldArray({ control, name: "kontakte" });
  const [searchTerm, setSearchTerm] = useState("");
  const watchedKontakte = useWatch({ control, name: 'kontakte' });

  const [columnVisibility, setColumnVisibility] = useState({
    anrede: true,
    vorname: true,
    nachname: true,
    position: true,
    email: true,
    telefon: true,
    mobil: false,
    bemerkung: false,
  });

  const columnLabels: Record<keyof typeof columnVisibility, string> = {
    anrede: "Anrede",
    vorname: "Vorname",
    nachname: "Nachname",
    position: "Position",
    email: "E-Mail",
    telefon: "Telefon",
    mobil: "Mobil",
    bemerkung: "Bemerkung",
  };

  const toggleColumn = (column: keyof typeof columnVisibility) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
  }

  const filteredFields = useMemo(() => {
    if (!searchTerm) return fields.map((field, index) => ({ ...field, originalIndex: index }));
    const lowercasedTerm = searchTerm.toLowerCase();

    return fields
      .map((field, index) => ({ ...field, originalIndex: index }))
      .filter((field, index) => {
        const kontakt = watchedKontakte[index];
        if (!kontakt) return false;
        return Object.values(kontakt).some(value =>
          String(value).toLowerCase().includes(lowercasedTerm)
        );
      });
  }, [searchTerm, fields, watchedKontakte]);

  return (
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Ansprechpartner</CardTitle>
                    <CardDescription>Zugeordnete Kontakte für diesen Kunden.</CardDescription>
                </div>
                <Button type="button" variant="link" onClick={() => append({ anrede: 'Herr', vorname: '', nachname: '', position: '', telefon: '', mobil: '', email: '', bemerkung: '' })}>
                    <Icons.add className="mr-2 h-4 w-4" /> Kontakt hinzufügen
                </Button>
            </div>
        </CardHeader>
        <div className="p-4 border-b flex justify-between items-center gap-4">
             <Input 
                placeholder="Kontakte durchsuchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-md h-9"
            />
            <div className="flex gap-2 items-center">
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
                                onCheckedChange={() => toggleColumn(key as keyof typeof columnVisibility)}
                            >
                                {columnLabels[key as keyof typeof columnVisibility]}
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
                        {columnVisibility.anrede && <TableHead>Anrede</TableHead>}
                        {columnVisibility.vorname && <TableHead>Vorname</TableHead>}
                        {columnVisibility.nachname && <TableHead>Nachname</TableHead>}
                        {columnVisibility.position && <TableHead>Position</TableHead>}
                        {columnVisibility.email && <TableHead>E-Mail</TableHead>}
                        {columnVisibility.telefon && <TableHead>Telefon</TableHead>}
                        {columnVisibility.mobil && <TableHead>Mobil</TableHead>}
                        {columnVisibility.bemerkung && <TableHead>Bemerkung</TableHead>}
                        <TableHead className="text-right">Aktion</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredFields.map((field) => (
                        <TableRow key={field.id}>
                            {columnVisibility.anrede && <TableCell className="w-24">
                                <Select defaultValue={field.anrede} onValueChange={(value) => console.log(value)}>
                                    <SelectTrigger {...register(`kontakte.${field.originalIndex}.anrede`)} className="h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Herr">Herr</SelectItem>
                                        <SelectItem value="Frau">Frau</SelectItem>
                                        <SelectItem value="Divers">Divers</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>}
                            {columnVisibility.vorname && <TableCell><Input {...register(`kontakte.${field.originalIndex}.vorname`)} className="h-9" /></TableCell>}
                            {columnVisibility.nachname && <TableCell><Input {...register(`kontakte.${field.originalIndex}.nachname`)} className="h-9" /></TableCell>}
                            {columnVisibility.position && <TableCell><Input {...register(`kontakte.${field.originalIndex}.position`)} className="h-9" /></TableCell>}
                            {columnVisibility.email && <TableCell><Input {...register(`kontakte.${field.originalIndex}.email`)} type="email" className="h-9" /></TableCell>}
                            {columnVisibility.telefon && <TableCell><Input {...register(`kontakte.${field.originalIndex}.telefon`)} className="h-9" /></TableCell>}
                            {columnVisibility.mobil && <TableCell><Input {...register(`kontakte.${field.originalIndex}.mobil`)} className="h-9" /></TableCell>}
                            {columnVisibility.bemerkung && <TableCell><Textarea {...register(`kontakte.${field.originalIndex}.bemerkung`)} className="h-9" /></TableCell>}
                            <TableCell className="text-right">
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(field.originalIndex)}>
                                    <Icons.logout className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                      {filteredFields.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="h-24 text-center">
                                {searchTerm ? "Keine Kontakte gefunden." : "Keine Kontakte für diesen Kunden."}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
  )
}

const LoadAddressDialog = ({ onSelectAddress }: { onSelectAddress: (address: Address) => void }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const filteredAddresses = useMemo(() => {
        if (!searchTerm) return MOCK_ADDRESSES;
        const lowercasedTerm = searchTerm.toLowerCase();
        return MOCK_ADDRESSES.filter(address => 
            Object.values(address).some(value => 
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [searchTerm]);

    const handleSelectAndConfirm = () => {
        if (selectedAddress) {
            onSelectAddress(selectedAddress);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" size="sm">Adresse laden</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Stammadresse laden</DialogTitle>
                    <DialogDescription>Suchen und wählen Sie eine Adresse aus den Stammdaten aus.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Input 
                        placeholder="Adresse suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9"
                    />
                    <div className="max-h-64 overflow-y-auto border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Straße</TableHead>
                                    <TableHead>Ort</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAddresses.map(address => (
                                    <TableRow key={address.id}>
                                        <TableCell>{address.name}</TableCell>
                                        <TableCell>{address.strasse}</TableCell>
                                        <TableCell>{address.plz} {address.stadt}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedAddress(address)}>Auswählen</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Adresse übernehmen?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Wollen Sie die Adresse für "{address.name}" wirklich übernehmen? Die aktuellen Adressfelder werden überschrieben.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                        <DialogClose asChild>
                                                            <AlertDialogAction onClick={handleSelectAndConfirm}>Übernehmen</AlertDialogAction>
                                                        </DialogClose>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const slug = params.slug as string[];

  const { entityType, id, isNew } = useMemo(() => {
    if (!slug) return { entityType: 'customer', id: '', isNew: false };
    
    if (slug.length === 1) { // /customers/new or /customers/[id]
        const idOrNew = slug[0];
        return {
            entityType: 'customer',
            id: idOrNew,
            isNew: idOrNew === 'new',
        };
    }
    
    if (slug.length === 2) { // /customers/suppliers/new or /customers/suppliers/[id]
        const [type, idOrNew] = slug;
        const entity = type === 'suppliers' ? 'supplier' : 'subcontractor';
        return {
            entityType: entity,
            id: idOrNew,
            isNew: idOrNew === 'new'
        }
    }
    
    return { entityType: 'customer', id: '', isNew: false };

  }, [slug]);

  const { data, allData, numberLabel, pageTitle, backUrl } = useMemo(() => {
    switch (entityType) {
      case 'supplier':
        return {
          data: isNew ? undefined : MOCK_SUPPLIERS.find(s => s.id === id),
          allData: MOCK_SUPPLIERS,
          numberLabel: 'Lieferantennummer',
          pageTitle: 'Lieferant',
          backUrl: '/customers/suppliers'
        };
      case 'subcontractor':
        return {
          data: isNew ? undefined : MOCK_SUBCONTRACTORS.find(s => s.id === id),
          allData: MOCK_SUBCONTRACTORS,
          numberLabel: 'Subunternehmernummer',
          pageTitle: 'Subunternehmer',
          backUrl: '/customers/subcontractors'
        };
      default: // customer
        return {
          data: isNew ? undefined : MOCK_CUSTOMERS.find(c => c.id === id),
          allData: MOCK_CUSTOMERS,
          numberLabel: 'Kundennummer',
          pageTitle: 'Kunde',
          backUrl: '/customers'
        };
    }
  }, [id, isNew, entityType]);

  const generateNextNumber = () => {
    let prefix = 'KN-';
    let padLength = 4;
    if (entityType === 'supplier') {
        prefix = 'LIEF-';
        padLength = 5;
    } else if (entityType === 'subcontractor') {
        prefix = 'SUB-';
        padLength = 3;
    }

    const highestNum = allData.reduce((max, item) => {
        const numPart = item.kundennummer.replace(prefix, '');
        const num = parseInt(numPart, 10);
        return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    
    return `${prefix}${(highestNum + 1).toString().padStart(padLength, '0')}`;
  };

  const customerData = useMemo(() => {
    if (isNew) {
      return {
          id: `new-${Date.now()}`,
          firmenname: '', kundennummer: generateNextNumber(), ustId: '', steuernummer: '', firmenbuchnummer: '',
          strasse: '', hausnummer: '', plz: '', ort: '', land: 'DE',
          telefon: '', fax: '', email: '', website: '',
          zahlungsbedingungen: '30 Tage netto', zahlungsziel: 30, waehrung: 'EUR', kreditlimit: 0, skontoProzent: 0, skontoTage: 0,
          bankname: '', iban: '', bic: '', kontoinhaber: '',
          aktiv: true, bemerkung: '', erstelltAm: new Date().toISOString(), bearbeitetAm: new Date().toISOString(),
          name: '', contact: '', address: ''
      };
    }
    return data;
  }, [id, isNew, data, entityType]);

  const kundenKontakte = useMemo(() => isNew ? [] : MOCK_KONTAKTE.filter(k => k.kundenId === id), [id, isNew]);

  const { register, handleSubmit, control, watch, formState: { errors, isDirty, isSubmitting }, setValue, getValues } = useForm<Customer & { kontakte: Kontakt[] }>({
    defaultValues: { ...customerData, kontakte: kundenKontakte },
  });

  if (!customerData) {
    return <div>{pageTitle} nicht gefunden.</div>;
  }

  const onSubmit = (data: any) => {
    console.log("Form data submitted:", data);
    toast({ title: "Gespeichert", description: `${pageTitle}daten erfolgreich aktualisiert.` });
    router.push(backUrl);
  };

  const handleSelectAddress = (address: Address) => {
    const streetParts = address.strasse.match(/(.+) (\S+)$/);
    const strasse = streetParts ? streetParts[1] : address.strasse;
    const hausnummer = streetParts ? streetParts[2] : '';
    
    setValue('strasse', strasse, { shouldDirty: true });
    setValue('hausnummer', hausnummer, { shouldDirty: true });
    setValue('plz', address.plz, { shouldDirty: true });
    setValue('ort', address.stadt, { shouldDirty: true });
    setValue('land', address.land, { shouldDirty: true });
    toast({ title: "Adresse geladen", description: `Die Adresse für "${address.name}" wurde in das Formular geladen.` });
  };
  
  const handleSaveAddress = () => {
    const values = getValues();
    const newAddress: Address = {
        id: `addr-${Date.now()}`,
        kurzname: values.firmenname.substring(0, 10),
        name: `${values.firmenname} - Hauptadresse`,
        strasse: `${values.strasse} ${values.hausnummer}`,
        plz: values.plz,
        stadt: values.ort,
        land: values.land,
        koordinaten: "",
        tourPOI: false,
        kundenAdresse: true,
        mitarbeiterAdresse: false
    };
    console.log("Saving address to master data:", newAddress);
    MOCK_ADDRESSES.push(newAddress);
    toast({ title: "Adresse gespeichert", description: "Die Adresse wurde zu den Stammdaten hinzugefügt."});
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{isNew ? `Neuen ${pageTitle} anlegen` : customerData.firmenname}</h1>
          <p className="text-muted-foreground">{isNew ? 'Bitte füllen Sie die Stammdaten aus.' : `${numberLabel}: ${customerData.kundennummer}`}</p>
        </div>
        <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={() => router.push(backUrl)}>Abbrechen</Button>
            <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Speichern
            </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader><CardTitle>Stammdaten</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1.5"><Label>Firmenname</Label><Input {...register("firmenname")} className="h-9"/></div>
                    <div className="space-y-1.5"><Label>{numberLabel}</Label><Input {...register("kundennummer")} className="h-9" readOnly /></div>
                    <div className="space-y-1.5"><Label>USt-IdNr.</Label><Input {...register("ustId")} className="h-9"/></div>
                    <div className="space-y-1.5"><Label>Steuernummer</Label><Input {...register("steuernummer")} className="h-9"/></div>
                    <div className="space-y-1.5"><Label>Handelsregisternr.</Label><Input {...register("firmenbuchnummer")} className="h-9"/></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Kontakt</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1.5"><Label>Telefon</Label><Input {...register("telefon")} className="h-9"/></div>
                    <div className="space-y-1.5"><Label>Fax</Label><Input {...register("fax")} className="h-9"/></div>
                    <div className="space-y-1.5"><Label>E-Mail</Label><Input {...register("email")} type="email" className="h-9"/></div>
                    <div className="space-y-1.5"><Label>Webseite</Label><Input {...register("website")} className="h-9"/></div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Sonstiges</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="aktiv" {...register("aktiv")} checked={watch("aktiv")} onCheckedChange={(checked) => setValue('aktiv', !!checked)} />
                        <Label htmlFor="aktiv" className="font-normal text-sm">{pageTitle} ist aktiv</Label>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Bemerkung</Label>
                        <Textarea {...register("bemerkung")} rows={4} />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Adresse</CardTitle>
                        <div className="flex items-center gap-2">
                            <LoadAddressDialog onSelectAddress={handleSelectAddress} />
                             <Button type="button" variant="link" size="sm" onClick={handleSaveAddress}>Adresse speichern</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-3 space-y-1.5"><Label>Straße</Label><Input {...register("strasse")} className="h-9"/></div>
                        <div className="col-span-1 space-y-1.5"><Label>Hausnr.</Label><Input {...register("hausnummer")} className="h-9"/></div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-1 space-y-1.5"><Label>PLZ</Label><Input {...register("plz")} className="h-9"/></div>
                        <div className="col-span-3 space-y-1.5"><Label>Ort</Label><Input {...register("ort")} className="h-9"/></div>
                    </div>
                     <div className="space-y-1.5"><Label>Land</Label><Input {...register("land")} className="h-9"/></div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Finanzen</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1.5"><Label>Zahlungsbedingungen</Label><Input {...register("zahlungsbedingungen")} className="h-9"/></div>
                         <div className="space-y-1.5"><Label>Währung</Label><Input {...register("waehrung")} className="h-9"/></div>
                    </div>
                     <div className="grid grid-cols-4 gap-3">
                        <div className="space-y-1.5"><Label>Zahlungsziel (Tage)</Label><Input {...register("zahlungsziel", { valueAsNumber: true })} type="number" className="h-9"/></div>
                        <div className="space-y-1.5"><Label>Skonto (%)</Label><Input {...register("skontoProzent", { valueAsNumber: true })} type="number" step="0.01" className="h-9"/></div>
                        <div className="space-y-1.5"><Label>Skonto (Tage)</Label><Input {...register("skontoTage", { valueAsNumber: true })} type="number" className="h-9"/></div>
                         <div className="space-y-1.5"><Label>Kreditlimit</Label><Input {...register("kreditlimit", { valueAsNumber: true })} type="number" step="0.01" className="h-9"/></div>
                    </div>
                     <Separator className="my-4"/>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>Bankname</Label><Input {...register("bankname")} className="h-9"/></div>
                        <div className="space-y-1.5"><Label>Kontoinhaber</Label><Input {...register("kontoinhaber")} className="h-9"/></div>
                    </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>IBAN</Label><Input {...register("iban")} className="h-9"/></div>
                        <div className="space-y-1.5"><Label>BIC</Label><Input {...register("bic")} className="h-9"/></div>
                    </div>
                </CardContent>
            </Card>

            {!isNew && <KontaktenForm control={control} register={register} />}
        </div>
      </div>
    </form>
  );
}
