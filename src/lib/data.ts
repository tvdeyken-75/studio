

import type { Vehicle, Kpi, ChartData, Transport, Trailer, Dieselpreis, Customer, Transaction, Kostenstelle, Document, Tour, TourStop, Address, Country } from '@/types';

export const customerData: Customer[] = [
    {
        id: '1',
        firmenname: 'Musterfirma GmbH',
        kundennummer: 'KN-0001',
        ustId: 'DE123456789',
        steuernummer: '123/456/7890',
        firmenbuchnummer: 'HRB 12345',
        strasse: 'Musterstraße',
        hausnummer: '123',
        plz: '12345',
        ort: 'Musterstadt',
        land: 'DE',
        telefon: '01234-567890',
        fax: '01234-567891',
        email: 'info@musterfirma.de',
        website: 'www.musterfirma.de',
        zahlungsbedingungen: '30 Tage netto',
        zahlungsziel: 30,
        waehrung: 'EUR',
        kreditlimit: 10000,
        skontoProzent: 2,
        skontoTage: 14,
        mautzuschlag: 5,
        dieselfloater: true,
        bankname: 'Musterbank',
        iban: 'DE89370400440532013000',
        bic: 'COBADEFFXXX',
        kontoinhaber: 'Musterfirma GmbH',
        aktiv: true,
        bemerkung: 'Langjähriger Kunde.',
        erstelltAm: new Date().toISOString(),
        bearbeitetAm: new Date().toISOString(),
        name: 'Musterfirma GmbH',
        contact: 'info@musterfirma.de',
        address: 'Musterstraße 123, 12345 Musterstadt',
    },
     {
        id: '2',
        firmenname: 'Bau AG',
        kundennummer: 'KN-0002',
        ustId: 'DE987654321',
        steuernummer: '987/654/3210',
        firmenbuchnummer: 'HRB 54321',
        strasse: 'Bauweg',
        hausnummer: '1',
        plz: '54321',
        ort: 'Baustadt',
        land: 'DE',
        telefon: '09876-543210',
        fax: '09876-543211',
        email: 'kontakt@bau-ag.de',
        website: 'www.bau-ag.de',
        zahlungsbedingungen: '14 Tage netto',
        zahlungsziel: 14,
        waehrung: 'EUR',
        kreditlimit: 50000,
        skontoProzent: 3,
        skontoTage: 7,
        mautzuschlag: 7.5,
        dieselfloater: true,
        bankname: 'Baubank',
        iban: 'DE89370400440532013001',
        bic: 'COBADEFFXXX',
        kontoinhaber: 'Bau AG',
        aktiv: true,
        bemerkung: 'Großkunde.',
        erstelltAm: new Date().toISOString(),
        bearbeitetAm: new Date().toISOString(),
        name: 'Bau AG',
        contact: 'kontakt@bau-ag.de',
        address: 'Bauweg 1, 54321 Baustadt',
    },
];

export const fleetData: Vehicle[] = [
  { 
    id: 'AT-001', kennzeichen: 'B-LKW-123', hersteller: 'Mercedes-Benz', modell: 'Actros 1845', fahrgestellnummer: 'WDB12345678901234',
    baujahr: 2021, typ: 'Sattelzugmaschine', fahrzeugart: 'LKW', fuhrparkNummer: 'F-101',
    motorleistungKw: 330, kraftstoffart: 'Diesel', getriebeart: 'Automatik', achszahl: 2,
    nutzlastKg: 18000, gesamtgewichtKg: 40000, tankvolumenLiter: 800, adblueVolumenLiter: 60,
    tuevBis: '2025-08-01', spBis: '2025-02-01', versicherungsnummer: 'V-987654', zulassungsdatum: '2021-08-15',
    status: 'Aktiv', fahrerId: 'max-mustermann', tourStatus: 'Unterwegs',
    location: 'Berlin, DE', capacity: '24t' // Legacy
  },
  { 
    id: 'AT-002', kennzeichen: 'H-LKW-456', hersteller: 'MAN', modell: 'TGX', fahrgestellnummer: 'WDB98765432109876',
    baujahr: 2022, typ: 'Sattelzugmaschine', fahrzeugart: 'LKW', fuhrparkNummer: 'F-102',
    motorleistungKw: 340, kraftstoffart: 'Diesel', getriebeart: 'Automatik', achszahl: 2,
    nutzlastKg: 18000, gesamtgewichtKg: 40000, tankvolumenLiter: 750, adblueVolumenLiter: 60,
    tuevBis: '2024-10-01', spBis: '2025-04-01', versicherungsnummer: 'V-123456', zulassungsdatum: '2022-10-20',
    status: 'Reparatur', fahrerId: 'erika-musterfrau', tourStatus: 'Verfügbar',
    location: 'Hamburg, DE', capacity: '24t' // Legacy
  },
];

export const trailerData: Trailer[] = [
  { 
    id: 'AN-001', kennzeichen: 'B-AN-111', hersteller: 'Schmitz Cargobull', modell: 'S.KO COOL', fahrgestellnummer: 'SCB123123123123123',
    baujahr: 2020, anhaengerTyp: 'Kofferauflieger', fuhrparkNummer: 'A-201',
    achsenanzahl: 3, nutzlastKg: 27000, gesamtgewichtKg: 35000, ladevolumenCbm: 85, bremsenTyp: 'Scheibe',
    tuevBis: '2025-06-01', spBis: '2024-12-01', versicherungsnummer: 'V-AN-111', zulassungsdatum: '2020-06-10',
    aktuellGekuppeltMitLkwId: 'AT-001', status: 'Aktiv', tourStatus: 'Unterwegs',
    location: 'Berlin, DE', capacity: '34 Paletten' // Legacy
  },
   { 
    id: 'AN-002', kennzeichen: 'H-AN-222', hersteller: 'Krone', modell: 'Profi Liner', fahrgestellnummer: 'KRO456456456456456',
    baujahr: 2019, anhaengerTyp: 'Schiebeplanenauflieger', fuhrparkNummer: 'A-202',
    achsenanzahl: 3, nutzlastKg: 27500, gesamtgewichtKg: 36000, ladevolumenCbm: 90, bremsenTyp: 'Scheibe',
    tuevBis: '2025-01-01', spBis: '2025-07-01', versicherungsnummer: 'V-AN-222', zulassungsdatum: '2019-01-15',
    aktuellGekuppeltMitLkwId: undefined, status: 'In Werkstatt', tourStatus: 'Verfügbar',
    location: 'Hamburg, DE', capacity: '34 Paletten' // Legacy
  },
];


export const kpiData: Kpi[] = [
    { title: "Pünktliche Lieferungen", value: "98,2%", change: "+1,5%", changeType: "positive", description: "ggü. Vormonat" },
    { title: "Gemeldete Probleme", value: "4", change: "-2", changeType: "positive", description: "ggü. Vormonat" },
    { title: "Flottenauslastung", value: "85%", change: "+5%", changeType: "positive", description: "ggü. Vormonat" },
    { title: "Kundenzufriedenheit", value: "4,8/5", change: "+0,1", changeType: "positive", description: "ggü. Vormonat" },
];

export const weeklyDeliveriesData: ChartData[] = [
  { month: "Jan", onTime: 186, delayed: 10 },
  { month: "Feb", onTime: 305, delayed: 15 },
  { month: "Mrz", onTime: 237, delayed: 8 },
  { month: "Apr", onTime: 273, delayed: 12 },
  { month: "Mai", onTime: 209, delayed: 5 },
  { month: "Jun", onTime: 250, delayed: 7 },
];

const today = new Date();
const lastMonday = new Date();
lastMonday.setDate(today.getDate() - today.getDay() - 6);
const thisMonday = new Date();
thisMonday.setDate(today.getDate() - today.getDay() + 1);
const nextMonday = new Date();
nextMonday.setDate(today.getDate() - today.getDay() + 8);


export const transportData: Transport[] = [
  {
    id: '1',
    transportNumber: 'T-2024-001',
    customer: 'Musterfirma GmbH',
    pickupLocation: 'Lager Berlin',
    deliveryLocation: 'Kunde Hamburg',
    driver: 'Max Mustermann',
    vehicleId: 'AT-001',
    status: 'Abgeschlossen',
    plannedPickupDate: '2024-07-20T09:00:00Z',
    plannedDeliveryDate: '2024-07-20T18:00:00Z',
    actualPickupDate: '2024-07-20T09:05:00Z',
    actualDeliveryDate: '2024-07-20T17:55:00Z',
  },
  {
    id: '2',
    transportNumber: 'T-2024-002',
    customer: 'Bau AG',
    pickupLocation: 'Zentrale München',
    deliveryLocation: 'Baustelle Frankfurt',
    driver: 'Erika Musterfrau',
    vehicleId: 'AT-002',
    status: 'Abgeschlossen',
    plannedPickupDate: '2024-07-21T08:00:00Z',
    plannedDeliveryDate: '2024-07-21T14:00:00Z',
    actualPickupDate: '2024-07-21T08:15:00Z',
    actualDeliveryDate: '2024-07-21T14:30:00Z',
  },
    {
    id: '3',
    transportNumber: 'T-2024-003',
    customer: 'Musterfirma GmbH',
    pickupLocation: 'Lager Leipzig',
    deliveryLocation: 'Kunde Dresden',
    driver: 'Klaus Kleber',
    vehicleId: 'AT-003',
    status: 'Abgeschlossen',
    plannedPickupDate: '2024-07-22T10:00:00Z',
    plannedDeliveryDate: '2024-07-22T12:00:00Z',
    actualPickupDate: '2024-07-22T10:00:00Z',
    actualDeliveryDate: '2024-07-22T11:50:00Z',
  },
];

export const dieselpreiseData: Dieselpreis[] = [
    { id: '1', woche: 'KW 28', von: '2024-07-08', bis: '2024-07-14', preis: 1.65, zuschlag: 15.5 },
    { id: '2', woche: 'KW 29', von: '2024-07-15', bis: '2024-07-21', preis: 1.68, zuschlag: 16.0 },
    { id: '3', woche: 'KW 30', von: '2024-07-22', bis: '2024-07-28', preis: 1.71, zuschlag: 16.5 },
]

export const transactionData: Transaction[] = [
    { id: '1', datum: '2024-07-29', art: 'Einnahme', kategorie: 'Umsatzerlöse', beschreibung: 'Rechnung RN-000002-2024', betrag: 2500.50, waehrung: 'EUR', rechnungsId: '2', status: 'Verbucht' },
    { id: '2', datum: '2024-07-28', art: 'Ausgabe', kategorie: 'Treibstoff', beschreibung: 'Tanken B-LKW-123', betrag: 450.75, waehrung: 'EUR', belegnummer: 'B-1001', kostenstelleId: 'F-101', status: 'Verbucht' },
    { id: '3', datum: '2024-07-25', art: 'Ausgabe', kategorie: 'Maut', beschreibung: 'Mautgebühren A9', betrag: 85.40, waehrung: 'EUR', belegnummer: 'B-1002', kostenstelleId: 'F-101', status: 'Verbucht' },
    { id: '4', datum: '2024-07-30', art: 'Ausgabe', kategorie: 'Versicherung', beschreibung: 'LKW Versicherung Q3', betrag: 1200.00, waehrung: 'EUR', belegnummer: 'V-2024-Q3', status: 'Offen' },
];

export const kostenstellenData: Kostenstelle[] = [
    { id: 'ks-1', nummer: 'F-101', name: 'LKW B-LKW-123', beschreibung: 'Kosten für Fahrzeug B-LKW-123', typ: 'Fahrzeug', verantwortlicher: 'Max Mustermann' },
    { id: 'ks-2', nummer: 'F-102', name: 'LKW H-LKW-456', beschreibung: 'Kosten für Fahrzeug H-LKW-456', typ: 'Fahrzeug', verantwortlicher: 'Erika Musterfrau' },
    { id: 'ks-3', nummer: 'IT-001', name: 'IT Abteilung', beschreibung: 'Allgemeine IT-Kosten', typ: 'Abteilung', verantwortlicher: 'Admin' },
    { id: 'ks-4', nummer: 'PROJ-Alpha', name: 'Projekt Alpha', beschreibung: 'Kosten für das Projekt Alpha', typ: 'Projekt' },
];


export const documentData: Document[] = [
    { 
        id: 'doc-1', name: 'Frachtbrief_T-2024-001.pdf', type: 'Lieferschein', date: '2024-07-20', fileUrl: '#',
        zuordnung: { kategorie: 'Transportauftrag', id: '1', name: 'T-2024-001 (Musterfirma GmbH)' }
    },
    { 
        id: 'doc-2', name: 'Rechnung_RN-000001-2024.pdf', type: 'Rechnung', date: '2024-07-28', fileUrl: '#',
        zuordnung: { kategorie: 'Buchhaltung', id: '1', name: 'RN-000001-2024' }
    },
    { 
        id: 'doc-3', name: 'TÜV_Bericht_B-LKW-123.pdf', type: 'TÜV', date: '2023-08-15', fileUrl: '#',
        zuordnung: { kategorie: 'Fahrzeug', id: 'AT-001', name: 'B-LKW-123' }
    },
    { 
        id: 'doc-4', name: 'Rahmenvertrag_Musterfirma.pdf', type: 'Vertrag', date: '2022-01-01', fileUrl: '#',
        zuordnung: { kategorie: 'Kunde', id: '1', name: 'Musterfirma GmbH' }
    },
];

export const addressData: Address[] = [
    { id: '1', kurzname: 'Zentrale BER', name: 'Hauptquartier Berlin', strasse: 'Willy-Brandt-Straße 1', plz: '10557', stadt: 'Berlin', land: 'Deutschland', koordinaten: '52.518, 13.376', tourPOI: true, kundenAdresse: false, mitarbeiterAdresse: false },
    { id: '2', kurzname: 'Lager MUC', name: 'Lager München', strasse: 'Lagerstraße 5', plz: '80995', stadt: 'München', land: 'Deutschland', koordinaten: '48.177, 11.455', tourPOI: true, kundenAdresse: true, mitarbeiterAdresse: false },
    { id: '3', kurzname: 'Musterfirma', name: 'Musterfirma GmbH Zentrale', strasse: 'Musterstraße 123', plz: '12345', stadt: 'Musterstadt', land: 'Deutschland', koordinaten: '50.110, 8.682', tourPOI: true, kundenAdresse: true, mitarbeiterAdresse: false },
    { id: '4', kurzname: 'BauAG HAM', name: 'Bau AG Hamburg', strasse: 'Hammerbrookstr. 94', plz: '20097', stadt: 'Hamburg', land: 'Deutschland', koordinaten: '53.548, 10.020', tourPOI: true, kundenAdresse: true, mitarbeiterAdresse: false },
    { id: '5', kurzname: 'BauAG FRA', name: 'Bau AG Frankfurt', strasse: 'Mainzer Landstr. 176', plz: '60327', stadt: 'Frankfurt am Main', land: 'Deutschland', koordinaten: '50.108, 8.652', tourPOI: true, kundenAdresse: true, mitarbeiterAdresse: false },
];

export const countryData: Country[] = [
    { id: '1', iso_code: 'DE', kurzname: 'DE', official_country_name: 'Deutschland' },
    { id: '2', iso_code: 'AT', kurzname: 'AT', official_country_name: 'Österreich' },
    { id: '3', iso_code: 'CH', kurzname: 'CH', official_country_name: 'Schweiz' },
    { id: '4', iso_code: 'FR', kurzname: 'FR', official_country_name: 'Frankreich' },
    { id: '5', iso_code: 'IT', kurzname: 'IT', official_country_name: 'Italien' },
    { id: '6', iso_code: 'ES', kurzname: 'ES', official_country_name: 'Spanien' },
    { id: '7', iso_code: 'PL', kurzname: 'PL', official_country_name: 'Polen' },
    { id: '8', iso_code: 'NL', kurzname: 'NL', official_country_name: 'Niederlande' },
    { id: '9', iso_code: 'BE', kurzname: 'BE', official_country_name: 'Belgien' },
    { id: '10', iso_code: 'CZ', kurzname: 'CZ', official_country_name: 'Tschechien' },
];


export const tourData: Tour[] = [
    {
        id: 'tour-1',
        tourNumber: 'T-00001',
        tourDate: lastMonday.toISOString().split('T')[0],
        vehicleId: 'AT-001',
        trailerId: 'AN-001',
        driverId: 'max-mustermann',
        status: 'Geschlossen',
        stops: [
            { id: 'stop-1-1', stopSequence: 1, type: 'Pickup', addressId: '1', addressName: 'Hauptquartier Berlin', location: 'Lager Berlin', plannedDateTime: '2024-08-01T09:00:00', goodsDescription: '33 Paletten Lebensmittel', status: 'Completed', kilometers: 0 },
            { id: 'stop-1-2', stopSequence: 2, type: 'Delivery', addressId: '2', addressName: 'Lager München', location: 'Zentrallager Hamburg', plannedDateTime: '2024-08-01T15:00:00', goodsDescription: '33 Paletten Lebensmittel', status: 'Completed', kilometers: 580 }
        ],
        totalRevenue: 1200,
        totalCosts: 750,
        profitability: 450,
        customerId: '1',
        customerReference: 'PO-45001'
    },
    {
        id: 'tour-2',
        tourNumber: 'T-00002',
        tourDate: thisMonday.toISOString().split('T')[0],
        vehicleId: 'AT-002',
        trailerId: 'AN-002',
        driverId: 'erika-musterfrau',
        status: 'Geplant',
        stops: [],
        customerId: '2',
        customerReference: 'C-Ref-889',
    },
    {
        id: 'tour-3',
        tourNumber: 'T-00003',
        tourDate: thisMonday.toISOString().split('T')[0],
        vehicleId: 'AT-001',
        trailerId: 'AN-001',
        driverId: 'max-mustermann',
        status: 'Unterwegs',
        stops: [
            { id: 'stop-3-1', stopSequence: 1, type: 'Pickup', addressId: '4', addressName: 'Bau AG Hamburg', location: 'Rampe 3', plannedDateTime: '2024-08-05T10:00:00', goodsDescription: 'Baumaterial', status: 'Completed', kilometers: 0 },
            { id: 'stop-3-2', stopSequence: 2, type: 'Delivery', addressId: '5', addressName: 'Bau AG Frankfurt', location: 'Baustelle A', plannedDateTime: '2024-08-05T18:00:00', goodsDescription: 'Baumaterial', status: 'Planned', kilometers: 500 }
        ],
        totalRevenue: 2100,
        totalCosts: 1400,
        profitability: 700,
        customerId: '2',
        customerReference: 'PO-Bau-765'
    },
     {
        id: 'tour-4',
        tourNumber: 'T-00004',
        tourDate: lastMonday.toISOString().split('T')[0],
        vehicleId: 'AT-002',
        trailerId: 'AN-002',
        driverId: 'erika-musterfrau',
        status: 'Abgeschlossen',
        stops: [
            { id: 'stop-4-1', stopSequence: 1, type: 'Pickup', addressId: '2', addressName: 'Lager München', location: '', plannedDateTime: '2024-07-29T08:00:00', goodsDescription: 'Elektronik', status: 'Completed', kilometers: 0 },
            { id: 'stop-4-2', stopSequence: 2, type: 'Delivery', addressId: '3', addressName: 'Musterfirma GmbH Zentrale', location: 'Wareneingang', plannedDateTime: '2024-07-29T11:00:00', goodsDescription: 'Elektronik', status: 'Completed', kilometers: 250 }
        ],
        totalRevenue: 950,
        totalCosts: 600,
        profitability: 350,
        customerId: '1',
        customerReference: 'REF-XYZ'
    },
    {
        id: 'tour-5',
        tourNumber: 'T-00005',
        tourDate: nextMonday.toISOString().split('T')[0],
        vehicleId: 'AT-001',
        trailerId: 'AN-001',
        driverId: 'max-mustermann',
        status: 'Geplant',
        stops: [
             { id: 'stop-5-1', stopSequence: 1, type: 'Pickup', addressId: '1', addressName: 'Hauptquartier Berlin', location: 'Lager 1', plannedDateTime: '2024-08-12T09:00:00', goodsDescription: 'Konsumgüter', status: 'Planned', kilometers: 0 },
            { id: 'stop-5-2', stopSequence: 2, type: 'Delivery', addressId: '4', addressName: 'Bau AG Hamburg', location: 'Hauptlager', plannedDateTime: '2024-08-12T13:00:00', goodsDescription: 'Konsumgüter', status: 'Planned', kilometers: 280 }
        ],
        totalRevenue: 800,
        totalCosts: 500,
        profitability: 300,
        customerId: '2',
        customerReference: 'CUST-REF-123'
    },
     {
        id: 'tour-6',
        tourNumber: 'T-00006',
        tourDate: lastMonday.toISOString().split('T')[0],
        vehicleId: 'AT-001',
        trailerId: 'AN-001',
        driverId: 'max-mustermann',
        status: 'Storniert',
        stops: [
             { id: 'stop-6-1', stopSequence: 1, type: 'Pickup', addressId: '3', addressName: 'Musterfirma GmbH Zentrale', location: 'Tor 4', plannedDateTime: '2024-07-30T12:00:00', goodsDescription: 'Storniert', status: 'Planned', kilometers: 0 }
        ],
        totalRevenue: 0,
        totalCosts: 50,
        profitability: -50,
        customerId: '1',
        customerReference: 'CANCELED-01'
    }
];

    
