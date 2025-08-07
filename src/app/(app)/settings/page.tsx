"use client";

import { useState } from "react";
import { useMenu } from "@/context/menu-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";


export default function SettingsPage() {
    const { menuItems, setMenuItems } = useMenu();
    const [isSaving, setIsSaving] = useState(false);

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...menuItems];
        const item = newItems[index];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        newItems[index] = newItems[swapIndex];
        newItems[swapIndex] = item;
        setMenuItems(newItems);
    };

    const handleSave = () => {
        setIsSaving(true);
        // In a real application, you would save this order to a user's settings, e.g., in localStorage or a database.
        console.log("Saving new menu order:", menuItems.map(item => item.id));
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
                                Passen Sie die Reihenfolge der Menüpunkte in der Seitenleiste an.
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
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                                        <Icons.arrowUp className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'down')} disabled={index === menuItems.length - 1}>
                                       <Icons.arrowDown className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
