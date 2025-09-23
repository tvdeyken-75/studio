
"use client";

import { useState, useMemo, useRef } from "react";
import Link from 'next/link';
import type { Customer } from "@/types";
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
import { SlidersHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
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
import { customerData } from "@/lib/data";


const initialCustomers: Customer[] = customerData;

type ColumnKeys = keyof Customer | 'aktionen';

const columnLabels: Record<ColumnKeys, string> = {
    firmenname: "Firma",
    kundennummer: "Kundennr.",
    ort: "Ort",
    land: "Land",
    telefon: "Telefon",
    email: "E-Mail",
    aktiv: "Status",
    aktionen: "Aktionen",
    // Add other labels as needed, or handle them dynamically
    id: "ID",
    ustId: "USt-IdNr.",
    steuernummer: "Steuernummer",
    firmenbuchnummer: "Handelsregisternr.",
    strasse: "Straße",
    hausnummer: "Hausnr.",
    plz: "PLZ",
    fax: "Fax",
    website: "Webseite",
    zahlungsbedingungen: "Zahlungsbed.",
    zahlungsziel: "Zahlungsziel",
    waehrung: "Währung",
    kreditlimit: "Kreditlimit",
    skontoProzent: "Skonto %",
    skontoTage: "Skonto Tage",
    bankname: "Bankname",
    iban: "IBAN",
    bic: "BIC",
    kontoinhaber: "Kontoinhaber",
    bemerkung: "Bemerkung",
    erstelltAm: "Erstellt",
    bearbeitetAm: "Bearbeitet",
    name: "Name",
    contact: "Kontakt",
    address: "Adresse"
};


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [columnVisibility, setColumnVisibility] = useState({
      firmenname: true,
      kundennummer: true,
      ort: true,
      telefon: true,
      aktiv: true,
      email: false,
      land: false,
      plz: false,
  });

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lowercasedTerm = searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.firmenname.toLowerCase().includes(lowercasedTerm) ||
      customer.kundennummer.toLowerCase().includes(lowercasedTerm) ||
      customer.ort.toLowerCase().includes(lowercasedTerm)
    );
  }, [customers, searchTerm]);

  const toggleColumn = (column: keyof typeof columnVisibility) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            try {
                const lines = content.split('\n').filter(line => line.trim() !== '');
                const headers = lines[0].split(';').map(h => h.trim() as keyof Customer);
                
                const newCustomers: Customer[] = lines.slice(1).map((line, index) => {
                    const values = line.split(';');
                    const customerData: any = { id: `csv-${Date.now()}-${index}` };
                    headers.forEach((header, i) => {
                      const value = values[i]?.trim();
                      if (['aktiv'].includes(header)) {
                        customerData[header] = value?.toLowerCase() === 'true';
                      } else if (['zahlungsziel', 'kreditlimit', 'skontoProzent', 'skontoTage'].includes(header)) {
                        customerData[header] = parseFloat(value) || 0;
                      } else {
                        customerData[header] = value;
                      }
                    });
                    
                    return customerData as Customer;
                });

                setCustomers(prev => [...prev, ...newCustomers]);
                toast({ title: "Erfolg", description: "Kunden erfolgreich importiert." });
            } catch (error) {
                console.error("Fehler beim Parsen der CSV-Datei:", error);
                toast({ variant: "destructive", title: "Fehler", description: (error as Error).message || "CSV-Datei konnte nicht verarbeitet werden." });
            }
        };
        reader.readAsText(file, 'UTF-8');
        event.target.value = ''; // Reset file input
    };

    const getCSVHeaders = () => {
        return [
            "firmenname", "kundennummer", "ustId", "steuernummer", "firmenbuchnummer", "strasse", "hausnummer", "plz", "ort", "land", 
            "telefon", "fax", "email", "website", "zahlungsbedingungen", "zahlungsziel", "waehrung", "kreditlimit", "skontoProzent", "skontoTage",
            "bankname", "iban", "bic", "kontoinhaber", "aktiv", "bemerkung"
        ];
    }
    
    const downloadCSVTemplate = () => {
        const header = getCSVHeaders().join(';') + '\n';
        const blob = new Blob([header], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'kunden_vorlage.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportCSV = () => {
        if(customers.length === 0) {
            toast({ variant: "destructive", title: "Fehler", description: "Keine Kunden zum Exportieren vorhanden." });
            return;
        }
        const headers = getCSVHeaders();
        const csvContent = customers.map(c => {
            return headers.map(header => c[header as keyof Customer]).join(';');
        }).join('\n');
        
        const blob = new Blob([ '\uFEFF' + headers.join(';') + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'kunden_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const handleActionClick = (actionName: string, customerName: string) => {
        toast({
            title: `${actionName} für ${customerName}`,
            description: `Die Funktion zum Anzeigen von "${actionName}" ist in Entwicklung.`,
        });
    };


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Kundenstamm</CardTitle>
                <CardDescription>Übersicht aller Kunden und Auftragnehmer.</CardDescription>
            </div>
            <Button asChild variant="link" className="text-primary">
                <Link href="/customers/new">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neuer Kunde
                </Link>
            </Button>
        </div>
      </CardHeader>
        <div className="p-4 border-b border-t flex justify-between items-center gap-4">
             <Input 
                placeholder="Kunden durchsuchen (Firma, Kundennr., Ort)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-md h-9"
            />
            <div className="flex gap-2 items-center">
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button variant="link" size="sm" onClick={() => fileInputRef.current?.click()}>Importieren</Button>
                <Button variant="link" size="sm" onClick={downloadCSVTemplate}>Vorlage</Button>
                <Button variant="link" size="sm" onClick={exportCSV}>Exportieren</Button>
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
              {columnVisibility.firmenname && <TableHead>Firma</TableHead>}
              {columnVisibility.kundennummer && <TableHead>Kundennr.</TableHead>}
              {columnVisibility.ort && <TableHead>Ort</TableHead>}
              {columnVisibility.telefon && <TableHead>Telefon</TableHead>}
              {columnVisibility.email && <TableHead>Email</TableHead>}
              {columnVisibility.land && <TableHead>Land</TableHead>}
              {columnVisibility.plz && <TableHead>PLZ</TableHead>}
              {columnVisibility.aktiv && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  {columnVisibility.firmenname && <TableCell className="font-medium">{customer.firmenname}</TableCell>}
                  {columnVisibility.kundennummer && <TableCell>{customer.kundennummer}</TableCell>}
                  {columnVisibility.ort && <TableCell>{customer.ort}</TableCell>}
                  {columnVisibility.telefon && <TableCell>{customer.telefon}</TableCell>}
                  {columnVisibility.email && <TableCell>{customer.email}</TableCell>}
                  {columnVisibility.land && <TableCell>{customer.land}</TableCell>}
                  {columnVisibility.plz && <TableCell>{customer.plz}</TableCell>}
                  {columnVisibility.aktiv && <TableCell>
                    <Badge variant={customer.aktiv ? "default" : "destructive"} className="text-white">
                        {customer.aktiv ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>}
                  <TableCell className="text-right">
                     <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Icons.more className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/customers/${customer.id}`} className="w-full cursor-pointer">Bearbeiten</Link>
                                </DropdownMenuItem>
                                 <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Management</DropdownMenuLabel>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Reklamation", customer.firmenname)}}>Reklamation</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Dienstleistungsübersicht", customer.firmenname)}}>Dienstleistungsübersicht</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Risiko Management", customer.firmenname)}}>Risiko Management</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Kommunikation", customer.firmenname)}}>Kommunikation</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Bedarf Analyse", customer.firmenname)}}>Bedarf Analyse</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Vertragsmanagement", customer.firmenname)}}>Vertragsmanagement</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Reporting", customer.firmenname)}}>Reporting</DropdownMenuItem>
                                 </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Funktion in Entwicklung</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Diese Funktion ist noch nicht verfügbar, wird aber in Kürze implementiert.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction>OK</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="h-24 text-center">
                  Keine Kunden gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    