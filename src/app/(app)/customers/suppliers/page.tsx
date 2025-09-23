
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


const initialSuppliers: Customer[] = [
    {
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
    },
];

type ColumnKeys = keyof Customer | 'aktionen';

const columnLabels: Record<ColumnKeys, string> = {
    firmenname: "Firma",
    kundennummer: "Lieferanten-Nr.",
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


export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Customer[]>(initialSuppliers);
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

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return suppliers;
    const lowercasedTerm = searchTerm.toLowerCase();
    return suppliers.filter(supplier => 
      supplier.firmenname.toLowerCase().includes(lowercasedTerm) ||
      supplier.kundennummer.toLowerCase().includes(lowercasedTerm) ||
      supplier.ort.toLowerCase().includes(lowercasedTerm)
    );
  }, [suppliers, searchTerm]);

  const toggleColumn = (column: keyof typeof columnVisibility) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Placeholder for CSV import logic
        toast({ title: "Info", description: "CSV-Import für Lieferanten wird in Kürze implementiert." });
        event.target.value = '';
    };

    const downloadCSVTemplate = () => {
        // Placeholder for CSV template download
        toast({ title: "Info", description: "CSV-Vorlagen-Download wird in Kürze implementiert." });
    };

    const exportCSV = () => {
        // Placeholder for CSV export
        toast({ title: "Info", description: "CSV-Export für Lieferanten wird in Kürze implementiert." });
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
                <CardTitle>Lieferanten</CardTitle>
                <CardDescription>Übersicht aller Lieferanten.</CardDescription>
            </div>
            <Button asChild variant="link" className="text-primary">
                <Link href="/customers/suppliers/new">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neuer Lieferant
                </Link>
            </Button>
        </div>
      </CardHeader>
        <div className="p-4 border-b border-t flex justify-between items-center gap-4">
             <Input 
                placeholder="Lieferanten durchsuchen..."
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
              {columnVisibility.kundennummer && <TableHead>Lieferanten-Nr.</TableHead>}
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
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  {columnVisibility.firmenname && <TableCell className="font-medium">{supplier.firmenname}</TableCell>}
                  {columnVisibility.kundennummer && <TableCell>{supplier.kundennummer}</TableCell>}
                  {columnVisibility.ort && <TableCell>{supplier.ort}</TableCell>}
                  {columnVisibility.telefon && <TableCell>{supplier.telefon}</TableCell>}
                  {columnVisibility.email && <TableCell>{supplier.email}</TableCell>}
                  {columnVisibility.land && <TableCell>{supplier.land}</TableCell>}
                  {columnVisibility.plz && <TableCell>{supplier.plz}</TableCell>}
                  {columnVisibility.aktiv && <TableCell>
                    <Badge variant={supplier.aktiv ? "default" : "destructive"} className="text-white">
                        {supplier.aktiv ? 'Aktiv' : 'Inaktiv'}
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
                                    <Link href={`/customers/suppliers/${supplier.id}`} className="w-full cursor-pointer">Bearbeiten</Link>
                                </DropdownMenuItem>
                                 <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Management</DropdownMenuLabel>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Reklamation", supplier.firmenname)}}>Reklamation</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Dienstleistungsübersicht", supplier.firmenname)}}>Dienstleistungsübersicht</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Risiko Management", supplier.firmenname)}}>Risiko Management</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Kommunikation", supplier.firmenname)}}>Kommunikation</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Bedarf Analyse", supplier.firmenname)}}>Bedarf Analyse</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Vertragsmanagement", supplier.firmenname)}}>Vertragsmanagement</DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleActionClick("Reporting", supplier.firmenname)}}>Reporting</DropdownMenuItem>
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
                  Keine Lieferanten gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    