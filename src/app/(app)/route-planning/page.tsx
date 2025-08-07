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
  pickupLocation: z.string().min(3, "Pickup location is required."),
  deliveryLocation: z.string().min(3, "Delivery location is required."),
  vehicleType: z.string().min(1, "Vehicle type is required."),
  cargoDescription: z.string().min(3, "Cargo description is required."),
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
      console.error("Error generating route plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate route plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>New Transport Order</CardTitle>
          <CardDescription>Fill in the details to generate an optimized route plan.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl><Input placeholder="e.g., Berlin, Germany" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Location</FormLabel>
                    <FormControl><Input placeholder="e.g., Munich, Germany" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a vehicle" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Truck">Truck</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
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
                    <FormLabel>Cargo Description</FormLabel>
                    <FormControl><Textarea placeholder="e.g., 10 Pallets of electronics" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Instructions (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Fragile items, handle with care" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Generate Plan
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Plan</CardTitle>
          <CardDescription>The optimized route and vehicle assignment will appear here.</CardDescription>
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
                <h4 className="font-semibold">Suggested Route</h4>
                <p className="text-muted-foreground">{result.suggestedRoute}</p>
              </div>
              <div>
                <h4 className="font-semibold">Vehicle Assignment</h4>
                <p className="text-muted-foreground">{result.vehicleAssignment}</p>
              </div>
              <div>
                <h4 className="font-semibold">Estimated Travel Time</h4>
                <p className="text-muted-foreground">{result.estimatedTravelTime}</p>
              </div>
               <div>
                <h4 className="font-semibold">Potential Challenges</h4>
                <p className="text-muted-foreground">{result.potentialChallenges}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Your plan is waiting.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
