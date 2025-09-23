
"use client";

import { useState, useRef } from "react";
import type { Country } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { countryData as initialCountries } from "@/lib/data";


const AddCountryDialog = ({ onAdd }: { onAdd: (country: Country) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [iso_code, setIsoCode] = useState("");
  const [kurzname, setKurzname] = useState("");
  const [official_country_name, setOfficialCountryName] = useState("");

  const handleAdd = () => {
    if (iso_code && kurzname && official_country_name) {
      onAdd({ id: Date.now().toString(), iso_code, kurzname, official_country_name });
      setIsoCode("");
      setKurzname("");
      setOfficialCountryName("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary">
          <Icons.add className="mr-2 h-4 w-4" />
          Neues Land
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neues Land hinzufügen</DialogTitle>
          <DialogDescription>
            Geben Sie die Details für das neue Land ein.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="iso_code" className="text-right">ISO Code</Label>
            <Input id="iso_code" value={iso_code} onChange={(e) => setIsoCode(e.target.value)} className="col-span-3 h-9" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kurzname" className="text-right">Kurzname</Label>
            <Input id="kurzname" value={kurzname} onChange={(e) => setKurzname(e.target.value)} className="col-span-3 h-9" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="official_country_name" className="text-right">Offizieller Name</Label>
            <Input id="official_country_name" value={official_country_name} onChange={(e) => setOfficialCountryName(e.target.value)} className="col-span-3 h-9" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">Abbrechen</Button>
          <Button onClick={handleAdd} size="sm">Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const CountryTable = ({ countries, onAdd, setCountries }: { countries: Country[], onAdd: (country: Country) => void, setCountries: React.Dispatch<React.SetStateAction<Country[]>> }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            try {
                const lines = content.split('\n').filter(line => line.trim() !== '');
                const headers = lines[0].split(';').map(h => h.trim());
                 const requiredHeaders = ['iso_code', 'kurzname', 'official_country_name'];
                
                if(!requiredHeaders.every(h => headers.includes(h))) {
                    throw new Error("CSV-Header sind nicht korrekt. Erforderlich: " + requiredHeaders.join(', '));
                }

                const newCountries: Country[] = lines.slice(1).map((line, index) => {
                    const values = line.split(';');
                    const countryData: any = {};
                    headers.forEach((header, i) => {
                      countryData[header] = values[i]?.trim();
                    });
                    
                    return { ...countryData, id: `csv-${Date.now()}-${index}` } as Country;
                });

                setCountries(prev => [...prev, ...newCountries]);
                toast({ title: "Erfolg", description: "Länder erfolgreich importiert." });
            } catch (error) {
                console.error("Fehler beim Parsen der CSV-Datei:", error);
                toast({ variant: "destructive", title: "Fehler", description: (error as Error).message || "CSV-Datei konnte nicht verarbeitet werden." });
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };

    const downloadCSVTemplate = () => {
        const header = "iso_code;kurzname;official_country_name\n";
        const blob = new Blob([header], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'laender_vorlage.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

     const exportCSV = () => {
        if(countries.length === 0) {
            toast({ variant: "destructive", title: "Fehler", description: "Keine Länder zum Exportieren vorhanden." });
            return;
        }
        const header = "iso_code;kurzname;official_country_name\n";
        const csvContent = countries.map(c => `${c.iso_code};${c.kurzname};${c.official_country_name}`).join('\n');
        const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'laender_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
    <Card>
        <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Länder</CardTitle>
                <CardDescription>Liste der verwalteten Länder.</CardDescription>
            </div>
             <div className="flex gap-2">
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button variant="link" size="sm" onClick={() => fileInputRef.current?.click()}>Importieren</Button>
                <Button variant="link" size="sm" onClick={downloadCSVTemplate}>Vorlage</Button>
                <Button variant="link" size="sm" onClick={exportCSV}>Exportieren</Button>
                <AddCountryDialog onAdd={onAdd} />
            </div>
        </div>
        </CardHeader>
        <CardContent className="p-0">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>ISO Code</TableHead>
                <TableHead>Kurzname</TableHead>
                <TableHead>Offizieller Name</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {countries.length > 0 ? (
                countries.map((country) => (
                <TableRow key={country.id}>
                    <TableCell className="font-medium">{country.iso_code}</TableCell>
                    <TableCell>{country.kurzname}</TableCell>
                    <TableCell>{country.official_country_name}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Icons.more className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    Noch keine Länder hinzugefügt.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </CardContent>
    </Card>
    );
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>(initialCountries);

  const addCountry = (country: Country) => {
    setCountries(prev => [...prev, country]);
  };
  
  return <CountryTable countries={countries} onAdd={addCountry} setCountries={setCountries} />;
}

    