import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MitarbeiterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mitarbeiter</CardTitle>
        <CardDescription>
            Verwalten Sie Ihre Mitarbeiter. Dieses Modul ist in Entwicklung.
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
