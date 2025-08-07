
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { dieselpreiseData as initialData } from '@/lib/data';
import type { Dieselpreis } from '@/types';
import { format } from 'date-fns';

const AddPreisDialog = ({ onAdd }: { onAdd: (preis: Dieselpreis) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState<Omit<Dieselpreis, 'id'>>({
        woche: '',
        von: '',
        bis: '',
        preis: 0,
        zuschlag: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSave = () => {
        if (formData.woche && formData.von && formData.bis && formData.preis > 0) {
            onAdd({ ...formData, id: `dp-${Date.now()}`});
            setIsOpen(false);
            setFormData({ woche: '', von: '', bis: '', preis: 0, zuschlag: 0 });
            toast({ title: "Neuer Preis hinzugefügt." });
        } else {
            toast({ variant: "destructive", title: "Fehler", description: "Bitte füllen Sie alle erforderlichen Felder aus."});
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-primary">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neuer Eintrag
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Neuen Dieselpreis anlegen</DialogTitle>
                    <DialogDescription>
                        Fügen Sie den Preis und Zuschlag für eine neue Kalenderwoche hinzu.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="woche">Kalenderwoche</Label>
                        <Input id="woche" value={formData.woche} onChange={handleInputChange} placeholder="z.B. KW 31" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="von">Gültig von</Label>
                            <Input id="von" type="date" value={formData.von} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="bis">Gültig bis</Label>
                            <Input id="bis" type="date" value={formData.bis} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="preis">Preis pro Liter (€)</Label>
                            <Input id="preis" type="number" step="0.01" value={formData.preis} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="zuschlag">Zuschlag (%)</Label>
                            <Input id="zuschlag" type="number" step="0.1" value={formData.zuschlag} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Abbrechen</Button>
                    <Button size="sm" onClick={handleSave}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function DieselfloaterPage() {
    const [preise, setPreise] = useState<Dieselpreis[]>(initialData);

    const addPreis = (preis: Dieselpreis) => {
        setPreise(prev => [preis, ...prev].sort((a,b) => new Date(b.von).getTime() - new Date(a.von).getTime()));
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), 'dd.MM.yyyy');
    };
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Dieselfloater-Management</CardTitle>
                        <CardDescription>Übersicht der wöchentlichen Dieselpreise und Zuschläge.</CardDescription>
                    </div>
                    <AddPreisDialog onAdd={addPreis} />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Woche</TableHead>
                            <TableHead>Gültig von</TableHead>
                            <TableHead>Gültig bis</TableHead>
                            <TableHead>Preis/Liter</TableHead>
                            <TableHead>Zuschlag</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {preise.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.woche}</TableCell>
                                <TableCell>{formatDate(p.von)}</TableCell>
                                <TableCell>{formatDate(p.bis)}</TableCell>
                                <TableCell>{formatCurrency(p.preis)}</TableCell>
                                <TableCell>{p.zuschlag.toFixed(1)}%</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Icons.more className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

