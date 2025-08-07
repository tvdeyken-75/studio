"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubcontractorsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subunternehmer</CardTitle>
        <CardDescription>Verwaltung der Subunternehmer.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">In Entwicklung. Kommt bald!</p>
        </div>
      </CardContent>
    </Card>
  );
}
