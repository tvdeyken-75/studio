"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

// Mock data representing the navigation items
const initialNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { id: 'route-planning', label: 'Routenplanung', icon: Icons.route },
  { id: 'address-insights', label: 'Standort-Analyse', icon: Icons.address },
  { id: 'fleet', label: 'Fuhrpark', icon: Icons.fleet },
  { id: 'customers', label: 'Beziehungsmanagement', icon: Icons.customers },
  { id: 'auftraege', label: 'Aufträge', icon: Icons.orders },
  { id: 'reports', label: 'Transportoverview', icon: Icons.reports },
  { id: 'buchhaltung', label: 'Buchhaltung', icon: Icons.accounting },
  { id: 'master-data', label: 'Stammdaten', icon: Icons.database },
  { id: 'adminpanel', label: 'Adminpanel', icon: Icons.admin },
  { id: 'settings', label: 'Einstellungen', icon: Icons.settings },
];


export default function SettingsPage() {
    const [menuItems, setMenuItems] = useState(initialNavItems);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        console.log("Saving new menu order:", menuItems.map(item => item.id));
        // In a real application, you would save this order to a database or user settings.
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Menü-Einstellungen</CardTitle>
                            <CardDescription>
                                Passen Sie die Reihenfolge der Menüpunkte in der Seitenleiste an. Drag & Drop zur Neuanordnung.
                            </CardDescription>
                        </div>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Speichern
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-muted/40 rounded-lg space-y-2">
                         {menuItems.map((item, index) => (
                            <div key={item.id} className="flex items-center p-3 bg-background rounded-md shadow-sm border">
                                <item.icon className="h-5 w-5 mr-4 text-muted-foreground" />
                                <span className="flex-grow font-medium">{item.label}</span>
                                <Button variant="ghost" size="icon" className="cursor-grab">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                </Button>
                            </div>
                        ))}
                    </div>
                     <p className="text-xs text-muted-foreground mt-4">
                        Die Drag-and-Drop-Funktionalität ist in Entwicklung.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
