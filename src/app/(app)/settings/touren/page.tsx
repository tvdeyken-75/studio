"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TOUR_START_NUMBER_KEY = 'tourStartNumber';

export default function TourSettingsPage() {
    const [startTourNumber, setStartTourNumber] = useState("00001");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const savedNumber = localStorage.getItem(TOUR_START_NUMBER_KEY);
        if (savedNumber) {
            setStartTourNumber(savedNumber);
        }
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem(TOUR_START_NUMBER_KEY, startTourNumber);
        console.log("Saving new start tour number:", startTourNumber);
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: "Gespeichert",
                description: "Die Anfangstournummer wurde erfolgreich aktualisiert.",
            });
        }, 1000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Touren-Einstellungen</CardTitle>
                <CardDescription>
                    Konfigurieren Sie die Nummerierung für Touren.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="tourNumber">Anfangstournummer</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">T-</span>
                        <Input 
                            id="tourNumber"
                            value={startTourNumber}
                            onChange={(e) => setStartTourNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-48"
                            maxLength={5}
                        />
                    </div>
                     <p className="text-xs text-muted-foreground">
                        Die nächste generierte Tournummer wird diese Nummer verwenden und dann inkrementieren.
                     </p>
                </div>
            </CardContent>
             <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Speichern
                </Button>
            </CardFooter>
        </Card>
    );
}
