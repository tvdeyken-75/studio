
"use client";

import { useState, useMemo } from "react";
import type { Mitarbeiter } from "@/types";
import { mitarbeiterData } from "@/lib/data";
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
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AddMitarbeiterDialog = ({ onSave, mitarbeiterToEdit, children }: { onSave: (data: Mitarbeiter) => void, mitarbeiterToEdit?: Mitarbeiter | null, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const isEditMode = !!mitarbeiterToEdit;

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Mitarbeiter>({
        defaultValues: isEditMode && mitarbeiterToEdit ? {
            ...mitarbeiterToEdit,
            eintrittsdatum: format(parseISO(mitarbeiterToEdit.eintrittsdatum), 'yyyy-MM-dd')
        } : {
            id: `ma-${Date.now()}`,
            personalnummer: `PN-${Math.floor(1000 + Math.random() * 9000)}`,
            vorname: '',
            nachname: '',
            position: 'LKW-Fahrer',
            eintrittsdatum: format(new Date(), 'yyyy-MM-dd'),
            status: 'Aktiv',
            email: '',
            telefon: '',
        }
    });

    const onSubmit = (data: Mitarbeiter) => {
        const finalData = { ...data, eintrittsdatum: new Date(data.eintrittsdatum).toISOString() };
        onSave(finalData);
        toast({ title: isEditMode ? 'Mitarbeiter aktualisiert' : 'Mitarbeiter erstellt', description: `Die Daten für ${data.vorname} ${data.nachname} wurden gespeichert.` });
        setIsOpen(false);
    };
    
    const handleOpenChange = (open: boolean) => {
        if(open) {
            reset(isEditMode && mitarbeiterToEdit ? {
                ...mitarbeiterToEdit,
                eintrittsdatum: format(parseISO(mitarbeiterToEdit.eintrittsdatum), 'yyyy-MM-dd')
            } : {
                id: `ma-${Date.now()}`,
                personalnummer: `PN-${Math.floor(1000 + Math.random() * 9000)}`,
                vorname: '',
                nachname: '',
                position: 'LKW-Fahrer',
                eintrittsdatum: format(new Date(), 'yyyy-MM-dd'),
                status: 'Aktiv',
                email: '',
                telefon: '',
            });
        }
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Mitarbeiter bearbeiten' : 'Neuen Mitarbeiter anlegen'}</DialogTitle>
                        <DialogDescription>
                           {isEditMode ? 'Bearbeiten Sie die Stammdaten des Mitarbeiters.' : 'Füllen Sie die Stammdaten für einen neuen Mitarbeiter aus.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="space-y-1.5">
                            <Label>Personalnummer</Label>
                            <Input {...register('personalnummer')} readOnly className="h-9 font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Vorname</Label>
                                <Input {...register('vorname', { required: "Vorname ist erforderlich." })} className="h-9" />
                                {errors.vorname && <p className="text-xs text-destructive">{errors.vorname.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Nachname</Label>
                                <Input {...register('nachname', { required: "Nachname ist erforderlich." })} className="h-9" />
                                {errors.nachname && <p className="text-xs text-destructive">{errors.nachname.message}</p>}
                            </div>
                        </div>
                         <div className="space-y-1.5">
                            <Label>Position</Label>
                            <Input {...register('position', { required: "Position ist erforderlich." })} className="h-9" />
                            {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Eintrittsdatum</Label>
                                <Input type="date" {...register('eintrittsdatum', { required: "Eintrittsdatum ist erforderlich." })} className="h-9" />
                                 {errors.eintrittsdatum && <p className="text-xs text-destructive">{errors.eintrittsdatum.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Status</Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Aktiv">Aktiv</SelectItem>
                                                <SelectItem value="Inaktiv">Inaktiv</SelectItem>
                                                <SelectItem value="Gekündigt">Gekündigt</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>E-Mail</Label>
                                <Input type="email" {...register('email', { required: "E-Mail ist erforderlich." })} className="h-9" />
                                 {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Telefon</Label>
                                <Input {...register('telefon')} className="h-9" />
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


export default function MitarbeiterPage() {
  const [mitarbeiter, setMitarbeiter] = useState<Mitarbeiter[]>(mitarbeiterData);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const addOrUpdateMitarbeiter = (data: Mitarbeiter) => {
    setMitarbeiter(prev => {
        const index = prev.findIndex(m => m.id === data.id);
        if (index > -1) {
            const newMitarbeiter = [...prev];
            newMitarbeiter[index] = data;
            return newMitarbeiter;
        }
        return [data, ...prev];
    })
  }

  const deleteMitarbeiter = (id: string) => {
      setMitarbeiter(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Mitarbeiter gelöscht.' });
  }

  const filteredMitarbeiter = useMemo(() => {
    if (!searchTerm) return mitarbeiter;
    const lowercasedTerm = searchTerm.toLowerCase();
    return mitarbeiter.filter(m => 
      m.vorname.toLowerCase().includes(lowercasedTerm) ||
      m.nachname.toLowerCase().includes(lowercasedTerm) ||
      m.personalnummer.toLowerCase().includes(lowercasedTerm) ||
      m.position.toLowerCase().includes(lowercasedTerm) ||
      m.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [mitarbeiter, searchTerm]);

  const formatDate = (dateString: string) => {
      try {
        return format(parseISO(dateString), 'dd.MM.yyyy');
      } catch {
          return "N/A";
      }
  }

  const statusVariant: Record<Mitarbeiter['status'], 'default' | 'secondary' | 'destructive'> = {
      'Aktiv': 'default',
      'Inaktiv': 'secondary',
      'Gekündigt': 'destructive'
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Mitarbeiter</CardTitle>
                <CardDescription>
                    Verwalten Sie Ihre Mitarbeiterstammdaten.
                </CardDescription>
            </div>
             <AddMitarbeiterDialog onSave={addOrUpdateMitarbeiter}>
                <Button variant="link" className="text-primary">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neuer Mitarbeiter
                </Button>
            </AddMitarbeiterDialog>
        </div>
      </CardHeader>
        <div className="p-4 border-b border-t flex justify-between items-center gap-4">
             <Input 
                placeholder="Mitarbeiter durchsuchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-md h-9"
            />
        </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Personal-Nr.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Eintritt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMitarbeiter.length > 0 ? (
              filteredMitarbeiter.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">{m.personalnummer}</TableCell>
                  <TableCell className="font-medium">{m.nachname}, {m.vorname}</TableCell>
                  <TableCell>{m.position}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.telefon}</TableCell>
                  <TableCell>{formatDate(m.eintrittsdatum)}</TableCell>
                  <TableCell>
                      <Badge variant={statusVariant[m.status]} className={cn(m.status === 'Aktiv' && 'bg-green-600 text-white')}>
                        {m.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Icons.more className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <AddMitarbeiterDialog onSave={addOrUpdateMitarbeiter} mitarbeiterToEdit={m}>
                                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                                    Bearbeiten
                                </button>
                            </AddMitarbeiterDialog>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteMitarbeiter(m.id)}>Löschen</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Keine Mitarbeiter gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
