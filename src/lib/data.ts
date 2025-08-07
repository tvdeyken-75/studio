

import type { Vehicle, Kpi, ChartData, Transport, Trailer, Dieselpreis, Customer } from '@/types';

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
