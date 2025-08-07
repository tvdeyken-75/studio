"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addressInsights } from "@/ai/flows/address-insights";
import type { AddressInsightsOutput } from "@/ai/flows/address-insights";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  address: z.string().min(10, "Bitte geben Sie eine vollständige Adresse ein."),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddressInsightsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AddressInsightsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { address: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await addressInsights(values);
      setResult(response);
    } catch (error) {
      console.error("Fehler beim Abrufen der Adressinformationen:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Einblicke konnten nicht abgerufen werden. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Standort-Analyse</CardTitle>
          <CardDescription>Geben Sie eine Adresse ein, um KI-gestützte logistische Einblicke und potenzielle Herausforderungen zu erhalten.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vollständige Adresse</FormLabel>
                    <FormControl><Input placeholder="z.B., Willy-Brandt-Straße 1, 10557 Berlin, Deutschland" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Adresse analysieren
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Logistische Analyse</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : result ? (
              <p className="text-sm text-muted-foreground">{result.insights}</p>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
