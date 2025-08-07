
"use client";

import { useState, useRef } from "react";
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
        <Button>
          <Icons.add className="mr-2 h-4 w-4" />
          Neue Adresse
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Neue Adresse hinzufügen</DialogTitle>
          <DialogDescription>
            Füllen Sie die Details für die neue Adresse aus.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="space-y-4">
                <h4 className="text-sm font-medium">Allgemein</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="kurzname">Kurzname</Label>
                        <Input id="kurzname" value={formData.kurzname} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h4 className="text-sm font-medium">Standortdetails</h4>
                 <div className="space-y-2">
                    <Label htmlFor="strasse">Straße & Hausnummer</Label>
                    <Input id="strasse" value={formData.strasse} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="plz">PLZ</Label>
                        <Input id="plz" value={formData.plz} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="stadt">Stadt</Label>
                        <Input id="stadt" value={formData.stadt} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="land">Land</Label>
                        <Select onValueChange={handleSelectChange} defaultValue={formData.land}>
                            <SelectTrigger>
                                <SelectValue placeholder="Land auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(c => <SelectItem key={c.id} value={c.official_country_name}>{c.official_country_name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="koordinaten">Koordinaten (Optional)</Label>
                        <Input id="koordinaten" value={formData.koordinaten} onChange={handleInputChange} placeholder="z.B. 52.5200, 13.4050"/>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h4 className="text-sm font-medium">Kategorisierung</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="tourPOI" checked={formData.tourPOI} onCheckedChange={() => handleCheckboxChange('tourPOI')} />
                        <Label htmlFor="tourPOI" className="font-normal">Tour-POI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="kundenAdresse" checked={formData.kundenAdresse} onCheckedChange={() => handleCheckboxChange('kundenAdresse')} />
                        <Label htmlFor="kundenAdresse" className="font-normal">Kundenadresse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="mitarbeiterAdresse" checked={formData.mitarbeiterAdresse} onCheckedChange={() => handleCheckboxChange('mitarbeiterAdresse')} />
                        <Label htmlFor="mitarbeiterAdresse" className="font-normal">Mitarbeiteradresse</Label>
                    </div>
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">Abbrechen</Button>
          <Button onClick={handleAdd}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const AddressTable = ({ addresses, onAdd, setAddresses }: { addresses: Address[], onAdd: (address: Address) => void, setAddresses: React.Dispatch<React.SetStateAction<Address[]>> }) => {
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

    return (
    <Card>
        <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Adressen</CardTitle>
                <CardDescription>Liste der verwalteten Adressen.</CardDescription>
            </div>
            <div className="flex gap-2">
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>CSV Importieren</Button>
                <Button variant="outline" onClick={downloadCSVTemplate}>Vorlage herunterladen</Button>
                <Button variant="outline" onClick={exportCSV}>CSV Exportieren</Button>
                <AddAddressDialog onAdd={onAdd} countries={MOCK_COUNTRIES} />
            </div>
        </div>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Kurzname</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Straße</TableHead>
                <TableHead>PLZ</TableHead>
                <TableHead>Stadt</TableHead>
                <TableHead>Land</TableHead>
                <TableHead>Koordinaten</TableHead>
                <TableHead>Tour-POI</TableHead>
                <TableHead>Kundenadr.</TableHead>
                <TableHead>Mitarbeiteradr.</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {addresses.length > 0 ? (
                addresses.map((address) => (
                <TableRow key={address.id}>
                    <TableCell>{address.kurzname}</TableCell>
                    <TableCell className="font-medium">{address.name}</TableCell>
                    <TableCell>{address.strasse}</TableCell>
                    <TableCell>{address.plz}</TableCell>
                    <TableCell>{address.stadt}</TableCell>
                    <TableCell>{address.land}</TableCell>
                    <TableCell>{address.koordinaten}</TableCell>
                    <TableCell><Checkbox checked={address.tourPOI} disabled /></TableCell>
                    <TableCell><Checkbox checked={address.kundenAdresse} disabled /></TableCell>
                    <TableCell><Checkbox checked={address.mitarbeiterAdresse} disabled /></TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                    Noch keine Adressen hinzugefügt.
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

    