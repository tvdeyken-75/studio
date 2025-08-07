"use client";

import { useState } from "react";
import type { Customer, Contractor } from "@/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";

type ProfileType = 'customer' | 'contractor';

const AddProfileDialog = ({ type, onAdd }: { type: ProfileType, onAdd: (profile: Customer | Contractor) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const title = type === 'customer' ? 'Customer' : 'Contractor';

  const handleAdd = () => {
    if (name && contact && address) {
      onAdd({ id: Date.now().toString(), name, contact, address });
      setName("");
      setContact("");
      setAddress("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" />
          Add New {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {title}</DialogTitle>
          <DialogDescription>
            Enter the details for the new {title}. This data is temporary and will be lost on page refresh.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">Contact</Label>
            <Input id="contact" value={contact} onChange={e => setContact(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Address</Label>
            <Input id="address" value={address} onChange={e => setAddress(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const ProfileTable = ({ profiles, type }: { profiles: (Customer | Contractor)[], type: ProfileType }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
            <CardTitle>{type === 'customer' ? 'Customers' : 'Contractors'}</CardTitle>
            <CardDescription>List of currently managed {type}s.</CardDescription>
        </div>
        <AddProfileDialog type={type} onAdd={
            (profile) => {
                // This is a bit of a hack to get the parent component to re-render.
                // A better solution would involve lifting state up.
                window.dispatchEvent(new CustomEvent(`add${type}`, { detail: profile }));
            }
        } />
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.name}</TableCell>
                <TableCell>{profile.contact}</TableCell>
                <TableCell>{profile.address}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No {type}s added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);

  // Since we can't easily lift state from the dialog, we use window events.
  // This is a workaround for the session-only data requirement.
  useState(() => {
    const addCustomerHandler = (event: Event) => {
        const customEvent = event as CustomEvent;
        setCustomers(prev => [...prev, customEvent.detail]);
    };
    const addContractorHandler = (event: Event) => {
        const customEvent = event as CustomEvent;
        setContractors(prev => [...prev, customEvent.detail]);
    };

    window.addEventListener('addcustomer', addCustomerHandler);
    window.addEventListener('addcontractor', addContractorHandler);

    return () => {
        window.removeEventListener('addcustomer', addCustomerHandler);
        window.removeEventListener('addcontractor', addContractHandler);
    };
  });

  return (
    <Tabs defaultValue="customers">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="contractors">Contractors</TabsTrigger>
      </TabsList>
      <TabsContent value="customers">
        <ProfileTable profiles={customers} type="customer" />
      </TabsContent>
      <TabsContent value="contractors">
        <ProfileTable profiles={contractors} type="contractor" />
      </TabsContent>
    </Tabs>
  );
}
