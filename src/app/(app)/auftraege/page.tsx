
"use client";

import { useState, useMemo } from 'react';
import type { Transport } from '@/types';
import { transportData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AddTransportDialog } from './vorbereiten/AddTransportDialog';
import { useToast } from '@/hooks/use-toast';

const statusColors: { [key: string]: string } = {
  Geplant: 'bg-blue-500',
  'In Vorbereitung': 'bg-yellow-500',
  'Bereit zur Abholung': 'bg-green-500',
  Unterwegs: 'bg-purple-500',
  Abgeschlossen: 'bg-gray-500',
  Storniert: 'bg-red-500',
};

export default function TransportanfragenPage() {
    const [transports, setTransports] = useState<Transport[]>(transportData.filter(t => t.status === 'Geplant' || t.status === 'In Vorbereitung'));
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const addTransport = (transport: Transport) => {
        setTransports(prev => [transport, ...prev]);
    }
    
    const deleteTransport = (id: string) => {
        setTransports(prev => prev.filter(t => t.id !== id));
        toast({ title: 'Transportanfrage gelöscht' });
    }

    const filteredTransports = useMemo(() => {
        if (!searchTerm) return transports;
        const lowercasedTerm = searchTerm.toLowerCase();
        return transports.filter(transport => 
            Object.values(transport).some(value => 
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [transports, searchTerm]);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
        } catch {
            return 'Ungültiges Datum';
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Transportanfragen</CardTitle>
                        <CardDescription>
                            Vorläufige Transportaufträge erfassen und verwalten.
                        </CardDescription>
                    </div>
                    <AddTransportDialog 
                        onAdd={addTransport}
                        trigger={
                            <Button variant="link">
                                <Icons.add className="mr-2 h-4 w-4" />
                                Neue Transportanfrage
                            </Button>
                        } 
                    />
                </div>
            </CardHeader>
            <div className="p-4 border-b border-t">
                 <Input 
                    placeholder="Anfragen durchsuchen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-md h-9"
                />
            </div>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Auftrags-Nr.</TableHead>
                            <TableHead>Kunde</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Abholung</TableHead>
                            <TableHead>Lieferung</TableHead>
                            <TableHead>Gepl. Lieferung</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransports.length > 0 ? (
                            filteredTransports.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.transportNumber}</TableCell>
                                    <TableCell>{t.customer}</TableCell>
                                    <TableCell>
                                        <Badge style={{ backgroundColor: statusColors[t.status] }} className="text-white">
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{t.pickupLocation}</TableCell>
                                    <TableCell>{t.deliveryLocation}</TableCell>
                                    <TableCell>{formatDate(t.plannedDeliveryDate)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Icons.more className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                                                <DropdownMenuItem>In Auftrag umwandeln</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => deleteTransport(t.id)} className="text-destructive">Löschen</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Keine Transportanfragen gefunden.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
