"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuppliersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lieferanten</CardTitle>
        <CardDescription>Verwaltung der Lieferanten.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">In Entwicklung. Kommt bald!</p>
        </div>
      </CardContent>
    </Card>
  );
}
