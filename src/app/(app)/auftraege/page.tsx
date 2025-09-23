"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { aiPoweredRoutePlanning } from "@/ai/flows/ai-powered-route-planning";
import type { AiPoweredRoutePlanningOutput } from "@/ai/flows/ai-powered-route-planning";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  pickupLocation: z.string().min(3, "Abholort ist erforderlich."),
  deliveryLocation: z.string().min(3, "Lieferort ist erforderlich."),
  vehicleType: z.string().min(3, "Fahrzeugtyp ist erforderlich."),
  cargoDescription: z.string().min(3, "Ladungsbeschreibung ist erforderlich."),
  specialInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ResultCard = ({ title, content }: { title: string; content?: string }) => (
    <div>
        <h4 className="text-sm font-semibold text-muted-foreground">{title}</h4>
        <p className="text-base">{content || "N/A"}</p>
    </div>
);

export default function KundenberichtePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiPoweredRoutePlanningOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: "",
      deliveryLocation: "",
      vehicleType: "",
      cargoDescription: "",
      specialInstructions: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await aiPoweredRoutePlanning(values);
      setResult(response);
    } catch (error) {
      console.error("Fehler bei der Routenplanung:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die KI-gestützte Routenplanung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KI-gestützte Transportplanung</CardTitle>
          <CardDescription>
            Geben Sie die Auftragsdetails ein, um einen optimierten Routen- und Fahrzeugvorschlag zu erhalten.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="pickupLocation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abholort</FormLabel>
                      <FormControl><Input placeholder="z.B. Lager Hamburg" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="deliveryLocation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieferort</FormLabel>
                      <FormControl><Input placeholder="z.B. Kunde München" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="vehicleType" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Fahrzeugtyp</FormLabel>
                        <FormControl><Input placeholder="z.B. Sattelzugmaschine" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="cargoDescription" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ladungsbeschreibung</FormLabel>
                        <FormControl><Input placeholder="z.B. 33 Paletten, 24t, Lebensmittel" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField control={form.control} name="specialInstructions" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Spezielle Anweisungen (optional)</FormLabel>
                    <FormControl><Textarea placeholder="z.B. Kühlkette einhalten, Anlieferung nur bis 16 Uhr" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Planung erstellen
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Planungsvorschlag</CardTitle>
             <CardDescription>
                Basierend auf Ihren Eingaben wurde folgender Plan erstellt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Separator />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Separator />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : result ? (
              <div className="space-y-4">
                <ResultCard title="Empfohlene Route" content={result.suggestedRoute} />
                <Separator />
                <ResultCard title="Fahrzeugzuweisung" content={result.vehicleAssignment} />
                 <Separator />
                <ResultCard title="Geschätzte Reisezeit" content={result.estimatedTravelTime} />
                 <Separator />
                <ResultCard title="Potenzielle Herausforderungen" content={result.potentialChallenges} />
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
