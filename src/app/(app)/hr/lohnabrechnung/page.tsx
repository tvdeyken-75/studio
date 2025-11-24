
"use client";

import { useState, useMemo } from 'react';
import type { Lohnabrechnung, Mitarbeiter } from '@/types';
import { lohnabrechnungsData, mitarbeiterData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, getYear, getMonth } from 'date-fns';
import { de } from 'date-fns/locale';

const formatCurrency = (value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

// Simplified payroll calculation logic
const calculatePayroll = (bruttogehalt: number): Partial<Lohnabrechnung> => {
    const lohnsteuer = bruttogehalt * 0.18; // Simplified tax rate
    const krankenversicherung = bruttogehalt * 0.073;
    const rentenversicherung = bruttogehalt * 0.093;
    const arbeitslosenversicherung = bruttogehalt * 0.013;
    const pflegeversicherung = bruttogehalt * 0.017;
    const abzuegeGesamt = lohnsteuer + krankenversicherung + rentenversicherung + arbeitslosenversicherung + pflegeversicherung;
    const nettogehalt = bruttogehalt - abzuegeGesamt;

    return {
        lohnsteuer,
        krankenversicherung,
        rentenversicherung,
        arbeitslosenversicherung,
        pflegeversicherung,
        abzuegeGesamt,
        nettogehalt,
        auszahlungsbetrag: nettogehalt,
    };
};

const AddLohnabrechnungDialog = ({ onSave, children }: { onSave: (data: Lohnabrechnung) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mitarbeiterId, setMitarbeiterId] = useState('');
    const [abrechnungsmonat, setAbrechnungsmonat] = useState(format(new Date(), 'yyyy-MM'));
    const [bruttogehalt, setBruttogehalt] = useState(3000);
    const { toast } = useToast();

    const handleSave = () => {
        if (!mitarbeiterId || !abrechnungsmonat) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Bitte wählen Sie einen Mitarbeiter und einen Monat aus.' });
            return;
        }

        const calculations = calculatePayroll(bruttogehalt);

        const newAbrechnung: Lohnabrechnung = {
            id: `L-${Date.now()}`,
            mitarbeiterId,
            abrechnungsmonat,
            bruttogehalt,
            ...calculations,
            solidaritaetszuschlag: 0,
            kirchensteuer: 0,
            status: 'Entwurf',
            erstelltAm: new Date().toISOString(),
        } as Lohnabrechnung;

        onSave(newAbrechnung);
        toast({ title: 'Abrechnung erstellt', description: `Die Lohnabrechnung für den ausgewählten Mitarbeiter wurde als Entwurf gespeichert.` });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Neue Lohnabrechnung erstellen</DialogTitle>
                    <DialogDescription>
                        Wählen Sie Mitarbeiter, Zeitraum und Bruttogehalt aus, um eine neue Abrechnung zu generieren.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                        <Label>Mitarbeiter</Label>
                        <Select onValueChange={setMitarbeiterId}>
                            <SelectTrigger><SelectValue placeholder="Mitarbeiter auswählen..." /></SelectTrigger>
                            <SelectContent>
                                {mitarbeiterData.map(m => (
                                    <SelectItem key={m.id} value={m.id}>{m.nachname}, {m.vorname} ({m.personalnummer})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Abrechnungsmonat</Label>
                            <Input type="month" value={abrechnungsmonat} onChange={e => setAbrechnungsmonat(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Bruttogehalt (€)</Label>
                            <Input type="number" value={bruttogehalt} onChange={e => setBruttogehalt(Number(e.target.value))} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Abbrechen</Button></DialogClose>
                    <Button onClick={handleSave}>Abrechnung erstellen</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function LohnabrechnungPage() {
    const [abrechnungen, setAbrechnungen] = useState<Lohnabrechnung[]>(lohnabrechnungsData);
    const [filterYear, setFilterYear] = useState(getYear(new Date()).toString());
    const [filterMonth, setFilterMonth] = useState('all');

    const years = useMemo(() => [...new Set(abrechnungen.map(a => format(new Date(a.abrechnungsmonat), 'yyyy')))], [abrechnungen]);
    const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString().padStart(2, '0'), label: format(new Date(2000, i), 'MMMM', { locale: de }) }));
    
    const handleSaveAbrechnung = (data: Lohnabrechnung) => {
        setAbrechnungen(prev => [data, ...prev]);
    };
    
    const updateStatus = (id: string, status: Lohnabrechnung['status']) => {
        setAbrechnungen(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }

    const filteredAbrechnungen = useMemo(() => {
        return abrechnungen.filter(a => {
            const date = new Date(a.abrechnungsmonat);
            const yearMatch = format(date, 'yyyy') === filterYear;
            const monthMatch = filterMonth === 'all' || format(date, 'MM') === filterMonth;
            return yearMatch && monthMatch;
        });
    }, [abrechnungen, filterYear, filterMonth]);
    
    const statusVariant: Record<Lohnabrechnung['status'], 'default' | 'secondary' | 'destructive'> = {
        'Entwurf': 'secondary',
        'Freigegeben': 'default',
        'Ausgezahlt': 'default'
    };
    
     const statusColor: Record<Lohnabrechnung['status'], string> = {
        'Entwurf': 'bg-gray-400',
        'Freigegeben': 'bg-blue-500',
        'Ausgezahlt': 'bg-green-600',
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Lohnabrechnung</CardTitle>
                        <CardDescription>
                            Verwalten Sie die Lohn- und Gehaltsabrechnungen Ihrer Mitarbeiter.
                        </CardDescription>
                    </div>
                     <AddLohnabrechnungDialog onSave={handleSaveAbrechnung}>
                        <Button variant="link" className="text-primary">
                            <Icons.add className="mr-2 h-4 w-4" />
                            Neue Abrechnung
                        </Button>
                    </AddLohnabrechnungDialog>
                </div>
            </CardHeader>
            <div className="p-4 border-b border-t flex justify-end items-center gap-2">
                 <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Monat filtern..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Monate</SelectItem>
                        {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="w-[120px] h-9">
                        <SelectValue placeholder="Jahr filtern..." />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Monat</TableHead>
                            <TableHead>Mitarbeiter</TableHead>
                            <TableHead>Bruttogehalt</TableHead>
                            <TableHead>Abzüge</TableHead>
                            <TableHead>Nettogehalt</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAbrechnungen.length > 0 ? filteredAbrechnungen.map(a => {
                            const mitarbeiter = mitarbeiterData.find(m => m.id === a.mitarbeiterId);
                            return (
                                <TableRow key={a.id}>
                                    <TableCell>{format(new Date(a.abrechnungsmonat), 'MMMM yyyy', { locale: de })}</TableCell>
                                    <TableCell>{mitarbeiter ? `${mitarbeiter.nachname}, ${mitarbeiter.vorname}` : 'Unbekannt'}</TableCell>
                                    <TableCell>{formatCurrency(a.bruttogehalt)}</TableCell>
                                    <TableCell>{formatCurrency(a.abzuegeGesamt)}</TableCell>
                                    <TableCell className="font-semibold">{formatCurrency(a.nettogehalt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[a.status]} className={`${statusColor[a.status]} text-white`}>
                                            {a.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><Icons.more className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
                                                <DropdownMenuItem disabled={a.status !== 'Entwurf'} onClick={() => updateStatus(a.id, 'Freigegeben')}>Freigeben</DropdownMenuItem>
                                                <DropdownMenuItem disabled={a.status !== 'Freigegeben'} onClick={() => updateStatus(a.id, 'Ausgezahlt')}>Als ausgezahlt markieren</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Keine Abrechnungen für den ausgewählten Zeitraum gefunden.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
