
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { tourData } from '@/lib/data';
import { mitarbeiterData } from '@/lib/data';
import type { Tour, Mitarbeiter } from '@/types';
import { format, startOfWeek, endOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const statusColor: Record<Tour['status'], string> = {
    'Entwurf': 'bg-gray-400',
    'Geplant': 'bg-blue-500',
    'Zugewiesen': 'bg-yellow-500',
    'Unterwegs': 'bg-purple-500',
    'Abgeschlossen': 'bg-green-600',
    'Geschlossen': 'bg-gray-700',
    'Storniert': 'bg-red-600',
};

const FahrerWochenagendaPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDriverId, setSelectedDriverId] = useState<string>('all');

    const week = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }, [currentDate]);

    const drivers = useMemo(() => {
        return mitarbeiterData.filter(m => m.position.toLowerCase().includes('fahrer'));
    }, []);

    const filteredToursByDay = useMemo(() => {
        const dailyTours: { [key: string]: Tour[] } = {};

        week.forEach(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            dailyTours[dayKey] = tourData.filter(tour => {
                const tourDate = format(new Date(tour.tourDate), 'yyyy-MM-dd');
                const driverMatch = selectedDriverId === 'all' || tour.driverId === selectedDriverId;
                return tourDate === dayKey && driverMatch;
            });
        });

        return dailyTours;
    }, [week, selectedDriverId]);
    
    const getDriverName = (driverId: string | undefined) => {
        if (!driverId) return 'N/A';
        // This logic is based on how drivers are referenced in tourData (e.g., 'max-mustermann')
        // We find a matching employee by constructing a similar string from their name.
        const driver = drivers.find(d => `${d.vorname.toLowerCase()}-${d.nachname.toLowerCase()}` === driverId);
        return driver ? `${driver.vorname} ${driver.nachname}` : driverId;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle>Fahrer Wochenagenda</CardTitle>
                        <CardDescription>
                            Planen und verwalten Sie die wöchentlichen Agenden Ihrer Fahrer.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Fahrer auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Fahrer</SelectItem>
                                {drivers.map(driver => (
                                    <SelectItem key={driver.id} value={`${driver.vorname.toLowerCase()}-${driver.nachname.toLowerCase()}`}>
                                        {driver.vorname} {driver.nachname}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
                            <Icons.arrowDown className="h-4 w-4 rotate-90" />
                        </Button>
                        <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Heute</Button>
                        <Button variant="outline" size="icon" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
                            <Icons.arrowUp className="h-4 w-4 rotate-90" />
                        </Button>
                    </div>
                </div>
                 <div className="text-center text-lg font-semibold mt-4 text-muted-foreground">
                    {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'dd.MM.yyyy')} - {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'dd.MM.yyyy')}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-7 border-t">
                    {week.map(day => (
                        <div key={day.toString()} className="border-b md:border-r last:border-r-0 p-2">
                            <h3 className="font-semibold text-center text-sm mb-2">
                                {format(day, 'eee.', { locale: de })}
                                <span className="block text-xs text-muted-foreground">{format(day, 'dd.MM')}</span>
                            </h3>
                            <div className="space-y-2 min-h-[200px]">
                                {filteredToursByDay[format(day, 'yyyy-MM-dd')].map(tour => (
                                    <div key={tour.id} className="p-2 border rounded-lg bg-card shadow-sm text-xs">
                                        <div className="flex justify-between items-center mb-1">
                                             <p className="font-bold">{tour.tourNumber}</p>
                                             <Badge variant="secondary" className={cn("text-white scale-90", statusColor[tour.status])}>{tour.status}</Badge>
                                        </div>
                                        <p className="text-muted-foreground">{tour.customerReference || 'Keine Referenz'}</p>
                                        <p className="font-medium mt-1">{getDriverName(tour.driverId)}</p>
                                    </div>
                                ))}
                                {filteredToursByDay[format(day, 'yyyy-MM-dd')].length === 0 && (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-xs text-muted-foreground"></p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default FahrerWochenagendaPage;
