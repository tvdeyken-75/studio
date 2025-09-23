"use client";

import { useState, useMemo, useRef } from "react";
import type { Document, Customer, Vehicle, Trailer, Transport, Invoice } from "@/types";
import { documentData, customerData, fleetData, trailerData, transportData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UploadDocumentDialog = ({ onAdd }: { onAdd: (doc: Document) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState<Document['type']>('Sonstiges');
    const [notes, setNotes] = useState("");
    const [associationCategory, setAssociationCategory] = useState<string>("");
    const [associationId, setAssociationId] = useState<string>("");
    const [associationName, setAssociationName] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSave = () => {
        if (!file) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte wählen Sie eine Datei aus.' });
            return;
        }
        if (!associationCategory || !associationId) {
             toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte wählen Sie eine Zuordnung aus.' });
            return;
        }

        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: documentType,
            date: new Date().toISOString(),
            fileUrl: URL.createObjectURL(file), // In a real app, this would be a URL from a storage service
            notes,
            zuordnung: {
                kategorie: associationCategory as any,
                id: associationId,
                name: associationName,
            }
        };

        onAdd(newDoc);
        toast({ title: 'Dokument hochgeladen', description: `${file.name} wurde erfolgreich hinzugefügt.` });
        
        // Reset state and close dialog
        setFile(null);
        setDocumentType('Sonstiges');
        setNotes('');
        setAssociationCategory('');
        setAssociationId('');
        setIsOpen(false);
    };
    
    const associationOptions = useMemo(() => {
        switch(associationCategory) {
            case 'Kunde':
                return customerData.map(c => ({ value: c.id, label: c.firmenname }));
            case 'Fahrzeug':
                return fleetData.map(v => ({ value: v.id, label: `${v.kennzeichen} (${v.hersteller} ${v.modell})` }));
            case 'Anhänger':
                 return trailerData.map(t => ({ value: t.id, label: `${t.kennzeichen} (${t.hersteller})` }));
            case 'Transportauftrag':
                 return transportData.map(t => ({ value: t.id, label: `${t.transportNumber} (${t.customer})` }));
            default:
                return [];
        }
    }, [associationCategory]);
    
    const handleAssociationSelect = (id: string) => {
        const selectedOption = associationOptions.find(opt => opt.value === id);
        if (selectedOption) {
            setAssociationId(id);
            setAssociationName(selectedOption.label);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-primary">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Dokument hochladen
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Neues Dokument hochladen</DialogTitle>
                    <DialogDescription>
                        Laden Sie eine Datei hoch und ordnen Sie sie einem Bereich zu.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                        <Label>Datei</Label>
                        <Input type="file" ref={fileInputRef} onChange={handleFileChange} />
                        {file && <p className="text-sm text-muted-foreground mt-1">Ausgewählt: {file.name}</p>}
                    </div>
                     <div className="space-y-1.5">
                        <Label>Dokumententyp</Label>
                        <Select onValueChange={(v) => setDocumentType(v as Document['type'])} defaultValue={documentType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Rechnung">Rechnung</SelectItem>
                                <SelectItem value="Lieferschein">Lieferschein</SelectItem>
                                <SelectItem value="TÜV">TÜV/SP Bericht</SelectItem>
                                <SelectItem value="Schaden">Schadensprotokoll</SelectItem>
                                <SelectItem value="Wartung">Wartungsnachweis</SelectItem>
                                <SelectItem value="Vertrag">Vertrag</SelectItem>
                                <SelectItem value="Foto">Foto</SelectItem>
                                <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Zuordnung Kategorie</Label>
                            <Select onValueChange={setAssociationCategory}>
                                <SelectTrigger><SelectValue placeholder="Kategorie wählen..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Kunde">Kunde</SelectItem>
                                    <SelectItem value="Fahrzeug">Fahrzeug</SelectItem>
                                    <SelectItem value="Anhänger">Anhänger</SelectItem>
                                    <SelectItem value="Transportauftrag">Transportauftrag</SelectItem>
                                    <SelectItem value="Buchhaltung">Buchhaltung</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1.5">
                            <Label>Zuordnung</Label>
                             <Select onValueChange={handleAssociationSelect} disabled={!associationCategory || associationOptions.length === 0}>
                                <SelectTrigger><SelectValue placeholder={associationCategory ? "Objekt wählen..." : "Erst Kategorie wählen"} /></SelectTrigger>
                                <SelectContent>
                                    {associationOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Notizen (Optional)</Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Zusätzliche Informationen..." />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Abbrechen</Button></DialogClose>
                    <Button onClick={handleSave}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function DokumentePage() {
    const [documents, setDocuments] = useState<Document[]>(documentData);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const addDocument = (doc: Document) => {
        setDocuments(prev => [doc, ...prev]);
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        toast({ title: 'Dokument gelöscht.' });
    };

    const filteredDocuments = useMemo(() => {
        if (!searchTerm) return documents;
        const lowercasedTerm = searchTerm.toLowerCase();
        return documents.filter(doc => 
            doc.name.toLowerCase().includes(lowercasedTerm) ||
            doc.type.toLowerCase().includes(lowercasedTerm) ||
            (doc.zuordnung?.kategorie.toLowerCase().includes(lowercasedTerm)) ||
            (doc.zuordnung?.name.toLowerCase().includes(lowercasedTerm))
        );
    }, [documents, searchTerm]);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd.MM.yyyy');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Dokumentenverwaltung</CardTitle>
                        <CardDescription>
                            Zentraler Ort für alle Ihre Dokumente und Fotos.
                        </CardDescription>
                    </div>
                    <UploadDocumentDialog onAdd={addDocument} />
                </div>
            </CardHeader>
            <div className="p-4 border-t border-b">
                 <Input 
                    placeholder="Dokumente durchsuchen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-md h-9"
                />
            </div>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Dateiname</TableHead>
                            <TableHead>Typ</TableHead>
                            <TableHead>Hochgeladen am</TableHead>
                            <TableHead>Zugeordnet zu</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map(doc => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell><Badge variant="outline">{doc.type}</Badge></TableCell>
                                    <TableCell>{formatDate(doc.date)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">{doc.zuordnung.kategorie}</span>
                                            <span>{doc.zuordnung.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Icons.more className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">Anzeigen</a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => deleteDocument(doc.id)} className="text-destructive">
                                                    Löschen
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Keine Dokumente gefunden.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
