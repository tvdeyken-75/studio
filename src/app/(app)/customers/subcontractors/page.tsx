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


const initialSubcontractors: Customer[] = [
    {
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
    },
];

type ColumnKeys = keyof Customer | 'aktionen';

const columnLabels: Record<ColumnKeys, string> = {
    firmenname: "Firma",
    kundennummer: "Subunternehmer-Nr.",
    ort: "Ort",
    land: "Land",
    telefon: "Telefon",
    email: "E-Mail",
    aktiv: "Status",
    aktionen: "Aktionen",
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

export default function SubcontractorsPage() {
  const [subcontractors, setSubcontractors] = useState<Customer[]>(initialSubcontractors);
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

  const filteredSubcontractors = useMemo(() => {
    if (!searchTerm) return subcontractors;
    const lowercasedTerm = searchTerm.toLowerCase();
    return subcontractors.filter(subcontractor => 
      subcontractor.firmenname.toLowerCase().includes(lowercasedTerm) ||
      subcontractor.kundennummer.toLowerCase().includes(lowercasedTerm) ||
      subcontractor.ort.toLowerCase().includes(lowercasedTerm)
    );
  }, [subcontractors, searchTerm]);

  const toggleColumn = (column: keyof typeof columnVisibility) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Placeholder for CSV import logic
        toast({ title: "Info", description: "CSV-Import für Subunternehmer wird in Kürze implementiert." });
        event.target.value = '';
    };

    const downloadCSVTemplate = () => {
        // Placeholder for CSV template download
        toast({ title: "Info", description: "CSV-Vorlagen-Download wird in Kürze implementiert." });
    };

    const exportCSV = () => {
        // Placeholder for CSV export
        toast({ title: "Info", description: "CSV-Export für Subunternehmer wird in Kürze implementiert." });
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
                <CardTitle>Subunternehmer</CardTitle>
                <CardDescription>Übersicht aller Subunternehmer.</CardDescription>
            </div>
            <Button asChild variant="link" className="text-primary">
                <Link href="/customers/new">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neuer Subunternehmer
                </Link>
            </Button>
        </div>
      </CardHeader>
        <div className="p-4 border-b border-t flex justify-between items-center gap-4">
             <Input 
                placeholder="Subunternehmer durchsuchen..."
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
              {columnVisibility.kundennummer && <TableHead>Subunternehmer-Nr.</TableHead>}
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
            {filteredSubcontractors.length > 0 ? (
              filteredSubcontractors.map((subcontractor) => (
                <TableRow key={subcontractor.id}>
                  {columnVisibility.firmenname && <TableCell className="font-medium">{subcontractor.firmenname}</TableCell>}
                  {columnVisibility.kundennummer && <TableCell>{subcontractor.kundennummer}</TableCell>}
                  {columnVisibility.ort && <TableCell>{subcontractor.ort}</TableCell>}
                  {columnVisibility.telefon && <TableCell>{subcontractor.telefon}</TableCell>}
                  {columnVisibility.email && <TableCell>{subcontractor.email}</TableCell>}
                  {columnVisibility.land && <TableCell>{subcontractor.land}</TableCell>}
                  {columnVisibility.plz && <TableCell>{subcontractor.plz}</TableCell>}
                  {columnVisibility.aktiv && <TableCell>
                    <Badge variant={subcontractor.aktiv ? "default" : "destructive"} className="text-white">
                        {subcontractor.aktiv ? 'Aktiv' : 'Inaktiv'}
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
                                    <Link href={`/customers/${subcontractor.id}`} className="w-full cursor-pointer">Bearbeiten</Link>
                                </DropdownMenuItem>
                                 <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Management</DropdownMenuLabel>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Dienstleistungsübersicht", subcontractor.firmenname)}}>Dienstleistungsübersicht</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Risiko Management", subcontractor.firmenname)}}>Risiko Management</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Kommunikation", subcontractor.firmenname)}}>Kommunikation</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Bedarf Analyse", subcontractor.firmenname)}}>Bedarf Analyse</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Vertragsmanagement", subcontractor.firmenname)}}>Vertragsmanagement</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Reporting", subcontractor.firmenname)}}>Reporting</DropdownMenuItem>
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
                  Keine Subunternehmer gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
