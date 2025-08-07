"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import type { User } from "@/types";

const AddUserDialog = ({ onAdd }: { onAdd: (user: User) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<User>({
        defaultValues: {
            id: `user-${Date.now()}`,
            name: '',
            email: '',
            password: '',
            role: 'User'
        }
    });
    
    const onSubmit = (data: User) => {
        onAdd(data);
        toast({ title: 'Benutzer erstellt', description: `Der Benutzer ${data.name} wurde erfolgreich erstellt.` });
        setIsOpen(false);
        reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neuer Benutzer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Neuen Benutzer anlegen</DialogTitle>
                        <DialogDescription>
                            Füllen Sie die Details aus, um einen neuen Benutzer zu erstellen.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-1.5">
                            <Label>Name</Label>
                            <Input {...register('name', { required: "Name ist erforderlich." })} />
                            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>E-Mail</Label>
                            <Input type="email" {...register('email', { required: "E-Mail ist erforderlich." })} />
                             {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Passwort</Label>
                            <Input type="password" {...register('password', { required: "Passwort ist erforderlich." })} />
                             {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                        </div>
                         <div className="space-y-1.5">
                            <Label>Rolle</Label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="User">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                     <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Abbrechen</Button></DialogClose>
                        <Button type="submit">Speichern</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
};


export default function UsersPage() {
  const { user, users, addUser, deleteUser } = useAuth();

  if (user?.role !== 'Admin') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Zugriff verweigert</CardTitle>
                <CardDescription>Sie haben keine Berechtigung, auf diese Seite zuzugreifen.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Bitte kontaktieren Sie einen Administrator, wenn Sie Zugriff benötigen.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Benutzerverwaltung</CardTitle>
                <CardDescription>Verwalten Sie Benutzer und deren Rollen.</CardDescription>
            </div>
            <AddUserDialog onAdd={addUser} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'Admin' ? 'destructive' : 'secondary'}>{u.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    {u.role !== 'Admin' && (
                        <Button variant="ghost" size="icon" onClick={() => deleteUser(u.id)}>
                            <Icons.delete className="h-4 w-4 text-destructive" />
                        </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
