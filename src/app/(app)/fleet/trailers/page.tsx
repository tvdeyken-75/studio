
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trailerData as initialTrailerData } from "@/lib/data";
import type { Trailer } from "@/types";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const AddTrailerDialog = ({ onAdd }: { onAdd: (trailer: Trailer) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Trailer, 'status'>>({
    id: "",
    type: "Kofferauflieger",
    location: "",
    capacity: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: "Kofferauflieger" | "Schiebeplanenauflieger" | "Kippauflieger") => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleAdd = () => {
    if (formData.id && formData.type && formData.location && formData.capacity) {
      onAdd({ ...formData, status: "Available" });
      setFormData({ id: "", type: "Kofferauflieger", location: "", capacity: "" });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary">
          <Icons.add className="mr-2 h-4 w-4" />
          Neuer Anhänger
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neuen Anhänger anlegen</DialogTitle>
          <DialogDescription>
            Füllen Sie die Details für den neuen Anhänger aus.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="id">Anhänger-ID</Label>
            <Input id="id" value={formData.id} onChange={handleInputChange} className="h-9" placeholder="z.B. AN-004"/>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type">Typ</Label>
            <Select onValueChange={handleSelectChange} defaultValue={formData.type}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kofferauflieger">Kofferauflieger</SelectItem>
                <SelectItem value="Schiebeplanenauflieger">Schiebeplanenauflieger</SelectItem>
                <SelectItem value="Kippauflieger">Kippauflieger</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Standort</Label>
            <Input id="location" value={formData.location} onChange={handleInputChange} className="h-9" placeholder="z.B. Berlin, DE"/>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="capacity">Kapazität</Label>
            <Input id="capacity" value={formData.capacity} onChange={handleInputChange} className="h-9" placeholder="z.B. 34 Paletten"/>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">Abbrechen</Button>
          <Button onClick={handleAdd} size="sm">Hinzufügen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function TrailersPage() {
  const [trailers, setTrailers] = useState<Trailer[]>(initialTrailerData);

  const statusMap = {
    'Available': 'Verfügbar',
    'On-trip': 'Unterwegs',
    'Maintenance': 'Wartung'
  };

  const addTrailer = (trailer: Trailer) => {
    setTrailers(prev => [...prev, trailer]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
              <CardTitle>Anhänger</CardTitle>
              <CardDescription>Eine Übersicht aller Anhänger in Ihrem Fuhrpark.</CardDescription>
            </div>
            <AddTrailerDialog onAdd={addTrailer} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anhänger-ID</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Standort</TableHead>
              <TableHead>Kapazität</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trailers.map((trailer) => (
              <TableRow key={trailer.id}>
                <TableCell className="font-medium">{trailer.id}</TableCell>
                <TableCell>{trailer.type}</TableCell>
                <TableCell>{trailer.location}</TableCell>
                <TableCell>{trailer.capacity}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-2",
                      trailer.status === 'Available' && 'border-green-500 text-green-600',
                      trailer.status === 'On-trip' && 'border-blue-500 text-blue-600',
                      trailer.status === 'Maintenance' && 'border-amber-500 text-amber-600'
                    )}
                  >
                    {statusMap[trailer.status]}
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
                            <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                            <DropdownMenuItem>Wartung melden</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
