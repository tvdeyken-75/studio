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
  address: z.string().min(10, "Please enter a complete address."),
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
      console.error("Error getting address insights:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get insights. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Address Insights</CardTitle>
          <CardDescription>Enter an address to get AI-powered logistical insights and potential challenges.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl><Input placeholder="e.g., Willy-Brandt-Straße 1, 10557 Berlin, Germany" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Address
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Logistical Analysis</CardTitle>
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
