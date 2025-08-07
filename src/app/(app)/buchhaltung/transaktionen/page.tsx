
"use client";

import { useState, useMemo } from "react";
import type { Transaction } from "@/types";
import { transactionData as initialData } from "@/lib/data";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Icons } from "@/components/icons";
import { SlidersHorizontal, FileDown, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, isWithinInterval, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from 'react-day-picker';
import { useForm, Controller } from "react-hook-form";

const KpiCard = ({ title, value, icon, change, changeType, description }: { title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'positive' | 'negative', description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
             {change && (
                <p className={cn("text-xs text-muted-foreground", changeType === 'positive' ? 'text-green-600' : 'text-red-600')}>
                    {change} {description}
                </p>
            )}
        </CardContent>
    </Card>
);

const AddTransactionDialog = ({ onAdd }: { onAdd: (transaction: Transaction) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, control, watch, reset } = useForm<Transaction>({
        defaultValues: {
            id: `trans-${Date.now()}`,
            datum: new Date().toISOString(),
            art: 'Ausgabe',
            betrag: 0,
            status: 'Offen',
            waehrung: 'EUR'
        }
    });
    
    const onSubmit = (data: Transaction) => {
        if (!data.beschreibung || data.betrag <= 0 || !data.kategorie) {
            toast({ variant: "destructive", title: "Fehler", description: "Bitte füllen Sie alle erforderlichen Felder aus." });
            return;
        }
        onAdd(data);
        toast({ title: 'Erfolg', description: 'Transaktion wurde hinzugefügt.' });
        setIsOpen(false);
        reset({
            id: `trans-${Date.now()}`,
            datum: new Date().toISOString(),
            art: 'Ausgabe',
            betrag: 0,
            status: 'Offen',
            waehrung: 'EUR',
            beschreibung: '',
            kategorie: '',
            belegnummer: '',
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-primary">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neue Transaktion
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                 <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Neue Transaktion</DialogTitle>
                        <DialogDescription>
                            Erfassen Sie eine neue Einnahme oder Ausgabe.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                         <Controller
                            control={control}
                            name="art"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                        <RadioGroupItem value="Einnahme" className="sr-only" />
                                        <ArrowUpRight className="mb-3 h-6 w-6" />
                                        Einnahme
                                    </Label>
                                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                        <RadioGroupItem value="Ausgabe" className="sr-only" />
                                        <ArrowDownLeft className="mb-3 h-6 w-6" />
                                        Ausgabe
                                    </Label>
                                </RadioGroup>
                            )}
                        />
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label>Datum</Label>
                                <Input type="date" {...register('datum')} defaultValue={format(new Date(), 'yyyy-MM-dd')} className="h-9" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Betrag (€)</Label>
                                <Input type="number" step="0.01" {...register('betrag', { valueAsNumber: true })} className="h-9" />
                            </div>
                         </div>
                         <div className="space-y-1.5">
                            <Label>Kategorie</Label>
                            <Input placeholder="z.B. Treibstoff, Büromaterial" {...register('kategorie')} className="h-9" />
                         </div>
                         <div className="space-y-1.5">
                            <Label>Beschreibung</Label>
                            <Textarea placeholder="Details zur Transaktion" {...register('beschreibung')} />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Belegnummer (Optional)</Label>
                                <Input {...register('belegnummer')} className="h-9"/>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Status</Label>
                                 <Controller
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Offen">Offen</SelectItem>
                                                <SelectItem value="Verbucht">Verbucht</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
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
    )
}

export default function TransaktionenPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  }
  
  const [columnVisibility, setColumnVisibility] = useState({
    datum: true,
    art: true,
    kategorie: true,
    beschreibung: true,
    betrag: true,
    status: true,
    belegnummer: false,
  });

  type ColumnKeys = keyof typeof columnVisibility;
  const columnLabels: Record<ColumnKeys, string> = {
      datum: "Datum",
      art: "Art",
      kategorie: "Kategorie",
      beschreibung: "Beschreibung",
      betrag: "Betrag",
      status: "Status",
      belegnummer: "Beleg-Nr."
  };

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (dateRange?.from && dateRange?.to) {
        filtered = filtered.filter(t => {
            const transactionDate = parseISO(t.datum);
            return isWithinInterval(transactionDate, { start: dateRange.from!, end: dateRange.to! });
        });
    }

    if (!searchTerm) return filtered;

    const lowercasedTerm = searchTerm.toLowerCase();
    return filtered.filter(transaction => 
      transaction.beschreibung.toLowerCase().includes(lowercasedTerm) ||
      transaction.kategorie.toLowerCase().includes(lowercasedTerm) ||
      transaction.art.toLowerCase().includes(lowercasedTerm) ||
      transaction.status.toLowerCase().includes(lowercasedTerm) ||
      (transaction.belegnummer && transaction.belegnummer.toLowerCase().includes(lowercasedTerm))
    );
  }, [transactions, searchTerm, dateRange]);
  
  const kpis = useMemo(() => {
    const totalEinnahmen = filteredTransactions.filter(t => t.art === 'Einnahme').reduce((sum, t) => sum + t.betrag, 0);
    const totalAusgaben = filteredTransactions.filter(t => t.art === 'Ausgabe').reduce((sum, t) => sum + t.betrag, 0);
    const balance = totalEinnahmen - totalAusgaben;
    return { totalEinnahmen, totalAusgaben, balance };
  }, [filteredTransactions]);
  
  const toggleColumn = (column: ColumnKeys) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }));
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = parseISO(dateString);
    try {
        return format(date, 'dd.MM.yyyy');
    } catch {
        return 'Ungültiges Datum';
    }
  }


  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
             <KpiCard title="Gesamteinnahmen" value={formatCurrency(kpis.totalEinnahmen)} icon={<ArrowUpRight className="h-5 w-5" />} description="im ausgewählten Zeitraum" />
             <KpiCard title="Gesamtausgaben" value={formatCurrency(kpis.totalAusgaben)} icon={<ArrowDownLeft className="h-5 w-5" />} description="im ausgewählten Zeitraum" />
             <KpiCard title="Saldo" value={formatCurrency(kpis.balance)} icon={<Wallet className="h-5 w-5" />} description="im ausgewählten Zeitraum" />
        </div>
        <Card>
        <CardHeader className="border-b">
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Einnahmen & Ausgaben</CardTitle>
                    <CardDescription>
                        Verwalten Sie alle finanziellen Transaktionen.
                    </CardDescription>
                </div>
                <AddTransactionDialog onAdd={addTransaction} />
            </div>
        </CardHeader>
        <div className="p-4 border-b flex justify-between items-center gap-4">
             <Input 
                placeholder="Transaktionen durchsuchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-md h-9"
            />
            <div className="flex gap-2 items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal h-9",
                                !dateRange && "text-muted-foreground"
                            )}
                        >
                            <Icons.calendar className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "dd.MM.yyyy")} -{" "}
                                        {format(dateRange.to, "dd.MM.yyyy")}
                                    </>
                                ) : (
                                    format(dateRange.from, "dd.MM.yyyy")
                                )
                            ) : (
                                <span>Datumsbereich auswählen</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            locale={de}
                        />
                    </PopoverContent>
                </Popover>
                <Button variant="link" size="sm" onClick={() => toast({title: "Info", description: "Export-Funktion wird in Kürze implementiert."})}>
                    <FileDown className="mr-2 h-4 w-4" /> Exportieren
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <SlidersHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuLabel>Spalten ein-/ausblenden</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                        {Object.keys(columnVisibility).map(key => (
                            <DropdownMenuCheckboxItem
                                key={key}
                                className="capitalize"
                                checked={columnVisibility[key as ColumnKeys]}
                                onCheckedChange={() => toggleColumn(key as ColumnKeys)}
                            >
                                {columnLabels[key as ColumnKeys]}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        <CardContent className="p-0">
            <Table>
            <TableHeader>
                <TableRow>
                {columnVisibility.datum && <TableHead>Datum</TableHead>}
                {columnVisibility.art && <TableHead>Art</TableHead>}
                {columnVisibility.kategorie && <TableHead>Kategorie</TableHead>}
                {columnVisibility.beschreibung && <TableHead>Beschreibung</TableHead>}
                {columnVisibility.belegnummer && <TableHead>Beleg-Nr.</TableHead>}
                {columnVisibility.betrag && <TableHead className="text-right">Betrag</TableHead>}
                {columnVisibility.status && <TableHead>Status</TableHead>}
                <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                        {columnVisibility.datum && <TableCell>{formatDate(transaction.datum)}</TableCell>}
                        {columnVisibility.art && <TableCell>
                             <Badge variant={transaction.art === 'Einnahme' ? 'secondary' : 'outline'} className={cn(transaction.art === 'Einnahme' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600')}>
                                {transaction.art}
                            </Badge>
                        </TableCell>}
                        {columnVisibility.kategorie && <TableCell>{transaction.kategorie}</TableCell>}
                        {columnVisibility.beschreibung && <TableCell className="font-medium max-w-xs truncate">{transaction.beschreibung}</TableCell>}
                        {columnVisibility.belegnummer && <TableCell>{transaction.belegnummer}</TableCell>}
                        {columnVisibility.betrag && <TableCell className={cn("text-right font-mono", transaction.art === 'Einnahme' ? 'text-green-600' : 'text-red-600')}>{transaction.art === 'Einnahme' ? '+' : '-'}{formatCurrency(transaction.betrag)}</TableCell>}
                        {columnVisibility.status && <TableCell>
                            <Badge variant={transaction.status === 'Verbucht' ? 'default' : 'secondary'} className={cn(transaction.status === 'Verbucht' && "bg-blue-600 text-white")}>
                                {transaction.status}
                            </Badge>
                        </TableCell>}
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Icons.more className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                                <DropdownMenuItem>Als verbucht markieren</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="h-24 text-center">
                    Keine Transaktionen gefunden.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </div>
  );
}
