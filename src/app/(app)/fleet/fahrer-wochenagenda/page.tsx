import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FahrerWochenagendaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fahrer Wochenagenda</CardTitle>
        <CardDescription>
            Planen und verwalten Sie die wöchentlichen Agenden Ihrer Fahrer. Dieses Modul ist in Entwicklung.
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
