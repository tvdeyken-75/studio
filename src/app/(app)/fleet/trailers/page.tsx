
"use client";

import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trailerData as initialTrailerData } from "@/lib/data";
import type { Trailer, Document, Report } from "@/types";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";


const AddTrailerDialog = ({ onAdd }: { onAdd: (trailer: Trailer) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialFormState: Omit<Trailer, 'location' | 'capacity'> = {
    id: `t${Date.now()}`,
    kennzeichen: "", hersteller: "", modell: "", fahrgestellnummer: "",
    baujahr: new Date().getFullYear(), anhaengerTyp: 'Kofferauflieger', fuhrparkNummer: "",
    achsenanzahl: 3, nutzlastKg: 27000, gesamtgewichtKg: 35000, ladevolumenCbm: 90,
    bremsenTyp: 'Scheibe', tuevBis: "", spBis: "", versicherungsnummer: "",
    zulassungsdatum: new Date().toISOString().split('T')[0], status: 'Aktiv',
    tourStatus: 'Verfügbar',
  };

  const [formData, setFormData] = useState<Omit<Trailer, 'location' | 'capacity'>>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData((prev) => ({ ...prev, [id]: isNumber ? parseFloat(value) || 0 : value }));
  };

  const handleSelectChange = (id: keyof Trailer, value: string) => {
    setFormData((prev) => ({...prev, [id]: value }));
  };

  const handleAdd = () => {
    if (formData.kennzeichen && formData.hersteller && formData.modell) {
      onAdd({ ...formData, location: '', capacity: '' });
      setFormData(initialFormState);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary">
          <Icons.add className="mr-2 h-4 w-4" />
          Neuer Anhänger
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Neuen Anhänger anlegen</DialogTitle>
          <DialogDescription>
            Füllen Sie die Details für den neuen Anhänger aus.
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
              <div className="space-y-1.5"><Label>Anhängertyp</Label>
                <Select onValueChange={(v) => handleSelectChange('anhaengerTyp', v)} defaultValue={formData.anhaengerTyp}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kofferauflieger">Kofferauflieger</SelectItem>
                    <SelectItem value="Schiebeplanenauflieger">Schiebeplanenauflieger</SelectItem>
                    <SelectItem value="Kippauflieger">Kippauflieger</SelectItem>
                    <SelectItem value="Plane">Plane</SelectItem>
                    <SelectItem value="Kühl">Kühl</SelectItem>
                    <SelectItem value="Container">Container</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Interne Fuhrpark-Nr.</Label><Input id="fuhrparkNummer" value={formData.fuhrparkNummer} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>Status</Label>
                <Select onValueChange={(v) => handleSelectChange('status', v)} defaultValue={formData.status}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktiv">Aktiv</SelectItem>
                    <SelectItem value="In Werkstatt">In Werkstatt</SelectItem>
                    <SelectItem value="Verkauft">Verkauft</SelectItem>
                    <SelectItem value="Ausgemustert">Ausgemustert</SelectItem>
                    </SelectContent>
                </Select>
              </div>
          </div>
           {/* Section 2: Technical */}
          <div className="md:col-span-1 space-y-4">
               <h4 className="font-semibold text-base">Technische Daten</h4>
                <div className="space-y-1.5"><Label>Anzahl Achsen</Label><Input id="achsenanzahl" type="number" value={formData.achsenanzahl} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Nutzlast (kg)</Label><Input id="nutzlastKg" type="number" value={formData.nutzlastKg} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Gesamtgewicht (kg)</Label><Input id="gesamtgewichtKg" type="number" value={formData.gesamtgewichtKg} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Ladevolumen (cbm)</Label><Input id="ladevolumenCbm" type="number" value={formData.ladevolumenCbm} onChange={handleInputChange} className="h-9"/></div>
                <div className="space-y-1.5"><Label>Bremsentyp</Label>
                    <Select onValueChange={(v) => handleSelectChange('bremsenTyp', v)} defaultValue={formData.bremsenTyp}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Scheibe">Scheibe</SelectItem><SelectItem value="Trommel">Trommel</SelectItem></SelectContent>
                    </Select>
                </div>
          </div>
           {/* Section 3: Documents */}
          <div className="md:col-span-1 space-y-4">
              <h4 className="font-semibold text-base">Dokumente & Fristen</h4>
               <div className="space-y-1.5"><Label>TÜV bis</Label><Input id="tuevBis" type="date" value={formData.tuevBis} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>SP bis</Label><Input id="spBis" type="date" value={formData.spBis} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>Versicherungsnummer</Label><Input id="versicherungsnummer" value={formData.versicherungsnummer} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>Zulassungsdatum</Label><Input id="zulassungsdatum" type="date" value={formData.zulassungsdatum} onChange={handleInputChange} className="h-9"/></div>
               <div className="space-y-1.5"><Label>Aktuell gekuppelt mit</Label><Input id="aktuellGekuppeltMitLkwId" value={formData.aktuellGekuppeltMitLkwId || ''} onChange={handleInputChange} className="h-9" placeholder="LKW Kennzeichen"/></div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">Abbrechen</Button>
          <Button onClick={handleAdd} size="sm">Hinzufügen</Button>
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

const ReportsDialog = ({ asset, assetType }: { asset: Trailer, assetType: 'Fahrzeug' | 'Anhänger' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  // Mock reports data
  const [reports, setReports] = useState<Report[]>([
    { id: 'rep1', assetId: asset.id, type: 'TÜV', date: '2024-06-10', description: 'Hauptuntersuchung bestanden.', documents: [] },
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
                            Keine Berichte für diesen Anhänger vorhanden.
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


export default function TrailersPage() {
  const [trailers, setTrailers] = useState<Trailer[]>(initialTrailerData);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const statusMap = {
    'Aktiv': 'Aktiv',
    'In Werkstatt': 'In Werkstatt',
    'Verkauft': 'Verkauft',
    'Ausgemustert': 'Ausgemustert'
  };

  const addTrailer = (trailer: Trailer) => {
    setTrailers(prev => [trailer, ...prev]);
    toast({ title: 'Anhänger hinzugefügt', description: `Der Anhänger ${trailer.kennzeichen} wurde erfolgreich angelegt.` });
  };
  
   const filteredTrailers = useMemo(() => {
    if (!searchTerm) return trailers;
    const lowercasedTerm = searchTerm.toLowerCase();
    return trailers.filter(trailer => 
        Object.values(trailer).some(value =>
            String(value).toLowerCase().includes(lowercasedTerm)
        )
    );
  }, [trailers, searchTerm]);

  const [columnVisibility, setColumnVisibility] = useState({
      kennzeichen: true,
      hersteller: true,
      anhaengerTyp: true,
      status: true,
      tourStatus: true,
      aktuellGekuppeltMitLkwId: true,
      tuevBis: true,
      fuhrparkNummer: false,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
     toast({ title: "Info", description: "CSV-Import wird in Kürze implementiert."});
     event.target.value = '';
  };
  const downloadCSVTemplate = () => {
    toast({ title: "Info", description: "CSV-Vorlagen-Download wird in Kürze implementiert."});
  };
  const exportCSV = () => {
    toast({ title: "Info", description: "CSV-Export wird in Kürze implementiert."});
  }

  type ColumnKeys = keyof typeof columnVisibility;
  const toggleColumn = (column: ColumnKeys) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
  }
  const columnLabels: Record<ColumnKeys, string> = {
    kennzeichen: "Kennzeichen",
    hersteller: "Hersteller",
    anhaengerTyp: "Typ",
    status: "Status",
    tourStatus: "Tour-Status",
    aktuellGekuppeltMitLkwId: "Gekuppelt mit",
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
              <CardTitle>Anhänger</CardTitle>
              <CardDescription>Eine Übersicht aller Anhänger in Ihrem Fuhrpark.</CardDescription>
            </div>
            <AddTrailerDialog onAdd={addTrailer} />
        </div>
      </CardHeader>
       <div className="p-4 border-b border-t flex justify-between items-center gap-4">
             <Input 
                placeholder="Anhänger durchsuchen..."
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
              {columnVisibility.anhaengerTyp && <TableHead>Typ</TableHead>}
              {columnVisibility.tourStatus && <TableHead>Tour-Status</TableHead>}
              {columnVisibility.aktuellGekuppeltMitLkwId && <TableHead>Gekuppelt mit</TableHead>}
              {columnVisibility.tuevBis && <TableHead>TÜV bis</TableHead>}
              {columnVisibility.fuhrparkNummer && <TableHead>Fuhrpark-Nr.</TableHead>}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrailers.map((trailer) => (
              <TableRow key={trailer.id}>
                {columnVisibility.kennzeichen && <TableCell className="font-medium">{trailer.kennzeichen}</TableCell>}
                {columnVisibility.hersteller && <TableCell>{trailer.hersteller}</TableCell>}
                {columnVisibility.anhaengerTyp && <TableCell>{trailer.anhaengerTyp}</TableCell>}
                 {columnVisibility.tourStatus && <TableCell>
                    <Badge variant={trailer.tourStatus === 'Verfügbar' ? 'secondary' : 'default'}>
                        {trailer.tourStatus}
                    </Badge>
                </TableCell>}
                {columnVisibility.aktuellGekuppeltMitLkwId && <TableCell>{trailer.aktuellGekuppeltMitLkwId || 'N/A'}</TableCell>}
                {columnVisibility.tuevBis && <TableCell>{formatDate(trailer.tuevBis)}</TableCell>}
                {columnVisibility.fuhrparkNummer && <TableCell>{trailer.fuhrparkNummer}</TableCell>}
                {columnVisibility.status && <TableCell>
                  <Badge
                    variant={trailer.status === 'Aktiv' ? 'default' : trailer.status === 'In Werkstatt' ? 'destructive' : 'secondary'}
                    className={cn(trailer.status === 'Aktiv' && "bg-green-600 hover:bg-green-700 text-white")}
                  >
                    {statusMap[trailer.status]}
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
                            <ReportsDialog asset={trailer} assetType="Anhänger" />
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

    
