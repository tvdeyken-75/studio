import type { Vehicle, Kpi, ChartData, Transport } from '@/types';

export const fleetData: Vehicle[] = [
  { id: 'AT-001', type: 'LKW', location: 'Berlin, DE', status: 'Available', capacity: '24t' },
  { id: 'AT-002', type: 'LKW', location: 'Hamburg, DE', status: 'On-trip', capacity: '24t' },
  { id: 'AT-003', type: 'Transporter', location: 'München, DE', status: 'Available', capacity: '3.5t' },
  { id: 'AT-004', type: 'Sprinter', location: 'Frankfurt, DE', status: 'Maintenance', capacity: '1.5t' },
  { id: 'AT-005', type: 'LKW', location: 'Köln, DE', status: 'Available', capacity: '24t' },
  { id: 'AT-006', type: 'Transporter', location: 'Stuttgart, DE', status: 'Available', capacity: '3.5t' },
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
