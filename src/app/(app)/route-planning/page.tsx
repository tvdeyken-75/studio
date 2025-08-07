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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  pickupLocation: z.string().min(3, "Abholort ist erforderlich."),
  deliveryLocation: z.string().min(3, "Lieferort ist erforderlich."),
  vehicleType: z.string().min(1, "Fahrzeugtyp ist erforderlich."),
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
      console.error("Fehler beim Erstellen des Routenplans:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Routenplan konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Neuer Transportauftrag</CardTitle>
          <CardDescription>Füllen Sie die Details aus, um einen optimierten Routenplan zu erstellen.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abholort</FormLabel>
                    <FormControl><Input placeholder="z.B., Berlin, Deutschland" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="z.B., München, Deutschland" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fahrzeugtyp</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Wählen Sie ein Fahrzeug" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="LKW">LKW</SelectItem>
                        <SelectItem value="Transporter">Transporter</SelectItem>
                        <SelectItem value="Sprinter">Sprinter</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormControl><Textarea placeholder="z.B., 10 Paletten Elektronik" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Besondere Anweisungen (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="z.B., Zerbrechliche Ware, vorsichtig behandeln" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Plan erstellen
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>KI-generierter Plan</CardTitle>
          <CardDescription>Die optimierte Route und Fahrzeugzuweisung werden hier angezeigt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
               <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : result ? (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold">Vorgeschlagene Route</h4>
                <p className="text-muted-foreground">{result.suggestedRoute}</p>
              </div>
              <div>
                <h4 className="font-semibold">Fahrzeugzuweisung</h4>
                <p className="text-muted-foreground">{result.vehicleAssignment}</p>
              </div>
              <div>
                <h4 className="font-semibold">Geschätzte Reisezeit</h4>
                <p className="text-muted-foreground">{result.estimatedTravelTime}</p>
              </div>
               <div>
                <h4 className="font-semibold">Mögliche Herausforderungen</h4>
                <p className="text-muted-foreground">{result.potentialChallenges}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Ihr Plan wartet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
