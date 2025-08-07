
"use client";

import { useState, useMemo } from "react";
import Link from 'next/link';
import type { Customer } from "@/types";
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
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

const initialCustomers: Customer[] = [
    // You can add mock data here if needed for initial testing
];


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lowercasedTerm = searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.firmenname.toLowerCase().includes(lowercasedTerm) ||
      customer.kundennummer.toLowerCase().includes(lowercasedTerm) ||
      customer.ort.toLowerCase().includes(lowercasedTerm)
    );
  }, [customers, searchTerm]);


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Kundenstamm</CardTitle>
                <CardDescription>Übersicht aller Kunden.</CardDescription>
            </div>
            <Button asChild variant="link" className="text-primary">
                <Link href="/customers/new">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neuer Kunde
                </Link>
            </Button>
        </div>
      </CardHeader>
        <div className="p-4 border-b border-t">
             <Input 
                placeholder="Kunden durchsuchen (Firma, Kundennr., Ort)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-md h-9"
            />
        </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firma</TableHead>
              <TableHead>Kundennr.</TableHead>
              <TableHead>Ort</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.firmenname}</TableCell>
                  <TableCell>{customer.kundennummer}</TableCell>
                  <TableCell>{customer.ort}</TableCell>
                  <TableCell>{customer.telefon}</TableCell>
                  <TableCell>
                    <Badge variant={customer.aktiv ? "default" : "destructive"} className="text-white">
                        {customer.aktiv ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="link" size="sm">
                       <Link href={`/customers/${customer.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Keine Kunden gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
