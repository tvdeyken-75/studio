
"use client";

import { useState, useMemo } from "react";
import type { Kostenstelle } from "@/types";
import { kostenstellenData as initialData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";


const AddKostenstelleDialog = ({ onAdd, kostenstelleToEdit }: { onAdd: (data: Kostenstelle) => void, kostenstelleToEdit?: Kostenstelle | null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const isEditMode = !!kostenstelleToEdit;

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Kostenstelle>({
        defaultValues: isEditMode ? kostenstelleToEdit : {
            id: `ks-${Date.now()}`,
            nummer: '',
            name: '',
            beschreibung: '',
            typ: 'Sonstiges',
            verantwortlicher: '',
        }
    });

    const onSubmit = (data: Kostenstelle) => {
        onAdd(data);
        toast({ title: isEditMode ? 'Kostenstelle aktualisiert' : 'Kostenstelle erstellt', description: `Die Kostenstelle "${data.name}" wurde gespeichert.` });
        setIsOpen(false);
        if (!isEditMode) {
            reset();
        }
    };
    
    const openDialog = () => {
        reset(isEditMode ? kostenstelleToEdit : {
            id: `ks-${Date.now()}`,
            nummer: '',
            name: '',
            beschreibung: '',
            typ: 'Sonstiges',
            verantwortlicher: '',
        });
        setIsOpen(true);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-primary">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neue Kostenstelle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Kostenstelle bearbeiten' : 'Neue Kostenstelle anlegen'}</DialogTitle>
                        <DialogDescription>
                           {isEditMode ? 'Bearbeiten Sie die Details der Kostenstelle.' : 'Füllen Sie die Details für eine neue Kostenstelle aus.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Nummer</Label>
                                <Input {...register('nummer', { required: "Nummer ist erforderlich." })} className="h-9" />
                                {errors.nummer && <p className="text-xs text-destructive">{errors.nummer.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Name</Label>
                                <Input {...register('name', { required: "Name ist erforderlich." })} className="h-9" />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Beschreibung</Label>
                            <Textarea {...register('beschreibung')} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label>Typ</Label>
                                <Controller
                                    name="typ"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Fahrzeug">Fahrzeug</SelectItem>
                                                <SelectItem value="Abteilung">Abteilung</SelectItem>
                                                <SelectItem value="Projekt">Projekt</SelectItem>
                                                <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Verantwortlicher (Optional)</Label>
                                <Input {...register('verantwortlicher')} className="h-9" />
                            </div>
                         </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Abbrechen</Button></DialogClose>
                        <Button type="submit">Speichern</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default function KostenstellenPage() {
  const [kostenstellen, setKostenstellen] = useState<Kostenstelle[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  
  const addOrUpdateKostenstelle = (data: Kostenstelle) => {
    setKostenstellen(prev => {
        const index = prev.findIndex(ks => ks.id === data.id);
        if (index > -1) {
            const newKostenstellen = [...prev];
            newKostenstellen[index] = data;
            return newKostenstellen;
        }
        return [data, ...prev];
    })
  }

  const filteredKostenstellen = useMemo(() => {
    if (!searchTerm) return kostenstellen;
    const lowercasedTerm = searchTerm.toLowerCase();
    return kostenstellen.filter(ks => 
      ks.name.toLowerCase().includes(lowercasedTerm) ||
      ks.nummer.toLowerCase().includes(lowercasedTerm) ||
      ks.beschreibung.toLowerCase().includes(lowercasedTerm) ||
      ks.typ.toLowerCase().includes(lowercasedTerm) ||
      (ks.verantwortlicher && ks.verantwortlicher.toLowerCase().includes(lowercasedTerm))
    );
  }, [kostenstellen, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Kostenstellen</CardTitle>
                <CardDescription>
                    Verwalten Sie Ihre Kostenstellen zur besseren Kostenzuordnung.
                </CardDescription>
            </div>
            <AddKostenstelleDialog onAdd={addOrUpdateKostenstelle} />
        </div>
      </CardHeader>
        <div className="p-4 border-b border-t flex justify-between items-center gap-4">
             <Input 
                placeholder="Kostenstellen durchsuchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-md h-9"
            />
        </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nummer</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Beschreibung</TableHead>
              <TableHead>Verantwortlicher</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKostenstellen.length > 0 ? (
              filteredKostenstellen.map((ks) => (
                <TableRow key={ks.id}>
                  <TableCell className="font-medium">{ks.nummer}</TableCell>
                  <TableCell>{ks.name}</TableCell>
                  <TableCell>{ks.typ}</TableCell>
                  <TableCell>{ks.beschreibung}</TableCell>
                  <TableCell>{ks.verantwortlicher || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Icons.more className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Keine Kostenstellen gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
