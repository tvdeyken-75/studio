"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INVOICE_START_NUMBER_KEY = 'invoiceStartNumber';

export default function InvoiceSettingsPage() {
    const [startInvoiceNumber, setStartInvoiceNumber] = useState("000001");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const savedNumber = localStorage.getItem(INVOICE_START_NUMBER_KEY);
        if (savedNumber) {
            setStartInvoiceNumber(savedNumber);
        }
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem(INVOICE_START_NUMBER_KEY, startInvoiceNumber);
        console.log("Saving new start invoice number:", startInvoiceNumber);
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: "Gespeichert",
                description: "Die Anfangsrechnungsnummer wurde erfolgreich aktualisiert.",
            });
        }, 1000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rechnungs-Einstellungen</CardTitle>
                <CardDescription>
                    Konfigurieren Sie die Nummerierung für Rechnungen.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Anfangsrechnungsnummer</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">RN-</span>
                        <Input 
                            id="invoiceNumber"
                            value={startInvoiceNumber}
                            onChange={(e) => setStartInvoiceNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-48"
                            maxLength={6}
                        />
                    </div>
                     <p className="text-xs text-muted-foreground">
                        Die nächste generierte Rechnungsnummer wird diese Nummer verwenden und dann inkrementieren.
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
