import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuftraegePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kundenberichte</CardTitle>
        <CardDescription>
            Kommunikation und E-Mail-Berichte für Kunden. Dieses Modul ist in Entwicklung.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center rounded-md border-2 border-dashed">
            <p className="text-muted-foreground">In Kürze verfügbar</p>
        </div>
      </CardContent>
    </Card>
  );
}
