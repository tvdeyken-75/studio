"use client";

import { useState } from "react";
import type { Country } from "@/types";
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

const AddCountryDialog = ({ onAdd }: { onAdd: (country: Country) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleAdd = () => {
    if (name && code) {
      onAdd({ id: Date.now().toString(), name, code });
      setName("");
      setCode("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" />
          Neues Land hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neues Land hinzufügen</DialogTitle>
          <DialogDescription>
            Geben Sie die Details für das neue Land ein.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const CountryTable = ({ countries, onAdd }: { countries: Country[], onAdd: (country: Country) => void }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
            <CardTitle>Länder</CardTitle>
            <CardDescription>Liste der verwalteten Länder.</CardDescription>
        </div>
        <AddCountryDialog onAdd={onAdd} />
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.length > 0 ? (
            countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell className="font-medium">{country.name}</TableCell>
                <TableCell>{country.code}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                Noch keine Länder hinzugefügt.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);

  const addCountry = (country: Country) => {
    setCountries(prev => [...prev, country]);
  };
  
  return <CountryTable countries={countries} onAdd={addCountry} />;
}
