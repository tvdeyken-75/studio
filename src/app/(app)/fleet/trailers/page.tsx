"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trailerData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";


export default function TrailersPage() {
  const statusMap = {
    'Available': 'Verfügbar',
    'On-trip': 'Unterwegs',
    'Maintenance': 'Wartung'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anhänger</CardTitle>
        <CardDescription>Eine Übersicht aller Anhänger in Ihrem Fuhrpark.</CardDescription>
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
            {trailerData.map((trailer) => (
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
