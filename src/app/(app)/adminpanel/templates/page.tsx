
"use client";

import { useState, useMemo } from 'react';
import type { ReportTemplate } from '@/types';
import { reportTemplateData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const dataSchemas = {
    'Touren': {
        'tour.tourNumber': 'string',
        'tour.tourDate': 'string',
        'tour.customerName': 'string',
        'tour.vehicleKennzeichen': 'string',
        'tour.totalRevenue': 'number',
        'tour.totalCosts': 'number',
        'tour.profitability': 'number',
        'tour.stops': 'Array<Stop>',
    },
    'Rechnungen': {
        'invoice.rechnungsnummer': 'string',
        'invoice.rechnungsdatum': 'string',
        'invoice.kundenName': 'string',
        'invoice.betrag': 'number',
        'invoice.items': 'Array<Item>',
    },
    'Kunden': {
        'customer.firmenname': 'string',
        'customer.kundennummer': 'string',
        'customer.address': 'string',
    },
    'Fahrzeuge': {
        'vehicle.kennzeichen': 'string',
        'vehicle.hersteller': 'string',
        'vehicle.modell': 'string',
        'vehicle.status': 'string',
    }
}

const TemplateDialog = ({ onSave, template, children }: { onSave: (template: ReportTemplate) => void, template?: ReportTemplate | null, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const isEditMode = !!template;
    
    const [name, setName] = useState(template?.name || '');
    const [description, setDescription] = useState(template?.description || '');
    const [module, setModule] = useState<ReportTemplate['module']>(template?.module || 'Touren');
    const [content, setContent] = useState(template?.content || `<!-- Use Handlebars syntax {{variable}} to insert dynamic data. -->\n<!-- See the Data Schema section for available variables. -->\n\n<style>\n\tbody { font-family: sans-serif; }\n</style>\n\n<h1>Report for {{tour.tourNumber}}</h1>\n`);
    
    const handleSave = () => {
        if (!name || !module || !content) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Name, Modul und Inhalt sind erforderlich.' });
            return;
        }
        
        const newTemplate: ReportTemplate = {
            id: template?.id || `tpl-${Date.now()}`,
            name,
            description,
            module,
            content,
            createdAt: template?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        onSave(newTemplate);
        toast({ title: 'Vorlage gespeichert' });
        setIsOpen(false);
    };
    
    const currentSchema = dataSchemas[module];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Vorlage bearbeiten' : 'Neue Berichtsvorlage erstellen'}</DialogTitle>
                    <DialogDescription>
                        Erstellen Sie eine Vorlage mit HTML, CSS und JavaScript. Verwenden Sie Handlebars-Syntax `{{variable}}` für dynamische Daten.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="space-y-4">
                         <div className="space-y-1.5">
                            <Label>Name der Vorlage</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Beschreibung</Label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                         <div className="space-y-1.5">
                            <Label>Zugehöriges Modul</Label>
                            <Select onValueChange={(v) => setModule(v as ReportTemplate['module'])} value={module}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(dataSchemas).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Vorlagen-Inhalt (HTML, CSS, JS)</Label>
                            <Textarea 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)}
                                className="font-mono h-80 text-xs"
                                placeholder="Geben Sie hier Ihren HTML-Code ein..."
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Live-Vorschau</Label>
                             <div className="border rounded-md p-4 h-64 overflow-y-auto bg-white">
                                 <div dangerouslySetInnerHTML={{ __html: content.replace(/{{.*?}}/g, '[... ]') }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Daten-Schema für "{module}"</Label>
                            <Card className="bg-muted/50">
                                <CardContent className="p-3 font-mono text-xs max-h-48 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(currentSchema, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Abbrechen</Button></DialogClose>
                    <Button onClick={handleSave}>Vorlage speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<ReportTemplate[]>(reportTemplateData);
    const { toast } = useToast();

    const addOrUpdateTemplate = (template: ReportTemplate) => {
        setTemplates(prev => {
            const index = prev.findIndex(t => t.id === template.id);
            if (index > -1) {
                const newTemplates = [...prev];
                newTemplates[index] = template;
                return newTemplates;
            }
            return [template, ...prev];
        });
    };
    
    const deleteTemplate = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
        toast({ title: 'Vorlage gelöscht.' });
    }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Report Template Builder</CardTitle>
                <CardDescription>
                    Erstellen und verwalten Sie dynamische Berichtsvorlagen.
                </CardDescription>
            </div>
            <TemplateDialog onSave={addOrUpdateTemplate}>
                <Button variant="link">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Neue Vorlage
                </Button>
            </TemplateDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {templates.map(template => (
                <Card key={template.id} className="flex flex-col sm:flex-row items-start justify-between p-4">
                    <div className="flex-grow">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                         <p className="text-xs text-muted-foreground mt-2">
                           Modul: <span className="font-semibold">{template.module}</span> | 
                           Zuletzt aktualisiert: {format(new Date(template.updatedAt), 'dd.MM.yyyy HH:mm')}
                        </p>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                         <TemplateDialog onSave={addOrUpdateTemplate} template={template}>
                            <Button variant="outline" size="sm">Bearbeiten</Button>
                        </TemplateDialog>
                        <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template.id)}>Löschen</Button>
                    </div>
                </Card>
            ))}
            {templates.length === 0 && (
                <div className="flex h-48 items-center justify-center rounded-md border-2 border-dashed">
                    <TemplateDialog onSave={addOrUpdateTemplate}>
                        <Button variant="link">Erste Vorlage erstellen</Button>
                    </TemplateDialog>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
