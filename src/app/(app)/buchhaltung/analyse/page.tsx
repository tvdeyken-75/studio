
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalysePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finanzanalyse</CardTitle>
        <CardDescription>
            Analysieren Sie Ihre Finanzdaten mit interaktiven Dashboards. Dieses Modul ist in Entwicklung.
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
