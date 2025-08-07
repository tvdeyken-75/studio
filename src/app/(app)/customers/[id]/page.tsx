
"use client";

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from "react-hook-form";
import type { Customer, Kontakt } from '@/types';
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
} from "@/components/ui/dialog";

// MOCK DATA - In a real app, this would be fetched from a database
const MOCK_CUSTOMERS: Customer[] = [{
    id: '1',
    firmenname: 'Musterfirma GmbH',
    kundennummer: 'KD-12345',
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
const MOCK_KONTAKTE: Kontakt[] = [
    { id: '1', kundenId: '1', anrede: 'Herr', vorname: 'Max', nachname: 'Mustermann', position: 'Einkauf', telefon: '01234-567892', mobil: '0171-1234567', email: 'max.mustermann@musterfirma.de', bemerkung: 'Hauptansprechpartner' },
    { id: '2', kundenId: '1', anrede: 'Frau', vorname: 'Erika', nachname: 'Musterfrau', position: 'Geschäftsführung', telefon: '01234-567893', mobil: '0172-1234567', email: 'erika.musterfrau@musterfirma.de', bemerkung: '' }
];


const KontaktenForm = ({ control, register }: { control: any, register: any }) => {
  const { fields, append, remove } = useFieldArray({ control, name: "kontakte" });

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
        <CardContent className="p-0">
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Anrede</TableHead>
                        <TableHead>Vorname</TableHead>
                        <TableHead>Nachname</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>E-Mail</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead className="text-right">Aktion</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="w-24">
                                <Select defaultValue={field.anrede} onValueChange={(value) => console.log(value)}>
                                    <SelectTrigger {...register(`kontakte.${index}.anrede`)} className="h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Herr">Herr</SelectItem>
                                        <SelectItem value="Frau">Frau</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell><Input {...register(`kontakte.${index}.vorname`)} className="h-9" /></TableCell>
                            <TableCell><Input {...register(`kontakte.${index}.nachname`)} className="h-9" /></TableCell>
                            <TableCell><Input {...register(`kontakte.${index}.position`)} className="h-9" /></TableCell>
                            <TableCell><Input {...register(`kontakte.${index}.email`)} className="h-9" /></TableCell>
                            <TableCell><Input {...register(`kontakte.${index}.telefon`)} className="h-9" /></TableCell>
                            <TableCell className="text-right">
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Icons.logout className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
  )
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  // In a real app, you'd fetch this data. Here we'll find it in our mock data.
  // And we will simulate a "new" customer if id is 'new'.
  const isNew = id === 'new';
  const customerData = useMemo(() => {
    if (isNew) {
      return {
          id: `new-${Date.now()}`,
          firmenname: '', kundennummer: '', ustId: '', steuernummer: '', firmenbuchnummer: '',
          strasse: '', hausnummer: '', plz: '', ort: '', land: 'DE',
          telefon: '', fax: '', email: '', website: '',
          zahlungsbedingungen: '30 Tage netto', zahlungsziel: 30, waehrung: 'EUR', kreditlimit: 0, skontoProzent: 0, skontoTage: 0,
          bankname: '', iban: '', bic: '', kontoinhaber: '',
          aktiv: true, bemerkung: '', erstelltAm: new Date().toISOString(), bearbeitetAm: new Date().toISOString(),
          name: '', contact: '', address: ''
      };
    }
    return MOCK_CUSTOMERS.find(c => c.id === id);
  }, [id, isNew]);

  const kundenKontakte = useMemo(() => MOCK_KONTAKTE.filter(k => k.kundenId === id), [id]);

  const { register, handleSubmit, control, watch, formState: { errors, isDirty, isSubmitting } } = useForm<Customer & { kontakte: Kontakt[] }>({
    defaultValues: { ...customerData, kontakte: kundenKontakte },
  });

  if (!customerData) {
    return <div>Kunde nicht gefunden.</div>;
  }

  const onSubmit = (data: any) => {
    console.log("Form data submitted:", data);
    toast({ title: "Gespeichert", description: "Kundendaten erfolgreich aktualisiert." });
    // Here you would typically send the data to your backend
    router.push('/customers'); // Go back to the list after saving
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{isNew ? 'Neuen Kunden anlegen' : customerData.firmenname}</h1>
          <p className="text-muted-foreground">{isNew ? 'Bitte füllen Sie die Stammdaten aus.' : `Kundennummer: ${customerData.kundennummer}`}</p>
        </div>
        <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Abbrechen</Button>
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
                    <div className="space-y-1.5"><Label>Kundennummer</Label><Input {...register("kundennummer")} className="h-9"/></div>
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
                        <Checkbox id="aktiv" {...register("aktiv")} checked={watch("aktiv")} />
                        <Label htmlFor="aktiv" className="font-normal text-sm">Kunde ist aktiv</Label>
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
                <CardHeader><CardTitle>Adresse</CardTitle></CardHeader>
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

            <KontaktenForm control={control} register={register} />
        </div>
      </div>
    </form>
  );
}
