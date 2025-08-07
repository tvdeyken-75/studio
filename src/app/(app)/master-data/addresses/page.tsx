
"use client";

import { useState, useRef, useMemo } from "react";
import type { Address, Country } from "@/types";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

// Mocked countries data. In a real application, this would come from an API or the countries state.
const MOCK_COUNTRIES: Country[] = [
    { id: '1', iso_code: 'DE', kurzname: 'DE', official_country_name: 'Deutschland' },
    { id: '2', iso_code: 'AT', kurzname: 'AT', official_country_name: 'Österreich' },
    { id: '3', iso_code: 'CH', kurzname: 'CH', official_country_name: 'Schweiz' },
];

const AddAddressDialog = ({ onAdd, countries }: { onAdd: (address: Address) => void; countries: Country[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    kurzname: "",
    name: "",
    strasse: "",
    plz: "",
    stadt: "",
    land: "",
    koordinaten: "",
    tourPOI: false,
    kundenAdresse: false,
    mitarbeiterAdresse: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [id]: !prev[id as "tourPOI" | "kundenAdresse" | "mitarbeiterAdresse"] }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, land: value }));
  };

  const handleAdd = () => {
    if (formData.name && formData.strasse && formData.plz && formData.stadt && formData.land) {
      onAdd({ ...formData, id: Date.now().toString() });
      setFormData({
        kurzname: "", name: "", strasse: "", plz: "", stadt: "", land: "",
        koordinaten: "", tourPOI: false, kundenAdresse: false, mitarbeiterAdresse: false,
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary">
          <Icons.add className="mr-2 h-4 w-4" />
          Neue Adresse
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Neue Adresse hinzufügen</DialogTitle>
          <DialogDescription>
            Füllen Sie die Details für die neue Adresse aus.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4 text-sm">
            <div className="space-y-3">
                <h4 className="text-xs font-medium text-muted-foreground">Allgemein</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="kurzname">Kurzname</Label>
                        <Input id="kurzname" value={formData.kurzname} onChange={handleInputChange} className="h-9" />
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={formData.name} onChange={handleInputChange} className="h-9" />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-3">
                <h4 className="text-xs font-medium text-muted-foreground">Standortdetails</h4>
                 <div className="space-y-1.5">
                    <Label htmlFor="strasse">Straße & Hausnummer</Label>
                    <Input id="strasse" value={formData.strasse} onChange={handleInputChange} className="h-9" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="plz">PLZ</Label>
                        <Input id="plz" value={formData.plz} onChange={handleInputChange} className="h-9" />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="stadt">Stadt</Label>
                        <Input id="stadt" value={formData.stadt} onChange={handleInputChange} className="h-9" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="land">Land</Label>
                        <Select onValueChange={handleSelectChange} defaultValue={formData.land}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Land auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(c => <SelectItem key={c.id} value={c.official_country_name}>{c.official_country_name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="koordinaten">Koordinaten (Optional)</Label>
                        <Input id="koordinaten" value={formData.koordinaten} onChange={handleInputChange} placeholder="z.B. 52.5200, 13.4050" className="h-9" />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-3">
                <h4 className="text-xs font-medium text-muted-foreground">Kategorisierung</h4>
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="tourPOI" checked={formData.tourPOI} onCheckedChange={() => handleCheckboxChange('tourPOI')} />
                        <Label htmlFor="tourPOI" className="font-normal text-sm">Tour-POI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="kundenAdresse" checked={formData.kundenAdresse} onCheckedChange={() => handleCheckboxChange('kundenAdresse')} />
                        <Label htmlFor="kundenAdresse" className="font-normal text-sm">Kundenadresse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="mitarbeiterAdresse" checked={formData.mitarbeiterAdresse} onCheckedChange={() => handleCheckboxChange('mitarbeiterAdresse')} />
                        <Label htmlFor="mitarbeiterAdresse" className="font-normal text-sm">Mitarbeiteradresse</Label>
                    </div>
                </div>
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

const AddressTable = ({ addresses, onAdd, setAddresses }: { addresses: Address[], onAdd: (address: Address) => void, setAddresses: React.Dispatch<React.SetStateAction<Address[]>> }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [columnVisibility, setColumnVisibility] = useState({
        kurzname: true,
        name: true,
        strasse: true,
        plz: true,
        stadt: true,
        land: true,
        koordinaten: false,
        tourPOI: false,
        kundenAdresse: true,
        mitarbeiterAdresse: false,
    });

    const filteredAddresses = useMemo(() => {
        if (!searchTerm) return addresses;
        const lowercasedTerm = searchTerm.toLowerCase();
        return addresses.filter(address => 
            Object.values(address).some(value => 
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [addresses, searchTerm]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            try {
                const lines = content.split('\n').filter(line => line.trim() !== '');
                const headers = lines[0].split(';').map(h => h.trim());
                const requiredHeaders = ['kurzname', 'name', 'strasse', 'plz', 'stadt', 'land', 'koordinaten', 'tourPOI', 'kundenAdresse', 'mitarbeiterAdresse'];
                
                if(!requiredHeaders.every(h => headers.includes(h))) {
                    throw new Error("CSV-Header sind nicht korrekt. Erforderlich: " + requiredHeaders.join(', '));
                }

                const newAddresses: Address[] = lines.slice(1).map((line, index) => {
                    const values = line.split(';');
                    const addressData: any = {};
                    headers.forEach((header, i) => {
                      const value = values[i]?.trim();
                      if (['tourPOI', 'kundenAdresse', 'mitarbeiterAdresse'].includes(header)) {
                        addressData[header] = value?.toLowerCase() === 'true';
                      } else {
                        addressData[header] = value;
                      }
                    });
                    
                    return { ...addressData, id: `csv-${Date.now()}-${index}` } as Address;
                });

                setAddresses(prev => [...prev, ...newAddresses]);
                toast({ title: "Erfolg", description: "Adressen erfolgreich importiert." });
            } catch (error) {
                console.error("Fehler beim Parsen der CSV-Datei:", error);
                toast({ variant: "destructive", title: "Fehler", description: (error as Error).message || "CSV-Datei konnte nicht verarbeitet werden." });
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };
    
    const downloadCSVTemplate = () => {
        const header = "kurzname;name;strasse;plz;stadt;land;koordinaten;tourPOI;kundenAdresse;mitarbeiterAdresse\n";
        const blob = new Blob([header], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'adressen_vorlage.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportCSV = () => {
        if(addresses.length === 0) {
            toast({ variant: "destructive", title: "Fehler", description: "Keine Adressen zum Exportieren vorhanden." });
            return;
        }
        const header = "kurzname;name;strasse;plz;stadt;land;koordinaten;tourPOI;kundenAdresse;mitarbeiterAdresse\n";
        const csvContent = addresses.map(a => `${a.kurzname};${a.name};${a.strasse};${a.plz};${a.stadt};${a.land};${a.koordinaten};${a.tourPOI};${a.kundenAdresse};${a.mitarbeiterAdresse}`).join('\n');
        const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'adressen_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    type ColumnKeys = keyof typeof columnVisibility;

    const toggleColumn = (column: ColumnKeys) => {
        setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
    }
    
    const columnLabels: Record<ColumnKeys, string> = {
        kurzname: "Kurzname",
        name: "Name",
        strasse: "Straße",
        plz: "PLZ",
        stadt: "Stadt",
        land: "Land",
        koordinaten: "Koordinaten",
        tourPOI: "Tour-POI",
        kundenAdresse: "Kundenadr.",
        mitarbeiterAdresse: "Mitarbeiteradr."
    };


    return (
    <Card>
        <CardHeader className="border-b">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <CardTitle>Adressen</CardTitle>
                    <CardDescription>Liste der verwalteten Adressen.</CardDescription>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <AddAddressDialog onAdd={onAdd} countries={MOCK_COUNTRIES} />
                </div>
            </div>
        </CardHeader>
        <div className="p-4 border-b flex justify-between items-center gap-4">
            <Input 
                placeholder="Adressen durchsuchen (z.B. Name, Stadt, PLZ)..."
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
                                checked={columnVisibility[key as ColumnKeys]}
                                onCheckedChange={() => toggleColumn(key as ColumnKeys)}
                            >
                                {columnLabels[key as ColumnKeys]}
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
                {columnVisibility.kurzname && <TableHead className="w-[100px]">Kurzname</TableHead>}
                {columnVisibility.name && <TableHead>Name</TableHead>}
                {columnVisibility.strasse && <TableHead>Straße</TableHead>}
                {columnVisibility.plz && <TableHead>PLZ</TableHead>}
                {columnVisibility.stadt && <TableHead>Stadt</TableHead>}
                {columnVisibility.land && <TableHead>Land</TableHead>}
                {columnVisibility.koordinaten && <TableHead>Koordinaten</TableHead>}
                {columnVisibility.tourPOI && <TableHead className="text-center">Tour-POI</TableHead>}
                {columnVisibility.kundenAdresse && <TableHead className="text-center">Kundenadr.</TableHead>}
                {columnVisibility.mitarbeiterAdresse && <TableHead className="text-center">Mitarbeiteradr.</TableHead>}
                <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredAddresses.length > 0 ? (
                filteredAddresses.map((address) => (
                <TableRow key={address.id}>
                    {columnVisibility.kurzname && <TableCell className="font-medium text-xs">{address.kurzname}</TableCell>}
                    {columnVisibility.name && <TableCell className="font-medium">{address.name}</TableCell>}
                    {columnVisibility.strasse && <TableCell>{address.strasse}</TableCell>}
                    {columnVisibility.plz && <TableCell>{address.plz}</TableCell>}
                    {columnVisibility.stadt && <TableCell>{address.stadt}</TableCell>}
                    {columnVisibility.land && <TableCell>{address.land}</TableCell>}
                    {columnVisibility.koordinaten && <TableCell className="text-xs">{address.koordinaten}</TableCell>}
                    {columnVisibility.tourPOI && <TableCell className="text-center"><Checkbox checked={address.tourPOI} disabled /></TableCell>}
                    {columnVisibility.kundenAdresse && <TableCell className="text-center"><Checkbox checked={address.kundenAdresse} disabled /></TableCell>}
                    {columnVisibility.mitarbeiterAdresse && <TableCell className="text-center"><Checkbox checked={address.mitarbeiterAdresse} disabled /></TableCell>}
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
                <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="h-24 text-center">
                    {searchTerm ? "Keine Ergebnisse gefunden." : "Noch keine Adressen hinzugefügt."}
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </CardContent>
    </Card>
    );
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const addAddress = (address: Address) => {
    setAddresses(prev => [...prev, address]);
  };
  
  return <AddressTable addresses={addresses} onAdd={addAddress} setAddresses={setAddresses} />;
}
