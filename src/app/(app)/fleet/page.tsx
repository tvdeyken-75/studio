

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fleetData as initialFleetData } from "@/lib/data";
import type { Vehicle, Document, Report } from "@/types";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { format } from "date-fns";

const AddVehicleDialog = ({ onSave, vehicleToEdit, isOpen, onOpenChange }: { onSave: (vehicle: Vehicle) => void, vehicleToEdit?: Vehicle | null, isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) => {
  const isEditMode = !!vehicleToEdit;
  
  const getInitialFormState = (): Omit<Vehicle, 'location' | 'capacity'> => {
      if (isEditMode && vehicleToEdit) {
          // Ensure all fields are present, providing defaults for any missing ones.
          const { location, capacity, ...rest } = vehicleToEdit;
          return {
              id: rest.id || `v${Date.now()}`,
              kennzeichen: rest.kennzeichen || "",
              hersteller: rest.hersteller || "",
              modell: rest.modell || "",
              fahrgestellnummer: rest.fahrgestellnummer || "",
              baujahr: rest.baujahr || new Date().getFullYear(),
              typ: rest.typ || 'Sattelzugmaschine',
              fahrzeugart: rest.fahrzeugart || 'LKW',
              fuhrparkNummer: rest.fuhrparkNummer || "",
              motorleistungKw: rest.motorleistungKw || 0,
              kraftstoffart: rest.kraftstoffart || 'Diesel',
              getriebeart: rest.getriebeart || 'Automatik',
              achszahl: rest.achszahl || 2,
              nutzlastKg: rest.nutzlastKg || 18000,
              gesamtgewichtKg: rest.gesamtgewichtKg || 40000,
              tankvolumenLiter: rest.tankvolumenLiter || 800,
              adblueVolumenLiter: rest.adblueVolumenLiter || 60,
              tuevBis: rest.tuevBis ? format(new Date(rest.tuevBis), 'yyyy-MM-dd') : "",
              spBis: rest.spBis ? format(new Date(rest.spBis), 'yyyy-MM-dd') : "",
              versicherungsnummer: rest.versicherungsnummer || "",
              zulassungsdatum: rest.zulassungsdatum ? format(new Date(rest.zulassungsdatum), 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
              status: rest.status || 'Aktiv',
              tourStatus: rest.tourStatus || 'Verfügbar',
              fahrerId: rest.fahrerId || undefined,
              gpsTrackerId: rest.gpsTrackerId || undefined,
              simNummer: rest.simNummer || undefined,
          };
      }
      return {
          id: `v${Date.now()}`,
          kennzeichen: "", hersteller: "", modell: "", fahrgestellnummer: "",
          baujahr: new Date().getFullYear(), typ: 'Sattelzugmaschine', fahrzeugart: 'LKW', fuhrparkNummer: "",
          motorleistungKw: 0, kraftstoffart: 'Diesel', getriebeart: 'Automatik', achszahl: 2,
          nutzlastKg: 18000, gesamtgewichtKg: 40000, tankvolumenLiter: 800, adblueVolumenLiter: 60,
          tuevBis: "", spBis: "", versicherungsnummer: "", zulassungsdatum: new Date().toISOString().split('T')[0],
          status: 'Aktiv',
          tourStatus: 'Verfügbar',
      };
  };

  const [formData, setFormData] = useState(getInitialFormState());

  useEffect(() => {
    if (isOpen) {
        setFormData(getInitialFormState());
    }
  }, [isOpen, vehicleToEdit]);

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
      onSave({ ...formData, location: '', capacity: '' }); // Add legacy fields for type compatibility
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                    <Select onValueChange={(v) => handleSelectChange('typ', v)} value={formData.typ}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Solo">Solo</SelectItem><SelectItem value="Sattelzugmaschine">Sattelzugmaschine</SelectItem><SelectItem value="Hängerzug">Hängerzug</SelectItem></SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5"><Label>Interne Fuhrpark-Nr.</Label><Input id="fuhrparkNummer" value={formData.fuhrparkNummer} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Status</Label>
                    <Select onValueChange={(v) => handleSelectChange('status', v)} value={formData.status}>
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
                        <Select onValueChange={(v) => handleSelectChange('kraftstoffart', v)} value={formData.kraftstoffart}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Elektro">Elektro</SelectItem><SelectItem value="H2">H2</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5"><Label>Getriebeart</Label>
                        <Select onValueChange={(v) => handleSelectChange('getriebeart', v)} value={formData.getriebeart}>
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
            <Button onClick={() => onOpenChange(false)} variant="ghost" size="sm">Abbrechen</Button>
            <Button onClick={handleSave} size="sm">Speichern</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
};

const AddReportDialog = ({ onAddReport }: { onAddReport: (report: Report) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [reportData, setReportData] = useState<Partial<Report>>({
    id: `rep-${Date.now()}`,
    type: 'Wartung',
    date: new Date().toISOString().split('T')[0],
    description: '',
    documents: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setReportData(prev => ({...prev, [id]: value }));
  }
  
  const handleSelectChange = (value: Report['type']) => {
     setReportData(prev => ({...prev, type: value }));
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate upload
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: 'Sonstiges', // Or derive from report type
      date: new Date().toISOString().split('T')[0],
      fileUrl: URL.createObjectURL(file),
    };
    
    setReportData(prev => ({...prev, documents: [...(prev.documents || []), newDoc]}));
    toast({ title: 'Dokument angehängt', description: file.name });
  };

  const handleSaveReport = () => {
    if (reportData.description) {
        onAddReport(reportData as Report);
        toast({ title: 'Bericht gespeichert'});
    } else {
        toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte geben Sie eine Beschreibung ein.'});
    }
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Neuen Bericht erstellen</DialogTitle>
        <DialogDescription>
          Erfassen Sie eine neue Wartung, einen Schaden oder ein anderes Ereignis.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <Label>Berichtstyp</Label>
                <Select onValueChange={handleSelectChange} defaultValue={reportData.type}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Wartung">Wartung</SelectItem>
                        <SelectItem value="Schaden">Schaden</SelectItem>
                        <SelectItem value="TÜV">TÜV/SP</SelectItem>
                        <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1.5">
                <Label>Datum</Label>
                <Input id="date" type="date" value={reportData.date} onChange={handleInputChange} className="h-9"/>
            </div>
        </div>
        <div className="space-y-1.5">
            <Label>Beschreibung</Label>
            <Textarea id="description" placeholder="Beschreiben Sie das Ereignis..." value={reportData.description} onChange={handleInputChange}/>
        </div>
        <div className="space-y-2">
            <Label>Dokumente & Fotos</Label>
            <div className="flex items-center gap-2">
                 <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Icons.add className="mr-2 h-4 w-4" /> Datei hochladen
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            </div>
             <div className="space-y-1 text-sm text-muted-foreground">
                {reportData.documents?.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between">
                        <span>{doc.name}</span>
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">Vorschau</a>
                    </div>
                ))}
            </div>
        </div>
      </div>
       <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Abbrechen</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSaveReport} size="sm">Speichern</Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>
  )
}


const ReportsDialog = ({ asset, assetType }: { asset: Vehicle | any, assetType: 'Fahrzeug' | 'Anhänger' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  // Mock reports data
  const [reports, setReports] = useState<Report[]>([
    { id: 'rep1', assetId: asset.id, type: 'Wartung', date: '2024-03-10', description: 'Regelmäßiger Ölwechsel und Inspektion.', documents: [] },
    { id: 'rep2', assetId: asset.id, type: 'Schaden', date: '2024-05-22', description: 'Reifenschaden hinten links. Reifen wurde ersetzt.', documents: [] },
  ]);

  const addReport = (report: Report) => {
    setReports(prev => [report, ...prev]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Wartung & Berichte
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
             <div>
                <DialogTitle>Wartung & Berichte für {asset.kennzeichen}</DialogTitle>
                <DialogDescription>
                    Verwalten Sie alle Wartungsereignisse, Schäden und Dokumente.
                </DialogDescription>
             </div>
             <Dialog>
                 <DialogTrigger asChild>
                    <Button size="sm"><Icons.add className="mr-2 h-4 w-4" />Neuer Bericht</Button>
                </DialogTrigger>
                <AddReportDialog onAddReport={addReport} />
             </Dialog>
          </div>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto mt-4">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Typ</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead className="text-center">Dokumente</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(report => (
                  <TableRow key={report.id}>
                    <TableCell><Badge variant="outline">{report.type}</Badge></TableCell>
                    <TableCell>{format(new Date(report.date), 'dd.MM.yyyy')}</TableCell>
                    <TableCell className="text-sm">{report.description}</TableCell>
                    <TableCell className="text-center">{report.documents?.length || 0}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon">
                         <Icons.more className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {reports.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Keine Berichte für dieses Fahrzeug vorhanden.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
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
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

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
      tourStatus: true,
      fahrerId: true,
      tuevBis: true,
      fuhrparkNummer: false,
  });

  const handleSaveVehicle = (vehicle: Vehicle) => {
    const isEditing = fleet.some(v => v.id === vehicle.id);
    if (isEditing) {
        setFleet(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
        toast({ title: 'Fahrzeug aktualisiert', description: `Das Fahrzeug ${vehicle.kennzeichen} wurde erfolgreich aktualisiert.` });
    } else {
        setFleet(prev => [vehicle, ...prev]);
        toast({ title: 'Fahrzeug hinzugefügt', description: `Das Fahrzeug ${vehicle.kennzeichen} wurde erfolgreich angelegt.` });
    }
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
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
    tourStatus: "Tour-Status",
    fahrerId: "Fahrer",
    tuevBis: "TÜV bis",
    fuhrparkNummer: "Fuhrpark-Nr.",
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      return dateString; // Return original string if invalid
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fahrzeuge</CardTitle>
              <CardDescription>Eine Übersicht aller Fahrzeuge in Ihrem Fuhrpark.</CardDescription>
            </div>
            <Button variant="link" className="text-primary" onClick={handleAddNew}>
                <Icons.add className="mr-2 h-4 w-4" />
                Neues Fahrzeug
            </Button>
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
              {columnVisibility.tourStatus && <TableHead>Tour-Status</TableHead>}
              {columnVisibility.fahrerId && <TableHead>Fahrer</TableHead>}
              {columnVisibility.tuevBis && <TableHead>TÜV bis</TableHead>}
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
                {columnVisibility.tourStatus && <TableCell>
                    <Badge variant={vehicle.tourStatus === 'Verfügbar' ? 'secondary' : 'default'}>
                        {vehicle.tourStatus}
                    </Badge>
                </TableCell>}
                {columnVisibility.fahrerId && <TableCell>{vehicle.fahrerId || 'N/A'}</TableCell>}
                {columnVisibility.tuevBis && <TableCell>{formatDate(vehicle.tuevBis)}</TableCell>}
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
                            <DropdownMenuItem onSelect={() => handleEdit(vehicle)}>Bearbeiten</DropdownMenuItem>
                            <ReportsDialog asset={vehicle} assetType="Fahrzeug" />
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
    <AddVehicleDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveVehicle} 
        vehicleToEdit={editingVehicle}
    />
    </>
  );
}
    

    