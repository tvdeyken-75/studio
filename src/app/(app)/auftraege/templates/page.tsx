"use client";

import { useState } from "react";
import type { TripTemplate, TourStop, Address } from "@/types";
import { tripTemplateData, addressData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddTemplateDialog = ({
  onAdd,
  templateToEdit,
  children
}: {
  onAdd: (template: TripTemplate) => void;
  templateToEdit?: TripTemplate | null;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!templateToEdit;

  const getDefaultValues = () => {
    if (isEditMode && templateToEdit) {
      return templateToEdit;
    }
    const pickupStop: Omit<TourStop, 'kilometers' | 'actualDateTime'> = {
      id: `stop-pickup-${Date.now()}`,
      stopSequence: 1,
      type: 'Pickup',
      addressId: '',
      addressName: '',
      location: '',
      plannedDateTime: '',
      goodsDescription: '',
      status: 'Planned',
    };
     const deliveryStop: Omit<TourStop, 'kilometers' | 'actualDateTime'> = {
      id: `stop-delivery-${Date.now()}`,
      stopSequence: 2,
      type: 'Delivery',
      addressId: '',
      addressName: '',
      location: '',
      plannedDateTime: '',
      goodsDescription: '',
      status: 'Planned',
    };
    return {
      id: `template-${Date.now()}`,
      name: "",
      description: "",
      stops: [pickupStop, deliveryStop],
    };
  };

  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<TripTemplate>({
    defaultValues: getDefaultValues(),
  });


  const onSubmit = (data: TripTemplate) => {
    onAdd(data);
    toast({
      title: isEditMode ? "Vorlage aktualisiert" : "Vorlage erstellt",
      description: `Die Vorlage "${data.name}" wurde gespeichert.`,
    });
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (open) reset(getDefaultValues());
        setIsOpen(open);
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Vorlage bearbeiten" : "Neue Trip-Vorlage erstellen"}
            </DialogTitle>
            <DialogDescription>
              Definieren Sie eine wiederverwendbare Vorlage für Ihre Standardtouren (Abholung & Lieferung).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-1.5">
              <Label>Name der Vorlage</Label>
              <Input {...register("name", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Beschreibung</Label>
              <Textarea {...register("description")} />
            </div>
            
            <div className="space-y-3">
                {/* Pickup Stop */}
                <div className="p-3 border rounded-md bg-muted/50 space-y-3">
                    <h4 className="font-medium text-sm">Abholung</h4>
                     <div className="space-y-1.5">
                        <Label>Abholadresse</Label>
                        <Controller
                            name="stops.0.addressId"
                            control={control}
                            rules={{ required: "Abholadresse ist erforderlich" }}
                            render={({ field }) => (
                                <Select onValueChange={(val) => {
                                    field.onChange(val);
                                    const address = addressData.find(a => a.id === val);
                                    setValue(`stops.0.addressName`, address?.name || '');
                                    setValue(`stops.0.location`, `${address?.plz} ${address?.stadt}`);
                                }} value={field.value}>
                                    <SelectTrigger className="h-9 bg-background"><SelectValue placeholder="Adresse auswählen..." /></SelectTrigger>
                                    <SelectContent>
                                        {addressData.map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.kurzname})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.stops?.[0]?.addressId && <p className="text-xs text-destructive">{errors.stops[0].addressId.message}</p>}
                    </div>
                </div>

                {/* Delivery Stop */}
                <div className="p-3 border rounded-md bg-muted/50 space-y-3">
                    <h4 className="font-medium text-sm">Lieferung</h4>
                     <div className="space-y-1.5">
                        <Label>Lieferadresse</Label>
                        <Controller
                            name="stops.1.addressId"
                            control={control}
                            rules={{ required: "Lieferadresse ist erforderlich" }}
                            render={({ field }) => (
                                <Select onValueChange={(val) => {
                                    field.onChange(val);
                                    const address = addressData.find(a => a.id === val);
                                    setValue(`stops.1.addressName`, address?.name || '');
                                    setValue(`stops.1.location`, `${address?.plz} ${address?.stadt}`);
                                }} value={field.value}>
                                    <SelectTrigger className="h-9 bg-background"><SelectValue placeholder="Adresse auswählen..." /></SelectTrigger>
                                    <SelectContent>
                                        {addressData.map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.kurzname})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.stops?.[1]?.addressId && <p className="text-xs text-destructive">{errors.stops[1].addressId.message}</p>}
                    </div>
                </div>
                 <div className="space-y-1.5">
                    <Label>Frachtbeschreibung (Standard)</Label>
                    <Textarea {...register(`stops.0.goodsDescription`)} placeholder="z.B. 24t, 33 Paletten" rows={2}/>
                </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="ghost">Abbrechen</Button></DialogClose>
            <Button type="submit">Vorlage speichern</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function TripTemplatesPage() {
  const [templates, setTemplates] = useState<TripTemplate[]>(tripTemplateData);

  const addOrUpdateTemplate = (template: TripTemplate) => {
    // Also update the goods description for the delivery stop
    const finalTemplate = {
        ...template,
        stops: [
            template.stops[0],
            {...template.stops[1], goodsDescription: template.stops[0].goodsDescription}
        ]
    };

    setTemplates(prev => {
        const index = prev.findIndex(t => t.id === finalTemplate.id);
        if (index > -1) {
            const newTemplates = [...prev];
            newTemplates[index] = finalTemplate;
            return newTemplates;
        }
        return [finalTemplate, ...prev];
    })
  }
  
  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold">Trip Templates</h1>
                <p className="text-muted-foreground">Erstellen und verwalten Sie wiederkehrende Touren als Vorlagen.</p>
            </div>
            <AddTemplateDialog onAdd={addOrUpdateTemplate}>
                <Button>
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neue Vorlage erstellen
                </Button>
            </AddTemplateDialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
                <Card key={template.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="text-sm space-y-2">
                             <div className="flex items-start gap-2">
                                <span className="text-muted-foreground font-semibold w-20">Von:</span>
                                <span className="font-medium">{template.stops[0]?.addressName || 'N/A'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-muted-foreground font-semibold w-20">Nach:</span>
                                <span className="font-medium">{template.stops[1]?.addressName || 'N/A'}</span>
                            </div>
                            <div className="flex items-start gap-2 pt-2">
                                <span className="text-muted-foreground font-semibold w-20">Fracht:</span>
                                <span className="text-muted-foreground text-xs">{template.stops[0]?.goodsDescription || 'N/A'}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                         <AddTemplateDialog onAdd={addOrUpdateTemplate} templateToEdit={template}>
                            <Button variant="ghost" size="sm">Bearbeiten</Button>
                         </AddTemplateDialog>
                         <Button variant="outline" size="sm" onClick={() => deleteTemplate(template.id)}>Löschen</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
        
        {templates.length === 0 && (
             <Card>
                <CardContent className="p-12">
                     <div className="text-center text-muted-foreground">
                        <p>Noch keine Vorlagen erstellt.</p>
                        <AddTemplateDialog onAdd={addOrUpdateTemplate}>
                            <Button variant="link" className="mt-2">Jetzt erste Vorlage erstellen</Button>
                        </AddTemplateDialog>
                     </div>
                </CardContent>
             </Card>
        )}
    </div>
  );
}
