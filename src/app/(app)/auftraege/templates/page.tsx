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
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<TripTemplate>({
    defaultValues: isEditMode ? templateToEdit : {
      id: `template-${Date.now()}`,
      name: "",
      description: "",
      stops: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stops",
  });

  const onSubmit = (data: TripTemplate) => {
    if (data.stops.length < 2) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Eine Vorlage muss mindestens zwei Stopps enthalten.",
      });
      return;
    }
    onAdd(data);
    toast({
      title: isEditMode ? "Vorlage aktualisiert" : "Vorlage erstellt",
      description: `Die Vorlage "${data.name}" wurde gespeichert.`,
    });
    setIsOpen(false);
  };
  
  const addStop = (type: 'Pickup' | 'Delivery') => {
    append({
        id: `stop-${Date.now()}`,
        stopSequence: fields.length + 1,
        type,
        addressId: '',
        addressName: '',
        location: '',
        plannedDateTime: '',
        goodsDescription: '',
        status: 'Planned',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Vorlage bearbeiten" : "Neue Trip-Vorlage erstellen"}
            </DialogTitle>
            <DialogDescription>
              Definieren Sie eine wiederverwendbare Vorlage für Ihre Touren.
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
            
            <Separator />

            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-base">Stopps der Vorlage</h3>
                <div className="flex gap-2">
                     <Button type="button" variant="outline" size="sm" onClick={() => addStop('Pickup')}><Icons.add className="h-3 w-3 mr-1"/> Abholung</Button>
                     <Button type="button" variant="outline" size="sm" onClick={() => addStop('Delivery')}><Icons.add className="h-3 w-3 mr-1"/> Lieferung</Button>
                </div>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                 <div key={field.id} className="p-3 border rounded-md bg-muted/50 space-y-3 relative">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Stopp {index + 1}: {watch(`stops.${index}.type`)}</h4>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                     <div className="space-y-1.5">
                        <Label>Tour Adresse</Label>
                        <Controller
                            name={`stops.${index}.addressId`}
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => {
                                    field.onChange(val);
                                    const address = addressData.find(a => a.id === val);
                                    setValue(`stops.${index}.addressName`, address?.name || '');
                                    setValue(`stops.${index}.location`, `${address?.plz} ${address?.stadt}`);
                                }}>
                                    <SelectTrigger className="h-9 bg-background"><SelectValue placeholder="Adresse auswählen..." /></SelectTrigger>
                                    <SelectContent>
                                        {addressData.map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.kurzname})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Frachtbeschreibung</Label>
                        <Textarea {...register(`stops.${index}.goodsDescription`)} placeholder="z.B. 24t, 33 Paletten" rows={1} className="bg-background"/>
                    </div>
                </div>
              ))}
            </div>
             {fields.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-8">Noch keine Stopps hinzugefügt.</p>
            )}

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
    setTemplates(prev => {
        const index = prev.findIndex(t => t.id === template.id);
        if (index > -1) {
            const newTemplates = [...prev];
            newTemplates[index] = template;
            return newTemplates;
        }
        return [template, ...prev];
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
                             <h4 className="font-semibold mb-1">Stopps:</h4>
                            {template.stops.map((stop, index) => (
                                <div key={stop.id} className="flex items-center gap-2">
                                   <span className="text-muted-foreground text-xs w-4">{index + 1}.</span>
                                   <span className="font-medium">{stop.addressName}</span>
                                   <span className="text-muted-foreground text-xs">({stop.type})</span>
                                </div>
                            ))}
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
