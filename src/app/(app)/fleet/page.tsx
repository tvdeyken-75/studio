
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fleetData as initialFleetData } from "@/lib/data";
import type { Vehicle } from "@/types";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const AddVehicleDialog = ({ onAdd }: { onAdd: (vehicle: Vehicle) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Vehicle, 'status'>>({
    id: "",
    type: "LKW",
    location: "",
    capacity: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: "LKW" | "Transporter" | "Sprinter") => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleAdd = () => {
    if (formData.id && formData.type && formData.location && formData.capacity) {
      onAdd({ ...formData, status: "Available" });
      setFormData({ id: "", type: "LKW", location: "", capacity: "" });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary">
          <Icons.add className="mr-2 h-4 w-4" />
          Neues Fahrzeug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neues Fahrzeug anlegen</DialogTitle>
          <DialogDescription>
            Füllen Sie die Details für das neue Fahrzeug aus.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="id">Fahrzeug-ID</Label>
            <Input id="id" value={formData.id} onChange={handleInputChange} className="h-9" placeholder="z.B. AT-007"/>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type">Typ</Label>
            <Select onValueChange={handleSelectChange} defaultValue={formData.type}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LKW">LKW</SelectItem>
                <SelectItem value="Transporter">Transporter</SelectItem>
                <SelectItem value="Sprinter">Sprinter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Standort</Label>
            <Input id="location" value={formData.location} onChange={handleInputChange} className="h-9" placeholder="z.B. Berlin, DE"/>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="capacity">Kapazität</Label>
            <Input id="capacity" value={formData.capacity} onChange={handleInputChange} className="h-9" placeholder="z.B. 24t"/>
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


export default function FleetPage() {
  const [fleet, setFleet] = useState<Vehicle[]>(initialFleetData);
  
  const statusMap = {
    'Available': 'Verfügbar',
    'On-trip': 'Unterwegs',
    'Maintenance': 'Wartung'
  };

  const addVehicle = (vehicle: Vehicle) => {
    setFleet(prev => [...prev, vehicle]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fahrzeuge</CardTitle>
              <CardDescription>Eine Übersicht aller Fahrzeuge in Ihrem Fuhrpark.</CardDescription>
            </div>
            <AddVehicleDialog onAdd={addVehicle} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fahrzeug-ID</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Standort</TableHead>
              <TableHead>Kapazität</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fleet.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.id}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.location}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-2",
                      vehicle.status === 'Available' && 'border-green-500 text-green-600',
                      vehicle.status === 'On-trip' && 'border-blue-500 text-blue-600',
                      vehicle.status === 'Maintenance' && 'border-amber-500 text-amber-600'
                    )}
                  >
                    {statusMap[vehicle.status]}
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
