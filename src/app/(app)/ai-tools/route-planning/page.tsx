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

const formSchema = z.object({
  pickupLocation: z.string().min(3, "Abholort ist erforderlich."),
  deliveryLocation: z.string().min(3, "Lieferort ist erforderlich."),
  vehicleType: z.string().min(3, "Fahrzeugtyp ist erforderlich."),
  cargoDescription: z.string().min(3, "Frachtbeschreibung ist erforderlich."),
  specialInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RoutePlanningPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiPoweredRoutePlanningOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: "",
      deliveryLocation: "",
      vehicleType: "Sattelzugmaschine",
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
        description: "KI-Routenplan konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KI-gestützte Routenplanung</CardTitle>
          <CardDescription>
            Geben Sie die Transportdetails ein, um einen optimierten Routenplan von der KI zu erhalten.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abholort</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Berlin, DE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieferort</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Hamburg, DE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fahrzeugtyp</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="cargoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frachtbeschreibung</FormLabel>
                    <FormControl>
                      <Textarea placeholder="z.B. 33 Paletten, 24t, Lebensmittel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spezielle Anweisungen (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="z.B. Kühlkette einhalten, zerbrechliche Ware" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Plan generieren
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>KI-generierter Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                   <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                   <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </>
            ) : result ? (
              <>
                <div>
                  <h3 className="font-semibold">Empfohlene Route</h3>
                  <p className="text-sm text-muted-foreground">{result.suggestedRoute}</p>
                </div>
                 <div>
                  <h3 className="font-semibold">Fahrzeugzuweisung</h3>
                  <p className="text-sm text-muted-foreground">{result.vehicleAssignment}</p>
                </div>
                 <div>
                  <h3 className="font-semibold">Geschätzte Reisezeit</h3>
                  <p className="text-sm text-muted-foreground">{result.estimatedTravelTime}</p>
                </div>
                 <div>
                  <h3 className="font-semibold">Mögliche Herausforderungen</h3>
                  <p className="text-sm text-muted-foreground">{result.potentialChallenges}</p>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
