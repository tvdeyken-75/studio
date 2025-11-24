import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LohnabrechnungPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lohnabrechnung</CardTitle>
        <CardDescription>
            Verwalten Sie die Lohn- und Gehaltsabrechnungen. Dieses Modul ist in Entwicklung.
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
