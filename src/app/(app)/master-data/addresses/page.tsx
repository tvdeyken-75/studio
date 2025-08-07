"use client";

import { useState } from "react";
import type { Address } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";

const AddAddressDialog = ({ onAdd }: { onAdd: (address: Address) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const handleAdd = () => {
    if (street && zipCode && city && country) {
      onAdd({ id: Date.now().toString(), street, zipCode, city, country });
      setStreet("");
      setZipCode("");
      setCity("");
      setCountry("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" />
          Neue Adresse hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Adresse hinzufügen</DialogTitle>
          <DialogDescription>
            Geben Sie die Details für die neue Adresse ein.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="street" className="text-right">Straße</Label>
            <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zipCode" className="text-right">PLZ</Label>
            <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">Stadt</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">Land</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const AddressTable = ({ addresses, onAdd }: { addresses: Address[], onAdd: (address: Address) => void }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
            <CardTitle>Adressen</CardTitle>
            <CardDescription>Liste der verwalteten Adressen.</CardDescription>
        </div>
        <AddAddressDialog onAdd={onAdd} />
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Straße</TableHead>
            <TableHead>PLZ</TableHead>
            <TableHead>Stadt</TableHead>
            <TableHead>Land</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell className="font-medium">{address.street}</TableCell>
                <TableCell>{address.zipCode}</TableCell>
                <TableCell>{address.city}</TableCell>
                <TableCell>{address.country}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Noch keine Adressen hinzugefügt.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const addAddress = (address: Address) => {
    setAddresses(prev => [...prev, address]);
  };
  
  return <AddressTable addresses={addresses} onAdd={addAddress} />;
}
