"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Transport } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fleetData, customerData } from "@/lib/data";

const formSchema = z.object({
  customer: z.string().min(1, "Kunde ist erforderlich."),
  pickupLocation: z.string().min(1, "Abholort ist erforderlich."),
  deliveryLocation: z.string().min(1, "Lieferort ist erforderlich."),
  plannedDeliveryDate: z.string().min(1, "Geplantes Lieferdatum ist erforderlich."),
  vehicleId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddTransportDialog({
  onAdd,
  trigger,
}: {
  onAdd: (transport: Transport) => void;
  trigger: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: "",
      pickupLocation: "",
      deliveryLocation: "",
      plannedDeliveryDate: "",
      vehicleId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const newTransport: Transport = {
      id: `transport-${Date.now()}`,
      transportNumber: `T-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "Geplant",
      actualDeliveryDate: "",
      actualPickupDate: "",
      plannedPickupDate: new Date().toISOString(),
      ...values,
    };
    onAdd(newTransport);
    toast({
      title: "Transportauftrag erstellt",
      description: `Der Auftrag für ${values.customer} wurde erfolgreich angelegt.`,
    });
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Neuen Transportauftrag anlegen</DialogTitle>
            <DialogDescription>
              Füllen Sie die Details aus, um einen neuen Transportauftrag zu
              erstellen.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <Label>Kunde</Label>
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kunde auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerData.map((customer) => (
                        <SelectItem key={customer.id} value={customer.firmenname}>
                          {customer.firmenname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.customer && <p className="text-xs text-destructive">{errors.customer.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Abholort</Label>
                <Input {...register("pickupLocation")} />
                {errors.pickupLocation && <p className="text-xs text-destructive">{errors.pickupLocation.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Lieferort</Label>
                <Input {...register("deliveryLocation")} />
                {errors.deliveryLocation && <p className="text-xs text-destructive">{errors.deliveryLocation.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>Geplantes Lieferdatum</Label>
                    <Input type="datetime-local" {...register("plannedDeliveryDate")} />
                    {errors.plannedDeliveryDate && <p className="text-xs text-destructive">{errors.plannedDeliveryDate.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label>Fahrzeug (Optional)</Label>
                    <Controller
                        name="vehicleId"
                        control={control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                            <SelectValue placeholder="Fahrzeug zuweisen" />
                            </SelectTrigger>
                            <SelectContent>
                            {fleetData.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.kennzeichen} ({vehicle.hersteller})
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Abbrechen</Button>
            </DialogClose>
            <Button type="submit">Speichern</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
