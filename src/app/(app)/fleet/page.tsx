"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fleetData } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function FleetPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Status</CardTitle>
        <CardDescription>An overview of all vehicles in your fleet for today.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fleetData.map((vehicle) => (
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
                    {vehicle.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
