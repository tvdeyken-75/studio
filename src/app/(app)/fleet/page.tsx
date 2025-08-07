
"use client";

import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fleetData as initialFleetData } from "@/lib/data";
import type { Vehicle, Document } from "@/types";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const AddVehicleDialog = ({ onAdd, vehicleToEdit }: { onAdd: (vehicle: Vehicle) => void, vehicleToEdit?: Vehicle | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!vehicleToEdit;
  
  const initialFormState: Omit<Vehicle, 'location' | 'capacity'> = {
    id: `v${Date.now()}`,
    kennzeichen: "", hersteller: "", modell: "", fahrgestellnummer: "",
    baujahr: new Date().getFullYear(), typ: 'Sattelzugmaschine', fahrzeugart: 'LKW', fuhrparkNummer: "",
    motorleistungKw: 0, kraftstoffart: 'Diesel', getriebeart: 'Automatik', achszahl: 2,
    nutzlastKg: 18000, gesamtgewichtKg: 40000, tankvolumenLiter: 800, adblueVolumenLiter: 60,
    tuevBis: "", spBis: "", versicherungsnummer: "", zulassungsdatum: new Date().toISOString().split('T')[0],
    status: 'Aktiv',
  };

  const [formData, setFormData] = useState<Omit<Vehicle, 'location' | 'capacity'>>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData((prev) => ({ ...prev, [id]: isNumber ? parseFloat(value) || 0 : value }));
  };
  
  const handleSelectChange = (id: keyof Vehicle, value: string) => {
    setFormData((prev) => ({...prev, [id]: value }));
  };

  const handleSave = () => {
    // Basic validation
    if (formData.kennzeichen && formData.hersteller && formData.modell) {
      onAdd({ ...formData, location: '', capacity: '' }); // Add legacy fields for type compatibility
      if (!isEditMode) {
        setFormData(initialFormState);
      }
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary">
          <Icons.add className="mr-2 h-4 w-4" />
          Neues Fahrzeug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug anlegen'}</DialogTitle>
          <DialogDescription>
            Füllen Sie die Details für das Fahrzeug aus.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4 text-sm">
          {/* Section 1: General */}
          <div className="md:col-span-1 space-y-4">
              <h4 className="font-semibold text-base">Allgemein</h4>
              <div className="space-y-1.5"><Label>Kennzeichen</Label><Input id="kennzeichen" value={formData.kennzeichen} onChange={handleInputChange} className="h-9"/></div>
              <div className="space-y-1.5"><Label>Hersteller</Label><Input id="hersteller" value={formData.hersteller} onChange={handleInputChange} className="h-9"/></div>
              <div className="space-y-1.5"><Label>Modell</Label><Input id="modell" value={formData.modell} onChange={handleInputChange} className="h-9"/></div>
              <div className="space-y-1.5"><Label>Fahrgestellnummer (VIN)</Label><Input id="fahrgestellnummer" value={formData.fahrgestellnummer} onChange={handleInputChange} className="h-9"/></div>
              <div className="space-y-1.5"><Label>Baujahr</Label><Input id="baujahr" type="number" value={formData.baujahr} onChange={handleInputChange} className="h-9"/></div>
              <div className="space-y-1.5"><Label>Typ</Label>
                <Select onValueChange={(v) => handleSelectChange('typ', v)} defaultValue={formData.typ}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Solo">Solo</SelectItem><SelectItem value="Sattelzugmaschine">Sattelzugmaschine</SelectItem><SelectItem value="Hängerzug">Hängerzug</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Interne Fuhrpark-Nr.</Label><Input id="fuhrparkNummer" value={formData.fuhrparkNummer} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>Status</Label>
                <Select onValueChange={(v) => handleSelectChange('status', v)} defaultValue={formData.status}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktiv">Aktiv</SelectItem>
                    <SelectItem value="Reparatur">Reparatur</SelectItem>
                    <SelectItem value="Verkauft">Verkauft</SelectItem>
                    <SelectItem value="Ausgemustert">Ausgemustert</SelectItem>
                    </SelectContent>
                </Select>
              </div>
          </div>
          {/* Section 2: Technical */}
          <div className="md:col-span-1 space-y-4">
               <h4 className="font-semibold text-base">Technische Daten</h4>
                <div className="space-y-1.5"><Label>Motorleistung (kW)</Label><Input id="motorleistungKw" type="number" value={formData.motorleistungKw} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Kraftstoffart</Label>
                    <Select onValueChange={(v) => handleSelectChange('kraftstoffart', v)} defaultValue={formData.kraftstoffart}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Elektro">Elektro</SelectItem><SelectItem value="H2">H2</SelectItem></SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5"><Label>Getriebeart</Label>
                    <Select onValueChange={(v) => handleSelectChange('getriebeart', v)} defaultValue={formData.getriebeart}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Automatik">Automatik</SelectItem><SelectItem value="Manuell">Manuell</SelectItem></SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5"><Label>Anzahl Achsen</Label><Input id="achszahl" type="number" value={formData.achszahl} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Nutzlast (kg)</Label><Input id="nutzlastKg" type="number" value={formData.nutzlastKg} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Gesamtgewicht (kg)</Label><Input id="gesamtgewichtKg" type="number" value={formData.gesamtgewichtKg} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Tankvolumen (l)</Label><Input id="tankvolumenLiter" type="number" value={formData.tankvolumenLiter} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>AdBlue-Volumen (l)</Label><Input id="adblueVolumenLiter" type="number" value={formData.adblueVolumenLiter} onChange={handleInputChange} className="h-9"/></div>
          </div>
           {/* Section 3: Documents */}
          <div className="md:col-span-1 space-y-4">
              <h4 className="font-semibold text-base">Dokumente & Fristen</h4>
               <div className="space-y-1.5"><Label>TÜV bis</Label><Input id="tuevBis" type="date" value={formData.tuevBis} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>SP bis</Label><Input id="spBis" type="date" value={formData.spBis} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>Versicherungsnummer</Label><Input id="versicherungsnummer" value={formData.versicherungsnummer} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>Zulassungsdatum</Label><Input id="zulassungsdatum" type="date" value={formData.zulassungsdatum} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>GPS-Tracker ID</Label><Input id="gpsTrackerId" value={formData.gpsTrackerId || ''} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>SIM-Nummer</Label><Input id="simNummer" value={formData.simNummer || ''} onChange={handleInputChange} className="h-9"/></div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">Abbrechen</Button>
          <Button onClick={handleSave} size="sm">Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReportsDialog = ({ asset, assetType }: { asset: Vehicle | any, assetType: 'Fahrzeug' | 'Anhänger' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  // Mock documents data for the asset
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc1', name: 'TÜV Bericht 2023', type: 'TÜV', date: '2023-08-15', fileUrl: '#' },
    { id: 'doc2', name: 'Reifenwechsel Rechnung', type: 'Reparatur', date: '2024-01-20', fileUrl: '#' },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Simulate upload
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: 'Sonstiges',
      date: new Date().toISOString().split('T')[0],
      fileUrl: URL.createObjectURL(file), // In a real app, this would be an upload URL
    };
    setDocuments(prev => [newDoc, ...prev]);
    toast({ title: 'Dokument hochgeladen', description: `${file.name} wurde hinzugefügt.` });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Berichte & Dokumente
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Berichte & Dokumente für {asset.kennzeichen}</DialogTitle>
          <DialogDescription>
            Verwalten Sie alle Dokumente und Fotos für dieses {assetType}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-end">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <Button size="sm" onClick={() => fileInputRef.current?.click()}>
              <Icons.add className="mr-2 h-4 w-4" /> Neues Dokument/Foto
            </Button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vorschau</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Image src="https://placehold.co/100x100.png" alt={doc.name} data-ai-hint="document preview" width={40} height={40} className="rounded-md object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell><Badge variant="outline">{doc.type}</Badge></TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => window.open(doc.fileUrl, '_blank')}>
                         <Icons.logout className="h-4 w-4" /> {/* Replace with a download/view icon */}
                       </Button>
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


export default function FleetPage() {
  const [fleet, setFleet] = useState<Vehicle[]>(initialFleetData);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const statusMap = {
    'Aktiv': 'Aktiv',
    'Reparatur': 'Reparatur',
    'Verkauft': 'Verkauft',
    'Ausgemustert': 'Ausgemustert',
  };

  const [columnVisibility, setColumnVisibility] = useState({
      kennzeichen: true,
      hersteller: true,
      modell: true,
      status: true,
      typ: false,
      fahrerId: true,
      tuevBis: true,
      spBis: false,
      fuhrparkNummer: false,
  });

  const addVehicle = (vehicle: Vehicle) => {
    setFleet(prev => [vehicle, ...prev]);
    toast({ title: 'Fahrzeug hinzugefügt', description: `Das Fahrzeug ${vehicle.kennzeichen} wurde erfolgreich angelegt.` });
  };
  
  const filteredFleet = useMemo(() => {
    if (!searchTerm) return fleet;
    const lowercasedTerm = searchTerm.toLowerCase();
    return fleet.filter(vehicle => 
        Object.values(vehicle).some(value =>
            String(value).toLowerCase().includes(lowercasedTerm)
        )
    );
  }, [fleet, searchTerm]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
     // Implement CSV import logic here, similar to customers page
    toast({ title: "Info", description: "CSV-Import wird in Kürze implementiert."});
    event.target.value = '';
  };
    
  const downloadCSVTemplate = () => {
     // Implement CSV template download logic here
    toast({ title: "Info", description: "CSV-Vorlagen-Download wird in Kürze implementiert."});
  };

  const exportCSV = () => {
    // Implement CSV export logic here
    toast({ title: "Info", description: "CSV-Export wird in Kürze implementiert."});
  }

  type ColumnKeys = keyof typeof columnVisibility;
  const toggleColumn = (column: ColumnKeys) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
  }
  const columnLabels: Record<ColumnKeys, string> = {
    kennzeichen: "Kennzeichen",
    hersteller: "Hersteller",
    modell: "Modell",
    status: "Status",
    typ: "Typ",
    fahrerId: "Fahrer",
    tuevBis: "TÜV bis",
    spBis: "SP bis",
    fuhrparkNummer: "Fuhrpark-Nr.",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fahrzeuge</CardTitle>
              <CardDescription>Eine Übersicht aller Fahrzeuge in Ihrem Fuhrpark.</CardDescription>
            </div>
            <AddVehicleDialog onAdd={addVehicle} />
        </div>
      </CardHeader>
      <div className="p-4 border-b border-t flex justify-between items-center gap-4">
             <Input 
                placeholder="Fahrzeuge durchsuchen..."
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
              {columnVisibility.kennzeichen && <TableHead>Kennzeichen</TableHead>}
              {columnVisibility.hersteller && <TableHead>Hersteller</TableHead>}
              {columnVisibility.modell && <TableHead>Modell</TableHead>}
              {columnVisibility.typ && <TableHead>Typ</TableHead>}
              {columnVisibility.fahrerId && <TableHead>Fahrer</TableHead>}
              {columnVisibility.tuevBis && <TableHead>TÜV bis</TableHead>}
              {columnVisibility.spBis && <TableHead>SP bis</TableHead>}
              {columnVisibility.fuhrparkNummer && <TableHead>Fuhrpark-Nr.</TableHead>}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFleet.map((vehicle) => (
              <TableRow key={vehicle.id}>
                {columnVisibility.kennzeichen && <TableCell className="font-medium">{vehicle.kennzeichen}</TableCell>}
                {columnVisibility.hersteller && <TableCell>{vehicle.hersteller}</TableCell>}
                {columnVisibility.modell && <TableCell>{vehicle.modell}</TableCell>}
                {columnVisibility.typ && <TableCell>{vehicle.typ}</TableCell>}
                {columnVisibility.fahrerId && <TableCell>{vehicle.fahrerId || 'N/A'}</TableCell>}
                {columnVisibility.tuevBis && <TableCell>{vehicle.tuevBis}</TableCell>}
                {columnVisibility.spBis && <TableCell>{vehicle.spBis}</TableCell>}
                {columnVisibility.fuhrparkNummer && <TableCell>{vehicle.fuhrparkNummer}</TableCell>}
                {columnVisibility.status && <TableCell>
                  <Badge
                    variant={vehicle.status === 'Aktiv' ? 'default' : vehicle.status === 'Reparatur' ? 'destructive' : 'secondary'}
                     className={cn(vehicle.status === 'Aktiv' && "bg-green-600 hover:bg-green-700 text-white")}
                  >
                    {statusMap[vehicle.status]}
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
                            <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                            <ReportsDialog asset={vehicle} assetType="Fahrzeug" />
                            <DropdownMenuItem>Wartung melden</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
